import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import TOML from '@iarna/toml';
import { BriskError } from './Helpers/Errors';
import Brisk from '../Brisk_Globals';
import Parser from './Parser/Parser';
import Analyzer from './Stages/Analyzer';
import Verifier from './Stages/BriskVerifier';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';
import Codegen from './codegen/Codegen';
import Linker from './Linker/Linker'; // TODO: change name after finished rewriting
// Type Imports
import BuildInfoSchema, { BuildInfoSpecVersion, BuildInfoTemplate } from '../Schemas/BuildInfo';
import { ProgramNode } from './Grammar/Types';

interface CompilerOptions {
  wat?: boolean;
  link?: boolean;
  writeFile?: boolean;
}
const defaultOptions: CompilerOptions = {
  wat: true,
  link: true
};
const compileFile = async (filename: string) => {
  // Read File
  if (!fs.existsSync(filename)) BriskError(`${filename} does not exist`);
  const filePath = path.parse(filename);
  const raw = await fs.promises.readFile(filename, 'utf-8');
  // Parse the Code
  const parsed: ProgramNode = Parser(filename, raw);
  if (parsed == undefined) BriskError('program is empty');
  // Analyze the Code
  const analyzed = Analyzer(filePath, parsed);
  // Make A List of dependency File directory's
  const deps: string[] = analyzed.imports.map((module) => path.join(filePath.dir, module.path));
  // Verify Tree
  Verifier(analyzed);
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  // TODO: handle gc
  // code generator
  const compiled = Codegen(optimized);
  // Return File
  return { analyzed: analyzed, module: compiled, deps: deps, raw: { name: filename, content: raw } };
};
const compile = async (filename: string, options: CompilerOptions) => {
  const filePath = path.parse(filename);
  const date = new Date().toDateString();
  // Generate wasm for Self
  const { analyzed, module:entry, deps, raw } = await compileFile(filename);
  // Link or return the non linked module
  if (options.link) {
    // Read Old Build Info If It Exists
    let BuildInfo: BuildInfoSchema = fs.existsSync(path.join(filePath.dir, 'BriskBuildInfo.toml')) ? <BuildInfoSchema><unknown>TOML.parse(
      await fs.promises.readFile(path.join(filePath.dir, 'BriskBuildInfo.toml'), 'utf-8')
    ) : BuildInfoTemplate;
    if (BuildInfo.SpecVersion != BuildInfoSpecVersion) BuildInfo = BuildInfoTemplate;
    // Make The File For Incremental Build
    const ProgramBuildInfo: BuildInfoSchema = {
      SpecVersion: BuildInfoSpecVersion,
      CompilerVersion: {
        CheckSum: Brisk.Checksum,
        CompiledDate: Brisk.CompileDate
      },
      LatestCompileDate: date,
      ProgramInfo: {}
    };
    // TODO: add support for deeper incremental building
    // Generate Wasm For Dependencies
    for (const dep of deps) {
      // Set Props
      const relativePath = path.relative(filePath.dir, dep);
      // Check if the file is already compiled
      if (ProgramBuildInfo.ProgramInfo[relativePath]) continue;
      if (
        BuildInfo.ProgramInfo.hasOwnProperty(relativePath) &&
        BuildInfo.CompilerVersion.CheckSum == Brisk.Checksum &&
        fs.existsSync(dep.replace(/\.[^.]+$/, '.wasm'))
      ) {
        const rawContent = crypto.createHash('md5').update(await fs.promises.readFile(dep, 'utf-8'), 'utf8').digest('hex');
        if (BuildInfo.ProgramInfo[relativePath].signature == rawContent) {
          // Add the file to the BuildInfo
          ProgramBuildInfo.ProgramInfo[relativePath] = {
            signature: BuildInfo.ProgramInfo[relativePath].signature,
            LatestCompileDate: BuildInfo.ProgramInfo[relativePath].LatestCompileDate
          };
          continue;
        }
      }
      // Otherwise We Recompile it
      const { module, raw, deps:subDebs } = await compile(dep, { ...options, link: false });
      deps.push(...subDebs);
      await fs.promises.writeFile(dep.replace(/\.[^.]+$/, '.wasm'), module.emitBinary());
      // Add the file to the BuildInfo
      ProgramBuildInfo.ProgramInfo[relativePath] = {
        signature: crypto.createHash('md5').update(raw.content, 'utf8').digest('hex'),
        LatestCompileDate: date
      };
    }
    await fs.promises.writeFile(
      path.join(filePath.dir, 'BriskBuildInfo.toml'),
      TOML.stringify(<TOML.JsonMap><unknown>ProgramBuildInfo)
    );
    // Return Linked
    return { module: Linker(<path.ParsedPath>analyzed.position.file, entry), raw: raw, deps: deps };
  } else return { module: entry, raw: raw, deps: deps };
};
const briskCompiler = async (filename: string, options: CompilerOptions) => {
  // Generate Actual Options
  const compileOptions: CompilerOptions = { ...defaultOptions, ...options };
  // Compile
  const { module } = await compile(filename, compileOptions);
  const output = compileOptions.wat ? module.emitText() : module.emitBinary();
  const outputName = filename.replace(/\.[^.]+$/, compileOptions.wat ? '.wat' : '.wasm');
  await fs.promises.writeFile(outputName, output);
  return outputName;
};
export default briskCompiler;
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import YAML from 'yaml';
import { ProgramNode } from './Grammar/Types';
import { BriskError } from './Helpers/Errors';
import Parser from './Parser/Parser';
import Analyzer from './Stages/Analyzer';
import Verifier from './Stages/BriskVerifier';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';
import Codegen from './codegen/Codegen';
import Linker from './Linker/Linker';

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
  // Generate wasm for Self
  const { analyzed, module:entry, deps, raw } = await compileFile(filename);
  // Link or return the non linked module
  if (options.link) {
    // TODO: compare incremental build data with new data when generating
    // TODO: add support for incremental building even within files, such as recompiling only a specific function instead of the entire file`
    const files: Map<string, string> = new Map();
    // Generate Wasm For Dependencies
    for (const dep of deps) {
      const { module, raw } = await compile(dep, { ...options, link: false });
      files.set(raw.name, raw.content);
      await fs.promises.writeFile(dep.replace(/\.[^.]+$/, '.wasm'), module.emitBinary());
    }
    // Make The File For Incremental Build
    const ProgramInfo: { [key: string]: { signature: string; } } = {};
    for (const [ fileName, fileContent ] of files) {
      ProgramInfo[path.relative(filePath.dir, fileName)] = {
        signature: crypto.createHash('md5').update(fileContent, 'utf8').digest('hex')
      };
    }
    await fs.promises.writeFile(path.join(filePath.dir, 'BriskBuildInfo.yaml'), YAML.stringify({
      SpecVersion: '1.0.0',
      ProgramInfo: ProgramInfo
    }));
    // Return Linked
    return { module: Linker(analyzed.position.file, entry), raw: raw };
  } else return { module: entry, raw: raw };
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
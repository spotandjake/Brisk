import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';
import binaryen from 'binaryen';
import compile from './Compiler/index';
import Linker from './Linker/Linker';
import Optimizer from './BriskIr/Optimizer';
import BuildInfoSchema, { BuildInfoTemplate, BuildInfoSpecVersion } from './Schemas/BuildInfo';
import Brisk from '../Brisk_Globals';
import { CompilerOptions } from './Types';
// Default Compiler Options
const defaultOptions: CompilerOptions = {
  wat: true,
  link: true
};
// Main Brisk Compiler Bundle
const compileProgram = async (entry: string, options: CompilerOptions) => {
  const opts = { ...defaultOptions, ...options };
  const filePath = path.parse(entry);
  // Read Old Cache
  let BuildInfo: BuildInfoSchema = fs.existsSync(path.join(filePath.dir, 'BriskBuildInfo.toml')) ? <BuildInfoSchema><unknown>TOML.parse(
    await fs.promises.readFile(path.join(filePath.dir, 'BriskBuildInfo.toml'), 'utf-8')
  ) : BuildInfoTemplate;
  if (BuildInfo.CompilerVersion.CheckSum == Brisk.Checksum) BuildInfo = BuildInfoTemplate;
  // Compile Program
  const { file, cache } = await compile(entry, BuildInfo, opts);
  let compiled = <binaryen.Module>file;
  // Write New Cache
  const date = new Date().toDateString();
  const ProgramBuildInfo: BuildInfoSchema = {
    SpecVersion: BuildInfoSpecVersion,
    CompilerVersion: {
      CheckSum: Brisk.Checksum,
      CompiledDate: Brisk.CompileDate
    },
    LatestCompileDate: date,
    ProgramInfo: {}
  };
  for (const [ key, value ] of Object.entries(cache)) {
    ProgramBuildInfo.ProgramInfo[path.relative(filePath.dir, key)] = { signature: value, LatestCompileDate: date };
  }
  // TODO: add support for deeper incremental building
  await fs.promises.writeFile(
    path.join(filePath.dir, 'BriskBuildInfo.toml'),
    TOML.stringify(<TOML.JsonMap><unknown>ProgramBuildInfo)
  );
  // Link Program
  if (opts.link) compiled = Linker(path.parse(entry), compiled);
  // Optimize Program
  const outputModule = Optimizer(compiled);
  const output = opts.wat ? outputModule.emitText() : outputModule.emitBinary();
  const outputName = entry.replace(/\.[^.]+$/, opts.wat ? '.wat' : '.wasm');
  await fs.promises.writeFile(outputName, output);
  return outputName;
};
export default compileProgram;
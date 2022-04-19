import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';
import binaryen from 'binaryen';
import compile from '../Compiler/index';
import Linker from '../Linker/Linker';
import Optimizer from '../BriskIr/Optimizer';
import BuildInfoSchema, { BuildInfoTemplate } from './Schemas/BuildInfo';
import { CompilerOptions } from './Types';
// Main Brisk Compiler Bundle
const compileProgram = async (entry: string, options: CompilerOptions) => {
  const opts = {
    wat: true,
    link: true,
    ...options
  };
  const filePath = path.parse(entry);
  const date = new Date().toDateString();
  const buildInfoPath = path.join(filePath.dir, 'BriskBuildInfo.toml');
  // Read Old Cache
  const BuildInfo = fs.existsSync(buildInfoPath) ? <BuildInfoSchema><unknown>TOML.parse(
    await fs.promises.readFile(buildInfoPath, 'utf8')
  ) : BuildInfoTemplate(date);
  // Compile Program
  const { file, cache } = await compile(entry, BuildInfo, opts);
  const compiled = opts.link ? Linker(path.parse(entry), <binaryen.Module>file) : <binaryen.Module>file;
  // Write New Cache
  const ProgramBuildInfo = BuildInfoTemplate(date);
  for (const [key, value] of Object.entries(cache)) {
    ProgramBuildInfo.ProgramInfo[path.relative(filePath.dir, key)] = { signature: value, LatestCompileDate: date };
  }
  // TODO: add support for deeper incremental building
  await fs.promises.writeFile(buildInfoPath, TOML.stringify(<TOML.JsonMap><unknown>ProgramBuildInfo));
  // Optimize Program
  const outputModule = Optimizer(compiled);
  const outputName = entry.replace(/[^.]+$/, opts.wat ? 'wat' : 'wasm');
  await fs.promises.writeFile(outputName, opts.wat ? outputModule.emitText() : outputModule.emitBinary());
  return outputName;
};
export default compileProgram;

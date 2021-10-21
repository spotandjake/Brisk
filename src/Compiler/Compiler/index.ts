import fs from 'fs';
import crypto from 'crypto';
import parse from './FrontEnd/Parser/Parser';
import Analyzer from './FrontEnd/Analyzer';
import Verifier from './FrontEnd/Correctness/Verifier';
import TypeChecker from './FrontEnd/Correctness/TypeChecker';
import Codegen from './Backend/Compiler';
import BuildInfoSchema from '../Schemas/BuildInfo';
import { BriskError } from '../Errors/Compiler';
import { CompilerOptions } from '../Types';
// Compile
const compileFile = async (entry: boolean, filename: string, cache: BuildInfoSchema, { wat }: CompilerOptions) => {
  // Check If File Exists
  if (!fs.existsSync(filename)) BriskError(`${filename} does not exist`);
  // Read File
  const source = await fs.promises.readFile(filename, 'utf8');
  // Compile File
  const parseTree = parse(filename, source);
  if (parseTree == undefined) BriskError('Your Program Is Empty');
  const analyzed = Analyzer(parseTree);
  Verifier(analyzed);
  // Compare Against Old
  const hash = crypto.createHash('md5').update(source, 'utf8').digest('hex');
  if (entry || !cache.ProgramInfo.hasOwnProperty(filename) || cache.ProgramInfo[filename].signature != hash) {
    // Compile Dependencies
    const typeChecked = TypeChecker(analyzed);
    // TODO: handle gc instructions
    const compiled = Codegen(typeChecked);
    if (!entry) {
      await fs.promises.writeFile(
        filename.replace(/\.[^.]+$/, wat ? '.wat' : '.wasm'),
        wat ? compiled.emitText() : compiled.emitBinary()
      );
    } else {
      return {
        newDeps: analyzed.imports.map((module) => module.path),
        hash: hash,
        compiled: compiled
      };
    }
  }
  return {
    newDeps: analyzed.imports.map((module) => module.path),
    hash: hash
  };
};
const compile = async (filename: string, cache: BuildInfoSchema, options: CompilerOptions) => {
  const deps: Map<string, boolean> = new Map([[filename, false]]);
  const _cache: { [key: string]: string } = {};
  let _compiled;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Determine Which File To Compile
    const dep = [...deps.entries()].find(([_, done]) => !done);
    if (dep == undefined) break;
    const fileName = dep[0];
    if (!fileName.endsWith('.wat') && !fileName.endsWith('.wasm')) {
      const { newDeps, hash, compiled } = await compileFile(fileName == filename, fileName, cache, { ...options, wat: fileName == filename ? options.wat : false });
      if (compiled) _compiled = compiled;
      _cache[fileName] = hash;
      if (options.link) newDeps.forEach((location) => { if (!deps.has(location)) deps.set(location, false); });
    }
    // Manage Dependency Compilation
    deps.set(fileName, true);
  }
  // Return New List Of File Hashes
  return { file: _compiled, cache: _cache };
};
export default compile;
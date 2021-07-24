import * as fs from 'fs';
import ParseFile from './parseFile';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';
import Codegen from './codegen/Codegen';
import Linker from './Linker/Linker';

const briskCompiler = async (filename: string, writeFile: boolean, wat: boolean) => {
  const analyzed = ParseFile(filename);
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  // handle gc
  // code generator
  const compiled = Codegen(optimized);
  // Linking
  // TODO: make sure to compile dependency's to wasm before linking
  const linked = Linker(analyzed.position.file, compiled);
  await fs.promises.writeFile(filename.replace(/\.[^.]+$/, '.wat'), linked.emitText());
  // Output File
  const output = wat ? compiled.emitText() : compiled.emitBinary();
  // await fs.promises.writeFile(filename.replace(/\.[^.]+$/, '.wasm'), compiled.emitBinary());
  if (writeFile) await fs.promises.writeFile(filename.replace(/\.[^.]+$/, '.wat'), output);
  else return output;
};
export default briskCompiler;
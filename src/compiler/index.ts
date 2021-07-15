import * as fs from 'fs';
import ParseFile from './parseFile';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';
import Codegen from './codegen/Codegen';

const briskCompiler = async (filename: string, writeFile: boolean, wat: boolean) => {
  const analyzed = ParseFile(filename, true, new Map());
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  // console.dir(optimized, { depth: null });
  // handle gc
  // code generator
  const compiled = Codegen(optimized, wat);
  // Output File
  // console.log(compiled);
  // console.dir(compiled, { depth: null });
  if (writeFile) await fs.promises.writeFile(filename.replace(/\.[^.]+$/, '.wat'), compiled);
  else return compiled;
};
export default briskCompiler;
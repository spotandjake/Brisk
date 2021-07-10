import ParseFile from './parseFile';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';
import Codegen from './codegen/Codegen';

// import Compiler from './compiler';

const briskCompiler = (filename: string) => {
  const analyzed = ParseFile(filename, true, new Map());
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  // console.dir(optimized, { depth: null });
  // handle gc
  // code generator
  const compiled = Codegen(optimized);
  // Output File
  console.log(compiled);
  // console.dir(compiled, { depth: null });
  // await fs.promises.writeFile(filename.replace(/\.[^\.]+$/, '.wat'), compiled);
};
export default briskCompiler;
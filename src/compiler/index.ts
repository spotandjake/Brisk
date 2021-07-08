import ParseFile from './parseFile';
import TypeChecker from './Stages/BriskTypeChecker';
import Optimizer from './Stages/Optimizer';

// import Compiler from './compiler';

const briskCompiler = (filename: string) => {
  const analyzed = ParseFile(filename, new Map());
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  // console.dir(optimized, { depth: null });
  // // handle gc
  // // compile
  // let compiled = compiler.compile(optimized);
  // // Output File
  // // console.dir(compiled, { depth: null });
  // await fs.promises.writeFile(filename.replace(/\.[^\.]+$/, '.wat'), compiled);
};
export default briskCompiler;
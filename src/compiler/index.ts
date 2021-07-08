// Import needed files
import * as fs from 'fs';
import * as path from 'path';
// Import Components
import Parser from './Parser/Parser';
import Analyzer from './Stages/Analyzer';
import TypeChecker from './Stages/BriskTypeChecker';
import Verifier from './Stages/BriskVerifier';
import Optimizer from './Stages/Optimizer';

// import Compiler from './compiler';
export const ParseFile = async (filename: string) => {
  // Check if file exists
  const exists: boolean = fs.existsSync(filename);
  if (!exists) throw new Error(`${filename} does not exist`);
  // Determine info on the program
  const ProgramPath = path.parse(filename);
  // Read File
  const code: string = await fs.promises.readFile(filename, 'utf-8');
  // Parse the Code
  const parsed = Parser(filename, code);
  // Analyze the Code
  const analyzed = Analyzer(ProgramPath, parsed);
  // Perform Module Linking
  return [ analyzed ];
};
const briskCompiler = async (filename: string) => {
  const [ analyzed ] = await ParseFile(filename);
  // Perform Type Checking
  const typeChecked = TypeChecker(analyzed);
  // Perform Simple Program Verification
  Verifier(typeChecked);
  // Perform Well Formed Check
  const optimized = Optimizer(typeChecked);
  console.dir(optimized, { depth: null });
  // // handle gc
  // // compile
  // let compiled = compiler.compile(optimized);
  // // Output File
  // // console.dir(compiled, { depth: null });
  // await fs.promises.writeFile(filename.replace(/\.[^\.]+$/, '.wat'), compiled);
};
export default briskCompiler;
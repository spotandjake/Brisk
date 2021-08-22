import fs from 'fs';
import parse from './FrontEnd/Parser/Parser';
import { CompilerOptions } from '../Types';
// Compile
const compile = async (filename: string, options: CompilerOptions) => {
  // Read File
  const source = await fs.promises.readFile(filename, 'utf8');
  // Compile File
  const ast = parse(filename, source);
  // Compile Dependencies
  console.log('Compiling using v2');
};
export default compile;
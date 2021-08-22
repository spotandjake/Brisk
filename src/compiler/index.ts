import compile from './Compiler/index';
import { CompilerOptions } from './Types';
// Default Compiler Options
const defaultOptions: CompilerOptions = {
  wat: true,
  link: true
};
// Main Brisk Compiler Bundle
const compileProgram = async (entry: string, options: CompilerOptions) => {
  const opts = { ...defaultOptions, ...options };
  // Compile Program
  await compile(entry, opts);
  // Link Program
  // Optimize Program
};
export default compileProgram;
import lex from './Lexer/index';
// The Compiler Entry
const compile = (program: string, file: string) => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(program, file);
  // 2. Parse
  // 3. Analyze ParseTree
  // 4. Type Check
  // 5. Generate Code
  // 6. Return Code
  return lexed;
};

export default compile;
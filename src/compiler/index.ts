import lex from './Lexer/index';
import parse from './Parser/index';
// The Compiler Entry
const compile = (program: string, file: string) => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(program);
  // 2. Parse
  const parsed = parse(lexed, file);
  // 3. Analyze ParseTree
  // 4. Type Check
  // 5. Generate Code
  // 6. Return Code
  return parsed;
};

export default compile;
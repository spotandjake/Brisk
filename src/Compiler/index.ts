import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
// import typeCheck from './TypeChecker/index';
// The Compiler Entry
const compile = (program: string, file: string) => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(program, file);
  // 2. Parse
  const parsed = parse(lexed, program, file);
  // 3. Analyze ParseTree
  const analyzed = analyze(program, parsed);
  // 4. Type Check
  // TODO: Rewrite Type Checker
  // typeCheck(analyzed, program);
  // 5. Generate Code
  // 6. Return Code
  return analyzed;
};

export default compile;

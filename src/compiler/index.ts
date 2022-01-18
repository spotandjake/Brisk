import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
import typeCheck from './TypeChecker/index';
// The Compiler Entry
const compile = (program: string, file: string) => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(program);
  // 2. Parse
  const parsed = parse(lexed, file);
  if (parsed == undefined) {
    // console.log(lexed);
    throw new Error('Parsed was undefined');
  }
  // 3. Analyze ParseTree
  const analyzed = analyze(parsed);
  // 4. Type Check
  typeCheck(analyzed, program);
  // 5. Generate Code
  // 6. Return Code
  return analyzed;
};

export default compile;
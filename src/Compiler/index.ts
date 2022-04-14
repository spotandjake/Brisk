import { ExportList } from './Types/Types';
import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
import { BriskError } from './Errors/Compiler';
import { BriskErrorType } from './Errors/Errors';
// import typeCheck from './TypeChecker/index';
// The Compiler Entry
const compile = async (
  program: string,
  filePath: string,
  fileCompiler?: (filePath: string) => Promise<ExportList>
) => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(program, filePath);
  // 2. Parse
  const parsed = parse(lexed, program, filePath);
  // 3. Analyze ParseTree
  const analyzed = analyze(program, parsed);
  // 4. Handle Compilation Of Other Files
  for (const [ variableName, sourceInfo ] of analyzed.data._imports) {
    if (fileCompiler) {
      // Compile File
      fileCompiler(sourceInfo.path);
      // TODO: Handle Export Map
    } else {
      BriskError(program, BriskErrorType.ImportNotSupported, [], sourceInfo.position)
    }
  }
  // 5. Type Check
  // TODO: Rewrite Type Checker
  // typeCheck(analyzed, program);
  // 6. Generate Code
  // 7. Make Export List
  const exports: ExportList = new Map();
  // 7. Return Code
  return {
    // output: '',
    output: analyzed,
    exports: exports
  };
};

export default compile;

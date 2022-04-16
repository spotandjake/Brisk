import { ExportList } from './Types/Types';
import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
import typeCheck from './TypeChecker/index';
import { BriskError } from './Errors/Compiler';
import { BriskErrorType } from './Errors/Errors';
// The Compiler Entry
const compile = async (
  rawProgram: string,
  filePath: string,
  fileCompiler?: (filePath: string) => Promise<{ output: string; exports: ExportList }>
): Promise<{ output: string; exports: ExportList }> => {
  // Compilation Steps
  // 1. Lex
  const lexed = lex(rawProgram, filePath);
  // 2. Parse
  const parsed = parse(lexed, rawProgram, filePath);
  // 3. Analyze ParseTree
  const analyzed = analyze(rawProgram, parsed);
  // 4. Handle Compilation Of Other Files
  for (const sourceInfo of analyzed.data._imports.values()) {
    if (fileCompiler) {
      // Compile File
      fileCompiler(sourceInfo.path);
      // TODO: Handle Export Map
    } else {
      BriskError(rawProgram, BriskErrorType.ImportNotSupported, [], sourceInfo.position);
    }
  }
  // 5. Type Check
  // TODO: Rewrite Type Checker
  const typeChecked = typeCheck(rawProgram, analyzed);
  // 6. Generate Code
  // 7. Make Export List
  const exports: ExportList = new Map();
  // 7. Return Code
  return {
    // output: '',
    // TODO: remove This Ignore
    //@ts-ignore
    output: analyzed,
    exports: exports,
  };
};

export default compile;

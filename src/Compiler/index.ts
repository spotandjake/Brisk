import { ExportList } from './Types/Types';
import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
import typeCheck from './TypeChecker/index';
import generateCode from './Codegen/index';
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
  const importData: Map<string, ExportList> = new Map();
  for (const sourceInfo of analyzed.data._imports.values()) {
    if (fileCompiler) {
      // Compile File
      const { exports } = await fileCompiler(sourceInfo.path);
      // Set Export Map
      importData.set(sourceInfo.path, exports);
    } else {
      BriskError(rawProgram, BriskErrorType.ImportNotSupported, [], sourceInfo.position);
    }
  }
  // 5. Type Check
  const typeChecked = typeCheck(rawProgram, analyzed, importData);
  // 6. Generate Code
  const generatedCode = generateCode(rawProgram, typeChecked);
  // 7. Make Export List
  const exports: ExportList = new Map();
  // 7. Return Code
  return {
    // output: '',
    // TODO: remove This Ignore
    //@ts-ignore
    output: generatedCode,
    exports: exports,
  };
};

export default compile;

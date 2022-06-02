import lex from './Lexer/index';
import parse from './Parser/index';
import analyze from './Analyzer/index';
import typeCheck from './TypeChecker/index';
import generateCode from './Codegen/index';
import { ExportMap } from './Types/AnalyzerNodes';
import { BriskError } from './Errors/Compiler';
import { BriskErrorType } from './Errors/Errors';
// The Compiler Entry
const compile = async (
  rawProgram: string,
  basePath: string,
  filePath: string,
  fileCompiler?: (
    basePath: string,
    filePath: string
  ) => Promise<{ output: Uint8Array; exports: ExportMap; compiledPath: string }>
): Promise<{ output: Uint8Array; exports: ExportMap }> => {
  // Compilation Steps
  // TODO: Try To Read The Wasm File
  // 1. Lex
  const lexed = lex(rawProgram, basePath, filePath);
  // 2. Parse
  const parsed = parse(lexed, rawProgram, basePath, filePath);
  // 3. Analyze ParseTree
  const analyzed = analyze(rawProgram, parsed);
  // 4. Handle Compilation Of Other Files
  const importData: Map<string, ExportMap> = new Map();
  for (const sourceInfo of analyzed.data._imports.values()) {
    if (fileCompiler) {
      // Compile File
      const { exports } = await fileCompiler(basePath, sourceInfo.path);
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
  // 7. Return Code
  return {
    // output: '',
    // TODO: remove This Ignore
    output: generatedCode,
    exports: typeChecked.data._exports,
  };
};

export default compile;

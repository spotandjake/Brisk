import { IParserErrorMessageProvider } from 'chevrotain';
import { BriskParseError } from '../Errors/Compiler';
const errorHandler = (file: string): IParserErrorMessageProvider => {
  // TODO: Error Number and better errors
  return {
    buildMismatchTokenMessage: ({ actual, expected }) => {
      BriskParseError(`Failed to Parse Found: \`${actual.tokenType.LABEL}\`, Expected \`${expected.LABEL}\``, {
        offset: actual.startOffset,
        line: actual.startLine || 0,
        col: actual.startColumn || 0,
        file: file
      });
      return '';
    },
    buildNotAllInputParsedMessage: ({ firstRedundant }) => {
      BriskParseError(`\x1b[31m\x1b[1merror[]\x1b[0m: Failed To Parse Input Invalid Token \`${firstRedundant.image}\``, {
        offset: firstRedundant.startOffset,
        line: firstRedundant.startLine || 0,
        col: firstRedundant.startColumn || 0,
        file: file
      });
      return '';
    },
    buildNoViableAltMessage: ({ actual, previous, ruleName }) => {
      BriskParseError(`Failed to Parse Found: \`${actual[0].image}\`, Expected \`${ruleName}\``, {
        offset: previous.endOffset || 0,
        line: previous.endLine || 0,
        col: previous.endColumn || 0,
        file: file
      });
      return '';
    },
    buildEarlyExitMessage: ({ previous }) => {
      BriskParseError('BuildEarlyExitMessage, Please Contact The Developer', {
        offset: previous.endOffset || 0,
        line: previous.endLine || 0,
        col: previous.endColumn || 0,
        file: file
      });
      return '';
    }
  };
};
export default errorHandler;
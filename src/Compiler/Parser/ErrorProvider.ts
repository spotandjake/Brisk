import { IParserErrorMessageProvider } from 'chevrotain';
import { BriskParseError } from '../Errors/Compiler';
const errorHandler = (file: string): IParserErrorMessageProvider => {
  // TODO: Error Number and better errors
  return {
    buildMismatchTokenMessage: (options) => {
      BriskParseError(`Failed to Parse Found: \`${options.actual.tokenType.LABEL}\`, Expected \`${options.expected.LABEL}\``, {
        offset: options.actual.startOffset,
        line: options.actual.startLine || 0,
        col: options.actual.startColumn || 0,
        file: file
      });
      return '';
    },
    buildNotAllInputParsedMessage: (options) => {
      BriskParseError(`\x1b[31m\x1b[1merror[]\x1b[0m: Failed To Parse Input Invalid Token \`${options.firstRedundant.image}\``, {
        offset: options.firstRedundant.startOffset,
        line: options.firstRedundant.startLine || 0,
        col: options.firstRedundant.startColumn || 0,
        file: file
      });
      return '';
    },
    buildNoViableAltMessage: (options) => {
      BriskParseError(`Failed to Parse Found: \`${options.actual[0].image}\`, Expected \`${options.ruleName}\``, {
        offset: options.previous.endOffset || 0,
        line: options.previous.endLine || 0,
        col: options.previous.endColumn || 0,
        file: file
      });
      return '';
    },
    buildEarlyExitMessage: (options) => {
      // TODO: implement these
      console.log('buildEarlyExitMessage Please Contact the Developer');
      process.exit();
      return `Early Exit: ${options.expectedIterationPaths[0][0].name}`;
    }
  };
};
export default errorHandler;
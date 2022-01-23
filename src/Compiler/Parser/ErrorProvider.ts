import { IParserErrorMessageProvider, TokenType } from 'chevrotain';
import { BriskParseError } from '../Errors/Compiler';
const errorHandler = (file: string): IParserErrorMessageProvider => {
  // TODO: Error Number and better errors
  return {
    buildMismatchTokenMessage: ({ actual, expected, ruleName }) => {
      BriskParseError(
        `Failed to Parse Found: \`${actual.tokenType.LABEL}\`, Expected \`${expected.LABEL}\``,
        {
          offset: actual.startOffset,
          length: <number>actual.endOffset - actual.startOffset,
          line: actual.startLine || 0,
          col: actual.startColumn || 0,
          file: file,
        }
      );
      return '';
    },
    buildNotAllInputParsedMessage: ({
      firstRedundant: { image, endOffset, startOffset, startLine, startColumn },
    }) => {
      BriskParseError(
        `\x1b[31m\x1b[1merror[]\x1b[0m: Failed To Parse Input Invalid Token \`${image}\``,
        {
          offset: startOffset,
          length: <number>endOffset - startOffset,
          line: startLine || 0,
          col: startColumn || 0,
          file: file,
        }
      );
      return '';
    },
    buildNoViableAltMessage: ({ actual, previous, ruleName }) => {
      BriskParseError(`Failed to Parse Found: \`${actual[0].image}\`, Expected \`${ruleName}\``, {
        offset: previous.endOffset || 0,
        length: 0,
        line: previous.endLine || 0,
        col: previous.endColumn || 0,
        file: file,
      });
      return '';
    },
    buildEarlyExitMessage: ({ previous, actual, expectedIterationPaths }) => {
      const mapExpected = (tokens: TokenType[][]): string => {
        return tokens
          .map((tokenPath, i) => {
            return tokenPath.map((token) => `\`${token.name}\``).join(', ');
          })
          .join(', ');
      };
      BriskParseError(
        `Failed To Parse Found: \`${actual[0].image}\`, Expected one of ${mapExpected(
          expectedIterationPaths
        )}`,
        {
          offset: previous.endOffset || 0,
          length: 0,
          line: previous.endLine || 0,
          col: previous.endColumn || 0,
          file: file,
        }
      );
      return '';
    },
  };
};
export default errorHandler;

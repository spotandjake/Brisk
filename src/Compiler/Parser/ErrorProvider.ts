import { IParserErrorMessageProvider, TokenType } from 'chevrotain';
const errorHandler = (): IParserErrorMessageProvider => {
  return {
    buildMismatchTokenMessage: ({ actual, expected }) => {
      return `Failed to Parse Found: \`${actual.tokenType.LABEL}\`, Expected \`${expected.LABEL}\``;
    },
    buildNotAllInputParsedMessage: ({ firstRedundant: { image } }) => {
      return `\x1b[31m\x1b[1merror[]\x1b[0m: Failed To Parse Input Invalid Token \`${image}\``;
    },
    buildNoViableAltMessage: ({ actual, ruleName }) => {
      return `Failed to Parse Found: \`${actual[0].image}\`, Expected \`${ruleName}\``;
    },
    buildEarlyExitMessage: ({ actual, expectedIterationPaths }) => {
      const mapExpected = (tokens: TokenType[][]): string => {
        return tokens
          .map((tokenPath) => {
            return tokenPath.map((token) => `\`${token.name}\``).join(', ');
          })
          .join(', ');
      };
      return `Failed To Parse Found: \`${actual[0].image}\`, Expected one of ${mapExpected(
        expectedIterationPaths
      )}`;
    },
  };
};
export default errorHandler;

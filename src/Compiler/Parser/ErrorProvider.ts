import { IParserErrorMessageProvider, defaultParserErrorProvider } from 'chevrotain';
const errorProvider: IParserErrorMessageProvider = {
  buildMismatchTokenMessage: ({ expected, actual }) => {
    // TODO: Error Numbers, Better Formatting
    return `\x1b[31m\x1b[1merror[]\x1b[0m: expected ${expected.LABEL || expected.name}, found ${actual.tokenType.LABEL || actual.tokenType.name}`;
  },
  buildNotAllInputParsedMessage: (options) => {
    // TODO: implement these
    console.log(options);
    console.log('buildNotAllInputParsedMessage');
    return `very bad dog! you still have some input remaining at offset:${options.firstRedundant.startOffset}`;
  },
  buildNoViableAltMessage: (options) => {
    // TODO: implement these
    console.log(options);
    console.log('buildNoViableAltMessage');
    // defer to the default implementation for `buildNoViableAltMessage`
    return defaultParserErrorProvider.buildNoViableAltMessage(options);
  },
  buildEarlyExitMessage: (options) => {
    // TODO: implement these
    console.log(options);
    console.log('buildEarlyExitMessage');
    return `Early Exit: ${options.expectedIterationPaths[0][0].name}`;
  }
};
export default errorProvider;
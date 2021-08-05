import nearley from 'nearley';
import grammar from '../Grammar/Brisk';
import { BriskParseError } from '../Helpers/Errors';

const Parser = (filename: string, code: string, lsp = false) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true });
  try {
    parser.feed(code);
    return parser.results[0];
  } catch (err: any) {
    if (!lsp) {
      BriskParseError(err);
      process.exit(1);
    }
  }
};
export default Parser;
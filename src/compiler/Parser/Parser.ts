import nearley from 'nearley';
import grammar from '../Grammar/Brisk';

const Parser = (filename: string, code: string, lsp = false) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true });
  try {
    parser.feed(code);
    return parser.results[0];
  } catch (err: any) {
    try {
      if (!lsp) console.log(err);
      if (!lsp) console.log('================================================================');
      if (!lsp) process.exit(1);
    } catch (e) {
      if (!lsp) console.log(err);
      if (!lsp) process.exit(1);
    }
  }
};
export default Parser;
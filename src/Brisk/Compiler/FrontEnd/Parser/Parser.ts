// TODO: replace nearley with a custom solution or maybe glush
import Lexer from '../Lexer/Lexer';
import nearley from 'nearley';
import grammar from './Brisk';
import { BriskParseError } from '../../../Errors/Compiler';

const Parser = (file: string, code: string) => {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar),
    {
      keepHistory: true,
      //@ts-ignore
      lexer: new Lexer(file)
    }
  );
  try {
    parser.feed(code);
    return parser.results[0];
  } catch (err: any) {
    BriskParseError(err);
    process.exit(1);
  }
};
export default Parser;
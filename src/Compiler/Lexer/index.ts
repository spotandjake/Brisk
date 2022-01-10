// Imports
import { Lexer } from 'chevrotain';
import { Tokens, TknComment } from './Tokens';
// =================================================================
// Lex code
const lex = (code: string) => {
  const tokenized = new Lexer(Tokens, { ensureOptimizations: true }).tokenize(code);
  tokenized.tokens = tokenized.tokens.filter(token => token.tokenType != TknComment);
  return tokenized;
};
// =================================================================
export default lex;
// Imports
import { Lexer } from 'chevrotain';
import { Tokens, TknComment } from './Tokens';
// =================================================================
// Lex code
const lex = (code: string) => {
  const tokenized = new Lexer(Tokens, { ensureOptimizations: true }).tokenize(code);
  // TODO: if we didnt have to filter these comments out then the compiler could deal with them allowing things to be easier in the future.
  tokenized.tokens = tokenized.tokens.filter(token => token.tokenType != TknComment);
  return tokenized;
};
// =================================================================
export default lex;
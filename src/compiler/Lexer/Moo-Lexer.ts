import Tokens from './Tokens';
import * as moo from 'moo';
// Import Types
import { MooRules } from './Types';

const Lexer = () => {
  const mooTokens: MooRules = {};
  Tokens.forEach(({ id, match, lineBreaks, value }) => {
    mooTokens[`Token_${id}`] = { match, lineBreaks, value };
  });
  //@ts-ignore
  return moo.compile(mooTokens);
};
export default Lexer;
// Imports
import { Lexer } from 'chevrotain';
import { Tokens } from './Tokens';
import { BriskParseError } from '../Errors/Compiler';
//@ts-ignore
import { __DEBUG__ } from '@brisk/config';
// =================================================================
// Lex code
const lex = (code: string, file: string) => {
  const tokenized = new Lexer(Tokens, {
    ensureOptimizations: true,
    skipValidations: !__DEBUG__,
  }).tokenize(code);
  if (tokenized.groups.hasOwnProperty('Reserved') && tokenized.groups.Reserved.length != 0)
    BriskParseError(`Cannot Use Reserved Keyword \`${tokenized.groups.Reserved[0].image}\``, {
      offset: tokenized.groups.Reserved[0].startOffset,
      length: tokenized.groups.Reserved[0].image.length,
      line: tokenized.groups.Reserved[0].startLine || 0,
      col: tokenized.groups.Reserved[0].startColumn || 0,
      file: file,
    });
  return tokenized;
};
// =================================================================
export default lex;

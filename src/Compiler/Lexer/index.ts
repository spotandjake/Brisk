// Imports
import { Lexer } from 'chevrotain';
import { Tokens } from './Tokens';
import { BriskCustomError, BriskSyntaxError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
//@ts-ignore
import { __DEBUG__ } from '@brisk/config';
// =================================================================
// Lex code
const lex = (code: string, basePath: string, file: string) => {
  const tokenized = new Lexer(Tokens, {
    ensureOptimizations: true,
    skipValidations: !__DEBUG__,
  }).tokenize(code);
  if (tokenized.groups.hasOwnProperty('Reserved') && tokenized.groups.Reserved.length != 0)
    BriskSyntaxError(
      code,
      BriskErrorType.CannotUseReservedKeyword,
      [tokenized.groups.Reserved[0].image],
      {
        offset: tokenized.groups.Reserved[0].startOffset,
        length: tokenized.groups.Reserved[0].image.length,
        line: tokenized.groups.Reserved[0].startLine || 0,
        col: tokenized.groups.Reserved[0].startColumn || 0,
        basePath: basePath,
        file: file,
      }
    );
  if (tokenized.errors.length > 0) {
    const { offset, line, column, length, message } = tokenized.errors[0];
    const position = {
      offset: offset,
      length: length,
      line: line || 0,
      col: column || 0,
      basePath: basePath,
      file: file,
    };
    BriskCustomError(code, 'Syntax', message, position);
  }
  return tokenized;
};
// =================================================================
export default lex;

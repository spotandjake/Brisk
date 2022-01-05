// Imports
import { Position } from '../Types/Types';
// Types
const enum LexemeType {
  keyword,
  separator,
  operator,
  literal,
  flag,
  comment,
  identifier
}
interface Lexeme {
  type: LexemeType;
  id: string;
  value?: (text: string) => string | number;
  match: RegExp;
  lineBreaks?: boolean;
}
interface Token {
  type: string;
  value: string | number;
  text: string;
  position: Position;
}
// Exports
export {
  LexemeType,
  Lexeme,
  Token
}
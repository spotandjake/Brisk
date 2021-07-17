import * as path from 'path';
export interface Position {
  offset: number;
  line: number;
  col: number;
}
const _BriskError = (type: string, message: string, file: path.ParsedPath, position: Position): void => {
  console.log(`\x1b[31m\x1b[1m${type}: ${message}`);
  console.log(`at ${path.join(file.dir, file.base)}:${position.line}:${position.col}\x1b[0m`);
  process.exit(1);
};
export const BriskError = (msg: string, file: path.ParsedPath, pos: Position): void => {
  _BriskError('Error', msg, file, pos);
};
export const BriskSyntaxError = (msg: string, file: path.ParsedPath, pos: Position): void => {
  _BriskError('SyntaxError', msg, file, pos);
};
export const BriskReferenceError = (msg: string, file: path.ParsedPath, pos: Position): void => {
  _BriskError('ReferenceError', msg, file, pos);
};
export const BriskTypeError = (msg: string, file: path.ParsedPath, pos: Position): void => {
  _BriskError('TypeError', msg, file, pos);
};
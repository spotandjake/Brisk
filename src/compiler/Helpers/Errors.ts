import * as path from 'path';
import { Position } from '../Grammar/Types';

const _BriskError = (type: string, message: string, pos?: Position): void => {
  console.log(`\x1b[31m\x1b[1m${type}: ${message}\x1b[0m`);
  if (pos)
    console.log(`\x1b[31m\x1b[1mat ${path.join((pos.file as path.ParsedPath).dir, (pos.file as path.ParsedPath).base)}:${pos.line}:${pos.col}\x1b[0m`);
  process.exit(1);
};
export const BriskError = (msg: string, pos?: Position): void => _BriskError('Error', msg, pos);
export const BriskSyntaxError = (msg: string, pos?: Position): void => _BriskError('SyntaxError', msg, pos);
export const BriskReferenceError = (msg: string, pos?: Position): void => _BriskError('ReferenceError', msg, pos);
export const BriskTypeError = (msg: string, pos?: Position): void => _BriskError('TypeError', msg, pos);
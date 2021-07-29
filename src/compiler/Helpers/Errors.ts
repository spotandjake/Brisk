import path from 'path';
import { Position } from '../Grammar/Types';

const _BriskError = (type: string, message: string, pos?: Position, exit = true): void => {
  const color = exit ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}\x1b[1m${type}: ${message}\x1b[0m`);
  if (pos)
    console.log(`${color}\x1b[1mat ${path.join((pos.file as path.ParsedPath).dir, (pos.file as path.ParsedPath).base)}:${pos.line}:${pos.col}\x1b[0m`);
  if (exit) process.exit(1);
};
// TODO: add error codes and information for fixing
export const BriskError = (msg: string, pos?: Position, exit = true): void => _BriskError('Error', msg, pos, exit);
export const BriskSyntaxError = (msg: string, pos?: Position, exit = true): void => _BriskError('SyntaxError', msg, pos, exit);
export const BriskReferenceError = (msg: string, pos?: Position, exit = true): void => _BriskError('ReferenceError', msg, pos, exit);
export const BriskTypeError = (msg: string, pos?: Position, exit = true): void => _BriskError('TypeError', msg, pos, exit);
export const BriskParseError = (msg: string, pos?: Position, exit = true): void => _BriskError('ParseError', msg, pos, exit);
export const BriskLinkerError = (msg: string, pos?: Position, exit = true): void => _BriskError('LinkerError', msg, pos, exit);
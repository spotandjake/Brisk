import _BriskError from './index';
import { Position } from '../Types/Types';
// TODO: add error codes and information for fixing
export const BriskError = (msg: string, pos?: Position, exit = true): void =>
  _BriskError('Error', msg, pos, exit);
export const BriskSyntaxError = (msg: string, pos?: Position, exit = true): void =>
  _BriskError('SyntaxError', msg, pos, exit);
export const BriskReferenceError = (msg: string, pos?: Position, exit = true): void =>
  _BriskError('ReferenceError', msg, pos, exit);
export const BriskTypeError = (msg: string, pos?: Position, exit = true): void =>
  _BriskError('TypeError', msg, pos, exit);
export const BriskParseError = (msg: string, pos?: Position, exit = true): void =>
  _BriskError('ParseError', msg, pos, exit);

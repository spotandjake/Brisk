import _BriskError, { _BriskCustomError } from './index';
import { Position } from '../Types/Types';
import { BriskErrorType } from './Errors';
type ErrCode = BriskErrorType;
type Pos = Position;
const BriskCustomError = (code: string, type: string, msg: string, pos?: Pos, exit = true) =>
  _BriskCustomError(code, `${type}: ${msg}`, pos, exit);
const BriskError = (code: string, err: ErrCode, eParams: string[], pos: Pos, exit = true) =>
  _BriskError(code, 'Error', err, eParams, pos, exit);
const BriskSyntaxError = (code: string, err: ErrCode, eParams: string[], pos: Pos, exit = true) =>
  _BriskError(code, 'SyntaxError', err, eParams, pos, exit);
const BriskReferenceError = (code: string, e: ErrCode, eParams: string[], pos: Pos, exit = true) =>
  _BriskError(code, 'ReferenceError', e, eParams, pos, exit);
const BriskTypeError = (code: string, err: ErrCode, eParams: string[], pos: Pos, exit = true) =>
  _BriskError(code, 'TypeError', err, eParams, pos, exit);
const BriskParseError = (code: string, err: ErrCode, eParams: string[], pos: Pos, exit = true) =>
  _BriskError(code, 'ParseError', err, eParams, pos, exit);
// Exports
export {
  BriskCustomError,
  BriskError,
  BriskSyntaxError,
  BriskReferenceError,
  BriskTypeError,
  BriskParseError,
};

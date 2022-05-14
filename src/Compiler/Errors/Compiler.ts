import _BriskError, { _BriskCustomError } from './index';
import { Position } from '../Types/Types';
import { BriskErrorType } from './Errors';
type ErrCode = BriskErrorType;
type Pos = Position;
const BriskCustomError = (code: string, type: string, msg: string, pos?: Pos) =>
  _BriskCustomError(code, `${type}: ${msg}`, pos);
const BriskError = (code: string, err: ErrCode, eParams: string[], pos: Pos) =>
  _BriskError(code, 'Error', err, eParams, pos);
const BriskSyntaxError = (code: string, err: ErrCode, eParams: string[], pos: Pos) =>
  _BriskError(code, 'SyntaxError', err, eParams, pos);
const BriskReferenceError = (code: string, e: ErrCode, eParams: string[], pos: Pos) =>
  _BriskError(code, 'ReferenceError', e, eParams, pos);
const BriskTypeError = (code: string, err: ErrCode, eParams: string[], pos: Pos): never =>
  _BriskError(code, 'TypeError', err, eParams, pos);
const BriskParseError = (code: string, err: ErrCode, eParams: string[], pos: Pos) =>
  _BriskError(code, 'ParseError', err, eParams, pos);
// Exports
export {
  BriskCustomError,
  BriskError,
  BriskSyntaxError,
  BriskReferenceError,
  BriskTypeError,
  BriskParseError,
};

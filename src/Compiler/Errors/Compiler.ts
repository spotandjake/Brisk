import _BriskError, { _BriskCustomError } from './index';
import { Position } from '../Types/Types';
import { BriskErrorType } from './Errors';
// TODO: add information for fixing
export const BriskCustomError = (code: string, type: string, msg: string, pos?: Position, exit = true) =>
  _BriskCustomError(code, `${type}: ${msg}`, pos, exit);
export const BriskError = (code: string, errCode: BriskErrorType, errParams: string[], pos?: Position, exit = true): void =>
  _BriskError(code, 'Error', errCode, errParams, pos, exit);
export const BriskSyntaxError = (code: string, errCode: BriskErrorType, errParams: string[], pos?: Position, exit = true): void =>
  _BriskError(code, 'SyntaxError', errCode, errParams, pos, exit);
export const BriskReferenceError = (code: string, errCode: BriskErrorType, errParams: string[], pos?: Position, exit = true): void =>
  _BriskError(code, 'ReferenceError', errCode, errParams, pos, exit);
export const BriskTypeError = (code: string, errCode: BriskErrorType, errParams: string[], pos?: Position, exit = true): void =>
  _BriskError(code, 'TypeError', errCode, errParams, pos, exit);
export const BriskParseError = (code: string, errCode: BriskErrorType, errParams: string[], pos?: Position, exit = true): void =>
  _BriskError(code, 'ParseError', errCode, errParams, pos, exit);

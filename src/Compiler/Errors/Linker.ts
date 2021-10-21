import _BriskError from './index';
import { Position } from '../Types';
// TODO: add error codes and information for fixing
export const BriskLinkerError = (msg: string, pos?: Position, exit = true): void => _BriskError('LinkerError', msg, pos, exit);
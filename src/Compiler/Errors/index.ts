import { Position } from '../Types/Types';
import { prettyError } from './ErrorBuilder';
import { BriskErrorType, BriskErrorMessage } from './Errors';

export const _BriskCustomError = (code: string, msg: string, pos?: Position, exit = true): void => {
  // Build Pretty Errror
  const errorMessage = pos ? prettyError(code, msg, pos) : msg;
  // Log Error
  const color = exit ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}\x1b[1m${errorMessage}\x1b[0m`);
  if (pos) console.log(`${color}\x1b[1mat ${pos.file}:${pos.line}:${pos.col}\x1b[0m`);
  if (exit) process.exit(1);
};
const _BriskError = (
  code: string,
  type: string,
  errorCode: BriskErrorType,
  errorParams: string[],
  pos?: Position,
  exit = true
): void => {
  // Get Error Message
  let errorTemplate = BriskErrorMessage[errorCode];
  // Replace Error Template
  errorParams.forEach((param, index) => {
    errorTemplate = errorTemplate.replaceAll(`%${index + 1}`, `\`${param}\``);
  });
  // Build Error Message
  const errorMessage = `${type}[${errorCode}]: ${errorTemplate}`;
  // Log Error Message
  _BriskCustomError(code, errorMessage, pos, exit);
};
export default _BriskError;

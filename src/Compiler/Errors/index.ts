import { Position } from '../../Types/Types';
import { prettyError } from './ErrorBuilder';
import { BriskErrorMessage, BriskErrorType } from './Errors';
//@ts-ignore
import { __DEBUG__ } from '@brisk/config';
export const _BriskCustomError = (code: string, msg: string, pos?: Position): never => {
  // Build Pretty Errror
  const errorMessage = pos ? prettyError(code, msg, pos) : msg;
  // Log Error
  const color = '\x1b[31m';
  console.log(`${color}\x1b[1m${errorMessage}\x1b[0m`);
  if (pos) console.log(`${color}\x1b[1mat ${pos.file}:${pos.line}:${pos.col}\x1b[0m`);
  if (__DEBUG__) {
    // In Debug We Throw To Get Call Stack
    console.trace('Debug Position');
  }
  return process.exit(1);
};
const _BriskError = (
  code: string,
  type: string,
  errorCode: BriskErrorType,
  errorParams: string[],
  pos?: Position
): never => {
  // Get Error Message
  let errorTemplate = BriskErrorMessage[errorCode];
  // Replace Error Template
  errorParams.forEach((param, index) => {
    errorTemplate = errorTemplate.replaceAll(`%${index + 1}`, `\`${param}\``);
  });
  // Build Error Message
  const errorMessage = `${type}[${errorCode}]: ${errorTemplate}`;
  // Log Error Message
  return _BriskCustomError(code, errorMessage, pos);
};
export default _BriskError;

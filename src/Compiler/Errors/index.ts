import { Position } from '../Types/Types';

const _BriskError = (type: string, message: string, pos?: Position, exit = true): void => {
  const color = exit ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}\x1b[1m${type}: ${message}\x1b[0m`);
  if (pos) console.log(`${color}\x1b[1mat ${pos.file}:${pos.line}:${pos.col}\x1b[0m`);
  if (exit) process.exit(1);
};
export default _BriskError;
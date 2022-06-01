import { Position } from '../../Types/Types';
// Line Number Code
const addLineNumbers = (code: string, lineNumber: number) => {
  return code
    .split('\n')
    .map((line, i) => ` ${lineNumber + i} | ${line}`)
    .join('\n');
};
// Builds Pretty Error Messages
export const prettyError = (code: string, message: string, position: Position) => {
  // Create Detailed Error Message
  const width = process.stdout.columns || 80;
  const offset = position.offset;
  let startOfLine = code.lastIndexOf('\n', offset);
  let endOfLine = code.indexOf('\n', offset + position.length);
  if (endOfLine - startOfLine > width) {
    const loopLength = endOfLine - startOfLine - width;
    for (let i = 0; i <= loopLength; i++) {
      if (startOfLine < offset) startOfLine++;
      if (endOfLine > offset) endOfLine--;
      if (endOfLine - startOfLine < width) break;
    }
  }
  // Build First Line
  const incorrectCode = code.slice(offset, offset + position.length);
  const line =
    position.length == 0
      ? `\x1b[0m${code.slice(startOfLine + 1, endOfLine)}`
      : `\x1b[0m${code.slice(
          startOfLine + 1,
          offset
        )}\x1b[31m\x1b[1m${incorrectCode}\x1b[0m${code.slice(offset + position.length, endOfLine)}`;
  // After Message
  const afterMessage = code.slice(
    endOfLine + 1,
    code.indexOf('\n', code.indexOf('\n', endOfLine + 1) + 1)
  );
  if (afterMessage.length >= width * 2) afterMessage.slice(width * 2);
  // Calculate Lengths
  const multiLine = /\n|\r/.test(incorrectCode);
  const startLength = multiLine ? 0 : offset - startOfLine - 1;
  const wrongCodeLength = multiLine
    ? Math.max(...incorrectCode.split(/\n|\r/g).map((line) => line.length))
    : position.length || 5;
  // Build message
  const msg = [
    '',
    addLineNumbers(line, position.line),
    `\x1b[31m\x1b[1m${' '.repeat(
      addLineNumbers('', position.line + `${line}${afterMessage}`.split('\n').length).length
    )}${' '.repeat(startLength)}${'^'.repeat(wrongCodeLength)} ${message} \x1b[0m`
      .split('\n')
      .map((text, i) =>
        i == 0 ? text : `${' '.repeat(startLength + wrongCodeLength + 10)}${text}`
      )
      .join('\n'),
    addLineNumbers(afterMessage, position.line + line.split('\n').length),
  ];
  // =================================================================
  return msg.join('\n');
};

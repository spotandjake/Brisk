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
  // // Static Properties
  // const lineCount = 3;
  // const maxLineWidth = process?.stdout?.columns ?? 80;
  // // Cut Error Into Pieces
  // // const aboveCode = code.substring();
  // // const badCode = code.substring(position.offset, position.offset + position.length);
  // // const belowCode = code.substring();
  // const lines = code.split('\n');
  // const buffer = [];
  // let offset = 0;
  // for (let i = 0; i < lines.length; i++) {
  //   const line = lines[i];
  //   // Build Length
  //   offset += line.length;
  //   // If We found the area of interest get rid of anything extra
  //   if (i == position.line - 1) {
  //     // Build The message
  //     let str = '';
  //     // Push The Line Start
  //     str += line.slice(0, position.col - 1);
  //     // Push The Error Section
  //     str += `\x1b[31m\x1b[1m${line.slice(
  //       position.col - 1,
  //       position.col + position.length - 1
  //     )}\x1b[0m`;
  //     // Push The Line End
  //     str += line.slice(position.col + position.length - 1);
  //     // Push The Line
  //     buffer.push(str);
  //     // Append The Formatting For The Error
  //     buffer.push(
  //       `\x1b[35m\x1b[1m${' '.repeat(position.col - 1)}${'─'.repeat(
  //         Math.floor(position.length / 2) - (position.length % 2 == 0 ? 1 : 0)
  //       )}┬${'─'.repeat(Math.floor(position.length / 2))}\x1b[0m`
  //     );
  //     buffer.push(
  //       `${' '.repeat(
  //         position.col + Math.floor(position.length / 2) - (position.length % 2 == 0 ? 2 : 1)
  //       )}\x1b[35m\x1b[1m│\x1b[0m`
  //     );
  //     // Push Message
  //     let msg = '';
  //     msg += '\x1b[35m\x1b[1m';
  //     msg += `${' '.repeat(
  //       position.col + Math.floor(position.length / 2) - (position.length % 2 == 0 ? 2 : 1)
  //     )}`;
  //     msg += '╰─ ';
  //     msg += message;
  //     msg += '\x1b[0m';
  //     buffer.push(msg);
  //   } else {
  //     // Append To Buffer
  //     buffer.push(line);
  //   }
  // }
  // console.log(code);
  // console.log(position);
  // console.log(buffer.join('\n'));
  // Build Output
  // Return Output
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
  const beforePiece = code.slice(startOfLine + 1, offset);
  const afterPiece = code.slice(offset + position.length, endOfLine);
  const line =
    position.length == 0
      ? `\x1b[0m${code.slice(startOfLine + 1, endOfLine)}`
      : `\x1b[0m${beforePiece}\x1b[31m\x1b[1m${incorrectCode}\x1b[0m${afterPiece}`;
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

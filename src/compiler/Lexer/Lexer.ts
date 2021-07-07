import { Rule, Token, Position } from './Types';
import Tokens from './Tokens';

class Lexer {
  private rules: Rule[] = Tokens;
  private position: Position = {
    offset: 0,
    line: 1,
    col: 0
  };
  lex(filename: string, rawCode: string): Token[] {
    const { rules, position } = this;
    const output: Token[] = [];
    let code: string = rawCode;
    // Lex Code
    while (code) {
      // Determine if the line is blank
      const line = code.split(/(?<=\r?\n)/)[0];
      if (line.trim().length == 0) {
        position.line++;
        position.offset += line.length;
        position.col = 0;
        code = code.slice(line.length);
        continue;
      }
      let foundMatch = false;
      // Match Rule
      for (const rule of rules) {
        const { type, id, value, match } = rule;
        const matchToken = code.match(match);
        if (matchToken) {
          foundMatch = true;
          // Update position
          position.offset += matchToken[0].length;
          position.col += matchToken[0].length;
          // Write Token to output
          const token: Token = {
            type: type,
            id: id,
            text: matchToken[0],
            value: value ? value(matchToken[0]) : matchToken[0].trim(),
            offset: position.offset-1,
            line: position.line,
            col: position.col
          };
          output.push(token);
          // Make input smaller
          code = code.slice(matchToken[0].length);
          break;
        }
      }
      if (!foundMatch) {
        // Throw A Syntax Error
        console.log(`SyntaxError: unexpected ${code[0]} at ${filename}:${position.line}:${position.col}`);
        process.exit(1);
      }
    }
    return output;
  }
}
export default Lexer;
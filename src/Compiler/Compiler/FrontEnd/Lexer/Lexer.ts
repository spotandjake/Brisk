import rules from './Tokens';
import { BriskSyntaxError } from '../../../Errors/Compiler';
// Import Types
import { Token, Lexeme } from '../../Types';
class Lexer {
  public file: string;
  private regex: RegExp;
  private rules: Lexeme[] = rules;
  private dataset = '';
  private offset = 0;
  private line = 1;
  private col = 1;
  constructor(file: string) {
    // store stuff
    this.regex = new RegExp(`(?:${
      rules.map(({ match }) => {
        if (match.ignoreCase || match.global || match.sticky || match.multiline)
          BriskSyntaxError('RegExp /i/g/y/m flag used');
        return `((?:${match.source}))`;
      }).join('|')})`, 'my');
    this.file = file;
  }
  next(): (Token | undefined) {
    const { regex, rules, dataset, offset, line, col, file } = this;
    // Test tokens
    regex.lastIndex = offset;
    const match = regex.exec(dataset);
    if (!match) {
      if (dataset.length-offset == 0) return;
      BriskSyntaxError(`invalid syntax at line ${line} col ${col}:`);
      process.exit(1); // Tricks Lsp
    }
    const [ text, ...groups ] = match;
    // Determine the rule
    const rule = rules.find((r, i) => groups[i]);
    if (!rule) {
      BriskSyntaxError('could not find token for match');
      process.exit(1); // Tricks Lsp
    }
    // Keep track of position
    this.offset += text.length;
    this.col += text.length;
    if (rule.lineBreaks) {
      // Check if contains lineBreaks and count
      const a: number[] = [];
      let i=-1;
      while((i=text.indexOf('\n',i+1)) >= 0) a.push(i);
      if (a.length != 0) {
        this.line += a.length;
        this.col = text.length - <number>a.pop();
      }
    }
    return {
      type: rule.id,
      value: rule.value ? rule.value(text) : text,
      text: text,
      offset: offset,
      line: line,
      col: col,
      file: file
    };
  }
  save() {
    return {
      offset: this.offset,
      line: this.line,
      col: this.col,
      file: this.file
    };
  }
  reset(chunk: string, info?: { offset: number, line: number, col: number, file: string }) {
    this.dataset = chunk;
    this.offset = info?.offset || 0;
    this.line = info?.line || 1;
    this.col = info?.col || 1;
    this.file = info?.file || this.file;
  }
  formatError(token: Token) {
    return `parseError: ${token == null ? 'at end of file' : `at line ${token.line} col ${token.col}:`}`;
  }
  has(name: string) {
    return this.rules.some(({ id }) => id == name);
  }
}
export default Lexer;
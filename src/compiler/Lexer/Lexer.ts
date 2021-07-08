import Tokens from './Tokens';
// Import Types
import { Token, Rule } from './Types';
class Lexer {
  private regex: RegExp;
  private rules: Rule[];
  private dataset = '';
  private offset = 0;
  private line = 1;
  private col = 1;
  constructor(rules: Rule[]) {
    // Process rules
    rules.forEach(({ match }) => {
      if (match.ignoreCase) throw new Error('RegExp /i flag used');
      if (match.global) throw new Error('RegExp /g flag used');
      if (match.sticky) throw new Error('RegExp /y flag used');
      if (match.multiline) throw new Error('RegExp /m flag used');
    });
    // store stuff
    this.regex = new RegExp(`(?:${rules.map(({ match }) => `((?:${match.source}))`).join('|')})`, 'my');
    this.rules = rules;
  }
  next(): (Token | undefined) {
    const { regex, rules, dataset, offset, line, col } = this;
    // Test tokens
    regex.lastIndex = offset;
    const match = regex.exec(dataset);
    if (!match) {
      if (dataset.length-offset == 0) return;
      throw new Error(`invalid syntax at line ${this.line} col ${this.col}:`);
    }
    const [ text, ...groups ] = match;
    // Determine the rule
    let rule, i;
    for (i = 0; i < rules.length; i++) {
      if (groups[i]) rule = rules[i];
    }
    if (!rule) throw new Error('could not find token for match');
    // Assemble node
    const token: Token = {
      type: rule.id,
      value: rule.value ? rule.value(text) : text,
      text: text,
      offset: offset,
      line: line,
      col: col
    };
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
    return token;
  }
  save() {
    return {
      offset: this.offset,
      line: this.line,
      col: this.col
    };
  }
  reset(chunk: string, info?: { offset: number, line: number, col: number }) {
    this.dataset = chunk;
    this.offset = info ? info.offset : 0;
    this.line = info ? info.line : 1;
    this.col = info ? info.col : 1;
  }
  formatError(token: Token) {
    if (token == null) return 'parseError: at end of file';
    return `parseError: at line ${token.line} col ${token.col}:`;
  }
  has(name: string) {
    return this.rules.some(({ id }) => id == name);
  }
}
export default () => new Lexer(Tokens);
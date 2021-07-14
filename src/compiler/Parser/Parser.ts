import nearley from 'nearley';
import grammar from '../Grammar/Brisk';

import Tokens from '../Lexer/Tokens';

const getSymbolDisplay = (symbol: any, lsp: boolean) => {
  const type = typeof symbol;
  if (type === 'string') return symbol;
  else if (type === 'object' && symbol.literal) return JSON.stringify(symbol.literal);
  else if (type === 'object' && symbol instanceof RegExp) return `character matching ${symbol}`;
  else if (type === 'object' && symbol.hasOwnProperty('type')) {
    for (const token of Tokens) {
      if (symbol.type == token.id)
        return `character matching ${token.match.toString()}`;
    }
    if (!lsp) throw new Error(`Unknown symbol type: ${symbol}`);
    return '';
  } else if (!lsp) throw new Error(`Unknown symbol type: ${symbol}`);
};
const isTerminalSymbol = (symbol: any) => typeof symbol !== 'string';

const Parser = (filename: string, code: string, lsp = false) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true });
  try {
    parser.feed(code);
    return parser.results[0];
  } catch (err: any) {
    try {
      const { offset } = err;
      // @ts-ignore
      const { table } = parser;
      const lastColumnIndex = table.length - 2;
      const lastColumn = table[lastColumnIndex];
      let tok: string;
      let msg = '';
      // Isolate token range
      const width = process.stdout.columns * 4;
      const visibleCode = code.slice(
        Math.max(offset - width / 4, 0),
        Math.min(offset + width / 4, code.length)
      ).split('\n');
      if (visibleCode.length > 2) {
        visibleCode.shift();
        visibleCode.pop();
      }
      let lineNumber = 0;
      let column = 0;
      for (const line of visibleCode) {
        msg += `${lineNumber} | ${line}\n`;
        if (column + line.length >= offset && column <= offset) {
          // Get more info on the error
          const tokenLength = lastColumn.states[0].dot;
          const tokenStart = offset - column - tokenLength;
          // Draw out the stuff needed for the error
          msg += ' '.repeat(tokenStart + `${lineNumber} |`.length + 1);
          msg += '\x1b[1m\x1b[31m^\x1b[0m'.repeat(tokenLength);
          msg += ` \x1b[1m\x1b[31m expected one of  found '${line.slice(
            tokenStart,
            tokenStart + tokenLength
          )}\x1b[0m'`;
          tok = line.slice(tokenStart, tokenStart + tokenLength);
          msg += '\n';
        }
        lineNumber++;
        column += line.length;
      }
      msg += 'expected one of the following:\n';
      // Give Information For Fixing
      for (let i = 0; i < lastColumn.states.length; i++) {
        const state = lastColumn.states[i];
        const nextSymbol = state.rule.symbols[state.dot];
        if (nextSymbol && isTerminalSymbol(nextSymbol)) {
          const symbolDisplay = getSymbolDisplay(nextSymbol, lsp);
          const stateStack = table[lastColumnIndex].states[i];
          let trace = `${stateStack.rule.name} → `;
          stateStack.rule.symbols.forEach((symbol: any, i: number) => {
            const { literal } = symbol;
            if (literal) {
              if (literal == tok.charAt(i)) trace += `\x1b[1m\x1b[32m${literal}\x1b[0m`;
              else trace += `\x1b[1m\x1b[31m${literal}\x1b[0m`;
            } else {
              trace += `\x1b[1m\x1b[31m ${symbol.type ? symbol.type : symbol.toString()}\x1b[0m`;
            }
          });
          msg += `├──A ${symbolDisplay} based on:\n`;
          msg += `│  ╰─ ${trace}\n`;
        }
      }
      msg += `at offset: ${offset}`;
      if (!lsp) console.log(err);
      if (!lsp) console.log('================================================================');
      if (!lsp) console.log(msg);
      if (!lsp) process.exit(1);
    } catch (e) {
      if (!lsp) console.log(err);
      if (!lsp) process.exit(1);
    }
  }
};
export default Parser;
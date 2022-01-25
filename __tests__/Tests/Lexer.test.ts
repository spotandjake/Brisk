// Test Utils
//@ts-ignore
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
// Import Data: Relative to dist
const Lexer_Pass = fs.readFileSync('./__tests__/Data/Lexer/Lexer_Pass.br', 'utf8');
const Import_Pass = fs.readFileSync('./__tests__/Data/Lexer/Import_Pass.br', 'utf8');
const Export_Pass = fs.readFileSync('./__tests__/Data/Lexer/Export_Pass.br', 'utf8');
const Literals_Pass = fs.readFileSync('./__tests__/Data/Lexer/Literals_pass.br', 'utf8');
// Serialize Lex Data
import { ILexingResult, IToken } from 'chevrotain';
const serializeLex = (lexStream: ILexingResult) => {
  const groups: { [groupName: string]: Partial<IToken>[] } = {};
  Object.entries(lexStream.groups).map(([name, group]) => {
    groups[name] = group.map((token) => {
      return {
        image: token.image,
        startOffset: token.startOffset,
        startLine: token.startLine,
        startColumn: token.startColumn,
        endOffset: token.endOffset,
        endLine: token.endLine,
        endColumn: token.endColumn,
        tokenTypeIdx: token.tokenTypeIdx,
        payload: token.payload,
      };
    });
  });
  return {
    tokens: lexStream.tokens.map((token) => {
      return {
        image: token.image,
        startOffset: token.startOffset,
        startLine: token.startLine,
        startColumn: token.startColumn,
        endOffset: token.endOffset,
        endLine: token.endLine,
        endColumn: token.endColumn,
        tokenTypeIdx: token.tokenTypeIdx,
        payload: token.payload,
      };
    }),
    groups: groups,
    errors: lexStream.errors,
  };
};
// Lexer Tests
test('Lexer: Pass', () => {
  expect(serializeLex(lex(Lexer_Pass, 'file'))).toMatchSnapshot();
});
test('Lexer: Import Pass', () => {
  expect(serializeLex(lex(Import_Pass, 'file'))).toMatchSnapshot();
});
test('Lexer: Export Pass', () => {
  expect(serializeLex(lex(Export_Pass, 'file'))).toMatchSnapshot();
});
test('Lexer: Literals Pass', () => {
  expect(serializeLex(lex(Literals_Pass, 'file'))).toMatchSnapshot();
});

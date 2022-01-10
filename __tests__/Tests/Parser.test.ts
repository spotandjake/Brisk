// Test Utils
import { test, expect } from '@jest/globals';
import { ILexingResult } from 'chevrotain';
import fs from 'fs';
// Test Components
import { Tokens } from '../../src/Compiler/Lexer/Tokens';
import parse from '../../src/Compiler/Parser/index';
// Import Data: Relative to dist
// Lexer Tests
test('Parser: Main Pass', () => {
  const data = JSON.parse(fs.readFileSync('./__tests__/Data/Parser/Parser_Pass.json', 'utf8'));
  // console.log(Tokens);
  const Parser_Main: ILexingResult = {
    ...data,
    tokens: data.tokens.map((tkn: any) => {
      return {
        ...tkn,
        tokenType: Tokens.find((token) => token.name === tkn.tokenType),
      };
    })
  };
  expect(parse(Parser_Main, 'file')).toMatchSnapshot();
});
test('Parser: Literals Pass', () => {
  const data = JSON.parse(fs.readFileSync('./__tests__/Data/Parser/Literals_Pass.json', 'utf8'));
  // console.log(Tokens);
  const Parser_Main: ILexingResult = {
    ...data,
    tokens: data.tokens.map((tkn: any) => {
      return {
        ...tkn,
        tokenType: Tokens.find((token) => token.name === tkn.tokenType),
      };
    })
  };
  expect(parse(Parser_Main, 'file')).toMatchSnapshot();
});
// Test Utils
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
// Import Data: Relative to dist
const Lexer_Main = fs.readFileSync('./__tests__/Data/Lexer/Lexer.br', 'utf8');
// Lexer Tests
test('Lexer: Main', () => {
  expect(JSON.stringify(lex(Lexer_Main))).toMatchSnapshot();
});
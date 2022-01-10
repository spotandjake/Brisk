// Test Utils
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
// Import Data: Relative to dist
const Lexer_Pass = fs.readFileSync('./__tests__/Data/Lexer/Lexer_Pass.br', 'utf8');
const Import_Pass = fs.readFileSync('./__tests__/Data/Lexer/Import_Pass.br', 'utf8');
const Export_Pass = fs.readFileSync('./__tests__/Data/Lexer/Export_Pass.br', 'utf8');
// Lexer Tests
test('Lexer: Pass', () => {
  expect(lex(Lexer_Pass)).toMatchSnapshot();
});
test('Lexer: Import Pass', () => {
  expect(lex(Import_Pass)).toMatchSnapshot();
});
test('Lexer: Export Pass', () => {
  expect(lex(Export_Pass)).toMatchSnapshot();
});
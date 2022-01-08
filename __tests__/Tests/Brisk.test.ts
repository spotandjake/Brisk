// Test Utils
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
import parse from '../../src/Compiler/Parser/index';
import compile from '../../src/Compiler/index';
// Import Data: Relative to dist
const FrontEnd_Main = fs.readFileSync('./__tests__/Data/Brisk/Frontend.br', 'utf8');
// Compiler
test('Compile: Main', () => {
  expect(compile(FrontEnd_Main, 'file')).toMatchSnapshot();
});
// Parser-Lexer
test('Parser-Lexer: Main', () => {
  expect(parse(lex(FrontEnd_Main), 'file')).toMatchSnapshot();
});
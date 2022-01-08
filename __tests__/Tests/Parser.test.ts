// Test Utils
import { test, expect } from '@jest/globals';
import { ILexingResult } from 'chevrotain';
// Test Components
import parse from '../../src/Compiler/Parser/index';
// Import Data: Relative to dist
import Parser_Main from '../Data/Parser/Parser';
// Lexer Tests
test('Parser: Main', () => {
  expect(parse(<ILexingResult>Parser_Main, 'file')).toMatchSnapshot();
});
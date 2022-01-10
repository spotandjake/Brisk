// Test Utils
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
import parse from '../../src/Compiler/Parser/index';
import analyze from '../../src/Compiler/Analyzer/index';
import compile from '../../src/Compiler/index';
// Import Data: Relative to dist
const Main_Pass = fs.readFileSync('./__tests__/Data/Brisk/Brisk_pass.br', 'utf8');
const Literals_Pass = fs.readFileSync('./__tests__/Data/Brisk/Literals_pass.br', 'utf8');
// Compiler
test('Compile: Main Pass', () => {
  expect(compile(Main_Pass, 'file')).toMatchSnapshot();
});
// Parser-Lexer
test('Parser-Lexer: Main Pass', () => {
  expect(parse(lex(Main_Pass), 'file')).toMatchSnapshot();
});
// Parser-Lexer-Analyzer
test('Parser-Lexer-Analyzer: Main Pass', () => {
  expect(analyze(parse(lex(Main_Pass), 'file'))).toMatchSnapshot();
});
// Literals
test('Compile: Literals Pass', () => {
  expect(compile(Literals_Pass, 'file')).toMatchSnapshot();
});
// Parser-Lexer
test('Parser-Lexer: Literals Pass', () => {
  expect(parse(lex(Literals_Pass), 'file')).toMatchSnapshot();
});
// Parser-Lexer-Analyzer
test('Parser-Lexer-Analyzer: Literals Pass', () => {
  expect(analyze(parse(lex(Literals_Pass), 'file'))).toMatchSnapshot();
});
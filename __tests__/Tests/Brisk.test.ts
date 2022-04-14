// Test Utils
//@ts-ignore
import { test, expect } from '@jest/globals';
import fs from 'fs';
// Test Components
import lex from '../../src/Compiler/Lexer/index';
import parse from '../../src/Compiler/Parser/index';
import analyze from '../../src/Compiler/Analyzer/index';
import compile from '../../src/Compiler/index';
import { ExportList } from '../../src/Compiler/Types/Types';
// Import Data: Relative to dist
const Main_Pass = fs.readFileSync('./__tests__/Data/Brisk/Brisk_pass.br', 'utf8');
const Literals_Pass = fs.readFileSync('./__tests__/Data/Brisk/Literals_pass.br', 'utf8');
// PolyFill Compile
const compileFile = async (filePath: string): Promise<{ output: '', exports: ExportList }> => {
  // TODO: Return Proper Types
  return {
    output: '',
    exports: new Map()
  };
};
// Compiler
test('Compile: Main Pass', async () => {
  expect(await compile(Main_Pass, 'file', compileFile)).toMatchSnapshot();
});
// Parser-Lexer
test('Parser-Lexer: Main Pass', () => {
  expect(parse(lex(Main_Pass, 'file'), '', 'file')).toMatchSnapshot();
});
// Parser-Lexer-Analyzer
test('Parser-Lexer-Analyzer: Main Pass', () => {
  expect(analyze(Main_Pass, parse(lex(Main_Pass, 'file'), '', 'file'))).toMatchSnapshot();
});
// Literals
test('Compile: Literals Pass', async () => {
  expect(await compile(Literals_Pass, 'file', compileFile)).toMatchSnapshot();
});
// Parser-Lexer
test('Parser-Lexer: Literals Pass', () => {
  expect(parse(lex(Literals_Pass, 'file'), '', 'file')).toMatchSnapshot();
});
// Parser-Lexer-Analyzer
test('Parser-Lexer-Analyzer: Literals Pass', () => {
  expect(analyze(Literals_Pass, parse(lex(Literals_Pass, 'file'), '', 'file'))).toMatchSnapshot();
});

// Imports
import lex from '../src/Compiler/Lexer/index';
import fs from 'fs';
import { ILexingResult } from 'chevrotain';
// Read Raw Data
const Parser_Main = fs.readFileSync('./__tests__/Data/Parser/Parser_Pass.br', 'utf8');
// Helpers
const serializeInput = (lexStream: ILexingResult): string => {
  const tokens = lexStream.tokens.map((token) => {
    return {
      ...token,
      tokenType: token.tokenType.name,
    };
  });
  return JSON.stringify({ ...lexStream, tokens: tokens });
};
// Generate Data for parser tests
fs.writeFileSync('./__tests__/Data/Parser/Parser_Pass.json', serializeInput(lex(Parser_Main)));
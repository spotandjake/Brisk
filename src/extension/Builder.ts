import { Tokens } from '../Compiler/Lexer/Tokens';
import { Lexer } from 'chevrotain';
import { TmIncludePattern, TmLanguage, TmMatchPattern, TmRepository } from './tmlanguage';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
// Analyze Tokens
const patterns: TmIncludePattern[] = [];
const repository: TmRepository = {};
for (const token of Tokens) {
  if (token.PATTERN == Lexer.NA) {
    // Check If It is Category
    patterns.push({ include: `#${token.name}` });
    // Add Pattern Area To Repository Object
    repository[token.name] = {
      patterns: [],
    };
  } else {
    // Check If It Is Token
    // Only Work With Tokens That Have A Known Type Atm
    if (typeof token.PATTERN == 'string' || token.PATTERN instanceof RegExp) {
      let pattern = '';
      if (typeof token.PATTERN == 'string') pattern = token.PATTERN;
      else if (token.PATTERN instanceof RegExp) pattern = token.PATTERN.source;
      // Set Token
      if (token.CATEGORIES != undefined) {
        for (const category of token.CATEGORIES) {
          if (repository.hasOwnProperty(category.name)) {
            // Build Token Pattern
            const tokenPattern: TmMatchPattern = {
              name: `${category.name}.${token.name}.br`,
              match: pattern,
            };
            repository[category.name].patterns.push(tokenPattern);
          } else {
            console.log(`Token \`${token.name}\` Unknown Category \`${category.name}\``);
          }
        }
      } else {
        console.log(`Token \`${token.name}\` Has No Categories`);
      }
    } else {
      console.log(`Token \`${token.name}\` Pattern Type Not Yet Supported`);
    }
  }
}
// Build Highlighting
export const textMateGrammar: TmLanguage = {
  $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
  name: 'brisk',
  patterns: patterns,
  repository: repository,
  scopeName: 'source.brisk',
};
// Create Extension Folder
if (!fs.existsSync(`${__dirname}/extension/`)) {
  fs.mkdirSync(`${__dirname}/extension/`);
}
// Create Syntax Folder
if (!fs.existsSync(`${__dirname}/extension/syntaxes/`)) {
  fs.mkdirSync(`${__dirname}/extension/syntaxes/`);
}
// Write File
fs.writeFileSync(
  `${__dirname}/extension/syntaxes/br.tmLanguage.json`,
  JSON.stringify(textMateGrammar, null, 2)
);

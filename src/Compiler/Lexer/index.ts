// Imports
import { Lexer, createToken } from 'chevrotain';
// Lex code
const lex = (program: string, file: string) => {
  // =================================================================
  // Categories
  const literalTokens = createToken({ name: 'literal', pattern: Lexer.NA });
  // =================================================================
  const Tokens = [
    // Keywords
    createToken({ label: 'Import', name: 'import', pattern: /import/ }), // import
    createToken({ label: 'Wasm Identifier', name: 'wasm', pattern: /wasm/ }), // wasm
    createToken({ label: 'From', name: 'from', pattern: /from/ }), // from
    createToken({ label: 'Export', name: 'export', pattern: /export/ }), // export
    createToken({ label: 'Const Definition', name: 'const', pattern: /const/ }), // const
    createToken({ label: 'Definition', name: 'let', pattern: /let/ }), // let
    createToken({ label: 'If Statement', name: 'if', pattern: /if/ }), // if
    createToken({ label: 'Else Statement', name: 'else', pattern: /else/ }), // else
    createToken({ label: 'Return', name: 'return', pattern: /return/ }), // return
    // Separators
    createToken({ label: 'Left Parenthesis', name: 'l_paren', pattern: /\(/ }), // l_paren
    createToken({ label: 'Right Parenthesis', name: 'r_paren', pattern: /\)/ }), // r_paren
    createToken({ label: 'Left Brace', name: 'l_brace', pattern: /\{/ }), // l_brace
    createToken({ label: 'Right Brace', name: 'r_brace', pattern: /\}/ }), // r_brace
    createToken({ label: 'Left Bracket', name: 'l_bracket', pattern: /\[/ }), // l_bracket
    createToken({ label: 'Right Bracket', name: 'r_bracket', pattern: /\]/ }), // r_bracket
    createToken({ label: 'Left Chevron', name: 'l_chevron', pattern: /</ }), // l_chevron
    createToken({ label: 'Right Chevron', name: 'r_chevron', pattern: />/ }), // r_chevron
    createToken({ label: 'Comma', name: 'comma', pattern: /,/ }), // comma
    createToken({ label: 'Period', name: 'period', pattern: /\./ }), // period
    createToken({ label: 'Colon', name: 'colon', pattern: /:/ }), // colon
    createToken({ label: 'Semicolon', name: 'semicolon', pattern: /;/ }), // semicolon
    createToken({ label: 'Whitespace', name: 'ws', pattern: /[ \t\s]+/ }), // ws
    // Operators
    createToken({ label: 'Comparison Equal', name: 'compareEqual', pattern: /==/ }), // compareEqual
    createToken({ label: 'Comparison Not Equal', name: 'compareNotEqual', pattern: /!=/ }), // compareNotEqual
    createToken({ label: 'Arrow', name: 'thick_arrow', pattern: /=>/ }), // thick_arrow
    createToken({ label: 'Signature Arrow', name: 'thin_arrow', pattern: /->/ }), // thin_arrow
    createToken({ label: 'Not', name: 'not', pattern: /!/ }), // not
    createToken({ label: 'Equal', name: 'equal', pattern: /=/ }), // equal
    createToken({ label: 'Add', name: 'add', pattern: /\+/ }), // add
    createToken({ label: 'Subtract', name: 'sub', pattern: /-/ }), // sub
    // Literals
    literalTokens, // Literal
    createToken({ label: 'String', name: 'string', categories: literalTokens, pattern: /'.*'/ }), // String
    createToken({ label: 'Number', name: 'number', categories: literalTokens, pattern: /[-|+]?[0-9]*(?:\.?[0-9]+)/ }), // Number
    createToken({ label: 'Constant', name: 'constant', categories: literalTokens, pattern: /(?:true|false|void)/ }), // Constant
    createToken({
      label: 'Wasm Call', name: 'wasmCall', categories: literalTokens, pattern: /@wasm/
    }), // Wasm Call
    // Flags
    createToken({ label: 'Flag', name: 'flag', pattern: /@.*/ }), // Flag
    // Comments
    createToken({ label: 'Comment', name: 'comment', pattern: /\/\/.*/ }), // Comment
    // Identifiers
    createToken({ label: 'Identifier', name: 'identifier', group: 'comment', pattern: /[a-zA-Z$_][1-9a-zA-Z$_]*/ }), // Identifier
  ];
  // =================================================================
  const lexer = new Lexer(Tokens);
  return lexer.tokenize(program);
};

export default lex;
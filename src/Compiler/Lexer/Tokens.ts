import { Lexer, createToken } from 'chevrotain';
// =================================================================
// Categories
export const literalTokens = createToken({ name: 'literal', pattern: Lexer.NA });
export const comparisonOperators = createToken({ name: 'comparisonOperators', pattern: Lexer.NA });
export const assignmentOperators = createToken({ name: 'assignmentOperators', pattern: Lexer.NA });
export const arithmeticOperators = createToken({ name: 'arithmeticOperators', pattern: Lexer.NA });
export const logicalOperators = createToken({ name: 'logicalOperators', pattern: Lexer.NA });
// Keywords
export const TknImport = createToken({ label: 'Import', name: 'import', pattern: /import/ }); // import
export const TknWasm = createToken({ label: 'Wasm Identifier', name: 'wasm', pattern: /wasm/ }); // wasm
export const TknFrom = createToken({ label: 'From', name: 'from', pattern: /from/ }); // from
export const TknExport = createToken({ label: 'Export', name: 'export', pattern: /export/ }); // export
export const TknConst = createToken({ label: 'Const Definition', name: 'const', pattern: /const/ }); // const
export const TknLet = createToken({ label: 'Definition', name: 'let', pattern: /let/ }); // let
export const TknIf = createToken({ label: 'If Statement', name: 'if', pattern: /if/ }); // if
export const TknElse = createToken({ label: 'Else Statement', name: 'else', pattern: /else/ }); // else
export const TknReturn = createToken({ label: 'Return', name: 'return', pattern: /return/ }); // return
// Separators
export const TknLParen = createToken({ label: 'Left Parenthesis', name: 'l_paren', pattern: /\(/ }); // l_paren
export const TknRParen = createToken({ label: 'Right Parenthesis', name: 'r_paren', pattern: /\)/ }); // r_paren
export const TknLBrace = createToken({ label: 'Left Brace', name: 'l_brace', pattern: /\{/ }); // l_brace
export const TknRBrace = createToken({ label: 'Right Brace', name: 'r_brace', pattern: /\}/ }); // r_brace
export const TknLBracket = createToken({ label: 'Left Bracket', name: 'l_bracket', pattern: /\[/ }); // l_bracket
export const TknRBracket = createToken({ label: 'Right Bracket', name: 'r_bracket', pattern: /\]/ }); // r_bracket
export const TknLChevron = createToken({ label: 'Left Chevron', name: 'l_chevron', pattern: /</ }); // l_chevron
export const TknRChevron = createToken({ label: 'Right Chevron', name: 'r_chevron', pattern: />/ }); // r_chevron
export const TknComma = createToken({ label: 'Comma', name: 'comma', pattern: /,/ }); // comma
export const TknPeriod = createToken({ label: 'Period', name: 'period', pattern: /\./ }); // period
export const TknColon = createToken({ label: 'Colon', name: 'colon', pattern: /:/ }); // colon
export const TknSemiColon = createToken({ label: 'Semicolon', name: 'semicolon', pattern: /;/ }); // semicolon
export const TknWhitespace = createToken({ label: 'Whitespace', name: 'ws', pattern: /[ \t\s\r\n]+/, line_breaks: true }); // ws
// Operators
export const TknComparisonEqual = createToken({ label: 'Comparison Equal', name: 'compareEqual', categories: comparisonOperators, pattern: /==/ }); // compareEqual
export const TknComparisonNotEqual = createToken({ label: 'Comparison Not Equal', name: 'compareNotEqual', categories: comparisonOperators, pattern: /!=/ }); // compareNotEqual
export const TknThickArrow = createToken({ label: 'Arrow', name: 'thick_arrow', pattern: /=>/ }); // thick_arrow
export const TknThinArrow = createToken({ label: 'Signature Arrow', name: 'thin_arrow', pattern: /->/ }); // thin_arrow
export const TknNot = createToken({ label: 'Not', name: 'not', categories: logicalOperators, pattern: /!/ }); // not
export const TknEqual = createToken({ label: 'Equal', name: 'equal', categories: assignmentOperators, pattern: /=/ }); // equal
export const TknAdd = createToken({ label: 'Add', name: 'add', categories: arithmeticOperators, pattern: /\+/ }); // add
export const TknSub = createToken({ label: 'Subtract', name: 'sub', categories: arithmeticOperators, pattern: /-/ }); // sub
// Literals
export const TknString = createToken({ label: 'String Literal', name: 'string', categories: literalTokens, pattern: /'.*'/ }); // String
export const TknNumber = createToken({ label: 'Number Literal', name: 'number', categories: literalTokens, pattern: /[-|+]?[0-9]*(?:\.?[0-9]+)/ }); // Number
export const TknConstant = createToken({ label: 'Constant Literal', name: 'constant', categories: literalTokens, pattern: /(?:true|false|void)/ }); // Constant
export const TknWasmCall = createToken({
  label: 'Wasm Call', name: 'wasmCall', categories: literalTokens, pattern: /@wasm/
}); // Wasm Call
// Flags
export const TknFlag = createToken({ label: 'Flag', name: 'flag', pattern: /@.*/ }); // Flag
// Comments
export const TknComment = createToken({ label: 'Comment', name: 'comment', pattern: /\/\/.*/ }); // Comment
// Identifiers
export const TknIdentifier = createToken({ label: 'Identifier', name: 'identifier', pattern: /[a-zA-Z$_][1-9a-zA-Z$_]*/ }); // Identifier
// =================================================================
export const Tokens = [
  // Categories
  literalTokens,
  comparisonOperators,
  assignmentOperators,
  arithmeticOperators,
  logicalOperators,
  // Keywords
  TknImport,
  TknWasm,
  TknFrom,
  TknExport,
  TknConst,
  TknLet,
  TknIf,
  TknElse,
  TknReturn,
  // Separators
  TknLParen,
  TknRParen,
  TknLBrace,
  TknRBrace,
  TknLBracket,
  TknRBracket,
  TknLChevron,
  TknRChevron,
  TknComma,
  TknPeriod,
  TknColon,
  TknSemiColon,
  TknWhitespace,
  TknComparisonEqual,
  TknComparisonNotEqual,
  TknThickArrow,
  TknThinArrow,
  TknNot,
  TknEqual,
  TknAdd,
  TknSub,
  // Literals
  literalTokens,
  TknString,
  TknNumber,
  TknConstant,
  TknWasmCall,
  // Flags
  TknFlag,
  // Comments
  TknComment,
  // Identifiers
  TknIdentifier,
];
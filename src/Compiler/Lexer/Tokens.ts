import { Lexer, createToken } from 'chevrotain';
import { LexerTokenType } from '../Types/LexerNodes';
// =================================================================
// Categories
export const literalTokens = createToken({
  name: LexerTokenType.Literals,
  pattern: Lexer.NA
});
export const comparisonOperators = createToken({
  name: LexerTokenType.ComparisonOperators,
  pattern: Lexer.NA
});
export const assignmentOperators = createToken({
  name: LexerTokenType.AssignmentOperators,
  pattern: Lexer.NA
});
export const arithmeticOperators = createToken({
  name: LexerTokenType.ArithmeticOperators,
  pattern: Lexer.NA
});
export const logicalOperators = createToken({
  name: LexerTokenType.LogicalOperators,
  pattern: Lexer.NA
});
// Comments
export const TknComment = createToken({
  label: 'Comment',
  name: LexerTokenType.TknComment,
  pattern: /\/\/.*/
}); // Comment
// Keywords
export const TknImport = createToken({
  label: 'Import',
  name: LexerTokenType.ImportToken,
  pattern: /import/
});
export const TknWasm = createToken({
  label: 'Wasm Import Identifier',
  name: LexerTokenType.WasmToken,
  pattern: /wasm/
});
export const TknFrom = createToken({
  label: 'From',
  name: LexerTokenType.FromToken,
  pattern: /from/
});
export const TknExport = createToken({
  label: 'Export',
  name: LexerTokenType.ExportToken,
  pattern: /export/
});
export const TknConst = createToken({
  label: 'Const',
  name: LexerTokenType.ConstToken,
  pattern: /const/
});
export const TknLet = createToken({
  label: 'Let',
  name: LexerTokenType.LetToken,
  pattern: /let/
});
export const TknIf = createToken({
  label: 'If',
  name: LexerTokenType.IfToken,
  pattern: /if/
});
export const TknElse = createToken({
  label: 'Else',
  name: LexerTokenType.ElseToken,
  pattern: /else/
});
// Literals
export const TknString = createToken({
  label: 'String Literal',
  name: LexerTokenType.TknStringLiteral,
  categories: literalTokens,
  pattern: /'.*'/
}); // String
export const TknI32 = createToken({
  label: 'I32 Literal',
  name: LexerTokenType.TknI32Literal,
  categories: literalTokens,
  pattern: /[-|+]?[0-9]+n/
}); // I32
export const TknI64 = createToken({
  label: 'I64 Literal',
  name: LexerTokenType.TknI64Literal,
  categories: literalTokens,
  pattern: /[-|+]?[0-9]+N/
}); // I64
export const TknU32 = createToken({
  label: 'U32 Literal',
  name: LexerTokenType.TknU32Literal,
  categories: literalTokens,
  pattern: /[0-9]+u/
}); // U32
export const TknU64 = createToken({
  label: 'U64 Literal',
  name: LexerTokenType.TknU64Literal,
  categories: literalTokens,
  pattern: /[0-9]+U/
}); // U64
export const TknF32 = createToken({
  label: 'F32 Literal',
  name: LexerTokenType.TknF32Literal,
  categories: literalTokens,
  pattern: /[-|+]?[0-9]*(?:\.?[0-9]+)f/
}); // F32
export const TknF64 = createToken({
  label: 'F64 Literal',
  name: LexerTokenType.TknF64Literal,
  categories: literalTokens,
  pattern: /[-|+]?[0-9]*(?:\.?[0-9]+)F/
}); // F64
export const TknNumber = createToken({
  label: 'Number Literal',
  name: LexerTokenType.TknNumberLiteral,
  categories: literalTokens,
  pattern: /[-|+]?[0-9]*(?:\.?[0-9]+)/
}); // Number
export const TknConstant = createToken({
  label: 'Constant Literal',
  name: LexerTokenType.TknConstantLiteral,
  categories: literalTokens,
  pattern: /(?:true|false|void)/
}); // Constant
export const TknWasmCall = createToken({
  label: 'Wasm Call',
  name: LexerTokenType.TknWasmCall,
  categories: literalTokens,
  pattern: /@wasm((\.[a-z\d]+)+)/
}); // Wasm Call
// Separators
export const TknLParen = createToken({
  label: 'Left Parenthesis',
  name: LexerTokenType.LeftParenthesis,
  pattern: /\(/
});
export const TknRParen = createToken({
  label: 'Right Parenthesis',
  name: LexerTokenType.RightParenthesis,
  pattern: /\)/
});
export const TknLBrace = createToken({
  label: 'Left Brace',
  name: LexerTokenType.LeftBrace,
  pattern: /\{/
});
export const TknRBrace = createToken({
  label: 'Right Brace',
  name: LexerTokenType.RightBrace,
  pattern: /\}/
});
export const TknLBracket = createToken({
  label: 'Left Bracket',
  name: LexerTokenType.LeftBracket,
  pattern: /\[/
});
export const TknRBracket = createToken({
  label: 'Right Bracket',
  name: LexerTokenType.RightBracket,
  pattern: /\]/
});
export const TknComma = createToken({
  label: 'Comma',
  name: LexerTokenType.Comma,
  pattern: /,/
});
export const TknPeriod = createToken({
  label: 'Period',
  name: LexerTokenType.Period,
  pattern: /\./
});
export const TknColon = createToken({
  label: 'Colon',
  name: LexerTokenType.Colon,
  pattern: /:/
});
export const TknSemiColon = createToken({
  label: 'Semicolon',
  name: LexerTokenType.Semicolon,
  pattern: /;/
});
export const TknWhitespace = createToken({
  label: 'Whitespace',
  name: LexerTokenType.WhiteSpace,
  pattern: /[ \t\s\r\n]+/,
  line_breaks: true
}); // ws
// Operators
export const TknComparisonEqual = createToken({
  label: 'Comparison Equal',
  name: LexerTokenType.TknComparisonEqual,
  categories: comparisonOperators,
  pattern: /==/
});
export const TknComparisonNotEqual = createToken({
  label: 'Comparison Not Equal',
  name: LexerTokenType.TknComparisonNotEqual,
  categories: comparisonOperators,
  pattern: /!=/
});
export const TknComparisonGreaterThan = createToken({
  label: 'Comparison Greater Than',
  name: LexerTokenType.TknComparisonGreaterThan,
  categories: comparisonOperators,
  pattern: />/
});
export const TknComparisonLessThan = createToken({
  label: 'Comparison Less Than',
  name: LexerTokenType.TknComparisonLessThan,
  categories: comparisonOperators,
  pattern: /</
});
export const TknComparisonGreaterThanEqual = createToken({
  label: 'Comparison Greater Than Or Equal To',
  name: LexerTokenType.TknComparisonGreaterThanOrEqual,
  categories: comparisonOperators,
  pattern: />=/
});
export const TknComparisonLessThanEqual = createToken({
  label: 'Comparison Less Than Or Equal To',
  name: LexerTokenType.TknComparisonLessThanOrEqual,
  categories: comparisonOperators,
  pattern: /<=/
});
export const TknThickArrow = createToken({
  label: 'Arrow',
  name: LexerTokenType.TknArrow,
  pattern: /=>/
});
export const TknThinArrow = createToken({
  label: 'Signature Arrow',
  name: LexerTokenType.TknThinArrow,
  pattern: /->/
});
export const TknNot = createToken({
  label: 'Not',
  name: LexerTokenType.TknNot,
  categories: logicalOperators,
  pattern: /!/
});
export const TknEqual = createToken({
  label: 'Equal',
  name: LexerTokenType.TknEqual,
  categories: assignmentOperators,
  pattern: /=/
});
export const TknAdd = createToken({
  label: 'Add',
  name: LexerTokenType.TknAdd,
  categories: arithmeticOperators,
  pattern: /\+/
});
export const TknSub = createToken({
  label: 'Subtract',
  name: LexerTokenType.TknSubtract,
  categories: arithmeticOperators,
  pattern: /-/
});
export const TknDiv = createToken({
  label: 'Division',
  name: LexerTokenType.TknDivision,
  categories: arithmeticOperators,
  pattern: /\//,
  longer_alt: TknComment
});
export const TknMul = createToken({
  label: 'Multiplication',
  name: LexerTokenType.TknMultiply,
  categories: arithmeticOperators,
  pattern: /\*/
});
export const TknPow = createToken({
  label: 'Power Of',
  name: LexerTokenType.TknPower,
  categories: arithmeticOperators,
  pattern: /\^/
});
// Flags
export const TknFlag = createToken({
  label: 'Flag',
  name: LexerTokenType.TknFlag,
  pattern: /@.*/
}); // Flag
// Identifiers
export const TknIdentifier = createToken({
  label: 'Identifier',
  name: LexerTokenType.TknIdentifier,
  pattern: /[a-zA-Z$_][1-9a-zA-Z$_]*/
}); // Identifier
// =================================================================
export const Tokens = [
  // Categories
  literalTokens,
  comparisonOperators,
  assignmentOperators,
  arithmeticOperators,
  logicalOperators,
  // Comments
  TknComment,
  // Literals
  literalTokens,
  TknString,
  TknI32,
  TknI64,
  TknU32,
  TknU64,
  TknF32,
  TknF64,
  TknNumber,
  TknConstant,
  TknWasmCall,
  // Keywords
  TknImport,
  TknWasm,
  TknFrom,
  TknExport,
  TknConst,
  TknLet,
  TknIf,
  TknElse,
  // Separators
  TknLParen,
  TknRParen,
  TknLBrace,
  TknRBrace,
  TknLBracket,
  TknRBracket,
  TknComma,
  TknPeriod,
  TknColon,
  TknSemiColon,
  TknWhitespace,
  TknComparisonEqual,
  TknComparisonNotEqual,
  TknComparisonGreaterThanEqual,
  TknComparisonLessThanEqual,
  TknComparisonGreaterThan,
  TknComparisonLessThan,
  TknThickArrow,
  TknThinArrow,
  TknNot,
  TknEqual,
  TknAdd,
  TknSub,
  TknDiv,
  TknMul,
  TknPow,
  // Flags
  TknFlag,
  // Identifiers
  TknIdentifier,
];
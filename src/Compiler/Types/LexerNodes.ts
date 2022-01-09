// Lexer Nodes
export const enum LexerTokenType {
  // Categories
  Literals = 'Literals',
  ComparisonOperators = 'ComparisonOperators',
  AssignmentOperators = 'AssignmentOperators',
  ArithmeticOperators = 'ArithmeticOperators',
  LogicalOperators = 'LogicalOperators',
  // Keywords
  ImportToken = 'ImportToken',
  WasmToken = 'WasmToken',
  FromToken = 'FromToken',
  ExportToken = 'ExportToken',
  ConstToken = 'ConstToken',
  LetToken = 'LetToken',
  IfToken = 'IfToken',
  ElseToken = 'ElseToken',
  // Separators
  LeftParenthesis = 'LeftParen',
  RightParenthesis = 'RightParen',
  LeftBrace = 'LeftBrace',
  RightBrace = 'RightBrace',
  LeftBracket = 'LeftBracket',
  RightBracket = 'RightBracket',
  Comma = 'Comma',
  Period = 'Period',
  Colon = 'Colon',
  Semicolon = 'Semicolon',
  WhiteSpace = 'Space',
  // Operators
  TknComparisonEqual = 'TknComparisonEqual',
  TknComparisonNotEqual = 'TknComparisonNotEqual',
  TknComparisonLessThan = 'TknComparisonLessThan',
  TknComparisonGreaterThan = 'TknComparisonGreaterThan',
  TknComparisonLessThanOrEqual = 'TknComparisonLessThanOrEqual',
  TknComparisonGreaterThanOrEqual = 'TknComparisonGreaterThanOrEqual',
  TknArrow = 'TknArrow',
  TknThinArrow = 'TknThinArrow',

  TknNot = 'TknNot',

  TknEqual = 'TknEqual',
  TknAdd = 'TknAdd',
  TknSubtract = 'TknSubtract',
  TknDivision = 'TknDivision',
  TknMultiply = 'TknMultiply',
  TknPower = 'TknPower',
  // Literals
  TknStringLiteral = 'String',
  TknNumberLiteral = 'Number',
  TknConstantLiteral = 'Constant',
  TknWasmCall = 'Wasm Instruction Call',
  // Other

  TknFlag = 'TknFlag',
  TknComment = 'TknComment',
  TknIdentifier = 'TknIdentifier',
}
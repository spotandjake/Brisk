// Lexer Nodes
export const enum LexerTokenType {
  // Categories
  Keywords = 'Keywords',
  Literals = 'Literals',
  Separators = 'Separators',
  Operators = 'Operators',
  Reserved = 'Reserved',
  PostFixOperators = 'PostFixOperators',
  ComparisonOperators = 'ComparisonOperators',
  AssignmentOperators = 'AssignmentOperators',
  ArithmeticOperators = 'ArithmeticOperators',
  LogicalOperators = 'LogicalOperators',
  TypeOperators = 'TypeOperators',
  // Keywords
  ImportToken = 'ImportToken',
  WasmToken = 'WasmToken',
  FromToken = 'FromToken',
  ExportToken = 'ExportToken',
  ConstToken = 'ConstToken',
  LetToken = 'LetToken',
  IfToken = 'IfToken',
  ElseToken = 'ElseToken',
  InterfaceToken = 'InterfaceToken',
  TypeToken = 'TypeToken',
  ReturnToken = 'ReturnToken',
  TknEnum = 'TknEnum',
  // Separators
  LeftParenthesis = 'LeftParen',
  RightParenthesis = 'RightParen',
  LeftBrace = 'LeftBrace',
  RightBrace = 'RightBrace',
  LeftBracket = 'LeftBracket',
  RightBracket = 'RightBracket',
  Comma = 'Comma',
  TknEllipsis = 'TknEllipsis',
  Period = 'Period',
  Colon = 'Colon',
  Semicolon = 'Semicolon',
  WhiteSpace = 'Space',
  // Operators
  TknPostFixIncrement = 'PostfixIncrement',
  TknPostFixDecrement = 'PostfixDecrement',
  TknComparisonEqual = 'TknComparisonEqual',
  TknComparisonNotEqual = 'TknComparisonNotEqual',
  TknComparisonLessThanOrEqual = 'TknComparisonLessThanOrEqual',
  TknComparisonGreaterThanOrEqual = 'TknComparisonGreaterThanOrEqual',
  TknComparisonGreaterThan = 'TknComparisonGreaterThan',
  TknComparisonLessThan = 'TknComparisonLessThan',
  TknComparisonAnd = 'TknComparisonAnd',
  TknComparisonOr = 'TknComparisonOr',
  TknArrow = 'TknArrow',

  TknNot = 'TknNot',

  TknEqual = 'TknEqual',
  TknAdd = 'TknAdd',
  TknSubtract = 'TknSubtract',
  TknDivision = 'TknDivision',
  TknMultiply = 'TknMultiply',
  TknPower = 'TknPower',
  TknUnion = 'TypeUnion',
  TknQuestionMark = 'TknQuestionMark',
  // Literals
  TknStringLiteral = 'String',
  TknI32Literal = 'I32',
  TknI64Literal = 'I64',
  TknU32Literal = 'U32',
  TknU64Literal = 'U64',
  TknF32Literal = 'F32',
  TknF64Literal = 'F64',
  TknNumberLiteral = 'Number',
  TknConstantLiteral = 'Constant',
  TknWasmCall = 'Wasm Instruction Call',
  // Reserved Tokens
  TknMatch = 'TknMatch',
  TknClass = 'TknClass',
  TknImplements = 'TknImplements',
  TknExtends = 'TknExtends',
  TknFor = 'TknFor',
  TknWhile = 'TknWhile',
  TknAwait = 'TknAwait',
  TknAsync = 'TknAsync',
  // Other

  TknFlag = 'TknFlag',
  TknComment = 'TknComment',
  TknIdentifier = 'TknIdentifier',
}
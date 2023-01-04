// Lexer Nodes
export const enum LexerTokenType {
  // Categories
  Keywords = 'Keywords',
  Literals = 'Literals',
  Separators = 'Separators',
  Operators = 'Operators',
  ExpressionOperators = 'ExpressionOperators',
  StatementOperators = 'StatementOperators',
  AssignmentOperators = 'AssignmentOperators',
  Operators180 = 'Operators180',
  Operators170 = 'Operators170',
  Operators160 = 'Operators160',
  Reserved = 'Reserved',
  // Keywords
  ImportToken = 'ImportToken',
  WasmToken = 'WasmToken',
  FromToken = 'FromToken',
  ExportToken = 'ExportToken',
  ConstToken = 'ConstToken',
  LetToken = 'LetToken',
  IfToken = 'IfToken',
  TknWhile = 'TknWhile',
  TknBreak = 'TknBreak',
  TknBreakIf = 'TknBreakIf',
  TknContinue = 'TknContinue',
  TknContinueIf = 'TknContinueIf',
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
  ThickArrow = 'ThickArrow',
  WhiteSpace = 'Space',
  // Operators
  TknOperator180 = 'TknOperator180',
  TknOperator170 = 'TknOperator170',
  TknOperator160 = 'TknOperator160',
  TknLeftArrow = 'TknLeftArrow',
  TknRightArrow = 'TknRightArrow',
  TknEqual = 'TknEqual',
  TknQuestionMark = 'TknQuestionMark',
  TknUnion = 'TknUnion',
  TknAssignmentOperator = 'TknAssignmentOperator',
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
  TknAwait = 'TknAwait',
  TknAsync = 'TknAsync',
  // Other

  TknFlag = 'TknFlag',
  TknComment = 'TknComment',
  TknMarker = 'TknMarker',
  TknIdentifier = 'TknIdentifier',
}

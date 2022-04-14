// Error Enum
export const enum BriskErrorType {
  // Brisk Error
  CompilerError,
  FeatureNotYetImplemented,
  // Syntax Error
  CannotUseReservedKeyword,
  // Reference Error
  TypeNotFound,
  VariableNotFound,
  // Type Error
  InvalidFlag,
  FlagExpectedArguments,
  ConstantAssignment,
  DuplicateField,
  InvalidTypeName,
  TypeHasAlreadyBeenDeclared,
  OptionalParametersMustAppearLast,
  // Parser Error
  VariableHasAlreadyBeenDeclared,
  ImportStatementExpectedAtTop,
  ExportStatementExpectedAtBottom,
  DeclarationCannotOccurInsideSingleLineStatement,
}
// Error Strings
export const BriskErrorMessage = {
  // Brisk Error
  [BriskErrorType.CompilerError]: 'Compiler Bug Please Report',
  [BriskErrorType.FeatureNotYetImplemented]: 'Feature Not Yet Implemented',
  // Syntax Error
  [BriskErrorType.CannotUseReservedKeyword]: 'Cannot Use Reserved Keyword %1',
  // Reference Error
  // Type Error
  [BriskErrorType.InvalidFlag]: 'Flag %1 Is Not A Valid Flag',
  [BriskErrorType.FlagExpectedArguments]: 'Flag %1 Expected %2 Arguments, Found %3',
  [BriskErrorType.ConstantAssignment]: 'Unexpected Assignment To Constant %1',
  [BriskErrorType.DuplicateField]: 'Duplicate Field %1',
  [BriskErrorType.InvalidTypeName]: 'Invalid Type Name %1',
  [BriskErrorType.TypeHasAlreadyBeenDeclared]: 'Type %1 Has Already Been Declared',
  [BriskErrorType.TypeNotFound]: 'Type %1 Not Found',
  [BriskErrorType.OptionalParametersMustAppearLast]: 'Optional Parameters Must Appear Last In Function Defenition',
  // Parser Error
  [BriskErrorType.VariableHasAlreadyBeenDeclared]: 'Variable %1 Has Already Been Declared',
  [BriskErrorType.VariableNotFound]: 'Variable %1 Not Found',
  [BriskErrorType.ImportStatementExpectedAtTop]: 'Expected Import Statement At Top Of File',
  [BriskErrorType.ExportStatementExpectedAtBottom]: 'Expected Export Statement At Bottom Of File',
  [BriskErrorType.DeclarationCannotOccurInsideSingleLineStatement]: 'Declaration Cannot Occur Inside Single Line Statement'
}
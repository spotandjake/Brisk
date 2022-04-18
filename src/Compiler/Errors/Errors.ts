// Error Enum
export const enum BriskErrorType {
  // Brisk Error
  CompilerError,
  FeatureNotYetImplemented,
  ImportNotSupported,
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
  DuplicateExport,
  InvalidTypeName,
  TypeHasAlreadyBeenDeclared,
  OptionalParametersMustAppearLast,
  TypeMisMatch,
  TypeCouldNotBeInferred,
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
  [BriskErrorType.ImportNotSupported]: 'Your Current Environment Does Not Support Imports',
  // Syntax Error
  [BriskErrorType.CannotUseReservedKeyword]: 'Cannot Use Reserved Keyword %1',
  // Reference Error
  // Type Error
  [BriskErrorType.InvalidFlag]: 'Flag %1 Is Not A Valid Flag',
  [BriskErrorType.FlagExpectedArguments]: 'Flag %1 Expected %2 Arguments, Found %3',
  [BriskErrorType.ConstantAssignment]: 'Unexpected Assignment To Constant Variable %1',
  [BriskErrorType.DuplicateField]: 'Duplicate Field %1',
  [BriskErrorType.DuplicateExport]: 'Duplicate Export %1',
  [BriskErrorType.InvalidTypeName]: 'Invalid Type Name %1',
  [BriskErrorType.TypeHasAlreadyBeenDeclared]: 'Type %1 Has Already Been Declared',
  [BriskErrorType.TypeNotFound]: 'Type %1 Not Found',
  [BriskErrorType.OptionalParametersMustAppearLast]:
    'Optional Parameters Must Appear Last In Function Definition',
  [BriskErrorType.TypeMisMatch]: 'Mismatched Type Expected %1 Found %2',
  [BriskErrorType.TypeCouldNotBeInferred]: 'Type %1 Could Not Be Inferred',
  // Parser Error
  [BriskErrorType.VariableHasAlreadyBeenDeclared]: 'Variable %1 Has Already Been Declared',
  [BriskErrorType.VariableNotFound]: 'Variable %1 Not Found',
  [BriskErrorType.ImportStatementExpectedAtTop]: 'Expected Import Statement At Top Of File',
  [BriskErrorType.ExportStatementExpectedAtBottom]: 'Expected Export Statement At Bottom Of File',
  [BriskErrorType.DeclarationCannotOccurInsideSingleLineStatement]:
    'Declaration Cannot Occur Inside Single Line Statement',
};

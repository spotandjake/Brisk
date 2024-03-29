// Error Enum
export const enum BriskErrorType {
  // Brisk Error
  CompilerError,
  FeatureNotYetImplemented,
  ImportNotSupported,
  InvalidBreakDepth,
  InvalidOperator,
  // Syntax Error
  CannotUseReservedKeyword,
  ReturnStatementsOnlyValidInsideFunction,
  InvalidNumber,
  // Reference Error
  TypeNotFound,
  VariableNotFound,
  // Type Error
  InvalidFlag,
  FlagExpectedArguments,
  ConstantAssignment,
  DuplicateField,
  DuplicateExport,
  ModuleDoesNotExist,
  InvalidExport,
  InvalidTypeName,
  TypeHasAlreadyBeenDeclared,
  OptionalParametersMustAppearLast,
  TypeMisMatch,
  IncompatibleTypes,
  TypeCouldNotBeInferred,
  ArrayTypeLengthCouldNotBeInferred,
  InvalidArgumentLength,
  WasmExpressionUnknown,
  DeadCode,
  UnknownOperator,
  // Parser Error
  VariableHasAlreadyBeenDeclared,
  ImportStatementExpectedAtTop,
  ExportStatementExpectedAtBottom,
  NoDeclarationInSingleLineStatement,
  FlagStatementExpectedInBlockStatement,
  FlagStatementExpectsFollowingDefinition,
}
// Error Strings
export const BriskErrorMessage = {
  // Brisk Error
  [BriskErrorType.CompilerError]: 'A compiler bug has occurred',
  [BriskErrorType.FeatureNotYetImplemented]: 'Feature not yet implemented',
  [BriskErrorType.ImportNotSupported]: 'Your environment does not support imports',
  [BriskErrorType.InvalidBreakDepth]:
    'You Cannot Break Deeper Then The Current Loop, Current Depth %2, Break Depth %1',
  [BriskErrorType.InvalidOperator]: 'Operator %1 is invalid',
  // Syntax Error
  [BriskErrorType.CannotUseReservedKeyword]: 'Cannot use reserved keyword %1',
  [BriskErrorType.ReturnStatementsOnlyValidInsideFunction]:
    'Return statements must be inside a function',
  [BriskErrorType.InvalidNumber]: 'Number %1 is invalid',
  // Reference Error
  // Type Error
  [BriskErrorType.InvalidFlag]: 'Flag %1 does not exist',
  [BriskErrorType.FlagExpectedArguments]: 'Flag %1 expected %2 arguments, found %3',
  [BriskErrorType.ConstantAssignment]: 'Cannot assign to constant variable %1',
  [BriskErrorType.DuplicateField]: 'Duplicate field %1',
  [BriskErrorType.DuplicateExport]: 'Duplicate export %1',
  [BriskErrorType.ModuleDoesNotExist]: 'Module %1 does not exist',
  [BriskErrorType.InvalidExport]: 'Invalid export %1',
  [BriskErrorType.InvalidTypeName]: 'Invalid type name %1',
  [BriskErrorType.TypeHasAlreadyBeenDeclared]: 'Type %1 has already been declared',
  [BriskErrorType.TypeNotFound]: 'Type %1 does not exist',
  [BriskErrorType.OptionalParametersMustAppearLast]:
    'Optional parameters must appear last in parameter list',
  [BriskErrorType.TypeMisMatch]: 'Expected type %1 found %2',
  [BriskErrorType.IncompatibleTypes]: 'Type %1 is incompatible with %2',
  [BriskErrorType.TypeCouldNotBeInferred]: 'Type %1 cannot be inferred',
  [BriskErrorType.ArrayTypeLengthCouldNotBeInferred]: 'Array type length cannot be inferred',
  [BriskErrorType.InvalidArgumentLength]: 'Function expects a maximum of %1 arguments, found %2',
  [BriskErrorType.WasmExpressionUnknown]: 'Wasm instruction %1 does not exist',
  [BriskErrorType.DeadCode]: 'Dead code found',
  [BriskErrorType.UnknownOperator]: 'Unknown operator %1',
  // Parser Error
  [BriskErrorType.VariableHasAlreadyBeenDeclared]: 'Variable %1has already been declared',
  [BriskErrorType.VariableNotFound]: 'Variable %1 does not exist',
  [BriskErrorType.ImportStatementExpectedAtTop]: 'Import statements must appear at top of file',
  [BriskErrorType.ExportStatementExpectedAtBottom]:
    'Export statement must appear at bottom of file',
  [BriskErrorType.NoDeclarationInSingleLineStatement]: 'Declaration must appear in a scope',
  [BriskErrorType.FlagStatementExpectedInBlockStatement]:
    'Flag Statements Can Only Appear In Block Statements',
  [BriskErrorType.FlagStatementExpectsFollowingDefinition]:
    'Flag Statements Expect The Next Statement To Be A Definition',
};

// General Imports
import { Position } from '../../Types/Types';
import { AnalyzerProperties, TypeStack, VariableClosure, VariableStack } from './AnalyzerNodes';
// Node Types
export const enum NodeType {
  // Program
  Program,
  // Statements
  IfStatement,
  WhileStatement,
  BreakStatement,
  BreakIfStatement,
  ContinueStatement,
  ContinueIfStatement,
  FlagStatement,
  BlockStatement,
  ImportStatement,
  WasmImportStatement,
  ExportStatement,
  DeclarationStatement,
  AssignmentStatement,
  ReturnStatement,
  PostFixStatement,
  EnumDefinitionStatement,
  // Enums
  EnumVariant,
  // Expressions
  ComparisonExpression,
  ArithmeticExpression,
  UnaryExpression,
  ParenthesisExpression,
  TypeCastExpression,
  CallExpression,
  WasmCallExpression,
  // Literals
  StringLiteral,
  I32Literal,
  I64Literal,
  U32Literal,
  U64Literal,
  F32Literal,
  F64Literal,
  NumberLiteral,
  ConstantLiteral,
  FunctionLiteral,
  ArrayLiteral,
  ObjectLiteral,
  ObjectField,
  ValueSpread,
  // Types
  TypeAliasDefinition,
  InterfaceDefinition,
  TypePrimLiteral,
  TypeUnionLiteral,
  ArrayTypeLiteral,
  ParenthesisTypeLiteral,
  FunctionSignatureLiteral,
  InterfaceLiteral,
  InterfaceField,
  TypeUsage,
  GenericType,
  TypeIdentifier,
  // Vars
  VariableDefinition,
  VariableUsage,
  MemberAccess,
  PropertyUsage,
  Parameter,
  Arguments,
}
export const enum NodeCategory {
  General,
  Statement,
  Enum,
  Expression,
  Literal,
  Type,
  Variable,
}
// Program
export interface ProgramNode {
  nodeType: NodeType.Program;
  category: NodeCategory.General;
  name: string;
  body: Statement[];
  data: Omit<AnalyzerProperties, '_closure' | '_varStacks' | '_typeStacks'>;
  position: Position;
}
// Statements
export type Statement =
  | FlagNode
  | IfStatementNode
  | WhileStatementNode
  | BreakStatementNode
  | BreakIfStatementNode
  | ContinueStatementNode
  | ContinueIfStatementNode
  | BlockStatementNode
  | ImportStatementNode
  | WasmImportStatementNode
  | ExportStatementNode
  | DeclarationStatementNode
  | AssignmentStatementNode
  | TypeDefinition
  | ReturnStatementNode
  | EnumDefinitionStatementNode
  | EnumVariantNode
  | PostFixStatementNode
  | CallExpressionNode
  | WasmCallExpressionNode;
export interface IfStatementNode {
  nodeType: NodeType.IfStatement;
  category: NodeCategory.Statement;
  condition: Expression;
  body: Statement;
  alternative?: Statement;

  data: {
    pathReturns: boolean;
  };
  position: Position;
}
export interface WhileStatementNode {
  nodeType: NodeType.WhileStatement;
  category: NodeCategory.Statement;
  condition: Expression;
  body: Statement;
  data: {
    pathReturns: boolean;
  };
  position: Position;
}
export interface BreakStatementNode {
  nodeType: NodeType.BreakStatement;
  category: NodeCategory.Statement;
  depth: number;
  position: Position;
}
export interface BreakIfStatementNode {
  nodeType: NodeType.BreakIfStatement;
  category: NodeCategory.Statement;
  condition: Expression;
  depth: number;
  position: Position;
}
export interface ContinueStatementNode {
  nodeType: NodeType.ContinueStatement;
  category: NodeCategory.Statement;
  depth: number;
  position: Position;
}
export interface ContinueIfStatementNode {
  nodeType: NodeType.ContinueIfStatement;
  category: NodeCategory.Statement;
  condition: Expression;
  depth: number;
  position: Position;
}
export interface FlagNode {
  nodeType: NodeType.FlagStatement;
  category: NodeCategory.Statement;
  value: string;
  args: Expression[];
  position: Position;
}
export interface BlockStatementNode {
  nodeType: NodeType.BlockStatement;
  category: NodeCategory.Statement;
  body: Statement[];
  data: {
    // Properties
    _varStack: VariableStack;
    _typeStack: TypeStack;

    pathReturns: boolean;
  };
  position: Position;
}
export interface ImportStatementNode {
  nodeType: NodeType.ImportStatement;
  category: NodeCategory.Statement;
  variable: VariableDefinition;
  source: StringLiteralNode;
  position: Position;
}
export interface WasmImportStatementNode {
  nodeType: NodeType.WasmImportStatement;
  category: NodeCategory.Statement;
  typeSignature: TypeLiteral;
  variable: VariableDefinitionNode;
  source: StringLiteralNode;
  position: Position;
}
export interface ExportStatementNode {
  nodeType: NodeType.ExportStatement;
  category: NodeCategory.Statement;
  value: ExportStatementValue;
  position: Position;
}
export type ExportStatementValue =
  | VariableUsageNode
  | DeclarationStatementNode
  | ObjectLiteralNode
  | InterfaceDefinitionNode
  | EnumDefinitionStatementNode
  | TypeAliasDefinitionNode;
export const enum DeclarationTypes {
  Constant,
  Lexical,
}
export interface DeclarationStatementNode {
  nodeType: NodeType.DeclarationStatement;
  category: NodeCategory.Statement;
  declarationType: DeclarationTypes;
  name: VariableDefinition;
  varType: TypeLiteral;
  value: Expression;
  flags: FlagNode[];
  position: Position;
}
export interface AssignmentStatementNode {
  nodeType: NodeType.AssignmentStatement;
  category: NodeCategory.Statement;
  name: VariableUsage;
  value: Expression;
  position: Position;
}
export interface ReturnStatementNode {
  nodeType: NodeType.ReturnStatement;
  category: NodeCategory.Statement;
  returnValue: Expression | undefined;
  data: {
    pathReturns: boolean;
  };
  position: Position;
}
export const enum PostFixOperator {
  Increment,
  Decrement,
}
export interface PostFixStatementNode {
  nodeType: NodeType.PostFixStatement;
  category: NodeCategory.Statement;
  operator: PostFixOperator;
  name: VariableUsage;
  position: Position;
}
// Enums
export interface EnumDefinitionStatementNode {
  nodeType: NodeType.EnumDefinitionStatement;
  category: NodeCategory.Statement;
  name: string;
  variants: EnumVariantNode[];
  genericTypes: GenericTypeNode[] | undefined;
  reference?: number;
  data: {
    _typeStack: TypeStack;
  };
  position: Position;
}
export interface EnumVariantNode {
  nodeType: NodeType.EnumVariant;
  category: NodeCategory.Enum;
  identifier: string;
  value: undefined | Expression | TypeLiteral[];
  position: Position;
}
// Expression Symbols
export const enum ComparisonExpressionOperator {
  ComparisonEqual,
  ComparisonNotEqual,
  ComparisonLessThan,
  ComparisonGreaterThan,
  ComparisonLessThanOrEqual,
  ComparisonGreaterThanOrEqual,
  ComparisonAnd,
  ComparisonOr,
}
export const enum ArithmeticExpressionOperator {
  ArithmeticAdd,
  ArithmeticSub,
  ArithmeticMul,
  ArithmeticDiv,
  ArithmeticPow,
}
export const enum UnaryExpressionOperator {
  UnaryNot,
  UnaryPositive,
  UnaryNegative,
}
// Expressions
export type Expression =
  | ComparisonExpressionNode
  | ArithmeticExpressionNode
  | UnaryExpressionNode
  | ParenthesisExpressionNode
  | TypeCastExpression
  | CallExpressionNode
  | WasmCallExpressionNode
  | Atom;

export interface ComparisonExpressionNode {
  nodeType: NodeType.ComparisonExpression;
  category: NodeCategory.Expression;
  lhs: Expression;
  operator: ComparisonExpressionOperator;
  operatorImage: string;
  rhs: Expression;
  position: Position;
}
export interface ArithmeticExpressionNode {
  nodeType: NodeType.ArithmeticExpression;
  category: NodeCategory.Expression;
  lhs: Expression;
  operator: ArithmeticExpressionOperator;
  operatorImage: string;
  rhs: Expression;
  position: Position;
}
export interface UnaryExpressionNode {
  nodeType: NodeType.UnaryExpression;
  category: NodeCategory.Expression;
  operator: UnaryExpressionOperator;
  value: Expression;
  position: Position;
}
export interface ParenthesisExpressionNode {
  nodeType: NodeType.ParenthesisExpression;
  category: NodeCategory.Expression;
  value: Expression;
  position: Position;
}
export interface TypeCastExpression {
  nodeType: NodeType.TypeCastExpression;
  category: NodeCategory.Expression;
  value: Expression;
  typeLiteral: TypeLiteral;
  position: Position;
}
export interface CallExpressionNode {
  nodeType: NodeType.CallExpression;
  category: NodeCategory.Expression;
  callee: Expression;
  args: Expression[];
  statement: boolean;
  position: Position;
}
export interface WasmCallExpressionNode {
  nodeType: NodeType.WasmCallExpression;
  category: NodeCategory.Expression;
  name: string;
  args: Expression[];
  statement: boolean;
  position: Position;
}
// Literals
export type Atom = Literal | VariableUsageNode | MemberAccessNode;
export type Literal =
  | StringLiteralNode
  | I32LiteralNode
  | I64LiteralNode
  | U32LiteralNode
  | U64LiteralNode
  | F32LiteralNode
  | F64LiteralNode
  | NumberLiteralNode
  | ConstantLiteralNode
  | FunctionLiteralNode
  | ArrayLiteralNode
  | ObjectLiteralNode;
export interface StringLiteralNode {
  nodeType: NodeType.StringLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface I32LiteralNode {
  nodeType: NodeType.I32Literal;
  category: NodeCategory.Literal;
  value: number;
  position: Position;
}
export interface I64LiteralNode {
  nodeType: NodeType.I64Literal;
  category: NodeCategory.Literal;
  value: bigint;
  position: Position;
}
export interface U32LiteralNode {
  nodeType: NodeType.U32Literal;
  category: NodeCategory.Literal;
  value: number;
  position: Position;
}
export interface U64LiteralNode {
  nodeType: NodeType.U64Literal;
  category: NodeCategory.Literal;
  value: bigint;
  position: Position;
}
export interface F32LiteralNode {
  nodeType: NodeType.F32Literal;
  category: NodeCategory.Literal;
  value: number;
  position: Position;
}
export interface F64LiteralNode {
  nodeType: NodeType.F64Literal;
  category: NodeCategory.Literal;
  value: number;
  position: Position;
}
export interface NumberLiteralNode {
  nodeType: NodeType.NumberLiteral;
  category: NodeCategory.Literal;
  value: number;
  position: Position;
}
export interface ConstantLiteralNode {
  nodeType: NodeType.ConstantLiteral;
  category: NodeCategory.Literal;
  value: 'true' | 'false' | 'void';
  position: Position;
}
export interface FunctionLiteralNode {
  nodeType: NodeType.FunctionLiteral;
  category: NodeCategory.Literal;
  params: ParameterNode[];
  returnType: TypeLiteral;
  body: BlockStatementNode | Expression;
  genericTypes: undefined | GenericTypeNode[];
  data: {
    _closure: VariableClosure;
    _varStack: VariableStack;
    _typeStack: TypeStack;

    pathReturns: boolean;
  };
  position: Position;
}
export interface ArrayLiteralNode {
  nodeType: NodeType.ArrayLiteral;
  length: number;
  category: NodeCategory.Literal;
  elements: (Expression | ValueSpreadNode)[];
  position: Position;
}
export interface ObjectLiteralNode {
  nodeType: NodeType.ObjectLiteral;
  category: NodeCategory.Literal;
  fields: (ObjectFieldNode | ValueSpreadNode)[];
  position: Position;
}
export interface ObjectFieldNode {
  nodeType: NodeType.ObjectField;
  category: NodeCategory.Literal;
  name: string;
  fieldValue: Expression;
  fieldMutable: boolean;
  position: Position;
}
export interface ValueSpreadNode {
  nodeType: NodeType.ValueSpread;
  category: NodeCategory.Literal;
  value: Expression;
  position: Position;
}

// Types
export type TypeDefinition = TypeAliasDefinitionNode | InterfaceDefinitionNode;
export type TypeLiteral =
  | BaseTypes
  | ParenthesisTypeLiteralNode
  | TypeUsageNode
  | TypeUnionLiteralNode
  | InterfaceLiteralNode
  | ArrayTypeLiteralNode
  | FunctionSignatureLiteralNode;
export type BaseTypes =
  | TypePrimLiteralNode
  | TypeBaseUnionLiteralNode
  | ArrayBaseTypeLiteralNode
  | FunctionBaseSignatureLiteralNode
  | InterfaceBaseLiteralNode
  | EnumDefinitionStatementNode
  | GenericTypeNode;
// Type Definition
export interface TypeAliasDefinitionNode {
  nodeType: NodeType.TypeAliasDefinition;
  category: NodeCategory.Type;
  name: string;
  typeLiteral: TypeLiteral;
  genericTypes: GenericTypeNode[] | undefined;
  reference?: number;
  data: {
    _typeStack: TypeStack;
  };
  position: Position;
}
export interface InterfaceDefinitionNode {
  nodeType: NodeType.InterfaceDefinition;
  category: NodeCategory.Type;
  name: string;
  typeLiteral: InterfaceLiteralNode | InterfaceBaseLiteralNode;
  genericTypes: undefined | GenericTypeNode[];
  reference?: number;
  data: {
    _typeStack: TypeStack;
  };
  position: Position;
}
// TypeLiteral
// TODO: Port Number, String, Boolean into brisk
export type PrimTypes =
  | 'u32'
  | 'u64'
  | 'i32'
  | 'i64'
  | 'f32'
  | 'f64'
  | 'Boolean'
  | 'Void'
  | 'String'
  | 'Number'
  | 'Function'
  | 'Unknown' // This type is internal only so we do not have it in our types array
  | 'Any';
export const primTypes: Set<PrimTypes> = new Set([
  'u32',
  'u64',
  'i32',
  'i64',
  'f32',
  'f64',
  'Boolean',
  'Void',
  'String',
  'Number',
  'Function',
  'Any',
]);
export const stackTypes: Set<PrimTypes> = new Set([
  'u32',
  'u64',
  'i32',
  'i64',
  'f32',
  'f64',
  'Boolean',
  'Void',
]);
export interface TypePrimLiteralNode {
  nodeType: NodeType.TypePrimLiteral;
  category: NodeCategory.Type;
  name: PrimTypes;
  position: Position;
}
export interface TypeUnionLiteralNode {
  nodeType: NodeType.TypeUnionLiteral;
  category: NodeCategory.Type;
  types: TypeLiteral[];
  position: Position;
}
export interface TypeBaseUnionLiteralNode {
  nodeType: NodeType.TypeUnionLiteral;
  category: NodeCategory.Type;
  types: BaseTypes[];
  position: Position;
}
export interface ArrayTypeLiteralNode {
  nodeType: NodeType.ArrayTypeLiteral;
  category: NodeCategory.Type;
  length?: NumberLiteralNode;
  value: TypeLiteral;
  position: Position;
}
export interface ArrayBaseTypeLiteralNode {
  nodeType: NodeType.ArrayTypeLiteral;
  category: NodeCategory.Type;
  length?: NumberLiteralNode;
  value: BaseTypes;
  position: Position;
}
export interface ParenthesisTypeLiteralNode {
  nodeType: NodeType.ParenthesisTypeLiteral;
  category: NodeCategory.Type;
  value: TypeLiteral;
  position: Position;
}
export interface FunctionSignatureLiteralNode {
  nodeType: NodeType.FunctionSignatureLiteral;
  category: NodeCategory.Type;
  params: TypeLiteral[];
  returnType: TypeLiteral;
  genericTypes: undefined | GenericTypeNode[];
  data: {
    _typeStack: TypeStack;
  };
  position: Position;
}
export interface FunctionBaseSignatureLiteralNode {
  nodeType: NodeType.FunctionSignatureLiteral;
  category: NodeCategory.Type;
  params: BaseTypes[];
  returnType: BaseTypes;
  genericTypes: undefined | GenericTypeNode[];
  data: {
    _typeStack: TypeStack;
  };
  position: Position;
}
export interface InterfaceLiteralNode {
  nodeType: NodeType.InterfaceLiteral;
  category: NodeCategory.Type;
  fields: InterfaceFieldNode[];
  position: Position;
}
export interface InterfaceBaseLiteralNode {
  nodeType: NodeType.InterfaceLiteral;
  category: NodeCategory.Type;
  fields: InterfaceBaseFieldNode[];
  position: Position;
}
// TypeUsage
export interface TypeUsageNode {
  nodeType: NodeType.TypeUsage;
  category: NodeCategory.Type;
  name: string;
  reference?: number;
  position: Position;
}
// General Type Stuff
export interface InterfaceFieldNode {
  nodeType: NodeType.InterfaceField;
  category: NodeCategory.Type;
  name: string;
  fieldType: TypeLiteral;
  optional: boolean;
  mutable: boolean;
  position: Position;
}
export interface InterfaceBaseFieldNode {
  nodeType: NodeType.InterfaceField;
  category: NodeCategory.Type;
  name: string;
  fieldType: BaseTypes;
  optional: boolean;
  mutable: boolean;
  position: Position;
}
export interface GenericTypeNode {
  nodeType: NodeType.GenericType;
  category: NodeCategory.Type;
  name: string;
  constraints: undefined | TypeLiteral;
  valueType: undefined | TypeLiteral;
  reference?: number;
  position: Position;
}
export interface TypeIdentifierNode {
  nodeType: NodeType.TypeIdentifier;
  category: NodeCategory.Type;
  name: string;
  position: Position;
}
// Variables
export type VariableUsage = VariableUsageNode | MemberAccessNode;
export type VariableDefinition = VariableDefinitionNode;
export interface VariableDefinitionNode {
  nodeType: NodeType.VariableDefinition;
  category: NodeCategory.Variable;
  name: string;
  reference?: number;
  position: Position;
}
export interface VariableUsageNode {
  nodeType: NodeType.VariableUsage;
  category: NodeCategory.Variable;
  name: string;
  reference?: number;
  position: Position;
}
export interface PropertyUsageNode {
  nodeType: NodeType.PropertyUsage;
  category: NodeCategory.Variable;
  name: string;
  property?: PropertyUsageNode;
  position: Position;
}
export interface MemberAccessNode {
  nodeType: NodeType.MemberAccess;
  category: NodeCategory.Variable;
  parent: Expression;
  property: PropertyUsageNode;
  position: Position;
}
// General
export interface ParameterNode {
  nodeType: NodeType.Parameter;
  category: NodeCategory.Variable;
  name: VariableDefinition;
  optional: boolean;
  mutable: boolean;
  paramType: TypeLiteral;
  position: Position;
}
export interface ArgumentsNode {
  nodeType: NodeType.Arguments;
  category: NodeCategory.General;
  length: number;
  args: Expression[];
  position: Position;
}

// Export Every Node
type Node =
  | ProgramNode
  | Statement
  | Expression
  | ParameterNode
  | TypeDefinition
  | TypeLiteral
  | PropertyUsageNode;

export default Node;

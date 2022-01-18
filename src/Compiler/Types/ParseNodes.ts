// General Imports
import { Position } from './Types';
// Node Types
export const enum NodeType {
  // Program
  Program,
  // Statements
  IfStatement,
  FlagStatement,
  BlockStatement,
  ImportStatement,
  WasmImportStatement,
  ExportStatement,
  DeclarationStatement,
  AssignmentStatement,
  // Expressions
  ComparisonExpression,
  ArithmeticExpression,
  TypeCastExpression,
  LogicExpression,
  ParenthesisExpression,
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
  // Types
  TypeAliasDefinition,
  InterfaceDefinition,
  TypePrimLiteral,
  TypeUnionLiteral,
  ParenthesisTypeLiteral,
  FunctionSignatureLiteral,
  InterfaceLiteral,
  InterfaceField,
  TypeUsage,
  TypeIdentifier,
  // Vars
  VariableDefinition,
  VariableUsage,
  MemberAccess,
  Parameter,
  // WhiteSpace
  WhiteSpace,
}
export const enum NodeCategory {
  General,
  Statement,
  Expression,
  Literal,
  Type,
  Variable, // TODO: we should come up with a better name for this
  WhiteSpace,
}
// Program
export interface ProgramNode {
  nodeType: NodeType.Program;
  category: NodeCategory.General;
  body: Statement[];
  position: Position;
}
// Statements
export type Statement =
  | FlagNode
  | IfStatementNode
  | BlockStatementNode
  | ImportStatementNode
  | WasmImportStatementNode
  | ExportStatementNode
  | DeclarationStatementNode
  | AssignmentStatementNode
  | TypeDefinition;
export interface IfStatementNode {
  nodeType: NodeType.IfStatement;
  category: NodeCategory.Statement;
  condition: Expression;
  body: Statement;
  alternative?: Statement;
  position: Position;
}
export interface FlagNode {
  nodeType: NodeType.FlagStatement;
  category: NodeCategory.Statement;
  value: string;
  position: Position;
}
export interface BlockStatementNode {
  nodeType: NodeType.BlockStatement;
  category: NodeCategory.Statement;
  body: Statement[];
  position: Position;
}
export interface ImportStatementNode {
  nodeType: NodeType.ImportStatement;
  category: NodeCategory.Statement;
  variable: VariableDefinitionNode; // TODO: we want to add support for destructuring imports
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
  variable: Variable; // TODO: we want to add support for exporting objects
  position: Position;
}
export const enum DeclarationTypes {
  Constant,
  Lexical,
}
export interface DeclarationStatementNode {
  nodeType: NodeType.DeclarationStatement;
  category: NodeCategory.Statement;
  declarationType: DeclarationTypes;
  name: VariableDefinitionNode;
  varType: TypeLiteral;
  value: Expression;
  position: Position;
}
export interface AssignmentStatementNode {
  nodeType: NodeType.AssignmentStatement;
  category: NodeCategory.Statement;
  name: Variable;
  value: Expression;
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
}
export const enum ArithmeticExpressionOperator {
  ArithmeticAdd,
  ArithmeticSub,
  ArithmeticMul,
  ArithmeticDiv,
  ArithmeticPow,
}
export const enum LogicalExpressionOperator {
  LogicalNot,
}
// Expressions
export type Expression =
  | ComparisonExpressionNode
  | ArithmeticExpressionNode
  | TypeCastExpressionNode
  | LogicExpressionNode
  | ParenthesisExpressionNode
  | CallExpressionNode
  | WasmCallExpressionNode
  | Atom;

export interface ComparisonExpressionNode {
  nodeType: NodeType.ComparisonExpression;
  category: NodeCategory.Expression;
  lhs: Expression;
  operator: ComparisonExpressionOperator;
  rhs: Expression;
  position: Position;
}
export interface ArithmeticExpressionNode {
  nodeType: NodeType.ArithmeticExpression;
  category: NodeCategory.Expression;
  lhs: Expression;
  operator: ArithmeticExpressionOperator;
  rhs: Expression;
  position: Position;
}
export interface TypeCastExpressionNode {
  nodeType: NodeType.TypeCastExpression;
  category: NodeCategory.Expression;
  castType: TypeLiteral;
  value: Expression;
  position: Position;
}
export interface LogicExpressionNode {
  nodeType: NodeType.LogicExpression;
  category: NodeCategory.Expression;
  operator: LogicalExpressionOperator;
  value: Expression;
  position: Position;
}
export interface ParenthesisExpressionNode {
  nodeType: NodeType.ParenthesisExpression;
  category: NodeCategory.Expression;
  value: Expression;
  position: Position;
}
export interface CallExpressionNode {
  nodeType: NodeType.CallExpression;
  category: NodeCategory.Expression;
  name: Variable;
  args: Expression[];
  position: Position;
}
export interface WasmCallExpressionNode {
  nodeType: NodeType.WasmCallExpression;
  category: NodeCategory.Expression;
  name: string;
  args: Expression[];
  position: Position;
}
// Literals
export type Atom =
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
  | VariableUsageNode
  | MemberAccessNode;
export interface StringLiteralNode {
  nodeType: NodeType.StringLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface I32LiteralNode {
  nodeType: NodeType.I32Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface I64LiteralNode {
  nodeType: NodeType.I64Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface U32LiteralNode {
  nodeType: NodeType.U32Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface U64LiteralNode {
  nodeType: NodeType.U64Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface F32LiteralNode {
  nodeType: NodeType.F32Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface F64LiteralNode {
  nodeType: NodeType.F64Literal;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface NumberLiteralNode {
  nodeType: NodeType.NumberLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface ConstantLiteralNode {
  nodeType: NodeType.ConstantLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface FunctionLiteralNode {
  nodeType: NodeType.FunctionLiteral;
  category: NodeCategory.Literal;
  returnType: TypeLiteral;
  params: ParameterNode[];
  body: Statement;
  position: Position;
}
// Types
export type TypeDefinition = TypeAliasDefinitionNode | InterfaceDefinitionNode;
export type TypeLiteral =
  | TypePrimLiteralNode
  | TypeUnionLiteralNode
  | ParenthesisTypeLiteralNode
  | FunctionSignatureLiteralNode
  | InterfaceLiteralNode
  | TypeUsageNode;
// Type Definition
export interface TypeAliasDefinitionNode {
  nodeType: NodeType.TypeAliasDefinition;
  category: NodeCategory.Type;
  name: string | number;
  typeLiteral: TypeLiteral;
  position: Position;
}
export interface InterfaceDefinitionNode {
  nodeType: NodeType.InterfaceDefinition;
  category: NodeCategory.Type;
  name: string | number;
  typeLiteral: TypeLiteral;
  position: Position;
}
// TypeLiteral
// TODO: Port Number, String , Boolean into brisk
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
  | 'Any';
export const primTypes: PrimTypes[] = [
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
];
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
  position: Position;
}
export interface InterfaceLiteralNode {
  nodeType: NodeType.InterfaceLiteral;
  category: NodeCategory.Type;
  fields: InterfaceFieldNode[];
  position: Position;
}
// TypeUsage
export interface TypeUsageNode {
  nodeType: NodeType.TypeUsage;
  category: NodeCategory.Type;
  name: string | number;
  position: Position;
}
// General Type Stuff
export interface InterfaceFieldNode {
  nodeType: NodeType.InterfaceField;
  category: NodeCategory.Type;
  name: string;
  fieldType: TypeLiteral;
  position: Position;
}
export interface TypeIdentifierNode {
  nodeType: NodeType.TypeIdentifier;
  category: NodeCategory.Type;
  name: string;
  position: Position;
}
// Variables
// TODO: these should probably just be identifier and member something because are not necessarily variables.
export type Variable = VariableUsageNode | MemberAccessNode;
export interface VariableDefinitionNode {
  nodeType: NodeType.VariableDefinition;
  category: NodeCategory.Variable;
  name: string | number;
  position: Position;
}
export interface VariableUsageNode {
  nodeType: NodeType.VariableUsage;
  category: NodeCategory.Variable;
  name: string | number;
  position: Position;
}
export interface MemberAccessNode {
  nodeType: NodeType.MemberAccess;
  category: NodeCategory.Variable;
  name: VariableUsageNode;
  child?: Variable;
  position: Position;
}
// WhiteSpace
export interface WhiteSpaceNode {
  nodeType: NodeType.WhiteSpace;
  category: NodeCategory.WhiteSpace;
  value: string;
  position: Position;
}
// General
export interface ParameterNode {
  nodeType: NodeType.Parameter;
  category: NodeCategory.Variable;
  name: VariableDefinitionNode;
  paramType: TypeLiteral;
}

// Export Every Node
type Node = ProgramNode | Statement | Expression | ParameterNode | TypeDefinition | TypeLiteral;

export default Node;

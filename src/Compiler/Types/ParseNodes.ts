// General Imports
import { Position } from './Types';
// Node Types
export const enum NodeType {
  // Program
  Program,
  // Statements
  FlagStatement,
  BlockStatement,
  ImportStatement,
  WasmImportStatement,
  ExportStatement,
  DeclarationStatement,
  AssignmentStatement,
  // Expressions
  CallExpression,
  WasmCallExpression,
  LogicExpression,
  ParenthesisExpression,
  // Literals
  StringLiteral,
  NumberLiteral,
  ConstantLiteral,
  FunctionLiteral,
  // Types
  FunctionType,
  Type,
  // Vars
  Variable,
  MemberAccess,
  // WhiteSpace
  WhiteSpace
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
  FlagNode | BlockStatementNode
  ;
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
  variable: VariableNode; // TODO: we want to add support for destructuring imports
  source: StringLiteralNode;
  position: Position;
}
export interface WasmImportStatementNode {
  nodeType: NodeType.WasmImportStatement;
  category: NodeCategory.Statement;
  typeSignature: Type;
  variable: VariableNode;
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
  name: VariableNode;
  varType: Type;
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
export const enum LogicalExpressionOperator {
  LogicalNot,
}
// Expressions
export type Expression =
  CallExpressionNode | WasmCallExpressionNode | ParenthesisExpressionNode |
  Atom
  ;
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
  name: string[];
  args: Expression[];
  position: Position;
}
export interface LogicExpressionNode {
  nodeType: NodeType.LogicExpression;
  category: NodeCategory.Expression;
  logicalOperator: LogicalExpressionOperator;
  value: Expression;
  position: Position;
}
export interface ParenthesisExpressionNode {
  nodeType: NodeType.ParenthesisExpression;
  category: NodeCategory.Expression;
  value: Expression;
  position: Position;
}
// Literals
export type Atom =
  StringLiteralNode |
  NumberLiteralNode |
  ConstantLiteralNode |
  FunctionLiteralNode |
  VariableNode |
  MemberAccessNode
  ;
export interface StringLiteralNode {
  nodeType: NodeType.StringLiteral;
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
  nodeType: NodeType.StringLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface FunctionLiteralNode {
  nodeType: NodeType.FunctionLiteral;
  category: NodeCategory.Literal;
  returnType: TypeNode;
  params: ParameterNode[];
  body: Statement;
  position: Position;
}
// Types
export type Type = FunctionTypeNode | TypeNode;
export interface FunctionTypeNode {
  nodeType: NodeType.FunctionType;
  category: NodeCategory.Type;
  params: TypeNode[];
  returnType: TypeNode;
  position: Position;
}
export interface TypeNode {
  nodeType: NodeType.Type;
  category: NodeCategory.Type;
  name: string;
  position: Position;
}
// Variables
// TODO: these should probably just be identifier and member something because are not necessarily variables.
export type Variable = VariableNode | MemberAccessNode;
export interface VariableNode {
  nodeType: NodeType.Variable;
  category: NodeCategory.Variable;
  name: string;
  position: Position;
}
export interface MemberAccessNode {
  nodeType: NodeType.MemberAccess;
  category: NodeCategory.Variable;
  name: VariableNode;
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
  name: Variable;
  paramType: TypeNode;
}
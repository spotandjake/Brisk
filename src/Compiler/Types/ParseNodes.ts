// General Imports
import { Position } from './Types';
// Node Types
// TODO: issue with enums with swc
export const enum NodeType {
  // Program
  Program,
  // Statements
  FlagStatement,
  BlockStatement,
  ImportStatement,
  WasmImportStatement,
  ExportStatement,
  // Literals
  StringLiteral,
  NumberLiteral,
  ConstantLiteral,
  FunctionLiteral,
  // Vars
  Variable,
  PropertyAccess,
  // WhiteSpace
  WhiteSpace
}
export const enum NodeCategory {
  General,
  Statement,
  Literal,
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
  variable: Variable; // TODO: we want to add support for destructuring imports
  source: StringLiteral;
  position: Position;
}
export interface WasmImportStatementNode {
  nodeType: NodeType.WasmImportStatement;
  category: NodeCategory.Statement;
  typeSignature: TypeSignature;
  variable: Variable; // TODO: we want to add support for destructuring imports
  source: StringLiteral;
  position: Position;
}
export interface ExportStatementNode {
  nodeType: NodeType.ExportStatement;
  category: NodeCategory.Statement;
  variable: Variable; // TODO: we want to add support for destructuring imports
  position: Position;
}
// Literals
export type Atom =
  StringLiteral |
  NumberLiteral |
  ConstantLiteral |
  FunctionLiteral |
  Variable |
  PropertyAccess
  ;
export interface StringLiteral {
  nodeType: NodeType.StringLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface NumberLiteral {
  nodeType: NodeType.NumberLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface ConstantLiteral {
  nodeType: NodeType.StringLiteral;
  category: NodeCategory.Literal;
  value: string;
  position: Position;
}
export interface FunctionLiteral {
  nodeType: NodeType.FunctionLiteral;
  category: NodeCategory.Literal;
  // returnType TODO: Add Return Type
  // params: []; TODO: Add Params
  body: Statement;
  position: Position;
}
// Variables
// TODO: these should probably just be identifier and member something because are not necessarily variables.
export interface Variable {
  nodeType: NodeType.Variable;
  category: NodeCategory.Variable;
  name: string;
  position: Position;
}
export interface PropertyAccess {
  nodeType: NodeType.PropertyAccess;
  category: NodeCategory.Variable;
  name: string;
  child?: PropertyAccess;
  position: Position;
}
// WhiteSpace
export interface WhiteSpace {
  nodeType: NodeType.WhiteSpace;
  category: NodeCategory.WhiteSpace;
  value: string;
  position: Position;
}
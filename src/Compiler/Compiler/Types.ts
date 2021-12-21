import { Position } from '../Types';
import { Stack } from './Helpers'; //TODO: replace helpers with normal stuff
// Lexer
export const enum LexemeType {
  keyword,
  separator,
  operator,
  literal,
  flag,
  comment,
  identifier
}
interface Lexeme {
  type: LexemeType;
  id: string;
  value?: (text: string) => string | number | boolean | bigint;
  match: RegExp;
  lineBreaks?: boolean;
}
interface Token {
  type: string;
  value: string | number | boolean | bigint;
  text: string;
  offset: number;
  line: number;
  col: number;
  file: string;
}
// Parser
export const enum HeapTypeID {
  None = 0,
  Function = 1,
  Closure = 2,
  Boolean = 3, // Deprecated
  String = 4,
  Number = 5,
  Array = 6,
  Parameters = 7
}
export const enum ParseTreeNodeType {
  Program,
  importStatement,
  importWasmStatement,
  exportStatement,
  declarationStatement,
  callStatement,
  flagStatement,
  commentStatement,
  blockStatement,
  ifStatement,
  variable,
  literal,
  functionNode,
  functionParameter,
  functionType
}
export type ParseTreeNode = Program | Statement | ExpressionNode | FunctionParameterNode;
export type Import = (boolean | string[]);
export interface Program {
  type: ParseTreeNodeType.Program;
  flags: FlagStatementNode[];
  variables?: Stack;
  globals?: any[];
  body: Statement[];
  exports: string[];
  imports: { path: string; identifiers: Import; }[];
  position: Position;
}
export type Statement =
  ImportStatementNode | ImportWasmStatementNode | ExportStatementNode |
  DeclarationStatementNode | CallStatementNode | FlagStatementNode |
  CommentStatementNode | BlockStatementNode | IfStatementNode;
export interface ImportStatementNode {
  type: ParseTreeNodeType.importStatement;
  identifier: string;
  path: string;
  position: Position;
}
export interface ImportWasmStatementNode {
  type: ParseTreeNodeType.importWasmStatement;
  dataType: TypeNode;
  identifier: string;
  path: string;
  position: Position;
}
export interface ExportStatementNode {
  type: ParseTreeNodeType.exportStatement;
  identifier: string;
  position: Position;
}
export interface DeclarationStatementNode {
  type: ParseTreeNodeType.declarationStatement;
  dataType: TypeNode;
  identifier: string;
  value: ExpressionNode;
  position: Position;
}
export interface CallStatementNode {
  type: ParseTreeNodeType.callStatement;
  identifier: string;
  arguments: ExpressionNode[];
  position: Position;
}
export interface FlagStatementNode {
  type: ParseTreeNodeType.flagStatement;
  value: string;
  position: Position;
}
export interface CommentStatementNode {
  type: ParseTreeNodeType.commentStatement;
  value: string;
  position: Position;
}
export interface BlockStatementNode {
  type: ParseTreeNodeType.blockStatement;
  variables?: Stack;
  body: Statement[];
  position: Position;
}
export interface IfStatementNode {
  type: ParseTreeNodeType.ifStatement;
  condition: ExpressionNode;
  body: Statement;
  alternate?: Statement;
  position: Position;
}
export type ExpressionNode =
  LiteralNode | FunctionNode | CallStatementNode | VariableNode;

export interface VariableNode {
  type: ParseTreeNodeType.variable;
  identifier: string;
  position: Position;
}
export interface LiteralNode {
  type: ParseTreeNodeType.literal;
  dataType: TypeNode;
  value: string | number | boolean | bigint;
  position: Position;
}
export interface FunctionNode {
  type: ParseTreeNodeType.functionNode;
  dataType: TypeNode;
  flags: FlagStatementNode[];
  variables?: Stack;
  parameters: FunctionParameterNode[];
  body: Statement[];
  position: Position;
}
export interface FunctionParameterNode {
  type: ParseTreeNodeType.functionParameter;
  dataType: TypeNode;
  identifier: string;
  position: Position;
}
export type TypeNode = FunctionTypeNode | string;
export interface FuncTypeNode {
  value: FunctionTypeNode;
}
export interface FunctionTypeNode {
  type: ParseTreeNodeType.functionType;
  params: TypeNode[];
  result: TypeNode;
}
// Exports
export {
  // Lexer
  Lexeme,
  Token,
  // Parser
};
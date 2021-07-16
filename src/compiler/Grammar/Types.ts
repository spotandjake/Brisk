// Type Imports
import { Stack } from '../Helpers/Helpers';
import * as path from 'path';
// General Nodes
export interface Position {
  offset: number;
  line: number;
  col: number;

  file?: path.ParsedPath;
}
export interface Token {
  type: string;
  value: string | number | boolean | bigint;
  text: string;
  offset: number;
  line: number;
  col: number;
}
// ParseTreeTypes
export type ParseTreeNode = Program | ProgramNode | Statement | ExpressionNode | FunctionParameterNode;
export interface LinkedModule {
  type: 'Program';
  flags: FlagStatementNode[];
  variables: Stack;
  body: Statement[];
  exports: string[];
  imports: string[];
  imported: string[];
  position: Position;
}
export interface Program {
  type: 'Program';
  flags: FlagStatementNode[];
  variables: Stack;
  body: Statement[];
  exports: string[];
  imports: string[];
  position: Position;
}
export interface ProgramNode {
  type: 'Program';
  body: Statement[];
  exports?: string[];
  imports?: string[];
  position: Position;
}
export type Statement = 
  ImportStatementNode      | ImportWasmStatementNode | ExportStatementNode |
  DeclarationStatementNode | CallStatementNode       | FlagStatementNode   |
  CommentStatementNode     | BlockStatementNode;
export interface ImportStatementNode {
  type: 'importStatement';
  identifier: string;
  path: string;
  position: Position;
}
export interface ImportWasmStatementNode {
  type: 'importWasmStatement';
  dataType: TypeNode;
  identifier: string;
  path: string;
  position: Position;
}
export interface ExportStatementNode {
  type: 'exportStatement';
  identifier: string;
  position: Position;
}
export interface DeclarationStatementNode {
  type: 'declarationStatement';
  dataType: TypeNode;
  identifier: string;
  value: ExpressionNode;
  position: Position;
}
export interface CallStatementNode {
  type: 'callStatement';
  identifier: string;
  arguments: ExpressionNode[];
  position: Position;
}
export interface FlagStatementNode {
  type: 'flagStatement';
  value: string;
  position: Position;
}
export interface CommentStatementNode {
  type: 'commentStatement';
  value: string;
  position: Position;
}
export interface BlockStatementNode {
  type: 'blockStatement';
  variables?: Stack;
  body: Statement[];
  position: Position;
}
export type ExpressionNode = 
  LiteralNode | FunctionDeclarationNode | FunctionNode | CallStatementNode | VariableNode;

export interface VariableNode {
  type: 'variable';
  identifier: string;
  position: Position;
}
export interface LiteralNode {
  type: 'literal';
  dataType: TypeNode;
  value: string | number | boolean | bigint;
  position: Position;
}
export interface FunctionNode {
  type: 'functionNode';
  dataType: TypeNode;
  flags: FlagStatementNode[];
  variables: Stack;
  parameters: FunctionParameterNode[];
  body: Statement[];
  position: Position;
}
export interface FunctionDeclarationNode {
  type: 'functionDeclaration';
  dataType: TypeNode;
  parameters: FunctionParameterNode[];
  body: Statement[];
  position: Position;
}
export interface FunctionParameterNode {
  type: 'functionParameter';
  dataType: TypeNode;
  identifier: string;
  position: Position;
}
export type TypeNode = FunctionTypeNode | string;
export interface FuncTypeNode {
  value: FunctionTypeNode;
}
export interface FunctionTypeNode {
  type: 'functionType';
  params: TypeNode[];
  result: TypeNode;
}
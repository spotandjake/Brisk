// Type Imports
import { Stack } from '../Helpers/Helpers';
// General Nodes
export interface Position {
  offset: number;
  line: number;
  col: number;
}
export interface mooNode {
  type?: string;
  value: string | number | boolean;
  text: string;
  toString(): string;
  offset: number;
  lineBreaks: number;
  line: number;
  col: number;
}
// ParseTreeTypes
export type ParseTreeNode = Program | ProgramNode | Statement | ExpressionNode | FunctionParameterNode;
export interface Program {
  type: 'Program';
  flags: FlagStatementNode[];
  variables: Stack;
  body: Statement[];
}
export interface ProgramNode {
  type: 'Program';
  body: Statement[];
}
export type Statement = 
  ImportStatementNode | ExportStatementNode | DeclarationStatementNode |
  CallStatementNode   | FlagStatementNode   | CommentStatementNode;
export interface ImportStatementNode {
  type: 'importStatement';
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
  dataType: string;
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

export type ExpressionNode = 
  LiteralNode | FunctionDeclarationNode | FunctionNode | CallStatementNode | VariableNode;

export interface VariableNode {
  type: 'variable';
  identifier: string;
  position: Position;
}
export interface LiteralNode {
  type: 'literal';
  dataType: string;
  value: string | number | boolean;
  position: Position;
}
export interface FunctionNode {
  type: 'functionNode';
  dataType: string;
  flags: FlagStatementNode[];
  variables: Stack;
  parameters: FunctionParameterNode[];
  body: Statement[];
  position: Position;
}
export interface FunctionDeclarationNode {
  type: 'functionDeclaration';
  dataType: string;
  parameters: FunctionParameterNode[];
  body: Statement[];
  position: Position;
}
export interface FunctionParameterNode {
  type: 'functionParameter';
  dataType: string;
  identifier: string;
  position: Position;
}
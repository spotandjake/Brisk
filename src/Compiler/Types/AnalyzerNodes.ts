import Node, { Expression, ProgramNode, BlockStatementNode, FunctionLiteralNode, VariableDefinitionNode, TypeUsage } from './ParseNodes';

export interface VariableData {
  name: string;
  global: boolean;
  constant: boolean;
  exported: boolean;
  used: boolean;
  type: TypeUsage;
}
export type VariableMap = Map<number, VariableData>;
export type VariableStack = Map<string, number>;
export type VariableClosure = Set<number>;
export interface AnalyzedProgramNode extends ProgramNode {
  variables: VariableMap;
  stack: VariableStack;
}
export interface AnalyzedBlockStatementNode extends BlockStatementNode {
  stack: VariableStack;
}
export interface AnalyzedFunctionLiteralNode extends FunctionLiteralNode {
  closure: VariableClosure;
  stack: VariableStack;
}
export interface AnalyzedVariableDefinitionNode extends VariableDefinitionNode {
  global: boolean;
  constant: boolean;
  type: TypeUsage;
}

export type AnalyzerNode =
  AnalyzedProgramNode | AnalyzedBlockStatementNode | AnalyzedFunctionLiteralNode |
  AnalyzedVariableDefinitionNode |
  Exclude<Node, ProgramNode | BlockStatementNode | FunctionLiteralNode | VariableDefinitionNode>
  ;
export type AnalyzedExpression = AnalyzedFunctionLiteralNode | Exclude<Expression, FunctionLiteralNode>;
export default AnalyzerNode;
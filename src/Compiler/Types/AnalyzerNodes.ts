import Node, { Expression, ProgramNode, BlockStatementNode, FunctionLiteralNode, VariableDefinitionNode, Type } from './ParseNodes';

export interface VariableData {
  name: string;
  global: boolean;
  constant: boolean;
  type: Type;
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
  type: Type;
}

type AnalyzerNode =
  AnalyzedProgramNode | AnalyzedBlockStatementNode | AnalyzedFunctionLiteralNode |
  AnalyzedVariableDefinitionNode |
  Exclude<Node, ProgramNode | BlockStatementNode | FunctionLiteralNode | VariableDefinitionNode>
  ;
export type AnalyzedExpression = AnalyzedFunctionLiteralNode | Exclude<Expression, FunctionLiteralNode>;
export default AnalyzerNode;
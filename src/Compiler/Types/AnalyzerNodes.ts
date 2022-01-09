import Node, { ProgramNode, BlockStatementNode, FunctionLiteralNode, VariableDefinitionNode, Type } from './ParseNodes';

export type VariableMap = Map<number, { name: string, global: boolean, constant: boolean, type: Type | undefined }>;
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
  type: Type | undefined;
}

type AnalyzerNode = AnalyzedVariableDefinitionNode | Node;
export default AnalyzerNode;
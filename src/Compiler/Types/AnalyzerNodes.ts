import Node, { VariableDefinitionNode, Type } from './ParseNodes';

export interface AnalyzedVariableDefinitionNode extends VariableDefinitionNode {
  global: boolean;
  constant: boolean;
  type: Type | undefined;
}

type AnalyzerNode = AnalyzedVariableDefinitionNode | Node;
export default AnalyzerNode;
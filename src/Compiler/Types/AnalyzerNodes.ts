import Node, {
  Expression,
  ProgramNode,
  BlockStatementNode,
  FunctionLiteralNode,
  VariableDefinitionNode,
  TypeLiteral,
} from './ParseNodes';

export interface TypeData {
  name: string;
  exported: boolean;
  type: TypeLiteral;
}
export type TypeMap = Map<number, TypeData>;
export type TypeStack = Map<string, number>;
export interface VariableData {
  name: string;
  global: boolean;
  constant: boolean;
  exported: boolean;
  used: boolean;
  type: TypeLiteral;
}
export type VariableMap = Map<number, VariableData>;
export type VariableStack = Map<string, number>;
export type VariableClosure = Set<number>;
export interface AnalyzedProgramNode extends ProgramNode {
  types: TypeMap;
  typeStack: TypeStack;
  variables: VariableMap;
  stack: VariableStack;
}
export interface AnalyzedBlockStatementNode extends BlockStatementNode {
  typeStack: TypeStack;
  stack: VariableStack;
}
export interface AnalyzedFunctionLiteralNode extends FunctionLiteralNode {
  typeStack: TypeStack;
  closure: VariableClosure;
  stack: VariableStack;
}
export interface AnalyzedVariableDefinitionNode extends VariableDefinitionNode {
  global: boolean;
  constant: boolean;
  type: TypeLiteral;
}

export type AnalyzerNode =
  | AnalyzedProgramNode
  | AnalyzedBlockStatementNode
  | AnalyzedFunctionLiteralNode
  | AnalyzedVariableDefinitionNode
  | Exclude<Node, ProgramNode | BlockStatementNode | FunctionLiteralNode | VariableDefinitionNode>;
export type AnalyzedExpression =
  | AnalyzedFunctionLiteralNode
  | Exclude<Expression, FunctionLiteralNode>;
export default AnalyzerNode;

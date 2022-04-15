import Node, {
  Expression,
  ProgramNode,
  BlockStatementNode,
  FunctionLiteralNode,
  VariableDefinitionNode,
  TypeLiteral,
  TypeUsageNode,
} from './ParseNodes';
import { Position } from './Types';
export type ImportMap = Map<string, ImportItem>;
interface ImportItem {
  name: string;
  path: string;
  position: Position;
}
interface ExportItem {
  name: string;
  value: Expression | TypeUsageNode;
  typeExport: boolean;
  valueExport: boolean;
}
export type ExportMap = Map<string, ExportItem>;
export interface AnalyzeNode {
  // Pools
  _imports: ImportMap;
  _exports: ExportMap;
  _variables: VariableMap;
  _types: TypeMap;
  // Parent Stacks
  _varStacks: VariableStack[];
  _typeStacks: TypeStack[];
  // Stacks
  _closure: VariableClosure;
  _varStack: VariableStack;
  _typeStack: TypeStack;
}

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
  parameter: boolean;
  exported: boolean;
  import: boolean;
  wasmImport: boolean;
  used: boolean;
  type: TypeLiteral;
}
export type VariableMap = Map<number, VariableData>;
export type VariableStack = Map<string, number>;
export type VariableClosure = Set<number>;
export interface AnalyzedProgramNode extends ProgramNode {
  data: Omit<AnalyzeNode, '_closure' | '_varStacks' | '_typeStacks'>;
}
export interface AnalyzedBlockStatementNode extends BlockStatementNode {
  data: {
    _varStack: VariableStack;
    _typeStack: TypeStack;
  };
}
export interface AnalyzedFunctionLiteralNode extends FunctionLiteralNode {
  data: {
    _closure: VariableClosure;
    _varStack: VariableStack;
    _typeStack: TypeStack;
  };
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

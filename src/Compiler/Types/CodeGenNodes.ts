import { AnalyzerProperties } from './AnalyzerNodes';
import { WasmFunction } from '../../wasmBuilder/Types/Nodes';
import Node, * as Nodes from '../Types/ParseNodes';
export interface CodeGenProperties extends Omit<AnalyzerProperties, 'operatorScope'> {
  wasmFunction: WasmFunction;
  selfReference?: number;
}
export type CodeGenNode = Exclude<
  Node,
  | Nodes.ProgramNode
  | Nodes.ParameterNode
  | Nodes.ArgumentsNode
  | Nodes.InterfaceFieldNode
  | Nodes.InterfaceLiteralNode
>;

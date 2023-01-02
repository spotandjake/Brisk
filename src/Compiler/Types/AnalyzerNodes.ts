import { BaseTypes, TypeLiteral } from './ParseNodes';
import { Position } from '../../Types/Types';
export type ImportMap = Map<string, ImportItem>;
interface ImportItem {
  name: string;
  path: string;
  position: Position;
}
export type ExportMap = Map<string, VariableData>;
export interface AnalyzerProperties {
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
  // Misc
  operatorScope: {
    PREFIX: Map<string, string[]>;
    INFIX: Map<string, string[]>;
    POSTFIX: Map<string, string[]>;
  };
  // Flags
  loopDepth: undefined | number;
}

export interface TypeData {
  name: string;
  exported: boolean;
  reference: number;
  type: TypeLiteral;
}
export type TypeMap = Map<number, TypeData>;
export type TypeStack = Map<string, number>;
export interface VariableData {
  name: string;
  reference?: number;
  mainScope?: boolean;
  global?: boolean;
  constant: boolean;
  parameter?: boolean;
  import?: boolean;
  wasmImport?: boolean;
  used?: boolean;
  type: TypeLiteral;
  baseType: BaseTypes | undefined;
}
export type VariableMap = Map<number, Required<VariableData>>;
export type VariableStack = Map<string, number>;
export type VariableClosure = Set<number>;

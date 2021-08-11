import binaryen from 'binaryen';
export interface WasmFunction {
  name: string;
  params: binaryen.Type;
  results: binaryen.Type;
  vars: binaryen.Type[];
  body: binaryen.ExpressionRef;
}
export interface FunctionImport {
  type: 'FunctionImport';
  value: {
    internalName: string;
    externalModuleName: string;
    externalBaseName: string;
    params: binaryen.Type;
    results: binaryen.Type;
  }
}
export interface GlobalImport {
  type: 'GlobalImport';
  value: {
    internalName: string;
    externalModuleName: string;
    externalBaseName: string;
    globalType: binaryen.Type;
  }
}
export type PoolImport = FunctionImport | GlobalImport;
export const enum ModuleType {
  BriskModule,
  WasmModule,
  LocalModule
}
export interface Dependency {
  entry: boolean;
  importance: number;
  found: boolean;
  location: string;
  binaryen_module?: binaryen.Module;
}
export interface Pool {
  globals: Map<string, string>;
  functions: Map<string, string>;
  // Wasm Level Imports, Exports
  imports: Map<string, string>;
  exports: Map<string, string>; //TODO: this is gonna need more info
}
export interface MergePool {
  globals: { name: string; type: binaryen.Type; mutable: boolean; init: binaryen.ExpressionRef; }[];
  functions: WasmFunction[];
  functionTable: string[];
  // Wasm Level Imports, Exports
  imports: PoolImport[];
  exports: string[]; //TODO: this is gonna need more info
}
export interface CountPool { // Used For Keeping Track Of Number Of Parts
  globals: number;
  functions: number;
}
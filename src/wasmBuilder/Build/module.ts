// Types
import { WasmFunctionType } from '../Types/Nodes';
// Main Class
// TODO: Implement Wasm Module Builder
class Module {
  // Properties
  private name: string;
  private functions: Map<string, WasmFunctionType>;
  // TODO: Add Imports, Exports, Types, Data, Custom Sections
  // Constructor
  constructor(name: string) {
    this.name = name;
    this.functions = new Map();
  }
  // Function Methods
  public addFunction(name: string, func: WasmFunctionType): void {
    this.functions.set(name, func);
    // TODO: Return Function Reference
  }
}
// Export
export default Module;

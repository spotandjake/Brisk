// Types
type wasmExpression = wasmBlock;
const enum wasmExpressionType {
  Block
}
const enum wasmType {
  i32
}
// Expression Classes
interface Expression {
  expType: wasmExpressionType;
  renderWat: () => string;
  // renderWasm: () => Buffer;
}
// Expression Classes
class wasmBlock implements Expression {
  public expType: wasmExpressionType;
  // Block
  private label: string;
  private children: wasmExpression[];
  private resultType?: wasmType;
  constructor(label: string, children: wasmExpression[], resultType?: wasmType) {
    this.expType = wasmExpressionType.Block;
    this.label = label;
    this.children = children;
    this.resultType = resultType;
  }
  // TODO: Render
  renderWat() { return '' }
}
// Public
const Expression = {
  // Control Flow
  // Variable Accesses
  // i32
  i32: {
    const: (value: number) => '',
    // DataType Conversions
  },
  // i64
  i64: {
    // DataType Conversions
  },
  // f32
  f32: {
    // DataType Conversions
  },
  // f64
  f64: {
    // DataType Conversions
  },
  // Function Calls
  // Memory Accesses
  // Host Operations
  // Vector Operations
  // Atomic Memory Accesses
  // Atomic Read-modify-write Operations
  // Atomic wait and notify operations
  // Sign Extension Operations
  // Multi-value operations
  // Exception Handling operations
  // Reference Types Operations

};

export default Expression;
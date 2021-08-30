// Types
const enum WasmExpressionType {
  Invalid,
  // I32
  i32Add,
  // I64
  // f32
  // f64
}
// Expression Classes
const Exp = {
  // I32
  i32: {
    Add: (a: Expression, b: Expression): Expression => new Expression(i32Add, a, b)
  }
  // I64
  // f32
  // f64
};
// Expression Class
class Expression {
  private expType: WasmExpressionType;
  constructor(expType: WasmExpressionType, ..args: any[]) {
    // Set Propertys
    this.expType = expType;
  }
  // Render
  render() {}
}

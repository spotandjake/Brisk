import {
  NodeType,
  NodeCategory,
  FunctionSignatureLiteralNode,
  TypeLiteral,
  PrimTypes,
} from '../Types/ParseNodes';
import { Position } from '../Types/Types';
export interface WasmInstruction {
  [key: string]: ((position: Position) => FunctionSignatureLiteralNode) | WasmInstruction;
}
const createTypeNode = (name: string): ((position: Position) => TypeLiteral) => {
  return (position: Position) => ({
    nodeType: NodeType.TypeUsage,
    category: NodeCategory.Type,
    name: name,
    position: position,
  });
};
const createFunctionSignature = (
  _params: PrimTypes[],
  _returnType: PrimTypes
): ((position: Position) => FunctionSignatureLiteralNode) => {
  const params = _params.map(createTypeNode);
  const returnType = createTypeNode(_returnType);
  return (position: Position) => ({
    nodeType: NodeType.FunctionSignatureLiteral,
    category: NodeCategory.Type,
    params: params.map((param) => param(position)),
    returnType: returnType(position),
    position: position,
  });
};
// TODO: We need to Convert The Number Type Here To A Type Usage
// Types
const i32Load = createFunctionSignature(['Number', 'Number', 'u32'], 'i32');
const i32Store = createFunctionSignature(['Number', 'Number', 'u32', 'i32'], 'Void');
const i32_i32 = createFunctionSignature(['i32'], 'i32');
const f32_i32 = createFunctionSignature(['f32'], 'i32');
const f64_i32 = createFunctionSignature(['f64'], 'i32');
const i32_i32_i32 = createFunctionSignature(['i32', 'i32'], 'i32');

const i64Load = createFunctionSignature(['Number', 'Number', 'u32'], 'i64');
const i64Store = createFunctionSignature(['Number', 'Number', 'u32', 'i64'], 'Void');
const i64_i64 = createFunctionSignature(['i64'], 'i64');
const f32_i64 = createFunctionSignature(['f32'], 'i64');
const f64_i64 = createFunctionSignature(['f64'], 'i64');
const i64_i64_i64 = createFunctionSignature(['i64', 'i64'], 'i64');

const f32_f32 = createFunctionSignature(['f32'], 'f32');
const i32_f32 = createFunctionSignature(['i32'], 'f32');
const i64_f32 = createFunctionSignature(['i64'], 'f32');
const f32_f32_f32 = createFunctionSignature(['f32', 'f32'], 'f32');

const f64_f64 = createFunctionSignature(['f64'], 'f64');
const i32_f64 = createFunctionSignature(['i32'], 'f64');
const i64_f64 = createFunctionSignature(['i64'], 'f64');
const f64_f64_f64 = createFunctionSignature(['f64', 'f64'], 'f64');
// Actual Instructions
export const instructions: WasmInstruction = {
  // TODO: Add atomic stuff
  // Global
  // Memory
  memory: {
    size: createFunctionSignature([], 'u32'),
    grow: createFunctionSignature(['u32'], 'u32'),
    // TODO: implement memory.init, memory.copy, memory.fill
  },
  // i32
  i32: {
    load: i32Load,
    load8_s: i32Load,
    load8_u: i32Load,
    load16_s: i32Load,
    load16_u: i32Load,
    store: i32Store,
    store8: i32Store,
    store16: i32Store,
    const: createFunctionSignature(['Number'], 'i32'),
    clz: i32_i32,
    ctz: i32_i32,
    popcnt: i32_i32,
    eqz: i32_i32,
    trunc_s: {
      f32: f32_i32,
      f64: f64_i32,
    },
    trunc_u: {
      f32: f32_i32,
      f64: f64_i32,
    },
    reinterpret: f32_i32,
    wrap: createFunctionSignature(['i64'], 'i32'),
    extend8_s: i32_i32_i32,
    extend16_s: i32_i32_i32,
    add: i32_i32_i32,
    sub: i32_i32_i32,
    mul: i32_i32_i32,
    div_s: i32_i32_i32,
    div_u: i32_i32_i32,
    rem_s: i32_i32_i32,
    rem_u: i32_i32_i32,
    and: i32_i32_i32,
    or: i32_i32_i32,
    xor: i32_i32_i32,
    shl: i32_i32_i32,
    shr_u: i32_i32_i32,
    shr_s: i32_i32_i32,
    rotl: i32_i32_i32,
    rotr: i32_i32_i32,
    eq: i32_i32_i32,
    ne: i32_i32_i32,
    lt_s: i32_i32_i32,
    lt_u: i32_i32_i32,
    le_s: i32_i32_i32,
    le_u: i32_i32_i32,
    gt_s: i32_i32_i32,
    gt_u: i32_i32_i32,
    ge_s: i32_i32_i32,
    ge_u: i32_i32_i32,
  },
  // i64
  i64: {
    load: i64Load,
    load8_s: i64Load,
    load8_u: i64Load,
    load16_s: i64Load,
    load16_u: i64Load,
    load32_s: i64Load,
    load32_u: i64Load,
    store: i64Store,
    store8: i64Store,
    store16: i64Store,
    store32: i64Store,
    const: createFunctionSignature(['Number'], 'i64'),
    clz: i64_i64,
    ctz: i64_i64,
    popcnt: i64_i64,
    eqz: i64_i64,
    trunc_s: {
      f32: f32_i64,
      f64: f64_i64,
    },
    trunc_u: {
      f32: f32_i64,
      f64: f64_i64,
    },
    reinterpret: f64_i64,
    extend8_s: i64_i64_i64,
    extend16_s: i64_i64_i64,
    extend32_s: i64_i64_i64,
    extend_s: i64_i64_i64,
    extend_u: i64_i64_i64,
    add: i64_i64_i64,
    sub: i64_i64_i64,
    mul: i64_i64_i64,
    div_s: i64_i64_i64,
    div_u: i64_i64_i64,
    rem_s: i64_i64_i64,
    rem_u: i64_i64_i64,
    and: i64_i64_i64,
    or: i64_i64_i64,
    xor: i64_i64_i64,
    shl: i64_i64_i64,
    shr_u: i64_i64_i64,
    shr_s: i64_i64_i64,
    rotl: i64_i64_i64,
    rotr: i64_i64_i64,
    eq: i64_i64_i64,
    ne: i64_i64_i64,
    lt_s: i64_i64_i64,
    lt_u: i64_i64_i64,
    le_s: i64_i64_i64,
    le_u: i64_i64_i64,
    gt_s: i64_i64_i64,
    gt_u: i64_i64_i64,
    ge_s: i64_i64_i64,
    ge_u: i64_i64_i64,
  },
  // f32
  f32: {
    load: createFunctionSignature(['Number', 'Number', 'u32'], 'f32'),
    store: createFunctionSignature(['Number', 'Number', 'u32', 'f32'], 'Void'),
    const: createFunctionSignature(['Number'], 'f32'),
    const_bits: createFunctionSignature(['Number'], 'f32'),
    neg: f32_f32,
    abs: f32_f32,
    ceil: f32_f32,
    floor: f32_f32,
    trunc: f32_f32,
    nearest: f32_f32,
    sqrt: f32_f32,
    convert_s: {
      i32: i32_f32,
      i64: i64_f32,
    },
    convert_u: {
      i32: i32_f32,
      i64: i64_f32,
    },
    reinterpret: i32_f32,
    demote: createFunctionSignature(['f64'], 'f32'),
    add: f32_f32_f32,
    sub: f32_f32_f32,
    mul: f32_f32_f32,
    div: f32_f32_f32,
    copysign: f32_f32_f32,
    min: f32_f32_f32,
    max: f32_f32_f32,
    eq: f32_f32_f32,
    ne: f32_f32_f32,
    lt: f32_f32_f32,
    le: f32_f32_f32,
    gt: f32_f32_f32,
    ge: f32_f32_f32,
  },
  // f64
  f64: {
    load: createFunctionSignature(['Number', 'Number', 'u32'], 'f64'),
    store: createFunctionSignature(['Number', 'Number', 'u32', 'f64'], 'Void'),
    const: createFunctionSignature(['Number'], 'f64'),
    const_bits: createFunctionSignature(['Number', 'Number'], 'f64'),
    neg: f64_f64,
    abs: f64_f64,
    ceil: f64_f64,
    floor: f64_f64,
    trunc: f64_f64,
    nearest: f64_f64,
    sqrt: f64_f64,
    convert_s: {
      i32: i32_f64,
      i64: i64_f64,
    },
    convert_u: {
      i32: i32_f64,
      i64: i64_f64,
    },
    reinterpret: i64_f64,
    promote: createFunctionSignature(['f32'], 'f64'),
    add: f64_f64_f64,
    sub: f64_f64_f64,
    mul: f64_f64_f64,
    div: f64_f64_f64,
    copysign: f64_f64_f64,
    min: f64_f64_f64,
    max: f64_f64_f64,
    eq: f64_f64_f64,
    ne: f64_f64_f64,
    lt: f64_f64_f64,
    le: f64_f64_f64,
    gt: f64_f64_f64,
    ge: f64_f64_f64,
  },
  // General Projects
  // TODO: Remove the Type Any Replace it with a union of all wasm stack types instead
  drop: createFunctionSignature(['Any'], 'Void'),
  return: createFunctionSignature(['Any'], 'Void'),
};

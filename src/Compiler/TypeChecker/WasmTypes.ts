import { Position } from '../../Types/Types';
import {
  FunctionSignatureLiteralNode,
  TypeLiteral,
  WasmCallExpressionNode,
} from '../Types/ParseNodes';
import {
  createFunctionSignatureType,
  createPrimType,
  createUnionType,
} from '../Helpers/typeBuilders';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// Type Functions
const u32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'u32');
const u64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'u64');
const i32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'i32');
const i64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'i64');
const f32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'f32');
const f64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'f64');
const numberType = (pos: Position): TypeLiteral => createPrimType(pos, 'Number');
const boolType = (pos: Position): TypeLiteral => createPrimType(pos, 'Boolean');
// TODO: Replace Void With An Empty Type That Throws In An Expression Format
const voidType = (pos: Position): TypeLiteral => createPrimType(pos, 'Void');
const ptrType = (pos: Position): TypeLiteral => createPrimType(pos, 'i32');
const createFunctionType = (
  pos: Position,
  params: TypeLiteral[],
  returnType: TypeLiteral
): FunctionSignatureLiteralNode =>
  createFunctionSignatureType(pos, [], params, returnType, new Map());
const stackType = (pos: Position): TypeLiteral =>
  createUnionType(
    pos,
    u32Type(pos),
    u64Type(pos),
    i32Type(pos),
    i64Type(pos),
    f32Type(pos),
    f64Type(pos)
  );
// WasmTypes Map
export const mapExpression = (
  rawProgram: string,
  node: WasmCallExpressionNode
): FunctionSignatureLiteralNode => {
  const path = node.name.slice('@wasm.'.length);
  const pos = node.position;
  switch (path) {
    case 'unreachable':
      return createFunctionType(pos, [], voidType(pos));
    case 'nop':
      return createFunctionType(pos, [], voidType(pos));
    case 'data.drop':
      return createFunctionType(pos, [stackType(pos)], voidType(pos));
    case 'local.get':
      return createFunctionType(pos, [i32Type(pos)], stackType(pos));
    case 'local.set':
      return createFunctionType(pos, [i32Type(pos), stackType(pos)], voidType(pos));
    case 'local.tee':
      return createFunctionType(pos, [i32Type(pos), stackType(pos)], stackType(pos));
    case 'global.get':
      return createFunctionType(pos, [i32Type(pos)], stackType(pos));
    case 'global.set':
      return createFunctionType(pos, [i32Type(pos), stackType(pos)], voidType(pos));
    case 'i32.load':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i64.load':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'f32.load':
      return createFunctionType(pos, [ptrType(pos)], f32Type(pos));
    case 'f64.load':
      return createFunctionType(pos, [ptrType(pos)], f64Type(pos));
    case 'i32.load8_s':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.load8_u':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.load16_s':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.load16_u':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i64.load8_s':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.load8_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.load16_s':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.load16_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.load32_s':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.load32_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i32.store':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i64.store':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'f32.store':
      return createFunctionType(pos, [ptrType(pos), f32Type(pos)], voidType(pos));
    case 'f64.store':
      return createFunctionType(pos, [ptrType(pos), f64Type(pos)], voidType(pos));
    case 'i32.store8':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i32.store16':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i64.store8':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.store16':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.store32':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'memory.size':
      return createFunctionType(pos, [], ptrType(pos));
    case 'memory.grow':
      return createFunctionType(pos, [ptrType(pos)], ptrType(pos));
    case 'i32.const':
      return createFunctionType(pos, [numberType(pos)], i32Type(pos));
    case 'i64.const':
      return createFunctionType(pos, [numberType(pos)], i64Type(pos));
    case 'f32.const':
      return createFunctionType(pos, [numberType(pos)], f32Type(pos));
    case 'f64.const':
      return createFunctionType(pos, [numberType(pos)], f64Type(pos));
    case 'i32.eqz':
      return createFunctionType(pos, [i32Type(pos)], boolType(pos));
    case 'i32.eq':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.ne':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.lt_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.lt_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.gt_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.gt_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.le_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.le_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.ge_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i32.ge_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], boolType(pos));
    case 'i64.eqz':
      return createFunctionType(pos, [i64Type(pos)], boolType(pos));
    case 'i64.eq':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.ne':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.lt_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.lt_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.gt_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.gt_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.le_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.le_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.ge_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'i64.ge_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], boolType(pos));
    case 'f32.eq':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f32.ne':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f32.lt':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f32.gt':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f32.le':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f32.ge':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], boolType(pos));
    case 'f64.eq':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'f64.ne':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'f64.lt':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'f64.gt':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'f64.le':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'f64.ge':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], boolType(pos));
    case 'i32.clz':
      return createFunctionType(pos, [i32Type(pos)], i32Type(pos));
    case 'i32.ctz':
      return createFunctionType(pos, [i32Type(pos)], i32Type(pos));
    case 'i32.popcnt':
      return createFunctionType(pos, [i32Type(pos)], i32Type(pos));
    case 'i32.add':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.sub':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.mul':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.div_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.div_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.rem_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.rem_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.and':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.or':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.xor':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.shl':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.shr_s':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.shr_u':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.rotl':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i32.rotr':
      return createFunctionType(pos, [i32Type(pos), i32Type(pos)], i32Type(pos));
    case 'i64.clz':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.ctz':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.popcnt':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.add':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.sub':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.mul':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.div_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.div_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.rem_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.rem_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.and':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.or':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.xor':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.shl':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.shr_s':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.shr_u':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.rotl':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'i64.rotr':
      return createFunctionType(pos, [i64Type(pos), i64Type(pos)], i64Type(pos));
    case 'f32.abs':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.neg':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.ceil':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.floor':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.trunc':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.nearest':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.sqrt':
      return createFunctionType(pos, [f32Type(pos)], f32Type(pos));
    case 'f32.add':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.sub':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.mul':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.div':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.min':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.max':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f32.copysign':
      return createFunctionType(pos, [f32Type(pos), f32Type(pos)], f32Type(pos));
    case 'f64.abs':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.neg':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.ceil':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.floor':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.trunc':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.nearest':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.sqrt':
      return createFunctionType(pos, [f64Type(pos)], f64Type(pos));
    case 'f64.add':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.sub':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.mul':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.div':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.min':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.max':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'f64.copysign':
      return createFunctionType(pos, [f64Type(pos), f64Type(pos)], f64Type(pos));
    case 'i32.wrap':
      return createFunctionType(pos, [i64Type(pos)], i32Type(pos));
    case 'i32.trunc_s.f32':
      return createFunctionType(pos, [f32Type(pos)], i32Type(pos));
    case 'i32.trunc_u.f32':
      return createFunctionType(pos, [f32Type(pos)], i32Type(pos));
    case 'i32.trunc_s.f64':
      return createFunctionType(pos, [f64Type(pos)], i32Type(pos));
    case 'i32.trunc_u.f64':
      return createFunctionType(pos, [f64Type(pos)], i32Type(pos));
    case 'i64.extend_s':
      return createFunctionType(pos, [i32Type(pos)], i64Type(pos));
    case 'i64.extend_u':
      return createFunctionType(pos, [i32Type(pos)], i64Type(pos));
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // ==========================================
    // TODO: memory.init
    // TODO: memory.copy
    // TODO: memory.fill
    // TODO: memory.atomic.notify
    // TODO: memory.atomic.wait32
    // TODO: memory.atomic.wait64
    // i32
    case 'i32.trunc_s_sat.f32':
      return createFunctionType(pos, [f32Type(pos)], i32Type(pos));
    case 'i32.trunc_s_sat.f64':
      return createFunctionType(pos, [f64Type(pos)], i32Type(pos));
    case 'i32.trunc_u_sat.f32':
      return createFunctionType(pos, [f32Type(pos)], i32Type(pos));
    case 'i32.trunc_u_sat.f64':
      return createFunctionType(pos, [f64Type(pos)], i32Type(pos));
    case 'i32.reinterpret':
      return createFunctionType(pos, [f32Type(pos)], i32Type(pos));
    case 'i32.extend8_s':
      return createFunctionType(pos, [i32Type(pos)], i32Type(pos));
    case 'i32.extend16_s':
      return createFunctionType(pos, [i32Type(pos)], i32Type(pos));
    case 'i32.atomic.load':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.atomic.load8_u':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.atomic.load16_u':
      return createFunctionType(pos, [ptrType(pos)], i32Type(pos));
    case 'i32.atomic.store':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i32.atomic.store8':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i32.atomic.store16':
      return createFunctionType(pos, [ptrType(pos), i32Type(pos)], voidType(pos));
    case 'i32.atomic.rmw.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos)
      );
    case 'i32.atomic.rmw8_u.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw8_u.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos)
      );
    case 'i32.atomic.rmw16_u.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i32Type(pos)], i32Type(pos));
    case 'i32.atomic.rmw16_u.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos)
      );
    case 'i64.trunc_s.f32':
      return createFunctionType(pos, [f32Type(pos)], i64Type(pos));
    case 'i64.trunc_s.f64':
      return createFunctionType(pos, [f64Type(pos)], i64Type(pos));
    case 'i64.trunc_u.f32':
      return createFunctionType(pos, [f32Type(pos)], i64Type(pos));
    case 'i64.trunc_u.f64':
      return createFunctionType(pos, [f64Type(pos)], i64Type(pos));
    case 'i64.trunc_s_sat.f32':
      return createFunctionType(pos, [f32Type(pos)], i64Type(pos));
    case 'i64.trunc_s_sat.f64':
      return createFunctionType(pos, [f64Type(pos)], i64Type(pos));
    case 'i64.trunc_u_sat.f32':
      return createFunctionType(pos, [f32Type(pos)], i64Type(pos));
    case 'i64.trunc_u_sat.f64':
      return createFunctionType(pos, [f64Type(pos)], i64Type(pos));
    case 'i64.reinterpret':
      return createFunctionType(pos, [f64Type(pos)], i64Type(pos));
    case 'i64.extend8_s':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.extend16_s':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.extend32_s':
      return createFunctionType(pos, [i64Type(pos)], i64Type(pos));
    case 'i64.atomic.load':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.atomic.load8_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.atomic.load16_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.atomic.load32_u':
      return createFunctionType(pos, [ptrType(pos)], i64Type(pos));
    case 'i64.atomic.store':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.atomic.store8':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.atomic.store16':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.atomic.store32':
      return createFunctionType(pos, [ptrType(pos), i64Type(pos)], voidType(pos));
    case 'i64.atomic.rmw.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos)
      );
    case 'i64.atomic.rmw8_u.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw8_u.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos)
      );
    case 'i64.atomic.rmw16_u.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw16_u.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos)
      );
    case 'i64.atomic.rmw32_u.add':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.sub':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.and':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.or':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.xor':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.xchg':
      return createFunctionType(pos, [i32Type(pos), ptrType(pos), i64Type(pos)], i64Type(pos));
    case 'i64.atomic.rmw32_u.cmpxchg':
      return createFunctionType(
        pos,
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos)
      );
    case 'f32.reinterpret':
      return createFunctionType(pos, [i32Type(pos)], f32Type(pos));
    case 'f32.convert_s.i32':
      return createFunctionType(pos, [i32Type(pos)], f32Type(pos));
    case 'f32.convert_s.i64':
      return createFunctionType(pos, [i64Type(pos)], f32Type(pos));
    case 'f32.convert_u.i32':
      return createFunctionType(pos, [i32Type(pos)], f32Type(pos));
    case 'f32.convert_u.i64':
      return createFunctionType(pos, [i64Type(pos)], f32Type(pos));
    case 'f32.demote':
      return createFunctionType(pos, [f32Type(pos)], f64Type(pos));
    case 'f64.reinterpret':
      return createFunctionType(pos, [i64Type(pos)], f64Type(pos));
    case 'f64.convert_s.i32':
      return createFunctionType(pos, [i32Type(pos)], f64Type(pos));
    case 'f64.convert_s.i64':
      return createFunctionType(pos, [i64Type(pos)], f64Type(pos));
    case 'f64.convert_u.i32':
      return createFunctionType(pos, [i32Type(pos)], f64Type(pos));
    case 'f64.convert_u.i64':
      return createFunctionType(pos, [i64Type(pos)], f64Type(pos));
    case 'f64.promote':
      return createFunctionType(pos, [f64Type(pos)], f32Type(pos));
    // TODO: V128
  }
  return BriskError(rawProgram, BriskErrorType.WasmExpressionUnknown, [], node.position);
};

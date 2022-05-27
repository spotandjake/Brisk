import { Position } from '../Types/Types';
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
const voidType = (pos: Position): TypeLiteral => createPrimType(pos, 'Void');
const ptrType = (pos: Position): TypeLiteral => createPrimType(pos, 'i32');
// WasmTypes Map
export const mapExpression = (
  rawProgram: string,
  node: WasmCallExpressionNode
): FunctionSignatureLiteralNode => {
  const path = node.name.slice('@wasm.'.length);
  const pos = node.position;
  switch (path) {
    // Local
    // TODO: local.get
    case 'local.set':
      return createFunctionSignatureType(
        pos,
        [],
        [
          i32Type(pos),
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    // TODO: local.tee
    // Global
    // TODO: gloval.get
    case 'global.set':
      return createFunctionSignatureType(
        pos,
        [],
        [
          i32Type(pos),
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    // Table
    // TODO: table.Get
    // TODO: table.Set
    // TODO: table.Size
    // TODO: table.Grow
    // TODO: table.Init
    // TODO: table.Fill
    // TODO: table.Copy
    // Memory
    case 'memory.size':
      return createFunctionSignatureType(pos, [], [], ptrType(pos), new Map());
    case 'memory.grow':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], ptrType(pos), new Map());
    // TODO: memory.init
    // TODO: memory.copy
    // TODO: memory.fill
    // TODO: memory.atomic.notify
    // TODO: memory.atomic.wait32
    // TODO: memory.atomic.wait64
    // Data
    case 'data.drop':
      return createFunctionSignatureType(
        pos,
        [],
        [
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    // i32
    case 'i32.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.load8_s':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.load8_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.load16_s':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.load16_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.store8':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.store16':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.const':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.clz':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.ctz':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.popcnt':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.eqz':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_s.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_s.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_u.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_u.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_s_sat.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_s_sat.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_u_sat.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    case 'i32.trunc_u_sat.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
    case 'i32.reinterpret':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    case 'i32.extend8_s':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.extend16_s':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    case 'i32.wrap':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i32Type(pos), new Map());
    case 'i32.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.mul':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.div_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.div_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.rem_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.rem_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.shl':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.shr_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.shr_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.rotl':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.rotr':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.eq':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.ne':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.lt_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.lt_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.le_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.le_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.gt_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.gt_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.ge_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.ge_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.atomic.load8_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.atomic.load16_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i32Type(pos), new Map());
    case 'i32.atomic.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.atomic.store8':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.atomic.store16':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i32.atomic.rmw.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw8_u.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i32.atomic.rmw16_u.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    case 'i64.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load8_s':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load8_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load16_s':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load16_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load32_s':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.load32_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.store8':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.store16':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.store32':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.const':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.clz':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.ctz':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.popcnt':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.eqz':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_s.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_s.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_u.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_u.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_s_sat.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_s_sat.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_u_sat.f32':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
    case 'i64.trunc_u_sat.f64':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    case 'i64.reinterpret':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    case 'i64.extend8_s':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.extend16_s':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.extend32_s':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.extend_s':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.extend_u':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    case 'i64.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.mul':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.div_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.div_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.rem_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.rem_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.shl':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.shr_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.shr_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.rotl':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.rotr':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.eq':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.ne':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.lt_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.lt_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.le_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.le_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.gt_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.gt_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.ge_s':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.ge_u':
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.atomic.load8_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.atomic.load16_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.atomic.load32_u':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], i64Type(pos), new Map());
    case 'i64.atomic.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.atomic.store8':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.atomic.store16':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.atomic.store32':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'i64.atomic.rmw.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw8_u.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw16_u.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.add':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.and':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.or':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.xor':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.xchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'i64.atomic.rmw32_u.cmpxchg':
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    case 'f32.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], f32Type(pos), new Map());
    case 'f32.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), f32Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'f32.const':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.neg':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.abs':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.ceil':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.floor':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.trunc':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.nearest':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.sqrt':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    case 'f32.reinterpret':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
    case 'f32.convert_s.i32':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
    case 'f32.convert_s.i64':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f32Type(pos), new Map());
    case 'f32.convert_u.i32':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
    case 'f32.convert_u.i64':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f32Type(pos), new Map());
    case 'f32.demote':
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f64Type(pos), new Map());
    case 'f32.add':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.mul':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.div':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.copysign':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.min':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.max':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.eq':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.ne':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.lt':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.le':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.gt':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f32.ge':
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    case 'f64.load':
      return createFunctionSignatureType(pos, [], [ptrType(pos)], f64Type(pos), new Map());
    case 'f64.store':
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), f64Type(pos)],
        voidType(pos),
        new Map()
      );
    case 'f64.const':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.neg':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.abs':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.ceil':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.floor':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.trunc':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.nearest':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.sqrt':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    case 'f64.reinterpret':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
    case 'f64.convert_s.i32':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f64Type(pos), new Map());
    case 'f64.convert_s.i64':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
    case 'f64.convert_u.i32':
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f64Type(pos), new Map());
    case 'f64.convert_u.i64':
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
    case 'f64.promote':
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f32Type(pos), new Map());
    case 'f64.add':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.sub':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.mul':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.div':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.copysign':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.min':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.max':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.eq':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.ne':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.lt':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.le':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.gt':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    case 'f64.ge':
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    // TODO: V128
  }
  return BriskError(rawProgram, BriskErrorType.WasmExpressionUnknown, [], node.position);
};

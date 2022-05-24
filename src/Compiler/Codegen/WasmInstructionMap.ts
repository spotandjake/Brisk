import Node, * as Nodes from '../Types/ParseNodes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { UnresolvedBytes } from '../../wasmBuilder/Types/Nodes';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
type generableNode = Exclude<Node, Nodes.ProgramNode | Nodes.ParameterNode | Nodes.ArgumentsNode>;
export const mapExpression = (
  rawProgram: string,
  node: Nodes.WasmCallExpressionNode,
  _generateCode: (childNode: generableNode) => UnresolvedBytes
): UnresolvedBytes => {
  const path = node.name.slice('@wasm.'.length);
  const args = node.args;
  switch (path) {
    // Local
    case 'local.get':
      return Expressions.local_GetExpression((<Nodes.I32LiteralNode>args[0]).value);
    case 'local.set':
      return Expressions.local_SetExpression(
        (<Nodes.I32LiteralNode>args[0]).value,
        _generateCode(args[1])
      );
    case 'local.tee':
      return Expressions.local_SetExpression(
        (<Nodes.I32LiteralNode>args[0]).value,
        _generateCode(args[1])
      );
    // Global
    case 'global.get':
      return Expressions.global_GetExpression((<Nodes.I32LiteralNode>args[0]).value);
    case 'global.set':
      return Expressions.global_SetExpression(
        (<Nodes.I32LiteralNode>args[0]).value,
        _generateCode(args[1])
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
      return Expressions.memory_SizeExpression();
    case 'memory.grow':
      return Expressions.memory_GrowExpression(_generateCode(args[0]));
    // TODO: memory.init
    // TODO: memory.copy
    // TODO: memory.fill
    // TODO: memory.atomic.notify
    // TODO: memory.atomic.wait32
    // TODO: memory.atomic.wait64
    // Data
    case 'data.drop':
      return Expressions.dropExpression(_generateCode(args[0]));
    // i32
    case 'i32.load':
      return Expressions.i32_LoadExpression(_generateCode(args[0]));
    case 'i32.load8_s':
      return Expressions.i32_Load8_sExpression(_generateCode(args[0]));
    case 'i32.load8_u':
      return Expressions.i32_Load8_uExpression(_generateCode(args[0]));
    case 'i32.load16_s':
      return Expressions.i32_Load16_sExpression(_generateCode(args[0]));
    case 'i32.load16_u':
      return Expressions.i32_Load16_uExpression(_generateCode(args[0]));
    case 'i32.store':
      return Expressions.i32_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.store8':
      return Expressions.i32_Store8Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.store16':
      return Expressions.i32_Store16Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.const':
      return Expressions.i32_ConstExpression((<Nodes.I32LiteralNode>args[0]).value);
    case 'i32.clz':
      return Expressions.i32_clzExpression(_generateCode(args[0]));
    case 'i32.ctz':
      return Expressions.i32_ctzExpression(_generateCode(args[0]));
    case 'i32.popcnt':
      return Expressions.i32_popcntExpression(_generateCode(args[0]));
    case 'i32.eqz':
      return Expressions.i32_eqzExpression(_generateCode(args[0]));
    // TODO: i32.trunc_s.f32
    // TODO: i32.trunc_s.f64
    // TODO: i32.trunc_u.f32
    // TODO: i32.trunc_u.f64
    // TODO: i32.trunc_s_sat.f32
    // TODO: i32.trunc_s_sat.f64
    // TODO: i32.trunc_u_sat.f32
    // TODO: i32.trunc_u_sat.f64
    // TODO: i32.reinterpret
    // TODO: i32.extend8_s
    // TODO: i32.extend8_u
    // TODO: i32.wrap
    case 'i32.add':
      return Expressions.i32_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.sub':
      return Expressions.i32_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.mul':
      return Expressions.i32_MulExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.div_s':
      return Expressions.i32_Div_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.div_u':
      return Expressions.i32_Div_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: i32.rem_s
    // TODO: i32.rum_u
    case 'i32.and':
      return Expressions.i32_AndExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.or':
      return Expressions.i32_orExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.xor':
      return Expressions.i32_xorExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: i32.shl
    // TODO: i32.shr_u
    // TODO: i32.shr_s
    // TODO: i32.rotl
    // TODO: i32.rotr
    case 'i32.eq':
      return Expressions.i32_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.ne':
      return Expressions.i32_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: i32.lt_s
    // TODO: i32.lt_u
    // TODO: i32.le_s
    // TODO: i32.le_u
    // TODO: i32.gt_s
    // TODO: i32.gt_u
    // TODO: i32.ge_s
    // TODO: i32.ge_u
    // TODO: i32.atomic.load
    // TODO: i32.atomic.load8_u
    // TODO: i32.atomic.load16_u
    // TODO: i32.atomic.store
    // TODO: i32.atomic.store8
    // TODO: i32.atomic.store16
    // TODO: i32.atomic.rmw.add
    // TODO: i32.atomic.rmw.sub
    // TODO: i32.atomic.rmw.and
    // TODO: i32.atomic.rmw.or
    // TODO: i32.atomic.rmw.xor
    // TODO: i32.atomic.rmw.xchg
    // TODO: i32.atomic.rmw.cmpxchg
    // TODO: i32.atomic.rmw8_u.add
    // TODO: i32.atomic.rmw8_u.sub
    // TODO: i32.atomic.rmw8_u.and
    // TODO: i32.atomic.rmw8_u.or
    // TODO: i32.atomic.rmw8_u.xor
    // TODO: i32.atomic.rmw8_u.xchg
    // TODO: i32.atomic.rmw8_u.cmpxchg
    // TODO: i32.atomic.rmw16_u.add
    // TODO: i32.atomic.rmw16_u.sub
    // TODO: i32.atomic.rmw16_u.and
    // TODO: i32.atomic.rmw16_u.or
    // TODO: i32.atomic.rmw16_u.xor
    // TODO: i32.atomic.rmw16_u.xchg
    // TODO: i32.atomic.rmw16_u.cmpxchg
    case 'i64.load':
      return Expressions.i32_LoadExpression(_generateCode(args[0]));
    // TODO: i64.load8_s
    // TODO: i64.load8_u
    // TODO: i64.load16_s
    // TODO: i64.load16_u
    // TODO: i64.load32_s
    // TODO: i64.load32_u
    case 'i64.store':
      return Expressions.i64_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store8':
      return Expressions.i64_Store8Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store16':
      return Expressions.i64_Store16Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store32':
      return Expressions.i64_Store32Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.const':
      return Expressions.i64_ConstExpression((<Nodes.I64LiteralNode>args[0]).value);
    // TODO: i64.clz
    // TODO: i64.ctz
    // TODO: i64.popcnt
    // TODO: i64.eqz
    // TODO: i64.trunc_s.f32
    // TODO: i64.trunc_s.f64
    // TODO: i64.trunc_u.f32
    // TODO: i64.trunc_u.f64
    // TODO: i64.trunc_s_sat.f32
    // TODO: i64.trunc_s_sat.f64
    // TODO: i64.trunc_u_sat.f32
    // TODO: i64.trunc_u_sat.f64
    // TODO: i64.reinterpret
    // TODO: i64.extend8_s
    // TODO: i64.extend16)s
    // TODO: i64.extend32_s
    // TODO: i64.extend_s
    // TODO: i64.extend_u
    case 'i64.add':
      return Expressions.i64_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.sub':
      return Expressions.i64_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: i64.mul
    // TODO: i64.div_s
    // TODO: i64.div_u
    // TODO: i64.rem_s
    // TODO: i64.rem_u
    // TODO: i64.and
    // TODO: i64.or
    // TODO: i64.xor
    // TODO: i64.shl
    // TODO: i64.shr_u
    // TODO: i64.shr_s
    // TODO: i64.rotl
    // TODO: i64.rotr
    case 'i64.eq':
      return Expressions.i64_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: i64.ne
    // TODO: i64.lt_s
    // TODO: i64.lt_u
    // TODO: i64.le_s
    // TODO: i64.le_u
    // TODO: i64.gt_s
    // TODO: i64.gt_u
    // TODO: i64.ge_s
    // TODO: i64.ge_u
    // TODO: i64.atomic.load
    // TODO: i64.atomic.load8_u
    // TODO: i64.atomic.load16_u
    // TODO: i64.atomic.load32_u
    // TODO: i64.atomic.store
    // TODO: i64.atomic.store8
    // TODO: i64.atomic.store16
    // TODO: i64.atomic.store32
    // TODO: i64.atomic.rmw.add
    // TODO: i64.atomic.rmw.sub
    // TODO: i64.atomic.rmw.and
    // TODO: i64.atomic.rmw.or
    // TODO: i64.atomic.rmw.xor
    // TODO: i64.atomic.rmw.xchg
    // TODO: i64.atomic.rmw.cmpxchg
    // TODO: i64.atomic.rmw8_u.add
    // TODO: i64.atomic.rmw8_u.sub
    // TODO: i64.atomic.rmw8_u.and
    // TODO: i64.atomic.rmw8_u.or
    // TODO: i64.atomic.rmw8_u.xor
    // TODO: i64.atomic.rmw8_u.xchg
    // TODO: i64.atomic.rmw8_u.cmpxchg
    // TODO: i64.atomic.rmw16_u.add
    // TODO: i64.atomic.rmw16_u.sub
    // TODO: i64.atomic.rmw16_u.and
    // TODO: i64.atomic.rmw16_u.or
    // TODO: i64.atomic.rmw16_u.xor
    // TODO: i64.atomic.rmw16_u.xchg
    // TODO: i64.atomic.rmw16_u.cmpxchg
    // TODO: i64.atomic.rmw32_u.add
    // TODO: i64.atomic.rmw32_u.sub
    // TODO: i64.atomic.rmw32_u.and
    // TODO: i64.atomic.rmw32_u.or
    // TODO: i64.atomic.rmw32_u.xor
    // TODO: i64.atomic.rmw32_u.xchg
    // TODO: i64.atomic.rmw32_u.cmpxchg
    case 'f32.load':
      return Expressions.f32_LoadExpression(_generateCode(args[0]));
    case 'f32.store':
      return Expressions.f32_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.const':
      return Expressions.f32_ConstExpression((<Nodes.F32LiteralNode>args[0]).value);
    // TODO: f32.neg
    // TODO: f32.abs
    // TODO: f32.ceil
    // TODO: f32.floor
    // TODO: f32.trunc
    // TODO: f32.nearest
    // TODO: f32.sqrt
    // TODO: f32.reinterpret
    // TODO: f32.convert_s.i32
    // TODO: f32.convert_s.i64
    // TODO: f32.convert_u.i32
    // TODO: f32.convert_u.i64
    // TODO: f32.demote
    case 'f32.add':
      return Expressions.f32_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.sub':
      return Expressions.f32_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: f32.mul
    // TODO: f32.div
    // TODO: f32.copysign
    // TODO: f32.min
    // TODO: f32.max
    case 'f32.eq':
      return Expressions.f32_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: f32.ne
    // TODO: f32.lt
    // TODO: f32.le
    // TODO: f32.gt
    // TODO: f32.ge
    case 'f64.load':
      return Expressions.f64_LoadExpression(_generateCode(args[0]));
    case 'f64.store':
      return Expressions.f64_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.const':
      return Expressions.f64_ConstExpression((<Nodes.F64LiteralNode>args[0]).value);
    // TODO: f64.neg
    // TODO: f64.abs
    // TODO: f64.ceil
    // TODO: f64.floor
    // TODO: f64.trunc
    // TODO: f64.nearest
    // TODO: f64.sqrt
    // TODO: f64.reinterpret
    // TODO: f64.convert_s.i32
    // TODO: f64.convert_s.i64
    // TODO: f64.convert_u.i32
    // TODO: f64.convert_u.i64
    // TODO: f64.promote
    case 'f64.add':
      return Expressions.f64_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.sub':
      return Expressions.f64_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: f64.mul
    // TODO: f64.div
    // TODO: f64.copysign
    // TODO: f64.min
    // TODO: f64.max
    case 'f64.eq':
      return Expressions.f64_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    // TODO: f64.ne
    // TODO: f64.lt
    // TODO: f64.le
    // TODO: f64.gt
    // TODO: f64.ge
    // TODO: V128
  }
  return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
};

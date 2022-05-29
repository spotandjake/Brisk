import * as Nodes from '../Types/ParseNodes';
import { CodeGenNode } from '../Types/CodeGenNodes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { UnresolvedBytes } from '../../wasmBuilder/Types/Nodes';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
export const mapExpression = (
  rawProgram: string,
  node: Nodes.WasmCallExpressionNode,
  _generateCode: (childNode: CodeGenNode) => UnresolvedBytes
): UnresolvedBytes => {
  const path = node.name.slice('@wasm.'.length);
  const args = node.args;
  switch (path) {
    case 'unreachable':
      return Expressions.unreachableExpression();
    case 'nop':
      return Expressions.nopExpression();
    case 'data.drop':
      return Expressions.dropExpression(_generateCode(args[0]));
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
    case 'i32.load':
      return Expressions.i32_LoadExpression(_generateCode(args[0]));
    case 'i64.load':
      return Expressions.i32_LoadExpression(_generateCode(args[0]));
    case 'f32.load':
      return Expressions.f32_LoadExpression(_generateCode(args[0]));
    case 'f64.load':
      return Expressions.f64_LoadExpression(_generateCode(args[0]));
    case 'i32.load8_s':
      return Expressions.i32_Load8_sExpression(_generateCode(args[0]));
    case 'i32.load8_u':
      return Expressions.i32_Load8_uExpression(_generateCode(args[0]));
    case 'i32.load16_s':
      return Expressions.i32_Load16_sExpression(_generateCode(args[0]));
    case 'i32.load16_u':
      return Expressions.i32_Load16_uExpression(_generateCode(args[0]));
    case 'i64.load8_s':
      return Expressions.i64_Load8_sExpression(_generateCode(args[0]));
    case 'i64.load8_u':
      return Expressions.i64_Load8_uExpression(_generateCode(args[0]));
    case 'i64.load16_s':
      return Expressions.i64_Load16_sExpression(_generateCode(args[0]));
    case 'i64.load16_u':
      return Expressions.i64_Load16_sExpression(_generateCode(args[0]));
    case 'i64.load32_s':
      return Expressions.i64_Load32_sExpression(_generateCode(args[0]));
    case 'i64.load32_u':
      return Expressions.i64_Load32_sExpression(_generateCode(args[0]));
    case 'i32.store':
      return Expressions.i32_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store':
      return Expressions.i64_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.store':
      return Expressions.f32_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.store':
      return Expressions.f64_StoreExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.store8':
      return Expressions.i32_Store8Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.store16':
      return Expressions.i32_Store16Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store8':
      return Expressions.i64_Store8Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store16':
      return Expressions.i64_Store16Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.store32':
      return Expressions.i64_Store32Expression(_generateCode(args[0]), _generateCode(args[1]));
    case 'memory.size':
      return Expressions.memory_SizeExpression();
    case 'memory.grow':
      return Expressions.memory_GrowExpression(_generateCode(args[0]));
    case 'i32.const':
      return Expressions.i32_ConstExpression((<Nodes.NumberLiteralNode>args[0]).value);
    case 'i64.const':
      return Expressions.i64_ConstExpression((<Nodes.NumberLiteralNode>args[0]).value);
    case 'f32.const':
      return Expressions.f32_ConstExpression((<Nodes.NumberLiteralNode>args[0]).value);
    case 'f64.const':
      return Expressions.f64_ConstExpression((<Nodes.NumberLiteralNode>args[0]).value);
    case 'i32.eqz':
      return Expressions.i32_eqzExpression(_generateCode(args[0]));
    case 'i32.eq':
      return Expressions.i32_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.ne':
      return Expressions.i32_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.lt_s':
      return Expressions.i32_lt_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.lt_u':
      return Expressions.i32_lt_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.gt_s':
      return Expressions.i32_gt_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.gt_u':
      return Expressions.i32_gt_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.le_s':
      return Expressions.i32_le_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.le_u':
      return Expressions.i32_le_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.ge_s':
      return Expressions.i32_ge_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.ge_u':
      return Expressions.i32_ge_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.eqz':
      return Expressions.i64_eqzExpression(_generateCode(args[0]));
    case 'i64.eq':
      return Expressions.i64_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.ne':
      return Expressions.i64_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.lt_s':
      return Expressions.i64_lt_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.lt_u':
      return Expressions.i64_lt_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.gt_s':
      return Expressions.i64_gt_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.gt_u':
      return Expressions.i64_gt_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.le_s':
      return Expressions.i64_le_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.le_u':
      return Expressions.i64_le_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.ge_s':
      return Expressions.i64_ge_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.ge_u':
      return Expressions.i64_ge_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.eq':
      return Expressions.f32_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.ne':
      return Expressions.f32_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.lt':
      return Expressions.f32_ltExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.gt':
      return Expressions.f32_gtExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.le':
      return Expressions.f32_leExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.ge':
      return Expressions.f32_geExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.eq':
      return Expressions.f64_eqExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.ne':
      return Expressions.f64_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.lt':
      return Expressions.f64_neExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.gt':
      return Expressions.f64_gtExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.le':
      return Expressions.f64_leExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.ge':
      return Expressions.f64_geExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.clz':
      return Expressions.i32_clzExpression(_generateCode(args[0]));
    case 'i32.ctz':
      return Expressions.i32_ctzExpression(_generateCode(args[0]));
    case 'i32.popcnt':
      return Expressions.i32_popcntExpression(_generateCode(args[0]));
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
    case 'i32.rem_s':
      return Expressions.i32_Rem_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.rem_u':
      return Expressions.i32_Rem_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.and':
      return Expressions.i32_AndExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.or':
      return Expressions.i32_orExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.xor':
      return Expressions.i32_xorExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.shl':
      return Expressions.i32_shlExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.shr_s':
      return Expressions.i32_shr_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.shr_u':
      return Expressions.i32_shr_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.rotl':
      return Expressions.i32_rotlExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.rotr':
      return Expressions.i32_rotrExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.clz':
      return Expressions.i64_clzExpression(_generateCode(args[0]));
    case 'i64.ctz':
      return Expressions.i64_ctzExpression(_generateCode(args[0]));
    case 'i64.popcnt':
      return Expressions.i64_popcntExpression(_generateCode(args[0]));
    case 'i64.add':
      return Expressions.i64_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.sub':
      return Expressions.i64_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.mul':
      return Expressions.i64_MulExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.div_s':
      return Expressions.i64_Div_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.div_u':
      return Expressions.i64_Div_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.rem_s':
      return Expressions.i64_Rem_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.rem_u':
      return Expressions.i64_Rem_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.and':
      return Expressions.i64_AndExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.or':
      return Expressions.i64_orExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.xor':
      return Expressions.i64_xorExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.shl':
      return Expressions.i64_shlExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.shr_s':
      return Expressions.i64_shr_sExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.shr_u':
      return Expressions.i64_shr_uExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.rotl':
      return Expressions.i64_rotlExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i64.rotr':
      return Expressions.i64_rotrExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.abs':
      return Expressions.f32_absExpression(_generateCode(args[0]));
    case 'f32.neg':
      return Expressions.f32_negExpression(_generateCode(args[0]));
    case 'f32.ceil':
      return Expressions.f32_ceilExpression(_generateCode(args[0]));
    case 'f32.floor':
      return Expressions.f32_floorExpression(_generateCode(args[0]));
    case 'f32.trunc':
      return Expressions.f32_truncExpression(_generateCode(args[0]));
    case 'f32.nearest':
      return Expressions.f32_nearestExpression(_generateCode(args[0]));
    case 'f32.sqrt':
      return Expressions.f32_sqrtExpression(_generateCode(args[0]));
    case 'f32.add':
      return Expressions.f32_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.sub':
      return Expressions.f32_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.mul':
      return Expressions.f32_MulExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.div':
      return Expressions.f32_DivExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.min':
      return Expressions.f32_MinExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.max':
      return Expressions.f32_MaxExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f32.copysign':
      return Expressions.f32_copysignExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.abs':
      return Expressions.f64_absExpression(_generateCode(args[0]));
    case 'f64.neg':
      return Expressions.f64_negExpression(_generateCode(args[0]));
    case 'f64.ceil':
      return Expressions.f64_ceilExpression(_generateCode(args[0]));
    case 'f64.floor':
      return Expressions.f64_floorExpression(_generateCode(args[0]));
    case 'f64.trunc':
      return Expressions.f64_truncExpression(_generateCode(args[0]));
    case 'f64.nearest':
      return Expressions.f64_nearestExpression(_generateCode(args[0]));
    case 'f64.sqrt':
      return Expressions.f64_sqrtExpression(_generateCode(args[0]));
    case 'f64.add':
      return Expressions.f64_AddExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.sub':
      return Expressions.f64_SubExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.mul':
      return Expressions.f64_MulExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.div':
      return Expressions.f64_DivExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.min':
      return Expressions.f64_MinExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.max':
      return Expressions.f64_MaxExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'f64.copysign':
      return Expressions.f64_CopySignExpression(_generateCode(args[0]), _generateCode(args[1]));
    case 'i32.wrap':
      return Expressions.i32_wrap_i64Expression(_generateCode(args[0]));
    case 'i32.trunc_s.f32':
      return Expressions.i32_trunc_f32_s_Expression(_generateCode(args[0]));
    case 'i32.trunc_u.f32':
      return Expressions.i32_trunc_f32_u_Expression(_generateCode(args[0]));
    case 'i32.trunc_s.f64':
      return Expressions.i32_trunc_f64_s_Expression(_generateCode(args[0]));
    case 'i32.trunc_u.f64':
      return Expressions.i32_trunc_f64_u_Expression(_generateCode(args[0]));
    case 'i64.extend_s':
      return Expressions.i64_extend_i32_s_Expression(_generateCode(args[0]));
    case 'i64.extend_u':
      return Expressions.i64_extend_i32_u_Expression(_generateCode(args[0]));
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
    // TODO: i32.trunc_s_sat.f32
    // TODO: i32.trunc_s_sat.f64
    // TODO: i32.trunc_u_sat.f32
    // TODO: i32.trunc_u_sat.f64
    // TODO: i32.reinterpret
    // TODO: i32.extend8_s
    // TODO: i32.extend8_u
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
    // TODO: i64.extend16_s
    // TODO: i64.extend32_s
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
    // TODO: f32.reinterpret
    // TODO: f32.convert_s.i32
    // TODO: f32.convert_s.i64
    // TODO: f32.convert_u.i32
    // TODO: f32.convert_u.i64
    // TODO: f32.demote
    // TODO: f64.reinterpret
    // TODO: f64.convert_s.i32
    // TODO: f64.convert_s.i64
    // TODO: f64.convert_u.i32
    // TODO: f64.convert_u.i64
    // TODO: f64.promote
    // TODO: V128
  }
  return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
};

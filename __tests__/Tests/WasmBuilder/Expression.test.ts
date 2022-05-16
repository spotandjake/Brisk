// Test Utils
import { expect, test } from '@jest/globals';
// Test Components
import * as Expressions from '../../../src/wasmBuilder/Build/Expression';
import { ieee754, signedLEB128 } from '../../../src/wasmBuilder/Build/Utils';
// TODO: Test Utils
// WasmBuilder Expressions Tests
test('WasmBuilder-Expressions: unreachableExpression', () => {
  expect(Expressions.unreachableExpression()).toEqual(expect.arrayContaining([0x00]));
});
test('WasmBuilder-Expressions: nopExpression', () => {
  expect(Expressions.nopExpression()).toEqual(expect.arrayContaining([0x01]));
});
// TODO: BlockExpression
// TODO: LoopExpression
test('WasmBuilder-Expressions: ifExpression', () => {
  expect(
    Expressions.ifExpression(Expressions.nopExpression(), Expressions.nopExpression())
  ).toEqual(
    expect.arrayContaining([
      ...Expressions.nopExpression(),
      0x04,
      0x40,
      ...Expressions.nopExpression(),
      0x0b,
    ])
  );
});
test('WasmBuilder-Expressions: ifExpression-elseExpression', () => {
  expect(
    Expressions.ifExpression(Expressions.nopExpression(), Expressions.nopExpression())
  ).toEqual(
    expect.arrayContaining([
      ...Expressions.nopExpression(),
      0x04,
      0x40,
      ...Expressions.nopExpression(),
      ...Expressions.nopExpression(),
      0x0b,
    ])
  );
});
// TODO: brExpression
// TODO: br_IfExpression
// TODO: br_table
test('WasmBuilder-Expressions: returnExpression', () => {
  expect(Expressions.returnExpression(Expressions.nopExpression())).toEqual(
    expect.arrayContaining([...Expressions.nopExpression(), 0x0f])
  );
});
// TODO: callExpression
// TODO: Call Indirect
test('WasmBuilder-Expressions: dropExpression', () => {
  expect(Expressions.dropExpression(Expressions.nopExpression())).toEqual(
    expect.arrayContaining([...Expressions.nopExpression(), 0x1a])
  );
});
// TODO: Select
// TODO: Local_GetExpression
// TODO: Local_SetExpression
// TODO: Local_TeeExpression
// TODO: Global_GetExpression
// TODO: Global_SetExpression
// TODO: table_get
// TODO: table_set
// TODO: i32_loadExpr,
// TODO: i64_loadExpr,
// TODO: f32_loadExpr,
// TODO: f64_loadExpr,
// TODO: i32_load8_sExpr,
// TODO: i32_load8_uExpr,
// TODO: i32_load16_sExpr,
// TODO: i32_load16_uExpr,
// TODO: i64_load8_sExpr,
// TODO: i64_load8_uExpr,
// TODO: i64_load16_sExpr,
// TODO: i64_load16_uExpr,
// TODO: i64_load32_sExpr,
// TODO: i64_load32_uExpr,
// TODO: i32_storeExpr,
// TODO: i64_storeExpr,
// TODO: f32_storeExpr,
// TODO: f64_storeExpr,
// TODO: i32_store8Expr,
// TODO: i32_store16Expr,
// TODO: i64_store8Expr,
// TODO: i64_store16Expr,
// TODO: i64_store32Expr,
test('WasmBuilder-Expressions: memory_SizeExpression', () => {
  expect(Expressions.memory_SizeExpression()).toEqual(expect.arrayContaining([0x3f]));
});
test('WasmBuilder-Expressions: memory_GrowExpression', () => {
  expect(Expressions.memory_GrowExpression(Expressions.nopExpression())).toEqual(
    expect.arrayContaining([...Expressions.nopExpression(), 0x40])
  );
});
test('WasmBuilder-Expressions: i32_ConstExpression', () => {
  expect(Expressions.i32_ConstExpression(1)).toEqual(
    expect.arrayContaining([0x41, ...signedLEB128(1)])
  );
});
// TODO: i64_Const
test('WasmBuilder-Expressions: f32_ConstExpression', () => {
  expect(Expressions.f32_ConstExpression(1)).toEqual(expect.arrayContaining([0x43, ...ieee754(1)]));
});
test('WasmBuilder-Expressions: f64_ConstExpression', () => {
  expect(Expressions.f64_ConstExpression(1)).toEqual(expect.arrayContaining([0x44, ...ieee754(1)]));
});
// TODO: i32_eqzExpr,
// TODO: i32_eqExpr,
// TODO: i32_neExpr,
// TODO: i32_lt_sExpr,
// TODO: i32_lt_uExpr,
// TODO: i32_gt_sExpr,
// TODO: i32_gt_uExpr,
// TODO: i32_le_sExpr,
// TODO: i32_le_uExpr,
// TODO: i32_ge_sExpr,
// TODO: i32_ge_uExpr,
// TODO: i64_eqzExpr,
// TODO: i64_eqExpr,
// TODO: i64_neExpr,
// TODO: i64_lt_sExpr,
// TODO: i64_lt_uExpr,
// TODO: i64_gt_sExpr,
// TODO: i64_gt_uExpr,
// TODO: i64_le_sExpr,
// TODO: i64_le_uExpr,
// TODO: i64_ge_sExpr,
// TODO: i64_ge_uExpr,
// TODO: f32_eqExpr,
// TODO: f32_neExpr,
// TODO: f32_ltExpr,
// TODO: f32_gtExpr,
// TODO: f32_leExpr,
// TODO: f32_geExpr,
// TODO: f64_eqExpr,
// TODO: f64_neExpr,
// TODO: f64_ltExpr,
// TODO: f64_gtExpr,
// TODO: f64_leExpr,
// TODO: f64_geExpr,
// TODO: i32_clzExpr,
// TODO: i32_ctzExpr,
// TODO: i32_popcntExpr,
test('WasmBuilder-Expressions: i32_AddExpression', () => {
  expect(
    Expressions.i32_AddExpression(
      Expressions.i32_ConstExpression(1),
      Expressions.i32_ConstExpression(1)
    )
  ).toEqual(
    expect.arrayContaining([
      ...Expressions.i32_ConstExpression(1),
      ...Expressions.i32_ConstExpression(1),
      0x6a,
    ])
  );
});
// TODO: i32_subExpr,
// TODO: i32_mulExpr,
// TODO: i32_div_sExpr,
// TODO: i32_div_uExpr,
// TODO: i32_rem_sExpr,
// TODO: i32_rem_uExpr,
// TODO: i32_andExpr,
// TODO: i32_orExpr,
// TODO: i32_xorExpr,
// TODO: i32_shlExpr,
// TODO: i32_shr_sExpr,
// TODO: i32_shr_uExpr,
// TODO: i32_rotlExpr,
// TODO: i32_rotrExpr,
// TODO: i64_clzExpr,
// TODO: i64_ctzExpr,
// TODO: i64_popcntExpr,
// TODO: i64_addExpr,
// TODO: i64_subExpr,
// TODO: i64_mulExpr,
// TODO: i64_div_sExpr,
// TODO: i64_div_uExpr,
// TODO: i64_rem_sExpr,
// TODO: i64_rem_uExpr,
// TODO: i64_andExpr,
// TODO: i64_orExpr,
// TODO: i64_xorExpr,
// TODO: i64_shlExpr,
// TODO: i64_shr_sExpr,
// TODO: i64_shr_uExpr,
// TODO: i64_rotlExpr,
// TODO: i64_rotrExpr,
// TODO: f32_absExpr,
// TODO: f32_negExpr,
// TODO: f32_ceilExpr,
// TODO: f32_floorExpr,
// TODO: f32_truncExpr,
// TODO: f32_nearestExpr,
// TODO: f32_sqrtExpr,
// TODO: f32_addExpr,
// TODO: f32_subExpr,
// TODO: f32_mulExpr,
// TODO: f32_divExpr,
// TODO: f32_minExpr,
// TODO: f32_maxExpr,
// TODO: f32_copysignExpr,
// TODO: f64_absExpr,
// TODO: f64_negExpr,
// TODO: f64_ceilExpr,
// TODO: f64_floorExpr,
// TODO: f64_truncExpr,
// TODO: f64_nearestExpr,
// TODO: f64_sqrtExpr,
// TODO: f64_addExpr,
// TODO: f64_subExpr,
// TODO: f64_mulExpr,
// TODO: f64_divExpr,
// TODO: f64_minExpr,
// TODO: f64_maxExpr,
// TODO: f64_copysignExpr,
// TODO: i32_wrap_i64Expr,
// TODO: i32_trunc_f32_sExpr,
// TODO: i32_trunc_f32_uExpr,
// TODO: i32_trunc_f64_sExpr,
// TODO: i32_trunc_f64_uExpr,
// TODO: i64_extend_i32_sExpr,
// TODO: i64_extend_i32_uExpr,
// TODO: i64_trunc_f32_sExpr,
// TODO: i64_trunc_f32_uExpr,
// TODO: i64_trunc_f64_sExpr,
// TODO: i64_trunc_f64_uExpr,
// TODO: f32_convert_i32_sExpr,
// TODO: f32_convert_i32_uExpr,
// TODO: f32_convert_i64_sExpr,
// TODO: f32_convert_i64_uExpr,
// TODO: f32_demote_f64Expr,
// TODO: f64_convert_i32_sExpr,
// TODO: f64_convert_i32_uExpr,
// TODO: f64_convert_i64_sExpr,
// TODO: f64_convert_i64_uExpr,
// TODO: f64_promote_f32Expr,
// TODO: i32_reinterpret_f32Expr,
// TODO: i64_reinterpret_f64Expr,
// TODO: f32_reinterpret_i32Expr,
// TODO: f64_reinterpret_i64Expr,
// TODO: i32_extend8_sExpr,
// TODO: i32_extend16_sExpr,
// TODO: i64_extend8_sExpr,
// TODO: i64_extend16_sExpr,
// TODO: i64_extend32_sExpr,
// TODO: ref_nullExpr,
// TODO: ref_is_nullExpr,
// TODO: ref_funcExpr,
// TODO: i32_trunc_sat_f32_sExpr,
// TODO: i32_trunc_sat_f32_uExpr,
// TODO: i32_trunc_sat_f64_sExpr,
// TODO: i32_trunc_sat_f64_uExpr,
// TODO: i64_trunc_sat_f32_sExpr,
// TODO: i64_trunc_sat_f32_uExpr,
// TODO: i64_trunc_sat_f64_sExpr,
// TODO: i64_trunc_sat_f64_uExpr,
// TODO: memory_initExpr,
// TODO: data_dropExpr,
// TODO: memory_copyExpr,
// TODO: memory_fillExpr,
// TODO: table_initExpr,
// TODO: elem_dropExpr,
// TODO: table_copyExpr,
// TODO: table_growExpr,
// TODO: table_sizeExpr,
// TODO: table_fillExpr,
// TODO: v128_loadExpr,
// TODO: v128_load_8x8_sExpr,
// TODO: v128_load_8x8_uExpr,
// TODO: v128_load_16x4_sExpr,
// TODO: v128_load_16x4_uExpr,
// TODO: v128_load_32x2_sExpr,
// TODO: v128_load_32x2_uExpr,
// TODO: v128_load_splatExpr,
// TODO: v128_constExpr,
// TODO: i8x16_shuffleExpr,
// TODO: i8x16_swizzleExpr,
// TODO: i8x16_splatExpr,
// TODO: i16x8_splatExpr,
// TODO: i32x4_splatExpr,
// TODO: i64x2_splatExpr,
// TODO: f32x4_splatExpr,
// TODO: f64x2_splatExpr,
// TODO: i8x16_extract_lane_sExpr,
// TODO: i8x16_extract_lane_uExpr,
// TODO: i8x16_replace_laneExpr,
// TODO: i16x8_extract_lane_sExpr,
// TODO: i16x8_extract_lane_uExpr,
// TODO: i16x8_replace_laneExpr,
// TODO: i32x4_extract_laneExpr,
// TODO: i32x4_replace_laneExpr,
// TODO: i64x2_extract_laneExpr,
// TODO: i64x2_replace_laneExpr,
// TODO: f32x4_extract_laneExpr,
// TODO: f32x4_replace_laneExpr,
// TODO: f64x2_extract_laneExpr,
// TODO: f64x2_replace_laneExpr,
// TODO: i8x16_eqExpr,
// TODO: i8x16_neExpr,
// TODO: i8x16_lt_sExpr,
// TODO: i8x16_lt_uExpr,
// TODO: i8x16_gt_sExpr,
// TODO: i8x16_gt_uExpr,
// TODO: i8x16_le_sExpr,
// TODO: i8x16_le_uExpr,
// TODO: i8x16_ge_sExpr,
// TODO: i8x16_ge_uExpr,
// TODO: i16x8_eqExpr,
// TODO: i16x8_neExpr,
// TODO: i16x8_lt_sExpr,
// TODO: i16x8_lt_uExpr,
// TODO: i16x8_gt_sExpr,
// TODO: i16x8_gt_uExpr,
// TODO: i16x8_le_sExpr,
// TODO: i16x8_le_uExpr,
// TODO: i16x8_ge_sExpr,
// TODO: i16x8_ge_uExpr,
// TODO: i32x4_eqExpr,
// TODO: i32x4_neExpr,
// TODO: i32x4_lt_sExpr,
// TODO: i32x4_lt_uExpr,
// TODO: i32x4_gt_sExpr,
// TODO: i32x4_gt_uExpr,
// TODO: i32x4_le_sExpr,
// TODO: i32x4_le_uExpr,
// TODO: i32x4_ge_sExpr,
// TODO: i32x4_ge_uExpr,
// TODO: f32x4_eqExpr,
// TODO: f32x4_neExpr,
// TODO: f32x4_ltExpr,
// TODO: f32x4_gtExpr,
// TODO: f32x4_leExpr,
// TODO: f32x4_geExpr,
// TODO: f64x2_eqExpr,
// TODO: f64x2_neExpr,
// TODO: f64x2_ltExpr,
// TODO: f64x2_gtExpr,
// TODO: f64x2_leExpr,
// TODO: f64x2_geExpr,
// TODO: v128_notExpr,
// TODO: v128_andExpr,
// TODO: v128_andnotExpr,
// TODO: v128_orExpr,
// TODO: v128_xorExpr,
// TODO: v128_bitselectExpr,
// TODO: v128_any_trueExpr,
// TODO: v128_load8_laneExpr,
// TODO: v128_load16_laneExpr,
// TODO: v128_load32_laneExpr,
// TODO: v128_load64_laneExpr,
// TODO: v128_store8_laneExpr,
// TODO: v128_store16_laneExpr,
// TODO: v128_store32_laneExpr,
// TODO: v128_store64_laneExpr,
// TODO: v128_load32_zeroExpr,
// TODO: v128_load64_zeroExpr,
// TODO: i8x16_absExpr,
// TODO: i8x16_negExpr,
// TODO: i8x16_popcntExpr,
// TODO: i8x16_all_trueExpr,
// TODO: i8x16_bitmaskExpr,
// TODO: i8x16_narrow_i16x8_sExpr,
// TODO: i8x16_narrow_i16x8_uExpr,
// TODO: f32x4_ceilExpr,
// TODO: f32x4_floorExpr,
// TODO: f32x4_truncExpr,
// TODO: f32x4_nearestExpr,
// TODO: i8x16_shlExpr,
// TODO: i8x16_shr_sExpr,
// TODO: i8x16_shr_uExpr,
// TODO: i8x16_addExpr,
// TODO: i8x16_add_sat_sExpr,
// TODO: i8x16_add_sat_uExpr,
// TODO: i8x16_subExpr,
// TODO: i8x16_sub_sat_sExpr,
// TODO: i8x16_sub_sat_uExpr,
// TODO: f64x2_ceilExpr,
// TODO: f64x2_floorExpr,
// TODO: i8x16_min_sExpr,
// TODO: i8x16_min_uExpr,
// TODO: i8x16_max_sExpr,
// TODO: i8x16_max_uExpr,
// TODO: f64x2_truncExpr,
// TODO: i16x8_extadd_pairwise_i8x16_sExpr,
// TODO: i16x8_extadd_pairwise_i8x16_uExpr,
// TODO: i32x4_extadd_pairwise_i16x8_sExpr,
// TODO: i32x4_extadd_pairwise_i16x8_uExpr,
// TODO: i16x8_absExpr,
// TODO: i16x8_negExpr,
// TODO: i16x8_q15mulr_sat_sExpr,
// TODO: i16x8_all_trueExpr,
// TODO: i16x8_bitmaskExpr,
// TODO: i16x8_narrow_i32x4_sExpr,
// TODO: i16x8_narrow_i32x4_uExpr,
// TODO: i16x8_extend_low_i8x16_sExpr,
// TODO: i16x8_extend_high_i8x16_sExpr,
// TODO: i16x8_extend_low_i8x16_uExpr,
// TODO: i16x8_extend_high_i8x16_uExpr,
// TODO: i16x8_shr_sExpr,
// TODO: i16x8_shr_uExpr,
// TODO: i16x8_addExpr,
// TODO: i16x8_add_sat_sExpr,
// TODO: i16x8_add_sat_uExpr,
// TODO: i16x8_subExpr,
// TODO: i16x8_sub_sat_sExpr,
// TODO: i16x8_sub_sat_uExpr,
// TODO: f64x2_nearestExpr,
// TODO: i16x8_mulExpr,
// TODO: i16x8_min_sExpr,
// TODO: i16x8_min_uExpr,
// TODO: i16x8_max_sExpr,
// TODO: i16x8_max_uExpr,
// TODO: i16x8_avgr_uExpr,
// TODO: i16x8_extmul_low_i8x16_sExpr,
// TODO: i16x8_extmul_high_i8x16_sExpr,
// TODO: i16x8_extmul_low_i8x16_uExpr,
// TODO: i16x8_extmul_high_i8x16_uExpr,
// TODO: i32x4_abExpr,
// TODO: i32x4_negExpr,
// TODO: i32x4_all_trueExpr,
// TODO: i32x4_bitmaskExpr,
// TODO: i32x4_extend_low_i16x8_sExpr,
// TODO: i32x4_extend_high_i16x8_sExpr,
// TODO: i32x4_extend_low_i16x8_uExpr,
// TODO: i32x4_extend_high_i16x8_uExpr,
// TODO: i32x4_shlExpr,
// TODO: i32x4_shr_sExpr,
// TODO: i32x4_shr_uExpr,
// TODO: i32x4_addExpr,
// TODO: i32x4_subExpr,
// TODO: i32x4_mulExpr,
// TODO: i32x4_min_sExpr,
// TODO: i32x4_min_uExpr,
// TODO: i32x4_max_sExpr,
// TODO: i32x4_max_uExpr,
// TODO: i32x4_dot_i16x8_sExpr,
// TODO: i32x4_extmul_low_i16x8_sExpr,
// TODO: i32x4_extmul_high_i16x8_sExpr,
// TODO: i32x4_extmul_low_i16x8_uExpr,
// TODO: i32x4_extmul_high_i16x8_uExpr,
// TODO: i64x2_absExpr,
// TODO: i64x2_negExpr,
// TODO: i64x2_all_trueExpr,
// TODO: i64x2_bitmaskExpr,
// TODO: i64x2_extend_low_i32x4_sExpr,
// TODO: i64x2_extend_high_i32x4_sExpr,
// TODO: i64x2_extend_low_i32x4_uExpr,
// TODO: i64x2_extend_high_i32x4_uExpr,
// TODO: i64x2_shlExpr,
// TODO: i64x2_shr_sExpr,
// TODO: i64x2_shr_uExpr,
// TODO: i64x2_addExpr,
// TODO: i64x2_subExpr,
// TODO: i64x2_mulExpr,
// TODO: i64x2_eqExpr,
// TODO: i64x2_neExpr,
// TODO: i64x2_lt_sExpr,
// TODO: i64x2_gt_sExpr,
// TODO: i64x2_le_sExpr,
// TODO: i64x2_ge_sExpr,
// TODO: i64x2_extmul_low_i32x4_sExpr,
// TODO: i64x2_extmul_high_i32x4_sExpr,
// TODO: i64x2_extmul_low_i32x4_uExpr,
// TODO: i64x2_extmul_high_i32x4_uExpr,
// TODO: f32x4_absExpr,
// TODO: f32x4_negExpr,
// TODO: f32x4_sqrtExpr,
// TODO: f32x4_addExpr,
// TODO: f32x4_subExpr,
// TODO: f32x4_mulExpr,
// TODO: f32x4_divExpr,
// TODO: f32x4_minExpr,
// TODO: f32x4_maxExpr,
// TODO: f32x4_pmin,
// TODO: f32x4_pmax,
// TODO: f64x2_abs,
// TODO: f64x2_neg,
// TODO: f64x2_sqrt,
// TODO: f64x2_add,
// TODO: f64x2_sub,
// TODO: f64x2_mul
// TODO: f64x2_div
// TODO: f64x2_min
// TODO: f64x2_max
// TODO: f64x2_pmin
// TODO: f64x2_pmax
// TODO: i32x4_trunc_sat_f32x4_sExpr
// TODO: i32x4_trunc_sat_f32x4_uExpr
// TODO: f32x4_convert_i32x4_sExpr
// TODO: f32x4_convert_i32x4_uExpr
// TODO: i32x4_trunc_sat_f64x2_s_zeroExpr
// TODO: i32x4_trunc_sat_f64x2_u_zeroExpr
// TODO: f64x2_convert_low_i32x4_sExpr
// TODO: f64x2_convert_low_i32x4_uExpr
// TODO: Testing For Labels

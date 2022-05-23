import { ResolvedBytes, UnresolvedBytes } from '../Types/Nodes';
import { ieee754, signedLEB128, unsignedLEB128 } from './Utils';
// Expressions
export const unreachableExpression = (): ResolvedBytes => [0x00]; // Wasm Unreachable Instruction
export const nopExpression = (): ResolvedBytes => [0x01]; // Wasm nop Instruction
export const blockExpression = (
  label: string | undefined,
  body: UnresolvedBytes[]
): UnresolvedBytes => {
  // Resolve Any Labels
  const wasmBody: UnresolvedBytes = [];
  let depthCount = 0;
  for (const byte of body.flat()) {
    // Handle Depth
    if (
      byte == 0x02 || // Block Instruction
      byte == 0x03 // Loop Instruction
    )
      depthCount++;
    // Handle Resolution
    // If label is a string and the last byte is a br or a br_if Instruction
    const lastByte = wasmBody.at(-1);
    if (typeof byte == 'string' && (lastByte == 0x0c || lastByte == 0x0d)) {
      if (byte == label) {
        // Determine Depth
        wasmBody.push(...unsignedLEB128(depthCount));
      } else wasmBody.push(byte);
    } else wasmBody.push(byte);
  }
  // Return Wasm
  return [
    0x02, // Wasm Block Instruction
    0x40, // Wasm Control Flow Block Tag
    ...wasmBody, // Body Content
    0x0b, // End Instruction
  ];
};
export const loopExpression = (
  label: string | undefined,
  body: UnresolvedBytes[]
): UnresolvedBytes => {
  // Resolve Any Labels
  const wasmBody: UnresolvedBytes = [];
  let depthCount = 0;
  for (const byte of body.flat()) {
    // Handle Depth
    if (
      byte == 0x02 || // Block Instruction
      byte == 0x03 // Loop Instruction
    )
      depthCount++;
    // Handle Resolution
    // If label is a string and the last byte is a br or a br_if Instruction
    const lastByte = wasmBody.at(-1);
    if (typeof byte == 'string' && (lastByte == 0x0c || lastByte == 0x0d)) {
      if (byte == label) {
        // Determine Depth
        wasmBody.push(...unsignedLEB128(depthCount));
      } else wasmBody.push(byte);
    } else wasmBody.push(byte);
  }
  // Return Wasm
  return [
    0x03, // Wasm Loop Instruction
    0x40, // Wasm Control Flow Block Tag
    ...wasmBody, // Body Content
    0x0b, // End Instruction
  ];
};
export const ifExpression = (
  condition: UnresolvedBytes,
  body: UnresolvedBytes,
  alternative?: UnresolvedBytes
): UnresolvedBytes => [
  ...condition, // Condition Content
  0x04, // Wasm If Instruction
  0x40, // Wasm Control Flow Block Tag
  ...body, // Body Content
  ...(alternative != undefined ? [0x05, ...alternative] : []),
  0x0b, // End Instruction
];
export const brExpression = (depth: number | string): UnresolvedBytes => [
  0x0c, // br Wasm Instruction
  ...(typeof depth == 'string' ? [depth] : unsignedLEB128(depth)), // Encoded Depth
];
export const br_IfExpression = (
  condition: UnresolvedBytes,
  depth: number | string
): UnresolvedBytes => [
  ...condition, // Condition Content
  0x0d, // br_if Wasm Instruction
  ...(typeof depth == 'string' ? [depth] : unsignedLEB128(depth)), // Encoded Depth
];
// TODO: br_table
export const returnExpression = (body: UnresolvedBytes): UnresolvedBytes => [
  ...body, // Body Content
  0x0f, // Wasm Return Instruction
];
export const callExpression = (
  func: number | string,
  params: UnresolvedBytes[]
): UnresolvedBytes => [
  ...params.flat(),
  0x10, // Wasm Call Instruction
  ...(typeof func == 'string' ? [func] : unsignedLEB128(func)), // Encoded Func Index
];
export const call_indirect = (
  funcIndex: UnresolvedBytes,
  params: UnresolvedBytes[],
  funcType: number
): UnresolvedBytes => [
  ...params.flat(), // Parameters
  ...funcIndex, // Function Index
  0x11, // Wasm Call_indirect Instruction
  funcType, // Function Type Reference
  0x00, // Wasm Function Table
  // TODO: Allow You To Set The Function Table
  // TODO : Allow for the function signature to be labeled
];
export const dropExpression = (body: UnresolvedBytes): UnresolvedBytes => [
  ...body, // Body Content
  0x1a, // Wasm Drop Instruction
];
// TODO: Select
export const local_GetExpression = (local: number | string): UnresolvedBytes => [
  0x20, // Wasm Local.Get Instruction
  ...(typeof local == 'string' ? [local] : unsignedLEB128(local)), // Encoded Func Index
];
export const local_SetExpression = (
  local: number | string,
  body: UnresolvedBytes
): UnresolvedBytes => [
  ...body, // Body Content
  0x21, // Wasm Local.Set Instruction
  ...(typeof local == 'string' ? [local] : unsignedLEB128(local)), // Encoded Local Index
];
export const local_TeeExpression = (
  local: number | string,
  body: UnresolvedBytes
): UnresolvedBytes => [
  ...body, // Body Content
  0x22, // Wasm Local.Set Instruction
  ...(typeof local == 'string' ? [local] : unsignedLEB128(local)), // Encoded Local Index
];
export const global_GetExpression = (global: number | string): UnresolvedBytes => [
  0x23, // Wasm Global.Get Instruction
  ...(typeof global == 'string' ? [global] : unsignedLEB128(global)), // Encoded Global Index
];
export const global_SetExpression = (
  global: number | string,
  body: UnresolvedBytes
): UnresolvedBytes => [
  ...body, // Body Content
  0x24, // Wasm Local.Set Instruction
  ...(typeof global == 'string' ? [global] : unsignedLEB128(global)), // Encoded Global Index
];
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
export const memory_SizeExpression = (): ResolvedBytes => [0x3f]; // Wasm memory.size Instruction
export const memory_GrowExpression = (body: UnresolvedBytes): UnresolvedBytes => [
  ...body, // Body Content
  0x40, // Wasm Memory.Size Instruction
];
export const i32_ConstExpression = (value: number): ResolvedBytes => [
  0x41, // Wasm i32.Const Instruction
  ...signedLEB128(value),
];
export const i64_ConstExpression = (value: number | bigint): ResolvedBytes => {
  if (typeof value == 'bigint') {
    // TODO: Handle BigInt
    throw new Error('Handle BigInt');
  } else {
    return [
      0x41, // Wasm i32.Const Instruction
      ...signedLEB128(value),
    ];
  }
};
export const f32_ConstExpression = (value: number): ResolvedBytes => [
  0x43, // Wasm f32.Const Instruction
  ...ieee754(value),
];
export const f64_ConstExpression = (value: number): ResolvedBytes => [
  0x44, // Wasm f64.Const Instruction
  ...ieee754(value),
];
// TODO: i32_eqzExpr,
export const i32_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x46, // Wasm i32.eq Instruction
];
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
export const i64_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x51, // Wasm i64.eq Instruction
];
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
export const f32_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5b, // Wasm f32.eq Instruction
];
// TODO: f32_neExpr,
// TODO: f32_ltExpr,
// TODO: f32_gtExpr,
// TODO: f32_leExpr,
// TODO: f32_geExpr,
export const f64_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x61, // Wasm f64.eq Instruction
];
// TODO: f64_neExpr,
// TODO: f64_ltExpr,
// TODO: f64_gtExpr,
// TODO: f64_leExpr,
// TODO: f64_geExpr,
// TODO: i32_clzExpr,
// TODO: i32_ctzExpr,
// TODO: i32_popcntExpr,
export const i32_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6a, // Wasm i32.Add Instruction
];
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
export const i64_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x7c, // Wasm i64.Add Instruction
];
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

export const enum WasmType {
  WasmI32 = 0x7f,
  WasmI64 = 0x7e,
  WasmF32 = 0x7d,
  WasmF64 = 0x7c,
}
// Wasm Info
export const enum WasmExternalType {
  function = 0x00,
  table = 0x01,
  memory = 0x02,
  global = 0x03,
}
// Wasm Information Types
export interface WasmImport {
  module: string;
  name: string;
  type: WasmType;
}
export interface WasmMemory {
  // TODO: label
  minPages: number;
  maxPages?: number;
}
export interface WasmGlobal {
  // TODO: label
  mutable: boolean;
  type: WasmType;
  value: WasmExpression;
}
// Wasm Module State
export interface WasmModuleType {
  // Memory Section
  memory: WasmMemory[];
  // Global Section
  globals: WasmGlobal[];
  // Function Section
  functions: WasmFunctionType[];
  // Export Section
  exports: Map<string, { type: WasmExternalType; internalName: number | string }>;
  // StartFunction
  startFunction?: string | number;
}
// Wasm Function State
export interface WasmFunctionType {
  name: string;
  params: WasmType[];
  results: WasmType[];
  locals: WasmType[];
  body: WasmExpression[]; // TODO: Add Type For Wasm Expression
}
// Wasm Expression
export const enum WasmExpressions {
  // General
  unreachableExpr,
  nopExpr,
  blockExpr,
  loopExpr,
  ifExpr,
  brExpr,
  br_ifExpr,
  // TODO: br_table
  returnExpr,
  callExpr,
  callIndirectExpr,
  dropExpr,
  // TODO: Select
  local_getExpr,
  local_setExpr,
  local_teeExpr,
  global_getExpr,
  global_setExpr,
  // TODO: table_get
  // TODO: table_set
  i32_loadExpr,
  i64_loadExpr,
  f32_loadExpr,
  f64_loadExpr,
  i32_load8_sExpr,
  i32_load8_uExpr,
  i32_load16_sExpr,
  i32_load16_uExpr,
  i64_load8_sExpr,
  i64_load8_uExpr,
  i64_load16_sExpr,
  i64_load16_uExpr,
  i64_load32_sExpr,
  i64_load32_uExpr,
  i32_storeExpr,
  i64_storeExpr,
  f32_storeExpr,
  f64_storeExpr,
  i32_store8Expr,
  i32_store16Expr,
  i64_store8Expr,
  i64_store16Expr,
  i64_store32Expr,
  memory_sizeExpr,
  memory_growExpr,
  i32_constExpr,
  i64_constExpr,
  f32_constExpr,
  f64_constExpr,
  // i32_eqzExpr,
  // i32_eqExpr,
  // i32_neExpr,
  // i32_lt_sExpr,
  // i32_lt_uExpr,
  // i32_gt_sExpr,
  // i32_gt_uExpr,
  // i32_le_sExpr,
  // i32_le_uExpr,
  // i32_ge_sExpr,
  // i32_ge_uExpr,
  // i64_eqzExpr,
  // i64_eqExpr,
  // i64_neExpr,
  // i64_lt_sExpr,
  // i64_lt_uExpr,
  // i64_gt_sExpr,
  // i64_gt_uExpr,
  // i64_le_sExpr,
  // i64_le_uExpr,
  // i64_ge_sExpr,
  // i64_ge_uExpr,
  // f32_eqExpr,
  // f32_neExpr,
  // f32_ltExpr,
  // f32_gtExpr,
  // f32_leExpr,
  // f32_geExpr,
  // f64_eqExpr,
  // f64_neExpr,
  // f64_ltExpr,
  // f64_gtExpr,
  // f64_leExpr,
  // f64_geExpr,
  // i32_clzExpr,
  // i32_ctzExpr,
  // i32_popcntExpr,
  i32_addExpr,
  // i32_subExpr,
  // i32_mulExpr,
  // i32_div_sExpr,
  // i32_div_uExpr,
  // i32_rem_sExpr,
  // i32_rem_uExpr,
  // i32_andExpr,
  // i32_orExpr,
  // i32_xorExpr,
  // i32_shlExpr,
  // i32_shr_sExpr,
  // i32_shr_uExpr,
  // i32_rotlExpr,
  // i32_rotrExpr,
  // i64_clzExpr,
  // i64_ctzExpr,
  // i64_popcntExpr,
  // i64_addExpr,
  // i64_subExpr,
  // i64_mulExpr,
  // i64_div_sExpr,
  // i64_div_uExpr,
  // i64_rem_sExpr,
  // i64_rem_uExpr,
  // i64_andExpr,
  // i64_orExpr,
  // i64_xorExpr,
  // i64_shlExpr,
  // i64_shr_sExpr,
  // i64_shr_uExpr,
  // i64_rotlExpr,
  // i64_rotrExpr,
  // f32_absExpr,
  // f32_negExpr,
  // f32_ceilExpr,
  // f32_floorExpr,
  // f32_truncExpr,
  // f32_nearestExpr,
  // f32_sqrtExpr,
  // f32_addExpr,
  // f32_subExpr,
  // f32_mulExpr,
  // f32_divExpr,
  // f32_minExpr,
  // f32_maxExpr,
  // f32_copysignExpr,
  // f64_absExpr,
  // f64_negExpr,
  // f64_ceilExpr,
  // f64_floorExpr,
  // f64_truncExpr,
  // f64_nearestExpr,
  // f64_sqrtExpr,
  // f64_addExpr,
  // f64_subExpr,
  // f64_mulExpr,
  // f64_divExpr,
  // f64_minExpr,
  // f64_maxExpr,
  // f64_copysignExpr,
  // i32_wrap_i64Expr,
  // i32_trunc_f32_sExpr,
  // i32_trunc_f32_uExpr,
  // i32_trunc_f64_sExpr,
  // i32_trunc_f64_uExpr,
  // i64_extend_i32_sExpr,
  // i64_extend_i32_uExpr,
  // i64_trunc_f32_sExpr,
  // i64_trunc_f32_uExpr,
  // i64_trunc_f64_sExpr,
  // i64_trunc_f64_uExpr,
  // f32_convert_i32_sExpr,
  // f32_convert_i32_uExpr,
  // f32_convert_i64_sExpr,
  // f32_convert_i64_uExpr,
  // f32_demote_f64Expr,
  // f64_convert_i32_sExpr,
  // f64_convert_i32_uExpr,
  // f64_convert_i64_sExpr,
  // f64_convert_i64_uExpr,
  // f64_promote_f32Expr,
  // i32_reinterpret_f32Expr,
  // i64_reinterpret_f64Expr,
  // f32_reinterpret_i32Expr,
  // f64_reinterpret_i64Expr,
  // i32_extend8_sExpr,
  // i32_extend16_sExpr,
  // i64_extend8_sExpr,
  // i64_extend16_sExpr,
  // i64_extend32_sExpr,
  // ref_nullExpr,
  // ref_is_nullExpr,
  // ref_funcExpr,
  // i32_trunc_sat_f32_sExpr,
  // i32_trunc_sat_f32_uExpr,
  // i32_trunc_sat_f64_sExpr,
  // i32_trunc_sat_f64_uExpr,
  // i64_trunc_sat_f32_sExpr,
  // i64_trunc_sat_f32_uExpr,
  // i64_trunc_sat_f64_sExpr,
  // i64_trunc_sat_f64_uExpr,
  // memory_initExpr,
  // data_dropExpr,
  // memory_copyExpr,
  // memory_fillExpr,
  // table_initExpr,
  // elem_dropExpr,
  // table_copyExpr,
  // table_growExpr,
  // table_sizeExpr,
  // table_fillExpr,
  // v128_loadExpr,
  // v128_load_8x8_sExpr,
  // v128_load_8x8_uExpr,
  // v128_load_16x4_sExpr,
  // v128_load_16x4_uExpr,
  // v128_load_32x2_sExpr,
  // v128_load_32x2_uExpr,
  // v128_load_splatExpr,
  // // TODO: Figure out why there are four v128_load_splat's
  // v128_constExpr,
  // i8x16_shuffleExpr,
  // i8x16_swizzleExpr,
  // i8x16_splatExpr,
  // i16x8_splatExpr,
  // i32x4_splatExpr,
  // i64x2_splatExpr,
  // f32x4_splatExpr,
  // f64x2_splatExpr,
  // i8x16_extract_lane_sExpr,
  // i8x16_extract_lane_uExpr,
  // i8x16_replace_laneExpr,
  // i16x8_extract_lane_sExpr,
  // i16x8_extract_lane_uExpr,
  // i16x8_replace_laneExpr,
  // i32x4_extract_laneExpr,
  // i32x4_replace_laneExpr,
  // i64x2_extract_laneExpr,
  // i64x2_replace_laneExpr,
  // f32x4_extract_laneExpr,
  // f32x4_replace_laneExpr,
  // f64x2_extract_laneExpr,
  // f64x2_replace_laneExpr,
  // i8x16_eqExpr,
  // i8x16_neExpr,
  // i8x16_lt_sExpr,
  // i8x16_lt_uExpr,
  // i8x16_gt_sExpr,
  // i8x16_gt_uExpr,
  // i8x16_le_sExpr,
  // i8x16_le_uExpr,
  // i8x16_ge_sExpr,
  // i8x16_ge_uExpr,
  // i16x8_eqExpr,
  // i16x8_neExpr,
  // i16x8_lt_sExpr,
  // i16x8_lt_uExpr,
  // i16x8_gt_sExpr,
  // i16x8_gt_uExpr,
  // i16x8_le_sExpr,
  // i16x8_le_uExpr,
  // i16x8_ge_sExpr,
  // i16x8_ge_uExpr,
  // i32x4_eqExpr,
  // i32x4_neExpr,
  // i32x4_lt_sExpr,
  // i32x4_lt_uExpr,
  // i32x4_gt_sExpr,
  // i32x4_gt_uExpr,
  // i32x4_le_sExpr,
  // i32x4_le_uExpr,
  // i32x4_ge_sExpr,
  // i32x4_ge_uExpr,
  // f32x4_eqExpr,
  // f32x4_neExpr,
  // f32x4_ltExpr,
  // f32x4_gtExpr,
  // f32x4_leExpr,
  // f32x4_geExpr,
  // f64x2_eqExpr,
  // f64x2_neExpr,
  // f64x2_ltExpr,
  // f64x2_gtExpr,
  // f64x2_leExpr,
  // f64x2_geExpr,
  // v128_notExpr,
  // v128_andExpr,
  // v128_andnotExpr,
  // v128_orExpr,
  // v128_xorExpr,
  // v128_bitselectExpr,
  // v128_any_trueExpr,
  // v128_load8_laneExpr,
  // v128_load16_laneExpr,
  // v128_load32_laneExpr,
  // v128_load64_laneExpr,
  // v128_store8_laneExpr,
  // v128_store16_laneExpr,
  // v128_store32_laneExpr,
  // v128_store64_laneExpr,
  // v128_load32_zeroExpr,
  // v128_load64_zeroExpr,
  // i8x16_absExpr,
  // i8x16_negExpr,
  // i8x16_popcntExpr,
  // i8x16_all_trueExpr,
  // i8x16_bitmaskExpr,
  // i8x16_narrow_i16x8_sExpr,
  // i8x16_narrow_i16x8_uExpr,
  // f32x4_ceilExpr,
  // f32x4_floorExpr,
  // f32x4_truncExpr,
  // f32x4_nearestExpr,
  // i8x16_shlExpr,
  // i8x16_shr_sExpr,
  // i8x16_shr_uExpr,
  // i8x16_addExpr,
  // i8x16_add_sat_sExpr,
  // i8x16_add_sat_uExpr,
  // i8x16_subExpr,
  // i8x16_sub_sat_sExpr,
  // i8x16_sub_sat_uExpr,
  // f64x2_ceilExpr,
  // f64x2_floorExpr,
  // i8x16_min_sExpr,
  // i8x16_min_uExpr,
  // i8x16_max_sExpr,
  // i8x16_max_uExpr,
  // f64x2_truncExpr,
  // i16x8_extadd_pairwise_i8x16_sExpr,
  // i16x8_extadd_pairwise_i8x16_uExpr,
  // i32x4_extadd_pairwise_i16x8_sExpr,
  // i32x4_extadd_pairwise_i16x8_uExpr,
  // i16x8_absExpr,
  // i16x8_negExpr,
  // i16x8_q15mulr_sat_sExpr,
  // i16x8_all_trueExpr,
  // i16x8_bitmaskExpr,
  // i16x8_narrow_i32x4_sExpr,
  // i16x8_narrow_i32x4_uExpr,
  // i16x8_extend_low_i8x16_sExpr,
  // i16x8_extend_high_i8x16_sExpr,
  // i16x8_extend_low_i8x16_uExpr,
  // i16x8_extend_high_i8x16_uExpr,
  // i16x8_shr_sExpr,
  // i16x8_shr_uExpr,
  // i16x8_addExpr,
  // i16x8_add_sat_sExpr,
  // i16x8_add_sat_uExpr,
  // i16x8_subExpr,
  // i16x8_sub_sat_sExpr,
  // i16x8_sub_sat_uExpr,
  // f64x2_nearestExpr,
  // i16x8_mulExpr,
  // i16x8_min_sExpr,
  // i16x8_min_uExpr,
  // i16x8_max_sExpr,
  // i16x8_max_uExpr,
  // i16x8_avgr_uExpr,
  // i16x8_extmul_low_i8x16_sExpr,
  // i16x8_extmul_high_i8x16_sExpr,
  // i16x8_extmul_low_i8x16_uExpr,
  // i16x8_extmul_high_i8x16_uExpr,
  // i32x4_abExpr,
  // i32x4_negExpr,
  // i32x4_all_trueExpr,
  // i32x4_bitmaskExpr,
  // i32x4_extend_low_i16x8_sExpr,
  // i32x4_extend_high_i16x8_sExpr,
  // i32x4_extend_low_i16x8_uExpr,
  // i32x4_extend_high_i16x8_uExpr,
  // i32x4_shlExpr,
  // i32x4_shr_sExpr,
  // i32x4_shr_uExpr,
  // i32x4_addExpr,
  // i32x4_subExpr,
  // i32x4_mulExpr,
  // i32x4_min_sExpr,
  // i32x4_min_uExpr,
  // i32x4_max_sExpr,
  // i32x4_max_uExpr,
  // i32x4_dot_i16x8_sExpr,
  // i32x4_extmul_low_i16x8_sExpr,
  // i32x4_extmul_high_i16x8_sExpr,
  // i32x4_extmul_low_i16x8_uExpr,
  // i32x4_extmul_high_i16x8_uExpr,
  // i64x2_absExpr,
  // i64x2_negExpr,
  // i64x2_all_trueExpr,
  // i64x2_bitmaskExpr,
  // i64x2_extend_low_i32x4_sExpr,
  // i64x2_extend_high_i32x4_sExpr,
  // i64x2_extend_low_i32x4_uExpr,
  // i64x2_extend_high_i32x4_uExpr,
  // i64x2_shlExpr,
  // i64x2_shr_sExpr,
  // i64x2_shr_uExpr,
  // i64x2_addExpr,
  // i64x2_subExpr,
  // i64x2_mulExpr,
  // i64x2_eqExpr,
  // i64x2_neExpr,
  // i64x2_lt_sExpr,
  // i64x2_gt_sExpr,
  // i64x2_le_sExpr,
  // i64x2_ge_sExpr,
  // i64x2_extmul_low_i32x4_sExpr,
  // i64x2_extmul_high_i32x4_sExpr,
  // i64x2_extmul_low_i32x4_uExpr,
  // i64x2_extmul_high_i32x4_uExpr,
  // f32x4_absExpr,
  // f32x4_negExpr,
  // f32x4_sqrtExpr,
  // f32x4_addExpr,
  // f32x4_subExpr,
  // f32x4_mulExpr,
  // f32x4_divExpr,
  // f32x4_minExpr,
  // f32x4_maxExpr,
  // f32x4_pmin,
  // f32x4_pmax,
  // f64x2_abs,
  // f64x2_neg,
  // f64x2_sqrt,
  // f64x2_add,
  // f64x2_sub,
  // f64x2_mul,
  // f64x2_div,
  // f64x2_min,
  // f64x2_max,
  // f64x2_pmin,
  // f64x2_pmax,
  // i32x4_trunc_sat_f32x4_sExpr,
  // i32x4_trunc_sat_f32x4_uExpr,
  // f32x4_convert_i32x4_sExpr,
  // f32x4_convert_i32x4_uExpr,
  // i32x4_trunc_sat_f64x2_s_zeroExpr,
  // i32x4_trunc_sat_f64x2_u_zeroExpr,
  // f64x2_convert_low_i32x4_sExpr,
  // f64x2_convert_low_i32x4_uExpr,
}
export interface WasmEmptyExpression {
  nodeType: WasmExpressions.unreachableExpr | WasmExpressions.nopExpr;
}
export interface WasmBlockExpression {
  nodeType: WasmExpressions.blockExpr | WasmExpressions.loopExpr;
  label: string | undefined;
  body: WasmExpression[];
}
export interface IfExpression {
  nodeType: WasmExpressions.ifExpr;
  condition: WasmExpression;
  body: WasmExpression;
  alternative?: WasmExpression;
}
export interface BrExpression {
  nodeType: WasmExpressions.brExpr;
  depth: number | string;
}
export interface Br_IfExpression {
  nodeType: WasmExpressions.br_ifExpr;
  condition: WasmExpression;
  depth: number | string;
}
export interface ReturnExpression {
  nodeType: WasmExpressions.returnExpr;
  body: WasmExpression;
}
export interface CallExpression {
  nodeType: WasmExpressions.callExpr;
  funcName: string;
  body: WasmExpression[];
}
export interface CallIndirectExpression {
  nodeType: WasmExpressions.callIndirectExpr;
  funcIndex: number;
  body: WasmExpression[];
}
export interface DropExpression {
  nodeType: WasmExpressions.dropExpr;
  body: WasmExpression;
}
export interface Local_GetExpression {
  nodeType: WasmExpressions.local_getExpr;
  localIndex: number;
  wasmType: WasmType;
}
export interface Local_SetExpression {
  nodeType: WasmExpressions.local_setExpr;
  localIndex: number; // Allow For Local Names
  body: WasmExpression;
}
export interface Local_TeeExpression {
  nodeType: WasmExpressions.local_teeExpr;
  localIndex: number; // Allow For Local Names
  body: WasmExpression;
  wasmType: WasmType;
}
export interface Global_GetExpression {
  nodeType: WasmExpressions.global_getExpr;
  globalIndex: number; // Allow For Global Names
  wasmType: WasmType;
}
export interface Global_SetExpression {
  nodeType: WasmExpressions.global_setExpr;
  globalIndex: number; // Allow For Global Names
  body: WasmExpression;
}
export interface WasmLoadExpression {
  nodeType:
    | WasmExpressions.i32_loadExpr
    | WasmExpressions.i64_loadExpr
    | WasmExpressions.f32_loadExpr
    | WasmExpressions.f64_loadExpr
    | WasmExpressions.i32_load8_sExpr
    | WasmExpressions.i32_load8_uExpr
    | WasmExpressions.i32_load16_sExpr
    | WasmExpressions.i32_load16_uExpr
    | WasmExpressions.i64_load8_sExpr
    | WasmExpressions.i64_load8_uExpr
    | WasmExpressions.i64_load16_sExpr
    | WasmExpressions.i64_load16_uExpr
    | WasmExpressions.i64_load32_sExpr
    | WasmExpressions.i64_load32_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface WasmStoreExpression {
  nodeType:
    | WasmExpressions.i32_storeExpr
    | WasmExpressions.i64_storeExpr
    | WasmExpressions.f32_storeExpr
    | WasmExpressions.f64_storeExpr
    | WasmExpressions.i32_store8Expr
    | WasmExpressions.i32_store16Expr
    | WasmExpressions.i64_store8Expr
    | WasmExpressions.i64_store16Expr
    | WasmExpressions.i64_store32Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface Memory_SizeExpression {
  nodeType: WasmExpressions.memory_sizeExpr;
}
export interface Memory_GrowExpression {
  nodeType: WasmExpressions.memory_growExpr;
  value: WasmExpression;
}
export interface WasmConstExpression {
  nodeType:
    | WasmExpressions.i32_constExpr
    | WasmExpressions.f32_constExpr
    | WasmExpressions.f64_constExpr;
  value: number;
}
export interface I64_ConstExpression {
  nodeType: WasmExpressions.i64_constExpr;
  value: BigInt;
}
export interface WasmBinopExpression {
  nodeType: WasmExpressions.i32_addExpr;
  valueLeft: WasmExpression;
  valueRight: WasmExpression;
}
// Wasm Expression Types
export type WasmExpression =
  | WasmEmptyExpression
  | WasmBlockExpression
  | IfExpression
  | BrExpression
  | Br_IfExpression
  | ReturnExpression
  | CallExpression
  | CallIndirectExpression
  | DropExpression
  | Local_GetExpression
  | Local_SetExpression
  | Local_TeeExpression
  | Global_GetExpression
  | Global_SetExpression
  | WasmLoadExpression
  | WasmStoreExpression
  | Memory_SizeExpression
  | Memory_GrowExpression
  | WasmConstExpression
  | I64_ConstExpression
  | WasmBinopExpression;

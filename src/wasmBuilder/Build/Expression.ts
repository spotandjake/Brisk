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
export const i32_LoadExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x28, // Wasm i32.load Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_LoadExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x29, // Wasm i64.load Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const f32_LoadExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2a, // Wasm f32.load Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const f64_LoadExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2b, // Wasm f64.load Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Load8_sExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2c, // Wasm i32.load8_s Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Load8_uExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2d, // Wasm i32.load8_u Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Load16_sExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2e, // Wasm i32.load16_s Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Load16_uExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x2f, // Wasm i32.load16_u Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
// TODO: i64_load8_sExpr,
// TODO: i64_load8_uExpr,
// TODO: i64_load16_sExpr,
// TODO: i64_load16_uExpr,
export const i64_Load8_sExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x30, // Wasm i64.load8_s Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Load8_uExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x31, // Wasm i64.load8_u Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Load16_sExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x32, // Wasm i64.load16_s Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Load16_uExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x33, // Wasm i64.load16_u Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Load32_sExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x34, // Wasm i64.load32_s Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Load32_uExpression = (position: UnresolvedBytes): UnresolvedBytes => [
  ...position, // ValueA Content
  0x35, // Wasm i64.load32_u Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_StoreExpression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x36, // Wasm i32.store Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_StoreExpression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x37, // Wasm i64.store Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const f32_StoreExpression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x38, // Wasm f32.store Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const f64_StoreExpression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x39, // Wasm f64.store Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Store8Expression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x3a, // Wasm i32.store8 Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i32_Store16Expression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x3b, // Wasm i32.store16 Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Store8Expression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x3c, // Wasm i64.store8 Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Store16Expression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x3d, // Wasm i64.store16 Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
export const i64_Store32Expression = (
  position: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...position, // ValueA Content
  ...valueB, // ValueB Content
  0x3e, // Wasm i64.store32 Instruction
  0, // Don't Align
  ...unsignedLEB128(0), // Don't Offset
];
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
export const i32_eqzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x45, // Wasm i32.eqz Instruction
];
export const i32_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x46, // Wasm i32.eq Instruction
];
export const i32_neExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x47, // Wasm i32.ne Instruction
];
export const i32_lt_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x48, // Wasm i32.lt_s Instruction
];
export const i32_lt_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x49, // Wasm i32.lt_u Instruction
];
export const i32_gt_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4a, // Wasm i32.gt_s Instruction
];
export const i32_gt_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4b, // Wasm i32.gt_u Instruction
];
export const i32_le_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4c, // Wasm i32.le_s Instruction
];
export const i32_le_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4d, // Wasm i32.le_u Instruction
];
export const i32_ge_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4e, // Wasm i32.ge_s Instruction
];
export const i32_ge_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x4f, // Wasm i32.ge_u Instruction
];
export const i64_eqzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x50, // Wasm i64.eqz Instruction
];
export const i64_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x51, // Wasm i64.eq Instruction
];
export const i64_neExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x52, // Wasm i64.ne Instruction
];
export const i64_lt_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x53, // Wasm i64.lt_s Instruction
];
export const i64_lt_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x54, // Wasm i64.lt_u Instruction
];
export const i64_gt_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x55, // Wasm i64.gt_s Instruction
];
export const i64_gt_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x56, // Wasm i64.gt_u Instruction
];
export const i64_le_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x57, // Wasm i64.le_s Instruction
];
export const i64_le_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x58, // Wasm i64.le_u Instruction
];
export const i64_ge_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x59, // Wasm i64.ge_s Instruction
];
export const i64_ge_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5a, // Wasm i64.ge_u Instruction
];
export const f32_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5b, // Wasm f32.eq Instruction
];
export const f32_neExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5c, // Wasm f32.ne Instruction
];
export const f32_ltExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5d, // Wasm f32.lt Instruction
];
export const f32_gtExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5e, // Wasm f32.gt Instruction
];
export const f32_leExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x5f, // Wasm f32.le Instruction
];
export const f32_geExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x60, // Wasm f32.ge Instruction
];
export const f64_eqExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x61, // Wasm f64.eq Instruction
];
export const f64_neExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x62, // Wasm f64.ne Instruction
];
export const f64_ltExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x63, // Wasm f64.lt Instruction
];
export const f64_gtExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x64, // Wasm f64.gt Instruction
];
export const f64_leExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x65, // Wasm f64.le Instruction
];
export const f64_geExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x66, // Wasm f64.ge Instruction
];
export const i32_clzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x67, // Wasm i32.clz Instruction
];
export const i32_ctzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x68, // Wasm i32.ctz Instruction
];
export const i32_popcntExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x69, // Wasm i32.popcnt Instruction
];
export const i32_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6a, // Wasm i32.Add Instruction
];
export const i32_SubExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6b, // Wasm i32.Sub Instruction
];
export const i32_MulExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6c, // Wasm i32.Mul Instruction
];
export const i32_Div_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6d, // Wasm i32.div_s Instruction
];
export const i32_Div_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6e, // Wasm i32.div_u Instruction
];
export const i32_Rem_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6f, // Wasm i32.rem_s Instruction
];
export const i32_Rem_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x70, // Wasm i32.rem_u Instruction
];
export const i32_AndExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x6a, // Wasm i32.and Instruction
];
export const i32_orExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x72, // Wasm i32.or Instruction
];
export const i32_xorExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x73, // Wasm i32.or Instruction
];
export const i32_shlExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x74, // Wasm i32.shl Instruction
];
export const i32_shr_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x75, // Wasm i32.shr_s Instruction
];
export const i32_shr_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x76, // Wasm i32.shr_u Instruction
];
export const i32_rotlExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x77, // Wasm i32.rotl Instruction
];
export const i32_rotrExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x78, // Wasm i32.rotr Instruction
];
export const i64_clzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x79, // Wasm i64.clz Instruction
];
export const i64_ctzExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x7a, // Wasm i64.ctz Instruction
];
export const i64_popcntExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x7b, // Wasm i64.popcnt Instruction
];
export const i64_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x7c, // Wasm i64.Add Instruction
];
export const i64_SubExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x7d, // Wasm i32.Add Instruction
];
export const i64_MulExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x7e, // Wasm i64.Mul Instruction
];
export const i64_Div_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x7f, // Wasm i64.div_s Instruction
];
export const i64_Div_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x80, // Wasm i64.div_u Instruction
];
export const i64_Rem_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x81, // Wasm i64.rem_s Instruction
];
export const i64_Rem_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x82, // Wasm i64.rem_u Instruction
];
export const i64_AndExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x83, // Wasm i64.and Instruction
];
export const i64_orExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x84, // Wasm i64.or Instruction
];
export const i64_xorExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x85, // Wasm i64.or Instruction
];
export const i64_shlExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x86, // Wasm i64.shl Instruction
];
export const i64_shr_sExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x87, // Wasm i64.shr_s Instruction
];
export const i64_shr_uExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x88, // Wasm i64.shr_u Instruction
];
export const i64_rotlExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x89, // Wasm i64.rotl Instruction
];
export const i64_rotrExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x8a, // Wasm i64.rotr Instruction
];
export const f32_absExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x8b, // Wasm f32.abs Instruction
];
export const f32_negExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x8c, // Wasm f32.neg Instruction
];
export const f32_ceilExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x8d, // Wasm f32.ceil Instruction
];
export const f32_floorExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x8e, // Wasm f32.floor Instruction
];
export const f32_truncExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x8f, // Wasm f32.trunc Instruction
];
export const f32_nearestExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x90, // Wasm f32.nearest Instruction
];
export const f32_sqrtExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x91, // Wasm f32.sqrt Instruction
];
export const f32_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x92, // Wasm i32.Add Instruction
];
export const f32_SubExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x93, // Wasm i32.Add Instruction
];
export const f32_MulExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x94, // Wasm i32.mul Instruction
];
export const f32_DivExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x95, // Wasm i32.div Instruction
];
export const f32_MinExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x96, // Wasm i32.min Instruction
];
export const f32_MaxExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x97, // Wasm i32.max Instruction
];
export const f32_copysignExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0x98, // Wasm i32.copysign Instruction
];
export const f64_absExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x99, // Wasm f64.abs Instruction
];
export const f64_negExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9a, // Wasm f64.neg Instruction
];
export const f64_ceilExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9b, // Wasm f64.ceil Instruction
];
export const f64_floorExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9c, // Wasm f64.floor Instruction
];
export const f64_truncExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9d, // Wasm f64.trunc Instruction
];
export const f64_nearestExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9e, // Wasm f64.nearest Instruction
];
export const f64_sqrtExpression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0x9f, // Wasm f64.sqrt Instruction
];
export const f64_AddExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa0, // Wasm f64.Add Instruction
];
export const f64_SubExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa1, // Wasm f64.sub Instruction
];
export const f64_MulExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa2, // Wasm f64.mul Instruction
];
export const f64_DivExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa3, // Wasm f64.div Instruction
];
export const f64_MinExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa4, // Wasm f64.min Instruction
];
export const f64_MaxExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa5, // Wasm f64.max Instruction
];
export const f64_CopySignExpression = (
  valueA: UnresolvedBytes,
  valueB: UnresolvedBytes
): UnresolvedBytes => [
  ...valueA, // ValueA Content
  ...valueB, // ValueB Content
  0xa6, // Wasm f64.copysign Instruction
];
export const i32_wrap_i64Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xa7, // Wasm i32.wrap_i64 Instruction
];
export const i32_trunc_f32_s_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xa8, // Wasm i32.trunc_f32_s Instruction
];
export const i32_trunc_f32_u_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xa9, // Wasm i32.trunc_f32_u Instruction
];
export const i32_trunc_f64_s_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xaa, // Wasm i32.trunc_f64_s Instruction
];
export const i32_trunc_f64_u_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xab, // Wasm i32.trunc_f64_u Instruction
];
export const i64_extend_i32_s_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xac, // Wasm i64.extend.i32.s Instruction
];
export const i64_extend_i32_u_Expression = (value: UnresolvedBytes): UnresolvedBytes => [
  ...value, // Value Content
  0xad, // Wasm i64.extend.i32.u Instruction
];
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

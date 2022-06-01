// Wasm Format Types
/*
 * Brisk Module Signature
 */
export const enum BriskTypeID {
  PrimitiveType = 0x00,
  UnionType = 0x01,
  FunctionType = 0x02,
  ArrayType = 0x03,
  InterfaceType = 0x04,
  EnumType = 0x05,
}
export const enum BriskPrimitiveTypeID {
  U32 = 0x00,
  U64 = 0x01,
  I32 = 0x02,
  I64 = 0x03,
  F32 = 0x04,
  F64 = 0x05,
  Boolean = 0x06,
  Void = 0x07,
  String = 0x08,
  Number = 0x09,
  Function = 0x0a,
  // TODO: Remove This
  Unknown = 0x0b,
  Any = 0x0c,
}

# Brisk Module Signature Section
This document covers the binary layout of The `Brisk module signature` Used In Linking.
# Helpers
## Vector
Vector takes A `Buffer` and returns both the length and data.
```ts
[ dataLength, data ]
```
## encodeString
`encodeString` takes a `String` and returns a `Vector` containing the length and encoded string.
```ts
[ strLength, encodedStrData ]
```
# Binary Format
The `Brisk module signature` exists in a `Wasm` custom section.
## Layout
```ts
type WasmCustomSection = [
  WasmSection.Custom,
  sectionLength,
  encodeString('BriskModuleSignature'),
  TypeSection,
  ExportSection,
]
```
## Type Section
The `Type Section` stores all the types relating to the exports.
```ts
type TypeSection = [
  TypeSectionID,
  TypeSectionCount,
  BriskType[],
]
```
## Brisk Types
The Brisk types can be one of the types listed below each type contains different information and as such is encoded differently.
```ts
type BriskType = 
  | PrimitiveType
  | UnionType
  | FunctionType
  | ArrayType
  | InterfaceType
  | EnumType;
```
The IDS for each type element can be found here.
```ts
enum BriskTypeID {
  PrimitiveType = 0x00,
  UnionType = 0x01,
  FunctionType = 0x02,
  ArrayType = 0x03,
  InterfaceType = 0x04,
  EnumType = 0x05,
}
```
### Primitive Type
The layout for a primitive type is shown below. 
```ts
enum BriskPrimitiveTypeID {
  u32 = 0,
  u64 = 1,
  i32 = 2,
  i64 = 3,
  f32 = 4,
  f64 = 5,
  Boolean = 6,
  Void = 7,
  String = 8,
  Number = 9,
  Unknown = 10, // This may be removed
  Any = 11, // This may be removed
}
type PrimitiveType = [
  BriskTypeID.PrimitiveType,
  BriskPrimitiveTypeID
]
```
### Union Types
```ts
type UnionType = [
  BriskTypeID.UnionType,
  typeCount,
  BriskType[],
]
```
### Function Types
```ts
type FunctionType = [
  BriskTypeID.FunctionType,
  // Parameters
  ParameterCount,
  BriskType[],
  // Return type
  BriskType
]
```
### Array Types
```ts
type ArrayType = [
  BriskTypeID.ArrayType,
  // Array type
  BriskType,
  // length
  0x01 | 0x00, // 0x01 means it has a static length, 0x00 means it does not
  ArrayLength?, // The length of the array if it is static otherwise nothing goes here
]
```
### Interface Types
```ts
type InterfaceField = [
  encodeString(fieldName),
  0x00 | 0x01, // 0x01 meaning it is mutable, 0x00 indicating it is immutable
  BriskType,
]
type InterfaceType = [
  BriskTypeID.InterfaceType,
  // Field count
  FieldCount,
  InterfaceField[]
]
```
### Enum Types
TODO: Enum types need to be implemented into the spec
# Export Section
The export section contains all the export data.
```ts
type TypeSection = [
  ExportSectionID,
  ExportSectionCount,
  BriskExport[]
]
```
```ts
type BriskExport = ValueExport | TypeExport;
```
## BriskExport
There are two types of exports in Brisk a `Type export` or a `Value export`.
```ts
enum BriskExportID {
  Value = 0x00,
  Type = 0x01,
}
```
## Value Export
```ts
type ValueExport = [
  BriskExportID.Value,
  encodeString(ExportName),
  BriskExportTypeReference,
  encodeString(WasmExportName)
]
```
## Type Export
```ts
type ValueExport = [
  BriskExportID.Type,
  encodeString(ExportName),
  BriskExportTypeReference
]
```

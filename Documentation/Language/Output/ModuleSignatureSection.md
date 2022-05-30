# Brisk Module Signature Section
This document covers the binary layout of The Brisk Module Signature Used In Linking
# Function
# Vector
Vector Takes A Buffer and returns the length and data in the format shown below.
```ts
[ DataLength, Data ]
```
## encodeString
Encode String takes a string and returns a Vector as shown below
```ts
[ StringLength, EncodedStringData ]
```
# Binary Format
The ModuleFunction Signature Exists In A Wasm Custom Function
## Layout
The Layout of this section is shown below.
```ts
type WasmCustomSection = [
  WasmSection.Custom,
  encodeString('BriskModuleSignature'),
  TypeSection,
  ExportSection,
]
```
## Type Section
The Type Section Stores All The Types Relating To The Exports. The Layout Is Shown Below.
```ts
type TypeSection = [
  TypeSectionID,
  TypeSectionCount,
  // A Map Of Type References To Type Locations
  TypeMapElement[],
  // The Actual Types
  Vector(BriskType[]),
]
```
The Layout Of The Type Map Is Given Below.
```ts
type TypeMapElement = [
  Index, // The Index Of The Type
]
```
## Brisk Types
The Brisk Types Can Be One Of The Types Listed Below Each Type Contains Different Information And As Such Is Encoded Differently.
```ts
type BriskType = 
  | PrimitiveType
  | UnionType
  | FunctionType
  | ArrayType
  | InterfaceType
  | EnumType;
```
The Id's For Each Type Element Can Be Found Here.
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
The Primitive Type Is The Most Basic Type In Brisk.
The Id's Of Each Primitive Type Are Shown Below
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
  Unknown = 10, // This May Be Removed
  Any = 11, // This May Be Removed
}
```
The Layout For A Primitive Type Section Is Shown Below. 
```ts
type PrimitiveType = [
  BriskTypeID.PrimitiveType,
  BriskPrimitiveTypeID
]
```
### Union Types
Union Types Represent An Or Type In Brisk. The Layout Is Shown Below.
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
  // Return Type
  BriskType
]
```
### Array Types
```ts
type ArrayType = [
  BriskTypeID.ArrayType,
  // Array Type
  BriskType,
  // Length
  0x01 | 0x00, // 0x01 means it has a static length, 0x00 means it doesn't
  ArrayLength?, // The Length of the array if it is static otherwise nothing goes here
]
```
### Interface Types
```ts
type InterfaceField = [
  encodeString(fieldName),
  BriskType,
]
type InterfaceType = [
  BriskTypeID.InterfaceType,
  // Field Count
  FieldCount,
  InterfaceField[]
]
```
### Enum Types
TODO: Enum types need to be implemented into the spec



# Export Section
The export section contains all the export data. The Layout Is Below.
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
There are two types sof exports in brisk a type export or a Value export. The IDS are shown below.
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
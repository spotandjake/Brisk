import {
  ArrayBaseTypeLiteralNode,
  BaseTypes,
  EnumDefinitionStatementNode,
  FunctionBaseSignatureLiteralNode,
  InterfaceBaseLiteralNode,
  NodeType,
  PrimTypes,
  TypeBaseUnionLiteralNode,
  TypePrimLiteralNode,
} from '../Types/ParseNodes';
import { encodeString, unsignedLEB128 } from '../../wasmBuilder/Build/Utils';
import { ResolvedBytes } from '../../wasmBuilder/Types/Nodes';
import { BriskError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Builder For The Brisk Module Signature Section
// Types
const enum BriskTypeID {
  PrimitiveType = 0x00,
  UnionType = 0x01,
  FunctionType = 0x02,
  ArrayType = 0x03,
  InterfaceType = 0x04,
  EnumType = 0x05,
}
// Helpers
const briskPrimTypeMap = (name: PrimTypes): ResolvedBytes => {
  switch (name) {
    case 'u32':
      return unsignedLEB128(0x00);
    case 'u64':
      return unsignedLEB128(0x01);
    case 'i32':
      return unsignedLEB128(0x02);
    case 'i64':
      return unsignedLEB128(0x03);
    case 'f32':
      return unsignedLEB128(0x04);
    case 'f64':
      return unsignedLEB128(0x05);
    case 'Boolean':
      return unsignedLEB128(0x06);
    case 'Void':
      return unsignedLEB128(0x07);
    case 'String':
      return unsignedLEB128(0x08);
    case 'Number':
      return unsignedLEB128(0x09);
    case 'Function':
      return unsignedLEB128(0x0a);
    // TODO: Remove Unknown And Any
    case 'Unknown':
      return unsignedLEB128(0x0b);
    case 'Any':
      return unsignedLEB128(0x0c);
  }
};
// Encode Primitives
export const encodeType = (rawProgram: string, briskType: BaseTypes): ResolvedBytes => {
  switch (briskType.nodeType) {
    case NodeType.TypePrimLiteral:
      return encodePrimitiveType(briskType);
    case NodeType.TypeUnionLiteral:
      return encodeUnionType(rawProgram, briskType);
    case NodeType.FunctionSignatureLiteral:
      return encodeFunctionType(rawProgram, briskType);
    case NodeType.ArrayTypeLiteral:
      return encodeArrayType(rawProgram, briskType);
    case NodeType.InterfaceLiteral:
      return encodeInterfaceType(rawProgram, briskType);
    case NodeType.EnumDefinitionStatement:
      return encodeEnumType(rawProgram, briskType);
    case NodeType.GenericType:
      // TODO: Support Exporting Types Containing Generics
      return BriskError(
        rawProgram,
        BriskErrorType.FeatureNotYetImplemented,
        [],
        briskType.position
      );
  }
};
export const encodePrimitiveType = (primType: TypePrimLiteralNode): ResolvedBytes => {
  return [BriskTypeID.PrimitiveType, ...briskPrimTypeMap(primType.name)];
};
export const encodeUnionType = (
  rawProgram: string,
  unionType: TypeBaseUnionLiteralNode
): ResolvedBytes => {
  // TODO: Consider using References here instead of including the types
  return [
    BriskTypeID.UnionType,
    ...unionType.types
      .map((briskType): ResolvedBytes => {
        return encodeType(rawProgram, briskType);
      })
      .flat(),
  ];
};
export const encodeFunctionType = (
  rawProgram: string,
  funcType: FunctionBaseSignatureLiteralNode
): ResolvedBytes => {
  // TODO: Handle Generics
  // TODO: Consider using References here instead of including the types
  return [
    BriskTypeID.FunctionType,
    ...unsignedLEB128(funcType.params.length),
    ...funcType.params
      .map((param) => {
        return encodeType(rawProgram, param);
      })
      .flat(),
    ...encodeType(rawProgram, funcType.returnType),
  ];
};
export const encodeArrayType = (
  rawProgram: string,
  arrType: ArrayBaseTypeLiteralNode
): ResolvedBytes => {
  // TODO: Consider using References here instead of including the types
  return [
    BriskTypeID.ArrayType,
    ...encodeType(rawProgram, arrType.value),
    ...(arrType.length != undefined ? [0x01, ...unsignedLEB128(arrType.length.value)] : [0x00]),
  ];
};
export const encodeInterfaceType = (
  rawProgram: string,
  interfaceType: InterfaceBaseLiteralNode
): ResolvedBytes => {
  // TODO: Consider using References here instead of including the types
  // TODO: Handle Generics
  return [
    BriskTypeID.InterfaceType,
    ...unsignedLEB128(interfaceType.fields.length),
    ...interfaceType.fields
      .map((field): ResolvedBytes => {
        return [
          ...encodeString(field.name),
          field.mutable ? 0x01 : 0x00,
          ...encodeType(rawProgram, field.fieldType),
        ];
      })
      .flat(),
  ];
};
export const encodeEnumType = (
  rawProgram: string,
  enumType: EnumDefinitionStatementNode
): ResolvedBytes => {
  // TODO: Consider using References here instead of including the types
  // TODO: Handle Generics
  // TODO: Implement Encoding Enum Type
  BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], enumType.position);
  return [BriskTypeID.EnumType];
};
// TODO: Decode Primitives

import { BaseTypes, NodeType, primTypes } from '../Types/ParseNodes';
import { BriskTypeID } from '../../Types/WasmFormat';
import { encodeString, unsignedLEB128 } from '../../wasmBuilder/Build/Utils';
import { ResolvedBytes } from '../../wasmBuilder/Types/Nodes';
import { brisk_moduleIdentifier } from '../Codegen/Helpers';
import { BriskError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Builder For The Brisk Module Signature Section
import { ExportMap, ImportMap } from '../Types/AnalyzerNodes';
// Helpers
export const compileType = (
  rawProgram: string,
  typeList: ResolvedBytes[],
  briskType: BaseTypes
): number => {
  const _compileType = (briskType: BaseTypes): ResolvedBytes => {
    switch (briskType.nodeType) {
      case NodeType.TypePrimLiteral:
        return [
          BriskTypeID.PrimitiveType,
          ...unsignedLEB128([...primTypes].indexOf(briskType.name)),
        ];
      case NodeType.TypeUnionLiteral:
        return [
          BriskTypeID.UnionType,
          ...briskType.types.map((t) => compileType(rawProgram, typeList, t)),
        ];
      case NodeType.FunctionSignatureLiteral:
        // TODO: Handle Generics
        return [
          BriskTypeID.FunctionType,
          ...unsignedLEB128(briskType.params.length),
          ...briskType.params.map((param) => compileType(rawProgram, typeList, param)),
          compileType(rawProgram, typeList, briskType.returnType),
        ];
      case NodeType.ArrayTypeLiteral:
        return [
          BriskTypeID.ArrayType,
          compileType(rawProgram, typeList, briskType.value),
          ...(briskType.length != undefined
            ? [0x01, ...unsignedLEB128(briskType.length.value)]
            : [0x00]),
        ];
      case NodeType.InterfaceLiteral:
        // TODO: Handle Generics
        return [
          BriskTypeID.InterfaceType,
          ...unsignedLEB128(briskType.fields.length),
          ...briskType.fields
            .map((field): ResolvedBytes => {
              return [
                ...encodeString(field.name),
                field.mutable ? 0x01 : 0x00,
                compileType(rawProgram, typeList, field.fieldType),
              ];
            })
            .flat(),
        ];
      case NodeType.EnumDefinitionStatement:
      case NodeType.GenericType:
        // TODO: Support Generics And Enums
        return BriskError(
          rawProgram,
          BriskErrorType.FeatureNotYetImplemented,
          [],
          briskType.position
        );
    }
  };
  // Compile The Type
  const compiledType = _compileType(briskType);
  const matchingTypeIndex = typeList.findIndex((_type) => {
    return _type.length == compiledType.length && _type.every((b, i) => b == compiledType[i]);
  });
  // Add Type To Type List
  const typeIndex = matchingTypeIndex == -1 ? typeList.push(compiledType) - 1 : matchingTypeIndex;
  // Return A Reference
  return typeIndex;
};
// Create Wasm Module Type Signature
export const compileModuleSignature = (
  rawProgram: string,
  exports: ExportMap,
  imports: ImportMap
): ResolvedBytes => {
  // Create The Array
  const typeList: ResolvedBytes[] = [];
  const exportList: ResolvedBytes[] = [];
  const importList: ResolvedBytes[] = [];
  // Deal with Each Export
  for (const [exportName, exportData] of exports) {
    // TODO: Ensure That The Export Type Will Never Be Undefined
    if (exportData.baseType == undefined) {
      return BriskError(rawProgram, BriskErrorType.CompilerError, [], exportData.type.position);
    }
    // Compile Type
    // TODO: Look Into Sending The Position Of Each Type
    const typeIndex = compileType(rawProgram, typeList, exportData.baseType);
    // Add Export To Export Map
    // TODO: Support Exporting Types
    exportList.push([
      0x00, // 0x00 is A Value Export, 0x01 is A Type Export
      ...encodeString(exportName), // Actual Export Name
      ...unsignedLEB128(typeIndex), // Type Index
      ...encodeString(`${brisk_moduleIdentifier}${exportName}`), // Reference To The Export
    ]);
  }
  // Deal With Imports
  for (const [importName, importData] of imports) {
    // Add Export To Export Map
    importList.push([
      ...encodeString(importName), // Import Item
      ...encodeString(importData.path), // Import Path
      ...encodeString(`${brisk_moduleIdentifier}${importData.path}`), // Wasm Import Name
    ]);
  }
  // Return The Section
  return [
    ...encodeString('BriskModuleSignature'),
    ...unsignedLEB128(typeList.length),
    ...typeList.flat(),
    ...unsignedLEB128(exportList.length),
    ...exportList.flat(),
    ...unsignedLEB128(importList.length),
    ...importList.flat(),
  ];
};

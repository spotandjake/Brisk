// Imports
import { NodeType, TypeLiteral, stackTypes } from '../Types/ParseNodes';
import { ResolvedBytes, WasmTypes } from '../../wasmBuilder/Types/Nodes';
import { AnalyzerProperties } from '../Types/AnalyzerNodes';
import { typeEqual } from '../TypeChecker/Helpers';
import { createPrimType } from '../Helpers/typeBuilders';
import { getType } from '../Helpers/Helpers';
import * as Types from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// Values
export const brisk_moduleIdentifier = '$Brisk$';
export const brisk_moduleFunctionOffset = `${brisk_moduleIdentifier}Constant:moduleFunctionOffset`;
export const brisk_Void_Value = 0x03;
// Helpers
export const encodeBriskType = (
  rawProgram: string,
  properties: Omit<AnalyzerProperties, 'operatorScope'>,
  expr: TypeLiteral,
  returnFunctionSignature = false
): ResolvedBytes => {
  switch (expr.nodeType) {
    // TODO: EnumDefinitionStatement
    case NodeType.TypePrimLiteral:
      if (expr.name == 'u32' || expr.name == 'i32')
        return Types.createNumericType(WasmTypes.WasmI32);
      else if (expr.name == 'u64' || expr.name == 'i64')
        return Types.createNumericType(WasmTypes.WasmI64);
      else if (expr.name == 'f32') return Types.createNumericType(WasmTypes.WasmF32);
      else if (expr.name == 'f64') return Types.createNumericType(WasmTypes.WasmF64);
      else if (expr.name == 'Boolean' || expr.name == 'Void')
        return Types.createNumericType(WasmTypes.WasmI32);
      else if (expr.name == 'String' || expr.name == 'Number' || expr.name == 'Function')
        return Types.createNumericType(WasmTypes.WasmI32);
      else return BriskError(rawProgram, BriskErrorType.CompilerError, [], expr.position);
    case NodeType.TypeUnionLiteral:
      // TODO: Support Unionized Stack Types
      if (
        [...stackTypes.values()].some((_type) =>
          typeEqual(
            rawProgram,
            properties._types,
            properties._typeStack,
            properties._typeStacks,
            expr,
            createPrimType(expr.position, _type),
            false
          )
        )
      )
        BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], expr.position);
      // All Heap Types Are i32 Pointers
      return Types.createNumericType(WasmTypes.WasmI32);
    // TODO: ArrayTypeLiteral
    case NodeType.ParenthesisTypeLiteral:
      return encodeBriskType(rawProgram, properties, expr.value, returnFunctionSignature);
    case NodeType.FunctionSignatureLiteral:
      if (returnFunctionSignature) {
        return Types.createFunctionType(
          expr.params.map((p) => encodeBriskType(rawProgram, properties, p, false)),
          [encodeBriskType(rawProgram, properties, expr.returnType, false)]
        );
      } else return Types.createNumericType(WasmTypes.WasmI32);
    // TODO: InterfaceLiteral
    case NodeType.TypeUsage: {
      // Encode Var Type
      return encodeBriskType(
        rawProgram,
        properties,
        getType(properties._types, expr).type,
        returnFunctionSignature
      );
    }
    // TODO: GenericType
    default:
      return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], expr.position);
  }
};
export const initializeBriskType = (
  rawProgram: string,
  properties: Omit<AnalyzerProperties, 'operatorScope'>,
  expr: TypeLiteral,
  returnFunctionSignature = false
): ResolvedBytes => {
  switch (expr.nodeType) {
    // TODO: EnumDefinitionStatement
    case NodeType.TypePrimLiteral:
      if (expr.name == 'u32' || expr.name == 'i32') return Expressions.i32_ConstExpression(0);
      else if (expr.name == 'u64' || expr.name == 'i64') return Expressions.i64_ConstExpression(0);
      else if (expr.name == 'f32') return Expressions.f32_ConstExpression(0);
      else if (expr.name == 'f64') return Expressions.f64_ConstExpression(0);
      else if (expr.name == 'Boolean') return Expressions.i32_ConstExpression(0);
      else if (expr.name == 'Void') return Expressions.i32_ConstExpression(brisk_Void_Value);
      else if (expr.name == 'String' || expr.name == 'Number' || expr.name == 'Function')
        return Expressions.i32_ConstExpression(0);
      else return BriskError(rawProgram, BriskErrorType.CompilerError, [], expr.position);
    // TODO: TypeUnionLiteral
    // TODO: ArrayTypeLiteral
    case NodeType.ParenthesisTypeLiteral:
      return initializeBriskType(rawProgram, properties, expr.value, returnFunctionSignature);
    case NodeType.FunctionSignatureLiteral:
      return Expressions.i32_ConstExpression(0);
    // TODO: InterfaceLiteral
    case NodeType.TypeUsage: {
      // Encode Var Type
      return initializeBriskType(
        rawProgram,
        properties,
        getType(properties._types, expr).type,
        returnFunctionSignature
      );
    }
    // TODO: GenericType
    default:
      return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], expr.position);
  }
};

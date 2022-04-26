// General Imports
import { Position } from '../Types/Types';
import {
  ArrayTypeLiteralNode,
  FunctionSignatureLiteralNode,
  NodeCategory,
  NodeType,
  NumberLiteralNode,
  ParenthesisTypeLiteralNode,
  PrimTypes,
  TypeLiteral,
  TypePrimLiteralNode,
  TypeUnionLiteralNode,
} from '../Types/ParseNodes';
import { TypeStack } from '../Types/AnalyzerNodes';
// Type Builders
export const createPrimType = (position: Position, primType: PrimTypes): TypePrimLiteralNode => {
  return {
    nodeType: NodeType.TypePrimLiteral,
    category: NodeCategory.Type,
    name: primType,
    position: position,
  };
};
export const createArrayType = (
  position: Position,
  type: TypeLiteral,
  length?: number
): ArrayTypeLiteralNode => {
  return {
    nodeType: NodeType.ArrayTypeLiteral,
    category: NodeCategory.Type,
    length: length ? createNumberTypeLiteral(position, length) : undefined,
    value: type,
    position: position,
  };
};
export const createFunctionSignatureType = (
  position: Position,
  genericTypes: GenericTypeNode[],
  paramTypes: TypeLiteral[],
  returnType: TypeLiteral,
  _typeStack: TypeStack
): FunctionSignatureLiteralNode => {
  return {
    nodeType: NodeType.FunctionSignatureLiteral,
    category: NodeCategory.Type,
    params: paramTypes,
    returnType: returnType,
    genericTypes: genericTypes,
    data: {
      _typeStack: _typeStack,
    },
    position: position,
  };
};
export const createParenthesisType = (
  position: Position,
  type: TypeLiteral
): ParenthesisTypeLiteralNode => {
  return {
    nodeType: NodeType.ParenthesisTypeLiteral,
    category: NodeCategory.Type,
    value: type,
    position: position,
  };
};
export const createUnionType = (
  position: Position,
  ...types: TypeLiteral[]
): TypeUnionLiteralNode => {
  return {
    nodeType: NodeType.TypeUnionLiteral,
    category: NodeCategory.Type,
    types: types,
    position: position,
  };
};
// Create Type Literals
export const createNumberTypeLiteral = (position: Position, value: number): NumberLiteralNode => {
  return {
    nodeType: NodeType.NumberLiteral,
    category: NodeCategory.Literal,
    value: `${value}`,
    position: position,
  };
};

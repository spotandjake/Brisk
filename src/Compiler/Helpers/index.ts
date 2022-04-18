// General Imports
import { Position } from '../Types/Types';
import {
  NodeType,
  NodeCategory,
  PrimTypes,
  TypePrimLiteralNode,
  TypeLiteral,
  TypeUnionLiteralNode,
  ParenthesisTypeLiteralNode,
  ArrayTypeLiteralNode,
  NumberLiteralNode,
  FunctionSignatureLiteralNode,
} from '../Types/ParseNodes';
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
  paramTypes: TypeLiteral[],
  returnType: TypeLiteral
): FunctionSignatureLiteralNode => {
  return {
    nodeType: NodeType.FunctionSignatureLiteral,
    category: NodeCategory.Type,
    params: paramTypes,
    returnType: returnType,
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

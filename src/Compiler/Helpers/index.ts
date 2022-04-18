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

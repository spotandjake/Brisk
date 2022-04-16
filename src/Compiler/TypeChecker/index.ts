import { Position } from '../Types/Types';
import {
  NodeType,
  NodeCategory,
  PrimTypes,
  primTypes,
  TypePrimLiteralNode,
  TypeLiteral,
} from '../Types/ParseNodes';
import { BriskError, BriskTypeError } from '../Errors/Compiler';
import AnalyzerNode, {
  AnalyzeNode,
  AnalyzedProgramNode,
  AnalyzedStatement,
  AnalyzedExpression,
} from '../Types/AnalyzerNodes';
import { BriskErrorType } from '../Errors/Errors';
// Type Helpers
const createPrimType = (primType: PrimTypes, position: Position): TypePrimLiteralNode => {
  return {
    nodeType: NodeType.TypePrimLiteral,
    category: NodeCategory.Type,
    name: primType,
    position: position,
  };
};
// Checking Helpers
// const resolveType = (code: string, typeA: TypeLiteral, typeB: TypeLiteral): TypeLiteral => {};
const typeCompatible = (code: string, typeA: TypeLiteral, typeB: TypeLiteral): boolean => {
  // TODO: Ensure Types Are Compatible
  return true;
};
const typeEqual = (code: string, typeA: TypeLiteral, typeB: TypeLiteral): boolean => {
  // TODO: Check Type Equality
  return true;
};
// TODO: Fix Analyzed Types, Remove Type Casts
const getExpressionType = (code: string, expression: AnalyzedExpression): TypeLiteral => {
  switch (expression.nodeType) {
    case NodeType.ComparisonExpression:
      return createPrimType('Boolean', expression.position);
    case NodeType.ArithmeticExpression:
      break;
    case NodeType.UnaryExpression:
      break;
    case NodeType.ParenthesisExpression:
      return getExpressionType(code, <AnalyzedExpression>expression.value);
    case NodeType.TypeCastExpression:
      console.log(expression);
      break;
    case NodeType.CallExpression:
      break;
    case NodeType.WasmCallExpression:
      break;
    case NodeType.StringLiteral:
      return createPrimType('String', expression.position);
    case NodeType.I32Literal:
      return createPrimType('i32', expression.position);
    case NodeType.I64Literal:
      return createPrimType('i64', expression.position);
    case NodeType.U32Literal:
      return createPrimType('u32', expression.position);
    case NodeType.U64Literal:
      return createPrimType('u64', expression.position);
    case NodeType.F32Literal:
      return createPrimType('f32', expression.position);
    case NodeType.F64Literal:
      return createPrimType('f64', expression.position);
    case NodeType.NumberLiteral:
      return createPrimType('Number', expression.position);
    case NodeType.ConstantLiteral:
      if (expression.value == 'void') return createPrimType('Void', expression.position);
      else if (expression.value == 'true' || expression.value == 'false')
        return createPrimType('Boolean', expression.position);
    case NodeType.FunctionLiteral:
      break;
    case NodeType.ArrayLiteral:
      break;
    case NodeType.ObjectLiteral:
      break;
    case NodeType.VariableUsage:
      break;
    case NodeType.MemberAccess:
      break;
  }
};
// TypeCheck Node
const typeCheckNode = (
  // Code
  code: string,
  // Stacks
  properties: AnalyzeNode,
  // Nodes
  parentNode: AnalyzerNode | undefined,
  node: AnalyzerNode
): AnalyzerNode => {
  const {
    // Our Global Variable And Type Pools
    _imports,
    _exports,
    _variables,
    _types,
    // ParentStacks
    _varStacks,
    _typeStacks,
    // Stacks
    _closure,
    _varStack,
    _typeStack,
  } = properties;
  const _typeCheckNode = (
    childNode: AnalyzerNode,
    props: Partial<AnalyzeNode> = properties,
    parentNode: AnalyzerNode = node
  ): AnalyzerNode => {
    return typeCheckNode(code, { ...properties, ...props }, parentNode, childNode);
  };
  // Match The Node For Analysis
  switch (node.nodeType) {
    // General
    case NodeType.Program:
      // Analyze Program Node
      node.body = node.body.map((childNode) => <AnalyzedStatement>_typeCheckNode(childNode));
      // Return The Node
      return node;
    // Statements
    case NodeType.IfStatement:
      // Analyze Condition
      node.condition = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.condition);
      // TypeCheck Condition
      typeEqual(
        code,
        getExpressionType(code, <AnalyzedExpression>node.condition),
        createPrimType('Boolean', node.condition.position)
      );
      // Analyze Body
      node.body = <AnalyzedStatement>_typeCheckNode(<AnalyzedStatement>node.body);
      // Analyze Alternative
      if (node.alternative)
        node.alternative = <AnalyzedStatement>_typeCheckNode(<AnalyzedStatement>node.alternative);
      return node;
    case NodeType.FlagStatement:
    case NodeType.BlockStatement:
    case NodeType.ImportStatement:
    case NodeType.WasmImportStatement:
    case NodeType.ExportStatement:
    case NodeType.DeclarationStatement:
    case NodeType.AssignmentStatement:
    case NodeType.PostFixStatement:
    case NodeType.ReturnStatement:
    case NodeType.EnumDefinitionStatement:
    case NodeType.EnumVariant:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.TypeCastExpression:
      // Check if type is compatible
      typeCompatible(
        code,
        node.typeLiteral,
        getExpressionType(code, <AnalyzedExpression>node.value)
      );
      // Analyze Properties
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      node.typeLiteral = <TypeLiteral>_typeCheckNode(node.typeLiteral);
      // Return Node
      return node;
    case NodeType.UnaryExpression:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.ParenthesisExpression:
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      return node;
    case NodeType.CallExpression:
    case NodeType.WasmCallExpression:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Literals
    case NodeType.StringLiteral:
    case NodeType.I32Literal:
    case NodeType.I64Literal:
    case NodeType.U32Literal:
    case NodeType.U64Literal:
    case NodeType.F32Literal:
    case NodeType.F64Literal:
    case NodeType.NumberLiteral:
    case NodeType.ConstantLiteral:
      return node;
    case NodeType.FunctionLiteral:
    case NodeType.ArrayLiteral:
    case NodeType.ObjectLiteral:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Types
    case NodeType.InterfaceDefinition:
    case NodeType.TypeAliasDefinition:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.TypePrimLiteral:
      return node;
    case NodeType.TypeUnionLiteral:
    case NodeType.ArrayTypeLiteral:
    case NodeType.ParenthesisTypeLiteral:
    case NodeType.FunctionSignatureLiteral:
    case NodeType.InterfaceLiteral:
    case NodeType.TypeUsage:
    case NodeType.GenericType:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Variables
    case NodeType.VariableUsage:
    case NodeType.MemberAccess:
    case NodeType.PropertyUsage:
    case NodeType.Parameter:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
  }
};
// Analyze Program
const typeCheckProgram = (code: string, program: AnalyzedProgramNode): AnalyzedProgramNode => {
  return <AnalyzedProgramNode>typeCheckNode(
    code,
    {
      _imports: new Map(),
      _exports: new Map(),
      _variables: new Map(),
      _types: new Map(),
      _varStacks: [],
      _typeStacks: [],
      _closure: new Set(),
      _varStack: new Map(),
      _typeStack: new Map(),
    },
    undefined,
    program
  );
};

export default typeCheckProgram;

import { Position } from '../Types/Types';
import {
  NodeType,
  NodeCategory,
  PrimTypes,
  TypePrimLiteralNode,
  TypeLiteral,
  VariableUsageNode,
  VariableUsage,
  TypeUsageNode,
  PropertyUsageNode,
  InterfaceLiteralNode,
  GenericTypeNode,
} from '../Types/ParseNodes';
import { BriskError, BriskTypeError } from '../Errors/Compiler';
import AnalyzerNode, {
  AnalyzeNode,
  AnalyzedProgramNode,
  AnalyzedStatement,
  AnalyzedExpression,
  VariableMap,
  VariableStack,
  VariableData,
  TypeMap,
  TypeStack,
  TypeData,
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
const buildObjectType = (memberAccess: PropertyUsageNode): InterfaceLiteralNode | TypeLiteral => {
  if (memberAccess.property != undefined) {
    return {
      nodeType: NodeType.InterfaceLiteral,
      category: NodeCategory.Type,
      fields: [
        {
          nodeType: NodeType.InterfaceField,
          category: NodeCategory.Type,
          name: memberAccess.name,
          fieldType: buildObjectType(memberAccess.property),
          optional: false,
          mutable: false,
          position: memberAccess.position,
        },
      ],
      position: memberAccess.position,
    };
  } else {
    return createPrimType('Any', memberAccess.position);
  }
};
const getObjectPropertyType = (
  memberAccess: PropertyUsageNode,
  type: InterfaceLiteralNode
): TypeLiteral | undefined => {
  // Find Type
  const field = type.fields.find((f) => f.name == memberAccess.name);
  if (
    memberAccess.property != undefined &&
    field?.fieldType.nodeType == NodeType.InterfaceLiteral
  ) {
    return getObjectPropertyType(memberAccess.property, field.fieldType);
  } else {
    return field?.fieldType;
  }
};
const getTypeReference = (
  rawProgram: string,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeReference: TypeUsageNode | string,
  position: Position
): number => {
  // Get Variable Reference
  let typeName: string;
  if (typeof typeReference == 'string') typeName = typeReference;
  else typeName = typeReference.name;
  // Search The Stacks
  const _varStack = [...typeStacks, typeStack].reverse().find((s) => s.has(typeName));
  // Check If It Exists
  if (_varStack == undefined)
    BriskTypeError(rawProgram, BriskErrorType.VariableNotFound, [typeName], position);
  // Get Node
  return <number>(<VariableStack>_varStack).get(typeName);
};
const getTypeVar = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeReference: TypeUsageNode | string,
  position: Position
): TypeLiteral => {
  const _typeReference = getTypeReference(
    rawProgram,
    typeStack,
    typeStacks,
    typeReference,
    position
  );
  // Ensure Var Is In Pool
  if (!typePool.has(_typeReference))
    BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  // Return Value
  return (<TypeData>typePool.get(_typeReference)).type;
};
const setTypeVar = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeReference: TypeUsageNode | string,
  type: TypeLiteral,
  position: Position
): void => {
  const _typeReference = getTypeReference(
    rawProgram,
    typeStack,
    typeStacks,
    typeReference,
    position
  );
  // Ensure Var Is In Pool
  if (!typePool.has(_typeReference))
    BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  // Value
  const typeData = <TypeData>typePool.get(_typeReference);
  typePool.set(_typeReference, {
    ...typeData,
    type: type,
  });
};
const getVarReference = (
  rawProgram: string,
  varStack: VariableStack,
  varStacks: VariableStack[],
  varReference: VariableUsageNode | string,
  position: Position
): number => {
  // Get Variable Reference
  let varName: string;
  if (typeof varReference == 'string') varName = varReference;
  else varName = varReference.name;
  // Search The Stacks
  const _varStack = [...varStacks, varStack].reverse().find((s) => s.has(varName));
  // Check If It Exists
  if (_varStack == undefined)
    BriskTypeError(rawProgram, BriskErrorType.VariableNotFound, [varName], position);
  // Get Node
  return <number>(<VariableStack>_varStack).get(varName);
};
const getVarType = (
  rawProgram: string,
  varPool: VariableMap,
  varStack: VariableStack,
  varStacks: VariableStack[],
  varReference: VariableUsageNode | string,
  position: Position
): TypeLiteral => {
  const _variableReference = getVarReference(
    rawProgram,
    varStack,
    varStacks,
    varReference,
    position
  );
  // Ensure Var Is In Pool
  if (!varPool.has(_variableReference))
    BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  // Return Value
  return (<VariableData>varPool.get(_variableReference)).type;
};
const setVarType = (
  rawProgram: string,
  varPool: VariableMap,
  varStack: VariableStack,
  varStacks: VariableStack[],
  varReference: VariableUsageNode | string,
  type: TypeLiteral,
  position: Position
): void => {
  const _variableReference = getVarReference(
    rawProgram,
    varStack,
    varStacks,
    varReference,
    position
  );
  // Ensure Var Is In Pool
  if (!varPool.has(_variableReference))
    BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  // Value
  const varData = <VariableData>varPool.get(_variableReference);
  varPool.set(_variableReference, {
    ...varData,
    type: type,
  });
};
// Checking Helpers
// const resolveType = (rawProgram: string, typeA: TypeLiteral, typeB: TypeLiteral): TypeLiteral => {};
const typeCompatible = (rawProgram: string, typeA: TypeLiteral, typeB: TypeLiteral): boolean => {
  // TODO: Ensure Types Are Compatible
  return true;
};
const typeEqual = (rawProgram: string, typeA: TypeLiteral, typeB: TypeLiteral): boolean => {
  // TODO: Check Type Equality
  return true;
};
// TODO: Fix Analyzed Types, Remove Type Casts
// TODO: Implement Type Narrowing
// TODO: Implement Values As Types
// TODO: Support Wasm Interface Types
const getExpressionType = (
  rawProgram: string,
  varPool: VariableMap,
  varStack: VariableStack,
  varStacks: VariableStack[],
  expression: AnalyzedExpression
): TypeLiteral => {
  switch (expression.nodeType) {
    case NodeType.ComparisonExpression:
      return createPrimType('Boolean', expression.position);
    case NodeType.ArithmeticExpression:
      break;
    case NodeType.UnaryExpression:
      break;
    case NodeType.ParenthesisExpression:
      return getExpressionType(
        rawProgram,
        varPool,
        varStack,
        varStacks,
        <AnalyzedExpression>expression.value
      );
    case NodeType.TypeCastExpression:
      return expression.typeLiteral;
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
      return getVarType(
        rawProgram,
        varPool,
        varStack,
        varStacks,
        expression.name,
        expression.position
      );
    case NodeType.MemberAccess: {
      // Get Member Type
      const objectType = getExpressionType(
        rawProgram,
        varPool,
        varStack,
        varStacks,
        <AnalyzedExpression>expression.parent
      );
      // Build Type
      const expectedObjectType: InterfaceLiteralNode = {
        nodeType: NodeType.InterfaceLiteral,
        category: NodeCategory.Type,
        fields: [
          {
            nodeType: NodeType.InterfaceField,
            category: NodeCategory.Type,
            name: expression.property.name,
            fieldType: buildObjectType(expression.property),
            optional: false,
            mutable: false,
            position: expression.property.position,
          },
        ],
        position: expression.position,
      };
      // Check Type Compatibility
      typeCompatible(rawProgram, expectedObjectType, objectType);
      // Get Member Type
      const elementType = <TypeLiteral>(
        getObjectPropertyType(expression.property, <InterfaceLiteralNode>objectType)
      );
      return elementType;
    }
  }
};
// TypeCheck Node
const typeCheckNode = (
  // Code
  rawProgram: string,
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
    return typeCheckNode(rawProgram, { ...properties, ...props }, parentNode, childNode);
  };
  // Match The Node For Analysis
  switch (node.nodeType) {
    // General
    case NodeType.Program:
      // Analyze Program Node
      node.body = node.body.map((childNode) => {
        return <AnalyzedStatement>_typeCheckNode(childNode, {
          _imports: node.data._imports,
          _exports: node.data._exports,
          // Our Global Variable And Type Pools
          _variables: node.data._variables,
          _types: node.data._types,
          // Stacks
          _varStack: node.data._varStack,
          _typeStack: node.data._typeStack,
          // Stack Pool
          _varStacks: [],
          _typeStacks: [],
        });
      });
      // Return The Node
      return node;
    // Statements
    case NodeType.IfStatement:
      // Analyze Condition
      node.condition = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.condition);
      // TypeCheck Condition
      typeEqual(
        rawProgram,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          <AnalyzedExpression>node.condition
        ),
        createPrimType('Boolean', node.condition.position)
      );
      // Analyze Body
      node.body = <AnalyzedStatement>_typeCheckNode(<AnalyzedStatement>node.body);
      // Analyze Alternative
      if (node.alternative)
        node.alternative = <AnalyzedStatement>_typeCheckNode(<AnalyzedStatement>node.alternative);
      return node;
    case NodeType.FlagStatement:
      // We only allow arguments on the operator flag, we dont need to analyze these because they are only used in the compiler
      if (node.value == 'operator') {
        typeEqual(
          rawProgram,
          getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            <AnalyzedExpression>node.args.args[0]
          ),
          createPrimType('String', node.args.args[0].position)
        );
        typeEqual(
          rawProgram,
          getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            <AnalyzedExpression>node.args.args[0]
          ),
          createPrimType('Number', node.args.args[0].position)
        );
      }
      return node;
    case NodeType.BlockStatement:
      node.body = node.body.map((childNode) => {
        return <AnalyzedStatement>_typeCheckNode(<AnalyzedStatement>childNode, {
          // Stacks
          _varStack: node.data._varStack,
          _typeStack: node.data._typeStack,
          // Stack Pool
          _varStacks: [..._varStacks, _varStack],
          _typeStacks: [..._typeStacks, _typeStack],
        });
      });
      return node;
    case NodeType.ImportStatement:
    case NodeType.WasmImportStatement:
    case NodeType.ExportStatement:
      // TODO: Figure Out Type Checking For This
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.DeclarationStatement:
      // TODO: Handle TypeValidation Of Destructured Declarations
      // Analyze Properties
      node.varType = <TypeLiteral>_typeCheckNode(node.varType);
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      // Type Check
      typeEqual(
        rawProgram,
        node.varType,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          <AnalyzedExpression>node.value
        )
      );
      // Set Variable Type To Be More Accurate
      setVarType(
        rawProgram,
        _variables,
        _varStack,
        _varStacks,
        node.name.name,
        node.varType,
        node.position
      );
      // Return Node
      return node;
    case NodeType.AssignmentStatement: {
      // Analyze Node
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      node.name = <VariableUsage>_typeCheckNode(node.name);
      // Get The Type Of The Variable
      const varType = getExpressionType(rawProgram, _variables, _varStack, _varStacks, node.name);
      // TODO: Analyze If Value Is Mutable
      // Type Check Node
      typeEqual(
        rawProgram,
        varType,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          <AnalyzedExpression>node.value
        )
      );
      // Return Node
      return node;
    }
    case NodeType.PostFixStatement:
    case NodeType.ReturnStatement:
    case NodeType.EnumDefinitionStatement:
    case NodeType.EnumVariant:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.TypeCastExpression:
      // Analyze Properties
      node.typeLiteral = <TypeLiteral>_typeCheckNode(node.typeLiteral);
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      // Check if type is compatible
      typeCompatible(
        rawProgram,
        node.typeLiteral,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          <AnalyzedExpression>node.value
        )
      );
      // Return Node
      return node;
    case NodeType.UnaryExpression:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.ParenthesisExpression:
      node.value = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.value);
      return node;
    case NodeType.CallExpression:
    case NodeType.WasmCallExpression:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
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
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Types
    case NodeType.InterfaceDefinition:
    case NodeType.TypeAliasDefinition:
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((type): GenericTypeNode => {
          return <GenericTypeNode>_typeCheckNode(type, {
            // Stacks
            _typeStack: node.data._typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Type
      node.typeLiteral = <TypeLiteral>_typeCheckNode(node.typeLiteral, {
        // Stacks
        _typeStack: node.data._typeStack,
        // Stack Pool
        _typeStacks: [..._typeStacks, _typeStack],
      });
      // Set Type Variable
      setTypeVar(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        node.name,
        node.typeLiteral,
        node.position
      );
      // Return Node
      return node;
    case NodeType.TypePrimLiteral:
      return node;
    case NodeType.TypeUnionLiteral:
      node.types = node.types.map((type) => {
        return <TypeLiteral>_typeCheckNode(type);
      });
      return node;
    case NodeType.ArrayTypeLiteral:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.ParenthesisTypeLiteral:
      node.value = <TypeLiteral>_typeCheckNode(node.value);
      return node;
    case NodeType.FunctionSignatureLiteral:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.InterfaceLiteral:
      // Analyze Field Nodes
      console.log(node);
    case NodeType.TypeUsage:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.GenericType:
      return node;
    // Variables
    case NodeType.VariableUsage:
      return node;
    case NodeType.MemberAccess:
      // Analyze Parent
      node.parent = <AnalyzedExpression>_typeCheckNode(<AnalyzedExpression>node.parent);
    case NodeType.PropertyUsage:
      // Analyze Property
      if (node.property)
        node.property = <PropertyUsageNode>_typeCheckNode(<PropertyUsageNode>node.property);
      return node;
    case NodeType.Parameter:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
  }
};
// Analyze Program
const typeCheckProgram = (
  rawProgram: string,
  program: AnalyzedProgramNode
): AnalyzedProgramNode => {
  return <AnalyzedProgramNode>typeCheckNode(
    rawProgram,
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

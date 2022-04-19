import { Position } from '../Types/Types';
import Node, {
  NodeType,
  NodeCategory,
  Expression,
  TypeLiteral,
  VariableUsageNode,
  TypeUsageNode,
  PropertyUsageNode,
  InterfaceLiteralNode,
  InterfaceFieldNode,
  GenericTypeNode,
  EnumVariantNode,
  ProgramNode,
  UnaryExpressionOperator,
  ParameterNode,
} from '../Types/ParseNodes';
import {
  AnalyzeNode,
  VariableMap,
  VariableStack,
  VariableData,
  TypeMap,
  TypeStack,
  TypeData,
} from '../Types/AnalyzerNodes';
import {
  createPrimType,
  createArrayType,
  createFunctionSignatureType,
  createUnionType,
} from '../Helpers/index';
import { BriskError, BriskTypeError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Type Helpers
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
    return createPrimType(memberAccess.position, 'Any');
  }
};
const getObjectPropertyField = (
  memberAccess: PropertyUsageNode,
  type: InterfaceLiteralNode
): InterfaceFieldNode | undefined => {
  // Find Type
  const field = type.fields.find((f) => f.name == memberAccess.name);
  if (memberAccess.property != undefined && field?.fieldType.nodeType == NodeType.InterfaceLiteral)
    return getObjectPropertyField(memberAccess.property, field.fieldType);
  else return field;
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
const resolveType = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  type: TypeLiteral
): TypeLiteral => {
  // TODO: Handle Recursive Types
  switch (type.nodeType) {
    case NodeType.TypePrimLiteral:
      if (type.name == 'Function') {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeCouldNotBeInferred,
          [type.name],
          type.position
        );
      }
      return type;
    case NodeType.TypeUnionLiteral: {
      const types: TypeLiteral[] = [];
      for (const t of type.types) {
        const resolvedType = resolveType(rawProgram, typePool, typeStack, typeStacks, t);
        if (
          !types.some((checkType) => {
            return typeEqual(
              rawProgram,
              typePool,
              typeStack,
              typeStacks,
              resolvedType,
              checkType,
              false
            );
          })
        ) {
          types.push(resolvedType);
        }
      }
      if (types.length == 1) {
        return types[0];
      } else {
        return {
          ...type,
          // Resolve Types
          types: types,
        };
      }
    }
    case NodeType.ArrayTypeLiteral:
      return {
        ...type,
        // Resolve Base Type
        value: resolveType(rawProgram, typePool, typeStack, typeStacks, type.value),
      };
    case NodeType.ParenthesisTypeLiteral:
      // Resolve Wrapped Type
      return resolveType(rawProgram, typePool, typeStack, typeStacks, type.value);
    case NodeType.FunctionSignatureLiteral:
      return {
        ...type,
        // Resolve Param Types
        params: type.params.map((p) =>
          resolveType(rawProgram, typePool, type.data._typeStack, [...typeStacks, typeStack], p)
        ),
        // Resolve Return Type
        returnType: resolveType(
          rawProgram,
          typePool,
          type.data._typeStack,
          [...typeStacks, typeStack],
          type.returnType
        ),
      };
    case NodeType.InterfaceLiteral:
      return {
        ...type,
        fields: type.fields.map((field) => {
          return {
            ...field,
            fieldType: resolveType(rawProgram, typePool, typeStack, typeStacks, field.fieldType),
          };
        }),
      };
    case NodeType.EnumDefinitionStatement: {
      // Analyze Variants
      const variants: EnumVariantNode[] = [];
      for (const variant of type.variants) {
        if (Array.isArray(variant.value)) {
          variants.push({
            ...variant,
            value: variant.value.map((v) =>
              resolveType(rawProgram, typePool, typeStack, typeStacks, v)
            ),
          });
        } else variants.push(variant);
      }
      return {
        ...type,
        variants: variants,
      };
    }
    case NodeType.TypeUsage:
      return resolveType(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        getTypeVar(rawProgram, typePool, typeStack, typeStacks, type.name, type.position)
      );
    case NodeType.GenericType:
      return type;
  }
};
const typeCompatible = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeA: TypeLiteral,
  typeB: TypeLiteral
): boolean => {
  // Resolve Both Types
  const resolvedA = resolveType(rawProgram, typePool, typeStack, typeStacks, typeA);
  const resolvedB = resolveType(rawProgram, typePool, typeStack, typeStacks, typeB);
  // Check If Types Are Already Equal
  const typesEqual = typeEqual(
    rawProgram,
    typePool,
    typeStack,
    typeStacks,
    resolvedA,
    resolvedB,
    false
  );
  if (typesEqual) return true;
  // TODO: Ensure Types Are Compatible
  return false;
};
const typeEqual = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeA: TypeLiteral,
  typeB: TypeLiteral,
  throwError = true
): boolean => {
  // Resolve Both Types
  const resolvedA = resolveType(rawProgram, typePool, typeStack, typeStacks, typeA);
  const resolvedB = resolveType(rawProgram, typePool, typeStack, typeStacks, typeB);
  // If Either Type Is Any Then We Can Leave
  // TODO: Remove Any Type
  if (resolvedA.nodeType == NodeType.TypePrimLiteral && resolvedA.name == 'Any') return true;
  if (resolvedB.nodeType == NodeType.TypePrimLiteral && resolvedB.name == 'Any') return true;
  // Handle PrimLiteral Types
  if (
    resolvedA.nodeType == NodeType.TypePrimLiteral &&
    resolvedB.nodeType == NodeType.TypePrimLiteral
  ) {
    // Throw An Error If The Types Are Not The Same And ThrowError Is True
    if (resolvedA.name != resolvedB.name && throwError) {
      BriskTypeError(
        rawProgram,
        BriskErrorType.TypeMisMatch,
        [resolvedA.name, resolvedB.name],
        typeA.position
      );
    }
    return resolvedA.name == resolvedB.name;
  }
  // Handle Array Types
  if (
    resolvedA.nodeType == NodeType.ArrayTypeLiteral &&
    resolvedB.nodeType == NodeType.ArrayTypeLiteral
  ) {
    // TODO: Determine Array Length, Check Lengths
    // if (resolvedA.length != resolvedB.length) {
    //   if (throwError) {
    //     BriskTypeError(
    //       rawProgram,
    //       BriskErrorType.TypeMisMatch,
    //       [
    //         rawProgram.slice(typeA.position.offset, typeA.position.offset + typeA.position.length),
    //         rawProgram.slice(typeB.position.offset, typeB.position.offset + typeB.position.length),
    //       ],
    //       typeA.position
    //     );
    //   }
    //   return false;
    // }
    // Throw An Error If The Types Are Not The Same And ThrowError Is True
    return typeEqual(
      rawProgram,
      typePool,
      typeStack,
      typeStacks,
      resolvedA.value,
      resolvedB.value,
      throwError
    );
  }
  // TODO: Check Type Equality
  return false;
};
// TODO: Handle Resolving Generic Types
// TODO: Implement Type Narrowing
// TODO: Implement Values As Types
// TODO: Support Wasm Interface Types
const getExpressionType = (
  rawProgram: string,
  varPool: VariableMap,
  varStack: VariableStack,
  varStacks: VariableStack[],
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  expression: Expression | ParameterNode,
  props?: { mutable?: boolean }
): TypeLiteral => {
  switch (expression.nodeType) {
    case NodeType.ComparisonExpression:
      return createPrimType(expression.position, 'Boolean');
    case NodeType.ArithmeticExpression:
      return getExpressionType(
        rawProgram,
        varPool,
        varStack,
        varStacks,
        typePool,
        typeStack,
        typeStacks,
        expression.lhs
      );
    case NodeType.UnaryExpression:
      if (expression.operator == UnaryExpressionOperator.UnaryNot) {
        return createPrimType(expression.position, 'Boolean');
      } else if (
        expression.operator == UnaryExpressionOperator.UnaryNegative ||
        expression.operator == UnaryExpressionOperator.UnaryPositive
      ) {
        return getExpressionType(
          rawProgram,
          varPool,
          varStack,
          varStacks,
          typePool,
          typeStack,
          typeStacks,
          expression.value
        );
      }
    case NodeType.ParenthesisExpression:
      return getExpressionType(
        rawProgram,
        varPool,
        varStack,
        varStacks,
        typePool,
        typeStack,
        typeStacks,
        expression.value
      );
    case NodeType.TypeCastExpression:
      return expression.typeLiteral;
    case NodeType.CallExpression:
      console.log(expression);
      break;
    case NodeType.WasmCallExpression:
      break;
    case NodeType.StringLiteral:
      return createPrimType(expression.position, 'String');
    case NodeType.I32Literal:
      return createPrimType(expression.position, 'i32');
    case NodeType.I64Literal:
      return createPrimType(expression.position, 'i64');
    case NodeType.U32Literal:
      return createPrimType(expression.position, 'u32');
    case NodeType.U64Literal:
      return createPrimType(expression.position, 'u64');
    case NodeType.F32Literal:
      return createPrimType(expression.position, 'f32');
    case NodeType.F64Literal:
      return createPrimType(expression.position, 'f64');
    case NodeType.NumberLiteral:
      return createPrimType(expression.position, 'Number');
    case NodeType.ConstantLiteral:
      if (expression.value == 'true' || expression.value == 'false')
        return createPrimType(expression.position, 'Boolean');
      else return createPrimType(expression.position, 'Void'); // Void Type
    case NodeType.FunctionLiteral:
      // Build Type
      return createFunctionSignatureType(
        expression.position,
        // Resolve Generic Types
        expression.genericTypes ?? [],
        // Analyze Params
        expression.params.map((p) =>
          getExpressionType(
            rawProgram,
            varPool,
            expression.data._varStack,
            varStacks,
            typePool,
            expression.data._typeStack,
            [...typeStacks, typeStack],
            p
          )
        ),
        // Resolve Return Type
        resolveType(
          rawProgram,
          typePool,
          expression.data._typeStack,
          [...typeStacks, typeStack],
          expression.returnType
        ),
        expression.data._typeStack
      );
    case NodeType.Parameter:
      return resolveType(rawProgram, typePool, typeStack, typeStacks, expression.paramType);
    case NodeType.ArrayLiteral: {
      // Get All Field Types
      const elementTypes: TypeLiteral[] = [];
      for (const element of expression.elements) {
        // TODO: Support Array Spread
        elementTypes.push(
          getExpressionType(
            rawProgram,
            varPool,
            varStack,
            varStacks,
            typePool,
            typeStack,
            typeStacks,
            element
          )
        );
      }
      const arrayType = createArrayType(
        expression.position,
        resolveType(
          rawProgram,
          typePool,
          typeStack,
          typeStacks,
          createUnionType(expression.position, ...elementTypes)
        ),
        elementTypes.length
      );
      return arrayType;
    }
    case NodeType.ObjectLiteral: {
      // Handle Fields
      const fields: InterfaceFieldNode[] = [];
      for (const field of expression.fields) {
        if (field.nodeType == NodeType.ObjectField) {
          fields.push({
            nodeType: NodeType.InterfaceField,
            category: NodeCategory.Type,
            name: field.name,
            fieldType: getExpressionType(
              rawProgram,
              varPool,
              varStack,
              varStacks,
              typePool,
              typeStack,
              typeStacks,
              field.fieldValue
            ),
            optional: false,
            mutable: field.fieldMutable,
            position: field.position,
          });
        } else {
          // Get Var Type
          const fieldSpreadType = <InterfaceLiteralNode>(
            getExpressionType(
              rawProgram,
              varPool,
              varStack,
              varStacks,
              typePool,
              typeStack,
              typeStacks,
              field.fieldValue
            )
          );
          for (const spreadField of fieldSpreadType.fields) {
            fields.push({
              nodeType: NodeType.InterfaceField,
              category: NodeCategory.Type,
              name: spreadField.name,
              fieldType: resolveType(
                rawProgram,
                typePool,
                typeStack,
                typeStacks,
                spreadField.fieldType
              ),
              optional: false,
              mutable: spreadField.mutable,
              position: spreadField.position,
            });
          }
        }
      }
      // Return Value
      return {
        nodeType: NodeType.InterfaceLiteral,
        category: NodeCategory.Type,
        fields: fields,
        position: expression.position,
      };
    }
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
      const objectType = resolveType(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        getExpressionType(
          rawProgram,
          varPool,
          varStack,
          varStacks,
          typePool,
          typeStack,
          typeStacks,
          expression.parent
        )
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
      typeCompatible(rawProgram, typePool, typeStack, typeStacks, expectedObjectType, objectType);
      // Get Member Type
      const elementType = <InterfaceFieldNode>(
        getObjectPropertyField(expression.property, <InterfaceLiteralNode>objectType)
      );
      if (props?.mutable != undefined) {
        if (elementType.mutable != props.mutable) {
          BriskTypeError(
            rawProgram,
            BriskErrorType.ConstantAssignment,
            [expression.property.name],
            expression.position
          );
        }
      }
      return elementType.fieldType;
    }
  }
};
// TypeCheck Node
const typeCheckNode = <T extends Node>(
  // Code
  rawProgram: string,
  // Stacks
  properties: AnalyzeNode,
  // Nodes
  parentNode: Node | undefined,
  node: T
): T => {
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
  const _typeCheckNode = <_T extends Node>(
    childNode: _T,
    props: Partial<AnalyzeNode> = properties,
    parentNode: Node = node
  ): _T => {
    return typeCheckNode(rawProgram, { ...properties, ...props }, parentNode, childNode);
  };
  // Match The Node For Analysis
  switch (node.nodeType) {
    // General
    case NodeType.Program:
      // Analyze Program Node
      node.body = node.body.map((childNode) => {
        return _typeCheckNode(childNode, {
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
      node.condition = _typeCheckNode(node.condition);
      // TypeCheck Condition
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          _types,
          _typeStack,
          _typeStacks,
          node.condition
        ),
        createPrimType(node.condition.position, 'Boolean')
      );
      // Analyze Body
      node.body = _typeCheckNode(node.body);
      // Analyze Alternative
      if (node.alternative) node.alternative = _typeCheckNode(node.alternative);
      return node;
    case NodeType.FlagStatement:
      // We only allow arguments on the operator flag, we dont need to analyze these because they are only used in the compiler
      if (node.value == 'operator') {
        typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            _types,
            _typeStack,
            _typeStacks,
            node.args.args[0]
          ),
          createPrimType(node.args.args[0].position, 'String')
        );
        typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            _types,
            _typeStack,
            _typeStacks,
            node.args.args[0]
          ),
          createPrimType(node.args.args[0].position, 'Number')
        );
      }
      return node;
    case NodeType.BlockStatement:
      node.body = node.body.map((childNode) => {
        return _typeCheckNode(childNode, {
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
      // Analyze Value
      node.value = _typeCheckNode(node.value);
      // Infer Type
      if (node.varType.nodeType == NodeType.TypePrimLiteral) {
        // Infer Function Type
        if (node.varType.name == 'Function') {
          if (node.value.nodeType != NodeType.FunctionLiteral) {
            BriskTypeError(
              rawProgram,
              BriskErrorType.TypeCouldNotBeInferred,
              ['Function'],
              node.position
            );
          }
          node.varType = getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            _types,
            _typeStack,
            _typeStacks,
            node.value
          );
        }
      } else if (node.varType.nodeType == NodeType.ArrayTypeLiteral) {
        // Infer Array Type
        if (node.varType.length == undefined) {
          if (node.value.nodeType == NodeType.ArrayLiteral) {
            node.varType.length = {
              nodeType: NodeType.NumberLiteral,
              category: NodeCategory.Literal,
              value: `${node.value.length}`,
              position: node.varType.position,
            };
          } else {
            BriskTypeError(
              rawProgram,
              BriskErrorType.ArrayTypeLengthCouldNotBeInferred,
              [],
              node.position
            );
          }
        }
      }
      // Analyze Type
      node.varType = _typeCheckNode(node.varType);
      // Type Check
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        node.varType,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          _types,
          _typeStack,
          _typeStacks,
          node.value
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
      node.value = _typeCheckNode(node.value);
      node.name = _typeCheckNode(node.name);
      // Get The Type Of The Variable
      const varType = getExpressionType(
        rawProgram,
        _variables,
        _varStack,
        _varStacks,
        _types,
        _typeStack,
        _typeStacks,
        node.name,
        { mutable: true }
      );
      // Type Check Node
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        varType,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          _types,
          _typeStack,
          _typeStacks,
          node.value
        )
      );
      // Return Node
      return node;
    }
    case NodeType.PostFixStatement: {
      // Analyze Node
      node.name = _typeCheckNode(node.name);
      // Get The Type Of The Variable
      const varType = getExpressionType(
        rawProgram,
        _variables,
        _varStack,
        _varStacks,
        _types,
        _typeStack,
        _typeStacks,
        node.name,
        { mutable: true }
      );
      // Type Check Node
      typeCompatible(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        varType,
        createUnionType(
          node.position,
          createPrimType(node.position, 'u32'),
          createPrimType(node.position, 'u64'),
          createPrimType(node.position, 'i32'),
          createPrimType(node.position, 'i64'),
          createPrimType(node.position, 'f32'),
          createPrimType(node.position, 'f64'),
          createPrimType(node.position, 'Number')
        )
      );
      // Return Node
      return node;
    }
    case NodeType.ReturnStatement:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.EnumDefinitionStatement:
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((type): GenericTypeNode => {
          return _typeCheckNode(type, {
            // Stacks
            _typeStack: node.data._typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Variants
      node.variants = node.variants.map((variant): EnumVariantNode => {
        return _typeCheckNode(variant, {
          // Stacks
          _typeStack: node.data._typeStack,
          // Stack Pool
          _typeStacks: [..._typeStacks, _typeStack],
        });
      });
      // Set Type Variable
      setTypeVar(rawProgram, _types, _typeStack, _typeStacks, node.name, node, node.position);
      // Return Node
      return node;
    case NodeType.EnumVariant:
      if (Array.isArray(node.value)) {
        // ADT Enum
        node.value = node.value.map((value) =>
          resolveType(rawProgram, _types, _typeStack, _typeStacks, _typeCheckNode(value))
        );
      } else if (node.value != undefined) {
        node.value = _typeCheckNode(node.value);
      }
      return node;
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.TypeCastExpression:
      // Analyze Properties
      node.typeLiteral = _typeCheckNode(node.typeLiteral);
      node.value = _typeCheckNode(node.value);
      // Check if type is compatible
      typeCompatible(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        node.typeLiteral,
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          _types,
          _typeStack,
          _typeStacks,
          node.value
        )
      );
      // Return Node
      return node;
    case NodeType.UnaryExpression:
      BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    case NodeType.ParenthesisExpression:
      node.value = _typeCheckNode(node.value);
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
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((type): GenericTypeNode => {
          return _typeCheckNode(type, {
            // Stacks
            _typeStack: node.data._typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Parameters
      node.params = node.params.map((param) => {
        return _typeCheckNode(param, {
          // Stacks
          _closure: node.data._closure,
          _varStack: node.data._varStack,
          _typeStack: node.data._typeStack,
          // Parent Stacks
          _varStacks: [..._varStacks, _varStack],
          _typeStacks: [..._typeStacks, _typeStack],
        });
      });
      // Analyze ReturnType
      node.returnType = _typeCheckNode(node.returnType, {
        // Stacks
        _closure: node.data._closure,
        _varStack: node.data._varStack,
        _typeStack: node.data._typeStack,
        // Parent Stacks
        _varStacks: [..._varStacks, _varStack],
        _typeStacks: [..._typeStacks, _typeStack],
      });
      // Analyze Body
      node.body = _typeCheckNode(node.body, {
        // Stacks
        _closure: node.data._closure,
        _varStack: node.data._varStack,
        _typeStack: node.data._typeStack,
        // Parent Stacks
        _varStacks: [..._varStacks, _varStack],
        _typeStacks: [..._typeStacks, _typeStack],
      });
      // TODO: Verify Return Type
      // Return Node
      return node;
    case NodeType.ArrayLiteral:
      // TODO: Support Array Spread
      node.elements = node.elements.map((e) => _typeCheckNode(e));
      return node;
    case NodeType.ObjectLiteral:
      // TODO: Check Type Of ObjectSpreads
      // Analyze Fields
      node.fields = node.fields.map((field) => {
        field.fieldValue = _typeCheckNode(field.fieldValue);
        return field;
      });
      return node;
    // Types
    // TODO: Prevent Infinite Recursive Type Such As `type A = A` or `interface A { test: A }`
    case NodeType.InterfaceDefinition:
    case NodeType.TypeAliasDefinition:
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((type): GenericTypeNode => {
          return _typeCheckNode(type, {
            // Stacks
            _typeStack: node.data._typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Type
      node.typeLiteral = _typeCheckNode(node.typeLiteral, {
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
      // We Infer Function Types Before Reaching This So If One Appears Here We Have An Issue
      if (node.name == 'Function') {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeCouldNotBeInferred,
          [node.name],
          node.position
        );
      }
      return node;
    case NodeType.TypeUnionLiteral:
      node.types = node.types.map((type) => {
        return _typeCheckNode(type);
      });
      return node;
    case NodeType.ArrayTypeLiteral:
      // We Infer Array Length Before Reaching This So If One Appears Here We Have An Issue
      if (node.length == undefined) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.ArrayTypeLengthCouldNotBeInferred,
          [],
          node.position
        );
      }
      // Analyze Value
      node.value = _typeCheckNode(node.value);
      // Ensure Length
      return node;
    case NodeType.ParenthesisTypeLiteral:
      node.value = _typeCheckNode(node.value);
      return node;
    case NodeType.FunctionSignatureLiteral:
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((type): GenericTypeNode => {
          return _typeCheckNode(type, {
            // Stacks
            _typeStack: node.data._typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Parameters
      node.params = node.params.map((param) => {
        return _typeCheckNode(param, {
          // Stacks
          _typeStack: node.data._typeStack,
          // Parent Stacks
          _typeStacks: [..._typeStacks, _typeStack],
        });
      });
      // Analyze Return Type
      node.returnType = _typeCheckNode(node.returnType, {
        // Stacks
        _typeStack: node.data._typeStack,
        // Parent Stacks
        _typeStacks: [..._typeStacks, _typeStack],
      });
      return node;
    case NodeType.InterfaceLiteral:
      // Analyze Field Nodes
      node.fields = node.fields.map((field) => {
        field.fieldType = _typeCheckNode(field.fieldType);
        return field;
      });
    case NodeType.TypeUsage:
      return node;
    case NodeType.GenericType:
      // Set Type To Be More Accurate
      setTypeVar(rawProgram, _types, _typeStack, _typeStacks, node.name, node, node.position);
      // ReturnType
      return node;
    // Variables
    case NodeType.VariableUsage:
      return node;
    case NodeType.MemberAccess:
      // Analyze Parent
      node.parent = _typeCheckNode(node.parent);
    case NodeType.PropertyUsage:
      // Analyze Property
      if (node.property) node.property = _typeCheckNode(node.property);
      return node;
    case NodeType.Parameter:
      // Analyze NodeType
      node.paramType = _typeCheckNode(node.paramType);
      // TODO: Handle Destructuring
      // TODO: Handle Rest Syntax
      // Set Variable Type To Be More Accurate
      setVarType(
        rawProgram,
        _variables,
        _varStack,
        _varStacks,
        node.name.name,
        node.paramType,
        node.position
      );
      // Return Value
      return node;
  }
};
// Analyze Program
const typeCheckProgram = (rawProgram: string, program: ProgramNode): ProgramNode => {
  return typeCheckNode(
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

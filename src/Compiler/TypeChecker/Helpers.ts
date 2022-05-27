import {
  EnumVariantNode,
  Expression,
  InterfaceFieldNode,
  InterfaceLiteralNode,
  NodeCategory,
  NodeType,
  ParameterNode,
  PropertyUsageNode,
  TypeLiteral,
  UnaryExpressionOperator,
} from '../Types/ParseNodes';
import { TypeMap, TypeStack, VariableMap } from '../Types/AnalyzerNodes';
import { mapExpression } from './WasmTypes';
import {
  createArrayType,
  createFunctionSignatureType,
  createPrimType,
  createUnionType,
} from '../Helpers/typeBuilders';
import { getType, getVariable } from '../Helpers/Helpers';
import { BriskTypeError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Type Helpers
export const buildObjectType = (
  memberAccess: PropertyUsageNode
): InterfaceLiteralNode | TypeLiteral => {
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
export const getObjectPropertyField = (
  memberAccess: PropertyUsageNode,
  type: InterfaceLiteralNode
): InterfaceFieldNode | undefined => {
  // Find Type
  const field = type.fields.find((f) => f.name == memberAccess.name);
  if (memberAccess.property != undefined && field?.fieldType.nodeType == NodeType.InterfaceLiteral)
    return getObjectPropertyField(memberAccess.property, field.fieldType);
  else return field;
};
// Checking Helpers
export const nameType = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  type: TypeLiteral
): string => {
  // TODO: Handle Recursive Types
  switch (type.nodeType) {
    case NodeType.TypePrimLiteral:
      return type.name;
    case NodeType.TypeUnionLiteral: {
      return type.types
        .map((t) => nameType(rawProgram, typePool, typeStack, typeStacks, t))
        .join(' | ');
    }
    case NodeType.ArrayTypeLiteral:
      return `${nameType(rawProgram, typePool, typeStack, typeStacks, type.value)}[${
        type.length?.value ?? ''
      }]`;
    case NodeType.ParenthesisTypeLiteral:
      return `(${nameType(rawProgram, typePool, typeStack, typeStacks, type.value)})`;
    case NodeType.FunctionSignatureLiteral: {
      const params = type.params.map((p) =>
        nameType(rawProgram, typePool, type.data._typeStack, [...typeStacks, typeStack], p)
      );
      const returnType = nameType(
        rawProgram,
        typePool,
        type.data._typeStack,
        [...typeStacks, typeStack],
        type.returnType
      );
      if (type.genericTypes) {
        const generics = type.genericTypes.map((g) =>
          nameType(rawProgram, typePool, typeStack, typeStacks, g)
        );
        return `<${generics.join(', ')}>(${params.join(', ')}) => ${returnType}`;
      } else {
        return `(${params.join(', ')}) => ${returnType}`;
      }
    }
    case NodeType.InterfaceLiteral: {
      const fields = type.fields.map((field) => {
        return `${field.mutable ? 'let' : ''} ${field.name}${field.optional ? '?' : ''}: ${nameType(
          rawProgram,
          typePool,
          typeStack,
          typeStacks,
          field.fieldType
        )}`;
      });
      return `{ ${fields.join(', ')} }`;
    }
    case NodeType.EnumDefinitionStatement:
      return `Enum ${type.name}`;
    case NodeType.TypeUsage:
      return type.name;
    case NodeType.GenericType:
      return type.name;
  }
};
export const typeCompatible = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeA: TypeLiteral,
  typeB: TypeLiteral,
  throwError = false
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
  // Throw Error Or Return False
  if (throwError) {
    BriskTypeError(
      rawProgram,
      BriskErrorType.IncompatibleTypes,
      [
        nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
        nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
      ],
      resolvedB.position
    );
  }
  return false;
};
// Strict Equal
export const strictTypeEqual = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeA: TypeLiteral,
  typeB: TypeLiteral,
  throwError = true
) => {
  // Resolve Both Types
  const resolvedA = resolveType(rawProgram, typePool, typeStack, typeStacks, typeA);
  const resolvedB = resolveType(rawProgram, typePool, typeStack, typeStacks, typeB);
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
        resolvedA.position
      );
    }
    return resolvedA.name == resolvedB.name;
  }
  // Return False Normally
  return false;
};
// General Equal
export const typeEqual = (
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
  if (
    strictTypeEqual(rawProgram, typePool, typeStack, typeStacks, resolvedA, resolvedB, throwError)
  ) {
    // Check If They Are Strict Equal
    return true;
  }
  // Compare Generics
  if (
    resolvedA.nodeType == NodeType.GenericType &&
    resolvedB.nodeType == NodeType.GenericType &&
    resolvedA.valueType == undefined &&
    resolvedB.valueType == undefined
  ) {
    // Compare Generic Names
    if (resolvedA.name == resolvedB.name) {
      // Compare generic Constraints
      if (resolvedA.constraints != undefined && resolvedB.constraints != undefined) {
        if (
          typeEqual(
            rawProgram,
            typePool,
            typeStack,
            typeStacks,
            resolvedA.constraints,
            resolvedB.constraints,
            throwError
          )
        )
          return true;
      } else if (resolvedA.constraints == undefined && resolvedB.constraints == undefined) {
        return true;
      }
    }
  } else if (resolvedA.nodeType == NodeType.GenericType) {
    // If Type A Is Generic
    // Compare Type Value
    if (resolvedA.valueType) {
      return typeEqual(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        resolvedA.valueType,
        resolvedB,
        throwError
      );
    }
    // If there are restraints ensure they work
    if (resolvedA.constraints != undefined) {
      return typeEqual(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        resolvedA.constraints,
        resolvedB,
        throwError
      );
    } else return true;
  } else if (resolvedB.nodeType == NodeType.GenericType) {
    // If Type B Is Generic
    // Compare Type Value
    if (resolvedB.valueType) {
      return typeEqual(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        resolvedA,
        resolvedB.valueType,
        throwError
      );
    }
    // If there are restraints ensure they work
    if (resolvedB.constraints != undefined) {
      return typeEqual(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        resolvedA,
        resolvedB.constraints,
        throwError
      );
    } else return true;
  }
  // Handle Array Types
  if (
    resolvedA.nodeType == NodeType.ArrayTypeLiteral &&
    resolvedB.nodeType == NodeType.ArrayTypeLiteral
  ) {
    // Handle Lengths
    if (resolvedA.length != undefined && resolvedB.length != undefined) {
      // Check That If A Length Is Specified B Length Should Be Specified
      if (throwError) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
          ],
          typeA.position
        );
      }
      return false;
    }
    // If A Length Is Specified Then B Length Should Be Same
    if (resolvedA.length != undefined && resolvedA.length.value != resolvedB.length?.value) {
      // Check That If A Length Is Specified B Length Should Be Specified
      if (throwError) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
          ],
          typeA.position
        );
      }
      return false;
    }
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
  // Handle Interface Type
  if (
    resolvedA.nodeType == NodeType.InterfaceLiteral &&
    resolvedB.nodeType == NodeType.InterfaceLiteral
  ) {
    // Ensure That The Desired Interface Does Not Have Less Fields Then The Given Interface
    // It May Have More If Some Fields Are Optional
    if (resolvedA.fields.length >= resolvedB.fields.length) {
      // Check Fields Are All Equal
      let valid = true;
      for (const field of resolvedA.fields) {
        // Get Field B From Interface B
        const fieldB = resolvedB.fields.find((f) => f.name == field.name);
        // If Field B Does Not Exist It Could Be Optional
        if (fieldB == undefined) {
          // Check If Field Is Optional
          if (field.optional) continue;
        } else {
          // Ensure Both Fields Are Mutable
          if (field.mutable != fieldB.mutable) valid = false;
          // Check If They Are Equal
          if (
            !typeEqual(
              rawProgram,
              typePool,
              typeStack,
              typeStacks,
              field.fieldType,
              fieldB.fieldType,
              throwError
            )
          )
            valid = false;
        }
      }
      // Return Valid
      if (!valid && throwError) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
          ],
          resolvedB.position
        );
      }
      return valid;
    }
  }
  // Handle Union Types
  if (resolvedA.nodeType == NodeType.TypeUnionLiteral) {
    // If Type A Is Union
    // Check Each Type Value
    for (const type of resolvedA.types) {
      if (typeEqual(rawProgram, typePool, typeStack, typeStacks, type, resolvedB, false))
        return true;
    }
  } else if (resolvedB.nodeType == NodeType.TypeUnionLiteral) {
    // If Type B Is Union
    // Check Each Type Value
    for (const type of resolvedB.types) {
      if (typeEqual(rawProgram, typePool, typeStack, typeStacks, type, resolvedA, false))
        return true;
    }
  }
  // Handle Function Types
  if (
    resolvedA.nodeType == NodeType.FunctionSignatureLiteral &&
    resolvedB.nodeType == NodeType.FunctionSignatureLiteral
  ) {
    // Check That Generic States is The Same
    if (
      (resolvedA.genericTypes == undefined && resolvedB.genericTypes != undefined) ||
      (resolvedA.genericTypes != undefined && resolvedB.genericTypes == undefined)
    ) {
      if (throwError) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
          ],
          resolvedB.position
        );
      }
      return false;
    }
    // Check That Generic Types Are Same
    if (resolvedA.genericTypes && resolvedB.genericTypes) {
      // Check Generics Are Same
      for (const [index, generic] of resolvedA.genericTypes.entries()) {
        // Get genericB
        const genericB = resolvedB.genericTypes[index];
        // Compare Generics
        if (!typeEqual(rawProgram, typePool, typeStack, typeStacks, generic, genericB, throwError))
          return false;
      }
    }
    // Check That Params Are Same
    if (resolvedA.params.length != resolvedB.params.length) {
      if (throwError) {
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
            nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
          ],
          resolvedB.position
        );
      }
      return false;
    }
    for (const [index, param] of resolvedA.params.entries()) {
      // Get TypeB Param
      const paramB = resolvedB.params[index];
      // Compare Params
      if (!typeEqual(rawProgram, typePool, typeStack, typeStacks, param, paramB, throwError))
        return false;
    }
    // Check That ReturnType is Same
    return typeEqual(
      rawProgram,
      typePool,
      typeStack,
      typeStacks,
      resolvedA.returnType,
      resolvedB.returnType,
      throwError
    );
  }
  // Throw Error Or Return False
  if (throwError) {
    BriskTypeError(
      rawProgram,
      BriskErrorType.TypeMisMatch,
      [
        nameType(rawProgram, typePool, typeStack, typeStacks, resolvedA),
        nameType(rawProgram, typePool, typeStack, typeStacks, resolvedB),
      ],
      resolvedB.position
    );
  }
  return false;
};
// Helpers
export const resolveType = (
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
        // TODO: Improve Type Simplification
        if (
          !types.some((checkType) => {
            return strictTypeEqual(
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
      return resolveType(rawProgram, typePool, typeStack, typeStacks, getType(typePool, type).type);
    case NodeType.GenericType:
      return type;
  }
};
export const getExpressionType = (
  rawProgram: string,
  varPool: VariableMap,
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
        typePool,
        typeStack,
        typeStacks,
        expression.value
      );
    case NodeType.TypeCastExpression:
      return expression.typeLiteral;
    case NodeType.CallExpression: {
      // Get Callee Type
      const calleeType = resolveType(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, expression.callee)
      );
      // Ensure Callee is A Function
      if (calleeType.nodeType != NodeType.FunctionSignatureLiteral) {
        // Ensure Callee Is A Function
        return BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            'Function', // Get Callee Type
            nameType(rawProgram, typePool, typeStack, typeStacks, calleeType),
          ],
          expression.position
        );
      }
      // Check Each Parameter
      const args: TypeLiteral[] = [];
      const genericValues: Map<string, TypeLiteral> = new Map();
      for (const [index, arg] of expression.args.entries()) {
        // Get Argument
        const param = calleeType.params[index];
        // Set The Type
        if (param && param.nodeType == NodeType.GenericType && param.valueType == undefined) {
          genericValues.set(
            param.name,
            getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, arg)
          );
        }
        // Return Type
        args.push(getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, arg));
      }
      // Analyze ReturnType
      if (calleeType.returnType.nodeType == NodeType.GenericType) {
        if (genericValues.has(calleeType.returnType.name)) {
          return genericValues.get(calleeType.returnType.name)!;
        }
        // Handle Unresolved Generic
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeCouldNotBeInferred,
          [
            `ReturnType: ${nameType(
              rawProgram,
              typePool,
              calleeType.data._typeStack,
              [...typeStacks, typeStack],
              calleeType.returnType
            )}`,
          ],
          expression.position
        );
      }
      // Build Node
      return calleeType.returnType;
    }
    case NodeType.WasmCallExpression: {
      // Get Type
      const exprType = mapExpression(rawProgram, expression);
      // Check Each Parameter
      const args: TypeLiteral[] = [];
      const genericValues: Map<string, TypeLiteral> = new Map();
      for (const [index, arg] of expression.args.entries()) {
        // Get Argument
        const param = exprType.params[index];
        // Set The Type
        if (param && param.nodeType == NodeType.GenericType && param.valueType == undefined) {
          genericValues.set(
            param.name,
            getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, arg)
          );
        }
        // Return Type
        args.push(getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, arg));
      }
      // Analyze ReturnType
      if (exprType.returnType.nodeType == NodeType.GenericType) {
        if (genericValues.has(exprType.returnType.name)) {
          return genericValues.get(exprType.returnType.name)!;
        }
        // Handle Unresolved Generic
        BriskTypeError(
          rawProgram,
          BriskErrorType.TypeCouldNotBeInferred,
          [
            `ReturnType: ${nameType(
              rawProgram,
              typePool,
              exprType.data._typeStack,
              [...typeStacks, typeStack],
              exprType.returnType
            )}`,
          ],
          expression.position
        );
      }
      // Return Type
      return exprType.returnType;
    }
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
        expression.genericTypes ?? undefined,
        // Analyze Params
        expression.params.map((p) =>
          getExpressionType(
            rawProgram,
            varPool,
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
        if (element.nodeType == NodeType.ValueSpread) {
          // Check That Spread Value Is an ArrayLiteral
          const valueType = getExpressionType(
            rawProgram,
            varPool,
            typePool,
            typeStack,
            typeStacks,
            element.value
          );
          const resolvedType = resolveType(rawProgram, typePool, typeStack, typeStacks, valueType);
          if (resolvedType.nodeType != NodeType.ArrayTypeLiteral) {
            return BriskTypeError(
              rawProgram,
              BriskErrorType.TypeMisMatch,
              ['Array<Any>', nameType(rawProgram, typePool, typeStack, typeStacks, valueType)],
              element.value.position
            );
          }
          // Build Onto The Type
          elementTypes.push(resolvedType.value);
        } else {
          elementTypes.push(
            getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, element)
          );
        }
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
          // Get Value Type
          const fieldSpreadType = <InterfaceLiteralNode>(
            getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, field.value)
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
      return getVariable(varPool, expression).type;
    case NodeType.MemberAccess: {
      // Get Member Type
      const objectType = resolveType(
        rawProgram,
        typePool,
        typeStack,
        typeStacks,
        getExpressionType(rawProgram, varPool, typePool, typeStack, typeStacks, expression.parent)
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

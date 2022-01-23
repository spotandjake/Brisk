import {
  NodeType,
  NodeCategory,
  TypeLiteral,
  PrimTypes,
  FunctionSignatureLiteralNode,
  TypePrimLiteralNode,
  TypeUnionLiteralNode,
  InterfaceLiteralNode,
  InterfaceFieldNode,
  UnaryExpressionOperator,
  ComparisonExpressionOperator,
} from '../Types/ParseNodes';
import { Position } from '../Types/Types';
import {
  AnalyzerNode,
  AnalyzedExpression,
  TypeData,
  TypeMap,
  TypeStack,
  VariableData,
  VariableMap,
  VariableStack,
  AnalyzedProgramNode,
  AnalyzedFunctionLiteralNode,
} from '../Types/AnalyzerNodes';
import { BriskTypeError } from '../Errors/Compiler';
import { instructions, WasmInstruction } from './WasmTypes';

const createTypeNode = (
  name: PrimTypes | PrimTypes[],
  position: Position
): TypePrimLiteralNode | TypeUnionLiteralNode => {
  if (Array.isArray(name)) {
    return {
      nodeType: NodeType.TypeUnionLiteral,
      category: NodeCategory.Type,
      types: name.map((n) => createTypeNode(n, position)),
      position,
    };
  } else {
    return {
      nodeType: NodeType.TypePrimLiteral,
      category: NodeCategory.Type,
      name: name,
      position: position,
    };
  }
};
const resolveType = (
  _types: TypeMap,
  typeStack: TypeStack,
  givenType: TypeLiteral
): TypeLiteral => {
  switch (givenType.nodeType) {
    case NodeType.TypePrimLiteral:
      return givenType;
    case NodeType.TypeUnionLiteral: {
      givenType.types = givenType.types.map((t) => resolveType(_types, typeStack, t));
      const types: TypeLiteral[] = [];
      for (const subType of givenType.types) {
        if (!types.some((_subType) => typeMatch(_types, typeStack, _subType, subType)))
          types.push(subType);
      }
      givenType.types = types;
      return givenType;
    }
    case NodeType.ParenthesisTypeLiteral:
      return resolveType(_types, typeStack, givenType.value);
    case NodeType.FunctionSignatureLiteral:
      givenType.params = givenType.params.map((param) => resolveType(_types, typeStack, param));
      givenType.returnType = resolveType(_types, typeStack, givenType.returnType);
      return givenType;
    case NodeType.InterfaceLiteral:
      givenType.fields = givenType.fields.map((field) => {
        field.fieldType = resolveType(_types, typeStack, field.fieldType);
        return field;
      });
      return givenType;
    case NodeType.TypeUsage:
      if (_types.has(<number>givenType.name)) {
        //@ts-ignore
        return resolveType(_types, typeStack, _types.get(<number>givenType.name).type);
      } else {
        BriskTypeError(`Type \`${givenType.name}\` is not defined`, givenType.position);
        return createTypeNode('Void', givenType.position);
      }
  }
};
const typeMatch = (
  _types: TypeMap,
  typeStack: TypeStack,
  _got: TypeLiteral,
  _expected: TypeLiteral
): boolean => {
  // Resolve The Types Down To Primitives
  const got = resolveType(_types, typeStack, _got);
  const expected = resolveType(_types, typeStack, _expected);
  if (got.nodeType == NodeType.TypePrimLiteral && got.name == 'Any') return true;
  if (expected.nodeType == NodeType.TypePrimLiteral && expected.name == 'Any') return true;
  // Deal with union types
  if (got.nodeType == NodeType.TypeUnionLiteral && expected.nodeType == NodeType.TypeUnionLiteral) {
    if (expected.types.length > got.types.length) return false;
    for (const _subType of expected.types) {
      const subType = resolveType(_types, typeStack, _subType);
      if (!got.types.some((t) => typeMatch(_types, typeStack, t, subType))) return false;
    }
    return true;
  }
  if (got.nodeType == NodeType.TypeUnionLiteral) {
    for (const subType of got.types) {
      if (typeMatch(_types, typeStack, subType, expected)) return true;
    }
  }
  if (expected.nodeType == NodeType.TypeUnionLiteral) {
    for (const subType of expected.types) {
      if (typeMatch(_types, typeStack, subType, got)) return true;
    }
  }
  // Matching Logic
  if (got.nodeType == expected.nodeType) {
    // Check PrimLiteral Types Are Same
    if (
      got.nodeType == NodeType.TypePrimLiteral &&
      expected.nodeType == NodeType.TypePrimLiteral &&
      got.name == expected.name
    )
      return true;
    if (
      got.nodeType == NodeType.FunctionSignatureLiteral &&
      expected.nodeType == NodeType.FunctionSignatureLiteral
    ) {
      // Check Function Signature Types Are Same
      if (got.params.length != expected.params.length) return false;
      for (let i = 0; i < got.params.length; i++) {
        if (!typeMatch(_types, typeStack, got.params[i], expected.params[i])) return false;
      }
      return typeMatch(_types, typeStack, got.returnType, expected.returnType);
    }
    if (
      got.nodeType == NodeType.InterfaceLiteral &&
      expected.nodeType == NodeType.InterfaceLiteral
    ) {
      // TODO: Add Support For Optional Fields
      // Check Interface Types Are Same
      if (got.fields.length != expected.fields.length) return true;
      for (let i = 0; i < got.fields.length; i++) {
        if (got.fields[i].name != expected.fields[i].name) return false;
        if (!typeMatch(_types, typeStack, got.fields[i].fieldType, expected.fields[i].fieldType))
          return false;
      }
      return true;
    }
    if (got.nodeType == NodeType.TypeUsage && expected.nodeType == NodeType.TypeUsage) {
      if (got.name == expected.name) return true;
    }
  } else {
    // Check Signature Vs Function
    if (
      got.nodeType == NodeType.FunctionSignatureLiteral &&
      expected.nodeType == NodeType.TypePrimLiteral &&
      expected.name == 'Function'
    )
      return true;
    if (
      expected.nodeType == NodeType.FunctionSignatureLiteral &&
      got.nodeType == NodeType.TypePrimLiteral &&
      got.name == 'Function'
    )
      return true;
    // Check
  }
  return false;
};
const prettyName = (_types: TypeMap, typeStack: TypeStack, _givenType: TypeLiteral): string => {
  const givenType = resolveType(_types, typeStack, _givenType);
  if (_givenType.nodeType == NodeType.ParenthesisTypeLiteral) {
    return `(${prettyName(_types, typeStack, _givenType.value)})`;
  } else if (givenType.nodeType == NodeType.FunctionSignatureLiteral) {
    return `(${givenType.params
      .map((param) => prettyName(_types, typeStack, param))
      .join(', ')}) => ${prettyName(_types, typeStack, givenType.returnType)}`;
  } else if (givenType.nodeType == NodeType.InterfaceLiteral) {
    const mutable = givenType.fields.some((field) => field.mutable) ? 3 : 0;
    const optional = givenType.fields.some((field) => field.optional) ? 1 : 0;
    return `interface {\n${givenType.fields
      .map((field) => {
        return `  ${field.optional ? '' : ' '.repeat(optional)}${
          field.mutable ? 'let' : ' '.repeat(mutable)
        } ${field.name}${field.optional ? '?' : ''}: ${prettyName(
          _types,
          typeStack,
          field.fieldType
        )};\n`;
      })
      .join('')}}`; // TODO: This Formatting Needs Improvement
  } else if (givenType.nodeType == NodeType.TypeUnionLiteral) {
    return `${givenType.types.map((t) => prettyName(_types, typeStack, t)).join(' | ')}`;
  } else if (givenType.nodeType == NodeType.ParenthesisTypeLiteral) {
    return `(${prettyName(_types, typeStack, givenType.value)})`;
  } else {
    return typeof givenType.name == 'number' && _types.has(givenType.name)
      ? (<TypeData>_types.get(givenType.name)).name
      : <string>givenType.name;
  }
};
const checkValidType = (
  _types: TypeMap,
  typeStack: TypeStack,
  code: string,
  expected: TypeLiteral,
  got: TypeLiteral,
  position: Position,
  message = ''
) => {
  if (!typeMatch(_types, typeStack, got, expected)) {
    // Create Detailed Error Message
    const width = process.stdout.columns || 80;
    const offset = position.offset;

    let startOfLine = code.lastIndexOf('\n', offset);
    let endOfLine = code.indexOf('\n', offset + position.length);
    if (endOfLine - startOfLine > width) {
      const loopLength = endOfLine - startOfLine - width;
      for (let i = 0; i <= loopLength; i++) {
        if (startOfLine < offset) startOfLine++;
        if (endOfLine > offset) endOfLine--;
        if (endOfLine - startOfLine < width) break;
      }
    }
    // Build First Line
    const incorrectCode = code.slice(offset, offset + position.length);
    const line =
      position.length == 0
        ? `\x1b[0m${code.slice(startOfLine + 1, endOfLine)}`
        : `\x1b[0m${code.slice(
          startOfLine + 1,
          offset
        )}\x1b[31m\x1b[1m${incorrectCode}\x1b[0m${code.slice(
          offset + position.length,
          endOfLine
        )}`;
    // After Message
    const afterMessage = code.slice(
      endOfLine + 1,
      code.indexOf('\n', code.indexOf('\n', endOfLine + 1) + 1)
    );
    if (afterMessage.length >= width * 2) afterMessage.slice(width * 2);
    // Calculate Lengths
    const multiLine = /\n|\r/.test(incorrectCode);
    const startLength = multiLine ? 0 : offset - startOfLine - 1;
    const wrongCodeLength = multiLine
      ? Math.max(...incorrectCode.split(/\n|\r/g).map((line) => line.length))
      : position.length || 5;
    // Build message
    const msg = [
      'Type Mismatch',
      line,
      `\x1b[31m\x1b[1m${' '.repeat(startLength)}${'^'.repeat(
        wrongCodeLength
      )} expected ${prettyName(_types, typeStack, expected)} got ${prettyName(
        _types,
        typeStack,
        got
      )}, ${message} \x1b[0m`
        .split('\n')
        .map((text, i) =>
          i == 0 ? text : `${' '.repeat(startLength + wrongCodeLength + 10)}${text}`
        )
        .join('\n'),
      afterMessage,
    ];
    // =================================================================
    BriskTypeError(msg.join('\n'), position);
  }
};
const typeCheckNode = (
  _types: TypeMap,
  typeStack: TypeStack,
  _variables: VariableMap,
  stack: VariableStack,
  parentNode: AnalyzedProgramNode | AnalyzedFunctionLiteralNode,
  node: AnalyzerNode,
  code: string
): TypeLiteral => {
  // Properties
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program:
      node.body.map((child) =>
        typeCheckNode(
          node.types,
          node.typeStack,
          node.variables,
          node.stack,
          node,
          <AnalyzerNode>child,
          code
        )
      );
      return createTypeNode('Void', node.position);
    case NodeType.IfStatement: {
      const typeNode = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.condition,
        code
      );
      checkValidType(
        _types,
        typeStack,
        code,
        createTypeNode('Boolean', node.position),
        typeNode,
        node.position
      );
      typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzerNode>node.body,
        code
      );
      if (node.alternative)
        typeCheckNode(
          _types,
          typeStack,
          _variables,
          stack,
          parentNode,
          <AnalyzerNode>node.alternative,
          code
        );
      return createTypeNode('Void', node.position);
    }
    // Statements
    case NodeType.BlockStatement:
      node.body.map((child) =>
        typeCheckNode(
          _types,
          node.typeStack,
          _variables,
          node.stack,
          parentNode,
          <AnalyzerNode>child,
          code
        )
      );
      return createTypeNode('Void', node.position);
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      // TODO: We Need to Get the type from these for creating a type map
      return createTypeNode('Void', node.position);
    case NodeType.ExportStatement:
      typeCheckNode(_types, typeStack, _variables, stack, parentNode, node.value, code);
      // TODO: We Need to Get the type from these for creating a type map
      return createTypeNode('Void', node.position);
    case NodeType.DeclarationStatement: {
      const typeNode = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.value,
        code
      );
      checkValidType(_types, typeStack, code, node.varType, typeNode, node.value.position);
      return createTypeNode('Void', node.position);
    }
    case NodeType.AssignmentStatement: {
      const typeNode = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.value,
        code
      );
      const expectedType = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        node.name,
        code
      );
      checkValidType(_types, typeStack, code, expectedType, typeNode, node.position);
      return createTypeNode('Void', node.position);
    }
    case NodeType.ReturnStatement: {
      // TODO: We need to add path analysis to truly say that the function return type matches
      checkValidType(
        _types,
        typeStack,
        code,
        (<AnalyzedFunctionLiteralNode>parentNode).returnType,
        typeCheckNode(
          _types,
          typeStack,
          _variables,
          stack,
          parentNode,
          <AnalyzedExpression>node.returnValue,
          code
        ),
        node.returnValue.position,
        'Return Value Must Match Function Type Signature'
      );
      return createTypeNode('Void', node.position);
    }
    case NodeType.PostFixStatement: {
      const valueType = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.value,
        code
      );
      checkValidType(
        _types,
        typeStack,
        code,
        createTypeNode(['Number', 'i32', 'i64', 'f32', 'f64', 'u32', 'u64'], node.value.position),
        valueType,
        node.value.position,
        'PostFix Operation Can Only Occur On Value Of Type Number'
      );
      return createTypeNode('Void', node.position);
    }
    // Expressions
    case NodeType.ComparisonExpression:
      if (
        node.operator == ComparisonExpressionOperator.ComparisonAnd ||
        node.operator == ComparisonExpressionOperator.ComparisonOr
      ) {
        checkValidType(
          _types,
          typeStack,
          code,
          createTypeNode('Boolean', node.position),
          typeCheckNode(
            _types,
            typeStack,
            _variables,
            stack,
            parentNode,
            <AnalyzedExpression>node.lhs,
            code
          ),
          node.lhs.position,
          'Operators Must Be Of Type Boolean'
        );
        checkValidType(
          _types,
          typeStack,
          code,
          createTypeNode('Boolean', node.position),
          typeCheckNode(
            _types,
            typeStack,
            _variables,
            stack,
            parentNode,
            <AnalyzedExpression>node.rhs,
            code
          ),
          node.rhs.position,
          'Operators Must Be Of Type Boolean'
        );
      } else {
        checkValidType(
          _types,
          typeStack,
          code,
          typeCheckNode(
            _types,
            typeStack,
            _variables,
            stack,
            parentNode,
            <AnalyzedExpression>node.lhs,
            code
          ),
          typeCheckNode(
            _types,
            typeStack,
            _variables,
            stack,
            parentNode,
            <AnalyzedExpression>node.rhs,
            code
          ),
          node.rhs.position,
          'lhs must match rhs'
        );
      }
      return createTypeNode('Boolean', node.position);
    case NodeType.ArithmeticExpression: {
      const lhs = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.lhs,
        code
      );
      checkValidType(
        _types,
        typeStack,
        code,
        createTypeNode(['Number', 'i32', 'i64', 'f32', 'f64', 'u32', 'u64'], node.position),
        lhs,
        node.lhs.position
      );
      checkValidType(
        _types,
        typeStack,
        code,
        lhs,
        typeCheckNode(
          _types,
          typeStack,
          _variables,
          stack,
          parentNode,
          <AnalyzedExpression>node.rhs,
          code
        ),
        node.rhs.position,
        'lhs must match rhs'
      );
      return lhs;
    }
    case NodeType.TypeCastExpression:
      // TODO:Implement This
      BriskTypeError('Add Logic For TypeCasting', node.position);
      return createTypeNode('Void', node.position);
    case NodeType.UnaryExpression: {
      const typeNode = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.value,
        code
      );
      let expectedType: TypeLiteral, returnType: TypeLiteral;
      if (node.operator == UnaryExpressionOperator.UnaryNot) {
        expectedType = createTypeNode('Boolean', node.position);
        returnType = createTypeNode('Boolean', node.position);
      } else if (node.operator == UnaryExpressionOperator.UnaryPositive) {
        expectedType = createTypeNode(['Number', 'i32', 'i64', 'f32', 'f64'], node.position);
        returnType = typeNode;
      } else if (node.operator == UnaryExpressionOperator.UnaryNegative) {
        expectedType = createTypeNode(['Number', 'i32', 'i64', 'f32', 'f64'], node.position);
        returnType = typeNode;
      } else {
        // TODO: This is only here to prevent the type checker from going off
        //@ts-ignore
        return createTypeNode('Void', node.position);
      }
      checkValidType(_types, typeStack, code, expectedType, typeNode, node.position);
      return returnType;
    }
    case NodeType.ParenthesisExpression:
      return typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.value,
        code
      );
    case NodeType.CallExpression: {
      const functionReference = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.callee,
        code
      );
      const functionType = resolveType(_types, typeStack, functionReference);
      checkValidType(
        _types,
        typeStack,
        code,
        createTypeNode('Function', node.position),
        functionReference,
        node.position,
        'A Function Call Can Only Occur On A Function Of The Matching Type'
      );
      if (functionType.nodeType == NodeType.FunctionSignatureLiteral) {
        // TypeCheck Arguments
        // TODO: Check The Length Of The Arguments Is Enough
        node.args.map((arg, index) => {
          const argumentType = typeCheckNode(
            _types,
            typeStack,
            _variables,
            stack,
            parentNode,
            <AnalyzedExpression>arg,
            code
          );
          checkValidType(
            _types,
            typeStack,
            code,
            functionType.params[index],
            argumentType,
            arg.position,
            'Argument does Not Match Expected Type'
          );
        });
        // Return Type
        return functionType.returnType;
      }
      // TODO: better type checking here, we Never want to reach this in actual Development
      return createTypeNode('Any', node.position);
    }
    case NodeType.WasmCallExpression:
      if (node.name.length == 0) {
        BriskTypeError('You must specify the function name', node.position);
        return createTypeNode('Void', node.position);
      } else {
        const instructionPath = node.name.slice(6).split('.');
        let _instructions:
          | ((position: Position) => FunctionSignatureLiteralNode)
          | WasmInstruction = instructions;
        for (const pathSegment of instructionPath) {
          if (typeof _instructions == 'function') {
            BriskTypeError(`Unknown Wasm Instruction \`${node.name}\``, node.position);
          } else if (
            typeof _instructions == 'object' &&
            _instructions != null &&
            _instructions.hasOwnProperty(pathSegment)
          ) {
            _instructions = _instructions[pathSegment];
          }
        }
        if (typeof _instructions == 'function') {
          return _instructions(node.position);
        } else {
          BriskTypeError(`Unknown Wasm Instruction \`${node.name}\``, node.position);
          return createTypeNode('Void', node.position);
        }
      }
    // Literals
    case NodeType.FunctionLiteral:
      typeCheckNode(
        _types,
        node.typeStack,
        _variables,
        node.stack,
        node,
        <AnalyzerNode>node.body,
        code
      );
      return {
        nodeType: NodeType.FunctionSignatureLiteral,
        category: NodeCategory.Type,
        params: node.params.map((param) =>
          typeCheckNode(_types, node.typeStack, _variables, node.stack, node, param, code)
        ),
        returnType: node.returnType,
        position: node.position,
      };
    case NodeType.StringLiteral:
      return createTypeNode('String', node.position);
    case NodeType.I32Literal:
      return createTypeNode('i32', node.position);
    case NodeType.I64Literal:
      return createTypeNode('i64', node.position);
    case NodeType.U32Literal:
      return createTypeNode('u32', node.position);
    case NodeType.U64Literal:
      return createTypeNode('u64', node.position);
    case NodeType.F32Literal:
      return createTypeNode('f32', node.position);
    case NodeType.F64Literal:
      return createTypeNode('f64', node.position);
    case NodeType.NumberLiteral:
      return createTypeNode('Number', node.position);
    case NodeType.ConstantLiteral:
      if (node.value == 'true' || node.value == 'false') {
        return createTypeNode('Boolean', node.position);
      } else if (node.value != 'void') {
        BriskTypeError(`Unknown Constant Literal \`${node.value}\``, node.position);
      }
      return createTypeNode('Void', node.position);
    case NodeType.ObjectLiteral: {
      const fields: Map<string, InterfaceFieldNode> = new Map();
      node.fields.forEach((field) => {
        if (field.nodeType == NodeType.ObjectField) {
          fields.set(field.name, {
            nodeType: NodeType.InterfaceField,
            category: NodeCategory.Type,
            name: field.name,
            fieldType: typeCheckNode(
              _types,
              typeStack,
              _variables,
              stack,
              parentNode,
              <AnalyzedExpression>field.fieldValue,
              code
            ),
            optional: false,
            mutable: false,
            position: field.position,
          });
        } else {
          const fieldType = resolveType(
            _types,
            typeStack,
            typeCheckNode(
              _types,
              typeStack,
              _variables,
              stack,
              parentNode,
              <AnalyzedExpression>field.fieldValue,
              code
            )
          );
          if (fieldType.nodeType == NodeType.InterfaceLiteral) {
            fieldType.fields.forEach((subField) => {
              fields.set(subField.name, subField);
            });
          } else {
            BriskTypeError(
              `Expected An \`interface\`, Found \`${prettyName(_types, typeStack, fieldType)}\``,
              field.fieldValue.position
            );
          }
        }
      });
      return <InterfaceLiteralNode>{
        nodeType: NodeType.InterfaceLiteral,
        category: NodeCategory.Type,
        fields: [...fields.values()],
        position: node.position,
      };
    }
    // Types
    case NodeType.TypeAliasDefinition:
      return createTypeNode('Void', node.position);
    case NodeType.InterfaceDefinition:
      return createTypeNode('Void', node.position);
    // Variables
    case NodeType.VariableUsage:
      return (<VariableData>(<unknown>_variables.get(<number>node.name))).type;
    case NodeType.MemberAccess: {
      const variableObject = typeCheckNode(
        _types,
        typeStack,
        _variables,
        stack,
        parentNode,
        <AnalyzedExpression>node.parent,
        code
      );
      const variableObjectType = resolveType(_types, typeStack, variableObject);
      if (variableObjectType.nodeType == NodeType.InterfaceLiteral) {
        if (variableObjectType.fields.some((field) => field.name == node.property.name)) {
          return (<InterfaceFieldNode>(
            variableObjectType.fields.find((field) => field.name == node.property.name)
          )).fieldType;
        } else {
          BriskTypeError(
            `Field \`${node.property.name}\` does not exist on Interface \`${prettyName(
              _types,
              typeStack,
              variableObjectType
            )}\``,
            node.position
          );
          return createTypeNode('Void', node.position);
        }
      } else {
        BriskTypeError('You Can Only Access Properties On Objects', node.position);
        return createTypeNode('Void', node.position);
      }
    }
    case NodeType.Parameter:
      return node.paramType;
    // Ignore
    case NodeType.FlagStatement:
      return createTypeNode('Void', node.position);
    // Other
    default:
      BriskTypeError(`TypeChecker: Unknown Node Type: ${node.nodeType}`, node.position);
      return createTypeNode('Void', node.position);
  }
};
const typeCheck = (program: AnalyzedProgramNode, code: string) => {
  typeCheckNode(
    program.types,
    program.typeStack,
    program.variables,
    program.stack,
    program,
    program,
    code
  );
};
export default typeCheck;

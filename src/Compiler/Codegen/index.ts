// Imports
import Node, { NodeType, ProgramNode } from '../Types/ParseNodes';
import { AnalyzerProperties } from '../Types/AnalyzerNodes';
import { getExpressionType } from '../TypeChecker/Helpers';
import { UnresolvedBytes, WasmModule } from '../../wasmBuilder/Types/Nodes';
import { addFunction, compileModule, createModule, setStart } from '../../wasmBuilder/Build/Module';
import { createFunction } from '../../wasmBuilder/Build/Function';
import { createFunctionType } from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// CodeGen
const generateCode = (
  // Code
  rawProgram: string,
  // wasmModule
  wasmModule: WasmModule,
  // Stacks
  properties: AnalyzerProperties,
  // Nodes
  parentNode: Node | undefined,
  node: Exclude<Node, ProgramNode>
): UnresolvedBytes => {
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
  const _generateCode = (
    childNode: Exclude<Node, ProgramNode>,
    props: Partial<AnalyzerProperties> = properties,
    parentNode: Node = node
  ): UnresolvedBytes => {
    return generateCode(rawProgram, wasmModule, { ...properties, ...props }, parentNode, childNode);
  };
  // Compile The Code
  switch (node.nodeType) {
    // Statements
    case NodeType.IfStatement: {
      // Compile Conditions
      const condition = Expressions.i32_eqExpression(
        Expressions.i32_ConstExpression(1),
        _generateCode(node.condition)
      );
      // Compile Paths
      const body = _generateCode(node.body);
      const alternative =
        node.alternative != undefined ? _generateCode(node.alternative) : undefined;
      // Return Expression
      return Expressions.ifExpression(condition, body, alternative);
    }
    // TODO: Handle Flag Statement
    case NodeType.BlockStatement: {
      // Compile Body
      const body = node.body.map((_node) => {
        return _generateCode(_node, {
          _varStacks: [..._varStacks, node.data._varStack],
          _typeStacks: [..._typeStacks, node.data._typeStack],

          _varStack: node.data._varStack,
          _typeStack: node.data._typeStack,
        });
      });
      // Return Expression
      return Expressions.blockExpression(undefined, body);
    }
    // TODO: Handle Import Statement
    // TODO: Handle WasmImportStatement
    // TODO: Handle ExportStatement
    // TODO: Handle DeclarationStatement
    // TODO: Handle AssignmentStatement
    // TODO: Handle ReturnStatement
    // TODO: Handle PostFixStatement
    // TODO: Handle EnumDefinitionStatement
    // TODO: Handle EnumVariant
    // TODO: Handle ComparisonExpression
    case NodeType.ComparisonExpression: {
      // TODO: Move this into The Language
      // Get The Expression Type For More Performant Equality
      // The Left and Right Side are the same type so we only need one
      const exprAType = getExpressionType(
        rawProgram,
        _variables,
        _varStack,
        _varStacks,
        _types,
        _typeStack,
        _typeStacks,
        node.lhs
      );
      // Compile Both Sides
      const lhs = _generateCode(node.lhs);
      const rhs = _generateCode(node.rhs);
      // Comparison
      if (exprAType.nodeType == NodeType.TypePrimLiteral) {
        // Handle Stack Types
        if (exprAType.name == 'i32' || exprAType.name == 'u32')
          return Expressions.i32_eqExpression(lhs, rhs);
        else if (exprAType.name == 'i64' || exprAType.name == 'u64')
          return Expressions.i64_eqExpression(lhs, rhs);
        else if (exprAType.name == 'f32') return Expressions.f32_eqExpression(lhs, rhs);
        else if (exprAType.name == 'f64') return Expressions.f64_eqExpression(lhs, rhs);
        else {
          // TODO: Handle Heap Types
          return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
        }
      } else {
        return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
    }
    // TODO: Handle ArithmeticExpression
    // TODO: Handle UnaryExpression
    // TODO: Handle ParenthesisExpression
    // TODO: Handle TypeCastExpression
    // TODO: Handle CallExpression
    // TODO: Handle WasmCallExpression
    // TODO: Handle StringLiteral
    case NodeType.I32Literal:
      // TODO: Handle Runtime Type
      return Expressions.i32_ConstExpression(node.value);
    // TODO: Handle I64Literal
    case NodeType.U32Literal:
      // TODO: Handle Runtime Type
      return Expressions.i32_ConstExpression(node.value);
    // TODO: Handle U64Literals
    case NodeType.F32Literal:
      // TODO: Handle Runtime Type
      return Expressions.f32_ConstExpression(node.value);
    case NodeType.F64Literal:
      // TODO: Handle Runtime Type
      return Expressions.i32_ConstExpression(node.value);
    // TODO: Handle NumberLiteral
    // TODO: Handle ConstantLiteral
    // TODO: Handle FunctionLiteral
    // TODO: Handle ArrayLiteral
    // TODO: Handle ObjectLiteral
    // TODO: Handle ObjectField
    // TODO: Handle ValueSpread
    // TODO: Handle TypeAliasDefinition
    // TODO: Handle InterfaceDefinition
    // TODO: Handle TypePrimLiteral
    // TODO: Handle TypeUnionLiteral
    // TODO: Handle ArrayTypeLiteral
    // TODO: Handle ParenthesisTypeLiteral
    // TODO: Handle FunctionSignatureLiteral
    // TODO: Handle InterfaceLiteral
    // TODO: Handle InterfaceField
    // TODO: Handle TypeUsage
    // TODO: Handle GenericType
    // TODO: Handle TypeIdentifier
    // TODO: Handle VariableDefinition
    // TODO: Handle VariableUsage
    // TODO: Handle MemberAccess
    // TODO: Handle PropertyUsage
    // TODO: Handle Parameter
    // TODO: Handle Arguments
  }
  // We should never get to here
  console.log('Unknown Node');
  console.log(node);
  process.exit(1); // TODO: Remove this
};
// Main Entry
const generateCodeProgram = (rawProgram: string, program: ProgramNode): Uint8Array => {
  // Create A New Module
  let module = createModule();
  // Build The Body
  const body = program.body.map((node) => {
    return generateCode(
      rawProgram,
      module,
      {
        _imports: program.data._imports,
        _exports: program.data._exports,
        _variables: program.data._variables,
        _types: program.data._types,
        _varStacks: [],
        _typeStacks: [],
        _closure: new Set(),
        _varStack: program.data._varStack,
        _typeStack: program.data._typeStack,
      },
      undefined,
      node
    );
  });
  // Add The Main Function
  module = addFunction(module, createFunction('main', createFunctionType([], []), [], [], body));
  module = setStart(module, 'main');
  // Return The Compiled Module
  return compileModule(module);
};

export default generateCodeProgram;

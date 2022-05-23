// Imports
import Node, {
  ComparisonExpressionOperator,
  FunctionSignatureLiteralNode,
  NodeType,
  ParameterNode,
  ProgramNode,
  TypeLiteral,
} from '../Types/ParseNodes';
import { AnalyzerProperties } from '../Types/AnalyzerNodes';
import { getExpressionType, typeEqual } from '../TypeChecker/Helpers';
import { createPrimType } from '../Helpers/index';
import {
  ResolvedBytes,
  UnresolvedBytes,
  WasmExternalKind,
  WasmModule,
  WasmTypes,
} from '../../wasmBuilder/Types/Nodes';
import {
  addElement,
  addFunction,
  addGlobal,
  addImport,
  addMemory,
  addType,
  compileModule,
  createImport,
  createModule,
  setStart,
} from '../../wasmBuilder/Build/Module';
import { createFunction } from '../../wasmBuilder/Build/Function';
import * as Types from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// Types
interface CodeGenProperties extends AnalyzerProperties {
  selfReference?: number;
}
// Values
const brisk_Void_Value = 0x03; // TODO: Consider Changing This
// Helpers
const encodeBriskType = (
  rawProgram: string,
  briskType: TypeLiteral,
  returnFunctionSignature: boolean,
  returnEmpty = false
): ResolvedBytes => {
  if (!returnEmpty) {
    switch (briskType.nodeType) {
      // TODO: EnumDefinitionStatement
      case NodeType.TypePrimLiteral:
        if (briskType.name == 'u32' || briskType.name == 'i32')
          return Types.createNumericType(WasmTypes.WasmI32);
        else if (briskType.name == 'u64' || briskType.name == 'i64')
          return Types.createNumericType(WasmTypes.WasmI64);
        else if (briskType.name == 'f32') return Types.createNumericType(WasmTypes.WasmF32);
        else if (briskType.name == 'f64') return Types.createNumericType(WasmTypes.WasmF64);
        else if (briskType.name == 'Boolean' || briskType.name == 'Void')
          return Types.createNumericType(WasmTypes.WasmI32);
        else if (
          briskType.name == 'String' ||
          briskType.name == 'Number' ||
          briskType.name == 'Function'
        )
          return Types.createNumericType(WasmTypes.WasmI32);
        // TODO: Remove Any
        // TODO: We should never get an Any or an Unknown at CodeGen
        else return BriskError(rawProgram, BriskErrorType.CompilerError, [], briskType.position);
      // TODO: TypeUnionLiteral
      // TODO: ArrayTypeLiteral
      case NodeType.ParenthesisTypeLiteral:
        return encodeBriskType(rawProgram, briskType.value, returnFunctionSignature);
      case NodeType.FunctionSignatureLiteral:
        if (returnFunctionSignature) {
          return Types.createFunctionType(
            briskType.params.map((p) => encodeBriskType(rawProgram, p, false)),
            [encodeBriskType(rawProgram, briskType.returnType, false)]
          );
        } else return Types.createNumericType(WasmTypes.WasmI32);
      // TODO: InterfaceLiteral
      // TODO: TypeUsage
      // TODO: GenericType
      default:
        return BriskError(
          rawProgram,
          BriskErrorType.FeatureNotYetImplemented,
          [],
          briskType.position
        );
    }
  } else {
    switch (briskType.nodeType) {
      // TODO: EnumDefinitionStatement
      case NodeType.TypePrimLiteral:
        if (briskType.name == 'u32' || briskType.name == 'i32')
          return Expressions.i32_ConstExpression(0);
        else if (briskType.name == 'u64' || briskType.name == 'i64')
          return Expressions.i64_ConstExpression(0);
        else if (briskType.name == 'f32') return Expressions.f32_ConstExpression(0);
        else if (briskType.name == 'f64') return Expressions.f64_ConstExpression(0);
        else if (briskType.name == 'Boolean') return Expressions.i32_ConstExpression(0);
        else if (briskType.name == 'Void') return Expressions.i32_ConstExpression(brisk_Void_Value);
        else if (
          briskType.name == 'String' ||
          briskType.name == 'Number' ||
          briskType.name == 'Function'
        )
          return Expressions.i32_ConstExpression(0);
        // TODO: Remove Any
        // TODO: We should never get an Any or an Unknown at CodeGen
        else return BriskError(rawProgram, BriskErrorType.CompilerError, [], briskType.position);
      // TODO: TypeUnionLiteral
      // TODO: ArrayTypeLiteral
      case NodeType.ParenthesisTypeLiteral:
        return encodeBriskType(rawProgram, briskType.value, returnFunctionSignature, true);
      case NodeType.FunctionSignatureLiteral:
        return Expressions.i32_ConstExpression(0);
      // TODO: InterfaceLiteral
      // TODO: TypeUsage
      // TODO: GenericType
      default:
        return BriskError(
          rawProgram,
          BriskErrorType.FeatureNotYetImplemented,
          [],
          briskType.position
        );
    }
  }
};
// CodeGen
type generableNode = Exclude<Node, ProgramNode | ParameterNode>;
const generateCode = (
  // Code
  rawProgram: string,
  // wasmModule
  wasmModule: WasmModule,
  // Stacks
  properties: CodeGenProperties,
  // Nodes
  parentNode: Node | undefined,
  node: generableNode
): UnresolvedBytes => {
  const {
    // Our Global Variable And Type Pools
    // _imports,
    // _exports,
    _variables,
    _types,
    // ParentStacks
    _varStacks,
    _typeStacks,
    // Stacks
    // _closure,
    _varStack,
    _typeStack,
  } = properties;
  const _generateCode = (
    childNode: generableNode,
    props: Partial<CodeGenProperties> = properties,
    parentNode: Node = node
  ): UnresolvedBytes => {
    return generateCode(rawProgram, wasmModule, { ...properties, ...props }, parentNode, childNode);
  };
  // Compile The Code
  switch (node.nodeType) {
    // Statements
    case NodeType.IfStatement: {
      // Compile Conditions
      const condition = _generateCode(node.condition);
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
    case NodeType.WasmImportStatement: {
      // TODO: Handle Destructuring
      // Compile Type
      wasmModule = addType(wasmModule, encodeBriskType(rawProgram, node.typeSignature, true));
      const importType = wasmModule.typeSection.length - 1;
      // Compile Import Statement
      // Build Import
      // Add Import
      // TODO: Allow Importing Tables And Memory
      // Function Types Start With 0x60
      const isFunctionImport = wasmModule.typeSection[importType][0] == 0x60;
      let importKind: WasmExternalKind;
      if (isFunctionImport) importKind = WasmExternalKind.function;
      else importKind = WasmExternalKind.global;
      wasmModule = addImport(
        wasmModule,
        createImport(importKind, node.source.value, node.variable.name, importType)
      );
      // Add The Function To The Table
      if (isFunctionImport) {
        // Function index can be determined by the length of the functionSection
        wasmModule = addElement(wasmModule, [wasmModule.functionSection.length]);
        // Return A Function Reference
        // TODO: This is a terrible way to determine the function index
        return Expressions.global_SetExpression(
          `${node.variable.name}${_varStack.get(node.variable.name)!}`,
          Expressions.i32_ConstExpression(wasmModule.functionSection.length)
        );
      }
      // Return Blank Statement
      return [];
    }
    // TODO: Handle WasmImportStatement
    // TODO: Handle ExportStatement
    // TODO: Handle DeclarationStatement
    case NodeType.DeclarationStatement: {
      // TODO: Handle Variable Destructuring
      // TODO: Add Locals To The List
      // Get The Variable Information
      const stackReference = _varStack.get(node.name.name)!;
      const varData = _variables.get(stackReference)!;
      if (varData.global) {
        // Assign To A Wasm Global
        return Expressions.global_SetExpression(
          `${varData.name}${_varStack.get(varData.name)!}`,
          _generateCode(node.value, { selfReference: stackReference })
        );
      } else {
        // TODO: Assign To A Wasm Local
      }
      console.log(varData);
      break;
    }
    // TODO: Handle AssignmentStatement
    case NodeType.ReturnStatement:
      if (node.returnValue != undefined)
        return Expressions.returnExpression(_generateCode(node.returnValue));
      // Otherwise Return Void
      else return Expressions.returnExpression(Expressions.i32_ConstExpression(brisk_Void_Value));
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
      // Equal Comparison
      if (node.operator == ComparisonExpressionOperator.ComparisonEqual) {
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
            return BriskError(
              rawProgram,
              BriskErrorType.FeatureNotYetImplemented,
              [],
              node.position
            );
          }
        } else {
          return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
        }
      } else {
        return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
    }
    // TODO: Handle ArithmeticExpression
    // TODO: Handle UnaryExpression
    case NodeType.ParenthesisExpression:
      return _generateCode(node.value);
    // TODO: Handle TypeCastExpression
    // TODO: Handle CallExpression
    case NodeType.CallExpression: {
      // Compile Build The Function Signature
      const funcType = <FunctionSignatureLiteralNode>(
        getExpressionType(
          rawProgram,
          _variables,
          _varStack,
          _varStacks,
          _types,
          _typeStack,
          _typeStacks,
          node.callee
        )
      );
      // TODO: Reuse The Original Type
      wasmModule = addType(wasmModule, encodeBriskType(rawProgram, funcType, true));
      // Get The TypeRef
      const functionSignature = wasmModule.typeSection.length - 1; // The Type is the last type
      // Return The Call
      const funcCall = Expressions.call_indirect(
        _generateCode(node.callee),
        node.args.map((arg) => _generateCode(arg)),
        functionSignature - 1
      );
      if (node.statement) return Expressions.dropExpression(funcCall);
      else return funcCall;
    }
    // TODO: Handle WasmCallExpression
    // TODO: Handle StringLiteral
    case NodeType.I32Literal:
      return Expressions.i32_ConstExpression(node.value);
    case NodeType.I64Literal:
      return Expressions.i64_ConstExpression(node.value);
    case NodeType.U32Literal:
      return Expressions.i32_ConstExpression(node.value);
    case NodeType.U64Literal:
      return Expressions.i64_ConstExpression(node.value);
    case NodeType.F32Literal:
      return Expressions.f32_ConstExpression(node.value);
    case NodeType.F64Literal:
      return Expressions.i32_ConstExpression(node.value);
    // TODO: Handle NumberLiteral
    case NodeType.ConstantLiteral:
      // 1 represents true
      if (node.value == 'true') return Expressions.i32_ConstExpression(1);
      // 0 represents false
      else if (node.value == 'false') return Expressions.i32_ConstExpression(0);
      // 3 represents void
      else if (node.value == 'void') return Expressions.i32_ConstExpression(brisk_Void_Value);
      break;
    case NodeType.FunctionLiteral: {
      // TODO: Handle Building Closure
      // TODO: Handle Polymorphic Functions
      // Compile Body
      const body: UnresolvedBytes[] = [];
      const compiledBody = _generateCode(node.body, {
        _closure: node.data._closure,
        _varStacks: [..._varStacks, node.data._varStack],
        _typeStacks: [..._typeStacks, node.data._typeStack],

        _varStack: node.data._varStack,
        _typeStack: node.data._typeStack,
      });
      if (
        typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          node.returnType,
          createPrimType(node.returnType.position, 'Void'),
          false
        )
      ) {
        body.push(compiledBody);
        body.push(Expressions.returnExpression(Expressions.i32_ConstExpression(brisk_Void_Value)));
      } else {
        body.push(Expressions.returnExpression(compiledBody));
      }
      // Handle Parameters
      // TODO: Handle Destructuring Parameters
      // Build The Function
      const func = createFunction(
        properties.selfReference != undefined
          ? _variables.get(properties.selfReference)!.name
          : `AmbiguousFunction${wasmModule.functionSection.length}`,
        encodeBriskType(
          rawProgram,
          getExpressionType(
            rawProgram,
            _variables,
            _varStack,
            _varStacks,
            _types,
            _typeStack,
            _typeStacks,
            node
          ),
          true
        ),
        node.params.map((p) => `${p.name.name}${node.data._varStack.get(p.name.name)}`),
        [],
        body
      );
      // Add The Function To The Module
      wasmModule = addFunction(wasmModule, func);
      // Add The Function To The Function Table
      // Function index can be determined by the length of the functionSection
      wasmModule = addElement(wasmModule, [wasmModule.functionSection.length]);
      // Return A Function Reference
      // TODO: This is a terrible way to determine the function index
      return Expressions.i32_ConstExpression(wasmModule.functionSection.length);
    }
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
    case NodeType.VariableUsage: {
      const varRef = _varStack.get(node.name)!;
      const varData = _variables.get(varRef)!;
      if (varData.global) {
        return Expressions.global_GetExpression(`${node.name}${_varStack.get(node.name)!}`);
      } else return Expressions.local_GetExpression(`${node.name}${_varStack.get(node.name)!}`);
    }
    // TODO: Handle MemberAccess
    // TODO: Handle PropertyUsage
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
  // Add The Memory
  module = addMemory(module, Types.createMemoryType(1));
  // Add Globals
  for (const [key, value] of program.data._variables.entries()) {
    if (value.global) {
      // TODO: Allow for immutable globals
      module = addGlobal(
        module,
        `${value.name}${key}`,
        true,
        encodeBriskType(rawProgram, value.type, false),
        encodeBriskType(rawProgram, value.type, false, true)
      );
    }
  }
  // Build The Body
  const body: UnresolvedBytes[] = [];
  body.push(
    ...program.body.map((node) => {
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
    })
  );
  // Add The Main Function
  module = addFunction(
    module,
    createFunction('main', Types.createFunctionType([], []), [], [], body)
  );
  module = setStart(module, 'main');
  // Return The Compiled Module
  return compileModule(module);
};

export default generateCodeProgram;

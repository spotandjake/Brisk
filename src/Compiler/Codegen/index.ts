// Imports
import Node, {
  ArgumentsNode,
  ArithmeticExpressionOperator,
  ComparisonExpressionOperator,
  FunctionSignatureLiteralNode,
  NodeType,
  ParameterNode,
  PostFixOperator,
  ProgramNode,
  TypeLiteral,
} from '../Types/ParseNodes';
import { AnalyzerProperties } from '../Types/AnalyzerNodes';
import { getExpressionType, getTypeVar, getVarReference, typeEqual } from '../TypeChecker/Helpers';
import { createPrimType } from '../Helpers/index';
import {
  ResolvedBytes,
  UnresolvedBytes,
  WasmExternalKind,
  WasmFunction,
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
import { mapExpression } from './WasmInstructionMap';
import { addLocal, createFunction, setBody } from '../../wasmBuilder/Build/Function';
import * as Types from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// Types
interface CodeGenProperties extends AnalyzerProperties {
  wasmFunction: WasmFunction;
  selfReference?: number;
}
// Values
const brisk_Void_Value = 0x03;
// Helpers
const _encodeBriskType = (
  rawProgram: string,
  briskType: TypeLiteral,
  properties: AnalyzerProperties,
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
        else return BriskError(rawProgram, BriskErrorType.CompilerError, [], briskType.position);
      // TODO: TypeUnionLiteral
      // TODO: ArrayTypeLiteral
      case NodeType.ParenthesisTypeLiteral:
        return _encodeBriskType(rawProgram, briskType.value, properties, returnFunctionSignature);
      case NodeType.FunctionSignatureLiteral:
        if (returnFunctionSignature) {
          return Types.createFunctionType(
            briskType.params.map((p) => _encodeBriskType(rawProgram, p, properties, false)),
            [_encodeBriskType(rawProgram, briskType.returnType, properties, false)]
          );
        } else return Types.createNumericType(WasmTypes.WasmI32);
      // TODO: InterfaceLiteral
      case NodeType.TypeUsage: {
        // Get Var Type
        const typeData = getTypeVar(
          rawProgram,
          properties._types,
          properties._typeStack,
          properties._typeStacks,
          briskType,
          briskType.position
        );
        // Encode Var Type
        return _encodeBriskType(
          rawProgram,
          typeData,
          properties,
          returnFunctionSignature,
          returnEmpty
        );
      }
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
        else return BriskError(rawProgram, BriskErrorType.CompilerError, [], briskType.position);
      // TODO: TypeUnionLiteral
      // TODO: ArrayTypeLiteral
      case NodeType.ParenthesisTypeLiteral:
        return _encodeBriskType(
          rawProgram,
          briskType.value,
          properties,
          returnFunctionSignature,
          true
        );
      case NodeType.FunctionSignatureLiteral:
        return Expressions.i32_ConstExpression(0);
      // TODO: InterfaceLiteral
      case NodeType.TypeUsage: {
        // Get Var Type
        const typeData = getTypeVar(
          rawProgram,
          properties._types,
          properties._typeStack,
          properties._typeStacks,
          briskType,
          briskType.position
        );
        // Encode Var Type
        return _encodeBriskType(
          rawProgram,
          typeData,
          properties,
          returnFunctionSignature,
          returnEmpty
        );
      }
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
type generableNode = Exclude<Node, ProgramNode | ParameterNode | ArgumentsNode>;
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

    wasmFunction,
  } = properties;
  const encodeBriskType = (
    briskType: TypeLiteral,
    returnFunctionSignature: boolean,
    returnEmpty = false
  ) => {
    return _encodeBriskType(
      rawProgram,
      briskType,
      properties,
      returnFunctionSignature,
      returnEmpty
    );
  };
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
          _varStacks: [..._varStacks, _varStack],
          _typeStacks: [..._typeStacks, _typeStack],

          _varStack: node.data._varStack,
          _typeStack: node.data._typeStack,
        });
      });
      // Return Expression
      return body.flat();
    }
    // TODO: Handle Import Statement
    case NodeType.WasmImportStatement: {
      // TODO: Handle Destructuring
      // Compile Type
      wasmModule = addType(wasmModule, encodeBriskType(node.typeSignature, true));
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
        wasmModule = addElement(wasmModule, [wasmModule.functionSection.length - 1]);
        // Add The Global
        wasmModule = addGlobal(
          wasmModule,
          `${node.variable.name}${node.variable.reference!}`,
          true,
          encodeBriskType(node.typeSignature, false),
          encodeBriskType(node.typeSignature, false, true)
        );
        // Return A Function Reference
        // TODO: This is a terrible way to determine the function index
        return Expressions.global_SetExpression(
          `${node.variable.name}${node.variable.reference!}`,
          Expressions.i32_ConstExpression(wasmModule.functionSection.length - 1)
        );
      }
      // Return Blank Statement
      return [];
    }
    // TODO: Handle WasmImportStatement
    // TODO: Handle ExportStatement
    case NodeType.DeclarationStatement: {
      // TODO: Handle Variable Destructuring
      // Get The Variable Information
      const stackReference = node.name.reference!;
      const varData = _variables.get(stackReference)!;
      if (varData.global) {
        wasmModule = addGlobal(
          wasmModule,
          `${varData.name}${stackReference}`,
          true,
          encodeBriskType(varData.type, false),
          encodeBriskType(varData.type, false, true)
        );
        // Assign To A Wasm Global
        return Expressions.global_SetExpression(
          `${varData.name}${stackReference}`,
          _generateCode(node.value, { selfReference: stackReference })
        );
      } else {
        addLocal(wasmFunction, [
          encodeBriskType(varData.type, false, false),
          `${varData.name}${stackReference}`,
        ]);
        // Return The Set Expression
        return Expressions.local_SetExpression(
          `${varData.name}${stackReference}`,
          _generateCode(node.value, { selfReference: stackReference })
        );
      }
    }
    case NodeType.AssignmentStatement: {
      // Get The Variable Information
      if (node.name.nodeType != NodeType.MemberAccess) {
        const stackReference = node.name.reference!;
        const varData = _variables.get(stackReference)!;
        if (varData.global) {
          // Assign To A Wasm Global
          return Expressions.global_SetExpression(
            `${varData.name}${stackReference}`,
            _generateCode(node.value, { selfReference: stackReference })
          );
        } else {
          // Return The Set Expression
          return Expressions.local_SetExpression(
            `${varData.name}${stackReference}`,
            _generateCode(node.value, { selfReference: stackReference })
          );
        }
      } else {
        // TODO: Handle Member Access
        return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
    }
    case NodeType.ReturnStatement:
      if (node.returnValue != undefined)
        return Expressions.returnExpression(_generateCode(node.returnValue));
      // Otherwise Return Void
      else return Expressions.returnExpression(Expressions.i32_ConstExpression(brisk_Void_Value));
    case NodeType.PostFixStatement: {
      // Get The Variable Information
      if (node.name.nodeType != NodeType.MemberAccess) {
        const varData = _variables.get(node.name.reference!)!;
        // Build Get Expression
        const val: UnresolvedBytes = varData.global
          ? Expressions.global_GetExpression(`${varData.name}${varData.reference}`)
          : Expressions.local_GetExpression(`${varData.name}${varData.reference}`);
        // Build Add Expression
        let add: UnresolvedBytes;
        // Handle Stack Types
        const exprAType = varData.type;
        if (exprAType.nodeType == NodeType.TypePrimLiteral) {
          // Handle Stack Types
          if (node.operator == PostFixOperator.Increment) {
            if (exprAType.name == 'i32' || exprAType.name == 'u32')
              add = Expressions.i32_AddExpression(val, Expressions.i32_ConstExpression(1));
            else if (exprAType.name == 'i64' || exprAType.name == 'u64')
              add = Expressions.i64_AddExpression(val, Expressions.i64_ConstExpression(1));
            else if (exprAType.name == 'f32')
              add = Expressions.f32_AddExpression(val, Expressions.f32_ConstExpression(1));
            else if (exprAType.name == 'f64')
              add = Expressions.f64_AddExpression(val, Expressions.f64_ConstExpression(1));
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
            if (exprAType.name == 'i32' || exprAType.name == 'u32')
              add = Expressions.i32_SubExpression(val, Expressions.i32_ConstExpression(1));
            else if (exprAType.name == 'i64' || exprAType.name == 'u64')
              add = Expressions.i64_SubExpression(val, Expressions.i64_ConstExpression(1));
            else if (exprAType.name == 'f32')
              add = Expressions.f32_SubExpression(val, Expressions.f32_ConstExpression(1));
            else if (exprAType.name == 'f64')
              add = Expressions.f64_SubExpression(val, Expressions.f64_ConstExpression(1));
            else {
              // TODO: Handle Heap Types
              return BriskError(
                rawProgram,
                BriskErrorType.FeatureNotYetImplemented,
                [],
                node.position
              );
            }
          }
        } else {
          return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
        }
        // Build Set Expression
        if (varData.global) {
          // Assign To A Wasm Global
          return Expressions.global_SetExpression(`${varData.name}${varData.reference}`, add);
        } else {
          // Return The Set Expression
          return Expressions.local_SetExpression(`${varData.name}${varData.reference}`, add);
        }
      } else {
        // TODO: Handle Member Access
        return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
    }
    // TODO: Handle EnumDefinitionStatement
    // TODO: Handle EnumVariant
    case NodeType.ArithmeticExpression: {
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
      if (node.operator == ArithmeticExpressionOperator.ArithmeticAdd) {
        // Comparison
        if (exprAType.nodeType == NodeType.TypePrimLiteral) {
          // Handle Stack Types
          if (exprAType.name == 'i32' || exprAType.name == 'u32')
            return Expressions.i32_AddExpression(lhs, rhs);
          else if (exprAType.name == 'i64' || exprAType.name == 'u64')
            return Expressions.i64_AddExpression(lhs, rhs);
          else if (exprAType.name == 'f32') return Expressions.f32_AddExpression(lhs, rhs);
          else if (exprAType.name == 'f64') return Expressions.f64_AddExpression(lhs, rhs);
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
    // TODO: Handle UnaryExpression
    case NodeType.ParenthesisExpression:
      return _generateCode(node.value);
    // TODO: Handle TypeCastExpression
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
      wasmModule = addType(wasmModule, encodeBriskType(funcType, true));
      // Get The TypeRef
      const functionSignature = wasmModule.typeSection.length - 1; // The Type is the last type
      // Return The Call
      const funcCall = Expressions.call_indirect(
        _generateCode(node.callee),
        node.args.map((arg) => _generateCode(arg)),
        functionSignature
      );
      if (node.statement) return Expressions.dropExpression(funcCall);
      else return funcCall;
    }
    case NodeType.WasmCallExpression: {
      return mapExpression(rawProgram, node, _generateCode);
    }
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
      // Handle Parameters
      // TODO: Handle Destructuring Parameters
      // Build The Function
      let func = createFunction(
        properties.selfReference != undefined
          ? _variables.get(properties.selfReference)!.name
          : `AmbiguousFunction${wasmModule.functionSection.length}`,
        encodeBriskType(
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
        []
      );
      // Compile Body
      const body: UnresolvedBytes[] = [];
      const compiledBody = _generateCode(node.body, {
        _closure: node.data._closure,
        _varStacks: [..._varStacks, _varStack],
        _typeStacks: [..._typeStacks, _typeStack],

        _varStack: node.data._varStack,
        _typeStack: node.data._typeStack,

        wasmFunction: func,
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
        if (node.body.nodeType == NodeType.BlockStatement) body.push(compiledBody);
        else body.push(Expressions.returnExpression(compiledBody));
      }
      func = setBody(func, body);
      // Add The Function To The Module
      wasmModule = addFunction(wasmModule, func);
      // Add The Function To The Function Table
      // Function index can be determined by the length of the functionSection
      wasmModule = addElement(wasmModule, [wasmModule.functionSection.length - 1]);
      // Return A Function Reference
      // TODO: This is a terrible way to determine the function index
      return Expressions.i32_ConstExpression(wasmModule.functionSection.length - 1);
    }
    // TODO: Handle ArrayLiteral
    // TODO: Handle ObjectLiteral
    // TODO: Handle ObjectField
    // TODO: Handle ValueSpread
    case NodeType.TypeAliasDefinition:
    case NodeType.InterfaceDefinition:
      return []; // Return A Blank Op
    // TODO: Handle TypePrimLiteral
    // TODO: Handle TypeUnionLiteral
    // TODO: Handle ArrayTypeLiteral
    // TODO: Handle ParenthesisTypeLiteral
    // TODO: Handle FunctionSignatureLiteral
    // TODO: Handle InterfaceLiteral
    // TODO: Handle InterfaceField
    // TODO: Handle TypeUsage
    // TODO: Handle GenericType
    case NodeType.VariableUsage: {
      const varData = _variables.get(
        getVarReference(rawProgram, _varStack, _varStacks, node, node.position)
      )!;
      if (varData.global) {
        return Expressions.global_GetExpression(`${node.name}${varData.reference}`);
      } else return Expressions.local_GetExpression(`${node.name}${varData.reference}`);
    }
    // TODO: Handle MemberAccess
    // TODO: Handle PropertyUsage
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
  // Create Function
  let func = createFunction('main', Types.createFunctionType([], []), [], [], []);
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

          wasmFunction: func,
        },
        undefined,
        node
      );
    })
  );
  // Set Body Function
  func = setBody(func, body);
  // Add The Main Function
  module = addFunction(module, func);
  module = setStart(module, 'main');
  // Return The Compiled Module
  return compileModule(module);
};

export default generateCodeProgram;

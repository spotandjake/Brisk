// Imports
import {
  brisk_Void_Value,
  brisk_moduleFunctionOffset,
  brisk_moduleIdentifier,
  encodeBriskType,
  initializeBriskType,
} from './Helpers';
import { FunctionSignatureLiteralNode, NodeType, ProgramNode } from '../Types/ParseNodes';
import { UnresolvedBytes, WasmModule } from '../../wasmBuilder/Types/Nodes';
import { getExpressionType, typeEqual } from '../TypeChecker/Helpers';
import { createPrimType } from '../Helpers/typeBuilders';
import {
  addElement,
  addExport,
  addFunction,
  addGlobal,
  addImport,
  addMemory,
  addType,
  compileModule,
  createCustomSection,
  createFunctionImport,
  createGlobalImport,
  createModule,
  setStart,
} from '../../wasmBuilder/Build/WasmModule';
import { encodeString, unsignedLEB128 } from '../../wasmBuilder/Build/Utils';
import { CodeGenNode, CodeGenProperties } from '../Types/CodeGenNodes';
import { mapExpression } from './WasmInstructionMap';
import { addLocal, createFunction, setBody } from '../../wasmBuilder/Build/Function';
import { getVariable } from '../Helpers/Helpers';
import { WasmExternalKind, WasmTypes } from '../../wasmBuilder/Types/Nodes';
import * as Types from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
import { compileModuleSignature } from './BriskTypeSection';
import { BriskErrorType } from '../Errors/Errors';
import { BriskError } from '../Errors/Compiler';
// Helpers
const generateVariableName = (name: string, reference: number) => `${name}${reference}`;
// CodeGen
const generateCode = (
  // Code
  rawProgram: string,
  // wasmModule
  wasmModule: WasmModule,
  // Stacks
  properties: CodeGenProperties,
  node: CodeGenNode
): UnresolvedBytes => {
  const {
    // Our Global Variable And Type Pools
    _imports,
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
  const _generateCode = (
    childNode: CodeGenNode,
    props: Partial<CodeGenProperties> = properties
  ): UnresolvedBytes =>
    generateCode(rawProgram, wasmModule, { ...properties, ...props }, childNode);
  // Compile The Code
  switch (node.nodeType) {
    // Statements
    case NodeType.IfStatement: {
      // TODO: Returns from if statements dont seem to work
      // Compile Conditions
      const condition = _generateCode(node.condition);
      // Compile Paths
      const body = _generateCode(node.body);
      const alternative =
        node.alternative != undefined ? _generateCode(node.alternative) : undefined;
      // Return Expression
      return Expressions.ifExpression(
        Expressions.i32_eqExpression(condition, Expressions.i32_ConstExpression(1)),
        body,
        alternative
      );
    }
    case NodeType.WhileStatement: {
      // Compile Condition
      const condition = _generateCode(node.condition);
      // Compile Body
      const body = _generateCode(node.body);
      // Assemble Function
      return Expressions.blockExpression(undefined, [
        Expressions.loopExpression(undefined, [
          Expressions.br_IfExpression(Expressions.i32_eqzExpression(condition), 1),
          body,
          Expressions.brExpression(0),
        ]),
      ]);
    }
    case NodeType.BreakStatement: {
      // Assemble Function
      return Expressions.brExpression(node.depth + 2);
    }
    case NodeType.BreakIfStatement: {
      // Compile Condition
      const condition = _generateCode(node.condition);
      // Assemble Function
      return Expressions.br_IfExpression(condition, node.depth + 2);
    }
    case NodeType.ContinueStatement: {
      // Assemble Function
      return Expressions.brExpression(node.depth + 1);
    }
    case NodeType.ContinueIfStatement: {
      // Compile Condition
      const condition = _generateCode(node.condition);
      // Assemble Function
      return Expressions.br_IfExpression(condition, node.depth + 1);
    }
    case NodeType.FlagStatement:
      return [];
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
    case NodeType.ImportStatement: {
      // TODO: Allow Importing Types
      // TODO: Handle Import Objects
      if (!Array.isArray(node.variable)) {
        return BriskError(
          rawProgram,
          BriskErrorType.FeatureNotYetImplemented,
          [],
          node.variable.position
        );
      } else {
        node.variable = node.variable.map((label) => {
          const importType = encodeBriskType(
            rawProgram,
            properties,
            getVariable(_variables, label.variable).type
          );
          // Add The Import
          addImport(
            wasmModule,
            createGlobalImport(
              `${brisk_moduleIdentifier}${node.source.value}.wasm`,
              `${brisk_moduleIdentifier}${label.variable.name}`,
              generateVariableName(label.variable.name, label.variable.reference!),
              importType,
              false
            )
          );
          return label;
        });
      }
      // Return A Reference To The Import
      return []; // Return A Blank Expression
    }
    case NodeType.WasmImportStatement: {
      // TODO: Handle Destructuring
      // Compile Type
      const importType = encodeBriskType(rawProgram, properties, node.typeSignature, true);
      // Add The Function To The Table
      if (importType[0] == 0x60) {
        // Add Function Type
        const funcSignatureReference = addType(wasmModule, importType);
        // Add Import
        const reference = addImport(
          wasmModule,
          createFunctionImport(node.source.value, node.variable.name, funcSignatureReference)
        );
        // Add To The Function Table
        wasmModule = addElement(wasmModule, [reference]);
        // Add The Global
        addGlobal(
          wasmModule,
          `${node.variable.name}${node.variable.reference!}`,
          false,
          encodeBriskType(rawProgram, properties, node.typeSignature, false),
          Expressions.i32_ConstExpression(reference)
        );
      } else {
        // Must Be A Global Import
        addImport(
          wasmModule,
          createGlobalImport(
            node.source.value,
            node.variable.name,
            node.variable.name,
            importType,
            false
          )
        );
      }
      // Return Blank Statement
      return [];
    }
    case NodeType.ExportStatement: {
      // Generate Code For The Export
      const exportBytes = _generateCode(node.value);
      // Return The Code For The Export
      return exportBytes;
    }
    case NodeType.DeclarationStatement: {
      // TODO: Handle Variable Destructuring
      // Get The Variable Information
      const varData = getVariable(_variables, node.name);
      const name = generateVariableName(varData.name, varData.reference);
      if (varData.global) {
        // Add Global
        addGlobal(
          wasmModule,
          name,
          true,
          encodeBriskType(rawProgram, properties, varData.type),
          initializeBriskType(rawProgram, properties, varData.type)
        );
        // Assign To A Wasm Global
        return Expressions.global_SetExpression(
          name,
          _generateCode(node.value, { selfReference: varData.reference })
        );
      } else {
        addLocal(wasmFunction, [encodeBriskType(rawProgram, properties, varData.type), name]);
        // Return The Set Expression
        return Expressions.local_SetExpression(
          name,
          _generateCode(node.value, { selfReference: varData.reference })
        );
      }
    }
    case NodeType.AssignmentStatement: {
      if (node.operatorImage != '=') throw 'Unreachable';
      // Get The Variable Information
      if (node.name.nodeType != NodeType.MemberAccess) {
        const varData = getVariable(_variables, node.name);
        const name = generateVariableName(varData.name, varData.reference);
        const body = _generateCode(node.value, { selfReference: varData.reference });
        if (varData.global) {
          // Assign To A Wasm Global
          return Expressions.global_SetExpression(name, body);
        } else {
          // Return The Set Expression
          return Expressions.local_SetExpression(name, body);
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
    // TODO: Handle EnumDefinitionStatement
    // TODO: Handle EnumVariant
    case NodeType.InfixExpression:
    case NodeType.PostfixExpression:
    case NodeType.PrefixExpression:
      // TODO: Make This TypeSafe
      throw 'Unreachable';
    case NodeType.ParenthesisExpression:
      return _generateCode(node.value);
    // TODO: Handle TypeCastExpression
    case NodeType.CallExpression: {
      // Compile Build The Function Signature
      const funcType = <FunctionSignatureLiteralNode>(
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.callee)
      );
      // Return The Call
      const funcCall = Expressions.call_indirect(
        _generateCode(node.callee),
        node.args.map((arg) => _generateCode(arg)),
        addType(wasmModule, encodeBriskType(rawProgram, properties, funcType, true))
      );
      if (node.statement) return Expressions.dropExpression(funcCall);
      else return funcCall;
    }
    case NodeType.WasmCallExpression: {
      const outType = getExpressionType(
        rawProgram,
        _variables,
        _types,
        _typeStack,
        _typeStacks,
        node
      );
      const expr = mapExpression(rawProgram, node, _generateCode);
      if (
        node.statement &&
        !typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          outType,
          createPrimType(node.position, 'Void'),
          0
        )
      )
        return Expressions.dropExpression(expr);
      else return expr;
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
      return Expressions.f64_ConstExpression(node.value);
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
      if (node.data._closure.size != 0) {
        return BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
      // TODO: Handle Polymorphic Functions
      // Handle Parameters
      // TODO: Handle Destructuring Parameters
      // Build The Function
      let func = createFunction(
        properties.selfReference != undefined
          ? _variables.get(properties.selfReference)!.name
          : `AmbiguousFunction${wasmModule.functionSection.length}`,
        encodeBriskType(
          rawProgram,
          properties,
          getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node),
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
          0
        )
      ) {
        body.push(compiledBody);
        body.push(Expressions.returnExpression(Expressions.i32_ConstExpression(brisk_Void_Value)));
      } else {
        if (node.body.nodeType == NodeType.BlockStatement) {
          body.push(compiledBody);
          body.push(Expressions.unreachableExpression());
        } else body.push(Expressions.returnExpression(compiledBody));
      }
      func = setBody(func, body);
      // Add The Function To The Module
      wasmModule = addFunction(wasmModule, func);
      // Add The Function To The Function Table
      // Function index can be determined by the length of the functionSection
      wasmModule = addElement(wasmModule, [wasmModule.functionSection.length - 1]);
      // Return A Function Reference
      // TODO: This is a terrible way to determine the function index
      if (_imports.size != 0) {
        return Expressions.i32_AddExpression(
          Expressions.global_GetExpression(brisk_moduleFunctionOffset), // Add The Module Function Offset
          Expressions.i32_ConstExpression(wasmModule.functionSection.length - 1)
        );
      } else {
        return Expressions.i32_ConstExpression(wasmModule.functionSection.length - 1);
      }
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
    // TODO: Handle TypeUsage
    // TODO: Handle GenericType
    case NodeType.VariableUsage: {
      const varData = getVariable(_variables, node);
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
  let wasmModule = createModule();
  // TODO: Handle Compiling Type Information For Exports
  // Module SetUp
  wasmModule = addMemory(wasmModule, Types.createMemoryType(1)); // The Module Memory
  // Create Function
  let func = createFunction('_start', Types.createFunctionType([], []), [], [], []);
  // Build The Body
  const body: UnresolvedBytes[] = [];
  body.push(
    ...program.body.map((node) => {
      return generateCode(
        rawProgram,
        wasmModule,
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
          loopDepth: program.data.loopDepth,
          wasmFunction: func,
        },
        node
      );
    })
  );
  // Add Exports
  for (const [name, moduleExport] of program.data._exports) {
    // Add Export
    wasmModule = addExport(
      wasmModule,
      `${brisk_moduleIdentifier}${name}`,
      WasmExternalKind.global,
      generateVariableName(moduleExport.name, moduleExport.reference!)
    );
  }
  // Add Section
  wasmModule = createCustomSection(
    wasmModule,
    compileModuleSignature(rawProgram, program.data._exports, program.data._imports)
  );
  // Set Body Function
  func = setBody(func, body);
  // Add The Main Function
  wasmModule = addFunction(wasmModule, func);
  wasmModule = setStart(wasmModule, '_start');
  // wasmModule = addExport(wasmModule, '_start', WasmExternalKind.function, '_start');
  wasmModule = addExport(wasmModule, 'memory', WasmExternalKind.memory, 0);
  const moduleFunctionOffset = addGlobal(
    // The Table Offset For Use In Linking
    wasmModule,
    brisk_moduleFunctionOffset,
    false,
    Types.createNumericType(WasmTypes.WasmI32),
    Expressions.i32_ConstExpression(0)
  );
  // Compile LinkingInfo Section
  wasmModule = createCustomSection(wasmModule, [
    // Custom Section Id
    ...encodeString('LinkingInfo'),
    // importIdentifier
    ...encodeString('$Brisk$'),
    // functionOffsetGlobal
    ...unsignedLEB128(moduleFunctionOffset),
    // References
    ...unsignedLEB128(wasmModule.codeReferences.length),
    ...wasmModule.codeReferences
      .map((ref) => {
        const [funcRefs, typeRefs, globalRefs] = ref;
        // Encode
        return [
          ...unsignedLEB128(funcRefs.length),
          ...funcRefs
            .map((funcRef) => {
              return unsignedLEB128(funcRef);
            })
            .flat(),
          ...unsignedLEB128(typeRefs.length),
          ...typeRefs
            .map((typeRef) => {
              return unsignedLEB128(typeRef);
            })
            .flat(),
          ...unsignedLEB128(globalRefs.length),
          ...globalRefs
            .map((globalRef) => {
              return unsignedLEB128(globalRef);
            })
            .flat(),
        ];
      })
      .flat(),
  ]);
  // Return The Compiled Module
  return compileModule(wasmModule, program.name);
};

export default generateCodeProgram;

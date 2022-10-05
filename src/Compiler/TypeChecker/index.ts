import Node, {
  EnumVariantNode,
  GenericTypeNode,
  NodeCategory,
  NodeType,
  ProgramNode,
  TypeLiteral,
  UnaryExpressionOperator,
  ComparisonExpressionOperator,
} from '../Types/ParseNodes';
import { ExportMap, VariableData } from '../Types/AnalyzerNodes';
import { TypeCheckProperties } from 'Compiler/Types/TypeNodes';
import { mapExpression } from './WasmTypes';
import { createPrimType, createUnionType } from '../Helpers/typeBuilders';
import { BriskError, BriskSyntaxError, BriskTypeError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
import { getExpressionType, nameType, resolveType, typeCompatible, typeEqual } from './Helpers';

import { getVariable, setType, setVariable } from '../Helpers/Helpers';
// TODO: Implement Type Narrowing
// TODO: Implement Values As Types
// TODO: Support Wasm Interface Types
// TypeCheck Node
const typeCheckNode = <T extends Exclude<Node, ProgramNode>>(
  // Code
  rawProgram: string,
  // ImportData
  importData: Map<string, ExportMap>,
  // Stacks
  properties: TypeCheckProperties,
  // Nodes
  node: T
): T => {
  const {
    // Our Global Variable And Type Pools
    // _imports,
    _exports,
    _variables,
    _types,
    // ParentStacks
    _varStacks,
    _typeStacks,
    // Stacks
    _varStack,
    _typeStack,
    // TypeChecking Information
    _returnType,
  } = properties;
  const _typeCheckNode = <_T extends Exclude<Node, ProgramNode>>(
    childNode: _T,
    props: Partial<TypeCheckProperties> = properties
  ): _T => typeCheckNode(rawProgram, importData, { ...properties, ...props }, childNode);
  // Match The Node For Analysis
  switch (node.nodeType) {
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
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.condition),
        createPrimType(node.condition.position, 'Boolean')
      );
      // Analyze Body
      node.body = _typeCheckNode(node.body);
      // Analyze Alternative
      if (node.alternative) node.alternative = _typeCheckNode(node.alternative);
      return node;
    case NodeType.WhileStatement:
      // Analyze Condition
      node.condition = _typeCheckNode(node.condition);
      // TypeCheck Condition
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.condition),
        createPrimType(node.condition.position, 'Boolean')
      );
      // Analyze Body
      node.body = _typeCheckNode(node.body);
      return node;
    case NodeType.BreakStatement:
      return node;
    case NodeType.BreakIfStatement:
      // Analyze Condition
      node.condition = _typeCheckNode(node.condition);
      // TypeCheck Condition
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.condition),
        createPrimType(node.condition.position, 'Boolean')
      );
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
            _types,
            _typeStack,
            _typeStacks,
            node.args.args[1]
          ),
          createPrimType(node.args.args[1].position, 'Number')
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
    case NodeType.ImportStatement: {
      // TODO: Make it so a destructure imports everything and a name imports it as an object
      // Get The Export Name
      const moduleMap = importData.get(node.source.value);
      if (moduleMap == undefined)
        return BriskError(rawProgram, BriskErrorType.CompilerError, [], node.position);
      const exportData = moduleMap.get(node.variable.name);
      if (exportData == undefined)
        return BriskError(rawProgram, BriskErrorType.CompilerError, [], node.position);
      // TODO: Allow Importing Types
      // Set Variable Type
      setVariable(_variables, node.variable, {
        type: exportData.baseType,
        baseType: exportData.baseType,
        global: true,
      });
      // Return Node
      return node;
    }
    case NodeType.WasmImportStatement:
      // Analyze Type
      node.typeSignature = _typeCheckNode(node.typeSignature);
      // Set Variable
      setVariable(_variables, node.variable, {
        type: node.typeSignature,
        baseType: resolveType(rawProgram, _types, _typeStack, _typeStacks, node.typeSignature),
      });
      return node;
    case NodeType.ExportStatement: {
      // TypeCheck Value
      node.value == _typeCheckNode(node.value);
      // Add Export
      const setExport = (exportName: string, exportValue: VariableData): void => {
        // Set The Export
        _exports.set(exportName, exportValue);
      };
      // Handle Export Data
      switch (node.value.nodeType) {
        // TODO: Handle All Export Types
        case NodeType.DeclarationStatement: {
          // TODO: Disallow Destructuring Here
          // Set Var Data
          setVariable(_variables, node.value.name, { global: true, used: true });
          // Handle Adding Export Information
          const varData = getVariable(_variables, node.value.name);
          setExport(varData.name, varData);
          break;
        }
        case NodeType.VariableUsage: {
          /// Set Var Data
          setVariable(_variables, node.value, { global: true, used: true });
          // Handle Adding Export Information
          const varData = getVariable(_variables, node.value);
          setExport(varData.name, varData);
          break;
        }
        // case NodeType.ObjectLiteral:
        //   break;
        // case NodeType.EnumDefinitionStatement:
        //   break;
        // case NodeType.TypeAliasDefinition:
        //   break;
        // case NodeType.InterfaceDefinition:
        //   break;
        default:
          BriskError(rawProgram, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      }
      // // TypeCheck Object Literal
      // if (node.value.nodeType == NodeType.ObjectLiteral) {
      //   // Add Fields To Export
      //   for (const field of node.value.fields) {
      //     if (field.nodeType == NodeType.ValueSpread) {
      //       // A Value Spread Will Be Caught At Analysis And Should Never Make It Here
      //       BriskError(rawProgram, BriskErrorType.CompilerError, [], field.position);
      //     } else {
      //       // Update The Export Info
      //       _exports.set(field.name, {
      //         name: field.name,
      //         value: field.fieldValue,
      //         typeExport: false,
      //         valueExport: true,
      //       });
      //     }
      //   }
      //   return node;
      // } else if (
      //   node.value.nodeType == NodeType.InterfaceDefinition ||
      //   node.value.nodeType == NodeType.EnumDefinitionStatement ||
      //   node.value.nodeType == NodeType.TypeAliasDefinition
      // ) {
      //   // Set Exported
      //   _exports.set(node.value.name, {
      //     name: node.value.name,
      //     value: <TypeUsageNode>{
      //       nodeType: NodeType.TypeUsage,
      //       category: NodeCategory.Type,
      //       name: node.value.name,
      //       reference: node.value.reference,
      //       position: node.position,
      //     },
      //     typeExport: true,
      //     valueExport: node.value.nodeType == NodeType.EnumDefinitionStatement,
      //   });
      // } else {
      //   // TODO: Ensure YOu Cannot Export const { a, b}
      //   // Regular Export
      //   const varData = getVariable(
      //     _variables,
      //     node.value.nodeType == NodeType.DeclarationStatement ? node.value.name : node.value
      //   );
      //   // Set Exported
      //   _exports.set(varData.name, {
      //     name: varData.name,
      //     value: <VariableUsageNode>{
      //       nodeType: NodeType.VariableUsage,
      //       category: NodeCategory.Variable,
      //       name: varData.name,
      //       reference: varData.reference,
      //       position: node.position,
      //     },
      //     typeExport: false,
      //     valueExport: true,
      //   });
      // }
      return node;
    }
    case NodeType.DeclarationStatement:
      // TODO: Handle TypeValidation Of Destructured Declarations
      // Set Type
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
            _types,
            _typeStack,
            _typeStacks,
            node.value
          );
        }
      } else if (node.varType.nodeType == NodeType.ArrayTypeLiteral) {
        // Infer Array Type
        if (node.varType.length == undefined) {
          if (
            node.value.nodeType == NodeType.ArrayLiteral &&
            !node.value.elements.some((e) => e.nodeType == NodeType.ValueSpread)
          ) {
            node.varType.length = {
              nodeType: NodeType.NumberLiteral,
              category: NodeCategory.Literal,
              value: node.value.length,
              position: node.varType.position,
            };
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
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.value)
      );
      // Set Variable Type To Be More Accurate
      setVariable(_variables, node.name, {
        type: node.varType,
        baseType: resolveType(rawProgram, _types, _typeStack, _typeStacks, node.varType),
      });
      // Analyze Value
      node.value = _typeCheckNode(node.value);
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
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.value)
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
    case NodeType.ReturnStatement: {
      // Deal With Invalid Returns
      if (_returnType == undefined) {
        return BriskSyntaxError(
          rawProgram,
          BriskErrorType.ReturnStatementsOnlyValidInsideFunction,
          [],
          node.position
        );
      }
      // Analyze Value
      if (node.returnValue) node.returnValue = _typeCheckNode(node.returnValue);
      // Perform TypeChecking
      // Check If Return Type Is Void
      let returnValueType: TypeLiteral = createPrimType(node.position, 'Void');
      if (node.returnValue != undefined) {
        returnValueType = getExpressionType(
          rawProgram,
          _variables,
          _types,
          _typeStack,
          _typeStacks,
          node.returnValue
        );
      }
      // Type Check Return
      typeEqual(rawProgram, _types, _typeStack, _typeStacks, _returnType, returnValueType);
      return node;
    }
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
      setType(_types, node, { type: node });
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
    case NodeType.ArithmeticExpression:
      // Check That Types Are Numeric
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.lhs),
        createUnionType(
          node.lhs.position,
          createPrimType(node.lhs.position, 'f32'),
          createPrimType(node.lhs.position, 'f64'),
          createPrimType(node.lhs.position, 'i32'),
          createPrimType(node.lhs.position, 'i64'),
          createPrimType(node.lhs.position, 'u32'),
          createPrimType(node.lhs.position, 'u64'),
          createPrimType(node.lhs.position, 'Number')
        )
      );
    case NodeType.ComparisonExpression:
      // Check Both Type A And B Are The Same
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.lhs),
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.rhs)
      );
      // Check Individual
      if (node.opeartor == ComparisonExpressionOperator.ComparisonAnd || node.opeartor == ComparisonExpressionOperator.ComparisonOr)
        typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.lhs),
          createPrimType(node.position, 'Boolean')
        );
      // Return Node
      return node;
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
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.value)
      );
      // Return Node
      return node;
    case NodeType.UnaryExpression: {
      // Check What Operator Is Being Used
      let expectedType: TypeLiteral;
      if (node.operator == UnaryExpressionOperator.UnaryNot) {
        expectedType = createPrimType(node.position, 'Boolean');
      } else {
        // -, +
        expectedType = createUnionType(
          node.position,
          createPrimType(node.position, 'f32'),
          createPrimType(node.position, 'f64'),
          createPrimType(node.position, 'i32'),
          createPrimType(node.position, 'i64'),
          createPrimType(node.position, 'u32'),
          createPrimType(node.position, 'u64'),
          createPrimType(node.position, 'Number')
        );
      }
      typeEqual(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        expectedType,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.value)
      );
      return node;
    }
    case NodeType.ParenthesisExpression:
      node.value = _typeCheckNode(node.value);
      return node;
    case NodeType.CallExpression: {
      // Get Callee Type
      const calleeType = resolveType(
        rawProgram,
        _types,
        _typeStack,
        _typeStacks,
        getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.callee)
      );
      // Type Check Params
      node.args = node.args.map((arg) => {
        return _typeCheckNode(arg);
      });
      // Compare Types
      if (calleeType.nodeType != NodeType.FunctionSignatureLiteral) {
        // Ensure Callee Is A Function
        return BriskTypeError(
          rawProgram,
          BriskErrorType.TypeMisMatch,
          [
            'Function', // Get Callee Type
            nameType(rawProgram, _types, _typeStack, _typeStacks, calleeType),
          ],
          node.position
        );
      }
      if (node.args.length > calleeType.params.length) {
        // Ensure We Do Not Have Too Many Arguments Types
        // Ensure Callee Is A Function
        BriskTypeError(
          rawProgram,
          BriskErrorType.InvalidArgumentLength,
          [
            `${calleeType.params.length}`, // Get Callee Type
            `${node.args.length}`,
          ],
          node.position
        );
      }
      // Check Each Parameter
      const genericValues: Map<string, TypeLiteral> = new Map();
      for (const [index, param] of calleeType.params.entries()) {
        // Get Argument
        const arg = node.args[index];
        // Check If We Have Argument
        if (arg == undefined) {
          // Check If The Param Was Optional
          if (
            typeEqual(
              rawProgram,
              _types,
              _typeStack,
              _typeStacks,
              createPrimType(param.position, 'Void'),
              param,
              false
            )
          ) {
            break;
          } else {
            return BriskTypeError(
              rawProgram,
              BriskErrorType.InvalidArgumentLength,
              [
                `${calleeType.params.length}`, // Get Callee Type
                `${index}`,
              ],
              node.position
            );
          }
        }
        let argType: TypeLiteral = getExpressionType(
          rawProgram,
          _variables,
          _types,
          _typeStack,
          _typeStacks,
          arg
        );
        // Deal With Generics
        if (param.nodeType == NodeType.GenericType) {
          // Set Generic
          if (!genericValues.has(param.name)) {
            // Ensure Generic Type Works
            if (param.constraints != undefined)
              typeEqual(rawProgram, _types, _typeStack, _typeStacks, param.constraints, argType);
            // Set Generic Value
            genericValues.set(param.name, argType);
          }
          // get Generic Value
          argType = genericValues.get(param.name)!;
        }
        // Check That Types Are Same
        typeEqual(rawProgram, _types, _typeStack, _typeStacks, param, argType);
      }
      // Return Node
      return node;
    }
    case NodeType.WasmCallExpression: {
      // Split Path
      const exprType = mapExpression(rawProgram, node);
      if (node.args.length > exprType.params.length) {
        // Ensure We Do Not Have Too Many Arguments Types
        // Ensure Callee Is A Function
        BriskTypeError(
          rawProgram,
          BriskErrorType.InvalidArgumentLength,
          [
            `${exprType.params.length}`, // Get Callee Type
            `${node.args.length}`,
          ],
          node.position
        );
      }
      // Check Each Parameter
      const genericValues: Map<string, TypeLiteral> = new Map();
      for (const [index, param] of exprType.params.entries()) {
        // Get Argument
        const arg = node.args[index];
        // Check If We Have Argument
        if (arg == undefined) {
          // Check If The Param Was Optional
          if (
            typeEqual(
              rawProgram,
              _types,
              _typeStack,
              _typeStacks,
              createPrimType(param.position, 'Void'),
              param,
              false
            )
          ) {
            break;
          } else {
            return BriskTypeError(
              rawProgram,
              BriskErrorType.InvalidArgumentLength,
              [
                `${exprType.params.length}`, // Get Callee Type
                `${index}`,
              ],
              node.position
            );
          }
        }
        let argType: TypeLiteral = getExpressionType(
          rawProgram,
          _variables,
          _types,
          _typeStack,
          _typeStacks,
          arg
        );
        // Deal With Generics
        if (param.nodeType == NodeType.GenericType) {
          // Set Generic
          if (!genericValues.has(param.name)) {
            // Ensure Generic Type Works
            if (param.constraints != undefined)
              typeEqual(rawProgram, _types, _typeStack, _typeStacks, param.constraints, argType);
            // Set Generic Value
            genericValues.set(param.name, argType);
          }
          // get Generic Value
          argType = genericValues.get(param.name)!;
        }
        // Check That Types Are Same
        typeEqual(rawProgram, _types, _typeStack, _typeStacks, param, argType);
      }
      // Return Node
      return node;
    }
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
        // Type Information
        _returnType: node.returnType,
      });
      // Handle Validation Of Single Line Return
      if (node.body.nodeType != NodeType.BlockStatement) {
        /// Check If Type Is Not Void
        if (
          !typeEqual(
            rawProgram,
            _types,
            _typeStack,
            _typeStacks,
            node.returnType,
            createPrimType(node.position, 'Void'),
            false
          )
        ) {
          // Type Check Return
          typeEqual(
            rawProgram,
            _types,
            _typeStack,
            _typeStacks,
            node.returnType,
            getExpressionType(rawProgram, _variables, _types, _typeStack, _typeStacks, node.body)
          );
        }
      }
      // Verify We Return
      if (!node.data.pathReturns) {
        // Ensure That If We Don't Return Our ReturnType Is Void
        typeEqual(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          node.returnType,
          createPrimType(node.position, 'Void')
        );
      }
      // Return Node
      return node;
    case NodeType.ArrayLiteral:
      node.elements = node.elements.map((e) => {
        if (e.nodeType == NodeType.ValueSpread) {
          // Analyze Value
          e.value = _typeCheckNode(e.value);
          return e;
        }
        return _typeCheckNode(e);
      });
      return node;
    case NodeType.ObjectLiteral:
      // Analyze Fields
      node.fields = node.fields.map((field) => {
        if (field.nodeType == NodeType.ValueSpread) {
          field.value = _typeCheckNode(field.value);
        } else field.fieldValue = _typeCheckNode(field.fieldValue);
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
      setType(_types, node, { type: node.typeLiteral });
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
      setType(_types, node, node);
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
      // TODO: Handle Rest Syntax
      // Set Variable Type To Be More Accurate
      setVariable(_variables, node.name, {
        type: node.paramType,
        baseType: resolveType(rawProgram, _types, _typeStack, _typeStacks, node.paramType),
      });
      // Return Value
      return node;
  }
};
// Analyze Program
const typeCheckProgram = (
  rawProgram: string,
  program: ProgramNode,
  importData: Map<string, ExportMap>
): ProgramNode => {
  // Return The Node
  return {
    ...program,
    // Compile Body
    body: program.body.map((childNode) => {
      return typeCheckNode(
        rawProgram,
        importData,
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
          // TypeChecking Information
          _returnType: undefined,
        },
        childNode
      );
    }),
  };
};

export default typeCheckProgram;

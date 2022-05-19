// Imports
import Node, { NodeType, ProgramNode } from '../Types/ParseNodes';
import { AnalyzerProperties } from '../Types/AnalyzerNodes';
import { UnresolvedBytes, WasmModule } from '../../wasmBuilder/Types/Nodes';
import { addFunction, compileModule, createModule, setStart } from '../../wasmBuilder/Build/Module';
import { createFunction } from '../../wasmBuilder/Build/Function';
import { createFunctionType } from '../../wasmBuilder/Build/WasmTypes';
import * as Expressions from '../../wasmBuilder/Build/Expression';
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
  }
  // We should never get to here
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

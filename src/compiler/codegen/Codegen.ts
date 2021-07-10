// dependency's
import binaryen from 'binaryen';
import { RecurseTree, Stack } from '../Helpers/Helpers';
// type's
import {
  ParseTreeNode,
  Program
} from '../Grammar/Types';
// Compiler
const encoder = new TextEncoder();
class Compiler {
  private module: binaryen.Module = new binaryen.Module();

  compile(Node: Program) {
    const { module } = this;
    // Initiate our memory
    module.setMemory(1,-1,'memory',[]);
    // Add Runtime Linking
    // Compile
    this.compileToken(Node, new Stack());
    // Make our Function Table
    // module.addTable('functions', this.functions.length, -1);
    // module.addActiveElementSegment('functions', 'functions', this.functions, module.i32.const(0));
    module.autoDrop();
    return module.emitText();
  }
  compileToken(Node: ParseTreeNode, stack: Stack): any {
    const { module, functions } = this;
    console.log(Node);
    switch(Node.type) {
      case 'Program':
        break;
    }
  }
}
// codeGen
const CodeGen = (program: Program): string => {
  const compiler = new Compiler();
  const compiled = compiler.compile(program);
  // Code gen
  return compiled;
};
export default CodeGen;


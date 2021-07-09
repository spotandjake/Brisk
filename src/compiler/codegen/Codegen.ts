// dependency's
import binaryen from 'binaryen';
import { RecurseTree, Stack } from '../Helpers/Helpers';
// type's
import { Program } from '../Grammar/Types';
// codeGen
const CodeGen = (program: Program): string => {
  const module: binaryen.Module = new binaryen.Module();
  // Code gen
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  program = RecurseTree(program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    console.log(Node);
    return Node;
  });
  console.log(module.emitText());
  return module.emitText();
};

export default CodeGen;
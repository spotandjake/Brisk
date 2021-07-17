// Import Types
import { LinkedModule, Program, ParseTreeNode } from '../Grammar/Types';
// Imports libs
import { BriskError} from '../Helpers/Errors';
import { RecurseTree, Stack } from '../Helpers/Helpers';

const Linker = (
  program: Program,
  entry: boolean,
  dependencyTree: Map<string, LinkedModule>,
  ParseFile: (filename: string, entry:boolean, dependencyTree: Map<string, LinkedModule>) => Program
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  program = RecurseTree(program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case 'importStatement': {
        const { path:importPath, identifier } = Node;
        // resolve module
        const module = <LinkedModule>(
          dependencyTree.has(importPath) ?
            dependencyTree.get(importPath) :
            ParseFile(importPath, false, dependencyTree)
        );
        // Verify the module contains the import
        if (!module.exports.includes(identifier))
          BriskError(`Module: ${importPath} does not contain export ${identifier}`, Node.position);
        // Write module
        dependencyTree.set(
          importPath,
          {
            type: module.type,
            flags: module.flags,
            variables: module.variables,
            body: module.body,
            exports: module.exports,
            imports: module.imports,
            imported: module.imported ? [ ...module.imported, identifier ] : [ identifier ],
            position: module.position
          }
        );
        break;
      }
    }
    return Node;
  }, 2);
  // Only perform the module linking in the entry file
  if (entry) {
    // Mash the parseTrees together
    // loop over all dependency's
    // insert
    // {
    // module body
    // some sort of thing that allows me to use the functions outside of here
    // }
    // TODO: if a module requires another module then that modules functions wont be in scope necessarily
    // console.log(dependencyTree);
  }
  return program;
};

export default Linker;
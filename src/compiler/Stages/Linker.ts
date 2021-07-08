// Import Errors
import { BriskError} from '../Helpers/Errors';
// Import Types
import { LinkedModule, Program } from '../Grammar/Types';
// Imports libs
import { RecurseTree, Stack } from '../Helpers/Helpers';

const Linker = (
  program: Program,
  dependencyTree: Map<string, LinkedModule>,
  ParseFile: (filename: string, dependencyTree: Map<string, LinkedModule>) => Program
) => {
  const entry = dependencyTree.size == 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  program = RecurseTree(program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    switch (Node.type) {
      case 'importStatement': {
        const { path:importPath, identifier } = Node;
        // resolve module
        const module = <LinkedModule>(
          dependencyTree.has(importPath) ?
            dependencyTree.get(importPath) :
            ParseFile(importPath, dependencyTree)
        );
        // Verify the module contains the import
        if (!module.exports.includes(identifier))
          BriskError(
            `Module: ${importPath} does not contain export ${identifier}`,
            Node.position.file,
            Node.position
          );
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
    console.log(dependencyTree);
  }
  return program;
};

export default Linker;
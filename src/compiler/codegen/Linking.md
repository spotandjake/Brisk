# Linking
===============================================
1) Determine Imports / Exports
2) Exports
  1) Set A Global for each export
  2) In the code start set the value of the global
  3) export the global
3) Imports
  1) Recurse the imports to determine which files are needed, and which file imports which file
    1) Determine there are no cyclic dependencies
    2) order the imports by which one is imported first and then by dependents i.e (if a imports c and b and then c imports b, b is imported before c because c depends on b, c cannot depend on b because then you would have a cyclic dependency issue).
    3) make imports in the wasm file as such Brisk|Path|Import (think about this, i may wanna change this)
4) Linking occurs after codegen
  1) open the wasm file and determine the imports inline the code from the start of the file and inline the functions in the functions section, make sure to globalize the vars namespace.
  2) make sure all the exports are there and replace the imported vars with references to the globals in the file.
===============================================
# Implementing Procedure
===============================================
1) Implement Exports: done
2) Implement Imports: done
3) Implement linking
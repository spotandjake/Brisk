# Tomorrow
+ [ ] Start working on type system
+ [ ] + [ ] Improve Parser There are bugs
  + [ ] Fix Single line if statement
  + [ ] Fix Member Access Nodes / Implement them in analyzer and type checker
# Tasks
+ [ ] Lexer
  + [ ] Add support for different types of numbers
    + [ ] hex, oct, bin
+ [ ] Parser
  + [ ] Improve Type System
    + [ ] add enums
    + [ ] add interfaces
    + [ ] Type Casting
    + [ ] Type Definitions
      + [ ] union types
    + [ ] support recursive types
    + [ ] generics
  + [ ] Add Destructuring
  + [ ] Add Objects
  + [ ] Parser Error Messages
+ [ ] Analyzer
  + [x] Fix typing
  + [x] determine globals
  + [x] closures
  + [ ] Deal With MemberAccess
  + [ ] Parseliterals
  + [x] determine unused variables
  + [x] determine which vars are exported, this will make cogeneration a lot easier.
    + This will also allow us to make typefiles for compiled program so we can type imports
  + [x] add values to nodes
  + [ ] type analyzer, for analyzing type variables
+ [ ] TypeChecker
  + [ ] Determine function actual return type
  + [ ] Add TypeChecking For Imports
  + [ ] Add TypeChecking For Function Calls
  + [ ] Add Better TypeChecking On Wasm Calls
  + [ ] Complete Other TODO
  + [ ] Deal With MemberAccess
+ [ ] Compiler
+ [ ] lsp
  + [ ] Program to generate syntax highlighting from createToken

+ [ ] Write More Tests
  + [ ] Parser
  + [ ] Lexer
  + [ ] Analyzer
  + [ ] TypeChecker

+ [ ] Important todo
  + [ ] I dont think the analyzer or typechecker know how to deal with member access nodes
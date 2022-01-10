# Tomorrow
+ [ ] Program to generate syntax highlighting from createToken
+ [ ] Improve Parser There are bugs
  + [ ] New lines Between statements cause he rest not to parse
+ [ ] Fix Member Access Nodes / Implement them in analyzer and type checker
# TODO After We Built Everything Else
+ [ ] Tests
  + [ ] Way to generate parser test data
+ [ ] Lexer
  + [x] Add Wasm Stack Value Syntax
    + 1f
    + 1.0f
    + 1n
    + 2n
    + lowercase is 32 bit version uppercase is 64bit version
  + [ ] Add support for different types of numbers
    + [ ] hex, oct, bin
+ [ ] Parser
  + [ ] Add Destructuring
  + [ ] Add Objects
  + [ ] Add enums
  + [ ] add interfaces
  + [ ] add type casting
  + [ ] add type Definitions
    + [ ] union types
    + [ ] recursive types
  + [ ] Add generics
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

+ [ ] Write More Tests
  + [ ] Parser
  + [ ] Lexer
  + [ ] Analyzer
  + [ ] TypeChecker

+ [ ] Important todo
  + [ ] I dont think the analyzer or typechecker know how to deal with member access nodes
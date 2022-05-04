# Road Map
================================================================

# MVP
+ [x] Implement A Basic Lexer
  - Using Chevrotain Implement A 
+ [ ] Implement A Basic Parsing
  - Using Chevrotain Parser
  + [x] Functions
  + [x] Expressions
  + [x] Flags
  + [x] Literals
  + [x] Variables
  + [x] Wasm Call Statements
  + [x] Imports
  + [x] Type Casting
  + [x] Enums
  + [ ] Match Statements
  + [ ] Build Operator Definition Syntax Into The Language
+ [x] Implement A Powerful Analyzer
  + [x] Linking Flags With Nodes
    - List Of Flags
      - Inline
        - Inlines The Current Value In All Call Spots
      - Inline(n)
        - Same As Inline Where N Is The Max Number Of Inlines Before We Stop Inlining this is useful if you want to manage executable size while not losing performance
      - Runtime
        - This is unknown at the moment
  + [x] Path Analysis
    + [x] We Need this because we need to be able in the typechecker to make sure that all paths lead to a return statement
    + [x] This Also Tells Us Which Code Is Dead
  + [x] Variable Aliasing
  + [x] Closure Analysis
  + [x] No Modifying Immutable Data
  + [x] Ensure That The Function Type Is Only Used Directly When The Function Type Can Be Inferred
  + [x] Create Type Stack
+ [x] Implement A Powerful TypeChecker
  + [x] Check Types Match
  + [x] Ensure All Code Paths Lead To A Return
  + [x] Ensure Types Are Valid
+ [ ] Implement A Powerful Compiler
  + [ ] Generate IR
  + [ ] Compile To Wasm
  + [ ] Compile To Wat
    + [ ] We Want Explanation Comments In Here
+ [ ] Implement A Linker
  + [ ] We Need Some Way To Get Type Information For Imports In The TypeChecker
  + [ ] We Need To Get A Dependency Tree Before Analyzing
  + [ ] We Need To Link The Code
+ [ ] Implement A Wasm Optimizer
  + [ ] Convert Call Indirect Into Direct Calls
  + [ ] Perform Compile Time Optimizations Such As Adding
  + [ ] Remove Any Dead Code
  + [ ] Inline Code
  + [ ] Constant Propagation
  + [ ] Convert Calls To Linear Memory To Stack Propagated Values
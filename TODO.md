# Current
+ [ ] Tasks For Thursday
  + [ ] Remove Semantic Meaning Of WhiteSpaces
    + [ ] Create A Test where we parse with whitespace and without whitespace and verify the output is the same
  + [ ] Check Function Type Matches Function Returns
  + [ ] Implement Return As A Keyword
  + [ ] Order Of Operations / Operator Precedence
  + [ ] Analyzer Verification Of Literals
    + [ ] Check That Numbers are within bounds
  + [ ] New Top Level statement type that includes things imports and exports so they cannot physically go in deeper code
    + [ ] Import
    + [ ] Export
  + [ ] resolve Grammar Ambiguities
    + [ ] Object vs Block Statement
    + [ ] FunctionSignature Vs ParenthesisTypeLiteral
    + [ ] Function Vs ParenthesisExpression
    + [ ] Fix Parenthesis Types
  + [ ] Generic Types
  + [ ] Adt Enums
+ [ ] Tasks For Friday
  + [ ] Reduce Complexity Of Possible Recursion in TypeChecker ResolveType and matchType
  + [ ] Reprogram Analyzer, Reduce Complexity Increase Safety
  + [ ] Improve Parser There are bugs
    + [ ] Fix Single line if statement
    + [ ] Fix Member Access Nodes / Implement them in analyzer and type checker
  + [ ] Allow Exporting Types
+ [ ] Tasks For Saturday
  + [ ] Start Writing Our Wasm Builder
  + [ ] Better Error Messages
  + [ ] Make Sure We Are Caught Up TO MVP Before we start codegen
  + [ ] Fuzzy Tests
  + [ ] Improve Tests
  + [ ] Fix `// TODO:`
+ [ ] Tasks For Sunday & Monday
  + [ ] Implement wasm multivalue types and syntax
    + [ ] Look Into Complexity of using multivalue to allocate things like objects on the stack.
  + [ ] Determine Syntax For Wasm Reference Types
  + [ ] Start CodeGen
    + [ ] Look into creating our own wasm ir using https://github.com/iden3/wasmbuilder/blob/master/src/codebuilder.js instead of using binaryen for raw codegen
+ [ ] Tasks for Tuesday
  + [ ] Look Into Writing Linker
    + [ ] Find Way To Parse Without Binaryen
    + [ ] Find Way To Compile Without Binaryen
    + [ ] Find Way To Optimize Without Binaryen
# General Tasks / Some Are Duplicated Of Above
+ [ ] Start working on type system
  + [ ] Refactor parser types into type literals and type 
    + [ ] ADT Enums
    + [ ] We need to add objects or else Member accesses are a little useless.
    + [ ] Fix Analyzing Of MemberAccesses
+ [ ] Recursive Types and data

# Tasks
+ [x] Lexer
+ [ ] Parser
  + [ ] Improve Type System
    + [ ] add enums
    + [ ] support recursive types
    + [ ] generics
  + [ ] Add Destructuring
  + [ ] Add Objects
+ [ ] Analyzer
  + [ ] Deal With MemberAccess
  + [ ] Parseliterals
    + This will also allow us to make typefiles for compiled program so we can type imports
+ [ ] TypeChecker
  + [ ] Determine function actual return type
  + [ ] Add TypeChecking For Imports
  + [ ] Add TypeChecking For Function Calls
  + [ ] Add Better TypeChecking On Wasm Calls
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

# Minimal Viable product
+ [ ] General
  + [ ] Simple Cli
    + [ ] Help
    + [ ] Compile
    + [ ] Run
  + [ ] Compiler
    + [x] Lexer
      + [x] Keywords
      + [x] Operators
      + [x] Numbers
      + [x] General
    + [ ] Parser
      + [ ] Literals
        + [x] Functions
        + [x] Constants
          + [x] Boolean
          + [x] Void
        + [ ] Strings
          + [x] General Strings
          + [ ] Code Points
          + [ ] Template Literals
        + [ ] Numbers
          + [x] Decimal Numbers
          + [x] Exponential
          + [x] Binary
          + [x] Octal
          + [x] HexaDecimal
          + [x] Numeric Separators
          + [ ] Rationals
            + [ ] i.e 1/2
        + [x] i32
          + [x] Decimal Numbers
          + [x] Binary
          + [x] Octal
          + [x] HexaDecimal
          + [x] Numeric Separators
        + [x] i64
          + [x] Decimal Numbers
          + [x] Binary
          + [x] Octal
          + [x] HexaDecimal
          + [x] Numeric Separators
        + [x] f32
          + [x] Decimal Numbers
          + [x] Binary
          + [x] Octal
          + [x] Numeric Separators
        + [x] f64
          + [x] Decimal Numbers
          + [x] Binary
          + [x] Octal
          + [x] Numeric Separators
        + [ ] Objects
        + [ ] Arrays
        + [ ] Wasm Interface Types Interaction
      + [ ] Types
        + [ ] Type Literals
          + [ ] Interfaces
            + [x] General Interface Parsing
            + [ ] Mutable Fields
          + [x] Type Variables
          + [ ] Generics
          + [ ] Parenthesis TypeLiterals
            + [x] General Syntax
            + [ ] Parsing
          + [x] Union Types
          + [x] Function Signatures
        + [x] Type Aliases
        + [x] Type Interfaces
        + [ ] Enums
          + [x] Decide On Adt Enums Or Regular Enums
          + [ ] Implement Syntax For ADT Enums
          + [ ] Implement Analysis For ADT Enums
          + [ ] Implement Type Checking For ADT Enums
      + [ ] Expressions
        + [ ] Fix Operator Precedence In Parsing
        + [ ] Comparisons
          + [x] Equal
          + [x] Not Equal
          + [ ] Less Then
          + [ ] Greater Then
          + [ ] Less Then Equal
          + [ ] Greater Then Equal
        + [x] Arithmetic
          + [x] Addition
          + [x] Subtraction
          + [x] Multiplication
          + [x] Division
        + [ ] Logical
          + [x] Not
          + [ ] And
          + [ ] Or
        + [x] Member Access
        + [x] Parenthesis Expression
        + [x] Function Call
      + [ ] Statements
        + [x] Declaration
        + [ ] Assignment
          + [x] Equal
          + [ ] PlusEqual
          + [ ] SubtractEqual
          + [ ] MultiplyEqual
          + [ ] DivideEqual
        + [ ] If Statement
          + [x] general Parsing
          + [x] Else
          + [ ] SingleLine If Statement
        + [ ] Match Statements
        + [ ] Expression Statement
          + [ ] Increment
          + [ ] Decrement
          + [x] Function Call
          + [x] Wasm Call Expression
      + [ ] We want to remove all newlines from the input and double check that we get the same output, i.e remove significance of newlines
    + [ ] Analyzer
      + [ ] Rewrite to be simpler and simplify Variable References
      + [x] Find closures
      + [x] Discover Unused Variables
      + [x] Type Stack
      + [x] Find Globals
      + [ ] Constant Propagation
      + [ ] Simplify Constants
      + [ ] Parse Literals
    + [ ] TypeChecker
      + [ ] Member Access Typing
      + [ ] Generics
      + [ ] Enums
      + [ ] Recursive Types
      + [ ] Imports
      + [ ] Check Function Type Matches Function Return
        + [ ] Determine That We Reach The Return As Well
      + [ ] Start Creating Type Guards
        + [ ] And Syntax For Creating Custom Type Guards
      + [x] Union Types
      + [x] Interfaces
      + [x] Type Aliases
    + [ ] Compiler
      + [ ] Compile Literals
      + [ ] Compile Time Type Information
      + [ ] Runtime Mode
        + [ ] No Garbage Collection
        + [ ] No closures
        + [ ] No Non Wasm Primitive's
  + [ ] Linker
    + [ ] Make Dependency Tree
    + [ ] Link Program
  + [ ] Runtime Globals
    + [ ] Malloc
    + [ ] GC
    + [ ] Standard Types
      + [ ] Array
      + [ ] Number
      + [ ] Object
      + [ ] Constants
      + [ ] Map
      + [ ] Option
      + [ ] Result
      + [ ] String
    + [ ] General
      + [ ] Print
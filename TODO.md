# Tomorrow
+ [ ] Start working on type system
  + [ ] Refactor parser types into type literals and type 
    + [ ] ADT Enums
    + [ ] We need to add objects or else Member accesses are a little useless.
    + [ ] Fix Analyzing Of MemberAccesses
    + [ ] Type Exports
+ [ ] Improve Parser There are bugs
  + [ ] Fix Single line if statement
  + [ ] Fix Member Access Nodes / Implement them in analyzer and type checker
+ [ ] New Top Level statement type that includes things imports and exports so they cannot physically go in deeper code
  + [ ] Import
  + [ ] Export
+ [ ] Recursive Types and data
+ [ ] resolve Grammar Ambiguities
  + [ ] Object vs Block Statement
  + [ ] FunctionSignature Vs ParenthesisTypeLiteral
  + [ ] Function Vs ParenthesisExpression
+ [ ] Implement Order Of Operations
+ [ ] Implement wasm multivalue types and syntax
+ [ ] Fix TypeChecker Errors, They display the error at the type definition instead of the actual error grounds
+ [ ] Reduce Complexity Of Possible Recursion in TypeChecker ResolveType and matchType
# Tasks
+ [ ] Lexer
  + [ ] Add support for different types of numbers
    + [ ] hex, oct, bin
+ [ ] Parser
  + [ ] Improve Type System
    + [ ] add enums
    + [ ] Type Definitions
      + [ ] union types
    + [ ] support recursive types
    + [ ] generics
  + [ ] Add Destructuring
  + [ ] Add Objects
  + [ ] Parser Error Messages
+ [ ] Analyzer
  + [ ] Deal With MemberAccess
  + [ ] Parseliterals
    + This will also allow us to make typefiles for compiled program so we can type imports
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

# Minimal Viable product
+ [ ] General
  + [ ] Simple Cli
    + [ ] Help
    + [ ] Compile
    + [ ] Run
  + [ ] Compiler
    + [ ] Lexer
      + [ ] Keywords
      + [ ] Operators
      + [ ] Numbers
      + [ ] General
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
          + [ ] Exponential
          + [ ] Binary
          + [ ] Octal
          + [ ] HexaDecimal
          + [ ] Numeric Separators
        + [ ] i32
          + [x] Decimal Numbers
          + [ ] Exponential
          + [ ] Binary
          + [ ] Octal
          + [ ] HexaDecimal
          + [ ] Numeric Separators
        + [ ] i64
          + [x] Decimal Numbers
          + [ ] Exponential
          + [ ] Binary
          + [ ] Octal
          + [ ] HexaDecimal
          + [ ] Numeric Separators
        + [ ] f32
          + [x] Decimal Numbers
          + [ ] Exponential
          + [ ] Binary
          + [ ] Octal
          + [ ] HexaDecimal
          + [ ] Numeric Separators
        + [ ] f64
          + [x] Decimal Numbers
          + [ ] Exponential
          + [ ] Binary
          + [ ] Octal
          + [ ] HexaDecimal
          + [ ] Numeric Separators
        + [ ] Objects
        + [ ] Arrays
      + [ ] Types
        + [ ] Type Literals
          + [ ] Interfaces
            + [x] General Interface Parsing
            + [ ] Mutable Fields
          + [ ] Type Variables
          + [ ] Generics
          + [ ] Enum Parenthesis
            + [x] General Syntax
            + [ ] Parsing
          + [x] Union Types
          + [x] Function Signatures
          + [ ] 
        + [x] Type Aliases
        + [x] Type Interfaces
        + [ ] Enums
          + [ ] Decide On Adt Enums Or Regular Enums
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
      + [ ] Simplify Constants
      + [ ] Constant Propagation
      + [ ] Parse Literals
    + [ ] TypeChecker
      + [ ] Member Access Typing
      + [ ] Generics
      + [ ] Enums
      + [ ] Recursive Types
      + [ ] Imports
      + [ ] Check Function Type Matches Function Return
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
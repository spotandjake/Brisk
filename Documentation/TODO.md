# Current
+ [ ] Tasks For Day 1
  + [x] Analyzer Additions
    + [x] Do Not Replace The Variables Names With There Numbers
  + [ ] Rewrite Type Checker And Analyzer
    + [ ] Things We Dont Have But We Need To Support
      + [x] Generics
        + [x] General Generics
        + [x] Implement Generics On Functions
      + [x] Member Access On Expression
      + [ ] Destructuring
    + [x] Restrict the Function type to Variable Definitions, Do not allow it on `Parameters` Allow it on returns too
      + [x] This is because on returns and Variable Definitions it is easy to Determine The Type From The Value in Types, Parameters and interfaces it is much harder to determine the actual type. Consider How Type Inferring Works And a system for determine the function type in a function
    + [x] Determine Scoping On Generics
      + [x] Generics Are Usually Scoped To Interfaces, Enums, Or Functions But I Need To Determine where the scope starts and ends
    + [ ] Add Support For Recursive Types
      + [x] Support For Recursive Types In The Analyzer
      + [ ] Support For Recursive Types In The TypeChecker
    + [ ] Perform Value Narrowing And Type Narrowing
    + [ ] Consider Values As Types
      + [ ] i.e you could create a type alias that allowed either 1n | 2n
      + [ ] This should make Enums simpler because then they are both values and types 
    + [x] Support Member Access Calls
    + [x] Reduce Complexity Of Both The TypeChecker And Analyzer
    + [x] We Do Not Want To Map The Variable Name To The Variable Reference Anymore
    + [x] Consider ADT Enums And Generic Types
    + [x] Implement Nicer Errors For This
    + [x] Allow Exporting Any Expression Or Type
    + [x] Allow For Mutable And Optional Fields
    + [x] Check That You Are Not Modifying A immutable Field
    + [x] Implement Export Analysis
    + [x] Implement Better Mutable Checking
  + [ ] Parser Additions
    + [x] Implement Generics
    + [ ] Implement Match Syntax
    + [x] Allow you to access members on general expressions
    + [ ] Implement Destructuring
    + [ ] Implement Array Literals
      + [ ] Implement Array Spread
      + [x] Implement Array Literal Syntax
      + [ ] Implement Array Index Syntax
    + [ ] Document Language Grammar
  + [x] Start Writing Our Wasm Builder
    + [x] Look into creating our own wasm ir using https://github.com/iden3/wasmbuilder/blob/master/src/codebuilder.js instead of using binaryen for raw codegen
+ [ ] Tasks For Day 2
  + [ ] Write New Tests Based On The Improvements To The Compiler
    + [ ] Unary Operators
    + [ ] Order Of Operations
    + [ ] Post Fix Operator Testing
    + [ ] Tests For Type Definitions And TypeChecker
    + [ ] Tests For Object Spread Syntax
    + [x] Analyze Arrays
  + [x] Better Error Messages
  + [ ] Make Sure We Are Caught Up TO MVP Before we start codegen
  + [ ] Start Writing CodeGen
+ [ ] Tasks For Day 3
  + [ ] Implement wasm multivalue types and syntax
    + [ ] Look Into Complexity of using multivalue to allocate things like objects on the stack.
  + [ ] Determine Syntax For Wasm Reference Types
+ [ ] Tasks for Day 4
  + [ ] Look Into Writing Linker
    + [ ] Find Way To Parse Without Binaryen
    + [ ] Find Way To Compile Without Binaryen
    + [ ] Find Way To Optimize Without Binaryen
+ [ ] Tasks For Day 5
  + [ ] Rewrite Grammar in ENBF
    + [ ] Consider Simplifying Grammar Based Off Of This new Optimal Form
  + [ ] Write A Basic LSP

# After We Have A Usable Languge
+ [ ] Port Comparison, And Expression Operators into brisk through a operator definition syntax.
+ [ ] Port `Number`, `String`, `Array` All into brisk we dont want these to need special compiler code.

# Tasks
+ [x] Lexer
+ [ ] Parser
  + [x] Improve Type System
    + [x] add enums
    + [x] support recursive types
    + [x] generics
  + [ ] Add Destructuring
  + [x] Add Objects
+ [x] Analyzer
  + [x] Deal With MemberAccess
  + [x] Parseliterals
    + This will also allow us to make typefiles for compiled program so we can type imports
+ [ ] TypeChecker
  + [x] Determine function actual return type
  + [ ] Add TypeChecking For Imports
  + [x] Add Better TypeChecking On Wasm Calls
  + [x] Deal With MemberAccess
+ [ ] Compiler
+ [ ] lsp
  + [ ] Program to generate syntax highlighting from createToken

+ [ ] Write More Tests
  + [ ] Parser
  + [ ] Lexer
  + [ ] Analyzer
  + [ ] TypeChecker

+ [x] Important todo
  + [x] I dont think the analyzer or typechecker know how to deal with member access nodes
+ [ ] Generate Syntax Highlighting
  + [ ] Switch The `TS` code Blocks for `br` code blocks in the docs

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
        + [x] Objects
        + [x] Arrays
        + [ ] Wasm Interface Types Interaction
      + [ ] Types
        + [ ] Type Literals
          + [x] Interfaces
            + [x] General Interface Parsing
            + [x] Mutable Fields
          + [x] Type Variables
          + [x] Generics
          + [x] Parenthesis TypeLiterals
          + [x] Union Types
          + [x] Function Signatures
        + [x] Type Aliases
        + [x] Type Interfaces
        + [ ] Enums
          + [x] Decide On Adt Enums Or Regular Enums
          + [x] Implement Syntax For ADT Enums
          + [x] Implement Analysis For ADT Enums
          + [ ] Implement Type Checking For ADT Enums
      + [ ] Expressions
        + [x] Fix Operator Precedence In Parsing
        + [x] Comparisons
          + [x] Equal
          + [x] Not Equal
          + [x] Less Then
          + [x] Greater Then
          + [x] Less Then Equal
          + [x] Greater Then Equal
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
        + [x] If Statement
          + [x] general Parsing
          + [x] Else
          + [x] SingleLine If Statement
        + [ ] Match Statements
        + [x] Expression Statement
          + [x] Increment
          + [x] Decrement
          + [x] Function Call
          + [x] Wasm Call Expression
      + [x] We want to remove all newlines from the input and double check that we get the same output, i.e remove significance of newlines
    + [x] Analyzer
      + [x] Rewrite to be simpler and simplify Variable References
      + [x] Find closures
      + [x] Discover Unused Variables
      + [x] Type Stack
      + [x] Find Globals
      + [x] Parse Literals
    + [ ] TypeChecker
      + [x] Member Access Typing
      + [x] Generics
      + [x] Enums
      + [ ] Recursive Types
      + [ ] Imports
      + [x] Check Function Type Matches Function Return
        + [x] Determine That We Reach The Return As Well
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


Look Into https://istanbul.js.org/
# Current
+ [ ] Tasks For Day 1
  + [x] Analyzer Additions
    + [x] Do Not Replace The Variables Names With There Numbers
  + [ ] Rewrite Type Checker And Analyzer
    + [ ] Things We Dont Have But We Need To Support
      + [ ] Generics
      + [x] Member Access On Expression
      + [ ] Destructuring
    + [ ] Restrict the Function type to Variable Definitions, Do not allow it on `Parameters` Allow it on returns too
      + [ ] This is because on returns and Variable Definitions it is easy to Determine The Type From The Value in Types, Parameters and interfaces it is much harder to determine the actual type. Consider How Type Inferring Works And a system for determine the function type in a function
    + [ ] Determine Scoping On Generics
      + [ ] Generics Are Usually Scoped To Interfaces, Enums, Or Functions But I Need To Determine where the scope starts and ends
    + [x] Add Support For Recursive Types
    + [ ] Perform Path Analysis That Can Be Used For Determining Dead Code And Return Paths
      + [ ] Perform Value Narrowing And Type Narrowing
    + [ ] Consider Values As Types
      + [ ] i.e you could create a type alias that allowed either 1n | 2n
      + [ ] This should make Enums simplier because then they are both values and types 
    + [ ] Support Member Access Calls
    + [ ] Reduce Complexity Of Both The TypeChecker And Analyzer
    + [x] We Do Not Want To Map The Variable Name To The Variable Reference Anymore
    + [x] Consider ADT Enums And Generic Types
    + [x] Implement Nicer Errors For This
    + [ ] Allow Exporting Any Expression Or Type
    + [x] Allow For Mutable And Optional Fields
    + [ ] Check That You Are Not Modifying A immutable Field
    + [x] Implement Export Analysis
    + [ ] Implement Better Mutable Checking
  + [ ] Parser Additions
    + [ ] Implement Generics
    + [ ] Implement Match Syntax
    + [x] Allow you to access members on general expressions
    + [ ] Allow u to define multiple variables off one `let` or `const` using `,`
    + [ ] Implement Destructuring
    + [ ] Implement Array Literals
      + [ ] Implement Array Spread
      + [ ] Implement Array Literal Syntax
      + [ ] Implement Array Index Syntax
    + [ ] Document Language Grammar
  + [ ] Start Writing Our Wasm Builder
    + [ ] Look into creating our own wasm ir using https://github.com/iden3/wasmbuilder/blob/master/src/codebuilder.js instead of using binaryen for raw codegen
+ [ ] Tasks For Day 2
  + [ ] Write New Tests Based On The Improvements To The Compiler
    + [ ] Unary Operators
    + [ ] Order Of Operations
    + [ ] Post Fix Operator Testing
    + [ ] Tests For Type Definitions And TypeChecker
    + [ ] Tests For Object Spread Syntax
    + [ ] Analyze Arrays
  + [x] Better Error Messages
  + [ ] Make Sure We Are Caught Up TO MVP Before we start codegen
  + [ ] Fix `// TODO:`
  + [ ] Start Writing CodeGen
    + [ ] Implement Support For Arbitrary Precision Numbers In Compiler
      + [ ] This is needed for proper compilation of things like i64, u64, f64 and The Number Type
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
  + [ ] Improve Type System
    + [x] add enums
    + [x] support recursive types
    + [ ] generics
  + [ ] Add Destructuring
  + [x] Add Objects
+ [ ] Analyzer
  + [x] Deal With MemberAccess
  + [ ] Parseliterals
    + This will also allow us to make typefiles for compiled program so we can type imports
+ [ ] TypeChecker
  + [ ] Determine function actual return type
  + [ ] Add TypeChecking For Imports
  + [ ] Add Better TypeChecking On Wasm Calls
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
        + [ ] Arrays
        + [ ] Wasm Interface Types Interaction
      + [ ] Types
        + [ ] Type Literals
          + [x] Interfaces
            + [x] General Interface Parsing
            + [x] Mutable Fields
          + [x] Type Variables
          + [ ] Generics
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
        + [ ] If Statement
          + [x] general Parsing
          + [x] Else
          + [x] SingleLine If Statement
        + [ ] Match Statements
        + [x] Expression Statement
          + [x] Increment
          + [x] Decrement
          + [x] Function Call
          + [x] Wasm Call Expression
      + [ ] We want to remove all newlines from the input and double check that we get the same output, i.e remove significance of newlines
    + [ ] Analyzer
      + [x] Rewrite to be simpler and simplify Variable References
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
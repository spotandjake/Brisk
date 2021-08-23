# Language Basics
----------------------------------------------------------------
## Overview
NextGen Brisk Documentation for compiler v2, will be implemented when we rewrite the compiler and modified as new criteria is realized when writing the first compiler.

## Program Structure
```diff
+├── src
-│   ├── Stdlib
-│   │   └── Print.br
-│   │   └── Math.br
-│   │   └── Http.br
+│   ├── Runtime
-│   │   ├── Memory.br
-│   │   ├── Garbage Collection.br
-│   │   └── Wasi.br
+│   ├── Compiler
+│   │   ├── Schemas
+│   │   │   └── BuildInfo.ts
-│   │   ├── Compiler
+│   │   │   ├── FrontEnd
+│   │   │   │   ├── Lexer
+│   │   │   │   │   ├── Lexer.ts
+│   │   │   │   │   └── Tokens.ts
+│   │   │   │   ├── Parser
-│   │   │   │   │   ├── Parser.ts
-│   │   │   │   │   └── Tokens.ts
+│   │   │   │   ├── Correctness
+│   │   │   │   │   ├── TypeChecker.ts
+│   │   │   │   │   └── Verifier.ts
-│   │   │   │   └── Analyzer.ts
+│   │   │   ├── Backend
+│   │   │   │   └── Compiler.ts
-│   │   │   └── Types.ts
+│   │   ├── Linker
+│   │   │   ├── Linker.ts
+│   │   │   └── Types.ts
+│   │   └── BriskIr
-│   │       ├── Program.ts
-│   │       ├── Expression.ts
+│   │       ├── Optimizer.ts
-│   │       └── Types.ts
+│   ├── Runner
+│   │   ├── wasi-polyfill.ts
+│   │   └── runner.ts
-│   ├── Brisk Package Manager
-│   │   ├── Server.br
-│   │   └── Client.br
-│   ├── Brisk Language Server
-│   │   ├── VsCode
-│   │   │   └── Client.ts
-│   │   ├── Vim
-│   │   |   └── Client.ts
-│   │   └── Server.br
+│   ├── tests
+│   │   ├── index.ts
+│   │   └── Suite
+│   │       ├── Data
+│   │       │   ├── Lexer-Data.ts
+│   │       │   ├── Parser-Data.ts
-│   │       │   ├── TypeChecker-Data.ts
-│   │       │   ├── Compiler-Data.ts
-│   │       │   ├── Linker-Data.ts
-│   │       │   └── BriskIr-Data.ts
+│   │       └── Tests
+│   │           ├── Lexer-Fail.ts
+│   │           ├── Lexer-Pass.ts
+│   │           ├── Parser-Fail.ts
+│   │           ├── Parser-Pass.ts
-│   │           ├── TypeChecker-Test.ts
-│   │           ├── Compiler-Test.ts
-│   │           ├── Linker-Test.ts
-│   │           └── BriskIr-Test.ts
+│   └── Brisk_Globals.ts
+├── Documentation
+│   ├── Content
+│   │   ├── Runtime
-│   │   │   ├── Memory.md
-│   │   │   ├── GC.md
-│   │   │   └── Numbers.md
+│   │   ├── Stdlib
-│   │   │   ├── Math.md
-│   │   │   ├── Http.md
-│   │   │   └── Print.md
+│   │   ├── Language
+│   │   │   ├── Syntax.md
+│   │   │   ├── Memory.md
+│   │   │   └── ABI.md
+│   │   ├── Compiler
+│   │   │   ├── Structure.md
+│   │   │   ├── Linking.md
-│   │   │   └── Brisk Ir.md
+│   │   ├── Package Manager
-│   │   │   └── Structure.md
+│   │   ├── Brisk Language Server
-│   │   │   └── Structure.md
+│   ├── Static
-│   │   ├── Assets
-│   │   │   └── favicon.ico
-│   │   ├── css
-│   │   │   ├── nav.css
-│   │   │   └── main.css
-│   │   └── Templates
-│   │       └── nav.tsx
-│   └── Server.br
+├── dist
+│   └── 
+├── node_modules
+│   └── 
+├── Tests
+│   └── 
+├── gulpfile.js
+├── package.json
+├── yarn.lock
+└── tsconfig.json
```
## Builtin Types

| Name     | Example                              | Description                  | Store Location |
|----------|--------------------------------------|------------------------------|----------------|
| Number   | let x: Number = 1;                   | Any Number                   | Heap           |
| Boolean  | let x: Boolean = true;               | A Boolean                    | Heap           |
| String   | let x: String = 'test';              | A String                     | Heap           |
| Function | let x: Function = (): Number => 1+1; | A First Class Brisk Function | Heap           |
| Void     |                                      | A Void Type                  | None           |
| i32      | let x: i32 = 1;                      | A 32-bit signed Integer      | Wasm Stack     |
| u32      | let x: u32 = 1;                      | A 32-bit unsigned Integer    | Wasm Stack     |
| i64      | let x: i64 = 1;                      | A 64-bit signed Integer      | Wasm Stack     |
| u64      | let x: u64 = 1;                      | A 64-bit unsigned Integer    | Wasm Stack     |
| f32      | let x: f32 = 1.1;                    | A 32-bit Float               | Wasm Stack     |
| f64      | let x: f64 = 1.1;                    | A 64-bit Float               | Wasm Stack     |

Heap Data is implemented in linear memory where as wasm stack values use plain wasm values, u21 is currently the default type used for pointers

## Still Needed
+ Some way to convert a primitive value to its pointer as a u32
+ List off builtin functions
  + Memory
  + Wasm Math
  + Atomics
  + Threading
  + Most wasm functions should be made available to brisk to allow us to implement as much of the language as possible in itself
+ Determine how type checking will work
  + Type Checking Inside A Single Module
  + Type Checking Cross Module
+ Determine what sort of optimizations we will use
  + Combining Stores
  + Constant Propagation
## Type Casting

```ts
let a: i32 = 1;
let x: Number = <Number>a;
```
In Brisk types are cast using `<T>`

## BuiltIn Functions

# Language Design
-----------------------
## Parser
look into using the [Glush](https://github.com/judofyr/glush) Parser tool to generate brisks new parser
## Compiler
Parse Brisk Program
Perform Type Checking
Inject imports for runtime
Compile Immidiatly to wasm and then perform optimizations on the wasm code, use a custom ir in front of binaryen until we replace binaryen this will allow us to quickly replace binaryen along with allow us to compile to different targets in the future as oposed to just wasm.
Perform Optimizations on the generatted wasm code
Link the wasm code

## TODO
1) Write A Form Of Brisk Ir, it can be built on top of binaryen for now but this will allow us to make the linker much smaller and will allow us to easily move away from binaryen in the future.
2) Rewrite the entry point of the compiler, move from v1 to v2.
3) Rewrite Linker, make it operate on wasm modules instead of a binaryen module being used as a parameter, this way it could be easily made into an external executable.
4) Rewrite the runner to have wasi-polyfills, then rewrite parts of the compiler to depend on wasi and not our host runtime.
5) Work on moving the memory table in the runner to a brisk module.
6) Write tests for more parts
7) Write a handwritten compiler move away from nearley
8) Reduce complexity of the project entirely
9) Move entirely to the brisk ir
10) Rewrite the typechecking so it can handle inference's and casting
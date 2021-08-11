# Language Basics
----------------------------------------------------------------
## Overview
NextGen Brisk Documentation for compiler v2, will be implemented when we rewrite the compiler and modified as new criteria is realized when writing the first compiler.
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
------------------------
## Compiler
Parse Brisk Program
Perform Type Checking
Inject imports for runtime
Compile Immidiatly to wasm and then perform optimizations on the wasm code, use a custom ir in front of binaryen until we replace binaryen this will allow us to quickly replace binaryen along with allow us to compile to different targets in the future as oposed to just wasm.
Perform Optimizations on the generatted wasm code
Link the wasm code
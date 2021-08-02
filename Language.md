# Language Basics
----------------------------------------------------------------
## Overview
Next Gen Brisk Documentation for compiler v2, this will be implemented when we rewrite the compiler and modified as new criteria is realized when writing the first compiler.
## Builtin Types

| Name     | Example                              | Description                  |
|----------|--------------------------------------|------------------------------|
| Number   | let x: Number = 1;                   | Any Number                   |
| Boolean  | let x: Boolean = true;               | A Boolean                    |
| String   | let x: String = 'test';              | A String                     |
| Function | let x: Function = (): Number => 1+1; | A First Class Brisk Function |
| Void     |                                      | A Void Type                  |
| i32      | let x: i32 = 1;                      | A 32-bit signed Integer      |
| u32      | let x: u32 = 1;                      | A 32-bit unsigned Integer    |
| i64      | let x: i64 = 1;                      | A 64-bit signed Integer      |
| u64      | let x: u64 = 1;                      | A 64-bit unsigned Integer    |
| f32      | let x: f32 = 1.1;                    | A 32-bit Float               |
| f64      | let x: f64 = 1.1;                    | A 64-bit Float               |

## Type Casting

```ts
let a: i32 = 1;
let x: Number = <Number>a;
```
In Brisk types are casted using `<T>`

## BuiltIn Functions
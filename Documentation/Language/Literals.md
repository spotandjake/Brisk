# Literals
================================================================

## Introductory
This Document Defines The Different Literals In Brisk, Goes Over The Syntax For Defining Them And Explains Where They Live And What They Are Used For.

## M.V.P(Minimal Viable Product)
### Wasm Stack Types
Wasm Stack Types Are Mainly Used In Low Level Code And Places Such As The Runtime, If You Want To DO Basic Math Please Use The `Number` Type.
#### i32
i32's are 32 bit integers used when working with the wasm level brisk statements. There Are Two Ways To Define An `i32` In Brisk Both Shown Below.
```ts
const data: i32 = 1n;
```
```ts
const data: i32 = @wasm.i32.const(1);
```
#### i64
i64's are 64 bit integers used when working with the wasm level brisk statements. There Are Two Ways To Define An `i64` In Brisk Both Shown Below.
```ts
const data: i64 = 1N;
```
```ts
const data: i64 = @wasm.i64.const(1);
```
#### u32
u32's are 32 bit unsigned integers used when working with the wasm level brisk statements.
```ts
const data: u32 = 1u;
```
#### u64
u64's are 64 bit unsigned integers used when working with the wasm level brisk statements.
```ts
const data: u64 = 1U;
```
#### f32
f32's are 32 bit floats used when working with the wasm level brisk statements. There Are Two Ways To Define An `f32` In Brisk Both Shown Below.
```ts
const data: f32 = 1f;
```
```ts
const data: f32 = @wasm.f32.const(1);
```
#### f64
f64's are 64 bit floats used when working with the wasm level brisk statements. There Are Two Ways To Define An `f64` In Brisk Both Shown Below.
```ts
const data: f64 = 1F;
```
```ts
const data: f64 = @wasm.f64.const(1);
```

### Functions
Brisk uses arrow functions, functions in brisk are first class so they can be passed as values.
```ts
const data = (x: i32): i32 => {
  return(1n);
};
```

### Constants
Brisk Constants Include Booleans And Void.
```ts
const trueValue: Boolean = true;
const falseValue: Boolean = false;
const voidValue: Void = void;
```
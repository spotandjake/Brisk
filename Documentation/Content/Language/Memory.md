# Brisk Memory Layout

## Built In Types
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

## Wasm Stack Types
wasm stack types in brisk are not something you should be using often they are used mainly in the stdlib and runtime, they are the basic wasm types they are the only values in brisk that are passed as values everything else in brisk is passed by reference.

## Brisk Pass by logic

In Brisk values outside of the wasm stack types are passed by reference, and any modifications to them affect the value, so even if you modify a value passed into a function from a parameter those changes will propagate to the actual value.
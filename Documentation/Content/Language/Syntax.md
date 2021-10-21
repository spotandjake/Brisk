# Syntax

### Import Statements
```ts
import { Name } from './file.br'; // Import individual components from a module
import Name from './file.br'; // Import a module as an object
import Name: (Number) => Void from 'env'; // import something from the host runtime
import Name: (Number) => Void from './test.wasm'; // import something from a wasm file this is best not used, unless you know what you are doing
```
Brisk lets you import files from not just brisk files but also from the host runtime and raw wasm binaries, imports in brisk are still a work in progress, imports in brisk call the start function on the first import and then from there you just import the components individually brisk files are linked statically at compile time allowing for better optimization and ahead of time error handling.

### Exports 
```ts
export identifier;
```
brisk exports allow u to export a component individually to be imported from another module.

### Declarations
```ts
let a: Number = 1;
```
currently brisk does not allow assignments only declarations, this will be changed in future versions, a brisk assignment must include a name, type and a value.

### Functions
```ts
let a: Function = (b: Function): Void => b();
let c: Function = (b: Function): Number => {
  b();
  return(1);
}
```
brisk functions are first class allowing you to pass them as values they also uses the Function type, they are defined like any other delcaration and must include a name, parameters if any, and a return type if your function is multiple lines you must include brackets if it is a simple expression you do not need to use brackets.

### Function Calls
```ts
a(1);
```
function calls in brisk are very simple, being the identifier parenthesis and any parameters.

### Type's
```ts
let a: i32 = 1;
let b: Number = 1;
let c: String = 'test';
let d: Number = <Number>a;
```
brisk is statically typed but it keeps it simple, values can be casted using <i32>1, types are inferred in function calls based on the parameters types, any type casted to the ptr type will return the values pointer as a wasm stack type unless you are casting an i32 in which case the compiler will throw an error.

### General
In brisk you can return a value from a function using the `return(value)`
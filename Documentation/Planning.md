# Brisk Planning

+ Planning Language
  + Syntax
    + Aliasing A Wasm Call `@Wasm.[Type].[Command](...Parameters)`
    + Lexer
      + Keywords (`const`, `let`, `import`, `from`, `wasm`,)
        + Variable Initializer
          + `const` Defines a constant variable that cannot be reassigned
          + `let` Defines a variable that can be reassigned
        + Variable
          + `Name` you will be able to just use the variable name.
          + `Name.Name` Too access properties of things like exports and stuff, It would make sense to have records which we export and then you can either destructure the export inline on import or access its property's later
        + Imports
          + `Import`, `from` used as `import Name from Location` allows you to import values from another module or even language
          + `export` used as `export Name` allows you to export a different value
          + `Import`, `wasm`, `from` used as `import wasm Name Type from Location` allows you to import external values from js
        + General Keywords
          + `if` If statements used for controlling branching based on logic
          + `else` Used alongside ***if*** Statements for the opposite branch
        + Values (`0`,`'a'`,`"string"`,`true`)
          + Number
          + String
            + Series of characters that starts and ends with `''`
            + Alternatively a sequence of characters starting and ending with ```
          + Constants
            + `true` or `false` or `void`
          + Deliminator (`{`,`}`,`[`,`]`, `(`, `)`, `,`,`;`, `:`, `=>`)
          + Operators (`*`, `+`, `==`, `=`, `&&`, `!`, `!=`, `||`, `-`)
          + Comments (`// This is a comment`)
  + Data Standard
    + Heap
      + String
      + Closure
    + Stack
      + Simple Number
        + Tag - 0bxx1
      + Pointer
        + Tag - 0b000
      + Char
        + Tag - 0b010
      + Reserved
        + Tag - 0b100
      + Constants
        + Tag - 0b110
    + Virtual
      + Function - This is virtual because it will act like a value syntactically but could be optimized out into function calls or closures in the compiler
  + Interface
    + Function Offset
      + The Function offset within the module set by the linker to allow us to continue todo Linking
    + Main
      + The Main Entry Function
  + Typing
    + Go through every node in the ast and give each value a type check if each use case matches the type of the value and the program makes sense
  + Features
  + How to call Wasm Native Stuff
    + You will do `@Wasm.[Type].[Command](...Parameters)` each of these will have to be individually typed

+ [ ] Writing The Language
  
  + [ ] Tooling
    + [ ] Commander - Handle cli for the moment
      + [ ] Arguments
        + [ ] `--wat` Compile to wat instead of wasm
        + [ ] `--no-optimize` Do Not Run Optimization
        + [ ] `--no-link` Do Not Link The Program
        + [ ] `--init` Initialize a new Brisk Project
        + [x] `-h` See Help Dialog
      + [ ] Commands
        + [x] `Brisk <file>` Compile and run the file
        + [ ] `Brisk compile <file>` Compile the file to Wasm
        + [ ] `Brisk run <file>` Run The Brisk File or Wasm file or wat file depending on the file extension
    + [x] Typescript - Preprocessor typed JavaScript is way better
    + [x] Chevrotain- Lexer & Parser
    + [ ] Binaryen - Compiler / Optimizer for Wasm
    + [ ] Project Directory Layout
      + [ ] `/src/` - Source Files
        + [ ] `/Schemas/`
          + [ ] `BriskBuildInfo.ts` - The File Schema For Generating Brisk Build Info Files
        + [ ] `/Compiler/` - Store Files Related To Compiler
          + [ ] `/types/`
            + [ ] `ParseNodes.ts`
            + [ ] `AnalyzerNodes.ts`
            + [ ] `TypeNodes.ts`
            + [ ] `Types.ts`
          + [ ] `/Lexer/`
            + [ ] `Lexer.ts`
            + [ ] `Tokens.ts`
          + [ ] `/Parser/`
            + [ ] `Parser.ts`
            + [ ] `Brisk.ne`
          + [ ] `/Compiler/`
            + [ ] `Analyzer.ts`
            + [ ] `TypeChecker.ts`
            + [ ] `Compiler.ts`
            + [ ] `Optimizer.ts`
          + [ ] `/Linker/`
            + [ ] `Linker.ts`
          + [ ] `/Optimizer/`
            + [ ] `Optimizer.ts`
          + [ ] `index.ts` - Controls All The Different Links
        + [ ] `/cli/`
          + [ ] `index.ts` - Entry file for Brisk
    + [ ] `/dist/` - Generated File Output
    + [ ] `/Documentation/` - Our Documentation
  + [x] Lexer - Chevrotain
    + [ ] Consider Creating a program that can convert These Lexer Tokens To An Extension
  + [ ] Parser - Chevrotain
    + [x] Main Parser
    + [ ] Things To Add
      + [ ] Destructuring
      + [ ] Objects
      + [ ] Arrays
    + [ ] Better Errors
  + [ ] Analyzer
    + [ ] Find Closures Values
      + [ ] Closures are functions that rely on local vars defined above, To determine these we need to double check the values it is relying on are not in the global scope.
    + [ ] Determine Global's i.e Vars in the top level
    + [ ] Find Unused Vars
      + [ ] Remove Them
    + [ ] Determine global functions
  + [ ] Type Checker
    + [ ] Determine Type's of each value and then make sure they match there use case
  + [ ] Compiler
    + [ ] Runtime Mode
      + [ ] No Closures
        + [ ] They should throw errors because we have no physical way to compile them, we need to figure out how we deal with exporting functions vs first class functions
        + [ ] Only Allow Stack Types - Because we don't have Malloc in this mode we cant allocate Anything Onto the heap, meaning stack types only
  + [ ] Linker
  + [ ] Optimizer

+ [ ] Writing Functions For The Language
  
  + [ ] Runtime
    + [ ] Malloc
    + [ ] Free

# Typing
User Defined types 
```ts
type Number = i32 | i64 | f32 | f64 | Test;
interface Test {
  field: Number;
  field: Test;
}
```
user defined types must start with a capital letter, we need some way of resolving recursive types

# Bootstrapping
+ [ ] Before We Can BootStrap
  + [ ] Replace Binaryen
    + [ ] Look into https://github.com/iden3/wasmbuilder/blob/master/src/codebuilder.js
  + [ ] Replace Chevrotain
    + [ ] Lexer
      + [ ] Custom Lexer
    + [ ] Parser
      + [ ] Custom Parser
  + [ ] Must Hit MVP
  + [ ] Convert Most of brisk into brisk macros and runtime / compiler features
    + [ ] We want to do this to increase the value of the language while lowering the complexity of the compiler
    + [ ] what does this mean
      + [ ] Defining things such as The Number data type directly in brisk
      + [ ] Converting Closures to be compiled macros that are given operators


# Syntax
This section describes grain syntax and features.
## Keywords
+ Reserved
  + `enums`
  + `implements`
  + `extends`
## Separators
## Operators
## Syntax
# Language WalkThrough
### Variable Assignments
### Literals
## Types
### Functions
### Imports
### exports
### Math
### If Statements
### Enum
This section describes enum syntax and how to use enums in Brisk.
### Defining Enums
Lets say you want a value that can hold the field of a day. We could use numbers or strings but allocating a string for this is wasteful and numbers are not very friendly and are hard to remember what number refers to what, you may think what if i make an object with the properties to assigned of each day. while this is a good solution it is still wasteful. Enums are perfect for this because they are inlined throughout your code.
```br
enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
};
```
### Assigning Values to enums
By default `Day.Sunday` would represent the number 0 as an i32 and `Day.Monday` would represent a 1. Lets say we want these to instead represent strings we could do.
```br
enum Day {
  Sunday = 'Sun',
  Monday = 'Mun',
  Tuesday = 'Tue;,
  Wednesday = 'Wed',
  Thursday = 'Thur',
  Friday = 'Fri',
  Saturday = 'Sat'
};
```
### More Advanced Enums
The Enums we have shown you so far are very simple And only touch the surface of Brisk's Enum System. For Example lets say we wanted To Create an enum that held a value for example.
```br
enum Result {
  Failure(string),
  Success(string),
};
```
These enums contain A Varient And A String. To Make Use Of This you would do.
```br
const readFile: Function = (path: String): Result => {
  const pathExists: Boolean = false; // This would actually be a function that checks if the path exists
  if (pathExists) {
    const data = ''; // Read File
    return(Result.Success(data));
  }
  return(Result.Failure('File Does Not Exist'));
};
```
You can even use enums with Generic Types.
```br
enum Option<T> {
  Some(T),
  None
};
```
### Matching
### Flags
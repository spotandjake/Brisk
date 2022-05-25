# General Description Of The Language
================================================================

## What is brisk
Brisk is an easy to learn language that puts user experience first while being speedy. The language is easy to read and write and allows for all the power of raw wasm.

## Why was it created
I created brisk because I wanted to learn how to make a programming language and put the effort and time into making a good and powerful one that I could use myself.

## What Are Some key features
Brisk is heavily inspired by typescript while expanding on many limiting factors of the language. Some great things about typescript are the simple syntax and powerful type system along with things like template literals. Typescript has some deficiencies though such as the `switch` statement, The switch statement in typescript is powerful but new languages such as rust have much more powerful `match` statements that allow destructuring and a ton more. Another limiting factor from typescript are the basic enums, typescript enums are rather simple only allowing you to store one value. Brisk allows you to use typescript enums or more advanced enums like rust allowing you to store data inside of enums and represent complex data structures in a simple manner. Another powerful feature of Brisk are the compile time macros. Macros are perfect for when you want to make complex code much easier to read without depending on the compiler to optimize the code the correct way or losing performance.

## General Fundamentals
- What Paradigm is Brisk?
  - Brisk is a multi paradigm language, brisk is heavily inspired by typescript and AssemblyScript, The language is mainly functional but the language try's not to force any functional practices on the programmer.
- What sort of typing does Brisk use?
  - Brisk is statically typed to make compilation quick and programs safe. The language uses a strong type system with very few types built into the compiler.
- What sort of programs is this language best at?
  - Brisk is good in many different environments the type system makes it great for large projects while the syntax makes it easy to work in and allows for quick development.
- Does Brisk Prioritize Performance?
  - Brisk mainly prioritizes ease of use, and extensibility which can come at the cost of performance. The compiler does its best to output performant programs based on these hurtles though and it is always getting faster. If performance is what you need though Brisk might not be for you.
- What is brisk similar too?
  - Brisks is heavily inspired by Typescript and should be fairly easy to learn if you already know typescript or javascript.
- What platforms does Brisk run on?
  - Brisk is built with wasm in mind though it uses an internal ir before the compilation process so you should be able to compile it to any compile target if you want to. Currently though wasm is the only language Brisk intends to compile to. The Advantages of compiling to wasm include the fact that wasm is portable it can run on the web, servers or really any hardware that has a runtime. Wasm is also crazy fast and extremely secure allowing brisk programs to benefit.
- What Features Does Brisk Take From Other Languages
  - Brisk syntax is heavily inspired by Typescript and is very similar the goal is for the language to be easy to learn while being powerful.
  - Brisk enums are inspired by rust with a bit of a twist allowing them to be used in numerous different environments depending on how the programmer feels like implementing them.
  - Brisk also takes match statements from rust, Typescript switch statements suck compared to rusts match statements and we wanted the power from that system.
  - Brisk includes compile time macros as well allowing the programmer to write efficient code that can occur at compile time.
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
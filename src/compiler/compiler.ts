// /* eslint-disable @typescript-eslint/no-unused-vars */
// import binaryen from 'binaryen';

// const memorydebug = true;
// const encoder = new TextEncoder();

// class Stack {
//   public data: { [ key: string ]: { value: number, type: any }} = {};
//   has(name: string) {
//     return this.data.hasOwnProperty(name);
//   }
//   get(name: string) {
//     return this.data[name];
//   }
//   delete(name: string) {
//     delete this.data[name];
//   }
//   setraw(name: string, data: any) {
//     this.data[name] = data;
//   }
//   set(name: string, type: any) {
//     const index = this.length;
//     this.data[name] = {
//       value: index,
//       type: type
//     };
//     return index;
//   }
//   getLocals() {
//     return Object.entries(this.data).map(([ key, value ]) => value.type).filter(n => n);
//   }
//   get length() {
//     return Object.keys(this.data).length;
//   }
// }
// const VariableList = (token: any, used: string[], defined: string[], locals: string[], local: number) => {
//   // Bug local is true here and false there
//   switch(token.type) {
//     case 'BlockStatement':
//       token.body.forEach((statement: any) => VariableList(statement, used, defined, locals, local));
//       break;
//     case 'CallExpression':
//       if (token.callee.name != 'return' && token.callee.name != 'print') {
//         used.push(token.callee.name);
//         locals.push(token.callee.name);
//       }
//       token.arguments.forEach((arg: any) => VariableList(arg, used, defined, locals, local));
//       break;
//     case 'VariableDeclaration':
//       if (local == 0) defined.push(token.id.name);
//       locals.push(token.id.name);
//       VariableList(token.init, used, defined, locals, local);
//       break;
//     case 'ArrowFunctionExpression':
//       // todo: deal with this
//       token.params.forEach((param: any) => VariableList(param, used, defined, locals, local - 1));
//       VariableList(token.body, used, defined, locals, local - 1);
//       break;
//     case 'Literal': {
//       const { value:{ Primitive } } = token;
//       if (Primitive == 'Variable') {
//         used.push(token.value.value);
//         locals.push(token.value.value);
//       }
//       break;
//     }
//     case 'Parameter':
//       if (local == 0) defined.push(token.id.name);
//       locals.push(token.id.name);
//       break;
//   }
//   return { used, locals, defined };
// };
// const TypeToWasm = (BriskType: string) => BriskType == 'Void' ? binaryen.none : binaryen.i32;
// const DataBuilder = (Program: binaryen.Module, typeName: string, data: number[]) => {
//   // Get the id
//   let rtId = 0;
//   switch (typeName) {
//     case 'Function':
//       rtId = 1;
//       break;
//     case 'Closure':
//       rtId = 2;
//       break;
//     case 'Boolean':
//       rtId = 3;
//       break;
//     case 'String':
//       rtId = 4;
//       break;
//     case 'Number':
//       rtId = 5;
//       break;
//     case 'Array':
//       rtId = 6;
//       break;
//   }
//   // Calculate Size
//   const rtSize = 2 + data.length; // Data Size + id + sizeValue
//   // Get Pointer
//   const ptr = Program.i32.load(0, 0, Program.i32.const(0));
//   // Put the data into an Array Buffer
//   const block = [
//     // Call Malloc
//     // Store Data
//     Program.i32.store(0, 0, ptr, Program.i32.const(rtSize)),
//     Program.i32.store(4, 0, ptr, Program.i32.const(rtId))
//   ];
//   data.forEach(
//     (byte, index) =>
//       block.push(Program.i32.store(8+index*4, 0, ptr, Program.i32.const(byte)))
//   );
//   block.push(Program.i32.store(0, 0, Program.i32.const(0), Program.i32.add(ptr, Program.i32.const(rtSize*4))));
//   if (memorydebug) block.push(Program.call('briskmemory', [Program.i32.const(1)], binaryen.none));
//   return { code: block, ptr: Program.i32.sub(ptr, Program.i32.const(rtSize*4)) };
// };
// class Compiler {
//   private Program: binaryen.Module = new binaryen.Module();
//   private functions: string[] = [];
//   private filename: string;
//   constructor(filename: string) {
//     // Debug info
//     this.filename = filename;
//   }
//   compile(token: any) {
//     const { Program, filename } = this;
//     // Initiate our memory
//     Program.setMemory(1,-1,'memory',[]);
//     // Add Runtime Linking
//     // Compile
//     this.compileToken(token, new Stack());
//     // Make our Function Table
//     Program.addTable('functions', this.functions.length, -1);
//     Program.addActiveElementSegment('functions', 'functions', this.functions, Program.i32.const(0));
//     Program.autoDrop();
//     // Add debug info
//     Program.addDebugInfoFileName(filename);
//     return Program.emitText();
//   }
//   compileToken(token: any, stack: Stack): any {
//     const { Program, functions } = this;
//     const { type } = token;
//     switch(type) {
//       case 'Program': {
//         const { body } = token;
//         const _programBody = body.filter((n: any) => n).map((tkn: any) => this.compileToken(tkn, stack)).flat().filter((n: any) => n);
//         const start = Program.addFunction('main', binaryen.none, binaryen.none, new Array(stack.length).fill(binaryen.i32), 
//           Program.block(null, [
//             Program.i32.store(0, 0, Program.i32.const(0), Program.i32.const(4)),
//             ..._programBody
//           ])
//         );
//         Program.setStart(start);
//         break;
//       }
//       case 'BlockStatement': {
//         const { body } = token;
//         return Program.block(null, body.map((tkn: any) => this.compileToken(tkn, stack)).flat());
//       }
//       case 'CallExpression': {
//         // TODO:
//         const { callee: { name }, arguments: args } = token;
//         // Determine Function Type (e.g: return, userDefined, call)
//         switch (name) {
//           // TODO: add support for multi value returns
//           case 'return': {
//             // Determine the parameters
//             const operands = args.map((argument: any) => {
//               const { value: { code, ptr } } = this.compileToken(argument, stack);
//               return [ ...code, Program.return(ptr) ];
//             });
//             return operands[0];
//           }
//           case 'call':
//             break;
//           case 'print': {
//             const wasm: any[] = [];
//             const operands = args.map((argument: any) => {
//               const opperand = this.compileToken(argument, stack);
//               if (argument.type == 'CallExpression') {
//                 return opperand;
//               } else {
//                 const { value: { code, ptr } } = opperand;
//                 wasm.push(...code);
//                 return ptr;
//               }
//             });
//             return [ ...wasm, Program.call('print', operands, binaryen.none) ];
//           }
//           default: {
//             const wasm = [];
//             // Determine the parameters
//             const operands = args.map((argument: any) => {
//               const { value: { code, ptr } } = this.compileToken(argument, stack);
//               wasm.push(...code);
//               return ptr;
//             });
//             // Determine the Function's Index
//             const funcIndex = Program.i32.load(8, 0, Program.local.get(stack.get(name).value));
//             // Get Function Type
//             const { paramType, returnType } = stack.get(name).type;
//             // User defined
//             return Program.call_indirect('functions', funcIndex, operands, paramType, returnType);
//           }
//         }
//         break;
//       }
//       case 'ImportDeclaration': {
//         // TODO: add typing and static linking along with foreign imports
//         const { name: { name }, file: { value } } = token;
//         Program.addFunctionImport(
//           name,
//           value,
//           name,
//           binaryen.i32,
//           binaryen.none
//         );
//         break;
//       }
//       case 'ExportDeclaration': {
//         break;
//       }
//       case 'VariableDeclaration': {
//         const { id: { name }, init } = token;
//         if (init.type == 'CallExpression') {
//           const ptr = this.compileToken(init, stack);
//           const VarIndex = stack.set(name, type);
//           return [ Program.local.set(VarIndex, ptr) ];
//         } else {
//           const { value: { code, ptr }, type } = this.compileToken(init, stack);
//           const VarIndex = stack.set(name, type);
//           return [ 
//             ...code,
//             Program.local.set(VarIndex, ptr)
//           ];
//         }
//       }
//       case 'ArrowFunctionExpression': {
//         // TODO: implement closure
//         // make a new stack
//         const funcStack = new Stack();
//         // Make Closure
//         const { returnType, params, body } = token;
//         const VariableData = VariableList(token, [], [], [], 1);
//         // TODO: deal with vars defined later in the scope that are from the previous scope, not done need to implement
//         VariableData.used.forEach((name) => {
//           // Make Closure
//           if (!VariableData.defined.includes(name)) {
//             // Change this so it is a static closure instead
//             funcStack.setraw(name, stack.get(name));
//           }
//         });
//         // parse parameters
//         const Parameters = params.map((tkn: any) => this.compileToken(tkn, funcStack));
//         // Closure
//         // Make Function Body
//         const _functionBody = this.compileToken(body, funcStack);
//         // Make Function
//         Program.addFunction(
//           `${functions.length}`,
//           binaryen.createType(Parameters),
//           TypeToWasm(returnType),
//           new Array(funcStack.length).fill(binaryen.i32), 
//           _functionBody
//         );
//         // Store reference
//         const store = DataBuilder(
//           Program,
//           'Function',
//           [
//             functions.length
//           ]
//         );
//         // Add to the table
//         functions.push(`${functions.length}`);
//         return { 
//           value: store,
//           type: {
//             paramType: binaryen.createType(Parameters),
//             returnType: TypeToWasm(returnType)
//           }
//         };
//       }
//       case 'Literal': {
//         const { value:{ Primitive, value } } = token;
//         let LiteralValue;
//         switch (Primitive) {
//           case 'Number':
//             LiteralValue = DataBuilder(Program, 'Number', [ value ]);
//             break;
//           case 'Boolean':
//             LiteralValue = DataBuilder(Program, 'Boolean', [ value == true ? 1 : 0 ]);
//             break;
//           case 'String': {
//             LiteralValue = DataBuilder(Program, 'String', [...encoder.encode(value)]);
//             break;
//           }
//           case 'Variable': {
//             LiteralValue = { code: [], ptr: Program.local.get(stack.get(value).value) };
//             break;
//           }
//           default: {
//             throw('Unknown Type');
//           }
//         }
//         return { value: LiteralValue, type: binaryen.i32 };
//       }
//       case 'Parameter': {
//         // TODO: First class function typing
//         const { id: { name }, ValueType } = token;
//         if (ValueType.type == 'FunctionTyping') {
//           const { ReturnType, ParamTypes } = ValueType;
//           stack.set(
//             name, 
//             {
//               paramType: binaryen.createType(ParamTypes.map((type: string) => TypeToWasm(type))),
//               returnType: TypeToWasm(ReturnType)
//             }
//           );
//         } else stack.set(name, binaryen.i32);
//         return TypeToWasm(ValueType);
//       }
//     }
//   }
// }
// export default Compiler;
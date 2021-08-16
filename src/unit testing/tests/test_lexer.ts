import Lexer from '../../Brisk/Compiler/FrontEnd/Lexer/Lexer';
const data = `
import print from './print.br';
// Comments
let main: Function = (param: Number, param2: String, param3: String): Number => {
  @disablegc
  let str: String = 'test';
  let num: Number = -1.111;
  let boolTrue: Boolean = true;
  let boolFalse: Boolean = false;
  main(f);
};
let p: Function = (): Void => print('h');
main(1);
let call: Number = main(main(1, 2));

main((): Void => {
});
export main;
`;

export default {
  name: 'lexer',
  description: 'determine that lexer output is the same',
  run: (): string => {
    const output = [];
    const lexer = new Lexer('Stub');
    lexer.reset(data);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const here = lexer.next();
      if (here == null) break;
      output.push(here);
    }
    return JSON.stringify(output);
  }
};
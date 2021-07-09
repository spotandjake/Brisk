import Parser from '../../compiler/Parser/Parser';
const data = `import print from './print.br';
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
  name: 'parser',
  description: 'determine that parser output is the same',
  run: (): string => {
    const parsed = Parser('test.br', data, false);
    return JSON.stringify(parsed);
  }
};
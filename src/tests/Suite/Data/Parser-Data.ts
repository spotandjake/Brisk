export const data = {
  Pass: `import print from './print.br';
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
`,
  Fail: 'f'
}
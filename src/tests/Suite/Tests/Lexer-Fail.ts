import Lexer from '../../../Compiler/Compiler/FrontEnd/Lexer/Lexer';
import { data } from '../Data/Lexer-Data';
export default {
  name: 'lexer fail',
  description: 'determine that lexer output is the same',
  run: (): string => {
    const output = [];
    const lexer = new Lexer('Stub');
    lexer.reset(data.Fail);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const here = lexer.next();
      if (here == null) break;
      output.push(here);
    }
    return JSON.stringify(output);
  }
};
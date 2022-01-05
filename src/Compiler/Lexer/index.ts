// Imports
import Lexer from './Lexer';
// Lex code
const lex = (program: string, file: string) => {
  const lexer = new Lexer(file);
  lexer.reset(program);
  const lexStream = [];
  while (true) {
    const token = lexer.next();
    if (token == null) break;
    lexStream.push(token);
  }
  lexer.reset('');
  return lexStream;
};

export default lex;
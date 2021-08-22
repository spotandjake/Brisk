import Parser from '../../../Compiler/Compiler/FrontEnd/Parser/Parser';
import { data } from '../Data/Parser-Data';

export default {
  name: 'parser fail',
  description: 'determine that parser output is the same',
  run: (): string => JSON.stringify(Parser('stub', data.Pass))
};
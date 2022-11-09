// Imports
import { AnalyzerProperties } from './AnalyzerNodes';
import { TypeLiteral } from './ParseNodes';
// Properties
export interface TypeCheckProperties extends Omit<AnalyzerProperties, 'operatorScope'> {
  // TypeChecking Properties
  _returnType: undefined | TypeLiteral;
}

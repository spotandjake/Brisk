// Imports
import { AnalyzerProperties } from './AnalyzerNodes';
import { TypeLiteral } from './ParseNodes';
// Properties
export interface TypeCheckProperties extends AnalyzerProperties {
  // TypeChecking Properties
  _returnType: undefined | TypeLiteral;
}

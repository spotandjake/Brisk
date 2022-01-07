import { transform} from '@swc/core';
import {pathResolver} from './path-resolver.js';

export default (options = {}) => ({
  name: 'swc',
  resolveId: pathResolver(),
  transform(code, filename) {
    options.filename = filename;
    return transform(code, options);
  }
});
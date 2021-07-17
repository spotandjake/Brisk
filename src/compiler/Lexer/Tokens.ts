import { Rule } from '../Grammar/Types';

const tokens: Rule[] = [
  // keyword
  {
    type: 'keyword',
    id: 'Token_import',
    match: /import/
  },
  {
    type: 'keyword',
    id: 'Token_wasm',
    match: /wasm/
  },
  {
    type: 'keyword',
    id: 'Token_from',
    match: /from/
  },
  {
    type: 'keyword',
    id: 'Token_export',
    match: /export/
  },
  {
    type: 'keyword',
    id: 'Token_let',
    match: /let/
  },
  // separator
  {
    type: 'separator',
    id: 'Token_left_paren',
    match: /\(/
  },
  {
    type: 'separator',
    id: 'Token_right_paren',
    match: /\)/
  },
  {
    type: 'separator',
    id: 'Token_left_bracket',
    match: /\{/
  },
  {
    type: 'separator',
    id: 'Token_right_bracket',
    match: /\}/
  },
  {
    type: 'separator',
    id: 'Token_comma',
    match: /,/
  },
  {
    type: 'separator',
    id: 'Token_colon',
    match: /:/
  },
  {
    type: 'separator',
    id: 'Token_semicolon',
    match: /;/
  },
  {
    type: 'separator',
    id: 'Token_ws',
    match: /[ \t\s]+/,
    lineBreaks: true
  },
  // operator
  {
    type: 'operator',
    id: 'Token_arrow',
    match: /->/
  },
  {
    type: 'operator',
    id: 'Token_thick_arrow',
    match: /=>/
  },
  {
    type: 'operator',
    id: 'Token_equal',
    match: /=/
  },
  // literal
  {
    type: 'literal',
    id: 'Token_string',
    match: /'.*'/,
    value: (text: string): string => text.slice(1, text.length-1)
  },
  {
    type: 'literal',
    id: 'Token_number',
    match: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
    value: (text: string): (number | bigint) => {
      if (Number(text) < 2147483647 &&  Number(text) > -2147483647 || !Number.isInteger(Number(text))) {
        return Number(text);
      } else return BigInt(text);
    }
  },
  {
    type: 'literal',
    id: 'Token_boolean',
    match: /(?:true|false)/,
    value: (text: string): boolean => text == 'true'
  },
  // flag
  {
    type: 'flag',
    id: 'Token_flag',
    match: /@.*/,
    value: (text: string): string => text.slice(1)
  },
  // comment
  {
    type: 'comment',
    id: 'Token_comment',
    match: /\/\/.*/,
    value: (text: string): string => text.slice(2).trim()
  },
  // identifier
  {
    type: 'identifier',
    id: 'Token_identifier',
    match: /[a-zA-Z$_][1-9a-zA-Z$_]*/
  },
];

export default tokens;
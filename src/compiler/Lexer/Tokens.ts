import { Rule } from './Types';

const tokens: Rule[] = [
  // keyword
  {
    type: 'keyword',
    id: 'import',
    match: /import/
  },
  {
    type: 'keyword',
    id: 'from',
    match: /from/
  },
  {
    type: 'keyword',
    id: 'export',
    match: /export/
  },
  {
    type: 'keyword',
    id: 'let',
    match: /let/
  },
  // separator
  {
    type: 'separator',
    id: 'left_paren',
    match: /\(/
  },
  {
    type: 'separator',
    id: 'right_paren',
    match: /\)/
  },
  {
    type: 'separator',
    id: 'left_bracket',
    match: /\{/
  },
  {
    type: 'separator',
    id: 'right_bracket',
    match: /\}/
  },
  {
    type: 'separator',
    id: 'comma',
    match: /,/
  },
  {
    type: 'separator',
    id: 'colon',
    match: /:/
  },
  {
    type: 'separator',
    id: 'semicolon',
    match: /;/
  },
  {
    type: 'separator',
    id: 'ws',
    match: /[ \t\s]+/,
    lineBreaks: true
  },
  // operator
  {
    type: 'operator',
    id: 'arrow',
    match: /=>/
  },
  {
    type: 'operator',
    id: 'equal',
    match: /=/
  },
  // literal
  {
    type: 'literal',
    id: 'string',
    match: /'.*'/,
    value: (text: string): string => text.slice(1, text.length-1)
  },
  {
    type: 'literal',
    id: 'number',
    match: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
    value: (text: string): number => Number(text)
  },
  {
    type: 'literal',
    id: 'boolean',
    match: /(?:true|false)/,
    value: (text: string): boolean => text == 'true'
  },
  // flag
  {
    type: 'flag',
    id: 'flag',
    match: /@.*/,
    value: (text: string): string => text.slice(1)
  },
  // comment
  {
    type: 'comment',
    id: 'comment',
    match: /\/\/.*/,
    value: (text: string): string => text.slice(2).trim()
  },
  // identifier
  {
    type: 'identifier',
    id: 'identifier',
    match: /[a-zA-Z$_][1-9a-zA-Z$_]*/
  },
];

export default tokens;
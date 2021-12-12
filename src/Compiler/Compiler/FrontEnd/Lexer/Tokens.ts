import { Lexeme, LexemeType } from '../../Types';
const tokens: Lexeme[] = [
  // keyword
  {
    type: LexemeType.keyword,
    id: 'Tkn_import',
    match: /import/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_wasm',
    match: /wasm/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_from',
    match: /from/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_export',
    match: /export/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_let',
    match: /let/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_if',
    match: /if/
  },
  {
    type: LexemeType.keyword,
    id: 'Tkn_else',
    match: /else/
  },
  // separator
  {
    type: LexemeType.separator,
    id: 'Tkn_l_paren',
    match: /\(/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_r_paren',
    match: /\)/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_l_bracket',
    match: /\{/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_r_bracket',
    match: /\}/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_comma',
    match: /,/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_colon',
    match: /:/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_semicolon',
    match: /;/
  },
  {
    type: LexemeType.separator,
    id: 'Tkn_ws',
    match: /[ \t\s]+/,
    lineBreaks: true
  },
  // operator
  {
    type: LexemeType.operator,
    id: 'Tkn_arrow',
    match: /->/
  },
  {
    type: LexemeType.operator,
    id: 'Tkn_thick_arrow',
    match: /=>/
  },
  {
    type: LexemeType.operator,
    id: 'Tkn_equal',
    match: /=/
  },
  // literal
  {
    type: LexemeType.literal,
    id: 'Tkn_str',
    match: /'.*'/,
    value: (text: string): string => {
      return text.slice(1, text.length - 1)
        .replace(/(?<!\\)\\b/g, '\b')
        .replace(/(?<!\\)\\f/g, '\f')
        .replace(/(?<!\\)\\n/g, '\n')
        .replace(/(?<!\\)\\r/g, '\r')
        .replace(/(?<!\\)\\t/g, '\t')
        .replace(/(?<!\\)\\\\/g, '\\')
        // eslint-disable-next-line indent
        ;
    }
  },
  {
    type: LexemeType.literal,
    id: 'Tkn_number',
    match: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
    value: (text: string): (number | bigint) => {
      if (Number(text) < 2147483647 && Number(text) > -2147483647 || !Number.isInteger(Number(text))) return Number(text);
      else return BigInt(text);
    }
  },
  {
    type: LexemeType.literal,
    id: 'Tkn_bool',
    match: /(?:true|false)/,
    value: (text: string): boolean => text == 'true'
  },
  // flag
  {
    type: LexemeType.flag,
    id: 'Tkn_flag',
    match: /@.*/,
    value: (text: string): string => text.slice(1)
  },
  // comment
  {
    type: LexemeType.comment,
    id: 'Tkn_comment',
    match: /\/\/.*/,
    value: (text: string): string => text.slice(2).trim()
  },
  // identifier
  {
    type: LexemeType.identifier,
    id: 'Tkn_identifier',
    match: /[a-zA-Z$_][1-9a-zA-Z$_]*/
  },
];

export default tokens;
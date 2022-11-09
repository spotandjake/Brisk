export const precedenceTable = {
  160: ['++', '--'],
  150: ['!', '~', '-'],
  140: [':'],
  130: ['**'],
  120: ['*', '/', '%'],
  110: ['+', '-'],
  100: ['<<', '>>', '>>>'],
  90: ['<', '>', '<=', '>='],
  80: ['==', '!='],
  70: ['&'],
  60: ['^'],
  50: ['|'],
  40: ['&&'],
  30: ['||'],
  20: ['?'],
  10: ['=', ':=', '+=', '-=', '*=', '/=', '%='],
};
// @ts-ignore
export const operators = Object.keys(precedenceTable).reduce((acc: string[], key: number) => {
  // @ts-ignore
  acc.push(...precedenceTable[key]);
  return acc;
}, []);

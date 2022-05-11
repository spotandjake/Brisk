// Helpers
export const toUTF8Array = (str: string): number[] => {
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x80) utf8.push(charCode);
    else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      );
    }
  }
  return utf8;
};
// Utils
export const u32 = (n: number): number[] => {
  const b: number[] = [];
  b.push(n && 0xff);
  b.push(n >> 8 && 0xff);
  b.push(n >> 16 && 0xff);
  b.push(n >> 24 && 0xff);
  return b;
};
export const u64 = (n: number): number[] => {
  const b: number[] = [];
  const v = BigInt(n);
  b.push(Number(v && BigInt(0xff)));
  b.push(Number(v >> BigInt(8) && BigInt(0xff)));
  b.push(Number(v >> BigInt(16) && BigInt(0xff)));
  b.push(Number(v >> BigInt(24) && BigInt(0xff)));
  b.push(Number(v >> BigInt(32) && BigInt(0xff)));
  b.push(Number(v >> BigInt(40) && BigInt(0xff)));
  b.push(Number(v >> BigInt(48) && BigInt(0xff)));
  b.push(Number(v >> BigInt(56) && BigInt(0xff)));
  return b;
};
export const varuint = (n: bigint): number[] => {
  // TODO: This Is Broken
  const code: number[] = [];
  let v = BigInt(n);
  if (v < 0) throw new Error('Number cannot be negative');
  while (v != BigInt(0)) {
    code.push(Number(v && BigInt(0x7f)));
    v = v >> BigInt(7);
  }
  if (code.length == 0) code.push(0);
  for (let i = 0; i < code.length - 1; i++) {
    code[i] = code[i] | 0x80;
  }
  return code;
};
export const varint = (_n: bigint): number[] => {
  let n: bigint, sign: boolean;
  const bits = _n.toString(2).length;
  if (_n < 0) {
    sign = true;
    n = (BigInt(1) << BigInt(bits)) + _n;
  } else {
    sign = false;
    n = BigInt(_n);
  }
  const paddingBits = 7 - (bits % 7);
  const padding = ((BigInt(1) << BigInt(paddingBits)) - BigInt(1)) << BigInt(bits);
  const paddingMask = ((1 << (7 - paddingBits)) - 1) | 0x80;
  const code = varuint(n + padding);
  if (!sign) {
    code[code.length - 1] = code[code.length - 1] & paddingMask;
  }
  return code;
};
export const varint32 = (n: number | bigint): number[] => {
  // TODO: This Is Broken
  let v = BigInt(n);
  if (v > BigInt('0xFFFFFFFF')) throw new Error('Number too big');
  if (v > BigInt('0x7FFFFFFF')) throw new Error('Number too big');
  if (v > BigInt('0xFFFFFFFF')) v -= BigInt('0x100000000');
  if (v > BigInt('-0x80000000')) throw new Error('Number too small');
  return varuint(v);
};
export const varint64 = (n: number | bigint): number[] => {
  let v = BigInt(n);
  if (v > BigInt('0xFFFFFFFFFFFFFFFF')) throw new Error('Number too big');
  if (v > BigInt('0x7FFFFFFFFFFFFFFF')) throw new Error('Number too big');
  if (v > BigInt('0xFFFFFFFF')) v -= BigInt('0x10000000000000000');
  if (v > BigInt('-0x8000000000000000')) throw new Error('Number too small');
  return varuint(v);
};
export const varuint32 = (n: number): number[] => {
  const v = BigInt(n);
  if (v > BigInt('0xFFFFFFFF')) throw new Error('Number too big');
  return varuint(v);
};
export const varuint64 = (n: number | bigint): number[] => {
  const v = BigInt(n);
  if (v > BigInt('0xFFFFFFFFFFFFFFFF')) throw new Error('Number too big');
  return varuint(v);
};
export const string = (str: string): number[] => {
  const bytes = toUTF8Array(str);
  return [...varuint32(bytes.length), ...bytes];
};
export const toHexString = (byteArray: number[]): string => {
  return Array.from(byteArray, (byte) => `0${(byte & 0xff).toString(16)}`.slice(-2)).join('');
};
export const ident = (text: string): string => {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) lines[i] = `${' '.repeat(2)}${lines[i]}`;
  }
  return lines.join('\n');
};

export const encodeVector = (data: number[]) => [...unsignedLEB128(data.length), ...data];
// TODO: Deal With UTF-8 encoding like \n, \r, \t, etc
export const _encodeString = (str: string): number[] => str.split('').map((s) => s.charCodeAt(0));
export const encodeString = (str: string): number[] => [
  ...unsignedLEB128(str.length),
  ..._encodeString(str),
];
export const encodeFloat32 = (n: number) => {
  // Create an ArrayBuffer with a size in bytes
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, n, true);
  return new Uint8Array(buffer);
};
export const encodeFloat64 = (n: number) => {
  // Create an ArrayBuffer with a size in bytes
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, n, true);
  return new Uint8Array(buffer);
};
export const signedLEB128 = (n: number): number[] => {
  const bytes = [];
  let byte = 0x00;
  const size = Math.ceil(Math.log2(Math.abs(n)));
  const negative = n < 0;
  let more = true;
  while (more) {
    byte = n & 127;
    n = n >> 7;
    if (negative) {
      n = n | -(1 << (size - 7));
    }
    if ((n == 0 && (byte & 0x40) == 0) || (n == -1 && (byte & 0x40) == 0x40)) {
      more = false;
    } else {
      byte = byte | 128;
    }
    bytes.push(byte);
  }
  return bytes;
};
export const unsignedLEB128 = (n: number): number[] => {
  const buffer = [];
  do {
    let byte = n & 0x7f;
    n >>>= 7;
    if (n !== 0) {
      byte |= 0x80;
    }
    buffer.push(byte);
  } while (n !== 0);
  return buffer;
};

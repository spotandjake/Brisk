// Test Utils
import { expect, test } from '@jest/globals';
// Test Components
import * as Utils from '../../../src/wasmBuilder/Build/Utils';
// WasmBuilder Utils Tests
test('WasmBuilder-Utils: ieee754-negative-ints', () => {
  const data = [];
  for (let i = 0; i >= -1000; i -= 250) {
    data.push(i);
  }
  expect(data.map((n) => Utils.ieee754(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: ieee754-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 250) {
    data.push(i);
  }
  expect(data.map((n) => Utils.ieee754(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: ieee754-negative-float', () => {
  const data = [];
  for (let i = 0; i >= -1; i -= 0.25) {
    data.push(i);
  }
  expect(data.map((n) => Utils.ieee754(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: ieee754-positive-float', () => {
  const data = [];
  for (let i = 0; i <= 1; i += 0.25) {
    data.push(i);
  }
  expect(data.map((n) => Utils.ieee754(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: ieee754-zero', () => {
  expect(Utils.ieee754(0)).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x00]));
});
test('WasmBuilder-Utils: signedLEB128-negative-ints', () => {
  const data = [];
  for (let i = 0; i >= -1000; i -= 250) {
    data.push(i);
  }
  expect(data.map((n) => Utils.signedLEB128(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: signedLEB128-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 100) {
    data.push(i);
  }
  expect(data.map((n) => Utils.signedLEB128(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: signedLEB128-zero', () => {
  expect(Utils.signedLEB128(0)).toEqual([0x00]);
});
test('WasmBuilder-Utils: unsignedLEB128-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 100) {
    data.push(i);
  }
  expect(data.map((n) => Utils.unsignedLEB128(n).join(','))).toMatchSnapshot();
});
test('WasmBuilder-Utils: unsignedLEB128-zero', () => {
  expect(Utils.unsignedLEB128(0).join(',')).toMatchSnapshot();
});
test('WasmBuilder-Utils: encodeVector', () => {
  const data = [
    ...[0x00, 0x61, 0x73, 0x6d], // Magic Module Header
    ...[0x01, 0x00, 0x00, 0x00], // Wasm Module Version
  ];
  expect(Utils.encodeVector(data)).toEqual([...Utils.unsignedLEB128(data.length), ...data]);
});
test('WasmBuilder-Utils: _encodeString', () => {
  expect(Utils._encodeString('Hello World').join(',')).toMatchSnapshot();
});
test('WasmBuilder-Utils: encodeString', () => {
  expect(Utils.encodeString('Hello World').join(',')).toMatchSnapshot();
});

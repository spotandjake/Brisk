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
  expect(data.map((n) => Utils.encodeFloat32(n))).toEqual([
    Uint8Array.from([0, 0, 0, 0]),
    Uint8Array.from([0, 0, 122, 195]),
    Uint8Array.from([0, 0, 250, 195]),
    Uint8Array.from([0, 128, 59, 196]),
    Uint8Array.from([0, 0, 122, 196]),
  ]);
});
test('WasmBuilder-Utils: ieee754-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 250) {
    data.push(i);
  }
  expect(data.map((n) => Utils.encodeFloat32(n))).toEqual([
    Uint8Array.from([0, 0, 0, 0]),
    Uint8Array.from([0, 0, 122, 67]),
    Uint8Array.from([0, 0, 250, 67]),
    Uint8Array.from([0, 128, 59, 68]),
    Uint8Array.from([0, 0, 122, 68]),
  ]);
});
test('WasmBuilder-Utils: ieee754-negative-float', () => {
  const data = [];
  for (let i = 0; i >= -1; i -= 0.25) {
    data.push(i);
  }
  expect(data.map((n) => Utils.encodeFloat32(n))).toEqual([
    Uint8Array.from([0, 0, 0, 0]),
    Uint8Array.from([0, 0, 128, 190]),
    Uint8Array.from([0, 0, 0, 191]),
    Uint8Array.from([0, 0, 64, 191]),
    Uint8Array.from([0, 0, 128, 191]),
  ]);
});
test('WasmBuilder-Utils: ieee754-positive-float', () => {
  const data = [];
  for (let i = 0; i <= 1; i += 0.25) {
    data.push(i);
  }
  expect(data.map((n) => Utils.encodeFloat32(n))).toEqual([
    Uint8Array.from([0, 0, 0, 0]),
    Uint8Array.from([0, 0, 128, 62]),
    Uint8Array.from([0, 0, 0, 63]),
    Uint8Array.from([0, 0, 64, 63]),
    Uint8Array.from([0, 0, 128, 63]),
  ]);
});
test('WasmBuilder-Utils: ieee754-zero', () => {
  expect(Utils.encodeFloat32(0)).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x00]));
});
test('WasmBuilder-Utils: signedLEB128-negative-ints', () => {
  const data = [];
  for (let i = 0; i >= -1000; i -= 250) {
    data.push(i);
  }
  expect(data.map((n) => Utils.signedLEB128(n))).toEqual([
    [0],
    [134, 126],
    [140, 124],
    [146, 122],
    [152, 120],
  ]);
});
test('WasmBuilder-Utils: signedLEB128-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 100) {
    data.push(i);
  }
  expect(data.map((n) => Utils.signedLEB128(n))).toEqual([
    [0],
    [228, 0],
    [200, 1],
    [172, 2],
    [144, 3],
    [244, 3],
    [216, 4],
    [188, 5],
    [160, 6],
    [132, 7],
    [232, 7],
  ]);
});
test('WasmBuilder-Utils: signedLEB128-zero', () => {
  expect(Utils.signedLEB128(0)).toEqual([0x00]);
});
test('WasmBuilder-Utils: unsignedLEB128-positive-ints', () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 100) {
    data.push(i);
  }
  expect(data.map((n) => Utils.unsignedLEB128(n))).toEqual([
    [0],
    [100],
    [200, 1],
    [172, 2],
    [144, 3],
    [244, 3],
    [216, 4],
    [188, 5],
    [160, 6],
    [132, 7],
    [232, 7],
  ]);
});
test('WasmBuilder-Utils: unsignedLEB128-zero', () => {
  expect(Utils.unsignedLEB128(0)).toEqual([0]);
});
test('WasmBuilder-Utils: encodeVector', () => {
  const data = [
    ...[0x00, 0x61, 0x73, 0x6d], // Magic Module Header
    ...[0x01, 0x00, 0x00, 0x00], // Wasm Module Version
  ];
  expect(Utils.encodeVector(data)).toEqual([...Utils.unsignedLEB128(data.length), ...data]);
});
test('WasmBuilder-Utils: _encodeString', () => {
  expect(Utils._encodeString('Hello World')).toEqual([
    72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
  ]);
});
test('WasmBuilder-Utils: encodeString', () => {
  expect(Utils.encodeString('Hello World')).toEqual([
    11, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
  ]);
});

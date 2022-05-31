import { BriskModule } from './Types';
import { WasmSection } from '../wasmBuilder/Types/Nodes';
// Types
const enum BriskTypeID {
  PrimitiveType = 0x00,
  UnionType = 0x01,
  FunctionType = 0x02,
  ArrayType = 0x03,
  InterfaceType = 0x04,
  EnumType = 0x05,
}
// Helpers
const decodeSignedLeb128 = (input: number[]): { result: number; length: number } => {
  let result = 0;
  let shift = 0;
  let bitCount = 0;
  while (input.length != 0) {
    bitCount++;
    const byte = <number>input.shift();
    result |= (byte & 0x7f) << shift;
    shift += 7;
    if ((0x80 & byte) === 0) {
      if (shift < 32 && (byte & 0x40) !== 0) {
        return { result: result | (~0 << shift), length: bitCount };
      }
      return { result: result, length: bitCount };
    }
  }
  return { result: result, length: bitCount };
};
class SectionDecoder {
  // General Properties
  private currentIndex = 0;
  // Wasm Sections
  private wasmSection: number[];
  // Constructor
  constructor(wasmSection: number[]) {
    // Set Properties
    this.wasmSection = wasmSection;
  }
  // Helpers
  public getCurrentSlice(length: number): number[] {
    this.currentIndex += length;
    return this.wasmSection.slice(this.currentIndex - length, this.currentIndex);
  }
  public getCurrentIndex(): number {
    this.currentIndex++;
    return this.wasmSection[this.currentIndex - 1];
  }
  public decodeString(): string {
    // Get String Length
    const stringLength = this.decodeSignedLeb128();
    const stringValue = String.fromCharCode(...this.getCurrentSlice(stringLength));
    // Return String Value
    return stringValue;
  }
  public decodeSignedLeb128(): number {
    let result = 0;
    let shift = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const byte = this.wasmSection[this.currentIndex];
      this.currentIndex++;
      result |= (byte & 0x7f) << shift;
      shift += 7;
      if ((0x80 & byte) === 0) {
        if (shift < 32 && (byte & 0x40) !== 0) {
          return result | (~0 << shift);
        }
        return result;
      }
    }
  }
}
class FileDecoder {
  // General Properties
  private currentIndex = 8;
  // Wasm Sections
  private wasmBinary: number[];
  private customSections: number[][] = [];
  private typeSection: number[] = [];
  private importSection: number[] = [];
  private funcSection: number[] = [];
  private tableSection: number[] = [];
  private memorySection: number[] = [];
  private globalSection: number[] = [];
  private exportSection: number[] = [];
  private startSection: number[] = [];
  private elementSection: number[] = [];
  private codeSection: number[] = [];
  private dataSection: number[] = [];
  private dataCountSection: number[] = [];
  // Constructor
  constructor(wasmBinary: number[]) {
    // Set Properties
    this.wasmBinary = wasmBinary;
    // Parse Each Section
    while (this.currentIndex < wasmBinary.length) {
      this.parseSection();
    }
    // Try And Find The Module Signature
    let foundSignature = false;
    for (const section of this.customSections) {
      // Create A Section Decoder
      const sectionDecoder = new SectionDecoder(section);
      // Get The Section Name
      const sectionName = sectionDecoder.decodeString();
      // Check If The Section Is The Module Signature
      if (sectionName == 'BriskModuleSignature') {
        foundSignature = true;
        // Parse The Type Section Of The Signature
        sectionDecoder.getCurrentIndex(); // Skip The Header ID
        const typeCount = sectionDecoder.decodeSignedLeb128();
        for (let typeIndex = 0; typeIndex < typeCount; typeIndex++) {
          const typeID = sectionDecoder.getCurrentIndex();
          console.log(typeID);
          switch (<BriskTypeID>typeID) {
            case BriskTypeID.PrimitiveType:
              break;
            // UnionType = 0x01,
            // FunctionType = 0x02,
            // ArrayType = 0x03,
            // InterfaceType = 0x04,
            // EnumType = 0x05,
          }
        }
      }
    }
    if (!foundSignature) throw 'Cannot Find Module Signature';
  }
  // Parse Section
  private parseSection() {
    // Determine Section Length
    const sectionID = this.getCurrentIndex();
    // Determine Section Type
    const sectionLength = this.decodeSignedLeb128();
    // Get The Section Slice
    switch (sectionID) {
      case WasmSection.Custom:
        console.log(`Creating Custom Section Of Length ${sectionLength}`);
        this.customSections.push(this.getCurrentSlice(sectionLength));
        break;
      case WasmSection.Type:
        console.log(`Creating Type Section Of Length ${sectionLength}`);
        this.typeSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Import:
        console.log(`Creating Import Section Of Length ${sectionLength}`);
        this.importSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Func:
        console.log(`Creating Function Section Of Length ${sectionLength}`);
        this.funcSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Table:
        console.log(`Creating Table Section Of Length ${sectionLength}`);
        this.tableSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Memory:
        console.log(`Creating Memory Section Of Length ${sectionLength}`);
        this.memorySection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Global:
        console.log(`Creating Global Section Of Length ${sectionLength}`);
        this.globalSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Export:
        console.log(`Creating Export Section Of Length ${sectionLength}`);
        this.exportSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Start:
        console.log(`Creating Start Section Of Length ${sectionLength}`);
        this.startSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Element:
        console.log(`Creating Element Section Of Length ${sectionLength}`);
        this.elementSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Code:
        console.log(`Creating Code Section Of Length ${sectionLength}`);
        this.codeSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Data:
        console.log(`Creating Data Section Of Length ${sectionLength}`);
        this.dataSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.DataCount:
        console.log(`Creating Data Count Section Of Length ${sectionLength}`);
        this.dataCountSection = this.getCurrentSlice(sectionLength);
        break;
      default:
        console.log(sectionID);
        throw 'Linking Error, Unknown Section Index';
    }
  }
  // Helpers
  private getCurrentSlice(length: number): number[] {
    this.currentIndex += length;
    return this.wasmBinary.slice(this.currentIndex - length, this.currentIndex);
  }
  private getCurrentIndex(): number {
    this.currentIndex++;
    return this.wasmBinary[this.currentIndex - 1];
  }
  private decodeSignedLeb128(): number {
    let result = 0;
    let shift = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const byte = this.wasmBinary[this.currentIndex];
      this.currentIndex++;
      result |= (byte & 0x7f) << shift;
      shift += 7;
      if ((0x80 & byte) === 0) {
        if (shift < 32 && (byte & 0x40) !== 0) {
          return result | (~0 << shift);
        }
        return result;
      }
    }
  }
}
// The Brisk Linker
const Link = (wasmBinary: Uint8Array) => {
  try {
    new FileDecoder(Array.from(wasmBinary));
  } catch (err) {
    console.log(err);
  }
  return false;
};
// Export Linker
export default Link;

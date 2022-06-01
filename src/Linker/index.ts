import { Position } from '../Types/Types';
import { BriskTypeID } from '../Types/WasmFormat';
import { BaseTypes, primTypes } from '../Compiler/Types/ParseNodes';
import { createBaseUnionType, createPrimType } from '../Compiler/Helpers/typeBuilders';
import { WasmSection } from '../wasmBuilder/Types/Nodes';
import { Decoder } from './WasmModuleTools';
class FileDecoder extends Decoder {
  // Wasm Sections
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
  // Module Signature
  private TypeList: Map<number, BaseTypes> = new Map();
  // Constructor
  constructor(wasmBinary: number[]) {
    // Super
    super(wasmBinary, 8);
    // Parse Each Section
    while (this.currentIndex < wasmBinary.length) {
      this.parseSection();
    }
    // Try And Find The Module Signature
    let foundSignature = false;
    for (const section of this.customSections) {
      // Create A Section Decoder
      const sectionDecoder = new Decoder(section, 0);
      // Get The Section Name
      const sectionName = sectionDecoder.decodeString();
      // Check If The Section Is The Module Signature
      if (sectionName == 'BriskModuleSignature') {
        foundSignature = true;
        // Parse The Type Section Of The Signature
        const typeCount = sectionDecoder.decodeUnSignedLeb128();
        for (let typeIndex = 0; typeIndex < typeCount; typeIndex++) {
          this.parseType(sectionDecoder, typeIndex);
        }
      }
    }
    if (!foundSignature) throw 'Cannot Find Module Signature';
  }
  // Parse Type
  private parseType(sectionDecoder: Decoder, typeIndex: number): BaseTypes {
    // TODO: Handle Positions
    const position: Position = {
      offset: 0,
      length: 0,
      line: 0,
      col: 0,
      file: 'Unknown',
    };
    const typeID = sectionDecoder.getCurrentIndex();
    switch (<BriskTypeID>typeID) {
      case BriskTypeID.PrimitiveType:
        this.TypeList.set(
          typeIndex,
          createPrimType(position, [...primTypes][sectionDecoder.decodeUnSignedLeb128()])
        );
        break;
      case BriskTypeID.UnionType: {
        const unionTypeCount = sectionDecoder.decodeUnSignedLeb128();
        const typeReferences: BaseTypes[] = [];
        for (let i = 0; i < unionTypeCount; i++) {
          // The Only Reason This Should Be Undefined Is An Invalid Reference
          typeReferences.push(this.TypeList.get(sectionDecoder.decodeUnSignedLeb128())!);
        }
        this.TypeList.set(typeIndex, createBaseUnionType(position, ...typeReferences));
        break;
      }
      // TODO: Support The Other Types
      case BriskTypeID.FunctionType:
      // break;
      case BriskTypeID.ArrayType:
      // break;
      case BriskTypeID.InterfaceType:
      // break;
      // TODO: Handle Enum Type
      default:
        throw 'Type Not Yet Supported For Linking';
    }
    return this.TypeList.get(typeIndex)!;
  }
  // Parse Section
  private parseSection() {
    // Determine Section Length
    const sectionID = this.getCurrentIndex();
    // Determine Section Type
    const sectionLength = this.decodeUnSignedLeb128();
    // Get The Section Slice
    console.log(`SectionID: ${sectionID}, index: ${this.currentIndex}, length: ${sectionLength}`);
    switch (sectionID) {
      case WasmSection.Custom:
        this.customSections.push(this.getCurrentSlice(sectionLength));
        break;
      case WasmSection.Type:
        this.typeSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Import:
        this.importSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Func:
        this.funcSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Table:
        this.tableSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Memory:
        this.memorySection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Global:
        this.globalSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Export:
        this.exportSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Start:
        this.startSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Element:
        this.elementSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Code:
        this.codeSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.Data:
        this.dataSection = this.getCurrentSlice(sectionLength);
        break;
      case WasmSection.DataCount:
        this.dataCountSection = this.getCurrentSlice(sectionLength);
        break;
      default:
        console.log(this.currentIndex);
        console.log(this.buffer.slice(this.currentIndex));
        throw 'Linking Error, Unknown Section Index';
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

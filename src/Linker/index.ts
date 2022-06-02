import { Position } from '../Types/Types';
import { BriskTypeID } from '../Types/WasmFormat';
import { BaseTypes, primTypes } from '../Compiler/Types/ParseNodes';
import {
  createBaseFunctionSignatureType,
  createBaseUnionType,
  createPrimType,
} from '../Compiler/Helpers/typeBuilders';
import { WasmModule } from '../wasmBuilder/Types/Nodes';
import {
  // addElement,
  // addExport,
  // addFunction,
  // addGlobal,
  // addImport,
  // addMemory,
  // addType,
  // compileModule,
  // createCustomSection,
  // createFunctionImport,
  // createGlobalImport,
  createModule,
  // setStart,
} from '../wasmBuilder/Build/WasmModule';
import { WasmSection } from '../wasmBuilder/Types/Nodes';
import { Decoder } from './WasmModuleTools';
import fs from 'fs/promises';
import path from 'path';
// Types
interface ValueExport {
  valueExport: true;
  exportType: BaseTypes;
  exportName: string;
}
interface TypeExport {
  valueExport: false;
  exportType: BaseTypes;
}
interface BriskImport {
  importPath: string;
  importReference: string;
}
// File Decoder
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
  private ExportList: Map<string, ValueExport | TypeExport> = new Map();
  private ImportList: Map<string, BriskImport> = new Map();
  // Output Module
  private wasmModule: WasmModule = createModule();
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
        // Parse The Export Section
        const exportCount = sectionDecoder.decodeUnSignedLeb128();
        for (let exportIndex = 0; exportIndex < exportCount; exportIndex++) {
          const exportType = sectionDecoder.decodeSignedLeb128();
          const exportName = sectionDecoder.decodeString();
          const typeIndex = sectionDecoder.decodeSignedLeb128();
          if (exportType == 0x00) {
            // Value Export
            const exportReferenceName = sectionDecoder.decodeString();
            this.ExportList.set(exportName, {
              valueExport: true,
              exportType: this.TypeList.get(typeIndex)!,
              exportName: exportReferenceName,
            });
          } else {
            // TypeExport
            this.ExportList.set(exportName, {
              valueExport: false,
              exportType: this.TypeList.get(typeIndex)!,
            });
          }
        }
        // Parse The Import Section
        const importCount = sectionDecoder.decodeUnSignedLeb128();
        for (let importIndex = 0; importIndex < importCount; importIndex++) {
          const importName = sectionDecoder.decodeString();
          const importPath = sectionDecoder.decodeString();
          const importReference = sectionDecoder.decodeString();
          this.ImportList.set(importName, {
            importPath: importPath,
            importReference: importReference,
          });
        }
      }
    }
    if (!foundSignature) throw 'Cannot Find Module Signature';
  }
  // Link Function
  public async link(filePath: string): Promise<WasmModule> {
    // Collect The Dependency's Below
    const depTree = await this.collectDependencyTree(filePath, new Map());
    depTree.set(filePath, this);
    // Variables Needed For Linking
    let tableSize = 0;
    // For Each Module
    for (const [importPath, briskImport] of depTree) {
      // TODO: Combine The Function Tables
      if (briskImport.tableSection.length != 0) {
        console.log(briskImport.tableSection);
        const tableDecoder = new Decoder(briskImport.tableSection, 1);
        tableDecoder.getCurrentIndex();
        tableDecoder.getCurrentIndex();
        tableSize += tableDecoder.decodeUnSignedLeb128();
      }
      // TODO: Set The Function Offset
      // TODO: Resolve Imports
      // TODO: Rename The Globals And Functions
      // TODO: For Each Function
      // TODO: Remap The Function Calls
      // TODO: Remap The Global Calls
      // Combine The Other Parts
      // TODO: Fix Name Section
    }
    // Return Module
    return this.wasmModule;
  }
  // Collect Dependency Tree
  public async collectDependencyTree(
    filePath: string,
    moduleImports: Map<string, FileDecoder>
  ): Promise<Map<string, FileDecoder>> {
    // Add Every Import To The Set
    for (const { importPath } of this.ImportList.values()) {
      // Resolve The Path
      const modulePath = path.resolve(
        path.dirname(filePath),
        `${importPath.replace('.br', '')}.wasm`
      );
      if (!moduleImports.has(modulePath)) {
        // If The Dependency Is Not In The Tree Then Analyze It
        const moduleBuffer = await fs.readFile(modulePath);
        const moduleDecoder = new FileDecoder(Array.from(moduleBuffer));
        await moduleDecoder.collectDependencyTree(filePath, moduleImports);
        // Add The Dependency To The Tree
        moduleImports.set(modulePath, moduleDecoder);
      }
    }
    return moduleImports;
  }
  // Parse Type
  private parseType(sectionDecoder: Decoder, typeIndex: number): BaseTypes {
    // TODO: Handle Positions
    const position: Position = {
      offset: 0,
      length: 0,
      line: 0,
      col: 0,
      // TODO: Use An Actual Base Path Here
      basePath: 'TODO:',
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
      case BriskTypeID.FunctionType: {
        // Deal With Params
        const paramCount = sectionDecoder.decodeUnSignedLeb128();
        const paramTypes: BaseTypes[] = [];
        for (let i = 0; i < paramCount; i++) {
          // The Only Reason This Should Be Undefined Is An Invalid Reference
          paramTypes.push(this.TypeList.get(sectionDecoder.decodeUnSignedLeb128())!);
        }
        // Deal With Return Type
        const returnTypes = this.TypeList.get(sectionDecoder.decodeUnSignedLeb128())!;
        // Deal With Function Signature Type
        this.TypeList.set(
          typeIndex,
          createBaseFunctionSignatureType(position, undefined, paramTypes, returnTypes, new Map())
        );
        break;
      }
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
    // console.log(`SectionID: ${sectionID}, index: ${this.currentIndex}, length: ${sectionLength}`);
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
        throw 'Linking Error, Unknown Section Index';
    }
  }
}
// The Brisk Linker
const Link = async (filePath: string) => {
  // Read The File
  const wasmBinary = await fs.readFile(filePath);
  // Decode File
  const decodedFile = new FileDecoder(Array.from(wasmBinary));
  // Perform Linking
  await decodedFile.link(filePath);
  // console.log(decodedFile);
  return false;
};
// Export Linker
export default Link;

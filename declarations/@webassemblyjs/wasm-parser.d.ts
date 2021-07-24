declare module '@webassemblyjs/wasm-parser' {
  // Basic
  interface BaseNode {
    type: string;
    loc?: SourceLocation;
    // Internal property
    _deleted?: boolean;
  }
  // Nodes
  type Node =
    Module
  | ModuleMetadata
  | ModuleNameMetadata
  | FunctionNameMetadata
  | LocalNameMetadata
  | BinaryModule
  | QuoteModule
  | SectionMetadata
  | ProducersSectionMetadata
  | ProducerMetadata
  | ProducerMetadataVersionedName
  | LoopInstruction
  | Instr
  | IfInstruction
  | StringLiteral
  | NumberLiteral
  | LongNumberLiteral
  | FloatLiteral
  | Elem
  | IndexInFuncSection
  | ValtypeLiteral
  | TypeInstruction
  | Start
  | GlobalType
  | LeadingComment
  | BlockComment
  | Data
  | Global
  | Table
  | Memory
  | FuncImportDescr
  | ModuleImport
  | ModuleExportDescr
  | ModuleExport
  | Limit
  | Signature
  | Program
  | Identifier
  | BlockInstruction
  | CallInstruction
  | CallIndirectInstruction
  | ByteArray
  | Func
  | InternalBrUnless
  | InternalGoto
  | InternalCallExtern
  | InternalEndAndReturn;

  type Block = LoopInstruction | BlockInstruction | Func;

  type Instruction =
      LoopInstruction
    | Instr
    | IfInstruction
    | TypeInstruction
    | BlockInstruction
    | CallInstruction
    | CallIndirectInstruction;

  type Expression =
      Instr
    | StringLiteral
    | NumberLiteral
    | LongNumberLiteral
    | FloatLiteral
    | ValtypeLiteral
    | Identifier;

  type NumericLiteral = NumberLiteral | LongNumberLiteral | FloatLiteral;

  type ImportDescr = GlobalType | Table | Memory | FuncImportDescr;

  interface Module extends BaseNode {
    type: 'Module';
    id?: string;
    fields: Node[];
    metadata?: ModuleMetadata;
  }
  interface ModuleMetadata extends BaseNode {
    type: 'ModuleMetadata';
    sections: SectionMetadata[];
    functionNames?: FunctionNameMetadata[];
    localNames?: ModuleMetadata[];
    producers?: ProducersSectionMetadata[];
  }
  interface ModuleNameMetadata extends BaseNode {
    type: 'ModuleNameMetadata';
    value: string;
  }
  interface FunctionNameMetadata extends BaseNode {
    type: 'FunctionNameMetadata';
    value: string;
    index: number;
  }
  interface LocalNameMetadata extends BaseNode {
    type: 'LocalNameMetadata';
    value: string;
    localIndex: number;
    functionIndex: number;
  }
  interface BinaryModule extends BaseNode {
    type: 'BinaryModule';
    id?: string;
    blob: string[];
  }
  interface QuoteModule extends BaseNode {
    type: 'QuoteModule';
    id?: string;
    string: string[];
  }
  interface SectionMetadata extends BaseNode {
    type: 'SectionMetadata';
    section: SectionName;
    startOffset: number;
    size: NumberLiteral;
    vectorOfSize: NumberLiteral;
  }
  interface ProducersSectionMetadata extends BaseNode {
    type: 'ProducersSectionMetadata';
    producers: ProducerMetadata[];
  }
  interface ProducerMetadata extends BaseNode {
    type: 'ProducerMetadata';
    language: ProducerMetadataVersionedName[];
    processedBy: ProducerMetadataVersionedName[];
    sdk: ProducerMetadataVersionedName[];
  }
  interface ProducerMetadataVersionedName extends BaseNode {
    type: 'ProducerMetadataVersionedName';
    name: string;
    version: string;
  }
  interface LoopInstruction extends BaseNode {
    type: 'LoopInstruction';
    id: string;
    label?: Identifier;
    resulttype?: Valtype;
    instr: Instruction[];
  }
  interface Instr extends BaseNode {
    type: 'Instr';
    id: string;
    object?: Valtype;
    args: Expression[];
    namedArgs?: any;
  }
  interface IfInstruction extends BaseNode {
    type: 'IfInstruction';
    id: string;
    testLabel: Identifier;
    test: Instruction[];
    result?: Valtype;
    consequent: Instruction[];
    alternate: Instruction[];
  }
  interface StringLiteral extends BaseNode {
    type: 'StringLiteral';
    value: string;
  }
  interface NumberLiteral extends BaseNode {
    type: 'NumberLiteral';
    value: number;
    raw: string;
  }
  interface LongNumberLiteral extends BaseNode {
    type: 'LongNumberLiteral';
    value: LongNumber;
    raw: string;
  }
  interface FloatLiteral extends BaseNode {
    type: 'FloatLiteral';
    value: number;
    nan?: boolean;
    inf?: boolean;
    raw: string;
  }
  interface Elem extends BaseNode {
    type: 'Elem';
    table: Index;
    offset: Instruction[];
    funcs: Index[];
  }
  interface IndexInFuncSection extends BaseNode {
    type: 'IndexInFuncSection';
    index: Index;
  }
  interface ValtypeLiteral extends BaseNode {
    type: 'ValtypeLiteral';
    name: Valtype;
  }
  interface TypeInstruction extends BaseNode {
    type: 'TypeInstruction';
    id?: Index;
    functype: Signature;
  }
  interface Start extends BaseNode {
    type: 'Start';
    index: Index;
  }
  interface GlobalType extends BaseNode {
    type: 'GlobalType';
    valtype: Valtype;
    mutability: Mutability;
  }
  interface LeadingComment extends BaseNode {
    type: 'LeadingComment';
    value: string;
  }
  interface BlockComment extends BaseNode {
    type: 'BlockComment';
    value: string;
  }
  interface Data extends BaseNode {
    type: 'Data';
    memoryIndex: Memidx;
    offset: Instruction;
    init: ByteArray;
  }
  interface Global extends BaseNode {
    type: 'Global';
    globalType: GlobalType;
    init: Instruction[];
    name?: Identifier;
  }
  interface Table extends BaseNode {
    type: 'Table';
    elementType: TableElementType;
    limits: Limit;
    name?: Identifier;
    elements?: Index[];
  }
  interface Memory extends BaseNode {
    type: 'Memory';
    limits: Limit;
    id?: Index;
  }
  interface FuncImportDescr extends BaseNode {
    type: 'FuncImportDescr';
    id: Identifier;
    signature: Signature;
  }
  interface ModuleImport extends BaseNode {
    type: 'ModuleImport';
    module: string;
    name: string;
    descr: ImportDescr;
  }
  interface ModuleExportDescr extends BaseNode {
    type: 'ModuleExportDescr';
    exportType: ExportDescrType;
    id: Index;
  }
  interface ModuleExport extends BaseNode {
    type: 'ModuleExport';
    name: string;
    descr: ModuleExportDescr;
  }
  interface Limit extends BaseNode {
    type: 'Limit';
    min: number;
    max?: number;
    shared?: boolean;
  }
  interface Signature extends BaseNode {
    type: 'Signature';
    params: FuncParam[];
    results: Valtype[];
  }
  interface Program extends BaseNode {
    type: 'Program';
    body: Node[];
  }
  interface Identifier extends BaseNode {
    type: 'Identifier';
    value: string;
    raw?: string;
  }
  interface BlockInstruction extends BaseNode {
    type: 'BlockInstruction';
    id: string;
    label?: Identifier;
    instr: Instruction[];
    result?: Valtype;
  }
  interface CallInstruction extends BaseNode {
    type: 'CallInstruction';
    id: string;
    index: Index;
    instrArgs?: Expression[];
    numeric?: Index;
  }
  interface CallIndirectInstruction extends BaseNode {
    type: 'CallIndirectInstruction';
    id: string;
    signature: SignatureOrTypeRef;
    intrs?: Expression[];
  }
  interface ByteArray extends BaseNode {
    type: 'ByteArray';
    values: Byte[];
  }
  interface Func extends BaseNode {
    type: 'Func';
    name?: Index;
    signature: SignatureOrTypeRef;
    body: Instruction[];
    isExternal?: boolean;
    metadata?: FuncMetadata;
  }
  interface InternalBrUnless extends BaseNode {
    type: 'InternalBrUnless';
    target: number;
  }
  interface InternalGoto extends BaseNode {
    type: 'InternalGoto';
    target: number;
  }
  interface InternalCallExtern extends BaseNode {
    type: 'InternalCallExtern';
    target: number;
  }
  interface InternalEndAndReturn extends BaseNode {
    type: 'InternalEndAndReturn';
  }
  function decode(buf: ArrayBuffer, customOpts: any): Program;
}
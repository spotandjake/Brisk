interface Position {
  offset: number;
  line: number;
  col: number;
  file: string;
}
interface CompilerOptions {
  wat?: boolean;
  link?: boolean;
  writeFile?: boolean;
}
export {
  Position,
  CompilerOptions
};
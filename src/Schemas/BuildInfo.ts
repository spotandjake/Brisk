// SpecVersion: 1.0.0
interface BuildInfo {
  SpecVersion: string;
  ProgramInfo: {
    [file: string]: {
      signature: string;
      // TODO: Add TypeInfo
    }
  }
}
export default BuildInfo;
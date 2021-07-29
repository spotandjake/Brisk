// SpecVersion: 1.1.0
interface BuildInfo {
  SpecVersion: string;
  LatestCompileDate: string;
  ProgramInfo: {
    [file: string]: {
      signature: string;
      LatestCompileDate: string;
      // TODO: Add TypeInfo
    }
  }
}
export default BuildInfo;
// SpecVersion: 1.1.0
interface BuildInfo {
  SpecVersion: '1.1.0';
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
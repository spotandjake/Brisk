// SpecVersion: 1.2.0
const BuildInfoSpecVersion = '1.2.0';
interface BuildInfo {
  SpecVersion: '1.2.0';
  CompilerVersion: {
    CheckSum: string;
    CompiledDate: string;
  }
  LatestCompileDate: string;
  ProgramInfo: {
    [file: string]: {
      signature: string;
      LatestCompileDate: string;
      // TODO: Add TypeInfo
    }
  }
}
const BuildInfoTemplate: BuildInfo = {
  SpecVersion: BuildInfoSpecVersion,
  CompilerVersion: {
    CheckSum: '',
    CompiledDate: ''
  },
  LatestCompileDate: '',
  ProgramInfo: {}
};
export default BuildInfo;
export { BuildInfoSpecVersion, BuildInfoTemplate };
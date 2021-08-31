import Brisk from '../../Brisk_Globals';
// SpecVersion: 1.2.0
const BuildInfoSpecVersion = '1.2.0';
interface BuildInfo {
  SpecVersion: string;
  CompilerVersion: {
    CheckSum: string;
    CompiledDate: string;
  }
  LatestCompileDate: string;
  ProgramInfo: {
    [file: string]: {
      signature: string;
      LatestCompileDate: string;
    }
  }
}
export const BuildInfoTemplate = (date: string): BuildInfo => {
  return {
    SpecVersion: BuildInfoSpecVersion,
    CompilerVersion: {
      CheckSum: Brisk.Checksum,
      CompiledDate: Brisk.CompileDate
    },
    LatestCompileDate: '',
    ProgramInfo: {}
  };
};
export default BuildInfo;
export { BuildInfoSpecVersion };
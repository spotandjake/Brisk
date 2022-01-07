import { Options } from '@swc/core';
import { Plugin } from 'rollup';
declare type PluginOptions<O = Options> = Pick<O, Exclude<keyof O, 'filename'>>;
declare type RollupPluginSWC = (options?: PluginOptions) => Plugin;
declare const swc: RollupPluginSWC;
export default swc;

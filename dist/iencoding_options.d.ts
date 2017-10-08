import { IRollupPluginOptions } from './irollup_plugin_options';
export interface IEncodingOptions extends IRollupPluginOptions {
    encodingFrom?: string;
    encodingTo?: string;
    iconv?: {
        decode?: {};
        encode?: {};
    };
    dist: string;
}

import { IEncodingOptions } from './iencoding_options';
export default function encoding(options: IEncodingOptions): {
    name: string;
    transform(code: string, id: string): {
        code: string;
        map: {
            mappings: string;
        };
    } | undefined;
};

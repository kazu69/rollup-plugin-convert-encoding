import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';

export interface RollupPluginOptions {
    include: string;
	exclude: string;
}

export interface EncodingOptions extends RollupPluginOptions {
    encodingFrom?: string;
    encodingTo?: string;
    iconv?: {
        decode?: {};
        encode?: {};
    };
    dist: string;
}

interface IconvOption {
    stripBOM?: boolean;
    addBOM?: boolean;
}

const defaultEncoding = 'UTF-8';

function ensureDirectoryExistence(filePath: string): boolean
{
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    if (!fs.mkdirSync(dirname)) {
        console.error(`Can not make directory ${dirname}`);
        return false;
    }
    return ensureDirectoryExistence(dirname);
}

function logError(message: string): void
{
    console.error(chalk.red.bold(message));
}

function decode(data: any, from: string, option?: IconvOption): string
{
    return iconv.decode(data, from, option);
}

function encode(code: string, to: string, option?: IconvOption): NodeBuffer
{
    return iconv.encode(code, to, option);
}

export default function encoding(options: EncodingOptions)
{
    const createFilter = require('rollup-pluginutils').createFilter;
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'encoding',
        transform(code: string, id: string) {
            if (!filter(id)) {
                return;
            }

            const from: string = options.encodingFrom || defaultEncoding;
            const to: string = options.encodingTo || defaultEncoding;
            const dist: string = options.dist;

            let decodeOption = {};
            let encodeOption = {};

            if (options.iconv) {
                decodeOption = options.iconv.decode || decodeOption;
                encodeOption = options.iconv.encode || encodeOption;
            }

            try {
                if (!dist) {
                    logError('Needs dist file path');
                }

                if (from !== defaultEncoding && !iconv.encodingExists(from)) {
                    logError('Input encoding is not supported');
                }

                if (from !== defaultEncoding && !iconv.encodingExists(to)) {
                    logError('Output encoding is not supported');
                }

                fs.readFile(id, (err, data) => {
                    if (err) {
                        logError(`Can not read file ${id}`);
                    }

                    const buffer = encode(decode(data, from, decodeOption), to, encodeOption);

                    if (!ensureDirectoryExistence(options.dist)) {
                        throw new Error('Direcory create faild');
                    }

                    fs.writeFile(dist, buffer, (error) => {
                        if (error) {
                            logError(`Can not write file ${options.dist}`);
                        }
                    });
                });
            } catch (err) {
                throw err;
            }

            return {
                code,
                map: { mappings: '' },
            };
        },
    };
}

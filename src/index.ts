import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import {IEncodingOptions} from './iencoding_options';
import {IIconvOption} from './iiconv_options';

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

function bufferDecode(data: Buffer, from: string, option?: IIconvOption): string
{
    return iconv.decode(data, from, option);
}

function codeEncoding(code: string, to: string, option?: IIconvOption): NodeBuffer
{
    return iconv.encode(code, to, option);
}

export default function encoding(options: IEncodingOptions)
{
    const createFilter = require('rollup-pluginutils').createFilter;
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'convert-encoding',
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

                    const buffer = codeEncoding(bufferDecode(data, from, decodeOption), to, encodeOption);

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

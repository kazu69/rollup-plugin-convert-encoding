import { decode, encode, encodingExists } from 'iconv-lite';
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { dirname } from 'path';
import { red } from 'chalk';

var defaultEncoding = 'UTF-8';
function ensureDirectoryExistence(filePath) {
    var dirname$$1 = dirname(filePath);
    if (existsSync(dirname$$1)) {
        return true;
    }
    if (!mkdirSync(dirname$$1)) {
        console.error("Can not make directory " + dirname$$1);
        return false;
    }
    return ensureDirectoryExistence(dirname$$1);
}
function logError(message) {
    console.error(red.bold(message));
}
function bufferDecode(data, from, option) {
    return decode(data, from, option);
}
function codeEncoding(code, to, option) {
    return encode(code, to, option);
}
function encoding(options) {
    var createFilter = require('rollup-pluginutils').createFilter;
    var filter = createFilter(options.include, options.exclude);
    return {
        name: 'encoding',
        transform: function (code, id) {
            if (!filter(id)) {
                return;
            }
            var from = options.encodingFrom || defaultEncoding;
            var to = options.encodingTo || defaultEncoding;
            var dist = options.dist;
            var decodeOption = {};
            var encodeOption = {};
            if (options.iconv) {
                decodeOption = options.iconv.decode || decodeOption;
                encodeOption = options.iconv.encode || encodeOption;
            }
            try {
                if (!dist) {
                    logError('Needs dist file path');
                }
                if (from !== defaultEncoding && !encodingExists(from)) {
                    logError('Input encoding is not supported');
                }
                if (from !== defaultEncoding && !encodingExists(to)) {
                    logError('Output encoding is not supported');
                }
                readFile(id, function (err, data) {
                    if (err) {
                        logError("Can not read file " + id);
                    }
                    var buffer = codeEncoding(bufferDecode(data, from, decodeOption), to, encodeOption);
                    if (!ensureDirectoryExistence(options.dist)) {
                        throw new Error('Direcory create faild');
                    }
                    writeFile(dist, buffer, function (error) {
                        if (error) {
                            logError("Can not write file " + options.dist);
                        }
                    });
                });
            }
            catch (err) {
                throw err;
            }
            return {
                code: code,
                map: { mappings: '' },
            };
        },
    };
}

export default encoding;

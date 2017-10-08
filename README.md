# Rollup Convert Encoding Plugin

[![Build Status](https://travis-ci.org/kazu69/rollup-plugin-convert-encoding.svg?branch=master)](https://travis-ci.org/kazu69/rollup-plugin-convert-encoding)

This Rollup plugin converts file encoding.

## Usage

### Install

```sh
npm install rollup-plugin-convert-encode
```

### Setup

example for `rollup.config.js`

```js
import encode from 'rollup-plugin-convert-encoding';
const dist = 'dist/converted.js';

const options = {
	dist: dist,
	encodingFrom: 'EUC-JP',
	encodingTo: 'SHIFT_JIS'
}
export default {
	input: 'example/index.js',
	plugins: [ encode(options) ],
	output: [
        {
		    format: 'cjs',
			file: dist
		}
	]
};
```

## Options

#### dist

Type: string
Default: null

File output destination.

#### encodingFrom

Type: string
Default: utf8

Original file encoding.

#### encodingTo

Type: string
Default: utf8

Output file encoding.

#### iconv

Type: object
Default: {decode: {}, encode: {}}

[iconv-lite](https://github.com/ashtuchkin/iconv-lite#bom-handling) BOM Handling option.

## About encodings

The plugin uses [iconv-lite](https://github.com/ashtuchkin/iconv-lite/) to handle the encoding.
Support encodings listed on the [iconv-lite page](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).

## License

[MIT License](https://github.com/kazu69/rollup-plugin-convert-encoding/blob/master/LICENSE)

const test = require('ava');
const sinon = require('sinon');
const ExportContext = require('export-context');
const pkg = require('../package.json');
const Readable = require('stream').Readable

const path = pkg.main;
const exportContext = new ExportContext;
const ctx = exportContext.run(path);

test('logError', t => {
    const message = 'test';
    const spy = sinon.spy(ctx.console, 'error');

    ctx.logError(message);

    t.true(spy.calledOnce);
    spy.restore();
});

test('decode', t => {
    const spy = sinon.spy(ctx.iconv, 'decode');
    const buf = Readable;
    const fromEncode = 'UTF-8';
    const option = {};

    ctx.bufferDecode(Readable, fromEncode, option);
    const calledArgs = spy.args[0];

    t.true(spy.calledOnce);
    t.is(Readable, calledArgs[0]);
    t.is(fromEncode, calledArgs[1]);
    t.is(option, calledArgs[2]);
    spy.restore();
});

test('codeEncoding', t => {
    const spy = sinon.spy(ctx.iconv, 'encode');
    const code = 'code';
    const toEncode = 'UTF-8';
    const option = {};

    ctx.codeEncoding(code, toEncode, option);
    const calledArgs = spy.args[0];
    
    t.true(spy.calledOnce);
    t.is(code, calledArgs[0]);
    t.is(toEncode, calledArgs[1]);
    t.is(option, calledArgs[2]);
    spy.restore();
});

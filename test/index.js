// Load modules

var Lab = require('lab');
var butils = require('../');

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

describe('butils', function () {
    
    describe('#getBit', function () {
    });
    describe('#setBit', function () {
    });
    describe('#EQUAL', function () {
    });
    describe('#XOR', function () {
    });
    describe('#AND', function () {
    });
    describe('#OR', function () {
    });
    describe('#NOT', function () {
    });
    describe('#leftShift', function () {
    });
    describe('#rightShift', function () {
    });
    describe('#read/writeString', function () {
        it('can write a string', function (done) {
            var buf = new Buffer(50);
            butils.writeString(buf, 'test', 0);

            var val = buf.toString('utf8', 0, 4);

            expect(val).to.equal('test');
            done();
        });
        it('can read a string', function (done) {
            var buf = new Buffer(50);
            buf.write('test', 'utf8', 0);

            var val = butils.readString(buf, 0, 4);

            expect(val).to.equal('test');
            done();
        });
    });

    describe('#read/writeInt8', function () {
    });
    describe('#read/writeInt', function () {
    });
    describe('#read/writeInt32', function () {
    });
    describe('#readInt32LE', function () {
    });
    describe('#read/writeVarint', function () {
    });
    describe('#toArray', function () {
    });
    /*
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    describe('#', function () {
    });
    */

});


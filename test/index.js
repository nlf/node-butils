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
        it('works, on single byte buffer', function (done) {
            var buf = new Buffer(1);
            buf[0] = 0xAA; // 10101010

            expect(butils.getBit(buf,1)).to.equal(true);
            expect(butils.getBit(buf,2)).to.equal(false);
            expect(butils.getBit(buf,3)).to.equal(true);
            expect(butils.getBit(buf,4)).to.equal(false);
            expect(butils.getBit(buf,5)).to.equal(true);
            expect(butils.getBit(buf,6)).to.equal(false);
            expect(butils.getBit(buf,7)).to.equal(true);
            expect(butils.getBit(buf,8)).to.equal(false);
            expect(buf[0]).to.equal(0xAA);
            done();
        });
        it('works on multi byte buffers', function (done) {
            var buf = new Buffer(5);
            buf[0] = 0xAA; // 10101010
            buf[1] = 0xAA; // 10101010
            buf[2] = 0xAA; // 10101010
            buf[3] = 0xAA; // 10101010
            buf[4] = 0xAA; // 10101010

            for (var bit = 1, ln = buf.length * 8; bit <= ln; bit +=2) {
                expect(butils.getBit(buf, bit)).to.equal(true);
                expect(butils.getBit(buf, bit + 1)).to.equal(false);
            }

            // make sure the buffer is the same
            for (var i = 0; i < buf.length; i++) {
                expect(buf[i]).to.equal(0xAA);
            }
            done();
        });
    });
    describe('#setBit', function () {
        it('works on single byte buffers', function (done) {
            var buf = new Buffer(1);
            buf[0] = 0xAA;
            
            expect(butils.setBit(buf, 1, false)).to.equal(buf[0]);
            expect(butils.setBit(buf, 2, true)).to.equal(buf[0]);
            expect(butils.setBit(buf, 3, false)).to.equal(buf[0]);
            expect(butils.setBit(buf, 4, true)).to.equal(buf[0]);
            expect(butils.setBit(buf, 5, false)).to.equal(buf[0]);
            expect(butils.setBit(buf, 6, true)).to.equal(buf[0]);
            expect(butils.setBit(buf, 7, false)).to.equal(buf[0]);
            expect(butils.setBit(buf, 8, true)).to.equal(buf[0]);

            expect(buf[0]).to.equal(0x55);
            done();
        });
    });
    describe('#EQUAL', function () {
        it('returns false if the buffers are defferent sizes', function (done) {
            expect(butils.EQUAL(new Buffer(1), new Buffer(2))).to.equal(false);
            done();
        });
        it('returns true for two equal one byte buffers', function (done) {
            var buf1 = new Buffer([0x01]);
            var buf2 = new Buffer([0x01]);
            expect(butils.EQUAL(buf1, buf2)).to.equal(true);
            done();
        });
        it('returns true for two equal mutli byte buffers', function (done) {
            var buf1 = new Buffer([0x01, 0x05, 0x07]);
            var buf2 = new Buffer([0x01, 0x05, 0x07]);
            expect(butils.EQUAL(buf1, buf2)).to.equal(true);
            done();
        });
        it('returns false for two unequal one byte buffers', function (done) {
            var buf1 = new Buffer([0x01]);
            var buf2 = new Buffer([0x02]);
            expect(butils.EQUAL(buf1, buf2)).to.equal(false);
            done();
        });
        it('returns false for two unequal mutli byte buffers', function (done) {
            var buf1 = new Buffer([0x01, 0x05, 0x07]);
            var buf2 = new Buffer([0x01, 0x55, 0x07]);
            expect(butils.EQUAL(buf1, buf2)).to.equal(false);
            done();
        });
    });
    describe('#XOR', function () {
        it('xor\'s one byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA]);
            var obuf =  new Buffer([0x55]);
            butils.XOR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xFF]))).to.equal(true);
            done();
        });
        it('xor\'s multi byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55, 0xFF, 0xAA]);
            butils.XOR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0x55, 0xAA, 0xFF, 0x99]))).to.equal(true);
            done();
        });
        it('xor\'s the first buffer for as long as the second buffer', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55]);
            butils.XOR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0x55, 0xAA, 0x00, 0x33]))).to.equal(true);
            done();
        });
    });
    describe('#AND', function () {
        it('and\'s one byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA]);
            var obuf =  new Buffer([0x55]);
            butils.AND(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0x00]))).to.equal(true);
            done();
        });
        it('and\'s multi byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55, 0xFF, 0xAA]);
            butils.AND(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xAA, 0x55, 0x00, 0x22]))).to.equal(true);
            done();
        });
        it('and\'s the first buffer for as long as the second buffer', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55]);
            butils.AND(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xAA, 0x55, 0x00, 0x33]))).to.equal(true);
            done();
        });
    });
    describe('#OR', function () {
        it('or\'s one byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA]);
            var obuf =  new Buffer([0x55]);
            butils.OR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xFF]))).to.equal(true);
            done();
        });
        it('or\'s multi byte buffers correctly', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55, 0xFF, 0xAA]);
            butils.OR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xFF, 0xFF, 0xFF, 0xBB]))).to.equal(true);
            done();
        });
        it('or\'s the first buffer for as long as the second buffer', function (done) {
            var buf =   new Buffer([0xAA, 0xFF, 0x00, 0x33]);
            var obuf =  new Buffer([0xFF, 0x55]);
            butils.OR(buf, obuf);

            expect(butils.EQUAL(buf, new Buffer([0xFF, 0xFF, 0x00, 0x33]))).to.equal(true);
            done();
        });
    });
    describe('#NOT', function () {
        it('not\'s one byte buffers correctly', function (done) {
            var buf = new Buffer([0x00]);
            butils.NOT(buf);
            expect(butils.EQUAL(buf, new Buffer([0xFF]))).to.equal(true);
            done();
        });
        it('not\'s multi byte buffers correctly', function (done) {
            var buf = new Buffer([0xFF, 0x00, 0xFF]);
            butils.NOT(buf);
            expect(butils.EQUAL(buf, new Buffer([0x00, 0xFF, 0x00]))).to.equal(true);
            done();
        });
    });
    describe('#leftShift', function () {
        it('can shift a single byte buffer', function (done) {
            var buf = new Buffer([0x0F]);
            var newbuf = butils.leftShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xF0]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by less than a byte', function (done) {
            var buf = new Buffer([0xF0, 0xFF]);
            var newbuf = butils.leftShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x0F, 0xF0]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by a byte', function (done) {
            var buf = new Buffer([0xFA, 0xFF, 0xAA, 0xFF]);
            var newbuf = butils.leftShift(buf, 8);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xFF, 0xAA, 0xFF, 0x00]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than a byte', function (done) {
            var buf = new Buffer([0xFA, 0xBB, 0xCC, 0xDD, 0xEE]);
            var newbuf = butils.leftShift(buf, 12);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xBC, 0xCD, 0xDE, 0xE0, 0x00]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than 2 bytes', function (done) {
            var buf = new Buffer([0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
            var newbuf = butils.leftShift(buf, 20);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x89, 0x9A, 0xAB, 0xBC, 0xCD, 0xDE, 0xEF, 0xF0, 0x00, 0x00]))).to.equal(true);
            done();
        });
    });
    describe('#rightShift', function () {
        it('can shift a single byte buffer', function (done) {
            var buf = new Buffer([0xF0]);
            var newbuf = butils.rightShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x0F]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by less than a byte', function (done) {
            var buf = new Buffer([0xAB, 0xCD]);
            var newbuf = butils.rightShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x0A, 0xBC]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by a byte', function (done) {
            var buf = new Buffer([0xAB, 0xCD, 0xEF, 0x11]);
            var newbuf = butils.rightShift(buf, 8);

            expect(butils.EQUAL(newbuf, new Buffer([0x00, 0xAb, 0xCD, 0xEF]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than a byte', function (done) {
            var buf = new Buffer([0xAA, 0xBB, 0xCC, 0xDD, 0xEE]);
            var newbuf = butils.rightShift(buf, 12);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x00, 0x0A, 0xAB, 0xBC, 0xCD]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than 2 bytes', function (done) {
            var buf = new Buffer([0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
            var newbuf = butils.rightShift(buf, 20);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x00, 0x00, 0x06, 0x67, 0x78, 0x89, 0x9A, 0xAB, 0xBC, 0xCD]))).to.equal(true);
            done();
        });
    });
    describe('#signedRightShift', function () {
        it('can shift a single byte buffer', function (done) {
            var buf = new Buffer([0xF0]);
            var newbuf = butils.signedRightShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0x0FF]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by less than a byte', function (done) {
            var buf = new Buffer([0xAB, 0xCD]);
            var newbuf = butils.signedRightShift(buf, 4);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xFA, 0xBC]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by a byte', function (done) {
            var buf = new Buffer([0xAB, 0xCD, 0xEF, 0x11]);
            var newbuf = butils.signedRightShift(buf, 8);

            expect(butils.EQUAL(newbuf, new Buffer([0xFF, 0xAb, 0xCD, 0xEF]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than a byte', function (done) {
            var buf = new Buffer([0xAA, 0xBB, 0xCC, 0xDD, 0xEE]);
            var newbuf = butils.signedRightShift(buf, 12);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xFF, 0xFA, 0xAB, 0xBC, 0xCD]))).to.equal(true);
            done();
        });
        it('can shift a multi byte buffer by more than 2 bytes', function (done) {
            var buf = new Buffer([0x86, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
            var newbuf = butils.signedRightShift(buf, 20);
            
            expect(butils.EQUAL(newbuf, new Buffer([0xFF, 0xFF, 0xF8, 0x67, 0x78, 0x89, 0x9A, 0xAB, 0xBC, 0xCD]))).to.equal(true);
            done();
        });
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


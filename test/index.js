// Load modules

var Lab = require('lab');
var butils = require('../');

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

describe('Bit operations', function () {
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

        it('returns true for two equal multi byte buffers', function (done) {
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

        it('returns false for two unequal multi byte buffers', function (done) {
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

        it('defers to a regular right shift for buffers without a sign bit set', function (done) {
            var buf = new Buffer([0x01, 0x23, 0x45]);
            var newbuf = butils.signedRightShift(buf, 4);

            expect(butils.EQUAL(newbuf, new Buffer([0x00, 0x12, 0x34]))).to.equal(true);
            done();
        });
    });
});

describe('String operations', function () {
    describe('#writeString', function () {
        it('can write a string', function (done) {
            var buf = new Buffer(4);
            butils.writeString(buf, 'test');

            expect(butils.EQUAL(buf, new Buffer([0x74, 0x65, 0x73, 0x74]))).to.equal(true);
            done();
        });

        it('can write a string with an offset', function (done) {
            var buf = new Buffer(7);
            butils.writeString(buf, 'test', 3);

            expect(butils.EQUAL(buf.slice(3), new Buffer([0x74, 0x65, 0x73, 0x74]))).to.equal(true);
            done();
        });
    });

    describe('#readString', function () {
        it('can read a string', function (done) {
            var buf = new Buffer([0x74, 0x65, 0x73, 0x74]);
            var val = butils.readString(buf);

            expect(val).to.equal('test');
            done();
        });

        it('can read a string with an offset', function (done) {
            var buf = new Buffer([0x00, 0x00, 0x00, 0x74, 0x65, 0x73, 0x74]);
            var val = butils.readString(buf, 3);

            expect(val).to.equal('test');
            done();
        });

        it('can read a string from the middle of a buffer', function (done) {
            var buf = new Buffer([0x00, 0x00, 0x00, 0x74, 0x65, 0x73, 0x74, 0x74, 0x74]);
            var val = butils.readString(buf, 3, 7);

            expect(val).to.equal('test');
            done();
        });

        it('can read a string with unicode characters', function (done) {
            var buf = new Buffer('touché');
            var val = butils.readString(buf);

            expect(val).to.equal('touché');
            done();
        });

        it('can read a string with double-wide unicode characters', function (done) {
            var buf = new Buffer('butilsﻀ');
            var val = butils.readString(buf);

            expect(val).to.equal('butilsﻀ');
            done();
        });
    });
});

describe('Integer operations', function () {
    describe('#readInt', function () {
        it('can read an integer', function (done) {
            var buf = new Buffer([42]);

            var val = butils.readInt(buf);
            expect(val).to.equal(42);
            done();
        });

        it('can read an integer with an offset', function (done) {
            var buf = new Buffer([45, 42]);

            var val = butils.readInt(buf, 1);
            expect(val).to.equal(42);
            done();
        });
    });

    describe('#writeInt', function () {
        it('can write an integer', function (done) {
            var buf = new Buffer(1);

            butils.writeInt(buf, 42);
            expect(butils.EQUAL(buf, new Buffer([42]))).to.equal(true);
            done();
        });

        it('can write an integer with an offset', function (done) {
            var buf = new Buffer(2);

            butils.writeInt(buf, 42, 1);
            expect(butils.EQUAL(buf.slice(1), new Buffer([42]))).to.equal(true);
            done();
        });
    });

    describe('#readInt32', function () {
        it('can read a 32 bit integer', function (done) {
            var buf = new Buffer([0xff, 0xff, 0xff, 0xff]);

            var val = butils.readInt32(buf);
            expect(val).to.equal(4294967295);
            done();
        });

        it('can read a 32 bit integer with an offset', function (done) {
            var buf = new Buffer([0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

            var val = butils.readInt32(buf, 2);
            expect(val).to.equal(4294967295);
            done();
        });
    });

    describe('#writeInt32', function () {
        it('can write a 32 bit integer', function (done) {
            var buf = new Buffer(4);

            butils.writeInt32(buf, 2882400170);
            expect(butils.EQUAL(buf, new Buffer([0xab, 0xcd, 0xef, 0xaa]))).to.equal(true);
            done();
        });

        it('can write a 32 bit integer with an offset', function (done) {
            var buf = new Buffer(5);

            butils.writeInt32(buf, 2882400170, 1);
            expect(butils.EQUAL(buf.slice(1), new Buffer([0xab, 0xcd, 0xef, 0xaa]))).to.equal(true);
            done();
        });
    });

    describe('#readInt32LE', function () {
        it('can read a little endian 32 bit integer', function (done) {
            var buf = new Buffer([0xaa, 0xef, 0xcd, 0xab]);

            var val = butils.readInt32LE(buf);
            expect(val).to.equal(2882400170);
            done();
        });

        it('can read a little endian 32 bit integer with an offset', function (done) {
            var buf = new Buffer([0xef, 0xef, 0xaa, 0xef, 0xcd, 0xab]);

            var val = butils.readInt32LE(buf, 2);
            expect(val).to.equal(2882400170);
            done();
        });
    });
});

describe('Varint operations', function () {
    describe('#writeVarint', function () {
        it('can write a varint', function (done) {
            var buf = new Buffer(5);

            butils.writeVarint(buf, 2882400170);
            expect(butils.EQUAL(buf, new Buffer([0xaa, 0xdf, 0xb7, 0xde, 0x0a]))).to.equal(true);
            done();
        });

        it('can write a varint with an offset', function (done) {
            var buf = new Buffer(7);

            butils.writeVarint(buf, 2882400170, 2);
            expect(butils.EQUAL(buf.slice(2), new Buffer([0xaa, 0xdf, 0xb7, 0xde, 0x0a]))).to.equal(true);
            done();
        });

        it('can write a zigzag encoded varint', function (done) {
            var buf = new Buffer(5);

            var count = butils.writeVarint(buf, -2147483648, 0, true);
            expect(butils.EQUAL(buf, new Buffer([0xff, 0xff, 0xff, 0xff, 0x0f]))).to.equal(true);
            expect(count).to.equal(5);
            done();
        });

        it('can write a zigzag encoded varint with an offset', function (done) {
            var buf = new Buffer(6);

            butils.writeVarint(buf, -2147483648, 1, true);
            expect(butils.EQUAL(buf.slice(1), new Buffer([0xff, 0xff, 0xff, 0xff, 0x0f]))).to.equal(true);
            done();
        });
    });

    describe('#readVarint', function () {
        it('can read a varint', function (done) {
            var buf = new Buffer([0xaa, 0xdf, 0xb7, 0xde, 0x0a]);
            
            var val = butils.readVarint(buf);
            expect(val.num).to.equal(2882400170);
            expect(val.bytes).to.equal(5);
            done();
        });

        it('can read a varint with an offset', function (done) {
            var buf = new Buffer([0xee, 0xaa, 0xdf, 0xb7, 0xde, 0x0a]);
            
            var val = butils.readVarint(buf, 1);
            expect(val.num).to.equal(2882400170);
            expect(val.bytes).to.equal(5);
            done();
        });

        it('can read a zigzag encoded varint', function (done) {
            var buf = new Buffer([0xff, 0xff, 0xff, 0xff, 0x0f]);

            var val = butils.readVarint(buf, 0, true);
            expect(val.num).to.equal(-2147483648);
            expect(val.bytes).to.equal(5);
            done();
        });

        it('can read a zigzag encoded varint with an offset', function (done) {
            var buf = new Buffer([0xee, 0xfe, 0xff, 0xff, 0xff, 0xff, 0x0f]);

            var val = butils.readVarint(buf, 2, true);
            expect(val.num).to.equal(-2147483648);
            expect(val.bytes).to.equal(5);
            done();
        });
    });
});

describe('Helpers', function () {
    describe('#toArray', function () {
        it('can convert a buffer to an array', function (done) {
            var buf = new Buffer([0x0a, 0xbc, 0xde, 0xf0]);

            var val = butils.toArray(buf);
            expect(val.length).to.equal(4);
            expect(val).to.deep.equal([0x0a, 0xbc, 0xde, 0xf0]);
            done();
        });

        it('can convert only part of a buffer to an array', function (done) {
            var buf = new Buffer([0x00, 0xab, 0xcd, 0x00]);

            var val = butils.toArray(buf, 1, 3);
            expect(val.length).to.equal(2);
            expect(val).to.deep.equal([0xab, 0xcd]);
            done();
        });
    });
});

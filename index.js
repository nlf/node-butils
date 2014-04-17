exports._bits =         [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80].reverse();
exports._bitsInverse =  [0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F].reverse();

exports.getBit = function (buf, postion) {
    var bitInByte = (postion - 1) % 8;
    var byteInBuf = Math.floor(postion / 8);

    return (buf[byteInBuf] | exports._bitsInverse[bitInByte]) === 0xFF ? true : false;
};

exports.setBit = function (buf, postion, value) {
    var bitInByte = (postion - 1) % 8;
    var byteInBuf = Math.floor(postion / 8 - 0.001);

    if (value) {
        buf[byteInBuf] = buf[byteInBuf] | exports._bits[bitInByte];
    } else {
        buf[byteInBuf] = buf[byteInBuf] ^ exports._bits[bitInByte];
    }

    return buf[byteInBuf];
};

exports.XOR = function (buf1, buf2) {
    for (var i = 0, ln = buf2.length; i < ln; i++) {
        buf1[i] = buf1[i] ^ buf2[i];
    }

    return buf1;
};

exports.AND = function (buf1, buf2) {
    for (var i = 0, ln = buf2.length; i < ln; i++) {
        buf1[i] = buf1[i] & buf2[i];
    }

    return buf1;
};

exports.OR = function (buf1, buf2) {
    for (var i = 0, ln = buf2.length; i < ln; i++) {
        buf1[i] = buf1[i] | buf2[i];
    }

    return buf1;
};

exports.NOT = function (buf) {
    for (var i = 0, ln = buf.length; i < ln; i++) {
        buf[i] = ~ buf[i];
    }

    return buf;
};

exports.EQUAL = function (buf1, buf2) {
    if (buf1.length !== buf2.length) return false;

    var equal = true;
    var length = buf1.length;
    var index = 0;

    while (equal && index < length) {
        if (buf1[index] === buf2[index]) {
            index++;
        } else {
            equal = false;
        }
    }

    return equal;
};

exports.leftShift = function (buf, offset) {
    if (buf.length === 1) return new Buffer([buf[0] << offset]);

    var byteOffset = offset % 8;
    var bufferOffset = (offset - byteOffset) / 8;
    var lastByteChange = 0;

    for (var i = 0, ln = buf.length - bufferOffset + 1; i < ln; i++) {
        buf[i] = ((buf[i + bufferOffset] << byteOffset) | (buf[i + bufferOffset + 1] >>> (8 - byteOffset)));
        lastByteChange = i;
    }

    if (byteOffset === 0) byteOffset = 8;

    buf[lastByteChange + 1] = buf[lastByteChange + 1] >>> byteOffset << byteOffset;

    if (offset > 8) for (i = lastByteChange + 1, ln = buf.length; i < ln; i++) { buf[i] = 0x00; }

    return buf;
};

exports.rightShift = function (buf, offset) {
    if (buf.length === 1) return new Buffer([buf[0] >>> offset]);

    var byteOffset = offset % 8;
    var bufferOffset = (offset - byteOffset) / 8;
    var lastByteChange = buf.length;

    for (var i = buf.length - 1, ln = bufferOffset; i > ln; i--) {
        buf[i] = ((buf[i - bufferOffset] >>>  byteOffset) | (buf[i - bufferOffset - 1] << (8 - byteOffset)));
        lastByteChange = i;
    }

    buf[lastByteChange - 1] = buf[lastByteChange - bufferOffset - 1] >>> byteOffset;

    if (bufferOffset > 0) for (i = lastByteChange - 2; i >= 0; i--) { buf[i] = 0x00; }

    return buf;
};

exports.signedRightShift = function (buf, offset) {
    if (buf.length === 1) return  new Buffer([((buf[0] >> offset) ^ (-128 >> (offset - 1)))]);
    if (!exports.getBit(buf, 1)) return exports.rightShift(buf, offset);

    var byteOffset = offset % 8;
    var bufferOffset = (offset - byteOffset) / 8;
    var lastByteChange = buf.length;

    for (var i = buf.length - 1, ln = bufferOffset; i > ln; i--) {
        buf[i] = ((buf[i - bufferOffset] >>>  byteOffset) | (buf[i - bufferOffset - 1] << (8 - byteOffset)));
        lastByteChange = i;
    }

    buf[lastByteChange - 1] = byteOffset === 0 ? buf[lastByteChange - bufferOffset - 1] : ((buf[lastByteChange - bufferOffset - 1] >> byteOffset) ^ (-128 >> (byteOffset - 1)));

    if (bufferOffset > 0) for (i = lastByteChange - 2; i >= 0; i--) { buf[i] = 0xFF; }

    return buf;
};

exports.readString = function (buf, start, end) {
    var pos = start || 0;
    var last = end || buf.length;
    var res = '';
    var byte, byte2;

    while (pos < last) {
        byte = buf[pos];
        if (byte > 191 && byte < 224) {
            pos++;
            byte = ((byte & 0x1F) << 6) | (buf[pos] & 0x3F);
        } else if (byte > 128 || byte > 224) {
            byte2 = buf[pos + 1];
            pos += 2;
            byte = ((byte & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (buf[pos] & 0x3F);
        }
        res += String.fromCharCode(byte);
        pos++;
    }

    return res;
};

exports.writeString = function (buf, str, offset) {
    var pos = offset || 0;

    for (var i = 0; i < str.length; i++) {
        buf[pos] = str.charCodeAt(i);
        pos++;
    }
};

exports.readInt = function (buf, offset) {
    offset = offset || 0;
    return buf[offset];
};

exports.writeInt = function (buf, int, offset) {
    offset = offset || 0;
    buf[offset] = int;
};

exports.readInt32 = function (buf, offset) {
    offset = offset || 0;
    return (buf[offset] << 24 >>> 0) + ((buf[offset + 1] << 16) | (buf[offset + 2] << 8) | (buf[offset + 3]));
};

exports.readInt32LE = function (buf, offset) {
    offset = offset || 0;
    return (buf[offset + 3] << 24 >>> 0) + ((buf[offset + 2] << 16) | (buf[offset + 1] << 8) | (buf[offset]));
};

exports.writeInt32 = function (buf, int, offset) {
    offset = offset || 0;
    buf[offset] = int >> 24;
    buf[offset + 1] = int >> 16;
    buf[offset + 2] = int >> 8;
    buf[offset + 3] = int;
};

exports.readVarint = function (buf, offset, signed) {
    offset = offset || 0;
    var res = 0;
    var pos = offset;
    var shift = 0;
    var byte;

    do {
        byte = buf[pos++];
        if (shift < 28) {
            res |= (byte & 0x7F) << shift;
        } else {
            res |= (byte & 0x7F) * Math.pow(2, shift);
        }
        shift += 7;
    } while (byte >= 0x80);

    if (signed) {
        res = (res >>> 1) ^ -(res & 1);
    } else {
        res >>>= 0;
    }

    return { num: res, bytes: pos - offset };
};

exports.writeVarint = function (buf, num, offset, signed) {
    var pos = offset || 0;

    if (signed) num = (num << 1) ^ (num >> 63);

    num >>>= 0;

    while ((num & ~0x7F) >>> 0) {
        buf[pos++] = ((num & 0xFF) >>> 0) | 0x80;
        num >>>= 7;
    }

    buf[pos] = num;

    return pos + 1;
};

exports.toArray = function (buf, start, end) {
    var pos = start || 0;
    var last = end || buf.length;
    var ret = [];

    while (pos < last) {
        ret.push(buf[pos]);
        pos++;
    }

    return ret;
};

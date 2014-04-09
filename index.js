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
    var byteOffset = offset % 8;
    var bufferOffset = (offset - byteOffset) / 8;
    var newbuf = new Buffer(buf.length);
    //       iter,  | length = buffer length minus number of bytes total shifted plus one if we need to grab bits form one more byte
    for (var i = 0, ln = buf.length - (bufferOffset + byteOffset > 0 ? 1 : 0); i < ln; i++) {
        newbuf[i] = ((buf[i + bufferOffset] << byteOffset) & (buf[i + bufferOffset + 1] >>> (8 - byteOffset)));
    }
    return newbuf;
};

exports.rightShift = function (buf, offset) {
    var byteOffset = offset % 8;
    var bufferOffset = (offset - byteOffset) / 8;
    var newbuf = new Buffer(buf.length);

    for (var i = buf.length - 1, ln = (bufferOffset + byteOffset > 0 ? 1 : 0); i > ln; i--) {
        newbuf[i] = ((buf[i - bufferOffset - 1] << byteOffset) & (buf[i - bufferOffset] >>> (8 - byteOffset)));
    }
    return newbuf;
};

exports.readString = function (buf, start, end) {
    var pos = start || 0,
        last = end || buf.length,
        res = '',
        byte,
        byte2;
    while (pos < last) {
        byte = buf[pos];
        if (byte > 191 && byte < 224) {
            pos++;
            byte = ((byte & 0x1F) << 6) | (buf[pos] & 0x3F);
        } else if ((byte > 128 && byte < 191) || byte > 224) {
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

exports.readVarint = function (buf, offset, zigzag) {
    var byte,
        res = 0,
        pos = offset || 0;
    do {
        byte = buf[pos];
        res += (byte & 0x7F) << (7 * (pos - offset));
        pos++;
    } while (byte >= 0x80);
    if (zigzag) res = (res >>> 1) ^ -(res & 1);
    return { num: res, bytes: (pos - offset) };
};

exports.writeVarint = function (buf, num, offset, zigzag) {
    var pos = offset || 0;
    if (zigzag) num = (num << 1) ^ (num >> 63);
    while (num >= 0x80) {
        buf[pos] = num | 0x80;
        num = num >> 7;
        pos++;
    }
    buf[pos] = num;
};

exports.toArray = function (buf, start, end) {
    var pos = start || 0,
        last = end || buf.length,
        ret = [];
    while (pos < last) {
        ret.push(buf[pos]);
        pos++;
    }
    return ret;
};

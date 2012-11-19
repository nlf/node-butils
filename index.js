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

exports.writeInt32 = function (buf, int, offset) {
    offset = offset || 0;
    buf[offset] = int >> 24;
    buf[offset + 1] = int >> 16;
    buf[offset + 2] = int >> 8;
    buf[offset + 3] = int;
};

exports.readVarint = function (buf, offset) {
    var byte,
        res = 0,
        pos = offset || 0;
    do {
        byte = buf[pos];
        res += (byte & 0x7F) << (7 * (pos - offset));
        pos++;
    } while (byte >= 0x80);
    return { num: res, bytes: (pos - offset) };
};

exports.writeVarint = function (buf, num, offset) {
    var pos = offset || 0;
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

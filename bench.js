var butils = require('./index'),
    buf = new Buffer(50),
    val;

console.log('\n');
console.time('Buffer#writeInt8');
for (var i = 0; i < 100000000; i++) {
    buf.writeInt8(100, 0, true);
}
console.timeEnd('Buffer#writeInt8');

console.time('butils#writeInt');
for (var i = 0; i < 100000000; i++) {
    butils.writeInt(buf, 100, 0);
}
console.timeEnd('butils#writeInt');

console.log('\n');

console.time('Buffer#readInt8');
for (var i = 0; i < 100000000; i++) {
    val = buf.readInt8(0, true);
}
console.timeEnd('Buffer#readInt8');

console.time('butils#readInt');
for (var i = 0; i < 100000000; i++) {
    val = butils.readInt(buf, 0);
}
console.timeEnd('butils#readInt');

console.log('\n');
console.time('Buffer#writeUInt32BE');
for (var i = 0; i < 100000000; i++) {
    buf.writeUInt32BE(654321, 0, true);
}
console.timeEnd('Buffer#writeUInt32BE');

console.time('butils#writeInt32');
for (var i = 0; i < 100000000; i++) {
    butils.writeInt32(buf, 654321, 0);
}
console.timeEnd('butils#writeInt32');

console.log('\n');
console.time('Buffer#readUInt32BE');
for (var i = 0; i < 100000000; i++) {
    val = buf.readUInt32BE(0, true);
}
console.timeEnd('Buffer#readUInt32BE');

console.time('butils#readInt32');
for (var i = 0; i < 100000000; i++) {
    val = butils.readInt32(buf, 0);
}
console.timeEnd('butils#readInt32');

console.log('\n');
console.time('Buffer#write');
for (var i = 0; i < 100000000; i++) {
    buf.write('test', 'utf8', 0);
}
console.timeEnd('Buffer#write');

console.time('butils#writeString');
for (var i = 0; i < 100000000; i++) {
    butils.writeString(buf, 'test', 0);
}
console.timeEnd('butils#writeString');

console.log('\n');
console.time('Buffer#toString');
for (var i = 0; i < 100000000; i++) {
    val = buf.toString('utf8', 0, 4);
}
console.timeEnd('Buffer#toString');

console.time('butils#readString');
for (var i = 0; i < 100000000; i++) {
    val = butils.readString(buf, 0, 4);
}
console.timeEnd('butils#readString');

console.log('\n');
console.time('butils#writeVarint');
for (var i = 0; i < 100000000; i++) {
    butils.writeVarint(buf, 654321, 0);
}
console.timeEnd('butils#writeVarint');

console.log('\n');
console.time('butils#readVarint');
for (var i = 0; i < 100000000; i++) {
    val = butils.readVarint(buf, 0);
}
console.timeEnd('butils#readVarint');
console.log('\n');

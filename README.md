butils
------

These are some helper functions that appear to be significantly faster than core Buffer manipulation functions.

Functions included

* readInt(buffer, offset) -- (buffer.readInt8(offset))
* writeInt(buffer, int, offset) -- (buffer.writeInt8(int, offset))
* readInt32(buffer, offset) -- (buffer.readUInt32BE(offset))
* writeInt32(buffer, int, offset) -- (buffer.writeUInt32BE(int, offset))
* readString(buffer, start, end) -- (buffer.toString(start, end))
* writeString(buffer, str, offset) -- (Buffer.write(str, 'utf8', offset))
* readVarint(buffer, offset) -- (no equivalent)
* writeVarint(buffer, int, offset) -- (no equivalent)

Note that the Int32 functions are currently unsigned and big endian only, though I'd happily accept pull requests to add more functionality.

Benchmark
=========

100,000,000 iterations of each function. (see bench.js)

* Buffer#writeInt8: 15230ms
* butils#writeInt: 165ms
* 
* Buffer#readInt8: 3074ms
* butils#readInt: 162ms
* 
* Buffer#writeUInt32BE: 9873ms
* butils#writeInt32: 258ms
* 
* Buffer#readUInt32BE: 4405ms
* butils#readInt32: 322ms
* 
* Buffer#write: 46346ms
* butils#writeString: 2414ms
* 
* Buffer#toString: 17275ms
* butils#readString: 7516ms
* 
* butils#writeVarint: 1273ms
* 
* butils#readVarint: 4426ms

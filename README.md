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

* Buffer#writeInt8: 1225ms
* butils#writeInt: 166ms
* 
* Buffer#readInt8: 761ms
* butils#readInt: 164ms
* 
* Buffer#writeUInt32BE: 1544ms
* butils#writeInt32: 257ms
* 
* Buffer#readUInt32BE: 1525ms
* butils#readInt32: 323ms
* 
* Buffer#write: 45101ms
* butils#writeString: 2509ms
* 
* Buffer#toString: 17505ms
* butils#readString: 7340ms
* 
* butils#writeVarint: 1264ms
* 
* butils#readVarint: 4777ms

const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(4); // 4 bytes 32 bits
memoryContainer[0] = 0xF4;
memoryContainer[1] = 0xb4;
memoryContainer[2] = 0x00;
memoryContainer[3] = 256;
console.log(memoryContainer);

console.log(memoryContainer.toString('hex'))
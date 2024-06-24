const { Buffer } = require("buffer");
const binToAlloc = "0100 1000 0110 1001 0010 0001";
const memory = Buffer.alloc(3);
memory[0] = 0x48;
memory[1] = 0x69;
memory[2] = 0x21;

console.log(memory.toString("utf-8"));

// ---
const binary = binToAlloc.split(" ");
const memory2 = Buffer.alloc(binary.length / 2);

// bits to bytes
for (let i = 1; i < binary.length; i += 2) {
  const bin = binary[i - 1] + binary[i];
  console.log(bin);
  memory2[i] = parseInt(bin, 2);
}
console.log("memory2", memory2.toString("utf-8"));

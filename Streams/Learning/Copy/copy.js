const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

// Memory Usage: file size

// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   // returns all contents up to max 2GB
//   const result = await fs.readFile("src.txt");
//   await destFile.write(result);

//   console.timeEnd("copy");
// })();

// uses buffers
// (async () => {
//   console.time("copy2");
//   const srcFile = await fs.open("src.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     //returns a chunk 16384 bytes
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }

// using streams
//Time 44ms
// (async () => {
//   console.time("streams");
//   const srcFile = await fs.open("src.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   const readStream = srcFile.createReadStream();
//   const writeStream = destFile.createWriteStream();

//   readStream.pipe(writeStream);

//   readStream.on("end", () => {
//     console.timeEnd("streams");
//   });
// })();

// using pipeline
(async () => {
  console.time("pipeline");
  const srcFile = await fs.open("src.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  pipeline(readStream, writeStream, (err) => {
    console.log(err);
    console.timeEnd("pipeline");
  });
})();

const fs = require("node:fs/promises");
// const fs = require("node:fs");

// Execution Time: 27s
// CPU Usage: 11%
// Memory Usage: 15.6 MB
// (async () => {
//   console.time("writeMany");

//   // 1: open test.txt
//   const fileHandler = await fs.open("./test.txt", "w");

//   for (let i = 0; i < 1000000; i++) {
//     await fileHandler.write("victor von ");
//   }

//   fileHandler.close();
//   console.timeEnd("writeMany");
// })();

// Execution Time: 445ms
// CPU Usage: 19%
// Memory Usage: 700 MB
// (async () => {
//   console.time("writeMany");

//   // 1: open test.txt
//   fs.open("./test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       fs.write(fd, `${i} `,()=>{});
//     }
//   });

//   console.timeEnd("writeMany");
// })();

// Execution Time: 439ms
// CPU Usage: 19%
// Memory Usage: 28 MB

// (async () => {
//   console.time("writeMany");

//   // 1: open test.txt
//   fs.open("./test.txt", "w", (err, fd) => {
//     const buff = Buffer.from("MF DOOM", "utf-8");
//     for (let i = 0; i < 1000000; i++) {
//       fs.writeSync(fd, buff);
//     }
//   });

//   console.timeEnd("writeMany");
// })();


// DON'T DO IT THIS WAY!!!
// Execution Time: 288ms
// CPU Usage: 240 MB
// Memory Usage: 3%
(async () => {
  console.time("writeMany");

  // 1: open test.txt
  const fileHandler = await fs.open("./test.txt", "w");

  const stream = fileHandler.createWriteStream();

  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from("victor von ", "utf-8");
    stream.write(buff);
  }

  fileHandler.close();
  console.timeEnd("writeMany");
})();

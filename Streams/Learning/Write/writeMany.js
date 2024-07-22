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

// Execution Time: 4ms
// CPU Usage: 20.2 MB
// Memory Usage: 0.3%
(async () => {
  console.time("writeMany");

  // 1: open test.txt
  const fileHandler = await fs.open("./Streams/Learning/Write/test.txt", "w");

  const stream = fileHandler.createWriteStream();

  console.log(stream.writableHighWaterMark);
  console.log(stream.writableLength);

  /*
  8 bits = 1 byte
  100 bytes = 1 kilobyte
  1000 kilobytes = 1 megabyte

  1a => 00011010
  */
  // const buff = Buffer.alloc(16383, "A");
  // console.log(stream.write(buff));
  // console.log(stream.write(Buffer.alloc(1, "A")));

  // stream.on("drain", () => {
  //   //buffer is now emptied
  //   console.log("now safe to write more to stream");
  // });
  /* 
  When the writableLength in stream gets to 16kb (~16,000 bytes)
  the stream will write to resource
   */
  let i = 0;
  const writeMany = () => {
    const limit = 1000000;
    while (i < limit) {
      const buff = Buffer.from("victor von ", "utf-8");

      // last write
      if (i === limit - 1) {
        // should not write after end bcz it marks as done
        return stream.end(buff);
      }

      //stops loop when buffer is full
      if (!stream.write(buff)) break;

      i++;
    }
  };
  writeMany();

  // resume loop when stream is emptied
  stream.on("drain", () => {
    console.log("is draining..");
    writeMany();
  });

  stream.on("finish", () => {
    fileHandler.close();
    console.timeEnd("writeMany");
  });
})();

/**
 * console logging in drain event shows it was called 641 times
 * the test.txt file size is 11,007,381 bytes. Dividing file size by stream limit (16,384 bytes) validates
 * drain events
 */
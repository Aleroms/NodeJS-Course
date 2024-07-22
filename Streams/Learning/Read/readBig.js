const fs = require("node:fs/promises");

(async () => {
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");
  // can modify highWaterMark by passing an object with it and new value.
  const streamRead = fileHandleRead.createReadStream();
  const streamWrite = fileHandleWrite.createWriteStream();
  //we can consume data coming from stream by adding an event listener
  //to the stream
  streamRead.on("data", (chunk) => {
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
  });
  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();

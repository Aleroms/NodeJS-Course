// watching a file
const fs = require("fs/promises");
const { off } = require("process");

(async () => {
  const createFile = async (path) => {
    //create a file with the path given that is empty
    try {
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      // file already exists
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was successfully created");
      newFileHandle.close();
    }
  };
  // commands
  const CREATE_FILE = "create a file";
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const fileSize = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(fileSize);

    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    // we want to read the content changed - beg 2 end
    await commandFileHandler.read(buff, offset, length, position);

    // decoder 01 => meaningful
    // encoder meaningful => 01

    const command = buff.toString("utf-8");

    // create a file:
    // creates a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

// watching a file
const fs = require("fs/promises");

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
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

  const deleteFile = async (path) => {
    // deletes a file with the path given
    console.log("attempting to delete path:", path);
    try {
      await fs.rm(path);
      console.log("file deleted successfully");
    } catch (error) {
      console.log(`Error removing file ${path}.`);
    }
  };

  const renameFile = async (oldPath, newPath) => {
    console.log(`Renaming ${oldPath} to ${newPath}`);
    try {
      await fs.rename(oldPath, newPath);
      console.log("file renamed successfully");
    } catch (error) {
      console.log(
        `Error renaming ${oldPath} to ${newPath}\nPlease check if file exists.`
      );
      console.log(error);
    }
  };

  const addToFile = async (path, content) => {
    console.log(`Adding to ${path}`);
    console.log(`Content ${path}`);

    try {
      await fs.appendFile(path, content);
      console.log("successfully appended content to file.");
    } catch (error) {
      console.log(`Error in appending ${content} to file ${path}`);
      console.log(error);
    }
  };

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

    // deleting a file
    // delete the file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename file:
    // rename the file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }

    // add to file:
    // ad to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

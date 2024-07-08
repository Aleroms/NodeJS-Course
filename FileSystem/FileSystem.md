# Node.js File Watching and Command Execution
## Learning Objectives
- Understand how to monitor file changes using Node.js fs.watch.
- Implement a system to execute commands based on the content of a watched file.
- Handle file creation, deletion, renaming, and content appending based on commands.
- Gain experience with asynchronous file operations and event handling.
## Summary
The provided code demonstrates a Node.js script that watches a file named command.txt. When changes occur in this file, the script reads the new content, interprets it as a command, and performs the corresponding file operation.

The script supports the following commands:

`create a file <path>`: Creates a new file at the specified path.
`delete a file <path>`: Deletes the file at the given path.
`rename a file <path> to <new-path>`: Renames a file from the old path to the new path.
`add to the file <path> this content: <content>`: Appends content to the specified file.
Code Explanation
```javaScript
// watching a file
const fs = require("fs/promises");

(async () => {
  // ... (command constants and file operation functions)

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // Read the content of command.txt
    // ...
    
    // Decode the content and extract the command
    // ...

    // Execute the command based on its type
    // ...
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
```
1. **File Opening and Event Handling**: The script opens command.txt in read mode ("r") and attaches a change event handler to the file handler (commandFileHandler).

2. **Change Event Trigger**: When the fs.watch detects a change in command.txt, it emits a change event. This event triggers the attached event handler in commandFileHandler.

3. **Reading and Decoding Command**: The event handler reads the file content, decodes it from a buffer to a string (using buff.toString("utf-8")), and extracts the command by parsing the string.

4. **Command Execution**: Based on the extracted command, the corresponding function (createFile, deleteFile, renameFile, or addToFile) is called to perform the file operation.

5. **Watcher Loop**: The fs.watch function continues to monitor command.txt for changes in an asynchronous loop. When a change occurs, the event handler is triggered again, repeating the process.

### Example Usage
1. Create a file named command.txt in the same directory as the script.
2. Write commands in the following format:
- create a file test.txt
- delete a file test.txt
- rename a file test.txt to newfile.txt
- add to the file test.txt this content: Hello, world!
3. Save the changes to command.txt. The script will automatically execute the commands.
## Key Points
- The script relies on the fs.watch function for monitoring file changes. This is a convenient way to trigger actions when specific files are modified.
- The use of fs.promises allows for asynchronous file operations, preventing the script from blocking while waiting for file system interactions to complete.
- The code includes error handling to manage cases where files might not exist or operations fail.
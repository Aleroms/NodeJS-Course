# Node.js Streams: A Deep Dive

## Learning Objectives

- Understand the fundamental concepts and benefits of streams in Node.js.
- Learn how to implement readable, writable, and duplex streams.
- Apply stream techniques to efficiently handle large datasets and file operations.
- Optimize stream performance and memory usage.

## Summary

In Node.js, streams provide a powerful way to handle data flow, especially when dealing with large files or continuous data sources. By processing data in chunks rather than loading everything into memory at once, streams enable efficient memory utilization and faster execution.

The writeMany.js example demonstrates the use of writable streams for writing large amounts of data to a file. By optimizing the writing process and using the drain event, we achieve efficient and controlled data flow.

## Sections

### What are Streams?

Streams are abstract interfaces for working with streaming data in Node.js. They allow you to read or write data continuously, piece by piece, without having to load the entire dataset into memory. This makes streams ideal for handling large files, network connections, and real-time data processing.

### Types of Streams

**Readable Streams**: Used for reading data from a source, such as a file or network socket.
**Writable Streams**: Used for writing data to a destination, like a file or network connection.
**Duplex Streams**: Capable of both reading and writing data, like a TCP socket.
**Transform Streams**: A special type of duplex stream that modifies data as it passes through.
`writeMany.js` Example
The writeMany.js code provides three different approaches for writing data to a file:

1. **Using** `fs.promises`: This method is the most straightforward for simple file writing tasks.
2. **Using** `fs.open` and `fs.write`: This approach allows for more control over the writing process but can be more complex.
3. **Using** `fs.open` and `fs.writeSync`: This method is the fastest for synchronous writing but can block the event loop for large writes.
4. **Using** `fs.open` and `streams`: This method is the most optimized example in memory and time efficiency.

### Method 1: **Using** `fs.promises`

```javascript
(async () => {
  console.time("writeMany");

  // 1: open test.txt
  const fileHandler = await fs.open("./test.txt", "w");

  for (let i = 0; i < 1000000; i++) {
    await fileHandler.write("victor von ");
  }

  fileHandler.close();
  console.timeEnd("writeMany");
})();
```

- **Execution Time**: 27s
- **CPU Usage**: 11%
- **Memory Usage**: 15.6 MB

### Method 2: **Using** `fs.open` and `fs.write`

```javascript
(async () => {
  console.time("writeMany");

  // 1: open test.txt
  fs.open("./test.txt", "w", (err, fd) => {
    for (let i = 0; i < 1000000; i++) {
      fs.write(fd, `${i} `, () => {});
    }
  });

  console.timeEnd("writeMany");
})();
```

- **Execution Time**: 445ms
- **CPU Usage**: 19%
- **Memory Usage**: 700 MB

### Method 3: **Using** `fs.open` and `fs.writeSync`

```javascript
(async () => {
  console.time("writeMany");

  // 1: open test.txt
  fs.open("./test.txt", "w", (err, fd) => {
    const buff = Buffer.from("MF DOOM", "utf-8");
    for (let i = 0; i < 1000000; i++) {
      fs.writeSync(fd, buff);
    }
  });

  console.timeEnd("writeMany");
})();
```

- **Execution Time**: 439ms
- **CPU Usage**: 19%
- **Memory Usage**: 28 MB

### Method 4: **Using** `streams`
```javascript
(async () => {
  console.time("writeMany");

  const fileHandler = await fs.open("./Streams/Learning/test.txt", "w");

  const stream = fileHandler.createWriteStream();

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
```
- **Execution Time**: 4ms
- **CPU Usage**: 0.3%
- **Memory Usage**: 20.2 MB

## Advantages of Using Streams

- Memory Efficiency: Streams process data in chunks, reducing memory footprint.
- Time Efficiency: Streams can start processing data as soon as it's available, leading to faster execution.
- Composability: Streams can be easily chained together to create complex data processing pipelines.

## When to Use Streams

Streams are a good choice when:

- Dealing with large datasets that won't fit entirely in memory.
- Processing data that arrives in chunks or continuously.
- Building real-time applications with continuous data flow.

## Best Practices

- Use appropriate stream types (readable, writable, duplex, or transform) based on your requirements.
- Handle backpressure to avoid overwhelming the system.
- Consider using libraries like stream-buffers or through2 to simplify stream operations.
- Test and optimize your stream pipelines for performance.
- Prefer asynchronous stream operations for non-blocking behavior.

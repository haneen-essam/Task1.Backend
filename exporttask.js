const EventEmitter = require("events");
const fs = require("fs/promises");
const path = require("path");

const myEmitter = new EventEmitter();

myEmitter.on("mergeFiles", async (data1, data2) => {
    try {
        const combinedData = data1 + "\n\n" + data2;
        const outputPath = path.join(__dirname, "file3.txt"); 

        await fs.writeFile(outputPath, combinedData, "utf-8");
        console.log("[Event Triggered] Files merged and written to file3.txt successfully!");
    } catch (err) {
        console.error("Error writing to file:", err.message);
    }
});

module.exports = myEmitter;
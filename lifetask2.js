const myEmitter = require("./exporttask");
const fs = require("fs/promises");
const path = require("path");

console.log("Reading files asynchronously...");

async function readAndMerge() {
    try {
        const file1Path = path.join(__dirname, "file1.txt");
        const file2Path = path.join(__dirname, "file2.txt");
        const [data1, data2] = await Promise.all([
            fs.readFile(file1Path, "utf-8"),
            fs.readFile(file2Path, "utf-8")
        ]);
        
        myEmitter.emit("mergeFiles", data1, data2);

    } catch (err) {
        console.error("Error reading files:", err.message);
    }
}

readAndMerge();
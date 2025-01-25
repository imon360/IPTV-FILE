const fs = require("fs");
const path = require("path");

function mergeM3UFiles(inputFilePaths, outputFilePath) {
    const combinedLines = ["#EXTM3U"]; // Start the combined file with the M3U header

    inputFilePaths.forEach((filePath) => {
        const m3uContent = fs.readFileSync(filePath, "utf-8");
        const lines = m3uContent.split("\n");

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine && trimmedLine !== "#EXTM3U") {
                // Skip empty lines and duplicate M3U headers
                combinedLines.push(trimmedLine);
            }
        });
    });

    // Write the combined file
    fs.writeFileSync(outputFilePath, combinedLines.join("\n"), "utf-8");
    console.log(`Combined M3U file saved to: ${outputFilePath}`);
}

// Usage
const inputFilesDirectory = "./../"; // Directory containing the M3U files
const outputFilePath = "combined.m3u"; // Output file path

// Get all M3U files from the directory
const inputFilePaths = fs.readdirSync(inputFilesDirectory)
    .filter((file) => file.endsWith(".m3u"))
    .map((file) => path.join(inputFilesDirectory, file));

// Combine the M3U files into a single file
mergeM3UFiles(inputFilePaths, outputFilePath);

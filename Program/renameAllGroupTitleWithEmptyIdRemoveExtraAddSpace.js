const fs = require("fs");

function processM3UFile(inputFilePath, outputFilePath, unifiedGroupTitle = "Entertainment") {
    // Read the M3U file
    const m3uContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = m3uContent.split("\n");

    const updatedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith("#EXTINF")) {
            // Handle group-title
            if (line.match(/group-title="([^"]*)"/i)) {
                line = line.replace(/group-title="([^"]*)"/i, `group-title="${unifiedGroupTitle}"`);
            } else {
                line = line.replace(/#EXTINF([^,]*)/, `#EXTINF$1 group-title="${unifiedGroupTitle}"`);
            }

            // Handle tvg-id
            if (line.match(/tvg-id="([^"]*)"/i)) {
                line = line.replace(/tvg-id="([^"]*)"/i, `tvg-id=""`); // Empty existing tvg-id
            } else {
                line = line.replace(/#EXTINF([^,]*)/, `#EXTINF$1 tvg-id=""`); // Add missing tvg-id
            }

            // Remove tvg-chno and tvg-country attributes
            line = line.replace(/tvg-chno="[^"]*"/i, ""); // Remove tvg-chno if present
            line = line.replace(/tvg-country="[^"]*"/i, ""); // Remove tvg-country if present

            // Cleanup any unnecessary spaces caused by removed attributes
            line = line.replace(/\s{2,}/g, " ").trim(); // Replace multiple spaces with a single space

            updatedLines.push(line);
        } else if (line.startsWith("http") || line.startsWith("rtmp")) {
            // Push the URL and ensure the next line is an empty line
            updatedLines.push(line);
            updatedLines.push(""); // Add a single empty line
        }
    }

    // Remove consecutive empty lines
    const finalLines = [];
    let lastLineEmpty = false;

    for (const line of updatedLines) {
        if (line.trim() === "") {
            if (!lastLineEmpty) {
                finalLines.push(""); // Add a single empty line
            }
            lastLineEmpty = true;
        } else {
            finalLines.push(line);
            lastLineEmpty = false;
        }
    }

    // Write updated content to the output file
    fs.writeFileSync(outputFilePath, finalLines.join("\n"), "utf-8");
    console.log(`Processed M3U file saved to: ${outputFilePath}`);
}

// Usage
const inputFilePath = "original.m3u"; // Replace with your input file path
const outputFilePath = "processed.m3u"; // Replace with your desired output file path

// Process the M3U file and apply all changes
processM3UFile(inputFilePath, outputFilePath, "Entertainment");

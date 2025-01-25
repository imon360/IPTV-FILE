const fs = require("fs");

function processM3UFile(inputFilePath, outputFilePath, unifiedGroupTitle = "Entertainment") {
    // Read the M3U file
    const m3uContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = m3uContent.split("\n");

    const updatedLines = [];
    let previousLineWasChannelLink = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim(); // Changed from const to let

        if (line.startsWith("#EXTINF")) {
            // Handle group-title
            if (line.match(/group-title="([^"]*)"/i)) {
                line = line.replace(/group-title="([^"]*)"/i, `group-title="${unifiedGroupTitle}"`);
            } else {
                line = line.replace(/#EXTINF([^,]*)/, `#EXTINF$1 group-title="${unifiedGroupTitle}"`);
            }

            // Handle tvg-id based on tvg-name
            const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
            if (tvgNameMatch) {
                const tvgName = tvgNameMatch[1].replace(/\s+/g, ""); // Remove spaces from tvg-name
                if (line.match(/tvg-id="([^"]*)"/i)) {
                    line = line.replace(/tvg-id="([^"]*)"/i, `tvg-id="${tvgName}"`);
                } else {
                    line = line.replace(/#EXTINF([^,]*)/, `#EXTINF$1 tvg-id="${tvgName}"`);
                }
            }

            // Remove tvg-chno and tvg-country attributes
            line = line.replace(/tvg-chno="[^"]*"/i, ""); // Remove tvg-chno if present
            line = line.replace(/tvg-country="[^"]*"/i, ""); // Remove tvg-country if present

            // Cleanup any unnecessary spaces caused by removed attributes
            line = line.replace(/\s{2,}/g, " ").trim(); // Replace multiple spaces with a single space

            updatedLines.push(line);
            previousLineWasChannelLink = false; // Reset for the next HTTP line
        } else if (line.startsWith("http") || line.startsWith("rtmp")) {
            // Add the channel URL and ensure one empty line after it
            updatedLines.push(line);
            updatedLines.push(""); // Add an empty line
            previousLineWasChannelLink = true;
        } else if (line === "") {
            // Skip multiple empty lines
            if (!previousLineWasChannelLink) {
                updatedLines.push("");
                previousLineWasChannelLink = true;
            }
        } else {
            // Non-EXTINF, non-URL lines (e.g., comments)
            updatedLines.push(line);
            previousLineWasChannelLink = false;
        }
    }

    // Write updated content to the output file
    fs.writeFileSync(outputFilePath, updatedLines.join("\n").trim() + "\n", "utf-8");
    console.log(`Processed M3U file saved to: ${outputFilePath}`);
}

// Usage
const inputFilePath = "original.m3u"; // Replace with your input file path
const outputFilePath = "processed.m3u"; // Replace with your desired output file path

// Process the M3U file and apply all changes
processM3UFile(inputFilePath, outputFilePath, "Entertainment");

const fs = require("fs");

function renameAllGroupTitlesWithSingleDefault(inputFilePath, outputFilePath, unifiedGroupTitle = "Entertainment") {
    // Read the M3U file
    const m3uContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = m3uContent.split("\n");

    // Process lines and replace or add group-title
    const updatedLines = lines.map(line => {
        if (line.startsWith("#EXTINF")) {
            // Replace existing group-title or add if missing
            if (line.match(/group-title="([^"]*)"/i)) {
                return line.replace(/group-title="([^"]*)"/i, `group-title="${unifiedGroupTitle}"`);
            }
            // Add unified group-title if no group-title exists
            return line.replace(/#EXTINF([^,]*)/, `#EXTINF$1 group-title="${unifiedGroupTitle}"`);
        }
        return line; // Leave non-#EXTINF lines unchanged
    });

    // Write updated content to the output file
    fs.writeFileSync(outputFilePath, updatedLines.join("\n"), "utf-8");
    console.log(`All group-titles have been renamed to "${unifiedGroupTitle}" and saved to: ${outputFilePath}`);
}

// Usage
const inputFilePath = "original.m3u"; // Replace with your input file path
const outputFilePath = "renamed.m3u"; // Replace with your desired output file path

// Rename all group-title values to "Entertainment"
renameAllGroupTitlesWithSingleDefault(inputFilePath, outputFilePath, "Entertainment");

const fs = require("fs");

function processTvgLogo(inputFilePath, outputFilePath) {
    // Read the M3U file
    const m3uContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = m3uContent.split("\n");

    const updatedLines = lines.map((line) => {
        let trimmedLine = line.trim();

        // Process only lines with `#EXTINF` containing `tvg-logo`
        if (trimmedLine.startsWith("#EXTINF") && /tvg-logo="([^"]*)"/i.test(trimmedLine)) {
            trimmedLine = trimmedLine.replace(/tvg-logo="([^"]*)"/i, (match, logoValue) => {
                // Check if the logo value starts with "data:image" (case-insensitive)
                if (logoValue.toLowerCase().startsWith("data:image")) {
                    return `tvg-logo=""`; // Set `tvg-logo` to empty
                }
                return match; // Leave unchanged if not starting with "data:image"
            });
        }

        return trimmedLine;
    });

    // Write the updated content to the output file
    fs.writeFileSync(outputFilePath, updatedLines.join("\n"), "utf-8");
    console.log(`Processed M3U file saved to: ${outputFilePath}`);
}

// Usage
const inputFilePath = "original.m3u"; // Replace with your input file path
const outputFilePath = "processed.m3u"; // Replace with your desired output file path

processTvgLogo(inputFilePath, outputFilePath);

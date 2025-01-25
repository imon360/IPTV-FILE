const fs = require("fs");

function organizeM3U(inputFilePath, outputFilePath) {
    // Read the M3U file
    const m3uContent = fs.readFileSync(inputFilePath, "utf-8");
    const lines = m3uContent.split("\n");

    // Initialize groups
    const groups = {};

    // Parse the M3U file
    let currentGroup = "Uncategorized";
    let channelInfo = "";

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith("#EXTINF")) {
            const match = line.match(/group-title="([^"]+)"/);
            currentGroup = match ? match[1] : "Uncategorized";
            channelInfo = line;
        } else if (line && !line.startsWith("#")) {
            // URL line
            if (!groups[currentGroup]) {
                groups[currentGroup] = [];
            }
            groups[currentGroup].push(`${channelInfo}\n${line}`);
        }
    });

    // Build the organized M3U content
    let organizedContent = "#EXTM3U\n";
    Object.keys(groups).sort().forEach(group => {
        organizedContent += `\n# --- Group: ${group} ---\n`;
        groups[group].forEach(entry => {
            organizedContent += `${entry}\n`;
        });
    });

    // Write the organized content to the output file
    fs.writeFileSync(outputFilePath, organizedContent, "utf-8");
    console.log(`Organized M3U file saved to: ${outputFilePath}`);
}

// Usage
const inputFilePath = "unorganized.m3u";
const outputFilePath = "organized.m3u";
organizeM3U(inputFilePath, outputFilePath);

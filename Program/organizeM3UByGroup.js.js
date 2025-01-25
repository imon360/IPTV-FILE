const fs = require("fs");
const path = require("path");

function organizeAndSaveM3U(inputFilePath, outputDir) {
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
            const match = line.match(/group-title="([^"]+)"/i); // Case-insensitive match
            currentGroup = match ? match[1].toLowerCase() : "uncategorized"; // Convert to lowercase for consistent grouping
            channelInfo = line;
        } else if (line && !line.startsWith("#")) {
            // URL line
            if (!groups[currentGroup]) {
                groups[currentGroup] = [];
            }
            groups[currentGroup].push(`${channelInfo}\n${line}`);
        }
    });

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Save each group to a separate file
    Object.keys(groups).forEach(group => {
        const originalGroupName = groups[group][0].match(/group-title="([^"]+)"/i)?.[1] || "Uncategorized";
        const sanitizedGroupName = originalGroupName.replace(/[^a-zA-Z0-9-_]/g, "_"); // Sanitize group name for file system
        const groupFilePath = path.join(outputDir, `${sanitizedGroupName}.m3u`);
        const groupContent = `#EXTM3U\n${groups[group].join("\n")}\n`;
        fs.writeFileSync(groupFilePath, groupContent, "utf-8");
        console.log(`Group saved: ${groupFilePath}`);
    });
}

// Usage
const inputFilePath = "unorganized.m3u";
const outputDir = "organized_groups";
organizeAndSaveM3U(inputFilePath, outputDir);

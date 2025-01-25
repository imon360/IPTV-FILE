const fs = require("fs");
const path = require("path");

// Function to extract image links from a file
function extractImageLinks(filePath, outputFilePath) {
    try {
        // Read the file content
        const content = fs.readFileSync(filePath, "utf-8");

        // Regular expression to match image URLs
        const imagePattern = /(https?:\/\/[^\s"]+\.(?:jpg|jpeg|png|gif|bmp))/gi;
        const imageLinks = [...new Set(content.match(imagePattern))]; // Extract and remove duplicates

        // Write the unique image links to the output file
        fs.writeFileSync(outputFilePath, imageLinks.join("\n"), "utf-8");
        console.log(`Extracted ${imageLinks.length} image links. Saved to ${outputFilePath}.`);
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}

// Example usage: Replace with your file paths
const inputFilePath = "your_file.m3u"; // Input file path
const outputFilePath = "extracted_image_links.txt"; // Output file path

extractImageLinks(inputFilePath, outputFilePath);

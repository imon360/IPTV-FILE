const fs = require('fs');
const vm = require('vm');
const path = require('path');

const srcPath = path.join(__dirname, 'cc.js');
const outPath = path.join(__dirname, 'cc.m3u');

const src = fs.readFileSync(srcPath, 'utf8');
// Evaluate the file in a safe VM context and return the M3U variable
const code = src + '\n;M3U';
let M3U;
try {
  M3U = vm.runInNewContext(code, {});
} catch (err) {
  console.error('Failed to evaluate cc.js:', err);
  process.exit(2);
}

const lines = ['#EXTM3U'];
for (const [category, arr] of Object.entries(M3U)) {
  if (!Array.isArray(arr)) continue;
  for (const item of arr) {
    const name = (item && item.name) ? item.name : '';
    const url = (item && item.url) ? item.url : '';
    const logo = (item && item.logo) ? item.logo : '';
    // Escape double quotes in attributes
    const escLogo = String(logo).replace(/"/g, '\\"');
    const escCategory = String(category).replace(/"/g, '\\"');
    const escName = String(name).replace(/\n/g, ' ').trim();
    const extinf = `#EXTINF:-1 tvg-id="" tvg-logo="${escLogo}" group-title="${escCategory}",${escName}`;
    lines.push(extinf);
    lines.push(url);
  }
}

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Wrote', outPath, 'with', (lines.length - 1) / 2, 'entries');

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'source', '_posts');
const publicDir = path.join(__dirname, '..', 'public');

const entries = fs.readdirSync(srcDir, { withFileTypes: true });
const assetsDirs = entries
  .filter(e => e.isDirectory() && e.name.endsWith('.assets'))
  .map(e => e.name);

if (assetsDirs.length === 0) {
  console.log('No .assets directories found.');
  process.exit(0);
}

assetsDirs.forEach(dir => {
  const src = path.join(srcDir, dir);
  const dest = path.join(publicDir, dir);
  copyDir(src, dest);
  console.log(`Copied: ${dir}`);
});

console.log(`Done. ${assetsDirs.length} .assets directories copied.`);

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'source', '_posts');
const publicDir = path.join(__dirname, '..', 'public');

function computePublicPath(mdFile, publicDir) {
  const content = fs.readFileSync(mdFile, 'utf8');
  const dateMatch = content.match(/^date:\s*(\d{4})-(\d{2})-(\d{2})/m);
  const title = path.basename(mdFile, '.md');

  if (!dateMatch) {
    return path.join(publicDir, `${title}.assets`);
  }

  const [, year, month, day] = dateMatch;
  // Place .assets next to the article's output HTML: public/年/月/日/文章名.assets/
  return path.join(publicDir, year, month, day, `${title}.assets`);
}

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
  const mdFile = path.join(srcDir, dir.slice(0, -7) + '.md');
  const dest = computePublicPath(mdFile, publicDir);
  copyDir(src, dest);
  console.log(`Copied: ${dir} -> ${path.relative(publicDir, dest)}`);
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

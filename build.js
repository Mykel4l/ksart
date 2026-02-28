const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const INCLUDE = [
  "index.html",
  "blog.html",
  "travel.html",
  "hire.html",
  "workshops.html",
  "book.html",
  "admin.html",
  "robots.txt",
  "sitemap.xml",
  "css",
  "js",
  "img",
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  try {
    fs.rmSync(DIST, { recursive: true, force: true });
  } catch {
    // On Windows the folder can be locked briefly; wait then retry
    const { execSync } = require('child_process');
    try { execSync('ping -n 2 127.0.0.1 >nul', { stdio: 'ignore' }); } catch {}
    fs.rmSync(DIST, { recursive: true, force: true });
  }
}
fs.mkdirSync(DIST, { recursive: true });

// Copy site files
for (const item of INCLUDE) {
  const src = path.join(__dirname, item);
  const dest = path.join(DIST, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`  ✓ ${item}`);
  } else {
    console.warn(`  ⚠ ${item} not found, skipping`);
  }
}

console.log(`\nBuild complete → dist/`);

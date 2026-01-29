// Script to delete unused images based on the unused-images.txt file
const fs = require('fs');
const path = require('path');

const UNUSED_IMAGES_FILE = path.join(__dirname, '../unused-images.txt');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');

if (!fs.existsSync(UNUSED_IMAGES_FILE)) {
  console.error('unused-images.txt not found. Please run check-unused-images.js first.');
  process.exit(1);
}

const unusedImages = fs.readFileSync(UNUSED_IMAGES_FILE, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && line.startsWith('/images/'));

console.log(`Found ${unusedImages.length} unused images to delete\n`);

let deleted = 0;
let errors = 0;

unusedImages.forEach(imagePath => {
  // Remove /images/ prefix to get relative path
  const relativePath = imagePath.replace(/^\/images\//, '');
  const fullPath = path.join(PUBLIC_IMAGES_DIR, relativePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${imagePath}`);
      deleted++;
    } else {
      console.log(`Not found (already deleted?): ${imagePath}`);
    }
  } catch (error) {
    console.error(`Error deleting ${imagePath}:`, error.message);
    errors++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Deleted: ${deleted}`);
console.log(`Errors: ${errors}`);
console.log(`Remaining: ${unusedImages.length - deleted - errors}`);


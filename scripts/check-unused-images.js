// Script to check which images in public/images are actually used
// This script fetches the API JSON files and checks which images are referenced

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE = 'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const CATALOGS_DIR = path.join(IMAGES_DIR, 'catalogs');

// Images that are explicitly referenced in code
const EXPLICITLY_USED = [
  '/images/catalogs/partscatalog25.jpg',
  '/images/catalogs/partscatalog25.pdf',
  '/images/catalogs/cafecatalog25.jpg',
  '/images/catalogs/cafecatalog25.pdf',
  '/images/chair-parts.jpg',
  '/images/cafeteria-chairs.jpg',
];

// List of JSON files to check
const JSON_FILES = [
  'plastic.json',
  'cafeteria.json',
  'cafe.json',
  'mesh.json',
  'table.json',
  'lounge.json',
  'adjustable-handle.json',
  'aremrest-pp-base.json',
  'wheels.json',
  'inner-outer.json',
  'pu-moulded-chair.json',
  'pu-cushions.json',
  'cafe-bar-counter.json',
  'school-desk.json',
  'cafe-plastic-shell.json',
  'chair-plastic-leg.json',
  'school-desk-parts.json',
  'sleek-chair-accessories.json',
  'chair-seat-back.json',
  'chair-handle-base.json',
  'iron-base.json',
  'chair-mesh-series.json',
  'chair-mechanism.json',
  'fitting-accessories.json',
];

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function extractImageFromProduct(product) {
  // Check various image field names
  const imageFields = [
    'image', 'img', 'imageUrl', 'image_url', 'photo', 'picture',
    'Image', 'Img', 'ImageUrl', 'Image_URL', 'Photo', 'Picture',
    'Url', 'URL'
  ];
  
  for (const field of imageFields) {
    const value = product[field];
    if (typeof value === 'string' && value.trim()) {
      const trimmed = value.trim();
      // If it's a full URL, skip
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        continue;
      }
      // If it starts with /images/, return it
      if (trimmed.startsWith('/images/')) {
        return trimmed;
      }
      // If it's just a filename, return /images/filename
      if (!trimmed.includes('/') && !trimmed.includes('\\')) {
        return `/images/${trimmed}`;
      }
    }
  }
  return null;
}

async function main() {
  console.log('Fetching API data to find used images...\n');
  
  const usedImages = new Set(EXPLICITLY_USED);
  const errors = [];
  
  // Fetch all JSON files
  for (const jsonFile of JSON_FILES) {
    try {
      const url = `${API_BASE}/${jsonFile}`;
      console.log(`Fetching ${jsonFile}...`);
      const data = await fetchJSON(url);
      
      const products = Array.isArray(data) ? data : (data.products || []);
      console.log(`  Found ${products.length} products`);
      
      products.forEach((product) => {
        const imagePath = extractImageFromProduct(product);
        if (imagePath) {
          usedImages.add(imagePath);
        }
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`  Error fetching ${jsonFile}:`, error.message);
      errors.push({ file: jsonFile, error: error.message });
    }
  }
  
  console.log(`\nFound ${usedImages.size} used images\n`);
  
  // Get all image files in public/images
  const allImages = [];
  function scanDir(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, path.join(basePath, file));
      } else if (/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(file)) {
        const relativePath = `/images/${path.join(basePath, file).replace(/\\/g, '/')}`;
        allImages.push(relativePath);
      }
    });
  }
  
  scanDir(IMAGES_DIR);
  console.log(`Found ${allImages.length} total images in public/images\n`);
  
  // Find unused images
  const unusedImages = allImages.filter(img => !usedImages.has(img));
  
  console.log('=== UNUSED IMAGES ===');
  console.log(`Total unused: ${unusedImages.length}\n`);
  
  if (unusedImages.length > 0) {
    unusedImages.forEach(img => console.log(img));
    
    // Write to file
    const outputFile = path.join(__dirname, '../unused-images.txt');
    fs.writeFileSync(outputFile, unusedImages.join('\n'));
    console.log(`\nUnused images list saved to: ${outputFile}`);
  } else {
    console.log('No unused images found!');
  }
  
  if (errors.length > 0) {
    console.log('\n=== ERRORS ===');
    errors.forEach(e => console.log(`${e.file}: ${e.error}`));
  }
}

main().catch(console.error);


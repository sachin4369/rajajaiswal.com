import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const projectRoot = path.resolve(process.cwd());
const imagesDir = path.join(projectRoot, 'public', 'images');
const outputDir = path.join(imagesDir, 'optimized');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function compressImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Basic heuristic: slightly downscale very large images
  let width = metadata.width;
  if (width && width > 1600) {
    width = 1600;
  }

  const pipeline = image.resize(width, null, {
    withoutEnlargement: true,
  });

  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: 70, mozjpeg: true }).toFile(outputPath);
  } else if (ext === '.png') {
    await pipeline.png({ quality: 70, compressionLevel: 9 }).toFile(outputPath);
  } else if (ext === '.webp') {
    await pipeline.webp({ quality: 70 }).toFile(outputPath);
  } else {
    // Skip unsupported formats
    return false;
  }

  return true;
}

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip output directory to avoid infinite loop
      if (fullPath === outputDir) continue;
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('Project root:', projectRoot);
  console.log('Input directory:', imagesDir);
  console.log('Output directory:', outputDir);

  await ensureDir(outputDir);

  const files = await walk(imagesDir);
  console.log(`Found ${files.length} files under images directory.`);

  let processed = 0;
  for (const file of files) {
    const rel = path.relative(imagesDir, file);
    const outPath = path.join(outputDir, rel);
    await ensureDir(path.dirname(outPath));

    try {
      const ok = await compressImage(file, outPath);
      if (ok) {
        processed += 1;
        console.log('Compressed:', rel);
      } else {
        console.log('Skipped (format not supported):', rel);
      }
    } catch (err) {
      console.error('Failed to compress', rel, err);
    }
  }

  console.log(`Done. Compressed ${processed} images into ${outputDir}. Originals are untouched.`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});


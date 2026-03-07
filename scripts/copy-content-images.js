#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

/**
 * Recursively copy images from a directory
 */
function copyImagesFromDir(sourceDir, targetDir, relativePath = '') {
  let copiedCount = 0;
  
  const items = fs.readdirSync(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    const currentPath = path.join(relativePath, item.name);
    
    if (item.isDirectory()) {
      // Ensure target directory exists
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Recursively process subdirectory
      copiedCount += copyImagesFromDir(sourcePath, targetPath, currentPath);
    } else if (item.isFile()) {
      // Copy image files (jpg, jpeg, png, gif, svg, webp)
      if (/\.(jpe?g|png|gif|svg|webp|pdf)$/i.test(item.name)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`   ✓ Copied: ${currentPath}`);
        copiedCount++;
      }
    }
  }
  
  return copiedCount;
}

/**
 * Copy all images from all content collections to corresponding public folders
 */
async function copyContentImages() {
  console.log('🖼️  Copying content images to public folder...');
  
  try {
    const contentRootDir = path.join(projectRoot, 'usr', 'content');
    const publicRootDir = path.join(projectRoot, 'usr', 'public');
    
    // Skip if content folder doesn't exist
    if (!fs.existsSync(contentRootDir)) {
      console.log('   ⚠️  No content folder found, skipping image copy');
      return;
    }
    
    // Ensure public root exists
    if (!fs.existsSync(publicRootDir)) {
      fs.mkdirSync(publicRootDir, { recursive: true });
    }
    
    // Get all content collection folders
    const contentFolders = fs.readdirSync(contentRootDir, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => item.name);
    
    let totalCopied = 0;
    
    for (const folderName of contentFolders) {
      const contentDir = path.join(contentRootDir, folderName);
      const publicDir = path.join(publicRootDir, folderName);
      
      console.log(`\n📁 Processing ${folderName}...`);
      
      // Ensure public folder exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // Recursively copy images
      const copiedCount = copyImagesFromDir(contentDir, publicDir, folderName);
      console.log(`   📊 ${copiedCount} images copied from ${folderName}`);
      totalCopied += copiedCount;
    }
    
    console.log(`\n✅ Total: ${totalCopied} images copied successfully!`);
  } catch (error) {
    console.error('❌ Error copying content images:', error);
    process.exit(1);
  }
}

/**
 * Copy static site images from usr/images/ to usr/public/images/
 */
function copyStaticImages() {
  const srcDir = path.join(projectRoot, 'usr', 'images');
  const destDir = path.join(projectRoot, 'usr', 'public', 'images');

  if (!fs.existsSync(srcDir)) {
    console.log('\n⚠️  No usr/images/ folder found, skipping static image copy.');
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`   ✓ Copied static image: ${file}`);
  }
  console.log('\n✅ Static images copied to usr/public/images/');
}

/**
 * Copy CNAME from project root to usr/public (if it exists)
 */
function copyCNAME() {
  const cnameSrc = path.join(projectRoot, 'usr', 'CNAME');
  const cnameDest = path.join(projectRoot, 'usr', 'public', 'CNAME');

  if (!fs.existsSync(cnameSrc)) {
    console.log('\n⚠️  No CNAME file found in project root, skipping.');
    return;
  }

  fs.copyFileSync(cnameSrc, cnameDest);
  console.log('\n✅ CNAME copied to usr/public/CNAME');
}

// Run the script
copyContentImages();
copyStaticImages();
copyCNAME();
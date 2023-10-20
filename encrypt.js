const fs = require('fs');
const path = require('path');

function encodeFolderContentsSync(basePath, outputDir) {
  const items = fs.readdirSync(basePath);

  for (const item of items) {
    if (item === '.gitkeep') {
      continue;
    }

    const itemPath = path.join(basePath, item);
    const outputItemPath = path.join(outputDir, Buffer.from(item).toString('base64'));

    const itemStats = fs.statSync(itemPath);

    if (itemStats.isDirectory()) {
      try {
        fs.mkdirSync(outputItemPath, { recursive: true });
        encodeFolderContentsSync(itemPath, outputItemPath);
      } catch (err) {
        console.error('Error creating directory:', err);
      }
    } else if (itemStats.isFile()) {
      try {
        const fileContents = fs.readFileSync(itemPath);
        const base64Contents = Buffer.from(fileContents).toString('base64');
        fs.writeFileSync(outputItemPath, base64Contents);
      } catch (err) {
        console.error('Error encoding or writing file:', err);
      }
    }
  }
}

const inputFolder = './clear';
const outputFolder = './data';

encodeFolderContentsSync(inputFolder, outputFolder);

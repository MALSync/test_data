const fs = require('fs');
const path = require('path');

function decodeFolderContentsSync(basePath, outputDir) {
  const items = fs.readdirSync(basePath);

  for (const item of items) {
    const itemPath = path.join(basePath, item);
    const decodedItemPath = path.join(outputDir, Buffer.from(item, 'base64').toString());

    const itemStats = fs.statSync(itemPath);

    if (itemStats.isDirectory()) {
      try {
        fs.mkdirSync(decodedItemPath, { recursive: true });
        decodeFolderContentsSync(itemPath, decodedItemPath);
      } catch (err) {
        console.error('Error creating directory:', err);
      }
    } else if (itemStats.isFile()) {
      try {
        const base64Contents = fs.readFileSync(itemPath, 'utf8');
        const decodedContents = Buffer.from(base64Contents, 'base64').toString();
        fs.writeFileSync(decodedItemPath, decodedContents);
      } catch (err) {
        console.error('Error decoding or writing file:', err);
      }
    }
  }
}

const inputFolder = './data';
const outputFolder = './clear';

decodeFolderContentsSync(inputFolder, outputFolder);

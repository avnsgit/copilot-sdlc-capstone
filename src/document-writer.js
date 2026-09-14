const fs = require('node:fs');
const path = require('node:path');

function writeDocumentsToDisk(documents, baseDirectory = process.cwd()) {
  for (const document of documents) {
    const targetPath = path.join(baseDirectory, document.path);
    fs.writeFileSync(targetPath, `${document.body}\n`, 'utf8');
  }
}

module.exports = {
  writeDocumentsToDisk,
};
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { generateDocumentSet } = require('../src/document-generator');
const { writeDocumentsToDisk } = require('../src/document-writer');

test('generateDocumentSet returns the four required documents', () => {
  const documents = generateDocumentSet({
    jiraIssueKey: 'DOCSYNC-2',
    jiraProjectKey: 'DOCSYNC',
    rootPageTitle: '[PROJECT] Automated Documentation Sync Pipeline',
    runtime: 'Node.js',
  });

  assert.equal(documents.length, 4);
  assert.deepEqual(documents.map((document) => document.path), [
    'generatedDocs/requirements.md',
    'generatedDocs/architecture.md',
    'generatedDocs/design-review.md',
    'generatedDocs/impl-plan.md',
  ]);
});

test('writeDocumentsToDisk writes the generated documents to the workspace', () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'docsync-'));
  const documents = generateDocumentSet({
    jiraIssueKey: 'DOCSYNC-2',
    jiraProjectKey: 'DOCSYNC',
    rootPageTitle: '[PROJECT] Automated Documentation Sync Pipeline',
    runtime: 'Node.js',
  });

  writeDocumentsToDisk(documents, tempDirectory);

  for (const document of documents) {
    assert.equal(fs.existsSync(path.join(tempDirectory, document.path)), true);
  }
});
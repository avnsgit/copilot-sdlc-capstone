const test = require('node:test');
const assert = require('node:assert/strict');

const { shouldRunPipeline, collectChangedFilesFromGit } = require('../src/change-detector');

test('shouldRunPipeline detects relevant files', () => {
  const result = shouldRunPipeline(['src/index.js', 'notes.txt']);

  assert.equal(result.shouldRun, true);
  assert.deepEqual(result.matchedFiles, ['src/index.js']);
});

test('shouldRunPipeline skips unrelated files', () => {
  const result = shouldRunPipeline(['docs/other.md']);

  assert.equal(result.shouldRun, false);
  assert.deepEqual(result.matchedFiles, []);
});

test('collectChangedFilesFromGit parses git status output', () => {
  const changedFiles = collectChangedFilesFromGit({
    execImpl: () => '?? src/new-file.js\n M README.md\n',
  });

  assert.deepEqual(changedFiles, ['src/new-file.js', 'README.md']);
});
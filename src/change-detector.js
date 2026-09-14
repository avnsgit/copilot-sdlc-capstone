const { execSync } = require('node:child_process');

const RELEVANT_PATTERNS = [
  /^src\//,
  /^tests\//,
  /^\.github\//,
  /^requirements\.md$/,
  /^architecture\.md$/,
  /^design-review\.md$/,
  /^impl-plan\.md$/,
  /^package\.json$/,
  /^README\.md$/,
];

function normalizePath(inputPath) {
  return String(inputPath || '').replace(/\\/g, '/');
}

function shouldRunPipeline(changedFiles = []) {
  if (!Array.isArray(changedFiles)) {
    throw new TypeError('changedFiles must be an array');
  }

  const matchedFiles = changedFiles
    .map(normalizePath)
    .filter((filePath) => RELEVANT_PATTERNS.some((pattern) => pattern.test(filePath)));

  return {
    shouldRun: matchedFiles.length > 0,
    matchedFiles,
  };
}

function collectChangedFilesFromGit({ cwd = process.cwd(), execImpl = execSync } = {}) {
  const output = execImpl('git status --porcelain', {
    cwd,
    encoding: 'utf8',
  });

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map(normalizePath);
}

module.exports = {
  RELEVANT_PATTERNS,
  shouldRunPipeline,
  collectChangedFilesFromGit,
};
const fs = require('node:fs');

function buildVerificationReport({ summary, details = [] }) {
  return [
    '# Verification Results',
    '',
    `Summary: ${summary}`,
    '',
    ...details.map((entry) => `- ${entry}`),
    '',
  ].join('\n');
}

function writeVerificationResults(filePath, report) {
  fs.writeFileSync(filePath, report, 'utf8');
}

module.exports = {
  buildVerificationReport,
  writeVerificationResults,
};
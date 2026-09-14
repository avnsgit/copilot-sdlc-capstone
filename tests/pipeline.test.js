const test = require('node:test');
const assert = require('node:assert/strict');

const { runPipeline } = require('../src/pipeline');

test('runPipeline skips when there are no relevant changes', async () => {
  const result = await runPipeline({
    env: {
      ATLASSIAN_HOST: 'https://example.atlassian.net',
      ATLASSIAN_EMAIL: 'user@example.com',
      ATLASSIAN_API_TOKEN: 'token',
      CONFLUENCE_SPACE_KEY: 'DOCSYNC',
      JIRA_PROJECT_KEY: 'DOCSYNC',
      JIRA_ISSUE_KEY: 'DOCSYNC-2',
      GITHUB_TOKEN: 'github-token',
    },
    changedFiles: ['docs/notes.md'],
    client: {
      findPageByTitle: async () => null,
      createPage: async () => ({ id: '1', title: 'temp', version: 1 }),
      updatePage: async () => ({ id: '1', title: 'temp', version: 2 }),
    },
  });

  assert.equal(result.skipped, true);
});
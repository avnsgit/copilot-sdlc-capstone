const test = require('node:test');
const assert = require('node:assert/strict');

const { loadConfig } = require('../src/config');
const { ConfigError } = require('../src/errors');

test('loadConfig validates required environment variables', () => {
  assert.throws(
    () => loadConfig({ ATLASSIAN_HOST: 'https://example.atlassian.net' }),
    ConfigError,
  );
});

test('loadConfig allows GitHub token to be omitted when MCP handles PR automation', () => {
  const config = loadConfig({
    ATLASSIAN_HOST: 'https://example.atlassian.net',
    ATLASSIAN_EMAIL: 'user@example.com',
    ATLASSIAN_API_TOKEN: 'token',
    CONFLUENCE_SPACE_KEY: 'DOCSYNC',
    JIRA_PROJECT_KEY: 'DOCSYNC',
    JIRA_ISSUE_KEY: 'DOCSYNC-2',
  });

  assert.equal(config.githubToken, null);
});

test('loadConfig normalizes the Atlassian host', () => {
  const config = loadConfig({
    ATLASSIAN_HOST: 'https://example.atlassian.net/wiki',
    ATLASSIAN_EMAIL: 'user@example.com',
    ATLASSIAN_API_TOKEN: 'token',
    CONFLUENCE_SPACE_KEY: 'DOCSYNC',
    JIRA_PROJECT_KEY: 'DOCSYNC',
    JIRA_ISSUE_KEY: 'DOCSYNC-2',
    GITHUB_TOKEN: 'github-token',
  });

  assert.equal(config.atlassianHost, 'https://example.atlassian.net');
});

test('loadConfig defaults verification output to generatedDocs', () => {
  const config = loadConfig({
    ATLASSIAN_HOST: 'https://example.atlassian.net',
    ATLASSIAN_EMAIL: 'user@example.com',
    ATLASSIAN_API_TOKEN: 'token',
    CONFLUENCE_SPACE_KEY: 'DOCSYNC',
    JIRA_PROJECT_KEY: 'DOCSYNC',
    JIRA_ISSUE_KEY: 'DOCSYNC-2',
  });

  assert.equal(config.verifyResultsPath, 'generatedDocs/verify-results.txt');
});
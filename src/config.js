const { ConfigError } = require('./errors');

const REQUIRED_KEYS = [
  'ATLASSIAN_HOST',
  'ATLASSIAN_EMAIL',
  'ATLASSIAN_API_TOKEN',
  'CONFLUENCE_SPACE_KEY',
  'JIRA_PROJECT_KEY',
  'JIRA_ISSUE_KEY',
  'GITHUB_TOKEN',
];

function normalizeHost(host) {
  let url;

  try {
    url = new URL(host);
  } catch {
    throw new ConfigError('ATLASSIAN_HOST must be a valid URL');
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new ConfigError('ATLASSIAN_HOST must use http or https');
  }

  return url.origin;
}

function loadConfig(env = process.env) {
  const missing = REQUIRED_KEYS.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new ConfigError(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    atlassianHost: normalizeHost(env.ATLASSIAN_HOST),
    atlassianEmail: env.ATLASSIAN_EMAIL,
    atlassianApiToken: env.ATLASSIAN_API_TOKEN,
    confluenceSpaceKey: env.CONFLUENCE_SPACE_KEY,
    jiraProjectKey: env.JIRA_PROJECT_KEY,
    jiraIssueKey: env.JIRA_ISSUE_KEY,
    githubToken: env.GITHUB_TOKEN,
    verifyResultsPath: env.VERIFY_RESULTS_PATH || 'verify-results.txt',
  };
}

module.exports = {
  REQUIRED_KEYS,
  loadConfig,
  normalizeHost,
};
const test = require('node:test');
const assert = require('node:assert/strict');

const { createAtlassianClient, redactSecrets } = require('../src/atlassian-client');
const { RemoteError } = require('../src/errors');

test('redactSecrets removes token-like values', () => {
  const redacted = redactSecrets('Authorization: ghp_abcdefghijklmnopqrstuvwxyz1234567890');

  assert.match(redacted, /\[REDACTED\]/);
});

test('request throws RemoteError for non-2xx responses', async () => {
  const client = createAtlassianClient({
    baseUrl: 'https://example.atlassian.net',
    email: 'user@example.com',
    apiToken: 'token',
    fetchImpl: async () => ({
      ok: false,
      status: 500,
      text: async () => 'server error',
      headers: { get: () => 'text/plain' },
    }),
  });

  await assert.rejects(
    () => client.request('/wiki/rest/api/content'),
    RemoteError,
  );
});
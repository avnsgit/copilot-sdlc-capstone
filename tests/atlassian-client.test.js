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

test('findPageByTitle refreshes the current page version before updates', async () => {
  const requestedUrls = [];
  const client = createAtlassianClient({
    baseUrl: 'https://example.atlassian.net',
    email: 'user@example.com',
    apiToken: 'token',
    fetchImpl: async (url) => {
      requestedUrls.push(url);

      if (url.includes('/search?')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            results: [
              {
                content: {
                  id: '123',
                  title: '01-Requirements Spec',
                },
              },
            ],
          }),
          headers: { get: () => 'application/json' },
        };
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({
          id: '123',
          title: '01-Requirements Spec',
          version: {
            number: 7,
          },
        }),
        headers: { get: () => 'application/json' },
      };
    },
  });

  const page = await client.findPageByTitle('DOCSYNC', '11862018', '01-Requirements Spec');

  assert.deepEqual(page, {
    id: '123',
    title: '01-Requirements Spec',
    version: 7,
  });
  assert.equal(requestedUrls.length, 2);
  assert.match(requestedUrls[1], /\/wiki\/rest\/api\/content\/123\?expand=version$/);
});
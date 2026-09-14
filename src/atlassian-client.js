const { RemoteError } = require('./errors');

function redactSecrets(value) {
  return String(value)
    .replace(/(ATLASSIAN_API_TOKEN|GITHUB_TOKEN|Authorization):\s*[^\s]+/gi, '$1: [REDACTED]')
    .replace(/(ghp_[A-Za-z0-9]{10,}|github_pat_[A-Za-z0-9_]{10,})/g, '[REDACTED]');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToStorageHtml(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }

      if (!inCodeBlock) {
        html.push('<pre><code>');
        inCodeBlock = true;
      } else {
        html.push('</code></pre>');
        inCodeBlock = false;
      }

      continue;
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }

      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }

      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }

      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push('</ul>');
      inList = false;
    }

    if (line.trim()) {
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  if (inList) {
    html.push('</ul>');
  }

  if (inCodeBlock) {
    html.push('</code></pre>');
  }

  return html.join('');
}

function createAtlassianClient({ baseUrl, email, apiToken, fetchImpl = fetch }) {
  if (!baseUrl || !email || !apiToken) {
    throw new Error('baseUrl, email, and apiToken are required');
  }

  async function request(path, options = {}) {
    const url = new URL(path, baseUrl).toString();
    const headers = {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      ...options.headers,
    };

    const response = await fetchImpl(url, {
      method: options.method || 'GET',
      headers,
      body: options.body,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new RemoteError(`Atlassian request failed with ${response.status}`, {
        status: response.status,
        endpoint: url,
        responseBody: redactSecrets(responseText),
        retryable: false,
      });
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  }

  async function findPageByTitle(spaceKey, parentId, title) {
    const cqlParts = [
      `space.key = "${spaceKey}"`,
      `title = "${title.replace(/"/g, '\\"')}"`,
      'type = page',
    ];

    if (parentId) {
      cqlParts.push(`parent = ${parentId}`);
    }

    const result = await request(`/wiki/rest/api/search?cql=${encodeURIComponent(cqlParts.join(' AND '))}`);
    const entries = result.results || result.content || [];
    const firstEntry = entries[0];

    if (!firstEntry) {
      return null;
    }

    const content = firstEntry.content || firstEntry;
    const page = await request(`/wiki/rest/api/content/${content.id}?expand=version`);

    return {
      id: page.id || content.id,
      title: page.title || content.title,
      version: page.version?.number || content.version?.number || 1,
    };
  }

  async function createPage({ spaceKey, parentId, title, body }) {
    const payload = {
      type: 'page',
      title,
      space: { key: spaceKey },
      body: {
        storage: {
          representation: 'storage',
          value: markdownToStorageHtml(body),
        },
      },
    };

    if (parentId) {
      payload.ancestors = [{ id: String(parentId) }];
    }

    return request('/wiki/rest/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  async function updatePage(id, { title, body, version }) {
    const payload = {
      id: String(id),
      type: 'page',
      title,
      version: {
        number: (version || 1) + 1,
      },
      body: {
        storage: {
          representation: 'storage',
          value: markdownToStorageHtml(body),
        },
      },
    };

    return request(`/wiki/rest/api/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  return {
    request,
    redactSecrets,
    findPageByTitle,
    createPage,
    updatePage,
    markdownToStorageHtml,
  };
}

module.exports = {
  createAtlassianClient,
  redactSecrets,
};
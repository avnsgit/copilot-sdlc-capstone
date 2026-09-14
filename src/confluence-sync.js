async function ensurePage(client, { spaceKey, parentId, title, body }) {
  const existing = await client.findPageByTitle(spaceKey, parentId, title);

  if (existing) {
    return client.updatePage(existing.id, {
      title,
      body,
      version: existing.version,
    });
  }

  return client.createPage({
    spaceKey,
    parentId,
    title,
    body,
  });
}

async function syncDocumentationTree(client, { spaceKey, rootTitle, documents }) {
  const rootPage = await ensurePage(client, {
    spaceKey,
    parentId: null,
    title: rootTitle,
    body: `# ${rootTitle}\n`,
  });

  const syncedPages = [];

  for (const document of documents) {
    // Upsert each child page under the root page.
    const page = await ensurePage(client, {
      spaceKey,
      parentId: rootPage.id,
      title: document.title,
      body: document.body,
    });

    syncedPages.push(page);
  }

  return {
    rootPage,
    syncedPages,
  };
}

module.exports = {
  ensurePage,
  syncDocumentationTree,
};
const { test, expect } = require('@playwright/test');

const ROOT_PAGE_TITLE = '[PROJECT] Automated Documentation Sync Pipeline';
const ROOT_PAGE_ID = '11862018';
const EXPECTED_CHILD_PAGES = [
  { title: '01-Requirements Spec', pageId: '12025858' },
  { title: '02-System Architecture', pageId: '12189697' },
  { title: '03-Design Review Findings', pageId: '12222465' },
  { title: '04-Implementation Plan', pageId: '12288002' },
];

test('Confluence tree exposes the canonical root and child pages', async ({ request }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL && !process.env.ATLASSIAN_HOST, 'Playwright base URL is not configured');
  test.skip(!process.env.ATLASSIAN_EMAIL || !process.env.ATLASSIAN_API_TOKEN, 'Atlassian API credentials are not configured');

  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || process.env.ATLASSIAN_HOST;
  const credentials = Buffer.from(`${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_API_TOKEN}`).toString('base64');

  const rootResponse = await request.get(new URL(`/wiki/rest/api/content/${ROOT_PAGE_ID}`, baseUrl).toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  });

  expect(rootResponse.ok()).toBeTruthy();

  const rootPage = await rootResponse.json();
  expect(rootPage.title).toBe(ROOT_PAGE_TITLE);

  const response = await request.get(new URL(`/wiki/rest/api/content/${ROOT_PAGE_ID}/child/page?limit=10`, baseUrl).toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const childPages = body.results || [];

  expect(childPages.length).toBeGreaterThanOrEqual(EXPECTED_CHILD_PAGES.length);
  expect(childPages.slice(0, EXPECTED_CHILD_PAGES.length).map((page) => ({ title: page.title, id: page.id }))).toEqual(
    EXPECTED_CHILD_PAGES.map((page) => ({ title: page.title, id: page.pageId })),
  );
});
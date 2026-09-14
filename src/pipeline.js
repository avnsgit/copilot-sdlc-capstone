const { loadConfig } = require('./config');
const { shouldRunPipeline, collectChangedFilesFromGit } = require('./change-detector');
const { generateDocumentSet } = require('./document-generator');
const { syncDocumentationTree } = require('./confluence-sync');
const { buildVerificationReport, writeVerificationResults } = require('./verification');
const { writeDocumentsToDisk } = require('./document-writer');

const ROOT_PAGE_TITLE = '[PROJECT] Automated Documentation Sync Pipeline';

async function runPipeline({
  env = process.env,
  changedFiles = [],
  client,
  verifyResultsPath,
}) {
  const detectedChangedFiles = changedFiles.length > 0 ? changedFiles : collectChangedFilesFromGit();
  const trigger = shouldRunPipeline(detectedChangedFiles);

  if (!trigger.shouldRun) {
    return {
      skipped: true,
      reason: 'No relevant changes detected',
    };
  }

  const config = loadConfig(env);

  const documents = generateDocumentSet({
    jiraIssueKey: config.jiraIssueKey,
    jiraProjectKey: config.jiraProjectKey,
    rootPageTitle: ROOT_PAGE_TITLE,
    runtime: 'Node.js',
  });

  writeDocumentsToDisk(documents);

  const syncResult = await syncDocumentationTree(client, {
    spaceKey: config.confluenceSpaceKey,
    rootTitle: ROOT_PAGE_TITLE,
    documents,
  });

  const verificationReport = buildVerificationReport({
    summary: `Synced ${syncResult.syncedPages.length} documentation pages`,
    details: [
      `Root page: ${syncResult.rootPage.title}`,
      ...syncResult.syncedPages.map((page) => `Child page: ${page.title}`),
    ],
  });

  writeVerificationResults(verifyResultsPath || config.verifyResultsPath, verificationReport);

  return {
    skipped: false,
    config,
    trigger,
    documents,
    syncResult,
    verificationReport,
  };
}

module.exports = {
  ROOT_PAGE_TITLE,
  runPipeline,
};
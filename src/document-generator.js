function generateRequirementsMarkdown(context) {
  return [
    '# Requirements Spec',
    '',
    `- Jira issue: ${context.jiraIssueKey}`,
    `- Project: ${context.jiraProjectKey}`,
    `- Root Confluence page: ${context.rootPageTitle}`,
    '',
    '## Goal',
    '',
    'Build an automated pipeline that detects codebase changes, generates SDLC documentation, and synchronizes the documentation into a nested Confluence tree with verification and PR automation support.',
  ].join('\n');
}

function generateArchitectureMarkdown(context) {
  return [
    '# System Architecture',
    '',
    `- Runtime: ${context.runtime}`,
    '- Modules: config loader, change detector, Atlassian client, Confluence sync, verification, PR packager',
    '',
    '```mermaid',
    'flowchart TD',
    '  A[Change detected] --> B[Load config]',
    '  B --> C[Generate docs]',
    '  C --> D[Sync Confluence tree]',
    '  D --> E[Run verification]',
    '  E --> F[Package PR evidence]',
    '```',
  ].join('\n');
}

function generateDesignReviewMarkdown() {
  return [
    '# Design Review Findings',
    '',
    '- High: redact credentials in all logs.',
    '- Medium: normalize remote errors in one shared client.',
    '- Medium: fail fast after logging for rate limits, timeouts, 404s, and 500s.',
  ].join('\n');
}

function generateImplementationPlanMarkdown() {
  return [
    '# Implementation Plan',
    '',
    '1. Wire configuration and secret hygiene.',
    '2. Build the shared Atlassian client.',
    '3. Implement change detection and document generation.',
    '4. Add Confluence upsert logic.',
    '5. Add tests and verification output.',
  ].join('\n');
}

function generateDocumentSet(context) {
  return [
    {
      path: 'requirements.md',
      title: '01-Requirements Spec',
      body: generateRequirementsMarkdown(context),
    },
    {
      path: 'architecture.md',
      title: '02-System Architecture',
      body: generateArchitectureMarkdown(context),
    },
    {
      path: 'design-review.md',
      title: '03-Design Review Findings',
      body: generateDesignReviewMarkdown(context),
    },
    {
      path: 'impl-plan.md',
      title: '04-Implementation Plan',
      body: generateImplementationPlanMarkdown(context),
    },
  ];
}

module.exports = {
  generateRequirementsMarkdown,
  generateArchitectureMarkdown,
  generateDesignReviewMarkdown,
  generateImplementationPlanMarkdown,
  generateDocumentSet,
};
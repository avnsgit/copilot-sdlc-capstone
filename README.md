# Copilot SDLC Capstone

This repository contains a small Node.js pipeline that detects relevant repository changes, generates SDLC documentation, syncs that documentation to Confluence, and writes verification output for review.

## What It Does

The pipeline is change-driven. It runs when the changed files touch `src/`, `tests/`, `.github/`, `package.json`, or this README. If no relevant changes are detected, the run is skipped.

When it does run, the pipeline:

1. Loads the required Atlassian and Jira configuration from environment variables.
2. Generates the SDLC document set in `generatedDocs/`.
3. Syncs the documents into the Confluence tree rooted at `[PROJECT] Automated Documentation Sync Pipeline`.
4. Writes verification output to `generatedDocs/verify-results.txt`.

## Setup

Install dependencies with:

```bash
npm install
```

Create a local environment file or export these variables before running the pipeline:

- `ATLASSIAN_HOST`
- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`
- `CONFLUENCE_SPACE_KEY`
- `JIRA_PROJECT_KEY`
- `JIRA_ISSUE_KEY`
- `VERIFY_RESULTS_PATH` or leave it unset to use `generatedDocs/verify-results.txt`
- `GITHUB_TOKEN` if your workflow needs it

`ATLASSIAN_HOST` must be a valid `http` or `https` URL.

## Run

Run the pipeline with the default change detection:

```bash
npm start
```

You can also pass changed file paths directly:

```bash
npm start -- src/index.js tests/pipeline.test.js
```

If you do not pass file paths, the entrypoint falls back to `git status --porcelain` to collect changed files.

## Scripts

- `npm start` runs the pipeline entrypoint.
- `npm test` runs the unit test suite.
- `npm run test:e2e` runs the Playwright smoke tests.

## Generated Output

The pipeline writes the generated documentation into `generatedDocs/`:

- `generatedDocs/requirements.md`
- `generatedDocs/architecture.md`
- `generatedDocs/design-review.md`
- `generatedDocs/impl-plan.md`
- `generatedDocs/code-review-report.md`
- `generatedDocs/verify-results.txt`

## Repository Layout

- `src/` contains the pipeline implementation, Confluence sync logic, and verification helpers.
- `tests/` contains unit tests and Playwright smoke tests.
- `generatedDocs/` stores the generated documentation artifacts.

## Notes

The generated requirements document captures the full behavioral contract for the pipeline. If you need the detailed SDLC scope, review `generatedDocs/requirements.md` after a run.

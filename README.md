# Copilot SDLC Capstone

This repository implements a small Node.js pipeline that detects relevant repository changes, generates SDLC documentation, syncs that documentation to Confluence, and writes verification output for review.

## Generated Docs

All generated markdown artifacts are written to the `generatedDocs/` folder:

- `generatedDocs/requirements.md`
- `generatedDocs/architecture.md`
- `generatedDocs/design-review.md`
- `generatedDocs/impl-plan.md`
- `generatedDocs/code-review-report.md`

Keeping generated files in one folder makes it easier to review diffs, clean the workspace, and avoid retriggering the pipeline on its own output.

## Scripts

- `npm test` runs the unit test suite.
- `npm run test:e2e` runs the Playwright smoke tests.
- `npm start` executes the pipeline entrypoint.

## Workflow

1. Detect relevant source changes.
2. Generate documentation into `generatedDocs/`.
3. Sync the document tree to Confluence.
4. Write verification results to `generatedDocs/verify-results.txt`.

## Notes

The repository expects Atlassian and Jira configuration in environment variables before the pipeline runs. See the generated requirements document for the full contract.

# System Architecture

## Overview

The repository will implement a modular Node.js pipeline that detects repository changes, generates SDLC documentation, synchronizes the documentation tree to Confluence, and verifies the published pages.

For this run, the implementation stays centered on documentation generation, Confluence synchronization, and verification evidence. Pull request automation remains part of the broader story, but the working slice should stay narrow and deterministic.

The current repository is minimal, so the architecture is intentionally lightweight and layered around a small set of responsibilities rather than a large framework.

## Design Goals

1. Keep zero-trust secret handling and log redaction as first-class constraints.
2. Keep the workflow deterministic and idempotent.
3. Retry transient failures before failing the run, but still stop on unrecoverable external errors.
4. Minimize duplicate Confluence pages across reruns.
5. Separate change detection, document generation, publishing, verification, and PR packaging into distinct modules.

## Proposed Components

### 1. Change Detector

* Watches for repository changes or receives a change event from the caller.
* Produces a normalized trigger payload that identifies what changed and whether the pipeline should run.

### 2. Config Loader

* Reads all runtime configuration from environment variables.
* Validates presence of required secrets and target identifiers before the pipeline starts.

### 3. Shared Atlassian Client

* Centralizes Jira and Confluence requests behind one adapter.
* Normalizes HTTP failures into explicit pipeline errors.
* Redacts secrets, headers, and access tokens from logs.

### 4. Documentation Generator

* Produces the root Markdown files in `generatedDocs/`:

  * `generatedDocs/requirements.md`
  * `generatedDocs/architecture.md`
  * `generatedDocs/design-review.md`
  * `generatedDocs/impl-plan.md`

* Keeps the documents aligned with the Jira story and the current pipeline state.

### 5. Confluence Sync Client

* Resolves or creates the root page `[PROJECT] Automated Documentation Sync Pipeline`.
* Creates or updates the four child pages under the root page.
* Uses page identity checks so reruns update existing pages instead of duplicating them.
* Retries transient rate limits and network failures before surfacing a fatal error.

### 6. Verification Runner

* Runs unit tests for happy-path and failure-path coverage.
* Uses Playwright MCP to inspect the live Confluence page tree.
* Writes the run output to `generatedDocs/verify-results.txt`.

### 7. PR Evidence Packager

* Collects the generated docs, verification logs, and summary data.
* Packages the evidence for GitHub pull request creation.

## Data Flow

```mermaid
flowchart TD
  A[Repository change detected] --> B[Load env config]
  B --> C{Required config present?}
  C -- no --> Z[Log and fail run]
  C -- yes --> D[Generate Markdown docs]
  D --> E[Resolve root Confluence page]
  E --> F[Upsert child pages]
  F --> G[Run unit tests]
  G --> H[Inspect Confluence page tree with Playwright]
  H --> I[Write generatedDocs/verify-results.txt]
  I --> J[Package PR evidence]
```

## Runtime Sequence

```mermaid
sequenceDiagram
  participant Trigger as Change Detector
  participant Pipeline as Pipeline Runner
  participant Docs as Documentation Generator
  participant Confluence as Confluence Sync Client
  participant Verify as Verification Runner
  participant GitHub as PR Evidence Packager

  Trigger->>Pipeline: change event
  Pipeline->>Pipeline: validate env
  Pipeline->>Docs: generate root docs
  Pipeline->>Confluence: resolve or create tree root
  Pipeline->>Confluence: upsert 01-04 pages
  Pipeline->>Verify: run tests and browser verification
  Verify-->>Pipeline: generatedDocs/verify-results.txt
  Pipeline->>GitHub: assemble PR summary and evidence
```

## Failure Handling Model

* Missing config and malformed payloads are treated as immediate fatal configuration errors after logging.
* API rate limits and network failures should be retried before failing the current run if the retries do not succeed.
* `404 Not Found` and `500 Server Error` responses are treated as fatal for the current run after logging.
* The pipeline should not continue after a fatal external dependency failure.
* Each module should return explicit errors so the caller can distinguish configuration issues from publishing or verification failures.
* The shared Atlassian client should be the only place that formats remote requests and remote error details.
* Logs must never include raw tokens, authorization headers, or full secret values.

## Module Boundaries

* The change detector does not generate documentation.
* The documentation generator does not talk to Confluence.
* The Confluence sync client does not run tests.
* The verification runner does not create pull requests.
* The PR evidence packager depends on the results of prior stages, not on live Confluence edits.

## Technology Direction

* Runtime: Node.js
* Module format: CommonJS, matching the current `package.json`
* External integrations: Atlassian MCP, Playwright MCP, GitHub MCP

## Architecture Notes

* The design favors small, testable functions over a monolithic pipeline script.
* The Confluence tree root should be treated as a stable anchor for all documentation pages.
* The implementation should prefer idempotent upserts over blind page creation.
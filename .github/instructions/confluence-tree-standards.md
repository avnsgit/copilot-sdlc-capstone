# Confluence Page Tree & Documentation Standards

## 1. Page Tree Structure
All documentation created during the SDLC pipeline MUST be nested under a master root parent page inside the Confluence space defined by `${CONFLUENCE_SPACE_KEY}` (e.g., `KAN`).

```text
📁 [PROJECT] Automated Documentation Sync Pipeline
 ├── 📄 01-Requirements Spec (generatedDocs/requirements.md)
 ├── 📄 02-System Architecture (generatedDocs/architecture.md)
 ├── 📄 03-Design Review Findings (generatedDocs/design-review.md)
 └── 📄 04-Implementation Plan (generatedDocs/impl-plan.md)
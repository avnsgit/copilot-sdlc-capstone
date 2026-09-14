# TypeScript Coding & Architecture Standards

## 1. Code Architecture
- Prefer Modular/Clean Architecture: separate API adapters, sync engine services, and configuration parsers into independent modules under `src/`.
- Function names must be self-explanatory (e.g., `syncMarkdownToConfluence()`, `fetchJiraUserStory()`).

## 2. Error Handling & Resilience
- Never allow uncaught promise rejections or unhandled runtime exceptions.
- Gracefully handle HTTP 404 (Not Found), 500 (Internal Server Error), network dropouts, and rate limits.
- Log meaningful context during failures without leaking raw API headers or tokens.

## 3. DRY & Clean Code
- Avoid duplicate logic. Extract shared Atlassian HTTP call logic into a shared client module (`src/atlassian-client.ts`).
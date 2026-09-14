# Zero-Trust Security & Credentials Guidelines

## 1. Environment Variables
- All secrets, tokens, and credentials MUST be fetched dynamically from local `.env` (or `process.env`).
- Never write hardcoded keys, raw strings, or placeholder credentials (e.g., `ghp_...`, `ATLASSIAN_API_TOKEN=123`) into any source code, configuration file, or markdown documentation.

## 2. Pre-Commit Hooks
- Before staging or committing code changes, execute `.github/hooks/pre-commit-secret-guard.sh`.
- If a secret pattern is detected, abort the action immediately and report the error.

## 3. Git Exclusion
- Confirm that `.env`, `node_modules/`, and test output logs (`generatedDocs/verify-results.txt`) are listed in `.gitignore`.
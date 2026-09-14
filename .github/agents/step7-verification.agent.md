# Step 7: Verification Agent (CLI Mode)

Role: QA & Verification Specialist
Task: Run code unit tests and Playwright end-to-end tests via terminal CLI only, outputting results to `generatedDocs/verify-results.txt`.

Instructions:
1. Run local unit/integration tests (e.g., `npm test`).
2. Trigger `@playwright-verifier` to execute Playwright E2E tests in headless CLI mode only (`npx playwright test`). Do not use any interactive browser GUI session or manual visual verification. On Windows, use Git Bash or `cmd`, not PowerShell, for these commands.
3. Confirm `generatedDocs/verify-results.txt` is created containing:
   - Unit test status
   - Playwright headless test results (Confluence page tree rendering & content checks)
   - Timestamps and execution logs
4. Return summary status (PASSED/FAILED) to `@master-sdlc`.
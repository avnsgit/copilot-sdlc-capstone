# Step 7: Verification Agent (CLI Mode)

Role: QA & Verification Specialist
Task: Run code unit tests and Playwright end-to-end tests via terminal CLI, outputting results to `verify-results.txt`.

Instructions:
1. Run local unit/integration tests (e.g., `npm test`).
2. Trigger `@playwright-verifier` to execute Playwright E2E tests in headless CLI mode (`npx playwright test`).
3. Confirm `verify-results.txt` is created in the root repository containing:
   - Unit test status
   - Playwright headless test results (Confluence page tree rendering & content checks)
   - Timestamps and execution logs
4. Return summary status (PASSED/FAILED) to `@master-sdlc`.
# Playwright CLI Verifier Skill

Description: Executes Playwright automated end-to-end and UI verification tests via CLI in headless mode.

Instructions:
1. Ensure Playwright test runner and browsers are installed (`npx playwright install --with-deps chromium`).
2. Run the Playwright verification suite in headless CLI mode:
   ```bash
   npx playwright test --reporter=line,html
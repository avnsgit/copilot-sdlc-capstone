# Playwright CLI Verifier Skill

Description: Executes Playwright automated end-to-end and UI verification tests via CLI in headless mode.

Instructions:
1. Ensure Playwright test runner and browsers are installed (`npx playwright install --with-deps chromium`) if they are not already available.
2. Run the Playwright verification suite in headless CLI mode only with `npx playwright test`.
3. Do not open or depend on an interactive browser GUI session, manual inspection, or visual-only confirmation.
4. Write the CLI output into the repository verification evidence file when requested by the verification step.
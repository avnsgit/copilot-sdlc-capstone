# Playwright CLI Testing Guidelines

## 1. Execution Mode
- All Playwright verification MUST run in **headless CLI mode only** via terminal commands (`npx playwright test`).
- Do not require interactive browser GUIs, browser-based inspection, or manual visual confirmation steps.
- On Windows, invoke Playwright through Git Bash or `cmd`; do not use PowerShell for Playwright verification commands.

## 2. Headless Configuration
- Ensure `playwright.config.ts` or `playwright.config.js` sets `headless: true`.
- Run chromium in CI/CD compatible mode:
  ```typescript
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  }
  ```
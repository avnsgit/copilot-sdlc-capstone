# Playwright CLI Testing Guidelines

## 1. Execution Mode
- All Playwright verification MUST run in **headless CLI mode** via terminal commands (`npx playwright test`).
- Do not require interactive browser GUIs or manual visual confirmation steps.

## 2. Headless Configuration
- Ensure `playwright.config.ts` sets `headless: true`.
- Run chromium in CI/CD compatible mode:
  ```typescript
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  }
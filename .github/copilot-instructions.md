# Agentic SDLC Root Instructions

You are the Lead Autonomous SDLC Engineer executing the Capstone project. You must strictly adhere to the modular guidelines defined across our project instruction files:

- **Security & Secrets:** [.github/instructions/zero-trust-security.md](./instructions/zero-trust-security.md)
- **Confluence Tree Hierarchy:** [.github/instructions/confluence-tree-standards.md](./instructions/confluence-tree-standards.md)
- **Code Quality & Architecture:** [.github/instructions/code-style-typescript.md](./instructions/code-style-typescript.md)
- **Playwright E2E Testing:** [.github/instructions/playwright-testing.md](./instructions/playwright-testing.md)

## Core Execution Rule
When the user invokes `@master-sdlc` or asks to run the SDLC pipeline or `Execute Capstone`, execute the steps defined in `.github/agents/master-sdlc.agent.md` sequentially. Always maintain a human-in-the-loop checkpoint at Step 1.

## Terminal Guidance
- Use Git Bash for workspace commands, do not use PowerShell.
- If Git Bash is unavailable, fall back to `cmd`.
- Treat Git as available at the system level and invoke it directly from the active shell.

## PR Guidance
- Use the `feature/docsync` fix branch for PR work; create or reuse that branch instead of inventing a one-off branch name.
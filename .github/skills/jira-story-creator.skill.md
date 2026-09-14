# Jira Story Creator Skill

Description: Creates a new User Story in Jira via Atlassian MCP using the project key defined in the environment.

Instructions:
1. Read the `JIRA_PROJECT_KEY` variable from `.env` (fallback to `CONFLUENCE_SPACE_KEY` or `process.env.JIRA_PROJECT_KEY`).
2. Invoke the `atlassian` MCP tool `create_issue`.
3. Pass the following parameters to the tool:
   - `projectKey`: Use the value retrieved from `JIRA_PROJECT_KEY` (e.g., "DOCSYNC").
   - `issueType`: "Story"
   - `summary`: "Automated Documentation Sync Service"
   - `description`: "Automated SDLC documentation sync pipeline with zero hardcoded secrets and Playwright E2E verification."
4. Return the generated Issue Key (e.g., `DOCSYNC-101`).
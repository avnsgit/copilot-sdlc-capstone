# Jira Story Reader Skill

Description: Reads and parses an existing User Story from Jira using the Atlassian MCP server.

Instructions:
1. Read `JIRA_PROJECT_KEY` (or `JIRA_ISSUE_KEY`) from `.env`.
2. If `JIRA_ISSUE_KEY` is not provided in `.env`, use the `atlassian` MCP server tool to list/search issues in project `JIRA_PROJECT_KEY` and select the latest open User Story.
3. Fetch the full issue details (Summary, Description, Acceptance Criteria, Priority).
4. Parse the criteria and present a clean summary to the user.
5. Return the raw issue payload for downstream Agents (`@step1-requirements`).
#!/bin/bash
# Pre-Commit Hook: Prevent committing raw secrets

echo "🔍 Running Secret Guard Hook..."

# Check staged files for hardcoded Atlassian or GitHub token patterns
if git diff --cached | grep -E "(ATLASSIAN_API_TOKEN|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})" > /dev/null; then
    echo "❌ ERROR: Hardcoded secret detected in staged changes!"
    echo "Please use process.env and store secrets in .env file."
    exit 1
fi

echo "✅ Secret Guard passed."
exit 0
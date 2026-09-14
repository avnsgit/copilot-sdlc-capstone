#!/bin/bash
# Post-Implementation Hook: Verify local Markdown files exist

echo "🔍 Verifying SDLC documentation integrity..."

REQUIRED_FILES=("generatedDocs/requirements.md" "generatedDocs/architecture.md" "generatedDocs/design-review.md" "generatedDocs/impl-plan.md")

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️ MISSING DOC: $file is required before running Playwright tests."
        exit 1
    fi
done

echo "✅ All required SDLC document files are present."
exit 0
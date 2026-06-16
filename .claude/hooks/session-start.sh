#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install skill: website-analyzer-builder
mkdir -p "$HOME/.claude/commands"
cp "$CLAUDE_PROJECT_DIR/scripts/skills/website-analyzer-builder.md" \
   "$HOME/.claude/commands/website-analyzer-builder.md"

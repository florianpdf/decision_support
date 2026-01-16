#!/bin/bash
# Pre-push hook script to verify tests pass before pushing

set -e

echo "🔍 Running pre-push checks..."

# Verify package-lock.json is in sync
echo "📦 Verifying package-lock.json is in sync..."
npm run verify-lock

# Run tests
echo "🧪 Running tests..."
npm run test:ci

echo "✅ All pre-push checks passed!"
exit 0

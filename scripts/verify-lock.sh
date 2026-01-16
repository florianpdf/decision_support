#!/bin/bash
# Script to verify that package-lock.json is in sync with package.json

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Verifying package-lock.json is in sync with package.json..."

# Create a backup
cp package-lock.json package-lock.json.backup

# Try to regenerate package-lock.json
npm install --package-lock-only > /dev/null 2>&1

# Extract lockfile version using grep (more portable than jq)
OLD_LOCK=$(grep -o '"lockfileVersion":[0-9]*' package-lock.json.backup | head -1 | cut -d: -f2 || echo "")
NEW_LOCK=$(grep -o '"lockfileVersion":[0-9]*' package-lock.json | head -1 | cut -d: -f2 || echo "")

# Extract package names from dependencies (simple grep approach)
OLD_DEPS=$(grep -o '"[^"]*":\s*{' package-lock.json.backup | grep -v '"lockfileVersion"' | head -20 | cut -d'"' -f2 | sort | tr '\n' ' ')
NEW_DEPS=$(grep -o '"[^"]*":\s*{' package-lock.json | grep -v '"lockfileVersion"' | head -20 | cut -d'"' -f2 | sort | tr '\n' ' ')

# Restore original
mv package-lock.json.backup package-lock.json

# Check if lockfile version differs (main indicator)
if [ "$OLD_LOCK" != "$NEW_LOCK" ]; then
    echo -e "${RED}Error: package-lock.json is out of sync with package.json${NC}"
    echo "Lockfile version changed: $OLD_LOCK -> $NEW_LOCK"
    echo "Please run 'npm install' locally and commit the updated package-lock.json"
    exit 1
fi

# Also check if npm ci would fail (more reliable check)
if ! npm ci --dry-run > /dev/null 2>&1; then
    echo -e "${RED}Error: package-lock.json is out of sync with package.json${NC}"
    echo "npm ci would fail. Please run 'npm install' locally and commit the updated package-lock.json"
    exit 1
fi

echo -e "${GREEN}✓ package-lock.json is in sync with package.json${NC}"
exit 0

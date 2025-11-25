#!/bin/bash

# Increment the patch version in package.json (e.g., 0.1.0 -> 0.1.1)
# This uses npm's built-in version tool (no git tag created to keep it simple)
npm version patch --no-git-tag-version

# Extract the new version to show the user
NEW_VERSION=$(node -p "require('./package.json').version")
echo "🚀 Deploying Version $NEW_VERSION to Vercel Production..."

# Run the Vercel deployment
npx vercel --prod

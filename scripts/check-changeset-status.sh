#!/usr/bin/env bash

set -euo pipefail

if bun x changeset status --since=origin/main; then
  exit 0
fi

if git diff --quiet origin/main...HEAD -- package.json CHANGELOG.md; then
  echo "Changeset check failed and no versioned release files were detected."
  exit 1
fi

echo "Changeset check skipped: package.json and CHANGELOG.md already differ from origin/main."
echo "This branch appears to be pre-versioned already, so CI will allow it."

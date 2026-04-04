#!/usr/bin/env bash
# After npm publish:
#   curl -fsSL https://raw.githubusercontent.com/<you>/agenture-cli/main/scripts/install.sh | bash -s -- /path/to/target/repo
#
# Local clone:
#   ./scripts/install.sh /path/to/target/repo
set -euo pipefail

TARGET="${1:-.}"
ABS_TARGET="$(cd "$TARGET" && pwd)"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$ROOT/dist/cli.js" ]]; then
  exec node "$ROOT/dist/cli.js" init "$ABS_TARGET"
fi

if command -v pnpm >/dev/null 2>&1; then
  (cd "$ROOT" && pnpm install && pnpm run build)
  exec node "$ROOT/dist/cli.js" init "$ABS_TARGET"
fi

echo "Built CLI not found and pnpm unavailable. From the clone, run: pnpm install && pnpm run build && node dist/cli.js init \"$ABS_TARGET\"" >&2
echo "Or after publish: npx agenture-cli@latest init \"$ABS_TARGET\"" >&2
exit 1

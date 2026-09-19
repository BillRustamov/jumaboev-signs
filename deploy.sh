#!/bin/bash
# Same host as AK Photo / driving: root@178.156.164.148
# Usage: ./deploy.sh
set -euo pipefail

REMOTE_USER="root"
REMOTE_HOST="178.156.164.148"
REMOTE_PATH="/var/www/usprint/"
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Rsync shop to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
echo "   Only this directory. Does not sync ak-photo, api, or driving."
rsync \
  --archive \
  --compress \
  --delete-after \
  --delay-updates \
  --exclude '.git' \
  --exclude '.next' \
  --exclude 'node_modules' \
  --exclude 'data' \
  --exclude '.env' \
  --exclude '.open-next' \
  -e 'ssh -o BatchMode=yes -o ConnectTimeout=15' \
  "$ROOT/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

echo "▶ Build and restart on server"
ssh -o BatchMode=yes "${REMOTE_USER}@${REMOTE_HOST}" 'bash -s' <<'EOF'
set -euo pipefail
cd /var/www/usprint
if [[ ! -f /etc/systemd/system/usprint.service ]]; then
  bash deploy/remote-setup.sh
else
  npm ci
  npm run build
  chown -R www-data:www-data /var/www/usprint
  systemctl restart usprint
fi
systemctl --no-pager --full status usprint | head -16
EOF

echo "▶ Smoke"
curl -sS -o /dev/null -w "https://www.usprint.app  %{http_code}\n" -m 20 https://www.usprint.app/ || true

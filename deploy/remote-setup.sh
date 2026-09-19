#!/bin/bash
# Install usprint.app ONLY. Does not restart, rewrite, or chown other sites.
# Safe on the shared Hetzner box with AK Photo / driving / etc.
#
# Touches:
#   /var/www/usprint
#   /etc/systemd/system/usprint.service
#   one new Caddy drop-in (or a new site block appended after validate)
#
# Never touches:
#   /var/www/ak-photo /var/www/akphoto-api /var/www/driving-marketing
#   postgres, php-fpm, ak-photo.service, akphoto-worker
set -euo pipefail

SITE=/var/www/usprint
CADDY_DIR=/etc/caddy
PORT=43147
PROTECTED=(
  /var/www/ak-photo
  /var/www/akphoto-api
  /var/www/cityline-app
  /var/www/davinci-tech
  /var/www/ddreams-app
  /var/www/dkexpress-it-com
  /var/www/driving-marketing
  /var/www/oaba-drive-forward
  /var/www/turn-around-landing
  /var/www/ultra-clean-nyc
)

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root." >&2
  exit 1
fi

if [[ ! -d "$SITE/deploy" ]]; then
  echo "Missing $SITE/deploy — copy the shop there first." >&2
  exit 1
fi

for path in "${PROTECTED[@]}"; do
  if [[ "$SITE" == "$path" || "$SITE" == "$path"/* ]]; then
    echo "Refusing to install over $path" >&2
    exit 1
  fi
done

pick_node() {
  local from_ak
  from_ak="$(systemctl cat ak-photo 2>/dev/null | awk '/^ExecStart=/{print $1; exit}' | sed 's/^ExecStart=//')"
  if [[ -n "$from_ak" && -x "$from_ak" && "$from_ak" != *fnm_multishells* ]]; then
    echo "$from_ak"
    return
  fi
  local candidate
  for candidate in /usr/bin/node /usr/local/bin/node; do
    if [[ -x "$candidate" ]]; then
      echo "$candidate"
      return
    fi
  done
  candidate="$(find /root/.local/share/fnm/node-versions /home/*/.local/share/fnm/node-versions -path '*/bin/node' -type f 2>/dev/null | sort | tail -1 || true)"
  if [[ -n "$candidate" && -x "$candidate" ]]; then
    echo "$candidate"
    return
  fi
  return 1
}

NODE_BIN="$(pick_node || true)"
if [[ -z "$NODE_BIN" ]]; then
  echo "No system Node found. Do not install a new Node without checking AK Photo first." >&2
  exit 1
fi
echo "Using Node $NODE_BIN ($("$NODE_BIN" -v))"

if ss -lnt 2>/dev/null | awk '{print $4}' | grep -qE ":${PORT}\$"; then
  echo "Port $PORT is already in use. Not starting usprint there (would collide)." >&2
  ss -lntp | grep ":${PORT}" || true
  exit 1
fi

sed "s|/usr/bin/node|${NODE_BIN}|" "$SITE/deploy/usprint.service" \
  > /etc/systemd/system/usprint.service

add_caddy_site() {
  local snippet="$SITE/deploy/caddy.usprint.app"
  if grep -RqsE 'usprint\.app' "$CADDY_DIR" 2>/dev/null; then
    echo "Caddy already mentions usprint.app — leaving Caddy config unchanged."
    return
  fi

  local dropin=""
  for dir in "$CADDY_DIR/conf.d" "$CADDY_DIR/Caddyfile.d" /etc/caddy/conf.d; do
    if [[ -d "$dir" ]]; then
      dropin="$dir/usprint.app.caddy"
      install -m 644 "$snippet" "$dropin"
      echo "Wrote new drop-in $dropin (other site files untouched)."
      break
    fi
  done

  if [[ -z "$dropin" && -f "$CADDY_DIR/Caddyfile" ]]; then
    if grep -qE '^[[:space:]]*import ' "$CADDY_DIR/Caddyfile"; then
      install -m 644 "$snippet" "$CADDY_DIR/usprint.app.caddy"
      echo "import usprint.app.caddy" >> "$CADDY_DIR/Caddyfile"
      echo "Added import of usprint.app.caddy. Existing site blocks unchanged."
    else
      {
        echo ""
        echo "# usprint.app — added $(date -u +%Y-%m-%dT%H:%M:%SZ); other sites unchanged"
        cat "$snippet"
      } >> "$CADDY_DIR/Caddyfile"
      echo "Appended usprint.app site block to Caddyfile. Existing blocks unchanged."
    fi
  fi

  if [[ -f "$CADDY_DIR/Caddyfile" ]]; then
    caddy validate --config "$CADDY_DIR/Caddyfile"
    systemctl reload caddy
    echo "Caddy reloaded (not restarted). AK Photo / other vhosts stay up."
  fi
}

add_caddy_site

cd "$SITE"
if [[ ! -f .env ]]; then
  cp .env.example .env
  sed -i 's|^APP_URL=.*|APP_URL=https://www.usprint.app|' .env
fi

npm ci
npm run build
mkdir -p data
chown -R www-data:www-data "$SITE"

systemctl daemon-reload
systemctl enable --now usprint

echo
echo "Other apps (should still be active):"
systemctl is-active caddy ak-photo akphoto-worker 2>/dev/null || true
echo "usprint: $(systemctl is-active usprint)"
echo "Public URL: https://www.usprint.app"

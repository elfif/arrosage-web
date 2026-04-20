#!/usr/bin/env bash
# Build the web app locally and deploy dist/ to the Raspberry Pi.
#
# Assumes `ssh raspberry` is configured (host alias in ~/.ssh/config).
# The project on the Pi lives at /home/jnfrm/projects/arrosage/arrosage-web.

set -euo pipefail

SSH_HOST="raspberry"
REMOTE_PROJECT_DIR="/home/jnfrm/projects/arrosage/arrosage-web"
REMOTE_DIST_DIR="${REMOTE_PROJECT_DIR}/dist"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOCAL_DIST_DIR="${PROJECT_DIR}/dist"

color() {
  local code="$1"; shift
  printf "\033[%sm%s\033[0m\n" "$code" "$*"
}
info()    { color "1;34" "==> $*"; }
success() { color "1;32" "==> $*"; }
warn()    { color "1;33" "==> $*"; }
err()     { color "1;31" "==> $*" >&2; }

cd "$PROJECT_DIR"

info "Checking SSH connectivity to ${SSH_HOST}..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$SSH_HOST" true 2>/dev/null; then
  err "Cannot reach '${SSH_HOST}' over SSH. Check your ~/.ssh/config and that the Pi is online."
  exit 1
fi

info "Building the app locally..."
npm run build

if [[ ! -d "$LOCAL_DIST_DIR" ]]; then
  err "Build did not produce a dist/ directory at ${LOCAL_DIST_DIR}."
  exit 1
fi

info "Ensuring remote directory exists: ${REMOTE_DIST_DIR}"
ssh "$SSH_HOST" "mkdir -p '${REMOTE_DIST_DIR}'"

info "Syncing dist/ to ${SSH_HOST}:${REMOTE_DIST_DIR}"
rsync -az --delete --human-readable --info=stats2,progress2 \
  "${LOCAL_DIST_DIR}/" "${SSH_HOST}:${REMOTE_DIST_DIR}/"

success "Deployment complete."

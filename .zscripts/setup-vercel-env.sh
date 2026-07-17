#!/usr/bin/env bash
#
# setup-vercel-env.sh — One-shot helper to set Supabase Storage env vars on Vercel.
#
# This script uses the Vercel CLI to set the environment variables required
# for admin image uploads to persist on Vercel (production):
#
#   SUPABASE_URL                 — e.g. https://jscdahwphgfmfgwavhxn.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY    — Supabase service_role JWT (long)
#
# After running this script, trigger a redeploy in Vercel (or push a new
# commit) so the env vars take effect. Then open the admin dashboard →
# "Pengaturan Storage" page and click "Buat Bucket Otomatis" — the app will
# auto-create the public `product-images` bucket for you.
#
# Prerequisites:
#   - Vercel CLI installed:  npm install -g vercel
#   - Logged in:             vercel login
#   - Project linked:        vercel link   (run inside project root)
#
# Usage:
#   ./setup-vercel-env.sh
#
#   Or non-interactively:
#   SUPABASE_URL=https://xxx.supabase.co \
#   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
#   ./setup-vercel-env.sh

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# Color helpers
if [ -t 1 ]; then
  GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'; RED=$'\033[0;31m'
  CYAN=$'\033[0;36m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  GREEN=""; YELLOW=""; RED=""; CYAN=""; BOLD=""; RESET=""
fi

log()  { printf '%s==%s %s\n' "$CYAN" "$RESET" "$*"; }
ok()   { printf '%s✓%s %s\n' "$GREEN" "$RESET" "$*"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$RESET" "$*"; }
err()  { printf '%s✗%s %s\n' "$RED" "$RESET" "$*" >&2; }

# 1. Check Vercel CLI is available
if ! command -v vercel >/dev/null 2>&1; then
  err "Vercel CLI tidak ditemukan."
  echo ""
  echo "Install dengan: ${BOLD}npm install -g vercel${RESET}"
  echo "Lalu jalankan:  ${BOLD}vercel login${RESET}"
  echo "Lalu link project: ${BOLD}vercel link${RESET} (dari root project ini)"
  exit 1
fi

# 2. Check project is linked
if [ ! -f ".vercel/project.json" ]; then
  warn "Project belum di-link ke Vercel."
  echo ""
  echo "Jalankan: ${BOLD}vercel link${RESET}"
  echo "Pilih existing project: ${BOLD}Katalog-Produk${RESET} (atau nama project di Vercel Anda)"
  exit 1
fi

ok "Vercel CLI terdeteksi, project ter-link."

# 3. Collect credentials (use env vars or prompt)
SUPA_URL="${SUPABASE_URL:-}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SUPA_URL" ] || [ -z "$SUPA_KEY" ]; then
  echo ""
  echo "${BOLD}Setup Supabase Storage Environment Variables${RESET}"
  echo ""
  echo "Dapatkan kredensial dari Supabase Dashboard:"
  echo "  ${CYAN}https://supabase.com/dashboard${RESET} → pilih project →"
  echo "  Project Settings → API"
  echo ""
  [ -z "$SUPA_URL" ] && read -r -p "SUPABASE_URL (https://xxx.supabase.co): " SUPA_URL
  [ -z "$SUPA_KEY" ] && read -r -p "SUPABASE_SERVICE_ROLE_KEY (eyJ...): " SUPA_KEY
  echo ""
fi

# 4. Validate inputs
if [[ ! "$SUPA_URL" =~ ^https://[a-z0-9]+\.supabase\.co$ ]]; then
  err "SUPABASE_URL tidak valid. Format: https://<project-ref>.supabase.co"
  exit 1
fi

if [ ${#SUPA_KEY} -lt 50 ]; then
  err "SUPABASE_SERVICE_ROLE_KEY terlalu pendek. Pastikan Anda menyalin service_role key (bukan anon key)."
  exit 1
fi

ok "Input valid: URL=$SUPA_URL, key length=${#SUPA_KEY}"

# 5. Set env vars on Vercel (production + preview + development)
echo ""
log "Mengatur environment variables di Vercel..."

# Vercel CLI v28+ supports `vercel env add <name> <env> < <file>` but the
# most reliable cross-version pattern is to pipe via stdin.
for ENV_NAME in production preview development; do
  printf '%s' "$SUPA_URL" | vercel env add SUPABASE_URL "$ENV_NAME" 2>/dev/null || \
    warn "SUPABASE_URL [$ENV_NAME] mungkin sudah ada — lewati."
  printf '%s' "$SUPA_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY "$ENV_NAME" 2>/dev/null || \
    warn "SUPABASE_SERVICE_ROLE_KEY [$ENV_NAME] mungkin sudah ada — lewati."
done

ok "Environment variables diset untuk production, preview, dan development."

# 6. Reminder to redeploy
echo ""
echo "${BOLD}${GREEN}Selesai!${RESET}"
echo ""
echo "Langkah selanjutnya:"
echo "  1. ${BOLD}Trigger redeploy${RESET} di Vercel Dashboard (Deployments → Redeploy)"
echo "     atau push commit baru ke main."
echo "  2. Buka ${BOLD}/admin/dashboard/storage${RESET} di aplikasi."
echo "  3. Klik ${BOLD}'Buat Bucket Otomatis'${RESET} — bucket 'product-images' akan"
echo "     dibuat dengan akses publik."
echo "  4. Upload gambar produk akan otomatis tersimpan ke Supabase Storage."
echo ""
echo "Untuk verifikasi manual di Supabase Dashboard:"
echo "  ${CYAN}https://supabase.com/dashboard/project/jscdahwphgfmfgwavhxn/storage/buckets${RESET}"

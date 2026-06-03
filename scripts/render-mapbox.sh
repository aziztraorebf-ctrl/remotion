#!/bin/bash
# Render Mapbox (WebGL) compositions via chrome-headless-shell
# Usage: ./scripts/render-mapbox.sh <CompositionId> <output.mp4> [extra-remotion-args...]
#
# FIX 2026-05-24 :
#   - chrome-headless-shell (pas Chrome for Testing) — seul qui ne timeout pas
#   - --public-dir slim via symlinks — evite la copie des 2.5 GB de public/
#   - src/index.ts en argument explicite
#
# Speed: ~180 frames/35s (~5fps render rate).

set -e

# Chrome headless shell géré par Remotion (npx remotion browser ensure).
# Chemin stable relatif au projet — survit aux réinstalls node_modules.
HEADLESS="$(pwd)/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell"
# Fallback : ancien chemin Playwright global si présent.
if [ ! -f "$HEADLESS" ]; then
  HEADLESS="$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell 2>/dev/null | head -1)"
fi
COMP="${1:?Usage: render-mapbox.sh <CompositionId> <output.mp4>}"
OUT="${2:?Usage: render-mapbox.sh <CompositionId> <output.mp4>}"
shift 2

# Slim public dir — symlinks vers sous-dossiers audio/geo/_shared uniquement
# Evite de copier seedance/, atlas/, assets/ (~2.4 GB inutiles pour Mapbox)
SLIM_DIR="/tmp/public-mapbox-slim"
rm -rf "$SLIM_DIR"
mkdir -p "$SLIM_DIR"
for dir in souverain atlas _shared _demos geo-data fonts; do
  [ -d "public/$dir" ] && ln -s "$(pwd)/public/$dir" "$SLIM_DIR/$dir"
done
for f in public/*.json public/*.png; do
  [ -f "$f" ] && ln -s "$(pwd)/$f" "$SLIM_DIR/$(basename "$f")" 2>/dev/null || true
done

echo "Slim public: $(ls $SLIM_DIR | tr '\n' ' ')"

npx remotion render src/index.ts "$COMP" "$OUT" \
  --browser-executable="$HEADLESS" \
  --gl=angle \
  --concurrency=1 \
  --public-dir="$SLIM_DIR" \
  --env-file=.env \
  "$@"

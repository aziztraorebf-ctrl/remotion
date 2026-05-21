#!/bin/bash
# Render Mapbox (WebGL) compositions via Chrome for Testing
# Usage: ./scripts/render-mapbox.sh <CompositionId> <output.mp4>
#
# Speed: ~180 frames/35s (~5fps render rate).
#   30s video  = ~3 min
#   1min video = ~6 min
#   5min video = ~30 min

CHROME="/Users/clawdbot/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
COMP="${1:-MapboxGhanaHighlight}"
OUT="${2:-out/${COMP}.mp4}"

npx remotion render "$COMP" "$OUT" \
  --browser-executable="$CHROME" \
  --gl=angle \
  --concurrency=1

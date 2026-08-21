#!/usr/bin/env bash
# Recupere les clips depuis la release `gallery-media` (ils ne sont pas dans git).
# Le workflow de deploiement fait la meme chose avant de publier.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p clips
gh release download gallery-media --repo aziztraorebf-ctrl/remotion \
  --dir clips --pattern '*.mp4' --clobber
echo "ok : $(ls clips/*.mp4 | wc -l | tr -d ' ') clips"

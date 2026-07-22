#!/bin/bash
# Concatene les 6 actes du Soudan mid-form dans l'ordre valide.
# Prerequis : les fragments Acte 3 et Acte 4 doivent deja etre pre-concatenes en a3.mp4 / a4.mp4.
# Usage: ./concat-6actes.sh <dossier_actes> <out.mp4>
#   dossier doit contenir : a1.mp4 a2.mp4 a3.mp4 a4.mp4 a5.mp4 a6.mp4
set -e

DIR="${1:?usage: concat-6actes.sh <dossier> <out.mp4>}"
OUT="${2:?out.mp4 requis}"

# Ordre valide (starter) : A1 A2 A3 A4 A5 A6
ACTES=(a1.mp4 a2.mp4 a3.mp4 a4.mp4 a5.mp4 a6.mp4)

LIST=$(mktemp /tmp/soudan-concat-XXXX.txt)
TOTAL=0
for a in "${ACTES[@]}"; do
  f="$DIR/$a"
  if [ ! -f "$f" ]; then echo "MANQUE: $f"; exit 1; fi
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "  $a : ${d}s"
  TOTAL=$(python3 -c "print($TOTAL + $d)")
  echo "file '$(cd "$DIR" && pwd)/$a'" >> "$LIST"
done
echo "TOTAL attendu: ${TOTAL}s (cible ~625.8s)"

# Re-encode pour raccord propre (params heterogenes possibles entre Mapbox et D3)
ffmpeg -y -f concat -safe 0 -i "$LIST" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 256k -movflags +faststart \
  "$OUT"

rm -f "$LIST"
FINAL=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
echo "-> $OUT (${FINAL}s)"

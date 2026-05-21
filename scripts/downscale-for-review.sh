#!/bin/bash
# Downscale images/frames avant analyse Claude — économie tokens vision
# Tokens Claude Vision (tiles 512px) :
#   1920x1080 = 2125 tokens | 1366x768 = 1105 tokens (-48%) | 768x432 = 425 tokens (-80%)
# Usage:
#   ./scripts/downscale-for-review.sh image.png          -> image_review.png (432p, même dossier)
#   ./scripts/downscale-for-review.sh out/beat2.mp4      -> /tmp/review_frames/ (5 frames extraites)
#   ./scripts/downscale-for-review.sh out/beat2.mp4 3    -> 3 frames extraites
#   ./scripts/downscale-for-review.sh out/ --batch       -> traite tous les PNG/JPG du dossier

set -e

FFMPEG="/opt/homebrew/bin/ffmpeg"
MAX_HEIGHT=432   # 1080->432 = -80% tokens Claude vision (tiles 512px). Passer à 768 si détails fins requis.
QUALITY=85       # JPEG quality pour les frames extraites

input="$1"
arg2="$2"

if [ -z "$input" ]; then
  echo "Usage: $0 <image|video|dossier> [nb_frames|--batch]"
  exit 1
fi

downscale_image() {
  local src="$1"
  local dst="${src%.*}_review.${src##*.}"
  # Si déjà au format review, ne pas re-processer
  [[ "$src" == *_review* ]] && echo "skip: $src" && return
  $FFMPEG -y -i "$src" \
    -vf "scale=-2:$MAX_HEIGHT:flags=lanczos" \
    -q:v 2 \
    "$dst" -loglevel error
  local orig=$(wc -c < "$src")
  local new=$(wc -c < "$dst")
  local pct=$(( (orig - new) * 100 / orig ))
  echo "$(basename $src) -> $(basename $dst) (-${pct}% taille)"
}

extract_video_frames() {
  local src="$1"
  local nb="${2:-5}"
  local outdir="/tmp/review_frames"
  rm -rf "$outdir" && mkdir -p "$outdir"
  # Durée totale
  local duration=$($FFMPEG -i "$src" 2>&1 | grep Duration | awk '{print $2}' | tr -d , | awk -F: '{print $1*3600+$2*60+$3}')
  # Distribuer les frames uniformément (début / milieux / fin)
  $FFMPEG -y -i "$src" \
    -vf "select='not(mod(n\,floor(t*25/$nb)))',scale=-2:$MAX_HEIGHT:flags=lanczos,fps=1/$((${duration%.*}/nb))" \
    -vsync vfr \
    -frames:v "$nb" \
    "$outdir/frame_%02d.jpg" -loglevel error 2>/dev/null || \
  $FFMPEG -y -i "$src" \
    -vf "fps=1,scale=-2:$MAX_HEIGHT:flags=lanczos" \
    -frames:v "$nb" \
    "$outdir/frame_%02d.jpg" -loglevel error
  echo "Frames extraites dans $outdir :"
  ls -lh "$outdir"/*.jpg 2>/dev/null
}

# Batch mode : dossier entier
if [ "$arg2" = "--batch" ] && [ -d "$input" ]; then
  count=0
  for f in "$input"/*.png "$input"/*.jpg "$input"/*.jpeg; do
    [ -f "$f" ] && downscale_image "$f" && count=$((count+1))
  done
  echo "--- $count image(s) downscalées"
  exit 0
fi

# Vidéo -> frames
ext="${input##*.}"
if [[ "$ext" =~ ^(mp4|mov|webm|avi)$ ]]; then
  nb_frames="${arg2:-5}"
  extract_video_frames "$input" "$nb_frames"
  exit 0
fi

# Image unique
if [ -f "$input" ]; then
  downscale_image "$input"
  exit 0
fi

echo "Erreur: '$input' non reconnu (image, video, ou dossier attendu)"
exit 1

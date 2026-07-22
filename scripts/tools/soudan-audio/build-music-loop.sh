#!/bin/bash
# Construit une boucle musicale organique par crossfade (acrossfade) pour couvrir une duree cible.
# Usage: ./build-music-loop.sh <music.mp3> <duree_cible_s> <out.mp3> [crossfade_s]
# Chaque repetition se fond dans la suivante (acrossfade) -> zero raccord sec.
# Puis fade-in 2s / fade-out 3s + trim a la duree cible.
set -e

MUSIC="${1:?usage: build-music-loop.sh <music.mp3> <duree_cible_s> <out.mp3> [crossfade_s]}"
TARGET="${2:?duree cible en secondes requise}"
OUT="${3:?out.mp3 requis}"
XF="${4:-3}"           # crossfade en secondes
FADE_IN=2
FADE_OUT=3

SRCDUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MUSIC")

# Nombre de copies : chaque acrossfade "mange" XF secondes de recouvrement.
# duree_effective(N copies) = N*SRCDUR - (N-1)*XF. On resout pour depasser TARGET.
N=$(python3 -c "import math; s=$SRCDUR; xf=$XF; t=$TARGET; n=1
while n*s-(n-1)*xf < t+1: n+=1
print(n)")

echo "Source: ${SRCDUR}s | cible: ${TARGET}s | crossfade: ${XF}s | copies: $N"

# Construire les inputs (N fois le meme fichier) + chaine acrossfade en cascade.
INPUTS=()
for i in $(seq 1 "$N"); do INPUTS+=(-i "$MUSIC"); done

FILTER=""
if [ "$N" -eq 1 ]; then
  FILTER="[0:a]acopy[loop];"
else
  # cascade : [0][1]acrossfade -> [x1] ; [x1][2]acrossfade -> [x2] ; ...
  PREV="[0:a]"
  for i in $(seq 1 $((N-1))); do
    LABEL="[x${i}]"
    FILTER+="${PREV}[${i}:a]acrossfade=d=${XF}:c1=tri:c2=tri${LABEL};"
    PREV="${LABEL}"
  done
  # renommer le dernier en [loop]
  FILTER="${FILTER%;};" # no-op safety
  LASTLABEL="[x$((N-1))]"
  FILTER="${FILTER}${LASTLABEL}atrim=0:${TARGET},afade=t=in:st=0:d=${FADE_IN},afade=t=out:st=$(python3 -c "print($TARGET-$FADE_OUT)"):d=${FADE_OUT}[loop];"
fi

ffmpeg -y "${INPUTS[@]}" \
  -filter_complex "${FILTER%;}" \
  -map "[loop]" -c:a libmp3lame -b:a 256k \
  "$OUT"

FINAL=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
echo "-> $OUT (${FINAL}s)"

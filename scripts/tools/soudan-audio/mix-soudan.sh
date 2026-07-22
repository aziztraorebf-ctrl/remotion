#!/bin/bash
# Mix audio mid-form Soudan : musique (boucle pre-construite) + 7 SFX sur l'assemblage.
# Usage: ./mix-soudan.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]
#   La musique DOIT deja etre bouclee a la duree de la video (via build-music-loop.sh).
#   music_vol optionnel (defaut 0.08 = decision figee Aziz ; passer 0.06 si trop fort).
# Reglages FIGES (decision Aziz 2026-07-21) :
#   - musique vol 0.08, basses domptees bass=g=-7:f=200:w=0.6, voix reine
#   - SFX vol 0.5
set -e

ASSEMBLAGE="${1:?usage: mix-soudan.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]}"
MUSIC="${2:?music-loop.mp3 requis}"
OUT="${3:?out.mp4 requis}"
MUSIC_VOL="${4:-0.08}"   # decision figee : 0.08 (->0.06 si trop fort)

SFXDIR="/Users/clawdbot/Workspace/remotion/public/_shared/sfx/soudan"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ASSEMBLAGE")

# --- Reglages mix (FIGES) ---
SFX_VOL=0.5
BASS_FILTER="bass=g=-7:f=200:w=0.6"

# Timecodes SFX (secondes) — cales sur l'assemblage (brief passe finale)
declare -a SFX_FILES=(
  "sfx-soudan-mines.mp3:6"
  "sfx-soudan-fracture.mp3:86"
  "sfx-soudan-connexion.mp3:189"
  "sfx-soudan-russie.mp3:284"
  "sfx-soudan-drone.mp3:363"
  "sfx-soudan-veto.mp3:535"
  "sfx-soudan-bilan.mp3:600"
)

# Inputs : [0]=video assemblage, [1]=musique boucle, [2..]=SFX
INPUTS=(-i "$ASSEMBLAGE" -i "$MUSIC")
FILTER=""
# musique : deja bouclee+fadee, on applique basses domptees + volume.
# atrim de securite a DUR au cas ou la boucle depasse.
FILTER+="[1:a]atrim=0:${DUR},${BASS_FILTER},volume=${MUSIC_VOL}[music];"

# SFX : chaque fichier decale (adelay) a son timecode
IDX=2
MIXLABELS="[0:a][music]"
for entry in "${SFX_FILES[@]}"; do
  file="${entry%%:*}"; tc="${entry##*:}"
  INPUTS+=(-i "$SFXDIR/$file")
  ms=$(echo "$tc * 1000" | bc | cut -d. -f1)
  FILTER+="[${IDX}:a]adelay=${ms}|${ms},volume=${SFX_VOL}[sfx${IDX}];"
  MIXLABELS+="[sfx${IDX}]"
  IDX=$((IDX+1))
done

NUM_MIX=$((IDX))  # 0:a + music + (IDX-2) sfx
FILTER+="${MIXLABELS}amix=inputs=${NUM_MIX}:duration=first:dropout_transition=0:normalize=0[aout]"

echo "Duree: ${DUR}s | musique: $(basename $MUSIC) vol=${MUSIC_VOL} bass=${BASS_FILTER} | SFX: ${#SFX_FILES[@]} vol=${SFX_VOL}"
ffmpeg -y "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 256k \
  "$OUT"
echo "-> $OUT"

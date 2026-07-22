#!/bin/bash
# Mix audio mid-form Soudan : musique (loop + fade + nappe) + 7 SFX sur l'assemblage.
# Usage: ./mix-soudan.sh <assemblage.mp4> <music.mp3> <out.mp4>
#   La musique est bouclee pour couvrir toute la duree, volume nappe (voix reine).
#   Les 7 SFX sont poses aux timecodes globaux du brief.
set -e

ASSEMBLAGE="${1:?usage: mix-soudan.sh <assemblage.mp4> <music.mp3> <out.mp4>}"
MUSIC="${2:?music.mp3 requis}"
OUT="${3:?out.mp4 requis}"

SFXDIR="/Users/clawdbot/Workspace/remotion/public/_shared/sfx/soudan"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ASSEMBLAGE")

# --- Reglages mix ---
MUSIC_VOL=0.14      # nappe sous la narration (~-17dB), voix reine
FADE_IN=2           # fondu entree musique
FADE_OUT=3          # fondu sortie musique
SFX_VOL=0.55        # SFX ponctuels, presents mais pas dominants

# Timecodes SFX (secondes) — cales sur l'assemblage (brief passe finale)
# mines=6 fracture=86 connexion=189 russie=284 drone=363 veto=535 bilan=600
declare -a SFX_FILES=(
  "sfx-soudan-mines.mp3:6"
  "sfx-soudan-fracture.mp3:86"
  "sfx-soudan-connexion.mp3:189"
  "sfx-soudan-russie.mp3:284"
  "sfx-soudan-drone.mp3:363"
  "sfx-soudan-veto.mp3:535"
  "sfx-soudan-bilan.mp3:600"
)

# Construire les inputs : [0]=video assemblage, [1]=musique (loop), [2..]=SFX
INPUTS=(-i "$ASSEMBLAGE" -stream_loop -1 -i "$MUSIC")
FILTER=""
# musique : loop deja via -stream_loop, on trim a DUR + fades + volume
FILTER+="[1:a]atrim=0:${DUR},afade=t=in:st=0:d=${FADE_IN},afade=t=out:st=$(echo "$DUR - $FADE_OUT" | bc):d=${FADE_OUT},volume=${MUSIC_VOL}[music];"

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

NUM_MIX=$((IDX))  # 0:a + music + (IDX-2) sfx = IDX streams
FILTER+="${MIXLABELS}amix=inputs=${NUM_MIX}:duration=first:dropout_transition=0:normalize=0[aout]"

echo "Duree: ${DUR}s | musique: $(basename $MUSIC) | SFX: ${#SFX_FILES[@]}"
ffmpeg -y "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 256k \
  "$OUT"
echo "-> $OUT"

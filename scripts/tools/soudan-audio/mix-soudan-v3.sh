#!/bin/bash
# Mix audio v3 mid-form Soudan : musique boucle + SFX SOBRES (retours Aziz).
# Usage: ./mix-soudan-v3.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]
# Reglages FIGES Aziz : musique 0.08 + bass=g=-7:f=200:w=0.6, voix reine. SFX 0.5.
# SFX v3 : RETIRE corne Russie + ding fleche + drone bruite (rates Gemini). Garde
# mines/fracture recales + AJOUTE dings DISCRETS (node-appear/map-ping/blip/slash-red).
set -e

ASSEMBLAGE="${1:?usage: mix-soudan-v3.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]}"
MUSIC="${2:?music-loop.mp3 requis}"
OUT="${3:?out.mp4 requis}"
MUSIC_VOL="${4:-0.08}"

SFX_UI="/Users/clawdbot/Workspace/remotion/public/_shared/sfx"
SFX_SOUDAN="$SFX_UI/soudan"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ASSEMBLAGE")
SFX_VOL=0.5
BASS_FILTER="bass=g=-7:f=200:w=0.6"

# --- SFX v3 : "fichier:timecode_s:volume" ---
# Positions v3 (avec hook 23.4s en tete). Sobre : les moments FORTS uniquement.
# mines A1 (23.4+6=29.4) · fracture A2 fin (~127) · Dubai A3 (~204) · Turquie A3 (~229) ·
# Moscou A4 (~303, DING au lieu de corne) · veto ONU A6 (~544) · sieges rouge A6 (~549)
declare -a SFX=(
  "$SFX_SOUDAN/sfx-soudan-mines.mp3:29.4:0.5"
  "$SFX_SOUDAN/sfx-soudan-fracture.mp3:127.0:0.5"
  "$SFX_UI/ui/node-appear.mp3:204.3:0.45"
  "$SFX_UI/ui/node-appear.mp3:229.3:0.45"
  "$SFX_UI/ui/blip-bubble.mp3:302.8:0.4"
  "$SFX_UI/camera/sfx-map-ping.mp3:543.7:0.45"
  "$SFX_UI/ui/slash-red.mp3:548.7:0.4"
)

INPUTS=(-i "$ASSEMBLAGE" -i "$MUSIC")
FILTER="[1:a]atrim=0:${DUR},${BASS_FILTER},volume=${MUSIC_VOL}[music];"
IDX=2
MIXLABELS="[0:a][music]"
for entry in "${SFX[@]}"; do
  file="${entry%%:*}"; rest="${entry#*:}"; tc="${rest%%:*}"; vol="${rest##*:}"
  if [ ! -f "$file" ]; then echo "SFX manquant: $file"; exit 1; fi
  INPUTS+=(-i "$file")
  ms=$(python3 -c "print(int($tc*1000))")
  FILTER+="[${IDX}:a]adelay=${ms}|${ms},volume=${vol}[sfx${IDX}];"
  MIXLABELS+="[sfx${IDX}]"
  IDX=$((IDX+1))
done

NUM_MIX=$((IDX))
FILTER+="${MIXLABELS}amix=inputs=${NUM_MIX}:duration=first:dropout_transition=0:normalize=0[aout]"

echo "Duree: ${DUR}s | musique vol=${MUSIC_VOL} | SFX: ${#SFX[@]} (v3 sobre)"
ffmpeg -y "${INPUTS[@]}" -filter_complex "$FILTER" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k "$OUT"
echo "-> $OUT"

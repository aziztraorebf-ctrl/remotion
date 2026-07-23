#!/bin/bash
# Mix audio v4 mid-form Soudan : musique boucle + SFX SOBRES (retours Aziz, passe finale polish).
# Usage: ./mix-soudan-v4.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]
# Reglages FIGES Aziz : musique 0.08 + bass=g=-7:f=200:w=0.6, voix reine. SFX 0.5.
#
# DIFF vs v3 (3 corrections passe finale, 12 points polish) :
# 1. AJOUT count-up "50M habitants" (A1, ~28.2s dans a1.mp4, cf F.cinquante=845 whisper "50" 28.24s).
# 2. REMPLACE map-ping+slash-red (veto ONU) par une VRAIE cascade de dings sur les 14 sieges verts
#    (cascade b3Quatorze->derniers verts, ~45.8-48.9s dans a6.mp4) + 1 ding distinct au basculement
#    rouge du veto (b3Veto, ~52.5s dans a6.mp4) — meme ping que les verts (Aziz : "plus naturel").
# 3. AJOUT count-up "13,5M deplaces" (A6, DisplacementCounter, cf tHold prop dans soudanActe6Overlays).
#
# ✅ TIMECODES FINAUX (recales sur les durees reelles v4 apres re-timing/re-render, 2026-07-22) :
# a1=57.32s a2=93.61s a3=108.25s a4=131.47s a5=76.54s a6=144.53s (hook 23.4s en tete).
set -e

ASSEMBLAGE="${1:?usage: mix-soudan-v4.sh <assemblage.mp4> <music-loop.mp3> <out.mp4> [music_vol]}"
MUSIC="${2:?music-loop.mp3 requis}"
OUT="${3:?out.mp4 requis}"
MUSIC_VOL="${4:-0.08}"

SFX_UI="/Users/clawdbot/Workspace/remotion/public/_shared/sfx"
SFX_SOUDAN="$SFX_UI/soudan"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ASSEMBLAGE")
SFX_VOL=0.5
BASS_FILTER="bass=g=-7:f=200:w=0.6"

# --- SFX v4 : "fichier:timecode_s:volume" (timecodes FINAUX, recales sur durees reelles) ---
# count-up 50M A1 (51.57) · mines A1 (29.4) · fracture A2 fin (127.02) · Dubai A3 (204.33) ·
# Turquie A3 (229.33) · Moscou A4 (302.48) · cascade 14 verts A6 (537.99->541.02, ~0.23s d'ecart
# entre dings, cf b3Quatorze=1422f + gi*7 par siege) · basculement rouge veto A6 (544.62,
# b3Veto=1621f) · count-up 13,5M A6 (609.79, b5TreizeMillions=3576f).
declare -a SFX=(
  "$SFX_SOUDAN/sfx-soudan-mines.mp3:29.4:0.5"
  "$SFX_UI/data/counter-tick.mp3:51.57:0.4"
  "$SFX_SOUDAN/sfx-soudan-fracture.mp3:127.02:0.5"
  "$SFX_UI/ui/node-appear.mp3:204.33:0.45"
  "$SFX_UI/ui/node-appear.mp3:229.33:0.45"
  "$SFX_UI/ui/blip-bubble.mp3:302.48:0.4"
  "$SFX_UI/ui/node-appear.mp3:537.99:0.35"
  "$SFX_UI/ui/node-appear.mp3:538.22:0.35"
  "$SFX_UI/ui/node-appear.mp3:538.46:0.35"
  "$SFX_UI/ui/node-appear.mp3:538.69:0.35"
  "$SFX_UI/ui/node-appear.mp3:538.92:0.35"
  "$SFX_UI/ui/node-appear.mp3:539.16:0.35"
  "$SFX_UI/ui/node-appear.mp3:539.39:0.35"
  "$SFX_UI/ui/node-appear.mp3:539.62:0.35"
  "$SFX_UI/ui/node-appear.mp3:539.86:0.35"
  "$SFX_UI/ui/node-appear.mp3:540.09:0.35"
  "$SFX_UI/ui/node-appear.mp3:540.32:0.35"
  "$SFX_UI/ui/node-appear.mp3:540.56:0.35"
  "$SFX_UI/ui/node-appear.mp3:540.79:0.35"
  "$SFX_UI/ui/node-appear.mp3:541.02:0.35"
  "$SFX_UI/ui/slash-red.mp3:544.62:0.45"
  "$SFX_UI/data/counter-tick.mp3:609.79:0.4"
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

echo "Duree: ${DUR}s | musique vol=${MUSIC_VOL} | SFX: ${#SFX[@]} (v4 passe finale)"
ffmpeg -y "${INPUTS[@]}" -filter_complex "$FILTER" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k "$OUT"
echo "-> $OUT"

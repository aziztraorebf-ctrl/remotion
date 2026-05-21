#!/bin/bash
# add-city-asset.sh — Intègre un asset ville PixelLab avec vérifications obligatoires
# Usage: ./scripts/add-city-asset.sh <ville> <fichier.png|.gif> <episode>
# Ex:    ./scripts/add-city-asset.sh florence /tmp/florence.png peste-1347
#
# Checks:
#   1. Pixels RGB > 80 (asset pas trop sombre)
#   2. Ref i2i documentée dans assets/REFS.md
#   3. Dimensions 128x128
#   4. Format RGBA

set -e

VILLE=$1
FICHIER=$2
EPISODE=${3:-"peste-1347"}

if [ -z "$VILLE" ] || [ -z "$FICHIER" ]; then
  echo "Usage: $0 <ville> <fichier.png|.gif> [episode]"
  exit 1
fi

DEST="public/atlas/$EPISODE/assets/objects/cities-v2/$VILLE"
REFS_FILE="public/atlas/$EPISODE/assets/REFS.md"

echo ""
echo "=== ADD CITY ASSET : $VILLE ==="
echo ""

# --- Check 1 : fichier existe
if [ ! -f "$FICHIER" ]; then
  echo "ERREUR : fichier introuvable : $FICHIER"
  exit 1
fi

EXT="${FICHIER##*.}"

# --- Check 2 : si GIF, extraire frames d'abord
if [ "$EXT" = "gif" ]; then
  echo "GIF détecté — extraction frames..."
  FRAME_COUNT=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$FICHIER" 2>/dev/null | tr -d '\n')
  echo "  $FRAME_COUNT frames détectées"
  TMPDIR_FRAMES=$(mktemp -d)
  ffmpeg -y -i "$FICHIER" \
    -vf "split[s0][s1];[s0]palettegen=reserve_transparent=1[p];[s1][p]paletteuse=alpha_threshold=128" \
    "$TMPDIR_FRAMES/frame_%03d.png" 2>/dev/null
  SAMPLE_FILE="$TMPDIR_FRAMES/frame_001.png"
  IS_GIF=true
else
  SAMPLE_FILE="$FICHIER"
  IS_GIF=false
fi

# --- Check 3 : dimensions
DIMS=$(python3 -c "
from PIL import Image
img = Image.open('$SAMPLE_FILE')
print(f'{img.width}x{img.height}')
")
echo "Dimensions : $DIMS"
if [ "$DIMS" != "128x128" ]; then
  echo "ATTENTION : dimensions attendues 128x128, reçu $DIMS"
  read -p "Continuer quand même ? (o/N) " CONT
  if [ "$CONT" != "o" ] && [ "$CONT" != "O" ]; then
    echo "Annulé."
    exit 1
  fi
fi

# --- Check 4 : pixels RGB (détection asset trop sombre)
PIXEL_RESULT=$(python3 -c "
from PIL import Image
img = Image.open('$SAMPLE_FILE').convert('RGBA')
w, h = img.size
samples = [(w//4, h//4), (w//2, h//2), (3*w//4, h//4), (w//4, 3*h//4)]
dark_count = 0
valid_count = 0
for px in samples:
    r, g, b, a = img.getpixel(px)
    if a > 30:  # pixel non-transparent
        valid_count += 1
        if r < 80 and g < 80 and b < 80:
            dark_count += 1
        print(f'  pixel {px}: RGB({r},{g},{b}) alpha={a}')
if valid_count > 0 and dark_count / valid_count > 0.5:
    print('WARNING_DARK')
")
echo "Échantillon pixels :"
echo "$PIXEL_RESULT"

if echo "$PIXEL_RESULT" | grep -q "WARNING_DARK"; then
  echo ""
  echo "AVERTISSEMENT : asset potentiellement trop sombre (RGB < 80 sur majorité des pixels)"
  echo "Sur fond OCEAN #03224c, cet asset risque d'être invisible."
  echo "Recommandation : régénérer avec description 'vibrant warm colors'."
  echo ""
  read -p "Continuer quand même ? (o/N) " CONT
  if [ "$CONT" != "o" ] && [ "$CONT" != "O" ]; then
    echo "Annulé. Régénère l'asset avec des couleurs plus vives."
    exit 1
  fi
fi

# --- Check 5 : ref i2i documentée
echo ""
if [ -f "$REFS_FILE" ] && grep -q "$VILLE" "$REFS_FILE"; then
  echo "Référence i2i : trouvée dans $REFS_FILE"
else
  echo "AVERTISSEMENT : aucune référence i2i documentée pour '$VILLE' dans $REFS_FILE"
  echo "Asset généré sans ref i2i = risque palette sombre ou style incohérent."
  read -p "Référence i2i utilisée (chemin relatif, ou ENTER pour ignorer) : " REF_USED
  if [ -n "$REF_USED" ]; then
    echo "| $VILLE | cities-v2/$VILLE/static.png | $REF_USED |" >> "$REFS_FILE"
    echo "  → Ajouté dans $REFS_FILE"
  fi
fi

# --- Copie des fichiers
echo ""
echo "Création dossier $DEST/anim/..."
mkdir -p "$DEST/anim"

if [ "$IS_GIF" = true ]; then
  # Copier frames GIF
  I=0
  for F in "$TMPDIR_FRAMES"/frame_*.png; do
    DST_NAME=$(printf "frame_%03d.png" $((I)))
    cp "$F" "$DEST/anim/$DST_NAME"
    I=$((I+1))
  done
  echo "  $I frames copiées dans $DEST/anim/"
  rm -rf "$TMPDIR_FRAMES"
  # Static = première frame
  cp "$DEST/anim/frame_000.png" "$DEST/static.png"
  echo "  static.png = frame_000"
else
  cp "$FICHIER" "$DEST/static.png"
  echo "  static.png copié"
  echo "  (frames anim à ajouter manuellement dans $DEST/anim/)"
fi

echo ""
echo "=== ASSET INTÉGRÉ : $DEST ==="
echo ""
echo "RAPPEL — Spring pop obligatoire dans le composant :"
echo "  const spriteScale = interpolate(lf, [0, 12, 45], [0, 3.0, 1.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });"
echo "  frameIdx = Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount"
echo ""

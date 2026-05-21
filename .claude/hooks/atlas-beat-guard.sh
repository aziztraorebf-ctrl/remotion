#!/bin/bash
# atlas-beat-guard.sh
# PreToolUse (Edit|Write) — se declenche avant tout Write/Edit sur un fichier Beat Atlas
#
# Checks automatiques (inviolables) :
#   A1 — Math.max(0, localF) avant tout frameIdx modulo
#   A2 — Spring pop sur tout sprite (interpolate [0, X, Y])
#   A3 — Composants suspects (RatScurry, etc.) non justifies par script
#   A4 — Spec table presente avant premier code (/tmp/{episode}-beat{N}-spec.md)
#
# Comportement :
#   exit 0 → hook passe, Edit/Write autorise
#   exit 2 → hook BLOQUE l'outil (Claude voit le message d'erreur)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null)

# Uniquement pour les fichiers Beat*.tsx dans le projet atlas
if [[ "$FILE_PATH" != *"atlas"*"Beat"*".tsx" ]]; then
  exit 0
fi

EPISODE=$(echo "$FILE_PATH" | python3 -c "
import sys, re
m = re.search(r'atlas/([^/]+)/Beat', sys.stdin.read())
print(m.group(1) if m else '')
" 2>/dev/null)

BEAT_NUM=$(echo "$FILE_PATH" | python3 -c "
import sys, re
m = re.search(r'Beat(\d+)', sys.stdin.read())
print(m.group(1) if m else '')
" 2>/dev/null)

echo ""
echo "================================================"
echo "ATLAS BEAT GUARD — ${EPISODE}/Beat${BEAT_NUM}"
echo "================================================"

ERRORS=0
WARNINGS=0

# --- CHECK A4 : Spec table presente avant code ---
if [ -n "$EPISODE" ] && [ -n "$BEAT_NUM" ]; then
  SPEC_FILE="/tmp/${EPISODE}-beat${BEAT_NUM}-spec.md"
  if [ ! -f "$SPEC_FILE" ]; then
    echo ""
    echo "[BLOQUE A4] Spec table absente : ${SPEC_FILE}"
    echo "  -> Lancer d'abord :"
    echo "     python3 scripts/beat-session.py --episode ${EPISODE} --beat ${BEAT_NUM} --phase spec-table"
    echo "  -> Sans spec table : frames non calculees, coords non verifiees = 10 renders perdus."
    ERRORS=$((ERRORS + 1))
  else
    echo "[OK A4] Spec table presente."
  fi
fi

# --- Lire le nouveau contenu du fichier (depuis tool_input) ---
NEW_CONTENT=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    ti = d.get('tool_input', {})
    # Write : champ 'content'
    c = ti.get('content', '')
    # Edit : champ 'new_string'
    if not c:
        c = ti.get('new_string', '')
    print(c)
except:
    print('')
" 2>/dev/null)

# Si le fichier existe deja, lire son contenu aussi (pour analyse complete)
EXISTING_CONTENT=""
if [ -f "$FILE_PATH" ]; then
  EXISTING_CONTENT=$(cat "$FILE_PATH" 2>/dev/null)
fi

FULL_CONTENT="${EXISTING_CONTENT}
${NEW_CONTENT}"

# --- CHECK A1 : Math.max(0, localF) avant frameIdx ---
HAS_FRAMEIDX=$(echo "$FULL_CONTENT" | grep -c "frameIdx\|frameStr\|frame_\${" 2>/dev/null); HAS_FRAMEIDX=${HAS_FRAMEIDX:-0}
HAS_MATHMAX=$(echo "$FULL_CONTENT" | grep -c "Math.max(0" 2>/dev/null); HAS_MATHMAX=${HAS_MATHMAX:-0}

if [ "$HAS_FRAMEIDX" -gt 0 ] && [ "$HAS_MATHMAX" -eq 0 ]; then
  echo ""
  echo "[BLOQUE A1] frameIdx detecte sans Math.max(0, localF)"
  echo "  CAUSE : localF peut etre negatif avant beatStart"
  echo "  BUG   : Math.floor(-119 / 6) % 15 = -14 en JS → frame_-14.png → icone grise"
  echo "  FIX   : Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount"
  ERRORS=$((ERRORS + 1))
elif [ "$HAS_FRAMEIDX" -gt 0 ]; then
  echo "[OK A1] Math.max(0, localF) present avec frameIdx."
fi

# --- CHECK A2 : Spring pop sur sprites ---
HAS_SPRITE=$(echo "$FULL_CONTENT" | grep -cE "CitySpriteAnimated|<image|staticFile.*frame_|spriteScale" 2>/dev/null); HAS_SPRITE=${HAS_SPRITE:-0}
HAS_SPRINGPOP=$(echo "$FULL_CONTENT" | grep -cE "interpolate\(.*\[0,\s*[0-9]+,\s*[0-9]+\].*\[0,\s*[0-9]+\.[0-9]+,\s*[0-9]+\.[0-9]+\]" 2>/dev/null); HAS_SPRINGPOP=${HAS_SPRINGPOP:-0}

if [ "$HAS_SPRITE" -gt 0 ] && [ "$HAS_SPRINGPOP" -eq 0 ]; then
  echo ""
  echo "[WARN A2] Sprite detecte mais aucun spring pop trouve."
  echo "  DEFAUT : interpolate(lf, [0, 12, 45], [0, 3.0, 1.8], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})"
  echo "  -> Apparition lineaire ou opacity seule = visuellement pauvre."
  WARNINGS=$((WARNINGS + 1))
elif [ "$HAS_SPRITE" -gt 0 ]; then
  echo "[OK A2] Spring pop detecte sur sprites."
fi

# --- CHECK A3 : Composants suspects ---
SUSPECTS=("RatScurry" "ParisSprite" "StockholmSprite" "PlaguePit")
for S in "${SUSPECTS[@]}"; do
  if echo "$FULL_CONTENT" | grep -q "$S"; then
    echo ""
    echo "[WARN A3] Composant suspect detecte : ${S}"
    echo "  -> Verifier que '${S}' est nomme dans le script audio du beat."
    echo "  -> S'il n'est pas dans le script = supprimer (regle R4 : element sans script = beat suivant)."
    WARNINGS=$((WARNINGS + 1))
  fi
done

# --- CHECK A5 : Rappel spring pop comme defaut ---
echo ""
echo "--- RAPPELS ATLAS NON-NEGOTIABLES ---"
echo "SPRING POP DEFAUT : interpolate(lf, [0, 12, 45], [0, 3.0, 1.8], extrapolate clamp)"
echo "MATH.MAX OBLIGATOIRE : Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount"
echo "RGB CHECK : scripts/add-city-asset.sh avant tout cp asset.png public/"
echo "REGISTRATION : python3 scripts/check-beat-registration.py avant premier render"
echo "--------------------------------------"

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "================================================"
  echo "ATLAS GUARD BLOQUE — ${ERRORS} erreur(s) critique(s)"
  if [ $WARNINGS -gt 0 ]; then
    echo "                   + ${WARNINGS} avertissement(s)"
  fi
  echo "================================================"
  exit 2
else
  if [ $WARNINGS -gt 0 ]; then
    echo "[OK] Atlas guard passe avec ${WARNINGS} avertissement(s)."
  else
    echo "[OK] Atlas guard passe — Beat${BEAT_NUM} autorise."
  fi
  exit 0
fi

#!/bin/bash
# beat-preflight.sh
# PreToolUse (Edit|Write) — se declenche avant tout Write/Edit sur un Beat*.tsx
# Verifie : storyboard existe, composants lus, regles chargees

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Uniquement pour les fichiers Beat*.tsx
if [[ "$FILE_PATH" != *"Beat"*".tsx" ]]; then
  exit 0
fi

# Extraire episode depuis le chemin (ex: silicon-savannah)
EPISODE=$(echo "$FILE_PATH" | python3 -c "import sys,re; m=re.search(r'souverain/([^/]+)/Beat', sys.stdin.read()); print(m.group(1) if m else '')" 2>/dev/null)
BEAT_NUM=$(echo "$FILE_PATH" | python3 -c "import sys,re; m=re.search(r'Beat([0-9]+)', sys.stdin.read()); print(m.group(1) if m else '')" 2>/dev/null)

RULES_FILE="/Users/clawdbot/Workspace/remotion/memory/rules-beat-production.md"
STORYBOARD_DIR="/Users/clawdbot/Workspace/remotion/src/projects/souverain/${EPISODE}/storyboard"
SHARED_FLAG="/tmp/shared-components-read"
GEMINI_SCORES="/tmp/gemini-scores.json"

echo ""
echo "================================================"
echo "BEAT PREFLIGHT CHECK — ${EPISODE}/Beat${BEAT_NUM}"
echo "================================================"

ERRORS=0

# CHECK 1 — Regles beat-production chargees
if [ ! -f "$RULES_FILE" ]; then
  echo "[BLOQUE] rules-beat-production.md introuvable."
  echo "  -> Creer memory/rules-beat-production.md d'abord."
  ERRORS=$((ERRORS + 1))
else
  echo "[OK] Regles beat-production presentes."
  echo ""
  echo "--- RAPPEL REGLES CRITIQUES ---"
  echo "R1: Max 8s sans changement visible. Beat long = plusieurs sous-animations."
  echo "R3: Lire _shared/components/ AVANT de coder. Flag: /tmp/shared-components-read"
  echo "R4: Review Gemini 3.1-pro-preview obligatoire. Score min 8.5/10."
  echo "R5: Timing = SEG.xxx depuis manifest. Jamais hardcode."
  echo "R7: Permanent motion obligatoire dans tout composant custom."
  echo ""
  echo "--- MODELES GEMINI (NON-NEGOTIABLE) ---"
  echo "IMAGE GENERATION : gemini-3.1-flash-image-preview"
  echo "VISION / REVIEW  : gemini-3.1-pro-preview  (via beat-session --phase review)"
  echo "REVIEW MANUELLE  : gemini-2.5-flash-preview-04-17  (quand tu appelles Gemini directement)"
  echo "FALLBACK REVIEW  : gemini-2.5-flash (thinking_budget=0, SEULEMENT si 3.1-pro timeout)"
  echo "INTERDIT         : gemini-2.5-pro pour vision, gemini-2.0-flash-*, imagen-*, tout autre"
  echo ""
  echo "--- REGLES CONTRASTE ATLAS (NON-NEGOTIABLE) ---"
  echo "Tout label texte sur zone colorée = fill=PARCHMENT + drop-shadow obligatoire."
  echo "JAMAIS même couleur que le fond sous-jacent (ex: PLAGUE_RED sur Europe rouge = invisible)."
  echo "-------------------------------"
fi

# CHECK 2 — Storyboard visuel existe
if [ -n "$EPISODE" ] && [ -n "$BEAT_NUM" ]; then
  STORYBOARD_FILE="${STORYBOARD_DIR}/beat${BEAT_NUM}-storyboard.md"
  if [ ! -f "$STORYBOARD_FILE" ]; then
    echo ""
    echo "[ATTENTION] Storyboard visuel manquant : ${STORYBOARD_FILE}"
    echo "  -> Avant de coder Beat${BEAT_NUM}, creer le storyboard rythmique avec Gemini 3.1-pro-preview."
    echo "  -> Commande : demander a Gemini de decouper le beat en segments de max 8s."
    echo "  -> Sans storyboard valide, le rythme (R1) ne peut pas etre garanti."
    # Warning seulement (pas bloquant) pour permettre la migration
    # Changer exit code a 2 pour rendre bloquant apres premiere session avec ce hook
  else
    echo "[OK] Storyboard beat${BEAT_NUM} present."
    # Verifier que le storyboard mentionne la regle 8s
    if grep -q "8s\|8 sec\|max.*sec\|rythme" "$STORYBOARD_FILE"; then
      echo "[OK] Storyboard contient validation rythmique."
    else
      echo "[ATTENTION] Storyboard ne valide pas explicitement le rythme 8s (R1)."
    fi
  fi
fi

# CHECK 3 — Composants _shared/ lus cette session
if [ ! -f "$SHARED_FLAG" ]; then
  echo ""
  echo "[R3] Composants _shared/ pas encore lus cette session."
  echo "  OBLIGATOIRE avant de coder : lire les fichiers suivants"
  echo "  src/projects/_shared/components/layouts/ (RadarPing, BarRace, PulseNumber, etc.)"
  echo "  src/projects/_shared/components/inserts/ (BrutalHeadline, DataCard, etc.)"
  echo ""
  # Lister les composants disponibles pour aide-memoire
  LAYOUTS=$(ls /Users/clawdbot/Workspace/remotion/src/projects/_shared/components/layouts/*.tsx 2>/dev/null | xargs -I{} basename {} .tsx | tr '\n' ', ')
  INSERTS=$(ls /Users/clawdbot/Workspace/remotion/src/projects/_shared/components/inserts/*.tsx 2>/dev/null | xargs -I{} basename {} .tsx | tr '\n' ', ')
  echo "  LAYOUTS: $LAYOUTS"
  echo "  INSERTS: $INSERTS"
  echo ""
  echo "  -> Confirmer lecture avec : touch /tmp/shared-components-read"
fi

# CHECK 4 — Score Gemini beat precedent (si applicable)
if [ -f "$GEMINI_SCORES" ] && [ -n "$BEAT_NUM" ] && [ "$BEAT_NUM" -gt 1 ]; then
  PREV_BEAT=$((BEAT_NUM - 1))
  PREV_SCORE=$(python3 -c "
import json, sys
try:
  data = json.load(open('$GEMINI_SCORES'))
  key = '${EPISODE}-beat${PREV_BEAT}'
  score = data.get(key, {}).get('score', None)
  print(score if score else 'absent')
except:
  print('absent')
" 2>/dev/null)

  if [ "$PREV_SCORE" = "absent" ]; then
    echo ""
    echo "[ATTENTION] Score Gemini Beat${PREV_BEAT} absent."
    echo "  -> Beat precedent non review ou score non enregistre."
  elif python3 -c "exit(0 if float('$PREV_SCORE') >= 8.5 else 1)" 2>/dev/null; then
    echo "[OK] Beat${PREV_BEAT} score Gemini: ${PREV_SCORE}/10 >= 8.5"
  else
    echo ""
    echo "[BLOQUE] Beat${PREV_BEAT} score Gemini: ${PREV_SCORE}/10 < 8.5"
    echo "  -> Corriger Beat${PREV_BEAT} et obtenir score >= 8.5 avant de continuer."
    ERRORS=$((ERRORS + 1))
  fi
fi

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "================================================"
  echo "PREFLIGHT ECHOUE — $ERRORS erreur(s) bloquante(s)"
  echo "================================================"
  exit 2
else
  echo "================================================"
  echo "PREFLIGHT OK — Beat${BEAT_NUM} autorise a etre code"
  echo "================================================"
  exit 0
fi

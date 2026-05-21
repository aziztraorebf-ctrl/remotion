#!/bin/bash
# pre-final-promotion.sh
# PreToolUse (Bash) — se déclenche quand une commande cp/mv vers *-FINAL.mp4 est détectée.
# Vérifie 3 gates avant d'autoriser la promotion.

INPUT=$(cat)
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Uniquement si la commande promouvoit vers FINAL
if [[ "$TOOL_INPUT" != *"FINAL.mp4"* ]]; then
  exit 0
fi
if [[ "$TOOL_INPUT" != *"cp "* ]] && [[ "$TOOL_INPUT" != *"mv "* ]]; then
  exit 0
fi

# Extraire le fichier source (wip ou versions)
SOURCE_FILE=$(echo "$TOOL_INPUT" | grep -oE '[^ ]+\.mp4' | head -1)
if [[ -z "$SOURCE_FILE" ]]; then
  exit 0
fi

# Extraire episode et beat depuis le chemin
EPISODE=$(echo "$SOURCE_FILE" | grep -oE 'episodes/[^/]+' | sed 's|episodes/||')
BEAT_NUM=$(echo "$SOURCE_FILE" | grep -oE 'beat[0-9]+' | grep -oE '[0-9]+' | head -1)

echo ""
echo "================================================"
echo "GATE PRE-FINAL — ${EPISODE} Beat${BEAT_NUM}"
echo "================================================"

ERRORS=0

# GATE 1 — Source documentée dans le TSX
TSX_CANDIDATES=$(find /Users/clawdbot/Workspace/remotion/src/projects/atlas/${EPISODE} \
  -name "Beat${BEAT_NUM}*.tsx" 2>/dev/null | head -1)

if [[ -n "$TSX_CANDIDATES" ]]; then
  if grep -q "Parasites\|Nature 606\|Britannica\|Al-Maqrizi\|Ibn Battuta\|Source\|source\|PMC\|Johns Hopkins\|Rihla" "$TSX_CANDIDATES" 2>/dev/null; then
    echo "[OK] Source détectée dans le TSX."
  else
    echo "[BLOQUE] Aucune source trouvée dans $TSX_CANDIDATES"
    echo "  -> Intégrer un bandeau source (parchment, bas écran) avant de promouvoir."
    echo "  -> Pattern : localF >= F_SOURCE_APPEAR && <div style={{position:'absolute', bottom:28...}}>"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "[ATTENTION] TSX Beat${BEAT_NUM} introuvable pour vérification source."
  echo "  -> Vérifier manuellement qu'une source est intégrée."
fi

# GATE 2 — self-review >= 19/25 documentée
SELF_REVIEW_FILE="/tmp/${EPISODE}-beat${BEAT_NUM}-self-review.json"
if [[ -f "$SELF_REVIEW_FILE" ]]; then
  SCORE=$(python3 -c "import json; d=json.load(open('$SELF_REVIEW_FILE')); print(d.get('score',0))" 2>/dev/null)
  if python3 -c "exit(0 if int('${SCORE:-0}') >= 19 else 1)" 2>/dev/null; then
    echo "[OK] Self-review score : ${SCORE}/25 >= 19."
  else
    echo "[ATTENTION] Self-review score : ${SCORE}/25 < 19 — vérifier les critères manquants."
  fi
else
  echo "[ATTENTION] Fichier self-review absent : ${SELF_REVIEW_FILE}"
  echo "  -> Lancer --phase self-review avant promotion si ce beat passe par beat-session.py."
fi

# GATE 3 — upload catbox/litterbox fait cette session
UPLOAD_FLAG="/tmp/${EPISODE}-beat${BEAT_NUM}-uploaded"
if [[ -f "$UPLOAD_FLAG" ]]; then
  echo "[OK] Upload confirmé (flag présent)."
else
  echo "[ATTENTION] Aucun flag d'upload trouvé pour ce beat."
  echo "  -> S'assurer qu'Aziz a validé sur mobile avant promotion."
fi

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "================================================"
  echo "PROMOTION BLOQUEE — $ERRORS erreur(s) critique(s)"
  echo "================================================"
  exit 2
else
  echo "================================================"
  echo "GATES OK — Promotion FINAL autorisée"
  echo "================================================"
  exit 0
fi

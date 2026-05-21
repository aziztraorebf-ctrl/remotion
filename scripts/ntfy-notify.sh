#!/bin/bash
# ntfy-notify.sh — Envoie une notification push via ntfy.sh
# Usage: ./scripts/ntfy-notify.sh <event> <beat> [url_optionnel] [message_optionnel]
#
# Events:
#   storyboard_ready   Phase 1 terminee — validation requise
#   beat_done          Phase 4 succes — render pret a valider
#   blocked            Blocage 3 erreurs — intervention requise
#   custom             Message libre (arg3 requis)
#
# Config : NTFY_TOPIC dans .env (ex: NTFY_TOPIC=aziz-silicon-savannah-s9x7k)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

# Charger NTFY_TOPIC depuis .env
if [[ -f "$ENV_FILE" ]]; then
  NTFY_TOPIC=$(grep -E '^NTFY_TOPIC=' "$ENV_FILE" | cut -d'=' -f2 | tr -d '"' | tr -d "'")
fi

if [[ -z "${NTFY_TOPIC:-}" ]]; then
  echo "[ntfy] NTFY_TOPIC non defini dans .env — notification ignoree"
  exit 0
fi

NTFY_URL="https://ntfy.sh/${NTFY_TOPIC}"
EVENT="${1:-custom}"
BEAT="${2:-beat?}"
URL="${3:-}"
CUSTOM_MSG="${4:-}"

case "$EVENT" in
  storyboard_ready)
    TITLE="Silicon Savannah — ${BEAT} storyboard pret"
    MSG="Phase 1 terminee. R1 valide. Cliquer pour valider puis lancer /goal.${CUSTOM_MSG:+ $CUSTOM_MSG}"
    PRIORITY="high"
    TAGS="white_check_mark,eyes"
    ;;
  beat_done)
    TITLE="Silicon Savannah — ${BEAT} APPROUVE"
    MSG="Score >= 8.5, r1_violations vide. Render pret.${CUSTOM_MSG:+ $CUSTOM_MSG}"
    PRIORITY="high"
    TAGS="tada,clapper"
    ;;
  blocked)
    TITLE="Silicon Savannah — ${BEAT} BLOQUE"
    MSG="3 erreurs non resolues. Intervention requise.${CUSTOM_MSG:+ $CUSTOM_MSG}"
    PRIORITY="urgent"
    TAGS="rotating_light,stop_sign"
    ;;
  custom)
    TITLE="Silicon Savannah — ${BEAT}"
    MSG="${CUSTOM_MSG:-notification sans message}"
    PRIORITY="default"
    TAGS="bell"
    ;;
  *)
    echo "[ntfy] Event inconnu: $EVENT"
    exit 1
    ;;
esac

CURL_ARGS=(
  -s
  -H "Title: ${TITLE}"
  -H "Priority: ${PRIORITY}"
  -H "Tags: ${TAGS}"
)

if [[ -n "${URL}" ]]; then
  CURL_ARGS+=(-H "Click: ${URL}")
fi

curl "${CURL_ARGS[@]}" -d "${MSG}" "${NTFY_URL}" > /dev/null

echo "[ntfy] Notification envoyee : ${TITLE}"

#!/bin/bash
# check-api-balance.sh — verifier les balances API avant toute generation payante
# Usage: ./scripts/check-api-balance.sh [elevenlabs|pixellab|all]
# Retourne un rapport lisible + exit code 1 si seuil critique atteint

set -a
source "$(dirname "$0")/../.env" 2>/dev/null
set +a

SERVICE="${1:-all}"
EXIT_CODE=0

check_elevenlabs() {
  echo "=== ElevenLabs ==="
  RESPONSE=$(curl -s -H "xi-api-key: $ELEVENLABS_API_KEY" \
    "https://api.elevenlabs.io/v1/user/subscription")

  USED=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['character_count'])" 2>/dev/null)
  LIMIT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['character_limit'])" 2>/dev/null)

  if [ -z "$USED" ] || [ -z "$LIMIT" ]; then
    echo "ERREUR: impossible de lire le solde ElevenLabs"
    return 1
  fi

  REMAINING=$((LIMIT - USED))
  PCT=$((USED * 100 / LIMIT))
  echo "Utilise  : $USED / $LIMIT caracteres ($PCT%)"
  echo "Restant  : $REMAINING caracteres"

  # Seuil critique : moins de 5000 caracteres restants (~2min de narration)
  if [ "$REMAINING" -lt 5000 ]; then
    echo "ALERTE CRITIQUE: moins de 5000 caracteres restants — STOP, consulter Aziz"
    EXIT_CODE=1
  elif [ "$REMAINING" -lt 15000 ]; then
    echo "ATTENTION: moins de 15000 caracteres restants — utiliser avec parcimonie"
  else
    echo "OK: solde suffisant"
  fi
  echo ""
}

check_pixellab() {
  echo "=== PixelLab ==="
  RESPONSE=$(curl -s -H "Authorization: Bearer $PIXELLAB_API_KEY" \
    "https://api.pixellab.ai/v1/balance")

  BALANCE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(round(d['usd'],2))" 2>/dev/null)

  if [ -z "$BALANCE" ]; then
    echo "ERREUR: impossible de lire le solde PixelLab"
    return 1
  fi

  echo "Balance  : $BALANCE USD"

  # Seuil critique : moins de $1.00 (environ 2-3 generations personnage)
  BALANCE_INT=$(echo "$BALANCE" | python3 -c "import sys; print(int(float(sys.stdin.read().strip()) * 100))")
  if [ "$BALANCE_INT" -lt 100 ]; then
    echo "ALERTE CRITIQUE: moins de \$1.00 restant — STOP, recharger avant toute generation"
    EXIT_CODE=1
  elif [ "$BALANCE_INT" -lt 300 ]; then
    echo "ATTENTION: moins de \$3.00 restants — max 1 generation, confirmer avec Aziz"
  else
    echo "OK: solde suffisant"
  fi
  echo ""
}

check_fal() {
  echo "=== fal.ai ==="
  echo "Balance  : verifier manuellement sur fal.ai/dashboard (pas d'endpoint API public)"
  echo "Conseil  : recharger si moins de \$5.00 (1 clip Seedance ~\$0.40-\$1.50)"
  echo ""
}

case "$SERVICE" in
  elevenlabs) check_elevenlabs ;;
  pixellab)   check_pixellab ;;
  fal)        check_fal ;;
  all)
    check_elevenlabs
    check_pixellab
    check_fal
    ;;
  *)
    echo "Usage: $0 [elevenlabs|pixellab|fal|all]"
    exit 1
    ;;
esac

exit $EXIT_CODE

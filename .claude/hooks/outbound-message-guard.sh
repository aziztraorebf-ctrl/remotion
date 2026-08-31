#!/bin/bash
# outbound-message-guard.sh
# PreToolUse (matcher: mcp__upwork__upwork__send_message|mcp__upwork__upwork__manage_proposals)
#
# POURQUOI : un texte destine a un tiers (proposition Upwork, message client) doit respecter
# les regles de communication du projet (feedback_message-client-ne-pas-sonner-genere.md) :
# zero tiret cadratin, zero formule figee qui sonne genere. Ces regles sont deja ECRITES en
# memoire mais un oubli d'execution reste possible en plein travail (vecu 2026-08-31, lettre
# vokabl v1 : 5+ tirets cadratins malgre la regle connue). Ce hook rattrape l'OUBLI, il ne
# remplace pas le jugement sur le TON — la fiche/memoire fait deja ce travail en amont.
#
# Intervient au moment de la CREATION du draft (send_message action=send, manage_proposals
# action=create/accept_invitation/send_proposal) plutot qu'a la confirmation : a ce stade le
# texte n'a pas encore ete montre a l'utilisateur, donc la correction se fait AVANT l'aperçu,
# jamais apres validation.
#
# 2 niveaux, volontairement asymetriques :
#   - Tiret cadratin (—) : BLOCAGE DUR (exit 2). Zero faux positif legitime en anglais courant
#     ici — Aziz a tranche explicitement le 2026-08-31 (marqueur n°1 "genere par IA").
#   - Formules figees IA-sonnantes : AVERTISSEMENT SEUL (exit 0 + contexte). Une formule de la
#     liste peut etre le bon choix selon contexte precis — bloquer forcerait des contournements
#     inutiles. Le rappel suffit, le jugement reste a Claude.
#
# ⛔ Ce hook ne couvre QUE les tools MCP Upwork qui creent un draft de texte sortant. Un texte
# redige en reponse directe dans la conversation (pas via un tool) ne peut PAS etre intercepte
# par ce mecanisme — seule la fiche/consigne s'applique dans ce cas.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

case "$TOOL_NAME" in
  mcp__upwork__upwork__send_message)
    ACTION=$(echo "$INPUT" | jq -r '.tool_input.params.action // .tool_input.action // empty')
    # send / send_to_user / message_proposal / edit portent du texte a un tiers.
    # create_room ne porte pas de "message" a proprement parler (verifie quand meme, no-op si absent).
    TEXT=$(echo "$INPUT" | jq -r '.tool_input.params.message // empty')
    ;;
  mcp__upwork__upwork__manage_proposals)
    ACTION=$(echo "$INPUT" | jq -r '.tool_input.params.action // .tool_input.action // empty')
    case "$ACTION" in
      create|accept_invitation|send_proposal)
        TEXT=$(echo "$INPUT" | jq -r '.tool_input.params.cover_letter // .tool_input.params.description // empty')
        ;;
      *)
        exit 0
        ;;
    esac
    ;;
  *)
    exit 0
    ;;
esac

[ -z "$TEXT" ] && exit 0

# --- 1. TIRET CADRATIN — blocage dur ------------------------------------------------
# ⛔ grep -P (PCRE) absent du grep BSD livre avec macOS : ne PAS l'utiliser ici (deja
# casse une fois, corrige apres test reel). Python est portable partout ou le hook tourne.
HAS_EMDASH=$(printf '%s' "$TEXT" | python3 -c "
import sys
t = sys.stdin.read()
print('yes' if '—' in t else 'no')
" 2>/dev/null)

if [ "$HAS_EMDASH" = "yes" ]; then
  # Extraire un court contexte autour de la 1re occurrence pour aider a la localiser.
  SNIPPET=$(printf '%s' "$TEXT" | python3 -c "
import sys
t = sys.stdin.read()
i = t.find('—')
lo = max(0, i - 40)
hi = min(len(t), i + 40)
print(t[lo:hi].replace(chr(10), ' '))
" 2>/dev/null)
  echo ""
  echo "================================================================"
  echo "MESSAGE SORTANT BLOQUE — tiret cadratin (—) detecte"
  echo "----------------------------------------------------------------"
  echo "Contexte : ...${SNIPPET}..."
  echo "----------------------------------------------------------------"
  echo "Regle projet (feedback_message-client-ne-pas-sonner-genere.md) : ZERO tiret"
  echo "cadratin dans toute communication externe — marqueur n°1 \"genere par IA\"."
  echo "Remplacer par une virgule, un point, ou reformuler en 2 phrases."
  echo "================================================================"
  exit 2
fi

# --- 2. FORMULES FIGEES IA-SONNANTES — avertissement seul, jamais bloquant ----------
# Liste construite au fil des cas reels — a completer, pas figee. Chaque entree = un
# fragment de phrase, insensible a la casse.
FORMULES=(
  "i hope this (email|message) finds you well"
  "i('|')?d love to"
  "feel free to"
  "in today('|')?s (fast-paced|digital)"
  "look(ing)? forward to (hearing|connecting)"
  "don('|')?t hesitate to"
  "i am excited to"
  "as an ai"
)

HITS=""
for pat in "${FORMULES[@]}"; do
  if printf '%s' "$TEXT" | grep -qiE "$pat"; then
    HITS="${HITS}
  - \"$pat\""
  fi
done

if [ -n "$HITS" ]; then
  echo ""
  echo "[avertissement] Formule(s) potentiellement generee(s) trouvee(s) dans le message sortant :${HITS}"
  echo "[avertissement] Pas bloquant — relire si le contexte justifie vraiment cette formulation."
  echo "[avertissement] Regle : zero reformulation generique, ton factuel et specifique au brief."
fi

exit 0

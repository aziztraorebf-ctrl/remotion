#!/bin/bash
# index-composants-gate.sh
# PostToolUse (matcher: Edit|Write) — INFORME, ne bloque JAMAIS.
#
# POURQUOI : le 2026-09-08, l'audit de COMPOSANTS-INDEX.md a trouve 16 entrees
# FANTOMES (composants cites, exportes nulle part) et 11 NON IMPORTABLES (declares
# sans export). Le cout est documente : "une entree qui ment ferme la recherche —
# personne ne va verifier, et la brique reste invisible pour toujours"
# (feedback_catalogue-position-liste-et-brief-restrictif-cachent-brique-existante).
# Precedent : 5 entrees fausses avaient deja ete ecrites dans cet index.
#
# ⛔ POURQUOI ICI ET PAS AU SessionStart : l'index ne bouge que ~9 fois en 2 mois
# (mesure). Un rappel a chaque demarrage serait du bruit permanent pour un evenement
# rare — et le bruit fait desactiver les gates. Le bon moment est l'ECRITURE de
# l'index : rare, precis, et c'est la que la verification a du sens.
# Lecon appliquee : "un gotcha doit vivre dans la fiche INJECTEE au moment du geste,
# pas dans une archive consultable" (feedback_gotcha-doit-vivre-dans-la-fiche-injectee).
#
# ⛔ POSTToolUse et pas PRE : en Pre, une ecriture bloquee par un autre gate
# consommerait quand meme le declenchement (cf. en-tete de client-source-gate.sh).
#
# Cout : ~0.8 s, uniquement quand l'index est touche. exit 0 en toute circonstance.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[[ "$FILE_PATH" != *"COMPOSANTS-INDEX.md"* ]] && exit 0

REPO="/Users/clawdbot/Workspace/remotion"
AUDIT="$REPO/scripts/tools/audit-composants-index.py"
[ -f "$AUDIT" ] || exit 0

# Une seule fois par session : ne pas re-alerter a chaque retouche de l'index.
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "nosession"' 2>/dev/null)
STAMP="${TMPDIR:-/tmp}/index-composants-gate/${SESSION_ID}"
[ -f "$STAMP" ] && exit 0
mkdir -p "$(dirname "$STAMP")" 2>/dev/null && touch "$STAMP" 2>/dev/null

REPORT=$(python3 "$AUDIT" --json 2>/dev/null) || exit 0

N_FANT=$(echo "$REPORT" | jq -r '.fantomes | length' 2>/dev/null || echo 0)
N_NIMP=$(echo "$REPORT" | jq -r '.non_importables | length' 2>/dev/null || echo 0)
[ "${N_FANT:-0}" -eq 0 ] && [ "${N_NIMP:-0}" -eq 0 ] && exit 0

FANT=$(echo "$REPORT" | jq -r '.fantomes | join(", ")' 2>/dev/null | cut -c1-200)

cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"COMPOSANTS-INDEX.md vient d'etre modifie. Etat mesure : ${N_FANT} entree(s) FANTOME (citees, exportees nulle part) et ${N_NIMP} NON IMPORTABLE(s) (declarees sans export, donc annoncees comme reutilisables alors qu'il faut d'abord les extraire).\n\nFantomes : ${FANT}\n\nUne entree qui ment ferme la recherche : personne ne verifie, et la brique reste invisible. Si l'edition en cours ajoute une entree, verifier que le composant est bien EXPORTE. Detail : python3 scripts/tools/audit-composants-index.py"}}
EOF
exit 0

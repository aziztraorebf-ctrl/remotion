#!/bin/bash
# session-start-capitalisation.sh — SessionStart. INFORMATIF, NE BLOQUE JAMAIS.
#
# POURQUOI (constat d'Aziz, 2026-08-17) : EXTRACTOR et CHRONIQUEUR ne tournent QU'EN
# CLOTURE (via /wrap). Double risque d'oubli, et l'oubli est SILENCIEUX :
#   1. on oublie de lancer /wrap (contexte plein, interruption, session qui s'arrete)
#   2. la matiere s'accumule sur plusieurs sessions sans jamais etre capitalisee
# Precedents du projet : le "Mecanisme 1 Gardien" concu en detail puis oublie des
# semaines ; le circuit-breaker code puis MORT le 2026-07-12 sans que personne ne le
# remarque pendant un mois. Un mecanisme de fin de session dont l'oubli ne fait aucun
# bruit finit toujours par etre oublie.
#
# Ce hook deplace le rappel au DEBUT de session — la ou on peut encore agir.
# Il n'interdit rien, il informe. Toujours exit 0.

REPO="/Users/clawdbot/Workspace/remotion"
SCRIPT="$REPO/scripts/tools/check-capitalisation.py"

[ -f "$SCRIPT" ] || exit 0

OUT=$(cd "$REPO" && python3 "$SCRIPT" --quiet 2>/dev/null)
RC=$?

# exit 0 du script = tout est a jour, on ne dit rien (pas de bruit inutile au demarrage).
[ "$RC" -eq 0 ] && exit 0
[ -z "$OUT" ] && exit 0

CTX="$OUT

Detail : \`python3 scripts/tools/check-capitalisation.py\`
Ces 2 agents ne tournent qu'en cloture : EXTRACTOR indexe les briques reutilisables
(l'EXISTENCE), CHRONIQUEUR verifie et enrichit memory/fiches/ (le JUGEMENT).
Une session fermee sans /wrap perd sa matiere — elle devient introuvable a la session
suivante, ce qui est la cause d'echec n°1 mesuree du projet (brique existante non trouvee)."

# SessionStart : le stdout brut est ajoute au contexte (pas besoin de JSON).
printf '%s\n' "$CTX"
exit 0

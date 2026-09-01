#!/bin/bash
# episodic-memory-nudge.sh
# UserPromptSubmit hook — filet de securite pour la regle CLAUDE.md § EPISODIC-MEMORY.
#
# La vraie regle vit dans CLAUDE.md (jugement, couvre tous les cas). Ce hook ne couvre que
# les formulations les plus evidentes d'une reference a l'historique — il RAPPELLE, ne
# bloque JAMAIS et n'injecte aucun resultat de recherche lui-meme (pas de latence, pas de
# faux negatif de recherche a gerer ici). Volontairement redondant avec la regle ecrite :
# chacun compense les angles morts de l'autre (cf memory/feedbacks/feedback_regle-ecrite-
# insuffisante-sans-gate-outille.md — une regle seule, sans gate, ne tient pas dans la duree).

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

# Marqueurs de langage historique (FR, insensible a la casse). Volontairement large plutot
# que precis : un faux positif ici coute juste une ligne de rappel ignorable, un faux
# negatif coute une confabulation silencieuse sur une decision passee.
if echo "$PROMPT" | grep -qiE "on avait dit|tu te souviens|la derniere fois|deja (discute|parle|tranche|decide)|pourquoi (on|j'ai|tu as) (avait|a) (fait|choisi|decide)|c'etait quoi (la|le)|rappelle[- ]moi|de memoire,? (on|je|tu)"; then
  cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "RAPPEL (filet de securite, gate CLAUDE.md § EPISODIC-MEMORY) : ce message semble referencer une decision/discussion passee. Si l'info n'est pas dans memory/doctrines|feedbacks|MEMORY.md|NEXT-ACTION.md|ROUTAGE.md, consulter episodic-memory (search-conversations) AVANT de repondre ou de deviner — ne pas confabuler sur l'historique du projet."
  }
}
EOF
fi

exit 0

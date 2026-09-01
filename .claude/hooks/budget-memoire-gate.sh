#!/bin/bash
# budget-memoire-gate.sh
# PreToolUse hook (matcher: Edit|Write)
# Couche 3 du chantier memoire (2026-08-31/09-01) : transforme les plafonds
# documentes dans memory/BUDGET.md en un gate qui BLOQUE, pas seulement alerte.
#
# check-poids-contexte.py (SessionStart) mesure et informe mais ne bloque jamais
# (cf. son propre commentaire : "Il ne bloque RIEN. Il informe."). C'est le trou
# que ce hook comble, cote ECRITURE plutot que cote DEMARRAGE.
#
# Regle d'or : ne jamais bloquer une ecriture qui REDUIT la taille du fichier,
# meme si le resultat reste au-dessus du plafond (sinon on rend impossible de
# resorber une dette existante — cas connu de NEXT-ACTION.md, encore ~31 Ko
# pour un plafond de 20 Ko au moment ou ce hook est ecrit).
#
# Source de verite des seuils : memory/BUDGET.md — a lire/mettre a jour LA-BAS,
# pas ici, si les plafonds changent.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

case "$TOOL_NAME" in
  Edit)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
    OLD_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.old_string // empty')
    ;;
  Write)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
    OLD_CONTENT=""
    ;;
  *)
    exit 0
    ;;
esac

# Ne jamais se bloquer soi-meme ni bloquer BUDGET.md (sinon impossible d'ajuster les seuils)
if [[ "$FILE_PATH" == *"budget-memoire-gate.sh"* ]] || [[ "$FILE_PATH" == *"BUDGET.md" ]]; then
  exit 0
fi

MEMORY_MD="/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/MEMORY.md"
NEXT_ACTION_MD="/Users/clawdbot/Workspace/remotion/memory/NEXT-ACTION.md"

PLAFOND_MEMORY=15000
PLAFOND_NEXT_ACTION=20480
LIGNE_MAX=100

# Realpath pour comparer proprement (FILE_PATH peut etre relatif selon l'appelant)
FILE_REAL=$(python3 -c "import os,sys; print(os.path.realpath(sys.argv[1]))" "$FILE_PATH" 2>/dev/null)

cible=""
plafond=0
if [[ "$FILE_REAL" == "$MEMORY_MD" ]]; then
  cible="MEMORY.md"
  plafond=$PLAFOND_MEMORY
elif [[ "$FILE_REAL" == "$NEXT_ACTION_MD" ]]; then
  cible="NEXT-ACTION.md"
  plafond=$PLAFOND_NEXT_ACTION
else
  exit 0
fi

# Taille AVANT l'ecriture (0 si le fichier n'existe pas encore)
taille_avant=0
if [[ -f "$FILE_REAL" ]]; then
  taille_avant=$(wc -c < "$FILE_REAL" | tr -d ' ')
fi

# Taille APRES : pour Edit, on simule le remplacement ; pour Write, le nouveau contenu remplace tout.
if [[ "$TOOL_NAME" == "Write" ]]; then
  taille_apres=$(printf '%s' "$NEW_CONTENT" | wc -c | tr -d ' ')
else
  # Edit : taille_avant - taille(old_string) + taille(new_string), approx en octets
  len_old=$(printf '%s' "$OLD_CONTENT" | wc -c | tr -d ' ')
  len_new=$(printf '%s' "$NEW_CONTENT" | wc -c | tr -d ' ')
  taille_apres=$(( taille_avant - len_old + len_new ))
fi

# Regle d'or : une ecriture qui REDUIT la taille n'est jamais bloquee,
# meme si le resultat reste au-dessus du plafond (permet de resorber la dette)
# ET MEME SI cette ecriture contient encore une ligne > LIGNE_MAX (le check
# ligne-max ci-dessous est donc uniquement applique quand le fichier grossit —
# un nettoyage partiel imparfait reste toujours preferable a un blocage total).
if [[ $taille_apres -le $taille_avant ]]; then
  exit 0
fi

if [[ $taille_apres -gt $plafond ]]; then
  cat >&2 <<EOF
{
  "decision": "block",
  "reason": "BUDGET MEMOIRE DEPASSE : cette ecriture ferait passer $cible de $taille_avant o a $taille_apres o, au-dela du plafond dur de $plafond o defini dans memory/BUDGET.md.\n\nCe fichier est charge a CHAQUE session — c'est le levier direct contre la derive de contexte (chantier du 2026-08-31/09-01). Options :\n  1. Reduire ailleurs dans le meme fichier avant d'ajouter (compenser, pas juste empiler).\n  2. Si l'ajout est un CONTENU (pas un pointeur) : il appartient a un fichier dans memory/doctrines|feedbacks|tools|projects, pas ici. Ecrire la-bas, puis n'ajouter ICI qu'un pointeur (nom + 3-6 mots-cles, format documente dans BUDGET.md).\n  3. Si le plafond lui-meme est trop bas pour l'usage reel : c'est un arbitrage a faire AVEC Aziz, pas a decider seul — proposer l'ajustement, ne pas le faire en silence.\n\nSource des seuils : memory/BUDGET.md."
}
EOF
  exit 2
fi

# Verification ligne-max, uniquement pour MEMORY.md (NEXT-ACTION.md n'a pas cette regle documentee)
if [[ "$cible" == "MEMORY.md" ]]; then
  ligne_trop_longue=$(printf '%s' "$NEW_CONTENT" | awk -v max="$LIGNE_MAX" '
    { if (length($0) > max && $0 !~ /^#/) { print length($0); exit } }
  ')
  if [[ -n "$ligne_trop_longue" ]]; then
    cat >&2 <<EOF
{
  "decision": "block",
  "reason": "BUDGET MEMOIRE : ligne de $ligne_trop_longue caracteres dans MEMORY.md, au-dela du plafond de $LIGNE_MAX defini dans memory/BUDGET.md.\n\nFormat attendu : emoji-priorite + slug-de-fichier-exact + 3-6 mots-cles MAX. Jamais une phrase narrative complete, jamais une explication du pourquoi (deja documente dans BUDGET.md, pattern identifie le 2026-08-31 : des lignes de 350+ caracteres dupliquaient le contenu du fichier pointe au lieu de simplement y renvoyer)."
}
EOF
    exit 2
  fi
fi

exit 0

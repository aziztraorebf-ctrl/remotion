#!/bin/bash
# secret-write-guard.sh
# PreToolUse hook (matcher: Edit|Write)
# Bloque l'ecriture d'un SECRET EN CLAIR dans un fichier versionne.
#
# POURQUOI (incident reel, mesure le 2026-09-08) : 15 claimToken here.now ont vecu en clair
# dans 6 fichiers du depot PUBLIC aziztraorebf-ctrl/remotion depuis le 2026-05-20 (commit
# 7ee840de). Au moment de la decouverte, 10 pages here.now etaient encore VIVANTES (HTTP 200)
# et 4 d'entre elles avaient leur token expose — dont velvet-portal-r5s9, une page CLIENT
# (flowdesk). Un claimToken autorise `PUT /api/v1/publish/:slug` : n'importe qui lisant le
# depot pouvait remplacer le contenu d'une page livree a un client.
#
# ⛔ DIFFERENCE VOLONTAIRE avec gemini-model-guard.sh : ce hook NE SKIPPE PAS les .md.
# La fuite s'est produite exactement la — dans des fichiers de documentation (dashboard-url.md,
# here-now-links.md). Un scan de secrets qui ignore la doc ne sert a rien.
#
# Ce qu'il couvre : les patterns a valeur (token = valeur), pas les mentions du mot seul.
# Ce qu'il NE couvre PAS : un secret ecrit via `cat > f <<EOF` en Bash (non matche ici pour
# eviter les faux positifs massifs sur des commandes legitimes), ni un secret colle par Aziz
# lui-meme. Le .env reste le bon endroit pour un secret.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

case "$TOOL_NAME" in
  Edit)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    ;;
  Write)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    ;;
  *)
    exit 0
    ;;
esac

[ -z "$CONTENT" ] && exit 0

# --- Auto-exclusion : ne jamais se bloquer soi-meme (sinon toute mise a jour devient impossible)
[[ "$FILE_PATH" == *"secret-write-guard.sh"* ]] && exit 0

# --- Fichiers deja hors git : c'est justement la qu'un secret DOIT aller
[[ "$FILE_PATH" == *".secrets-local/"* ]] && exit 0
[[ "$FILE_PATH" == *"/.env"* ]] && exit 0
[[ "$(basename "$FILE_PATH")" == ".env" ]] && exit 0

# --- Archives : contenu historique preserve, on ne reecrit pas le passe
[[ "$FILE_PATH" == *"_archive"* ]] || [[ "$FILE_PATH" == *"/archive/"* ]] && exit 0

# --- Detection : nom_de_secret <separateur> VALEUR (>= 12 chars), backticks/quotes optionnels
#     Le mot seul ("claimToken est retourne une fois") ne matche pas : il faut une valeur.
PATTERNS=(
  'claimToken[[:space:]*]*[:=][[:space:]]*[`"'"'"']?[A-Za-z0-9_-]{12,}'
  '(api[_-]?key|apikey)[[:space:]*]*[:=][[:space:]]*[`"'"'"']?[A-Za-z0-9_-]{20,}'
  '(secret|password|passwd)[[:space:]*]*[:=][[:space:]]*[`"'"'"']?[A-Za-z0-9_-]{16,}'
  'Bearer[[:space:]]+[A-Za-z0-9_.-]{20,}'
  'sk-[A-Za-z0-9]{20,}'
  'ghp_[A-Za-z0-9]{20,}'
  'xox[baprs]-[A-Za-z0-9-]{10,}'
)

for pat in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qE "$pat"; then
    LABEL=$(echo "$CONTENT" | grep -oE "$pat" | head -1 | sed -E 's/[A-Za-z0-9_-]{12,}/<VALEUR>/g')
    cat >&2 <<EOF
{"decision":"block","reason":"SECRET EN CLAIR detecte dans $FILE_PATH — motif: $LABEL\n\nCe depot (aziztraorebf-ctrl/remotion) est PUBLIC. Un secret ecrit ici est lisible par tous, et le reste dans l'historique git meme apres suppression.\n\nOU ECRIRE LE SECRET :\n  - .env a la racine (deja gitignore) pour une cle d'API\n  - .secrets-local/ (gitignore le 2026-09-08) pour des tokens de publication\n  - dans le fichier versionne, ne laisser qu'un POINTEUR vers l'emplacement reel\n\nIncident de reference : 15 claimToken exposes du 2026-05-20 au 2026-09-08, dont 4 sur des pages encore vivantes (une page CLIENT)."}
EOF
    exit 2
  fi
done

exit 0

#!/bin/bash
# fiche-inject.sh — PreToolUse (matcher: Edit|Write). INFORMATIF, NE BLOQUE JAMAIS.
#
# POURQUOI : les regles (SVG, camera, format vertical) sont ecrites mais pas rappelees
# AU MOMENT ou l'agent code. Cause d'echec n°1 mesuree = "brique existante non trouvee"
# (6 cas, ~20 iterations perdues). MEMORY.md est lu en debut de session puis oublie.
# Ce hook n'interdit rien : il pose la bonne fiche sous les yeux au bon moment.
#
# ⛔ NE JAMAIS passer a exit 2 ici : la doc precise qu'exit 2 bloque meme avec un JSON
# "allow". Un hook informatif sort TOUJOURS en 0, JSON sur STDOUT (pas stderr).
#
# ANTI-REPETITION : 1 injection par fiche par fichier par session. Ce n'est PAS un
# confort — c'est la condition de viabilite. Sans elle : plusieurs dizaines de milliers
# de tokens/jour. Avec : ~4500 tokens/jour typique (mesure : 7,5 fichiers SVG/jour).

INPUT=$(cat)
FICHES_DIR="${FICHES_DIR:-/Users/clawdbot/Workspace/remotion/memory/fiches}"

SESSION=$(printf '%s' "$INPUT"   | jq -r '.session_id // "nosession"')
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(printf '%s' "$INPUT"   | jq -r '.tool_input.new_string // .tool_input.content // empty')

[ -z "$FILE_PATH" ] && exit 0
[[ "$FILE_PATH" =~ \.tsx$ ]] || exit 0
case "$FILE_PATH" in
  *_archive*|*/archive/*|*.test.tsx|*.spec.tsx|*/Root.tsx) exit 0 ;;
esac
[ -z "$CONTENT" ] && exit 0

# SCOPE D'ANALYSE : le contenu propose (Edit = fragment) + le fichier sur disque s'il existe.
# Un Edit ne montre qu'un morceau : un fragment peut avoir des paths sans primitives (ou
# l'inverse) et rater la detection alors que le fichier EST une scene dessinee.
# Bug reel rencontre en test : les 6000 premiers caracteres d'Acte5NegocierCreuserFable
# donnaient PRIMS=0 alors que le fichier entier en a 7.
SCOPE="$CONTENT"
if [ -f "$FILE_PATH" ]; then
  SCOPE="${CONTENT}
$(cat "$FILE_PATH" 2>/dev/null)"
fi

# grep -o | wc -l  et NON grep -c : -c compte les LIGNES, or un new_string d'Edit
# tient souvent sur une seule ligne -> comptage faux (bug reellement rencontre en test).
PRIMS=$(printf '%s' "$SCOPE" | grep -oE '<(path|circle|ellipse|polygon|polyline|line|rect)[[:space:]/>]' | wc -l | tr -d ' ')
# d={...} (path calcule) est MAJORITAIRE ici : 488 fichiers vs 227 en d="M".
# Chercher seulement d="M ratait la majorite des scenes (verifie sur Acte5NegocierCreuserFable).
HAS_D=$(printf '%s' "$SCOPE" | grep -oE 'd=\{|d="[Mm]' | wc -l | tr -d ' ')
CAM=$(printf '%s' "$SCOPE" | grep -oE 'camAt|scaleMul|getCam|lerpCam|camFor|jumpTo|bearing|pitch:|interpolate\(' | wc -l | tr -d ' ')

SENTINEL_DIR="${TMPDIR:-/tmp}/fiche-inject-${SESSION}"
mkdir -p "$SENTINEL_DIR" 2>/dev/null
HASHER="md5"; command -v md5 >/dev/null 2>&1 || HASHER="md5sum"
fkey() {
  if [ "$HASHER" = "md5" ]; then printf '%s' "$1" | md5 -q; else printf '%s' "$1" | md5sum | cut -d' ' -f1; fi
}

PARTS=""
add_fiche() {
  local name="$1" label="$2"
  local f="$FICHES_DIR/$name"
  [ -f "$f" ] || return 0
  local key; key=$(fkey "${FILE_PATH}::${name}")
  [ -f "$SENTINEL_DIR/$key" ] && return 0
  touch "$SENTINEL_DIR/$key"
  PARTS="${PARTS}

=== ${label} (rappel auto, 1x par fichier par session) ===
$(cat "$f")"
}

# SVG dessine : double critere + garde-fou anti-icone (PRIMS>=2).
if { [ "${PRIMS:-0}" -ge 4 ] || [ "${HAS_D:-0}" -ge 1 ]; } && [ "${PRIMS:-0}" -ge 2 ]; then
  add_fiche "FICHE-SVG-DESSINE.md" "FICHE SVG DESSINE"
fi

# Camera : transversal (D3, Mapbox, SVG) — declencheur = motifs de code camera.
if [ "${CAM:-0}" -ge 2 ]; then
  add_fiche "FICHE-CAMERA.md" "FICHE CAMERA"
fi

# Format vertical : chemin de Short OU dimensions 1080x1920 dans le contenu.
if printf '%s' "$FILE_PATH" | grep -qiE 'short|9x16|vertical' \
   || printf '%s' "$CONTENT" | grep -qE '1080.*1920|1920.*1080.*vertical'; then
  add_fiche "FICHE-SHORT-VERTICAL.md" "FICHE SHORT VERTICAL"
fi

[ -z "$PARTS" ] && exit 0

jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
exit 0

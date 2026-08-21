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
# ANTI-REPETITION : 1 injection par fiche par cible par session. Ce n'est PAS un
# confort — c'est la condition de viabilite.
# Cout RE-MESURE 2026-08-17 (wc -c sur les 6 fiches, ~2 fiches par fichier touche) :
#   jour typique 7,5 fichiers  -> ~24 000 tokens
#   pire jour observe 28 fichiers -> ~91 000 tokens
# ⚠️ Ne JAMAIS deduire ce chiffre : 2 estimations ecrites le meme jour (4500 et 18000)
# etaient fausses, toutes deux comptaient UNE fiche alors qu'elles se cumulent.

INPUT=$(cat)
FICHES_DIR="${FICHES_DIR:-/Users/clawdbot/Workspace/remotion/memory/fiches}"

SESSION=$(printf '%s' "$INPUT"   | jq -r '.session_id // "nosession"')
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(printf '%s' "$INPUT"   | jq -r '.tool_input.new_string // .tool_input.content // empty')
BASH_CMD=$(printf '%s' "$INPUT"  | jq -r '.tool_input.command // empty')

SENTINEL_DIR="${TMPDIR:-/tmp}/fiche-inject-${SESSION}"
mkdir -p "$SENTINEL_DIR" 2>/dev/null
HASHER="md5"; command -v md5 >/dev/null 2>&1 || HASHER="md5sum"
fkey() {
  if [ "$HASHER" = "md5" ]; then printf '%s' "$1" | md5 -q; else printf '%s' "$1" | md5sum | cut -d' ' -f1; fi
}
PARTS=""
add_fiche() {
  local name="$1" label="$2" scopekey="$3"
  local f="$FICHES_DIR/$name"
  [ -f "$f" ] || return 0
  local key; key=$(fkey "${scopekey}::${name}")
  [ -f "$SENTINEL_DIR/$key" ] && return 0
  touch "$SENTINEL_DIR/$key"
  PARTS="${PARTS}

=== ${label} (rappel auto, 1x par cible par session) ===
$(cat "$f")"
}

# ---------------------------------------------------------------- BRANCHE BASH
# Certains moments de production ne sont PAS des editions de .tsx : le storyboard
# est un appel de script, l'assemblage est un ffmpeg/render. Sans cette branche,
# ces 2 fiches existeraient sans jamais se declencher (signale par 2 agents).
if [ -n "$BASH_CMD" ]; then
  # ⛔ Exclure git/echo/cat : un `git commit -m "...narration..."` matchait le TEXTE du
  # message et injectait la fiche audio pour rien (faux positif reel, 2026-08-17).
  # On ne veut matcher que de VRAIES actions de production.
  #
  # ⛔⛔ FIX 2026-08-21 — MAIS l'exclusion `cat *` coupait le canal pour les scenes CREEES
  # en Bash (`cat > Scene.tsx <<EOF`). Mesure sur le cas reel (gabarit Zambie) : le fichier
  # scorait CAM=6 et HAS_D=2 — FICHE-CAMERA et FICHE-SVG-DESSINE se seraient donc declenchees
  # via Write, et n'ont RIEN injecte via Bash. Consequence concrete : `camAtContinu()` et les
  # patterns camera existaient dans la fiche, personne ne me les a mis sous les yeux, et j'ai
  # code des cercles a la main en ignorant tout l'arsenal.
  # => si la commande ECRIT un .tsx, on ne sort pas : on laisse la branche fichier analyser.
  BASH_TSX_TARGET=$(printf '%s' "$BASH_CMD" | grep -oE '(>>?|cp|mv|tee)[[:space:]]+[^ |;&]*\.tsx' \
    | grep -oE '[^ |;&>]*\.tsx' | head -1)
  # Un interpreteur qui PARLE de .tsx n'en cree pas (patch de hook, script d'analyse).
  case "$BASH_CMD" in
    python3\ *|python\ *|node\ *|perl\ *|sed\ *|awk\ *) BASH_TSX_TARGET="" ;;
  esac

  if [ -z "$BASH_TSX_TARGET" ]; then
    case "$BASH_CMD" in
      git\ *|*"git commit"*|echo\ *|cat\ *|grep\ *|ls\ *) exit 0 ;;
    esac
  fi
  if printf '%s' "$BASH_CMD" | grep -qE 'storyboard-dual-gen|openrouter-img2img|openrouter-vision-breakdown|da-brief\.py|da-compare\.py'; then
    add_fiche "FICHE-STORYBOARD.md" "FICHE STORYBOARD" "bash-storyboard"
  fi
  if printf '%s' "$BASH_CMD" | grep -qE 'ffmpeg|render-mapbox\.sh|remotion render|-FINAL\.mp4|upload-to-blob|concat='; then
    add_fiche "FICHE-ASSEMBLAGE.md" "FICHE ASSEMBLAGE" "bash-assemblage"
  fi
  if printf '%s' "$BASH_CMD" | grep -qE 'generate-narration|generate-sfx|forced-align|splice-segment|elevenlabs|minimax-music'; then
    add_fiche "FICHE-AUDIO.md" "FICHE AUDIO" "bash-audio"
  fi
  # CLIP GENERE (MiniMax H3 / Comfy Cloud) : 3 pieges ont coute un essai chacun
  # (input_overrides non fiable, parole non demandee, gros plan qui casse le style).
  if printf '%s' "$BASH_CMD" | grep -qE 'mkgraphs|mkprevis|graph-plan|previs.*\.gif|minimax_h3|MiniMaxH3|submit_workflow|comfy'; then
    add_fiche "FICHE-CLIP-GENERE.md" "FICHE CLIP GENERE" "bash-clip-genere"
  fi
  # PACKAGING (titre/miniature/description) : le pipeline s'arretait au render/upload alors que
  # c'est LA que se joue la conversion (CTR 1,5-1,8 % mesure = probleme de conversion, pas de reach).
  # ⛔ jury-titres, PAS jury-script : jury-script-llm.py juge le SCRIPT, autre moment.
  if printf '%s' "$BASH_CMD" | grep -qE 'jury-titres|jury-thumbnail|gemini-thumbnail-(create|edit)|gemini-cover-vertical'; then
    add_fiche "FICHE-PACKAGING.md" "FICHE PACKAGING" "bash-packaging"
  fi
  # UI PRODUIT : capture d'une page servie (pilier B2B n3). Le pipeline commence par
  # servir la page puis la capturer -- c'est LA qu'il faut savoir que shotcraft existe.
  if printf '%s' "$BASH_CMD" | grep -qE 'capture-northshield|capture-template|puppeteer|http\.server 88|live-layout\.json'; then
    add_fiche "FICHE-UI-PRODUIT.md" "FICHE UI PRODUIT" "bash-ui-produit"
  fi
  # SCENE CREEE EN BASH : on rebascule sur la branche fichier avec le corps de la commande
  # (le heredoc) comme CONTENT. Sans ca, une scene ecrite en Bash n'a jamais ses fiches.
  if [ -n "$BASH_TSX_TARGET" ]; then
    FILE_PATH="$BASH_TSX_TARGET"
    CONTENT="$BASH_CMD"
  else
    [ -z "$PARTS" ] && exit 0
    jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
    exit 0
  fi
fi

# ---------------------------------------------------------------- BRANCHE FICHIER
[ -z "$FILE_PATH" ] && exit 0
# Un PROMPT-*.txt = un brief de storyboard en cours d'ecriture.
# ⚠️ -i OBLIGATOIRE : BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md etait RATE (majuscules).
# + STORYBOARD-*/PLAN-* : 21 fichiers reels sous memory/episodes/ ne declenchaient RIEN alors
#   que c'est LA ou dorment les verdicts de rejet (feedback_lire-verdict-rejet-breakdown-...).
if printf '%s' "$FILE_PATH" | grep -qiE 'PROMPT-.*\.(txt|md)$|breakdown.*\.(json|md)$|/(STORYBOARD|PLAN)-[^/]*\.(md|txt)$'; then
  add_fiche "FICHE-STORYBOARD.md" "FICHE STORYBOARD" "$FILE_PATH"
  [ -n "$PARTS" ] && jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
  exit 0
fi
# Miniature : source composable (.svg autant que .tsx) sous thumbnails-library/.
# ⚠️ DOIT etre AVANT le filtre .tsx : un .svg y serait rejete (bug reel, corrige 2026-08-17).
# UI PRODUIT : page servable, socle shotcraft importe, ou composition de scene d'ecran.
# ⚠️ AVANT le filtre .tsx : index.html d'une live-page y serait rejete.
if printf '%s' "$FILE_PATH" | grep -qE 'live-page(-light)?/|shotcraft-lib/|_client-sim/.*(Promo|Dashboard|Screen|Mockup)'; then
  add_fiche "FICHE-UI-PRODUIT.md" "FICHE UI PRODUIT" "$FILE_PATH"
  [ -n "$PARTS" ] && jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
  exit 0
fi
if printf '%s' "$FILE_PATH" | grep -qE 'thumbnails-library/.*\.(svg|tsx)$'; then
  add_fiche "FICHE-PACKAGING.md" "FICHE PACKAGING" "$FILE_PATH"
  [ -n "$PARTS" ] && jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
  exit 0
fi
# timing.ts porte le timing derive de l'audio : .ts, pas .tsx — traiter AVANT le
# filtre .tsx, sinon il est rejete avant d'arriver au test audio (bug de test reel).
if printf '%s' "$FILE_PATH" | grep -qE 'timing\.ts$|whisper-words.*\.ts$'; then
  add_fiche "FICHE-AUDIO.md" "FICHE AUDIO" "$FILE_PATH"
  [ -n "$PARTS" ] && jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
  exit 0
fi

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

# SVG dessine : double critere + garde-fou anti-icone (PRIMS>=2).
if { [ "${PRIMS:-0}" -ge 4 ] || [ "${HAS_D:-0}" -ge 1 ]; } && [ "${PRIMS:-0}" -ge 2 ]; then
  add_fiche "FICHE-SVG-DESSINE.md" "FICHE SVG DESSINE" "$FILE_PATH"
fi

# Camera : transversal (D3, Mapbox, SVG) — declencheur = motifs de code camera.
if [ "${CAM:-0}" -ge 2 ]; then
  add_fiche "FICHE-CAMERA.md" "FICHE CAMERA" "$FILE_PATH"
fi

# ARSENAL DE SCENE (ajoute 2026-08-21) : les autres fiches enseignent la METHODE, aucune ne
# disait ce qu'on POSSEDE. Coût mesuré le jour meme (gabarit Zambie) : des <circle> dessines a
# la main alors que GisementMarker existait et etait utilisable tel quel — livrable juge
# "prototype", a refaire. Declencheur = la scene DESSINE (primitives/paths) ou pose des
# MARQUEURS geo, c'est-a-dire exactement les 2 moments ou on reinvente une brique existante.
GEO=$(printf '%s' "$SCOPE" | grep -oE 'project\(|projection\(|geoPath|geoMercator|map\.project|cx=\{|cy=\{' | wc -l | tr -d ' ')
if { [ "${PRIMS:-0}" -ge 2 ] || [ "${HAS_D:-0}" -ge 1 ]; } || [ "${GEO:-0}" -ge 2 ]; then
  add_fiche "FICHE-ARSENAL-SCENE.md" "FICHE ARSENAL DE SCENE" "$FILE_PATH"
fi

# Format vertical : chemin de Short OU dimensions 1080x1920 dans le contenu.
if printf '%s' "$FILE_PATH" | grep -qiE 'short|9x16|vertical' \
   || printf '%s' "$CONTENT" | grep -qE '1080.*1920|1920.*1080.*vertical'; then
  add_fiche "FICHE-SHORT-VERTICAL.md" "FICHE SHORT VERTICAL" "$FILE_PATH"
fi

# Audio : le code qui porte l'audio (Audio, staticFile mp3, timing derive).
if printf '%s' "$CONTENT" | grep -qE '<Audio|staticFile\([^)]*\.mp3|sfx/|startFrom=\{' \
   || printf '%s' "$FILE_PATH" | grep -qE 'timing\.ts$'; then
  add_fiche "FICHE-AUDIO.md" "FICHE AUDIO" "$FILE_PATH"
fi

[ -z "$PARTS" ] && exit 0

jq -n --arg ctx "$PARTS" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$ctx}}'
exit 0

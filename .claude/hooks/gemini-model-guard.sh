#!/bin/bash
# gemini-model-guard.sh
# PreToolUse hook (matcher: Edit|Write|Bash)
# Bloque si Claude tente d'ecrire ou d'executer un appel a un modele Gemini perime.
#
# Reference des bons modeles : CLAUDE.md projet (haut du fichier)
# Source detaillee : memory/tools/gemini.md

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Extraire le contenu pertinent selon le tool
case "$TOOL_NAME" in
  Edit)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    ;;
  Write)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    ;;
  Bash)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
    FILE_PATH="<bash-command>"
    ;;
  *)
    exit 0
    ;;
esac

# Skip pour les fichiers documentaires (md, txt) sauf CLAUDE.md (qui ne doit pas referencer de mauvais modeles)
if [[ "$FILE_PATH" =~ \.(md|txt)$ ]] && [[ "$FILE_PATH" != *"CLAUDE.md" ]]; then
  exit 0
fi

# Skip pour les archives (code legacy preserve)
if [[ "$FILE_PATH" == *"_archive"* ]] || [[ "$FILE_PATH" == *"/archive/"* ]]; then
  exit 0
fi

# Skip pour les fichiers snapshot (preservation historique)
if [[ "$FILE_PATH" == *"snapshot"* ]]; then
  exit 0
fi

# Le hook contient lui-meme la liste des modeles interdits :
# ne jamais se bloquer soi-meme (sinon toute mise a jour devient impossible).
if [[ "$FILE_PATH" == *"gemini-model-guard.sh"* ]]; then
  exit 0
fi

# Modeles perimes a bloquer
PERIMES=(
  "gemini-2\.5-pro"
  "gemini-2\.5-flash-preview"
  "gemini-2\.0-flash"
  "gemini-2\.0-pro"
  "gemini-1\.5"
  "gemini-3-pro-image-preview"
  "gemini-3\\.1-flash-image-preview"
  "nano-banana-pro"
  "imagen-"
  "claude-3-5"
  "claude-3\.5"
)

# Exceptions tolérées (cas legitimes documentes)
# gemini-2.5-flash sans -preview est tolere uniquement avec thinking_budget=0 (fallback documente)
TOLERANCES=(
  "gemini-2\.5-flash[^-]"  # tolere si pas suivi de "-preview-XX"
)

VIOLATIONS=()
for pat in "${PERIMES[@]}"; do
  if echo "$CONTENT" | grep -qE "$pat"; then
    # Verifier exceptions
    is_exception=false
    if [[ "$pat" == "gemini-2\.5-pro" ]] && echo "$CONTENT" | grep -qE "thinking_budget=0"; then
      is_exception=true
    fi
    if [ "$is_exception" = false ]; then
      MATCH=$(echo "$CONTENT" | grep -oE "$pat[a-z0-9.-]*" | head -1)
      VIOLATIONS+=("$MATCH")
    fi
  fi
done

if [ ${#VIOLATIONS[@]} -gt 0 ]; then
  cat >&2 <<EOF
{
  "decision": "block",
  "reason": "MODELE GEMINI PERIME DETECTE dans $FILE_PATH : ${VIOLATIONS[*]}\n\nLire le bloc \"MODELES API VERROUILLES\" en haut de CLAUDE.md projet.\n\nBons modeles Gemini (2026-08) :\n  - Generation/edition image : ⛔ NE PAS ecrire l'identifiant en dur.\n    Importer depuis scripts/tools/gemini_models.py :\n      from gemini_models import IMAGE_MODEL      # defaut LITE, 1K max\n      from gemini_models import IMAGE_MODEL_HQ   # image PUBLIEE telle quelle / 2K-4K\n    ⚠️ response_modalities=[\"IMAGE\"] = config recommandee (la \"panne\n        silencieuse sans flag\" a ete INFIRMEE par test reel le 2026-08-20).\n  - Vision / breakdown JSON : gemini-3.1-pro-preview\n  - Fallback review : gemini-2.5-flash avec thinking_budget=0 UNIQUEMENT\n\nINTERDIT : gemini-2.5-pro, gemini-2.0-*, tout modele image en preview (shutdown depasse le 2026-06-25), imagen-*, nano-banana-*\n\nSource : memory/tools/gemini.md"
}
EOF
  exit 2
fi

exit 0

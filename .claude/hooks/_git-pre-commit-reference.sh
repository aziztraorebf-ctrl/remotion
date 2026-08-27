#!/bin/bash
# Pre-commit hook: block commits containing API keys
# Scans staged files for common API key patterns

PATTERNS=(
    'AIzaSy[A-Za-z0-9_-]{33}'           # Google/Gemini API keys
    'sk-[A-Za-z0-9]{48}'                 # OpenAI API keys
    'sk-ant-[A-Za-z0-9-]{90,}'           # Anthropic API keys
    'fal_[A-Za-z0-9]{32,}'               # fal.ai keys
    'xi-[A-Za-z0-9]{32,}'                # ElevenLabs keys (header format)
    'ELEVENLABS_API_KEY\s*=\s*"[^"]{10,}' # Hardcoded ElevenLabs
    'OPENAI_API_KEY\s*=\s*"[^"]{10,}'    # Hardcoded OpenAI
    'GEMINI_API_KEY\s*=\s*"[^"]{10,}'    # Hardcoded Gemini
    'API_KEY\s*=\s*"AIzaSy'              # Hardcoded Google key pattern
)

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(py|ts|tsx|js|json|yaml|yml|md|sh)$')

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

FOUND=0

for pattern in "${PATTERNS[@]}"; do
    MATCHES=$(echo "$STAGED_FILES" | xargs grep -lE "$pattern" 2>/dev/null | grep -v '.env' | grep -v '.gitignore')
    if [ -n "$MATCHES" ]; then
        echo "BLOCKED: API key pattern detected in staged files:"
        echo "$MATCHES" | while read f; do
            echo "  $f"
            grep -nE "$pattern" "$f" | head -3 | sed 's/^/    /'
        done
        FOUND=1
    fi
done

if [ $FOUND -eq 1 ]; then
    echo ""
    echo "Use .env for API keys, never hardcode them in source files."
    echo "If this is a false positive, use: git commit --no-verify"
    exit 1
fi

# Stale starter/status files warning (non-blocking)
#
# ⛔ CORRIGE LE 2026-08-27 — ce detecteur criait a chaque commit et avait TOUJOURS tort.
# Ancienne regle : grep "V1|V2|perime|obsolete|ARCHIVE" N'IMPORTE OU dans le fichier.
# Consequence : un starter BIEN TENU, qui dit lui-meme « ce volet est perime, voici ce
# qui reste valide », etait signale — le hook punissait la bonne pratique. Pire, la note
# ajoutee pour documenter le faux positif contenait le mot « perime » et le declenchait
# a son tour. Il signalait aussi des fichiers deja supprimes (liste non filtree sur
# l'existence). Un avertissement qui a toujours tort finit ignore, et le jour ou il a
# raison personne ne le lit — c'est ainsi que le circuit-breaker est mort le 2026-07-12.
#
# Nouvelle regle : un marqueur EXPLICITE d'obsolescence dans les 5 PREMIERES lignes
# (l'en-tete, la ou on marque un fichier mort), et seulement sur des fichiers existants.
STALE_STARTERS=$(find memory/ public/ -name "STARTER-PROMPT-*.md" -o -name "REPRISE-*.md" -o -name "PASSE-DE-VIE-*.md" 2>/dev/null | \
    while read f; do
        [ -f "$f" ] || continue
        # deja range dans un dossier d'archive = deja traite, ne pas signaler
        echo "$f" | grep -q "/archive/\|/_archive/" && continue
        head -5 "$f" | grep -qiE "^> *⛔.*(PERIME|PÉRIMÉ|OBSOLETE|OBSOLÈTE|NE PLUS UTILISER)|^# *(ARCHIVE|ARCHIVÉ)" && echo "$f"
    done | head -5)
if [ -n "$STALE_STARTERS" ]; then
    echo ""
    echo "AVERTISSEMENT — Starters potentiellement périmés détectés :"
    echo "$STALE_STARTERS" | while read f; do echo "  $f"; done
    echo "Vérifier si ces fichiers sont encore utiles. Non-bloquant — commit autorisé."
fi

# Open worktrees warning (non-blocking)
OPEN_WORKTREES=$(git worktree list 2>/dev/null | grep -v "(bare)\|$(git rev-parse --show-toplevel)" | wc -l | tr -d ' ')
if [ "$OPEN_WORKTREES" -gt 0 ]; then
    echo ""
    echo "AVERTISSEMENT — $OPEN_WORKTREES worktree(s) ouvert(s) :"
    git worktree list | grep -v "(bare)\|$(git rev-parse --show-toplevel)" | while read l; do echo "  $l"; done
    echo "Fermer avec : git worktree remove <path>  (si le chantier est terminé)"
fi

exit 0

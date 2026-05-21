#!/bin/bash
# validate_beat.sh — Gate bloquant avant de coder un beat Souverain.
#
# Usage:
#   ./scripts/validate_beat.sh <episode> <beat_id>
#
# Exemple:
#   ./scripts/validate_beat.sh zimbabwe-lithium beat3
#   ./scripts/validate_beat.sh niger-uranium beat2
#
# Ce script vérifie mécaniquement la checklist bloquante du workflow officiel.
# Si une vérification échoue → exit 1, Claude ne doit pas continuer.
#
# Quand lancer : AVANT d'écrire une seule ligne de code Remotion pour ce beat.

set -e

EPISODE=$1
BEAT_ID=$2

if [ -z "$EPISODE" ] || [ -z "$BEAT_ID" ]; then
    echo "Usage: ./scripts/validate_beat.sh <episode> <beat_id>"
    echo "Exemple: ./scripts/validate_beat.sh zimbabwe-lithium beat3"
    exit 1
fi

BASE=$(dirname "$0")/..
EPISODE_DIR="$BASE/public/souverain/$EPISODE"
BREAKDOWN="$EPISODE_DIR/assets/breakdown/${BEAT_ID}_breakdown.json"
ASSETS_DIR="$EPISODE_DIR/assets/$BEAT_ID"
# Chercher tout fichier PRODUCTION-*.md dans le dossier de l'épisode
PRODUCTION_FILE=$(find "$EPISODE_DIR" -maxdepth 1 -name "PRODUCTION-*.md" 2>/dev/null | head -1)

ERRORS=0
WARNINGS=0

echo ""
echo "======================================================"
echo " VALIDATE BEAT — $EPISODE / $BEAT_ID"
echo "======================================================"
echo ""

# ── Check 1 : Breakdown JSON existe ──────────────────────────────────────────
echo "[ ] 1. Breakdown JSON existe..."
if [ ! -f "$BREAKDOWN" ]; then
    echo "    ✗ ERREUR : $BREAKDOWN introuvable"
    echo "    → Générer le breakdown via Gemini 3.1-pro-preview avant de coder."
    ERRORS=$((ERRORS + 1))
else
    echo "    ✓ $BREAKDOWN"
fi

# ── Check 2 : Assets to_generate présents ────────────────────────────────────
echo ""
echo "[ ] 2. Assets 'to_generate' présents dans assets/$BEAT_ID/..."
if [ -f "$BREAKDOWN" ]; then
    # Extraire les noms de fichiers des assets to_generate
    ASSETS_EXPECTED=$(python3 -c "
import json, sys
data = json.load(open('$BREAKDOWN'))
assets = data.get('background_assets_to_generate', [])
for a in assets:
    print(a['filename'])
" 2>/dev/null)

    if [ -z "$ASSETS_EXPECTED" ]; then
        echo "    ℹ️  Aucun asset à générer dans ce breakdown."
    else
        ASSETS_MISSING=0
        while IFS= read -r filename; do
            asset_path="$ASSETS_DIR/$filename"
            if [ ! -f "$asset_path" ]; then
                echo "    ✗ MANQUANT : $filename"
                echo "    → Lancer: python3 scripts/prepare_beat.py $EPISODE $BEAT_ID"
                ERRORS=$((ERRORS + 1))
                ASSETS_MISSING=$((ASSETS_MISSING + 1))
            else
                size=$(du -h "$asset_path" | cut -f1)
                echo "    ✓ $filename ($size)"
            fi
        done <<< "$ASSETS_EXPECTED"
        if [ $ASSETS_MISSING -eq 0 ]; then
            echo "    ✓ Tous les assets sont présents."
        fi
    fi
else
    echo "    ⚠️  Impossible de vérifier (breakdown manquant)"
    WARNINGS=$((WARNINGS + 1))
fi

# ── Check 3 : Pixel(0,0) des PNG ─────────────────────────────────────────────
echo ""
echo "[ ] 3. Fonds des PNG conformes (noir ou crème)..."
if [ -d "$ASSETS_DIR" ]; then
    PNG_COUNT=0
    PNG_OK=0
    for png_file in "$ASSETS_DIR"/*.png; do
        [ -f "$png_file" ] || continue
        PNG_COUNT=$((PNG_COUNT + 1))
        filename=$(basename "$png_file")
        pixel=$(python3 -c "
from PIL import Image
img = Image.open('$png_file').convert('RGB')
p = img.getpixel((0,0))
print(f'{p[0]},{p[1]},{p[2]}')
" 2>/dev/null)
        if [ -z "$pixel" ]; then
            echo "    ⚠️  $filename : impossible de lire le pixel"
            WARNINGS=$((WARNINGS + 1))
            continue
        fi
        r=$(echo $pixel | cut -d',' -f1)
        g=$(echo $pixel | cut -d',' -f2)
        b=$(echo $pixel | cut -d',' -f3)
        # Fond noir : R,G,B < 30
        # Fond crème : R 190-230, G 175-215, B 130-175
        is_dark=$(python3 -c "print('yes' if $r < 30 and $g < 30 and $b < 30 else 'no')")
        is_cream=$(python3 -c "print('yes' if 190 <= $r <= 230 and 175 <= $g <= 215 and 130 <= $b <= 175 else 'no')")
        # Fond gris neutre (problématique : ni noir ni crème)
        is_grey=$(python3 -c "print('yes' if abs($r-$g) < 20 and abs($g-$b) < 20 and 50 <= $r <= 220 else 'no')")

        if [ "$is_dark" = "yes" ]; then
            echo "    ✓ $filename : fond noir ($r,$g,$b) → mixBlendMode screen"
            PNG_OK=$((PNG_OK + 1))
        elif [ "$is_cream" = "yes" ]; then
            echo "    ✓ $filename : fond crème ($r,$g,$b) → usage direct"
            PNG_OK=$((PNG_OK + 1))
        elif [ "$is_grey" = "yes" ]; then
            echo "    ✗ $filename : fond GRIS ($r,$g,$b) — DAMIER probable dans Remotion"
            echo "    → Régénérer avec prepare_beat.py OU ajouter fond noir/crème au prompt"
            ERRORS=$((ERRORS + 1))
        else
            echo "    ⚠️  $filename : fond inattendu ($r,$g,$b) — vérifier visuellement"
            WARNINGS=$((WARNINGS + 1))
        fi
    done
    if [ $PNG_COUNT -eq 0 ]; then
        echo "    ℹ️  Aucun PNG dans $ASSETS_DIR"
    fi
else
    echo "    ℹ️  Dossier assets/$BEAT_ID inexistant (normal si aucun asset à générer)"
fi

# ── Check 4 : Fichier de production existe ────────────────────────────────────
echo ""
echo "[ ] 4. Fichier de production de l'épisode existe..."
if [ -n "$PRODUCTION_FILE" ]; then
    echo "    ✓ $(basename $PRODUCTION_FILE)"
else
    echo "    ⚠️  Fichier PRODUCTION-{episode}.md non trouvé"
    echo "    → Créer le fichier de tracking de l'épisode (optionnel mais recommandé)"
    WARNINGS=$((WARNINGS + 1))
fi

# ── Check 5 : Rappel règles critiques ────────────────────────────────────────
echo ""
echo "[ ] 5. Rappel règles critiques avant de coder..."
echo "    ▸ Chaque asset 'to_generate' du JSON → <Img> vers le PNG, JAMAIS SVG custom"
echo "    ▸ PNG fond noir → mixBlendMode: 'screen' dans le div wrapper"
echo "    ▸ PNG fond crème → usage direct, pas de blendMode"
echo "    ▸ Prompts assets = copie EXACTE du JSON, zéro réécriture"
echo "    ▸ Frames audio = 'audio_cue_word' du JSON, zéro invention"
echo "    ▸ Springs : damping 80-100, stiffness 50-70 (journalistique, pas nerveux)"
echo "    ▸ Permanent motion obligatoire (grain shift, float, breath)"

# ── Résultat final ────────────────────────────────────────────────────────────
echo ""
echo "======================================================"
if [ $ERRORS -gt 0 ]; then
    echo " ✗ VALIDATION ÉCHOUÉE — $ERRORS erreur(s), $WARNINGS avertissement(s)"
    echo " → Corriger les erreurs avant de coder."
    echo "======================================================"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo " ⚠️  VALIDATION OK avec $WARNINGS avertissement(s)"
    echo " → Vérifier les avertissements, puis coder avec précaution."
    echo "======================================================"
    exit 0
else
    echo " ✅ VALIDATION RÉUSSIE — Beat prêt à coder"
    echo " → Ouvrir assets/breakdown/${BEAT_ID}_breakdown.json"
    echo "    et suivre le JSON à la lettre."
    echo "======================================================"
    exit 0
fi

---
name: stitch
description: Google Stitch — outil AI design UI, capacités, limites, usage réel pour Souverain
metadata:
  type: reference
---

## Google Stitch — Référence projet

**URL**: https://stitch.withgoogle.com
**MCP**: configuré dans `.mcp.json` (stitch-mcp-server@latest, STITCH_API_KEY)
**Quota**: 350 générations/mois (Flash) + 50 générations/mois (Pro/Gemini 3.1)

## Ce que Stitch PEUT faire pour nous

- **DESIGN.md** : fichier de design system markdown → tokens lus par tout agent AI. Créé : `DESIGN.md` à la racine du projet.
- **Landing pages / pages web** Souverain : layout hero, formulaire contact, dashboard
- **Maquettes UI** si on fait une app admin
- **Variantes de layout web** rapidement (3-5 options en quelques minutes)

## Ce que Stitch NE fait PAS

- Frames vidéo 9:16 — hors scope architectural
- Title cards, posters, assets graphiques standalone
- Templates Shorts / TikTok / Instagram
- Tout ce qui n'est pas un "écran d'application"

Son pipeline pense en `sections`, `hero blocks`, `cards` — pas en surfaces créatives.

## Outils MCP disponibles

- `create_project` — créer un projet Stitch
- `list_projects` — lister les projets
- `generate_screen` — générer un écran depuis un prompt (deviceType: MOBILE/DESKTOP/TABLET/AGNOSTIC)
- `get_screen_image` — récupérer screenshot base64/URL
- `get_screen_code` — récupérer le HTML/CSS généré
- `generate_variants` — générer des variantes d'un écran
- `edit_screen` — éditer un écran existant
- `scaffold_project_files` — sauvegarder HTML dans un fichier local
- `generate_and_fetch_code` — générer + récupérer le code en une passe

## Workflow validé (test 2026-05-13)

1. `create_project` → récupérer le projectId
2. `generate_screen` avec deviceType MOBILE → récupérer screenId
3. `get_screen_image` → URL image
4. Télécharger + uploader sur catliter : `curl -F "fileToUpload=@file.png;type=image/png" https://litterbox.catbox.moe/resources/internals/api.php -F "reqtype=fileupload" -F "time=24h"`

## Erreur connue

Prompt trop long → `Cannot read properties of undefined (reading 'screens')`. Garder les prompts concis.

## Projet Stitch créé

- ID : `1477809691833509751` — "Souverain Templates"

## DESIGN.md

Fichier créé à la racine : `/Users/clawdbot/Workspace/remotion/DESIGN.md`
Contient : palette, typographie, safe zones, composants, templates catalog, règles animation, conventions code.

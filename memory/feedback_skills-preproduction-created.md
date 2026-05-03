---
name: 2 skills pré-production créés (Atlas + Video narratif générique)
description: Workflow Atlas pré-production formalisé en skill réutilisable suite à session Empire Ghana réussie. Skill 2 squelette générique pour Seedance à raffiner plus tard.
type: reference
---

## Contexte

Session Empire du Ghana (2026-05-03, 3-4h, $2) a validé un pipeline pré-production reproductible :
1. Validation subject Atlas-natif
2. Script avec jury hybride 2 passes
3. Audio + Forced Alignment
4. Assets (PixelLab, Lottie, Gemini, Minimax)
5. Proof-of-concept progressive (V1/V2/V3)
6. Manifest JSON visuel + Dashboard HTML

Aziz a demandé de formaliser ce pipeline en 2 skills distincts (validé fin de session).

## Skills créés

### 1. `atlas-video-preproduction` (PLEIN DÉTAIL)
- **Path** : `~/.claude/skills/atlas-video-preproduction/`
- **Statut** : production-ready, basé sur cas validé Empire Ghana
- **Structure** :
  - `SKILL.md` (~150 lignes — entrée principale + 12 étapes pipeline)
  - `checklists/` : pre-flight-script, pre-flight-jury, pre-flight-assets, pre-flight-production
  - `templates/` : manifest, dashboard, jury briefs, decisions-locked, vague-1-locked
  - `examples/` : empire-ghana-walkthrough, what-not-to-do (8 anti-patterns Shaka)
  - `scripts/` : publish-here-now.sh, precompute-geo-template.mjs, generate-audio-template.py, generate-alignment-template.py, generate-music-template.py, jury-creative-vision.py
- **Activation** : démarrage nouveau projet Atlas (cartographie/géographie/territoire)
- **Distinct de** : `youtube-scriptwriting` (script seul), `remotion-best-practices` (code Remotion)

### 2. `video-narrative-preproduction` (SQUELETTE)
- **Path** : `~/.claude/skills/video-narrative-preproduction/`
- **Statut** : SKELETON, à raffiner plus tard quand utilisé sur Seedance/portrait
- **Structure** : juste `SKILL.md` pour l'instant
- **Activation** : nouveau projet narratif non-Atlas (Seedance Shorts, portrait, conte oral)
- **Distinct de** : `atlas-video-preproduction` (cartographique), `batch-short-production` (clips Seedance production)
- **Référence projets passés** : Sonjata V7, Thiaroye V5, Abou Bakari II

## Apprentissages méta documentés dans skills

### Anti-pattern principal : Forcer Atlas sur sujet non-Atlas
- Score Atlas-natif <3/5 → Seedance, pas Atlas
- Cas concret : Shaka Zulu (1/5) en pause stratégique
- Voir `atlas-video-preproduction/examples/what-not-to-do.md`

### Pattern "Test on proof, not promise"
- V1 placeholder → V2 real assets → V3 full integration
- Validé sur SilentBarterTest Empire Ghana (3 versions séquentielles)
- Économise 4-8h en cas de bug logique

### Pattern "Réutilisation > recréation"
- Importer ATLAS_COLORS dans GhanaPalette via re-export
- Réutiliser AtlasMercator (pas recoder)
- "On a déjà ça dans Mansa Moussa, non ?" — Aziz check

### Hosting HTML
- ❌ Catbox : `content-length: 0` pour HTML
- ✅ here.now : 3 étapes API, claimable 24h
- Script `publish-here-now.sh` documenté

## Quand utiliser chaque skill

| Situation | Skill |
|-----------|-------|
| Démarrage nouvel Atlas (Hannibal, Ghana, Sundiata, etc.) | `atlas-video-preproduction` |
| Démarrage nouvel Seedance Short (héros, tragédie, portrait) | `video-narrative-preproduction` |
| Sujet ambigu | Run Atlas-native check d'abord (skill 1 checklist) |
| Production scènes après pré-production | `batch-short-production` (Seedance) ou code direct (Atlas) |

## Évolution future

- Skill 2 (générique) à enrichir au fur et à mesure des projets Seedance
- Skill 1 (Atlas) à mettre à jour si nouvelles découvertes (ex: nouveau format Atlas, nouvel outil)
- Cross-reference les 2 skills sur patterns partagés (jury, dashboard, manifest, anti-patterns)

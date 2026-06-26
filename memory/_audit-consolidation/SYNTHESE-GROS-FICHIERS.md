# Synthèse audit GROS FICHIERS (étape 3) — 2026-06-25

> 5 agents Sonnet 4.6 (lecture seule) : Souverain, Atlas, War-Map, SVG, Transverse. Angle = découpage/consolidation pour AGENT VIERGE.
> Document décisionnel pour réparation (CHECKPOINT 2).

## A. DÉCOUPAGES CODE (.tsx) — gros gains de lisibilité

| Fichier | Lignes | Action | Gain | Risque |
|---|---|---|---|---|
| `warmap/engine/SahelWarMapEngine.tsx` | 4227 | Extraire `SahelTimings.ts` (~350L) + `SahelCameras.ts` (~430L) + `SahelActors.ts` (~130L) — données pures, 0 React | ~900L → moteur ~3350L | **FAIBLE** (TS pur, pas de JSX). Zone JSX (1935L) reste — refactor profond réservé post-assemblage. |
| `atlas/_shared/atlas-components.tsx` | 1009 | Extraire `atlas-constants.ts` (~80L) + `atlas-camera.ts` (~175L) | ~270L → ~740L | FAIBLE (MAJ imports 6 beats) |
| `souverain/.../Beat14.tsx` | 747 | Extraire `PlateLabel`+`MapDot` vers `_shared/mapbox/` ; exporter constantes `F_*` ; phases C/D/E (Beat14PhaseC existe déjà ?) | ~110L | MOYEN (vérifier doublon Beat14PhaseC) |
| `atlas/peste-1347/Beat4Climax.tsx` | 822 | Extraire `StatParchment`+`AnimatedRoute` vers `_shared/` | ~80L | FAIBLE |
| Helpers Mapbox dupliqués (6 fichiers) | — | `pushCanvas`/`ensureSource`/`easeInOutCubic` redéfinis partout → importer depuis `_shared/mapbox/flagCanvas.ts` (existe déjà) | cohérence | FAIBLE |

⛔ NE PAS toucher (légitimement gros, scènes complexes) : Partie3/4 War-Map, SenegalActe2Continu, B2/B3/B4 SVG (SVG inline narratif), Beat5MaliVivant, PetrolePatienceShort (sauf imports helpers), WarMapEngine.

## B. DÉCOUPAGES / DÉGRAISSAGE DOCTRINES & TOOLS (.md)

| Fichier | Lignes | Action | Gain |
|---|---|---|---|
| `tools/gemini.md` | 642 | Scinder : règles modèles API critiques (~120L gardées) + `gemini-pipelines.md` (thumbnails/assets/gotchas spécialisés ~500L) | -400L sur le fichier lu en permanence |
| `key-learnings.md` | 637 | Archiver sections WAR-MAP + DA-BRIEF + Brief-Agents (absorbées dans leurs doctrines) | -200L |
| `NEXT-ACTION.md` | 380 | Archiver les sections "FAIT/LIVRÉ" (résidu historique) | -80L |
| `rules-souverain-editorial.md` | 398 | Scinder : éditorial pur (~200L) + `rules-souverain-script.md` (sections 5/7/9, ~200L) | clarté édito/script |
| `WARMAP-LONG-DOCTRINE.md` | 336 | Couper sections overlay contradictoires (remplacées par WARMAP-GRAMMAIRE §2/6/9) → renvoi | -150L + lève contradiction |
| `mapbox-mcp.md` | 306 | Couper sections caméra/projection dupliquées de DOCTRINE-SOUVERAIN → renvoi | -42L + lève divergence blur |
| `workflow-souverain-gemini-pipeline.md` | 201 | Fusionner dans `workflow-gemini-breakdown-schema.md` (80% redondant) | -160L + lève contradiction Gemini-vs-GPT5.5 |

## C. CONSOLIDATION / DÉDUP

- **Bloc "Règles titres"** identique dans `script-atlas-v1.md` + `script-ebauche-v1.md` → extraire `templates/regles-titres.md` (-80L).
- **`atlas-v2-components.tsx`** (686L, `_reference/`) duplique `atlas-components.tsx` → bandeau ARCHIVE + MAJ ATLAS-COMPOSANTS.md (pointer `_shared` only).
- **Doublons Kimi/point-de-contrôle SVG** : PRODUCTION-AGENTIQUE + ETAT-GGW répètent SCENES-GENERATIVES → pointeurs (-30L).
- **`buildPhrases`** copié B2/B3 (avec bug subtil) → extraire `_shared/utils/buildPhrases.ts`.
- **`_rnd/svg-scenes/`** : ~26 variantes écartées mélangées aux 12 scènes de référence → sous-dossier `_archive/` + MAJ README.

## D. ACCESSIBILITÉ (pointeurs manquants — 0L coupée, gros impact agent vierge)

- **ROUTAGE.md manque** : WORKFLOW-DATAVIZ, PRODUCTION-AGENTIQUE-REMOTION, rules-data-driven-motion-design, seedance-prompts (templates). → ajouter.
- **Ordre de lecture SVG** : 4 doctrines sans "vous êtes ici" → bandeau d'aiguillage en tête (FAISABILITE→SCENES→AGENTIQUE→MIDFORM).
- **Sommaire exécutif WARMAP-GRAMMAIRE** (534L) : 20L en tête avec les 5 règles NON-NEGOTIABLE.
- **WARMAP-INDEX** pointe le mauvais moteur (`WarMapEngine` au lieu de `SahelWarMapEngine`). → corriger.
- **Lien caméra `script-atlas-v1.md`** pointe Seedance au lieu de Remotion. → corriger.

## E. CONTRADICTIONS RESTANTES (corriger même sans découpage)

- **NAVY en 4 valeurs hex** (#16213a / #0d1420 / #141c2e / #0d1520) — source de vérité `_PALETTE-BACKGROUNDS.md` non liée. → trancher 1 valeur + lier.
- **Cartouches Atlas** : `y≤320` (PLAYBOOK) vs `y<640` (rules-atlas). → aligner sur PLAYBOOK.
- **Incohérence Kimi** dans rules-workflow-processus §9 (cité alors que retiré du jury). → corriger.
- **`pipeline.md` daté 2026-05-02** (n'intègre pas SVG/dataviz juin). → MAJ ou bandeau.
- **`visual-manifesto.md`** (370L médiéval) dans doctrines/ pollue le contexte Souverain. → déplacer vers `doctrines/atlas/` ou archive.

## Découpage réparation (périmètres disjoints)
- LOT A' War-Map (code engine + doctrines) · LOT B' SVG (md aiguillage + dédup + _archive code) · LOT C' Atlas (atlas-components split + dédup titres + v2 bandeau) · LOT D' Souverain (rules split + workflow fusion + mapbox-mcp + navy + visual-manifesto) · LOT E' Transverse (gemini split + key-learnings/NEXT-ACTION élagage + ROUTAGE pointeurs).
- Code .tsx = worktree isolé OBLIGATOIRE (typecheck après chaque extraction). MD = comme avant.

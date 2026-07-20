# WAR-MAP — INDEX DES INDEX (carte maître)

> **Point d'entrée UNIQUE pour toute production War-Map.** 3e pilier Kora & Cartes (après Souverain + Atlas).
> Avant de coder/produire une war-map, identifier ICI quel fichier ouvrir selon le besoin.
> Créé 2026-06-05 (miroir de `ATLAS-INDEX-DES-INDEX.md`). Référencé depuis CLAUDE.md.
> War-Map = **moteur de récit cartographique temporel humanisé** (la guerre n'est que le 1er cas).
> Identité parchemin Atlas FLAT TOP-DOWN. Différentiel = objets incarnés + côté humain + explicatifs.

---

## ⭐ LA RÉFÉRENCE DU PILIER (à montrer / améliorer)

**`SudanWarMapEpic60`** — la vidéo de 60 secondes qui combine TOUT le stack (actes véhicules + overlays
data + réfugiés mouvants + figure civile + climax). **C'EST la vidéo de référence**, pas les variantes
plus courtes. Catbox : `4dwqit` (v4 final). Composition dans `src/Root.tsx` (folder `rnd-warmap`).

> ⚠️ Les autres compositions (`SudanWarMapVertical` 30s, `SudanWarMapTokensVertical`, `SudanWarMapFlat` 16:9)
> sont des **variantes / briques de démonstration**, PAS la référence. Ne pas les confondre.

---

## 🧭 Quel fichier pour quoi ?

| Besoin | Source de vérité | Contenu |
|---|---|---|
| **Doctrine GRAMMAIRE (réalisation)** — ⭐⭐ LIRE AVANT DE CODER TOUTE SCÈNE | `memory/doctrines/WARMAP-GRAMMAIRE.md` | CAUSE avant EFFET, carte vs overlay, 5 techniques causales, dynamisme D-0→D-9, 4 règles R-V, templates overlay. (Fusion 2026-06-15 des ex-grammaires causale/vivante/carte-vs-overlay.) |
| **Doctrine ANIMER UN OBJET** (quel outil : SVG / Gemini / PixelLab) | `memory/doctrines/WARMAP-ANIMER-OBJETS.md` | Arbre de décision + 3 règles R-OBJ + ponctuel vs ambiant. (Fusion ex-objets-gemini-vs-pixellab + svg-anime-3e-voie.) |
| **Doctrine VISUELLE / DESIGN** (différentiel, 4 briques, R1-R6, recette sprites, ouvertures) | `memory/doctrines/WARMAP-PLAYBOOK.md` | Tout sur la carte sauf info sans équivalent ; overlays centrés ; séquentiel ; jamais assombrir |
| **Doctrine LONG FORMAT** (5-7min, 16:9, carte permanente) | `memory/doctrines/WARMAP-LONG-DOCTRINE.md` | Carte permanente, overlays 3 niveaux, structure 5 actes, 3 régimes |
| **Doctrine DONNÉES** (phase recherche : sources OSINT, fiabilité, schéma canonique) | `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` | 4 étapes ACLED→synthèse→fact-check ; classement fiabilité ; contrat schéma |
| **État + compositions + rendus + analyse stratégique** | `memory/episodes/warmap-daybyday/STATUS.md` | Fiche de reprise. Compositions, briques, décisions Aziz, historique rendus |
| **Décode du genre** (écosystème mapsinanutshell, cadence, monétisation) | `memory/atlas-decode/DECODE-daybyday-warmap.md` | Le "pourquoi" du format + pipeline du genre |
| **Recette sprites top-down** (Gemini, pas Recraft) | `memory/feedbacks/feedback_sprites-topdown-gemini-vs-recraft.md` | Diagnostic + recette fond cream → removeBackground |
| **"quelle brique pour X ?" / réutilisable** ⭐ | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` | Catalogue "quand Aziz dit X → brique Y" des 4 briques + LINKING mapanimation (flèches, encerclement, manœuvres) + convention de rangement |
| **2e source d'animation : mapanimation** (flèches tactiques, encerclement, flux, manœuvres troupes) | Voir WARMAP-COMPOSANTS-INDEX §mapanimation | `AtlasAttackArrow`/`AtlasEncirclement` (codés) + décodes `memory/_r-and-d-mapanimation-*` + `DECODE-bazbattles-manoeuvres.md`. **À exploiter pour enrichir les beats war-map** |

## 📁 OÙ EST LE CODE (structure unifiée 2026-06-05)

```
src/projects/warmap/
├── WARMAP-INDEX.md          ← CE FICHIER (point d'entrée)
├── _shared/                 ← COMPOSANTS GÉNÉRIQUES réutilisables (créé 2026-06-07)
│   ├── SahelAttackArrow.tsx  ⭐ flèche tactique Mapbox (map.project, progress 0→1, marching ants)
│   ├── TerritorialExpansion.tsx  expansion organique (blobs fill-opacity progressif, delays)
│   ├── RefugeeFlow.tsx           flux de déplacés (rubans SVG stroke-dasharray animés)
│   ├── WarMapOverlayData.tsx     overlay donnée solide (parchemin centré)
│   └── WarMapOverlayExplicatif.tsx  overlay explicatif (semi-transparent)
├── engine/                  ← les MOTEURS vidéo par instance
│   ├── WarMapEngine.tsx      ⭐ moteur Soudan (référence = SudanWarMapEpic60)
│   ├── SahelWarMapEngine.tsx ⭐ moteur Sahel V3 (16:9 long format, Map Animation intégré)
│   ├── MapAnimationShowcase.tsx  showcase 40s des 3 briques _shared/ (validation visuelle)
│   ├── WarMapDataOverlay.tsx   overlays (data solide + explicatif + figure)
│   ├── VehicleSymbols.tsx      fallback SVG (déprécié par sprites Gemini)
│   ├── warmapVehicles.ts       VEHICLES + REFUGEES + paths géo
│   ├── sudanControlData.ts     DATA Soudan — re-export depuis l'adapter
│   ├── SahelTimings.tsx    ⭐ constantes de triggers audio (A1, F_*), tables pulses/hide windows, RESOURCE_ICONS, ResourceSVG — EXTRAIT au refactor (était dans le monolithe)
│   ├── SahelCameras.ts     ⭐ keyframes caméra (SAHEL/ACTE1/PARTIE1-4/PROTO24/ACTE2_CAM_KEYS) + fonctions getXxxCam + tokens B1 + ACTE2_BASES — EXTRAIT au refactor
│   ├── SahelActors.ts      ⭐ ACTE1_VEHICLES, FIGHTERS, interpFighter/interpA1Vehicle, blobPath — EXTRAIT au refactor
│   └── SahelContext.ts         type SahelRenderContext + closure project(lon,lat)→{x,y}
└── data/                    ← la COUCHE DONNÉES (pipeline)
    ├── schema.ts             WarMapDataset (contrat moteur + provenance)
    ├── adapter.ts            canonicalToEngine (bridge JSON → moteur)
    ├── sudan.warmap.json     instance Soudan (ACLED-dérivée)
    └── sahel.warmap.json     instance Sahel AES (15 jalons + 6 véhicules + 3 réfugiés)
```

Pipeline data (scripts) : `scripts/warmap/` (acled_connector, ucdp_connector, aggregate, llm_synthesis,
factcheck, build_warmap_data + fixtures + golden test). Voir WARMAP-RESEARCH-PLAYBOOK.

> **NOTE générique (à découpler au 2e sujet)** : `WarMapEngine` est nommé générique mais contient encore
> de la donnée Soudan hardcodée (`EPIC_WINDOWS`, variants overlay, timings `SUDAN_*`). Le découplage
> moteur/donnée complet se fera au 2e sujet (règle : généraliser au 2e cas concret, pas au 1er).

## 🧩 LES 4 BRIQUES (toutes validées, combinables, SÉQUENTIELLES)

| Brique | Fichier | Règle |
|---|---|---|
| **Carte parchemin data-driven** | `engine/sudanControlData.ts` + `data/` | Polygones admin-1, valeur 0..1 → couleur. Front glow sur états en bascule |
| **Sprites véhicules top-down** | `engine/warmapVehicles.ts` + `public/_shared/sprites/warmap/` | GEMINI (pas Recraft). Orientés selon la marche. Taille ×1.45 |
| **Jetons-visage** | `engine/warmapVehicles.ts` (REFUGEES) + overlay | Portraits Gemini en cercle. Factions (ponctuel) OU réfugiés mouvants. Sur la carte, jamais plein écran |
| **Overlay Remotion** | `engine/WarMapDataOverlay.tsx` | 2 types : donnée majeure (solide centré) / explicatif (semi-transp centré). N icônes exactes |

## 🎨 ASSETS

| Type | Emplacement |
|---|---|
| Sprites (chars, technicals, portraits) | `public/_shared/sprites/warmap/` (tank-td-blue, tech-td-red, portrait-saf/rsf/civil) |
| Audio (3 durées) | `public/_shared/audio/sudan-warmap/` (score 22s / score-long 32s / score-epic 60s) |
| Géo | `public/_shared/geo-data/sudan/sudan-states.geojson` (17 états Natural Earth) |

## 🚀 COMMENT DÉMARRER (3 étapes)

0. **Avant de coder une scène War-Map** → `python3 scripts/warmap-session.py --phase scan` (aide-mémoire des 4 pointeurs doctrine essentiels, évite de redécouvrir à la main) puis, une fois le zoom Mapbox choisi, `--phase zoom-check <fichier.tsx> --zoom N --intent close-up|territorial|regional` (vérifie la distance réelle km visible à l'écran — a détecté rétroactivement le bug ×10 du zoom Soudan Acte 3).
1. **Lire** `memory/doctrines/WARMAP-GRAMMAIRE.md` (⭐⭐ réalisation, AVANT de coder) + `WARMAP-PLAYBOOK.md` (design) + `WARMAP-RESEARCH-PLAYBOOK.md` (données si nouveau sujet).
2. **Choisir le moteur selon l'épisode :**
   - **Sahel (production active)** → `src/projects/warmap/engine/SahelWarMapEngine.tsx` ⭐ moteur principal long-format 16:9. État épisode : `memory/episodes/warmap-sahel/STATUS.md`.
   - **Soudan (référence stack)** → `src/projects/warmap/engine/WarMapEngine.tsx` — la composition de référence est `SudanWarMapEpic60` (catbox `4dwqit`). Toujours utile pour voir les 4 briques combinées.
3. **Pour un nouveau sujet** : produire un `<sujet>.warmap.json` (via `scripts/warmap/`), partir de `SahelWarMapEngine.tsx` comme base (moteur le plus avancé).

## 🗂️ INSTANCES (sujets traités avec ce moteur)

| Sujet | État | Où | Note |
|---|---|---|---|
| **Soudan** (guerre RSF/SAF) | ✅ RÉFÉRENCE (`SudanWarMapEpic60`) | `engine/` + `data/sudan.warmap.json` | 1ère instance, validée |
| **Lobito Corridor** (éco/ressources) | 🚧 EN COURS (session pipeline) | `src/projects/_rnd/lobito-corridor/` | 2e sujet (non-violent). Réutilise `WarMapEngine`. À PROMOUVOIR hors `_rnd/` quand stabilisé + à brancher ici. Voir `_HANDOFF-SESSION-PIPELINE.md` |

> ⚠️ Lobito est encore sous `_rnd/` (brouillon) alors que le pilier a été promu hors `_rnd/`. Incohérence
> à résoudre quand la session pipeline aura stabilisé Lobito : le déplacer vers `src/projects/warmap/instances/lobito/`
> (ou équivalent) et l'inscrire dans STATUS.

## ⏳ NEXT (structurer le pilier aux procédures Souverain/Atlas)
- Skill `warmap-preproduction` (miroir `souverain-preproduction` / `atlas-video-preproduction`) — À CRÉER.
- Découpler moteur/donnée au 2e sujet (indépendant du choix de moteur). ~~Basculer moteur sur d3-geo pur~~ — TRANCHÉ 2026-07-11 : Mapbox reste le moteur de production (voir `WARMAP-PLAYBOOK.md` intro), la bascule n'a jamais eu lieu en 6 semaines et Mapbox tourne sans problème en production.
- Décision polish ouverte : remplacer la fausse horloge par `JOUR N de guerre` (voir NEXT-ACTION).

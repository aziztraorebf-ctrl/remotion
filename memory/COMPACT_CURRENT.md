# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-06-02 — **Maroc Batteries : Beat 0 + Beat 1 FINAL.** Architecture beats séparés (compositions Root.tsx). Découverte majeure : FlagFill = règle N°1 carte vivante. 2 templates FlagFill créés. PROCHAIN : session Fill-Pattern (bibliothèque drapeaux/textures) AVANT Beat 2.

---

## 🇲🇦 Maroc Batteries Short — En cours (2026-06-02)

**Statut :** Beat 0 Hook FINAL ✅ + Beat 1 Phosphate FINAL ✅
- `out/episodes/maroc-batteries/beat0-FINAL.mp4` (https://files.catbox.moe/jx3e4s.mp4)
- `out/episodes/maroc-batteries/beat1-FINAL.mp4` (https://files.catbox.moe/n9jxx7.mp4)

**Architecture (CHANGEMENT vs 2026-05-31) :** beats SÉPARÉS, 1 composition Root.tsx par beat (`Beat0Hook.tsx`, `Beat1Phosphate.tsx`). L'ancien `MarocBatteriesShort.tsx` = stub. Ancienne version archivée `src/_archive/MarocBatteriesShort_OLD_2026-06-02.tsx`.

**Prochaine session :** ⚠️ **SESSION FILL-PATTERN d'abord** (bibliothèque drapeaux/textures réutilisables) PUIS Beat 2 Cailloux (f932→f1300, pur Remotion, split phosphate brut/cathode + balance + stat "5,6 Md$"). Assets Gemini Beat 2 non générés — valider prompts avec Aziz avant.

**Assets prêts :**
- Audio : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (109.48s)
- Forced alignment Whisper OpenAI fait → `maroc-words.ts` + `timing.ts` (SEGMENTS beat0-beat5)
- Drapeaux locaux : `public/_shared/flags/` (es.png, fr.png, de.png — générés Python Pillow)

**Techniques validées cette session :**
- `SweepRevealTerritory` (Beat 0) avec prop `showHatching` ajoutée (hachures ivory)
- FlagFill : `pushCanvas` drapeau canvas pur (Maroc) + PNG locaux `staticFile()` (ESP/FRA/DEU)
- Dots CSS React via `map.project()` (les circle Mapbox se cachent sous fill-pattern)
- Layers dots ajoutés EN DERNIER dans style.load (ordre z-index Mapbox)
- Slam SVG mask "70%" : `translate/scale/translate` (pas transformOrigin, headless)
- Karaoké : MAROC_WORDS filtré (tous les mots), JAMAIS WORD_ANCHORS seuls
- SFX volumes : cinématique 0.50-0.55, UI 0.40-0.45, musique 0.12

**Découverte majeure :** voir `memory/feedback_flagfill-templates-decouverte.md` — la carte Mapbox DOIT être colorée dès le départ (fill-pattern/fill-color). Règle N°1.

---

---

## 📐 Stack Carousels Instagram (décision d'architecture — 2026-05-31)

**Carousels Instagram = Gemini Flash Image uniquement. Remotion/Tailwind abandonné pour ce cas.**

- Modèle : `gemini-3.1-flash-image-preview` — ~$0.04/slide, ~$0.32/carousel
- Remotion génère de bons layouts HTML mais Gemini produit des compositions visuelles premium supérieures pour les images statiques Instagram
- Remotion reste supérieur pour la vidéo animée — pas de changement sur ce point
- Règles complètes : `memory/tools/gemini.md` section "Pipeline Carousel Instagram"

---

## 🎨 Carousels Instagram — En cours (2026-05-31)

**Pipeline validé :** Gemini Flash Image, 8 slides par carousel, ~$0.32/carousel. Règles complètes dans `memory/tools/gemini.md`.

**Statut :** Or Africain ✅ | Thiaroye ✅ | Mansa Moussa ✅ | Niger ❌ | Restants : Empire Ghana, Soundjata, Silicon Savannah, Vraie Taille Afrique, Sénégal.

**Prochaine action :** Vraie Taille Afrique EN PREMIER (sort le 4 juin — urgent), puis Empire Ghana, Soundjata, Silicon Savannah, Sénégal.

**Nouveaux fichiers créés cette session :**
- `scripts/schedule-postiz.py` — script scheduling Postiz (9 vidéos planifiées)
- `scripts/generate-carousels.py` — générateur PNG Remotion (abandonné, remplacé par Gemini)
- `src/projects/_shared/components/layouts/CarouselSouverain.tsx` — template Remotion carousel (abandonné)
- `src/projects/souverain/carousels/carousel-data.ts` — données 9 carousels
- `memory/STARTER-PROMPT-carousels-suite.md` — starter prompt prochaine session

---

## 🏆 MILESTONE — Lancement Kora & Cartes (2026-05-29)

**Chaîne officiellement lancée.** 9 vidéos planifiées via Postiz API.

### Calendrier de publication (lun/mer/ven, 15h00 UTC)

| Date | Titre | Durée |
|------|-------|-------|
| Lun 2 juin | Le Ghana a signé l'accord que 6 pays refusaient | 1m39s |
| Mer 4 juin | Les USA, la Chine et l'Europe tiennent dans l'Afrique | 1m12s |
| Ven 6 juin | Ils ont libéré la France. Elle les a massacrés. | 1m38s |
| Lun 9 juin | Le Niger recevait 9 centimes sur l'euro depuis 53 ans | 1m41s |
| Mer 11 juin | Il a fait s'effondrer l'or mondial. Par accident. | 2m01s |
| Ven 13 juin | Au Sahara, le sel valait autant que l'or | 1m44s |
| Lun 16 juin | Il était paralysé. Il a fondé le plus grand empire d'Afrique de l'Ouest | 2m46s |
| Mer 18 juin | Le pays qui a inventé le paiement mobile avant Apple | 2m02s |
| Sam 20 juin | Comment le Sénégal évite le piège du Niger | 7m39s |

### Stack de publication
- **Outil** : Postiz (API) — script `scripts/schedule-postiz.py`
- **Plateformes** : YouTube + Instagram + TikTok + Facebook simultanément
- **Titres** : règle hybride 2 couches (Test Tokyo + format empirique 50 car. max)
- **Captions** : adaptées par plateforme (YouTube long-form, TikTok court, IG avec emojis)
- **Handle uniforme** : @koraetcartes sur les 4 plateformes

### Décisions stratégiques validées ce jour
- **Short-first confirmé** : Paperlore (8770 abonnés en 2 mois) valide le modèle
- **Cadence** : 3 vidéos/semaine (lun/mer/ven) pour les 3 premières semaines
- **Stratégie long terme** : mid-form → short autonome condense, pas teaser
- **Facebook** : cross-post automatique via Postiz, canal secondaire
- **Concurrents analysés** : Rook (AI slop, modèle fragile), Paperlore (Seedance 2.0, paper cut)

---

## 🆕 Session exploratoire 2026-05-25 → 2026-05-28 — Infrastructure compounding

**Aucun travail sur le projet actif Sénégal pendant cette période.** Session de construction d'assets long-terme :

### Templates Souverain Shorts (3 validés)
- **A "Géographe"** (Mapbox) — démo Pétrole patience Short + Mid
- **B "Hybride Or Africain"** (Mapbox + briques + bandeau signature) — démo Cobalt RDC
- **C "Analyste"** (data-viz pure Sequences) — démo Afrique numérique
- Showcases archivés : `out/SHOWCASES/templates-souverain/` (4 README + 4 .mp4)
- Cadence cible 2-3 Shorts/semaine validée

### Pipeline thumbnails YouTube (2 pipelines, 4 références)
- **Pipeline A** edit chirurgical (Souverain, Atlas Mansa Moussa) — $0.04-0.12
- **Pipeline B** création guidée multi-images (Sonjata, illustrations spécifiques) — $0.04
- 4 PNG références pérennes dans `public/_shared/thumbnails-library/`
- Scripts : `scripts/tools/gemini-thumbnail-{edit,create-from-refs}.py`
- Code modulaire : `src/projects/_shared/thumbnails/` (3 wrappers + 4 icons)

### POCs Mapbox / Lottie (9 productions)
- Camera Lab v2 (12 mouvements) · Overlay Lab v1+v2 (11 techniques) · Lottie Showcase
- Pétrole patience Mid (16:9, 2min16s) + Short (9:16, 80s)
- Afrique numérique Short (Template C)
- Cobalt RDC Short (Template B)
- L'Anomalie Montréal (POC portabilité canadienne) — pas livrable, juste preuve

### Assets musicaux Minimax (8 pistes catbox)
- 5 Québec (ambient/folk/hivernal/aurore/percussion, BPM 70-95) — projet long terme différé
- 3 EDM (trailer/techno/hybrid orchestral, BPM 110-128) — disponibles pour Shorts/hooks

### Mémoire enrichie
- `memory/ANGLE-MACRO-SOUVERAIN.md` (ratio 70/30 macro/micro)
- `memory/tools/gemini.md` étendu (Pipeline A + B thumbnails)
- 2 nouveaux feedback : stratégie YouTube vs chaînes étudiées + vérifier style vidéo source AVANT thumbnail
- `out/SHOWCASES/templates-souverain/README.md` (4 README + bibliothèque)

### 3 chaînes YouTube étudiées (décisions stratégiques durables)
- Nathan Canadian Finance (1.7K subs) → **NE PAS copier** modèle hit-and-run
- Caspian Report (1.84M subs, 16 ans) → vraie référence, solo→équipe au fil du temps
- Guinée en Données (410 subs, 3 mois) → **benchmark direct** (objectif les dépasser en 6 mois)
- Détails : `feedback_strategie-vs-chaines-youtube-2026-05.md`

---

---

## PROJET ACTIF — Sénégal Pétrole & Gaz (Mid-form 4 actes ~385s)

Format : Mid-form 16:9 Souverain. Répertoire : `src/projects/souverain/senegal-petrole-gaz/`

| Acte | Durée | Statut | Fichier livrable |
|------|-------|--------|------------------|
| Acte 1 (Beats 1+2+3+5) | 42.3s | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4` |
| Acte 2 (Continu + Beat9) | 88.3s | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4` |
| Acte 3 S1 (Beat10) | 61s | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4` |
| Acte 3 S2 (Beat11) | 44.9s | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/beat11-FINAL.mp4` |
| Acte 3 S3 (Beat12) | — | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/beat12-FINAL.mp4` |
| Acte 3 S4 (Beat13) | — | ✅ VALIDÉ | `out/episodes/senegal-petrole-gaz/beat13-FINAL.mp4` |
| Acte 4 (Beat14) | 77s | ✅ VALIDÉ 2026-05-24 | `out/episodes/senegal-petrole-gaz/beat14-FINAL.mp4` |

**BEATS 100% COMPLETS. Il reste 2 tâches avant livraison :**
1. **SFX** — effets sonores sur mouvements caméra, pop plates, slashes, reveals (backlog dans `CORRECTIONS-MINEURES.md`)
2. **Assemblage final** — ffmpeg concat → `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`

### Architecture Acte 2 (innovation majeure validée)
- `SenegalActe2Continu.tsx` (2134f / 71.1s) — **une seule Map Mapbox**, 5 phases enchaînées sans cut
- `Beat9.tsx v5` (516f / 17.2s) — donut SVG 9s, fond bleu nuit `#16213a`
- `SenegalActe2Full.tsx` — assemblage avec audio mix (voix-off + musique A 18%)
- Comp Remotion id : `Senegal-Acte2-Full` (2650f)
- Catbox final : https://files.catbox.moe/ck11k7.mp4

### Acte 3 — Préparation (briefing complet prêt)
**Briefing** : `memory/STARTER-PROMPT-senegal-acte3.md` — coller en début de prochaine session.

Structure 4 sous-sections :
- **S1** Comparatif Norvège/Congo/Botswana (~30s) — nouvelle mécanique à inventer (choroplèthe ou split 3 colonnes)
- **S2** Mécanisme 1 Contrat (~30s) — **✅ PROTOTYPE D3 EXISTANT** : `prototypes/PrototypeD3StackedBars.tsx` (cost recovery Woodside, 70% prêt)
- **S3** Mécanisme 2 FONSIS + dette (~40s) — coffre-fort + ProcessFlow
- **S4** Mécanisme 3 Yakaar coulisses (~30s) — reprise carte Mapbox Acte 2 + CoinFlip Europe/Chine

### Backlog SFX (à intégrer AVANT assemblage 4 actes final)
Voir `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` — frame-précis pour Phase A/B/C/Beat9.

---

## DOCTRINE SOUVERAIN — Source de vérité unique (NOUVEAU 2026-05-23)

**Fichier** : `memory/DOCTRINE-SOUVERAIN.md` (référencé depuis CLAUDE.md, impossible à ignorer)

**Les 3 règles les plus importantes** :
1. **Premium d'abord, contraintes ensuite** — JAMAIS la solution facile pour rendre vite
2. **Réutiliser un pattern est OK si justifié** — pas d'interdiction absolue, variations valides
3. **Mapbox = frame-driven obligatoire** — `useCurrentFrame` + `interpolate` + `map.jumpTo()` (jamais flyTo/easeTo)

**Mouvements caméra Mapbox nommés et validés** : Crane Down, Dolly In, Orbit, **Pull Back Reveal** (60f), **Whip Pan** (60f), Counter-rotation, Tilt.

**Architecture "1 seule Map continue"** validée pour multi-lieux narrativement liés (référence : `SenegalActe2Continu`).

---

## STACK TECHNIQUE — Outils validés/écartés (NOUVEAU 2026-05-23)

### Retenus
- **Remotion** (principal) + **Mapbox GL JS** + **Tailwind**
- **D3.js** ✅ VALIDÉ — utility-only (calculs) + SVG/React (rendu) + Remotion (animations)
  - Modules installés : `d3-scale`, `d3-array`, `d3-format`, `d3-geo`
  - Pattern : `memory/feedback_d3-pattern-utility-only.md`
  - Prototype réf : `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`
- **@remotion/three** (3D), **@remotion/lottie** (animations AE/Rive)

### Écartés (détails DOCTRINE section 9)
- Motion Canvas (pas de Mapbox, stagnation 17 mois, paradigme générateurs)
- Revideo, Shotstack, Creatomate (perdent écosystème React/composants custom)
- Theatre.js (à reconsidérer SI projet 3D dédié)

### Règle Gemini (NON-NEGOTIABLE)
Avant tout breakdown Gemini : **TOUJOURS coller le bloc "Stack technique à ta disposition"** documenté dans `memory/workflow-gemini-breakdown-schema.md` (contrainte n°4). Sans ça, Gemini propose du SVG primitif.

---

## SESSION 2026-05-23 — Sénégal Acte 2 + DOCTRINE + D3.js

### Code produit
- `SenegalActe2Continu.tsx` (NEW, 770 lignes) + `SenegalActe2Full.tsx` (NEW)
- `Beat9.tsx` v5 réécrit (donut SVG 9s) + `Beat6/7/8.tsx` corrections drift caméra agressifs
- `prototypes/PrototypeD3StackedBars.tsx` (NEW)
- `Root.tsx` : registrations `Senegal-Acte2-Continu`, `Senegal-Acte2-Full`, `Senegal-Proto-D3-StackedBars`

### Documentation produite
- `memory/DOCTRINE-SOUVERAIN.md` (NEW, 224 lignes, 10 sections)
- `memory/STARTER-PROMPT-senegal-acte3.md` (NEW, briefing prochaine session)
- `memory/feedback_d3-pattern-utility-only.md` (NEW)
- `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` (backlog SFX)
- `CLAUDE.md` enrichi : section DOCTRINE SOUVERAIN + ligne data-viz D3 + consigne Gemini
- `memory/workflow-gemini-breakdown-schema.md` : contrainte n°4 (bloc Stack obligatoire)

### Décisions architecturales prises cette session
| Décision | Justification | Statut |
|----------|---------------|--------|
| Architecture "1 seule Map continue" Acte 2 | Élimine cuts entre beats, transitions caméra cinématiques | ✅ Validé |
| Pull Back Reveal (calqué Or Africain) | Plus impactant que cut entre Sangomar et GTA | ✅ Validé |
| Whip pans = 60 frames (pas 90+) | Au-delà mollit, en deçà saccade | ✅ Validé |
| Beat9 : donut SVG (pas barre) | Équilibre layout, espace pour 60% + verdict | ✅ Validé |
| Fond Souverain `#16213a` (pas `#0d1525`) | Lisibilité, sortir du quasi-noir | ✅ Validé |
| Animations qui respirent (arc 9s vs 3s) | Sync avec voix-off, ne pas précipiter | ✅ Validé |
| D3.js intégré stack | Standard data-viz (Bloomberg/NYT), pilotable comme React | ✅ Validé |
| Motion Canvas écarté | Pas de Mapbox, projet stagnant, paradigme incompatible | ✅ Validé |

### Commits produits
- `41d7c7b` feat(senegal): Acte 1+2 validés + prototype D3 StackedBars
- `cb46ffd` docs(doctrine): DOCTRINE-SOUVERAIN + D3.js intégré stack + Motion Canvas écarté
- `ff23870` chore(stack): D3 deps + Root.tsx prototypes + assets sessions précédentes
- Push origin/master : ✅

### Prochaine action recommandée
Démarrer session Acte 3 en collant : *"Production Acte 3 Sénégal Pétrole & Gaz. Lis `memory/STARTER-PROMPT-senegal-acte3.md`."*

Le prototype D3 StackedBars (Mécanisme 1) est déjà à 70% — adapter au timing audio Acte 3 (forced alignment Whisper d'abord) puis polir.

---

## PROJET BACKLOG — Peste 1347 (Atlas, en pause)

Beats 1+2+3 FINAUX. Beat4 Vecteur en attente. Storyboard prêt :
`public/atlas/peste-1347/storyboard/beat5-storyboard.md`. Démarrage :
`python3 scripts/atlas-session.py --episode peste-1347 --beat 5`.

**Règles non-négociables Atlas (apprises Peste Beat3, toujours valides)** :
1. `durationInFrames` Root.tsx = durée beat seul. Render standalone = `--frames=BEAT_START-BEAT_END`
2. `Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount` — jamais sans `Math.max(0,lf)`
3. Vérifier pixels asset AVANT intégration : `img.getpixel((64,64))` — RGB < 80 = trop sombre → régénérer
4. Tableau de spécification OBLIGATOIRE avant tout code (phases, frames audio-ancrées, coords stations)
5. Élément visuel doit être nommé dans le script audio — sinon → beat suivant
6. Image de référence i2i obligatoire pour tout nouvel asset PixelLab

**Assets Beat3 validés (réutilisables Beat4+)** :
- `cities-v2/caire/` (17 frames smoke) | `cities-v2/londres/` (9 frames smoke)
- Palette : `PLAGUE_RED #8b1a1a` | `MALI_GOLD #c9a84c` | `OCEAN #03224c` | `PARCHMENT #d4c29d`
- `StatParchment` composant : slide-in vertical + glow pulse

---

## SESSION 2026-05-14 — Silicon Savannah (Nairobi Tech Episode)

### Audio
- Fichier : `public/souverain/silicon-savannah/audio/narration-v3.mp3`
- Durée : 122.08s = 3662 frames @ 30fps
- Forced Alignment v2 : `narration-v3-alignment-v2.json` ✅ (v1 était corrompu — timestamps bloqués à 6.56s, bug connu)
- Whisper API crossvalidation : effectuée via API OpenAI (pas en local)

### Manifest
- `src/projects/souverain/silicon-savannah/manifest.ts` ✅
- Timestamps basés sur forced alignment v2 + crossvalidation Whisper API

### Asset en cours
- Beat 1 : illustration Nairobi stylisée (Aziz préfère illustration > photo B&W réaliste)
- Asset pas encore généré en fin de session

### Prochaine étape
- Générer illustration Nairobi stylisée (Gemini `gemini-3.1-flash-image-preview`)
- Code Remotion beat par beat à partir du manifest

---

## SESSION 2026-05-13 — Tailwind + Zimbabwe Beat 5

### Tailwind CSS installé et opérationnel
- `tailwindcss@3.4.19` + `@remotion/tailwind@4.0.456` + `postcss` + `autoprefixer` + `lucide-react`
- Config webpack `remotion.config.ts` : `enableTailwind()` — OBLIGATOIRE pour render
- Import CSS dans `src/index.ts` (entry point, PAS Root.tsx)
- Tokens Souverain dans `tailwind.config.ts` : gold, navy, slate, ivory + fontSize stat-* + spacing safe-*
- Règle consolidée : [feedback_tailwind-remotion-setup.md](feedback_tailwind-remotion-setup.md)

### Fichiers fondation créés
- `src/projects/_shared/FORMATS.ts` — FORMAT_916 et FORMAT_169
- `src/projects/_shared/animations.ts` — presets fadeIn/Out/slideUp/slideDown/popIn/gentleReveal/drawPath/countUp/appearFromBelow
- `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` — split 50/50 générique

### Beat 5 Zimbabwe — VALIDÉ par Aziz
- Fichier : `src/projects/souverain/zimbabwe-lithium/Beat5Demonstration.tsx`
- Layout : deux colonnes 50/50, carte Zimbabwe + drapeau Chine même ratio (155/185), textes flex-1, séparateurs gold/80, sous-titres pb-[200px]
- Asset : `public/souverain/zimbabwe-lithium/assets/beat5/chinese_flag_transparent.png` (fond retiré via colorkey ffmpeg)
- Render validé : `out/episodes/zimbabwe-lithium/wip/beat5_v18.mp4` → promu FINAL

### Prochaine étape recommandée
Zimbabwe Beats 3, 6, 1 restants — pipeline improve → prepare → validate → code.

---

## SESSION 2026-05-12 — Templates Mapbox Souverain (pipeline 3 passes)

### Pipeline validé (réutilisable pour tout futur template Mapbox)
1. **Passe 1** : storyboard `gemini-3.1-flash-image-preview` (3 frames PNG start/mid/end)
2. **Passe 2** : breakdown `gemini-3.1-pro-preview` → JSON technique (coords, couleurs, timing)
3. **Passe 3** : code Remotion + `./scripts/render-mapbox.sh` + review + upload litterbox

### Templates livrés et validés

| Template | Fichier | Composition | Preview | Notes |
|---|---|---|---|---|
| GoldVein V3 | `_shared/components/inserts/GoldVein.tsx` | `Insert-GoldVeinDemo` (150f) | https://litter.catbox.moe/sy5viv.mp4 | Equal Earth + 4 branches arborescentes Arlit + zoom 1.8→5.5 |
| EmpireOverlay V2 | `_shared/components/inserts/EmpireOverlay.tsx` | `Insert-EmpireOverlayDemo` (120f) | https://litter.catbox.moe/en9fay.mp4 | world_1300.geojson Mali, `borderConfidence` interne |
| GlobalPulse V1 | `_shared/components/inserts/GlobalPulse.tsx` | `Insert-GlobalPulseDemo` (150f) | https://litter.catbox.moe/38iq7e.mp4 | Globe statique zoom 1.8 |
| **GlobalPulse V2** ⭐ | `_shared/components/inserts/GlobalPulse.tsx` | `Insert-GlobalPulseV2Demo` (150f) | https://litter.catbox.moe/3n5sm6.mp4 | **VALIDÉE** — zoom-in Niger → dézoom + pulse 420px, fidélité ~95% storyboard |

### Nouveaux fichiers / assets créés
- `public/_shared/geo-data/world_1300.geojson` — copié depuis `quebec-jacques-poc/data/` (aourednik, CC BY-SA 4.0)
- `src/projects/_shared/demos/CaspianPaletteCompareDemo.tsx` — fix type `CaspianPaletteShape`
- Scripts storyboard : `/tmp/gold_vein_storyboard.py`, `/tmp/empire_overlay_storyboard.py`, `/tmp/global_pulse_storyboard.py`
- Scripts breakdown : `/tmp/gold_vein_breakdown.py`, `/tmp/empire_overlay_breakdown.py`, `/tmp/global_pulse_breakdown.py`
- Storyboards générés : `/tmp/storyboard-empire-overlay/`, `/tmp/storyboard-global-pulse/`
- Breakdowns JSON : `/tmp/breakdown-empire-overlay/`, `/tmp/breakdown-global-pulse/`

### Règle EmpireOverlay — borderConfidence (INTERNE)
`borderConfidence` prop sur `EmpireOverlay` — jamais rendu visuellement. Claude le signale verbalement.
- `precise` : frontières officielles ONU/Natural Earth
- `estimated` : reconstruction académique (aourednik, atlas) — **défaut Mali**
- `approximate` : sources très rares (Ghana ~1050, empires très anciens)

### Prochaine étape recommandée
Niger Uranium (beats manquants) **ou** Vraie Taille Afrique (audio à refaire).
Voir `memory/NEXT-SESSION-niger-uranium-final-audio.md` et `memory/episodes/souverain/vraie-taille-afrique/FACT-SHEET.md`.

---

---

## SESSION 2026-05-09 — Bibliothèque Templates Souverain

### Résultat du scout (16/17 chaînes)

**4 templates map LOCKED** :
| Template | Palette-clé | Cas d'usage | À coder |
|---|---|---|---|
| A — Or Africain V5 | Noir `#0a0a0a` + or `#f5d547` | Data-journalism financier | ✅ Existant |
| B — Carto Caspian | Océan `#bcd5e3` + terre `#ede5d3` + highlights Souverain | Géopolitique narrative | ❌ `CartoCaspian.tsx` |
| C — Atlas réaliste 3D | Satellite désaturé + mask country + tilt pitch 60° | Terrain/mines/frontières | ❌ `AtlasRealiste3D.tsx` |
| D — WonderWhy beige épuré | Kraft `#d9c8a4` + drapeaux SVG + morph chromatique | Pédagogique avant/après | ❌ `KraftCard.tsx` + `SpeakingFlag.tsx` |

**4 inserts/data-viz cross-templates** (pas des templates maps — se branchent sur A/B/C/D) :
| Insert | Source | Composant | À coder |
|---|---|---|---|
| Inserts comparaison | PolyMatter | `<ComparisonTable>`, `<CountryPills>`, `<CalendarGrid>` | ❌ |
| Diagramme entités noir pur | NYT VI | `<EntityDiagram nodes edges />` | ❌ |
| Carte minimaliste couches cumulatives | Le Monde | Style Mapbox LeMonde + Sequence layers | ❌ |
| Grille petits multiples entité + chart | The Pudding | `<SmallMultiplesGrid items={[{entity, chart}]} />` | ❌ |

**Écarté définitivement** : Johnny Harris F (trop complexe), PolyMatter rouge fond plein (repositionné en inserts), General Knowledge F2 (absorbé dans `<KraftCard>`).

### Fichiers produits cette session
- `memory/templates-research/scouting/CONSOLIDATION-V1.md` — batches 1-3, templates A-D
- `memory/templates-research/scouting/CONSOLIDATION-V2.md` — batches 4-5, inserts, arbitrage final
- `memory/templates-research/scouting/decisions-aziz-cumulatives.md` — section ARBITRAGE FINAL 2026-05-09
- `memory/templates-research/scouting/par-chaine/*/` — 16 dossiers avec `_summary.md` + frames
- Moodboard V2 live : https://lemon-sage-hg84.here.now/ (claim : `dashboard-url.md`)

### État Jour 2 — COMPLÉTÉ 2026-05-09

| Composant | Fichier | Statut |
|---|---|---|
| Template B — CartoCaspian | `_shared/mapbox/templates/CartoCaspian.tsx` | ✅ V1 validé Aziz |
| Template C — AtlasRealiste3D | `_shared/mapbox/templates/AtlasRealiste3D.tsx` | ✅ V1 POC validé |
| Template D — KraftCard | `_shared/components/inserts/KraftCard.tsx` | ✅ V1 POC validé |
| Insert SmallMultiplesGrid | `_shared/components/inserts/SmallMultiplesGrid.tsx` | ✅ V1 POC validé |
| Showcase Template C | `_shared/demos/AtlasRealiste3DShowcase.tsx` | ✅ catbox https://files.catbox.moe/19qk2e.mp4 |
| Showcase Template D | `_shared/demos/KraftCardShowcase.tsx` | ✅ catbox https://files.catbox.moe/mf6bgg.mp4 |

### Assets générés (Gemini)
- `public/souverain/_shared/avatars/` : niger, mali, burkina portraits B&W + leader-portrait-editorial.png + leader-portrait-f-editorial.png + icon-mine-uranium.png
- `public/souverain/_shared/textures/` : bg-kraft-affirme.png

### État Jour 3 — COMPLÉTÉ 2026-05-09

| Composant | Fichier | Statut | Catbox |
|---|---|---|---|
| SmallMultiplesGrid V3 | `_shared/components/inserts/SmallMultiplesGrid.tsx` | ✅ layout fixé | Cream: https://files.catbox.moe/zqlez7.mp4 Kraft: https://files.catbox.moe/lf60nq.mp4 |
| KraftCard V2 showcase | `_shared/demos/KraftCardShowcase.tsx` | ✅ 3 options V2 | https://files.catbox.moe/kygdgb.mp4 |
| AtlasRealiste3D V2 | `_shared/mapbox/templates/AtlasRealiste3D.tsx` | ✅ brightness 0.95, overlay 0.62 | (WebGL — render-mapbox.sh requis) |

**Fixes SmallMultiplesGrid V3 :**
- Layout 4 colonnes fixes : `colLabel` 25% / `colAvatar` / `curveW` / `colAnnotation` 22%
- overflow hidden sur chaque colonne, plus aucun débordement
- Annotations courtes en italique (règle : max ~10 chars pour colAnnotation)
- Dates X alignées sur le début de la courbe

**KraftCard V2 — ce qui a changé :**
- Option 1 : drapeau 460px (2×), titres 58px/32px
- Option 2 : fond drapeau flou `backdropFilter: blur(12px)` + bandeau semi-transparent (fin du fond noir pur)
- Option 3 : fond drapeau SVG teinté `brightness(0.38) saturate(1.4)` + grain overlay — portrait avant-plan seulement, zéro doublon

**AtlasRealiste3D V2 — paramètres corrigés :**
- `raster-brightness-max: 0.95` + `raster-brightness-min: 0.08` (Sahara plus clair)
- overlay monde réduit `0.72 → 0.62`
- Phase C showcase = hillshade seul sans overlay monde (test demandé Aziz)

**Nouvelles directions design à évaluer (message Aziz 2026-05-09) :**
- A. Risographe — POC dédié requis avant intégration
- B. Brutalisme éditorial (Bebas Neue / Inter Tight) — à coder, 30 min, fort potentiel
- C. Document classifié / archive — à soumettre jury LLM avant code
- D. Cinématique sobre — difficile à maintenir constant, réserver pour transitions
- Reformulation 3 inserts : `BrutalHeadline` / `DataCard` / `IncarnatedQuote` avec liant couleur+typo cross-inserts

### Jour 3 — POST-JURY 3 LLMs (2026-05-09 fin)

**Jury exécuté** : Kimi K2.5 + GPT-4o + Gemini 2.5 Pro en parallèle (91s, ~$0.04). Synthèse dans `memory/templates-research/jury-pass-jour3/SYNTHESE.md`.

**Verdicts appliqués :**

| Template | Verdict jury | Action faite | Catbox final |
|---|---|---|---|
| SmallMultiplesGrid V4 (Cream) | TWEAK 3/3 | 5 tweaks appliqués (point doré highlight + sources institutionnelles inline + courbes 3.5px + portraits/labels alignés + annotations top-right) | https://files.catbox.moe/a7w37s.mp4 |
| SmallMultiplesGrid V4 (Kraft) | TWEAK 3/3 | mêmes 5 tweaks, palette kraft conservée | https://files.catbox.moe/36smpe.mp4 |
| KraftCard V3 showcase | Mix : Opt1 TWEAK, Opt2 REWORK 3/3, Opt3 KEEP, Direction C consensus 2/2 | Option 2 supprimée, Option 1 corrigée (citation intégrée + "SOUVERAIN" subtil), Option 3 conservée (sublabel or + citation sans fond), **Option 4 NEW = Document classifié** (polaroid taped + tampon "VÉRIFIÉ SOURCE PRIMAIRE" + annotation latérale) | https://files.catbox.moe/14zw13.mp4 |
| AtlasRealiste3D V3 | REWORK Phase A+B / KEEP Phase C | Refactor complet : `addCountryMask` → `addCountryFocus` (sans overlay monde gris), `applyAtlasRealiste3D` intègre maintenant le hillshade natif. Showcase = 2 phases (Niger Sahel + Mali boucle) sur même pattern | https://files.catbox.moe/tmfq91.mp4 |

**Direction transversale validée** : C — Document classifié / archive de terrain (consensus 2/2 GPT+Gemini). Implémentée directement dans KraftCard Option 4.

**Composants modifiés** :
- `src/projects/_shared/components/inserts/SmallMultiplesGrid.tsx` (V4 — palette enrichie highlight+source, point doré SVG, source inline)
- `src/projects/_shared/mapbox/templates/AtlasRealiste3D.tsx` (V3 — hillshade dans applyAtlasRealiste3D, suppression WORLD_OVERLAY_ID, addCountryMask = alias deprecated)
- `src/projects/_shared/demos/KraftCardShowcase.tsx` (V3 — 3 options, direction C codée)
- `src/projects/_shared/demos/AtlasRealiste3DShowcase.tsx` (V3 — 2 phases pattern unique, vignetage subtil)
- `src/projects/_shared/demos/SmallMultiplesGridDemo.tsx` (sources institutionnelles ajoutées)

**Fichiers jury sauvegardés** : `memory/templates-research/jury-pass-jour3/{brief,verdict-kimi-k25,verdict-gpt-5,verdict-gemini-25-pro,SYNTHESE}.md`. Script réutilisable : `scripts/jury_3llms_jour3.py`.

### Jour 3 — RÉORGANISATION FINALE + DASHBOARD (2026-05-09 fin de session)

**Bilan Jour 3 complet** :
- 4 templates Souverain V3+V4 validés (Atlas3D, CartoCaspian, KraftCard 3 options, SmallMultiplesGrid 2 variantes)
- KraftCardDocClassifie paramétrique créé (preset Direction C, subject modulable portrait/drapeau/photo)
- Migration assets canoniques vers `public/_shared/` (flags-portraits, characters-refs, motion-refs, geo-data, SFX, textures)
- 22 imports mis à jour automatiquement (sed)
- 16 previews PNG générés (start/mid/end par template, frame ciblées sur animations)
- Tous uploadés catbox + manifest JSON dans `public/_shared/previews/_manifest.json`
- `ASSETS-INDEX.md` créé (source de vérité unique, code + assets, avec previews intégrés)
- `dashboard/templates-souverain.html` (vanilla, mobile-first, modal au clic, filtres catégorie)
- Dashboard live https://hollow-desert-9tz6.here.now/ (claim avant 2026-05-10)
- 3 scripts utilitaires : `generate_template_previews.py`, `generate_dashboard.py`, `jury_3llms_jour3.py`
- CLAUDE.md projet mis à jour (règle ASSETS-INDEX = lecture obligatoire début session)

**Décisions actées** :
- Lib Souverain LOCKED V3 — pas de re-touch jusqu'à test en usage réel
- Production Niger uranium reportée à Jour 5+ (après complétion R&D lib)
- Dashboards Atlas + Seedance reportés (audit préalable requis, pas urgent)

**Décisions ouvertes pour Jour 4** :
- KraftCard Option 1 (cadre collection) : garder ou pivoter vers `<DataCard>` chiffre central énorme ? À trancher après POC DataCard
- SmallMultiplesGrid : conserver les 2 variantes Cream+Kraft ou choisir une seule ? Décision après usage réel sur épisode

### Jour 4 — COMPLÉTÉ 2026-05-09 (cette session)

**Jury Jour 4 = 3/3 verdicts** (Kimi K2.6 + Gemini 3.1 Flash Lite + GPT-4o)

**Templates codés et validés par jury :**

| Composant | Fichier | Statut | Verdict jury |
|---|---|---|---|
| BrutalHeadline | `_shared/components/inserts/BrutalHeadline.tsx` | ✅ KEEP | Photo B&W default (V2-C), illustration (V2-D) |
| DataCard | `_shared/components/inserts/DataCard.tsx` | ✅ KEEP+TWEAK | kraft : texte `#1a1009` + secondary `#3d2210` |
| BigStat | `_shared/components/inserts/BigStat.tsx` | ✅ KEEP | Consensus 3/3 |
| NewsClipping V1 | `_shared/components/inserts/NewsClipping.tsx` | ✅ DROP | Remplacé par V2 (consensus 3/3) |
| DateBar | `_shared/components/inserts/DateBar.tsx` | ✅ KEEP | Fullscreen + bottom overlay, les deux conservés |
| NewsClipping V2 plein écran | Inline Jour4ShowcaseV2.tsx | ✅ KEEP | Référence standard citation (V2-A, consensus 3/3) |
| NewsClipping V2 grain | Inline Jour4ShowcaseV2.tsx | ✅ TWEAK | Supprimer rotation, rouge → rouge brique `#8B3A2A` |
| BrutalHeadline + B&W | Inline Jour4ShowcaseV2.tsx | ✅ KEEP | Priorité n°1 background (consensus 3/3) |
| BrutalHeadline + illustration | Inline Jour4ShowcaseV2.tsx | ✅ KEEP | Alternative sujets historiques/systémiques (consensus 3/3) |
| BrutalHeadline + drapeau SVG | Inline Jour4ShowcaseV2.tsx | ✅ DROP | Concept trop faible (Kimi+Gemini) |

**Assets Gemini générés :**
- `public/_shared/brutal-headline-assets/terrain-bw.png` — mine B&W style Salgado (862KB)
- `public/_shared/brutal-headline-assets/illustration-stylisee.png` — woodcut linocut mine (888KB)

**Showcases :**
- `src/projects/_shared/demos/Jour4ShowcaseA.tsx` — BrutalHeadline + DataCard + BigStat (450f)
- `src/projects/_shared/demos/Jour4ShowcaseB.tsx` — NewsClipping + DateBar (360f)
- `src/projects/_shared/demos/Jour4ShowcaseV2.tsx` — Iterations V2 avec assets Gemini (450f)

**3 tweaks appliqués :**
1. DataCard kraft : `text: #2a1e0e → #1a1009`, `secondary: #5a3e1e → #3d2210`
2. NewsClipping V2 grain : composant flat (pas de rotation introduite)
3. NewsClipping V2 grain accent : `accentColor` prop ajouté, Reuters = `#8B3A2A`

**Note technique Kimi K2.6 :** thinking model — réponse dans `reasoning_content`, `max_tokens: 16000` requis (4000 = 0 chars). Documenté dans `rules-workflow-processus.md`.

**Encore à faire (Jour 5 ou session dédiée) :**
- OsintSplitScreen : composant codé, pas encore rendu ni reviewé
- Templates E/F/G (Le Monde Cartographique, Carnet Reporter, Grille SCRT) : session séparée
- Mettre à jour ASSETS-INDEX.md avec 6 templates validés + previews
- Régénérer dashboard `generate_dashboard.py` + republier here.now
- Claim dashboard URL avant 2026-05-10 19h12 UTC

**Prochaine étape : PRODUCTION NIGER URANIUM (Jour 5+)**

### PLAN PRODUCTION NIGER URANIUM (sauvegardé pour Jour 5+)

À utiliser quand la lib sera complète et validée :

| Beat | Template | Contenu |
|---|---|---|
| Hook | `KraftCardDocClassifie` (drapeau Niger + tampon "VÉRIFIÉ") | Accroche + tampon = curiosité |
| Beat 1 contexte | `AtlasRealiste3D` Niger | Situer géographiquement |
| Beat 2 historique | `KraftCardDocClassifie` portrait Issoufou + tampon | Présenter le leader |
| Beat 3 data | `SmallMultiplesGrid` kraft (Niger/Mali/Burkina sur uranium) | Comparer 3 pays AES |
| Beat 4 citation | `KraftCard fond narratif` (drapeau Niger flou + Issoufou + citation ONU 2018) | Climax émotionnel |
| CTA | (pattern existant) | |

**Note Jour 5+** : possibilité d'utiliser de nouveaux templates testés en Jour 4 si plus pertinents (BrutalHeadline pour hook, DataCard pour chiffre clé, etc.).

---
> **Render v5 final validé Aziz** : https://files.catbox.moe/hf6lqa.mp4 (120s, 21.8 MB). Local : `out/PRET-PUBLICATION/empire-ghana-FINAL.mp4`. Branche `feat/atlas-empire-ghana`.
> **3 fixes finalises cette session** : (1) Beat6 CTA newsletter 14s plein ecran avec vraie silhouette Afrique d3-geo + 3 lignes cascade + musique continue + freeze-frame 1s post-"Jamais Wagadou", (2) ecran noir 5-7s eliminé (Beat0Hook etendu de 148 a 211 frames), (3) frontieres Mali Empire 1300 via dataset academique aourednik/historical-basemaps (52 vertices CC BY-SA 4.0), (4) bonus : montage overlay test alpes-test.png supprimé du Beat 4.
> **SHAKA ZULU = PAUSE STRATEGIQUE** (mismatch format Atlas / contenu psycho-militaire). Branche `feat/atlas-shaka-zulu-vague1` preserve l'etat.
> **PIPELINE ATLAS = TRES MATURE** : d3-geo + Natural Earth + walk cycle PixelLab + custom animations PixelLab + map_objects + 7 SFX ElevenLabs + sous-titres karaoke Whisper.
> **3 SHORTS PRETS POSTIZ** : Mansa Moussa V2, Thiaroye V5, Sonjata V7 (dans `out/PRET-PUBLICATION/`).
> **EMPIRE GHANA = 4e Short** post-CTA.

---

## EMPIRE DU GHANA — Etat fin session 2026-05-03

### Tout ce qui est PRET pour production

| Phase | Livrable | Statut |
|-------|----------|--------|
| Script V3 LOCKED | `memory/episodes/empire-ghana/script-v3-locked.md` (~86.5s, ~190 mots, mention "d'esclaves" Beat 2) | ✅ |
| Audio narration | `public/audio/atlas-empire-ghana/narration-v1.mp3` (104.9s, ElevenLabs eleven_v3) | ✅ |
| Forced Alignment | `src/projects/atlas/empire-ghana/ghana-alignment.ts` (loss 0.094, excellent) | ✅ |
| Whisper word-level | `src/projects/atlas/empire-ghana/whisper-words.ts` (211 mots) | ✅ |
| timing.ts | `src/projects/atlas/empire-ghana/timing.ts` (6 segments calculés) | ✅ |
| Musique choisie | `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` (Toumani Diabate style) | ✅ |
| Carte d3-geo | `data/geo/empire-ghana-data.json` (Sahel + POI Taghaza/Bambouk/Koumbi Saleh) | ✅ |
| Marchands PixelLab | `public/empire-ghana/characters/sahelien/` + `berbere/` (3 anims × 4 dirs chacun) | ✅ |
| Palette officielle | `src/projects/atlas/empire-ghana/components/GhanaPalette.ts` (hybride ATLAS_COLORS + GHANA_PALETTE) | ✅ |
| Lottie balance | `src/projects/atlas/empire-ghana/tests/balance.json` | ✅ |
| Manifest visuel | `src/projects/atlas/empire-ghana/empire-ghana-manifest.json` (288 lignes) | ✅ |
| VAGUE 1 LOCKED | `memory/episodes/empire-ghana/VAGUE-1-LOCKED.md` (8 idées validées) | ✅ |
| DECISIONS LOCKED | `memory/episodes/empire-ghana/DECISIONS-LOCKED.md` (palette + musique + popup style) | ✅ |
| Jury Pass 1 + 2 | `memory/episodes/empire-ghana/jury-pass1/` + `jury-pass2/` (3 LLMs chacun) | ✅ |
| Proof-of-concept | `out/tests/silent-barter-v3-production.mp4` (vraie carte + sprites + Lottie + palette) | ✅ |
| Dashboard live | https://smooth-oyster-6zb2.here.now/ + claim URL dans `memory/episodes/empire-ghana/dashboard-url.md` | ✅ |
| Branche git | `feat/atlas-empire-ghana` (commit 273108e + pré-production) | ✅ |

### Coût total session

| Item | Coût |
|------|------|
| Jury Pass 1 + 2 (3 LLMs × 2) | $0.046 |
| ElevenLabs narration | ~$0.30 |
| Forced Alignment | ~$0.05 |
| Whisper | ~$0.02 |
| Minimax 3 musiques | ~$1.50 |
| PixelLab 26 jobs | $0 (forfait 2000/mois) |
| **TOTAL** | **~$2.00** |

### BEAT 0 HOOK — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat0Hook.tsx | ✅ validé Aziz v8 |
| AtlasGlobeHook dans _shared | ✅ composant réutilisable créé |
| Render final | `out/empire-ghana/beat0-v8.mp4` |
| Commit | bec3a4a |

### BEAT 1 SETUP — VALIDÉ (2026-05-03 session production v1→v5)

| Item | Statut |
|------|--------|
| Beat1Setup.tsx | ✅ validé Aziz v5 |
| Architecture | ✅ forkée Mansa Moussa V2 (SVG racine 720×1280, AtlasGlobe + AtlasMercator) |
| Données géo | ✅ OpenHistoricalMap relation 2822617 (23 vertices, ODbL) + POI Wikipedia exact |
| Identité visuelle | ✅ palette Ghana (parchemin/or/bordeaux), Cinzel, hachures duo or/bordeaux |
| Spotlight insert SEL ⇌ OR | ✅ 3e mode visuel signature inventé (background dim + assets PixelLab) |
| Sprite Koumbi Saleh sur carte | ✅ PixelLab map_object intégré |
| Cartouches en haut | ✅ règle TOP HALF respectée (bottom = sous-titres) |
| Zoom espace pivot Koumbi | ✅ vrai zoom continu vers Wagadou (pas centre canvas) |
| Render final | `out/empire-ghana/beat1-v6-final.mp4` (sprite Koumbi animé 4-frames + pulse + halo simultanés) |

### 5 Fichiers mémoire créés cette session
1. `feedback_atlas-non-negotiable-rules.md` — 13 règles absolues
2. `feedback_atlas-technique-vs-visuel.md` — séparation forker/adapter
3. `feedback_atlas-spotlight-insert-pattern.md` — pattern signature
4. `feedback_pixellab-objects-vs-characters.md` — recette gagnante
5. `feedback_atlas-cartouches-top-only.md` — règle position
+ `episodes/empire-ghana/BEAT-1-COMPLETE.md` (récap complet)

### 13 assets PixelLab catalogués (Beats 1-5)
- Beat 1 : `koumbi-saleh`, `seal-wagadou`, `sac-or`, `sac-sel`, `gold-ingot-stack`
- Beats 2-5 (pré-générés) : `mosquee-banco`, `caravane-chameau`, `stand-marche`, `balance-commerciale`, `guerrier-almoravide`, `ruines-banco`, `pieces-or-dinars`, `bloc-sel-mine`
- Tous dans `public/empire-ghana/assets/pixellab/`

---

### BEAT 2 DENSITY — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat2Density.tsx | ✅ validé Aziz v4 |
| Render final | `out/empire-ghana/beat2-v4.mp4` (21.7 MB, 786f) |
| 2 chameaux file indienne | ✅ walk cycle PixelLab SDK, spritesheet 4 frames |
| Mosquée supprimée | ✅ (sur-chargement carte) |
| Caravane au bon timing | ✅ mot "caravane" 44.02s → frame 1321 |

**Nouvelles règles apprises :**
- Max 3 sprites statiques simultanés sur carte (pas de 4e POI)
- File indienne = même trajectoire `getChameauPos()` + délai 50f sur le 2e — stagger temporel seul ne suffit pas
- SDK `animate_with_text` = fallback quand GIF PixelLab non téléchargeable via API (negative_description="" obligatoire, `.pil_image()` pas `.to_image()`)

### BEAT 3 SILENT BARTER — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat3Barter.tsx | ✅ validé Aziz v4 |
| Render final | `out/empire-ghana/beat3-v4.mp4` (22 MB, 690f) |
| Camera-track sprites CSS | ✅ helper `svgToCompWithCam` (projection coords SVG → composition selon caméra) |
| Zoom amplifié | walk 2.8x, crouch 3.2x (insert détail), dolly-out 2.4→1.0 |
| Marchands berbere + sahelien | ✅ walk south + crouch + walk north (pattern SilentBarterTestV3 porté) |
| Sacs au pied du sprite | ✅ drop points séparés du POI Koumbi |
| Balance PixelLab PNG | ✅ remplace Lottie SVG (plus visible) |
| Dolly-out final + empire pulse | ✅ OR_VIF fill direct + outline gold (3→11px) + routes glow néon |
| Cartouche "5 SIÈCLES" | ✅ apparaît pendant pull-back final |

### Prochaine scène = Beat 4 Effondrement (frames 2152→2788, ~21s)

**Brief prochaine session** : `memory/episodes/empire-ghana/NEXT-SESSION-beats-4-5.md` (starter prompt + pistes créatives + règles)

**Décision finale Beat 3** : pas d'insert plein écran. Le pattern marchands animés + camera-track + dolly-out raconte l'histoire complètement. Pattern réutilisable cross-épisodes.

### Skill atlas-video-preproduction activera automatiquement ce workflow

Au démarrage prochaine session, le skill `atlas-video-preproduction` charge SKILL.md + checklists pour cadrer la production. Voir `~/.claude/skills/atlas-video-preproduction/checklists/pre-flight-production.md`.

---

---

## DECISION SHAKA ZULU PAUSE (2026-05-03)

### Raisons
1. **Mismatch format/contenu** : Shaka raconte innovation militaire + psychologie + rituels = abstraction tactique + intériorité + culturel. Le format Atlas-carte est mal adapté pour ce type d'histoire (pas territoire/mouvement).
2. **Production en bagaille** : 9 scènes, dont 6 jamais visuellement validées avant audit 2026-05-03. Le concat audit révèle le manque de cohérence narrative.
3. **Pipeline Atlas pas encore mature** : on découvrait encore en route. Shaka aurait demandé 2-3 sessions ciblées de finition (6-12h) sans garantie de qualité.
4. **Format alternatif prouvé** : Sonjata Papercraft V7 (Seedance) = même profil narratif que Shaka. Si retour Shaka un jour, format naturel = Seedance Shorts, pas Atlas.
5. **Warm-up reseaux 3-4 jours** : opportunite de produire un Atlas qui *merite* la carte (Empire du Ghana) plutot que debugger Shaka.

### Ce qui est preserve (zero perte)
- **Composants reutilisables Atlas** : `_shared/` (AtlasMercator, AtlasGlobe, AtlasLabel, AtlasCaravane)
- **Composants Shaka specifiques** : Cornes/Iklwa/Bouclier inserts (reutilisables si Shaka revient)
- **Pipeline durci** : d3-geo + Natural Earth + walk cycle PixelLab + Lottie + LightLeaks
- **Audio narration-v5.mp3** : pret a reutiliser si reprise format Seedance
- **Script Shaka V5 LOCKED** : dans `memory/episodes/shaka-zulu/`
- **Forced alignment ElevenLabs** : `shaka-alignment.ts` + `timing.ts` pret
- **Audit visuel complet** : `out/shaka-audit/shaka-zulu-FULL-AUDIT.mp4` (2:26, ref pour reprise)
- **Branche git** : `feat/atlas-shaka-zulu-vague1` preserve tout

### Comment revenir sur Shaka
Si reprise un jour :
- **Option A** (recommandee) : convertir le script V5 LOCKED en Seedance Short style Sonjata Papercraft. Re-utiliser audio + alignment.
- **Option B** : reprendre Atlas après 2-3 episodes Atlas matures (Ghana, Hannibal, etc.). Avec un pipeline plus solide, Shaka pourrait marcher.

---

## NOUVEAUX OUTILS VALIDES SESSION 2026-05-03

### 1. `@remotion/lottie` via Claude (icones simples)
- Pattern require() obligatoire (pas fetch + delayRender)
- Format JSON canonique strict (validé via skill Wiggle)
- Capacites : couronne, lance, fleche-pulse, bouclier, croissant, etoile, cercles d'echo
- Limite : ~10 vertices bezier max, max 5 instances simultanees
- 3 JSON pret a reutiliser : `crown-pulse.json`, `iklwa.json`, `arrow-pulse.json`
- Refs memoire : `feedback_remotion-lottie-headless-broken.md` + `tools/lottie-claude-inventaire.md`

### 2. `@remotion/light-leaks` (atmosphere)
- Validé en mini-render (LightLeakTest)
- Usage : 8-10 frames bref, opacity cap 0.35, complement aux moments emotionnels
- Pas standalone

### Tests sources preserves
- `src/projects/atlas/shaka-zulu/tests/LottieTest.tsx`
- `src/projects/atlas/shaka-zulu/tests/LightLeakTest.tsx`
- 3 JSON Lottie : `crown-pulse.json`, `iklwa.json`, `arrow-pulse.json`
- Renders valides : `out/tests/lottie-3-icons.mp4`, `out/tests/light-leak-test-v2.mp4`, `out/tests/lottie-test-crown-v3.mp4`

---

## PROJETS PRETS POSTIZ (3 Shorts)

| Video | Statut | URL catbox |
|-------|--------|------------|
| Sonjata Papercraft V7 | PRET | https://files.catbox.moe/ynraip.mp4 |
| Thiaroye 1944 V5 | PRET | https://files.catbox.moe/jcn5p6.mp4 |
| Mansa Moussa Atlas V2 | PRET | https://files.catbox.moe/6xphlg.mp4 |
| Empire du Ghana | PRET | https://files.catbox.moe/hf6lqa.mp4 (4e Short, 120s) |

Fichiers locaux : `out/PRET-PUBLICATION/`

**Etat reseau** : warm-up 3-4 jours en cours. Publication attendue post-warm-up.

---

## PROJET EN COURS — EMPIRE DU GHANA (Atlas)

---

## ATLAS HANNIBAL — Etat fin session 2026-05-05

### Projet
**Sujet** : Hannibal Barca — traversée des Alpes, campagne Italie 218–202 av. J.-C.
**Branche** : `lab/hannibal-rpg-patterns`
**Statut** : Beat 1 validé. Beats 2-5 + Hook + CTA = à faire.

### BEAT 1 CONTEXT — VALIDÉ ✅

| Item | Statut |
|------|--------|
| `Beat1Context.tsx` | ✅ validé Aziz v10d |
| Architecture | ✅ 2 couches SVG+CSS (pattern standard Atlas désormais) |
| Zoom 2.8x sur Rome + Carthagène | ✅ focusOffsetForPOI(-100px) pour POI bord canvas |
| Timings Whisper word-level | ✅ calés sur `hannibal-alignment.json` |
| Render validé | `out/hannibal/beat1-v10d.mp4` + https://files.catbox.moe/szdc57.mp4 |

### `_shared/atlas-components.tsx` — enrichi cette session

| Export ajouté | Usage |
|---------------|-------|
| `svgToComp()` | Coords SVG → CSS avec zoom caméra |
| `focusOffsetForPOI()` | POI bord canvas → décalage focus automatique |
| `getSpriteAnimFrame()` | Walk cycle modulo depuis spritesheet |
| `getSpriteClipPath()` | ClipPath CSS pour frame spritesheet |
| `ATLAS_SVG_W/H`, `ATLAS_CX/CY`, `ATLAS_CSS_SCALE` | Constantes partagées |

**ATLAS-COMPOSANTS.md** mis à jour avec documentation complète + règle obligatoire de lecture avant tout nouveau beat.

### Prochaine session — Beat 2 (Rhône)

**STATUT 2026-05-05 FIN SESSION** : Approche Seedance semi-validée. Voir section ci-dessous.

---

## ATLAS HANNIBAL — Beat 2 Rhône — État 2026-05-05

### Décisions architecturales actées

| Approche | Statut | Raison |
|----------|--------|--------|
| Carte SVG macro + sprites CSS | ABANDONNÉE | Éléphants 3mm à 2.5x — illisibles. Rhône confondu avec la mer à cette échelle. |
| Insert plein écran Remotion (sprites sur background Gemini) | ABANDONNÉE | Sprites flottants, incompatibilité de perspective entre arrière-plan 3/4 et sprites side-view. |
| Seedance reference-to-video | SEMI-VALIDÉE | Test 5s concluant sur style + mise en scène. Prompt à retravailler pour Seedance. |

### Assets produits cette session

| Fichier | Description | Statut |
|---------|-------------|--------|
| `public/hannibal/assets/backgrounds/rhone-traversee.png` | Background pixel art Rhône (Gemini, 1080×1920) | ✅ |
| `public/hannibal/assets/backgrounds/rhone-frame0-composite.png` | Composite avec personnages (Gemini) — problème neige/glace | ⚠️ |
| `public/hannibal/assets/video-tests/beat2-r2v-test1.mp4` | Test Seedance reference-to-video 5s | ✅ semi-validé |
| `public/hannibal/assets/video-tests/beat2-r2v-test1.prompt.txt` | Prompt utilisé pour le test | ✅ |

### Résultats test beat2-r2v-test1.mp4

**Réussis :**
- Style pixel art 16-bit parfaitement préservé
- Hannibal rive gauche, pieds sur le sol, bras croisés, tourne la tête
- Éléphant sur radeau au milieu du fleuve, dérive vers la droite
- 2 Volques sur falaise droite, lèvent les lances à l'arrivée du radeau
- Eau animée

**Problèmes :**
- Animation éléphant quasi-statique
- Radeau arrive sur rive plutôt que sortir du cadre
- Background/ciel statique

**Verdict Aziz** : semi-validation — bonne base, prompt pas conçu pour Seedance dès le départ

### Prochaine session — objectifs Beat 2

1. Recherche approfondie technique storyboard Seedance (Last30Days sur storyboard + reference-to-video multi-panels)
2. Tester storyboard 3-4 frames pour Beat 2 avec mise en scène conçue pour Seedance
3. Si storyboard validé : clip 10-15s Beat 2 complet
4. Prompt doit être conçu pour Seedance dès le départ (sortie de cadre, animation continue, ciel animé)

---

### Plan beats restants

| Beat | Sujet | Pattern principal | Difficulté R&D |
|------|-------|------------------|---------------|
| Beat 2 | Rhône — éléphants radeau | camera-track rivière | Faible (pattern connu) |
| Beat 3 | Alpes — neige, col, froid | PixelLab montagne + walk Hannibal | Moyenne |
| Beat 4 | Pertes 46k→20k soldats | StatGauge (déjà dans _shared/) | Très faible |
| Beat 5 | 37 éléphants disparaissent | Grille SVG + fadeOut progressif | Moyenne |
| Hook | Fond noir + carte Méditerranée | AtlasGlobeHook adapté | Faible |
| CTA | Call to action chaine | Pattern Empire Ghana Beat 6 | Très faible |

---

### Pourquoi
Aziz a choisi (2026-05-03) parmi liste figures Atlas-natives :
- **Ghana** = Top 2 ranking. Avantage : peu connu = curiosite forte = potentiel viral
- **Hannibal** = vidéo de test technique — pousse les limites Atlas RPG+HUD
- Format Atlas natif : routes commerciales trans-sahariennes = territoire + mouvement

### Contraintes Aziz pour cet episode (et tous Atlas futurs)
**RYTHME RAPIDE OBLIGATOIRE** :
- Format viral YouTube/TikTok/Instagram
- Pas d'encyclopedie / cours d'histoire
- Mouvements de camera frequents
- Beaucoup de faits qui apparaissent
- Jamais statique
- Si on n'a pas quoi mettre sur la carte, c'est mauvais signe

### Etat actuel
- **Recherche/script** : a faire
- **Audio** : a generer apres script LOCKED
- **Visuels** : pipeline Atlas mature, prêt
- **Outils dispo** : d3-geo, AtlasMercator, walk cycle PixelLab, Lottie via Claude, LightLeaks, Gemini, ElevenLabs

### Prochaine action
1. Recherche brève Empire du Ghana (figures, dates, angles narratifs)
2. Proposition d'angle (rythmique, non-encyclopedique)
3. Si valide par Aziz : script V1 selon `memory/templates/script-atlas-v1.md`

---

## STRUCTURE WORKSPACE (post-cleanup 2026-05-03)

```
src/projects/
  atlas/
    _shared/          ← composants reutilisables Atlas
    mansa-moussa/     ← V2 PRET PUBLICATION
    shaka-zulu/       ← PAUSE (preserve, branche feat/atlas-shaka-zulu-vague1)
      tests/          ← LightLeakTest + LottieTest (réutilisables)
    _archive/         ← projets anciens
  geoafrique-shorts/
  ...

out/
  PRET-PUBLICATION/   ← 3 MP4 finals (Mansa Moussa, Thiaroye, Sonjata)
  shaka-audit/        ← shaka-zulu-FULL-AUDIT.mp4 (ref pause)
  tests/              ← lottie-3-icons, lottie-test-crown-v3, light-leak-test-v2
```

---

## PROJETS EN ATTENTE (rappel)

### THIAROYE V5
- STATUT : RENDU FINAL SUR VERCEL. Pret publication Postiz.

### SONJATA V7
- STATUT : RENDU FINAL VALIDE. Pret publication Postiz. Duration 166s.

### ABOU BAKARI II
- STATUT 2026-04-29 : TOUS CLIPS GENERES manuellement. Reste assemblage Remotion + render final.
- Dashboard : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-6LXCXjaaPNMOJyWMynqk8dc11JGfy5.html

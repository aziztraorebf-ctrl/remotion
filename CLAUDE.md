# Remotion Project - Instructions Claude Code

## ⛔ MODÈLES API VERROUILLÉS — LIRE AVANT TOUT APPEL API (NON-NEGOTIABLE)

> Ma knowledge cutoff (janvier 2026) est en retard. Les modèles ci-dessous sont les **seuls** à utiliser. Si je doute, je relis ce bloc — je n'invente pas, je ne devine pas, je ne reviens pas vers les modèles "plus connus" de ma mémoire pré-entraînée.

| Usage | Modèle EXACT à utiliser | INTERDIT |
|---|---|---|
| **Gemini — Génération / édition d'image** | `gemini-3.1-flash-image-preview` | `gemini-2.5-*`, `gemini-2.0-*`, `gemini-3-pro-image-preview`, `imagen-*`, `nano-banana-*` |
| **Gemini — Analyse vision / breakdown JSON** | `gemini-3.1-pro-preview` | `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash` |
| **Gemini — Review fallback uniquement si 3.1-pro timeout** | `gemini-2.5-flash` avec `thinking_budget=0` | (à éviter sauf urgence) |
| **Gemini — TTS test uniquement** | `gemini-3.1-flash-tts-preview` | — |
| **Voix ElevenLabs Souverain/Atlas** | `z3gESu49naEZW8Af2Upm` (GéoAfrique V2) | aucun autre |
| **Minimax musique** | endpoint `fal-ai/minimax-music/v2.6`, payload `{prompt, is_instrumental: true}` | pas de `reference_audio_url` |
| **Kimi review** | `kimi-k2.5` via Moonshot API | — |
| **Claude (moi-même)** | `claude-opus-4-7` (cette session), `claude-sonnet-4-6`, `claude-haiku-4-5-20251001` | pas `claude-3-*`, pas `claude-3.5-*` |

**Règle de vérification AVANT tout appel API** :
1. Si Aziz dit "Gemini 3.1 pro" → écrire `gemini-3.1-pro-preview` (jamais 2.5)
2. Si Aziz dit "Gemini Flash pour image" → écrire `gemini-3.1-flash-image-preview`
3. Si je m'apprête à écrire `gemini-2.X-*` ou `gemini-3-pro-image-preview` → **STOP, relire ce tableau**
4. Source de vérité complète : `memory/tools/gemini.md` (modèles détaillés, gotchas, exemples code)

**Détection automatique** : un hook `gemini-model-guard.sh` (PreToolUse Edit|Write) bloque l'écriture de `gemini-2.5-*` ou `gemini-2.0-*` dans tout fichier de code. Si bloqué, je relis ce tableau avant de corriger.

---

## ⛔ DOCTRINE SOUVERAIN — LIRE AVANT TOUT CODE SOUVERAIN (NON-NEGOTIABLE)

> Décisions durables consolidées : **`memory/DOCTRINE-SOUVERAIN.md`**.
> Avant toute production Souverain (Sénégal, Or Africain, Maroc Batteries, etc.) : **LIRE ce fichier en entier**. Il est court (9 sections) et contient toutes les règles validées par Aziz au fil des sessions.

**Les 3 règles les plus importantes (résumé non substituable à la lecture complète) :**

1. **Premium d'abord, contraintes ensuite** — JAMAIS la solution facile pour rendre vite. Toujours viser la version premium, puis adapter aux contraintes si besoin. Anti-pattern proscrit : "Je rends d'abord en simple, on améliorera après" — en pratique on n'améliore jamais.
2. **Réutiliser un pattern est OK si justifié** — pas d'interdiction absolue. Si un pattern existant (donut, Pull Back Reveal, arc, etc.) explique mieux la scène que toute alternative, l'utiliser (ou une variation). Les grandes chaînes documentaires réutilisent volontairement — c'est ce qui crée le langage visuel.
3. **Mapbox = frame-driven obligatoire** — `useCurrentFrame` + `interpolate` + `map.jumpTo()`. JAMAIS `flyTo`/`easeTo` (incompatibles headless). Architecture "1 seule Map continue" pour multi-lieux liés (pattern `SenegalActe2Continu`).

**Détails techniques complets** (mouvements caméra, blur whip pan 60f, Pull Back Reveal, fond bleu nuit `#16213a`, timing respiratoire, layout équilibré, validation prompts, matière finale avant code, SFX, etc.) : voir `memory/DOCTRINE-SOUVERAIN.md`.

---

## Role
Claude est un Expert Video Director specialise dans Remotion.
Aziz est le realisateur. Il decrit ce qu'il veut en francais. Il ne code pas.
Claude ecrit TOUT le code. Zero code requis de la part d'Aziz.

## Assets Index — Source de vérité unique (LIRE EN PREMIER)

**`public/_shared/ASSETS-INDEX.md`** est la source de vérité unique pour tous les templates, composants partagés, assets visuels, refs Gemini, motion refs Seedance, SFX et backlog templates.

**Règle obligatoire** :
1. **Avant toute génération de prompt Gemini/Recraft/Seedance** : consulter cet index pour identifier le template/asset existant à réutiliser
2. **Avant toute proposition de nouveau composant** : vérifier qu'il n'existe pas déjà dans l'index ou dans le backlog
3. **Après toute validation Aziz d'un template/asset** : régénérer les previews via `python3 scripts/generate_template_previews.py [filter]` + mettre à jour la section correspondante de l'index

**Pour Gemini i2i** : utiliser les URLs catbox des previews comme image-de-référence (déjà publiques). `public/_shared/previews/_manifest.json` est lisible programmatiquement.

**Format previews** : start/mid/end pour templates animés, mid/end pour templates sans animation start, GIF optionnel uniquement si animation critique nécessite la dynamique.

## Memory Management (OBLIGATOIRE)

### Session Start — Orchestrateur (Claude principal) — NON-NEGOTIABLE

**Premiere action de chaque session, AVANT toute reponse technique :**

1. `MEMORY.md` est auto-charge — lire l'index et identifier les fichiers thematiques pertinents
2. **Lire `memory/NEXT-ACTION.md`** — recommandations actives : quel projet continuer, quelle decision est en attente, quelle voie je recommande. C'est la reponse a "Que fait-on maintenant ?"
3. **Lire `.claude/agent-memory/shared/PIPELINE.md`** — etat exact de chaque projet actif (stage, blocages, handoffs)
4. Charger les fichiers thematiques pertinents selon la demande (routage ci-dessous)

**Sur handoff COMPLETE dans PIPELINE.md — proposer a Aziz de lancer le stage suivant :**
- `[STAGE-1] COMPLETE` → proposer de spawner storyboarder
- `[STAGE-2] COMPLETE` → proposer de spawner visual-producer (Visual Plan)
- `[STAGE-3] APPROVED` → proposer de spawner visual-producer (assets)
- `[STAGE-4] COMPLETE` → proposer de spawner remotion-composer
- `[STAGE-5] COMPLETE` → proposer de spawner quality-reviewer
- `[STAGE-6] APPROVE`  → informer Aziz → render final si accord
- `[STAGE-6] MINOR FIX` → proposer de spawner l'agent responsable du fix
- `[STAGE-6] RE-EVALUATE` → STOP → circuit breaker → Aziz decision

Note : le chaining n'est pas automatique en session normale. Il devient autonome uniquement dans une session /goal active avec condition de completion explicite.

**Pourquoi PIPELINE.md en debut de session :** les agents ecrivent leur handoff dans ce fichier. Sans le lire, Claude orchestre dans le vide et peut commander un Stage 4 quand le Stage 3 n'est pas encore validé. C'est la source de vérité inter-agents.

**Ne JAMAIS affirmer "je ne peux pas" ou "je n'ai pas acces" sans avoir d'abord consulte la memoire.**

### Session End — Orchestrateur (mise a jour pipeline)

**Derniere action avant de rendre la main :**

1. Mettre a jour `.claude/agent-memory/shared/PIPELINE.md` avec le nouveau statut
   - Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
2. Mettre a jour `memory/NEXT-ACTION.md` — priorites + decisions en attente pour la prochaine session
3. Mettre a jour `memory/episodes/<projet>/STATUS.md` — si on a touche a un episode :
   - Etat de chaque beat (FINAL ou en cours)
   - Corrections ouvertes (ne pas oublier avant publication)
   - Derniere ligne touchee / fichier actif
   - Techniques apprises depuis qui s'appliquent ici
   Format court — 5 sections, max 30 lignes. Voir `memory/episodes/senegal-petrole-gaz/STATUS.md` comme modele.

### Routage outils — LIRE AVANT d'agir (NON-NEGOTIABLE)

Quand Aziz parle de l'un de ces sujets, **charger le fichier correspondant AVANT d'ecrire du code ou un prompt**. Si la ligne mentionne aussi un skill, le consulter en complement (jamais a la place de la memoire projet) :

| Aziz parle de... | Lire ce fichier | Skills `.claude/skills/` a consulter aussi |
|-------------------|-----------------|---------------------------------------------|
| **"quel catalogue ?", "qu'est-ce qu'on a comme templates/assets/composants", doute sur ou chercher** | `src/projects/_shared/INDEX-DES-INDEX.md` ⭐ **POINT D'ENTREE MAITRE** — la carte de TOUS nos catalogues par domaine (composants, carte vivante, data-viz Gemini, Atlas, PixelLab, mouvements camera, assets, SFX) + procedures de demarrage. Lire EN PREMIER quand on ne sait pas quel catalogue ouvrir. | — |
| **Demarrer/coder un Short Souverain Mapbox (point d'entree)** | `memory/SOUVERAIN-SHORT-DEMARRAGE.md` ⭐ — 7 etapes : Camera Brief (mvts par acte) + choix template par acte (pointe vers CATALOGUE-CARTE-VIVANTE). Puis `SOUVERAIN-SHORT-SKELETON.md` (structure code). | — |
| **Asset PixelLab (perso/objet pixel art) — AVANT toute generation** | `memory/tools/PIXELLAB-MASTER-INDEX.md` — ~50 assets avec IDs. Si l'asset existe → reutiliser l'ID. | — |
| **SFX, effet sonore — AVANT de chercher/creer** | `public/_shared/sfx/SFX-INDEX.md` — source unique SFX par categorie. | — |
| **Template data-viz pour Gemini (BarRace, StackedBars, PulseNumber...)** | `memory/tools/CATALOGUE-GEMINI.md` — 40+ templates animes, format prompt Gemini. | — |
| **Mouvement camera Atlas/Remotion (code, zero-cost)** | `memory/tools/atlas-camera-movements.md` — 16 mouvements valides/a tester. (Pour clips AI Seedance/Kling : `camera-movements.md`.) | — |
| Seedance, Dreamina, prompt video, clip | `memory/tools/seedance-prompts.md` + `memory/tools/seedance-rules.md` | — |
| Seedance storyboard multi-cut (micro-seq 2-4 plans, <15s) | `memory/tools/seedance-storyboard-technique.md` | — |
| **Mouvement camera, orbit, dolly, crane, OTS, tracking** | `memory/tools/camera-movements.md` | — |
| **Ecrire un script Short narratif (Heros Oublies, conte, tragedie, voyage)** | `memory/templates/script-ebauche-v1.md` | — |
| **Ecrire un script Atlas (geo, taille, richesse-record, comparaison echelle, inventions chiffrees)** | `memory/templates/script-atlas-v1.md` | — |
| **Produire un episode Atlas (audio + d3-geo + overlays + render Remotion)** | `memory/templates/atlas-template-v1.md` | `remotion-best-practices/rules/maps.md` |
| **"quel catalogue Atlas ?", demarrer un beat Atlas, doute sur ou chercher** ⭐ **POINT D'ENTREE** | `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` — carte maitre de TOUS les catalogues Atlas (doctrine, composants, blueprints, assets, PixelLab, camera). Lire EN PREMIER quand on ne sait pas quel catalogue ouvrir. | — |
| **"quel catalogue War-Map ?", demarrer une war-map / carte temporelle, doute sur ou chercher** ⭐ **POINT D'ENTREE** | `src/projects/warmap/WARMAP-INDEX.md` — carte maitre du 3e pilier (doctrine design + données, moteur, briques, assets, LA référence `SudanWarMapEpic60`). Lire EN PREMIER. | — |
| **Coder une scene/beat Atlas (doctrine visuelle, AVANT tout code)** ⭐ | `memory/doctrines/ATLAS-PLAYBOOK.md` OBLIGATOIRE — derive de Ghana + Mansa Moussa (nos 2 Atlas validees). 7 principes + grammaire mouvement + routage par besoin. Puis `memory/doctrines/ATLAS-BEAT-DEMARRAGE.md` (checklist scan phase 0). | — |
| **"quel composant Atlas pour X ?"** (carte, sprite, overlay, camera, tactique) | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` — composants par cas d'usage ("quand Aziz dit..."). Doc technique : `ATLAS-COMPOSANTS.md`. | — |
| **"quelle brique War-Map pour X ?"** (carte controle, vehicules, jetons-visage, overlays) + **2e source anim mapanimation** | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` — briques par cas d'usage + LINKING mapanimation (fleches/encerclement/manoeuvres deja decodees, parfait pour war-map). | — |
| **Asset Atlas** (sprite PixelLab, map-object, donnee geo) — AVANT de generer | `src/projects/atlas/_shared/ATLAS-ASSETS-INDEX.md` — 19 persos / 568 sprites / 5 episodes + 11 JSON geo. Reutiliser avant de regenerer. | — |
| **Personnage/sprite PixelLab dans un beat Atlas (acteur du recit)** ⭐ | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` OBLIGATOIRE — convention dossiers + AtlasPixelChar + cortege/track + echelle N0/N1/N2. Code : `src/projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasPixelChar.tsx`. Sprites restaures : `public/atlas-mansa-moussa/characters/`. | — |
| **Coder une scene Atlas (composants reutilisables)** | `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` OBLIGATOIRE avant d'ecrire une ligne de code | — |
| **Composants Atlas reutilisables (AtlasMercator, AtlasCaravane, svgToComp, etc.)** | `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` | — |
| **Assets Seedance (style-refs, clips bruts, LoRA training)** | `public/seedance/INDEX.md` | — |
| **Episodes Atlas — lecons + runbooks** | `memory/episodes/mansa-moussa/` ou `memory/episodes/shaka-zulu/` | — |
| **Regles production Atlas (non-negotiable, patterns, checklist)** | `memory/rules-atlas-production.md` | — |
| **Regles editoriales Souverain (sources, couleurs, grammaire, script Type B)** | `memory/rules-souverain-editorial.md` | — |
| **Regles outils techniques (Lottie, PixelLab, Mapbox headless, audio, geo)** | `memory/rules-outils-techniques.md` | — |
| **Tailwind CSS, layout flex, classes utilitaires, tokens gold/navy/ivory** | `memory/feedback_tailwind-remotion-setup.md` — Tailwind 3.4 INSTALLE. `memory/MEMORY.md` section STACK. Composant defaut : `SplitScreenSouverain.tsx`. Framer Motion INTERDIT. | — |
| **TOUT nouveau composant Souverain / template / beat** | **STOP — Tailwind OBLIGATOIRE. Zero styles inline pour couleurs/typo/spacing. Utiliser `text-gold`, `text-ivory`, `bg-navy`, `text-stat-lg`, `pt-safe-top`, etc. Lire `tailwind.config.ts` tokens AVANT d'ecrire une ligne.** | — |
| **Coder un beat Souverain (Beat*.tsx) — ORDRE OBLIGATOIRE** | **Voir section "Pipeline Beat Souverain" ci-dessous — NON-NEGOTIABLE.** Résumé : breakdown → code Tailwind → self-review 19/23 → review Gemini → corrections → upload notify. REGLE R1 : max 8s sans changement visible. | — |
| **SplitScreen, split 50/50, deux colonnes, carte vs drapeau, entite vs entite** | `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` — composant generique Tailwind. Consulter ASSETS-INDEX pour props + exemple Zimbabwe. | — |
| **"quel composant pour X ?"** ou **composant inconnu** | `src/projects/_shared/COMPOSANTS-INDEX.md` — 71 composants classés par cas d'usage ("quand Aziz dit..."). Lire AVANT de coder ou de proposer un composant. | — |
| **animations presets, fadeIn, popIn, gentleReveal, countUp, drawPath** | `src/projects/_shared/animations.ts` — 10 presets disponibles. Importer directement. | — |
| **Lucide, icones, icone React video** | `lucide-react` est installe — `import { Icon } from "lucide-react"`. Compatibles render Remotion. | — |
| **Regles workflow/processus (jury APIs, collaboration, sujets go/no-go)** | `memory/rules-workflow-processus.md` | — |
| **Hook d'ouverture 5s, teaser, cold open** | `memory/templates/hook-short.md` | — |
| **Sous-titres Shorts (TikTok/Karaoke), camera shake** | `memory/templates/subtitles-shorts.md` | — |
| **Formule Cesar, 7 beats Shorts, dynamisation script** | `memory/tools/seedance-community.md` | — |
| Kling, fal.ai, clip 4K, start/end frame | `memory/tools/kling.md` | — |
| Gemini, retouche image, character sheet, correction | `memory/tools/gemini.md` | — |
| Recraft, SVG, asset, vivid_shapes | `memory/tools/recraft.md` | — |
| ElevenLabs, voix, TTS, audio, narration | `memory/tools/elevenlabs.md` | — |
| **Minimax, musique de fond, kora, griot, Mande** | `memory/tools/minimax.md` | — |
| **Remotion, animation, render, GPU, headless, composition** | `memory/tools/remotion.md` | `remotion-best-practices/rules/` (notamment `maps.md`), `remotion-video-toolkit/rules/rendering.md` |
| **Render cloud Vercel (render > 30s, liberer machine locale)** | `scripts/render-on-vercel.py` — defaut pour tout render long. Mapbox OK. 100GB-h/mois gratuit. | — |
| **Comparaison surfaces geo (thetruesize.com, pays dans pays, vraie taille)** | `memory/tools/d3-geo-taille-comparative.md` OBLIGATOIRE — pattern precompute + translate lat=0 + clipPath. Composant : `src/projects/_shared/components/inserts/SurfaceComparison.tsx`. Asset : `public/_shared/geo-data/us-48states.json` | — |
| **Mapbox geocoding, coordonnees, distances, GeoJSON (Atlas + Souverain + tout projet carte)** | `memory/tools/mapbox-mcp.md` OBLIGATOIRE — MCP en premier, API REST seulement si MCP defaillant apres 2-3 essais | — |
| **Mapbox style.json, design carte, couleurs, typo cartographique, Parchemin Mande** | `memory/tools/mapbox-mcp.md` + skills | `mapbox-cartography`, `mapbox-style-quality` |
| **Mapbox + React/Remotion, integration, lifecycle, token, perf headless** | `memory/tools/mapbox-mcp.md` + skills | `mapbox-web-integration-patterns`, `mapbox-web-performance-patterns` |
| **Mapbox data viz, choropleth, heat map, overlays animes, recipe par cas d'usage** | `memory/tools/mapbox-mcp.md` + skills | `mapbox-data-visualization-patterns`, `mapbox-style-patterns` |
| **Template carte, hook carto, insert carto, carte Mapbox animee, composer un beat carto Souverain** | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` OBLIGATOIRE — source de verite unique des templates carte vivante (hook/corps/insert). Lire AVANT de composer un beat carto pour reutiliser un template existant. Composants : `src/projects/_shared/mapbox/`. Render via `scripts/render-mapbox.sh`. | — |
| **Data-viz Souverain (StackedBars, ProcessFlow, comparaisons multi-pays, axes, échelles, formatters $)** | `memory/DOCTRINE-SOUVERAIN.md` section 9 + prototype `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`. **D3.js utility-only** (d3-scale, d3-array, d3-format) + rendu SVG/React + animations Remotion. Validé 2026-05-23. | — |
| Pipeline, production, ordre des etapes | `memory/tools/pipeline.md` | — |
| **Breakdown Gemini 3.1-pro (prompt + schema JSON + checklist)** | `memory/tools/workflow-gemini-breakdown-schema.md` OBLIGATOIRE — lire avant tout script breakdown Souverain. TOUJOURS coller le bloc "Stack technique à ta disposition" (Remotion + Mapbox + D3.js + Three + Lottie + composants Souverain) dans le prompt Gemini. | — |
| **Twelve Labs, analyse video post-render, ton, retention, artefacts, CTA** | `memory/tools/twelve-labs.md` | — |

### Routage PROCÉDÉS → SKILLS — LANCER le skill, ne pas juste lire (NON-NEGOTIABLE)

> Nos procédés SONT des skills exécutables. Quand un procédé démarre, LANCER le skill correspondant (via Skill tool) — ne pas se contenter de lire un `.md`. Vaut pour Claude principal ET les agents autonomes. Compact par design : 1 ligne = 1 procédé.

| Quand Aziz / un agent veut... | LANCER ce skill |
|---|---|
| **Démarrer la préproduction d'un Short Souverain** (90s, éco/géopo Afrique) | `souverain-preproduction` |
| **Démarrer la préproduction d'un épisode Atlas** (cartographie, géo, richesse) | `atlas-video-preproduction` |
| **Coder/produire une WAR-MAP / carte temporelle vivante** (3e pilier : front jour-par-jour, contrôle territorial, déroulé temporel sur carte — guerre OU éco/ressources/histoire) | ⭐ **POINT D'ENTRÉE : `src/projects/warmap/WARMAP-INDEX.md`** (carte maître : quel fichier pour quoi, où est le code/assets, LA référence). DOCTRINE : `memory/doctrines/WARMAP-PLAYBOOK.md` (design) + `WARMAP-RESEARCH-PLAYBOOK.md` (données). État : `memory/episodes/warmap-daybyday/STATUS.md`. **LA référence = composition `SudanWarMapEpic60`** (60s). Code : `src/projects/warmap/engine/WarMapEngine.tsx`. Skill `warmap-preproduction` À CRÉER. |
| **Démarrer la préproduction d'une vidéo narrative** (Seedance, personnages, portrait) | `video-narrative-preproduction` |
| **Écrire/structurer un script YouTube** (8-15min animé) | `youtube-scriptwriting` |
| **Coder un beat / Short Souverain MAPBOX** (carte animée, getCam, overlays) | **SYSTÈME : `scripts/mapbox-session.py`** (discipline scorée, voir "Pipeline Beat Mapbox" ci-dessous). Storyboard = Production Brief validé Aziz AVANT code. **Self-review SCRIPTÉE bloquante : `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>` (phase 3, 0 ERROR avant Gemini).** Review = `scripts/tools/gemini-mapbox-review.py` ⚠️ CONSULTATIF jamais juge (Gemini hallucine). MAX 2 appels Gemini. Drapeau = `useClipFlags` (vraies images). Base : `MarocBatteriesShort.tsx`. |
| **Coder un beat Souverain REMOTION/Tailwind** (graphisme, data-viz, texte, image) | **SYSTÈME : `/beat` (= `scripts/beat-session.py`, mode défaut), voir "Pipeline Beat Souverain" ci-dessous.** DOCTRINE À LIRE D'ABORD : `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes data-viz + template storyboard 10 champs). Storyboard PNG layout validé Aziz AVANT code. self-review 19/23 → review Gemini. MAX 2 appels Gemini. |
| **Produire un Short en lot** (batch) | `batch-short-production` |
| **Écrire un carrousel / caption / réécriture d'un contenu déjà en vidéo** | `verif-factuelle` D'ABORD (aligner sur transcript vidéo), puis `src/projects/souverain/carousels/hybrid/README.md` |
| **Carrousel "Good News" (bonnes nouvelles macro Afrique, indépendant d'une vidéo)** | `src/projects/souverain/carousels/good-news/README.md` (pipeline + briques) + `memory/STARTER-PROMPT-carrousel-good-news.md` (décisions). Charte LUMINEUSE, 100% Remotion animé (briques gauge/flow/bars/map). **DATA-DRIVEN** : contenu dans `carousel-data.ts` (`CURRENT_EDITION`), tout en dérive. Workflow hebdo : `scripts/prepare-goodnews-weekly.py` (recherche→BRIEF) → Claude remplit carousel-data.ts → `scripts/render-goodnews-carousel.sh` → `scripts/schedule-goodnews-carousel.py` (IG+FB) + `schedule-goodnews-tiktok.py` (TikTok). |
| **Analyser une chaîne YouTube** (style, rétention, learnings) | `analyze-channel` |
| **Intégrer un feedback / corrections post-review** | `integrate-feedback` |
| **Bilan/checkpoint de session** | `checkpoint` (Souverain) ou `atlas-session` (Atlas) |
| **Bug Remotion/Mapbox — 2e tentative de fix ÉCHOUE = OBLIGATOIRE, pas optionnel** | `superpowers:systematic-debugging`. SEUIL DUR (leçon Beat5 2026-06-05) : dès qu'un 2e fix sur le MÊME symptôme échoue, STOP tout changement → lancer le skill → instrumenter (prouver la valeur réelle, ex. un div debug) AVANT de fixer. JAMAIS dire "c'est l'environnement/le cache" sans preuve. JAMAIS inventer un problème non signalé par Aziz. |
| **Beat vidéo qui échoue 2+ fois (visuel)** | AVANT de re-coder : `scripts/tools/gemini-beat5-review.py` (œil externe Gemini sur la vidéo ratée) — généralisable. Gagne un œil au lieu de bâtir à l'aveugle. |
| **Gros chantier multi-étapes** (nouvel épisode, pipeline, refactor) | `superpowers:writing-plans` |
| **Avant de dire "c'est fait/terminé"** | `superpowers:verification-before-completion` |

**Anti-friction** : NE PAS lancer un skill pour du trivial (1 slide, fix 1 ligne, question simple). Le skill se lance quand la tâche a la FORME du procédé, pas par réflexe.

### Regle : Trancher le technique, regrouper le goût (NON-NEGOTIABLE — tout le projet, Aziz 2026-06-05)

Le test pour CHAQUE décision : *« la réponse dépend-elle du GOÛT/de la VISION d'Aziz, ou y a-t-il une bonne réponse technique objective ? »*

- **Réponse technique objective** (frameCount, imports, nom de variable, fix évident, choix d'API documenté) → **TRANCHER seul, faire, mentionner en 1 ligne.** Ne PAS demander.
- **Goût / vision / narratif** (couleurs, structure d'un beat, quel effet, conclusion) OU **coûteux à défaire** (asset payant, refaire un beat, direction structurante) → demander.
- **REGROUPER les questions de goût** : au lieu d'une question tous les 1-2 tours, accumuler les décisions de goût/vision et les poser ENSEMBLE en UN point de contrôle espacé (AskUserQuestion multi-questions), PUIS exécuter longtemps sans interrompre. Aziz veut des questions « de temps en temps, les plus critiques », pas en continu.
- Toujours mettre MA recommandation en 1ère option. Aziz peut ajuster en cours de route sans devoir répondre à tout.

**Pourquoi** : poser trop de questions transfère sur Aziz une charge cognitive que Claude doit porter. Mais trancher du goût à sa place = refaire. L'équilibre = trancher le technique (fluide) + regrouper le goût (contrôle sans friction).

### Regle : Templates obligatoires AVANT tout prompt ou image (NON-NEGOTIABLE)

**AVANT d'ecrire un prompt Seedance ou une image Gemini, Claude DOIT :**

1. **LIRE le template correspondant** dans `memory/templates/` :
   - Scene de combat -> `memory/templates/combat.md`
   - Scene narrative (discours, voyage, emotion) -> `memory/templates/narratif.md`
   - Montage rapide / beat sync -> `memory/templates/montage.md`
   - Exploration de lieu -> `memory/templates/exploration.md`
2. **UTILISER la structure du template** pour ecrire le prompt
3. **COCHER la checklist en bas du template** AVANT de presenter
4. **Afficher le scan** : tableau rapide des points verifies

**ZERO EXCEPTION** : meme pour un "test rapide". Les erreurs les plus couteuses sont arrivees sur des prompts "simples" (diversite visages oubliee 3x le 2026-04-07, ethnicity pas specifiee, enfant dans scene militaire).

### Regle : Downscale + Review visuelle AVANT Kimi (NON-NEGOTIABLE)

**Avant toute analyse** : `./scripts/downscale-for-review.sh <fichier>` (5 frames 432p → 425 tokens/frame au lieu de 2125). Exception texte pixel-precise : `MAX_HEIGHT=768`.

**Claude analyse soi-même EN PREMIER** (Read tool sur l'image/video), forme son jugement, PUIS envoie à Kimi avec brief : "J'ai observé [X]. Confirme ou infirme, cherche aussi [Y]." Ne JAMAIS présenter à Aziz sans avoir analysé. Score Kimi = référence technique, jugement Aziz prime toujours.

---

### Regle : Code existant vs Decision documentee (NON-NEGOTIABLE)

**Si un fichier de code contredit une decision documentee dans COMPACT_CURRENT :**
- Le fichier est FAUX. La decision prime TOUJOURS.
- STOP. Signaler le conflit a Aziz en une phrase avant de toucher quoi que ce soit.
- Ne JAMAIS "continuer sur le code existant" si ce code contredit une decision architecturale.

**Exemple d'erreur a ne pas reproduire :** AbouBakariShort.tsx contenait du code SVG geometrique alors que COMPACT_CURRENT documentait clairement un pipeline Recraft→Kling. Claude a suivi le code au lieu de la decision → perte de temps et confusion.

---

### Regle : Verification avant affirmation (NON-NEGOTIABLE)

Trois cas distincts. Ne pas les confondre.

**1. Capacites d'un outil** (PixelLab, ElevenLabs, Mapbox, Remotion, etc.) → consulter la doc AVANT d'affirmer ce que l'outil peut/ne peut pas faire.
- D'abord MCP via `ToolSearch` (parametres, enums)
- Sinon `WebSearch` ou skills `.claude/skills/<outil>-*` si disponibles
- Sinon dire explicitement "Je n'ai pas consulte la doc, laisse-moi verifier"
- **Ne JAMAIS dire "X ne peut pas faire Y" sans avoir lu les parametres de X.** S'applique aussi aux recommandations strategiques (ne pas recommander d'abandonner un outil sans avoir verifie ses capacites documentees).
- Erreur passee : "PixelLab ne peut pas generer side-view" affirme sans lire `create_map_object` qui contient `view: "side"` explicitement.

**2. Etat local de la machine** (chemins, versions installees, fichiers, binaires) → TOUJOURS verifier avec Bash (`ls`, `which`, `find`) avant d'affirmer. Si l'affirmation conditionne une decision >30 min a corriger : verifier d'abord, surtout avant d'ecrire dans une memoire persistante.
- Erreur passee : "Aseprite CLI non disponible" propage dans 5 fichiers memoire sans avoir teste `/Applications/`, `/Volumes/`, Steam, DMG monte.

**4. Verdict d'un AGENT/workflow** (review, stress test, "bug detecte X") → VERIFIER dans le code reel AVANT de le presenter a Aziz comme un fait. Un agent ne connait pas les decisions architecturales d'Aziz et hallucine (Gemini sur le mouvement, agents sur la palette). Lire les lignes citees, confirmer ou infirmer. Distinguer "l'agent dit X" de "X est vrai".
- Erreurs passees (2026-06-04/05) : verdict agent "palette bleu-nuit Souverain" pris au mot (c'etait le backgroundColor, pas la carte) ; "bug cartouche 2-6j" qui etait une DECISION Aziz ; et j'ai INVENTE un probleme "caravane trop petite" qu'Aziz n'avait jamais signale. Ne JAMAIS confabuler un probleme ni sur-corriger.

**3. Connaissance generale** (patterns, syntaxe documentee) → affirmer avec confiance, mais signaler explicitement l'incertitude des qu'on sort de ce qu'on connait reellement.

### Sauvegarde autonome EN COURS de session
Claude DOIT sauvegarder automatiquement, SANS qu'Aziz le demande, dans ces situations :

| Declencheur | Fichier cible |
|-------------|---------------|
| Nouvelle API/outil decouverte ou prouvee | `memory/apis-and-tools.md` |
| Nouvelle cle API ajoutee a `.env` | `memory/apis-and-tools.md` (capacite) ; la cle reste dans `.env` uniquement |
| Lecon importante apprise (bug, pattern, anti-pattern) | `memory/key-learnings.md` |
| Changement d'etat du projet (phase, etape, decision) | `memory/COMPACT_CURRENT.md` (projet actif) |
| Nouvelle decouverte sur un outil existant (gotcha, limite, format) | `memory/tools/<outil>.md` correspondant |
| Routage outil/skill nouveau a installer | CLAUDE.md (tableau Routage outils) |

**Regle** : Sauvegarder IMMEDIATEMENT apres la decouverte, pas en fin de session.
**Format** : Bref et factuel. Pas de prose. Juste les faits techniques necessaires pour la prochaine session.
**Annonce** : Dire a Aziz "Je sauvegarde [X] dans [fichier]" en une ligne, puis continuer le travail.

## Pipeline Beat Souverain (NON-NEGOTIABLE)

> Source de vérité : `scripts/beat-session.py`. 6 phases séquentielles. Lancer `/beat` pour démarrer.
> **DOCTRINE À LIRE D'ABORD : `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md`** — 8 principes premium data-viz (chiffre-événement, discipline chromatique, séquençage 8s, contraste d'échelle, secondary motion, highlight typo sync, métaphore physique, transitions seamless) + règle anti-clonage + template storyboard 10 champs. Le storyboard SE REMPLIT avec ce template. Briques codées : section "HERO DATA" de `COMPOSANTS-INDEX.md`. Squelette assemblage : `memory/SOUVERAIN-REMOTION-SKELETON.md`.

```
0. scan       → beat-session.py --phase scan  → SCAN COMPLET (TOUT COMPOSANTS-INDEX, 71+ composants) + >=2 COMBINAISONS validées Aziz. GATE : breakdown bloqué sans scan rempli.
0bis. storyboard → STORYBOARD GEMINI VISUEL multi-panels OBLIGATOIRE (gemini-storyboard-panels.py) montrant la progression. Validé Aziz AVANT breakdown. C'est de lui qu'on tire le JSON.
1. breakdown  → beat-session.py --phase breakdown  → JSON layout Tailwind (depuis le storyboard). LIRE avant de coder.
2. code       → Beat*.tsx Tailwind. h-[X%] + flex. Tokens: text-gold/ivory/bg-navy. Briques HERO DATA. → wip/beat{N}_v1.mp4
3. self-review → --phase self-review  → 23 critères. Seuil 19/23 BLOQUANT. Corriger avant Gemini.
4. review     → --phase review  → 1 seul appel Gemini. JSON code_values.
5. corrections → Appliquer code_values. Itérer sans nouvel appel Gemini.
6. upload     → --phase upload  → catbox + ntfy Aziz. OBLIGATOIRE avant toute présentation.
```

**Règles absolues :** Phase 0 SCAN TEMPLATES OBLIGATOIRE (gate bloquant, parité Mapbox) · 2 appels Gemini MAX (1 breakdown + 1 review) · Tailwind partout (exception SVG/animations) · R1 : max 8s sans changement visuel · self-review >= 19/23 avant review · upload avant présentation.

---

## Pipeline Beat Mapbox (NON-NEGOTIABLE)

> Système miroir du Beat Souverain, pour les beats CARTE (getCam, overlays, 1 Map continue).
> Source : `scripts/mapbox-session.py`. Validation : `scripts/tools/gemini-mapbox-review.py`.
> **DOCTRINE À LIRE D'ABORD : `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`** — 5 principes premium (drift continu, séquentiel synchro syllabe, anti-gris, projection images bichromie, habillage narratif) + règle anti-clonage + template storyboard 7 champs. Le storyboard de la phase 1 SE REMPLIT avec ce template.

```
0. SCAN TEMPLATES → AVANT TOUT : scanner CATALOGUE-CARTE-VIVANTE.md + MAPBOX-COMPOSANTS.md + COMPOSANTS-INDEX.md.
                Présenter à Aziz les templates pertinents + propositions de COMBINAISONS (ex: hook KineticMaskSlam
                → corps ResourceTextureFill → insert MapCutaway → plaque GeoCountryPlaque → climax GeoClimaxOverlay).
                Voir RÈGLE RECHERCHE TEMPLATES ci-dessous. JAMAIS coder un effet custom sans avoir vérifié l'existant.
1. storyboard → Production Brief par acte (Camera + Overlays + SFX). VALIDÉ PAR AZIZ avant code.
                = l'équivalent du storyboard PNG, mais pour une carte animée.
                SFX : plancher 0.50 (voir DOCTRINE section 6). Caméra : pitch 32 relief si focus 1-4 pays (camCountryApproach).
2. code       → getCam(frame) + ShortOverlays dans le fichier UNIQUE. → wip/animatic_aN_v1.mp4 (scale 0.35)
3. self-review → SCRIPTÉE D'ABORD : `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>` —
                assertions automatiques (SFX dans <Sequence>, drapeaux = useClipFlags/vraies images PAS drawFlagCanvas,
                getCam frame-driven, pas de filter:blur CSS, mainlandBox si pays à outre-mer). BLOQUANT : 0 erreur avant review.
                PUIS cocher critères visuels : clipping, collision labels, anti-gris, R1, zoom 2-14.
4. review     → gemini-mapbox-review.py → JSON scoré. ⚠️ CONSULTATIF, JAMAIS JUGE (voir règle ci-dessous).
                1 SEUL appel. Appliquer ce qui est VRAI, ignorer les hallucinations, STOP.
5. corrections → appliquer fix_code VRAIS. Itérer SANS nouvel appel Gemini (pas de boucle Gemini→fix→Gemini).
6. upload     → catbox + présenter à Aziz (décisions de goût : couleurs, glow, vignette).
```

**⛔ RÈGLE GEMINI = SIGNAL, JAMAIS JUGE (NON-NEGOTIABLE)** : le score `gemini-mapbox-review.py` est CONSULTATIF. Gemini analyse des frames échantillonnées sans le son → il HALLUCINE régulièrement sur le mouvement (ex. 2026-06-03 : a noté 4/10 un Beat 3 bon, croyant un pull back = "cut brutal" et niant un arc présent). PROCÉDURE OBLIGATOIRE : 1 seul appel → vérifier CHAQUE point contre les frames réelles → appliquer SEULEMENT ce qui est factuellement vrai → ignorer le reste → STOP → présenter à Aziz. **JAMAIS de boucle Gemini→correction→Gemini** (le code dérive vers pire pour satisfaire un score faux). Un score bas n'invalide PAS un beat : le jugement d'Aziz prime toujours sur Gemini. Gemini accélère, Aziz décide.

**Règles absolues :** 2 appels Gemini MAX (storyboard discuté + 1 review) · Production Brief validé Aziz AVANT code · self-review coché AVANT review · animatic 25-35% pour itérer vite · décisions de goût = jugement Aziz prime sur score. Catalogue overlays + réfs premium = dans `gemini-mapbox-review.py`.

**RÈGLE D'INVOCATION UNIVERSELLE (NON-NEGOTIABLE)** : TOUT nouveau beat Souverain Mapbox — création from scratch OU recréation (ex: refonte Maroc A2) — déclenche le storyboard Playbook + la phase 1 de `mapbox-session.py`, MÊME hors pré-production classique (Short fait "comme ça"). Le système ne s'active pas que dans le tunnel pré-prod complet.

**RÈGLE EFFET VIVANT (NON-NEGOTIABLE)** : chaque beat Mapbox DOIT inclure au moins un template "effet vivant" (existant ou créé) — couleur sur la carte, frontières marquées, projection image/couleur dans polygone, Lottie/overlay animé. La carte n'est JAMAIS nue, comme la caméra n'est jamais statique. Priorité : couleur + frontières + projection AVANT le 3D. Voir `SOUVERAIN-VISUAL-PLAYBOOK.md`.

**RÈGLE RECHERCHE TEMPLATES (NON-NEGOTIABLE — la plus rentable)** : AVANT d'écrire une ligne de code pour TOUT beat/scène, Claude DOIT scanner les catalogues de templates et présenter ce qu'il a trouvé à Aziz. Aziz ne peut pas mémoriser 70+ composants — Claude le peut en une fraction de seconde. Procédure + format obligatoire : `memory/feedback_recherche-templates-obligatoire.md`. Catalogues : `INDEX-DES-INDEX.md` (maître) → `CATALOGUE-CARTE-VIVANTE.md` (Mapbox) + `COMPOSANTS-INDEX.md` (71 composants). Ne JAMAIS coder un effet custom sans avoir vérifié qu'un template existe. Ne JAMAIS attendre qu'Aziz se souvienne d'un template. **Carte vivante = FlagFill (drapeaux/couleurs projetés dans polygones) est la règle N°1** — voir `feedback_flagfill-templates-decouverte.md`.

---

## Langue
- Communication : Francais
- Code et docs techniques : Anglais

---

## Regle : Hygiene dossier out/ (NON-NEGOTIABLE)

```
out/
├── PRET-PUBLICATION/    ← livrables validés Aziz (jamais modifier)
├── episodes/<ep>/
│   ├── wip/             ← travail en cours (purger fin de session, max 3 fichiers/beat)
│   ├── versions/        ← candidats présentés à Aziz (purger après validation)
│   └── beat<N>-FINAL.mp4
├── templates-souverain/ ← FINAL-*.mp4 + _dev/ frames jury
└── _r-and-d/           ← POC/tests (durée implicite 7j)
```

**Nommage** : `beat2_v3.mp4` (wip) → `beat2_V3.mp4` (présenté) → `beat2-FINAL.mp4` (validé) → `PRET-PUBLICATION/<ep>-FINAL.mp4`.

**Règles** : jamais de fichier à la racine de `out/` · jamais de dossier par date · à la validation Aziz : promouvoir versions/ → FINAL, purger wip/ + versions/.

**Dashboard here.now** : après template validé → frames mid/end (ffmpeg) → catbox → `dashboard/templates-souverain.html` → `publish-here-now.sh` (slug + claimToken dans `dashboard/dashboard-url.md`).

---

## Regle : Signalement proactif des decisions problematiques (NON-NEGOTIABLE)

Claude doit signaler AVANT d'implementer — pas attendre qu'Aziz decouvre le probleme au visionnage.

**Declencheurs obligatoires :**
- Ordre de scenes incohérent avec la logique narrative du script
- Transition ou effet visuel susceptible de bug technique dans le contexte d'utilisation
- Decision stylistique qui va a l'encontre de pratiques etablies (ex: transitions lourdes dans un documentaire YouTube)
- Structure d'assemblage (HookMaster, Series, etc.) qui ne respecte pas l'arc narratif du script

**Format du signalement :**
"Je remarque un probleme potentiel : [description]. Ma recommandation : [solution]. Tu veux qu'on en discute avant que je code ?"

**Pourquoi :** evite la friction inutile, reduit la charge cognitive d'Aziz, evite de devoir refaire le travail apres visionnage.

---

## Regle : Workflow Visual-Producer (NON-NEGOTIABLE)

**Avant tout lancement de visual-producer (Gemini/Recraft/Seedance/Kling) : montrer le prompt à Aziz et attendre validation explicite.**

- Aziz validera/ajustera/refusera le prompt — souvent il voit un détail que Claude rate
- Ne JAMAIS générer une image/clip payant sans que le prompt ait été vu
- Format : "Voici le prompt que je vais envoyer à [outil] : [prompt complet]. Je lance ?"

**Pourquoi :** Aziz a payé 100$+ d'assets ratés à cause de prompts non validés. La validation coûte 30 secondes, le re-gen coûte 5-30 minutes + $.

## Regle : Matière finale d'abord, code ajusté ensuite (PATTERN)

**Quand on intègre des assets visuels (Gemini, Seedance, PixelLab) dans un beat/scène :**

1. Générer la matière finale (assets validés, format final, upload catbox)
2. Voir la matière réelle dans le contexte du beat
3. Ajuster le code à l'esthétique réelle de la matière

**Anti-pattern :** coder le placement/animations avec des placeholders puis "remplacer après". L'esthétique réelle change tout (couleurs dominantes, équilibre composition, vide négatif). Le code écrit sur placeholder est presque toujours à refaire.

**Exception :** prototype rapide pour valider la mécanique d'animation (spring timing, transitions) — placeholders OK.

---

## Configuration Technique

**Env** : Node.js v24.6.0, npm (pas bun), macOS. Packages : `@remotion/paths`, `@remotion/shapes`, `lucide-react`.
**Clés API** : `.env` racine + `quebec-jacques-poc/.env` (Mapbox). Détails : `memory/apis-and-tools.md`. Jamais hardcoder.
**Agents** : pipeline 6 stages, ordre audio-director→storyboarder→visual-producer→remotion-composer→quality-reviewer. Tableau de déclenchement : `.claude/agent-memory/shared/PIPELINE.md`.
**Scripts QA** : `scripts/review_with_kimi.py` (Kimi review) · `scripts/generate-audio.ts` (ElevenLabs) · `scripts/polish-audio.ts` (Auphonic).
**Remote render** : `scripts/render-on-vercel.py` — **DEFAUT pour tout render > 30s** (100GB-h/mois gratuit, Mapbox OK).

### Regle : Langage naturel d'Aziz → Claude traduit (NON-NEGOTIABLE)

Aziz parle visuel/narratif. Claude traduit en technique sans demander de chemin/frame/variable. Si Claude demande un chemin de fichier à Aziz = Claude fait mal son travail.
- `public/assets/library/` : REF canoniques personnages — consulter à chaque génération
- `src/projects/*/manifests/` : timing/couleurs/textes — Claude consulte et modifie directement

### Regles TTS ElevenLabs francais (NON-NEGOTIABLE — scanner AVANT chaque appel)

1. **ZERO participe passé "e/ee" en fin de groupe** — drop accent final. INTERDIT : "terrifié", "hanté", "obsédé". Reformuler : "la terreur le saisit", "l'horizon le hante".
2. **ZERO "ont + voyelle"** — liaison bizarre. → passé simple ("firent escale").
3. **Noms de villes "s" final** — liaison bizarre. Ecrire phonétiquement si nécessaire.
4. **Nombres en lettres** — "1311" → "treize cent onze".
5. **Scan obligatoire** : lister TOUS les mots "e/ee" avant génération.

### Async PixelLab (NON-NEGOTIABLE)

Après `animate_character` : `sleep 120` → `get_character(...)` dans le MEME flow. Si "Animations: None yet" après 3min → relancer. Jamais annoncer "j'attends" sans exécuter le sleep Bash.

### Remotion — rappels critiques

Règles complètes : `memory/rules-outils-techniques.md` + `memory/tools/remotion.md`.
- Audio-derived timing OBLIGATOIRE — jamais hardcode
- `spring()` > `interpolate()` · `premountFor={1 * fps}` · `extrapolateRight: 'clamp'`
- INTERDIT : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`
- Safe zones 1920×1080 : marges 100/60px, sous-titres Y≥850, texte min 32px
- Atlas sprites : Spring Pop par défaut · `Math.max(0, localF)` OBLIGATOIRE · RGB check avant intégration

---

## NO EMOJIS IN CODE (NON-NEGOTIABLE)
- INTERDIT : `.ts`, `.tsx`, `.js`, `.json`, `.yaml`, `.env`
- AUTORISE : `.md`, `.txt` uniquement

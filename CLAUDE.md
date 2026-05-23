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
2. **Lire `.claude/agent-memory/shared/PIPELINE.md`** — connaitre l'etat exact de chaque projet actif (quel stage, quel agent a la main, quels blocages)
3. **Lire PIPELINE.md pour les handoffs de stage** — reperer les stages COMPLETE non encore chainees. Le format de handoff est documente dans `.claude/agent-memory/shared/TODOWRITE-PATTERN.md` (convention de nommage dans PIPELINE.md, pas un mecanisme TodoWrite natif cross-agents).
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

Si un stage a ete complete ou un etat a change durant la session :
- Mettre a jour `.claude/agent-memory/shared/PIPELINE.md` avec le nouveau statut
- Format : `## Stage N — Agent — Projet — Date [COMPLETE / IN PROGRESS / BLOCKED]`
- Ne pas laisser PIPELINE.md en retard sur la realite — les agents downstream lisent ce fichier

### Routage outils — LIRE AVANT d'agir (NON-NEGOTIABLE)

Quand Aziz parle de l'un de ces sujets, **charger le fichier correspondant AVANT d'ecrire du code ou un prompt**. Si la ligne mentionne aussi un skill, le consulter en complement (jamais a la place de la memoire projet) :

| Aziz parle de... | Lire ce fichier | Skills `.claude/skills/` a consulter aussi |
|-------------------|-----------------|---------------------------------------------|
| Seedance, Dreamina, prompt video, clip | `memory/tools/seedance-prompts.md` + `memory/tools/seedance-rules.md` | — |
| Seedance storyboard multi-cut (micro-seq 2-4 plans, <15s) | `memory/tools/seedance-storyboard-technique.md` | — |
| **Mouvement camera, orbit, dolly, crane, OTS, tracking** | `memory/tools/camera-movements.md` | — |
| **Ecrire un script Short narratif (Heros Oublies, conte, tragedie, voyage)** | `memory/templates/script-ebauche-v1.md` | — |
| **Ecrire un script Atlas (geo, taille, richesse-record, comparaison echelle, inventions chiffrees)** | `memory/templates/script-atlas-v1.md` | — |
| **Produire un episode Atlas (audio + d3-geo + overlays + render Remotion)** | `memory/templates/atlas-template-v1.md` | `remotion-best-practices/rules/maps.md` |
| **Coder une scene Atlas (TOUTE nouvelle scene, TOUT nouveau beat)** | `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` OBLIGATOIRE avant d'ecrire une ligne de code | — |
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
| **Data-viz Souverain (StackedBars, ProcessFlow, comparaisons multi-pays, axes, échelles, formatters $)** | `memory/DOCTRINE-SOUVERAIN.md` section 9 + prototype `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`. **D3.js utility-only** (d3-scale, d3-array, d3-format) + rendu SVG/React + animations Remotion. Validé 2026-05-23. | — |
| Pipeline, production, ordre des etapes | `memory/pipeline.md` | — |
| **Breakdown Gemini 3.1-pro (prompt + schema JSON + checklist)** | `memory/workflow-gemini-breakdown-schema.md` OBLIGATOIRE — lire avant tout script breakdown Souverain. **NOUVEAU 2026-05-23 : TOUJOURS coller le bloc "Stack technique à ta disposition" (Remotion + Mapbox + D3.js + Three + Lottie + composants Souverain) dans le prompt Gemini, sinon il propose du SVG primitif au lieu d'exploiter D3/Three/Lottie.** | — |
| **Twelve Labs, analyse video post-render, ton, retention, artefacts, CTA** | `memory/tools/twelve-labs.md` | — |

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

### Regle : Downscale AVANT toute analyse visuelle (NON-NEGOTIABLE)

**Avant d'analyser une image ou vidéo render (soi-même ou via Kimi), TOUJOURS passer par le script :**
```bash
./scripts/downscale-for-review.sh <fichier.mp4>   # extrait 5 frames 432p → /tmp/review_frames/
./scripts/downscale-for-review.sh <image.png>     # downscale → image_review.png
```
**Pourquoi :** 1 frame full HD = 2125 tokens. 1 frame 432p = 425 tokens. Sur 5 frames = 8500 tokens économisés par review.
**Exception unique :** vérification de texte pixel-precise ou labels Mapbox fins → passer `MAX_HEIGHT=768` en tête du script.

### Regle : Review visuelle AVANT Kimi (NON-NEGOTIABLE)

**Claude DOIT regarder lui-meme tout render/image/video AVANT d'envoyer a Kimi et AVANT de presenter a Aziz.**

- Utiliser le Read tool sur l'image/video pour l'analyser visuellement
- Identifier soi-meme : morphing, style drift, elements hors-cadre, texte parasite, composition
- Former son propre jugement : "cette image est-elle prete pour Kling ?" / "ce clip est-il acceptable ?"
- Seulement APRES cette analyse personnelle : envoyer a Kimi avec un brief precis de ce qu'on a observe
- Ne JAMAIS presenter un resultat a Aziz sans l'avoir soi-meme analyse

**Raison :** Kimi n'a pas le contexte complet de ce qu'on cherche (storyboard, objectif narratif, tolerance visuelle). Claude + Kimi ensemble = meilleur filtre. Claude seul sans Kimi = risque de manquer des artefacts subtils.

**Format du brief Kimi :** "J'ai observe [X]. Confirme ou infirme, et cherche aussi [Y]."

**Hierarchie de decision apres review Kimi :**
- Le score Kimi est une reference technique, pas un verdict final
- Quand le score et le ressenti visuel d'Aziz divergent, le jugement d'Aziz prime
- Kimi detecte les artefacts techniques ; Aziz juge la vision narrative et l'impact

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

> S'applique dès la pré-production — pas seulement au moment de coder.
> Source de vérité : `scripts/beat-session.py`. Ne jamais improviser en dehors de ce pipeline.

### Pré-production (avant toute session de code)

Avant de planifier, manifester ou coder un beat :
1. Vérifier si `/tmp/{episode}-beat{N}-breakdown.json` existe déjà
2. Si non → `python3 scripts/beat-session.py --episode X --beat N --phase breakdown`
3. Le breakdown Gemini produit les zones en %, tailles, classes Tailwind — **c'est lui la référence**, pas une estimation manuelle
4. Le manifest technique et le storyboard `.md` découlent du JSON breakdown, pas l'inverse

### Pipeline complet — 6 étapes obligatoires

```
1. breakdown   → python3 scripts/beat-session.py --episode X --beat N --phase breakdown
                  → JSON avec tailwind_layout, code_values, segments
                  → STOP — lire JSON + storyboard image avant de coder

2. code        → Beat*.tsx avec Tailwind OBLIGATOIRE
                  → h-[X%] + flex + justify-center (jamais position:absolute + paddingTop manuel)
                  → tokens : text-gold / text-ivory / bg-navy / text-stat-lg / text-entity
                  → render → out/episodes/{ep}/wip/beat{N}_v1.mp4

3. self-review → python3 scripts/beat-session.py --episode X --beat N --phase self-review --video ...
                  → 23 critères (remplissage, layout, typo, couleurs, R1, fidélité, Tailwind)
                  → Seuil : 19/23 minimum — BLOQUANT si score insuffisant
                  → Corriger + re-render jusqu'à 19/23 AVANT d'appeler Gemini

4. review      → python3 scripts/beat-session.py --episode X --beat N --phase review --video ...
                  → Appel Gemini 2 (UNIQUE — jamais relancer)
                  → JSON code_values + corrections précises

5. corrections → Appliquer code_values du JSON review + storyboard comme référence
                  → Itérer en autonome jusqu'à satisfaction (sans nouvel appel Gemini)
                  → Extraire frames, comparer storyboard, juger soi-même

6. upload      → python3 scripts/beat-session.py --episode X --beat N --phase upload --video ...
                  → Upload render + storyboard sur catbox → ntfy Aziz avec liens
                  → Aziz valide sur mobile → FINAL promu
```

### Règles absolues

- **2 appels Gemini MAX par beat** : 1 breakdown + 1 review. Jamais plus.
- **Tailwind partout** : zéro couleur/typo/spacing inline si token existe. Exception : valeurs SVG (fill, stroke, cx, cy) et animations (opacity, transform).
- **R1 : max 8s** sans changement visuel — glow/float ne comptent PAS.
- **self-review avant review** : ne jamais appeler `--phase review` sans avoir passé `--phase self-review` >= 19/23.
- **upload avant présentation** : ne jamais présenter un render à Aziz sans avoir lancé `--phase upload`.

---

## Langue
- Communication : Francais
- Code et docs techniques : Anglais

---

## Regle : Hygiene dossier out/ (NON-NEGOTIABLE)

### Structure permanente — les seuls dossiers autorisés dans out/

```
out/
├── PRET-PUBLICATION/          ← livrables complets validés Aziz (1 fichier par épisode, jamais modifier)
├── episodes/                  ← beats validés, 1 fichier par beat
│   └── <nom-episode>/
│       ├── wip/               ← renders de travail session en cours (purger en fin de session)
│       ├── versions/          ← candidats présentés à Aziz (purger après validation)
│       └── beat<N>-FINAL.mp4  ← unique fichier validé (promu depuis versions/)
├── templates-souverain/       ← renders finaux templates (FINAL-*.mp4) + _dev/ frames jury
└── _r-and-d/                 ← POC, tests techniques, Mapbox R&D (durée de vie implicite 7j)
```

### Convention de nommage — casse indique le niveau de revue

Inspiré des pipelines VFX professionnels (CAVE Academy / Frame.io) :

| Nommage | Signification | Dossier |
|---------|--------------|---------|
| `beat2_v3.mp4` | itération interne de travail | `wip/` |
| `beat2_V3.mp4` | version présentée à Aziz pour review | `versions/` |
| `beat2-FINAL.mp4` | validé — ne bouge plus | racine `episodes/<ep>/` |
| `<episode>-FINAL.mp4` | épisode complet livrable | `PRET-PUBLICATION/` |

### Règles automatiques — Claude applique sans qu'Aziz le demande

**Pendant une session de production** :
- Renders de travail → `out/episodes/<ep>/wip/beat2_v3.mp4`
- Avant de présenter à Aziz → copier dans `versions/` avec majuscule : `beat2_V3.mp4`
- Ne JAMAIS laisser de fichier à la racine de `out/`

**Au moment de la validation** (Aziz dit "c'est bon", "validé", "j'approuve", "ça marche") :
1. Promouvoir `versions/beat2_V3.mp4` → `out/episodes/<ep>/beat2-FINAL.mp4`
2. Supprimer tout le contenu de `wip/` et `versions/` pour ce beat
3. Annoncer : "Beat 2 promu → `out/episodes/<ep>/beat2-FINAL.mp4`, wip/versions purgés."

**Livrables épisode complet** :
- Déplacer vers `out/PRET-PUBLICATION/<episode>-FINAL.mp4`
- Vider le dossier épisode (les beats FINAL individuels peuvent rester)

**Interdit absolu** :
- Fichiers orphelins à la racine de `out/`
- Dossiers nommés par date de session (`jour4/`, `session-2026-05-09/`)
- Plus de 3 fichiers dans `wip/` simultanément pour le même beat

### Règle dashboard here.now

Après tout ajout de template validé dans l'ASSETS-INDEX :
1. Extraire frames mid/end (ffmpeg)
2. Uploader sur catbox (PNG)
3. Ajouter l'entrée dans `dashboard/templates-souverain.html`
4. Mettre à jour via le script en mode UPDATE (slug + claimToken dans `dashboard/dashboard-url.md`) :
   ```bash
   ~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh \
     dashboard/templates-souverain.html <slug> <claimToken>
   ```
5. L'URL reste identique — ne pas toucher à `dashboard/dashboard-url.md` (sauf si slug change)

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

### Environnement
- Node.js v24.6.0, npm 11.5.1, Git 2.50.1
- Pas de bun : utiliser npm exclusivement
- macOS (Darwin 25.2.0)

### Packages Remotion
- `@remotion/paths` : animations SVG path
- `@remotion/shapes` : generation de formes SVG

### Cles API
Source de verite : fichier `.env` (racine projet) + `quebec-jacques-poc/.env` (Mapbox). Capacites par cle documentees dans `memory/apis-and-tools.md`. **Ne JAMAIS hardcoder une cle dans le code ou les commits.**

### Regles d'attente async (NON-NEGOTIABLE)
- **Apres tout `animate_character` ou action async PixelLab** : executer `sleep 120` puis `get_character(...)` dans le MEME flow — jamais laisser une attente sans poll integre
- **Silent failure pattern** : si `get_character` retourne "Animations: None yet" apres 3+ minutes = relancer le job (pas attendre)
- **Jamais annoncer "j'attends X minutes" sans executer le sleep** : utiliser `Bash sleep` pour forcer l'attente reelle avant le poll
- **Toutes les actions async** (PixelLab, renders, generation audio) : meme protocole — sleep -> poll -> verifier -> continuer

### Regle : Langage naturel d'Aziz → Claude traduit (NON-NEGOTIABLE)

**Aziz parle en termes visuels et narratifs. Claude traduit en actions techniques au bon endroit.**

- Aziz dit "change le texte rouge qui arrive à la fin" → Claude va dans le manifest du beat concerné, trouve la ligne, modifie `appearsAt` ou la couleur. Aziz ne dit jamais "manifest", "frame", ni chemin de fichier.
- Aziz dit "génère une scène avec Abou Bakari" → Claude va chercher le REF canonique dans `public/assets/library/` automatiquement, sans qu'Aziz ait à le mentionner.
- **Règle absolue** : si Claude demande à Aziz un chemin de fichier, un numéro de frame, ou un nom de variable — Claude fait mal son travail. Claude cherche lui-même.

**Ces systèmes existent pour Claude, pas pour Aziz :**
- `public/assets/library/` : assets REF canoniques par personnage/projet — Claude consulte à chaque génération d'image
- `src/projects/*/manifests/` : valeurs visuelles des scènes (timing, couleurs, textes) — Claude consulte et modifie en réponse aux retours visuels d'Aziz

---

### Capacites Image & Assets

Details dans `memory/apis-and-tools.md` et `memory/pixellab-api-v2.md`.

- Voix GeoAfrique : `z3gESu49naEZW8Af2Upm` (Narratrice GeoAfrique v2, fr, markers TTS V3) — **LIRE REGLES TTS CI-DESSOUS avant tout script**
- Gemini : edition chirurgicale AVANT de regenerer (TOUJOURS)
- PixelLab MCP : characters, animations, tilesets (+ API v2)
- Remote render : `scripts/render-on-vercel.py` — **UTILISER PAR DEFAUT pour tout render > 30s** (libere la machine locale, 100GB-h/mois gratuit Hobby). Mapbox supporté. Le script envoie le projet, Vercel rend en cloud, retourne le lien MP4 téléchargeable.

### Regles TTS ElevenLabs francais (NON-NEGOTIABLE — appliquer a CHAQUE script audio)

> **Claude DOIT relire ces regles et scanner le texte AVANT chaque appel ElevenLabs. Pas apres. Pas "on corrigera plus tard". AVANT.**

1. **ZERO participe passe en "e/ee" en fin de groupe** : ElevenLabs drop l'accent final.
   - INTERDIT : "terrifie", "hante", "obsede", "tente", "prepare", "racontee", "traversee"
   - CORRECTION : reformuler avec verbe conjugue ("la terreur le saisit", "l'horizon le hante") ou construction sans accent ("qu'on te cache" au lieu de "qu'on ne t'a pas racontee")
2. **ZERO "ont + voyelle"** : liaison bizarre. Remplacer par passe simple ("ont accosté" → "firent escale")
3. **Noms de villes "s" final** : liaison bizarre. Ecrire sans "s" phonetique si necessaire
4. **Nombres en lettres** : "1311" → "treize cent onze" (TTS lit les chiffres de facon robotique)
5. **Scan obligatoire** : avant generation, lister TOUS les mots en "e/ee" du script et verifier un par un

### Skills
Skills installes dans `.claude/skills/`. Utilisation systematique via le tableau de routage en haut du fichier (colonne "Skills `.claude/skills/`"). Skill produit par ce projet : `youtube-scriptwriting/SKILL.md` (5 phases : Discovery, Research, Synthesis, Writing, Review).

### Agents Specialises — Pipeline 6 etapes (NON-NEGOTIABLE)

5 agents specialises par role de production. **Pipeline complet + tableau de declenchement : `.claude/agent-memory/shared/PIPELINE.md`** (lire avant tout nouvel episode).

Ordre : audio-director → storyboarder → visual-producer (plan) → visual-producer (assets) → remotion-composer → quality-reviewer → Aziz (Stage 7) → Claude main (Stage 8).

Si Claude oublie un declenchement = FAUTE DE PROCESSUS.

### Remotion Best Practices

Regles completes dans `memory/rules-outils-techniques.md` Section 4 (audio) et `memory/tools/remotion.md`.

**Rappels critiques :**
- Audio-derived timing OBLIGATOIRE — `const x = AUDIO_SEGMENTS.foo.startFrame;` jamais hardcode
- `spring()` > `interpolate()` pour mouvements naturels
- `premountFor={1 * fps}` sur toutes les `<Sequence>`
- `extrapolateRight: 'clamp'` toujours
- Anti-patterns INTERDITS : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`
- Safe zones 1920x1080 : marges 100px/60px, sous-titres Y>=850, texte min 32px

**Atlas — Sprites/objets (NON-NEGOTIABLE) :**
- **Apparition par defaut = Spring Pop** : `interpolate(lf, [0, 12, 45], [0, 3.0, 1.8], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})` ou plus agressif selon contexte. Jamais simplement `opacity` ou `scale` lineaire sauf justification explicite.
- **Math.max(0, localF) OBLIGATOIRE** avant tout calcul frameIdx sprite : `Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount`. Sans ca, `localF` negatif (avant beatStart) donne un index negatif en JS → chemin `frame_-14.png` → icone grise silencieuse.
- **Verification RGB avant integration** : tout asset PixelLab doit passer `scripts/add-city-asset.sh` — RGB < 80 sur fond OCEAN = invisible.
- **Verification registration beat** : `python3 scripts/check-beat-registration.py --episode <ep> --beat N --start <f> --end <f>` avant premier render standalone.
- **Spec table avant code** : `python3 scripts/beat-session.py --episode <ep> --beat N --phase spec-table` — phases narratives + frames audio-ancrees AVANT d'ouvrir le TSX.

### Scripts QA disponibles
- `scripts/review_with_kimi.py` : envoie video/image a Kimi K2.5 pour review (Moonshot API)
- `scripts/generate-audio.ts` : generation voix-off ElevenLabs
- `scripts/polish-audio.ts` : polissage audio Auphonic

---

## NO EMOJIS IN CODE (NON-NEGOTIABLE)
- INTERDIT : `.ts`, `.tsx`, `.js`, `.json`, `.yaml`, `.env`
- AUTORISE : `.md`, `.txt` uniquement

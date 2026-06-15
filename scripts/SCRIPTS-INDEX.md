# SCRIPTS-INDEX — Index des scripts par cas d'usage

> Index des scripts par cas d'usage. Quand tu veux faire X, lance Y. Créé 2026-06-15.
> Les scripts non listés ici sont dans `_archive/` (obsolètes).
>
> Chemins exacts depuis la racine repo. Pour la REVIEW/QA détaillée, voir aussi `scripts/tools/REVIEW-TOOLS-INDEX.md`.

---

## 🎬 RENDER (rendre une vidéo / composition)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Rendre une compo lourde / Mapbox (> 30s) sur le cloud (libérer la machine) | `scripts/tools/render-on-vercel.py` | `--comp GeoTest --props '{...}' [--open]` → URL Vercel Blob MP4. DÉFAUT render long. |
| Rendre une compo Mapbox/WebGL en local (headless WebGL) | `scripts/render-mapbox.sh` | `<CompositionId> <output.mp4> [args remotion...]` chrome-headless-shell, public-dir slim. |
| Capturer une compo WebGL Mapbox frame-par-frame via Remotion Studio (Playwright) | `scripts/capture-mapbox-studio.py` | `--comp <id> --frames N --fps 30 --out x.mp4`. Studio doit tourner. Fallback au headless. |
| Rendre les 8 slides du carrousel Good News + musique | `scripts/render-goodnews-carousel.sh` | Lit CURRENT_EDITION. Sortie `out/_r-and-d/good-news/final/`. |
| Rendre les slides d'un carrousel (PNG via remotion still) | `scripts/generate-carousels.py` | Sortie `out/carousels/<id>/slide-N.png`. Édite CAROUSELS en tête. |

---

## 🔊 AUDIO (narration, SFX, musique, alignement)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Générer une narration EXPRESSIVE (pipeline voix vivante V3→STS GéoAfrique) | `scripts/generate-narration-expressive.py` | `--text-file <txt> --out <mp3> [--sample] [--dry-run]`. Lancer `--dry-run` d'abord (coût). |
| Générer la narration Peste 1347 (GéoAfrique v2, script locked) | `scripts/generate-peste-narration.py` | Voix `z3gESu49naEZW8Af2Upm`. Script V3 hardcodé. |
| Générer des SFX (sound design, pas TTS) | `scripts/generate-sfx-elevenlabs.py` | ElevenLabs Sound Effects → `public/_shared/sfx/`. Prompts EN. |
| Générer les SFX War-Map (set signature + bonus réutilisable) | `scripts/warmap/generate-warmap-sfx.py` | Sortie `public/_shared/sfx/warmap/`. Indexer dans SFX-INDEX. |
| Forced alignment Peste 1347 (timing mot-à-mot) | `scripts/generate-peste-alignment.py` | ElevenLabs forced-alignment → JSON word-level. |
| Faire un SRT sobre depuis l'alignement Peste | `scripts/peste-make-srt.py` | Regroupe en lignes ≤42 chars, coupe à la ponctuation. |
| Forced alignment + découpe d'un mp3 narration par PARTIES (Sahel) | `scripts/sahel-align-and-split-v5.py` | Découpe le bloc validé aux vraies frontières, zéro regen. |
| Alignement mot-à-mot Whisper → fichier TS pour Subtitles | `scripts/tools/whisper-align.py` | `<audio.mp3> [--out x.ts]`. ~$0.006/min. |
| Transcrire une narration (Whisper, word-level JSON) | `scripts/tools/transcribe-openai.py` | OpenAI Whisper. Chemins Soundjata en dur (adapter). |
| Générer musique de fond Mande (3 variantes parallèles) | `scripts/tools/minimax-music-3variants.py` | Minimax v2.6 via fal.ai. |
| Générer musique Sénégal Pétrole & Gaz (3 variantes) | `scripts/tools/minimax-senegal-music.py` | Documentaire analytique. |
| Générer musique War-Map Sahel (4 variantes graves) | `scripts/tools/minimax-sahel-music.py` | + `minimax-sahel-music-v2.py` (2 variantes épiques). |
| Générer musique RDC (ambient doc sobre) | `scripts/tools/minimax-music-rdc.py` | Sortie projet rdc-no-sense. |
| Générer musique Québec/Canada (5 variantes, projet différé) | `scripts/tools/minimax-quebec-music.py` | R&D portabilité. |
| Générer musique EDM/énergique (sortir du contemplatif) | `scripts/tools/minimax-edm-music.py` | 3 pistes test. |
| Vérifier la durée réelle produite par Minimax (test) | `scripts/tools/minimax-music-test.py` | 1 prompt épique, contrôle duration. |
| Tester une voix TTS alternative (Hume Octave A/B vs GéoAfrique) | `scripts/test-hume-octave.py` | `<HUME_API_KEY>`. Clé jetable, NE PAS commiter. |
| Tester Gemini TTS V3 (accents africains) | `scripts/tools/test-gemini-tts-v3-accents.py` | Recherche voix proche narratrice EL. |

---

## 📤 PUBLICATION & DISTRIBUTION

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Programmer les vidéos Kora & Cartes sur Postiz (4 plateformes, 3 sem.) | `scripts/schedule-postiz.py` | `[--dry-run]`. |
| Programmer le carrousel Good News (IG + FB + TikTok Photo Mode) | `scripts/schedule-goodnews-carousel.py` | `[--dry-run] [--date ISO]`. |
| Programmer la version TikTok vidéo du carrousel Good News | `scripts/schedule-goodnews-tiktok.py` | `[--dry-run]`. Vidéo unique (pas carrousel). |
| Republier Kora & Cartes (coverB) via Postiz | `scripts/republish-kora.py` | `[--dry-run]`. Calendrier juin 2026 en tête. |
| Republier batch via TryPost (YT+IG+FB) + Postiz (TikTok) | `scripts/republish-trypost-batch.py` | `[--dry-run]`. API REST directe. |
| Republier Kora via TryPost + Postiz (calendrier détaillé) | `scripts/republish-trypost.py` | `[--dry-run]`. |
| Supprimer les posts Postiz en attente (#3+) | `scripts/delete-postiz-pending.py` | `[--dry-run]`. Demande confirmation. |
| Vérification mi-semaine (jeudi) des publications Postiz | `scripts/postiz-weekly-check.py` | `[--full-week]`. Cloud-safe, exit≠0 si échec. |
| Bilan hebdo (samedi) des publications Kora & Cartes | `scripts/postiz-weekly-report.py` | `[--days N]`. Liens live (pas de métriques). |
| Publier un storyboard beat sur here.now | `scripts/publish-storyboard.sh` | `<beat_dir> <beat_name> [audio] [slug] [token]`. |

---

## 🎨 GÉNÉRATION D'ASSETS (images, sprites, storyboards)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Générer une image text-to-image | `scripts/tools/gemini-gen-image.py` | `--prompt "..." --output x.png`. |
| Générer une variation image-to-image (garde le style d'une ref) | `scripts/tools/gemini-i2i.py` | `--ref REF.png --prompt "..." --output OUT.png`. |
| Générer des refs de style i2i en série (style anchor + table de clips) | `scripts/tools/generate-styleref.py` | 9:16 vertical, un par clip. |
| Générer un storyboard VISUEL multi-panels (pipeline Beat) | `scripts/tools/gemini-storyboard-panels.py` | `--episode X --beat N --prompt-file f.txt`. NON-NEGOTIABLE avant code. |
| Améliorer un storyboard existant (Gemini suggère + régénère) | `scripts/improve_storyboard.py` | `<episode> <beat_id> [--apply]`. Étape 1.5. |
| Générer un storyboard beat précis (Niger Beat4 / Silicon Beat7) | `scripts/tools/generate-beat4-storyboard-v2.py`, `scripts/tools/generate-beat7-storyboard.py` | Storyboards hardcodés (épisode-spécifiques). |
| Éditer chirurgicalement une thumbnail Souverain | `scripts/tools/gemini-thumbnail-edit.py` | `--input --output --brief senegal\|niger`. |
| Créer une thumbnail guidée par croquis + refs d'esthétique | `scripts/tools/gemini-thumbnail-create-from-refs.py` | `--croquis --refs ... --output --brief`. |
| Tester un style d'illustration carrousel Good News | `scripts/tools/gemini-goodnews-style-test.py` | 2 styles A/B. |
| Générer d'autres directions d'un sprite (pont Gemini→PixelLab) | `scripts/tools/pixellab-rotate.py` | `--image base.png --out-dir d/ --to-dirs east,west,...`. |
| Réécrire des prompts Kimi en Format 3 SECONDS Seedance | `scripts/tools/dynamize-prompts.py` | `kimi-brief.md [--clips 1,3] [--model claude\|gemini]`. |
| **(Sahel)** Générer la base Africa Corps top-down | `scripts/gen-africacorps-base.py` | Spécifique épisode War-Map Sahel P3. |
| **(Sahel)** Générer les jetons-combattants Acte 1 (JNIM/EIGS) | `scripts/warmap/gen-sahel-fighters.py` | Spécifique Sahel. |
| **(Sahel)** Générer le jeton soldats français (B1 V3) | `scripts/warmap/gen-sahel-france-token.py` | Spécifique Sahel. |
| **(Sahel)** Générer les véhicules top-down Acte 1 | `scripts/warmap/gen-sahel-vehicles.py` | Spécifique Sahel. |
| **(Sahel)** Générer les 5 assets Acte 2 (bases + jetons) | `scripts/warmap/gen-sahel-acte2-assets.py` | Spécifique Sahel. |
| **(Sahel)** Générer les sprites mobiles B1 (avion + convoi uranium) | `scripts/warmap/gen-sahel-b1-sprites.py` | Spécifique Sahel. |
| **(Sahel)** Générer les 5 jetons-réfugiés Acte 2 (exode, ethnicité O-Afr.) | `scripts/warmap/gen-sahel-refugies.py` | Spécifique Sahel. |

---

## 🔍 REVIEW & QA (reviewer un plan ou un rendu)

> Source détaillée : **`scripts/tools/REVIEW-TOOLS-INDEX.md`**. Rappels : MAX 2 appels Gemini, score CONSULTATIF jamais juge.

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Review créative AMONT d'un acte/beat (DA-BRIEF-GATE, Gemini+Kimi //) | `scripts/tools/da-brief.py` | `--brief f.txt --label X [--catalog] [--frame ...]`. Frames auto-downscalées. |
| Comparer un nouveau travail à une RÉFÉRENCE validée (vidéo entière) | `scripts/tools/da-compare.py` | `--ref <pilier\|mp4> --new x.mp4 --label X`. Gemini Files API. |
| Reviewer un beat Mapbox (directeur cartographique premium) | `scripts/tools/gemini-mapbox-review.py` | `<video.mp4> [--observations]`. JSON scoré CONSULTATIF. |
| Self-review SCRIPTÉE d'un beat Mapbox (assertions bloquantes) | `scripts/tools/mapbox-selfreview.py` | `<Beat*.tsx>`. Exit 0 si 0 ERROR. Phase 3. |
| Brief Mapbox caméra+overlays via Kimi | `scripts/tools/kimi-mapbox-brief.py` | `--prompt "..." \| --prompt-file f`. OpenRouter kimi-k2.5. |
| Reviewer un render (routeur multi-modèles : kimi narratif / qwen JSON / gemini) ⭐ | `scripts/visual_review.py` | `<video> --model gemini --storyboard PATH`. Remplace review_with_kimi (archivé). |
| Reviewer un beat data-viz Remotion (Gemini 1 breakdown) | `scripts/beat-breakdown.py` | `--beat N [--storyboard] [--output]`. Appel Gemini 1. |
| Reviewer la vidéo carrousel Good News (mouvement réel) | `scripts/tools/gemini-review-goodnews.py` | Gemini 3.1 Pro Files API. |
| Downscaler images/frames avant analyse vision (économie tokens) | `scripts/downscale-for-review.sh` | `<image\|video\|dossier> [nb_frames\|--batch]`. |

---

## 🗂️ SESSIONS BEAT (orchestrateurs de production scorés)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Produire un beat Souverain Remotion/Tailwind (seuil 19/23) | `scripts/beat-session.py` | `--episode X --beat N --phase scan\|breakdown\|review\|upload`. Lancé via `/beat`. |
| Produire un beat Souverain Mapbox (carte, seuil 8/10) | `scripts/mapbox-session.py` | `--episode X --acte AN --phase storyboard\|self-review\|review\|upload`. |
| Bilan + audit + next actions d'une session Atlas | `scripts/atlas-session.py` | `--episode X [--beat N \| --beats N M]`. |

---

## 📊 DATA WAR-MAP (recherche OSINT, fact-check, build dataset)

> Voir aussi `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md`. Tous fixture-safe (tournent sans clé). Lancer en module : `python3 -m scripts.warmap.<x>`.

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Orchestrer tout le pipeline data → JSON canonique engine | `scripts/warmap/build_warmap_data.py` | `-m ... [--fixtures-only]`. Chaîne ACLED→aggregate→LLM→fact-check. |
| Agréger les events ACLED en contrôle admin-1 (le CŒUR) | `scripts/warmap/aggregate.py` | `-m ... --fixtures-only` (golden test). |
| Connecteur ACLED (OAuth, fixture fallback) | `scripts/warmap/acled_connector.py` | Creds `.env` ACLED_USERNAME/PASSWORD. |
| Connecteur UCDP GED (CSV, 2e source fact-check) | `scripts/warmap/ucdp_connector.py` | CSV local, pas de token. |
| Fetcher GeoJSON front-line communautaire (surfaces) | `scripts/warmap/github_geojson_fetcher.py` | STUB — `fetch_control_geojson(url)` à implémenter. |
| Synthèse LLM par jalon (vignette contextuelle) | `scripts/warmap/llm_synthesis.py` | OpenRouter perplexity/sonar-pro. Fixture-safe. |
| Fact-check / cross-check des jalons (juge LLM) | `scripts/warmap/factcheck.py` | Convergence ≥2 source-kinds. Gemini 3.1 Pro juge. |
| Pré-recherche web aux dates de jalon (avant synthèse payante) | `scripts/warmap/web_preresearch.py` | STUB — `gather(dates)` no-op. |
| Helpers géo purs (point-in-polygon ray-casting) | `scripts/warmap/geo.py` | Module utilitaire, zéro dep. |
| Config partagée du pipeline (états, factions, chemins) | `scripts/warmap/config.py` | Subject Sudan. |
| Couche VISION Sudan (véhicules/réfugiés/villes/overlays) | `scripts/warmap/sudan_choreography.py` | Chorégraphie, pas data. Préservée aux regen. |
| Agréger (helper interne) | `scripts/warmap/aggregate.py` / `scripts/warmap/__init__.py` | — |
| DA-BRIEF Acte 1 War-Map (Gemini+Kimi // sur brief Acte 1) | `scripts/warmap/da-brief-acte1.py` | Spécifique Sahel Acte 1. |
| **(Sahel)** Générer le GeoJSON admin-1 réel Mali+Burkina+Niger | `scripts/warmap/generate-sahel-admin1.py` | Natural Earth 10m → 32 régions canoniques. |

---

## 🛠️ UTILITAIRES (helpers divers)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Uploader un fichier sur catbox.moe (→ litterbox si >200 MB) | `scripts/upload-catbox.sh` | `<file>` → URL. |
| Uploader des fichiers sur Vercel Blob (review mobile) | `scripts/tools/upload-to-blob.py` | `<file> [--folder] \| --gallery <title> ... \| --list`. |
| Supprimer des blobs Vercel | `scripts/tools/cleanup-blob.py` | `<prefix_or_url> ...`. |
| Régénérer les previews de templates (PNG stills + catbox) | `scripts/generate_template_previews.py` | `[filter] [--update-index]`. |
| Régénérer le dashboard HTML Souverain | `scripts/generate_dashboard.py` | `[--upload]` (here.now). |
| Préparer (générer assets manquants) un beat avant code | `scripts/prepare_beat.py` | `<episode> <beat_id>`. Étape 3. Vérifie pixel(0,0). |
| Vérifier l'enregistrement durationInFrames d'un beat (Root.tsx) | `scripts/check-beat-registration.py` | `--episode X --beat N [--start --end]`. |
| Gate bloquant avant de coder un beat Souverain | `scripts/validate_beat.sh` | `<episode> <beat_id>`. Exit 1 si fail. |
| Gates de pré-génération (anti-gaspillage API) | `scripts/pipeline_gates.py` | Module : `pre_seedance_check`, `pre_gemini_check`. |
| Intégrer un asset ville PixelLab (checks RGB/ref/dims) | `scripts/add-city-asset.sh` | `<ville> <fichier> [episode]`. |
| Extraire la dernière frame d'un clip (frame chaining) | `scripts/tools/extract-lastframe.sh` | `clip1.mp4 [clip2...]` → lastframe_*.png. |
| Vérifier les balances API avant génération payante | `scripts/check-api-balance.sh` | `[elevenlabs\|pixellab\|all]`. Exit 1 si seuil critique. |
| Envoyer une notification push (ntfy) | `scripts/ntfy-notify.sh` | `<event> <beat> [url] [msg]`. NTFY_TOPIC dans .env. |
| Lancer le layout tmux de surveillance agents | `scripts/tmux-agents.sh` | `[session_name]`. 4 panneaux live. |
| Préparer la recherche hebdo Good News (last30days → BRIEF) | `scripts/prepare-goodnews-weekly.py` | `[--days N]`. Étape 1, jugement éditorial reste manuel. |
| Détecter des outliers YouTube dans une niche | `scripts/tools/outlier-scan.py` | `[--queries "..."] [--min-ratio N]`. ScrapeCreators. |
| Brief conceptuel ponctuel overlay DATE Acte 1 (Gemini+Kimi) | `scripts/tools/ask-date-overlay.py` | Spécifique War-Map Sahel Acte 1. |
| Construire le SOUVERAIN-VISUAL-PLAYBOOK (2 appels Gemini) | `scripts/tools/gemini-visual-playbook.py` | Génération doctrine Mapbox. |
| Construire le SOUVERAIN-REMOTION-PLAYBOOK (2 appels Gemini) | `scripts/tools/gemini-remotion-playbook.py` | Génération doctrine data-viz. |
| Upgrade d'un playbook via Gemini (refs → principes appliqués) | `scripts/tools/gemini-playbook-upgrade.py` | 6 refs + 2 beats. |
| Idées de templates HOOK (ouverture) via Gemini | `scripts/tools/gemini-hook-ideas.py` | JSON → /tmp/hook-ideas.json. |
| Gap analysis templates carte vs Playbook (textuel) | `scripts/tools/gemini-template-gap.py` | JSON → /tmp/template-gap.json. |
| Nouvelles idées de templates carte vivante (previews réelles) | `scripts/tools/gemini-template-ideas-v2.py` | JSON → /tmp/template-ideas-v2.json. |

---

_Total : ~80 scripts actifs mappés. Si un script n'est pas ici, vérifier `scripts/_archive/`._

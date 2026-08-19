# SCRIPTS-INDEX — Index des scripts par cas d'usage

> Index des scripts par cas d'usage. Quand tu veux faire X, lance Y. Créé 2026-06-15.
> Les scripts non listés ici sont dans `_archive/` (obsolètes).
>
> Chemins exacts depuis la racine repo. Pour la REVIEW/QA détaillée, voir aussi `scripts/tools/REVIEW-TOOLS-INDEX.md`.

---

## 🎬 RENDER (rendre une vidéo / composition)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Rendre une compo lourde D3/SVG (> 30s) | `npx remotion render` (local) | DÉFAUT render long. ⛔ `scripts/tools/render-on-vercel.py` = POC abandonné (2026-03-27, repo séparé non synchronisé) — NE PAS UTILISER. |
| Rendre une compo Mapbox/WebGL en local (headless WebGL) | `scripts/render-mapbox.sh` | `<CompositionId> <output.mp4> [args remotion...]` chrome-headless-shell, public-dir slim. OBLIGATOIRE pour Mapbox/WebGL. |
| Rendre les 8 slides du carrousel Good News + musique | `scripts/render-goodnews-carousel.sh` | Lit CURRENT_EDITION. Sortie `out/_r-and-d/good-news/final/`. |
| Rendre les slides d'un carrousel (PNG via remotion still) | `scripts/generate-carousels.py` | Sortie `out/carousels/<id>/slide-N.png`. Édite CAROUSELS en tête. |

---

## 🔊 AUDIO (narration, SFX, musique, alignement)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Générer une narration EXPRESSIVE (pipeline voix vivante V3→STS GéoAfrique) | `scripts/generate-narration-expressive.py` | `--text-file <txt> --out <mp3> [--sample] [--dry-run]`. Lancer `--dry-run` d'abord (coût). |
| Générer des SFX (sound design, pas TTS) | `scripts/generate-sfx-elevenlabs.py` | ElevenLabs Sound Effects → `public/_shared/sfx/`. Prompts EN. |
| Générer les SFX War-Map (set signature + bonus réutilisable) | `scripts/warmap/generate-warmap-sfx.py` | Sortie `public/_shared/sfx/warmap/`. Indexer dans SFX-INDEX. |
| Forced alignment + découpe d'un mp3 narration par PARTIES (Sahel) | `scripts/sahel-align-and-split-v5.py` | Découpe le bloc validé aux vraies frontières, zéro regen. |
| ⭐⭐ **CORRIGER LE RYTHME/LES PAUSES d'une narration validée SANS régénérer** (voix se précipite, phrase coupée, pause manquante) | `scripts/tools/soudan-audio/pauses-sur-original.py` | `<manifest.json> <out.mp3>`. Insère des silences EXACTS sur l'audio original (prononciation intacte). Manifest = `{cuts:[{cut_s,resume_s,sil_s}]}` calés whisper MOT-À-MOT. **GARDE-FOU whisper obligatoire après.** Doctrine complète : `memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md`. |
| Retirer un MOT d'une narration validée (ex « Résumons ») | idem `pauses-sur-original.py` (cut à la frontière du mot) | + garde-fou whisper (le mot doit disparaître, rien d'autre). |
| Générer une narration par SEGMENTS (1 fichier/phrase) + assembler avec silences | `scripts/tools/soudan-audio/gen-segments.py` + `assemble-segments.py` | Variante "nouvel audio". ⚠️ régénère la voix (risque re-rate mots) — préférer pauses-sur-original si audio validé existe. |
| Construire une boucle musique (crossfade) pour couvrir une durée | `scripts/tools/soudan-audio/build-music-loop.sh` | `<music.mp3> <duree_s> <out.mp3> [crossfade_s]`. |
| Mixer musique (vol + bass domptées) + SFX (liste fichier:tc:vol) | `scripts/tools/soudan-audio/mix-soudan-v3.sh` | Template réutilisable. Musique 0.08 + `bass=g=-7`, SFX 0.5, voix reine. |
| Alignement mot-à-mot Whisper → fichier TS pour Subtitles / GARDE-FOU anti-coupure | `scripts/tools/whisper-align.py` | `<audio.mp3> [--out x.ts]`. ~$0.006/min. Sert aussi à VÉRIFIER qu'une coupe audio n'a pas mangé de mot. |
| Transcrire une narration (Whisper, word-level JSON) | `scripts/tools/transcribe-openai.py` | OpenAI Whisper. Chemins Soundjata en dur (adapter). |
| Générer une musique de fond (Minimax v2.6, A/B/C variantes) | `scripts/tools/_archive/minimax-music-3variants.py` | Archive : recette de référence (one-shot par épisode). Pour un nouvel épisode, paramétrer plutôt que dupliquer. |

---

## 📤 PUBLICATION & DISTRIBUTION

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| ⭐⭐ **Trouver le TITRE d'une vidéo** (longue, Short, caption) | `scripts/tools/jury-titres-llm.py` | `<script.md> --contexte "..." [--out x.md]`. Jury 4 modèles (Kimi+Gemini+GPT-5.5+**Grok**), 10 titres classés chacun, ~2 min. ⛔ ne JAMAIS générer ET juger un titre soi-même. Le signal = la CONVERGENCE. ⚠️ recompter les caractères (limite 55). |
| ⭐⭐ **Concevoir une MINIATURE** | `scripts/tools/jury-thumbnail-llm.py` | `<script.md> --contexte "..." [--out x.md]`. 5 concepts **composables en SVG** (pas d'image générée), classés. Puis composer le SVG soi-même → `rsvg-convert -w 1920 -h 1080 x.svg -o x.png`, et vérifier à 320 px. |
| Programmer les vidéos Kora & Cartes sur Postiz (4 plateformes, 3 sem.) | `scripts/schedule-postiz.py` | `[--dry-run]`. |
| Programmer le carrousel Good News (IG + FB + TikTok Photo Mode) | `scripts/schedule-goodnews-carousel.py` | `[--dry-run] [--date ISO]`. |
| Programmer la version TikTok vidéo du carrousel Good News | `scripts/schedule-goodnews-tiktok.py` | `[--dry-run]`. Vidéo unique (pas carrousel). |
| Vérification mi-semaine (jeudi) des publications Postiz | `scripts/postiz-weekly-check.py` | `[--full-week]`. Cloud-safe, exit≠0 si échec. |
| Bilan hebdo (samedi) des publications Kora & Cartes | `scripts/postiz-weekly-report.py` | `[--days N]`. Liens live (pas de métriques). |

---

## 🖼️ PIPELINE SVG GÉNÉRATIF (scènes animées, registres encre/schéma/tactique)

> Scripts SVG canoniques. Point d'entrée doctrine : `memory/doctrines/SVG-SCENES-GENERATIVES.md` + `memory/doctrines/SVG-FAISABILITE-AMONT.md`.
> ⛔ `svg-scene-libre.py` = **DÉPRÉCIÉ** (bandeau dans le fichier) → utiliser `svg-scene-narrative.py`.

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Idéation chorégraphie SVG (Kimi K2.5 — scène, transitions, registre) | `scripts/tools/kimi-svg-ideation.py` | `--brief "..." [--episode X]`. Kimi via Moonshot. |
| Idéation vues SVG (Gemini + GPT en parallèle — 2 angles créatifs) | `scripts/tools/svg-ideation-vues.py` | `--brief "..." [--out dir/]`. |
| Brief de faisabilité SVG AMONT (LLM propose sa meilleure approche + image-cible) | `scripts/tools/svg-faisabilite-brief.py` | `--brief "..." [--provider gemini\|gpt]`. Étape 0 pipeline. |
| Tester l'écart image→SVG (image-cible raster → SVG : valide ou s'effondre ?) | `scripts/tools/svg-from-image-target.py` | `--image ref.png --brief "..."`. Diagnostic avant codage. |
| Générer une scène SVG narrative COMPLÈTE ⭐ CANONIQUE | `scripts/tools/svg-scene-narrative.py` | `--brief "..." --provider gemini\|gpt [--out x.svg]`. Groupes `<g id>` nommés animables. ⚠️ Brief interne câblé "SCÈNE avec 4-6 objets-héros/paysage" — sur un brief ABSTRAIT/dataviz, ça dérive vers du narratif hors-sujet (vécu : "flux de traits" → désert+personnage). Pour de l'abstrait, utiliser `svg-scene-abstrait.py` ci-dessous. |
| Générer une COMPOSITION ABSTRAITE/CONCEPTUELLE SVG (dataviz, motion design, PAS de scène narrative) ⭐ | `scripts/tools/svg-scene-abstrait.py` | `--brief "..." --provider gemini\|gpt\|kimi --ratio 16:9 --out x.json`. Même mécanique/providers que `svg-scene-narrative.py` (schéma JSON identique, gestion IPv6, bornage reasoning Kimi) mais brief interne NEUTRE — pas d'imposition "objets-héros/paysage/émotion". Créé 2026-08-06 (NorthShield Direction B, storyboard système/conceptuel). Compatible `svg-image-cible-compare.py` en appelant chaque provider directement (le script de compare pointe en dur vers `svg-scene-narrative.py`, à appeler séparément pour l'instant). |
| R&D SVG génératif — registre découplé (test nouveaux registres, harnais `_rnd/svg-scenes/`) | `scripts/tools/rnd-svg-scene-gen.py` | `--registre encre\|schema\|tactique --brief "..."`. |
| Générer jetons / assets SVG ponctuels (drapeaux, icônes, symbols) | `scripts/tools/llm-gen-svg.py` | `--provider gemini\|gpt\|glm --brief "..." --out x.svg`. |
| Générer une image RASTER (portrait, texture, fond) via Gemini | `scripts/tools/gemini-gen-image.py` | `--prompt "..." --output x.png`. |
| Générer une image raster depuis une ou N refs de style (Gemini) | `scripts/tools/gemini-gen-image-ref.py` | `--refs a.png,b.png --prompt "..." --output OUT.png`. **Le prompt mène, la ref calibre** (parts = texte puis image). Accepte N refs. Pour ÉDITER une image plutôt que la calibrer → `gemini-i2i.py`. |

---

## 🎨 GÉNÉRATION D'ASSETS (images, sprites, storyboards)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Générer une image text-to-image | `scripts/tools/gemini-gen-image.py` | `--prompt "..." --output x.png`. |
| Éditer une image existante (i2i chirurgical, 1 ref) | `scripts/tools/gemini-i2i.py` | `--ref REF.png --prompt "CHANGE ONLY: ... PRESERVE EXACTLY: ..." --output OUT.png`. **L'image mène, le prompt modifie** (parts = image puis texte) — ⛔ ne PAS confondre avec `gemini-gen-image-ref.py`, l'ordre des parts n'est pas le même. ⛔ Jamais sur une miniature VALIDÉE (repasse toute l'image : cf `PACKAGING-YOUTUBE.md`). |
| Générer des refs de style i2i en série (style anchor + table de clips) | `scripts/tools/generate-styleref.py` | 9:16 vertical, un par clip. |
| Générer un storyboard VISUEL multi-panels (pipeline Beat) | `scripts/tools/gemini-storyboard-panels.py` | `--episode X --beat N --prompt-file f.txt`. NON-NEGOTIABLE avant code. |
| **Storyboard PHASE 1 — CONCEVOIR en TEXTE (N modèles en parallèle)** | `scripts/tools/storyboard-concepts-texte.py` | `--prompt-file f.txt [--models kimi,grok,gemini,gpt]` (défaut `kimi,grok`). Les modèles proposent des concepts + le découpage case par case. Rend éligibles Kimi/Grok, qui ne dessinent pas. Puis CHOIX HUMAIN avant la phase 2. |
| **Storyboard PHASE 2 — DESSINER (3 dessinateurs en parallèle)** | `scripts/tools/storyboard-dual-gen.py` | `--prompt-file f.txt --out-prefix p [--ref a.png --ref b.png] [--models gemini,gpt,grok]` (défaut = les 3). Refs d'ancrage acceptées par les 3 dessinateurs. Sort `<prefix>-gemini.png` / `-gpt.png` / `-grok.png`. |
| Générer une image text-to-image via GPT-image (OpenRouter) | `scripts/tools/openrouter-gen-image.py` | `gpt-5.4-image-2`. Comparer à Gemini selon le besoin. |
| Éditer chirurgicalement une thumbnail Souverain | `scripts/tools/gemini-thumbnail-edit.py` | `--input --output --brief senegal\|niger`. |
| Créer une thumbnail guidée par croquis + refs d'esthétique | `scripts/tools/gemini-thumbnail-create-from-refs.py` | `--croquis --refs ... --output --brief`. |
| Générer d'autres directions d'un sprite (pont Gemini→PixelLab) | `scripts/tools/pixellab-rotate.py` | `--image base.png --out-dir d/ --to-dirs east,west,...`. |
| Réécrire des prompts Kimi en Format 3 SECONDS Seedance | `scripts/tools/dynamize-prompts.py` | `kimi-brief.md [--clips 1,3] [--model claude\|gemini]`. |
| **(Sahel)** Générer les jetons-combattants Acte 1 (JNIM/EIGS) | `scripts/warmap/gen-sahel-fighters.py` | Spécifique Sahel. |
| **(Sahel)** Générer le jeton soldats français (B1 V3) | `scripts/warmap/gen-sahel-france-token.py` | Spécifique Sahel. |
| **(Sahel)** Générer les véhicules top-down Acte 1 | `scripts/warmap/gen-sahel-vehicles.py` | Spécifique Sahel. |
| **(Sahel)** Générer les 5 assets Acte 2 (bases + jetons) | `scripts/warmap/gen-sahel-acte2-assets.py` | Spécifique Sahel. |
| **(Sahel)** Générer les sprites mobiles B1 (avion + convoi uranium) | `scripts/warmap/gen-sahel-b1-sprites.py` | Spécifique Sahel. |
| **(Sahel)** Générer les 5 jetons-réfugiés Acte 2 (exode, ethnicité O-Afr.) | `scripts/warmap/gen-sahel-refugies.py` | Spécifique Sahel. |
| Animer une image de référence en vidéo (MiniMax H3, fal.ai) | `scripts/tools/minimax-h3-image-to-video.py` | `--image REF.jpg --prompt "..." --duration N --output OUT.mp4`. Préférer Comfy Cloud (open-weight, voir `memory/tools/minimax-h3-comfy-cloud.md`) sauf si fal.ai explicitement nécessaire. |
| Upscaler une vidéo 480p/720p → 1080p/2K/4K (fal.ai ByteDance) | `scripts/tools/fal-bytedance-upscale-video.py` | `--video-url URL --resolution 1080p\|2k\|4k [--pro] --output OUT.mp4`. Le moins cher sur clip court vs SeedVR2/FlashVSR — comparatif complet dans `memory/tools/minimax-h3-styles-tests.md` § Upscale post-génération. |

---

## 🔍 REVIEW & QA (reviewer un plan ou un rendu)

> Source détaillée : **`scripts/tools/REVIEW-TOOLS-INDEX.md`**. Rappels : MAX 2 appels Gemini, score CONSULTATIF jamais juge.

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Review créative AMONT d'un acte/beat (DA-BRIEF-GATE, Gemini+Kimi //) | `scripts/tools/da-brief.py` | `--brief f.txt --label X [--catalog] [--frame ...]`. Frames auto-downscalées. |
| Comparer un nouveau travail à une RÉFÉRENCE validée (vidéo entière) | `scripts/tools/da-compare.py` | `--ref <pilier\|mp4> --new x.mp4 --label X`. Gemini Files API. |
| Reviewer un beat Mapbox (directeur cartographique premium) | `scripts/tools/gemini-mapbox-review.py` | `<video.mp4> [--observations]`. JSON scoré CONSULTATIF. |
| Self-review SCRIPTÉE d'un beat Mapbox (assertions bloquantes) | `scripts/tools/mapbox-selfreview.py` | `<Beat*.tsx>`. Exit 0 si 0 ERROR. Phase 3. |
| Self-review SCRIPTÉE d'un beat Atlas (clipPath dupliqué, composant partagé redéfini, caméra à la main) | `scripts/tools/atlas-selfreview.py` | `<Beat*.tsx>`. Miroir de `mapbox-selfreview.py`. Exit 0 si 0 ERROR. Phase 3, AVANT présentation à Aziz. Détecte le bug clipPath continental répété Peste-1347. |
| Brief Mapbox caméra+overlays via Kimi | `scripts/tools/kimi-mapbox-brief.py` | `--prompt "..." \| --prompt-file f`. OpenRouter kimi-k2.5. |
| Reviewer un render (routeur multi-modèles : kimi narratif / qwen JSON / gemini) ⭐ | `scripts/visual_review.py` | `<video> --model gemini --storyboard PATH`. Remplace review_with_kimi (archivé). |
| Reviewer un beat data-viz Remotion (Gemini 1 breakdown) | `scripts/beat-breakdown.py` | `--beat N [--storyboard] [--output]`. Appel Gemini 1. |
| Breakdown JSON d'un storyboard via GPT-5.5 (jugé supérieur au breakdown) | `scripts/tools/openrouter-vision-breakdown.py` | Éval 2026-06-17. Voir aussi `gemini-vision-breakdown.py` (alternative Gemini). |
| Breakdown DUAL d'un storyboard (Gemini + GPT en parallèle) | `scripts/tools/storyboard-breakdown-dual.py` | Pipeline dual validé 2026-06-19. |
| **Self-review SCRIPTÉE d'un beat data-viz Remotion (LE VRAI GATE) ⭐** | `scripts/tools/dataviz-selfreview.py` | `<Beat*.tsx>`. Assertions bloquantes. Exit 0 = gate OK. Requis avant `--phase review`. |
| Downscaler images/frames avant analyse vision (économie tokens) | `scripts/downscale-for-review.sh` | `<image\|video\|dossier> [nb_frames\|--batch]`. |

---

## 🗂️ SESSIONS BEAT (orchestrateurs de production scorés)

| Quand tu veux... | Script | Usage / note |
|---|---|---|
| Produire un beat Souverain Remotion/Tailwind (seuil 19/23) | `scripts/beat-session.py` | `--episode X --beat N --phase scan\|preflight\|breakdown\|spec-table\|self-review\|review\|upload\|full`. Lancé via `/beat`. 8 phases. |
| Produire un beat Souverain Mapbox (carte, seuil 8/10) | `scripts/mapbox-session.py` | `--episode X --acte AN --phase storyboard\|breakdown\|self-review\|review\|upload`. 5 phases (breakdown = décode direction validée en plan technique). |
| **Scan doctrine + zoom-check War-Map (anti-bug ×10) ⭐** | `scripts/warmap-session.py` | `--phase scan\|zoom-check\|self-review`. Court et ciblé (PAS un pipeline complet) : scan = 4 pointeurs doctrine essentiels ; zoom-check `<f.tsx> --zoom N --intent close-up\|territorial\|regional` = calcule la distance réelle km visible (formule Web Mercator) et alerte si incohérente (a détecté rétroactivement le bug ×10 Soudan Acte 3, zoom 6.6 déclaré close-up = ~3000km réels) ; self-review = wrapper `mapbox-selfreview.py` + zooms détectés. À lancer AVANT de coder une scène War-Map. |
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
| Vérifier l'enregistrement durationInFrames d'un beat (Root.tsx) | `scripts/check-beat-registration.py` | `--episode X --beat N [--start --end]`. |
| Gates de pré-génération (anti-gaspillage API) | `scripts/pipeline_gates.py` | Module : `pre_seedance_check`, `pre_gemini_check`. |
| Intégrer un asset ville PixelLab (checks RGB/ref/dims) | `scripts/add-city-asset.sh` | `<ville> <fichier> [episode]`. |
| Extraire la dernière frame d'un clip (frame chaining) | `scripts/tools/extract-lastframe.sh` | `clip1.mp4 [clip2...]` → lastframe_*.png. |
| Vérifier les balances API avant génération payante | `scripts/check-api-balance.sh` | `[elevenlabs\|pixellab\|all]`. Exit 1 si seuil critique. |
| Envoyer une notification push (ntfy) | `scripts/ntfy-notify.sh` | `<event> <beat> [url] [msg]`. NTFY_TOPIC dans .env. |
| Préparer la recherche hebdo Good News (last30days → BRIEF) | `scripts/prepare-goodnews-weekly.py` | `[--days N]`. Étape 1, jugement éditorial reste manuel. |
| Détecter des outliers YouTube dans une niche | `scripts/tools/outlier-scan.py` | `[--queries "..."] [--min-ratio N]`. ScrapeCreators. |
| Vérifier les liens morts dans les fichiers de navigation | `scripts/tools/check-links.py` | NON-NEGOTIABLE après tout déplacement/renommage. |
| Vérifier la densité de mots d'un script (mots/min, mots total) contre la table `DOCTRINE-SCRIPT-UNIFIEE.md` | `scripts/tools/check-script-density.py` | `<script.md> --format short-90s\|midform-5min\|midform-8min\|warmap-long\|atlas [--duration-audio N]`. NON-NEGOTIABLE : gate après script lock, avant tout appel TTS payant. 100% offline. |
| Tracer quel script/version a VRAIMENT servi à un rendu final (code + audio transcrit, 2 sources croisées) | `scripts/tools/trace-livrable.py` | `<rendu.mp4> --episode-dir <dossier> [--composition-id X] [--skip-transcription]`. À utiliser en cas de doute sur quelle version fait foi (plusieurs SCRIPT-V*.md dans un dossier épisode) — a résolu rétroactivement le cas War-Map Sahel V4/V5. Nécessite `OPENAI_API_KEY` (Whisper) sauf `--skip-transcription`. |
| Vérifier mécaniquement qu'une décision doctrine tranchée est respectée dans le code déjà mergé (flyTo/easeTo, setTimeout/keyframes, overlay semi-transp banni, emojis affichés) | `scripts/tools/check-doctrine-violations.py` | `[dossier\|fichier]` (défaut `src/`). Complète les gates au moment de l'édit (hooks) en rattrapant la dérive du code déjà écrit, jamais re-scanné. Exit 0 si 0 ERROR (WARN n'échoue pas). |

---

_Total : ~55 scripts actifs mappés (élagage 2026-06-19 : 47 scripts one-shot/épisode-spécifiques archivés dans `scripts/_archive/` + `scripts/tools/_archive/`, 4 tests morts supprimés). Élagage suivant 2026-07-11 : 17 scripts supplémentaires archivés (épisodes Sénégal V3/GGW/Cacao/Soudan Acte 3 tous FINAL/promus + tests R&D jetables grok-imagine/seedance-pêcheur + `svg-scene-libre.py` déjà marqué DEPRECATED) — 128 scripts actifs mappés avant ménage → 110 après. Si un script n'est pas ici, vérifier `_archive/`._

### ⭐ Ajouts 2026-07-25 — pipeline SVG generatif & calage audio

| Besoin | Script | Notes |
|---|---|---|
| Comparer N modeles sur une MEME image-cible SVG (planche labellisee + upload) | `scripts/tools/svg-image-cible-compare.py` | `--brief b.txt --label X --models gpt,kimi` · `--assemble-only` reassemble sans rappeler les API (pour integrer le JSON de Fable, depose en `<label>-fable.json`). ⚠️ Fable = agent Claude Code, a lancer en // avec le MEME brief. |
| ⭐ Caler un bloc `T` Remotion sur la VO REELLE (timestamps mot-par-mot + **FRAMES des reperes**) | `scripts/tools/forced-align.py` | `<audio.mp3> <texte.txt> [reperes...]` · moteur ElevenLabs forced-alignment : marche meme quand le quota Whisper/OpenAI est epuise. Loss constatee 0.04-0.09. **Remplace les scripts d'alignement ad hoc par episode — ne plus en ecrire un par projet.** |

⚠️ **Quota OpenAI EPUISE au 2026-07-25** (`429 insufficient_quota`) : `whisper-align.py` et
`transcribe-openai.py` echouent tant que le credit n'est pas recharge → utiliser `forced-align.py`.

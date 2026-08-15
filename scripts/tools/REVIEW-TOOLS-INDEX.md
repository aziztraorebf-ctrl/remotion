# OUTILS DE REVIEW EXTERNE (LLM) — quel outil pour quoi

> Source de vérité unique : quel script lancer pour faire reviewer un plan ou un rendu par un modèle externe.
> Créé 2026-06-15 (les outils s'étaient accumulés sans doc). Modèles VERROUILLÉS : voir CLAUDE.md « MODÈLES API ».
> RÈGLE D'OR commune : **les modèles externes sont CONSULTATIFS, jamais juges.** Ils hallucinent (surtout sur le
> mouvement, sans son). Procédure : 1 appel → vérifier chaque point contre les frames réelles → appliquer
> seulement ce qui est VRAI → STOP. Jamais de boucle modèle→fix→modèle. Le jugement d'Aziz prime toujours.

> ⚠️ **GATE DE LA BOUCLE REVIEW = `phase_match_avg`, mais c'est un SIGNAL pour la self-review, JAMAIS un gate AUTO bloquant** (leçons cobayes 2026-06-20).
> `visual_review.py` calcule `phase_match_avg` (moyenne des `match_pct` par phase) — plus lisible que le `score`
> global (lui BRUITÉ/non-monotone : a baissé 6.5→5.5 alors que le render s'améliorait). MAIS even `phase_match_avg`
> sort BAS (51-55%) sur des renders FIDÈLES — voir diagnostic ci-dessous. Donc : le VRAI juge = la **self-review
> état-par-état** (Claude/agent compare chaque frame à SON état + écarte les divergences d'asset connues). Gemini =
> signal confirmatoire. Toujours self-review AVANT l'appel (au cobaye, la plupart des fixes Gemini étaient hallucinés).
> MAX 2 appels puis STOP même si <seuil.
>
> 🔬 **DIAGNOSTIC du gate (creusé 2026-06-20) — ✅ FIX IMPLÉMENTÉ le 2026-06-20** : pourquoi `phase_match_avg` était
> faux-bas sur un bon render. 3 causes structurelles, toutes corrigées :
> 1. **Storyboard envoyé en UNE image 3-panneaux** → Gemini devinait mal quel panneau ↔ quelle frame.
>    ✅ FIX : `split_storyboard_panels()` découpe la planche + appariement **panneau_i ↔ frame_i** en paires ordonnées.
> 2. **Ratio storyboard vertical ≠ render 16:9** → Gemini pénalisait un format inévitable.
>    ✅ FIX double : (a) le storyboard se génère désormais au RATIO du render (`--ratio` sur `gemini-storyboard-panels.py`,
>    défaut 16:9) ; (b) le prompt review DIT le ratio (« ne pénalise pas le format »). Scale d'extraction non-déformant
>    (`scale=360:-2`, l'ancien `243x432` forçait du 9:16 sur un 16:9).
> 3. **Frames extraites à intervalle fixe** → pas alignées sur les états → faux « élément manquant ».
>    ✅ FIX : `--state-boundaries "1.2,4.8,9.0"` (secondes, au cœur de chaque état du breakdown) → extraction alignée.
> 4. **(découverte au TERRAIN 2026-06-20) Palette navy/gold hardcodée dans le prompt** → un beat parchemin/ocre VALIDÉ
>    était pénalisé (4 fixes « critical » faux sur 6, score 4.5 à tort, phase_a 60%). ✅ FIX : `--palette {navy|parchemin|neon}`
>    (le prompt juge la palette contre LE bon registre). Preuve A/B même render : phase_a 60%→**90%**, faux-positifs palette **4→0**,
>    les VRAIS écarts (chiffre pas assez dominant, barre 30% minuscule, layout) ressortent enfin nets.
>
> **MODE D'EMPLOI du gate fiabilisé** (passer les frontières d'états = activer l'appariement) :
> ```bash
> python3 scripts/visual_review.py <render.mp4> --model gemini \
>   --storyboard <planche.png> --ratio 16:9 --palette parchemin \
>   --state-boundaries "1.2,4.8,9.0"   # secondes au cœur de chaque état (du breakdown)
> ```
> ⛔ `--palette` DOIT matcher le registre du beat (navy par défaut ; parchemin pour le registre crème/ocre ; neon marché/tech).
> Sans `--state-boundaries` : mode legacy (planche entière + frames +offset%, toujours dispo, mais bruité).
> **Avec** : panneau_i comparé à frame_i au bon moment → `phase_match_avg` cesse d'être faux-bas. Le juge reste la
> self-review état-par-état + jugement d'Aziz ; le gate fiabilisé est un signal NETTEMENT meilleur (plus la peine de
> l'ignorer par défaut). MAX 2 appels puis STOP.

---

## ⛔ GATE AUTOMATIQUE — review AVANT de présenter un rendu (NON-NEGOTIABLE, imposé par hook)

> Depuis 2026-06-19, un hook `.claude/hooks/pre-presentation-review.sh` (PreToolUse Bash + SendUserFile)
> **BLOQUE toute présentation d'un .mp4 de livrable** (chemin `out/...`) tant qu'une review valide n'existe pas.
> Ce n'est plus une consigne qu'on peut oublier : c'est structurel. Marche en mode médium, sur mobile.

**Ce que le hook exige** pour laisser passer un upload (catbox / blob / ntfy) ou un `SendUserFile` d'un mp4 :
- un fichier `<mp4-sans-ext>.review.json` **à côté du mp4**,
- **plus récent que le mp4** (sinon = rendu refait depuis la review → relancer),
- avec **score ≥ 8/10 ET verdict ≠ REBUILD**.

**Comment produire ce review.json** (= débloquer la présentation) :
```bash
python3 scripts/visual_review.py <chemin/au/rendu.mp4> --model gemini \
  --storyboard <le/storyboard.png> --output <chemin/au/rendu>.review.json
```
Puis lire la review, corriger les `fixes`, re-rendre si besoin, **re-lancer la review** (la périmée est rejetée).

**Échappatoires volontaires (le hook NE bloque PAS)** : protos `_rnd/` / `_r-and-d/` (mécanique d'animation, pas livrable), mp4 hors `out/`, URL distantes (liens ntfy), et le cas « pas de clé API » (score illisible → passe avec un WARNING, le hook ne lance jamais de review lui-même).

⚠️ Le hook ne JUGE pas le goût — il vérifie qu'une review OBJECTIVE a eu lieu (score/verdict/fraîcheur). Le jugement d'Aziz prime toujours sur le score. Détail conception : implémenté dans le hook `pre-presentation-review.sh` (Chantier B — fichier de conception supprimé après implémentation).

---

## ⭐ LE SYSTÈME PRINCIPAL — `da-brief.py` (upstream + downstream unifié)

**`scripts/tools/da-brief.py`** est LE système de review externe. À utiliser par défaut pour TOUTE review (plan ou rendu).
- **3 voix** : Gemini 3.1 Pro (`gemini-3.1-pro-preview`) + Kimi K2.5 (`moonshotai/kimi-k2.5`) + DeepSeek V4 (`deepseek/deepseek-v4-pro`, 3e voix CONCEPTUELLE, ~10-20× moins chère, TEXTE only).
- **2 modes** :
  - `--upstream` (PRÉVENTIF) : review du PLAN AVANT d'écrire du code. Active `--expert` + DeepSeek par défaut. C'est le mode du **DA-BRIEF-GATE** (`memory/doctrines/DA-BRIEF-GATE.md`).
  - mode normal (CORRECTIF / downstream) : review d'un RENDU (frames downscalées ou vidéo). DeepSeek OFF.
- **Synthèse extractive tracée OBLIGATOIRE** à chaque appel : extraire TOUTE idée par maille de travail, attribuer la source (G/K/D), trancher chacune (RETENU/OPTION/ÉCARTÉ + raison), fact-checker les chiffres. Format de réf : section « SYNTHÈSE TRACÉE » de `memory/episodes/warmap-sahel/PLAN-REFONTE-P4-POLISH.md`.
- **MAX 1 appel / modèle / acte.** Doctrine complète : `memory/doctrines/DA-BRIEF-GATE.md`.

**Template de prompt downstream premium** (faire monter une version semi-finale en gamme, pas chasser les bugs) :
`memory/archive/doctrines-perimees-2026-06-19/REVIEW-PREMIUM-TEMPLATE.md` (archivé 2026-06-19 : portait une info Gemini-vidéo contredite par CLAUDE.md ; les 7 demandes de montée en gamme restent consultables. Review actuelle = `scripts/visual_review.py` + DA-BRIEF-GATE).

---

## OUTILS SPÉCIALISÉS (rôle distinct de da-brief, à garder)

| Outil | Rôle | Quand |
|---|---|---|
| `scripts/tools/mapbox-selfreview.py` | **Self-review SCRIPTÉE** d'un beat Mapbox (assertions automatiques : SFX dans `<Sequence>`, drapeaux = `useClipFlags`, getCam frame-driven, pas de filter:blur). Pas un LLM. | Phase 3 du pipeline Beat Mapbox, AVANT tout appel externe. BLOQUANT : 0 erreur avant review. |
| `scripts/tools/dataviz-selfreview.py` ⭐ | **Self-review SCRIPTÉE data-viz = LE VRAI GATE** (equivalent data-viz de mapbox-selfreview). Assertions DETERMINISTES : E1/E2 picto>=13% larg & label>=40px @1080 (faiblesse recurrente n1 cablee), E3 police nommee chargee via @remotion/google-fonts (sinon fallback Impact silencieux — bug reel trouve sur le cobaye v9), E4 staticFile existe, W1 patterns Remotion interdits, W2 presence asset opaque. Pas un LLM. | Etape 6a du WORKFLOW-DATAVIZ, AVANT le diff GPT et AVANT toute presentation. BLOQUANT : exit 0 requis. Remplace le score Gemini comme gate (ce dernier reste un simple signal). |
| `scripts/tools/gemini-mapbox-review.py` | Review d'un beat **Mapbox** par Gemini → JSON scoré (bugs/clipping/timing + fix_code). CONSULTATIF. | Phase 4 du pipeline Beat Mapbox. 1 seul appel. |
| `scripts/visual_review.py` ⭐ | **Routeur multi-modèles** review d'un render (vidéo/image) : `--model kimi` (feedback narratif DA) / `qwen` (audit JSON) / `gemini` (review beat + storyboard → JSON code_values, recommandé). Remplace `review_with_kimi.py` (archivé). | Review standalone d'un rendu hors da-brief. Déjà appelé par beat-session/beat-breakdown. |
| `scripts/tools/kimi-mapbox-brief.py` | Brief Mapbox AMONT (caméra + overlays) par Kimi seul. | Préparer un brief carte avant code (alternative légère à da-brief upstream). |
| `scripts/tools/gemini-video-da-brief.py` ⭐ | **DA-brief VIDÉO premium (AVAL)** : upload la VIDÉO COMPLÈTE à Gemini 3.1 Pro (Files API, fiable) → critique premium par **analyse d'ÉCART vers des refs de niveau** (Bloomberg/FT/Economist, Vox/Kurzgesagt). Juge le MOUVEMENT / rythme / transitions / matière / SON (≠ frames figées). Cadré pour NE PAS rajouter de texte (protège l'épure). 3 sections (déjà au niveau / écarts qui comptent / mineur). CONSULTATIF — FILTRER après (signal, pas juge). | Quand une scène est FINIE et qu'on veut la faire monter en gamme premium (pas chasser des bugs). Tester la fiabilité upload d'abord (`gemini-video-upload-test.py`). Prouvé sur scène 0 Sénégal (2026-06-18). Distinct de `da-brief.py` (frames amont) et `gemini-mapbox-review.py` (JSON bugs). |
| `scripts/tools/gemini-video-review-custom.py` | **Gemini vidéo à BRIEF CUSTOM** : `<video.mp4> <brief.txt> <out.md>`. Même mécanique fiable que `gemini-video-da-brief` (upload Files API + attente state ACTIVE, `gemini-3.1-pro-preview`) mais accepte un brief libre au lieu du BRIEF en dur. | Quand on veut poser des QUESTIONS PRÉCISES à Gemini sur une vidéo (caméra, rythme, dynamisme…) dans un registre donné. Prouvé Acte 1 Soudan (2026-07-07). |
| `scripts/tools/kimi-frames-review.py` | **Kimi review à FRAMES + brief custom** : `<brief.txt> <out.md> <img1.jpg> …`. OpenRouter `moonshotai/kimi-k2.5`, `temperature:1`, `max_tokens:4000`, fallback `content \|\| reasoning`. ⛔ PAS Moonshot direct (content=null) ni `visual_review.py --model kimi` (max_tokens 2000 = réponse vide, cf `tools/kimi-review-bug.md`). 6 frames = bon équilibre (pas de troncature). | Second regard Kimi (frames) en parallèle d'une review Gemini vidéo, sur le même brief. Recette complète : `memory/episodes/soudan-midform/reviews-acte1/SYNTHESE-ET-RECETTE.md`. Prouvé Acte 1 Soudan (2026-07-07). |
| `scripts/tools/jury-script-llm.py` ⭐ | **Jury LLM de SCRIPT — CONFORMITÉ DOCTRINE (texte, pas rendu)** : Gemini 3.1 Pro + GPT-5.5 (OpenRouter) + Kimi k2.5, 9 axes fusionnés en 1 seul passage — clarté phrase-par-phrase (axes 1-4) ET densité cumulative/flux narratif sur l'acte entier (axes 5-9, règle 6bis `DOCTRINE-SCRIPT-UNIFIEE.md`). Fusion actée après le Soudan Acte 4 (2026-07-10) où 2 jurys séparés ont été nécessaires (le 1er, clarté seule, avait laissé passer une rupture de flux invisible phrase par phrase). Usage : `python3 scripts/tools/jury-script-llm.py <script.md> "## BEAT 1" "## GATE" --contexte "..."`. IPv4 forcé (bug connu SDK Gemini). ⚠️ NE PAS confondre avec `jury-script-creatif-llm.py` (ci-dessous, périmètre différent). | Avant tout verrouillage de script (Acte 5+, tout format), APRÈS le jury créatif. UN SEUL passage suffit désormais — plus besoin d'un 2e tour densité après coup. |
| `scripts/tools/jury-script-creatif-llm.py` ⭐⭐ | **Jury LLM de SCRIPT — CRITIQUE CRÉATIVE (hook/rythme/technicité/ton)** : Kimi k2.5 + Gemini 3.1 Pro + GPT-5.6 Sol + **Grok 4.20** (xAI), en parallèle. Brief structuré : niveau de technicité/où ça décroche, force du hook (1re minute), dynamisme/rétention (zones plates), équilibre vulgarisation/sérieux/ton humain (référence techniques de chaînes connues pour leur écriture), note /10, ET une réécriture complète dans le MÊME appel. Créé 2026-08-01 (Gazoduc AAGP/TSGP) — a fait passer un script de 6-7/10 (4 modèles convergents) à une V2 nettement meilleure. Usage : `python3 scripts/tools/jury-script-creatif-llm.py <script.md> --contexte "..."`. ⛔⛔ Fusion des 4 verdicts = MANUELLE par Aziz (choix de goût), pas automatique — Claude ne synthétise QU'après relecture d'Aziz, jamais une fusion algorithmique en solo. ⛔⛔ Les verdicts "neutralité" du jury sont à FILTRER à travers `CHARTE-EDITORIALE-SOUVERAIN.md` ("analyste, ni militant ni neutre") avant application — un modèle générique juge contre une neutralité journalistique plate qui n'est PAS notre charte (7/10 corrections "neutralité" étaient des faux positifs sur le Gazoduc). | **AVANT** le fact-check de formulation (`jury-script-llm.py` ou Sonar Pro/Deep Research), sur le script V1 — fact-checker un texte qu'on va réécrire suite au jury est du travail perdu. Ordre complet : `RECHERCHE-PRESCRIPT-UNIFIEE.md` étapes 8-9. |
| `scripts/tools/jury-titres-llm.py` ⭐⭐ | **Jury LLM de TITRES YouTube (génération + classement)** : Kimi k2.5 + Gemini 3.1 Pro + GPT-5.5 + **Grok 4.20** (xAI, `XAI_API_KEY`), en parallèle, chacun aveugle aux autres. Reçoit le SCRIPT COMPLET + la charte + les 10 règles de titrage maison, rend **10 titres classés** avec ressort psychologique et faiblesse par titre. ⛔ Le `--contexte` DOIT lister les faits à ne pas déformer et ce que le thumbnail affiche déjà. Usage : `python3 scripts/tools/jury-titres-llm.py <script.md> --contexte "..." --out <x.md>`. IPv4 forcé. | **Tout titre à trancher** (vidéo longue, Short, caption). Créé le 2026-07-30 après 3 séries de titres rejetées par Aziz + 1 titre factuellement FAUX proposé en solo : générer ET juger soi-même = juge et partie. Le signal = la **convergence** entre modèles (4/4 sur le Sénégal, 3/4 sur l'AES, Gemini et GPT à l'identique sans se voir). ⚠️ Les modèles **comptent mal les caractères** (Grok a annoncé 58 pour 63) — recompter soi-même contre la limite de 55. Détail : `feedback_jury-titres-llm-4-modeles.md`. |
| `scripts/tools/jury-thumbnail-llm.py` ⭐⭐ | **Jury LLM de CONCEPTS DE MINIATURE composables en SVG** : mêmes 4 modèles. ⛔ Ne demande AUCUNE image générée — des concepts en **SVG vectoriel plat** (nos vidéos SONT du SVG ; une miniature 3D photoréaliste crée une rupture d'attente et abîme la rétention). Rend **5 concepts classés** avec objet central, composition, palette, **garantie de lisibilité en plein soleil**, texte gravé, ressort, risque, et **vérification de neutralité**. Impose ≥2 vraies SCÈNES NARRATIVES (un schéma/graphique = sujet méta, ça explique au lieu de raconter). Usage : `python3 scripts/tools/jury-thumbnail-llm.py <script.md> --contexte "..." --out <x.md>`. | **Toute miniature à concevoir.** Créé le 2026-07-30 (CFA) après que le Pipeline C via Gemini web ait rendu 4 images 3D avec fautes gravées (« EETATS », « FRAC ») et 2/4 accusatrices. Sortie du jury → composer le SVG (agent Fable ou soi-même) → `rsvg-convert -w 320` et REGARDER. Détail : `feedback_thumbnail-svg-compose-maison.md`. |

---

## OUTILS DE GÉNÉRATION (pas de la review — ne pas confondre)

`gemini-gen-image.py`, `gemini-i2i.py`, `gemini-thumbnail-*.py`, `gemini-storyboard-panels.py`, `test-gemini-tts*.py`
= génération d'assets (image / storyboard / TTS), pas de la review. Voir `memory/tools/gemini.md`.

Bloc-prompt réutilisable templates carte (à coller dans un prompt Gemini) : `memory/tools/BRIEF-GEMINI-TEMPLATES-CARTE.md`.

---

## Archivés (ad-hoc de session, ne pas relancer)

- `scripts/tools/_archive/gemini-p3-review.py` — hardcodé P3 Sahel (12 juin). Le standard généralisé = `REVIEW-PREMIUM-TEMPLATE.md`.

## measure-insert-clip.py — mesure objective d'un clip d'insert (2026-08-15)

`python3 scripts/tools/measure-insert-clip.py <clip.mp4> --zone nom:y0,y1,x0,x1 [...]`

Mesure : mouvement median global et par zone (separation cadre/matiere), derive horizontale de la
structure, ratio de boucle, ecran noir en fin, derive de luminosite.

⛔ **A lancer AVANT de juger un clip d'insert a l'oeil** : a detecte 3 defauts invisibles a
l'inspection visuelle (gaz qui se vide, navire qui derive de 15 px, raccord de boucle franc).
Gabarits de prompt pour corriger ce qu'il revele : `memory/tools/H3-PROMPT-BLOCKS.md`.


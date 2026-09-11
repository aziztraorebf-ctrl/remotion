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
| `scripts/tools/motion-breakdown.py` ⭐⭐ | **RELEVÉ DE MOUVEMENTS factuel, 2 voix en parallèle (~65 s)** : Gemini 3.1 Pro reçoit la VIDÉO native (mouvement continu, vitesses, parallaxe, fondus croisés), GPT-5.5 des FRAMES DENSES à 6 fps (inventaire exhaustif, instants précis) — ⛔ GPT n'accepte PAS la vidéo via OpenRouter. **6 fps est le plancher** : à 4 fps une rotation à 83 deg/s saute de 21 deg entre 2 frames et le modèle décrit un objet immobile. Répond « quels GESTES existent + quelles TAILLES en % du cadre ». ⛔⛔ **NE DONNE PAS de valeurs en px** — les chiffres viennent de la mesure sur frames, obligatoire. ⚠️ **Distinct de `da-brief-video-3voix.py`** qui juge la DIRECTION ARTISTIQUE : ici c'est un relevé FACTUEL, zéro jugement. | **AVANT de coder** un plan à reproduire ou à analyser. Créé 2026-08-27 (repro Foster) sur proposition d'Aziz : en analysant ET codant soi-même, on regarde les images en pensant déjà à l'implémentation — 3 défauts majeurs ratés, tous attrapés par Aziz. Dès le 1er usage il a montré qu'un plan annoncé « typo sur fond vert » était en fait un diagramme complet à 4 acteurs. |
| `scripts/tools/proportions-diff.py` ⭐⭐ | **ÉCARTS DE PROPORTIONS CHIFFRÉS** : on donne une planche A/B (original EN HAUT, notre repro EN BAS, **grille commune graduée en %**) et le modèle rend, par élément, `A: <taille %> centre à x%,y% | B: idem | ECART: consigne chiffrée`. Idée d'Aziz : **un modèle qui COMPARE voit ce qu'il ne voit pas en décrivant**. A trouvé que nos étiquettes faisaient 9,6 % de la largeur contre 12,2 % en référence — jamais mesurées séparément jusque-là. ⛔⛔ **BIAIS CONNU DU FORMAT EMPILÉ, à ne jamais oublier : les TAILLES sont fiables, les POSITIONS VERTICALES non.** Ils affirment « tout est ~10 % trop bas » (faux : ils lisent la position dans la planche entière, où B occupe la moitié basse) et réclament le watermark de la source. Ne JAMAIS appliquer une correction verticale sans la remesurer. | **APRÈS un rendu**, quand la structure est bonne mais que « quelque chose cloche » sans qu'on sache quoi. Créé 2026-08-27. |
| `scripts/tools/da-brief-video-3voix.py` | **DA-brief AMONT à 3 voix avec VIDÉO native** (Gemini + Kimi) + frames pour GPT. Review CRÉATIVE : 5 angles, AI-slop, expert-constructeur. ⚠️ C'est un JUGEMENT de direction artistique — pour un relevé factuel de mouvements, voir `motion-breakdown.py` ci-dessus. | Gate DA-brief avant code. (Entrée ajoutée au /wrap 2026-08-27 : l'outil existait depuis plusieurs sessions mais ne figurait dans AUCUN index — c'est ce trou qui rendait possible la confusion avec motion-breakdown.) |
| `scripts/tools/da-brief-anim.py` ⭐⭐ | **DA-brief ANIMATION, 4 voix, AVEC ou SANS référence.** Gemini 3.1 Pro + Kimi K3 en VIDÉO native · GPT + Grok en frames (⛔ ces 2 refusent la vidéo). ⭐ **Le mode SANS référence est le PRINCIPAL** — c'est le cas normal dès qu'on produit nos propres pièces ou celles d'un client : personne n'a fait la pièce avant nous. Blocs : récit → motion → **test du prix (200 $ ou 2000 $ ?)** → 3 corrections → **ancrage** (nommer une référence RÉELLE, interdiction du mot « premium » sans exemple) → **l'idée qu'on n'a pas eue**. ⭐⭐ **SA VRAIE VALEUR N'EST PAS LE GESTE, C'EST LE RÉCIT** : sur `repro-onboarding` il a sorti **3 incohérences narratives** que ni Aziz ni Claude n'avaient vues, toutes vérifiées vraies dans le code (un chiffre qui contredit la liste affichée · un titre qui annonce autre chose que l'étape · une notification qui inverse la perspective). ⛔ Ne pas le classer comme une review visuelle : c'est un **détecteur de logique narrative**, à lancer AVANT de peaufiner l'animation. ⚠️ Distinct de `da-brief-video-3voix.py` (qui EXIGE une référence et juge la DA d'un beat vidéo). | Après tout rendu d'animation — surtout SANS référence. Créé 2026-08-30 sur idée d'Aziz : « la majorité du temps nous n'aurons pas de référence ». Seul script du repo à importer ses 4 identifiants d'`api_models.py` et à appliquer le vrai fix du `reasoning_content` de k3 — **c'est le patron à recopier** pour migrer les scripts restés sur `kimi-k2.5`. |
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


## carto-selfreview.py — gate MÉCANIQUE d'une frame cartographique (2026-08-22) ⛔ BLOQUANT

`python3 scripts/tools/carto-selfreview.py --frame f.png [--globe-interdit|--globe-attendu] [--attendu-fond RRGGBB] [--sujet-min N --sujet-max N]`

O/X sur 4 critères, **exit 1** si un critère dur échoue : C1 projection (globe non voulu) · C2 fond vs
palette maison · C3 % du cadre occupé par le sujet · C4 part de cadre vide.
À lancer **AVANT tout appel de modèle et AVANT toute présentation** — comme `mapbox-selfreview.py`.

Né de 3 défauts qui ont traversé plusieurs rendus sans être vus : globe silencieux de Mapbox (bascule
auto sous zoom ~5), fond `dark-v11` brut RGB(9,9,9) au lieu de la charte, cadrage jugé à l'œil.
⚠️ `--attendu-fond` ne vaut QUE si le fond est visible aux bords (globe, carte large) : sur une vue
pleine il mesure les terres, pas le ciel.

## make-comparatif-panel.py — planche A/B storyboard ↔ rendu (2026-08-22)

`python3 scripts/tools/make-comparatif-panel.py --storyboard SB.jpg --row 0|1 --panel 1-4 --render frame.png --out cmp.png`

UNE case de storyboard ↔ UNE frame **pleine taille**, même hauteur.
⛔ **Ne JAMAIS empiler des vignettes** : Gemini ET Grok ont halluciné « le pays occupe 15-20 % du
cadre » alors que la mesure donnait 61 %. Sur planche propre, le même modèle diagnostique juste.

## ⛔ QUEL MODÈLE POUR QUELLE ENTRÉE (vérifié sur l'API OpenRouter, 2026-08-22)

| Modèle | Entrées | Usage |
|---|---|---|
| `openai/gpt-5.5` | file, image, text | ⭐ **meilleur relecteur de FRAME**, même sans avoir dessiné la planche (seul à repérer un manque narratif, seul à donner des px). Pas de vidéo. |
| `x-ai/grok-4.6` | file, image, text | bon sur sa propre planche. ⛔ `x-ai/grok-4.1` N'EXISTE PAS (HTTP 400 — 1 appel perdu). |
| `google/gemini-3.1-pro-preview` | + **video**, audio | le SEUL à juger du MOUVEMENT. |

⛔ **Un point de modèle ne s'applique jamais sans vérification** : sur 7 points reçus au comparatif
final, 2 étaient NUISIBLES (violer un interdit client, supprimer une décision d'Aziz).

## ⛔⛔ PROJETS `_client-sim/` — la review juge contre la MAUVAISE CHARTE (2026-08-27)

**Vécu 3 fois dans une même session** (repro Foster, plans 6/7/8) : `visual_review.py` a rendu des verdicts
du type « remplacez l'Amérique du Nord par de l'Afrique, appliquez la palette navy/or, ajoutez des données
à l'écran ». C'est la charte **GéoAfrique/Souverain** — or ces plans reproduisent une vidéo **client
britannique** (SaaS de familles d'accueil) : le Nebraska, l'imagerie satellite et l'absence de data-overlay
**sont le brief**, pas des défauts. Appliquer ces « critical fixes » aurait détruit le travail.

⭐ **Même famille que le faux-positif « palette navy » déjà corrigé plus haut par `--palette`** : le prompt
juge contre un registre codé en dur. La différence, c'est qu'ici c'est le SUJET et la DOCTRINE éditoriale
qui ne s'appliquent pas, pas seulement les couleurs.

**Conduite à tenir tant qu'il n'y a pas de flag dédié** :
1. Lancer la review quand même (le gate `pre-presentation-review.sh` l'exige pour tout `.mp4` sous `out/`).
2. **Annoter le `.review.json`** avec un champ `_note_orchestrateur` disant pourquoi le verdict est
   hors-sujet — ne PAS supprimer le fichier (traçabilité), ne PAS suivre ses recommandations.
3. Retenir seulement ce qui est vrai indépendamment de la charte (netteté, lisibilité, mouvement).
💡 Piste non faite : un `--charte {souverain|client-sim}` sur `visual_review.py`, exactement comme `--palette`.

## ⚠️ L'ORDRE QUI ÉVITE 3 BLOCAGES DU GATE (2026-08-27)

`pre-presentation-review.sh` vérifie qu'un `<mp4-sans-ext>.review.json` existe **au moment où la commande
d'upload est évaluée**. Donc :

⛔ `python3 visual_review.py X.mp4 --output X.review.json ; python3 upload-to-blob.py X.mp4`
   → **BLOQUÉ** : le hook lit la commande AVANT exécution, la review n'existe pas encore.
✅ Deux commandes SÉPARÉES : la review d'abord, l'upload ensuite.

Payé 3 fois dans la même session avant que je fasse le lien. Ce n'est pas un bug du hook — c'est un
PreToolUse, il ne peut voir que ce qui est déjà sur le disque.

## sfx-cues.py — OU placer les SFX, mesure sur l'IMAGE (2026-08-27)

`python3 scripts/tools/sfx-cues.py <video.mp4> [--crop W:H:X:Y] [--start S] [--end S] [--json out]`

Detecte les evenements VISUELS d'une video et sort des candidats de placement SFX prets a
coller (`{ at, src, vol }`). Trois familles, seuils **relatifs** a la video analysee :
| type | ce que c'est |
|---|---|
| `COUPE` | rupture franche, **rare et isolee** (elle domine ses voisines x2,5) |
| `APPARITION` | un element entre : l'encre augmente sans que tout change |
| `POSE` | un mouvement continu **s'arrete** — le temps fort qu'on oublie de sonoriser |

⭐ **Pourquoi l'image et pas l'audio** : sur un rendu Remotion avant mixage il n'y a AUCUN
audio a analyser ; et le pic sonore du montage d'un TIERS ne dit pas ou l'image bouge dans le
NOTRE (mesure repro Foster : 7 SFX sur 13 seulement tombaient juste).
⭐ **Valide objectivement** : ses 7 `COUPE` retrouvent exactement les 7 bornes de plans de la
reference Foster, mesurees a la main une par une pendant la session.
⚠️ Donne des CANDIDATS, pas une verite — il dit **OU**, jamais **QUOI**.
-> Methode complete : `memory/fiches/FICHE-AUDIO.md` § OU placer les SFX.

---

## ⭐⭐⭐ `motion-timing.py` — MESURER la structure d'un mouvement (zero LLM, zero cout)

> Cree le 2026-09-10 apres l'incident chill-meter (1 tour de revision client perdu).
> ⛔ **A ne pas confondre avec `motion-breakdown.py`** : celui-la fait DECRIRE le mouvement
> par des LLM (« ca tombe vite »), et son propre en-tete dit qu'il ne donne PAS de valeurs.
> Celui-ci MESURE : a quelle frame l'objet touche, si la chute accelere, ou partent les
> rebonds, quand l'image se stabilise, et si les attaques SONORES coincident.

```bash
# A. Sur la REFERENCE du client, AVANT de coder -> donne les constantes a coder
python3 scripts/tools/motion-timing.py ref-client.mp4 --max-frames 30

# B. Sur NOTRE rendu, AVANT de livrer -> verifie que la structure colle
python3 scripts/tools/motion-timing.py notre-rendu.mp4 --max-frames 55 \
    --zone 120,700,820,1070      # si l'arriere-plan bouge (plateau filme, video dessous)
```

**Preuve qu'il attrape le vrai defaut** (meme commande sur les 2 versions du chill-meter) :

| | version REJETEE par la cliente | version corrigee |
|---|---|---|
| Depart du rebond | f12 = **+3 ⛔ DECROCHE DU CONTACT** | f10 = +1 OK |
| Nombre de pics | **3** (= son « moving up and down afterward ») | 2 |
| Stabilisation | f50 (1,67 s) | f42 (1,40 s) |

⛔ **Le chiffre qui compte est le DEPART du rebond, pas son sommet.** Un rebond sain part au
contact et culmine 3-6 frames plus tard (mesure sur la reference cliente : contact f8, sommet
f13 — ce rebond-la est exemplaire). Un seuil pose sur le sommet produit un faux positif sur
une video parfaite ; l'outil corrige remonte la courbe jusqu'a la 1re frame de remontee.

⚠️ **Limite connue** : sur un montage avec le son du plateau (voix/musique du client), la
detection d'attaques sonores est polluee — lire alors la seule partie visuelle, ou mesurer
sur la version sans son de plateau.

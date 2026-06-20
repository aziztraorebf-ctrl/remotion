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
>
> **MODE D'EMPLOI du gate fiabilisé** (passer les frontières d'états = activer l'appariement) :
> ```bash
> python3 scripts/visual_review.py <render.mp4> --model gemini \
>   --storyboard <planche.png> --ratio 16:9 \
>   --state-boundaries "1.2,4.8,9.0"   # secondes au cœur de chaque état (du breakdown)
> ```
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

⚠️ Le hook ne JUGE pas le goût — il vérifie qu'une review OBJECTIVE a eu lieu (score/verdict/fraîcheur). Le jugement d'Aziz prime toujours sur le score. Détail conception : `memory/PLAN-SYSTEME-ANTI-FOUILLIS.md` (Chantier B).

---

## ⭐ LE SYSTÈME PRINCIPAL — `da-brief.py` (upstream + downstream unifié)

**`scripts/tools/da-brief.py`** est LE système de review externe. À utiliser par défaut pour TOUTE review (plan ou rendu).
- **3 voix** : Gemini 3.1 Pro (`gemini-3.1-pro-preview`) + Kimi K2.5 (`moonshotai/kimi-k2.5`) + DeepSeek V4 (`deepseek/deepseek-v4-pro`, 3e voix CONCEPTUELLE, ~10-20× moins chère, TEXTE only).
- **2 modes** :
  - `--upstream` (PRÉVENTIF) : review du PLAN AVANT d'écrire du code. Active `--expert` + DeepSeek par défaut. C'est le mode du **DA-BRIEF-GATE** (`memory/doctrines/DA-BRIEF-GATE.md`).
  - mode normal (CORRECTIF / downstream) : review d'un RENDU (frames downscalées ou vidéo). DeepSeek OFF.
- **Synthèse extractive tracée OBLIGATOIRE** à chaque appel : extraire TOUTE idée par maille de travail, attribuer la source (G/K/D), trancher chacune (RETENU/OPTION/ÉCARTÉ + raison), fact-checker les chiffres. Format de réf : section « SYNTHÈSE TRACÉE » de `memory/episodes/warmap-sahel/PLAN-REFONTE-P4.md`.
- **MAX 1 appel / modèle / acte.** Doctrine complète : `memory/doctrines/DA-BRIEF-GATE.md`.

**Template de prompt downstream premium** (faire monter une version semi-finale en gamme, pas chasser les bugs) :
`memory/archive/doctrines-perimees-2026-06-19/REVIEW-PREMIUM-TEMPLATE.md` (archivé 2026-06-19 : portait une info Gemini-vidéo contredite par CLAUDE.md ; les 7 demandes de montée en gamme restent consultables. Review actuelle = `scripts/visual_review.py` + DA-BRIEF-GATE).

---

## OUTILS SPÉCIALISÉS (rôle distinct de da-brief, à garder)

| Outil | Rôle | Quand |
|---|---|---|
| `scripts/tools/mapbox-selfreview.py` | **Self-review SCRIPTÉE** d'un beat Mapbox (assertions automatiques : SFX dans `<Sequence>`, drapeaux = `useClipFlags`, getCam frame-driven, pas de filter:blur). Pas un LLM. | Phase 3 du pipeline Beat Mapbox, AVANT tout appel externe. BLOQUANT : 0 erreur avant review. |
| `scripts/tools/gemini-mapbox-review.py` | Review d'un beat **Mapbox** par Gemini → JSON scoré (bugs/clipping/timing + fix_code). CONSULTATIF. | Phase 4 du pipeline Beat Mapbox. 1 seul appel. |
| `scripts/visual_review.py` ⭐ | **Routeur multi-modèles** review d'un render (vidéo/image) : `--model kimi` (feedback narratif DA) / `qwen` (audit JSON) / `gemini` (review beat + storyboard → JSON code_values, recommandé). Remplace `review_with_kimi.py` (archivé). | Review standalone d'un rendu hors da-brief. Déjà appelé par beat-session/beat-breakdown. |
| `scripts/tools/kimi-mapbox-brief.py` | Brief Mapbox AMONT (caméra + overlays) par Kimi seul. | Préparer un brief carte avant code (alternative légère à da-brief upstream). |
| `scripts/tools/gemini-video-da-brief.py` ⭐ | **DA-brief VIDÉO premium (AVAL)** : upload la VIDÉO COMPLÈTE à Gemini 3.1 Pro (Files API, fiable) → critique premium par **analyse d'ÉCART vers des refs de niveau** (Bloomberg/FT/Economist, Vox/Kurzgesagt). Juge le MOUVEMENT / rythme / transitions / matière / SON (≠ frames figées). Cadré pour NE PAS rajouter de texte (protège l'épure). 3 sections (déjà au niveau / écarts qui comptent / mineur). CONSULTATIF — FILTRER après (signal, pas juge). | Quand une scène est FINIE et qu'on veut la faire monter en gamme premium (pas chasser des bugs). Tester la fiabilité upload d'abord (`gemini-video-upload-test.py`). Prouvé sur scène 0 Sénégal (2026-06-18). Distinct de `da-brief.py` (frames amont) et `gemini-mapbox-review.py` (JSON bugs). |

---

## OUTILS DE GÉNÉRATION (pas de la review — ne pas confondre)

`gemini-gen-image.py`, `gemini-i2i.py`, `gemini-thumbnail-*.py`, `gemini-storyboard-panels.py`, `test-gemini-tts*.py`
= génération d'assets (image / storyboard / TTS), pas de la review. Voir `memory/tools/gemini.md`.

Bloc-prompt réutilisable templates carte (à coller dans un prompt Gemini) : `memory/tools/BRIEF-GEMINI-TEMPLATES-CARTE.md`.

---

## Archivés (ad-hoc de session, ne pas relancer)

- `scripts/tools/_archive/gemini-p3-review.py` — hardcodé P3 Sahel (12 juin). Le standard généralisé = `REVIEW-PREMIUM-TEMPLATE.md`.

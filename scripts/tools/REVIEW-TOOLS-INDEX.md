# OUTILS DE REVIEW EXTERNE (LLM) — quel outil pour quoi

> Source de vérité unique : quel script lancer pour faire reviewer un plan ou un rendu par un modèle externe.
> Créé 2026-06-15 (les outils s'étaient accumulés sans doc). Modèles VERROUILLÉS : voir CLAUDE.md « MODÈLES API ».
> RÈGLE D'OR commune : **les modèles externes sont CONSULTATIFS, jamais juges.** Ils hallucinent (surtout sur le
> mouvement, sans son). Procédure : 1 appel → vérifier chaque point contre les frames réelles → appliquer
> seulement ce qui est VRAI → STOP. Jamais de boucle modèle→fix→modèle. Le jugement d'Aziz prime toujours.

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
`memory/doctrines/REVIEW-PREMIUM-TEMPLATE.md` (standard validé Aziz, donne d'excellents résultats).

---

## OUTILS SPÉCIALISÉS (rôle distinct de da-brief, à garder)

| Outil | Rôle | Quand |
|---|---|---|
| `scripts/tools/mapbox-selfreview.py` | **Self-review SCRIPTÉE** d'un beat Mapbox (assertions automatiques : SFX dans `<Sequence>`, drapeaux = `useClipFlags`, getCam frame-driven, pas de filter:blur). Pas un LLM. | Phase 3 du pipeline Beat Mapbox, AVANT tout appel externe. BLOQUANT : 0 erreur avant review. |
| `scripts/tools/gemini-mapbox-review.py` | Review d'un beat **Mapbox** par Gemini → JSON scoré (bugs/clipping/timing + fix_code). CONSULTATIF. | Phase 4 du pipeline Beat Mapbox. 1 seul appel. |
| `scripts/review_with_kimi.py` | Review générique (vidéo/image) par Kimi K2.5, backend Moonshot natif (base64). | Review Kimi standalone hors da-brief (ex. compositing pixel art). Cité dans CLAUDE.md config QA. |
| `scripts/tools/kimi-mapbox-brief.py` | Brief Mapbox AMONT (caméra + overlays) par Kimi seul. | Préparer un brief carte avant code (alternative légère à da-brief upstream). |

---

## OUTILS DE GÉNÉRATION (pas de la review — ne pas confondre)

`gemini-gen-image.py`, `gemini-i2i.py`, `gemini-thumbnail-*.py`, `gemini-storyboard-panels.py`, `test-gemini-tts*.py`
= génération d'assets (image / storyboard / TTS), pas de la review. Voir `memory/tools/gemini.md`.

Bloc-prompt réutilisable templates carte (à coller dans un prompt Gemini) : `memory/tools/BRIEF-GEMINI-TEMPLATES-CARTE.md`.

---

## Archivés (ad-hoc de session, ne pas relancer)

- `scripts/tools/_archive/gemini-p3-review.py` — hardcodé P3 Sahel (12 juin). Le standard généralisé = `REVIEW-PREMIUM-TEMPLATE.md`.

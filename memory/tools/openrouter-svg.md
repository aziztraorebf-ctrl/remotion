# OpenRouter pour la generation SVG — GLM-5.2 (3e modele low-cost)

> R&D 2026-06-24 (branche `rnd/svg-qwen3.6-test`). Test de modeles OpenRouter pour generer du SVG
> (jetons, assets, scenes) a cote de nos modeles principaux GPT-5.5 + Gemini 3.1 Pro.
> Verdict : **GLM-5.2 adopte comme 3e modele complementaire low-cost. Qwen3.6 et MiniMax M3 ecartes.**

## Role de GLM-5.2 (ce qu'on a decide)

- **GPT-5.5 + Gemini 3.1 Pro restent les modeles PRINCIPAUX** des scenes (Gemini = organique/illustration, GPT = geometrie/schema). On ne change rien a ce pipeline.
- **GLM-5.2 = 3e modele, COMPLEMENTAIRE**, appele pour :
  1. **Jetons / pictogrammes / petits assets SVG en lot** (une planche de N jetons en 1 appel). Usage prouve : `scripts/tools/llm-gen-svg.py --provider glm`.
  2. **Generer plusieurs elements SVG varies pour une scene quand on veut de la qualite** (ex. assets pour une video AES). Il sort des planches d'assets de bon niveau.
  3. **Option de test / 3e voix** quand on veut comparer ou explorer.
- ⛔ **PAS les drapeaux de carte Mapbox** : la regle E2 (`useClipFlags` = vraies images de drapeaux, check bloquant dans `mapbox-selfreview.py`) reste inchangee. GLM genere des assets/pictos, pas les drapeaux geo-ancres.
- ⛔ **PAS le pipeline scenes narratives principal** : ca reste GPT/Gemini.

## Modele exact + prix (OpenRouter)

| Modele | ID OpenRouter | Prix /M tok (in/out) | Vision |
|---|---|---|---|
| **GLM-5.2** (adopte) | `z-ai/glm-5.2` | $1.40 / $4.40 | ❌ TEXT-ONLY |
| GPT-5.5 (principal) | `openai/gpt-5.5` | $5 / $30 | oui |
| Gemini 3.1 Pro (principal) | (API Google directe) | frontier | oui |

GLM = ~5-7x moins cher que GPT-5.5 sur ce qu'il sait faire. Cout d'une planche de 5 jetons ≈ 0,04 cent.

## Gotchas GLM-5.2 (NON-NEGOTIABLE avant appel)

1. **TEXT-ONLY** : pas de vision → on NE PEUT PAS joindre d'image-ref. Le registre doit etre **decrit verbalement** dans le brief, **sans contradiction interne** (cause prouvee du ratage : un brief "paper-cut colore" qui ecrasait un override "encre" → GLM a suivi le corps du brief, pas l'en-tete).
2. **Ne PAS limiter `max_tokens`** : GLM a un mode raisonnement ; un `max_tokens` bas fait que le raisonnement consomme tout et la sortie est vide (`content: None`).
3. **Peut wrapper le SVG dans un HTML + animations CSS** (gotcha Simon Willison) → a l'extraction, **strip le `<style>`/CSS et ne garder que le `<svg>` statique** (notre doctrine interdit le CSS ; l'animation se fait par frame en Remotion).
4. **Vitesse** : ~45-60s pour une planche de jetons (rapide), 3-5 min pour une scene complexe (acceptable).

## Verdict comparatif (4 modeles testes, sur NOS registres reels)

| Modele | Geometrie / technique / schema / jetons | Organique / encre | Vitesse | Validite SVG | Statut |
|---|---|---|---|---|---|
| **GLM-5.2** | ⭐ excellent (≈ GPT-5.5), gagne les jetons 4/5 vs Qwen | faible sur encre (arbre naif) | ok | propre | **ADOPTE (3e modele)** |
| Qwen3.6-35B-A3B (`qwen/qwen3.6-35b-a3b`, $0.14/$1, vision) | tres bon | maigre | ⭐ rapide | parfois invalide (pas de `<svg>` racine, attr dupliques) | ECARTE (un cran sous GLM, ecart prix derisoire) |
| MiniMax M3 (`minimax/minimax-m3`, $0.30/$1.20, vision) | ⭐ excellent (le + fini sur offshore) | (non teste) | ❌ ~7 min/scene | ❌ camelCase JSX a convertir | ECARTE (lenteur impraticable) |
| GPT-5.5 / Gemini 3.1 Pro | references | Gemini = roi organique | ok | propre | PRINCIPAUX (inchanges) |

## Pipeline prouve bout-en-bout (2026-06-24)

GLM genere → JSON `{tokens:{...}}` ou `{scene_svg, groups}` → on transforme en composants React `{f}` (jetons) ou groupes nommes (scene) → **animation par frame en Remotion** (zero CSS) → render.
- Jetons animes : `src/projects/_rnd/svg-scenes/GisementTokensGlm.tsx` + `JetonsGlmDemo.tsx`.
- Scene conceptuelle animee : `FluxPetroleAnimee.tsx` (+ `fluxPetroleGroups.ts`) — diagramme "hemorragie petroliere" niveau Bloomberg/Vox, directement utile aux encarts Souverain.
- Le JSX `f`-driven produit par GLM **compile et tourne dans Remotion sans retouche**.

## Nettoyage SVG (a faire a la lecture, tous modeles)

Fonction commune : extraire le `<svg>`/JSON, **strip `<style>`/CSS**, fix camelCase→kebab (ou l'inverse selon cible JSX), **dedup attributs** dupliques, **wrap dans `<svg viewBox=...>`** si le modele renvoie un fragment de `<g>` sans racine. (Fait a la main 6x pendant la R&D — a outiller si on industrialise.)

## Liens R&D (catbox, rendus de reference)

- Jetons GLM animes : https://files.catbox.moe/jmeup8.mp4 · planche : https://files.catbox.moe/bwmfsn.png
- Jetons Qwen (compare) : https://files.catbox.moe/mc9dpe.mp4 · planche : https://files.catbox.moe/sllx1s.png
- Flux conceptuel anime (GLM) : https://files.catbox.moe/hhftb1.mp4
- Scenes GLM : offshore https://files.catbox.moe/v9ifmb.png · excavatrice https://files.catbox.moe/xhmttd.png · flux https://files.catbox.moe/zzgy2v.png

Voir aussi : [[SVG-SCENES-GENERATIVES]] (doctrine SVG generatif). Modeles principaux : `memory/tools/gemini.md`, CLAUDE.md (bloc modeles verrouilles).

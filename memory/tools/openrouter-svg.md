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
| **GLM-5.2** | ⭐ excellent (≈ GPT-5.5), gagne les jetons 4/5 vs Qwen | faible sur l'ORGANIQUE VIVANT (arbre naif) ; mais l'encre NARRATIVE/schematique passe tres bien (marche CFA prouve) | ok | propre | **ADOPTE (3e modele)** |
| Qwen3.6-35B-A3B (`qwen/qwen3.6-35b-a3b`, $0.14/$1, vision) | tres bon | maigre | ⭐ rapide | parfois invalide (pas de `<svg>` racine, attr dupliques) | ECARTE (un cran sous GLM, ecart prix derisoire) |
| MiniMax M3 (`minimax/minimax-m3`, $0.30/$1.20, vision) | ⭐ excellent (le + fini sur offshore) | (non teste) | ❌ ~7 min/scene | ❌ camelCase JSX a convertir | ECARTE (lenteur impraticable) |
| GPT-5.5 / Gemini 3.1 Pro | references | Gemini = roi organique | ok | propre | PRINCIPAUX (inchanges) |

## Pipeline prouve bout-en-bout (2026-06-24)

GLM genere → JSON `{tokens:{...}}` ou `{scene_svg, groups}` → on transforme en composants React `{f}` (jetons) ou groupes nommes (scene) → **animation par frame en Remotion** (zero CSS) → render.
- Jetons animes : `src/projects/_rnd/svg-scenes/GisementTokensGlm.tsx` + `JetonsGlmDemo.tsx`.
- Scene conceptuelle animee : `FluxPetroleAnimee.tsx` (+ `fluxPetroleGroups.ts`) — diagramme "hemorragie petroliere" niveau Bloomberg/Vox, directement utile aux encarts Souverain.
- Le JSX `f`-driven produit par GLM **compile et tourne dans Remotion sans retouche**.

### Observation 2026-06-27 (scene CFA "bureau 1994", a RECROISER — PAS un verdict)
Brief verbal detaille (8 objets nommes, registre encre analytique, 16:9) → GLM a livre les 8 `<g id>` demandes,
registre respecte, ~174 hachures (suivi la consigne de detail), 0 CSS, propre. Cout 0,03$. Render : files.catbox.moe/arhoxr.png.
- ✅ FORT sur l'OBJET detaille isole (balance ciselee, tampon, fenetre gravee) + respect du registre decrit en mots.
  (Coherent avec ses reussites passees : carte etat-major, jetons, flux petrole — GLM sait BEAUCOUP de scenes, ne pas le sous-estimer.)
- ⚠️ Sur CETTE compo : profondeur/echelles/ancrage manques (fenetre qui flotte). MAIS cause probable = mon brief decrivait
  les objets SANS imposer la perspective/les plans. **A recroiser** avec un brief qui specifie profondeur + echelles relatives.
  ⛔ NE PAS graver "GLM faible en composition" : un seul essai, et il a tres bien compose ailleurs.
- Piste si confirme : **GLM dessine les objets premium → mise en scene/composition cote nous**. A tester, pas acquis.

## Nettoyage SVG (a faire a la lecture, tous modeles)

Fonction commune : extraire le `<svg>`/JSON, **strip `<style>`/CSS**, fix camelCase→kebab (ou l'inverse selon cible JSX), **dedup attributs** dupliques, **wrap dans `<svg viewBox=...>`** si le modele renvoie un fragment de `<g>` sans racine, **fixer les `""` parasites** (GLM/Gemini glissent parfois un guillemet en trop : `470"" />`). (Fait a la main pendant la R&D — a outiller si on industrialise.)

## ⭐⭐ COLORISATION TIMEE de l'encre (lecon 2026-06-25, NE PAS REPERDRE)

**Pour animer la colorisation d'une scene encre/gravure (le trait noir qui se REMPLIT de couleur — doctrine "encre = canevas pour couleur semantique timee"), il FAUT que le brief exige des SURFACES FERMEES colorisables.** Par defaut, GLM (et Gemini) dessinent des CONTOURS (trait, fill="none") — incolorisables : il n'y a aucune surface a remplir. Resultat v1 = marche reste plat, colorisation impossible (echec prouve).

**Le pattern qui marche** (prouve, marche CFA) :
1. Brief : exiger un groupe `<g id="couleurs">` contenant UNIQUEMENT des **formes fermees pleines** (`<path>/<ellipse>/<circle>` avec `fill="<couleur>"`), placees DESSOUS le trait dans le code. Donner les teintes exactes (douces, aquarelle). Les contours+hachures d'encre vont par-dessus, dans les groupes d'objets normaux (fill="none").
2. ⚠️ **GOTCHA CRITIQUE** : le modele met souvent un groupe WRAPPER racine (`id="scene"`) qui ENGLOBE tout, **couleurs comprises** → la couleur apparait en double ET non animee. A l'extraction, **neutraliser les fills couleur dans le groupe wrapper** (`fill="<couleur>"` → `fill="none"`) pour que SEUL le groupe `couleurs` (anime) porte la couleur.
3. Animation : `<Grp body={COULEURS} opacity={clampI(f, debut, fin)} />` → la couleur monte en opacite = l'encre se remplit. Le reste (trait, produits) reste a 1.

Preuve : marche se dessine au trait noir (colorise=0) PUIS se remplit (tomates rouges, riz beige, balance or). Frames : https://files.catbox.moe/fe3u3g.mp4 (beat 2).

## Liens R&D (catbox, rendus de reference)

- Jetons GLM animes : https://files.catbox.moe/jmeup8.mp4 · planche : https://files.catbox.moe/bwmfsn.png
- Jetons Qwen (compare) : https://files.catbox.moe/mc9dpe.mp4 · planche : https://files.catbox.moe/sllx1s.png
- Flux conceptuel anime (GLM) : https://files.catbox.moe/hhftb1.mp4
- Scenes GLM : offshore https://files.catbox.moe/v9ifmb.png · excavatrice https://files.catbox.moe/xhmttd.png · flux https://files.catbox.moe/zzgy2v.png

Voir aussi : [[SVG-SCENES-GENERATIVES]] (doctrine SVG generatif). Modeles principaux : `memory/tools/gemini.md`, CLAUDE.md (bloc modeles verrouilles).

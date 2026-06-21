# REPRISE — SCÈNE 1 V3 (état au 2026-06-21)

> ⚠️ BRANCHE RÉELLE = `feat/elagage-systeme` (le travail Sénégal y vit, PAS `feat/senegal-v3-refonte`).
> Vérifier l'état RÉEL dans le code/les renders, pas cette note seule.

## ✅ INTRO COIN-FLIP — état : 2 VOIES coexistent, à trancher

L'intro scène 1 = duel des récits = COIN-FLIP 3D. Texte voix (alignment, intro démarre à 0s) :
« Ces deux récits, on les entend partout. D'un côté, des multinationales qui pompent et repartent.
De l'autre, une nation qui reprend enfin son destin en main. Mais la réalité se joue ailleurs... »
Beats calés : pièce f0 / malédiction pleine f483 ("pompent") / FLIP f555 ("De l'autre") / fissure f672 ("se joue ailleurs") / verdict "L'ENVERS DU DÉCOR" / sortie f735.

### VOIE A — BITMAP (validée fonctionnellement) — `SenegalScene1IntroCoin.tsx`
- Faces = illustrations GPT-image projetées : Face A navire+derrick rouge, Face B arbre à billets (monument
  occidental REJETÉ par Aziz → arbre = l'illusion de l'eldorado). Assets : `public/.../beat0/assets/coin/`.
- Animation premium (3 modèles convergents) : specular sweep + parallaxe fond + slow scale + ombre + UN label
  ("EXTRACTION OFFSHORE / les revenus repartent"). Titres FACE A/B SUPPRIMÉS. Fond quadrillé blueprint.
- Vraie FISSURE (pièce fendue en 2 + éclats), pas une ligne. Texte fin "L'ENVERS DU DÉCOR".
- Dernier render : v13 → catbox `ju4pmq`. **Limite** : le bitmap est figé, on l'anime de l'extérieur seulement.

### VOIE B — SVG GÉNÉRATIF ANIMÉ (nouvelle voie prouvée, préférée Aziz) ⭐
- `SenegalCoinFaceA_SVG.tsx` + probe `SenegalCoinSVGProbe.tsx`. SVG Gemini (groupes #ship #derrick #pumphead
  #waves), animé PAR PARTIES : océan respire + derrick pompe + navire CHARGE puis FADE ("repartent").
- Registre stylisé (= hook parchemin, préféré au réaliste figé). Net à toute taille, couleurs modifiables.
- ⛔ GOTCHA gravé : ne JAMAIS sortir un élément du cadre clippé (artefact) → avance légère + fade out.
- Protos : `out/_r-and-d/svg-anime-coin/` (proto-svg-faceA-charge-fade.mp4 → catbox `w9pn0p`). FACE B (arbre)
  en SVG + intégration dans le CoinFlip 3D complet = PAS encore fait.
- Doctrine complète : `memory/key-learnings.md` section "🎨 SVG GÉNÉRATIF ANIMÉ".

## ▶ NEXT (décisions ouvertes)
1. **TRANCHER la voie** : bitmap v13 (prêt) OU SVG animé (plus beau potentiel, reste à finir Face B + intégration).
   Aziz penche SVG (stylisé animable). Tester GPT-5.5 SVG quand provider OpenRouter OpenAI rétabli (down le 21/06).
2. Si SVG : faire Face B (arbre à billets) en SVG animé + brancher les 2 faces dans le CoinFlip 3D (flip + fissure
   par paths + sweep/parallaxe). Caler le geste sur la voix.
3. Puis BARIL 60% (storyboard Gemini prêt) puis GISEMENTS sur carte Mapbox.

## SYSTÈME (acquis de la session 2026-06-21)
- Hook `pre-presentation-review.sh` : ajout OVERRIDE TRACÉ (`.review-override.md` daté > mp4) — débloque les faux
  positifs Gemini SANS contournement silencieux (justif écrite obligatoire). Gemini hallucine sur scènes à phases.
- Méthode "références chaînes" gravée dans `DA-BRIEF-GATE.md` (remplace la question généraliste).

## POINTEURS
- Diagnostic 8 scènes : `DIAGNOSTIC-GLOBAL-8-SCENES.md` · Storyboard : `STORYBOARD-SCENE-1-PREMIUM.md`
- Audio V3 + alignment : `public/souverain/senegal-petrole-gaz/audio/` (narration-v3-VALIDEE.mp3, scene1-alignment.json)
- Storyboard réf à jour : `storyboards-scene1/intro-recits-REF-v3-gemini.png`

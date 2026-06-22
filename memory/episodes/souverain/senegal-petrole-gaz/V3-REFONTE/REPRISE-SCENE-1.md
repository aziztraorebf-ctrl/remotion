# SCÈNE 1 V3 — INTRO COIN-FLIP : ✅ FINALE (validée Aziz 2026-06-22)

> ⛔ ANTI-CONFUSION ASSEMBLAGE — LIRE EN PREMIER.
> **LE livrable FINAL de l'intro scène 1 = `out/episodes/senegal-petrole-gaz/scene1-intro-coin-FINAL.mp4`** (30s).
> **LE composant source = `src/projects/_proto-16-9/SenegalScene1IntroCoin.tsx`** (compo Root `SenegalScene1IntroCoin`).
> Faces SVG : `SenegalCoinFaceA_SVG.tsx` (malédiction) + `SenegalCoinFaceB_SVG.tsx` (eldorado).
> Render de référence : catbox `ky7j6l`. Commit `f9a395b`.
> ⛔ TOUT le reste est PÉRIMÉ : versions bitmap (v8→v16), `faceA/B-*-gpt.png` (bitmap, abandonnés au profit du SVG),
> ancien `SenegalScene1Intro.tsx`, `SenegalScene0.tsx`. NE PAS les utiliser à l'assemblage.

## CE QU'EST LA SCÈNE FINALE
Duel des récits = une PIÈCE 3D (CoinFlip) 100% SVG animé (voie "stylisé animable", pas bitmap) :
- **Face A "LA MALÉDICTION"** : gravure navire+derrick. Animée : derrick pompe, océan RESPIRE puis NOIRCIT
  (or→pétrole) sur "ces deux récits", navire CHARGE puis s'efface sur "pompent", nuages dérivent.
- **FLIP 3D** → **Face B "L'ELDORADO"** : arbre à billets. Feuillage frémit, pièces tombent. S'oxyde avant la fissure.
- **FISSURE** : la pièce SVG se fend en 2 moitiés (clip CSS) + éclats. Verdict "L'ENVERS DU DÉCOR".
- Labels de récit transitoires sous la pièce (fade 2-3s). Pièce DIAM 760, fond blueprint navy.

## AUDIO (calage exact — NE PAS recasser à l'assemblage)
Fichier : `narration-v3-VALIDEE.mp3` (narration COMPLÈTE 492s). Le segment intro/duel = **20.08s→48.95s ABSOLU**.
Dans le composant : `<Audio startFrom={20.08*30} endAt={48.95*30}>`. Coupe pile après "...les tester en direct"
(ne PAS laisser enchaîner sur "Première chose à comprendre" = scène GISEMENTS, séparée).
Alignment : `scene1-alignment.json` (relatif au début du duel, +20.08s pour l'absolu). WINDOW_OFFSET=20 (cf. `scripts/senegal-scene1-alignment.py`).

## ⛔ BRANCHE / MULTI-INSTANCE
Le travail Sénégal a transité par plusieurs branches (working tree partagé multi-instance) :
`feat/elagage-systeme` → `feat/svg-scenes-chaud-16-9-soudan` (commit final f9a395b). Vérifier `git log` pour l'état réel.

## ▶ NEXT scène 1 (après l'intro)
1. BARIL 60% (storyboard Gemini prêt) — abstrait → Remotion/Data-Hero.
2. GISEMENTS (Sangomar/GTA/Yakaar) — spatial → carte Mapbox. Démarre sur "Première chose à comprendre" (29.5s).
3. Puis assemblage des 8 scènes V3.

## ACQUIS DE SESSION (réutilisables, gravés)
- Voie SVG génératif animé par parties : `memory/key-learnings.md` §SVG GÉNÉRATIF ANIMÉ. Gemini > GPT pour le SVG de scène.
- Règle des 5s "vivante" (étaler/vie de fond/caler sur mots/respiration) : `CONTINUITE-SCENE-INTENTION-DABORD.md`.
- Méthode "références chaînes" pour interroger les modèles : `DA-BRIEF-GATE.md`.
- Hook `pre-presentation-review.sh` : override tracé (`.review-override.md`) anti faux-positif Gemini.
- Protos préservés : `out/_r-and-d/svg-anime-coin/`.

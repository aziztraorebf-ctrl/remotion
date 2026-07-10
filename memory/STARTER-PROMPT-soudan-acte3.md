---
name: STARTER-PROMPT-soudan-acte3
description: Prompt de reprise — coder la révision de mise en scène de l'Acte 3 Soudan (« Suivre l'or »). Script+audio verrouillés, breakdown v2 écrit, code v1→v3 rendu mais mise en scène à revoir (caméra suiveuse, feedback flèches, split-screen beat 7).
metadata:
  type: project
---

# STARTER — SOUDAN ACTE 3 (« SUIVRE L'OR ») — REPRISE MISE EN SCÈNE

> Script v7 verrouillé, audio verrouillé (validé à l'oreille Aziz), breakdown technique v1 écrit PUIS
> révisé v2 (retours jury Kimi/Gemini sur le render v3 + référence vidéo Silk Road retrouvée par Aziz).
> `SoudanActe3.tsx` codé et rendu v1→v3, mais le v3 reflète encore l'ANCIENNE mise en scène (breakdown v1).
> **Cette session = coder la révision v2 dans le code, PAS repartir de zéro.**

## Avant toute réponse technique, lis dans cet ordre :
1. `memory/episodes/soudan-midform/STATUS.md` — état complet Acte 3 (section dédiée en tête).
2. `memory/projects/soudan-midform-ACTE3-BREAKDOWN.md` — **section "RÉVISION v2" en tête = LA référence
   à coder.** Le reste du doc (v1) garde coordonnées géo/composants/assets, mais camKeys/beat 7 du bas de
   page sont SUPERSEDED par la v2.
3. `memory/projects/soudan-midform-ACTE3-SCRIPT.md` — script v7 (texte INCHANGÉ, ne pas retoucher).
4. `memory/_r-and-d-mapanimation-ANALYSE.md` (lignes 47-53) — gap caméra-suiveuse + référence Silk Road.

## Étapes de la session (ordre) :
1. **Caméra suiveuse (Décision 1 + 1bis du breakdown v2)** : écrire `cameraFollowsPath(waypoints, t, zoom)`
   — recalcule une `CamKey` dynamique à partir de la position du marqueur `GeoFlowConnection` au lieu
   d'une séquence figée. Référence visuelle : `_incoming/silk road 2.mov` (zoom serré permanent sur le
   point courant, JAMAIS de vue d'ensemble). Appliquer aux beats 3 et 5.
2. **Feedback aux impacts (Décision 2-3)** : pictogrammes SVG simples (lingots, drones RSF/SAF) codés à
   la main — 2-3s d'apparition puis disparition, PAS de widget permanent. Pas d'appel GLM pour ça (formes
   trop simples).
3. **Beat 7 en vrai split-screen (Décision 4, RÉVISÉE 2 fois — lire l'encart correction dans le
   breakdown)** : utiliser `WarMapSplitScreen` (`src/projects/warmap/_shared/WarMapSplitScreen.tsx`,
   composant PROD EXISTANT, gère 2-3 volets nativement) — PAS recoder un panneau custom. Le 1er
   prototype (`Acte3DashboardTest.tsx`, panneaux flottants) a été testé et REJETÉ par Aziz, supprimé.
   **À trancher en premier avec Aziz** : contenu des 3 volets — volet central Mapbox Soudan quasi-certain,
   volets latéraux EAU/Turquie encore ouverts (vraies vues Mapbox indépendantes vs 2D flat/SVG simple).
4. Re-render, self-review (`scripts/tools/mapbox-selfreview.py`), audit visuel Claude AVANT présentation,
   re-présenter à Aziz.

## Socle technique déjà là (réutiliser tel quel, NE PAS re-coder) :
- Moteur carte : `SoudanWarMapEngine.tsx` (children() expose maintenant aussi `mapRef`, 2e argument).
- `GeoFlowConnection.tsx` (`_shared/`) : tracé courbé + marqueur mobile indépendant + transformation
  couleur — déjà prouvé, réutilisé tel quel pour les 3 trajets (or/drones/Turquie).
- `CountryColorLayer` (dans `SoudanActe3.tsx`) : aplat de couleur nationale au dézoom large — nuance
  doctrine tranchée, cf `CARTO-OVERLAYS-PRINCIPES.md` (aplat pays externe ≠ anti-pattern aplat-faction).
- `WarMapSplitScreen` (`_shared/`) : split 2-3 volets, production validée — à utiliser pour le beat 7.
- Assets : `mine-or-td`, `dubai-hub-td`, `suakin-dock-td`, drapeaux `ae/tr/eg.png`.

## Non-négociables (hérités v1, toujours valides) :
- Grammaire AES (contour permanent, halos locaux jamais d'aplat sur le SOUDAN — nuance pays externes OK).
- ⛔ R-V5 objet orphelin : objet figuratif nommé par la voix, sinon confus.
- ⛔ Nom propre à l'écran → Wikipédia AVANT render (`Hemedti`, whisper l'écrit "Emmettie" — piège connu).
- Render plein format (`scripts/render-mapbox.sh`, scale=1). Review = signal jamais juge.
- `_incoming/silk road 1.mov` et `2.mov` : référence essentielle, NE PAS SUPPRIMER.

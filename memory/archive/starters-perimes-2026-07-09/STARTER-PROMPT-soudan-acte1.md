> ✅ **FAIT (2026-07-07 s3)** — l'Acte 1 a été construit (v5-FINAL, candidat validé). Ce starter est PÉRIMÉ par succès.
> Prochain point de reprise = **ACTE 2** (session dédiée) : voir `episodes/soudan-midform/STATUS.md` + `projects/soudan-midform-STORYBOARD-ACTE2.md`.

---
name: STARTER-PROMPT-soudan-acte1
description: Prompt de démarrage — construire l'Acte 1 du mid-form Soudan sur le socle carte validé (session 2026-07-07 s2).
metadata:
  type: project
---

# STARTER — Soudan mid-form, CONSTRUCTION DE L'ACTE 1

Reprise Soudan mid-form — on CONSTRUIT l'Acte 1 (carte Mapbox) sur le socle validé.

Avant toute réponse technique, lis dans cet ordre :
1. memory/episodes/soudan-midform/STATUS.md (§ SOCLE CARTE SOUDAN + § PROD ACTE 1)
2. memory/doctrines/WARMAP-GRAMMAIRE.md (les 2 ⭐⭐ en tête : contour permanent+intérieur vide ; halo local jamais aplat)
3. memory/projects/soudan-midform-STORYBOARD-ACTE1.md (les 9 beats + garde-fous)
4. src/projects/warmap/SoudanTestFinal.tsx (⭐ LE CODE DE RÉFÉRENCE — s'y fier pour tout)

## CE QUI EST DÉJÀ FAIT & VALIDÉ (session 2026-07-07 s2, commit 0bfe76b, branche feat/warmap-insert-2factions)
- **Hook "l'or du Darfour"** VALIDÉ (out/PRET-PUBLICATION/soudan-midform/hook-or-darfour-VALIDE.mp4).
- **Socle carte Soudan** `engine/SoudanWarMapEngine.tsx` + `engine/soudanActors.tsx` — grammaire AES
  reproduite et validée pièce par pièce. API : camKeys · zones (halos locaux) · highlights (états qui se
  tracent, persistants) · stateLineOpacity · showNationalBorder · children(proj).
- Validé : voile khaki troué · contour permanent + intérieur vide · halos LOCAUX (jamais d'aplat) ·
  "on nomme → ça se trace" (contour coloré persistant, cumul de couleurs) · jetons AES mobiles + sillage
  cinétique (⚠️ mouvement RESSERRÉ sinon sillage invisible) · objet iso 3D (base-fr-td.png = vrai fort) ·
  ZOOM SERRÉ ~5.5 = zoom de BASE · retour à l'état vide. Réf render : catbox i12jyw.

## OBJECTIF SESSION = CONSTRUIRE L'ACTE 1 (9 beats) sur ce socle
Se fier à SoudanTestFinal.tsx pour : où placer un jeton, la plaque-nom (design+position), halos,
highlight, sillage, base iso, zoom. Les 9 beats : Hemeti garde les mines → il fait la guerre/gagne →
Soudan 3e plus grand pays/50M → 2e général al-Burhan EN MIROIR (carte se fend est/ouest) → civils pris
au piège → crise humanitaire → PLEIN ÉCRAN "25 millions" → question centrale → "il faut suivre l'or"
(dézoom or, pont Acte 3). Câbler sur l'audio Acte 1 fact-checké (public/_shared/audio/soudan/acte1-factcheck.mp3).

## ⛔ NON-NÉGOCIABLES DE CETTE SESSION
- **VRAIS VISAGES** Hemeti + al-Burhan (personnes réelles) → générer les jetons à partir de VRAIES
  PHOTOS (comme les généraux AES), PAS de portrait générique. Soldats OK génériques (portrait-rsf/saf).
  Recette jeton = cercle parchemin + bordure faction + photo clippée (cf SoudanToken).
- Base iso : régénérer avec drapeau neutre/soudanais (base-fr-td a un drapeau FR).
- Garde-fous storyboard Acte 1 : PAS de jetons-visages civils sur "50 millions" (points abstraits) ;
  "Fade to Background" des militaires quand les civils entrent ; plafond ~5-6 sprites.
- Render = plein format scale=1, juger le MOUVEMENT. Ne rien emporter des autres chantiers du working
  tree (VoxRepro, Short Sahel, svg-scenes = non à moi) : committer seulement mes fichiers Soudan.

Commence par me proposer un plan de la session (ordre des beats + génération des vrais portraits) avant de coder.

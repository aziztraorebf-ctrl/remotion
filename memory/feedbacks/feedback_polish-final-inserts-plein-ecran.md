---
name: "Polish final = phase légitime pour ajouter inserts plein écran (Atlas)"
description: "Une scène Atlas validée n'est PAS finale. Pendant le polish final (après tous beats codés), on peut couper la carte 2-4s pour insert plein écran (Gemini/PixelLab/Recraft) puis revenir. 1-2 inserts max par scène. Validé Aziz 2026-05-03 fin Beat 3 Empire Ghana."
type: feedback
---

> Migré depuis auto-memory le 2026-08-31, contenu original inchangé. Complète (n'est PAS dupliqué
> par) `rules/rules-atlas-production.md` RÈGLE 7, qui impose l'insert plein écran comme choix de
> FORME (chiffre/dataviz → plein écran, pas mini-objet à côté de la carte) — ce fichier-ci ajoute
> l'angle TIMING : le polish final (après tous les beats codés et assemblés) est le bon MOMENT pour
> ajouter ces inserts, pas seulement le storyboard initial.

# Polish final Atlas = ajouter inserts plein écran

> Validé 2026-05-03. Aziz : "il n'est jamais trop tard. Nous avons la scène validée, mais d'après ce que j'ai vu, il est très facile, peut-être quand nous allons faire la version finale, de couper et de mettre des insert et ensuite de revenir sur la carte. Ça ferait partie du polish final."

## La règle

**Une scène carte validée n'est pas finale.** Le polish final (après tous beats codés et assemblés) est une phase légitime pour :
- Insérer 1-2 plein écran par scène pour casser la monotonie
- Couper la carte 2-4s pour montrer un asset Gemini/PixelLab/Recraft
- Revenir sur la carte naturellement après

## Why

3 raisons :
1. **Anticiper inserts dès le storyboard est difficile** — on ne sait pas encore où la carte va vraiment paraître monotone à l'œil
2. **Le polish a une vue d'ensemble** que le beat-par-beat n'a pas (rythme global de l'épisode)
3. **Mansa Moussa V2** a fait ça (3 inserts dataviz Pie/Bar/Line pendant le polish) → preuve que ça marche

## Limites strictes

- **1-2 inserts max par scène** (pas 3+, devient saccadé)
- **Insert doit apporter VRAIMENT quelque chose** (pas pour décorer)
- **Durée 2-4s max** par insert (sinon casse l'engagement carte)
- **Retour fluide à la carte** après (fade ou cut net selon contexte)

## Exemples qui méritent un insert plein écran

| Type | Exemple Atlas | Format |
|------|---------------|--------|
| Chiffre marquant | "90 KG par bloc" | Homme à l'échelle + chiffre pulse |
| Date pivot | "1076" Almoravides | Date plein écran qui pulse + asset guerrier |
| Portrait personnage | Mansa Moussa, Sundiata | Asset Gemini/Recraft plein écran |
| Concept abstrait visualisable | Sécheresse | Terre craquelée Recraft/Gemini |
| Comparaison échelle | "20 000 habitants" | Grille de silhouettes qui apparaissent |
| Citation historique | Charte Mande | Texte enluminé sur parchemin |

## Exemples qui NE méritent PAS

- Mot prononcé 1-2s sans densité narrative
- Concept déjà visible/lisible sur la carte (route, frontière, POI)
- Variation mineure (changement saison, jour/nuit)
- "Pour faire joli" sans message narratif

## How to apply

**Pendant production beat-par-beat** : code juste la carte. Ne pas se forcer à insérer.

**Phase polish final** :
1. Regarder l'épisode complet assemblé
2. Identifier les segments qui paraissent monotones (>10s sans changement majeur de cadrage)
3. Pour chaque segment monotone, demander : "y a-t-il un chiffre/concept/personnage qui mériterait un insert plein écran ?"
4. Si oui : générer asset (Gemini/PixelLab/Recraft) + insérer dans la composition Remotion via `<Sequence>` qui interrompt brièvement la carte
5. Re-render + valider

## Anti-pattern

**"On ajoutera les inserts plus tard donc on n'a pas besoin d'y penser"** ≠ règle. La règle dit : **on PEUT ajouter pendant polish**. Mais si pendant le storyboard on identifie un insert évident (chiffre fort, date, portrait), le coder dès le beat est mieux.

## Référence

- Mansa Moussa V2 : 3 inserts dataviz (Pie/Bar/Line) ajoutés pendant polish — `src/projects/atlas/mansa-moussa/`
- Empire Ghana Beat 4 (à venir) : potentiel insert "1076" pour les Almoravides à évaluer pendant polish

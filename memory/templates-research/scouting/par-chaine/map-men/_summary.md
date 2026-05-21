# Map Men (Jay Foreman) — Synthèse Scout

**Chaîne** : youtube.com/@JayForeman
**Date scout** : 2026-05-08
**Vidéos analysées** : 3
**Format** : long-form 12-13min, ton presse britannique didactique, animation flat ultra-lisible

## Vidéos couvertes
| # | Titre | Durée | Verdict |
|---|---|---|---|
| 1 | The world's most annoying road | 13:22 | 🟡 |
| 2 | There are NOT 195 countries | 12:15 | 🟢 |
| 3 | The English divide nobody talks about | 13:04 | 🟢 |

## Verdicts par axe (consolidé chaîne)

### Axe 1 — Palette de couleurs : 🟡
Map Men utilise systématiquement une palette "atlas pour enfants" (pastels saturés, frontières noires épaisses, eau bleu pâle) qui est **éloignée** de l'identité Souverain (noir+or ledger). MAIS le **principe minimaliste** de la frame 3 (terre blanche + eau pâle + frontière fine + zéro fioriture) est transposable : remplacer terre blanche par or pâle, eau bleu par noir profond → on obtient une signature Souverain "minimaliste-didactique" complémentaire de l'esthétique ledger actuelle.

### Axe 2 — Assets / figures d'animation : 🟢
Plusieurs composants directement réutilisables :
- **Pen-stroke SVG animé** (ligne pointillée, ligne ondulée rouge) pour tracer divisions / frontières contestées
- **Boîte label rectangulaire blanche** + texte serif noir, posée près du territoire
- **Pin drapeau sur tige** + label allcaps sur territoire (compatible Mapbox symbol layer)
- **Fill drapeau-en-motif sur territoire spécifique** par-dessus basemap satellite (pattern hybride pour zones contestées)
- **Cartouche événement historique** (titre serif + dates + portraits + emblèmes)
- **Insert carte papier vintage** posé en overlay (texture archive)

### Axe 3 — Mouvements caméra : 🟢
Map Men inverse complètement le paradigme RealLifeLore : **carte statique + cuts secs + build-up séquentiel d'éléments par-dessus**. Pas de ken burns, pas de pan, pas de zoom. Le mouvement vient des éléments qui apparaissent (pen-stroke trace une ligne, labels apparaissent un à un, fills changent de couleur). Pour un Short Souverain qui doit citer 5-6 pays en 75-110s sans saturer, ce modèle est plus efficace que la caresse cinematic. **Pattern signature à backloguer en priorité.**

## Top 3 observations backlog

1. **Pen-stroke SVG animé pour divisions/frontières contestées** (priorité haute). Reproductible en Remotion natif via `strokeDasharray` interpolate. Coût animation quasi nul, impact narratif fort. Cas d'usage Souverain : tracer la ligne de partage Sykes-Picot, le mur des sables au Sahara occidental, le 38e parallèle pré-décolonisation, etc.

2. **Pattern minimaliste "carte-page-de-manuel"** (priorité haute). Carte statique + boîtes labels rectangulaires blanches + pen-stroke + zéro mouvement caméra. Format complémentaire à Or Africain V5 (qui mise sur ken burns). Adapter en palette noir+or pâle. À tester sur un épisode "didactique" type "Les 6 langues coloniales encore officielles en Afrique".

3. **Fill drapeau-en-motif sur territoire spécifique** (priorité moyenne) par-dessus basemap réaliste/satellite. Pattern fort pour scènes de revendication territoriale (Sahara occidental, frontières contestées, exclaves). Reproductible Mapbox via `fill-pattern` + SVG repeat. À tester sur épisode lié aux conflits frontaliers africains.

## Skip / non pertinent
- Tous les sketches live-action (parodie press conference, déguisements, sketch jardin) — non reproductibles sans tournage et hors brief Souverain
- La palette pastel "atlas enfant" en l'état — incompatible identité Souverain
- L'humour visuel signature Map Men (chroma key, costumes) — explicitement hors scope du brief

## Chemin
`/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine/map-men/_summary.md`

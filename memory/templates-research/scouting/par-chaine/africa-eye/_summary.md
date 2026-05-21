# Africa Eye (BBC) — Synthèse scouting

- Date scouting : 2026-05-08
- 3 vidéos analysées
- Format chaîne : YouTube long (7-50 min), 16:9, BBC News Africa
- Dossier : `/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine/africa-eye/`

## Vidéos analysées

| # | Titre | ID | Durée | Slug |
|---|-------|----|-------|------|
| 1 | Cameroon: Anatomy of a Killing | XbnLkc6r3yc | 11m06 | video-1-anatomy-killing-cameroon |
| 2 | Sudan's Secret Hit Squads | AuNDd_pteRQ | 11m26 | video-2-sudan-hit-squads |
| 3 | The Money Stone (Ghana) | nIBZ6QunLzc | 7m18 | video-3-money-stone-ghana |

## Verdict global : 🟢 (mode OSINT) / 🔴 (mode doc vérité)

Africa Eye = **deux modes parallèles** :
- Mode A — OSINT méthodologique (videos 1, 2) : satellite Google Earth + annotations rouges + barres dates + split-screen footage/satellite. **Reproductible 100%** dans notre stack.
- Mode B — Doc vérité caméra terrain (video 3) : non reproductible, hors scope.

## Verdicts par axe (mode A uniquement)

- **Palette : 🟢** — `#D0021B` rouge BBC + `#FFD500` jaune annotation + N&B satellite ou couleur naturelle. Sobre, reproductible. Compatible Souverain noir+or.
- **Assets : 🟢** — cercle rouge, arc rouge, trapèze rouge perspective, flèche jaune, barre date pleine largeur, label "Actor's voice", timeline pointillée, attribution "Google Earth/DigitalGlobe" coin haut-droit. Tous codables en SVG/Remotion natifs.
- **Caméra : 🟢** — push-in 3D Google Earth, pull-out, match-cut footage→satellite, ken burns subtle, reveal séquentiel d'annotations. Tous portables Mapbox + Remotion.

## Top 3 backlog applicable Souverain

1. **OSINT split-screen vertical 9:16** : footage UGC haut + Mapbox satellite bas, bande noire séparatrice 6px, arc rouge `#D0021B` connectant un détail entre les deux. Composant Remotion `<OsintSplitScreen>` à prototyper. Source : video 1 frame 003, 005.
2. **Annotation reveal séquentielle sur satellite** : trapèze perspective rouge → pause 1.5s → flèche jaune → pause 1s → label texte. Composant `<OsintAnnotation>` avec `appearsAt` séquencés. Source : video 2 frame 005, 006.
3. **Barre date rouge pleine largeur** : `<DateBar>` Remotion, `#D0021B` fill solide, texte blanc CAPS sans-serif, padding 60px h, centré. Réutilisable comme intertitre temporel Souverain. Source : video 1 frame 004.

## Comparaison avec Template E NYT VI "OSINT investigation" — consolide ou variante ?

**Verdict : Africa Eye CONSOLIDE Template E avec une variante britannique distincte mais cousine.**

Convergences (= preuve que Template E est un vrai langage cross-rédactions) :
- Satellite Google Earth/DigitalGlobe avec attribution coin haut-droit
- Annotations géométriques rouges sur satellite
- Match-cut footage UGC ↔ satellite
- Reveal séquentiel d'annotations
- Logique didactique "voici où, voici quand, voici qui"

Divergences britanniques propres à Africa Eye :
- **Rouge plein agressif** `#D0021B` au lieu du rouge plus orangé/atténué NYT (`~#C8102E` plus sourd chez NYT)
- **Barre date pleine largeur** (NYT préfère petits horodatages discrets coin)
- **Texte CAPS lourd sans-serif** (NYT mixte caps + minuscules, typographie plus serif/éditoriale)
- **Pas de network graph de personnages** (NYT investit beaucoup sur la cartographie de réseau, Africa Eye reste sur le terrain physique)
- **Footage UGC vertical recadré dans 16:9 avec flou latéral** : pattern fort Africa Eye absent du langage NYT
- **Attribution "Google Earth, DigitalGlobe" empilée à droite** au lieu d'inline NYT
- **Plus brut, moins éditorial** : moins de typographie secondaire, moins de transitions élégantes. C'est de l'investigation rapide TV-news, pas du long-form magazine

**Conséquence pour Souverain** :
- Template E reste **un seul template** (OSINT investigation), Africa Eye en est une déclinaison "TV-news rapide"
- On peut piocher chez NYT pour le raffinement éditorial (typo, espacement, transitions) ET chez Africa Eye pour le **rouge agressif + barre date + flou latéral footage UGC**
- Le **rouge `#D0021B` BBC est trop signature BBC pour qu'on le reprenne tel quel** : risque de confusion. Souverain devra trouver son propre rouge (un `#C03028` ? un orange-or `#D88A2A` ?) si le format E est retenu

## Ratio live / motion

- Video 1 (Anatomy of a Killing) : ~70% footage live + 30% motion (satellite annotations + split-screen)
- Video 2 (Sudan Hit Squads) : ~75% footage UGC + 25% motion (satellite + timeline)
- Video 3 (Money Stone) : ~95% footage live + 5% motion (carton titre uniquement)
- **Moyenne pondérée mode A : 27% motion reproductible** par la stack Souverain. Africa Eye dépend lourdement du footage terrain qu'on n'a pas. Pour un Short Souverain 100% Remotion, il faudra **densifier** le motion reproductible (passer 27% → 70-80%) ce qui revient à se rapprocher d'Or Africain V5 (Template A) avec emprunts ponctuels au vocabulaire OSINT Africa Eye.

## Chemin _summary.md

`/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine/africa-eye/_summary.md`

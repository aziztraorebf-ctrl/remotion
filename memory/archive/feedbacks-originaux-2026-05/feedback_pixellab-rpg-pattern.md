---
name: PixelLab RPG-pattern différenciateur Atlas
description: PixelLab permet de générer characters + map_objects + custom animations qui donnent un rendu RPG old-school sur les cartes Atlas. C'est notre signature visuelle vs autres créateurs.
type: feedback
---

## L'observation Aziz

> "Parfois la carte me faisait penser un peu à un RPG old-school avec les personnages qui marchent, etc. Pour d'autres histoires, si jamais on a créé, il y a des possibilités assez avancées comme par exemple de mettre plusieurs objets ensemble pour créer une scène de village avec des personnages qui interagissent, etc. Sur la carte. Avoir plusieurs points, plusieurs objets qui restent sur la carte durant de nombreuses scènes qui ne bougent pas. Stimuler peut-être des gens qui interagissent entre eux, des armées qui se battent, etc."

— Aziz 2026-05-04

## Pourquoi c'est important

PixelLab est notre **différenciateur** vs les autres créateurs de Shorts éducatifs. Les concurrents utilisent :
- Stock footage (impersonnel)
- Animations générées par IA générative (incohérent entre frames)
- Illustrations statiques (rien ne bouge)

Nous on a :
- Characters cohérents 4/8 directions × N animations × walk cycles
- Map_objects (villes, monuments) avec style cohérent
- Animations custom via prompt (war-cry, idle, attack, victory pose...)

## Patterns prouvés Empire Ghana

### Pattern 1 : Camera-track sprite sur carte
- Sprite walk-north avec walking-6-frames template
- Caméra suit la position SVG du sprite (helper `svgToCompWithCam`)
- Zoom 1.5-3.5x adaptatif
- Validé S3 Mansa Moussa + Beat 3 + Beat 4 Empire Ghana

### Pattern 2 : Formation file indienne
- Sprite leader + 1-3 sprites suiveurs avec retard temporel (10-22 frames)
- Décalage spatial (offset X/Y)
- Validé Beat 4 Empire Ghana (Sundiata + lancier + épéiste + sahelien)

### Pattern 3 : Custom animation pour moments clés
- Template animations (walking, crouching, idle) suffisent pour 90% des cas (1 generation)
- Custom animations (~25 generations) RÉSERVÉES aux moments signature
  - War-cry victorieux Sundiata
  - Walking-stable Sundiata (épée immobile près du corps)
- Coût total Empire Ghana : ~50 generations PixelLab pour 5 characters + 7 animations

### Pattern 4 : Map_object plein détail (ville, monument)
- create_map_object 128×128px high top-down
- Style cohérent avec sprites (palette sépia, pixel art)
- Persiste sur la carte pendant plusieurs scènes
- Validé Niani-Mali Beat 4-5

## Possibilités à explorer (Aziz brainstorm)

Pour les prochains épisodes Atlas :

1. **Scène village** : multiple sprites statiques (idle/breathing-idle) sur un map_object village, créant l'illusion d'une vie quotidienne
2. **Bataille** : 2 formations qui se rapprochent depuis différents POI, animation cross-punch ou kick à la rencontre
3. **Marché** : 3-5 sprites différents (marchand, acheteur, gardien) en idle autour d'un map_object stand-marché
4. **Caravane longue** : 5+ sprites en file avec retards 10-30 frames créant un train visuel
5. **Conseil de chefs** : 3-4 sprites en cercle autour d'un map_object palais (idle + breathing-idle alternés)

## Sujets idéaux pour ce pattern (post-Empire Ghana)

- **Hannibal** : formations militaires, traversée Alpes avec éléphants (PixelLab quadrupède bear/horse), bataille de Cannes en formation pince
- **Songhai post-Mansa Moussa** : Tombouctou avec mosquées + bibliothèques + sprites étudiants/marchands en idle
- **Royaume Kongo** : capitale Mbanza-Kongo avec interactions diplomatiques sprites
- **Royaume Aksum** : obelisks (map_objects) + caravanes mer Rouge

## Coût acceptable

- Tier PixelLab actuel : 2000 generations/mois, ~50 utilisées sur Empire Ghana
- Marge énorme pour pousser le pattern à fond
- Custom animations : 25 generations chacune, à réserver aux moments signature

## Règle d'usage

Pour chaque épisode Atlas, **planifier 1-2 moments PixelLab signature** qui justifient les custom animations. Le reste avec templates standards. C'est ce qui rend l'épisode mémorable sans exploser le budget.

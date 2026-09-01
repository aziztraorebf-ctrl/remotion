# Sketch/Doodle Style Guide - Proven Production Template

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — registre visuel prouvé en production
> (fev 2026, projet sketch-prototype "L'Anomalie de 1347") mais depuis abandonné en faveur des
> registres Souverain/Atlas/SVG maison actuels. Conservé car marqué "PROVEN" à l'époque, avec un
> ensemble de composants et de leçons de production détaillées potentiellement réutilisables.

## Overview
- **Project**: sketch-prototype (`/Users/clawdbot/Workspace/sketch-prototype/`)
- **Test video**: "L'Anomalie de 1347" - Black Plague data visualization (60s)
- **Version**: V3c (final test version)
- **Status**: PROVEN à l'époque - jugé prêt pour usage production
- **Aziz feedback**: "beaucoup, beaucoup plus interessant qu'avant" (après V3c avec lunettes + expressions)

## Identité visuelle

### Palette de couleurs
- **Background**: #F5F0E1 (warm cream/paper)
- **Primary text/lines**: #2C2C2C (near-black, hand-drawn feel)
- **Accent red**: #C62828 (data curves, infection dots)
- **Darker red for text**: #9B1B1B (labels, emphasis text - meilleur contraste sur crème)
- **Blue accent**: #1565C0 (comparison curves, COVID data)
- **Blue label bg**: #E3F2FD avec texte #0D47A1
- **Map outline**: #5D4E37 (teinté brun pour effet vieux papier)

### Typographie
- **Font**: Indie Flower (Google Fonts, cursive)
- **Loading**: FontFace API dans `fonts.ts` (PAS @import CSS - non fiable au render Remotion)
- **Sizes**: axis labels 18px bold, tick labels 15px bold, milestone labels 14px, typewriter 20-24px
- **Text contrast**: stroke="#F5F0E1" strokeWidth={3} paintOrder="stroke" pour labels sur fonds complexes

### Texture papier & grain
- Background: composant PaperBackground avec filtre SVG feTurbulence
- Animation grain : `seed={Math.floor(frame / 2)}` - change toutes les 2 frames pour effet pellicule 16mm
- Subtil, pas distrayant - simule vieux papier/pellicule

### Système wobble
- Chaque élément SVG a un wobble sinusoïdal subtil : `Math.sin(frame * freq) * amplitude`
- Fréquences différentes par élément pour éviter le mouvement synchronisé
- Typique : freq 0.03-0.09, amplitude 0.3-1.5px
- Crée une sensation "hand-drawn" vivante sans être saccadé

## Composants

### DoodleCharacter (stick figure avec identité)
- **Identité**: lunettes rondes (permanentes, toutes expressions)
- **7 expressions**: neutral, curious, surprised, pointing, grave, shocked, thinking
- **Mécanique d'expression**:
  - Face-only: position sourcil (eyebrowY), angle sourcil (leftBrowAngle/rightBrowAngle), forme bouche, taille yeux
  - Full-body: repositionnement bras (shocked = mains sur tête, thinking = main au menton, pointing = bras tendu)
- **Règle z-order** : bras shocked et thinking rendus APRÈS le groupe tête pour chevauchement correct
- **Types de bouche**:
  - Path-based (stroke only): neutral (sourire léger), curious (léger entrouvert), grave (ligne droite), thinking (petite moue)
  - Ellipse-based (filled black): shocked (ellipse 6x8), surprised (ellipse 4x5)
  - JAMAIS d'arcs quadratiques ouverts pour choc/surprise - ils se lisent comme des sourires à petite échelle
- **Entrance**: animation spring à l'apparition
- **Idle**: respiration (oscillation d'échelle), wobble, inclinaison de tête

### SketchyLineChart
- Animation de tracé progressif via interpolation strokeDashoffset
- Génération de path sketchy : courbes de bézier quadratiques avec offsets de wobble pseudo-aléatoires
- Random seedé pour wobble cohérent par frame (change toutes les 3 frames)
- Points de données avec animation spring quand la courbe les atteint
- Labels de jalons avec rebond spring dans des boîtes de fond
- Support d'overlay de comparaison (ex. courbe COVID en bleu)
- Badge label COVID-19 qui apparaît en spring quand la comparaison commence

### EuropeMap
- Paths SVG hand-drawn simplifiés (contour Europe, botte Italie, UK)
- Animation de tracé progressif (strokeDashoffset)
- Points d'infection par ville avec :
  - Taille proportionnelle au nombre de morts
  - Effet de pulsation/glow
  - Animation d'entrée spring
  - Labels de nom de ville avec contour stroke pour lisibilité
- Lignes de connexion entre villes (pointillées, animées)

### Composants complémentaires
- **TypewriterText**: révélation caractère par caractère avec curseur clignotant
- **HandwrittenLabel**: labels texte animés spring avec rotation pour effet "tamponné"
- **SketchWatermark**: icônes SVG de fond discrètes (crâne, navire, croix) à 12% opacité

## Architecture audio (3 couches)
1. **Voiceover**: voix Chris, durée complète, volume=1
2. **Ambient**: boucle Lo-Fi, segments 15s, volume=0.08
3. **SFX**: grattement crayon pendant les moments de dessin, volume=0.10-0.15

## Structure de scène
- Split screen: 25% gauche (personnage) / 75% droite (data viz)
- Le personnage reste dans le panneau gauche tout du long, seule l'expression change
- Le panneau droit transitionne entre actes avec crossfade (15 frames)
- Structure 3 actes pour 60s: Hook (carte) -> Tension (courbe) -> Payoff (comparaison)

## Leçons de production

### Ce qui marche
- Texture papier + grain = sensation "fait main" instantanée
- Personnage avec lunettes = identité reconnaissable dès la frame 1
- Changements d'expression synchronisés avec l'émotion de la voix = engagement
- Animations de dessin progressif = intérêt visuel pendant la présentation de données
- Animations spring pour les labels = organique, pas mécanique
- Wobble sur tout = style "vivant" cohérent

### Ce qui ne marche pas
- Arcs de bézier quadratiques pour bouches choc/surprise = se lit comme un sourire
- Même expression trop longtemps = le personnage semble statique/mort
- Bras derrière la tête en z-order SVG = invisible à l'échelle de rendu
- Stick figure générique sans accessoire = oubliable, effet "clip art"
- Fenêtres de choc/surprise trop longues nécessitaient confirmation par extraction de frames

### Réutilisable pour d'autres sujets
- PaperBackground + grain = marche pour tout sujet éducatif
- DoodleCharacter avec système d'expression = marche pour toute narration
- SketchyLineChart = toute donnée en série temporelle
- Pattern EuropeMap = adaptable à toute donnée géographique
- TypewriterText + HandwrittenLabel = outils d'annotation universels
- Architecture audio 3 couches = réutilisable sur tous les styles

## Notes techniques
- Render Remotion: `npx remotion render src/index.ts SketchScene out/video.mp4 --codec h264`
- Render partiel rapide: `npx remotion render --frames=750-810` pour tests ciblés
- Extraction de frames: `bash scripts/extract_review_frames.sh video.mp4 3 project-name`
- Vérif frame unique: `ffmpeg -ss 26 -i video.mp4 -frames:v 1 -update 1 /tmp/check.jpg`

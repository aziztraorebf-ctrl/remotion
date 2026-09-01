# Brutalist Data Viz - Style Guide (v2 - Hybride)

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — registre visuel exploré fev 2026 pour un
> projet data-viz générique, jamais adopté en production. Le projet a depuis pivoté vers les
> registres Souverain/Atlas/Mapbox/SVG-Fable actuels (voir `memory/doctrines/`). Conservé comme
> référence de palette/anti-patterns si un futur projet demande un registre "data brute + choc".

## Direction
"Brutalist Data Viz" - les donnees frappent, mais la video respire.
Mix: 60% data viz brute + 20% typographie massive + 20% atmosphere par acte
Hybride : squelette brutalist (grille, typo, couleurs pures) + souffle cinematique (variations de mood, animations vivantes)

## Philosophie
- Chaque frame doit etre LISIBLE en 0.5s sur mobile
- L'information domine, la decoration est minimale mais presente
- Les actes ont chacun leur atmosphere (la video vit, pas monotone)
- Reconnaissable en 2 secondes comme "notre style"
- 8 minutes en noir pur flat = fatigue. Les fonds sombres varient subtilement par acte.

---

## Palette de couleurs

### Couleurs primaires (5 couleurs de reference)

| Couleur | Hex | Role | Utilisation |
|---------|-----|------|-------------|
| Noir profond | `#0A0A0F` | Fond principal | Base de 70% des frames |
| Blanc cassant | `#F5F5F5` | Texte, donnees | Titres, chiffres, corps |
| Rouge signal | `#E63946` | Danger, urgence, dette | Hook, reveals, chiffres negatifs |
| Bleu electrique | `#0066FF` | Donnee neutre, explication | Charts, barres, lignes |
| Jaune warning | `#FFD600` | Revelation, accent, CTA | Points cles, warnings, actions |

### Fonds par acte (variations sombres, pas des degradees)

| Acte | Fond | Description |
|------|------|-------------|
| Hook | `#0A0A0F` | Noir quasi-pur, tension maximale |
| Setup | `#0B1220` | Noir bleute, calme trompeur |
| Probleme | `#150A0A` | Noir rougeatre, malaise qui monte |
| Reveal | `#E63946` | ROUGE plein - seul moment d'inversion |
| Solution | `#0A0F1A` | Noir bleute profond, resolution |
| CTA | `#F5F5F5` | BLANC - rupture finale, action |

### Regles
- PAS de degradees (linear-gradient interdit dans le meme ecran)
- PAS de glow/blur diffus
- Ombres portees = offset dur uniquement (`4px 4px 0px couleur`)
- Opacite minimale 0.8 (pas de semi-transparence flottante)
- Un accent par ecran max (rouge OU bleu OU jaune, pas deux)
- Les variations de fond sont SUBTILES - le viewer sent le changement sans le voir consciemment

---

## Typographie

### Polices (Google Fonts)

| Usage | Police | Poids | Taille | Style |
|-------|--------|-------|--------|-------|
| Titres/Hook | Space Grotesk | Bold (700) | 80-120px | MAJUSCULES |
| Chiffres/Data | JetBrains Mono | Bold (700) | 60-90px | Tabular nums |
| Corps/Explication | Space Grotesk | Regular (400) | 28-36px | Normal |
| Labels/Legende | JetBrains Mono | Regular (400) | 18-24px | MAJUSCULES |

### Regles
- Titres TOUJOURS en majuscules
- Chiffres TOUJOURS en monospace (alignement visuel)
- Letter-spacing: +2px sur les titres, 0 sur le corps
- Pas d'italique (jamais)
- Line-height: 1.1 pour titres, 1.4 pour corps

---

## Layout & Grille

### Principe: Swiss Grid Brutalist
- Grille 12 colonnes, gouttiere 24px
- Marges exterieures: 48px (desktop), 24px (mobile/shorts)
- Alignement: GAUCHE par defaut (pas de centrage artistique)
- Les elements touchent les bords - pas de "flottement" au milieu

### Composants de layout
- **Blocs de couleur**: rectangles flat, sans radius, bordure 4px blanche
- **Separateurs**: lignes horizontales 4px, pleine largeur
- **Cadres data**: rectangle fond sombre, bordure 4px coloree, padding 16px
- **Tags/Pills**: rectangle (0 border-radius), fond couleur, texte noir
- **Pas de border-radius** (0px partout, angles droits uniquement)

### Hierarchie visuelle par taille
1. Chiffre principal (le "punch") - 90-120px, couleur accent
2. Titre de section - 60-80px, blanc
3. Labels data viz - 24px, monospace
4. Corps explicatif - 28-36px, blanc

---

## Animations

### Principes - Deux registres

**Registre BRUT (transitions, titres, reveals):**
- Cuts secs entre actes (0.1-0.15s)
- Stamp pour les titres (apparait d'un coup)
- Glitch aux moments de revelation (2-3 frames de decalage RGB)
- Shake (tremblement 2-3 frames) sur impact emotionnel

**Registre VIVANT (data viz, metaphores, dans les actes):**
- Spring rapide pour compteurs et barres (damping: 20, stiffness: 180 - vif mais pas rebondissant)
- Draw progressif pour line charts (vitesse constante, fluide)
- Scale/grow pour metaphores SVG (une maison qui retrecit = fluide, pas mecanique)
- Micro-mouvements dans les scenes (un element qui pulse doucement, une bordure qui respire)

### La regle des deux vitesses
- ENTRE les actes : brutal (hard cut, stamp, glitch)
- DANS les actes : vivant (spring, draw, scale)
- Ca cree un rythme : CHOC -> respiration -> CHOC -> respiration

### Interdit
- Fade in/out pour le texte (doit stamper)
- Spring rebondissant exagere (trop cartoon)
- Particules DECORATIVES flottantes (pas d'ambiance gratuite)
- Blur transition entre scenes
- Ease-in-out generique (trop lisse)

### Autorise
- Glitch/distortion ponctuel (3-5 frames max)
- Shake sur impact (2-3 frames)
- Counter roll vivant (spring rapide)
- Hard cut entre actes
- Slide in (depuis un bord)
- Pulse subtil sur elements actifs (opacite 0.85-1.0, cycle 2s)
- Draw SVG progressif (line charts, contours metaphores)

---

## Mood par acte

| Acte | Fond | Texte | Accent | Bordures | Emotion | Transition entree |
|------|------|-------|--------|----------|---------|-------------------|
| Hook (0-5s) | `#0A0A0F` noir | Rouge `#E63946` 120px | - | Rouge 4px | Choc, menace | Hard cut + glitch |
| Setup (5s-2min) | `#0B1220` bleute | Blanc `#F5F5F5` | Bleu `#0066FF` | Blanc 4px | Fausse securite | Hard cut |
| Probleme (2-5min) | `#150A0A` rougeatre | Blanc | Rouge `#E63946` | Rouge 4px | Colere, injustice | Hard cut + shake |
| Reveal (5-6min) | `#E63946` ROUGE | Noir / Blanc | Jaune `#FFD600` | Noir 4px | Choc total | INVERSION fond |
| Solution (6-7min) | `#0A0F1A` bleute profond | Blanc | Bleu `#0066FF` | Bleu 4px | Resolution | Hard cut |
| CTA (7-8min) | `#F5F5F5` BLANC | Noir `#000` | Jaune `#FFD600` | Noir 4px | Action, urgence | INVERSION fond |

### Regle d'or des actes
- Fonds SOMBRES varies pour 80% de la video (signature sombre, pas monotone)
- Fond ROUGE = un seul moment (le reveal) = impact maximal
- Fond BLANC = un seul moment (le CTA) = rupture finale
- JAMAIS le meme accent 2 actes d'affilee
- Le viewer sent que chaque acte a sa propre "temperature" sans que ce soit un arc-en-ciel

---

## Data Viz - Style adapte

### Compteurs animes
- Police: JetBrains Mono Bold, 90px
- Couleur: accent de l'acte en cours
- Animation: spring rapide (vivant, pas mecanique mort)
- Cadre: bordure 4px, fond acte

### Barres horizontales
- Hauteur: 40px, pas de border-radius
- Fond: `#1a1a1a` (gris tres sombre)
- Remplissage: couleur accent, spring rapide gauche->droite
- Label: a gauche de la barre, monospace 18px

### Line Charts
- Trait: 4px, couleur accent
- Fond grille: lignes `#222222` horizontales uniquement
- Points: carres 8x8px (pas de cercles - signature brutalist)
- Animation: draw progressif, fluide

### Donut/Pie Charts
- Trait: 8px minimum
- Pas de remplissage degradee
- Labels: lignes droites (pas de courbes), monospace
- Animation: draw progressif par segment

### Barres comparatives
- Cote a cote, gap 8px
- Couleurs contrastees (rouge vs bleu)
- Labels au-dessus, valeur a l'interieur si assez large
- Animation: staggered 0.2s, spring rapide

---

## Metaphores visuelles

### Principe
Les metaphores sont GEOMETRIQUES mais ANIMEES avec fluidite.
- Maison = rectangle + triangle (5 lignes SVG max) - peut retrecir/grandir avec spring
- Banque = rectangle + colonnes (lignes verticales) - peut pulser
- Personne = cercle + rectangle (stick figure minimal) - peut marcher/reagir
- Argent = rectangle avec "EUR" en monospace - peut se deplacer en arc
- Temps = barre de progression qui se vide

### Regle du dual coding
- Si la voix dit "ta maison perd de la valeur" -> la maison-rectangle retrecit
- Si la voix dit "les interets s'accumulent" -> une barre rouge grandit EN MEME TEMPS
- JAMAIS de metaphore abstraite deconnectee du propos
- Test: "Si je mute, est-ce que je comprends le message avec le visuel seul?"
- Test inverse: "Si je ferme les yeux, est-ce que l'audio se suffit?"

---

## Comparaison : Cinematique vs Brutalist Pur vs Hybride (choix de l'epoque)

| Element | Cinematique (v1) | Brutalist pur | Hybride (v2) |
|---------|-----------------|---------------|---------------------------|
| Fond | Degradees sombres | Noir pur #000 flat | Noirs varies par acte |
| Particules | Oui (ambiance) | Non | Non |
| Vignette | Oui (cinema) | Non | Non |
| Glow | Oui (neon) | Non | Non |
| Typo | Moyenne, discrete | Massive, dominante | Massive, dominante |
| Ombres | Diffuses | Dures (offset) | Dures (offset) |
| Transitions actes | Fade, spring | Hard cut uniquement | Hard cut + glitch |
| Animations data | Spring doux | Mecanique mort | Spring rapide (vivant) |
| Metaphores | Realistes SVG | Geometrie pure statique | Geometrie animee fluide |
| Border-radius | Arrondi | 0px | 0px |
| Palette | 8+ nuancees | 5 pures | 5 pures + nuances sombres par acte |
| Sur 8 min | Trop generique | Trop fatigant | Frappe + respire |
| Lisibilite mobile | Moyenne | Maximale | Maximale |

---

## Ce qui etait garde du Cinematique

1. **Atmosphere differente par acte** (regle la plus importante - evite la monotonie)
2. **Composants data viz reutilisables** (adaptes au style brut)
3. **Script provocateur** ("ta banque ne veut pas..." pas "voici comment...")
4. **Voice settings Chris** (stability 0.0, style 0.8)
5. **Workflow 7 etapes** (research -> script -> direction -> code -> audio -> assemblage -> iteration)
6. **Animations vivantes dans les scenes** (spring rapide, draw progressif)

---

## Shorts Adaptation

Pour les Shorts (9:16), le style hybride fonctionnait:
- Typo massive = lisible en petit format
- Fond sombre = pas de distraction
- Un seul chiffre/stat par ecran
- Animation: stamp titre + spring rapide data
- Duree: 30-60s, un seul "punch" extrait de la video longue

---

## Anti-patterns (a eviter) — reste valable pour tout registre data-viz

- Trop de couleurs sur un ecran (max 3: fond + texte + 1 accent)
- Texte qui fade in (les titres doivent stamper)
- Fond identique sur 2 actes consecutifs (varier les nuances sombres)
- Metaphore qui ne correspond pas au propos exact de la voix
- Border-radius > 0 (meme sur les pills/tags)
- Police decorative ou script
- Animation mecanique morte sur data viz (doit avoir du spring)
- 8 minutes en noir pur flat sans variation = aussi monotone que le cinematique
- Meme mise en page 2 scenes consecutives (varier la grille)
- Glitch/shake trop frequent (reserve aux transitions d'acte et reveals)

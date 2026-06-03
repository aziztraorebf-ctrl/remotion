---
name: "Lottie via Claude — inventaire de ce qui est faisable sans assets externes"
description: "Périmètre clair de ce que Claude peut générer en Lottie JSON pour Atlas et autres vidéos. Validé Shaka Zulu 2026-05-03 (couronne, iklwa, flèche-pulse)."
type: reference
---

# Lottie via Claude — inventaire complet

Validé après exploration Shaka Zulu (2026-05-03). Le format JSON canonique étant maîtrisé via skill Wiggle, Claude peut maintenant générer des animations Lottie autonomes pour les vidéos Atlas et autres projets.

**Référence format** : voir `memory/feedback_remotion-lottie-headless-broken.md` pour les 4 règles critiques + pattern require().

---

## Ce que Claude PEUT faire seul (zéro asset externe)

### Icônes géométriques simples (validé)
- **Couronne** : base + 3 pointes triangulaires + 3 gemmes (validé Shaka Zulu)
- **Lance/iklwa/épée** : lame triangulaire + manche rectangulaire + garde
- **Flèche** : triangle pointu + ligne d'empennage
- **Bouclier** : ellipse ou forme custom + motifs internes
- **Croissant lunaire** : intersection 2 ellipses (mask) ou path bezier
- **Étoile/polygone** : `ty: "sr"` natif (5 à 12 branches)
- **Cercle d'écho** : ellipse stroke qui s'agrandit + fade (validé arrow-pulse)
- **Couronne de laurier** : 2 paths bezier symétriques
- **Ankh, croix, symboles** : géométrie simple
- **Flammes stylisées** : path bezier avec courbes douces
- **Goutte d'eau / larme** : ellipse + path triangulaire fusionnés visuellement
- **Tente/case ronde** : triangle + rectangle ou cercle
- **Sablier** : 2 triangles inversés + sable (animation niveau)
- **Clé géométrique** : cercle + rectangle + dents
- **Œil stylisé** : ellipse externe + ellipse interne + pupille
- **Soleil** : cercle central + N rayons (rectangles fins en rotation)
- **Pyramide** : 3 paths triangulaires (face + ombre)

### Animations possibles sur ces icônes
- **Pulse/breathe** : scale 85% → 100% → 92% → 85% (validé)
- **Oscillation/sway** : rotation -3° → +3° → -3° (validé iklwa)
- **Fade in/out** : opacité 0 → 100 → 0
- **Slide** : translation X ou Y
- **Spin** : rotation 0° → 360°
- **Draw-on (trim path)** : trace progressive d'un contour
- **Echo concentrique** : 2-3 cercles qui s'agrandissent en cascade (validé arrow-pulse)
- **Bounce** : scale avec ease back (overshoot)
- **Color shift** : couleur or → bordeaux progressive
- **Flicker** : opacité saccadée (ex: flamme)
- **Ripple** : ondulation de scale séquentielle
- **Magnétisme** : 2 éléments qui se rapprochent puis s'écartent

### Combinaisons multi-layers (validé jusqu'à 3 simultanés)
- Anneau + flèche centrale (validé arrow-pulse : echo + triangle)
- Couronne + étincelles autour (4-6 layers possible)
- Compteur visuel : 5 cercles qui s'allument séquentiellement
- Légende avec icône + texte (texte = composant Remotion à côté, pas dans le Lottie)

### Effets de modifier
- **Trim path** : draw-on pour traces, signatures, contours
- **Rounded corners** : adoucir n'importe quelle forme
- **Repeater** : dupliquer N fois en rotation (couronne de pétales, mandalas)
- **Twist** : torsion légère

---

## Ce que Claude PEUT faire avec effort modéré (50-200 lignes JSON)

### Compositions pédagogiques pour Atlas
- **Indicateur de population** : silhouettes humaines simples qui s'empilent
- **Timeline horizontale** : ligne avec ticks animés + dots qui apparaissent
- **Compteur numérique** : chiffres qui s'incrémentent (utiliser Remotion + Lottie ensemble)
- **Diagramme cause-effet** : 2-3 cercles + flèches connectrices
- **Hiérarchie pyramidale** : 3 niveaux empilés qui apparaissent du bas
- **Comparaison taille** : 2 silhouettes côte-à-côte avec scale animé
- **Indicateur de progression** : barre qui se remplit

### Marqueurs cartographiques (très utile pour Atlas)
- **Pin de localisation** : goutte d'eau + cercle interne, drop-down animé
- **Marqueur capitale** : étoile dorée pulsante
- **Marqueur bataille** : 2 lances croisées + halo bordeaux
- **Marqueur commerce** : balance + pièces
- **Onde de conquête** : pulse depuis un point
- **Trajectoire** : path bezier qui se trace progressivement (caravane, armée)

### Patterns décoratifs Atlas
- **Bordure manuscrite** : motifs géométriques répétés en rotation
- **Cartouche royal** : forme ovale + détails ornementaux
- **Sceau royal** : cercle + symboles internes
- **Compass rose** : étoile à 8 branches + N/S/E/O

---

## Ce que Claude NE PEUT PAS faire (utiliser un autre outil)

### Trop complexe pour génération manuelle
| Besoin | Pourquoi pas Lottie-Claude | Solution recommandée |
|--------|---------------------------|----------------------|
| Silhouette de personnage réaliste | >50 vertices bezier, tangentes ingérables | PixelLab (sprite) ou Gemini (illustration) |
| Visage humain | Trop d'éléments subtils | Gemini ou PixelLab |
| Reproduction d'un dessin/photo | Conversion pixels → vecteurs nécessaire | Outil SVG→Lottie ou Lottie Creator |
| Animation de marche | Walk cycle = 4-8 keyframes par membre × 4 membres | PixelLab walk cycle (validé) |
| Carte géographique | Trop de polygones | d3-geo + Natural Earth (validé Atlas) |
| Texture organique (eau, fumée, feu réaliste) | Particules + noise impossible à coder à la main | Lottie Creator + LottieFiles, ou MP4 stock |
| Logo de marque existant | Reproduction fidèle = path bezier complexe | Lottie Creator (import SVG) |

### Limitations techniques
- **Path morphing** (forme A → forme B fluide) : nombre de vertices doit matcher entre les 2 paths. Faisable sur 3-4 vertices, infaisable sur 20+
- **Particules** : pas de système natif, dupliquer 10 layers manuellement c'est lourd
- **3D vrai** : Lottie est 2.5D. Pour vrai 3D → Three.js dans Remotion
- **Effets WebGL** (glow, distorsion forte) : renderer-dependent, peut ne pas marcher en headless
- **Texte dynamique** : possible mais complexe ; mieux vaut utiliser un composant Remotion `<div>` à côté

---

## Règles d'usage pour Atlas (validées Shaka Zulu)

### Quand utiliser Lottie-Claude
- Légende d'une carte (icônes pour expliquer : "voici le royaume", "voici l'armée")
- Marqueurs animés sur une carte (pulse, écho, drop-down)
- Indicateurs visuels pédagogiques (pyramide, compteurs, comparaisons)
- Éléments d'ouverture ou de transition (couronne qui pulse, sceau qui se trace)
- Décorations de cartouche, ornements

### Quand NE PAS utiliser Lottie-Claude
- Personnages → PixelLab
- Cartes → d3-geo
- Photos/illustrations → Gemini
- Captures vidéo → Seedance/Kling
- Texte → composant Remotion natif (pas Lottie)

### Limite pratique de complexité par scène
- **Max 5 instances `<Lottie>` simultanées** (jamais testé au-delà, mais 3 OK)
- **Max ~150 lignes de JSON par animation** (au-delà, devient difficile à maintenir)
- **Max ~10 vertices par path bezier** (au-delà, calcul tangentes ingérable)

---

## Pipeline de génération d'une icône Lottie

1. **Définir la forme** en termes simples (3 pointes triangulaires + 3 gemmes circulaires)
2. **Définir l'animation** (pulse 60 frames, scale 85→100→92→85)
3. **Coder le JSON** en suivant le canon Wiggle (voir `feedback_remotion-lottie-headless-broken.md`)
4. **Charger via require()** dans le composant Remotion
5. **Mini-render** pour valider avant intégration

---

## Réutilisabilité

Les JSON Lottie générés sont **portables** : peuvent servir dans plusieurs vidéos Atlas. Les fichiers validés vivent dans :
- `src/projects/atlas/_shared/lottie-icons/` (à créer quand on aura accumulé 5+ icônes réutilisables)
- En attendant : dans le dossier `tests/` du projet en cours

Bibliothèque actuelle (Shaka Zulu) :
- `crown-pulse.json` — couronne royale qui pulse
- `iklwa.json` — lance zulu qui oscille
- `arrow-pulse.json` — flèche bordeaux + écho doré (territoire/conquête)

---

## Assets premium Souverain navy/gold (Chantier C, 2026-06-02)

Générés par code dans `src/projects/_shared/lottie/premiumLottieAssets.ts` (fonctions paramétrables couleur, format 5.7.8, renderer canvas headless OK). Ancrés à un point geo via `MapboxLottieGeoAura.tsx` (Lottie off-screen → goToAndStop frame-driven → overlay à map.project(coord)).

- `shockwaveDiscovery()` — onde de choc "découverte" : flash central + 3 anneaux en cascade (easing out cubic). VERDICT : excellent (à juger en vidéo, paraît faible sur frame fixe entre 2 pulses).
- `orbitalDataCrown()` — anneau de ticks rotatifs (repeater) + contre-rotation, look HUD war-room. VERDICT : bon, lisible même en frame fixe.
- `networkFlow()` — particules dorées le long d'une route dasharray, taille/opacité variables. VERDICT : correct.

### Gotcha critique (appris 2026-06-02) — décalage de phase
`goToAndStop(frame)` force une frame ABSOLUE sur la timeline → le décalage de layers via `st`/`ip`/`op` négatifs (start-time) est IGNORÉ. Pour étaler des particules dans le temps, décaler les KEYFRAMES (t:) de chaque layer dans la MÊME timeline, pas le start-time du layer. Erreur initiale networkFlow : particules invisibles car offset via `st` négatif.

### Règle : Lottie se juge EN VIDÉO, jamais en frame fixe
Le Lottie est temporel. Une frame fixe peut tomber entre 2 pulses et donner une fausse impression de faiblesse. Toujours valider sur la vidéo rendue.

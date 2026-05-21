# Réponse Grok — Hannibal Pass 2

## Note globale : 8.5/10

## Q1. Validation Top 7

1. **OUI** — Sprite-decay : Grille 37 icônes rows×cols, opacity decay droite→gauche par index. Dernier sprite : spring({damping:12}) pulse doré. Effort moyen.

2. **OUI** — FocusBubble : Composant existant, paramètres validés. Rien à changer. Effort petit.

3. **AMENDEMENT** — Compteur : Ajouter un **palier intermédiaire visible** : 46 000 → 26 000 (Rhône + montée) → 20 000 (descente). Sinon le drop semble instantané et perd la narration en deux temps. Deux segments `interpolate()`. Effort petit→moyen.

4. **OUI** — Beat 3 sous-séquences : découpage ~6s×4 pertinent. Séquences imbriquées dans Beat3.tsx (pas TransitionSeries entre beats, seulement entre sous-séquences). Effort moyen.

5. **AMENDEMENT** — Barre altitude : OUI principe "ponctuel + disparaît". Positionner `right: 60px, top: 200px`, largeur 40px, z-index au-dessus carte. `opacity: interpolate(frame, [peakFrame, peakFrame+30], [1, 0], {extrapolateRight: 'clamp'})`. Effort petit.

6. **OUI** — Dutch tilt : `rotate(4deg)` constant + spring() oscillation ±1.5deg superposée. Max 2s. Effort petit.

7. **AMENDEMENT** — Dolly-out ITALIA : Label "ITALIA" doit apparaître **après** que le scale ait atteint sa valeur cible, pas en même temps. Délai +10 frames sur l'apparition du label. Effort petit.

---

## Q2. Implémentation concrète

**Idée 1 — Sprite-decay** (Effort : Moyen, ~2-3h)
- 1 map_object PixelLab éléphant profil 32px (générer à 64px, afficher à 32px `image-rendering: pixelated`)
- Grille : 7 colonnes × 6 rangées (37 sprites, 5 vides)
- `opacity[i] = frame < startDecay + index * stepFrames ? 1 : interpolate(..., [1, 0.15])`
- IMPORTANT : éléphant statique (pas animé) pour la grille — animate_object non lisible à 32px. Réserver animate_object pour le dernier éléphant survivant uniquement.

**Idée 3 — Compteur amendé** (Effort : Petit→Moyen)
- `interpolate(frame, [s1, s2, s3, s4], [46000, 46000, 26000, 20000])` avec clamp
- Font JetBrains Mono 120px, `interpolateColors()` or→rouge sur même range

**Idée 4 — Beat 3 sous-séquences** (Effort : Grand, ~4-6h)
- 4 `<Sequence from={} durationInFrames={}>` imbriquées dans Beat3.tsx
- Sub1 (col Allobroges) : pan lent nord
- Sub2 (nuit rocher) : FocusBubble actif
- Sub3 (vinaigre) : dutch tilt + vibration
- Sub4 (dolly-out Italie) : scale recule, ITALIA apparaît

**Idée 5 — StatGauge altitude** (Effort : Petit, ~45 min)
- StatGauge.tsx vertical, "~2 400m" label, right: 60px, top: 200px
- Fade-in 15 frames début sub4, disparition 20 frames après pic

**Idées 6 & 7** : inline dans Beat3 sub3/sub4. Pas de composants séparés.

---

## Q3. Beat 3 — progression géographique sans mouvement

**1. Révélation progressive de paths SVG** — Routes de marche s'allongent via `strokeDashoffset` animé. Chaque sous-séquence révèle un segment. `interpolate(frame, [start, end], [totalLength, 0])` sur dashoffset. CPU faible.

**2. Fill territoire par étape** — Zones de contrôle Allobroges (rouge-brun → transparent quand ils reculent). `interpolate()` sur rgba. Narrativement ancré.

**3. Vignette focale mobile** — `radialGradient` SVG dont `cx/cy` se déplacent de la plaine vers le col puis vers l'Italie. Donne l'impression que la carte "regarde" différents endroits. Combiner 1 + 3 suffit.

---

## Q4a. 8e idée

**Légende de pertes silencieuse** — Compteur discret (petit, coin bas-gauche) qui décrémente de 46 000 pendant tout Beat 3, sans être mis en avant. Quand Beat 4 arrive et que le compteur géant apparaît, le chiffre est déjà là — le spectateur a inconsciemment suivi la descente. Coût minimal, impact narratif cumulatif.

---

## Q4b. 3 pièges techniques

1. **Sprite-decay performance** — 37 instances spritesheet simultanées = GPU saturé en headless. Solution : éléphant statique (pas animé) pour la grille, `<img>` avec `backgroundPosition` CSS plutôt que clipPath. animate_object réservé au dernier éléphant survivant uniquement.

2. **FocusBubble + d3-geo coordinate mismatch** — FocusBubble utilise coordonnées écran (px). Si la carte est dans un `<g transform="translate()">` imbriqué, les coordonnées du sprite ne correspondent pas. Solution : s'assurer que `centerX/centerY` sont dans le référentiel de la composition (post-transform), pas dans le référentiel SVG interne.

3. **Dutch tilt + crop portrait** — `rotate(4deg)` sur conteneur plein écran coupe les coins sur 1080×1920. Solution : appliquer rotate sur conteneur `scale(1.08)` pour compenser le crop, ou limiter à 2.5deg max sans scale. Tester avec fond uni d'abord.

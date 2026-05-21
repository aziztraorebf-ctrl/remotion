# Réponse Gemini — Hannibal Pass 2

## Note globale : 8.5/10

## Q1. Validation Top 7

1. **OUI** — Sprite-decay : Grille 37 icônes, fade opacity 100%→15% via `interpolate()` avec décalage `i * 8 frames`, dernier pulse `spring({damping:15})` or. Lisible, narrativement fort.

2. **OUI** — FocusBubble : Composant existant validé Phase 1.5. ~6s au sub-2 (nuit rocher). Paramètres confirmés.

3. **AMENDEMENT** — Compteur : Garder JetBrains Mono + interpolate(), mais ajouter un **sous-compteur secondaire** simultané : "37 éléphants → 1" en petit en dessous. La perte humaine + animale simultanée amplifient l'impact sans coût supplémentaire.

4. **OUI** — Beat 3 sous-séquences : Structure 4×6s bien cadencée. Attention timing : 4×6.25s = 25s exact, pas de marge pour overlaps TransitionSeries. Prévoir 4×5.5s + 2s de transitions (overlap 0.5s chaque).

5. **AMENDEMENT** — Barre altitude : OUI pour "ponctuel + disparaît". Ajouter une **valeur chiffrée au sommet** : "~2 400m" avec la jauge. Sans chiffre la jauge est décorative. Avec chiffre elle est informationnelle.

6. **OUI** — Dutch tilt : `rotate(3deg)` via interpolate 15 frames, peak 5deg pendant 30 frames, retour spring(damping:180). Associer à `scale(1.05)` simultané pour amplifier l'effet chaos.

7. **OUI** — Dolly-out ITALIA : scale 1.4→1.0 sur 90 frames, label "ITALIA" fade-in à scale 1.15 (milieu du mouvement). Couleur OR. Placer après silence narratif "Vous traversez les murs de Rome."

---

## Q2. Implémentation concrète

**Idée 1 — Sprite-decay** (Effort : Moyen)
- map_object éléphant PixelLab 32px fond transparent
- Grille CSS 6 colonnes × 7 rangées
- `opacity[i] = interpolate(frame, [decayStart + i*8, decayStart + i*8 + 20], [1, 0.12], {clamp: true})`
- Dernier (index 36) : spring({damping:15, stiffness:100}) scale + OR pulse
- Durée totale decay : ~37*8 + 20 = ~316 frames (~10.5s). Déclencher fin Beat 4.

**Idée 3 — Compteur amendé** (Effort : Petit)
- Font JetBrains Mono 96px centré
- `val = Math.round(interpolate(frame, [start, end], [46000, 20000]))`
- `interpolateColors()` #E6C76E→#8B2020
- Sous-compteur 14px : "37 éléphants → 1" appear à frame start+30

**Beat 3 — 4 sous-séquences TransitionSeries** (Effort : Grand)
- 4×165 frames - 3×15 frames overlaps = 615 frames + 45 transitions = ~22s → ajuster pour atteindre 750 frames total (25s)
- Transitions (1)→(2) et (3)→(4) : `linearTiming(15)` + fade. Entre (2)→(3) : cut sec.

**Idée 5 — StatGauge altitude amendée** (Effort : Petit)
- StatGauge.tsx vertical, label "~2 400m" en haut
- spring({damping:12}) fill 0→100% sur 45 frames
- pulse 3×, puis fade-out complet après 90 frames

---

## Q3. Beat 3 — progression géographique

1. **Route qui se trace** : `stroke-dashoffset` interpolate sur le tracé col, la ligne avance le long de l'itinéraire. Coût petit, impact fort.
2. **Fog-of-war progressif** : zone non-traversée légèrement désaturée (filter: saturate(0.3)), la saturation remonte avec la narration.
3. **Marqueurs temporels** : labels "Jour 1 / Jour 5 / Jour 9" qui apparaissent à chaque sous-séquence avec fade-in spring(). Le temps avance visuellement même si la géo ne bouge pas.

---

## Q4a. 8e idée

**Silhouette armée en file indienne qui rétrécit** — Beat 4 descente. Ligne de sprites marchant vers le bas-droite, colonne raccourcit via `slice(0, Math.round(interpolate(frame, ...)))`. Précédent technique existant (Beat 2 Empire Ghana caravane). Effort moyen.

---

## Q4b. 3 pièges

1. **Sprite-decay timing vs audio** — Decay 37 icônes dure 10.5s. Si Beat 4 = 18s, le decay et le compteur risquent de se chevaucher. Solution : séquencer strictement — compteur d'abord (8s), puis decay (10s).

2. **PixelLab map_object 32px** — Downscale CSS peut rendre le pixel art flou. Solution : générer à 64px, afficher à 32px avec `image-rendering: pixelated`. Validé Empire Ghana.

3. **TransitionSeries + audio désynchronisé** — Les overlaps de transition consomment des frames que l'audio ne "perd" pas. Solution : calculer `audioOffset[i] = sum(durations[0..i-1]) - sum(transitions[0..i-1])` pour chaque `<Audio startFrom>`.

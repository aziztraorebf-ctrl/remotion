# VAGUE-1-LOCKED — Hannibal : Traversée des Alpes
> Source de vérité visuelle. Date : 2026-05-04. Validé après Jury Pass 2 (3 LLMs).
> Ne pas modifier sans validation Aziz.

---

## Idée 1 — Sprite-decay 37 éléphants (MUST HAVE)

**Beat** : Beat 4→5
**Recette** :
- Générer 1 `create_map_object` PixelLab éléphant profil, **64px** fond transparent
- Afficher à **32px** dans Remotion avec `image-rendering: pixelated` CSS
- Grille : 7 colonnes × 6 rangées (37 sprites, 5 cellules vides en bas)
- Éléphant **statique** pour la grille (animate_object non lisible à 32px) — SAUF le dernier
- Extinction droite→gauche : `opacity[i] = interpolate(frame, [decayStart + i*8, decayStart + i*8 + 20], [1, 0.15], {clamp: true})`
- Durée totale decay : ~316 frames (~10.5s). Déclencher à la fin Beat 4.
- Dernier éléphant (index 36) : animate_object "breathing idle" 4 frames, pulse `spring({damping:12})` scale 1→1.3→1, couleur OR #E6C76E
- **Attention** : Séquencer strictement compteur d'abord (8s) PUIS decay (10s). Ne pas superposer.

**Effort** : Moyen (~2-3h)

---

## Idée 2 — FocusBubble nuit sur le rocher (MUST HAVE)

**Beat** : Beat 3, sous-séquence 2 (nuit rocher)
**Recette** :
- `FocusBubble.tsx` existant dans `_shared/`, aucun code nouveau
- Props : `zoom=1.45, blur=3.5`
- Position Hannibal : tiers haut du frame (pas centre) — Allobroges flous dans les deux tiers bas
- Durée : ~8s (sous-séquence nuit rocher complète)

**Effort** : Petit (30 min)

---

## Idée 3 — Compteur numérique 46 000 → 20 000 (MUST HAVE — AMENDÉ)

**Beat** : Beat 4 ouverture
**Recette** :
- Font JetBrains Mono, taille 120px, centré
- **Palier intermédiaire** (Grok) : `interpolate(frame, [s1, s2, s3, s4], [46000, 46000, 26000, 20000])` avec clamp — marque les deux phases de perte (montée + descente)
- Couleur : `interpolateColors(progress, [#E6C76E, #8B2020])`
- `Math.round()` obligatoire sur chaque frame (pas de décimales visibles)
- **Sous-compteur secondaire** (Gemini) : "37 éléphants → 1" en 14px, même police, apparaît à frame start+30 en dessous

**Effort** : Petit→Moyen (~1h)

---

## Idée 4 — Beat 3 en 4 sous-séquences (MUST HAVE)

**Beat** : Beat 3 entier (25s = 750 frames @30fps)
**Recette** :
- 4 `<Sequence>` imbriquées dans Beat3.tsx (pas TransitionSeries entre beats)
- Transitions légères entre (1)→(2) et (3)→(4) via fade `linearTiming(15 frames)`
- Transition (2)→(3) : **cut sec** — le dutch tilt doit surprendre

| Sub | Durée | Contenu | Device |
|-----|-------|---------|--------|
| Sub-1 | ~6s | Col + Allobroges en hauteur | Pan lent nord, paths SVG Allobroges |
| Sub-2 | ~6s | Nuit rocher escarpé | FocusBubble actif |
| Sub-3 | ~6s | Vinaigre + rocher | Dutch tilt + vibration |
| Sub-4 | ~7s | Arrivée au col + Italie | Barre altitude + Dolly-out ITALIA |

**Note timing** : Prévoir 4×(durationFrames) - 3×15 overlaps = 750 frames total. Dériver toutes les durées depuis `timing.ts` (jamais de valeurs inline).

**Effort** : Grand (~4-6h, cœur du beat)

---

## Idée 5 — Barre d'altitude ponctuelle (CONDITIONNEL — AMENDÉ)

**Beat** : Beat 3, sous-séquence 4 uniquement (arrivée au col)
**Recette** :
- `StatGauge.tsx` existant, orientation verticale
- Position : `right: 60px, top: 200px`, largeur fixe 40px, z-index au-dessus de la carte
- Valeur chiffrée en label haut : `"~2 400m"` (informationnelle, pas juste décorative)
- Apparition : `spring({damping:12})` fill 0→100% sur 45 frames
- Disparition : `opacity: interpolate(frame, [peakFrame, peakFrame+30], [1, 0], {clamp: true})`
- `hideRanges` activé dès le pic atteint

**Effort** : Petit (~45 min)

---

## Idée 6 — Dutch tilt + vibration vinaigre (NICE TO HAVE)

**Beat** : Beat 3, sous-séquence 3
**Recette** :
- `rotate(4deg)` constant + `spring({damping:15, stiffness:300})` oscillation ±1.5deg superposée
- **CRITIQUE** : Appliquer sur wrapper `scale(1.08)` pour compenser le crop en portrait 1080×1920 (les coins à 4deg sortent du frame). Tester avec fond uni avant assets.
- **CRITIQUE** : Isoler la rotation au conteneur carte uniquement — les sous-titres karaoke + UI HUD dans un `<AbsoluteFill>` frère hors du rotate
- Durée max : 2s. Retour `spring({damping:200})` smooth.

**Effort** : Petit (si bien isolé ~45 min, piège si mal isolé)

---

## Idée 7 — Dolly-out révèle ITALIA (NICE TO HAVE — AMENDÉ)

**Beat** : Beat 3 sub-4 fin / Beat 4 amorce
**Recette** :
- `interpolate(frame, [start, end], [1.6, 1.0], {clamp: true})` sur scale du conteneur carte
- Label "ITALIA" : apparaît **+10 frames après** que le scale ait atteint 1.0 (pas pendant le mouvement)
- `opacity` fade-in sur 8 frames, couleur OR #E6C76E
- Position : nord de la plaine du Pô (coordonnées à préciser via d3-geo production)
- Synchroniser avec audio "Vous traversez les murs de Rome."

**Effort** : Petit (~45 min)

---

## Progression géographique Beat 3 — techniques carte (Q3 consolidé)

Beat 3 = 25s dans la même zone géographique. Pour éviter l'effet figé **sans déplacer la caméra** :

1. **strokeDashoffset animé** (recommandé par les 3) : routes de marche carthaginoise se tracent progressivement. `interpolate(frame, [start, end], [totalPathLength, 0])` sur le dashoffset. Chaque sous-séquence révèle un segment.
2. **Fill territoire Allobroges** (Grok) : zone Allobroges rouge-brun → transparent quand ils reculent au matin. `interpolate()` sur rgba du polygone.
3. **Vignette focale mobile** (Grok) : `cx/cy` du radialGradient SVG se déplacent selon la sous-séquence active. Minimal en code, fort en effet.

**Combinaison recommandée** : 1 + 3. La 2 est optionnelle si les autres suffisent.

---

## Pièges techniques consolidés (4 critiques)

| Piège | Source | Solution |
|-------|--------|---------|
| 37 sprites performance headless | Grok + GPT-4o | Éléphant statique (pas animé) pour la grille. animate_object réservé au dernier uniquement. |
| Dutch tilt crop portrait | Grok | `scale(1.08)` sur le conteneur rotate pour compenser. Tester fond uni d'abord. |
| Dutch tilt + HUD/sous-titres | GPT-4o | Rotate sur wrapper carte uniquement. `<AbsoluteFill>` frère pour UI. |
| TransitionSeries + audio drift | Gemini + GPT-4o | `durationInFrames` depuis `timing.ts`. `audioOffset[i]` calculé en tenant compte des overlaps. |

---

## Idées en réserve (pas en Vague 1)

- **Légende pertes silencieuse** (Grok Q4a) : compteur discret Beat 3 qui décrémente en fond. Intéressant mais risque surcharge HUD. À évaluer à la production.
- **Silhouette armée décroissante** (Gemini Q4a) : file indienne qui rétrécit Beat 4. Précédent caravane Ghana. Faisable mais déjà couvert par sprite-decay + compteur.
- **Ligne de progression armée** (GPT-4o Q4a) : trait strokeDashoffset Beat 1→2. Petit effort, bonne contextualisation. Peut entrer si le Beat 1 semble vide.

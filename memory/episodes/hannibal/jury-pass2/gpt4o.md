# Réponse GPT-4o — Hannibal Pass 2

## Note globale : 8.5/10

---

## Q1. Validation Top 7

**1. OUI — Sprite-decay 37 éléphants**
Recette solide. Grille 37 icônes indexées, extinction droite→gauche par `interpolate()` avec offset `i * staggerDelay`. Dernier pulse `spring({damping: 8})` or #E6C76E. Veiller à ce que la grille reste lisible sur fond ALPES #D9E4ED — tester opacité min à 15% vs 10%.

**2. OUI — FocusBubble nuit rocher**
Pattern existant validé, aucun risque. Positionner Hannibal au tiers haut du frame (pas centre) pour laisser le flou des Allobroges occuper les deux tiers bas. Plus de tension dramatique.

**3. OUI — Compteur numérique**
`interpolate()` frame-synchronisé sur la narration. Attention : arrondir à l'entier à chaque frame (`Math.round()`), sinon on voit les décimales passer. Transition couleur or→rouge via `interpolateColors()` à mi-chemin de la valeur (ex : bascule à 33 000).

**4. OUI — Beat 3 en 4 sous-séquences**
Structure cohérente avec le script. Chaque sous-séquence ~6s. Utiliser `TransitionSeries` entre (1)→(2) et (3)→(4) avec `linearTiming(8)` (courtes transitions pour rythme tendu). Entre (2)→(3) : cut sec — le dutch tilt doit surprendre.

**5. AMENDEMENT — Barre altitude**
Valider l'idée, mais revoir la taille : "grande et visible" risque de concurrencer le sprite Hannibal et le texte narration. Recommandation : StatGauge vertical ancré à droite, hauteur 40% du frame max, apparaît avec `spring()` snappy à l'entrée, disparaît avec `interpolate()` fade sur 15 frames. `hideRanges` activé dès que le pic est atteint.

**6. OUI — Dutch tilt + vibration vinaigre**
`rotate(4deg)` + `spring({damping: 15, stiffness: 300})` pour le shake. Durée max 2s sinon inconfort. Retour à 0deg avec `spring({damping: 200})` smooth. Pas de shake sur le texte narratif superposé — isoler la rotation au conteneur carte uniquement.

**7. OUI — Dolly-out révèle ITALIA**
`interpolate()` sur `scale` : 1.6→1.0, extrapolate clamp. Label "ITALIA" apparaît via `opacity` interpolate avec 8 frames de fade-in, couleur OR #E6C76E, position nord de la plaine du Pô. Synchroniser précisément avec la ligne audio "Vous traversez les murs de Rome."

---

## Q2. Implémentation concrète

| Idée | Outils | Timing beat | Effort |
|------|--------|-------------|--------|
| Sprite-decay | PixelLab `create_map_object` 32px → composant React grille, `interpolate()` par index | Beat 4, ~frames 0-120 | Moyen |
| FocusBubble | `FocusBubble.tsx` existant, aucun code nouveau | Beat 3 sub-2, ~frames 36-72 | Petit |
| Compteur | Composant inline, `interpolate()` + `Math.round()` + `interpolateColors()` | Beat 4 ouverture, ~frames 0-60 | Petit |
| Beat 3 sous-séquences | `TransitionSeries` 4 enfants, durées fixes | Beat 3 entier 750 frames @30fps | Moyen |
| Barre altitude | `StatGauge.tsx` existant, `hideRanges` configuré | Beat 3 sub-4, ~frames 210-270 | Petit |
| Dutch tilt | `transform: rotate()` + `spring()` sur conteneur carte | Beat 3 sub-3, ~frames 144-210 | Petit |
| Dolly-out ITALIA | `interpolate()` scale + label conditionnel | Beat 3 sub-4 fin / Beat 4 amorce | Petit |

---

## Q3. Beat 3 — progression géographique

1. **Révélation progressive** : col apparaît (opacity interpolate) quand narration le mentionne. Chemins d'accès dessinés via `strokeDashoffset`.
2. **Marqueurs d'étape animés** : points pulsants qui apparaissent/disparaissent à chaque sous-séquence — la carte "répond" au script.
3. **Palette de fond dynamique** : transition subtile TERRE #C8B89A → ALPES #D9E4ED sur le polygone montagne via `interpolateColors()` entre sub-1 et sub-4. Sensation d'altitude croissante sans pan caméra.

---

## Q4a. 8e idée

**Ligne de progression armée** : Beat 2→3, trait animé `strokeDashoffset` qui suit l'itinéraire Espagne→Rhône→col alpin, point de tête avance en temps réel. Contextualise l'échelle du trajet avant la montagne. Effort : petit.

---

## Q4b. 3 pièges techniques

**1. Grille 37 sprites — performance headless**
37 composants image simultanés = drops frames potentiels. Solution : `staticFile()` pour tous sprites + `<Img>` avec `premountFor` sur Sequence parente. Mini-render Beat 4 seul avant assemblage.

**2. Dutch tilt isolé au conteneur carte**
Si rotation sur composant racine, sous-titres + HUD tournent aussi. Solution : wrapper `<div style={{transform: rotate}}>` uniquement sur couche carte, overlays UI dans `<AbsoluteFill>` frère hors du rotate.

**3. Synchronisation audio Beat 3 sous-séquences**
Avec `TransitionSeries`, durées en frames fixes. Si audio varie (re-render ElevenLabs), cuts visuels décalent. Solution : `durationInFrames` dérivés de constantes dans `timing.ts`, pas de valeurs inline.

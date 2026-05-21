# Recherche — Émotion + Remotion mai 2026

> Deux recherches parallèles. Date : 2026-05-02.
> Impact direct sur S4 Nandi et sur la philosophie du format Atlas.

---

## Leçon centrale (unanime, toutes sources)

**Les moments émotionnels forts fonctionnent par SOUSTRACTION, pas par ajout.**

- Johnny Harris : coupe la musique avant la frappe émotionnelle. Le silence de 1-2s fait le travail.
- Undertale : les scènes les plus émotionnelles = fond noir + sprite statique + texte. Moins de richesse visuelle que d'habitude = signal d'émotion par contraste.
- Kurzgesagt : désaturation progressive de la palette (chaud → froid) = deuil universel, aucun visage requis.
- Wendover : les animations de carte *s'arrêtent* aux moments clés. Le mouvement de la carte est la narration normale ; l'arrêt = rupture.

**Application directe S4** : après le pic (falling-back-death Nandi + flash), on RÉDUIT. Moins d'éléments, moins de mouvement, moins de couleur.

---

## Techniques nouvelles — non couvertes par le jury AI

### 1. Grille de points qui s'éteint (dénombrement abstrait)

Pour "4000 morts" : 100 points blancs (chaque point = 40 personnes), ils s'éteignent un par un en accélérant.

```tsx
// Remotion pur, ~30 min de code
const TOTAL_POINTS = 100;
const extinctCount = Math.floor(interpolate(frame, [0, duration], [0, TOTAL_POINTS]));
// Chaque point : opacity = index < extinctCount ? 0 : 1
// Spring sur chaque extinction individuelle pour rendre organique
```

Fin : écran noir total. L'abstraction respecte la gravité du sujet.
Source : pattern documenté dans documentaires d'animation + Stamen "Atlas of Emotions".

### 2. Shaka désaturé — réutiliser le sprite S3 sans nouveau sprite

Le walk cycle Shaka validé en S3 peut être réutilisé en S4 :
- Frame figée sur position 0 (plus de boucle d'animation)
- `filter: grayscale(100%) brightness(0.6)` interpolé via useCurrentFrame()
- Transition sur 60 frames, synchronisée avec la mort de Nandi

Le personnage que le spectateur reconnaît qui s'éteint = résonance narrative forte sans rien générer de nouveau.

```tsx
const greyT = interpolate(frame, [nandiMeurtFrame, nandiMeurtFrame + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const filter = `grayscale(${greyT * 100}%) brightness(${1 - greyT * 0.4})`;
```

### 3. Silence visuel après le pic (pattern Johnny Harris)

Après DramaLine "Pour n'avoir pas pleuré assez fort" :
- Couper à fond `#0D0D0D`
- Un seul cercle bordeaux `r=12px` qui pulse lentement via spring `{damping:8}`
- Durée : 3-4 secondes (90-120 frames)
- Pas de texte. Pas de carte. Pas de sprite.

Le vide après la densité de S1-S3 *est* l'émotion. Pattern direct Undertale + Johnny Harris.

### 4. Typographie dispersée pour "4000"

Les chiffres "4 0 0 0" partent dans des directions différentes sur le beat de narration :

```tsx
Array.from("4000").map((char, i) => {
  const delay = i * 8;
  const t = interpolate(frame, [startFrame + delay, startFrame + delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const offsetX = interpolate(t, [0, 1], [0, (i - 1.5) * 60]);
  const offsetY = interpolate(t, [0, 1], [0, Math.sin(i * 1.2) * 40]);
  return <text transform={`translate(${offsetX} ${offsetY})`}>{char}</text>;
})
```

Le nombre qui se dissocie = impossibilité d'en saisir la réalité humaine.

---

## Remotion v5.0 — ce qui change pour nous

**Sorti décembre 2025. On est en v4.0.452.**

Breaking changes qui nous concernent :
- `renderMediaOnLambda()` overwrite = true par défaut (notre pipeline Vercel)
- Node minimum 18.0.0 (probablement déjà OK)
- Plusieurs fonctions Lambda supprimées (à vérifier avant migration)

**Pas urgent pour finir Shaka. Migrer avant série suivante.**

### @remotion/lottie — maintenant stable

LottieFiles = milliers d'icônes animées gratuites (flèches, symboles cartographiques, légendes).
Pour les futures épisodes Atlas : icônes de légende animées (symbole capitale, flèche commerce, étoile bataille) sans coder chaque SVG from scratch. Coût : $0.

### @remotion/skia — shaders GPU

Possible d'appliquer des shaders GLSL sur zones SVG : heat map animée, brume sur territoire, glow pulse contours. Pas d'exemple documentaire connu, techniquement disponible pour séries futures.

`--gl=angle` obligatoire pour performances headless avec Skia.

---

## Philosophie validée : Atlas brille sur territoire + mouvement

Confirmé par la recherche Wendover :
> "Les animations de carte portent l'émotion documentaire sans un seul visage humain. Le mouvement sur la carte *est* la narration dramatique."

**Format Atlas idéal** : histoires où le territoire ET son changement sont le propos central.
Exemples naturels : Hannibal (trajet), routes commerciales, empires qui grandissent/s'effondrent.

**Format hybride nécessaire** : histoires où la psychologie individuelle prime (Shaka S4).
Solution validée : PixelLab (visage/sprite) + carte (contexte) + inserts abstraits (émotion collective).

---

## Meilleures histoires Atlas après Shaka (par facilité décroissante)

| Figure | Difficulté | Raison |
|--------|-----------|--------|
| Hannibal Barca | Facile | Trajet pur : Carthage → Alpes → Rome. La carte IS le propos. |
| Empire du Ghana (routes or) | Facile | Corridors commerciaux trans-sahariens = flux animés sur carte |
| Sundiata Keïta | Moyen | Exil + retour + reconquête = mouvement géographique clair |
| Menelik II / Adoua | Moyen | Carte Afrique colonisée vs territoire résistant = contraste visuel fort |
| Mansa Moussa épisode 2 | Moyen | Conséquences économiques : routes qui se restructurent (dataviz géo) |

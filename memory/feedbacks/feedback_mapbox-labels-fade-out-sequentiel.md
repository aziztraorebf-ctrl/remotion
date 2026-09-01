# Pattern fade-out séquentiel labels Mapbox (option X) + climax visuel

> Migré depuis auto-memory 2026-08-31 (validé Or Africain Beat 3b v5, 2026-05-07). Complète
> `memory/tools/mapbox-effets-et-tests.md` (techniques overlay générales) avec un pattern de
> timing spécifique non documenté ailleurs.

Pour une séquence d'apparition de N labels (ex: 6 pays qui s'allument en rouge sur Mapbox), utiliser un **fade-out séquentiel** (option X) plutôt que tout cumuler.

## Comportement validé

1. **Chaque label apparaît** au moment où son pays est nommé dans la voix-off (timing Whisper)
2. **Fade-in 8 frames** (smooth)
3. **Reste visible jusqu'à l'arrivée du label suivant**
4. **Fade-out 6 frames** dès que le suivant arrive (pas de chevauchement)
5. **Le dernier label tient 1.5s puis disparaît** (au lieu de rester jusqu'à fin de beat)
6. **Une fois tous les labels disparus** : la carte reste avec les pays colorés + counter "N/N" → **climax visuel**

## Pourquoi (vs anti-pattern)

❌ **Anti-pattern** : dernier label reste affiché jusqu'à fin de beat → couvre la carte au moment où on veut justement la révéler entièrement (ex: rouge avec tous les pays)
✅ **Solution** : tous les labels disparaissent → carte nue révélée + counter dominant → climax pur

## Implémentation Remotion

```tsx
const LAST_LABEL_HOLD_FRAMES = 45; // ~1.5s pour le dernier label

function CountryLabel({ frame, idx, country }: ...) {
  const localStart = effectiveStartFrame(idx);
  const localEnd = idx < ADVERSARIES.length - 1
    ? effectiveStartFrame(idx + 1)              // option X : disparait quand le suivant arrive
    : localStart + LAST_LABEL_HOLD_FRAMES;       // dernier : tient 1.5s puis fade
  // ...fade in/out logic
}
```

Référence historique : `src/projects/souverain/or-africain/Beat3bPression.tsx` (⚠️ vérifier existence, projet potentiellement archivé).

## Cas d'application

Toute scène Mapbox où :
- N pays/lieux/marqueurs apparaissent séquentiellement
- Le visuel-clé final est la carte (pas les labels)
- On veut un climax avec counter "N/N" ou overlay synthétique

## Combinaison avec sous-titres karaoké

Les labels (badge encadré central) et les sous-titres karaoké (bas) coexistent SANS doublon SI :
- Labels = nom du pays uniquement (ex: "AFRIQUE DU SUD")
- Karaoké = phrase complète (ex: "L'AFRIQUE DU SUD PRÉSENTE UN DOCUMENT CONJOINT")

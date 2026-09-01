# Atlas Tombouctou - Test perf Remotion+Mapbox - VERDICT GO (ARCHIVE)

> Migré depuis auto-memory 2026-08-31 (créé 2026-04-28). Test de performance initial ayant validé
> la faisabilité Mapbox+Remotion headless — précède `scripts/render-mapbox.sh` (cf
> `memory/tools/mapbox-render-pattern-canonique.md` pour le pattern de production actuel, plus
> complet, avec fixes ultérieurs). `quebec-jacques-poc/` référencé ici n'existe plus (nettoyé
> Grand Ménage v2 2026-06-01) — contenu utile extrait dans `_reference-atlas-poc/` (toujours présent).

## Resolution du version mismatch

**Probleme** : `quebec-jacques-poc` declarait Remotion 4.0.452 mais seulement les packages core. Les annexes (`@remotion/paths`, `@remotion/shapes`, `@remotion/google-fonts`, `@remotion/webcodecs`, `@remotion/lottie`) etaient resolues depuis `node_modules` racine workspace en 4.0.415/4.0.427.

**Solution appliquee (Option A)** : bump du `package.json` racine de toutes les versions Remotion `4.0.415` -> `4.0.452` (versions pinned sans `^`). `npm install` racine.

**Verification** : `npx remotion versions` retourne "All packages have the correct version."

## Resultats test perf (Etape A + C)

Composition : `MapOutdoorsClean` (1280x720, 240 frames @ 30fps, Mapbox outdoors-v12, labels/borders/roads strippes via `stripLabelsAndBorders`).

| Frame | Real time (s) | Note |
|-------|---------------|------|
| 120 (cold) | 15.10 | 1er render, bundling + tiles cold |
| 120 (warm) | 12.61 | re-render, bundling + tiles cold |
| 150 | 11.33 | tiles cold |
| 180 | 4.57 | tiles caches |
| 210 | 4.72 | tiles caches |
| 239 | 5.38 | zoom final |

**Render pur** (sans bundling ~3-4s) : **~1-2s/frame** une fois tiles caches.

**Pour 80s @ 30fps = 2400 frames** :
- Estimation : 32-60 min en mode `render` (un seul bundling)
- Splittable en chunks 30s parallelisables si besoin

## Verdict

**< 5s/frame en mode isole = GO style.json maintenant.**

En mode batch `npx remotion render`, le bundling est paye une seule fois donc perf reelle largement meilleure. Pas de pivot pre-render necessaire.

## Configuration validee (référence historique — voir `render-mapbox.sh` pour la version actuelle avec fixes)

### Render command obligatoire (Mapbox+Remotion)
```bash
npx remotion render --gl=angle --concurrency=1
```
- `--gl=angle` : confirmé — reste vrai dans `scripts/render-mapbox.sh` actuel
- `--concurrency=1` : Mapbox WebGL ne supporte pas le parallélisme

### Stack technique validée (à l'époque)
- Remotion 4.0.452 (racine + poc alignes)
- mapbox-gl 3.22.0
- react-map-gl 8.1.1 (le skill maps recommandait déjà mapbox-gl direct + `useDelayRender()` plutôt que react-map-gl)
- react 19.2.5
- Node 25.6.0

### Mapbox config validée en headless
```ts
new mapboxgl.Map({
  container: ref.current,
  style: "mapbox://styles/mapbox/outdoors-v12",
  interactive: false,
  attributionControl: false,
  preserveDrawingBuffer: true,
  fadeDuration: 0,
})
```

## Anti-patterns detectes

1. **`mapRef.current.jumpTo()` dans useEffect** au lieu de driver via `useCurrentFrame()` directement. Animations doivent être drivées par `useCurrentFrame()` — cf doctrine projet "Mapbox = frame-driven obligatoire" (CLAUDE.md).
2. **`map.remove()` dans cleanup** : à éviter en headless Remotion.

## Fichiers de reference (au moment du test, 2026-04-28)

- `quebec-jacques-poc/src/MapOutdoorsClean.tsx` — n'existe plus, contenu extrait dans `_reference-atlas-poc/`

---
name: Mapbox layers vector ne fonctionnent PAS en Remotion headless globe mode
description: Pour ajouter du fill/border sur un pays en Remotion + Mapbox globe mode, utiliser overlay SVG React, pas Mapbox addLayer ou setPaintProperty.
type: feedback
---

# Mapbox layers vs SVG overlay en Remotion headless

**Règle :** pour ajouter un fill/border conditionnel sur un pays/région dans Remotion + Mapbox en mode globe, utiliser un **overlay SVG React** par-dessus la carte. Ne PAS utiliser `map.addLayer` + `setPaintProperty`.

**Why :** test exhaustif 2026-04-29 sur Atlas Tombouctou (~6 itérations) :
1. `fill` layer dans style.json + `setPaintProperty` → invisible
2. `fill` layer ajouté via `addLayer` + `setPaintProperty` → invisible
3. `fill-extrusion` layer (height=1) → invisible
4. Tous opacités hardcodées 0.8 → toujours invisible

**Cause racine :** en mode globe + hillshade raster, Mapbox compose les fills vector AVANT le hillshade dans la pile finale. De plus, en Remotion headless, `addLayer` dans `style.load` peut ne pas être appliqué avant que le canvas soit capturé. `setPaintProperty` ne déclenche pas un re-render synchrone.

**How to apply :**
1. Stocker les coordonnées GeoJSON dans un state React (`maliPolyPx`)
2. Dans le `useEffect` qui dépend de `frame` : `mapRef.current.project([lon, lat])` pour chaque point
3. Dessiner un `<polygon>` SVG React par-dessus le `<div>` Mapbox
4. Animer l'opacité via `interpolate(frame, ...)` sur l'attribut `fillOpacity`

**Pattern code :**
```tsx
const [maliPolyPx, setMaliPolyPx] = useState<string>("");

useEffect(() => {
  if (!mapRef.current || !ready) return;
  mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing });
  const pts = MALI_POLYGON.map(([lo, la]) => {
    const p = mapRef.current!.project([lo, la]);
    return `${p.x},${p.y}`;
  });
  setMaliPolyPx(pts.join(" "));
}, [frame, lon, lat, zoom, pitch, bearing, ready]);

// JSX
<svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} viewBox={`0 0 ${width} ${height}`}>
  <polygon points={maliPolyPx} fill="#1F2A4A" fillOpacity={maliOpacity * 0.65} />
  <polyline points={maliPolyPx} fill="none" stroke="#D4A574" strokeWidth="5" filter="url(#glow)" />
</svg>
```

**Avantages overlay SVG vs Mapbox layer :**
- 100% prévisible en Remotion headless
- Animation frame-by-frame sans hack `setPaintProperty`
- Effets SVG (glow, blur, filters) disponibles
- Pas de problème de compositing hillshade/raster

**Inconvénient :** la projection 3D du globe peut faire que les points en bord de globe soient déformés. Acceptable car les Shorts Atlas zooment toujours sur la zone d'intérêt avant que le contour apparaisse.

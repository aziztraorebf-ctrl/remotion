---
name: d3-pattern-utility-only
description: Pattern validé pour utiliser D3.js dans Remotion sans conflit React reconciler — utility-only (calculs) + rendu SVG/React + animations Remotion. Applicable Souverain, Atlas, tout projet data-viz.
type: reference
---

# Pattern D3.js utility-only dans Remotion

> Validé 2026-05-23 via prototype `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`.
> Applicable à TOUT projet (Souverain, Atlas, futur Maroc Batteries, etc.).

---

## Le pattern en 3 lignes

1. **D3** sert UNIQUEMENT aux calculs (`scaleLinear`, `format`, `ticks`, `extent`)
2. **SVG/React** rend les éléments (`<rect>`, `<circle>`, `<text>` en JSX)
3. **Remotion** anime via `interpolate` + `spring` + `useCurrentFrame`

## Anti-pattern (à ne JAMAIS faire)

```ts
// ❌ INTERDIT : laisser D3 manipuler le DOM
d3.select(svgRef.current)
  .selectAll("rect")
  .data(values)
  .enter()
  .append("rect");
```

→ Conflit avec React reconciler. Le rendu casse au premier re-render Remotion.

## Pattern correct

```tsx
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// 1. D3 : calculs
const xScale = scaleLinear().domain([0, 100]).range([0, 800]);
const ticks = xScale.ticks(5);  // [0, 20, 40, 60, 80, 100]
const fmtMoney = format("$,.0f");

// 2. Remotion : animation
const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

// 3. SVG/React : rendu
return (
  <svg>
    <rect x={0} y={0} width={xScale(100) * progress} height={50} fill="#c8a951" />
    {ticks.map((t) => (
      <text key={t} x={xScale(t)} y={70}>{fmtMoney(t)}M</text>
    ))}
  </svg>
);
```

## Modules D3 installés (package.json)

- `d3-scale` (^4.0.2) — `scaleLinear`, `scaleBand`, `scaleOrdinal`, `scaleTime`
- `d3-array` (^3.2.4) — `extent`, `max`, `sum`, `mean`, `bisector`
- `d3-format` (^3.1.2) — `format(".0%")`, `format("$,.0f")`, `format(",.2f")`
- `d3-geo` (^3.1.1) — `geoMercator`, `geoPath` (déjà utilisé pour Atlas)

## Cas d'usage validés

| Cas | Modules D3 | Référence |
|-----|------------|-----------|
| StackedBars (Cost Recovery) | scale + format + ticks | `PrototypeD3StackedBars.tsx` |
| Choropleth multi-pays | scale (couleurs) + d3-array | À tester Acte 3 S1 |
| Timeline horizontale | scaleTime + ticks | Pas encore implémenté |
| Comparaison side-by-side | scaleBand + d3-array | À tester Acte 3 S1 |
| Échelles monétaires axes | scaleLinear + format("$.2s") | Pattern de base |

## Alternative à considérer si D3 brut devient lourd

- **visx** (Airbnb) — wrapper React de D3, pre-emballe `<XAxis>`, `<Bar>`, `<LinePath>`. Plus rapide pour prototyper, moins de contrôle fin sur animations. À tester si on construit beaucoup de graphes complexes en Acte 3+.

## Quand NE PAS utiliser D3

- Animation simple d'un nombre (countUp) → preset `src/projects/_shared/animations.ts`
- Donut/pie chart simple → SVG `path` direct (cf. `Beat9.tsx`)
- Mapbox (déjà notre stack carto principale)
- Layouts (Tailwind suffit)

## Référence DOCTRINE

`memory/doctrines/DOCTRINE-SOUVERAIN.md` section 9 "Stack — Outils évalués" (entrée D3.js VALIDÉ 2026-05-23).

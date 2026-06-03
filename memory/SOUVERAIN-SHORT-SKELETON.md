# Squelette Short Souverain Mapbox — Référence de production

> Extrait de PetrolePatienceShort.tsx (validé, quasi-autonome).
> Lire ce fichier AVANT de coder tout nouveau Short Souverain Mapbox.
> Modèle : `/Users/clawdbot/Workspace/remotion/src/projects/_demos/petrole-patience/PetrolePatienceShort.tsx`

---

## Structure d'un Short (80-110s, 6 actes)

```
A1 (0→F.A2)     Hook — stat choc + carte large
A2 (F.A2→F.A3)  Contexte — whip pan + données
A3 (F.A3→F.A4)  Développement — contre-exemple ou acteur clé
A4 (F.A4→F.A5)  Pivot — lieu/acteur central + drapeau animé
A5 (F.A5→F.A6)  Comparaison — split data (18% vs 82%, etc.)
A6 (F.A6→F.END) Question finale — drift + pull back + CTA
```

**Timing constants** — définir en frames dès le début, tout le code en dépend :
```ts
export const F = {
  A1_START: 0,
  A2_START: 411,   // ~13.7s
  A3_START: 906,   // ~30.2s
  A4_START: 1314,  // ~43.8s
  A5_START: 1683,  // ~56.1s
  A6_START: 2169,  // ~72.3s
  END:      2404,  // ~80.2s
};
```

---

## Architecture du composant — UN SEUL FICHIER

Le Short est **1 fichier TSX unique** — pas de beats séparés. Pourquoi :
- La caméra Mapbox est continue — 1 seule instance Map
- Les overlays se succèdent dans un unique `ShortOverlays` conditionnel
- Le timing est une fonction `getCam(frame)` qui gère tous les actes

**Pattern composant :**
```tsx
export const MonShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 1 ref Mapbox
  // 1 ref canvases (Record<string, HTMLCanvasElement>)
  // 1 useEffect init map
  // 1 useEffect principal (engine) — s'exécute chaque frame
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio narration />
      <Audio music />
      <MapboxBrandingHide />
      <AbsoluteFill style={{ filter: blur }}>
        <div ref={containerRef} style={{ width:'100%', height:'100%' }} />
      </AbsoluteFill>
      <ShortOverlays frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
```

---

## Caméra — pattern getCam(frame)

Une seule fonction qui retourne `{lon, lat, zoom, pitch, bearing, blur}` selon l'acte.
**JAMAIS flyTo/easeTo — uniquement `map.jumpTo()`** appelé chaque frame dans useEffect.

```ts
function getCam(frame: number): Cam & { blur: number } {
  if (frame < F.A2_START) {
    const t = clamp01(frame / F.A2_START);
    const e = easeInOut(t);
    return {
      lon: interpolate(e, [0,1], [lon_start, lon_end]),
      lat: interpolate(e, [0,1], [lat_start, lat_end]),
      zoom: interpolate(e, [0,1], [zoom_start, zoom_end]),
      pitch: ..., bearing: ..., blur: 0,
    };
  }
  // ... autres actes
}
```

**WhipBlur** — flou pendant une transition rapide :
```ts
function whipBlur(f: number, start: number, dur = 50): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5
    ? interpolate(t, [0, 0.5], [0, 14])
    : interpolate(t, [0.5, 1], [14, 0]);
}
```

Appliquer via : `<AbsoluteFill style={{ filter: blur > 0 ? \`blur(\${blur}px)\` : undefined }}>`

---

## Overlays — pattern ShortOverlays

Un seul composant React conditionnel — pas de composants séparés par beat :
```tsx
const ShortOverlays: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < F.A2_START) {
    const p1 = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        <div style={{ position:'absolute', top:100, left:60, right:60, opacity:p1, transform:`translateY(${(1-p1)*20}px)` }}>
          {/* titre, stat, etc. */}
        </div>
      </>
    );
  }
  if (frame < F.A3_START) { /* A2 overlays */ }
  // ...
  return null;
};
```

**Règles overlays :**
- `spring({ damping: 18, durationInFrames: 30 })` pour les entrées d'éléments
- `position: 'absolute'` + coordonnées fixes (top/left/right/bottom)
- Palette : navy `#0d1520`, gold `#c8a951`, ivory `#f2ebd9`
- Font : Georgia serif pour les titres/stats, IBM Plex Mono pour les données techniques

---

## Drapeaux animés — pattern canvas ondulant

```ts
function drawFlag(canvas: HTMLCanvasElement, phase: number) {
  // phase = (frame / fps) * 1.8 — varie de 0 à 2π environ
  for (let x = 0; x < canvas.width; x++) {
    const waveY = Math.sin((x / canvas.width) * Math.PI * 3 + phase) * canvas.height * 0.07;
    // dessiner la colonne x avec décalage waveY
  }
}
// Appel chaque frame dans useEffect :
const phase = (frame / fps) * 1.8;
drawFlag(canvas, phase);
pushCanvas(map, 'img-id', canvas);
```

**pushCanvas** — helper de transfert canvas→Mapbox (copier tel quel) :
```ts
function pushCanvas(map, id, canvas) {
  const data = ctx.getImageData(0,0,w,h).data as unknown as Uint8Array;
  if (!map.hasImage(id)) map.addImage(id, {width:w, height:h, data});
  else map.updateImage(id, {width:w, height:h, data});
}
```

---

## Audio

```tsx
<Audio src={staticFile('episode/audio/narration.mp3')} />
<Audio
  src={staticFile('_shared/sfx/...')}
  volume={(f) => {
    if (f < 60) return interpolate(f, [0,60], [0, 0.18]);
    if (f > END - 60) return interpolate(f, [END-60, END], [0.18, 0]);
    return 0.18;
  }}
/>
```

---

## Root.tsx — enregistrement

```tsx
<Composition
  id="MarocBatteries-Short"
  component={MarocBatteriesShort}
  durationInFrames={MAROC_SHORT_FRAMES}
  fps={30} width={1080} height={1920}
/>
```

---

## Render

**Toujours via render-mapbox.sh** (Mapbox nécessite chrome-headless-shell) :
```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/short_v1.mp4
```

---

## Règle de progression — 2 nouveautés max par épisode

Chaque épisode doit :
1. **Réutiliser** les techniques déjà validées (fill-pattern drapeau, dasharray, halos, whip blur)
2. **Introduire max 2 nouveautés** — pas forcément des templates Remotion. Peut être une nouvelle technique Mapbox, un nouvel effet visuel, une nouvelle mécanique narrative. Ce qui fait grandir la bibliothèque progressivement.

Les nouveautés ne s'inventent pas avant de coder — elles émergent naturellement quand quelque chose manque.

**Documenter les nouveautés** dans `public/_shared/ASSETS-INDEX.md` après validation.

## Règle Mapbox — 1 Map continue, pas de blur sauf grande distance

- **1 seule instance Map** pour tout le short — la caméra glisse de façon continue
- **Pas de whip blur** pour des transitions courtes (ex: Khouribga→Kénitra = même région)
- **Blur acceptable** uniquement pour des distances intercontinentales (Maroc→Chine, Afrique→Europe)
- **Jamais flyTo/easeTo** — uniquement `map.jumpTo()` frame-driven

## Doctrine visuelle premium (LIRE EN PREMIER)

> **`memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`** — la doctrine cartographique premium.
> 5 principes (drift continu · séquentiel synchro syllabe · anti-gris remplissage actif · projection images bichromie navy/gold · habillage narratif flux animés) + règle anti-clonage (jamais satellite/emojis) + template storyboard 7 champs.
> Le Camera Brief ci-dessous est le champ #3 du template storyboard complet du Playbook.

---

## Camera Brief — règle de production (NON-NEGOTIABLE)

**AVANT d'écrire getCam(), Claude produit ce tableau et attend la validation d'Aziz :**

```
| Acte | Mouvement (Camera Lab v2) | Depuis → Vers | Zoom début→fin | Durée | Blur |
|------|--------------------------|---------------|----------------|-------|------|
| A1   | …                        | …             | …              | …     | …    |
| A2   | …                        | …             | …              | …     | …    |
| A3   | …                        | …             | …              | …     | …    |
| A4   | …                        | …             | …              | …     | …    |
| A5   | …                        | …             | …              | …     | …    |
| A6   | …                        | …             | …              | …     | …    |
```

Mouvements disponibles (Camera Lab v2 validé headless) :
Drift · Orbit+Dolly · Whip Pan 60f · Zoom+Freeze · Tilt · Counter-Rotation · Blur Atmo · Pull Back Planétaire · Zoom Sol 3D · Fade Style Switch · Pull Back Reveal

Règles de remplissage :
- Zoom jamais < 2 (planétaire) ni > 14 (sol)
- Blur uniquement sur distances intercontinentales
- A6 = toujours Pull Back ou drift — finir large, pas serré

getCam() est écrit APRÈS validation du tableau, pas avant.

---

## Ce qui change d'un épisode à l'autre

| Fixe (copier tel quel) | Variable (adapter) |
|------------------------|-------------------|
| Pattern getCam + whipBlur | Coordonnées LOC |
| pushCanvas + ensureSource | Timing F.A1→F.END |
| Pattern ShortOverlays conditionnel | Textes/stats/titres |
| Audio fade in/out | Drapeaux pays |
| Root.tsx composition | Nom composant + fichier audio |

---

## Anti-patterns à ne PAS reproduire

- ❌ Beats séparés (Beat0.tsx, Beat1.tsx...) — la caméra Mapbox est continue, un seul composant
- ❌ flyTo/easeTo — headless incompatible
- ❌ fill-pattern pour gradients — tiling visible, utiliser fill-color
- ❌ Workflow multi-agents pour coder le short — trop lent, erreurs d'intégration
- ❌ Karaoké word-by-word sur un Short — trop dense, utiliser overlays par acte

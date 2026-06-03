# Maroc Batteries — Complétion A3→A6 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Compléter `MarocBatteriesShort.tsx` (actes A3 Cailloux, A4 Acteurs, A5 Géopolitique, A6 Question finale) pour produire un Short 109s autonome prêt à render.

**Architecture:** 1 fichier TSX unique, 1 Map Mapbox continue, pattern getCam(frame) + ShortOverlays conditionnel. A1+A2 déjà validés — ne pas toucher. Chaque acte = section dans getCam() + bloc dans ShortOverlays + layers Mapbox setup dans setupRef.

**Tech Stack:** Remotion, Mapbox GL JS, TypeScript, GéoAfrique V5 style, forced alignment depuis `timing.ts`

---

## Contexte — Ce qui existe déjà (NE PAS MODIFIER)

- `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx` — A1 + A2 complets
- `src/projects/souverain/maroc-batteries/timing.ts` — SEGMENTS + WORD_ANCHORS (forced alignment ElevenLabs)
- Constante `F` dans le fichier : A1_START=0, A2_START=248, A3_START=932, A4_START=1300, A5_START=1817, A6_START=2977, END=3284
- Coordonnées `LOC` dans le fichier : kenitra, khouribga, wolfsburg, hefei, tanger, algeciras, eurafriq, detroit, atlantique, maroc
- Couleurs `C` : navy, gold, accent, ivory, red

## Timing forcé (frames à 30fps — ne pas hardcoder ailleurs)

```
A3 Cailloux  : f932  → f1299  (~12.3s) — PUR REMOTION (pas de carte)
A4 Acteurs   : f1300 → f1816  (~17.2s) — MAPBOX (Kénitra + Wolfsburg)
A5 Géopoli   : f1817 → f2976  (~38.6s) — MAPBOX (Méditerranée, Europe/Maroc)
A6 Question  : f2977 → f3284  (~10.2s) — REMOTION (pull back + texte final)
```

## Key word timestamps (pour synchro)

```
f1343 → "Aujourd'hui" (début Beat3)
f1367 → "Kénitra"
f1456 → "Gotion"
f1490 → "High-Tech"
f1535 → "Volkswagen"
f1648 → "Démarrage"
f1831 → "Maroc" (début Beat4)
f2063 → "phosphates"
f2198-f2210 → "dans les batteries"
f2277 → "Europe"
f2500 → "Maroc" (deux heures de bateau)
f2603 → "Maroc ne choisit pas"
f2675 → "Europe"
f2704 → "l'endroit où les deux fabriquent ensemble"
f2885 → "géographie industrielle"
f3101 → "Si le Maroc contrôle le phosphate"
f3223 → "qui fixe le prix"
f3281 → "ans"
```

---

## Task 1 — A3 Cailloux (f932→f1299) — getCam() + ShortOverlays

**Acte:** "Pendant des décennies, le Maroc exportait ce phosphate brut, des cailloux, à bas prix. D'autres le transformaient, le raffinaient, encaissaient la valeur ajoutée."

**Visuel :** PUR REMOTION. Pas de carte. Split image phosphate brut (haut) / cathode LFP (bas). Balance animée. Stat `À BAS PRIX`.

**Files:**
- Modify: `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx`

### Step 1 : getCam() — retourner une vue statique pour A3

Dans la fonction `getCam()`, remplacer le `return` fallback final par une vraie condition pour A3. La carte n'est PAS visible (A3 = pur Remotion), donc la caméra peut rester sur une vue Maroc neutre pendant cet acte.

```ts
// Après le bloc A2 (if (frame < F.A3_START)), avant A4 :
if (frame < F.A4_START) {
  // A3 = pur Remotion — carte visible mais dézoomée, neutral, drift très lent
  const lf = frame - F.A3_START;
  const t = clamp01(lf / (F.A4_START - F.A3_START));
  return {
    lon: interpolate(t, [0, 1], [-6.0, -5.5]),
    lat: interpolate(t, [0, 1], [32.0, 32.5]),
    zoom: interpolate(t, [0, 1], [5.0, 5.3]),
    pitch: 0,
    bearing: interpolate(t, [0, 1], [0, -3]),
  };
}
```

### Step 2 : ShortOverlays A3 — split texte + stat

Dans `ShortOverlays`, après le bloc `if (frame < F.A3_START)`, ajouter :

```tsx
if (frame < F.A4_START) {
  const lf = frame - F.A3_START;
  // Intro : "Pendant des décennies..." — fond noir + titre
  const titleSp = spring({ frame: lf, fps, config: { damping: 18 }, durationInFrames: 30 });
  const titleOp = interpolate(lf, [0, 20, F.A4_START - F.A3_START - 25, F.A4_START - F.A3_START - 5],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Stat "À BAS PRIX" — apparaît à lf120 (quand "cailloux" est prononcé ~f1064)
  const statSp = spring({ frame: Math.max(0, lf - 120), fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const statOp = interpolate(lf, [120, 145, F.A4_START - F.A3_START - 25, F.A4_START - F.A3_START - 5],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "D'autres encaissaient" — phrase accusatrice, apparaît à lf240 (f1173)
  const autreSp = spring({ frame: Math.max(0, lf - 240), fps, config: { damping: 18 }, durationInFrames: 30 });
  const autreOp = interpolate(lf, [240, 265, F.A4_START - F.A3_START - 25, F.A4_START - F.A3_START - 5],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {lf === 0 && <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} startFrom={0} volume={0.50} />}
      {lf === 120 && <Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} startFrom={0} volume={0.35} />}

      {/* Fond overlay semi-transparent — A3 est sur fond carte nue, on assombrit */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(13,21,37,0.72) 0%, rgba(13,21,37,0.55) 50%, rgba(13,21,37,0.72) 100%)",
        opacity: titleOp, pointerEvents: "none",
      }} />

      {/* Titre acte */}
      <div style={{
        position: "absolute", top: 260, left: 60, right: 60,
        opacity: titleOp,
        transform: `translateY(${(1 - titleSp) * 16}px)`,
        pointerEvents: "none",
      }}>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600,
          color: C.ivory, letterSpacing: "0.14em", textTransform: "uppercase",
          margin: 0, opacity: 0.65,
        }}>PENDANT DES DÉCENNIES</p>
        <p style={{
          fontFamily: "'Anton', sans-serif", fontSize: 72, lineHeight: 1.0,
          color: C.ivory, margin: "8px 0 0", letterSpacing: "0.02em",
        }}>LE MAROC{"\n"}EXPORTAIT</p>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 600,
          color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase",
          margin: "12px 0 0",
        }}>DU PHOSPHATE BRUT</p>
      </div>

      {/* Stat choc — "À BAS PRIX" en rouge accusateur */}
      {lf >= 110 && (
        <div style={{
          position: "absolute", bottom: 360, left: 0, right: 0, textAlign: "center",
          opacity: statOp,
          transform: `scale(${0.85 + statSp * 0.15})`,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "'Anton', sans-serif", fontSize: 96, lineHeight: 0.9, margin: 0,
            color: C.red, letterSpacing: "0.02em",
            textShadow: `0 0 24px rgba(230,57,70,0.55), 0 4px 16px rgba(0,0,0,0.6)`,
          }}>À BAS PRIX</p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 600,
            color: C.ivory, letterSpacing: "0.12em", textTransform: "uppercase",
            margin: "10px 0 0", opacity: 0.7,
          }}>DES CAILLOUX</p>
        </div>
      )}

      {/* "D'autres encaissaient la valeur ajoutée" */}
      {lf >= 230 && (
        <div style={{
          position: "absolute", bottom: 200, left: 60, right: 60,
          opacity: autreOp,
          transform: `translateY(${(1 - autreSp) * 12}px)`,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 600,
            color: C.ivory, letterSpacing: "0.1em", textTransform: "uppercase",
            margin: 0, opacity: 0.8, textAlign: "center",
          }}>D'AUTRES ENCAISSAIENT</p>
          <p style={{
            fontFamily: "'Anton', sans-serif", fontSize: 60, lineHeight: 1.0,
            color: C.gold, margin: "6px 0 0", textAlign: "center",
          }}>LA VALEUR AJOUTÉE</p>
        </div>
      )}
    </>
  );
}
```

### Step 3 : Karaoké A3 — ajouter dans le JSX principal

Dans le JSX `return` du composant principal, après `{frame >= F.A2_START && frame < F.A3_START && <KaraokeSubtitles ...>}`, ajouter :

```tsx
{frame >= F.A3_START && frame < F.A4_START && <KaraokeSubtitles startS={31.06} endS={43.32} />}
```

### Step 4 : Render test A3

```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/a3_v1.mp4 --start 932 --end 1299
```

Vérifier : overlays lisibles, carte visible mais sombre, "À BAS PRIX" percutant.

---

## Task 2 — A4 Acteurs (f1300→f1816) — getCam() Kénitra→Wolfsburg + layers

**Acte:** "Aujourd'hui, à Kénitra, une gigafactory de 156 hectares sort de terre. Gotion High-Tech, chinois. Volkswagen, 40% actionnaire. Démarrage mi-2026."

**Visuel :** MAPBOX. Zoom Sol 3D Kénitra → Whip Pan → Drift Wolfsburg. Labels GIGAFACTORY + GOTION + VW. Arc dasharray rouge Kénitra→Wolfsburg.

**Files:**
- Modify: `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx`

### Step 1 : getCam() A4

```ts
if (frame < F.A5_START) {
  const lf = frame - F.A4_START;
  const dur = F.A5_START - F.A4_START; // ~516f

  // Stop1 (lf 0→239) : Zoom Sol 3D Kénitra — pitch progressif 0→35°
  if (lf < 240) {
    const t = clamp01(lf / 240);
    const e = easeInOut(t);
    return {
      lon: LOC.kenitra[0],
      lat: LOC.kenitra[1],
      zoom: interpolate(e, [0, 1], [11.0, 13.0]),
      pitch: interpolate(e, [0, 1], [0, 35]),
      bearing: interpolate(e, [0, 1], [-8, 8]),
    };
  }
  // Whip Pan (lf 240→299) : transition Kénitra → Wolfsburg — blur appliqué côté ShortOverlays
  if (lf < 300) {
    const t = clamp01((lf - 240) / 60);
    const e = easeInOut(t);
    return {
      lon: interpolate(e, [0, 1], [LOC.kenitra[0], LOC.wolfsburg[0]]),
      lat: interpolate(e, [0, 1], [LOC.kenitra[1], LOC.wolfsburg[1]]),
      zoom: interpolate(e, [0, 1], [13.0, 8.5]),
      pitch: interpolate(e, [0, 1], [35, 0]),
      bearing: 0,
    };
  }
  // Stop2 (lf 300→fin) : Drift Wolfsburg — arc dessine pendant ce temps
  const t2 = clamp01((lf - 300) / (dur - 300));
  const e2 = easeInOut(t2);
  return {
    lon: interpolate(e2, [0, 1], [LOC.wolfsburg[0], LOC.wolfsburg[0] + 0.5]),
    lat: interpolate(e2, [0, 1], [LOC.wolfsburg[1], LOC.wolfsburg[1] - 0.3]),
    zoom: interpolate(e2, [0, 1], [8.5, 8.8]),
    pitch: 0,
    bearing: interpolate(e2, [0, 1], [0, -4]),
  };
}
```

### Step 2 : Setup layers A4 dans setupRef

Dans le bloc `if (!setupRef.current)`, AVANT `setupRef.current = true`, ajouter :

```ts
// ── A4 — Arc dasharray rouge Kénitra→Wolfsburg ──
if (!map.getSource("kw-arc")) {
  map.addSource("kw-arc", { type: "geojson", data: {
    type: "Feature", geometry: { type: "LineString",
      coordinates: [LOC.kenitra, [-3.0, 45.5], LOC.wolfsburg] }, properties: {} } });
  map.addLayer({ id: "kw-line", type: "line", source: "kw-arc",
    paint: { "line-color": C.red, "line-width": 3, "line-dasharray": [5, 4], "line-opacity": 0 } });
}
// ── A4 — Highlight Kénitra fill-extrusion or circle zone ──
if (!map.getSource("kenitra-zone")) {
  map.addSource("kenitra-zone", { type: "geojson", data: {
    type: "Feature", geometry: { type: "Point", coordinates: LOC.kenitra }, properties: {} } });
  map.addLayer({ id: "kenitra-zone-fill", type: "circle", source: "kenitra-zone",
    paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 80, 14, 200],
      "circle-color": C.gold, "circle-opacity": 0, "circle-blur": 0.7 } });
}
// ── A4 — Marker DOM WOLFSBURG ──
// (créer markerWolfsburgRef en tête du composant, ajouter en setupRef)
```

**Note :** Créer `markerWolfsburgRef` et `markerKenitraA4Ref` dans la section `useRef` du composant (après `khouribgaMarkerRef`).

```ts
const markerWolfsburgRef = useRef<mapboxgl.Marker | null>(null);
```

Setup marker Wolfsburg dans setupRef (pattern identique aux autres markers) :

```ts
if (!markerWolfsburgRef.current) {
  const el = document.createElement("div");
  el.style.cssText = "display:flex;align-items:center;height:40px;opacity:0;pointer-events:none;";
  const bar = document.createElement("div");
  bar.style.cssText = "width:4px;height:100%;background:#c08820;border-radius:2px;flex-shrink:0";
  const plate = document.createElement("div");
  plate.style.cssText = "background:#0d1525;padding:0 12px;height:100%;display:flex;align-items:center;gap:8px;";
  const label = document.createElement("span");
  label.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:700;color:#fff;letter-spacing:0.08em;white-space:nowrap;";
  label.textContent = "WOLFSBURG";
  const sub = document.createElement("span");
  sub.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:12px;color:rgba(242,235,217,0.6);letter-spacing:0.06em;white-space:nowrap;";
  sub.textContent = "2H DE BATEAU";
  plate.appendChild(label); plate.appendChild(sub); el.appendChild(bar); el.appendChild(plate);
  const marker = new mapboxgl.Marker({ element: el, anchor: "left", offset: [18, 0] })
    .setLngLat(LOC.wolfsburg).addTo(map);
  markerWolfsburgRef.current = marker;
}
// Cleanup dans return du useEffect init :
markerWolfsburgRef.current?.remove(); markerWolfsburgRef.current = null;
```

### Step 3 : Engine A4 dans useEffect principal

Après le bloc A2, ajouter :

```ts
const inA4 = frame >= F.A4_START && frame < F.A5_START;
const lf4 = frame - F.A4_START;

// Blur whip pan (lf240→300)
// Appliqué via une variable blur dans getCam — modifier getCam pour retourner blur:
// Dans le return whip pan : blur: whipBlur(lf, 240, 60) — helper déjà dans le fichier
// (vérifier si whipBlur est défini, sinon l'ajouter)

// Zone Kénitra — visible pendant Stop1
if (map.getLayer("kenitra-zone-fill")) {
  const zoneOp = inA4
    ? interpolate(lf4, [0, 30, 250, 330], [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  try { map.setPaintProperty("kenitra-zone-fill", "circle-opacity", zoneOp); } catch {}
}

// Arc Kénitra→Wolfsburg — se dessine pendant Stop2 (lf300→420)
if (map.getLayer("kw-line")) {
  const arcOp = inA4
    ? interpolate(lf4, [300, 360, F.A5_START - F.A4_START - 30, F.A5_START - F.A4_START - 5],
        [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  try {
    map.setPaintProperty("kw-line", "line-opacity", arcOp);
    if (inA4 && lf4 > 300) {
      const offset = (lf4 * 0.35) % 9;
      map.setPaintProperty("kw-line", "line-dasharray", [5 - offset * 0.2, 4 + offset * 0.2]);
    }
  } catch {}
}

// Marker Wolfsburg — apparaît dès Stop2 (lf300)
const wbEl = markerWolfsburgRef.current?.getElement();
if (wbEl) {
  const op = inA4
    ? interpolate(lf4, [300, 325, F.A5_START - F.A4_START - 20, F.A5_START - F.A4_START - 5],
        [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  wbEl.style.opacity = String(op);
}
```

**Note getCam() blur :** ajouter `blur: number` au type `Cam` et à tous les `return` de getCam(), valeur `0` par défaut. Pour la phase whip pan A4, retourner `blur: whipBlur(lf4, 240, 60)`. Vérifier si `whipBlur` est défini dans le fichier — si non, l'ajouter :

```ts
function whipBlur(f: number, start: number, dur = 60): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5 ? interpolate(t, [0, 0.5], [0, 12]) : interpolate(t, [0.5, 1], [12, 0]);
}
```

Et dans le composant, calculer le blur couramment :

```ts
const camBlur = getCam(frame).blur ?? 0;
// Remplacer le div containerRef :
<AbsoluteFill style={{ filter: camBlur > 0 ? `blur(${camBlur}px)` : undefined }}>
  <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: C.navy }} />
</AbsoluteFill>
```

### Step 4 : ShortOverlays A4 — plaques GOTION + VW

```tsx
if (frame < F.A5_START) {
  const lf = frame - F.A4_START;
  const dur = F.A5_START - F.A4_START;

  // Plaque GIGAFACTORY + "156 ha" — apparaît f30 local (f1330)
  const gfSp = spring({ frame: Math.max(0, lf - 30), fps, config: { damping: 16 }, durationInFrames: 25 });
  const gfOp = interpolate(lf, [30, 55, 250, 280], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Plaque GOTION — lf60 (f1360, un peu avant "Gotion" f1456 mais anticipe visuel)
  const goSp = spring({ frame: Math.max(0, lf - 135), fps, config: { damping: 18 }, durationInFrames: 25 });
  const goOp = interpolate(lf, [135, 160, 250, 280], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Plaque VW — lf190 (f1490 ~ "Volkswagen" f1535, légèrement avant)
  const vwSp = spring({ frame: Math.max(0, lf - 190), fps, config: { damping: 18 }, durationInFrames: 25 });
  const vwOp = interpolate(lf, [190, 215, 250, 280], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Whip pan blur — appliquer via filter sur les overlays aussi
  const blur = whipBlur(lf, 240, 60);

  return (
    <>
      {lf === 0 && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} startFrom={0} volume={0.40} />}
      {lf === 30 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} startFrom={0} volume={0.55} />}
      {lf === 135 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} startFrom={0} volume={0.55} />}
      {lf === 240 && <Audio src={staticFile("_shared/sfx/ui/whoosh.mp3")} startFrom={0} volume={0.50} />}
      {lf === 350 && <Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} startFrom={0} volume={0.30} />}

      <div style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined, pointerEvents: "none" }}>
        {/* Plaque GIGAFACTORY */}
        {lf >= 25 && (
          <div style={{
            position: "absolute", top: 180, left: 60,
            opacity: gfOp, transform: `translateX(${(1 - gfSp) * -20}px)`,
          }}>
            <div style={{ display: "flex", alignItems: "stretch", height: 56 }}>
              <div style={{ width: 5, background: C.gold, borderRadius: 3, flexShrink: 0 }} />
              <div style={{ background: "rgba(13,21,37,0.88)", padding: "0 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, color: C.ivory, letterSpacing: "0.12em" }}>GIGAFACTORY</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: C.gold, letterSpacing: "0.1em" }}>156 HECTARES</span>
              </div>
            </div>
          </div>
        )}

        {/* Plaque GOTION rouge */}
        {lf >= 130 && (
          <div style={{
            position: "absolute", top: 290, left: 60,
            opacity: goOp, transform: `translateX(${(1 - goSp) * -20}px)`,
          }}>
            <div style={{ display: "flex", alignItems: "stretch", height: 48 }}>
              <div style={{ width: 5, background: "#de2910", borderRadius: 3, flexShrink: 0 }} />
              <div style={{ background: "rgba(13,21,37,0.88)", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, color: "#de2910", letterSpacing: "0.1em" }}>GOTION</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "rgba(242,235,217,0.6)", letterSpacing: "0.06em", marginLeft: 10 }}>CHINOIS</span>
              </div>
            </div>
          </div>
        )}

        {/* Plaque VW bleue */}
        {lf >= 185 && (
          <div style={{
            position: "absolute", top: 385, left: 60,
            opacity: vwOp, transform: `translateX(${(1 - vwSp) * -20}px)`,
          }}>
            <div style={{ display: "flex", alignItems: "stretch", height: 48 }}>
              <div style={{ width: 5, background: "#001e50", borderRadius: 3, flexShrink: 0 }} />
              <div style={{ background: "rgba(13,21,37,0.88)", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, color: "#4a8fe8", letterSpacing: "0.1em" }}>VOLKSWAGEN</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "rgba(242,235,217,0.6)", letterSpacing: "0.06em", marginLeft: 10 }}>40%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
```

### Step 5 : Karaoké A4

```tsx
{frame >= F.A4_START && frame < F.A5_START && <KaraokeSubtitles startS={44.72} endS={60.58} />}
```

### Step 6 : Render test A4

```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/a4_v1.mp4 --start 1300 --end 1816
```

---

## Task 3 — A5 Géopolitique (f1817→f2976) — getCam() Méditerranée + overlays

**Acte:** "Pour le Maroc... OCP fabrique désormais les composants... Pour l'Europe, réduire la dépendance Chine... Volkswagen investit... 2h de bateau... Le Maroc ne choisit pas... l'endroit où les deux fabriquent ensemble. Ce n'est pas de la diplomatie. C'est de la géographie industrielle."

**Visuel :** MAPBOX. Vue Méditerranée. Arc bleu Europe↔Maroc. FlagFill Maroc gold. Marker "2H DE BATEAU". Fade out final.

**Files:**
- Modify: `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx`

### Step 1 : getCam() A5

```ts
if (frame < F.A6_START) {
  const lf = frame - F.A5_START;
  const dur = F.A6_START - F.A5_START; // ~1159f ~38.6s

  // Phase 1 (lf 0→299) : Vue large Méditerranée — Maroc+Europe dans le cadre
  if (lf < 300) {
    const t = clamp01(lf / 300);
    const e = easeInOut(t);
    return {
      lon: interpolate(e, [0, 1], [-5.5, -4.0]),
      lat: interpolate(e, [0, 1], [36.5, 37.5]),
      zoom: interpolate(e, [0, 1], [4.5, 4.8]),
      pitch: 0,
      bearing: interpolate(e, [0, 1], [0, -3]),
      blur: 0,
    };
  }
  // Phase 2 (lf 300→599) : Focus Maroc — zoom doux sur Maroc
  if (lf < 600) {
    const t = clamp01((lf - 300) / 300);
    const e = easeOut(t);
    return {
      lon: interpolate(e, [0, 1], [-4.0, -5.5]),
      lat: interpolate(e, [0, 1], [37.5, 34.0]),
      zoom: interpolate(e, [0, 1], [4.8, 5.5]),
      pitch: 0,
      bearing: interpolate(e, [0, 1], [-3, -2]),
      blur: 0,
    };
  }
  // Phase 3 (lf 600→859) : Pull Back vers vue géopolitique large (Maroc+Europe+Méditerranée)
  if (lf < 860) {
    const t = clamp01((lf - 600) / 260);
    const e = easeInOut(t);
    return {
      lon: interpolate(e, [0, 1], [-5.5, [-3.0][0]]),
      lat: interpolate(e, [0, 1], [34.0, 39.0]),
      zoom: interpolate(e, [0, 1], [5.5, 4.2]),
      pitch: 0,
      bearing: interpolate(e, [0, 1], [-2, 0]),
      blur: 0,
    };
  }
  // Phase 4 (lf 860→fin) : Drift final — vue géopolitique large
  const t4 = clamp01((lf - 860) / (dur - 860));
  const e4 = easeInOut(t4);
  return {
    lon: interpolate(e4, [0, 1], [-3.0, -1.5]),
    lat: interpolate(e4, [0, 1], [39.0, 38.5]),
    zoom: interpolate(e4, [0, 1], [4.2, 4.0]),
    pitch: 0,
    bearing: interpolate(e4, [0, 1], [0, 4]),
    blur: 0,
  };
}
```

### Step 2 : Setup layers A5 dans setupRef

```ts
// ── A5 — Arc bleu Europe↔Maroc (dépendance → coopération) ──
if (!map.getSource("eu-mar-arc")) {
  map.addSource("eu-mar-arc", { type: "geojson", data: {
    type: "Feature", geometry: { type: "LineString",
      coordinates: [LOC.kenitra, [-3.5, 43.0], [-3.5, 40.5], LOC.algeciras] }, properties: {} } });
  map.addLayer({ id: "eu-mar-line", type: "line", source: "eu-mar-arc",
    paint: { "line-color": "#4a8fe8", "line-width": 2.5, "line-dasharray": [4, 5], "line-opacity": 0 } });
}
// ── A5 — Highlight Maroc gold (fill-color, pas pattern) ──
// Layer "maroc-highlight" déjà créé en A2 — réutiliser
// ── A5 — Frontières admin fines — réutiliser "admin-fines" ──
```

### Step 3 : Engine A5 dans useEffect principal

```ts
const inA5 = frame >= F.A5_START && frame < F.A6_START;
const lf5 = frame - F.A5_START;

// Highlight Maroc gold — progressif
if (map.getLayer("maroc-highlight")) {
  const hlOp = inA5
    ? interpolate(lf5, [60, 120, F.A6_START - F.A5_START - 40, F.A6_START - F.A5_START - 10],
        [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  if (inA5) try { map.setPaintProperty("maroc-highlight", "fill-opacity", hlOp); } catch {}
}

// Frontières admin fines — habillage
if (map.getLayer("admin-fines")) {
  const adminOp = inA5
    ? interpolate(lf5, [0, 60, F.A6_START - F.A5_START - 30, F.A6_START - F.A5_START - 5],
        [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  if (inA5) try { map.setPaintProperty("admin-fines", "line-opacity", adminOp); } catch {}
}

// Arc bleu EU↔MAR — apparaît à lf300 (quand "Pour l'Europe" ~f2277)
if (map.getLayer("eu-mar-line")) {
  const arcOp = inA5
    ? interpolate(lf5, [300, 370, F.A6_START - F.A5_START - 30, F.A6_START - F.A5_START - 5],
        [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  try {
    map.setPaintProperty("eu-mar-line", "line-opacity", arcOp);
    if (inA5 && lf5 > 300) {
      const offset = (lf5 * 0.3) % 9;
      map.setPaintProperty("eu-mar-line", "line-dasharray", [4 - offset * 0.15, 5 + offset * 0.15]);
    }
  } catch {}
}
```

### Step 4 : ShortOverlays A5

```tsx
if (frame < F.A6_START) {
  const lf = frame - F.A5_START;
  const dur = F.A6_START - F.A5_START;

  // Stat "SORTIR DU RÔLE DE FOURNISSEUR" — lf0 (f1817)
  const exitSp = spring({ frame: lf, fps, config: { damping: 18 }, durationInFrames: 30 });
  const exitOp = interpolate(lf, [0, 25, 290, 320], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Stat OCP — lf480 (~f2297, quand "L'OCP" est prononcé f1981+...)
  // Ajuster selon WORD_ANCHORS beat4_geographie "L'OCP" = 66.019s = f1981 → lf = f1981 - F.A5_START = 164
  const ocpSp = spring({ frame: Math.max(0, lf - 164), fps, config: { damping: 16 }, durationInFrames: 25 });
  const ocpOp = interpolate(lf, [164, 190, 440, 480], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "2H DE BATEAU" — lf683 (~f2500, quand "deux heures" f2500)
  const batSp = spring({ frame: Math.max(0, lf - 683), fps, config: { damping: 14 }, durationInFrames: 25 });
  const batOp = interpolate(lf, [683, 710, 840, 880], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "LES DEUX FABRIQUENT ENSEMBLE" — lf887 (~f2704)
  const togetherSp = spring({ frame: Math.max(0, lf - 887), fps, config: { damping: 18 }, durationInFrames: 30 });
  const togetherOp = interpolate(lf, [887, 912, dur - 30, dur - 5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {lf === 0 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} startFrom={0} volume={0.35} />}
      {lf === 164 && <Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} startFrom={0} volume={0.28} />}
      {lf === 683 && <Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} startFrom={0} volume={0.35} />}

      {/* "Sortir du rôle de fournisseur" */}
      {lf >= 0 && lf < 340 && (
        <div style={{
          position: "absolute", top: 240, left: 60, right: 60,
          opacity: exitOp, transform: `translateY(${(1 - exitSp) * 16}px)`,
          pointerEvents: "none",
        }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, color: C.ivory, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, opacity: 0.6 }}>POUR LE MAROC</p>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 64, lineHeight: 1.0, color: C.ivory, margin: "8px 0 0" }}>SORTIR DU RÔLE{"\n"}DE FOURNISSEUR</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", margin: "12px 0 0" }}>DE MATIÈRES PREMIÈRES</p>
        </div>
      )}

      {/* OCP stat */}
      {lf >= 155 && lf < 500 && (
        <div style={{
          position: "absolute", top: 240, left: 60,
          opacity: ocpOp, transform: `translateX(${(1 - ocpSp) * -16}px)`,
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "stretch", height: 60 }}>
            <div style={{ width: 5, background: C.gold, borderRadius: 3, flexShrink: 0 }} />
            <div style={{ background: "rgba(13,21,37,0.88)", padding: "0 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, color: C.gold, letterSpacing: "0.1em" }}>L'OCP</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: C.ivory, letterSpacing: "0.08em", opacity: 0.8 }}>FABRIQUE LES COMPOSANTS</span>
            </div>
          </div>
        </div>
      )}

      {/* "2H de bateau" */}
      {lf >= 675 && lf < 900 && (
        <div style={{
          position: "absolute", bottom: 320, left: 0, right: 0, textAlign: "center",
          opacity: batOp, transform: `scale(${0.88 + batSp * 0.12})`,
          pointerEvents: "none",
        }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 80, lineHeight: 0.9, margin: 0, color: C.gold, textShadow: `0 0 28px rgba(200,169,81,0.5), 0 4px 16px rgba(0,0,0,0.6)` }}>2H DE BATEAU</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, color: C.ivory, letterSpacing: "0.14em", textTransform: "uppercase", margin: "10px 0 0", opacity: 0.7 }}>DE L'ESPAGNE</p>
        </div>
      )}

      {/* "Les deux fabriquent ensemble" */}
      {lf >= 878 && (
        <div style={{
          position: "absolute", bottom: 240, left: 60, right: 60, textAlign: "center",
          opacity: togetherOp, transform: `translateY(${(1 - togetherSp) * 14}px)`,
          pointerEvents: "none",
        }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 56, lineHeight: 1.0, color: C.ivory, margin: 0 }}>L'ENDROIT OÙ</p>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 56, lineHeight: 1.0, color: C.gold, margin: "4px 0" }}>CHINE + EUROPE</p>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 56, lineHeight: 1.0, color: C.ivory, margin: 0 }}>FABRIQUENT ENSEMBLE</p>
        </div>
      )}
    </>
  );
}
```

### Step 5 : Karaoké A5

```tsx
{frame >= F.A5_START && frame < F.A6_START && <KaraokeSubtitles startS={60.64} endS={98.06} />}
```

### Step 6 : Render test A5

```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/a5_v1.mp4 --start 1817 --end 2976
```

---

## Task 4 — A6 Question finale (f2977→f3284) — Pull Back + question ivory

**Acte:** "Et ça pose une question que personne ne formule encore clairement. Si le Maroc contrôle le phosphate et l'assemblage, qui fixe le prix de la batterie dans dix ans ?"

**Visuel :** PUR REMOTION. Fond navy. Texte question ivory grand. Pas de carte active.

**Files:**
- Modify: `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx`

### Step 1 : getCam() A6

```ts
// A6 — Pull Back final (frame >= F.A6_START)
{
  const lf = frame - F.A6_START;
  const dur = F.END - F.A6_START; // ~307f ~10.2s
  const t = clamp01(lf / dur);
  const e = easeInOut(t);
  return {
    lon: interpolate(e, [0, 1], [-5.5, -4.0]),
    lat: interpolate(e, [0, 1], [34.0, 32.0]),
    zoom: interpolate(e, [0, 1], [4.5, 3.2]),
    pitch: 0,
    bearing: interpolate(e, [0, 1], [0, 6]),
    blur: 0,
  };
}
```

### Step 2 : ShortOverlays A6

```tsx
// frame >= F.A6_START (dernier cas dans ShortOverlays)
{
  const lf = frame - F.A6_START;
  const dur = F.END - F.A6_START;

  // Overlay navy semi-transparent — assombrit la carte pour la question finale
  const bgOp = interpolate(lf, [0, 30, dur - 20, dur], [0, 0.78, 0.78, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Question — apparaît mot par mot à f3101 → lf = f3101 - F.A6_START = 124
  const q1Sp = spring({ frame: Math.max(0, lf - 40), fps, config: { damping: 18 }, durationInFrames: 30 });
  const q1Op = interpolate(lf, [40, 65, dur - 20, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const q2Sp = spring({ frame: Math.max(0, lf - 100), fps, config: { damping: 18 }, durationInFrames: 30 });
  const q2Op = interpolate(lf, [100, 125, dur - 15, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Stamp "?" géant — lf246 (~f3223 "qui fixe le prix")
  const stampSp = spring({ frame: Math.max(0, lf - 246), fps, config: { damping: 8, stiffness: 220, mass: 0.7 }, durationInFrames: 18 });
  const stampOp = interpolate(lf, [246, 260, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {lf === 0 && <Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} startFrom={0} volume={0.40} />}
      {lf === 246 && <Audio src={staticFile("_shared/sfx/ui/stamp-dossier.mp3")} startFrom={0} volume={0.55} />}

      {/* Fond overlay */}
      <div style={{ position: "absolute", inset: 0, background: C.navy, opacity: bgOp, pointerEvents: "none" }} />

      {/* "SI LE MAROC CONTRÔLE LE PHOSPHATE ET L'ASSEMBLAGE" */}
      {lf >= 35 && (
        <div style={{
          position: "absolute", top: 280, left: 60, right: 60,
          opacity: q1Op, transform: `translateY(${(1 - q1Sp) * 18}px)`,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600,
            color: C.ivory, letterSpacing: "0.12em", textTransform: "uppercase",
            margin: 0, opacity: 0.65, textAlign: "center",
          }}>SI LE MAROC CONTRÔLE</p>
          <p style={{
            fontFamily: "'Anton', sans-serif", fontSize: 56, lineHeight: 1.0,
            color: C.gold, margin: "8px 0 0", textAlign: "center", letterSpacing: "0.02em",
          }}>LE PHOSPHATE{"\n"}ET L'ASSEMBLAGE</p>
        </div>
      )}

      {/* "QUI FIXE LE PRIX DE LA BATTERIE DANS 10 ANS ?" */}
      {lf >= 95 && (
        <div style={{
          position: "absolute", bottom: 300, left: 60, right: 60,
          opacity: q2Op, transform: `translateY(${(1 - q2Sp) * 16}px)`,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 600,
            color: C.ivory, letterSpacing: "0.1em", textTransform: "uppercase",
            margin: 0, opacity: 0.6, textAlign: "center",
          }}>QUI FIXE LE PRIX</p>
          <p style={{
            fontFamily: "'Anton', sans-serif", fontSize: 60, lineHeight: 1.0,
            color: C.ivory, margin: "6px 0 0", textAlign: "center",
          }}>DE LA BATTERIE</p>
          <p style={{
            fontFamily: "'Anton', sans-serif", fontSize: 72, lineHeight: 1.0,
            color: C.gold, margin: "4px 0 0", textAlign: "center",
            textShadow: `0 0 32px rgba(200,169,81,0.55)`,
          }}>DANS 10 ANS ?</p>
        </div>
      )}

      {/* Stamp "?" */}
      {lf >= 240 && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: `translate(-50%, -50%) scale(${stampSp * 1.05})`,
          opacity: stampOp, pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "'Anton', sans-serif", fontSize: 240, lineHeight: 1.0,
            color: C.gold, opacity: 0.08,
            textShadow: `0 0 60px rgba(200,169,81,0.3)`,
          }}>?</span>
        </div>
      )}
    </>
  );
}
```

### Step 3 : Karaoké A6

```tsx
{frame >= F.A6_START && <KaraokeSubtitles startS={99.22} endS={109.48} />}
```

### Step 4 : Render test A6

```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/a6_v1.mp4 --start 2977 --end 3284
```

---

## Task 5 — Intégration finale + render complet

### Step 1 : Vérifier TypeScript

```bash
cd /Users/clawdbot/Workspace/remotion && npx tsc --noEmit 2>&1 | head -30
```

Corriger toute erreur de type (notamment le type `Cam` si `blur` est ajouté).

### Step 2 : Render complet local (test rapide 0.35 scale)

```bash
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/maroc_full_v1.mp4
```

Alternativement, render via Vercel si > 30s :

```bash
python3 scripts/render-on-vercel.py MarocBatteries-Short out/episodes/maroc-batteries/wip/maroc_full_v1.mp4
```

### Step 3 : Review frames perso

```bash
# Extraire 6 frames représentatifs (un par acte)
ffmpeg -i out/episodes/maroc-batteries/wip/maroc_full_v1.mp4 -vf "select=eq(n\,15)+eq(n\,300)+eq(n\,960)+eq(n\,1350)+eq(n\,1850)+eq(n\,2990)" -vsync vfr /tmp/maroc-review-%d.png
```

Lire chaque frame (Read tool), vérifier :
- Lisibilité des overlays (contraste)
- Absence de carte nue (anti-gris)
- Timing SFX approximatif
- Pas de texte coupé (safe zones 1080×1920)

### Step 4 : Upload + notif

```bash
# Upload catbox
curl -F "reqtype=fileupload" -F "fileToUpload=@out/episodes/maroc-batteries/wip/maroc_full_v1.mp4" https://catbox.moe/user/api.php
# Notif ntfy si configuré
```

### Step 5 : Commit

```bash
git add src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx
git commit -m "feat(maroc): compléter actes A3→A6 MarocBatteriesShort"
```

---

## Notes d'implémentation

1. **Ne pas réécrire A1/A2** — uniquement ajouter les nouveaux blocs dans getCam() et ShortOverlays
2. **Type Cam** — si `blur` est ajouté, mettre à jour TOUS les `return` de getCam() avec `blur: 0`
3. **whipBlur** — vérifier si la fonction existe déjà dans le fichier avant de l'ajouter
4. **Cleanup useEffect** — ajouter `markerWolfsburgRef.current?.remove()` dans le return du useEffect init
5. **Ordre layers** — les layers A4/A5 doivent être dans le bloc `setupRef.current = false` existant, AVANT `setupRef.current = true`
6. **Karaoké** — vérifier que `MAROC_WORDS` dans `maroc-words.ts` couvre bien les segments A3→A6 (le fichier utilise `MAROC_WORDS` comme source, pas `WORD_ANCHORS` de timing.ts)

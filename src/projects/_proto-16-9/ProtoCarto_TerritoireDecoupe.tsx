/**
 * PROTO CARTO — LE TERRITOIRE SE DECOUPE EN DONNEE (registre parchemin quadrille, vraie geo d3-geo)
 *
 * GESTE PROTOTYPE : "CARTE -> DONNEE (sans la quitter)".
 *   Le contour du Senegal reste a l'ecran, mais son INTERIEUR se transforme progressivement
 *   en graphique, SANS jamais cut ni faire disparaitre la carte. On enchaine les DEUX sous-gestes :
 *     (a) le territoire se FRAGMENTE en parcelles = les blocs/concessions d'exploration. Chaque
 *         parcelle s'allume avec son attributaire (cartouche relie en marge droite).
 *     (b) des BARRES poussent DEPUIS le sol du pays (l'interieur du contour devient un mini bar-chart
 *         ancre dans la geographie) = la part de production par bloc. La geo devient le conteneur.
 *   Intention (1 verbe) : MESURER. Faire comprendre que "ce territoire EST decoupe / exploite / mesure".
 *
 * GEO : countries-50m TopoJSON (objects.countries), feature properties.name === "Senegal",
 *   reprojete via geoMercator().fitExtent ANCRE A GAUCHE (marge droite = colonne de cartouches).
 *   Les blocs/concessions sont des polygones d3 dans les bounds REELS du Senegal (offshore a l'ouest
 *   de Dakar : lon -17.8..-16.8, lat 13.7..16.3 ; blocs reels : Saint-Louis, Cayar, Sangomar, Rufisque).
 *   APPROXIMATION ASSUMEE : positions generales reelles, contours stylises (grille de parcelles) — OK
 *   pour ce geste, la vraie geometrie precise n'est pas le sujet, la DECOUPE l'est.
 *
 * Charte Souverain parchemin (couleurs EXACTES du hook Senegal). Mix de couleurs : helper mix() repris.
 *
 * 6 PRINCIPES : 1.dessin lent (spring/interpolate ~1s, contour strokeDashoffset)  2.couches qui
 *   s'ajoutent jamais de cut (contour -> fill -> parcelles -> barres -> labels, un seul monde)
 *   3.donnee ancree (chaque valeur a un lieu)  4.anti-statique permanent (breath sin, light sweep,
 *   pulses)  5.epure (peu de labels ancres)  6.marges = colonne editoriale (cartouches relies).
 *
 * Sequence (~11s @30fps, 330f) :
 *   0-60    : le contour du Senegal se trace lentement (navy, strokeDashoffset) + grille parchemin
 *   55-110  : le fill ocre monte dans le contour (wipe bas->haut)
 *   100-185 : le territoire se FRAGMENTE en parcelles (lignes de decoupe se tracent), chaque bloc
 *             s'allume un par un en ocre chaud avec son attributaire (cartouche en marge se remplit)
 *   175-265 : des BARRES poussent DEPUIS le sol de chaque bloc (mini bar-chart ancre, clip dans le pays)
 *   255-330 : etat stable premium + respiration ; cartouche-total se pose en marge
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useTopology } from "../_shared/components/inserts/useTopology";

const W = 1920;
const H = 1080;

// Charte Souverain parchemin (couleurs EXACTES du hook Senegal)
const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const OCRE = "#e7bd78";
const OCRE_MID = "#d2ad66";
const OCRE_DARK = "#bf9442";
const OCRE_HOT = "#e09a3c"; // bloc allume (ocre intense/chaud)
const NAVY = "#16213a";
const GOLD = "#d8b25a";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;
const GRID_OFFSET_X = 40;
const GRID_OFFSET_Y = 28;

// --- BLOCS / CONCESSIONS (positions generales REELLES, lon/lat) ---
// Le Senegal offshore : Saint-Louis (nord), Cayar (centre-nord), Rufisque (Dakar), Sangomar (sud,
// en production). On ancre chaque bloc a une coord reelle (pin sur la cote ouest), on en deduit le
// rang d'allumage (nord->sud) et la valeur (part de production, illustrative et plausible).
type Bloc = {
  id: string;
  name: string;
  attrib: string; // attributaire / operateur
  coord: [number, number]; // vraie coord (lon, lat) pour ancrer le pin offshore
  value: number; // kbep/j (illustratif, plausible)
  order: number; // ordre d'allumage (nord -> sud)
};
const BLOCS: Bloc[] = [
  { id: "STL", name: "SAINT-LOUIS", attrib: "GTA · BP / Kosmos", coord: [-17.0, 16.15], value: 60, order: 0 },
  { id: "CAY", name: "CAYAR OFFSHORE", attrib: "Yakaar · BP / Kosmos", coord: [-17.25, 15.05], value: 95, order: 1 },
  { id: "RUF", name: "RUFISQUE", attrib: "Total Energies", coord: [-17.35, 14.45], value: 35, order: 2 },
  { id: "SAN", name: "SANGOMAR", attrib: "Woodside · en production", coord: [-17.0, 13.85], value: 100, order: 3 },
];

export const ProtoCarto_TerritoireDecoupe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const data = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const sn = (fc.features as any[]).find((f) => f.properties?.name === "Senegal");
    if (!sn) return null;

    // ANCRAGE A GAUCHE : marge DROITE = colonne de cartouches (anti-vide symetrique).
    const projection = geoMercator().fitExtent(
      [
        [W * 0.06, H * 0.12],
        [W * 0.6, H * 0.9],
      ],
      sn
    );
    const path = geoPath(projection);
    const snD = path(sn) || "";

    // bbox px du pays (pour cadrer la grille de parcelles a l'interieur)
    const [[bx0, by0], [bx1, by1]] = path.bounds(sn);

    // GRILLE DE PARCELLES : on quadrille la bbox en cellules ; chaque cellule = une parcelle.
    // Le clip sur le contour fait que seules les parcelles DANS le pays apparaissent.
    const COLS = 7;
    const ROWS = 9;
    const cellW = (bx1 - bx0) / COLS;
    const cellH = (by1 - by0) / ROWS;
    const parcels: { x: number; y: number; w: number; h: number; cx: number; cy: number; rnd: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = bx0 + c * cellW;
        const y = by0 + r * cellH;
        // pseudo-random deterministe par cellule (decale l'allumage des parcelles)
        const rnd = Math.sin((r * 13.13 + c * 7.77) * 1.7) * 0.5 + 0.5;
        parcels.push({ x, y, w: cellW, h: cellH, cx: x + cellW / 2, cy: y + cellH / 2, rnd });
      }
    }

    // pins offshore (vraies coords projetees)
    const blocPx = BLOCS.map((b) => {
      const p = projection(b.coord) as [number, number];
      return { ...b, px: p[0], py: p[1] };
    });

    return { snD, projection, parcels, blocPx, bbox: { bx0, by0, bx1, by1, cellW, cellH } };
  }, [topo]);

  if (!topo || !data) return <AbsoluteFill style={{ background: PARCH }} />;
  const { snD, parcels, blocPx, bbox } = data;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  // ── ANTI-STATIQUE GLOBAL (principe 4) ──
  const breath = 1 + 0.005 * Math.sin(frame * 0.07);
  const lightSweep = interpolate((frame % 280) / 280, [0, 1], [-30, 130]);
  const introFade = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── COUCHE 1 : contour qui se trace (0-60) ──
  const SN_LEN = 4200;
  const drawProg = interpolate(frame, [6, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── COUCHE 2 : fill ocre qui monte (wipe bas->haut) (55-110) ──
  const fillProg = interpolate(frame, [55, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fillWipeY = bbox.by1 - (bbox.by1 - bbox.by0) * fillProg; // y du haut du rect-wipe

  // ── COUCHE 3 : FRAGMENTATION (100-185) ──
  const cutProg = interpolate(frame, [100, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blocGlow = (order: number) => {
    const start = 132 + order * 16;
    return interpolate(frame, [start, start + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // ── COUCHE 4 : BARRES qui poussent depuis le sol des blocs (175-265) ──
  const barGrow = (order: number) => {
    const start = 180 + order * 14;
    return spring({ fps, frame: Math.max(0, frame - start), config: { damping: 13, stiffness: 90 } });
  };

  // total qui se pose (cartouche marge)
  const totalT = interpolate(frame, [248, 286], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const totalEased = 1 - Math.pow(1 - totalT, 3);
  const totalVal = BLOCS.reduce((s, b) => s + b.value, 0);
  const totalStr = Math.round(totalEased * totalVal).toLocaleString("fr-FR");
  const totalOp = interpolate(frame, [248, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // echelle barre : la plus grande valeur -> ~150px de haut
  const maxVal = Math.max(...BLOCS.map((b) => b.value));
  const BAR_MAX_H = 155;
  const BAR_W = 30;

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: introFade }}>
        <defs>
          <linearGradient id="ocreFillTD" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="55%" stopColor={OCRE_MID} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="ocreHotTD" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE_HOT} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="barTD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NAVY} />
            <stop offset="100%" stopColor="#2c4068" />
          </linearGradient>
          <filter id="paperTexTD">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <filter id="snHaloTD"><feGaussianBlur stdDeviation="12" /></filter>
          <filter id="grainTD">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
          </filter>
          {/* clip = interieur du pays : tout ce qui est "donnee" reste DANS le contour (la geo = conteneur) */}
          <clipPath id="snClipTD"><path d={snD} /></clipPath>
          {/* clip wipe du fill (bas->haut) */}
          <clipPath id="fillWipeTD"><rect x={0} y={fillWipeY} width={W} height={H} /></clipPath>
        </defs>

        {/* fond papier texture */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexTD)" opacity={0.5} />

        {/* GRILLE fine or-sable */}
        <g stroke={GRID} strokeWidth={1.6} opacity={0.55}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* MONDE : respiration globale (principe 4) */}
        <g transform={`scale(${breath})`} style={{ transformOrigin: "640px 540px" }}>
          {/* halo or sous le pays (subtil, anti-plat) */}
          {fillProg > 0.01 && <path d={snD} fill={GOLD} opacity={0.18 * fillProg} filter="url(#snHaloTD)" />}

          {/* COUCHE 2 : FILL ocre qui monte (wipe bas->haut), clip au contour */}
          {fillProg > 0.01 && (
            <g clipPath="url(#fillWipeTD)">
              <path d={snD} fill="url(#ocreFillTD)" opacity={0.92} />
            </g>
          )}

          {/* COUCHE 3 + 4 : tout ce qui est DONNEE est clippe a l'interieur du pays */}
          <g clipPath="url(#snClipTD)">
            {/* PARCELLES : chaque cellule de la grille interne. Le fond de la parcelle vire "hot"
                quand le bloc auquel elle appartient s'allume. On rattache chaque parcelle a un bloc
                selon sa bande verticale (nord=haut -> sud=bas). */}
            {parcels.map((p, i) => {
              const appear = interpolate(frame, [100 + p.rnd * 24, 124 + p.rnd * 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (appear <= 0.01) return null;
              const band = Math.min(BLOCS.length - 1, Math.floor(((p.cy - bbox.by0) / (bbox.by1 - bbox.by0)) * BLOCS.length));
              const g = blocGlow(band);
              // parcelle "concedee" (allumee, hot) vs parcelle simple (creuse legerement le fill).
              // seuil par parcelle -> certaines s'allument fort, d'autres restent en retrait = vrai cadastre.
              const lit = p.rnd > 0.45;
              const hotOp = lit ? appear * g * 0.78 : appear * g * 0.16;
              return (
                <rect
                  key={i}
                  x={p.x + 1.5}
                  y={p.y + 1.5}
                  width={Math.max(0, p.w - 3)}
                  height={Math.max(0, p.h - 3)}
                  fill="url(#ocreHotTD)"
                  stroke={lit ? OCRE_DARK : "none"}
                  strokeWidth={lit ? 1.4 : 0}
                  opacity={hotOp}
                />
              );
            })}

            {/* LIGNES DE DECOUPE (la grille des parcelles se trace) — la geo se "cadastre".
                Navy net, suffisamment lisible pour que la DECOUPE soit le sujet. */}
            <g stroke={NAVY} strokeWidth={1.6} opacity={0.55 * cutProg} strokeLinecap="round">
              {Array.from({ length: 6 }, (_, c) => {
                const x = bbox.bx0 + (c + 1) * bbox.cellW;
                const len = bbox.by1 - bbox.by0;
                return <line key={`cv${c}`} x1={x} y1={bbox.by0} x2={x} y2={bbox.by0 + len * cutProg} />;
              })}
              {Array.from({ length: 8 }, (_, r) => {
                const y = bbox.by0 + (r + 1) * bbox.cellH;
                const len = bbox.bx1 - bbox.bx0;
                return <line key={`ch${r}`} x1={bbox.bx0} y1={y} x2={bbox.bx0 + len * cutProg} y2={y} />;
              })}
            </g>

            {/* COUCHE 4 : BARRES qui poussent DEPUIS LE SOL du pays (l'interieur devient un bar-chart
                ancre dans la geo). On les ETALE sur la largeur du territoire (vraie lecture de chart)
                avec une LIGNE DE SOL commune dans la moitie basse du pays. Chaque barre reste rattachee
                a son bloc (meme couleur d'allumage, meme rang). */}
            {(() => {
              // ligne de sol = ~72% de la hauteur du pays (dans la plaine sud, large)
              const groundY = bbox.by0 + (bbox.by1 - bbox.by0) * 0.74;
              // etalement horizontal sur la bande centrale du territoire
              const spreadX0 = bbox.bx0 + (bbox.bx1 - bbox.bx0) * 0.30;
              const spreadX1 = bbox.bx0 + (bbox.bx1 - bbox.bx0) * 0.86;
              const n = blocPx.length;
              return (
                <>
                  {/* socle commun (ligne de terre) qui se trace avec la 1re barre */}
                  <line
                    x1={spreadX0 - 30}
                    y1={groundY}
                    x2={spreadX1 + 30}
                    y2={groundY}
                    stroke={NAVY}
                    strokeWidth={2}
                    opacity={0.4 * barGrow(0)}
                  />
                  {blocPx.map((b, i) => {
                    const g = barGrow(b.order);
                    if (g <= 0.01) return null;
                    const h = (b.value / maxVal) * BAR_MAX_H * g;
                    const baseX = spreadX0 + (spreadX1 - spreadX0) * (n === 1 ? 0.5 : i / (n - 1));
                    const pulse = 1 + 0.03 * Math.sin(frame * 0.14 + b.order);
                    const bh = h * pulse;
                    return (
                      <g key={`bar${b.id}`}>
                        <ellipse cx={baseX} cy={groundY + 3} rx={BAR_W / 2 + 5} ry={5} fill={NAVY} opacity={0.2 * g} />
                        <rect x={baseX - BAR_W / 2} y={groundY - bh} width={BAR_W} height={bh} rx={3} fill="url(#barTD)" />
                        <rect x={baseX - BAR_W / 2} y={groundY - bh} width={BAR_W} height={4} fill={GOLD} opacity={g} />
                        {/* valeur en tete (Bebas), ancree a la barre */}
                        <text
                          x={baseX}
                          y={groundY - bh - 10}
                          textAnchor="middle"
                          fontFamily={NUM}
                          fontSize={26}
                          fill={NAVY}
                          opacity={g}
                        >
                          {b.value}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </g>

          {/* CONTOUR navy qui se trace (par-dessus tout, le monde reste lisible) */}
          <path
            d={snD}
            fill="none"
            stroke={NAVY}
            strokeWidth={3.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={SN_LEN}
            strokeDashoffset={SN_LEN * (1 - drawProg)}
          />

          {/* PINS des blocs offshore (vraies coords) : pulsent quand le bloc s'allume */}
          {blocPx.map((b) => {
            const glow = blocGlow(b.order);
            if (glow <= 0.01) return null;
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16 + b.order);
            return (
              <g key={`pin${b.id}`} opacity={glow}>
                <circle cx={b.px} cy={b.py} r={5 + 12 * pulse} fill="none" stroke={NAVY} strokeWidth={1.4} opacity={0.4 * (1 - pulse)} />
                <circle cx={b.px} cy={b.py} r={5} fill={NAVY} />
                <circle cx={b.px} cy={b.py} r={2} fill={OCRE_HOT} />
              </g>
            );
          })}
        </g>

        {/* balayage de lumiere (anti-statique) */}
        <defs>
          <linearGradient id="sweepTD" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={`${lightSweep - 40}%`} y="0" width="40%" height="100%" fill="url(#sweepTD)" />

        {/* grain papier global */}
        <rect width={W} height={H} filter="url(#grainTD)" opacity={0.8} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* TITRE = CARTOUCHE PARCHEMIN ancre en haut-droite dans la marge (principe 6) */}
      {(() => {
        const op = interpolate(frame, [16, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        const slide = interpolate(frame, [16, 44], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", top: 90, right: 90, opacity: op, transform: `translateX(${slide}px)`, textAlign: "right" }}>
            <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 5, color: OCRE_DARK, textTransform: "uppercase", marginBottom: 6 }}>Dossier offshore</div>
            <div style={{ fontFamily: NUM, fontSize: 54, letterSpacing: 1, color: NAVY, lineHeight: 1 }}>UN TERRITOIRE</div>
            <div style={{ fontFamily: NUM, fontSize: 54, letterSpacing: 1, color: OCRE_DARK, lineHeight: 1 }}>DÉJÀ DÉCOUPÉ</div>
            <div style={{ width: 200, height: 2, background: NAVY, marginLeft: "auto", marginTop: 12, opacity: 0.5 }} />
          </div>
        );
      })()}

      {/* COLONNE de CARTOUCHES BLOCS (marge droite) : chaque bloc ecrit sa ligne quand il s'allume
          sur la carte = lien marge <-> carte. Trait pointille reliant le pin au cartouche. */}
      {(() => {
        const colTop = 290;
        const rowH = 96;
        return (
          <>
            {/* traits de liaison pin -> cartouche (svg overlay) ; on applique la meme respiration que
                la carte aux coords du pin pour que le trait reste accroche au point. */}
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {blocPx.map((b, i) => {
                const op = interpolate(frame, [134 + b.order * 16, 154 + b.order * 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (op <= 0.01) return null;
                const cardY = colTop + i * rowH + 26;
                const cardX = 1300;
                const pinX = b.px * breath + (1 - breath) * 640;
                const pinY = b.py * breath + (1 - breath) * 540;
                return (
                  <g key={`lnk${b.id}`} opacity={op * 0.55}>
                    <line x1={pinX} y1={pinY} x2={cardX} y2={cardY} stroke={NAVY} strokeWidth={1.3} strokeDasharray="6 5" />
                    <circle cx={cardX} cy={cardY} r={3.5} fill={NAVY} />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", top: colTop, right: 90, width: 430 }}>
              {blocPx.map((b) => {
                const start = 136 + b.order * 16;
                const op = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const slide = interpolate(frame, [start, start + 18], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (op <= 0) return <div key={b.id} style={{ height: rowH }} />;
                return (
                  <div key={b.id} style={{ height: rowH, opacity: op, transform: `translateX(${slide}px)`, paddingLeft: 16, borderLeft: `3px solid ${OCRE_DARK}`, textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontFamily: NUM, fontSize: 30, letterSpacing: 1, color: NAVY, lineHeight: 1 }}>{b.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 16, color: OCRE_DARK, marginTop: 4 }}>{b.attrib}</div>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: NAVY, opacity: 0.6, marginTop: 2 }}>~{b.value} kbep/jour</div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* CARTOUCHE TOTAL : se pose en bas de la marge quand les barres sont montees (principe 3+6) */}
      {totalOp > 0 && (
        <div style={{ position: "absolute", bottom: 90, right: 90, opacity: totalOp, textAlign: "right", width: 430 }}>
          <div style={{ display: "inline-block", background: "rgba(20,33,58,0.06)", border: `2px solid ${NAVY}`, borderRadius: 10, padding: "14px 26px" }}>
            <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: 4, color: OCRE_DARK, textTransform: "uppercase" }}>Capacité totale visée</div>
            <div style={{ fontFamily: NUM, fontSize: 64, color: NAVY, lineHeight: 1, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
              {totalStr} <span style={{ fontSize: 30, color: OCRE_DARK }}>kbep/j</span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default ProtoCarto_TerritoireDecoupe;

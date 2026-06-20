/**
 * PROTO CARTO — COUCHE TEMPS sur la meme geo (registre parchemin quadrille, vraie geo d3-geo)
 *
 * GESTE : sur la MEME carte, on traverse le TEMPS sans cut. Un compteur d'ANNEE geant
 *   (millesime serif) defile 2014 -> 2024 ; a chaque jalon la carte s'enrichit d'une
 *   decouverte petroliere/gaziere sur ses VRAIES coords, et la TIMELINE editoriale de la
 *   marge droite s'ecrit. Une courbe de production monte au fil des annees.
 *   INTENTION : faire RESSENTIR une acceleration historique ("en 10 ans, un pays devient producteur").
 *
 * PRINCIPES (repris du hook Senegal valide) :
 *   1. DESSIN LENT  : la carte se trace (contour navy, strokeDashoffset) puis le fill ocre monte.
 *   2. COUCHES QUI S'AJOUTENT (jamais de cut) : carte -> annee qui defile -> jalons qui s'allument
 *      un par un au fil du temps -> courbe qui monte -> premier baril. UN SEUL MONDE, le temps avance.
 *   3. DONNEE ANCREE : chaque gisement sur sa VRAIE coord ; le compteur d'annee est l'ancre temporelle.
 *   4. ANTI-STATIQUE : respiration continue, balayage de lumiere, pulse des points actifs.
 *   5. EPURE : zero texte qui paraphrase. L'annee + les jalons parlent.
 *   6. MARGES = COLONNE EDITORIALE : carte ancree a gauche (fitExtent ~0.07->0.6), marge DROITE =
 *      timeline verticale des jalons (relies au point par un trait) + courbe de production.
 *
 * VRAIE GEO : countries-50m TopoJSON, geoMercator().fitExtent sur une bbox Senegal + offshore
 *   (les champs sont OFFSHORE, donc on cadre sur une FeatureCollection [pays + points] pour les inclure).
 *
 * COORDS (lon,lat) — positions generales reelles des champs (approximation documentee) :
 *   Dakar           [-17.45, 14.69]  (ville repere)
 *   Sangomar / SNE  [-16.95, 13.95]  (offshore ~100km sud de Dakar — decouverte 2014)
 *   GTA / Tortue    [-17.05, 15.90]  (offshore frontiere SN/MR — decouverte gaz 2015)
 *   Yakaar          [-17.55, 14.95]  (offshore nord Dakar — decouverte gaz 2016)
 *   (Le "premier baril" 2024 = Sangomar entre en production, on rallume ce point en or chaud.)
 *
 * Charte Souverain parchemin (couleurs EXACTES du hook).
 *
 * Sequence (~12s @30fps, 360f) :
 *   0-58    : la carte du Senegal se trace (contour) + fill ocre monte ; Dakar apparait
 *   42-322  : le compteur d'ANNEE defile 2014 -> 2024 (entiers), la courbe de prod monte avec
 *   ~70     : 2014 -> Sangomar s'allume (point + ligne timeline droite)
 *   ~140    : 2015 -> GTA s'allume
 *   ~200    : 2016 -> Yakaar s'allume
 *   ~322    : 2024 -> "premier baril" : Sangomar vire en OR chaud + pulse fort, courbe pique
 *   330-360 : etat stable premium, respiration
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
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
const OCRE_HOT = "#e09a3c";
const NAVY = "#16213a";
const GOLD = "#d8b25a";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;
const GRID_OFFSET_X = 40;
const GRID_OFFSET_Y = 28;

const DAKAR: [number, number] = [-17.45, 14.69];

// Jalons chronologiques : annee de declenchement, coord du champ, libelle court.
type Milestone = {
  year: number;
  coord: [number, number];
  name: string;
  desc: string;
  isFirstOil?: boolean;
};
const MILESTONES: Milestone[] = [
  { year: 2014, coord: [-16.95, 13.95], name: "SANGOMAR", desc: "Decouverte de petrole" },
  { year: 2015, coord: [-17.05, 15.9], name: "GTA", desc: "Decouverte de gaz" },
  { year: 2016, coord: [-17.55, 14.95], name: "YAKAAR", desc: "Decouverte de gaz" },
  { year: 2024, coord: [-16.95, 13.95], name: "SANGOMAR", desc: "Premier baril produit", isFirstOil: true },
];

const YEAR_START = 2014;
const YEAR_END = 2024;

const COUNT_FROM = 42;
const COUNT_TO = 322;

const yearToFrame = (year: number) =>
  interpolate(year, [YEAR_START, YEAR_END], [COUNT_FROM, COUNT_TO], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Courbe de production (cumul stylise) : valeur 0..1 par annee. Plate puis pique a 2024.
const PROD_BY_YEAR: { year: number; v: number }[] = [
  { year: 2014, v: 0.0 },
  { year: 2015, v: 0.04 },
  { year: 2016, v: 0.08 },
  { year: 2018, v: 0.12 },
  { year: 2020, v: 0.18 },
  { year: 2022, v: 0.26 },
  { year: 2023, v: 0.4 },
  { year: 2024, v: 1.0 },
];
const prodAt = (year: number) => {
  for (let i = 1; i < PROD_BY_YEAR.length; i++) {
    if (year <= PROD_BY_YEAR[i].year) {
      const a = PROD_BY_YEAR[i - 1];
      const b = PROD_BY_YEAR[i];
      const t = (year - a.year) / (b.year - a.year);
      return a.v + (b.v - a.v) * t;
    }
  }
  return PROD_BY_YEAR[PROD_BY_YEAR.length - 1].v;
};

export const ProtoCarto_CoucheTemps: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const data = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const sn = (fc.features as any[]).find((f) => f.properties?.name === "Senegal");
    if (!sn) return null;

    // ANCRAGE A GAUCHE : carte cadree dans ~0.07->0.6 de largeur, marge droite = colonne editoriale.
    // Champs OFFSHORE (a l'ouest/large), donc fitExtent sur une FeatureCollection [pays + points].
    const pointFeatures = MILESTONES.map((m) => ({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: m.coord },
    }));
    const fitTarget = {
      type: "FeatureCollection",
      features: [
        sn,
        { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: DAKAR } },
        ...pointFeatures,
      ],
    } as any;

    const projection = geoMercator();
    projection.fitExtent(
      [
        [W * 0.07, H * 0.16],
        [W * 0.6, H * 0.9],
      ],
      fitTarget
    );
    const path = geoPath(projection);
    const snD = path(sn) || "";
    const snLen = (snD.match(/[ML]/g)?.length ?? 200) * 14;

    return { projection, path, snD, snLen };
  }, [topo]);

  if (!topo || !data) return <AbsoluteFill style={{ background: PARCH }} />;
  const { projection, snD, snLen } = data;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  // ── ANTI-STATIQUE global ──
  const breath = 1 + 0.005 * Math.sin(frame * 0.07);
  const lightSweep = interpolate((frame % 280) / 280, [0, 1], [-30, 130]);
  const introFade = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── COUCHE 1 : la carte se dessine ──
  const drawProg = interpolate(frame, [8, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fillProg = interpolate(frame, [24, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dakarPx = projection(DAKAR);
  const dakarAppear = interpolate(frame, [50, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── COUCHE 2 : compteur d'ANNEE (entiers, jamais de decimale affichee) ──
  const yearT = interpolate(frame, [COUNT_FROM, COUNT_TO], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearFloat = YEAR_START + yearT * (YEAR_END - YEAR_START);
  const yearDisplay = Math.round(yearFloat); // ENTIER (2014..2024)
  const yearOp = interpolate(frame, [COUNT_FROM - 6, COUNT_FROM + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // micro "tick" d'echelle juste apres chaque changement d'annee entiere (sensation de cliquet)
  const yearFrac = yearFloat - Math.floor(yearFloat);
  const tick = 1 + 0.06 * Math.exp(-yearFrac * 9);

  // ── COURBE DE PRODUCTION : geometrie ──
  const CURVE_X0 = 1230;
  const CURVE_X1 = 1820;
  const CURVE_Y0 = 1000;
  const CURVE_H = 210;
  const curveOp = interpolate(frame, [COUNT_FROM + 6, COUNT_FROM + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearToCurveX = (year: number) => interpolate(year, [YEAR_START, YEAR_END], [CURVE_X0, CURVE_X1]);
  const buildCurve = () => {
    const pts: [number, number][] = [];
    const steps = 48;
    for (let s = 0; s <= steps; s++) {
      const y = YEAR_START + (yearFloat - YEAR_START) * (s / steps);
      const x = yearToCurveX(y);
      const py = CURVE_Y0 - prodAt(y) * CURVE_H;
      pts.push([x, py]);
    }
    if (pts.length < 2) return { line: "", area: "", last: undefined as [number, number] | undefined };
    let line = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) line += ` L ${pts[i][0]} ${pts[i][1]}`;
    const last = pts[pts.length - 1];
    const area = line + ` L ${last[0]} ${CURVE_Y0} L ${pts[0][0]} ${CURVE_Y0} Z`;
    return { line, area, last };
  };
  const curve = buildCurve();

  // ── helper : intensite d'allumage d'un jalon (0..1) selon le temps ──
  const milestoneGlow = (i: number) => {
    const start = yearToFrame(MILESTONES[i].year);
    return interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // ── TIMELINE editoriale (marge droite) : geometrie ──
  const TL_X = 1230;
  const TL_TOP = 232;
  const TL_GAP = 120;

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: introFade }}>
        <defs>
          <linearGradient id="ocreFillCT" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="55%" stopColor={OCRE_MID} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="curveAreaCT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={OCRE_HOT} stopOpacity="0.55" />
            <stop offset="100%" stopColor={OCRE_DARK} stopOpacity="0.05" />
          </linearGradient>
          <filter id="paperTexCT">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <filter id="snHaloCT"><feGaussianBlur stdDeviation="12" /></filter>
          <filter id="grainCT">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
          </filter>
        </defs>

        {/* fond papier texture */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexCT)" opacity={0.5} />

        {/* GRILLE fine or-sable */}
        <g stroke={GRID} strokeWidth={1.6} opacity={0.6}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* ── CARTE SENEGAL : respiration globale + dessin lent ── */}
        <g transform={`scale(${breath})`} style={{ transformOrigin: "640px 540px" }}>
          {fillProg > 0 && <path d={snD} fill="url(#ocreFillCT)" opacity={fillProg * 0.94} />}
          <path
            d={snD}
            fill="none"
            stroke={NAVY}
            strokeWidth={3.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={snLen}
            strokeDashoffset={snLen * (1 - drawProg)}
            opacity={0.9}
          />

          {/* Dakar (repere ville) */}
          {dakarPx && dakarAppear > 0 && (
            <g opacity={dakarAppear}>
              <circle cx={dakarPx[0]} cy={dakarPx[1]} r={4.5} fill={NAVY} />
              <circle cx={dakarPx[0]} cy={dakarPx[1]} r={4.5} fill="none" stroke={PARCH} strokeWidth={1.4} />
              <text x={dakarPx[0] + 12} y={dakarPx[1] + 5} fontFamily={SANS} fontSize={20} fontWeight={700} fill={NAVY} opacity={0.85}>Dakar</text>
            </g>
          )}

          {/* JALONS decouvertes sur vraies coords (s'allument au fil du temps + pulse) */}
          {MILESTONES.filter((m) => !m.isFirstOil).map((m) => {
            const i = MILESTONES.indexOf(m);
            const glow = milestoneGlow(i);
            if (glow <= 0.001) return null;
            const px = projection(m.coord);
            if (!px) return null;
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16 + i);
            return (
              <g key={`ms-${i}`} opacity={glow}>
                <circle cx={px[0]} cy={px[1]} r={8 + 18 * pulse} fill="none" stroke={NAVY} strokeWidth={1.6} opacity={0.45 * (1 - pulse)} />
                <circle cx={px[0]} cy={px[1]} r={9} fill={PARCH} />
                <circle cx={px[0]} cy={px[1]} r={7.5} fill={NAVY} />
                <circle cx={px[0]} cy={px[1]} r={3} fill={OCRE} />
              </g>
            );
          })}

          {/* PREMIER BARIL 2024 : Sangomar relume en OR chaud + halo + pulse fort */}
          {(() => {
            const fo = MILESTONES.findIndex((m) => m.isFirstOil);
            if (fo < 0) return null;
            const glow = milestoneGlow(fo);
            if (glow <= 0.001) return null;
            const px = projection(MILESTONES[fo].coord);
            if (!px) return null;
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.22);
            return (
              <g opacity={glow}>
                {/* halo or constant (climax) + nappe pulsante par dessus */}
                <circle cx={px[0]} cy={px[1]} r={34} fill={GOLD} opacity={0.4} filter="url(#snHaloCT)" />
                <circle cx={px[0]} cy={px[1]} r={20 + 28 * pulse} fill={GOLD} opacity={0.32 * (1 - pulse)} filter="url(#snHaloCT)" />
                <circle cx={px[0]} cy={px[1]} r={12 + 16 * pulse} fill="none" stroke={OCRE_HOT} strokeWidth={2.4} opacity={0.7 * (1 - pulse)} />
                <circle cx={px[0]} cy={px[1]} r={11} fill={PARCH} />
                <circle cx={px[0]} cy={px[1]} r={9} fill={OCRE_HOT} stroke={NAVY} strokeWidth={1.8} />
                <circle cx={px[0]} cy={px[1]} r={3.2} fill={PARCH} />
              </g>
            );
          })()}
        </g>

        {/* ── balayage de lumiere (anti-statique) ── */}
        <defs>
          <linearGradient id="sweepCT" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={`${lightSweep - 40}%`} y="0" width="40%" height="100%" fill="url(#sweepCT)" />

        {/* ── TIMELINE editoriale (marge droite) : axe vertical qui se trace ── */}
        {(() => {
          const axisProg = interpolate(frame, [COUNT_FROM, COUNT_FROM + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const axisTop = TL_TOP - 24;
          const axisBot = TL_TOP + (MILESTONES.length - 1) * TL_GAP + 24;
          return (
            <line
              x1={TL_X}
              y1={axisTop}
              x2={TL_X}
              y2={axisTop + (axisBot - axisTop) * axisProg}
              stroke={NAVY}
              strokeWidth={2}
              opacity={0.45}
            />
          );
        })()}

        {/* connexion point-carte -> noeud frise (trait pointille) pour chaque jalon allume */}
        {MILESTONES.map((m, i) => {
          const glow = milestoneGlow(i);
          if (glow <= 0.02) return null;
          const px = projection(m.coord);
          if (!px) return null;
          const nodeY = TL_TOP + i * TL_GAP;
          return (
            <g key={`link-${i}`} opacity={glow * 0.55}>
              <line x1={px[0]} y1={px[1]} x2={TL_X} y2={nodeY} stroke={NAVY} strokeWidth={1.2} strokeDasharray="5 5" />
              <circle cx={TL_X} cy={nodeY} r={5} fill={m.isFirstOil ? OCRE_HOT : NAVY} stroke={m.isFirstOil ? NAVY : PARCH} strokeWidth={1.4} />
            </g>
          );
        })}

        {/* ── COURBE DE PRODUCTION (encart bas-droit) ── */}
        {curveOp > 0 && curve.line && (
          <g opacity={curveOp}>
            <line x1={CURVE_X0} y1={CURVE_Y0} x2={CURVE_X1} y2={CURVE_Y0} stroke={NAVY} strokeWidth={1.6} opacity={0.5} />
            <path d={curve.area} fill="url(#curveAreaCT)" />
            <path d={curve.line} fill="none" stroke={OCRE_DARK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
            {curve.last && (
              <>
                <circle cx={curve.last[0]} cy={curve.last[1]} r={7 + 4 * (0.5 + 0.5 * Math.sin(frame * 0.2))} fill="none" stroke={OCRE_HOT} strokeWidth={1.6} opacity={0.5} />
                <circle cx={curve.last[0]} cy={curve.last[1]} r={5} fill={OCRE_HOT} stroke={NAVY} strokeWidth={1.4} />
              </>
            )}
          </g>
        )}

        {/* grain papier global */}
        <rect width={W} height={H} filter="url(#grainCT)" opacity={0.8} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* ── TITRE = CARTOUCHE (marge haute-droite, pas un texte nu) ── */}
      {(() => {
        const op = interpolate(frame, [14, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        const slide = interpolate(frame, [14, 42], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", top: 80, right: 100, opacity: op, transform: `translateX(${slide}px)`, textAlign: "right" }}>
            <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 5, color: OCRE_DARK, textTransform: "uppercase", marginBottom: 6 }}>Senegal</div>
            <div style={{ fontFamily: NUM, fontSize: 50, letterSpacing: 1, color: NAVY, lineHeight: 1 }}>DIX ANS,</div>
            <div style={{ fontFamily: NUM, fontSize: 50, letterSpacing: 1, color: OCRE_DARK, lineHeight: 1 }}>UN PRODUCTEUR</div>
            <div style={{ width: 170, height: 2, background: NAVY, marginLeft: "auto", marginTop: 12, opacity: 0.5 }} />
          </div>
        );
      })()}

      {/* ── COMPTEUR D'ANNEE GEANT (ancre temporelle) — millesime, bas-gauche sur la carte ── */}
      {yearOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 70,
            opacity: yearOp,
            transform: `scale(${tick})`,
            transformOrigin: "left bottom",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 6, color: OCRE_DARK, textTransform: "uppercase", marginBottom: 2 }}>Annee</div>
          <div
            style={{
              fontFamily: NUM,
              fontSize: 220,
              color: NAVY,
              lineHeight: 0.82,
              letterSpacing: 4,
              textShadow: "0 3px 0 rgba(255,255,255,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {yearDisplay}
          </div>
        </div>
      )}

      {/* ── TIMELINE editoriale : libelles des jalons (s'ecrivent quand le jalon s'allume) ── */}
      {MILESTONES.map((m, i) => {
        const start = yearToFrame(m.year);
        const op = interpolate(frame, [start + 2, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        const slide = interpolate(frame, [start + 2, start + 20], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const nodeY = TL_TOP + i * TL_GAP;
        return (
          <div
            key={`tl-${i}`}
            style={{
              position: "absolute",
              left: TL_X + 22,
              top: nodeY - 38,
              width: 480,
              opacity: op,
              transform: `translateX(${slide}px)`,
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: NUM, fontSize: 46, color: m.isFirstOil ? OCRE_HOT : NAVY, lineHeight: 1, letterSpacing: 1 }}>{m.year}</span>
              <span style={{ fontFamily: NUM, fontSize: 32, color: NAVY, lineHeight: 1, letterSpacing: 1 }}>{m.name}</span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 17, color: OCRE_DARK, marginTop: 4, letterSpacing: 0.5 }}>{m.desc}</div>
          </div>
        );
      })}

      {/* ── ETIQUETTE COURBE (epure) ── */}
      {(() => {
        const op = interpolate(frame, [COUNT_FROM + 10, COUNT_FROM + 30], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        return (
          <div style={{ position: "absolute", left: CURVE_X0, top: CURVE_Y0 - CURVE_H - 52, opacity: op, pointerEvents: "none" }}>
            <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: 4, color: OCRE_DARK, textTransform: "uppercase" }}>Production cumulee</div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

export default ProtoCarto_CoucheTemps;

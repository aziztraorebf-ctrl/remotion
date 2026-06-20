/**
 * PROTO CARTO — LE CONTINENT QUI SE DESSINE (registre parchemin quadrille, vraie geo d3-geo)
 *
 * PRINCIPES repris du hook Senegal 32s (analyse validee Aziz) :
 *   1. DESSIN LENT  : l'Afrique se trace au trait (contour navy, strokeDashoffset) PUIS le fill ocre monte.
 *   2. COUCHES QUI S'AJOUTENT (jamais de cut) : contour -> fill -> producteurs qui s'allument ->
 *      points de ressources qui pulsent -> le Senegal se detache. Un seul monde, on enrichit.
 *   3. DONNEE ANCREE : chaque point ressource est sur les VRAIES coords du gisement/bassin.
 *   4. ANTI-STATIQUE : respiration continue + balayage de lumiere + pulse des points.
 *   5. EPURE : pas de texte qui paraphrase ; les labels apparaissent tard, peu, ancres.
 *
 * VRAIE GEO : countries-50m TopoJSON reprojete via geoMercator centre Afrique (PAS de SVG approximatif).
 * Charte Souverain parchemin (couleurs EXACTES du hook existant).
 *
 * Sequence (~13s @30fps, 390f) :
 *   0-90    : le contour de l'Afrique se trace lentement (pays par pays, ordre ouest->est)
 *   60-150  : le fill ocre monte dans chaque pays (decale, suit le trace)
 *   150-240 : les PRODUCTEURS d'hydrocarbures s'allument en ocre intense, un par un, avec un point pulsant
 *   240-330 : le SENEGAL se detache (halo or) + label + un point GTA offshore qui pulse
 *   330-390 : respiration, etat stable premium
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { geoMercator, geoPath, geoBounds, geoCentroid } from "d3-geo";
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
const OCRE_HOT = "#e09a3c"; // producteur allume (ocre plus intense/chaud)
const NAVY = "#16213a";
const GOLD = "#d8b25a";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;
const GRID_OFFSET_X = 40;
const GRID_OFFSET_Y = 28;

// Producteurs d'hydrocarbures africains majeurs (nom topo -> ordre d'allumage + label optionnel)
const PRODUCERS = ["Algeria", "Libya", "Nigeria", "Angola", "Egypt", "Mauritania", "Senegal"];

// Gisements/points ressource sur VRAIES coords (lon, lat)
const RESOURCE_POINTS: { name: string; coord: [number, number]; label?: string }[] = [
  { name: "GTA", coord: [-17.05, 15.9], label: "Sénégal" }, // Grand Tortue Ahmeyim offshore SN/MR
  { name: "Hassi", coord: [5.9, 31.7] }, // Hassi Messaoud, Algerie
  { name: "Niger Delta", coord: [6.0, 4.5] }, // delta du Niger, Nigeria
  { name: "Angola", coord: [12.0, -8.0] }, // offshore Angola
  { name: "Sirte", coord: [19.0, 30.0] }, // bassin de Syrte, Libye
];

export const ProtoCarto_ContinentDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const data = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const features = fc.features as any[];
    // pays africains = ceux dont le centroide tombe dans la bbox Afrique
    const inAfrica = (f: any) => {
      const c = geoCentroid(f);
      return c[0] > -20 && c[0] < 52 && c[1] > -36 && c[1] < 38;
    };
    const african = features.filter(inAfrica);

    // projection calee sur l'Afrique entiere (fitExtent sur l'ensemble africain)
    // ANCRAGE A GAUCHE : on laisse la marge DROITE comme colonne de cartouches (anti-vide).
    const collection = { type: "FeatureCollection", features: african } as any;
    const projection = geoMercator();
    projection.fitExtent(
      [
        [W * 0.06, H * 0.1],
        [W * 0.62, H * 0.92],
      ],
      collection
    );
    const path = geoPath(projection);

    // pre-calcule : ordre de trace (ouest->est par longitude du centroide), longueur de path, centroide px
    const enriched = african
      .map((f) => {
        const c = geoCentroid(f);
        const cx = projection(c)?.[0] ?? 0;
        const cy = projection(c)?.[1] ?? 0;
        const d = path(f) || "";
        // longueur approx du path (compte les commandes) pour le strokeDasharray
        const len = (d.match(/[ML]/g)?.length ?? 50) * 12;
        return { name: f.properties?.name as string, f, d, cx, cy, lon: c[0], len };
      })
      .sort((a, b) => a.lon - b.lon);

    return { projection, path, enriched };
  }, [topo]);

  if (!topo || !data) return <AbsoluteFill style={{ background: PARCH }} />;

  const { projection, enriched } = data;
  const N = enriched.length;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  // anti-statique global
  const breath = 1 + 0.005 * Math.sin(frame * 0.07);
  const lightSweep = interpolate((frame % 280) / 280, [0, 1], [-30, 130]);
  const introFade = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // chaque pays : trace decale selon son rang (ouest->est), sur 0-90 ; fill suit 20f apres
  const drawWindow = 90;
  const fillDelay = 20;
  const perCountry = (i: number) => {
    const t0 = (i / N) * (drawWindow - 18);
    const drawProg = interpolate(frame, [t0, t0 + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fillProg = interpolate(frame, [t0 + fillDelay, t0 + fillDelay + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { drawProg, fillProg };
  };

  // producteurs : s'allument un par un sur 150-240
  const producerGlow = (name: string) => {
    const idx = PRODUCERS.indexOf(name);
    if (idx < 0) return 0;
    const start = 152 + idx * 12;
    return interpolate(frame, [start, start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // Senegal se detache (240-330)
  const snFocus = interpolate(frame, [248, 285], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: introFade }}>
        <defs>
          <linearGradient id="ocreFillC" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="55%" stopColor={OCRE_MID} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="ocreHotC" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE_HOT} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <filter id="paperTexC">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <filter id="snHalo"><feGaussianBlur stdDeviation="14" /></filter>
          <filter id="grainC">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
          </filter>
        </defs>

        {/* fond papier texture */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexC)" opacity={0.5} />

        {/* GRILLE fine or-sable */}
        <g stroke={GRID} strokeWidth={1.6} opacity={0.6}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* CONTINENT : respiration globale autour du centre */}
        <g transform={`scale(${breath})`} style={{ transformOrigin: "960px 540px" }}>
          {enriched.map((c, i) => {
            const { drawProg, fillProg } = perCountry(i);
            if (drawProg <= 0) return null;
            const glow = producerGlow(c.name);
            const isSn = c.name === "Senegal";
            // dim des non-Senegal quand le Senegal se detache
            const dim = isSn ? 0 : snFocus * 0.45;
            return (
              <g key={c.name} opacity={1 - dim}>
                {/* fill ocre (monte apres le trace), vire "hot" si producteur */}
                {fillProg > 0 && (
                  <path
                    d={c.d}
                    fill={glow > 0.01 ? "url(#ocreHotC)" : "url(#ocreFillC)"}
                    opacity={fillProg * (glow > 0.01 ? 1 : 0.92)}
                  />
                )}
                {/* contour navy qui se trace */}
                <path
                  d={c.d}
                  fill="none"
                  stroke={NAVY}
                  strokeWidth={isSn ? 3.4 : 2.2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={c.len}
                  strokeDashoffset={c.len * (1 - drawProg)}
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* SENEGAL : halo or quand il se detache */}
          {(() => {
            const sn = enriched.find((c) => c.name === "Senegal");
            if (!sn || snFocus < 0.01) return null;
            return (
              <>
                <path d={sn.d} fill={GOLD} opacity={0.4 * snFocus} filter="url(#snHalo)" />
                <path d={sn.d} fill="url(#ocreHotC)" opacity={snFocus} stroke={NAVY} strokeWidth={3.6} strokeLinejoin="round" />
              </>
            );
          })()}

          {/* POINTS RESSOURCE sur vraies coords (pulsent), apparaissent avec les producteurs */}
          {RESOURCE_POINTS.map((pt, i) => {
            const px = projection(pt.coord);
            if (!px) return null;
            const appear = interpolate(frame, [165 + i * 10, 185 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (appear <= 0) return null;
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16 + i);
            return (
              <g key={pt.name} opacity={appear}>
                <circle cx={px[0]} cy={px[1]} r={6 + 14 * pulse} fill="none" stroke={NAVY} strokeWidth={1.4} opacity={0.4 * (1 - pulse)} />
                <circle cx={px[0]} cy={px[1]} r={5} fill={NAVY} />
                <circle cx={px[0]} cy={px[1]} r={2.2} fill={OCRE} />
              </g>
            );
          })}
        </g>

        {/* balayage de lumiere (anti-statique) */}
        <defs>
          <linearGradient id="sweepC" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={`${lightSweep - 40}%`} y="0" width="40%" height="100%" fill="url(#sweepC)" />

        {/* grain papier global */}
        <rect width={W} height={H} filter="url(#grainC)" opacity={0.8} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* TITRE = CARTOUCHE PARCHEMIN (pas un texte nu) ancre en haut-droite dans la marge */}
      {(() => {
        const op = interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        const slide = interpolate(frame, [18, 46], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", top: 90, right: 90, opacity: op, transform: `translateX(${slide}px)`, textAlign: "right" }}>
            <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 5, color: OCRE_DARK, textTransform: "uppercase", marginBottom: 6 }}>Dossier</div>
            <div style={{ fontFamily: NUM, fontSize: 52, letterSpacing: 1, color: NAVY, lineHeight: 1 }}>L'AFRIQUE DES</div>
            <div style={{ fontFamily: NUM, fontSize: 52, letterSpacing: 1, color: OCRE_DARK, lineHeight: 1 }}>HYDROCARBURES</div>
            <div style={{ width: 180, height: 2, background: NAVY, marginLeft: "auto", marginTop: 12, opacity: 0.5 }} />
          </div>
        );
      })()}

      {/* COLONNE de CARTOUCHES PRODUCTEURS dans la marge droite (utilise le vide) :
          chaque producteur ecrit sa ligne quand il s'allume sur la carte = lien marge<->carte */}
      {(() => {
        const rows = [
          { name: "ALGÉRIE", stat: "1er producteur de gaz", idx: 0 },
          { name: "NIGÉRIA", stat: "1er producteur de pétrole", idx: 2 },
          { name: "LIBYE", stat: "48 Mds barils de réserves", idx: 1 },
          { name: "ANGOLA", stat: "1,1 M barils/jour", idx: 3 },
        ];
        const fadeCol = interpolate(frame, [250, 272], [1, 0.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // s'efface quand Senegal prend le focus
        if (fadeCol <= 0) return null;
        return (
          <div style={{ position: "absolute", top: 330, right: 90, width: 360, opacity: fadeCol }}>
            {rows.map((r) => {
              const start = 156 + r.idx * 12;
              const op = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const slide = interpolate(frame, [start, start + 18], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (op <= 0) return null;
              return (
                <div key={r.name} style={{ opacity: op, transform: `translateX(${slide}px)`, marginBottom: 18, paddingLeft: 16, borderLeft: `3px solid ${OCRE_DARK}`, textAlign: "left" }}>
                  <div style={{ fontFamily: NUM, fontSize: 32, letterSpacing: 1, color: NAVY, lineHeight: 1 }}>{r.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 16, color: OCRE_DARK, marginTop: 3 }}>{r.stat}</div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* SENEGAL final = CARTOUCHE PARCHEMIN (nom + stat + source), ancre dans la marge droite,
          relie au pays par un trait (anti texte-plaque, utilise le vide) */}
      {(() => {
        const sn = enriched.find((c) => c.name === "Senegal");
        if (!sn) return null;
        const op = interpolate(frame, [286, 312], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        const slide = interpolate(frame, [286, 316], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cardX = 1180, cardY = 360;
        return (
          <>
            {/* trait de liaison pays -> cartouche */}
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: op }}>
              <line x1={sn.cx + 20} y1={sn.cy} x2={cardX} y2={cardY + 60} stroke={NAVY} strokeWidth={1.5} strokeDasharray="6 5" opacity={0.5} />
              <circle cx={sn.cx + 20} cy={sn.cy} r={5} fill={NAVY} />
            </svg>
            <div style={{ position: "absolute", left: cardX, top: cardY, opacity: op, transform: `translateX(${slide}px)`, width: 520 }}>
              <div style={{ display: "inline-block", background: "rgba(20,33,58,0.06)", border: `2px solid ${NAVY}`, borderRadius: 10, padding: "16px 28px" }}>
                <div style={{ fontFamily: NUM, fontSize: 56, letterSpacing: 2, color: NAVY, lineHeight: 1 }}>SÉNÉGAL</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 44, fontWeight: 800, color: OCRE_DARK, marginTop: 10, lineHeight: 1 }}>8 000 000 $ / jour</div>
                <div style={{ fontFamily: SANS, fontSize: 16, color: NAVY, opacity: 0.7, marginTop: 8 }}>gisement GTA · production attendue 2024</div>
              </div>
            </div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

export default ProtoCarto_ContinentDraw;

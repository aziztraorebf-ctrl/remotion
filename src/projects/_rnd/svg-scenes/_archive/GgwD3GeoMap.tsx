/**
 * GgwD3GeoMap — PROTO : la vraie carte de la Grande Muraille Verte en d3-geo + arbres SVG par-dessus.
 *
 * R&D Grande Muraille Verte (2026-06-22, idee Aziz). Le LLM ne sait pas dessiner une geo EXACTE en SVG -> NOUS
 * l'injectons en d3-geo (vraies frontieres des 11 pays Senegal->Djibouti), et on habille en style braise-or.
 * Le VRAI trace de la ceinture (waypoints lon/lat de la bande sahelienne) est projete pareil -> arbres geo-ancres.
 * On animera ensuite l'apparition des arbres ouest->est + leur mort (comme le proto top-down, mais sur la VRAIE carte).
 *
 * viewBox 1080x1920 (vertical 9:16). Vue de dessus d'abord (le 3/4 iso = raffinement apres si valide).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, continueRender, delayRender, staticFile } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { GEMINI_TREES } from "./geminiTrees";

const W = 1080, H = 1920;
const TERRE = "#1c1108";

// les vrais waypoints de la ceinture verte (lon, lat), Dakar (Senegal) -> Djibouti, le long du Sahel ~14-16N
const GGW_TRACE: [number, number][] = [
  [-17.4, 14.7],  // Dakar, Senegal
  [-12.0, 14.5],  // sud Mauritanie / Mali ouest
  [-4.0, 14.5],   // Mali (Mopti)
  [2.1, 13.5],    // Niger ouest (Niamey)
  [8.0, 13.8],    // sud Niger / nord Nigeria
  [15.0, 13.0],   // N'Djamena, Tchad
  [25.0, 14.0],   // Soudan ouest (Darfour)
  [32.5, 15.5],   // Khartoum, Soudan
  [38.0, 15.3],   // Erythree
  [42.0, 12.5],   // sud Erythree / Djibouti
  [43.1, 11.6],   // Djibouti
];

const VERT = "#5fc24a", VERT_D = "#3e8f34", TRONC = "#8a5a2c", OR = "#e8b44a";

// ⭐ vrai arbre GEMINI (iteration top-down) reutilise — beaucoup plus net que des cercles maison.
// Injecte en innerHTML, ancre en (0,0) ; le wrapper JSX porte la position/echelle (animable).
const Tree: React.FC<{ variant: number }> = ({ variant }) => (
  <g dangerouslySetInnerHTML={{ __html: GEMINI_TREES[variant % GEMINI_TREES.length] }} />
);

export const GgwD3GeoMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [geo, setGeo] = React.useState<any>(null);
  const [handle] = React.useState(() => delayRender("load-ggw-geojson"));

  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/ggw/ggw-countries.geojson"))
      .then((r) => r.json())
      .then((j) => { setGeo(j); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!geo) return <AbsoluteFill style={{ background: TERRE }} />;

  // projection Mercator LARGE (on projette dans un espace de travail large, puis on incline en iso)
  const projection = geoMercator().fitExtent([[0, 0], [1500, 900]], geo);
  const path = geoPath(projection as any);

  const tracePts = GGW_TRACE.map((c) => projection(c) as [number, number]).filter(Boolean);
  const traceD = "M" + tracePts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L");

  // arbres le long du trace : interpoler entre waypoints
  const trees: { x: number; y: number; t: number }[] = [];
  const NB = 16;
  for (let i = 0; i < NB; i++) {
    const t = i / (NB - 1);
    const seg = t * (tracePts.length - 1);
    const a = Math.floor(seg), b = Math.min(a + 1, tracePts.length - 1);
    const f = seg - a;
    trees.push({ x: tracePts[a][0] + (tracePts[b][0] - tracePts[a][0]) * f,
                 y: tracePts[a][1] + (tracePts[b][1] - tracePts[a][1]) * f, t });
  }

  // ⭐ TRANSFORMATION 3/4 ISOMETRIQUE : on incline la carte (bande horizontale -> diagonale montante) pour remplir
  // le 9:16 vertical. rotation -34deg met l'axe Senegal(bas-gauche)->Djibouti(haut-droit) dans la diagonale du cadre ;
  // scale Y 0.86 = legere plongee iso ; on recadre/centre dans le viewBox vertical.
  const ISO = "translate(540 980) rotate(-34) scale(1.18 1.0) translate(-750 -450)";

  // les arbres doivent rester DROITS apres la rotation -> on contre-pivote chaque arbre de +34deg
  return (
    <AbsoluteFill style={{ background: TERRE }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <radialGradient id="ggw-vignette" cx="50%" cy="48%" r="62%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="ggw-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2410" />
            <stop offset="100%" stopColor="#241507" />
          </linearGradient>
        </defs>

        {/* fond chaud */}
        <rect x={0} y={0} width={W} height={H} fill={TERRE} />

        <g transform={ISO}>
          {/* OMBRE PORTEE de la carte (profondeur iso) : meme paths, decales bas-droite, sombres */}
          <g transform="translate(14 22)" opacity={0.5}>
            {geo.features.map((f: any, i: number) => (
              <path key={`sh${i}`} d={path(f) as string} fill="#000" />
            ))}
          </g>
          {/* les 11 pays (vraie geo) en braise-or matere */}
          {geo.features.map((f: any, i: number) => (
            <path key={i} d={path(f) as string} fill="url(#ggw-land)" stroke="#6b4521" strokeWidth={2} />
          ))}
          {/* LABELS DES PAYS au centroide (contre-pivotes pour rester droits) */}
          {geo.features.map((f: any, i: number) => {
            const c = (geoPath(projection as any) as any).centroid(f) as [number, number];
            if (!c || isNaN(c[0])) return null;
            const nm = (f.properties.name || "").toUpperCase();
            return (
              <text key={`lbl${i}`} transform={`translate(${c[0]} ${c[1]}) rotate(34)`}
                fill="#c9a874" fontSize={20} fontWeight={600} textAnchor="middle"
                fontFamily="Georgia, serif" opacity={0.75} letterSpacing={1}>{nm}</text>
            );
          })}

          {/* le vrai trace de la ceinture (or lumineux) */}
          <path d={traceD} fill="none" stroke={OR} strokeWidth={6} strokeLinecap="round"
            opacity={0.95} style={{ filter: "drop-shadow(0 0 10px rgba(232,180,74,0.7))" }} />

          {/* arbres geo-ancres, CONTRE-PIVOTES (+34deg) pour rester droits, apparition ouest->est PUIS la MORT */}
          {trees.map((tr, i) => {
            const birth = 30 + i * 3;
            const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 12, stiffness: 120 } });
            if (pop < 0.01) return null;
            // LA MORT : a partir de f180, 3/4 grisent+retrecissent ; survivants = 1 arbre sur 4 (i%4===2)
            const survivor = i % 4 === 2;
            const death = survivor ? 0 : interpolate(frame, [180, 180 + (i % 6) * 5 + 14], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const scale = 1.7 * pop * interpolate(death, [0, 1], [1, 0.32]);
            // filtre : vivant = couleur Gemini ; mort = desature + bruni (grayscale + sepia sombre)
            const deathFilter = death > 0
              ? `grayscale(${death}) sepia(${death * 0.6}) brightness(${1 - death * 0.55})`
              : undefined;
            return (
              <g key={i} opacity={pop} transform={`translate(${tr.x} ${tr.y}) rotate(34) scale(${scale})`}
                 style={{ filter: deathFilter }}>
                <Tree variant={i} />
              </g>
            );
          })}
        </g>

        {/* vignette chaude */}
        <rect x={0} y={0} width={W} height={H} fill="url(#ggw-vignette)" />

        {/* labels extremites (hors transform iso, droits, places aux coins de la diagonale) */}
        <text x={120} y={H - 360} fill="#f2e3c0" fontSize={42} fontWeight={700} textAnchor="start" fontFamily="Georgia, serif" style={{ filter: "drop-shadow(0 2px 4px #000)" }}>SÉNÉGAL</text>
        <text x={W - 120} y={300} fill="#f2e3c0" fontSize={42} fontWeight={700} textAnchor="end" fontFamily="Georgia, serif" style={{ filter: "drop-shadow(0 2px 4px #000)" }}>DJIBOUTI</text>
      </svg>
    </AbsoluteFill>
  );
};

export default GgwD3GeoMap;

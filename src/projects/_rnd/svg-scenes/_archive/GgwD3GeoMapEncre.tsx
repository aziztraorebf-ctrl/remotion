/**
 * GgwD3GeoMapEncre — PROTO : la vraie carte de la Grande Muraille Verte en d3-geo, registre ENCRE/GRAVURE.
 *
 * R&D Grande Muraille Verte (2026-06-22). Decline le hook braise prouve (GgwD3GeoMap.tsx) en registre ENCRE :
 *   - fond PARCHEMIN creme (#e8dcc0), pays = traits brun-noir (#2b2117) + remplissage parchemin clair (PAS d'aplat sombre),
 *     ombre par hachures legeres (jamais d'aplat noir, doctrine encre).
 *   - le trace de la ceinture = trait d'encre brun-or DISCRET.
 *   - labels pays en brun-encre.
 *   - ARBRES : au depart en ENCRE (desature/bruni = monde "sec/mort"), puis quand ils apparaissent ouest->est ils
 *     SE COLORENT en VERT PLEIN (pattern recolorBody de DemiLuneEncreColorisee : copie du groupe, fill/stroke verts
 *     forces, opacite montee par frame). A la MORT (3/4 a partir de f180) ils repassent en encre/brun + retrecissent.
 *     Le contraste N&B(brun)->couleur pleine = la signature.
 *
 * Image-cible validee (faisabilite amont) : /tmp/cible-encre-ggw.png — carte iso parchemin, arbres verts qui jaillissent.
 * viewBox 1080x1920 (vertical 9:16). MEME geo / MEME transfo iso / MEME anim que le proto braise.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, continueRender, delayRender, staticFile } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { GEMINI_TREES } from "./geminiTrees";

const W = 1080, H = 1920;
const PARCHEMIN = "#e8dcc0";
const ENCRE = "#2b2117";        // trait brun-noir
const LAND = "#e3d5b5";          // remplissage pays (parchemin un peu plus clair que le fond)
const OR_DISCRET = "#a87b33";    // trace ceinture, brun-or discret

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

// couleurs VIVES de la vie (recolorBody)
const VERT = "#3e8f34", VERT_D = "#295c1c";

// force fill+stroke d'un body SVG vers une couleur -> aplat plein de la forme ("none" preserve).
function recolorBody(body: string, fill: string, stroke: string): string {
  let s = body;
  s = s.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`);
  s = s.replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
  return s;
}

// arbre Gemini ENCRE (trait brun, monde sec) = le meme body, recolore en brun-encre.
const TreeEncre: React.FC<{ variant: number }> = ({ variant }) => (
  <g dangerouslySetInnerHTML={{ __html: recolorBody(GEMINI_TREES[variant % GEMINI_TREES.length], "#cdbd9a", ENCRE) }} />
);
// arbre Gemini VIVANT = recolore en VERT plein (la vie jaillit).
const TreeVert: React.FC<{ variant: number }> = ({ variant }) => (
  <g dangerouslySetInnerHTML={{ __html: recolorBody(GEMINI_TREES[variant % GEMINI_TREES.length], VERT, VERT_D) }} />
);

export const GgwD3GeoMapEncre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [geo, setGeo] = React.useState<any>(null);
  const [handle] = React.useState(() => delayRender("load-ggw-geojson-encre"));

  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/ggw/ggw-countries.geojson"))
      .then((r) => r.json())
      .then((j) => { setGeo(j); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!geo) return <AbsoluteFill style={{ background: PARCHEMIN }} />;

  const projection = geoMercator().fitExtent([[0, 0], [1500, 900]], geo);
  const path = geoPath(projection as any);

  const tracePts = GGW_TRACE.map((c) => projection(c) as [number, number]).filter(Boolean);
  const traceD = "M" + tracePts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L");

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

  // MEME transfo iso que le proto braise (axe Senegal bas-gauche -> Djibouti haut-droit en diagonale).
  const ISO = "translate(540 980) rotate(-34) scale(1.18 1.0) translate(-750 -450)";

  return (
    <AbsoluteFill style={{ background: PARCHEMIN }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          {/* hachures legeres = ombre/relief encre (jamais d'aplat noir) */}
          <pattern id="encre-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={ENCRE} strokeWidth={0.7} opacity={0.5} />
          </pattern>
          {/* grain parchemin doux (vignette inversee chaude, coins assombris) */}
          <radialGradient id="encre-vignette" cx="50%" cy="48%" r="68%">
            <stop offset="58%" stopColor="#b89b63" stopOpacity="0" />
            <stop offset="100%" stopColor="#7a5e30" stopOpacity="0.32" />
          </radialGradient>
        </defs>

        {/* fond parchemin */}
        <rect x={0} y={0} width={W} height={H} fill={PARCHEMIN} />

        <g transform={ISO}>
          {/* ombre portee LEGERE (hachures encre, decalee) = profondeur sans aplat noir */}
          <g transform="translate(10 16)">
            {geo.features.map((f: any, i: number) => (
              <path key={`sh${i}`} d={path(f) as string} fill="url(#encre-hatch)" />
            ))}
          </g>
          {/* les 11 pays (vraie geo) : remplissage parchemin clair + trait encre fin */}
          {geo.features.map((f: any, i: number) => (
            <path key={i} d={path(f) as string} fill={LAND} stroke={ENCRE} strokeWidth={1.6} />
          ))}
          {/* LABELS PAYS au centroide (contre-pivotes droits), brun-encre serif */}
          {geo.features.map((f: any, i: number) => {
            const c = (geoPath(projection as any) as any).centroid(f) as [number, number];
            if (!c || isNaN(c[0])) return null;
            const nm = (f.properties.name || "").toUpperCase();
            return (
              <text key={`lbl${i}`} transform={`translate(${c[0]} ${c[1]}) rotate(34)`}
                fill={ENCRE} fontSize={19} fontWeight={600} textAnchor="middle"
                fontFamily="Georgia, serif" opacity={0.62} letterSpacing={1}>{nm}</text>
            );
          })}

          {/* le vrai trace de la ceinture : trait d'encre brun-or DISCRET (pas de glow lumineux) */}
          <path d={traceD} fill="none" stroke={OR_DISCRET} strokeWidth={4} strokeLinecap="round"
            strokeDasharray="2 5" opacity={0.85} />
          <path d={traceD} fill="none" stroke={OR_DISCRET} strokeWidth={2} strokeLinecap="round" opacity={0.55} />

          {/* arbres geo-ancres, contre-pivotes (+34) pour rester droits.
              apparition ouest->est : ENCRE -> VERT plein qui jaillit. PUIS la MORT (3/4 redeviennent encre + retrecissent). */}
          {trees.map((tr, i) => {
            const birth = 30 + i * 3;
            const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 12, stiffness: 120 } });
            if (pop < 0.01) return null;
            // colorisation verte : monte juste apres la naissance (la vie jaillit)
            const greenIn = interpolate(frame, [birth + 4, birth + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // LA MORT : 3/4 a partir de f180 ; survivants = 1 arbre sur 4 (i%4===2)
            const survivor = i % 4 === 2;
            const death = survivor ? 0 : interpolate(frame, [180, 180 + (i % 6) * 5 + 14], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const scale = 1.7 * pop * interpolate(death, [0, 1], [1, 0.32]);
            // le vert s'eteint a la mort -> on retire la couche verte, l'encre brune reste dessous
            const greenOpacity = pop * greenIn * (1 - death);
            return (
              <g key={i} transform={`translate(${tr.x} ${tr.y}) rotate(34) scale(${scale})`}>
                {/* couche ENCRE (toujours presente = monde sec / la base) */}
                <g opacity={pop}><TreeEncre variant={i} /></g>
                {/* couche VERT PLEIN (la vie) qui apparait par-dessus puis s'eteint a la mort */}
                <g opacity={greenOpacity}><TreeVert variant={i} /></g>
              </g>
            );
          })}
        </g>

        {/* vignette chaude parchemin (coins) */}
        <rect x={0} y={0} width={W} height={H} fill="url(#encre-vignette)" />

        {/* labels extremites (droits, hors iso) en encre */}
        <text x={120} y={H - 360} fill={ENCRE} fontSize={42} fontWeight={700} textAnchor="start" fontFamily="Georgia, serif" letterSpacing={2}>SÉNÉGAL</text>
        <text x={W - 120} y={300} fill={ENCRE} fontSize={42} fontWeight={700} textAnchor="end" fontFamily="Georgia, serif" letterSpacing={2}>DJIBOUTI</text>
      </svg>
    </AbsoluteFill>
  );
};

export default GgwD3GeoMapEncre;

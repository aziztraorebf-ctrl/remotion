// PROTO COMPARATIF — "buste plante" vs "medaillon pose" vs "objet iso ancre" (D3, 16:9).
// But (question Aziz) : montrer que "avoir l'air pose sur la carte" ne depend PAS de D3 vs Mapbox,
// mais de la RECETTE de compositing. Meme carte D3, meme personnage FAMA, 3 traitements du meme point :
//   (A) buste brut pose            -> a l'air PLANTE comme une vignette (ce que je faisais)
//   (B) medaillon rond + socle     -> la recette de la video Mapbox (cercle + bordure camp + base)
//                                     => a l'air POSE / integre.
//   (C) objet iso base FR + ombre de contact renforcee -> l'objet est POSE au sol.
// Recette medaillon extraite du code Mapbox reel (Partie4Cout : cercles empiles + plaque opaque dessous).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { getSahelFlat, W, H } from "./sahelFlatGeo";

export const JETONS_COMPARATIF_FRAMES = 240; // 8s

const PARCH_BG = "#b8ac93";
const LAND_VOISIN = "#cfc4a8";
const CREME = "#f5efd6";
const INK = "#3a2a18";
const GREEN_AES = "#4e8c7d"; // bordure jeton soldat AES (repris du code Mapbox)
const STROKE: Record<string, string> = { Mali: "#d98a2b", "Burkina Faso": "#c0392b", Niger: "#2e9e6b" };

// 3 points geo au Mali, alignes horizontalement pour comparer
const PT_A: [number, number] = [-9.5, 15.5]; // ouest — buste brut
const PT_B: [number, number] = [-4.0, 16.5]; // centre — medaillon
const PT_C: [number, number] = [1.0, 18.0]; // est — objet iso

// ---- (B) MEDAILLON — compositing EXACT de la video Mapbox (Partie4Cout l.907-925) ----
// Recette reelle : disque plein #F5EFD6 (overflow hidden) + image objectFit cover / top center /
// width 120% (visage cadre haut, deborde) + bordure sable + boxShadow du disque + OMBRE SOL FLOUE
// separee (blur). En SVG headless : boxShadow -> cercle sombre floute derriere le disque ;
// ombre sol -> ellipse floue via feGaussianBlur. Le jeton est POSE, pas plante (2 niveaux d'ombre).
const SAND_FLEE = "#c9b57e"; // bordure sable (equiv SAND_FLEE du code Mapbox)
const Medaillon: React.FC<{
  href: string; x: number; y: number; r: number; pop: number; ring: string; label: string;
}> = ({ href, x, y, r, pop, ring, label }) => {
  const cid = `clip-${label.replace(/\s/g, "")}`;
  const bid = `blur-${label.replace(/\s/g, "")}`;
  const popS = pop * 0.35 + 0.65;
  // centre du disque legerement au-dessus du point geo (le point = "pieds", le disque flotte au niveau tete)
  const cyDisk = -r * 0.75;
  return (
    <g transform={`translate(${x},${y}) scale(${popS})`} opacity={pop}>
      <defs>
        <filter id={bid} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={r * 0.13} />
        </filter>
        <clipPath id={cid}>
          <circle cx={0} cy={cyDisk} r={r} />
        </clipPath>
      </defs>

      {/* 1) OMBRE SOL floue, decalee bas-droite (assoit le jeton sur la carte) — l.917 */}
      <ellipse cx={r * 0.08} cy={r * 0.18} rx={r * 0.7} ry={r * 0.22} fill="rgba(40,27,8,0.42)" filter={`url(#${bid})`} />

      {/* 2) boxShadow du disque : cercle sombre floute JUSTE derriere le disque (l.920 boxShadow) */}
      <circle cx={0} cy={cyDisk + r * 0.09} r={r * 1.02} fill="rgba(0,0,0,0.45)" filter={`url(#${bid})`} />

      {/* 3) disque plein creme (le fond du jeton, pas une plaque sombre) — l.919 */}
      <circle cx={0} cy={cyDisk} r={r} fill="#f5efd6" />

      {/* 4) image cadree visage : objectFit cover / top center / width ~120% -> on deborde et on remonte */}
      <g clipPath={`url(#${cid})`}>
        <image
          href={staticFile(href)}
          x={-r * 1.2}
          y={cyDisk - r * 1.28}
          width={r * 2.4}
          height={r * 2.4}
          preserveAspectRatio="xMidYMin slice"
        />
      </g>

      {/* 5) bordure sable + liseré camp fin (l.920 border) */}
      <circle cx={0} cy={cyDisk} r={r} fill="none" stroke={SAND_FLEE} strokeWidth={r * 0.08} />
      <circle cx={0} cy={cyDisk} r={r * 0.99} fill="none" stroke={ring} strokeWidth={r * 0.04} opacity={0.9} />
    </g>
  );
};

export const JetonsComparatif16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flat = getSahelFlat();

  // cadre fixe zoome sur le trio
  const scale = flat.trioZoom * 0.92;
  const tx = W / 2 - flat.trioCenter[0] * scale;
  const ty = H / 2 - flat.trioCenter[1] * scale;
  const camT = `translate(${tx},${ty}) scale(${scale})`;

  const popA = spring({ frame: frame - 20, fps, config: { damping: 200, mass: 0.6 } });
  const popB = spring({ frame: frame - 45, fps, config: { damping: 200, mass: 0.6 } });
  const popC = spring({ frame: frame - 70, fps, config: { damping: 200, mass: 0.7 } });
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const a = flat.project(PT_A);
  const b = flat.project(PT_B);
  const c = flat.project(PT_C);
  // tailles en espace-carte (compensees pour le scale, ~constantes a l'ecran)
  const rMed = 62 / scale;
  const bustW = 150 / scale;
  const objW = 230 / scale;

  const labelStyle = (leftPct: number): React.CSSProperties => ({
    position: "absolute", left: `${leftPct}%`, top: "72%", transform: "translateX(-50%)",
    textAlign: "center", color: INK, fontFamily: "'Archivo','Arial Narrow',sans-serif", width: 340,
  });

  return (
    <AbsoluteFill style={{ background: PARCH_BG }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <Img src={staticFile("_shared/sprites/warmap/paper-grain.png")}
          style={{ position: "absolute", width: W, height: H, opacity: 0.5, mixBlendMode: "multiply", objectFit: "cover" }} />

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g transform={camT}>
            {flat.voisins.map((cc, i) => (
              <path key={`v-${i}`} d={cc.d} fill={LAND_VOISIN} stroke="#8a7c60" strokeWidth={0.8 / scale} strokeOpacity={0.7} />
            ))}
            {flat.trio.map((cc, i) => (
              <path key={`t-${i}`} d={cc.d} fill={CREME} stroke={STROKE[cc.name] || INK} strokeWidth={3 / scale} strokeLinejoin="round" />
            ))}

            {/* (A) buste brut pose : ombre faible, ancre bas-centre — a l'air PLANTE */}
            <g transform={`translate(${a[0]},${a[1]})`} opacity={popA}>
              <ellipse cx={0} cy={0} rx={bustW * 0.28} ry={bustW * 0.08} fill={INK} opacity={0.18} />
              <g transform={`scale(${popA * 0.3 + 0.7})`}>
                <image href={staticFile("_shared/sprites/warmap/jeton-fama.png")} x={-bustW / 2} y={-bustW} width={bustW} height={bustW} preserveAspectRatio="xMidYMax meet" />
              </g>
            </g>

            {/* (B) medaillon rond + socle — la recette Mapbox */}
            <Medaillon href="_shared/sprites/warmap/jeton-fama.png" x={b[0]} y={b[1]} r={rMed} pop={popB} ring={GREEN_AES} label="fama-med" />

            {/* (C) objet iso base FR — SANS ombre externe (diagnostic Aziz).
                L'objet iso a DEJA son ombre portee dessinee dans l'illustration (les sacs de sable
                projettent leur ombre sur le sol) -> une ombre externe le DECOLLE (flottement).
                On la retire : l'objet s'ancre par sa propre ombre native. */}
            <g transform={`translate(${c[0]},${c[1]})`} opacity={popC}>
              <g transform={`scale(${popC * 0.25 + 0.75})`}>
                <image href={staticFile("_shared/sprites/warmap/base-fr-td.png")} x={-objW * 0.5} y={-objW * 0.545} width={objW} height={objW * 0.545} preserveAspectRatio="xMidYMax meet" />
              </g>
            </g>
          </g>
        </svg>

        {/* labels A/B/C */}
        <div style={labelStyle(19)}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#8b3a3a" }}>A · buste brut</div>
          <div style={{ fontSize: 18, color: "#6b5a3f" }}>a l'air planté (vignette)</div>
        </div>
        <div style={labelStyle(50)}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#2e6e5a" }}>B · médaillon + socle</div>
          <div style={{ fontSize: 18, color: "#6b5a3f" }}>recette Mapbox → posé sur la carte</div>
        </div>
        <div style={labelStyle(81)}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#3a2a18" }}>C · objet iso + ombre</div>
          <div style={{ fontSize: 18, color: "#6b5a3f" }}>posé au sol</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default JetonsComparatif16x9;

// PROTO — Jetons + objets + dezoom sur carte D3 plate (16:9), registre parchemin AES.
// Prouve (question Aziz) que D3 fait TOUT ce que la video Mapbox Sahel faisait :
//  1. JETONS ancres (combattant JNIM, soldat FAMA) poses sur un point geo via project([lon,lat]).
//  2. Jeton qui BOUGE le long d'une trajectoire (JNIM avance de la Libye vers le centre Mali).
//  3. OBJET/base iso (base-fr-td) posee, puis qui s'ETEINT (fade, pas de glissement — objet inerte).
//  4. DEZOOM D3 continu : la camera scale/tx/ty part serree sur le trio -> revele le contexte regional,
//     les jetons SUIVENT l'echelle (ancres au sol, ils grossissent/retrecissent avec la carte).
// Fond parchemin + texture paper-grain (repond au "trop plat" : on rechauffe sans relief raster Mapbox).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { getSahelFlat, getDezoomCam, W, H } from "./sahelFlatGeo";

// jetons en SVG <image> (memes coordonnees que les paths -> suivent le <g transform> camera).
// href resolu via staticFile pour le rendu Remotion.

export const SAHEL_JETONS_FRAMES = 420; // 14s @30fps

// palette AES longue
const PARCH_BG = "#b8ac93";
const OCEAN = "#c8d9e0";
const LAND_VOISIN = "#cfc4a8";
const CREME = "#f5efd6";
const INK = "#3a2a18";
const STROKE: Record<string, string> = {
  Mali: "#d98a2b",
  "Burkina Faso": "#c0392b",
  Niger: "#2e9e6b",
};

// points geo (lon,lat)
const KIDAL: [number, number] = [1.41, 18.44]; // Nord Mali — base FR
const BAMAKO: [number, number] = [-8.0, 12.65]; // soldat FAMA
const LIBYE_SUD: [number, number] = [12.0, 22.0]; // depart contagion JNIM
const CENTRE_MALI: [number, number] = [-1.0, 15.8]; // arrivee JNIM

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const SahelJetonsDezoom16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flat = getSahelFlat();

  // ===== CAMERA : dezoom entre f120 et f300 (serre sur trio -> contexte regional) =====
  const cam = getDezoomCam(frame, flat, { start: 120, dur: 180 });
  const camT = `translate(${cam.tx},${cam.ty}) scale(${cam.scale})`;

  // les jetons vivent DANS le groupe camera (ils suivent le scale). Pour eviter qu'ils soient
  // demesures au zoom serre, on applique un facteur inverse partiel : taille ~ constante a l'ecran
  // MAIS on garde un peu de reaction a l'echelle (retour Aziz : "suivent l'echelle"). k = compromis.
  const jetonScale = (base: number) => base / Math.pow(cam.scale, 0.55);

  // ===== TRAJECTOIRE JNIM : Libye Sud -> centre Mali (contagion) entre f60 et f240 =====
  const pMove = interpolate(frame, [60, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eMove = easeInOut(pMove);
  const jnimLon = LIBYE_SUD[0] + (CENTRE_MALI[0] - LIBYE_SUD[0]) * eMove;
  const jnimLat = LIBYE_SUD[1] + (CENTRE_MALI[1] - LIBYE_SUD[1]) * eMove;
  const jnimPos = flat.project([jnimLon, jnimLat]);
  // trace de progression (ligne pointillee derriere le jeton)
  const trailStart = flat.project(LIBYE_SUD);

  // ===== apparitions (spring) =====
  const famaPop = spring({ frame: frame - 30, fps, config: { damping: 200, mass: 0.6 } });
  const jnimPop = spring({ frame: frame - 55, fps, config: { damping: 200, mass: 0.6 } });
  const basePop = spring({ frame: frame - 90, fps, config: { damping: 200, mass: 0.8 } });
  // la base FR s'ETEINT (depart Barkhane) : fade entre f320 et f360 — objet inerte => fade, pas glissement
  const baseFade = interpolate(frame, [320, 360], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const famaPos = flat.project(BAMAKO);
  const basePos = flat.project(KIDAL);

  // projette les points geo (dans l'espace projete de base ; le transform camera les deplace ensuite)
  // jeton en SVG <image> : ancre = bas-centre (les "pieds" sur le point geo).
  // pop = spring d'apparition (scale + opacity). Le tout vit dans le <g transform> camera.
  const jeton = (
    href: string,
    pos: [number, number],
    baseW: number,
    pop: number,
    opacity = 1
  ) => {
    const w = jetonScale(baseW);
    const h = w; // sprites ~carres
    const popScale = pop * 0.4 + 0.6;
    return (
      <g transform={`translate(${pos[0]},${pos[1]})`} opacity={pop * opacity}>
        {/* ombre portee au sol */}
        <ellipse cx={0} cy={h * 0.02} rx={w * 0.34} ry={w * 0.1} fill={INK} opacity={0.28} />
        {/* sprite ancre bas-centre, avec pop-scale autour de ce point d'ancrage */}
        <g transform={`scale(${popScale})`}>
          <image href={staticFile(href)} x={-w / 2} y={-h} width={w} height={h} preserveAspectRatio="xMidYMax meet" />
        </g>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ background: PARCH_BG }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* texture parchemin en fond (repond au "trop plat") */}
        <Img
          src={staticFile("_shared/sprites/warmap/paper-grain.png")}
          style={{ position: "absolute", width: W, height: H, opacity: 0.5, mixBlendMode: "multiply", objectFit: "cover" }}
        />

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g transform={camT}>
            {/* ocean de fond (rectangle large, pour donner l'assise) */}
            <rect x={-2000} y={-2000} width={6000} height={6000} fill={PARCH_BG} />

            {/* voisins (parchemin neutre) */}
            {flat.voisins.map((c, i) => (
              <path key={`v-${i}`} d={c.d} fill={LAND_VOISIN} stroke="#8a7c60" strokeWidth={0.8 / cam.scale} strokeOpacity={0.7} />
            ))}

            {/* trio : creme vide + contour colore */}
            {flat.trio.map((c, i) => (
              <path
                key={`t-${i}`}
                d={c.d}
                fill={CREME}
                stroke={STROKE[c.name] || INK}
                strokeWidth={3 / cam.scale}
                strokeLinejoin="round"
              />
            ))}

            {/* trace de la contagion JNIM (pointilles) */}
            <line
              x1={trailStart[0]}
              y1={trailStart[1]}
              x2={jnimPos[0]}
              y2={jnimPos[1]}
              stroke="#8b3a3a"
              strokeWidth={2.5 / cam.scale}
              strokeDasharray={`${8 / cam.scale} ${6 / cam.scale}`}
              opacity={0.7 * jnimPop}
            />

            {/* OBJET base FR iso (posee sur Kidal, s'eteint a la fin) */}
            {jeton("_shared/sprites/warmap/base-fr-td.png", basePos, 190, basePop, baseFade)}

            {/* JETON soldat FAMA (Bamako, ancre fixe) */}
            {jeton("_shared/sprites/warmap/jeton-fama.png", famaPos, 120, famaPop)}

            {/* JETON JNIM (bouge le long de la trajectoire) */}
            {jeton("_shared/sprites/warmap/fighter-jnim.png", jnimPos, 120, jnimPop)}
          </g>
        </svg>

        {/* legende bas — registre AES */}
        <div
          style={{
            position: "absolute",
            left: 60,
            bottom: 50,
            fontFamily: "'Archivo','Arial Narrow',sans-serif",
            color: INK,
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 4, color: "#6b5a3f", fontWeight: 700 }}>
            DEMO D3 · JETONS ANCRES + DEZOOM
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SahelJetonsDezoom16x9;

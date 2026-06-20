/**
 * PROTO CARTO — ZOOM SURFACE -> COUPE OFFSHORE (le geste que Finary ne peut pas faire)
 *
 * PRINCIPES repris du hook Senegal 32s (analyse validee Aziz) :
 *   1. DESSIN LENT  : chaque couche de la coupe se trace/monte lentement (surface, pente, fond, puits).
 *   2. COUCHES QUI S'AJOUTENT (jamais de cut) : carte vue-de-dessus -> bascule en COUPE verticale ->
 *      eau -> plateau continental -> pente -> fond marin -> plateforme -> puits -> reservoir -> 8M$.
 *      Un seul monde continu : la carte plate DEVIENT une coupe de profondeur. On n'a jamais coupe.
 *   3. DONNEE ANCREE : vraies cotes GTA (prof. eau ~2700m, ~120km au large, reservoir ~4500m sous le fond).
 *   4. ANTI-STATIQUE : houle de surface, respiration, particules de gaz qui remontent dans le puits.
 *   5. EPURE : peu de labels, ancres aux profondeurs reelles.
 *
 * Vraies coords GTA (lon,lat) = [-17.05, 15.9] ; transect depuis Dakar [-17.45, 14.69].
 * Profil geologiquement fidele (vraies cotes, trace stylise parchemin). GEBCO en V2 si valide.
 * Charte Souverain parchemin (couleurs EXACTES du hook existant).
 *
 * Sequence (~11s @30fps, 330f) :
 *   0-70    : carte Senegal parchemin vue de dessus, Dakar + point GTA offshore qui pulse au large
 *   70-120  : ZOOM vers le point offshore + un trait de coupe (A--B) apparait de la cote vers le large
 *   120-150 : BASCULE : la vue pivote/fond en COUPE verticale (la surface de mer s'etablit en haut)
 *   150-250 : la coupe se construit par couches LENTES : eau -> plateau -> pente -> fond -> plateforme -> puits
 *   250-300 : le reservoir gazier s'allume + particules remontent + 8M$/jour count-up
 *   300-330 : etat stable, respiration
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useTopology } from "../_shared/components/inserts/useTopology";

const W = 1920;
const H = 1080;

// Charte Souverain parchemin (couleurs EXACTES du hook)
const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const OCRE = "#e7bd78";
const OCRE_MID = "#d2ad66";
const OCRE_DARK = "#bf9442";
const NAVY = "#16213a";
const NAVY_DEEP = "#0d1424";
const SEA = "#3a5878"; // eau (navy desature)
const SEA_DEEP = "#22384f";
const ROCK = "#cbbd9a"; // socle sedimentaire (parchemin plus fonce)
const ROCK_DEEP = "#b3a47e";
const GAS = "#e09a3c"; // reservoir gazier (ocre chaud)
const GOLD = "#d8b25a";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;

// VRAIES coords
const GTA: [number, number] = [-17.05, 15.9];
const DAKAR: [number, number] = [-17.45, 14.69];

// --- GEOMETRIE DE LA COUPE (vraies cotes, repere px) ---
// axe X = distance a la cote (0 = trait de cote a gauche, ~150km a droite)
// axe Y = profondeur (surface mer en haut)
const CUT_LEFT = 230;   // x de la cote (gauche)
const CUT_RIGHT = 1730; // x du large (droite)
const SEA_LEVEL_Y = 300; // y de la surface de la mer
const SEAFLOOR_DEEP_Y = 760; // y du fond marin profond (~2700m -> echelle verticale comprimee)
const RESERVOIR_Y = 940; // y du reservoir (~4500m sous le fond)

// distance reelle -> x px (0..150 km)
const kmToX = (km: number) => CUT_LEFT + (km / 150) * (CUT_RIGHT - CUT_LEFT);
// GTA ~120 km au large
const GTA_KM = 120;
const GTA_X = kmToX(GTA_KM);

// profil du fond marin : plateau continental (~0-70km, peu profond ~120m) puis PENTE continentale
// (chute rapide vers 2700m), puis plaine. Points (km, profondeur_m).
const SEAFLOOR: [number, number][] = [
  [0, 0],      // trait de cote
  [12, 40],
  [55, 130],   // bord du plateau continental
  [72, 600],   // debut de la pente continentale (rupture de pente)
  [88, 1700],  // pente raide
  [105, 2500],
  [120, 2700], // GTA
  [150, 2850], // plaine abyssale
];
const depthToY = (m: number) => SEA_LEVEL_Y + (m / 2850) * (SEAFLOOR_DEEP_Y - SEA_LEVEL_Y);
const seafloorPath = () => {
  let d = `M ${kmToX(SEAFLOOR[0][0])} ${depthToY(SEAFLOOR[0][1])}`;
  for (let i = 1; i < SEAFLOOR.length; i++) {
    const [km, m] = SEAFLOOR[i];
    d += ` L ${kmToX(km)} ${depthToY(m)}`;
  }
  return d;
};
const SEAFLOOR_D = seafloorPath();
// polygone eau = au-dessus du fond, sous la surface
const seaPolygon = () => {
  let d = `M ${CUT_LEFT} ${SEA_LEVEL_Y} L ${CUT_RIGHT} ${SEA_LEVEL_Y}`;
  for (let i = SEAFLOOR.length - 1; i >= 0; i--) {
    const [km, m] = SEAFLOOR[i];
    d += ` L ${kmToX(km)} ${depthToY(m)}`;
  }
  return d + " Z";
};
const SEA_D = seaPolygon();
// polygone socle = sous le fond marin jusqu'en bas
const rockPolygon = () => {
  let d = `M ${CUT_LEFT} ${H}`;
  for (let i = 0; i < SEAFLOOR.length; i++) {
    const [km, m] = SEAFLOOR[i];
    d += ` L ${kmToX(km)} ${depthToY(m)}`;
  }
  return d + ` L ${CUT_RIGHT} ${H} Z`;
};
const ROCK_D = rockPolygon();

const seafloorYAt = (km: number) => {
  for (let i = 1; i < SEAFLOOR.length; i++) {
    if (km <= SEAFLOOR[i][0]) {
      const [k0, m0] = SEAFLOOR[i - 1];
      const [k1, m1] = SEAFLOOR[i];
      const t = (km - k0) / (k1 - k0);
      return depthToY(m0 + (m1 - m0) * t);
    }
  }
  return depthToY(SEAFLOOR[SEAFLOOR.length - 1][1]);
};
const GTA_FLOOR_Y = seafloorYAt(GTA_KM);

export const ProtoCarto_OffshoreCut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const mapData = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const sn = (fc.features as any[]).find((f) => f.properties?.name === "Senegal");
    // projection cadree sur le Senegal (vue de dessus)
    const projection = geoMercator().fitExtent([[W * 0.28, H * 0.2], [W * 0.72, H * 0.8]], sn);
    const path = geoPath(projection);
    return { sn, projection, path, snD: path(sn) || "" };
  }, [topo]);

  if (!topo || !mapData) return <AbsoluteFill style={{ background: PARCH }} />;
  const { projection, snD } = mapData;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => 40 + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => 28 + i * GRID_STEP);

  // anti-statique
  const introFade = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ===== PHASE 1 : carte vue de dessus =====
  const gtaPx = projection(GTA);
  const dakarPx = projection(DAKAR);
  const mapDrawProg = interpolate(frame, [8, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gtaPulse = 0.5 + 0.5 * Math.sin(frame * 0.16);
  const gtaAppear = interpolate(frame, [40, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // trait de coupe A--B (cote -> large) qui se trace en phase 1 fin
  const cutLineProg = interpolate(frame, [78, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ===== BASCULE vue-de-dessus -> coupe (120-150) =====
  // la carte du dessus fond, la coupe apparait. On croise les deux opacites.
  const mapOut = interpolate(frame, [118, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cutIn = interpolate(frame, [126, 156], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ===== PHASE COUPE : couches lentes (150+) =====
  // surface de mer
  const surfaceProg = interpolate(frame, [150, 176], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // eau qui se remplit (wipe haut->bas)
  const waterProg = interpolate(frame, [162, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fond marin qui se trace (gauche->droite = cote vers large) — REVELE la pente continentale
  const floorProg = interpolate(frame, [176, 226], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // socle sedimentaire qui se remplit sous le fond
  const rockProg = interpolate(frame, [206, 244], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // plateforme en surface (descend a sa place)
  const rigProg = spring({ fps, frame: Math.max(0, frame - 230), config: { damping: 14, stiffness: 80 } });
  // puits qui descend de la plateforme jusqu'au reservoir
  const wellProg = interpolate(frame, [244, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // reservoir gazier qui s'allume
  const resvProg = interpolate(frame, [276, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // count-up 8M$/jour (remonte le long du puits)
  const countT = interpolate(frame, [284, 322], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - countT, 3);
  const amount = Math.round((eased * 8_000_000) / 1000) * 1000;
  const amountStr = amount.toLocaleString("fr-FR").replace(/ | /g, " ") + " $";
  const countOp = interpolate(frame, [282, 298], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // houle de surface (anti-statique)
  const wavePath = (phase: number, amp: number) => {
    let d = `M ${CUT_LEFT} ${SEA_LEVEL_Y}`;
    for (let x = CUT_LEFT; x <= CUT_RIGHT; x += 24) {
      const y = SEA_LEVEL_Y + Math.sin((x * 0.02) + phase) * amp;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  // clip eau (wipe haut->bas)
  const waterClipH = (SEAFLOOR_DEEP_Y + 60 - SEA_LEVEL_Y) * waterProg;

  // particules de gaz qui remontent dans le puits (250+)
  const wellTopY = depthToY(0) - 60; // plateforme
  const wellX = GTA_X;
  const gasParticles = Array.from({ length: 10 }, (_, i) => {
    const seed = random(`gas${i}`);
    const cycle = ((frame - 250 - i * 8) % 70) / 70;
    if (cycle < 0 || resvProg < 0.3) return null;
    const y = interpolate(cycle, [0, 1], [RESERVOIR_Y, wellTopY]);
    const op = interpolate(cycle, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0]);
    return { x: wellX + (seed - 0.5) * 10, y, op, r: 2 + seed * 2 };
  });

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: introFade }}>
        <defs>
          <linearGradient id="ocreFillO" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor={OCRE} /><stop offset="55%" stopColor={OCRE_MID} /><stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="seaGradO" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SEA} /><stop offset="100%" stopColor={SEA_DEEP} />
          </linearGradient>
          <linearGradient id="rockGradO" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ROCK} /><stop offset="100%" stopColor={ROCK_DEEP} />
          </linearGradient>
          <radialGradient id="gasGradO" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={GAS} /><stop offset="100%" stopColor={OCRE_DARK} />
          </radialGradient>
          <filter id="paperTexO">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <clipPath id="waterClip"><rect x={CUT_LEFT - 4} y={SEA_LEVEL_Y} width={CUT_RIGHT - CUT_LEFT + 8} height={Math.max(0, waterClipH)} /></clipPath>
          <filter id="grainO">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
          </filter>
        </defs>

        {/* fond papier + grille (commun aux deux phases) */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexO)" opacity={0.5} />
        <g stroke={GRID} strokeWidth={1.6} opacity={0.55}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* ===== PHASE 1 : CARTE VUE DE DESSUS ===== */}
        {mapOut > 0.01 && (
          <g opacity={mapOut}>
            <path d={snD} fill="url(#ocreFillO)" opacity={0.92} />
            <path
              d={snD}
              fill="none"
              stroke={NAVY}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeDasharray={4000}
              strokeDashoffset={4000 * (1 - mapDrawProg)}
            />
            {/* Dakar */}
            {dakarPx && (
              <g opacity={gtaAppear}>
                <circle cx={dakarPx[0]} cy={dakarPx[1]} r={5} fill={NAVY} />
              </g>
            )}
            {/* point GTA offshore qui pulse */}
            {gtaPx && (
              <g opacity={gtaAppear}>
                <circle cx={gtaPx[0]} cy={gtaPx[1]} r={8 + 22 * gtaPulse} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.5 * (1 - gtaPulse)} />
                <circle cx={gtaPx[0]} cy={gtaPx[1]} r={7} fill={GOLD} />
                <circle cx={gtaPx[0]} cy={gtaPx[1]} r={3} fill={PARCH} />
              </g>
            )}
            {/* trait de coupe A--B (de la cote vers le large) */}
            {gtaPx && dakarPx && cutLineProg > 0 && (
              <g opacity={cutLineProg}>
                <line
                  x1={dakarPx[0]} y1={dakarPx[1]}
                  x2={dakarPx[0] + (gtaPx[0] - dakarPx[0]) * 1.25}
                  y2={dakarPx[1] + (gtaPx[1] - dakarPx[1]) * 1.25}
                  stroke={NAVY} strokeWidth={2} strokeDasharray="8 6"
                />
                <text x={dakarPx[0] - 10} y={dakarPx[1] - 12} fontFamily={SANS} fontSize={26} fontWeight={700} fill={NAVY}>A</text>
                <text x={gtaPx[0] + 30} y={gtaPx[1] + 8} fontFamily={SANS} fontSize={26} fontWeight={700} fill={NAVY}>B</text>
              </g>
            )}
          </g>
        )}

        {/* ===== PHASE COUPE ===== */}
        {cutIn > 0.01 && (
          <g opacity={cutIn}>
            {/* SOCLE sedimentaire (sous le fond) */}
            {rockProg > 0 && <path d={ROCK_D} fill="url(#rockGradO)" opacity={rockProg} />}

            {/* EAU (wipe haut->bas via clip) */}
            <g clipPath="url(#waterClip)">
              <path d={SEA_D} fill="url(#seaGradO)" opacity={0.92} />
            </g>

            {/* surface de la mer (houle, anti-statique) */}
            {surfaceProg > 0 && (
              <>
                <path d={wavePath(frame * 0.05, 4)} fill="none" stroke={SEA} strokeWidth={3} opacity={surfaceProg * 0.9} />
                <path d={wavePath(frame * 0.05 + 1.5, 2.5)} fill="none" stroke="#5b7a9a" strokeWidth={1.5} opacity={surfaceProg * 0.6} />
              </>
            )}

            {/* FOND MARIN qui se trace (gauche->droite) — la pente continentale */}
            <path
              d={SEAFLOOR_D}
              fill="none"
              stroke={NAVY}
              strokeWidth={3.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={2600}
              strokeDashoffset={2600 * (1 - floorProg)}
            />

            {/* RESERVOIR gazier (poche ocre chaud dans le socle, sous GTA) */}
            {resvProg > 0.01 && (
              <g opacity={resvProg}>
                <ellipse cx={GTA_X} cy={RESERVOIR_Y} rx={130} ry={36} fill="url(#gasGradO)" opacity={0.85} />
                <ellipse cx={GTA_X} cy={RESERVOIR_Y} rx={130} ry={36} fill="none" stroke={GAS} strokeWidth={2} opacity={0.6} />
              </g>
            )}

            {/* PUITS (de la plateforme au reservoir) */}
            {wellProg > 0 && (
              <line
                x1={GTA_X} y1={GTA_FLOOR_Y}
                x2={GTA_X} y2={GTA_FLOOR_Y + (RESERVOIR_Y - GTA_FLOOR_Y) * wellProg}
                stroke={NAVY} strokeWidth={3.5}
              />
            )}
            {/* riser : plateforme -> fond marin */}
            {rigProg > 0.1 && (
              <line x1={GTA_X} y1={wellTopY} x2={GTA_X} y2={GTA_FLOOR_Y} stroke={NAVY} strokeWidth={2.5} opacity={rigProg} strokeDasharray="6 5" />
            )}

            {/* particules de gaz qui remontent */}
            {gasParticles.map((p, i) => p && p.op > 0.01 ? (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={GAS} opacity={p.op} />
            ) : null)}

            {/* PLATEFORME (en surface, au-dessus de GTA) */}
            {rigProg > 0.05 && (
              <g opacity={Math.min(1, rigProg)} transform={`translate(${GTA_X}, ${wellTopY})`}>
                <rect x={-34} y={-26} width={68} height={20} fill={NAVY} />
                <line x1={-26} y1={-6} x2={-34} y2={26} stroke={NAVY} strokeWidth={3} />
                <line x1={26} y1={-6} x2={34} y2={26} stroke={NAVY} strokeWidth={3} />
                <line x1={0} y1={-26} x2={0} y2={-58} stroke={NAVY} strokeWidth={3} />
                <path d={`M -12 -58 L 0 -78 L 12 -58 Z`} fill={NAVY} />
              </g>
            )}

            {/* ECHELLE de profondeur (axe Y discret, ancre aux vraies cotes) */}
            {floorProg > 0.5 && (
              <g opacity={interpolate(floorProg, [0.5, 1], [0, 0.8])} fontFamily={SANS} fontSize={18} fill={NAVY}>
                <text x={CUT_LEFT - 80} y={depthToY(130) + 5}>200 m</text>
                <text x={CUT_LEFT - 90} y={depthToY(2700) + 5}>2 700 m</text>
                <line x1={CUT_LEFT - 16} y1={SEA_LEVEL_Y} x2={CUT_LEFT - 16} y2={depthToY(2850)} stroke={NAVY} strokeWidth={1} opacity={0.4} />
              </g>
            )}
          </g>
        )}

        {/* grain papier global */}
        <rect width={W} height={H} filter="url(#grainO)" opacity={0.8} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* COMPTEUR 8M$/jour — remonte du puits (ancre au gisement) */}
      {countOp > 0 && (
        <div style={{ position: "absolute", left: GTA_X, top: SEA_LEVEL_Y - 150, transform: "translate(-50%,-50%)", opacity: countOp, textAlign: "center", pointerEvents: "none", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: NUM, fontSize: 88, color: NAVY, lineHeight: 1, textShadow: "0 2px 0 rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>{amountStr}</div>
          <div style={{ fontFamily: SANS, fontSize: 20, letterSpacing: 3, color: OCRE_DARK, marginTop: 4, textTransform: "uppercase" }}>par jour · gisement GTA</div>
        </div>
      )}

      {/* LABEL coupe (apparait a la bascule) */}
      {(() => {
        const op = interpolate(frame, [150, 172], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0) return null;
        return (
          <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: op }}>
            <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 6, color: NAVY, textTransform: "uppercase", opacity: 0.7 }}>
              Coupe · marge continentale sénégalaise
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

export default ProtoCarto_OffshoreCut;

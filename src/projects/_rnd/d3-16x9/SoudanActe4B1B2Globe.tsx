// ACTE 4 — BEATS 1-2 "Le retournement russe" + "La base navale" — GLOBE D3 (16:9).
//
// Refonte des beats-carte de l'Acte 4 (actuellement Mapbox plat, en-dessous du niveau des autres
// actes) en GLOBE D3, pour homogeneiser avec les Actes 3/5/6 (deja tous en globe). Modele exact de
// structure/palette/camera : SoudanActe4B6Globe.tsx (Beat 6, deja valide Aziz).
//
// BEAT 1 "Le retournement russe" (audio p1, ~24.85s) : Moscou (nord) entre en scene. Un flux ANCIEN
// Moscou -> jeton RSF (halo rouge, Darfour) S'ESTOMPE (Wagner armait les paramilitaires contre de
// l'or, debut du conflit) PUIS en 2024 un flux NET Moscou -> jeton SAF (halo bleu, Khartoum) apparait
// = la bascule (l'aide russe va desormais a l'armee reguliere).
//
// BEAT 2 "La base navale" (audio p2, ~22.14s) : Port-Soudan (mer Rouge) pulse fort. Une icone base
// navale sobre apparait et reste. Plaques factuelles SEQUENTIELLES et SOBRES (pas de compteur qui
// defile — registre diplomatique serieux) : 25 ans, 300 soldats russes, 4 navires, propulsion
// nucleaire, PAS encore signe.
//
// Camera CONTINUE B1->B2 (jamais de coupe sur le globe) : B1 demarre resserre Soudan/Darfour (raccord
// depuis fin Acte 3), dezoome pour cadrer Moscou+Soudan ensemble, B2 resserre sur Port-Soudan/mer
// Rouge et finit sur un plan mer Rouge/Soudan (le B3 suivant est un schema D3-force abstrait, fade
// acceptable — pas de raccord globe direct requis).
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  featureByName,
  orthoAt,
  pathOf,
  isVisible as isVisibleGeo,
} from "./globeGeo";
import { GEO, windingPathD, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill, Medallion, RSF_RED, SAF_BLUE } from "./SoudanActe3GlobeProto16x9";
import { BEAT1, BEAT2 } from "../../warmap/soudan-acte4/soudanActe4Timing";

const t = THEMES.mixte;
const FPS = 30;

// --- Duree totale : B1 (audio p1) + B2 (audio p2), zero silence de jonction (cf timing.ts) --------
// BEAT1/BEAT2 sont des ancrages ABSOLUS (frame 0 = debut FULL acte). On les relocalise en LOCAL a
// cette compo (B1 demarre a 0). B1_FRAMES = duree exacte du beat 1 ; le beat 2 s'enchaine ensuite.
const B1_START = BEAT1.start; // = 0 (PART_OFFSETS.p1 = 0)
const B1_END = BEAT1.end; // fin p1 (~24.74s -> 742f)
const B1_FRAMES = B1_END - B1_START;

const B2_START_ABS = BEAT2.start; // = PART_OFFSETS.p2 (745)
const B2_END_ABS = BEAT2.end; // fin p2 (~22.14s apres start -> 664f de duree)
const B2_FRAMES = B2_END_ABS - B2_START_ABS;

// Petite queue de raccord vers B3 (schema D3-force, fade acceptable) — meme logique que B6 (+18f).
const TAIL = 18;

export const ACTE4_B1B2_FRAMES = B1_FRAMES + B2_FRAMES + TAIL;

// Frame locale a cette compo ou B2 commence (apres B1 complet).
const B2_LOCAL_START = B1_FRAMES;

// --- Jalons BEAT 1, relatifs au debut du beat (= debut audio p1) -----------------------------------
const T1 = {
  start: 0,
  troisiemePays: BEAT1.troisiemePays - B1_START, // "troisieme pays" — Moscou entre en scene
  changeDeCamp: BEAT1.changeDeCamp - B1_START,
  wagnerArmait: BEAT1.wagnerArmait - B1_START, // flux RSF (ancien) commence a s'estomper
  volteFace2024: BEAT1.volteFace2024 - B1_START, // flux SAF net apparait
  end: B1_FRAMES,
};

// --- Jalons BEAT 2, relatifs au debut du beat 2 (= debut audio p2) ---------------------------------
const T2 = {
  start: 0,
  portSoudanNomme: BEAT2.portSoudanNomme - B2_START_ABS,
  vingtCinqAns: BEAT2.vingtCinqAns - B2_START_ABS,
  troisCentsSoldats: BEAT2.troisCentsSoldats - B2_START_ABS,
  quatreNavires: BEAT2.quatreNavires - B2_START_ABS,
  propulsionNucleaire: BEAT2.propulsionNucleaire - B2_START_ABS,
  soudanPasSigne: BEAT2.soudanPasSigne - B2_START_ABS,
  end: B2_FRAMES,
};

const MOSCOU: LonLat = GEO.moscou;
const RSF_TOKEN: LonLat = GEO.rsfToken; // Darfour — flux ancien Wagner<->or
const SAF_TOKEN: LonLat = GEO.safToken; // Khartoum/vallee du Nil — flux 2024 armee reguliere
const PORT_SOUDAN: LonLat = GEO.portSoudan;

// --- Camera CONTINUE sur toute la duree (B1 puis B2), meme discipline que buildActe4B6Cam --------
function buildB1B2Cam(): CamKey[] {
  return [
    // B1 ENTREE : raccord depuis fin Acte 3 (Soudan/Darfour resserre, Section1 finit tres zoome).
    { frame: 0, lon: 28, lat: 16, scaleMul: 3.6 },
    // "troisieme pays" : on commence a s'ouvrir pour laisser entrer Moscou au nord.
    { frame: T1.troisiemePays, lon: 30, lat: 22, scaleMul: 2.6 },
    // "vient de changer de camp" : DEZOOM pour cadrer Moscou (nord lointain) ET le Soudan ensemble.
    { frame: T1.changeDeCamp, lon: 33, lat: 34, scaleMul: 1.55 },
    // "Wagner armaient" : on tient large — le flux ancien RSF se lit en entier (Moscou->Darfour).
    { frame: T1.wagnerArmait, lon: 33, lat: 34, scaleMul: 1.5 },
    // "2024, volte-face" : leger recentrage vers Khartoum (le flux SAF net se lit clairement).
    { frame: T1.volteFace2024, lon: 34, lat: 28, scaleMul: 1.6 },
    // FIN B1 : commence a redescendre vers la mer Rouge (prepare B2).
    { frame: T1.end, lon: 35, lat: 24, scaleMul: 1.75 },

    // B2 (frames locales decalees de B2_LOCAL_START) — RESSERRE sur Port-Soudan/mer Rouge.
    { frame: B2_LOCAL_START + T2.start, lon: 35, lat: 24, scaleMul: 1.75 },
    { frame: B2_LOCAL_START + T2.portSoudanNomme, lon: 36.5, lat: 21, scaleMul: 2.6 }, // pulse fort Port-Soudan
    { frame: B2_LOCAL_START + T2.vingtCinqAns, lon: 37, lat: 20, scaleMul: 2.9 },
    { frame: B2_LOCAL_START + T2.quatreNavires, lon: 37, lat: 20, scaleMul: 2.95 }, // tient serre pour les plaques
    { frame: B2_LOCAL_START + T2.soudanPasSigne, lon: 36, lat: 20, scaleMul: 2.8 },
    // FIN B2 : plan mer Rouge/Soudan stable (B3 = schema D3-force abstrait, fade acceptable).
    { frame: ACTE4_B1B2_FRAMES, lon: 35.5, lat: 20.5, scaleMul: 2.75 },
  ];
}

const CAM = buildB1B2Cam();

// --- Plaque factuelle sobre (Beat 2) — apparait en fondu, TIENT, puis cede la place a la suivante.
// Registre diplomatique serieux : pas de compteur qui defile (regle explicite du brief).
const FactPlate: React.FC<{ frame: number; appearF: number; label: string; value: string; index: number }> = ({
  frame,
  appearF,
  label,
  value,
  index,
}) => {
  const op = interpolate(frame, [appearF, appearF + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.01) return null;
  const y = 150 + index * 64;
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: y,
        opacity: op,
        transform: `translateX(${interpolate(op, [0, 1], [-16, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 15,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: t.legendSur,
          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 30,
          fontWeight: 700,
          color: t.labelFill,
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
        }}
      >
        {value}
      </div>
    </div>
  );
};

// --- Icone base navale sobre (ancre stylisee) — apparait a Port-Soudan et RESTE (pas d'animation
// de repetition, juste une presence stable qui ancre le sujet).
const NavalBaseIcon: React.FC<{ x: number; y: number; reveal: number; pulse: number }> = ({ x, y, reveal, pulse }) => {
  if (reveal <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={reveal}>
      {pulse > 0 && <circle r={10 + 30 * pulse} fill={t.flowMetal} opacity={0.3 * (1 - pulse)} />}
      <circle r={16} fill="rgba(10,16,24,0.72)" stroke={t.flowMetal} strokeWidth={2} />
      {/* ancre simplifiee, trait unique — sobre */}
      <g stroke={t.labelFill} strokeWidth={2} fill="none" strokeLinecap="round">
        <circle cx={0} cy={-6} r={2.6} fill={t.labelFill} stroke="none" />
        <line x1={0} y1={-3.5} x2={0} y2={7} />
        <path d="M -6 3 Q 0 11 6 3" />
        <line x1={-5} y1={-1} x2={5} y2={-1} />
      </g>
    </g>
  );
};

export const SoudanActe4B1B2Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(() => orthoAt(rotLambda, rotLat).scale(globeR), [rotLambda, rotLat, globeR]);
  const path = useMemo(() => pathOf(proj), [proj]);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const russiaFeature = useMemo(() => featureByName("Russia"), []);

  const cx = W / 2;
  const cy = H / 2;

  // --- BEAT 1 : reveal Russie (drapeau) + flux RSF (ancien, s'estompe) + flux SAF (net, 2024) -----
  const b1Local = frame; // B1 occupe frame 0..B1_FRAMES
  const inB1 = b1Local < B1_FRAMES;

  // Russie se remplit de son drapeau des "troisieme pays".
  const russiaReveal = interpolate(b1Local, [T1.troisiemePays, T1.troisiemePays + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flux ANCIEN Moscou->RSF : apparait a "wagnerArmait", puis S'ESTOMPE progressivement (trait qui
  // s'eteint = l'ancienne alliance qui meurt) — reveal monte vite puis l'opacite retombe.
  const rsfFlowProg = interpolate(b1Local, [T1.wagnerArmait, T1.wagnerArmait + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rsfFlowFade = interpolate(
    b1Local,
    [T1.wagnerArmait + 40, T1.volteFace2024 + 10, T1.end],
    [1, 0.35, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Flux NET Moscou->SAF : apparait a "volteFace2024", monte et TIENT (la bascule qui s'installe).
  const safFlowProg = interpolate(b1Local, [T1.volteFace2024, T1.volteFace2024 + 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const safFlowOp = interpolate(b1Local, [T1.volteFace2024, T1.volteFace2024 + 20], [0, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rsfPulse = interpolate(b1Local, [T1.wagnerArmait + 30, T1.wagnerArmait + 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const safPulse = interpolate(b1Local, [T1.volteFace2024 + 34, T1.volteFace2024 + 74], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const medallionScale = interpolate(b1Local, [T1.wagnerArmait, T1.wagnerArmait + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const safMedallionScale = interpolate(b1Local, [T1.volteFace2024, T1.volteFace2024 + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Fondu de sortie des jetons/flux B1 sur les 20 dernieres frames du beat (raccord propre vers B2).
  const b1ExitFade = interpolate(b1Local, [T1.end - 20, T1.end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- BEAT 2 : Port-Soudan pulse + icone base navale + plaques factuelles sequentielles -----------
  const b2Local = frame - B2_LOCAL_START; // negatif avant B2, 0..B2_FRAMES pendant B2
  const portSoudanReveal = interpolate(b2Local, [T2.portSoudanNomme, T2.portSoudanNomme + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const portSoudanPulse = interpolate(b2Local, [T2.portSoudanNomme, T2.portSoudanNomme + 40], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pPortSoudan = projectPoint(proj, PORT_SOUDAN, visible);
  const pMoscou = projectPoint(proj, MOSCOU, visible);
  const pRSF = projectPoint(proj, RSF_TOKEN, visible);
  const pSAF = projectPoint(proj, SAF_TOKEN, visible);

  // Terminateur nuit (discret), meme logique que B6 : derive lente sur toute la duree.
  const sunLon = interpolate(frame, [0, ACTE4_B1B2_FRAMES], [55, 20]);
  const nightCenter: LonLat = [sunLon + 180, -15];
  const nightPt = visible(nightCenter) ? proj(nightCenter) : null;

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <Sequence from={0} durationInFrames={B1_FRAMES} premountFor={FPS}>
        <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p1.mp3")} />
      </Sequence>
      <Sequence from={B2_LOCAL_START} durationInFrames={B2_FRAMES + TAIL} premountFor={FPS}>
        <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p2.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${t.oceanOuter} 0%, ${t.bg} 78%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="a4b1ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="a4b1atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="a4b1night" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04060d" stopOpacity={0.55} />
            <stop offset="70%" stopColor="#04060d" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#04060d" stopOpacity={0} />
          </radialGradient>
          <clipPath id="a4b1clip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="a4b1glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#a4b1atmo)" />
        <circle cx={cx} cy={cy} r={globeR} fill="url(#a4b1ocean)" />

        <g clipPath="url(#a4b1clip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={t.grat} strokeWidth={0.6} opacity={t.gratOpacity} />

          {features.map((f, i) => {
            const isSudan = f.properties.name === "Sudan" || f.properties.name === "S. Sudan";
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={isSudan ? t.sudanFill : t.land}
                stroke={isSudan ? t.sudanStroke : t.landStroke}
                strokeWidth={isSudan ? 0.9 : t.borderWidth}
                strokeOpacity={t.borderOpacity}
              />
            );
          })}

          {nightPt && <circle cx={nightPt[0]} cy={nightPt[1]} r={globeR * 1.05} fill="url(#a4b1night)" />}

          {/* Russie se remplit de son drapeau (GlobeFlagFill) — le "troisieme pays" entre en scene. */}
          {russiaFeature && russiaReveal > 0.01 && (
            <GlobeFlagFill
              feature={russiaFeature}
              proj={proj}
              path={path}
              flagCode="ru"
              reveal={russiaReveal}
              glow="#c74d4d"
            />
          )}

          {/* FLUX ANCIEN Moscou -> RSF (Wagner armait, s'estompe) */}
          {inB1 && rsfFlowProg > 0.01 && (
            <path
              d={windingPathD(proj, path, MOSCOU, RSF_TOKEN, rsfFlowProg, -2.2, 1)}
              fill="none"
              stroke={RSF_RED}
              strokeWidth={3.2}
              strokeOpacity={0.85 * rsfFlowFade * b1ExitFade}
              strokeLinecap="round"
              strokeDasharray={rsfFlowFade < 0.5 ? "5 7" : undefined}
            />
          )}

          {/* FLUX NET Moscou -> SAF (2024, volte-face, tient) */}
          {inB1 && safFlowProg > 0.01 && (
            <path
              d={windingPathD(proj, path, MOSCOU, SAF_TOKEN, safFlowProg, 1.8, 1)}
              fill="none"
              stroke={SAF_BLUE}
              strokeWidth={3.6}
              strokeOpacity={safFlowOp * b1ExitFade}
              strokeLinecap="round"
            />
          )}

          {/* Jetons RSF/SAF (medaillons) a l'arrivee des flux — SCENE B1 uniquement (le focus B2 est
              Port-Soudan ; on efface les jetons en fondu sur les dernieres frames de B1 pour ne pas
              polluer visuellement le plan Port-Soudan). */}
          {inB1 && pRSF && medallionScale > 0.01 && (
            <Medallion x={pRSF.x} y={pRSF.y} color={RSF_RED} label="R" scale={medallionScale * Math.max(0.4, rsfFlowFade) * b1ExitFade} pulse={rsfPulse} t={t as any} />
          )}
          {inB1 && pSAF && safMedallionScale > 0.01 && (
            <Medallion x={pSAF.x} y={pSAF.y} color={SAF_BLUE} label="S" scale={safMedallionScale * b1ExitFade} pulse={safPulse} t={t as any} />
          )}

          {/* Label Moscou */}
          {pMoscou && russiaReveal > 0.01 && (
            <text
              x={pMoscou.x}
              y={pMoscou.y - 20}
              fill={t.labelFill}
              fontSize={22}
              fontFamily="Georgia, serif"
              fontWeight={700}
              textAnchor="middle"
              stroke={t.labelStroke}
              strokeWidth={0.6}
              opacity={russiaReveal}
            >
              Moscou
            </text>
          )}

          {/* BEAT 2 : Port-Soudan pulse fort + icone base navale (reste) */}
          {pPortSoudan && portSoudanReveal > 0.01 && (
            <>
              <NavalBaseIcon x={pPortSoudan.x} y={pPortSoudan.y} reveal={portSoudanReveal} pulse={portSoudanPulse} />
              <text
                x={pPortSoudan.x}
                y={pPortSoudan.y + 34}
                fill={t.labelFill}
                fontSize={22}
                fontFamily="Georgia, serif"
                fontWeight={700}
                textAnchor="middle"
                stroke={t.labelStroke}
                strokeWidth={1.1}
                paintOrder="stroke"
                opacity={portSoudanReveal}
              >
                Port-Soudan
              </text>
            </>
          )}
        </g>

        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* Plaques factuelles sequentielles (Beat 2) — sobres, en fondu, PAS de compteur qui defile. */}
      {!inB1 && (
        <>
          <FactPlate frame={b2Local} appearF={T2.vingtCinqAns} label="Duree de l'accord" value="25 ans" index={0} />
          <FactPlate frame={b2Local} appearF={T2.troisCentsSoldats} label="Personnel militaire" value="300 soldats russes" index={1} />
          <FactPlate frame={b2Local} appearF={T2.quatreNavires} label="Flotte" value="4 navires de guerre" index={2} />
          <FactPlate frame={b2Local} appearF={T2.propulsionNucleaire} label="Propulsion" value="Nucleaire (certains navires)" index={3} />
          <FactPlate frame={b2Local} appearF={T2.soudanPasSigne} label="Statut" value="Accord PAS encore signe" index={4} />
        </>
      )}
    </AbsoluteFill>
  );
};

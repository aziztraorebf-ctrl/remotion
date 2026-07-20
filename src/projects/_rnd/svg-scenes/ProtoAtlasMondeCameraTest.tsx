import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  staticFile,
  continueRender,
  delayRender,
  cancelRender,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadSourceSans } from "@remotion/google-fonts/SourceSans3";

const { fontFamily: cinzel } = loadFont();
const { fontFamily: sourceSans } = loadSourceSans();

// Test caméra sur la direction "Palimpseste Mondial" — reproduit le vocabulaire
// caméra Mapbox du projet (memory/doctrines/DOCTRINE-SOUVERAIN.md §3.4/3.5) :
// Dolly In (zoom progressif 100-300f), Whip Pan (translation rapide 60f + blur
// CSS 12-16px pic a mi-course), Pull Back Reveal (zoom out rapide 60f).
// Sequence 1 (0-150f)   : vue monde -> Dolly In sur le Ghana, isolation par
//                         assombrissement/desaturation du reste (contexte garde).
// Sequence 2 (150-270f) : Whip Pan vers le Nigeria, isolation par disparition
//                         totale du reste (look epure/infographique).
// Sequence 3 (270-360f) : Pull Back Reveal retour vue monde.
// Resolution : Natural Earth 110m assumee telle quelle (pas de swap 50m), pour
// juger si le style low-poly choque a l'oeil au zoom serre sur un seul pays.

export const PROTO_ATLAS_MONDE_CAMERA_TEST_FRAMES = 360;

const COLORS = {
  ocean: "#C8D7DC",
  oceanLight: "#D7E2E4",
  oceanDark: "#B8CAD1",
  restDuMonde: "#C3BDAF",
  afriqueBase: "#9E4F2E",
  afriqueMid: "#C46A35",
  afriqueEdge: "#DFA34A",
  encre: "#3A2A18",
  fontiereMonde: "#8B8172",
  cream: "#F2E5C8",
  ghanaHighlight: "#D9C9A8",
  nigeriaHighlight: "#DFA34A",
};

// Centroides/bounds precalcules via d3-geo (memes bornes fitExtent que
// scripts/atlas/precompute-atlas-monde-palimpseste.mjs — voir commentaire
// dans ce script pour la commande de recalcul si le fitExtent change).
const GHANA_CENTER = { x: 888.4, y: 479.2 };
const GHANA_ID = "288";
const NIGERIA_CENTER = { x: 939.1, y: 467.3 };
const NIGERIA_ID = "566";

type GeoCountry = { id: string; name: string; isAfrica: boolean; d: string };
type MapData = { width: number; height: number; sphereD: string; countries: GeoCountry[] };

export const ProtoAtlasMondeCameraTest: React.FC = () => {
  const frame = useCurrentFrame();
  const [mapData, setMapData] = useState<MapData | null>(null);

  useEffect(() => {
    const handle = delayRender("Loading world-equalearth-africa-focus.json");
    fetch(staticFile("_shared/geo-data/world/world-equalearth-africa-focus.json"))
      .then((r) => r.json())
      .then((data: MapData) => {
        setMapData(data);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, []);

  if (!mapData) {
    return <AbsoluteFill style={{ background: COLORS.ocean }} />;
  }

  const W = mapData.width;
  const H = mapData.height;
  const centerX = W / 2;
  const centerY = H / 2;

  // NOTE : le transform SVG est applique en "translate(tx ty) scale(s)" — le
  // scale s'applique EN PREMIER (au sens matriciel, sur les coordonnees du
  // contenu), donc pour garder un point (px,py) centre a l'ecran quel que soit
  // le zoom courant, il faut tx = centerX - px*scale (pas centerX - px).
  const focusTx = (px: number, s: number) => centerX - px * s;
  const focusTy = (py: number, s: number) => centerY - py * s;

  // ─── SEQUENCE 1 : Dolly In sur Ghana, isolation par assombrissement (0-150f) ───
  const dollyProgress = interpolate(frame, [0, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dollyScale = interpolate(dollyProgress, [0, 1], [1, 14]);
  const dollyTx = focusTx(GHANA_CENTER.x, dollyScale);
  const dollyTy = focusTy(GHANA_CENTER.y, dollyScale);
  const dimRestOpacity = interpolate(frame, [60, 130], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── SEQUENCE 2 : Whip Pan vers Nigeria, isolation totale (150-270f) ───
  // Whip Pan = 60f actives (memes bornes que Mapbox), blur CSS pic a mi-course.
  const whipStart = 150;
  const whipProgress = interpolate(frame, [whipStart, whipStart + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Depart : etat final sequence 1 (zoom Ghana). Arrivee : zoom Nigeria plus serre.
  // Interpolation du point focal EN ESPACE CARTE (pas en tx/ty ecran deja
  // transformes), puis recalcul de tx/ty au scale courant a chaque frame —
  // sinon le point cible derive hors-centre a mi-course.
  const whipScale = interpolate(whipProgress, [0, 1], [14, 26]);
  const whipFocusX = interpolate(whipProgress, [0, 1], [GHANA_CENTER.x, NIGERIA_CENTER.x]);
  const whipFocusY = interpolate(whipProgress, [0, 1], [GHANA_CENTER.y, NIGERIA_CENTER.y]);
  const whipTx = focusTx(whipFocusX, whipScale);
  const whipTy = focusTy(whipFocusY, whipScale);
  // Blur CSS : pic 14px a mi-course (frame 30 du whip de 60f), dissipe avant la fin.
  const whipLocalFrame = frame - whipStart;
  const blurPx =
    whipLocalFrame >= 0 && whipLocalFrame <= 60
      ? interpolate(whipLocalFrame, [0, 30, 60], [0, 14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  const restHiddenOpacity = interpolate(frame, [whipStart + 20, whipStart + 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── SEQUENCE 3 : Pull Back Reveal retour vue monde (270-330f, 60f actives) ───
  const pullBackStart = 270;
  const pullBackProgress = interpolate(frame, [pullBackStart, pullBackStart + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pullBackScale = interpolate(pullBackProgress, [0, 1], [26, 1]);
  // Retour vers le centre de la vue monde (scale 1 => tx/ty = 0,0 par definition).
  const pullBackFocusX = interpolate(pullBackProgress, [0, 1], [NIGERIA_CENTER.x, centerX]);
  const pullBackFocusY = interpolate(pullBackProgress, [0, 1], [NIGERIA_CENTER.y, centerY]);
  const pullBackTx = focusTx(pullBackFocusX, pullBackScale);
  const pullBackTy = focusTy(pullBackFocusY, pullBackScale);
  const restReappearOpacity = interpolate(frame, [pullBackStart + 10, pullBackStart + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compose l'etat caméra courant selon la phase active.
  let camScale = 1;
  let camTx = 0;
  let camTy = 0;
  let phaseLabel = "Vue monde";
  if (frame < whipStart) {
    camScale = dollyScale;
    camTx = dollyTx;
    camTy = dollyTy;
    phaseLabel = "Dolly In -> Ghana (isolation par assombrissement)";
  } else if (frame < pullBackStart) {
    camScale = whipScale;
    camTx = whipTx;
    camTy = whipTy;
    phaseLabel = "Whip Pan -> Nigeria (isolation par disparition)";
  } else {
    camScale = pullBackScale;
    camTx = pullBackTx;
    camTy = pullBackTy;
    phaseLabel = "Pull Back Reveal -> retour vue monde";
  }

  const restOpacity =
    frame < whipStart
      ? dimRestOpacity
      : frame < pullBackStart
        ? restHiddenOpacity
        : restReappearOpacity;

  const africaCountries = mapData.countries.filter((c) => c.isAfrica);
  const restCountries = mapData.countries.filter((c) => !c.isAfrica);
  const africaCombinedD = africaCountries.map((c) => c.d).join(" ");

  const ghanaCountry = mapData.countries.find((c) => c.id === GHANA_ID);
  const nigeriaCountry = mapData.countries.find((c) => c.id === NIGERIA_ID);

  const titleOpacity = interpolate(camScale, [1, 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.ocean, overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "100%", filter: blurPx > 0 ? `blur(${blurPx}px)` : "none" }}
      >
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={COLORS.oceanLight} />
            <stop offset="60%" stopColor={COLORS.ocean} />
            <stop offset="100%" stopColor={COLORS.oceanDark} />
          </radialGradient>
          <linearGradient id="afriqueGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.afriqueBase} />
            <stop offset="50%" stopColor={COLORS.afriqueMid} />
            <stop offset="100%" stopColor={COLORS.afriqueEdge} />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={W} height={H} fill="url(#oceanGradient)" />

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale}) `}>
          {/* Graticule : disparait vite au zoom (n'a plus de sens isole) */}
          <g opacity={Math.max(0, 1 - camScale / 3) * 0.16} stroke={COLORS.encre} strokeWidth={0.6 / camScale} fill="none">
            {Array.from({ length: 12 }, (_, i) => {
              const x = (W / 12) * i;
              return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} />;
            })}
            {Array.from({ length: 7 }, (_, i) => {
              const y = (H / 7) * i;
              return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} />;
            })}
          </g>

          {/* Reste du monde : opacite variable selon strategie d'isolation active */}
          <g opacity={restOpacity}>
            {restCountries.map((c) => (
              <path key={c.id} d={c.d} fill={COLORS.restDuMonde} stroke="none" />
            ))}
          </g>
          <g fill="none" opacity={restOpacity}>
            {restCountries.map((c) => (
              <path
                key={`border-${c.id}`}
                d={c.d}
                stroke={COLORS.fontiereMonde}
                strokeWidth={0.55}
                opacity={0.35}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* Ombre Afrique */}
          <path d={africaCombinedD} fill={COLORS.encre} opacity={0.18} transform="translate(3 3)" />

          {/* Afrique */}
          <g>
            {africaCountries.map((c) => {
              const isGhana = c.id === GHANA_ID;
              const isNigeria = c.id === NIGERIA_ID;
              const highlight =
                isGhana && frame < whipStart
                  ? COLORS.ghanaHighlight
                  : isNigeria && frame >= whipStart && frame < pullBackStart
                    ? COLORS.nigeriaHighlight
                    : null;
              return (
                <path
                  key={c.id}
                  d={c.d}
                  fill={highlight ?? "url(#afriqueGradient)"}
                  stroke={COLORS.encre}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          {/* Points de donnee demo : apparaissent uniquement quand le pays est isole et zoome */}
          {ghanaCountry && frame < whipStart && (
            <g opacity={interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <circle cx={GHANA_CENTER.x} cy={GHANA_CENTER.y - 15} r={3 / camScale} fill={COLORS.cream} stroke={COLORS.encre} strokeWidth={1 / camScale} />
            </g>
          )}
          {nigeriaCountry && frame >= whipStart && frame < pullBackStart && (
            <g
              opacity={spring({
                frame: frame - whipStart - 60,
                fps: 30,
                config: { damping: 20 },
              })}
            >
              <circle cx={NIGERIA_CENTER.x} cy={NIGERIA_CENTER.y - 10} r={3 / camScale} fill={COLORS.cream} stroke={COLORS.encre} strokeWidth={1 / camScale} />
            </g>
          )}
        </g>

        <text
          x={W / 2}
          y={90}
          textAnchor="middle"
          fill={COLORS.cream}
          fontSize={38}
          fontFamily={cinzel}
          fontWeight="bold"
          letterSpacing={4}
          opacity={titleOpacity}
          style={{ fontVariant: "small-caps" }}
        >
          Le Palimpseste Mondial
        </text>

        <text
          x={W / 2}
          y={H - 40}
          textAnchor="middle"
          fill={COLORS.encre}
          fontSize={18}
          fontFamily={sourceSans}
          opacity={0.85}
        >
          {phaseLabel}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

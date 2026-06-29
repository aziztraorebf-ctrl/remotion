/**
 * Cacao -> Chocolat SHORT — BEAT 2 : LA VRAIE SOURCE (V2) — 9,52s -> 286f @30fps
 *
 * Narration B2 : "Parce que le cacao ne pousse pas en Europe. Pres des trois quarts du cacao mondial
 * viennent d'une seule region : l'Afrique de l'Ouest. La Cote d'Ivoire. Le Ghana."
 *
 * REFONTE V2 (style encre valide par Aziz, structure refondue) :
 *   - PLUS d'intro "Afrique de l'Ouest qui se trace". On DEMARRE DIRECT EN SPLIT-SCREEN 2 volets verticaux.
 *   - Volet GAUCHE = Cote d'Ivoire · volet DROIT = Ghana. Geo d3-geo EXACTE (countries-50m, contours reels).
 *   - CI se dessine d'abord (trace strokeDashoffset), PUIS Ghana. Avant la fin : les DEUX sont la.
 *   - TRACE SYNCHRO NOM (mesure Whisper sur cacao-beat2-FINAL.mp3) :
 *       "Cote d'Ivoire" prononce 8.02-8.74s = f241-262 -> trace CI finit ~f245.
 *       "Ghana" ("Ganin") prononce 9.12-9.44s = f274-283 -> trace Ghana finit ~f276.
 *   - COLORISATION = COULEURS DU DRAPEAU EN REMPLISSAGE, clip sur la silhouette du pays (pas de drapeau plaque) :
 *       CI    : 3 bandes VERTICALES orange #F77F00 / blanc / vert #009E60 qui MONTENT dans la silhouette.
 *       Ghana : 3 bandes HORIZONTALES rouge #CE1126 / jaune #FCD116 / vert #006B3F + ETOILE NOIRE centrale (accent, apres).
 *   - Micro-source bas : "~3/4 du cacao mondial — ICCO" (encre opacity 0.7). PAS de cartouche.
 *
 * Registre ENCRE NARRATIVE : trait fin encre #2b2117 sur parchemin creme #e8dcc0. Geo EXACTE, ZERO LLM.
 * Vitesse de trace reglable (TRACE_SPEED). Audio-derived timing finalise. Objets inertes (pays) = pas de glissement.
 */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import { useTopology } from "../../../_shared/components/inserts/useTopology";

export const B2_SOURCE_FPS = 30;
export const B2_SOURCE_FRAMES = 286;

const W = 1080;
const H = 1920;
const HALF = W / 2;

// ---- Palette ENCRE NARRATIVE (registre GGW, FERME) ----
const PARCH = "#e8dcc0";
const PARCH_DARK = "#ddd0ad";
const INK = "#2b2117";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// ---- Couleurs DRAPEAUX (remplissage silhouette) ----
const CI_ORANGE = "#F77F00";
const CI_WHITE = "#FFFFFF";
const CI_GREEN = "#009E60";
const GH_RED = "#CE1126";
const GH_YELLOW = "#FCD116";
const GH_GREEN = "#006B3F";
const GH_STAR = "#000000";

// ---- BRUN CACAO (compromis : la matiere arrive d'abord, le drapeau eclot par-dessus apres) ----
const COCOA = "#6b4423";
const COCOA_DARK = "#4a2c14";

// ---- TIMELINE (reglable) — COMPROMIS COULEUR : brun cacao d'abord, drapeau ensuite ----
// Sequence par pays : TRACE (se dessine) -> BRUN cacao monte (la matiere arrive, vit longtemps) ->
// DRAPEAU eclot par-dessus le brun en fin de beat. Le LABEL nom reste cale sur l'audio (*_NAME_LABEL).
// Acquis garde : la couleur n'attend PAS le nom (brun des la fin de trace) -> elle vit plusieurs secondes.
// Audio-derived (Whisper cacao-beat2-FINAL.mp3) : "Cote d'Ivoire" f241-262 · "Ghana" ("Ganin") f274-283.
const CI_TRACE_START = 18;
const CI_TRACE_END = 96; // CI tracee tot
const CI_COCOA_START = 90; // brun monte des la fin de trace
const CI_COCOA_END = 150; // CI pleine de brun ~f150 (vit jusqu'a l'eclosion drapeau)
const CI_FLAG_START = 196; // drapeau eclot par-dessus le brun, fin de beat
const CI_FLAG_END = 244; // pleine couleur drapeau ~ au nom
const CI_NAME_LABEL = 241;

const GH_TRACE_START = 90;
const GH_TRACE_END = 168;
const GH_COCOA_START = 160;
const GH_COCOA_END = 215;
const GH_FLAG_START = 228;
const GH_FLAG_END = 276;
const GH_NAME_LABEL = 274;

// Noms TopoJSON exacts (verifies dans countries-50m.json)
const NAME_CI = "Côte d'Ivoire";
const NAME_GHANA = "Ghana";

type Focus = { d: string; len: number; cx: number; cy: number; bbox: [[number, number], [number, number]] };

// ---- KARAOKE WORD-LEVEL (timestamps Whisper : out/episodes/.../cacao-beat2-words.json) ----
// Fragments d'apostrophe regroupes en mots affichables, accents FR conserves. {word, start, end} en secondes.
type Word = { word: string; start: number; end: number };
const WORDS: Word[] = [
  { word: "Parce", start: 0.0, end: 0.28 },
  { word: "que", start: 0.28, end: 0.44 },
  { word: "le", start: 0.44, end: 0.76 },
  { word: "cacao", start: 0.76, end: 0.92 },
  { word: "ne", start: 0.92, end: 1.24 },
  { word: "pousse", start: 1.24, end: 1.42 },
  { word: "pas", start: 1.42, end: 1.62 },
  { word: "en", start: 1.62, end: 1.86 },
  { word: "Europe.", start: 1.86, end: 2.16 },
  { word: "Près", start: 3.36, end: 3.42 },
  { word: "des", start: 3.42, end: 3.56 },
  { word: "trois", start: 3.56, end: 3.84 },
  { word: "quarts", start: 3.84, end: 3.9 },
  { word: "du", start: 3.9, end: 4.1 },
  { word: "cacao", start: 4.1, end: 4.4 },
  { word: "mondial", start: 4.4, end: 4.96 },
  { word: "viennent", start: 4.96, end: 5.3 },
  { word: "d'une", start: 5.3, end: 5.48 },
  { word: "seule", start: 5.48, end: 5.96 },
  { word: "région.", start: 5.96, end: 6.2 },
  { word: "L'Afrique", start: 6.82, end: 7.02 },
  { word: "de", start: 7.02, end: 7.4 },
  { word: "l'Ouest.", start: 7.4, end: 7.56 },
  { word: "La", start: 7.96, end: 8.24 },
  { word: "Côte", start: 8.24, end: 8.4 },
  { word: "d'Ivoire.", start: 8.4, end: 8.72 },
  { word: "Le", start: 9.04, end: 9.22 },
  { word: "Ghana.", start: 9.22, end: 9.42 },
];
// Decoupe en phrases (indices ou une phrase SE TERMINE) — cale sur la ponctuation/pauses audio.
//  [..Europe.]=8  [..region.]=19  [..l'Ouest.]=22  [..d'Ivoire.]=25  [Le Ghana.]=27
const PHRASE_BREAKS = [8, 19, 22, 25, 27];

export const B2Source: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const data = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const features = fc.features as any[];
    const lenOf = (d: string) => (d.match(/[ML]/g)?.length ?? 50) * 11;

    // Projette UN pays seul, centre dans une demi-largeur (volet 9:16).
    const focusInPanel = (name: string): Focus | null => {
      const feat = features.find((f) => f.properties?.name === name);
      if (!feat) return null;
      const proj = geoMercator();
      // AGRANDI ~45% : les pays occupent presque toute la demi-largeur ; bande haute (notch) reservee
      // et BAS (Y > 0.66) garde pour labels noms + micro-source ICCO.
      proj.fitExtent(
        [
          [HALF * 0.05, H * 0.16],
          [HALF * 0.95, H * 0.6],
        ],
        feat as any
      );
      const p = geoPath(proj);
      const d = p(feat as any) || "";
      const c = geoCentroid(feat as any);
      const cxy = proj(c) ?? [HALF / 2, H / 2];
      const bbox = p.bounds(feat as any) as [[number, number], [number, number]];
      return { d, len: lenOf(d), cx: cxy[0], cy: cxy[1], bbox };
    };

    return { ci: focusInPanel(NAME_CI), ghana: focusInPanel(NAME_GHANA) };
  }, [topo]);

  if (!topo || !data) return <AbsoluteFill style={{ background: PARCH }} />;

  const { ci, ghana } = data;

  // --- progressions (interpolate clamp) ---
  const clampL = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 1) TRACE : chaque pays se dessine tot
  const ciTrace = clampL(CI_TRACE_START, CI_TRACE_END);
  const ghTrace = clampL(GH_TRACE_START, GH_TRACE_END);
  // 2) BRUN CACAO : la matiere remplit le pays des la fin de trace (vit longtemps, ne depend pas du nom)
  const ciCocoa = clampL(CI_COCOA_START, CI_COCOA_END);
  const ghCocoa = clampL(GH_COCOA_START, GH_COCOA_END);
  // 3) DRAPEAU : eclot PAR-DESSUS le brun, en fin de beat
  const ciFlag = clampL(CI_FLAG_START, CI_FLAG_END);
  const ghFlag = clampL(GH_FLAG_START, GH_FLAG_END);
  // 4) ETOILE GHANA : ECLOT comme une graine (croissance organique) une fois les bandes posees.
  const GH_STAR_BLOOM = GH_FLAG_END - 14;
  const ghStar = spring({
    frame: frame - GH_STAR_BLOOM,
    fps,
    config: { damping: 14, mass: 1.1, stiffness: 90 }, // croissance douce, pas de pop sec
    durationInFrames: 38,
  });
  // 5) LABELS noms : restent cales sur l'audio
  const ciLabel = interpolate(frame, [CI_NAME_LABEL - 6, CI_NAME_LABEL + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ghLabel = interpolate(frame, [GH_NAME_LABEL - 6, GH_NAME_LABEL + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const introFade = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const breath = 1 + 0.004 * Math.sin(frame * 0.06);

  return (
    <AbsoluteFill style={{ background: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat2-FINAL.mp3")} />

      {/* fond papier */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="b2paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="9" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#b2paper)" opacity={0.45} />
      </svg>

      {/* SEPARATEUR vertical central simple (trait encre fin) */}
      {(() => {
        const sep = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
        return (
          <div
            style={{
              position: "absolute",
              left: HALF - 1,
              top: H * 0.12,
              width: 2,
              height: H * 0.62 * sep,
              background: INK,
              opacity: 0.4,
            }}
          />
        );
      })()}

      {/* ===================== VOLET GAUCHE : COTE D'IVOIRE ===================== */}
      <div style={{ position: "absolute", left: 0, top: 0, width: HALF, height: H, opacity: introFade }}>
        {ci && (
          <FlagCountry
            d={ci.d}
            len={ci.len}
            cx={ci.cx}
            cy={ci.cy}
            trace={ciTrace}
            cocoa={ciCocoa}
            flag={ciFlag}
            breath={breath}
            clipId="ciClip"
            label="CÔTE D'IVOIRE"
            labelOp={ciLabel}
            bands={<ClipBandsVertical clipId="ciClip" bbox={ci.bbox} colors={[CI_ORANGE, CI_WHITE, CI_GREEN]} fill={ciFlag} />}
          />
        )}
      </div>

      {/* ===================== VOLET DROIT : GHANA ===================== */}
      <div style={{ position: "absolute", left: HALF, top: 0, width: HALF, height: H, opacity: introFade }}>
        {ghana && (
          <FlagCountry
            d={ghana.d}
            len={ghana.len}
            cx={ghana.cx}
            cy={ghana.cy}
            trace={ghTrace}
            cocoa={ghCocoa}
            flag={ghFlag}
            breath={breath}
            clipId="ghClip"
            label="GHANA"
            labelOp={ghLabel}
            bands={
              <>
                <ClipBandsHorizontal clipId="ghClip" bbox={ghana.bbox} colors={[GH_RED, GH_YELLOW, GH_GREEN]} fill={ghFlag} />
                {ghStar > 0.01 && (
                  <Star
                    cx={ghana.cx}
                    cy={ghana.cy}
                    r={26 * Math.min(1, ghStar)}
                    rot={(1 - Math.min(1, ghStar)) * -28} // rotation douce qui se resorbe : eclosion de graine
                    fill={GH_STAR}
                    clipId="ghClip"
                  />
                )}
              </>
            }
          />
        )}
      </div>

      {/* ===================== KARAOKE WORD-LEVEL (tiers inferieur, au-dessus de la source) ===================== */}
      <Karaoke frame={frame} fps={fps} />

      {/* ===================== MICRO-SOURCE (bas) — apparait au debut puis FADE OUT (~3s) ===================== */}
      {(() => {
        // fade in f10-25 -> plein f25-90 -> fade out f90-110 -> 0 (un credit n'a pas besoin de rester 9s)
        // independant du karaoke (qui est au-dessus, bottom 230, avec sa propre opacite).
        const op = interpolate(frame, [10, 25, 90, 110], [0, 0.7, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (op <= 0) return null;
        return (
          <div
            style={{
              position: "absolute",
              bottom: 130,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: op,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 28,
              color: INK,
            }}
          >
            ~3/4 du cacao mondial — ICCO
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ===== sous-composant : un pays dans son volet (trace + clip drapeau + label) =====
const FlagCountry: React.FC<{
  d: string;
  len: number;
  cx: number;
  cy: number;
  trace: number;
  cocoa: number;
  flag: number;
  breath: number;
  clipId: string;
  label: string;
  labelOp: number;
  bands: React.ReactNode;
}> = ({ d, len, cx, cy, trace, cocoa, flag, breath, clipId, label, labelOp, bands }) => {
  if (trace <= 0) return null;
  // le brun s'estompe quand le drapeau eclot par-dessus (transition matiere -> identite)
  const cocoaOpacity = cocoa * (1 - flag * 0.9);
  return (
    <svg width={HALF} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
        <linearGradient id={`${clipId}Cocoa`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COCOA} />
          <stop offset="100%" stopColor={COCOA_DARK} />
        </linearGradient>
      </defs>

      <g transform={`scale(${breath})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {/* 1) BRUN cacao (la matiere arrive d'abord), clippe a la silhouette */}
        {cocoaOpacity > 0.01 && <path d={d} fill={`url(#${clipId}Cocoa)`} opacity={cocoaOpacity} />}
        {/* 2) DRAPEAU qui eclot PAR-DESSUS */}
        {flag > 0 && bands}
        <path
          d={d}
          fill="none"
          stroke={INK}
          strokeWidth={3.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - trace)}
          opacity={0.92}
        />
      </g>

      {labelOp > 0 && (
        <text
          x={HALF / 2}
          y={H * 0.68}
          textAnchor="middle"
          fontFamily={SANS}
          fontSize={46}
          fontWeight={800}
          letterSpacing={2}
          fill={INK}
          opacity={labelOp}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

// 3 bandes VERTICALES (CI) reparties sur la bbox REELLE du pays : chaque bande monte du bas selon `fill`.
const ClipBandsVertical: React.FC<{
  clipId: string;
  bbox: [[number, number], [number, number]];
  colors: [string, string, string];
  fill: number;
}> = ({ clipId, bbox, colors, fill }) => {
  const [[x0, y0], [x1, y1]] = bbox;
  const bw = (x1 - x0) / 3;
  return (
    <g clipPath={`url(#${clipId})`}>
      {colors.map((col, i) => {
        const local = interpolate(fill, [i * 0.18, i * 0.18 + 0.55], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const h = (y1 - y0) * local;
        return <rect key={i} x={x0 + i * bw} y={y1 - h} width={bw + 0.5} height={h} fill={col} opacity={0.92} />;
      })}
    </g>
  );
};

// 3 bandes HORIZONTALES (Ghana) reparties sur la bbox REELLE : chaque bande se revele de gauche a droite.
const ClipBandsHorizontal: React.FC<{
  clipId: string;
  bbox: [[number, number], [number, number]];
  colors: [string, string, string];
  fill: number;
}> = ({ clipId, bbox, colors, fill }) => {
  const [[x0, y0], [x1, y1]] = bbox;
  const bh = (y1 - y0) / 3;
  return (
    <g clipPath={`url(#${clipId})`}>
      {colors.map((col, i) => {
        const local = interpolate(fill, [i * 0.18, i * 0.18 + 0.55], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const w = (x1 - x0) * local;
        return <rect key={i} x={x0} y={y0 + i * bh} width={w} height={bh + 0.5} fill={col} opacity={0.92} />;
      })}
    </g>
  );
};

// Etoile 5 branches (accent Ghana) qui ECLOT comme une graine : scale (via r) + rotation douce (rot, deg)
// qui se resorbe. Clippee dans le pays.
const Star: React.FC<{ cx: number; cy: number; r: number; rot: number; fill: string; clipId: string }> = ({
  cx,
  cy,
  r,
  rot,
  fill,
  clipId,
}) => {
  const rad = (rot * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const aOut = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + rad;
    const aIn = aOut + Math.PI / 5;
    pts.push(`${cx + r * Math.cos(aOut)},${cy + r * Math.sin(aOut)}`);
    pts.push(`${cx + r * 0.42 * Math.cos(aIn)},${cy + r * 0.42 * Math.sin(aIn)}`);
  }
  return (
    <g clipPath={`url(#${clipId})`}>
      <polygon points={pts.join(" ")} fill={fill} />
    </g>
  );
};

// ===== KARAOKE word-level (grammaire GGW, accent BRUN CHOCOLAT au lieu du vert) =====
const Karaoke: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const narSec = frame / fps;

  // decoupe WORDS en phrases via PHRASE_BREAKS
  const phrases: { words: Word[]; start: number; end: number }[] = [];
  const breakSet = new Set(PHRASE_BREAKS);
  let startIdx = 0;
  for (let i = 0; i < WORDS.length; i++) {
    if (breakSet.has(i) || i === WORDS.length - 1) {
      const slice = WORDS.slice(startIdx, i + 1);
      phrases.push({ words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
      startIdx = i + 1;
    }
  }

  // phrase active = celle dont la fenetre [start, end+0.4] contient le temps courant
  const activeIdx = phrases.findIndex((p) => narSec >= p.start - 0.15 && narSec <= p.end + 0.45);
  const activePhrase = activeIdx >= 0 ? phrases[activeIdx] : null;
  if (!activePhrase) return null;

  // fondu d'entree/sortie de la phrase (interpolate clamp, pas de CSS transition)
  const subOpacity = interpolate(
    narSec,
    [activePhrase.start - 0.15, activePhrase.start + 0.1, activePhrase.end + 0.25, activePhrase.end + 0.45],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (subOpacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 230, // tiers inferieur, AU-DESSUS de la micro-source ICCO (bottom 130)
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 14px",
        opacity: subOpacity,
        background: "rgba(232,220,192,0.82)", // parchemin semi-transparent (lisibilite)
        border: `1px solid rgba(43,33,23,0.18)`,
        borderRadius: 14,
        padding: "18px 26px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 40,
        lineHeight: 1.3,
        fontWeight: 700,
      }}
    >
      {activePhrase.words.map((w, i) => {
        const active = narSec >= w.start && narSec <= w.end + 0.12;
        return (
          <span
            key={i}
            style={{
              color: active ? COCOA : INK, // mot actif = BRUN CHOCOLAT, sinon encre
              opacity: active ? 1 : 0.62,
              transform: active ? "translateY(-2px)" : "none",
              display: "inline-block",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

export default B2Source;

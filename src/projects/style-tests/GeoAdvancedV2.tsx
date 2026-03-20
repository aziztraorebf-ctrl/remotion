import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// GEO ADVANCED V2 — Catalogue d'effets visuels geo
// Format : 1080x1920 (Shorts vertical)
//
// Seq 1 (0-299f)    : Hachures SVG + Vignette
// Seq 2 (300-599f)  : Zoom D3 re-projection reelle frame/frame
// Seq 3 (600-899f)  : Draw-on frontiere + Pulse 3 rings cascade
// Seq 4 (900-1199f) : Transition zoom-blur custom entre scenes
// Seq 5 (1200-1499f): TOUT ENSEMBLE — reference finale
//
// Chaque sequence a :
//   - Un header fixe en haut (nom + description)
//   - Des annotations flottantes qui apparaissent quand l'effet se declenche
//   - Un footer technique en bas
//
// 1500 frames @ 30fps = 50 secondes
// ============================================================

const W = 1080;
const H = 1920;
const SEG = 300;

const ISO_IRAN    = 364;
const ISO_ISRAEL  = 376;
const ISO_SAUDI   = 682;
const ISO_IRAQ    = 368;
const ISO_TURKEY  = 792;
const ISO_EGYPT   = 818;
const ISO_JORDAN  = 400;
const ISO_LEBANON = 422;
const ISO_SYRIA   = 760;

const P = {
  ocean:        "#a8d5e8",
  land:         "#e8e0d0",
  landStroke:   "#c0b090",
  iran:         "#e8a060",
  iranStroke:   "#c07030",
  israel:       "#6090e0",
  israelStroke: "#3060b0",
  saudi:        "#e8d080",
  iraq:         "#90c890",
  turkey:       "#d090c0",
  egypt:        "#c8b870",
  jordan:       "#b0d0a0",
  lebanon:      "#e09090",
  syria:        "#a0c0d0",
  accent:       "#e03030",
  gold:         "#f0c000",
  cyan:         "#00d4ff",
  green:        "#22c55e",
  white:        "#ffffff",
  dark:         "#0d1117",
  darkSemi:     "rgba(13,17,23,0.88)",
} as const;

const FILL: Record<number, string> = {
  [ISO_IRAN]:    P.iran,
  [ISO_ISRAEL]:  P.israel,
  [ISO_SAUDI]:   P.saudi,
  [ISO_IRAQ]:    P.iraq,
  [ISO_TURKEY]:  P.turkey,
  [ISO_EGYPT]:   P.egypt,
  [ISO_JORDAN]:  P.jordan,
  [ISO_LEBANON]: P.lebanon,
  [ISO_SYRIA]:   P.syria,
};

const COORDS = {
  tehran:    [51.42, 35.69] as [number, number],
  telaviv:   [34.78, 32.09] as [number, number],
  natanz:    [51.72, 33.72] as [number, number],
  jerusalem: [35.21, 31.77] as [number, number],
  riyadh:    [46.68, 24.69] as [number, number],
  baghdad:   [44.39, 33.34] as [number, number],
  cairo:     [31.24, 30.06] as [number, number],
};

interface CountryFeature {
  id: number;
  path: string;
  centroid: [number, number] | null;
  feature: GeoJSON.Feature;
}

// ── Helpers ────────────────────────────────────────────────────
function ci(v: number, s: number, e: number, os = 0, oe = 1) {
  return interpolate(v, [s, e], [os, oe], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function lf(frame: number, seg: number) {
  return frame - seg * SEG;
}

function makeProj(
  center: [number, number] = [45, 28],
  scale = 1400,
  tx = W / 2,
  ty = H * 0.42
) {
  return d3Geo.geoMercator().center(center).scale(scale).translate([tx, ty]);
}

const PROJ_BASE = makeProj();

// ── Hook carte ─────────────────────────────────────────────────
function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [rawGeo, setRawGeo] = React.useState<GeoJSON.FeatureCollection | null>(null);
  const [handle] = React.useState(() => delayRender("GeoAdvancedV2 map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;
        setRawGeo(geo);
        const pathGen = d3Geo.geoPath().projection(PROJ_BASE);
        const features: CountryFeature[] = geo.features
          .map((f) => {
            const d = pathGen(f);
            if (!d) return null;
            const c = pathGen.centroid(f);
            return {
              id: Number(f.id),
              path: d,
              centroid: c && isFinite(c[0]) ? (c as [number, number]) : null,
              feature: f,
            };
          })
          .filter(Boolean) as CountryFeature[];
        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  return { countries, rawGeo };
}

// ── BaseMap ────────────────────────────────────────────────────
function BaseMap({
  countries,
  highlightIso = [],
  dimOthers = false,
}: {
  countries: CountryFeature[];
  highlightIso?: number[];
  dimOthers?: boolean;
}) {
  return (
    <>
      <rect width={W} height={H} fill={P.ocean} />
      {countries.map((c) => {
        const isHL = highlightIso.includes(c.id);
        const fill = FILL[c.id] ?? P.land;
        const stroke = c.id === ISO_IRAN ? P.iranStroke
          : c.id === ISO_ISRAEL ? P.israelStroke
          : P.landStroke;
        const opacity = dimOthers && !isHL ? 0.4 : 1;
        return (
          <path key={c.id} d={c.path}
            fill={fill} stroke={stroke}
            strokeWidth={isHL ? 2.5 : 0.8} opacity={opacity} />
        );
      })}
    </>
  );
}

// ── CityDot ────────────────────────────────────────────────────
function CityDot({ x, y, color, label, appear }: {
  x: number; y: number; color: string; label: string; appear: number;
}) {
  return (
    <g opacity={appear}>
      <circle cx={x} cy={y} r={7} fill={color} stroke={P.white} strokeWidth={2} />
      <rect x={x + 12} y={y - 18} width={label.length * 11 + 16} height={28} rx={5}
        fill={P.dark} opacity={0.88} />
      <text x={x + 20} y={y} fontFamily="'Arial Black', sans-serif"
        fontSize={18} fontWeight="900" fill={P.white}>
        {label}
      </text>
    </g>
  );
}

// ── SeqHeader — titre fixe en haut de chaque sequence ─────────
// Affiche le numero, le nom de l'effet, et une description courte
function SeqHeader({
  num,
  title,
  desc,
  color = P.gold,
}: {
  num: string;
  title: string;
  desc: string;
  color?: string;
}) {
  return (
    <>
      {/* Barre de titre */}
      <rect x={0} y={0} width={W} height={120} fill={P.dark} opacity={0.92} />
      {/* Numero de sequence */}
      <rect x={30} y={18} width={72} height={40} rx={8} fill={color} opacity={0.9} />
      <text x={66} y={46} textAnchor="middle"
        fontFamily="'Arial Black', sans-serif" fontSize={22}
        fontWeight="900" fill={P.dark}>
        {num}
      </text>
      {/* Titre */}
      <text x={118} y={38}
        fontFamily="'Arial Black', sans-serif" fontSize={26}
        fontWeight="900" fill={color}>
        {title}
      </text>
      {/* Description */}
      <text x={118} y={66}
        fontFamily="Arial, sans-serif" fontSize={18}
        fill={P.white} opacity={0.75}>
        {desc}
      </text>
      {/* Ligne separatrice */}
      <line x1={30} y1={108} x2={W - 30} y2={108}
        stroke={color} strokeWidth={1.5} opacity={0.35} />
    </>
  );
}

// ── EffectTag — bulle d'annotation flottante ───────────────────
// Apparait quand l'effet se declenche, disparait apres
// side: "left" | "right" — cote ou pointe la bulle
function EffectTag({
  x, y,
  label,
  code,
  appear,
  side = "right",
  color = P.cyan,
}: {
  x: number; y: number;
  label: string;
  code: string;
  appear: number;
  side?: "left" | "right";
  color?: string;
}) {
  const W_BOX = 340;
  const H_BOX = 68;
  const bx = side === "right" ? x + 24 : x - W_BOX - 24;
  const DOT_R = 5;

  return (
    <g opacity={appear}>
      {/* Ligne pointillee vers l'effet */}
      <line
        x1={x} y1={y}
        x2={side === "right" ? bx : bx + W_BOX} y2={y}
        stroke={color} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7}
      />
      {/* Point source */}
      <circle cx={x} cy={y} r={DOT_R} fill={color} opacity={0.9} />
      {/* Boite */}
      <rect x={bx} y={y - H_BOX / 2} width={W_BOX} height={H_BOX} rx={8}
        fill={P.dark} stroke={color} strokeWidth={1.5} opacity={0.95} />
      {/* Label (nom de l'effet) */}
      <text x={bx + 14} y={y - 8}
        fontFamily="'Arial Black', sans-serif" fontSize={17}
        fontWeight="900" fill={color}>
        {label}
      </text>
      {/* Code technique */}
      <text x={bx + 14} y={y + 16}
        fontFamily="'Courier New', monospace" fontSize={13}
        fill={P.white} opacity={0.65}>
        {code}
      </text>
    </g>
  );
}

// ── SeqFooter — barre technique en bas ────────────────────────
function SeqFooter({
  lines,
  local,
  color = P.gold,
}: {
  lines: string[];
  local: number;
  color?: string;
}) {
  const rev = ci(local, 0, 25);
  const H_BOX = 36 + lines.length * 32;
  return (
    <g opacity={rev}>
      <rect x={0} y={H - H_BOX} width={W} height={H_BOX}
        fill={P.dark} opacity={0.9} />
      <line x1={30} y1={H - H_BOX} x2={W - 30} y2={H - H_BOX}
        stroke={color} strokeWidth={1.5} opacity={0.35} />
      {lines.map((l, i) => (
        <text key={i}
          x={40} y={H - H_BOX + 30 + i * 32}
          fontFamily="'Courier New', monospace" fontSize={17}
          fill={P.white} opacity={0.75}>
          {l}
        </text>
      ))}
    </g>
  );
}

// =============================================================
// SEQ 1 — HACHURES SVG + VIGNETTE
// =============================================================
function Seq1Hatch({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 0);
  const { fps } = useVideoConfig();

  const mapIn        = spring({ frame: local, fps, config: { damping: 40, stiffness: 50 } });
  const hatchOpIran  = ci(local, 30, 90, 0, 0.55);
  const hatchOpIL    = ci(local, 70, 130, 0, 0.45);
  const vigOpacity   = ci(local, 60, 120, 0, 0.65);
  const iranLbl      = spring({ frame: Math.max(0, local - 40), fps, config: { damping: 20, stiffness: 180 } });
  const israelLbl    = spring({ frame: Math.max(0, local - 80), fps, config: { damping: 20, stiffness: 180 } });
  const arrowReveal  = ci(local, 150, 200);
  const annotHatch   = ci(local, 35, 65);
  const annotVig     = ci(local, 65, 95);
  const annotArrow   = ci(local, 155, 185);

  const pt_iran   = PROJ_BASE(COORDS.tehran)  as [number, number];
  const pt_israel = PROJ_BASE(COORDS.telaviv) as [number, number];
  const pt_natanz = PROJ_BASE(COORDS.natanz)  as [number, number];

  return (
    <svg width={W} height={H}>
      <defs>
        <pattern id="hatch-iran" patternUnits="userSpaceOnUse" width={10} height={10}
          patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={P.iranStroke} strokeWidth={2.5} />
        </pattern>
        <pattern id="hatch-israel" patternUnits="userSpaceOnUse" width={10} height={10}
          patternTransform="rotate(-45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={P.israelStroke} strokeWidth={2} />
        </pattern>
        <radialGradient id="vig1" cx="50%" cy="48%" r="60%">
          <stop offset="40%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={vigOpacity} />
        </radialGradient>
      </defs>

      {/* Carte */}
      <g transform={`scale(${mapIn}) translate(${W * (1 - mapIn) / 2 / mapIn}, ${H * (1 - mapIn) / 2 / mapIn})`}>
        <BaseMap countries={countries} />
      </g>

      {/* Hachures */}
      {countries.filter(c => c.id === ISO_IRAN).map(c => (
        <path key="hi" d={c.path} fill="url(#hatch-iran)" opacity={hatchOpIran} />
      ))}
      {countries.filter(c => c.id === ISO_ISRAEL).map(c => (
        <path key="hil" d={c.path} fill="url(#hatch-israel)" opacity={hatchOpIL} />
      ))}

      {/* Labels */}
      <CityDot x={pt_iran[0]} y={pt_iran[1]} color={P.iranStroke} label="IRAN" appear={iranLbl} />
      <CityDot x={pt_israel[0]} y={pt_israel[1]} color={P.israelStroke} label="ISRAEL" appear={israelLbl} />

      {/* Fleche Natanz */}
      {arrowReveal > 0 && (
        <g opacity={arrowReveal}>
          <line x1={pt_iran[0]} y1={pt_iran[1]} x2={pt_natanz[0]} y2={pt_natanz[1]}
            stroke={P.accent} strokeWidth={2.5} strokeDasharray="8 4" />
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={12} fill={P.accent} opacity={0.3} />
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={6} fill={P.accent} stroke={P.white} strokeWidth={2} />
          <text x={pt_natanz[0] + 18} y={pt_natanz[1] + 6}
            fontFamily="Arial, sans-serif" fontSize={17} fontWeight="700" fill={P.white}>
            Natanz
          </text>
        </g>
      )}

      {/* Vignette */}
      <rect width={W} height={H} fill="url(#vig1)" />

      {/* === ANNOTATIONS === */}
      {/* Annotation hachures — apparait quand les hachures Iran se declenchent */}
      <EffectTag
        x={pt_iran[0] + 60} y={pt_iran[1] - 80}
        label="Hachures SVG"
        code={`<pattern rotate(45)> <line /> </pattern>`}
        appear={annotHatch}
        side="right"
        color={P.cyan}
      />

      {/* Annotation vignette — apparait quand la vignette est visible */}
      <EffectTag
        x={80} y={H * 0.72}
        label="Vignette"
        code={`radialGradient opacity 0→0.65`}
        appear={annotVig}
        side="right"
        color={P.gold}
      />

      {/* Annotation fleche Natanz */}
      <EffectTag
        x={pt_natanz[0] - 10} y={pt_natanz[1] - 60}
        label="Fleche pointillee"
        code={`strokeDasharray="8 4"`}
        appear={annotArrow}
        side="left"
        color={P.accent}
      />

      {/* Header */}
      <SeqHeader
        num="01"
        title="Hachures + Vignette"
        desc="SVG pattern anime — overlay radialGradient"
        color={P.cyan}
      />

      {/* Footer */}
      <SeqFooter
        local={local}
        color={P.cyan}
        lines={[
          "pattern patternUnits='userSpaceOnUse' rotate(45)  → hachures diagonales",
          "opacity anime : ci(local, 30, 90, 0, 0.55)        → apparition progressive",
          "radialGradient cx='50%' r='60%'                   → assombrit les bords",
        ]}
      />
    </svg>
  );
}

// =============================================================
// SEQ 2 — ZOOM CSS TRANSFORM FLUIDE (Solution 3)
// Paths calcules UNE FOIS au chargement.
// Zoom = CSS scale+translate sur <g> — GPU natif, zero calcul JS.
// Labels contre-compenses : scale(1/zoom) pour rester fixes.
// Easing inOutCubic = acceleration/deceleration naturelle.
// =============================================================
function Seq2Zoom({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 1);
  const { fps } = useVideoConfig();

  // Coordonnees ecran des points cles (projection de base, calcul unique)
  const ptIran   = PROJ_BASE(COORDS.tehran)  as [number, number];
  const ptIsrael = PROJ_BASE(COORDS.telaviv) as [number, number];
  const ptNatanz = PROJ_BASE(COORDS.natanz)  as [number, number];

  // Phase 1 (0-100f)  : carte entiere -> recentrage Moyen-Orient
  // Phase 2 (100-200f): Moyen-Orient -> zoom sur Natanz
  // Phase 3 (200-300f): stable + annotations
  const ease = Easing.inOut(Easing.cubic);

  const t1Raw = ci(local, 20, 100);
  const t2Raw = ci(local, 110, 195);
  const t1 = ease(t1Raw);
  const t2 = ease(t2Raw);

  // Phase 1 : scale 1 -> 2.8, recentrage vers le Moyen-Orient
  // Phase 2 : scale 2.8 -> 7.5, recentrage vers Natanz
  const zoomScale = local < 100
    ? interpolate(t1, [0, 1], [1, 2.8])
    : interpolate(t2, [0, 1], [2.8, 7.5]);

  // Offset de recentrage en px ecran (deplace la carte pour centrer la cible)
  // Phase 1 : vise le centre du Moyen-Orient (W/2, H*0.42 = centre projection)
  // Phase 2 : vise Natanz
  const targetX1 = W / 2;   // centre ME ~ centre ecran
  const targetY1 = H * 0.42;
  const targetX2 = ptNatanz[0];
  const targetY2 = ptNatanz[1];

  const targetX = local < 100
    ? interpolate(t1, [0, 1], [W / 2, targetX1])
    : interpolate(t2, [0, 1], [targetX1, targetX2]);

  const targetY = local < 100
    ? interpolate(t1, [0, 1], [H / 2, targetY1])
    : interpolate(t2, [0, 1], [targetY1, targetY2]);

  // Transform : zoom centre sur targetX/Y
  // translate(-target) → scale → translate(+target) = zoom ancre sur la cible
  const mapTransform = `
    translate(${targetX}, ${targetY})
    scale(${zoomScale})
    translate(${-targetX}, ${-targetY})
  `;

  // Contre-compensation labels : annule le zoom parent pour rester a taille fixe
  const invScale = 1 / zoomScale;

  const phase = local < 100 ? 1 : local < 200 ? 2 : 3;

  const iranLbl   = spring({ frame: Math.max(0, local - 30), fps, config: { damping: 20, stiffness: 180 } });
  const israelLbl = spring({ frame: Math.max(0, local - 50), fps, config: { damping: 20, stiffness: 180 } });
  const natanzRev = ci(local, 205, 230);

  const annotZoom  = ci(local, 25, 55);
  const annotCComp = ci(local, 90, 120);
  const annotEase  = ci(local, 130, 160);

  const phaseLabel = phase === 1 ? "Vue monde -> Moyen-Orient"
    : phase === 2 ? "Moyen-Orient -> Natanz"
    : "Natanz — site nucleaire";

  return (
    <svg width={W} height={H}>
      <defs>
        <radialGradient id="vig2" cx="50%" cy="48%" r="60%">
          <stop offset="40%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.6} />
        </radialGradient>
      </defs>

      {/* Groupe carte — zoom CSS pur, paths inchanges */}
      <g transform={mapTransform}>
        <BaseMap countries={countries} />

        {/* Labels DANS le groupe carte, contre-compenses */}
        {iranLbl > 0.05 && (
          <g transform={`translate(${ptIran[0]}, ${ptIran[1]}) scale(${invScale})`}>
            <circle r={7} fill={P.iranStroke} stroke={P.white} strokeWidth={2} />
            <rect x={12} y={-18} width={88} height={28} rx={5} fill={P.dark} opacity={0.88} />
            <text x={20} y={0} fontFamily="'Arial Black', sans-serif"
              fontSize={18} fontWeight="900" fill={P.white} opacity={iranLbl}>IRAN</text>
          </g>
        )}
        {israelLbl > 0.05 && (
          <g transform={`translate(${ptIsrael[0]}, ${ptIsrael[1]}) scale(${invScale})`}>
            <circle r={7} fill={P.israelStroke} stroke={P.white} strokeWidth={2} />
            <rect x={12} y={-18} width={104} height={28} rx={5} fill={P.dark} opacity={0.88} />
            <text x={20} y={0} fontFamily="'Arial Black', sans-serif"
              fontSize={18} fontWeight="900" fill={P.white} opacity={israelLbl}>ISRAEL</text>
          </g>
        )}

        {/* Annotation Natanz phase 3 — contre-compensee */}
        {phase === 3 && (
          <g transform={`translate(${ptNatanz[0]}, ${ptNatanz[1]}) scale(${invScale})`}
            opacity={natanzRev}>
            <circle r={20} fill={P.accent} opacity={0.25} />
            <circle r={9} fill={P.accent} stroke={P.white} strokeWidth={2.5} />
            <rect x={18} y={-32} width={260} height={52} rx={8} fill={P.dark} opacity={0.92} />
            <text x={30} y={-10} fontFamily="'Arial Black', sans-serif"
              fontSize={20} fontWeight="900" fill={P.gold}>Site nucleaire</text>
            <text x={30} y={12} fontFamily="Arial, sans-serif"
              fontSize={14} fill={P.white} opacity={0.75}>Enrichissement uranium</text>
          </g>
        )}
      </g>

      {/* Vignette */}
      <rect width={W} height={H} fill="url(#vig2)" />

      {/* === ANNOTATIONS (hors du groupe zoome) === */}
      <EffectTag
        x={W * 0.82} y={H * 0.32}
        label="Zoom CSS transform"
        code={`scale(${zoomScale.toFixed(2)}) — GPU natif`}
        appear={annotZoom}
        side="left"
        color={P.green}
      />
      <EffectTag
        x={ptIran[0] + 20} y={ptIran[1] - 60}
        label="Contre-compensation"
        code={`scale(${invScale.toFixed(3)}) = 1/zoom`}
        appear={annotCComp}
        side="right"
        color={P.cyan}
      />
      <EffectTag
        x={W * 0.5} y={H * 0.75}
        label="Easing inOutCubic"
        code={`Easing.inOut(Easing.cubic)(t)`}
        appear={annotEase}
        side="right"
        color={P.gold}
      />

      {/* Indicateur de phase */}
      <rect x={30} y={130} width={W - 60} height={52} rx={8} fill={P.dark} opacity={0.85} />
      <text x={W / 2} textAnchor="middle" y={165}
        fontFamily="'Arial Black', sans-serif" fontSize={22} fontWeight="900" fill={P.gold}>
        {phaseLabel}
      </text>

      {/* Header */}
      <SeqHeader
        num="02"
        title="Zoom CSS Fluide"
        desc="CSS transform GPU — paths fixes — easing inOutCubic"
        color={P.green}
      />

      {/* Footer */}
      <SeqFooter
        local={local}
        color={P.green}
        lines={[
          `scale(${zoomScale.toFixed(2)}) via CSS transform — zero recalcul JS`,
          `labels : scale(1/${zoomScale.toFixed(2)}) = taille constante`,
          `easing Easing.inOut(cubic) — accel/decel naturelle`,
        ]}
      />
    </svg>
  );
}

// =============================================================
// SEQ 3 — DRAW-ON FRONTIERE + PULSE 3 RINGS
// =============================================================
function Seq3Effects({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 2);
  const { fps } = useVideoConfig();

  const IRAN_PATH_LEN = 3200;
  const drawProgress  = ci(local, 20, 160);
  const iranDashOff   = interpolate(drawProgress, [0, 1], [IRAN_PATH_LEN, 0]);

  const pt_natanz = PROJ_BASE(COORDS.natanz) as [number, number];
  const pt_iran   = PROJ_BASE(COORDS.tehran) as [number, number];
  const pt_israel = PROJ_BASE(COORDS.telaviv) as [number, number];

  // 3 rings cascade — phase initiale
  const r1t = ci(local, 80, 140); const r1R = interpolate(r1t, [0,1],[12,90]); const r1O = interpolate(r1t, [0,1],[0.8,0]);
  const r2t = ci(local, 100, 160); const r2R = interpolate(r2t, [0,1],[12,90]); const r2O = interpolate(r2t, [0,1],[0.7,0]);
  const r3t = ci(local, 120, 180); const r3R = interpolate(r3t, [0,1],[12,90]); const r3O = interpolate(r3t, [0,1],[0.6,0]);

  // Boucle apres frame 160
  const lp  = local > 160 ? ((local - 160) % 80) : 0;
  const lr1t = ci(lp, 0, 60); const lr1R = interpolate(lr1t,[0,1],[12,90]); const lr1O = interpolate(lr1t,[0,1],[0.75,0]);
  const lr2t = ci(lp, 20, 80); const lr2R = interpolate(lr2t,[0,1],[12,90]); const lr2O = interpolate(lr2t,[0,1],[0.6,0]);
  const useLoop = local > 160;

  const iranFeature = countries.find(c => c.id === ISO_IRAN);
  const iranLbl     = spring({ frame: Math.max(0, local - 10), fps, config: { damping: 20, stiffness: 160 } });
  const israelLbl   = spring({ frame: Math.max(0, local - 30), fps, config: { damping: 20, stiffness: 160 } });

  // Annotations
  const annotDraw  = ci(local, 30, 60);
  const annotPulse = ci(local, 85, 115);
  const annotLoop  = ci(local, 165, 195);

  // Pourcentage draw-on pour l'annotation
  const drawPct = Math.round(drawProgress * 100);

  return (
    <svg width={W} height={H}>
      <BaseMap countries={countries} highlightIso={[ISO_IRAN, ISO_ISRAEL]} dimOthers />

      {/* Draw-on frontiere Iran */}
      {iranFeature && (
        <path
          d={iranFeature.path}
          fill="none"
          stroke={P.accent}
          strokeWidth={3.5}
          strokeDasharray={IRAN_PATH_LEN}
          strokeDashoffset={iranDashOff}
          strokeLinecap="round"
        />
      )}

      {/* Pulse 3 rings — phase initiale */}
      {!useLoop && (
        <>
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={r1R} fill="none" stroke={P.accent} strokeWidth={2.5} opacity={r1O} />
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={r2R} fill="none" stroke={P.accent} strokeWidth={2}   opacity={r2O} />
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={r3R} fill="none" stroke={P.accent} strokeWidth={1.5} opacity={r3O} />
        </>
      )}
      {/* Pulse en boucle */}
      {useLoop && (
        <>
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={lr1R} fill="none" stroke={P.accent} strokeWidth={2.5} opacity={lr1O} />
          <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={lr2R} fill="none" stroke={P.accent} strokeWidth={2}   opacity={lr2O} />
        </>
      )}

      {/* Point central */}
      <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={8}
        fill={P.accent} stroke={P.white} strokeWidth={2} opacity={ci(local, 60, 90)} />
      <text x={pt_natanz[0] + 16} y={pt_natanz[1] + 6}
        fontFamily="Arial, sans-serif" fontSize={18} fontWeight="700"
        fill={P.white} opacity={ci(local, 70, 100)}>Natanz</text>

      <CityDot x={pt_iran[0]} y={pt_iran[1]} color={P.iranStroke} label="IRAN" appear={iranLbl} />
      <CityDot x={pt_israel[0]} y={pt_israel[1]} color={P.israelStroke} label="ISRAEL" appear={israelLbl} />

      {/* Vignette */}
      <defs>
        <radialGradient id="vig3" cx="50%" cy="48%" r="60%">
          <stop offset="40%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.62} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vig3)" />

      {/* === ANNOTATIONS === */}
      {/* Draw-on */}
      <EffectTag
        x={pt_iran[0] - 30} y={pt_iran[1] + 120}
        label="Draw-on frontiere"
        code={`dashOffset: ${IRAN_PATH_LEN} -> 0  (${drawPct}%)`}
        appear={annotDraw}
        side="right"
        color={P.accent}
      />

      {/* Pulse ring 1 */}
      <EffectTag
        x={pt_natanz[0] + 45} y={pt_natanz[1] - 20}
        label="Pulse — ring 1"
        code={`r: 12->90px  opacity: 0.8->0`}
        appear={annotPulse}
        side="right"
        color={P.cyan}
      />

      {/* Boucle */}
      {useLoop && (
        <EffectTag
          x={pt_natanz[0] + 45} y={pt_natanz[1] + 60}
          label="Boucle infinie"
          code={`(local - 160) % 80  — 2 rings decales`}
          appear={annotLoop}
          side="right"
          color={P.gold}
        />
      )}

      {/* Header */}
      <SeqHeader
        num="03"
        title="Draw-on + Pulse rings"
        desc="strokeDashoffset frontiere — 3 rings cascade"
        color={P.accent}
      />

      {/* Footer */}
      <SeqFooter
        local={local}
        color={P.accent}
        lines={[
          `strokeDasharray=${IRAN_PATH_LEN}  dashOffset: ${IRAN_PATH_LEN}->0`,
          `ring cascade : offset +20f entre chaque ring`,
          `boucle : (local - 160) % 80 — repete indefiniment`,
        ]}
      />
    </svg>
  );
}

// =============================================================
// SEQ 4 — TRANSITION ZOOM-BLUR CUSTOM
// =============================================================
function SceneA({ countries }: { countries: CountryFeature[] }) {
  const pt_iran   = PROJ_BASE(COORDS.tehran)  as [number, number];
  const pt_israel = PROJ_BASE(COORDS.telaviv) as [number, number];
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <BaseMap countries={countries} highlightIso={[ISO_IRAN]} dimOthers />
        <CityDot x={pt_iran[0]}   y={pt_iran[1]}   color={P.iranStroke}   label="IRAN"   appear={1} />
        <CityDot x={pt_israel[0]} y={pt_israel[1]} color={P.israelStroke} label="ISRAEL" appear={1} />
        {/* Badge scene */}
        <rect x={W/2 - 120} y={H*0.55} width={240} height={56} rx={12} fill={P.iranStroke} opacity={0.92} />
        <text x={W/2} y={H*0.55 + 36} textAnchor="middle"
          fontFamily="'Arial Black', sans-serif" fontSize={26} fontWeight="900" fill={P.white}>
          SCENE A
        </text>
        <defs>
          <radialGradient id="vigA" cx="50%" cy="48%" r="60%">
            <stop offset="40%" stopColor="black" stopOpacity={0} />
            <stop offset="100%" stopColor="black" stopOpacity={0.62} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#vigA)" />
      </svg>
    </AbsoluteFill>
  );
}

function SceneB({ countries }: { countries: CountryFeature[] }) {
  const pt_natanz = PROJ_BASE(COORDS.natanz) as [number, number];
  const pt_iran   = PROJ_BASE(COORDS.tehran) as [number, number];
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <BaseMap countries={countries} highlightIso={[ISO_ISRAEL]} dimOthers />
        <CityDot x={pt_natanz[0]} y={pt_natanz[1]} color={P.accent}     label="NATANZ" appear={1} />
        <CityDot x={pt_iran[0]}   y={pt_iran[1]}   color={P.iranStroke} label="IRAN"   appear={1} />
        <rect x={W/2 - 120} y={H*0.55} width={240} height={56} rx={12} fill={P.accent} opacity={0.92} />
        <text x={W/2} y={H*0.55 + 36} textAnchor="middle"
          fontFamily="'Arial Black', sans-serif" fontSize={26} fontWeight="900" fill={P.white}>
          SCENE B
        </text>
        <defs>
          <radialGradient id="vigB" cx="50%" cy="48%" r="60%">
            <stop offset="40%" stopColor="black" stopOpacity={0} />
            <stop offset="100%" stopColor="black" stopOpacity={0.65} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#vigB)" />
      </svg>
    </AbsoluteFill>
  );
}

function Seq4Transition({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 3);

  const SCENE_DUR = 100;
  const TRANS     = 18; // duree de la transition en frames (~0.6s)

  const inTrans1  = local >= SCENE_DUR && local < SCENE_DUR + TRANS;
  const inSceneB  = local >= SCENE_DUR + TRANS && local < SCENE_DUR * 2 + TRANS;
  const inTrans2  = local >= SCENE_DUR * 2 + TRANS && local < SCENE_DUR * 2 + TRANS * 2;
  const inSceneA2 = local >= SCENE_DUR * 2 + TRANS * 2;

  const t1 = ci(local, SCENE_DUR, SCENE_DUR + TRANS);
  const t2 = ci(local, SCENE_DUR * 2 + TRANS, SCENE_DUR * 2 + TRANS * 2);

  // Scene sortante : scale up + blur
  const scaleOut1 = interpolate(t1, [0, 1], [1, 1.12]);
  const blurOut1  = interpolate(t1, [0, 1], [0, 8]);
  const opOut1    = interpolate(t1, [0, 1], [1, 0]);
  // Scene entrante : scale down + fade in
  const scaleIn1 = interpolate(t1, [0, 1], [1.08, 1]);
  const opIn1    = interpolate(t1, [0, 1], [0, 1]);

  const scaleOut2 = interpolate(t2, [0, 1], [1, 1.12]);
  const blurOut2  = interpolate(t2, [0, 1], [0, 8]);
  const opOut2    = interpolate(t2, [0, 1], [1, 0]);
  const scaleIn2  = interpolate(t2, [0, 1], [1.08, 1]);
  const opIn2     = interpolate(t2, [0, 1], [0, 1]);

  // Annotations
  const annotScenes  = ci(local, 5, 30);
  const annotTrans1  = ci(local, SCENE_DUR + 2, SCENE_DUR + 20);

  // Valeurs live pendant la transition
  const liveScale = inTrans1 ? scaleOut1.toFixed(3) : inTrans2 ? scaleOut2.toFixed(3) : "1.000";
  const liveBlur  = inTrans1 ? blurOut1.toFixed(1)  : inTrans2 ? blurOut2.toFixed(1)  : "0.0";
  const liveOp    = inTrans1 ? opOut1.toFixed(2)     : inTrans2 ? opOut2.toFixed(2)    : "1.00";

  return (
    <AbsoluteFill>
      {/* Scene A */}
      {!inSceneB && !inSceneA2 && (
        <AbsoluteFill style={{
          transform: `scale(${inTrans1 ? scaleOut1 : inTrans2 ? scaleIn2 : 1})`,
          opacity: inTrans1 ? opOut1 : inTrans2 ? opIn2 : 1,
          filter: inTrans1 ? `blur(${blurOut1}px)` : "none",
          transformOrigin: "center center",
        }}>
          <SceneA countries={countries} />
        </AbsoluteFill>
      )}

      {/* Scene B entrant */}
      {(inTrans1 || inSceneB || inTrans2) && (
        <AbsoluteFill style={{
          transform: `scale(${inTrans1 ? scaleIn1 : inTrans2 ? scaleOut2 : 1})`,
          opacity: inTrans1 ? opIn1 : inTrans2 ? opOut2 : 1,
          filter: inTrans2 ? `blur(${blurOut2}px)` : "none",
          transformOrigin: "center center",
        }}>
          <SceneB countries={countries} />
        </AbsoluteFill>
      )}

      {/* Scene A retour */}
      {inSceneA2 && (
        <AbsoluteFill>
          <SceneA countries={countries} />
        </AbsoluteFill>
      )}

      {/* === ANNOTATIONS (par-dessus tout) === */}
      <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>

        {/* Compteur live pendant la transition */}
        {(inTrans1 || inTrans2) && (
          <g>
            <rect x={30} y={H * 0.62} width={380} height={110} rx={10}
              fill={P.dark} stroke={P.gold} strokeWidth={1.5} opacity={0.95} />
            <text x={44} y={H * 0.62 + 28}
              fontFamily="'Courier New', monospace" fontSize={15} fill={P.gold}>
              VALEURS LIVE :
            </text>
            <text x={44} y={H * 0.62 + 52}
              fontFamily="'Courier New', monospace" fontSize={15} fill={P.white} opacity={0.85}>
              {`scale:   ${liveScale}`}
            </text>
            <text x={44} y={H * 0.62 + 72}
              fontFamily="'Courier New', monospace" fontSize={15} fill={P.cyan} opacity={0.85}>
              {`blur:    ${liveBlur}px`}
            </text>
            <text x={44} y={H * 0.62 + 92}
              fontFamily="'Courier New', monospace" fontSize={15} fill={P.accent} opacity={0.85}>
              {`opacity: ${liveOp}`}
            </text>
          </g>
        )}

        {/* Annotation scenes */}
        <EffectTag
          x={W * 0.5} y={H * 0.55 + 80}
          label="Deux scenes independantes"
          code={`<SceneA> et <SceneB> — AbsoluteFill`}
          appear={annotScenes}
          side="left"
          color={P.cyan}
        />

        {/* Annotation transition */}
        {(inTrans1 || inTrans2) && (
          <EffectTag
            x={W * 0.5} y={H * 0.35}
            label="Transition zoom-blur"
            code={`${TRANS} frames = ${(TRANS / 30 * 1000).toFixed(0)}ms`}
            appear={annotTrans1}
            side="left"
            color={P.gold}
          />
        )}

        {/* Header */}
        <SeqHeader
          num="04"
          title="Transition Zoom-Blur"
          desc="scale 1->1.12 + CSS blur 0->8px — 18 frames"
          color={P.gold}
        />

        {/* Footer */}
        <SeqFooter
          local={local}
          color={P.gold}
          lines={[
            `TRANS = 18 frames (600ms) — modifiable a 8-30f`,
            `scale 1->1.12 + blur 0->8px : sortant`,
            `scale 1.08->1 + opacity 0->1 : entrant`,
          ]}
        />
      </svg>
    </AbsoluteFill>
  );
}

// =============================================================
// SEQ 5 — TOUT ENSEMBLE (reference finale)
// =============================================================
function Seq5All({ countries, rawGeo, frame }: {
  countries: CountryFeature[];
  rawGeo: GeoJSON.FeatureCollection | null;
  frame: number;
}) {
  const local = lf(frame, 4);
  const { fps } = useVideoConfig();

  if (!rawGeo) return null;

  // Zoom CSS transform fluide (0-150f) — meme pattern que Seq2
  const ease  = Easing.inOut(Easing.cubic);
  const zoomT = ease(ci(local, 0, 150));

  const zoomScale = interpolate(zoomT, [0, 1], [1, 2.6]);
  const invScale  = 1 / zoomScale;

  // Cible du zoom : centre Moyen-Orient
  const ptIran   = PROJ_BASE(COORDS.tehran)  as [number, number];
  const ptIsrael = PROJ_BASE(COORDS.telaviv) as [number, number];
  const ptNatanz = PROJ_BASE(COORDS.natanz)  as [number, number];

  const targetX = interpolate(zoomT, [0, 1], [W / 2, W / 2]);
  const targetY = interpolate(zoomT, [0, 1], [H / 2, H * 0.42]);

  const mapTransform = `
    translate(${targetX}, ${targetY})
    scale(${zoomScale})
    translate(${-targetX}, ${-targetY})
  `;

  const hatchOp = ci(local, 60, 120, 0, 0.5);

  const lp    = local > 120 ? ((local - 120) % 70) : 0;
  const lr1t  = ci(lp, 0, 55); const lr1R = interpolate(lr1t,[0,1],[10,80]); const lr1O = interpolate(lr1t,[0,1],[0.75,0]);
  const lr2t  = ci(lp, 18, 70); const lr2R = interpolate(lr2t,[0,1],[10,80]); const lr2O = interpolate(lr2t,[0,1],[0.6,0]);

  const lIran   = spring({ frame: Math.max(0, local - 80),  fps, config: { damping: 20, stiffness: 160 } });
  const lIsrael = spring({ frame: Math.max(0, local - 100), fps, config: { damping: 20, stiffness: 160 } });

  const iranFeature  = countries.find(c => c.id === ISO_IRAN);
  const IRAN_LEN     = 3200;
  const drawT        = ci(local, 70, 180);
  const iranOffset   = interpolate(drawT, [0, 1], [IRAN_LEN, 0]);
  const statReveal   = ci(local, 220, 250);

  return (
    <svg width={W} height={H}>
      <defs>
        <pattern id="hatch-all" patternUnits="userSpaceOnUse" width={10} height={10}
          patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={P.iranStroke} strokeWidth={2.5} />
        </pattern>
        <radialGradient id="vig5" cx="50%" cy="48%" r="60%">
          <stop offset="40%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.65} />
        </radialGradient>
      </defs>

      {/* Groupe carte — CSS transform fluide */}
      <g transform={mapTransform}>
        <BaseMap countries={countries} />

        {/* Draw-on frontiere Iran */}
        {iranFeature && (
          <path d={iranFeature.path} fill="none" stroke={P.accent} strokeWidth={2.5}
            strokeDasharray={IRAN_LEN} strokeDashoffset={iranOffset} strokeLinecap="round" />
        )}

        {/* Hachures Iran */}
        {countries.filter(c => c.id === ISO_IRAN).map(c => (
          <path key="ha" d={c.path} fill="url(#hatch-all)" opacity={hatchOp} />
        ))}

        {/* Pulse Natanz — contre-compense */}
        {local > 120 && (
          <g transform={`translate(${ptNatanz[0]}, ${ptNatanz[1]})`}>
            <circle r={lr1R * invScale} fill="none" stroke={P.accent} strokeWidth={2.5} opacity={lr1O} />
            <circle r={lr2R * invScale} fill="none" stroke={P.accent} strokeWidth={2}   opacity={lr2O} />
            <circle r={8 * invScale} fill={P.accent} stroke={P.white} strokeWidth={2} />
          </g>
        )}

        {/* Labels — contre-compenses */}
        <g transform={`translate(${ptIran[0]}, ${ptIran[1]}) scale(${invScale})`} opacity={lIran}>
          <circle r={7} fill={P.iranStroke} stroke={P.white} strokeWidth={2} />
          <rect x={12} y={-18} width={88} height={28} rx={5} fill={P.dark} opacity={0.88} />
          <text x={20} y={0} fontFamily="'Arial Black', sans-serif" fontSize={18} fontWeight="900" fill={P.white}>IRAN</text>
        </g>
        <g transform={`translate(${ptIsrael[0]}, ${ptIsrael[1]}) scale(${invScale})`} opacity={lIsrael}>
          <circle r={7} fill={P.israelStroke} stroke={P.white} strokeWidth={2} />
          <rect x={12} y={-18} width={104} height={28} rx={5} fill={P.dark} opacity={0.88} />
          <text x={20} y={0} fontFamily="'Arial Black', sans-serif" fontSize={18} fontWeight="900" fill={P.white}>ISRAEL</text>
        </g>
      </g>

      {/* Stat distance — hors du groupe zoome */}
      {statReveal > 0 && (
        <g opacity={statReveal}>
          <rect x={(ptIran[0]+ptIsrael[0])/2 - 95} y={H * 0.58}
            width={190} height={52} rx={10} fill={P.dark} opacity={0.92} />
          <text x={(ptIran[0]+ptIsrael[0])/2} y={H * 0.58 + 34}
            textAnchor="middle" fontFamily="'Arial Black', sans-serif"
            fontSize={28} fill={P.gold} fontWeight="900">
            1 703 km
          </text>
        </g>
      )}

      <rect width={W} height={H} fill="url(#vig5)" />

      {/* Legende des effets actifs */}
      <g opacity={ci(local, 20, 50)}>
        <rect x={30} y={140} width={380} height={160} rx={10} fill={P.dark} opacity={0.9} />
        <text x={50} y={170} fontFamily="'Arial Black', sans-serif" fontSize={16} fontWeight="900" fill={P.gold}>
          EFFETS ACTIFS :
        </text>
        {[
          { color: P.green,  label: "Zoom CSS transform fluide" },
          { color: P.cyan,   label: "Hachures SVG pattern" },
          { color: P.accent, label: "Draw-on frontiere" },
          { color: P.gold,   label: "Pulse rings (boucle)" },
          { color: P.white,  label: "Vignette radialGradient" },
        ].map(({ color, label }, i) => (
          <g key={i}>
            <circle cx={50} cy={192 + i * 24} r={5} fill={color} />
            <text x={64} y={197 + i * 24}
              fontFamily="Arial, sans-serif" fontSize={15} fill={P.white} opacity={0.85}>
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* Header */}
      <SeqHeader
        num="05"
        title="Reference finale"
        desc="Tous les effets simultanement"
        color={P.gold}
      />

      {/* Footer */}
      <SeqFooter
        local={local}
        color={P.gold}
        lines={[
          "Zoom D3 + Hachures + Draw-on + Pulse + Vignette",
          "Copier-coller chaque effet dans les vrais Shorts",
        ]}
      />
    </svg>
  );
}

// =============================================================
// COMPOSITION PRINCIPALE
// =============================================================
export function GeoAdvancedV2() {
  const frame = useCurrentFrame();
  const { countries, rawGeo } = useMapData();
  const seg = Math.floor(frame / SEG);

  return (
    <AbsoluteFill style={{ background: P.dark }}>
      {seg === 0 && <Seq1Hatch    countries={countries} frame={frame} />}
      {seg === 1 && <Seq2Zoom     countries={countries} frame={frame} />}
      {seg === 2 && <Seq3Effects  countries={countries} frame={frame} />}
      {seg === 3 && <Seq4Transition countries={countries} frame={frame} />}
      {seg === 4 && <Seq5All      countries={countries} rawGeo={rawGeo} frame={frame} />}
    </AbsoluteFill>
  );
}

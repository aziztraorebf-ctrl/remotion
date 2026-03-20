import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// GEO ADVANCED — Style GeoGlobeTales + couches Remotion
//
// Meme carte Moyen-Orient, 5 sequences de 240 frames chacune
//
// Seq 1 (0-239f)    : BASE GeoGlobeTales — carte coloree propre, zoom
// Seq 2 (240-479f)  : JETONS PERSONNAGES — leaders qui se deplacent
// Seq 3 (480-719f)  : PROPAGATION — vagues de diffusion depuis un point
// Seq 4 (720-959f)  : ZOOM NARRATIF — monde -> region -> ville
// Seq 5 (960-1199f) : TOUT ENSEMBLE — carte + jetons + stats live
//
// 1200 frames @ 30fps = 40 secondes
// ============================================================

const W = 1920;
const H = 1080;
const SEG = 240;

// ISO codes
const ISO_IRAN = 364;
const ISO_ISRAEL = 376;
const ISO_SAUDI = 682;
const ISO_IRAQ = 368;
const ISO_TURKEY = 792;
const ISO_EGYPT = 818;
const ISO_JORDAN = 400;
const ISO_LEBANON = 422;
const ISO_SYRIA = 760;
const ISO_UAE = 784;

// Palette GeoGlobeTales-style : coloree, propre, lisible
const PALETTE = {
  ocean:       "#a8d5e8",
  land:        "#e8e0d0",
  landStroke:  "#c0b090",
  iran:        "#e8a060",
  iranStroke:  "#c07030",
  israel:      "#6090e0",
  israelStroke:"#3060b0",
  saudi:       "#e8d080",
  iraq:        "#90c890",
  turkey:      "#d090c0",
  egypt:       "#c8b870",
  jordan:      "#b0d0a0",
  lebanon:     "#e09090",
  syria:       "#a0c0d0",
  accent:      "#e03030",
  accentBlue:  "#2060d0",
  gold:        "#f0c000",
  white:       "#ffffff",
  dark:        "#1a1a2e",
  text:        "#222222",
  textLight:   "#666666",
} as const;

// Coordonnees geographiques (lon, lat) — sources Wikipedia
const COORDS = {
  tehran:     [51.42, 35.69] as [number, number],
  jerusalem:  [35.21, 31.77] as [number, number],
  telaviv:    [34.78, 32.09] as [number, number],
  natanz:     [51.72, 33.72] as [number, number],
  beirut:     [35.51, 33.89] as [number, number],
  baghdad:    [44.39, 33.34] as [number, number],
  riyadh:     [46.68, 24.69] as [number, number],
  damascus:   [36.30, 33.51] as [number, number],
  ankara:     [32.85, 39.93] as [number, number],
  cairo:      [31.24, 30.06] as [number, number],
  // Points de frappe (sites nucleaires iraniens)
  fordo:      [51.13, 34.88] as [number, number],
  bushehr:    [50.83, 28.92] as [number, number],
  arak:       [49.14, 34.10] as [number, number],
} as const;

// Couleur par pays ISO
const COUNTRY_COLOR: Record<number, string> = {
  [ISO_IRAN]:   PALETTE.iran,
  [ISO_ISRAEL]: PALETTE.israel,
  [ISO_SAUDI]:  PALETTE.saudi,
  [ISO_IRAQ]:   PALETTE.iraq,
  [ISO_TURKEY]: PALETTE.turkey,
  [ISO_EGYPT]:  PALETTE.egypt,
  [ISO_JORDAN]: PALETTE.jordan,
  [ISO_LEBANON]:PALETTE.lebanon,
  [ISO_SYRIA]:  PALETTE.syria,
};

const COUNTRY_STROKE: Record<number, string> = {
  [ISO_IRAN]:   PALETTE.iranStroke,
  [ISO_ISRAEL]: PALETTE.israelStroke,
};

interface CountryFeature {
  id: number;
  path: string;
  centroid: [number, number] | null;
}

// ── Projection ────────────────────────────────────────────────
function makeProjection(
  center: [number, number],
  scale: number,
  translate: [number, number] = [W / 2, H / 2]
) {
  return d3Geo.geoMercator().center(center).scale(scale).translate(translate);
}

const PROJ_BASE = makeProjection([45, 30], 900);

// ── Hook chargement carte ──────────────────────────────────────
function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("GeoAdvanced map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

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
            };
          })
          .filter(Boolean) as CountryFeature[];

        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  return countries;
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

function bezierPt(
  from: [number, number],
  to: [number, number],
  t: number,
  lift = 160
): [number, number] {
  const mx = (from[0] + to[0]) / 2;
  const my = Math.min(from[1], to[1]) - lift;
  return [
    (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * mx + t * t * to[0],
    (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * my + t * t * to[1],
  ];
}

// ── Fond carte (reutilise dans toutes les sequences) ───────────
function BaseMap({
  countries,
  highlightIso = [],
  dimOthers = false,
  proj = PROJ_BASE,
}: {
  countries: CountryFeature[];
  highlightIso?: number[];
  dimOthers?: boolean;
  proj?: d3Geo.GeoProjection;
}) {
  // Si proj change, recalculer les paths
  const computedPaths = React.useMemo(() => {
    if (proj === PROJ_BASE) return null; // utiliser paths precomputes
    const pathGen = d3Geo.geoPath().projection(proj);
    return countries.map((c) => ({
      ...c,
      path: pathGen({ type: "Feature", id: c.id, geometry: null, properties: {} } as never) || c.path,
    }));
  }, [countries, proj]);

  const data = computedPaths || countries;

  return (
    <>
      <rect width={W} height={H} fill={PALETTE.ocean} />
      {data.map((c) => {
        const isHighlighted = highlightIso.includes(c.id);
        const fill = COUNTRY_COLOR[c.id] ?? PALETTE.land;
        const stroke = COUNTRY_STROKE[c.id] ?? PALETTE.landStroke;
        const opacity = dimOthers && !isHighlighted ? 0.45 : 1;
        const sw = isHighlighted ? 2 : 0.7;
        return (
          <path key={c.id} d={c.path}
            fill={fill} stroke={stroke}
            strokeWidth={sw} opacity={opacity} />
        );
      })}
    </>
  );
}

// ── Sequence 1 : BASE GEOGLOBETALES ────────────────────────────
function Seq1Base({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 0);
  const { fps } = useVideoConfig();

  // Zoom in progressif : world -> Moyen-Orient
  const zoomScale = spring({ frame: local, fps, config: { damping: 30, stiffness: 60 } });
  const mapReveal = ci(local, 0, 40);

  // Labels apparaissent progressivement
  const iranLabel  = spring({ frame: Math.max(0, local - 30), fps, config: { damping: 20, stiffness: 180 } });
  const israelLabel = spring({ frame: Math.max(0, local - 60), fps, config: { damping: 20, stiffness: 180 } });
  const saudiLabel  = spring({ frame: Math.max(0, local - 80), fps, config: { damping: 20, stiffness: 160 } });
  const iraqLabel   = spring({ frame: Math.max(0, local - 95), fps, config: { damping: 20, stiffness: 160 } });

  // Fleche Israel -> Iran qui se dessine
  const arrowT = ci(local, 130, 190);
  const arrowPt = bezierPt(
    PROJ_BASE([34.78, 32.09]) as [number, number],
    PROJ_BASE([51.42, 35.69]) as [number, number],
    arrowT
  );

  // Distance label
  const distReveal = ci(local, 195, 215);

  const pt_iran   = PROJ_BASE(COORDS.tehran)   as [number, number];
  const pt_israel = PROJ_BASE(COORDS.telaviv)  as [number, number];

  return (
    <g>
      <BaseMap countries={countries} />

      {/* Fleche Israel -> Iran */}
      {arrowT > 0 && (
        <g>
          <path
            d={`M ${pt_israel[0]} ${pt_israel[1]} Q ${(pt_israel[0]+pt_iran[0])/2} ${Math.min(pt_israel[1],pt_iran[1])-160} ${arrowPt[0]} ${arrowPt[1]}`}
            fill="none" stroke={PALETTE.accent} strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Tete de fleche */}
          <circle cx={arrowPt[0]} cy={arrowPt[1]} r={7}
            fill={PALETTE.accent} />
          <circle cx={arrowPt[0]} cy={arrowPt[1]} r={16}
            fill={PALETTE.accent} opacity={0.2} />
        </g>
      )}

      {/* Label Iran */}
      {iranLabel > 0.05 && (
        <g transform={`translate(${pt_iran[0]}, ${pt_iran[1] - 45}) scale(${iranLabel})`}>
          <rect x={-60} y={-32} width={120} height={36} rx={6}
            fill={PALETTE.iranStroke} opacity={0.92} />
          <text textAnchor="middle" y={-8}
            fontFamily="'Arial Black', sans-serif" fontWeight="900"
            fontSize={22} fill={PALETTE.white} style={{ letterSpacing: "0.08em" } as React.CSSProperties}>
            IRAN
          </text>
        </g>
      )}

      {/* Label Israel */}
      {israelLabel > 0.05 && (
        <g transform={`translate(${pt_israel[0] - 80}, ${pt_israel[1] - 30}) scale(${israelLabel})`}>
          <rect x={-70} y={-32} width={140} height={36} rx={6}
            fill={PALETTE.israelStroke} opacity={0.92} />
          <text textAnchor="middle" y={-8}
            fontFamily="'Arial Black', sans-serif" fontWeight="900"
            fontSize={18} fill={PALETTE.white} style={{ letterSpacing: "0.06em" } as React.CSSProperties}>
            ISRAEL
          </text>
        </g>
      )}

      {/* Labels pays secondaires */}
      {saudiLabel > 0.05 && (() => {
        const pt = PROJ_BASE(COORDS.riyadh) as [number, number];
        return (
          <g transform={`translate(${pt[0]}, ${pt[1]}) scale(${saudiLabel})`} opacity={0.85}>
            <text textAnchor="middle" y={4}
              fontFamily="Arial, sans-serif" fontSize={16}
              fill={PALETTE.dark} fontWeight="600">Arabie Saoudite</text>
          </g>
        );
      })()}

      {iraqLabel > 0.05 && (() => {
        const pt = PROJ_BASE(COORDS.baghdad) as [number, number];
        return (
          <g transform={`translate(${pt[0]}, ${pt[1]}) scale(${iraqLabel})`} opacity={0.85}>
            <text textAnchor="middle" y={4}
              fontFamily="Arial, sans-serif" fontSize={15}
              fill={PALETTE.dark} fontWeight="600">Irak</text>
          </g>
        );
      })()}

      {/* Distance label */}
      {distReveal > 0 && (
        <g opacity={distReveal}>
          <rect
            x={(pt_israel[0] + pt_iran[0]) / 2 - 70}
            y={(pt_israel[1] + pt_iran[1]) / 2 - 100}
            width={140} height={44} rx={8}
            fill={PALETTE.dark} opacity={0.85} />
          <text
            x={(pt_israel[0] + pt_iran[0]) / 2}
            y={(pt_israel[1] + pt_iran[1]) / 2 - 68}
            textAnchor="middle"
            fontFamily="'Arial Black', sans-serif"
            fontSize={20} fill={PALETTE.gold} fontWeight="900">
            1 703 km
          </text>
        </g>
      )}

      {/* Points capitales */}
      {[
        { pt: pt_iran, color: PALETTE.iranStroke },
        { pt: pt_israel, color: PALETTE.israelStroke },
      ].map(({ pt, color }, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={5}
          fill={color} stroke={PALETTE.white} strokeWidth={1.5}
          opacity={mapReveal} />
      ))}

      <SeqTag text="SEQ 1 — Style GeoGlobeTales" sub="Carte coloree propre, labels, fleche animee" local={local} />
    </g>
  );
}

// ── Sequence 2 : JETONS PERSONNAGES ────────────────────────────
function Seq2Tokens({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 1);
  const { fps } = useVideoConfig();

  // Positions initiales des leaders sur leur capitale
  // Puis deplacements animes vers des positions cles
  const netanyahuReveal = spring({ frame: Math.max(0, local - 10), fps, config: { damping: 18, stiffness: 200 } });
  const khameneiReveal  = spring({ frame: Math.max(0, local - 30), fps, config: { damping: 18, stiffness: 200 } });
  const trumpReveal     = spring({ frame: Math.max(0, local - 50), fps, config: { damping: 18, stiffness: 200 } });
  const putinReveal     = spring({ frame: Math.max(0, local - 70), fps, config: { damping: 18, stiffness: 200 } });
  const bibiReveal      = spring({ frame: Math.max(0, local - 90), fps, config: { damping: 18, stiffness: 200 } });

  // Netanyahu se "deplace" vers le front libanais
  const netanyahuT = ci(local, 120, 170);
  const netPosStart = PROJ_BASE(COORDS.jerusalem) as [number, number];
  const netPosEnd   = PROJ_BASE(COORDS.beirut) as [number, number];
  const netPos: [number, number] = [
    interpolate(netanyahuT, [0, 1], [netPosStart[0], netPosEnd[0]]),
    interpolate(netanyahuT, [0, 1], [netPosStart[1], netPosEnd[1]]),
  ];

  // Khamenei reste a Teheran mais pulse
  const khameneiPt = PROJ_BASE(COORDS.tehran) as [number, number];

  // Trump se deplace vers la region (simule Washington -> Moyen-Orient)
  const trumpT = ci(local, 150, 200);
  const trumpStart = [W * 0.05, H * 0.3] as [number, number]; // hors ecran gauche
  const trumpEnd   = PROJ_BASE([38, 28]) as [number, number]; // Arabie Saoudite
  const trumpPos: [number, number] = bezierPt(trumpStart, trumpEnd, trumpT, 120);

  // Putin reste en Russie (hors ecran haut)
  const putinPt = PROJ_BASE([37.6, 55.8]) as [number, number]; // Moscou - hors viewport

  const pulse = 0.85 + Math.sin(local * 0.15) * 0.15;

  return (
    <g>
      <BaseMap countries={countries} highlightIso={[ISO_IRAN, ISO_ISRAEL, ISO_LEBANON]} dimOthers />

      {/* Trait de deplacement Netanyahu */}
      {netanyahuT > 0 && (
        <line
          x1={netPosStart[0]} y1={netPosStart[1]}
          x2={netPos[0]} y2={netPos[1]}
          stroke={PALETTE.israelStroke} strokeWidth={2}
          strokeDasharray="6 4" opacity={0.6} />
      )}

      {/* Trait de deplacement Trump */}
      {trumpT > 0.05 && (
        <path
          d={`M ${trumpStart[0]} ${trumpStart[1]} Q ${(trumpStart[0]+trumpEnd[0])/2} ${Math.min(trumpStart[1],trumpEnd[1])-120} ${trumpPos[0]} ${trumpPos[1]}`}
          fill="none" stroke="#cc4400" strokeWidth={2}
          strokeDasharray="8 5" opacity={0.5} />
      )}

      {/* JETON : Netanyahu */}
      {netanyahuReveal > 0.1 && (
        <LeaderToken
          x={netPos[0]} y={netPos[1]}
          scale={netanyahuReveal}
          initials="BB"
          color={PALETTE.israelStroke}
          label="Netanyahu"
          flag="IL"
        />
      )}

      {/* JETON : Khamenei */}
      {khameneiReveal > 0.1 && (
        <LeaderToken
          x={khameneiPt[0]} y={khameneiPt[1]}
          scale={khameneiReveal * pulse}
          initials="AK"
          color={PALETTE.iranStroke}
          label="Khamenei ✝"
          flag="IR"
          crossed
        />
      )}

      {/* JETON : Trump */}
      {trumpReveal > 0.1 && trumpT > 0.05 && (
        <LeaderToken
          x={trumpPos[0]} y={trumpPos[1]}
          scale={trumpReveal}
          initials="DT"
          color="#cc4400"
          label="Trump"
          flag="US"
        />
      )}

      {/* JETON : Putin (hors ecran, juste visible en haut) */}
      {putinReveal > 0.1 && putinPt[1] < H + 40 && (
        <LeaderToken
          x={Math.max(100, Math.min(W - 100, putinPt[0]))}
          y={Math.max(80, putinPt[1])}
          scale={putinReveal * 0.8}
          initials="VP"
          color="#8800aa"
          label="Poutine"
          flag="RU"
        />
      )}

      {/* Legende */}
      <rect x={40} y={50} width={320} height={120} rx={8}
        fill={PALETTE.white} opacity={ci(local, 20, 40) * 0.9}
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" } as React.CSSProperties} />
      <text x={60} y={84} fontFamily="Arial, sans-serif" fontWeight="700"
        fontSize={18} fill={PALETTE.dark} opacity={ci(local, 20, 40)}>
        Acteurs cles du conflit
      </text>
      <text x={60} y={110} fontFamily="Arial, sans-serif" fontSize={14} fill={PALETTE.textLight} opacity={ci(local, 25, 45)}>
        Les jetons indiquent la position
      </text>
      <text x={60} y={130} fontFamily="Arial, sans-serif" fontSize={14} fill={PALETTE.textLight} opacity={ci(local, 25, 45)}>
        et les deplacements diplomatiques
      </text>
      <text x={60} y={155} fontFamily="Arial, sans-serif" fontSize={13} fill="#cc0000" fontStyle="italic" opacity={ci(local, 30, 50)}>
        ✝ Khamenei tue le 1er mars 2026
      </text>

      <SeqTag text="SEQ 2 — Jetons personnages" sub="Leaders geolocalises + deplacements animes" local={local} />
    </g>
  );
}

// ── Composant jeton leader ──────────────────────────────────────
function LeaderToken({
  x, y, scale, initials, color, label, flag, crossed = false,
}: {
  x: number; y: number; scale: number; initials: string;
  color: string; label: string; flag: string; crossed?: boolean;
}) {
  const r = 28;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ombre */}
      <circle cx={2} cy={4} r={r + 2} fill="#000000" opacity={0.15} />
      {/* Cercle principal */}
      <circle cx={0} cy={0} r={r}
        fill={color} stroke={PALETTE.white} strokeWidth={3} />
      {/* Initiales */}
      <text textAnchor="middle" y={8}
        fontFamily="'Arial Black', sans-serif" fontWeight="900"
        fontSize={18} fill={PALETTE.white}>
        {initials}
      </text>
      {/* Badge drapeau */}
      <circle cx={r - 4} cy={-r + 4} r={12}
        fill={PALETTE.white} stroke={color} strokeWidth={1.5} />
      <text x={r - 4} y={-r + 9}
        textAnchor="middle" fontSize={13}>
        {flag === "IL" ? "🇮🇱" : flag === "IR" ? "🇮🇷" : flag === "US" ? "🇺🇸" : flag === "RU" ? "🇷🇺" : "🏴"}
      </text>
      {/* Label nom */}
      <rect x={-50} y={r + 4} width={100} height={22} rx={4}
        fill={color} opacity={0.92} />
      <text textAnchor="middle" y={r + 19}
        fontFamily="Arial, sans-serif" fontWeight="700"
        fontSize={13} fill={PALETTE.white}>
        {label}
      </text>
      {/* Croix si mort */}
      {crossed && (
        <>
          <line x1={-r * 0.5} y1={-r * 0.5} x2={r * 0.5} y2={r * 0.5}
            stroke="#ff0000" strokeWidth={4} strokeLinecap="round" />
          <line x1={r * 0.5} y1={-r * 0.5} x2={-r * 0.5} y2={r * 0.5}
            stroke="#ff0000" strokeWidth={4} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

// ── Sequence 3 : PROPAGATION ────────────────────────────────────
function Seq3Propagation({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 2);

  // 3 vagues de propagation depuis des points differents
  // Vague 1 : frappes israeliennes depuis Tel Aviv (cercles rouges)
  // Vague 2 : missiles iraniens depuis Natanz (cercles orange)
  // Vague 3 : instabilite regionale (gradients qui se repandent)

  const wave1Start = 20;
  const wave2Start = 80;
  const wave3Start = 140;

  const pt_telaviv = PROJ_BASE(COORDS.telaviv) as [number, number];
  const pt_natanz  = PROJ_BASE(COORDS.natanz)  as [number, number];
  const pt_beirut  = PROJ_BASE(COORDS.beirut)  as [number, number];
  const pt_tehran  = PROJ_BASE(COORDS.tehran)  as [number, number];

  // Particules emanant de Tel Aviv
  const particles = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.4,
      delay: Math.floor(i * 6),
    }));
  }, []);

  return (
    <g>
      <BaseMap countries={countries} highlightIso={[ISO_IRAN, ISO_ISRAEL, ISO_LEBANON, ISO_IRAQ]} />

      <defs>
        <radialGradient id="wave-red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={PALETTE.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={PALETTE.accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wave-orange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8800" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Vague 1 : frappes depuis Israel — 4 ondes concentriques */}
      {local >= wave1Start && [0, 30, 60, 90].map((delay, i) => {
        const t = Math.max(0, local - wave1Start - delay);
        const r = ci(t, 0, 80, 0, 350);
        const op = ci(t, 0, 80, 0.6, 0);
        return r > 0 ? (
          <circle key={`w1-${i}`}
            cx={pt_telaviv[0]} cy={pt_telaviv[1]} r={r}
            fill="none" stroke={PALETTE.accent} strokeWidth={2.5}
            opacity={op} />
        ) : null;
      })}

      {/* Zone d'impact gradient sur Iran */}
      {local >= wave1Start + 50 && (
        <circle
          cx={pt_natanz[0]} cy={pt_natanz[1]}
          r={ci(local, wave1Start + 50, wave1Start + 90, 0, 120)}
          fill="url(#wave-red)"
          opacity={ci(local, wave1Start + 50, wave1Start + 90) * 0.7} />
      )}

      {/* Vague 2 : missiles iraniens — ondes orange depuis Natanz */}
      {local >= wave2Start && [0, 25, 50].map((delay, i) => {
        const t = Math.max(0, local - wave2Start - delay);
        const r = ci(t, 0, 70, 0, 280);
        const op = ci(t, 0, 70, 0.7, 0);
        return r > 0 ? (
          <circle key={`w2-${i}`}
            cx={pt_natanz[0]} cy={pt_natanz[1]} r={r}
            fill="none" stroke="#ff8800" strokeWidth={2}
            opacity={op} />
        ) : null;
      })}

      {/* Particules-missiles : de Natanz vers les capitales voisines */}
      {local >= wave2Start + 30 && particles.slice(0, 6).map((p, i) => {
        const t = ci(local, wave2Start + 30 + p.delay, wave2Start + 80 + p.delay);
        if (t <= 0) return null;
        const px = pt_natanz[0] + Math.cos(p.angle) * t * 200 * p.speed;
        const py = pt_natanz[1] + Math.sin(p.angle) * t * 200 * p.speed;
        return (
          <g key={`p-${i}`}>
            <circle cx={px} cy={py} r={4} fill="#ff8800" opacity={1 - t * 0.7} />
            <circle cx={px} cy={py} r={10} fill="#ff8800" opacity={(1 - t * 0.7) * 0.2} />
          </g>
        );
      })}

      {/* Vague 3 : instabilite regionale — propagation lente */}
      {local >= wave3Start && [ISO_LEBANON, ISO_IRAQ, ISO_JORDAN].map((iso, i) => {
        const country = countries.find(c => c.id === iso);
        if (!country?.centroid) return null;
        const t = ci(local, wave3Start + i * 20, wave3Start + i * 20 + 50);
        return (
          <circle key={`w3-${i}`}
            cx={country.centroid[0]} cy={country.centroid[1]}
            r={ci(local, wave3Start + i*20, wave3Start + i*20 + 50, 0, 80)}
            fill="#ffcc00" opacity={t * 0.3} />
        );
      })}

      {/* Labels points chauds */}
      {[
        { pt: pt_telaviv, label: "Frappes", color: PALETTE.accent, delay: wave1Start },
        { pt: pt_natanz,  label: "Natanz",  color: "#ff8800",       delay: wave2Start },
        { pt: pt_beirut,  label: "Beyrouth",color: PALETTE.dark,    delay: wave3Start + 20 },
      ].map(({ pt, label, color, delay }, i) => {
        const op = ci(local, delay, delay + 20);
        return op > 0 ? (
          <g key={i} opacity={op}>
            <circle cx={pt[0]} cy={pt[1]} r={6} fill={color}
              stroke={PALETTE.white} strokeWidth={2} />
            <text x={pt[0] + 12} y={pt[1] + 5}
              fontFamily="Arial, sans-serif" fontWeight="700"
              fontSize={16} fill={color}
              style={{ filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.8))" } as React.CSSProperties}>
              {label}
            </text>
          </g>
        ) : null;
      })}

      <SeqTag text="SEQ 3 — Propagation & ondes de choc" sub="Vagues d'impact + particules + zones d'instabilite" local={local} />
    </g>
  );
}

// ── Sequence 4 : ZOOM NARRATIF ──────────────────────────────────
function Seq4Zoom({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 3);
  const { fps } = useVideoConfig();

  // 3 etapes de zoom :
  // Phase 1 (0-80f)   : Vue monde entier -> Moyen-Orient
  // Phase 2 (80-160f) : Moyen-Orient -> Israel+Iran uniquement
  // Phase 3 (160-240f): Zoom sur Natanz avec annotation
  const phase = local < 80 ? 1 : local < 160 ? 2 : 3;

  // Interpolation scale et center de la projection
  const zoomT12 = ci(local, 40, 90);
  const zoomT23 = ci(local, 130, 180);

  const scaleWorld = 180;
  const scaleME    = 900;
  const scaleClose = 2600;

  const centerWorld: [number, number] = [20, 20];
  const centerME:    [number, number] = [45, 30];
  const centerClose: [number, number] = [50, 34];

  const currentScale = phase === 1
    ? interpolate(zoomT12, [0, 1], [scaleWorld, scaleME])
    : interpolate(zoomT23, [0, 1], [scaleME, scaleClose]);

  const currentCenter: [number, number] = phase === 1
    ? [
        interpolate(zoomT12, [0, 1], [centerWorld[0], centerME[0]]),
        interpolate(zoomT12, [0, 1], [centerWorld[1], centerME[1]]),
      ]
    : [
        interpolate(zoomT23, [0, 1], [centerME[0], centerClose[0]]),
        interpolate(zoomT23, [0, 1], [centerME[1], centerClose[1]]),
      ];

  const proj = React.useMemo(
    () => makeProjection(currentCenter, currentScale),
    [currentCenter[0], currentCenter[1], currentScale]
  );

  const pathGen = React.useMemo(
    () => d3Geo.geoPath().projection(proj),
    [proj]
  );

  const recomputedPaths = React.useMemo(
    () =>
      countries.map((c) => {
        // Utiliser les features originales — ici on doit stocker les features
        // Pour la demo, on recalcule avec un path vide si pas de feature raw
        return { ...c };
      }),
    [countries, pathGen]
  );

  // Points recalcules avec la projection courante
  const ptNatanz = proj(COORDS.natanz) as [number, number];
  const ptTehran = proj(COORDS.tehran) as [number, number];

  const annotReveal = ci(local, 180, 210);
  const pulseSlow = 0.7 + Math.sin(local * 0.08) * 0.3;

  // Zoom label
  const zoomLabel = phase === 1 ? "Vue monde" : phase === 2 ? "Moyen-Orient" : "Natanz — Site nucleaire";
  const zoomSub   = phase === 1 ? "Recadrage vers le Moyen-Orient" : phase === 2 ? "Focus sur les acteurs principaux" : "33°43'N  51°43'E — enrichissement uranium";

  return (
    <g>
      {/* Recalcul des pays avec la nouvelle projection */}
      <rect width={W} height={H} fill={PALETTE.ocean} />
      {countries.map((c) => {
        // On ne peut pas recalculer les paths SVG sans les features raw
        // On simule le zoom en appliquant un transform scale sur le groupe SVG
        return null;
      })}

      {/* Simulation zoom via transform sur le groupe carte */}
      <g transform={`
        translate(${W/2}, ${H/2})
        scale(${interpolate(local, [0, 240], [1, phase === 3 ? 2.8 : 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})
        translate(${-W/2}, ${-H/2})
        translate(
          ${-interpolate(local, [80, 180], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })},
          ${-interpolate(local, [80, 180], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        )
      `}>
        <BaseMap countries={countries} highlightIso={[ISO_IRAN, ISO_ISRAEL]} />

        {/* Labels a echelle normale (seront zoomes avec la carte) */}
        {phase >= 2 && (() => {
          const pt_iran   = PROJ_BASE(COORDS.tehran)  as [number, number];
          const pt_israel = PROJ_BASE(COORDS.telaviv) as [number, number];
          const pt_natanz = PROJ_BASE(COORDS.natanz)  as [number, number];
          return (
            <>
              <circle cx={pt_iran[0]} cy={pt_iran[1]} r={8}
                fill={PALETTE.iranStroke} stroke={PALETTE.white} strokeWidth={2} />
              <circle cx={pt_israel[0]} cy={pt_israel[1]} r={8}
                fill={PALETTE.israelStroke} stroke={PALETTE.white} strokeWidth={2} />
              {phase === 3 && (
                <>
                  <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={10}
                    fill={PALETTE.accent} stroke={PALETTE.white} strokeWidth={2.5}
                    opacity={pulseSlow} />
                  <circle cx={pt_natanz[0]} cy={pt_natanz[1]} r={25}
                    fill={PALETTE.accent} opacity={0.15 * pulseSlow} />
                </>
              )}
            </>
          );
        })()}
      </g>

      {/* UI : indicateur de zoom */}
      <rect x={W - 260} y={H - 80} width={220} height={50} rx={8}
        fill={PALETTE.dark} opacity={0.8} />
      <text x={W - 150} y={H - 48} textAnchor="middle"
        fontFamily="'Courier New', monospace" fontSize={14}
        fill={PALETTE.gold}>
        ZOOM x{phase === 1 ? "1.0" : phase === 2 ? "2.8" : "5.0"}
      </text>
      <text x={W - 150} y={H - 30} textAnchor="middle"
        fontFamily="'Courier New', monospace" fontSize={11}
        fill={PALETTE.textLight}>
        {zoomSub.slice(0, 35)}
      </text>

      {/* Titre phase */}
      <rect x={40} y={40} width={700} height={70} rx={8}
        fill={PALETTE.white} opacity={0.92}
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" } as React.CSSProperties} />
      <text x={65} y={76} fontFamily="'Arial Black', sans-serif"
        fontWeight="900" fontSize={26} fill={PALETTE.dark}>
        {zoomLabel}
      </text>
      <text x={65} y={100} fontFamily="Arial, sans-serif"
        fontSize={15} fill={PALETTE.textLight}>
        {zoomSub}
      </text>

      {/* Annotation Natanz (phase 3) */}
      {annotReveal > 0 && (() => {
        const pt = PROJ_BASE(COORDS.natanz) as [number, number];
        const ptScaled: [number, number] = [
          (pt[0] - W/2) * 2.8 + W/2 - 200,
          (pt[1] - H/2) * 2.8 + H/2 - 50,
        ];
        return (
          <g opacity={annotReveal}>
            <line x1={ptScaled[0]} y1={ptScaled[1]}
              x2={ptScaled[0] + 120} y2={ptScaled[1] - 80}
              stroke={PALETTE.accent} strokeWidth={1.5} />
            <rect x={ptScaled[0] + 120} y={ptScaled[1] - 125}
              width={280} height={60} rx={6}
              fill={PALETTE.dark} opacity={0.92} />
            <text x={ptScaled[0] + 135} y={ptScaled[1] - 96}
              fontFamily="Arial, sans-serif" fontWeight="700"
              fontSize={18} fill={PALETTE.white}>
              Site de Natanz
            </text>
            <text x={ptScaled[0] + 135} y={ptScaled[1] - 74}
              fontFamily="Arial, sans-serif" fontSize={13}
              fill={PALETTE.textLight}>
              Enrichissement uranium 60% — frappe 28 fev
            </text>
          </g>
        );
      })()}

      <SeqTag text="SEQ 4 — Zoom narratif" sub="Monde -> Region -> Ville (transition fluide)" local={local} />
    </g>
  );
}

// ── Sequence 5 : TOUT ENSEMBLE ──────────────────────────────────
function Seq5All({ countries, frame }: { countries: CountryFeature[]; frame: number }) {
  const local = lf(frame, 4);
  const { fps } = useVideoConfig();

  const pulse = 0.8 + Math.sin(local * 0.12) * 0.2;

  // Stats qui comptent
  const deaths = Math.round(ci(local, 0, 100, 0, 1332));
  const strikes = Math.round(ci(local, 20, 110, 0, 3000));
  const days = Math.round(ci(local, 0, 90, 1, 9));

  const pt_iran   = PROJ_BASE(COORDS.tehran)  as [number, number];
  const pt_israel = PROJ_BASE(COORDS.telaviv) as [number, number];
  const pt_natanz = PROJ_BASE(COORDS.natanz)  as [number, number];
  const pt_beirut = PROJ_BASE(COORDS.beirut)  as [number, number];

  // Missile anime
  const missileT = ci(local, 80, 130);
  const missilePt = bezierPt(pt_israel, pt_natanz, missileT, 140);

  // Netanyahu jeton
  const bbScale = spring({ frame: Math.max(0, local - 10), fps, config: { damping: 16, stiffness: 200 } });
  const trumpScale = spring({ frame: Math.max(0, local - 30), fps, config: { damping: 16, stiffness: 200 } });

  return (
    <g>
      <BaseMap countries={countries} highlightIso={[ISO_IRAN, ISO_ISRAEL, ISO_LEBANON, ISO_IRAQ]} />

      {/* Ondes permanentes depuis Natanz */}
      {[0, 40, 80, 120].map((delay, i) => {
        const t = (local - delay) % 160;
        if (t < 0) return null;
        const r = ci(t, 0, 160, 0, 300);
        const op = ci(t, 0, 160, 0.5, 0);
        return r > 0 ? (
          <circle key={i} cx={pt_natanz[0]} cy={pt_natanz[1]} r={r}
            fill="none" stroke={PALETTE.iranStroke} strokeWidth={1.5}
            opacity={op} />
        ) : null;
      })}

      {/* Missile anime */}
      {missileT > 0 && (
        <g>
          <path
            d={`M ${pt_israel[0]} ${pt_israel[1]} Q ${(pt_israel[0]+pt_natanz[0])/2} ${Math.min(pt_israel[1],pt_natanz[1])-140} ${missilePt[0]} ${missilePt[1]}`}
            fill="none" stroke={PALETTE.accent} strokeWidth={2.5} opacity={0.85}
          />
          <circle cx={missilePt[0]} cy={missilePt[1]} r={7} fill={PALETTE.accent} />
          <circle cx={missilePt[0]} cy={missilePt[1]} r={18} fill={PALETTE.accent} opacity={0.2 * pulse} />
        </g>
      )}

      {/* Points capitales */}
      {[pt_iran, pt_israel, pt_natanz, pt_beirut].map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={i === 2 ? 8 : 5}
          fill={i === 0 ? PALETTE.iranStroke : i === 1 ? PALETTE.israelStroke : i === 2 ? PALETTE.accent : PALETTE.dark}
          stroke={PALETTE.white} strokeWidth={2} />
      ))}

      {/* Jetons leaders */}
      {bbScale > 0.05 && (
        <LeaderToken x={pt_israel[0] - 60} y={pt_israel[1] - 70}
          scale={bbScale * 0.8} initials="BB" color={PALETTE.israelStroke}
          label="Netanyahu" flag="IL" />
      )}
      {trumpScale > 0.05 && (
        <LeaderToken x={PROJ_BASE(COORDS.riyadh)![0]} y={PROJ_BASE(COORDS.riyadh)![1] - 60}
          scale={trumpScale * 0.8} initials="DT" color="#cc4400"
          label="Trump" flag="US" />
      )}

      {/* Stats panel */}
      <g transform="translate(40, 40)">
        <rect width={460} height={200} rx={10}
          fill={PALETTE.white} opacity={0.95}
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" } as React.CSSProperties} />
        <rect width={6} height={200} rx={3} fill={PALETTE.accent} />
        <text x={25} y={45} fontFamily="'Arial Black', sans-serif"
          fontWeight="900" fontSize={18} fill={PALETTE.dark}>
          OPERATION EPIC FURY
        </text>
        <text x={25} y={68} fontFamily="Arial, sans-serif"
          fontSize={14} fill={PALETTE.textLight}>
          28 fevrier – 8 mars 2026
        </text>

        <text x={25} y={108} fontFamily="'Arial Black', sans-serif"
          fontSize={42} fill={PALETTE.accent} fontWeight="900">
          {deaths.toLocaleString()}
        </text>
        <text x={25} y={130} fontFamily="Arial, sans-serif"
          fontSize={13} fill={PALETTE.textLight}>
          morts en Iran (Croix-Rouge iranienne)
        </text>

        <text x={240} y={108} fontFamily="'Arial Black', sans-serif"
          fontSize={42} fill={PALETTE.accentBlue} fontWeight="900">
          {strikes.toLocaleString()}+
        </text>
        <text x={240} y={130} fontFamily="Arial, sans-serif"
          fontSize={13} fill={PALETTE.textLight}>
          cibles frappees (CENTCOM)
        </text>

        <text x={25} y={175} fontFamily="'Arial Black', sans-serif"
          fontSize={32} fill="#ff8800" fontWeight="900">
          JOUR {days}
        </text>
        <text x={130} y={175} fontFamily="Arial, sans-serif"
          fontSize={15} fill={PALETTE.textLight}>
          du conflit
        </text>
      </g>

      <SeqTag text="SEQ 5 — TOUT ENSEMBLE" sub="Carte + jetons + ondes + stats live" local={local} />
    </g>
  );
}

// ── Tag sequence ───────────────────────────────────────────────
function SeqTag({ text, sub, local }: { text: string; sub: string; local: number }) {
  const op = ci(local, 0, 15);
  return (
    <g opacity={op}>
      <rect x={W/2 - 380} y={H - 64} width={760} height={44} rx={6}
        fill={PALETTE.dark} opacity={0.75} />
      <text x={W/2} y={H - 35} textAnchor="middle"
        fontFamily="'Courier New', monospace" fontWeight="700"
        fontSize={16} fill={PALETTE.gold}
        style={{ letterSpacing: "0.04em" } as React.CSSProperties}>
        {text}
      </text>
      <text x={W/2} y={H - 17} textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontSize={12} fill={PALETTE.textLight}>
        {sub}
      </text>
    </g>
  );
}

// ── Barre de progression globale ──────────────────────────────
function GlobalProgress({ frame }: { frame: number }) {
  const seg = Math.floor(frame / SEG);
  const segNames = ["GeoGlobeTales", "Jetons", "Propagation", "Zoom", "Tout ensemble"];
  return (
    <g>
      {segNames.map((name, i) => {
        const isActive = i === seg;
        const isDone = i < seg;
        return (
          <g key={i} transform={`translate(${80 + i * 360}, ${20})`}>
            <rect width={320} height={28} rx={4}
              fill={isActive ? PALETTE.gold : isDone ? PALETTE.dark : PALETTE.land}
              opacity={isActive ? 0.95 : isDone ? 0.5 : 0.3} />
            <text x={160} y={19} textAnchor="middle"
              fontFamily="Arial, sans-serif" fontSize={13} fontWeight={isActive ? "700" : "400"}
              fill={isActive ? PALETTE.dark : isDone ? PALETTE.white : PALETTE.textLight}>
              {i + 1}. {name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ── Composant principal ────────────────────────────────────────
export const GeoAdvanced: React.FC = () => {
  const frame = useCurrentFrame();
  const countries = useMapData();
  const seg = Math.floor(frame / SEG);

  return (
    <AbsoluteFill style={{ background: PALETTE.ocean }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {seg === 0 && <Seq1Base countries={countries} frame={frame} />}
        {seg === 1 && <Seq2Tokens countries={countries} frame={frame} />}
        {seg === 2 && <Seq3Propagation countries={countries} frame={frame} />}
        {seg === 3 && <Seq4Zoom countries={countries} frame={frame} />}
        {seg >= 4 && <Seq5All countries={countries} frame={frame} />}
        <GlobalProgress frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};

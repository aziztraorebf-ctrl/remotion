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
// GEO LAB B&W — Test style carte N&B avec touche de couleur
//
// Concept : carte Moyen-Orient en niveaux de gris.
// Un pays cle s'allume progressivement en couleur accent.
// 3 sequences de 100 frames chacune :
//   Seq 1 (0-99f)   : Iran seul s'allume (rouge)
//   Seq 2 (100-199f): Israel seul s'allume (bleu)
//   Seq 3 (200-299f): Les deux + trajectoire de frappe
//
// Questions testees :
//   - La carte est-elle lisible en N&B ?
//   - La touche de couleur guide-t-elle l'oeil efficacement ?
//   - Le style est-il visuellement distinctif ?
//
// 300 frames @ 30fps = 10 secondes
// Format : 1920x1080 (adapter en 1080x1920 pour Shorts = juste les dimensions)
// ============================================================

// ISO numeric codes (TopoJSON world-110m standard)
// Source : https://en.wikipedia.org/wiki/ISO_3166-1_numeric
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
const ISO_KUWAIT = 414;
const ISO_QATAR = 634;
const ISO_OMAN = 512;

// Couleurs
const BG = "#111111";
const LAND_GRAY = "#2a2a2a";
const LAND_STROKE = "#444444";
const OCEAN = "#0d0d0d";
const ACCENT_RED = "#e63946";    // Iran
const ACCENT_BLUE = "#4361ee";   // Israel
const ACCENT_GOLD = "#ffd166";   // label / trajectoire
const TEXT_DIM = "#888888";
const TEXT_BRIGHT = "#ffffff";

// Pays du Moyen-Orient a afficher (ignore les autres)
const MIDDLE_EAST_ISO = new Set([
  ISO_IRAN, ISO_ISRAEL, ISO_SAUDI, ISO_IRAQ, ISO_TURKEY,
  ISO_EGYPT, ISO_JORDAN, ISO_LEBANON, ISO_SYRIA,
  ISO_UAE, ISO_KUWAIT, ISO_QATAR, ISO_OMAN,
  // voisins utiles pour le contexte
  275, // Palestine
  31,  // Azerbaijan
  51,  // Armenia
  268, // Georgia
  400, // Jordan (deja la)
  887, // Yemen
  50,  // Bangladesh — non, mauvais. on garde ce qui est autour
]);

const W = 1920;
const H = 1080;

// Projection centree sur le Moyen-Orient
const ME_CENTER: [number, number] = [45, 28];
const ME_SCALE = 900;

interface CountryFeature {
  id: number;
  path: string;
  centroid: [number, number] | null;
}

// ── Composant carte ──────────────────────────────────────────
function MiddleEastMap({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("Loading ME map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topology) => {
        const countriesGeo = topojson.feature(
          topology,
          topology.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const projection = d3Geo
          .geoMercator()
          .center(ME_CENTER)
          .scale(ME_SCALE)
          .translate([W / 2, H / 2]);

        const pathGen = d3Geo.geoPath().projection(projection);

        const features: CountryFeature[] = [];
        for (const feature of countriesGeo.features) {
          const isoId = Number(feature.id);
          // Filtrer : garder seulement pays dans la region visible
          const d = pathGen(feature);
          if (!d) continue;
          const centroid = pathGen.centroid(feature);
          features.push({
            id: isoId,
            path: d,
            centroid: centroid && isFinite(centroid[0]) ? centroid as [number, number] : null,
          });
        }

        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  // ── Timing sequences ────────────────────────────────────────
  // Seq 1 : Iran s'allume (0-99)
  const iranReveal = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Seq 2 : Israel s'allume (100-199)
  const israelReveal = interpolate(frame, [110, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Seq 3 : trajectoire de frappe (200-299)
  const strikeProgress = interpolate(frame, [210, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsation sur les pays actifs
  const pulse = 0.85 + Math.sin(frame * 0.15) * 0.15;

  // Spring pour le label "IRAN"
  const iranLabelScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 18, stiffness: 220 },
  });
  const israelLabelScale = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 18, stiffness: 220 },
  });

  // Coordonnees projetees pour la trajectoire Israel -> Iran
  const projection = React.useMemo(
    () =>
      d3Geo
        .geoMercator()
        .center(ME_CENTER)
        .scale(ME_SCALE)
        .translate([W / 2, H / 2]),
    []
  );

  // Capitales approximatives
  const tehranProj = projection([51.4, 35.7]);
  const telAvivProj = projection([34.8, 32.1]);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Fond ocean */}
      <rect width={W} height={H} fill={OCEAN} />

      {/* Pays */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;

        // Couleur de remplissage
        let fillColor = LAND_GRAY;
        let fillOpacity = 1;
        let strokeColor = LAND_STROKE;
        let strokeWidth = 0.5;

        if (isIran && iranReveal > 0) {
          fillColor = ACCENT_RED;
          fillOpacity = iranReveal * pulse;
          strokeColor = ACCENT_RED;
          strokeWidth = 1.5;
        } else if (isIsrael && israelReveal > 0) {
          fillColor = ACCENT_BLUE;
          fillOpacity = israelReveal * pulse;
          strokeColor = ACCENT_BLUE;
          strokeWidth = 1.5;
        }

        return (
          <path
            key={c.id}
            d={c.path}
            fill={fillColor}
            fillOpacity={fillOpacity}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      })}

      {/* Trajectoire de frappe : arc Israel -> Iran */}
      {strikeProgress > 0 && tehranProj && telAvivProj && (
        <StrikePath
          from={telAvivProj as [number, number]}
          to={tehranProj as [number, number]}
          progress={strikeProgress}
          color={ACCENT_GOLD}
        />
      )}

      {/* Label IRAN */}
      {iranReveal > 0.3 && (
        <g
          transform={`translate(${tehranProj ? tehranProj[0] : W * 0.65}, ${
            tehranProj ? tehranProj[1] - 40 : H * 0.35
          }) scale(${iranLabelScale})`}
        >
          <text
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize={28}
            fill={ACCENT_RED}
            opacity={iranReveal}
            style={{ letterSpacing: "0.15em" } as React.CSSProperties}
          >
            IRAN
          </text>
        </g>
      )}

      {/* Label ISRAEL */}
      {israelReveal > 0.3 && (
        <g
          transform={`translate(${telAvivProj ? telAvivProj[0] - 60 : W * 0.45}, ${
            telAvivProj ? telAvivProj[1] - 30 : H * 0.5
          }) scale(${israelLabelScale})`}
        >
          <text
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize={22}
            fill={ACCENT_BLUE}
            opacity={israelReveal}
            style={{ letterSpacing: "0.12em" } as React.CSSProperties}
          >
            ISRAEL
          </text>
        </g>
      )}

      {/* Label trajectoire */}
      {strikeProgress > 0.5 && tehranProj && telAvivProj && (
        <text
          x={(tehranProj[0] + telAvivProj[0]) / 2}
          y={(tehranProj[1] + telAvivProj[1]) / 2 - 60}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize={16}
          fill={ACCENT_GOLD}
          opacity={interpolate(strikeProgress, [0.5, 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          style={{ letterSpacing: "0.1em" } as React.CSSProperties}
        >
          ~1 700 km
        </text>
      )}

      {/* Titre sequence */}
      <SequenceLabel frame={frame} />

      {/* Barre de progression */}
      <ProgressBar frame={frame} />
    </svg>
  );
}

// ── Arc de trajectoire de frappe ────────────────────────────
function StrikePath({
  from,
  to,
  progress,
  color,
}: {
  from: [number, number];
  to: [number, number];
  progress: number;
  color: string;
}) {
  // Arc quadratique avec point de controle en hauteur
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - 180;

  // Approximer la progression sur le chemin en interpolant les points
  const t = progress;
  // Point courant sur la bezier quadratique : B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
  const curX =
    Math.pow(1 - t, 2) * from[0] +
    2 * (1 - t) * t * midX +
    Math.pow(t, 2) * to[0];
  const curY =
    Math.pow(1 - t, 2) * from[1] +
    2 * (1 - t) * t * midY +
    Math.pow(t, 2) * to[1];

  const fullPath = `M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`;

  return (
    <g>
      {/* Trace complet en pointille dim */}
      <path
        d={fullPath}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="6 4"
        opacity={0.25}
      />
      {/* Ligne progressive */}
      <path
        d={`M ${from[0]} ${from[1]} Q ${midX} ${midY} ${curX} ${curY}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.9}
      />
      {/* Tete de missile */}
      <circle cx={curX} cy={curY} r={5} fill={color} opacity={0.95} />
      <circle cx={curX} cy={curY} r={12} fill={color} opacity={0.2} />
      {/* Origine (Tel Aviv) */}
      <circle cx={from[0]} cy={from[1]} r={4} fill={color} opacity={0.7} />
    </g>
  );
}

// ── Label de sequence ────────────────────────────────────────
function SequenceLabel({ frame }: { frame: number }) {
  const label =
    frame < 100
      ? "Seq 1 — Iran seul (couleur accent)"
      : frame < 200
      ? "Seq 2 — Israel seul (couleur accent)"
      : "Seq 3 — Trajectoire de frappe";

  const sub =
    frame < 100
      ? "Tous les autres pays restent en gris"
      : frame < 200
      ? "Iran reste colore, Israel s'allume"
      : "Arc Israel -> Iran avec distance";

  const accentColor =
    frame < 100 ? ACCENT_RED : frame < 200 ? ACCENT_BLUE : ACCENT_GOLD;

  return (
    <g>
      <rect x={40} y={30} width={600} height={76} rx={6} fill="#000000" opacity={0.6} />
      <text
        x={60}
        y={66}
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize={22}
        fill={accentColor}
        style={{ letterSpacing: "0.05em" } as React.CSSProperties}
      >
        GEO LAB B&W — {label}
      </text>
      <text
        x={60}
        y={92}
        fontFamily="Georgia, serif"
        fontSize={16}
        fill={TEXT_DIM}
      >
        {sub}
      </text>
    </g>
  );
}

// ── Barre de progression ─────────────────────────────────────
function ProgressBar({ frame }: { frame: number }) {
  const progress = interpolate(frame, [0, 299], [0, W - 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g>
      <rect x={40} y={H - 18} width={W - 80} height={4} fill="#222222" rx={2} />
      <rect x={40} y={H - 18} width={progress} height={4} fill={ACCENT_GOLD} rx={2} opacity={0.8} />
      {/* Marqueurs sequences */}
      {[1, 2].map((i) => (
        <line
          key={i}
          x1={40 + (W - 80) * (i / 3)}
          y1={H - 24}
          x2={40 + (W - 80) * (i / 3)}
          y2={H - 10}
          stroke={TEXT_DIM}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────
export const GeoLabBW: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG }}>
      <MiddleEastMap frame={frame} />
    </AbsoluteFill>
  );
};

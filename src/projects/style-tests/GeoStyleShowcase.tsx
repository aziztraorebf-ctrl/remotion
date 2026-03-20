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
// GEO STYLE SHOWCASE — 7 variations visuelles, meme carte
//
// Meme contenu : Moyen-Orient, Iran + Israel, trajectoire
// 7 styles, 100 frames chacun = 700 frames @ 30fps ~ 23s
//
// Var 1 (0-99f)    : BREAKING NEWS — fond noir, rouge vif, scanlines
// Var 2 (100-199f) : MAGAZINE — fond creme, encres douces, typographie serif
// Var 3 (200-299f) : RADAR MILITAIRE — fond vert terminal, grille scanline
// Var 4 (300-399f) : ATLAS HISTORIQUE — fond papier, hachures, encre sepia
// Var 5 (400-499f) : DATA JOURNALISME — fond blanc, minimaliste, chiffres cles
// Var 6 (500-599f) : NEON CYBER — fond tres sombre, lueurs neon, glow
// Var 7 (600-699f) : COMPARAISON TAILLE — Iran vs France superpose, echelle reelle
// ============================================================

const W = 1920;
const H = 1080;
const SEG = 300;

// ISO codes
const ISO_IRAN = 364;
const ISO_ISRAEL = 376;
const ISO_FRANCE = 250;
const ISO_SAUDI = 682;
const ISO_IRAQ = 368;
const ISO_TURKEY = 792;
const ISO_EGYPT = 818;
const ISO_JORDAN = 400;
const ISO_LEBANON = 422;
const ISO_SYRIA = 760;
const ISO_UAE = 784;
const ISO_KUWAIT = 414;

// Projection Moyen-Orient
const ME_CENTER: [number, number] = [45, 28];
const ME_SCALE = 900;

interface CountryFeature {
  id: number;
  path: string;
  centroid: [number, number] | null;
}

// ── Hook de chargement carte (partage entre toutes les variations) ──
function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("GeoShowcase map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topology) => {
        const geo = topojson.feature(
          topology,
          topology.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const proj = d3Geo
          .geoMercator()
          .center(ME_CENTER)
          .scale(ME_SCALE)
          .translate([W / 2, H / 2]);

        const pathGen = d3Geo.geoPath().projection(proj);

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

// Projection partagee pour les coordonnees
const PROJ = d3Geo
  .geoMercator()
  .center(ME_CENTER)
  .scale(ME_SCALE)
  .translate([W / 2, H / 2]);

const PT_TEHRAN = PROJ([51.4, 35.7]) as [number, number];
const PT_TELAVIV = PROJ([34.8, 32.1]) as [number, number];
const PT_NATANZ = PROJ([51.7, 33.7]) as [number, number];   // site nucleaire
const PT_BEIRUT = PROJ([35.5, 33.9]) as [number, number];

// ── Arc bezier quadratique ───────────────────────────────────
function bezierPoint(
  from: [number, number],
  to: [number, number],
  t: number,
  arcHeight = 180
): [number, number] {
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - arcHeight;
  const x =
    Math.pow(1 - t, 2) * from[0] +
    2 * (1 - t) * t * midX +
    t * t * to[0];
  const y =
    Math.pow(1 - t, 2) * from[1] +
    2 * (1 - t) * t * midY +
    t * t * to[1];
  return [x, y];
}

// ── Helpers timing ──────────────────────────────────────────
function localFrame(frame: number, segIndex: number) {
  return frame - segIndex * SEG;
}

function fadeIn(lf: number, start = 0, end = 20) {
  return interpolate(lf, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function reveal(lf: number, start = 5, end = 50) {
  return interpolate(lf, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── VARIATION 1 : BREAKING NEWS ──────────────────────────────
function Var1BreakingNews({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 0);
  const { fps } = useVideoConfig();

  const iranReveal = reveal(lf, 5, 45);
  const israelReveal = reveal(lf, 35, 65);
  const strikeT = interpolate(lf, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strikePt = bezierPoint(PT_TELAVIV, PT_NATANZ, strikeT);
  const pulse = 0.8 + Math.sin(lf * 0.2) * 0.2;

  // Scanlines : lignes horizontales dim
  const scanlines = React.useMemo(() => {
    const lines: React.ReactElement[] = [];
    for (let y = 0; y < H; y += 4) {
      lines.push(
        <line key={y} x1={0} y1={y} x2={W} y2={y}
          stroke="#000000" strokeWidth={1.5} opacity={0.18} />
      );
    }
    return lines;
  }, []);

  const flashOp = interpolate(lf, [0, 3, 6], [1, 0.3, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <g>
      {/* Fond */}
      <rect width={W} height={H} fill="#0a0a0a" />

      {/* Pays */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        let fill = "#1e1e1e";
        let stroke = "#333333";
        let sw = 0.5;
        if (isIran && iranReveal > 0) {
          fill = "#cc2200";
          stroke = "#ff3311";
          sw = 2;
        } else if (isIsrael && israelReveal > 0) {
          fill = "#003399";
          stroke = "#2255ff";
          sw = 2;
        }
        return (
          <path key={c.id} d={c.path}
            fill={fill} fillOpacity={isIran ? iranReveal * pulse : isIsrael ? israelReveal : 1}
            stroke={stroke} strokeWidth={sw} />
        );
      })}

      {/* Radar rings sur Natanz */}
      {[1, 2, 3].map((i) => {
        const r = interpolate(lf, [40, 80], [0, 60 * i], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return r > 0 ? (
          <circle key={i} cx={PT_NATANZ[0]} cy={PT_NATANZ[1]} r={r}
            fill="none" stroke="#ff3311"
            strokeWidth={i === 1 ? 1.5 : 0.8}
            opacity={(0.7 - i * 0.15) * pulse} />
        ) : null;
      })}

      {/* Trajectoire */}
      {strikeT > 0 && (
        <g>
          <path
            d={`M ${PT_TELAVIV[0]} ${PT_TELAVIV[1]} Q ${(PT_TELAVIV[0] + PT_NATANZ[0]) / 2} ${Math.min(PT_TELAVIV[1], PT_NATANZ[1]) - 180} ${strikePt[0]} ${strikePt[1]}`}
            fill="none" stroke="#ffcc00" strokeWidth={2.5} opacity={0.9}
          />
          <circle cx={strikePt[0]} cy={strikePt[1]} r={6} fill="#ffcc00" />
          <circle cx={strikePt[0]} cy={strikePt[1]} r={14} fill="#ffcc00" opacity={0.25} />
        </g>
      )}

      {/* Labels */}
      {iranReveal > 0.4 && (
        <text x={PT_TEHRAN[0] + 20} y={PT_TEHRAN[1] - 30}
          fontFamily="'Arial Black', sans-serif" fontWeight="900"
          fontSize={32} fill="#ff3311" opacity={iranReveal}
          style={{ letterSpacing: "0.12em" } as React.CSSProperties}>
          IRAN
        </text>
      )}
      {israelReveal > 0.4 && (
        <text x={PT_TELAVIV[0] - 90} y={PT_TELAVIV[1] - 20}
          fontFamily="'Arial Black', sans-serif" fontWeight="900"
          fontSize={24} fill="#4477ff" opacity={israelReveal}
          style={{ letterSpacing: "0.1em" } as React.CSSProperties}>
          ISRAEL
        </text>
      )}

      {/* Bandeaux BREAKING NEWS */}
      <rect x={0} y={H - 120} width={W} height={60} fill="#cc0000" opacity={fadeIn(lf, 10, 25)} />
      <text x={60} y={H - 78} fontFamily="'Arial Black', sans-serif"
        fontWeight="900" fontSize={34} fill="#ffffff"
        opacity={fadeIn(lf, 10, 25)}>
        BREAKING  |  OPERATION EPIC FURY — US-ISRAEL STRIKES ON IRAN
      </text>
      <rect x={0} y={H - 60} width={W} height={60} fill="#111111" opacity={fadeIn(lf, 10, 25) * 0.95} />
      <text x={60} y={H - 24} fontFamily="'Courier New', monospace"
        fontSize={22} fill="#aaaaaa" opacity={fadeIn(lf, 15, 30)}>
        28 FEB 2026  |  DAY 1  |  OPERATION EPIC FURY  |  3 000+ TARGETS HIT IN 9 DAYS
      </text>

      {/* Scanlines overlay */}
      {scanlines}

      {/* Flash entree */}
      {flashOp > 0 && <rect width={W} height={H} fill="#ffffff" opacity={flashOp} />}

      <StyleTag text="VAR 1 — BREAKING NEWS" color="#cc0000" lf={lf} />
    </g>
  );
}

// ── VARIATION 2 : MAGAZINE ───────────────────────────────────
function Var2Magazine({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 1);
  const { fps } = useVideoConfig();

  const mapReveal = reveal(lf, 0, 40);
  const iranReveal = reveal(lf, 20, 55);
  const israelReveal = reveal(lf, 45, 70);
  const textReveal = reveal(lf, 60, 85);

  const iranScale = spring({ frame: Math.max(0, lf - 20), fps,
    config: { damping: 20, stiffness: 180 } });

  return (
    <g>
      {/* Fond creme */}
      <rect width={W} height={H} fill="#f5f0e8" />
      {/* Texture grain legere */}
      <rect width={W} height={H} fill="url(#grain-mag)" opacity={0.04} />
      <defs>
        <filter id="grain-mag">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Bordure editoriale */}
      <rect x={30} y={30} width={W - 60} height={H - 60}
        fill="none" stroke="#2a2015" strokeWidth={2} opacity={mapReveal * 0.4} />
      <rect x={38} y={38} width={W - 76} height={H - 76}
        fill="none" stroke="#2a2015" strokeWidth={0.5} opacity={mapReveal * 0.2} />

      {/* Pays — palette sepia douce */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        let fill = "#c8b99a";
        let stroke = "#8a7055";
        let sw = 0.8;
        if (isIran && iranReveal > 0) {
          fill = "#8b1a00";
          stroke = "#6b1200";
          sw = 1.5;
        } else if (isIsrael && israelReveal > 0) {
          fill = "#00358b";
          stroke = "#002060";
          sw = 1.5;
        }
        return (
          <path key={c.id} d={c.path}
            fill={fill} fillOpacity={isIran ? iranReveal : isIsrael ? israelReveal : mapReveal * 0.8}
            stroke={stroke} strokeWidth={sw} />
        );
      })}

      {/* Pin Natanz */}
      {iranReveal > 0.5 && (
        <g opacity={iranReveal}>
          <circle cx={PT_NATANZ[0]} cy={PT_NATANZ[1]} r={8}
            fill="#8b1a00" stroke="#f5f0e8" strokeWidth={2} />
          <line x1={PT_NATANZ[0]} y1={PT_NATANZ[1] - 8}
            x2={PT_NATANZ[0]} y2={PT_NATANZ[1] - 40}
            stroke="#8b1a00" strokeWidth={1.5} />
          <text x={PT_NATANZ[0] + 12} y={PT_NATANZ[1] - 22}
            fontFamily="Georgia, serif" fontSize={14} fill="#8b1a00"
            fontStyle="italic">Natanz</text>
        </g>
      )}

      {/* Label droite : encadre editorial */}
      {textReveal > 0 && (
        <g opacity={textReveal}>
          <rect x={W - 420} y={140} width={360} height={280} rx={2}
            fill="#2a2015" opacity={0.06} />
          <rect x={W - 420} y={140} width={4} height={280}
            fill="#8b1a00" />
          <text x={W - 400} y={185}
            fontFamily="Georgia, serif" fontWeight="bold"
            fontSize={28} fill="#2a2015">
            IRAN
          </text>
          <text x={W - 400} y={210}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Superficie : 1 648 195 km²
          </text>
          <text x={W - 400} y={235}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Population : 89 millions
          </text>
          <text x={W - 400} y={260}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Enrichissement uranium : 60%
          </text>
          <line x1={W - 400} y1={278} x2={W - 72} y2={278}
            stroke="#8b1a00" strokeWidth={0.8} opacity={0.4} />
          <text x={W - 400} y={310}
            fontFamily="Georgia, serif" fontWeight="bold"
            fontSize={22} fill="#00358b">
            ISRAEL
          </text>
          <text x={W - 400} y={335}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Superficie : 20 770 km²
          </text>
          <text x={W - 400} y={360}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Population : 9,7 millions
          </text>
          <text x={W - 400} y={385}
            fontFamily="Georgia, serif" fontSize={15} fill="#6b5540">
            Distance Israel-Iran : ~1 700 km
          </text>
        </g>
      )}

      {/* Titre */}
      <text x={70} y={100}
        fontFamily="Georgia, serif" fontWeight="bold"
        fontSize={42} fill="#2a2015" opacity={fadeIn(lf, 0, 20)}
        style={{ letterSpacing: "-0.02em" } as React.CSSProperties}>
        Moyen-Orient
      </text>
      <text x={70} y={128}
        fontFamily="Georgia, serif" fontSize={18}
        fill="#6b5540" fontStyle="italic" opacity={fadeIn(lf, 5, 25)}>
        Geopolitique du conflit, mars 2026
      </text>

      <StyleTag text="VAR 2 — MAGAZINE" color="#8b1a00" lf={lf} />
    </g>
  );
}

// ── VARIATION 3 : RADAR MILITAIRE ───────────────────────────
function Var3Radar({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 2);

  const mapReveal = reveal(lf, 0, 30);
  const radarAngle = interpolate(lf, [0, 100], [0, Math.PI * 4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Grille terminale
  const grid = React.useMemo(() => {
    const lines: React.ReactElement[] = [];
    const sp = 80;
    for (let x = 0; x <= W; x += sp)
      lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H}
        stroke="#00ff41" strokeWidth={0.4} opacity={0.12} />);
    for (let y = 0; y <= H; y += sp)
      lines.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y}
        stroke="#00ff41" strokeWidth={0.4} opacity={0.12} />);
    return lines;
  }, []);

  const blipPulse = 0.6 + Math.sin(lf * 0.3) * 0.4;

  return (
    <g>
      <rect width={W} height={H} fill="#020f04" />
      {grid}

      {/* Pays */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        const fill = isIran ? "#003300" : isIsrael ? "#002800" : "#011a04";
        const stroke = isIran ? "#00ff41" : isIsrael ? "#00cc33" : "#005510";
        const sw = isIran || isIsrael ? 1.5 : 0.5;
        return (
          <path key={c.id} d={c.path}
            fill={fill} fillOpacity={mapReveal}
            stroke={stroke} strokeWidth={sw}
            opacity={isIran || isIsrael ? mapReveal : mapReveal * 0.6} />
        );
      })}

      {/* Balayage radar rotatif autour de Natanz */}
      <defs>
        <radialGradient id="radar-sweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff41" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={`M ${PT_NATANZ[0]} ${PT_NATANZ[1]}
           L ${PT_NATANZ[0] + Math.cos(radarAngle) * 300} ${PT_NATANZ[1] + Math.sin(radarAngle) * 300}
           A 300 300 0 0 1 ${PT_NATANZ[0] + Math.cos(radarAngle - 0.4) * 300} ${PT_NATANZ[1] + Math.sin(radarAngle - 0.4) * 300}
           Z`}
        fill="#00ff41" opacity={0.08}
      />
      {[80, 160, 260].map((r) => (
        <circle key={r} cx={PT_NATANZ[0]} cy={PT_NATANZ[1]} r={r}
          fill="none" stroke="#00ff41" strokeWidth={0.8} opacity={0.2} />
      ))}

      {/* Blips */}
      {[PT_TEHRAN, PT_NATANZ, PT_TELAVIV, PT_BEIRUT].map((pt, i) => (
        <g key={i}>
          <circle cx={pt[0]} cy={pt[1]} r={5}
            fill="#00ff41" opacity={blipPulse * mapReveal} />
          <circle cx={pt[0]} cy={pt[1]} r={12}
            fill="none" stroke="#00ff41" strokeWidth={1}
            opacity={blipPulse * 0.4 * mapReveal} />
        </g>
      ))}

      {/* Texte terminal */}
      {mapReveal > 0.5 && (
        <g fontFamily="'Courier New', monospace" fontSize={16} fill="#00ff41" opacity={mapReveal * 0.9}>
          <text x={W - 440} y={100}>SYS: THREAT ASSESSMENT ACTIVE</text>
          <text x={W - 440} y={125}>TGT_1: NATANZ [33.7N 51.7E]</text>
          <text x={W - 440} y={150}>TGT_2: TEHRAN [35.7N 51.4E]</text>
          <text x={W - 440} y={175}>RANGE: 1703 km</text>
          <text x={W - 440} y={200}>STATUS: STRIKE IN PROGRESS_</text>
        </g>
      )}

      {/* Labels pays */}
      {mapReveal > 0.6 && (
        <>
          <text x={PT_TEHRAN[0] + 25} y={PT_TEHRAN[1] - 25}
            fontFamily="'Courier New', monospace" fontSize={18}
            fill="#00ff41" fontWeight="bold">IRAN</text>
          <text x={PT_TELAVIV[0] - 100} y={PT_TELAVIV[1] - 15}
            fontFamily="'Courier New', monospace" fontSize={14}
            fill="#00cc33">ISRAEL</text>
        </>
      )}

      <StyleTag text="VAR 3 — RADAR MILITAIRE" color="#00ff41" lf={lf} />
    </g>
  );
}

// ── VARIATION 4 : ATLAS HISTORIQUE ──────────────────────────
function Var4Atlas({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 3);
  const mapReveal = reveal(lf, 0, 50);
  const annotReveal = reveal(lf, 50, 80);

  // Hachures procedurales sur Iran
  const hatchLines = React.useMemo(() => {
    const lines: React.ReactElement[] = [];
    for (let i = -20; i < 30; i++) {
      const y = 200 + i * 18;
      lines.push(
        <line key={i}
          x1={PT_TEHRAN[0] - 200} y1={y}
          x2={PT_TEHRAN[0] + 250} y2={y + 50}
          stroke="#6b2000" strokeWidth={1} opacity={0.35}
          strokeDasharray="4 3"
        />
      );
    }
    return lines;
  }, []);

  return (
    <g>
      {/* Fond papier vieilli */}
      <rect width={W} height={H} fill="#e8dcc4" />
      <defs>
        <filter id="paper-tex">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect width={W} height={H} filter="url(#paper-tex)" opacity={0.08} />

      {/* Traits de cadre doubles */}
      <rect x={20} y={20} width={W - 40} height={H - 40}
        fill="none" stroke="#4a3520" strokeWidth={3} opacity={mapReveal * 0.6} />
      <rect x={28} y={28} width={W - 56} height={H - 56}
        fill="none" stroke="#4a3520" strokeWidth={1} opacity={mapReveal * 0.3} />

      {/* Pays — palette atlas vintage */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        const isSaudi = c.id === ISO_SAUDI;
        const isIraq = c.id === ISO_IRAQ;
        const fills: Record<string, string> = {
          iran: "#c4846a",
          israel: "#7aa3c8",
          saudi: "#d4b86a",
          iraq: "#8fc48a",
        };
        let fill = "#c8b898";
        let stroke = "#7a6040";
        let sw = 0.8;
        if (isIran) { fill = fills.iran; stroke = "#8b4a30"; sw = 1.5; }
        else if (isIsrael) { fill = fills.israel; stroke = "#3a6090"; sw = 1.5; }
        else if (isSaudi) { fill = fills.saudi; }
        else if (isIraq) { fill = fills.iraq; }
        return (
          <path key={c.id} d={c.path}
            fill={fill} fillOpacity={mapReveal * 0.9}
            stroke={stroke} strokeWidth={sw} />
        );
      })}

      {/* Hachures sur Iran (zone conflit) */}
      <clipPath id="iran-clip">
        {countries.filter(c => c.id === ISO_IRAN).map(c => (
          <path key="iclip" d={c.path} />
        ))}
      </clipPath>
      <g clipPath="url(#iran-clip)" opacity={annotReveal * 0.6}>
        {hatchLines}
      </g>

      {/* Rose des vents */}
      {mapReveal > 0.5 && (
        <g transform="translate(160, 200)" opacity={mapReveal * 0.7}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const len = i % 2 === 0 ? 40 : 22;
            return (
              <line key={deg}
                x1={0} y1={0}
                x2={Math.sin(rad) * len} y2={-Math.cos(rad) * len}
                stroke="#4a3520" strokeWidth={i % 2 === 0 ? 1.5 : 0.8} />
            );
          })}
          <text x={0} y={-52} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={16} fill="#4a3520" fontWeight="bold">N</text>
          <circle cx={0} cy={0} r={6} fill="none" stroke="#4a3520" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={2} fill="#4a3520" />
        </g>
      )}

      {/* Annotations manuscrites */}
      {annotReveal > 0 && (
        <g opacity={annotReveal}>
          <text x={PT_TEHRAN[0] + 30} y={PT_TEHRAN[1] - 50}
            fontFamily="Georgia, serif" fontSize={26} fill="#4a2010"
            fontWeight="bold" fontStyle="italic">Perse</text>
          <text x={PT_TEHRAN[0] + 30} y={PT_TEHRAN[1] - 25}
            fontFamily="Georgia, serif" fontSize={16} fill="#6b4030" fontStyle="italic">
            (Iran depuis 1935)
          </text>
          <line x1={PT_TEHRAN[0] + 20} y1={PT_TEHRAN[1] - 20}
            x2={PT_TEHRAN[0] + 8} y2={PT_TEHRAN[1] - 6}
            stroke="#4a2010" strokeWidth={1} />

          <text x={PT_NATANZ[0] + 15} y={PT_NATANZ[1] + 5}
            fontFamily="Georgia, serif" fontSize={13} fill="#8b3010" fontStyle="italic">
            Site nucleaire
          </text>

          {/* Echelle */}
          <line x1={W - 350} y1={H - 80} x2={W - 150} y2={H - 80}
            stroke="#4a3520" strokeWidth={2} />
          <line x1={W - 350} y1={H - 86} x2={W - 350} y2={H - 74}
            stroke="#4a3520" strokeWidth={2} />
          <line x1={W - 150} y1={H - 86} x2={W - 150} y2={H - 74}
            stroke="#4a3520" strokeWidth={2} />
          <text x={W - 255} y={H - 58} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={14} fill="#4a3520">1 000 km</text>
        </g>
      )}

      {/* Titre */}
      <text x={70} y={95}
        fontFamily="Georgia, serif" fontWeight="bold"
        fontSize={44} fill="#2a1505" opacity={fadeIn(lf, 0, 20)}
        style={{ letterSpacing: "-0.02em" } as React.CSSProperties}>
        ORIENT MOYEN
      </text>
      <text x={70} y={124}
        fontFamily="Georgia, serif" fontSize={16} fill="#6b4030"
        fontStyle="italic" opacity={fadeIn(lf, 5, 25)}>
        Carte politique — Edition 2026
      </text>

      <StyleTag text="VAR 4 — ATLAS HISTORIQUE" color="#4a2010" lf={lf} />
    </g>
  );
}

// ── VARIATION 5 : DATA JOURNALISME ──────────────────────────
function Var5DataJournalism({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 4);
  const mapReveal = reveal(lf, 0, 35);
  const stat1 = reveal(lf, 30, 50);
  const stat2 = reveal(lf, 45, 65);
  const stat3 = reveal(lf, 60, 80);

  // Compteur anime pour les morts
  const deathCount = Math.round(interpolate(lf, [30, 70], [0, 1332], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));

  return (
    <g>
      {/* Fond blanc */}
      <rect width={W} height={H} fill="#fafafa" />

      {/* Ligne editoriale gauche */}
      <rect x={0} y={0} width={6} height={H} fill="#cc2200" />

      {/* Pays — gris tres propres */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        let fill = "#d4d0c8";
        let stroke = "#aaa8a0";
        let sw = 0.5;
        if (isIran && mapReveal > 0) {
          fill = "#cc2200"; stroke = "#aa1800"; sw = 1.5;
        } else if (isIsrael && mapReveal > 0) {
          fill = "#003399"; stroke = "#002288"; sw = 1.5;
        }
        return (
          <path key={c.id} d={c.path}
            fill={fill} fillOpacity={isIran || isIsrael ? mapReveal : mapReveal * 0.8}
            stroke={stroke} strokeWidth={sw} />
        );
      })}

      {/* Stats cards cote droit */}
      {stat1 > 0 && (
        <g transform="translate(1320, 100)" opacity={stat1}>
          <rect width={520} height={110} rx={4} fill="#ffffff"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" } as React.CSSProperties} />
          <rect width={6} height={110} rx={3} fill="#cc2200" />
          <text x={24} y={44}
            fontFamily="'Arial', sans-serif" fontWeight="700"
            fontSize={52} fill="#cc2200">
            {deathCount.toLocaleString()}
          </text>
          <text x={24} y={75}
            fontFamily="'Arial', sans-serif" fontSize={18} fill="#444444">
            morts en Iran depuis le 28 fev 2026
          </text>
          <text x={24} y={98}
            fontFamily="'Arial', sans-serif" fontSize={13} fill="#999999">
            Source : Croix-Rouge iranienne
          </text>
        </g>
      )}

      {stat2 > 0 && (
        <g transform="translate(1320, 230)" opacity={stat2}>
          <rect width={520} height={110} rx={4} fill="#ffffff"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" } as React.CSSProperties} />
          <rect width={6} height={110} rx={3} fill="#003399" />
          <text x={24} y={44}
            fontFamily="'Arial', sans-serif" fontWeight="700"
            fontSize={52} fill="#003399">3 000+</text>
          <text x={24} y={75}
            fontFamily="'Arial', sans-serif" fontSize={18} fill="#444444">
            cibles frappees en Iran (9 jours)
          </text>
          <text x={24} y={98}
            fontFamily="'Arial', sans-serif" fontSize={13} fill="#999999">
            Source : US Central Command
          </text>
        </g>
      )}

      {stat3 > 0 && (
        <g transform="translate(1320, 360)" opacity={stat3}>
          <rect width={520} height={110} rx={4} fill="#ffffff"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" } as React.CSSProperties} />
          <rect width={6} height={110} rx={3} fill="#ff8800" />
          <text x={24} y={44}
            fontFamily="'Arial', sans-serif" fontWeight="700"
            fontSize={52} fill="#ff8800">1 703 km</text>
          <text x={24} y={75}
            fontFamily="'Arial', sans-serif" fontSize={18} fill="#444444">
            Tel Aviv → Natanz (site nucleaire)
          </text>
          <text x={24} y={98}
            fontFamily="'Arial', sans-serif" fontSize={13} fill="#999999">
            Distance orthodromique
          </text>
        </g>
      )}

      {/* Titre */}
      <text x={30} y={75}
        fontFamily="'Arial', sans-serif" fontWeight="700"
        fontSize={38} fill="#111111" opacity={fadeIn(lf, 0, 15)}>
        Guerre Iran – 9 jours en chiffres
      </text>
      <text x={30} y={105}
        fontFamily="'Arial', sans-serif" fontSize={18} fill="#666666"
        opacity={fadeIn(lf, 5, 20)}>
        28 fevrier – 8 mars 2026
      </text>

      <StyleTag text="VAR 5 — DATA JOURNALISME" color="#cc2200" lf={lf} />
    </g>
  );
}

// ── VARIATION 6 : NEON CYBER ─────────────────────────────────
function Var6Neon({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 5);
  const { fps } = useVideoConfig();

  const mapReveal = reveal(lf, 0, 30);
  const iranGlow = reveal(lf, 15, 45);
  const israelGlow = reveal(lf, 40, 65);
  const strikeT = interpolate(lf, [65, 92], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const pulse = 0.7 + Math.sin(lf * 0.18) * 0.3;
  const strikePt = bezierPoint(PT_TELAVIV, PT_NATANZ, strikeT, 200);

  const iranLabelScale = spring({ frame: Math.max(0, lf - 20), fps,
    config: { damping: 15, stiffness: 200 } });
  const israelLabelScale = spring({ frame: Math.max(0, lf - 45), fps,
    config: { damping: 15, stiffness: 200 } });

  return (
    <g>
      <rect width={W} height={H} fill="#060614" />

      <defs>
        <filter id="glow-iran">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-israel">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Pays */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        const isIsrael = c.id === ISO_ISRAEL;
        let fill = "#0d0d22";
        let stroke = "#1a1a44";
        let sw = 0.5;
        if (isIran && iranGlow > 0) {
          fill = "#330022";
          stroke = "#ff0077";
          sw = 2;
        } else if (isIsrael && israelGlow > 0) {
          fill = "#001133";
          stroke = "#00aaff";
          sw = 2;
        }
        return (
          <path key={c.id} d={c.path}
            fill={fill}
            fillOpacity={isIran ? iranGlow * 0.9 : isIsrael ? israelGlow * 0.9 : mapReveal * 0.7}
            stroke={stroke} strokeWidth={sw}
            filter={isIran && iranGlow > 0.3 ? "url(#glow-iran)" : isIsrael && israelGlow > 0.3 ? "url(#glow-israel)" : undefined} />
        );
      })}

      {/* Labels neon */}
      {iranGlow > 0.2 && (
        <g transform={`translate(${PT_TEHRAN[0] + 20}, ${PT_TEHRAN[1] - 40}) scale(${iranLabelScale})`}>
          <text textAnchor="middle"
            fontFamily="'Arial Black', sans-serif" fontWeight="900"
            fontSize={36} fill="#ff0077" opacity={iranGlow * pulse}
            filter="url(#glow-iran)"
            style={{ letterSpacing: "0.15em" } as React.CSSProperties}>
            IRAN
          </text>
        </g>
      )}

      {israelGlow > 0.2 && (
        <g transform={`translate(${PT_TELAVIV[0] - 70}, ${PT_TELAVIV[1] - 30}) scale(${israelLabelScale})`}>
          <text textAnchor="middle"
            fontFamily="'Arial Black', sans-serif" fontWeight="900"
            fontSize={26} fill="#00aaff" opacity={israelGlow * pulse}
            filter="url(#glow-israel)"
            style={{ letterSpacing: "0.1em" } as React.CSSProperties}>
            ISRAEL
          </text>
        </g>
      )}

      {/* Trajectoire neon */}
      {strikeT > 0 && (
        <g filter="url(#glow-line)">
          <path
            d={`M ${PT_TELAVIV[0]} ${PT_TELAVIV[1]} Q ${(PT_TELAVIV[0] + PT_NATANZ[0]) / 2} ${Math.min(PT_TELAVIV[1], PT_NATANZ[1]) - 200} ${strikePt[0]} ${strikePt[1]}`}
            fill="none" stroke="#ffee00" strokeWidth={3} opacity={0.9}
          />
          <circle cx={strikePt[0]} cy={strikePt[1]} r={7} fill="#ffee00" opacity={pulse} />
          <circle cx={strikePt[0]} cy={strikePt[1]} r={20} fill="#ffee00" opacity={0.15 * pulse} />
        </g>
      )}

      {/* Points de capitale */}
      {[PT_TEHRAN, PT_TELAVIV].map((pt, i) => (
        <g key={i}>
          <circle cx={pt[0]} cy={pt[1]} r={4}
            fill={i === 0 ? "#ff0077" : "#00aaff"}
            opacity={mapReveal * pulse} />
          <circle cx={pt[0]} cy={pt[1]} r={12}
            fill="none" stroke={i === 0 ? "#ff0077" : "#00aaff"}
            strokeWidth={1} opacity={0.3 * mapReveal} />
        </g>
      ))}

      {/* Titre */}
      <text x={60} y={85}
        fontFamily="'Arial Black', sans-serif" fontWeight="900"
        fontSize={36} fill="#ffffff" opacity={fadeIn(lf, 0, 20)}
        filter="url(#glow-line)"
        style={{ letterSpacing: "0.08em" } as React.CSSProperties}>
        OPERATION EPIC FURY
      </text>
      <text x={60} y={118}
        fontFamily="'Courier New', monospace" fontSize={18}
        fill="#7777aa" opacity={fadeIn(lf, 5, 25)}>
        28.02.2026  —  JOUR 1 DE LA GUERRE
      </text>

      <StyleTag text="VAR 6 — NEON CYBER" color="#ff0077" lf={lf} />
    </g>
  );
}

// ── VARIATION 7 : COMPARAISON TAILLE ────────────────────────
function Var7SizeComparison({
  countries,
  frame,
}: {
  countries: CountryFeature[];
  frame: number;
}) {
  const lf = localFrame(frame, 6);
  const { fps } = useVideoConfig();

  const mapReveal = reveal(lf, 0, 30);
  const franceReveal = reveal(lf, 35, 60);
  const israelReveal = reveal(lf, 55, 75);
  const labelReveal = reveal(lf, 65, 85);

  // Projection speciale centree sur Iran a gauche, France a droite
  // On reutilise la meme projection mais on translate France sur Iran
  const francePaths = countries.filter(c => c.id === ISO_FRANCE);

  // Calcul : centroide Iran
  const iranFeature = countries.find(c => c.id === ISO_IRAN);
  const iranCentroid = iranFeature?.centroid ?? PT_TEHRAN;

  // Centroide France dans la projection ME (France apparait a gauche de la carte)
  // On va translater les paths France pour les superposer sur Iran
  const franceCentroid = React.useMemo(() => {
    const fc = countries.find(c => c.id === ISO_FRANCE);
    return fc?.centroid ?? [400, 300] as [number, number];
  }, [countries]);

  const dx = iranCentroid[0] - franceCentroid[0];
  const dy = iranCentroid[1] - franceCentroid[1];

  const franceScale = spring({ frame: Math.max(0, lf - 35), fps,
    config: { damping: 22, stiffness: 200 } });

  // On va aussi afficher Israel superpose sur Iran pour l'echelle
  const israelFeature = countries.find(c => c.id === ISO_ISRAEL);
  const israelCentroid = israelFeature?.centroid ?? PT_TELAVIV;
  const dxIs = iranCentroid[0] - israelCentroid[0];
  const dyIs = iranCentroid[1] - israelCentroid[1];

  return (
    <g>
      <rect width={W} height={H} fill="#f0ede4" />

      {/* Pays base — Iran en evidence */}
      {countries.map((c) => {
        const isIran = c.id === ISO_IRAN;
        return (
          <path key={c.id} d={c.path}
            fill={isIran ? "#e8c8a0" : "#d4cebc"}
            fillOpacity={mapReveal * (isIran ? 1 : 0.6)}
            stroke={isIran ? "#8b5a20" : "#aaa090"}
            strokeWidth={isIran ? 1.5 : 0.5} />
        );
      })}

      {/* France superposee sur Iran */}
      {francePaths.map((c) => (
        <path key={`fr-${c.id}`} d={c.path}
          transform={`translate(${dx * franceScale}, ${dy * franceScale})`}
          fill="#003399" fillOpacity={franceReveal * 0.55}
          stroke="#001a77" strokeWidth={2}
          strokeDasharray="8 4" />
      ))}

      {/* Israel superpose sur Iran */}
      {israelFeature && (
        <path d={israelFeature.path}
          transform={`translate(${dxIs}, ${dyIs})`}
          fill="#cc0000" fillOpacity={israelReveal * 0.65}
          stroke="#880000" strokeWidth={2}
          strokeDasharray="4 3" />
      )}

      {/* Legende */}
      {labelReveal > 0 && (
        <g opacity={labelReveal}>
          {/* Iran */}
          <rect x={W - 480} y={120} width={24} height={24} rx={3} fill="#e8c8a0" stroke="#8b5a20" strokeWidth={1.5} />
          <text x={W - 444} y={138} fontFamily="Georgia, serif" fontSize={22} fontWeight="bold" fill="#2a1a00">
            Iran
          </text>
          <text x={W - 444} y={160} fontFamily="Georgia, serif" fontSize={16} fill="#6b5540">
            1 648 000 km²
          </text>

          {/* France */}
          <rect x={W - 480} y={190} width={24} height={24} rx={3}
            fill="#003399" fillOpacity={0.55} stroke="#001a77" strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={W - 444} y={208} fontFamily="Georgia, serif" fontSize={22} fontWeight="bold" fill="#003399">
            France
          </text>
          <text x={W - 444} y={230} fontFamily="Georgia, serif" fontSize={16} fill="#6b5540">
            551 000 km² <tspan fill="#cc2200">(3x plus petit)</tspan>
          </text>

          {/* Israel */}
          <rect x={W - 480} y={258} width={24} height={24} rx={3}
            fill="#cc0000" fillOpacity={0.65} stroke="#880000" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={W - 444} y={276} fontFamily="Georgia, serif" fontSize={22} fontWeight="bold" fill="#cc0000">
            Israel
          </text>
          <text x={W - 444} y={298} fontFamily="Georgia, serif" fontSize={16} fill="#6b5540">
            20 770 km² <tspan fill="#cc2200">(79x plus petit)</tspan>
          </text>

          {/* Message principal */}
          <rect x={W - 480} y={340} width={420} height={100} rx={4} fill="#2a1a00" opacity={0.08} />
          <text x={W - 460} y={375} fontFamily="Georgia, serif" fontSize={18} fill="#2a1a00" fontStyle="italic">
            L'Iran est 79 fois plus grand
          </text>
          <text x={W - 460} y={400} fontFamily="Georgia, serif" fontSize={18} fill="#2a1a00" fontStyle="italic">
            qu'Israel. Pourtant Israel frappe.
          </text>
          <text x={W - 460} y={425} fontFamily="Georgia, serif" fontSize={14} fill="#8b6540">
            C'est la puissance de l'armee sur la superficie.
          </text>
        </g>
      )}

      {/* Titre */}
      <text x={70} y={95}
        fontFamily="Georgia, serif" fontWeight="bold"
        fontSize={42} fill="#2a1505" opacity={fadeIn(lf, 0, 20)}>
        Les vraies tailles
      </text>
      <text x={70} y={125}
        fontFamily="Georgia, serif" fontSize={20} fill="#6b4030"
        fontStyle="italic" opacity={fadeIn(lf, 5, 25)}>
        Iran, France et Israel a la meme echelle
      </text>

      <StyleTag text="VAR 7 — COMPARAISON TAILLE" color="#8b5a20" lf={lf} />
    </g>
  );
}

// ── Tag de style (coin bas gauche) ───────────────────────────
function StyleTag({
  text,
  color,
  lf,
}: {
  text: string;
  color: string;
  lf: number;
}) {
  return (
    <g opacity={fadeIn(lf, 0, 15)}>
      <rect x={40} y={H - 52} width={440} height={34} rx={4} fill={color} opacity={0.15} />
      <rect x={40} y={H - 52} width={4} height={34} rx={2} fill={color} />
      <text x={54} y={H - 28}
        fontFamily="'Courier New', monospace" fontSize={15}
        fill={color} style={{ letterSpacing: "0.06em" } as React.CSSProperties}>
        {text}
      </text>
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────
export const GeoStyleShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const countries = useMapData();

  const seg = Math.floor(frame / SEG);

  return (
    <AbsoluteFill style={{ background: "#111111" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {seg === 0 && <Var1BreakingNews countries={countries} frame={frame} />}
        {seg === 1 && <Var2Magazine countries={countries} frame={frame} />}
        {seg === 2 && <Var3Radar countries={countries} frame={frame} />}
        {seg === 3 && <Var4Atlas countries={countries} frame={frame} />}
        {seg === 4 && <Var5DataJournalism countries={countries} frame={frame} />}
        {seg === 5 && <Var6Neon countries={countries} frame={frame} />}
        {seg >= 6 && <Var7SizeComparison countries={countries} frame={frame} />}
      </svg>
    </AbsoluteFill>
  );
};

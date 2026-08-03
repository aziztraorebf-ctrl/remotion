// PROTO — carte PLATE (projection 2D top-down, PAS un globe) pour l'Acte 1 hook "Gazoduc AAGP vs TSGP".
//
// Contexte : alternative au globe orthographique de ProtoGazoducArcContinu.tsx (NE PAS TOUCHER, proto
// voisin conserve pour comparaison). Reference visuelle Aziz : showreel documentaire "Documentary Map
// Animation Showcase" (youtu.be/wYlIIqKtxz8) — carte 2D avec territoires teintes + elements qui
// APPARAISSENT PAR-DESSUS (tracés, portraits, icônes), jamais une sphere 3D.
//
// Sujet : 2 gazoducs rivaux partent tous deux du NIGERIA (point commun) —
//   AAGP (Atlantic African Gas Pipeline) : cotier, longe l'Atlantique via 13 pays jusqu'au Maroc -> Europe.
//   TSGP (Trans-Saharan Gas Pipeline) : direct a travers le Niger et l'Algerie (Sahara).
// Ce proto isole UNIQUEMENT la divergence des 2 tracés depuis le point commun (8s, 240f @30fps).
//
// REUTILISE (socle valide, ne pas reinventer) :
//  - Pattern carte D3 plate CFA (CfaActe6aVolonte16x9.tsx, worktree remotion-cfa) : geo Natural Earth
//    110m via topojson-client -> JSON statique {name, d} pre-projete, `CountryOutline` avec longueur
//    GEOMETRIQUE reelle (somme des distances euclidiennes, PAS l'heuristique "nb commandes * 14" qui
//    sous-estime et coupe le trace avant la fin — bug documente dans ce meme fichier CFA).
//  - Pattern camera flat (CfaActe2Carte16x9.tsx / sahelFlatGeo.ts getDezoomCam) : groupe SVG unique
//    `translate(tx,ty) scale(s)`, jamais de viewBox anime (cf doctrine camera-svg-g-transform-jamais-viewbox).
//  - geoArc.ts n'est PAS reutilise tel quel : il opere en lon/lat sur une projection orthographique
//    (clip hemisphere via geoInterpolate + geoPath). Ici la geo est DEJA projetee en pixels (Mercator
//    fitExtent, comme CFA) donc les 2 tracés sont des courbes de Bezier en ESPACE ECRAN (plus simples,
//    pas de notion de "face cachee" sur une carte plate). Le principe strokeDashoffset qui trace est le
//    meme mecanisme que geoArc.arcPathD, juste applique a une courbe SVG classique plutot qu'un
//    grand-cercle geo.
//  - GLOBALEMENT NOUVEAU dans ce fichier : gazoducCartePlateGeo.json (geo generee via world-atlas +
//    topojson-client + d3-geo, meme pipeline que cfaAfricaGeo.json mais zone Afrique de l'Ouest +
//    Maghreb + Espagne/Portugal/France, cadree specifiquement pour ce sujet) ; les 2 courbes AAGP/TSGP
//    et leur mise en scene (divergence, styles distincts, camera pan/zoom dediee a cette geo).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import geoData from "./gazoducCartePlateGeo.json";

const W = 1920;
const H = 1080;
const FPS = 30;
export const PROTO_GAZODUC_PLATE_FRAMES = 240; // 8s @30fps

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// Palette registre nuit/encre (coherent avec le socle CFA/Souverain deja valide)
const BG_TOP = "#0d1526";
const BG_BOT = "#070c17";
const LAND = "#24344f";
const LAND_STROKE = "#4a628c";
const NIGERIA_FILL = "#f0c94a"; // point de depart commun, dore = source du gaz
const NIGERIA_STROKE = "#caa428";
const AAGP_COLOR = "#4fd3c4"; // cotier Atlantique = teal (evoque l'ocean longe)
const TSGP_COLOR = "#e8834a"; // saharien = orange (evoque le desert traverse)
const TARGET_GLOW = "#f0e8d2";

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const centroids = geoData.centroids as unknown as Record<string, [number, number]>;

const byName = (name: string) => countries.find((c) => c.name === name);

// longueur geometrique reelle d'un path (somme des distances euclidiennes) — pattern CFA valide,
// JAMAIS l'heuristique "nb commandes * 14" (sous-estime et coupe le trace visuellement avant la fin).
const pathLenCache = new Map<string, number>();
const pathLen = (d: string): number => {
  const cached = pathLenCache.get(d);
  if (cached !== undefined) return cached;
  const nums = (d.match(/-?\d+\.?\d*/g) ?? []).map(Number);
  let total = 0;
  for (let i = 0; i < nums.length - 2; i += 2) {
    const dx = nums[i + 2] - nums[i];
    const dy = nums[i + 3] - nums[i + 1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  pathLenCache.set(d, total);
  return total;
};

const CountryOutline: React.FC<{ c: CountryGeo; draw: number; fillOp?: number }> = ({ c, draw, fillOp = 1 }) => {
  if (draw <= 0) return null;
  const len = pathLen(c.d);
  return (
    <g>
      <path d={c.d} fill={LAND} fillOpacity={fillOp * Math.min(1, draw * 1.4)} />
      <path
        d={c.d}
        fill="none"
        stroke={LAND_STROKE}
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        opacity={0.85}
      />
    </g>
  );
};

// Point de controle pour une courbe quadratique en espace ECRAN (deja projete), avec un biais
// perpendiculaire pour donner une allure de tracé "route" plutot qu'une ligne droite GPS.
function curveD(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): string {
  const mx = a[0] + (b[0] - a[0]) * bendAlong;
  const my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len; // perpendiculaire unitaire
  const py = dx / len;
  const cx = mx + px * bendPerp;
  const cy = my + py * bendPerp;
  return `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`;
}

// Longueur approx d'une quadratique (echantillonnage — suffisant pour strokeDashoffset, pas besoin
// d'une precision analytique ici, meme logique que pathLen mais sur une courbe generee, pas un `d` complexe).
function quadLen(a: [number, number], ctrl: [number, number], b: [number, number], samples = 60): number {
  let total = 0;
  let prev = a;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
    total += Math.hypot(x - prev[0], y - prev[1]);
    prev = [x, y];
  }
  return total;
}

function pointOnQuad(a: [number, number], ctrl: [number, number], b: [number, number], t: number): [number, number] {
  const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
  const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
  return [x, y];
}

function ctrlOf(a: [number, number], b: [number, number], bendPerp: number, bendAlong = 0.5): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * bendAlong;
  const my = a[1] + (b[1] - a[1]) * bendAlong;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  return [mx + px * bendPerp, my + py * bendPerp];
}

// ===== Points-cles (centroides reels, cf gazoducCartePlateGeo.json) =====
// Niger et Espagne restent dans le JSON (reperes geo dispo pour une iteration future du proto :
// TSGP passe par le Niger avant l'Algerie, AAGP finit sur l'Europe via l'Espagne) mais ne sont pas
// utilises comme points de controle dans CETTE version isolee sur la seule divergence Nigeria->2 cibles.
const NIGERIA = centroids.Nigeria;
const ALGERIA = centroids.Algeria;
const MOROCCO = centroids.Morocco;

// AAGP : cotier -> passe par un point intermediaire golfe de Guinee avant de filer au Maroc/Espagne.
const AAGP_MID: [number, number] = [NIGERIA[0] - 230, NIGERIA[1] - 60];
const AAGP_CTRL1 = ctrlOf(NIGERIA, AAGP_MID, -40, 0.5);
const AAGP_CTRL2 = ctrlOf(AAGP_MID, MOROCCO, 60, 0.45);
// TSGP : direct Nigeria -> Niger -> Algerie (ligne plus franche a travers le Sahara).
const TSGP_CTRL = ctrlOf(NIGERIA, ALGERIA, -35, 0.5);

// ===== Camera : groupe unique translate/scale (pattern CFA/sahelFlatGeo, jamais de viewBox anime) =====
type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function camAt(frame: number): Cam {
  // 0 -> 60 : plan large legerement zoome sur le Nigeria (etablit le point commun).
  // 60 -> 240 : zoom/pan progressif lent vers le centre du systeme (Nigeria-Algerie-Maroc), jamais figé.
  const startCenter: [number, number] = [NIGERIA[0], NIGERIA[1] - 40];
  const endCenter: [number, number] = [
    (NIGERIA[0] + ALGERIA[0] + MOROCCO[0]) / 3,
    (NIGERIA[1] + ALGERIA[1] + MOROCCO[1]) / 3 - 30,
  ];
  const startScale = 1.25;
  const endScale = 1.55;
  const p = easeInOut(Math.min(1, Math.max(0, frame / 240)));
  const cx = startCenter[0] + (endCenter[0] - startCenter[0]) * p;
  const cy = startCenter[1] + (endCenter[1] - startCenter[1]) * p;
  const scale = startScale + (endScale - startScale) * p;
  return { scale, tx: W / 2 - cx * scale, ty: H / 2 - cy * scale };
}

export const ProtoGazoducCartePlate: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clamp);

  // continent entier se trace (0 -> 1.8s), vague legere par pays
  const continentDraw = interpolate(frame, [0, S(1.8)], [0, 1], clamp);
  const countryDraw = (idx: number, total: number) => {
    const t0 = (idx / total) * 0.5;
    return interpolate(continentDraw, [t0, Math.min(t0 + 0.6, 1)], [0, 1], clamp);
  };

  // Nigeria (source commune) : apparait juste apres le continent, pulse discret
  const nigeriaAppear = interpolate(frame, [S(1.6), S(2.3)], [0, 1], clamp);
  const nigeriaPulse = 0.6 + 0.4 * Math.sin(frame / 10);

  // divergence : les 2 tracés partent ENSEMBLE du meme point (Nigeria) a partir de ~2.3s,
  // se tracent en continu jusqu'a ~7s (jamais apres l'arret de la camera, meme principe que
  // ProtoGazoducArcContinu : le tracé avance PENDANT le mouvement, pas apres).
  const T_TRACE_START = S(2.4);
  const T_TRACE_END = S(6.8);
  const aagpReveal = interpolate(frame, [T_TRACE_START, T_TRACE_END], [0, 1], clamp);
  const tsgpReveal = interpolate(frame, [T_TRACE_START, T_TRACE_END + S(0.4)], [0, 1], clamp);

  // cibles qui s'illuminent a l'arrivee de chaque tracé
  const moroccoGlow = interpolate(frame, [T_TRACE_END - S(0.5), T_TRACE_END + S(0.6)], [0, 1], clamp);
  const algeriaGlow = interpolate(frame, [T_TRACE_END - S(0.1), T_TRACE_END + S(1.0)], [0, 1], clamp);

  const total = countries.length;

  // === AAGP : 2 segments Bezier (Nigeria->mid->Maroc) tracés ensemble via un seul strokeDasharray combine ===
  const aagpLen1 = quadLen(NIGERIA, AAGP_CTRL1, AAGP_MID);
  const aagpLen2 = quadLen(AAGP_MID, AAGP_CTRL2, MOROCCO);
  const aagpTotal = aagpLen1 + aagpLen2;
  const aagpProg = aagpReveal * aagpTotal;
  const aagpDraw1 = Math.min(1, aagpProg / aagpLen1);
  const aagpDraw2 = Math.max(0, Math.min(1, (aagpProg - aagpLen1) / aagpLen2));
  const aagpD1 = curveD(NIGERIA, AAGP_MID, -40, 0.5);
  const aagpD2 = curveD(AAGP_MID, MOROCCO, 60, 0.45);

  // === TSGP : 1 segment direct Nigeria -> Algerie ===
  const tsgpLen = quadLen(NIGERIA, TSGP_CTRL, ALGERIA);
  const tsgpD = curveD(NIGERIA, ALGERIA, -35, 0.5);

  // marqueurs voyageurs le long de chaque tracé (repere visuel du "flux qui avance")
  const aagpMarkerT = Math.min(1, aagpReveal);
  const aagpMarkerPt =
    aagpMarkerT <= 0
      ? null
      : aagpMarkerT * aagpTotal <= aagpLen1
        ? pointOnQuad(NIGERIA, AAGP_CTRL1, AAGP_MID, (aagpMarkerT * aagpTotal) / aagpLen1)
        : pointOnQuad(AAGP_MID, AAGP_CTRL2, MOROCCO, ((aagpMarkerT * aagpTotal) - aagpLen1) / aagpLen2);
  const tsgpMarkerT = Math.min(1, tsgpReveal);
  const tsgpMarkerPt = tsgpMarkerT <= 0 ? null : pointOnQuad(NIGERIA, TSGP_CTRL, ALGERIA, tsgpMarkerT);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
            {/* continent entier — trace pays par pays */}
            {countries.map((c, i) => (
              <CountryOutline key={c.name} c={c} draw={countryDraw(i, total)} fillOp={0.9} />
            ))}

            {/* MAROC — cible AAGP, s'illumine a l'arrivee */}
            {(() => {
              const maroc = byName("Morocco");
              if (!maroc || moroccoGlow <= 0.01) return null;
              return (
                <path
                  d={maroc.d}
                  fill={AAGP_COLOR}
                  fillOpacity={0.15 + 0.35 * moroccoGlow}
                  stroke={AAGP_COLOR}
                  strokeWidth={1.5 + 1.5 * moroccoGlow}
                  strokeOpacity={0.9 * moroccoGlow}
                />
              );
            })()}
            {/* ALGERIE — cible TSGP, s'illumine a l'arrivee */}
            {(() => {
              const algerie = byName("Algeria");
              if (!algerie || algeriaGlow <= 0.01) return null;
              return (
                <path
                  d={algerie.d}
                  fill={TSGP_COLOR}
                  fillOpacity={0.15 + 0.35 * algeriaGlow}
                  stroke={TSGP_COLOR}
                  strokeWidth={1.5 + 1.5 * algeriaGlow}
                  strokeOpacity={0.9 * algeriaGlow}
                />
              );
            })()}

            {/* ===== TSGP — tracé direct saharien, pointille (traverse le desert) =====
                Style distinctif vs AAGP : trait PLUS FIN + surcouche pointillee dense (evoque une
                piste desertique), par opposition au trait plein continu du gazoduc cotier.
                Le clipPath (meme dasharray/dashoffset que le trait plein) garantit que le pointille
                decoratif ne depasse JAMAIS la portion deja revelee. */}
            {tsgpReveal > 0.001 && (
              <>
                <defs>
                  <clipPath id="tsgpClip">
                    <path
                      d={tsgpD}
                      fill="none"
                      stroke="#000"
                      strokeWidth={20}
                      strokeLinecap="round"
                      strokeDasharray={tsgpLen}
                      strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                    />
                  </clipPath>
                </defs>
                <path
                  d={tsgpD}
                  fill="none"
                  stroke="rgba(8,10,16,0.55)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.5}
                  strokeDasharray={tsgpLen}
                  strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                />
                <path
                  d={tsgpD}
                  fill="none"
                  stroke={TSGP_COLOR}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  opacity={0.95}
                  strokeDasharray={tsgpLen}
                  strokeDashoffset={tsgpLen * (1 - Math.min(1, tsgpReveal))}
                />
                <path
                  d={tsgpD}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  opacity={0.6}
                  strokeDasharray="5 9"
                  clipPath="url(#tsgpClip)"
                />
              </>
            )}
            {tsgpMarkerPt && (
              <g transform={`translate(${tsgpMarkerPt[0]} ${tsgpMarkerPt[1]})`}>
                <circle r={14} fill={TSGP_COLOR} opacity={0.22} />
                <circle r={7} fill={TSGP_COLOR} stroke="#fff" strokeWidth={1.6} />
              </g>
            )}

            {/* ===== AAGP — tracé cotier continu, teal (longe l'Atlantique) ===== */}
            {aagpReveal > 0.001 && (
              <>
                <path
                  d={aagpD1}
                  fill="none"
                  stroke="rgba(8,10,16,0.55)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.5}
                  strokeDasharray={aagpLen1}
                  strokeDashoffset={aagpLen1 * (1 - aagpDraw1)}
                />
                <path
                  d={aagpD1}
                  fill="none"
                  stroke={AAGP_COLOR}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={aagpLen1}
                  strokeDashoffset={aagpLen1 * (1 - aagpDraw1)}
                />
                {aagpDraw1 >= 0.999 && (
                  <>
                    <path
                      d={aagpD2}
                      fill="none"
                      stroke="rgba(8,10,16,0.55)"
                      strokeWidth={7}
                      strokeLinecap="round"
                      opacity={0.5}
                      strokeDasharray={aagpLen2}
                      strokeDashoffset={aagpLen2 * (1 - aagpDraw2)}
                    />
                    <path
                      d={aagpD2}
                      fill="none"
                      stroke={AAGP_COLOR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={aagpLen2}
                      strokeDashoffset={aagpLen2 * (1 - aagpDraw2)}
                    />
                  </>
                )}
              </>
            )}
            {aagpMarkerPt && (
              <g transform={`translate(${aagpMarkerPt[0]} ${aagpMarkerPt[1]})`}>
                <circle r={14} fill={AAGP_COLOR} opacity={0.22} />
                <circle r={7} fill={AAGP_COLOR} stroke="#fff" strokeWidth={1.6} />
              </g>
            )}

            {/* ===== NIGERIA — point de depart commun, dore, pulse ===== */}
            {nigeriaAppear > 0.01 &&
              (() => {
                const nigeria = byName("Nigeria");
                if (!nigeria) return null;
                return (
                  <g opacity={nigeriaAppear}>
                    <path d={nigeria.d} fill={NIGERIA_FILL} fillOpacity={0.85} stroke={NIGERIA_STROKE} strokeWidth={2} />
                    <circle
                      cx={NIGERIA[0]}
                      cy={NIGERIA[1]}
                      r={10 + 6 * nigeriaPulse}
                      fill="none"
                      stroke={NIGERIA_FILL}
                      strokeWidth={2}
                      opacity={0.5 * nigeriaPulse}
                    />
                    <circle cx={NIGERIA[0]} cy={NIGERIA[1]} r={7} fill={NIGERIA_FILL} stroke="#fff" strokeWidth={1.6} />
                  </g>
                );
              })()}
          </g>
        </svg>

        {/* legende minimale (repere lecture, pas de sous-titre bas d'ecran — safe zone) */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 100,
            fontFamily: "'Archivo','Arial Narrow',sans-serif",
            color: TARGET_GLOW,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#8fa3c8", fontWeight: 700 }}>NIGERIA</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>DEUX GAZODUCS RIVAUX</div>
          <div style={{ display: "flex", gap: 28, marginTop: 14, fontSize: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 4, background: AAGP_COLOR, borderRadius: 2 }} />
              <span>AAGP — cotier, 13 pays</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 4, background: TSGP_COLOR, borderRadius: 2 }} />
              <span>TSGP — direct, Sahara</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default ProtoGazoducCartePlate;

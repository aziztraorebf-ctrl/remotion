// ProtoFicelles — PROTO DA (jetable) : concept "les ficelles qui claquent".
//
// IDEE FORTE (DA divergence) : les 3 pays du Sahel (Mali/Burkina/Niger) sont tenus
// par des FICELLES d'alliance qui partent de leurs capitales vers l'Europe
// (hors-champ, vers le HAUT de l'ecran). Au fil de la narration, ces fils CLAQUENT
// un par un (rupture nette + effet fouettement/overshoot) = rupture des alliances.
// A la fin, de NOUVEAUX fils dores commencent a se tisser ENTRE les 3 capitales
// (l'AES nait). Sidration par la physicalite des liens (ref Kurzgesagt).
//
// Couche PURE dessinee par-dessus la carte du moteur. Recoit SahelRenderContext
// (frame, project lon/lat->px). Ne possede PAS la map. SVG 100% frame-driven.
//
// Triggers narration V5 (@30fps) :
//   "chassent"  f145  -> claquement fil Mali (Bamako)
//   "Rompent"   f217  -> claquement fil Burkina (Ouagadougou)
//   "quittent"  f286  -> claquement fil Niger (Niamey)
//   "batissent" f477  -> tissage des nouveaux fils dores (AES)

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

// ============================================================
// Triggers (frames @30fps)
// ============================================================
const F_BAMAKO_SNAP = 145; // "chassent" -> claque fil Mali
const F_OUAGA_SNAP = 217; // "Rompent" -> claque fil Burkina
const F_NIAMEY_SNAP = 286; // "quittent" -> claque fil Niger
const F_TISSAGE = 477; // "batissent quelque chose de nouveau" -> AES nait

// Duree d'un claquement (rupture + fouettement)
const SNAP_DUR = 12;

// Palette parchemin / Sahel
const INK = "#3A2A18"; // encre brune (fils d'alliance vers l'Europe)
const KAKI = "#5A5333"; // kaki militaire (ombre/double trace)
const OR_AES = "#C99A3A"; // or mat (nouveaux fils AES)

// Capitales (lon, lat)
const BAMAKO: [number, number] = [-7.99, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const LIPTAKO: [number, number] = [-0.5, 14.5]; // centre AES (tissage)

type Capitale = {
  name: string;
  coord: [number, number];
  snapFrame: number;
  // decalage horizontal de l'ancre haute (hors-champ) pour varier l'angle des fils
  topDx: number;
};

const CAPITALES: Capitale[] = [
  { name: "BAMAKO", coord: BAMAKO, snapFrame: F_BAMAKO_SNAP, topDx: -120 },
  { name: "OUAGA", coord: OUAGA, snapFrame: F_OUAGA_SNAP, topDx: 40 },
  { name: "NIAMEY", coord: NIAMEY, snapFrame: F_NIAMEY_SNAP, topDx: 180 },
];

type Props = {
  ctx: SahelRenderContext | null;
};

export const ProtoFicelles: React.FC<Props> = ({ ctx }) => {
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // Ancre haute commune (hors-champ vers l'Europe = vers le haut). Chaque fil vise
  // un point legerement decale autour de ce centre, pour eviter le faisceau parfait.
  const topAnchorX = width * 0.52;
  const topAnchorY = -100;

  // ---------- FILS D'ALLIANCE (vers l'Europe) ----------
  // Chaque fil : courbe de Bezier quadratique de la capitale vers le haut.
  // - Avant le snap : leger "tendu" qui oscille (Math.sin), corde pas droite.
  // - Au snap (SNAP_DUR f) : fouettement = le point de controle se redresse avec
  //   overshoot (Easing.out(Easing.back)) PUIS le fil se retracte vers le haut
  //   (strokeDashoffset) et disparait.
  const fils = CAPITALES.map((cap) => {
    const a = project(cap.coord[0], cap.coord[1]); // ancre basse (capitale)
    const bx = topAnchorX + cap.topDx;
    const by = topAnchorY;

    // progression du claquement 0..1 (overshoot = fouettement)
    const snapT = interpolate(frame, [cap.snapFrame, cap.snapFrame + SNAP_DUR], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(2.2)),
    });
    const snapped = frame >= cap.snapFrame + SNAP_DUR;

    // longueur approx (corde droite suffit pour le dashoffset)
    const baseLen = Math.hypot(bx - a.x, by - a.y);

    // point de controle (milieu, decale lateralement = corde courbe douce).
    // Au repos : oscillation lente (tension vivante). Au snap : repousse en overshoot.
    const midX = (a.x + bx) / 2;
    const midY = (a.y + by) / 2;
    const baseSag = 38; // amplitude de courbure de base (cote duquel le fil pend)
    const osc = Math.sin(frame * 0.06 + cap.topDx * 0.01) * 6; // micro-vibration tendue
    const sagFactor = 1 + snapT * 2.4; // au claquement le fil claque vers l'exterieur
    const ctrlX = midX + (baseSag + osc) * sagFactor;
    const ctrlY = midY;

    const d = `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(
      1,
    )} ${bx.toFixed(1)},${by.toFixed(1)}`;

    // retraction : une fois le snap entame, le fil se retire vers le haut (dashoffset
    // monte = le segment "remonte" et disparait). Synchronise avec le fouettement.
    const retract = interpolate(frame, [cap.snapFrame + 4, cap.snapFrame + SNAP_DUR + 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });

    return {
      name: cap.name,
      anchor: a,
      d,
      len: baseLen,
      retract,
      snapped,
      visible: !snapped || retract < 1,
      snapping: frame >= cap.snapFrame && frame < cap.snapFrame + SNAP_DUR + 6,
    };
  });

  // ---------- TISSAGE AES (nouveaux fils dores) ----------
  // A f477 : 3 fils dores se tissent entre les capitales (triangle Bamako-Ouaga-
  // Niamey). Draw-in via strokeDashoffset. + coeur AES (Liptako) qui s'allume.
  const bamako = project(BAMAKO[0], BAMAKO[1]);
  const ouaga = project(OUAGA[0], OUAGA[1]);
  const niamey = project(NIAMEY[0], NIAMEY[1]);
  const liptako = project(LIPTAKO[0], LIPTAKO[1]);

  type Tissage = { a: { x: number; y: number }; b: { x: number; y: number }; delay: number };
  const tissages: Tissage[] = [
    { a: bamako, b: ouaga, delay: 0 },
    { a: ouaga, b: niamey, delay: 14 },
    { a: niamey, b: bamako, delay: 28 },
  ];
  const TISSAGE_DUR = 40;

  const coeurOp = interpolate(frame, [F_TISSAGE + 10, F_TISSAGE + 40], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* ---------- FILS D'ALLIANCE (encre, vers le haut / Europe) ---------- */}
        {fils.map((f, i) =>
          f.visible ? (
            <g key={`fil-${i}`} style={{ mixBlendMode: "multiply" }}>
              {/* ombre kaki (double trace = matiere de corde) */}
              <path
                d={f.d}
                fill="none"
                stroke={KAKI}
                strokeWidth={4}
                strokeOpacity={0.22 * (1 - f.retract)}
                strokeLinecap="round"
                strokeDasharray={f.len}
                strokeDashoffset={-f.len * f.retract}
              />
              {/* fil net (encre) */}
              <path
                d={f.d}
                fill="none"
                stroke={INK}
                strokeWidth={f.snapping ? 3 : 2.4}
                strokeOpacity={0.9 * (1 - f.retract)}
                strokeLinecap="round"
                strokeDasharray={f.len}
                strokeDashoffset={-f.len * f.retract}
              />
            </g>
          ) : null,
        )}

        {/* ---------- TISSAGE AES (nouveaux fils dores entre capitales) ---------- */}
        {frame >= F_TISSAGE &&
          tissages.map((t, i) => {
            const start = F_TISSAGE + t.delay;
            const draw = interpolate(frame, [start, start + TISSAGE_DUR], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            });
            if (draw <= 0) return null;
            const len = Math.hypot(t.b.x - t.a.x, t.b.y - t.a.y);
            const d = `M${t.a.x.toFixed(1)},${t.a.y.toFixed(1)} L${t.b.x.toFixed(
              1,
            )},${t.b.y.toFixed(1)}`;
            return (
              <g key={`aes-${i}`}>
                {/* halo dore diffus */}
                <path
                  d={d}
                  fill="none"
                  stroke={OR_AES}
                  strokeWidth={5}
                  strokeOpacity={0.2 * draw}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                  style={{ filter: "blur(3px)" }}
                />
                {/* fil dore net */}
                <path
                  d={d}
                  fill="none"
                  stroke={OR_AES}
                  strokeWidth={2.2}
                  strokeOpacity={0.95 * draw}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                />
              </g>
            );
          })}

        {/* coeur AES (Liptako) qui s'allume au tissage */}
        {coeurOp > 0 && (
          <circle
            cx={liptako.x}
            cy={liptako.y}
            r={28}
            fill={OR_AES}
            fillOpacity={coeurOp * 0.5}
            style={{ filter: "blur(10px)" }}
          />
        )}

        {/* ---------- ancres aux capitales (point discret d'attache) ---------- */}
        {CAPITALES.map((cap, i) => {
          const p = project(cap.coord[0], cap.coord[1]);
          const f = fils[i];
          // flash de rupture au snap (l'attache "saute")
          const flash = f.snapping
            ? interpolate(frame, [cap.snapFrame, cap.snapFrame + 8], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;
          return (
            <g key={`anchor-${i}`} style={{ mixBlendMode: "multiply" }}>
              {flash > 0 && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={6 + flash * 12}
                  fill="none"
                  stroke={INK}
                  strokeWidth={2}
                  strokeOpacity={flash * 0.6}
                />
              )}
              <circle cx={p.x} cy={p.y} r={3.2} fill={INK} fillOpacity={0.85} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default ProtoFicelles;

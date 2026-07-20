/**
 * SCENE 2 — "L'arrivee et le paradoxe". VRAIE CONTINUATION de CargoVoyage16x9 (meme monde, pas un
 * nouveau lieu). Aziz (2026-07-02) : la premiere version etait un lieu DIFFERENT (port generique) ->
 * corrige. Ici : MEME ocean (memes lignes/couleur), MEME cargo (meme dessin/silhouette), la nuit de fin
 * de Scene 1 qui redevient jour, le navire maintenant A QUAI (immobile), une grue qui le decharge, et
 * un docker (StickRig, gilet+casque) qui regarde la manoeuvre sur le quai.
 *
 * Continuite avec CargoVoyage16x9 (memes constantes/mecaniques reutilisees a l'identique) :
 *   - Palette ocean SEA_B (bleu froid, fin de Scene 1) + ciel qui redemarre en nuit (etoiles) -> jour.
 *   - Meme dessin de coque/superstructure/cheminee/conteneurs que CargoVoyage16x9 (copie exacte).
 *   - Memes lignes d'ocean onduleuses (meme fonction, meme registre visuel).
 *   - Quai qui remplace l'horizon lointain (le bateau est maintenant ARRETE, plus de defilement horizontal).
 *
 * Nouveau dans cette scene : grue qui decharge (cable+charge), ligne qui se trace vers l'usine (meme
 * recette stroke-dashoffset qu'IngaH16x9), usine qui se colorise neutre->premium (LE PARADOXE), docker
 * StickRig avec tunicColor=gilet haute-visibilite + hat="cap" (casque stylise), debout, regarde (pas de
 * marche : `moveAmt=0`, `bend=0`).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";

export const PORT_DECHARGEMENT_FPS = 30;
export const PORT_DECHARGEMENT_FRAMES = 500; // ~16.7s

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// ---- MEME PALETTE que la fin de CargoVoyage16x9 (continuite directe : on repart de la nuit) ----
const SKY_NIGHT = "#1c2536";
const SKY_DAY = "#dce8ef";   // = SKY_B de CargoVoyage16x9 (ciel froid pale, cote europeen)
const SUN_COLOR = "#cfe3ee"; // = SUN_B de CargoVoyage16x9 (soleil/lune pale, deja froid)
const SEA_COLOR = "#5f84a3"; // = SEA_B de CargoVoyage16x9 (ocean nordique, bleu froid) — FIXE, on est arrive

const NEUTRAL = "#8a8378";
const PREMIUM = "#8a3a2e";
const PREMIUM_GLOW = "#c98a3a";

// timeline
const F_DAWN_START = 20;
const F_DAWN_END = 180; // nuit -> jour, plus lent qu'un simple fade (c'est un LEVER, prend son temps)
const F_CRANE_START = 200;
const F_CRANE_DOWN = 250;
const F_CRANE_HOLD = 265;
const F_CRANE_UP = 300;
const F_LINE_START = 310;
const F_LINE_END = 400;
const F_FACTORY_COLOR_START = 380;
const F_FACTORY_COLOR_END = 470;

export const PortDechargement16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // ---- LEVER DU JOUR (continuite : Scene 1 finissait en nuit etoilee) ----
  const dawn = interpolate(frame, [F_DAWN_START, F_DAWN_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const skyColor = lerpHex(SKY_NIGHT, SKY_DAY, dawn);
  const nightFade = 1 - dawn; // etoiles s'estompent en meme temps que le jour se leve

  // soleil : se leve depuis l'horizon (bas-droite, cote europeen = a droite du cadre) vers le haut
  const sunX = 1560;
  const sunY = interpolate(frame, [F_DAWN_START, F_DAWN_END], [860, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const sunOpacity = interpolate(dawn, [0, 0.15, 1], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- OCEAN (MEME registre que CargoVoyage16x9 : lignes onduleuses empilees, meme fonction) ----
  const seaLines = Array.from({ length: 11 }, (_, row) => {
    const y = 726 + row * 30;
    const speed = 0.5 + row * 0.06;
    const offset = (wf * speed) % 160;
    return { y, offset, opacity: 0.35 - row * 0.016 };
  });

  // ---- CARGO (MEME dessin que CargoVoyage16x9, maintenant A QUAI = immobile, juste le tangage residuel) ----
  const cargoX = 560;
  const cargoBob = Math.sin(wf / 34) * 3; // tangage tres leger, amarre
  const cargoY = 738 + cargoBob;
  const pitch = Math.sin(wf / 40) * 0.5;

  // ---- QUAI (remplace l'horizon lointain — le bateau est arrive, plus de destination au loin) ----
  const dockY = 700;

  // ---- GRUE : decharge LE cargo present dans cette scene (pas un port generique) ----
  const craneBaseX = 900, craneBaseY = dockY + 40;
  const craneArmLen = 420;
  const craneArmAngle = -14;
  const armRad = (craneArmAngle * Math.PI) / 180;
  const hookAnchorX = craneBaseX + Math.cos(armRad) * craneArmLen * 0.78;
  const hookAnchorY = craneBaseY - 320 + Math.sin(armRad) * craneArmLen * 0.78;

  const GROUND_DROP_Y = craneBaseY - 30;
  const cableProgress = interpolate(frame, [F_CRANE_START, F_CRANE_DOWN, F_CRANE_HOLD, F_CRANE_UP], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const cableLenMax = GROUND_DROP_Y - hookAnchorY - 22;
  const cableLen = 20 + cableProgress * (cableLenMax - 20);
  const hookY = hookAnchorY + cableLen;

  // ---- LIGNE QUI SE TRACE (conteneur depose -> usine), meme recette qu'IngaH16x9 ----
  const lineStartX = hookAnchorX, lineStartY = GROUND_DROP_Y;
  const lineEndX = 1620, lineEndY = dockY;
  const lineDx = lineEndX - lineStartX, lineDy = lineEndY - lineStartY;
  const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy);
  const lineDraw = interpolate(frame, [F_LINE_START, F_LINE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const lineDashoffset = lineLength * (1 - lineDraw);

  // ---- USINE : colorisation progressive = LE PARADOXE (registre deja valide) ----
  const factoryColorT = interpolate(frame, [F_FACTORY_COLOR_START, F_FACTORY_COLOR_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const factoryFill = lerpHex(NEUTRAL, PREMIUM, factoryColorT);
  const factoryGlow = interpolate(factoryColorT, [0.6, 1], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dockStacks = [
    { x: 1180, y: dockY, rows: 2 },
    { x: 1260, y: dockY, rows: 3 },
  ];

  // ---- DOCKER : StickRig, gilet haute-visibilite (tunicColor) + casque (hat="cap"), regarde la grue (immobile) ----
  // Position AVANT le mat de la grue (craneBaseX=900) pour ne jamais etre traverse par le bras/cable qui pivotent au-dessus.
  const dockerX = 720, dockerY = dockY;
  const dockerEnter = interpolate(frame, [F_CRANE_START - 60, F_CRANE_START - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const dockerBreath = Math.sin(wf / 50) * 0.03; // respiration legere, contemplatif

  const sigOp = interpolate(frame, [F_FACTORY_COLOR_END - 20, F_FACTORY_COLOR_END + 30], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

        {/* ===== CIEL (etoiles qui s'estompent, soleil qui se leve) ===== */}
        <defs>
          <radialGradient id="portSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SUN_COLOR} stopOpacity={0.45} />
            <stop offset="55%" stopColor={SUN_COLOR} stopOpacity={0.14} />
            <stop offset="100%" stopColor={SUN_COLOR} stopOpacity={0} />
          </radialGradient>
        </defs>

        {nightFade > 0.05 &&
          [
            { x: 180, y: 120 }, { x: 460, y: 90 }, { x: 720, y: 160 }, { x: 980, y: 100 },
            { x: 1240, y: 140 }, { x: 340, y: 260 }, { x: 1080, y: 220 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={2.6} fill="#fbfbfb" opacity={nightFade * (0.5 + 0.5 * Math.sin(wf / 20 + i))} />
          ))}

        <circle cx={sunX} cy={sunY} r={170} fill="url(#portSun)" opacity={sunOpacity} />
        <circle cx={sunX} cy={sunY} r={78} fill={SUN_COLOR} opacity={0.95 * sunOpacity} />
        <circle cx={sunX} cy={sunY} r={78} fill="none" stroke={INK} strokeWidth={2.6} opacity={0.35 * sunOpacity} />

        {/* mouettes */}
        {[{ x0: 1400, y: 140, phase: 0 }, { x0: 1600, y: 190, phase: 1.4 }].map((b, k) => {
          const bx = b.x0 + Math.sin(wf / 60 + b.phase) * 40;
          const by = b.y + Math.sin(wf / 40 + b.phase) * 10;
          return <path key={k} d={`M${bx - 18} ${by} Q${bx - 6} ${by - 10} ${bx} ${by} Q${bx + 6} ${by - 10} ${bx + 18} ${by}`} fill="none" stroke={INK} strokeWidth={2} opacity={0.4 * dawn} />;
        })}

        {/* ===== QUAI (remplace l'horizon — bateau arrive, plus de destination au loin) ===== */}
        <path d={`M0 ${dockY} H1920 L1920 1080 L0 1080 Z`} fill={INK} opacity={0.08} />
        <path d={`M0 ${dockY} H1920`} stroke={INK} strokeWidth={2.6} opacity={0.5} />

        {/* ===== OCEAN — fond (MEME registre visuel que CargoVoyage16x9) ===== */}
        <rect x={-200} y={720} width={2320} height={360} fill={SEA_COLOR} opacity={0.5} />
        {seaLines.filter((l) => l.y < cargoY).map((l, i) => {
          const points: string[] = [];
          for (let x = -200; x <= 2100; x += 40) {
            const wob = Math.sin((x + l.offset) / 70 + i) * 6;
            points.push(`${x},${l.y + wob}`);
          }
          return <polyline key={i} points={points.join(" ")} fill="none" stroke={INK} strokeWidth={2} opacity={l.opacity} />;
        })}

        {/* ===== CARGO — MEME dessin que CargoVoyage16x9 (copie exacte du groupe), maintenant A QUAI ===== */}
        <g transform={`translate(${cargoX} ${cargoY}) rotate(${pitch})`}>
          <path d="M -180 0 L 180 0 L 210 34 L -210 34 Q -180 44 -170 30 Z" fill={INK} opacity={0.88} />
          <rect x={60} y={-58} width={70} height={58} fill={INK} opacity={0.88} rx={3} />
          <rect x={78} y={-92} width={18} height={38} fill={INK} opacity={0.9} />
          {[0, 1, 2].map((k) => {
            const t = ((wf / 3 + k * 40) % 120) / 120;
            const sx = 87 + Math.sin(wf / 20 + k) * 10 + t * 20;
            const sy = -96 - t * 60;
            const op = interpolate(t, [0, 0.15, 1], [0, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const r = 8 + t * 16;
            return <circle key={k} cx={sx} cy={sy} r={r} fill={INK} opacity={op} />;
          })}
          {/* conteneurs restants sur le pont (2 dechages, sur les 5 initiaux) */}
          {[-140, -95].map((cx, i) => (
            <rect key={i} x={cx} y={-24 - (i % 2) * 14} width={40} height={24} fill={PARCH} stroke={INK} strokeWidth={2} opacity={0.85} />
          ))}
          <ellipse cx={0} cy={38} rx={200} ry={12} fill={INK} opacity={0.18} />
        </g>
        {/* sillage residuel (amarre, tres attenue) */}
        <g transform={`translate(${cargoX} ${cargoY + cargoBob})`} opacity={0.2}>
          <path d="M -210 30 Q -260 20 -320 34" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        </g>

        {/* ===== CONTENEURS DEJA DECHARGES sur le quai (ton NEUTRE = matiere pas encore transformee) ===== */}
        {dockStacks.map((s, si) => (
          <g key={si}>
            {Array.from({ length: s.rows }, (_, r) => (
              <rect key={r} x={s.x - 32} y={s.y - 30 - r * 34} width={64} height={30} fill={NEUTRAL} stroke={INK} strokeWidth={2.4} opacity={0.75} />
            ))}
          </g>
        ))}

        {/* ===== LIGNE QUI SE TRACE (conteneur depose -> usine) ===== */}
        {lineDraw > 0.001 && (
          <line x1={lineStartX} y1={lineStartY} x2={lineEndX} y2={lineEndY} stroke={INK} strokeWidth={2.6} strokeDasharray={`${lineLength} ${lineLength}`} strokeDashoffset={lineDashoffset} opacity={0.6} />
        )}

        {/* ===== USINE (colorisation = LE PARADOXE) ===== */}
        <g transform={`translate(${lineEndX} ${lineEndY})`}>
          {factoryGlow > 0.001 && <circle cx={0} cy={-60} r={110} fill={PREMIUM_GLOW} opacity={factoryGlow * 0.18} />}
          <rect x={-90} y={-110} width={180} height={110} fill={factoryFill} stroke={INK} strokeWidth={3} opacity={0.88} />
          <rect x={30} y={-170} width={26} height={60} fill={factoryFill} stroke={INK} strokeWidth={2.6} opacity={0.88} />
          {[0, 1, 2].map((k) => {
            const t = ((wf / 3 + k * 40) % 140) / 140;
            const sx = 43 + Math.sin(wf / 20 + k) * 8 + t * 14;
            const sy = -172 - t * 70;
            const op = interpolate(t, [0, 0.15, 1], [0, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const r = 7 + t * 15;
            return <circle key={k} cx={sx} cy={sy} r={r} fill={factoryFill} opacity={op} />;
          })}
          {[-56, -14, 28].map((fx, i) => (
            <rect key={i} x={fx} y={-70} width={20} height={26} fill={PARCH} stroke={INK} strokeWidth={2} opacity={0.7} />
          ))}
        </g>

        {/* ===== GRUE ===== */}
        <g>
          <line x1={craneBaseX} y1={craneBaseY} x2={craneBaseX} y2={craneBaseY - 320} stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
          <line x1={craneBaseX - 40} y1={craneBaseY} x2={craneBaseX + 40} y2={craneBaseY} stroke={INK} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
          <line x1={craneBaseX} y1={craneBaseY - 320} x2={hookAnchorX} y2={hookAnchorY} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          <rect x={craneBaseX - 90} y={craneBaseY - 336} width={40} height={26} fill={INK} opacity={0.7} />
          <line x1={hookAnchorX} y1={hookAnchorY} x2={hookAnchorX} y2={hookY} stroke={INK} strokeWidth={2.4} opacity={0.6} />
          <g transform={`translate(${hookAnchorX} ${hookY + 22})`}>
            <rect x={-34} y={-16} width={68} height={32} fill={NEUTRAL} stroke={INK} strokeWidth={2.8} opacity={0.85} />
          </g>
        </g>

        {/* ===== DOCKER — StickRig, gilet haute-visibilite + casque, regarde la grue (immobile, contemplatif) ===== */}
        <g opacity={dockerEnter} transform={`translate(${dockerX} ${dockerY}) scale(0.62) rotate(${dockerBreath})`}>
          <StickRig
            walkPhase={0}
            moving={false}
            moveAmt={0}
            bend={0}
            armReach={0}
            facing={1}
            hat="cap"
            tunicColor="#d19a2e"
            tunicPattern="stripes"
            neckwear="none"
            carry="none"
            load={0}
          />
        </g>
      </svg>

      <div style={{ position: "absolute", bottom: 36, right: 60, opacity: sigOp, color: INK, fontFamily: SERIF, fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
        GéoAfrique
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ============================================================
// CHAR INTERACTION DEMO — STYLE MINIMALISTE LIGNES FINES
// Personnages : stroke only, zero fill, accessoires identitaires
//
// Seg1 (0-299f)    : MARCHE + ARRET — noble vs serf se rencontrent
// Seg2 (300-599f)  : ATTAQUE + RECUL — combat avec flash
// Seg3 (600-899f)  : DIALOGUE — bulles sequentielles
// Seg4 (900-1199f) : SAUT + CHUTE ARRIERE
// Seg5 (1200-1499f): MALADIE PROGRESSIVE — sicknessT 0->1
// Seg6 (1500-1799f): PROCESSION FUNEBRE — 5 porteurs + cercueil
//
// 1800 frames @ 30fps = 60 secondes
// ============================================================

const C = {
  parchment:   "#F0E6C8",
  parchmentD:  "#E2D4A8",
  parchmentDD: "#C8B888",
  ink:         "#2A1E0A",
  inkMed:      "#5A3E1A",
  inkLight:    "#8A6A3A",
  gold:        "#C9A227",
  vermillon:   "#B83020",
  nightBg:     "#1E1608",
  nightMid:    "#2E2410",
  torchGlow:   "#D4820A",
  green:       "#3A5A28",
} as const;

const W = 1920;
const H = 1080;
const SEG = 300;
const GY = 780; // ground Y — ligne de sol

// Epaisseur standard des lignes personnage
const SW = 2.5;   // strokeWidth corps
const SWT = 1.8;  // strokeWidth membres

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ── Background ────────────────────────────────────────────────
function ParchBg({ dark = false }: { dark?: boolean }) {
  const bg   = dark ? C.nightBg  : C.parchment;
  const line = dark ? C.nightMid : C.parchmentD;
  const border = dark ? C.inkMed : C.inkLight;
  return (
    <>
      <rect width={W} height={H} fill={bg} />
      {/* Ligne de sol marquee */}
      <line x1={0} y1={GY} x2={W} y2={GY} stroke={line} strokeWidth={2.5} />
      {/* Cadre parchemin */}
      <rect x={28} y={28} width={W - 56} height={H - 56}
        fill="none" stroke={border} strokeWidth={1.5} opacity={0.4} />
    </>
  );
}

// ── Label segment ─────────────────────────────────────────────
function Label({ title, sub }: { title: string; sub: string }) {
  return (
    <g>
      <rect x={38} y={38} width={660} height={82} rx={5} fill={C.ink} opacity={0.84} />
      <text x={58} y={78} fontFamily="Georgia, serif" fontSize={25}
        fill={C.parchment} fontWeight="bold">{title}</text>
      <text x={58} y={106} fontFamily="Georgia, serif" fontSize={16}
        fill={C.parchmentD}>{sub}</text>
    </g>
  );
}

// ── Batiments style EffectsLab (lignes + fill parchment) ──────
function House({ x, width = 220, height = 200, door = true, cross = false }: {
  x: number; width?: number; height?: number; door?: boolean; cross?: boolean;
}) {
  const bx = x - width / 2;
  const by = GY - height;
  const roofH = height * 0.38;
  return (
    <g>
      {/* Corps */}
      <rect x={bx} y={by + roofH} width={width} height={height - roofH}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={SW} />
      {/* Toit */}
      <polygon
        points={`${bx - 10},${by + roofH} ${x},${by} ${bx + width + 10},${by + roofH}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={SW} />
      {/* Porte */}
      {door && (
        <rect x={x - 20} y={GY - 70} width={40} height={70}
          fill={C.parchmentDD} stroke={C.ink} strokeWidth={1.8} />
      )}
      {/* Croix rouge (maison pestifere) */}
      {cross && (
        <>
          <rect x={bx + 18} y={by + roofH + 20} width={54} height={44}
            fill="none" stroke={C.ink} strokeWidth={1.5} />
          <line x1={bx + 18} y1={by + roofH + 20} x2={bx + 72} y2={by + roofH + 64}
            stroke={C.vermillon} strokeWidth={3} />
          <line x1={bx + 72} y1={by + roofH + 20} x2={bx + 18} y2={by + roofH + 64}
            stroke={C.vermillon} strokeWidth={3} />
        </>
      )}
    </g>
  );
}

function Church({ x }: { x: number }) {
  const bw = 280; const bh = 240;
  const bx = x - bw / 2;
  const by = GY - bh;
  const tw = 70; const th = 120;
  const tx = x - tw / 2;
  return (
    <g>
      {/* Corps */}
      <rect x={bx} y={by} width={bw} height={bh}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={SW} />
      {/* Toit pentagon */}
      <polygon
        points={`${bx - 8},${by} ${x},${by - 60} ${bx + bw + 8},${by}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={SW} />
      {/* Tour */}
      <rect x={tx} y={by - th} width={tw} height={th + 10}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={SW} />
      {/* Fleche tour */}
      <polygon
        points={`${tx - 4},${by - th} ${x},${by - th - 60} ${tx + tw + 4},${by - th}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={SW} />
      {/* Croix clocher */}
      <line x1={x} y1={by - th - 56} x2={x} y2={by - th - 20} stroke={C.ink} strokeWidth={3} />
      <line x1={x - 12} y1={by - th - 42} x2={x + 12} y2={by - th - 42} stroke={C.ink} strokeWidth={3} />
      {/* Porte arrondie */}
      <path d={`M${x - 22},${GY} L${x - 22},${GY - 55} Q${x},${GY - 78} ${x + 22},${GY - 55} L${x + 22},${GY}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={1.8} />
    </g>
  );
}

function Tree({ x, h = 120 }: { x: number; h?: number }) {
  return (
    <g>
      <line x1={x} y1={GY} x2={x} y2={GY - h * 0.42}
        stroke={C.inkMed} strokeWidth={3} />
      <circle cx={x} cy={GY - h * 0.42 - h * 0.32} r={h * 0.32}
        fill={C.green} stroke={C.ink} strokeWidth={1.5} />
    </g>
  );
}

// ================================================================
// COMPOSANT PERSONNAGE — STYLE REFERENCE
// Torse = rectangle avec fill, jambes ecartees, bras lateraux
// Tete grande (~22px), un oeil cote face, accessoires identitaires
//
// facing    : 1=droite -1=gauche
// walkPhase : radians pour oscillation
// armAngle  : rotation bras avant (deg, 0=pendant)
// lean      : inclinaison torse depuis hanche (deg)
// archetype : "serf"|"noble"|"moine"|"medecin"|"marchand"|"base"
// sicknessT : 0->1 progression maladie
// rotation  : rotation corps entier depuis sol (deg, chute)
// ================================================================

interface CharProps {
  facing?: number;
  walkPhase?: number;
  armAngle?: number;
  lean?: number;
  archetype?: "serf" | "noble" | "moine" | "medecin" | "marchand" | "base";
  sicknessT?: number;
  rotation?: number;
  opacity?: number;
}

function Stick({
  facing = 1,
  walkPhase = 0,
  armAngle = 0,
  lean = 0,
  archetype = "base",
  sicknessT = 0,
  rotation = 0,
  opacity = 1,
}: CharProps) {
  // ── Proportions (y=0 = sol, tout monte vers negatif) ──────
  const HEAD_R    = 22;   // rayon tete
  const HEAD_CY   = -200; // centre tete
  const NECK_TOP  = -176; // haut torse
  const HIP_BOT   = -96;  // bas torse = haut jambes
  const TORSE_W   = 36;   // largeur torse
  const ARM_Y     = -162; // attache bras (haut torse)
  const ARM_LEN   = 52;   // longueur bras
  const LEG_LEN   = 96;   // longueur jambe
  const HIP_OFF   = 14;   // ecartement lateral jambes depuis centre

  // Oscillation marche
  const legSwing = Math.sin(walkPhase) * 28;  // jambes
  const armSwing = -Math.sin(walkPhase) * 22; // bras (oppose)

  // Maladie : lean + couleur
  const sickLean  = sicknessT * 24;
  const totalLean = lean + sickLean;
  const strokeC   = sicknessT > 0.55 ? C.inkMed : C.ink;
  const skinFill  = sicknessT > 0.35
    ? `rgb(${Math.round(lerp(220, 175, sicknessT))},${Math.round(lerp(205, 185, sicknessT))},${Math.round(lerp(162, 130, sicknessT))})`
    : C.parchmentD;
  const torseFill = archetype === "moine"    ? C.parchmentDD
                  : archetype === "medecin"  ? C.inkMed
                  : archetype === "noble"    ? "#B8A060"
                  : C.parchmentD;

  return (
    <g opacity={opacity} transform={`rotate(${rotation}, 0, 0)`}>

      {/* ── JAMBES (ecartees, pivot depuis hanche) ── */}
      {/* Jambe gauche (arriere selon facing) */}
      <g transform={`translate(${-HIP_OFF}, ${HIP_BOT}) rotate(${-legSwing * facing})`}>
        <line x1={0} y1={0} x2={0} y2={LEG_LEN}
          stroke={strokeC} strokeWidth={2.8} strokeLinecap="round" />
      </g>
      {/* Jambe droite (avant selon facing) */}
      <g transform={`translate(${HIP_OFF}, ${HIP_BOT}) rotate(${legSwing * facing})`}>
        <line x1={0} y1={0} x2={0} y2={LEG_LEN}
          stroke={strokeC} strokeWidth={2.8} strokeLinecap="round" />
      </g>

      {/* ── TORSE (rectangle avec fill, pivot hanche) ── */}
      <g transform={`translate(0, ${HIP_BOT}) rotate(${totalLean})`}>
        {/* Corps principal */}
        <rect
          x={-TORSE_W / 2} y={NECK_TOP - HIP_BOT}
          width={TORSE_W} height={HIP_BOT - NECK_TOP}
          fill={torseFill} stroke={strokeC} strokeWidth={SW}
          rx={3}
        />

        {/* Robe moine : deux lignes evasees qui descendent sous le torse */}
        {archetype === "moine" && (
          <>
            <line x1={-TORSE_W / 2} y1={-10} x2={-TORSE_W / 2 - 18} y2={HIP_BOT * -1 - 4}
              stroke={strokeC} strokeWidth={1.8} />
            <line x1={TORSE_W / 2}  y1={-10} x2={TORSE_W / 2 + 18}  y2={HIP_BOT * -1 - 4}
              stroke={strokeC} strokeWidth={1.8} />
          </>
        )}

        {/* Hotte marchand (rectangle dans le dos) */}
        {archetype === "marchand" && (
          <rect
            x={facing > 0 ? -TORSE_W / 2 - 24 : TORSE_W / 2 + 2}
            y={NECK_TOP - HIP_BOT + 4}
            width={22} height={34}
            fill="none" stroke={strokeC} strokeWidth={1.6} />
        )}

        {/* ── BRAS (depuis haut torse, lateraux) ── */}
        {/* Bras arriere */}
        <g transform={`translate(${(-TORSE_W / 2) * facing}, ${NECK_TOP - HIP_BOT + 8}) rotate(${(armSwing - 12) * facing})`}>
          <line x1={0} y1={0} x2={0} y2={ARM_LEN}
            stroke={strokeC} strokeWidth={SWT} strokeLinecap="round" />
        </g>
        {/* Bras avant */}
        <g transform={`translate(${(TORSE_W / 2) * facing}, ${NECK_TOP - HIP_BOT + 8}) rotate(${(armSwing + armAngle) * facing})`}>
          <line x1={0} y1={0} x2={0} y2={ARM_LEN}
            stroke={strokeC} strokeWidth={SWT} strokeLinecap="round" />
          {/* Baton medecin tenu en main */}
          {archetype === "medecin" && armAngle === 0 && (
            <line x1={0} y1={ARM_LEN} x2={facing * 6} y2={ARM_LEN + 55}
              stroke={strokeC} strokeWidth={2.2} strokeLinecap="round" />
          )}
        </g>
      </g>

      {/* ── TETE ── */}
      <g transform={`translate(0, ${HEAD_CY + totalLean * 1.5})`}>
        <circle cx={0} cy={0} r={HEAD_R}
          fill={skinFill} stroke={strokeC} strokeWidth={SW} />

        {/* Oeil unique cote face */}
        {sicknessT < 0.88 && (
          <circle cx={facing * 8} cy={-1} r={3.2} fill={strokeC} />
        )}

        {/* Yeux croix si mort/inconscient */}
        {sicknessT >= 0.88 && (
          <>
            <line x1={facing * 3}  y1={-6} x2={facing * 13} y2={2}  stroke={strokeC} strokeWidth={2} />
            <line x1={facing * 13} y1={-6} x2={facing * 3}  y2={2}  stroke={strokeC} strokeWidth={2} />
          </>
        )}

        {/* Chapeau noble : cylindre simplifie */}
        {archetype === "noble" && (
          <>
            <line x1={-HEAD_R - 5} y1={-HEAD_R + 2} x2={HEAD_R + 5} y2={-HEAD_R + 2}
              stroke={strokeC} strokeWidth={2.2} strokeLinecap="round" />
            <rect x={-14} y={-HEAD_R - 20} width={28} height={22}
              fill={torseFill} stroke={strokeC} strokeWidth={2} />
          </>
        )}

        {/* Capuche moine */}
        {archetype === "moine" && (
          <path
            d={`M-${HEAD_R},0 Q-${HEAD_R + 6},-${HEAD_R + 28} 0,-${HEAD_R + 30} Q${HEAD_R + 6},-${HEAD_R + 28} ${HEAD_R},0`}
            fill={torseFill} stroke={strokeC} strokeWidth={1.8} />
        )}

        {/* Bec medecin : chapeau + triangle bec */}
        {archetype === "medecin" && (
          <>
            <line x1={-HEAD_R - 4} y1={-HEAD_R + 2} x2={HEAD_R + 4} y2={-HEAD_R + 2}
              stroke={strokeC} strokeWidth={2} strokeLinecap="round" />
            <rect x={-12} y={-HEAD_R - 18} width={24} height={20}
              fill={C.inkMed} stroke={strokeC} strokeWidth={1.8} />
            <path
              d={`M${facing * (HEAD_R - 3)},2 L${facing * (HEAD_R + 26)},8 L${facing * (HEAD_R - 3)},14`}
              fill={C.parchmentD} stroke={strokeC} strokeWidth={1.8} />
          </>
        )}

        {/* Bubon si malade */}
        {sicknessT > 0.4 && (
          <circle
            cx={HEAD_R - 3} cy={10}
            r={clamp(sicknessT * 8, 2, 8)}
            fill={C.vermillon} opacity={clamp(sicknessT * 1.1, 0, 0.95)} />
        )}
      </g>
    </g>
  );
}

// ── Bulle de dialogue ─────────────────────────────────────────
function SpeechBubble({ px, text, frame, start, facing = 1 }: {
  px: number; text: string; frame: number; start: number; facing?: number;
}) {
  const lf = frame - start;
  if (lf < 0) return null;
  const appear = spring({ fps: 30, frame: lf, config: { damping: 16, stiffness: 220 } });
  const chars = Math.floor(clamp(lf / 1.8, 0, text.length));
  const bw = Math.max(90, chars * 13 + 44);
  const bx = facing > 0 ? px + 22 : px - bw - 22;
  const by = GY - 260;
  const tailX = facing > 0 ? bx + 24 : bx + bw - 24;
  return (
    <g transform={`scale(${appear})`} style={{ transformOrigin: `${px}px ${by}px` }}>
      <rect x={bx} y={by} width={bw} height={54} rx={9}
        fill={C.parchment} stroke={C.ink} strokeWidth={2} />
      <polygon
        points={`${tailX},${by + 54} ${px + facing * 4},${GY - 182} ${tailX + facing * 20},${by + 54}`}
        fill={C.parchment} stroke={C.ink} strokeWidth={1.8} />
      <text x={bx + 18} y={by + 33} fontFamily="Georgia, serif" fontSize={19}
        fill={C.ink} fontStyle="italic">{text.slice(0, chars)}</text>
    </g>
  );
}

// ── Flash impact ──────────────────────────────────────────────
function ImpactFlash({ x, y, frame, start }: { x: number; y: number; frame: number; start: number }) {
  const lf = frame - start;
  if (lf < 0 || lf > 14) return null;
  const op = interpolate(lf, [0, 2, 9, 14], [0, 1, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r  = interpolate(lf, [0, 9], [8, 52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r * 0.55} fill={C.gold} />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return (
          <line key={i}
            x1={x + Math.cos(rad) * r * 0.65} y1={y + Math.sin(rad) * r * 0.65}
            x2={x + Math.cos(rad) * r * 1.5}  y2={y + Math.sin(rad) * r * 1.5}
            stroke={C.vermillon} strokeWidth={2.5} strokeLinecap="round" />
        );
      })}
    </g>
  );
}

// ── Torche + halo nocturne ────────────────────────────────────
function Torch({ x, y, frame }: { x: number; y: number; frame: number }) {
  const flicker = Math.sin(frame * 0.31) * 0.08 + Math.sin(frame * 0.73) * 0.05;
  const r = 160 + flicker * 40;
  return (
    <g>
      <defs>
        <radialGradient id="torchGrad" cx="50%" cy="80%" r="50%">
          <stop offset="0%"   stopColor={C.torchGlow} stopOpacity={0.55 + flicker} />
          <stop offset="60%"  stopColor="#A05010"      stopOpacity={0.18} />
          <stop offset="100%" stopColor="#000000"       stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.65} fill="url(#torchGrad)" />
      {/* Manche */}
      <rect x={x - 3} y={y - 40} width={6} height={42}
        fill={C.inkMed} stroke={C.ink} strokeWidth={1.5} />
      {/* Flamme */}
      <ellipse cx={x} cy={y - 46} rx={7} ry={10 + flicker * 6}
        fill={C.gold} stroke={C.torchGlow} strokeWidth={1} />
      <ellipse cx={x} cy={y - 50} rx={4} ry={6}
        fill="#FFEEAA" opacity={0.9} />
    </g>
  );
}

// ================================================================
// SEGMENT 1 — MARCHE + ARRET
// Noble (gauche) marche vers Serf (droite). Ils s'arretent.
// ================================================================
function Seg1Walk({ frame }: { frame: number }) {
  const f = frame;

  const nobleX = interpolate(f, [0, 110], [280, 680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const serfX  = interpolate(f, [0, 110], [1640, 1240],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const walking = f < 110;

  const stopBounce = spring({ fps: 30, frame: Math.max(0, f - 108), config: { damping: 11, stiffness: 160 } });
  const nobleFinalX = 680 - stopBounce * 12;

  return (
    <g>
      <ParchBg />
      <House x={320}  cross={true} />
      <Church x={960} />
      <House x={1600} />
      <Tree x={140} h={110} />
      <Tree x={1780} h={130} />

      <g transform={`translate(${nobleFinalX + (walking ? nobleX - 680 : 0)}, ${GY})`}>
        <Stick facing={1} walkPhase={walking ? f * 0.19 : 0} archetype="noble" />
      </g>
      <g transform={`translate(${serfX}, ${GY})`}>
        <Stick facing={-1} walkPhase={walking ? f * 0.19 : 0} archetype="serf"
          lean={f > 115 ? 6 : 0} />
      </g>

      {f > 118 && f < 220 && (
        <text x={W / 2} y={GY + 58} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight}
          opacity={interpolate(f, [118, 136, 200, 220], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          spring() damping=11 — deceleration + overshoot serf s'incline
        </text>
      )}

      <Label title="SEG 1 — MARCHE + ARRET" sub="Noble avec chapeau · serf s'incline · spring() deceleration" />
    </g>
  );
}

// ================================================================
// SEGMENT 2 — ATTAQUE + RECUL
// ================================================================
function Seg2Attack({ frame }: { frame: number }) {
  const f = frame - SEG;

  const atkX = interpolate(f, [0, 55], [260, 660],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const armUp    = interpolate(f, [55, 80], [0, -135], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const armDown  = interpolate(f, [80, 92], [-135, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const armCurr  = f < 92 ? (f < 80 ? armUp : armDown) : 30;

  const recoil   = spring({ fps: 30, frame: Math.max(0, f - 91), config: { damping: 7, stiffness: 340 } });
  const victimX  = 1160 + recoil * 230;

  const fallRot  = interpolate(f, [195, 268], [0, 88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fallYOff = Math.sin(fallRot * Math.PI / 180) * 88;

  const victimExpr: CharProps["archetype"] = "serf";

  return (
    <g>
      <ParchBg />
      <House x={260} cross={true} />
      <Church x={960} />
      <House x={1660} />
      <Tree x={1820} h={100} />

      {/* Attaquant (noble) */}
      <g transform={`translate(${atkX}, ${GY})`}>
        <Stick facing={1} walkPhase={f < 55 ? f * 0.21 : 0}
          armAngle={f >= 55 ? armCurr : 0} archetype="noble" />
      </g>

      <ImpactFlash x={victimX - 28} y={GY - 135} frame={f} start={92} />

      {/* Victime (serf) tombe */}
      <g transform={`translate(${victimX}, ${GY + fallYOff}) rotate(${fallRot}, 0, ${-88})`}>
        <Stick facing={-1} lean={f > 92 ? -8 : 0}
          sicknessT={f > 200 ? clamp((f - 200) / 60, 0, 0.95) : 0}
          archetype={victimExpr} />
      </g>

      {f > 88 && f < 115 && (
        <text x={W / 2} y={GY + 55} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={19} fill={C.vermillon}
          opacity={interpolate(f, [88, 96, 108, 115], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          impact flash + spring recul
        </text>
      )}

      <Label title="SEG 2 — ATTAQUE + RECUL" sub="arm rotate · flash gold · spring recoil · chute rot 88deg · maladie progressive" />
    </g>
  );
}

// ================================================================
// SEGMENT 3 — DIALOGUE (bulles sequentielles)
// ================================================================
function Seg3Dialogue({ frame }: { frame: number }) {
  const f = frame - SEG * 2;

  return (
    <g>
      <ParchBg />
      <House x={300} />
      <Church x={960} />
      <House x={1620} />

      {/* Medecin (gauche) */}
      <g transform={`translate(580, ${GY})`}>
        <Stick facing={1} archetype="medecin" />
      </g>
      {/* Serf (droite) */}
      <g transform={`translate(1340, ${GY})`}>
        <Stick facing={-1} archetype="serf"
          lean={f > 0 && f < 200 ? 8 : 0} />
      </g>

      <SpeechBubble px={580}  text="La fievre vous tient?" frame={f} start={0}   facing={1} />
      {f > 90  && <SpeechBubble px={1340} text="Oui, trois jours..."   frame={f} start={90}  facing={-1} />}
      {f > 185 && <SpeechBubble px={580}  text="Fuyez la ville."       frame={f} start={185} facing={1} />}
      {f > 255 && <SpeechBubble px={1340} text="Que Dieu me protege."  frame={f} start={255} facing={-1} />}

      <Label title="SEG 3 — DIALOGUE" sub="bulles sequentielles · texte progressif · medecin a bec · serf penche" />
    </g>
  );
}

// ================================================================
// SEGMENT 4 — SAUT + CHUTE ARRIERE
// ================================================================
function Seg4Jump({ frame }: { frame: number }) {
  const f = frame - SEG * 3;

  const jumpT   = clamp((f - 18) / 96, 0, 1);
  const jumpArc = -Math.sin(Math.PI * jumpT) * 260;
  const jumpX   = interpolate(f, [18, 114], [400, 820], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inAir   = f >= 18 && f <= 114;

  const dustOp  = interpolate(f, [112, 117, 135, 148], [0, 1, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dustR   = interpolate(f, [112, 148], [8, 55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fallRot = interpolate(f, [148, 222], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fallY   = Math.sin(fallRot * Math.PI / 180) * 88;

  return (
    <g>
      <ParchBg />
      <House x={300} />
      <Church x={960} />
      <House x={1620} />
      <Tree x={160} h={110} />

      {/* Sauteur (moine) */}
      <g transform={`translate(${jumpX}, ${GY + jumpArc})`}>
        <Stick facing={1}
          walkPhase={inAir ? jumpT * Math.PI * 4 : 0}
          armAngle={inAir ? -118 : 0}
          lean={inAir && jumpT < 0.48 ? -7 : inAir ? 7 : 0}
          archetype="moine" />
      </g>
      <ellipse cx={jumpX} cy={GY} rx={dustR} ry={dustR * 0.28} fill={C.parchmentDD} opacity={dustOp} />

      {/* Victime (marchand) qui tombe en arriere */}
      <g transform={`translate(1380, ${GY + fallY}) rotate(${fallRot}, 0, -88)`}>
        <Stick facing={-1} archetype="marchand" />
      </g>

      {f > 18 && f < 120 && (
        <text x={620} y={GY + 55} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={19} fill={C.inkLight}
          opacity={interpolate(f, [18, 34, 108, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          y = -sin(PI * t) * 260
        </text>
      )}
      {f > 148 && f < 240 && (
        <text x={1380} y={GY + 65} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={19} fill={C.inkLight}
          opacity={interpolate(f, [148, 162, 228, 240], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          rotate(90) depuis les pieds
        </text>
      )}

      <Label title="SEG 4 — SAUT + CHUTE ARRIERE" sub="arc parabolique · poussiere · rotation 90deg · moine + marchand" />
    </g>
  );
}

// ================================================================
// SEGMENT 5 — MALADIE PROGRESSIVE
// ================================================================
function Seg5Sickness({ frame }: { frame: number }) {
  const f = frame - SEG * 4;

  const sick = clamp(f / 248, 0, 1);
  const walkSpeed = lerp(0.18, 0.04, sick);
  const phase = f * walkSpeed;
  const nightT = clamp((sick - 0.5) * 2, 0, 1);

  const stages = [
    { t: 0.0,  label: "Sain",     x: 100 + (W - 200) * 0.0  },
    { t: 0.25, label: "Fievre",   x: 100 + (W - 200) * 0.25 },
    { t: 0.5,  label: "Bubons",   x: 100 + (W - 200) * 0.5  },
    { t: 0.75, label: "Agonise",  x: 100 + (W - 200) * 0.75 },
    { t: 1.0,  label: "Mort",     x: 100 + (W - 200) * 1.0  },
  ];

  return (
    <g>
      {/* Ciel s'assombrit */}
      <rect width={W} height={H}
        fill={`rgba(30,22,8,${nightT * 0.72})`} />
      <ParchBg dark={nightT > 0.5} />

      {/* Barre progression */}
      <rect x={100} y={GY + 48} width={W - 200} height={10} rx={5} fill={C.parchmentDD} />
      <rect x={100} y={GY + 48} width={(W - 200) * sick}  height={10} rx={5} fill={C.vermillon} />
      {stages.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={GY + 53} r={7}
            fill={sick >= s.t ? C.vermillon : C.parchmentDD} stroke={C.ink} strokeWidth={1.8} />
          <text x={s.x} y={GY + 80} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={17}
            fill={sick >= s.t ? C.ink : C.inkLight} opacity={sick >= s.t ? 1 : 0.5}>
            {s.label}
          </text>
        </g>
      ))}

      <g transform={`translate(${W / 2}, ${GY})`}>
        <Stick facing={1} walkPhase={phase} sicknessT={sick} archetype="serf" />
      </g>

      <Label title="SEG 5 — MALADIE PROGRESSIVE" sub="sicknessT 0->1 · lean + tete · bubon vermillon · marche ralentie · nuit" />
    </g>
  );
}

// ================================================================
// SEGMENT 6 — PROCESSION FUNEBRE
// 4 porteurs + cercueil, nuit, torche en tete
// ================================================================
function Seg6Funeral({ frame }: { frame: number }) {
  const f = frame - SEG * 5;

  // Groupe avance lentement vers la droite
  const groupX = interpolate(f, [0, 280], [-120, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase  = f * 0.09; // marche lente

  // Porteurs : 2 devant, 2 derriere
  const porters = [
    { dx: -60, facing: 1  as const },
    { dx:  60, facing: 1  as const },
    { dx: 220, facing: 1  as const },
    { dx: 380, facing: 1  as const },
  ];

  // Flamme torche oscille
  const torchX = groupX - 100;

  // Croix : un moine marche devant
  const monkX = groupX - 220;

  return (
    <g>
      <ParchBg dark={true} />

      {/* Torche + halo */}
      <Torch x={torchX} y={GY - 160} frame={f} />

      {/* Moine avec crosse en tete */}
      <g transform={`translate(${monkX}, ${GY})`}>
        <Stick facing={1} walkPhase={phase} archetype="moine" />
        {/* Crosse (baton en J) */}
        <g transform="translate(22, -128)">
          <line x1={0} y1={0} x2={0} y2={50} stroke={C.inkMed} strokeWidth={2.5} />
          <path d="M0,0 Q18,-18 18,-36 Q18,-52 4,-52"
            fill="none" stroke={C.inkMed} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      </g>

      {/* Cercueil — rectangle horizontal porte a l'epaule */}
      <g transform={`translate(${groupX + 140}, ${GY - 148})`}>
        <rect x={-90} y={-18} width={290} height={36} rx={5}
          fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.2} />
        {/* Croix sur le couvercle */}
        <line x1={55} y1={-14} x2={55} y2={14} stroke={C.ink} strokeWidth={2} />
        <line x1={38} y1={0}   x2={72} y2={0}  stroke={C.ink} strokeWidth={2} />
      </g>

      {/* Porteurs */}
      {porters.map((p, i) => (
        <g key={i} transform={`translate(${groupX + p.dx}, ${GY})`}>
          <Stick facing={p.facing} walkPhase={phase + i * 0.4}
            armAngle={-68} archetype="serf" />
        </g>
      ))}

      {/* Cimetiere au fond */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${1100 + i * 100}, ${GY})`}>
          {/* Croix de cimetiere */}
          <line x1={0} y1={0} x2={0} y2={-55} stroke={C.inkMed} strokeWidth={2.2} />
          <line x1={-14} y1={-34} x2={14} y2={-34} stroke={C.inkMed} strokeWidth={2.2} />
          {/* Butte */}
          <ellipse cx={0} cy={0} rx={22} ry={7} fill={C.nightMid} />
        </g>
      ))}

      <Tree x={1750} h={140} />

      {/* Texte etoile */}
      {[...Array(22)].map((_, i) => {
        const sx = (i * 337 + 80) % (W - 60) + 30;
        const sy = 40 + (i * 113) % 280;
        const twinkle = 0.4 + Math.sin(f * 0.08 + i) * 0.3;
        return (
          <circle key={i} cx={sx} cy={sy} r={1.5 + (i % 3) * 0.8}
            fill={C.parchmentDD} opacity={twinkle} />
        );
      })}

      <Label title="SEG 6 — PROCESSION FUNEBRE" sub="nuit · torche halo · cercueil porte · cimetiere · etoiles · moine crosse" />
    </g>
  );
}

// ================================================================
// COMPOSITION PRINCIPALE
// ================================================================
export function CharInteractionDemo() {
  useVideoConfig();
  const frame = useCurrentFrame();
  const seg = Math.floor(frame / SEG);

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {seg === 0 && <Seg1Walk    frame={frame} />}
        {seg === 1 && <Seg2Attack  frame={frame} />}
        {seg === 2 && <Seg3Dialogue frame={frame} />}
        {seg === 3 && <Seg4Jump   frame={frame} />}
        {seg === 4 && <Seg5Sickness frame={frame} />}
        {seg === 5 && <Seg6Funeral  frame={frame} />}

        <text x={W - 58} y={H - 38} textAnchor="end"
          fontFamily="Georgia, serif" fontSize={15} fill={C.inkLight} opacity={0.45}>
          {seg + 1}/6 · f{frame}
        </text>
      </svg>
    </AbsoluteFill>
  );
}

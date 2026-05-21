import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Audio,
  AbsoluteFill,
  Sequence,
  staticFile,
} from "remotion";
import { SCENES, CUES, TOTAL_FRAMES, AUDIO_FRAMES, N4_START } from "../config/veilleurTiming";

const W = 1920;
const H = 1080;
const GROUND_Y = H * 0.72;

const BG       = "#050208";
const SHADOW   = "#0a0610";
const GLOW     = "#c8d0e8";
const BIRD_COL = "#1a8fff";
const EMBER    = "#ff7a00";

// ============================================================
// Helpers
// ============================================================

function ci(frame: number, range: number[], output: number[]): number {
  return interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ============================================================
// SVG Defs
// ============================================================

const AllDefs: React.FC = () => (
  <defs>
    <radialGradient id="v-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="#e8f0ff" stopOpacity="0.95" />
      <stop offset="60%"  stopColor="#c0c8e0" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#c0c8e0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="v-fire" cx="50%" cy="30%" r="70%">
      <stop offset="0%"   stopColor="#ffe066" stopOpacity="0.95" />
      <stop offset="50%"  stopColor={EMBER}   stopOpacity="0.7" />
      <stop offset="100%" stopColor="#2a0500" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="v-bird-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor={BIRD_COL} stopOpacity="0.9" />
      <stop offset="100%" stopColor={BIRD_COL} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="v-sage-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="#a8c8ff" stopOpacity="0.6" />
      <stop offset="60%"  stopColor="#7090d0" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#7090d0" stopOpacity="0" />
    </radialGradient>

    <filter id="v-glow-md" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="v-glow-lg" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="35" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="v-soft" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
    <filter id="v-bird-blur" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
    <filter id="v-halo-blur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="28" />
    </filter>
  </defs>
);

// ============================================================
// Etoiles
// ============================================================

const Etoiles: React.FC<{ frame: number; vividBoost: number }> = ({ frame, vividBoost }) => (
  <>
    {Array.from({ length: 60 }).map((_, i) => {
      const seed = i * 6271;
      const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
      const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % 420;

      // Scintillement normal
      const twinkle = 0.4 + Math.sin(frame * 0.06 + i * 0.8) * 0.3;
      // Scintillement vivace : rapide, intense, blanc pur
      const vividTwinkle = 0.85 + Math.sin(frame * 0.22 + i * 1.1) * 0.15;

      const finalOpacity = twinkle + (vividTwinkle - twinkle) * vividBoost;

      // Rayon : plus grand au pic (etoiles s'epanouissent)
      const baseR = (i % 4) * 0.6 + 0.6;
      const vividR = baseR + vividBoost * (1.2 + (i % 3) * 0.8);

      // Couleur : GLOW normal -> blanc pur au pic
      const fill = vividBoost > 0.5 ? "#ffffff" : GLOW;

      return (
        <g key={i}>
          {/* Halo lumineux supplementaire au pic */}
          {vividBoost > 0.3 && (
            <circle cx={sx} cy={sy} r={vividR * 3} fill={GLOW}
              opacity={vividBoost * 0.18 * (0.5 + Math.sin(frame * 0.18 + i) * 0.5)}
            />
          )}
          <circle cx={sx} cy={sy} r={vividR} fill={fill} opacity={Math.min(1, finalOpacity)} />
        </g>
      );
    })}
  </>
);

// ============================================================
// Village de fond
// ============================================================

const Village: React.FC<{ windowsLit: number }> = ({ windowsLit }) => {
  const buildings = [
    { x: 60,   h: 260, w: 110, windows: [[80,  GROUND_Y - 220], [110, GROUND_Y - 160]] },
    { x: 280,  h: 180, w: 90,  windows: [[300, GROUND_Y - 140]] },
    { x: 480,  h: 320, w: 120, windows: [[500, GROUND_Y - 270], [530, GROUND_Y - 200]] },
    { x: 1310, h: 290, w: 130, windows: [[1330, GROUND_Y - 240], [1360, GROUND_Y - 170]] },
    { x: 1560, h: 200, w: 100, windows: [[1580, GROUND_Y - 160]] },
    { x: 1720, h: 260, w: 110, windows: [[1740, GROUND_Y - 210], [1770, GROUND_Y - 150]] },
  ];
  return (
    <>
      {buildings.map((b, i) => (
        <g key={i} opacity={0.88}>
          <rect x={b.x} y={GROUND_Y - b.h} width={b.w} height={b.h} fill={SHADOW} />
          <polygon
            points={`${b.x},${GROUND_Y - b.h} ${b.x + b.w / 2},${GROUND_Y - b.h - 65} ${b.x + b.w},${GROUND_Y - b.h}`}
            fill={SHADOW}
          />
          {b.windows.map(([wx, wy], wi) => (
            <rect key={wi} x={wx} y={wy} width={20} height={26} rx={2}
              fill={windowsLit > 0.02 ? "#f5c830" : "#1a0a00"}
              opacity={0.15 + (i % 2 === 0 ? windowsLit : windowsLit * 0.7) * 0.85}
              filter={windowsLit > 0.3 ? "url(#v-soft)" : undefined}
            />
          ))}
        </g>
      ))}
    </>
  );
};

// ============================================================
// Maison du Sage
// ============================================================

const MaisonDuSage: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity < 0.01) return null;
  const cx = 960;
  const hw = 200;
  const hh = 320;
  const roofH = 110;
  const baseY = GROUND_Y;
  return (
    <g opacity={opacity}>
      <rect x={cx - hw} y={baseY - hh} width={hw * 2} height={hh} fill={SHADOW} />
      <polygon
        points={`${cx - hw - 20},${baseY - hh} ${cx},${baseY - hh - roofH} ${cx + hw + 20},${baseY - hh}`}
        fill={SHADOW}
      />
      <rect x={cx - 22} y={baseY - hh + 55} width={44} height={52} rx={3}
        fill="#f5c830" opacity={0.88} filter="url(#v-soft)"
      />
      <line x1={cx} y1={baseY - hh + 55} x2={cx} y2={baseY - hh + 107} stroke={SHADOW} strokeWidth={3} opacity={0.7} />
      <line x1={cx - 22} y1={baseY - hh + 81} x2={cx + 22} y2={baseY - hh + 81} stroke={SHADOW} strokeWidth={3} opacity={0.7} />
      <path
        d={`M${cx - 28},${baseY} L${cx - 28},${baseY - 80} Q${cx - 28},${baseY - 100} ${cx},${baseY - 100} Q${cx + 28},${baseY - 100} ${cx + 28},${baseY - 80} L${cx + 28},${baseY} Z`}
        fill={BG} opacity={0.9}
      />
      <ellipse cx={cx} cy={baseY - hh + 80} rx={80} ry={60}
        fill="#f5c830" opacity={0.12 * opacity} filter="url(#v-halo-blur)"
      />
    </g>
  );
};

// ============================================================
// Sage
// ============================================================

const Sage: React.FC<{
  armRaise: number;
  haloIntensity: number;
  armRiseS4: number;
}> = ({ armRaise, haloIntensity, armRiseS4 }) => {
  const x = 960;
  const figH = 310;
  const figTopY = GROUND_Y - figH;
  // S2 : bras monte avec l'invocation (armRaise 0->1 = 25deg -> -95deg)
  // S3 : bras redescend (armRaise * armLower, geree dans la composition)
  // S4 : bras remonte directement vers le ciel sur armRiseS4 (0->1 = 25deg -> -95deg)
  const baseAngle = ci(armRaise, [0, 1], [25, -95]);
  // Bras droit. Ligne vers le haut (M0,0 L0,-72), pivot a l'epaule.
  // rotate(115) = bras pendant vers le bas-droite (repos)
  // rotate(20)  = bras leve vers le haut-droite (zenith)
  const armAngle = armRiseS4 > 0
    ? ci(armRiseS4, [0, 1], [115, 20])
    : baseAngle;

  return (
    <g>
      {haloIntensity > 0.01 && (
        <circle cx={x} cy={figTopY + 80} r={220}
          fill="url(#v-sage-halo)"
          opacity={haloIntensity * 0.85}
          filter="url(#v-halo-blur)"
        />
      )}
      <ellipse cx={x} cy={GROUND_Y - 8} rx={55} ry={20} fill={SHADOW} opacity={0.7} filter="url(#v-soft)" />
      <path
        d={`M${x - 48},${figTopY + 80} Q${x - 58},${GROUND_Y - 40} ${x - 32},${GROUND_Y} L${x + 32},${GROUND_Y} Q${x + 58},${GROUND_Y - 40} ${x + 48},${figTopY + 80} Z`}
        fill={SHADOW}
      />
      {[-18, 0, 18].map((ox, i) => (
        <path key={i}
          d={`M${x + ox},${figTopY + 90} Q${x + ox - 5},${GROUND_Y - 55} ${x + ox},${GROUND_Y}`}
          stroke="#120a18" strokeWidth="1.2" fill="none" opacity="0.45"
        />
      ))}
      {/* Bras gauche (derriere le torse) */}
      <g transform={`translate(${x - 42}, ${figTopY + 88}) rotate(20, 0, 0)`}>
        <path d="M0,0 Q-16,32 -10,68" stroke={SHADOW} strokeWidth="13" fill="none" strokeLinecap="round" />
      </g>
      {/* Torse + capuchon */}
      <rect x={x - 42} y={figTopY + 65} width={84} height={110} rx={5} fill={SHADOW} />
      <path
        d={`M${x - 46},${figTopY + 88} Q${x - 50},${figTopY + 22} ${x},${figTopY} Q${x + 50},${figTopY + 22} ${x + 46},${figTopY + 88} Z`}
        fill={SHADOW}
      />
      <ellipse cx={x} cy={figTopY + 58} rx={24} ry={22} fill={BG} opacity={0.88} />
      <circle cx={x - 9} cy={figTopY + 56} r={3.5} fill={GLOW} opacity={0.45} />
      <circle cx={x + 9} cy={figTopY + 56} r={3.5} fill={GLOW} opacity={0.45} />
      {/* Bras droit AU PREMIER PLAN — monte vers les etoiles en S4
          Ligne vers le HAUT (M0,0 L0,-72) pour que rotate() fonctionne correctement :
          rotate(25)  = bras incline vers la droite (repos, pointe vers bas-droite)
          rotate(-95) = bras pointe vers le haut (zenith) */}
      <g transform={`translate(${x + 42}, ${figTopY + 88}) rotate(${armAngle}, 0, 0)`}>
        <line x1="0" y1="0" x2="0" y2="-72" stroke={SHADOW} strokeWidth="13" strokeLinecap="round" />
        {/* Mains lumineuses a l'extremite */}
        <line x1="0" y1="-72" x2="10" y2="-60" stroke={GLOW} strokeWidth="5" strokeLinecap="round" opacity={0.7 + armRiseS4 * 0.3} />
        <line x1="0" y1="-72" x2="0"  y2="-58" stroke={GLOW} strokeWidth="5" strokeLinecap="round" opacity={0.7 + armRiseS4 * 0.3} />
        <line x1="0" y1="-72" x2="-9" y2="-60" stroke={GLOW} strokeWidth="5" strokeLinecap="round" opacity={0.7 + armRiseS4 * 0.3} />
      </g>
    </g>
  );
};

// ============================================================
// Composant oiseau
// ============================================================

interface BirdProps {
  x: number;
  y: number;
  wingFlap: number;
  flapAmplitude: number;
  opacity: number;
  trailOpacity: number;
  facing?: "right" | "left";
}

const Bird: React.FC<BirdProps> = ({ x, y, wingFlap, flapAmplitude, opacity, trailOpacity, facing = "right" }) => {
  if (opacity < 0.01) return null;
  const flip = facing === "left" ? -1 : 1;
  const wing = Math.sin(wingFlap) * flapAmplitude;
  return (
    <g opacity={opacity}>
      <ellipse cx={x - flip * 70} cy={y} rx={100} ry={20}
        fill="url(#v-bird-glow)" opacity={trailOpacity * 0.35} filter="url(#v-bird-blur)"
      />
      <ellipse cx={x} cy={y} rx={22} ry={12} fill={BIRD_COL} />
      <circle cx={x + flip * 20} cy={y - 4} r={10} fill={BIRD_COL} />
      <path d={`M${x + flip * 28},${y - 4} L${x + flip * 38},${y - 1} L${x + flip * 28},${y + 2} Z`} fill="#ffe066" />
      <circle cx={x + flip * 23} cy={y - 6} r={2.5} fill="#fff" />
      <circle cx={x + flip * 24} cy={y - 6} r={1.2} fill="#000" />
      <path
        d={`M${x - flip * 5},${y - 2} Q${x - flip * 25},${y - 12 - wing} ${x - flip * 40},${y - 6 - wing}`}
        stroke={BIRD_COL} strokeWidth="5" fill="none" strokeLinecap="round"
      />
      <path
        d={`M${x - flip * 5},${y + 2} Q${x - flip * 20},${y + 14 + wing} ${x - flip * 36},${y + 8 + wing}`}
        stroke={BIRD_COL} strokeWidth="5" fill="none" strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={45} fill="url(#v-bird-glow)" opacity={0.55} filter="url(#v-bird-blur)" />
    </g>
  );
};

// ============================================================
// L'Oiseau de la Question
// Phase 1 : traverse tout l'ecran G->D avec grand flash arc-en-ciel
// Phase 2 : vire, revient vers le centre, descend, se pose sur le toit
// ============================================================

const OiseauQuestion: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < CUES.bird_enter) return null;

  const roofTipX = 960;
  const roofTipY = GROUND_Y - 320 - 110;

  const flyY = GROUND_Y - 320 + Math.sin(
    ci(frame, [CUES.bird_enter, CUES.bird_exit_right], [0, Math.PI]) * 0.8
  ) * (-60);

  let bx: number;
  let by: number;
  let facing: "right" | "left";

  if (frame <= CUES.bird_exit_right) {
    bx = ci(frame, [CUES.bird_enter, CUES.bird_exit_right], [-80, W + 60]);
    by = flyY;
    facing = "right";
  } else if (frame <= CUES.bird_slowdown) {
    bx = ci(frame, [CUES.bird_turn, CUES.bird_slowdown], [W - 100, roofTipX + 200]);
    by = ci(frame, [CUES.bird_turn, CUES.bird_slowdown], [GROUND_Y - 300, GROUND_Y - 280]);
    facing = "left";
  } else {
    bx = ci(frame, [CUES.bird_slowdown, CUES.bird_land], [roofTipX + 200, roofTipX]);
    by = ci(frame, [CUES.bird_slowdown, CUES.bird_land], [GROUND_Y - 280, roofTipY + 18]);
    facing = "left";
  }

  const flapSpeed = ci(frame, [CUES.bird_slowdown, CUES.bird_land, CUES.bird_wings_fold], [0.55, 0.2, 0.07]);
  const flapAmp   = ci(frame, [CUES.bird_land, CUES.bird_wings_fold], [14, 2]);
  const wingPhase = frame * flapSpeed;

  const opacity = ci(frame, [CUES.bird_enter, CUES.bird_enter + 15], [0, 1]);
  const trailOp = ci(frame, [CUES.bird_enter, CUES.bird_midscreen, CUES.bird_slowdown, CUES.bird_land], [0.5, 1, 0.5, 0]);

  const tiltAngle = frame > CUES.bird_slowdown
    ? ci(frame, [CUES.bird_slowdown, CUES.bird_land, CUES.bird_wings_fold], [0, -10, 0])
    : 0;

  return (
    <g transform={`rotate(${tiltAngle}, ${bx}, ${by})`}>
      <Bird
        x={bx} y={by}
        wingFlap={wingPhase}
        flapAmplitude={flapAmp}
        opacity={opacity}
        trailOpacity={trailOp}
        facing={facing}
      />
    </g>
  );
};

// ============================================================
// Flash arc-en-ciel sur les batiments au passage de l'oiseau
// ============================================================

const ColorFlashBuildings: React.FC<{ birdX: number; intensity: number }> = ({ birdX, intensity }) => {
  const bxList  = [60,  280, 480,  1310, 1560, 1720];
  const heights = [260, 180, 320,  290,  200,  260];
  const widths  = [110, 90,  120,  130,  100,  110];
  const colors  = ["#ff6b6b", "#ffd700", "#7fff00", "#00cfff", "#ff69b4", "#ff8c00"];

  if (intensity < 0.02) return null;

  return (
    <>
      {bxList.map((bx, i) => {
        const dist  = Math.abs(birdX - bx - widths[i] / 2);
        const local = intensity * Math.max(0, 1 - dist / 520);
        if (local < 0.02) return null;
        return (
          <rect key={i}
            x={bx - 3} y={GROUND_Y - heights[i] - 70}
            width={widths[i] + 6} height={heights[i] + 70}
            fill="none" stroke={colors[i]} strokeWidth={3} opacity={local * 0.9}
          />
        );
      })}
    </>
  );
};

// ============================================================
// Lune / Feu
// ============================================================

const LuneFeu: React.FC<{
  frame: number;
  moonY: number;
  fireMorph: number;
  flicker: number;
}> = ({ frame, moonY, fireMorph, flicker }) => {
  const r = 66 * (1 - fireMorph * 0.25);
  const haloR = 200 * (1 + fireMorph * 0.5);
  const moonColor = `rgb(${Math.round(216 + fireMorph * 39)}, ${Math.round(228 - fireMorph * 100)}, ${Math.round(248 - fireMorph * 160)})`;
  return (
    <>
      <circle cx={960} cy={moonY} r={haloR}
        fill={fireMorph > 0.5 ? "url(#v-fire)" : "url(#v-moon)"}
        opacity={flicker * (0.85 + fireMorph * 0.1)} filter="url(#v-glow-lg)"
      />
      <circle cx={960} cy={moonY} r={r}
        fill={moonColor} opacity={flicker * 0.92} filter="url(#v-glow-md)"
      />
      {fireMorph < 0.8 && (
        <circle cx={988} cy={moonY - 12} r={r * 0.86} fill={BG} opacity={0.65 * (1 - fireMorph)} />
      )}
      {fireMorph > 0.4 && Array.from({ length: 5 }).map((_, i) => {
        const fx = 960 + (i - 2) * 28;
        const fh = 40 + Math.sin(frame * 0.18 + i * 1.1) * 18;
        return (
          <path key={i}
            d={`M${fx - 12},${moonY + r * 0.8} Q${fx},${moonY + r * 0.8 - fh} ${fx + 12},${moonY + r * 0.8}`}
            fill="#ff9933"
            opacity={(fireMorph - 0.4) * 1.6 * (0.7 + Math.sin(frame * 0.22 + i) * 0.2)}
          />
        );
      })}
    </>
  );
};

// ============================================================
// Brouillard
// ============================================================

const Brouillard: React.FC = () => (
  <>
    <ellipse cx={500}  cy={GROUND_Y} rx={620} ry={85} fill={SHADOW} opacity={0.55} filter="url(#v-soft)" />
    <ellipse cx={1420} cy={GROUND_Y} rx={520} ry={65} fill={SHADOW} opacity={0.45} filter="url(#v-soft)" />
  </>
);

// ============================================================
// Composition principale
// ============================================================

export const VeilleurOmbre: React.FC = () => {
  const frame = useCurrentFrame();
  const { s1, s2 } = SCENES;

  // --- Lune ---
  const moonBaseY = 190;
  const moonY = ci(frame, [CUES.moon_descend_start, CUES.moon_becomes_fire], [moonBaseY, GROUND_Y - 30]);
  const moonFlicker = 0.85 + Math.sin(frame * 0.07) * 0.1 + Math.sin(frame * 0.23) * 0.05;
  const moonPulse = frame < s2.startFrame
    ? 0.88 + Math.sin(frame * 0.04) * 0.1
    : moonFlicker;
  const fireMorph = ci(frame, [CUES.moon_becomes_fire - 60, CUES.moon_becomes_fire + 60], [0, 1]);

  // --- Sage ---
  const armRaise = ci(frame, [CUES.arm_raise_start, CUES.arm_raise_end], [0, 1]);
  const armLower = ci(frame, [CUES.bird_enter, CUES.bird_enter + 80], [1, 0]);
  const finalArm = frame >= CUES.bird_enter ? armRaise * armLower : armRaise;
  // Bras remonte lentement pendant la reponse du Sage (S4)
  const armRiseS4 = ci(frame, [CUES.sage_arm_rise_s4, CUES.sage_arm_rise_s4 + 120, CUES.fade_out_start], [0, 1, 1]);

  // --- Etoiles vivaces ---
  const starsVivid = ci(frame,
    [CUES.stars_vivid_start, CUES.stars_vivid_peak, CUES.stars_vivid_end, CUES.fade_out_start],
    [0, 1, 0.6, 0]
  );

  const haloIntensity = ci(frame,
    [CUES.sage_glow_start, CUES.sage_glow_peak, CUES.sage_glow_end, CUES.fade_out_start],
    [0, 1, 1, 0]
  );

  // --- Fenetres ---
  const windowsLit = ci(frame,
    [CUES.windows_light_start, CUES.windows_light_end, CUES.sage_glow_end, CUES.fade_out_start],
    [0, 1, 0.4, 0]
  );

  // --- Flash sur batiments ---
  const birdXForFlash = ci(frame, [CUES.bird_enter, CUES.bird_exit_right], [-80, W + 60]);
  const colorFlash = ci(frame,
    [CUES.bird_enter, CUES.bird_enter + 25, CUES.bird_midscreen, CUES.bird_exit_right - 20, CUES.bird_exit_right],
    [0, 0.7, 1, 0.8, 0]
  );

  // --- Maison du Sage ---
  const houseOpacity = ci(frame, [CUES.house_appear_start, CUES.house_appear_end], [0, 1]);
  const finalHouseOpacity = frame >= CUES.fade_out_start
    ? houseOpacity * ci(frame, [CUES.fade_out_start, CUES.fade_out_end], [1, 0])
    : houseOpacity;

  // --- Horizon pulse ---
  const horizonGlow = ci(frame,
    [CUES.horizon_pulse, CUES.horizon_pulse + 20, CUES.horizon_pulse + 50],
    [0, 1, 0]
  );

  // --- Fondu global ---
  const globalOpacity = frame >= CUES.fade_out_start
    ? ci(frame, [CUES.fade_out_start, CUES.fade_out_end], [1, 0])
    : ci(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ opacity: globalOpacity, position: "absolute", inset: 0 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
          <AllDefs />

          <rect width={W} height={H} fill={BG} />
          <Etoiles frame={frame} vividBoost={starsVivid} />
          <LuneFeu frame={frame} moonY={moonY} fireMorph={fireMorph} flicker={moonPulse} />

          <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#0a0510" />

          <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y}
            stroke={horizonGlow > 0.01 ? "#c8d8ff" : "#1a1028"}
            strokeWidth={horizonGlow > 0.01 ? 3 + horizonGlow * 4 : 2}
            opacity={0.4 + horizonGlow * 0.6}
            filter={horizonGlow > 0.01 ? "url(#v-glow-md)" : undefined}
          />

          <Village windowsLit={windowsLit} />

          {frame <= CUES.bird_exit_right && (
            <ColorFlashBuildings birdX={birdXForFlash} intensity={colorFlash} />
          )}

          <Brouillard />
          <MaisonDuSage opacity={finalHouseOpacity} />
          <Sage armRaise={finalArm} haloIntensity={haloIntensity} armRiseS4={armRiseS4} />
          <OiseauQuestion frame={frame} />

          <rect x={0} y={0} width={W} height={H} fill="none" stroke="#12081e" strokeWidth={4} />
        </svg>
      </div>

      {/* Narration */}
      <Sequence from={s1.startFrame + s1.audioStartFrame} durationInFrames={AUDIO_FRAMES.n1 + 10}>
        <Audio src={staticFile(s1.audioSrc)} />
      </Sequence>
      <Sequence from={s2.startFrame + s2.audioStartFrame} durationInFrames={AUDIO_FRAMES.n2 + 10}>
        <Audio src={staticFile(s2.audioSrc)} />
      </Sequence>
      <Sequence from={CUES.bird_enter + 5} durationInFrames={AUDIO_FRAMES.n3 + 10}>
        <Audio src={staticFile("audio/veilleur-ombre/n3_oiseau.mp3")} />
      </Sequence>
      <Sequence from={N4_START} durationInFrames={AUDIO_FRAMES.n4 + 10}>
        <Audio src={staticFile("audio/veilleur-ombre/n4_sage.mp3")} />
      </Sequence>

      {/* Ambiance nuit — continue tout au long, duck sous n4 */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <Audio src={staticFile("audio/veilleur-ombre/ambiance_nuit.mp3")}
          volume={(f: number) => {
            if (f < CUES.bird_land) return 0.28;
            if (f < N4_START)       return ci(f, [CUES.bird_land, N4_START], [0.28, 0.12]);
            if (f < N4_START + AUDIO_FRAMES.n4) return 0.08;
            return ci(f, [N4_START + AUDIO_FRAMES.n4, CUES.fade_out_start], [0.08, 0.18]);
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

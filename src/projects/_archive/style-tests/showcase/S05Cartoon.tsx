import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

const SKY   = "#87CEEB";
const GRASS = "#4CAF50";
const GRASS_D = "#388E3C";

// Cartoon hero: big head, big eyes, squash/stretch
const CartoonHero: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  eyeOpenness?: number;   // 1 = normal, 1.5 = wide surprise
  mouthSmile?: number;    // 0 = neutral, 1 = big smile
  eyeTarget?: number;     // x offset for pupil direction
  entrySpring: number;
  jumping?: number;       // 0..1
}> = ({ x, y, walkPhase, eyeOpenness = 1, mouthSmile = 0, eyeTarget = 0, entrySpring, jumping = 0 }) => {
  const s = Math.min(entrySpring, 1);

  // Bob & squash-stretch
  const contactFrame = Math.sin(walkPhase * 2) > 0.9;
  const squashX = contactFrame ? 1.12 : 1.0;
  const squashY = contactFrame ? 0.88 : 1.0;
  const bob = Math.abs(Math.sin(walkPhase)) * 6;

  // Jump offset
  const jumpOffset = jumping * -80;

  const hr = 52;         // big head
  const tw = 56; const th = 58;
  const legH = 72;
  const armH = 60;

  const hipY = y - legH + bob + jumpOffset;
  const torsoY = y - th - legH + bob + jumpOffset;
  const headCy = y - th - legH - hr * 1.3 + bob + jumpOffset;

  const legA = Math.sin(walkPhase) * 28;
  const legA2 = Math.sin(walkPhase + Math.PI) * 28;
  const armA = Math.sin(walkPhase + Math.PI) * 32;
  const armA2 = Math.sin(walkPhase) * 32;

  const eyeH = 16 * eyeOpenness;
  const mouthD = mouthSmile;

  return (
    <g transform={`translate(${x}, 0) scale(${s}, ${s}) translate(${-x}, 0)`}>
      {/* Back leg */}
      <g transform={`translate(${x - 14}, ${hipY}) rotate(${legA2}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={10} fill="#e67e22" stroke="#2c1810" strokeWidth="2" />
        <ellipse cx={0} cy={legH} rx={14} ry={8} fill="#2c1810" />
      </g>
      {/* Back arm */}
      <g transform={`translate(${x - tw / 2 + 4}, ${torsoY + 10}) rotate(${armA}, 0, 0)`}>
        <rect x={-9} y={0} width={18} height={armH} rx={9} fill="#f0a030" stroke="#2c1810" strokeWidth="2" />
        <circle cx={0} cy={armH} r={10} fill="#fddbb0" stroke="#2c1810" strokeWidth="1.5" />
      </g>
      {/* Torso with squash-stretch */}
      <g transform={`translate(${x}, ${torsoY + th / 2}) scale(${squashX}, ${squashY}) translate(${-x}, ${-(torsoY + th / 2)})`}>
        <rect x={x - tw / 2} y={torsoY} width={tw} height={th} rx={18} fill="#3498db" stroke="#2c1810" strokeWidth="2.5" />
        {/* Star emblem */}
        <polygon points={`${x},${torsoY + 14} ${x + 6},${torsoY + 24} ${x + 18},${torsoY + 24} ${x + 8},${torsoY + 32} ${x + 12},${torsoY + 44} ${x},${torsoY + 36} ${x - 12},${torsoY + 44} ${x - 8},${torsoY + 32} ${x - 18},${torsoY + 24} ${x - 6},${torsoY + 24}`} fill="#FFD700" stroke="#2c1810" strokeWidth="1" />
      </g>
      {/* Front arm */}
      <g transform={`translate(${x + tw / 2 - 4}, ${torsoY + 10}) rotate(${armA2}, 0, 0)`}>
        <rect x={-9} y={0} width={18} height={armH} rx={9} fill="#f0a030" stroke="#2c1810" strokeWidth="2" />
        <circle cx={0} cy={armH} r={10} fill="#fddbb0" stroke="#2c1810" strokeWidth="1.5" />
      </g>
      {/* Front leg */}
      <g transform={`translate(${x + 14}, ${hipY}) rotate(${legA}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={10} fill="#e67e22" stroke="#2c1810" strokeWidth="2" />
        <ellipse cx={0} cy={legH} rx={14} ry={8} fill="#2c1810" />
      </g>
      {/* Big head — squash/stretch */}
      <g transform={`translate(${x}, ${headCy}) scale(${squashX * 0.5 + 0.5}, ${squashY * 0.5 + 0.5}) translate(${-x}, ${-headCy})`}>
        <circle cx={x} cy={headCy} r={hr} fill="#fddbb0" stroke="#2c1810" strokeWidth="2.5" />
        {/* Hair */}
        {[-24, -12, 0, 12, 24].map((hx, i) => (
          <path
            key={i}
            d={`M${x + hx},${headCy - hr + 4} Q${x + hx + (i - 2) * 2},${headCy - hr - 18} ${x + hx + (i - 2) * 3},${headCy - hr - 8}`}
            stroke="#2c1810"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {/* Big eyes */}
        <ellipse cx={x - 18} cy={headCy - 4} rx={14} ry={eyeH} fill="white" stroke="#2c1810" strokeWidth="2" />
        <ellipse cx={x + 18} cy={headCy - 4} rx={14} ry={eyeH} fill="white" stroke="#2c1810" strokeWidth="2" />
        {/* Pupils track toward target */}
        <circle cx={x - 18 + eyeTarget * 5} cy={headCy - 3} r={7} fill="#2c1810" />
        <circle cx={x + 18 + eyeTarget * 5} cy={headCy - 3} r={7} fill="#2c1810" />
        {/* Eye shine */}
        <circle cx={x - 14 + eyeTarget * 5} cy={headCy - 6} r={2.5} fill="white" />
        <circle cx={x + 22 + eyeTarget * 5} cy={headCy - 6} r={2.5} fill="white" />
        {/* Mouth: neutral -> big smile */}
        <path
          d={`M${x - 18},${headCy + 18} Q${x},${headCy + 28 + mouthD * 24} ${x + 18},${headCy + 18}`}
          stroke="#2c1810"
          strokeWidth="2.5"
          fill={mouthD > 0.3 ? "#e74c3c" : "none"}
          strokeLinecap="round"
        />
        {/* Blush dots */}
        <circle cx={x - 32} cy={headCy + 10} r={9} fill="#ff8a80" opacity={0.35} />
        <circle cx={x + 32} cy={headCy + 10} r={9} fill="#ff8a80" opacity={0.35} />
      </g>
    </g>
  );
};

// Cartoon villain: sharp features, angry eyebrows
const CartoonVillain: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  eyeTarget?: number;
  entrySpring: number;
  recoilY?: number;    // 0..1 jump surprise
}> = ({ x, y, walkPhase, eyeTarget = 0, entrySpring, recoilY = 0 }) => {
  const s = Math.min(entrySpring, 1);
  const bob = Math.abs(Math.sin(walkPhase)) * 5;
  const jumpOffset = recoilY * -60;

  const hr = 42;
  const tw = 52; const th = 62;
  const legH = 68;
  const armH = 58;

  const hipY = y - legH + bob + jumpOffset;
  const torsoY = y - th - legH + bob + jumpOffset;
  const headCy = y - th - legH - hr * 1.3 + bob + jumpOffset;

  const legA = Math.sin(walkPhase + 0.3) * 26;
  const legA2 = Math.sin(walkPhase + 0.3 + Math.PI) * 26;
  const armA = Math.sin(walkPhase + 0.3 + Math.PI) * 28;
  const armA2 = Math.sin(walkPhase + 0.3) * 28;

  return (
    <g transform={`translate(${x}, 0) scale(${s}, ${s}) translate(${-x}, 0)`}>
      {/* Back leg */}
      <g transform={`translate(${x - 13}, ${hipY}) rotate(${legA2}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={10} fill="#7f1d1d" stroke="#1a0a0a" strokeWidth="2" />
        <ellipse cx={0} cy={legH} rx={13} ry={8} fill="#1a0a0a" />
      </g>
      {/* Back arm */}
      <g transform={`translate(${x - tw / 2 + 4}, ${torsoY + 10}) rotate(${armA}, 0, 0)`}>
        <rect x={-8} y={0} width={16} height={armH} rx={8} fill="#991b1b" stroke="#1a0a0a" strokeWidth="2" />
        <circle cx={0} cy={armH} r={9} fill="#d0a0a0" stroke="#1a0a0a" strokeWidth="1.5" />
      </g>
      {/* Torso */}
      <rect x={x - tw / 2} y={torsoY} width={tw} height={th} rx={10} fill="#7f1d1d" stroke="#1a0a0a" strokeWidth="2.5" />
      {/* Cape */}
      <path
        d={`M${x - tw / 2},${torsoY + 8} Q${x - tw / 2 - 30},${hipY + 20} ${x - 10},${hipY + 30} Q${x + 10},${hipY + 30} ${x + tw / 2 + 30},${hipY + 20} Q${x + tw / 2},${torsoY + 8} ${x + tw / 2},${torsoY + 8}`}
        fill="#1a0a0a"
        opacity="0.88"
      />
      {/* Front arm */}
      <g transform={`translate(${x + tw / 2 - 4}, ${torsoY + 10}) rotate(${armA2}, 0, 0)`}>
        <rect x={-8} y={0} width={16} height={armH} rx={8} fill="#991b1b" stroke="#1a0a0a" strokeWidth="2" />
        <circle cx={0} cy={armH} r={9} fill="#d0a0a0" stroke="#1a0a0a" strokeWidth="1.5" />
      </g>
      {/* Front leg */}
      <g transform={`translate(${x + 13}, ${hipY}) rotate(${legA}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={10} fill="#7f1d1d" stroke="#1a0a0a" strokeWidth="2" />
        <ellipse cx={0} cy={legH} rx={13} ry={8} fill="#1a0a0a" />
      </g>
      {/* Head */}
      <g transform={`translate(${x}, ${headCy})`}>
        <circle cx={0} cy={0} r={hr} fill="#d0a0a0" stroke="#1a0a0a" strokeWidth="2.5" />
        {/* Dark slicked hair */}
        <ellipse cx={0} cy={-hr + 8} rx={hr + 2} ry={22} fill="#1a0a0a" />
        {/* Angled menacing eyebrows */}
        <line x1={-hr * 0.7} y1={-hr * 0.2} x2={-4} y2={-hr * 0.05} stroke="#1a0a0a" strokeWidth={4} strokeLinecap="round" />
        <line x1={4} y1={-hr * 0.05} x2={hr * 0.7} y2={-hr * 0.2} stroke="#1a0a0a" strokeWidth={4} strokeLinecap="round" />
        {/* Eyes */}
        <circle cx={-15 + eyeTarget * 4} cy={-4} r={7} fill="#7f1d1d" stroke="#1a0a0a" strokeWidth="2" />
        <circle cx={15 + eyeTarget * 4} cy={-4} r={7} fill="#7f1d1d" stroke="#1a0a0a" strokeWidth="2" />
        <circle cx={-13 + eyeTarget * 4} cy={-5} r={2.5} fill="white" />
        <circle cx={17 + eyeTarget * 4} cy={-5} r={2.5} fill="white" />
        {/* Pointed mustache */}
        <path d="M-16,14 Q-8,20 0,14 Q8,20 16,14" stroke="#1a0a0a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Pointy chin */}
        <path d={`M${-hr * 0.4},${hr * 0.72} Q0,${hr + 14} ${hr * 0.4},${hr * 0.72}`} fill="#d0a0a0" stroke="#1a0a0a" strokeWidth="1.5" />
      </g>
    </g>
  );
};

export const S05Cartoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Hero enters from left
  const heroEntry = spring({ frame: frame - 15, fps, config: { damping: 8, stiffness: 160 }, durationInFrames: 35 });
  const heroX = interpolate(frame, [15, 80], [150, 620], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalHeroX = frame >= 80 ? 620 : heroX;

  // Villain enters from right
  const villainEntry = spring({ frame: frame - 28, fps, config: { damping: 8, stiffness: 160 }, durationInFrames: 35 });
  const villainX = interpolate(frame, [28, 90], [W - 150, 1130], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalVillainX = frame >= 90 ? 1130 : villainX;

  const heroPhase = frame * 0.18;
  const villainPhase = frame * 0.16 + 1.1;

  // At f140: mutual "take" reaction — eyes wide, both jump
  const takeTrigger = interpolate(frame, [135, 155], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const takeSettle = interpolate(frame, [175, 200], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const takeAmount = frame >= 175 ? takeTrigger * takeSettle : takeTrigger;

  // After take: hero smiles, villain reacts
  const heroSmile = interpolate(frame, [195, 220], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Eye tracking toward each other
  const heroEyeDir = frame >= 80 ? 1 : 0;
  const villainEyeDir = frame >= 90 ? -1 : 0;

  // Exclamation marks during take
  const exclOpacity = interpolate(frame, [135, 155, 195, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="s05-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#B0E2FF" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={W} height={H} fill="url(#s05-sky)" />

        {/* Fluffy clouds */}
        {[[300, 120], [800, 80], [1400, 140], [1750, 100]].map(([cx, cy], i) => (
          <g key={i} opacity={0.9}>
            <ellipse cx={cx} cy={cy} rx={90} ry={40} fill="white" />
            <ellipse cx={cx - 50} cy={cy + 10} rx={60} ry={32} fill="white" />
            <ellipse cx={cx + 50} cy={cy + 10} rx={60} ry={32} fill="white" />
          </g>
        ))}

        {/* Ground */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill={GRASS} />
        <rect x={0} y={GROUND_Y} width={W} height={22} fill={GRASS_D} />

        {/* Cartoon flowers */}
        {[200, 500, 900, 1300, 1700].map((fx, i) => (
          <g key={i} transform={`translate(${fx}, ${GROUND_Y - 10})`}>
            <line x1="0" y1="0" x2="0" y2="-28" stroke={GRASS_D} strokeWidth="2.5" />
            <circle cx="0" cy="-34" r="8" fill={i % 2 === 0 ? "#FFD700" : "#FF69B4"} />
            <circle cx="0" cy="-34" r="4" fill="#FF8C00" />
          </g>
        ))}

        {/* Villain */}
        <CartoonVillain
          x={finalVillainX}
          y={GROUND_Y}
          walkPhase={frame < 90 ? villainPhase : 0}
          eyeTarget={villainEyeDir}
          entrySpring={Math.min(villainEntry, 1)}
          recoilY={takeAmount}
        />

        {/* Hero */}
        <CartoonHero
          x={finalHeroX}
          y={GROUND_Y}
          walkPhase={frame < 80 ? heroPhase : 0}
          eyeOpenness={1 + takeAmount * 0.6}
          mouthSmile={heroSmile}
          eyeTarget={heroEyeDir}
          entrySpring={Math.min(heroEntry, 1)}
          jumping={takeAmount}
        />

        {/* Exclamation marks */}
        {exclOpacity > 0 && (
          <>
            {[finalHeroX - 10, finalVillainX + 10].map((ex, i) => (
              <g key={i} opacity={exclOpacity * (1 + Math.sin(frame * 0.5) * 0.15)}>
                <text x={ex} y={GROUND_Y - 350} textAnchor="middle" fontSize={80} fontFamily="Impact, sans-serif" fill={i === 0 ? "#FFD700" : "#FF4444"} stroke="#1a0a0a" strokeWidth="3">!</text>
              </g>
            ))}
          </>
        )}

        <CharLabel x={finalHeroX} y={GROUND_Y + 52} name="Le Heros" fill="#1a0a0a" />
        <CharLabel x={finalVillainX} y={GROUND_Y + 52} name="Le Mechant" fill="#1a0a0a" />
      </svg>

      <StyleTitle
        frame={frame}
        number="05"
        title="SVG Cartoon Expressif"
        subtitle="Grands yeux, squash-stretch, expressions exagerees"
        textColor="#1a0a0a"
        bgColor="rgba(135,206,235,0.88)"
      />
    </div>
  );
};

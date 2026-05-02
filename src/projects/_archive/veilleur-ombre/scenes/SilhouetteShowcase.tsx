import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

const W = 1920;
const H = 1080;
const GROUND_Y = H * 0.75;
const BG    = "#050208";
const DARK  = "#0a0610";
const GLOW  = "#c8d0e8";

function ci(frame: number, range: number[], output: number[]): number {
  return interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Duree de chaque scene en frames (30fps)
const S = 240; // 8s par scene
const SCENE_STARTS = [0, S, S*2, S*3, S*4];

// ============================================================
// Defs communes
// ============================================================

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="sc-glow-warm" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#ff9933" stopOpacity="0.95" />
      <stop offset="100%" stopColor="#ff9933" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sc-glow-cool" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#33aaff" stopOpacity="0.95" />
      <stop offset="100%" stopColor="#33aaff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sc-glow-white" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#c8d0e8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sc-glow-green" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#44ff88" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#44ff88" stopOpacity="0" />
    </radialGradient>
    <filter id="sc-blur-sm" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="sc-blur-md" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="sc-blur-lg" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="32" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="sc-halo" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="28" />
    </filter>
  </defs>
);

// Silhouette generique (capuchon)
const Sil: React.FC<{
  x: number; y: number; h?: number;
  eyeColor?: string; eyeGlow?: number;
  opacity?: number;
}> = ({ x, y, h = 120, eyeColor = GLOW, eyeGlow = 0, opacity = 1 }) => {
  const w = h * 0.28;
  const headR = h * 0.14;
  const torsoH = h * 0.35;
  const robe = h * 0.5;

  return (
    <g opacity={opacity}>
      {eyeGlow > 0.01 && (
        <circle cx={x} cy={y - h + headR + 10} r={headR * 4}
          fill="url(#sc-glow-white)" opacity={eyeGlow * 0.55} filter="url(#sc-halo)"
        />
      )}
      {/* Robe */}
      <path
        d={`M${x - w},${y - robe} Q${x - w*1.4},${y - 10} ${x - w*0.6},${y} L${x + w*0.6},${y} Q${x + w*1.4},${y - 10} ${x + w},${y - robe} Z`}
        fill={DARK}
      />
      {/* Torse */}
      <rect x={x - w} y={y - robe - torsoH} width={w*2} height={torsoH + 10} rx={3} fill={DARK} />
      {/* Capuchon */}
      <path
        d={`M${x - w*1.1},${y - robe - torsoH + 10} Q${x - w*1.2},${y - h + headR*2} ${x},${y - h} Q${x + w*1.2},${y - h + headR*2} ${x + w*1.1},${y - robe - torsoH + 10} Z`}
        fill={DARK}
      />
      {/* Visage */}
      <ellipse cx={x} cy={y - h + headR * 2.2} rx={headR * 0.8} ry={headR * 0.75} fill={BG} opacity={0.88} />
      {/* Yeux */}
      <circle cx={x - headR*0.35} cy={y - h + headR*2.0} r={headR * 0.22} fill={eyeColor} opacity={0.45 + eyeGlow * 0.55} />
      <circle cx={x + headR*0.35} cy={y - h + headR*2.0} r={headR * 0.22} fill={eyeColor} opacity={0.45 + eyeGlow * 0.55} />
    </g>
  );
};

// ============================================================
// SCENE 1 — Foule + un different
// ============================================================

const Scene1Foule: React.FC<{ lf: number }> = ({ lf }) => {
  // 19 silhouettes grises en fond, 1 au centre avec yeux lumineux
  const crowd: { x: number; y: number; h: number; delay: number }[] = [];

  // Rangee arriere (8 persos)
  for (let i = 0; i < 8; i++) {
    crowd.push({ x: 200 + i * 215, y: GROUND_Y - 10, h: 95, delay: i * 8 });
  }
  // Rangee avant (8 persos, decales)
  for (let i = 0; i < 8; i++) {
    crowd.push({ x: 305 + i * 210, y: GROUND_Y + 15, h: 105, delay: 4 + i * 8 });
  }

  // Apparition progressive
  const appear = ci(lf, [0, 60], [0, 1]);

  return (
    <g>
      {/* Sol */}
      <rect x={0} y={GROUND_Y - 5} width={W} height={H - GROUND_Y + 5} fill="#080414" />

      {/* Brouillard bas */}
      <ellipse cx={960} cy={GROUND_Y + 30} rx={900} ry={80} fill="#0d0820" opacity={0.7} filter="url(#sc-blur-sm)" />

      {/* Foule — silhouettes grises */}
      {crowd.map((c, i) => {
        const op = ci(lf, [c.delay, c.delay + 25], [0, 1]) * appear;
        return (
          <Sil key={i} x={c.x} y={c.y} h={c.h}
            eyeColor="#444466" eyeGlow={0}
            opacity={op * 0.55}
          />
        );
      })}

      {/* Le different — centre, plus grand, yeux qui s'allument */}
      <Sil x={960} y={GROUND_Y + 15} h={130}
        eyeColor="#c8d0e8"
        eyeGlow={ci(lf, [80, 160], [0, 1]) * appear}
        opacity={appear}
      />

      {/* Halo autour du different */}
      {ci(lf, [80, 160], [0, 1]) > 0.1 && (
        <circle cx={960} cy={GROUND_Y - 95} r={180}
          fill="url(#sc-glow-white)"
          opacity={ci(lf, [80, 200], [0, 0.4]) * appear}
          filter="url(#sc-halo)"
        />
      )}

      {/* Titre flottant */}
      <text x={960} y={120} textAnchor="middle" fill={GLOW}
        fontSize={38} fontFamily="Georgia, serif" letterSpacing={6}
        opacity={ci(lf, [160, 200, 210, 240], [0, 0.7, 0.7, 0])}
      >
        L&apos;UN PARMI TOUS
      </text>
    </g>
  );
};

// ============================================================
// SCENE 2 — Transformation graine -> arbre
// ============================================================

const Scene2Transformation: React.FC<{ lf: number }> = ({ lf }) => {
  const progress = ci(lf, [20, 200], [0, 1]);
  const groundY = GROUND_Y + 20;

  // Graine : petit ellipse au sol
  const seedR = ci(progress, [0, 0.1, 0.25], [12, 18, 0]);

  // Tronc : pousse vers le haut
  const trunkH = ci(progress, [0.15, 0.9], [0, 280]);
  const trunkW = ci(progress, [0.15, 0.9], [4, 18]);

  // Branches (3 niveaux)
  const b1 = ci(progress, [0.35, 0.7], [0, 1]);
  const b2 = ci(progress, [0.5, 0.8], [0, 1]);
  const b3 = ci(progress, [0.65, 0.95], [0, 1]);

  // Lueur verte qui monte avec l'arbre
  const glowY = groundY - trunkH * 0.6;
  const glowR = ci(progress, [0.15, 1.0], [20, 160]);

  return (
    <g>
      <rect x={0} y={groundY} width={W} height={H - groundY} fill="#080414" />
      <ellipse cx={960} cy={groundY + 20} rx={700} ry={60} fill="#0d0820" opacity={0.6} filter="url(#sc-blur-sm)" />

      {/* Lueur verte */}
      {progress > 0.15 && (
        <circle cx={960} cy={glowY} r={glowR}
          fill="url(#sc-glow-green)" opacity={progress * 0.55} filter="url(#sc-halo)"
        />
      )}

      {/* Graine */}
      {seedR > 0.5 && (
        <ellipse cx={960} cy={groundY - seedR * 0.5} rx={seedR * 1.4} ry={seedR}
          fill={DARK} opacity={1 - progress * 3}
        />
      )}

      {/* Tronc */}
      {trunkH > 1 && (
        <rect x={960 - trunkW / 2} y={groundY - trunkH} width={trunkW} height={trunkH}
          fill={DARK} rx={trunkW * 0.3}
        />
      )}

      {/* Branches niveau 1 */}
      {b1 > 0.01 && (
        <g>
          <line x1={960} y1={groundY - trunkH * 0.45}
            x2={960 - 110 * b1} y2={groundY - trunkH * 0.45 - 70 * b1}
            stroke={DARK} strokeWidth={10} strokeLinecap="round"
          />
          <line x1={960} y1={groundY - trunkH * 0.45}
            x2={960 + 95 * b1} y2={groundY - trunkH * 0.45 - 55 * b1}
            stroke={DARK} strokeWidth={10} strokeLinecap="round"
          />
        </g>
      )}

      {/* Branches niveau 2 */}
      {b2 > 0.01 && (
        <g>
          <line x1={960} y1={groundY - trunkH * 0.68}
            x2={960 - 130 * b2} y2={groundY - trunkH * 0.68 - 85 * b2}
            stroke={DARK} strokeWidth={7} strokeLinecap="round"
          />
          <line x1={960} y1={groundY - trunkH * 0.68}
            x2={960 + 115 * b2} y2={groundY - trunkH * 0.68 - 75 * b2}
            stroke={DARK} strokeWidth={7} strokeLinecap="round"
          />
        </g>
      )}

      {/* Branches niveau 3 — couronne */}
      {b3 > 0.01 && (
        <g>
          <line x1={960} y1={groundY - trunkH * 0.88}
            x2={960 - 80 * b3} y2={groundY - trunkH * 0.88 - 60 * b3}
            stroke={DARK} strokeWidth={5} strokeLinecap="round"
          />
          <line x1={960} y1={groundY - trunkH * 0.88}
            x2={960 + 70 * b3} y2={groundY - trunkH * 0.88 - 50 * b3}
            stroke={DARK} strokeWidth={5} strokeLinecap="round"
          />
          <line x1={960} y1={groundY - trunkH * 0.88}
            x2={960} y2={groundY - trunkH - 40 * b3}
            stroke={DARK} strokeWidth={5} strokeLinecap="round"
          />
        </g>
      )}

      {/* Particules de lumiere qui montent */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const pProgress = ci(lf, [20 + i * 8, 180 + i * 3], [0, 1]);
        const px = 960 + Math.cos(angle) * 40 * pProgress;
        const py = groundY - trunkH * 0.3 * pProgress - 30 * pProgress;
        const pop = ci(pProgress, [0, 0.3, 0.8, 1], [0, 0.8, 0.6, 0]);
        return <circle key={i} cx={px} cy={py} r={3 + i % 3} fill="#44ff88" opacity={pop * 0.7} />;
      })}

      <text x={960} y={120} textAnchor="middle" fill="#44ff88"
        fontSize={38} fontFamily="Georgia, serif" letterSpacing={6}
        opacity={ci(lf, [160, 200, 210, 240], [0, 0.6, 0.6, 0])}
      >
        LA GRAINE ET L&apos;ARBRE
      </text>
    </g>
  );
};

// ============================================================
// SCENE 3 — Dialogue : lumiere qui alterne
// ============================================================

const Scene3Dialogue: React.FC<{ lf: number }> = ({ lf }) => {
  // Alternance lumiere : gauche (chaud) -> droite (froid) -> gauche -> droite
  const phases = [
    [0,   50,  "#ff9933", "url(#sc-glow-warm)"],
    [60,  110, "#33aaff", "url(#sc-glow-cool)"],
    [120, 170, "#ff9933", "url(#sc-glow-warm)"],
    [180, 230, "#33aaff", "url(#sc-glow-cool)"],
  ];

  const leftGlow  = ci(lf, [0, 40, 50, 110, 120, 160, 170, 240], [0, 1, 1, 0, 0, 1, 1, 0.3]);
  const rightGlow = ci(lf, [0, 40, 60, 100, 110, 180, 200, 240], [0, 0, 0, 1, 1, 0, 1, 1]);

  const leftEye  = "#ff9933";
  const rightEye = "#33aaff";
  const gY = GROUND_Y + 20;

  return (
    <g>
      <rect x={0} y={gY} width={W} height={H - gY} fill="#080414" />

      {/* Halos des deux personnages */}
      <circle cx={580} cy={gY - 160} r={220}
        fill="url(#sc-glow-warm)" opacity={leftGlow * 0.45} filter="url(#sc-halo)"
      />
      <circle cx={1340} cy={gY - 160} r={220}
        fill="url(#sc-glow-cool)" opacity={rightGlow * 0.45} filter="url(#sc-halo)"
      />

      {/* Ligne de sol lumineuse entre eux */}
      <line x1={580} y1={gY} x2={1340} y2={gY}
        stroke={GLOW} strokeWidth={1.5} opacity={0.12}
      />

      {/* Personnage gauche — manteau chaud */}
      <Sil x={580} y={gY} h={165}
        eyeColor={leftEye} eyeGlow={leftGlow}
        opacity={1}
      />

      {/* Personnage droit — capuchon froid, retourne */}
      <g transform={`scale(-1,1) translate(${-1340*2}, 0)`}>
        <Sil x={1340} y={gY} h={155}
          eyeColor={rightEye} eyeGlow={rightGlow}
          opacity={1}
        />
      </g>

      {/* Particule de parole qui traverse */}
      {phases.map(([start, end, color], idx) => {
        const t = ci(lf, [start as number, end as number], [0, 1]);
        if (t <= 0 || t >= 1) return null;
        const isLeft = idx % 2 === 0;
        const px = isLeft ? 580 + (1340 - 580) * t : 1340 - (1340 - 580) * t;
        const py = gY - 180 - Math.sin(t * Math.PI) * 60;
        return (
          <g key={idx}>
            <circle cx={px} cy={py} r={8} fill={color as string} opacity={0.9} filter="url(#sc-blur-sm)" />
            <circle cx={px} cy={py} r={24} fill={color as string} opacity={0.3} filter="url(#sc-blur-sm)" />
          </g>
        );
      })}

      <text x={960} y={120} textAnchor="middle" fill={GLOW}
        fontSize={38} fontFamily="Georgia, serif" letterSpacing={6}
        opacity={ci(lf, [160, 200, 210, 240], [0, 0.6, 0.6, 0])}
      >
        LE DIALOGUE
      </text>
    </g>
  );
};

// ============================================================
// SCENE 4 — Cartographie : chemin lumineux
// ============================================================

const Scene4Carte: React.FC<{ lf: number }> = ({ lf }) => {
  // Points de la "carte" (villes)
  const cities = [
    { x: 280,  y: 500, name: "A" },
    { x: 550,  y: 380, name: "B" },
    { x: 780,  y: 580, name: "C" },
    { x: 960,  y: 320, name: "D" },
    { x: 1180, y: 520, name: "E" },
    { x: 1400, y: 400, name: "F" },
    { x: 1640, y: 560, name: "G" },
    // Villes secondaires
    { x: 420,  y: 700, name: "" },
    { x: 700,  y: 240, name: "" },
    { x: 1060, y: 680, name: "" },
    { x: 1280, y: 260, name: "" },
    { x: 1520, y: 700, name: "" },
  ];

  // Chemin principal : A->B->C->D->E->F->G
  const path = cities.slice(0, 7);
  const totalSegs = path.length - 1;
  const pathProgress = ci(lf, [20, 210], [0, totalSegs]);

  // Voyageur (silhouette miniature) qui suit le chemin
  const segIdx = Math.min(Math.floor(pathProgress), totalSegs - 1);
  const segT = pathProgress - segIdx;
  const travX = path[segIdx].x + (path[segIdx + 1]?.x - path[segIdx].x) * segT;
  const travY = path[segIdx].y + (path[segIdx + 1]?.y - path[segIdx].y) * segT;

  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={BG} />

      {/* Grille subtile de la carte */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={100 + i * 80} x2={W} y2={100 + i * 80}
          stroke={GLOW} strokeWidth={0.4} opacity={0.06}
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v${i}`} x1={100 + i * 95} y1={0} x2={100 + i * 95} y2={H}
          stroke={GLOW} strokeWidth={0.4} opacity={0.06}
        />
      ))}

      {/* Connexions grises entre toutes les villes */}
      {cities.map((c, i) =>
        cities.slice(i + 1).map((c2, j) => {
          const dist = Math.hypot(c2.x - c.x, c2.y - c.y);
          if (dist > 420) return null;
          return (
            <line key={`${i}-${j}`} x1={c.x} y1={c.y} x2={c2.x} y2={c2.y}
              stroke={GLOW} strokeWidth={0.8} opacity={0.08}
            />
          );
        })
      )}

      {/* Chemin parcouru en lumineux */}
      {path.slice(0, Math.floor(pathProgress) + 1).map((p, i) => {
        if (i >= path.length - 1) return null;
        const next = path[i + 1];
        const segDone = Math.min(1, pathProgress - i);
        if (segDone <= 0) return null;
        const ex = p.x + (next.x - p.x) * segDone;
        const ey = p.y + (next.y - p.y) * segDone;
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={ex} y2={ey}
              stroke="#ff9933" strokeWidth={3} opacity={0.9}
              filter="url(#sc-blur-md)"
            />
            <line x1={p.x} y1={p.y} x2={ex} y2={ey}
              stroke="#ffe066" strokeWidth={1.5} opacity={0.95}
            />
          </g>
        );
      })}

      {/* Villes */}
      {cities.map((c, i) => {
        const isOnPath = i < 7;
        const isReached = isOnPath && pathProgress >= i;
        return (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={isReached ? 10 : 6}
              fill={isReached ? "#ff9933" : DARK}
              stroke={GLOW} strokeWidth={isReached ? 2 : 1}
              opacity={isReached ? 0.95 : 0.4}
              filter={isReached ? "url(#sc-blur-md)" : undefined}
            />
            {c.name && isReached && (
              <text x={c.x} y={c.y - 18} textAnchor="middle" fill={GLOW}
                fontSize={22} fontFamily="Georgia, serif" opacity={0.7}
              >
                {c.name}
              </text>
            )}
          </g>
        );
      })}

      {/* Voyageur */}
      {pathProgress > 0 && (
        <g>
          <circle cx={travX} cy={travY} r={40}
            fill="url(#sc-glow-warm)" opacity={0.55} filter="url(#sc-halo)"
          />
          <Sil x={travX} y={travY + 22} h={50}
            eyeColor="#ff9933" eyeGlow={0.8}
            opacity={0.95}
          />
        </g>
      )}

      <text x={960} y={960} textAnchor="middle" fill="#ff9933"
        fontSize={38} fontFamily="Georgia, serif" letterSpacing={6}
        opacity={ci(lf, [160, 200, 210, 240], [0, 0.6, 0.6, 0])}
      >
        LE VOYAGE
      </text>
    </g>
  );
};

// ============================================================
// SCENE 5 — Le Veilleur (extrait)
// ============================================================

const Scene5Veilleur: React.FC<{ lf: number }> = ({ lf }) => {
  const appear = ci(lf, [0, 30], [0, 1]);
  const gY = GROUND_Y;

  // Etoiles
  const stars = Array.from({ length: 50 }).map((_, i) => {
    const seed = i * 7331;
    const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
    const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % 420;
    const twinkle = 0.4 + Math.sin(lf * 0.06 + i * 0.8) * 0.3;
    const vivid = ci(lf, [140, 200], [0, 1]);
    const op = twinkle + (0.9 - twinkle) * vivid;
    const r = (i % 4) * 0.6 + 0.6 + vivid * (i % 3) * 0.6;
    return { sx, sy, op, r };
  });

  // Lune
  const moonY = ci(lf, [0, 200], [140, 200]);

  // Bras du Sage
  const armRise = ci(lf, [80, 200], [0, 1]);
  const armAngle = ci(armRise, [0, 1], [115, 20]);

  // Maison
  const houseOp = ci(lf, [20, 80], [0, 1]);

  // Oiseau pose
  const birdOp = ci(lf, [10, 40], [0, 1]);

  const figH = 220;
  const figTopY = gY - figH;
  const roofTipY = gY - 230 - 80;

  return (
    <g opacity={appear}>
      <rect width={W} height={H} fill={BG} />

      {/* Etoiles */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.sx} cy={s.sy} r={s.r} fill={GLOW} opacity={s.op} />
      ))}

      {/* Lune */}
      <circle cx={960} cy={moonY} r={180}
        fill="url(#sc-glow-white)" opacity={0.75} filter="url(#sc-blur-lg)"
      />
      <circle cx={960} cy={moonY} r={58} fill="#dde8ff" opacity={0.9} filter="url(#sc-blur-md)" />
      <circle cx={985} cy={moonY - 10} r={50} fill={BG} opacity={0.65} />

      {/* Sol */}
      <rect x={0} y={gY} width={W} height={H - gY} fill="#0a0510" />
      <line x1={0} y1={gY} x2={W} y2={gY} stroke={GLOW} strokeWidth={1.5} opacity={0.15} />

      {/* Village fond */}
      {[
        { x: 80,   h: 200, w: 90  },
        { x: 300,  h: 150, w: 80  },
        { x: 500,  h: 260, w: 100 },
        { x: 1320, h: 240, w: 110 },
        { x: 1560, h: 170, w: 90  },
        { x: 1720, h: 210, w: 95  },
      ].map((b, i) => (
        <g key={i} opacity={0.75}>
          <rect x={b.x} y={gY - b.h} width={b.w} height={b.h} fill={DARK} />
          <polygon
            points={`${b.x},${gY - b.h} ${b.x + b.w/2},${gY - b.h - 50} ${b.x + b.w},${gY - b.h}`}
            fill={DARK}
          />
        </g>
      ))}

      {/* Maison du Sage */}
      <g opacity={houseOp}>
        <rect x={960 - 170} y={gY - 230} width={340} height={230} fill={DARK} />
        <polygon
          points={`${960 - 190},${gY - 230} ${960},${gY - 230 - 80} ${960 + 190},${gY - 230}`}
          fill={DARK}
        />
        <rect x={960 - 18} y={gY - 230 + 40} width={36} height={42} rx={2}
          fill="#f5c830" opacity={0.85} filter="url(#sc-blur-md)"
        />
        <circle cx={960} cy={gY - 230 + 80} r={80}
          fill="url(#sc-glow-warm)" opacity={houseOp * 0.25} filter="url(#sc-halo)"
        />
      </g>

      {/* Halo Sage */}
      <circle cx={960} cy={figTopY + 60} r={190}
        fill="url(#sc-glow-white)"
        opacity={ci(lf, [80, 180], [0, 0.65])}
        filter="url(#sc-halo)"
      />

      {/* Sage */}
      <g>
        <path
          d={`M${960 - 38},${figTopY + 60} Q${960 - 46},${gY - 30} ${960 - 24},${gY} L${960 + 24},${gY} Q${960 + 46},${gY - 30} ${960 + 38},${figTopY + 60} Z`}
          fill={DARK}
        />
        <rect x={960 - 33} y={figTopY + 46} width={66} height={85} rx={4} fill={DARK} />
        <path
          d={`M${960 - 36},${figTopY + 64} Q${960 - 40},${figTopY + 16} ${960},${figTopY} Q${960 + 40},${figTopY + 16} ${960 + 36},${figTopY + 64} Z`}
          fill={DARK}
        />
        <ellipse cx={960} cy={figTopY + 41} rx={19} ry={17} fill={BG} opacity={0.88} />
        <circle cx={960 - 7} cy={figTopY + 39} r={2.8} fill={GLOW} opacity={0.6} />
        <circle cx={960 + 7} cy={figTopY + 39} r={2.8} fill={GLOW} opacity={0.6} />
        {/* Bras leve */}
        <g transform={`translate(${960 + 33}, ${figTopY + 64}) rotate(${armAngle}, 0, 0)`}>
          <line x1="0" y1="0" x2="0" y2="-58" stroke={DARK} strokeWidth={10} strokeLinecap="round" />
          <line x1="0" y1="-58" x2="8"  y2="-47" stroke={GLOW} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
          <line x1="0" y1="-58" x2="0"  y2="-45" stroke={GLOW} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
          <line x1="0" y1="-58" x2="-7" y2="-47" stroke={GLOW} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </g>
      </g>

      {/* Oiseau pose sur le toit */}
      <g opacity={birdOp}>
        <circle cx={960} cy={roofTipY + 14} r={36}
          fill="url(#sc-glow-cool)" opacity={0.7} filter="url(#sc-halo)"
        />
        <ellipse cx={960} cy={roofTipY + 14} rx={16} ry={9} fill="#1a8fff" />
        <circle cx={975} cy={roofTipY + 10} r={7.5} fill="#1a8fff" />
        <path d={`M983,${roofTipY + 10} L991,${roofTipY + 12} L983,${roofTipY + 14} Z`} fill="#ffe066" />
        <circle cx={977} cy={roofTipY + 8} r={1.8} fill="#fff" />
      </g>

      <text x={960} y={120} textAnchor="middle" fill={GLOW}
        fontSize={38} fontFamily="Georgia, serif" letterSpacing={6}
        opacity={ci(lf, [160, 200, 210, 240], [0, 0.7, 0.7, 0])}
      >
        LE VEILLEUR
      </text>
    </g>
  );
};

// ============================================================
// Transitions entre scenes (fondu)
// ============================================================

function sceneOpacity(frame: number, start: number, dur: number): number {
  return ci(frame, [start, start + 15, start + dur - 20, start + dur], [0, 1, 1, 0]);
}

// ============================================================
// Composition principale
// ============================================================

export const SilhouetteShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Frame local dans chaque scene
  const lf = (sceneIdx: number) => frame - SCENE_STARTS[sceneIdx];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <Defs />

        {/* Fond permanent */}
        <rect width={W} height={H} fill={BG} />

        {/* Scene 1 : Foule */}
        <g opacity={sceneOpacity(frame, SCENE_STARTS[0], S)}>
          <Scene1Foule lf={lf(0)} />
        </g>

        {/* Scene 2 : Transformation */}
        <g opacity={sceneOpacity(frame, SCENE_STARTS[1], S)}>
          <Scene2Transformation lf={lf(1)} />
        </g>

        {/* Scene 3 : Dialogue */}
        <g opacity={sceneOpacity(frame, SCENE_STARTS[2], S)}>
          <Scene3Dialogue lf={lf(2)} />
        </g>

        {/* Scene 4 : Cartographie */}
        <g opacity={sceneOpacity(frame, SCENE_STARTS[3], S)}>
          <Scene4Carte lf={lf(3)} />
        </g>

        {/* Scene 5 : Le Veilleur */}
        <g opacity={sceneOpacity(frame, SCENE_STARTS[4], S)}>
          <Scene5Veilleur lf={lf(4)} />
        </g>

        {/* Titre ouverture */}
        <text x={960} y={H / 2 + 16} textAnchor="middle" fill={GLOW}
          fontSize={52} fontFamily="Georgia, serif" letterSpacing={8}
          opacity={ci(frame, [0, 20, 40, 60], [0, 0.8, 0.8, 0])}
        >
          SILHOUETTE — SHOWCASE
        </text>
      </svg>
    </AbsoluteFill>
  );
};

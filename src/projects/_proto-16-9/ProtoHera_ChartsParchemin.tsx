/**
 * PROTO HERA #1 — CHARTS sur REGISTRE PARCHEMIN CLAIR (famille C decodee de hera.video).
 *
 * But : prouver qu'on "ecrase" les charts data-viz de Hera avec NOTRE charte Souverain.
 * Reference visuelle : V13 (bars jaune/orange sur quadrille), V01 (poll-bar Yes/No), V09 (line %).
 * Grammaire Hera appliquee (decodee 2026-06-18) : 1 idee/ecran · labels directs (pas de legende) ·
 *   1 accent + neutres · 1 geste propre + easing · PAUSE apres le chiffre cle.
 *
 * Fond = appropriation Souverain du registre "parchemin quadrille" (repris de ProtoEffect_MapDrawParchemin) :
 *   papier #e4ddca + grille or-sable lumineuse + texture papier. Charte : contour/texte NAVY, accent OR.
 *
 * 3 scenes enchainees (~5s chacune @30fps) :
 *   SCENE A (0-150)   : BARS verticales "Importer vs Produire" — la barre dominante en OR, l'autre en navy clair.
 *   SCENE B (150-300) : POLL-BAR horizontale "Pour / Contre" — barre unique divisee, % qui montent, accent OR.
 *   SCENE C (300-450) : LINE chart — une courbe navy qui se trace + point OR qui pulse + dernier % en gros.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence } from "remotion";

const W = 1920;
const H = 1080;

// === Charte parchemin Souverain (identique au proto MapDrawParchemin valide) ===
const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const NAVY = "#16213a";
const NAVY_SOFT = "#3a4a6b";
const GOLD = "#c8a951";
const GOLD_DARK = "#a8862f";
const DISPLAY = "Cinzel, 'Playfair Display', Georgia, serif";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

const GRID_STEP = 185;

// ---------- Fond commun (papier + grille + texture) ----------
const ParchBackground: React.FC = () => {
  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => 40 + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => 28 + i * GRID_STEP);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="paperTexH">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.07" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={PARCH} />
      <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexH)" opacity={0.55} />
      <g stroke={GRID} strokeWidth={1.6} opacity={0.6}>
        {gridV.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
        ))}
        {gridH.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
        ))}
      </g>
    </svg>
  );
};

// Titre editorial commun (serif navy + 1 mot accent or), entree par fondu+leger up.
const SceneTitle: React.FC<{ pre: string; accent: string; post?: string; localFrame: number }> = ({
  pre,
  accent,
  post,
  localFrame,
}) => {
  const op = interpolate(localFrame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const up = interpolate(localFrame, [4, 18], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: op,
        transform: `translateY(${up}px)`,
        fontFamily: DISPLAY,
        fontSize: 58,
        fontWeight: 700,
        color: NAVY,
        letterSpacing: "0.5px",
      }}
    >
      {pre}
      <span style={{ color: GOLD_DARK }}>{accent}</span>
      {post}
    </div>
  );
};

// ============================ SCENE A — BARS VERTICALES ============================
const SceneBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseY = 820; // ligne de sol
  const maxH = 480;

  type Bar = { label: string; value: number; accent: boolean };
  const bars: Bar[] = [
    { label: "IMPORTER", value: 0.42, accent: false },
    { label: "PRODUIRE", value: 0.86, accent: true },
  ];
  const slotW = 360;
  const startX = W / 2 - slotW;

  // ligne de sol qui se trace
  const ground = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 40, stiffness: 50 } });

  return (
    <AbsoluteFill>
      <SceneTitle pre="Le vrai choix : importer ou " accent="produire" localFrame={frame} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* ligne de sol noire epaisse (signature V13) */}
        <line
          x1={startX - 60}
          y1={baseY}
          x2={startX - 60 + (slotW * 2 + 120) * ground}
          y2={baseY}
          stroke={NAVY}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {bars.map((b, i) => {
          const grow = spring({ fps, frame: Math.max(0, frame - (34 + i * 12)), config: { damping: 30, stiffness: 60 } });
          const h = maxH * b.value * grow;
          const x = startX + i * slotW + slotW / 2 - 90;
          const fill = b.accent ? GOLD : NAVY_SOFT;
          // pop du % a l'arrivee
          const labelOp = interpolate(frame, [34 + i * 12 + 18, 34 + i * 12 + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={b.label}>
              <rect x={x} y={baseY - h} width={180} height={h} fill={fill} rx={4} />
              {/* % direct au-dessus (label direct, pas de legende) */}
              <text
                x={x + 90}
                y={baseY - h - 22}
                textAnchor="middle"
                fontFamily={NUM}
                fontSize={64}
                fill={b.accent ? GOLD_DARK : NAVY}
                opacity={labelOp}
              >
                {Math.round(b.value * 100)}%
              </text>
              {/* nom sous la ligne */}
              <text x={x + 90} y={baseY + 56} textAnchor="middle" fontFamily={SANS} fontSize={34} fontWeight={700} fill={NAVY}>
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================ SCENE B — POLL-BAR HORIZONTALE ============================
const ScenePoll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barX = 260;
  const barW = W - 520;
  const barY = 540;
  const barH = 130;

  const yesPct = 0.68; // accent OR
  const split = spring({ fps, frame: Math.max(0, frame - 26), config: { damping: 32, stiffness: 55 } });
  const yesW = barW * yesPct * split;

  const numT = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - numT, 3);
  const yesNum = Math.round(eased * yesPct * 100);
  const noNum = Math.round(eased * (1 - yesPct) * 100);

  return (
    <AbsoluteFill>
      <SceneTitle pre="Faut-il transformer sur place le " accent="brut" post=" ?" localFrame={frame} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* fond barre (la partie "Contre") */}
        <rect x={barX} y={barY} width={barW} height={barH} rx={10} fill={NAVY_SOFT} opacity={0.85} />
        {/* partie "Pour" en OR (clip par largeur animee) */}
        <clipPath id="pollClip">
          <rect x={barX} y={barY} width={yesW} height={barH} rx={10} />
        </clipPath>
        <rect x={barX} y={barY} width={barW} height={barH} rx={10} fill={GOLD} clipPath="url(#pollClip)" />

        {/* labels DANS la barre (directs) */}
        <text x={barX + 36} y={barY + barH / 2 + 18} fontFamily={SANS} fontSize={46} fontWeight={800} fill={NAVY}>
          POUR {yesNum}%
        </text>
        <text
          x={barX + barW - 36}
          y={barY + barH / 2 + 18}
          textAnchor="end"
          fontFamily={SANS}
          fontSize={46}
          fontWeight={800}
          fill="#f4efe4"
        >
          {noNum}% CONTRE
        </text>
      </svg>
      {/* source note (signature editoriale Hera, beat 5) */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 26,
          fontStyle: "italic",
          color: NAVY,
          opacity: interpolate(frame, [70, 90], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Sondage Afrobaromètre, 2025
      </div>
    </AbsoluteFill>
  );
};

// ============================ SCENE C — LINE CHART ============================
const SceneLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // points (annee, valeur 0-1) — une montee reguliere type V09
  const pts = [0.32, 0.35, 0.34, 0.41, 0.48, 0.55, 0.63, 0.71];
  const plotX = 320;
  const plotW = W - 640;
  const plotY = 760;
  const plotH = 420;
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  const xy = pts.map((v, i) => ({
    x: plotX + (plotW * i) / (pts.length - 1),
    y: plotY - plotH * v,
  }));
  const dPath = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  // longueur approx pour le trace dash
  let len = 0;
  for (let i = 1; i < xy.length; i++) {
    len += Math.hypot(xy[i].x - xy[i - 1].x, xy[i].y - xy[i - 1].y);
  }
  const draw = spring({ fps, frame: Math.max(0, frame - 24), config: { damping: 42, stiffness: 26 } });

  // dernier point pulse une fois la courbe tracee
  const lastPt = xy[xy.length - 1];
  const landPop = spring({ fps, frame: Math.max(0, frame - 96), config: { damping: 9, stiffness: 200 } });
  const breathe = frame > 110 ? 1 + 0.04 * Math.sin((frame - 110) * 0.16) : 1;
  const dotScale = (1 + 0.5 * landPop) * breathe;
  const bigOp = interpolate(frame, [96, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneTitle pre="La part transformée " accent="localement" localFrame={frame} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* axe X */}
        <line x1={plotX} y1={plotY} x2={plotX + plotW} y2={plotY} stroke={NAVY} strokeWidth={3} opacity={0.6} />
        {/* annees */}
        {years.map((y, i) => (
          <text
            key={y}
            x={plotX + (plotW * i) / (pts.length - 1)}
            y={plotY + 44}
            textAnchor="middle"
            fontFamily={SANS}
            fontSize={26}
            fill={NAVY}
            opacity={0.65}
          >
            {y}
          </text>
        ))}
        {/* courbe navy qui se trace */}
        <path
          d={dPath}
          fill="none"
          stroke={NAVY}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
        />
        {/* point final OR qui pulse */}
        <circle cx={lastPt.x} cy={lastPt.y} r={14 * dotScale} fill={GOLD} stroke={NAVY} strokeWidth={3} opacity={draw > 0.95 ? 1 : 0} />
      </svg>
      {/* gros chiffre final (pause sur le chiffre cle) */}
      <div
        style={{
          position: "absolute",
          left: lastPt.x + 40,
          top: lastPt.y - 90,
          opacity: bigOp,
          fontFamily: NUM,
          fontSize: 110,
          lineHeight: 1,
          color: GOLD_DARK,
          textShadow: "0 2px 0 rgba(255,255,255,0.5)",
        }}
      >
        71%
      </div>
    </AbsoluteFill>
  );
};

// ============================ ROOT SHOWCASE ============================
export const ProtoHera_ChartsParchemin: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PARCH }}>
      <ParchBackground />
      <Sequence from={0} durationInFrames={150}>
        <SceneBars />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <ScenePoll />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <SceneLine />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ProtoHera_ChartsParchemin;

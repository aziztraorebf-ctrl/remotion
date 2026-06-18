/**
 * PROTO HERA #4 — REGISTRE SKETCH / WHITEBOARD (NOUVEAU registre, decide par Aziz 2026-06-18).
 * Reference V14 : barres au trait crayon + smiley triste + fleche rouge manuscrite "A THIRD PARTY".
 *
 * Distinctif et chaleureux, complementaire des fonds kraft. Technique du "dessine-main" en SVG :
 *   - filtre feTurbulence + feDisplacementMap sur les formes => contours qui tremblent (effet crayon)
 *   - barres = rect avec stroke epais sombre + leger remplissage, displaced
 *   - fleche = path bezier qui se trace (strokeDashoffset), displaced
 *   - police manuscrite (Caveat / Comic-like fallback)
 *
 * Grammaire Hera : 1 idee/ecran · 1 accent (le "troisieme" en rose) · 1 geste (les barres poussent, la fleche pointe).
 * Recit V14 : 2 gros acteurs (sombre + gris) ecrasent un petit nouveau (rose) => "un troisieme acteur".
 *
 * Sequence (~6s @30fps) :
 *   0-30   : axes crayon se tracent
 *   30-90  : les 2 grosses barres poussent (sombre + gris) + smiley triste sur la 1ere
 *   80-120 : la petite barre rose pousse
 *   110+   : la fleche manuscrite se trace + label "UN TROISIEME ACTEUR"
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

const W = 1920;
const H = 1080;

const PAPER = "#f4f1ea"; // papier blanc casse
const INK = "#2b2b2b"; // crayon sombre
const GREY = "#9a9a9a";
const PINK = "#f0509b"; // accent "troisieme acteur"
const RED = "#d23b34"; // annotation manuscrite
const HAND = "'Caveat','Comic Sans MS',cursive";

export const ProtoHera_Sketch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseY = 820;
  const axisX = 420;
  const axisTop = 240;
  const maxH = baseY - axisTop;

  // axes qui se tracent
  const axes = spring({ fps, frame: Math.max(0, frame - 6), config: { damping: 40, stiffness: 45 } });

  // barres
  const bars = [
    { x: 560, w: 200, val: 0.82, fill: INK, faceSmiley: true },
    { x: 860, w: 200, val: 0.9, fill: GREY, faceSmiley: false },
    { x: 1240, w: 200, val: 0.16, fill: PINK, faceSmiley: false, late: true },
  ];

  // fleche manuscrite (bezier) vers la petite barre rose
  const arrowDraw = spring({ fps, frame: Math.max(0, frame - 112), config: { damping: 44, stiffness: 30 } });
  const arrowPath = "M520,1000 C720,1010 980,940 1320,880";
  const arrowLen = 920;

  const labelOp = interpolate(frame, [124, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* effet crayon : deplace les contours facon trait tremble */}
          <filter id="sketchy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* texture papier tres legere */}
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.04" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* grain papier */}
        <rect width={W} height={H} fill={PAPER} filter="url(#paperGrain)" opacity={0.5} />

        {/* AXES crayon */}
        <g filter="url(#sketchy)" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none">
          {/* axe Y */}
          <line x1={axisX} y1={axisTop} x2={axisX} y2={baseY} strokeDasharray={maxH} strokeDashoffset={maxH * (1 - axes)} />
          {/* axe X (sol) */}
          <line x1={axisX} y1={baseY} x2={1560} y2={baseY} strokeDasharray={1140} strokeDashoffset={1140 * (1 - axes)} />
        </g>

        {/* BARRES */}
        {bars.map((b, i) => {
          const delay = b.late ? 84 : 30 + i * 14;
          const grow = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 28, stiffness: 55 } });
          const h = maxH * b.val * grow;
          return (
            <g key={i} filter="url(#sketchy)">
              <rect x={b.x} y={baseY - h} width={b.w} height={h} fill={b.fill} stroke={INK} strokeWidth={4} rx={3} />
              {/* smiley triste sur la 1ere barre (signature V14) */}
              {b.faceSmiley && h > 160 && (
                <g stroke="#f4f1ea" strokeWidth={4} fill="none" strokeLinecap="round">
                  <circle cx={b.x + b.w / 2} cy={baseY - h + 90} r={36} stroke="#f4f1ea" strokeWidth={4} />
                  <circle cx={b.x + b.w / 2 - 13} cy={baseY - h + 80} r={2.5} fill="#f4f1ea" stroke="none" />
                  <circle cx={b.x + b.w / 2 + 13} cy={baseY - h + 80} r={2.5} fill="#f4f1ea" stroke="none" />
                  {/* bouche triste */}
                  <path d={`M${b.x + b.w / 2 - 16},${baseY - h + 104} Q${b.x + b.w / 2},${baseY - h + 90} ${b.x + b.w / 2 + 16},${baseY - h + 104}`} />
                </g>
              )}
            </g>
          );
        })}

        {/* FLECHE manuscrite vers la barre rose */}
        <g filter="url(#sketchy)" stroke={RED} strokeWidth={5} fill="none" strokeLinecap="round">
          <path d={arrowPath} strokeDasharray={arrowLen} strokeDashoffset={arrowLen * (1 - arrowDraw)} />
          {/* pointe de fleche (apparait en fin de trace) */}
          {arrowDraw > 0.9 && (
            <g>
              <line x1={1320} y1={880} x2={1290} y2={868} />
              <line x1={1320} y1={880} x2={1300} y2={905} />
            </g>
          )}
        </g>
      </svg>

      {/* LABEL manuscrit rouge */}
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 920,
          fontFamily: HAND,
          fontSize: 72,
          fontWeight: 700,
          color: RED,
          opacity: labelOp,
          transform: "rotate(-3deg)",
        }}
      >
        un troisième acteur
      </div>
    </AbsoluteFill>
  );
};

export default ProtoHera_Sketch;

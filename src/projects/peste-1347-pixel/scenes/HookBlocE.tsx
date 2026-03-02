import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Pierre,
  Martin,
  Isaac,
  Guillaume,
  Agnes,
  Renaud,
  GOLD,
  GOLD_DARK,
  INK,
  PARCHMENT,
  PARCHMENT_DARK,
  VERMILLON,
} from "../components/EnlumCharacters";

// ============================================================
// HOOK BLOC E v2 — Reframe + 6 archetypes + 1347 (341f @30fps)
//
// Audio sequentiel :
//   hook_05_reframe  : f0   -> f57   (1.92s) "Mais cette video ne parle pas de la maladie."
//   hook_06_reveal   : f57  -> f168  (3.68s) "Elle parle de ce que les HUMAINS ont fait..."
//   hook_07_reflexes : f168 -> f310  (4.72s) "Car a chaque crise... les memes reflexes reviennent."
//   Silence + titre  : f310 -> f341  (1.0s)  Surimpression "1347"
//
// Visuel :
//   Phase A (0-57f)   : Texte reframe sur parchemin vide
//   Phase B (57-168f) : 6 personnages CharacterSheet entrent un par un (spring scale-in)
//   Phase C (168-310f): Tous visibles, texte "reflexes"
//   Phase D (310-341f): "1347" surimprime en or. Fondu sortant.
//
// Personnages : vrais composants CharacterSheet (Pierre, Martin, Isaac, Guillaume, Agnes, Renaud)
// ============================================================

const SEG5_START = 0;
const SEG5_END = 57;
const SEG6_START = 57;
const SEG6_END = 168;
const SEG7_START = 183;  // +15f pause apres hook_06 (0.5s respiration)
const SEG7_END = 325;
const TITLE_START = 323;
const TOTAL_FRAMES = 356;
const FADE_START = 337;

// ============================================================
// GRAIN
// ============================================================
function GrainOverlay({ frame }: { frame: number }) {
  const seed = frame % 8;
  return (
    <svg
      width="1920"
      height="1080"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        mixBlendMode: "overlay",
        opacity: 0.06,
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter id={`gE2_${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="1920" height="1080" filter={`url(#gE2_${seed})`} />
    </svg>
  );
}

// Wrapper avec spring scale-in + sway idle
function CharWrapper({
  x,
  y,
  frame,
  delay,
  children,
}: {
  x: number;
  y: number;
  frame: number;
  delay: number;
  children: React.ReactNode;
}) {
  const localFrame = Math.max(0, frame - delay);
  const sc = spring({ frame: localFrame, fps: 30, config: { damping: 20, stiffness: 90 } });
  const opacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g transform={`translate(${x}, ${y}) scale(${sc})`} opacity={opacity}>
      {children}
    </g>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export const HookBlocE: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;


  // "1347" apparition — spring doux
  const titleSc = spring({ frame: Math.max(0, frame - TITLE_START), fps: 30, config: { damping: 22, stiffness: 55 } });
  const titleOpacity = interpolate(frame, [TITLE_START, TITLE_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fondu sortant
  const fadeOut = interpolate(frame, [FADE_START, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opacites texte — transitions NETTES (pas de chevauchement)
  const opSeg5 = interpolate(frame, [0, 8, SEG5_END - 6, SEG5_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opSeg6 = interpolate(frame, [SEG6_START, SEG6_START + 10, SEG6_END - 6, SEG6_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opSeg7 = interpolate(frame, [SEG7_START, SEG7_START + 12, TITLE_START - 4, TITLE_START], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Espacement des personnages : 6 persos sur 1920px, marges 120px
  // Zone utile 1680px, intervalle 280px, centre premier = 180
  const charY = 860; // position des pieds
  const delays = [
    SEG6_START,
    SEG6_START + 16,
    SEG6_START + 32,
    SEG6_START + 48,
    SEG6_START + 64,
    SEG6_START + 80,
  ];
  const charScale = 0.72;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCHMENT, overflow: "hidden" }}>
      {/* Musique luth — discret, ne concurrence pas la voix */}
      <Audio src={staticFile("audio/peste-pixel/hookbloca-luth.mp3")} startFrom={0} loop volume={0.05} />

      {/* Audio sequentiel — Sequence isole chaque piste a son frame de debut */}
      <Sequence from={SEG5_START} durationInFrames={TOTAL_FRAMES - SEG5_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_05_reframe.mp3")} startFrom={0} volume={1} />
      </Sequence>
      <Sequence from={SEG6_START} durationInFrames={TOTAL_FRAMES - SEG6_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_06_reveal.mp3")} startFrom={0} volume={1} />
      </Sequence>
      <Sequence from={SEG7_START} durationInFrames={TOTAL_FRAMES - SEG7_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_07_reflexes.mp3")} startFrom={0} volume={1} />
      </Sequence>

      {/* SFX — accord luth sec sur apparition "1347" */}
      <Sequence from={TITLE_START} durationInFrames={45}>
        <Audio src={staticFile("audio/peste-pixel/sfx/lute-sting.mp3")} startFrom={0} volume={0.55} />
      </Sequence>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="parchE2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAD9B0" />
            <stop offset="100%" stopColor="#F5E6C8" />
          </linearGradient>
        </defs>

        {/* Fond parchemin */}
        <rect width="1920" height="1080" fill="url(#parchE2)" />

        {/* Sol dallage medievale */}
        {[820, 870, 920, 970, 1020].map((y) =>
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((xi) => (
            <rect
              key={`${y}-${xi}`}
              x={xi * 160 + (Math.floor(y / 50) % 2 === 0 ? 0 : 80)}
              y={y}
              width={155}
              height={48}
              fill="none"
              stroke={INK}
              strokeWidth={1}
              opacity={0.09}
            />
          ))
        )}

        {/* Ligne de sol */}
        <line x1="0" y1={charY} x2="1920" y2={charY} stroke={GOLD_DARK} strokeWidth={1.5} opacity={0.3} />

        {/* Bordure enluminure */}
        <rect x="24" y="24" width="1872" height="1032" fill="none" stroke={GOLD} strokeWidth={5} opacity={0.65} />
        <rect x="34" y="34" width="1852" height="1012" fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.35} />

        {/* Coins ornementaux */}
        {([[60, 60], [1860, 60], [60, 1020], [1860, 1020]] as [number, number][]).map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={16} fill="none" stroke={GOLD} strokeWidth={2.5} opacity={0.55} />
            <circle cx={cx} cy={cy} r={5} fill={GOLD} opacity={0.45} />
          </g>
        ))}

        {/* PERSONNAGES — vrais composants CharacterSheet */}
        <CharWrapper x={195} y={0} frame={frame} delay={delays[0]}>
          <Pierre x={0} y={charY} anim="idle" frame={frame} scale={charScale} etat="sain" />
        </CharWrapper>
        <CharWrapper x={475} y={0} frame={frame} delay={delays[1]}>
          <Martin x={0} y={charY} anim="idle" frame={frame} scale={charScale} etat="sain" />
        </CharWrapper>
        <CharWrapper x={730} y={0} frame={frame} delay={delays[2]}>
          <Isaac x={0} y={charY} anim="idle" frame={frame} scale={charScale} etat="sain" />
        </CharWrapper>
        <CharWrapper x={1190} y={0} frame={frame} delay={delays[3]}>
          <Guillaume x={0} y={charY} anim="idle" frame={frame} scale={charScale * 0.95} etat="sain" />
        </CharWrapper>
        <CharWrapper x={1445} y={0} frame={frame} delay={delays[4]}>
          <Agnes x={0} y={charY} anim="idle" frame={frame} scale={charScale} etat="sain" />
        </CharWrapper>
        <CharWrapper x={1725} y={0} frame={frame} delay={delays[5]}>
          <Renaud x={0} y={charY} anim="idle" frame={frame} scale={charScale} etat="sain" />
        </CharWrapper>

        {/* Etiquettes noms */}
        {[
          { x: 195, name: "Pierre",    role: "Le laboureur" },
          { x: 475, name: "Martin",    role: "Le pretre" },
          { x: 730, name: "Isaac",     role: "Le preteur" },
          { x: 1190, name: "Guillaume", role: "Le seigneur" },
          { x: 1445, name: "Agnes",    role: "La guerisseuse" },
          { x: 1725, name: "Renaud",   role: "Le medecin" },
        ].map((p, i) => {
          const lOpacity = interpolate(Math.max(0, frame - (delays[i] + 12)), [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={p.name} opacity={lOpacity}>
              <text x={p.x} y={charY + 30} textAnchor="middle" fill={GOLD_DARK} fontSize={22} fontFamily="Georgia, serif" fontWeight="bold">
                {p.name}
              </text>
              <text x={p.x} y={charY + 50} textAnchor="middle" fill={INK} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.65}>
                {p.role}
              </text>
            </g>
          );
        })}

        {/* Surimpression "1347" */}
        {frame >= TITLE_START && (
          <g transform={`translate(960, 500) scale(${titleSc})`} opacity={titleOpacity}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={GOLD}
              fontSize={340}
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="900"
              opacity={0.9}
            >
              1347
            </text>
          </g>
        )}
      </svg>

      {/* TEXTE REFRAME — transitions nettes, zero chevauchement */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 160,
          right: 160,
          textAlign: "center",
          color: INK,
          fontSize: 54,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          letterSpacing: "0.03em",
          opacity: opSeg5,
          pointerEvents: "none",
        }}
      >
        Mais cette vid&#233;o ne parle pas de la maladie.
      </div>

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 160,
          right: 160,
          textAlign: "center",
          color: INK,
          fontSize: 50,
          fontFamily: "Georgia, serif",
          letterSpacing: "0.02em",
          lineHeight: 1.5,
          opacity: opSeg6,
          pointerEvents: "none",
        }}
      >
        Elle parle de ce que les{" "}
        <span style={{ color: VERMILLON, fontWeight: 900, fontStyle: "italic" }}>HUMAINS</span>
        {" "}ont fait...<br />
        quand ils ont cru que c&apos;&#233;tait la fin du monde.
      </div>

      <div
        style={{
          position: "absolute",
          top: 148,
          left: 160,
          right: 160,
          textAlign: "center",
          color: INK,
          fontSize: 48,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          letterSpacing: "0.03em",
          opacity: opSeg7,
          pointerEvents: "none",
        }}
      >
        Car &#224; chaque crise... les m&#234;mes r&#233;flexes reviennent.
      </div>

      <GrainOverlay frame={frame} />

      {/* Fondu noir final */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          opacity: fadeOut,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

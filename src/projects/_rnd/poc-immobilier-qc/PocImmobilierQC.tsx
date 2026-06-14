/**
 * POC — "Pourquoi Montreal est devenue inabordable" (~66s, 1080x1920)
 *
 * Demonstration : 2e chaine hypothetique (economie/immobilier canadien) avec le stack existant.
 * - Carte Mapbox statique (dark) en fond, drift + zoom frame-driven (headless-safe, pas de WebGL).
 * - 4 sequences data-viz Remotion pur synchronisees a la narration Paul K (FR).
 * - Palette "Nord Donnees" : navy froid + accent ambre + ivoire. Distincte de GeoAfrique.
 *
 * Render headless OK (pas de Mapbox live, que des PNG statiques).
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";

// ---------------------------------------------------------------------------
// Palette "Nord Donnees" (identite distincte de GeoAfrique)
// ---------------------------------------------------------------------------
const COL = {
  bg: "#0d1622", // navy nuit froid
  ink: "#f4f1e9", // ivoire
  amber: "#e8a44c", // accent ambre chaud
  red: "#d6573f", // alerte / chute
  blue: "#5b8fb0", // donnee neutre
  dim: "rgba(244,241,233,0.55)",
};

const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fadeIn = (f: number, start: number, dur = 18) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const fadeInOut = (f: number, start: number, end: number, dur = 18) =>
  Math.min(fadeIn(f, start, dur), 1 - fadeIn(f, end - dur, dur));

// ---------------------------------------------------------------------------
// Fond carte : drift + zoom lent continu, change de plan par sequence
// ---------------------------------------------------------------------------
const MapBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // zoom global tres lent (Ken Burns) sur toute la duree
  const globalScale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);
  // drift horizontal subtil
  const driftX = interpolate(frame, [0, durationInFrames], [-20, 30]);
  const driftY = interpolate(frame, [0, durationInFrames], [10, -25]);

  // Cross-fade entre les 3 plans selon le temps (en frames @30fps)
  // 0-12s downtown(serre) -> 12-48s montreal(metro) -> 48-66s wide(canada)
  const fps = 30;
  const tDowntownOut = 12 * fps;
  const tWideIn = 48 * fps;

  const opDowntown = 1 - fadeIn(frame, tDowntownOut - 20, 30);
  const opWide = fadeIn(frame, tWideIn, 30);
  const opMontreal = Math.min(1 - opWide, fadeIn(frame, tDowntownOut - 20, 30));

  const layer = (src: string, op: number, extraScale = 1) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: "120%",
        height: "120%",
        objectFit: "cover",
        left: "-10%",
        top: "-10%",
        opacity: op,
        transform: `scale(${globalScale * extraScale}) translate(${driftX}px, ${driftY}px)`,
        filter: "saturate(0.9) brightness(0.85)",
      }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg }}>
      {layer("_demos/poc-immobilier-qc/map-montreal.png", opMontreal)}
      {layer("_demos/poc-immobilier-qc/map-downtown.png", opDowntown, 1.05)}
      {layer("_demos/poc-immobilier-qc/map-wide.png", opWide)}
      {/* Vignette + assombrissement bas pour lisibilite texte */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(13,22,34,0) 30%, rgba(13,22,34,0.55) 75%, rgba(13,22,34,0.9) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(13,22,34,0.7) 0%, rgba(13,22,34,0) 22%, rgba(13,22,34,0) 60%, rgba(13,22,34,0.95) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Compteur anime (countUp)
// ---------------------------------------------------------------------------
const CountUp: React.FC<{ from: number; to: number; start: number; dur: number; prefix?: string; suffix?: string; color?: string; size?: number }> = ({
  from,
  to,
  start,
  dur,
  prefix = "",
  suffix = "",
  color = COL.ink,
  size = 150,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - t, 3);
  const val = Math.round(from + (to - from) * eased);
  return (
    <span style={{ fontSize: size, fontWeight: 800, color, fontFamily: FONT, letterSpacing: -2, lineHeight: 1 }}>
      {prefix}
      {val.toLocaleString("fr-CA")}
      {suffix}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Plaque de titre/sous-titre bas (sous-titres narration synchro approx)
// ---------------------------------------------------------------------------
const LowerThird: React.FC<{ text: string; start: number; end: number; accent?: string }> = ({ text, start, end, accent = COL.amber }) => {
  const frame = useCurrentFrame();
  const op = fadeInOut(frame, start, end, 12);
  const y = interpolate(fadeIn(frame, start, 14), [0, 1], [24, 0]);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 210,
        left: 70,
        right: 70,
        opacity: op,
        transform: `translateY(${y}px)`,
        textAlign: "center",
      }}
    >
      <div style={{ display: "inline-block", borderLeft: `4px solid ${accent}`, paddingLeft: 18, textAlign: "left" }}>
        <span style={{ fontSize: 40, fontWeight: 600, color: COL.ink, fontFamily: FONT, lineHeight: 1.3, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          {text}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SEQ 1 — HOOK (0-12s) : douleur identitaire
// ---------------------------------------------------------------------------
const SeqHook: React.FC = () => {
  const frame = useCurrentFrame();
  const op = fadeInOut(frame, 8, 385, 16);
  const scale = spring({ frame: frame - 8, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ opacity: op, transform: `scale(${0.9 + scale * 0.1})`, textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: COL.amber, fontFamily: FONT, letterSpacing: 4, marginBottom: 24 }}>
          MONTREAL · 2026
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, color: COL.ink, fontFamily: FONT, lineHeight: 1.1, textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>
          Acheter un logement<br />est devenu<br />
          <span style={{ color: COL.red }}>presque impossible.</span>
        </div>
        <div style={{ fontSize: 36, fontWeight: 500, color: COL.dim, fontFamily: FONT, marginTop: 34, lineHeight: 1.4 }}>
          La raison n'est pas celle<br />qu'on te repete.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// SEQ 2 — LE FAIT CHIFFRE (12-30s) : prix x2, salaires +40%
// ---------------------------------------------------------------------------
const SeqPrix: React.FC = () => {
  const frame = useCurrentFrame();
  const op = fadeInOut(frame, 0, 540, 16);

  // barre prix qui monte
  const barPrix = interpolate(frame, [60, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barSal = interpolate(frame, [320, 430], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ width: 880, textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: COL.amber, fontFamily: FONT, letterSpacing: 3, marginBottom: 10 }}>
          PRIX MOYEN D'UNE PROPRIETE
        </div>

        {/* deux compteurs cote a cote */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30, marginBottom: 40 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 28, color: COL.dim, fontFamily: FONT, marginBottom: 10 }}>2010</div>
            <CountUp from={0} to={250000} start={40} dur={80} prefix="" suffix=" $" color={COL.blue} size={64} />
          </div>
          <div style={{ fontSize: 48, color: COL.dim, fontFamily: FONT, padding: "0 10px" }}>→</div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 28, color: COL.dim, fontFamily: FONT, marginBottom: 10 }}>2026</div>
            <CountUp from={250000} to={600000} start={130} dur={90} prefix="" suffix=" $" color={COL.red} size={64} />
          </div>
        </div>

        {/* barres comparatives prix vs salaire */}
        <div style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
            <div style={{ width: 200, textAlign: "right", paddingRight: 20, fontSize: 26, color: COL.ink, fontFamily: FONT, fontWeight: 600 }}>Prix</div>
            <div style={{ flex: 1, height: 44, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${barPrix * 100}%`, height: "100%", background: COL.red, borderRadius: 6 }} />
            </div>
            <div style={{ width: 110, paddingLeft: 16, fontSize: 30, color: COL.red, fontFamily: FONT, fontWeight: 800, opacity: barPrix > 0.9 ? 1 : 0 }}>+140%</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 200, textAlign: "right", paddingRight: 20, fontSize: 26, color: COL.ink, fontFamily: FONT, fontWeight: 600 }}>Salaires</div>
            <div style={{ flex: 1, height: 44, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${barSal * 28}%`, height: "100%", background: COL.blue, borderRadius: 6 }} />
            </div>
            <div style={{ width: 110, paddingLeft: 16, fontSize: 30, color: COL.blue, fontFamily: FONT, fontWeight: 800, opacity: barSal > 0.9 ? 1 : 0 }}>+40%</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// SEQ 3 — LA CAUSE (30-48s) : l'offre s'effondre
// ---------------------------------------------------------------------------
const SeqCause: React.FC = () => {
  const frame = useCurrentFrame();
  const op = fadeInOut(frame, 0, 540, 16);
  // courbe construction qui descend
  const draw = interpolate(frame, [60, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const W = 760, H = 280;
  // points : construction par habitant qui decline
  const pts = [
    [0, 70], [130, 100], [260, 95], [380, 150], [500, 200], [620, 230], [760, 255],
  ];
  const pathFull = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  // longueur approx pour dasharray
  const totalLen = 1100;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ width: 820, textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: COL.amber, fontFamily: FONT, letterSpacing: 3, marginBottom: 8 }}>
          LE VRAI PROBLEME : L'OFFRE
        </div>
        <div style={{ fontSize: 34, fontWeight: 500, color: COL.ink, fontFamily: FONT, marginBottom: 30 }}>
          Logements construits par habitant
        </div>
        <svg width={W} height={H} style={{ overflow: "visible" }}>
          {/* axe */}
          <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          <text x={0} y={H + 34} fill={COL.dim} fontSize={24} fontFamily={FONT}>2005</text>
          <text x={W - 70} y={H + 34} fill={COL.dim} fontSize={24} fontFamily={FONT}>2026</text>
          {/* courbe declin */}
          <path
            d={pathFull}
            fill="none"
            stroke={COL.red}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLen}
            strokeDashoffset={totalLen * (1 - draw)}
          />
          {/* point final */}
          {draw > 0.95 && (
            <circle cx={760} cy={255} r={10} fill={COL.red} />
          )}
        </svg>
        <div style={{ fontSize: 30, fontWeight: 600, color: COL.dim, fontFamily: FONT, marginTop: 40, opacity: draw > 0.9 ? 1 : 0 }}>
          Moins qu'il y a <span style={{ color: COL.red, fontWeight: 800 }}>20 ans</span>. Le retard s'accumule.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// SEQ 4 — LA CHUTE / PERSPECTIVE (48-66s) : pas isole, tout le Canada
// ---------------------------------------------------------------------------
const SeqPerspective: React.FC = () => {
  const frame = useCurrentFrame();
  const op = fadeInOut(frame, 0, 540, 16);

  const cities = [
    { name: "Montreal", delay: 30 },
    { name: "Toronto", delay: 70 },
    { name: "Vancouver", delay: 110 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ textAlign: "center", width: 880 }}>
        <div style={{ fontSize: 34, fontWeight: 500, color: COL.ink, fontFamily: FONT, marginBottom: 36, lineHeight: 1.3 }}>
          Montreal n'est pas<br />un cas isole.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          {cities.map((c) => {
            const cop = fadeIn(frame, c.delay, 16);
            const cy = interpolate(cop, [0, 1], [20, 0]);
            return (
              <div
                key={c.name}
                style={{
                  opacity: cop,
                  transform: `translateY(${cy}px)`,
                  fontSize: 52,
                  fontWeight: 800,
                  color: COL.red,
                  fontFamily: FONT,
                  letterSpacing: 1,
                }}
              >
                {c.name}
              </div>
            );
          })}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: COL.amber,
            fontFamily: FONT,
            marginTop: 50,
            opacity: fadeIn(frame, 170, 20),
            lineHeight: 1.35,
          }}
        >
          Tant qu'on ne construit pas,<br />rien ne changera.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// CTA bandeau bas (signature chaine)
// ---------------------------------------------------------------------------
const BrandBar: React.FC = () => {
  const frame = useCurrentFrame();
  const op = fadeIn(frame, 20, 30);
  return (
    <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center", opacity: op }}>
      <span style={{ fontSize: 30, fontWeight: 800, color: COL.ink, fontFamily: FONT, letterSpacing: 3 }}>
        NORD <span style={{ color: COL.amber }}>DONNEES</span>
      </span>
      <div style={{ fontSize: 22, color: COL.dim, fontFamily: FONT, marginTop: 6, letterSpacing: 1 }}>
        L'economie canadienne, expliquee par les chiffres
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// COMPOSITION PRINCIPALE
// ---------------------------------------------------------------------------
export const PocImmobilierQC: React.FC = () => {
  const fps = 30;
  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg }}>
      <MapBackdrop />

      {/* Sequences synchronisees sur timings Whisper reels (frames @30fps) */}
      <Sequence from={0} durationInFrames={13 * fps}>
        <SeqHook />
      </Sequence>
      <Sequence from={13 * fps} durationInFrames={19 * fps}>
        <SeqPrix />
      </Sequence>
      <Sequence from={32 * fps} durationInFrames={18 * fps}>
        <SeqCause />
      </Sequence>
      <Sequence from={50 * fps} durationInFrames={16 * fps + 15}>
        <SeqPerspective />
      </Sequence>

      {/* Sous-titres narration (lower third synchro sur Whisper) */}
      <LowerThird text="Une chose qu'on ne t'a jamais vraiment expliquee." start={97} end={290} />
      <LowerThird text="En 15 ans, les prix ont plus que double." start={711} end={825} />
      <LowerThird text="Le Quebec construit moins qu'il y a 20 ans." start={1092} end={1240} />
      <LowerThird text="Une generation entiere a la porte du marche." start={1728} end={1890} />

      <BrandBar />

      <Audio src={staticFile("_demos/poc-immobilier-qc/narration.mp3")} />
    </AbsoluteFill>
  );
};

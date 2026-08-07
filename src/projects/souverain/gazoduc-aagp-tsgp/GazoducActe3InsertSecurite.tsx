// GazoducActe3InsertSecurite — Acte 3, SEGMENT B, scène-lieu "aéroport de Niamey", 965f/32.17s.
//
// V3 (2026-08-07) — REFONTE APRÈS VERDICT AZIZ sur le rendu v1/v2 : "un simple diaporama qui
// s'éteint" — 3 DA-briefs critiques (Gemini+Kimi+DeepSeek) convergents sur le fond (cf
// PLAN-ACTES2-5.md § CLIMAX SÉCURITÉ). Corrections V3 appliquées :
//   1. Extinction JAMAIS un fondu linéaire uniforme — chaque feu VACILLE (flicker rapide) avant de
//      s'éteindre, la tour meurt différemment (staccato décroissant), pas une cascade mécanique.
//   2. Chiffre "35" jamais un scale spring doux — apparition plus dure (cut net), countup rapide
//      (0->35 sur 12 frames), onde de choc dont le strokeWidth VARIE pendant l'expansion (tranche,
//      ne décore pas).
//   3. Caméra qui RESPIRE en continu (micro-zoom + micro-parallaxe ciel/sol) sur TOUTE la durée du
//      segment, pas seulement au climax — cause racine partagée avec le Segment A ("plan fixe").
//   4. GATE TRANCHÉ AZIZ : décor gardé EN FILIGRANE (opacité résiduelle très faible sur tour/terminal)
//      pendant le climax — jamais un fond noir total, le lien lieu/drame reste visible (approche
//      Gemini+DeepSeek, PAS le marquage au sol de Kimi).
//   5. Manche à air : bruit composé (2 fréquences sinus superposées) au lieu d'un sinus pur jugé
//      "mécanique/pantin" par 2/3 voix.
//
// Base SVG toujours FABLE 5 (mode MAX) + enrichissements GPT (lune) + Gemini (inspiration contraste)
// — voir historique complet dans PLAN-ACTES2-5.md § SEGMENT B (2026-08-05/07).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS_B, GAZODUC_A3_INSERT_SECURITE_FRAMES } from "./GazoducActe3Timing";

export const GAZODUC_A3_INSERT_SECURITE_FRAMES_EXPORT = GAZODUC_A3_INSERT_SECURITE_FRAMES;

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * 30);
const B = BEATS_B;

const FEUX_AMBRE: { cx: number; cy: number; rHalo: number; rPoint: number }[] = [
  { cx: 320, cy: 1051, rHalo: 20, rPoint: 7 }, { cx: 1398, cy: 1051, rHalo: 20, rPoint: 7 },
  { cx: 410, cy: 1006, rHalo: 18, rPoint: 6 }, { cx: 1366, cy: 1006, rHalo: 18, rPoint: 6 },
  { cx: 508, cy: 959, rHalo: 16, rPoint: 5 }, { cx: 1331, cy: 959, rHalo: 16, rPoint: 5 },
  { cx: 605, cy: 911, rHalo: 14, rPoint: 5 }, { cx: 1296, cy: 911, rHalo: 14, rPoint: 5 },
  { cx: 695, cy: 867, rHalo: 12, rPoint: 4 }, { cx: 1263, cy: 867, rHalo: 12, rPoint: 4 },
  { cx: 785, cy: 822, rHalo: 11, rPoint: 4 }, { cx: 1231, cy: 822, rHalo: 11, rPoint: 4 },
  { cx: 860, cy: 786, rHalo: 9, rPoint: 3 }, { cx: 1204, cy: 786, rHalo: 9, rPoint: 3 },
  { cx: 935, cy: 749, rHalo: 8, rPoint: 3 }, { cx: 1177, cy: 749, rHalo: 8, rPoint: 3 },
];
const FEUX_VERTS: { cx: number; cy: number }[] = [
  { cx: 380, cy: 1070 }, { cx: 560, cy: 1070 }, { cx: 740, cy: 1070 },
  { cx: 940, cy: 1070 }, { cx: 1120, cy: 1070 }, { cx: 1300, cy: 1070 },
];
const FEUX_BLEUS: { cx: number; cy: number }[] = [
  { cx: 1470, cy: 1015 }, { cx: 1520, cy: 975 }, { cx: 1565, cy: 940 }, { cx: 1605, cy: 910 },
];
const FENETRES_TERMINAL: { x: number; y: number }[] = [
  { x: 175, y: 630 }, { x: 213, y: 630 }, { x: 251, y: 630 }, { x: 327, y: 630 },
  { x: 365, y: 630 }, { x: 403, y: 630 }, { x: 441, y: 630 }, { x: 517, y: 630 },
  { x: 555, y: 630 }, { x: 593, y: 630 },
];

// ===== Extinction avec vacillement organique — retour DA-brief : "chaque feu doit VACILLER avant de
// s'éteindre, pas un fondu poli". Génère une opacité qui flicker rapidement dans les ~6 frames avant
// l'extinction programmée, puis chute nette (pas un fondu doux). =====
function deathFlicker(frame: number, deathFrame: number, seed: number): number {
  const preDeath = deathFrame - 7;
  if (frame < preDeath) return 1;
  if (frame < deathFrame) {
    const t = frame - preDeath;
    const flicker = 0.3 + 0.7 * Math.abs(Math.sin(t * 2.4 + seed));
    return flicker;
  }
  return interpolate(frame, [deathFrame, deathFrame + 4], [1, 0], clampB); // chute nette, pas un fondu 0.4s
}

const OndeDeChoc: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const local = frame - startFrame;
  if (local < 0) return null;
  const rings = [0, 5, 10];
  return (
    <g>
      {rings.map((delay, i) => {
        const t = Math.max(0, local - delay);
        const r = interpolate(t, [0, 40], [10, 420], clampB);
        // strokeWidth qui VARIE pendant l'expansion — "tranche l'écran, ne le décore pas" (retour DA-brief).
        const strokeW = interpolate(t, [0, 15, 40], [5 - i, 1, 0], clampB);
        const op = interpolate(t, [0, 40], [0.9, 0], clampB);
        if (op <= 0) return null;
        return <circle key={i} cx={960} cy={620} r={r} fill="none" stroke="#00C4FF" strokeWidth={Math.max(0, strokeW)} opacity={op} />;
      })}
    </g>
  );
};

const ChiffreClimax: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const local = frame - startFrame;
  if (local < 0) return null;
  // Apparition plus dure : quasi cut (scale 0.92->1 en 5 frames), pas un spring doux étalé sur 18f.
  const scale = interpolate(local, [0, 5], [0.92, 1], { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const opacity = interpolate(local, [0, 4], [0, 1], clampB);
  const countUp = Math.round(interpolate(local, [0, 12], [0, 35], { ...clampB, easing: (t) => t * t }));
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", opacity,
    }}>
      <div style={{
        fontSize: 210, fontWeight: 800, color: "#e8ecf5", fontFamily: "'IBM Plex Mono', monospace",
        transform: `scale(${scale})`, letterSpacing: "-0.02em",
      }}>{countUp}</div>
      <div style={{ fontSize: 30, color: "#8fa0bb", marginTop: -12, letterSpacing: "0.15em", fontFamily: "'IBM Plex Mono', monospace" }}>
        MORTS
      </div>
    </div>
  );
};

export const GazoducActe3InsertSecurite: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFade = interpolate(frame, [0, S(0.5), B.segEnd + 9 - S(0.4), B.segEnd + 9], [0, 1, 1, 0], clampB);

  const sceneReveal = interpolate(frame, [0, S(1)], [0, 1], clampB);
  // Manche à air — bruit composé (2 fréquences), pas un sinus pur (retour DA-brief : "mécanique/pantin").
  const vaneAngle = Math.sin(frame * 0.05) * 5 + Math.sin(frame * 0.13) * 2;

  // ===== Caméra qui RESPIRE en continu (retour DA-brief unanime : "plan fixe = diaporama") — micro-zoom
  // + micro-parallaxe entre ciel (lointain, bouge peu) et sol/piste (proche, bouge plus). =====
  const totalDuration = B.segEnd + 9;
  const breathScale = interpolate(frame, [0, totalDuration], [1, 1.06], clampB);
  const skyParallax = interpolate(frame, [0, totalDuration], [0, -8], clampB);
  const groundParallax = interpolate(frame, [0, totalDuration], [0, -22], clampB);

  const extinctionStart = B.actifsEnd;
  const extinctionEnd = B.attaqueVerbeStart;
  const nFeux = FEUX_AMBRE.length / 2;
  const feuxOffAt = (pairIdx: number) => Math.round(interpolate(
    pairIdx, [0, nFeux - 1],
    [extinctionStart, extinctionStart + (extinctionEnd - extinctionStart) * 0.55],
  ));
  const tourOffAt = extinctionStart + (extinctionEnd - extinctionStart) * 0.72;
  const terminalOffAt = extinctionStart + (extinctionEnd - extinctionStart) * 0.85;
  const allOffAt = extinctionEnd;

  const darkenOverlay = interpolate(frame, [extinctionStart, extinctionEnd], [0, 0.75], clampB);

  const feuOpacity = (pairIdx: number, seed: number) => deathFlicker(frame, feuxOffAt(pairIdx), seed);
  // La tour meurt en STACCATO décroissant (5 flashs rapides), pas un fondu — signature de mort distincte.
  const tourStaccado = (() => {
    const t = frame - (tourOffAt - 18);
    if (t < 0) return 1;
    if (t < 18) {
      const flashIdx = Math.floor(t / 3.6);
      return [1, 0.6, 0.3, 0.1, 0][Math.min(4, flashIdx)];
    }
    return 0;
  })();
  const terminalOpacity = (idx: number) => {
    const t = terminalOffAt + idx * 4;
    return deathFlicker(frame, Math.round(t), idx * 1.7);
  };
  const beaconOpacity = 1 - interpolate(frame, [allOffAt - S(0.2), allOffAt], [0, 1], clampB);

  const shakeLocal = Math.max(0, frame - B.trenteCinqStart);
  const shakeAmp = shakeLocal < 12 ? 14 * Math.exp(-shakeLocal * 0.55) : 0;
  const shakeX = shakeAmp * Math.sin(shakeLocal * 12);
  const shakeY = shakeAmp * Math.cos(shakeLocal * 7);

  const dateOpacity = interpolate(
    frame,
    [B.dateAttaqueStart, B.dateAttaqueStart + S(0.6), B.attaqueVerbeStart - S(0.3), B.attaqueVerbeStart],
    [0, 1, 1, 0],
    clampB,
  );

  const chiffreOut = interpolate(frame, [B.paradoxeStart, B.paradoxeStart + S(0.8)], [1, 0], clampB);

  // ===== GATE TRANCHÉ AZIZ : décor gardé EN FILIGRANE pendant le climax (jamais un noir total) —
  // silhouette fantôme tour/terminal à opacité très faible, le lien lieu/drame reste visible. =====
  const climaxFilterOpacity = frame >= B.trenteCinqStart - 6
    ? Math.max(0.06, 1 - darkenOverlay) // plancher 0.06 : jamais totalement invisible pendant le climax
    : 1 - darkenOverlay;

  return (
    <AbsoluteFill style={{ opacity: globalFade, background: "#050b20" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${breathScale})`, transformOrigin: "50% 50%", opacity: sceneReveal }}>
        <defs>
          <radialGradient id="dusk_glow"><stop offset="0" stopColor="#8a6448" stopOpacity={0.55} /><stop offset="1" stopColor="#8a6448" stopOpacity={0} /></radialGradient>
          <radialGradient id="light_glow"><stop offset="0" stopColor="#ffd98a" stopOpacity={0.85} /><stop offset="0.5" stopColor="#ffd98a" stopOpacity={0.25} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></radialGradient>
          <radialGradient id="green_glow"><stop offset="0" stopColor="#7de08a" stopOpacity={0.8} /><stop offset="0.5" stopColor="#7de08a" stopOpacity={0.22} /><stop offset="1" stopColor="#7de08a" stopOpacity={0} /></radialGradient>
          <radialGradient id="blue_glow"><stop offset="0" stopColor="#6fc3ff" stopOpacity={0.8} /><stop offset="0.5" stopColor="#6fc3ff" stopOpacity={0.22} /><stop offset="1" stopColor="#6fc3ff" stopOpacity={0} /></radialGradient>
          <radialGradient id="cab_halo"><stop offset="0" stopColor="#ffca70" stopOpacity={0.55} /><stop offset="1" stopColor="#ffca70" stopOpacity={0} /></radialGradient>
          <radialGradient id="warm_pool"><stop offset="0" stopColor="#ffc46b" stopOpacity={0.5} /><stop offset="1" stopColor="#ffc46b" stopOpacity={0} /></radialGradient>
          <linearGradient id="cone_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe4a8" stopOpacity={0.22} /><stop offset="1" stopColor="#ffe4a8" stopOpacity={0} /></linearGradient>
          <linearGradient id="cab_glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe2a0" /><stop offset="1" stopColor="#f0a95c" /></linearGradient>
          <linearGradient id="sky_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050b20" /><stop offset="0.45" stopColor="#0d1c3e" /><stop offset="0.78" stopColor="#1b3560" /><stop offset="1" stopColor="#2c4a74" /></linearGradient>
          <linearGradient id="ground_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16274b" /><stop offset="1" stopColor="#091126" /></linearGradient>
          <linearGradient id="runway_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2947" /><stop offset="1" stopColor="#2b3c60" /></linearGradient>
        </defs>

        {/* Ciel — couche LOINTAINE de la parallaxe, bouge peu */}
        <g transform={`translate(${skyParallax} 0)`}>
          <rect x={-40} y={0} width={1960} height={700} fill="url(#sky_grad)" />
          <ellipse cx={430} cy={700} rx={620} ry={170} fill="url(#dusk_glow)" />
          {[[200,80,2,0.8],[340,150,1.5,0.6],[520,60,2,0.9],[760,120,1.6,0.7],[980,70,2.2,0.8],[1180,160,1.5,0.6],
            [1350,90,2,0.85],[1500,180,1.6,0.6],[1680,60,2,0.9],[1800,140,1.8,0.7],[1080,220,1.3,0.5],[600,210,1.4,0.55]].map(([cx,cy,r,op], i) => (
            <circle key={`star-${i}`} cx={cx} cy={cy} r={r} fill="#dce8ff" opacity={op} />
          ))}
          <ellipse cx={430} cy={430} rx={180} ry={36} fill="#223a60" opacity={0.85} />
          <ellipse cx={560} cy={415} rx={120} ry={30} fill="#223a60" opacity={0.85} />
          <ellipse cx={320} cy={445} rx={110} ry={26} fill="#223a60" opacity={0.85} />
          <ellipse cx={470} cy={408} rx={140} ry={16} fill="#35507c" opacity={0.6} />
          <ellipse cx={1260} cy={505} rx={220} ry={40} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1400} cy={490} rx={130} ry={30} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1130} cy={520} rx={120} ry={28} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1300} cy={482} rx={150} ry={14} fill="#31497a" opacity={0.5} />
          <ellipse cx={1720} cy={415} rx={150} ry={30} fill="#223a60" opacity={0.8} />
          <ellipse cx={1830} cy={432} rx={88} ry={22} fill="#223a60" opacity={0.8} />
          <circle cx={1650} cy={158} r={82} fill="#122544" opacity={0.3} />
          <circle cx={1650} cy={158} r={55} fill="#b6c5d7" opacity={0.35 * sceneReveal} />
        </g>

        {/* Sol/piste/architecture — couche PROCHE de la parallaxe, bouge plus (opacité en filigrane au climax) */}
        <g transform={`translate(${groundParallax} 0)`} opacity={climaxFilterOpacity}>
          <rect x={-40} y={698} width={1960} height={382} fill="url(#ground_grad)" />
          <rect x={-40} y={696} width={1960} height={3} fill="#3a5580" opacity={0.4} />
          <ellipse cx={445} cy={705} rx={250} ry={22} fill="url(#warm_pool)" opacity={0.6} />

          <polygon points="260,1080 1420,1080 1150,712 1010,712" fill="url(#runway_grad)" />
          <path d="M260 1080 L1010 712" stroke="#46608c" strokeWidth={3} opacity={0.5} fill="none" />
          <path d="M1420 1080 L1150 712" stroke="#46608c" strokeWidth={3} opacity={0.5} fill="none" />
          {["350,1080 402,1080 487,1030 441,1030", "478,1080 530,1080 599,1030 553,1030", "605,1080 657,1080 712,1030 666,1030",
            "733,1080 785,1080 824,1030 778,1030", "895,1080 947,1080 967,1030 921,1030", "1023,1080 1075,1080 1079,1030 1033,1030",
            "1150,1080 1202,1080 1192,1030 1146,1030", "1278,1080 1330,1080 1304,1030 1258,1030"].map((pts, i) => (
            <polygon key={`piano-${i}`} points={pts} fill="#b9c6da" opacity={0.7} />
          ))}

          <polygon points="96,518 184,518 380,1040 20,1040" fill="url(#cone_grad)" opacity={1 - darkenOverlay} />
          <polygon points="128,1040 152,1040 146,520 134,520" fill="#0d1a36" />
          <rect x={92} y={510} width={96} height={10} fill="#12224a" />
          {[96, 118, 146, 168].map((x, i) => <rect key={`pyl-${i}`} x={x} y={498} width={16} height={12} fill="#1a2c50" />)}
          <g opacity={tourStaccado}>
            {[104, 126, 154, 176].map((cx, i) => <ellipse key={`pylglow-${i}`} cx={cx} cy={512} rx={10} ry={5} fill="#ffe4a8" opacity={0.9} />)}
          </g>
          <ellipse cx={200} cy={1036} rx={230} ry={32} fill="#ffd98a" opacity={0.12 * (1 - darkenOverlay)} />

          <rect x={150} y={596} width={490} height={104} fill="#101d3a" />
          <rect x={140} y={586} width={510} height={12} fill="#1a2c50" />
          <rect x={200} y={572} width={40} height={14} fill="#0e1b38" />
          <rect x={560} y={574} width={30} height={12} fill="#0e1b38" />
          <rect x={289} y={630} width={26} height={34} fill="#6b512f" />
          <rect x={479} y={630} width={26} height={34} fill="#6b512f" />
          {FENETRES_TERMINAL.map((f, i) => {
            const op = terminalOpacity(i);
            if (op <= 0.01) return null;
            return <rect key={`fen-${i}`} x={f.x} y={f.y} width={26} height={34} fill="#ffc46b" opacity={op} />;
          })}
          <rect x={388} y={672} width={4} height={28} fill="#1a2c50" />
          <rect x={488} y={672} width={4} height={28} fill="#1a2c50" />
          <rect x={380} y={662} width={120} height={10} fill="#24385e" />
          <rect x={405} y={674} width={70} height={26} fill="#ffd98a" opacity={0.9 * terminalOpacity(FENETRES_TERMINAL.length - 1)} />

          <polygon points="858,700 902,700 894,420 866,420" fill="#0e1b38" />
          <polygon points="866,420 894,420 912,392 848,392" fill="#142648" />
          <rect x={838} y={392} width={84} height={5} fill="#1d3156" />
          <path d="M866 392 L862 340" stroke="#7a5a30" strokeWidth={3} />
          <path d="M880 392 L880 340" stroke="#7a5a30" strokeWidth={3} />
          <path d="M894 392 L898 340" stroke="#7a5a30" strokeWidth={3} />
          <polygon points="836,340 924,340 916,326 844,326" fill="#16294c" />
          <rect x={878} y={266} width={4} height={60} fill="#2a4068" />
          <g opacity={tourStaccado}>
            <ellipse cx={880} cy={366} rx={95} ry={50} fill="url(#cab_halo)" />
            <polygon points="852,392 908,392 924,340 836,340" fill="url(#cab_glass)" />
            <rect x={873} y={634} width={12} height={16} fill="#ffca70" opacity={0.85} />
            <rect x={873} y={556} width={12} height={16} fill="#ffca70" opacity={0.85} />
          </g>
          <circle cx={880} cy={262} r={13} fill="#ff5a4d" opacity={0.3 * beaconOpacity} />
          <circle cx={880} cy={262} r={5} fill="#ff5a4d" opacity={beaconOpacity} />

          {FEUX_AMBRE.map((f, i) => {
            const pairIdx = Math.floor(i / 2);
            const op = feuOpacity(pairIdx, i * 1.3);
            if (op <= 0.01) return null;
            return (
              <g key={`amb-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={f.rHalo} fill="url(#light_glow)" />
                <circle cx={f.cx} cy={f.cy} r={f.rPoint} fill="#ffdf9e" />
              </g>
            );
          })}
          {FEUX_VERTS.map((f, i) => {
            const op = feuOpacity(Math.floor((i / FEUX_VERTS.length) * nFeux), i * 2.1);
            if (op <= 0.01) return null;
            return (
              <g key={`grn-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={16} fill="url(#green_glow)" />
                <circle cx={f.cx} cy={f.cy} r={6} fill="#7de08a" />
              </g>
            );
          })}
          {FEUX_BLEUS.map((f, i) => {
            const op = feuOpacity(nFeux - 1, i * 0.9);
            if (op <= 0.01) return null;
            return (
              <g key={`blu-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={14} fill="url(#blue_glow)" />
                <circle cx={f.cx} cy={f.cy} r={5} fill="#8fd0ff" />
              </g>
            );
          })}

          <ellipse cx={1660} cy={1012} rx={42} ry={10} fill="#0c1834" />
          <rect x={1656} y={768} width={8} height={244} fill="#33517e" />
          <circle cx={1660} cy={768} r={7} fill="none" stroke="#46648c" strokeWidth={3} />
          <g transform={`rotate(${vaneAngle} 1660 768)`} opacity={1 - darkenOverlay * 0.6}>
            <circle cx={1660} cy={744} r={12} fill="url(#light_glow)" />
            <circle cx={1660} cy={744} r={4} fill="#ffd98a" />
            <polygon points="1652,750 1652,786 1621,786 1621,754" fill="#E05206" />
            <polygon points="1621,754 1621,786 1590,786 1590,759" fill="#FFFFFF" />
            <circle cx={1605} cy={770} r={7} fill="#E05206" />
            <polygon points="1590,759 1590,786 1559,786 1559,763" fill="#0DB02B" />
            <polygon points="1559,763 1559,786 1528,786 1528,768" fill="#0DB02B" />
          </g>
        </g>

        <rect width={1920} height={1080} fill="#050b20" opacity={darkenOverlay} />
        {frame >= B.trenteCinqStart && <OndeDeChoc frame={frame} startFrame={B.trenteCinqStart} />}
      </svg>

      {dateOpacity > 0.01 && (
        <div style={{
          position: "absolute", top: 60, left: 80, opacity: dateOpacity,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: "#8fa0bb", letterSpacing: "0.1em",
        }}>
          25.06.2026 — NIAMEY
        </div>
      )}

      {frame >= B.trenteCinqStart && (
        <div style={{ opacity: chiffreOut }}>
          <ChiffreClimax frame={frame} startFrame={B.trenteCinqStart} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export default GazoducActe3InsertSecurite;

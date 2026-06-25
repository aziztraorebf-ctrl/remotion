/**
 * CfaMidformTest — TEST format SVG mid-form 16:9, VRAIE ANIMATION (R&D 2026-06-25, v2).
 *
 * v1 = proof-of-concept (apparitions fade). v2 = vraie animation :
 *  - tracage stroke-dashoffset (les traits se DESSINENT),
 *  - colorisation TIMEE de l'encre (le trait noir se remplit de couleur semantique — doctrine),
 *  - flux qui COULE (particules le long des fleches), cadenas qui CLAQUE, mains qui comptent, question qui s'impose.
 * Voix TTS reelle GeoAfrique (public/_rnd/cfa-midform/voix.mp3, 41.6s) — timings cales sur Whisper.
 * SFX REUTILISES (public/_shared/sfx/). Plan : memory/episodes/_rnd/PLAN-ANIMATION-CFA-MIDFORM.md
 *
 * Frontieres (30fps) : B1 0-441 (blueprint) · B2 441-795 (encre) · B3 795-1248 (flux). Total ~1275f.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from "remotion";
import * as M from "./cfaMecaGroups";
import * as A from "./cfaMarcheGroups";
import * as F from "./cfaFluxGroups";

const FPS = 30;
const B1 = 0, B1_END = 441;
const B2 = 441, B2_END = 795;
const B3 = 795, B3_END = 1248;
const XF = 16;

const Grp: React.FC<{ body: string; transform?: string; opacity?: number; style?: React.CSSProperties }> = ({
  body, transform, opacity, style,
}) => <g transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />;

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// tracage : retourne le style dashoffset pour "dessiner" un trait (dash grand couvrant la longueur)
const draw = (f: number, start: number, dur: number, dash = 1600): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

// ============ BEAT 1 — BLUEPRINT : le mecanisme se MONTE ============
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // grille se trace 6-30 ; 14 hexagones s'allument un par un 30-90
  const cartouche = clampI(f, 0, 16);
  const grid = clampI(f, 6, 30) * 0.45;
  // zone : on revele par un clip horizontal qui s'etend (les cellules apparaissent g->d)
  const zoneReveal = clampI(f, 30, 95);
  const monnaie = spring({ frame: f - 100, fps, config: { damping: 12, stiffness: 110 }, durationInFrames: 26 });
  const monnaieOp = clampI(f, 100, 116);
  const monnaieGlow = f > 116 ? 0.9 + 0.1 * Math.sin(f / 12) : 1;
  const euroOp = clampI(f, 130, 150);
  // lien parite se trace 150-185, cadenas claque a 185
  const verrou = spring({ frame: f - 185, fps, config: { damping: 9, stiffness: 200 }, durationInFrames: 18 });
  const verrouScale = 1 + 0.25 * (1 - verrou) * (f >= 185 ? 1 : 0);
  const tauxOp = clampI(f, 195, 215);
  // depot se trace 230-300 vers le compte
  const compteOp = clampI(f, 300, 320);
  const compteGlow = f > 320 ? 0.88 + 0.12 * Math.sin(f / 15) : 1;
  const cotes = clampI(f, 320, 350);
  const etiq = clampI(f, 60, 340);
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <Grp body={M.CFA1_FRAME_CARTOUCHE} opacity={cartouche} />
      <Grp body={M.CFA1_GRID_FOND} opacity={grid} />
      {/* zone : clip qui s'etend g->d (les 14 cellules se revelent une a une) */}
      <g style={{ clipPath: `inset(0 ${(1 - zoneReveal) * 100}% 0 0)` }}>
        <Grp body={M.CFA1_ZONE_CFA} />
      </g>
      {f >= 100 && (
        <Grp body={M.CFA1_MONNAIE} opacity={monnaieOp * monnaieGlow}
          transform={`scale(${0.6 + 0.4 * monnaie})`} style={{ transformOrigin: "center" }} />
      )}
      <Grp body={M.CFA1_EURO} opacity={euroOp} />
      {/* lien de parite : se trace puis le verrou claque */}
      {f >= 150 && (
        <>
          <Grp body={M.CFA1_PARITE} style={draw(f, 150, 35, 700)} />
          <g transform={`scale(1 ${verrouScale})`} style={{ transformOrigin: "960px 500px" }} opacity={clampI(f, 180, 195)} />
        </>
      )}
      <Grp body={M.CFA1_PARITE} opacity={f >= 185 ? clampI(f, 185, 200) : 0} />{/* parite pleine apres trace */}
      {/* depot se trace vers le compte */}
      {f >= 230 && <Grp body={M.CFA1_FLUX_DEPOT} style={draw(f, 230, 70, 1500)} />}
      <Grp body={M.CFA1_COMPTE} opacity={compteOp * compteGlow} />
      <Grp body={M.CFA1_COTES} opacity={cotes} />
      <Grp body={M.CFA1_ETIQUETTES} opacity={etiq} />
    </svg>
  );
};

// ============ BEAT 2 — ENCRE : le trait se DESSINE, puis la COULEUR se remplit (timee) ============
const Beat2: React.FC = () => {
  const f = useCurrentFrame(); // local (Sequence)
  const { fps } = useVideoConfig();
  // 1) etal se trace 4-60 ; 2) produits (trait) se dessinent 50-130 ; 3) COULEUR se remplit 120-200 (id="couleurs")
  const etalDraw = draw(f, 4, 56, 2400);
  const ambiance = clampI(f, 10, 50) * 0.7;
  const tomatesDraw = clampI(f, 50, 90);
  const rizDraw = clampI(f, 75, 115);
  const balanceDraw = clampI(f, 100, 130);
  const balanceOsc = Math.sin(f / 22) * 1.2;
  // ⭐ COLORISATION TIMEE : le groupe "couleurs" (formes pleines) monte en opacite => l'encre se REMPLIT
  const colorise = clampI(f, 120, 195) * 0.9;
  // mains comptent : billet passe main->main 150-215
  const mainG = clampI(f, 140, 165);
  const mainD = clampI(f, 155, 180);
  const billetPass = clampI(f, 170, 220);
  const billetOp = clampI(f, 170, 190);
  const breath = 1 + 0.005 * Math.sin(f / 45);
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <Grp body={A.CFA2_SCENE} />
      <Grp body={A.CFA2_CADRE} opacity={clampI(f, 0, 14)} />
      <Grp body={A.CFA2_AMBIANCE} opacity={ambiance} />
      <g transform={`scale(${breath})`} style={{ transformOrigin: "960px 540px" }}>
        {/* COULEURS (formes pleines) DESSOUS le trait — se remplit progressivement */}
        <Grp body={A.CFA2_COULEURS} opacity={colorise} />
        {/* structure + produits AU TRAIT, par-dessus la couleur */}
        <Grp body={A.CFA2_ETAL} style={etalDraw} />
        <Grp body={A.CFA2_PRODUITS_TOMATES} opacity={tomatesDraw} />
        <Grp body={A.CFA2_PRODUITS_RIZ} opacity={rizDraw} />
        <Grp body={A.CFA2_PRODUITS_BALANCE} opacity={balanceDraw} transform={`rotate(${balanceOsc} 1430 560)`} />
        {/* mains + billet qui passe (geste de comptage) */}
        <Grp body={A.CFA2_ECHANGE_MAIN_GAUCHE} opacity={mainG} transform={`translate(${14 * (1 - billetPass)} 0)`} />
        <Grp body={A.CFA2_ECHANGE_MAIN_DROITE} opacity={mainD} transform={`translate(${-14 * (1 - billetPass)} 0)`} />
        <Grp body={A.CFA2_BILLET} opacity={billetOp} transform={`translate(${-40 + 80 * billetPass} ${-6 * Math.sin(Math.PI * billetPass)})`} />
      </g>
    </svg>
  );
};

// ============ BEAT 3 — FLUX : la richesse COULE dehors ============
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grid = clampI(f, 6, 24) * 0.45;
  const zoneDraw = draw(f, 10, 40, 900);
  const zoneOp = clampI(f, 10, 30);
  // point de richesse pulse 40-70
  const pointPulse = 0.5 + 0.5 * Math.sin(f / 6);
  // fleches se tracent 55-115 PUIS flux continu (particules) qui defile
  const fluxDraw = draw(f, 55, 60, 1800);
  const fluxOn = f >= 55;
  const fluxFlow = f > 115; // flux continu apres trace
  const decisionOp = clampI(f, 120, 145);
  const decGlow = f > 145 ? 0.88 + 0.12 * Math.sin(f / 16) : 1;
  const etiq = clampI(f, 95, 150);
  // particules qui coulent le long des fleches (3 fleches, particules decalees)
  const particles = fluxFlow ? Array.from({ length: 9 }).map((_, i) => {
    const lane = i % 3;
    const phase = ((f * 0.9 + i * 30) % 90) / 90;
    const y = [430, 540, 650][lane];
    const x = 560 + phase * 980;
    const op = Math.sin(Math.PI * phase) * 0.8;
    return <circle key={i} cx={x} cy={y + (lane - 1) * 18 * Math.sin(phase * Math.PI)} r={5} fill="#ff7a45" opacity={op} />;
  }) : null;
  // question s'impose 175-215 + soulignement qui se trace
  const qS = spring({ frame: f - 175, fps, config: { damping: 16, stiffness: 80 }, durationInFrames: 30 });
  const qOp = clampI(f, 175, 205);
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <Grp body={F.CFA3_RACINE} />
      <Grp body={F.CFA3_GRILLE} opacity={grid} />
      <Grp body={F.CFA3_CADRE} opacity={clampI(f, 0, 16)} />
      <g style={{ clipPath: undefined }}><Grp body={F.CFA3_ZONE} opacity={zoneOp} style={zoneDraw} /></g>
      {f >= 40 && f < 60 && <circle cx="300" cy="540" r={10 + 8 * pointPulse} fill="#c8a951" opacity={pointPulse} />}
      {fluxOn && <Grp body={F.CFA3_FLUX_RICHESSE} style={fluxDraw} />}
      {particles}
      <Grp body={F.CFA3_DECISION} opacity={decisionOp * decGlow} />
      <Grp body={F.CFA3_ETIQUETTES} opacity={etiq} />
      <g opacity={qOp} transform={`scale(${0.95 + 0.05 * qS})`} style={{ transformOrigin: "960px 770px" }}>
        <Grp body={F.CFA3_QUESTION} />
      </g>
    </svg>
  );
};

// ============ SOUS-TITRES (cales sur Whisper) ============
const SUBS: { t: string; from: number; to: number }[] = [
  { t: "14 pays africains partagent une meme monnaie : le franc CFA.", from: 0, to: 4.3 },
  { t: "Sa regle centrale : une parite fixe avec l'euro, garantie par Paris.", from: 4.3, to: 9.2 },
  { t: "Ces pays placaient une partie de leurs reserves sur un compte, a Paris.", from: 9.2, to: 14.6 },
  { t: "Sur un marche de Dakar, ca ne se voit pas. On compte ses billets.", from: 14.7, to: 20.2 },
  { t: "Une monnaie stable, previsible : le CFA protege de l'inflation, dit-on.", from: 20.2, to: 26.5 },
  { t: "Mais suivez l'argent. Cette stabilite a un prix.", from: 26.5, to: 33.5 },
  { t: "La richesse circule vers l'exterieur. La decision se prend ailleurs.", from: 33.5, to: 39.3 },
  { t: "A qui appartient une monnaie ?", from: 39.3, to: 41.6 },
];
const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / FPS;
  const cur = SUBS.find((x) => s >= x.from && s < x.to);
  if (!cur) return null;
  const op = interpolate(s, [cur.from, cur.from + 0.25, cur.to - 0.25, cur.to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center", opacity: op }}>
      <span style={{
        display: "inline-block", maxWidth: 1380, padding: "13px 30px",
        background: "rgba(8,12,22,0.74)", color: "#f2efe6",
        fontFamily: "Georgia, serif", fontSize: 38, lineHeight: 1.25, borderRadius: 6,
      }}>{cur.t}</span>
    </div>
  );
};

const FadeWrap: React.FC<{ outAt: number; children: React.ReactNode }> = ({ outAt, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, XF, outAt - XF, outAt], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// ============ ASSEMBLAGE ============
export const CfaMidformTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#0b1526" }}>
    {/* nappe + voix */}
    <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.16} loop />
    <Audio src={staticFile("_rnd/cfa-midform/voix.mp3")} volume={1} />

    {/* ---- SFX timés (reutilises) ---- */}
    <Sequence from={30} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.4} /></Sequence>
    <Sequence from={100} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.45} /></Sequence>
    <Sequence from={185} durationInFrames={20}><Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.5} /></Sequence>
    <Sequence from={230} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.42} /></Sequence>
    {/* beat 2 : encre + vie */}
    <Sequence from={B2 + 4} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.45} /></Sequence>
    <Sequence from={B2} durationInFrames={B2_END - B2}><Audio src={staticFile("_shared/sfx/nature/birds-ambient.mp3")} volume={0.12} loop /></Sequence>
    <Sequence from={B2 + 165} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/blip-bubble.mp3")} volume={0.35} /></Sequence>
    {/* beat 3 : flux qui s'ecoule + punch */}
    <Sequence from={B3 + 55} durationInFrames={120}><Audio src={staticFile("_shared/sfx/sfx-cost-recovery-drain.mp3")} volume={0.4} /></Sequence>
    <Sequence from={B3 + 175} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/liptako-gong.mp3")} volume={0.5} /></Sequence>

    {/* ---- VISUEL ---- */}
    <Sequence from={B1} durationInFrames={B1_END - B1 + XF}>
      <FadeWrap outAt={B1_END - B1}><AbsoluteFill style={{ background: "#0d1b3a" }}><Beat1 /></AbsoluteFill></FadeWrap>
    </Sequence>
    <Sequence from={B2 - XF} durationInFrames={B2_END - B2 + 2 * XF}>
      <FadeWrap outAt={B2_END - B2 + XF}><AbsoluteFill style={{ background: "#e8dcc0" }}><Beat2 /></AbsoluteFill></FadeWrap>
    </Sequence>
    <Sequence from={B3 - XF} durationInFrames={B3_END - B3 + 2 * XF}>
      <FadeWrap outAt={B3_END - B3 + XF}><AbsoluteFill style={{ background: "#0b1526" }}><Beat3 /></AbsoluteFill></FadeWrap>
    </Sequence>
    <Subtitle />
  </AbsoluteFill>
);

export default CfaMidformTest;

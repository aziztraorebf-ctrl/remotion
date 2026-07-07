/**
 * OrDarfourHook — HOOK d'ouverture du mid-form Soudan. Reskin PARCHEMIN/ENCRE de HeroGptAnimee
 * (l'or du Darfour : pelle + lingot + fumee de guerre + terre qui rougit), + une CONTINUATION
 * "l'or qui part" qui pose le fil rouge de l'episode (ou va cet or ? -> Acte 3, EAU/Dubai).
 *
 * Decisions Aziz (2026-07-07) :
 *  - Registre reskin parchemin/encre via remap couleur (orDarfourGroups.ts), ZERO nouvel appel LLM.
 *  - Garder des ACCENTS colores sur les elements hero : soleil qui brille + l'or + le sang.
 *  - Doctrine 3-4 objets hero + regle objet inerte (le lingot ne glisse pas, il FADE sur place).
 *  - La continuation est proposee sur render (pas trahie a l'aveugle) : ici = "l'or qui part".
 *
 * Structure temporelle (30fps) :
 *   PARTIE 1 — L'OR (f0-460, repris de Hero) : pelle plantee -> lingot tombe/brille -> lueur de
 *     guerre -> terre rouge sang -> ciel noircit.
 *   PARTIE 2 — LA CONTINUATION (f460-620) : le lingot restant s'illumine une derniere fois puis
 *     une TRAINEE D'OR quitte le cadre vers la droite (hors Darfour) = "cet or s'en va" ; un
 *     cartouche grave "OU VA CET OR ?" apparait bref -> transition vers la carte (au montage).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from "remotion";
import {
  H_FOND, H_CIEL, H_NUAGES, H_TERRE, H_OMBRE_LINGOT,
  H_PELLE, H_LINGOT_OR, H_LINGOT_MOBILE, H_VIGNETTE,
} from "./orDarfourGroups";

export const OR_DARFOUR_HOOK_FRAMES = 620;
export const OR_DARFOUR_HOOK_FPS = 30;

const SABLE = "#d9c092";
const TERRE = "#9a8763";
const ENCRE = "#2b2117";
const OR = "#e7bd78";
const OR_CLAIR = "#f2d491";
const SANG = "#8a2a20";

const Grp: React.FC<{ body: string; transform?: string; opacity?: number }> = ({ body, transform, opacity }) => (
  <g transform={transform} opacity={opacity} dangerouslySetInnerHTML={{ __html: body }} />
);

export const OrDarfourHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- COUCHE DE FOND ----------
  const driftScale = interpolate(f, [0, 560], [1.0, 1.05]);
  const driftX = Math.sin(f / 100) * 7;
  const cloudSpan = 760;
  const cloudShift = -((f * 0.95) % cloudSpan);

  // ---------- FUMEE DE GUERRE (reprise Hero) ----------
  const smokeOn = interpolate(f, [180, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const smokeReach = interpolate(f, [200, 320], [240, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const SMOKE_BASE = { x: 1430, y: 700 };
  const puffs = Array.from({ length: 18 }, (_, i) => {
    const cycle = ((f / 110) + i / 18) % 1;
    const rise = cycle * smokeReach;
    const sway = Math.sin(cycle * Math.PI * 2 + i) * (14 + cycle * 40);
    const r = 16 + cycle * 64;
    const op = Math.sin(Math.max(0.001, cycle) * Math.PI) * 0.92 * smokeOn;
    return { cx: SMOKE_BASE.x + sway, cy: SMOKE_BASE.y - rise, r, op };
  });
  const skyBlacken = interpolate(f, [270, 430], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- EVENEMENTS PARTIE 1 (reprise Hero) ----------
  const dropSpring = (startF: number) =>
    spring({ frame: f - startF, fps, config: { mass: 1.0, damping: 12, stiffness: 90 }, durationInFrames: 34 });

  const pelleDrop = dropSpring(10);
  const pelleVisible = f >= 10;
  const pelleY = interpolate(pelleDrop, [0, 1], [-240, 0]);
  const pelleLandF = 26;
  const plantDust = interpolate(f, [pelleLandF, pelleLandF + 8, pelleLandF + 20], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lingotDrop = dropSpring(70);
  const lingotVisible = f >= 70;
  const lingotDY = interpolate(lingotDrop, [0, 1], [-300, 0]);
  const lingotLandF = 86;
  const lingotSquash = 1 - Math.max(0, interpolate(f, [lingotLandF, lingotLandF + 5, lingotLandF + 13], [0, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lingotDust = interpolate(f, [lingotLandF, lingotLandF + 8, lingotLandF + 22], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reflTravel = interpolate(f, [104, 158], [700, 1280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reflOn = interpolate(f, [104, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(f, [148, 164], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // le gros lingot reste PLEIN pendant toute la continuation (il porte le sens : c'est SON or qui
  // s'echappe en trainee) ; il ne s'estompe qu'a la toute fin, juste avant la coupe vers la carte.
  const lingotFadeOut = interpolate(f, [592, 618], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lingotGlow = (lingotVisible ? 1 : 0) * lingotFadeOut * (0.9 + 0.1 * (Math.sin(f / 17) + 1) / 2);

  const mobileDrop = dropSpring(120);
  const mobileVisible = f >= 120;
  const mobileDY = interpolate(mobileDrop, [0, 1], [-280, 0]);

  const bloodTerre = interpolate(f, [210, 300], [0, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bloodCiel = interpolate(f, [210, 300], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // le petit lingot part le premier (fade pur sur place, objet inerte)
  const mobileFade = interpolate(f, [430, 480], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- PARTIE 2 — CONTINUATION "l'or qui part" (f460-620) ----------
  // une pulsation de l'or (le lingot brille fort une derniere fois avant de "s'envoler")
  const departPulse = interpolate(f, [470, 500, 540], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // TRAINEE D'OR : des particules d'or qui quittent le lingot vers la DROITE (hors Darfour). C'est le
  // seul mouvement autorise ici = un flux (pas l'objet inerte qui glisse, mais des etincelles/poussiere d'or).
  const trailOn = interpolate(f, [500, 530], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(f, [590, 615], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldTrail = Array.from({ length: 14 }, (_, i) => {
    const cycle = ((f / 60) + i / 14) % 1;               // 0 (au lingot) -> 1 (sorti a droite)
    const startX = 1080, startY = 640;
    const x = startX + cycle * 900;                       // file vers la droite, hors cadre
    const yWave = Math.sin(cycle * Math.PI * 2 + i) * 26;
    const y = startY - cycle * 70 + yWave;               // s'eleve legerement en partant
    const r = 7 * (1 - cycle * 0.5);
    const op = Math.sin(Math.max(0.001, cycle) * Math.PI) * trailOn;
    return { x, y, r, op };
  });
  // cartouche grave "OU VA CET OR ?" (pose la question -> repondue Acte 3). Apparait puis tient.
  const cartoucheOn = interpolate(f, [536, 560], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      {/* ===== AUDIO ===== */}
      <Sequence from={0} durationInFrames={620}>
        <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.34} loop />
      </Sequence>
      <Sequence from={30} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.55} /></Sequence>
      <Sequence from={86} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.52} /></Sequence>
      <Sequence from={90} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.50} /></Sequence>
      <Sequence from={134} durationInFrames={20}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.46} /></Sequence>
      <Sequence from={180} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} /></Sequence>
      <Sequence from={270} durationInFrames={50}><Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.5} /></Sequence>
      {/* l'or qui part (continuation) */}
      <Sequence from={500} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.5} /></Sequence>

      {/* ===== IMAGE ===== */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="lingotClipHook"><rect x="730" y="535" width="500" height="235" /></clipPath>
          <linearGradient id="skyBlackGradHook" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0805" stopOpacity="1" />
            <stop offset="55%" stopColor="#1a130c" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2a1a0d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`translate(${driftX} 0) scale(${driftScale}) translate(${(1 - driftScale) * 960} ${(1 - driftScale) * 540})`}>

          <Grp body={H_FOND} />
          <Grp body={H_CIEL} />
          <rect x="0" y="0" width="1920" height="760" fill={SANG} opacity={bloodCiel} style={{ mixBlendMode: "multiply" }} />

          <g>
            <Grp body={H_NUAGES} transform={`translate(${cloudShift} 0)`} />
            <Grp body={H_NUAGES} transform={`translate(${cloudShift + cloudSpan} 0)`} />
            <Grp body={H_NUAGES} transform={`translate(${cloudShift + cloudSpan * 2} 0)`} />
          </g>

          {smokeOn > 0.02 && (
            <g>
              <ellipse cx={SMOKE_BASE.x} cy={SMOKE_BASE.y + 6} rx={70} ry={20} fill="#a5341f" opacity={0.5 * smokeOn} />
              <ellipse cx={SMOKE_BASE.x} cy={SMOKE_BASE.y} rx={42} ry={14} fill="#d6552e" opacity={0.55 * smokeOn} />
              {puffs.slice().reverse().map((p, i) => (
                <g key={i}>
                  <circle cx={p.cx} cy={p.cy} r={p.r} fill="#2e241a" opacity={p.op * 0.85} />
                  <circle cx={p.cx - p.r * 0.3} cy={p.cy - p.r * 0.15} r={p.r * 0.7} fill="#463830" opacity={p.op * 0.7} />
                  <circle cx={p.cx + p.r * 0.25} cy={p.cy + p.r * 0.1} r={p.r * 0.55} fill="#211a12" opacity={p.op * 0.6} />
                </g>
              ))}
            </g>
          )}

          {skyBlacken > 0.01 && (
            <rect x="0" y="0" width="1920" height="640" fill="url(#skyBlackGradHook)" opacity={skyBlacken} />
          )}

          <Grp body={H_TERRE} />
          <rect x="0" y="600" width="1920" height="480" fill={SANG} opacity={bloodTerre} style={{ mixBlendMode: "multiply" }} />

          <Grp body={H_OMBRE_LINGOT} />

          {pelleVisible && <Grp body={H_PELLE} transform={`translate(0 ${pelleY})`} />}
          {plantDust > 0.02 && (
            <g opacity={plantDust}>
              <ellipse cx="603" cy="700" rx={40 + (1 - plantDust) * 30} ry="9" fill={TERRE} opacity="0.6" />
              <ellipse cx="560" cy="694" rx="14" ry="7" fill="#7d6b4a" opacity="0.5" />
              <ellipse cx="648" cy="696" rx="14" ry="7" fill="#7d6b4a" opacity="0.5" />
            </g>
          )}

          {lingotDust > 0.02 && (
            <g opacity={lingotDust}><ellipse cx="990" cy="700" rx={70 + (1 - lingotDust) * 40} ry="11" fill="#7d6b4a" opacity="0.55" /></g>
          )}

          {/* halo de depart : l'or pulse fort avant de "s'en aller" (continuation) */}
          {departPulse > 0.01 && (
            <ellipse cx="985" cy="640" rx={220 * departPulse} ry={70 * departPulse} fill={OR_CLAIR} opacity={0.22 * departPulse} />
          )}

          {lingotVisible && (
            <g opacity={lingotGlow} transform={`translate(0 ${lingotDY}) translate(0 ${986 * (1 - lingotSquash)}) scale(1 ${lingotSquash})`}>
              <Grp body={H_LINGOT_OR} />
            </g>
          )}
          {reflOn > 0.02 && (
            <g clipPath="url(#lingotClipHook)">
              <rect x={reflTravel} y="500" width="60" height="300" fill="#ffffff" opacity={0.5 * reflOn} transform="skewX(-22)" style={{ mixBlendMode: "screen" }} />
            </g>
          )}

          {mobileVisible && (
            <Grp body={H_LINGOT_MOBILE} transform={`translate(0 ${mobileDY})`} opacity={mobileFade} />
          )}

          {/* CONTINUATION : trainee d'or qui file vers la droite (hors Darfour) = "cet or s'en va" */}
          {trailOn > 0.01 && (
            <g>
              {goldTrail.map((g, i) => (
                <g key={i}>
                  <circle cx={g.x} cy={g.y} r={g.r} fill={OR_CLAIR} opacity={g.op} />
                  <circle cx={g.x} cy={g.y} r={g.r * 2.1} fill={OR} opacity={g.op * 0.3} />
                </g>
              ))}
            </g>
          )}

          {/* cartouche grave "OU VA CET OR ?" (question posee -> Acte 3). Place BAS (bandeau sous-titre,
              convention war-map) pour ne pas heurter la pelle ni le soleil. */}
          {cartoucheOn > 0.01 && (
            <g opacity={cartoucheOn}>
              <rect x="560" y="958" width="800" height="70" fill="#2a120e" rx="4" />
              <rect x="566" y="964" width="788" height="58" fill="none" stroke={SANG} strokeWidth="1.5" rx="2" />
              <text x="960" y="1002" textAnchor="middle" fill="#f5e6ce" fontFamily="Georgia, 'Times New Roman', serif" fontSize="30" fontStyle="italic" letterSpacing="1.5">Ou va cet or ?</text>
            </g>
          )}

          <Grp body={H_VIGNETTE} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default OrDarfourHook;

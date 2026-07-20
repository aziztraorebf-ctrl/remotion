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
  hookPelle, H_LINGOT_OR, H_LINGOT_MOBILE, H_VIGNETTE,
} from "./orDarfourGroups";

export const OR_DARFOUR_HOOK_FRAMES = 700; // VO GéoAfrique = 690f + petite queue
export const OR_DARFOUR_HOOK_FPS = 30;

// ── DÉCLENCHEURS SYNCHRO VOIX (whisper-align sur hook-or-darfour.mp3, 30fps) ──
// "Darfour" @4.40s=f132 · 1re "guerre" @12.26s=f368 · "meurtrière" @12.64s=f379 ·
// "Suivez L'OR" @21.92s=f658 · fin @22.9s=f686. La colorisation/apparition suit CES mots.
const VO_DARFOUR = 132;   // la pelle-drapeau se plante ICI (le pays entre en scène)
const VO_GUERRE = 368;    // la fumée monte + la terre vire au sang ICI
const VO_SUIVEZ_OR = 658; // la traînée d'or se dégage et file hors cadre ICI

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
  const driftScale = interpolate(f, [0, 690], [1.0, 1.05]);
  const driftX = Math.sin(f / 100) * 7;
  const cloudSpan = 760;
  const cloudShift = -((f * 0.95) % cloudSpan);

  // ---------- FUMEE DE GUERRE (reprise Hero) — calée sur le mot "guerre" (VO_GUERRE) ----------
  const smokeOn = interpolate(f, [VO_GUERRE - 18, VO_GUERRE + 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const smokeReach = interpolate(f, [VO_GUERRE - 2, VO_GUERRE + 118], [240, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const SMOKE_BASE = { x: 1430, y: 700 };
  const puffs = Array.from({ length: 18 }, (_, i) => {
    const cycle = ((f / 110) + i / 18) % 1;
    const rise = cycle * smokeReach;
    const sway = Math.sin(cycle * Math.PI * 2 + i) * (14 + cycle * 40);
    const r = 16 + cycle * 64;
    const op = Math.sin(Math.max(0.001, cycle) * Math.PI) * 0.92 * smokeOn;
    return { cx: SMOKE_BASE.x + sway, cy: SMOKE_BASE.y - rise, r, op };
  });
  const skyBlacken = interpolate(f, [VO_GUERRE + 40, VO_GUERRE + 200], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- EVENEMENTS PARTIE 1 (reprise Hero) ----------
  const dropSpring = (startF: number) =>
    spring({ frame: f - startF, fps, config: { mass: 1.0, damping: 12, stiffness: 90 }, durationInFrames: 34 });

  // la pelle-DRAPEAU se plante au mot "Darfour" (elle atterrit ~26f après le start du spring)
  const PELLE_START = VO_DARFOUR - 26; // 106 -> atterrissage f132
  const pelleDrop = dropSpring(PELLE_START);
  const pelleVisible = f >= PELLE_START;
  const pelleY = interpolate(pelleDrop, [0, 1], [-240, 0]);
  const pelleLandF = VO_DARFOUR;
  const plantDust = interpolate(f, [pelleLandF, pelleLandF + 8, pelleLandF + 20], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // COLORISATION PROGRESSIVE de la pelle : noire à la chute, puis elle SE PEINT pendant la narration
  // du Darfour (~f150 -> f350, juste avant que la guerre s'enclenche à VO_GUERRE=368).
  //  - les 3 bandes du fer montent en fondu SIMULTANÉ (colorFer)
  //  - le manche vire au VERT EN DERNIER (colorManche), pour finir de "peindre le pays"
  const colorFer = interpolate(f, [pelleLandF + 18, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const colorManche = interpolate(f, [300, VO_GUERRE - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // LINGOT-OR : tombe COLORISÉ D'ENTRÉE sur "les métaux les plus convoités" (~f40-60). C'est l'accent
  // sémantique dominant (l'or) qui arrive AVANT tout le reste. Drop start f34 -> atterrit ~f60.
  const LINGOT_START = 34;
  const lingotDrop = dropSpring(LINGOT_START);
  const lingotVisible = f >= LINGOT_START;
  const lingotDY = interpolate(lingotDrop, [0, 1], [-300, 0]);
  const lingotLandF = LINGOT_START + 26; // ~60
  const lingotSquash = 1 - Math.max(0, interpolate(f, [lingotLandF, lingotLandF + 5, lingotLandF + 13], [0, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lingotDust = interpolate(f, [lingotLandF, lingotLandF + 8, lingotLandF + 22], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // reflet d'or qui balaie le lingot juste après l'atterrissage (l'éclat "convoité")
  const reflTravel = interpolate(f, [lingotLandF + 18, lingotLandF + 72], [700, 1280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reflOn = interpolate(f, [lingotLandF + 18, lingotLandF + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(f, [lingotLandF + 62, lingotLandF + 78], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // le gros lingot reste PLEIN jusqu'à la coupe finale vers la carte (c'est SON or qui s'échappe).
  const lingotFadeOut = interpolate(f, [686, 700], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lingotGlow = (lingotVisible ? 1 : 0) * lingotFadeOut * (0.9 + 0.1 * (Math.sin(f / 17) + 1) / 2);

  // petit lingot mobile : arrive un peu après le gros (avant la pelle), meuble la richesse extraite
  const mobileDrop = dropSpring(80);
  const mobileVisible = f >= 80;
  const mobileDY = interpolate(mobileDrop, [0, 1], [-280, 0]);

  // la terre / le ciel virent au SANG sur le mot "guerre" (VO_GUERRE)
  const bloodTerre = interpolate(f, [VO_GUERRE, VO_GUERRE + 90], [0, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bloodCiel = interpolate(f, [VO_GUERRE, VO_GUERRE + 90], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // le petit lingot s'efface (fade pur sur place, objet inerte) pendant "personne ne parle"
  const mobileFade = interpolate(f, [VO_GUERRE + 120, VO_GUERRE + 170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- PARTIE 2 — CONTINUATION "SUIVEZ L'OR" (calée sur VO_SUIVEZ_OR = f658) ----------
  // pulsation de l'or juste avant qu'il "s'envole" (le lingot brille fort une dernière fois)
  const departPulse = interpolate(f, [VO_SUIVEZ_OR - 24, VO_SUIVEZ_OR, VO_SUIVEZ_OR + 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // TRAÎNÉE D'OR : particules qui quittent le lingot vers la DROITE (hors Darfour) = "cet or s'en va".
  // Seul mouvement autorisé ici = un flux (pas l'objet inerte qui glisse).
  const trailOn = interpolate(f, [VO_SUIVEZ_OR - 6, VO_SUIVEZ_OR + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
  // cartouche gravé "OU VA CET OR ?" apparaît juste après "l'or" et tient jusqu'à la coupe.
  const cartoucheOn = interpolate(f, [VO_SUIVEZ_OR + 16, VO_SUIVEZ_OR + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------- MICRO-ANIMATIONS (dévitaliser la scène, jamais de glissement d'objet inerte) ----------
  // 1. HALO DU SOLEIL qui respire (dilatation-contraction lente autour du soleil du groupe H_CIEL)
  const sunPulse = 1 + 0.10 * Math.sin(f / 26);
  const sunGlowOp = 0.18 + 0.10 * (Math.sin(f / 26) + 1) / 2;
  // 2. SCINTILLEMENT DE L'OR : petits éclats qui glissent en boucle douce sur le gros lingot (respiration).
  // Déterministe (zéro Math.random). Actif tant que le lingot est plein.
  const sparkles = Array.from({ length: 4 }, (_, i) => {
    const cycle = ((f / 90) + i / 4) % 1;                 // boucle lente
    const x = 800 + cycle * 360;                          // glisse le long de la face sup du lingot
    const y = 600 - cycle * 34 + Math.sin(i * 2) * 6;
    const op = Math.sin(Math.max(0.001, cycle) * Math.PI) * 0.6 * lingotGlow;
    const r = 3.2 + Math.sin(f / 9 + i) * 0.9;
    return { x, y, r, op };
  });
  // 3. BRAISES / ÉTINCELLES orange qui montent au pied de la fumée (renforce le moment "guerre").
  // Suivent la fumée (SMOKE_BASE), synchro avec smokeOn.
  const embers = Array.from({ length: 9 }, (_, i) => {
    const cycle = ((f / 55) + i / 9) % 1;                 // 0 (au sol) -> 1 (monté + éteint)
    const ex = SMOKE_BASE.x - 30 + Math.sin(cycle * Math.PI * 2 + i) * 40;
    const ey = SMOKE_BASE.y - cycle * 210;
    const eop = Math.sin(Math.max(0.001, cycle) * Math.PI) * 0.75 * smokeOn;
    const er = 3.4 * (1 - cycle * 0.6);
    return { ex, ey, eop, er };
  });

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      {/* ===== AUDIO ===== */}
      {/* VOIX OFF (GéoAfrique V3) = la colonne vertébrale. Drone BANNI (doctrine SFX ponctuels). */}
      <Sequence from={0}><Audio src={staticFile("_shared/audio/soudan/hook-or-darfour.mp3")} volume={1} /></Sequence>
      {/* SFX ponctuels, calés sur les gestes (pas de nappe continue) */}
      <Sequence from={30} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} /></Sequence>
      {/* pelle-drapeau qui se plante au mot "Darfour" */}
      <Sequence from={VO_DARFOUR - 4} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.52} /></Sequence>
      <Sequence from={VO_DARFOUR} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.42} /></Sequence>
      {/* la guerre : boom sourd au mot "guerre" */}
      <Sequence from={VO_GUERRE - 8} durationInFrames={44}><Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.5} /></Sequence>
      {/* l'or qui file : whoosh sur "Suivez L'OR" */}
      <Sequence from={VO_SUIVEZ_OR} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.48} /></Sequence>

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
          {/* halo du soleil qui RESPIRE (micro-anim) — superposé sur le soleil du groupe H_CIEL */}
          <ellipse cx="1500" cy="196" rx={92 * sunPulse} ry={92 * sunPulse} fill={OR_CLAIR} opacity={sunGlowOp} />
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
              {/* braises orange qui montent au pied de la fumée (le moment "guerre") */}
              {embers.map((e, i) => (
                <circle key={`em${i}`} cx={e.ex} cy={e.ey} r={e.er} fill="#e6702a" opacity={e.eop} />
              ))}
            </g>
          )}

          {skyBlacken > 0.01 && (
            <rect x="0" y="0" width="1920" height="640" fill="url(#skyBlackGradHook)" opacity={skyBlacken} />
          )}

          <Grp body={H_TERRE} />
          <rect x="0" y="600" width="1920" height="480" fill={SANG} opacity={bloodTerre} style={{ mixBlendMode: "multiply" }} />

          <Grp body={H_OMBRE_LINGOT} />

          {pelleVisible && <Grp body={hookPelle(colorFer, colorManche)} transform={`translate(0 ${pelleY})`} />}
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
          {/* scintillement de l'or en boucle lente (micro-anim, respiration du lingot) */}
          {sparkles.map((s, i) => s.op > 0.01 && (
            <g key={`spk${i}`}>
              <circle cx={s.x} cy={s.y} r={s.r} fill="#fff8dc" opacity={s.op} />
              <circle cx={s.x} cy={s.y} r={s.r * 2.4} fill={OR_CLAIR} opacity={s.op * 0.25} />
            </g>
          ))}

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
              <text x="960" y="1002" textAnchor="middle" fill="#f5e6ce" fontFamily="Georgia, 'Times New Roman', serif" fontSize="30" fontStyle="italic" letterSpacing="1.5">Où va cet or ?</text>
            </g>
          )}

          <Grp body={H_VIGNETTE} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default OrDarfourHook;

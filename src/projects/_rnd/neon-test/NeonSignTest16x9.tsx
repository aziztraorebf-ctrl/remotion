// NeonSignTest16x9 — banc d'essai : reproduire en SVG la scene neon de la demo Opus 5 (post @stevibe,
// annoncee "pure HTML canvas"), pour verifier que le substrat etait bien le notre.
//
// HYPOTHESE TESTEE (2026-07-25, apres analyse frame par frame de la video avec Aziz) : la pointe lumineuse
// visible au bout du trait pendant le trace = strokeDashoffset = SVG. Donc l'ecart avec nos scenes ne venait
// PAS du substrat mais de 3 finitions manquantes, extraites en briques dans `effects/NeonSign.tsx` :
//   glow multi-couches · trace a pointe lumineuse · reflet au sol.
// La pluie est la seule couche canvas (beaucoup d'elements diffus = le cas ou le canvas gagne vraiment).
//
// Choregraphie (~14s) :
//   0.0-1.2s  : nuit + pluie, enseignes eteintes (fantomes, a peine visibles)
//   1.2-4.0s  : le cadre de l'enseigne principale se TRACE (pointe lumineuse qui court)
//   4.0-5.6s  : le soleil Anthropic se trace, rayon par rayon
//   5.6-8.0s  : "CLAUDE OPUS 5" s'allume lettre par lettre, avec grésillement
//   8.0-9.2s  : le script cursif "now glowing" s'ecrit
//   9.2-11.0s : les enseignes laterales s'allument en cascade (REASONING / VISION / WRITING / Code)
//   11.0-12.2s: surtension — tout faiblit puis remonte d'un coup (le "power surge" de la demo)
//   12.2-14.0s: tenue, respiration lente, reflets au sol

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { GlowStroke, DrawnPath, GroundReflection, flicker } from "../../_shared/svg-library/elements/effects/NeonSign";
import AtmosphereCanvas from "../../_shared/svg-library/elements/effects/AtmosphereCanvas";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const cI = (f: number, a: number, b: number, lo = 0, hi = 1) => interpolate(f, [a, b], [lo, hi], clamp);

export const NEON_TEST_FRAMES = S(14);

// Palette neon (registre nuit urbaine)
const ORANGE = "#ff6b3d";
const CYAN = "#4dd6e8";
const MAGENTA = "#e857c4";
const JAUNE = "#f5d547";
const BLANC = "#e8f0f5";

const GROUND_Y = 700; // ligne de sol : sous cette ligne, les reflets

// ————————————————————————————————————————————————————————————————————
// Geometrie de l'enseigne principale
// ————————————————————————————————————————————————————————————————————
const FRAME_D = "M 640 400 L 1280 400 Q 1300 400 1300 420 L 1300 620 Q 1300 640 1280 640 L 640 640 Q 620 640 620 620 L 620 420 Q 620 400 640 400 Z";

// Soleil Anthropic stylise : 8 branches, une branche = un path (trace sequentiellement)
const SUN_CX = 960, SUN_CY = 466, SUN_R0 = 13, SUN_R1 = 40;
const sunRays = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  const x1 = SUN_CX + Math.cos(a) * SUN_R0, y1 = SUN_CY + Math.sin(a) * SUN_R0;
  const x2 = SUN_CX + Math.cos(a) * SUN_R1, y2 = SUN_CY + Math.sin(a) * SUN_R1;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
});

const LETTERS = "CLAUDE OPUS 5".split("");
// Geometrie des lettres centree sur l'enseigne — partagee par l'etat ETEINT et l'etat ALLUME (sinon
// dedoublement visible : bug releve sur la 1re frame de controle).
const LETTER_SIZE = 62;
const LETTER_STEP = 46;
const LETTER_Y = 566;
const LETTER_X = (i: number) => SUN_CX + (i - (LETTERS.length - 1) / 2) * LETTER_STEP;

// Enseignes laterales : [label, couleur, x, y, orientation]
type SideSign = { label: string; color: string; x: number; y: number; vertical?: boolean; at: number };
const SIDE_SIGNS: SideSign[] = [
  { label: "REASONING", color: CYAN, x: 490, y: 380, vertical: true, at: 9.2 },
  { label: "VISION", color: BLANC, x: 1400, y: 450, at: 9.7 },
  { label: "WRITING", color: JAUNE, x: 1640, y: 590, at: 10.2 },
];

// Buildings du fond — 2 plans de profondeur ("far" recule/sombre, "near" avance/plus contraste) + fenetres
// eclairees eparses. Correction Aziz : des rectangles plats ne font pas une ville.
type Building = { x: number; w: number; h: number; depth: "far" | "near" };
const BUILDINGS: Building[] = [
  { x: 40, w: 150, h: 300, depth: "far" }, { x: 210, w: 110, h: 430, depth: "near" },
  { x: 340, w: 170, h: 250, depth: "far" }, { x: 100, w: 90, h: 190, depth: "near" },
  { x: 1170, w: 130, h: 380, depth: "far" }, { x: 1320, w: 160, h: 290, depth: "near" },
  { x: 1500, w: 120, h: 450, depth: "far" }, { x: 1650, w: 190, h: 330, depth: "near" },
  { x: 560, w: 120, h: 200, depth: "far" }, { x: 1240, w: 100, h: 175, depth: "far" },
];

export const NeonSignTest16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // 1. Cadre qui se trace
  const frameDraw = cI(frame, S(1.2), S(4.0));

  // 2. Soleil : chaque branche part en decale
  const sunOn = cI(frame, S(4.0), S(5.6));

  // 3. Lettres : allumage sequentiel + grésillement propre a chacune
  const letterOn = (i: number) => {
    const start = S(5.6) + i * 5;
    return flicker(frame, start, start + 14, 11 + i * 7);
  };

  // 4. Script cursif
  const scriptDraw = cI(frame, S(8.0), S(9.2));

  // 5. Surtension : tout faiblit (0.35) puis revient d'un coup
  const surge =
    frame < S(11.0) ? 1 :
    frame < S(11.35) ? cI(frame, S(11.0), S(11.35), 1, 0.32) :
    frame < S(11.7) ? cI(frame, S(11.35), S(11.7), 0.32, 1.25) :
    cI(frame, S(11.7), S(12.2), 1.25, 1);

  // 6. Respiration lente une fois etabli (le neon n'est jamais parfaitement stable)
  const breathe = 1 + 0.035 * Math.sin(t * 2 * Math.PI / 3.1);
  const master = surge * breathe;

  // 7. PULL BACK REVEAL — correction majeure apres relecture des frames avec Aziz (2026-07-25).
  // La demo ne montre PAS un plan fixe : elle OUVRE en tres gros plan sur le trace (a 02:00 le soleil
  // remplit l'ecran) et la camera RECULE jusqu'au plan large. C'est le mouvement qui fait le "plan de
  // cinema" — juger la demo sur sa frame finale m'avait fait rater ca (cf doctrine : verifier le
  // MOUVEMENT, pas des frames isolees).
  // Zoom 3.1x centre sur le soleil -> 1.0x cadre plein, en ease-out : rapide au debut, se pose a la fin.
  const pullRaw = cI(frame, S(0.6), S(11.4));
  const pullEase = 1 - Math.pow(1 - pullRaw, 2.6);
  const camScale = 3.1 - pullEase * 2.1;
  // le centre de zoom glisse du soleil vers le centre geometrique du cadre pendant le recul
  const camCX = SUN_CX;
  const camCY = SUN_CY + pullEase * 90;
  // derive laterale tres legere : la camera n'est jamais parfaitement immobile
  const camDrift = Math.sin(t * 2 * Math.PI / 8.5) * 7 * (1 - pullEase * 0.6);

  // Contenu lumineux — rendu 2x : une fois normal, une fois en reflet (miroir sous GROUND_Y)
  const neonContent = (
    <>
      {/* cadre de l'enseigne — epaisseurs divisees par camScale : a l'ecran le tube garde une epaisseur
          constante quel que soit le zoom (sinon le trace parait filiforme en gros plan). */}
      <DrawnPath d={FRAME_D} color={ORANGE} progress={frameDraw} width={7 / camScale} tipSize={9 / camScale} on={master} />

      {/* soleil Anthropic — les branches partent decalees, plusieurs pointes lumineuses coexistent
          (observe sur la demo a 02:00 : 4 branches en cours de trace simultanement). */}
      {sunRays.map((d, i) => {
        const local = Math.max(0, Math.min(1, (sunOn * 8 - i * 0.55) / 1.2));
        if (local <= 0.01) return null;
        return <DrawnPath key={i} d={d} color={ORANGE} progress={local}
          width={5 / camScale} tipSize={5.5 / camScale} on={master} />;
      })}
      {sunOn > 0.55 && (
        <GlowStroke d={`M ${SUN_CX - SUN_R0} ${SUN_CY} A ${SUN_R0} ${SUN_R0} 0 1 0 ${SUN_CX + SUN_R0} ${SUN_CY} A ${SUN_R0} ${SUN_R0} 0 1 0 ${SUN_CX - SUN_R0} ${SUN_CY} Z`}
          color={ORANGE} width={5} on={cI(sunOn, 0.55, 1) * master} />
      )}

      {/* CLAUDE OPUS 5 — lettre par lettre */}
      <g>
        {LETTERS.map((ch, i) => {
          const on = letterOn(i) * master;
          if (on <= 0.02 || ch === " ") return null;
          const x = LETTER_X(i);
          const common = { x, y: LETTER_Y, fontSize: LETTER_SIZE, fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700, textAnchor: "middle" as const };
          return (
            <g key={i}>
              {/* meme empilement que GlowStroke, applique au texte : diffusion / corps / coeur blanc */}
              <text {...common} fill={ORANGE} opacity={0.30 * on} style={{ filter: "blur(13px)" }}>{ch}</text>
              <text {...common} fill={ORANGE} opacity={0.34 * on} style={{ filter: "blur(4px)" }}>{ch}</text>
              <text {...common} fill={ORANGE} opacity={0.95 * on}>{ch}</text>
              <text {...common} fill="#fff" opacity={0.34 * on}>{ch}</text>
            </g>
          );
        })}
      </g>

      {/* script cursif "now glowing" — vrai texte italique revele par un masque qui balaie de gauche a
          droite (l'ecriture apparait mot a mot). Dessiner un faux cursif en <path> a la main donnait des
          vaguelettes illisibles : corrige apres la 1re frame de controle. */}
      {scriptDraw > 0.01 && (
        <g>
          <defs>
            <linearGradient id="script-wipe" x1="770" y1="0" x2="1150" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset={Math.max(0, scriptDraw - 0.04)} stopColor="#fff" stopOpacity="1" />
              <stop offset={scriptDraw} stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="script-mask">
              <rect x={740} y={580} width={440} height={60} fill="url(#script-wipe)" />
            </mask>
          </defs>
          <g mask="url(#script-mask)">
            <text x={SUN_CX} y={618} fill={CYAN} fontSize={34} textAnchor="middle" fontStyle="italic"
              fontFamily="Georgia, 'Times New Roman', serif" opacity={0.34 * master}
              style={{ filter: "blur(8px)" }}>now glowing</text>
            <text x={SUN_CX} y={618} fill={CYAN} fontSize={34} textAnchor="middle" fontStyle="italic"
              fontFamily="Georgia, 'Times New Roman', serif" opacity={0.95 * master}>now glowing</text>
            <text x={SUN_CX} y={618} fill="#fff" fontSize={34} textAnchor="middle" fontStyle="italic"
              fontFamily="Georgia, 'Times New Roman', serif" opacity={0.30 * master}>now glowing</text>
          </g>
        </g>
      )}

      {/* enseignes laterales */}
      {SIDE_SIGNS.map((s) => {
        const on = flicker(frame, S(s.at), S(s.at + 0.7), 23) * master;
        if (on <= 0.02) return null;
        if (s.vertical) {
          return (
            <g key={s.label}>
              <GlowStroke d={`M ${s.x} ${s.y} L ${s.x + 70} ${s.y} L ${s.x + 70} ${s.y + 230} L ${s.x} ${s.y + 230} Z`}
                color={s.color} width={3.6} on={on} />
              {s.label.split("").map((ch, j) => (
                <text key={j} x={s.x + 35} y={s.y + 32 + j * 24} fill={s.color} fontSize={19}
                  fontFamily="Helvetica, Arial, sans-serif" textAnchor="middle" opacity={0.95 * on}>{ch}</text>
              ))}
            </g>
          );
        }
        return (
          <g key={s.label}>
            <GlowStroke d={`M ${s.x} ${s.y} L ${s.x + 190} ${s.y} L ${s.x + 190} ${s.y + 62} L ${s.x} ${s.y + 62} Z`}
              color={s.color} width={3.6} on={on} />
            <text x={s.x + 95} y={s.y + 42} fill={s.color} fontSize={30} fontFamily="Helvetica, Arial, sans-serif"
              textAnchor="middle" opacity={0.95 * on}>{s.label}</text>
          </g>
        );
      })}

      {/* "Code" magenta a gauche — meme traitement que le script : texte reel + glow, pas de faux cursif */}
      {(() => {
        const on = flicker(frame, S(10.4), S(11.0), 41) * master;
        if (on <= 0.02) return null;
        const c = { x: 210, y: 486, fontSize: 52, textAnchor: "middle" as const, fontStyle: "italic" as const,
          fontFamily: "Georgia, 'Times New Roman', serif" };
        return (
          <g>
            <text {...c} fill={MAGENTA} opacity={0.32 * on} style={{ filter: "blur(12px)" }}>Code</text>
            <text {...c} fill={MAGENTA} opacity={0.95 * on}>Code</text>
            <text {...c} fill="#fff" opacity={0.28 * on}>Code</text>
            <GlowStroke d="M 120 506 L 300 506" color={MAGENTA} width={2.6} on={on} />
          </g>
        );
      })()}
    </>
  );

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 62%, #12141f 0%, #05060a 100%)" }}>
      {/* pluie — canvas : beaucoup d'elements diffus, le cas ou le canvas bat le SVG */}
      <AtmosphereCanvas width={W} height={H} count={300} color="#b9d6e8" intensity={0.40}
        driftY={1100} swayX={4} seed={19} mode="rain" streakLen={22} slant={4} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
       {/* CAMERA — Pull Back Reveal : tout le contenu de scene vit dans ce groupe */}
       <g transform={`translate(${camCX + camDrift} ${camCY}) scale(${camScale}) translate(${-camCX} ${-camCY})`}>
        {/* buildings — 2 plans de profondeur + fenetres eclairees eparses (correction : des rectangles
            plats ne font pas une ville. Les fenetres sont deterministes, indexees, jamais Math.random). */}
        {BUILDINGS.map((b, i) => {
          const far = b.depth === "far";
          const cols = Math.floor(b.w / 26);
          const rows = Math.floor(b.h / 34);
          return (
            <g key={i}>
              <rect x={b.x} y={GROUND_Y - b.h} width={b.w} height={b.h}
                fill={far ? "#0a0d14" : "#11151f"} opacity={far ? 0.9 : 0.95} />
              {/* arete eclairee cote enseigne : la lumiere du neon accroche la facade */}
              <rect x={b.x} y={GROUND_Y - b.h} width={2} height={b.h} fill="#2a3448" opacity={far ? 0.25 : 0.45} />
              {Array.from({ length: cols * rows }, (_, k) => {
                // pseudo-aleatoire deterministe : seule ~1 fenetre sur 5 est allumee
                const h = (i * 7919 + k * 104729) % 97;
                if (h > 19) return null;
                const cx = b.x + 9 + (k % cols) * 26;
                const cy = GROUND_Y - b.h + 16 + Math.floor(k / cols) * 34;
                return <rect key={k} x={cx} y={cy} width={9} height={13}
                  fill={h % 3 === 0 ? "#f0d9a0" : "#8fb4d6"} opacity={far ? 0.16 : 0.28} />;
              })}
            </g>
          );
        })}

        {/* sol mouille : degrade qui remonte + flaque centrale qui accroche la lumiere de l'enseigne */}
        <defs>
          <linearGradient id="wet-ground" x1="0" y1={GROUND_Y} x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0d1119" />
            <stop offset="1" stopColor="#05060a" />
          </linearGradient>
          <radialGradient id="ground-pool" cx="0.5" cy="0" r="0.75">
            <stop offset="0" stopColor={ORANGE} stopOpacity="0.13" />
            <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="url(#wet-ground)" />
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#232c3d" strokeWidth={2} />

        {/* enseignes ETEINTES (fantomes) — visibles des le debut, tres sombres : la scene n'est jamais vide.
            Meme geometrie exacte que les lettres allumees (LETTER_X) pour eviter tout dedoublement. */}
        <g opacity={0.11}>
          <path d={FRAME_D} fill="none" stroke="#8fa3c0" strokeWidth={2.5} />
          {LETTERS.map((ch, i) => ch === " " ? null : (
            <text key={i} x={LETTER_X(i)} y={LETTER_Y} fill="#8fa3c0" fontSize={LETTER_SIZE}
              fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} textAnchor="middle">{ch}</text>
          ))}
          <text x={SUN_CX} y={618} fill="#8fa3c0" fontSize={34} textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic">now glowing</text>
        </g>

        {/* REFLET AU SOL — renforce (correction Aziz : chez eux les reflets sont NETS et lisibles, on lit
            "WRITING" a l'envers ; les miens a 0.30/blur4 disparaissaient). Opacite ~2x, flou reduit. */}
        <GroundReflection groundY={GROUND_Y} maskId="neon-reflect" width={W} height={H} opacity={0.58} blur={2.2}>
          {neonContent}
        </GroundReflection>

        {/* halo de la flaque : la lumiere de l'enseigne se pose sur le sol mouille */}
        <rect x={W / 2 - 620} y={GROUND_Y} width={1240} height={300} fill="url(#ground-pool)"
          opacity={cI(frame, S(5.6), S(7.5)) * master} />

        {/* CONTENU LUMINEUX */}
        {neonContent}
       </g>
       {/* fin CAMERA — la signature reste FIXE a l'ecran (elle n'appartient pas au monde de la scene) */}

        {/* vignettage : assombrit les bords, concentre le regard sur l'enseigne */}
        <defs>
          <radialGradient id="vignette" cx="0.5" cy="0.52" r="0.78">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.72" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#vignette)" />

        {/* signature */}
        <text x={W - 60} y={H - 40} fill="#6b7688" fontSize={17} fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="end" opacity={cI(frame, S(12.4), S(13.2)) * 0.75}>anthropic</text>
      </svg>
    </AbsoluteFill>
  );
};

export default NeonSignTest16x9;

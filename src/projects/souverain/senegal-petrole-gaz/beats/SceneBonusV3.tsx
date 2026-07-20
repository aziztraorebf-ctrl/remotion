/**
 * SceneBonusV3 — "La machine tourne, le pouvoir se fissure + pont AES" (scene 7 BONUS / epilogue),
 * Senegal Petrole & Gaz V3-REFONTE. ⭐ V3 PREMIUM (DA-brief jury Gemini+Kimi+DeepSeek + storyboard valide).
 *
 * Ecrite DEPUIS LA VOIX (forced-align V3, segment 407.4s -> 492.24s = 84.84s / 2545 frames @30).
 * Audio dedie : sc7-audio.mp3 (startFrom=0). Demarre PILE sur "Revenons a ce qu'on disait tout au debut".
 *
 * INTENTION (1 verbe) : SUSPENDRE. La tension ne se resout pas, elle se DEPLACE. La fissure NE SE REFERME
 * JAMAIS (les 2 moities du pays s'ecartent physiquement et restent ecartees).
 *
 * STRUCTURE (4 etats) + ce que la V3 ELEVE par rapport a la v2 :
 *   E1 (0->~22s) LA MACHINE QUI TOURNE — comblait les "20s creuses" (heresie documentaire v2) :
 *      le Senegal se dessine au trait or (geo EXACTE SENEGAL_PATH, rappel sc.0), PLUS :
 *      - COMPTEUR mecanique "PRODUCTION : 000 000 BBL/J" qui roule 0->100 000 (ease-out-expo, cale sur
 *        "plus de cent mille barils par jour" f455).
 *      - 4 PIPELINES courbes traces (stroke-dashoffset) depuis le centre vers les bords.
 *      - PARTICULES or qui coulent le long des pipelines (getPointAtLength) et SORTENT du cadre (= cargaisons).
 *      - PLATEFORME offshore cote ouest + ONDES SONAR (production continue).
 *      - NAVIRE qui traverse G->D sur "les cargaisons partent" (f386).
 *   E2 (~22->50s) FRACTURE + JETONS-MEDAILLES (Aziz : MONOGRAMME, pas de profil) :
 *      FAYE / SONKO = jetons-medailles or : arete striee (tranche de piece), degrade RADIAL metallique
 *      (clair centre -> sombre bords = relief), MONOGRAMME grave "F"/"S" cisele (duplication 1px), NOM en
 *      textPath arc sous le jeton. Eclair au-dessus (Faye eteint=limoge / Sonko actif pulse=montant).
 *      Chute rebond (ease-out-back) + micro-rotation. La fissure du pays s'OUVRE physiquement (moities ecartees).
 *   E3 (~50->58s) LA QUESTION : "AU NOM DE QUI FAUT-IL LA GOUVERNER ?". Fissure grande ouverte, lumineuse.
 *   E4 (~58->84.8s) PONT AES + CTA : le pays s'estompe. 3 drapeaux AES PREMIUM (ondulation Bezier dephasee,
 *      cadre or, couleurs broadcast-safe, deroulement en cascade, ligne or de liaison). Texte "ILS ONT CHOISI
 *      LA RUPTURE." RETIRE (chantier 9 passe finition 2026-07-04, retour Aziz : la voix + les 3 drapeaux
 *      suffisent, epure-texte). Puis "LA PROCHAINE VIDEO" massif + cloche or (abonnez f2383). Fin "A TRES VITE" (f2520).
 *
 * Registre : navy #16213a + grille or qui respire. 100% SVG inline CODE-MAIN, 0 asset, 0 appel LLM/image
 * (SVG-OUTIL, gate "CODE-MAIN vs LLM" doctrine SVG-SCENES-GENERATIVES). GEO = SENEGAL_PATH d3-geo reutilise.
 * Icones (plateforme, navire, cloche) = paths SVG code-main (pas de dependance lucide au runtime).
 */
import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, random,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "../../../_proto-16-9/senegalPath";

const { fontFamily: BEBAS } = loadBebas();

const NAVY = "#16213a", GOLD = "#c8a951", GOLD_HI = "#e8c472", GOLD_LO = "#8a6d2c", IVORY = "#f2efe6";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── geometrie carte : SENEGAL_PATH dans une boite 900x700, place centre. ──
const MAP_SCALE = 0.95;
const MAP_W = 900 * MAP_SCALE, MAP_H = 700 * MAP_SCALE;
const MAP_X = W / 2 - MAP_W / 2;
const MAP_Y = H / 2 - MAP_H / 2 - 20;
const CENTER_X = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
const CENTER_Y = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;
const MAP_TOP_Y = MAP_Y + 50 * MAP_SCALE;
const MAP_BOT_Y = MAP_Y + 650 * MAP_SCALE;

// ── FISSURE REUTILISEE de la scene 0 (ProtoEffect_Fracture.fracturePath) — zigzag brise deterministe
//    (random() seede), ADAPTE a MA geometrie (MAP_SCALE/MAP_X/MAP_Y). Diagonale haut-gauche -> bas-droite
//    qui traverse le pays. Meme dispositif d'ecartement (clip halfA/halfB + translate +-split). ──
function fracturePath(): string {
  const x0 = MAP_X + 120 * MAP_SCALE;
  const y0 = MAP_Y + 60 * MAP_SCALE;
  const x1 = MAP_X + 820 * MAP_SCALE;
  const y1 = MAP_Y + 640 * MAP_SCALE;
  const segs = 9;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bx = x0 + (x1 - x0) * t;
    const by = y0 + (y1 - y0) * t;
    const jitter = (random(`frac-${i}`) - 0.5) * 130 * MAP_SCALE;
    const perpX = -(y1 - y0);
    const perpY = x1 - x0;
    const len = Math.hypot(perpX, perpY);
    d += ` L ${bx + (perpX / len) * jitter} ${by + (perpY / len) * jitter}`;
  }
  return d;
}
const FRACTURE_D = fracturePath();

// ── frames-cles (= (t_abs - 407.4) * 30, depuis sc7-words.json) ──────────────────────────────
const F_REVENONS  = 0;
const F_PAYS      = 85;    // "Un pays qui devient riche"
const F_GOUV      = 140;   // "un gouvernement qui saute"
const F_MACHINE   = 317;   // "D'un cote, la machine ne s'arrete plus" -> pipelines/particules s'activent
const F_CARGO     = 386;   // "les cargaisons partent" -> le navire traverse
const F_100K      = 455;   // "plus de cent mille barils par jour" -> le compteur CULMINE a 100 000
const F_FISSURE   = 683;   // "se fissure" -> la fissure NAIT
const F_FAYE      = 775;   // "le president Faye" -> jeton FAYE tombe (gauche)
const F_LIMOGE1   = 786;   // "limoge"
const F_SONKO     = 1007;  // Sonko (rebondit) -> jeton SONKO tombe (droite)
const F_ELU       = 1049;  // "elu president de l'Assemblee"
const F_LIMOGE2   = 1145;  // "Limoge d'un cote"
const F_PUISSANT  = 1191;  // "plus puissant de l'autre"
const F_FRACTURE  = 1277;  // "cette fracture" -> les moities s'ecartent plus fort
const F_E2_OUT    = 1490;  // fin lecture E2
const F_QUESTION  = 1596;  // "Au nom de qui"
const F_GOUVERNER = 1633;  // "faut-il la gouverner ?"
const F_Q_OUT     = 1820;
const F_RUPTURE   = 1883;  // "ont choisi la rupture" -> bascule E4
const F_MALI      = 1962;
const F_BURKINA   = 1994;
const F_NIGER     = 2027;
const F_SOUV      = 2149;
const F_PROCHAINE = 2261;  // "la prochaine video"
const F_ABONNEZ   = 2383;  // "abonnez-vous"
const F_VITE      = 2508;  // "A tres vite"
const F_FADE      = 2520;
const END         = 2545;

// ease-out-expo (compteur d'essence : ralentit fort sur la fin)
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
// ease-out-back (rebond depasse puis revient — cubic-bezier(0.34,1.56,0.64,1) approx)
const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const SceneBonusV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sc7-audio.mp3")} startFrom={0} />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={0}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 45], [0, 1], clamp);
          const fadeStart = END - 90;
          const fadeOut = f >= fadeStart ? Math.max(0, 1 - (f - fadeStart) / 90) : 1;
          return 0.06 * fadeIn * fadeOut;
        }}
      />
      <SceneSFX />
      <GridBackground />
      <MachineLayer />
      <MapAndFissure />
      <Medallions />
      <StateTexts />
      <AesBridge />
      <SubscribeCTA />
      <SourceTag />
    </AbsoluteFill>
  );
};

// ── Cartouche de SOURCE discret (rigueur factuelle) — bas-gauche, fade in/out ────
// Apparait sur la fracture politique Faye/Sonko (limogeage + election Assemblee).
// Sources verifiees : France 24 (election Sonko Assemblee, mai 2026) + BBC Afrique (fracture Faye/Sonko).
const SourceTag: React.FC = () => {
  const frame = useCurrentFrame();
  const IN = F_FAYE;          // 775 — "le president Faye" (debut fracture)
  const OUT = F_LIMOGE2 + 100; // ~1245 — apres "Limoge d'un cote, plus puissant de l'autre"
  const op = interpolate(frame, [IN, IN + 18, OUT - 24, OUT], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 64, bottom: 54,
      display: "flex", alignItems: "center", gap: 10, opacity: op * 0.62,
    }}>
      <div style={{ width: 22, height: 2, backgroundColor: GOLD }} />
      <span style={{
        fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.2,
        color: IVORY, textTransform: "uppercase",
      }}>
        France 24 · BBC Afrique
      </span>
    </div>
  );
};

// ── Fond navy + grille or qui respire ──────────────────────────────────────────────────────
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const panic = interpolate(frame, [F_FISSURE, F_FRACTURE], [0, 1], clamp);
  const calm = interpolate(frame, [F_QUESTION, F_QUESTION + 60], [1, 0.5], clamp);
  const breath = 0.06 + 0.025 * Math.sin(frame / 60) + 0.03 * panic * calm * Math.abs(Math.sin(frame / 8));
  const shiftY = (frame * (0.10 + panic * 0.3)) % 60;
  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY,
      backgroundImage:
        `linear-gradient(rgba(200,169,81,${breath}) 1px, transparent 1px),` +
        `linear-gradient(90deg, rgba(200,169,81,${breath}) 1px, transparent 1px)`,
      backgroundSize: "60px 60px, 60px 60px",
      backgroundPosition: `0px ${shiftY}px, 0px 0px`,
    }} />
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  E1 — LA MACHINE QUI TOURNE : compteur BBL/J + pipelines + particules + plateforme sonar + navires
// ════════════════════════════════════════════════════════════════════════════════════════════
const PIPELINES: { d: string }[] = [
  { d: `M ${CENTER_X} ${CENTER_Y} C ${CENTER_X + 180} ${CENTER_Y - 60}, ${MAP_X + MAP_W + 120} ${MAP_Y + 120}, ${W} ${MAP_Y + 60}` },
  { d: `M ${CENTER_X} ${CENTER_Y} C ${CENTER_X + 200} ${CENTER_Y + 40}, ${MAP_X + MAP_W + 160} ${CENTER_Y + 80}, ${W} ${CENTER_Y + 120}` },
  { d: `M ${CENTER_X} ${CENTER_Y} C ${CENTER_X + 120} ${CENTER_Y + 160}, ${MAP_X + MAP_W} ${MAP_BOT_Y + 40}, ${W} ${H - 120}` },
  { d: `M ${CENTER_X} ${CENTER_Y} C ${CENTER_X - 160} ${CENTER_Y + 140}, ${MAP_X - 40} ${H - 100}, ${W * 0.18} ${H}` },
];

const MachineLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layerOp = interpolate(frame, [F_PAYS, F_PAYS + 30, F_FISSURE + 10, F_FISSURE + 70], [0, 1, 1, 0], clamp);
  if (frame > F_FISSURE + 70) return null;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} opacity={layerOp}>
      <defs>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GOLD_HI} /><stop offset="100%" stopColor={GOLD_LO} />
        </linearGradient>
        <radialGradient id="particleGlow">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity={1} />
          <stop offset="100%" stopColor={GOLD_HI} stopOpacity={0} />
        </radialGradient>
      </defs>

      {PIPELINES.map((p, i) => {
        const PLEN = 1400;
        const trace = interpolate(frame, [F_MACHINE + i * 8, F_MACHINE + 40 + i * 8], [0, 1], clamp);
        return <Pipeline key={i} d={p.d} trace={trace} dashLen={PLEN} frame={frame} idx={i} active={frame >= F_MACHINE} />;
      })}

      <OffshorePlatform x={MAP_X - 70} y={CENTER_Y - 30} frame={frame} />
      <ProductionCounter frame={frame} />
      <CargoFleet frame={frame} portX={MAP_X - 70} portY={CENTER_Y - 30} />
    </svg>
  );
};

// un pipeline + ses particules (getPointAtLength sur un ref reel)
const Pipeline: React.FC<{ d: string; trace: number; dashLen: number; frame: number; idx: number; active: boolean }> =
({ d, trace, dashLen, frame, idx, active }) => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [len, setLen] = React.useState(0);
  React.useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [d]);

  const nParts = 4;
  const period = 70;
  const parts: { x: number; y: number; op: number }[] = [];
  if (len > 0 && active && pathRef.current) {
    for (let k = 0; k < nParts; k++) {
      const phase = ((frame - F_MACHINE) / period + k / nParts + idx * 0.13) % 1;
      if (phase < 0) continue;
      const pt = pathRef.current.getPointAtLength(phase * len);
      const op = phase < trace ? interpolate(phase, [0, 0.1, 0.85, 1], [0, 1, 1, 0], clamp) : 0;
      parts.push({ x: pt.x, y: pt.y, op });
    }
  }

  return (
    <g>
      <path ref={pathRef} d={d} fill="none" stroke="url(#pipeGrad)" strokeWidth={2.5}
        strokeLinecap="round" opacity={0.55}
        strokeDasharray={dashLen} strokeDashoffset={dashLen * (1 - trace)} />
      {parts.map((pt, k) => (
        <g key={k} opacity={pt.op}>
          <circle cx={pt.x} cy={pt.y} r={7} fill="url(#particleGlow)" opacity={0.5} />
          <circle cx={pt.x} cy={pt.y} r={2.6} fill={GOLD_HI} />
        </g>
      ))}
    </g>
  );
};

const OffshorePlatform: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const op = interpolate(frame, [F_MACHINE - 20, F_MACHINE + 10], [0, 1], clamp);
  if (op <= 0) return null;
  const waves = [0, 1, 2].map((i) => {
    const t = ((frame - F_MACHINE) / 36 + i / 3) % 1;
    return { r: 14 + t * 60, o: (1 - t) * 0.5 };
  });
  return (
    <g opacity={op}>
      {waves.map((w, i) => (
        <circle key={i} cx={x} cy={y} r={w.r} fill="none" stroke={GOLD} strokeWidth={1.6} opacity={w.o} />
      ))}
      <g stroke={GOLD_HI} strokeWidth={2.2} fill="none" strokeLinejoin="round">
        <line x1={x - 14} y1={y + 14} x2={x + 14} y2={y + 14} />
        <line x1={x - 12} y1={y + 14} x2={x} y2={y - 22} />
        <line x1={x + 12} y1={y + 14} x2={x} y2={y - 22} />
        <line x1={x - 7} y1={y - 2} x2={x + 7} y2={y - 2} />
        <line x1={x - 3} y1={y - 12} x2={x + 3} y2={y - 12} />
      </g>
    </g>
  );
};

const ProductionCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [F_MACHINE - 30, F_MACHINE], [0, 1], clamp);
  if (op <= 0) return null;
  const t = interpolate(frame, [F_MACHINE, F_100K], [0, 1], clamp);
  const val = Math.round(easeOutExpo(t) * 100000 / 100) * 100;
  const breathe = frame > F_100K ? 1 + 0.015 * Math.sin((frame - F_100K) / 12) : 1;
  const str = val.toLocaleString("fr-FR").replace(/ | /g, " ");
  const bx = 70, by = 70, bw = 430, bh = 110;
  return (
    <g opacity={op} transform={`translate(${bx},${by}) scale(${breathe})`} style={{ transformOrigin: `${bx}px ${by}px` }}>
      <rect x={0} y={0} width={bw} height={bh} rx={6} fill="rgba(13,18,32,0.6)" stroke={GOLD} strokeWidth={1.6} />
      <text x={22} y={40} fill="rgba(242,239,230,0.7)" fontFamily={BEBAS} fontSize={26} letterSpacing="3">PRODUCTION</text>
      <text x={22} y={92} fill={GOLD_HI} fontFamily={BEBAS} fontSize={56} letterSpacing="2" style={{ fontVariantNumeric: "tabular-nums" }}>{str}</text>
      <text x={bw - 22} y={92} textAnchor="end" fill="rgba(242,239,230,0.55)" fontFamily={BEBAS} fontSize={28} letterSpacing="2">BBL / J</text>
    </g>
  );
};

// FLOTTE : PLUSIEURS petits navires qui PARTENT DEPUIS LE PORT/GISEMENT (cote ouest, plateforme offshore),
// suivent une trajectoire vers le LARGE (au-dela de la cote, vers le bas-gauche = ocean) et SORTENT du cadre.
// Ils quittent le continent depuis le BON endroit (les gisements). Chacun decale dans le temps (depart echelonne).
const CargoFleet: React.FC<{ frame: number; portX: number; portY: number }> = ({ frame, portX, portY }) => {
  if (frame < F_CARGO - 10 || frame > F_FISSURE + 30) return null;
  const N = 5;
  // direction de fuite vers le large (vers le bas-gauche, hors cadre)
  const dirX = -1, dirY = 0.55;
  const dlen = Math.hypot(dirX, dirY);
  const ux = dirX / dlen, uy = dirY / dlen;
  const TRAVEL = 760; // distance avant sortie de cadre
  const DUR = 150;    // frames pour parcourir
  const STAGGER = 46; // ecart de depart entre navires
  return (
    <g>
      {Array.from({ length: N }).map((_, i) => {
        const start = F_CARGO + i * STAGGER;
        const tt = interpolate(frame, [start, start + DUR], [0, 1], clamp);
        if (tt <= 0 || tt >= 1) return null;
        // petit eparpillement lateral par navire (sillon different) — perpendiculaire a la direction
        const spread = (random(`ship-${i}`) - 0.5) * 70;
        const px = -uy * spread, py = ux * spread;
        const dist = tt * TRAVEL;
        const x = portX + ux * dist + px;
        const y = portY + uy * dist + py;
        const op = interpolate(tt, [0, 0.06, 0.8, 1], [0, 1, 1, 0], clamp);
        const bob = Math.sin((frame + i * 13) / 9) * 2;
        const sc = 0.62; // petits navires
        return (
          <g key={i} opacity={op} transform={`translate(${x}, ${y + bob}) scale(${sc})`}>
            <path d="M -42 6 L 42 6 L 34 20 L -34 20 Z" fill={GOLD} opacity={0.92} />
            <rect x={-22} y={-10} width={14} height={16} fill={GOLD_HI} />
            <rect x={-6} y={-15} width={14} height={21} fill={GOLD} />
            <rect x={10} y={-8} width={12} height={14} fill={GOLD_HI} />
            {/* sillage qui remonte vers le port (d'ou il vient) */}
            <line x1={42} y1={18} x2={42 + 34} y2={18 - 8} stroke={GOLD} strokeWidth={1.4} opacity={0.35} />
          </g>
        );
      })}
    </g>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  CARTE SENEGAL (geo EXACTE) qui se DESSINE + PULSE du contour + FISSURE REUTILISEE (sc.0) qui ECARTE
//  les 2 moities (clip halfA/halfB + translate +-split diagonal, jamais refermee).
// ════════════════════════════════════════════════════════════════════════════════════════════
const MapAndFissure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawStart = F_REVENONS + 30;
  const draw = spring({ fps, frame: Math.max(0, frame - drawStart), config: { damping: 38, stiffness: 26 } });
  const drawDone = draw > 0.985;
  const mapOp = interpolate(frame, [drawStart, drawStart + 20, F_RUPTURE, F_RUPTURE + 70], [0, 1, 1, 0.1], clamp);

  // PULSE du contour une fois dessine : opacite + epaisseur respirent + glow doux (vie, pas trait fige)
  const pulse = drawDone ? 0.5 + 0.5 * Math.sin((frame - drawStart) / 26) : 0;
  const outlineW = (4 + 0.9 * pulse) / MAP_SCALE;
  const outlineOp = 0.82 + 0.18 * pulse;
  const glowOp = drawDone ? (0.10 + 0.10 * pulse) * Math.max(0, (mapOp - 0.1) / 0.9) : 0;

  // ECARTEMENT (dispositif sc.0) : split s'ouvre a la fissure, se creuse a la fracture + a la question,
  // NE SE REFERME JAMAIS (+ micro-respiration vivante). Translate diagonal (x + y*0.5) comme le proto.
  const splitOpen = interpolate(frame, [F_FISSURE, F_FISSURE + 24], [0, 16], clamp);
  const splitFrac = interpolate(frame, [F_FRACTURE - 10, F_FRACTURE + 30], [0, 12], clamp);
  const splitQ = interpolate(frame, [F_QUESTION, F_QUESTION + 50], [0, 10], clamp);
  const splitMicro = frame >= F_FISSURE ? 1.4 * Math.sin((frame - F_FISSURE) / 20) : 0;
  const split = splitOpen + splitFrac + splitQ
    + splitMicro * interpolate(frame, [F_FISSURE, F_FISSURE + 60], [0, 1], clamp);

  // tracage de la fissure (sc.0) + sa lueur, calee sur "se fissure"
  const crackProg = interpolate(frame, [F_FISSURE, F_FISSURE + 14], [0, 1], clamp);
  const faultPulse = 1 + 0.5 * Math.sin(frame * 0.22);
  const questionGlow = interpolate(frame, [F_QUESTION, F_QUESTION + 30], [0, 1], clamp);
  const faultGlow = interpolate(frame, [F_FISSURE + 6, F_FISSURE + 60], [0, 1], clamp);
  const fissureVisible = Math.max(0, (mapOp - 0.1) / 0.9) * interpolate(frame, [F_FISSURE - 2, F_FISSURE + 6], [0, 1], clamp);

  const mapTransform = `translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`;
  // une moitie du contour or (reutilisee pour les 2 cotes) — dessin + pulse
  const outlinePath = (
    <>
      <path d={SENEGAL_PATH} fill="rgba(200,169,81,0.045)" />
      {glowOp > 0.005 && (
        <path d={SENEGAL_PATH} fill="none" stroke={GOLD_HI} strokeWidth={(4 + 8 * pulse) / MAP_SCALE}
          strokeLinejoin="round" strokeLinecap="round" opacity={glowOp} style={{ filter: "blur(6px)" }} />
      )}
      <path d={SENEGAL_PATH} fill="none" stroke="url(#senOutline)" strokeWidth={outlineW} opacity={outlineOp}
        strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray={SENEGAL_PATH_LEN} strokeDashoffset={SENEGAL_PATH_LEN * (1 - draw)} />
    </>
  );

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="senOutline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={GOLD_HI} /><stop offset="100%" stopColor={GOLD} />
        </linearGradient>
        {/* clips de la faille (sc.0) : moitie A = au-dessus/gauche du zigzag, moitie B = en-dessous/droite */}
        <clipPath id="fracHalfA"><path d={`${FRACTURE_D} L ${MAP_X - 300} ${H + 300} L ${MAP_X - 300} ${-300} Z`} /></clipPath>
        <clipPath id="fracHalfB"><path d={`${FRACTURE_D} L ${W + 300} ${H + 300} L ${W + 300} ${-300} Z`} /></clipPath>
      </defs>

      <g opacity={mapOp}>
        {/* MOITIE A (haut-gauche) : translate -split, ecartement diagonal */}
        <g clipPath="url(#fracHalfA)" transform={`translate(${-split}, ${-split * 0.5})`}>
          <g transform={mapTransform}>{outlinePath}</g>
        </g>
        {/* MOITIE B (bas-droite) : translate +split */}
        <g clipPath="url(#fracHalfB)" transform={`translate(${split}, ${split * 0.5})`}>
          <g transform={mapTransform}>{outlinePath}</g>
        </g>
      </g>

      {/* FISSURE sc.0 : lueur or DIFFUSE + trait sombre profond qui se trace (zigzag brise) — jamais refermee */}
      {fissureVisible > 0.01 && (
        <g opacity={fissureVisible}>
          {/* lueur chaude diffuse (s'intensifie a la question) */}
          <path d={FRACTURE_D} fill="none" stroke={GOLD_HI}
            strokeWidth={(7 + 7 * faultPulse) + 10 * questionGlow}
            strokeLinejoin="round" strokeLinecap="round"
            opacity={(0.22 + 0.35 * questionGlow) * faultGlow * faultPulse}
            style={{ filter: "blur(11px)" }} />
          {/* gouffre sombre (profondeur de la faille ouverte) */}
          <path d={FRACTURE_D} fill="none" stroke="#0a0f1d"
            strokeWidth={6 + 4 * questionGlow + 1.5 * faultPulse}
            strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={2600} strokeDashoffset={2600 * (1 - crackProg)} />
          {/* coeur or lumineux dans la faille */}
          <path d={FRACTURE_D} fill="none" stroke={GOLD_HI}
            strokeWidth={3 + 2.5 * questionGlow + 1.0 * faultPulse}
            strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={2600} strokeDashoffset={2600 * (1 - crackProg)} />
        </g>
      )}
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  E2 — JETONS-MEDAILLES FAYE / SONKO (monogramme grave, arete striee, degrade radial metallique)
// ════════════════════════════════════════════════════════════════════════════════════════════
const Medallions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < F_FAYE - 12 || frame > F_E2_OUT + 70) return null;
  const blockOp = interpolate(frame, [F_FAYE - 8, F_FAYE + 20, F_E2_OUT, F_E2_OUT + 60], [0, 1, 1, 0], clamp);

  const fayeX = MAP_X - 175, sonkoX = MAP_X + MAP_W + 175;
  const figY = CENTER_Y - 20;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} opacity={blockOp}>
      <Medallion cx={fayeX} cy={figY} at={F_FAYE} letter="F" arrowAt={F_LIMOGE1}
        arrowDir="down" arrowLabel="LIMOGÉ" boltActive={false} boltAt={F_LIMOGE1} frame={frame} />
      <Medallion cx={sonkoX} cy={figY} at={F_SONKO} letter="S" arrowAt={F_ELU}
        arrowDir="up" arrowLabel="ÉLU" boltActive={true} boltAt={F_ELU} frame={frame} />
    </svg>
  );
};

const Medallion: React.FC<{
  cx: number; cy: number; at: number; letter: string;
  arrowAt: number; arrowDir: "up" | "down"; arrowLabel: string;
  boltActive: boolean; boltAt: number; frame: number;
}> = ({ cx, cy, at, letter, arrowAt, arrowDir, arrowLabel, boltActive, boltAt, frame }) => {
  if (frame < at - 10) return null;
  const R = 92;
  const dt = Math.max(0, Math.min(1, (frame - at) / 28));
  const fall = easeOutBack(dt);
  const dropY = interpolate(fall, [0, 1], [-160, 0], clamp);
  const rot = interpolate(dt, [0, 0.6, 1], [-14, 6, 0], clamp);
  const appear = interpolate(frame, [at - 6, at + 6], [0, 1], clamp);

  const radialId = `radial-${letter}`;
  // EPURE (regle Aziz) : pas de nom FAYE/SONKO en arc — le monogramme F/S dans le jeton suffit (zero ambiguite).
  const boltY = cy - R - 46;
  const boltOp = interpolate(frame, [boltAt, boltAt + 16], [0, 1], clamp);
  const boltPulse = boltActive ? 0.6 + 0.4 * Math.abs(Math.sin((frame - boltAt) / 6)) : 0.3;
  const ap = interpolate(frame, [arrowAt, arrowAt + 26], [0, 1], clamp);

  return (
    <g opacity={appear}>
      <defs>
        <radialGradient id={radialId} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#f4e4ba" />
          <stop offset="45%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#b8941f" />
        </radialGradient>
      </defs>

      <g opacity={boltOp * (boltActive ? boltPulse : 1)}>
        <Bolt cx={cx} cy={boltY} scale={1.25} dim={!boltActive} />
      </g>

      <g transform={`translate(0, ${dropY}) rotate(${rot} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke={GOLD_LO} strokeWidth={10} strokeDasharray="3 5" opacity={0.9} />
        <circle cx={cx} cy={cy} r={R} fill={`url(#${radialId})`} stroke={GOLD_HI} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={R - 14} fill="none" stroke="#9c7a26" strokeWidth={1.4} opacity={0.7} />
        <text x={cx + 2} y={cy + 44} textAnchor="middle" fontFamily={BEBAS} fontSize={150} fill="#8a6b1c" opacity={0.85}>{letter}</text>
        <text x={cx} y={cy + 42} textAnchor="middle" fontFamily={BEBAS} fontSize={150} fill="#fbeec4">{letter}</text>
      </g>

      {/* etiquettes LIMOGE / ELU conservees (gardees par Aziz) */}
      {ap > 0.02 && (
        arrowDir === "down"
          ? <DownArrow cx={cx} cy={cy + R + 40} progress={ap} label={arrowLabel} />
          : <RiseArrow cx={cx} cy={cy + R + 44} progress={ap} label={arrowLabel} />
      )}
    </g>
  );
};

const DownArrow: React.FC<{ cx: number; cy: number; progress: number; label: string }> = ({ cx, cy, progress, label }) => {
  const y1 = cy + 70 * progress;
  return (
    <g opacity={progress}>
      <line x1={cx} y1={cy} x2={cx} y2={y1} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
      {progress > 0.7 && <polygon points={`${cx},${y1 + 6} ${cx - 13},${y1 - 12} ${cx + 13},${y1 - 12}`} fill={GOLD} />}
      <text x={cx} y={y1 + 38} textAnchor="middle" fill={GOLD} fontFamily={BEBAS} fontSize={32} letterSpacing="3">{label}</text>
    </g>
  );
};
const RiseArrow: React.FC<{ cx: number; cy: number; progress: number; label: string }> = ({ cx, cy, progress, label }) => {
  // courte fleche qui monte depuis cy ; label EN-DESSOUS (caption, degage de l'arc du nom au-dessus)
  const y1 = cy - 54 * progress;
  return (
    <g opacity={progress}>
      <line x1={cx} y1={cy} x2={cx} y2={y1} stroke={IVORY} strokeWidth={5} strokeLinecap="round" />
      {progress > 0.7 && <polygon points={`${cx},${y1 - 6} ${cx - 13},${y1 + 12} ${cx + 13},${y1 + 12}`} fill={IVORY} />}
      <text x={cx} y={cy + 34} textAnchor="middle" fill={IVORY} fontFamily={BEBAS} fontSize={32} letterSpacing="3" opacity={progress}>{label}</text>
    </g>
  );
};

const Bolt: React.FC<{ cx: number; cy: number; scale?: number; dim?: boolean }> = ({ cx, cy, scale = 1, dim = false }) => (
  <g transform={`translate(${cx} ${cy}) scale(${scale})`}
     style={{ filter: dim ? "none" : "drop-shadow(0 0 8px rgba(232,196,114,0.8))" }}>
    <path d="M -11 -42 L 9 -8 L -4 -4 L 13 42 L -7 4 L 4 0 Z"
      fill={dim ? "#5a5238" : GOLD_HI} stroke={dim ? "#46402a" : GOLD} strokeWidth={1.5} strokeLinejoin="round" />
  </g>
);

// ════════════════════════════════════════════════════════════════════════════════════════════
//  TEXTES PAR ETAT
// ════════════════════════════════════════════════════════════════════════════════════════════
// EPURE (regle Aziz) : la VOIX porte le recit. SEUL le texte ESSENTIEL et NON-dit reste a l'ecran.
// On ne garde QUE la question pivot "AU NOM DE QUI FAUT-IL LA GOUVERNER ?" (interessante a lire).
// Supprimes : ÉPILOGUE, UN PAYS QUI S'ENRICHIT, UN GOUVERNEMENT QUI SAUTE, LIMOGE D'UN COTE / PLUS PUISSANT.
const StateTexts: React.FC = () => {
  const frame = useCurrentFrame();
  const qOp = interpolate(frame, [F_QUESTION, F_QUESTION + 30, F_Q_OUT, F_Q_OUT + 40], [0, 1, 1, 0], clamp);
  const qScale = interpolate(frame, [F_QUESTION, F_QUESTION + 40], [0.9, 1], clamp);
  return (
    <div style={{
      position: "absolute", top: "50%", left: 0, width: "100%", textAlign: "center",
      transform: `translateY(-50%) scale(${qScale})`, opacity: qOp,
      color: IVORY, fontFamily: BEBAS, fontSize: 76, letterSpacing: "0.04em", lineHeight: 1.05,
      textShadow: "0 0 28px rgba(22,33,58,0.95)", padding: "0 120px",
    }}>
      AU NOM DE QUI<br />FAUT-IL LA GOUVERNER ?
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  E4 — PONT AES : 3 drapeaux PREMIUM, c'est le DERNIER PLAN — TENU jusqu'a la FIN de l'audio.
//  Les drapeaux apparaissent, "ILS ONT CHOISI LA RUPTURE" passe, puis ils MONTENT un peu pour laisser
//  la place au CTA en-dessous (SubscribeCTA), et RESTENT avec leur ondulation jusqu'a END.
// ════════════════════════════════════════════════════════════════════════════════════════════
// hauteur de remontee des drapeaux quand le CTA arrive (laisse la place au texte CTA dessous)
const AES_CTA_SHIFT = 150;
const AES_BASE_Y = H / 2 - 165 / 2 - 30; // position d'origine (un peu au-dessus du centre)

const AesBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < F_MALI - 24) return null;
  // TENU jusqu'a END : pas de fade-out a F_PROCHAINE. Seul un fondu final tres tardif (F_FADE->END).
  const blockOp = interpolate(frame, [F_MALI - 12, F_MALI + 20, F_FADE, END], [0, 1, 1, 0], clamp);

  const fW = 260, fH = 165, gap = 90;
  const totalW = fW * 3 + gap * 2;
  const startX = W / 2 - totalW / 2;
  // les drapeaux remontent quand le CTA arrive (F_PROCHAINE) pour degager la place dessous
  const shift = interpolate(frame, [F_PROCHAINE, F_PROCHAINE + 30], [0, AES_CTA_SHIFT], clamp);
  const baseY = AES_BASE_Y - shift;
  const flags = [
    { at: F_MALI, x: startX, name: "MALI", kind: "mali" as const, off: 0 },
    { at: F_BURKINA, x: startX + fW + gap, name: "BURKINA", kind: "burkina" as const, off: 1.7 },
    { at: F_NIGER, x: startX + (fW + gap) * 2, name: "NIGER", kind: "niger" as const, off: 3.4 },
  ];
  const linkTrace = interpolate(frame, [F_MALI, F_NIGER + 20], [0, 1], clamp);
  const linkY = baseY + fH / 2;
  const linkLen = totalW;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} opacity={blockOp}>
      <line x1={startX + 20} y1={linkY} x2={startX + totalW - 20} y2={linkY}
        stroke={GOLD} strokeWidth={1.6} opacity={0.4}
        strokeDasharray={linkLen} strokeDashoffset={linkLen * (1 - linkTrace)} />

      {flags.map((fl) => {
        const unroll = spring({ fps, frame: Math.max(0, frame - fl.at), config: { damping: 16, stiffness: 110 }, durationInFrames: 28 });
        const op = interpolate(frame, [fl.at, fl.at + 10], [0, 1], clamp);
        return (
          <g key={fl.name} opacity={op}>
            <WavyFlag x={fl.x} y={baseY} w={fW} h={fH} kind={fl.kind} unroll={unroll} waveOffset={fl.off} frame={frame} />
            <text x={fl.x + fW / 2} y={baseY + fH + 52} textAnchor="middle" fill={GOLD}
              fontFamily={BEBAS} fontSize={46} letterSpacing="3" opacity={interpolate(unroll, [0.5, 1], [0, 1], clamp)}>{fl.name}</text>
          </g>
        );
      })}
    </svg>
  );
};

// drapeau ondule (bandes en paths dont les Y de controle varient en sin, dephase par drapeau)
const WavyFlag: React.FC<{ x: number; y: number; w: number; h: number; kind: "mali" | "burkina" | "niger"; unroll: number; waveOffset: number; frame: number }> =
({ x, y, w, h, kind, unroll, waveOffset, frame }) => {
  const sx = interpolate(unroll, [0, 1], [0.02, 1], clamp);
  const amp = 7, speed = 0.07;
  const waveAt = (col: number) => Math.sin(col * 2.2 + frame * speed + waveOffset) * amp;
  const band = (yTop: number, yBot: number, fill: string, key: string) => {
    const steps = 14;
    let d = `M ${x} ${y + yTop + waveAt(0)}`;
    for (let i = 1; i <= steps; i++) { const c = i / steps * w; d += ` L ${x + c} ${y + yTop + waveAt(c / 40)}`; }
    for (let i = steps; i >= 0; i--) { const c = i / steps * w; d += ` L ${x + c} ${y + yBot + waveAt(c / 40)}`; }
    d += " Z";
    return <path key={key} d={d} fill={fill} />;
  };
  const vband = (xL: number, xR: number, fill: string, key: string) => {
    const steps = 14;
    let d = `M ${x + xL + waveAt(0)} ${y}`;
    for (let i = 1; i <= steps; i++) { const c = i / steps * h; d += ` L ${x + xL + waveAt(c / 30)} ${y + c}`; }
    for (let i = steps; i >= 0; i--) { const c = i / steps * h; d += ` L ${x + xR + waveAt(c / 30)} ${y + c}`; }
    d += " Z";
    return <path key={key} d={d} fill={fill} />;
  };

  const cx = x + w / 2, cy = y + h / 2;
  let content: React.ReactNode;
  if (kind === "mali") {
    content = (<>
      {vband(0, w / 3, "#1aa544", "g")}
      {vband(w / 3, (2 * w) / 3, "#e8c01f", "y")}
      {vband((2 * w) / 3, w, "#c81f2e", "r")}
    </>);
  } else if (kind === "burkina") {
    content = (<>
      {band(0, h / 2, "#d62b2d", "r")}
      {band(h / 2, h, "#0f8f46", "g")}
      <g transform={`translate(0, ${waveAt(w / 2 / 40)})`}><StarShape cx={cx} cy={cy} r={32} color="#e8c01f" /></g>
    </>);
  } else {
    content = (<>
      {band(0, h / 3, "#d4570f", "o")}
      {band(h / 3, (2 * h) / 3, "#eef0ec", "w")}
      {band((2 * h) / 3, h, "#0fa030", "g")}
      <circle cx={cx + waveAt(w / 2 / 40)} cy={cy} r={26} fill="#d4570f" />
    </>);
  }

  return (
    <g transform={`translate(${x}, ${cy}) scale(${sx}, 1) translate(${-x}, ${-cy})`}>
      {content}
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={4} fill="none" stroke={GOLD} strokeWidth={2.5} />
    </g>
  );
};

const StarShape: React.FC<{ cx: number; cy: number; r: number; color: string }> = ({ cx, cy, r, color }) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`);
  }
  return <polygon points={pts.join(" ")} fill={color} />;
};

// ════════════════════════════════════════════════════════════════════════════════════════════
//  CTA
// ════════════════════════════════════════════════════════════════════════════════════════════
const SubscribeCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < F_PROCHAINE - 15) return null;
  const fadeOut = interpolate(frame, [F_FADE, END], [1, 0], clamp);
  const titleIn = spring({ fps, frame: Math.max(0, frame - F_PROCHAINE), config: { damping: 16, stiffness: 80 }, durationInFrames: 30 });
  const titleScale = interpolate(titleIn, [0, 1], [0.86, 1], clamp);
  const titleOp = interpolate(frame, [F_PROCHAINE, F_PROCHAINE + 20], [0, 1], clamp) * fadeOut;
  const bellIn = spring({ fps, frame: Math.max(0, frame - F_ABONNEZ), config: { damping: 11, stiffness: 140 }, durationInFrames: 24 });
  const bellOp = interpolate(frame, [F_ABONNEZ, F_ABONNEZ + 16], [0, 1], clamp) * fadeOut;
  const bellSwing = Math.sin((frame - F_ABONNEZ) / 5) * (6 * Math.max(0, 1 - (frame - F_ABONNEZ) / 40));
  const viteOp = interpolate(frame, [F_VITE, F_VITE + 12], [0, 1], clamp) * fadeOut;

  // CTA dans le TIERS BAS (sous les drapeaux remontes) — drapeaux + CTA coexistent jusqu'a la fin.
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 80 }}>
      <div style={{ opacity: titleOp, color: GOLD, fontFamily: BEBAS, fontSize: 36, letterSpacing: "0.3em", marginBottom: 6 }}>À SUIVRE</div>
      <div style={{
        opacity: titleOp, transform: `scale(${titleScale})`,
        color: IVORY, fontFamily: BEBAS, fontSize: 120, letterSpacing: "0.02em", lineHeight: 1,
        textShadow: "0 0 40px rgba(22,33,58,0.9)",
      }}>LA PROCHAINE VIDÉO</div>
      <div style={{ opacity: titleOp, width: 320, height: 3, background: GOLD, marginTop: 14, borderRadius: 2 }} />
      <div style={{ opacity: bellOp, marginTop: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <svg width={56} height={64} viewBox="0 0 64 72">
          <g transform={`rotate(${bellSwing} 32 8) scale(${interpolate(bellIn, [0, 1], [0.7, 1], clamp)})`} style={{ transformOrigin: "32px 8px" }}>
            <path d="M 32 8 C 46 8 52 22 52 40 L 58 52 L 6 52 L 12 40 C 12 22 18 8 32 8 Z" fill="none" stroke={GOLD} strokeWidth={3.5} strokeLinejoin="round" />
            <path d="M 24 52 a 8 8 0 0 0 16 0" fill="none" stroke={GOLD} strokeWidth={3.5} />
            <circle cx={32} cy={6} r={3.5} fill={GOLD} />
          </g>
        </svg>
        <span style={{ color: GOLD, fontFamily: BEBAS, fontSize: 42, letterSpacing: "0.12em" }}>ABONNEZ-VOUS</span>
      </div>
      <div style={{ opacity: viteOp, marginTop: 26, color: "rgba(242,239,230,0.85)", fontFamily: BEBAS, fontSize: 46, letterSpacing: "0.16em" }}>À TRÈS VITE</div>
    </AbsoluteFill>
  );
};

// (la fissure est reutilisee de la scene 0 = FRACTURE_D / fracturePath, voir en tete de fichier)

// ── SFX cales (Sequence layout="none") ──
const SFX = {
  fissure: "_shared/sfx/impact/impact.mp3",
  pressure: "_shared/sfx/impact/tension-pulse.mp3",
  snap: "_shared/sfx/warmap/cedeao-snap.mp3",
  arrow: "_shared/sfx/warmap/arrow-whoosh.mp3",
  whoosh: "_shared/sfx/ui/whoosh.mp3",
  gong: "_shared/sfx/warmap/liptako-gong.mp3",
  node: "_shared/sfx/ui/node-appear.mp3",
  tick: "_shared/sfx/data/stat-tick.mp3",
};
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    <Sfx at={F_MACHINE} src={SFX.node} volume={0.34} dur={20} />
    <Sfx at={F_100K - 8} src={SFX.tick} volume={0.3} dur={10} />
    <Sfx at={F_FISSURE} src={SFX.fissure} volume={0.5} dur={44} />
    <Sfx at={F_FISSURE} src={SFX.pressure} volume={0.32} dur={120} />
    <Sfx at={F_FAYE} src={SFX.node} volume={0.4} dur={20} />
    <Sfx at={F_LIMOGE1} src={SFX.snap} volume={0.5} dur={30} />
    <Sfx at={F_SONKO} src={SFX.node} volume={0.4} dur={20} />
    <Sfx at={F_ELU} src={SFX.arrow} volume={0.46} dur={20} />
    <Sfx at={F_FRACTURE} src={SFX.pressure} volume={0.32} dur={90} />
    <Sfx at={F_QUESTION} src={SFX.tick} volume={0.3} dur={10} />
    <Sfx at={F_MALI - 6} src={SFX.gong} volume={0.42} dur={75} />
    <Sfx at={F_MALI} src={SFX.whoosh} volume={0.4} dur={30} />
    <Sfx at={F_BURKINA} src={SFX.whoosh} volume={0.36} dur={30} />
    <Sfx at={F_NIGER} src={SFX.whoosh} volume={0.36} dur={30} />
    <Sfx at={F_ABONNEZ} src={SFX.node} volume={0.42} dur={20} />
  </>
);

export const SCENE_BONUS_V3_FRAMES = END;
export default SceneBonusV3;

// MOTEUR: objet/metaphore SVG — le paradoxe est MECANIQUE (deux verrous, l'un ouvert l'autre
// ferme, inverses d'un camp a l'autre), pas spatial. On QUITTE la carte pour clore l'acte : les
// segments A et B l'ont deja portee, et le beat parle d'une contrainte, pas d'un territoire.
//
// GazoducActe3Verrou — Acte 3, SEGMENT C (cloture), 17,3 s.
//
// Decor : src/projects/_rnd/svg-scenes/GazoducVerrouCroise.svg (Fable 5, 20 groupes animables).
// ⛔ Le SVG est la SOURCE DU DECOR. Ici on ne redessine rien : on importe et on anime les groupes.
// Concept : Grok (phase 1 texte). Planche de storyboard : Grok Imagine 2.0.
//
// Ce que la scene raconte, sans un mot a l'ecran :
//   Temps 1 (MAROC)   : la vanne SECURITE est grande ouverte, le fluide avance... et bute sur la
//                       vanne FINANCEMENT, fermee par un mecanisme fragile. Il ne passe pas.
//   Temps 2 (ALGERIE) : exactement l'inverse. Le financement est verrouille cote acquis (disques),
//                       mais la vanne suivante est prise dans les barbeles et les fissures.
//   Dans les deux cas quelque chose pousse et n'arrive jamais — mais pas au meme endroit.
//
// ⛔ 2 REGLES DE L'EPISODE APPLIQUEES ICI :
//  1. Rien a l'ecran, texte OU geste, ne redit ce que la voix dit au meme instant. Les seuls textes
//     sont les plaques de noms (elles identifient, elles n'expliquent pas).
//  2. Timing AUDIO-DERIVE : tout est cale sur BEATS_C (forced-align), jamais une frame en dur.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS_C, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "./GazoducActe3Timing";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);
const B = BEATS_C;

// Geometrie reprise du SVG source (ne pas la deviner : ces valeurs SONT dans le fichier).
const PIPE_X0 = 60;        // debut du volume interieur
const PIPE_FRONT_MAX = 1266; // x ou le fluide bute sur l'opercule de la vanne 2
const PIPE_Y = 482;
const PIPE_H = 116;

// Bascule Maroc -> Algerie : cale sur "L'Algerie mise sur..." (forced-align).
const SWITCH = B.algerieStart;

/**
 * Revele un fluide de gauche a droite via un clip rectangulaire dont la largeur est animee.
 * ⛔ On NE change PAS la geometrie du path (il est dessine plein dans le SVG, exprès) : on
 * decouvre une portion. C'est ce que le decor a ete concu pour recevoir.
 */
const FluideClip: React.FC<{ id: string; frontX: number; children: React.ReactNode; opacity: number }> = ({
  id, frontX, children, opacity,
}) => (
  <g opacity={opacity}>
    <defs>
      <clipPath id={id}>
        <rect x={PIPE_X0} y={PIPE_Y} width={Math.max(0, frontX - PIPE_X0)} height={PIPE_H} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);

export const GazoducActe3Verrou: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===== TEMPS 1 — MAROC (0 -> 7,86 s) =====
  // Le fluide avance pendant que la voix dit "un trace pacifie", et bute AVANT la fin de la
  // phrase : le blocage doit etre visible quand elle dit "mais suspendu".
  const frontOr = interpolate(
    frame,
    [B.marocStart, B.marocPhraseEnd - S(1.5)],
    [PIPE_X0 + 260, PIPE_FRONT_MAX],
    { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 2.2) },
  );
  const orBute = frame >= B.marocPhraseEnd - S(1.5);
  // Il pousse et ne passe pas : micro-oscillation une fois arrive.
  const pousseeOr = orBute ? Math.sin((frame - B.marocPhraseEnd) * 0.42) * 5 : 0;

  // Volant 1 (securite) : tourne tant que le fluide avance, s'arrete net quand il bute.
  const rotVolant1 = interpolate(
    frame,
    [B.marocStart, B.marocPhraseEnd - S(1.5)],
    [0, 320],
    { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 2.2) },
  );

  // Volant 2 (financement) : tentatives AVORTEES quand le fluide bute — il ne tourne jamais
  // en continu. 3 secousses spring qui retombent a zero.
  const tentative = (n: number) => {
    const t0 = B.marocPhraseEnd - S(1.1) + n * S(0.62);
    const s = spring({ frame: frame - t0, fps, config: { damping: 9, mass: 0.5 }, durationInFrames: S(0.5) });
    const back = interpolate(frame, [t0 + S(0.5), t0 + S(0.75)], [1, 0], clampB);
    return frame < t0 ? 0 : s * 8 * back;
  };
  const rotVolant2 = tentative(0) + tentative(1) + tentative(2);

  // Le mecanisme fin pulse faiblement : fragile, sous tension.
  const pulseMecanisme = orBute ? 0.72 + 0.18 * (0.5 + 0.5 * Math.sin(frame * 0.28)) : 0.9;

  // ===== BASCULE (7,0 -> 7,86 s) =====
  const outMaroc = interpolate(frame, [SWITCH - S(0.85), SWITCH], [1, 0], clampB);
  const inAlgerie = interpolate(frame, [SWITCH, SWITCH + S(0.9)], [0, 1], clampB);

  // ===== TEMPS 2 — ALGERIE (7,86 -> 17,3 s) =====
  // Les disques se verrouillent d'abord (le financement est acquis), PUIS le fluide repart.
  const disquesReveal = interpolate(frame, [SWITCH - S(0.2), SWITCH + S(0.8)], [0, 1], clampB);
  const disquesScale = interpolate(disquesReveal, [0, 1], [0.9, 1], clampB);

  const frontCyan = interpolate(
    frame,
    [SWITCH + S(0.5), SWITCH + S(6.0)],
    [PIPE_X0 + 260, PIPE_FRONT_MAX],
    { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 2.2) },
  );
  const cyanBute = frame >= SWITCH + S(6.0);
  const pousseeCyan = cyanBute ? Math.sin((frame - SWITCH) * 0.42) * 5 : 0;

  // Barbeles puis fissures : la menace arrive APRES que le fluide a bute, pas avant.
  const barbelesOp = interpolate(frame, [SWITCH + S(5.2), SWITCH + S(6.8)], [0, 1], clampB);
  // Fissures par saccades (escalier), pas un fondu lineaire : c'est une rupture, pas un voile.
  const fissuresRaw = interpolate(frame, [SWITCH + S(6.6), SWITCH + S(8.6)], [0, 1], clampB);
  const fissuresOp = Math.min(1, Math.round(fissuresRaw * 5) / 5);
  const halo = cyanBute ? 0.75 + 0.25 * Math.sin(frame * 0.16) : 1;

  // Frames de butee, extraites pour caler les SFX EXACTEMENT sur le geste visuel.
  const buteOrF = B.marocPhraseEnd - S(1.5);
  const buteCyanF = SWITCH + S(6.0);

  // ===== CAMERA — zoom leger + derive lente, jamais figee =====
  // Centre de la conduite dans le SVG source : (960, 540). On zoome autour de ce point.
  // ⚠️ 1.30 coupait la plaque de nom en haut ET les extremites de la conduite (constate au
  // still frame 90). 1.12 -> 1.20 : le plan se remplit sans rien perdre.
  const camScale = interpolate(frame, [0, B.segEnd], [1.12, 1.20], clampB);
  const camDx = interpolate(frame, [0, B.segEnd], [-26, 20], clampB);
  const camDy = interpolate(frame, [0, B.segEnd], [16, 2], clampB);
  const camTx = W / 2 - 960 * camScale + camDx;
  // ⚠️ Le SVG place la conduite a y=540 mais tout le bas de l'ecran restait mort au rendu.
  // On recentre sur le VOLUME REEL de la scene (conduite + volants, centre ~y=430) pour
  // que le poids visuel occupe le cadre au lieu de flotter en haut.
  const camTy = H / 2 - 430 * camScale + camDy;

  // Fondu d'entree/sortie du plan.
  const globalFade = interpolate(
    frame,
    [0, S(0.5), B.segEnd + 9 - S(0.5), B.segEnd + 9],
    [0, 1, 1, 0],
    clampB,
  );

  return (
    <AbsoluteFill style={{ background: "#050c1a", opacity: globalFade }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* Le SVG source dessine la conduite dans une bande centrale etroite (y 444-636), ce qui
            laissait ~40 % de l'ecran vide en haut ET en bas au 1er rendu. On agrandit l'echelle
            autour du centre de la conduite et on derive tres lentement : le plan respire sans que
            rien ne "glisse sans but". La camera n'est jamais figee (regle de l'episode). */}
        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
        <defs>
          <radialGradient id="vFond" cx="50%" cy="46%" r="72%">
            <stop offset="0%" stopColor="#0d1f38" />
            <stop offset="100%" stopColor="#050c1a" />
          </radialGradient>
          <linearGradient id="vInterieur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1f38" />
            <stop offset="100%" stopColor="#050c1a" />
          </linearGradient>
          <linearGradient id="vVide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#050c1a" />
            <stop offset="100%" stopColor="#040a15" />
          </linearGradient>
          <linearGradient id="vOr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE38A" />
            <stop offset="55%" stopColor="#FFC742" />
            <stop offset="100%" stopColor="#E0A32C" />
          </linearGradient>
          <linearGradient id="vCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FE4FF" />
            <stop offset="55%" stopColor="#00C4FF" />
            <stop offset="100%" stopColor="#0090C4" />
          </linearGradient>
          <radialGradient id="vAmbOr" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC742" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FFC742" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vAmbCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C4FF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00C4FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vHaloRouge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4B45" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF4B45" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* fond */}
        <rect x={0} y={0} width={W} height={H} fill="url(#vFond)" />

        {/* ambiances : crossfade Maroc -> Algerie */}
        <ellipse cx={700} cy={540} rx={780} ry={330} fill="url(#vAmbOr)" opacity={outMaroc} />
        <ellipse cx={900} cy={540} rx={860} ry={350} fill="url(#vAmbCyan)" opacity={inAlgerie} />

        {/* conduite_interieur : volume creux + zone morte au-dela de la vanne 2 */}
        <rect x={PIPE_X0} y={PIPE_Y} width={1800} height={PIPE_H} fill="url(#vInterieur)" />
        <rect x={1294} y={PIPE_Y} width={566} height={PIPE_H} fill="url(#vVide)" />

        {/* ===== FLUIDES (clippes par le volume interieur) ===== */}
        <g transform={`translate(${pousseeOr} 0)`}>
          <FluideClip id="clipOr" frontX={frontOr} opacity={outMaroc}>
            <path d="M 60 484 L 1236 484 Q 1266 484 1266 540 Q 1266 596 1236 596 L 60 596 Z" fill="url(#vOr)" />
            <rect x={76} y={496} width={1120} height={13} rx={6.5} fill="#FFE38A" opacity={0.5} />
            <circle cx={300} cy={556} r={5} fill="#FFE38A" opacity={0.45} />
            <circle cx={760} cy={528} r={4} fill="#FFE38A" opacity={0.35} />
            <circle cx={1050} cy={562} r={3.5} fill="#FFE38A" opacity={0.4} />
          </FluideClip>
        </g>
        <g transform={`translate(${pousseeCyan} 0)`}>
          <FluideClip id="clipCyan" frontX={frontCyan} opacity={inAlgerie}>
            <path d="M 60 484 L 1236 484 Q 1266 484 1266 540 Q 1266 596 1236 596 L 60 596 Z" fill="url(#vCyan)" />
            <rect x={76} y={496} width={1120} height={13} rx={6.5} fill="#7FE4FF" opacity={0.5} />
            <circle cx={340} cy={556} r={5} fill="#7FE4FF" opacity={0.45} />
            <circle cx={800} cy={528} r={4} fill="#7FE4FF" opacity={0.35} />
            <circle cx={1090} cy={562} r={3.5} fill="#7FE4FF" opacity={0.4} />
          </FluideClip>
        </g>

        {/* ===== CONDUITE (parois + brides) — dessinee PAR-DESSUS le fluide ===== */}
        <g id="conduite_corps">
          <rect x={PIPE_X0} y={452} width={1800} height={30} fill="#16304f" stroke="#58809f" strokeWidth={1.5} />
          <rect x={PIPE_X0} y={598} width={1800} height={30} fill="#16304f" stroke="#58809f" strokeWidth={1.5} />
          {[120, 410, 545, 730, 950, 1175, 1345, 1650, 1840].map((x, i) => (
            <g key={`bride-${i}`}>
              <rect x={x - 12} y={444} width={24} height={46} rx={3} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.2} />
              <rect x={x - 12} y={590} width={24} height={46} rx={3} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.2} />
              <circle cx={x} cy={467} r={3} fill="#58809f" />
              <circle cx={x} cy={613} r={3} fill="#58809f" />
            </g>
          ))}
        </g>

        {/* ===== VANNE 1 — SECURITE (x=640) ===== */}
        <g id="vanne1_corps">
          <rect x={578} y={444} width={124} height={44} rx={4} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <rect x={578} y={592} width={124} height={44} rx={4} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <rect x={612} y={392} width={56} height={56} rx={4} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <rect x={634} y={300} width={12} height={96} fill="#58809f" />
          {/* levres de siege : le passage est OUVERT */}
          <path d="M 616 488 L 664 488 L 640 512 Z" fill="#16304f" stroke="#58809f" strokeWidth={1.2} />
          <path d="M 616 592 L 664 592 L 640 568 Z" fill="#16304f" stroke="#58809f" strokeWidth={1.2} />
        </g>
        {/* volant : origine locale = axe, un rotate() suffit */}
        <g transform={`translate(640 258) rotate(${rotVolant1})`} opacity={outMaroc}>
          <circle cx={0} cy={0} r={62} fill="none" stroke="#58809f" strokeWidth={9} />
          <circle cx={0} cy={0} r={12} fill="#58809f" />
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1={-58} y1={0} x2={58} y2={0} stroke="#58809f" strokeWidth={7}
              transform={`rotate(${a})`} strokeLinecap="round" />
          ))}
          <circle cx={0} cy={-62} r={7} fill="#FFC742" />
          <circle cx={0} cy={0} r={5} fill="#FFC742" />
        </g>
        {/* meme volant, teinte cyan au temps 2 */}
        <g transform={`translate(640 258) rotate(${rotVolant1})`} opacity={inAlgerie}>
          <circle cx={0} cy={0} r={62} fill="none" stroke="#58809f" strokeWidth={9} />
          <circle cx={0} cy={0} r={12} fill="#58809f" />
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1={-58} y1={0} x2={58} y2={0} stroke="#58809f" strokeWidth={7}
              transform={`rotate(${a})`} strokeLinecap="round" />
          ))}
          <circle cx={0} cy={-62} r={7} fill="#00C4FF" />
          <circle cx={0} cy={0} r={5} fill="#00C4FF" />
        </g>
        {/* disques verrouilles (temps 2) : le financement est acquis, il est BLOQUE EN POSITION */}
        <g transform={`translate(640 336) scale(${disquesScale})`} opacity={disquesReveal * inAlgerie}>
          {/* ⚠️ Elargis et espaces : a la 1re version ils se confondaient avec la tige de la vanne
              au rendu. Ils portent "ses propres fonds" — ils doivent se lire d'un coup d'oeil. */}
          {[0, 40, 80].map((dy, i) => (
            <g key={`disq-${i}`} transform={`translate(0 ${dy})`}>
              <ellipse cx={0} cy={0} rx={92} ry={17} fill="#071a2d" stroke="#00C4FF" strokeWidth={3} />
              <ellipse cx={0} cy={-4} rx={92} ry={17} fill="#0d3a56" stroke="#7FE4FF" strokeWidth={2} />
              <rect x={-56} y={-9} width={112} height={7} rx={3.5} fill="#00C4FF" opacity={0.75} />
              <circle cx={-70} cy={-4} r={4} fill="#7FE4FF" />
              <circle cx={70} cy={-4} r={4} fill="#7FE4FF" />
            </g>
          ))}
        </g>

        {/* ===== VANNE 2 — FINANCEMENT / SECURITE selon le camp (x=1280) ===== */}
        <g id="vanne2_corps">
          <rect x={1236} y={444} width={88} height={44} rx={4} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <rect x={1236} y={592} width={88} height={44} rx={4} fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <path d="M 1248 444 L 1312 444 L 1296 400 L 1264 400 Z" fill="#1b3a5e" stroke="#58809f" strokeWidth={1.6} />
          <rect x={1274} y={300} width={12} height={104} fill="#58809f" />
        </g>
        {/* opercule : la lame qui FERME — fermee dans les deux temps, c'est le meme blocage physique */}
        <g id="vanne2_opercule" transform={`translate(0 ${orBute || cyanBute ? Math.sin(frame * 0.7) * 1.6 : 0})`}>
          <rect x={1270} y={484} width={20} height={112} rx={3} fill="#1b3a5e" stroke="#7FD8FF" strokeWidth={2} />
        </g>
        {/* mecanisme arachneen (temps 1) : fragile, sous tension */}
        <g opacity={outMaroc * pulseMecanisme}>
          <circle cx={1280} cy={252} r={44} fill="none" stroke="#FFC742" strokeWidth={1} strokeDasharray="3 5" opacity={0.7} />
          {[-30, -12, 12, 30].map((dx, i) => (
            <line key={`fil-${i}`} x1={1280 + dx} y1={296} x2={1280 - dx * 1.4} y2={352}
              stroke="#FFC742" strokeWidth={1.2} opacity={0.85} />
          ))}
          {[-22, 0, 22].map((dx, i) => (
            <circle key={`n-${i}`} cx={1280 + dx} cy={324} r={2.4} fill="#FFC742" opacity={0.9} />
          ))}
        </g>
        {/* volant 2 : tentatives avortees, ne tourne JAMAIS en continu */}
        <g transform={`translate(1280 252) rotate(${rotVolant2})`}>
          <circle cx={0} cy={0} r={40} fill="none" stroke="#58809f" strokeWidth={4} />
          <circle cx={0} cy={0} r={7} fill="#58809f" />
          {[0, 60, 120].map((a) => (
            <line key={a} x1={-38} y1={0} x2={38} y2={0} stroke="#58809f" strokeWidth={3.4}
              transform={`rotate(${a})`} strokeLinecap="round" />
          ))}
        </g>
        {/* barbeles (temps 2) */}
        <g opacity={barbelesOp * inAlgerie}>
          {[470, 520, 570, 620].map((y, i) => (
            <g key={`bb-${i}`}>
              <path d={`M 1216 ${y} Q 1250 ${y - 14} 1284 ${y} T 1352 ${y}`} fill="none"
                stroke="#8FA6BF" strokeWidth={2.2} />
              {[1232, 1268, 1304, 1340].map((x, j) => (
                <g key={`sp-${j}`} stroke="#8FA6BF" strokeWidth={2} strokeLinecap="round">
                  <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y + 7} />
                  <line x1={x + 7} y1={y - 7} x2={x - 7} y2={y + 7} />
                </g>
              ))}
            </g>
          ))}
        </g>
        {/* fissures rouges + halo (temps 2, en dernier) */}
        <g opacity={fissuresOp * inAlgerie}>
          <ellipse cx={1284} cy={540} rx={150} ry={130} fill="url(#vHaloRouge)" opacity={halo} />
          <path d="M 1284 402 L 1272 452 L 1292 486 L 1268 540 L 1290 592 L 1276 636"
            fill="none" stroke="#FF4B45" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 1272 452 L 1240 436 M 1292 486 L 1326 470 M 1268 540 L 1232 548 M 1290 592 L 1330 606"
            fill="none" stroke="#FF4B45" strokeWidth={2.4} strokeLinecap="round" />
        </g>

        {/* ===== PLAQUES DE NOM — elles IDENTIFIENT, elles n'expliquent pas ===== */}
        <g transform="translate(960 122)" opacity={outMaroc}>
          <rect x={-200} y={-38} width={400} height={76} rx={12} fill="#0d1f38" stroke="#FFC742" strokeWidth={2} />
          <rect x={-172} y={-20} width={7} height={40} rx={3.5} fill="#FFC742" />
          <text x={16} y={13} textAnchor="middle" fill="#F4F8FF" fontSize={40} fontWeight={700}
            fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.18em">MAROC</text>
        </g>
        <g transform="translate(960 122)" opacity={inAlgerie}>
          <rect x={-200} y={-38} width={400} height={76} rx={12} fill="#0d1f38" stroke="#00C4FF" strokeWidth={2} />
          <rect x={-172} y={-20} width={7} height={40} rx={3.5} fill="#00C4FF" />
          <text x={16} y={13} textAnchor="middle" fill="#F4F8FF" fontSize={40} fontWeight={700}
            fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.18em">ALGÉRIE</text>
        </g>
        </g>
      </svg>

      {/* ===== SFX — banque partagee, sauf le craquement (genere pour cette scene) =====
          ⛔ TOUJOURS via <Sequence>, JAMAIS `{frame === X && <Audio/>}` : ce dernier rend le son
          inaudible au render (3 beats livres muets, cf FICHE-AUDIO). Plancher de volume 0.50. */}
      <Sequence from={buteOrF} durationInFrames={S(1.6)}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      {[0, 1, 2].map((n) => (
        <Sequence key={`tt-${n}`} from={B.marocPhraseEnd - S(1.1) + n * S(0.62)} durationInFrames={S(0.9)}>
          <Audio src={staticFile("_shared/sfx/ui/stamp-dossier.mp3")} volume={0.42} />
        </Sequence>
      ))}
      <Sequence from={SWITCH - S(0.2)} durationInFrames={S(1.4)}>
        <Audio src={staticFile("_shared/sfx/ui/vault-lock.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={buteCyanF} durationInFrames={S(1.6)}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={SWITCH + S(6.6)} durationInFrames={S(1.4)}>
        <Audio src={staticFile("_shared/sfx/impact/metal-crack.mp3")} volume={0.58} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const GAZODUC_A3_VERROU_FRAMES = GAZODUC_A3_INSERT_PARADOXE_FRAMES;

export default GazoducActe3Verrou;

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, Sequence, staticFile } from "remotion";
import {
  NUIT_DEFS, NUIT_CIEL, NUIT_ETOILES, NUIT_LUNE, NUIT_LUNE_CX, NUIT_LUNE_CY,
  NUIT_VILLE_LOINTAINE, NUIT_SOL, NUIT_MAISONS, NUIT_CHAMBRE, NUIT_LIT, NUIT_DORMEUR,
  NUIT_Z_BASE, NUIT_REVEIL, NUIT_PIECE_INTERIEUR, NUIT_PIECE_R, NUIT_PIECE_CX, NUIT_PIECE_CY,
  NUIT_DECRET_X,
} from "./cfaNuit1994Groups";

// ---------------------------------------------------------------------------
// BEAT 1 / HOOK franc CFA — "La nuit du 12 janvier 1994".
// MATIERE = MIX Fable 5 (ciel/lune/chambre/dormeur) + Kimi K3 (maisons/reveil/piece).
// VIE = ce code. TRACAGE SELECTIF HIERARCHISE (reco hook) : le decor se pose vite,
// les HEROS se tracent l'un apres l'autre, cales sur la voix. Camera STATIQUE, viewBox FIXE.
// Rouge #a8281f = SEULE couleur du choc, ajoutee ICI.
//
// PARTITION (frames @30fps, ~15s = 450f) :
//   0-40    ciel + lune + etoiles + ville lointaine se posent (fond, fade doux rapide)
//   30-110  MAISONS se tracent (stroke) + chambre se trace  -> "des millions dorment"
//   70-130  fenetres s'allument une par une (echelonne)
//   90-140  dormeur + lit se tracent ; les "z" commencent a monter
//   150-210 PIECE CFA apparait dans la rue (contour dore luisant qui se trace) -> "leur argent"
//   210     CHOC : flash + minuit bascule + fenetres eteintes d'un coup + fracture piece
//   210-260 decret vertical descend et frappe
//   260-450 tenue : moities separees, "sans que personne ne vote"
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;
const RED = "#a8281f";

export const CFA_NUIT_1994_FPS = 30;
// Duree calee sur la voix off reelle (beat1-vo.mp3 = 18.58s) + petite queue de respiration.
export const CFA_NUIT_1994_FRAMES = 585; // 19.5s
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS); // helper sec->frame

// ---- TIMESTAMPS de la voix (whisper-align, beat1-vo.mp3) ----
// "12 janvier 1994" 0.0-2.56 | "minuit" 3.08 | "des millions dorment" 4.3-5.6
// "a leur reveil" 6.8-7.94 | "leur argent" 8.2 | "en une nuit" 10.7-11.3
// "le franc CFA" 12.0-12.58 | "divise par deux" 13.1-14.14 (LE CHOC)
// "tombee d'en haut" 16.1-16.8 | "sans que personne ne vote" 17.3-18.4
const T_MINUIT = 3.08;
const T_DORMENT = 5.0;
const T_ARGENT = 8.2;     // la piece CFA apparait
const T_FRANC = 12.0;     // "le franc CFA" — piece pleinement luisante
const T_DIVISE = 13.3;    // "divise par deux" — LE CHOC (fracture + decret + flash)
const T_HAUT = 16.2;      // "tombee d'en haut" — decret tenu
const CHOC = S(T_DIVISE);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Inject: React.FC<{ html: string; opacity?: number; transform?: string }> = ({
  html, opacity = 1, transform,
}) => <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: html }} />;

// helper traçage : un groupe de traits "se dessine" via stroke-dasharray/offset.
// On approxime : opacity 0->1 + un leger clip-in vertical pour l'effet "monte".
// (Le vrai stroke-dashoffset par path serait ideal mais lourd sur un groupe injecte ;
//  ici on combine fade + reveal directionnel, suffisant et propre.)

export const CfaNuit1994Anime16x9: React.FC<{ muteNarration?: boolean }> = ({ muteNarration = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- FOND permanent (respire) ----
  const cielDrift = Math.sin(frame / 130) * 5;
  const haloPulse = 0.85 + 0.15 * Math.sin(frame / 22); // lune qui respire
  const luneScale = 1 + 0.015 * Math.sin(frame / 30);

  // ---- pose du fond (rapide, fade doux) — pendant "12 janvier 1994" (0-2.5s) ----
  const cielIn = interpolate(frame, [0, S(1.0)], [0, 1], clamp);
  const villeLointaineIn = interpolate(frame, [S(0.4), S(1.8)], [0, 1], clamp);
  const luneIn = interpolate(frame, [S(0.6), S(2.2)], [0, 1], clamp);
  const etoilesIn = interpolate(frame, [0, S(1.6)], [0, 1], clamp);
  const solIn = interpolate(frame, [S(0.3), S(1.8)], [0, 1], clamp);

  // ---- MAISONS se tracent (Kimi) sur "des millions dorment" (4.3-5.6s) ----
  const maisonsIn = interpolate(frame, [S(2.0), S(5.0)], [0, 1], clamp);
  // ---- chambre + dormeur se tracent sur "dorment" ----
  const chambreIn = interpolate(frame, [S(2.6), S(5.2)], [0, 1], clamp);
  const litIn = interpolate(frame, [S(4.2), S(5.8)], [0, 1], clamp);
  const dormeurIn = interpolate(frame, [S(4.6), S(6.2)], [0, 1], clamp);
  // respiration du dormeur (retour Aziz : subtil, sinon on enleve) : le corps monte/descend
  // de ~1.5px, tres lent. Applique en translateY au groupe dormeur seulement.
  const respire = Math.sin(frame / 20) * 1.5;

  // ---- fenetres s'allument une par une et RESTENT allumees (retour Aziz : garder la vie,
  //      la ville dort paisiblement pendant que la piece se brise = meilleur contraste) ----
  const NB_FEN = 8;

  // ---- "z" du sommeil : montent + fade, en boucle ----
  const zStart = S(5.0); // les "z" commencent une fois le dormeur trace
  const zs = [0, 1, 2].map((i) => {
    const t = ((frame - zStart) / 45 + i * 0.4) % 1;
    if (frame < zStart || t < 0) return null;
    return { dy: -t * 55, op: Math.sin(t * Math.PI) * 0.5, size: 14 + i * 3 };
  });

  // ---- REVEIL : place sur la chevet Fable, reduit. AIGUILLE qui AVANCE et atteint MINUIT
  //      exactement au CHOC (retour Aziz : synchro cadran->minuit->piece qui tombe/eclate).
  //      L'aiguille des minutes tourne en continu depuis l'apparition du reveil jusqu'a pointer
  //      pile en haut (minuit, angle 0) au frame CHOC. Avant : elle "monte" vers midi/minuit.
  const reveilIn = interpolate(frame, [S(3.4), S(4.6)], [0, 1], clamp);
  const reveilScale = 0.42; // reduit fortement (reco Aziz)
  const reveilX = 640, reveilY = 760;
  // aiguille des minutes : arrive a MINUIT (angle 0, pointe en haut) exactement au mot "minuit"
  // (3.08s), puis avance TRES lentement pendant la nuit (le temps passe), et au CHOC
  // ("divise par deux") elle est repartie d'un tour complet — le temps de la nuit s'est ecoule.
  // Simplification lisible : monte vers minuit avant 3s, puis derive doucement.
  const aiguilleAngle = frame < S(T_MINUIT)
    ? interpolate(frame, [S(1.5), S(T_MINUIT)], [-60, 0], clamp)      // arrive a minuit au mot
    : interpolate(frame, [S(T_MINUIT), CHOC], [0, 355], clamp);        // la nuit s'ecoule (presque un tour)
  const ticMinuit = frame >= S(T_MINUIT) && frame < S(T_MINUIT) + 3 ? -3 : 0;

  // ---- PIECE CFA : apparait au mot "leur argent" (8.2s), contour dore se trace jusqu'a
  //      "le franc CFA" (12s) ou elle est pleinement luisante — puis se fend a "divise par deux". ----
  const pieceAppear = interpolate(frame, [S(T_ARGENT), S(T_ARGENT + 1.0)], [0, 1], clamp);
  const pieceTrace = interpolate(frame, [S(T_ARGENT + 0.3), S(T_FRANC)], [0, 1], clamp);
  const pieceGlow = 0.4 + 0.3 * Math.sin(frame / 12);                  // luisance
  const CIRC = 2 * Math.PI * NUIT_PIECE_R;

  // ---- CHOC : flash ----
  const flash = frame >= CHOC && frame < CHOC + 4
    ? interpolate(frame, [CHOC, CHOC + 4], [0.7, 0], clamp) : 0;

  // ---- FRACTURE : les 2 moities de la piece s'ecartent (tombe sec). Ecart RESSERRE
  //      (retour Aziz : la moitie droite tombait trop bas, se lisait comme 2 bouts eloignes). ----
  const frac = frame >= CHOC ? interpolate(frame, [CHOC, CHOC + 14], [0, 1], clamp) : 0;
  const demiDroiteDx = frac * 26;
  const demiDroiteDy = interpolate(frac, [0, 1], [0, 30], clamp);
  const demiDroiteRot = frac * 8;
  const demiGaucheDx = -frac * 8;

  // ---- DECRET vertical (force d'en haut) ----
  const decretY = frame >= CHOC
    ? interpolate(frame, [CHOC, CHOC + 18], [-40, NUIT_PIECE_CY - 110], clamp) : -40;
  const decretOp = frame >= CHOC
    ? interpolate(frame, [CHOC, CHOC + 8, CHOC + 100, CHOC + 140], [0, 1, 1, 0.3], clamp) : 0;

  // ---- CARTOUCHE "100 -> 50" ----
  const cartoucheIn = frame >= CHOC + 12
    ? spring({ frame: frame - (CHOC + 12), fps, config: { mass: 1, damping: 12, stiffness: 110 }, durationInFrames: 20 })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#141f38" }}>
      {/* ---- VOIX OFF ---- */}
      {!muteNarration && <Audio src={staticFile("_rnd/cfa-nuit1994/beat1-vo.mp3")} />}

      {/* ---- MUSIQUE DE L'EPISODE (piste unique, cf. decision "une seule musique declinee") ----
          ⭐ LECON (retour Aziz : "elle concurrence la voix" alors que le RMS global disait -18 dB) :
          un ecart RMS GLOBAL correct ne garantit PAS que la voix passe. Mesure par bande :
          la musique et la voix vivent dans la MEME bande 200Hz-2kHz (musique -27.2 dB, voix
          -19.0 dB) — soit 8.2 dB de marge reelle dans le medium, contre 17.9 dB en global. C'est
          du MASQUAGE FREQUENTIEL, pas un probleme de niveau brut.
          -> 2 corrections : (1) EQ sur le fichier source, creux de -5 dB a 700Hz et -3 dB a 1.8kHz
          (musique-episode.mp3 est la version EQ, pas la piste brute), ce qui libere 3.8 dB dans
          la bande de la voix sans changer le caractere ; (2) volume 0.26 -> ~24 dB de marge dans
          le medium.
          ⚠️ Le 0.07 par defaut de la doctrine donnerait ici une musique inaudible (ce defaut
          suppose une musique generee bien plus forte). TOUJOURS mesurer voix + musique PAR BANDE
          avant de fixer le volume. Fade-in 1.5s pour ne pas demarrer sec sur le premier mot. */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        volume={(f) => interpolate(f, [0, 45], [0, 0.26], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })}
      />

      {/* ---- COUCHE SFX (calee sur timestamps voix ; plancher volume respecte) ---- */}
      {/* tic-tac du reveil : du reveil visible (3.4s) jusqu'au choc (13.3s), en boucle, discret */}
      <Sequence from={S(3.4)} durationInFrames={CHOC - S(3.4)}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/cfa-clock-tick.mp3")} loop volume={0.32} />
      </Sequence>
      {/* impact sec de la fracture, au choc "divise par deux" */}
      <Sequence from={CHOC} durationInFrames={40}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/sfx-impact.mp3")} volume={0.62} />
      </Sequence>
      {/* sub-boom feutre (le poids de l'evenement), au choc */}
      <Sequence from={CHOC} durationInFrames={50}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/cfa-choc-boom.mp3")} volume={0.5} />
      </Sequence>
      {/* whoosh du decret qui tombe (juste avant l'impact pour l'anticipation) */}
      <Sequence from={CHOC - 6} durationInFrames={30}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/sfx-whoosh.mp3")} volume={0.42} />
      </Sequence>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: NUIT_DEFS }} />

        {/* FOND */}
        <Inject html={NUIT_CIEL} opacity={cielIn} />
        <Inject html={NUIT_ETOILES} opacity={etoilesIn * (0.75 + 0.25 * Math.sin(frame / 9))} transform={`translate(${cielDrift} 0)`} />
        <g opacity={luneIn} transform={`translate(${cielDrift * 0.5} 0)`}>
          <g transform={`translate(${NUIT_LUNE_CX} ${NUIT_LUNE_CY}) scale(${luneScale}) translate(${-NUIT_LUNE_CX} ${-NUIT_LUNE_CY})`}
             opacity={haloPulse} dangerouslySetInnerHTML={{ __html: NUIT_LUNE }} />
        </g>
        <Inject html={NUIT_VILLE_LOINTAINE} opacity={villeLointaineIn} />
        <Inject html={NUIT_SOL} opacity={solIn} />

        {/* MAISONS (Kimi) — se tracent gauche->droite */}
        <g opacity={maisonsIn}
           style={{ clipPath: `inset(0 ${(1 - maisonsIn) * 100}% 0 0)` }}
           dangerouslySetInnerHTML={{ __html: NUIT_MAISONS }} />

        {/* FENETRES chaudes (une par une, eteintes au choc) */}
        <g>
          {Array.from({ length: NB_FEN }).map((_, i) => {
            const cfg = [
              { x: 800, y: 660 }, { x: 860, y: 660 }, { x: 1040, y: 700 },
              { x: 1280, y: 660 }, { x: 1360, y: 720 }, { x: 1540, y: 700 },
              { x: 1760, y: 660 }, { x: 1840, y: 730 },
            ][i];
            // fenetres s'allument une par une pendant "des millions dorment" (4.3-6s), restent.
            const on = interpolate(frame, [S(3.0) + i * 5, S(3.8) + i * 5], [0, 1], clamp);
            const op = on * (0.85 + 0.05 * Math.sin(frame / 7 + i));
            if (op <= 0.02) return null;
            return (
              <g key={i}>
                <ellipse cx={cfg.x + 15} cy={cfg.y + 15} rx={30} ry={24} fill="url(#grad-glow-fenetre)" opacity={op} />
                <rect x={cfg.x} y={cfg.y} width={30} height={30} fill="#b8860b" opacity={op} />
                <line x1={cfg.x + 15} y1={cfg.y} x2={cfg.x + 15} y2={cfg.y + 30} stroke="#16213a" strokeWidth={2} opacity={op} />
              </g>
            );
          })}
        </g>

        {/* CHAMBRE en coupe (Fable) — se trace */}
        <g opacity={chambreIn} style={{ clipPath: `inset(0 0 ${(1 - chambreIn) * 60}% 0)` }}
           dangerouslySetInnerHTML={{ __html: NUIT_CHAMBRE }} />
        <Inject html={NUIT_LIT} opacity={litIn} />
        <Inject html={NUIT_DORMEUR} opacity={dormeurIn} transform={`translate(0 ${respire})`} />

        {/* "z" du sommeil qui montent */}
        {zs.map((z, i) => z && (
          <text key={i} x={NUIT_Z_BASE.x} y={NUIT_Z_BASE.y + z.dy}
                fontFamily="Georgia, serif" fontStyle="italic" fontSize={z.size}
                fill="#e8dcc0" opacity={z.op}>z</text>
        ))}

        {/* REVEIL (Kimi, reduit) sur la chevet */}
        <g opacity={reveilIn} transform={`translate(${reveilX} ${reveilY}) scale(${reveilScale})`}>
          <g dangerouslySetInnerHTML={{ __html: NUIT_REVEIL }} />
          {/* aiguilles animees : l'aiguille des minutes tourne vers minuit + tic a l'arrivee.
              l'aiguille des heures (courte) pointe deja vers le haut (minuit). */}
          <line x1={0} y1={0} x2={0} y2={-42} stroke="#e8dcc0" strokeWidth={5} strokeLinecap="round" />
          <g transform={`rotate(${aiguilleAngle + ticMinuit})`}>
            <line x1={0} y1={0} x2={0} y2={-62} stroke="#b8860b" strokeWidth={2.5} strokeLinecap="round" />
          </g>
          <circle cx={0} cy={0} r={6} fill="#b8860b" />
        </g>

        {/* PIECE CFA dans la rue — contour dore qui se trace + interieur qui apparait, puis FRACTURE */}
        {pieceAppear > 0.01 && frac <= 0.001 && (
          <g transform={`translate(${NUIT_PIECE_CX} ${NUIT_PIECE_CY})`}>
            {/* interieur (fade) */}
            <g opacity={pieceAppear} dangerouslySetInnerHTML={{ __html: NUIT_PIECE_INTERIEUR }} />
            {/* contour dore luisant qui se trace */}
            <circle cx={0} cy={0} r={NUIT_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={4}
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pieceTrace)}
                    opacity={0.7 + pieceGlow * 0.3} filter="url(#glow)" transform="rotate(-90)" />
          </g>
        )}

        {/* DECRET vertical (rouge) */}
        {decretOp > 0.01 && (
          <g opacity={decretOp}>
            <line x1={NUIT_DECRET_X} y1={-40} x2={NUIT_DECRET_X} y2={decretY} stroke={RED} strokeWidth={9} strokeLinecap="round" />
            <polygon points={`${NUIT_DECRET_X - 15},${decretY} ${NUIT_DECRET_X + 15},${decretY} ${NUIT_DECRET_X},${decretY + 24}`} fill={RED} />
          </g>
        )}

        {/* PIECE FENDUE (2 moities) apres le choc */}
        {frac > 0.001 && (
          <>
            <g transform={`translate(${NUIT_PIECE_CX + demiGaucheDx} ${NUIT_PIECE_CY})`}>
              <clipPath id="cg"><rect x={-NUIT_PIECE_R - 5} y={-NUIT_PIECE_R - 5} width={NUIT_PIECE_R + 3} height={NUIT_PIECE_R * 2 + 10} /></clipPath>
              <g clipPath="url(#cg)" dangerouslySetInnerHTML={{ __html: NUIT_PIECE_INTERIEUR }} />
              <circle cx={0} cy={0} r={NUIT_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={4} clipPath="url(#cg)" />
              <line x1={-2} y1={-NUIT_PIECE_R} x2={-2} y2={NUIT_PIECE_R} stroke={RED} strokeWidth={3} opacity={frac} />
            </g>
            <g transform={`translate(${NUIT_PIECE_CX + demiDroiteDx} ${NUIT_PIECE_CY + demiDroiteDy}) rotate(${demiDroiteRot})`}>
              <clipPath id="cd"><rect x={2} y={-NUIT_PIECE_R - 5} width={NUIT_PIECE_R + 3} height={NUIT_PIECE_R * 2 + 10} /></clipPath>
              <g clipPath="url(#cd)" dangerouslySetInnerHTML={{ __html: NUIT_PIECE_INTERIEUR }} />
              <circle cx={0} cy={0} r={NUIT_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={4} clipPath="url(#cd)" />
              <line x1={2} y1={-NUIT_PIECE_R} x2={2} y2={NUIT_PIECE_R} stroke={RED} strokeWidth={3} opacity={frac} />
            </g>
          </>
        )}

        {/* CARTOUCHE "100 -> 50" */}
        {cartoucheIn > 0.01 && (
          <g opacity={cartoucheIn} transform={`translate(${NUIT_PIECE_CX} ${NUIT_PIECE_CY + 150}) scale(${cartoucheIn})`}>
            <text x={0} y={0} fontFamily="Georgia, serif" fontSize={52} fill="#e8dcc0" textAnchor="middle" fontWeight={700}>
              100 <tspan fill={RED}>&#8594;</tspan> 50
            </text>
            <text x={0} y={42} fontFamily="Georgia, serif" fontSize={28} fill={RED} textAnchor="middle" letterSpacing={3}>&#8722;50%</text>
          </g>
        )}

        {/* FLASH */}
        {flash > 0 && <rect x={0} y={0} width={W} height={H} fill="#ffffff" opacity={flash} />}
      </svg>
    </AbsoluteFill>
  );
};

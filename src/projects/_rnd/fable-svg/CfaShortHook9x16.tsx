import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, Sequence, staticFile } from "remotion";
import {
  HOOK_DEFS, HOOK_CIEL, HOOK_ETOILES, HOOK_LUNE, HOOK_LUNE_CX, HOOK_LUNE_CY,
  HOOK_VILLE_LOINTAINE, HOOK_SOL, HOOK_MAISONS, HOOK_CHAMBRE, HOOK_LIT, HOOK_DORMEUR,
  HOOK_Z_BASE, HOOK_REVEIL, HOOK_PIECE_INTERIEUR, HOOK_PIECE_R, HOOK_PIECE_CX, HOOK_PIECE_CY,
  HOOK_DECRET_X,
} from "./cfaShortHookGroups";

// ---------------------------------------------------------------------------
// SHORT 9:16 — Scene 1 "Hook" (recomposition verticale de CfaNuit1994Anime16x9).
// SOURCE INTOUCHABLE : CfaNuit1994Anime16x9.tsx (16:9, mid-form publie). Meme logique
// d'animation, memes couleurs, memes SFX/volumes. viewBox 0 0 1080 1920, camera statique
// (aucun zoom/pan du viewBox — tout effet d'echelle passe par `transform: scale()` sur des
// groupes internes).
//
// ⭐⭐ REFONTE (2e passe, retour Aziz apres visionnage de la v1) : la v1 avait un vrai defaut
// d'echelle — la scene ville/chambre restait un petit bandeau en haut (880 sur 1920px de
// hauteur, 46%), laissant un enorme vide en bas du cadre. MEME grammaire split-screen
// sequentielle que la Scene 3 (Levier), appliquee ici :
//
//   PHASE 1 (avant le choc) : la scene ville/chambre/dormeur occupe TOUT le cadre, en GRAND —
//                             ciel+lune tres haut, skyline etagee au milieu, chambre+dormeur
//                             large en bas — toute la hauteur 1920 est utilisee, pas juste 880.
//   PHASE 2 (au choc)       : CROSSFADE — la scene ville RETRECIT dans une bande haute (meme
//                             disposition compacte que la v1), pendant que la PIECE CFA (le
//                             climax) apparait GRANDE, centree dans la bande basse liberee.
//                             Decret vertical garde son sens ("la force qui vient d'en haut").
//
// Camera STATIQUE, viewBox FIXE — aucun zoom/pan du viewBox. Rouge #a8281f = seule couleur du
// choc, ajoutee ICI (code), jamais dans la matiere.
// ---------------------------------------------------------------------------

const W = 1080;
const H = 1920;
const RED = "#a8281f";

export const CFA_SHORT_HOOK_FPS = 30;
// Duree cible : ~19.4s @ 30fps = 583 frames. Inchangee — le split hero/recap tient dans le
// budget existant (le split se declenche AU CHOC, meme repere temporel que la v1).
export const CFA_SHORT_HOOK_FRAMES = 583;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS); // helper sec->frame

// ---- Reperes voix (identiques a l'original, VERROUILLES — script/timing non-negociables) ----
const T_MINUIT = 3.08;
const T_DORMENT = 5.0;
const T_ARGENT = 8.2;     // la piece CFA apparait
const T_FRANC = 12.0;     // "le franc CFA" — piece pleinement luisante
const T_DIVISE = 13.3;    // "divise par deux" — LE CHOC (fracture + decret + flash + SPLIT)
const T_HAUT = 16.2;      // "tombee d'en haut" — decret tenu
const CHOC = S(T_DIVISE);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Inject: React.FC<{ html: string; opacity?: number; transform?: string }> = ({
  html, opacity = 1, transform,
}) => <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: html }} />;

export const CfaShortHook9x16: React.FC<{ muteNarration?: boolean }> = ({ muteNarration = false }) => {
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
  const respire = Math.sin(frame / 20) * 1.5;

  // ---- fenetres s'allument une par une et RESTENT allumees ----
  const NB_FEN = 8;

  // ---- "z" du sommeil : montent + fade, en boucle ----
  const zStart = S(5.0);
  const zs = [0, 1, 2].map((i) => {
    const t = ((frame - zStart) / 45 + i * 0.4) % 1;
    if (frame < zStart || t < 0) return null;
    return { dy: -t * 40, op: Math.sin(t * Math.PI) * 0.5, size: 11 + i * 2 };
  });

  // ---- REVEIL : place sur le chevet, reduit. AIGUILLE qui AVANCE et atteint MINUIT
  //      exactement au CHOC (synchro cadran->minuit->piece qui tombe/eclate). ----
  const reveilIn = interpolate(frame, [S(3.4), S(4.6)], [0, 1], clamp);
  const reveilScale = 0.32; // reduit davantage que l'original (chambre elle-meme plus petite)
  const reveilX = 605, reveilY = 682;
  const aiguilleAngle = frame < S(T_MINUIT)
    ? interpolate(frame, [S(1.5), S(T_MINUIT)], [-60, 0], clamp)
    : interpolate(frame, [S(T_MINUIT), CHOC], [0, 355], clamp);
  const ticMinuit = frame >= S(T_MINUIT) && frame < S(T_MINUIT) + 3 ? -3 : 0;

  // ---- PIECE CFA : apparait au mot "leur argent" (8.2s), contour dore se trace jusqu'a
  //      "le franc CFA" (12s) ou elle est pleinement luisante — puis se fend a "divise par deux". ----
  const pieceAppear = interpolate(frame, [S(T_ARGENT), S(T_ARGENT + 1.0)], [0, 1], clamp);
  const pieceTrace = interpolate(frame, [S(T_ARGENT + 0.3), S(T_FRANC)], [0, 1], clamp);
  const pieceGlow = 0.4 + 0.3 * Math.sin(frame / 12);
  const CIRC = 2 * Math.PI * HOOK_PIECE_R;

  // ---- CHOC : flash ----
  const flash = frame >= CHOC && frame < CHOC + 4
    ? interpolate(frame, [CHOC, CHOC + 4], [0.7, 0], clamp) : 0;

  // ---- FRACTURE : les 2 moities de la piece s'ecartent. Echelle proportionnelle au rayon
  //      agrandi (150 vs 92 original, ratio ~1.63) pour garder la meme lecture du geste. ----
  const RATIO = HOOK_PIECE_R / 92;
  const frac = frame >= CHOC ? interpolate(frame, [CHOC, CHOC + 14], [0, 1], clamp) : 0;
  const demiDroiteDx = frac * 26 * RATIO;
  const demiDroiteDy = interpolate(frac, [0, 1], [0, 30 * RATIO], clamp);
  const demiDroiteRot = frac * 8;
  const demiGaucheDx = -frac * 8 * RATIO;

  // ---- DECRET vertical (force d'en haut) — descend depuis le tout haut du cadre jusqu'a
  //      frapper la piece. Course longue, accentue le geste "tombee d'en haut". ----
  const decretY = frame >= CHOC
    ? interpolate(frame, [CHOC, CHOC + 18], [-40, HOOK_PIECE_CY - 180], clamp) : -40;
  const decretOp = frame >= CHOC
    ? interpolate(frame, [CHOC, CHOC + 8, CHOC + 100, CHOC + 140], [0, 1, 1, 0.3], clamp) : 0;

  // ---- CARTOUCHE "100 -> 50" ----
  const cartoucheIn = frame >= CHOC + 12
    ? spring({ frame: frame - (CHOC + 12), fps, config: { mass: 1, damping: 12, stiffness: 110 }, durationInFrames: 20 })
    : 0;

  // ---- SPLIT (crossfade hero plein-cadre -> recap bande haute), declenche AU CHOC ----
  const splitP = spring({ frame: frame - CHOC, fps, config: { damping: 17, stiffness: 95 }, durationInFrames: 46 });
  const heroOp = frame < CHOC ? 1 : 1 - splitP;
  const recapOp = frame < CHOC ? 0 : splitP;
  // le hero se retracte legerement vers le haut pendant le fondu (renforce "il se range")
  const heroShrink = 1 - 0.18 * (frame < CHOC ? 0 : splitP);
  const heroTranslateY = -60 * (frame < CHOC ? 0 : splitP);

  // ---- Rendu de la scene ville/bedroom, parametre pour 2 gabarits (HERO plein cadre / RECAP
  //      bande haute compacte). Chaque sous-groupe garde son propre scale UNIFORME (jamais de
  //      distorsion) — seul l'ESPACEMENT vertical entre les sous-groupes change entre les 2
  //      gabarits (spacing, pas stretch des formes individuelles). ----
  const renderScene = (scale: number, gapCiel: number, gapSkyline: number, gapChambre: number, cx: number) => {
    // Le contenu HTML injecte est en coordonnees FIXES (0-1080 x, ~0-880 y pour la ville, defini
    // dans cfaShortHookGroups.ts). On le rejoue tel quel a l'echelle `scale`, avec des offsets Y
    // par bande pour ecarter ciel/skyline/chambre davantage en mode HERO.
    return (
      <g transform={`translate(${cx} 0) scale(${scale}) translate(${-cx} 0)`}>
        <g transform={`translate(0 ${gapCiel})`}>
          <Inject html={HOOK_CIEL} opacity={cielIn} />
          <Inject html={HOOK_ETOILES} opacity={etoilesIn * (0.75 + 0.25 * Math.sin(frame / 9))} transform={`translate(${cielDrift} 0)`} />
          <g opacity={luneIn} transform={`translate(${cielDrift * 0.5} 0)`}>
            <g transform={`translate(${HOOK_LUNE_CX} ${HOOK_LUNE_CY}) scale(${luneScale}) translate(${-HOOK_LUNE_CX} ${-HOOK_LUNE_CY})`}
               opacity={haloPulse} dangerouslySetInnerHTML={{ __html: HOOK_LUNE }} />
          </g>
        </g>

        <g transform={`translate(0 ${gapSkyline})`}>
          <Inject html={HOOK_VILLE_LOINTAINE} opacity={villeLointaineIn} />
          <Inject html={HOOK_SOL} opacity={solIn} />
          <g opacity={maisonsIn}
             style={{ clipPath: `inset(0 ${(1 - maisonsIn) * 100}% 0 0)` }}
             dangerouslySetInnerHTML={{ __html: HOOK_MAISONS }} />
          <g>
            {Array.from({ length: NB_FEN }).map((_, i) => {
              const cfg = [
                { x: 60, y: 750 }, { x: 100, y: 750 }, { x: 235, y: 780 },
                { x: 395, y: 750 }, { x: 445, y: 800 }, { x: 590, y: 785 },
                { x: 745, y: 750 }, { x: 810, y: 810 },
              ][i];
              const on = interpolate(frame, [S(3.0) + i * 5, S(3.8) + i * 5], [0, 1], clamp);
              const op = on * (0.85 + 0.05 * Math.sin(frame / 7 + i));
              if (op <= 0.02) return null;
              return (
                <g key={i}>
                  <ellipse cx={cfg.x + 11} cy={cfg.y + 11} rx={22} ry={18} fill="url(#h-grad-glow-fenetre)" opacity={op} />
                  <rect x={cfg.x} y={cfg.y} width={22} height={22} fill="#b8860b" opacity={op} />
                  <line x1={cfg.x + 11} y1={cfg.y} x2={cfg.x + 11} y2={cfg.y + 22} stroke="#16213a" strokeWidth={1.5} opacity={op} />
                </g>
              );
            })}
          </g>
        </g>

        <g transform={`translate(0 ${gapChambre})`}>
          <g opacity={chambreIn} style={{ clipPath: `inset(0 0 ${(1 - chambreIn) * 60}% 0)` }}
             dangerouslySetInnerHTML={{ __html: HOOK_CHAMBRE }} />
          <Inject html={HOOK_LIT} opacity={litIn} />
          <Inject html={HOOK_DORMEUR} opacity={dormeurIn} transform={`translate(0 ${respire})`} />
          {zs.map((z, i) => z && (
            <text key={i} x={HOOK_Z_BASE.x} y={HOOK_Z_BASE.y + z.dy}
                  fontFamily="Georgia, serif" fontStyle="italic" fontSize={z.size}
                  fill="#e8dcc0" opacity={z.op}>z</text>
          ))}
          <g opacity={reveilIn} transform={`translate(${reveilX} ${reveilY}) scale(${reveilScale})`}>
            <g dangerouslySetInnerHTML={{ __html: HOOK_REVEIL }} />
            <line x1={0} y1={0} x2={0} y2={-42} stroke="#e8dcc0" strokeWidth={5} strokeLinecap="round" />
            <g transform={`rotate(${aiguilleAngle + ticMinuit})`}>
              <line x1={0} y1={0} x2={0} y2={-62} stroke="#b8860b" strokeWidth={2.5} strokeLinecap="round" />
            </g>
            <circle cx={0} cy={0} r={6} fill="#b8860b" />
          </g>
        </g>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#141f38" }}>
      {/* ---- VOIX OFF : reprise du hook mid-form (script identique, Beat 1 mot pour mot).
          NOTE ORCHESTRATEUR : le montage final du Short se cale sur UNE narration unique
          generee separement pour tout le Short (pas 3 fichiers audio par beat) — ce placeholder
          reste utilisable tel quel si le texte du hook est repris integralement, sinon
          l'orchestrateur rebranchera le bon fichier de narration Short. ---- */}
      {!muteNarration && <Audio src={staticFile("_rnd/cfa-nuit1994/beat1-vo.mp3")} />}

      {/* ---- MUSIQUE DE L'EPISODE (memes reglages EQ/volume que l'original) ---- */}
      <Audio
        src={staticFile("_rnd/cfa-nuit1994/musique-episode.mp3")}
        volume={(f) => interpolate(f, [0, 45], [0, 0.26], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })}
      />

      {/* ---- COUCHE SFX (memes fichiers, memes volumes, memes timings relatifs) ---- */}
      <Sequence from={S(3.4)} durationInFrames={CHOC - S(3.4)}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/cfa-clock-tick.mp3")} loop volume={0.32} />
      </Sequence>
      <Sequence from={CHOC} durationInFrames={40}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/sfx-impact.mp3")} volume={0.62} />
      </Sequence>
      <Sequence from={CHOC} durationInFrames={50}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/cfa-choc-boom.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={CHOC - 6} durationInFrames={30}>
        <Audio src={staticFile("_rnd/cfa-nuit1994/sfx-whoosh.mp3")} volume={0.42} />
      </Sequence>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: HOOK_DEFS }} />

        {/* ================= SCENE VILLE/CHAMBRE — HERO (phase 1, plein cadre, AVANT le choc).
            Meme contenu que RECAP mais espace largement sur toute la hauteur du cadre : ciel
            tres haut, skyline au milieu, chambre large en bas — plus le petit bandeau 880px
            de la v1, la scene occupe desormais ~1750px de hauteur utile. ================= */}
        {heroOp > 0.01 && (
          <g opacity={heroOp} transform={`translate(0 ${heroTranslateY})`}>
            {renderScene(1, 40, 150, 660, 540)}
          </g>
        )}

        {/* ================= SCENE VILLE/CHAMBRE — RECAP (bande haute compacte, phase 2, AU
            CHOC et apres) — memes proportions que la v1 (le bandeau qui marchait deja bien en
            tant que "petit rappel", juste plus adapte maintenant qu'il partage le cadre avec
            la piece grande). ================= */}
        {recapOp > 0.01 && (
          <g opacity={recapOp}>
            {renderScene(0.62, 0, 470, 560, 540)}
          </g>
        )}

        {/* PIECE CFA — apparait des "leur argent" (8.2s), AVANT le choc, DANS la scene hero
            (elle vit deja dans la rue, a sa position dominante). Au choc, elle RESTE a sa place
            (HOOK_PIECE_CX/CY) pendant que la scene ville se retracte autour d'elle — c'est elle
            qui ne bouge pas, tout le reste se range. */}
        {pieceAppear > 0.01 && frac <= 0.001 && (
          <g transform={`translate(${HOOK_PIECE_CX} ${HOOK_PIECE_CY})`}>
            <g opacity={pieceAppear} dangerouslySetInnerHTML={{ __html: HOOK_PIECE_INTERIEUR }} />
            <circle cx={0} cy={0} r={HOOK_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={6}
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pieceTrace)}
                    opacity={0.7 + pieceGlow * 0.3} filter="url(#h-glow)" transform="rotate(-90)" />
          </g>
        )}

        {/* DECRET vertical (rouge) — descend depuis le haut du cadre, course longue */}
        {decretOp > 0.01 && (
          <g opacity={decretOp}>
            <line x1={HOOK_DECRET_X} y1={-40} x2={HOOK_DECRET_X} y2={decretY} stroke={RED} strokeWidth={12} strokeLinecap="round" />
            <polygon points={`${HOOK_DECRET_X - 22},${decretY} ${HOOK_DECRET_X + 22},${decretY} ${HOOK_DECRET_X},${decretY + 34}`} fill={RED} />
          </g>
        )}

        {/* PIECE FENDUE (2 moities) apres le choc */}
        {frac > 0.001 && (
          <>
            <g transform={`translate(${HOOK_PIECE_CX + demiGaucheDx} ${HOOK_PIECE_CY})`}>
              <clipPath id="hcg"><rect x={-HOOK_PIECE_R - 5} y={-HOOK_PIECE_R - 5} width={HOOK_PIECE_R + 3} height={HOOK_PIECE_R * 2 + 10} /></clipPath>
              <g clipPath="url(#hcg)" dangerouslySetInnerHTML={{ __html: HOOK_PIECE_INTERIEUR }} />
              <circle cx={0} cy={0} r={HOOK_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={6} clipPath="url(#hcg)" />
              <line x1={-3} y1={-HOOK_PIECE_R} x2={-3} y2={HOOK_PIECE_R} stroke={RED} strokeWidth={4} opacity={frac} />
            </g>
            <g transform={`translate(${HOOK_PIECE_CX + demiDroiteDx} ${HOOK_PIECE_CY + demiDroiteDy}) rotate(${demiDroiteRot})`}>
              <clipPath id="hcd"><rect x={2} y={-HOOK_PIECE_R - 5} width={HOOK_PIECE_R + 3} height={HOOK_PIECE_R * 2 + 10} /></clipPath>
              <g clipPath="url(#hcd)" dangerouslySetInnerHTML={{ __html: HOOK_PIECE_INTERIEUR }} />
              <circle cx={0} cy={0} r={HOOK_PIECE_R} fill="none" stroke="#b8860b" strokeWidth={6} clipPath="url(#hcd)" />
              <line x1={3} y1={-HOOK_PIECE_R} x2={3} y2={HOOK_PIECE_R} stroke={RED} strokeWidth={4} opacity={frac} />
            </g>
          </>
        )}

        {/* CARTOUCHE "100 -> 50" */}
        {cartoucheIn > 0.01 && (
          <g opacity={cartoucheIn} transform={`translate(${HOOK_PIECE_CX} ${HOOK_PIECE_CY + 235}) scale(${cartoucheIn})`}>
            <text x={0} y={0} fontFamily="Georgia, serif" fontSize={68} fill="#e8dcc0" textAnchor="middle" fontWeight={700}>
              100 <tspan fill={RED}>&#8594;</tspan> 50
            </text>
            <text x={0} y={54} fontFamily="Georgia, serif" fontSize={36} fill={RED} textAnchor="middle" letterSpacing={4}>&#8722;50%</text>
          </g>
        )}

        {/* FLASH */}
        {flash > 0 && <rect x={0} y={0} width={W} height={H} fill="#ffffff" opacity={flash} />}
      </svg>
    </AbsoluteFill>
  );
};

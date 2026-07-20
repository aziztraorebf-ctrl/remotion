/**
 * SCENE 3 — "Le meme geste, pendant ce temps-la". Suite de PortDechargement16x9 (usine premium, Scene 2).
 * PROTO/TEST : preuve de concept d'une session R&D (2026-07-02) qui a analyse 3 chaines tierces (Infographics
 * Show, SimpleHistory, Hypothetically) pour en tirer une grammaire de mise en scene + une doctrine d'ecriture.
 * Regles testees ICI (voir memory/doctrines/ pour le detail complet) :
 *   - Pas de resolution complete (SCRIPTWRITING-MASTER-STORYTELLING) : la scene NE CONCLUT PAS le paradoxe,
 *     elle le referme en silence — pas de texte explicatif, pas de morale affichee.
 *   - Grading binaire stable/crise (MISE-EN-SCENE) : palette IDENTIQUE a la Scene 1 (chaud, terre), pas
 *     celle de l'usine (froide, premium) — la couleur dit "rien n'a change ici" sans un mot.
 *   - Objet-pivot recycle (STRUCTURE-NARRATIVE) : MEME CacaoTree, MEME palette SEA_A/SKY_A/SUN_A que
 *     CargoVoyage16x9 (reutilisation litterale du code, doctrine 4ter deja gravee), pas un nouveau decor.
 *
 * Continuite (memes constantes que CargoVoyage16x9, cote Afrique, JAMAIS la palette froide de PortDechargement) :
 *   - MEME verger (CacaoTree, memes tons), MEME planteur, MEME geste de recolte en boucle (bend+armReach,
 *     carry="none"), MEME ciel a nuages (recette copiee de CargoVoyage16x9, pas un fond plat).
 *   - Lueur usine lointaine tres discrete en fond (rappel silencieux de la Scene 2, jamais nommee/expliquee).
 *
 * v2 (2026-07-02, retours Aziz sur v1) — 3 fixes :
 *   1. ECHELLE : le planteur etait GEANT face aux arbres (erreur — on avait deja la regle "homme = ~1/3
 *      cacaoyer" dans PERSONNAGE-VIVANT-INDEX, non respectee en v1). Fix : planteur a echelle REALISTE
 *      (scale ~0.32, comme les cueilleurs de CargoVoyage16x9), la CAMERA zoome sur lui (scale du groupe SVG
 *      entier), pas le personnage qui grossit dans un cadre large — le zoom cree le "gros plan", pas la taille.
 *   2. TORSE VETU : tunicColor+tunicPattern ajoutes (etaient absents en v1 — torse parchemin vide, occasion
 *      manquee alors que StickRig les supporte deja, utilises dans PortDechargement16x9 pour le docker).
 *   3. CIEL A NUAGES : v1 avait un fond plat — fix en copiant LITTERALEMENT la recette nuages de
 *      CargoVoyage16x9 (doctrine 4ter : continuite = meme code, pas s'en inspirer).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../../souverain/cacao-chocolat-short/components/VergerCacao";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";

export const RETOUR_CHAMP_FPS = 30;
export const RETOUR_CHAMP_FRAMES = 400; // ~13.3s — scene courte, un seul beat, pas de resolution

const INK = "#2b2117";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- MEME PALETTE que CargoVoyage16x9 cote Afrique (SKY_A/SUN_A/SEA_A) — jamais la palette froide de
// PortDechargement. Le contraste EST le message : rien n'a change ici pendant que l'usine se transformait. ----
const SKY_WARM = "#e8dcc0";
const SUN_WARM = "#f2c14e";
const GROUND = "#8a9a6b";

export const RetourAuChamp16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // entree douce, pas de mouvement de camera brusque — la scene est calme, presque figee (contraste avec
  // l'agitation de la grue/usine de la Scene 2)
  const enter = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // CAMERA : leger zoom lent vers le planteur (c'est le zoom qui cree le "gros plan", pas la taille du perso
  // — le perso reste a echelle REALISTE face aux arbres, cf. fix v2). Zoom tres progressif sur toute la duree.
  const camZoom = interpolate(frame, [0, 380], [1, 1.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const camCenterX = 960, camCenterY = 860;

  // soleil fixe, haut dans le ciel — pas de lever/coucher, on est dans la continuite du MEME jour que la
  // Scene 1 (pas d'ellipse temporelle marquee, "pendant ce temps-la")
  const sunX = 1600, sunY = 180;

  // lueur usine lointaine — tres discrete, apparait lentement, JAMAIS assez visible pour distraire du planteur.
  // C'est un rappel silencieux, pas un element narratif explicite (pas de texte, pas de fleche).
  const factoryGlow = interpolate(frame, [80, 300], [0, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // planteur a ECHELLE REALISTE (~1/3 d'un cacaoyer, regle deja gravee dans PERSONNAGE-VIVANT-INDEX) — le
  // "gros plan" vient du ZOOM CAMERA (camZoom ci-dessus), pas d'un personnage agrandi hors proportion.
  // Meme recette de geste (bend/armReach cyclique), pas de marche (moveAmt=0), carry="none" (deja valide :
  // un objet porte devient illisible/confus a cette echelle, le geste seul suffit a raconter le travail).
  const cyclePos = wf % 130;
  const bend = interpolate(cyclePos, [0, 30, 55, 90, 120, 130], [0, 1, 1, 0.3, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const armReach = interpolate(cyclePos, [10, 35, 60, 95], [0, 1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pas de fin marquee — pas de fade out, pas de texte de conclusion. La scene s'arrete, elle ne conclut pas
  // (regle scriptwriting : jamais de resolution complete).

  return (
    <AbsoluteFill style={{ backgroundColor: SKY_WARM }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill={SKY_WARM} />

        {/* CAMERA : tout le decor+perso zoome ensemble depuis le centre (camZoom), cf. fix v2 */}
        <g transform={`translate(${camCenterX} ${camCenterY}) scale(${camZoom}) translate(${-camCenterX} ${-camCenterY})`}>

          {/* soleil chaud, fixe */}
          <defs>
            <radialGradient id="champSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={SUN_WARM} stopOpacity={0.4} />
              <stop offset="55%" stopColor={SUN_WARM} stopOpacity={0.12} />
              <stop offset="100%" stopColor={SUN_WARM} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={sunX} cy={sunY} r={170} fill="url(#champSun)" />
          <circle cx={sunX} cy={sunY} r={78} fill={SUN_WARM} opacity={0.95} />
          <circle cx={sunX} cy={sunY} r={78} fill="none" stroke={INK} strokeWidth={2.6} opacity={0.35} />

          {/* nuages — MEME recette que CargoVoyage16x9 (copie litterale, doctrine 4ter continuite), fondu aux
              bords, boucle lente. Fix v2 : v1 avait un ciel plat. */}
          {[
            { baseX: 500, y: 160, w: 1.1, speed: 0.1, phase: 0 },
            { baseX: 980, y: 120, w: 0.95, speed: 0.08, phase: 3 },
            { baseX: 1500, y: 200, w: 1.05, speed: 0.13, phase: 5 },
          ].map((c, k) => {
            const range = 1700;
            const x = 100 + (((c.baseX - 100 - wf * c.speed) % range) + range) % range;
            const bob2 = Math.sin(wf / 34 + c.phase) * 5;
            const edgeFade = Math.min(1, Math.min(x - 100, 1820 - x) / 150);
            const op = 0.4 * Math.max(0, edgeFade);
            return (
              <g key={k} transform={`translate(${x} ${c.y + bob2}) scale(${c.w})`} opacity={op}>
                <path d="M0 0 Q28 -20 58 0 T118 -5" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
              </g>
            );
          })}

          {/* lueur usine lointaine — silhouette a peine visible tout en haut a droite, tres loin derriere
              l'horizon du verger. Pas de forme identifiable (juste une lueur), pas de texte. */}
          {factoryGlow > 0.01 && (
            <ellipse cx={1780} cy={520} rx={60} ry={90} fill={INK} opacity={factoryGlow} />
          )}

          {/* sol / horizon bas, meme registre que CargoVoyage16x9 (dunes/vert olive, pas de mer ici) */}
          <path d="M 0 760 Q 480 730 960 750 T 1920 745 L 1920 1080 L 0 1080 Z" fill={GROUND} opacity={0.5} />
          <path d="M 0 760 Q 480 730 960 750 T 1920 745" fill="none" stroke={INK} strokeWidth={2.6} opacity={0.4} />

          {/* verger — memes arbres que CargoVoyage16x9 (reutilisation litterale, pas un nouveau dessin) */}
          <g opacity={enter}>
            {[
              { x: 260, y: 820, s: 0.85, tone: 0 },
              { x: 620, y: 860, s: 0.95, tone: 1 },
              { x: 1420, y: 840, s: 0.9, tone: 0 },
              { x: 1680, y: 800, s: 0.8, tone: 2 },
            ].map((t, i) => {
              const sway = Math.sin(wf / 32 + i * 1.7) * 1.2;
              return (
                <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
                  <g transform={`rotate(${sway} 0 0)`}>
                    <CacaoTree alive={1} grow={1} tone={t.tone} />
                  </g>
                </g>
              );
            })}

            {/* LE PLANTEUR — echelle REALISTE (~1/3 cacaoyer, fix v2), centre du cadre. Torse VETU
                (tunicColor+tunicPattern, fix v2 — absent en v1). Meme recette de geste que les cueilleurs
                de la Scene 1 (bend/armReach cyclique, carry="none"). */}
            <g transform="translate(960 940) scale(0.34)">
              <StickRig
                walkPhase={0}
                moving={false}
                moveAmt={0}
                bend={bend}
                armReach={armReach}
                facing={-1}
                hat="scarf"
                tunicColor="#6b5637"
                tunicPattern="collar"
                carry="none"
                load={0}
              />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

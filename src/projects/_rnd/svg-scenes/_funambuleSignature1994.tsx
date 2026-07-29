// SCENE 1994 — "la signature" (murs FMI/FRANCE + 4 signatures + tampon -50%).
//
// EXTRAITE de CfaActe4Cle16x9.tsx (2026-07-26) pour etre reutilisee par la refonte
// CfaActe4Filet16x9.tsx SANS duplication. Cette scene est la SEULE partie de l'ancien beat 4
// jugee reussie : elle est CONSERVEE TELLE QUELLE (decision Aziz). Seule la partie carte qui la
// precedait a ete refaite (elle rejouait le beat 2).
//
// DIRECTION VALIDEE AZIZ (2026-07-23, comparatif GPT-5.6/Kimi-K3/Gemini/Fable, image-cible Gemini-A) :
// les 2 MURS FMI/FRANCE qui compriment litteralement l'espace autour du document (pas des poids qui
// pesent d'en haut) + 4 PLUMES SANS MAIN qui ecrivent les signatures (la main stylisee cassait le
// registre chez les 4 modeles, ecartee).
//
// Timings cales au forced-alignment reel de beat4-vo.mp3 :
//   bascule 32.5 · "ordre venu de l'exterieur" 38.04 · "chefs d'Etat" 41.74 · 1ere "signee" 43.10 ·
//   "pression" 45.64 · "FMI" 46.96 · derniere "signee" 49.66-49.96
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const NUIT2 = "#182746";
const TERRE = "#2c4066";
const ENCRE = "#f0e8d2";
const ENCRE_PALE = "#5b6d8f";
const OR = "#b8860b";
const OR_CLAIR = "#d9a93a";
const CUIVRE = "#c17e3a";
const RED = "#a8281f";

const pulse = (f: number, a: number, peak: number, end: number) =>
  interpolate(f, [S(a), S(a + peak), S(a + end)], [0, 1, 0], clamp);

// les memes reperes que l'ancien composant (inchanges)
const T = { bascule: 32.5, ordreHaut: 38.0, signStart: 41.7, pression: 45.6, tampon: 49.6 };

// ================== MVT 3 : scene encre/nuit — la signature de 1994 ==================
// DIRECTION VALIDEE AZIZ (2026-07-23, comparatif GPT-5.6/Kimi-K3/Gemini/Fable, image-cible Gemini-A retenue) :
// les 2 MURS FMI/FRANCE qui compriment litteralement l'espace autour du document (pas des poids qui pesent
// d'en haut) + 4 PLUMES SANS MAIN qui ecrivent successivement les signatures (encre qui s'ecrit seule — la
// main/pince stylisee testee en variante B casse le registre chez les 4 modeles, ecartee). Reference exacte :
// scratchpad/1994-targets/gemini-a.svg (murs+document+4 signatures) + plume de gemini-b.svg (sans la main).
export const Mvt3Signature1994: React.FC<{ frame: number; fps: number; appear: number }> = ({ frame, fps, appear }) => {
  const decreeIn = interpolate(frame, [S(T.bascule + 0.4), S(T.bascule + 1.6)], [0, 1], clamp);
  const DECX = 960, DECY = 540, DECW = 600, DECH = 830; // ratio proche gemini-a (660,100,600x880 -> centre)

  // MURS FMI/FRANCE — SPRING (review downstream 2026-07-23 : easing lineaire = "portes coulissantes legeres").
  // Masse forte + damping eleve = les murs CLAQUENT et freinent lourdement (overshoot leger), pas de glissement mou.
  const wallsSpring = spring({ frame: frame - S(T.ordreHaut), fps, config: { mass: 3, damping: 26, stiffness: 120 } });
  const wallsIn = Math.min(1, wallsSpring * 1.08); // clamp le petit overshoot du spring pour l'opacite
  // compression supplementaire pendant "pression enorme du FMI et de la France" — spring aussi (pas un ramp mou)
  const squeezeSpring = spring({ frame: frame - S(T.pression), fps, config: { mass: 2.2, damping: 22, stiffness: 100 } });
  const wallReach = 0.62 + 0.16 * Math.min(1.06, squeezeSpring); // leger overshoot = le mur "pousse" puis se stabilise

  // 4 signatures se tracent une a une (les chefs d'Etat africains) — positions reprises de gemini-a
  // (zones-signature du document, coord relatives au centre DECX/DECY)
  const sigSlots = [
    { x: -140, y: 40 },   // sig1 : x760-900,y740 (doc gemini-a centre~960,540)
    { x: 100, y: 30 },    // sig2 : x1020-1160,y740
    { x: -140, y: 160 },  // sig3 : x760-900,y860
    { x: 100, y: 150 },   // sig4 : x1020-1160,y860
  ];
  // etalees sur toute la fenetre, stagger + easeInOutCubic (review : "trait lineaire fait machine" —
  // ralenti sur les courbes/accelere sur les segments droits, rythme humain plutot que mecanique)
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const sigProg = (i: number) => interpolate(
    frame, [S(T.signStart + 0.3 + i * 2.2), S(T.signStart + 0.3 + i * 2.2 + 1.1)], [0, 1],
    { ...clamp, easing: easeInOutCubic }
  );
  // la plume (sans main) se deplace en glissant jusqu'a la zone puis "ecrit" — visible juste pendant son geste
  const plumeOp = (i: number) => {
    const p = sigProg(i);
    return interpolate(p, [0, 0.08, 0.92, 1], [0, 1, 1, 0], clamp);
  };
  // le document "souffre" a chaque signature (micro pulse d'echelle, review : "papier qui souffre sous la plume")
  const docPulse = Math.max(...sigSlots.map((_, i) => pulse(frame, T.signStart + 0.3 + i * 2.2 + 0.9, 0.15, 0.5)));

  // TAMPON -50% en 3 temps ("Mais ils l'ont signee") — impact physique + micro-shake (review downstream :
  // "il apparait platement" -> gravite a la descente, rebond au contact, flash+shake au moment precis de l'impact)
  const tampDrop = interpolate(frame, [S(T.tampon - 0.3), S(T.tampon)], [-220, 0], { ...clamp, easing: (t) => t * t }); // easeInQuad = gravite
  const tampOp = interpolate(frame, [S(T.tampon - 0.25), S(T.tampon - 0.05)], [0, 1], clamp);
  const tampPop = interpolate(frame, [S(T.tampon), S(T.tampon + 0.12), S(T.tampon + 0.35)], [1, 0.92, 1], clamp); // rebond au contact
  const flash = pulse(frame, T.tampon, 0.06, 0.3);
  // micro-shake global (3 frames) au moment precis de l'impact
  const shakeWindow = frame >= S(T.tampon) && frame < S(T.tampon) + 4;
  const shakeSeed = (n: number) => { let s = n * 9301 + 49297; s = s % 233280; return (s / 233280 - 0.5) * 2; };
  const shakeX = shakeWindow ? shakeSeed(frame) * 3 : 0;
  const shakeY = shakeWindow ? shakeSeed(frame + 100) * 3 : 0;

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={NUIT2} />

        {/* groupe global : micro-shake au moment precis de l'impact du tampon (review downstream) */}
        <g transform={`translate(${shakeX} ${shakeY})`}>

        {/* MURS FMI / FRANCE — masses monolithiques qui compriment l'espace (registre Gemini-A retenu) */}
        {wallsIn > 0.01 && (
          <g opacity={wallsIn}>
            {/* MUR GAUCHE FMI */}
            <g transform={`translate(${-260 * (1 - wallReach)} 0)`}>
              <polygon points="-50,-50 520,250 520,830 -50,1130" fill={TERRE} stroke={ENCRE_PALE} strokeWidth={2} />
              <line x1={520} y1={250} x2={520} y2={830} stroke={CUIVRE} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
              <text x={210} y={560} textAnchor="middle" fontFamily="Georgia, serif" fontSize={54} fontWeight={700}
                fill={ENCRE} letterSpacing={14} opacity={0.92}>FMI</text>
            </g>
            {/* MUR DROIT FRANCE */}
            <g transform={`translate(${260 * (1 - wallReach)} 0)`}>
              <polygon points="1970,-50 1400,250 1400,830 1970,1130" fill={TERRE} stroke={ENCRE_PALE} strokeWidth={2} />
              <line x1={1400} y1={250} x2={1400} y2={830} stroke={CUIVRE} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
              <text x={1710} y={560} textAnchor="middle" fontFamily="Georgia, serif" fontSize={44} fontWeight={700}
                fill={ENCRE} letterSpacing={8} opacity={0.92}>FRANCE</text>
            </g>
          </g>
        )}

        {/* DOCUMENT (fixe, cadre officiel) — pulse leger a chaque signature ("le papier souffre sous la plume") */}
        <g opacity={decreeIn} transform={`translate(${DECX} ${DECY}) scale(${1 + 0.012 * docPulse})`}>
          <rect x={-DECW / 2} y={-DECH / 2} width={DECW} height={DECH} fill={NUIT2} stroke={ENCRE} strokeWidth={3} />
          <rect x={-DECW / 2 + 15} y={-DECH / 2 + 15} width={DECW - 30} height={DECH - 30} fill="none" stroke={ENCRE_PALE} strokeWidth={1} />
          {/* coins structurels or */}
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
            <path key={i}
              d={`M ${sx * (DECW / 2 - 50)} ${sy * (DECH / 2)} L ${sx * (DECW / 2)} ${sy * (DECH / 2)} L ${sx * (DECW / 2)} ${sy * (DECH / 2 - 50)}`}
              fill="none" stroke={OR} strokeWidth={4} />
          ))}

          <text x={0} y={-DECH / 2 + 140} textAnchor="middle" fontFamily="Georgia, serif" fontSize={72} fontWeight={700}
            fill={ENCRE} letterSpacing={14}>1994</text>
          <line x1={-100} x2={100} y1={-DECH / 2 + 175} y2={-DECH / 2 + 175} stroke={CUIVRE} strokeWidth={2} />

          {/* lignes de texte figuratives (2 paragraphes) */}
          {[0, 35, 70, 105].map((dy, i) => (
            <line key={`p1-${i}`} x1={-240} x2={240 - (i === 3 ? 130 : 0)} y1={-DECH / 2 + 240 + dy} y2={-DECH / 2 + 240 + dy}
              stroke={ENCRE_PALE} strokeWidth={1.5} opacity={0.6} />
          ))}
          {[0, 35, 70].map((dy, i) => (
            <line key={`p2-${i}`} x1={-240} x2={240 - (i === 2 ? 200 : 0)} y1={-DECH / 2 + 400 + dy} y2={-DECH / 2 + 400 + dy}
              stroke={ENCRE_PALE} strokeWidth={1.5} opacity={0.6} />
          ))}

          {/* zones de signature preparees (pointilles, avant l'ecriture) */}
          {sigSlots.map((s, i) => (
            <line key={`slot-${i}`} x1={s.x} x2={s.x + 140} y1={s.y} y2={s.y}
              stroke={ENCRE_PALE} strokeWidth={1} strokeDasharray="4 4" opacity={0.4 * (1 - sigProg(i))} />
          ))}

          {/* 4 SIGNATURES — l'encre s'ecrit seule (ZERO main), trait cursif OR clair */}
          {sigSlots.map((s, i) => {
            const p = sigProg(i);
            if (p <= 0.01) return null;
            const d = `M ${s.x} ${s.y} q 20 -28 38 -6 q 14 18 28 -6 q 12 -18 32 4 q 15 15 32 -2`;
            return (
              <path key={`sig-${i}`} d={d} fill="none" stroke={OR_CLAIR} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
                pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)}
                style={{ filter: `drop-shadow(0 0 3px rgba(217,169,58,0.55))` }} />
            );
          })}

          {/* PLUME SANS MAIN — ligne fine + pointe, positionnee au point d'ecriture courant de chaque signature */}
          {sigSlots.map((s, i) => {
            const op = plumeOp(i);
            if (op <= 0.01) return null;
            const p = sigProg(i);
            const tipX = s.x + 130 * Math.min(1, p * 1.15);
            return (
              <g key={`plume-${i}`} opacity={op} transform={`translate(${tipX} ${s.y - 4}) rotate(-24)`}>
                <line x1={0} y1={0} x2={95} y2={-46} stroke={ENCRE} strokeWidth={5} strokeLinecap="round" />
                <polygon points="0,0 16,-13 18,0" fill={ENCRE} />
              </g>
            );
          })}
        </g>

        {/* TAMPON -50% (rouge, unique occurrence) — "Mais ils l'ont signee" */}
        {tampOp > 0.01 && (
          <g opacity={tampOp} transform={`translate(${DECX + 165} ${DECY + 240 + tampDrop}) scale(${tampPop}) rotate(-13)`}>
            <circle r={78} fill="none" stroke={RED} strokeWidth={6} opacity={0.92} />
            <circle r={66} fill="none" stroke={RED} strokeWidth={1.5} opacity={0.6} />
            <text x={0} y={16} textAnchor="middle" fontFamily="Georgia, serif" fontSize={46} fontWeight={700} fill={RED}>−50%</text>
          </g>
        )}
        </g>
        {flash > 0.01 && <rect x={0} y={0} width={W} height={H} fill={ENCRE} opacity={0.12 * flash} />}
      </svg>
    </AbsoluteFill>
  );
};


export default Mvt3Signature1994;

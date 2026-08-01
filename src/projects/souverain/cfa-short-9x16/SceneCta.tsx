// SceneCta — Short Franc CFA 9x16 — CTA final vers le mid-form.
//
// Calque le CTA du Short AES 90s / Short Senegal D3 (meme structure cartouche
// "L'HISTOIRE COMPLETE" + accroches + "VIDEO COMPLETE EN DESCRIPTION") — dans le registre
// encre/nuit #182746 du mid-form CFA (pas le parchemin Senegal, pas le fond photo AES).
//
// Structure narrative (forced-alignment cfa-short-vo-v2.mp3) :
//   64.86 -> 65.90 : "L'histoire complete" -> le cartouche pop, titre
//   66.56 -> 72.48 : "la garantie de Paris / la nuit de 1994 / la sortie du Sahel"
//     -> 3 accroches revelees une par une (synchro audio)
//   72.56 -> 75.62 : "dans la video longue. Lien en description." -> bandeau final
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const W = 1080;
const H = 1920;

const NUIT = "#182746";
const NUIT_CLAIR = "#22345c";
const OR = "#b8860b";
const OR_CLAIR = "#d9a93a";
const IVOIRE = "#f0e8d2";

const SERIF = "Georgia, serif";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---- timings (secondes, forced-alignment cfa-short-vo-v2.mp3) ----
const T_CARD_IN = 64.86; // "L'histoire complète"
const T_A1 = 66.56; // "la garantie"
const T_A2 = 68.22; // "la nuit" [de 1994]
const T_A3 = 70.68; // "la sortie" [du Sahel]
const T_DESC = 72.56; // "dans la vidéo longue"
const T_TOTAL = 75.62; // fin VO

export const CFA_SHORT_CTA_FPS = 30;
// demarre a T_CARD_IN - un peu d'avance (le cartouche pop juste avant le mot), fenetre alignee
// sur l'assemblage global : ce composant est utilise en Sequence dans le montage final, from =
// frame absolue T_CARD_IN*30. En composition de test standalone, il tourne a partir de frame 0
// avec un offset interne T_OFFSET.
const T_OFFSET = T_CARD_IN - 1.0; // 1s d'avance pour le pop du cartouche
export const CFA_SHORT_CTA_FRAMES = Math.round((T_TOTAL - T_OFFSET + 2.0) * CFA_SHORT_CTA_FPS); // +2s de queue avant coupe nette

const t2f = (abs: number, fps: number) => Math.round((abs - T_OFFSET) * fps);

export const SceneCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fCardIn = t2f(T_CARD_IN, fps);
  const fA1 = t2f(T_A1, fps);
  const fA2 = t2f(T_A2, fps);
  const fA3 = t2f(T_A3, fps);
  const fDesc = t2f(T_DESC, fps);
  const fTotal = t2f(T_TOTAL, fps);

  const cardPop = spring({ fps, frame: Math.max(0, frame - fCardIn), config: { damping: 14, stiffness: 120 } });
  const cardScale = interpolate(cardPop, [0, 1], [0.8, 1]);
  const cardOp = interpolate(frame, [fCardIn - 6, fCardIn + 6], [0, 1], clamp);

  const a1Op = interpolate(frame - fA1, [0, 10], [0, 1], clamp);
  const a2Op = interpolate(frame - fA2, [0, 10], [0, 1], clamp);
  const a3Op = interpolate(frame - fA3, [0, 10], [0, 1], clamp);
  const descOp = interpolate(frame - fDesc, [0, 12], [0, 1], clamp);

  // fondu de sortie : le cartouche reste affiche jusqu'a la fin de "lien en description",
  // puis un fondu doux ferme la scene (meme pattern que Senegal/AES).
  const exitFade = interpolate(frame, [fTotal + 12, fTotal + 48], [1, 0], clamp);

  const accroche = (txt: string, op: number) => (
    <div
      style={{
        opacity: op,
        fontFamily: SERIF,
        fontSize: 30,
        color: IVOIRE,
        letterSpacing: 2,
        textAlign: "center",
        transform: `translateY(${interpolate(op, [0, 1], [10, 0])}px)`,
      }}
    >
      {txt}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: NUIT, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ctaNuit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={NUIT} />
            <stop offset="0.5" stopColor={NUIT_CLAIR} />
            <stop offset="1" stopColor={NUIT} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#ctaNuit)" />
      </svg>

      {cardOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: cardOp,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 140,
          }}
        >
          <div
            style={{
              transform: `scale(${cardScale})`,
              background: NUIT,
              border: `4px solid ${OR}`,
              borderRadius: 18,
              padding: "64px 48px",
              maxWidth: "84%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div style={{ fontFamily: SERIF, fontSize: 62, color: IVOIRE, letterSpacing: 3, lineHeight: 1.1, fontWeight: 700 }}>
              L&apos;HISTOIRE
              <br />
              COMPLÈTE
            </div>
            <div style={{ width: 130, height: 3, background: OR }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {accroche("LA GARANTIE DE PARIS", a1Op)}
              {accroche("LA NUIT DE 1994", a2Op)}
              {accroche("LA SORTIE DU SAHEL", a3Op)}
            </div>
            <div
              style={{
                opacity: descOp,
                marginTop: 6,
                fontFamily: SERIF,
                fontSize: 34,
                color: NUIT,
                background: OR_CLAIR,
                borderRadius: 12,
                padding: "14px 30px",
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              VIDÉO COMPLÈTE EN BIO
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default SceneCta;

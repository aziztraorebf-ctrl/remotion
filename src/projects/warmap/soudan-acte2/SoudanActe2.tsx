/**
 * SoudanActe2 — ACTE 2 "BLOCAGE" (73.6s @30fps = 2208 frames).
 *
 * Registres (plan gravé, validé Aziz) :
 *   - beats 1-4 (alliance -> scission) = CARTE Mapbox + jeton 2-visages (symbole signature). [CE FICHIER, phase 1]
 *   - beat 5 (assaut RSF Khartoum) = INSERT KhartoumEtatMajorSVG (déjà validé). [à assembler]
 *   - beat 6 (territoire vs puissance de feu) = BLOC FrontOuvertSVG. [à réhabiller]
 *   - beats 7-8-9 (immensité/ravitaillement/front figé + pont Acte 3) = CARTE Mapbox. [à coder]
 *
 * Socle : SoudanWarMapEngine (grammaire AES : contour permanent + intérieur vide, halos locaux
 * jamais d'aplat, Ken Burns permanent). Audio : acte2-blocage.mp3 (73.6s). Align : whisper-words-acte2.ts.
 *
 * ⚠️ ÉTAT : beats 1-4 câblés (jeton 2-visages : convergence -> fusion -> fend -> split). Beats 5-9 = TODO.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { SoudanWarMapEngine, CamKey, StateHighlight, ZoneControl } from "../engine/SoudanWarMapEngine";
import { SoudanToken, Pt } from "../engine/soudanActors";
import { TwoFaceToken } from "./TwoFaceToken";

export const SOUDAN_A2_FPS = 30;
export const SOUDAN_A2_FRAMES = 2220; // 74.0s (audio LOCK : 3 blocs 0.45, prononciation nettoyée + 2 pauses)

// ── ANCRAGES GÉO RÉELS (cohérents Acte 1) ──
const DARFUR: [number, number] = [26.0, 14.9];     // Hemedti (ouest, Nord-Darfour)
const KHARTOUM: [number, number] = [32.55, 15.6];  // al-Burhan + point de fusion (capitale, centre-est)
const FUSION: [number, number] = [30.2, 15.3];     // point de rencontre des 2 jetons (centre du Soudan)

// ── FRAMES (whisper-words-acte2.ts, 30fps) ──
// frames = whisper-words-acte2.ts (audio LOCK 74s @30, 3 blocs + 2 pauses). Ancrages vérifiés.
const F = {
  start: 0,
  converge: 55,       // les 2 jetons se rapprochent (b1 "ils étaient des partenaires", @f240)
  fusion: 296,        // "en 2021" -> FUSION en jeton 2-visages
  hamdok: 464,        // "Abdalla Hamdok" -> le gouvernement civil se ternit
  mais: 619,          // "Mais un pays ne peut pas avoir deux armées"
  commande: 756,      // "qui commande l'autre" -> FEND (la faille se fend + vibre)
  avril23: 911,       // "avril 2023" -> SPLIT (séparation + reconstitution)
  ouverte: 1004,      // "guerre ouverte"
  premier: 1130,      // "ouvert le feu en premier" -> fin beat 4
  b5: 1202,           // "15 avril" -> début insert beat 5 (hors ce fichier phase 1)
  fin: SOUDAN_A2_FRAMES,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── CAMÉRA : centrée sur le centre du Soudan (là où les jetons fusionnent), Ken Burns lent permanent.
// Zoom moyen (~5.2) : on voit le pays + les 2 jetons convergents. Léger resserrement à la fusion. ──
const CAM: CamKey[] = [
  { f: F.start, lon: 30.0, lat: 15.4, zoom: 5.0 },
  { f: F.converge, lon: 30.1, lat: 15.35, zoom: 5.08 },
  { f: F.fusion, lon: 30.2, lat: 15.3, zoom: 5.35 },     // resserre sur la fusion
  { f: F.commande, lon: 30.25, lat: 15.32, zoom: 5.4 },  // tension, serré
  { f: F.avril23, lon: 30.2, lat: 15.3, zoom: 5.25 },    // léger dézoom à la scission (respire)
  { f: F.premier, lon: 30.4, lat: 15.35, zoom: 5.15 },   // drift vers l'est (pont beat 5 Khartoum)
  { f: F.b5, lon: 30.6, lat: 15.45, zoom: 5.12 },
];

// ── HIGHLIGHTS : table rase de l'Acte 1. Au repos la carte est VIDE (grand bloc crème). On ne trace
// rien au b1-b2 (alliance = pas de territoire qui bascule). Au SPLIT (b4), les 2 zones se re-suggèrent :
// l'ouest RSF (Hemedti) et l'est SAF (al-Burhan) — retour à la partition de l'Acte 1. ──
const HL = (state: string, faction: "rsf" | "saf" | "contested", drawAt: number): StateHighlight => ({
  state, faction, drawAt, drawFrames: 34, holdFrames: 1200, fadeFrames: 0,
});
const HIGHLIGHTS: StateHighlight[] = [
  HL("North Darfur", "rsf", F.avril23 + 20),   // l'ouest redevient RSF au split
  HL("Khartoum", "saf", F.avril23 + 40),        // l'est redevient SAF
];

export const SoudanActe2: React.FC = () => {
  const frame = useCurrentFrame();

  // ── convergence des 2 jetons solos (Acte 1) vers le point de fusion (b1) ──
  const conv = interpolate(frame, [F.converge, F.fusion], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  // les solos s'effacent juste avant la fusion (cross-fade vers le jeton 2-visages)
  const soloOp = interpolate(frame, [F.fusion - 20, F.fusion - 4], [1, 0], clamp);
  const mergedOp = interpolate(frame, [F.fusion - 8, F.fusion + 2], [0, 1], clamp);

  // halos de contrôle : au SPLIT, le rouge (ouest) et le bleu (est) rayonnent doucement (retour partition)
  const rsfHalo = interpolate(frame, [F.avril23, F.avril23 + 60], [0, 0.85], clamp);
  const safHalo = interpolate(frame, [F.avril23 + 20, F.avril23 + 80], [0, 0.85], clamp);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 300, intensity: rsfHalo },
    { at: KHARTOUM, faction: "saf", radiusKm: 240, intensity: safHalo },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte2-blocage.mp3")} />

      {/* SFX ancrés au mot */}
      <Sequence from={F.fusion} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.42} /></Sequence>
      <Sequence from={F.commande} durationInFrames={26}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F.avril23} durationInFrames={30}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM} zones={zones} highlights={HIGHLIGHTS} showNationalBorder stateLineOpacity={0}>
        {(proj) => {
          const fusionPos = proj(FUSION);
          // positions de départ des solos : Hemedti à l'ouest (Darfour), al-Burhan à l'est (Khartoum)
          const startL = proj(DARFUR);
          const startR = proj(KHARTOUM);
          if (!fusionPos) return null;

          // interpolation écran des solos vers le point de fusion
          const lx = startL ? startL.x + (fusionPos.x - startL.x) * conv : fusionPos.x;
          const ly = startL ? startL.y + (fusionPos.y - startL.y) * conv : fusionPos.y;
          const rx = startR ? startR.x + (fusionPos.x - startR.x) * conv : fusionPos.x;
          const ry = startR ? startR.y + (fusionPos.y - startR.y) * conv : fusionPos.y;

          return (
            <>
              {/* ── b1 : les 2 jetons solos convergent vers le centre ── */}
              {soloOp > 0.01 && frame >= F.converge - 4 && (
                <>
                  <SoloBig pos={{ x: lx, y: ly }} sprite="portrait-hemeti" border="#B14B3C" op={soloOp} frame={frame} appear={F.converge - 4} />
                  <SoloBig pos={{ x: rx, y: ry }} sprite="portrait-burhan" border="#3E6E9E" op={soloOp} frame={frame} appear={F.converge - 4} />
                </>
              )}

              {/* ── b2-b4 : le jeton 2-visages gère fusion -> fend -> split (reconstitution) ── */}
              {mergedOp > 0.01 && (
                <div style={{ opacity: mergedOp }}>
                  <TwoFaceToken pos={fusionPos} frame={frame}
                    mergeAt={F.fusion} fendAt={F.commande} splitAt={F.avril23}
                    splitGap={200} D={124} appearFrom={F.fusion - 6} />
                </div>
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* ── b2 : cartouche "gouvernement civil renversé" (Hamdok) — apparaît au nom, se ternit/barre ── */}
      <CivilGovCartouche frame={frame} at={F.hamdok} />

      {/* ── VIGNETTE CHAUDE (cohérence Acte 1 : lampe de bureau) ── */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply",
        background: "radial-gradient(ellipse 74% 70% at 50% 47%, rgba(255,240,210,0.06) 0%, rgba(60,42,18,0.0) 42%, rgba(28,18,8,0.42) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light",
        background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,238,200,0.22) 0%, rgba(255,238,200,0) 60%)" }} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Jeton solo GRAND (pré-fusion) — même look que TokenBase Acte 1, D=124, scale figé après spring.
// ─────────────────────────────────────────────────────────────────────────────
const SoloBig: React.FC<{ pos: Pt; sprite: string; border: string; op: number; frame: number; appear: number }> =
  ({ pos, sprite, border, op, frame, appear }) => {
    const D = 124;
    const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.12, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) });
    const CREAM = "#F2E5C8";
    return (
      <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-50%) scale(${ap})`, opacity: op, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "50%", top: "68%", width: D * 0.9, height: D * 0.24,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />
        <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: CREAM,
          border: `${D * 0.05}px solid ${border}`, boxSizing: "border-box",
          boxShadow: "0 5px 14px rgba(0,0,0,0.5)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ position: "absolute", top: "50%", left: "50%", width: "116%", height: "116%",
              transform: "translate(-50%,-48%)", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
      </div>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// b2 : cartouche "gouvernement civil" (Hamdok) qui se TERNIT (coup d'État par le haut, SANS bataille).
// Un bandeau parchemin sobre : "GOUVERNEMENT DE TRANSITION" + Abdalla Hamdok, qui grisonne + barre.
// ─────────────────────────────────────────────────────────────────────────────
const CivilGovCartouche: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const inOp = interpolate(frame, [at - 10, at + 8], [0, 1], clamp);
  const outOp = interpolate(frame, [at + 140, at + 170], [1, 0], clamp);
  const op = inOp * outOp;
  if (op <= 0.01) return null;
  // grisonne : la couleur se désature à mesure qu'on comprend qu'il est renversé
  const gray = interpolate(frame, [at + 40, at + 110], [0, 1], clamp);
  const strike = interpolate(frame, [at + 60, at + 100], [0, 1], clamp); // trait qui barre
  return (
    <div style={{ position: "absolute", top: 84, left: "50%", transform: "translateX(-50%)", opacity: op,
      pointerEvents: "none", fontFamily: "Georgia, serif", textAlign: "center",
      background: "rgba(28,18,8,0.86)", border: "1px solid rgba(233,196,106,0.35)", borderRadius: 5,
      padding: "10px 26px", filter: `grayscale(${gray}) brightness(${1 - gray * 0.35})` }}>
      <div style={{ fontSize: 15, letterSpacing: 3, color: "#C9A968", textTransform: "uppercase" }}>
        Gouvernement de transition
      </div>
      <div style={{ position: "relative", fontSize: 26, fontWeight: 700, color: "#F4E3B0", marginTop: 3, letterSpacing: 1 }}>
        Abdalla Hamdok
        {/* trait qui barre (renversé) */}
        <div style={{ position: "absolute", left: 0, top: "52%", height: 2, width: `${strike * 100}%`,
          background: "#B14B3C", transformOrigin: "left" }} />
      </div>
    </div>
  );
};

export default SoudanActe2;

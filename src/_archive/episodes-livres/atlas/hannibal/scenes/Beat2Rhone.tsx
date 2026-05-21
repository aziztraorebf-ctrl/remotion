// Beat 2 — Le Rhône : traversée des éléphants et victoire sur les Volques
// Architecture 3 phases :
//   Phase A f0→150   : carte SVG vue "south" — dolly-in Rhône + spotlight 37 éléphants
//   Phase B f150→450 : insert Seedance i2v plein écran — traversée animée
//   Phase C f450→905 : retour carte SVG — whip-pan numides + orbital + dolly-out
// Timings calés sur Whisper word-level (frames relatifs depuis BEATS.beat2)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import {
  HANNIBAL_PALETTE,
  HANNIBAL_FONTS,
  HANNIBAL_LETTERSPACING,
  HANNIBAL_TYPO,
} from "../components/HannibalPalette";
import { BEATS, DURATIONS } from "../timing";
import {
  svgToComp,
  focusOffsetForPOI,
  ATLAS_SVG_W as SVG_W,
  ATLAS_SVG_H as SVG_H,
  ATLAS_CSS_SCALE as CSS_SCALE,
  ATLAS_CX as CX,
  ATLAS_CY as CY,
  getSpriteAnimFrame,
} from "../../_shared/atlas-components";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hannibalData = require("../../../../../data/geo/hannibal-data.json");

// === Phases ===
const T_SEEDANCE_IN  = 150; // 5s — début insert Seedance
const T_SEEDANCE_OUT = 450; // 15s — fin insert Seedance
const SEEDANCE_FADE  = 10;  // frames fade-in / fade-out

// === Timings Whisper word-level (frames RELATIFS depuis début Beat 2) ===
const T_RHONE_REVELE    = 0;    // dès le début — le Rhône est le sujet immédiat
const T_37_ELEPHANTS    = 90;   // spotlight "37 éléphants" apparaît au hold zoom
const T_TRAVERSER       = 249;  // "à faire traverser"
const T_FLOTTENT        = 474;  // "ils flottent"
const T_AUTRE_RIVE      = 544;  // "Mais sur l'autre rive"
const T_VOLQUES         = 606;  // "les Volques attendent"
const T_NUMIDE          = 696;  // "cavalerie numide"
const T_REVERS          = 744;  // "prend à revers"
const T_VICTOIRE        = 802;  // "Première victoire"
const T_BEAT2_END       = DURATIONS.beat2; // 905

// === Vue south — données géo ===
const viewSouth = hannibalData.views.south;
const countries = viewSouth.countries as { iso: string; d: string }[];
const poi = viewSouth.poi;
const rhonePath = viewSouth.rhone as string;
const routePath = viewSouth.route as string;

// Coordonnées RHONE_CROSSING en espace SVG (JSON = 1080×1920 → diviser par CSS_SCALE 1.5)
const RHONE_SVG_X = poi.RHONE_CROSSING.x / CSS_SCALE; // 645.1 / 1.5 = 430
const RHONE_SVG_Y = poi.RHONE_CROSSING.y / CSS_SCALE; // 935 / 1.5 = 623

// Focus cible Phase A : haut du path Rhône (Provence nord) — centre le fleuve à l'écran
// Rhône path début = x=788/1.5=525, y=767/1.5=511 en SVG
// On cible ce point pour avoir le fleuve au centre avec terre visible des deux côtés
const RHONE_FOCUS_X = 788.7 / CSS_SCALE; // ~525 SVG — début du path Rhône (nord)
const RHONE_FOCUS_Y = 766.8 / CSS_SCALE; // ~511 SVG — haut du Rhône en Provence

// Rive gauche du Rhône (ouest) — là où Hannibal rassemble ses troupes
// Le Rhône descend quasi verticalement autour de x=430 SVG
// La rive gauche est à environ 35px à l'ouest du point de traversée
const RIVE_GAUCHE_SVG_X = RHONE_SVG_X - 35;
const RIVE_GAUCHE_SVG_Y = RHONE_SVG_Y - 15;

// === Caméra Phase A (f0→150) ===
function computeCameraPhaseA(frame: number) {
  const driftX = Math.sin(frame * 0.009) * 1.8;
  const driftY = Math.cos(frame * 0.007) * 1.2;

  // Dolly-in 1.0→1.8x — centré sur le haut du Rhône, fleuve visible au centre
  const camZoom = interpolate(frame, [0, 90], [1.0, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Focus glisse vers le haut du Rhône (Provence) pendant le dolly
  const focusT = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const focusX = CX + (RHONE_FOCUS_X - CX) * focusT;
  const focusY = CY + (RHONE_FOCUS_Y - CY) * focusT;

  return { focusX, focusY, camZoom, driftX, driftY };
}

export const Beat2Rhone: React.FC = () => {
  const frame = useCurrentFrame();

  const isPhaseA = frame < T_SEEDANCE_IN;
  const isPhaseB = frame >= T_SEEDANCE_IN && frame <= T_SEEDANCE_OUT;
  const isPhaseC = frame > T_SEEDANCE_OUT;

  const camA = computeCameraPhaseA(frame);

  // === Phase A — illumination Rhône ===
  // Visible dès f0, s'intensifie progressivement
  const rhoneStrokeWidth = interpolate(frame, [0, 60], [2, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rhoneOpacity = interpolate(frame, [0, 60], [0.6, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Glow ambré en dessous (largeur 3x)
  const rhoneGlowOpacity = interpolate(frame, [0, 80], [0.0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase A — spotlight "37 éléphants" ===
  const spotlightOpacity = interpolate(
    frame,
    [T_37_ELEPHANTS, T_37_ELEPHANTS + 20, T_SEEDANCE_IN - 15, T_SEEDANCE_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // === Fade global Phase A → Phase B (cut propre vers Seedance) ===
  const phaseAOpacity = interpolate(
    frame,
    [T_SEEDANCE_IN - 10, T_SEEDANCE_IN],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // === Phase B — clip Seedance ===
  const seedanceOpacity = interpolate(
    frame,
    [T_SEEDANCE_IN, T_SEEDANCE_IN + SEEDANCE_FADE, T_SEEDANCE_OUT - SEEDANCE_FADE, T_SEEDANCE_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // === Phase C — sprites et UI (masqués pendant Seedance) ===
  const spritesVisible = frame < T_SEEDANCE_IN || frame > T_SEEDANCE_OUT;

  const volquesOpacity = interpolate(
    frame,
    [T_TRAVERSER - 20, T_TRAVERSER + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const warCryActive = frame >= T_AUTRE_RIVE;
  const volqueFightFrame  = getSpriteAnimFrame(frame, T_TRAVERSER - 20, 5, 8);
  const volqueWarCryFrame = getSpriteAnimFrame(frame, T_AUTRE_RIVE, 5, 9);
  const volque2FightFrame  = (volqueFightFrame + 2) % 8;
  const volque2WarCryFrame = (volqueWarCryFrame + 3) % 9;

  const numidesOpacity = interpolate(
    frame,
    [T_NUMIDE, T_NUMIDE + 20, T_REVERS + 40, T_REVERS + 70],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const numide1X = interpolate(frame, [T_NUMIDE, T_NUMIDE + 60], [-80, 280], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const numide2X = interpolate(frame, [T_NUMIDE + 8, T_NUMIDE + 68], [-80, 170], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const numideAnimFrame = getSpriteAnimFrame(frame, T_NUMIDE, 4, 6);

  const volquesLabelOpacity = interpolate(
    frame,
    [T_VOLQUES, T_VOLQUES + 20, T_NUMIDE - 10, T_NUMIDE + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const victoireOpacity = interpolate(
    frame,
    [T_VICTOIRE, T_VICTOIRE + 20, T_BEAT2_END - 20, T_BEAT2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Chemins animations Phase C (sprites sur background Gemini)
  const HANNIBAL_IDLE_BASE = "hannibal/assets/characters/hannibal-v4a/animations/animating-c596874c/east";
  const VOLQUE_IDLE_BASE   = "hannibal/assets/characters/volque/animations/animating-3cc254d2/west";
  const VOLQUE_WARCRY_BASE = "hannibal/assets/characters/volque/animations/he_raise_his_spear_in_the_air_and_shout_a_war_cry-363da147/south";
  const NUMIDE_RUN_BASE    = "hannibal/assets/characters/numide/animations/running-140cdb93/north";

  function spriteFrame(basePath: string, animFrame: number): string {
    return `${basePath}/frame_${String(animFrame).padStart(3, "0")}.png`;
  }

  // Dimensions sprites Phase C
  const ELEPH_SCALE = 3.2;
  const ELEPH_W = 128 * ELEPH_SCALE;
  const ELEPH_H = 80 * ELEPH_SCALE;
  const HANNIBAL_SCALE = 2.8;
  const HANNIBAL_W = 92 * HANNIBAL_SCALE;
  const HANNIBAL_H = 92 * HANNIBAL_SCALE;
  const VOLQUE_SCALE = 2.2;
  const VOLQUE_W = 68 * VOLQUE_SCALE;
  const VOLQUE_H = 68 * VOLQUE_SCALE;
  const NUMIDE_SCALE = 2.0;
  const NUMIDE_W = 68 * NUMIDE_SCALE;
  const NUMIDE_H = 68 * NUMIDE_SCALE;

  const hannibalAnimFrame = getSpriteAnimFrame(frame, T_RHONE_REVELE, 4, 8);
  const hannibalOpacity = isPhaseC
    ? interpolate(frame, [T_SEEDANCE_OUT, T_SEEDANCE_OUT + 20], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 0;
  const elephProgress = interpolate(frame, [T_TRAVERSER, T_AUTRE_RIVE], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const elephEased = interpolate(elephProgress, [0, 0.4, 0.85, 1.0], [0, 0.55, 0.92, 1.0]);
  const elephX = -80 + (900 - (-80)) * elephEased;
  const elephFloat = Math.sin(frame * 0.22) * 5;
  const elephOpacity = interpolate(
    frame,
    [T_TRAVERSER - 15, T_TRAVERSER, T_AUTRE_RIVE, T_AUTRE_RIVE + 25],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE }}>
      <Audio
        src={staticFile("hannibal/audio/narration-v2.mp3")}
        startFrom={BEATS.beat2}
        endAt={BEATS.beat3}
      />
      <Audio
        src={staticFile("hannibal/audio/music/v1-A-marche-punique.mp3")}
        volume={0.15}
      />

      {/* ================================================================
          PHASE A : Carte SVG vue "south" (f0→150)
      ================================================================ */}
      {isPhaseA && (
        <AbsoluteFill style={{ opacity: phaseAOpacity }}>
          {/* Couche 1 : SVG carte avec camZoom */}
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          >
            <g transform={`translate(${CX + camA.driftX} ${CY + camA.driftY}) scale(${camA.camZoom}) translate(${-camA.focusX} ${-camA.focusY})`}>
              {/* Fond mer */}
              <rect x={-SVG_W * 5} y={-SVG_H * 5} width={SVG_W * 11} height={SVG_H * 11} fill={HANNIBAL_PALETTE.MER} />

              {/* Pays */}
              <g transform={`scale(${1 / CSS_SCALE})`}>
                {countries.map((c: { iso: string; d: string }) => {
                  const zoneNarrative = ["ESP", "FRA", "ITA", "CHE"].includes(c.iso);
                  const afriqueNord = ["MAR", "DZA", "TUN", "LBY"].includes(c.iso);
                  const fill = zoneNarrative ? "#D4C8B0" : afriqueNord ? "#C0AE88" : "#B8A882";
                  return (
                    <path key={c.iso} d={c.d} fill={fill} stroke="#6A5E4A" strokeWidth={1.0} strokeOpacity={0.9} />
                  );
                })}

                {/* Rhône — glow ambré en dessous */}
                <path
                  d={rhonePath}
                  fill="none"
                  stroke={HANNIBAL_PALETTE.OR_SOLDAT}
                  strokeWidth={rhoneStrokeWidth * 3}
                  strokeOpacity={rhoneGlowOpacity}
                  strokeLinecap="round"
                />
                {/* Rhône — trait principal MER_VIF */}
                <path
                  d={rhonePath}
                  fill="none"
                  stroke={HANNIBAL_PALETTE.MER_VIF}
                  strokeWidth={rhoneStrokeWidth}
                  strokeOpacity={rhoneOpacity}
                  strokeLinecap="round"
                />

              </g>
            </g>
          </svg>

          {/* Couche 2 : Sprites sur le Rhône via svgToComp() */}
          {(() => {
            const spritesOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // Éléphant : aligné sur le début du tracé Rhône (point haut du path)
            // path démarre à x=788.7/1.5=525, y=766.8/1.5=511 en SVG
            const elephPos = svgToComp(525, 511, camA);
            const elephBreath = 1 + Math.sin(frame * 0.08) * 0.025;
            const ELEPH_A_W = 80 * camA.camZoom;
            const ELEPH_A_H = 50 * camA.camZoom;
            // Soldat : légèrement en retrait à gauche sur le même tracé
            const soldatPos = svgToComp(510, 520, camA);
            const soldatBreath = 1 + Math.sin(frame * 0.11 + 1.2) * 0.02;
            const SOLDAT_W = 40 * camA.camZoom;
            const SOLDAT_H = 40 * camA.camZoom;
            return (
              <>
                {/* Éléphant idle */}
                <div style={{
                  position: "absolute",
                  left: elephPos.x - ELEPH_A_W / 2,
                  top: elephPos.y - ELEPH_A_H,
                  opacity: spritesOpacity,
                  transform: `scale(${elephBreath})`,
                  transformOrigin: "center bottom",
                  pointerEvents: "none",
                }}>
                  <Img
                    src={staticFile("hannibal/assets/map-objects/elephant-radeau/elephant-radeau-v2-base.png")}
                    width={ELEPH_A_W}
                    height={ELEPH_A_H}
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                {/* Soldat carthaginois idle */}
                <div style={{
                  position: "absolute",
                  left: soldatPos.x - SOLDAT_W / 2,
                  top: soldatPos.y - SOLDAT_H,
                  opacity: spritesOpacity,
                  transform: `scale(${soldatBreath})`,
                  transformOrigin: "center bottom",
                  pointerEvents: "none",
                }}>
                  <Img
                    src={staticFile("hannibal/assets/characters/soldat-carthaginois/east.png")}
                    width={SOLDAT_W}
                    height={SOLDAT_H}
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </>
            );
          })()}

          {/* Couche 3 : UI fixe — spotlight "37 éléphants" */}
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <div style={{
              position: "absolute",
              top: 200,
              left: 80,
              right: 80,
              opacity: spotlightOpacity,
              backgroundColor: "rgba(8,8,16,0.92)",
              border: `2px solid ${HANNIBAL_PALETTE.OR_SOLDAT}`,
              borderRadius: 6,
              padding: "20px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
              <div style={{
                fontFamily: HANNIBAL_FONTS.MONO,
                fontSize: HANNIBAL_TYPO.CARTOUCHE_GRAND,
                color: HANNIBAL_PALETTE.OR_SOLDAT,
                letterSpacing: HANNIBAL_LETTERSPACING.MONO,
                lineHeight: 1,
              }}>
                37
              </div>
              <div style={{
                fontFamily: HANNIBAL_FONTS.SERIF,
                fontSize: HANNIBAL_TYPO.LABEL_VILLE,
                color: HANNIBAL_PALETTE.PARCHEMIN,
                letterSpacing: HANNIBAL_LETTERSPACING.LABEL,
                textTransform: "uppercase",
              }}>
                éléphants de guerre
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ================================================================
          PHASE B : Clip Seedance i2v (f150→450)
      ================================================================ */}
      {isPhaseB && (
        <div style={{ position: "absolute", inset: 0, opacity: seedanceOpacity }}>
          <Sequence from={T_SEEDANCE_IN} durationInFrames={T_SEEDANCE_OUT - T_SEEDANCE_IN}>
            <Video
              src={staticFile("hannibal/assets/video-tests/beat2-i2v-v1.mp4")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              volume={0.25}
            />
          </Sequence>
        </div>
      )}

      {/* ================================================================
          PHASE C : Background Gemini + sprites (f450→905)
      ================================================================ */}
      {isPhaseC && (
        <AbsoluteFill>
          {/* Background Gemini */}
          <Img
            src={staticFile("hannibal/assets/backgrounds/rhone-beat2-composite-v2.png")}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
            }}
          />

          {/* Vignette */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            opacity: 0.55,
            pointerEvents: "none",
          }} />

          {/* Sprites (masqués pendant Seedance — déjà garantis par isPhaseC) */}

          {/* Hannibal — rive gauche */}
          <div style={{
            position: "absolute",
            left: 130 + Math.sin(frame * 0.07) * 1.5,
            top: 1480 - HANNIBAL_H,
            opacity: hannibalOpacity,
            pointerEvents: "none",
          }}>
            <Img
              src={staticFile(spriteFrame(HANNIBAL_IDLE_BASE, hannibalAnimFrame))}
              width={HANNIBAL_W}
              height={HANNIBAL_H}
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Éléphant-radeau — traverse le fleuve (phase C début) */}
          {frame < T_AUTRE_RIVE + 25 && (
            <div style={{
              position: "absolute",
              left: elephX,
              top: 950 - ELEPH_H + elephFloat,
              opacity: elephOpacity,
              pointerEvents: "none",
            }}>
              <Img
                src={staticFile("hannibal/assets/map-objects/elephant-radeau/elephant-radeau-v2-base.png")}
                width={ELEPH_W}
                height={ELEPH_H}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}

          {/* Volques */}
          {frame >= T_TRAVERSER - 20 && (
            <>
              <div style={{
                position: "absolute",
                left: 820,
                top: 560 - VOLQUE_H,
                opacity: volquesOpacity,
                pointerEvents: "none",
              }}>
                <Img
                  src={staticFile(spriteFrame(
                    warCryActive ? VOLQUE_WARCRY_BASE : VOLQUE_IDLE_BASE,
                    warCryActive ? volqueWarCryFrame : volqueFightFrame,
                  ))}
                  width={VOLQUE_W}
                  height={VOLQUE_H}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div style={{
                position: "absolute",
                left: 940,
                top: 590 - VOLQUE_H,
                opacity: volquesOpacity * 0.9,
                pointerEvents: "none",
              }}>
                <Img
                  src={staticFile(spriteFrame(
                    warCryActive ? VOLQUE_WARCRY_BASE : VOLQUE_IDLE_BASE,
                    warCryActive ? volque2WarCryFrame : volque2FightFrame,
                  ))}
                  width={VOLQUE_W}
                  height={VOLQUE_H}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </>
          )}

          {/* Numides */}
          {frame >= T_NUMIDE && (
            <>
              <div style={{
                position: "absolute",
                left: numide1X,
                top: 1350 - NUMIDE_H,
                opacity: numidesOpacity,
                pointerEvents: "none",
              }}>
                <Img
                  src={staticFile(spriteFrame(NUMIDE_RUN_BASE, numideAnimFrame))}
                  width={NUMIDE_W}
                  height={NUMIDE_H}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div style={{
                position: "absolute",
                left: numide2X,
                top: 1400 - NUMIDE_H,
                opacity: numidesOpacity * 0.85,
                pointerEvents: "none",
              }}>
                <Img
                  src={staticFile(spriteFrame(NUMIDE_RUN_BASE, (numideAnimFrame + 2) % 6))}
                  width={NUMIDE_W}
                  height={NUMIDE_H}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </>
          )}

          {/* UI Phase C */}
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            {/* Label VOLQUES */}
            <div style={{
              position: "absolute",
              top: 380,
              right: 60,
              opacity: volquesLabelOpacity,
              backgroundColor: "rgba(8,8,16,0.85)",
              border: `1px solid ${HANNIBAL_PALETTE.METAL_FROID}`,
              borderRadius: 3,
              padding: "5px 12px",
            }}>
              <span style={{
                fontFamily: HANNIBAL_FONTS.TITRE,
                fontSize: 22,
                color: HANNIBAL_PALETTE.METAL_FROID,
                letterSpacing: HANNIBAL_LETTERSPACING.LABEL,
              }}>
                VOLQUES
              </span>
            </div>

            {/* Cartouche "Première victoire." */}
            <div style={{
              position: "absolute",
              bottom: 300,
              left: 60,
              right: 60,
              opacity: victoireOpacity,
              backgroundColor: HANNIBAL_PALETTE.CARTOUCHE_FOND,
              border: `1px solid ${HANNIBAL_PALETTE.CARTOUCHE_BORD}`,
              borderRadius: 4,
              padding: "16px 24px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: HANNIBAL_FONTS.TITRE,
                fontSize: HANNIBAL_TYPO.CARTOUCHE,
                color: HANNIBAL_PALETTE.IVOIRE,
                letterSpacing: HANNIBAL_LETTERSPACING.CARTOUCHE,
                fontStyle: "italic",
              }}>
                Première victoire.
              </div>
              <div style={{
                fontFamily: HANNIBAL_FONTS.SERIF,
                fontSize: HANNIBAL_TYPO.FOOTNOTE,
                color: HANNIBAL_PALETTE.METAL_FROID,
                letterSpacing: HANNIBAL_LETTERSPACING.LABEL,
                marginTop: 5,
              }}>
                Fleuve du Rhône · 218 av. J.-C.
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const BEAT2_FRAMES = DURATIONS.beat2;

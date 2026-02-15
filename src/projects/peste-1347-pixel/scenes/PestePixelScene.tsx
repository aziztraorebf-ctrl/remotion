import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate,
  spring,
} from "remotion";
import { PixelBackground } from "../components/PixelBackground";
import { CRTOverlay } from "../components/CRTOverlay";
import { TerminalTicker } from "../components/TerminalTicker";
import { TerminalEuropeMap } from "../components/TerminalEuropeMap";
import { PixelTypewriter } from "../components/PixelTypewriter";
import { FONTS, COLORS } from "../config/theme";
import {
  HOOK_END,
  SEG1_START,
  SEG1_END,
  SEG2_START,
  SEG2_END,
  CROSSFADE_FRAMES,
  CUE_1347,
  CUE_MOITIE,
  CUE_HUMAINS,
  CUE_SCRIPT,
  CUE_DIX_MILLE,
  CUE_FRERES_CROIX,
  CUE_STACCATO,
  CUE_LOGIQUE,
  CUE_SPOILER,
  CUE_EMPIRE,
  CUE_PEUR,
  CUE_BLAMER,
  CUE_RUMEUR,
  CUE_STRASBOURG,
  CUE_SAINT_VALENTIN,
  CUE_BRULE,
  CUE_MAYENCE,
  CUE_POGROMS,
  CUE_EFFACEES,
  CUE_TORDU,
  CUE_FAUX,
  CUE_DETTES,
} from "../config/timing";

export const PestePixelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Segment opacities (crossfade transitions) ----
  const hookOpacity = interpolate(
    frame,
    [HOOK_END - CROSSFADE_FRAMES, HOOK_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const seg1Opacity = interpolate(
    frame,
    [
      SEG1_START - CROSSFADE_FRAMES,
      SEG1_START + CROSSFADE_FRAMES,
      SEG1_END - CROSSFADE_FRAMES,
      SEG1_END,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const seg2Opacity = interpolate(
    frame,
    [SEG2_START - CROSSFADE_FRAMES, SEG2_START + CROSSFADE_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---- Spring helpers ----
  const springAt = (cueFrame: number) =>
    frame >= cueFrame
      ? spring({
          frame: frame - cueFrame,
          fps,
          config: { mass: 0.6, damping: 10, stiffness: 150 },
        })
      : 0;

  const fadeIn = (startFrame: number, dur = 20) =>
    interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <PixelBackground>
      {/* ============ AUDIO LAYER ============ */}
      <Audio
        src={staticFile("audio/peste-pixel/voiceover-v2-2min.mp3")}
        volume={1}
      />
      <Audio
        src={staticFile("audio/peste-pixel/music.mp3")}
        volume={0.15}
        loop
      />

      {/* ============ HOOK: "1347..." (0-510) ============ */}
      {frame < HOOK_END + CROSSFADE_FRAMES && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: hookOpacity,
          }}
        >
          {/* SVG Europe Map with real coastlines - slow draw */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TerminalEuropeMap
              startFrame={5}
              drawDuration={300}
              width={1600}
              height={850}
            />
          </div>

          {/* "1347" - big center stamp */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${springAt(CUE_1347 + 5)})`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.title,
                fontSize: 120,
                color: COLORS.plagueRed,
                textShadow: `0 0 40px ${COLORS.plagueRed}60, 0 0 80px ${COLORS.plagueRed}30`,
                letterSpacing: 8,
              }}
            >
              1347
            </div>
          </div>

          {/* "La MOITIE de l'Europe va mourir" */}
          <div
            style={{
              position: "absolute",
              bottom: 180,
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 20,
              opacity: fadeIn(CUE_MOITIE),
            }}
          >
            <PixelTypewriter
              text="La MOITIE de l'Europe va mourir."
              startFrame={CUE_MOITIE}
              charsPerFrame={0.8}
              font="body"
              fontSize={36}
              variant="narrative"
            />
          </div>

          {/* "ce que les HUMAINS ont fait" */}
          <div
            style={{
              position: "absolute",
              bottom: 120,
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 20,
              opacity: fadeIn(CUE_HUMAINS),
            }}
          >
            <PixelTypewriter
              text="Ce que les HUMAINS ont fait..."
              startFrame={CUE_HUMAINS}
              charsPerFrame={0.6}
              font="body"
              fontSize={28}
              color={COLORS.terminalGreenDim}
              variant="terminal"
            />
          </div>

          {/* "les reflexes humains suivent un eternel script" */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 60,
              zIndex: 20,
              opacity: fadeIn(CUE_SCRIPT),
            }}
          >
            <PixelTypewriter
              text="ETERNEL SCRIPT"
              startFrame={CUE_SCRIPT}
              charsPerFrame={0.4}
              font="title"
              fontSize={24}
              variant="terminal"
            />
          </div>
        </div>
      )}

      {/* ============ SEGMENT 1: Les Flagellants (510-1440) ============ */}
      {frame >= SEG1_START - CROSSFADE_FRAMES &&
        frame < SEG1_END + CROSSFADE_FRAMES && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: seg1Opacity,
            }}
          >
            {/* Section title - larger for better screen fill */}
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 60,
                zIndex: 20,
              }}
            >
              <PixelTypewriter
                text="LES FLAGELLANTS"
                startFrame={SEG1_START + 5}
                charsPerFrame={0.6}
                font="title"
                fontSize={36}
                variant="terminal"
              />
              {/* Segment descriptor */}
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 20,
                  color: COLORS.terminalGreenDim,
                  marginTop: 8,
                  opacity: fadeIn(SEG1_START + 20),
                }}
              >
                /// SEGMENT 1 : ANALYSE COMPORTEMENTALE ///
              </div>
            </div>

            {/* "DIX MILLE personnes" - big stat */}
            {springAt(CUE_DIX_MILLE) > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: `translate(-50%, -50%) scale(${springAt(CUE_DIX_MILLE)})`,
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.title,
                    fontSize: 90,
                    color: COLORS.plagueRed,
                    textShadow: `0 0 30px ${COLORS.plagueRed}50`,
                    textAlign: "center",
                  }}
                >
                  10 000
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 24,
                    color: COLORS.terminalGreenDim,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  PERSONNES PAR PROCESSION
                </div>
              </div>
            )}

            {/* "Freres de la Croix" - subtitle */}
            <div
              style={{
                position: "absolute",
                top: 100,
                right: 60,
                zIndex: 20,
                opacity: fadeIn(CUE_FRERES_CROIX),
              }}
            >
              <PixelTypewriter
                text="LES FRERES DE LA CROIX"
                startFrame={CUE_FRERES_CROIX}
                charsPerFrame={0.5}
                font="body"
                fontSize={22}
                color={COLORS.terminalGreenDim}
                variant="terminal"
              />
            </div>

            {/* Staccato section: "Trois seances. A genoux. En croix." */}
            {frame >= CUE_STACCATO && (
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  textAlign: "center",
                }}
              >
                {/* Each phrase appears with its own spring - 1.5x spacing for readability */}
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 34,
                    color: COLORS.textPrimary,
                    opacity: springAt(CUE_STACCATO),
                    transform: `scale(${springAt(CUE_STACCATO)})`,
                    marginBottom: 24,
                  }}
                >
                  TROIS SEANCES PAR JOUR.
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 34,
                    color: COLORS.textPrimary,
                    opacity: springAt(CUE_STACCATO + 18),
                    transform: `scale(${springAt(CUE_STACCATO + 18)})`,
                    marginBottom: 24,
                  }}
                >
                  A GENOUX.
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 34,
                    color: COLORS.textPrimary,
                    opacity: springAt(CUE_STACCATO + 36),
                    transform: `scale(${springAt(CUE_STACCATO + 36)})`,
                    marginBottom: 24,
                  }}
                >
                  EN CROIX.
                </div>
                {/* "Avec des fouets garnis de pointes de fer" */}
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 24,
                    color: COLORS.plagueRed,
                    opacity: springAt(CUE_STACCATO + 60),
                    transform: `scale(${springAt(CUE_STACCATO + 60)})`,
                    marginTop: 20,
                  }}
                >
                  FOUETS GARNIS DE POINTES DE FER
                </div>
              </div>
            )}

            {/* "Leur logique ?" */}
            {frame >= CUE_LOGIQUE && frame < CUE_SPOILER && (
              <div
                style={{
                  position: "absolute",
                  bottom: 120,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <PixelTypewriter
                  text="Souffrir PLUS pour que Dieu arrete..."
                  startFrame={CUE_LOGIQUE}
                  charsPerFrame={0.6}
                  font="body"
                  fontSize={28}
                  variant="narrative"
                />
              </div>
            )}

            {/* "SPOILER" stamp */}
            {springAt(CUE_SPOILER) > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: `translate(-50%, -50%) scale(${springAt(CUE_SPOILER)}) rotate(-5deg)`,
                  zIndex: 30,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.title,
                    fontSize: 64,
                    color: COLORS.terminalGreen,
                    border: `3px solid ${COLORS.terminalGreen}`,
                    padding: "8px 32px",
                    textShadow: `0 0 20px ${COLORS.terminalGreen}60`,
                    boxShadow: `0 0 30px ${COLORS.terminalGreen}30`,
                  }}
                >
                  SPOILER
                </div>
              </div>
            )}

            {/* "Ca a meme EMPIRE !" - red flash */}
            {springAt(CUE_EMPIRE) > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 25,
                  opacity: springAt(CUE_EMPIRE),
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.title,
                    fontSize: 48,
                    color: COLORS.plagueRed,
                    textShadow: `0 0 30px ${COLORS.plagueRed}60`,
                  }}
                >
                  CA A MEME EMPIRE.
                </div>
              </div>
            )}
          </div>
        )}

      {/* ============ SEGMENT 2: Les Boucs Emissaires (1440-2760) ============ */}
      {frame >= SEG2_START - CROSSFADE_FRAMES && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: seg2Opacity,
          }}
        >
          {/* Section title - larger for better screen fill */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 60,
              zIndex: 20,
            }}
          >
            <PixelTypewriter
              text="BOUCS EMISSAIRES"
              startFrame={SEG2_START + 5}
              charsPerFrame={0.6}
              font="title"
              fontSize={36}
              variant="terminal"
            />
            {/* Segment descriptor */}
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 20,
                color: COLORS.terminalGreenDim,
                marginTop: 8,
                opacity: fadeIn(SEG2_START + 20),
              }}
            >
              /// SEGMENT 2 : SCAN PERSECUTION ///
            </div>
          </div>

          {/* "Quand les humains ont peur..." */}
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 60,
              right: 60,
              zIndex: 20,
              opacity: fadeIn(CUE_PEUR),
            }}
          >
            <PixelTypewriter
              text="Quand les humains ont peur..."
              startFrame={CUE_PEUR}
              charsPerFrame={0.5}
              font="body"
              fontSize={28}
              variant="narrative"
            />
          </div>

          {/* "ils cherchent quelqu'un a blamer" */}
          <div
            style={{
              position: "absolute",
              top: 180,
              left: 60,
              right: 60,
              zIndex: 20,
              opacity: fadeIn(CUE_BLAMER),
            }}
          >
            <PixelTypewriter
              text="...ils cherchent quelqu'un a blamer."
              startFrame={CUE_BLAMER}
              charsPerFrame={0.6}
              font="body"
              fontSize={28}
              color={COLORS.plagueRed}
              variant="narrative"
            />
          </div>

          {/* "1349" year stamp */}
          {springAt(CUE_RUMEUR) > 0 && (
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${springAt(CUE_RUMEUR)})`,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 100,
                  color: COLORS.plagueRed,
                  textShadow: `0 0 40px ${COLORS.plagueRed}50`,
                  letterSpacing: 6,
                }}
              >
                1349
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 20,
                  color: COLORS.terminalGreenDim,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                LA RUMEUR SE REPAND
              </div>
            </div>
          )}

          {/* Strasbourg event */}
          {frame >= CUE_STRASBOURG && (
            <div
              style={{
                position: "absolute",
                left: 80,
                top: "55%",
                zIndex: 20,
              }}
            >
              {/* Date */}
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 20,
                  color: COLORS.terminalGreenDim,
                  opacity: springAt(CUE_STRASBOURG),
                  marginBottom: 8,
                }}
              >
                STRASBOURG - 14 FEVRIER 1349
              </div>
              {/* Victim count */}
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 60,
                  color: COLORS.plagueRed,
                  opacity: springAt(CUE_BRULE),
                  transform: `scale(${springAt(CUE_BRULE)})`,
                  transformOrigin: "left center",
                  textShadow: `0 0 20px ${COLORS.plagueRed}40`,
                }}
              >
                2 000 BRULES
              </div>
              {/* Saint-Valentin note */}
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 18,
                  color: COLORS.terminalGreenDim,
                  opacity: springAt(CUE_SAINT_VALENTIN),
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                Jour de la Saint-Valentin.
              </div>
            </div>
          )}

          {/* Mayence event */}
          {frame >= CUE_MAYENCE && (
            <div
              style={{
                position: "absolute",
                right: 80,
                top: "55%",
                textAlign: "right",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 20,
                  color: COLORS.terminalGreenDim,
                  opacity: springAt(CUE_MAYENCE),
                  marginBottom: 8,
                }}
              >
                MAYENCE
              </div>
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 60,
                  color: COLORS.plagueRed,
                  opacity: springAt(CUE_MAYENCE + 15),
                  transform: `scale(${springAt(CUE_MAYENCE + 15)})`,
                  transformOrigin: "right center",
                  textShadow: `0 0 20px ${COLORS.plagueRed}40`,
                }}
              >
                6 000 EN UN JOUR
              </div>
            </div>
          )}

          {/* Pogroms counter */}
          {springAt(CUE_POGROMS) > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 160,
                left: "50%",
                transform: `translateX(-50%) scale(${springAt(CUE_POGROMS)})`,
                zIndex: 20,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 72,
                  color: COLORS.plagueRed,
                  textShadow: `0 0 30px ${COLORS.plagueRed}50`,
                }}
              >
                300+
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 22,
                  color: COLORS.textPrimary,
                  marginTop: 4,
                }}
              >
                POGROMS
              </div>
            </div>
          )}

          {/* "Des communautes entieres... effacees" */}
          {frame >= CUE_EFFACEES && (
            <div
              style={{
                position: "absolute",
                bottom: 100,
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 20,
                opacity: springAt(CUE_EFFACEES),
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 28,
                  color: COLORS.textPrimary,
                  textShadow: "0 0 10px rgba(255,255,255,0.2)",
                }}
              >
                Des communautes entieres... effacees.
              </div>
            </div>
          )}

          {/* "Le plus tordu ?" block */}
          {frame >= CUE_TORDU && (
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: `translate(-50%, -50%)`,
                zIndex: 25,
                textAlign: "center",
                // Fade out previous elements by stacking
                opacity: springAt(CUE_TORDU),
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 64,
                  color: COLORS.terminalGreen,
                  textShadow: `0 0 30px ${COLORS.terminalGreen}60`,
                  border: `3px solid ${COLORS.terminalGreen}`,
                  padding: "12px 40px",
                  boxShadow: `0 0 40px ${COLORS.terminalGreen}25`,
                  marginBottom: 32,
                  display: "inline-block",
                  transform: `rotate(-2deg)`,
                }}
              >
                LE PLUS TORDU ?
              </div>

              {/* "Les elites savaient que c'etait faux" */}
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 26,
                  color: COLORS.textPrimary,
                  opacity: springAt(CUE_FAUX),
                  marginBottom: 16,
                  maxWidth: 800,
                }}
              >
                Les elites locales savaient que c'etait faux.
              </div>

              {/* "les dettes ont disparu avec les victimes" */}
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 30,
                  color: COLORS.plagueRed,
                  opacity: springAt(CUE_DETTES),
                  textShadow: `0 0 15px ${COLORS.plagueRed}30`,
                }}
              >
                Les dettes ont disparu avec les victimes.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ PERMANENT LAYERS ============ */}

      {/* Terminal ticker - always visible */}
      <TerminalTicker />

      {/* CRT overlay on top of everything */}
      <CRTOverlay />
    </PixelBackground>
  );
};

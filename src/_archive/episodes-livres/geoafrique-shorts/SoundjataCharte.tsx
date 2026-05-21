import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  staticFile,
} from "remotion";

// ============================================================
// Soundjata — Acte VI : Empire du Mali + Charte du Manden
// Duree : 20.5s (615 frames @ 30fps)
// Format : 1080x1920 (vertical Short)
//
// Structure (frames relatives au debut de l'acte):
//   0      - 146  : empireFonde   (4.86s) - reserve pour carte Mali (HistoricalMap)
//   146    - 208  : extraordinaire (2.06s)
//   208    - 313  : charte        (3.50s)
//   313    - 337  : quaranteQuatre (0.80s)
//   337    - 441  : droitsArticles (3.48s)
//   441    - 542  : huitCents     (3.38s)
//
// Assets :
//   parchment-bg.png          - fond unique pour tout l'acte
//   icon-01-life.png          - droit a la vie
//   icon-02-protection.png    - protection des femmes
//   icon-03-dignity.png       - dignite des captifs
//   medallion-mali.png        - Mali 1236
//   medallion-west.png        - Occident 1948
// ============================================================

const FPS = 30;
const W = 1080;
const H = 1920;

// -- Palette GeoAfrique --
const PAL = {
  gold: "#D4AF37",
  amber: "#C8820A",
  cream: "#F5E6C8",
  inkDark: "#3A2E1F",
  inkWarm: "#6B4423",
  parchmentTint: "rgba(58, 46, 31, 0.9)",
} as const;

// Font family — serif-calligraphic feel via system fonts (no external load needed)
const TITLE_FONT =
  '"Cormorant Garamond", "Palatino", "Book Antiqua", Georgia, serif';
const BODY_FONT =
  '"Cormorant Garamond", "Palatino", "Book Antiqua", Georgia, serif';

const ASSET = (name: string) =>
  staticFile(`assets/library/geoafrique/heros-oublies/soundjata/charte/${name}`);

// Sub-scene boundaries (relative to Acte VI start = 87.70s in full narration)
// Boundaries are on NARRATION BOUNDARIES (start of each segment), so gaps between
// are absorbed by the PREVIOUS sub-scene. This keeps the visual continuous.
//
// Narration absolute seconds:
//   empireFonde    : 87.70 -> 92.82  (next start)
//   extraordinaire : 92.82 -> 95.34
//   charte         : 95.34 -> 99.52
//   quaranteQuatre : 99.52 -> 100.88
//   droitsArticles : 100.88 -> 104.88
//   huitCents      : 104.88 -> 108.26
// Total duration : 108.26 - 87.70 = 20.56s = 617 frames
export const SUB_SCENES = {
  empireFonde: { start: 0, end: Math.round((92.82 - 87.70) * 30) }, // 0-154
  extraordinaire: {
    start: Math.round((92.82 - 87.70) * 30),
    end: Math.round((95.34 - 87.70) * 30),
  }, // 154-229
  charte: {
    start: Math.round((95.34 - 87.70) * 30),
    end: Math.round((99.52 - 87.70) * 30),
  }, // 229-355
  quaranteQuatre: {
    start: Math.round((99.52 - 87.70) * 30),
    end: Math.round((100.88 - 87.70) * 30),
  }, // 355-395
  droitsArticles: {
    start: Math.round((100.88 - 87.70) * 30),
    end: Math.round((104.88 - 87.70) * 30),
  }, // 395-515
  huitCents: {
    start: Math.round((104.88 - 87.70) * 30),
    end: Math.round((108.26 - 87.70) * 30),
  }, // 515-617
} as const;

// Acte VI s'etend de 87.70s a 108.26s dans la narration complete
// Duree : 20.56s = 617 frames (aligne sur fin de huitCents)
export const SOUNDJATA_CHARTE_FRAMES = 617;

// Offset dans narration-full.mp3 ou commence l'acte VI
export const SOUNDJATA_CHARTE_AUDIO_OFFSET_S = 87.70;

// ============================================================
// ParchmentBackground — always visible, slight subtle ambient drift
// ============================================================

const ParchmentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // Very subtle zoom/drift so the background feels alive
  const scale = interpolate(frame, [0, 615], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img
        src={ASSET("parchment-bg.png")}
        style={{
          width: W,
          height: H,
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// EmpireFonde — placeholder for HistoricalMap integration
// (4.86s - HistoricalMap component can be composed here later)
// ============================================================

const EmpireFonde: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Map fades in at start
  const mapOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  // Very slow zoom on the map (Ken Burns effect, subtle)
  const mapScale = interpolate(frame, [0, 146], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Title appears after map reveal
  const titleOpacity = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  const subtitleOpacity = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#2C1810" }}>
      {/* Mali empire map — full screen, its own visual layer */}
      <AbsoluteFill
        style={{
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
        }}
      >
        <Img
          src={ASSET("mali-empire-map.png")}
          style={{
            width: W,
            height: H,
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Title + subtitle at bottom, clean translucent band */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 180,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 92,
            fontFamily: TITLE_FONT,
            fontWeight: 700,
            color: PAL.cream,
            textAlign: "center",
            letterSpacing: 5,
            textShadow: "0 3px 12px rgba(0, 0, 0, 0.75)",
            lineHeight: 1.1,
          }}
        >
          EMPIRE DU MALI
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            marginTop: 24,
            fontSize: 44,
            fontFamily: BODY_FONT,
            fontStyle: "italic",
            color: PAL.cream,
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
          }}
        >
          Le plus vaste d'Afrique de l'Ouest
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// Extraordinaire — transition card
// ============================================================

const Extraordinaire: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          opacity,
          fontSize: 78,
          fontFamily: BODY_FONT,
          fontStyle: "italic",
          color: PAL.inkDark,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Et il fait quelque chose
        <br />
        <span style={{ fontWeight: 700, color: PAL.amber }}>
          d'extraordinaire.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Charte — "CHARTE DU MANDEN" grand titre calligraphique
// ============================================================

const Charte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Draw-on effect via clip-path for title
  const titleReveal = interpolate(frame, [5, 50], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.6, 0.2, 1),
  });

  const subOpacity = spring({
    frame: frame - 40,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const dateOpacity = spring({
    frame: frame - 65,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      {/* Date "1236" small, above */}
      <div
        style={{
          opacity: dateOpacity,
          fontSize: 44,
          fontFamily: BODY_FONT,
          color: PAL.inkWarm,
          letterSpacing: 6,
          marginBottom: 30,
        }}
      >
        — 1236 —
      </div>

      {/* Main title with reveal */}
      <div
        style={{
          clipPath: `inset(0 ${100 - titleReveal}% 0 0)`,
          fontSize: 110,
          fontFamily: TITLE_FONT,
          fontWeight: 700,
          color: PAL.inkDark,
          textAlign: "center",
          letterSpacing: 3,
          lineHeight: 1,
        }}
      >
        CHARTE
        <br />
        DU MANDEN
      </div>

      {/* Decorative horizontal line */}
      <div
        style={{
          opacity: subOpacity,
          marginTop: 40,
          width: 400,
          height: 3,
          background: `linear-gradient(90deg, transparent 0%, ${PAL.amber} 50%, transparent 100%)`,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          marginTop: 30,
          fontSize: 44,
          fontFamily: BODY_FONT,
          fontStyle: "italic",
          color: PAL.inkWarm,
          textAlign: "center",
        }}
      >
        Proclamee par Soundjata
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// QuaranteQuatre — "44" chiffre geant
// ============================================================

const QuaranteQuatre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp-in animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
    durationInFrames: 15,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          fontSize: 280,
          fontFamily: TITLE_FONT,
          fontWeight: 700,
          color: PAL.gold,
          textShadow: `
            0 4px 0 ${PAL.amber},
            0 8px 20px rgba(58, 46, 31, 0.25)
          `,
          lineHeight: 1,
        }}
      >
        44
      </div>
      <div
        style={{
          marginTop: -20,
          fontSize: 48,
          fontFamily: BODY_FONT,
          fontStyle: "italic",
          color: PAL.inkDark,
          letterSpacing: 8,
        }}
      >
        ARTICLES
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// DroitsArticles — 3 icones qui apparaissent en sequence
// ============================================================

const IconRow: React.FC<{
  iconSrc: string;
  label: string;
  delayFrames: number;
}> = ({ iconSrc, label, delayFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delayFrames;

  const opacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const translateY = interpolate(
    spring({
      frame: localFrame,
      fps,
      config: { damping: 15, stiffness: 180 },
      durationInFrames: 25,
    }),
    [0, 1],
    [30, 0]
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 40,
        marginBottom: 50,
      }}
    >
      <Img
        src={iconSrc}
        style={{ width: 260, height: 260, objectFit: "contain" }}
      />
      <div
        style={{
          fontSize: 58,
          fontFamily: BODY_FONT,
          color: PAL.inkDark,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const DroitsArticles: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 120px",
      }}
    >
      <IconRow
        iconSrc={ASSET("icon-01-life.png")}
        label="Droit a la vie"
        delayFrames={0}
      />
      <IconRow
        iconSrc={ASSET("icon-02-protection.png")}
        label="Protection des femmes"
        delayFrames={30}
      />
      <IconRow
        iconSrc={ASSET("icon-03-dignity.png")}
        label="Dignite des captifs"
        delayFrames={60}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// HuitCents — deux medallions + comparaison temporelle
// ============================================================

const HuitCents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mali medallion: appears left side first
  const maliOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  // Connecting line draws
  const lineReveal = interpolate(frame, [30, 55], [0, 100], {
    extrapolateRight: "clamp",
  });

  // West medallion: appears after
  const westOpacity = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  // Text "800 ans" appears last, bold
  const textOpacity = spring({
    frame: frame - 70,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  const textScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Upper: "800 ANS D'AVANCE" */}
      <div
        style={{
          opacity: textOpacity,
          transform: `scale(${interpolate(textScale, [0, 1], [0.7, 1])})`,
          fontSize: 130,
          fontFamily: TITLE_FONT,
          fontWeight: 700,
          color: PAL.amber,
          textShadow: `0 3px 0 ${PAL.inkWarm}`,
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        800 ANS
      </div>
      <div
        style={{
          opacity: textOpacity,
          fontSize: 40,
          fontFamily: BODY_FONT,
          fontStyle: "italic",
          color: PAL.inkDark,
          letterSpacing: 4,
          marginBottom: 60,
        }}
      >
        AVANT LA DECLARATION UNIVERSELLE
      </div>

      {/* Medallions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Mali medallion */}
        <div
          style={{
            opacity: maliOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Img
            src={ASSET("medallion-mali.png")}
            style={{ width: 440, height: 440, objectFit: "contain" }}
          />
          <div
            style={{
              marginTop: 20,
              fontSize: 42,
              fontFamily: TITLE_FONT,
              fontWeight: 700,
              color: PAL.gold,
              letterSpacing: 4,
            }}
          >
            1236
          </div>
          <div
            style={{
              fontSize: 28,
              fontFamily: BODY_FONT,
              fontStyle: "italic",
              color: PAL.inkWarm,
              marginTop: 4,
            }}
          >
            Mali
          </div>
        </div>

        {/* Connecting line */}
        <div
          style={{
            width: 60,
            height: 3,
            marginTop: -120,
            background: `linear-gradient(90deg, ${PAL.amber} 0%, ${PAL.inkWarm} 100%)`,
            clipPath: `inset(0 ${100 - lineReveal}% 0 0)`,
          }}
        />

        {/* West medallion */}
        <div
          style={{
            opacity: westOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Img
            src={ASSET("medallion-west.png")}
            style={{ width: 440, height: 440, objectFit: "contain" }}
          />
          <div
            style={{
              marginTop: 20,
              fontSize: 42,
              fontFamily: TITLE_FONT,
              fontWeight: 700,
              color: PAL.inkWarm,
              letterSpacing: 4,
            }}
          >
            1948
          </div>
          <div
            style={{
              fontSize: 28,
              fontFamily: BODY_FONT,
              fontStyle: "italic",
              color: PAL.inkWarm,
              marginTop: 4,
            }}
          >
            ONU
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// MAIN — SoundjataCharte (acte VI complet)
// ============================================================

export const SoundjataCharte: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Narration audio for acte VI (extracted from narration-full.mp3) */}
      <Audio src={ASSET("narration-acte-vi.mp3")} />

      {/* Parchment background only AFTER the empire map scene */}
      <Sequence
        from={SUB_SCENES.extraordinaire.start}
        durationInFrames={SOUNDJATA_CHARTE_FRAMES - SUB_SCENES.extraordinaire.start}
      >
        <ParchmentBackground />
      </Sequence>

      <Sequence
        from={SUB_SCENES.empireFonde.start}
        durationInFrames={
          SUB_SCENES.empireFonde.end - SUB_SCENES.empireFonde.start
        }
      >
        <EmpireFonde />
      </Sequence>

      <Sequence
        from={SUB_SCENES.extraordinaire.start}
        durationInFrames={
          SUB_SCENES.extraordinaire.end - SUB_SCENES.extraordinaire.start
        }
      >
        <Extraordinaire />
      </Sequence>

      <Sequence
        from={SUB_SCENES.charte.start}
        durationInFrames={SUB_SCENES.charte.end - SUB_SCENES.charte.start}
      >
        <Charte />
      </Sequence>

      <Sequence
        from={SUB_SCENES.quaranteQuatre.start}
        durationInFrames={
          SUB_SCENES.quaranteQuatre.end - SUB_SCENES.quaranteQuatre.start
        }
      >
        <QuaranteQuatre />
      </Sequence>

      <Sequence
        from={SUB_SCENES.droitsArticles.start}
        durationInFrames={
          SUB_SCENES.droitsArticles.end - SUB_SCENES.droitsArticles.start
        }
      >
        <DroitsArticles />
      </Sequence>

      <Sequence
        from={SUB_SCENES.huitCents.start}
        durationInFrames={
          SUB_SCENES.huitCents.end - SUB_SCENES.huitCents.start
        }
      >
        <HuitCents />
      </Sequence>
    </AbsoluteFill>
  );
};

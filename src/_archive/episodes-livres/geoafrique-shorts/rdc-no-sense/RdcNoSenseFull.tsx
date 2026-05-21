/**
 * RDC No Sense — composition complete (8 beats inline)
 * 5400 frames @30fps = 180s
 * Audio : final-mix.mp3 (narration + musique deja mixees)
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { MapboxSatelliteBeat, type Keyframe } from "../../_shared/mapbox/MapboxSatelliteBeat";
import { FlagPin } from "../../_shared/components/inserts/FlagPin";
import { CountryFlagFill } from "../../_shared/components/inserts/CountryFlagFill";
import { CountryStackComparison } from "../../_shared/components/inserts/CountryStackComparison";
import { useTopology } from "../../_shared/components/inserts/useTopology";
import {
  AUDIO_SEGMENTS,
  BEAT_RANGES,
  TOTAL_FRAMES,
  FINAL_FADE_FRAMES,
} from "./timing";
import { PALETTE, RDC, RDC_NEIGHBORS, CAMS, FINAL_MIX_PATH } from "./constants";

// ============================================================================
// Helpers UI
// ============================================================================

const StickerCard: React.FC<{
  children: React.ReactNode;
  position?: React.CSSProperties;
  entryAt?: number;
  scale?: number;
}> = ({ children, position, entryAt = 0, scale: scaleOverride }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - entryAt;
  if (rel < 0) return null;
  const s = scaleOverride ?? spring({ fps, frame: rel, config: { damping: 14, stiffness: 100, mass: 0.7 } });
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) scale(${s})`,
        ...position,
      }}
    >
      {children}
    </div>
  );
};

const BigNumber: React.FC<{
  value: string;
  unit?: string;
  color?: string;
  size?: number;
}> = ({ value, unit, color = PALETTE.gold, size = 180 }) => (
  <div style={{ textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>
    <div
      style={{
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontSize: size,
        fontWeight: 900,
        color,
        letterSpacing: -2,
        lineHeight: 0.95,
        WebkitTextStroke: "2px rgba(0,0,0,0.4)",
      }}
    >
      {value}
    </div>
    {unit && (
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: size * 0.22,
          color: "white",
          letterSpacing: 8,
          marginTop: 4,
        }}
      >
        {unit}
      </div>
    )}
  </div>
);

const Caption: React.FC<{
  text: string;
  position?: React.CSSProperties;
  color?: string;
  size?: number;
  entryAt?: number;
  width?: number | string;
}> = ({ text, position, color = "white", size = 56, entryAt = 0, width }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryAt, entryAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontSize: size,
        color,
        letterSpacing: 4,
        textAlign: "center",
        textShadow: "0 4px 18px rgba(0,0,0,0.9)",
        opacity,
        width,
        lineHeight: 1.05,
        ...position,
      }}
    >
      {text}
    </div>
  );
};

const useCountUp = (start: number, end: number, durationFrames: number, beginFrame = 0) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [beginFrame, beginFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // ease out cubic
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(start + (end - start) * eased);
};

// ============================================================================
// BEAT 1 — HOOK (0-422)
// ============================================================================

const Beat1Hook: React.FC = () => {
  const range = BEAT_RANGES.BEAT1;
  const duration = range.end - range.start;

  const keyframes: Keyframe[] = [
    { frame: 0, ...CAMS.space },
    { frame: 90, ...CAMS.africa },
    { frame: duration, ...CAMS.rdcWide },
  ];

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.0}
      borderWidth={4}
      keyframes={keyframes}
    >
      <FlagPin
        flag="cd"
        entryAt={120}
        size={140}
        position={{ left: "55%", top: "32%" }}
        glowColor={PALETTE.gold}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 2a — TAILLE (423-789) — chiffre 2 345 000 km2
// ============================================================================

const Beat2aTaille: React.FC = () => {
  const range = BEAT_RANGES.BEAT2a;
  const duration = range.end - range.start;
  const count = useCountUp(0, 2345000, 120, 30);

  const keyframes: Keyframe[] = [
    { frame: 0, ...CAMS.rdcWide },
    { frame: duration, ...CAMS.rdcWide, zoom: CAMS.rdcWide.zoom + 0.1 },
  ];

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.18}
      borderWidth={5}
      keyframes={keyframes}
    >
      <StickerCard position={{ left: "50%", top: "82%" }} entryAt={20}>
        <BigNumber
          value={count.toLocaleString("fr-FR")}
          unit="KM CARRES"
          size={200}
        />
      </StickerCard>
      <Caption
        text="2e PLUS GRAND PAYS D'AFRIQUE"
        position={{ left: "50%", top: "12%" }}
        size={48}
        color={PALETTE.gold}
        entryAt={60}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 2b — FRANCE x4 + EUROPE (790-1182)
// ============================================================================

const Beat2bFrance: React.FC = () => {
  const range = BEAT_RANGES.BEAT2b;
  const duration = range.end - range.start;
  const topo = useTopology("/_shared/geo-data/countries-50m.json");

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a1929 0%, #1a3a5c 100%)" }}>
      <Caption
        text="ON Y FAIT RENTRER..."
        position={{ left: "50%", top: "8%" }}
        size={56}
        color={PALETTE.gold}
        entryAt={0}
      />
      {topo && (
        <CountryStackComparison
          topology={topo as any}
          mainCountry="Dem. Rep. Congo"
          width={1920}
          height={900}
          mainColor={PALETTE.orange}
          stagger={32}
          entryAt={20}
          items={[
            { countryName: "France", color: "#0055a4", copies: 4, label: "FR x4" },
            { countryName: "Spain", color: "#c60b1e", copies: 1, label: "ESP", position: { dx: 60, dy: 120 } },
            { countryName: "Germany", color: "#ffce00", copies: 1, label: "DEU", position: { dx: -120, dy: 100 } },
            { countryName: "Poland", color: "#dc143c", copies: 1, label: "POL", position: { dx: 100, dy: -50 } },
            { countryName: "United Kingdom", color: "#012169", copies: 1, label: "UK", position: { dx: -80, dy: -100 } },
          ]}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// BEAT 3a — 9 VOISINS lignes (1183-1259, court)
// ============================================================================

const Beat3aFrontieres: React.FC = () => {
  const range = BEAT_RANGES.BEAT3a;

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.15}
      borderWidth={4}
      keyframes={[
        { frame: 0, ...CAMS.rdcWithNeighbors },
        { frame: range.end - range.start, ...CAMS.rdcWithNeighbors, zoom: CAMS.rdcWithNeighbors.zoom + 0.1 },
      ]}
      extraIsos={RDC_NEIGHBORS.map((n) => ({
        iso: n.iso3,
        color: "#ffffff",
        opacity: 0.08,
        border: 1.5,
      }))}
    >
      <Caption
        text="ELLE TOUCHE..."
        position={{ left: "50%", top: "10%" }}
        size={62}
        color={PALETTE.gold}
        entryAt={5}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 3b — 9 + drapeaux voisins (1260-1922)
// ============================================================================

const Beat3bNeuf: React.FC = () => {
  const range = BEAT_RANGES.BEAT3b;
  const duration = range.end - range.start;

  // Placement des 9 drapeaux en couronne autour de RDC
  // Position calculee approximativement en % de l'ecran
  const positions = [
    { left: "20%", top: "82%" }, // Angola SW
    { left: "62%", top: "82%" }, // Zambie SE
    { left: "85%", top: "60%" }, // Tanzanie E
    { left: "80%", top: "48%" }, // Burundi
    { left: "82%", top: "40%" }, // Rwanda
    { left: "78%", top: "28%" }, // Ouganda
    { left: "68%", top: "16%" }, // Soudan Sud N
    { left: "38%", top: "12%" }, // RCA NW
    { left: "12%", top: "55%" }, // Congo-Brazzaville W
  ];

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.22}
      borderWidth={5}
      keyframes={[
        { frame: 0, ...CAMS.rdcWithNeighbors },
        { frame: duration, ...CAMS.rdcWithNeighbors, zoom: CAMS.rdcWithNeighbors.zoom + 0.05 },
      ]}
    >
      {RDC_NEIGHBORS.map((n, idx) => (
        <FlagPin
          key={n.iso3}
          flag={n.iso2}
          entryAt={20 + idx * 18}
          size={96}
          position={positions[idx]}
          showRing={false}
        />
      ))}
      <StickerCard position={{ left: "50%", top: "16%" }} entryAt={0}>
        <BigNumber value="9" unit="VOISINS" size={240} color={PALETTE.gold} />
      </StickerCard>
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 3c — BERLIN 1885 (1923-2200)
// ============================================================================

const Beat3cBerlin: React.FC = () => {
  const range = BEAT_RANGES.BEAT3c;
  const duration = range.end - range.start;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineProgress = interpolate(frame, [60, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = spring({ fps, frame, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #d4c29d 0%, #8a7350 60%, #4a3a20 100%)",
      }}
    >
      {/* Texture papier kraft via gradient + noise */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(80,60,30,0.05) 0px, rgba(80,60,30,0.05) 2px, transparent 2px, transparent 4px)",
          opacity: 0.7,
        }}
      />
      <Caption
        text="CONFERENCE DE BERLIN — 1885"
        position={{ left: "50%", top: "12%" }}
        size={64}
        color="#3a2a10"
        entryAt={0}
      />
      <Caption
        text="Des frontieres tracees par des hommes qui n'avaient jamais mis les pieds en Afrique."
        position={{ left: "50%", top: "85%", width: 1400 }}
        size={36}
        color="#3a2a10"
        entryAt={120}
      />

      {/* Mini-map Africa schematic SVG */}
      <svg
        viewBox="0 0 800 600"
        width={800}
        height={600}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${fadeIn})`,
        }}
      >
        {/* Africa schematic shape */}
        <path
          d="M 380,80 Q 480,90 540,170 Q 600,260 590,360 Q 580,460 510,520 Q 430,560 360,540 Q 280,520 250,440 Q 210,360 230,260 Q 270,160 380,80 Z"
          fill="rgba(180,140,80,0.45)"
          stroke="#3a2a10"
          strokeWidth={3}
        />
        {/* RDC zone approximative */}
        <ellipse
          cx={420}
          cy={340}
          rx={70}
          ry={55}
          fill={PALETTE.orange}
          fillOpacity={0.55}
          stroke="#5a2a00"
          strokeWidth={3}
        />
        {/* Berlin pin top right */}
        <circle cx={650} cy={120} r={10} fill="#d32f2f" stroke="white" strokeWidth={2} />
        <text
          x={665}
          y={115}
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={28}
          fill="#3a2a10"
          letterSpacing={2}
        >
          BERLIN
        </text>
        {/* Line from Berlin to RDC */}
        <line
          x1={650}
          y1={120}
          x2={650 - (650 - 420) * lineProgress}
          y2={120 + (340 - 120) * lineProgress}
          stroke="#d32f2f"
          strokeWidth={3}
          strokeDasharray="6 6"
        />
        {/* Pencil at line tip */}
        {lineProgress < 1 && lineProgress > 0 && (
          <circle
            cx={650 - (650 - 420) * lineProgress}
            cy={120 + (340 - 120) * lineProgress}
            r={6}
            fill="#d32f2f"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// BEAT 4a — FLEUVE MONSTRE (2201-2417)
// ============================================================================

const Beat4aFleuve: React.FC = () => {
  const range = BEAT_RANGES.BEAT4a;
  const duration = range.end - range.start;

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.08}
      borderWidth={3}
      keyframes={[
        { frame: 0, ...CAMS.congoRiver },
        { frame: duration, ...CAMS.congoRiver, bearing: CAMS.congoRiver.bearing + 8, zoom: CAMS.congoRiver.zoom + 0.2 },
      ]}
    >
      <Caption
        text="FLEUVE CONGO"
        position={{ left: "50%", top: "14%" }}
        size={120}
        color={PALETTE.river}
        entryAt={20}
      />
      <Caption
        text="UN MONSTRE"
        position={{ left: "50%", top: "26%" }}
        size={54}
        color="white"
        entryAt={60}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 4b — DEBIT + EQUATEUR (2418-2973)
// ============================================================================

const Beat4bDebit: React.FC = () => {
  const range = BEAT_RANGES.BEAT4b;
  const duration = range.end - range.start;
  const km = useCountUp(0, 4370, 90, 0);

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.10}
      borderWidth={3}
      keyframes={[
        { frame: 0, ...CAMS.rdcWide },
        { frame: duration, ...CAMS.rdcWide, zoom: CAMS.rdcWide.zoom + 0.15 },
      ]}
    >
      {/* Ligne equateur dashed yellow */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        {/* Equateur approx au milieu (lat=0) */}
        <line
          x1={0}
          y1={540}
          x2={1920}
          y2={540}
          stroke={PALETTE.gold}
          strokeWidth={2}
          strokeDasharray="14 8"
          opacity={0.7}
        />
        <text
          x={60}
          y={530}
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={28}
          fill={PALETTE.gold}
          letterSpacing={6}
        >
          EQUATEUR
        </text>
      </svg>

      <StickerCard position={{ left: "30%", top: "30%" }} entryAt={20}>
        <BigNumber value={km.toLocaleString("fr-FR")} unit="KM DE LONG" size={140} color={PALETTE.river} />
      </StickerCard>

      <StickerCard position={{ left: "72%", top: "30%" }} entryAt={120}>
        <BigNumber value="2e" unit="DEBIT MONDIAL" size={140} color={PALETTE.gold} />
      </StickerCard>

      <Caption
        text="TRAVERSE L'EQUATEUR x 2"
        position={{ left: "50%", top: "82%" }}
        size={50}
        color="white"
        entryAt={240}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 5 — FORET (2974-3654)
// ============================================================================

const Beat5Foret: React.FC = () => {
  const range = BEAT_RANGES.BEAT5;
  const duration = range.end - range.start;
  const ha = useCountUp(0, 170, 90, 30);

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.forest}
      fillOpacity={0.45}
      borderWidth={5}
      keyframes={[
        { frame: 0, ...CAMS.rdcCloseForest },
        { frame: duration, ...CAMS.rdcCloseForest, zoom: CAMS.rdcCloseForest.zoom + 0.1, bearing: 8 },
      ]}
    >
      <Caption
        text="2e FORET TROPICALE DU MONDE"
        position={{ left: "50%", top: "10%" }}
        size={56}
        color={PALETTE.gold}
        entryAt={0}
      />
      <StickerCard position={{ left: "50%", top: "82%" }} entryAt={30}>
        <BigNumber
          value={`${ha} M`}
          unit="HECTARES DE JUNGLE"
          size={180}
          color={PALETTE.forest}
        />
      </StickerCard>
      <Caption
        text="LE SECOND POUMON DE LA PLANETE"
        position={{ left: "50%", top: "26%" }}
        size={48}
        color="white"
        entryAt={150}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 6 — DIVERSITE HUMAINE (3655-4393)
// ============================================================================

const Beat6Diversite: React.FC = () => {
  const range = BEAT_RANGES.BEAT6;
  const duration = range.end - range.start;
  const hab = useCountUp(0, 100, 60, 0);

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.18}
      borderWidth={4}
      keyframes={[
        { frame: 0, ...CAMS.rdcWide },
        { frame: duration, ...CAMS.rdcWide, zoom: CAMS.rdcWide.zoom + 0.2 },
      ]}
    >
      <StickerCard position={{ left: "30%", top: "20%" }} entryAt={0}>
        <BigNumber value={`${hab} M`} unit="HABITANTS" size={140} color={PALETTE.gold} />
      </StickerCard>

      <StickerCard position={{ left: "72%", top: "20%" }} entryAt={80}>
        <BigNumber value="200+" unit="LANGUES" size={140} color={PALETTE.gold} />
      </StickerCard>

      {/* Capitale + Lubumbashi pins */}
      <Caption
        text="KINSHASA <==> LUBUMBASHI"
        position={{ left: "50%", top: "82%" }}
        size={42}
        color="white"
        entryAt={range.end - range.start - 240}
      />
      <Caption
        text="2 000 km. Ils peuvent ne pas se comprendre."
        position={{ left: "50%", top: "87%" }}
        size={32}
        color={PALETTE.cream}
        entryAt={range.end - range.start - 180}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 7 — RICHESSES / PARADOXE (4394-5062)
// ============================================================================

const Beat7Cobalt: React.FC = () => {
  const range = BEAT_RANGES.BEAT7;
  const duration = range.end - range.start;
  const pct = useCountUp(0, 60, 60, 60);

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.20}
      borderWidth={4}
      keyframes={[
        { frame: 0, ...CAMS.rdcWide },
        { frame: duration, ...CAMS.rdcWide, zoom: CAMS.rdcWide.zoom + 0.1 },
      ]}
    >
      <Caption
        text="UN TRESOR SOUS LA JUNGLE"
        position={{ left: "50%", top: "10%" }}
        size={54}
        color={PALETTE.gold}
        entryAt={0}
      />
      <StickerCard position={{ left: "50%", top: "44%" }} entryAt={40}>
        <BigNumber value={`${pct}%`} unit="DU COBALT MONDIAL" size={260} color={PALETTE.gold} />
      </StickerCard>

      <Caption
        text="Batteries · Smartphones · Voitures electriques"
        position={{ left: "50%", top: "70%" }}
        size={32}
        color={PALETTE.cream}
        entryAt={180}
      />

      <Caption
        text="ET POURTANT : L'UN DES PAYS LES PLUS PAUVRES DU MONDE"
        position={{ left: "50%", top: "85%", width: 1600 }}
        size={42}
        color={PALETTE.red}
        entryAt={duration - 240}
      />
    </MapboxSatelliteBeat>
  );
};

// ============================================================================
// BEAT 8 — CHUTE (5063-5400) — drapeau remplit RDC
// ============================================================================

const Beat8Chute: React.FC = () => {
  const range = BEAT_RANGES.BEAT8;
  const duration = range.end - range.start;
  const topo = useTopology("/_shared/geo-data/countries-50m.json");
  const frame = useCurrentFrame();

  // Fade out global sur 30 derniers frames
  const fadeOut = interpolate(
    frame,
    [duration - FINAL_FADE_FRAMES, duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.navy,
        opacity: fadeOut,
      }}
    >
      {topo && (
        <CountryFlagFill
          topology={topo as any}
          countryName="Dem. Rep. Congo"
          flag="cd"
          width={1920}
          height={1080}
          glowColor={PALETTE.orange}
          borderWidth={6}
          entryAt={0}
        />
      )}
      <Caption
        text="REPUBLIQUE DEMOCRATIQUE DU CONGO"
        position={{ left: "50%", top: "10%" }}
        size={64}
        color={PALETTE.gold}
        entryAt={20}
      />
      <Caption
        text="trop grand · trop riche · trop complexe"
        position={{ left: "50%", top: "90%" }}
        size={42}
        color={PALETTE.cream}
        entryAt={120}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// COMPOSITION FULL
// ============================================================================

export const RdcNoSenseFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Audio final mix (narration + music) — joue sur toute la composition */}
      <Audio src={staticFile(FINAL_MIX_PATH)} />

      {/* BEATS */}
      <Sequence from={BEAT_RANGES.BEAT1.start}  durationInFrames={BEAT_RANGES.BEAT1.end  - BEAT_RANGES.BEAT1.start}  premountFor={30}><Beat1Hook /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT2a.start} durationInFrames={BEAT_RANGES.BEAT2a.end - BEAT_RANGES.BEAT2a.start} premountFor={30}><Beat2aTaille /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT2b.start} durationInFrames={BEAT_RANGES.BEAT2b.end - BEAT_RANGES.BEAT2b.start} premountFor={30}><Beat2bFrance /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT3a.start} durationInFrames={BEAT_RANGES.BEAT3a.end - BEAT_RANGES.BEAT3a.start} premountFor={30}><Beat3aFrontieres /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT3b.start} durationInFrames={BEAT_RANGES.BEAT3b.end - BEAT_RANGES.BEAT3b.start} premountFor={30}><Beat3bNeuf /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT3c.start} durationInFrames={BEAT_RANGES.BEAT3c.end - BEAT_RANGES.BEAT3c.start} premountFor={30}><Beat3cBerlin /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT4a.start} durationInFrames={BEAT_RANGES.BEAT4a.end - BEAT_RANGES.BEAT4a.start} premountFor={30}><Beat4aFleuve /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT4b.start} durationInFrames={BEAT_RANGES.BEAT4b.end - BEAT_RANGES.BEAT4b.start} premountFor={30}><Beat4bDebit /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT5.start}  durationInFrames={BEAT_RANGES.BEAT5.end  - BEAT_RANGES.BEAT5.start}  premountFor={30}><Beat5Foret /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT6.start}  durationInFrames={BEAT_RANGES.BEAT6.end  - BEAT_RANGES.BEAT6.start}  premountFor={30}><Beat6Diversite /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT7.start}  durationInFrames={BEAT_RANGES.BEAT7.end  - BEAT_RANGES.BEAT7.start}  premountFor={30}><Beat7Cobalt /></Sequence>
      <Sequence from={BEAT_RANGES.BEAT8.start}  durationInFrames={BEAT_RANGES.BEAT8.end  - BEAT_RANGES.BEAT8.start}  premountFor={30}><Beat8Chute /></Sequence>
    </AbsoluteFill>
  );
};

export const RDC_NO_SENSE_FRAMES = TOTAL_FRAMES;
export const RDC_NO_SENSE_ID = "RdcNoSenseFull";

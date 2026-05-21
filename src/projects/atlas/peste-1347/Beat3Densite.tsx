// Beat3Densite — refonte "Ingénieur de Précision" (2026-05-16)
// Tableau de spécifications source : conversation atelier.
// Toutes les coords proviennent de mapConfig.ts. Aucune coord magique inline.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator, AtlasPulseMarker } from "../_shared/atlas-components";
import { BEATS, CITIES, STATS } from "./timing";
import {
  WIDTH as W,
  HEIGHT as H,
  STATIONS,
  INHERITED_FROM_BEAT2,
  PALETTE,
  cameraTo,
  makeMapCoord,
  MERC_LARGE,
  ISO_PLAGUE,
  PLAGUE_COUNTRY_COLOR,
} from "./mapConfig";

const {
  OCEAN, MALI_GOLD, PLAGUE_RED, PLAGUE_RED_BRIGHT,
  TEXT_MUTED, CREAM, PARCHMENT, PARCHMENT_DARK, PARCHMENT_INK,
} = PALETTE;

const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

// ─── STAT PARCHEMIN — slide-in vertical + glow pulse sur thud ──────────────

interface StatParchmentProps {
  x: number;
  y: number;
  bigText: string;
  subText: string;
  appearAt: number;
  hideAt: number;
  localF: number;
  accent?: string;
  width?: number;
  height?: number;
  bigSize?: number;
}

const StatParchment: React.FC<StatParchmentProps> = ({
  x, y, bigText, subText, appearAt, hideAt, localF,
  accent = PLAGUE_RED, width = 205, height = 84, bigSize = 42,
}) => {
  if (localF < appearAt - 5 || localF > hideAt + 18) return null;

  const slideIn = interpolate(localF, [appearAt, appearAt + 15], [15, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(localF, [appearAt, appearAt + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localF, [hideAt, hideAt + 18], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const glow = interpolate(localF, [appearAt, appearAt + 6, appearAt + 18], [0, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <g transform={`translate(${x} ${y + slideIn})`} opacity={opacity}>
      <rect x={-4} y={-4} width={width + 8} height={height + 8}
            fill={accent} fillOpacity={glow * 0.35} rx={6} />
      <rect x={0} y={0} width={width} height={height} fill={PARCHMENT_INK} rx={3} />
      <rect x={2} y={2} width={width - 4} height={height - 4} fill={PARCHMENT} rx={2} />
      <g opacity={0.08}>
        {[...Array(7)].map((_, i) => (
          <line key={i} x1={i * 30} y1={0} x2={i * 30 - 40} y2={height}
                stroke={PARCHMENT_INK} strokeWidth={0.5} />
        ))}
      </g>
      <line x1={10} y1={8} x2={width - 10} y2={8} stroke={PARCHMENT_DARK} strokeWidth={0.8} />
      <line x1={10} y1={height - 8} x2={width - 10} y2={height - 8} stroke={PARCHMENT_DARK} strokeWidth={0.8} />
      <text x={width / 2} y={height * 0.58} textAnchor="middle"
            fill={accent} fontSize={bigSize}
            fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700}>
        {bigText}
      </text>
      <text x={width / 2} y={height - 14} textAnchor="middle"
            fill={PARCHMENT_INK} fontSize={11}
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing={1.5} fontWeight={600}>
        {subText}
      </text>
    </g>
  );
};

// ─── CITY SPRITE — hérité de Beat 2, présent dès f0, boucle indéfiniment ───
// Spring pop à appearAt, zoom 1.0→2.2→1.5 sur 45f, halo parchemin pour lisibilité.
// Tailles V6 restaurées (Londres 90×68, Caire 95×72).

interface CitySpriteAnimatedProps {
  cityKey: "londres" | "caire";
  frameCount: number;
  x: number; y: number;
  width: number; height: number;
  appearAt: number;
  hideAt: number;
  localF: number;
}

const FRAMES_PER_TICK = 6;

const CitySpriteAnimated: React.FC<CitySpriteAnimatedProps> = ({
  cityKey, frameCount, x, y, width, height, appearAt, hideAt, localF,
}) => {
  if (localF < appearAt - 3 || localF > hideAt + 15) return null;

  const lf = Math.max(0, localF - appearAt);

  // Spring pop + zoom plongée agressif : 1.0 → 3.0 → 1.8 sur 45f
  const spriteScale = interpolate(lf, [0, 12, 45],
    [0, 3.0, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeIn = interpolate(lf, [0, 10], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [hideAt, hideAt + 15], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  const rawIdx = Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount;
  const frameStr = String(rawIdx).padStart(3, "0");
  const href = staticFile(
    `atlas/peste-1347/assets/objects/cities-v2/${cityKey}/anim/frame_${frameStr}.png`
  );

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <image
        href={href}
        x={-width * spriteScale / 2}
        y={-height * spriteScale}
        width={width * spriteScale}
        height={height * spriteScale}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
};


// ─── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────

export const Beat3Densite: React.FC = () => {
  const frame = useCurrentFrame();

  const beatStart = BEATS.DENSITE_START;
  const beatEnd = BEATS.DENSITE_END;
  const beatDur = beatEnd - beatStart;
  const localF = frame - beatStart;

  // ── Frames locales calées sur audio (forced-alignment) ───────────────────
  const F_ANGL   = STATS.ANGLETERRE_46PCT - beatStart;  // 4
  const F_4M8    = STATS.QUATRE_VIRGULE   - beatStart;  // 126
  const F_2M6    = STATS.DEUX_VIRGULE     - beatStart;  // 212
  const F_CAIRE  = CITIES.CAIRE           - beatStart;  // 295
  const F_7000   = STATS.SEPT_MILLE       - beatStart;  // 391

  // ── CAMÉRA — état hérité Beat 2 → push-in Londres → pan Caire ───────────
  const cam0 = INHERITED_FROM_BEAT2;
  // Cible 1 : Londres centré, scale 1.85, léger décalage pour libérer côté droit (cartouches)
  const camLondres = cameraTo("LONDRES", 1.85, { dx: 30, dy: -30 });
  // Cible 2 : Caire centré, scale 1.40, décalage modéré
  const camCaire   = cameraTo("LE_CAIRE", 1.40, { dx: 40, dy: -60 });

  // Phase A (0 → F_4M8=126)   : push-in Londres
  // Phase B (F_4M8 → F_CAIRE) : hold Londres
  // Phase C (F_CAIRE → F_7000): drift vers Caire (durée ~96f)
  // Phase D (F_7000 → end)    : hold Caire
  const camScale = interpolate(localF,
    [0, F_4M8, F_CAIRE, F_7000, beatDur],
    [cam0.scale, camLondres.scale, camLondres.scale, camCaire.scale, camCaire.scale],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const driftX = interpolate(localF,
    [0, F_4M8, F_CAIRE, F_7000, beatDur],
    [cam0.driftX, camLondres.driftX, camLondres.driftX, camCaire.driftX, camCaire.driftX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const driftY = interpolate(localF,
    [0, F_4M8, F_CAIRE, F_7000, beatDur],
    [cam0.driftY, camLondres.driftY, camLondres.driftY, camCaire.driftY, camCaire.driftY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mc = makeMapCoord(camScale, driftX, driftY);
  const mapOpacity = interpolate(localF, [0, 12], [0.7, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Highlight pays : Mali en or + pays infectés en rouge terne (hérité Beat 2)
  const highlightFills: Record<string, string> = {};
  ISO_MALI_ZONE.forEach((iso) => { highlightFills[iso] = MALI_GOLD; });
  ISO_PLAGUE.forEach((iso) => {
    // GBR géré séparément avec PLAGUE_RED_BRIGHT (focus narratif)
    if (iso !== "GBR") highlightFills[iso] = PLAGUE_COUNTRY_COLOR;
  });

  // Highlight GBR fade-in au mot "Angleterre", pulse continu jusqu'à fin beat
  const angleterreOpacity = interpolate(localF, [F_ANGL, F_ANGL + 20], [0, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const angleterrePulse = 0.7 + 0.15 * Math.sin((localF - F_ANGL) * 0.08);
  const angleterreFinalOpacity = localF > F_ANGL + 20
    ? angleterrePulse
    : angleterreOpacity;

  const gbrCountry = (MERC_LARGE.countries as Array<{ iso: string; d: string }>).find(
    (c) => c.iso === "GBR"
  );

  // ── Coords écran villes (suivent la caméra)
  const [londresX, londresY]     = mc(STATIONS.LONDRES.x, STATIONS.LONDRES.y);
  const [parisX, parisY]         = mc(STATIONS.PARIS.x, STATIONS.PARIS.y);
  const [stockholmX, stockholmY] = mc(STATIONS.STOCKHOLM.x, STATIONS.STOCKHOLM.y);
  const [caireX, caireY]         = mc(STATIONS.LE_CAIRE.x, STATIONS.LE_CAIRE.y);

  // ── S1: EMPILEMENT VERTICAL DES 3 CARTOUCHES ANGLETERRE ─────────────────
  // Slot ancré à droite de l'Angleterre, les 3 cartouches s'accumulent
  // verticalement (la 1ère reste, la 2e arrive dessous, la 3e en bas).
  const CARD_W = 195;
  const CARD_H = 78;
  const CARD_GAP = 12;
  // Position du slot : à droite du Londres, ajustée + clampée
  const STACK_X_RAW = londresX + 70;
  const STACK_Y0_RAW = londresY - 90;
  const STACK_X = Math.max(20, Math.min(W - CARD_W - 20, STACK_X_RAW));
  const STACK_Y_0 = Math.max(60, Math.min(H - 3 * (CARD_H + CARD_GAP) - 60, STACK_Y0_RAW));
  const STACK_Y_1 = STACK_Y_0 + CARD_H + CARD_GAP;
  const STACK_Y_2 = STACK_Y_0 + 2 * (CARD_H + CARD_GAP);

  // ── Slot Caire (cartouche remontée +55px pour ne pas cacher le sprite)
  const CAIRE_CARD_W = 200;
  const CAIRE_CARD_H = 84;
  const CAIRE_SLOT_X = Math.max(20, Math.min(W - CAIRE_CARD_W - 20,
    caireX - CAIRE_CARD_W / 2));
  const CAIRE_SLOT_Y = Math.max(60, caireY - CAIRE_CARD_H - 120);

  // ── Date "Décembre 1348" — pendant le drift caméra Phase C
  const F_DATE_IN = F_CAIRE + 18;   // après "Au Caire" + sprite installé
  const F_DATE_OUT = F_7000 - 5;
  // Position : sous le sprite Caire, clampée pour rester dans cadre
  const DATE_X_RAW = caireX;
  const DATE_Y_RAW = caireY + 30;
  const DATE_X = Math.max(80, Math.min(W - 80, DATE_X_RAW));
  const DATE_Y = Math.max(100, Math.min(H - 80, DATE_Y_RAW));

  // ── S3: Marker Angleterre persistant (apparaît au F_CAIRE pour le contraste)
  const persistMarkerOpacity = interpolate(localF,
    [F_CAIRE, F_CAIRE + 30, beatDur], [0, 0.85, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Titre haut
  const titleOpacity = interpolate(localF, [10, 30], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Audio
  const audioStart = beatStart;
  const audioEnd = beatStart + beatDur;

  // ── Tailles sprites villes — Caire réduit pour harmoniser avec Londres
  const CITY_W_LONDRES = 90, CITY_H_LONDRES = 68;
  const CITY_W_CAIRE = 75, CITY_H_CAIRE = 57;

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      {/* Narration : enveloppée dans Sequence(from=beatStart) pour que l'Audio
          démarre à f714 absolu de composition tout en lisant le segment 714-1222
          du fichier source — fix bug "voix absente" sur render isolé. */}
      <Sequence from={beatStart}>
        <Audio
          src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
          startFrom={audioStart} endAt={audioEnd} volume={1}
        />
      </Sequence>
      <Audio
        src={staticFile("atlas/peste-1347/audio/music-c-desert.mp3")}
        startFrom={0} volume={0.04}
      />

      {/* SFX — calés -3f avant le mot (convention manifeste) */}
      <Sequence from={STATS.ANGLETERRE_46PCT - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>
      <Sequence from={STATS.QUATRE_VIRGULE - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>
      <Sequence from={STATS.DEUX_VIRGULE - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>
      <Sequence from={CITIES.CAIRE - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-b-marker.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={STATS.SEPT_MILLE - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ opacity: mapOpacity }}>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={highlightFills}
          driftX={driftX} driftY={driftY} scale={camScale}
          width={W} height={H}
        />

        {/* Angleterre highlight */}
        {gbrCountry && angleterreFinalOpacity > 0 && (
          <g transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}>
            <path
              d={gbrCountry.d}
              fill={PLAGUE_RED_BRIGHT}
              fillOpacity={angleterreFinalOpacity}
              stroke={PLAGUE_RED_BRIGHT}
              strokeOpacity={Math.min(angleterreFinalOpacity * 1.4, 1)}
              strokeWidth={0.6}
            />
          </g>
        )}

        {/* Markers hérités Beat 2 — Paris/Londres/Stockholm pendant Phase A */}
        <g opacity={interpolate(localF, [0, 30, F_ANGL + 30], [0.85, 0.85, 0.4],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {[[parisX, parisY], [londresX, londresY], [stockholmX, stockholmY]].map(
            ([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={4}
                      fill={PLAGUE_RED_BRIGHT} stroke={CREAM} strokeWidth={0.8} />
            )
          )}
        </g>

        {/* SPRITES VILLES — spring pop au mot audio, zoom 1.0→2.2→1.5, halo parchemin */}
        {/* Seulement Londres (Angleterre) et Le Caire — seules villes nommées dans le script */}
        <CitySpriteAnimated
          cityKey="londres" frameCount={9}
          x={londresX} y={londresY + 5}
          width={CITY_W_LONDRES} height={CITY_H_LONDRES}
          appearAt={F_ANGL + 2}
          hideAt={F_CAIRE - 10}
          localF={localF}
        />
        <CitySpriteAnimated
          cityKey="caire" frameCount={17}
          x={caireX} y={caireY + 12}
          width={CITY_W_CAIRE} height={CITY_H_CAIRE}
          appearAt={F_CAIRE - 4}
          hideAt={beatDur + 20}
          localF={localF}
        />


        {/* Marker pulse Le Caire — décalé sous le sprite pour ne pas collisionner */}
        {localF >= F_CAIRE && (
          <AtlasPulseMarker
            coord={[caireX, caireY + 18]}
            beatStart={CITIES.CAIRE}
            color={PLAGUE_RED_BRIGHT}
            ringInner={4}
            ringOuter={20}
          />
        )}

        {/* S3 — Marker Angleterre persistant (haut écran après drift Caire) */}
        {localF >= F_CAIRE && (
          <g opacity={persistMarkerOpacity}>
            <circle cx={londresX} cy={londresY} r={6}
                    fill={PLAGUE_RED_BRIGHT} stroke={CREAM} strokeWidth={1.2} />
            <circle cx={londresX} cy={londresY} r={11}
                    fill="none" stroke={PLAGUE_RED_BRIGHT}
                    strokeWidth={1} strokeOpacity={0.6} />
          </g>
        )}

        {/* S1 — EMPILEMENT VERTICAL DES 3 CARTOUCHES ANGLETERRE */}
        {/* Slot 0 : 46% — apparaît F_ANGL, persiste jusqu'au drift Caire */}
        <StatParchment
          x={STACK_X} y={STACK_Y_0}
          bigText="46 %" subText="DE LA POPULATION"
          appearAt={F_ANGL} hideAt={F_CAIRE - 15}
          localF={localF}
          accent={PLAGUE_RED}
          width={CARD_W} bigSize={40}
        />
        {/* Slot 1 : 4,8 M — apparaît F_4M8, persiste */}
        <StatParchment
          x={STACK_X} y={STACK_Y_1}
          bigText="4,8 M" subText="HABITANTS"
          appearAt={F_4M8} hideAt={F_CAIRE - 15}
          localF={localF}
          accent={PARCHMENT_INK}
          width={CARD_W} bigSize={38}
        />
        {/* Slot 2 : 2,6 M — apparaît F_2M6, persiste */}
        <StatParchment
          x={STACK_X} y={STACK_Y_2}
          bigText="2,6 M" subText="SURVIVANTS"
          appearAt={F_2M6} hideAt={F_CAIRE - 15}
          localF={localF}
          accent={MALI_GOLD}
          width={CARD_W} bigSize={40}
        />

        {/* Date annotation pendant drift Caire */}
        {localF >= F_DATE_IN && localF <= F_DATE_OUT + 15 && (
          <g transform={`translate(${DATE_X} ${DATE_Y})`}
             opacity={interpolate(localF,
               [F_DATE_IN, F_DATE_IN + 15, F_DATE_OUT, F_DATE_OUT + 15],
               [0, 1, 1, 0],
               { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect x={-70} y={-16} width={140} height={24}
                  fill={PARCHMENT_INK} fillOpacity={0.5} rx={3} />
            <text x={0} y={2} textAnchor="middle"
                  fill={CREAM} fontSize={14}
                  fontFamily="Georgia, serif" fontStyle="italic">
              Décembre 1348
            </text>
          </g>
        )}

        {/* Cartouche 7 000 morts/jour — remontée, taille réduite, Caire visible dessous */}
        <StatParchment
          x={CAIRE_SLOT_X} y={CAIRE_SLOT_Y}
          bigText="7 000" subText="MORTS / JOUR"
          appearAt={F_7000} hideAt={beatDur + 30}
          localF={localF}
          accent={PLAGUE_RED_BRIGHT}
          width={CAIRE_CARD_W} height={CAIRE_CARD_H}
          bigSize={48}
        />

        {/* Titre haut */}
        <text x={W / 2} y={H * 0.07} textAnchor="middle"
              fill={MALI_GOLD} fillOpacity={titleOpacity}
              fontSize={16}
              fontFamily="Georgia, 'Times New Roman', serif" letterSpacing={3}>
          LA PESTE NOIRE · 1347
        </text>

        {/* Punchline "Chaque jour." */}
        {localF >= F_7000 + 60 && (
          <text x={W / 2} y={H * 0.93} textAnchor="middle"
                fill={PLAGUE_RED_BRIGHT}
                fillOpacity={interpolate(localF, [F_7000 + 60, F_7000 + 85], [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                fontSize={15}
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic">
            Chaque jour.
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};

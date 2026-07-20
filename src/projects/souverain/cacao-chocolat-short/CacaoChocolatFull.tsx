/**
 * Cacao -> Chocolat SHORT — ASSEMBLAGE FINAL des 5 beats.
 *
 * Chaque beat porte SA PROPRE narration (<Audio> interne) -> on enchaine les composants en <Sequence>
 * (chaque Sequence decale le temps local, donc l'audio de chaque beat joue a sa place). Pas de narration
 * globale. UNE couche MUSIQUE globale (cacao-music-CHOISI = sample B afro-melancolique, choisi Aziz) par
 * dessus, ~0.10, fade in/out (doctrine GGW : musique sous la narration).
 *
 * Timeline (tous @30fps) :
 *   B1 Hook        f0    -> 365   (12.17s)
 *   B2 Source      f365  -> 651   ( 9.52s)
 *   B3 Extraction  f651  -> 1225  (19.13s)
 *   B4 Renversement f1225-> 2135  (28.33s + respiration)
 *   B5 Pont+CTA    f2135 -> 2955  (25.63s + respiration)
 *   TOTAL = 2955 frames = 98.5s
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { B1Hook, B1_HOOK_FRAMES } from "./beats/B1Hook";
import { B2Source, B2_SOURCE_FRAMES } from "./beats/B2Source";
import { B3Extraction, B3_EXTRACTION_FRAMES } from "./beats/B3Extraction";
import { B4Renversement, B4_RENVERSEMENT_FRAMES } from "./beats/B4Renversement";
import { B5Pont, B5_PONT_FRAMES } from "./beats/B5Pont";

const B1_START = 0;
const B2_START = B1_START + B1_HOOK_FRAMES; // 365
const B3_START = B2_START + B2_SOURCE_FRAMES; // 651
const B4_START = B3_START + B3_EXTRACTION_FRAMES; // 1225
const B5_START = B4_START + B4_RENVERSEMENT_FRAMES; // 2135
export const CACAO_FULL_FRAMES = B5_START + B5_PONT_FRAMES; // 2955

const PARCH = "#e8dcc0";
const MUSIC_VOL = 0.10;
const FADE_IN_S = 1.5;
const FADE_OUT_S = 3.0;

// ---- SPOTTING SFX (plan agent son, 2026-06-29) : { t (s), src, vol } ----
// REUTILISE palette GGW (meme registre encre/parchemin) + UI + 4 SFX cacao crees. Volumes SOUS la narration.
const GGW = (n: string) => staticFile(`audio/ggw-muraille-verte/sfx/ggw-sfx-${n}.mp3`);
const UI = (n: string) => staticFile(`_shared/sfx/ui/${n}.mp3`);
const CSFX = (n: string) => staticFile(`souverain/cacao-chocolat-short/audio/sfx/${n}.mp3`);

// ALIGNE SUR LES TIMINGS REELS DES MOTS (force alignment Whisper, offsets de beats : B1=0 B2=12.167
// B3=21.700 B4=40.833 B5=71.167s). Chaque SFX cale sur le mot/geste qui le declenche.
type Spot = { t: number; src: string; vol: number };
const SFX: Spot[] = [
  // B1 HOOK
  { t: 0.6, src: GGW("sillon"), vol: 0.25 },          // tablette commence a se tracer
  { t: 7.5, src: GGW("soleil-embrase"), vol: 0.18 },  // colorisation brune (mi-trace)
  { t: 10.2, src: UI("stamp-dossier"), vol: 0.38 },   // croix suisse plantee (apres compo, coup du hook)
  // B2 SOURCE
  { t: 20.4, src: GGW("sillon"), vol: 0.20 },         // "Cote d'Ivoire" -> trace CI
  { t: 21.4, src: GGW("sillon"), vol: 0.20 },         // "Ghana" -> trace Ghana
  { t: 18.7, src: CSFX("sfx-flag-unfold"), vol: 0.28 }, // drapeau CI eclot (CI_FLAG ~f196)
  // B3 EXTRACTION
  // (pod-crack 24.9s RETIRE — Aziz : petit clic genant juste avant la tablette)
  { t: 26.2, src: GGW("pousse"), vol: 0.20 },         // "le paysan qui cultive" -> arbres vivants
  { t: 23.5, src: GGW("vent"), vol: 0.08 },           // ambiance verger (basse, entree)
  { t: 35.6, src: GGW("goutte"), vol: 0.20 },         // "ne recoit qu'un et demi %" -> barre/fuite
  { t: 39.7, src: CSFX("sfx-flux-exit"), vol: 0.18 }, // "pese 130 milliards" -> la valeur sort
  // B4 RENVERSEMENT
  { t: 42.6, src: GGW("pluie-douce"), vol: 0.18 },    // "l'Afrique n'est pas pauvre" -> reverdit
  { t: 43.1, src: GGW("pousse"), vol: 0.22 },         // la vie revient (decale)
  { t: 52.3, src: GGW("fissure"), vol: 0.35 },        // "vient aussi du dedans" -> la fissure
  { t: 57.8, src: GGW("goutte"), vol: 0.20 },         // "revenus se perdent en route" -> seve fuit
  { t: 62.6, src: CSFX("sfx-pencil-sketch"), vol: 0.22 }, // "transformer tout son cacao" -> usine se trace
  { t: 64.7, src: GGW("vent-sec"), vol: 0.12 },       // fumee usine
  // B5 PONT
  { t: 74.5, src: GGW("ombre-dissoute"), vol: 0.18 }, // "le cafe, l'or, le cobalt" -> ombres
  { t: 83.1, src: GGW("ombre-dissoute"), vol: 0.12 }, // "la vraie question" -> 5e ombre fantome
  { t: 89.1, src: GGW("pousse"), vol: 0.28 },         // "Abonne-toi" -> cabosse eclot
  // (reveal-souterrain 90.2s RETIRE — Aziz : SFX genant vers 1min31-32)
  { t: 96.3, src: UI("plate-pop"), vol: 0.20 },       // "video" (fin) -> signature GeoAfrique
];

export const CacaoChocolatFull: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalS = CACAO_FULL_FRAMES / fps;
  const fadeOutStartS = totalS - FADE_OUT_S;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      {/* MUSIQUE globale (sample B), sous la narration, fade in/out */}
      <Audio
        src={staticFile("souverain/cacao-chocolat-short/audio/cacao-music-CHOISI.mp3")}
        volume={(f) => {
          const s = f / fps;
          if (s < FADE_IN_S) return MUSIC_VOL * (s / FADE_IN_S);
          if (s >= fadeOutStartS) return MUSIC_VOL * Math.max(0, 1 - (s - fadeOutStartS) / FADE_OUT_S);
          return MUSIC_VOL;
        }}
      />

      <Sequence from={B1_START} durationInFrames={B1_HOOK_FRAMES} premountFor={30}>
        <B1Hook />
      </Sequence>
      <Sequence from={B2_START} durationInFrames={B2_SOURCE_FRAMES} premountFor={30}>
        <B2Source />
      </Sequence>
      <Sequence from={B3_START} durationInFrames={B3_EXTRACTION_FRAMES} premountFor={30}>
        <B3Extraction />
      </Sequence>
      <Sequence from={B4_START} durationInFrames={B4_RENVERSEMENT_FRAMES} premountFor={30}>
        <B4Renversement transitionMode="lien" />
      </Sequence>
      <Sequence from={B5_START} durationInFrames={B5_PONT_FRAMES} premountFor={30}>
        <B5Pont />
      </Sequence>

      {/* COUCHE SFX — chaque event a son timecode, volume sous la narration */}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * fps)} premountFor={fps}>
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

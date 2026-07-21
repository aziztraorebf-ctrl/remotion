/**
 * SCENE COMPLETE 16:9 (~34s, 3 clips Seedance) — "Le pecheur et la surpeche industrielle", VERSION
 * SEEDANCE (2026-07-04). Remplace le rig code a la main (PecheurSurpeche16x9.tsx) par 3 clips
 * Seedance 2.0 image-to-video, valides frame par frame par Aziz apres test complet.
 *
 * DECISION DE SESSION : le rig SVG code (GeminiRig) posait des bugs recurrents couteux a deboguer
 * (pieds qui flottent, poissons qui n'atterrissent pas au bon endroit, expression figee). Test
 * comparatif : image-to-video Seedance + prompt NARRATIF (pas de timecodes frame-exacts) sur UNE
 * image source, plutot qu'un storyboard multi-images (technique qui a echoue 0/3-0/5 sur tout style
 * non-standard teste avant — cf memory/tools/seedance-rules.md regle 29). Resultat : succes net sur
 * les 3 clips (lancer, halage, retournement 3/4, depot precis dans le panier, pieds ancres en
 * permanence, style vectoriel epure 100% preserve, chalutier stable en fond).
 *
 * METHODE (reproductible pour toute future scene personnage courte ~10-20s) :
 * 1. Composer une frame source PNG complete (decor SVG code + personnage + accessoires) via le
 *    pipeline SVG existant (pas de nouveau code de rig).
 *    - masquer temporairement tout texte incruste (voir pattern backup/restore dans l'historique).
 * 2. Ecrire un prompt Seedance NARRATIF (verbes d'action enchaines, pas de timecodes secondes-par-
 *    secondes) + clause STRICT STYLE FIDELITY (obligatoire sur tout style non-standard) + identity
 *    lock (couleurs/proportions du personnage) + interdits (no text/dialogue/particules).
 * 3. image-to-video simple (PAS reference-to-video multi-images), aspect_ratio="16:9" natif dans
 *    l'API (jamais crop post), generate_audio=false pour une scene silencieuse.
 * 4. Verifier le resultat par ECHANTILLONNAGE SERRE (frames tous les 0.3-0.5s autour des beats
 *    narratifs cles) — un echantillonnage trop grossier (ex. toutes les 2s) peut RATER un beat reussi
 *    et faire conclure a un echec qui n'existe pas (verifie sur cette session : le depot dans le
 *    panier avait bien eu lieu, juste entre 2 frames echantillonnees).
 *
 * Chaque clip garde le decor SVG (ocean/ciel/chalutier/pirogue deja codes dans PecheurSurpeche16x9,
 * eux INCHANGES et toujours en code — seul le PERSONNAGE+GESTE est delegue a Seedance) au moment de
 * la capture de la frame source, donc pas de rupture visuelle entre le decor fige de la video et le
 * reste de la production.
 *
 * DONNEE FACTUELLE (doctrine SUJET-PRIME) : repartition VALEUR des captures Senegal 2021 — artisanal
 * 61% (139 Mds XOF) / autres flottes (semi-industrielle+industrielle, incluant etrangeres) 39%
 * (88 Mds XOF). Source : ODI, "Estimating the impact of irregular and unsustainable fishing of
 * distant-water fishing fleets in Senegal" (Gutierrez & Lemma, avril 2024), donnees 2021.
 */
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { GridBackground } from "../../_shared/components/GridBackground";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { DATAVIZ_BG, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";

const CLIP_FRAMES = 301; // ~10.04s a 30fps, duree reelle des 3 clips Seedance
const CROSSFADE = 20;

const CAST1_START = 0;
const CAST2_START = CLIP_FRAMES - CROSSFADE;
const CAST3_START = CAST2_START + CLIP_FRAMES - CROSSFADE;
const DATA_START = CAST3_START + CLIP_FRAMES - CROSSFADE;
const DATA_FRAMES = 240;

export const PECHEUR_SEEDANCE_FRAMES = DATA_START + DATA_FRAMES;

const PECHE_SEGMENTS = [
  { label: "Peche artisanale", value: 0.61, color: "#5e7245" },
  { label: "Flottes semi-industr. + etrangeres", value: 0.39, color: "#8a2b2b" },
];

/** clip video avec fade-in/fade-out sur les bords pour un crossfade doux avec le clip suivant */
const FadedClip: React.FC<{ src: string; from: number; fadeOut?: boolean }> = ({ src, from, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const fadeIn = interpolate(local, [0, CROSSFADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOutOp = fadeOut
    ? interpolate(local, [CLIP_FRAMES - CROSSFADE, CLIP_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const opacity = Math.min(fadeIn, fadeOutOp);
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

export const PecheurSurpecheSeedance16x9: React.FC = () => {
  const frame = useCurrentFrame();

  const dataOpacity = interpolate(frame, [DATA_START - CROSSFADE, DATA_START], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataLocalFrame = Math.max(0, frame - (DATA_START - 20));
  const dataTitleOpacity = interpolate(frame, [DATA_START, DATA_START + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DATAVIZ_BG }}>
      <Sequence from={0} durationInFrames={PECHEUR_SEEDANCE_FRAMES}>
        <Audio src={staticFile("_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3")} volume={0.42} loop />
      </Sequence>

      <Sequence from={CAST1_START} durationInFrames={CLIP_FRAMES}>
        <FadedClip src={staticFile("_rnd/pecheur-seedance/cast1.mp4")} from={CAST1_START} />
      </Sequence>
      <Sequence from={CAST2_START} durationInFrames={CLIP_FRAMES}>
        <FadedClip src={staticFile("_rnd/pecheur-seedance/cast2.mp4")} from={CAST2_START} />
      </Sequence>
      <Sequence from={CAST3_START} durationInFrames={CLIP_FRAMES}>
        <FadedClip src={staticFile("_rnd/pecheur-seedance/cast3.mp4")} from={CAST3_START} fadeOut={false} />
      </Sequence>

      {frame >= DATA_START - CROSSFADE && (
        <AbsoluteFill style={{ opacity: dataOpacity }}>
          <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
            <GridBackground />
            <text x={960} y={90} textAnchor="middle" fill={PARCH} fontSize={36} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={2} opacity={dataTitleOpacity}>
              QUI CAPTE LA VALEUR DE LA PECHE ?
            </text>
            <line x1={620} y1={108} x2={1300} y2={108} stroke={PARCH_DIM} strokeWidth={1} opacity={0.5 * dataTitleOpacity} />
            <InkDonutChart
              cx={960} cy={520} r={260}
              segments={PECHE_SEGMENTS}
              labelStyle="leader"
              backgroundColor={DATAVIZ_BG}
              backgroundInset={3}
              innerRatio={0.52}
              segmentOpacity={0.82}
              segmentStrokeWidth={2.5}
              startFrame={5}
              springDamping={20}
              frame={dataLocalFrame} fps={30}
              centerText={{ line1: "61%", line2: "valeur pour la peche artisanale" }}
            />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
              Source : ODI, "Distant-water fishing fleets in Senegal" (2024), donnees 2021
            </text>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

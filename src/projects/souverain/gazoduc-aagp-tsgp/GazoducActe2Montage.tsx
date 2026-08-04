// GazoducActe2Montage — assemblage final de l'Acte 2 en 4 segments distincts, jamais un fichier
// monolithique (doctrine DOCTRINE-SOUVERAIN.md §4.4). Pivot Aziz 2026-08-03/04 : l'Acte 2 n'est PAS
// une seule scène carte — c'est 4 segments qui s'enchaînent au montage, chacun avec sa propre fenêtre
// audio dans narration-p2.mp3 (139.005s) :
//
//   1. Freetown          (signature, temps A) — 660f/22s      — audio 9.52s→31.52s  (f286→f946)
//   2. Carte AAGP                              — 624f/20.8s   — audio 31.52s→52.32s (f946→f1570)
//   3. Flashback 2016    (signature, temps B) — 1001f/33.36s — audio 53.54s→86.90s (f1606→f2608)
//   4. Financement                             — 1538f/51.26s — audio 87.88s→139.14s (f2636→f4174)
//
// (Carte/Flashback/Financement incluent +9f/300ms de marge de sécurité audio en fin de fenêtre —
// retour Aziz 2026-08-04 : "an."/"s'enchaînent." coupés avant leur fin, la Sequence tranche l'Audio
// net à sa durée sans tolérance.)
//
// Chaque segment garde SA PROPRE fenêtre audio (startFrom dans narration-p2.mp3) — les 2 micro-gaps
// de respiration naturelle entre segments (136.8s→138.32s "an. L'idée", 171.38s→172.66s "Tout est
// parfait,") ne sont PAS dans le montage : ils sont des silences de ponctuation qui n'ont pas besoin
// d'écran dédié, la coupe visuelle directe entre segments reste fluide car narrativement continue.
// Offsets calculés depuis narration-NEW.alignment.json (forced-align réel, PARTIE 2 démarre à 84.78s
// dans le fichier complet 5-parties ; narration-p2.mp3 = ce même passage isolé, offset 0 = 84.78s).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GazoducActe2SignatureFreetown, GazoducActe2SignatureFlashback, GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES, GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES } from "./GazoducActe2Signature";
import { GazoducActe2AAGP, GAZODUC_A2_FRAMES } from "./GazoducActe2AAGP";
import { GazoducActe2Financement, GAZODUC_A2_FINANCEMENT_FRAMES } from "./GazoducActe2Financement";

const NARRATION_P2 = "souverain/gazoduc-aagp-tsgp/audio/narration-p2.mp3";
const FPS = 30;

// Offsets audio (frames dans narration-p2.mp3), forced-align réel — PAS retapés à la main.
const AUDIO_START = {
  freetown: Math.round(9.52 * FPS),    // 286
  carte: Math.round(31.52 * FPS),      // 946
  flashback: Math.round(53.54 * FPS),  // 1606
  financement: Math.round(87.88 * FPS),// 2636
};

// Offsets de montage (frames locales, 0-based, segments contigus).
const F_FREETOWN = 0;
const F_CARTE = F_FREETOWN + GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES; // 660
const F_FLASHBACK = F_CARTE + GAZODUC_A2_FRAMES; // 1275
const F_FINANCEMENT = F_FLASHBACK + GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES; // 2267

export const GAZODUC_A2_MONTAGE_FRAMES = F_FINANCEMENT + GAZODUC_A2_FINANCEMENT_FRAMES; // 3796

export const GazoducActe2Montage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#182746" }}>
      <Sequence from={F_FREETOWN} durationInFrames={GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P2)} startFrom={AUDIO_START.freetown} />
          <GazoducActe2SignatureFreetown />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F_CARTE} durationInFrames={GAZODUC_A2_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P2)} startFrom={AUDIO_START.carte} />
          <GazoducActe2AAGP />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F_FLASHBACK} durationInFrames={GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P2)} startFrom={AUDIO_START.flashback} />
          <GazoducActe2SignatureFlashback />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F_FINANCEMENT} durationInFrames={GAZODUC_A2_FINANCEMENT_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P2)} startFrom={AUDIO_START.financement} />
          <GazoducActe2Financement />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default GazoducActe2Montage;

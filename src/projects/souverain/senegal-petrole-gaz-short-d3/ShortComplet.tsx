// ShortComplet — Short Senegal Petrole Gaz D3 (9:16) : ASSEMBLAGE des 5 beats + narration continue.
//
// Chaque scene a un T_OFFSET interne (le temps de narration ou elle demarre) et calcule ses
// animations depuis useCurrentFrame() + T_OFFSET. Dans une <Sequence from={N}>, useCurrentFrame()
// repart a 0, donc on place chaque scene a from = T_OFFSET * fps pour que (frame + T_OFFSET) redonne
// le bon temps absolu de narration. La narration-v1.mp3 joue UNE fois en continu par-dessus.
//
// Etape 1 de l'assemblage (Aziz) : narration seulement. Musique AES + SFX ajoutes ensuite.
//
// Calage (T_OFFSET en secondes -> from en frames @30fps) :
//   Scene1 Hook        0.0s   -> from 0     (dur 288)
//   Scene2 Paradoxe    9.6s   -> from 288   (dur 489)
//   Scene3 Comparaison 25.44s -> from 763   (dur 1534)
//   Scene4 Dette       76.58s -> from 2297  (dur 605)
//   Scene5 Cta         97.88s -> from 2936  (dur 359)
// Duree totale = 3295 frames (~109.83s), narration = 109.92s.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate } from "remotion";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Paradoxe } from "./Scene2Paradoxe";
import { Scene3Comparaison } from "./Scene3Comparaison";
import { Scene4Dette } from "./Scene4Dette";
import { Scene5Cta } from "./Scene5Cta";

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// durees des scenes (= durationInFrames dans Root.tsx)
const D1 = 288;
const D2 = 489;
const D3 = 1534;
const D4 = 605;
const D5 = 451; // rallonge (retour Aziz : laisser "lien en description" finir + fondu doux, ~3s de queue)

export const SHORT_COMPLET_FRAMES = sec(97.88) + D5; // 3387 (~112.9s)

// ── Chemins SFX (banque _shared/sfx, durees verifiees, aucun corrompu) ──
const SFX = {
  ping: "_shared/sfx/camera/sfx-map-ping.mp3", // 0.48s — apparition point / carte discrete
  pop: "_shared/sfx/ui/plate-pop.mp3", // 0.48s — plaque/drapeau apparait
  tick: "_shared/sfx/data/counter-tick.mp3", // 2.0s — count-up (loop)
  snap: "_shared/sfx/warmap/cedeao-snap.mp3", // 1.0s — rupture/fuite
  barilFill: "_shared/sfx/ui/sfx-baril-fill.mp3", // 4.0s — remplissage baril FONSIS
  vaultLock: "_shared/sfx/ui/vault-lock.mp3", // 1.28s — VERROU coffre qui se ferme (genere ElevenLabs)
  stamp: "_shared/sfx/ui/stamp-dossier.mp3", // 0.8s — cadenas FONSIS qui se ferme (Beat 4)
  drain: "_shared/sfx/warmap/ink-spread.mp3", // 1.48s — debordement calebasse (coulee)
  node: "_shared/sfx/ui/node-appear.mp3", // 0.48s — cartouche CTA / accroches
  typewriter: "_shared/sfx/ui/typewriter.mp3", // 1.6s — frappe machine a ecrire (pont Beat 3, genere ElevenLabs)
};

// helper : un SFX ponctuel a un temps absolu (secondes). Volume 0.50 min (regle projet : SFX < 0.50
// = inaudibles, Aziz devait monter le son. Source : DOCTRINE-SOUVERAIN.md section 6).
const Sfx: React.FC<{ at: number; src: string; vol?: number; dur?: number; loop?: boolean }> = ({ at, src, vol = 0.55, dur = 30, loop = false }) => (
  <Sequence from={sec(at)} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={vol} loop={loop} />
  </Sequence>
);

export const ShortComplet: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#e4ddca" }}>
      {/* ── AUDIO ── */}
      {/* NARRATION continue (une seule fois, par-dessus toutes les scenes) */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz-short-d3/audio/narration-v1.mp3")} />
      {/* MUSIQUE — reprise du Short AES 90s (decision Aziz), volume bas sous la voix. Fondu de sortie
          doux sur les ~2.5s finales (apres la fin de la narration a 109.86s) pour que la video se
          termine en douceur (retour Aziz : la fin coupait sec). */}
      <Audio
        src={staticFile("_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3")}
        volume={(f) => interpolate(f, [0, sec(110), SHORT_COMPLET_FRAMES], [0.12, 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* SFX — cales sur les temps de narration (secondes). Retour Aziz : les inkdraw sur les cartes
          RETIRES -> remplaces par un PING DISCRET a l'apparition de chaque carte. Volumes remontes a
          0.50 min (regle projet). */}
      {/* BEAT 1 : le Senegal apparait -> ping discret (le SFX dechirure est interne a Scene1) */}
      <Sfx at={1.0} src={SFX.ping} vol={0.4} />
      {/* BEAT 2 : 3 gisements s'allument + count-up 60% + fuite */}
      <Sfx at={11.74} src={SFX.ping} vol={0.5} />
      <Sfx at={12.5} src={SFX.ping} vol={0.5} />
      <Sfx at={13.1} src={SFX.ping} vol={0.5} />
      <Sfx at={14.9} src={SFX.tick} vol={0.5} dur={sec(1.6)} loop />
      {/* (Retour Aziz : SFX snap a ~17s RETIRE — indesirable sur la fuite de l'argent.) */}
      {/* BEAT 3 : chaque pays apparait -> ping discret (au lieu d'inkdraw) + drapeau (pop) + VERROU
          quand la porte du coffre se ferme (Norvege ~35.27s, Botswana ~62.59s ; Congo reste ouvert). */}
      <Sfx at={26.34} src={SFX.ping} vol={0.45} />
      <Sfx at={27.6} src={SFX.pop} vol={0.5} />
      <Sfx at={35.27} src={SFX.vaultLock} vol={0.6} dur={sec(1.3)} />
      <Sfx at={43.3} src={SFX.ping} vol={0.45} />
      <Sfx at={44.5} src={SFX.pop} vol={0.5} />
      <Sfx at={54.88} src={SFX.ping} vol={0.45} />
      <Sfx at={56.2} src={SFX.pop} vol={0.5} />
      <Sfx at={62.59} src={SFX.vaultLock} vol={0.6} dur={sec(1.3)} />
      {/* PONT de sortie Beat 3 (68.0s + 72.24s) : le texte s'ecrit en typewriter -> SFX frappe machine
          a ecrire synchronise sur les 2 blocs (retour Aziz). */}
      <Sfx at={68.0} src={SFX.typewriter} vol={0.5} dur={sec(1.6)} />
      <Sfx at={72.24} src={SFX.typewriter} vol={0.5} dur={sec(1.6)} />
      {/* BEAT 4 : baril se remplit + cadenas FONSIS se ferme */}
      <Sfx at={77.0} src={SFX.barilFill} vol={0.5} dur={sec(4)} />
      <Sfx at={80.0} src={SFX.stamp} vol={0.6} />
      {/* BEAT 5 : calebasse deborde + 3 ping sequentiels sur les 3 accroches du cartouche CTA */}
      <Sfx at={100.8} src={SFX.drain} vol={0.5} dur={sec(1.6)} />
      <Sfx at={103.28} src={SFX.node} vol={0.55} />
      <Sfx at={104.5} src={SFX.node} vol={0.55} />
      <Sfx at={105.8} src={SFX.node} vol={0.55} />

      {/* ── VIDEO ── */}
      <Sequence from={0} durationInFrames={D1} name="Beat1-Hook">
        <Scene1Hook />
      </Sequence>
      <Sequence from={sec(9.6)} durationInFrames={D2} name="Beat2-Paradoxe">
        <Scene2Paradoxe />
      </Sequence>
      <Sequence from={sec(25.44)} durationInFrames={D3} name="Beat3-Comparaison">
        <Scene3Comparaison />
      </Sequence>
      <Sequence from={sec(76.58)} durationInFrames={D4} name="Beat4-Dette">
        <Scene4Dette />
      </Sequence>
      <Sequence from={sec(97.88)} durationInFrames={D5} name="Beat5-Cta">
        <Scene5Cta />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ShortComplet;

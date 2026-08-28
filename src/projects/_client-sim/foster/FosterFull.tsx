// MOTEUR: assemblage — les 11 plans + musique + SFX (aucun asset genere)
/**
 * FOSTER — L'ASSEMBLAGE COMPLET (0 -> 42,77 s)
 * ============================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⭐⭐ ZERO ASSET GENERE : tout vient de la banque existante (regle projet
 * « reutiliser avant de creer », et l'index le dit noir sur blanc — « ⛔ A
 * CONSULTER AVANT TOUT APPEL Minimax/fal.ai. Generer sans avoir lu ce fichier,
 * c'est re-payer ce qu'on possede deja »).
 *   . MUSIQUE : `_client-sim/flowdesk/audio/music-flowdesk-45s.mp3` — la piste de
 *     NOTRE AUTRE CLIENT-SIM SaaS, donc deja le bon registre (les 67 pistes de
 *     `INDEX-MUSIQUES.md` sont toutes documentaire/geopolitique africain : kora,
 *     djembe, tension epique — hors sujet pour un SaaS britannique).
 *   . SFX : `_shared/sfx/` et `_client-sim/noteshield/sfx/`.
 *
 * ── POURQUOI CETTE MUSIQUE, MESURE ────────────────────────────────────────
 * Criteres de `INDEX-MUSIQUES.md` appliques a la piste :
 *   ampl (p90-p10) = 12,2 dB   -> passe le seuil (< 15 dB, au-dela ca plonge)
 *   loop           = 7,7 dB    -> SANS OBJET : 49 s de piste pour 42,77 s de
 *                                 video, on ne boucle pas (le raccord ne joue
 *                                 jamais). La duree n'est pas un critere de
 *                                 selection, l'index insiste la-dessus.
 * ⭐ Et surtout son PROFIL colle a celui de la reference — toutes deux MONTENT
 * vers le CTA :
 *   reference  -45,8 dB (0 s) -> -33,5 dB (30 s)
 *   flowdesk   -31,2 dB (0 s) -> -16,9 dB (40 s), avec retombee finale
 *
 * ── LES SFX SONT PLACES SUR DES TRANSITOIRES MESURES ──────────────────────
 * 18 attaques detectees dans l'audio de la reference (enveloppe 20 ms, seuil a
 * +4 sigma). Elles tombent exactement sur les evenements visuels : les cartes du
 * dashboard (24-26 s), la pile doree (32 et 37 s). C'est ce que le fichier projet
 * notait deja : « chaque apparition a son SFX, c'est ce qui rend vrai ».
 * ⚠️ Les plans 1 a 5 SONORISENT DEJA leurs propres evenements (2 balises `Audio`
 * chacun, sauf le 4). On ne rajoute donc RIEN dessus, sinon on doublerait les
 * effets. Seuls les plans 6 a 11 recoivent des SFX ici.
 *
 * ⛔ PAS DE WHOOSH SUR LES COUPES D'UI (fiche UI-PRODUIT, retour d'Aziz) : c'est
 * un vocabulaire de mouvement physique, sans rapport avec un logiciel. Le
 * FlashCut visuel suffit. Aucun `whoosh.mp3` dans ce fichier, c'est deliberé.
 */

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { Plan01Lockscreen } from "./scenes/Plan01Lockscreen";
import { Plan02NotifStack } from "./scenes/Plan02NotifStack";
import { Plan03Typo } from "./scenes/Plan03Typo";
import { Plan04Assembles } from "./scenes/Plan04Assembles";
import { Plan05Diagram } from "./scenes/Plan05Diagram";
import { Plan06GoogleEarth } from "./scenes/Plan06GoogleEarth";
import { Plan07Maison } from "./scenes/Plan07Maison";
import { Plan08Dashboard } from "./scenes/Plan08Dashboard";
import { Plan09PullBack } from "./scenes/Plan09PullBack";
import { Plan10Cta } from "./scenes/Plan10Cta";
import { Plan11Fondu } from "./scenes/Plan11Fondu";

/** Durees MESUREES sur les livrables `plan*-FINAL.mp4`. Total 1283 frames. */
const PLANS = [
  { C: Plan01Lockscreen, f: 48 },
  { C: Plan02NotifStack, f: 120 },
  { C: Plan03Typo, f: 175 },
  { C: Plan04Assembles, f: 65 },
  { C: Plan05Diagram, f: 114 },
  { C: Plan06GoogleEarth, f: 32 },
  { C: Plan07Maison, f: 148 },
  { C: Plan08Dashboard, f: 110 },
  { C: Plan09PullBack, f: 30 },
  { C: Plan10Cta, f: 372 },
  { C: Plan11Fondu, f: 69 },
] as const;

export const FOSTER_TOTAL = PLANS.reduce((n, p) => n + p.f, 0); // 1283

const MUSIC = "_client-sim/flowdesk/audio/music-flowdesk-45s.mp3";

/** Tous pris dans la banque — aucun genere. Durees verifiees sur disque. */
const SFX = {
  /** 0,48 s — apparition d'un element d'interface. */
  plate: "_shared/sfx/ui/plate-pop.mp3",
  /** 0,48 s — apparition d'un noeud / d'une carte. */
  node: "_shared/sfx/ui/node-appear.mp3",
  /** 0,20 s — tick discret pour une valeur qui se pose. */
  tick: "_shared/sfx/data/stat-tick.mp3",
  /** 0,30 s — bulle courte, pour la typo. */
  blip: "_shared/sfx/ui/blip-bubble.mp3",
  /** 0,20 s — le ton deja utilise par les plans 1 a 5, pour rester homogene. */
  tone: "_client-sim/noteshield/sfx/tone.mp3",
} as const;

/**
 * Les SFX a ajouter, en frames ABSOLUES, cales sur les transitoires mesures.
 * ⛔ Uniquement des plans 6 a 11 : avant, les scenes sonorisent elles-memes.
 */
const CUES: { at: number; src: string; vol: number }[] = [
  /* plan 07 — le clip de descente se pose (t=19,56 s). */
  { at: 587, src: SFX.tone, vol: 0.3 },
  /* plan 08 — les 4 cartes du dashboard, puis les lignes (24,14 -> 26,52 s). */
  { at: 724, src: SFX.node, vol: 0.34 },
  { at: 743, src: SFX.node, vol: 0.32 },
  { at: 763, src: SFX.tick, vol: 0.3 },
  { at: 772, src: SFX.tick, vol: 0.28 },
  { at: 781, src: SFX.tick, vol: 0.28 },
  { at: 796, src: SFX.plate, vol: 0.3 },
  /* plan 09 — la plaque entiere apparait (27,14 s), puis se pose. */
  { at: 814, src: SFX.plate, vol: 0.34 },
  { at: 820, src: SFX.tick, vol: 0.24 },
  /* plan 10 — les phrases et la pile doree (30,94 · 32,20 · 37,26 · 38,20 s). */
  { at: 928, src: SFX.blip, vol: 0.3 },
  { at: 966, src: SFX.blip, vol: 0.3 },
  { at: 1118, src: SFX.tone, vol: 0.32 },
  { at: 1146, src: SFX.tone, vol: 0.3 },
];

export const FosterFull: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {PLANS.map(({ C, f }, i) => {
        const from = at;
        at += f;
        return (
          <Sequence key={i} from={from} durationInFrames={f} premountFor={30}>
            <C />
          </Sequence>
        );
      })}

      {/*
        LA MUSIQUE — une seule piste continue sur tout le montage.
        `volume` en fonction : la piste MONTE deja d'elle-meme (-31 -> -17 dB),
        on ne re-dessine donc pas sa dynamique. On se contente d'un fondu de
        sortie sur les 25 dernieres frames, la ou la reference s'eteint.
      */}
      <Audio
        src={staticFile(MUSIC)}
        volume={(f) =>
          f > FOSTER_TOTAL - 25
            ? Math.max(0, (FOSTER_TOTAL - f) / 25) * 0.42
            : 0.42
        }
      />

      {CUES.map((c, i) => (
        <Sequence key={`sfx${i}`} from={c.at} durationInFrames={20}>
          <Audio src={staticFile(c.src)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

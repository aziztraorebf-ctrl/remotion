// AtlasV2SaharanDropScene — "Silent Barter / Drop d'or au Sahara"
// =============================================================================
// Pattern : Recette D (ATLAS-PILLELAB-PLAYBOOK §3 / DECODE-empire-ghana.md section C)
//   "berbere walk -> crouch -> drop sac -> walk away ; l'objet PERSISTE".
//
// Sequence narrative (3 temps, calques sur forced-alignment Whisper — voir PROPS) :
//   (a) ARRIVEE : porteur-mali walk_cycle direction "east", marche de xArrivee
//       -> point de depot. Camera track le sprite (activeCamX = spriteX), zoom 1->2,
//       tilt annule (->8) pour lisibilite gros plan. Modele : AtlasV2S3Scene track Mansa.
//   (b) DEPOT  : le porteur s'arrete (animated=false, faute d'anim crouch), la
//       pile-of-gold.png apparait a son pied (spring-in opacite) et PERSISTE
//       jusqu'a la fin (principe Recette D : l'objet reste apres le depart).
//   (c) DEPART : porteur-mali walk_cycle direction "west" (flip auto via AtlasPixelChar),
//       marche du point de depot -> xSortie. Camera pull-back zoom 2->1. Fade-out du
//       sprite seul ; l'or reste visible.
//
// Carte : reutilise AtlasMercator + atlas-v2-data.json (mercWide), camera frame-driven
//   (transform SVG, drift Ken Burns permanent), exactement comme AtlasV2S3Scene.
//
// IMPORTANT — systeme de coordonnees (voir blocages dans le rapport) :
//   Les paths du json sont projetes en "mercWide" (Tombouctou path = ~[187,672]).
//   PROJECTIONS.mali (geoUtils) renvoie Tombouctou a ~[249,696] — un repere DIFFERENT,
//   decale de la carte rendue. Pour rester ON-MAP sans deviner, on place le point de
//   depot en interpolant le long des caravaneWaypoints EXISTANTS (Tombouctou -> Sahara1),
//   qui sont garantis dans le repere des paths. C'est la seule source non-devinee.

import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasPulseMarker,
  AtlasLabel,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { AtlasSharedDefs } from "../atlas-v2-shared-defs";
import { getFlagFill } from "../atlas-v2-flags";
import { AtlasPixelChar } from "./AtlasPixelChar";

interface SaharanDropBeats {
  // Tous ces frames DOIVENT venir du forced-alignment Whisper (PHASE 1 demarrage).
  // Aucun n'est hardcode independamment de la voix : ce sont des PROPS.
  arrive: number; // mot ou le porteur entre dans le cadre (debut marche east)
  depot: number; // mot "or" / "sel" : le porteur s'arrete et pose la pile
  reprise: number; // mot ou le porteur repart vers l'ouest (debut marche west)
}

interface SaharanDropSceneProps {
  startFrame: number;
  endFrame: number;
  beats: SaharanDropBeats;
}

// Point de depot, exprime comme position 0..1 le long du segment
// caravaneWaypoints Tombouctou -> Sahara1 (repere natif des paths du json).
// 0 = Tombouctou, 1 = Sahara1 (premier relais saharien ~[312,588]).
// 0.55 = bien dans le desert au nord de Tombouctou, vers Taghaza/Taoudenni.
const DROP_T = 0.55;

export const AtlasV2SaharanDropScene: React.FC<SaharanDropSceneProps> = ({
  startFrame,
  endFrame,
  beats,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;

  // ─── POINT DE DEPOT (repere natif mercWide, via waypoints existants) ──────────
  const wp = data.mercWide.caravaneWaypoints;
  const tombouctou = wp.Tombouctou as [number, number]; // [~187, ~672]
  const sahara1 = wp.Sahara1 as [number, number]; // [~312, ~588]
  const dropX = tombouctou[0] + (sahara1[0] - tombouctou[0]) * DROP_T;
  const dropY = tombouctou[1] + (sahara1[1] - tombouctou[1]) * DROP_T;

  // Le porteur arrive depuis le SUD-OUEST (cote Tombouctou) et repart dans cette
  // direction. xArrivee a gauche/bas du depot, xSortie idem.
  const dxIn = dropX - tombouctou[0];
  const dyIn = dropY - tombouctou[1];
  // Entree : a ~1.4x la distance Tombouctou->depot, du cote Tombouctou (ouest/sud).
  const xArrivee = dropX - dxIn * 1.4;
  const yArrivee = dropY - dyIn * 1.4;
  // Sortie : le porteur rebrousse vers l'ouest/sud (retour Tombouctou), encore plus loin.
  const xSortie = dropX - dxIn * 2.2;
  const ySortie = dropY - dyIn * 2.2;

  // ─── PHASES TEMPORELLES (calquees sur les beats voix) ─────────────────────────
  const { arrive, depot, reprise } = beats;
  // Le porteur est visible de l'arrivee jusqu'au fade-out final.
  const spriteFadeStart = endFrame - Math.round(fps * 1.5);
  const spriteFadeEnd = endFrame;

  // Position du porteur :
  //   arrive -> depot : marche east, interpole xArrivee -> dropX
  //   depot  -> reprise : immobile au depot (pose le sac)
  //   reprise -> sortie : marche west, interpole dropX -> xSortie
  const walkOutEnd = spriteFadeStart; // arrive a la sortie au moment du fade
  let porteurX: number;
  let porteurY: number;
  let porteurDir: "east" | "west";
  let porteurAnimated: boolean;

  if (frame < depot) {
    // (a) ARRIVEE — marche east
    const t = interpolate(frame, [arrive, depot], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    porteurX = xArrivee + (dropX - xArrivee) * t;
    porteurY = yArrivee + (dropY - yArrivee) * t;
    porteurDir = "east";
    porteurAnimated = true;
  } else if (frame < reprise) {
    // (b) DEPOT — immobile (pas d'anim crouch dispo -> on fige la marche)
    porteurX = dropX;
    porteurY = dropY;
    porteurDir = "east";
    porteurAnimated = false;
  } else {
    // (c) DEPART — marche west (flip auto via AtlasPixelChar)
    const t = interpolate(frame, [reprise, walkOutEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    porteurX = dropX + (xSortie - dropX) * t;
    porteurY = dropY + (ySortie - dropY) * t;
    porteurDir = "west";
    porteurAnimated = true;
  }

  // ─── PILE-OF-GOLD : spring-in au depot, PERSISTE jusqu'a la fin ───────────────
  const goldSize = 40;
  const goldInProgress = spring({
    frame: frame - depot,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const goldOpacity = frame >= depot ? goldInProgress : 0;
  // Petit "settle" vertical : la pile tombe de quelques px puis se cale.
  const goldDropY = interpolate(goldInProgress, [0, 1], [-6, 0]);

  // ─── CAMERA : drift Ken Burns + track sprite + zoom + tilt annule ─────────────
  const driftX = Math.sin(frame * 0.014) * 16;
  const driftY = Math.cos(frame * 0.011) * 9;

  // Caméra suit le porteur (activeCam = position sprite), recadre sur l'or au depot.
  // Avant depot : suit le porteur. Pendant/apres depot : reste centree sur le depot
  // pour montrer la pile, puis pull-back.
  const camTargetX =
    frame < depot
      ? porteurX
      : frame < reprise
        ? dropX
        : // pendant le depart on garde un peu le depot visible (l'or reste a l'ecran)
          interpolate(frame, [reprise, walkOutEnd], [dropX, (dropX + porteurX) / 2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
  const camTargetY =
    frame < depot ? porteurY : frame < reprise ? dropY : (dropY + porteurY) / 2;

  // Zoom : 1 -> 2 pendant l'arrivee (3s), maintien sur le depot, pull-back 2 -> 1.
  const zoomInEnd = Math.min(arrive + Math.round(fps * 3), depot);
  const pullBackStart = reprise;
  const camZoom = interpolate(
    frame,
    [arrive, zoomInEnd, pullBackStart, endFrame],
    [1.0, 2.0, 2.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tilt continu (suite de la grammaire S2/S3), annule au zoom pour lisibilite sprite.
  const tiltPeak = 24;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const baseTilt = tiltPeak + tiltBreath;
  const effectiveTilt = interpolate(frame, [arrive, zoomInEnd], [baseTilt, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  // ─── PAYS ─────────────────────────────────────────────────────────────────────
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  return (
    <>
      <AtlasSharedDefs />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      <g
        transform={`
          translate(${360 + driftX} ${640 + driftY})
          scale(${camZoom} ${camZoom * scaleY})
          skewX(${skewX})
          translate(${-camTargetX} ${-camTargetY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {/* Autres pays — terracotta uniforme */}
        {otherCountries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {/* Mali — drapeau filigrane + halo dore continu (signature) */}
        {mali && (
          <g>
            <path
              d={mali.d}
              fill={ATLAS_COLORS.maliFill}
              stroke={ATLAS_COLORS.empireOutlineDark}
              strokeWidth="2"
            />
            <path
              d={mali.d}
              fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)}
              opacity={0.4}
              stroke="none"
            />
            <path
              d={mali.d}
              fill="none"
              stroke={ATLAS_COLORS.haloGold}
              strokeWidth="14"
              opacity={0.12}
            />
            <path
              d={mali.d}
              fill="none"
              stroke={ATLAS_COLORS.haloGold}
              strokeWidth="6"
              opacity={0.22}
            />
          </g>
        )}

        {/* Empire 1300 (continuite visuelle des scenes Mansa) */}
        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* === PILE-OF-GOLD : ancrage-pied comme AtlasPixelChar (x-size/2, y-size) === */}
        {/* Rendue AVANT le porteur pour qu'il passe visuellement devant a la sortie. */}
        {frame >= depot && (
          <image
            href={staticFile("atlas-mansa-moussa/assets/pile-of-gold.png")}
            x={dropX - goldSize / 2}
            y={dropY - goldSize + goldDropY}
            width={goldSize}
            height={goldSize}
            opacity={goldOpacity}
            style={{ imageRendering: "pixelated" } as React.CSSProperties}
          />
        )}

        {/* === PORTEUR — walk east (arrivee) -> fige (depot) -> walk west (depart) === */}
        {frame >= arrive && (
          <g
            opacity={interpolate(frame, [spriteFadeStart, spriteFadeEnd], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            <AtlasPixelChar
              charPath="atlas-mansa-moussa/characters/porteur-mali"
              animName="walk_cycle"
              x={porteurX}
              y={porteurY}
              size={52}
              direction={porteurDir}
              animated={porteurAnimated}
              frameCount={6}
              appearAt={arrive}
            />
          </g>
        )}

        {/* Marqueur + label du point de depot (optionnel, aide la lecture) */}
        <AtlasPulseMarker
          coord={[dropX, dropY]}
          beatStart={depot}
          color={ATLAS_COLORS.empireGold}
        />
        <AtlasLabel
          coord={[dropX, dropY]}
          text="TAGHAZA"
          appearAt={depot + 6}
          offsetY={-36}
          fontSize={20}
        />
      </g>

      {/* === SFX (en <Sequence>, jamais frame===X) — chemins VERIFIES sur disque ===
          footsteps reel : public/_shared/sfx/sfx-footsteps.mp3 (marche arrivee).
          Le "drop d'or" n'a pas de SFX dedie dans la sfxtheque -> non ajoute (ne pas
          inventer un chemin casse). A enrichir si un SFX coins est genere. */}
      <Sequence from={arrive} durationInFrames={Math.max(1, depot - arrive)}>
        <Audio src={staticFile("_shared/sfx/sfx-footsteps.mp3")} volume={0.4} />
      </Sequence>
    </>
  );
};

// AtlasV2ConfrontationScene — "La Rencontre" (confrontation 2 sprites face a face)
// =============================================================================
// 2e beat produit via le systeme Atlas (test 2026-06-04). Eprouve DEUX parties :
//   1) Couche PixelLab : DEUX sprites convergents en SENS OPPOSES simultanes.
//      Soldat A marche "east" (frames east/), Soldat B marche "west" (frames west/
//      NATIVES, ZERO flip). C'est le cas le plus dur pour le fix moonwalk : si B
//      (venu de droite) marche du bon pied vers la gauche sans reculer, le fix
//      "frames natives, pas de flip" est prouve sur 2 sprites opposes.
//   2) Pattern Spotlight Insert (signature GHANA, Beat1Setup.tsx:409-528) : au
//      face-a-face, la carte se dim et un encart chiffre "rapport de forces"
//      surgit (deux nombres + symbole, plaque parchemin double-cadre + halo), puis
//      retour carte avec les 2 sprites tenus.
//
// Grammaire : reutilise la meme camera frame-driven que AtlasV2SaharanDropScene
//   (transform compose drift Ken Burns + zoom + tilt fausse-3D annule au gros plan).
//   Anti-clonage : meme VOCABULAIRE de mouvement, scene NEUVE (2 acteurs convergents,
//   pas de drop d'objet ; insert = chiffres face a face, pas sel/or).
//
// COORDONNEES : point de rencontre = Sahara1 [312,588] du json (repere natif mercWide
//   garanti, comme Saharan Drop). On NE PASSE PAS par geoUtils (repere different).

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
  AtlasCartouche,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { AtlasSharedDefs } from "../atlas-v2-shared-defs";
import { getFlagFill } from "../atlas-v2-flags";
import { AtlasPixelChar } from "./AtlasPixelChar";

interface ConfrontationBeats {
  // Tous ces frames DOIVENT venir du forced-alignment Whisper en prod (PROPS).
  approach: number; // les deux soldats entrent et marchent l'un vers l'autre
  clash: number; // ils s'arretent face a face (idle) + bump impact
  insert: number; // la carte se dim, l'encart "rapport de forces" surgit
  insertOut: number; // l'encart se retire, retour carte
}

interface ConfrontationSceneProps {
  startFrame: number;
  endFrame: number;
  beats: ConfrontationBeats;
  // Rapport de forces affiche dans l'insert (texte libre).
  forceA?: string;
  forceB?: string;
  labelA?: string;
  labelB?: string;
}

export const AtlasV2ConfrontationScene: React.FC<ConfrontationSceneProps> = ({
  startFrame,
  endFrame,
  beats,
  forceA = "8 000",
  forceB = "30 000",
  labelA = "SOSSO",
  labelB = "MALI",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;
  const { approach, clash, insert, insertOut } = beats;

  // ─── POINT DE RENCONTRE (repere natif mercWide via waypoints) ─────────────────
  const wp = data.mercWide.caravaneWaypoints;
  const niani = wp.Niani as [number, number]; // [~139, ~726]  (sud-ouest)
  const sahara1 = wp.Sahara1 as [number, number]; // [~312, ~588]  point de rencontre
  const sahara2 = wp.Sahara2 as [number, number]; // [~408, ~556]  (nord-est)

  const meetX = sahara1[0];
  const meetY = sahara1[1];
  const gap = 26; // demi-ecart entre les deux soldats a l'arret

  // Soldat A vient du SUD-OUEST (cote Niani) → marche "east", s'arrete a gauche du point.
  // Facteur de distance reduit (1.05 au lieu de 1.5) : avec un zoom resserre, des points
  // de depart plus proches gardent la convergence LISIBLE des le debut (cf. still f60).
  const dirAx = meetX - niani[0];
  const dirAy = meetY - niani[1];
  const aStartX = meetX - dirAx * 1.05;
  const aStartY = meetY - dirAy * 1.05;
  const aStopX = meetX - gap;
  const aStopY = meetY + 4; // tres leger decalage vertical pour eviter la superposition pixel

  // Soldat B vient du NORD-EST (cote Sahara2) → marche "west", s'arrete a droite du point.
  const dirBx = meetX - sahara2[0];
  const dirBy = meetY - sahara2[1];
  const bStartX = meetX - dirBx * 1.05;
  const bStartY = meetY - dirBy * 1.05;
  const bStopX = meetX + gap;
  const bStopY = meetY - 4;

  // ─── POSITIONS DES SPRITES ────────────────────────────────────────────────────
  // B entre avec un leger decalage (+8f) pour un mouvement non-synchrone (vivant).
  const B_DELAY = 8;

  const tA = interpolate(frame, [approach, clash], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tB = interpolate(frame, [approach + B_DELAY, clash], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aX = aStartX + (aStopX - aStartX) * tA;
  const aY = aStartY + (aStopY - aStartY) * tA;
  const bX = bStartX + (bStopX - bStartX) * tB;
  const bY = bStartY + (bStopY - bStartY) * tB;

  const aMoving = frame < clash;
  const bMoving = frame < clash;

  // ─── CAMERA : drift + zoom resserre sur le point + tilt annule au gros plan ────
  const driftX = Math.sin(frame * 0.014) * 16;
  const driftY = Math.cos(frame * 0.011) * 9;

  // Cible : on suit le barycentre des deux soldats pendant l'approche, puis on
  // verrouille sur le point de rencontre au clash.
  const camTargetX =
    frame < clash ? (aX + bX) / 2 : meetX;
  const camTargetY =
    frame < clash ? (aY + bY) / 2 : meetY;

  // Zoom 1.0 → 2.0 pendant l'approche, tenu au clash/insert, leger pull-back a la fin.
  const zoomInEnd = clash;
  const camZoom = interpolate(
    frame,
    [approach, zoomInEnd, insertOut, endFrame],
    [1.3, 2.6, 2.6, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tilt fausse-3D (grammaire S2/S3), annule (→8) au zoom pour lisibilite pixel.
  const tiltPeak = 24;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const baseTilt = tiltPeak + tiltBreath;
  const effectiveTilt = interpolate(frame, [approach, zoomInEnd], [baseTilt, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  // ─── BUMP IMPACT au clash (coup de poing, grammaire Mansa S4) ─────────────────
  const bumpDur = 12;
  const bumpT = interpolate(frame, [clash, clash + bumpDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bump = frame >= clash && frame < clash + bumpDur ? 1 + 0.05 * Math.sin(bumpT * Math.PI) : 1;

  // ─── SPOTLIGHT INSERT (rapport de forces chiffre) ─────────────────────────────
  const insertSpring = spring({
    frame: frame - insert,
    fps,
    config: { damping: 18, stiffness: 140 },
  });
  const insertOpacity = interpolate(
    frame,
    [insert, insert + 8, insertOut - 12, insertOut],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dimOpacity = interpolate(
    frame,
    [insert, insert + 12, insertOut - 12, insertOut],
    [0, 0.72, 0.72, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── FADE global (continuite d'etat inter-beats) ──────────────────────────────
  const globalFade = interpolate(
    frame,
    [startFrame, startFrame + 15, endFrame - 12, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── PAYS ─────────────────────────────────────────────────────────────────────
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  return (
    <g opacity={globalFade}>
      <AtlasSharedDefs />
      {/* Halo dore local pour le spotlight insert (independant des defs Ghana) */}
      <defs>
        <radialGradient id="confrontGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} stopOpacity="0.55" />
          <stop offset="70%" stopColor={ATLAS_COLORS.empireGold} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      <g
        transform={`
          translate(${360 + driftX} ${640 + driftY})
          scale(${camZoom * bump} ${camZoom * scaleY * bump})
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

        {/* Mali — drapeau filigrane + halo dore (signature continuite Mansa) */}
        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)} opacity={0.4} stroke="none" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="14" opacity={0.12} />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="6" opacity={0.22} />
          </g>
        )}

        {/* Empire 1300 (continuite visuelle) */}
        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* === SOLDAT A — marche "east" (frames east natives) depuis le sud-ouest === */}
        {frame >= approach && (
          <AtlasPixelChar
            charPath="atlas-mansa-moussa/characters/soldat-mali"
            animName="walk_cycle"
            x={aX}
            y={aY}
            size={50}
            direction="east"
            animated={aMoving}
            frameCount={6}
            appearAt={approach}
          />
        )}

        {/* === SOLDAT B — marche "west" (frames west NATIVES, zero flip) depuis le NE === */}
        {frame >= approach + B_DELAY && (
          <AtlasPixelChar
            charPath="atlas-mansa-moussa/characters/soldat-mali"
            animName="walk_cycle"
            x={bX}
            y={bY}
            size={50}
            direction="west"
            animated={bMoving}
            frameCount={6}
            appearAt={approach + B_DELAY}
          />
        )}
      </g>

      {/* === CARTOUCHE titre (haut, y<=320) — apparait au clash === */}
      <AtlasCartouche
        text="FACE A FACE"
        appearAt={clash}
        disappearAt={insert}
        x={360}
        y={220}
        fontSize={40}
      />

      {/* === SPOTLIGHT INSERT — rapport de forces chiffre (pattern GHANA) === */}
      {frame >= insert && insertOpacity > 0.01 && (
        <>
          {/* Dim background (assombrit la carte sans la cacher) */}
          <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.empireOutlineDark} opacity={dimOpacity} pointerEvents="none" />

          <g transform={`translate(360 640) scale(${0.85 + 0.15 * insertSpring})`} opacity={insertOpacity}>
            {/* Halo dore */}
            <circle cx="0" cy="0" r="300" fill="url(#confrontGlow)" />

            {/* Boite parchemin double-cadre */}
            <rect x="-280" y="-150" width="560" height="300" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireGold} strokeWidth="4" rx="10" />
            <rect x="-270" y="-140" width="540" height="280" fill="none" stroke={ATLAS_COLORS.textInk} strokeWidth="1.5" rx="6" opacity="0.75" />

            {/* Camp A (gauche) */}
            <text x="-150" y="-40" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="26" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="3">
              {labelA}
            </text>
            <text x="-150" y="45" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="64" fontWeight="700" fill={ATLAS_COLORS.land}>
              {forceA}
            </text>

            {/* Symbole confrontation */}
            <text x="0" y="20" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="56" fontWeight="700" fill={ATLAS_COLORS.empireGold}>
              ⇌
            </text>

            {/* Camp B (droite) */}
            <text x="150" y="-40" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="26" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="3">
              {labelB}
            </text>
            <text x="150" y="45" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="64" fontWeight="700" fill={ATLAS_COLORS.empireGold}>
              {forceB}
            </text>

            {/* Sous-titre */}
            <text x="0" y="115" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontStyle="italic" fill={ATLAS_COLORS.textInk} letterSpacing="2">
              le rapport de forces
            </text>
          </g>
        </>
      )}

      {/* === SFX footsteps pendant l'approche (en <Sequence>, jamais frame===X) === */}
      <Sequence from={approach} durationInFrames={Math.max(1, clash - approach)}>
        <Audio src={staticFile("_shared/sfx/sfx-footsteps.mp3")} volume={0.4} />
      </Sequence>
    </g>
  );
};

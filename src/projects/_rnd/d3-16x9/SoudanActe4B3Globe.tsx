// ACTE 4 — BEAT 3 "Le miroir egyptien" (mode d'action : renseignement + coordination) — GLOBE D3.
//
// REMPLACE SoudanActe4B3Force.tsx (schema d3-force abstrait, REJETE par Aziz : rupture de registre
// visuel, on quittait le globe/parchemin pour un graphe de noeuds). Ce beat est refait EXACTEMENT
// dans la grammaire du Beat 1 (Moscou -> SAF) : Modele = SoudanActe4B1B2Globe.tsx + SoudanActe4B6Globe.tsx.
//
// CE QUE RACONTE LE BEAT : "Et la Russie n'est pas seule a se rapprocher de l'armee soudanaise. Au
// nord du Soudan, l'Egypte ne se contente plus de regarder. Son soutien passe surtout par le
// renseignement. Elle coordonne aussi avec les generaux [du SAF]." -> L'EGYPTE REJOINT le camp SAF
// (comme la Russie au B1). Un soutien de plus qui s'accumule sur le SAF.
//
// Grammaire (identique B1) : Egypte se remplit de son DRAPEAU (GlobeFlagFill "eg") a "l'Egypte ne se
// contente plus de regarder" + un ARC Le Caire -> jeton SAF se trace (windingPathD, occlusion 3D) +
// le halo/jeton SAF SE RENFORCE en 2 paliers (renseignement puis coordination).
// Le flux Russie->SAF (deja etabli B1-B2) reste visible en fond DISCRET (continuite des acteurs,
// cf brief) mais le focus visuel est le nouveau fait : Egypte -> SAF.
//
// Cadrage : region Soudan-Egypte-mer Rouge (raccord naturel depuis fin B2 sur Port-Soudan/mer Rouge,
// et vers B4 qui est un motif Nil Egypte-Soudan). Camera douce, meme discipline CAM continue que B1/B6.
//
// ZERO sous-titre bas d'ecran (regle Aziz : bas de cadre reserve aux SOURCES uniquement ; ce beat n'a
// pas de source -> zero texte bas d'ecran). La voix + la densite visuelle du globe portent le sens.
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  featureByName,
  orthoAt,
  pathOf,
  isVisible as isVisibleGeo,
} from "./globeGeo";
import { GEO, windingPathD, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill, Medallion, SAF_BLUE } from "./SoudanActe3GlobeProto16x9";
import { BEAT3 } from "../../warmap/soudan-acte4/soudanActe4Timing";

const t = THEMES.mixte;
const FPS = 30;

// Duree = portion Beat 3 de l'audio p3 (0 -> BEAT3.end relatif au debut de p3) + petite queue de
// raccord vers B4 (meme logique TAIL que B1B2 -> B3, B6 -> Acte5).
const TAIL = 18;
export const ACTE4_B3_FRAMES = (BEAT3.end - BEAT3.start) + TAIL;

// --- Jalons narratifs LOCAUX (relatifs au debut du beat 3) ---
const T = {
  start: 0,
  egypteNommee: BEAT3.egypteNommee - BEAT3.start, // "l'Egypte ne se contente plus de regarder" — drapeau + arc se noue
  renseignement: BEAT3.renseignement - BEAT3.start, // "passe surtout par le renseignement" — 1er palier halo SAF
  coordonne: BEAT3.coordonne - BEAT3.start, // "Elle coordonne aussi avec les generaux" — 2e palier halo SAF
  end: BEAT3.end - BEAT3.start,
};

const EGYPTE: LonLat = GEO.cairo;
const SAF_TOKEN: LonLat = GEO.safToken;
const MOSCOU: LonLat = GEO.moscou;

// --- Camera CONTINUE sur toute la duree du beat, meme discipline que B1/B2/B6 (1 seul interpolate
// via camAt, jamais de segmentation if/else). Raccord ENTREE = etat de sortie exact du B2 (Port-Soudan
// / mer Rouge). Cadrage Egypte-Soudan-mer Rouge -> raccord SORTIE prepare le motif Nil du B4.
function buildB3Cam(): CamKey[] {
  return [
    // ENTREE : raccord EXACT depuis la fin du B2 (mer Rouge/Soudan, cf buildB1B2Cam derniere keyframe).
    { frame: T.start, lon: 35.5, lat: 20.5, scaleMul: 2.75 },
    // remonte doucement vers le nord pour cadrer l'Egypte ET le Soudan ensemble avant qu'elle soit nommee.
    { frame: T.egypteNommee - 20, lon: 33, lat: 24, scaleMul: 2.1 },
    // "l'Egypte ne se contente plus de regarder" : cadre Le Caire (nord) + Khartoum (sud) ensemble,
    // assez large pour lire l'arc complet.
    { frame: T.egypteNommee, lon: 32, lat: 23, scaleMul: 1.85 },
    // "renseignement" : tient large, l'arc se lit et le halo SAF commence a se renforcer.
    { frame: T.renseignement, lon: 32, lat: 22, scaleMul: 1.9 },
    // "coordonne avec les generaux" : leger recentrage vers le SAF/Khartoum (2e palier halo).
    { frame: T.coordonne, lon: 31.5, lat: 19, scaleMul: 2.15 },
    // SORTIE : resserre vers le Soudan/Nil — prepare le raccord B4 (motif Nil Egypte-Soudan).
    { frame: ACTE4_B3_FRAMES, lon: 31, lat: 18, scaleMul: 2.3 },
  ];
}

const CAM = buildB3Cam();

export const SoudanActe4B3Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(() => orthoAt(rotLambda, rotLat).scale(globeR), [rotLambda, rotLat, globeR]);
  const path = useMemo(() => pathOf(proj), [proj]);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const egypteFeature = useMemo(() => featureByName("Egypt"), []);

  const cx = W / 2;
  const cy = H / 2;

  // Egypte se remplit de son drapeau des "l'Egypte ne se contente plus de regarder".
  const egypteReveal = interpolate(frame, [T.egypteNommee, T.egypteNommee + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arc Le Caire -> SAF (nouveau soutien) : se trace a "l'Egypte nommee", tient ensuite.
  const arcProg = interpolate(frame, [T.egypteNommee, T.egypteNommee + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcOp = interpolate(frame, [T.egypteNommee, T.egypteNommee + 18], [0, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcPulse = interpolate(frame, [T.egypteNommee + 30, T.egypteNommee + 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flowOffset = (frame * 2) % 40;

  // Halo/jeton SAF qui SE RENFORCE en 2 paliers (renseignement -> coordination) — le camp SAF se
  // consolide visuellement (echo direct du texte).
  const safRenforce = interpolate(
    frame,
    [T.egypteNommee, T.egypteNommee + 20, T.renseignement, T.renseignement + 20, T.coordonne, T.coordonne + 20],
    [0.4, 0.55, 0.55, 0.78, 0.78, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const safMedallionScale = interpolate(frame, [T.egypteNommee - 10, T.egypteNommee + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flux Russie -> SAF (deja etabli B1-B2) : reste visible en FOND DISCRET pour la continuite des
  // acteurs (brief), opacite basse — le focus reste le nouveau fait Egypte -> SAF.
  const russieFlowOp = 0.3;

  // Fondu de sortie sur les dernieres frames (raccord propre vers B4).
  const exitFade = interpolate(frame, [ACTE4_B3_FRAMES - TAIL, ACTE4_B3_FRAMES], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pEgypte = projectPoint(proj, EGYPTE, visible);
  const pSAF = projectPoint(proj, SAF_TOKEN, visible);
  const pMoscou = projectPoint(proj, MOSCOU, visible);

  // Terminateur nuit (discret), meme logique que B1/B6 : derive lente sur toute la duree.
  const sunLon = interpolate(frame, [0, ACTE4_B3_FRAMES], [22, 5]);
  const nightCenter: LonLat = [sunLon + 180, -15];
  const nightPt = visible(nightCenter) ? proj(nightCenter) : null;

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <Sequence from={0} durationInFrames={ACTE4_B3_FRAMES} premountFor={FPS}>
        <Audio
          src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p3.mp3")}
          endAt={Math.max(1, BEAT3.end - BEAT3.start)}
        />
      </Sequence>

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${t.oceanOuter} 0%, ${t.bg} 78%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="a4b3ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="a4b3atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="a4b3night" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04060d" stopOpacity={0.55} />
            <stop offset="70%" stopColor="#04060d" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#04060d" stopOpacity={0} />
          </radialGradient>
          <clipPath id="a4b3clip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="a4b3glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#a4b3atmo)" />
        <circle cx={cx} cy={cy} r={globeR} fill="url(#a4b3ocean)" />

        <g clipPath="url(#a4b3clip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={t.grat} strokeWidth={0.6} opacity={t.gratOpacity} />

          {features.map((f, i) => {
            const isSudan = f.properties.name === "Sudan" || f.properties.name === "S. Sudan";
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={isSudan ? t.sudanFill : t.land}
                stroke={isSudan ? t.sudanStroke : t.landStroke}
                strokeWidth={isSudan ? 0.9 : t.borderWidth}
                strokeOpacity={t.borderOpacity}
              />
            );
          })}

          {nightPt && <circle cx={nightPt[0]} cy={nightPt[1]} r={globeR * 1.05} fill="url(#a4b3night)" />}

          {/* Egypte se remplit de son drapeau — le "troisieme" (apres Moscou) rejoint le camp SAF. */}
          {egypteFeature && egypteReveal > 0.01 && (
            <GlobeFlagFill
              feature={egypteFeature}
              proj={proj}
              path={path}
              flagCode="eg"
              reveal={egypteReveal}
              glow="#7fae6a"
            />
          )}

          {/* FOND DISCRET : flux Russie -> SAF deja etabli (B1-B2), opacite basse — continuite des
              acteurs sans polluer le focus du beat (l'Egypte). */}
          {pMoscou && pSAF && (
            <path
              d={windingPathD(proj, path, MOSCOU, SAF_TOKEN, 1, 1.8, 1)}
              fill="none"
              stroke={SAF_BLUE}
              strokeWidth={2.2}
              strokeOpacity={russieFlowOp * exitFade}
              strokeLinecap="round"
            />
          )}

          {/* ARC Le Caire -> SAF : le nouveau soutien egyptien qui se noue. */}
          {arcProg > 0.01 && (
            <g opacity={exitFade}>
              <path
                d={windingPathD(proj, path, EGYPTE, SAF_TOKEN, arcProg, -1.4, 1)}
                fill="none"
                stroke="#7fae6a"
                strokeWidth={3.6}
                strokeOpacity={arcOp}
                strokeLinecap="round"
              />
              {arcProg > 0.96 && (
                <path
                  d={windingPathD(proj, path, EGYPTE, SAF_TOKEN, 1, -1.4, 1)}
                  fill="none"
                  stroke="#a8d090"
                  strokeWidth={4}
                  strokeOpacity={0.75}
                  strokeDasharray="4 34"
                  strokeDashoffset={-flowOffset}
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* Jeton SAF (medaillon) qui SE RENFORCE — le camp SAF se consolide a l'arrivee du soutien
              egyptien (2 paliers : renseignement puis coordination). */}
          {pSAF && safMedallionScale > 0.01 && (
            <Medallion
              x={pSAF.x}
              y={pSAF.y}
              color={SAF_BLUE}
              label="S"
              scale={safMedallionScale * (0.7 + 0.3 * safRenforce) * exitFade}
              pulse={arcPulse}
              t={t as any}
            />
          )}

          {/* Label Le Caire */}
          {pEgypte && egypteReveal > 0.01 && (
            <text
              x={pEgypte.x}
              y={pEgypte.y - 20}
              fill={t.labelFill}
              fontSize={22}
              fontFamily="Georgia, serif"
              fontWeight={700}
              textAnchor="middle"
              stroke={t.labelStroke}
              strokeWidth={0.6}
              opacity={egypteReveal * exitFade}
            >
              Le Caire
            </text>
          )}
        </g>

        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* Pas de sous-titre bas de cadre (retour Aziz : bas d'ecran reserve aux SOURCES uniquement ;
          ce beat n'a pas de source -> zero texte). La voix off + la densite visuelle du globe portent
          le sens, meme discipline que B6. */}
    </AbsoluteFill>
  );
};

/**
 * ZambiaTraitementB — GABARIT DE CHOIX, traitement B : registre DOCUMENTAIRE CLAIR.
 *
 * Meme donnee, meme chronologie, meme geographie que le traitement A.
 * SEULE la direction artistique change : c'est ce qui rend le choix lisible pour le client
 * (cf. GABARIT DE CHOIX, PILIERS-B2B.md — le client tranche un registre, pas un contenu).
 *
 * Registre B = fond ivoire/papier, provinces gris-chaud, points terre de sienne, traits fins.
 */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  getZambiaGeo,
  semisDansProvince,
  REPARTITION,
  W,
  H,
  ZAMBIA_GEOJSON,
  type ZambiaFeatureCollection,
  type ZambiaGeo,
} from "./zambiaGeo";

export const ZAMBIA_B_FRAMES = 300; // 10 s a 30 fps

const FOND = "#f2ece0";
const PROVINCE_FILL = "#e2d9c8";
const PROVINCE_FILL_ACTIVE = "#d6c9b0";
const TRAIT = "#a89880";
const SIENNE = "#a8532a";
const ENCRE = "#2e2a24";

const F_CARTE = 0;
const F_1995 = 60;
const F_TRANSITION = 130;
const F_2005 = 210;

export const ZambiaTraitementB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [geo, setGeo] = useState<ZambiaGeo | null>(null);
  const [handle] = useState(() => delayRender("ZambiaB: chargement du GeoJSON Zambie"));

  useEffect(() => {
    fetch(staticFile(ZAMBIA_GEOJSON))
      .then((r) => r.json())
      .then((fc: ZambiaFeatureCollection) => {
        setGeo(getZambiaGeo(fc));
        continueRender(handle);
      })
      .catch((e) => {
        console.error("ZambiaB: GeoJSON illisible", e);
        continueRender(handle);
      });
  }, [handle]);

  if (!geo) return <AbsoluteFill style={{ backgroundColor: FOND }} />;

  const progression = interpolate(frame, [F_TRANSITION, F_2005], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const anneeAffichee = frame < F_TRANSITION ? 1995 : Math.round(interpolate(frame, [F_TRANSITION, F_2005], [1995, 2005], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path
          d={geo.outlineD}
          fill={PROVINCE_FILL}
          stroke={TRAIT}
          strokeWidth={1}
          opacity={interpolate(frame, [F_CARTE, F_CARTE + 40], [0, 1], {
            extrapolateRight: "clamp",
          })}
        />

        {geo.briefProvinces.map((prov, i) => {
          const estDepart = prov.briefOrder === 1;
          const seuil = estDepart ? 0 : (i - 1) / (geo.briefProvinces.length - 1);
          const actif = estDepart ? frame >= F_1995 : progression > seuil;

          const apparition = spring({
            frame: frame - (estDepart ? F_1995 : F_TRANSITION + seuil * (F_2005 - F_TRANSITION)),
            fps,
            config: { damping: 200 },
            durationInFrames: 30,
          });
          const a = actif ? apparition : 0;

          const cible = REPARTITION[2005][prov.name] ?? 0;
          const depart = REPARTITION[1995][prov.name] ?? 0;
          const nbPoints = Math.round(
            estDepart ? interpolate(progression, [0, 1], [depart, cible]) : cible * a
          );
          const points = semisDansProvince(prov, nbPoints);

          return (
            <g key={prov.name}>
              <path
                d={prov.d}
                fill={PROVINCE_FILL_ACTIVE}
                stroke={TRAIT}
                strokeWidth={1.6}
                opacity={a}
              />
              {points.map((p, k) => {
                const retard = (k / Math.max(1, nbPoints)) * 18;
                const pa = interpolate(
                  frame - (estDepart ? F_1995 : F_TRANSITION) - retard,
                  [0, 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <circle key={k} cx={p.x} cy={p.y} r={3.2} fill={SIENNE} opacity={pa * 0.88} />
                );
              })}
            </g>
          );
        })}

        {/* Etiquettes en DERNIERE passe : sinon une province dessinee apres
            recouvre le texte d'une province precedente (constate : "LUAPULA"
            tronque par Northern). */}
        {geo.briefProvinces.map((prov, i) => {
          const estDepart = prov.briefOrder === 1;
          const seuil = estDepart ? 0 : (i - 1) / (geo.briefProvinces.length - 1);
          const actif = estDepart ? frame >= F_1995 : progression > seuil;
          const apparition = spring({
            frame: frame - (estDepart ? F_1995 : F_TRANSITION + seuil * (F_2005 - F_TRANSITION)),
            fps,
            config: { damping: 200 },
            durationInFrames: 30,
          });
          const a = actif ? apparition : 0;
          return (
<text
              key={prov.name}
                x={prov.cx}
                y={prov.cy - 4}
                fill={ENCRE}
                fontSize={25}
                fontFamily="Source Sans 3, sans-serif"
                fontWeight={600}
                textAnchor="middle"
                stroke={FOND}
                strokeWidth={5}
                paintOrder="stroke"
                strokeLinejoin="round"
                opacity={a * 0.8}
                letterSpacing={1.4}
              >
                {prov.name.toUpperCase()}
              </text>
          );
        })}
      </svg>

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 150,
            opacity: interpolate(frame, [F_1995 - 20, F_1995], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              color: ENCRE,
              fontSize: 132,
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 700,
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            {anneeAffichee}
          </div>
          <div
            style={{
              color: ENCRE,
              fontSize: 30,
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 400,
              letterSpacing: 3,
              marginTop: 18,
              opacity: 0.68,
            }}
          >
            VOLONTAIRES EN ZAMBIE
          </div>
          <div
            style={{ width: 92, height: 3, backgroundColor: SIENNE, marginTop: 22 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

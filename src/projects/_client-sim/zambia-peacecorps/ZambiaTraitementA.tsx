/**
 * ZambiaTraitementA — GABARIT DE CHOIX, traitement A : registre SOUVERAIN SOMBRE.
 *
 * Brief client (Peace Corps, Upwork 2026-08-21) : evolution des volontaires en Zambie.
 * Extrait 1995 -> 2005, 7 provinces nommees, AUCUNE autre visible.
 * Style demande : "documentaire premium Netflix/NatGeo, epure, pas d'effets tape-a-l'oeil".
 *
 * Registre A = notre fond #16213a, provinces sombres, points ambre qui s'allument.
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

export const ZAMBIA_A_FRAMES = 300; // 10 s a 30 fps

const FOND = "#16213a";
const PROVINCE_FILL = "#1e2d4d";
const PROVINCE_FILL_ACTIVE = "#2a4066";
const TRAIT = "#43608f";
const AMBRE = "#e2b33c";
const TEXTE = "#f2ede3";

// Chronologie (30 fps) : la carte s'installe, 1995 s'allume, progression vers 2005.
const F_CARTE = 0;
const F_1995 = 60;
const F_TRANSITION = 130;
const F_2005 = 210;

export const ZambiaTraitementA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [geo, setGeo] = useState<ZambiaGeo | null>(null);
  const [handle] = useState(() => delayRender("ZambiaA: chargement du GeoJSON Zambie"));

  useEffect(() => {
    fetch(staticFile(ZAMBIA_GEOJSON))
      .then((r) => r.json())
      .then((fc: ZambiaFeatureCollection) => {
        setGeo(getZambiaGeo(fc));
        continueRender(handle);
      })
      .catch((e) => {
        console.error("ZambiaA: GeoJSON illisible", e);
        continueRender(handle);
      });
  }, [handle]);

  if (!geo) return <AbsoluteFill style={{ backgroundColor: FOND }} />;

  // Progression 1995 -> 2005 : pilote l'apparition des provinces et la densite des points.
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
        <defs>
          <filter id="glowA" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Contour national : le pays entier reste juste geographiquement. */}
        <path
          d={geo.outlineD}
          fill={PROVINCE_FILL}
          stroke={TRAIT}
          strokeWidth={1.1}
          opacity={interpolate(frame, [F_CARTE, F_CARTE + 40], [0, 0.55], {
            extrapolateRight: "clamp",
          })}
        />

        {/* Les 7 provinces du brief. Aucune autre n'est dessinee : la donnee ne les expose pas. */}
        {geo.briefProvinces.map((prov, i) => {
          // Luapula (ordre 1) s'allume des 1995 ; les 6 autres arrivent avec la progression.
          const estDepart = prov.briefOrder === 1;
          const seuil = estDepart ? 0 : (i - 1) / (geo.briefProvinces.length - 1);
          const actif = estDepart
            ? frame >= F_1995
            : progression > seuil;

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
                strokeWidth={1.4}
                opacity={a * 0.9}
              />
              {points.map((p, k) => {
                // Chaque point s'allume avec un leger decalage : le reseau se peuple, il n'apparait pas d'un bloc.
                const retard = (k / Math.max(1, nbPoints)) * 18;
                const pa = interpolate(
                  frame - (estDepart ? F_1995 : F_TRANSITION) - retard,
                  [0, 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <circle
                    key={k}
                    cx={p.x}
                    cy={p.y}
                    r={3.4}
                    fill={AMBRE}
                    opacity={pa * 0.92}
                    filter="url(#glowA)"
                  />
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
                fill={TEXTE}
                fontSize={26}
                fontFamily="Source Sans 3, sans-serif"
                fontWeight={600}
                textAnchor="middle"
                stroke={FOND}
                strokeWidth={5}
                paintOrder="stroke"
                strokeLinejoin="round"
                opacity={a * 0.82}
                letterSpacing={1.5}
              >
                {prov.name.toUpperCase()}
              </text>
          );
        })}
      </svg>

      {/* Cartouche annee : le chiffre qui porte la lecture. */}
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
              color: AMBRE,
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
              color: TEXTE,
              fontSize: 30,
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 400,
              letterSpacing: 3,
              marginTop: 18,
              opacity: 0.86,
            }}
          >
            VOLONTAIRES EN ZAMBIE
          </div>
          <div
            style={{
              width: 92,
              height: 3,
              backgroundColor: AMBRE,
              marginTop: 22,
              opacity: 0.75,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ProtoTroisGisementsInserts — PROTOTYPE R&D (2026-08-15), JETABLE.
//
// But : tester N INSERTS SIMULTANÉS sur une carte (jamais fait — les 4 inserts précédents étaient
// tous uniques et larges). Question posée par Aziz : est-ce qu'on lit VRAIMENT trois gisements
// distincts, ou est-ce que trois vignettes deviennent une bouillie ?
//
// Sujet : les 3 champs offshore du Sénégal, déjà traités en jetons SVG seuls dans
// SceneGisementsV3.tsx (Mapbox, caméra qui plonge successivement sur chacun). Ici on garde les
// jetons ET on rattache à chacun un mini-insert vidéo — en UN SEUL plan large, pour que la
// comparaison soit immédiate au lieu d'être mémorisée.
//
// ⭐ Décision de fond (Aziz, 2026-08-15) : on montre le LIEU, pas la matière. Une matière (gaz,
// pétrole) donnerait trois vignettes de fluide qui se ressemblent ; trois INSTALLATIONS se
// distinguent par leur silhouette avant même la couleur. Vérifié sur sources réelles :
//   - Sangomar : FPSO "Léopold Sédar Senghor" (VLCC converti, ancré), eau profonde ~780 m
//   - GTA      : FLNG "Gimi" abritée derrière un HUB BRISE-LAMES en dur, ~10 km au large, 30 m
//   - Yakaar   : JAMAIS DÉVELOPPÉ — une bouée sur une mer vide. Le vide EST l'information.
//
// ⚠️ PROTOTYPE : ne pas importer depuis un Acte. La scène d'origine SceneGisementsV3 reste valide.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Loop, staticFile, interpolate, useCurrentFrame } from "remotion";
import senegalGeo from "./senegalGisementsGeo.json";

export const PROTO_TROIS_GISEMENTS_FRAMES = 360; // 12s @30fps

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

const CYAN = "#2CD7FF";
const GOLD = "#D9A13B";
const DIM_MAX = 0.22; // plus bas que les 0.40 du proto conduite : ici la carte est le LIANT entre
// 3 inserts (elle porte les 3 ancrages), elle ne peut pas reculer autant qu'avec un insert unique.

// Durées réelles des clips : 124 frames @24fps = 5.17s. On boucle sous cette durée pour ne jamais
// toucher la dernière frame (garde-fou "écran noir en fin de clip", documenté 2x sur H3).
const CLIP_LOOP = Math.floor(5.0 * FPS);

// ===== Géo réelle des 3 champs (lon/lat) — reprises de gazoducGeo.ts / SceneGisementsV3.tsx =====
const SANGOMAR: [number, number] = [-16.95, 14.0];
const GTA: [number, number] = [-17.05, 15.9];
const YAKAAR: [number, number] = [-17.3, 14.9];

// Projection équirectangulaire locale simple : suffisante et déterministe pour un cadrage fixe sur
// une fenêtre géographique étroite (~3 degrés). On ne dépend pas de Mapbox pour un proto de forme.
const LON0 = -18.6, LON1 = -15.2;
const LAT0 = 16.9, LAT1 = 12.9;
const projX = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * W;
const projY = (lat: number) => ((LAT0 - lat) / (LAT0 - LAT1)) * H;

type Field = {
  key: string;
  label: string;
  sub: string;
  lonlat: [number, number];
  clip: string;
  // position du cadre en fraction d'écran — la HAUTEUR est calculée depuis le ratio du clip,
  // jamais fixée à la main (cf CARD_H ci-dessous).
  card: { x: number; y: number; w: number };
  active: boolean; // false = pas d'installation (Yakaar)
};

// ⭐⭐ Le cadre se DÉDUIT du ratio réel du clip — on ne fixe plus une hauteur arbitraire.
// V3 imposait h=0.245 pour w=0.30, soit une zone vidéo en 2.64:1 pour un clip en 16:9 :
// `objectFit: cover` rognait alors 32% de chaque clip (haut + bas) — mesuré. Un tiers de l'image
// générée ne s'affichait jamais (ciel de GTA, une partie de la digue).
const CLIP_AR = 864 / 480; // 16:9, format de sortie H3
const PAD_FRAC = 0.016; // padding intérieur du cadre, en fraction de sa LARGEUR
const LABEL_H_PX = 30; // bandeau label sous la vidéo
// hauteur totale du cadre, en fraction de H, pour que la zone vidéo soit exactement au ratio du clip
const cardH = (wFrac: number) => {
  const cw = wFrac * W;
  const pad = PAD_FRAC * cw;
  const videoW = cw - 2 * pad;
  const videoH = videoW / CLIP_AR;
  return (videoH + 2 * pad + LABEL_H_PX) / H;
};

const FIELDS: Field[] = [
  {
    key: "gta",
    label: "GTA",
    sub: "GAZ — EN PRODUCTION",
    lonlat: GTA,
    clip: "_rnd/minimax-h3-tests/insert-lieux/gta-clair-r2v.mp4",
    card: { x: 0.055, y: 0.06, w: 0.315 },
    active: true,
  },
  {
    key: "sangomar",
    label: "SANGOMAR",
    sub: "PÉTROLE — EN PRODUCTION",
    lonlat: SANGOMAR,
    clip: "_rnd/minimax-h3-tests/insert-lieux/sangomar-clair-r2v.mp4",
    card: { x: 0.635, y: 0.35, w: 0.315 },
    active: true,
  },
  {
    key: "yakaar",
    label: "YAKAAR-TERANGA",
    sub: "GAZ — NON EXPLOITÉ",
    lonlat: YAKAAR,
    clip: "_rnd/minimax-h3-tests/insert-lieux/yakaar-clair-r2v.mp4",
    card: { x: 0.055, y: 0.585, w: 0.315 },
    active: false,
  },
];

// Géographie RÉELLE (d3-geo + Natural Earth 50m), projetée sur la fenêtre ci-dessus et figée dans
// senegalGisementsGeo.json. La v1 de ce proto utilisait un trait de côte inventé à la main : visible
// à l'oeil au premier rendu, et contraire à geo-zero-approximation même pour un proto de forme.
const geoCountries = (senegalGeo.countries as { name: string; d: string }[]);

const MiniInsert: React.FC<{ f: Field; frame: number; appear: number }> = ({ f, frame, appear }) => {
  const { card } = f;
  const scale = interpolate(appear, [0, 1], [0.93, 1]);
  const accent = f.active ? CYAN : GOLD;
  const videoW = card.w * W - 2 * (PAD_FRAC * card.w * W);
  const videoH = videoW / CLIP_AR;
  return (
    <div
      style={{
        position: "absolute",
        left: `${card.x * 100}%`,
        top: `${card.y * 100}%`,
        width: `${card.w * 100}%`,
        height: `${cardH(card.w) * 100}%`,
        opacity: appear,
        transform: `scale(${scale})`,
        background: "rgba(7, 24, 45, 0.96)",
        border: `1.5px solid ${accent}`,
        borderRadius: 5,
        boxShadow: `0 0 18px ${f.active ? "rgba(44,215,255,0.20)" : "rgba(217,161,59,0.18)"}`,
        // padding en PX (pas en %) : mêmes unités que le calcul de cardH, sinon la zone vidéo
        // n'atterrit pas exactement au ratio du clip et `contain` laisse des bandes noires.
        padding: PAD_FRAC * card.w * W,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "relative",
          // dimensions FIGÉES au ratio exact du clip : la vidéo remplit la zone au pixel près,
          // aucune bande résiduelle possible.
          width: videoW,
          height: videoH,
          flex: "0 0 auto",
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${accent}44`,
          background: "#0A1B2E",
        }}
      >
        <Loop durationInFrames={CLIP_LOOP}>
          {/* La zone est taillée au ratio EXACT du clip, donc `cover` ne rogne rien (0.0%) et évite
              la bande d'un pixel qu'un arrondi sous-pixel laisserait avec `contain`.
              ⚠️ Si un futur clip n'est PAS en 16:9, ajuster CLIP_AR — ne pas "réparer" avec contain. */}
          <OffthreadVideo
            src={staticFile(f.clip)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            muted
          />
        </Loop>
        {/* Pas de calque de désaturation sur le champ inactif : avec les clips CLAIRS, l'absence
            d'installation se lit déjà toute seule (mer vide vs usine). Assombrir en plus rendait la
            vignette illisible — le vide doit être VISIBLE pour signifier, pas caché. */}
      </div>

      {/* Hauteur FIXE en px (pas en %) : elle entre telle quelle dans le calcul de cardH ci-dessus.
          Un bandeau en % rendrait la hauteur du cadre circulaire et re-décalerait le ratio vidéo. */}
      <div
        style={{
          height: LABEL_H_PX,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: "0 0 auto",
        }}
      >
        <span
          style={{
            color: "#EAF6FF",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {f.label}
        </span>
        <span
          style={{
            color: accent,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12.5,
            letterSpacing: "0.07em",
          }}
        >
          {f.sub}
        </span>
      </div>
    </div>
  );
};

export const ProtoTroisGisementsInserts: React.FC = () => {
  const frame = useCurrentFrame();

  // Respiration continue de la carte (règle : rien de statique plus de 5s), sans caméra qui voyage —
  // le sujet du test est la COMPARAISON simultanée, un mouvement large nuirait à la lecture.
  const driftT = frame * 0.005;
  const camScale = 1 + interpolate(frame, [0, PROTO_TROIS_GISEMENTS_FRAMES], [0, 0.035], clampB);
  const camTx = Math.sin(driftT) * 5 - (camScale - 1) * W * 0.5;
  const camTy = Math.cos(driftT * 0.75) * 4 - (camScale - 1) * H * 0.5;

  // Les 3 inserts arrivent en cascade — jamais ensemble d'un coup (l'oeil doit pouvoir prendre
  // chacun), mais tous PRÉSENTS ensemble à partir de ~4.5s : c'est là que la comparaison opère.
  const dimIn = interpolate(frame, [S(0.8), S(1.4)], [0, DIM_MAX], clampB);

  return (
    <AbsoluteFill style={{ background: "#06172B" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          {/* Océan (fond) + terres réelles. Le Sénégal est traité en héros, les voisins en retrait :
              la scène parle de SES gisements, ils ne doivent pas se disputer la lecture. */}
          <rect x={0} y={0} width={W} height={H} fill="#08203A" />
          {geoCountries.map((c) => {
            const hero = c.name === "Senegal";
            return (
              <path
                key={c.name}
                d={c.d}
                fill={hero ? "#1B4A78" : "#123253"}
                fillOpacity={hero ? 0.95 : 0.7}
                stroke={hero ? "#9DBBDA" : "#4E6E8E"}
                strokeWidth={hero ? 1.6 : 1}
              />
            );
          })}
        </g>

        <rect x={0} y={0} width={W} height={H} fill="rgba(0,8,18,1)" opacity={dimIn} />

        {FIELDS.map((f, i) => {
          const t0 = S(1.2 + i * 1.1);
          const appear = interpolate(frame, [t0, t0 + S(0.5)], [0, 1], clampB);
          const px = projX(f.lonlat[0]) * camScale + camTx;
          const py = projY(f.lonlat[1]) * camScale + camTy;
          const accent = f.active ? CYAN : GOLD;
          // point d'accroche du connecteur : bord du cadre le plus proche du jeton
          const cx = (f.card.x + (f.card.x < 0.5 ? f.card.w : 0)) * W;
          const cy = (f.card.y + cardH(f.card.w) * 0.5) * H;
          const draw = interpolate(frame, [t0 + S(0.1), t0 + S(0.5)], [0, 1], clampB);

          // Pulse : seuls les champs EN PRODUCTION pulsent. Yakaar ne fait rien — il attend.
          const per = S(1.8);
          const tp = (frame % per) / per;

          return (
            <g key={f.key}>
              <path
                d={`M ${px} ${py} L ${(px + cx) / 2} ${(py + cy) / 2} L ${cx} ${cy}`}
                stroke={accent}
                strokeWidth={1.4}
                strokeDasharray="5 5"
                fill="none"
                opacity={draw > 0.05 ? 0.9 : 0}
                pathLength={1}
                strokeDashoffset={1 - draw}
              />
              <g transform={`translate(${px} ${py})`} opacity={appear}>
                {f.active && (
                  <circle r={10 + tp * 26} fill="none" stroke={accent} strokeWidth={1.4} opacity={(1 - tp) * 0.55} />
                )}
                <circle
                  r={26}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1.3}
                  strokeDasharray="4 4"
                  opacity={0.85}
                  transform={f.active ? `rotate(${frame * 0.5})` : undefined}
                />
                <circle r={8} fill="#06172B" stroke={accent} strokeWidth={2.6} />
                <circle r={3.5} fill={accent} />
              </g>
            </g>
          );
        })}
      </svg>

      {FIELDS.map((f, i) => {
        const t0 = S(1.2 + i * 1.1);
        const appear = interpolate(frame, [t0, t0 + S(0.5)], [0, 1], clampB);
        return <MiniInsert key={f.key} f={f} frame={frame} appear={appear} />;
      })}
    </AbsoluteFill>
  );
};

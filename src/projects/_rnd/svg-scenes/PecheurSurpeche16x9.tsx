/**
 * SCENE COMPLETE 16:9 (~68s, 2040f/30fps) — "Le pecheur et la surpeche industrielle" (Senegal/Afrique
 * de l'Ouest). Choisie par Aziz (2026-07-04) parmi 3 options pour clore le chantier 16:9 narratif+
 * personnages avec un VRAI livrable jugeable (pas un test de rendu isole) : tension narrative claire
 * (pas juste un voyage neutre), et reutilise TOUT l'acquis de la session en un seul geste.
 *
 * BRIQUES REUTILISEES (aucune reinventee) :
 * - camAt/lerpHex/objectVisualBottom : svg-library/motion.ts (extraits de CargoVoyage16x9_LibreInspire)
 * - Personnage-sujet cadrage SERRE (pas plan large+fond minuscule) : meme principe que
 *   ProtoCueilletteGrosPlan16x9 (perso scale ~1.3, occupe ~50% hauteur cadre, position resolue
 *   algebriquement pour que la main atteigne sa cible, pas devinee a l'oeil).
 * - GeminiRig canonique (_shared/personnage-vivant-svg/rig/) — nouveau geste "lancer-filet" (INEDIT,
 *   pas de reference existante, angles composes a partir de la meme logique bras-leve que reach-up).
 * - Horizon parametrique : ici utilise en mode GROSSISSEMENT (pas interpolation de silhouette entre A/B
 *   comme le cargo — le chalutier grossit sur un point fixe de l'horizon, silhouette vide -> envahie).
 * - Sequencage strict jour->soir (meme pattern que soleil/lune du cargo, sequenceExclusive-like).
 * - Fade vers data-viz (InkDonutChart) : meme pattern crossfade que ProtoNarratifPlusData.
 *
 * DONNEE FACTUELLE (doctrine SUJET-PRIME, pas de chiffre invente) : repartition VALEUR des captures
 * Senegal 2021 — artisanal 61% (139 Mds XOF) / autres flottes (semi-industrielle+industrielle,
 * incluant etrangeres) 39% (88 Mds XOF). Source : ODI (Overseas Development Institute), "Estimating
 * the impact of irregular and unsustainable fishing of distant-water fishing fleets in Senegal"
 * (Gutierrez & Lemma, avril 2024), donnees 2021. https://media.odi.org/documents/ODI_Policy_brief_IIUFishingInSenegal_cpXRRCp.pdf
 *
 * MUSIQUE : music-C-cordes-minimales.mp3 (sahel-warmap, cordes minimales/tension grave) — cacao-music-
 * CHOISI ecartee (decrite "afro-melancolique", ton cacao pas surpeche). Choix de gout, A VALIDER Aziz.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { GeminiRig, IDLE, lerpAngles, type LimbAngles } from "../../_shared/personnage-vivant-svg/rig/GeminiRig";
import { GridBackground } from "../../_shared/components/GridBackground";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { PoissonEncre } from "../../_shared/svg-library/elements/peche/PoissonEncre";
import { ChalutierGemini } from "../../_shared/svg-library/elements/peche/ChalutierGemini";
import { PirogueGPT } from "../../_shared/svg-library/elements/peche/PirogueGPT";
import { FiletGemini } from "../../_shared/svg-library/elements/peche/FiletGemini";
import { PanierOsierEncre } from "../../_shared/svg-library/elements/peche/PanierOsierEncre";
import { SoleilHaloRadial } from "../../_shared/svg-library/elements/ciel/SoleilHaloRadial";
import { OceanProfondeurVagues } from "../../_shared/svg-library/elements/ocean/OceanProfondeurVagues";
import { CloudQwenGravure } from "./CloudQwenGravure";
import { camAt, lerpHex, objectVisualBottom } from "../../_shared/svg-library/motion";
import { DATAVIZ_BG, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";

const INK = "#2b2117";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---- palette temporelle : aube -> jour -> soir (meme mecanique lerpHex que CargoVoyage) ----
const SKY_DAWN = "#e8c9a0";
const SKY_DAY = "#e8dcc0";
const SKY_DUSK = "#c98a5a";
const SEA_DAWN = "#7a8a9a";
const SEA_DAY = "#8a9aa5";
const SEA_DUSK = "#5f6a7a";

// ---- rig pecheur : geste INEDIT "lancer-filet" ----
// Angles composes (pas de reference session precedente) : le bras avant part haut-arriere
// (arme le lancer) puis fouette vers l'avant-bas (lache le filet) — meme logique cinematique que
// reach-up (bras qui pivote loin de sa position idle) mais direction et amplitude differentes.
const STAND: LimbAngles = { torsoTilt: 0, headTilt: 0, armUpperFront: -5, armLowerFront: 0, armUpperBack: 5, armLowerBack: 0, legUpperFront: 8, legLowerFront: -4, footFront: 0, legUpperBack: -6, legLowerBack: 4, footBack: 0, hipX: 0, hipY: 0 };
const CAST_WIND_UP: LimbAngles = { ...STAND, torsoTilt: -8, headTilt: -6, armUpperFront: -140, armLowerFront: 25, armUpperBack: 20, armLowerBack: -10 };
const CAST_RELEASE: LimbAngles = { ...STAND, torsoTilt: 10, headTilt: 8, armUpperFront: 55, armLowerFront: -15, armUpperBack: -25, armLowerBack: 5 };
const CAST_FOLLOW: LimbAngles = { ...STAND, torsoTilt: 4, headTilt: 4, armUpperFront: 25, armLowerFront: -5, armUpperBack: -10, armLowerBack: 0 };

const T = {
  cast1WindUp: 60, cast1Release: 78, cast1Follow: 110, cast1Hold: 260,
  cast2WindUp: 620, cast2Release: 638, cast2Follow: 670, cast2Hold: 900,
  cast3WindUp: 1180, cast3Release: 1198, cast3Follow: 1230, cast3Hold: 1400,
  duskStart: 1150, duskEnd: 1400,
  dataStart: 1400, cargoEnd: 1440, // crossfade 40f
};

export const PECHEUR_SURPECHE_FRAMES = 2040;

const CAST_SEGMENTS = [
  { label: "1er lancer", t0: 0, t1: T.cast1Hold },
  { label: "2e lancer — le chalutier apparait", t0: T.cast1Hold, t1: T.cast2Hold },
  { label: "3e lancer — le filet remonte presque vide", t0: T.cast2Hold, t1: T.cast3Hold },
];

function castPose(frame: number, windUp: number, release: number, follow: number, hold: number) {
  if (frame < windUp) return { limb: STAND, netThrown: false, netProgress: 0 };
  if (frame < release) {
    const t = interpolate(frame, [windUp, release], [0, 1], { extrapolateRight: "clamp" });
    return { limb: lerpAngles(STAND, CAST_WIND_UP, easeInOutCubic(t)), netThrown: false, netProgress: 0 };
  }
  if (frame < follow) {
    const t = interpolate(frame, [release, follow], [0, 1], { extrapolateRight: "clamp" });
    return { limb: lerpAngles(CAST_WIND_UP, CAST_RELEASE, easeInOutCubic(t)), netThrown: true, netProgress: t };
  }
  if (frame < hold) {
    const t = interpolate(frame, [follow, follow + 20], [0, 1], { extrapolateRight: "clamp" });
    return { limb: lerpAngles(CAST_RELEASE, CAST_FOLLOW, easeInOutCubic(t)), netThrown: true, netProgress: 1 };
  }
  return { limb: CAST_FOLLOW, netThrown: true, netProgress: 1 };
}

export const PecheurSurpeche16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== SEQUENCAGE STRICT jour -> soir (meme principe que sequenceExclusive du cargo : le jour
  // doit etre acheve avant que le soir prenne le relais, pas de melange visuel des 2 etats) =====
  const duskProgress = interpolate(frame, [T.duskStart, T.duskEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const dawnToDay = interpolate(frame, [0, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const skyColorBase = lerpHex(SKY_DAWN, SKY_DAY, dawnToDay);
  const seaColorBase = lerpHex(SEA_DAWN, SEA_DAY, dawnToDay);
  const skyColor = lerpHex(skyColorBase, SKY_DUSK, duskProgress);
  const seaColor = lerpHex(seaColorBase, SEA_DUSK, duskProgress);

  // ===== HORIZON — mode GROSSISSEMENT (pas interpolation de silhouette A/B comme le cargo) :
  // le chalutier est INVISIBLE (scale 0, opacity 0) jusqu'au cast 2, puis grossit progressivement
  // jusqu'a dominer l'horizon au cast 3 — "horizon vide -> horizon envahi" est le sens narratif. =====
  const trawlerAppear = interpolate(frame, [T.cast1Hold, T.cast2WindUp], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const trawlerGrow = interpolate(frame, [T.cast2WindUp, T.cast3Hold], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const trawlerScale = 0.35 + trawlerGrow * 0.75;
  const trawlerOpacity = trawlerAppear;

  // ===== 3 lancers de filet =====
  const cast1 = castPose(frame, T.cast1WindUp, T.cast1Release, T.cast1Follow, T.cast1Hold);
  const cast2 = castPose(frame, T.cast2WindUp, T.cast2Release, T.cast2Follow, T.cast2Hold);
  const cast3 = castPose(frame, T.cast3WindUp, T.cast3Release, T.cast3Follow, T.cast3Hold);
  const active = frame < T.cast2WindUp ? cast1 : frame < T.cast3WindUp ? cast2 : cast3;
  const castIndex = frame < T.cast2WindUp ? 0 : frame < T.cast3WindUp ? 1 : 2;

  // catch en baisse a chaque lancer (0=plein, 2=presque vide) — narratif du declin, pas de hasard
  const catchByCast = [1, 0.45, 0.12];
  const catchLevel = catchByCast[castIndex];

  // ===== crossfade scene -> data-viz (meme pattern que ProtoNarratifPlusData) =====
  const sceneOpacity = frame < T.dataStart ? 1 : interpolate(frame, [T.dataStart, T.cargoEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataOpacity = frame < T.dataStart ? 0 : interpolate(frame, [T.dataStart, T.cargoEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataLocalFrame = Math.max(0, frame - (T.dataStart - 20));
  // le label de scene s'estompe AVANT le crossfade (pas a sceneOpacity, qui ne bouge qu'a partir de
  // dataStart) — bug corrige : sans ca, "3e lancer..." restait a pleine opacite pendant tout le
  // crossfade et se lisait superpose au titre data-viz qui apparait au meme moment (illisible).
  const sceneLabelOpacity = interpolate(frame, [T.dataStart - 60, T.dataStart - 20], [0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataTitleOpacity = interpolate(frame, [T.dataStart, T.dataStart + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const PECHEUR_HIP_X = 780;
  const PECHEUR_HIP_Y = 760;
  const PERSO_SCALE = 1.3;

  // soleil : arc lent (matin->soir), meme mecanique que CargoVoyage (sunArc via sin, sunOpacity qui
  // decline avec duskProgress — pas de nuit complete ici, la scene reste diurne/crepusculaire)
  const sunX = interpolate(frame, [0, T.dataStart], [280, 1600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunArc = Math.sin(interpolate(frame, [0, T.dataStart], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sunY = 260 - sunArc * 90;
  const sunOpacity = 1 - duskProgress * 0.15; // le soleil reste visible (crepuscule chaud, pas nuit)
  const camSeaOffset = camAt(frame, 1, 1.3); // meme vitesse que la couche ocean (cf note camSeaOffset CargoVoyage)
  // BUG CORRIGE : seaColorDeep etait derive de constantes bleu-gris FIXES, jamais rechauffees par
  // duskProgress -> au crepuscule (ciel orange chaud), le rectangle de profondeur ocean restait
  // bleu-froid et se lisait comme un bloc dissonant qui coupe l'ecran. Deriver de seaColor (deja
  // rechauffe) via un simple assombrissement, pas une palette independante.
  const seaColorDeep = lerpHex(seaColor, INK, 0.35);
  const cargoHullBottom = objectVisualBottom(PECHEUR_HIP_Y + 260, 0); // bas visuel de la pirogue (pas d'offset hull specifique, forme plus plate qu'un cargo)

  const PECHE_SEGMENTS = [
    { label: "Peche artisanale", value: 0.61, color: "#5e7245" },
    { label: "Flottes semi-industr. + etrangeres", value: 0.39, color: "#8a2b2b" },
  ];

  return (
    <AbsoluteFill style={{ background: DATAVIZ_BG }}>
      <Sequence from={0} durationInFrames={PECHEUR_SURPECHE_FRAMES}>
        <Audio src={staticFile("_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3")} volume={0.42} loop />
      </Sequence>
      <Sequence from={0} durationInFrames={T.cargoEnd}>
        <Audio src={staticFile("_shared/sfx/ambiance/ocean-cargo-ambient.mp3")} volume={0.5} loop />
      </Sequence>

      {frame < T.cargoEnd && (
        <AbsoluteFill style={{ opacity: sceneOpacity }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%">
            <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

            <SoleilHaloRadial cx={sunX} cy={sunY} color={lerpHex("#f2c14e", "#e8894a", duskProgress)} opacity={sunOpacity} idPrefix="pecheSun" ink={INK} />

            {/* nuages — meme composant que CargoVoyage16x9_LibreInspire (CloudQwenGravure) */}
            {[
              { baseX: 500, y: 160, w: 1.0, speed: 0.09, phase: 1 },
              { baseX: 1350, y: 130, w: 0.85, speed: 0.11, phase: 4 },
            ].map((c, k) => {
              const range = 1700;
              const x = 100 + (((c.baseX - 100 - frame * c.speed) % range) + range) % range;
              const bob2 = Math.sin(frame / 34 + c.phase) * 5;
              const edgeFade = Math.min(1, Math.min(x - 100, 1820 - x) / 150);
              const op = 0.65 * Math.max(0, edgeFade);
              return (
                <g key={k} transform={`translate(${x} ${c.y + bob2}) scale(${c.w * 0.5})`} opacity={op}>
                  <CloudQwenGravure ink={INK} />
                </g>
              );
            })}

            {/* horizon plat */}
            <line x1={0} y1={620} x2={1920} y2={620} stroke={INK} strokeWidth={2} opacity={0.35} />

            {/* CHALUTIER (Gemini) — grossit sur un point fixe de l'horizon (mode grossissement, pas
                interpolation de silhouette A/B). Silhouette imposante, contraste net avec la pirogue. */}
            <g transform={`translate(1535 470) scale(${trawlerScale})`} opacity={trawlerOpacity}>
              <ChalutierGemini idPrefix="pecheTrawler" />
            </g>

            {/* mer (composant partage, meme mecanique que CargoVoyage16x9_LibreInspire) */}
            <g transform={camSeaOffset}>
              <OceanProfondeurVagues
                frame={frame}
                part="fond"
                splitY={cargoHullBottom}
                seaColor={seaColor}
                seaColorDeep={seaColorDeep}
                idPrefix="pecheOcean"
              />
            </g>

            {/* pirogue artisanale (GPT) — sous le personnage. BUG CORRIGE : a scale 1 + y+250, les
                jambes du personnage (qui descendent a y+260 avec PERSO_SCALE) recouvraient presque
                toute la largeur visible de la pirogue vue de profil. Elargie (scale 1.35) + decalee
                plus bas (y+310) pour qu'elle deborde clairement des deux cotes du personnage. */}
            <g transform={`translate(${PECHEUR_HIP_X} ${PECHEUR_HIP_Y + 310}) scale(1.35)`}>
              <PirogueGPT idPrefix="pechePirogue" />
            </g>

            {/* PANIER — pose au fond de la pirogue, cote arriere (gauche du personnage vu de profil),
                destination des poissons captures (frame de reference pour test Seedance image-to-video,
                Option B : le panier doit etre visible dans l'image source pour que le prompt narratif
                "il depose le poisson dans le panier" ait un referent visuel coherent). */}
            <g transform={`translate(${PECHEUR_HIP_X - 180} ${PECHEUR_HIP_Y + 300}) scale(0.9)`}>
              <PanierOsierEncre />
            </g>

            {/* mer 1er plan — passe devant le bas de la pirogue */}
            <g transform={camSeaOffset}>
              <OceanProfondeurVagues
                frame={frame}
                part="premier-plan"
                splitY={cargoHullBottom}
                seaColor={seaColor}
                seaColorDeep={seaColorDeep}
                idPrefix="pecheOcean"
              />
            </g>

            {/* FILET (Gemini) — machine a etats simple : au repos (invisible) -> lance (progress 0->1,
                positionne a la main du personnage) -> reste depose sur l'eau (progress=1, position finale).
                BUG CORRIGE : le scale(progress) INTERNE de FiletGemini (deploiement 0->1) se multipliait
                avec le scale(0.42) EXTERIEUR (mise a taille de scene) -> a progress~0.5, taille reelle
                ~0.42*0.5=0.21 de la taille native, filet quasi invisible (confirme par test isole). Le
                scale exterieur doit rester CONSTANT (taille finale voulue), seul le composant gere son
                propre deploiement — ne pas les multiplier en cascade. */}
            {active.netThrown && (
              <g transform={`translate(${PECHEUR_HIP_X + 60} ${PECHEUR_HIP_Y - 40}) scale(0.68)`}>
                <FiletGemini progress={active.netProgress} idPrefix="pecheFilet" />
              </g>
            )}
            {/* poissons captures — declin CONCRET (moins de poissons a chaque lancer), pas un
                cercle abstrait. Nombre derive de catchLevel (1 -> 3 poissons, 0.45 -> 2, 0.12 -> 1) */}
            {active.netProgress >= 1 &&
              Array.from({ length: Math.max(1, Math.round(catchLevel * 3)) }).map((_, i) => (
                <g
                  key={i}
                  transform={`translate(${PECHEUR_HIP_X + 340 + i * 55} ${PECHEUR_HIP_Y + 145 + (i % 2) * 20}) scale(0.55) rotate(${-8 + i * 6})`}
                >
                  <PoissonEncre />
                </g>
              ))}

            {/* PERSONNAGE — sujet principal, cadrage SERRE (meme principe que ProtoCueilletteGrosPlan16x9) */}
            <g transform={`translate(${PECHEUR_HIP_X} ${PECHEUR_HIP_Y}) scale(${PERSO_SCALE})`}>
              <GeminiRig
                a={{ ...active.limb, hipX: 0, hipY: 0 }}
                face="serious"
                faceView="profile"
                skinTone="#7a5230"
                clothesColor="#3a6a5a"
                pantsColor="#2F4F4F"
                hatType="none"
              />
            </g>

            {/* label de progression du declin (lisibilite pedagogique, pas juste esthetique) —
                s'estompe AVANT le crossfade (sceneLabelOpacity), jamais visible en meme temps
                que le titre data-viz (bug corrige, cf note sceneLabelOpacity plus haut) */}
            <text x={960} y={70} textAnchor="middle" fill={INK} fontFamily="Georgia, serif" fontSize={28} opacity={sceneLabelOpacity}>
              {CAST_SEGMENTS[castIndex].label}
            </text>
          </svg>
        </AbsoluteFill>
      )}

      {frame >= T.dataStart - 20 && (
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

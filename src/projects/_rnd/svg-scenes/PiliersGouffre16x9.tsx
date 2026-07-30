// PREUVE DE CONCEPT — une slide NotebookLM devient une scene SVG animee (2026-07-30).
//
// OBJET DU TEST (starter : memory/starters/STARTER-PROMPT-preuve-concept-slide-nlm-vers-svg.md) :
// verifier qu'une TROUVAILLE DE TRADUCTION proposee par NotebookLM (ici la slide "The Sira Chasm" :
// 3 piliers enjambant un gouffre, portant un tablier commun, socles deja fissures) se transpose en
// scene animee dans NOTRE registre encre/nuit.
// ⛔ Ce n'est PAS destine a l'episode CFA, qui est termine et promu. C'est une preuve de concept.
//
// INTENTION (ecrite AVANT d'ouvrir la slide, garde-fou du starter contre l'inversion
// INTENTION -> FORME -> TEMPLATE) :
//   "faire sentir que la stabilite d'une monnaie repose sur trois supports solidaires,
//    et qu'ils sont deja en train de ceder."
//
// PARTAGE DU TRAVAIL (doctrine SVG-SCENES-GENERATIVES regle n.0) :
//   Fable 5 a dessine le DECOR STATIQUE (PiliersGouffreBodies.ts, groupes <g id> nommes).
//   NOUS animons ici, frame-driven. Le modele n'a ecrit AUCUNE animation.
//   v1 rejetee au rendu (gouffre inexistant, contraste nul, emblemes en cartouches) -> v2 corrigee.
//
// LA CHOREGRAPHIE — elle etait deja ecrite dans l'image :
//   1. LE GOUFFRE D'ABORD. Le danger s'installe avant les supports : un pilier n'a de sens
//      que si on sait ce qu'il y a dessous. (Meme principe que le vide nu ~2s avant le filet
//      du funambule dans CfaActe4Filet16x9.)
//   2. LES PILIERS montent un par un, en cascade (~0.4s d'intervalle : la propagation se VOIT
//      avancer = rythme, cf. acquis transverse n.6 de la doctrine).
//   3. LE TABLIER se pose et les relie -> c'est la que se lit la SOLIDARITE : ils portent
//      la meme chose. Avant lui, ce sont 3 objets ; apres, c'est un systeme.
//   4. LES FISSURES en dernier, et en cascade inverse. Ce sont elles la vraie information :
//      "c'est fragile MAINTENANT". Elles arrivent quand le systeme parait acquis.
//   5. Un TASSEMENT final, quelques pixels : le tablier flechit. On ne montre pas
//      l'effondrement — le sujet est la fragilite, pas la chute.
//
// EPURE : aucune couleur ajoutee, aucun element hors du dessin. L'or reste rare (les emblemes).
// La camera ne bouge pas (regle : pas de translateY global sur une scene frontale = glissement
// parasite). Tout se joue en apparition, en trace, et en 4px de tassement.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { PILIERS_GOUFFRE_SVG } from "./PiliersGouffreBodies";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";

// ================== EXTRACTION DES GROUPES DU SVG ==================
// Le decor arrive comme un SVG complet. On isole chaque <g id="..."> pour pouvoir l'animer
// separement. Parseur a profondeur, car les groupes sont imbriques (pilier-1 > pilier-1-fut).
const extractGroup = (svg: string, id: string): string => {
  const open = new RegExp(`<g\\s[^>]*id="${id}"[^>]*>`);
  const m = open.exec(svg);
  if (!m) return "";
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < svg.length && depth > 0) {
    const nextOpen = svg.indexOf("<g", i);
    const nextClose = svg.indexOf("</g>", i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 2;
    } else {
      depth--;
      i = nextClose + 4;
    }
  }
  return svg.slice(start, i - 4);
};

// Les <defs> (gradients) doivent etre reinjectes, sinon les fill="url(#...)" sont perdus.
const DEFS = (() => {
  const m = /<defs>([\s\S]*?)<\/defs>/.exec(PILIERS_GOUFFRE_SVG);
  return m ? m[1] : "";
})();

const G = {
  fond: extractGroup(PILIERS_GOUFFRE_SVG, "fond"),
  gouffreNoir: extractGroup(PILIERS_GOUFFRE_SVG, "gouffre-noir"),
  levreGauche: extractGroup(PILIERS_GOUFFRE_SVG, "gouffre-levre-gauche"),
  levreDroite: extractGroup(PILIERS_GOUFFRE_SVG, "gouffre-levre-droite"),
  tablierDalle: extractGroup(PILIERS_GOUFFRE_SVG, "tablier-dalle"),
  tablierDessous: extractGroup(PILIERS_GOUFFRE_SVG, "tablier-dessous"),
  piliers: [1, 2, 3].map((n) => ({
    fut: extractGroup(PILIERS_GOUFFRE_SVG, `pilier-${n}-fut`),
    socle: extractGroup(PILIERS_GOUFFRE_SVG, `pilier-${n}-socle`),
    fissure: extractGroup(PILIERS_GOUFFRE_SVG, `pilier-${n}-fissure`),
    embleme: extractGroup(PILIERS_GOUFFRE_SVG, `pilier-${n}-embleme`),
  })),
};

const Raw: React.FC<{
  body: string;
  transform?: string;
  opacity?: number;
  clipPath?: string;
}> = ({ body, transform, opacity, clipPath }) => (
  <g
    transform={transform}
    opacity={opacity}
    clipPath={clipPath}
    dangerouslySetInnerHTML={{ __html: body }}
  />
);

// ================== TIMINGS ==================
// Rythme d'une scene explicative : ~2s par idee, la derniere idee (les fissures) tenue plus
// longtemps parce que c'est elle qu'on doit emporter.
const T = {
  gouffre: 0.0,      // le vide s'ouvre : le danger AVANT les supports
  levres: 0.8,       // les bords de roche se posent
  pilier1: 2.0,      // les 3 supports montent en cascade
  pilier2: 2.4,
  pilier3: 2.8,
  emblemes: 4.0,     // ce que chaque pilier represente s'allume
  tablier: 5.4,      // ils portent la MEME chose -> solidarite
  fissures: 7.6,     // ... et c'est deja en train de ceder
  tassement: 9.6,    // le tablier flechit de quelques pixels
};

export const PILIERS_GOUFFRE_FRAMES = S(13);

// Le pilier central est le plus expose (aucune roche autour) : il monte legerement plus lentement
// et flechit un peu plus au tassement. Detail de credibilite, pas d'effet.
const PILIER_X = [430, 960, 1490];

// Bornes verticales des fissures, MESUREES dans le SVG genere (les 3 groupes couvrent
// y[686,771]). On garde une marge de 4px en haut pour que le trait ne soit pas coupe net.
const FISSURE_Y0 = 682;
const FISSURE_Y1 = 775;

export const PiliersGouffre16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- 1. LE GOUFFRE : le noir s'approfondit, on ne voit pas le fond
  const gouffreIn = interpolate(frame, [S(T.gouffre), S(T.gouffre + 1.2)], [0, 1], clamp);
  const levresIn = interpolate(frame, [S(T.levres), S(T.levres + 1.0)], [0, 1], clamp);

  // --- 2. LES PILIERS : chacun monte depuis le vide et se pose (spring = arrivee qui pese)
  const pilierAnim = [T.pilier1, T.pilier2, T.pilier3].map((t, i) => {
    const s = spring({
      frame: frame - S(t),
      fps,
      config: { damping: 14, mass: i === 1 ? 1.15 : 1 },
    });
    return {
      // il monte de 90px depuis le bas et se cale : le pilier VIENT du gouffre
      dy: interpolate(s, [0, 1], [90, 0]),
      opacity: interpolate(frame, [S(t), S(t + 0.5)], [0, 1], clamp),
    };
  });

  // --- 3. LES EMBLEMES : gravure qui s'allume, en cascade rapide
  const emblemeIn = [0, 1, 2].map((i) =>
    interpolate(frame, [S(T.emblemes + i * 0.35), S(T.emblemes + i * 0.35 + 0.6)], [0, 1], clamp)
  );

  // --- 4. LE TABLIER : il se pose et RELIE. C'est le moment de la solidarite.
  const tablierS = spring({ frame: frame - S(T.tablier), fps, config: { damping: 16 } });
  const tablierDy = interpolate(tablierS, [0, 1], [-40, 0]);
  const tablierOp = interpolate(frame, [S(T.tablier), S(T.tablier + 0.7)], [0, 1], clamp);

  // --- 5. LES FISSURES : cascade INVERSE (3 -> 1). Elles arrivent quand tout parait acquis.
  // Elles ne s'allument pas en fondu : elles se REVELENT par un balayage vertical (clip),
  // comme une fissure qui court. Le fondu dirait "il y avait deja des fissures" ; le balayage
  // dit "elles s'ouvrent MAINTENANT" — c'est toute la difference de sens.
  const fissureProgress = [2, 1, 0].map((ordre, idx) => {
    const t = T.fissures + ordre * 0.5;
    return interpolate(frame, [S(t), S(t + 0.9)], [0, 1], clamp);
  });
  // remise dans l'ordre pilier-1,2,3 (la cascade part du pilier 3)
  const fissureParPilier = [fissureProgress[2], fissureProgress[1], fissureProgress[0]];

  // --- 6. LE TASSEMENT : le tablier flechit. On ne montre PAS l'effondrement.
  const tass = interpolate(frame, [S(T.tassement), S(T.tassement + 2.4)], [0, 1], clamp);
  const tassementDy = tass * 4;          // 4px : perceptible, jamais spectaculaire
  const tassementCentre = tass * 6;      // le pilier central pese davantage

  return (
    <AbsoluteFill style={{ backgroundColor: NUIT2 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        {/* fond : toujours present, c'est la nuit */}
        <Raw body={G.fond} />

        {/* 1. le vide, d'abord */}
        <Raw body={G.gouffreNoir} opacity={gouffreIn} />
        <Raw body={G.levreGauche} opacity={levresIn} />
        <Raw body={G.levreDroite} opacity={levresIn} />

        {/* 2-3-5. les piliers : fut + socle montent ensemble, embleme puis fissure par-dessus */}
        {G.piliers.map((p, i) => {
          const a = pilierAnim[i];
          const dy = a.dy + (i === 1 ? tassementCentre : tassementDy);
          return (
            <g key={i} opacity={a.opacity} transform={`translate(0 ${dy})`}>
              <Raw body={p.socle} />
              <Raw body={p.fut} />
              <Raw body={p.embleme} opacity={emblemeIn[i]} />
              {/* la fissure se revele par balayage vertical : elle COURT dans la pierre.
                  Le clip est DANS le groupe translate du pilier, donc il suit le tassement
                  (sinon le pilier descend et le masque reste fixe -> la fissure se recoupe). */}
              <g clipPath={`url(#clip-fissure-${i})`}>
                <Raw body={p.fissure} />
              </g>
            </g>
          );
        })}

        {/* 4. le tablier EN DERNIER (ordre de peinture du dessin) : il relie les 3 */}
        <g transform={`translate(0 ${tablierDy + tassementDy})`} opacity={tablierOp}>
          <Raw body={G.tablierDessous} />
          <Raw body={G.tablierDalle} />
        </g>

        {/* Clips de revelation : un rectangle qui DESCEND le long du socle, si bien que la
            fissure se lit comme un trait qui court vers le bas.
            ⛔ Bornes MESUREES dans le SVG (pas estimees) : les 3 groupes de fissure occupent
            x[338,1594] et y[686,771]. Un clip qui demarrait a y=655 laissait le balayage
            "vide" pendant ses 30 premiers pixels -> la fissure semblait n'arriver qu'a moitie. */}
        <defs>
          {[0, 1, 2].map((i) => (
            <clipPath key={i} id={`clip-fissure-${i}`}>
              <rect
                x={PILIER_X[i] - 280}
                y={FISSURE_Y0}
                width={560}
                height={interpolate(
                  fissureParPilier[i],
                  [0, 1],
                  [0, FISSURE_Y1 - FISSURE_Y0]
                )}
              />
            </clipPath>
          ))}
        </defs>
      </svg>
    </AbsoluteFill>
  );
};

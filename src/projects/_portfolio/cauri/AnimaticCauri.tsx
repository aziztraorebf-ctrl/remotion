// MOTEUR: SVG — QUOI/COMMENT. La piece montre un OBJET (la coquille) et un PROCESSUS
// (elle se demultiplie, voyage loin, s'accumule, s'effondre sous un afflux proche).
// Pourquoi pas les autres registres, explicitement :
//   - Mapbox (OU) exclu par le brief § 4 : « geographie abstraite, distance suggeree,
//     pas de carte ». La distance est un ECART VISUEL, pas une geographie reelle.
//   - D3 (COMBIEN) exclu : rien a projeter ni a mesurer ; les deux seuls chiffres de la
//     piece (§ 6) sont du TEXTE pose, pas une donnee tracee.
//   - stick-figure (QUI) exclu : aucun acteur, le sujet est une matiere.
//   - RACCORD (montage) exclu par la contrainte maitresse : UNE SEULE PRISE, ZERO COUPE.
// Le moteur de la scene precedente de ce dossier n'existe pas — c'est la premiere piece
// originale du chantier, aucune lassitude de registre a craindre.
//
// ANIMATIC — piece « Le cauri ». JETABLE PAR CONSTRUCTION.
//
// Ce qu'il sert a trancher, et RIEN d'autre :
//   1. l'enchainement des 7 etats tient-il sans coupe ?
//   2. l'ecart LONG (etat 3) / COURT (etat 5) se lit-il ? — c'est lui qui porte le sens
//   3. le rythme global est-il juste en 15-25 s ?
//
// ⛔ Ce n'est PAS un rendu, pas une esthetique, pas une proposition de look :
//   - gris neutre uniquement, AUCUNE couleur du brief § 5 (elles se jugeront sur le dessin)
//   - les particules sont des disques ; la coquille est un ovale place-tenant
//   - pas de son, pas de texte a l'ecran (les 2 reperes du § 6 viendront avec le dessin)
//
// ⭐ Le principe qui rend la coupe IMPOSSIBLE : il y a N particules, les MEMES du
// debut a la fin. Un « etat » n'est qu'un jeu de positions cibles pour ces N points.
// Aucune n'apparait ni ne disparait jamais — la continuite n'est pas un effort
// d'animation, elle est une propriete de la structure. C'est la traduction litterale
// de « chaque forme est la matiere de la suivante » (brief § 4).
//
// ⭐ 2e passe (2026-09-03) : test du dispositif IRIS (R5 de l'analyse continuous-flow,
// out/_r-and-d/fable-vs-opus-ted-ed-style/source-ted-ed/ANALYSE-CONTINUOUS-FLOW.md).
// La camera bouge SEULEMENT sur 2 passages (1->2 et 6->7) — cf. IRIS dans animatic-timing.ts
// — et reste fixe partout ailleurs, conformement a la mesure sur la reference (cadre pose
// ~55 % du temps, tout changement d'echelle confine a une transition).
//
// Contraintes projet : interpolate()/spring() uniquement, extrapolate "clamp",
// zero CSS transition / setTimeout / @keyframes / requestAnimationFrame.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BORNES,
  CIBLES,
  ETATS,
  N,
  PART_TRANSFORMATION,
  VB,
  alea,
  zoomCamera,
} from "./animatic-timing";

const FOND = "#1c1c1e";
const ENCRE = "#e8e8e6";

/** Adoucissement d'une progression 0->1 (demarrage et arrivee calmes). */
const adoucir = (t: number): number => t * t * (3 - 2 * t);

/**
 * Ordre de retard propre a chaque particule : elles n'arrivent pas toutes en meme
 * temps sur leur cible. Sans ce decalage, le nuage se deplace comme un bloc rigide
 * et on retombe sur une « diapositive animee » plutot qu'une matiere qui coule.
 */
const RETARDS = (() => {
  const r = alea(1789);
  return Array.from({ length: N }, () => r() * 0.42);
})();

/** Rayon de chaque particule — legere variete, sinon la matiere parait imprimee. */
const RAYONS = (() => {
  const r = alea(2027);
  return Array.from({ length: N }, () => 4.2 + r() * 3.4);
})();

export const AnimaticCauri: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // temps en secondes — tout le timing raisonne en secondes

  // --- ou en est-on ? etat courant + progression de la transformation vers lui ---
  let idx = 0;
  for (let i = 0; i < ETATS.length; i += 1) {
    if (t >= BORNES[i]) idx = i;
  }
  const etat = ETATS[idx];
  const depuis = t - BORNES[idx];
  const dureeTransfo = etat.duree * PART_TRANSFORMATION;

  // Progression brute vers l'etat courant. Au-dela de dureeTransfo : la forme TIENT,
  // ce temps de tenue est ce qui rend la forme lisible avant qu'elle ne reparte.
  const avance = dureeTransfo > 0 ? Math.min(1, depuis / dureeTransfo) : 1;

  const cibleArrivee = CIBLES[etat.nom];
  // L'etat 1 n'a pas de precedent : les particules partent de leur propre cible
  // (la coquille se tient deja, il n'y a rien avant elle).
  const cibleDepart = idx === 0 ? CIBLES[ETATS[0].nom] : CIBLES[ETATS[idx - 1].nom];

  // --- respiration : l'etat 1 n'est pas fige, l'etat 7 se pose ---
  const souffle = Math.sin(t * 1.5) * 2.2;

  // --- camera : zoom = 1 partout, sauf sur les 2 passages IRIS ---
  const zoom = zoomCamera(t);

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        style={{ display: "block" }}
      >
        <g
          transform={`translate(${VB.w / 2} ${VB.h / 2}) scale(${zoom}) translate(${-VB.w / 2} ${-VB.h / 2})`}
        >
        {Array.from({ length: N }, (_, i) => {
          // chaque particule suit sa propre fenetre temporelle a l'interieur de la transition
          const retard = RETARDS[i];
          const local = interpolate(avance, [retard, Math.min(1, retard + 0.58)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const k = adoucir(local);

          const a = cibleDepart[i];
          const b = cibleArrivee[i];
          const x = a.x + (b.x - a.x) * k;
          const y = a.y + (b.y - a.y) * k + souffle;

          // les particules encore en mouvement sont legerement plus pales :
          // le regard suit ce qui se POSE, pas ce qui passe
          const opacite = 0.55 + 0.45 * (k < 1 ? k : 1);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={RAYONS[i]}
              fill={ENCRE}
              opacity={opacite}
            />
          );
        })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

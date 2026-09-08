// MOTEUR: SVG — le fond est une MATIERE (grain, teinte qui respire, courants suggeres),
// pas un lieu (Mapbox exclu, brief §4 : "geographie abstraite") ni une donnee chiffree
// (D3 exclu : rien a projeter). C'est un registre "QUOI/COMMENT" au meme titre que la
// coquille elle-meme — geometrie SVG procedurale calculee par le code, aucun dessin externe.
//
// Le fond de la piece "Le cauri" — 3 variantes testees en sequentiel (2026-09-08).
//
// Retour Aziz sur le mix v1 : le fond aplat uni #0E2A44, immobile du debut a la fin,
// "fait tres corporatif, tres plate" compare au registre TED-Ed (reference du brief).
// Diagnostic : notre analyse de la reference (ANALYSE-CONTINUOUS-FLOW.md § 5.1, dispositif
// M1) montre que le fond y est TOUJOURS vivant — jamais un simple support statique. On avait
// applique cette regle au SON (jamais de vrai silence) mais jamais a l'IMAGE.
//
// ⛔ Le fond vit dans un <rect> SEPARE, en DEHORS du groupe zoome par la camera IRIS —
// sinon le fond bougerait avec le zoom, ce qui casserait R10 (camera ne bouge QUE
// pendant les transitions, jamais le fond en continu independamment d'elle).
//
// Les 3 variantes sont posees cote a cote pour un choix a l'oeil (comme les 3 familles
// sonores), pas pour etre fusionnees. NE PAS extraire de composant generique avant d'avoir
// vu laquelle est retenue.
import React from "react";
import { TEINTES } from "./coquille-geometrie";
import {
  COUCHE_LOINTAINE,
  COUCHE_MEDIANE,
  COUCHE_PROCHE,
  FOND_BASE,
  LARGEUR_DECOR,
} from "./decor-geometrie";

export type VarianteFond = "texture" | "teinte-par-etat" | "ocean" | "decor-dessine";

/**
 * VARIANTE A — texture organique legere, tout du long.
 * Un grain anime tres subtil (bruit SVG feTurbulence) + un degrade radial doux qui
 * respire lentement, centre sur l'action. Le fond vit sans jamais concurrencer les
 * coquilles : aucun element net, juste une matiere qui bouge a peine.
 */
const FondTexture: React.FC<{ t: number; vb: { w: number; h: number } }> = ({ t, vb }) => {
  // respiration lente du degrade radial : cycle de ~14s, jamais synchronisee sur les etats
  // (sinon le fond "raconterait" quelque chose — il doit rester un arriere-plan)
  const respire = 0.5 + 0.5 * Math.sin((t / 14) * Math.PI * 2);
  const rx = vb.w * (0.55 + respire * 0.08);
  const ry = vb.h * (0.55 + respire * 0.08);
  // le grain derive tres lentement pour ne jamais paraitre fige (feTurbulence seed anime)
  const seed = Math.floor(t * 2);

  return (
    <>
      <defs>
        <radialGradient id="fond-respire" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#123454" />
          <stop offset="100%" stopColor={TEINTES.fond} />
        </radialGradient>
        <filter id="fond-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.025 0" />
        </filter>
      </defs>
      <rect x={0} y={0} width={vb.w} height={vb.h} fill={TEINTES.fond} />
      <ellipse cx={vb.w / 2} cy={vb.h / 2} rx={rx} ry={ry} fill="url(#fond-respire)" opacity={0.6} />
      <rect x={0} y={0} width={vb.w} height={vb.h} filter="url(#fond-grain)" />
    </>
  );
};

/**
 * VARIANTE B — le fond change de teinte par etat (reprend M1 de la reference).
 * ⛔ Contrainte du brief §5 respectee : le rouge-brun reste RESERVE a l'effondrement
 * seul, jamais un glissement continu vers cette teinte. Les autres etats restent
 * dans la famille du bleu profond, avec une densite qui varie legerement.
 */
const TEINTE_PAR_ETAT: Record<string, string> = {
  coquille: "#0E2A44",
  semis: "#0F2C48",
  "flux-long": "#11304E",
  colonne: "#123456",
  "flux-court": "#15395E",
  effondrement: "#2A1E1A", // seul point ou la famille rouge-brun apparait, cf. brief §5
  calme: "#0E2A44", // retour exact a l'etat 1 : la boucle se referme aussi en couleur
};

const FondTeintePourEtat: React.FC<{
  etatNom: string;
  etatPrecedent: string;
  avance: number;
  vb: { w: number; h: number };
}> = ({ etatNom, etatPrecedent, avance, vb }) => {
  // interpolation lineaire simple entre les 2 teintes hex (composante par composante)
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = hex(TEINTE_PAR_ETAT[etatPrecedent] ?? TEINTES.fond);
  const b = hex(TEINTE_PAR_ETAT[etatNom] ?? TEINTES.fond);
  const k = Math.min(1, avance);
  const rgb = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const teinte = `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  return <rect x={0} y={0} width={vb.w} height={vb.h} fill={teinte} />;
};

/**
 * VARIANTE C — elements de fond suggerant l'ocean (ancre dans le SUJET, brief §5 :
 * "fond bleu profond ocean, la distance, l'origine maldivienne").
 * Une ligne d'horizon tres subtile + quelques particules lentes evoquant des courants
 * lointains, en arriere-plan du flux principal — jamais devant, jamais nettes.
 */
const FondOcean: React.FC<{ t: number; vb: { w: number; h: number } }> = ({ t, vb }) => {
  const horizonY = vb.h * 0.62;
  // 5 "courants" lents, deterministes (pas de Math.random en render — coherence inter-frames)
  const courants = Array.from({ length: 5 }, (_, i) => {
    const vitesse = 6 + i * 1.7;
    const y = vb.h * (0.15 + i * 0.16);
    const x = ((t * vitesse * 8 + i * 400) % (vb.w + 300)) - 150;
    return { x, y, longueur: 180 + i * 30 };
  });

  return (
    <>
      <rect x={0} y={0} width={vb.w} height={vb.h} fill={TEINTES.fond} />
      <rect x={0} y={0} width={vb.w} height={horizonY} fill="#11304E" opacity={0.35} />
      {courants.map((c, i) => (
        <ellipse
          key={i}
          cx={c.x}
          cy={c.y}
          rx={c.longueur}
          ry={3}
          fill="#1a4266"
          opacity={0.18}
        />
      ))}
    </>
  );
};

/**
 * VARIANTE D — decor dessine (svg-dessinateur), defilement horizontal en boucle.
 * 3 couches a vitesses differentes (parallax) : la plus lointaine bouge le plus
 * lentement, la plus proche le plus vite — c'est ce qui donne la sensation de
 * profondeur, pas la vitesse absolue.
 *
 * ⛔ Le decor fait LARGEUR_DECOR (4800px) pour 1920px affiches : a la vitesse la
 * plus rapide (couche proche), le defilement sur 23s ne doit jamais depasser
 * (LARGEUR_DECOR - VB.w) pour ne jamais montrer le bord du dessin.
 */
const DUREE_PIECE_S = 23.08; // doit rester <= la duree reelle de la piece (cf. animatic-timing.ts)

const FondDecorDessine: React.FC<{ t: number; vb: { w: number; h: number } }> = ({ t, vb }) => {
  const marge = LARGEUR_DECOR - vb.w; // deplacement max possible sans montrer le bord
  const progression = Math.min(1, t / DUREE_PIECE_S);

  // vitesses relatives par couche (parallax) : lointaine lente, proche rapide.
  // Chaque couche reste dans sa marge propre — toutes < marge du dessin total.
  const decalageLointaine = -progression * marge * 0.35;
  const decalageMediane = -progression * marge * 0.62;
  const decalageProche = -progression * marge * 1.0;

  return (
    <>
      <rect x={0} y={0} width={vb.w} height={vb.h} fill={FOND_BASE} />
      <svg
        x={0}
        y={0}
        width={vb.w}
        height={vb.h}
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        style={{ overflow: "hidden" }}
      >
        <g transform={`translate(${decalageLointaine} 0)`}>
          {COUCHE_LOINTAINE.map((f) => (
            <path key={f.id} d={f.d} fill={f.fill} opacity={f.opacity} />
          ))}
        </g>
        <g transform={`translate(${decalageMediane} 0)`}>
          {COUCHE_MEDIANE.map((f) => (
            <path key={f.id} d={f.d} fill={f.fill} opacity={f.opacity} />
          ))}
        </g>
        <g transform={`translate(${decalageProche} 0)`}>
          {COUCHE_PROCHE.map((f) => (
            <path key={f.id} d={f.d} fill={f.fill} opacity={f.opacity} />
          ))}
        </g>
      </svg>
    </>
  );
};

export const FondVivant: React.FC<{
  variante: VarianteFond;
  t: number;
  vb: { w: number; h: number };
  etatNom: string;
  etatPrecedent: string;
  avanceEtat: number;
}> = ({ variante, t, vb, etatNom, etatPrecedent, avanceEtat }) => {
  if (variante === "texture") return <FondTexture t={t} vb={vb} />;
  if (variante === "teinte-par-etat")
    return (
      <FondTeintePourEtat
        etatNom={etatNom}
        etatPrecedent={etatPrecedent}
        avance={avanceEtat}
        vb={vb}
      />
    );
  if (variante === "decor-dessine") return <FondDecorDessine t={t} vb={vb} />;
  return <FondOcean t={t} vb={vb} />;
};

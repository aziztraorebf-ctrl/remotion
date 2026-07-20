/**
 * FiletGemini — filet de peche volumetrique (maillage 3D, plombs sur le rebord, eclaboussures a
 * l'impact). Extrait de l'upgrade Gemini 3.1 Pro (svg-scene-upgrade.py, 2026-07-04, scene
 * PecheurSurpeche16x9) — le filet retenu du mix-and-match (maillage/plombs/eclaboussures credibles,
 * remplace le pointille abstrait du prototype original).
 *
 * GEOMETRIE FIGEE (pas procedurale) : le SVG source dessine le filet en pleine ouverture (apex fixe
 * a l'origine locale ~750,820, base etalee ~1000-1320,900-940) — pas de parametre d'angle/portee
 * dans le dessin lui-meme. Pour l'animer dans une scene (lancer qui progresse de 0 a 1), utiliser le
 * prop `progress` : scale global 0->1 DEPUIS L'APEX (donne un effet "le filet se deploie"), PAS une
 * vraie deformation de la geometrie (a faire evoluer si besoin d'un lancer plus physique).
 *
 * BUG CORRIGE (2026-07-04) : `transform-origin` CSS n'est PAS applique de facon fiable a un scale
 * SVG combine avec un translate dans le meme attribut `transform` (l'ordre translate->scale scale
 * autour de l'origine DEJA translatee, pas du point voulu) — remplace par un vrai scale-autour-d'un-
 * point fait a la main : translate(apex) -> scale(progress) -> translate(-apex), 3 transforms
 * composes dans l'ordre SVG (droite vers gauche = applique en premier).
 *
 * Coordonnees originales recentrees sur l'apex (translate ~750,820 = origine locale 0,0) — l'appelant
 * positionne l'apex a la main du personnage via son propre <g transform>.
 */
import React from "react";

const APEX_X = 750;
const APEX_Y = 820;

export const FiletGemini: React.FC<{ progress?: number; idPrefix?: string }> = ({
  progress = 1,
  idPrefix = "filetGemini",
}) => {
  const s = Math.max(0.05, progress);
  // 2 objectifs composes dans UN SEUL transform (SVG applique droite->gauche) :
  // (1) recentrer l'apex natif (750,820) sur l'origine locale (0,0) — sans ca l'apex sort du cadre
  //     une fois compose avec la position du personnage (bug confirme : y calcule a 1278, hors 1080).
  // (2) scaler la geometrie DEPUIS ce meme apex (effet "se deploie"), pas depuis (0,0) du dessin natif.
  // Ordre applique reellement (droite vers gauche) : translate(-apex) [recentre] -> scale(s) [depuis 0,0
  // deja recentre = depuis l'apex] -> le translate(apex) exterieur n'est PAS necessaire puisque l'apex
  // est deja a 0,0 apres le recentrage ; on ne garde donc que translate(-apex) * scale(s).
  return (
    <g
      transform={`scale(${s}) translate(${-APEX_X} ${-APEX_Y})`}
      opacity={Math.min(1, progress * 3)}
    >
    <defs>
      <pattern id={`${idPrefix}NetPattern`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="#a8c0d8" strokeWidth="1" opacity="0.5" />
      </pattern>
    </defs>

    <ellipse cx={1160} cy={900} rx={160} ry={35} fill="#a8c0d8" opacity={0.05} />

    <path d="M 750 820 Q 950 680 1320 900 C 1320 940, 1000 940, 1000 900 Q 880 780 750 820 Z" fill={`url(#${idPrefix}NetPattern)`} opacity={0.8} />
    <path d="M 750 820 Q 950 680 1320 900 C 1320 940, 1000 940, 1000 900 Q 880 780 750 820 Z" fill="#a8c0d8" opacity={0.1} />

    <path d="M 750 820 Q 920 730 1000 900" stroke="#d0e3f5" strokeWidth={1.5} fill="none" opacity={0.8} />
    <path d="M 750 820 Q 950 710 1060 918" stroke="#d0e3f5" strokeWidth={1.5} fill="none" opacity={0.9} />
    <path d="M 750 820 Q 980 690 1120 930" stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.9} />
    <path d="M 750 820 Q 1020 670 1200 930" stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.9} />
    <path d="M 750 820 Q 1060 660 1280 915" stroke="#d0e3f5" strokeWidth={1.5} fill="none" opacity={0.8} />
    <path d="M 750 820 Q 1090 670 1320 900" stroke="#b5cce0" strokeWidth={1.2} fill="none" opacity={0.7} />

    <path d="M 820 812 Q 880 780 910 825" stroke="#b5cce0" strokeWidth={1} fill="none" opacity={0.7} />
    <path d="M 880 818 Q 970 760 1000 840" stroke="#b5cce0" strokeWidth={1.2} fill="none" opacity={0.7} />
    <path d="M 930 835 Q 1050 740 1090 860" stroke="#d0e3f5" strokeWidth={1.2} fill="none" opacity={0.8} />
    <path d="M 970 860 Q 1120 730 1190 885" stroke="#ffffff" strokeWidth={1.5} fill="none" opacity={0.8} />
    <path d="M 985 880 Q 1180 730 1260 895" stroke="#d0e3f5" strokeWidth={1.2} fill="none" opacity={0.7} />

    <g fill="#1a1d24">
      <circle cx={1000} cy={900} r={3} />
      <circle cx={1030} cy={911} r={3.5} />
      <circle cx={1060} cy={918} r={4} />
      <circle cx={1090} cy={925} r={4.5} />
      <circle cx={1120} cy={930} r={5} />
      <circle cx={1155} cy={932} r={5} />
      <circle cx={1190} cy={930} r={4.5} />
      <circle cx={1220} cy={925} r={4} />
      <circle cx={1250} cy={918} r={3.5} />
      <circle cx={1280} cy={910} r={3} />
      <circle cx={1305} cy={903} r={2.5} />
      <circle cx={1320} cy={898} r={2} />
    </g>

    {progress >= 0.95 && (
      <g>
        <ellipse cx={1160} cy={930} rx={140} ry={12} fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.6} />
        <ellipse cx={1160} cy={930} rx={120} ry={8} fill="none" stroke="#a8c0d8" strokeWidth={1} opacity={0.4} />
        <circle cx={1060} cy={915} r={1.5} fill="#ffffff" />
        <circle cx={1080} cy={910} r={2} fill="#ffffff" />
        <circle cx={1120} cy={920} r={1.5} fill="#ffffff" />
        <circle cx={1155} cy={915} r={2.5} fill="#ffffff" />
        <circle cx={1190} cy={918} r={2} fill="#ffffff" />
        <circle cx={1240} cy={910} r={1.5} fill="#ffffff" />
        <path d="M 1090 925 Q 1095 915 1100 925" stroke="#ffffff" strokeWidth={1} fill="none" />
        <path d="M 1150 932 Q 1155 918 1160 932" stroke="#ffffff" strokeWidth={1.5} fill="none" />
        <path d="M 1210 926 Q 1215 916 1220 926" stroke="#ffffff" strokeWidth={1} fill="none" />
      </g>
    )}
  </g>
  );
};

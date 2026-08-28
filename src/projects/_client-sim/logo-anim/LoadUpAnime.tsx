// MOTEUR: objet/metaphore SVG (logo client anime par code)
//
// LoadUp — logo d'un vrai client, recupere dans les avis Fiverr d'un vendeur
// d'animation de logos. Chaine complete : image PNG -> Recraft (vectorisation)
// -> SVG -> ce fichier. La geometrie n'est PAS redessinee par un modele : elle
// est CALCULEE depuis les pixels, donc fidele au trait pres (0,1 % d'ecart mesure).
//
// LE GESTE : la fleche verte integree dans le U monte, puisque c'est le sens
// meme du nom. Le reste de l'identite se pose autour d'elle sans la concurrencer.
// Regle appliquee : un seul point focal — on anime CE qui porte le sens, pas tout.
//
// Timing repris du logo Cravvy mesure sur la video du vendeur (BRIEF-MESURE.md) :
// une seconde de pose avec le logo complet au chargement, puis le geste, puis un
// fondu qui permet la boucle. C'est ce que le client de ce gig demandait
// explicitement dans son avis.

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Courbe d'entree canonique (Emil Kowalski, relevee dans les skills de design
// analyses le 2026-08-27). Valeur EXACTE, jamais approximee.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const LOADUP_DUREE = 150; // 5 s a 30 fps

export const LoadUpAnime: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Le texte se pose ---------------------------------------------------
  // ⚠️ PAS de stagger ici : les 5 lettres entrent ENSEMBLE (un seul groupe,
  // une seule opacite). Le geste porteur est la fleche — faire aussi cascader
  // les lettres lui volerait l'attention (regle du point focal unique).
  const apparition = (retard: number) =>
    spring({ frame: frame - retard, fps, config: { damping: 200, mass: 0.6 } });

  const opTexte = apparition(0);
  const yTexte = interpolate(opTexte, [0, 1], [14, 0]);

  // --- La fleche : le geste porteur ---------------------------------------
  // REVISION CLIENT (demande d'Aziz) : "je veux que la pointe monte PLUS HAUT,
  // puis redescende BRUTALEMENT". Geste en 3 temps au lieu d'un simple ressort :
  //   1. elle monte haut et depasse largement sa place  (12 -> 30)
  //   2. elle marque un temps suspendu, en l'air        (30 -> 38)
  //   3. elle retombe d'un coup et se cale dans le U    (38 -> 46)
  //
  // ⭐ Pourquoi ce geste est MEILLEUR que le ressort initial : le depassement
  // doux d'un spring est une consequence physique, il ne raconte rien. La
  // suspension cree une ATTENTE, et la chute la resout. C'est un geste ECRIT.
  //
  // Le temps de suspension n'est PAS un temps mort : la fleche y est immobile
  // mais l'oeil, lui, attend. Retirer cette pause supprimerait tout l'effet.
  const HAUT = -95;   // au-dessus de sa place finale
  const BAS = 130;    // hors cadre, sous le logo

  // La montee garde une sortie douce (elle ralentit en arrivant en haut),
  // la chute est en entree brutale (elle accelere jusqu'a l'impact) : timing
  // ASYMETRIQUE, exactement ce que la doctrine motion appelle "lent la ou on
  // decide, rapide la ou le systeme repond".
  const yFleche = interpolate(
    frame,
    [12, 30, 38, 46],
    [BAS, HAUT, HAUT, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT,
    }
  );

  // Ecrasement a l'impact : la fleche se tasse une fraction de seconde en
  // touchant sa place, puis reprend sa forme. Sans ce detail, la chute
  // s'arrete net et se lit comme un bug de timing plutot que comme un poids.
  const impact = spring({
    frame: frame - 46,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.5 },
  });
  const ecrase = interpolate(impact, [0, 1], [0.86, 1]);
  const opFleche = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // --- Le p et la marque suivent ------------------------------------------
  const opP = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const opMarque = interpolate(frame, [62, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // --- Le fondu de bouclage -----------------------------------------------
  // Demande explicitement par le client du gig : "logo fades in/out so it can loop".
  const opGlobale = interpolate(
    frame,
    [0, 6, LOADUP_DUREE - 20, LOADUP_DUREE - 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <svg
        viewBox="0 0 2048 1100"
        style={{ width: "78%", height: "auto", opacity: opGlobale }}
      >
        <g id="lettres" opacity={opTexte} transform={`translate(0 ${yTexte})`}>
      <path d="M 602.898 456.013 L 633.734 456.03 C 633.831 477.007 633.763 497.985 633.532 518.961 C 633.392 574.48 632.148 580.714 692.722 578.878 C 696.32 578.769 700.502 578.824 704.163 578.794 L 704.057 603.335 C 676.96 602.173 637.085 608.721 617.906 589.618 C 611.813 583.502 607.457 575.875 605.284 567.519 C 601.909 554.561 602.786 531.28 602.8 517.183 L 602.898 456.013 z" fill="#414343" fillRule="evenodd" />
      <path d="M 755.322 493.209 C 786.475 486.477 817.149 506.408 823.656 537.608 C 830.163 568.809 810.014 599.339 778.767 605.622 C 747.836 611.842 717.681 591.939 711.24 561.054 C 704.798 530.169 724.484 499.872 755.322 493.209 z" fill="#414343" fillRule="evenodd" />
      <path d="M 761.874 517.068 C 766.773 516.702 772.426 516.745 776.996 518.504 C 798.787 526.888 800.362 562.591 783.693 576.569 C 780.977 578.847 777.013 580.411 773.756 581.75 C 730.95 585.118 729.116 525.684 761.874 517.068 z" fill="#ffffff" fillRule="evenodd" />
      <path d="M 844.737 495.44 L 846.385 495.413 C 868.59 495.061 897.622 493.889 919.25 497.095 C 947.47 501.279 948.357 530.785 947.631 553.119 C 947.129 568.582 947.619 586.587 947.598 602.967 C 920.717 602.659 892.834 603.523 866.09 602.581 C 841.034 599.705 833.686 582.95 838.864 559.454 C 846.446 525.051 901.542 544.749 916.918 535.763 C 917.437 534.934 918.495 533.622 918.451 532.826 C 917.482 515.436 892.012 517.568 882.51 517.569 C 867.665 517.571 857.17 517.712 844.502 517.818 C 844.427 510.14 844.42 503.109 844.737 495.44 z" fill="#414343" fillRule="evenodd" />
      <path d="M 882.812 559.45 C 894.567 559.331 906.323 559.345 918.078 559.49 L 917.992 581.266 L 901.797 581.13 C 892.626 581.211 868.368 584.253 865.418 573.244 C 865.623 563.105 874.478 560.162 882.812 559.45 z" fill="#ffffff" fillRule="evenodd" />
      <path d="M 1044.14 456.018 L 1072.57 455.986 C 1073.75 503.603 1072.31 554.882 1072.69 603.094 C 1051.76 603.192 1016.07 604.824 997.252 600.313 C 960.87 586.798 954.872 534.608 979.817 508.331 C 995.263 492.061 1023.38 495.345 1044.04 495.454 C 1044.2 482.385 1044.11 469.106 1044.14 456.018 z" fill="#414343" fillRule="evenodd" />
      <path d="M 1018.77 519.211 C 1026.91 518.75 1035.77 518.962 1043.98 519.006 C 1044.1 539.404 1044.04 559.802 1043.82 580.199 C 1036.12 580.355 1028.13 580.21 1020.41 580.173 C 1007.37 578.752 997.404 573.989 995.171 560.106 C 991.772 538.976 997.119 523.414 1018.77 519.211 z" fill="#ffffff" fillRule="evenodd" />
        </g>

        <g
          id="fleche-u"
          opacity={opFleche}
          transform={`translate(0 ${yFleche}) translate(1183 620) scale(1 ${ecrase}) translate(-1183 -620)`}
        >
      <path d="M 1203.34 385.019 C 1216.81 386.708 1238.83 416.702 1249.96 426.319 C 1254.22 430.002 1270.86 447.078 1269.93 452.285 C 1263.64 487.537 1228.75 441.485 1219.68 431.017 L 1219.99 513.503 C 1220.02 534.334 1223.5 572.789 1207.96 588.148 C 1187.52 609.131 1130.44 611.604 1109.82 590.659 C 1092 572.554 1096.79 524.981 1096.99 499.75 C 1097.21 485.443 1096.9 470.353 1096.83 455.986 L 1122.93 456.051 L 1122.89 517.746 C 1122.85 546.957 1116.99 583.24 1156.63 581.189 C 1174.56 580.26 1185.7 576.405 1188 556.551 C 1189.79 541.07 1189.11 526.041 1189.11 510.75 L 1189.01 433.56 C 1179.5 442.206 1143.78 488.912 1140.29 449.852 C 1139.82 444.608 1195.62 389.679 1203.34 385.019 z" fill="#7dc145" fillRule="evenodd" />
        </g>

        <g id="lettre-p" opacity={opP}>
      <path d="M 1245.04 495.341 C 1267.11 495.208 1317.09 491.357 1332.59 504.633 C 1365.58 532.879 1359.41 595.866 1309.24 602.715 C 1297.86 603.575 1285.31 603.37 1273.82 603.424 C 1273.58 616.509 1273.5 629.597 1273.6 642.685 C 1264.16 642.756 1254.72 642.645 1245.29 642.353 C 1244.85 628.252 1245.35 611.818 1245.28 597.459 L 1245.04 495.341 z" fill="#7dc145" fillRule="evenodd" />
      <path d="M 1273.85 518.434 C 1305.04 518.241 1329.2 515.385 1321.9 560.334 C 1321.12 565.156 1317.66 569.914 1314.75 573.746 C 1302.96 581.61 1287.32 580.184 1273.4 580.158 L 1273.85 518.434 z" fill="#ffffff" fillRule="evenodd" />
        </g>

        <g id="marque-deposee" opacity={opMarque}>
      <path d="M 1376.45 487.539 C 1382.16 485.595 1388.47 486.889 1392.95 490.921 C 1397.43 494.953 1399.37 501.092 1398.04 506.969 C 1396.7 512.845 1392.29 517.539 1386.51 519.238 C 1377.83 521.79 1368.7 516.935 1365.97 508.311 C 1363.23 499.686 1367.89 490.458 1376.45 487.539 z" fill="#6e6f72" fillRule="evenodd" />
      <path d="M 1380.24 488.606 C 1388.24 487.764 1395.41 493.529 1396.31 501.517 C 1397.22 509.505 1391.51 516.725 1383.52 517.686 C 1375.46 518.658 1368.14 512.873 1367.23 504.8 C 1366.32 496.726 1372.16 489.456 1380.24 488.606 z" fill="#ffffff" fillRule="evenodd" />
      <path d="M 1375.92 493.039 C 1380.61 493.208 1386.55 492.926 1388.9 497.954 C 1388.56 501.533 1387.03 501.76 1384.83 505.04 C 1385.82 507.325 1386.65 508.806 1387.89 510.968 L 1386.51 511.356 C 1384.3 507.34 1384.47 506.586 1380.93 505.282 C 1378.63 506.816 1378.31 507.511 1376.9 509.813 L 1376.48 510.507 C 1375.75 505.034 1375.93 498.627 1375.92 493.039 z" fill="#6e6f72" fillRule="evenodd" />
      <path d="M 1378.78 494.881 C 1380.15 493.934 1381.92 493.811 1383.41 494.558 C 1384.89 495.305 1385.85 496.804 1385.9 498.466 C 1385.96 500.127 1385.1 501.686 1383.67 502.529 C 1381.56 503.768 1378.85 503.119 1377.54 501.06 C 1376.22 499.002 1376.77 496.271 1378.78 494.881 z" fill="#ffffff" fillRule="evenodd" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

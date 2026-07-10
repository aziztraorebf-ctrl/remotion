/**
 * ProtoSolCargoSceneTest — test de scene narrative complete (decor riche) genere par openai/gpt-5.6-sol
 * (memory/tools/openrouter-svg.md, session 2026-07-10), a comparer a CargoVoyage16x9_LibreInspire.tsx.
 * Contrairement au personnage articule (echec esthetique documente le meme jour), Sol excelle sur ce
 * registre DECOR/SCENE STATIQUE RICHE (deja prouve : carte Khartoum, portrait, aigle). Ce proto verifie
 * l'animation de translation simple (bateau qui navigue, soleil qui monte, fumee qui pulse) — PAS de rig
 * articule ici, juste translate/opacity, le registre ou Sol a echoue le moins.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const PROTO_SOL_CARGO_SCENE_TEST_FRAMES = 240;

export const ProtoSolCargoSceneTest: React.FC = () => {
  const frame = useCurrentFrame();
  const EASE = Easing.inOut(Easing.cubic);

  // bateau : navigue de gauche a droite sur toute la duree (suggestedTranslate Sol : x -1050..1550)
  const shipX = interpolate(frame, [0, 240], [400, 950], { extrapolateRight: "clamp", easing: EASE });

  // soleil : monte legerement + derive vers la droite (suggestedTranslate Sol : x 0..1050, y 0..-170)
  const sunX = interpolate(frame, [0, 240], [315, 480], { extrapolateRight: "clamp", easing: EASE });
  const sunY = interpolate(frame, [0, 240], [405, 355], { extrapolateRight: "clamp", easing: EASE });

  // fumee : pulsation opacity+scale legere, independante du deplacement du bateau
  const smokeScale = 1 + Math.sin(frame / 12) * 0.08;
  const smokeOpacity = 0.85 + Math.sin(frame / 12) * 0.15;

  // oiseaux : glissent en diagonale (suggestedTranslate Sol)
  const bird1X = interpolate(frame, [0, 240], [1045, 1045 - 250], { extrapolateRight: "clamp" });
  const bird1Y = interpolate(frame, [0, 240], [250, 250 + 60], { extrapolateRight: "clamp" });
  const bird2X = interpolate(frame, [0, 240], [1260, 1260 - 300], { extrapolateRight: "clamp" });
  const bird2Y = interpolate(frame, [0, 240], [325, 325 + 50], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f4dfb4" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" role="img">
        <defs>
          <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="#f4dfb4" />
            <stop offset={0.48} stopColor="#efc789" />
            <stop offset={0.78} stopColor="#d99a66" />
            <stop offset={1} stopColor="#b96f55" />
          </linearGradient>
          <radialGradient id="sun-bloom" cx="50%" cy="50%" r="50%">
            <stop offset={0} stopColor="#fff7d0" stopOpacity={0.95} />
            <stop offset={0.34} stopColor="#f8d47a" stopOpacity={0.58} />
            <stop offset={0.72} stopColor="#ed9f59" stopOpacity={0.18} />
            <stop offset={1} stopColor="#ed9f59" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="sun-disc" cx="38%" cy="34%" r="68%">
            <stop offset={0} stopColor="#fff9d4" />
            <stop offset={0.58} stopColor="#ffd77a" />
            <stop offset={1} stopColor="#eaa154" />
          </radialGradient>
          <linearGradient id="distant-hill-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="#87684f" />
            <stop offset={1} stopColor="#665341" />
          </linearGradient>
          <linearGradient id="shore-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="#4c5542" />
            <stop offset={1} stopColor="#303f38" />
          </linearGradient>
          <linearGradient id="ocean-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="#254a55" />
            <stop offset={0.18} stopColor="#315d67" />
            <stop offset={0.46} stopColor="#54777a" />
            <stop offset={0.7} stopColor="#668b88" />
            <stop offset={1} stopColor="#416d72" />
          </linearGradient>
          <linearGradient id="near-water-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset={0} stopColor="#dbad72" stopOpacity={0.12} />
            <stop offset={0.38} stopColor="#e8c58e" stopOpacity={0.46} />
            <stop offset={0.7} stopColor="#bfaa7b" stopOpacity={0.25} />
            <stop offset={1} stopColor="#8da09a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="hull-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="#27353a" />
            <stop offset={0.68} stopColor="#18282e" />
            <stop offset={1} stopColor="#101d22" />
          </linearGradient>
          <linearGradient id="container-rust" x1="0" y1="0" x2="1" y2="1">
            <stop offset={0} stopColor="#a5543d" />
            <stop offset={1} stopColor="#69372f" />
          </linearGradient>
          <linearGradient id="container-ochre" x1="0" y1="0" x2="1" y2="1">
            <stop offset={0} stopColor="#bc8246" />
            <stop offset={1} stopColor="#755338" />
          </linearGradient>
          <linearGradient id="container-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset={0} stopColor="#567068" />
            <stop offset={1} stopColor="#314c49" />
          </linearGradient>
          <filter id="blur-32" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={32} />
          </filter>
          <filter id="blur-14" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={14} />
          </filter>
          <filter id="smoke-soften" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3.5} />
          </filter>
          <filter id="ship-shadow" x="-20%" y="-30%" width="150%" height="180%">
            <feDropShadow dx={0} dy={8} stdDeviation={8} floodColor="#10252a" floodOpacity={0.3} />
          </filter>
          <clipPath id="ocean-clip">
            <path d="M0 601 C220 591 410 612 640 600 C860 589 1060 610 1290 598 C1515 585 1715 606 1920 596 L1920 1080 L0 1080 Z" />
          </clipPath>
          <g id="cacao-pod">
            <path d="M0-16 C13-14 18-4 15 10 C12 25 3 33 0 35 C-4 31-13 23-16 10 C-20-4-13-14 0-16 Z" fill="#9c5b32" stroke="#302d27" strokeWidth={3} />
            <path d="M0-13 C-3-2-3 18 0 31 M-8-10 C-12 2-10 17-5 26 M8-10 C12 2 10 17 5 26" fill="none" stroke="#d19a58" strokeWidth={2} strokeLinecap="round" opacity={0.65} />
            <path d="M0-16 C0-21 3-24 7-27" fill="none" stroke="#3d392c" strokeWidth={3} strokeLinecap="round" />
          </g>
          <g id="cacao-tree">
            <path d="M0 120 C-7 84-3 47 1 0 M1 55 C-15 37-25 24-38 14 M2 42 C19 26 28 13 36-4" fill="none" stroke="#382f28" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-42 18 C-76 13-89-7-74-24 C-54-46-20-34-8-12 C-20-40 3-61 29-53 C51-47 57-27 45-9 C70-18 89-3 85 17 C81 38 55 45 34 36 C23 58-8 61-23 43 C-48 50-68 39-67 25 Z" fill="#43523a" stroke="#2e352c" strokeWidth={5} strokeLinejoin="round" />
            <path d="M-66-12 C-38-2-13 6 19 8 M-34-35 C-17-18-6-3 0 22 M39-35 C25-16 15-3 7 22 M69 8 C45 11 29 18 16 28" fill="none" stroke="#69704d" strokeWidth={3} strokeLinecap="round" opacity={0.65} />
            <ellipse cx={-47} cy={-17} rx={24} ry={13} fill="#566344" opacity={0.7} transform="rotate(-18 -47 -17)" />
            <ellipse cx={35} cy={-25} rx={25} ry={14} fill="#596847" opacity={0.65} transform="rotate(17 35 -25)" />
            <ellipse cx={48} cy={21} rx={23} ry={12} fill="#394a36" opacity={0.75} transform="rotate(-12 48 21)" />
          </g>
        </defs>

        <g id="static-background">
          <rect width={1920} height={1080} fill="url(#sky-gradient)" />
          <path d="M0 272 C210 226 408 245 600 272 C810 302 1010 287 1190 247 C1415 197 1645 207 1920 248" fill="none" stroke="#fff0c8" strokeWidth={42} strokeLinecap="round" opacity={0.11} />
          <path d="M1040 350 C1230 324 1390 341 1570 312 C1690 293 1810 294 1920 313" fill="none" stroke="#fff5dc" strokeWidth={18} strokeLinecap="round" opacity={0.16} />
        </g>

        {/* SUN : translate anime (position dynamique, PAS de rotation) */}
        <g id="sun" transform={`translate(${sunX} ${sunY})`}>
          <circle cx={0} cy={0} r={186} fill="url(#sun-bloom)" filter="url(#blur-32)" opacity={0.72} />
          <circle cx={0} cy={0} r={126} fill="#f5bb64" opacity={0.17} filter="url(#blur-14)" />
          <circle cx={0} cy={0} r={86} fill="none" stroke="#ffe2a1" strokeWidth={9} opacity={0.26} />
          <circle cx={0} cy={0} r={61} fill="url(#sun-disc)" stroke="#c87845" strokeWidth={4} />
          <path d="M-39-10 C-14-25 18-26 40-10" fill="none" stroke="#fff3bf" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
        </g>

        <g id="bird-1" transform={`translate(${bird1X} ${bird1Y})`}>
          <path d="M-31 6 Q-15-11 0 1 Q15-13 34 4 Q16-3 1 10 Q-15-1-31 6 Z" fill="#3c3b35" stroke="#292b28" strokeWidth={3} strokeLinejoin="round" />
        </g>
        <g id="bird-2" transform={`translate(${bird2X} ${bird2Y})`}>
          <path d="M-23 4 Q-11-8 0 1 Q12-10 26 3 Q12-2 1 8 Q-11 0-23 4 Z" fill="#4a4740" stroke="#302f2c" strokeWidth={2.5} strokeLinejoin="round" opacity={0.88} />
        </g>

        <g id="static-landscape">
          <path d="M0 529 C139 466 262 478 388 518 C533 565 659 492 797 493 C931 494 1020 550 1158 518 C1310 483 1408 469 1538 506 C1684 548 1780 483 1920 474 L1920 628 L0 628 Z" fill="url(#distant-hill-gradient)" stroke="#554638" strokeWidth={5} />
          <path d="M0 556 C125 530 214 543 317 568 C434 596 544 552 660 554 C813 557 905 595 1047 570 C1203 543 1343 546 1484 569 C1628 593 1761 541 1920 550 L1920 653 L0 653 Z" fill="#59604b" opacity={0.72} />

          <g id="cacao-grove">
            {[
              [96, 474, 0.72, -10, 55, 0.65, -9],
              [221, 454, 0.95, -9, 52, 0.72, -8],
              [365, 492, 0.68, 8, 59, 0.67, 8],
              [520, 457, 0.92, -11, 50, 0.68, -10],
              [697, 486, 0.7, -8, 57, 0.66, -7],
              [875, 473, 0.84, 7, 54, 0.72, 7],
              [1070, 493, 0.66, -7, 55, 0.67, -6],
              [1240, 459, 0.92, -9, 51, 0.7, -8],
              [1435, 486, 0.7, 8, 59, 0.68, 8],
              [1605, 462, 0.88, -10, 52, 0.7, -10],
              [1786, 480, 0.75, 7, 58, 0.66, 7],
            ].map(([x, y, s, px, py, ps, rot], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <use href="#cacao-tree" />
                <use href="#cacao-pod" transform={`translate(${px} ${py}) scale(${ps}) rotate(${rot})`} />
              </g>
            ))}
          </g>

          <path d="M0 589 C170 575 322 601 472 587 C650 571 796 606 958 589 C1135 571 1298 604 1459 585 C1620 566 1754 591 1920 579 L1920 654 L0 654 Z" fill="url(#shore-gradient)" stroke="#303c36" strokeWidth={5} />
          <path d="M0 607 C260 593 412 621 640 605 C869 589 1049 618 1276 602 C1510 586 1699 612 1920 598 L1920 1080 L0 1080 Z" fill="url(#ocean-gradient)" />

          <g id="ocean-bands" clipPath="url(#ocean-clip)">
            <path d="M0 622 C250 607 430 629 661 616 C891 603 1061 631 1304 615 C1530 601 1734 622 1920 609 L1920 690 C1683 700 1495 676 1271 693 C1044 710 852 680 629 697 C405 713 211 688 0 701 Z" fill="#244853" opacity={0.92} />
            <path d="M0 699 C250 681 452 714 673 696 C900 677 1094 716 1326 697 C1540 680 1742 706 1920 694 L1920 797 C1700 808 1499 782 1271 801 C1058 818 862 783 631 804 C405 824 203 792 0 812 Z" fill="#3d6970" opacity={0.8} />
            <path d="M0 802 C247 782 436 820 677 800 C900 781 1103 822 1343 800 C1557 780 1742 808 1920 797 L1920 921 C1702 935 1493 901 1268 925 C1041 948 837 908 617 930 C395 952 185 920 0 937 Z" fill="#6b8d87" opacity={0.72} />
            <path d="M0 913 C242 898 442 935 664 915 C900 894 1103 943 1332 916 C1534 892 1736 930 1920 913 L1920 1080 L0 1080 Z" fill="#47767a" opacity={0.76} />
            <ellipse cx={575} cy={745} rx={525} ry={185} fill="url(#near-water-glow)" opacity={0.66} />
          </g>

          <g id="wave-texture" clipPath="url(#ocean-clip)" fill="none" strokeLinecap="round">
            <path d="M30 641 Q112 627 195 641 T365 639 M416 651 Q501 636 586 649 T756 646 M840 638 Q918 625 1004 641 T1187 638 M1284 650 Q1382 630 1469 647 T1642 645 M1711 631 Q1814 620 1900 635" stroke="#8ba09a" strokeWidth={4} opacity={0.38} />
            <path d="M88 704 Q164 688 246 704 T421 704 M520 721 Q614 699 714 718 T902 716 M1001 695 Q1096 679 1190 698 T1372 696 M1452 718 Q1550 695 1654 715 T1882 710" stroke="#b9b194" strokeWidth={5} opacity={0.31} />
            <path d="M5 779 Q95 760 194 779 T392 776 M470 795 Q567 772 672 793 T877 790 M946 774 Q1041 755 1143 777 T1345 774 M1435 794 Q1537 771 1647 791 T1898 785" stroke="#c3c0a6" strokeWidth={6} opacity={0.32} />
            <path d="M53 866 Q157 840 273 865 T500 861 M593 883 Q710 854 829 881 T1065 878 M1150 856 Q1260 834 1377 860 T1608 858 M1697 878 Q1801 853 1910 873" stroke="#d4ceb1" strokeWidth={6} opacity={0.28} />
            <path d="M0 971 Q117 943 249 970 T510 967 M603 990 Q721 958 858 987 T1127 983 M1210 960 Q1331 936 1461 965 T1715 961 M1790 982 Q1856 965 1920 973" stroke="#a8b9ae" strokeWidth={7} opacity={0.3} />
            <path d="M250 681 l80-2 M355 749 l124-3 M726 669 l87-1 M1105 747 l132-3 M1510 673 l91-1 M1650 834 l151-4 M106 904 l134-4 M723 949 l171-4 M1205 1008 l194-5" stroke="#e6d2a5" strokeWidth={4} opacity={0.32} />
          </g>
        </g>

        {/* SHIP : translate anime (navigation, PAS de rig articule) */}
        <g id="ship" transform={`translate(${shipX} 585)`} filter="url(#ship-shadow)">
          {/* SMOKE-WISP : pulsation independante du deplacement du bateau */}
          <g id="smoke-wisp" transform={`translate(73 -47) scale(${smokeScale})`} opacity={smokeOpacity}>
            <path d="M0 19 C-14 4-4-9 13-12 C5-28 20-42 39-35 C47-54 74-51 82-34 C102-38 116-22 109-7 C127 5 117 23 99 24 C80 27 66 17 51 20 C30 25 14 32 0 19 Z" fill="#565b58" opacity={0.22} filter="url(#smoke-soften)" />
            <path d="M4 18 C-7 6 4-5 19-6 C13-19 27-29 42-22 C50-36 69-31 72-18 C91-22 99-8 92 4 C77 11 63 6 50 11 C34 17 19 27 4 18 Z" fill="#464b49" opacity={0.38} />
            <path d="M12 14 C20 6 29 5 39 8 C49 10 58 6 64-1" fill="none" stroke="#757772" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
          </g>

          <g id="ship-rigid-body">
            <path d="M45 75 L45 20 L101 20 L114 75 Z" fill="#d6c4a2" stroke="#19272c" strokeWidth={5} strokeLinejoin="round" />
            <path d="M59 32 H89 V45 H59 Z M59 53 H95 V66 H59 Z" fill="#41626a" stroke="#19272c" strokeWidth={3} />
            <path d="M65 20 L65-12 H96 L103 20 Z" fill="#704338" stroke="#19272c" strokeWidth={5} />
            <path d="M70-8 H92" stroke="#d89b57" strokeWidth={5} />

            <g id="containers" stroke="#2b302d" strokeWidth={4} strokeLinejoin="round">
              <g transform="translate(130 26)"><rect width={100} height={49} rx={2} fill="url(#container-rust)" /><path d="M12 4 V45 M28 4 V45 M45 4 V45 M62 4 V45 M79 4 V45 M94 4 V45" stroke="#ca7552" strokeWidth={2} opacity={0.46} /></g>
              <g transform="translate(232 26)"><rect width={104} height={49} rx={2} fill="url(#container-ochre)" /><path d="M13 4 V45 M31 4 V45 M49 4 V45 M67 4 V45 M85 4 V45" stroke="#d5a766" strokeWidth={2} opacity={0.48} /></g>
              <g transform="translate(338 26)"><rect width={105} height={49} rx={2} fill="url(#container-green)" /><path d="M13 4 V45 M31 4 V45 M49 4 V45 M67 4 V45 M85 4 V45" stroke="#789087" strokeWidth={2} opacity={0.4} /></g>
              <g transform="translate(445 26)"><rect width={91} height={49} rx={2} fill="url(#container-rust)" /><path d="M12 4 V45 M29 4 V45 M46 4 V45 M63 4 V45 M80 4 V45" stroke="#c57151" strokeWidth={2} opacity={0.45} /></g>
              <g transform="translate(183 -25)"><rect width={101} height={49} rx={2} fill="url(#container-green)" /><path d="M13 4 V45 M31 4 V45 M49 4 V45 M67 4 V45 M85 4 V45" stroke="#80958b" strokeWidth={2} opacity={0.42} /></g>
              <g transform="translate(286 -25)"><rect width={101} height={49} rx={2} fill="url(#container-rust)" /><path d="M13 4 V45 M31 4 V45 M49 4 V45 M67 4 V45 M85 4 V45" stroke="#cf7855" strokeWidth={2} opacity={0.44} /></g>
              <g transform="translate(389 -25)"><rect width={98} height={49} rx={2} fill="url(#container-ochre)" /><path d="M13 4 V45 M31 4 V45 M49 4 V45 M67 4 V45 M85 4 V45" stroke="#d5a364" strokeWidth={2} opacity={0.45} /></g>
            </g>

            <path d="M9 74 H579 L636 96 L604 143 Q594 157 570 160 H105 Q70 159 50 145 L22 118 Z" fill="url(#hull-gradient)" stroke="#101c20" strokeWidth={7} strokeLinejoin="round" />
            <path d="M15 76 H578 L616 91 H25 Z" fill="#425157" stroke="#17272d" strokeWidth={5} strokeLinejoin="round" />
            <path d="M52 130 Q175 142 306 137 T584 130" fill="none" stroke="#b66345" strokeWidth={11} strokeLinecap="round" />
            <path d="M77 146 Q222 153 372 149 T585 144" fill="none" stroke="#e0a167" strokeWidth={3.5} strokeLinecap="round" opacity={0.72} />

            <g fill="#d7c18e" stroke="#111d21" strokeWidth={3}>
              <circle cx={109} cy={106} r={6} /><circle cx={147} cy={107} r={6} /><circle cx={185} cy={108} r={6} />
              <circle cx={520} cy={108} r={6} /><circle cx={555} cy={106} r={6} />
            </g>

            <path d="M102 73 V56 M535 74 V55" stroke="#1d2b30" strokeWidth={5} strokeLinecap="round" />
            <path d="M92 56 H113 M525 55 H546" stroke="#d5bd8b" strokeWidth={4} strokeLinecap="round" />
            <path d="M615 95 L645 87" fill="none" stroke="#1a272c" strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>

        <g id="foreground-wave-accents" fill="none" strokeLinecap="round">
          <path d="M334 743 Q432 724 529 742 T724 741" stroke="#e6c596" strokeWidth={6} opacity={0.45} />
          <path d="M760 760 Q849 741 950 760 T1153 757" stroke="#d6c49d" strokeWidth={5} opacity={0.34} />
          <path d="M1219 723 Q1314 706 1410 724 T1604 721" stroke="#abb3a2" strokeWidth={5} opacity={0.32} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

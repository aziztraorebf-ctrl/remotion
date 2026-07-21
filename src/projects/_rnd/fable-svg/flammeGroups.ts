// Groupes SVG de la scene flamme/braise generee par Fable 5.
// Matiere statique du LLM ; animation en JSX par frame (doctrine SVG).
// Chaque flamme / volute est un groupe separe -> anime independamment.

export const FLAMME_DEFS = `
  <radialGradient id="grad-fond" cx="50%" cy="78%" r="85%">
    <stop offset="0%" stop-color="#2a1608"/><stop offset="45%" stop-color="#211106"/><stop offset="100%" stop-color="#1a0e06"/>
  </radialGradient>
  <radialGradient id="grad-lueur" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffb84a" stop-opacity="0.55"/><stop offset="35%" stop-color="#e8721e" stop-opacity="0.30"/>
    <stop offset="70%" stop-color="#8a2a12" stop-opacity="0.12"/><stop offset="100%" stop-color="#8a2a12" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="grad-lueur-sol" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffcf5a" stop-opacity="0.40"/><stop offset="60%" stop-color="#d6552e" stop-opacity="0.14"/><stop offset="100%" stop-color="#d6552e" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="grad-flamme-arriere" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#d6552e"/><stop offset="45%" stop-color="#a33518"/><stop offset="100%" stop-color="#8a2a12"/>
  </linearGradient>
  <linearGradient id="grad-flamme-corps" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#ffb84a"/><stop offset="40%" stop-color="#e8721e"/><stop offset="80%" stop-color="#d6552e"/><stop offset="100%" stop-color="#8a2a12"/>
  </linearGradient>
  <linearGradient id="grad-flamme-coeur" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#fff3cd"/><stop offset="35%" stop-color="#ffe39a"/><stop offset="75%" stop-color="#ffb84a"/><stop offset="100%" stop-color="#e8721e"/>
  </linearGradient>
  <linearGradient id="grad-flamme-haute" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#ffcf5a"/><stop offset="50%" stop-color="#e8721e"/><stop offset="100%" stop-color="#8a2a12"/>
  </linearGradient>
  <radialGradient id="grad-braise-sol" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffe39a"/><stop offset="55%" stop-color="#e8721e"/><stop offset="100%" stop-color="#8a2a12"/>
  </radialGradient>
  <linearGradient id="grad-buche" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#3a1c0a"/><stop offset="45%" stop-color="#5a2a10"/><stop offset="60%" stop-color="#8a2a12"/><stop offset="100%" stop-color="#2a1206"/>
  </linearGradient>
  <linearGradient id="grad-fumee" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#5a4a3a" stop-opacity="0.30"/><stop offset="55%" stop-color="#4a3c30" stop-opacity="0.18"/><stop offset="100%" stop-color="#3a3228" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="grad-volute" cx="50%" cy="55%" r="55%">
    <stop offset="0%" stop-color="#5a4a3a" stop-opacity="0.22"/><stop offset="60%" stop-color="#4a3c30" stop-opacity="0.12"/><stop offset="100%" stop-color="#3a3228" stop-opacity="0"/>
  </radialGradient>
  <filter id="flou-doux" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="flou-fumee" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="flou-lueur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
`;

export const FLAMME_FOND = `
  <rect x="0" y="0" width="1920" height="1080" fill="url(#grad-fond)"/>
  <ellipse cx="960" cy="1030" rx="900" ry="140" fill="#120a04" opacity="0.8"/>
`;

export const FLAMME_LUEUR = `
  <ellipse cx="960" cy="760" rx="640" ry="440" fill="url(#grad-lueur)" filter="url(#flou-lueur)"/>
  <ellipse cx="960" cy="950" rx="520" ry="110" fill="url(#grad-lueur-sol)" filter="url(#flou-doux)"/>
`;

export const FLAMME_FOYER = `
  <path fill="url(#grad-buche)" d="M 700 965 C 760 940 900 930 1010 935 C 1120 940 1200 950 1245 968 C 1255 985 1240 1000 1200 1005 C 1080 1018 840 1018 745 1002 C 705 995 692 978 700 965 Z"/>
  <path fill="url(#grad-buche)" transform="rotate(-6 960 985)" d="M 760 985 C 830 968 1000 962 1090 968 C 1160 972 1195 982 1200 994 C 1198 1006 1160 1012 1090 1014 C 980 1018 830 1014 775 1004 C 750 998 748 990 760 985 Z"/>
  <ellipse cx="960" cy="972" rx="230" ry="26" fill="url(#grad-braise-sol)" opacity="0.9" filter="url(#flou-doux)"/>
  <ellipse cx="850" cy="985" rx="70" ry="12" fill="#ffcf5a" opacity="0.5" filter="url(#flou-doux)"/>
  <ellipse cx="1075" cy="988" rx="60" ry="10" fill="#ffb84a" opacity="0.45" filter="url(#flou-doux)"/>
`;

// Chaque flamme : pivot (bas, point d'ancrage du sway) + contenu.
export const FLAMMES: { id: string; pivotX: number; pivotY: number; amp: number; phase: number; content: string }[] = [
  { id: "arriere1", pivotX: 810, pivotY: 945, amp: 2.2, phase: 0.4, content: `
    <path fill="url(#grad-flamme-arriere)" filter="url(#flou-doux)" d="M 780 930 C 740 850 770 780 745 710 C 728 660 760 610 748 555 C 790 600 782 660 805 705 C 830 755 810 810 840 860 C 862 897 845 930 815 945 C 800 950 788 944 780 930 Z"/>` },
  { id: "arriere2", pivotX: 1200, pivotY: 948, amp: 2.4, phase: 1.7, content: `
    <path fill="url(#grad-flamme-arriere)" filter="url(#flou-doux)" d="M 1145 935 C 1185 855 1155 790 1185 720 C 1205 672 1178 615 1200 560 C 1235 615 1215 670 1235 720 C 1256 772 1230 825 1252 875 C 1268 912 1245 942 1212 948 C 1180 952 1152 950 1145 935 Z"/>` },
  { id: "flamme1", pivotX: 890, pivotY: 966, amp: 3.0, phase: 0, content: `
    <path fill="url(#grad-flamme-corps)" d="M 855 950 C 800 870 840 800 815 730 C 795 675 835 625 818 565 C 805 520 840 480 830 430 C 878 480 862 535 888 585 C 912 632 890 685 920 735 C 948 782 925 840 958 890 C 982 927 962 958 925 966 C 895 971 868 968 855 950 Z"/>
    <path fill="url(#grad-flamme-coeur)" opacity="0.95" d="M 878 945 C 845 885 875 830 860 775 C 848 730 878 690 868 640 C 900 685 888 730 908 772 C 928 815 910 858 932 900 C 948 930 932 952 908 956 C 892 958 884 954 878 945 Z"/>` },
  { id: "flamme2", pivotX: 975, pivotY: 962, amp: 3.6, phase: 2.4, content: `
    <path fill="url(#grad-flamme-corps)" d="M 935 955 C 880 860 925 780 900 695 C 880 628 925 570 908 500 C 895 445 935 395 922 330 C 975 390 955 455 985 515 C 1012 570 988 632 1020 690 C 1050 745 1025 810 1058 865 C 1085 910 1062 950 1020 962 C 985 970 950 972 935 955 Z"/>
    <path fill="url(#grad-flamme-coeur)" d="M 958 948 C 920 875 955 815 938 750 C 925 698 958 650 948 590 C 985 645 968 700 992 750 C 1015 798 995 848 1020 895 C 1038 928 1020 950 992 956 C 972 960 964 958 958 948 Z"/>
    <path fill="#fff3cd" opacity="0.85" d="M 972 945 C 950 895 972 855 962 810 C 955 775 975 745 970 705 C 992 745 982 782 996 818 C 1010 852 998 888 1012 915 C 1022 936 1010 948 995 950 C 983 951 976 950 972 945 Z"/>` },
  { id: "flamme3", pivotX: 1095, pivotY: 960, amp: 3.2, phase: 1.1, content: `
    <path fill="url(#grad-flamme-haute)" d="M 1055 950 C 1020 880 1055 820 1038 755 C 1025 705 1060 660 1048 605 C 1090 655 1075 705 1098 750 C 1120 795 1100 845 1128 890 C 1150 925 1132 952 1098 960 C 1075 964 1062 962 1055 950 Z"/>
    <path fill="url(#grad-flamme-coeur)" opacity="0.9" d="M 1072 945 C 1050 895 1075 852 1062 808 C 1053 775 1075 745 1068 705 C 1095 745 1085 782 1100 818 C 1113 850 1100 885 1115 912 C 1125 933 1112 948 1094 951 C 1082 953 1076 951 1072 945 Z"/>` },
  { id: "flamme4", pivotX: 850, pivotY: 962, amp: 2.8, phase: 3.0, content: `
    <path fill="url(#grad-flamme-haute)" d="M 812 952 C 785 895 812 848 800 795 C 790 752 818 715 808 665 C 845 708 832 752 852 792 C 872 832 855 875 878 912 C 895 940 880 958 852 962 C 830 964 818 960 812 952 Z"/>
    <path fill="url(#grad-flamme-coeur)" opacity="0.85" d="M 828 946 C 812 906 830 872 822 838 C 816 812 832 788 826 755 C 848 788 840 818 852 846 C 863 872 852 900 864 922 C 872 938 862 950 848 952 C 838 953 832 951 828 946 Z"/>` },
];

// Volutes de fumee : partent du haut des flammes, montent + se dissipent.
export const FUMEES: { id: string; baseY: number; phase: number; content: string }[] = [
  { id: "fumee1", baseY: 445, phase: 0, content: `
    <path fill="url(#grad-fumee)" filter="url(#flou-fumee)" d="M 905 430 C 860 360 900 300 870 240 C 845 190 880 130 850 80 C 900 110 895 175 925 215 C 960 262 930 320 965 370 C 985 400 970 425 950 445 C 935 452 915 448 905 430 Z"/>
    <path fill="url(#grad-volute)" filter="url(#flou-fumee)" d="M 872 210 C 830 180 828 120 872 96 C 916 74 958 116 936 158 C 920 188 896 196 872 210 Z"/>` },
  { id: "fumee2", baseY: 495, phase: 1.5, content: `
    <path fill="url(#grad-fumee)" filter="url(#flou-fumee)" d="M 1080 470 C 1120 400 1085 340 1130 285 C 1170 236 1145 170 1190 125 C 1200 185 1165 230 1178 285 C 1190 340 1140 385 1150 440 C 1156 472 1130 495 1105 495 C 1088 493 1076 484 1080 470 Z"/>
    <path fill="url(#grad-volute)" filter="url(#flou-fumee)" d="M 1198 150 C 1246 128 1292 160 1280 206 C 1268 250 1210 254 1188 218 C 1174 194 1182 168 1198 150 Z"/>` },
  { id: "fumee3", baseY: 412, phase: 2.8, content: `
    <path fill="url(#grad-fumee)" filter="url(#flou-fumee)" d="M 975 380 C 995 320 960 270 990 215 C 1015 170 990 110 1025 60 C 1045 115 1015 165 1035 215 C 1055 268 1015 315 1030 365 C 1038 395 1015 415 995 412 C 980 408 970 396 975 380 Z"/>
    <path fill="url(#grad-volute)" filter="url(#flou-fumee)" d="M 1020 90 C 1058 66 1104 92 1096 134 C 1088 172 1040 180 1018 150 C 1004 130 1008 108 1020 90 Z"/>` },
];

// Braises : chaque point monte en boucle (position de depart pres du foyer).
export const BRAISES: { x: number; y0: number; r: number; color: string; phase: number }[] = [
  { x: 905, y0: 880, r: 5, color: "#ffcf5a", phase: 0 },
  { x: 1010, y0: 845, r: 4, color: "#ffe39a", phase: 0.7 },
  { x: 862, y0: 790, r: 3.5, color: "#ffcf5a", phase: 1.3 },
  { x: 1068, y0: 760, r: 4.5, color: "#ffb84a", phase: 2.0 },
  { x: 948, y0: 720, r: 3, color: "#ffe39a", phase: 2.6 },
  { x: 1105, y0: 655, r: 3.5, color: "#ffcf5a", phase: 3.1 },
  { x: 885, y0: 640, r: 2.8, color: "#ffcf5a", phase: 0.4 },
  { x: 1002, y0: 580, r: 3, color: "#ffe39a", phase: 1.8 },
  { x: 930, y0: 512, r: 2.5, color: "#ffcf5a", phase: 2.3 },
  { x: 1078, y0: 470, r: 2.6, color: "#ffb84a", phase: 0.9 },
];

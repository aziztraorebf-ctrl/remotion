// SVG statique genere par Fable 5 - scene "3 piliers au-dessus du gouffre" (v2)
// Decoupe en groupes nommes, anime cote code Remotion. Ne pas editer a la main.
export const PILIERS_GOUFFRE_SVG = `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gVoid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#182746" stop-opacity="0"/>
      <stop offset="0.14" stop-color="#0b1628" stop-opacity="0.92"/>
      <stop offset="0.4" stop-color="#050b16"/>
      <stop offset="1" stop-color="#02050b"/>
    </linearGradient>
    <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0e8d2" stop-opacity="0.6"/>
      <stop offset="0.16" stop-color="#f0e8d2" stop-opacity="0.38"/>
      <stop offset="0.42" stop-color="#f0e8d2" stop-opacity="0.15"/>
      <stop offset="0.72" stop-color="#f0e8d2" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#f0e8d2" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="gSpur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0e8d2" stop-opacity="0.58"/>
      <stop offset="0.3" stop-color="#f0e8d2" stop-opacity="0.32"/>
      <stop offset="0.6" stop-color="#f0e8d2" stop-opacity="0.12"/>
      <stop offset="0.85" stop-color="#f0e8d2" stop-opacity="0.02"/>
      <stop offset="1" stop-color="#f0e8d2" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="gFut" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f0e8d2" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#f0e8d2" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#f0e8d2" stop-opacity="0.62"/>
    </linearGradient>
    <linearGradient id="gUnder" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0e8d2" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#f0e8d2" stop-opacity="0.06"/>
    </linearGradient>
    <radialGradient id="gVignette" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0" stop-color="#182746" stop-opacity="0"/>
      <stop offset="0.72" stop-color="#121e38" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#0a1224" stop-opacity="0.5"/>
    </radialGradient>
    <radialGradient id="gHalo" cx="0.5" cy="0.3" r="0.55">
      <stop offset="0" stop-color="#f0e8d2" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#f0e8d2" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <g id="fond">
    <rect x="0" y="0" width="1920" height="1080" fill="#182746"/>
    <rect x="0" y="0" width="1920" height="1080" fill="url(#gHalo)"/>
    <rect x="0" y="0" width="1920" height="1080" fill="url(#gVignette)"/>
  </g>

  <g id="gouffre">
    <g id="gouffre-noir">
      <rect x="0" y="600" width="1920" height="480" fill="url(#gVoid)"/>
      <path d="M 430 952 L 640 938 L 850 950" fill="none" stroke="#f0e8d2" stroke-opacity="0.05" stroke-width="2"/>
      <path d="M 1010 992 L 1240 978 L 1470 990" fill="none" stroke="#f0e8d2" stroke-opacity="0.04" stroke-width="2"/>
      <path d="M 640 1024 L 900 1012 L 1160 1022" fill="none" stroke="#f0e8d2" stroke-opacity="0.03" stroke-width="2"/>
      <polygon points="562,900 574,893 580,906 568,911" fill="#f0e8d2" opacity="0.22"/>
      <polygon points="1098,930 1108,924 1113,936 1102,940" fill="#f0e8d2" opacity="0.18"/>
      <polygon points="1122,978 1130,973 1134,983 1124,986" fill="#f0e8d2" opacity="0.12"/>
      <polygon points="596,978 604,973 608,983 598,986" fill="#f0e8d2" opacity="0.1"/>
    </g>
    <g id="gouffre-levre-gauche">
      <polygon fill="url(#gWall)" points="0,648 60,640 120,652 180,638 236,654 285,644 296,700 272,756 300,824 276,896 298,968 280,1040 286,1080 0,1080"/>
      <polygon fill="#f0e8d2" opacity="0.32" points="0,648 60,640 120,652 180,638 236,654 285,644 292,668 236,678 180,664 120,676 60,666 0,672"/>
      <path d="M 0 648 L 60 640 L 120 652 L 180 638 L 236 654 L 285 644" fill="none" stroke="#f0e8d2" stroke-opacity="0.9" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 285 644 L 296 700 L 272 756 L 300 824" fill="none" stroke="#f0e8d2" stroke-opacity="0.5" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 300 824 L 276 896 L 298 968" fill="none" stroke="#f0e8d2" stroke-opacity="0.18" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="285,644 305,652 288,672" fill="#f0e8d2" opacity="0.5"/>
      <polygon points="292,700 310,706 296,724" fill="#f0e8d2" opacity="0.4"/>
      <polygon points="318,742 338,736 344,758 324,764" fill="#f0e8d2" opacity="0.4"/>
      <polygon points="306,830 320,826 324,842 308,846" fill="#f0e8d2" opacity="0.26"/>
      <polygon points="338,896 350,892 352,904 340,908" fill="#f0e8d2" opacity="0.14"/>
      <path d="M 40 656 l 34 7 M 130 662 l 30 -6 M 200 652 l 30 8" fill="none" stroke="#0b1526" stroke-opacity="0.55" stroke-width="2"/>
      <path d="M 66 650 l 18 -8 M 96 656 l 18 -8 M 156 648 l 18 -8 M 216 660 l 18 -8 M 252 652 l 16 -7" fill="none" stroke="#f0e8d2" stroke-opacity="0.22" stroke-width="2"/>
      <path d="M 252 700 l 24 -13 M 258 722 l 24 -13 M 264 744 l 22 -12 M 276 786 l 20 -11 M 282 808 l 20 -11" fill="none" stroke="#0a1424" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M 250 772 l 20 -10 M 286 852 l 16 -9 M 280 874 l 16 -9" fill="none" stroke="#f0e8d2" stroke-opacity="0.1" stroke-width="2"/>
      <path d="M 170 646 L 186 668 L 178 690" fill="none" stroke="#0a1424" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g id="gouffre-levre-droite">
      <polygon fill="url(#gWall)" points="1920,652 1860,644 1800,656 1740,642 1690,656 1636,646 1624,702 1648,760 1620,828 1644,900 1622,972 1640,1044 1636,1080 1920,1080"/>
      <polygon fill="#f0e8d2" opacity="0.32" points="1920,652 1860,644 1800,656 1740,642 1690,656 1636,646 1630,670 1690,680 1740,666 1800,678 1860,668 1920,676"/>
      <path d="M 1920 652 L 1860 644 L 1800 656 L 1740 642 L 1690 656 L 1636 646" fill="none" stroke="#f0e8d2" stroke-opacity="0.9" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 1636 646 L 1624 702 L 1648 760 L 1620 828" fill="none" stroke="#f0e8d2" stroke-opacity="0.5" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 1620 828 L 1644 900 L 1622 972" fill="none" stroke="#f0e8d2" stroke-opacity="0.18" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="1636,646 1616,654 1632,674" fill="#f0e8d2" opacity="0.5"/>
      <polygon points="1628,704 1610,710 1624,728" fill="#f0e8d2" opacity="0.4"/>
      <polygon points="1596,748 1616,742 1610,766 1590,760" fill="#f0e8d2" opacity="0.4"/>
      <polygon points="1608,834 1622,830 1618,846 1604,850" fill="#f0e8d2" opacity="0.26"/>
      <polygon points="1580,900 1592,896 1590,908 1578,912" fill="#f0e8d2" opacity="0.14"/>
      <path d="M 1846 660 l 34 7 M 1760 666 l 30 -6 M 1690 662 l 30 8" fill="none" stroke="#0b1526" stroke-opacity="0.55" stroke-width="2"/>
      <path d="M 1836 652 l 18 -8 M 1806 660 l 18 -8 M 1746 650 l 18 -8 M 1706 662 l 18 -8 M 1662 654 l 16 -7" fill="none" stroke="#f0e8d2" stroke-opacity="0.22" stroke-width="2"/>
      <path d="M 1644 702 l 24 -13 M 1650 724 l 24 -13 M 1656 746 l 22 -12 M 1638 788 l 20 -11 M 1632 810 l 20 -11" fill="none" stroke="#0a1424" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M 1660 774 l 20 -10 M 1630 854 l 16 -9 M 1636 876 l 16 -9" fill="none" stroke="#f0e8d2" stroke-opacity="0.1" stroke-width="2"/>
      <path d="M 1750 648 L 1736 670 L 1744 692" fill="none" stroke="#0a1424" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>

  <g id="pilier-1">
    <g id="pilier-1-fut">
      <polygon points="485,414 509,406 509,670 485,676" fill="#f0e8d2" opacity="0.3"/>
      <path d="M 509 406 V 670" fill="none" stroke="#0d1a30" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="355" y="414" width="130" height="262" fill="url(#gFut)"/>
      <rect x="355" y="414" width="130" height="14" fill="#0d1a30" opacity="0.3"/>
      <path d="M371 428 V540 M390 428 V540 M409 428 V540 M428 428 V540 M447 428 V540 M466 428 V540" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2.5"/>
      <path d="M374 428 V540 M393 428 V540 M412 428 V540 M431 428 V540 M450 428 V540 M469 428 V540" fill="none" stroke="#f0e8d2" stroke-opacity="0.85" stroke-width="1.2"/>
      <path d="M 355 546 H 485" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M 355 662 H 485" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <rect x="355" y="414" width="5" height="262" fill="#f0e8d2" opacity="0.9"/>
      <rect x="473" y="414" width="12" height="262" fill="#0d1a30" opacity="0.28"/>
      <rect x="339" y="384" width="162" height="18" fill="#f0e8d2" opacity="0.9"/>
      <path d="M339 385 H501" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M339 401 H501" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <polygon points="501,384 517,378 517,396 501,402" fill="#f0e8d2" opacity="0.38"/>
      <rect x="347" y="402" width="146" height="12" fill="#f0e8d2" opacity="0.68"/>
      <path d="M347 413 H493" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="347" y="676" width="146" height="13" rx="6" fill="#f0e8d2" opacity="0.82"/>
      <path d="M351 677 H489" fill="none" stroke="#f0e8d2" stroke-width="1.5"/>
      <rect x="339" y="689" width="162" height="12" rx="6" fill="#f0e8d2" opacity="0.62"/>
      <path d="M343 700 H497" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
    </g>
    <g id="pilier-1-socle">
      <polygon fill="url(#gSpur)" points="344,768 496,768 476,842 490,916 458,990 444,1080 386,1080 374,992 350,920 362,846"/>
      <path d="M 344 768 L 362 846 L 350 920" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 496 768 L 476 842 L 490 916" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 372 800 l 22 -11 M 380 822 l 22 -11 M 442 806 l 20 -10 M 450 828 l 20 -10" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="2"/>
      <polygon points="322,772 352,766 338,808" fill="#f0e8d2" opacity="0.3"/>
      <polygon points="518,772 490,766 502,806" fill="#f0e8d2" opacity="0.3"/>
      <polygon points="317,734 523,734 537,726 331,726" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="523,734 537,726 537,764 523,772" fill="#f0e8d2" opacity="0.28"/>
      <rect x="317" y="734" width="206" height="38" fill="#f0e8d2" opacity="0.72"/>
      <path d="M317 753 H523 M368 734 V772 M436 753 V772 M472 734 V753" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M317 735 H523" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M317 771 H523" fill="none" stroke="#0d1a30" stroke-opacity="0.7" stroke-width="2.5"/>
      <polygon points="333,700 507,700 521,692 347,692" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="507,700 521,692 521,726 507,734" fill="#f0e8d2" opacity="0.28"/>
      <rect x="333" y="700" width="174" height="34" fill="#f0e8d2" opacity="0.78"/>
      <path d="M333 717 H507 M398 700 V717 M452 717 V734" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M333 701 H507" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M 326 766 l 14 -8 M 334 770 l 14 -8 M 496 764 l 14 -8 M 504 768 l 14 -8" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="1.5"/>
    </g>
    <g id="pilier-1-fissure">
      <path d="M 338 771 L 351 752 L 346 741 L 360 724 L 356 712 L 366 703" fill="none" stroke="#0a1220" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 351 752 L 369 747 L 378 750 M 360 724 L 374 720" fill="none" stroke="#0a1220" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 374 720 L 384 714 M 378 750 L 388 754" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 512 770 L 498 754 L 503 742 L 492 733" fill="none" stroke="#0a1220" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 498 754 L 486 750 M 492 733 L 483 727" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 430 700 L 437 712 L 431 722" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 341 770 L 354 751 L 349 740" fill="none" stroke="#f0e8d2" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 514 768 L 501 753" fill="none" stroke="#f0e8d2" stroke-opacity="0.45" stroke-width="1.2" stroke-linecap="round"/>
    </g>
    <g id="pilier-1-embleme">
      <g transform="translate(2.5,3)" fill="none" stroke="#0d1a33" stroke-opacity="0.75">
        <path d="M372 586 L468 586 L420 554 Z" stroke-width="3.5"/>
        <path d="M372 594 H468" stroke-width="3.5"/>
        <path d="M389 602 V640 M410 602 V640 M431 602 V640 M452 602 V640" stroke-width="5"/>
        <path d="M378 648 H462 M372 656 H468" stroke-width="3.5"/>
      </g>
      <path d="M372 586 L468 586 L420 554 Z" fill="#d9a93a" fill-opacity="0.12" stroke="#d9a93a" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="420" cy="574" r="5" fill="none" stroke="#c17e3a" stroke-width="2"/>
      <path d="M372 594 H468" fill="none" stroke="#d9a93a" stroke-width="3.5"/>
      <path d="M389 602 V640 M410 602 V640 M431 602 V640 M452 602 V640" fill="none" stroke="#d9a93a" stroke-width="5"/>
      <path d="M378 648 H462" fill="none" stroke="#d9a93a" stroke-width="3.5"/>
      <path d="M372 656 H468" fill="none" stroke="#c17e3a" stroke-width="3.5"/>
    </g>
  </g>

  <g id="pilier-2">
    <g id="pilier-2-fut">
      <polygon points="1030,414 1042,410 1042,672 1030,676" fill="#f0e8d2" opacity="0.3"/>
      <path d="M 1042 410 V 672" fill="none" stroke="#0d1a30" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="890" y="414" width="140" height="262" fill="url(#gFut)"/>
      <rect x="890" y="414" width="140" height="14" fill="#0d1a30" opacity="0.3"/>
      <path d="M908 428 V540 M925 428 V540 M942 428 V540 M959 428 V540 M976 428 V540 M993 428 V540 M1010 428 V540" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2.5"/>
      <path d="M911 428 V540 M928 428 V540 M945 428 V540 M962 428 V540 M979 428 V540 M996 428 V540 M1013 428 V540" fill="none" stroke="#f0e8d2" stroke-opacity="0.85" stroke-width="1.2"/>
      <path d="M 890 546 H 1030" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M 890 662 H 1030" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <rect x="890" y="414" width="5" height="262" fill="#f0e8d2" opacity="0.9"/>
      <rect x="1018" y="414" width="12" height="262" fill="#0d1a30" opacity="0.28"/>
      <rect x="874" y="384" width="172" height="18" fill="#f0e8d2" opacity="0.9"/>
      <path d="M874 385 H1046" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M874 401 H1046" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <polygon points="1046,384 1056,380 1056,396 1046,402" fill="#f0e8d2" opacity="0.38"/>
      <rect x="882" y="402" width="156" height="12" fill="#f0e8d2" opacity="0.68"/>
      <path d="M882 413 H1038" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="882" y="676" width="156" height="13" rx="6" fill="#f0e8d2" opacity="0.82"/>
      <path d="M886 677 H1034" fill="none" stroke="#f0e8d2" stroke-width="1.5"/>
      <rect x="874" y="689" width="172" height="12" rx="6" fill="#f0e8d2" opacity="0.62"/>
      <path d="M878 700 H1042" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
    </g>
    <g id="pilier-2-socle">
      <polygon fill="url(#gSpur)" points="896,768 1024,768 1004,844 1018,920 986,994 974,1080 936,1080 920,998 902,918 916,846"/>
      <path d="M 896 768 L 916 846 L 902 918" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 1024 768 L 1004 844 L 1018 920" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 930 802 l 22 -11 M 938 824 l 22 -11 M 978 808 l 20 -10 M 986 830 l 20 -10" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="2"/>
      <path d="M 948 856 L 958 878 L 950 898" fill="none" stroke="#0a1424" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>
      <polygon points="852,734 1068,734 1080,727 864,727" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="1068,734 1080,727 1080,765 1068,772" fill="#f0e8d2" opacity="0.28"/>
      <rect x="852" y="734" width="216" height="38" fill="#f0e8d2" opacity="0.72"/>
      <path d="M852 753 H1068 M906 734 V772 M978 753 V772 M1016 734 V753" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M852 735 H1068" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M852 771 H1068" fill="none" stroke="#0d1a30" stroke-opacity="0.7" stroke-width="2.5"/>
      <polygon points="868,700 1052,700 1064,693 880,693" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="1052,700 1064,693 1064,727 1052,734" fill="#f0e8d2" opacity="0.28"/>
      <rect x="868" y="700" width="184" height="34" fill="#f0e8d2" opacity="0.78"/>
      <path d="M868 717 H1052 M936 700 V717 M992 717 V734" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M868 701 H1052" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M 861 766 l 14 -8 M 869 770 l 14 -8 M 1041 764 l 14 -8 M 1049 768 l 14 -8" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="1.5"/>
    </g>
    <g id="pilier-2-fissure">
      <path d="M 946 771 L 955 749 L 948 738 L 959 720 L 954 707 L 962 697 L 958 686" fill="none" stroke="#0a1220" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 955 749 L 972 744 L 981 748 M 948 738 L 934 731 M 959 720 L 970 714" fill="none" stroke="#0a1220" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 934 731 L 924 733 M 970 714 L 979 708 M 981 748 L 990 752" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 858 768 L 872 753 L 866 742 L 874 734" fill="none" stroke="#0a1220" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 872 753 L 884 750" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 1060 770 L 1048 756 L 1053 746" fill="none" stroke="#0a1220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 949 770 L 958 748 L 951 737" fill="none" stroke="#f0e8d2" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 861 766 L 875 751" fill="none" stroke="#f0e8d2" stroke-opacity="0.45" stroke-width="1.2" stroke-linecap="round"/>
    </g>
    <g id="pilier-2-embleme">
      <g transform="translate(2.5,3)" fill="none" stroke="#0d1a33" stroke-opacity="0.75" stroke-width="3.5" stroke-linejoin="round">
        <polygon points="900,646 938,646 932,620 906,620"/>
        <polygon points="940,646 978,646 972,620 946,620"/>
        <polygon points="980,646 1018,646 1012,620 986,620"/>
        <polygon points="921,614 959,614 953,588 927,588"/>
        <polygon points="963,614 1001,614 995,588 969,588"/>
        <polygon points="941,586 979,586 973,560 947,560"/>
      </g>
      <polygon points="900,646 938,646 932,620 906,620" fill="#c17e3a" fill-opacity="0.16" stroke="#c17e3a" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="940,646 978,646 972,620 946,620" fill="#d9a93a" fill-opacity="0.14" stroke="#c17e3a" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="980,646 1018,646 1012,620 986,620" fill="#c17e3a" fill-opacity="0.16" stroke="#c17e3a" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="921,614 959,614 953,588 927,588" fill="#d9a93a" fill-opacity="0.16" stroke="#d9a93a" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="963,614 1001,614 995,588 969,588" fill="#d9a93a" fill-opacity="0.16" stroke="#d9a93a" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="941,586 979,586 973,560 947,560" fill="#d9a93a" fill-opacity="0.22" stroke="#d9a93a" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 950 568 L 970 568" fill="none" stroke="#f0e8d2" stroke-opacity="0.6" stroke-width="2"/>
    </g>
  </g>

  <g id="pilier-3">
    <g id="pilier-3-fut">
      <polygon points="1435,414 1411,406 1411,670 1435,676" fill="#f0e8d2" opacity="0.3"/>
      <path d="M 1411 406 V 670" fill="none" stroke="#0d1a30" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="1435" y="414" width="130" height="262" fill="url(#gFut)"/>
      <rect x="1435" y="414" width="130" height="14" fill="#0d1a30" opacity="0.3"/>
      <path d="M1451 428 V540 M1470 428 V540 M1489 428 V540 M1508 428 V540 M1527 428 V540 M1546 428 V540" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2.5"/>
      <path d="M1454 428 V540 M1473 428 V540 M1492 428 V540 M1511 428 V540 M1530 428 V540 M1549 428 V540" fill="none" stroke="#f0e8d2" stroke-opacity="0.85" stroke-width="1.2"/>
      <path d="M 1435 546 H 1565" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M 1435 662 H 1565" fill="none" stroke="#10203f" stroke-opacity="0.4" stroke-width="2"/>
      <rect x="1560" y="414" width="5" height="262" fill="#f0e8d2" opacity="0.9"/>
      <rect x="1435" y="414" width="12" height="262" fill="#0d1a30" opacity="0.28"/>
      <rect x="1419" y="384" width="162" height="18" fill="#f0e8d2" opacity="0.9"/>
      <path d="M1419 385 H1581" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M1419 401 H1581" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <polygon points="1419,384 1403,378 1403,396 1419,402" fill="#f0e8d2" opacity="0.38"/>
      <rect x="1427" y="402" width="146" height="12" fill="#f0e8d2" opacity="0.68"/>
      <path d="M1427 413 H1573" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="1427" y="676" width="146" height="13" rx="6" fill="#f0e8d2" opacity="0.82"/>
      <path d="M1431 677 H1569" fill="none" stroke="#f0e8d2" stroke-width="1.5"/>
      <rect x="1419" y="689" width="162" height="12" rx="6" fill="#f0e8d2" opacity="0.62"/>
      <path d="M1423 700 H1577" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
    </g>
    <g id="pilier-3-socle">
      <polygon fill="url(#gSpur)" points="1424,768 1576,768 1558,846 1570,920 1546,992 1534,1080 1476,1080 1444,990 1430,916 1446,842"/>
      <path d="M 1424 768 L 1446 842 L 1430 916" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 1576 768 L 1558 846 L 1570 920" fill="none" stroke="#f0e8d2" stroke-opacity="0.3" stroke-width="2"/>
      <path d="M 1454 800 l 22 -11 M 1462 822 l 22 -11 M 1524 806 l 20 -10 M 1532 828 l 20 -10" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="2"/>
      <polygon points="1402,772 1432,766 1418,808" fill="#f0e8d2" opacity="0.3"/>
      <polygon points="1598,772 1570,766 1582,806" fill="#f0e8d2" opacity="0.3"/>
      <polygon points="1397,734 1603,734 1589,726 1383,726" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="1397,734 1383,726 1383,764 1397,772" fill="#f0e8d2" opacity="0.28"/>
      <rect x="1397" y="734" width="206" height="38" fill="#f0e8d2" opacity="0.72"/>
      <path d="M1397 753 H1603 M1448 734 V772 M1516 753 V772 M1552 734 V753" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M1397 735 H1603" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M1397 771 H1603" fill="none" stroke="#0d1a30" stroke-opacity="0.7" stroke-width="2.5"/>
      <polygon points="1413,700 1587,700 1573,692 1399,692" fill="#f0e8d2" opacity="0.95"/>
      <polygon points="1413,700 1399,692 1399,726 1413,734" fill="#f0e8d2" opacity="0.28"/>
      <rect x="1413" y="700" width="174" height="34" fill="#f0e8d2" opacity="0.78"/>
      <path d="M1413 717 H1587 M1478 700 V717 M1532 717 V734" fill="none" stroke="#10203f" stroke-opacity="0.65" stroke-width="2"/>
      <path d="M1413 701 H1587" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M 1406 766 l 14 -8 M 1414 770 l 14 -8 M 1576 764 l 14 -8 M 1584 768 l 14 -8" fill="none" stroke="#0a1424" stroke-opacity="0.5" stroke-width="1.5"/>
    </g>
    <g id="pilier-3-fissure">
      <path d="M 1404 770 L 1419 753 L 1413 741 L 1426 727 L 1421 713 L 1428 704" fill="none" stroke="#0a1220" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 1419 753 L 1434 749 L 1443 752 M 1426 727 L 1439 722" fill="none" stroke="#0a1220" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 1439 722 L 1449 717 M 1443 752 L 1452 756" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 1592 769 L 1578 755 L 1584 744 L 1575 736" fill="none" stroke="#0a1220" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 1578 755 L 1567 751" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 1500 701 L 1493 713 L 1499 722" fill="none" stroke="#0a1220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 1407 769 L 1422 752 L 1416 741" fill="none" stroke="#f0e8d2" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 1594 767 L 1581 754" fill="none" stroke="#f0e8d2" stroke-opacity="0.45" stroke-width="1.2" stroke-linecap="round"/>
    </g>
    <g id="pilier-3-embleme">
      <g transform="translate(2.5,3)" fill="none" stroke="#0d1a33" stroke-opacity="0.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1488 624 L1474 664 L1484 660 L1489 671 L1501 632 Z" stroke-width="3"/>
        <path d="M1512 624 L1526 664 L1516 660 L1511 671 L1499 632 Z" stroke-width="3"/>
        <circle cx="1500" cy="596" r="34" stroke-width="3.5"/>
        <circle cx="1500" cy="596" r="22" stroke-width="2.5"/>
      </g>
      <path d="M1488 624 L1474 664 L1484 660 L1489 671 L1501 632 Z" fill="#c17e3a" fill-opacity="0.22" stroke="#c17e3a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M1512 624 L1526 664 L1516 660 L1511 671 L1499 632 Z" fill="#c17e3a" fill-opacity="0.22" stroke="#c17e3a" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="1500" cy="596" r="34" fill="#d9a93a" fill-opacity="0.14" stroke="#d9a93a" stroke-width="3.5"/>
      <path d="M1527 596 L1533 596 M1523.4 609.5 L1528.6 612.5 M1513.5 619.4 L1516.5 624.6 M1500 623 L1500 629 M1486.5 619.4 L1483.5 624.6 M1476.6 609.5 L1471.4 612.5 M1473 596 L1467 596 M1476.6 582.5 L1471.4 579.5 M1486.5 572.6 L1483.5 567.4 M1500 569 L1500 563 M1513.5 572.6 L1516.5 567.4 M1523.4 582.5 L1528.6 579.5" fill="none" stroke="#d9a93a" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="1500" cy="596" r="22" fill="none" stroke="#d9a93a" stroke-width="2.5"/>
      <path d="M1509 596 L1519 596 M1504.5 603.8 L1509.5 612.5 M1495.5 603.8 L1490.5 612.5 M1491 596 L1481 596 M1495.5 588.2 L1490.5 579.5 M1504.5 588.2 L1509.5 579.5" fill="none" stroke="#d9a93a" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="1500" cy="596" r="4.5" fill="#d9a93a" fill-opacity="0.5" stroke="#d9a93a" stroke-width="2.5"/>
    </g>
  </g>

  <g id="tablier">
    <g id="tablier-dalle">
      <rect x="0" y="268" width="1920" height="8" fill="#f0e8d2" opacity="0.95"/>
      <path d="M0 268 H1920" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <rect x="0" y="276" width="1920" height="22" fill="#f0e8d2" opacity="0.72"/>
      <path d="M80 278 V296 M240 278 V296 M400 278 V296 M560 278 V296 M720 278 V296 M880 278 V296 M1040 278 V296 M1200 278 V296 M1360 278 V296 M1520 278 V296 M1680 278 V296 M1840 278 V296" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
      <rect x="0" y="298" width="1920" height="16" fill="#f0e8d2" opacity="0.88"/>
      <path d="M0 299 H1920" fill="none" stroke="#f0e8d2" stroke-width="2"/>
      <path d="M0 314 H1920" fill="none" stroke="#d9a93a" stroke-opacity="0.45" stroke-width="2"/>
      <rect x="0" y="314" width="1920" height="30" fill="#f0e8d2" opacity="0.6"/>
      <path d="M0 329 H1920" fill="none" stroke="#10203f" stroke-opacity="0.6" stroke-width="2"/>
      <path d="M48 315 V329 M144 315 V329 M240 315 V329 M336 315 V329 M432 315 V329 M528 315 V329 M624 315 V329 M720 315 V329 M816 315 V329 M912 315 V329 M1008 315 V329 M1104 315 V329 M1200 315 V329 M1296 315 V329 M1392 315 V329 M1488 315 V329 M1584 315 V329 M1680 315 V329 M1776 315 V329 M1872 315 V329" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
      <path d="M96 329 V343 M192 329 V343 M288 329 V343 M384 329 V343 M480 329 V343 M576 329 V343 M672 329 V343 M768 329 V343 M864 329 V343 M960 329 V343 M1056 329 V343 M1152 329 V343 M1248 329 V343 M1344 329 V343 M1440 329 V343 M1536 329 V343 M1632 329 V343 M1728 329 V343 M1824 329 V343" fill="none" stroke="#10203f" stroke-opacity="0.55" stroke-width="2"/>
    </g>
    <g id="tablier-dessous">
      <rect x="0" y="344" width="1920" height="42" fill="url(#gUnder)"/>
      <rect x="60" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="188" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="316" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="444" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="572" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="700" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="828" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="956" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1084" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1212" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1340" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1468" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1596" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1724" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <rect x="1852" y="348" width="30" height="34" fill="#f0e8d2" opacity="0.36"/>
      <path d="M90 348 V382 M218 348 V382 M346 348 V382 M474 348 V382 M602 348 V382 M730 348 V382 M858 348 V382 M986 348 V382 M1114 348 V382 M1242 348 V382 M1370 348 V382 M1498 348 V382 M1626 348 V382 M1754 348 V382 M1882 348 V382" fill="none" stroke="#0a1424" stroke-opacity="0.7" stroke-width="2.5"/>
      <path d="M60 349 H90 M188 349 H218 M316 349 H346 M444 349 H474 M572 349 H602 M700 349 H730 M828 349 H858 M956 349 H986 M1084 349 H1114 M1212 349 H1242 M1340 349 H1370 M1468 349 H1498 M1596 349 H1626 M1724 349 H1754 M1852 349 H1882" fill="none" stroke="#f0e8d2" stroke-opacity="0.5" stroke-width="1.5"/>
      <path d="M0 386 H1920" fill="none" stroke="#060c18" stroke-width="2.5"/>
    </g>
  </g>
</svg>`;

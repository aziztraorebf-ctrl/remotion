/**
 * OffshoreGeminiAnimee — R&D (2026-06-21). Plateforme petroliere offshore en COUPE,
 * registre BLUEPRINT bleu (Gemini 3.1 Pro, source : OFFSHORE_GEMINI dans offshoreBodies.ts),
 * REECRITE EN JSX et ANIMEE PAR GROUPES via la frame.
 *
 * Grammaire "scene qui SE CONSTRUIT" (doctrine SVG-SCENES-GENERATIVES) + flux continu :
 *   0-20   : grille + frame-cartouche fade-in (la planche apparait)
 *   15-105 : la STRUCTURE se TRACE ligne par ligne (stroke-dashoffset L->0), dans l'ordre de
 *            construction : ligne-mer -> seabed -> jambes -> topside -> derrick -> flare-arm -> riser-pipe.
 *   90-115 : reservoir se revele (opacity + hachures)
 *   110-180: ⭐ LE GESTE — flux-petrole REMONTE le long du riser, en boucle continue (defile vers le haut).
 *   flare-arm : la torchere VACILLE (opacity + scale sin) une fois tracee.
 *   ligne-mer : ondulation horizontale tres legere (translate sin).
 *   cotes + etiquettes : fade-in sequence a la fin (f100-140) — le plan "s'annote".
 *
 * Technique de trace : sur chaque path a tracer, strokeDasharray=DASH (grande valeur, pas de mesure)
 * et strokeDashoffset anime de DASH->0 = "la main qui dessine". Les <g> a remplissage (topside,
 * derrick, reservoir) sont reveles en opacity quand leur trace voisin est fini.
 *
 * Animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const CYAN = "#7fd4ff";
const WHITE = "#eaf6ff";
const GOLD = "#c8a951";
const NIGHT = "#0d1b3a";
const PANEL = "#16213a";

// progress 0->1 cale sur la frame, clampe des deux cotes
const prog = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// grande dasharray : pas besoin de mesurer la vraie longueur des paths
const DASH = 4000;

export const OffshoreGeminiAnimee: React.FC = () => {
  const frame = useCurrentFrame();

  // --- progressions de la sequence de construction ---
  const pPlanche = prog(frame, 0, 20); // grille + cartouche
  const pMer = prog(frame, 15, 35); // ligne-mer
  const pSeabed = prog(frame, 28, 48); // seabed
  const pJambes = prog(frame, 40, 65); // jambes (du haut vers le bas)
  const pTopside = prog(frame, 58, 78); // topside
  const pDerrick = prog(frame, 72, 90); // derrick
  const pFlare = prog(frame, 85, 102); // flare-arm
  const pRiser = prog(frame, 88, 108); // riser-pipe (trace bas->haut)
  const pReservoir = prog(frame, 90, 115); // reservoir se revele
  const pCotes = prog(frame, 100, 130); // cotes
  const pEtiquettes = prog(frame, 110, 140); // etiquettes

  // offsets de trace (DASH->0)
  const offMer = (1 - pMer) * DASH;
  const offSeabed = (1 - pSeabed) * DASH;
  const offJambes = (1 - pJambes) * DASH;
  const offTopside = (1 - pTopside) * DASH;
  const offDerrick = (1 - pDerrick) * DASH;
  const offFlare = (1 - pFlare) * DASH;
  // riser : trace de bas (reservoir) vers haut (plateforme). Le path est ecrit haut->bas (512,220 -> 512,890),
  // donc dashoffset NEGATIF fait apparaitre le trait depuis l'autre extremite (le bas).
  const offRiser = -(1 - pRiser) * DASH;

  // ligne-mer : ondulation horizontale tres legere (apres trace)
  const merWobble = pMer > 0.95 ? Math.sin(frame / 22) * 3 : 0;

  // flare : la torchere VACILLE une fois tracee (flamme = derniere partie de flare-arm)
  const flameLit = pFlare > 0.9 ? 1 : 0;
  const flameFlicker = flameLit * (0.55 + 0.45 * (Math.sin(frame / 4) + Math.sin(frame / 2.7) * 0.4));
  const flameScale = 1 + flameLit * Math.sin(frame / 6) * 0.18;

  // ⭐ FLUX PETROLE : les 8 chevrons remontent le riser en boucle.
  // Le riser utile va de ~y890 (reservoir) a ~y230 (deck) = span ~660. Les marqueurs defilent
  // vers le HAUT : on calcule une position cyclique par marqueur, modulo le span.
  const fluxOn = prog(frame, 108, 122); // apparition du flux quand le riser est trace
  const FLUX_TOP = 240; // haut du riser (sous le deck)
  const FLUX_BOTTOM = 880; // bas du riser (entree reservoir)
  const SPAN = FLUX_BOTTOM - FLUX_TOP; // 640
  const N_FLUX = 8;
  const SPEED = 2.6; // px/frame de montee
  // position de base de chaque marqueur, etalee sur le span
  const fluxMarkers = Array.from({ length: N_FLUX }, (_, i) => {
    const base = FLUX_BOTTOM - (i / N_FLUX) * SPAN;
    // monte : y diminue avec le temps ; modulo SPAN pour reboucler en bas
    let y = base - frame * SPEED;
    // ramener dans [FLUX_TOP, FLUX_BOTTOM]
    y = FLUX_TOP + (((y - FLUX_TOP) % SPAN) + SPAN) % SPAN;
    const tInSpan = (y - FLUX_TOP) / SPAN; // 0 = haut, 1 = bas
    // opacity : apparait en bas, disparait en haut (fondu aux extremites)
    const op = Math.min(1, tInSpan * 3) * Math.min(1, (1 - tInSpan) * 3);
    return { y, op: op * fluxOn };
  });

  return (
    <div style={{ position: "absolute", inset: 0, background: NIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
        {/* === GRILLE === */}
        <g id="grille" opacity={pPlanche * 0.9}>
          <path
            d="M80 40 V984 M120 40 V984 M160 40 V984 M200 40 V984 M240 40 V984 M280 40 V984 M320 40 V984 M360 40 V984 M400 40 V984 M440 40 V984 M480 40 V984 M520 40 V984 M560 40 V984 M600 40 V984 M640 40 V984 M680 40 V984 M720 40 V984 M760 40 V984 M800 40 V984 M840 40 V984 M880 40 V984 M920 40 V984 M960 40 V984 M40 80 H984 M40 120 H984 M40 160 H984 M40 200 H984 M40 240 H984 M40 280 H984 M40 320 H984 M40 360 H984 M40 400 H984 M40 440 H984 M40 480 H984 M40 520 H984 M40 560 H984 M40 600 H984 M40 640 H984 M40 680 H984 M40 720 H984 M40 760 H984 M40 800 H984 M40 840 H984 M40 880 H984 M40 920 H984 M40 960 H984"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            opacity="0.15"
          />
        </g>

        {/* === FRAME-CARTOUCHE === */}
        <g id="frame-cartouche" opacity={pPlanche}>
          <rect x="40" y="40" width="944" height="944" fill="none" stroke={CYAN} strokeWidth="1.5" />
          <rect x="44" y="44" width="936" height="936" fill="none" stroke={CYAN} strokeWidth="0.5" opacity="0.5" />
          <path d="M40 60 H50 M40 80 H50 M984 60 H974 M984 80 H974 M60 40 V50 M80 40 V50 M60 984 V974 M80 984 V974" fill="none" stroke={CYAN} strokeWidth="1" />
          <rect x="684" y="934" width="300" height="50" fill={NIGHT} stroke={CYAN} strokeWidth="1.5" />
          <text x="700" y="964" fill={CYAN} fontFamily="monospace" fontSize="14" fontWeight="bold" letterSpacing="1">
            OFFSHORE PLATFORM
          </text>
          <text x="960" y="964" fill={CYAN} fontFamily="monospace" fontSize="10" textAnchor="end">
            REV. A
          </text>
        </g>

        {/* === LIGNE-MER : se trace, puis ondule legerement === */}
        <g id="ligne-mer" transform={`translate(${merWobble} 0)`}>
          <path
            d="M 40 300 Q 111 285 182 300 T 324 300 T 466 300 T 608 300 T 750 300 T 892 300 T 984 300"
            fill="none"
            stroke={CYAN}
            strokeWidth="1.5"
            strokeDasharray={DASH}
            strokeDashoffset={offMer}
          />
          <path
            d="M 40 310 Q 111 295 182 310 T 324 310 T 466 310 T 608 310 T 750 310 T 892 310 T 984 310"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            opacity="0.5"
            strokeDasharray={DASH}
            strokeDashoffset={offMer}
          />
          <path
            d="M 100 320 V 680 M 200 320 V 680 M 300 320 V 680 M 400 320 V 680 M 600 320 V 680 M 700 320 V 680 M 800 320 V 680 M 900 320 V 680"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity={pMer * 0.3}
          />
        </g>

        {/* === SEABED : se trace === */}
        <g id="seabed">
          <path
            d="M 40 700 Q 200 680 400 700 Q 600 720 800 700 Q 900 690 984 700"
            fill="none"
            stroke={WHITE}
            strokeWidth="2"
            strokeDasharray={DASH}
            strokeDashoffset={offSeabed}
          />
          <path
            d="M 40 720 Q 200 700 400 720 Q 600 740 800 720 Q 900 710 984 720"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            opacity={pSeabed * 0.6}
          />
          <path
            d="M 40 740 Q 200 720 400 740 Q 600 760 800 740 Q 900 730 984 740"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            opacity={pSeabed * 0.3}
          />
          <path
            d="M 40 800 Q 250 780 500 810 T 984 790"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.5"
            strokeDasharray="10 5"
            opacity={pSeabed * 0.4}
          />
        </g>

        {/* === JAMBES (steel jacket) : se tracent === */}
        <g id="jambes">
          <line x1="412" y1="260" x2="350" y2="700" stroke={WHITE} strokeWidth="2" strokeDasharray={DASH} strokeDashoffset={offJambes} />
          <line x1="612" y1="260" x2="674" y2="700" stroke={WHITE} strokeWidth="2" strokeDasharray={DASH} strokeDashoffset={offJambes} />
          <line x1="460" y1="260" x2="430" y2="700" stroke={WHITE} strokeWidth="1.5" opacity="0.7" strokeDasharray={DASH} strokeDashoffset={offJambes} />
          <line x1="564" y1="260" x2="594" y2="700" stroke={WHITE} strokeWidth="1.5" opacity="0.7" strokeDasharray={DASH} strokeDashoffset={offJambes} />
          <path
            d="M412 260 L624 348 M612 260 L400 348 M400 348 L637 436 M624 348 L387 436 M387 436 L649 524 M637 436 L375 524 M375 524 L662 612 M649 524 L362 612 M362 612 L674 700 M662 612 L350 700"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            opacity="0.8"
            strokeDasharray={DASH}
            strokeDashoffset={offJambes}
          />
          <path
            d="M400 348 L624 348 M387 436 L637 436 M375 524 L649 524 M362 612 L662 612"
            fill="none"
            stroke={WHITE}
            strokeWidth="1.5"
            strokeDasharray={DASH}
            strokeDashoffset={offJambes}
          />
          {/* noeuds : apparaissent quand le treillis est trace */}
          <g opacity={prog(frame, 60, 68)}>
            {[
              [400, 348], [624, 348], [387, 436], [637, 436],
              [375, 524], [649, 524], [362, 612], [662, 612],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2.5" fill={NIGHT} stroke={WHITE} strokeWidth="1" />
            ))}
          </g>
        </g>

        {/* === TOPSIDE (deck) : trait se trace + caissons reveles === */}
        <g id="topside">
          {/* caissons a remplissage : reveles en opacity */}
          <g opacity={prog(frame, 70, 80)}>
            <rect x="372" y="220" width="280" height="40" fill={NIGHT} stroke={WHITE} strokeWidth="2" />
            <rect x="390" y="190" width="40" height="30" fill={NIGHT} stroke={CYAN} strokeWidth="1.5" />
            <rect x="430" y="170" width="40" height="50" fill={NIGHT} stroke={CYAN} strokeWidth="1.5" />
            <rect x="560" y="180" width="50" height="40" fill={NIGHT} stroke={CYAN} strokeWidth="1.5" />
          </g>
          {/* traits internes : se tracent */}
          <path
            d="M372 240 L652 240 M392 260 L372 220 M632 260 L652 220 M420 260 L420 220 M604 260 L604 220"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            strokeDasharray={DASH}
            strokeDashoffset={offTopside}
          />
          {/* heliport bras + H */}
          <g opacity={prog(frame, 74, 82)}>
            <line x1="372" y1="220" x2="310" y2="190" stroke={WHITE} strokeWidth="2" />
            <line x1="310" y1="190" x2="260" y2="190" stroke={WHITE} strokeWidth="2" />
            <path d="M330 200 L320 220 M290 190 L320 220" fill="none" stroke={CYAN} strokeWidth="1" />
            <text x="285" y="186" fill={CYAN} fontFamily="monospace" fontSize="10" textAnchor="middle">
              H
            </text>
          </g>
          {/* crane : revele */}
          <g id="crane" opacity={prog(frame, 76, 86)}>
            <line x1="600" y1="180" x2="600" y2="150" stroke={WHITE} strokeWidth="2" />
            <path d="M 600 150 L 660 110" fill="none" stroke={WHITE} strokeWidth="1.5" />
            <path d="M 600 150 L 605 140 L 615 145 L 620 135 L 630 140 L 640 128 L 650 132 L 660 110" fill="none" stroke={CYAN} strokeWidth="0.5" />
            <line x1="660" y1="110" x2="660" y2="170" stroke={CYAN} strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 658 170 L 662 170 M 660 170 C 660 176 666 176 666 170" fill="none" stroke={WHITE} strokeWidth="1.5" />
          </g>
        </g>

        {/* === DERRICK (tower) : treillis se trace, contour revele === */}
        <g id="derrick">
          <path d="M 472 220 L 496 80 L 528 80 L 552 220 Z" fill={NIGHT} stroke={WHITE} strokeWidth="2" opacity={prog(frame, 72, 82) * 0.9} />
          <path
            d="M 476 200 L 546 180 L 482 160 L 539 140 L 488 120 L 532 100 L 494 80"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            strokeDasharray={DASH}
            strokeDashoffset={offDerrick}
          />
          <path
            d="M 548 200 L 476 180 L 542 160 L 485 140 L 535 120 L 491 100 L 528 80"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            strokeDasharray={DASH}
            strokeDashoffset={offDerrick}
          />
          <path
            d="M 480 180 H 544 M 485 140 H 538 M 491 100 H 532"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            strokeDasharray={DASH}
            strokeDashoffset={offDerrick}
          />
          <g opacity={prog(frame, 86, 92)}>
            <rect x="502" y="70" width="20" height="10" fill={NIGHT} stroke={WHITE} strokeWidth="1.5" />
            <rect x="506" y="130" width="12" height="20" fill={NIGHT} stroke={GOLD} strokeWidth="1.5" />
            <line x1="512" y1="80" x2="512" y2="130" stroke={CYAN} strokeWidth="1" strokeDasharray="2 2" />
          </g>
        </g>

        {/* === FLARE-ARM (torchere) : bras se trace, flamme VACILLE === */}
        <g id="flare-arm">
          <path
            d="M 652 220 L 820 120 M 652 240 L 820 140"
            fill="none"
            stroke={WHITE}
            strokeWidth="1.5"
            strokeDasharray={DASH}
            strokeDashoffset={offFlare}
          />
          <path
            d="M 652 220 L 680 223 L 710 186 L 740 189 L 770 153 L 800 153 Z"
            fill="none"
            stroke={CYAN}
            strokeWidth="1"
            opacity={pFlare * 0.85}
          />
          <line x1="820" y1="120" x2="820" y2="140" stroke={WHITE} strokeWidth="2" opacity={pFlare} />
          <rect x="816" y="105" width="8" height="15" fill={NIGHT} stroke={WHITE} strokeWidth="1.5" opacity={pFlare} />
          {/* flamme : opacity + scale sin (vacille), ancree a la pointe (820,105) */}
          <g transform={`translate(820 105) scale(${flameScale}) translate(-820 -105)`} opacity={flameFlicker}>
            <path d="M 820 105 Q 810 80, 825 55 Q 840 80, 820 105" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 820 100 Q 814 84, 823 66 Q 832 84, 820 100" fill={GOLD} fillOpacity="0.25" stroke="none" />
          </g>
        </g>

        {/* === RISER-PIPE : se trace de BAS en HAUT (dashoffset negatif) === */}
        <g id="riser-pipe">
          <path d="M 512 220 L 512 890" fill="none" stroke={CYAN} strokeWidth="6" strokeDasharray={DASH} strokeDashoffset={offRiser} />
          <path d="M 512 220 L 512 890" fill="none" stroke={NIGHT} strokeWidth="3" opacity={pRiser * 0.5} />
          {/* BOP + brides : revelees quand le riser est trace */}
          <g opacity={prog(frame, 104, 112)}>
            <rect x="496" y="670" width="32" height="40" fill={NIGHT} stroke={WHITE} strokeWidth="1.5" />
            <line x1="490" y1="680" x2="534" y2="680" stroke={WHITE} strokeWidth="1.5" />
            <line x1="490" y1="700" x2="534" y2="700" stroke={WHITE} strokeWidth="1.5" />
            <path d="M 500 710 L 524 710 M 494 860 L 530 860" fill="none" stroke={WHITE} strokeWidth="2" />
          </g>
        </g>

        {/* === RESERVOIR (payzone) : se revele (opacity + hachures + gouttes) === */}
        <g id="reservoir" opacity={pReservoir}>
          <path
            d="M 512 820 C 620 820, 680 850, 650 910 C 620 960, 400 960, 370 910 C 340 850, 400 820, 512 820 Z"
            fill={PANEL}
            stroke={WHITE}
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 420 850 Q 512 840 600 860 M 390 880 Q 512 860 630 890 M 400 910 Q 512 890 610 920"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.75"
            opacity="0.5"
          />
          <circle cx="480" cy="870" r="2" fill={GOLD} />
          <circle cx="540" cy="850" r="1.5" fill={GOLD} />
          <circle cx="450" cy="900" r="2.5" fill={GOLD} />
          <circle cx="570" cy="890" r="2" fill={GOLD} />
          <circle cx="512" cy="930" r="1.5" fill={GOLD} />
          <circle cx="610" cy="875" r="1" fill={GOLD} />
        </g>

        {/* === FLUX-PETROLE ⭐ : les chevrons REMONTENT le riser en boucle === */}
        <g id="flux-petrole">
          {fluxMarkers.map((m, i) => (
            <polyline
              key={i}
              points={`504,${m.y + 8} 512,${m.y} 520,${m.y + 8}`}
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={m.op}
            />
          ))}
        </g>

        {/* === COTES : fade-in sequence === */}
        <g id="cotes" opacity={pCotes}>
          <line x1="880" y1="300" x2="880" y2="700" stroke={CYAN} strokeWidth="1" />
          <polygon points="880,300 877,310 883,310" fill={CYAN} />
          <polygon points="880,700 877,690 883,690" fill={CYAN} />
          <line x1="860" y1="300" x2="900" y2="300" stroke={CYAN} strokeWidth="1" />
          <line x1="860" y1="700" x2="900" y2="700" stroke={CYAN} strokeWidth="1" />
          <text x="890" y="500" fill={CYAN} fontFamily="monospace" fontSize="10" transform="rotate(-90 890 500)" textAnchor="middle" letterSpacing="1">
            WATER DEPTH 400M
          </text>
          <line x1="880" y1="700" x2="880" y2="880" stroke={CYAN} strokeWidth="1" />
          <polygon points="880,880 877,870 883,870" fill={CYAN} />
          <line x1="860" y1="880" x2="900" y2="880" stroke={CYAN} strokeWidth="1" />
          <text x="890" y="790" fill={CYAN} fontFamily="monospace" fontSize="10" transform="rotate(-90 890 790)" textAnchor="middle" letterSpacing="1">
            SUBSEA 3000M
          </text>
          <line x1="180" y1="80" x2="180" y2="300" stroke={CYAN} strokeWidth="1" />
          <polygon points="180,80 177,90 183,90" fill={CYAN} />
          <polygon points="180,300 177,290 183,290" fill={CYAN} />
          <line x1="160" y1="80" x2="200" y2="80" stroke={CYAN} strokeWidth="1" />
          <line x1="160" y1="300" x2="200" y2="300" stroke={CYAN} strokeWidth="1" />
          <text x="170" y="190" fill={GOLD} fontFamily="monospace" fontSize="10" transform="rotate(-90 170 190)" textAnchor="middle" letterSpacing="1">
            AIR DRAFT 220M
          </text>
        </g>

        {/* === ETIQUETTES : fade-in sequence final ("le plan s'annote") === */}
        <g id="etiquettes" opacity={pEtiquettes}>
          <polyline points="512,140 600,100 680,100" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="512" cy="140" r="2" fill={WHITE} />
          <text x="685" y="103" fill={WHITE} fontFamily="monospace" fontSize="10" letterSpacing="1">
            DERRICK TOWER
          </text>
          <polyline points="400,240 300,140 200,140" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="400" cy="240" r="2" fill={WHITE} />
          <text x="195" y="143" fill={WHITE} fontFamily="monospace" fontSize="10" textAnchor="end" letterSpacing="1">
            MAIN DECK (TOPSIDE)
          </text>
          <polyline points="512,500 400,500 320,500" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="512" cy="500" r="2" fill={WHITE} />
          <text x="315" y="497" fill={WHITE} fontFamily="monospace" fontSize="10" textAnchor="end" letterSpacing="1">
            PRODUCTION RISER
          </text>
          <polyline points="496,690 400,650 320,650" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="496" cy="690" r="2" fill={WHITE} />
          <text x="315" y="653" fill={WHITE} fontFamily="monospace" fontSize="10" textAnchor="end" letterSpacing="1">
            BLOWOUT PREVENTER (BOP)
          </text>
          <polyline points="512,880 420,840 300,840" fill="none" stroke={GOLD} strokeWidth="0.75" />
          <circle cx="512" cy="880" r="2" fill={GOLD} />
          <text x="295" y="843" fill={GOLD} fontFamily="monospace" fontSize="10" textAnchor="end" letterSpacing="1">
            OIL RESERVOIR (PAYZONE)
          </text>
          <polyline points="820,105 880,80 940,80" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="820" cy="105" r="2" fill={WHITE} />
          <text x="945" y="83" fill={WHITE} fontFamily="monospace" fontSize="10" letterSpacing="1">
            FLARE BOOM
          </text>
          <polyline points="650,524 750,560 850,560" fill="none" stroke={WHITE} strokeWidth="0.75" />
          <circle cx="650" cy="524" r="2" fill={WHITE} />
          <text x="855" y="563" fill={WHITE} fontFamily="monospace" fontSize="10" letterSpacing="1">
            STEEL JACKET SUBSTRUCTURE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default OffshoreGeminiAnimee;

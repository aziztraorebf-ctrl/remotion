/**
 * EtatMajorGptAnimee — R&D (2026-06-21). Carte d'etat-major gravee generee par GPT-5.5
 * (source : EM_GPT dans emBodies.ts), REECRITE EN JSX et ANIMEE PAR GROUPES via la frame.
 *
 * Grammaire "scene qui SE CONSTRUIT" (doctrine SVG-SCENES-GENERATIVES) :
 *   0-25  : terrain + bg-grid fade-in (le fond apparait)
 *   20-45 : villes alpha/bravo/charlie POP (scale+opacity) puis PULSE sonar en boucle
 *   40-70 : zones de controle west/east se REMPLISSENT par balayage (clip-rect qui descend)
 *   60-95 : fleche NORD se TRACE (stroke-dashoffset L->0) + pointe a la fin
 *   95-130: fleche SUD se TRACE (idem)
 *   30-50 : compass + legend fade-in ; l'aiguille du compass oscille legerement
 *
 * Technique de trace des fleches : sur le PATH principal de chaque fleche, strokeDasharray=L
 * (grande valeur, pas besoin de mesurer) et strokeDashoffset anime de L->0 = "la main qui dessine".
 * La pointe (polygon) + les barbes laterales apparaissent (opacity 0->1) quand le trace est fini.
 *
 * Animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const RED = "#8a2a20";
const IVORY = "#f2ebd9";
const GOLD = "#e7bd78";
const GOLD_MID = "#dca95e";
const GOLD_DARK = "#bf9442";

// progress 0->1 cale sur la frame, clampe des deux cotes
const prog = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Anneau sonar : un cercle dont r grandit et opacity decroit en cycle continu, ancre (cx,cy).
const Sonar: React.FC<{ cx: number; cy: number; frame: number; period: number; phase?: number; rMax: number }> = ({
  cx, cy, frame, period, phase = 0, rMax,
}) => {
  const t = (((frame + phase) % period) + period) % period / period; // 0->1 cyclique
  const r = 10 + t * rMax;
  const op = (1 - t) * 0.7;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={3} opacity={op} />;
};

export const EtatMajorGptAnimee: React.FC = () => {
  const frame = useCurrentFrame();

  // --- progressions de la sequence ---
  const pFond = prog(frame, 0, 25);          // terrain + grid
  const pCities = prog(frame, 20, 45);       // villes pop
  const pZoneW = prog(frame, 40, 62);        // zone ouest balayage
  const pZoneE = prog(frame, 48, 70);        // zone est balayage
  const pArrowN = prog(frame, 60, 95);       // fleche nord
  const pArrowS = prog(frame, 95, 130);      // fleche sud
  const pChrome = prog(frame, 30, 50);       // compass + legend

  // Trace des fleches : L grand (pas de mesure), dashoffset L->0.
  const DASH = 3000;
  const offN = (1 - pArrowN) * DASH;
  const offS = (1 - pArrowS) * DASH;
  // pointe + barbes apparaissent une fois le trace quasi fini
  const headN = prog(frame, 88, 96);
  const headS = prog(frame, 123, 131);

  // Pop ville : scale + opacity, par ville avec leger decalage
  const cityT = (delay: number) => {
    const t = interpolate(frame, [20 + delay, 45 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { scale: 0.4 + t * 0.6, op: t };
  };
  const cA = cityT(0);
  const cB = cityT(5);
  const cC = cityT(10);

  // Balayage zone : un clip-rect dont la hauteur visible monte avec le progress.
  // On simule via un <rect> masque : ici on anime l'opacite des hachures + un clip via height.
  // clip y descend de top->bottom : la zone est dans la bbox y~[416..648] (west) et [222..503] (east).
  const zoneWClipH = pZoneW * 260; // hauteur revelee depuis le haut (bbox ouest ~ y416..648)
  const zoneEClipH = pZoneE * 290;

  // aiguille du compass oscille legerement (rotation pendulaire autour de 790,800)
  const needleAngle = Math.sin(frame / 16) * 5;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#16213a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="emGptGrad" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="75%" stopColor={GOLD_MID} />
            <stop offset="100%" stopColor={GOLD_DARK} />
          </radialGradient>
          <clipPath id="emGptClip">
            <circle cx="512" cy="512" r="480" />
          </clipPath>
          {/* clips de balayage des zones (revele depuis le haut) */}
          <clipPath id="zoneWClip">
            <rect x="190" y="416" width="290" height={zoneWClipH} />
          </clipPath>
          <clipPath id="zoneEClip">
            <rect x="530" y="222" width="290" height={zoneEClipH} />
          </clipPath>
        </defs>

        {/* fond dore du medaillon */}
        <circle cx="512" cy="512" r="480" fill="url(#emGptGrad)" />

        <g clipPath="url(#emGptClip)">
          {/* === STAFF-MAP-MEDALLION : anneaux internes (apparait avec le fond) === */}
          <g id="staff-map-medallion" opacity={pFond}>
            <circle cx="512" cy="512" r="452" fill="none" stroke={RED} strokeWidth="3" />
            <circle cx="512" cy="512" r="424" fill="none" stroke={RED} strokeWidth="1.5" strokeDasharray="10 14" />
          </g>

          {/* === BG-GRID : fade-in d'abord === */}
          <g id="bg-grid" opacity={pFond * 0.9}>
            <path d="M128 128H896M128 192H896M128 256H896M128 320H896M128 384H896M128 448H896M128 512H896M128 576H896M128 640H896M128 704H896M128 768H896M128 832H896M128 896H896" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="6 10" />
            <path d="M128 128V896M192 128V896M256 128V896M320 128V896M384 128V896M448 128V896M512 128V896M576 128V896M640 128V896M704 128V896M768 128V896M832 128V896M896 128V896" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="6 10" />
            <path d="M160 160H864V864H160Z" fill="none" stroke={RED} strokeWidth="2" />
            <path d="M160 288H864M160 416H864M160 544H864M160 672H864M160 800H864M288 160V864M416 160V864M544 160V864M672 160V864M800 160V864" fill="none" stroke={RED} strokeWidth="1.6" strokeDasharray="14 12" />
          </g>

          {/* === TERRAIN : fade-in avec le fond === */}
          <g id="terrain" opacity={pFond}>
            <path d="M152 214C208 184 258 203 306 178C376 142 432 169 496 158C587 142 660 182 718 226C786 279 836 340 858 421C887 529 846 610 870 700C890 776 832 842 742 876C647 913 557 870 486 888C396 912 328 851 258 858C196 864 154 808 169 744C190 656 132 596 151 514C174 413 103 340 152 214Z" fill={GOLD_MID} stroke={RED} strokeWidth="3" />
            <path d="M196 244C236 224 266 235 298 214M201 286C254 253 306 277 352 238M188 338C242 310 286 326 333 294M202 390C257 360 320 383 374 342M177 458C240 431 288 451 342 420M198 536C254 508 316 526 370 486M217 628C273 602 329 615 382 579M218 734C282 702 334 735 394 698M310 820C366 790 430 817 488 786M520 852C574 825 640 846 694 810M706 778C762 751 809 771 844 724M704 206C754 235 793 281 824 334M586 180C638 194 690 225 728 264" fill="none" stroke={RED} strokeWidth="1.4" />
            <path d="M444 168C462 230 418 281 440 342C461 399 544 405 558 468C571 527 499 555 521 617C544 684 630 690 640 766C647 816 610 850 588 884" fill="none" stroke={RED} strokeWidth="18" strokeLinecap="round" />
            <path d="M444 168C462 230 418 281 440 342C461 399 544 405 558 468C571 527 499 555 521 617C544 684 630 690 640 766C647 816 610 850 588 884" fill="none" stroke={IVORY} strokeWidth="10" strokeLinecap="round" />
            <path d="M442 213C454 217 468 219 480 218M427 300C444 302 459 300 474 294M466 394C482 387 500 381 516 372M544 466C559 459 574 452 590 443M516 552C534 555 552 554 570 548M535 652C550 642 568 635 586 632M625 744C645 738 665 735 684 736" fill="none" stroke={RED} strokeWidth="1.6" />
            <path d="M274 310C294 278 326 252 360 238M296 332C325 303 352 282 386 264M318 354C351 330 380 308 412 292M668 308C704 330 732 362 750 400M642 334C683 358 710 390 728 430M620 362C653 382 680 417 698 456M304 648C340 626 376 612 416 604M326 676C362 656 402 642 442 636M348 704C384 684 424 672 464 666" fill="none" stroke={RED} strokeWidth="2" />
            <ellipse cx="244" cy="214" rx="28" ry="12" fill={GOLD_DARK} stroke={RED} strokeWidth="2" />
            <ellipse cx="800" cy="602" rx="34" ry="16" fill={GOLD_DARK} stroke={RED} strokeWidth="2" />
          </g>

          {/* === CONTROL-ZONE-WEST : balayage (clip-rect qui descend) === */}
          <g id="control-zone-west">
            {/* contour toujours present une fois la zone "armee" (fade leger) */}
            <path d="M210 496C252 438 322 416 390 430C444 442 474 484 470 536C466 594 416 638 350 648C292 657 226 625 204 570C194 545 195 521 210 496Z" fill="none" stroke={RED} strokeWidth="3" opacity={Math.min(1, pZoneW * 1.5)} />
            {/* remplissage hachure revele par le clip qui descend */}
            <g clipPath="url(#zoneWClip)">
              <path d="M210 496C252 438 322 416 390 430C444 442 474 484 470 536C466 594 416 638 350 648C292 657 226 625 204 570C194 545 195 521 210 496Z" fill={GOLD_DARK} stroke={RED} strokeWidth="3" />
              <path d="M224 518L274 461M236 550L310 444M254 586L348 438M286 616L390 445M326 634L432 468M370 630L462 506M414 606L462 554" fill="none" stroke={RED} strokeWidth="1.8" />
              <path d="M232 496C278 478 327 468 382 474M222 560C278 540 336 530 444 532M268 612C318 594 374 584 426 584" fill="none" stroke={IVORY} strokeWidth="1.4" />
            </g>
          </g>

          {/* === CONTROL-ZONE-EAST : balayage === */}
          <g id="control-zone-east">
            <path d="M594 252C656 222 722 238 764 286C808 336 806 404 764 452C720 501 638 503 588 464C536 424 534 344 572 292C578 282 584 266 594 252Z" fill="none" stroke={RED} strokeWidth="3" opacity={Math.min(1, pZoneE * 1.5)} />
            <g clipPath="url(#zoneEClip)">
              <path d="M594 252C656 222 722 238 764 286C808 336 806 404 764 452C720 501 638 503 588 464C536 424 534 344 572 292C578 282 584 266 594 252Z" fill={GOLD_MID} stroke={RED} strokeWidth="3" />
              <path d="M574 324L638 246M566 366L680 238M574 410L724 250M604 454L778 292M650 480L800 340M700 480L798 396" fill="none" stroke={RED} strokeWidth="1.8" />
              <path d="M598 294C644 278 704 282 746 314M578 362C638 338 718 348 782 386M604 434C654 416 720 418 760 442" fill="none" stroke={IVORY} strokeWidth="1.4" />
            </g>
          </g>

          {/* === VILLES : POP (scale+opacity) + PULSE sonar en boucle === */}
          <g id="city-alpha" opacity={cA.op}>
            <Sonar cx={322} cy={548} frame={frame} period={40} phase={0} rMax={55} />
            <g transform={`translate(322 548) scale(${cA.scale}) translate(-322 -548)`}>
              <circle cx="322" cy="548" r="42" fill="none" stroke={RED} strokeWidth="3" />
              <circle cx="322" cy="548" r="25" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="322" cy="548" r="8" fill={RED} stroke={RED} strokeWidth="1" />
              <path d="M322 492V604M266 548H378M292 518L352 578M352 518L292 578" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="322" cy="548" r="55" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="7 8" />
            </g>
          </g>
          <g id="city-bravo" opacity={cB.op}>
            <Sonar cx={690} cy={354} frame={frame} period={40} phase={13} rMax={50} />
            <g transform={`translate(690 354) scale(${cB.scale}) translate(-690 -354)`}>
              <circle cx="690" cy="354" r="38" fill="none" stroke={RED} strokeWidth="3" />
              <circle cx="690" cy="354" r="21" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="690" cy="354" r="7" fill={RED} stroke={RED} strokeWidth="1" />
              <path d="M690 306V402M642 354H738M664 328L716 380M716 328L664 380" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="690" cy="354" r="50" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="7 8" />
            </g>
          </g>
          <g id="city-charlie" opacity={cC.op}>
            <Sonar cx={734} cy={704} frame={frame} period={40} phase={26} rMax={53} />
            <g transform={`translate(734 704) scale(${cC.scale}) translate(-734 -704)`}>
              <circle cx="734" cy="704" r="40" fill="none" stroke={RED} strokeWidth="3" />
              <circle cx="734" cy="704" r="23" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="734" cy="704" r="7" fill={RED} stroke={RED} strokeWidth="1" />
              <path d="M734 652V756M682 704H786M706 676L762 732M762 676L706 732" fill="none" stroke={RED} strokeWidth="2" />
              <circle cx="734" cy="704" r="53" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="7 8" />
            </g>
          </g>

          {/* === FLECHE NORD : se TRACE (dashoffset L->0) === */}
          <g id="maneuver-arrow-north">
            <path d="M284 542C340 470 421 414 505 384C560 364 608 358 650 354" fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={offN} />
            <path d="M292 515C356 452 430 408 512 380C562 363 605 354 639 347" fill="none" stroke={IVORY} strokeWidth="2.2" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={offN} />
            <g opacity={headN}>
              <polygon points="650,354 606,326 619,383" fill={RED} stroke={RED} strokeWidth="2" />
              <path d="M352 462C365 476 374 491 381 510M434 410C447 425 456 441 461 458M526 378C534 394 540 411 542 428" fill="none" stroke={RED} strokeWidth="2" />
            </g>
          </g>

          {/* === FLECHE SUD : se TRACE === */}
          <g id="maneuver-arrow-south">
            <path d="M724 660C692 602 644 558 590 520C548 490 500 468 456 452" fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={offS} />
            <path d="M704 666C674 612 632 571 578 532C535 500 496 482 462 468" fill="none" stroke={IVORY} strokeWidth="2" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={offS} />
            <g opacity={headS}>
              <polygon points="456,452 484,497 511,446" fill={RED} stroke={RED} strokeWidth="2" />
              <path d="M666 584C650 592 633 598 614 602M612 532C594 539 575 544 555 546M550 490C532 496 514 498 494 498" fill="none" stroke={RED} strokeWidth="2" />
            </g>
          </g>

          {/* === LEGENDE : fade-in discret === */}
          <g id="legend" opacity={pChrome}>
            <rect x="646" y="140" width="236" height="150" rx="14" fill={GOLD} stroke={RED} strokeWidth="3" />
            <rect x="664" y="160" width="200" height="112" rx="7" fill="none" stroke={RED} strokeWidth="1.6" />
            <path d="M684 184H760M684 208H836M684 232H812M684 256H792" fill="none" stroke={RED} strokeWidth="2" />
            <circle cx="826" cy="184" r="16" fill="none" stroke={RED} strokeWidth="2" />
            <circle cx="826" cy="184" r="7" fill="none" stroke={RED} strokeWidth="1.6" />
            <path d="M810 184H842M826 168V200" fill="none" stroke={RED} strokeWidth="1.6" />
            <path d="M806 226C826 214 842 214 858 224" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" />
            <polygon points="858,224 836,211 839,238" fill={RED} stroke={RED} strokeWidth="1" />
            <rect x="814" y="246" width="42" height="18" fill={GOLD_DARK} stroke={RED} strokeWidth="1.5" />
            <path d="M816 264L834 247M830 264L849 247M845 264L856 254" fill="none" stroke={RED} strokeWidth="1" />
          </g>

          {/* === COMPASS : fade-in + aiguille N/S oscille === */}
          <g id="compass" opacity={pChrome}>
            <circle cx="790" cy="800" r="70" fill="none" stroke={RED} strokeWidth="3" />
            <circle cx="790" cy="800" r="44" fill="none" stroke={RED} strokeWidth="1.8" />
            {/* graduations fixes */}
            <path d="M790 720V744M790 856V880M710 800H734M846 800H870M733 743L750 760M830 840L847 857M847 743L830 760M750 840L733 857" fill="none" stroke={RED} strokeWidth="2" />
            <path d="M790 684V706M790 894V916M674 800H696M884 800H906" fill="none" stroke={RED} strokeWidth="3" />
            {/* aiguille N/S qui oscille autour du centre */}
            <g transform={`rotate(${needleAngle} 790 800)`}>
              <polygon points="790,706 808,784 790,800 772,784" fill={IVORY} stroke={RED} strokeWidth="2" />
              <polygon points="790,894 772,816 790,800 808,816" fill={GOLD_MID} stroke={RED} strokeWidth="2" />
              <polygon points="696,800 774,782 790,800 774,818" fill={GOLD_MID} stroke={RED} strokeWidth="2" />
              <polygon points="884,800 806,782 790,800 806,818" fill={IVORY} stroke={RED} strokeWidth="2" />
              <circle cx="790" cy="800" r="8" fill={RED} stroke={RED} strokeWidth="1" />
            </g>
          </g>
        </g>

        {/* rim rouge grave (apparait avec le fond) */}
        <g id="rim" opacity={pFond}>
          <circle cx="512" cy="512" r="480" fill="none" stroke={RED} strokeWidth="8" />
        </g>
      </svg>
    </div>
  );
};

export default EtatMajorGptAnimee;

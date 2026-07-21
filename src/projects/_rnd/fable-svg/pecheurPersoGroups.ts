// Segments SVG du pecheur senegalais (matiere statique generee par Fable).
// La MATIERE vient du .svg source (public/_rnd/fable-svg/pecheur-perso.svg) ;
// l'ANIMATION (rig par rotate autour des pivots) est faite en JSX par frame
// (doctrine SVG-SCENES-GENERATIVES : dangerouslySetInnerHTML n'anime pas les
// <g> internes, donc chaque segment est injecte dans un wrapper <g transform>
// anime cote React). On stocke le CONTENU INTERNE de chaque <g id="...">.
//
// PIVOTS DE RIG (px,py) :
//   epaule-gauche 455,330 / coude-gauche 428,460
//   epaule-droite 625,330 / coude-droite 656,460
//   hanche-gauche 495,575 / genou-gauche 485,755
//   hanche-droite 586,575 / genou-droite 595,755
//   cou 540,285
//
// Z-ORDER de dessin (respecter) : ombre -> jambes(haut+bas) -> pieds -> torse
//   -> tete -> bras(haut+bas) -> chapeau.

export const PECHEUR_DEFS = `
  <radialGradient id="gradFace" cx="0.42" cy="0.36" r="0.85">
    <stop offset="0" stop-color="#8f5a34"/>
    <stop offset="0.45" stop-color="#6a3d21"/>
    <stop offset="1" stop-color="#3d2312"/>
  </radialGradient>
  <linearGradient id="gradSkinL" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7c4a2b"/>
    <stop offset="0.55" stop-color="#5c351e"/>
    <stop offset="1" stop-color="#3b2213"/>
  </linearGradient>
  <linearGradient id="gradSkinV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#77462a"/>
    <stop offset="1" stop-color="#422613"/>
  </linearGradient>
  <linearGradient id="gradTunic" x1="0" y1="0" x2="0.25" y2="1">
    <stop offset="0" stop-color="#d2a066"/>
    <stop offset="0.55" stop-color="#b0804a"/>
    <stop offset="1" stop-color="#8a5f33"/>
  </linearGradient>
  <linearGradient id="gradPants" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#626c79"/>
    <stop offset="0.6" stop-color="#4a525e"/>
    <stop offset="1" stop-color="#3a414b"/>
  </linearGradient>
  <linearGradient id="gradKnee" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3a414c"/>
    <stop offset="1" stop-color="#363d47"/>
  </linearGradient>
  <linearGradient id="gradHatBrim" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e2c07c"/>
    <stop offset="1" stop-color="#a8843f"/>
  </linearGradient>
  <linearGradient id="gradHatCrown" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8ca88"/>
    <stop offset="1" stop-color="#b08a45"/>
  </linearGradient>
  <linearGradient id="gradSash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9a5330"/>
    <stop offset="1" stop-color="#66351b"/>
  </linearGradient>
`;

export const PECHEUR_OMBRE_SOL = `
  <ellipse cx="540" cy="1002" rx="235" ry="30" fill="#2a1608" opacity="0.14"/>
  <ellipse cx="465" cy="998" rx="52" ry="12" fill="#2a1608" opacity="0.2"/>
  <ellipse cx="612" cy="998" rx="52" ry="12" fill="#2a1608" opacity="0.2"/>
`;

export const PECHEUR_JAMBE_GAUCHE_HAUT = `
  <path d="M 469 562 Q 470 542 496 542 Q 522 542 523 562 Q 517 656 509 748 Q 508 774 485 776 Q 462 774 462 748 Q 464 656 469 562 Z" fill="url(#gradPants)"/>
  <path d="M 468 618 Q 464 682 462 746" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 519 618 Q 513 682 509 746" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 480 580 Q 476 660 478 735" fill="none" stroke="#262c35" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 505 590 Q 503 650 500 720" fill="none" stroke="#262c35" stroke-width="2.5" stroke-opacity="0.3" stroke-linecap="round"/>
`;

export const PECHEUR_JAMBE_DROITE_HAUT = `
  <path d="M 557 562 Q 558 542 584 542 Q 610 542 611 562 Q 616 656 618 748 Q 618 774 595 776 Q 572 774 571 748 Q 563 656 557 562 Z" fill="url(#gradPants)"/>
  <path d="M 561 618 Q 566 682 571 746" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 612 618 Q 616 682 618 746" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 600 580 Q 604 660 602 735" fill="none" stroke="#262c35" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 575 590 Q 577 650 580 720" fill="none" stroke="#262c35" stroke-width="2.5" stroke-opacity="0.3" stroke-linecap="round"/>
`;

// jambe-bas = mollet + cheville + pied "chair" (le path se poursuit jusqu'a y~928).
export const PECHEUR_JAMBE_GAUCHE_BAS = `
  <path d="M 461 748 Q 461 726 485 726 Q 509 726 509 748 L 508 790 L 462 790 Z" fill="url(#gradKnee)"/>
  <ellipse cx="485" cy="752" rx="12" ry="14" fill="#6b7480" opacity="0.22"/>
  <path d="M 462 752 L 462 782" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 508 752 L 508 782" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 456 780 L 514 780 Q 521 791 514 802 L 456 802 Q 449 791 456 780 Z" fill="#4d5561" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 456 791 Q 485 797 514 791" fill="none" stroke="#2b313a" stroke-width="2.5" stroke-opacity="0.6" stroke-linecap="round"/>
  <path d="M 464 800 Q 466 852 472 900 Q 474 926 481 928 Q 489 926 491 900 Q 499 850 503 800 Z" fill="url(#gradSkinL)"/>
  <path d="M 464 802 Q 467 860 474 912" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 503 802 Q 498 862 490 912" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 471 812 Q 474 862 478 904" fill="none" stroke="#96603a" stroke-width="4" stroke-opacity="0.5" stroke-linecap="round"/>
`;

export const PECHEUR_JAMBE_DROITE_BAS = `
  <path d="M 571 748 Q 571 726 595 726 Q 619 726 619 748 L 618 790 L 572 790 Z" fill="url(#gradKnee)"/>
  <ellipse cx="595" cy="752" rx="12" ry="14" fill="#6b7480" opacity="0.22"/>
  <path d="M 572 752 L 572 782" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 618 752 L 618 782" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 566 780 L 624 780 Q 631 791 624 802 L 566 802 Q 559 791 566 780 Z" fill="#4d5561" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 566 791 Q 595 797 624 791" fill="none" stroke="#2b313a" stroke-width="2.5" stroke-opacity="0.6" stroke-linecap="round"/>
  <path d="M 577 800 Q 581 852 589 900 Q 591 926 599 928 Q 606 926 608 900 Q 614 850 616 800 Z" fill="url(#gradSkinL)"/>
  <path d="M 577 802 Q 581 860 589 912" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 616 802 Q 613 862 606 912" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 609 812 Q 606 862 602 904" fill="none" stroke="#96603a" stroke-width="4" stroke-opacity="0.5" stroke-linecap="round"/>
`;

export const PECHEUR_PIED_GAUCHE = `
  <path d="M 466 916 L 496 916 Q 499 936 502 952 Q 505 976 500 992 Q 497 1002 484 1002 L 448 1000 Q 432 1000 430 990 Q 429 981 440 974 Q 456 962 461 946 Q 465 932 466 916 Z" fill="url(#gradSkinL)"/>
  <path d="M 466 918 Q 465 934 461 946 Q 456 962 440 974 Q 429 981 430 990 Q 432 1000 448 1000 L 484 1002 Q 497 1002 500 992 Q 505 976 502 952 Q 499 936 496 918" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linecap="round"/>
  <path d="M 444 998 L 447 984" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 453 999 L 456 985" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 462 999 L 465 986" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.4" stroke-linecap="round"/>
`;

export const PECHEUR_PIED_DROIT = `
  <path d="M 584 916 L 614 916 Q 615 932 619 946 Q 624 962 640 974 Q 651 981 650 990 Q 648 1000 632 1000 L 596 1002 Q 583 1002 580 992 Q 575 976 578 952 Q 581 936 584 916 Z" fill="url(#gradSkinL)"/>
  <path d="M 614 918 Q 615 934 619 946 Q 624 962 640 974 Q 651 981 650 990 Q 648 1000 632 1000 L 596 1002 Q 583 1002 580 992 Q 575 976 578 952 Q 581 936 584 918" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linecap="round"/>
  <path d="M 636 998 L 633 984" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 627 999 L 624 985" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 618 999 L 615 986" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.4" stroke-linecap="round"/>
`;

export const PECHEUR_TORSE = `
  <path d="M 449 320 Q 468 302 506 297 Q 540 304 574 297 Q 612 302 631 320 Q 646 344 649 402 L 653 468 Q 656 520 649 558 L 645 600 Q 594 618 540 618 Q 486 618 435 600 L 431 558 Q 424 520 427 468 L 431 402 Q 434 344 449 320 Z" fill="url(#gradTunic)" stroke="#241206" stroke-width="3.5" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 632 320 Q 648 344 649 402 L 653 468 Q 656 520 649 558 L 645 600 Q 616 610 592 614 Q 628 560 630 460 Q 632 380 618 330 Z" fill="#241206" opacity="0.13"/>
  <path d="M 449 320 Q 434 344 431 402 L 427 468 Q 424 520 432 558 Q 440 480 442 420 Q 444 360 456 322 Z" fill="#e8c187" opacity="0.16"/>
  <path d="M 470 340 Q 462 420 468 470" fill="none" stroke="#6e4b26" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 610 340 Q 618 420 612 470" fill="none" stroke="#6e4b26" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 540 372 Q 543 430 540 478" fill="none" stroke="#6e4b26" stroke-width="2.5" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M 438 596 Q 540 614 642 596" fill="none" stroke="#241206" stroke-width="6" stroke-opacity="0.22" stroke-linecap="round"/>
  <path d="M 508 301 Q 540 309 572 301 L 543 356 Q 540 360 537 356 Z" fill="url(#gradSkinV)"/>
  <path d="M 506 300 L 540 358" fill="none" stroke="#8a5f33" stroke-width="8" stroke-opacity="0.95" stroke-linecap="round"/>
  <path d="M 574 300 L 540 358" fill="none" stroke="#8a5f33" stroke-width="8" stroke-opacity="0.95" stroke-linecap="round"/>
  <path d="M 518 306 Q 540 330 562 306" fill="none" stroke="#2f1c0e" stroke-width="4" stroke-opacity="0.8" stroke-linecap="round"/>
  <ellipse cx="540" cy="332" rx="5" ry="8" fill="#d9c08c" stroke="#241206" stroke-width="2" stroke-opacity="0.6"/>
  <path d="M 433 536 Q 540 564 647 536 L 649 572 Q 540 600 431 572 Z" fill="url(#gradSash)" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linejoin="round"/>
  <path d="M 470 552 Q 540 576 610 552" fill="none" stroke="#5a2d16" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 439 566 Q 430 606 436 642 Q 444 649 452 641 Q 456 604 457 570 Z" fill="#7d4225" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45" stroke-linejoin="round"/>
  <circle cx="447" cy="558" r="13" fill="url(#gradSash)" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5"/>
`;

export const PECHEUR_TETE = `
  <path d="M 517 232 L 517 308 Q 540 326 563 308 L 563 232 Z" fill="url(#gradSkinV)"/>
  <path d="M 517 240 Q 540 260 563 240 L 563 262 Q 540 276 517 262 Z" fill="#2a1608" opacity="0.28"/>
  <path d="M 517 244 L 517 300" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M 563 244 L 563 300" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M 477 192 Q 465 188 467 204 Q 469 218 480 220 Q 482 206 477 192 Z" fill="url(#gradSkinV)" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45"/>
  <path d="M 602 190 Q 618 184 616 202 Q 614 220 600 224 Q 596 208 602 190 Z" fill="url(#gradSkinV)" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45"/>
  <path d="M 605 198 Q 610 200 606 210" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 540 106 Q 606 108 611 180 Q 614 218 599 244 Q 583 270 557 278 Q 540 283 524 278 Q 497 268 483 242 Q 469 216 471 178 Q 476 108 540 106 Z" fill="url(#gradFace)" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 472 176 Q 468 116 540 110 Q 612 116 608 176 Q 600 146 574 137 Q 540 128 506 137 Q 480 146 472 176 Z" fill="#171009"/>
  <path d="M 480 190 L 486 226 Q 478 224 476 210 Z" fill="#171009" opacity="0.85"/>
  <path d="M 600 190 L 594 226 Q 602 224 604 210 Z" fill="#171009" opacity="0.85"/>
  <path d="M 484 236 Q 505 274 540 281 Q 574 274 596 238 Q 590 268 560 284 Q 540 290 520 284 Q 491 268 484 236 Z" fill="#1c1109" opacity="0.22"/>
  <ellipse cx="508" cy="212" rx="16" ry="10" fill="#935b32" opacity="0.3"/>
  <ellipse cx="576" cy="214" rx="13" ry="9" fill="#935b32" opacity="0.2"/>
  <path d="M 495 179 Q 511 171 527 177" fill="none" stroke="#14100a" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M 551 177 Q 567 171 583 178" fill="none" stroke="#14100a" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M 499 193 Q 511 185 525 192 Q 512 200 499 193 Z" fill="#e6d6bd"/>
  <path d="M 549 192 Q 561 185 575 193 Q 562 200 549 192 Z" fill="#e6d6bd"/>
  <circle cx="514" cy="192" r="5" fill="#1a0f07"/>
  <circle cx="560" cy="192" r="5" fill="#1a0f07"/>
  <path d="M 499 191 Q 512 184 525 190" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.7" stroke-linecap="round"/>
  <path d="M 549 190 Q 562 184 575 191" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.7" stroke-linecap="round"/>
  <path d="M 536 198 Q 531 216 524 228 Q 534 236 546 233 Q 540 216 540 200 Z" fill="#3a2113" opacity="0.32"/>
  <path d="M 537 196 Q 533 212 530 222" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
  <path d="M 522 230 Q 528 236 536 234" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.6" stroke-linecap="round"/>
  <path d="M 544 233 Q 550 235 553 230" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.6" stroke-linecap="round"/>
  <path d="M 515 249 Q 537 259 561 248" fill="none" stroke="#241206" stroke-width="5" stroke-opacity="0.85" stroke-linecap="round"/>
  <path d="M 519 252 Q 538 262 557 251 Q 549 266 538 266 Q 526 265 519 252 Z" fill="#6b3a24" opacity="0.75"/>
`;

export const PECHEUR_BRAS_GAUCHE_HAUT = `
  <path d="M 429 336 Q 431 307 456 307 Q 481 309 481 338 Q 476 398 445 456 Q 439 476 428 474 Q 416 471 414 453 Q 419 396 429 336 Z" fill="url(#gradSkinL)"/>
  <path d="M 421 398 Q 416 428 414 452" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 475 398 Q 462 430 446 454" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 425 340 Q 426 305 456 303 Q 486 306 486 342 L 478 402 Q 457 413 436 401 Z" fill="url(#gradTunic)" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 438 399 Q 457 409 476 399 L 473 412 Q 456 420 441 411 Z" fill="#241206" opacity="0.22"/>
  <path d="M 446 328 Q 443 362 445 392" fill="none" stroke="#6e4b26" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
`;

export const PECHEUR_BRAS_GAUCHE_BAS = `
  <path d="M 412 460 Q 412 443 428 442 Q 444 443 445 461 Q 450 510 453 550 Q 455 570 443 574 Q 431 577 428 558 Q 419 509 412 460 Z" fill="url(#gradSkinL)"/>
  <path d="M 412 462 Q 419 509 428 554" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 445 463 Q 450 510 453 548" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 430 566 Q 448 562 455 572 Q 461 584 460 600 Q 459 620 450 630 Q 443 636 438 628 Q 432 634 426 626 Q 419 630 415 619 Q 409 621 408 608 Q 407 594 413 582 Q 420 570 430 566 Z" fill="url(#gradSkinL)" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linejoin="round"/>
  <path d="M 438 628 L 441 604" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 426 626 L 430 602" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 415 619 L 421 600" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 452 574 Q 458 582 456 594" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
`;

export const PECHEUR_BRAS_DROIT_HAUT = `
  <path d="M 599 338 Q 601 308 625 307 Q 649 308 651 337 Q 661 396 665 452 Q 667 472 654 474 Q 642 475 637 456 Q 612 400 599 338 Z" fill="url(#gradSkinL)"/>
  <path d="M 660 398 Q 663 428 665 450" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 607 402 Q 624 432 638 455" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 594 342 Q 594 306 624 303 Q 654 305 655 340 L 649 402 Q 628 413 607 401 Z" fill="url(#gradTunic)" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 609 399 Q 628 409 647 399 L 644 412 Q 627 420 612 411 Z" fill="#241206" opacity="0.22"/>
  <path d="M 634 328 Q 637 362 635 392" fill="none" stroke="#6e4b26" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
`;

export const PECHEUR_BRAS_DROIT_BAS = `
  <path d="M 641 459 Q 641 442 656 442 Q 671 443 672 461 Q 665 507 651 546 Q 645 563 633 559 Q 622 553 626 538 Q 634 498 641 459 Z" fill="url(#gradSkinL)"/>
  <path d="M 672 463 Q 665 507 652 542" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 641 461 Q 634 500 628 536" fill="none" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 618 546 Q 636 542 644 552 Q 651 564 649 580 Q 647 600 638 611 Q 631 618 626 610 Q 619 616 614 606 Q 606 610 603 598 Q 600 584 604 571 Q 609 554 618 546 Z" fill="url(#gradSkinL)" stroke="#241206" stroke-width="2.5" stroke-opacity="0.5" stroke-linejoin="round"/>
  <path d="M 626 610 L 629 588" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 614 606 L 619 586" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 603 598 L 610 581" fill="none" stroke="#241206" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 641 554 Q 647 562 645 574" fill="none" stroke="#241206" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
`;

export const PECHEUR_CHAPEAU = `
  <path d="M 534 20 Q 604 30 630 112 Q 540 136 450 112 Q 472 30 534 20 Z" fill="url(#gradHatCrown)" stroke="#241206" stroke-width="3" stroke-opacity="0.5" stroke-linejoin="round"/>
  <path d="M 470 82 Q 540 62 610 82" fill="none" stroke="#8a672f" stroke-width="2.5" stroke-opacity="0.55" stroke-linecap="round"/>
  <path d="M 486 58 Q 540 44 594 58" fill="none" stroke="#8a672f" stroke-width="2.5" stroke-opacity="0.55" stroke-linecap="round"/>
  <path d="M 504 36 Q 536 28 566 36" fill="none" stroke="#8a672f" stroke-width="2.5" stroke-opacity="0.5" stroke-linecap="round"/>
  <path d="M 452 106 Q 540 130 628 106 L 630 116 Q 540 140 450 116 Z" fill="#6b4a22" opacity="0.9"/>
  <path d="M 385 112 Q 458 78 540 76 Q 622 78 695 112 Q 700 126 686 131 Q 616 152 540 153 Q 464 152 394 131 Q 380 126 385 112 Z" fill="url(#gradHatBrim)" stroke="#241206" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
  <path d="M 412 118 Q 540 92 668 118" fill="none" stroke="#8a672f" stroke-width="2.5" stroke-opacity="0.4" stroke-linecap="round"/>
  <path d="M 470 140 Q 540 158 610 140 Q 604 166 540 172 Q 476 166 470 140 Z" fill="#1c1109" opacity="0.3"/>
`;

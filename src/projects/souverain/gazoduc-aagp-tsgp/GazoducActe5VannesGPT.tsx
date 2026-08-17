// ⛔⛔ VERSION ABANDONNEE — NE PAS REPRENDRE (decision Aziz 2026-08-16).
// Cette version montrait UNE MAIN qui hesite entre deux robinets. Elle a ete ecartee pour 3 raisons :
//   1. Elle REPETAIT la narration : la voix dit "qui aura la main sur le robinet" au meme instant.
//   2. Elle portait le mauvais sujet : le script dit "et SURTOUT, selon quel MODELE" — l'enjeu est
//      le modele, pas la personne qui choisit.
//   3. Pire : DEUX robinets contredisaient le texte, qui dit "LE prochain grand robinet" (SINGULIER).
// ✅ La version RETENUE est GazoducActe5Vannes2.tsx : UNE vanne unique + une bifurcation en Y.
// Conserve uniquement comme trace du test comparatif SVG (4 modeles sur la main).
// MOTEUR: objet/metaphore SVG — "qui aura la main sur le robinet" est la metaphore du script lui-meme ;
// un objet + une main en contour plat la disent sans carte ni personnage.
//
// GazoducActe5VannesGPT — Acte 5, segment 2 "L'ENJEU" (9.3 -> 27.0s, 530 frames).
// TEST D'ANIMATION sur le dessin de GPT-5.5 (concours SVG 4 modeles, choix d'Aziz 2026-08-16).
//
// ⚠️ CE QUE LA STRUCTURE DE GPT PERMET REELLEMENT (verifie, pas suppose) : ses groupes `finger-index`,
// `finger-middle`... ne sont PAS les doigts — ce sont de petits arcs de JOINTURES (~28px). La main
// entiere est UN SEUL path continu, exactement comme celle de Fable. Aucun doigt n'est articulable
// separement. On anime donc la main comme un TOUT : derive, orientation, glisse, pose.
//
// Ancres (frames locales, forced-align reel) :
//   f0-260   la main hesite au centre, les 2 vannes sont stricitement identiques
//   f260     "robinet" — la main s'oriente vers la droite
//   f383     "modele" — les 2 vannes se DISTINGUENT (gauche s'efface, droite s'affirme)
//   f532     "SOUVERAINS" — la main se pose sur la vanne de DROITE
//
// ZERO tremblement, zero flash, determinisme total (aucun Math.random / Date.now).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const W = 1920;
const H = 1080;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = { ...clampB, easing: Easing.inOut(Easing.quad) };

export const GazoducActe5VannesGPT: React.FC = () => {
  const frame = useCurrentFrame();

  // 1. HESITATION : derive lente et continue, jamais un tremblement (amplitude faible, periode longue).
  const driftX = Math.sin(frame * 0.021) * 26 + Math.sin(frame * 0.0091 + 1.7) * 12;
  const driftY = Math.sin(frame * 0.017 + 0.9) * 9;

  // 2. "robinet" (f260) : la main s'ORIENTE — elle pivote vers la droite, elle choisit une direction.
  const orient = interpolate(frame, [260, 320], [0, 1], ease);

  // 3. "modele" (f383) : les 2 vannes cessent d'etre equivalentes.
  const distinguish = interpolate(frame, [383, 440], [0, 1], ease);
  const leftFade = interpolate(distinguish, [0, 1], [1, 0.32], clampB);
  const rightAffirm = interpolate(distinguish, [0, 1], [1, 1], clampB);
  const rightGlow = interpolate(distinguish, [0, 1], [0, 0.55], clampB);

  // 4. "SOUVERAINS" (f532) : la main SE POSE sur la vanne de droite. Geste unique, net, definitif.
  const reach = interpolate(frame, [452, 524], [0, 1], ease);
  // ⚠️ Mesure sur rendu : a +470 la main CHEVAUCHE le volant (traits enchevetres, illisible).
  // Elle doit s'arreter AU-DESSUS, en contact avec le haut du volant, pas dedans.
  const handX = driftX * (1 - reach) + reach * 330;
  const handY = driftY * (1 - reach) + reach * -96;
  const handRot = orient * 5 - reach * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050c1a" }}>
      <svg width={W} height={H} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
        <radialGradient id="background-gradient" cx="50%" cy="52%" r="82%">
        <stop offset="0%" stopColor="#0d1f38"/>
        <stop offset="100%" stopColor="#050c1a"/>
        </radialGradient>
        <pattern id="grid-small" width="35" height="35" patternUnits="userSpaceOnUse">
        <path d="M35 0H0V35" fill="none" stroke="#2E9FD4" strokeWidth="1" opacity="0.09"/>
        </pattern>
        <pattern id="grid-large" width="140" height="140" patternUnits="userSpaceOnUse">
        <path d="M140 0H0V140" fill="none" stroke="#7FD8FF" strokeWidth="2" opacity="0.11"/>
        </pattern>
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
        </feMerge>
        </filter>
        </defs>
        <g id="background">
        <rect x="0" y="0" width="1920" height="1080" fill="url(#background-gradient)"/>
        </g>
        <g id="grid">
        <rect x="0" y="0" width="1920" height="1080" fill="url(#grid-small)"/>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#grid-large)"/>
        <path d="M55 0V1080M1865 0V1080M0 395H1920M0 660H1920M0 940H1920" fill="none" stroke="#7FD8FF" strokeWidth="3" opacity="0.16"/>
        </g>
        <g id="pipes" fill="none" stroke="#7FD8FF" strokeLinecap="round" strokeLinejoin="round" filter="url(#soft-glow)">
        <g id="pipe-left">
        <path d="M0 535H196" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M0 675H196" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M658 842V940H0" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M746 842V940H958" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        </g>
        <g id="pipe-right">
        <path d="M1920 535H1724" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M1920 675H1724" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M1262 842V940H1920" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        <path d="M1174 842V940H962" stroke="#7FD8FF" strokeWidth="6" opacity="0.72"/>
        </g>
        </g>
        <g id="tap-left-anim" opacity={leftFade}>
          <g id="tap-left" fill="none" stroke="#7FD8FF" strokeLinecap="round" strokeLinejoin="round" filter="url(#soft-glow)">
          <g id="tap-left-glow" opacity="0.22">
          <path d="M300 321C270 316 258 321 255 348C252 375 269 386 300 379C337 371 370 365 407 368C407 337 451 337 451 368C489 365 522 371 559 379C590 386 607 375 604 348C601 321 589 316 559 321C521 328 489 338 451 335C451 305 407 305 407 335C369 338 337 328 300 321Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M411 371L401 456M449 371L459 456M402 456L457 456M416 398L444 456M443 398L416 456" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M365 454C386 443 475 443 497 454L506 481C478 498 385 498 356 481Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M352 469C388 482 475 482 510 469M354 493H506" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M195 512H252C262 512 270 520 270 530V680C270 690 262 698 252 698H195C185 698 177 690 177 680V530C177 520 185 512 195 512Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M215 512V698M247 512V698" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M270 535C322 535 340 536 358 506C372 482 367 463 374 456M495 456C502 482 496 504 519 523C546 546 617 525 676 586C724 635 736 699 736 794" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M270 675C326 675 338 718 418 718C482 718 500 675 555 674C632 672 658 719 658 794" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M649 794H745C757 794 767 804 767 816V839C767 851 757 861 745 861H649C637 861 627 851 627 839V816C627 804 637 794 649 794Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M629 818H765M629 842H765" stroke="#7FD8FF" strokeWidth="12"/>
          </g>
          <path d="M300 321C270 316 258 321 255 348C252 375 269 386 300 379C337 371 370 365 407 368C407 337 451 337 451 368C489 365 522 371 559 379C590 386 607 375 604 348C601 321 589 316 559 321C521 328 489 338 451 335C451 305 407 305 407 335C369 338 337 328 300 321Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M411 371L401 456M449 371L459 456M402 456L457 456M416 398L444 456M443 398L416 456" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M365 454C386 443 475 443 497 454L506 481C478 498 385 498 356 481Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M352 469C388 482 475 482 510 469M354 493H506" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M195 512H252C262 512 270 520 270 530V680C270 690 262 698 252 698H195C185 698 177 690 177 680V530C177 520 185 512 195 512Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M215 512V698M247 512V698" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M270 535C322 535 340 536 358 506C372 482 367 463 374 456M495 456C502 482 496 504 519 523C546 546 617 525 676 586C724 635 736 699 736 794" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M270 675C326 675 338 718 418 718C482 718 500 675 555 674C632 672 658 719 658 794" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M649 794H745C757 794 767 804 767 816V839C767 851 757 861 745 861H649C637 861 627 851 627 839V816C627 804 637 794 649 794Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M629 818H765M629 842H765" stroke="#7FD8FF" strokeWidth="5"/>
          </g>
        </g>
        <g id="tap-right-anim" opacity={rightAffirm}>
          <g id="tap-right" transform="matrix(-1 0 0 1 1920 0)" fill="none" stroke="#7FD8FF" strokeLinecap="round" strokeLinejoin="round" filter="url(#soft-glow)">
          <g id="tap-right-glow" opacity="0.22">
          <path d="M300 321C270 316 258 321 255 348C252 375 269 386 300 379C337 371 370 365 407 368C407 337 451 337 451 368C489 365 522 371 559 379C590 386 607 375 604 348C601 321 589 316 559 321C521 328 489 338 451 335C451 305 407 305 407 335C369 338 337 328 300 321Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M411 371L401 456M449 371L459 456M402 456L457 456M416 398L444 456M443 398L416 456" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M365 454C386 443 475 443 497 454L506 481C478 498 385 498 356 481Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M352 469C388 482 475 482 510 469M354 493H506" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M195 512H252C262 512 270 520 270 530V680C270 690 262 698 252 698H195C185 698 177 690 177 680V530C177 520 185 512 195 512Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M215 512V698M247 512V698" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M270 535C322 535 340 536 358 506C372 482 367 463 374 456M495 456C502 482 496 504 519 523C546 546 617 525 676 586C724 635 736 699 736 794" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M270 675C326 675 338 718 418 718C482 718 500 675 555 674C632 672 658 719 658 794" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M649 794H745C757 794 767 804 767 816V839C767 851 757 861 745 861H649C637 861 627 851 627 839V816C627 804 637 794 649 794Z" stroke="#7FD8FF" strokeWidth="12"/>
          <path d="M629 818H765M629 842H765" stroke="#7FD8FF" strokeWidth="12"/>
          </g>
          <path d="M300 321C270 316 258 321 255 348C252 375 269 386 300 379C337 371 370 365 407 368C407 337 451 337 451 368C489 365 522 371 559 379C590 386 607 375 604 348C601 321 589 316 559 321C521 328 489 338 451 335C451 305 407 305 407 335C369 338 337 328 300 321Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M411 371L401 456M449 371L459 456M402 456L457 456M416 398L444 456M443 398L416 456" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M365 454C386 443 475 443 497 454L506 481C478 498 385 498 356 481Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M352 469C388 482 475 482 510 469M354 493H506" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M195 512H252C262 512 270 520 270 530V680C270 690 262 698 252 698H195C185 698 177 690 177 680V530C177 520 185 512 195 512Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M215 512V698M247 512V698" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M270 535C322 535 340 536 358 506C372 482 367 463 374 456M495 456C502 482 496 504 519 523C546 546 617 525 676 586C724 635 736 699 736 794" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M270 675C326 675 338 718 418 718C482 718 500 675 555 674C632 672 658 719 658 794" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M649 794H745C757 794 767 804 767 816V839C767 851 757 861 745 861H649C637 861 627 851 627 839V816C627 804 637 794 649 794Z" stroke="#7FD8FF" strokeWidth="5"/>
          <path d="M629 818H765M629 842H765" stroke="#7FD8FF" strokeWidth="5"/>
          </g>
        </g>
        {/* La vanne retenue s'affirme : un lisere ambre se ferme autour d'elle (trace continu, jamais
            un clignotement) au moment ou le script oppose les deux MODELES. */}
        {rightGlow > 0.01 && (
          <rect
            x={1246}
            y={196}
            width={430}
            height={330}
            rx={14}
            fill="none"
            stroke="#FFC742"
            strokeWidth={2.4}
            opacity={rightGlow}
            strokeDasharray={1520}
            strokeDashoffset={1520 * (1 - distinguish)}
          />
        )}
        <g
          id="hand-anim"
          transform={`translate(${handX.toFixed(1)}, ${handY.toFixed(1)}) rotate(${handRot.toFixed(2)}, 1000, 400)`}
        >
          <g id="hand" fill="none" stroke="#7FD8FF" strokeLinecap="round" strokeLinejoin="round" filter="url(#soft-glow)">
          <g id="hand-glow" opacity="0.23">
          <path d="M808 120L890 354C899 381 881 407 885 439L907 618C911 649 945 648 944 615L933 494C932 482 950 480 954 493L981 655C987 689 1027 687 1025 652L1003 489C1001 474 1022 471 1027 487L1056 657C1062 691 1101 687 1099 651L1076 489C1074 474 1096 470 1101 488L1118 620C1122 654 1160 651 1159 616L1148 472C1145 437 1160 433 1183 458L1233 512C1256 536 1291 520 1281 491C1277 479 1266 471 1252 462L1222 441C1197 405 1173 373 1136 344L1064 292C1048 281 1040 266 1036 244L1000 110" stroke="#7FD8FF" strokeWidth="14"/>
          </g>
          <g id="hand-outline">
          <path d="M808 120L890 354C899 381 881 407 885 439L907 618C911 649 945 648 944 615L933 494C932 482 950 480 954 493L981 655C987 689 1027 687 1025 652L1003 489C1001 474 1022 471 1027 487L1056 657C1062 691 1101 687 1099 651L1076 489C1074 474 1096 470 1101 488L1118 620C1122 654 1160 651 1159 616L1148 472C1145 437 1160 433 1183 458L1233 512C1256 536 1291 520 1281 491C1277 479 1266 471 1252 462L1222 441C1197 405 1173 373 1136 344L1064 292C1048 281 1040 266 1036 244L1000 110" stroke="#7FD8FF" strokeWidth="6"/>
          </g>
          <g id="finger-index">
          <path d="M889 468C900 480 920 482 933 494" stroke="#7FD8FF" strokeWidth="4" opacity="0.8"/>
          </g>
          <g id="finger-middle">
          <path d="M948 488C963 480 989 481 1003 489" stroke="#7FD8FF" strokeWidth="4" opacity="0.8"/>
          </g>
          <g id="finger-ring">
          <path d="M1001 484C1019 474 1057 476 1076 489" stroke="#7FD8FF" strokeWidth="4" opacity="0.8"/>
          </g>
          <g id="finger-little">
          <path d="M1074 484C1091 475 1120 482 1136 502" stroke="#7FD8FF" strokeWidth="4" opacity="0.8"/>
          </g>
          <g id="thumb">
          <path d="M1148 472C1126 476 1108 460 1088 438C1067 414 1046 398 1031 391C1012 383 1005 392 1009 415L1022 511" stroke="#7FD8FF" strokeWidth="6"/>
          </g>
          <g id="wrist">
          <path d="M808 120L890 354M1000 110L1036 244" stroke="#7FD8FF" strokeWidth="6"/>
          </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe5VannesGPT;

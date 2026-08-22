// MOTEUR: objet/metaphore SVG
//
// Planche de givre — pieces reutilisables (mix Fable 5 + GPT-5.6 Sol).
//   cristal_01..06   <- Fable 5   (symetrie hexagonale vraie, barbules)
//   eclat_01..03     <- Fable 5
//   fleur_givre_01..03 <- GPT-5.6 Sol (ramification organique asymetrique)
//
// Remplace les heptagones generes par boucle qui se lisaient comme "des petits carres blancs".
// ⛔ Aucune animation ici : les pieces sont posees par <use>, animees par l'appelant.

import React from "react";

export const GIVRE_DEFS = `<!-- defs fable -->


    <!-- halo lumineux doux (flocons, fleurs, eclats) -->
    <filter id="fableX_gv_glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="gv_b"/>
      <feMerge>
        <feMergeNode in="gv_b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- halo plus large pour la crete du gel de bord -->
    <filter id="fableX_gv_glow_large" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="gv_b2"/>
      <feMerge>
        <feMergeNode in="gv_b2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- degrade facette de glace -->
    <linearGradient id="fableX_gv_ice_grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#5cc8ff" stop-opacity="0.5"/>
    </linearGradient>

    <!-- degrade vertical du gel de bord : dense au cadre, evanescent vers l'interieur -->
    <linearGradient id="fableX_gv_gel_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fe4ff" stop-opacity="0.06"/>
      <stop offset="0.55" stop-color="#eaf7ff" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.85"/>
    </linearGradient>

    <!-- ============ branches maitresses des flocons ============
         Chaque flocon = UNE branche dessinee vers le haut depuis (50,50),
         instanciee 6 fois par rotation de 60 degres -> symetrie hexagonale VRAIE. -->

    <!-- branche 01 : dendritique, ramifications appariees a ~60 deg -->
    <g id="fableX_gv_c1_br" stroke="#eaf7ff" fill="none" stroke-linecap="round">
      <path d="M50 50 L50 10" stroke-width="2.6"/>
      <path d="M50 41 L41.5 34.5 M50 41 L58.5 34.5" stroke-width="2"/>
      <path d="M50 32 L42.5 26 M50 32 L57.5 26" stroke-width="1.7"/>
      <path d="M50 23 L44 18 M50 23 L56 18" stroke-width="1.4"/>
      <path d="M50 15 L46.5 11 M50 15 L53.5 11" stroke-width="1.1"/>
    </g>

    <!-- branche 02 : etoile simple, pique nue avec barbes de pointe et losange -->
    <g id="fableX_gv_c2_br" stroke="#eaf7ff" fill="none" stroke-linecap="round">
      <path d="M50 50 L50 10" stroke-width="2.8"/>
      <path d="M50 17 L45.5 11 M50 17 L54.5 11" stroke-width="1.8"/>
      <path d="M50 36 L52.8 31.5 L50 27 L47.2 31.5 Z" stroke-width="1.2" fill="#eaf7ff" fill-opacity="0.35"/>
    </g>

    <!-- branche 04 : colonne / secteur large a facette -->
    <g id="fableX_gv_c4_br" stroke="#eaf7ff" stroke-linecap="round">
      <path d="M46.5 45 L46.5 24 L50 16 L53.5 24 L53.5 45 Z" stroke-width="1.6" fill="#8fe4ff" fill-opacity="0.25"/>
      <path d="M50 44 L50 22" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.6" fill="none"/>
    </g>

    <!-- branche 05 : aiguille fine -->
    <g id="fableX_gv_c5_br" stroke="#eaf7ff" fill="none" stroke-linecap="round">
      <path d="M50 46 L50 6" stroke-width="1.3"/>
      <path d="M47.8 26 L52.2 26" stroke-width="1"/>
      <path d="M50 6 L48.3 9.5 M50 6 L51.7 9.5" stroke-width="0.9"/>
    </g>

    <!-- branche 06 : fougere dense, ramifications secondaires -->
    <g id="fableX_gv_c6_br" stroke="#eaf7ff" fill="none" stroke-linecap="round">
      <path d="M50 50 L50 8" stroke-width="2.4"/>
      <path d="M50 44 L43 39 M43 39 L40 40.5 M43 39 L42 35.5" stroke-width="1.6"/>
      <path d="M50 44 L57 39 M57 39 L60 40.5 M57 39 L58 35.5" stroke-width="1.6"/>
      <path d="M50 37 L43.5 32 M43.5 32 L41 33 M43.5 32 L43 29" stroke-width="1.4"/>
      <path d="M50 37 L56.5 32 M56.5 32 L59 33 M56.5 32 L57 29" stroke-width="1.4"/>
      <path d="M50 30 L44.5 25.5 M50 30 L55.5 25.5" stroke-width="1.3"/>
      <path d="M50 24 L45.5 20 M50 24 L54.5 20" stroke-width="1.2"/>
      <path d="M50 18 L46.5 14.5 M50 18 L53.5 14.5" stroke-width="1.1"/>
      <path d="M50 12 L48 9.5 M50 12 L52 9.5" stroke-width="1"/>
    </g>

    <!-- ============ bande de gel maitre (orientation BAS) ============
         Bord franc en y=120, frange irreguliere vers le haut.
         Les 4 pieces de bord la reutilisent par symetrie/rotation.
         Profil identique en x=0 et x=400 -> etirable et raccordable. -->
    <g id="fableX_gv_gelband">
      <!-- couche arriere, dents plus hautes, plus transparente -->
      <path fill="#5cc8ff" fill-opacity="0.28" d="M0 58 L20 30 L38 66 L58 22 L80 60 L104 14 L126 54 L150 28 L170 62 L196 10 L218 50 L240 26 L262 58 L286 18 L308 52 L330 30 L352 64 L376 24 L400 58 L400 120 L0 120 Z"/>
      <!-- couche principale, frange dentelee irreguliere -->
      <path fill="url(#fableX_gv_gel_grad)" d="M0 70 L12 52 L22 78 L34 40 L45 84 L60 58 L72 90 L86 34 L97 72 L112 55 L124 86 L140 46 L152 76 L166 62 L178 92 L192 38 L205 70 L220 52 L232 88 L247 44 L260 74 L274 58 L288 90 L300 36 L313 68 L328 50 L342 84 L356 42 L370 76 L385 58 L400 70 L400 120 L0 120 Z"/>
      <!-- crete lumineuse le long de la frange -->
      <path fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.9" stroke-linejoin="round" filter="url(#fableX_gv_glow_large)" d="M0 70 L12 52 L22 78 L34 40 L45 84 L60 58 L72 90 L86 34 L97 72 L112 55 L124 86 L140 46 L152 76 L166 62 L178 92 L192 38 L205 70 L220 52 L232 88 L247 44 L260 74 L274 58 L288 90 L300 36 L313 68 L328 50 L342 84 L356 42 L370 76 L385 58 L400 70"/>
      <!-- aiguilles qui poussent depuis les dents les plus hautes -->
      <g stroke="#eaf7ff" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.75" fill="none">
        <path d="M34 40 L31 26"/>
        <path d="M86 34 L84 19"/>
        <path d="M140 46 L143 33"/>
        <path d="M192 38 L194 22"/>
        <path d="M247 44 L244 30"/>
        <path d="M300 36 L298 20"/>
        <path d="M356 42 L359 28"/>
      </g>
      <!-- paillettes -->
      <g fill="#ffffff">
        <circle cx="34" cy="37" r="1.5"/>
        <circle cx="104" cy="52" r="1.2"/>
        <circle cx="192" cy="35" r="1.6"/>
        <circle cx="274" cy="55" r="1.1"/>
        <circle cx="300" cy="33" r="1.5"/>
        <circle cx="370" cy="72" r="1.2"/>
      </g>
    </g>

  
<!-- defs gpt -->

    <linearGradient id="gptX_gv_ice_fill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="0.45" stop-color="#eaf7ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#5cc8ff" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="gptX_gv_edge_fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.55" stop-color="#8fe4ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#5cc8ff" stop-opacity="0.82"/>
    </linearGradient>
    <linearGradient id="gptX_gv_edge_fill_reverse" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.55" stop-color="#8fe4ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#5cc8ff" stop-opacity="0.82"/>
    </linearGradient>
    <radialGradient id="gptX_gv_crystal_fill" cx="35%" cy="28%" r="72%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.48" stop-color="#eaf7ff" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#5cc8ff" stop-opacity="0.22"/>
    </radialGradient>
    <filter id="gptX_gv_glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="gv_blur"/>
      <feFlood flood-color="#5cc8ff" flood-opacity="0.75" result="gv_color"/>
      <feComposite in="gv_color" in2="gv_blur" operator="in" result="gv_halo"/>
      <feMerge>
        <feMergeNode in="gv_halo"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="gptX_gv_soft_glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="gv_soft"/>
      <feMerge>
        <feMergeNode in="gv_soft"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  
<symbol id="cristal_01" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)">
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br"/>
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br" transform="rotate(60 50 50)"/>
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br" transform="rotate(120 50 50)"/>
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br" transform="rotate(180 50 50)"/>
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br" transform="rotate(240 50 50)"/>
      <use href="#fableX_gv_c1_br" xlink:href="#fableX_gv_c1_br" transform="rotate(300 50 50)"/>
      <path d="M50 44 L55.2 47 L55.2 53 L50 56 L44.8 53 L44.8 47 Z" fill="none" stroke="#8fe4ff" stroke-width="1.4"/>
      <circle cx="50" cy="50" r="2.2" fill="#ffffff"/>
    </g>
  </symbol>
<symbol id="cristal_02" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)">
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br"/>
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br" transform="rotate(60 50 50)"/>
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br" transform="rotate(120 50 50)"/>
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br" transform="rotate(180 50 50)"/>
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br" transform="rotate(240 50 50)"/>
      <use href="#fableX_gv_c2_br" xlink:href="#fableX_gv_c2_br" transform="rotate(300 50 50)"/>
      <circle cx="50" cy="50" r="7" fill="none" stroke="#8fe4ff" stroke-width="1.2"/>
      <circle cx="50" cy="50" r="3" fill="#ffffff"/>
    </g>
  </symbol>
<symbol id="cristal_03" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)" stroke-linejoin="round">
      <path d="M86 50 L68 81.2 L32 81.2 L14 50 L32 18.8 L68 18.8 Z" fill="#8fe4ff" fill-opacity="0.12" stroke="#eaf7ff" stroke-width="2.2"/>
      <path d="M69 50 L59.5 66.5 L40.5 66.5 L31 50 L40.5 33.5 L59.5 33.5 Z" fill="none" stroke="#8fe4ff" stroke-width="1.4"/>
      <g stroke="#eaf7ff" stroke-width="1.3" stroke-linecap="round">
        <path d="M69 50 L86 50"/>
        <path d="M59.5 66.5 L68 81.2"/>
        <path d="M40.5 66.5 L32 81.2"/>
        <path d="M31 50 L14 50"/>
        <path d="M40.5 33.5 L32 18.8"/>
        <path d="M59.5 33.5 L68 18.8"/>
      </g>
      <circle cx="50" cy="50" r="2.4" fill="#ffffff"/>
    </g>
  </symbol>
<symbol id="cristal_04" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)">
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br"/>
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br" transform="rotate(60 50 50)"/>
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br" transform="rotate(120 50 50)"/>
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br" transform="rotate(180 50 50)"/>
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br" transform="rotate(240 50 50)"/>
      <use href="#fableX_gv_c4_br" xlink:href="#fableX_gv_c4_br" transform="rotate(300 50 50)"/>
      <path d="M50 43.5 L55.6 46.7 L55.6 53.3 L50 56.5 L44.4 53.3 L44.4 46.7 Z" fill="#eaf7ff" fill-opacity="0.5" stroke="#ffffff" stroke-width="1.2"/>
    </g>
  </symbol>
<symbol id="cristal_05" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)">
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br"/>
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br" transform="rotate(60 50 50)"/>
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br" transform="rotate(120 50 50)"/>
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br" transform="rotate(180 50 50)"/>
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br" transform="rotate(240 50 50)"/>
      <use href="#fableX_gv_c5_br" xlink:href="#fableX_gv_c5_br" transform="rotate(300 50 50)"/>
      <circle cx="50" cy="50" r="2" fill="#ffffff"/>
    </g>
  </symbol>
<symbol id="cristal_06" viewBox="0 0 100 100">
    <g filter="url(#fableX_gv_glow)">
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br"/>
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br" transform="rotate(60 50 50)"/>
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br" transform="rotate(120 50 50)"/>
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br" transform="rotate(180 50 50)"/>
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br" transform="rotate(240 50 50)"/>
      <use href="#fableX_gv_c6_br" xlink:href="#fableX_gv_c6_br" transform="rotate(300 50 50)"/>
      <path d="M50 45 L54.3 47.5 L54.3 52.5 L50 55 L45.7 52.5 L45.7 47.5 Z" fill="none" stroke="#8fe4ff" stroke-width="1.3"/>
      <circle cx="50" cy="50" r="1.8" fill="#ffffff"/>
    </g>
  </symbol>
<symbol id="eclat_01" viewBox="0 0 60 60">
    <g filter="url(#fableX_gv_glow)" stroke-linejoin="round">
      <path d="M30 4 L44 22 L38 52 L22 46 L14 20 Z" fill="url(#fableX_gv_ice_grad)" fill-opacity="0.4" stroke="#eaf7ff" stroke-width="1.6"/>
      <path d="M30 4 L28 30 L38 52 M14 20 L28 30 L44 22" fill="none" stroke="#8fe4ff" stroke-width="1"/>
      <path d="M26 12 L23 22" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.9"/>
    </g>
  </symbol>
<symbol id="eclat_02" viewBox="0 0 60 60">
    <g filter="url(#fableX_gv_glow)" stroke-linejoin="round">
      <path d="M28 4 L38 20 L34 56 L24 48 L22 18 Z" fill="url(#fableX_gv_ice_grad)" fill-opacity="0.4" stroke="#eaf7ff" stroke-width="1.5"/>
      <path d="M28 4 L29 30 L34 56 M22 18 L29 30 L38 20" fill="none" stroke="#8fe4ff" stroke-width="0.9"/>
      <path d="M31 12 L32 24" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-opacity="0.9"/>
    </g>
  </symbol>
<symbol id="eclat_03" viewBox="0 0 60 60">
    <g filter="url(#fableX_gv_glow)" stroke-linejoin="round">
      <path d="M20 12 L36 8 L44 26 L32 44 L16 32 Z" fill="url(#fableX_gv_ice_grad)" fill-opacity="0.4" stroke="#eaf7ff" stroke-width="1.5"/>
      <path d="M36 8 L30 26 L32 44 M20 12 L30 26 L44 26" fill="none" stroke="#8fe4ff" stroke-width="0.9"/>
      <path d="M42 38 L52 42 L48 54 L38 50 Z" fill="url(#fableX_gv_ice_grad)" fill-opacity="0.35" stroke="#eaf7ff" stroke-width="1.2"/>
      <path d="M24 14 L22 24" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-opacity="0.9"/>
    </g>
  </symbol>
<symbol id="fleur_givre_01" viewBox="0 0 200 200">
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#gptX_gv_glow)">
      <path d="M100 190 C99 166 92 145 98 124 C104 102 96 78 105 57 C111 42 108 25 116 9" stroke="#ffffff" stroke-width="3"/>
      <path d="M98 151 C79 137 62 127 45 108 C34 96 25 84 18 68" stroke="#eaf7ff" stroke-width="2.1"/>
      <path d="M98 130 C117 116 132 102 145 82 C153 69 159 55 161 39" stroke="#eaf7ff" stroke-width="2"/>
      <path d="M101 105 C83 92 71 79 62 61 C56 49 53 37 54 25" stroke="#8fe4ff" stroke-width="1.8"/>
      <path d="M105 67 C124 58 138 46 149 31 C155 23 159 14 161 6" stroke="#8fe4ff" stroke-width="1.6"/>
      <g stroke="#ffffff" stroke-width="1.15">
        <path d="M83 139 L72 119 M75 132 L61 128 M65 127 L57 111 M56 120 L43 116 M46 109 L39 94 M36 99 L25 96 M29 86 L23 74"/>
        <path d="M113 118 L116 99 M122 111 L136 107 M133 101 L139 87 M142 88 L153 83 M148 76 L153 63 M155 66 L166 59"/>
        <path d="M87 95 L79 79 M77 86 L65 83 M69 76 L64 64 M60 63 L49 58 M58 51 L57 40 M54 43 L45 37"/>
        <path d="M118 60 L122 47 M128 53 L139 50 M137 45 L143 35 M148 32 L158 29 M154 24 L160 15"/>
      </g>
      <g stroke="#5cc8ff" stroke-width="0.8">
        <path d="M72 119 L65 110 M61 128 L52 125 M57 111 L50 103 M43 116 L34 112"/>
        <path d="M116 99 L122 90 M136 107 L145 101 M139 87 L146 78 M153 83 L162 77"/>
        <path d="M79 79 L73 70 M65 83 L56 78 M64 64 L58 55"/>
        <path d="M122 47 L127 38 M139 50 L147 44 M143 35 L150 27"/>
      </g>
    </g>
  </symbol>
<symbol id="fleur_givre_02" viewBox="0 0 200 200">
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#gptX_gv_glow)">
      <path d="M100 190 C89 166 78 150 75 128 C72 106 80 88 72 67 C66 50 52 37 47 17" stroke="#ffffff" stroke-width="3"/>
      <path d="M84 157 C104 145 124 132 136 111 C145 96 148 79 146 61" stroke="#eaf7ff" stroke-width="2.2"/>
      <path d="M76 124 C57 115 40 103 28 87 C19 75 14 62 11 48" stroke="#8fe4ff" stroke-width="1.9"/>
      <path d="M75 92 C91 80 103 65 108 47 C112 34 112 20 109 8" stroke="#eaf7ff" stroke-width="2"/>
      <path d="M61 51 C77 47 91 40 101 28 C107 21 111 13 113 5" stroke="#8fe4ff" stroke-width="1.4"/>
      <g stroke="#ffffff" stroke-width="1.1">
        <path d="M98 147 L101 129 M108 140 L122 138 M120 132 L128 118 M132 119 L143 114 M139 105 L144 92 M146 94 L157 87 M148 79 L158 72"/>
        <path d="M62 116 L55 101 M52 109 L39 106 M43 101 L35 90 M31 91 L20 85 M25 79 L20 68 M17 69 L7 63"/>
        <path d="M87 78 L88 63 M96 69 L107 65 M103 58 L108 46 M109 47 L119 39 M111 33 L119 24"/>
        <path d="M65 49 L69 37 M76 45 L86 40 M84 36 L91 27 M96 27 L103 20 M101 14 L108 8"/>
        <path d="M69 76 L56 70 M62 65 L53 54 M51 58 L40 54 M45 48 L37 38 M35 41 L27 34"/>
      </g>
      <g stroke="#5cc8ff" stroke-width="0.8">
        <path d="M101 129 L107 120 M122 138 L132 132 M128 118 L135 108 M143 114 L152 107"/>
        <path d="M55 101 L48 92 M39 106 L29 101 M35 90 L27 81 M20 85 L11 79"/>
        <path d="M88 63 L93 54 M107 65 L115 58 M108 46 L114 37"/>
      </g>
    </g>
  </symbol>
<symbol id="fleur_givre_03" viewBox="0 0 200 200">
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#gptX_gv_glow)">
      <path d="M100 190 C111 169 123 151 121 130 C119 111 109 95 113 76 C117 57 131 43 136 24 C138 17 138 11 137 5" stroke="#ffffff" stroke-width="3"/>
      <path d="M119 151 C98 143 79 134 65 117 C53 103 47 88 46 72" stroke="#eaf7ff" stroke-width="2.2"/>
      <path d="M120 126 C140 115 156 100 164 81 C170 67 171 52 168 38" stroke="#8fe4ff" stroke-width="2"/>
      <path d="M111 96 C92 87 77 75 67 59 C59 47 55 34 56 21" stroke="#eaf7ff" stroke-width="1.9"/>
      <path d="M119 65 C104 53 96 40 94 25 C93 17 94 10 97 4" stroke="#8fe4ff" stroke-width="1.5"/>
      <path d="M131 42 C148 38 161 30 172 18 C176 13 179 8 181 3" stroke="#eaf7ff" stroke-width="1.5"/>
      <g stroke="#ffffff" stroke-width="1.1">
        <path d="M104 143 L98 127 M95 137 L82 133 M84 128 L76 116 M71 120 L60 114 M63 108 L57 96 M53 99 L43 92 M48 85 L43 75"/>
        <path d="M137 116 L140 100 M147 108 L159 104 M157 98 L163 85 M164 87 L175 80 M169 73 L174 60 M171 63 L181 55 M170 49 L179 43"/>
        <path d="M96 87 L91 72 M87 79 L75 76 M78 70 L71 59 M67 61 L56 55 M61 49 L56 38 M54 41 L45 34"/>
        <path d="M108 54 L105 41 M101 47 L91 42 M96 36 L94 26 M94 28 L85 21 M94 16 L89 10"/>
        <path d="M144 38 L148 27 M154 34 L164 28 M162 24 L169 16 M174 15 L181 9"/>
      </g>
      <g stroke="#5cc8ff" stroke-width="0.8">
        <path d="M98 127 L92 118 M82 133 L72 128 M76 116 L68 107 M60 114 L51 108"/>
        <path d="M140 100 L146 91 M159 104 L168 98 M163 85 L170 76 M175 80 L184 73"/>
        <path d="M91 72 L85 63 M75 76 L66 71 M71 59 L64 50"/>
        <path d="M105 41 L101 32 M91 42 L83 36 M94 26 L91 17"/>
      </g>
    </g>
  </symbol>`;

/** A poser UNE fois dans le <svg> qui utilise les pieces. */
export const GivreDefs: React.FC = () => (
  <defs dangerouslySetInnerHTML={{ __html: GIVRE_DEFS }} />
);

export const CRISTAUX = ["cristal_01","cristal_02","cristal_03","cristal_04","cristal_05","cristal_06"];
export const ECLATS = ["eclat_01","eclat_02","eclat_03"];
export const FLEURS = ["fleur_givre_01","fleur_givre_02","fleur_givre_03"];

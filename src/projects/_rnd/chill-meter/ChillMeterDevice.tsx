// MOTEUR: objet/metaphore SVG
//
// Compteur "Max Chill Factor Meter" — dessin issu du MIX de 3 planches SVG
// (chassis/ecran/panneau: GPT-5.6 Sol · neon titre/sous-titre/givre: Fable 5 · gauge/graduation/boutons: Kimi K3).
// Assemblage : scratchpad/chill-svg/assemble_mix.py — source : chill-meter-mix.svg
//
// ⛔ AUCUNE animation dans le SVG. Tout est pilote ici par les props :
//    chill 0-100 -> nombre de segments allumes + intensite de lueur
//    frost 0-1   -> opacite du givre + croissance des glacons
//    powerOn 0-1 -> allumage general (neon, ecran, boutons)

import React from "react";

export const DEVICE_W = 1448;
export const DEVICE_H = 1086;
export const SEGMENTS = 26;


export type ChillMeterProps = {
  chill: number;
  frost: number;
  powerOn: number;
  frame: number;
  fps: number;
  /** Finition du metal du chassis. Ne touche QUE les rampes des degrades metal
   *  (corps, plaques, tubes, vis, rivets) : le dessin, la structure, le neon,
   *  l'ecran et le givre sont identiques dans les trois cas.
   *  - "flat"     : l'existant, metal sombre peu contraste
   *  - "brushed"  : acier brosse, plus clair, reflets doux
   *  - "machined" : metal usine, speculaires nets sur les aretes, contraste fort
   */
  metal?: MetalFinish;
};

export type MetalFinish = "flat" | "brushed" | "machined";

// Note : le SVG source livre `frost_layer` et `icicles` en opacity="0" (contrat "pret a animer" :
// tout element a reveler arrive masque). L'attribut est retire a l'injection car c'est l'enveloppe
// React ci-dessous qui pilote leur opacite — sinon 0 x frost = 0, le givre ne parait jamais.
const DEFS = `<linearGradient id="kimi_metalMain" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a5560"/>
      <stop offset="0.15" stop-color="#3a434c"/>
      <stop offset="0.5" stop-color="#242b33"/>
      <stop offset="0.85" stop-color="#161b21"/>
      <stop offset="1" stop-color="#101419"/>
    </linearGradient>
    <linearGradient id="kimi_metalBevel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6a7681"/>
      <stop offset="0.4" stop-color="#39424b"/>
      <stop offset="1" stop-color="#141920"/>
    </linearGradient>
    <linearGradient id="kimi_metalPipe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#12161b"/>
      <stop offset="0.35" stop-color="#55606a"/>
      <stop offset="0.55" stop-color="#7c8894"/>
      <stop offset="0.7" stop-color="#3a434c"/>
      <stop offset="1" stop-color="#0e1216"/>
    </linearGradient>
    <linearGradient id="kimi_screenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#051423"/>
      <stop offset="0.5" stop-color="#071c30"/>
      <stop offset="1" stop-color="#040f1a"/>
    </linearGradient>
    <radialGradient id="kimi_screenGlow" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0" stop-color="#0d3a5e" stop-opacity="0.9"/>
      <stop offset="0.6" stop-color="#082640" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#03101c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="kimi_segGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fe3ff"/>
      <stop offset="0.3" stop-color="#3fc4ff"/>
      <stop offset="0.7" stop-color="#1498e8"/>
      <stop offset="1" stop-color="#0a6ec0"/>
    </linearGradient>
    <radialGradient id="kimi_greenBtn" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#d8ffd8"/>
      <stop offset="0.3" stop-color="#6fff6f"/>
      <stop offset="0.7" stop-color="#1ccc1c"/>
      <stop offset="1" stop-color="#0a7a0a"/>
    </radialGradient>
    <radialGradient id="kimi_greenHalo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#4cff4c" stop-opacity="0.7"/>
      <stop offset="0.5" stop-color="#2be82b" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#1aff1a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="kimi_rivetGrad" cx="0.35" cy="0.3" r="0.9">
      <stop offset="0" stop-color="#a8b6c2"/>
      <stop offset="0.45" stop-color="#4a545e"/>
      <stop offset="1" stop-color="#0d1115"/>
    </radialGradient>
    <linearGradient id="kimi_plaqueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a343e"/>
      <stop offset="0.5" stop-color="#131a21"/>
      <stop offset="1" stop-color="#0a0e13"/>
    </linearGradient>
    <linearGradient id="kimi_frostGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#cfeaff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#9fd0ff" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="kimi_icicleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf7ff" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#a8d8ff" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#7cc0ff" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="kimi_btnGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c3641"/>
      <stop offset="0.5" stop-color="#171e26"/>
      <stop offset="1" stop-color="#0d1218"/>
    </linearGradient>
  


    <linearGradient id="gpt_metalOuter" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#71859a"/>
      <stop offset="0.08" stop-color="#26394b"/>
      <stop offset="0.26" stop-color="#0b1722"/>
      <stop offset="0.55" stop-color="#172a3b"/>
      <stop offset="0.78" stop-color="#07111b"/>
      <stop offset="0.94" stop-color="#3e566b"/>
      <stop offset="1" stop-color="#101c27"/>
    </linearGradient>
    <linearGradient id="gpt_metalInset" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#566d82"/>
      <stop offset="0.14" stop-color="#101d29"/>
      <stop offset="0.48" stop-color="#25384a"/>
      <stop offset="0.72" stop-color="#07121c"/>
      <stop offset="1" stop-color="#40566a"/>
    </linearGradient>
    <linearGradient id="gpt_bevelBlue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b7dcff"/>
      <stop offset="0.1" stop-color="#2c78bc"/>
      <stop offset="0.48" stop-color="#071929"/>
      <stop offset="0.88" stop-color="#183d5f"/>
      <stop offset="1" stop-color="#8fcaff"/>
    </linearGradient>
    <linearGradient id="gpt_screenFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#03111f"/>
      <stop offset="0.45" stop-color="#061b31"/>
      <stop offset="1" stop-color="#020b14"/>
    </linearGradient>
    <radialGradient id="gpt_screenBloom" cx="50%" cy="48%" r="70%">
      <stop offset="0" stop-color="#0b5592" stop-opacity="0.34"/>
      <stop offset="0.58" stop-color="#063359" stop-opacity="0.17"/>
      <stop offset="1" stop-color="#00101f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gpt_titlePlate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#263e54"/>
      <stop offset="0.14" stop-color="#071522"/>
      <stop offset="0.55" stop-color="#10283c"/>
      <stop offset="0.88" stop-color="#06101a"/>
      <stop offset="1" stop-color="#526b80"/>
    </linearGradient>
    <linearGradient id="gpt_buttonFace" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#344b60"/>
      <stop offset="0.18" stop-color="#102131"/>
      <stop offset="0.72" stop-color="#07131f"/>
      <stop offset="1" stop-color="#253d52"/>
    </linearGradient>
    <linearGradient id="gpt_iceSegment" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dff8ff"/>
      <stop offset="0.18" stop-color="#68d8ff"/>
      <stop offset="0.55" stop-color="#20a9f3"/>
      <stop offset="0.86" stop-color="#0878d5"/>
      <stop offset="1" stop-color="#8be8ff"/>
    </linearGradient>
    <linearGradient id="gpt_frost" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.25" stop-color="#d9f3ff"/>
      <stop offset="0.66" stop-color="#76beff"/>
      <stop offset="1" stop-color="#2778c4"/>
    </linearGradient>
    <linearGradient id="gpt_icicleFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7fdff" stop-opacity="0.95"/>
      <stop offset="0.32" stop-color="#a8dcff" stop-opacity="0.9"/>
      <stop offset="0.78" stop-color="#3d9ee9" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#dff7ff" stop-opacity="0.92"/>
    </linearGradient>
    <radialGradient id="gpt_screwFace" cx="38%" cy="30%" r="72%">
      <stop offset="0" stop-color="#93abc0"/>
      <stop offset="0.18" stop-color="#3e5568"/>
      <stop offset="0.58" stop-color="#101d28"/>
      <stop offset="1" stop-color="#030910"/>
    </radialGradient>
    <radialGradient id="gpt_greenLamp" cx="38%" cy="30%" r="65%">
      <stop offset="0" stop-color="#edffd8"/>
      <stop offset="0.2" stop-color="#9dff67"/>
      <stop offset="0.58" stop-color="#39c52f"/>
      <stop offset="1" stop-color="#0b5d1e"/>
    </radialGradient>
    {/* Fond d'ecran : la reference cliente montre une dalle NOIRE unie, seuls les textes
        lumineux s'y detachent. La diagonale du motif d'origine (stroke-opacity 0.11) se
        lisait comme des triangles repetes sur toute la dalle. Reduite au strict minimum :
        une trame a peine perceptible qui evite l'aplat mort, sans motif lisible. */}
    <pattern id="gpt_screenGrid" width="42" height="34" patternUnits="userSpaceOnUse">
      <path d="M0 17H42M21 0V34" stroke="#2496e0" stroke-width="0.7" stroke-opacity="0.03"/>
    </pattern>
    <pattern id="gpt_scratches" width="83" height="49" patternUnits="userSpaceOnUse">
      <path d="M7 14h22M41 8h31M17 37h46M3 44h12" stroke="#aac4d8" stroke-width="1" stroke-opacity="0.12"/>
      <path d="M32 23h45M4 29h18" stroke="#02080d" stroke-width="2" stroke-opacity="0.38"/>
    </pattern>
    <filter id="gpt_shadow" x="-20%" y="-25%" width="140%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="16"/>
      <feOffset dy="14"/>
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.025 0 0 0 0 0.06 0 0 0 .8 0"/>
      <feBlend in="SourceGraphic"/>
    </filter>
    <filter id="gpt_blueGlow" x="-80%" y="-100%" width="260%" height="300%">
      <feGaussianBlur stdDeviation="9" result="b"/>
      <feFlood flood-color="#168dff" flood-opacity="0.9"/>
      <feComposite in2="b" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="gpt_softBlueGlow" x="-50%" y="-70%" width="200%" height="240%">
      <feGaussianBlur stdDeviation="4.5" result="b"/>
      <feFlood flood-color="#39baff" flood-opacity="0.72"/>
      <feComposite in2="b" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="gpt_greenGlow" x="-150%" y="-150%" width="400%" height="400%">
      <feGaussianBlur stdDeviation="11" result="b"/>
      <feFlood flood-color="#65ff4d" flood-opacity="0.9"/>
      <feComposite in2="b" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="gpt_frostGlow" x="-30%" y="-50%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feFlood flood-color="#75c8ff" flood-opacity="0.65"/>
      <feComposite in2="b" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  


    <linearGradient id="fable_g_metal_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a5468"/>
      <stop offset="0.12" stop-color="#333c4c"/>
      <stop offset="0.5" stop-color="#1b212c"/>
      <stop offset="0.82" stop-color="#12161e"/>
      <stop offset="1" stop-color="#2a3242"/>
    </linearGradient>
    <linearGradient id="fable_g_metal_plaque" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#465067"/>
      <stop offset="0.45" stop-color="#171c26"/>
      <stop offset="1" stop-color="#242c3c"/>
    </linearGradient>
    <linearGradient id="fable_g_plaque_inner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e1a2c"/>
      <stop offset="1" stop-color="#050a12"/>
    </linearGradient>
    <linearGradient id="fable_g_screen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d2038"/>
      <stop offset="0.45" stop-color="#081426"/>
      <stop offset="1" stop-color="#04080f"/>
    </linearGradient>
    <linearGradient id="fable_g_seg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf8ff"/>
      <stop offset="0.25" stop-color="#a4dbff"/>
      <stop offset="0.6" stop-color="#4aa4f4"/>
      <stop offset="1" stop-color="#1f78dd"/>
    </linearGradient>
    <linearGradient id="fable_g_ice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.45" stop-color="#cfeaff" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#8ec8f8" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="fable_g_frost" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#ddf1ff" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#9fd0ff" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="fable_g_pipe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#10141c"/>
      <stop offset="0.3" stop-color="#4c5666"/>
      <stop offset="0.5" stop-color="#78849a"/>
      <stop offset="0.72" stop-color="#3a4352"/>
      <stop offset="1" stop-color="#0d1119"/>
    </linearGradient>
    <linearGradient id="fable_g_pipe_h" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#10141c"/>
      <stop offset="0.3" stop-color="#4c5666"/>
      <stop offset="0.5" stop-color="#78849a"/>
      <stop offset="0.72" stop-color="#3a4352"/>
      <stop offset="1" stop-color="#0d1119"/>
    </linearGradient>
    <linearGradient id="fable_g_btnface" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a4453"/>
      <stop offset="0.5" stop-color="#1a202a"/>
      <stop offset="1" stop-color="#28303e"/>
    </linearGradient>
    <radialGradient id="fable_r_screw" cx="0.38" cy="0.35" r="0.75">
      <stop offset="0" stop-color="#9aa5b7"/>
      <stop offset="0.55" stop-color="#4a5364"/>
      <stop offset="1" stop-color="#181d27"/>
    </radialGradient>
    <radialGradient id="fable_r_rivet" cx="0.38" cy="0.35" r="0.75">
      <stop offset="0" stop-color="#aab4c4"/>
      <stop offset="0.6" stop-color="#566274"/>
      <stop offset="1" stop-color="#20262f"/>
    </radialGradient>
    <radialGradient id="fable_r_green" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#f2ffdd"/>
      <stop offset="0.35" stop-color="#8df05a"/>
      <stop offset="0.7" stop-color="#3fca25"/>
      <stop offset="1" stop-color="#157a10"/>
    </radialGradient>
    <radialGradient id="fable_r_green_halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7dff4a" stop-opacity="0.85"/>
      <stop offset="0.6" stop-color="#46d92a" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#2ab818" stop-opacity="0"/>
    </radialGradient>
    <filter id="fable_f_blur2" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="fable_f_blur4" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="fable_f_blur6" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <filter id="fable_f_blur10" x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <filter id="fable_f_blur18" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="fable_f_frost" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="14"/>
    </filter>
    <g id="fable_sym_flocon" fill="none" stroke-linecap="round">
      <g>
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
      <g transform="rotate(60)">
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
      <g transform="rotate(120)">
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
      <g transform="rotate(180)">
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
      <g transform="rotate(240)">
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
      <g transform="rotate(300)">
        <line x1="0" y1="0" x2="0" y2="-26"/>
        <line x1="0" y1="-16" x2="-7" y2="-22"/>
        <line x1="0" y1="-16" x2="7" y2="-22"/>
        <line x1="0" y1="-8" x2="-5" y2="-13"/>
        <line x1="0" y1="-8" x2="5" y2="-13"/>
      </g>
    </g>
    <text id="fable_t_titre" x="730" y="266" font-family="Impact, 'Arial Black', sans-serif" font-size="96" text-anchor="middle" letter-spacing="2">AbiGirl Reacts</text>
    <text id="fable_t_sous" x="718" y="420" font-family="Impact, 'Arial Black', sans-serif" font-size="56" text-anchor="middle" letter-spacing="4">MAX CHILL DETECTION</text>
    <text id="fable_t_leg" x="724" y="700" font-family="Impact, 'Arial Black', sans-serif" font-size="29" text-anchor="middle" letter-spacing="3">0 = NO CHILL | 100 = MAX CHILL</text>
    <text id="fable_t_power" x="1347" y="480" font-family="Impact, 'Arial Black', sans-serif" font-size="21" text-anchor="middle" letter-spacing="1">POWER</text>
    <filter id="aged_grain" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.13 0.1" numOctaves="2" seed="17" result="agn"/>
      <feColorMatrix in="agn" type="matrix" values="0 0 0 0 0.02 0 0 0 0 0.02 0 0 0 0 0.03 0.6 0.6 0.6 0 -0.62" result="agd"/>
      <feComposite in="agd" in2="SourceAlpha" operator="in"/>
    </filter>
    <filter id="aged_grain_light" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.13 0.1" numOctaves="2" seed="29" result="agn2"/>
      <feColorMatrix in="agn2" type="matrix" values="0 0 0 0 0.82 0 0 0 0 0.85 0 0 0 0 0.87 0.6 0.6 0.6 0 -0.72" result="agl"/>
      <feComposite in="agl" in2="SourceAlpha" operator="in"/>
    </filter>
    <filter id="aged_mottle" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.007 0.01" numOctaves="3" seed="7" result="agm"/>
      <feColorMatrix in="agm" type="matrix" values="0 0 0 0 0.03 0 0 0 0 0.04 0 0 0 0 0.04 0.5 0.5 0.5 0 -0.42" result="agmo"/>
      <feComposite in="agmo" in2="SourceAlpha" operator="in"/>
    </filter>
    <linearGradient id="aged_streak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c2620" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#2c2620" stop-opacity="0"/>
    </linearGradient>
`;

// Degrades du chassis metallique Fable v2 — memes paths <path d="..."> que le dessin
// d'origine ci-dessus, seuls fill/stroke/overlays changent (voir NOTRE-GEOMETRIE-EXACTE.json
// dans out/_r-and-d/chill-meter-upwork/concours-metal/fable/). 32/32 tracés verifies identiques
// caractere pour caractere le 2026-08-31 (feedback_ameliorer-vs-remplacer-preciser-dans-le-brief).
const FABLE_METAL_DEFS = `<linearGradient id="brushed_body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e8fb3"/><stop offset="0.1" stop-color="#4c6c8f"/><stop offset="0.38" stop-color="#3c5a7b"/><stop offset="0.72" stop-color="#29435e"/><stop offset="1" stop-color="#182c43"/></linearGradient><linearGradient id="brushed_sheen" x1="0" y1="0" x2="1" y2="0.35"><stop offset="0" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.16" stop-color="#bed6ea" stop-opacity="0.08"/><stop offset="0.34" stop-color="#bed6ea" stop-opacity="0.01"/><stop offset="0.6" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.82" stop-color="#bed6ea" stop-opacity="0"/><stop offset="1" stop-color="#bed6ea" stop-opacity="0"/></linearGradient><linearGradient id="brushed_edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcebf8" stop-opacity="0.7"/><stop offset="0.3" stop-color="#93b2d1" stop-opacity="0.4"/><stop offset="0.55" stop-color="#3c5a7b" stop-opacity="0.2"/><stop offset="1" stop-color="#0a1322" stop-opacity="0.65"/></linearGradient><linearGradient id="brushed_inset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1322" stop-opacity="0.95"/><stop offset="0.45" stop-color="#182c43" stop-opacity="0.55"/><stop offset="0.7" stop-color="#6e8fb3" stop-opacity="0.5"/><stop offset="1" stop-color="#bed6ea" stop-opacity="0.55"/></linearGradient><linearGradient id="brushed_frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e8fb3"/><stop offset="0.12" stop-color="#4c6c8f"/><stop offset="0.55" stop-color="#3c5a7b"/><stop offset="1" stop-color="#29435e"/></linearGradient><linearGradient id="brushed_cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c17"/><stop offset="0.75" stop-color="#0d1825"/><stop offset="1" stop-color="#0d1825"/></linearGradient><linearGradient id="brushed_plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e8fb3"/><stop offset="0.15" stop-color="#4c6c8f"/><stop offset="0.6" stop-color="#3c5a7b"/><stop offset="1" stop-color="#29435e"/></linearGradient><linearGradient id="brushed_power" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c6c8f"/><stop offset="0.35" stop-color="#3c5a7b"/><stop offset="1" stop-color="#29435e"/></linearGradient><linearGradient id="brushed_btn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c5a7b"/><stop offset="0.12" stop-color="#29435e"/><stop offset="0.75" stop-color="#182c43"/><stop offset="1" stop-color="#0a1322"/></linearGradient><linearGradient id="brushed_pipe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#182c43"/><stop offset="0.22" stop-color="#3c5a7b"/><stop offset="0.38" stop-color="#6e8fb3"/><stop offset="0.46" stop-color="#93b2d1"/><stop offset="0.58" stop-color="#3c5a7b"/><stop offset="0.82" stop-color="#29435e"/><stop offset="1" stop-color="#0a1322"/></linearGradient><radialGradient id="brushed_screw" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#93b2d1"/><stop offset="0.45" stop-color="#4c6c8f"/><stop offset="0.8" stop-color="#29435e"/><stop offset="1" stop-color="#182c43"/></radialGradient><radialGradient id="brushed_rivet" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#6e8fb3"/><stop offset="0.55" stop-color="#3c5a7b"/><stop offset="1" stop-color="#182c43"/></radialGradient><linearGradient id="brushed_grain" x1="0" y1="0" x2="0" y2="1"><stop offset="0.0" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0004" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.0035" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.0039" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0258" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.0262" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.0293" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.0297" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.048" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0484" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.0515" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.0519" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0805" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.0809" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.084" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.0844" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1011" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1015" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.1046" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.105" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1313" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1317" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.1348" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.1352" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1579" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1583" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.1614" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.1618" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1782" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1786" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.1817" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.1821" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2078" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2082" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.2113" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.2117" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2277" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2281" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.2312" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.2316" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2557" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2561" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.2592" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.2596" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2763" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2767" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.2798" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.2802" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2973" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2977" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.3008" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.3012" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.3251" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3255" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.3286" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.329" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3613" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.3617" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.3648" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.3652" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.383" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3834" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.3865" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.3869" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4067" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4071" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.4102" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.4106" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4387" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4391" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.4422" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.4426" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4773" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4777" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.4808" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.4812" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5083" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5087" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.5118" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.5122" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5356" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.536" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.5391" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.5395" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5748" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5752" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.5783" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.5787" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5949" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5953" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.5984" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.5988" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.6317" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.6321" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.6352" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.6356" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.6568" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.6572" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.6603" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.6607" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.6789" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.6793" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.6824" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.6828" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7004" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7008" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.7039" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.7043" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7259" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7263" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.7294" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.7298" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7618" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7622" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.7653" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.7657" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7846" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.785" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.7881" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.7885" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.8157" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.8161" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.8192" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.8196" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.848" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.8484" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.8515" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.8519" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.8748" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.8752" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.8783" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.8787" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.9052" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9056" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.9087" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.9091" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9256" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.926" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.9291" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.9295" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.9459" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9463" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.9494" stop-color="#0a1322" stop-opacity="0.07"/><stop offset="0.9498" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9693" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.9697" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.9728" stop-color="#bed6ea" stop-opacity="0.06"/><stop offset="0.9732" stop-color="#bed6ea" stop-opacity="0"/><stop offset="1" stop-color="#0a1322" stop-opacity="0"/></linearGradient><linearGradient id="brushed_grain_fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0.0" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0004" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.0035" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.0039" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0294" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.0298" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.0329" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.0333" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.073" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.0734" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.0765" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.0769" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1151" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1155" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.1186" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.119" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.153" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1534" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.1565" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.1569" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.1838" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.1842" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.1873" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.1877" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2302" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2306" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.2337" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.2341" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.2769" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.2773" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.2804" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.2808" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3157" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.3161" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.3192" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.3196" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.3543" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3547" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.3578" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.3582" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.3857" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.3861" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.3892" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.3896" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4107" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4111" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.4142" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.4146" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4457" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4461" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.4492" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.4496" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.4865" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.4869" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.49" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.4904" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5134" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5138" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.5169" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.5173" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5597" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.5601" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.5632" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.5636" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.591" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.5914" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.5945" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.5949" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.6223" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.6227" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.6258" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.6262" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.6484" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.6488" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.6519" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.6523" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7002" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7006" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.7037" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.7041" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7451" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7455" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.7486" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.749" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.7937" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.7941" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.7972" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.7976" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.8353" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.8357" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.8388" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.8392" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.8612" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.8616" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.8647" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.8651" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.895" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.8954" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.8985" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.8989" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.9334" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9338" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.9369" stop-color="#0a1322" stop-opacity="0.055"/><stop offset="0.9373" stop-color="#0a1322" stop-opacity="0"/><stop offset="0.9616" stop-color="#bed6ea" stop-opacity="0"/><stop offset="0.962" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.9651" stop-color="#bed6ea" stop-opacity="0.05"/><stop offset="0.9655" stop-color="#bed6ea" stop-opacity="0"/><stop offset="1" stop-color="#0a1322" stop-opacity="0"/></linearGradient><linearGradient id="machined_body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#68737f"/><stop offset="0.05" stop-color="#48525c"/><stop offset="0.27" stop-color="#39424b"/><stop offset="0.33" stop-color="#262d35"/><stop offset="0.62" stop-color="#39424b"/><stop offset="0.85" stop-color="#262d35"/><stop offset="1" stop-color="#171b21"/></linearGradient><linearGradient id="machined_sheen" x1="0" y1="0" x2="1" y2="0.35"><stop offset="0" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.16" stop-color="#c0c8ce" stop-opacity="0.1"/><stop offset="0.34" stop-color="#c0c8ce" stop-opacity="0.01"/><stop offset="0.6" stop-color="#c0c8ce" stop-opacity="0.07500000000000001"/><stop offset="0.82" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="1" stop-color="#c0c8ce" stop-opacity="0"/></linearGradient><linearGradient id="machined_edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dde2e6" stop-opacity="0.95"/><stop offset="0.18" stop-color="#929da7" stop-opacity="0.4"/><stop offset="0.55" stop-color="#39424b" stop-opacity="0.2"/><stop offset="1" stop-color="#0a0d11" stop-opacity="0.85"/></linearGradient><linearGradient id="machined_inset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d11" stop-opacity="0.95"/><stop offset="0.45" stop-color="#171b21" stop-opacity="0.55"/><stop offset="0.82" stop-color="#68737f" stop-opacity="0.5"/><stop offset="1" stop-color="#c0c8ce" stop-opacity="0.85"/></linearGradient><linearGradient id="machined_frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#68737f"/><stop offset="0.12" stop-color="#48525c"/><stop offset="0.55" stop-color="#39424b"/><stop offset="1" stop-color="#262d35"/></linearGradient><linearGradient id="machined_cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07090d"/><stop offset="0.75" stop-color="#10141a"/><stop offset="1" stop-color="#10141a"/></linearGradient><linearGradient id="machined_plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#68737f"/><stop offset="0.06" stop-color="#48525c"/><stop offset="0.4" stop-color="#39424b"/><stop offset="0.42" stop-color="#262d35"/><stop offset="1" stop-color="#171b21"/></linearGradient><linearGradient id="machined_power" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#48525c"/><stop offset="0.35" stop-color="#39424b"/><stop offset="1" stop-color="#262d35"/></linearGradient><linearGradient id="machined_btn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#39424b"/><stop offset="0.12" stop-color="#262d35"/><stop offset="0.75" stop-color="#171b21"/><stop offset="1" stop-color="#0a0d11"/></linearGradient><linearGradient id="machined_pipe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#171b21"/><stop offset="0.22" stop-color="#39424b"/><stop offset="0.38" stop-color="#929da7"/><stop offset="0.46" stop-color="#dde2e6"/><stop offset="0.58" stop-color="#68737f"/><stop offset="0.82" stop-color="#262d35"/><stop offset="1" stop-color="#0a0d11"/></linearGradient><radialGradient id="machined_screw" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#929da7"/><stop offset="0.45" stop-color="#48525c"/><stop offset="0.8" stop-color="#262d35"/><stop offset="1" stop-color="#171b21"/></radialGradient><radialGradient id="machined_rivet" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#68737f"/><stop offset="0.55" stop-color="#39424b"/><stop offset="1" stop-color="#171b21"/></radialGradient><linearGradient id="machined_grain" x1="0" y1="0" x2="0" y2="1"><stop offset="0.0" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0004" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.0035" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.0039" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0245" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.0249" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.028" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.0284" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.0577" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0581" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.0612" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.0616" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0909" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.0913" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.0944" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.0948" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1275" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1279" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.131" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.1314" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1504" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1508" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.1539" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.1543" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1743" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1747" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.1778" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.1782" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1964" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1968" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.1999" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.2003" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.2202" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.2206" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.2237" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.2241" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.2544" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.2548" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.2579" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.2583" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.2762" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.2766" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.2797" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.2801" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3063" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3067" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.3098" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.3102" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3298" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3302" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.3333" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.3337" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.355" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3554" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.3585" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.3589" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.383" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3834" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.3865" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.3869" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4193" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4197" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.4228" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.4232" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.451" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4514" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.4545" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.4549" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4704" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4708" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.4739" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.4743" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4952" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4956" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.4987" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.4991" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5173" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.5177" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.5208" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.5212" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.5544" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5548" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.5579" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.5583" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5902" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.5906" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.5937" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.5941" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.6259" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.6263" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.6294" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.6298" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.662" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.6624" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.6655" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.6659" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.6965" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.6969" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.7" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.7004" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.7351" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7355" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.7386" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.739" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7706" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.771" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.7741" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.7745" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.795" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7954" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.7985" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.7989" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.8316" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.832" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.8351" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.8355" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.8608" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.8612" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.8643" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.8647" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.8954" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.8958" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.8989" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.8993" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.9262" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.9266" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.9297" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.9301" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.9541" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.9545" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.9576" stop-color="#c0c8ce" stop-opacity="0.06"/><stop offset="0.958" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.9807" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.9811" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.9842" stop-color="#0a0d11" stop-opacity="0.07"/><stop offset="0.9846" stop-color="#0a0d11" stop-opacity="0"/><stop offset="1" stop-color="#0a0d11" stop-opacity="0"/></linearGradient><linearGradient id="machined_grain_fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0.0" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0004" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.0035" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.0039" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0294" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.0298" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.0329" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.0333" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.073" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.0734" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.0765" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.0769" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1151" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1155" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.1186" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.119" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.153" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1534" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.1565" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.1569" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.1838" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.1842" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.1873" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.1877" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.2302" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.2306" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.2337" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.2341" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.2769" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.2773" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.2804" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.2808" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3157" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3161" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.3192" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.3196" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3543" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3547" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.3578" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.3582" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.3857" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.3861" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.3892" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.3896" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4107" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4111" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.4142" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.4146" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4457" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4461" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.4492" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.4496" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.4865" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.4869" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.49" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.4904" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.5134" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5138" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.5169" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.5173" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5597" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.5601" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.5632" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.5636" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.591" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.5914" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.5945" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.5949" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.6223" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.6227" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.6258" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.6262" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.6484" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.6488" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.6519" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.6523" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.7002" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7006" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.7037" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.7041" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7451" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.7455" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.7486" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.749" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.7937" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.7941" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.7972" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.7976" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.8353" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.8357" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.8388" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.8392" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.8612" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.8616" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.8647" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.8651" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.895" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.8954" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.8985" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.8989" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.9334" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.9338" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.9369" stop-color="#0a0d11" stop-opacity="0.055"/><stop offset="0.9373" stop-color="#0a0d11" stop-opacity="0"/><stop offset="0.9616" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="0.962" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.9651" stop-color="#c0c8ce" stop-opacity="0.05"/><stop offset="0.9655" stop-color="#c0c8ce" stop-opacity="0"/><stop offset="1" stop-color="#0a0d11" stop-opacity="0"/></linearGradient>`;

const G = {
  chassis: `<g id="chassis"><g id="shell"><path d="M137 247H289V205Q289 168 328 158H1112Q1146 161 1162 193L1179 244H1322Q1398 244 1405 320V758Q1400 843 1316 854H1282V876Q1282 905 1250 908H185Q151 904 151 873V852H118Q42 842 37 762V340Q42 260 137 247Z" fill="#030a16" opacity="0.8"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="url(#machined_body)" stroke="#929da7" stroke-width="3"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="url(#machined_sheen)"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="#000" filter="url(#aged_mottle)" opacity="0.55"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="#000" filter="url(#aged_grain)" opacity="0.45"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="#000" filter="url(#aged_grain_light)" opacity="0.3"/><path d="M126 244H288V204Q288 167 329 157H1110Q1147 158 1163 197L1178 243H1323Q1394 245 1400 318V763Q1394 835 1323 846H1285V876Q1284 900 1252 902H184Q154 900 153 874V848H123Q50 842 45 764V329Q52 252 126 244Z" fill="none" stroke="url(#machined_edge)" stroke-width="4"/><path d="M137 266H300L315 223H1138L1158 267H1315Q1366 270 1374 326V750Q1368 810 1312 821H1257V858H177V822H126Q71 812 68 753V337Q72 277 137 266Z" fill="#10141a" stroke="#262d35" stroke-width="6"/><path d="M137 266H300L315 223H1138L1158 267H1315Q1366 270 1374 326V750Q1368 810 1312 821H1257V858H177V822H126Q71 812 68 753V337Q72 277 137 266Z" fill="none" stroke="url(#machined_inset)" stroke-width="2.5"/><rect x="163" y="796" width="1091" height="72" rx="15" fill="url(#machined_cavity)" stroke="#68737f" stroke-width="4"/><rect x="174" y="806" width="1068" height="50" rx="11" fill="url(#machined_grain_fin)" stroke="#171b21" stroke-width="3" opacity="0.6"/><path d="M86 299L102 284M71 389L92 389M75 707H98M1354 304L1370 320M1356 729L1374 746" stroke="#dde2e6" stroke-width="3" opacity="0.45" fill="none"/><path d="M85 281H279M1190 280H1352M84 782H1363" stroke="#dde2e6" stroke-width="2" opacity="0.3" fill="none"/><path d="M61 507V366M58 721V580M1388 694V494" stroke="#c0c8ce" stroke-width="2" opacity="0.4" fill="none"/><g id="aged_wear"><rect x="92" y="352" width="13" height="52" rx="6" fill="url(#aged_streak)"/><rect x="1305" y="355" width="12" height="46" rx="6" fill="url(#aged_streak)"/><rect x="1333" y="702" width="9" height="30" rx="4" fill="url(#aged_streak)" opacity="0.8"/><path d="M210 815l38 6M262 824l22 3" stroke="#11151a" stroke-width="2" opacity="0.5" fill="none"/><path d="M1240 300l34 9M1196 292l18 4" stroke="#11151a" stroke-width="2" opacity="0.45" fill="none"/><path d="M120 776l26 -7M164 240l20 -5" stroke="#d5dade" stroke-width="1.4" opacity="0.3" fill="none"/><path d="M1352 770l-24 8" stroke="#d5dade" stroke-width="1.4" opacity="0.28" fill="none"/><path d="M330 168l46 3M980 162l58 2" stroke="#0c1014" stroke-width="1.6" opacity="0.4" fill="none"/></g></g><g id="side_pipes"><path d="M47 331H24V400H44M42 421H25V518H42M43 542H25V642H43" stroke="#0a0d11" stroke-width="7" fill="none"/><path d="M1398 356H1430M1398 421H1429M1398 445H1431M1398 545H1431M1398 568H1430M1398 666H1430" stroke="#0a0d11" stroke-width="5" fill="none"/><path d="M71 327H45V401H68M69 419H38V520H68M68 540H43V643H69M69 661H43V735H71" stroke="#04070b" stroke-width="14" fill="none" opacity="0.85"/><path d="M71 327H45V401H68M69 419H38V520H68M68 540H43V643H69M69 661H43V735H71" stroke="url(#machined_pipe)" stroke-width="11" fill="none"/><path d="M71 327H45V401H68M69 419H38V520H68M68 540H43V643H69M69 661H43V735H71" stroke="#dde2e6" stroke-width="2.2" fill="none" opacity="0.35" stroke-dasharray="22 14"/><path d="M1395 354H1423V423H1398M1397 444H1424V546H1398M1398 566H1422V667H1398" stroke="#04070b" stroke-width="13" fill="none" opacity="0.85"/><path d="M1395 354H1423V423H1398M1397 444H1424V546H1398M1398 566H1422V667H1398" stroke="url(#machined_pipe)" stroke-width="10" fill="none"/><path d="M1395 354H1423V423H1398M1397 444H1424V546H1398M1398 566H1422V667H1398" stroke="#dde2e6" stroke-width="2" fill="none" opacity="0.35" stroke-dasharray="22 14"/><path d="M39.5 345H50.5M39.5 371H50.5M32.5 437H43.5M32.5 463H43.5M32.5 489H43.5M37.5 558H48.5M37.5 584H48.5M37.5 610H48.5M37.5 679H48.5M37.5 705H48.5" stroke="#0a0d11" stroke-width="2.4" fill="none" opacity="0.55"/><path d="M1418.0 372H1428.0M1418.0 398H1428.0M1419.0 462H1429.0M1419.0 488H1429.0M1419.0 514H1429.0M1417.0 584H1427.0M1417.0 610H1427.0M1417.0 636H1427.0" stroke="#0a0d11" stroke-width="2.2" fill="none" opacity="0.55"/><path d="M1170 247V221H1354Q1379 221 1382 248V274" stroke="#262d35" stroke-width="13" fill="none"/><path d="M1182 248V232H1347Q1364 233 1367 251V274" stroke="#929da7" stroke-width="3" fill="none" opacity="0.55"/><path d="M98 270L80 252L110 236L286 236" stroke="#262d35" stroke-width="15" fill="none"/><path d="M91 266L112 248H285" stroke="#929da7" stroke-width="3" fill="none" opacity="0.55"/></g><g id="inner_panel"><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="url(#machined_frame)" stroke="#929da7" stroke-width="3"/><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="url(#machined_sheen)"/><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="#000" filter="url(#aged_mottle)" opacity="0.53"/><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="#000" filter="url(#aged_grain)" opacity="0.43"/><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="#000" filter="url(#aged_grain_light)" opacity="0.28"/><path d="M145 289H1293Q1341 289 1345 340V735Q1340 786 1292 792H145Q96 788 93 735V345Q96 295 145 289Z" fill="none" stroke="url(#machined_edge)" stroke-width="3.5"/><path d="M150 308H1287Q1320 309 1325 346V729Q1321 766 1284 772H151Q113 768 111 728V352Q114 315 150 308Z" fill="url(#machined_cavity)" stroke="#0a0d11" stroke-width="12"/><path d="M151 308H1287Q1320 309 1325 346V729Q1321 766 1284 772H151Q113 768 111 728V352Q114 315 150 308Z" fill="none" stroke="url(#machined_inset)" stroke-width="5"/><path d="M151 308H1287Q1320 309 1325 346V729Q1321 766 1284 772H151Q113 768 111 728V352Q114 315 150 308Z" fill="none" stroke="#dde2e6" stroke-width="1.2" opacity="0.22"/></g><g id="screws"><g transform="translate(99 327)"><circle r="23" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="21.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="14" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-8.7 5.6 Q0 13.3 8.7 5.6 Q0 8.7 -8.7 5.6Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-14,0 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0 Z M-12.4,0 a12.4,12.4 0 1 1 24.8,0 a12.4,12.4 0 1 1 -24.8,0 Z"/><path d="M-7-7L7 7M7-7L-7 7" stroke="#020609" stroke-width="4" fill="none"/><path d="M-6-8L7 5" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g><g transform="translate(98 725)"><circle r="23" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="21.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="14" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-8.7 5.6 Q0 13.3 8.7 5.6 Q0 8.7 -8.7 5.6Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-14,0 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0 Z M-12.4,0 a12.4,12.4 0 1 1 24.8,0 a12.4,12.4 0 1 1 -24.8,0 Z"/><g transform="rotate(0)"><path d="M-8 0H8M0-8V8" stroke="#020609" stroke-width="4" fill="none"/><path d="M-7-1H7" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g></g><g transform="translate(1311 330)"><circle r="23" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="21.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="14" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-8.7 5.6 Q0 13.3 8.7 5.6 Q0 8.7 -8.7 5.6Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-14,0 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0 Z M-12.4,0 a12.4,12.4 0 1 1 24.8,0 a12.4,12.4 0 1 1 -24.8,0 Z"/><path d="M-7-7L7 7M7-7L-7 7" stroke="#020609" stroke-width="4" fill="none"/><path d="M-6-8L7 5" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g><g transform="translate(1308 738)"><circle r="23" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="21.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="14" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-8.7 5.6 Q0 13.3 8.7 5.6 Q0 8.7 -8.7 5.6Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-14,0 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0 Z M-12.4,0 a12.4,12.4 0 1 1 24.8,0 a12.4,12.4 0 1 1 -24.8,0 Z"/><g transform="rotate(0)"><path d="M-8 0H8M0-8V8" stroke="#020609" stroke-width="4" fill="none"/><path d="M-7-1H7" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g></g><g transform="translate(208 271)"><circle r="17" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="15.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="10" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-6.2 4.0 Q0 9.5 6.2 4.0 Q0 6.2 -6.2 4.0Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-10,0 a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0 Z M-8.4,0 a8.4,8.4 0 1 1 16.8,0 a8.4,8.4 0 1 1 -16.8,0 Z"/><path d="M-7-7L7 7M7-7L-7 7" stroke="#020609" stroke-width="4" fill="none"/><path d="M-6-8L7 5" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g><g transform="translate(1202 271)"><circle r="17" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="15.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="10" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-6.2 4.0 Q0 9.5 6.2 4.0 Q0 6.2 -6.2 4.0Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-10,0 a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0 Z M-8.4,0 a8.4,8.4 0 1 1 16.8,0 a8.4,8.4 0 1 1 -16.8,0 Z"/><path d="M-7-7L7 7M7-7L-7 7" stroke="#020609" stroke-width="4" fill="none"/><path d="M-6-8L7 5" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g><g transform="translate(231 873)"><circle r="13" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="11.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="7" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-4.3 2.8 Q0 6.6 4.3 2.8 Q0 4.3 -4.3 2.8Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-7,0 a7,7 0 1 0 14,0 a7,7 0 1 0 -14,0 Z M-5.4,0 a5.4,5.4 0 1 1 10.8,0 a5.4,5.4 0 1 1 -10.8,0 Z"/><g transform="rotate(90)"><path d="M-8 0H8M0-8V8" stroke="#020609" stroke-width="4" fill="none"/><path d="M-7-1H7" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g></g><g transform="translate(1198 873)"><circle r="13" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="11.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="7" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-4.3 2.8 Q0 6.6 4.3 2.8 Q0 4.3 -4.3 2.8Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-7,0 a7,7 0 1 0 14,0 a7,7 0 1 0 -14,0 Z M-5.4,0 a5.4,5.4 0 1 1 10.8,0 a5.4,5.4 0 1 1 -10.8,0 Z"/><g transform="rotate(90)"><path d="M-8 0H8M0-8V8" stroke="#020609" stroke-width="4" fill="none"/><path d="M-7-1H7" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g></g></g></g>`,
  ecran: `<g id="ecran">
    <path d="M164 342H1222Q1251 342 1264 367L1277 405V684Q1271 711 1240 719H167Q135 714 127 683V402L141 365Q147 347 164 342Z" fill="url(#gpt_screenFill)" stroke="#2f739f" stroke-width="5"/>
    <path d="M174 354H1214Q1238 354 1248 376L1258 407V675Q1254 696 1231 702H175Q151 698 145 676V409L155 378Q160 359 174 354Z" fill="url(#gpt_screenBloom)"/>
    <path d="M174 354H1214Q1238 354 1248 376L1258 407V675Q1254 696 1231 702H175Q151 698 145 676V409L155 378Q160 359 174 354Z" fill="url(#gpt_screenGrid)"/>
    <path d="M177 382H1221M173 442H1230M173 500H1230M173 559H1230M173 620H1230M173 675H1224" stroke="#2d9ce1" stroke-width="1" opacity="0.18"/>
    <path d="M187 359H1210M151 403V672M1252 405V674" stroke="#91d8ff" stroke-width="2" opacity="0.3"/>
    <path d="M179 453H1241M180 656H1239" stroke="#02070d" stroke-width="3" opacity="0.7"/>
  </g>`,
  graduation: `<g id="graduation">
    <g font-family="Impact, 'Arial Black', sans-serif" font-size="42" fill="#eaf7ff" text-anchor="middle">
      <text x="225" y="492">0</text>
      <text x="474" y="492">25</text>
      <text x="723" y="492">50</text>
      <text x="972" y="492">75</text>
      <text x="1184" y="492">100</text>
    </g>
    <path d="M225 505 H1185" stroke="#bfe8ff" stroke-width="2.5" opacity="0.9"/>
    <g stroke="#bfe8ff" stroke-width="2.5" opacity="0.9">
      <path d="M225 505 V522 M474 505 V522 M723 505 V522 M972 505 V522 M1185 505 V522"/>
    </g>
    <g stroke="#7fb8d8" stroke-width="1.5" opacity="0.7">
      <path d="M275 505 V515 M325 505 V515 M375 505 V515 M425 505 V515"/>
      <path d="M524 505 V515 M574 505 V515 M624 505 V515 M673 505 V515"/>
      <path d="M773 505 V515 M823 505 V515 M873 505 V515 M922 505 V515"/>
      <path d="M1022 505 V515 M1072 505 V515 M1122 505 V515 M1160 505 V515"/>
    </g>
  </g>`,
  gauge_track: `<g id="gauge_track">
    <rect x="212" y="538" width="986" height="112" rx="20" fill="#04101c" stroke="#0a2438" stroke-width="3"/>
    <rect x="212" y="538" width="986" height="112" rx="20" fill="none" stroke="#2fa8e8" stroke-width="3" opacity="0.8"/>
    <rect x="218" y="544" width="974" height="100" rx="16" fill="none" stroke="#8fe0ff" stroke-width="1.5" opacity="0.5"/>
  </g>`,
  legende: `<g id="legende">
    <text x="723" y="690" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-size="26" letter-spacing="3" fill="#2fb8ff" opacity="0.4" stroke="#2fb8ff" stroke-width="3">0 = NO CHILL  |  100 = MAX CHILL</text>
    <text x="723" y="690" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-size="26" letter-spacing="3" fill="#cfeaff">0 = NO CHILL  |  100 = MAX CHILL</text>
    <g stroke="#2fb8ff" stroke-width="2" opacity="0.5">
      <path d="M415 683 h55 M430 678 h40"/>
      <path d="M978 683 h55 M993 678 h40"/>
    </g>
  </g>`,
  sous_titre: `<g id="sous_titre">
    <use href="#fable_t_sous" fill="#2f8fff" stroke="#2f8fff" stroke-width="8" opacity="0.55" filter="url(#fable_f_blur10)"/>
    <use href="#fable_t_sous" fill="#4aa0ff" stroke="#4aa0ff" stroke-width="3" opacity="0.85" filter="url(#fable_f_blur4)"/>
    <use href="#fable_t_sous" fill="#aed6ff" stroke="#5aa8ff" stroke-width="1.4"/>
    <use href="#fable_t_sous" fill="#ffffff" opacity="0.85"/>
    <use href="#fable_sym_flocon" transform="translate(250 402)" stroke="#2f8fff" stroke-width="4.5" opacity="0.7" filter="url(#fable_f_blur4)"/>
    <use href="#fable_sym_flocon" transform="translate(250 402)" stroke="#dceeff" stroke-width="2.2"/>
    <use href="#fable_sym_flocon" transform="translate(1210 402)" stroke="#2f8fff" stroke-width="4.5" opacity="0.7" filter="url(#fable_f_blur4)"/>
    <use href="#fable_sym_flocon" transform="translate(1210 402)" stroke="#dceeff" stroke-width="2.2"/>
  </g>`,
  panneau_power: `<g id="panneau_power"><g id="power_panel"><path d="M1281 434H1394V704Q1392 725 1372 733H1301Q1283 727 1281 706Z" fill="#07090d" stroke="#171b21" stroke-width="10"/><path d="M1289 438H1385V699Q1383 714 1368 719H1306Q1292 714 1289 699Z" fill="url(#machined_power)" stroke="#68737f" stroke-width="3"/><path d="M1289 438H1385V699Q1383 714 1368 719H1306Q1292 714 1289 699Z" fill="#000" filter="url(#aged_mottle)" opacity="0.5"/><path d="M1289 438H1385V699Q1383 714 1368 719H1306Q1292 714 1289 699Z" fill="#000" filter="url(#aged_grain)" opacity="0.42"/><path d="M1289 438H1385V699Q1383 714 1368 719H1306Q1292 714 1289 699Z" fill="#000" filter="url(#aged_grain_light)" opacity="0.26"/><path d="M1289 438H1385V699Q1383 714 1368 719H1306Q1292 714 1289 699Z" fill="none" stroke="url(#machined_edge)" stroke-width="3"/><rect x="1305" y="459" width="66" height="39" rx="5" fill="url(#machined_cavity)" stroke="#39424b" stroke-width="3"/><rect x="1303" y="604" width="72" height="80" rx="9" fill="#040609" opacity="0.6"/><path d="M1311 614H1367M1311 626H1367M1311 638H1367M1311 650H1367M1311 662H1367M1311 674H1367" stroke="#030507" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M1311 611H1367M1311 623H1367M1311 635H1367M1311 647H1367M1311 659H1367M1311 671H1367" stroke="#68737f" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/><path d="M1311 619.5H1367M1311 631.5H1367M1311 643.5H1367M1311 655.5H1367M1311 667.5H1367M1311 679.5H1367" stroke="#929da7" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.3"/><path d="M1297 443V707M1378 443V706" stroke="#c0c8ce" stroke-width="1.5" opacity="0.35" fill="none"/><circle cx="1338" cy="544" r="31" fill="#07090d" stroke="#262d35" stroke-width="5"/><circle cx="1338" cy="544" r="24" fill="#081b10" stroke="#668a72" stroke-width="3"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.4" d="M1307,544 a31,31 0 1 0 62,0 a31,31 0 1 0 -62,0 Z M1309,544 a29,29 0 1 1 58,0 a29,29 0 1 1 -58,0 Z"/><circle cx="1301" cy="451" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="1301" cy="451" r="4" fill="url(#machined_rivet)"/><circle cx="1299.8" cy="449.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="1373" cy="451" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="1373" cy="451" r="4" fill="url(#machined_rivet)"/><circle cx="1371.8" cy="449.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><g transform="translate(1337 700)"><circle r="12" fill="#0a0d11" stroke="#39424b" stroke-width="5"/><circle r="10.5" fill="none" stroke="#191410" stroke-width="3" opacity="0.4"/><circle r="8" fill="url(#machined_screw)" stroke="#929da7" stroke-width="2"/><path d="M-5.0 3.2 Q0 7.6 5.0 3.2 Q0 5.0 -5.0 3.2Z" fill="#1a130c" opacity="0.5"/><path fill-rule="evenodd" fill="#dde2e6" opacity="0.32" d="M-8,0 a8,8 0 1 0 16,0 a8,8 0 1 0 -16,0 Z M-6.4,0 a6.4,6.4 0 1 1 12.8,0 a6.4,6.4 0 1 1 -12.8,0 Z"/><g transform="rotate(15)"><path d="M-8 0H8M0-8V8" stroke="#020609" stroke-width="4" fill="none"/><path d="M-7-1H7" stroke="#dde2e6" stroke-width="1.2" fill="none" opacity="0.5"/></g></g></g></g>`,
  bouton_power: `<g id="bouton_power">
    <circle cx="1338" cy="544" r="52" fill="url(#kimi_greenHalo)"/>
    <circle cx="1338" cy="544" r="24" fill="url(#kimi_greenBtn)" stroke="#0a4a0a" stroke-width="3"/>
    <ellipse cx="1330" cy="535" rx="9" ry="6" fill="#ffffff" opacity="0.8"/>
  </g>`,
  boutons_bas: `<g id="boutons_bas"><g id="bottom_buttons"><rect x="172" y="752" width="182" height="82" rx="12" fill="url(#machined_btn)" stroke="#06090c" stroke-width="3"/><rect x="172" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_mottle)" opacity="0.38"/><rect x="172" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_grain)" opacity="0.36"/><rect x="172" y="752" width="182" height="82" rx="12" fill="none" stroke="url(#machined_edge)" stroke-width="2.6"/><rect x="178" y="758" width="170" height="70" rx="9" fill="none" stroke="#68737f" stroke-width="1.5" opacity="0.6"/><circle cx="186" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="186" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="184.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="340" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="340" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="338.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><rect x="374" y="752" width="182" height="82" rx="12" fill="url(#machined_btn)" stroke="#06090c" stroke-width="3"/><rect x="374" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_mottle)" opacity="0.38"/><rect x="374" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_grain)" opacity="0.36"/><rect x="374" y="752" width="182" height="82" rx="12" fill="none" stroke="url(#machined_edge)" stroke-width="2.6"/><rect x="380" y="758" width="170" height="70" rx="9" fill="none" stroke="#68737f" stroke-width="1.5" opacity="0.6"/><circle cx="388" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="388" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="386.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="542" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="542" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="540.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><rect x="576" y="752" width="182" height="82" rx="12" fill="url(#machined_btn)" stroke="#06090c" stroke-width="3"/><rect x="576" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_mottle)" opacity="0.38"/><rect x="576" y="752" width="182" height="82" rx="12" fill="#000" filter="url(#aged_grain)" opacity="0.36"/><rect x="576" y="752" width="182" height="82" rx="12" fill="none" stroke="url(#machined_edge)" stroke-width="2.6"/><rect x="582" y="758" width="170" height="70" rx="9" fill="none" stroke="#68737f" stroke-width="1.5" opacity="0.6"/><circle cx="590" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="590" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="588.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="744" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="744" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="742.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><rect x="778" y="752" width="230" height="82" rx="12" fill="url(#machined_btn)" stroke="#06090c" stroke-width="3"/><rect x="778" y="752" width="230" height="82" rx="12" fill="#000" filter="url(#aged_mottle)" opacity="0.38"/><rect x="778" y="752" width="230" height="82" rx="12" fill="#000" filter="url(#aged_grain)" opacity="0.36"/><rect x="778" y="752" width="230" height="82" rx="12" fill="none" stroke="url(#machined_edge)" stroke-width="2.6"/><rect x="784" y="758" width="218" height="70" rx="9" fill="none" stroke="#68737f" stroke-width="1.5" opacity="0.6"/><circle cx="792" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="792" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="790.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="994" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="994" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="992.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><rect x="1028" y="752" width="190" height="82" rx="12" fill="url(#machined_btn)" stroke="#06090c" stroke-width="3"/><rect x="1028" y="752" width="190" height="82" rx="12" fill="#000" filter="url(#aged_mottle)" opacity="0.38"/><rect x="1028" y="752" width="190" height="82" rx="12" fill="#000" filter="url(#aged_grain)" opacity="0.36"/><rect x="1028" y="752" width="190" height="82" rx="12" fill="none" stroke="url(#machined_edge)" stroke-width="2.6"/><rect x="1034" y="758" width="178" height="70" rx="9" fill="none" stroke="#68737f" stroke-width="1.5" opacity="0.6"/><circle cx="1042" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="1042" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="1040.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><circle cx="1204" cy="821" r="5.8" fill="#0a0d11" opacity="0.8"/><circle cx="1204" cy="821" r="4" fill="url(#machined_rivet)"/><circle cx="1202.8" cy="819.6" r="1.28" fill="#c0c8ce" opacity="0.4"/><g stroke="#6fd4ff" stroke-width="2.5" stroke-linecap="round" fill="none" transform="translate(210 793)"><path d="M0 -12 V12 M-10 -6 L10 6 M-10 6 L10 -6"/></g><g fill="#6fd4ff" transform="translate(412 793)"><rect x="-12" y="-2" width="6" height="14"/><rect x="-3" y="-10" width="6" height="22"/><rect x="6" y="-16" width="6" height="28"/></g><g stroke="#6fd4ff" stroke-width="2.5" fill="none" transform="translate(614 793)"><circle cx="0" cy="0" r="10"/><path d="M0 -15 V-6 M0 6 V15 M-15 0 H-6 M6 0 H15"/></g><g stroke="#6fd4ff" stroke-width="2.5" stroke-linecap="round" fill="none" transform="translate(816 793)"><path d="M0 -12 V12 M-10 -6 L10 6 M-10 6 L10 -6"/></g><g stroke="#6fd4ff" stroke-width="2.5" fill="none" transform="translate(1066 793)"><circle cx="0" cy="0" r="11"/><path d="M0 -4 V5 M0 -8 V-7" stroke-linecap="round"/></g><g font-family="'Arial Black', Arial, sans-serif" font-size="25" letter-spacing="1" text-anchor="middle" fill="#6fd4ff"><text x="272" y="803">STATUS</text><text x="480" y="803">DATA</text><text x="680" y="803">HUD</text><text x="900" y="803">CALIBRATE</text><text x="1150" y="803">ABOUT</text></g></g></g>`,
  plaque_titre: `<g id="plaque_titre"><g id="title_plate"><path d="M338 153H1107Q1134 153 1149 178L1165 221Q1174 249 1151 278L1125 297H324L294 276Q280 264 287 230L296 190Q303 161 338 153Z" fill="#030a16" opacity="0.7"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="url(#machined_plate)" stroke="#929da7" stroke-width="5"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="url(#machined_sheen)"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="#000" filter="url(#aged_mottle)" opacity="0.52"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="#000" filter="url(#aged_grain)" opacity="0.44"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="#000" filter="url(#aged_grain_light)" opacity="0.28"/><path d="M337 157H1108Q1134 157 1146 182L1160 224Q1167 249 1149 270L1124 289H325L300 271Q287 256 294 228L302 191Q309 165 337 157Z" fill="none" stroke="url(#machined_edge)" stroke-width="3.5"/><path d="M347 172H1096Q1117 172 1127 192L1138 227Q1143 244 1130 258L1114 271H336L318 257Q309 246 314 227L321 195Q325 176 347 172Z" fill="url(#machined_cavity)" stroke="#262d35" stroke-width="5"/><path d="M347 172H1096Q1117 172 1127 192L1138 227Q1143 244 1130 258L1114 271H336L318 257Q309 246 314 227L321 195Q325 176 347 172Z" fill="none" stroke="url(#machined_inset)" stroke-width="2.6"/><path d="M347 177H1094Q1110 177 1118 193L1128 226Q1132 239 1122 249L1108 260H342L329 249Q322 239 326 225L333 197Q336 181 347 177Z" fill="#07090d"/><path d="M325 198H1129M335 267H1117" stroke="#c0c8ce" stroke-width="2" opacity="0.4" fill="none"/><path d="M344.0 218V158.0M344.0 218L318.0 203M344.0 218L370.0 203M344.0 218V218.0M344.0 218L318.0 233M344.0 218L370.0 233M332.0 194L344.0 202L356.0 194M332.0 242L344.0 234L356.0 242M318.0 215L330.0 218L324.0 228M370.0 215L358.0 218L364.0 228M318.0 221L330.0 218L324.0 208M370.0 221L358.0 218L364.0 208" stroke="#2f8fff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.22"/><path d="M344.0 218V158.0M344.0 218L318.0 203M344.0 218L370.0 203M344.0 218V218.0M344.0 218L318.0 233M344.0 218L370.0 233M332.0 194L344.0 202L356.0 194M332.0 242L344.0 234L356.0 242M318.0 215L330.0 218L324.0 228M370.0 215L358.0 218L364.0 228M318.0 221L330.0 218L324.0 208M370.0 221L358.0 218L364.0 208" stroke="#dde2e6" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M1119.0 218V224.0M1119.0 218L1093.0 203M1119.0 218L1145.0 203M1119.0 218V284.0M1119.0 218L1093.0 233M1119.0 218L1145.0 233M1107.0 194L1119.0 202L1131.0 194M1107.0 242L1119.0 234L1131.0 242M1093.0 215L1105.0 218L1099.0 228M1145.0 215L1133.0 218L1139.0 228M1093.0 221L1105.0 218L1099.0 208M1145.0 221L1133.0 218L1139.0 208" stroke="#2f8fff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.22"/><path d="M1119.0 218V224.0M1119.0 218L1093.0 203M1119.0 218L1145.0 203M1119.0 218V284.0M1119.0 218L1093.0 233M1119.0 218L1145.0 233M1107.0 194L1119.0 202L1131.0 194M1107.0 242L1119.0 234L1131.0 242M1093.0 215L1105.0 218L1099.0 228M1145.0 215L1133.0 218L1139.0 228M1093.0 221L1105.0 218L1099.0 208M1145.0 221L1133.0 218L1139.0 208" stroke="#dde2e6" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="722" cy="164.5" r="6.3" fill="#0a0d11" opacity="0.8"/><circle cx="722" cy="164.5" r="4.5" fill="url(#machined_rivet)"/><circle cx="720.65" cy="162.925" r="1.44" fill="#c0c8ce" opacity="0.4"/><circle cx="722" cy="279.5" r="6.3" fill="#0a0d11" opacity="0.8"/><circle cx="722" cy="279.5" r="4.5" fill="url(#machined_rivet)"/><circle cx="720.65" cy="277.925" r="1.44" fill="#c0c8ce" opacity="0.4"/></g></g>`,
  titre_texte: `<g id="titre_texte">
    <use href="#fable_t_titre" fill="#2277ff" stroke="#2277ff" stroke-width="14" opacity="0.5" filter="url(#fable_f_blur18)"/>
    <use href="#fable_t_titre" fill="#3f97ff" stroke="#3f97ff" stroke-width="6" opacity="0.85" filter="url(#fable_f_blur6)"/>
    <use href="#fable_t_titre" fill="#9ccdff" stroke="#5aa8ff" stroke-width="2"/>
    <use href="#fable_t_titre" fill="#ffffff" opacity="0.92"/>
    <use href="#fable_sym_flocon" transform="translate(313 225)" stroke="#2f8fff" stroke-width="4.5" opacity="0.7" filter="url(#fable_f_blur4)"/>
    <use href="#fable_sym_flocon" transform="translate(313 225)" stroke="#dceeff" stroke-width="2.2"/>
    <use href="#fable_sym_flocon" transform="translate(1139 225)" stroke="#2f8fff" stroke-width="4.5" opacity="0.7" filter="url(#fable_f_blur4)"/>
    <use href="#fable_sym_flocon" transform="translate(1139 225)" stroke="#dceeff" stroke-width="2.2"/>
  </g>`,
  frost_layer: `<g id="frost_layer">
    <g filter="url(#fable_f_frost)">
      <path d="M 302 178 Q 316 150 334 164 Q 350 142 372 158 Q 392 138 414 156 Q 440 144 462 160 Q 492 146 520 162 Q 556 148 590 164 Q 630 150 668 166 Q 710 152 748 166 Q 792 150 830 164 Q 872 148 908 162 Q 946 146 982 160 Q 1016 144 1048 158 Q 1080 140 1108 156 Q 1132 144 1156 166 L 1158 192 L 302 192 Z" fill="url(#fable_g_frost)"/>
      <path d="M 60 310 Q 84 288 112 300 Q 140 282 172 296 Q 204 280 238 294 Q 268 282 296 296 L 298 318 L 60 330 Z" fill="url(#fable_g_frost)"/>
      <path d="M 1160 296 Q 1192 280 1224 292 Q 1256 278 1288 292 Q 1322 280 1352 296 Q 1378 286 1396 306 L 1396 330 L 1160 318 Z" fill="url(#fable_g_frost)"/>
      <path d="M 58 330 Q 76 356 64 386 Q 82 414 66 444 Q 84 470 68 500 Q 86 528 70 558 Q 88 586 72 616 Q 90 644 74 674 Q 90 700 76 726 L 58 728 Z" fill="url(#fable_g_frost)"/>
      <path d="M 1396 340 Q 1380 368 1392 398 Q 1376 426 1390 456 Q 1374 484 1388 514 Q 1372 542 1388 572 Q 1374 600 1390 630 Q 1376 658 1392 688 L 1398 690 L 1398 340 Z" fill="url(#fable_g_frost)"/>
      <path d="M 70 820 Q 100 846 136 834 Q 172 856 212 842 Q 256 862 300 848 Q 348 866 396 852 Q 448 868 500 854 Q 556 870 612 856 Q 668 872 724 858 Q 780 872 836 858 Q 892 872 948 858 Q 1004 870 1060 856 Q 1116 868 1172 854 Q 1228 866 1284 850 Q 1336 862 1386 838 L 1392 812 L 70 800 Z" fill="url(#fable_g_frost)"/>
      <path d="M 88 312 Q 108 300 126 314 Q 138 330 124 344 Q 106 354 92 342 Q 80 326 88 312 Z" fill="#eef8ff" opacity="0.85"/>
      <path d="M 88 722 Q 108 710 126 724 Q 138 740 124 754 Q 106 764 92 752 Q 80 736 88 722 Z" fill="#eef8ff" opacity="0.8"/>
      <path d="M 1328 314 Q 1348 302 1366 316 Q 1378 332 1364 346 Q 1346 356 1332 344 Q 1320 328 1328 314 Z" fill="#eef8ff" opacity="0.8"/>
      <path d="M 1328 724 Q 1348 712 1366 726 Q 1378 742 1364 756 Q 1346 766 1332 754 Q 1320 738 1328 724 Z" fill="#eef8ff" opacity="0.8"/>
      <path d="M 44 428 Q 66 414 92 426 Q 100 448 88 462 Q 66 472 48 460 Q 38 444 44 428 Z" fill="url(#fable_g_frost)"/>
      <path d="M 42 540 Q 64 528 92 538 Q 102 558 90 572 Q 66 582 48 570 Q 36 554 42 540 Z" fill="url(#fable_g_frost)"/>
      <path d="M 1160 232 Q 1190 222 1220 232 Q 1252 224 1280 234 Q 1310 226 1340 236 Q 1360 230 1372 244 L 1370 258 L 1160 250 Z" fill="url(#fable_g_frost)"/>
      <path d="M 300 168 Q 310 186 300 204 Q 312 224 302 244 Q 314 262 304 282 L 298 284 L 298 168 Z" fill="url(#fable_g_frost)"/>
      <path d="M 1160 168 Q 1150 186 1160 204 Q 1148 224 1158 244 Q 1146 262 1158 282 L 1162 284 L 1162 168 Z" fill="url(#fable_g_frost)"/>
    </g>
    <g fill="#ffffff">
      <circle cx="180" cy="296" r="2.2" opacity="0.9"/>
      <circle cx="340" cy="160" r="1.8" opacity="0.85"/>
      <circle cx="520" cy="156" r="2.4" opacity="0.9"/>
      <circle cx="870" cy="154" r="1.7" opacity="0.8"/>
      <circle cx="1100" cy="152" r="2.2" opacity="0.9"/>
      <circle cx="1300" cy="290" r="1.8" opacity="0.85"/>
      <circle cx="66" cy="470" r="2" opacity="0.85"/>
      <circle cx="1392" cy="520" r="2" opacity="0.8"/>
      <circle cx="250" cy="850" r="2.4" opacity="0.9"/>
      <circle cx="640" cy="860" r="1.8" opacity="0.85"/>
      <circle cx="980" cy="858" r="2.2" opacity="0.9"/>
      <circle cx="1240" cy="852" r="1.8" opacity="0.8"/>
    </g>
  </g>`,
  icicles: `<g id="icicles">
    <g id="icicle_00" transform="translate(121 254)">
      <path d="M-7 0Q0 5 7 0L3 35L0 50L-3 35Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V39" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    </g>
    <g id="icicle_01" transform="translate(164 254)">
      <path d="M-8 0Q0 6 8 0L4 54L0 75L-4 54Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 6V60" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    </g>
    <g id="icicle_02" transform="translate(204 254)">
      <path d="M-6 0Q0 5 6 0L3 27L0 39L-3 27Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_03" transform="translate(331 178)">
      <path d="M-6 0Q0 5 6 0L3 32L0 47L-3 32Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_04" transform="translate(371 177)">
      <path d="M-7 0Q0 5 7 0L3 43L0 63L-3 43Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V50" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_05" transform="translate(420 177)">
      <path d="M-5 0Q0 4 5 0L2 23L0 35L-2 23Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_06" transform="translate(487 177)">
      <path d="M-6 0Q0 5 6 0L3 34L0 50L-3 34Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_07" transform="translate(569 177)">
      <path d="M-5 0Q0 4 5 0L2 25L0 39L-2 25Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_08" transform="translate(675 177)">
      <path d="M-7 0Q0 5 7 0L3 47L0 70L-3 47Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V56" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_09" transform="translate(784 177)">
      <path d="M-5 0Q0 4 5 0L2 29L0 43L-2 29Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_10" transform="translate(902 177)">
      <path d="M-6 0Q0 5 6 0L3 38L0 57L-3 38Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_11" transform="translate(1004 177)">
      <path d="M-5 0Q0 4 5 0L2 27L0 41L-2 27Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_12" transform="translate(1083 177)">
      <path d="M-7 0Q0 5 7 0L3 44L0 66L-3 44Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_13" transform="translate(337 282)">
      <path d="M-6 0Q0 5 6 0L3 37L0 57L-3 37Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_14" transform="translate(386 282)">
      <path d="M-5 0Q0 4 5 0L2 57L0 84L-2 57Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V66" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_15" transform="translate(516 282)">
      <path d="M-5 0Q0 4 5 0L2 28L0 42L-2 28Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_16" transform="translate(676 282)">
      <path d="M-6 0Q0 5 6 0L3 39L0 59L-3 39Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_17" transform="translate(775 282)">
      <path d="M-7 0Q0 5 7 0L3 47L0 71L-3 47Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V57" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_18" transform="translate(986 282)">
      <path d="M-5 0Q0 4 5 0L2 30L0 45L-2 30Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_19" transform="translate(1156 313)">
      <path d="M-6 0Q0 5 6 0L3 47L0 69L-3 47Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_20" transform="translate(1214 316)">
      <path d="M-7 0Q0 5 7 0L3 68L0 100L-3 68Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V80" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_21" transform="translate(1361 314)">
      <path d="M-6 0Q0 5 6 0L3 40L0 61L-3 40Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_22" transform="translate(116 703)">
      <path d="M-7 0Q0 5 7 0L3 48L0 73L-3 48Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_23" transform="translate(181 703)">
      <path d="M-6 0Q0 5 6 0L3 31L0 47L-3 31Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_24" transform="translate(318 703)">
      <path d="M-5 0Q0 4 5 0L2 55L0 82L-2 55Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V65" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_25" transform="translate(561 703)">
      <path d="M-6 0Q0 5 6 0L3 37L0 55L-3 37Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_26" transform="translate(807 703)">
      <path d="M-6 0Q0 5 6 0L3 53L0 80L-3 53Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_27" transform="translate(1009 703)">
      <path d="M-5 0Q0 4 5 0L2 36L0 54L-2 36Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_28" transform="translate(1246 703)">
      <path d="M-7 0Q0 5 7 0L3 66L0 99L-3 66Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V79" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_29" transform="translate(143 832)">
      <path d="M-7 0Q0 5 7 0L3 50L0 75L-3 50Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_30" transform="translate(205 834)">
      <path d="M-6 0Q0 5 6 0L3 73L0 109L-3 73Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V87" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_31" transform="translate(277 834)">
      <path d="M-5 0Q0 4 5 0L2 35L0 53L-2 35Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_32" transform="translate(391 835)">
      <path d="M-7 0Q0 5 7 0L3 58L0 87L-3 58Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_33" transform="translate(545 835)">
      <path d="M-6 0Q0 5 6 0L3 76L0 114L-3 76Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V91" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_34" transform="translate(683 835)">
      <path d="M-5 0Q0 4 5 0L2 42L0 63L-2 42Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_35" transform="translate(824 835)">
      <path d="M-6 0Q0 5 6 0L3 58L0 87L-3 58Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_36" transform="translate(971 835)">
      <path d="M-6 0Q0 5 6 0L3 38L0 57L-3 38Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_37" transform="translate(1102 835)">
      <path d="M-7 0Q0 5 7 0L3 69L0 104L-3 69Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V83" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_38" transform="translate(1182 835)">
      <path d="M-5 0Q0 4 5 0L2 49L0 74L-2 49Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
    <g id="icicle_39" transform="translate(1272 829)">
      <path d="M-7 0Q0 5 7 0L3 82L0 123L-3 82Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
      <path d="M0 5V98" stroke="#fff" stroke-width="1.3" opacity="0.7"/>
    </g>
    <g id="icicle_40" transform="translate(1342 792)">
      <path d="M-6 0Q0 5 6 0L3 52L0 78L-3 52Z" fill="url(#gpt_icicleFill)" stroke="#bdeaff" stroke-width="1.5"/>
    </g>
  </g>`,
};

const SEG_HTML: string[] = [
  `<g id="seg_00"><rect x="232" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="232" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="236" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_01"><rect x="270" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="270" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="274" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_02"><rect x="308" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="308" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="312" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_03"><rect x="346" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="346" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="350" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_04"><rect x="384" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="384" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="388" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_05"><rect x="422" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="422" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="426" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_06"><rect x="460" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="460" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="464" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_07"><rect x="498" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="498" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="502" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_08"><rect x="536" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="536" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="540" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_09"><rect x="574" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="574" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="578" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_10"><rect x="612" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="612" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="616" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_11"><rect x="650" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="650" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="654" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_12"><rect x="688" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="688" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="692" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_13"><rect x="726" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="726" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="730" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_14"><rect x="764" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="764" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="768" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_15"><rect x="802" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="802" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="806" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_16"><rect x="840" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="840" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="844" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_17"><rect x="878" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="878" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="882" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_18"><rect x="916" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="916" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="920" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_19"><rect x="954" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="954" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="958" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_20"><rect x="992" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="992" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="996" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_21"><rect x="1030" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="1030" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="1034" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_22"><rect x="1068" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="1068" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="1072" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_23"><rect x="1106" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="1106" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="1110" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_24"><rect x="1144" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35"/><rect x="1144" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5"/><rect x="1148" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`,
  `<g id="seg_25"><rect x="1144" y="556" width="26" height="76" rx="4" fill="#2fb8ff" opacity="0.35" transform="translate(38 0)"/><rect x="1182" y="556" width="0" height="76" rx="4" fill="none"/><rect x="1144" y="556" width="26" height="76" rx="4" fill="url(#kimi_segGrad)" stroke="#bfeaff" stroke-width="1.5" transform="translate(38 0)"/><rect x="1186" y="562" width="8" height="64" rx="3" fill="#ffffff" opacity="0.55"/></g>`
];

/** Injecte un fragment SVG brut (le dessin ne change jamais, seules les enveloppes animent). */
const Raw: React.FC<{ html: string; opacity?: number; transform?: string; style?: React.CSSProperties }> = ({
  html,
  opacity,
  transform,
  style,
}) => (
  <g opacity={opacity} transform={transform} style={style} dangerouslySetInnerHTML={{ __html: html }} />
);

// --- Finition du metal ------------------------------------------------------
// Le brief demande « silver / frosted metal » et « subtle metal casing ». Les rampes
// d'origine culminent vers #1b212c : a l'ecran, le chassis se lit comme un gris plat
// plutot que comme du metal. On ne redessine rien — on remplace les ARRETS de couleur
// des degrades metal, qui sont deja nommes dans le SVG.
//
// Les ids vises sont ceux du dessin : les 3 planches sources (Fable, Kimi, GPT) ont
// chacune leurs propres degrades metal, d'ou les 3 prefixes.
const METAL_RAMPS: Record<Exclude<MetalFinish, "flat">, Record<string, string[]>> = {
  // Ces ids DOIVENT etre references par un url(#...) dans les groupes du dessin.
  // Le fichier contient des gradients MORTS (vestiges du mix des 3 planches sources) :
  // les viser ne produit AUCUN effet, sans erreur ni avertissement. Verifier avant
  // d'en ajouter un :  grep -o 'url(#<id>)' ChillMeterDevice.tsx | wc -l
  // Le nombre de couleurs doit egaler le nombre de <stop> du gradient (7/4/5/4 ici).
  //
  // ⛔ Corrige le 2026-09-02 : cette table visait 5 ids gpt_*/kimi_* que le chassis
  // Fable v2 (8ba98e96) n'utilise plus — 0 reference chacun, donc les 3 compositions
  // Metal-* levaient le garde-fou au render. Les ids ci-dessous sont ceux du dessin.
  brushed: {
    machined_body: ["#68737f", "#48525c", "#39424b", "#262d35", "#39424b", "#262d35", "#171b21"],
    machined_frame: ["#68737f", "#48525c", "#39424b", "#262d35"],
    machined_plate: ["#68737f", "#48525c", "#39424b", "#262d35", "#171b21"],
    machined_btn: ["#39424b", "#262d35", "#171b21", "#0a0d11"],
  },
  // ⭐ Plage tonale ELARGIE (mesure du 2026-09-02, comparaison a etat egal contre sa
  // reference degivree) : son metal nu descend au quasi-noir dans les creux et monte
  // au blanc franc sur les aretes — ratio p95/p5 de 51-81 contre 18 chez nous. Nos
  // surfaces vivaient toutes entre L26 et L113, une bande etroite du milieu : c'est
  // ce qui les faisait lire comme un aplat vectoriel, PAS un manque de grain.
  machined: {
    machined_body: ["#9aa6b2", "#5a6672", "#3b444e", "#1c222a", "#454f5a", "#191f26", "#080a0e"],
    machined_frame: ["#a7b3bf", "#5f6b78", "#333c46", "#12171d"],
    machined_plate: ["#9aa6b2", "#57626e", "#333c46", "#1a1f27", "#090c10"],
    machined_btn: ["#4a545f", "#2b333c", "#12171d", "#05070a"],
  },
};

/** Remplace les stop-color d'un degrade nomme, dans l'ordre, sans toucher aux offsets. */
const applyRamp = (svg: string, id: string, colors: string[]): string => {
  const open = svg.indexOf(`id="${id}"`);
  if (open < 0) return svg;
  const start = svg.lastIndexOf("<", open);
  const tag = svg.slice(start + 1, svg.indexOf(" ", start));
  const close = svg.indexOf(`</${tag}>`, open);
  if (close < 0) return svg;
  let i = 0;
  const block = svg
    .slice(start, close)
    .replace(/stop-color="#[0-9a-fA-F]+"/g, (m) =>
      i < colors.length ? `stop-color="${colors[i++]}"` : m,
    );
  return svg.slice(0, start) + block + svg.slice(close);
};

/** Les gradients reellement references par un url(#id) dans les groupes du dessin.
 *  Calcule depuis G, donc toujours a jour : si un groupe cesse d'utiliser un gradient,
 *  toute tentative de le redoser echoue au lieu de ne rien faire silencieusement. */
const DRAWN_GRADIENTS: Set<string> = new Set(
  Object.values(G)
    .join("")
    .match(/url\(#([A-Za-z0-9_-]+)\)/g)
    ?.map((u) => u.slice(5, -1)) ?? [],
);

// ⛔ Les gradients sont definis dans DEUX blocs : DEFS (planches GPT/Kimi) et
// FABLE_METAL_DEFS (chassis Fable v2, ou vivent tous les machined_*). Le rendu
// concatene les deux, donc les rampes doivent operer sur la concatenation —
// sinon applyRamp ne trouve jamais un id defini dans le second bloc (bug du 02/09 :
// "machined_body introuvable dans DEFS" alors qu'il existe bien, dans l'autre bloc).
const ALL_DEFS = DEFS + FABLE_METAL_DEFS;

const metalDefs = (finish: MetalFinish): string => {
  if (finish === "flat") return ALL_DEFS;
  const ramps = METAL_RAMPS[finish];
  return Object.keys(ramps).reduce((svg, id) => {
    // Garde-fou en 2 temps. Un gradient MORT — defini dans DEFS mais jamais reference
    // par un url(#id) dans le dessin — se laisse modifier sans rien changer a l'image :
    // le rendu sort sans erreur, identique au bit pres, et le bug est invisible.
    // C'est exactement ce qui est arrive le 30/08 (6 ids morts vises, 0 pixel change).
    if (!DRAWN_GRADIENTS.has(id)) {
      throw new Error(
        `metalDefs: le gradient "${id}" n'est reference par aucun url(#${id}) du dessin. ` +
          `Le modifier n'aurait aucun effet visible.`,
      );
    }
    // Un "svg inchange" a DEUX causes possibles : le gradient est absent des DEFS
    // (vrai bug), ou la rampe redonne exactement les couleurs deja en place (cas
    // legitime : la finition "brushed" conserve volontairement la rampe d'origine).
    // Ne lever que dans le premier cas, teste explicitement.
    if (!svg.includes(`id="${id}"`)) {
      throw new Error(`metalDefs: le gradient "${id}" est introuvable dans les DEFS.`);
    }
    return applyRamp(svg, id, ramps[id]);
  }, ALL_DEFS);
};

export const ChillMeterDevice: React.FC<ChillMeterProps> = ({ chill, frost, powerOn, frame, fps, metal = "flat" }) => {
  const t = frame / fps;
  const breathe = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 2.6);
  const buttonPulse = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 1.9);

  const filled = (chill / 100) * SEGMENTS;
  const glowBoost = 0.62 + (chill / 100) * 0.38;

  return (
    <svg
      viewBox={`0 0 ${DEVICE_W} ${DEVICE_H}`}
      width={DEVICE_W}
      height={DEVICE_H}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs dangerouslySetInnerHTML={{ __html: metalDefs(metal) }} />

      {/* --- chassis : toujours visible, il EST l'objet --- */}
      <Raw html={G.chassis} />

      {/* ⛔ NOTE (2026-09-02) — NE PAS REFAIRE CE TRAJET : une couche de texture raster a ete
          testee ici en 4 dosages (multiply+overlay, overlay seul, normal, normal+soft-light).
          La technique marche (pattern + clipPath, render OK, groupes d'animation intacts) mais
          MESURE a chaque fois : le contraste local BAISSE (micro 12.7 -> 7.6..10.9) et la coque
          s'assombrit (lum 33.6 -> 21.8 au pire). Sur une surface a lum ~33/255, overlay n'a plus
          d'amplitude et multiply ne sait qu'assombrir.
          L'asset a ete supprime avec la piste. Detail + le vrai ecart (c'est le GIVRE, pas le
          metal) : memory/client-sim-tests/upwork-chill-meter/STATUS.md */}

      {/* --- ecran : s'allume avec le power, respire legerement --- */}
      <Raw html={G.ecran} opacity={0.35 + powerOn * (0.65 + breathe * 0.04)} />

      {/* --- graduation / rail du gauge --- */}
      <Raw html={G.graduation} opacity={powerOn} />
      <Raw html={G.gauge_track} opacity={powerOn * 0.9} />

      {/* --- LES 26 SEGMENTS : allumes un par un selon le niveau --- */}
      {SEG_HTML.map((html, i) => {
        const f = Math.max(0, Math.min(1, filled - i));
        if (f <= 0) return null;
        return <Raw key={i} html={html} opacity={powerOn * glowBoost * f} />;
      })}

      <Raw html={G.legende} opacity={powerOn * 0.9} />
      <Raw html={G.sous_titre} opacity={powerOn} />

      {/* --- panneau lateral + bouton vert pulse --- */}
      <Raw html={G.panneau_power} />
      <Raw html={G.bouton_power} opacity={powerOn * (0.55 + buttonPulse * 0.45)} />

      <Raw html={G.boutons_bas} opacity={0.4 + powerOn * 0.6} />

      {/* --- plaque + neon du titre --- */}
      <Raw html={G.plaque_titre} />
      <Raw html={G.titre_texte} opacity={powerOn * (0.9 + breathe * 0.1)} />

      {/* --- GIVRE : couche independante, revelee par `frost` --- */}
      {frost > 0.001 && <Raw html={G.frost_layer} opacity={Math.min(1, frost * 1.1)} />}

      {/* --- GLACONS : poussent depuis leur point d'attache --- */}
      {frost > 0.05 && (
        <Raw
          html={G.icicles}
          opacity={Math.min(1, (frost - 0.05) * 1.6)}
          style={{ transform: `scaleY(${Math.min(1, (frost - 0.05) * 1.5)})`, transformOrigin: "0 288px" }}
        />
      )}
    </svg>
  );
};

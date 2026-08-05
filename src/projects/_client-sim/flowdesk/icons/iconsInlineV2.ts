// Icônes SVG flat Flowdesk v2 — bulles RECTANGULAIRES arrondies, tailles variables
// (Fable 5, mode élevé) — inlinées en string pour usage via dangerouslySetInnerHTML,
// même pattern que iconsInline.ts. ViewBox commune "0 0 220 180" pour toutes les
// icônes v2 (contrairement à v1 qui était carrée 200x200 en bulle cercle).
// Sources : icon-*-v2.svg dans ce même dossier — ne pas éditer sans régénérer les
// deux en cohérence. Pictogrammes repris de v1 (icon-*.svg), conteneur cercle->
// rectangle arrondi, tailles de bulle variables (grande/moyenne/petite) comme
// dans la référence storyboard "ÉTAT INITIAL".

export const ICON_EMAIL_V2 = `<rect x="10" y="20" width="200" height="140" rx="34" fill="#F5EFE4"/>
  <rect x="60" y="72" width="100" height="70" rx="11" fill="none" stroke="#0B1F3A" stroke-width="8" stroke-linejoin="round"/>
  <path d="M64 78 L110 115 L156 78" fill="none" stroke="#0B1F3A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="153" cy="66" r="16" fill="#FF6B1A"/>
  <path d="M146 66 L151 71 L160 61" fill="none" stroke="#F5EFE4" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_SLACK_V2 = `<rect x="24" y="30" width="172" height="120" rx="28" fill="#F5EFE4"/>
  <g fill="#0B1F3A">
    <rect x="97" y="52" width="12" height="34" rx="6"/>
    <rect x="112" y="52" width="12" height="34" rx="6"/>
    <rect x="124" y="89" width="34" height="12" rx="6"/>
    <rect x="124" y="104" width="34" height="12" rx="6"/>
    <rect x="109" y="116" width="12" height="34" rx="6"/>
    <rect x="94" y="116" width="12" height="34" rx="6"/>
    <rect x="62" y="101" width="34" height="12" rx="6"/>
    <rect x="62" y="86" width="34" height="12" rx="6"/>
  </g>
  <g fill="#FF6B1A">
    <circle cx="103" cy="94" r="6"/>
    <circle cx="115" cy="94" r="6"/>
    <circle cx="115" cy="106" r="6"/>
    <circle cx="103" cy="106" r="6"/>
  </g>`;

export const ICON_CHAT_V2 = `<rect x="24" y="30" width="172" height="120" rx="28" fill="#F5EFE4"/>
  <path d="M56 60 h92 a11 11 0 0 1 11 11 v46 a11 11 0 0 1 -11 11 h-52 l-22 20 v-20 h-13 a11 11 0 0 1 -11 -11 v-46 a11 11 0 0 1 11 -11 z"
        fill="none" stroke="#0B1F3A" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="158" cy="54" r="16" fill="#FF6B1A"/>
  <path d="M151 54 L156 59 L166 47" fill="none" stroke="#F5EFE4" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_FLUX_V2 = `<rect x="24" y="30" width="172" height="120" rx="28" fill="#F5EFE4"/>
  <rect x="60" y="48" width="100" height="84" rx="12" fill="none" stroke="#0B1F3A" stroke-width="7.5"/>
  <path d="M84 90 h48" fill="none" stroke="#FF6B1A" stroke-width="9" stroke-linecap="round"/>
  <path d="M114 72 L138 90 L114 108" fill="none" stroke="#FF6B1A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_TABLEUR_V2 = `<rect x="10" y="20" width="200" height="140" rx="34" fill="#F5EFE4"/>
  <rect x="56" y="46" width="108" height="100" rx="10" fill="none" stroke="#0B1F3A" stroke-width="8" stroke-linejoin="round"/>
  <path d="M56 78 h108" fill="none" stroke="#0B1F3A" stroke-width="6.5"/>
  <path d="M56 110 h108" fill="none" stroke="#0B1F3A" stroke-width="6.5"/>
  <path d="M92 46 v100" fill="none" stroke="#0B1F3A" stroke-width="6.5"/>
  <path d="M128 46 v100" fill="none" stroke="#0B1F3A" stroke-width="6.5"/>
  <rect x="93" y="79" width="35" height="31" fill="#FF6B1A"/>`;

export const ICON_HR_V2 = `<rect x="50" y="42" width="120" height="96" rx="24" fill="#F5EFE4"/>
  <path d="M76 66 h68 a10 10 0 0 1 10 10 v30 a10 10 0 0 1 -10 10 h-38 l-16 14 v-14 h-14 a10 10 0 0 1 -10 -10 v-30 a10 10 0 0 1 10 -10 z"
        fill="none" stroke="#0B1F3A" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="110" y="103" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700"
        fill="#FF6B1A" text-anchor="middle" dominant-baseline="middle">RH</text>`;

export const ICON_PROFIL_V2 = `<rect x="50" y="42" width="120" height="96" rx="24" fill="#F5EFE4"/>
  <circle cx="110" cy="76" r="21" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <path d="M72 132 c0 -24 17 -38 38 -38 s38 14 38 38" fill="none" stroke="#0B1F3A" stroke-width="7" stroke-linecap="round"/>
  <circle cx="148" cy="62" r="12" fill="#FF6B1A"/>`;

export const ICON_DOCUMENT_V2 = `<rect x="10" y="20" width="200" height="140" rx="34" fill="#F5EFE4"/>
  <path d="M78 38 h42 l22 22 v78 a7 7 0 0 1 -7 7 h-57 a7 7 0 0 1 -7 -7 v-93 a7 7 0 0 1 7 -7 z"
        fill="none" stroke="#0B1F3A" stroke-width="7.5" stroke-linejoin="round"/>
  <path d="M120 38 v22 h22" fill="none" stroke="#0B1F3A" stroke-width="7.5" stroke-linejoin="round"/>
  <circle cx="92" cy="90" r="4.2" fill="#FF6B1A"/>
  <path d="M104 90 h37" fill="none" stroke="#0B1F3A" stroke-width="6" stroke-linecap="round"/>
  <circle cx="92" cy="109" r="4.2" fill="#FF6B1A"/>
  <path d="M104 109 h37" fill="none" stroke="#0B1F3A" stroke-width="6" stroke-linecap="round"/>
  <circle cx="92" cy="128" r="4.2" fill="#FF6B1A"/>
  <path d="M104 128 h25" fill="none" stroke="#0B1F3A" stroke-width="6" stroke-linecap="round"/>`;

export const ICON_QUESTION_V2 = `<rect x="50" y="42" width="120" height="96" rx="24" fill="#F5EFE4"/>
  <circle cx="110" cy="90" r="42" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <path d="M97 76 a13 13 0 1 1 20 11 c-6 3.5 -7 7 -7 13" fill="none" stroke="#FF6B1A" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="110" cy="115" r="4.6" fill="#FF6B1A"/>`;

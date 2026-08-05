// Icônes SVG flat Flowdesk (Fable 5, mode élevé) — inlinées en string pour usage
// via dangerouslySetInnerHTML dans un <symbol>/<g>, même pattern que groups/*.ts.
// Sources : icon-*.svg dans ce même dossier — ne pas éditer sans régénérer les deux en cohérence.

export const ICON_EMAIL = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <rect x="46" y="66" width="108" height="76" rx="12" fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round"/>
  <path d="M50 72 L100 112 L150 72" fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="146" cy="60" r="17" fill="#FF6B1A"/>
  <path d="M139 60 L144 65 L153 55" fill="none" stroke="#F5EFE4" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_SLACK = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <g fill="#0B1F3A">
    <rect x="86" y="42" width="14" height="40" rx="7"/>
    <rect x="104" y="42" width="14" height="40" rx="7"/>
    <rect x="118" y="86" width="40" height="14" rx="7"/>
    <rect x="118" y="104" width="40" height="14" rx="7"/>
    <rect x="100" y="118" width="14" height="40" rx="7"/>
    <rect x="82" y="118" width="14" height="40" rx="7"/>
    <rect x="42" y="100" width="40" height="14" rx="7"/>
    <rect x="42" y="82" width="40" height="14" rx="7"/>
  </g>
  <g fill="#FF6B1A">
    <circle cx="93" cy="93" r="7"/>
    <circle cx="107" cy="93" r="7"/>
    <circle cx="107" cy="107" r="7"/>
    <circle cx="93" cy="107" r="7"/>
  </g>`;

export const ICON_CHAT = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <path d="M52 62 h96 a12 12 0 0 1 12 12 v52 a12 12 0 0 1 -12 12 h-58 l-24 22 v-22 h-14 a12 12 0 0 1 -12 -12 v-52 a12 12 0 0 1 12 -12 z"
        fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="140" cy="56" r="18" fill="#FF6B1A"/>
  <path d="M132 56 L138 62 L150 48" fill="none" stroke="#F5EFE4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_FLUX = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <rect x="44" y="44" width="112" height="112" rx="14" fill="none" stroke="#0B1F3A" stroke-width="9"/>
  <path d="M72 100 h56" fill="none" stroke="#FF6B1A" stroke-width="10" stroke-linecap="round"/>
  <path d="M108 78 L136 100 L108 122" fill="none" stroke="#FF6B1A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICON_TABLEUR = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <rect x="46" y="50" width="108" height="100" rx="10" fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round"/>
  <path d="M46 82 h108" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <path d="M46 114 h108" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <path d="M82 50 v100" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <path d="M118 50 v100" fill="none" stroke="#0B1F3A" stroke-width="7"/>
  <rect x="83" y="83" width="35" height="31" fill="#FF6B1A"/>`;

export const ICON_HR = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <path d="M40 60 h120 a12 12 0 0 1 12 12 v44 a12 12 0 0 1 -12 12 h-70 l-26 24 v-24 h-24 a12 12 0 0 1 -12 -12 v-44 a12 12 0 0 1 12 -12 z"
        fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="100" y="103" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700"
        fill="#FF6B1A" text-anchor="middle" dominant-baseline="middle">RH</text>`;

export const ICON_PROFIL = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <circle cx="100" cy="76" r="30" fill="none" stroke="#0B1F3A" stroke-width="9"/>
  <path d="M48 156 c0 -34 24 -54 52 -54 s52 20 52 54" fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linecap="round"/>
  <circle cx="146" cy="60" r="16" fill="#FF6B1A"/>`;

export const ICON_DOCUMENT = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <path d="M64 40 h50 l26 26 v94 a8 8 0 0 1 -8 8 h-68 a8 8 0 0 1 -8 -8 v-112 a8 8 0 0 1 8 -8 z"
        fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round"/>
  <path d="M114 40 v26 h26" fill="none" stroke="#0B1F3A" stroke-width="9" stroke-linejoin="round"/>
  <circle cx="80" cy="98" r="5" fill="#FF6B1A"/>
  <path d="M94 98 h44" fill="none" stroke="#0B1F3A" stroke-width="7" stroke-linecap="round"/>
  <circle cx="80" cy="120" r="5" fill="#FF6B1A"/>
  <path d="M94 120 h44" fill="none" stroke="#0B1F3A" stroke-width="7" stroke-linecap="round"/>
  <circle cx="80" cy="142" r="5" fill="#FF6B1A"/>
  <path d="M94 142 h30" fill="none" stroke="#0B1F3A" stroke-width="7" stroke-linecap="round"/>`;

export const ICON_QUESTION = `<circle cx="100" cy="100" r="92" fill="#F5EFE4"/>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#0B1F3A" stroke-width="9"/>
  <path d="M82 82 a18 18 0 1 1 28 15 c-8 5 -10 10 -10 18" fill="none" stroke="#FF6B1A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="100" cy="136" r="6" fill="#FF6B1A"/>`;

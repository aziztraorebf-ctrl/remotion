// Sous-items de MECANISMEV3_MEC_INFLOW extraits individuellement pour staging/stagger V3.
// Genere par scripts/split-subitems.py.

export type MecInflowV3Item = { id: string; html: string };

export const MecInflowV3_ITEMS: MecInflowV3Item[] = [
  { id: "mec-in-0", html: `<g id="mec-in-0" transform="translate(140 340)">
    <line x1="0" y1="0" x2="640" y2="200" stroke="url(#m-trailO)" stroke-width="3"/>
    <use href="#m-ic-email"/>
  </g>` },
  { id: "mec-in-1", html: `<g id="mec-in-1" transform="translate(100 540)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="url(#m-trailO)" stroke-width="3"/>
    <use href="#m-ic-chat"/>
  </g>` },
  { id: "mec-in-2", html: `<g id="mec-in-2" transform="translate(140 760)">
    <line x1="0" y1="0" x2="640" y2="-220" stroke="url(#m-trailO)" stroke-width="3"/>
    <use href="#m-ic-doc"/>
  </g>` },
];
// GENERE — ne pas editer a la main.
// Source de verite : `assets/planche-docs.svg`, dessine par l'agent svg-dessinateur.
// Regenerer : `python3 assets/extraire-groupes.py`
//
// ⛔ Le TSX ne redessine JAMAIS ces formes : il les PILOTE. C'est la regle n°0
// (le modele dessine le statique, NOUS animons) — et l'erreur deja payee une fois
// dans ce dossier meme.

export const DEFS = ``;

export const DOC = `<path id="doc-ombre-pied" d="M6 133.6 L105 133.6 C105 134.5 104.3 135 103.4 135 L7.6 135 C6.7 135 6 134.5 6 133.6 Z" fill="#0d3847" opacity="0.16"/>
    <path id="doc-corps" d="M1.2 135 C0.5 135 0 134.5 0 133.8 L0 1.2 C0 0.5 0.5 0 1.2 0 L89 0 L111 20.6 L111 133.8 C111 134.5 110.5 135 109.8 135 L1.2 135 Z" fill="#ffffff"/>
    <path id="doc-ombre-droite" d="M99 20.6 L111 20.6 L111 133.8 C111 134.5 110.5 135 109.8 135 L99 135 Z" fill="#0d3847" opacity="0.07"/>
    <path id="doc-liseré-gauche" d="M0 1.2 C0 0.5 0.5 0 1.2 0 L5.4 0 L5.4 135 L1.2 135 C0.5 135 0 134.5 0 133.8 Z" fill="#ffffff" opacity="0.9"/>
    <path id="doc-corne-dessous" d="M111 20.6 L89 20.6 L89 0 Z" fill="#0d3847" opacity="0.13"/>
    <path id="doc-corne-rabat" d="M111 20.6 L89 20.6 L89 0 Z" fill="#ffffff"/>
    <path id="doc-corne-contour" d="M111 20.6 L89 20.6 L89 0" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <g id="doc-lignes-texte">
      <rect id="doc-ligne-1" x="18.7" y="38.5" width="73.6" height="2" rx="1" fill="#0d3847"/>
      <rect id="doc-ligne-2" x="18.7" y="50.5" width="73.6" height="2" rx="1" fill="#0d3847"/>
      <rect id="doc-ligne-3" x="18.7" y="62.5" width="73.6" height="2" rx="1" fill="#0d3847"/>
      <rect id="doc-ligne-4" x="18.7" y="74.5" width="73.6" height="2" rx="1" fill="#0d3847"/>
      <rect id="doc-ligne-5" x="18.7" y="86.5" width="73.6" height="2" rx="1" fill="#0d3847"/>
      <rect id="doc-ligne-6" x="18.7" y="98.5" width="49.1" height="2" rx="1" fill="#0d3847"/>
    </g>
    <path id="doc-contour" d="M1.2 135 C0.5 135 0 134.5 0 133.8 L0 1.2 C0 0.5 0.5 0 1.2 0 L89 0 L111 20.6 L111 133.8 C111 134.5 110.5 135 109.8 135 L1.2 135 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

export const PHOTO = `<path id="photo-cadre" d="M0.7 45.9 C0.4 45.8 0.3 45.6 0.3 45.3 L0 1 C0 0.8 0.1 0.6 0.2 0.5 C0.3 0.3 0.5 0.3 0.7 0.3 L45 0 C45.1 0 45.2 0 45.3 0.1 C45.5 0.2 45.7 0.4 45.7 0.7 L46 45 C46 45.2 45.9 45.4 45.8 45.5 C45.6 45.6 45.5 45.7 45.3 45.7 L1 46 C0.9 46 0.8 46 0.7 45.9 Z" fill="#ffffff"/>
    <path id="photo-fond" d="M4.8 4.6 L41.2 4.4 L41.4 34.4 L5 34.6 Z" fill="#30baa3"/>
    <path id="photo-ciel-haut" d="M4.8 4.6 L41.2 4.4 L41.3 13.5 L4.9 13.7 Z" fill="#ffffff" opacity="0.14"/>
    <circle id="photo-soleil-halo" cx="16.2" cy="12.7" r="7.2" fill="#faf2b5" opacity="0.3"/>
    <circle id="photo-soleil" cx="16.2" cy="12.7" r="4.7" fill="#faf2b5"/>
    <circle id="photo-soleil-contour" cx="16.2" cy="12.7" r="4.7" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="photo-montagne-arriere" d="M15 34.6 C14.8 34.4 14.6 34.1 14.7 33.6 C15.1 33 23.8 20.2 28.3 18.4 C29 18.1 29.8 18.1 30.7 18.5 C35.2 20.7 41 33 41.2 33.5 C41.4 33.9 41.2 34.3 40.6 34.5 L15.3 34.7 Z" fill="#0d3847" opacity="0.22"/>
    <path id="photo-montagne-arriere-contour" d="M15 34.6 C14.8 34.4 14.6 34.1 14.7 33.6 C15.1 33 23.8 20.2 28.3 18.4 C29 18.1 29.8 18.1 30.7 18.5 C35.2 20.7 41 33 41.2 33.5 C41.4 33.9 41.2 34.3 40.6 34.5 L15.3 34.7 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="photo-montagne-avant" d="M5.8 34.7 C5.6 34.5 5.3 34.1 5.4 33.7 C5.7 33.3 10.4 23.6 15 21.7 C16 21.3 17.3 21.5 18.9 22.3 C24.2 24.8 31.6 33 31.9 33.4 C32.2 33.8 32 34.3 31.4 34.6 L6.1 34.7 Z" fill="#faf2b5"/>
    <path id="photo-montagne-avant-flanc" d="M15 21.6 C16 21.3 17.3 21.5 18.9 22.3 C24.2 24.8 31.6 33 31.9 33.4 C32.2 33.8 32 34.3 31.4 34.6 L15.3 34.7 Z" fill="#0d3847" opacity="0.12"/>
    <path id="photo-montagne-avant-contour" d="M5.8 34.7 C5.6 34.5 5.3 34.1 5.4 33.7 C5.7 33.3 10.4 23.6 15 21.7 C16 21.3 17.3 21.5 18.9 22.3 C24.2 24.8 31.6 33 31.9 33.4 C32.2 33.8 32 34.3 31.4 34.6 L6.1 34.7 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="photo-bande-sol" d="M5 34.6 L41.4 34.4 L41.4 39.2 L5 39.4 Z" fill="#faf2b5"/>
    <path id="photo-fenetre-contour" d="M4.8 4.6 L41.2 4.4 L41.4 39.2 L5 39.4 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="photo-contour" d="M0.7 45.9 C0.4 45.8 0.3 45.6 0.3 45.3 L0 1 C0 0.8 0.1 0.6 0.2 0.5 C0.3 0.3 0.5 0.3 0.7 0.3 L45 0 C45.1 0 45.2 0 45.3 0.1 C45.5 0.2 45.7 0.4 45.7 0.7 L46 45 C46 45.2 45.9 45.4 45.8 45.5 C45.6 45.6 45.5 45.7 45.3 45.7 L1 46 C0.9 46 0.8 46 0.7 45.9 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

export const FOLDER_BACK = `<path id="folder-back-corps" d="M0.3 86 C0.1 85.6 0 85.1 0 84.5 L0 5.2 C0 2.3 2.3 0 5.2 0 L40 0 C41.7 0 43.3 0.6 44.6 1.7 L54 10.1 C55.3 11.3 56.9 11.9 58.6 11.9 L97.8 11.9 C100.7 11.9 103 14.2 103 17.1 L103 86 L0.3 86 Z" fill="#edb000"/>
    <path id="folder-back-ombre-interieure" d="M0 60 L103 60 L103 86 L0.3 86 C0.1 85.6 0 85.1 0 84.5 Z" fill="#0d3847" opacity="0.1"/>
    <path id="folder-back-liseré-languette" d="M5.2 3.2 L40 3.2 C41 3.2 41.8 3.5 42.5 4.1 L52 12.6 C53.6 14 55.9 14.8 58.6 14.8 L97.8 14.8 C99 14.8 99.8 15.9 99.8 17.1 L99.8 20.3 L96.6 20.3 L96.6 18 L58.6 18 C55 18 51.8 16.9 49.5 14.9 L40.2 6.6 L6.4 6.6 L6.4 20.3 L3.2 20.3 L3.2 5.2 C3.2 4 4 3.2 5.2 3.2 Z" fill="#ffcf00" opacity="0.75"/>
    <path id="folder-back-ombre-epaulement" d="M54 10.1 C55.3 11.3 56.9 11.9 58.6 11.9 L97.8 11.9 C100.7 11.9 103 14.2 103 17.1 L103 24 L58.6 24 C55 24 51.6 22.7 49 20.4 L44.6 16.5 Z" fill="#0d3847" opacity="0.09"/>
    <path id="folder-back-liseré-bas" d="M0 80 L103 80 L103 83 L0 83 Z" fill="#0d3847" opacity="0.07"/>
    <path id="folder-back-contour" d="M0.3 86 C0.1 85.6 0 85.1 0 84.5 L0 5.2 C0 2.3 2.3 0 5.2 0 L40 0 C41.7 0 43.3 0.6 44.6 1.7 L54 10.1 C55.3 11.3 56.9 11.9 58.6 11.9 L97.8 11.9 C100.7 11.9 103 14.2 103 17.1 L103 86 L0.3 86 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

export const FOLDER_FLAP = `<path id="folder-flap-corps" d="M0 5.2 C0 2.3 2.3 0 5.2 0 L97.8 0 C100.7 0 103 2.3 103 5.2 L103 81.8 C103 84.7 100.7 87 97.8 87 L5.2 87 C2.3 87 0 84.7 0 81.8 Z" fill="#ffcf00"/>
    <path id="folder-flap-bandeau-tete" d="M5.2 3.2 L97.8 3.2 C99 3.2 99.8 4 99.8 5.2 L99.8 17 L96.6 17 L96.6 6.4 L6.4 6.4 L6.4 17 L3.2 17 L3.2 5.2 C3.2 4 4 3.2 5.2 3.2 Z" fill="#ffffff" opacity="0.35"/>
    <path id="folder-flap-ombre-basse" d="M0 62 L103 62 L103 81.8 C103 84.7 100.7 87 97.8 87 L5.2 87 C2.3 87 0 84.7 0 81.8 Z" fill="#0d3847" opacity="0.09"/>
    <path id="folder-flap-prise" d="M42 6 L61 6 C62.7 6 64 7.3 64 9 L64 11 C64 12.7 62.7 14 61 14 L42 14 C40.3 14 39 12.7 39 11 L39 9 C39 7.3 40.3 6 42 6 Z" fill="#edb000"/>
    <path id="folder-flap-prise-contour" d="M42 6 L61 6 C62.7 6 64 7.3 64 9 L64 11 C64 12.7 62.7 14 61 14 L42 14 C40.3 14 39 12.7 39 11 L39 9 C39 7.3 40.3 6 42 6 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="folder-flap-contour" d="M0 5.2 C0 2.3 2.3 0 5.2 0 L97.8 0 C100.7 0 103 2.3 103 5.2 L103 81.8 C103 84.7 100.7 87 97.8 87 L5.2 87 C2.3 87 0 84.7 0 81.8 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

export const CURSOR = `<path id="cursor-ombre-portee" d="M22.7 35.5 C21.9 35.5 20.8 35.2 19.8 34 L11.7 24.2 L9.5 26 C8.8 26.6 8.1 26.9 7.4 26.9 C6 26.9 5 25.9 4.8 24.2 L1.5 5 C1.3 3.9 1.5 3 2.1 2.4 C2.5 1.8 3.2 1.5 4 1.5 C4.5 1.5 4.9 1.6 5.4 1.8 L23.7 8.6 C24.9 9 25.6 9.8 25.8 10.8 C26 11.7 25.5 12.7 24.5 13.5 L22.4 15.4 L30.5 25.2 C31.9 26.9 31.7 29 30 30.5 L25.1 34.5 C24.4 35.2 23.5 35.5 22.7 35.5 Z" fill="#0d3847" opacity="0.18"/>
    <path id="cursor-corps" d="M21.2 34 C20.4 34 19.3 33.7 18.3 32.5 L10.2 22.7 L8 24.5 C7.3 25.1 6.6 25.4 5.9 25.4 C4.5 25.4 3.5 24.4 3.3 22.7 L0 3.5 C-0.2 2.4 0 1.5 0.6 0.9 C1 0.3 1.7 0 2.5 0 C3 0 3.4 0.1 3.9 0.3 L22.2 7.1 C23.4 7.5 24.1 8.3 24.3 9.3 C24.5 10.2 24 11.2 23 12 L20.9 13.9 L29 23.7 C30.4 25.4 30.2 27.5 28.5 29 L23.6 33 C22.9 33.7 22 34 21.2 34 Z" fill="#ffffff"/>
    <path id="cursor-ombre-queue" d="M20.9 13.9 L29 23.7 C30.4 25.4 30.2 27.5 28.5 29 L26.8 30.4 L18.4 19.8 Z" fill="#0d3847" opacity="0.07"/>
    <path id="cursor-reflet" d="M3.4 4.6 L6.4 12.1 L4.8 12.7 L2.6 5 C2.4 4.4 2.9 4.4 3.4 4.6 Z" fill="#0d3847" opacity="0.09"/>
    <path id="cursor-contour" d="M21.2 34 C20.4 34 19.3 33.7 18.3 32.5 L10.2 22.7 L8 24.5 C7.3 25.1 6.6 25.4 5.9 25.4 C4.5 25.4 3.5 24.4 3.3 22.7 L0 3.5 C-0.2 2.4 0 1.5 0.6 0.9 C1 0.3 1.7 0 2.5 0 C3 0 3.4 0.1 3.9 0.3 L22.2 7.1 C23.4 7.5 24.1 8.3 24.3 9.3 C24.5 10.2 24 11.2 23 12 L20.9 13.9 L29 23.7 C30.4 25.4 30.2 27.5 28.5 29 L23.6 33 C22.9 33.7 22 34 21.2 34 Z" fill="none" stroke="#0d3847" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

export const LOGO = `<path id="logo-anneau" d="M20.5 0 C31.8 0 41 9.2 41 20.5 C41 31.8 31.8 41 20.5 41 C9.2 41 0 31.8 0 20.5 C0 9.2 9.2 0 20.5 0 Z M20.5 6.5 C12.8 6.5 6.5 12.8 6.5 20.5 C6.5 28.2 12.8 34.5 20.5 34.5 C28.2 34.5 34.5 28.2 34.5 20.5 C34.5 12.8 28.2 6.5 20.5 6.5 Z" fill="#0d3847" fill-rule="evenodd"/>
    <path id="logo-chevron" d="M16.6 12.4 L24.7 20.5 L16.6 28.6 L13 25 L17.5 20.5 L13 16 Z" fill="#0d3847"/>`;

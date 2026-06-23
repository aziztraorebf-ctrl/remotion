/* Arbres GGW — 4 variantes de profil (tronc + canopee etagee verts pleins), style geminiTrees.
 * Origine locale = base au sol (y=0), arbre pousse vers le haut (y negatif). rx canopee ~28-38.
 * Pour le hook "ligne d'arbres plantee" : varier la forme casse la repetition. Recolorables (encre/vert). */

// large, canopee ronde dense
export const GGW_TREE_A = `<ellipse cx="0" cy="2" rx="16" ry="4" fill="#000000" opacity="0.35"/><path d="M -3 2 C -3 -14 -6 -26 -9 -38 L -4 -38 C -1 -26 1 -14 3 2 Z" fill="#5c3a21"/><path d="M 3 2 C 3 -14 7 -26 11 -38 L 6 -38 C 3 -26 5 -14 5 2 Z" fill="#8a5a2c"/><path d="M -38 -34 C -38 -52 -16 -58 0 -58 C 16 -58 38 -52 38 -34 C 16 -28 -16 -28 -38 -34 Z" fill="#295c1c"/><path d="M -34 -37 C -34 -52 -16 -56 0 -56 C 16 -56 34 -52 34 -37 C 16 -32 -16 -32 -34 -37 Z" fill="#3e8f34"/><path d="M -26 -40 C -26 -52 -10 -55 0 -55 C 10 -55 26 -52 26 -40 C 10 -36 -10 -36 -26 -40 Z" fill="#5fc24a"/><path d="M -26 -52 C -26 -70 -10 -76 6 -76 C 22 -76 32 -70 32 -52 C 16 -46 -10 -46 -26 -52 Z" fill="#295c1c"/><path d="M -22 -55 C -22 -70 -10 -74 6 -74 C 22 -74 28 -70 28 -55 C 16 -50 -10 -50 -22 -55 Z" fill="#3e8f34"/><path d="M -15 -58 C -15 -68 -5 -71 6 -71 C 17 -71 22 -68 22 -58 C 11 -55 -5 -55 -15 -58 Z" fill="#5fc24a"/>`;

// elance, canopee haute et etroite (plus jeune)
export const GGW_TREE_B = `<ellipse cx="0" cy="2" rx="12" ry="3" fill="#000000" opacity="0.35"/><path d="M -2 2 C -2 -18 -3 -34 -4 -50 L -1 -50 C 0 -34 1 -18 2 2 Z" fill="#6b4423"/><path d="M -24 -48 C -24 -62 -10 -66 0 -66 C 10 -66 24 -62 24 -48 C 10 -44 -10 -44 -24 -48 Z" fill="#295c1c"/><path d="M -20 -50 C -20 -62 -9 -65 0 -65 C 9 -65 20 -62 20 -50 C 9 -47 -9 -47 -20 -50 Z" fill="#3e8f34"/><path d="M -20 -62 C -20 -78 -8 -84 2 -84 C 14 -84 22 -78 22 -62 C 10 -57 -8 -57 -20 -62 Z" fill="#295c1c"/><path d="M -16 -64 C -16 -78 -7 -82 2 -82 C 13 -82 18 -78 18 -64 C 9 -60 -7 -60 -16 -64 Z" fill="#3e8f34"/><path d="M -11 -67 C -11 -77 -3 -80 4 -80 C 12 -80 15 -77 15 -67 C 8 -64 -3 -64 -11 -67 Z" fill="#5fc24a"/>`;

// trapu, deux masses de feuillage (acacia du Sahel)
export const GGW_TREE_C = `<ellipse cx="0" cy="2" rx="18" ry="4" fill="#000000" opacity="0.35"/><path d="M -3 2 C -3 -10 -7 -20 -11 -30 L -6 -30 C -2 -20 0 -10 2 2 Z" fill="#5c3a21"/><path d="M 3 2 C 3 -10 8 -20 13 -30 L 8 -30 C 4 -20 5 -10 5 2 Z" fill="#8a5a2c"/><path d="M -40 -30 C -42 -42 -22 -48 -6 -46 C 14 -44 40 -46 40 -32 C 20 -26 -18 -26 -40 -30 Z" fill="#295c1c"/><path d="M -36 -32 C -38 -42 -20 -46 -6 -45 C 12 -44 36 -45 36 -33 C 18 -29 -16 -29 -36 -32 Z" fill="#3e8f34"/><path d="M -28 -34 C -28 -44 -10 -47 0 -47 C 12 -47 28 -44 28 -34 C 12 -31 -12 -31 -28 -34 Z" fill="#5fc24a"/>`;

// petit/lointain, simple touffe
export const GGW_TREE_D = `<ellipse cx="0" cy="1" rx="9" ry="2.5" fill="#000000" opacity="0.3"/><path d="M -1.5 1 C -1.5 -10 -2 -20 -2.5 -30 L -0.5 -30 C 0 -20 0.5 -10 1.5 1 Z" fill="#6b4423"/><path d="M -16 -30 C -16 -42 -7 -46 0 -46 C 7 -46 16 -42 16 -30 C 7 -27 -7 -27 -16 -30 Z" fill="#295c1c"/><path d="M -13 -32 C -13 -42 -6 -45 0 -45 C 6 -45 13 -42 13 -32 C 6 -29 -6 -29 -13 -32 Z" fill="#3e8f34"/><path d="M -9 -35 C -9 -44 -3 -47 1 -47 C 8 -47 10 -43 10 -35 C 5 -32 -3 -32 -9 -35 Z" fill="#5fc24a"/>`;

export const GGW_TREES = [GGW_TREE_A, GGW_TREE_B, GGW_TREE_C, GGW_TREE_D];

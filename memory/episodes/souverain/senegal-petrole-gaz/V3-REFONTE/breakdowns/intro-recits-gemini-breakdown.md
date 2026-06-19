```json
{
  "scene": "Senegal_Oil_Coin_Flip",
  "duree_estimee_s": 8,
  "pivot_central": {
    "objet": "Pièce 3D double face",
    "description_visuelle": "Pièce dorée. Face A: pétrole. Face B: monument.",
    "comment_anime": "Rotation Y 3D CSS. Spring easing."
  },
  "background": {
    "couleur": "#16213a",
    "texture": "Vignette radiale",
    "evolution": "Fixe"
  },
  "etapes": [
    {
      "t_relatif_s": [0, 2.5],
      "nom": "Face A Malediction",
      "ce_qui_apparait": "Pièce A + labels",
      "position": "center",
      "animation": "spring scale-up",
      "couleur": "#b23a2e",
      "texte": "FACE A 'LA MALEDICTION'"
    },
    {
      "t_relatif_s": [2.5, 4.5],
      "nom": "Flip 3D",
      "ce_qui_apparait": "Rotation + particules",
      "position": "center",
      "animation": "spring rotateY(180deg)",
      "couleur": "#e7bd78",
      "texte": ""
    },
    {
      "t_relatif_s": [4.5, 6.5],
      "nom": "Face B Miracle",
      "ce_qui_apparait": "Pièce B + labels",
      "position": "center",
      "animation": "spring fade-in",
      "couleur": "#fdfbf7",
      "texte": "FACE B 'LE MIRACLE'"
    },
    {
      "t_relatif_s": [6.5, 8.0],
      "nom": "Fissure",
      "ce_qui_apparait": "Fissure SVG + titre bas",
      "position": "center-bottom",
      "animation": "spring draw-path",
      "couleur": "#e7bd78",
      "texte": "DEUX ILLUSIONS CONSTRUITES"
    }
  ],
  "assets_a_generer": [
    {
      "quoi": "Illustrations internes pièce",
      "pourquoi_pas_codable": "Trop complexe pour SVG pur",
      "prompt_suggere": "Vector flat design, oil rig red #b23a2e on gold. Minimalist."
    }
  ],
  "ce_qui_est_codable_directement": [
    "Contour pièce CSS",
    "Textes et lignes",
    "Particules (divs)",
    "Fissure (SVG path)"
  ],
  "details_premium": [
    "Glow radial",
    "Ombre 3D",
    "Spring physics"
  ],
  "ordre_de_code": [
    "etape 1: Setup fond et vignette",
    "etape 2: Composant Pièce 3D CSS",
    "etape 3: Animation Flip Remotion",
    "etape 4: Synchro textes et lignes",
    "etape 5: Masque SVG fissure"
  ]
}
```
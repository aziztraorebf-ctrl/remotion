```json
{
  "scene": "repartition_revenus_petrole",
  "duree_estimee_s": 8,
  "pivot_central": {
    "objet": "Baril SVG",
    "description_visuelle": "Baril filaire central servant de jauge.",
    "comment_anime": "Remplissage vertical via clip-path, rebond spring."
  },
  "background": {
    "couleur": "#16213a",
    "texture": "vignette radiale",
    "evolution": "fixe"
  },
  "etapes": [
    {
      "t_relatif_s": [0, 2.5],
      "nom": "Apparition",
      "ce_qui_apparait": "Titre et baril vide",
      "position": "center",
      "animation": "spring scaleUp + fade",
      "couleur": "#e7bd78",
      "texte": "PART DES REVENUS"
    },
    {
      "t_relatif_s": [2.5, 5.5],
      "nom": "Remplissage",
      "ce_qui_apparait": "Jauges or/rouge et labels",
      "position": "center",
      "animation": "spring clip-path vertical",
      "couleur": "#e7bd78, #b23a2e",
      "texte": "60% / PART DE L'ÉTAT SÉNÉGALAIS / OPÉRATEURS ÉTRANGERS"
    },
    {
      "t_relatif_s": [5.5, 8],
      "nom": "Conclusion",
      "ce_qui_apparait": "Texte d'analyse",
      "position": "center bottom barrel",
      "animation": "spring slideUp + fade",
      "couleur": "#16213a",
      "texte": "moyenne des émergents, ni scandale ni jackpot"
    }
  ],
  "assets_a_generer": [
    {
      "quoi": "Texture métallique",
      "pourquoi_pas_codable": "Reflets 3D complexes.",
      "prompt_suggere": "Metallic oil barrel texture, navy blue, subtle rim light, flat."
    }
  ],
  "ce_qui_est_codable_directement": [
    "Structure SVG baril",
    "Clip-path remplissage",
    "Textes",
    "Glow CSS"
  ],
  "details_premium": [
    "Glow radial derrière baril",
    "Spring bounciness=1.5",
    "Typographie condensée"
  ],
  "ordre_de_code": [
    "etape 1: Setup fond et baril vide",
    "etape 2: Animer clip-path remplissage",
    "etape 3: Synchroniser textes avec spring"
  ]
}
```
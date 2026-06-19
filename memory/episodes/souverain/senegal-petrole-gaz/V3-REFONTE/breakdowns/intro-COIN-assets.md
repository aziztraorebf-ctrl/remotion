{
  "assets_a_generer": [
    {
      "quoi": "Optionnel: texture/relief photorealiste de piece d'or + tranche crantee pour le flip central",
      "pourquoi_pas_codable": "Le rendu metal realiste, micro-rayures, profondeur de tranche et reflets complexes sont longs a simuler proprement en SVG.",
      "prompt_gemini": "Gold coin cinematic asset, navy background removed, warm golden metal #e7bd78, beveled rim, ridged edge, subtle scratches, premium documentary style, centered, transparent background, no text.",
      "codable_en_svg_a_la_place": "oui: cercles concentriques, gradients radiaux, filtre noise, petites dents rectangulaires sur le bord, rotation scaleX pour simuler le flip"
    }
  ],
  "ce_qui_est_codable_directement_en_svg": [
    "Piece Face A: disque or #e7bd78, contours ivoire, halo, perles du bord en petits cercles",
    "Illustration Face A: navire + derrick rouge #b23a2e en SVG simple; pas besoin de generation, faisable avec path/rect/line ou icones Lucide stylisees",
    "Illustration Face B: monument/souverainete dore en SVG simple; pas besoin de generation, faisable avec colonnes, drapeau, silhouette abstraite ou Lucide Landmark/Flag",
    "Vagues sous le navire: 2 paths stroke ivoire/rouge",
    "Labels et filets lateraux: texte SVG/HTML Remotion + lignes",
    "Particules du flip: petits cercles/rectangles rouges/or animes",
    "Fond navy #16213a avec vignette et grain leger"
  ],
  "fissure_et_verdict": {
    "comment_coder_fissure": "SVG path noir #050505 epais, strokeLinecap='round', pathLength=1, strokeDasharray=1, strokeDashoffset anime de 1 a 0; ajouter un second path ivoire tres fin decale pour l'eclat.",
    "verdict_texte": "DEUX ILLUSIONS CONSTRUITES",
    "animation": "La fissure se trace de haut en bas sur Face B, puis petit shake de la piece, glow rouge bref, enfin verdict en ivoire avec opacity 0->1 et scale 0.96->1."
  }
}
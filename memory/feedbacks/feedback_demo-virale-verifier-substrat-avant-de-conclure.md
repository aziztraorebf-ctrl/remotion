# Une démo virale annoncée dans une techno X est souvent faite dans la nôtre — vérifier le substrat avant de conclure

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Avant de conclure qu'une demo impressionnante utilise une techno qu'on n'a pas, VERIFIER le substrat sur
des frames intermediaires (pas la frame finale). Les signatures techniques sont lisibles a l'image.

**Why:** 2026-07-25, demo virale "Opus 5 launch ad" (post X @stevibe) annoncee **"30 seconds. Pure HTML
canvas."**. J'ai d'abord raisonne sur l'impression esthetique ("un neon c'est du halo diffus, donc canvas")
et conclu qu'il nous manquait une couche. Aziz a insiste pour regarder les frames du trace : on y voit une
**pointe lumineuse qui court au bout du trait** = `strokeDashoffset` = **SVG**, pas canvas. Le substrat
etait deja le notre. L'ecart tenait a 3 FINITIONS (glow multi-couches, reflet au sol, pointe de trace),
toutes 100% SVG — reproduites a niveau le jour meme, zero API, zero WebGL.

Double lecon : (1) le mot "canvas" dans un post veut souvent dire "une page autonome", pas l'element
`<canvas>` ; (2) "HTML pur" ne veut rien dire pour de l'animation — ce qui anime c'est JS, ce qui peint
c'est canvas OU svg OU css.

**How to apply:**
- Signatures reconnaissables a l'image : pointe vive au bout d'un trait = `strokeDashoffset` (SVG) ·
  lettres/formes adressables une a une = SVG ou CSS · milliers d'elements diffus sans contour = canvas ·
  ombres portees + reflets + matiere volumetrique = WebGL.
- Extraire des frames INTERMEDIAIRES (pendant l'animation), pas la frame finale : c'est le mecanisme en
  cours d'execution qui trahit le substrat.
- Ne pas prendre pour argent comptant la techno annoncee par l'auteur d'un post, ni le nombre d'iterations
  (les demos X ne montrent jamais l'historique — ce n'est pas du "one-shot" prouve).
- Reflexe : "qu'est-ce qui nous manque VRAIMENT ?" est presque toujours une finition, pas un moteur.

Lie a [[verifier-mouvement-video-pas-juste-frames-isolees]] et
[[camera-svg-g-transform-jamais-viewbox]]. Doctrine : `MOTEURS-VISUELS-ET-SOCLE.md` § "Le SVG porte la
FORME, le canvas porte la MATIERE".

Pour tout beat GRAPHIQUE (hook, data-viz, motion design Remotion pur), ne JAMAIS coder a partir d'un storyboard JSON ecrit a la main par Claude. Ca produit du rendu "concu en 5 minutes" : courbes plates, textes perdus, effets gadget (ex: tremblement de chiffre), zero matiere graphique.

**Le bon workflow (existe deja, ne pas le court-circuiter)** — pipeline `/beat` :
1. Claude redige un PROMPT storyboard riche (concept + contraintes + palette) -> le montrer a Aziz AVANT l'appel (asset payant).
2. `scripts/tools/gemini-storyboard-panels.py --episode X --beat N --prompt-file ...` -> Gemini `IMAGE_MODEL` (Lite — un storyboard n'est jamais publie tel quel) DESSINE le storyboard visuel premium (PNG panneaux). C'est ce qui injecte le gout/raffinement qu'un JSON-squelette n'a pas.
3. Presenter le PNG a Aziz pour validation (gate bloquant).
4. `scripts/beat-breakdown.py` -> Gemini 3.1 Pro lit le storyboard valide + produit le JSON "comment coder" (tokens Tailwind, layout, valeurs exactes).
5. Claude code a partir de ce breakdown -> le rendu est premium car il suit une cible visuelle premium.
6. `beat-session.py --phase review` -> boucle review.

**Why:** Le storyboard JSON manuel decrit la MECANIQUE (timing, ordre des beats) mais pas le GOUT visuel. Gemini 3.1 Flash, entraine sur des milliers de motion designs, "voit" le rendu final premium. Sauter l'etape 2 = coder a l'aveugle sur un squelette = basique. Erreur faite sur le hook Senegal (2026-06-17), a coute 2 iterations ratees.

**How to apply:** Des qu'un beat est "graphique/data-viz/motion" et pas une simple carte Mapbox -> passer par le storyboard Gemini Flash. Le concept narratif peut etre deja choisi (ex: via [[da-brief]] jury creatif) ; Gemini Flash sert alors a le DESSINER, pas a le re-inventer. Voir aussi `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` et `scripts/beat-session.py`.

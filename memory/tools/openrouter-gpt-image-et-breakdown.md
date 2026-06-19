
## ⭐ TEST BREAKDOWN JSON Gemini vs GPT-5.5 (2026-06-19, sur storyboards scène 1 Sénégal)
**GPT-5.5 ÉCRASE Gemini au breakdown JSON technique pour coder.** Test : chaque modèle décompose SES propres
storyboards multi-planche (coin-flip + baril).
- Gemini 3.1 Pro : 2KB, 4 étapes vagues, "spring easing" sans valeurs. Correct mais minimaliste.
- GPT-5.5 : 13KB, **13 étapes** avec t_relatif à 0.5s près, `spring() damping X stiffness Y` PAR élément, z-index,
  11 items codables détaillés + 3 assets avec prompts, 10 directives premium (bevel, highlight mobile, micro-respiration).
→ **MÉTHODE OPTIMALE scène par scène** : (1) storyboard IMAGE = Gemini (concept/lisible) + GPT (matière), prendre
le meilleur ; (2) breakdown JSON = **GPT-5.5** (cahier des charges quasi-code) ; (3) assets = Gemini 3.1 Flash défaut.
⚠️ GPT via OpenRouter : surveiller crédits (erreur 402 si max_tokens trop haut vs solde). Scripts :
`storyboard-dual-gen.py` (gen image Gemini+GPT/fal) + `storyboard-breakdown-dual.py` (breakdown Gemini+GPT-5.5).


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

## ⭐ TEST GÉNÉRATION SVG (jetons carto) Gemini 3.1 Pro vs GPT-5.5 (2026-06-21)
**Les DEUX génèrent du SVG animé propre EN UN SEUL APPEL pour N jetons** (JSON `{tokens:{...}}`, animation par `f`=frame
via expressions inline `{...}`, syntaxe JSX exacte). Test : 5 jetons (gas/oil/sonar/export/reserve) dans le registre Souverain.
- **GPT-5.5 = préféré** (plus riche/narratif : derrick complet, matière+ombres, cuve à niveau). Choix d'Aziz.
- Gemini 3.1 Pro = plus épuré/iconographique (radar, flux divergents élégants). Bon aussi.
→ Comme le breakdown : lancer les 2 en parallèle et piocher le meilleur par jeton. Script : `scripts/tools/llm-gen-svg.py
--provider gpt|gemini`. Le LLM ne dessine QUE le contenu intérieur (centré 0,0, rayon 40) ; cadre+ancrage = TokenFrame côté code.
Doctrine jetons : `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`.

## ⭐ 3 RAFFINEMENTS DU BREAKDOWN GPT-5.5 (prouvés 2026-06-20, workflow data-viz) — à EXIGER dans le prompt
Le breakdown GPT-5.5 est excellent MAIS, par défaut, il : (1) donne le placement en PIXELS d'une vignette (faux
hors cadre réel), (2) ESTIME les tailles à l'œil (sous-dimensionne — picto noté 8.5% alors que la cible faisait
17%, 2× trop petit), (3) sur-interprète les effets ("3D" → cartoon). **Le prompt de breakdown DOIT exiger :**
- **Placement en classes TAILWIND** (`absolute left-[48%] top-[45%] -translate-x-1/2 w-[40%]`), pas en px.
- **Tailles MESURÉES** en % du cadre (largeur ET hauteur), en regardant l'image — pas estimées.
- **Intensité CALIBRÉE "juste assez"** (ex "extrusion subtile ~8% de la hauteur, pas de biseau cartoon").
- **Verdict GÉNÉRÉ/REMOTION/HYBRIDE par élément** + prompt d'asset prêt + intention en prose.
Prompt de référence prêt : `memory/doctrines/templates/PROMPT-BREAKDOWN-DATAVIZ.txt`. GPT-5.5 sert AUSSI à faire
le **DIFF cible-vs-render** (planche A|B → écarts mesurés + corrections Tailwind, 1 passe) :
`templates/PROMPT-DIFF-CIBLE-RENDER.txt`. Pipeline complet : [[WORKFLOW-DATAVIZ]].

## ⛔⛔ GOTCHA — GPT Image 2 peut répondre en TEXTE au lieu d'une image (2026-08-14)

Sur un prompt de storyboard formulé "TASK: Show 2-3 panels..." (verbe qui invite à décrire plutôt qu'à
générer), GPT Image 2 via `openrouter-img2img.py` a répondu par une description narrative en prose
(très détaillée et de bonne qualité conceptuelle, mais ZÉRO image produite) — sans erreur HTTP, le
script "réussit" silencieusement en écrivant seulement un `.response.json` de dump, pas de `.png`.
**Fix** : formuler la tâche en forçant explicitement la sortie image, ex. "TASK: GENERATE AN IMAGE
(not a text description) — render the panels directly as pixels... Output the image now." **Garde-fou
obligatoire** : après tout appel storyboard/breakdown visuel, vérifier qu'un fichier `.png` réel existe
sur disque (pas seulement un `.response.json`) avant de considérer l'appel réussi — même logique que
"un agent qui rapporte terminé n'a pas forcément produit le fichier", mais au niveau d'un appel API
individuel plutôt que d'un agent.

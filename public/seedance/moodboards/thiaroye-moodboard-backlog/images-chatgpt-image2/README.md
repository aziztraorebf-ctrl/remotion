# Images ChatGPT Image 2 — test comparatif

**Date** : 2026-04-23
**Source** : generees par Aziz sur ChatGPT web avec modele Image 2 (frais sorti)
**Prompts** : identiques aux prompts Gemini v2 (voir `../scripts/regen-thiaroye-moodboard-v2.py`)
**Refs fournis** : identiques (style-ref-thiaroye-camp.png + char-ref-tirailleur.png)

## Images recues (dans la conversation Claude, pas sauvegardees en fichiers)

1. **Somme course** — profil strict, palette plombee. Personnage OK, arriere-plan textures illustration editoriale.
2. **Mere village** — palette ocre chaude. Drift BD le plus visible des 3 (toit de chaume strie, boubou peint, baobab texture complexe).
3. **Provence baiser** — palette vive. Personnages premier plan OK, MAIS figurants arriere-plan en style semi-realiste BD.

## Analyse complete
Voir `memory/tools/chatgpt-image2-vs-gemini.md` — benchmark complet, pattern identifie, cas d'usage.

## Pour retrouver les images si besoin
Aziz peut regenerer via ChatGPT web avec les prompts dans `../scripts/` et les refs dans `../style-refs/`. Les generations sont reproductibles a ~80% (ChatGPT varie image-a-image meme avec meme prompt).

Alternative : demander a Aziz de re-uploader les images s'il les a sauvegardees.

## Decision sur les images

Pas sauvegardees en local car :
- Le test etait exploratoire (backlog)
- L'analyse qualitative a ete faite et memorisee (`chatgpt-image2-vs-gemini.md`)
- Les images Gemini v2 restent nos references paper-craft canoniques

Si besoin futur de comparaison directe cote-a-cote avec fichiers, regenerer via ChatGPT + uploader dans ce dossier.

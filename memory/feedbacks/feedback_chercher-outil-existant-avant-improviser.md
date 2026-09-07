# Chercher l'outil existant AVANT d'improviser (script ad hoc OU diagnostic environnement)

**Fusion 2026-07-11 de 2 feedbacks** (même leçon abstraite — "un outil dédié existe déjà dans le repo,
le chercher avant d'improviser ou de suspecter l'environnement" — appliquée à 2 contextes concrets
différents) : `feedback_chercher-outil-existant-avant-script-ad-hoc` (2026-07-02, génération SVG) +
`feedback_render-mapbox-webgl-chercher-script-dedie` (2026-07-10, render Mapbox WebGL).

## Cas 1 — Script de génération SVG (2026-07-02)

Avant d'écrire un script ad hoc pour tester une génération SVG/image via un LLM, chercher d'abord un outil de
production existant dans `scripts/tools/` qui fait déjà cette tâche avec le bon format de sortie.

Session 2026-07-02 : pour comparer Gemini vs GPT sur la génération d'une scène SVG, un script ad hoc
(`_test-scene3-gemini-gpt.py`) a été écrit avec une sortie texte libre — alors qu'un outil de production
existait déjà : `scripts/tools/svg-scene-narrative.py`, avec sortie JSON structurée (`scene_svg`/`groups`/
`notes`), SVG réellement éditable avec `<g id>` nommés pour l'animation. Aziz a corrigé explicitement : « il
existe des scripts dédiés spécifiquement aux deux modèles qui permettent de générer des images SVG directement,
c'est ce que nous devons utiliser ». Le refaire avec le bon outil a produit un résultat COMPARABLE et
EXPLOITABLE (vrai SVG, pas juste une description) — et le résultat de comparaison Gemini/GPT s'est même
inversé par rapport à ce que le script ad hoc suggérait, ce qui montre que la méthode de test change le
résultat, pas seulement sa forme.

**How to apply** : Avant d'écrire tout script Python pour une tâche de génération SVG, image, ou breakdown via
LLM dans ce projet, faire `ls scripts/tools/*.py` ou `grep` sur le nom de la tâche AVANT de coder — le projet a
une bibliothèque riche d'outils dédiés (`svg-scene-narrative.py`, `svg-scene-libre.py`, `svg-personnage-gen.py`,
`gemini-storyboard-panels.py`, etc.). Si l'outil existe mais ne couvre pas exactement le besoin (ex: mauvais
ratio d'image), l'ÉTENDRE avec un flag rétrocompatible plutôt que d'en écrire un nouveau à côté — c'est ce qui
a été fait pour `svg-scene-narrative.py` (ajout `--ratio 16:9`, défaut 9:16 inchangé).

## Cas 2 — Render Mapbox WebGL (2026-07-10)

`npx remotion render <CompoMapbox>` échoue systématiquement en local avec `Error: Failed to
initialize WebGL` — même sur une composition Mapbox connue-fonctionnelle non touchée par la
session en cours, même après avoir nettoyé des processus Chrome headless zombies. Ce n'est PAS
un problème d'environnement/GPU à diagnostiquer : c'est l'usage du mauvais chemin de render.

Le fix connu existe déjà : `./scripts/render-mapbox.sh <CompositionId> <output.mp4>`. Il utilise
`chrome-headless-shell` (pas Chrome for Testing) + `--gl=angle` + `--public-dir` allégé (symlinks
vers les sous-dossiers utiles, évite de copier ~2.3GB de `public/` à chaque render). Documenté
2026-07-04 dans `key-learnings.md:563` — leçon déjà écrite mais pas retrouvée avant de tâtonner
sur l'hypothèse GPU/zombies pendant ~30 min (session Soudan Acte 3, 2026-07-10).

**Ce qui ne marche JAMAIS pour Mapbox** : `npx remotion render` direct (WebGL fail) ET
`scripts/tools/render-on-vercel.py` (Vercel Sandbox ne supporte PAS WebGL/Mapbox du tout —
confirmé `memory/episodes/warmap-sahel/PLAN-ASSEMBLAGE-FINAL.md:41`). Vercel est réservé aux
compositions non-Mapbox (SVG/Tailwind/DOM pur).

**Why** : Aziz a rendu les Actes 1 et 2 (même moteur `SoudanWarMapEngine`) plusieurs fois sans
problème dans la même session-projet — la preuve que le render local marche normalement était
déjà disponible (fichiers .mp4 sur disque avec timestamp récent), pas la peine de suspecter
l'environnement système avant d'avoir vérifié quel outil a produit ces renders précédents.

**How to apply** : Dès qu'une erreur `Failed to initialize WebGL` apparaît sur une composition
Mapbox (n'importe laquelle, pas juste celle en cours d'édition) → chercher IMMÉDIATEMENT
`render-mapbox.sh` ou grep `"Failed to initialize WebGL"` dans `memory/` AVANT toute
investigation GPU/process/environnement.

## La leçon commune (pourquoi ces 2 cas sont le même réflexe)

Dans les deux cas, la réaction fautive a été de repartir de zéro (écrire un script neuf ; suspecter
l'environnement/GPU) au lieu de chercher d'abord si un outil dédié existe déjà dans le repo pour cette
tâche précise. Le projet a une bibliothèque riche (`scripts/tools/`, `scripts/render-mapbox.sh`, etc.) —
improviser à côté ou diagnostiquer à l'aveugle coûte du temps ET peut changer le résultat lui-même (cas 1 :
le score Gemini/GPT s'est inversé selon l'outil utilisé).

**Réflexe à appliquer systématiquement** : avant d'écrire un script ad hoc OU de partir sur une hypothèse
d'environnement (GPU, process zombie, config système) → `ls scripts/tools/*.py`, `ls scripts/*.sh`, ou
`grep` sur le symptôme/la tâche dans `memory/` et `scripts/` EN PREMIER. Si l'outil existe mais ne couvre
pas exactement le besoin, l'ÉTENDRE avec un flag rétrocompatible plutôt que d'en écrire un nouveau à côté.


## Cas 3 — Chercher NOTRE HISTORIQUE, pas seulement nos scripts (2026-09-07)

⭐ **Extension de la même leçon à un cran au-dessus** : les cas 1 et 2 disent « cherche l'OUTIL
existant ». Celui-ci dit **« cherche la MÉTHODE déjà éprouvée »** — la doctrine, le gabarit, le
diagnostic déjà posé, même quand aucun script ne porte le nom du problème.

Session 2026-09-07 : pour animer une image avec MiniMax H3 via Comfy Cloud, j'ai tâtonné sur des
IDs de nodes, échoué 2 fois (le template gardait son image de démo, sortie 640×640 au lieu du 16:9
demandé), puis commencé à sonder le catalogue de nodes à l'aveugle. **Aziz a dû m'arrêter** :
« pourquoi ne pas lancer un agent pour aller voir comment on a fait ? Ce n'est pas la première fois
qu'on crée des vidéos avec nos images. »

Un agent de reverse engineering a trouvé en une passe que **le bug était documenté chez nous depuis
le 11 août** (`memory/tools/minimax-h3-comfy-cloud.md` ligne 246, section « CAUSE RACINE TROUVÉE ET
CORRIGÉE »), avec le symptôme EXACT, et qu'un **gabarit fonctionnel dormait dans le repo**
(`scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json`). Il a marché du premier coup.

**Pourquoi le protocole existant n'a pas suffi** : la règle du CLAUDE.md déclenche la délégation à
« 2+ échecs sur le même problème technique ». Ici le déclencheur aurait dû être **antérieur** — dès
l'instant où je m'apprêtais à explorer un outil que le projet a DÉJÀ utilisé des dizaines de fois.
Je n'avais pas encore échoué ; j'allais échouer.

**How to apply** : avant d'explorer un outil/une API que le projet utilise déjà (H3, Comfy, Gemini,
Mapbox, PixelLab…), **ouvrir sa fiche `memory/tools/<outil>.md` AVANT le premier appel**, pas après
le 2e échec. Chercher en particulier les sections « CAUSE RACINE », « ⛔ », « gabarit », « ne pas
utiliser X ». Corollaire : un `ls scripts/tools/comfy-graphs/` ou `ls scripts/tools/ | grep <outil>`
coûte 2 secondes et peut faire gagner une heure. Voisin de
[[registre-visuel-briques-existantes-non-consultees-avant-code]] (même angle mort, appliqué au code)
et de [[capacite-modele-supposee-verifier-le-catalogue]].

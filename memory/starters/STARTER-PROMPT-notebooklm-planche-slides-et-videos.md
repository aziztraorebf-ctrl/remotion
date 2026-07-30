# STARTER — NotebookLM : la planche de slides (idéation) + les vidéos en source

> ✅ **VOLET 1 ACCOMPLI le 2026-07-30 — la preuve de concept « slide NotebookLM → scène SVG animée »
> est FAITE et RÉUSSIE.** Livrable : `RND-PiliersGouffre` (`src/projects/_rnd/svg-scenes/
> PiliersGouffre16x9.tsx` + `PiliersGouffreBodies.ts`, commit `4f35233b`), 390 frames, aucun gel.
> Tous les acquis de ce test (fallback dans le brief · balayage vs fondu · mesurer le clip dans le
> SVG · le « rends et regarde » à exiger) sont gravés dans
> **`memory/tools/notebooklm-boucle-short.md` § SECOND USAGE** — ne pas les rechercher ici.
> ⛔ La scène est destinée au **GAZODUC**, pas au CFA (épisode clos, décision d'Aziz).
>
> **CE QUI RESTE OUVERT, et pourquoi ce starter existe encore** : les DEUX volets ci-dessous,
> décidés le 2026-07-30 et **jamais commencés**.

## ⭐ LA SUITE — ce que ce test débloque vraiment

Si le concept tient, la boucle NotebookLM gagne un **second usage**, en plus de la condensation
long→short déjà documentée (`memory/tools/notebooklm-boucle-short.md`) :

> **Générer une PLANCHE DE SLIDES pour idéer des scènes, en amont du code.**

Intérêt : NotebookLM ne connaît **rien** de notre arsenal. Il ne sait pas qu'on aime les cartes
D3 et les stick figures — il propose donc des formes qu'on n'aurait pas cherchées. C'est le
remède au biais du catalogue (partir de nos 71 composants au lieu de partir de l'intention).
Et ça déplace le jugement de goût AVANT le code, comme le storyboard l'a fait.

⚠️ **DEUX PIÈGES à tenir :**
1. **Ça inverse INTENTION → FORME → TEMPLATE.** Feuilleter des slides, c'est partir de la forme.
   **Garde-fou : écrire en UNE phrase ce que la scène doit faire ressentir AVANT d'ouvrir les
   images.** Sinon on choisit la plus jolie, pas la plus juste.
2. **Taux de déchet élevé** (cf. les 2 slides du jour : une bonne, une décorative).

**Candidat n°1 pour ce second usage : le GAZODUC Nigeria-Maroc-Europe** (sujet GO, non commencé,
`memory/projects/GAZODUC-MEGAPROJETS-SUJET.md`). C'est le piège de la carte : le réflexe sera de
tout poser sur une carte, alors que le sujet est fait d'abstractions (financement, délais,
dépendance, rapport de force) — exactement là où une carte échoue et où une scène-objet gagne.

## 🎥 AZIZ APPORTERA DES VIDÉOS À NOTEBOOKLM (décidé le 2026-07-30)

Second volet de la même session future. Aziz va **donner des vidéos en source à NotebookLM**
pour qu'il les examine, et en tirer :
- le **pacing** (où ça coupe, combien de temps une idée est tenue, comment ça ouvre et referme)
- **la manière dont la vidéo est faite** (structure, enchaînement, montage)
- **le script** — à adapter ou non à notre façon de faire
- **l'usage des visuels**, pour voir ce qui se transpose chez nous

Le but reste **la version courte** : nourrir la boucle long→short avec des références externes,
et non plus seulement avec nos propres scripts.

⭐ **Ce que ça change par rapport à la boucle documentée** : jusqu'ici on lui donnait NOTRE
script long et on observait comment il le condensait. Là on lui donne une **vidéo tierce** —
donc on n'observe plus sa condensation de nous, mais **sa lecture d'un objet qui marche déjà**.
Deux usages distincts à ne pas confondre.

⚠️ **Rappels qui s'appliquent quand même** (cf. `memory/tools/notebooklm-boucle-short.md`) :
- Transcript = **API OpenAI Whisper**, jamais le binaire local · **forcer la langue source**
  (en auto il traduit littéralement et fabrique des non-sens sur les noms propres).
- ⛔ Ne jamais reprendre un chiffre ou un nom propre depuis un transcript sans revérifier.
- On garde la STRUCTURE, on jette l'exécution — même règle que pour les slides.
- ⛔ Ne pas lui demander un avis écrit sur le pacing : **ça se juge en le voyant**.

📌 **À faire au démarrage de la session** : demander à Aziz QUELLES vidéos il veut soumettre
(les siennes ? des références tierces ? un mélange ?) — la réponse change ce qu'on cherche.

## Piste annexe notée le même jour (NON testée)

**La scène de marché + cadenas.** Un décor de marché organique généré par modèle, sur lequel
**arrive** un cadenas pendant que le fond s'assombrit. L'intérêt : ça fait entrer l'abstraction
dans le concret (le marché = le réel, le cadenas = le système qui se pose dessus) — ce que le
beat 5a peine à faire. ⚠️ Ça ne marche QUE parce que le cadenas ARRIVE sur une scène installée ;
un marché seul en fond joli = décor inerte, cf. la hiérarchie **absence > participant > inerte**
(`memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`).

# STARTER — PREUVE DE CONCEPT : une slide NotebookLM → une scène SVG animée

> **Décidé par Aziz le 2026-07-30, à faire dans une SESSION FUTURE.** Pas fait dans la session
> d'origine (l'épisode CFA venait d'être promu, on ne devait rien construire).

## L'objectif — lire cette ligne avant tout

⛔ **Ce n'est PAS pour intégrer la scène dans la vidéo CFA.** L'épisode est **terminé et promu**
(`out/PRET-PUBLICATION/franc-cfa-midform-FINAL.mp4`). Aziz, mot pour mot :

> « Pas parce que j'ai envie de l'intégrer dans la vidéo mais parce que **j'ai envie de prouver
> le concept en tant que tel**. »

**La question à laquelle ce test répond** : est-ce qu'une trouvaille visuelle proposée par
NotebookLM (sous forme de slide statique) se transpose en scène SVG animée dans NOTRE registre ?
Si oui, ça ouvre une nouvelle façon d'idéer des scènes — voir § LA SUITE.

Le livrable est un **rendu qu'on regarde**, pas un composant à brancher quelque part.

## La référence

**`public/_shared/refs/notebooklm-slides/cfa-3-piliers-gouffre.png`** — « The Sira Chasm ».

Trois piliers enjambent un gouffre, portant un tablier commun :
1. Solid Central Bank Institutions · 2. Massive Foreign & Gold Reserves · 3. Absolute Market Trust
Les socles sont **déjà fissurés**. En bas : « Hyperinflation & Economic Collapse ».

**Pourquoi cette slide et pas une autre** — elle résout une traduction qu'on butait à faire.
Le script disait une ÉNUMÉRATION (« il faut une banque centrale solide, des réserves, de la
confiance »). Elle en fait un OBJET UNIQUE qui dit quatre choses sans une phrase de plus :
- ce sont des **supports**, pas des ingrédients — s'ils cèdent, quelque chose tombe
- ils portent un **tablier commun** → ils sont solidaires, pas indépendants
- le **gouffre** dessous = l'hyperinflation, et il est déjà là
- les **fissures** disent que c'est fragile MAINTENANT, pas dans l'abstrait

C'est notre critère maison : une seule métaphore, lisible en 2 s, qui encaisse 3 idées sans
convention supplémentaire à décoder. Même famille que le filet sous le funambule.

## ⛔ Le contre-exemple, à garder sous les yeux

**`cfa-balance-contre-exemple.png`** (slide 15, « The Next Choice ») — une balance **à
l'équilibre**, sous un texte qui dit justement qu'on ne sait pas de quel côté ça penchera.
L'image **contredit** le propos au lieu de le porter, et le texte la recouvre. Décoratif.

⭐ **La leçon des deux slides ensemble** : ce qui vaut dans une planche NotebookLM, c'est la
**trouvaille de traduction**, jamais l'exécution. Il y en a environ **une par lot**, pas une par
slide. S'attendre à jeter la majorité.

## Ce qu'il faut prouver (et ce qui ne compte pas)

**Compte** : que l'objet TIENNE une fois animé, dans notre registre encre/nuit. L'animation
naturelle est déjà écrite dans l'image — les piliers se dressent un par un pendant que la voix
les nomme, le tablier se pose, les fissures s'ouvrent en dernier. Le gouffre était là depuis le
début.

**Ne compte pas** : reproduire la slide au pixel. Ses codes ne sont pas les nôtres (typo serif
blanche sur anthracite, icônes bleu/or, texte en anglais). On prend la STRUCTURE, on la met dans
notre palette (`#182746`, encre `#f0e8d2`, or `#d9a93a`, cuivre `#c17e3a`).

## Méthode (nos règles, déjà éprouvées)

- **Fable 5 en agent Claude Code, mode élevé** — modèle SVG par défaut, zéro appel API.
  Voir `memory/doctrines/SVG-SCENES-GENERATIVES.md`.
- **Partage à 3 étages** : le modèle dessine le DÉCOR (les piliers, le gouffre, le tablier) ·
  NOUS animons. ⛔ Ne pas lui demander de dessiner ET d'animer — mesuré : 939 lignes d'animation
  pour 459 de matière, et un décor pauvre.
- **Variable unique** : composant neuf sous `_rnd/`, aucun beat de production touché.
- ⭐ **RENDRE ET REGARDER** avant de conclure quoi que ce soit. Une frame full HD (`scale=1`)
  suffit pour juger — les renders en `scale` réduit sont flous et font douter à tort.

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

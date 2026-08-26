# LOTTIE — ce qui passe, ce qui casse (répondre à un brief en 30 secondes)

> Établi le **2026-08-25**, enrichi le **2026-08-26** (dégradés portés · animation prouvée ·
> MCP Creator), par MESURE sur 8 fichiers réels (4 objets de `svg-library`,
> 2 scènes complètes de registres opposés), rendu comparé pixel par pixel au SVG d'origine
> dans Chromium via `lottie-web`.
> Outils : `src/projects/_client-sim/lottie-ui/tools/` — `svg2lottie_scene.py --rapport`
> répond automatiquement pour un fichier donné.
>
> ⛔ **Ne PAS répondre à un brief de mémoire : passer le SVG au rapport.** Cette page dit
> ce qu'on sait faire ; le rapport dit ce que fait CE fichier-là.

---

## La réponse en une ligne

**On sait livrer du Lottie standard depuis notre chaîne SVG, sans After Effects — à condition
que la scène soit faite de FORMES et de COULEURS PLEINES.** Dès qu'elle repose sur du texte,
des dégradés, des filtres ou des images, une partie ne traverse pas.

---

## Table de décision

| Élément du brief | Verdict | Ce qu'on répond au client |
|---|---|---|
| Formes vectorielles, courbes, icônes, logos | ✅ **oui** | exact au pixel |
| Aplats de couleur, contours, épaisseurs, arrondis | ✅ **oui** | — |
| Transformations (position, échelle, rotation, inclinaison) | ✅ **oui** | aplaties dans la géométrie |
| Calques séparés, manipulables un par un | ✅ **oui** | ⚠️ dépend du nommage, voir plus bas |
| **Texte** | ⛔ **non, tel quel** | à **vectoriser** (le texte devient des formes, non éditable) ou à déclarer une police |
| **Dégradés** (linéaires ET radiaux) | ✅ **oui** — ⭐ **porté le 2026-08-26** | `gf` natif avec l'opacité de chaque arrêt. Aéroport : **57,74 % → 11,58 %**. ⚠️ Le rayon radial reste une approximation (Lottie n'a qu'un rayon scalaire) — formule choisie **par mesure**, pas par la spec |
| **Flou, ombre portée, lueur** (`filter`) | ⛔ **non** | à refaire autrement (formes empilées) ou à retirer du brief |
| **Masques, détourage** (`mask`, `clipPath`) | ⛔ **non** | à pré-appliquer à la géométrie en amont |
| **Images / photos** (raster) | ⛔ **non** | Lottie sait embarquer en base64, mais le poids explose — déconseillé |
| Symboles réutilisés (`use`, `symbol`) | ⛔ **non** | à aplatir avant conversion (faisable, coût en amont) |
| Motifs de remplissage (`pattern`) | ⛔ **non** | sans équivalent |
| Animation déjà dans le SVG (SMIL) | ⛔ **non** | normal : **l'animation vient de notre code**, c'est notre méthode |
| **Personnages articulés** | ⛔ **non** | pas une limite du format — un métier différent (rigging) |

---

## Les 3 murs, mesurés

### 1. Courbes — ✅ franchi
Grammaire SVG complète + primitives (`circle`, `ellipse`, `rect` arrondi, `line`, `polygon`).
Cubiques et quadratiques **exactes** (1e-14), arcs sous **5e-04 px** de R=5 à R=2000.
⚠️ Nos assets ne sont pas faits que de `<path>` : `soleil-radiant-ggw.svg` contient **zéro path**
(4 cercles + 12 lignes). Un convertisseur qui ignore les primitives en sort un fichier **vide
sans erreur**.

### 2. Poids — ✅ non bloquant, le seuil visait le mauvais fichier
| Fichier | SVG source | `.json` | **`.lottie` (livré)** |
|---|---|---|---|
| Scène illustrative 509 chemins | 435 Ko | 687 Ko (×1,58) | **166 Ko** |
| Scène UI 260 calques | 51 Ko | 324 Ko (×6,32) | **17 Ko** |

Le `.json` gonfle (Lottie écrit `[[x,y]]` là où SVG écrit `C x y x y x y`), mais **le livrable
est le `.lottie` compressé**, qui retombe sous la source. 65 % du poids = les coordonnées :
irréductible, c'est le dessin.
💡 Levier si besoin : arrondir à **2 décimales** = **−15 %** de poids pour +0,03 pt d'écart
visuel (0,08 % → 0,11 %). À 1 décimale ça se dégrade (0,59 %). Non appliqué par défaut.

### 3. Structure — ⚠️ **le vrai mur, et il ne dépend pas de nous**
Le nombre de calques n'est pas le problème : **509 et 260 passent sans peine**. Le problème est
le **NOMMAGE**, car c'est lui qui sépare un livrable pro d'un fichier illisible dans Creator.

| Source du SVG | Noms de calques | Livrable |
|---|---|---|
| **Fable / SVG structuré** (ids imposés) | `letter_s_1`, `hex_outline` | ✅ idéal |
| **Notre `svg-library`** (ids sur les `<g>`) | `feves-1..5`, `moitie-gauche-1` | ✅ bon (hérité du groupe) |
| **Chill-meter** (ids sur les formes) | `icicle_40-1`, `chassis-2` | ✅ bon |
| **Recraft** (aucun id, aucun `<g>`) | `path-248`, `path-509` | ⛔ **illisible** |

⭐ **Conséquence commerciale** : si un brief exige des calques manipulables, la question n'est pas
« sait-on convertir ? » mais **« d'où vient le SVG ? »**. Un export Recraft brut ne donnera jamais
un livrable nommé — il faut passer par notre chaîne (Fable/SVG structuré) ou nommer en amont.

---

## Le cas qui prouve que le rapport est fiable

`chill-meter-mix.svg` → **32,74 % de pixels divergents**. Tout le texte, les icônes et les
dégradés d'écran manquent. **Le rapport l'avait annoncé avant tout rendu** (30 refus : 13 `text`,
12 `use`, 5 filtres ; 102 dégradés approximés).

C'est la validation de la méthode : on peut répondre à un brief **sans rendre**, en passant le
SVG au rapport. Ce cas est figé dans `test_rendu.py` — si l'écart devenait faible **sans** que
les refus disparaissent, c'est le rapport qui mentirait.

---

## ⛔ Ce que la session a coûté, à ne pas refaire

**Un `.json` valide peut rendre faux.** Deux bugs sont passés à travers 36 tests de géométrie
ET un rapport qui annonçait « transportable à l'identique » :
1. **Contours réduits de moitié** — dans un calque Lottie, le **premier groupe est peint en
   dernier** ; le remplissage recouvrait l'intérieur du trait (5 px → 2 px).
2. **`filter`/`clip-path`/`mask` sont surtout des ATTRIBUTS**, pas des balises — un flou
   disparaissait en silence.

→ **Ne jamais conclure sur le rapport seul.** `compare_render.py` rend les deux dans Chromium
et mesure l'écart : c'est la seule preuve.

⚠️ **Et se méfier de sa propre mesure** : 4 mesures successives ont accusé un code **juste**, et
une 5e a déclaré « exact » un code **faux** (erreur mesurée au seul point milieu de l'arc, là où
elle s'annule par construction). Les pièges sont documentés en tête de `test_svgpath.py`.

---

## ⭐⭐ NOS PROPRES SCÈNES (Gazoduc, Soudan) — testé le 2026-08-25

**Oui, elles sont convertibles** — mais elles ne sont pas des fichiers `.svg` : ce sont des
composants React qui CALCULENT leur SVG à chaque frame (`interpolate`, `spring`).
Outil : **`tools/extract-remotion-svg.mjs`** — extrait le SVG réel et RÉSOLU d'une composition
Remotion à une frame donnée (prouvé : un rect passe de `width=40` à `width=133.6` selon la frame).

```bash
node src/projects/_client-sim/lottie-ui/tools/extract-remotion-svg.mjs \
     D3-Gazoduc-Acte5-Maison --frame 200 -o maison.svg
```
⚠️ Les IDs de composition ne sont PAS les noms de fichiers (`D3-Gazoduc-Acte5-Maison`, pas
`GazoducActe5Maison`) — les lire dans `src/Root.tsx`.
⛔ Le Studio Remotion ne sert à rien ici : le chemin d'URL y est **décoratif** (état client, pas
une route), et en navigateur headless il ne rend rien du tout. L'outil passe par `renderStill()`
avec sa propre instance Puppeteer — c'est Remotion qui monte la scène, on lit son DOM.

| Scène | Formes | SVG extrait vs render Remotion | Lottie vs SVG | Verdict |
|---|---|---|---|---|
| **Hook Or du Darfour** (Soudan) | 72 | 0,05 % | **0,01 %** | ✅ **livrable tel quel** |
| **Maison + courbe** (Gazoduc A5) | 25 | 0,12 % | **1,44 %** | ✅ bon — l'aire sous la courbe perd son fondu (aplat), le fond son halo (masque refusé) |
| **Aéroport nuit** (Gazoduc A3) | 498 | 6,89 % | **57,74 %** | ⛔ **change d'ambiance** |

⛔⛔ **L'AÉROPORT EST LE CAS QUI TRANCHE — et la cause n'est PAS l'extraction** (fidèle à 6,89 %).
Sur ses 17 dégradés, **11 sont RADIAUX** : le halo du projecteur, la lueur de la lune, les
auréoles des lampes. Rabattus en couleur unie, le cône de lumière devient un **aplat beige
opaque**, la lune un **disque plat**, le ciel des **bandes franches**. Géométrie intacte,
**atmosphère détruite** — un client refuserait.
⚠️ Un rapport d'agent qualifiait cet écart de « structurellement mineur » : **c'est faux**, et
seule la planche de comparaison le montre. Encore la règle CODE + VISUEL.

⭐ **CE QUE ÇA DIT DU CHANTIER SUIVANT** : le vrai frein pour NOS scènes n'est ni l'extraction ni
les courbes — ce sont **les dégradés, radiaux en premier**. C'est ce qui sépare « un client
refuserait » de « livrable tel quel ». Lottie SAIT les faire (`gf`, type 2 pour radial) : c'est
notre convertisseur qui ne les porte pas.

⛔ **L'ANIMATION N'EST PAS PORTÉE.** Chaque extraction est une frame FIGÉE — les `interpolate`
sont cuits dans les coordonnées. Extraire 2-3 frames clés (début/milieu/fin) documente le
mouvement voulu ; **l'animation Lottie reste à écrire par nous**. Ce qui est cohérent avec notre
méthode habituelle (le statique d'abord, nous animons), mais ce n'est PAS un bouton
« Acte 5 → Lottie animé ».

---

## Ce qui reste ouvert (au 2026-08-26)

### ✅ Fermé depuis la v1
- **Dégradés** — portés (`gf`, linéaires et radiaux, opacité comprise). Aéroport 57,74 → 11,58 %.
- **Animation** — prouvée dans les deux registres : par transformation (apparaître, tracer) ET
  **par recalcul de forme** (`transcribe_animation.py` : la flamme du Gazoduc vit, 78 px/frame
  mesurés contre 98 à l'original). ⛔ Limite dure : un chemin dont le **nombre de sommets varie**
  n'est pas interpolable par Lottie — le script refuse au lieu de produire faux.
- **Validation dans Creator** — faite par Aziz les 25 et 26/08 : l'animation joue, les calques
  sont nommés, il a pu sélectionner et déplacer un élément.
- **Calques illisibles** — `group_layers.py` (Soudan : 71 calques → 8 groupes nommés).

### ⏭️ Ouvert
1. ⭐ **TEXTE — le bloqueur le plus fréquent : 83 scènes sur 172.** Le MCP Creator expose
   6 outils dédiés (`create_text`, `set_text_style`, `split_text`, `measure_text_units`,
   `list_fonts`) → même méthode que pour les dégradés : poser dans Creator, lire la structure,
   la porter dans le convertisseur.
2. ⭐ **ANIMER UNE SCÈNE DENSE.** Tout est prouvé sur 24 calques (maison) et 8 groupes (Soudan) ;
   **jamais sur 498** (aéroport). C'est le pas qui reste — sans animation qui joue, une scène
   convertie ne sert à rien (formulation d'Aziz, 26/08).
3. **Grouper l'aéroport** avant toute livraison : 498 calques nommés `path-248` sont illisibles
   pour un client, même si techniquement valides sur le web.
4. ❓ **ANIMATION INTERACTIVE — à vérifier, pas un acquis.** Le MCP expose `add_state_machine`,
   `add_input`, `add_pointer_interaction`, `add_transition` : Lottie semble savoir faire des
   animations pilotées par l'utilisateur (clic, survol, état). **NON TESTÉ.** Enjeu réel : ça
   séparerait « animation qui joue » de « composant interactif », et ouvrirait le pilier UI.
5. **Masques et filtres** — refusés. Le flou gaussien sur les nuages de l'aéroport est le seul
   refus restant sur cette scène.
6. **Le test After Effects** (essai 7 jours) — indépendant, cf. `STATUS.md` § 4 bis.

### ⚠️ Ce que le client contrôle, et ce qu'il ne contrôle pas
- **Il PEUT modifier l'animation** : ouvrir le fichier dans Creator ou After Effects, déplacer
  les keyframes, changer les couleurs. C'est l'intérêt du format, et c'est vérifié.
- **Il ne la contrôle PAS à la lecture** : un Lottie standard joue comme il a été fabriqué.
  (Sauf peut-être avec les state machines — cf. point 4, non testé.)

### ⚠️ Combien de calques peut-on livrer ?
Pas de norme universelle — ça dépend de la cible :
| Cible | Verdict |
|---|---|
| Site web, présentation | 498 calques : aucun problème technique |
| Écran embarqué, app mobile | rédhibitoire (le brief LCD exigeait « limited layers and keyframes ») |
| Client qui veut modifier | **illisible sans regroupement**, quel que soit le nombre |

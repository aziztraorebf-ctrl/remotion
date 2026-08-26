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
que la scène soit faite de FORMES et de COULEURS PLEINES.** Le texte, les dégradés et les
pointillés passent désormais ; les filtres, masques et images ne traversent toujours pas.

---

## ⛔⛔ LE TROU DE VÉRIFICATION — à savoir avant de citer un chiffre de cette page

Toutes nos mesures comparent **une image FIXE à une image FIXE**. Le **2026-08-26, TROIS fois**, un
fichier était valide, l'outillage disait OK, et le rendu était **FAUX** : pointillés ignorés en
silence · animations perdues au regroupement (`check_animation.py` disait « ça bouge ») · fondu en
marches d'escalier. **À chaque fois, seul l'OEIL l'a vu** — c'est la même cause qui a laissé passer
une courbe **FIGÉE pendant deux jours**.
→ Manque outillé : comparer la **VIDÉO** d'origine au Lottie **image par image**. Chantier n°1.
⚠️ En attendant : **`compare_render.py` est la seule preuve** ; `check_animation.py` dit « ça
bouge » même quand l'histoire est détruite.

---

## ⛔⛔ CE QUI PASSE TECHNIQUEMENT ≠ CE QUI SE VEND (Aziz, 2026-08-26)

**Une carte géographique complète n'est PAS un livrable Lottie.** Personne ne commande ça — et le
format le dit lui-même : **Creator ouvre en 512×512**, une scène 1920×1080 déborde de partout.
Coût de la leçon : **une journée** passée à finir la carte du Gazoduc Acte 4 en la croyant vendable.

⭐ **Le registre qui vaut** : dashboards et UI, logos, icônes, schémas, objets isolés, et les scènes
qui **racontent avec des objets qui bougent** (jetons, chars, bannières, une ligne qui se déforme,
du texte en situation — pas 100 % du texte).

⛔ **Prouver une capacité ≠ produire un livrable.** Avant de finir une pièce, deux questions
SÉPARÉES : « qu'est-ce que ça prouve ? » (→ s'arrêter dès que c'est mesuré, ne pas polir) et
« est-ce que quelqu'un commanderait ça ? » (→ alors polir vaut le coup).
Détail : [[feedback_prouver-une-capacite-nest-pas-produire-un-livrable]]

---

## Table de décision

| Élément du brief | Verdict | Ce qu'on répond au client |
|---|---|---|
| Formes vectorielles, courbes, icônes, logos | ✅ **oui** | exact au pixel |
| Aplats de couleur, contours, épaisseurs, arrondis | ✅ **oui** | — |
| Transformations (position, échelle, rotation, inclinaison) | ✅ **oui** | aplaties dans la géométrie |
| Calques séparés, manipulables un par un | ✅ **oui** | ⚠️ dépend du nommage, voir plus bas |
| **Texte** | ✅ **oui** — ⭐ **porté le 2026-08-26**, DEUX voies | **vectorisé** (défaut) : glyphes en courbes, fidèle partout, non éditable · **natif** (`--texte natif`) : calque `ty:5` éditable par le client, mais le rendu dépend de la police **chez le lecteur**. Voir le tableau des risques plus bas |
| **Dégradés** (linéaires ET radiaux) | ✅ **oui** — ⭐ **porté le 2026-08-26** | `gf` natif avec l'opacité de chaque arrêt. Aéroport : **57,74 % → 11,58 %**. ⚠️ Le rayon radial reste une approximation (Lottie n'a qu'un rayon scalaire) — formule choisie **par mesure**, pas par la spec |
| **Flou, ombre portée, lueur** (`filter`) | ⛔ **non** | à refaire autrement (formes empilées) ou à retirer du brief |
| **Masques, détourage** (`mask`, `clipPath`) | ⛔ **non** | à pré-appliquer à la géométrie en amont |
| **Images / photos** (raster) | ⛔ **non** | Lottie sait embarquer en base64, mais le poids explose — déconseillé |
| Symboles réutilisés (`use`, `symbol`) | ⛔ **non** | à aplatir avant conversion (faisable, coût en amont) |
| Motifs de remplissage (`pattern`) | ⛔ **non** | sans équivalent |
| **Pointillés** (`stroke-dasharray`) | ✅ **oui** — ⭐ **porté le 2026-08-26** | mesuré à **0,07 %** (2 valeurs) et **0,10 %** (4 valeurs). ⚠️ Le motif peut être **déphasé** (Chromium et lottie-web ne démarrent pas au même point d'un cercle) : même nombre, même espacement, départ différent. ⛔ C'était **ignoré en silence** avant — enjeu narratif réel : un tracé « projet prévu » ressortait plein, donc « construit » |
| Animation déjà dans le SVG (SMIL) | ⛔ **non** | normal : **l'animation vient de notre code**, c'est notre méthode |
| **Personnages articulés** | ⛔ **non** | pas une limite du format — un métier différent (rigging) |

---

## ⭐⭐⭐ LE TEXTE — deux voies, et le choix n'est pas technique (2026-08-26)

**83 scènes sur 172 contiennent du texte.** C'était le refus le plus fréquent ; il est levé.
Deux voies coexistent, `--texte vectorise` (défaut) et `--texte natif`.

### Ce que la MESURE dit (sonde 960×540, Georgia + Arial, 5 textes, accents ÉÈÀÇÙ)

| Voie | police présente chez le lecteur | police **ABSENTE** | poids | client peut éditer ? |
|---|---|---|---|---|
| **vectorisé** (défaut) | **1,95 %** | **1,95 %** (indifférent) | 107 Ko | ⛔ non |
| **natif** (`ty:5`) | **0,05 %** | ⛔ **5,74 %** | **3 Ko** | ✅ oui |
| *(rien porté, l'état d'avant)* | *4,76 %* | *4,76 %* | — | — |

⛔⛔ **LE CHIFFRE QUI TRANCHE** : sans la police, le natif fait **PIRE que ne rien porter du
tout** (5,74 % contre 4,76 %). Le texte reste lisible mais **toute la mise en page glisse** —
un titre plus étroit, des libellés qui se décalent. Sur une scène où un mot doit s'aligner
avec un point de carte ou une barre de graphique, **c'est cassé**.

⚠️ **Et le 1,95 % du vectorisé n'est PAS un décalage** : après érosion 3×3 il tombe à
**0,010 %**, et le centre de gravité de l'encre est identique à **0,02 px** près. C'est
l'antialiasing d'un glyphe en courbes contre un glyphe rendu par le moteur de texte —
invisible à l'oeil. Le vectorisé est **fidèle**.

### Ce qu'on répond au client

> « Deux livraisons possibles. Soit le texte est **converti en formes** : identique partout,
> sur n'importe quel appareil, mais figé — changer un mot demande de repasser par nous.
> Soit il reste **du vrai texte éditable** : vous changez les mots vous-même dans Creator ou
> After Effects, à condition que la police soit installée chez celui qui regarde — sinon la
> mise en page se décale. Pour un livrable public, je recommande les formes. Pour un gabarit
> que vous déclinez vous-même, le texte éditable. »

⭐ **Le natif est un choix d'ÉDITABILITÉ, pas de qualité** — et un choix de RISQUE.

### ⛔ Le fait qui pèse sur nos propres scènes
Nos scènes écrivent en **Georgia (412 usages)**, Arial, Cinzel, Arial Black, IBM Plex Mono.
**Aucune de ces familles n'est parmi les 17 que Creator embarque** (relevé par `list_fonts` :
Inter, Roboto, Merriweather, Poppins, Space Grotesk…). Donc pour NOS scènes, la voie native
part perdante par défaut : **vectoriser**, sauf si le client fournit et installe la police.

### Ce que le portage a réglé au passage
- **Accents français** : ÉÈÀÇÙ portés (testés). NO-EMOJIS ≠ NO-ACCENTS.
- **Les trois ancrages** `start` / `middle` / `end` placés au bon endroit (la baseline SVG est
  la baseline, pas le haut du bloc — les confondre décale d'une hauteur de capitale).
- **Le gras dans un `.ttc`** : macOS range 6 graisses d'Helvetica dans UN fichier ; ouvrir sans
  préciser l'index prenait toujours le Regular et rendait **tous les titres en maigre**
  (2,69 % → 2,05 % une fois corrigé). Fichier valide, rapport content, titre faux :
  **encore la même famille de piège** — l'élément est correct, son aiguillage l'annule.
- **`font-family` sur un `<g>` parent** : hérité désormais (c'est l'usage le plus courant).
- Un glyphe absent de la police, un `<text>` vide, des `<tspan>` fusionnés : **signalés**.

### Effet mesuré sur le cas témoin
`chill-meter-mix` : **32,74 % → 28,05 %**, et les **13 refus `<text>` ont disparu** du rapport
(30 refus → 17). C'est la condition du garde-fou : l'écart ne baisse **qu'accompagné** de la
disparition des refus correspondants.

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
1. ✅ **TEXTE — FERMÉ le 2026-08-26** (voir la section dédiée plus haut). Les deux voies sont
   portées et mesurées ; 17 tests dans `test_texte.py`. Méthode suivie à l'identique de celle
   des dégradés : poser dans Creator via le MCP, lire la structure (`read_scene` +
   `measure_text_units` donnent la baseline, les avances par glyphe, `line_height` = taille par
   défaut, justification 2 = centre), la porter dans le convertisseur, MESURER.
   ⏭️ **Reste ouvert sur le texte** : les `<tspan>` repositionnés individuellement (x/y/dy
   propres) sont fusionnés en une ligne — signalé, pas porté. Et le **contour** d'un texte
   (`stroke` sur un `<text>`) n'est pas rendu en vectorisé (le glyphe devient une surface).
2. ✅ **ANIMER UNE SCÈNE DENSE — FERMÉ le 2026-08-26** sur le **Gazoduc Acte 4 « Objectifs »**,
   108 éléments d'une vraie composition Remotion. Chaîne complète mesurée à chaque maillon :
   `extract-remotion-svg.mjs` → `svg2lottie_scene.py` (112 portés) → `group_layers.py`
   (108 calques → **5 groupes nommés**, rendu **identique** : 1,33 % avant comme après) →
   `animate_scene.py` (partition `gazoduc-a4`) → `check_animation.py` (**7/7 frames
   distinctes**, planche regardée).
   ⛔ **Les bornes ne s'inventent pas** : recopiées du composant Remotion d'origine, où chaque
   repère porte le mot de la voix off qui le déclenche. La cascade pays par pays raconte
   « le projet traverse trois pays » ; trois pays allumés ensemble ne racontent rien.
   ⚠️ **Piège de mesure évité** : le taux de pixels encrés reste à ~46 % du début à la fin —
   ce n'est PAS une scène figée. Les pays **changent de couleur** sur un fond déjà encré, ils
   n'ajoutent pas de surface. La mesure d'encre seule aurait fait conclure à tort ; **la
   planche l'a montré**.
   ⏭️ **Reste** : l'aéroport (498 calques) n'a toujours pas de carte de regroupement.
3. ✅ **POINTILLÉS — FERMÉ le 2026-08-26** (découverts à l'oeil le jour même : ils étaient
   **ignorés en silence**). Portés et mesurés (0,07-0,10 %).
   ⛔⛔ **LA LEÇON, transposable bien au-delà des pointillés** : dans le tableau `d` d'un trait,
   le champ **`nm` n'est PAS décoratif** — lottie-web en fait une **clé d'objet**
   (`Object.defineProperty(dashOb, shape.d[i].nm, …)`, `lottie.js` v5.13 l.15497). Deux `nm`
   identiques → `Cannot redefine property`, **jetée en asynchrone** dans `initExpressions` :
   le player **fige**, `DOMLoaded` n'arrive jamais, et il n'y a **ni erreur console ni
   pageerror**. Un `nm` absent ne sauve pas (clé `"undefined"`, dupliquée pareil). Le rendu ne
   lit que `n` et `v`. → `nm` **présent et unique** (`dash 1` / `gap 1` / `dash 2`…).
   Symptôme côté outil : `compare_render.py` part en `TimeoutError`.
4. **Grouper l'aéroport** avant toute livraison : 498 calques nommés `path-248` sont illisibles
   pour un client, même si techniquement valides sur le web.
5. ❓ **ANIMATION INTERACTIVE — à vérifier, pas un acquis.** Le MCP expose `add_state_machine`,
   `add_input`, `add_pointer_interaction`, `add_transition` : Lottie semble savoir faire des
   animations pilotées par l'utilisateur (clic, survol, état). **NON TESTÉ.** Enjeu réel : ça
   séparerait « animation qui joue » de « composant interactif », et ouvrirait le pilier UI.
6. **Masques et filtres** — refusés. Le flou gaussien sur les nuages de l'aéroport est le seul
   refus restant sur cette scène.
7. **Le test After Effects** (essai 7 jours) — indépendant, cf. `STATUS.md` § 4 bis.

### ⚠️ Ce que le client contrôle, et ce qu'il ne contrôle pas
- **Il PEUT modifier l'animation** : ouvrir le fichier dans Creator ou After Effects, déplacer
  les keyframes, changer les couleurs. C'est l'intérêt du format, et c'est vérifié.
- **Il ne la contrôle PAS à la lecture** : un Lottie standard joue comme il a été fabriqué.
  (Sauf peut-être avec les state machines — cf. point 5, non testé.)

### ⚠️ Combien de calques peut-on livrer ?
Pas de norme universelle — ça dépend de la cible :
| Cible | Verdict |
|---|---|
| Site web, présentation | 498 calques : aucun problème technique |
| Écran embarqué, app mobile | rédhibitoire (le brief LCD exigeait « limited layers and keyframes ») |
| Client qui veut modifier | **illisible sans regroupement**, quel que soit le nombre |

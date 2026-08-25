# LOTTIE — ce qui passe, ce qui casse (répondre à un brief en 30 secondes)

> Établi le **2026-08-25** par MESURE sur 6 fichiers réels (4 objets de `svg-library`,
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
| **Dégradés** | 🟡 **pas encore** | Lottie **sait** les faire — notre convertisseur les rabat sur une couleur moyenne. Chantier identifié, pas une impossibilité |
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

## Ce qui reste ouvert

- **Dégradés** — le format les gère (`gf`), notre convertisseur non. Demande de porter aussi
  leur système de coordonnées (`userSpaceOnUse` vs `objectBoundingBox`) et leurs transforms.
  ⛔ **À ne faire que si un brief le paie** (règle du chantier : pas de générique en spéculation).
- **Validation dans LottieFiles Creator** — les 260 calques nommés n'ont **pas** été ouverts
  dans l'outil officiel. Testé seulement sur la pièce LCD (3 calques) le 2026-08-24.
- **Animation d'une scène** — tout ceci convertit du **statique**. Animer 260 calques depuis
  notre code n'a pas été éprouvé.
- **Le test After Effects** (essai 7 jours) — indépendant, cf. `STATUS.md` § 4 bis.

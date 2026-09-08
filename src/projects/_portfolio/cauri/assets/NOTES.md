> ⭐ **Cette copie est la SOURCE VERSIONNEE.** `out/` est gitignore dans ce repo (0 fichier
> versionne depuis `out/` sur tout l'historique) : la copie de travail
> `out/_r-and-d/cauri/coquille/` garde les rendus et references jetables
> (planche-echelles.png, compare-ref-vs-mien.png, photos), mais elle peut disparaitre.
> Le SVG, son generateur et ces notes vivent ICI et sont importes par le TSX de la piece.

# Coquille de cauri — notes de production

> Livrable : `coquille.svg` · générateur rejouable : `gen-coquille.py` ·
> preuve d'échelle : `planche-echelles.png` (produite par `gen-planche.py`).
> Références mesurées : `annulus.jpg`, `moneta.jpg` (Wikimedia Commons, photos H. Zell),
> zoom de la fente : `fente_zoom.png`.

---

## 1. Le seuil de masquage (la réponse la plus utile pour la suite)

**Masquer `<g id="fente">` sous 18 px de LARGEUR DE COQUILLE à l'écran.**

| Largeur | Ce que la fente apporte | Décision |
|---|---|---|
| ≥ 26 px | les dents se comptent une à une | fente visible |
| 22-18 px | dents fondues, mais croissant sombre net qui donne l'asymétrie | fente visible |
| 15 px | la fente s'épaissit en coin et commence à dominer la forme | limite |
| ≤ 12 px | **tache** : la coquille lit comme un point bicolore sali | **fente masquée** |

Rapporté aux 5 rôles du brief : la fente reste visible pour **l'objet précieux (240 px)** et
**le point du semis (34 px)** ; elle doit être **masquée** pour la **brique de colonne (14 px)**,
le **débris (12 px)** et le **grain du flux (10 px)**.

⚠️ Ce seuil est un **jugement à l'œil sur la bande 3 de la planche** (zoom ×9, NEAREST), pas
une sortie de script — et c'est important : j'ai écrit **deux** contrôles automatiques qui
répondaient tous les deux « fente lisible » jusqu'à 10 px inclus.
- Le premier comptait les pixels de différence entre le rendu avec et sans fente : à 10 px la
  fente atteint son score **maximum** (23,3 % de la coquille). Un compte de pixels mesure la
  **présence**, jamais la **lisibilité**.
- Le second mesurait l'ondulation de largeur (« les dents sont-elles séparables ? ») : sous
  18 px il mesure l'antialiasing, pas des dents.

C'est une ré-application directe d'une leçon déjà en mémoire (*« sous ~20 px la mesure par
masque n'est pas fiable : zoomer et trancher à l'œil »*, balançoire du 02/09). Le générateur
n'imprime donc plus de verdict automatique : il serait faux.

---

## 2. Réponses aux 3 questions du brief

**1. À 10 px, la silhouette lit-elle encore comme une forme voulue ?**
Oui. Elle reste un **ovoïde nettement asymétrique** — plus étroit et plus haut au sommet,
plus large et aplati vers la base — et non un point rond. C'est visible sur la ligne « sans
fente » de la bande 3. La forme survit parce qu'elle repose sur le **rapport h/w 1,32** et sur
une base tronquée à 47 % de la largeur max, deux propriétés d'ensemble qui ne dépendent
d'aucun détail fin.

**2. À 10 px, la fente ajoute-t-elle du bruit ?**
Oui, franchement. Voir le tableau du § 1 : à 10-12 px elle est un bloc sombre qui occupe plus
d'un cinquième de la coquille et détruit la lecture de la silhouette. **Seuil : 18 px.**

**3. À 240 px, la silhouette SANS la fente lit-elle comme un cauri ou comme un galet ?**
**Comme un galet.** C'est net sur la bande 3 (96 px sans fente) et c'est le point qui justifie
toute la structure en deux calques : à grande taille la fente est *indispensable* à la
reconnaissance, à petite taille elle est *nuisible*. Le dessin ne peut donc pas avoir un niveau
de détail unique — d'où le calque détachable.

---

## 3. Teintes retenues et pourquoi

| Rôle | Teinte | Justification |
|---|---|---|
| Fond océan | `#0E2A44` | bleu profond, désaturé et sombre. Assez foncé pour que la nacre tranche à 10 px (c'est la seule chose qui rend le grain visible à cette taille), assez bleu pour ne pas lire « gris ardoise ». **Rien à voir avec le bleu électrique TED-Ed**, qui est clair et saturé. |
| Nacre | `#F2E8D5` | relevée sur la référence (moyenne mesurée `#E0D6C4`, teintes fréquentes `#E7E0D0`/`#E8DFCE`). Remontée en clarté — la référence est une photo, pas un aplat graphique — en conservant le biais chaud R>G>B qui signe la nacre. Blanc crème chaud, comme demandé. |
| Fente | `#8A5A2B` | brun-ambre. Sur la vraie coquille l'ouverture est brun sombre à ambré (visible sur `fente_zoom.png`). Plus sombre **et plus chaude** que la nacre, donc elle se détache sans devenir un trou noir — un noir pur lirait comme un défaut de dessin, pas comme une ouverture. |

**3 teintes au total**, aplats purs, conformément au brief. Zéro dégradé, zéro ombre portée,
zéro `<filter>`, zéro `<text>`, zéro `stroke`.

---

## 4. Morphologie — ce que la mesure a corrigé au brief

⚠️ **Écart au brief, assumé et documenté** : le brief annonçait un contour « plus large que
haut, rapport largeur/hauteur autour de 1,4:1 ». **Les deux références mesurées disent
l'inverse** : en vue ventrale la coquille est **plus HAUTE que large** — h/w = 1,18 (*moneta*)
et 1,35 (*annulus*). J'ai retenu **1,32**. Une coquille à 1,4:1 couchée aurait été un autre
objet ; c'est le genre d'erreur de registre qu'aucune itération de détail ne rattrape.

Le reste du brief est confirmé par la mesure et suivi :
- contour **asymétrique**, largeur max à t=0,40-0,48 de la hauteur ;
- sommet étroit et arrondi, **base tronquée** à 47 % de la largeur max ;
- fente **décentrée** (axe à x=0,58 de la largeur, donc vers la droite), **arquée**
  (0,50 → 0,63 → 0,51), et **s'évasant vers le bas** (demi-ouverture ×3,6 du haut au bas) ;
- **12 dents** mesurées sur la lèvre droite (le brief prévoyait 10-14).

⭐ **Une correction de morphologie que seule la photo donne** : les deux lèvres ne sont **pas**
symétriques et ne s'engrènent pas comme une fermeture éclair. Sur la référence, la lèvre droite
porte des **bosses arrondies franches** qui mordent dans la fente, la gauche est nettement plus
lisse. Le dessin reproduit cette asymétrie (`PROF_DENT_D = 0,42` contre `PROF_DENT_G = 0,30`,
en opposition de phase) — c'est elle qui distingue une vraie fente de cauri d'une boutonnière
dentelée générique.

---

## 5. Structure du fichier

```
<g id="fond">          rect #0E2A44 — retirable, présent pour juger sur le vrai fond
<g id="cauri" transform="translate(80 100)">
   <g id="silhouette">  1 path — le contour, TOUJOURS visible
   <g id="fente">       1 path — le détail signature, MASQUABLE
```

- `silhouette` et `fente` sont des `<g id>` de **premier niveau** sous `cauri`, **sans aucun
  transform de placement à l'intérieur** : le transform vit sur `cauri`, conformément à la
  règle acquise sur la planche onboarding.
- **La fente est POSÉE PAR-DESSUS la silhouette pleine, elle n'y découpe rien** (pas de mask,
  pas d'`evenodd` traversant les deux groupes). Retirer `fente` laisse donc une silhouette
  complète et fermée, sans aucun artefact — l'exigence du brief est structurelle, pas obtenue
  par réglage.
- 7 ids uniques, tous nommés par fonction, sans accent ni majuscule.
- Contour = **un seul chemin continu** (arc du sommet → flanc droit → arc de base → flanc
  gauche). Aucun raccord à rater, donc aucun raccord raté.

**Contrôles exécutés à chaque génération** (dans `gen-coquille.py`, ils bloquent la sortie) :
`verifier_confinement()` — aucun point du path de la fente ne sort du contour (marge minimale
mesurée : **16,13 u** sur 100 de large) — et `verifier()` — ids uniques, aucun élément interdit,
aucun dégradé. Le garde-fou de confinement a été **testé en le faisant échouer** volontairement
(fente allongée, puis élargie ×2,6) : il crie dans les deux cas.

---

## 6. Ce que j'ai dû corriger au rendu (aucun de ces défauts n'était visible dans le code)

1. **Contour en escalier** — interpolation smoothstep entre paires de points : continue en
   valeur, **dérivée discontinue à chaque nœud**. Échantillonner plus finement n'y change rien,
   on échantillonne la même courbe cassée. → spline Catmull-Rom.
2. **Base en coupe franche** puis **sommet en plateau à deux angles** — je fermais le contour
   par une **corde droite**. Les deux bouts de la coquille sont des **arcs**.
3. **Épaule au sommet**, puis **tourelle en tétine** — j'ai voulu coller une calotte elliptique
   et la *fondre* avec le profil. Deux courbes qui n'ont ni la même valeur ni la même pente au
   raccord ne se raccordent pas par un fondu. → supprimer la jonction : le sommet devient des
   **points de contrôle de la même spline**. (3e application de « un raccord qui résiste ne
   devrait pas exister ».)
4. **Flèche du sommet choisie à l'estime** (0,55) → tourelle. La flèche qui prolonge exactement
   les flancs vaut **0,099**, soit 5,5× moins. Elle se **calcule** à partir de la pente du
   contour au raccord ; elle ne se devine pas. Elle est désormais dérivée en code.
5. **Fente tronçonnée par ses propres dents** — profondeur de dent donnée en fraction de la
   largeur de la coquille : en haut, où la fente est étroite, la dent était plus profonde que la
   demi-ouverture. → profondeur **relative à l'ouverture locale**.
6. **Fente débordant sous la coquille** — en l'élargissant, son arc de bout (demi-cercle) a
   grandi avec elle et pendait sous la base. → arcs de bout **surbaissés** + le contrôle de
   confinement qui rend le défaut impossible à re-livrer.

⭐ Le défaut n°6 est le seul qui violait une exigence explicite du brief, et je ne l'ai pas vu
au premier regard sur le rendu à 480 px : c'est le **contrôle écrit après coup** qui l'a
chiffré (le bout atteignait ts=1,040, soit 4 % sous la base).

---

## 7. Limites et points à trancher en aval

- **Le contour est une polyligne** (220 points par flanc), pas des courbes de Bézier. C'est sans
  conséquence visuelle (vérifié au rendu jusqu'à 1000 px de large) et le fichier reste léger
  (14 Ko), mais si l'aval veut un **morphing de path**, il faudra régénérer en Bézier. Le brief
  ayant abandonné le morph (R1), ce n'est pas bloquant.
- **Aucune variante de rotation n'est fournie** : les 260 exemplaires seront tous la même forme.
  Si le semis paraît mécanique au rendu animé, la réponse est une **légère rotation par
  exemplaire côté code** (la forme est dessinée autour de (0,0), donc `rotate()` sur le groupe
  suffit), pas un nouveau dessin.
- **Le fond `#0E2A44` est fourni pour juger**, pas comme décision de composition : les états 5-6
  du brief demandent un fond rouge-brun. Le groupe `fond` est isolé pour être remplacé.
- **Palette « ocre » (terre d'arrivée) non utilisée ici** : elle n'intervient pas sur la coquille
  elle-même.

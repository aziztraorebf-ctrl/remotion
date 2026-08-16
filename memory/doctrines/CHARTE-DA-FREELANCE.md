# CHARTE DE DIRECTION ARTISTIQUE — cut vente freelance

> **Posée 2026-08-15**, à l'issue du benchmark de 3 références Fiverr. Périmètre : **la showcase
> (index interne + cut vente) et les livrables client freelance**. ⛔ Ne remplace pas la
> [CHARTE-EDITORIALE-SOUVERAIN](CHARTE-EDITORIALE-SOUVERAIN.md) — celle-ci est **éditoriale**
> (positionnement analyste, méchant, sources, titres) et reste seule autorité sur la chaîne YouTube.
> Les deux coexistent : l'une dit *ce qu'on raconte*, celle-ci dit *à quoi ça ressemble*.
>
> **Pourquoi elle existe** : le benchmark a conclu qu'**aucune des 3 références ne repose sur une
> technique absente du repo**. Ce qui les distingue est une discipline de DA. Le chaînon manquant
> n'était donc pas une brique à coder — c'était ce document.
> ⛔ **Aucun composant neuf n'est requis pour appliquer cette charte.**
> Analyse source : [`memory/projects/SHOWCASE-CAPACITES.md`](../projects/SHOWCASE-CAPACITES.md)
> § Benchmark ÉLARGI. Frames : `public/_shared/refs/benchmark-fiverr/`.

---

## Règle zéro — la charte est une CONTRAINTE, pas un menu

Une charte ne sert que si elle **interdit**. Si un plan a besoin d'une 5e couleur ou d'une 2e typo,
la réponse par défaut est **non** : on résout le besoin par la valeur (clair/sombre), la taille ou
l'espace. Une exception ne se prend pas en codant — elle s'écrit dans § Exceptions accordées.

C'est exactement ce que fait Aikido : 4 couleurs et 1 typo tiennent **4 registres visuels**
(illustration flat / carte vectorielle / diagramme conceptuel / mockup UI) sur 142 s sans qu'on voie
les coutures. La contrainte n'appauvrit pas — c'est elle qui produit l'unité.

---

## 1. Palette — 4 couleurs, pas une de plus

Valeurs **mesurées dans le code**, pas inventées : dérivées de `PAL_GPT`
(`src/projects/_rnd/d3-16x9/ProtoCartePaletteGPT.tsx:93`, adoptée par Aziz le 2026-08-15 pour le
Gazoduc Acte 4 et la suite) et recoupées avec `northshield-v3-FINAL.mp4`, qui applique déjà ce
langage.

| Rôle | Valeur | Emploi | ⛔ Interdit |
|---|---|---|---|
| **Fond profond** | `#0d1f38` → `#050c1a` | Le fond de tout plan. Toujours en **dégradé radial**, jamais un aplat (cf. § 2). | Servir de couleur d'objet. |
| **Structure** | `#16304f` (masses) · `#58809f` (traits) | Ce qui porte la scène sans la commander : pays inactifs, grilles, cadres, contours de mockup. Le trait reste **murmuré** — c'est ce qui fait reculer le fond. | Monter en luminosité pour « mieux voir ». Si ce n'est pas lisible, c'est que ça devrait être un accent. |
| **Accent** | `#2E9FD4` / `#7FD8FF` (cyan) | **L'unique couleur qui dit « regarde ici »** : élément actif, tracé vivant, chiffre-clé, curseur. Un seul foyer d'accent par plan. | Deux accents concurrents dans le même plan. |
| **Texte** | `#F2EFE6` (ivoire) | Tout le texte, tous niveaux. La hiérarchie se fait par **taille et graisse**, pas par couleur. | Du blanc pur `#FFFFFF` (trop dur sur ce fond). |

**5e couleur — l'alerte, `#ff5a3c`.** Elle existe (`GazoducActe4RessourceUnique.tsx`) et n'est **pas**
une couleur de charte : c'est un **événement**. Autorisée sur un seul moment de bascule par vidéo,
jamais comme couleur décorative ni sur deux plans consécutifs. Utilisée deux fois, elle cesse d'alerter.

⚠️ **L'or `#C8A951` (314 occurrences) et le parchemin `#F2EBD9` (169) restent la palette Souverain
publiée** — ils ne sont PAS dans cette charte. Le cut vente est en registre sombre ; ne pas mélanger
les deux dans un même montage. Cf. § 5.

## 2. Le fond — un dégradé qui vit, jamais un aplat

C'est le point de la charte au **meilleur rapport effet/coût** : aucune brique à coder, un
`radialGradient` et une interpolation lente.

- **Radial, pas linéaire** — cx≈50 % cy≈46 % r≈72 %. Le radial crée un centre de lumière, donc un
  point de focalisation ; le linéaire ne fait qu'un dessus/dessous neutre.
- **1 à 2 halos dérivants** : taches très diffuses qui se déplacent **lentement**, frame-driven
  (`interpolate` sur toute la durée du beat). ⛔ Jamais une boucle courte — une pulsation visible
  transforme le fond en objet, alors que son rôle est d'être respiré sans être vu.
- **Le vide est un élément de composition.** Tugger tient 30 s avec quasi zéro objet : c'est la
  lumière qui fait le décor. Ne pas remplir un plan parce qu'il paraît vide.

Seules exceptions à l'aplat : sous une **carte Mapbox pleine page** (le fond n'y est presque pas
visible) et sur un registre volontairement graphique/plat.

Entrée détaillée + valeurs :
[`_PALETTE-BACKGROUNDS.md`](../../public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md)
§ FOND DÉGRADÉ VIVANT (source unique du fond — en cas de contradiction, **c'est elle qui décide**).

## 3. Typographie — 1 famille, 4 tailles

Le repo utilise déjà massivement **Georgia** (≈511 occurrences, loin devant tout le reste) : c'est
la famille de la charte, choisie parce qu'elle est déjà là — pas par goût.

| Niveau | Traitement | Emploi |
|---|---|---|
| **Titre de plan** | 64-80 px, gras | Un par plan, jamais deux. |
| **Corps / label** | 32-40 px | Légendes, noms de lieux, annotations. **Plancher absolu : 32 px** (safe zone 1920×1080). |
| **Chiffre-clé** | 120-200 px | Le chiffre qui frappe. Il porte l'accent cyan ; il est seul à l'écran ou presque. |
| **Sur-titre / kicker** | 24-28 px, **espacé** (`letterSpacing` 0.15-0.25em), capitales | La respiration au-dessus d'un titre. L'espacement fait le travail que ferait une 2e typo. |

**Exception accordée : `IBM Plex Mono`** pour ce qui doit *se lire comme de la donnée* — interface,
console, ticker, texte qui se tape. C'est un **signal de registre**, pas une variation esthétique :
si le contenu n'est pas de la donnée machine, il est en Georgia. Précédent : les labels de
`northshield-v3-FINAL.mp4`.

⛔ Toutes les autres familles présentes dans le repo (Cinzel, Arial Black, Bebas Neue, Cormorant)
sont **hors charte** pour le cut vente. Elles restent légitimes dans les épisodes déjà publiés.

## 4. Enchaîner deux registres sans couture — la règle qui fait tenir 2 min

C'est le mécanisme qui permet à Aikido de tenir 142 s sur 4 registres, et c'est le **trou n°8 du
catalogue** (« la transition entre deux registres visuels » — `GlobeToParchemin` est aujourd'hui
notre seul raccord inter-registre, tout le reste se fait au cut sec).

**Le principe : un élément traverse la coupe.** On ne passe jamais d'un registre à l'autre sur un
écran entièrement neuf. Au moins UN de ces trois éléments persiste de part et d'autre :

1. **Le fond** — il ne change pas au raccord. C'est le liant par défaut, gratuit, et il suffit dans
   la majorité des cas. Le fond est la seule chose qui n'a jamais le droit de couper.
2. **Un objet qui se transforme** — le contour du pays devient la barre du graphique, le tracé
   devient la ligne du diagramme. Le plus fort, le plus cher.
3. **Un élément d'interface qui reste** — un titre, un kicker, un cadre qui garde sa position pendant
   que le contenu change dessous. Bon marché et très efficace ; c'est le procédé d'Aikido.

**Ordre des registres** : aller du **concret vers l'abstrait**, jamais l'inverse — territoire →
diagramme → interface → chiffre. Remonter vers le concret après un plan abstrait se lit comme un
retour en arrière et casse la progression.

⛔ **Le cut sec reste autorisé — une fois, et pour dire quelque chose** : sur une bascule
dramatique (avant/après, révélation). Un cut sec par défaut n'est pas un choix, c'est une absence
de choix.

⭐ **Ce qu'on a et qu'aucune des 3 références n'a : faire DURER un geste.** La caméra continue de
l'Acte 2 AAGP tient un mouvement sans à-coup là où les 3 assemblent des plans courts. Sur un teaser
30 s ce n'est pas un défaut de leur part — c'est le format. **Sur le cut vente, prévoir au moins un
plan long qui tient un seul mouvement** : c'est notre signature, et elle ne se voit que dans la durée.

## 5. Ce que la charte interdit explicitement

- Mélanger la palette or/parchemin Souverain et la palette sombre dans un même montage (§ 1).
- Un 2e accent, une 2e typo, un halo qui pulse vite, du blanc pur.
- L'alerte `#ff5a3c` employée comme couleur décorative ou deux plans de suite.
- Enchaîner deux registres sur un écran entièrement neuf (§ 4).
- Montrer un plan **jamais rendu ou rejeté** — croiser avec `SHOWCASE-CAPACITES.md` § REJETS et
  grep `VERDICT`/`REJETÉ` avant d'inclure quoi que ce soit.
  ⛔⛔ Rappel : **Gazoduc Acte 3 est gelé**, ne pas l'inclure.
- Réutiliser une brique sans l'avoir **rendue et regardée** — un décor qu'on n'a pas vu n'est pas un
  acquis, c'est une dette.

## 6. Contrôle avant montage (5 points, sur frames extraites)

À passer sur une planche de frames couvrant toute la durée — jamais sur une frame isolée.

1. **Compter les couleurs.** Plus de 4 (+ l'alerte si elle est justifiée) → corriger.
2. **Compter les typos.** Plus de 1 (+ Plex Mono sur de la donnée) → corriger.
3. **Un seul foyer d'accent par plan ?** Deux zones cyan qui se disputent l'œil → en éteindre une.
4. **Chaque raccord de registre porte-t-il un élément qui traverse ?** Sinon, § 4.
5. **Le fond est-il un dégradé partout où il est visible ?** Un aplat résiduel → § 2.

---

## Exceptions accordées

> Toute dérogation se note ici, datée et motivée. Une exception non écrite est une dérive.

- **2026-08-15** — `IBM Plex Mono` autorisé pour les contenus « donnée machine » (§ 3).
- **2026-08-15** — `#ff5a3c` autorisé comme couleur d'événement, un moment par vidéo (§ 1).

## Preuve interne — la charte est déjà atteignable

`out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4` (63 s, vérifié au visionnage 2026-08-15)
tient **3 registres** — personnages flat / carton typographique / dataviz-UI — sur un même fond navy
sombre, avec le cyan pour unique accent et l'ivoire pour tout le texte. C'est-à-dire la discipline
d'Aikido, déjà appliquée par nous, sur le seul matériau non-géopolitique du repo.
**La charte ne demande donc rien qu'on n'ait déjà fait une fois** — elle demande de le tenir partout.

## Liens

- Analyse et verdict croisé : [`SHOWCASE-CAPACITES.md`](../projects/SHOWCASE-CAPACITES.md)
- Fond (autorité) : [`_PALETTE-BACKGROUNDS.md`](../../public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md)
- Frames de référence : `public/_shared/refs/benchmark-fiverr/` (+ son README)
- Choix du registre d'expression : [`MOTEURS-VISUELS-ET-SOCLE.md`](MOTEURS-VISUELS-ET-SOCLE.md)
- Éditorial (périmètre distinct) : [`CHARTE-EDITORIALE-SOUVERAIN.md`](CHARTE-EDITORIALE-SOUVERAIN.md)

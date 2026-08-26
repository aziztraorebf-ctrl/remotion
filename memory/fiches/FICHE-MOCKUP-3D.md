# MOCKUP D'APPAREIL 3D — fiche de déclenchement (lire AVANT de coder un mockup)

> Injectée quand on touche `_demos/devices/` ou un modèle d'appareil (`PhoneModel`, `LaptopModel`,
> `GridBackdrop`, `FlatDeviceMotion`…). **Scindée de `FICHE-UI-PRODUIT.md` le 2026-08-26** : ces
> 170 lignes y étaient PAYÉES MAIS MORTES — le hook ne déclenchait jamais cette fiche sur
> `_demos/devices/` (aucun motif ne matchait), donc elles coûtaient du contexte quand elles étaient
> hors sujet et manquaient quand elles servaient. Cas d'école de `feedback_gate-contourne-par-outil-alternatif`.
> ⚠️ Si ce que tu lis ne correspond PAS au code que tu as sous les yeux : **c'est la fiche qui a tort**.
> Corrige-la immédiatement.
>
> **Fiche sœur** : `FICHE-UI-PRODUIT.md` (capture de l'UI qui remplira l'écran) · `FICHE-CAMERA.md` (le GESTE de caméra).

## ⭐⭐ L'UI DANS UN MOCKUP D'APPAREIL 3D (prouvé 2026-08-25, registre SaaS explainer)

Le pilier 3 (UI capturée) se marie au **pilier 4** via un mockup 3D procédural : la capture devient la
texture de l'écran. Elle s'incline, reçoit la lumière et est occultée par le châssis — ce n'est PAS une
image posée par-dessus. Registre observé sur la référence Comma (portfolio Fiverr SaaS explainer).

**Le socle** — `src/projects/_shared/_demos/devices/` :
| Fichier | Rôle |
|---|---|
| `PhoneModel.tsx` · `LaptopModel.tsx` | Mockups procéduraux (Fable 5, ~9 min les 2 en parallèle, 0 crédit API) |
| `PhoneModelVision.tsx` | Variante déduite d'une frame de référence — géométrie MEILLEURE (Dynamic Island, rails plats) |
| `VisionLights.tsx` | Rig d'éclairage mesuré au pixel sur la référence (`VISION_BG = "#101010"`) |
| `DeviceBench.tsx` | Banc 4 angles paramétrable (modèle × éclairage) — clone de `keys/KeyBench.tsx` |
| `DeviceScreenDemo.tsx` | Le mariage : capture Shotcraft plaquée dans l'écran |

**Contrat des modèles** : géométrie procédurale pure, `rotationY`/`scale` en props, ZÉRO lumière/caméra/
animation dedans (le banc les fournit), déterministe. Donc animables tels quels dans n'importe quelle scène.

### ⛔⛔ LES 4 PIÈGES PAYÉS (chacun a coûté au moins un rendu)

1. **⛔⛔ `useLayoutEffect`/`useEffect` NE S'EXÉCUTENT JAMAIS dans un composant enfant de `<ThreeCanvas>`**
   avant la capture d'un render `still` — react-three-fiber a son propre reconciler, non flushé.
   Symptôme : **écran NOIR**, mesuré à (1,1,1). ⛔ Le piège du piège : on croit à une course de chargement
   et on ajoute `delayRender` — inutile, le chargement n'a **jamais commencé**. 2 tentatives perdues là-dessus.
   → **FIX : charger la texture dans un composant DOM, HORS du canvas, et la passer en prop.**
   Preuve : témoins colorés dans le canvas, zone écran 0.00 → 27.15 une fois le hook hissé.
2. **`--gl=angle` est OBLIGATOIRE pour TOUT render 3D headless**, pas seulement Mapbox
   (`Error creating WebGL context` sinon). `render-mapbox.sh` le porte déjà depuis longtemps.
3. **Une UI desktop recadrée dans un écran de téléphone ne garde qu'une colonne.** Ne PAS redimensionner :
   **écrire une variante responsive** de la page (tableau 6 colonnes → cartes empilées) et la capturer à
   390×844 en ×3. Cause vérifiée sur la page NorthShield : **0 media query + `width:1920px` en dur**.
   Variante : `src/projects/_client-sim/noteshield/live-page-mobile/` · capture : `scripts/tools/ui-capture/capture-mobile.mjs`.
4. **`puppeteer` n'est PAS dans les dépendances du projet** (seul son Chrome est en cache). Capturer avec le
   binaire `chrome-headless-shell` de Playwright en CLI (`--screenshot`, `--window-size`,
   `--force-device-scale-factor=3`) plutôt que d'installer une dépendance.
   ⚠️ Vérifier qu'aucun serveur ne squatte déjà le port : une capture a attrapé une AUTRE page (vécu).

### Convention `screen` (les 2 modèles la partagent)
La prop `screen` reçoit un **élément material r3f** rendu en enfant du mesh d'écran :
`screen={<meshBasicMaterial map={tex} toneMapped={false} />}`.
⛔ PAS `<Html>` de drei : couche DOM hors canvas, donc ni occlusion ni éclairage — l'UI flotterait
au-dessus du châssis aux angles rasants. `meshBasicMaterial` + `toneMapped={false}` car un écran ÉMET
sa lumière (un material standard l'assombrirait sous un rig sombre).
Cadrage plaque : `repeat`/`offset` en "cover" — on rogne, on n'étire jamais.

### Vision → 3D : ce qui marche et ce qui ne marche pas
Donner une frame de référence à Fable produit une **géométrie nettement meilleure** (proportions mesurées
au pixel sur l'image). Mais son **rig d'éclairage déduit est trop sombre** : l'analyse est exacte
(vérifiée indépendamment : fond (16,16,16), rampe de chanfrein 39→67, RGB neutres, rails 3-32) et
pourtant les intensités Three.js sont fausses. ⭐ **Identifier une lumière ≠ produire les bons gains.**
→ Garder les DIRECTIONS et COULEURS du rig vision, remonter les intensités.
⛔ Ne pas généraliser depuis le SVG : `memory/tools/openrouter-svg.md` porte déjà « classements SVG ≠ 3D ».

### ⭐⭐⭐ POSER L'OBJET DANS UN DECOR (l'ecart n°1, comble le 2026-08-26)
Un mockup qui **flotte dans le vide** est techniquement reussi et visuellement froid.
La reference « Foster With Confidence » pose son telephone sur un vrai bureau — c'est ce
qui separe un rendu produit d'une SCENE. Code : `devices/DeviceInScene.tsx`.
Decors generes (Gemini HQ, centre volontairement VIDE) : `public/_shared/refs/decors-mockup/`
— 2 flat-lay 90 deg pour le telephone (designer / executif), 2 trois-quarts pour le laptop
(sombre facon Comma / clair SaaS), 1 studio neutre.

**Les 3 conditions, aucune optionnelle** :
1. **Meme direction de lumiere** — decors generes avec key light en HAUT-DROITE, donc le rig
   3D garde cette direction et l'ombre tombe en bas-a-gauche comme celles des objets reels.
2. **Une ombre portee** — un objet sans ombre est un collage. Ellipse floutee en DOM sous le
   canvas (pas une shadow map) : moins cher et reglable au pixel.
3. **Meme angle de vue** — un decor a 90 deg ne recoit qu'un objet vu de dessus ; un decor en
   trois-quarts demande un objet incline. Melanger casse la scene immediatement.
⭐ **Parallaxe** : faire grossir le decor un peu MOINS vite que l'objet pendant le zoom.
⭐ **Allumage de scene** : le decor passe de noir a pleine lumiere en **0,30 s** (mesure sur la
reference : luma 5 -> 96 entre 0,90 s et 1,20 s, cale sur un pic sonore). Pas un fondu lent.
⭐ **`lidAngle`** du laptop est un parametre : le capot s'OUVRE pendant que la camera approche.

### ⭐⭐⭐ SVG DESSINE vs 3D APLATI — LA REGLE (tranchee au banc, 2026-08-26)

⛔ **J'ai affirme a tort qu'un SVG ne peut pas s'animer.** Aziz m'a repris, verification
faite : le mockup de Fable (`public/_client-sim/noteshield/laptop-mockup.svg`) respecte le
contrat « pret a animer » — **21 groupes nommes**, dont `lid`, `hinge`, `base` separes.
Un SVG ouvre tres bien son capot, zoome, glisse. La vraie ligne de partage n'est PAS
« animable ou pas ».

**LA VRAIE LIGNE : le point de vue change-t-il, et y a-t-il quelque chose a REVELER ?**
| Le geste | Qui gagne | Pourquoi |
|---|---|---|
| Point de vue fixe, objet deja ouvert (zoom, glissement, apparition) | **SVG** | plus leger, mieux integre a un fond dessine |
| Un etat qui en REVELE un autre (capot qui se ferme, objet qui se retourne) | **3D** | il a un DOS ; le SVG s'ecrase, il ne se retourne pas |
| Rotation dans l'espace, orbite, tour a 360 deg | **3D seul** | les faces cachees n'existent pas dans un dessin |
| Besoin de parametrer (finesse, angle, teinte, taille) | **3D** | variables vs dessin fini |
⭐ **DEFAUT = 3D APLATI** : il couvre les deux cas. Un modele 3D **contient plus
d'information que ce qu'il montre** — c'est ce qui le rend reutilisable dans des plans
non prevus. Le SVG reste superieur pour un registre franchement ILLUSTRE sur plan fixe.

**LE MATERIAU APLATI** (`Flatten` dans `devices/FlatDeviceMotion.tsx`) : on n'echange pas
les materiaux (ce serait perdre la hierarchie chassis/touches/trackpad), on annule ce qui
fait « photo » — `metalness = 0`, `roughness = 1`, `envMapIntensity = 0` — et l'eclairage
passe en ambiante dominante (2.5) + une directionnelle douce (1.2). ⛔ Exclure l'ecran du
traitement (repere par la presence d'une `map`) : il doit rester emissif.
Verifie EN MOUVEMENT : ecart-type des luminances 7,7-19,7 pendant une rotation complete —
le volume ne s'effondre pas.

**⭐ TOUCHES QUASI AFFLEURANTES** (retour d'Aziz) : le relief d'origine du clavier
(depth 0.022 + bevel 0.008) etait plus REALISTE mais lisait « vieux laptop ». Un portable
moderne a des touches presque a fleur. Reduit a 0.012 total (`depth: 0.009` + `bevelThickness: 0.003`, LaptopModel.tsx:194-197). ⛔ Ne pas descendre sous
0.008 : les touches disparaissent completement sous l'eclairage aplati.

### ⭐ FOND SVG PARAMETRABLE PLUTOT QU'UNE PHOTO (`devices/GridBackdrop.tsx`)
Une photo de decor porte des contraintes CACHEES qu'on ne controle pas (echelle implicite,
direction de lumiere figee, angle de vue, profondeur de champ) — il faut faire coincider
l'objet avec quatre choses qu'on n'a pas choisies, et chaque ecart se voit. Un fond dessine
n'en a aucune, et **tout y est un parametre** : une palette de 5 couleurs (`GridPalette` : base,
mat, line, lineStrong, accent) + `cell` (taille de carreau) + `breathe`, exposes via 2 props.
2 palettes pretes : `GRID_TEAL` (le bleu-teal du tapis de decoupe de la reference), `GRID_SLATE`
(neutre, pour un client sans couleur forte).
La grille respire (1,5 %), les graduations se tracent, un halo remplace l'ombre portee.
⚠️ Aziz l'a observe sur le marche reel : l'objet-dans-un-decor-photo est **rare** dans les
SaaS explainers (1 plan sur 8 chez la reference Foster) — le gros du registre est UI plein
cadre, typo sur fond, degrades. Ne pas s'acharner sur le decor photo.

### ⛔⛔ L'ECHELLE SE CALCULE, ELLE NE SE DOSE PAS (paye 3 fois le 2026-08-26)
Un mockup pose dans un decor photo doit occuper sa TAILLE REELLE. Choisir `scale` au
juge donne des absurdites immediatement visibles : telephone 2,1x trop grand, tasse du
decor paraissant 2,2x plus grosse que le laptop entier.
**METHODE** : reperer dans la photo un objet de taille connue (regle 30 cm, tasse ~9,5 cm,
carnet A5 21 cm) -> mesurer sa taille en px -> echelle du decor en px/cm. Puis :
`scale = (taille_cm_reelle * px_par_cm) / unitsToPx(unites_modele, camZ, hauteur_rendu)`
avec `unitsToPx = (u / (2*z*tan(fov/2))) * H`. Code : `devices/DeviceInScene.tsx`.
⚠️ **Le decor est affiche en `cover`** : l'echelle mesuree DANS LE FICHIER doit etre
multipliee par `max(1920/W, 1080/H)`. Oubli = facteur 1,4 d'erreur.

### ⛔ UNE PHOTO DE DECOR PORTE UN CADRAGE IMPLICITE
Generer « un bureau » ne suffit pas. Un decor shoote en GROS PLAN (la tasse occupe la
moitie du cadre => ~40 px/cm) ne peut pas recevoir un laptop de 31 cm : a la bonne
echelle il masquerait tout le decor. **Preciser la distance de prise de vue dans le
prompt** : « wide establishing shot, camera pulled BACK, objects only at the FAR edges,
vast empty space in the middle ». Un decor par ordre de grandeur d'objet.

### ⭐ L'OMBRE A TROIS COUCHES (une ellipse floue ne suffit pas)
Mesure comparative : la reference a un creux de luminosite PROGRESSIF (122 niveaux) la
ou une ombre a une seule couche saute brutalement (7 -> 203 -> 50 en quelques px).
1. **Occlusion ambiante** — large, tres pale, tout autour de la base. C'est CE detail
   qui fait lire « pose » plutot que « superpose ».
2. **Ombre projetee** — decalee du cote oppose a la lumiere (key haut-droite => bas-gauche).
3. **Contact** — serree, sombre, a peine floutee, juste sous l'objet.
⭐ Ajouter un **desalignement de ~2,5 deg** : un objet vraiment pose n'est jamais parfaitement
aligne sur le bord de la table.

### ⭐ SFX : UN SON PAR EVENEMENT, PAS UN TEMPO
La reference porte **12 transitoires en 8 s** — chaque apparition a son son, c'est ce qui
rend la scene « vraie ». Banque deja sur disque : `public/_client-sim/noteshield/sfx/`
(19 fichiers). Choix valides : `hit-weak` (0,59 s) sur l'allumage de scene · `click`
(1,10 s) sur la pose / l'ouverture du capot · `tone` (0,20 s) sur un micro-etat.
Volume SFX **0,50**. ⛔ **JAMAIS de whoosh sur une UI** (vocabulaire d'AIR, sans rapport
avec un logiciel — retire le 2026-08-20 apres retour d'Aziz).

### ⛔ CE QUI FAIT LE PREMIUM N'EST PAS LA BRIQUE (lecon de la 4e video, 2026-08-26)
Analyse initiale faussee par un echantillonnage a **16 frames sur 1273** — juger un MONTAGE sur
des photos espacees. Ce que la densite a revele :
- **12 transitoires sonores en 8 s** : chaque apparition a son SFX. C'est ce qui rend « vrai ».
- **Micro-etats** : notifications une par une, heure qui change, texte qui s'assemble
  caractere par caractere. Rien n'apparait d'un bloc.
- **Un zoom continu de 4 s** (une seule coupe mesuree entre 1,6 s et 5,6 s) qui va du bureau
  jusqu'a l'interieur de l'ecran — avec une ELLIPSE TEMPORELLE dedans (12:57 -> 9:38) sans coupe.
- **Le fond change selon le registre** : noir plat pour l'objet, degrade vert pour le produit.
  ⛔ « fond uni toujours » etait une generalisation abusive tiree d'une seule reference.
- **Le raccord carte -> sol** : Google Earth, puis un FLOU RADIAL croissant qui masque la coupe,
  puis un plan de stock filme. Le flou n'est pas decoratif, c'est le MASQUE du raccord.

### Limite connue (non levée)
~~Dans un mockup, l'écran est une texture plate~~ — **LEVEE le 2026-08-25** : une séquence
Shotcraft rendue joue dans l'écran via `THREE.VideoTexture`, et le rendu reste **déterministe**
(`currentTime` piloté par la frame Remotion, jamais par l'horloge). Code : `DeviceHeroShot.tsx`. D'où l'articulation de montage : **UI plein cadre** quand on montre COMMENT ça marche
(la caméra plonge dans la page) · **mockup 3D** quand on montre CE QUE C'EST (ouverture, CTA).

### ⛔ LE CADRAGE 3D SE CALCULE AUSSI (pas seulement l'echelle de l'objet)
La section precedente calcule le SCALE pour un decor photo. Sur fond neutre, c'est le CADRAGE qui se
calcule — inverser la formule de projection :
`z = (largeur_unites * H_rendu) / (2 * tan(fov/2) * largeur_px_voulue)`
Valeurs payees le 2026-08-26 (fov 40, H 1080) : **camZ 6.34** pour 749 px de large
(`LidOpenBench.tsx:189-190` — c'est le calcul qui a corrige le « laptop 3D trop petit » vu par Aziz,
z 8.6 -> 6.34) · **camZ 9.05** pour un modele de 3.2 unites (`SvgVs3dBench.tsx:154,166`).
⛔ Ne pas doser le z au juge : meme erreur que doser le scale, deja payee 3 fois.

### ⛔ UNE AFFIRMATION DE CAPACITE SUR NOTRE PROPRE MATIERE SE VERIFIE AVANT D'ETRE DITE
J'ai affirme a Aziz qu'un SVG « ne peut pas s'animer » ; il m'a repris ; verification faite, le mockup
de Fable respectait deja le contrat « pret a animer » de la doctrine (21 groupes nommes, `lid`/`hinge`/
`base` separes, charniere mesurable a y=760, centre x=956). L'affirmation aurait ferme une branche
entiere du registre. Meme famille que `feedback_capacite-modele-supposee-verifier-le-catalogue`, ici
applique a un ASSET qu'on a produit NOUS-MEMES.

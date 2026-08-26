# UI PRODUIT / ÉCRAN DE SAAS — fiche de déclenchement (lire AVANT de coder une scène d'interface)

> Se déclenche quand on simule un écran, un dashboard, une app, un site — **pilier B2B n°3 sur 5**.
> ⚠️ Un plan qui ressemble a une UI n'en est pas forcement une : cartouche, portrait, badge, lockup,
> carte + avatars = **pilier 4 (motion design React)**, briques deja presentes. Verifier avant de capturer.
> ⚠️ Si ce que tu lis ne correspond PAS au réel que tu as sous les yeux : **c'est la FICHE qui a tort**.
> Corrige-la immédiatement. Chemins vérifiés sur disque le 2026-08-20.

## ⛔ LA RÈGLE N°1 — NE PAS REDESSINER L'UI EN REACT

**Une UI de client se CAPTURE, elle ne se recode pas.** Vécu Flowdesk (2026-08-06) : 4 versions,
V1 « slideshow », V2 rejetée « vocabulaire abstrait illisible sans le son », V3 obligée de
reconstruire à la main un vocabulaire d'interface (icônes email/tableur, 5 destinations nommées).
Coût : plusieurs sessions. Le même sujet en pipeline capture = 1 session, zéro rejet de fond.

Corollaire (fiche `row-embed` de shotcraft) : une ligne qui s'anime est un **découpage de la plaque**
(`backgroundPosition` négatif sur la capture pleine page), JAMAIS un redessin — le rendu de police
d'un redessin diffère visiblement de celui de la plaque au sol.

## LE PIPELINE (prouvé 8 versions le 2026-08-19/20, 2 registres)

1. **Page servable** — `src/projects/_client-sim/<client>/live-page[-light]/index.html`.
   Vraie page HTML/CSS, données FICTIVES mais crédibles (⛔ jamais de vraies données client :
   « lorem ipsum ou base vide = prise fichue », dit leur propre script).
   Attributs `data-capture="row|nav|thead|search"` = les sélecteurs de capture.
2. **Servir** : `python3 -m http.server 8899 --directory <live-page>` (⛔ `--directory`, un `cd` ne
   persiste pas → 404).
⛔ **`waitUntil:'networkidle'` TIMEOUT sur une page a videos en boucle** (le reseau n'est jamais au
   repos) -> `waitUntil:'load'` + `waitForTimeout(1500)`. ⚠️ `capture-northshield.mjs:78` utilise
   `networkidle0` : correct pour une page statique, il se BLOQUERA sur une page a medias.
⛔ **Playwright sans navigateur** : reutiliser le Chrome de Puppeteer deja present plutot que
   `playwright install` — `chromium.launch({executablePath: process.env.CHROME_BIN})` avec
   `~/.cache/puppeteer/chrome/*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/...`
   (⚠️ 2 versions coexistent : globber, ne pas coder en dur). Paye le 2026-08-23.

3. **Capturer** : `scripts/tools/ui-capture/capture-northshield.mjs` (versionné ; adapté de
   `assets/scripts/capture-template.mjs`). Produit : plaque pleine page **2x**, découpes par élément,
   plaque VIDE (`hideForEmptyPlate`), et **`live-layout.json` = les bbox réelles**.
   Un 2e état s'obtient par `interact:` (ex. filtrer la liste) → `<name>-after.png`.
4. **Animer** — `PageCam` + les recettes (voir § socle).

## ⛔⛔ LES 4 PIÈGES QUI ONT COÛTÉ UNE ITÉRATION CHACUN

1. **`live-layout.json` de l'état APRÈS interaction est FAUX** — il est relevé AVANT l'`interact`,
   donc il liste encore les 7 lignes alors que la page filtrée n'en a qu'une.
   → **MESURER sur la plaque** (scan du PNG), ne jamais déduire. Erreur commise 2× la même session :
   `FLAG_CY - 660` donnait 313, la vraie valeur mesurée était 642 → cadrage sur du vide.
2. **Ne JAMAIS changer de plaque pendant un mouvement de caméra** (full → filtered) : la caméra
   continue de se resserrer sur une zone qui vient de se vider. Le changement se fait **sur une coupe
   couverte par `FlashCut`**.
3. **Un commentaire JSX mal fermé (`*/` sans `}`) est INVISIBLE jusqu'au typecheck** — rencontré 2× dans la
   même session, dans 2 fichiers. `npx tsc --noEmit` AVANT de considérer un `.tsx` terminé, pas au build.
4. **`omitBackground: true` ne donne PAS de transparence** sur un élément qui a un fond CSS propre
   (vérifié : `flagged.png` sort opaque). Les découpes transparentes ne marchent que sur des éléments
   sans background.

## LE SOCLE IMPORTÉ — `src/projects/_client-sim/noteshield/live-page/shotcraft-lib/`

Composants de **video-shotcraft** (Apache-2.0, réutilisation commerciale OK, attribution requise),
copiés TELS QUELS. README d'attribution dans le dossier.

| Fichier | Rôle |
|---|---|
| `PageCam.tsx` ⭐ | Caméra 2.5D par keyframes `{frame, cx, cy, zoom, rotX, rotY, rotZ, persp}` + DOF. Le socle de tout plan « vraie page ». |
| `FlashCut.tsx` | Flash blanc chaud à cheval sur une coupe. Usage : `from = coupe - 5`, durée 10. |
| `DigitRoll.tsx` · `PaperTitleCard.tsx` | Compteur qui roule · carton-respiration (⚠️ calibré papier/ambre, à forker pour un registre sombre). |

⭐⭐ **LE GOTCHA QUI CHANGE TOUT (leur commentaire, vérifié)** : en mode 3D `PageCam` agrandit via la
propriété CSS **`zoom`**, PAS `transform: scale`. Avec `scale`, Chromium rastérise la couche à la
taille de layout 1920 **puis** agrandit en GPU → le texte est flouté avant d'être grossi. Avec `zoom`,
la boîte de layout grandit → texte net sous perspective. C'est la raison technique pour laquelle
leurs plans serrés sont nets et pas une réimplémentation maison.

## LE MONTAGE — leur `promo-energy-arc` (= leur mix-and-match)

*(tableau des proportions retire le 2026-08-23 : doctrine importee, consultable dans
`Vincentwei1021/video-shotcraft` > `sequences/promo-energy-arc`. Les regles dures ci-dessous, elles,
portent chacune leur cout paye.)*

Règles dures de leurs fiches : **hold ≥ 1 s** après la pose d'un lockup (« sous 1 s = à refaire ») ·
frappe **3f/caractère** (valeur figée après un retour « trop rapide ») · **respiration de ~11f** entre
fin de frappe et filtrage (sinon lecture « machine ») · sortie des lignes décalée ≥ 0,4f (sinon « la
page plante ») · une technique ne peut être vedette qu'**une seule fois**.

## LE CURSEUR (fiche `camera/cursor-flyover`)

⭐ **La caméra et le curseur sont UN SEUL SYSTÈME** — même table de keyframes, donc ils arrivent
toujours ensemble. `scale(1/zoom)` sur le curseur, sinon il devient énorme en gros plan et on perd
l'illusion qu'il appartient à la couche UI. Clic = **2 anneaux concentriques décalés de 3f** (un seul
est trop discret).

## LE SON

SFX repris de leur banque (149 fichiers, 16 catégories) → `public/_client-sim/noteshield/sfx/`.
⛔⛔ **PAS de whoosh sur les coupes d'UI** (retiré 2026-08-20, retour Aziz) : `whoosh-fast.mp3` est un
sifflement d'AIR, un vocabulaire de mouvement physique sans rapport avec un logiciel — sur 5 coupes il
devenait le son le plus présent du film. **Le FlashCut visuel suffit.**
Musique : leurs 5 BGM sont gratuites (Apache-2.0) — **tester le gratuit AVANT de générer** (réflexe
d'Aziz, 2026-08-20). Choisir le segment sur **mesure du profil d'énergie**
(`ffmpeg -ss T -t 20 -i X -af volumedetect`), pas au hasard : pour `bgm-tech-house`, 156→182 s est la
seule portion qui monte sur 26 s d'affilée, ce qui épouse l'arc. Volume musique **0,13**, SFX **0,50**.

## CE QUI EST AGNOSTIQUE (prouvé 2026-08-20)

Le même film a été produit en **registre sombre ET en light mode SaaS** sans changer un seul
composant — seules la capture source et la palette varient. C'est ce qui permet de promettre à un
client que **le pipeline s'adapte à SON design**. Compositions de référence :
`NorthShieldPromoV4` (sombre) · `NorthShieldPromoLight` (clair).
⚠️ `PageCam` a un fond papier `#faf7f2` par défaut — visible sur un blanc franc, 1 ligne à changer.

## ⛔ CE QUE CE PILIER NE FAIT PAS

Pas de personnages, pas de visages, pas d'organique. Ce n'est pas une limite à cacher : les meilleurs
explainers SaaS n'en ont pas. Si le besoin est un personnage → pilier SVG (2) ou vidéo générée (5).
Voir `memory/doctrines/PILIERS-B2B.md`.

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
moderne a des touches presque a fleur. Reduit a 0.012 total. ⛔ Ne pas descendre sous
0.008 : les touches disparaissent completement sous l'eclairage aplati.

### ⭐ FOND SVG PARAMETRABLE PLUTOT QU'UNE PHOTO (`devices/GridBackdrop.tsx`)
Une photo de decor porte des contraintes CACHEES qu'on ne controle pas (echelle implicite,
direction de lumiere figee, angle de vue, profondeur de champ) — il faut faire coincider
l'objet avec quatre choses qu'on n'a pas choisies, et chaque ecart se voit. Un fond dessine
n'en a aucune, et **tout y est un parametre** : 6 variables (base, mat, line, lineStrong,
accent, taille de carreau) => adaptable a la charte d'un client en changeant 6 valeurs.
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

## Références
Repo source : https://github.com/Vincentwei1021/video-shotcraft (152 fiches, 209 previews, Apache-2.0).
Fiches lues et appliquées : `opening/brand-ink-open` · `ui-entrance/row-embed` · `ui-entrance/list-reveal` ·
`interaction/type-and-filter` · `camera/cursor-flyover` · `sequences/promo-energy-arc`.
⚠️ Les fiches sont **en chinois** — lisibles par un modèle, pas par Aziz.

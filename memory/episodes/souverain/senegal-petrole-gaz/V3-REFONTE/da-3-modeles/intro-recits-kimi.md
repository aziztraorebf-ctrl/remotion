Voici trois partis-pris distincts, conçus pour votre stack Remotion/SVG frame-driven, qui évite le split-screen banal tout en respectant le système parchemin/grille/grain déjà validé.

---

## PARTI-PRIS 1 : « LE PALIMPSESTE » (Superposition des couches)
**Concept :** Les deux récits ne sont pas des blocs juxtaposés mais deux **calques de parchemin distincts** qui occupent le même espace physique. L'un est "gras" (huile), l'autre "sec" (trait), créant une tension de matière.

**Le geste visuel précis :**
- **00:00-04s** : Le fond parchemin #e4ddca reste. Deux grandes feuilles de papier (SVG path avec `feTurbulence` grain spécifique) apparaissent par le haut avec un `spring(mass: 0.8, stiffness: 40)`. 
  - Feuille A (Malédiction) : teinte ocre #e7bd78 légèrement saturée, grain "grossier" (baseFrequency="0.9"), translucide (opacity 0.7). Contient un **icône Lucide `Droplets` stylisé** (pétrole) qui coule en cascade.
  - Feuille B (Miracle) : teinte parchemin pure #e4ddca mais avec un grain "fin" (baseFrequency="0.4"), contour navy #16213a. Contient un **icône Lucide `Shield`** (souveraineté) qui pulse.
- **04-12s** : La feuille A glisse vers la gauche (-15% x) mais reste visible, la feuille B glisse vers la droite (+15% x). Elles se **chevauchent encore au centre** (pas de séparation nette), créant une zone d'ombre navy là où elles se superposent (mix-blend-mode: multiply).
- **12-20s** : Les deux feuilles tremblent légèrement (`x: interpolate(frame, [0, 1], [0, 2], {extrapolate: "clamp"})` avec bruit aléatoire) comme sous tension électrique. La grille or-sable #c2a96a reste immobile en arrière-plan (ancrage visuel).

**L'opposition sans split-screen :**
C'est une **tension verticale (Z-index)** et horizontale. Le spectateur comprend qu'il y a deux "vérités" concurrentes parce qu'elles occupent le même espace mais ne se mélangent pas (couleurs différentes). Aucun bord droit/gauche artificiel — c'est la **transparence** qui crée la séparation.

**La transition vers la carte (fracture) :**
À 20s, une **ligne de fracture apparaît au centre** (où les deux feuilles se touchent). Ce n'est pas une coupure nette mais une déchirure qui suit un path SVG organique (`fracturePath`). Les deux feuilles sont **aspirées vers l'extérieur** de l'écran (force centrifuge spring) comme si on les arrachait, révélant le fond navy #0d1424 du hook-B. La faille au centre s'élargit (scaleX spring de 0 à 20) et on **zoome dans cet espace négatif noir** (scale globale 1 → 50 sur le centre de l'écran) où apparaît la mer (première tuile Mapbox à 32s).

**Pourquoi ça sert l'intention :**
Le fait que les deux récits soient des "couches" de papier les rend **artificiels, superposés, falsifiables**. Quand on les arrache, on ne découvre pas "la troisième couche" mais le vide — la réalité brute sans narratif. Le grain différent entre les deux feuilles crée une dyschronie sensorielle qui dit "ces deux histoires n'ont pas la même texture, elles ne peuvent pas être toutes les deux vraies".

---

## PARTI-PRIS 2 : « L'ORBITALE » (Rotation autour du centre)
**Concept :** Deux éléments graphiques tournent autour d'un point central (le Sénégal comme gravité), jamais fixes, toujours en opposition géométrique (180°). La "prison mentale" est visualisée par ce mouvement circulaire bloqué.

**Le geste visuel précis :**
- **00:00-04s** : Au centre, un **cercle vide** (stroke navy #16213a, dasharray animé) représente le Sénégal. Deux groupes d'icônes Lucide apparaissent :
  - Groupe 1 (Malédiction) : `Building-2` (multinationale) + `ArrowUpRight` (fuite) en couleur rouge crise #b23a2e.
  - Groupe 2 (Miracle) : `Flag` (nation) + `TrendingUp` (progrès) en ocre #e7bd78.
- **04-20s** : Les deux groupes orbitent en sens inverse autour du cercle central (interpolate sur `rotate` avec spring). Le groupe rouge tourne horaire, le groupe ocre anti-horaire. Ils se croisent sans jamais se toucher. La grille or-sable tourne légèrement dans le sens du groupe ocre (synchronicité partielle).
- **Matériau :** Les icônes laissent une **trainée de grain** (SVG filter `feGaussianBlur` très léger + `feTurbulence` animé sur la trainée) qui s'efface, comme si elles griffaient le parchemin en passant.

**L'opposition sans split-screen :**
C'est une **opposition cinétique**, pas spatiale statique. Les éléments sont parfois en haut, parfois en bas, mais toujours antagonistes par leur direction. Le spectateur suit le mouvement — pas besoin de "gauche/droite", il comprend par le **sens de rotation** (l'un va vers la droite, l'autre vers la gauche quand ils se croisent au milieu).

**La transition vers la carte (fracture) :**
À 20s, la rotation s'accélère brutalement (spring velocity++), puis **les deux groupes d'icônes sont aspirés vers le centre** (scale 1 → 0.1, opacity 1 → 0) et entrent en collision. Au point d'impact, le cercle central (Sénégal) **éclate** selon le `fracturePath` déjà codé. La fracture part du centre vers l'extérieur (inverse du hook-B), créant une étoile à 5 branches qui s'ouvre. On zoome dans une de ces fissures (rotation de 45° pour aligner la fissure verticale) qui devient la mer (transition vers Mapbox).

**Pourquoi ça sert l'intention :**
L'orbite symbolise le **cycle sans fin des débats stériles** (on tourne en rond). L'aspiration centrale montre que la "collision" de ces deux mythes produit le vide/la fracture. Le geste de rotation continu empêche le regard de se fixer sur un "camp" — on est obligé de voir le système comme un tout dysfonctionnel.

---

## PARTI-PRIS 3 : « LA THÉÂTRALITÉ DES MARIONNETTES » (Ombres chinoises)
**Concept :** Deux ombres projetées sur le parchemin (silhouettes géométriques pures) qui se gesticulent, grandeur nature, menaçantes et caricaturales. La déconstruction consiste à montrer les ficelles.

**Le geste visuel précis :**
- **00:00-04s** : Fond parchemin clair. Deux **formes blob SVG** (créées avec des courbes de Bézier simples, pas de générateur aléatoire) apparaissent en contre-jour (ombres portées via `feGaussianBlur` et `feOffset`). 
  - Ombre A (Malédiction) : forme anguleuse, pointue, couleur navy #16213a très sombre (presque noir), avec des **pics** qui sortent vers le haut (icône Lucide `Triangle` répétée en frange).
  - Ombre B (Miracle) : forme ronde, bombée, couleur ocre #e7bd78, avec des **dents de scie** en bas (icône `Mountain`).
- **04-12s** : Les ombres "respirent" (scaleY spring 1 → 1.1 → 1) comme si elles étaient vivantes. Elles se déplacent latéralement mais restent centrées verticalement — jamais de côté fixe, elles se croisent, s'entremêlent.
- **12-20s** : Des **lignes fines** (les "ficelles", stroke #c2a96a, opacity 0.6) apparaissent en haut de l'écran et relient les ombres au bord supérieur. Les ombres deviennent moins menaçantes, on voit qu'elles sont **suspensionnes** (tension vers le haut).

**L'opposition sans split-screen :**
C'est une **opposition de silhouette**. Les formes sont distinctes par leur géométrie (pointu vs rond) pas par leur position. Le fait qu'elles soient des ombres (pas des solides) les rend immédiatement **insubstantielles, narratives, illusoires**. Aucun besoin de gauche/droite — elles peuvent se superposer et créer une ombre marron (mélange navy+ocre) au centre.

**La transition vers la carte (fracture) :**
À 20s, les ficelles se tendent (line dashoffset animation), puis **snappent** (coupure brève, hide instantané des lignes). Les ombres "tombent" (translateY spring vers le bas de l'écran, opacity 0). Là où elles étaient, le parchemin se **froisse** (mesh warp SVG simple via path deformation sur une grille 3x3 de points) et se déchire selon `fracturePath`. La déchirure est verticale, on zoome dans la fente qui révèle le fond navy, puis la mer.

**Pourquoi ça sert l'intention :**
Le théâtre d'ombres est la métaphore parfaite du **mythe réducteur** (c'est juste une ombre, pas la réalité). Montrer les ficelles à 20s c'est la révélation : ces récits sont manipulés, artificiels. Quand ils tombent, on voit le rideau (le parchemin) et derrière, la réalité géographique.

---

# ANGLES OBLIGATOIRES — REVIEW CRITIQUE

## 1. SPECTATEUR LAMBDA
**Le problème :** Risque de confusion entre "les deux récits" et "la réalité". Si les deux récits sont trop abstraits (juste des formes), on ne comprend pas qu'il s'agit de "multinationales vs nation". Si trop littéraux (logos d'entreprises), c'est réducteur.
**La décroche :** Au moment où la voix dit "mais la réalité se joue ailleurs" — si le visuel ne change pas radicalement de registre (passage des ombres/feuilles à la fracture), on reste dans la métaphore sans comprendre qu'on passe au concret.
**Hiérarchie du regard :** Dans les 3 propositions, l'œil est attiré par le **mouvement** (les éléments qui bougent) contre le **fond stable** (grille). Le centre de l'écran doit rester le point de tension (croisement des orbites, superposition des feuilles, chute des ombres).

**Piste concrète :**
- Utiliser les **icônes Lucide** comme ancrage sémantique immédiat (Droplets = pétrole, Shield = État) mais les **déformer légèrement** (scale non-uniforme spring) pour éviter le côté "clipart".
- À 20s, **inverser la lumière** : si on était en mode "ombre", passer en mode "lumière crue" (blanc éclatant au centre) pour marquer le "ailleurs".

## 2. NARRATION / SYNCHRO
**Le problème :** La voix dit "Ces deux récits" (pluriel) puis "D'un côté... De l'autre". Si les deux éléments visuels apparaissent en même temps au début, on rate le beat "d'abord il y a le constat général, ensuite la dichotomie".
**Décalage :** Le visuel doit **précéder** la voix de 2-3 frames (votre principe "l'image précède la voix").

**Piste concrète (beat par beat) :**
- **00:00 (Ces deux récits)** : Apparition du **système** (grille qui se dessine, 5 frames avant la voix).
- **00:04 (D'un côté)** : Apparition du premier élément (feuille A, ombre A, ou icône rouge qui se détache).
- **00:12 (De l'autre)** : Apparition du second élément avec un **son de "clic" visuel** (scale 1.2 → 1 spring rapide) pour marquer le contraste.
- **00:20 (Mais la réalité)** : **Freeze** de 3 frames puis accélération brutale (spring damping: 10) vers la fracture. Le silence visuel avant l'explosion crée le soulagement demandé.

## 3. TRANSITIONS vs ÉTATS
**Le problème :** Risque de "diapos" si les mouvements s'arrêtent entre les segments (ex: les feuilles arrivent, s'arrêtent, puis bougent). C'est le **"stop and go"** amateur.
**Temps morts :** Entre 20s et 32s, si la fracture est statique pendant que la voix dit "en direct", on perd la tension.

**Piste concrète :**
- **Pas de vélocité nulle.** Même quand le narrateur parle lentement, les éléments doivent respirer (micro-movement `sin(frame * 0.05) * 2` sur la position Y).
- **La fracture est une animation continue :** Elle ne s'ouvre pas en une fois. À 26s, elle pulse (scaleX oscillation amortie spring), à 30s elle s'élargit définitivement. Entre 20 et 32s, c'est un **processus**, pas un état.

## 4. AI-SLOP (Test technique)
**Ce qui crie "IA générée" :**
- **Couleurs saturées flottantes :** Si le rouge crise #b23a2e est utilisé pur sans être mélangé au grain ou à la grille, il ressemble à un PNG clipart importé dans un template Canva.
- **Easing linéaire ou ease-in-out basique :** `transition: all 0.3s ease` = mort du premium. Le mouvement mécanique sans overshoot spring fait "PowerPoint 2003".
- **Éléments flottant sans ombre/projection :** Des icônes Lucide qui flottent sur le fond sans réaction avec la grille (pas de changement de couleur qu'elles passent sur une ligne de grille, pas de reflet).
- **Grain statique :** Si le `feTurbulence` n'est pas animé (baseFrequency qui drift légèrement toutes les 60 frames), le grain ressemble à une texture Photoshop fixe collée par-dessus — effet "filtre Instagram".

**Corrections dans votre stack :**
- **Grain vivant :** Animer le `seed` du turbulence toutes les 30 frames (`seed={Math.floor(frame / 30)}`) ou interpoler le `baseFrequency` entre 0.8 et 0.85 sur 2 secondes pour un effet "papier qui brûle/respire".
- **Spring personnalisé :** Utiliser `spring({mass: 0.5, stiffness: 100, damping: 10})` pour les apparitions (overshoot contrôlé), et `damping: 30` pour les settling.
- **Intégration des icônes :** Les icônes Luc
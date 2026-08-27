# REPRODUCTION — « Foster With Confidence » (chantier prochaine session)

> **Décision d'Aziz, 2026-08-26** : arrêter d'inventer nos propres clients fictifs et
> **reproduire de A à Z une vidéo réellement vendue sur Fiverr**. Si on reproduit
> plusieurs vidéos dans des registres différents avec notre stack, on sait qu'on est
> outillé pour la plupart des scénarios.
>
> **Pourquoi c'est un meilleur test que tout ce qu'on a fait** : jusqu'ici on notait
> notre propre copie — on choisissait le sujet, le registre, le niveau d'ambition, donc
> on ne pouvait pas vraiment échouer. Une vidéo qu'on n'a pas choisie, avec ses
> contraintes à elle, est le premier test qui peut dire non.
> **Bénéfice commercial** : « voici une vidéo vendue sur Fiverr, voici la nôtre » vaut
> mieux que n'importe quel showreel de nos capacités.

## LA SOURCE (sécurisée sur disque)
`public/_client-sim/_references/foster/foster-with-confidence.mp4`
2460×1080 · 42,75 s · 1273 frames · 62 Mo · **musique seule, ZÉRO voix off** (Whisper
ne trouve aucune parole). Produit : SaaS pour familles d'accueil au Royaume-Uni
(Ofsted, conseils municipaux, £590k de récurrent annuel).
⚠️ Provenance : lien catbox fourni par Aziz — **copié sur disque, ne pas dépendre du lien**.
⛔ **NON VERSIONNÉ** (60 Mo, `.gitignore` exclut les `.mp4`) : le fichier vit sur disque
seulement. S'il disparaît, le lien d'origine était `https://files.catbox.moe/5f5w19.mp4`
(catbox n'est PAS une archive — vérifier qu'il répond avant de compter dessus).

## NIVEAU DE RÉUSSITE VISÉ (à trancher avec Aziz avant de coder)
1. **structure** — même découpage, même rythme, même durée
2. **gestes** — chaque mouvement reproduit avec notre stack
3. **pixel** — mêmes couleurs, même typo, timing exact
→ **Reco : viser 1 + 2, le pixel est un bonus.** Une reproduction qui raconte la même
chose avec nos briques prouve l'outillage ; une reproduction au pixel prouve surtout
qu'on sait recopier.

## DÉCOUPAGE MESURÉ — 13 transitions détectées

Coupes franches (seuil 0.30) : **1,60 · 5,60 · 18,03 · 18,41 · 25,06 · 27,07 · 28,07**
Transitions douces (seuil 0.12) ajoute : 11,44 · 11,51 · 11,57 · 11,64 · 13,59 · 40,46

| # | Temps | Contenu | Moteur | Notre brique | État |
|---|---|---|---|---|---|
| 1 | 0 → 1,6 | Téléphone **+ notification Ofsted** sur le bureau, pull back reveal x2,12 | 3D + UI | `Plan01Lockscreen` | ✅ **FAIT/VALIDE** |
| 2 | 1,6 → 5,6 | ✅ **FAIT/VALIDE** — **Le décor s'allume** (bureau vu du dessus, tapis de découpe) puis **zoom continu de 4 s** jusqu'à l'intérieur de l'écran. Ellipse temporelle : 12:57 → 9:38 **sans coupe** | décor + caméra | `DeviceInScene` + décors générés | ✅ |
| 3 | 5,6 → 11,4 | Typo pure sur noir : *« Still unresolved, »* mot par mot | typo | `DeviceShowreel` ch. 3-4 | ✅ |
| 4 | 11,4 → 13,6 | **6 portraits d'enfants** en couronne autour de « Assembles », fond dégradé vert | images + compo | ⚠️ **à générer (Gemini)** | 🔶 |
| 5 | 13,6 → 18,0 | Suite typo sur dégradé vert | typo + fond | `GridBackdrop` (variante dégradé à faire) | 🔶 |
| 6 | 18,0 → 18,4 | **Google Earth**, vue satellite du Nebraska avec labels | carte | **Mapbox 3D** (supérieur : frame-driven) | ✅ |
| 7 | 18,4 → 25,1 | **Descente** vers une maison + **flou radial** qui masque le raccord + **vraie vidéo** de maison + cartouches iOS flottants | raccord | Mapbox + ⚠️ **clip à générer (H3)** | 🔶 |
| 8 | 25,1 → 27,1 | **Dashboard qui monte par le bas**, zoom sur les montants (£49,245 / £590,940) | UI produit | **`PageCam`** — notre point fort | ✅ |
| 9 | 27,1 → 28,1 | Transition | — | — | ✅ |
| 10 | 28,1 → 40,5 | Typo sur **dégradé vert-brun**, montée vers le CTA *« Foster With Clarity / Certainty / Confidence »* | typo + fond | idem #5 | 🔶 |
| 11 | 40,5 → 42,8 | Fondu au noir, texture pointillée | fondu | trivial | ✅ |

## LES 2 TROUS, ET LA DÉCISION D'AZIZ
1. **La maison filmée (#7)** → **Minimax H3**. Aziz : « juste les mouvements de caméra
   qui se rapprochent de la maison », donc un clip court suffit. Fiche : `memory/fiches/FICHE-CLIP-GENERE.md`.
2. **Les portraits d'enfants (#4)** → **images générées Gemini** (ce sont des photos
   fixes dans la référence, pas des vidéos). ⚠️ Passer par les templates avant tout prompt
   (règle projet : diversité des visages, ethnicity, enfant en scène — erreurs déjà payées).


## ⚠️ CORRECTIONS MESURÉES (session 2026-08-26, sur la source réelle)

**1. La source est une CAPTURE D'ÉCRAN de la page Fiverr, pas la vidéo brute.**
L'interface du lecteur (croix, « 7 of 20 », barre de progression, témoignage client)
recouvre la **première seconde** ; le watermark `fiverr.` reste tout du long.
⛔ Impossible d'obtenir mieux : le clic qui lance la lecture EST ce qui fait apparaître
le lecteur (constaté par Aziz). Le lien catbox répond toujours mais rend le **même
fichier** (MD5 `3945894a5d3bf232e9d11f580df2d721`) — inutile de re-télécharger.
ℹ️ Gotcha catbox : `HEAD` renvoie `content-length: 0` alors que le `GET` rend bien les
62 Mo. **Ne jamais conclure « lien mort » sur un HEAD.**
→ Le plan #1 reste **jugeable** : le téléphone est dégagé sur presque toute sa hauteur.
Sa validation se fera sur la **zone centrale**, pas sur le cadre entier.

**2. Le plan #1 ne contient PAS « un téléphone seul sur noir ».** Il contient :
- écran verrouillé iOS, « Wednesday 7 September », **12:57**, 4 widgets circulaires
- ⭐ **une notification — le vrai contenu du plan, absent du découpage initial** :
  « **Head Of Service — Ofsted are coming. Can you assemble an evidence pack?** »
  (avatar rond, pastille verte). C'est l'accroche narrative de toute la vidéo.
- le fond n'est pas noir plat : des **éclats bleus** apparaissent dès 0,5 s
- l'**allumage du décor appartient au plan #1** (montée mesurée 0,53 s → 1,20 s),
  pas au plan #2.

**3. La coupe de 1,602 s est RÉELLE** (score 0,60 mesuré sur la zone centrale propre,
hors overlay — vérifié, ce n'est pas un artefact de l'interface).
⛔ Mais ce n'est **pas** « un zoom continu de 4 s » comme l'indiquait le tableau :
c'est une **COUPE CUT EN AVANT** — saut d'échelle sec du plan large (bureau vu du
dessus) au **très gros plan sur la notification**. Le resserrement se poursuit ensuite
progressivement, et vers **2,20 s un « I'll » s'écrit** sous la notification (quelqu'un
tape une réponse).

**4. Reste à re-vérifier** : les autres transitions du tableau ont été mesurées sur la
surface entière, interface comprise. Les re-mesurer sur la zone centrale au fur et à
mesure des plans.

## DÉCISIONS D'AZIZ (2026-08-26)
- **Niveau visé : structure + gestes.** Le pixel est un bonus.
- **Validation : côte-à-côte réf/nôtre à chaque plan**, séquentiellement, avec un point
  de contrôle entre chaque.
- **Contenu reproduit tel quel** (même produit, mêmes textes Ofsted, mêmes montants) —
  l'argument commercial « voici la vidéo vendue, voici la nôtre » exige la comparaison directe.
- **Branche : `feat/repro-foster`.**


## ⭐⭐ LE PLAN 1 EST UN PULL BACK REVEAL — 4 corrections apportees par Aziz (2026-08-26)

> ⛔ **La v1 etait FAUSSE sur le geste principal, pas juste imparfaite.** J'ai lu
> « le decor s'allume » dans le tableau de decoupage et reproduit un allumage SANS
> mouvement de camera. Le tableau decrivait ce qui CHANGE A L'ECRAN, pas le GESTE.
> **Lecon transposable aux 10 plans suivants : mesurer le geste avant de coder,
> le decoupage ne le donne pas.**

Les 4 points, tous **mesures** sur la reference :

1. **PULL BACK REVEAL x2,2** (mesure a la regle, plein cadre) :
   largeur du chassis 342 px a t=0,05 s -> 322 px a 0,60 s -> **155 px a 1,45 s**.
   Le recul est concentre **entre 0,9 et 1,3 s** ; avant, le cadrage bouge a peine.
   ⛔ **Se code par la DISTANCE CAMERA** (camZ 3.5 -> 8.4), jamais par le scale du
   groupe 3D : scale-er le groupe fausse l'echelle reelle calculee et l'effet est
   bien trop faible (constate au rendu v3).
   ⛔⛔ **Et l'echelle se calcule a la distance FINALE**, pas a `camZ` courant —
   sinon le telephone garde la meme taille a l'ecran et le pull back s'annule.

2. **L'ECRAN EST VIVANT** — la notification s'ECRIT en 3 temps :
   bulle vide (0,05 s) -> « Head Of Service / Ofsted » (0,30 s) -> phrase complete
   (0,60 s). 3 plaques capturees via `?state=0|1|2`, pas une image fixe.
   (Pattern `row-embed` du socle shotcraft : decoupage de plaque, jamais redessin.)

3. **LE « SPLASH » = une rampe qui ACCELERE puis s'ARRETE NET.** Luminance globale
   mesuree frame par frame : +0,4/frame a 0,1 s, +3 a 0,9 s, **pic a +10,8 a 1,10 s**,
   puis **plateau parfait** des 1,20 s (delta < 0,1). Ce n'est PAS un fondu lineaire.
   -> `Easing.in(Easing.cubic)` + clamp.

4. **LA POSE / LE REBOND** — ⚠️ **honnetete de mesure** : je n'ai PAS pu prouver un
   overshoot franc. Ce qui est mesurable est une forte deceleration qui se cale a
   1,30 s. La 1re seconde etant recouverte par l'interface Fiverr, et tout detecteur
   global derapant quand le decor s'allume, la question reste ouverte.
   Decision d'Aziz : **`spring()` a depassement leger, on juge au rendu.**

### ⛔ Les mesures automatiques qui ONT ECHOUE sur cette matiere (ne pas refaire)
Detection de bords par gradient, seuillage du blanc, FFT sur la periode des carreaux :
**toutes derapent des que le decor s'allume** (elles attrapent le tapis au lieu du
telephone ; une a donne « x2,55 » et une autre « 79 px » au lieu de 214).
✅ **Ce qui marche : tracer une grille de reperes sur la frame et mesurer a l'oeil.**
(`grid_cmp.png` — regle rouge tous les 192 px sur un cadre 1920.)

### Detail visuel note au passage
Les « eclats bleus » derriere le telephone sont des **fragments geometriques nets
disposes en anneau** (visibles a 0,60 s), pas un halo diffus.


## ✅ PLAN 1 — VALIDE PAR AZIZ (2026-08-26)

**Verdict** : « on peut considerer qu'elle est assez proche de la reference sans etre
100 % la meme chose — **c'est notre version differente qu'on livrerait** ».
Livrable : `out/episodes/foster-repro/plan01-FINAL.mp4` (48 frames, 1,602 s).

**Ce qui a ete valide explicitement** :
- le **pull back reveal** (plein ecran -> recul successif) : « une autre version, elle
  fonctionne, elle est fonctionnelle »
- la **transition du noir a la table** : « fonctionne bien aussi »
- le **cadrage de depart moins serre** que la reference : accepte tel quel, ce n'est
  **pas** un defaut a rattraper (notre version laisse lire la notification plus tot).

⭐ **REGLE DE CADENCE POSEE PAR AZIZ** : « pas la peine de devenir fou avec » sur un
plan de moins de 2 secondes. Le contrat est **structure + gestes**, pas le pixel —
une variante qui tient le meme role narratif dans la meme duree REMPLIT le contrat.
⛔ Ne pas relancer d'iteration de finition sur un plan deja fonctionnel : passer au suivant.

⚠️ **Consequence pour la suite** : cette version devient la **reference interne**. Le
plan 2 etant un TRES GROS PLAN sur la notification, verifier a ce moment-la que le
raccord tient avec notre cadrage de fin (plus large que celui de la reference).
Ne pas prejuger : c'est une verification, pas un probleme connu.


## ⭐⭐ LE PLAN 2 N'EST PAS « DE LA TYPO » — c'est LA SUBMERSION (mesure 2026-08-26)

> ⛔ Le tableau de decoupage annoncait pour ce segment « typo pure sur noir, mot par
> mot ». **FAUX.** Le plan 2 (1,602 -> 5,597 s, borne de fin RE-MESUREE sur la zone
> centrale propre : score 0,68) est le coeur narratif de la video.

**Ce qui s'y passe reellement** — une conversation en direct, puis l'ensevelissement :

| t (abs) | evenement |
|---|---|
| 1,602 | **COUPE FRANCHE en avant** (saut d'echelle sec, PAS un zoom continu) |
| 2,05 | « I'll » commence a s'ecrire **DANS la bulle de la notification Ofsted** |
| 2,35 | « I'll see » |
| 2,50 | « I'll see how long » |
| 2,65 | « I'll see how long it » + **le bouton bleu REPLY apparait** |
| 3,00 | « I'll see how long it takes » (phrase finie) |
| 3,80 | + « You got a new mail » — badge **11+** |
| 4,30 | + « You got a new message » — badge **13+** |
| 4,80 | + « You got a new mail » — badge **17+** |
| 5,597 | coupe |

⭐⭐ **LES BADGES MONTENT : 11+ -> 13+ -> 17+.** Le compteur grimpe pendant qu'on
regarde. C'est LE detail qui raconte la submersion — on repond a une demande et on
est enseveli. **C'est exactement le probleme que le SaaS pretend resoudre**, montre
au lieu d'etre dit.

**Details de mecanique mesures** :
- ⛔ La reponse vit **DANS la meme bulle** que la notification (y~540/1080), ce n'est
  pas un champ de saisie separe : la notification s'ETEND pour l'accueillir.
- La frappe : 27 caracteres en 0,95 s ≈ **1,05 frame/caractere** — plus rapide que la
  regle des 3 f/car du socle shotcraft — et **les mots arrivent par GROUPES**.
  -> on bascule entre **9 plaques capturees** (`?state=r0..r5,s1..s3`), on ne simule
  pas une frappe caractere par caractere.
- La vue **DESCEND** quand la pile grandit (a 4,10 s la notif Ofsted sort par le haut).

**⛔ Piege de cadrage paye ici** : une plaque 1179x2556 calee en hauteur sur le cadre
montre son CENTRE (y=1278) — soit le bas du fond d'ecran, **aucune notification
visible**. Les cartes vivent entre y=300 et y=1055 (bbox relevees a la capture dans
`stack-layout.json`) => centre reel y=640. **Le cadrage se CALCULE sur les bbox, il
ne se dose pas.** Meme famille d'erreur que le camZ mort du plan 1 : une valeur qui
n'atteint pas le rendu.

**Raccord verifie** : la coupe etant un saut d'echelle tres violent, notre fin de
plan 1 (plus large que la reference) **ne se voit pas**. Ce qui compte est le
contraste entre les deux echelles, aussi fort chez nous.


## ✅ PLAN 2 — VALIDE PAR AZIZ (2026-08-26)

Livrable : `out/episodes/foster-repro/plan02-FINAL.mp4` (120 frames, 3,995 s).
Verdict : « beaucoup mieux, ca correspond a ce qui est dans la video initiale.
Ce n'est pas parfait mais ca se rapproche beaucoup — assez bon pour continuer. »

⭐⭐ **CE QUI A FAIT BASCULER LE PLAN (retour d'Aziz, a retenir pour TOUS les plans
d'ecran)** : sans le CHASSIS et le TAPIS autour, les notifications avaient l'air de
« cartes qui apparaissent sur un fond noir », pas d'un telephone. **Ce n'est pas la
taille du texte qui fait lire « telephone », c'est le contexte autour de l'ecran.**

⛔⛔ **MON ERREUR DE RAISONNEMENT, a ne pas refaire** : j'avais code les bandes de
chassis, constate qu'elles n'apparaissaient pas, et conclu qu'il fallait les
**SUPPRIMER**. La vraie cause etait que l'ecran faisait 2458 px de large sur un cadre
de 1920 — il DEBORDAIT et les recouvrait. **J'ai supprime le bon element au lieu de
corriger la taille.** Quand un element code n'apparait pas : mesurer ce qui le
recouvre AVANT de conclure qu'il est inutile.

**Geometrie de reference pour tout plan d'ecran de telephone** (mesuree a la regle,
cadre 1920) : tapis 0..430 | chassis 430..490 (~55 px) | **ECRAN 490..1440 = 950 px
(49 % du cadre)** | chassis 1440..1490 | tapis 1490..1920.

⛔ **3 tentatives ratees sur une bande noire au bord droit** avant de mesurer. La
mesure (noir PUR (0,0,0) de x=1606 a 1919 => c'est le fond de l'AbsoluteFill, donc le
decor ne couvre pas) a tranche en 1 passe. **Le protocole disait de mesurer des le
2e echec — pas applique a temps.**
✅ Fix generique : pour une couche de fond qui doit couvrir tout le cadre, utiliser
`backgroundImage` + `backgroundSize` sur la couche, **jamais une `<Img>` positionnee
a la main** (arithmetique de position = source d'erreur repetee).


## PLAN 3 (5,597 -> 11,44 s) — LE PIVOT PROBLEME -> SOLUTION

> ⚠️ Le tableau n'avait que la MOITIE : il annoncait « typo *Still unresolved,*
> mot par mot » et placait « Introducing » dans un autre plan. **Tout est dans le
> meme plan**, et son evenement central est le BASCULEMENT NOIR -> VERT.

| t (abs) | evenement |
|---|---|
| 6,20 | « 09:00 Am » |
| 6,80 | « **04:00 Pm** » — l'heure a CHANGE : le temps passe, la demande reste |
| 8,00 -> 9,20 | « Still unresolved, Still overwhelming » mot par mot |
| 9,80 | la phrase s'estompe, **le degrade vert monte**, « Introducing » |
| 10,40 -> 11,30 | « Introducing x FosterWith » |
| 11,44 | coupe (des rectangles blancs entrent) |

**Typo mesuree** : la phrase occupe **55 % de la largeur** du cadre => police
**70 px** (62 px donnait 48,4 %). Ligne placee a **46,5 %** de hauteur, pas 50 %.
⭐ Les mots deja poses restent BLANCS, celui qui arrive est GRIS puis s'eclaircit —
ce n'est pas un fondu global, c'est ce qui donne la sensation d'ecriture.

### ⛔⛔ LE DEGRADE VERT : la FORME etait fausse, pas le dosage (3 versions)
v1 trop saturee, v2 sur-corrigee dans l'autre sens — **l'aller-retour classique**.
La sortie est venue d'une MESURE du profil vertical (canal vert moyen par bande de
10 % de hauteur) :

| bande | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
|---|---|---|---|---|---|---|
| REF | 12 | 28 | 42 | 58 | **59** | **49 (redescend)** |

⭐ **Ce n'est PAS un halo centre sous le cadre** (ce que modelisaient mes v1 et v2,
donc aucune ne pouvait tomber juste) : c'est une **BANDE lumineuse dont le coeur est
a 85 % de hauteur et qui s'attenue au bord inferieur**. Modelise en
`linear-gradient` a paliers cales sur ces valeurs.
Puis intensite divisee par **2,55** (facteur mesure au rendu : 159 de vert moyen au
coeur contre 59 attendu). Resultat final : ecart de -2 a +3 par bande.

**Lecon** : quand deux dosages successifs ratent dans des sens opposes, ce n'est pas
le dosage — **c'est la forme du modele**. Mesurer un PROFIL, pas une valeur.


## PLAN 4 (11,44 -> 13,59 s) — « ASSEMBLES » : NOTRE VERSION ILLUSTREE

**Mecanique** : 6 vignettes se posent UNE PAR UNE (sur ~1,2 s, rythme mesure par
comptage de zones claires frame par frame) en couronne autour du mot « Assembles »,
legerement inclinees, cadre blanc facon polaroid — puis TOUT DISPARAIT d'un coup a
13,59 s. Ca raconte **l'assemblage d'un dossier de preuves** : chaque vignette est
une piece. C'est le sens du mot.

### ⭐⭐ DECISION D'AZIZ : illustration vectorielle, PAS de photos
La reference utilise des PHOTOS d'enfants (portraits cadres serres). Nous utilisons
des **illustrations vectorielles generees par Gemini** (Lite, 1 planche de 6
vignettes decoupee — 1 seul appel).
- **Pourquoi** : des photos d'enfants generees posent une question de droit a
  l'image et de realisme trompeur qu'un client B2B souleverait. L'illustration
  l'evite, et c'est defendable comme parti pris.
- ⛔ **Le SVG pur a ete ECARTE par Aziz** : notre doctrine dit deja que l'organique
  (figures humaines) n'y fonctionne pas. **J'avais propose des « scenes SVG avec
  figures d'enfants » — ca allait contre ce qu'on sait deja.** Correction d'Aziz.

### ✅ FAIT VERIFIE : GEMINI NE CENSURE PAS LES ENFANTS
Test reel du 2026-08-26 : `gemini-3.1-flash-lite-image`, prompt decrivant 6 enfants
(ages, morphologies, teints varies) en style vectoriel plat -> **image generee,
AUCUN refus**. Info reutilisable sur d'autres projets.
⚠️ Passer par le template (`memory/templates/narratif.md`) reste obligatoire :
« pas d'enfants sauf si le script le demande » — ici le script le demande (SaaS pour
familles d'accueil), et « diversite des visages : chaque individu decrit separement »
evite 6 clones.

### ⛔⛔ POSITIONS : 3 relevés, et le bon diagnostic n'etait pas celui que je voyais
1. releve sur grille grossiere (96 px) -> faux, vide a gauche + chevauchement.
2. releve sur grille fine (48 px) -> nuage juste, mais **il SEMBLAIT decale a droite**.
3. ⭐ **Verification par CALCUL avant de corriger** : centre de gravite du nuage a
   **+8 px du centre du cadre** — il etait DEJA centre. Le vrai defaut etait
   l'**AMPLITUDE** : la reference etale sur 970 px en x, nous sur 660.
   **Un nuage centre mais trop compact SE LIT comme decale. Le recentrer aurait
   empire les choses.**

⭐ **Regle qui se confirme (2e fois apres le degrade vert du plan 3)** : ce que je
prends pour un probleme de POSITION ou de DOSAGE est souvent un probleme de FORME
ou d'AMPLITUDE. Calculer une statistique globale (centre de gravite, profil) AVANT
de corriger ce qu'on croit voir.


### ⭐⭐⭐ LES VIGNETTES ORBITENT — et comment j'ai enfin cale le mouvement

**Retour d'Aziz sur la v3** : « les images tournent dans une sorte de cercle autour
du mot. On a presque la meme chose mais sans l'animation. **Ca fait une version
cheap, ce n'est pas du tout pareil.** » Mes vignettes se posaient puis restaient
FIGEES — defaut de fond, pas de detail.

**Mesure du mouvement reel** (centre de gravite + rayon moyen des pixels clairs du
nuage, mot et watermark masques — methode robuste, pas besoin d'identifier chaque
vignette) :
| t | 12,60 | 12,92 | 13,08 | 13,40 | 13,48 |
|---|---|---|---|---|---|
| rayon moyen REF | 443 | 401 | 394 | 385 | 381 |

=> **CONTRACTION EN SPIRALE** : elles convergent vers le mot en tournant, et ca
s'amortit. Le mot reste FIXE. Positions reecrites en POLAIRE (angle + rayon), ce qui
est ce qui permet d'orbiter (conversion verifiee : < 10 px des positions relevees).

### ⛔⛔ 4 ITERATIONS DANS LES DEUX SENS AVANT DE RESOUDRE — la vraie lecon
v4 : contraction 5x trop faible (-2,7 % contre -13,1 %).
v5 : mieux, mais la contraction demarrait a la pose de CHAQUE vignette -> les
     dernieres n'avaient pas le temps de converger. Passee au temps du PLAN.
v6 : partait trop serre (410 contre 443) — la contraction avait deja tout consomme.
v7 : **sur-corrige** (496 contre 443), ecart moyen 64 px.
v8 : ✅ **RESOLU** — 2 cibles mesurees (443 px a 12,60 s, 385 px a 13,40 s), 2
     inconnues (R0, CONTRACT), 2 equations => CONTRACT = 0,247, R0 moyen = 474.
     Verifie par calcul AVANT de rendre : 443,1 et 385,1. Ecart mesure au rendu :
     **11,4 px de moyenne** (contre 64,3 en v7).

⭐⭐⭐ **REGLE (3e occurrence dans cette session, apres le degrade vert et le nuage
"decale")** : quand deux corrections successives ratent dans des SENS OPPOSES, le
probleme n'est pas la valeur — **poser le systeme et le RESOUDRE** (N cibles
mesurees, N inconnues) au lieu d'ajuster un parametre de plus. Le protocole projet
dit de deleguer/changer de methode des le 2e echec : je ne l'ai applique qu'au 4e.

**Typo** : 70 -> 88 px (retour d'Aziz : « le mot au milieu devrait etre plus grand »).


### ⛔⛔⛔ J'AI MESURE LE RAYON ET INVENTE LA VITESSE — l'erreur la plus instructive

**Retour d'Aziz sur la v8** : « la vitesse de rotation est beaucoup plus lente que
dans la reference, ca devrait etre 2 a 3 fois plus rapide, la c'est presque statique ».

**Ce que j'avais fait** : mesure rigoureuse de la CONTRACTION du rayon (4 iterations,
resolution d'un systeme a 2 inconnues)... et dans le meme fichier, `ORBIT_DEG_PER_SEC
= 11` pose **au juge**, avec en commentaire une justification inventee : « rotation
lente : le nuage tourne, il ne file pas ».

**Mesure reelle** (angle du centre de gravite du nuage frame par frame — il tourne a
la meme vitesse que les vignettes puisque le nuage n'est pas symetrique) :
valeurs de **30 a 152 deg/s, moyenne 83, mediane 89** => un **DEMI-TOUR (180 deg)**
sur les 2,15 s du plan. J'etais **7,5x trop lent**.

⭐⭐⭐ **LA LECON** : mesurer UNE dimension d'un mouvement ne dit rien des autres.
Un mouvement composite (ici rotation + contraction) doit etre mesure **sur chaque
composante separement**. Le pire signal d'alerte : **un commentaire de code qui
JUSTIFIE une valeur jamais mesuree** (« pour que ca ne file pas ») — c'est une
rationalisation, pas une donnee. Grep les commentaires de ce type dans un fichier
ou l'on vient de mesurer autre chose.

2e correction du meme retour : la rotation etait pilotee par le temps depuis la pose
de CHAQUE vignette, donc les dernieres arrivees repartaient de leur angle initial.
Aziz : « la rotation devrait tenir durant toute la duree de la scene » -> pilotee par
le temps du PLAN. Une vignette qui arrive tard rejoint un nuage DEJA en rotation.

⚠️ Reste un ecart visible : nos vignettes se CHEVAUCHENT plus que dans la reference,
qui reste plus aeree (lie au resserrement du nuage, pas a la rotation).


## PLAN 5 (13,59 -> 17,40 s) — LE DIAGRAMME DU SYSTEME, PUIS LA PLONGEE

⛔ Le tableau annoncait « suite typo sur degrade vert ». **FAUX sur toute la ligne.**
Le plan contient un **DIAGRAMME CIRCULAIRE des acteurs du placement familial** :
« FosterWith » dans un disque blanc au centre, orbite pointillee, et 4 etiquettes —
**FOSTER CARER · COUNCILS & IFAS · SOCIAL WORKER · CHILD**. Puis un zoom traversant
plonge dans le disque. Et le degrade est **DORE**, pas vert (le vert etait au plan 3).

### ⭐⭐⭐ PREMIER PLAN AVEC ANALYSE/ANIMATION SEPAREE — et ca a paye immediatement
Protocole propose par Aziz, outil : `scripts/tools/motion-breakdown.py` (Gemini
video native + GPT frames 6 fps, en parallele, **63 s**).
**4 details releves par les modeles que j'aurais rates** :
1. le texte **CHANGE DE COULEUR** (« Foster » noir sur le disque blanc -> gris clair
   une fois le disque parti). Sans ca il devient invisible.
2. **PARALLAXE** : le disque grandit BEAUCOUP plus vite que le texte qu'il contient.
   Ils ne sont pas solidaires.
3. **FONDU CROISE** texte/globe, pas une coupe.
4. les etiquettes **NE TOURNENT PAS sur elles-memes** — leur texte reste horizontal.
   (Exactement le type de detail rate au plan 4.)
⛔ **Aucun modele n'a donne une seule VALEUR** — tous les chiffres viennent de mes
mesures. C'est la repartition juste : **ils decrivent QUOI, je mesure COMBIEN.**
✅ GPT a vu **4 etiquettes**, Gemini seulement 3 : la double voix se justifie.

### MESURES
- Disque : 13 px -> **PIC A 245** vers 13,95 -> se cale a **210**. C'est un `spring`
  avec OVERSHOOT, pas un grossissement simple.
- Orbite : ellipse centree (910,540), rayons 300 x 330 (decentree a gauche du disque).
- Etiquettes, apparition mesuree, **intervalle regulier de 0,26 s** :
  FOSTER CARER 14,47 · COUNCILS 14,73 · SOCIAL WORKER 14,99 · CHILD 15,25.
- Texte final : **30,3 % de la largeur** du cadre (le mien faisait 40,8 % => x0,74).

### ⛔⛔ LE DEGRADE DORE : 3 VERSIONS, ET LA LECON PORTE SUR LA MESURE ELLE-MEME
1. `linear-gradient` : bord horizontal NET, la reference est diffuse.
2. `radial-gradient` centre : clair au CENTRE, sombre aux BORDS.
3. ✅ `linear` tres etale : une NAPPE qui couvre tout le bas.

⭐⭐⭐ **Le profil par BANDES HORIZONTALES donnait des valeurs quasi identiques**
(ecarts de 1 a 15 sur 26..186) — j'en avais conclu « le dore est deja juste ».
**Il ne l'etait pas : une moyenne par bande ne voit PAS la forme.**
C'est le profil par **COLONNES** qui a tranche :
| | gauche | centre | droite |
|---|---|---|---|
| REF | 199 | 149 | 210 |
| v3 | 77 | 147 | 77 |
=> la reference est **plus lumineuse AUX BORDS qu'au centre** : ce n'est pas un halo,
c'est une nappe. (Le creux central vient du TEXTE qui masque le dore, pas du degrade.)

**REGLE** : mesurer ne suffit pas — il faut **mesurer selon le BON AXE**. Une
statistique aveugle a la difference reelle donne une fausse validation.

## CE QUI EST DÉJÀ PRÊT (acquis de la session 2026-08-25/26)
- `devices/PhoneModel` · `LaptopModel` — mockups procéduraux, écran = zone d'accueil
- `devices/DeviceInScene` — objet posé dans un décor, ombre 3 couches, allumage 0,30 s
- `devices/DeviceShowreel` — texte derrière / à côté, rotations
- `devices/FlatDeviceMotion` — matériau aplati (le défaut retenu)
- `devices/GridBackdrop` — fond SVG à 6 paramètres
- Shotcraft : `PageCam`, `FlashCut`, `DigitRoll` + captures desktop ET mobile
- SFX : `public/_client-sim/noteshield/sfx/` (19 fichiers)

## ⛔ LES PIÈGES DÉJÀ PAYÉS SUR CETTE VIDÉO
- **Ne PAS juger sur des frames espacées.** J'ai analysé cette vidéo sur 16 frames sur
  1273 (une toutes les 2,7 s) et raté l'essentiel : les 12 transitoires sonores en 8 s,
  les micro-états, l'ellipse temporelle dans le zoom. **Juger un montage sur des photos
  ne marche pas.**
- **Le flou du raccord #7 n'est pas décoratif** : c'est le MASQUE de la coupe entre
  Google Earth et le plan filmé. Même principe que `FlashCut`.
- **Le fond CHANGE selon le registre** (noir plat pour l'objet, dégradé vert pour le
  produit). « Fond uni toujours » était une généralisation abusive tirée de Comma.
- **12 transitoires sonores en 8 s** : chaque apparition a son SFX. C'est ce qui rend
  « vrai ». ⛔ Pas de whoosh sur une UI.

## PREMIÈRE ACTION DE LA PROCHAINE SESSION
Trancher le niveau de réussite visé, puis attaquer dans l'ordre du découpage —
les plans ✅ d'abord (ils valident le rythme), les 🔶 ensuite (ils demandent des assets).

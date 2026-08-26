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
| 2 | 1,6 → 5,6 | **Le décor s'allume** (bureau vu du dessus, tapis de découpe) puis **zoom continu de 4 s** jusqu'à l'intérieur de l'écran. Ellipse temporelle : 12:57 → 9:38 **sans coupe** | décor + caméra | `DeviceInScene` + décors générés | ✅ |
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

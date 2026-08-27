# REPRODUCTION — « Foster With Confidence »

## ⚡ REPRISE : COMMENCER ICI (session du 2026-08-27)

**Etat : 9 plans sur 11 CODES — 28,07 s / 42,75 s = 66 %.**
⚠️ Le plan 9 (`plan09_v3`) est code et mesure, **en attente de validation d'Aziz**.
Livrables valides : `plan0{1..8}-FINAL.mp4` (les plans 6, 7 et 8 ont ete promus).
Code : `src/projects/_client-sim/foster/scenes/Plan0{1..8}*.tsx`
Branche : `feat/repro-foster`.

⚠️ **La branche a change sous nos pieds en pleine session** (un chantier parallele
a bascule le working tree sur `chore/memoire-eviction-contexte`). Verifier
`git branch --show-current` AVANT de commiter.

### ⚡ LA PROCHAINE SESSION — 3 PLANS, PUIS L'AUDIO
Decision d'Aziz (27/08) : **s'arreter ici et finir dans une session fraiche**,
plutot que d'attaquer la fin avec un contexte sature.

| # | Bornes | Contenu | Notre brique | Difficulte |
|---|---|---|---|---|
| 9 | 27,07 -> 28,07 s | ✅ CODE — la plaque Billing vue EN ENTIER, pan horizontal pur | `Plan09PullBack` (PageCam) | faite |
| 10 | 28,07 -> 40,46 s | Typo sur degrade vert-brun, montee vers le CTA « Foster With Clarity / Certainty / Confidence » | meme moteur que les plans 3 et 5 (typo) | **le plus long : 12,4 s** |
| 11 | 40,46 -> 42,75 s | Fondu au noir, texture pointillee | trivial | faible |

⭐ **MESURE UTILE POUR LE PLAN 10** : sa 1re frame (28,067 s) porte DEJA le mot
« Not » — la typo du CTA commence donc par une phrase NEGATIVE, elle n'ouvre pas
directement sur « Foster With ». Fond mesure a l'entree : vert tres sombre
(16, 32, 27) de moyenne.

**PUIS** : SFX + musique sur l'ensemble, et assemblage des 11 plans.
⛔ Rappel de la fiche UI-PRODUIT : **PAS de whoosh sur les coupes d'UI** (retire
apres un retour d'Aziz — c'est un vocabulaire de mouvement physique sans rapport
avec un logiciel). Le FlashCut visuel suffit.
⚠️ L'assemblage est un point de vigilance connu : verifier `nb_frames` sur le flux
VIDEO et hasher un echantillonnage dense — un concat casse peut figer l'image en
gardant l'audio normal, indetectable sur des frames isolees.

### ⭐ LE PROTOCOLE, TEL QU'IL DOIT ETRE APPLIQUE (corrige par Aziz le 27/08)
1. `motion-breakdown.py` AVANT de coder — **3 voix** (Gemini video + GPT frames +
   **GROK frames**, ajoute le 27/08 : le plus riche des trois).
2. **Trier le releve en 3 categories** : ce qu'eux seuls voient (PRENDRE) ·
   proportions (CIBLE puis verifier) · dynamique (MESURER soi-meme).
3. **Chercher la brique EXISTANTE avant de coder** — c'est la lecon du plan 8.
   ⛔ Si je me bats 2 fois contre l'outil, je prends le probleme a l'envers :
   adapter l'ENTREE a ce que le socle sait faire, pas contourner le socle.
4. Coder, rendre, mesurer.
5. ⭐⭐ **RAPPELER l'appel externe EN COURS de correction**, pas seulement au
   demarrage (5 rendus perdus au plan 7 faute de l'avoir fait).
6. ⭐⭐ **Reprendre le releve LIGNE PAR LIGNE avant de declarer fini.**

### ✅ PLAN 9 — CODE ET MESURE (27/08), en attente de validation
`Plan09PullBack.tsx` · 30 frames · `plan09_v3.mp4`.

⛔⛔ **LE TABLEAU DISAIT « transition (1 s) » : C'EST UN PLAN A PART ENTIERE** — la
plaque Billing vue EN ENTIER, dernier temps du dashboard. Les 2 coupes qui
l'encadrent sont franches et mesurees (diff inter-frames 94,3 a 27,067 s et 150,5
a 28,067 s, contre ~3 hors coupe).

⭐⭐ **ET CE N'EST PAS UN PULL BACK, MALGRE L'IMPRESSION.** La bbox de la plaque
mesuree frame par frame donne **W = 1678 et H = 904, CONSTANTS a 1 px pres** sur
toute la duree : c'est un **PAN HORIZONTAL PUR** de 79 px vers la gauche, fortement
amorti (55 px dans les 200 premieres ms). Le sentiment d'ouverture vient de la
COUPE qui precede, pas d'un mouvement d'echelle. J'ai failli coder un dezoom —
c'est exactement le piege n°2 de ce fichier (« ne jamais convertir une impression
en facteur sans mesurer le rapport reel »), evite cette fois-ci par la mesure.

**Resultat mesure** : largeur a 1 px de la reference (1679 vs 1678), positions de
depart et d'arrivee exactes, ecart moyen 5 px sur x0 (concentre au milieu du
mouvement : notre exponentielle descend un peu plus vite). Easing retenu :
`Easing.out(Easing.exp)` — la decroissance mesuree va de 8,00 a 0,02 en 30 frames.

### ⭐⭐⭐ LE VRAI ENSEIGNEMENT DU PLAN 9 : UN TROU CACHE PAR LE CADRAGE DU PLAN 8
La v1 sortait une plaque dont **tout le bas etait un aplat creme**. Diagnostic :
l'etat `billing` de `live-page/billing.html` **n'a jamais contenu le tableau des
lignes** — il s'arretait au titre « Per-council billing ». Le plan 8 ne l'avait
jamais montre parce qu'il zoome a 1,55 sur les montants du HAUT : le vide restait
hors cadre. Le plan 9, qui cadre la plaque entiere, l'a expose.
⭐ **Un defaut d'asset peut dormir plusieurs plans avant d'etre vu — ce n'est pas
le plan qui le revele qui l'a introduit.** Le tableau (7 lignes, colonnes COUNCIL /
PACKAGE / MONTHLY / ANNUAL / STATUS) a ete ajoute a la page et la plaque recapturee.

⚠️ **CONSEQUENCE SUR LE PLAN 8, A ARBITRER PAR AZIZ** : `dash-billing.png` est la
plaque que le plan 8 utilise DIRECTEMENT. Le re-rendu du plan 8 donne une diff
moyenne de 8 a 9 (donc non nulle) : son bas de cadre, jusqu'ici vide, affiche
desormais le tableau. Cadrage, pan et montants sont inchangés — verifie sur 3
frames. C'est une amelioration, mais elle touche un plan DEJA VALIDE : ne pas
re-promouvoir `plan08-FINAL.mp4` sans l'accord d'Aziz.

⛔ **ECART ASSUME (non corrige)** : notre fenetre d'app a un ratio de **1,904**
contre **1,856** pour la reference — a largeur egale elle est **22 px trop plate**
(2,4 %), et son contenu demarre ~70 px plus bas. La cause est la FORME de la
fenetre dans la page HTML, pas le cadrage (ni le zoom ni le cy n'y changeraient
rien). Corriger imposerait de retoucher le CSS et de recapturer les plaques du
plan 8 valide. Vu le contrat (structure + gestes) et la regle de cadence d'Aziz
sur les plans courts, laisse tel quel.

⛔ **Gotcha outil rencontre** : `puppeteer` n'est PAS installe dans ce projet (ni
localement ni en global) — `capture-foster-billing.mjs` echoue en
`ERR_MODULE_NOT_FOUND`. Les NAVIGATEURS, eux, sont en cache. Capture faite en
ligne de commande, sans rien installer :
`~/.cache/puppeteer/chrome-headless-shell/mac_arm-152.0.7977.54/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --force-device-scale-factor=2 --window-size=1920,1080 --screenshot=<out> <url>`
(les erreurs `CVDisplayLinkCreateWithCGDisplay` sont cosmetiques sur macOS.)
⚠️ Ce chemin de contournement ne regenere PAS `dash-layout.json` ni les decoupes —
verifie : layout identique, MD5 des decoupes inchanges, donc plan 8 non impacte
au-dela de la plaque elle-meme.

⛔ **Contrainte structurelle trouvee par le calcul, pas par le dosage** : a la bonne
echelle, le bord gauche de la page tombait **a +67 px DANS le cadre** — aucune
valeur de `cx` ne pouvait le sauver, PageCam remplissant le hors-champ avec son
`#faf7f2` (code EN DUR, aucune prop de fond). `PageCam` etant partage avec
noteshield, on n'y a pas touche : on a **adapte l'ENTREE** (regle 3 du protocole).
`dash-billing-wide.png` = la plaque elargie de 130 px de page de chaque cote,
remplis avec le PROFIL VERTICAL du fond echantillonne sur ses propres colonnes de
bord. ⚠️ `PageCam` force `width: 1920` : une plaque plus large se comprimerait,
d'ou `pageH = 951` (hauteur proportionnelle).

⚠️ **Defaut de structure repere dans `src/Root.tsx` (NON corrige, hors scope)** :
le `<Folder name="client-sim-foster">` est ouvert puis un `<Folder
name="atlas-peste-1347">` est imbrique dedans et contient les compositions Foster.
La correction annoncee en commentaire n'est appliquee qu'a moitie. La toucher
deplacerait les 9 compositions d'un coup — a faire deliberement, pas en passant.

### ✅ PLAN 8 — FAIT ET VALIDE (27/08)
2 plaques capturees + decoupes + `PageCam`. Verdict d'Aziz : « l'UI est tres bien
reproduite, je ne vois vraiment pas de difference ; tout fonctionne tres bien ».
⭐ Les 3 lecons de ce plan sont gravees hors de ce fichier, car elles depassent
Foster : `memory/fiches/FICHE-UI-PRODUIT.md` (le fond fait le plan · la borne de
pan se calcule · les bbox changent a chaque recapture) et
`memory/key-learnings.md` (se battre contre l'outil est le signal · la regression
silencieuse · quand 2 corrections ne bougent pas le chiffre).

### ✅ PLAN 7 — FAIT ET VALIDE (27/08)
Clip MiniMax H3 (previs de bascule d'axe) + cartouches iOS animes.
`Plan07Maison.tsx`. 148 frames.
⚠️ **DETTE ASSUMEE, signalee par Aziz** : « la camera dans l'original s'approche
beaucoup plus vite et ralentit a la fin ; nous c'est plus lent, mais ca fonctionne
tres bien aussi ». Mesure a l'appui : Grok releve **80 % du travelling dans le
premier quart** cote reference, notre clip fait **42,6 %**. Verdict d'Aziz :
« si on avait voulu refaire on aurait pu changer cela, mais je ne pense pas que
cela vaille la peine » -> **NE PAS y revenir** sauf demande explicite.
Pour un futur previs de descente : concentrer davantage l'amortissement au debut.

### ✅ PLAN 6 — FAIT ET VALIDE (27/08)
Globe Mapbox + plongee satellite. `Plan06GoogleEarth.tsx`. Verdict d'Aziz :
« c'est du Google Earth... quasiment identique ». Les mesures et les 2 pieges
majeurs (metriques automatiques qui mentent · expression Mapbox rejetee en
silence) sont dans l'en-tete du .tsx et dans `memory/key-learnings.md`.

### LE PROTOCOLE ETABLI — a appliquer tel quel pour chaque plan restant
1. **AVANT de coder** : `python3 scripts/tools/motion-breakdown.py --video <ref>
   --start <a> --end <b> --label planNN --crop 1920:1080:270:0`
   (Gemini video + GPT frames 6 fps en parallele, ~65 s) -> quels GESTES existent,
   et desormais les TAILLES en % du cadre.
2. **Mesurer moi-meme** les valeurs (les modeles donnent des ordres de grandeur,
   pas des px). Methode fiable : **grille de reperes tracee sur la frame**, lue a
   l'oeil. Les detecteurs automatiques derapent des que le decor s'allume.
3. **Coder**, rendre, puis **`proportions-diff.py`** sur une planche A/B ->
   qu'est-ce qui n'est pas a la bonne taille, chiffre.
4. **Verifier chaque chiffre du modele avant de l'appliquer** (cf. les 2 erreurs
   systematiques plus bas).
5. Comparatif video, upload Vercel Blob, validation d'Aziz, promotion en FINAL.

### ⛔⛔ LES 5 PIEGES QUI ONT COUTE LE PLUS (relire avant de coder)
1. **`<ThreeCanvas camera>` n'est PAS reactif** — animer camZ ne fait RIEN. Le
   mouvement passe par le `scale`. -> `memory/tools/threecanvas-camera-non-reactive.md`
2. **Ne jamais convertir une impression en facteur sans mesurer le RAPPORT reel.**
   Aziz : « plus gros » -> j'ai mis 1,28 sans mesurer -> c'etait DEJA juste, et
   la vraie cause etait ailleurs (les etiquettes).
3. **Quand 2 corrections ratent dans des SENS OPPOSES : RESOUDRE, pas doser.**
   (N cibles mesurees, N inconnues, N equations.) Vecu 3 fois.
4. **Mesurer selon le BON AXE** : un profil par bandes horizontales validait a
   tort un degrade dont la forme etait fausse. Le profil par colonnes a tranche.
5. **Mesurer une dimension d'un mouvement ne dit rien des autres** : j'ai mesure
   la contraction du rayon au pixel pres et invente la vitesse de rotation
   (7,5x trop lente). Un mouvement composite se mesure composante par composante.

### ⚠️ LES 2 ERREURS SYSTEMATIQUES DES MODELES (verifier, toujours)
- **« tout est ~10 % trop bas »** : FAUX (biais du format A/B empile). Ne jamais
  appliquer une correction VERTICALE sans la remesurer.
- ils reclament le **watermark fiverr**, qu'on ne reproduit evidemment pas.
=> Les TAILLES sont fiables, les POSITIONS VERTICALES non.

---


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

⛔⛔ **LA COLONNE DE DROITE DIT « LIVRÉ ? », PAS « couvert par la stack ».** Corrigé au wrap du
27/08 : elle marquait 🔶 « à générer » sur les plans 4, 5 et 7 **déjà livrés**, et ✅ sur les
plans 9, 10 et 11 **qui restent à faire** — deux sémantiques opposées dans la même colonne, dans
le fichier que la prochaine session ouvre en premier. C'est le genre d'erreur qui fait refaire un
travail fini. ⚠️ Les bornes en **gras** ont été re-mesurées et corrigées ; celles des plans non
encore faits viennent du découpage d'origine et restent à vérifier.

Coupes franches (seuil 0.30) : **1,60 · 5,60 · 18,03 · 18,41 · 25,06 · 27,07 · 28,07**
Transitions douces (seuil 0.12) ajoute : 11,44 · 11,51 · 11,57 · 11,64 · 13,59 · 40,46

| # | Temps | Contenu | Moteur | Notre brique | LIVRÉ ? |
|---|---|---|---|---|---|
| 1 | 0 → 1,6 | Téléphone **+ notification Ofsted** sur le bureau, pull back reveal x2,12 | 3D + UI | `Plan01Lockscreen` | ✅ **FAIT/VALIDE** |
| 2 | 1,6 → 5,6 | ✅ **FAIT/VALIDE** — **Le décor s'allume** (bureau vu du dessus, tapis de découpe) puis **zoom continu de 4 s** jusqu'à l'intérieur de l'écran. Ellipse temporelle : 12:57 → 9:38 **sans coupe** | décor + caméra | `DeviceInScene` + décors générés | ✅ |
| 3 | 5,6 → 11,4 | Typo pure sur noir : *« Still unresolved, »* mot par mot | typo | `DeviceShowreel` ch. 3-4 | ✅ |
| 4 | 11,4 → 13,6 | **6 portraits d'enfants** en couronne autour de « Assembles », fond dégradé vert | images + compo | `Plan04Assembles` · images Gemini ✅ générées | ✅ **LIVRÉ** |
| 5 | 13,6 → 18,0 | ⛔ PAS « suite typo » : **diagramme circulaire des acteurs** + zoom traversant, dégradé DORÉ | diagramme | `Plan05Diagram` | ✅ **LIVRÉ** |
| 6 | **17,40 → 18,45** | ⛔ commence sur un **GLOBE vu de l'espace**, pas une carte plate | carte | `Plan06GoogleEarth` (Mapbox frame-driven) | ✅ **LIVRÉ** |
| 7 | **18,45 → 23,40** | Descente vers la maison (**bascule d'axe**, pas un push-in) + 2 cartouches iOS | raccord | `Plan07Maison` · clip H3 ✅ généré | ✅ **LIVRÉ** |
| 8 | **23,40 → 27,07** | ⛔ PAS « qui monte » : **2 sous-plans** séparés par une coupe à 25,05 s | UI produit | `Plan08Dashboard` (plaques + PageCam) | ✅ **LIVRÉ** |
| 9 | 27,07 → 28,07 | Transition (1 s) — contenu à MESURER, le tableau n'en dit rien | — | à déterminer | ⏭️ **RESTE** |
| 10 | 28,07 → 40,46 | Typo sur **dégradé vert-brun**, montée vers le CTA *« Foster With Clarity / Certainty / Confidence »* | typo + fond | même moteur que les plans 3 et 5 | ⏭️ **RESTE** (le plus long : 12,4 s) |
| 11 | 40,46 → 42,75 | Fondu au noir, texture pointillée | fondu | trivial | ⏭️ **RESTE** |

## ✅ LES 2 TROUS SONT COMBLÉS (27/08) — section conservée pour la méthode
> Les 2 assets manquants ont été produits : clip maison (H3, plan 7) et portraits d'enfants
> (Gemini, plan 4). Ce qui suit reste utile pour la MÉTHODE, plus pour l'état.
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
   ⛔⛔ **Se code par le SCALE du modele — PAS par la distance camera.**
   ⚠️ Cette ligne a d'abord ete ecrite a l'ENVERS (« se code par la distance
   camera, jamais par le scale »), en pleine session, APRES avoir pourtant
   diagnostique le contraire 130 lignes plus haut. C'est exactement le mode
   d'echec `feedback_commentaire-code-perime-bat-doctrine` : le prochain agent
   lit la section detaillee du plan, pas la liste des pieges en tete. Corrige au
   /wrap du 2026-08-27 (detecte par un agent, pas par moi).
   **La verite mesuree** : `camZ` reste FIXE a 8.4, `pull` va de 2,2 a 1,0 sur le
   `scale` du modele, et les couches 2D (decor, ombre, halo) sont multipliees par
   ce MEME `pull`. La prop `camera` de `<ThreeCanvas>` etant lue a
   l'initialisation seulement, animer camZ ne produit RIEN.
   -> `memory/tools/threecanvas-camera-non-reactive.md`

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


## ⭐⭐⭐ COMPARATIF A/B CHIFFRE PAR LES MODELES — l'idee d'Aziz qui change la boucle

> **Aziz (2026-08-27)** : « au lieu de se fier juste a toi, donne aux modeles le
> COMPARATIF entre les frames de l'original et ta reproduction. Le resultat risque
> d'etre surprenant. » Il l'etait.

**Outil** : `scripts/tools/proportions-diff.py`. Planche = original EN HAUT,
notre repro EN BAS, **grille commune graduee en %**, question unique : « qu'est-ce
qui n'est pas a la bonne taille / au bon endroit, AVEC DES CHIFFRES ».
Complementaire de `motion-breakdown.py` :
  - **motion-breakdown** = AVANT de coder -> quels GESTES existent
  - **proportions-diff** = APRES un rendu -> quelle GEOMETRIE est fausse

### CE QUE CA A TROUVE (et que ni Aziz ni moi ne voyions)
✅ **Les ETIQUETTES etaient trop petites** : 12,2 % de la largeur du cadre en
reference contre 9,6 % chez nous => facteur **1,27**. GPT l'avait chiffre a
« +21 % ». **Je n'avais jamais mesure les etiquettes separement.**

⛔⛔ **ET SURTOUT : ma correction precedente allait DANS LE MAUVAIS SENS.**
Aziz trouvait le diagramme trop petit (v4), j'ai applique `DIAG = 1,28` **sans
mesurer**. Verification : disque REF = **10,8 %** de la largeur, le notre avec
1,28 = **14,0 %** => facteur correct 0,77, soit DIAG ≈ **0,99**.
**Le diagramme d'origine etait DEJA a la bonne taille.** L'agrandissement poussait
en plus les etiquettes de ±90 px hors de leurs positions relevees — ce que les
modeles signalaient comme « etiquettes trop basses ». **Une seule cause, plusieurs
symptomes.**
⭐ Ce qu'Aziz percevait comme « trop petit » venait des ETIQUETTES et du FLOU de la
reference (qui etale visuellement le texte), pas du cercle.

### ⚠️ LES 2 ERREURS SYSTEMATIQUES DES MODELES SUR CE FORMAT (verifier toujours)
1. **« tout est ~10 % trop bas »** — affirme 2 fois par GPT, FAUX les 2 fois
   (mesure : centre y = 20,6 % des DEUX cotes). **Biais du format A/B EMPILE** :
   ils lisent la position dans la planche entiere (ou B occupe la moitie basse)
   au lieu du cadre de B. ⛔ Ne jamais appliquer une correction VERTICALE sans la
   remesurer soi-meme.
2. GPT a reproche a B l'absence du **watermark fiverr**... qu'on ne veut
   evidemment pas reproduire.
=> Sur ~8 points rendus : les TAILLES sont fiables, les POSITIONS VERTICALES non.

### ⛔ GOTCHA API : GPT-5.5 rendait `[vide]` — ce n'etait NI l'image NI un refus
`finish_reason: length`, **3500 tokens factures et 0 caractere**. Le modele
consomme son budget en RAISONNEMENT INTERNE avant d'ecrire.
✅ Fix : `max_tokens: 12000` + consigne « reponds directement, sans raisonnement
etale ». Diagnostique en isolant l'appel (un prompt court sur la MEME image
marchait parfaitement).

**Resultat final plan 5** : disque 10,8 % (ref) vs 11,0 % (nous) · etiquettes
12,2 % des deux cotes · positions a 0,1 % pres.

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

## ⛔ SECTION PÉRIMÉE (26/08) — conservée pour mémoire, NE PAS SUIVRE
> « Trancher le niveau de réussite visé, puis attaquer dans l'ordre du découpage. »
> C'était l'action du 26/08. **Le niveau est tranché depuis** (structure + gestes,
> le pixel est un bonus) et 8 plans sur 11 sont livrés.
> ⚠️ Deux « prochaines actions » qui se contredisent dans le même fichier, c'est
> exactement le piège du fichier de navigation périmé contre lequel le projet met
> en garde. **L'action courante est en TÊTE de ce fichier**, section
> « LA PROCHAINE SESSION ».


## PLAN 7 (18,45 -> 23,40 s) — LA DESCENTE VERS LA MAISON  ✅ FAIT

### ⛔ CE QUE LE TABLEAU ANNONCAIT vs LA MESURE
Le tableau disait « descente vers une maison + flou radial + vraie video + cartouches ».
Trois corrections mesurees :

**1. Le mouvement dure 2,5 s, pas 6,6 s.** Amplitude inter-frames mesuree (0,1 s d'ecart) :
forte descente jusqu'a ~19,6 · amortissement jusqu'a ~20,9 · **quasi immobile de 21,0 a
23,1** (sous 2/255) · rupture a 23,2.
=> Le clip GENERE ne couvre que **18,45 -> 20,90**. La fin du plan est un plan FIXE ou
seuls les cartouches iOS s'animent : c'est du Remotion, pas du clip genere.

**2. Ce n'est PAS un push-in, c'est une BASCULE D'AXE.**
  18,80 s : vue du DESSUS, on voit le TOIT · 19,50 s : oblique ~45 deg · 20,50 s : FRONTALE au sol.
Un drone qui descend EN SE REDRESSANT. Aucun de nos 6 modes de previs ne faisait ca
-> nouveau generateur `scripts/tools/mkprevis-drone-descente.py`.

**3. Le flou se dissipe LENTEMENT** (nettete 1,26 -> 3,26 entre 18,5 et 22,1), sans rupture.
⭐ Consequence utile pour le raccord : la portion la plus floue (18,45-19,5) peut rester
**notre Mapbox prolonge**, le clip genere ne prenant le relais qu'en sortant du flou.
Le raccord est donc plus facile que prevu — on n'a pas a faire coincider deux images nettes.

### LE TEST DES 2 REGISTRES (decision d'Aziz)
« On devrait animer les deux et voir ce qui fonctionne le mieux avec le meme prompt. »
Une seule variable change : **l'image de depart**. Meme previs, meme prompt, **meme seed
(771106)** — sinon on ne compare rien. C'est aussi un test grandeur nature du GABARIT DE
CHOIX en avant-vente (`memory/doctrines/PILIERS-B2B.md`) : montrer 2 registres au client
sur la MEME scene.

| | image de depart | fichier |
|---|---|---|
| A | photographique | `out/_r-and-d/foster-plan7/maison-A-realiste.png` |
| B | vectoriel plat | `out/_r-and-d/foster-plan7/maison-B-vectoriel.png` |

⚠️ **Gotcha image B** : Gemini a rendu l'illustration AVEC UNE BORDURE CREME (il a compris
« illustration encadree »). Detectee par mesure (lignes/colonnes d'ecart-type < 6 et
luminance > 225), recadree sur le contenu utile puis reramenee en 16:9. Sans ca, H3 aurait
anime le cadre avec le reste.

### LES 3 CONTROLES A FAIRE SUR CHAQUE CLIP (avant de juger)
1. **le style tient** : gradient minimum >= 8 (en dessous : le modele copie les blocs du previs)
2. **l'amplitude est reelle** : ecart 1re/derniere frame >= 35/255 (0,68 = clip FIGE)
3. **le mouvement est bien reparti** : H3 precipite volontiers tout le geste dans le premier tiers

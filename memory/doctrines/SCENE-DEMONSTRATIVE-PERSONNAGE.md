# ⭐⭐ LA SCÈNE DÉMONSTRATIVE À PERSONNAGE — la recette du funambule

> **Gravée le 2026-07-28**, après relecture code + rendu de la scène qui a ouvert tout le
> registre personnage : le **funambule du Franc CFA** (beat 4, `CfaActe4Filet16x9.tsx`,
> worktree `remotion-cfa`, rendu `out/_r-and-d/cfa-nuit1994/beat4-filet-v3.mp4`, 52,5 s).
>
> Verdict d'Aziz, qui a demandé cette gravure : « c'est sans aucun doute la meilleure manière de
> commencer à étudier les personnages et d'évoluer au fur et à mesure ».

---

## ⭐⭐⭐ LES 3 REGISTRES DE SCÈNE — LA TYPOLOGIE QUI CADRE TOUT (posée par Aziz, 2026-07-29)

> Ce ne sont **pas des concurrents**, ce sont des **registres différents**. Toute la journée du
> 29 a opposé décor et personnage comme si l'un devait gagner — c'était la mauvaise façon de poser
> le problème. Le choix se fait par **ce que la scène doit faire**.

| Registre | Ce qui porte l'information | Décor | Exemples |
|---|---|---|---|
| **CONTEMPLATIF** | **le LIEU** — on colorie, on révèle, des choses apparaissent | riche et détaillé, c'est le sujet | le port vivant · le village de pêcheurs |
| **SCHÉMATIQUE** | **la donnée / l'objet** — pas de personnage du tout | ce qu'on fait depuis toujours | cartes Mapbox/D3, data-viz, hook Or du Darfour |
| **DÉMONSTRATIF** | **le CORPS d'un personnage** qui EST l'argument | épuré, voire absent | le funambule CFA · **le porteur** |

### ⭐ CE QUE ÇA CORRIGE — le port et le village ne sont PAS des ratés

Le 29 au matin, ils ont été classés « décoratifs » — **jugés au critère du démonstratif**, qui
n'est pas le leur. Dans une scène CONTEMPLATIVE, **le lieu EST le sujet** : son décor porte donc
bien une information que rien d'autre ne porte, et il passe le critère établi le même jour
(« le décor doit porter une information que les éléments principaux ne portent pas déjà »).
⛔ **Ne plus les présenter comme des contre-exemples.** Ce sont des réussites d'un AUTRE registre.
La hiérarchie *absence > participant > inerte* vaut **dans le registre démonstratif**, pas partout.

### ✅ TESTÉ LE 2026-07-29 — LE PERSONNAGE RICHE TIENT LE RÔLE DÉMONSTRATIF

`PorteurRiche16x9.tsx` (compo `Porteur-Riche`) = le porteur narré avec `<Figure>` remplacée par
`<PersonnageRole role="commercante" avecObjet={false}>`. Variable unique : **seul le corps change**
(même voix, mêmes timings forced-align, même charge, même cadrage).

> **Verdict d'Aziz** : « la scène marche assez bien, ça a plusieurs avantages. Ça donne un
> personnage **en gros plan** dont on voit les détails, plutôt qu'un minuscule stick figure — et il
> y a de la **personnalisation**. »

⭐⭐ **DÉCISION DE DIRECTION QUI EN DÉCOULE — LES PERSONNAGES ARCHÉTYPES** : si on fait ce genre de
scènes, **le script doit désigner 2-3 personnages archétypes MAXIMUM dès l'écriture**, qui
reviennent tout au long de la vidéo. Pas quinze personnages différents. Le personnage riche n'a
d'intérêt que s'il est **reconnu** d'une scène à l'autre — sinon autant garder l'anonymat du stick
figure. ⛔ Ça se décide **au script**, pas au moment de coder la scène.

⛔ **RÉSERVE BLOQUANTE** : le test a révélé que **`PersonnageRole` casse à `lean` élevé** — la
camisole pivote avec le buste, le pagne non, les pièces se séparent et le vêtement finit sur le
visage. Voir [[vetement-solidaire-du-corps-jamais-independant]]. **À corriger avant tout usage en
production.** Corollaire de casting : préférer une tenue qui **laisse voir les jambes** (mineur,
agriculteur) — la robe longue masque le ciseau, or c'est lui qui dit la marche et donc l'effort.

### ✅✅ 3e ET 4e MANCHES (2026-07-29 soir) — CE QUI ÉLÈVE LA SCÈNE, ET CE QUI NE SERT À RIEN

Origine : pistes proposées par **Gemini** à Aziz sur les 2 prototypes. Testées, pas admises sur
parole. `PorteurPousse16x9.tsx` puis `PorteurGrille16x9.tsx`.

| Ajout | Verdict | Pourquoi |
|---|---|---|
| **Zoom lent** (camera push-in) | ✅ **GARDÉ** | N'ajoute AUCUN élément — change la focale sur ce qui existe. Démarre quand la charge s'emballe. ⛔ `<g transform>`, viewBox FIXE ([[camera-svg-g-transform-jamais-viewbox]]). |
| **Sol qui fléchit** sous le poids | ✅ **GARDÉ** | ⭐ **LE « décor qui participe » enfin trouvé.** Le sol n'est pas un fond : il CÈDE. Il porte une info que le corps ne porte pas (le terrain n'encaisse plus). La flèche suit **la charge**, pas une horloge — la cause reste visible. |
| **Graphique en haut du cadre** | ✅ **GARDÉ** | Camembert « à qui la dette est due » : il dit ce que le corps NE PEUT PAS dire (la structure, pas le poids). Se construit sur un mot du forced-align puis reste STABLE. ⛔ **Hors du groupe caméra** : un graphique qui zoomerait avec la scène se lirait comme un objet posé dans le décor, pas comme une couche d'information. |
| **Compteur collé au sac** | ⛔ **RETIRÉ** | Diagnostic d'Aziz, **plus juste que celui de Claude** : Claude craignait un problème de FOND (montant vs ratio) ; le vrai problème était **la PLACE**. Un chiffre collé au sac est lu comme *l'étiquette du sac* — il double l'objet au lieu d'ajouter une couche. |
| **Grille de fond** (fixe ET déformée) | ⛔ **REJETÉE, les 2** | Testées en comparatif. Verdict Aziz après visionnage : « **je préfère le fond uni** ». Même déformée-avec-le-sol — donc même *participante* — elle n'apporte rien. |
| **Gouttes de sueur** | ⛔ **ÉCARTÉE SANS TEST** | Convergence Aziz + doctrine : suppose un visage/une peau (⛔ aucun visage, verrou validé), tire vers le cartoon, et l'effort est **déjà porté par la mécanique du corps** → redondance (principe 7). |

⭐⭐ **CE QUE LA GRILLE APPREND, ET QUI COMPLÈTE LE VERDICT DU MATIN** : « participer » est une
condition **nécessaire mais pas suffisante**. La grille déformée participait vraiment (elle
matérialisait le terrain qui cède) — et elle a quand même perdu contre le fond uni. Il faut donc
aussi que l'élément **apporte quelque chose que le spectateur avait besoin de savoir**. Un maillage
qui redit « le sol plie » alors que la ligne de sol le dit déjà = du bruit, même participant.
⛔ Formulation finale : *un élément doit porter une information que les autres ne portent pas déjà —
ET cette information doit être utile à la démonstration.*

⭐ **Corollaire utile** : ce qui a survécu aux 4 manches ne sont PAS des éléments ajoutés au décor,
mais **la focale (zoom), la matière déjà présente (le sol), et une couche d'un AUTRE ordre
(le graphique, hors caméra)**. Le fond, lui, reste uni.

⚠️ Défaut connu non corrigé (décision d'Aziz, « c'est juste un test ») : les pieds passent
légèrement à travers le sol fléchi — le personnage suit `solYAt(x)` au point exact alors que ses
2 pieds sont écartés. Fix = échantillonner le sol sous chaque pied.

### ⏭️ LES 2 CHANTIERS OUVERTS PAR CE TEST (Aziz, 2026-07-29) — non lancés

**1. ✅ LARGEMENT TRAITÉ LE SOIR MÊME** (voir la table des 4 manches ci-dessus). « Rendre la scène
vivante » a reçu 3 réponses gardées — zoom, sol qui fléchit, graphique hors caméra — et 3 rejets
(grille fixe, grille déformée, compteur collé au sac). ⛔ **Le fond reste UNI** : ce n'est pas en
habillant l'arrière-plan qu'on élève la scène. Reste ouvert : d'autres formes de matière *déjà
présente* qu'on pourrait faire participer (le sol était la première).

**2. ✅ TRAITÉ AUSSI — les graphismes synchronisés.** Le camembert « à qui elle est due » répond à
la demande (« un graphisme qui apparaît pendant que le personnage agit »), et il satisfait la
condition d'Aziz (« pas l'air d'être juste posé sur l'image ») par 3 moyens : il naît d'un **mot du
forced-align**, il reste **stable** ensuite (aucune pulsation décorative), et il est **hors du
groupe caméra** — donc il se lit comme une couche d'information et non comme un objet du décor.
⏭️ Reste à explorer : d'autres formes que le camembert (frise, barres), et le cas où le graphique
**réagirait** au geste plutôt que d'être seulement déclenché par la voix.

### 🧍 ET POUR LES SCÈNES CONTEMPLATIVES : LE STICK FIGURE ANONYME

Décision d'Aziz : dans le registre **contemplatif**, on utilise des **stick figures anonymes** pour
peupler la scène, leur faire faire des actions, l'habiter. L'anonymat y est un ATOUT (des
figurants, pas des personnages). ⭐ Le personnage riche est donc pour le **démonstratif**
(reconnaissable, archétype), la stick figure pour le **contemplatif** (foule, ambiance) — et pour
le démonstratif quand l'argument exige l'anonymat (« c'est n'importe qui, donc c'est un pays »).

### ⏭️ Question ouverte du 2026-07-29 (RÉSOLUE ci-dessus, conservée pour la généalogie)

Un **personnage RICHE** (habillé, carnation — `PersonnageRole`) tient-il le rôle démonstratif aussi
bien que la stick figure ? Enjeu réel : le porteur marche parce qu'il est **ANONYME** (c'est
n'importe qui, donc c'est un pays, une économie). Un personnage identifiable devient *quelqu'un* —
une histoire individuelle peut **affaiblir** une démonstration macro, ou l'**incarner**. Non mesuré.
⚠️ Rappel du dossier : le personnage complet animé est « écarté en prod (pantin bien animé) » —
mais cette conclusion **ne valait que pour le personnage RICHE, pas pour la stick figure de
profil**, et n'a jamais été retestée depuis que le socle a mûri.

---

## ⛔ LES DEUX RÉGIMES DE SCÈNE À PERSONNAGES — NE PAS LES CONFONDRE

| | **AMBIANTE** | **DÉMONSTRATIVE** |
|---|---|---|
| Exemple | le port vivant, le village de pêcheurs | **le funambule CFA** |
| Personnages | 6-12 figurants en boucle | **UN seul** |
| Rôle du perso | il habite le lieu | **il EST l'argument** |
| Arc | aucun (la vie continue) | **complet : avant → événement → après** |
| Ce qu'on retire si on l'enlève | rien d'essentiel | **la démonstration entière** |
| Coût | élevé (décor + foule) | **faible (3 traits + 1 corps)** |

⭐ **Le régime démonstratif est plus fort, plus simple à réussir et plus utile à notre format.**
L'ambiant est un décor coûteux ; le démonstratif est un raisonnement. Commencer par lui.

---

## LES 7 PRINCIPES DU FUNAMBULE (chacun vérifié sur le rendu)

> Les 6 premiers portent sur la **composition** ; le 7e porte sur le **dimensionnement de
> l'animation** — ni un plafond de simplicité, ni une course à la complexité : on évalue scène
> par scène ce que l'argument réclame.

1. **LE PERSONNAGE EST L'ARGUMENT, pas son illustration.** Le funambule *est* l'économie en
   équilibre · le fil *est* la parité fixe · le filet *est* la garantie du Trésor. Test décisif :
   **si on retire le personnage et que la démonstration tient encore, la scène est décorative.**

2. **UNE SEULE MÉTAPHORE, tenue de bout en bout.** Zéro idée annexe. (Corollaire du rejet par
   Aziz du 1er beat 6b CFA : « trois métaphores hétérogènes empilées », incompréhensible.)

3. **UN ARC DRAMATIQUE COMPLET** : marche → vacille → tombe → est rattrapé → rebondit → repart.
   Il y a un AVANT et un APRÈS. Une scène où rien n'a changé au bout de 20 s n'est pas une
   démonstration.

4. **LA MÉCANIQUE DU CORPS PORTE L'ARGUMENT.** Le trébuchement dit la crise, le rattrapage dit
   la garantie, le rebond dit que le système tient. C'est le geste qui démontre — pas un texte
   posé à côté du geste.

   ⭐⭐ **PRÉCISION CAPITALE (Aziz, 2026-07-29) — LA VOIX OFF N'EST PAS « UN TEXTE À CÔTÉ ».**
   Ce principe vise le **texte AFFICHÉ à l'écran** (une étiquette qui répète ce qu'on voit déjà).
   Il ne vise PAS la narration. Quand la voix dit « le pas se raccourcit » et que le pas
   raccourcit au même instant, **ce n'est pas de la redondance : c'est de la SYNCHRONISATION**,
   et c'est exactement ce qui fait fonctionner la scène.
   > Mot d'Aziz : « je ne trouve pas que c'est redondant que le personnage ralentisse le pas avec
   > la voix. Dans une scène telle que celle-ci, justement, **on veut que le personnage illustre
   > ce que la voix dit**. Donc ça fonctionne très bien. »
   ⛔ Erreur commise par Claude le même jour (corrigée par Aziz) : avoir présenté ce calage comme
   « le premier mot à changer en production ». **Faux.** La voix est le fil, le corps l'illustre.

5. **AUCUNE CONCURRENCE VISUELLE — ET AUCUN DÉCOR INERTE.** Le décor du funambule = 1 ligne +
   1 filet + 2 étiquettes. ⭐ **Borne trouvée au rendu le 2026-07-29** (section dédiée ci-dessous) :
   la ligne de partage n'est pas *riche vs vide*, c'est **participant vs décoratif**. Un fond qui
   ne participe pas à la démonstration nuit même atténué — son absence vaut mieux que sa présence.

6. **L'ÉCHELLE PORTE L'ENJEU.** Le funambule fait ~3 % de la hauteur du cadre : le vide sous lui
   EST la hauteur de chute, donc le danger. La taille du personnage est un choix narratif, pas
   un réglage de lisibilité.

7. **⭐⭐ L'ANIMATION SE DIMENSIONNE SUR CE QU'IL Y A À DÉMONTRER — ni plus, ni moins.**
   (Principe ajouté le 2026-07-28 sur observation d'Aziz, puis **précisé par lui** — la nuance
   ci-dessous est le cœur du principe, pas une réserve de bas de page.)

   ⛔ **CE PRINCIPE N'EST PAS « FAITES SIMPLE ».** Le funambule est simple **parce que son
   argument était simple** — une chose à expliquer, une animation qui suffit à l'expliquer. Ce
   n'est pas la simplicité qui l'a fait réussir : c'est le fait de **ne pas avoir ajouté ce dont
   on n'avait pas besoin**. Mot exact d'Aziz : « son animation est restée simple parce que de
   toute façon c'était quelque chose à expliquer et c'était une animation simple. Nous n'avons
   pas essayé de rajouter ce que nous n'avions pas besoin, et c'est la vraie leçon. »

   ⭐ **Corollaire dans l'autre sens, tout aussi valable** : certaines scènes futures
   **exigeront** des mouvements neufs, des enchaînements complexes, des gestes qu'on n'a pas
   encore. **Il ne faut pas s'en priver** — s'auto-imposer un plafond de simplicité serait une
   erreur symétrique. On évalue **scène par scène**, sur ce que l'argument réclame.

   **Ce que fait RÉELLEMENT le funambule** : marcher en ligne droite avec un balancier · vaciller ·
   tomber · rebondir · se remettre debout · repartir. Six états, aucun techniquement difficile —
   notre socle les fait tous depuis la vague A. La scène ne tient sur AUCUNE prouesse d'animation :
   elle tient parce que **chaque état arrive exactement quand la voix le dit**.

   **Le contre-exemple de la même session** : la scène du port a 6 couches simultanées, 90 rides
   d'eau à phases indépendantes, 8 figurants désynchronisés, grues à cycle de levage, arc
   nuit→jour. Tout fonctionne techniquement. **Et pourtant elle ne démontre rien** — non pas
   parce qu'elle est trop complexe, mais parce que **sa complexité ne sert aucun argument**.
   C'est exactement la distinction : complexité AU SERVICE d'une démonstration = légitime ;
   complexité qui ne sert rien = elle prélève de l'attention sans rien rendre.

   ⭐ **Ce qui en découle sur notre socle** : il couvre déjà l'essentiel (marcher / porter /
   pousser / tirer / tomber / se relever / donner / recevoir / se faire délester —
   cf. [[STICK-FIGURE-INDEX]]). Beaucoup de scènes démonstratives n'auront besoin de rien de
   plus, et **ce qui reste alors à travailler est le CALAGE SUR LA NARRATION et le CHOIX DE
   L'ARGUMENT**, pas la capacité technique. Mais quand une scène réclame un geste neuf, on le
   crée — c'est ainsi que le registre s'est construit.

   ⛔ **Anti-pattern** : devant une scène démonstrative qui ne fonctionne pas, ne pas ajouter du
   mouvement par réflexe. Vérifier d'abord si l'argument est clair, si la métaphore est unique,
   et si les gestes tombent sur les bons mots. Si le diagnostic dit qu'il manque vraiment un
   geste — alors le coder.

---

## ⭐⭐ TRANCHÉ AU RENDU LE 2026-07-29 — LA QUESTION ÉTAIT MAL POSÉE

> **Verdict d'Aziz sur les 3 rendus** : « le témoin, pour cette scène en particulier, est le
> meilleur de tous. […] on dessine le filet, on dessine la ligne sur laquelle le funambule
> marche, mais c'est comme si on a un décor, un background, **qui ne fait rien en arrière-plan,
> rien ne se passe dans le background, il est juste là pour être là**, le personnage est placé
> par-dessus, le filet est placé par-dessus. Tandis que dans la variante A, l'absence de
> background fait en sorte que **ce n'est même pas quelque chose auquel on pense** : on pense
> juste aux trois éléments qui sont là, et c'est tout. »

**LE PROTOCOLE** (sur `master` depuis le merge du 2026-07-29) : le funambule porté à l'identique dans
le repo principal (`FunambuleDecorTest16x9.tsx`), **une seule variable changée — le fond**. Prouvé
par diff : hors commentaires, seuls 2 imports, la signature du composant et le bloc skyline
diffèrent de la version validée. 3 rendus de 975 frames exactement, même audio, mêmes timings
forced-align : **A** témoin · **B** skyline atténué · **C** skyline plein (contre-test, sans lequel
un échec de B aurait été ambigu). Décor dessiné par Fable 5 (`skylineDecorGroups.tsx`, 2 intensités
à géométrie strictement partagée). Vide fil→filet préservé : la rue passe SOUS le filet, donc le
principe n.6 n'est pas touché.

### ⛔ LA VRAIE LIGNE DE PARTAGE : **PARTICIPANT vs DÉCORATIF** — pas riche vs vide

La question « riche ou vide ? » supposait que l'axe pertinent était l'**intensité**. Il ne l'est
pas. Ce qui a fait perdre B et C, ce n'est pas leur richesse : c'est que **leur décor ne participe
à rien**. Les tours existent, les voitures existent, mais rien ne leur arrive. Le fil et le filet,
eux, sont DANS la scène — tendus entre des points, ils encaissent la chute, ils lâchent en 2020.
L'œil sent cette différence de statut, et **un décor qui ne participe pas est pire qu'un décor
absent : il occupe sans rien rendre.**

⭐ **Pourquoi A gagne** : ses trois éléments ne sont pas « seuls faute de décor », ils sont **tout
ce qui existe** — donc chacun compte, et il n'y a aucune couche à ignorer.

⛔ **Corollaire opératoire** : aucune atténuation ne rattrape un décor inerte. C atténué donne B,
et B reste inerte. **Ne jamais chercher à sauver un fond décoratif en baissant son contraste** —
soit il participe, soit il ne doit pas être là.

**Le principe n.5 se reformule donc ainsi** : *le décor ne dispute jamais l'attention au
personnage — et s'il ne participe pas à la démonstration, son absence vaut mieux que sa présence.*

### ⭐⭐ 2e MANCHE (même jour) — LE DÉCOR QUI RÉAGIT : TESTÉ, ET LA HIÉRARCHIE EST COMPLÈTE

**Protocole** : variante **D** = le décor de **B** repris À L'IDENTIQUE (le perdant, mêmes tours,
mêmes fenêtres, aucune géométrie changée) — seules les valeurs de lumière varient, pilotées par une
courbe `reaction` calée sur les mêmes repères forced-align que le personnage. Reprendre le perdant
tel quel est ce qui rend le test concluant : si D gagne, c'est la RÉACTION, pas un meilleur dessin.
⛔ Pas un flash : la ville sent au vacillement (0.45), accuse le coup à l'impact (1.0 en 0.35 s), se
rallume en 2.2 s — **plus lentement qu'elle s'est éteinte** — et encaisse 2020 plus SOURDEMENT
(0.35 : une décision juridique, pas un accident). Courbe vérifiée par calcul avant rendu (bornée
[0,1], nulle avant le vacillement, retour au repos à 15 s).

> **Verdict d'Aziz** : « c'est beaucoup mieux, mais franchement rien ne bat la version témoin sans
> décor. […] le funambule avait été conçu de manière minimaliste dès le départ et ça fonctionnait
> très bien — juste le personnage, juste le filet. »

### ⛔ LA HIÉRARCHIE ÉTABLIE : **ABSENCE > PARTICIPANT > INERTE**

Ce n'est PAS « le minimalisme gagne toujours ». Les deux manches disent deux choses distinctes,
toutes deux réutilisables :
1. **participant > inerte** — un décor qui réagit bat nettement le même décor figé (acquis solide).
2. **absence > participant** — mais il ne bat toujours pas le vide. **Pour CETTE scène.**

### ⭐⭐ LE CRITÈRE QUI EN SORT (plus solide que « fais minimaliste »)

**Le décor doit porter une information que les éléments principaux ne portent pas déjà.**

Le funambule a une particularité que peu de scènes auront : **sa métaphore est déjà complète**. Le
fil EST la parité · le filet EST la garantie · le vide EST le risque. Chaque élément porte du sens,
aucun n'est décoratif. Une ville n'avait donc rien à ajouter — au mieux elle illustrait « c'est
haut », ce que le vide disait déjà mieux. Le décor n'était pas mal fait : il était **REDONDANT**.
Et une redondance, même belle, même réactive, **se paie en attention**.

⚠️ **NE PAS SUR-GÉNÉRALISER** : rien dans ces 2 manches ne dit qu'un décor est toujours de trop.
Dans une scène où le LIEU porte une information propre (un port qui explique une dépendance
maritime, une frontière qui explique un blocage), la réponse pourrait s'inverser — ce cas n'a pas
été mesuré. Le critère est l'information apportée, pas la quantité de pixels.

### 🗄️ CONSÉQUENCE SUR LES SCÈNES DE RÉFÉRENCE

2 des 4 bancs d'essai (le port vivant, le village de pêcheurs) relèvent du régime AMBIANT, donc
décoratif. Après ces 2 manches, leur statut a changé : ils servent désormais de **contre-exemples
documentés** autant que de bancs d'essai. ⛔ Décision d'Aziz de les GARDER : maintenue, elle n'est
pas remise en cause — c'est leur usage qui se précise.

⭐ **CE QUI RESTE ACQUIS DE LA MÉTHODE** : le test à VARIABLE UNIQUE a tranché 2 questions en une
session, et la 1re manche a montré qu'on posait la MAUVAISE QUESTION (intensité, alors que c'était
le statut). Un débat au raisonnement serait resté sur « riche vs vide ». **Réutiliser ce protocole.**

⛔ **Leçon de méthode confirmée une fois de plus** : cette question ne pouvait pas se trancher au
raisonnement. Elle s'est tranchée en REGARDANT — et le rendu n'a pas répondu à la question posée,
il a montré qu'elle était mal posée. C'est précisément ce qu'un raisonnement n'aurait pas produit.
Trace du biais côté Claude : j'avais lu l'hésitation du regard sur C comme un effet de l'INTENSITÉ
(bon symptôme, mauvaise cause) — la cause était l'inertie, visible dans les 2 variantes à la fois.

---

## 🗄️ NOS SCÈNES DE RÉFÉRENCE — À GARDER ET À CONSULTER (décision Aziz 2026-07-28)

Ce ne sont pas des livrables : ce sont des **bancs d'essai** auxquels on revient pour tester une
animation, un compositing, une idée. **Ne pas les jeter, les référencer.**

| Scène | Où | Ce qu'elle prouve |
|---|---|---|
| **Le funambule CFA** | `remotion-cfa` : `_rnd/fable-svg/CfaActe4Filet16x9.tsx` · rendu `out/_r-and-d/cfa-nuit1994/beat4-filet-v3.mp4` | **LA scène démonstrative.** 1 perso = 1 argument, arc complet, chute/rattrapage/rebond. |
| **Le port vivant** | `master` : `_rnd/svg-scenes/PortVivant16x9.tsx` + `portDecorGroups.ts` | Décor Fable riche + parallaxe 6 plans + arc nuit→jour + grues + **8 figurants à marche non-glissante** + 1 héros habillé. Le partage à 3 étages. |
| **Le village de pêcheurs** | `_rnd/fable-svg/VillageParallaxeAnime.tsx` | Parallaxe 7 plans + vie ambiante + coucher de soleil. La 1re preuve du lieu vivant. |
| **Le hook Or du Darfour** | `warmap/soudan-hook/OrDarfourHook.tsx` · `out/PRET-PUBLICATION/soudan-midform/hook-or-darfour-VALIDE.mp4` | **La grammaire OBJET** : 3 objets, chacun double (la pelle *devient* le drapeau), 3 événements déclenchés par 3 mots du forced-align, colorisation = l'événement, objet inerte qui ne glisse jamais. |

⛔ **La grammaire du hook ne se transpose PAS telle quelle au personnage.** Objection d'Aziz,
retenue : un objet inerte peut *devenir* autre chose (une pelle qui se peint en drapeau = une
métaphore lisible) ; **un corps vivant qui se transforme est du fantastique, pas du
documentaire**. Le personnage a autre chose que l'objet n'a pas — le **geste, la posture,
l'attente**. C'est là que le sens doit se loger, jamais dans une métamorphose.
Ce qui SE transpose du hook : les événements déclenchés par des mots réels, et l'immobilité
entre les événements.

---

## ✅✅ LE PERSONNAGE QUI AGIT — PROUVÉ LE 2026-07-29 (« LE PORTEUR »)

`src/projects/_rnd/svg-scenes/PorteurCharge16x9.tsx` · compo `Porteur-Charge` · 24 s ·
rendu `out/_r-and-d/porteur-charge/v3.mp4`. **L'action au service d'un argument est prouvée** —
le funambule prouvait un personnage qui SUBIT, celui-ci AGIT.

**L'argument** : un homme porte une charge qui grossit pendant qu'il marche. **Lui ne change pas.**
C'est le ratio dette/capacité, pas le montant — aucun chiffre à l'écran, le corps dit le rapport.

> **Lecture d'Aziz, sans qu'on la lui explique** (= le test décisif passé) : « la charge grossit et
> l'homme est vivant […] il fait plus d'effort, la charge l'empêche de marcher aussi vite
> qu'auparavant, et à la fin il est penché, il est stoppé. » Et : « c'est simple mais ça fonctionne
> […] **surtout le personnage qui apparaît en gros plan** : on n'a pas dix mille choses à traiter,
> l'information peut passer. »

⭐ **Ça confirme le verdict décor par un autre chemin** : ce n'est pas qu'on renonce au décor —
c'est que **la place libérée profite au personnage**.

### ⭐⭐ LE VERROU PAS/DISTANCE EST PLUS SUBTIL QU'ÉNONCÉ — bug attrapé PAR LE CALCUL

La règle disait « x dérive des pas, jamais l'inverse ». **Insuffisant.** 1re version :
`walkDistance(pasTotal, swingCourant)` — ça applique la longueur de pas COURANTE à TOUS les pas
déjà faits. Or ici le pas RACCOURCIT (c'est le sujet même de la scène) → les 29 pas déjà posés
étaient rétroactivement raccourcis → **le personnage RECULAIT de 430 px**. Physiquement absurde :
un pas déjà posé ne se raccourcit pas après coup.

**Formulation corrigée** : *x dérive des pas **au moment où ils sont faits*** — intégration
incrémentale, `walkDistance(dPas, swingDeLaFrame)` sommé frame par frame.
⛔ Au rendu, ce bug se serait vu comme « un glissement bizarre » sans cause identifiable. **C'est le
calcul qui l'a attrapé, avant le 1er rendu.**

### LA COMPLÉMENTARITÉ CALCUL / RENDU, ILLUSTRÉE SUR UNE SEULE SCÈNE

| Attrapé par le CALCUL (invariants) | Attrapé par le RENDU (crédibilité) |
|---|---|
| le recul de 430 px (verrou cassé) | le sac montait au-dessus de l'épaule et **cachait la tête** |
| sortie de cadre (x_final 2095 > 1920) | le sac **recouvrait le buste** → la posture, donc l'effort, disparaissait |
| monotonie de x, bornes, vitesse → 0 | `lean` à 23° achevait de masquer le corps (plafonné à 14°) |

⭐ **Règle qui en sort** : *un paramètre d'effort poussé à fond dégrade la lecture avant d'ajouter
du sens.* Le plafond n'est pas une timidité, c'est la condition de la lisibilité.

⛔ **Parade au bug BRAS_LAG appliquée** : à l'arrêt final, la phase de marche n'est plus lue — une
`Pose` explicite est forcée. Sans ça la phase se fige sur une valeur quelconque, potentiellement la
pose dégénérée (jambes superposées) — exactement le défaut observé à t≈15 s sur le funambule.

## ✅✅✅ LA SCÈNE NARRÉE — PROUVÉE LE 2026-07-29 (« LE PORTEUR NARRÉ »)

`PorteurNarre16x9.tsx` + `porteurNarreTiming.ts` · compo `Porteur-Narre` · 719 f ·
rendu `out/_r-and-d/porteur-charge/narre-v2.mp4`. **Variable unique** : seule la SOURCE des
timings change (codés à la main → dérivés du forced-align). Corps, charge, mécanique : identiques.

> **Verdict d'Aziz** : « la scène est beaucoup plus intéressante. **C'est vraiment la première
> scène qui marche en tant que telle.** »

**Le pipeline** : script 5 phrases validé par Aziz AVANT génération → `generate-narration-expressive.py`
(`--dry-run` d'abord : 817 crédits) → `forced-align.py <audio> <script> <mots-repères> --fps 30`
(66 mots, loss 0.099) → `porteurNarreTiming.ts` (**aucune valeur choisie**) → la scène.

| mot | frame | ce que fait le corps |
|---|---|---|
| avance | 124 | pas ample, charge légère |
| grossit | 266 | la charge s'emballe |
| stagnent | 414 | le corps cesse de compenser — il subit |
| raccourcit | 475 | le pas raccourcit (13.4° → 7.1°) |
| avancer | 652 | il est ARRÊTÉ quand le mot tombe |

⭐ **Détail de conception qui compte** : l'arrêt s'amorce **24 frames AVANT** le mot, pour que
l'immobilité soit déjà **acquise** quand il tombe. Un geste qui *commence* sur le mot se lit en
retard — anticiper l'amorce est la règle, pas l'exception.

⛔ **PIÈGE À ÉVITER — source unique pour le pas** : la boucle d'intégration de la distance ET
l'affichage doivent appeler **la même fonction** `swingAt(f)`. Deux formules qui divergeraient d'un
demi-degré feraient **glisser les pieds** (le corps avance d'une distance qui ne correspond pas à
l'ouverture de son ciseau).

⚠️ **Les courbes articulées sur les mots CHANGENT le parcours** : à scale 3.2 (valeur de la version
manuelle) le porteur ne faisait plus que 1436 px et s'arrêtait aux 2/3 du cadre. **Recalculer le
scale après tout recalage sur la voix** — ici 3.8. Mesuré par script, jamais réglé à l'œil.

## CE QUI RESTE À PROUVER SUR LE PERSONNAGE DÉMONSTRATIF
- **Un DUO démonstratif** : l'asymétrie fort/faible et l'échange à deux sont prouvés
  techniquement, jamais au service d'un raisonnement.
- **Le décor riche atténué** (l'hypothèse ci-dessus).
- **Les timings dérivés du forced-align** plutôt que codés à la main — le funambule était calé
  sur la voix ; toutes nos scènes R&D depuis ont des timings arbitraires.

Liés : [[hierarchie-figurant-heros]] · [[brique-habillage-stick-figure]] ·
[[partage-decor-animation-personnages]] · [[STICK-FIGURE-INDEX]].

# STICK FIGURE SVG — INDEX

> ## ⭐⭐ ÉTAT — LE REGISTRE EST **EN PRODUCTION** (2026-07-28)
>
> **6 scènes narratives produites et jugées sur rendu par Aziz** : « le socle en tant que tel est
> validé, ça fonctionne, le placement, les distances — il y a juste quelques améliorations à faire
> plus tard. » Le programme R&D 4 vagues est derrière nous (trace en bas de fichier).
>
> **Code** : `src/projects/_rnd/stick-figures/` — 12 fichiers, compositions `Stick-*` dans `Root.tsx`.
> `PecheurDuree` (la durée se lit sur le corps) · `PecheurSurpecheStick` · `MarcheMesure` (objet à
> états) · `GareRoutiereDecor` + `GareDepart` (échange à deux) · `MarcheNuitVivant` (foule) ·
> `MarcheNuitNarratif` (marchands de face + apparition dessinée + bulles). Plus 2 scènes de TEST :
> `GarePersoParModele` et `MarcheNuitCompare`. Commits `25cab1c9` · `5aeafd85` · `3a137d74`.
>
> **⏭️ NEXT** : la scène avec **NARRATION** — aujourd'hui tous les timings sont codés à la main, il
> faut les DÉRIVER du forced-align. → `memory/starters/STARTER-PROMPT-stick-figure-scene-narree.md`
>
> **⚠️ 3 améliorations relevées par Aziz, NON traitées** (à faire en production, pas en R&D) : l'objet
> qui « pop » et change de taille en montant à l'épaule · le premier plan qui se vide quand les allures
> varient trop · les personnages d'arrière-plan encore trop statiques (piste : varier la POSTURE
> plutôt qu'animer chacun).
>
> ---
>
> **Registre VALIDÉ Aziz le 2026-07-26** (vague 1 « gestes »). Verdict : « c'est mieux que ce que
> j'aurais pensé dès le départ, **surtout quand c'est des plans éloignés** » · « le concept est
> vraiment bien prouvé ».
>
> **Origine** : découverte fortuite sur le beat 4 du Franc CFA — le funambule de profil qui marche,
> vacille, tombe et rebondit (`_rnd/fable-svg/CfaActe4Filet16x9.tsx`, composant `FunambuleProfil`).
>
> **À quoi ça sert** : un personnage qui FAIT quelque chose (subit, décide, attend, reçoit) ouvre le
> registre NARRATIF, là où nos scènes montrent surtout des schémas qui s'animent. Et ça coûte quasi
> rien à produire (pas d'API, pas d'asset payant — du code).

---

## ⛔ LA RÈGLE N°1 — CRITÈRE ÉLIMINATOIRE (mot d'Aziz)

> « Si tu ne peux pas l'animer aussi bien qu'on l'a animé sur le franc CFA — le faire marcher, lever
> les bras, s'il faut trembler, etc. — ce n'est pas la bonne voie. »

On juge sur la **qualité du MOUVEMENT**, jamais sur la beauté du dessin figé. Un personnage plus
détaillé mais qui glisse/flotte = ÉCHEC, on l'abandonne. Corollaire de méthode : **un geste ne se
juge pas sur une frame** — il faut rendre en vidéo, ou au minimum comparer des frames CONSÉCUTIVES.

---

## LES 6 PLANCHES V1 DES VAGUES A ET D (sur 8 au total — les vagues B et C ont les 2 autres)

**VAGUE A — LES GESTES** (validée 2026-07-26)

| Fichier | Compo Remotion | Contenu | Vidéo V1 |
|---|---|---|---|
| `gestes/GestesLocomotion16x9.tsx` | `RND-Stick-Gestes-Locomotion` | marche lente/pressée/montée/descente/arrêt net · porter/pousser/tirer · tomber et se relever | `out/_r-and-d/stick-figures/v1-valide/stick-gestes-locomotion-V1.mp4` |
| `gestes/GestesExpressifs16x9.tsx` | `RND-Stick-Gestes-Expressifs` | lever les bras (alerte/célébration/reddition) · trembler (peur/froid/effort) · s'asseoir (4 appuis) | `.../stick-gestes-expressifs-V1.mp4` |
| `gestes/GestesEchange16x9.tsx` | `RND-Stick-Gestes-Echange` | donner · recevoir · tendre sans recevoir · se faire délester | `.../stick-gestes-echange-V1.mp4` |

**VAGUE D — LES INTERACTIONS** (validée 2026-07-26)

| Fichier | Compo Remotion | Contenu | Vidéo V1 |
|---|---|---|---|
| `interactions/DuoAsymetrie16x9.tsx` | `Stick-Inter-Duo-Asymetrie` | 5 différenciateurs comparés · négocier · l'un part l'autre reste · imposer/se soumettre | `.../stick-inter-duo-asymetrie-V1.mp4` |
| `interactions/GroupeFoule16x9.tsx` | `Stick-Inter-Groupe` | groupe qui attend (FIGÉ) · un qui se détache · exode 5 et 12 persos, 3 rangées de profondeur | `.../stick-inter-groupe-V1.mp4` |
| `interactions/ObjetEtCarte16x9.tsx` | `Stick-Inter-Objets` | sac (porté/posé/relevage) · pièce · caisse · pioche · soulever · marteler | `.../stick-inter-objets-V1.mp4` |

### ⭐ RÉSULTAT-CLÉ VAGUE D — L'ASYMÉTRIE (la question d'Aziz : « pas juste deux bonshommes identiques »)

**Aucun différenciateur ne marche seul. C'est la COMBINAISON qui porte le rapport de force :**
`FORT` = trait ×1.28 + encre pleine + posture droite (+ accessoire) · `FAIBLE` = trait ×0.74 + encre
terne `#9aa3b8` + voûte 8°. Se lit en silhouette pure, sans étiquette.
- **Taille seule** → lit « adulte/enfant », PAS « puissant/faible ». ⛔ Écartée comme signal principal.
- **Épaisseur de trait seule** → meilleur signal isolé (discret, sans ambiguïté d'âge).
- **Couleur/valeur seule** → très lisible mais froide seule (« un normal et un fantôme »).
- **Accessoire seul** → donne un rôle social, insuffisant pour un rapport de force.
- **Posture voûtée seule** → la plus habitée, mais peut lire « fatigue » plutôt que « faiblesse ».

⭐ **Trouvaille de mise en scène** : dans « l'un part, l'autre reste », le fort **ne suit jamais le
partant du regard**. Il reste fixe. Plus fort que de le regarder partir.

### CHARGE : le registre tient jusqu'à ~12 personnages
Limite non technique (le SVG encaisse) mais de **lisibilité de composition** : à 12 sur une bande, les
rangées de profondeur se chevauchent. Désynchronisation OBLIGATOIRE par index (φ, e, √2), jamais un
simple offset de phase — un offset simple retombe parfois sur des postures identiques par coïncidence.

---

## ⭐⭐ LES 7 BRIQUES TECHNIQUES À RÉUTILISER (le vrai livrable)

### 1. LE VERROU PAS/DISTANCE — la plus importante
Dans le beat CFA, `x` avançait **indépendamment** de la phase de marche (ça passait car trajet lent et
court). Dès qu'on change de cadence, **les pieds patinent**, et à grande échelle ça se lit comme un
tremblement. La règle : **c'est le pas qui produit le déplacement**, jamais l'inverse.
```
PAS_L = 2 × JAMBE_L × sin(swingMax)     // distance parcourue par un pas
x = x0 + (nombre de pas écoulés) × PAS_L // on interpole un NOMBRE DE PAS, pas des pixels
```
Effet gratuit : sur porter/pousser/tirer, **aucune vitesse n'est réglée à la main** — la charge
raccourcit les pas, donc le personnage ralentit tout seul. Preuve mesurée : pied d'appui immobile
(0px de dérive) pendant que l'autre balaie.

### 2. IK 2 SEGMENTS pour les bras (`solveArm`)
On décide la **position monde de la main**, le coude se résout par loi des cosinus. C'est LA condition
du raccord entre deux corps : animer par angles d'épaule/coude oblige à deviner où finit la main, et
les mains ne se rejoignent jamais.
- ⚠️ **Ne jamais laisser un bras en butée** (>97% de la portée) : l'IK clampe la main sur son cercle
  max, et un bras en butée ne tient pas sa pose — il glisse au moindre mouvement du corps. C'est une
  source de tremblement à part entière. Viser ~89% de tension.
- ⚠️ **Un bras au REPOS doit être solidaire du corps.** Si sa cible est un point fixe alors que
  l'épaule oscille (bob de marche), la distance épaule→cible traverse la butée 2× par cycle et le
  coude part en vrille. Faire suivre le bob à la cible (saut du coude mesuré : 7,3px → 0,5px).

### 3. OBJET EN `lerp(mainA, mainB)` — le relais invisible
L'objet échangé n'est **jamais reparenté** d'un perso à l'autre (ça produit un saut). Sa position est
interpolée entre les deux mains, et la bascule se fait **pendant que les deux mains sont au même
point**. Le raccord devient indétectable.

### 4. POSES-CLÉS EXPLICITES > accumulation de ressorts
Pour une séquence complexe (chute → relevage), sommer plusieurs `spring()` sur les mêmes angles
**dérive** : les ressorts se chevauchent, les sommes ne retombent jamais sur une pose propre (le perso
finit en bâton couché à 45°, jamais debout). Solution : une **chaîne de poses-clés**, chacune une
silhouette valide vérifiable à la main, + fondu séquentiel. À tout instant on est sur le segment entre
2 poses correctes → impossible de dériver.

### 5. BRUIT DÉTERMINISTE (tremblement sans `Math.random`)
Somme de 3 sinus à **rapports irrationnels** (1 / 1,618 / 2,718) + phases décalées par membre +
enveloppe lente. Résout « vibration uniforme = bug d'affichage » tout en restant déterministe (Remotion
recalcule chaque frame : un random casserait le rendu).

### 6. LE MEMBRE EN UN SEUL PATH (pas 2 segments)
Un bras plié dessiné en 2 `<line>` avec `strokeLinecap="round"` fait apparaître une **pastille au
coude** (les 2 capsules terminales se chevauchent). Invisible à 74px, grotesque à 424px. Tracer
épaule→coude→main en **un seul `<path>` avec `strokeLinejoin="round"`** (composant `<Membre>`).

### 7. ⭐⭐ CONTINUITÉ DE POSE AUX JONCTIONS — héritage, jamais fondu (2026-08-03)
Née d'un enchaînement de 5 gestes validés sur un seul personnage (marche→arrêt→pousser→marche→
assis, `src/projects/_rnd/fable-libre/EnchainementGestesValides.tsx`). Quand plusieurs gestes de ce
registre s'enchaînent sur UN personnage (pas jugés isolément en planche de démo), chaque geste a
d'abord été codé en bloc indépendant (`if (frame < X_START) {...}`) — reproduisant chacun sa propre
horloge et sa propre pose de départ par défaut. Résultat : coupures nettes à chaque frontière
(mesuré : le buste sautait de 0° à 30° d'inclinaison en 1 frame, les mains de 75-91px, EN UNE SEULE
FRAME). Verdict d'Aziz : « ça coupe, on voit clairement le statut qui passe d'un état à l'autre ».

**1re parade tentée et jugée insuffisante — le FONDU** : mélanger par interpolation linéaire les 2
poses adjacentes sur une fenêtre de ~10 frames à cheval sur la frontière. Verdict : « pas tout à
fait naturelle ». Raison de fond : un fondu, même doux, est une **double exposition mathématique**
de deux poses statiques — pendant la fenêtre, le corps affiche la moyenne pondérée de deux instants
qui ne sont ni l'un ni l'autre un vrai moment du mouvement. L'œil lit un croisement, pas un geste.

**✅ LA VRAIE PARADE — HÉRITAGE, zéro fondu** : chaque geste part littéralement d'où le précédent
s'est arrêté. Sa **pose de départ** n'est plus une constante écrite à la main : c'est un **paramètre
d'entrée** alimenté par la pose de sortie RÉELLE du geste précédent — lue en rejouant les formules de
ce geste à sa dernière frame rendue, jamais devinée ni recalculée à part. Exemples concrets tirés du
fichier (chaque cas est différent, pas une seule formule magique) :
- **Vitesse héritée** : le freinage (« arrêt net ») repart de la cadence/swing/lean RÉELS de fin de
  marche (`A_FIN = allureA((A_DUR-1)/FPS)`), pas d'une cadence fixe déconnectée — sinon le personnage
  ralentit d'un coup AVANT même de commencer à freiner.
- **Cible héritée** : la prise en main de la caisse démarre du buste et des mains à leur position
  RÉELLE de fin d'arrêt, avec une rampe d'entrée dont la durée est choisie PAR CALCUL (0.75s ici :
  en dessous, le bras dépasse sa longueur max mesurée ; le geste ne bouge l'objet qu'une fois
  réellement touché — cadence de poussée qui part de 0, jamais avant contact).
- **Phase de cycle héritée** : si le swing de jambes du geste suivant est identique à celui du geste
  qui finit, la phase du pas continue SANS AUCUN raccord (le pas est repris en cours — coïncidence à
  vérifier au cas par cas, pas une garantie générale).
- **Déclenchement immédiat** : un temps d'attente immobile avant un geste (ex. `T_ASSIS` avant de
  s'asseoir) doit être réduit à 0 si la doctrine narrative demande que le geste s'enchaîne SANS délai
  — sinon un flottement sans lien avec l'élan du geste précédent se lit comme un arrêt sur image.
- **Changement de MOTEUR (`Figure` → `Stick` ou inversement)** : la pose peut être héritée à la
  frontière au pixel près (hanche/épaule/tête), mais un écart de PROPORTION entre les deux moteurs
  (longueur de bras/jambe différente d'implémentation) reste possible et n'est PAS réconciliable sans
  déformer l'un des deux (5 stratégies testées et rejetées : IK forcé → coude à angle absurde ;
  rallonger un membre → silhouette qui grandit ou bras de singe). Dans ce cas, une coupe FRANCHE (pas
  de fondu) reste le meilleur compromis : un fondu, lui, DOUBLERAIT l'écart de proportion au lieu de
  le masquer (vérifié au rendu — un fondu de 6 frames sur un écart de pose nulle mais un écart de
  proportion réel produisait un dédoublement visible, pire qu'une bascule instantanée).

⛔ **GARDE-FOU qui a permis cette refonte sans rien casser** : on ne modifie QUE le point d'entrée
(pose initiale / condition de départ) de chaque geste. On ne touche JAMAIS au cœur d'un geste une
fois lancé — cadences, springs, poses-clés internes, tables de solutions d'équation (type
`APPUI_BANC`) restent listées comme INTACTES à chaque jonction. Interface d'entrée paramétrable,
cœur de geste inchangé : c'est ce qui distingue un raccord propre d'un bricolage qui redérive des
angles (cf. règle dure ci-dessus sur le danger de retraduire une convention).

⚠️ **Portée actuelle** : méthode prouvée sur 1 enchaînement de 5 gestes précis, pas encore une
fonction générique réutilisable pour n'importe quelle paire de gestes futurs (décision Aziz
2026-08-03 : documenter le PRINCIPE avant de généraliser en code, pour ne pas répéter l'erreur
d'un geste inventé/généralisé trop tôt sans un 2e cas d'usage réel pour le confirmer — cf. § piège
plus bas sur le prototype du sac). À chaque nouvel enchaînement, RECALCULER (jamais copier) la pose
de sortie réelle du geste qui précède.

---

## ⛔ RÈGLES DURES DU REGISTRE (contraintes, pas préférences)

- **Deux membres au même angle = un seul trait.** Valider toute pose par l'ÉCART EN PIXELS aux
  extrémités, jamais au jugé. Plancher du swing de marche ≈ **16°** (en dessous la marche disparaît).
- **Les bras pendent par rapport à la GRAVITÉ, pas au buste.** Additionner l'angle des bras à celui du
  buste ratatine le perso en bâtonnet dès qu'il se penche.
- **⛔⛔ PROFIL UNIQUEMENT — DÉCISION AZIZ 2026-07-26, les autres vues sont ÉCARTÉES.**
  De profil une stick figure marche ; de face elle ne peut que glisser (la face reste admise pour
  l'IMMOBILE seul). **Trois-quarts et de-dos = TESTÉS puis ÉCARTÉS.**
  Mot d'Aziz : « mieux vaut garder les personnages juste de profil. **De dos ne marche pas du tout.**
  Profil et trois-quarts sont **littéralement la même chose**, donc gardons le profil. Déjà avec des
  personnages de profil on peut créer une variété de scènes assez grande et assez intéressante. »
  Constats techniques concordants : le de-dos exige une **réécriture complète** du corps (écartement
  symétrique, épaules côte à côte — ce n'est pas une variation du profil, c'est une autre mécanique) ;
  le trois-quarts fonctionne mais son gain de perspective est **ténu** à l'échelle d'usage → complexité
  sans bénéfice. ⛔ Ne pas re-tester sans raison neuve.
- **ÉCART entre 2 persos ≤ 2 × (BRAS_L + AVBRAS_L).** Contrainte arithmétique dure. On est à 89% de la
  portée, sans marge : tout échange plus ample casserait les proportions.
- **⚠️ CONVENTION D'ANGLE — piège vécu.** Les 3 fichiers ont été écrits par 3 agents en parallèle et
  n'ont PAS la même convention (`Locomotion` : 0 = bras qui pend · `Expressifs` : 180 = bras vers le
  haut). Copier une valeur d'angle d'un fichier à l'autre a produit des « oreilles de lapin »
  (mains 28px au-dessus de l'épaule). **Vérifier la convention avant tout copier-coller d'angle.**
- **⚠️ L'ÉCHELLE CHANGE LE VERDICT.** Des défauts invisibles à 74px deviennent grotesques à 424px
  (pastille de coude, patinage, bras plié en équerre). **Juger à l'échelle d'usage prévue.**
- **⛔ UN GROUPE IMMOBILE RESTE FIGÉ.** L'« immobilité habitée » (respiration + balancement + micro-
  ajustements) est validée sur UN personnage SEUL — elle crée de la présence. Appliquée à N
  personnages simultanément, elle produit un bobbing qui se lit comme un **défaut technique**, pas
  comme de la vie. Verdict Aziz : « quand un groupe est immobile, il est mieux de le garder figé sans
  mouvement, rajouter du mouvement est bizarre ». L'intérêt visuel d'un groupe figé vient de la
  **diversité des postures** (désync par index), pas du mouvement.
  ⭐ **PRÉCISION 2026-07-28 (production, 6 scènes) — la règle vaut pour des personnages qui NE FONT
  RIEN.** Un **geste INTENTIONNEL sur place** (héler, montrer, tendre un objet, verser) est légitime et
  lisible, y compris **de FACE** et y compris sur un groupe immobile — prouvé sur `MarcheNuitNarratif16x9`
  (3 marchands de face qui hèlent, validés par Aziz). La règle exacte est donc : **pas de mouvement SANS
  INTENTION** — et non « zéro mouvement ».
  ⭐ Ce qui reste interdit : la respiration/oscillation **décorative** appliquée à N personnages (c'est
  elle qui se lit comme un défaut technique). Le **transfert de poids très lent** (période ~7 s, faible
  amplitude, désynchronisé par index) est admis : il déplace le centre de gravité, il ne vibre pas.
  → Aligné sur la règle transversale du projet (`CLAUDE.md` : « Mouvement = intention narrative »).
  ⚠️ Leçon de brief pour Claude : c'est MA consigne « amplifier ×4-5, mieux vaut trop que pas assez »
  qui a créé ce défaut. Amplifier un effet subtil n'est pas neutre — ça peut le faire changer de
  nature (de la présence → un artefact).
- **⛔ MANIPULER UN OBJET : partir de l'OBJET, pas des bras.** Pour un outil tenu à deux mains, ne pas
  animer les bras puis espérer que l'outil suive. Décider la trajectoire de l'OBJET → en déduire la
  position des mains sur lui → résoudre les bras en IK vers ces points. Sinon les mains lâchent
  l'outil (défaut constaté : « les bras semblent se détacher, l'outil n'atteint jamais le personnage »).

## LE GENOU (évolution du socle, 2026-07-26)

Le socle est en **segments rigides** (pas d'articulation). Le relevage depuis le sol a exigé
d'ajouter un **genou optionnel et inerte par défaut** (`leg1Knee?` / `leg2Knee?`) : sans flexion, la
jambe reste un seul segment — marche/montée/descente/porter/pousser/tirer sont **strictement
inchangés**. Raison géométrique : depuis un bassin au sol, une jambe rigide de 34px ne touche le sol
qu'à 83° d'ouverture = jambes étalées à plat, incapables de pousser.
→ Ouvre : s'agenouiller, ramasser au sol, monter une marche.

---

## ÉTAT PAR GESTE (verdict Aziz)

**✅ VALIDÉS V1, ne plus toucher** : marche lente/pressée (« parfaitement bien, surtout la rapide avec
le corps penché ») · montée/descente (« excellentes, on sent le poids ») · porter/pousser/tirer
(« impressionnantes, 100% satisfait ») · s'arrêter net (corrigé) · chute + relevage (« deux-trois fois
mieux qu'avant, il tombe face première bras tendus en avant ») · lever les bras 3 intentions
(« les deux bras se lèvent exactement comme il faudrait ») · peur/froid · alerte + effort (refaits
depuis l'intention) · s'asseoir · donner/recevoir/tendre sans recevoir/se faire délester.

**⚠️ IMPERFECTIONS ACCEPTÉES EN V1** (décision Aziz : « mieux vaut arrêter d'itérer non stop ») :
- Reste une légère tremblote sur la toute fin de « tendre la main sans recevoir ».
- Un mouvement de coude résiduel quand le personnage recule dans l'échange.
→ « Si jamais on utilise pour d'autres scènes ou en production, on fixera. On verra sur le coup si le
problème se reproduit. »

**🎯 PROCHAIN DÉFI IDENTIFIÉ PAR AZIZ (pas fait, noté)** : le relevage est encore en **stop-motion** —
il s'arrête entre les poses. Objectif : **un seul mouvement organique**, il tombe et se relève sans
s'arrêter. Cause connue : les 6 poses-clés étaient la parade à la dérive des ressorts accumulés (cf.
brique n°4) ; la fluidification devra préserver cette garantie de non-dérive.

### 🔧 BUGS MINEURS CONNUS — NON CORRIGÉS PAR DÉCISION D'AZIZ (2026-07-26)

> Doctrine appliquée : « chacun de ces mouvements est valide et peut être utilisé, et surtout dans une
> scène normale ces erreurs n'apparaîtront peut-être pas, car on donnera plus d'attention à la scène
> dès le départ et on pourra corriger au fur et à mesure. » → On ARRÊTE d'itérer en R&D ; ces points se
> traitent en PRODUCTION, sur la scène réelle, s'ils se manifestent.

| Où | Symptôme | Piste |
|---|---|---|
| Objets · le sac | À genoux après le dépôt, **le bras devient élastique** — il s'étend jusqu'au sol puis se rétracte au relevage | Cible de main probablement en coordonnées monde non recalées sur la hanche accroupie |
| Objets · la pièce | **La pièce disparaît/saute entre les mains** au moment du passage ; elle semble tomber au sol APRÈS que le perso l'ait reprise | Appliquer le `lerp(mainA, mainB)` de `GestesEchange16x9` (relais invisible) — il n'a pas été réutilisé ici |
| Échange · V3 | Légère tremblote résiduelle en toute fin de « tendre la main sans recevoir » | Amplitude de fatigue encore un peu haute sur la dernière seconde |
| Échange · marche | Léger mouvement de coude quand le perso recule | Reste de l'artefact IK, très atténué |
| Locomotion · marche | Pose dégénérée résiduelle (bras se confondent au buste → silhouette aplatie en trait) | Déphaser les bras ENTRE EUX, pas seulement vs les jambes (le fix `BRAS_LAG=0.35rad` du lot Groupe traite jambes↔bras uniquement) |

⭐ **OUVERTURE CONFIRMÉE PAR LA PIOCHE/MARTEAU** (mot d'Aziz : « impressionnant... ça ouvre de nouvelles
possibilités ») : la méthode « manche d'abord, mains déduites » **généralise à tout outil à deux mains**
— pelle qui creuse, hache, masse, rame. C'est la brique à réutiliser pour toute scène de travail
(mine, agriculture, chantier).

---

---

## 🎨 L'IDENTITÉ (vêtements, rôles, objets tenus) — PANEL LLM, 2026-07-27

> **Verdict Aziz sur la proposition Fable 5** : « **remarquable, niveau très professionnel**, avec les
> personnages en tant que tel. Le design, les objets, très satisfaisant. »

### ⭐⭐ RÉSULTAT DU PANEL — FABLE 5 GAGNE LARGEMENT (4 modèles, même brief, même image de réf)

| Modèle | Résultat | Verdict |
|---|---|---|
| **Fable 5** (agent, **0 API**) | 4 silhouettes COMPLÈTES + 6 objets, chacun avec point d'accroche documenté. **S'est auto-corrigé 2×** sur rendu (foulard or qui lisait comme des CHEVEUX BLONDS sur carnation claire → teal ; liseré de chemise trop fin → élargi) | ⭐⭐ **RETENU** |
| GPT-5.5 | Vêtements livrés **SANS LES CORPS** — chapeaux et tuniques qui flottent dans le vide. Brief suivi littéralement (« ce qui s'ajoute au personnage ») sans monter la silhouette | Inutilisable tel quel |
| Gemini 3.1 Pro | Personnages complets mais **nettement plus pauvres** : aplats sommaires, objets minuscules. **Contresens culturel** : chapeau conique asiatique pour l'agriculteur africain | Faible |

**Enseignements de méthode** :
1. **Fable 5 confirme son statut de modèle SVG maison par défaut** — et ici à coût NUL (agent, pas d'API).
   Déjà prouvé sur le visage organique (2026-07-20), maintenant prouvé sur le **vêtement/rôle**.
2. **Le seul à s'être AUTO-RELU SUR RENDU.** C'est ce qui fait la différence : il a vu que son foulard or
   lisait comme une chevelure. Un modèle qui ne regarde pas son propre rendu livre des défauts.
3. ⚠️ **Un brief trop littéral peut être suivi littéralement** : « dessine ce qui s'ajoute au personnage »
   a produit chez GPT des vêtements sans corps. Demander explicitement la silhouette COMPLÈTE.

### ⛔ RÈGLES D'IDENTITÉ (nées des échecs constatés par Aziz)

- **⛔ UN ACCESSOIRE NE DOIT JAMAIS ÊTRE DE LA MÊME FAMILLE DE TEINTE QUE LA CARNATION QUI LE PORTE.**
  Mot d'Aziz : « une casquette orange sur un personnage brun ressort bien, mais une casquette brune sur un
  personnage brun, on ne voit absolument rien ». Comme les carnations varient, **la couleur d'accessoire ne
  peut pas être fixe** — elle se choisit PAR RAPPORT au personnage. Le casque de chantier jaune marchait
  justement parce qu'il est hors de la gamme des peaux.
  ⚠️ Piège voisin trouvé par Fable : un couvre-chef doré sur carnation claire lit comme des CHEVEUX.
- **⛔ PAS DE MOTIF ABSTRAIT SUR LE BUSTE.** Les petits cercles / lignes / damiers ont été REJETÉS :
  « qu'est-ce que c'était supposé représenter ? c'est un peu bizarre, ce n'est pas trop bien réussi ».
  Un vêtement doit être un VÊTEMENT reconnaissable (boubou, pagne, combinaison, veste), pas une texture.
- **⛔ UN OBJET TENU À LA MAIN PEND AU BOUT DU BRAS.** Bug constaté : sacs « placés beaucoup trop bas,
  comme collés aux jambes, alors que ça devrait tenir à leur main ». Tout objet manipulable doit être
  dessiné avec son **POINT D'ACCROCHE** explicite (anse/nœud/poignée EN HAUT, masse EN BAS).
- **⛔ AUCUN VISAGE — définitif.** Testé (tête nue / œil seul / œil+nez / œil+sourcil+clignement).
  Verdict Aziz : « c'est presque mieux d'avoir un personnage sans visage du tout, même pas d'œil ».
  Raison : un œil crée l'attente d'un regard ; un point fixe paraît **plus mort** qu'une tête nue.
  (L'agent et Claude étaient arrivés à la même conclusion indépendamment.)
- **Chaque élément doit déclarer À QUOI IL S'ATTACHE** (tête / buste / hanche / main) — c'est ce qui permet
  de le faire suivre le bob et l'inclinaison de cette partie sans qu'il flotte.

**Planches sources archivées** : `public/_shared/refs/stick-figure-panel/` (les 4 propositions, code +
rendus PNG — le COMPARATIF a de la valeur, pas seulement le gagnant).
**Script du panel** : `scripts/tools/svg-stickfigure-roles-gen.py` (Gemini/GPT/Kimi ; Fable = agent).

### ✅ INTÉGRÉ ET VALIDÉ — `identite/Roles.tsx` (fusion Fable + Kimi, faite par Claude)

> Verdict Aziz sur le rendu final : « **c'est parfait, je valide** ».

- **De Fable** : le DESSIN — formes de vêtement recopiées path par path, couleurs justifiées par
  contraste, formes des objets. **De Kimi** : la RELATION corps-objet (géométrie du point d'accroche
  main, ex. pioche à `(22,-29.5)`) — injectée dans `pose.hand1` du socle, c'est ce qui fait que
  l'objet est **vraiment tenu** au lieu d'être posé à côté.
- ⛔ **La fusion a été faite par Claude, jamais par un modèle** (doctrine : outiller la mécanique,
  jamais le jugement).
- Contenu : `RoleMineur` · `RoleCommercante` · `RoleFonctionnaire` · `RoleAgriculteur` ·
  6 objets (`ObjetPioche/Panier/Registre/Houe/Sac/Caisse/Jerrican`) · `CARNATIONS` (5 teintes) ·
  `PersonnageRole` (assemblage, prop `avecObjet` défaut `true`) · table `ROLE_MAIN_REPOS`.
- Démo : `identite/RolesDemo16x9.tsx`, compo `Stick-Roles-Demo` (4 rôles EN MARCHE, sans objet —
  Aziz : « juste les vêtements exacts et le personnage qui marche suffira pour valider »).

### ⭐⭐ L'ORDRE DE RENDU D'UN PERSONNAGE HABILLÉ (bug vécu, règle à ne pas reperdre)

Symptôme signalé par Aziz : « les personnages ont l'air de flotter ou d'être transposés DEVANT leurs
vêtements, on voit le corps du stick figure À TRAVERS le vêtement ».
Cause : en SVG, **ce qui est écrit en dernier passe au-dessus**. Le corps entier était monté APRÈS le
vêtement. ⚠️ Et ce n'était pas une étourderie : l'ordre initial visait à faire passer le BRAS AVANT
par-dessus le vêtement (juste — un bras est devant le torse, pas sous la chemise) ; l'effet de bord
était que le buste et les jambes passaient aussi devant.

**ORDRE CORRECT, de l'arrière vers l'avant — 5 couches :**
1. bras ARRIÈRE (opacité réduite = profondeur) · 2. jambes + buste (le CORPS) · 3. **le VÊTEMENT**
(il habille le corps, donc il le recouvre) · 4. TÊTE + coiffe · 5. **bras AVANT** (devant tout, y
compris devant le vêtement) + objet tenu.
=> Il faut donc **séparer le bras avant du reste du corps**. Implémenté par une prop additive du socle
`hideArm1?: boolean` (défaut `false` = comportement inchangé), le bras avant étant redessiné par-dessus
le vêtement dans `Roles.tsx` avec la formule EXACTE du socle.

⚠️ **Piège de repère trouvé au passage** : le squelette de référence de Fable place la tête à 8 unités
de l'épaule, le socle animé à 12 → écart de 4.8 qui laissait un **cou flottant** sur les 4 tenues.
Corrigé par extension mesurée du col (`NECK_EXTEND`), sans toucher au socle ni aux formes de Fable.
**Leçon générale : un dessin importé d'une source externe n'a pas forcément NOS proportions — vérifier
les points d'ancrage avant de conclure que le dessin est mauvais.**

**Reste ouvert (non bloquant, dette de finition)** : les tenues sont un peu PLUS LARGES que chez Fable
(la combinaison du mineur déborde du buste, l'original est plus ajusté). Ajustement de proportion, pas
un défaut de conception.

---

## ⭐⭐ LA RÈGLE DE COMPOSITION — QUELLE SCÈNE CONVIENT AU STICK FIGURE (2026-07-27)

> Née de la comparaison directe de 2 scènes produites le même soir : **le village (réussi du premier
> coup)** et **la pêche (4 correctifs, verdict Aziz « la scène est un peu brisée dès le départ »)**.
> Question d'Aziz : « pourquoi la scène du village fonctionnait si bien tandis que la scène de la pêche
> semble si complexe à faire ? »

### 1. LE SOL EST LA CONDITION N°1

**Une scène avec un SOL intègre le personnage par construction. Une scène sans sol oblige à
réinventer l'ancrage, et chaque élément devient un bug potentiel.**

- **Village (sol)** : le personnage est posé sur le sable, occlus par les plans de premier plan,
  tenu par la perspective déjà tranchée du décor. Verdict Aziz : « pas de problème avec le personnage
  qui ne touche pas au sol, ses pieds sont parfaitement ancrés dans le sol du décor ».
- **Pêche (pas de sol)** : un homme debout sur l'eau n'a aucun point d'ancrage. Il a fallu inventer
  une pirogue porteuse, un tangage commun barque+corps, une ligne de flottaison, un ordre de calques
  entre les nappes de vagues. **Les 4 défauts du rendu sont tous des symptômes de ça** : perso qui
  marche sur l'eau (253px au-dessus de sa barque), chalutier qui vogue dans le ciel, bord du rect de
  mer qui entre dans le cadre, bloc de couleur qui coupe l'écran.
- Constat frère déjà gravé côté D3 (« la vraie limite résiduelle = le SOL, Mapbox pose sur un terrain
  texturé, D3 sur un aplat ») : **le même facteur décide, en pire, pour le personnage.**

### 2. GESTE DU CORPS (maîtrisé) vs GESTE D'OBJET (non prouvé)

Nos gestes validés sont des gestes **du corps** : marcher, tirer, porter, trembler, tomber, s'asseoir.
Tous les **bugs connus non corrigés** de cet index sont des gestes **d'objet** : bras élastique du sac,
pièce qui saute entre les mains. Ce n'est pas une coïncidence — c'est la même lacune.

⛔ **Un objet manipulé doit avoir un ÉTAT, pas seulement une position.** Bug vécu sur la pêche : le
filet recevait `fish={cycle.fish}` en permanence, donc **il naissait plein** — les poissons étaient
visibles AVANT même le lancer. Verdict Aziz : « on est loin de ce qu'il lance son filet et ramène des
poissons, car avant même qu'il lance son filet, les poissons sont déjà présents. »
→ Un objet transporté se modélise comme une **machine à états** (vide → en cours → plein → déversé),
jamais comme un simple paramètre d'affichage. Et le transfert d'un contenant à l'autre suit le
`lerp(mainA, mainB)` de la brique 3, jamais un reparentage.

### 3. NE PAS HÉRITER D'UN DÉCOR NON ÉPROUVÉ

Le village était un décor **validé et rendu**. Les briques de la pêche (chalutier, mer) venaient d'une
scène conçue pour le **GeminiRig**, jamais éprouvée — elle ne se rendait même plus (assets audio
manquants). Leurs défauts (« le chalutier ne ressemble pas vraiment à un chalutier, la mer n'est pas
tout à fait adéquate ») **préexistaient** : la version stick figure les a révélés, pas créés.
→ Avant de réutiliser un décor : **le RENDRE et le REGARDER**. « Réutiliser plutôt que créer » suppose
que l'existant est bon — vérifier d'abord, sinon on hérite de la dette.

### 4. LE FILTRE, AVANT DE CHOISIR UNE SCÈNE

| Question | Si NON |
|---|---|
| Y a-t-il un SOL qui porte le personnage ? | Ancrage à inventer entièrement — coût x3 |
| Le geste central est-il un geste du CORPS ? | Terrain non prouvé (objet) — l'isoler, ne pas le cumuler |
| Le décor a-t-il été RENDU et REGARDÉ ? | On hérite de défauts qu'on croira avoir causés |

**≥ 2 « non » = la scène cumule les inconnues. La refuser comme banc d'essai** (cas de la pêche :
pas de sol + geste d'objet + décor non éprouvé = 3/3).

---

## ⭐⭐ TEST A/B TRANCHÉ — QUI DESSINE LE PERSONNAGE ? (2026-07-27, PROUVÉ, pas un avis)

> Question d'Aziz : « est-ce que les modèles sont capables d'intégrer nos stick figures directement
> dans la scène ? Ou est-ce mieux de créer des scènes vides et rajouter les personnages après ? »
> Tranché par un test contrôlé, décor identique (gare routière), pas par une opinion.

**A) décor généré + NOTRE personnage** (`GareDepart16x9.tsx`) · **B) décor + personnage dessiné ET
animé par le modèle** (`GarePersoParModele16x9.tsx`, Fable 5, briefé avec le socle en lecture).

### Ce que B a RÉUSSI (vérifié au rendu, pas sur parole)
Il marche vraiment, le pas produit le déplacement, le pied reste au sol malgré le bob, le ballot
reste collé à l'épaule. Zéro `Math.random`/`setTimeout`. **Visuellement PLUS RICHE que notre stick
figure nue** (tunique, pantalon, sandales, kufi).

### ⛔ CE QUI TRANCHE — 3 constats, dont 2 venant de l'agent lui-même
1. **Le modèle n'a produit AUCUN moteur.** Son aveu : « mon propre dessin n'est propre que pour la
   PEAU, pas pour le SQUELETTE ». Convention d'angle, `2·L·sin(swing)`, adaptation `Leff = -hipY/cos`,
   `BRAS_LAG`, IK loi des cosinus : **tout re-dérivé de notre socle**. Il enrobe, il n'invente pas.
2. **⭐ LE POINT DÉCISIF — le costume est cousu sur UN SEUL geste.** « S'asseoir est impossible sans
   redessin : la tunique est un path RIGIDE pivoté à la hanche — assise, elle traverserait les
   cuisses. Ce n'est pas un rig générique, c'est un costume cousu sur un seul mouvement. »
   Notre socle encaisse marcher/porter/s'asseoir/tomber/tendre la main SANS être redessiné.
3. **Double source de vérité épaule/vêtement** : la tunique est dessinée à la main dans le repère du
   buste, l'épaule est calculée. Si l'une bouge sans l'autre, les bras sortent du vêtement — c'est
   exactement le bug « 6 copies divergentes » qui a motivé la création du socle.

### ✅ LA RÈGLE QUI EN DÉCOULE
**Le modèle dessine le DÉCOR (il excelle, coût nul via agent), NOUS animons les PERSONNAGES.**
C'est le partage qui a marché sur le village ET sur la gare. Corollaire : ce qui vaut d'être
récupéré d'un personnage généré, c'est **l'HABILLAGE** (plus riche que nos tenues actuelles) —
à greffer sur le socle comme on l'a fait pour `identite/Roles.tsx`, jamais le squelette.

⚠️ Nuance honnête à conserver : B a mieux marché que Claude ne l'annonçait avant le test. La réserve
initiale (« un dessin de modèle n'a pas nos points d'ancrage ») était juste sur le fond mais trop
absolue — un modèle BRIEFÉ AVEC LE SOCLE sait produire de la locomotion correcte. C'est la
RÉUTILISABILITÉ multi-gestes qui échoue, pas l'animation elle-même.

---

## ⭐⭐ COMPARATIF MODÈLE — FABLE 5 CONFIRMÉ SUR LE DÉCOR (test aveugle, 2026-07-27)

> Question d'Aziz : « Fable consomme beaucoup. Un agent Opus en élevé ne pourrait-il pas faire
> aussi bien ? » Tranché par un TEST AVEUGLE, pas par une opinion.

**Protocole** : brief STRICTEMENT identique (même sujet — marché de nuit ouest-africain, même
palette imposée aux codes hex, mêmes 6 plans, même contrainte de bande libre), 2 agents,
2 fichiers (`marcheNuitGroupsA.ts` = Opus élevé · `marcheNuitGroupsB.ts` = Fable 5). Rendus dans
des conditions identiques (`MarcheNuitCompare.tsx`, compos `Candidat-A`/`Candidat-B`), frame 45,
full HD. **Noms des modèles cachés à Aziz** jusqu'après son verdict.

### ✅ VERDICT D'AZIZ : FABLE (B) GAGNE, sans hésitation
« Le candidat B est clairement plus riche. Les étals sont beaucoup plus beaux, une certaine
variété. [...] Le ciel étoilé avec la lune dans le candidat B est vraiment plus beau. Le sol, etc.
Ça raconte une histoire, une scène de marché. Beaucoup plus crédible dans le B que dans le A. »

### ⭐ CE QUI EXPLIQUE L'ÉCART — une différence de MÉTHODE, pas de talent brut
**Fable a RENDU son travail en image et l'a REGARDÉ** (2 passes : il a corrigé la position des
lampes de fond pour qu'elles apparaissent dans les trouées entre étals). **Opus a explicitement
déclaré ne pas avoir vu son rendu** — sa vérification était structurelle/géométrique seulement
(script de parsing des bornes, rigoureux et honnête, mais aveugle au résultat visuel).
→ C'est NOTRE propre règle « vérifier CODE **ET** VISUEL », et le modèle qui l'applique gagne.
⚠️ À l'inverse, Opus a produit une vérification géométrique par SCRIPT qui a rattrapé 2 violations
réelles de la bande libre — méthode à retenir, elle est complémentaire, pas concurrente.

### ✅ RÈGLE — FABLE 5 RESTE LE MODÈLE SVG PAR DÉFAUT, y compris sur le décor
La réserve de Claude avant le test (« le décor de la gare est de la géométrie plate simple, pas
le registre organique où Fable écrase ») était **FAUSSE** : même sur des étals, un ciel et un sol,
l'écart se voit à l'œil nu. Fable était déjà gravé n°1 sur le visage organique (2026-07-20) ;
il l'est maintenant aussi sur le **décor de scène**.
⚠️ Coût : Fable consomme plus. Le test dit qu'il le vaut POUR LE DESSIN. Pour une tâche de
raisonnement sur code existant (audit, refactor, vérif géométrique), rien ne prouve un avantage
Fable — Opus y est solide et moins cher.

---

## ⛔⛔ PISTE ABANDONNÉE — PERSONNAGE + CARTE (décision Aziz 2026-07-26, définitive)

> **NE PAS RESSORTIR CETTE PISTE.** Testée en vague D (3 approches : perso à côté de la carte-panneau ·
> perso sur la carte comme pion · carte en décor lointain). Les 3 « marchent » techniquement — et
> c'est justement le piège : ça ne veut pas dire qu'elles servent à quelque chose.
>
> **Verdict d'Aziz** : « je ne vois pas trop le but d'utiliser des personnages comme ceux-ci pour les
> mettre sur une carte ou les faire apparaître sur la carte. Je pense que ça va être plus complexe
> qu'autre chose. Nos cartes sont souvent 2D flat ou même 3D, donc ce genre de personnages, même sur
> des cartes en D3.js, ne fonctionnerait pas selon moi. **Pour moi là où il fonctionne, c'est de
> manière narrative, dans différentes scènes.** »
>
> **Le raisonnement de fond** : nos moteurs cartographiques (Mapbox, D3, globes, carte vivante) sont
> DÉJÀ notre point fort et racontent le territoire mieux qu'un personnage posé dessus. Le stick figure
> apporte ce que la carte ne sait PAS faire — l'humain qui subit, attend, reçoit. Sa valeur est donc
> **maximale quand on quitte la carte**, pas quand on l'encombre. Mélanger les deux dilue deux
> registres forts séparément.

---

## ✅✅ PROGRAMME TERMINÉ — LES 4 VAGUES SONT VALIDÉES (2026-07-26/27)

**A. Gestes ✅** → **D. Interactions ✅** → **C. Identité ✅** → **B. Vues ✅ (écartées : profil seul)**.

Le registre stick figure est **PRÊT POUR LA PRODUCTION**. Ce qu'il sait faire : marcher (5 variantes),
porter/pousser/tirer, tomber et se relever, lever les bras (3 intentions), trembler, s'asseoir,
donner/recevoir/tendre la main sans recevoir/se faire délester, négocier en duo asymétrique, former un
groupe (jusqu'à 12), manipuler des objets, porter une tenue de rôle.

**8 vidéos V1** : `out/_r-and-d/stick-figures/v1-valide/`.
Détail de la matrice : `memory/starters/STARTER-PROMPT-rnd-stick-figures-registre.md`.
Verdict complet vague 1 : `memory/episodes/_rnd/stick-figures/VERDICT-VAGUE-1-GESTES.md`.

### 🎯 CHANTIERS OUVERTS (non bloquants — à traiter en production, pas en R&D)
1. **Le relevage est en STOP-MOTION** — il s'arrête entre les poses. Objectif : un seul mouvement
   organique. ⚠️ La fluidification devra préserver la garantie de non-dérive des poses-clés.
2. **Largeur des tenues** un peu plus généreuse que le dessin d'origine de Fable.
3. Les 5 bugs mineurs tracés plus haut (bras élastique du sac, pièce qui saute, tremblote résiduelle…).
4. **Les 6 planches des vagues A et D ne sont PAS recâblées sur le socle** (décision Aziz : elles sont
   validées et archivées, les toucher risquerait de casser du validé pour un bénéfice invisible).
   ⚠️ Elles restent donc des copies indépendantes — tout NOUVEAU code doit importer `StickFigure.tsx`.

**Besoin identifié pour la suite (mot d'Aziz)** : « si nous utilisons des plans rapprochés, ça sera de
tourner une certaine **personnalisation au personnage** pour pas que ce soit juste deux bonshommes
stick figure blancs ». Rejoint la limite trouvée en vague 1 : les 2 persos sont identiques, or pour un
sujet économique l'**asymétrie** est souvent le propos (un État / une banque, un petit / un grand).

**Note de mise en scène (Aziz)** : dans une vraie scène, dessiner un **vrai banc** (ou autre mobilier
réel) plutôt que le banc-trait des protos. Le banc a été jugé le meilleur des 4 appuis testés (banc /
caisse / marche / sol nu) : seul appui où coexistent la surface, le contact du bassin et la pliure du
corps.

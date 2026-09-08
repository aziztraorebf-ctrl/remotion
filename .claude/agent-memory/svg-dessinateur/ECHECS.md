# ⛔ ÉCHECS — lire AVANT de tenter

> Chaque entrée décrit le SYMPTÔME VISUEL exact, pas une impression.
> But : ne jamais repayer une tentative déjà perdue.

## ⛔⛔ ANATOMIE HUMAINE — 5 modèles sur 5 échouent SANS RÉFÉRENCE (2026-08-28)

> ⚠️ **Portée du verdict PRÉCISÉE le 2026-08-28 (soir)** : ces 5 échecs valent **SANS image de
> référence uniquement**. Avec une référence visuelle dans le brief, le registre main-curseur a été
> DESSINÉ avec succès (3 poses, validées au rendu contre la référence) — cf. `TECHNIQUES.md`
> § « Anatomie AVEC référence ». La question ouverte est TRANCHÉE : avec image-ref on exécute,
> sans image on ne trouve pas la forme.

**Protocole** : test à l'aveugle, planches anonymisées, clé scellée avant jugement.
Brief détaillé, pièges explicitement nommés, consigne d'empilement incluse.
**Modèles** : Gemini 3.1 Pro · GPT-5.6 Sol · Kimi K3 · Grok 4.6 · GLM-5.2.

| Registre | Résultat |
|---|---|
| Objets d'interface | ✅ 5/5 réussissent |
| **Main humaine (3 poses)** | ⛔ **5/5 échouent** |

**Symptômes visuels, systématiques d'un modèle à l'autre :**
- la paume est un **rectangle** — elle se lit comme une manche, pas comme une main
- les doigts repliés forment une **grappe de bulles** au lieu de trois arcs distincts
- le **poignet est coupé net**, sans raccord
- le **pouce est une forme rapportée** posée à côté, il flotte
- une planche a même un **index qui se plie à l'envers**

⚠️ **Deux planches avaient PLUS de formes que les autres sans être meilleures.**
Le volume ne compense pas une anatomie fausse — la consigne d'empilement ne sauve pas ce registre.

⛔ **Correction d'une attente** : GPT-5.6 Sol est le champion documenté de l'organique (il avait
réussi un visage de pêcheur là où les autres échouaient). **Il a produit une des pires mains.**
« Bon sur les visages » ≠ « bon sur les mains ».

**→ Que faire à la place** : prendre une pièce de banque et la restructurer.
Mode opératoire : `memory/tools/banques-lottie-et-greffe.md` (la géométrie est en clair dans
le `.lottie`, l'extraction est triviale). Résultat : préféré par Aziz contre les 5 modèles,
et **plus léger** (1 chemin continu contre 52 à 139 formes).

✅ **Question TRANCHÉE (2026-08-28, main-curseur avec référence)** : avec une image de référence,
le registre SE DESSINE — succès en 3 itérations, aucun des 5 symptômes ci-dessus au rendu final
(`out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg`). Méthode : `TECHNIQUES.md` § « Anatomie
AVEC référence ». ⚠️ Les 2 pièges rencontrés EN COURS de route (ils reviendront) :
- **la vallée pouce-index mangée par le trait** : un écart de ~5 unités entre deux parois est
  entièrement absorbé par un stroke de 7 → fente noire, lit comme une craquelure. Garantir ≥12
  unités entre parois parallèles avant stroke.
- **la paume qui s'allonge toute seule** : sans mesure, le poing sort plus haut que large (0,9:1) ;
  la référence est PLUS LARGE que haute (~1,2-1,35:1). Mesurer le ratio du poing, pas l'impression.
Le verdict « 5/5 échouent » reste ENTIER pour toute anatomie **sans** référence : dans ce cas,
greffe de banque, pas de génération.

⭐⭐⭐ **Portée RE-PRÉCISÉE le 2026-09-01 (test Fable vs Opus, convergent sur ce point)** : le
critère qui prédit l'échec n'est pas « humain ou pas » mais **« topologie libre ou assemblage
de primitives »**. Une main/un visage réaliste = topologie libre (contour continu sans
symétrie, articulations, raccourcis) → le verdict 5/5 tient. Un pictogramme/silhouette
(tronc + membres + disque, zéro doigt, zéro visage, façon art rupestre ou ombre chinoise) =
assemblage de primitives → SE DESSINE sans référence, deux modèles l'ont prouvé
indépendamment le même jour (`out/_r-and-d/fable-vs-opus-ted-ed-style/`). Avant de refuser ou
d'escalader un brief « personnage », qualifier le REGISTRE demandé avant de qualifier le sujet.
Dans ce registre, le vrai risque n'est plus l'anatomie mais la LISIBILITÉ DE SILHOUETTE
(fusions, dilution) — cf. `TECHNIQUES.md` § SILHOUETTE PLEINE SUR APLAT.

## ⛔ Dessiner à la main dans le code (l'erreur de l'orchestrateur, 2026-08-28)

Symptôme : tous les objets en **aplats de couleur**, une forme par objet, là où la référence a
des dégradés et ~10 formes empilées. Cause : les formes avaient été écrites au clavier en JSX
au lieu d'être dessinées. **L'aplat généralisé est le symptôme visuel de cette erreur.**
→ `memory/feedbacks/feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable.md`

## ⭐ PERSONNAGE ARTICULE — mes erreurs des 3 versions (2026-08-29)

### Ce que j'ai cru, et que le RENDU a dementi
- **L'ombre de chevelure sur le front** : promise dans mon programme design, elle lisait
  comme un **bandeau** malgre 2 affinages → supprimee (les refs pro n'en ont pas).
  ⭐ **Une idee de programme se lache quand le rendu la contredit.** Ne pas s'y accrocher
  parce qu'on l'a annoncee.
- **La taille pincee** (mon point 3 de programme V2) : les refs font des torses **tonneau
  quasi droits**. C'etait une coquetterie de designer contraire au registre. ⭐ La SENSATION
  d'Aziz a detecte ce que mes mesures n'avaient pas cherche.
- **« Les jonctions visibles viennent des rotules »** : FAUX. La rotule est de la couleur du
  membre, elle ne peut pas se voir. C'etaient **mes ellipses d'ombre decoratives**.
  ⭐ Meme symptome, autre cause — chercher la cause avant de refaire le mecanisme.

### Le piege de DOSAGE que j'ai failli repeter
La jonction cuisse/mollet a resiste a **2 dosages** avant que je zoome : la cause etait
**structurelle** (mollet plus etroit que le bas de cuisse → le fond clair dessine la
jonction). Fix : mollet **aussi large** que le bas de cuisse — bleu sur bleu, bord invisible.
⛔ **Des le 2e dosage sans progres, chercher la cause, pas une 3e valeur.**

### Ce qui m'a limite pendant 3 versions sans que je le nomme
⛔ **Aucune reference humaine DE FACE.** Je transposais des largeurs depuis des vues 3/4 et
de profil. Verifie apres coup : les 23 pieces du corpus n'en contiennent aucune.
⭐ **Reflexe a garder : nommer TOT ce qui manque comme materiau**, au lieu de compenser en
silence. Je l'ai demande a la V3 seulement — 2 versions trop tard.

### Un chiffre atteint n'est pas un dessin reussi
En V3 j'ai atteint TOUS mes ratios cibles et perdu 3 choses a l'oeil : bras qui se fondent
dans le torse au repos, cou disparu, souliers devenus des sabots.
⛔ **Toujours REGARDER le rendu final en entier apres avoir corrige une metrique** — la
correction d'un chiffre peut casser ce qui allait.

## 2026-08-30 — planche-onboarding "Loop" (defauts intermediaires, tous corriges au rendu)
- ⛔⛔ **UN `<rect>` CLAIR FLOTTANT DANS UNE FORME = LIGNE PARASITE.** Lustre pose en rect arrondi
  a l'interieur des pastilles d'app : son bord bas se lit comme un TRAIT, pas comme un volume
  (meme symptome que "2 bandes claires flottantes" de la planche-docs). Fix : lustre ANCRE au
  bord, epousant les coins arrondis.
- ⛔⛔ **A GRANDE LARGEUR, TOUT LUSTRE DEVIENT UNE LIGNE.** Sur un bouton de 420px, une calotte
  claire `q-210 16 -420 0` lit comme une barre horizontale coupant le bouton. 2 dosages tentes
  (opacite, courbure) AVANT de comprendre que la cause etait structurelle. → a cette echelle,
  liseré fin ancre au bord uniquement, jamais une zone.
- ⛔ **CERNE evenodd MAL FERME = MOITIE DU BOUTON ASSOMBRIE.** Mon 2e sous-chemin ecrivait les
  arcs et le `v-24` dans le mauvais ordre : le "trou" ne coincidait pas avec le contour et
  remplissait la moitie basse. Symptome identique a la ligne parasite du lustre — j'ai donc
  d'abord accuse la mauvaise forme. → Quand un defaut persiste apres correction de la cause
  supposee, RETIRER les formes une par une pour identifier la coupable.
- ⛔ **LISERÉ PARTIEL SUR UNE PILULE = ENCOCHE AUX BOUTS.** Le cerne haut de l'interrupteur OFF
  se terminait par un crochet visible a droite. Un cerne fait le tour complet ou n'existe pas.
- ⛔ **ECRAN DESEQUILIBRE** : l'ecran 2 n'avait de contenu que sur son tiers haut, 400px vides
  en bas. Un ecran mobile se juge en ENTIER, pas element par element. Fix : ajout d'un apercu
  de notification + une note d'aide + un pied (progression + bouton) — des pieces credibles du
  registre, pas du remplissage decoratif.
- ⛔ Fleche hampe-rect + pointe-triangle : decrochement au raccord (voir TECHNIQUES).

## 2026-08-31 — chassis metal chill-meter (2 pieges, payes en cours de route)
- ⛔ **SHEEN DIAGONAL SUR LA COQUE ENTIERE = BANDE QUI COUPE LE PANNEAU EN DEUX.** Un degrade
  d'opacite diagonal (x2=1 y2=0.35, op 0.16) pose sur un corps de 1272x716 lit comme une bande
  claire oblique traversant coque ET percu jusque dans l'ecran. Meme famille que "tout lustre
  devient une ligne a grande largeur" — la version DEGRADE DOUX n'y echappe pas. Fix : sheen
  VERTICAL (colonnes de reflet, x2=1 y2=0) opacite <= 0.10. Les cassures nettes de reflet ne
  sont belles que sur les PETITES surfaces (plaque titre, colliers).
- ⛔ **RENDER RELANCE DEPUIS LE MAUVAIS CWD + `| grep` = MESURE D'UN RENDU PERIME.** Apres cd
  dans le scratchpad, `python3 scripts/tools/...` (chemin relatif) a echoue, le grep a avale
  l'erreur, et ma "iteration 2" a mesure les PNG de l'iteration 1 (chiffres STRICTEMENT
  identiques = le signal). Reflexe : des que deux mesures successives sont identiques au
  millieme, verifier les TIMESTAMPS des fichiers avant d'interpreter.

## 2026-09-01 — Réseau de points / graphe (Fable v1 rejetée, pièges Opus payés en chemin)
> Détail technique complet : `TECHNIQUES.md` § RÉSEAU DE POINTS / GRAPHE ORGANIQUE.

- ⛔⛔ **GRAPHE NON CONNEXE = ÎLOTS ISOLÉS, invisible aux contrôles techniques.** Une v1
  passait tous les contrôles auto (ids uniques, bbox, éléments interdits) mais formait un
  triangle-îlot + des chaînes serpentines déconnectées de la composante principale — lu
  comme "ciel étoilé", pas "réseau où l'histoire circule". Détecté SEULEMENT en se demandant
  si le rendu racontait la phrase du brief, pas par un test structurel. Fix : union-find,
  souder chaque composante isolée par sa paire de nœuds la plus proche.
- ⛔⛔ **TRANSPARENCE CLAIRE SUR FOND SOMBRE SATURÉ = GRIS SALE.** Halos et anneaux à
  fill-opacity 0.10-0.16 sur fond violet #4A1D8F composent en gris, lisent comme un flou de
  compression — l'exact contraire du "aplats purs" du brief. Deux versions en étaient
  couvertes avant de le voir au rendu. Fix : relief par empilement de formes PLEINES
  uniquement, accent par stroke net (pas de voile à faible opacité).
- ⛔ **COMPOSITION JUGÉE ÉQUILIBRÉE À L'ŒIL = FAUSSE.** Une grille de mesure (8×5, comptage
  de pixels non-fond par cellule) a révélé une colonne entière à 0-14‰ et une rangée à 2‰
  pendant que la composition semblait remplie. L'œil suit la densité et ignore le vide.
- ⛔ **LIEN "ASSORTI" À LA PALETTE = LIEN INVISIBLE.** Lignes lavande sur fond violet
  (harmonieuses) disparaissaient — contraste sacrifié à l'esthétique sur un élément porteur
  d'information. Même famille que "texte en couleur de filet".

## 2026-09-01 — Silhouettes rupestres (13 iterations, defauts payes en chemin)
> Registre monochrome sans stroke : TOUS les defauts ci-dessous sont des defauts
> de SILHOUETTE. Aucun n'etait visible dans le code, tous trouves a l'oeil.

- ⛔⛔ **TORSE EN CAPSULE = PANTIN DE TRAITS.** Une capsule entre hanche et epaule
  ne fait pas un tronc : la figure lit comme une araignee/un pantin filiforme,
  meme avec des membres justes. J'ai d'abord cru a un probleme d'EPAISSEUR et
  epaissi la capsule (iteration perdue) — la cause etait la FORME, pas la valeur.
  Fix : tronc en masse (quadrilatere courbe, large aux epaules).
- ⛔⛔⭐ **ARC A BALAYAGE INVERSE = "DARD" A L'EPAULE, avec un symptome MOUVANT.**
  `A r,r 0 0 1` au lieu de `0 0 0` creusait le sommet du tronc en concave. Le
  defaut s'est presente successivement comme "encoche entre tete et bras", puis
  "decrochement carre au flanc", puis "pointe triangulaire" — j'ai accuse le cou,
  puis le bras, avant de rendre le TORSE SEUL et de voir le creux.
  ⭐ **Un defaut qui change d'apparence selon ses voisins appartient a la forme
  elle-meme.** Isoler la forme AVANT de doser ou d'accuser une voisine.
- ⛔ **COU AJOUTE = EPAULEMENT EN ESCALIER.** Ajoute pour rattraper une tete
  remontee, il faisait une marche carree sur le flanc du tronc. Supprime : dans ce
  registre la tete mord directement dans le tronc. La piece elle-meme etait le bug.
- ⛔ **BASSIN EN CAPSULE SOUS UN TRONC PLEIN = BOURRELET A DOUBLE BOSSE.** Il
  depassait de part et d'autre des hanches. Supprime (le tronc descend deja).
- ⛔ **GENOUX EN BULLES** : mollet plus etroit que le bas de la cuisse -> le fond
  dessine le bord de la cuisse. Meme cause/meme fix que la jambe-colonne (29/08) —
  la regle valait deja, je ne l'avais pas appliquee d'emblee.
- ⛔ **FUSIONS DE SILHOUETTES** (le defaut n1 du registre, 4 occurrences) : museau
  de gazelle dans les feuilles de la plante · croupe d'une gazelle dans les pattes
  de l'autre · tete de chasseur dans son bras d'appui · bras traversant la tete.
  Aucune n'est detectable autrement qu'a l'oeil : declarer un ECART_MIN et verifier
  au rendu.
- ⛔ **CORPS DE QUADRUPEDE EN CAPSULE DROITE = TABLE / SCARABEE**, surtout avec des
  pattes rapprochees. Fix structurel : dos creuse + ventre remontant + pattes par
  paires bien separees.
- ⛔ **PIROGUE TROP CREUSE = BOL.** Creux 104 sur 460 de long lisait comme une
  coupe. Un croissant de pirogue est surbaisse (~12 % de la longueur).
- ⛔ **PLANTE A PAIRES REGULIERES = SAPIN.** Ni la longueur des feuilles ni leur
  angle moyen n'y changent rien tant que l'espacement est constant : il faut des
  entre-noeuds INEGAUX.

## ⛔⛔⭐⭐⭐ 2026-09-01 (2e passe, AVEC la vraie image) — MON REGISTRE SUPPOSE ETAIT FAUX
> La v1 avait ete dessinee depuis une DESCRIPTION TEXTE ("silhouettes blanches
> pleines"). La reference reelle a montre un registre DIFFERENT. Ce qui suit est
> l'ecart mesure entre ce que le texte m'avait fait supposer et le reel.

- ⛔⛔ **LE REGISTRE ETAIT MIXTE, PAS UNIFORME.** Le brief disait "silhouette
  pleine" ; la reference fait **humains + vegetal + barque en TRAITS
  CALLIGRAPHIQUES fuseles** (coup de pinceau effile en pointe) et **seulement
  les ANIMAUX en masses pleines**. J'avais applique "masse pleine" partout.
  ⭐ Consequence : mes humains lisaient comme des pictogrammes epais alors que
  la ref dessine des figures au pinceau. **Aucune de mes 13 iterations v1
  n'aurait pu corriger ca : je perfectionnais la mauvaise primitive.**
- ⛔ **La teinte donnee dans un brief texte peut etre fausse** : #C41E3A annonce,
  #D61B26 mesure (plus vif, plus orange). Toujours releverla couleur sur l'image.
- ⛔ **Mes proportions etaient fausses d'un facteur 2 a 3** : plante 276 u de
  large au lieu de 87 · lances a 45 deg au lieu de ~2 et ~15 deg · pirogue 519
  au lieu de 366. Une description texte ne transmet PAS les proportions.
- ⛔ **POSTURES : j'avais invente "fente de course symetrique".** Le reel :
  jambes DISSYMETRIQUES (une tendue en longue courbe, une flechie avec un vrai
  genou), pieds en CROCHET recourbe, tete OVALE inclinee posee DANS l'angle de
  l'epaule, bras en longue courbe partant de l'EPAULE et passant au-dessus du
  crane. Mon Λ symetrique partant d'un point unique etait le defaut principal.
- ⛔⛔⭐ **LE COU DE L'ANIMAL — 3 dosages perdus, cause geometrique.** Mon cou
  lisait comme un TRIANGLE MASSIF (une "voile" devorant le corps). Ni la
  direction ni la position n'etaient en cause : **une base large + une pointe
  fine sur un trait RECTILIGNE ne peut produire qu'un coin triangulaire.**
  C'est geometrique, aucun reglage d'angle ne l'atteint. Fix : garder la base
  epaisse mais COURBER le trait (encolure convexe dessus, gorge concave dessous).
  ⭐ Meme famille que le bug d'arc inverse de la v1 : **un defaut que le dosage
  n'atteint pas appartient a la geometrie de la forme** — rendre la forme SEULE.
- ⛔ **Positions de pattes : je les avais mises au CENTRE du corps** (0.44/0.52),
  la ref les mesure a 0.32-0.37 et 0.77-0.90 -> lecture "tabouret".
  ⭐ Methode qui tranche : **balayer des LIGNES de pixels de la reference** et
  relever les segments blancs. Donne les x exacts en une passe.

## 2026-09-02 — Passe vieillie chill-meter (1 defaut paye)
- ⛔ **DASHARRAY SUR LE REFLET D'UN GRAND COUDE = LIGNE COUSUE.** Le reflet long des
  coudes hauts (traits de ~180u, seuls sur fond clair) passe en dasharray 26/12 lisait
  comme un POINTILLE DE COUTURE flottant, pas comme une usure. Le meme dasharray sur les
  TRONCONS VERTICAUX des tubes (courts, encadres par le corps du tube et les tics de
  joints) marche tres bien. La difference : un reflet casse ne lit "use" que si le tube
  autour de lui reste dessine — isole sur du vide, il devient un trait decoratif.

## 2026-09-02 — Passe rouille chill-meter (3 pieges payes en chemin)
- ⛔⛔ **ZONE DE TEXTURE PLUS GRANDE QUE LE METAL = TEXTURE SUR LE FOND.** Mes blobs de
  piquetage (r 460 !) servaient de SourceAlpha au composite : la moucheture remplissait
  le blob, pas l'appareil — masse mouchetee sous la machine, pastilles debordant a gauche.
  feComposite in SourceAlpha borne au shape PORTEUR ; il doit etre strictement interieur
  au metal (dup d'un chemin existant, ou rect arrondi calcule dedans).
- ⛔⛔ **NUAGE CHAUD PLEINE SURFACE OP ~0.5 = CAMOUFLAGE MILITAIRE.** Couverture ~50 %
  uniforme partout : l'exact "grain inegal" reproche, en pire. La correction n'etait pas
  l'opacite mais (1) teinte neutre pour les marbrures de VALEUR, (2) le chaud reserve a
  des zones basses bornees, (3) seuil alpha durci pour faire des ilots.
- ⛔ **VOILE CLAIR (lift) SUR LE CORPS ENTIER = FUMEE.** Des nappes gris clair bf 0.012
  sur le corps sombre lisaient comme de la fumee/vignettage au-dessus du cadre ecran.
  Confine aux memes rects d'usure que l'oxyde -> l'artefact disparait. Meme famille que
  "tout lustre a grande largeur devient une ligne" : un effet clair diffus n'est legitime
  que la ou une CAUSE physique le place.

## 2026-09-02 — Balancoire TED-Ed (3 pieges payes, tous vus au rendu/zoom)
> Registre "aplats purs" AVEC 2 images de reference. Aucun de ces defauts
> n'etait detectable par un controle technique (ids, bbox, elements interdits).

- ⛔⛔⭐ **J'AI EMPILE DES OMBRES DANS UN REGISTRE QUI N'EN A AUCUNE.** Reflexe des
  objets d'interface applique sans verifier : tranche sombre sous la planche, socle
  decale sous chaque disque, flanc assombri du triangle. La COUPE DE PIXELS de la
  reference montre des teintes CONSTANTES bord a bord (#D61B26 du haut au bas du
  disque). Sur un aplat pur, un socle decale produit un CROISSANT sombre — meme
  famille que "transparence claire sur fond sature = gris sale" (01/09).
  ⭐ La regle "5-12 formes empilees" est CONDITIONNELLE AU REGISTRE. 3e fois que je
  le paie. → verifier par coupe AVANT de decider du nombre de formes.
- ⛔⛔ **POSITION CALCULEE PERPENDICULAIREMENT A L'AXE = OBJETS QUI LEVITENT.**
  J'ai place les disques par leur distance perpendiculaire a l'axe de la planche
  (mesure juste sur la ref INCLINEE). Au rendu HORIZONTAL, gap de 5-6 px la ou la
  ref en a 1-2 : les masses flottaient au-dessus de la barre au lieu d'y etre
  posees. ✅ Mesurer le GAP BORD-A-BORD (bas de l'objet vs haut de la barre),
  colonne par colonne, sur la ref ET sur son propre rendu.
- ⛔⛔⭐ **LE MASQUE DE COULEUR MENT SUR LES PETITES PIECES.** Pour le contrepoids
  vert (14 px de diametre) ma mesure annoncait un chevauchement de 9 px — le zoom
  montrait un disque nettement DETACHE de la barre. Cause : le liseré antialiasé du
  JPEG autour de la planche etait compte comme encre verte par le seuil.
  ⭐ **Sous ~20 px, la mesure par masque n'est pas fiable : zoomer (crop x8 NEAREST)
  et trancher a l'oeil.** J'ai failli livrer le defaut en me fiant au chiffre.

## 2026-09-03 — Bascule gunmetal chill-meter (2 pieges payes en chemin)
- ⛔⛔ **CHROME HEADLESS SUR UN .SVG DIRECT = MESURE FAUSSE SANS ERREUR.** Le screenshot
  d'un fichier .svg ouvert tel quel arrive REDIMENSIONNE avec une bande BLANCHE en bas :
  lum moyenne 137 au lieu de 82, tous les chiffres faux, aucun message. Symptome-signal :
  une lum qui saute de +50 entre deux moteurs sur la MEME source. Fix : wrapper HTML
  <img width=W height=H> margin 0 — reproduit alors le rendu de reference au dixieme.
- ⛔ **REMAP DE ZONE EN BLOC = LES ACCENTS GLOW DESATURES AVEC LE METAL.** Les libelles
  icy (#6fd4ff) des boutons vivent DANS le fragment metal boutons_bas : le remap "tout
  ce qui est froid" les a blanchis (vu seulement au zoom sur le rendu). Un fragment
  "metal" contient aussi des accents fonctionnels — separer par seuil de saturation
  (B-R >= 60 = accent, intouche), pas par appartenance au groupe.
- ⭐ **CRITERE GLOBAL IMPOSE SANS DECOMPOSITION = MISSION IMPOSSIBLE INVISIBLE.** Le
  critere R-B global -8..+2 etait inatteignable : 47 % de la matiere (cavite ecran,
  intouchable par contrat) pesait -44 a elle seule. 2 mesures de decomposition l'ont
  prouve — decomposer AVANT d'iterer sur un critere chiffre, et rapporter le conflit
  au lieu de forcer.

## ⛔⛔⭐⭐⭐ 2026-09-04 — UN COMPTE DE PIXELS MESURE LA PRESENCE, PAS LA LISIBILITE
> Le piege le plus couteux de la mission cauri, et il aurait fait livrer un mauvais seuil.

Mission : dire a quelle taille masquer un calque de detail. J'ai ecrit **DEUX** controles
automatiques ; **les deux ont repondu « lisible » jusqu'a 10 px inclus**, sur un defaut
FLAGRANT des qu'on zoome (a 10 px le detail est une TACHE qui salit la forme, et la
silhouette NUE est plus lisible).
- Controle 1 — nombre de pixels differant entre rendu AVEC et SANS le detail. A 10 px le
  detail atteint son score **MAXIMUM** (23,3 % de la coquille) : plus la forme est petite,
  plus le detail pese en proportion. La metrique pointait exactement a l'envers.
- Controle 2 — ondulation de la largeur (« les dents sont-elles separables ? »). Sous 18 px
  elle mesure l'**antialiasing**, pas des dents.
✅ Ce qui a tranche : **rendre a la taille REELLE puis agrandir en NEAREST (x9-x14) et
REGARDER**. A taille reelle 12 px sont trop petits pour qu'on VOIE le probleme ; agrandis en
NEAREST, il est evident.
⭐ 2e application de la regle deja ecrite (balancoire 02/09 : « sous ~20 px la mesure par
masque n'est pas fiable, zoomer et trancher a l'oeil »). Elle ne valait pas que pour les
masques de couleur : **elle vaut pour TOUTE metrique de petite echelle**.
⭐ Consequence livree : le generateur n'imprime plus de verdict automatique sur ce point —
il serait faux. Un rapport vert qui mesure la mauvaise grandeur est pire que pas de rapport.

## 2026-09-04 — Coquille de cauri (6 defauts payes, AUCUN visible dans le code)
> Registre aplats purs AVEC 2 references photo mesurees. Tous trouves au rendu/zoom.

- ⛔⛔ **SMOOTHSTEP ENTRE POINTS DE CONTROLE = CONTOUR EN ESCALIER.** Facettes visibles des
  480 px. Continu en valeur, derivee discontinue a chaque noeud. J'ai failli augmenter le
  nombre d'echantillons : ca n'aurait RIEN change (meme courbe cassee, mieux echantillonnee).
- ⛔⛔ **CORDE DROITE POUR FERMER UN BOUT = 3 defauts selon la largeur** : base en COUPE
  FRANCHE (« galet scie »), puis apres correction du profil, sommet en PLATEAU A DEUX ANGLES
  VIFS (lecture « tente »), et avec une largeur nulle un CUSP. Les bouts sont des ARCS.
- ⛔⛔⭐ **CALOTTE « FONDUE » AVEC LE PROFIL = les 2 defauts qu'elle devait supprimer.** Pour
  arrondir un sommet j'ai melange une ellipse et le profil mesure sur la fin de l'intervalle.
  Deux courbes qui n'ont ni la meme VALEUR ni la meme PENTE au raccord ne se raccordent pas
  par un fondu : j'ai obtenu une ENCOCHE D'EPAULE de chaque cote + un NUB aplati au sommet.
  ⭐ 3e application de « un raccord qui resiste ne devrait pas exister » : la solution n'etait
  pas un meilleur melange mais SUPPRIMER LA JONCTION (le sommet devient des points de
  controle de la MEME spline).
- ⛔⛔ **FLECHE D'ARC CHOISIE A L'ESTIME = TOURELLE EN TETINE.** « C'est un dome donc c'est
  bombe » -> 0,55. La flèche qui prolonge exactement les flancs se CALCULE et vaut 0,099
  (5,5x moins). Une valeur derivable de la geometrie ne se devine jamais.
- ⛔ **DENTS PLUS PROFONDES QUE L'OUVERTURE LOCALE = FORME TRONCONNEE.** Amplitude donnee en
  fraction de la largeur de l'OBJET : la ou la fente est etroite, les dents des 2 levres se
  rejoignaient et coupaient le brun en morceaux (« scie »). Profondeur RELATIVE au local.
- ⛔⛔ **DETAIL QUI DEBORDE DE LA SILHOUETTE** (violation directe du brief : le calque doit
  etre detachable sans artefact). En elargissant la fente, son arc de bout (demi-cercle) a
  grandi avec elle et PENDAIT SOUS LA BASE. Invisible a 480 px ; c'est le controle ecrit
  apres coup qui l'a chiffre (ts=1,040, soit 4 % sous la base).
  ⛔ Et piege de VERIFICATION juste apres : mon 1er controle recalculait le bout depuis la
  fonction de largeur alors que le path plafonne ce rayon -> il criait sur un defaut
  inexistant. **Verifier les POINTS REELLEMENT EMIS, jamais une reconstruction.**

## ⭐⭐ 2026-09-04 — LE BRIEF SE TROMPAIT SUR LA MORPHOLOGIE, LA PHOTO A TRANCHE
Le brief donnait le cauri « plus large que haut, rapport ~1,4:1 ». Les 2 references
photographiques mesurent l'INVERSE : h/w = 1,18 et 1,35 en vue ventrale. Dessiner le ratio
annonce aurait produit un objet couche — une erreur de REGISTRE, pas de detail, donc
irrattrapable par iteration.
⭐ 4e confirmation : **relever la reference AVANT de dessiner, meme quand le brief a l'air
precis et chiffre.** Un brief chiffre n'est pas une mesure. (Deja paye : teinte #C41E3A
annoncee / #D61B26 mesuree, 01/09.)
⭐ Corollaire nouveau : la photo apporte aussi ce que le texte ne sait pas dire — ici, que les
2 levres de la fente ne s'engrenent PAS symetriquement (une porte des bosses franches,
l'autre est lisse). Le brief decrivait un engrenement symetrique.

## ⚠️ 2026-09-04 — COMPARER A UNE PHOTO : ne pas copier ce qui est de l'OMBRE
En posant mon dessin a cote de la reference, j'ai cru ma silhouette « trop ovoide » et la
reference « plus en bouclier, flancs plus plats ». Verification chiffree : mon profil colle
au profil mesure a **+-0,005 pres partout**. L'ecart percu venait des LEVRES ROULEES de la
coquille, qui sur une PHOTO OMBREE se lisent comme des bords rentrants — une information de
MATIERE, absente par definition d'un registre en aplats purs.
⭐ Reflexe : avant de corriger une silhouette « d'apres l'impression cote a cote », comparer
les PROFILS CHIFFRES. Sinon on importe l'ombrage de la photo dans un dessin qui n'en a pas.

## ⛔ 2026-09-05 — GEMINI 3.8 FLASH : INVENTE CE QU'IL NE SAIT PAS LIRE
Benchmark 5 pieces x 2 modeles, brief identique (nos 4 regles), references photo fournies.

**Le symptome, constant** : quand la reference contient un detail qu'il ne resout pas, il
**substitue un motif decoratif plausible** au lieu de dessiner ce qu'il voit.
- Objet rustique (molette + rouille) → 4 **cabochons orange** aux angles, ABSENTS de la
  reference ; molette lisse au lieu de crantee ; **zero corrosion** alors que c'etait
  l'enjeu declare de la piece.
- Manometre SANS reference → invente un arc vert-jaune-rouge, une aiguille rouge et une
  jauge a segments que personne n'a demandes.
- Icone documents → documents deformes en losanges pointus, loupe **sans manche**.
⭐ Le meme modele AVEC reference se recadre nettement (manometre B). L'invention apparait
quand la reference manque OU qu'un detail resiste. **Ce n'est pas un defaut de style, c'est
un defaut de LECTURE.**

⚠️ Aussi : accent non-ASCII dans un `id` (interdit, casse la chaine Lottie), et
**3 sorties sur 5 tronquees** a 32000 tokens de sortie (SVG verbeux) — il faut lui donner
64000. Un SVG tronque n'est PAS du XML valide : il ne s'affiche nulle part.

## ⛔⛔ 2026-09-05 — UN RAPPORT DE CONFORMITE 100/100 SUR UN FICHIER CASSE
Mon script de conformite a donne **100/100 a 4 SVG tronques** (coupes en plein milieu).
Ils passaient tous les criteres — pas d'element interdit, ids uniques, 100 % nommes — parce
qu'aucun ne verifiait que **le XML est bien forme**. Decouvert seulement en tentant de les
RENDRE en image.
⭐ Correctif applique : `ET.fromstring()` en **gate n°1** de
`scripts/tools/svg-conformite-pipeline.py` (score 0 + arret immediat si le XML est invalide).
⭐⭐ Enieme confirmation de `feedback_rapport-vert-ne-prouve-rien-regarder-l-image` : un
rapport mesure sa propre couverture, pas la realite. **Rendre l'image reste le seul juge.**

## ⛔⛔ 2026-09-05 — LE RATIO NE SE DEDUIT PAS DU `viewBox` : L'IMPOSER DANS LE BRIEF
Brief au modele : « viewBox="0 0 1195 896" » (les proportions de la reference). GPT-6 Astra
a bien respecte le viewBox... mais **l'objet DESSINE DEDANS** occupe un ratio different :

| | ratio L/H de l'objet |
|---|---|
| Reference (PNG valide) | **1,950** |
| Sortie GPT-6 (meme viewBox) | **1,784** |

**8,5 % d'ecart.** Le modele a laisse plus de marge haute/basse et moins de marge laterale —
rien ne le lui interdisait. Consequence mesuree, a largeur imposee (541 px, centre sous le
cadre video de la cliente) : le chassis descend **26 px plus bas**, la marge basse tombe de
**97 a 71 px** (un quart de la respiration perdue), avant meme le givre qui deborde encore.

⭐ **Un viewBox contraint le CADRE, pas le DESSIN.** Pour qu'une piece soit interchangeable
avec une reference existante, ecrire dans le brief : « l'objet doit occuper un ratio
largeur/hauteur de X,XX et remplir le cadre en laissant au plus N px de marge ». C'est
gratuit au 1er appel, et ca coute une regeneration + un recalage complet apres.
⭐⭐ Corollaire : **mesurer le ratio de l'OBJET (bbox du contenu), jamais celui de l'image.**
Les deux fichiers avaient le meme viewBox et des objets de proportions differentes.
⚠️ Repere a l'oeil par Aziz AVANT que je le mesure — enieme confirmation que l'oeil voit des
ecarts de forme que ni le script de conformite ni le contraste local ne detectent.

## 2026-09-06 — Signal Orbit (5 etats line-art) : defauts payes, tous vus AU RENDU
> Le detail de la construction retenue est dans TECHNIQUES.md § "ON EST DEDANS".

- ⛔⛔ **ETAT "on est dedans" : 4 constructions perdues** (camera exterieure x3, puis point
  de fuite dans le cadre, puis point de fuite trop loin). Symptomes successifs : arcs quasi
  DROITS lus comme une grille · POLE DE GLOBE + 2/3 de cadre vide · ETOILE/EXPLOSION par
  convergence visible · meridiens ENTIEREMENT hors cadre (il ne restait que 4 arcs blancs
  et des points). A chaque fois j'ai d'abord cru a un dosage (rayon, angle) alors que
  c'etait le POINT DE VUE. Cf. regle n°3 de doctrine : quand ca resiste, la decoupe est fausse.
- ⛔⛔ **TRANSPARENCE CLAIRE SUR FOND BLEU NUIT = GRIS SALE** (n-ieme confirmation, meme
  sur du CORAIL sature) : trainee corail a `stroke-opacity 0.55` sur `#0b1020` -> lit BLANC
  GRISATRE, la couleur d'accent a disparu. Fix : opacite 0.9-1.0 sur tout element porteur
  d'information, et reserver la transparence aux SEULS halos empiles.
- ⛔ **3 CERCLES CONCENTRIQUES EPAIS = UNE CIBLE DE VISEE**, pas une onde. L'anneau "pulse"
  ferme et epais autour du globe lisait comme un reticule d'arme. Fix : arcs OUVERTS (300 deg,
  phases decalees), plus fins, ecartes du limbe -> "onde qui se propage".
- ⛔ **UNE TRAINEE QUI TRAVERSE L'OBJET PAR-DEVANT LIT COMME UN TRAIT PARASITE.** La trainee
  du point coupait le globe en diagonale. Fix : filtrer les points a `hypot(...) > R+4` —
  la trainee n'existe QUE hors du limbe, donc le point revient de l'arriere.
- ⛔ **GLOBE FILAIRE A PAS REGULIER = GLOBE DE BANQUE D'IMAGES** (ce que le brief
  interdisait explicitement). Meridiens tous les 30 deg + 5 paralleles reguliers = l'icone
  stock. Fix STRUCTUREL : pas IRREGULIER, 3 niveaux d'epaisseur franchement contrastes,
  noeuds aux intersections porteuses, axe polaire qui depasse, et SUPPRESSION de la face
  arriere en fil de fer (elle ajoutait du bruit sans donner de volume).
- ⛔ **COMPOSITION QUI PENCHE** : 2 modules empiles a gauche + 1 seul a droite. Vu
  uniquement au rendu. Fix : repartition en TRIANGLE autour du cadran.
- ⛔ Filet de liaison a DOUBLE COUDE = plomberie ; il s'arretait en l'air sans toucher le
  cadran. Fix : un seul coude franc + une pastille de branchement sur le cercle.

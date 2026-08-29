# STARTER — RIG DE PERSONNAGE : animer NOTRE dessin, et piloter celui des autres

> Cadre par Aziz le 2026-08-28, ELARGI le 2026-08-29.
> ⭐⭐ **PRIORITE FIXEE PAR AZIZ LE 29/08** : tester d'abord **l'ANIMATION DU CHIEN DE FABLE**,
> et d'autres formes similaires issues de **fichiers de reference PRO**. Le pilotage d'un rig
> tiers (la question d'origine, plus bas) reste ouvert mais passe en second.

---

## ⭐ PRIORITE 1 — ANIMER LE CHIEN DE FABLE (et des formes similaires)

**Ce qui existe deja, pret a reprendre** : `src/projects/_client-sim/repro-chien/`
(lire son `README.md` en premier, il porte l'etat exact et les pieges deja payes)

- `assets/chien-tete.svg` — tete de chien mascotte, **dessinee par Fable 5** depuis les
  FRAMES d'une piece pro. ⛔ Dessin ORIGINAL : 0 sommet en commun avec le fichier pro.
  17 groupes nommes, 5 `clip-path` structurels.
- `partition.ts` — les gestes **MESURES** sur la piece pro (oreilles dephasees, iris en
  coups d'oeil de 0,02 s, langue +/-70 deg). ⛔ Ne pas re-inventer ces valeurs.
- `ref/` — 3 frames de reference.

### ⛔ LE BLOCAGE A LEVER D'ABORD : la PRECOMPOSITION

Mesure du 29/08 : **1 pochoir sur 5 porte**. Les 4 refus disent tous la meme chose :

    clip d'un groupe de N calques — Lottie ne decoupe qu'un calque par pochoir
    (precomposition non implementee)

**Pourquoi** : un oeil n'est pas une forme, c'est 4 calques (globe, iris, pupille, reflet).
Le pochoir doit decouper l'ENSEMBLE, et Lottie ne decoupe qu'un calque a la fois.
→ il faut apprendre a `svg2lottie_scene.py` a fabriquer une **precomposition** (`ty:0` +
un asset `{id, layers}`).

⭐ **Meme brique, deux verrous** : la piece 2 (onboarding, `12_BVaKTgmqgb.lottie`) a
**45 precomps imbriques sur 3 niveaux**. La precomposition debloque les deux chantiers.

⛔ Animer AVANT de lever ce blocage donnerait un iris qui deborde du globe — exactement le
defaut visible quand on desactive les mattes.

### Ensuite : les PIVOTS (mesures, pas a tatonner)

Aucun groupe ne porte encore de `transform`. Boites deja mesurees (repere 1000x1000) :

| Partie | Boite | Pivot |
|---|---|---|
| `ear-l` | x 155-375, y 248-588 | sa BASE (~265, 280), pas son centre |
| `ear-r` | x 625-845, y 248-588 | sa BASE (~735, 280) |
| `tongue` | x 452-548, y 722-808 | son ATTACHE (~500, 725) |
| `iris-l` / `iris-r` | x 305-445, y 442-575 | leur CENTRE — ils translatent, ne pivotent pas |

Regle : une oreille pivote depuis son attache au crane, une langue depuis sa racine, un iris
se deplace sans tourner. Ca se deduit de l'anatomie, pas d'un reglage a tatonner.

### « D'autres formes similaires » — ce que ca veut dire concretement

Le corpus contient **15 pieces a mattes** (`out/_r-and-d/corpus-kamotion/`). Les candidats
proches du chien (mascotte, vectoriel, peu ou pas de raster) :
`01_oG7VdeJLRy` (12 mattes) · `03_tcSIMHGGqP` (14) · `20_Full_Vibeup_Splash` (10) ·
`10_Piggy_Bank_Tax_Day` (4) · `14_Piggy_Bank_Running` (5).
⛔ Ecarter `19_kiosk` (25 images raster : on reproduirait des photos).

### ⭐ CE QUE LE CHIEN A APPRIS — ET LES 3 CORRECTIONS D'AZIZ (29/08)

Fable a reussi un cas qu'on classait « organique donc voue a l'echec ». Son analyse,
**verifiee par mesure** (24 primitives sur 50 formes, 3 paths a topologie libre, 5 paires
symetriques) : une mascotte de face est **organique en apparence, objet en construction**.

⛔⛔ **TROIS CORRECTIONS D'AZIZ — elles annulent une conclusion trop rapide du 29/08** :

1. **La main n'a JAMAIS ete « dessinee avec reference ».** Un audit avait conclu ca en lisant
   un commit ; c'est FAUX. Le geste reel : on a telecharge un **Lottie premium**, recupere la
   **STRUCTURE** de la main, et greffe ca sur notre composition. C'est une greffe de squelette,
   pas un dessin d'apres image.
   ⛔ Et le resultat n'est pas anatomique : **l'index est un tube droit sans phalange ni
   jointure, descendant jusque dans la paume ; les 3 doigts replies sont 3 arcs identiques.**
   C'est une ICONE de curseur, pas une main. ⚠️ Le ratio doigt/paume (0,72, plausible) ne le
   voyait PAS — le defaut est STRUCTUREL, pas proportionnel. Encore un cas de « la mesure est
   biaisee par la facon de mesurer ».

2. **Un dessin statique reussi ne dit RIEN de son animabilite.** Le visage du pecheur (Fable,
   07-20) sortait tres bien en statique — **et s'animait bizarrement**. Juger un modele sur son
   rendu fixe est insuffisant : le vrai test est le mouvement.

3. **Le chien reste une FACE DE MASCOTTE, symetrique et simple** — Fable le dit lui-meme. Un
   **personnage CORPS ENTIER** (ce qu'on voit couramment dans les Lottie) est probablement un
   autre metier : rigging, ou illustration decoupee puis articulee. ⛔ Ne pas extrapoler du
   chien vers le corps entier. **A TESTER dans cette session**, pas a supposer.

### ⭐⭐ LA DIRECTION FIXEE PAR AZIZ : la reference FICHIER, pas la reference IMAGE

> « Ce sera encore plus efficace, au lieu de juste une image, d'avoir **les fichiers eux-memes**,
> meme gratuits, pour nos propres tests, pour savoir exactement **comment greffer les
> structures**. »

Une image de reference aide a DESSINER. Un **fichier** Lottie de reference apprend a CONSTRUIRE :
ou sont les pivots (`ks.a`), comment les calques sont decoupes, comment le parentage est cable,
comment le mouvement est reparti. C'est ce qui manque pour ANIMER — et ca inspire le dessin en
prime.

**Protocole a suivre desormais** pour tout personnage (chien ou autre) :
1. Prendre un Lottie de reference (gratuit suffit pour un test interne).
2. Le DEMONTER : `planche_calques.py` (chaque calque seul), pivots, parentage, decoupage.
3. Comprendre la STRUCTURE avant de dessiner quoi que ce soit.
4. Greffer / s'en inspirer pour notre propre construction.
⛔ Licence : un fichier gratuit sert au TEST INTERNE. Pour un livrable client, verifier la
licence (Lottie Simple = VIRALE, portfolio only).

---

## ⭐ PRIORITE 1bis — LE PERSONNAGE CORPS ENTIER (question ouverte d'Aziz)

> « Creer un personnage comme on voit souvent dans les Lottie, avec le corps entier.
> D'apres ce que j'ai compris souvent c'est du rigging, ou ce sont des illustrations
> animees par la suite. Je ne sais pas trop comment ils font. Je pense que c'est toute
> une autre paire de manches. »

⛔ **NE PAS extrapoler depuis le chien** : une face de mascotte est symetrique, frontale, et
faite de primitives. Un corps entier a des membres articules, des rotations autour de pivots
anatomiques, des occultations (un bras passe devant le torse) — rien de tout ca dans le chien.

**Ce que le corpus permet de repondre SANS rien construire** (`out/_r-and-d/corpus-kamotion/`) :
il contient des personnages corps entier deja animes. Les DEMONTER repond a « comment ils font » :
- `13_Hiker_Walking_Theme_Cycle.lottie` — un marcheur, cycle de marche + state machine
- `16_Pumpkin_boy.lottie` · `15_Customs_Officer.json` — personnages debout
- `18_Exercise.lottie` · `14_Piggy_Bank_Running.lottie` — corps en mouvement

**Questions a leur poser** : les membres sont-ils des calques separes avec `parent` (= rigging
par parentage) ou des formes redessinees image par image (= illustration animee) ? Ou sont les
pivots ? Combien de cles par membre ? Y a-t-il des precomps par membre ?
⭐ C'est de la LECTURE, pas de la production — reponse rapide et factuelle.

## QUESTION 2 (ouverte) — PILOTER UN RIG EXISTANT

> Question d'origine du 28/08, toujours valide mais **en second** depuis le 29/08.

### La formulation d'Aziz, ne pas la reduire

> « On cree quelque chose — un decor, une forme — on veut y rajouter un personnage.
> Est-ce que prendre un rig existant peut ensuite etre PILOTE par nous ? Peut-on lui
> faire faire ce qu'on veut, le placer ? Est-ce que ca passe dans le Lottie ?
> Quel genre de rig existant, quel marche regarder ? »

⭐ Ce n'est PAS « sait-on animer un personnage » (repondu : non, c'est un metier).
C'est **« sait-on REUTILISER le travail de quelqu'un d'autre et le PILOTER »** — donc
une question d'assemblage et de controle, pas de character design.

## CE QUI EST DEJA ETABLI (ne pas re-explorer)

- ⛔ **Pas de rigging dans le MCP Creator** : verifie sur les 110 outils — ni bones, ni
  squelette, ni parentage. ⚠️ Ne pas exclure que l'INTERFACE le propose sans l'exposer
  au MCP. → `memory/tools/lottie-creator-mcp.md`
- ⛔ **Personnage-heros = ecarte comme offre** (metier different, zero differenciation,
  notre moat est le determinisme). Decision prise sur des briefs REELS.
  ✅ **Restent bons** : personnage FIGURANT dans une scene explicative · client qui
  FOURNIT son personnage. → `memory/client-sim-tests/repro-vendeur-lottie/STATUS.md`
- ⭐ **Un perso Lottie peut etre du BITMAP** : la scene d'exemple de LottieFiles est faite
  de 13 PNG rigges (`ty=2`), zero chemin vectoriel. ⛔ **On ne sait PAS** quelle
  proportion des Lottie a personnages est bitmap vs vectoriel — **mesurable** (compter
  `ty=2` vs `ty=4` sur un echantillon public), **pas mesure**. Ne pas y repondre de memoire.
- ⭐ Notre boucle de vie SANS rigging fonctionne (queue qui bat, clignement) — verdict
  d'Aziz : « a la limite de ce qu'on peut faire en vectoriel sans rigging ».

## LA REPONSE DE GEMINI — utile sur le FOND, ⛔ non verifiee sur les CHIFFRES

Son propos central est juste et recoupe notre propre mesure : **personne ne rigge from
scratch, l'industrie ASSEMBLE a partir de kits** (Envato Elements, Motion Array, Rive
Marketplace, LottieFiles). Un kit = un rig operationnel + une bibliotheque de tetes /
vetements / accessoires + **30 a 50 animations pre-faites**. Le freelance re-habille et
ajuste quelques cles.

⛔ **A TRAITER COMME UN SIGNAL, PAS COMME UN FAIT** :
- « 90-95 % », « 4-15 h de rig », « 30-45 min avec un kit » = **aucune source citee**.
- Sa conclusion (« votre valeur = la direction artistique et le storytelling ») est
  **generique** — vraie pour n'importe qui, elle ne dit rien de NOTRE difference.
- **Il ignore notre position** : son conseil « utilisez des kits » nous ferait entrer
  dans un marche ou on n'a aucun avantage.
→ recoupe `feedback_chiffre-audit-relaye-sans-verification`.

## LE TEST A MENER (3 etapes, dans cet ordre)

1. **TROUVER** un personnage Lottie deja anime, licence claire pour usage commercial.
   ⛔ La licence est le vrai point bloquant : beaucoup de fichiers « gratuits » interdisent
   l'usage client. **Verifier la licence AVANT de mesurer quoi que ce soit.**
2. **DEMONTER** : combien de calques, bitmap (`ty=2`) ou vectoriel (`ty=4`) ?
   Ou sont les pivots (`ks.a`) ? Combien de cles ? Y a-t-il du parentage (`parent`) ?
3. **PILOTER** : c'est LA question. Peut-on le PLACER dans une de nos scenes, changer
   ses couleurs, et surtout **lui faire faire autre chose que son animation d'origine** ?
   Ou bien est-il fige dans son mouvement, utilisable seulement tel quel ?

⭐ **Le critere de reussite** : si on peut re-habiller ET re-piloter, c'est une capacite
reelle. Si on ne peut que le poser tel quel, c'est un asset, pas un outil — et ca change
completement ce qu'on peut en dire a un client.

## OUTILS DEJA PRETS (ne pas les reecrire)

`src/projects/_client-sim/lottie-ui/tools/` :
- `planche_calques.py` — rend chaque calque SEUL (⭐ indispensable pour comprendre un
  fichier qu'on n'a pas ecrit ; annoter la planche avec couleur + centre + aire)
- `group_layers.py` — regroupe et nomme (⛔ **groupes CONTIGUS uniquement**)
- `animate_scene.py` — primitives `fondu` `pop` `trace` `geste3` `respire` `balance` `cligne`
- `compare_render.py` — ecart mesure entre 2 rendus
- `test_logo_client.py` — modele de test a 3 volets

⛔⛔ **PIEGE RECURRENT (3 occurrences)** : toujours chercher les `sh` **EN PROFONDEUR**,
jamais a un niveau fixe. Un fichier regroupe a un cran d'imbrication en plus, et une sonde
qui regarde au mauvais niveau **echoue SILENCIEUSEMENT** (ancre a [0,0], compte a 0).

## RAPPELS DE METHODE (payes 3 fois dans la session precedente)

- ⛔⛔ **Un rapport VERT ne prouve rien** — « transportable a l'identique » a menti 3x.
  RENDRE ET REGARDER avant de conclure.
- ⛔⛔ **Chercher la CAUSE des le 2e echec**, ne pas re-DOSER. Vecu 2 fois le 28/08 :
  0,37 -> 0,36 % (aucun progres) parce que je corrigeais au jugé.
- ⛔ **La mesure est biaisee par la FACON de mesurer** : verifier OU l'on echantillonne
  avant de conclure a un artefact (une mesure « rassurante » a failli enterrer un vrai defaut).
- ⭐ **Import Lottie dans Creator = URL PUBLIQUE obligatoire** (`127.0.0.1` refuse).
  Passer par `scripts/tools/upload-to-blob.py`.
- ⭐ `list_scenes` AVANT toute ecriture : un import CREE une scene et bascule l'active.
- ⚠️ Creator dit « N of M layers hidden » sur toute scene animee : **FAUX POSITIF**, il
  lit la frame 0 ou tout est encore a opacite 0.

# STARTER — RIG DE PERSONNAGE : animer NOTRE dessin, et piloter celui des autres

> Cadre par Aziz le 2026-08-28, ELARGI le 2026-08-29.
> ⭐⭐ **PRIORITE FIXEE PAR AZIZ LE 29/08** : tester d'abord **l'ANIMATION DU CHIEN DE FABLE**,
> et d'autres formes similaires issues de **fichiers de reference PRO**. Le pilotage d'un rig
> tiers (la question d'origine, plus bas) reste ouvert mais passe en second.

---

## ✅ FAIT LE 2026-08-29 — LA CHAINE EST COMPLETE ET PROUVEE

**Le chien de Fable vit.** Dessin -> conversion -> 5 pochoirs -> rig -> animation.
→ `src/projects/_client-sim/repro-chien/` (lire son README) · rendu :
`out/_r-and-d/repro-chien/chien-anime-v2.json`

| Brique | Etat | Mesure |
|---|---|---|
| Pochoir (`tt`/`td`) | ✅ | 0,00 % sur geometrie pro |
| Precomposition | ✅ | 5 pochoirs sur 5 (c'etait 1/5) |
| Rig (`parent` + pivots) | ✅ | chaine main→bras→torse, 0,01 % |
| Animation | ✅ | 28 frames distinctes sur 29 |

**Ce qui se declare dans le SVG** (convention maison, ignoree des navigateurs) :

    <g id="bras" data-parent="torse" data-pivot="haut">
    <g id="main" data-parent="bras"  data-pivot="150,198">

⛔ `data-parent` vise le **NOM DE CALQUE** reel (`head-base`), pas l'id du groupe.
⛔ `data-pivot` accepte haut/bas/centre/gauche/droite ou `x,y`.

**Les 3 lecons payees** (ne pas les repayer) :
1. Chaque calque porte sa PROPRE fenetre `ip`/`op`. Allonger la duree du DOCUMENT ne
   suffit pas — les calques cessaient d'exister a la frame 60, l'animation se figeait,
   et le fichier restait VALIDE. Trouve par un compteur d'images distinctes (3 sur 8).
2. Un geste se lit dans les KEYFRAMES, pas seulement au rendu. Une oreille restee
   dressee 2 s ressemble, a l'oeil, a un maintien voulu.
3. Le mouvement naturel est ASYMETRIQUE : montee vive, retombee molle (1 pour 3).
   Symetrique = essuie-glace.

---

## ⭐⭐ PRIORITE 1 — LE PERSONNAGE CORPS ENTIER (prochaine session)

> Decision d'Aziz le 29/08 : refaire le geste du chien, mais sur un **personnage
> vectoriel corps entier**, en se fiant a des personnages PRO existants.

### ⛔ D'ABORD : d'ou viennent les fichiers, et ce qu'on a le droit d'en faire

⛔⛔ **Je n'ai AUCUN acces a une bibliotheque de rigs.** Les 22 pieces du corpus sont
sur disque (`out/_r-and-d/corpus-kamotion/`, 3,2 Mo), telechargees le 28/08 depuis
**kamotionstudio.site** — les fichiers que la page charge en clair. **Aucune licence
n'est documentee.**

→ **A TRANCHER AVANT DE PRODUIRE** : ces fichiers servent de **REFERENCE DE MESURE**
(demonter, comprendre, mesurer). Les utiliser autrement, ou en tirer un livrable,
demande de verifier la licence. ⭐ Le chien montre la voie propre : Fable a **redessine**
depuis les FRAMES, 0 sommet en commun avec l'original. C'est un dessin original inspire
d'une reference, pas une copie — et c'est ce modele qu'il faut reproduire.

⭐ Si on veut une banque de rigs libres : `banques-lottie-et-greffe.md` (⛔ Lottie Simple
License = VIRALE, portfolio only ; Creattie 48 $/an autorise le transfert client).

### La cible : `15_Customs_Officer.json`

Le meilleur banc d'essai, mesure : **19 calques, 17 parentes (89 %), 7 en rotation,
zero precomp imbriquee** — la structure la plus lisible du corpus.
Alternative : `16_Pumpkin_boy` (15 calques, 11 parentes) — plus simple, et son visage
est REDESSINE (4 shapes animees) : utile pour voir comment on fait une expression.

### Le plan, dans cet ordre

1. **DEMONTER la cible** — `planche_calques.py` rend chaque calque SEUL. Repondre :
   ou sont les coupures entre membres ? comment les recouvrements sont-ils dessines
   (le haut du bras se poursuit SOUS le torse, sinon un trou apparait a la rotation) ?
2. **FAIRE DESSINER par Fable**, depuis les FRAMES (jamais depuis le code), avec la
   liste des membres imposee et les recouvrements exiges. ⛔ Lui donner l'interdit du
   `<g>` dans un `<clipPath>` — il l'a respecte sur le chien.
3. **DECLARER le rig** dans le SVG (data-parent / data-pivot), pivots aux articulations.
4. **ANIMER** — 2 poses en ping-pong avec decalage de phase suffisent pour une marche
   (mesure sur le Hiker : 7 cles par membre, periode 24 frames, dephasage de 41 %).
5. **MESURER** : conversion + frames distinctes + sonde dense + REGARDER.

### ⛔ Ce qu'on ne sait pas encore, et qu'il faudra mesurer

- **Les recouvrements.** Sur une tete de face, aucun membre ne passe devant un autre.
  Un corps, si — et c'est une decision d'ILLUSTRATION prise avant l'export. C'est le
  vrai point d'incertitude, pas le rig.
- **Les mains.** Le Hiker a `R-hand-w` et `L-hand-w` comme calques a part entiere.
  ⛔ Notre point faible mesure. Une main FIGEE (le rig n'en demande qu'une version
  sans variantes) est peut-etre a notre portee — a tester, pas a supposer.
- **Le visage expressif.** Pumpkin boy redessine 4 shapes de 2 a 8 sommets. Tres en
  dessous du seuil ou nos modeles echouent. Probablement faisable.

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

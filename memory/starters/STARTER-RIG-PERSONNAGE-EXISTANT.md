# STARTER — RIG DE PERSONNAGE : animer NOTRE dessin, et piloter celui des autres

> Cadre par Aziz le 2026-08-28, ELARGI le 2026-08-29.
> ⭐⭐ **ÉTAT AU SOIR DU 2026-08-29 — les 3 questions de ce starter sont RÉPONDUES** :
> l'animation du chien (chaîne complète), le personnage corps entier (rig piloté), et
> « comment font-ils ? » (rigging par parentage, mesuré).
> ⏭️ **La prochaine question est plus bas, § CE QUI RESTE OUVERT** : notre chien n'a pas
> d'objet de contrôle, et ses plages articulaires ne sont pas mesurées.

---

> 🔗 **La page explicative du sujet** (pochoir · chien anime V1/V2 cote a cote · bilan
> de session · 2 quiz) : https://claude.ai/code/artifact/f43ac206-8fd8-43ae-923a-e605660ef219
> ⭐ Une page par SUJET, enrichie au fil des sessions — la redeployer, pas en creer une autre.

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

## ✅ FAIT LE 2026-08-29 (session parallele) — LE PERSONNAGE CORPS ENTIER

> ⭐⭐ **Cette priorite a ete EXECUTEE le soir meme**, dans une session parallele.
> Code : `src/projects/_client-sim/perso-corps-entier/` (`demonter.py`, `piloter.py`,
> README). Commits `b0ad8ceb` · `d233e716` · `606d82cf` · `d7614230`.

**Ce qui est acquis** : un rig tiers (le douanier, 19 calques) se **pilote** — on lui a
fait faire un geste absent de son fichier d'origine (epaule 23 deg d'origine -> 75 chez
nous), et l'avant-bras suit sans etre touche : la chaine de parentage tient.

⭐⭐ **LA LECON CENTRALE, mesuree** : **un membre a une PLAGE, pas une liberte.** Un
personnage vectoriel est dessine **A PLAT** — la manche est un aplat pose pour un angle
donne ; au-dela, elle sort de sous le torse et se retrouve en travers de l'avant-bras.

| Articulation | Plage sure | Notre 1er essai |
|---|---|---|
| **Epaule** | **~25 deg** | 75 deg — **3x hors plage** |
| **Coude** | **~60 deg** | 45 deg — dans la plage |

⭐ Contre-intuitif : **l'epaule est 2x MOINS tolerante que le coude** — elle doit rester
couverte par le torse, alors que le coude bouge dans le vide. `piloter.py` AVERTIT
desormais quand on sort de l'amplitude : la mesure est dans l'OUTIL, pas dans une note.

⛔ **Un diagnostic faux, corrige** : « la manchette est figee et ne suit plus le bras »
etait FAUX — la manche est le **parent** du bras, elle ne peut pas s'en detacher. Le
defaut etait une AMPLITUDE, pas un debranchement. → **verifier la chaine de parentage
avant de conclure qu'une piece s'est decrochee.**

### ⛔⛔ LE VERDICT DU SOIR — 4 ESSAIS, 4 PIECES IMPREVUES : ON ARRETE LE DOUANIER

Apres le pilotage reussi, 4 tentatives pour faire LEVER le bras, toutes echouees, chacune
exhibant une piece differente :

| Essai | Corrige | Ce qui est apparu |
|---|---|---|
| 1 | l'angle ramene dans la plage | le morceau de manche change de place |
| 2 | le redessin image par image (`ks.a=1` figes) | presque aucun effet |
| 3 | la manche retiree (filtre par couleur) | ⛔ l'EPAULE deshabillee aussi (2 pieces bleues) |
| 4 | — | un aplat de peau FIGE (`tr.p=[0,0]`) colle sur la main |

⭐ **Aziz a lu l'essai 3 par un indice** : l'inscription `ZOLL` du torse, masquee par le bras
leve, etait devenue lisible → j'avais retire une piece innocente.

⛔⛔ **Un echec est un bug ; QUATRE echecs qui exhibent chacun une piece differente sont un
DIAGNOSTIC** : ce fichier est un assemblage optimise pour UNE pose. Il viole notre propre
regle deja payee — `vetement-solidaire-du-corps-jamais-independant`. **On ne se battait pas
contre un defaut, mais contre une methode de fabrication.**

### ⭐⭐⭐ LA MESURE QUI TRANCHE LA VOIE : il n'existe AUCUN standard entre personnages pro

Sur **23 pieces du corpus** (`demonter.py` + comptage rot-animees vs formes-animees) :

| | valeur |
|---|---|
| Reellement **PILOTABLES** (bcp de rotations, <=2 formes redessinees) | **2 sur 23** (Hiker, kiosk) |
| nulls de controle | de **0 a 3** (le Hiker n'en a AUCUN) |
| precomps | de 0 a 6 · formes animees : de **0 a 11** |

⛔ **Consequence** : ce qu'on apprend sur un personnage NE SE TRANSPORTE PAS au suivant.
La brique « placer d'un seul parametre » n'existe meme pas chez le Hiker. **Il n'y a donc
pas de competence cumulable du cote des rigs tiers** → la voie « reutiliser des personnages
pro » est un puits sans fond (+ licence non documentee + on ne choisit pas le personnage).

### ⭐⭐ CE QUI SE TRANSPORTE, LUI : le FORMAT du geste (partitions)

Un geste pro = **une table de nombres**. Nos gestes = **du code** (~70 lignes raisonnees
pour « lever le bras » dans `GestesExpressifs16x9.tsx`) — d'ou « tout reprogrammer a chaque
fois » (plainte d'Aziz, fondee).
→ **`src/projects/_shared/stick-figure-svg/partitions/`** (`poses.ts` + `gestes.ts`) :
SALUER / POINTER / ACQUIESCER en **5 a 7 cles**, rendus et REGARDES. Commit `3ea9e5fa`.
⭐ **Preuve du gain** : ACQUIESCER trop discret → corrige en changeant **UN NOMBRE**
(0,55 → 1,15), zero ligne de logique touchee.
⛔ 2 pieges (typecheck VERT les 2 fois, trouves en REGARDANT) : `headTuck` n'est pas en
degres (`headLen = 12 - tuck*7`, echelle ~±1) · sans `leg*Deg` et `phase=0` les 2 jambes se
superposent (plancher de swing ~16 deg) → pose `base` (`DEBOUT`) sous toutes les cles.

### ⭐⭐⭐ LE CONCOURS DE DESSIN (4 modeles, meme brief, meme image-ref)

⛔ **Le marche parle VECTORIEL** (decision d'Aziz) : les stick figures restent en reserve,
le livrable client est un personnage vectoriel.

**Le brief STRUCTUREL chiffre est ce qui fait la difference** — 11 calques nommes imposes,
**recouvrement >= 15 % de la longueur du membre** (mesure sur la piece pro : 6,1 px pour un
bras de 38,9 px), pivot au sommet, vetement solidaire, zero forme redessinee.
⭐ Cette contrainte de recouvrement **est INVISIBLE sur une image de reference** — un modele
qui dessine depuis une frame ne peut pas la deviner. C'est LA chose a graver dans un brief.

| Modele | Verdict a l'oeil |
|---|---|
| ⭐ **Fable 5** (agent, 3 iterations rendu→regard) | **le seul VRAI personnage** — recouvrement 35 %, tient en rotation a 25/60/90 deg |
| GPT-5.6 Sol | corps coherent, **visage rate** (nez triangulaire sur la bouche), pieds enormes |
| Gemini 3.1 Pro | torse rectangulaire sans epaules, jambes en barres |
| Grok 4.6 | **le pire** : pas de cou, moignons sans mains, **2 pieds fusionnes en un socle** |

⛔ **Grok gagnait la 3D et la typographie** → recoupe `capacite-modele-supposee-verifier-le-
catalogue` : **le classement depend du REGISTRE, jamais du modele seul**.
⚠️ Reserve honnete : Fable a eu **3 iterations rendu→regard**, les 3 autres **1 appel a
l'aveugle**. L'ecart est autant methode que modele. Cout total du concours : ~0,13 $.

### ⏭️ CE QUI RESTE OUVERT (la vraie prochaine question)

0. ⏳ **EN COURS au moment de l'ecriture — la V2 de Fable** : personnage vectoriel neutre,
   **15 calques** (la marche est decidee : `jambe-*-haut`/`-bas`/`pied`), fond clair,
   references du corpus fournies (`out/_r-and-d/perso-corps-entier/ref/` : douanier +
   **Hiker en 2 poses de marche** + Exercise). Fable a lui-meme demande ces references
   (« avec image-ref je reussis, sans j'echoue ») et **REFUSE les degrades** (ils
   casseraient l'aplat franc) — il veut des ombres a 2 niveaux.
   ⭐ **Ses 2 apports techniques, acceptes** : la **PASTILLE DE ROTULE** (cercle couleur
   manche au coude/epaule, dans le calque du membre — bouche le joint a tout angle SANS
   deformer aucune forme) et les **pivots `x,y` anatomiques** au lieu de `data-pivot="haut"`
   (le sommet de la boite est 10-20 px au-dessus du vrai centre articulaire A CAUSE de la
   reserve de recouvrement — d'ou des bras qui s'ecartent au lieu de tourner).
   ⛔ Il avertit : **redecouper pour la marche APRES la V2 aurait coute une refonte** —
   toujours trancher la marche AVANT le design.
1. **Notre chien n'a pas d'OBJET DE CONTROLE.** Les fichiers pro cachent un calque vide
   auquel 13 des 19 calques sont accroches : deplacer, agrandir ou reposer le personnage
   entier = **une seule valeur a changer**. C'est le 1er correctif a lui apporter.
2. **Les plages articulaires de NOTRE chien ne sont pas mesurees.** On connait celles du
   douanier ; les nOtres sont inconnues. Meme methode : balayer et REGARDER, on ne calcule
   pas ce seuil.
3. La regle vaut pour tout personnage a plat, **y compris ceux qu'on dessine nous-memes** —
   a porter dans le brief de dessin, pas seulement dans l'outil d'animation.

### ⛔ D'ABORD : d'ou viennent les fichiers, et ce qu'on a le droit d'en faire

⛔⛔ **Je n'ai AUCUN acces a une bibliotheque de rigs.** Les 22 pieces du corpus sont
sur disque (`out/_r-and-d/corpus-kamotion/`, 3,2 Mo), telechargees le 28/08 depuis
**kamotionstudio.site** — les fichiers que la page charge en clair. **Aucune licence
n'est documentee.**

→ ⭐⭐ **TRANCHE PAR AZIZ LE 2026-08-29 — la ligne est sur le LIVRABLE, pas sur le TEST.**
Un banc d'essai reste dans le workspace : **utiliser la geometrie reelle du corpus y est
legitime et souhaitable**. Ce qui demande une licence verifiee, c'est d'en TIRER UN
LIVRABLE (piece client, portfolio, publication).

⛔ **Ne pas rejouer l'erreur du 29/08** : j'avais transporte la contrainte « 0 sommet en
commun » (qui protegeait le CHIEN, futur livrable potentiel) sur un banc d'essai interne,
ou elle ne protege de rien et coute cher. Pire, elle **cassait le test** : imposer un dessin
original reintroduit l'anatomie — notre point faible mesure (5 modeles sur 5) — au milieu
d'un test qui porte sur le RIG. On aurait mesure un echec de dessin et conclu sur le pilotage.
⭐ Avec la geometrie reelle, la silhouette devient une **constante connue et correcte**, et
la seule variable restante est le pilotage. Si le bras tourne mal, c'est le rig. Sans ambiguite.

⭐ **Seule hygiene exigee** : tout fichier de test qui embarque de la geometrie kamotion le
DECLARE dans son en-tete, pour qu'il ne soit jamais promu en livrable par inadvertance.
(cf. `prouver-une-capacite-nest-pas-produire-un-livrable`.)

⭐ Si on veut une banque de rigs libres : `banques-lottie-et-greffe.md` (⛔ Lottie Simple
License = VIRALE, portfolio only ; Creattie 48 $/an autorise le transfert client).

### La cible : `15_Customs_Officer.json`

Le meilleur banc d'essai, **re-mesure le 29/08 avec `demonter.py`** : **19 calques,
17 parentes (89 %), 7 en rotation, 8 animes au total, zero precomp imbriquee**.
⛔ J'ai d'abord « corrige » ce 7 en 8 — c'etait MOI qui avais tort : 7 calques TOURNENT,
le 8e (`ind=13`) est anime en POSITION seule. Fondre « anime » et « en rotation » en un
seul chiffre est le piege ; le starter d'origine etait juste.

⭐ **Ce que la 1re mesure avait manque** :
- **3 calques VIDES** (`ind` 7, 9, 11 : zero shape). Un rig pro separe **ce qui porte le
  MOUVEMENT** de **ce qui porte le DESSIN**. Notre chien n'a pas cet etage.
- **Un null `ty=3` (`ind=2`) = objet de controle global** : 13 des 19 calques y sont
  parentes, et il porte `s=400 %` + `p=[1284,1000]`. ⭐ **C'est la reponse a « peut-on le
  PLACER dans nos scenes » : oui, en touchant UN SEUL calque.**
- **L'ordre de pile est FIXE**, aucune permutation pendant l'animation : les recouvrements
  sont bien une decision d'ILLUSTRATION prise avant l'export (verifie, plus suppose).
- Le corps (`ind=19`, 435x918) est **un seul calque non anime** : le torse est un socle.
Alternative : `16_Pumpkin_boy` (15 calques, 11 parentes) — plus simple, et son visage
est REDESSINE (4 shapes animees) : utile pour voir comment on fait une expression.

### Le plan, dans cet ordre

> ⭐ **REORDONNE LE 29/08** : on commence par PILOTER le fichier pro lui-meme. C'est la
> question du starter (asset ou outil ?), et elle ne depend d'aucun dessin prealable.

1. ✅ **DEMONTER la cible** — FAIT le 29/08. ⛔ **PAS avec `planche_calques.py`** : il lit
   les sommets `sh` BRUTS et ignore les `tr` des groupes `gr` qui les portent → resultat
   FAUX mais plausible (16 calques sur 19, tous nommes `?`, tous les centres a ~0,0).
   Outil correct : **`src/projects/_client-sim/perso-corps-entier/tools/demonter.py`**
   (geometrie MONDE, parentage resolu, lit aussi les `.lottie` zip).
2. ⭐ **PILOTER LE PRO DIRECTEMENT** — reparenter, deplacer les pivots, lui faire faire un
   AUTRE geste que le sien. C'est le critere asset-vs-outil, mesurable tout de suite.
3. **GREFFER** — sa structure + notre habillage : voir ce qui survit au transfert.
4. **FAIRE DESSINER par Fable** — avec TROIS entrees, pas une : les frames (intention),
   la fiche de structure mesuree (calques, pivots, parentage, recouvrements) **ET la
   geometrie de reference sous les yeux**. C'est le mode « greffe » qui avait donne la
   main credible. ⛔ Lui donner l'interdit du `<g>` dans un `<clipPath>`.
5. **ANIMER** — 2 poses en ping-pong avec decalage de phase suffisent pour une marche
   (mesure sur le Hiker : 7 cles par membre, periode 24 frames, dephasage de 41 %).
6. **MESURER** : conversion + frames distinctes + sonde dense + REGARDER.
   ⛔ Un dessin statique reussi ne dit RIEN de son animabilite (visage du pecheur) : le
   critere n'est pas « beau a la frame 0 » mais « tient en rotation autour de ses pivots ».

### ⛔ Ce qu'on ne sait pas encore, et qu'il faudra mesurer

- **Les recouvrements.** Sur une tete de face, aucun membre ne passe devant un autre.
  Un corps, si — et c'est une decision d'ILLUSTRATION prise avant l'export. C'est le
  vrai point d'incertitude, pas le rig.
- **Les mains.** Le Hiker a `R-hand-w` et `L-hand-w` comme calques a part entiere.
  ⛔ Notre point faible mesure. Une main FIGEE (le rig n'en demande qu'une version
  sans variantes) est peut-etre a notre portee — a tester, pas a supposer.
- **Le visage expressif.** Pumpkin boy redessine 4 shapes de 2 a 8 sommets. Tres en
  dessous du seuil ou nos modeles echouent. Probablement faisable.

## ✅ RÉPONDU — « comment font-ils ? » (question d'Aziz, tranchée le 29/08)

> « Creer un personnage comme on voit souvent dans les Lottie, avec le corps entier.
> D'apres ce que j'ai compris souvent c'est du rigging, ou ce sont des illustrations
> animees par la suite. Je ne sais pas trop comment ils font. »

**La reponse, mesuree sur 5 personnages pro du corpus** : c'est du **rigging par
parentage**, pas de l'illustration redessinee. Le personnage est dessine UNE fois,
decoupe en membres, chaque membre accroche au suivant avec son pivot sur l'articulation.

| | |
|---|---|
| calques avec un `parent` | **84 %** (chaines jusqu'a 4 niveaux) |
| part de l'animation en ROTATION | **90 %** — la geometrie ne change pas |
| cles par membre (cycle de marche) | **7**, deux poses en ping-pong |
| dephasage entre membres | **41 % du cycle** — c'est lui qui casse l'effet marionnette |

⛔ Le seul redessin est le **VISAGE** (expression) : aucune forme animee du corpus ne
depasse **13 sommets**. Personne ne redessine une silhouette.
⭐ Consequence : **le rig ne demande l'anatomie qu'en version FIGEE**, sans variantes.
⛔ Corpus vectoriel a **97 %** ; les 5 personnages corps entier sont a **100 %** vectoriels
— la question « bitmap ou vectoriel ? », ouverte depuis juillet, est tranchee.

⛔ **NE PAS extrapoler depuis le chien** : une face de mascotte est symetrique, frontale et
faite de primitives. Un corps entier a des occultations (un bras passe devant le torse) —
une decision d'ILLUSTRATION prise AVANT l'export, pas un reglage de rig.

## ✅ QUESTION 2 — RÉPONDUE le 2026-08-29 : un rig tiers est un OUTIL, pas un asset

> ⭐⭐ **Le verdict** : on peut le PLACER, l'EFFACER, le RÉ-ANIMER — et lui faire faire un
> geste absent de son fichier d'origine. C'est donc un **outil**, pas un asset figé.
> ⛔ Avec une limite mesurée : **une articulation a une PLAGE** (épaule ~25°, coude ~60°).
> Outils : `src/projects/_client-sim/perso-corps-entier/tools/{demonter,piloter}.py`.
> Le contexte d'origine de la question est conservé ci-dessous.

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
- `planche_calques.py` — rend chaque calque SEUL. ⛔⛔ **INADAPTE aux pieces PRO** : il lit
  les sommets `sh` bruts et ignore les `tr` des groupes `gr`. Reste bon sur NOS scenes
  (un `gr` par calque, pas de `tr` de placement). Pour une piece tierce : `demonter.py`.
- ⭐ **`perso-corps-entier/tools/demonter.py`** — geometrie MONDE (les `tr` de groupe
  accumules + la chaine de parentage resolue), lit `.json` et `.lottie`. Valide contre la
  verite terrain (lottie-web headless) : 6 calques temoins sur 7 au pixel.
- `group_layers.py` — regroupe et nomme (⛔ **groupes CONTIGUS uniquement**)
- `animate_scene.py` — primitives `fondu` `pop` `trace` `geste3` `respire` `balance` `cligne`
- `compare_render.py` — ecart mesure entre 2 rendus
- `test_logo_client.py` — modele de test a 3 volets

⛔⛔ **PIEGE RECURRENT (4 occurrences)** : toujours chercher les `sh` **EN PROFONDEUR**,
jamais a un niveau fixe.
⭐ **4e occurrence, 29/08 — la VARIANTE qui manquait** : trouver les `sh` en profondeur ne
suffit pas, il faut **accumuler les `tr` des `gr` traverses en chemin**. Sur une piece pro
chaque forme vit dans son propre `gr` avec un `tr` qui la PLACE : un calque de 73x93 en
sommets bruts vaut **293x374** une fois les `tr` appliques. Un fichier regroupe a un cran d'imbrication en plus, et une sonde
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

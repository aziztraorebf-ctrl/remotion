# STATUS — chantier REPRO-UI / chaine logo client (branche feat/repro-ui)

> Session du 2026-08-27/28. Worktree isole : `/Users/clawdbot/Workspace/remotion-repro-ui`
> (le repo principal etait occupe par la session Foster — isoler des le depart a evite
> la collision documentee du 26/08).

## ⭐ CE QUI EST ACQUIS — la chaine complete, prouvee de bout en bout

    image PNG du client --Recraft--> SVG --notre convertisseur--> Lottie --Remotion--> MP4
          0,1 %                            0,01 %                        anime

| Etape | Preuve mesuree |
|---|---|
| Image -> vectoriel | 0,1 % (LoadUp) · 0,6 % (lettrage manuscrit) |
| Vectoriel -> Lottie | 0,01 % · 0,00 % ("transportable a l'identique") |
| Logos de marque moderne | **0,00 / 0,00 / 0,35 / 1,22 %** (Spotify, Slack, Airbnb, Stripe) |
| Cas extremes | armoiries 7,03 % · logo artistique 17,43 % |
| Animation | LoadUp anime + 1 revision client, `out/_r-and-d/logo-anim/loadup{,-v2}.mp4` |

## LES 3 DEFAUTS REELS TROUVES ET CORRIGES (tous invisibles dans les rapports)

1. **Feuilles `<style>` non lues** — Illustrator ne met PAS la couleur sur les formes.
   Stripe sortait ENTIEREMENT NOIR, rapport annoncant "transportable a l'identique".
   Armoiries : 70 % de formes noires -> 10 %. ⭐ Illustrator = outil standard des
   designers de logos : ce cas est probablement MAJORITAIRE chez un vrai client.
2. **`<use>` refuses** — sur un blason, le cote droit EST le cote gauche en miroir.
   Il manquait 90 % de la bande droite. Symetrie 1,83 -> 1,00.
3. **Coordonnees de degrade sans la matrice** — le degrade vit dans le repere du
   dessin, pas du calque. 7/8 hors cadre -> 0/8.

⛔⛔ **LES TROIS ONT ETE ATTRAPES EN REGARDANT L'IMAGE, JAMAIS PAR UN CHIFFRE.**
Le convertisseur annoncait "transportable a l'identique" dans les 3 cas.

## OUTILS ECRITS

| Outil | Ce qu'il fait | Etat |
|---|---|---|
| `scripts/tools/test-pause.py` | l'info reste-t-elle si on met en pause ? | branche au hook, signalement |
| `scripts/tools/test-coupe.py` | les raccords sont-ils perceptibles ? | branche, 7/7 coupes retrouvees |
| `scripts/tools/test-groupement.py` | composition par loi de proximite | ⚠️ aide a l'oeil, PAS un juge |
| `.../lottie-ui/tools/planche_calques.py` | rend chaque calque SEUL pour le nommer | valide 8/8 |

## ✅ RECONCILIATION FAITE (2026-08-28) — tout est sur master

La branche `feat/repro-ui` et son worktree sont **fermes**. Foster aussi. Une seule
branche vit desormais : `master`.

⚠️ Ce n'etait PAS un simple merge — la simulation a montre 5 conflits et **master etait
PLUS AVANCE** sur l'atelier Lottie (`svg2lottie_scene.py` : 1061 lignes contre 870).
L'autre session l'avait fait evoluer pendant que je travaillais sur une copie ancienne.
Un merge direct aurait ecrase 191 lignes de son travail.

**Decoupe en 3 temps, chacun verifie :**
1. **12 fichiers sans conflit** reportes tels quels (les 3 outils de mesure, la fiche,
   l'animation, les notes). Verifies sur master : les 4 outils repondent, `test-pause.py`
   tourne sur un livrable Foster reel.
2. **L'atelier Lottie** : mes 3 correctifs REPORTES sur la version de master (pas l'inverse),
   par un agent dedie. Master avait deja 70 % du travail sur les degrades — j'avais
   surestime ce qui manquait. Chiffres re-mesures par moi-meme apres coup :
   Stripe 44,11 % -> **1,22 %** · armoiries 46,34 % -> **7,03 %** · Inkscape 37,70 % -> **17,19 %**.
   `test_rendu.py` vert sur 7 cas.
3. **Le hook et `Root.tsx`** : GREFFES sur la version de master, jamais ecrases — master
   avait 38 lignes que je n'avais pas (declencheurs `FICHE-MOCKUP-3D` et `FICHE-BRIEF-CLIENT`,
   4 motifs 3D). Sans ce report, la fiche du geste ne se serait JAMAIS declenchee et
   l'animation n'etait pas rendable : le travail serait reste inerte.

⭐ **LECON** : quand deux branches ont touche les memes fichiers, ne jamais merger sans
simuler (`git merge --no-commit --no-ff` puis `--abort`). Ici la simulation a evite
d'ecraser du travail, et a revele que **master etait le plus riche des deux cotes**.
⛔ Corollaire : mes conclusions tirees depuis le worktree etaient faussees (j'ai ecrit que
l'atelier n'etait "sur aucune branche mergee" — il etait sur master avec 19 fichiers).
**Ne jamais conclure a une absence depuis un worktree : verifier `git ls-tree master`.**

## ⛔ CE QUI RESTE — par ordre de valeur

1. **⭐ L'OUTIL CREATOR** (jamais teste) : envoyer nos `.json` dans LottieFiles Creator et
   verifier qu'ils s'ouvrent, se deplient, s'animent. C'est la validation que le CLIENT fera.
   ⛔ Gotcha connu : port 3847 UNIQUE, la 2e session Claude echoue EN SILENCE.
   -> `memory/tools/lottie-creator-mcp.md`
2. **Le nommage automatique** : `planche_calques.py` produit la matiere, le nommage reste
   manuel. Recraft sort 59 formes anonymes. Chainer avec `group_layers.py`.
3. **Les 13 degrades a `gradientTransform`** : retombent sur la couleur moyenne.
4. **Les filtres (ombre/flou)** : limite du FORMAT Lottie, pas de l'outil. A contourner.
5. **La fiche injectee "geste anime"** — voir ci-dessous, c'est le plus rentable.

## ⚠️⚠️ LECON DE FIN DE SESSION — POURQUOI L'ANIMATION ETAIT BONNE

Aziz a demande si les bons choix (ecrasement a l'impact, timing asymetrique, decalage des
elements secondaires) venaient des skills de design analyses la veille.
**VERIFIE : NON.** Aucun skill installe, la grille etendue JAMAIS ECRITE (0 mention
d'anti-slop dedans), la fiche injectee ce jour-la etait UI-PRODUIT, sans rapport.

⭐ Ces choix venaient des **4 rapports d'agents encore presents dans le contexte de la
session** : timing asymetrique, anticipation/follow-through, `cubic-bezier(0.23, 1, 0.32, 1)`.
⛔ **DANS UNE SESSION NEUVE, TOUT CELA EST PERDU** — je recoderai au juge.
=> C'est l'argument le plus concret pour ecrire la fiche `FICHE-GESTE-ANIME` : le savoir
a paye UNE fois, par accident de contexte, et il se perd a la fermeture.

## MATIERE SUR DISQUE (hors git, ne pas perdre)

- `public/_client-sim/_references/vendeur-ui/` — 55 Mo : 6 videos du gig Fiverr + page vendeur.
  ⚠️ **Analysees, jamais reproduites.** v3 (logo Cravvy) est mesuree image par image
  dans BRIEF-MESURE.md : 4 cycles de 2,13 s, expansion DEPUIS LE CENTRE, fondu de bouclage.
- `public/_client-sim/_references/logos-fiverr/` — 8 logos de VRAIS clients, 6 familles.
  Seuls 2 sur 8 ont ete traites (LoadUp, Yoga). **6 restent.**

## LA PROCHAINE SESSION (ordre propose)

1. **Creator** — y envoyer `rc-loadup.json` et `rc-yoga.json`. Repond a "le client peut-il
   ouvrir et modifier ce qu'on livre ?". Rien ne sert d'optimiser avant de savoir ca.
2. **Animer 1-2 logos de plus** parmi les 6 restants, en visant un registre different
   (mascotte, embleme classique) pour eprouver la generalite du geste.
3. **Ecrire `FICHE-GESTE-ANIME`** avec ce qui a paye ce soir : les 3 courbes exactes, le
   stagger 30-80 ms, jamais `scale(0)`, timing asymetrique, un seul point focal.
   ⚠️ Budget contexte : les 10 fiches pesent deja 93 Ko. Mesurer avant d'ajouter.

## ⛔ DECISION DE MARCHE (Aziz, fin de session)

**Ne PAS se lancer dans l'arene des logos animes.** Vendeur pakistanais vu a 60 $ pour du
logo anime multi-secondes en offre avancee. Marche de volume, produit standardise, on ne
gagne pas sur le prix — et notre avantage (revision instantanee) est INVISIBLE avant l'achat.
⭐ Ce qu'on a bati n'est pas une offre de logos, c'est **une CHAINE** qui sert les piliers
ou on est reellement differencies (UI produit, donnee animee, scene explicative).
Le logo etait le cas de test le plus simple pour l'eprouver.

**Formulation retenue pour le "pas de 3D"** (ne PAS l'ecrire comme un manque) :
> "Animations vectorielles livrees en Lottie ou MP4 — legeres, modifiables, pretes pour le
> web et les apps. Pas d'effets 3D lourds : si votre projet en demande, je vous le dirai
> avant de commencer plutot qu'apres."
⚠️ Nuance exacte : on SAIT faire de la 3D (ThreeCanvas, plan Foster). Ce qu'on ne fait pas,
c'est de la 3D EN LOTTIE — la frontiere est le FORMAT, pas notre capacite.

---

# SESSION 2026-08-28 (suite) — LE TEST CREATOR

## ✅ CE QUI EST ETABLI (mesure, pas rapport)

| Question | Reponse |
|---|---|
| Le pont MCP fonctionne ? | **OUI** — `read_scene` repond. Port 3847 libre, 1 seul processus : **pas de collision** |
| Le SVG s'importe ? | **OUI**, inline (`import_asset` asset_type=SVG, contenu colle) |
| ...en gardant la structure ? | ⛔ **NON — 1 SEUL CALQUE.** Le SVG inline est APLATI. La structure editable est perdue |
| Le Lottie s'importe par URL ? | **OUI pour une URL PUBLIQUE.** ⛔ `127.0.0.1` et `localhost` sont REFUSES (« Invalid URL ») |

⭐⭐ **LE SVG INLINE N'EST PAS UNE VOIE DE LIVRAISON** : il arrive en 1 calque unique. C'est
exactement ce que notre Lottie, lui, porte (15 calques pour LoadUp). L'interet de notre chaine
est donc CONFIRME PAR LA NEGATIVE — la voie facile perd ce qu'on sait preserver.

## ⛔⛔ DECOUVERTE QUI CHANGE LA LECTURE DU CHANTIER

**Nos 2 `.json` ne portent AUCUNE animation.** Mesure : 0 propriete animee, 0 `"a":1`.
`op=60` (2 s) n'est que la duree par defaut.
=> Ce sont des **logos VECTORISES PORTES en Lottie**, PAS des logos animes. L'animation de
LoadUp vit dans **Remotion** (`LoadUpAnime.tsx`), pas dans le fichier livre.

⭐ Consequence : le test Creator repond a « le client peut-il **OUVRIR et EDITER** ? »
Il ne repond PAS a « l'animation **survit-elle** au transport ? » — 2e question, distincte,
qui exige un `.json` portant reellement des cles. **Ne pas confondre les deux.**

## PALETTES RELEVEES (verite terrain, avant tout jugement sur Creator)

- `rc-loadup.json` : 15 remplissages, 4 couleurs — #FFFFFF x7 (fond opaque) · #414343 x4
  (lettrage) · #6E6F72 x2 (symbole R) · **#7DC145 x2 (le vert de la fleche)**
- `rc-yoga.json` : 59 remplissages, 3 couleurs — #000000 x39 · #FEFEFE x19 · #3D3A3F x1

⚠️ **PIEGE DE MESURE EVITE** : j'ai d'abord compte 0 `"ty":"fl"` et failli conclure « logo sans
couleur » (= le defaut « tout noir » deja paye). **FAUX** : le JSON est ecrit espace
(`"ty": "fl"`), mon motif etait compact. **Compter sur le JSON PARSE, jamais sur la chaine brute.**

## GOTCHA CREATOR — l'import CREE une scene et BASCULE l'active

Un `read_scene` a soudain renvoye une scene « hi » 800x800 / 14 calques inconnue → cru a un
ecrasement du travail d'Aziz. **RIEN N'ETAIT ECRASE** : `list_scenes` a montre 3 scenes
coexistantes, dont une **« file » 964x518 creee AUTOMATIQUEMENT par l'import du SVG** (aux
dimensions exactes de l'asset). L'erreur « Layer not found » venait de la meme cause : je
cherchais le calque dans la mauvaise scene.
⭐⭐ **REGLE : toujours `list_scenes` AVANT toute ecriture** — `read_scene` seul ne dit pas
DANS QUELLE scene on se trouve. Ne jamais conclure a un ecrasement sans avoir liste les scenes.

## VERCEL BLOB ETAIT SATURE (1,02 Go / 1 Go) — debloque

Cause du blocage d'upload : quota, **pas** un probleme de compte (`Storage quota exceeded for
Hobby plan`). Decision d'Aziz : Blob = lieu de DEPOT pour partager, pas une archive ; vider.
**355 Mo liberes** (gazoduc-acte3*, review/, client-sim/, rnd/, foster/, lottie/, etc.).
⭐ `verrou-FINAL-AUDIO.mp4` (seul FINAL sans copie locale) **RAPATRIE AVANT SUPPRESSION** dans
`out/episodes/gazoduc-aagp-tsgp/versions/` — taille verifiee a l'octet pres.

⛔⛔ **VERIFIER PAR LA TAILLE, PAS PAR LE NOM** : sur 80 « doublons » par nom, **3 avaient un
CONTENU DIFFERENT** (2x `maison-gaz-facture.json`, `DEMO-FINALE.mp4`). Un menage sur le seul nom
les aurait detruits. Meme nom != meme fichier.

⚠️ Menage INCOMPLET : 179 fichiers / 643 Mo restent a la racine du Blob. Le garde-fou de securite
bloque les suppressions trop larges (prefixes d'1 lettre, ou 10 prefixes d'un coup) — **c'est
sain, ne pas chercher a le contourner**. Supprimer par prefixe explicite, en petits lots.
Pas bloquant : la place liberee suffit tres largement.

## ✅✅ RESULTAT — LE TEST CREATOR EST PASSE (2026-08-28)

`rc-loadup.json` importe dans LottieFiles Creator par URL publique (Vercel Blob).

| Critere | Attendu | **Obtenu** |
|---|---|---|
| Le fichier s'ouvre | sans erreur | **OUI** |
| Il se DEPLIE | 15 calques | **15 calques** — `path-1` a `path-15` |
| Les formes sont a leur place | geometrie du logo | **OUI, verifie calque par calque** |
| Les calques sont manipulables | editables | **OUI** |
| Il s'ANIME apres edition | cles acceptees | **OUI — 4 cles relues, geste en 3 temps** |

⭐⭐ **CREATOR CREE UNE SCENE-COMPOSANT** a l'import : une scene `recraft-loadup` 2048x1100
(= dimensions exactes du fichier), `is_nestable: true`, contenant les 15 calques. La scene
d'accueil ne porte qu'UN calque de REFERENCE vers ce composant. ⛔ **Ne pas lire ce calque
unique comme un aplatissement** — c'est l'erreur que j'ai failli commettre : il faut
`switch_scene` vers le composant pour voir la structure.

**Verification faite par la GEOMETRIE, pas par le compte** (un compte de 15 ne prouve rien) :
chaque calque tombe a la position attendue, croisee avec le PNG rendu depuis le SVG source —
`path-1` fond plein cadre 2048x1100 · `path-2` la fleche verte (174x220, en haut a droite du
centre) · `path-11` le « L » (le plus a gauche) · `path-13/14/15` le symbole ® (9 a 33 px,
extreme droite). ⭐ **C'est la concordance geometrique qui valide, pas le code de retour.**

**Le geste ecrit pour eprouver l'edition** (fiche GESTE-ANIME appliquee) : la fleche verte —
le seul element qui porte le sens (« LoadUp » = ce qui monte) — en 3 temps, `y` 0 -> -70
(f0-18, `gentle-out`) -> SUSPENSION 8 frames (f18-26) -> chute (f26-34, bezier accelere).
Relu depuis Creator : les 4 cles sont bien la. **Montee 18 f / chute 8 f = ratio 0,44**,
identique a celui mesure sur LoadUp dans Remotion.

## ⛔ CE QUE CE TEST NE DIT PAS (ne pas sur-conclure)

1. **Il ne teste PAS la survie d'une animation existante** — nos `.json` n'en portent aucune.
   J'ai ANIME DANS Creator, je n'ai pas verifie qu'une animation FAITE CHEZ NOUS y arrive intacte.
   ⭐ C'est LA question suivante, et elle exige un `.json` portant deja des cles.
2. **Les couleurs n'ont pas pu etre relues par l'API** (`fill_color` / `fill_opacity` :
   « property not on layer » sur un calque importe). La palette est verifiee cote FICHIER
   (4 couleurs, dont le vert #7DC145) mais **pas relue depuis Creator**. A confirmer a l'oeil.
3. **`visual_bounds` ne se rafraichit pas** apres une cle de `scale` unique : les bornes restent
   calculees sur l'ancienne echelle et `center_layer` renvoie `target_reached: false` alors que
   la valeur EST ecrite (relue a 42). ⛔ Artefact de lecture — ne pas re-doser a l'aveugle dessus.

## ⏭️ SUITE

1. **Animer 1-2 des 6 logos restants** (`public/_client-sim/_references/logos-fiverr/` : L1 Hinch,
   L3/L4 Kanvas, L5 Tigerwild, L7 renard veterinaire, L8 Fokus) en visant un registre DIFFERENT
   de LoadUp — mascotte ou embleme — pour eprouver si le geste se generalise.
2. **Tester le transport d'une animation REELLE** : produire un `.json` qui porte des cles
   (depuis Remotion via l'atelier) et verifier qu'elles arrivent dans Creator. C'est la moitie
   manquante de la question « source files ».
3. Le nommage des calques reste a ZERO (`path-1..15`) — la clause « source files for easy future
   edits » n'est PAS tenue tant que les calques sont anonymes. Chainer `planche_calques.py`
   (produit la matiere a voir) avec `group_layers.py` (applique la carte).

## URL / IDS UTILES

- Lottie en ligne : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rc-loadup-Euko0pMRrsJL3xfJLXZTnWJ1wt3gls.json`
- Verite terrain rendue (rsvg-convert depuis les SVG) : `<scratchpad>/creator-test/verite-{loadup,yoga}.png`
- ⛔ `import_asset` LOTTIE exige une URL **PUBLIQUE** : `127.0.0.1` et `localhost` sont refuses
  (« Invalid URL »). Passer par `scripts/tools/upload-to-blob.py`.

---

# ✅✅ LOADUP EST COMPLET (2026-08-28) — les 2 manques sont fermes

Decision d'Aziz : finir CE logo a 100 % avant d'en attaquer un autre. Prouver la
chaine de bout en bout sur un cas vaut mieux que six cas a moitie faits.
⭐ Ordre impose : **NOMMER d'abord, ANIMER ensuite** — nommer apres coup obligerait
a re-verifier que le renommage n'a pas casse les cles.

## 1. NOMMAGE — 15 calques anonymes -> 8 groupes lisibles

`fond · lettre-l · lettre-o · lettre-a · lettre-d · lettre-p · fleche-up · marque-deposee`

Carte etablie en **REGARDANT** la planche de `planche_calques.py` (15 vignettes,
chaque calque rendu seul). Le chainage manquant etait bien la : l'outil produit la
matiere, l'humain regarde, la carte alimente `group_layers.py`.

⛔⛔ **LE BUG QUE LE CHIFFRE N'A PAS VU** — ma 1re carte a sorti le « o » en
**DISQUE PLEIN**. Cause : `path-8` est **la contre-forme du o**, pas « la tige du d »
comme je l'avais lu sur la planche ; rangee dans `lettre-d`, elle etait peinte au
mauvais moment et bouchait le trou. `compare_render.py` annoncait **0,14 %** — un
chiffre qui PASSE POUR BON. **C'est l'image qui l'a montre.** Apres correction : 0,01 %.

⭐ **La regle est sortie de la MESURE des bbox, pas d'une intuition** : chaque lettre
pleine est suivie de **sa contre-forme blanche aux memes coordonnees** (o 767/773 ·
a 893/892 · d 1026/1020 · p 1289/1298). Au passage : `path-3` est **VERT**, c'est le
« p » de Up, pas une lettre anthracite.

⚠️ **`motifs` matche par SOUS-CHAINE, `noms` par egalite EXACTE.** Avec `motifs`,
« path-1 » happe path-11..path-15. Mes ancres regex `^path-1$` n'auraient JAMAIS
matche (aucun calque ne s'appelle litteralement ainsi) : le script aurait tourne
**sans erreur** en produisant des groupes vides. Verifier COMMENT un motif est
interprete avant de l'ecrire.

## 2. ANIMATION — elle SURVIT au transport (la question restee ouverte)

Nouvelle primitive **`geste3`** dans `animate_scene.py` : les 3 existantes
(trace/fondu/pop) ne couvraient pas le geste en 3 temps. Elle pose position +
ecrasement — monte haut -> SUSPEND -> retombe. Valeurs **reprises** de
`LoadUpAnime.tsx`, jamais re-inventees.

⛔ Gotcha respecte : un calque converti a ancre ET position a **[0,0]** (la geometrie
porte ses coordonnees absolues). Sans recentrage, l'ecrasement partirait du coin de
l'ecran — meme famille que « la flamme ne s'anime pas » (25/08).

**RELU DEPUIS CREATOR apres import — identique a Remotion :**

| | Remotion | Creator |
|---|---|---|
| Cles de position | 4 (f12/30/38/46) | **4, memes frames** |
| Suspension | 8 frames a y=-95 | **8 frames a y=-95** |
| Ratio chute/montee | 0,44 | **0,44** |
| Calques animes | — | **7 animes, fond FIXE** |

⭐ La **suspension** — le coeur du geste, celle sans quoi il ne raconte rien — a
traverse la chaine intacte. Les 6 lettres sont des groupes SEPARES (editable) mais
recoivent LE MEME timing : dans Remotion elles forment un seul `<g>` expres, les
faire cascader volerait l'attention a la fleche (point focal unique).

⚠️⚠️ **FAUX POSITIF CREATOR : « 7 of 8 layers are hidden ».** Il lit la scene a la
**frame 0**, ou 7 calques sont volontairement a opacite 0 — c'est le DEBUT de
l'animation. **Un outil qui juge une scene animee sur sa 1re image la declare vide.**
Ne pas corriger ce qui n'est pas casse.

## 3. GARDE-FOU — `test_logo_client.py`, 3 volets

nommage (8 groupes, 15 calques, chaque contre-forme avec sa lettre) · fidelite
(ecart <= 0,05 %) · geste (4 cles, suspension, asymetrie, fond fixe).

⭐⭐ **VERIFIE CAPABLE D'ECHOUER** : en reintroduisant le bug du « o », 2 volets sur 3
le rattrapent (nommage le NOMME, fidelite remonte a 0,14 %) ; tout repasse au vert
apres restauration. Un test qui ne peut pas echouer ne protege rien.

⛔ **PIEGE DE SONDE paye au passage** : `len(couche["shapes"])` renvoie **1** pour un
groupe qui contient 2 chemins — `group_layers.py` imbrique tout dans un groupe par
calque. Ma 1re version du test criait « contre-forme separee » sur un fichier
PARFAIT. **C'etait la SONDE qui regardait au mauvais niveau.** Compter les `sh` en
profondeur. -> recoupe le feedback « la mesure est biaisee par la FACON de mesurer ».

## Livrables

`public/_client-sim/logos/rc-loadup-nomme.json` (8 groupes, statique) ·
`rc-loadup-ANIME.json` (13,2 Ko, 150 f @ 30 fps). Commit `8c658a39`.
⭐ **Couleurs validees par Aziz a l'oeil dans Creator** : fleche verte, ® noir,
aucun changement — la reserve « palette non relue depuis Creator » est LEVEE.

## ⏭️ SUITE

1. **Animer 1-2 des 6 logos restants** (`_references/logos-fiverr/` : L1 Hinch,
   L3/L4 Kanvas, L5 Tigerwild, L7 renard veterinaire, L8 Fokus) en visant un registre
   DIFFERENT — mascotte ou embleme — pour eprouver si le geste se generalise.
   ⭐ Vraie question : **la carte de nommage se deduit-elle sur un dessin non-textuel ?**
   Sur LoadUp les calques sont des LETTRES, cas facile. Une mascotte n'a pas ce secours.
2. Le nommage reste **MANUEL** (je regarde la planche, j'ecris la carte). Le chainage
   planche -> carte n'est toujours pas automatise — mais il est desormais PROUVE.
3. Les 13 degrades a `gradientTransform` et les filtres : intacts, non traites.

---

# ✅ L'ALLER-RETOUR CREATOR EST FIDELE (2026-08-28, teste par Aziz)

⭐ **Aziz a eu raison d'insister pour TESTER** : j'avais recommande de ne pas depenser
un export en disant « il n'y a pas de raison que ca differe » — c'etait une SUPPOSITION,
et je l'avais moi-meme signalee comme non prouvee. Un export brule, la question est reglee.

`rc-loadup-ANIME.json` importe dans Creator, puis **reexporte en Lottie JSON** :

| | Notre fichier | Retour de Creator |
|---|---|---|
| Dimensions / fps / duree | 2048x1100 · 30 · 150 f | **identiques** |
| Noms des calques | 8 | **8, memes noms, meme ordre** |
| Geste fleche | 4 cles, suspension 8 f | **4 cles, suspension 8 f** |
| Ratio chute/montee | 0,44 | **0,44** |
| Poids | 13,2 Ko | 44,9 Ko |

**RIEN n'est perdu, RIEN n'est gagne.** Les 44,9 Ko contre 13,2 ne sont PAS du contenu en
plus : Creator reecrit le JSON en clair avec tous les champs par defaut explicites (le
notre est ecrit compact). Seul ajout reel : `meta.g = "@lottiefiles/toolkit-js 0.76.1"`.
Seule difference de contenu : une cle d'opacite REDONDANTE supprimee sur 4 lettres
(0,0,25 -> 0,25 — deux cles a la meme valeur au meme endroit). Nettoyage, pas perte.

=> **NE PAS depenser d'export pour livrer** : le fichier local est equivalent et 3,4x plus
leger. ⛔ **Les 293 $/an ne se justifient pas** : ils achetent l'« Optimized JSON » (44,48 Ko
sur leur propre exemple) alors que NOTRE fichier brut fait deja 13,2 Ko.
⚠️ Seul cas ou l'export sert : si on MODIFIE dans Creator et qu'on veut recuperer la modif.
Regle retenue : demander la modif a Claude (portee dans le code), le fichier local reste
la source unique.

## ⭐⭐ LA REFERENCE « MAISON » DE LOTTIEFILES EST EN BITMAP — pas en vectoriel

Fichier de comparaison exporte par Aziz (scene d'exemple fournie par Creator, personnage
« HELLO! », 115 Ko, 14 s). Mesure :

| | Leur reference | Le notre |
|---|---|---|
| Nature | **14 images BITMAP** (`ty=2`, PNG base64) | **15 chemins VECTORIELS** (`ty=4`) |
| Chemins / aplats / degrades | **0 / 0 / 0** | 15 / 15 / 0 |
| Redimensionnable | non (pixellise) | **oui, a l'infini** |
| Recolorable | non (refaire les PNG) | **oui, une valeur** |
| Poids | 115 Ko | **13 Ko** |

⭐⭐ **C'EST EXACTEMENT L'ECART DEJA MESURE FACE AU VENDEUR FIVERR** (qui convertit un MP4).
Ici c'est LottieFiles eux-memes qui emballent du pixel dans du Lottie. Ce n'est pas « mal
fait » — pour un personnage illustre complexe c'est legitime et rapide — mais **ce n'est
pas ce qu'on livre**, et notre sortie est structurellement superieure sur les 3 criteres
qui comptent pour un client : poids, redimensionnement, recoloration.
⛔ Ne PAS en conclure « on fait mieux qu'eux » en general : c'est UN fichier d'exemple,
pas leur production de reference. Ce qui est etabli, c'est que **bitmap-dans-Lottie est un
usage courant, y compris chez eux** — donc notre vectoriel est un argument de vente reel.

⚠️ **Gotcha export** : Creator a exporte la scene ACTIVE, pas celle affichee dans la fenetre
de telechargement. Le fichier contenait la scene de la session precedente ; le personnage
vivait dans un **precomp** (`assets[]`), pas dans `layers[]`. **Toujours regarder `assets`
avant de conclure qu'un Lottie est vide.**

## LISIBILITE DU LIVRABLE (question d'Aziz : « un dev peut-il lire ca ? »)

**OUI.** Ce qui le rend illisible dans VS Code, c'est qu'il est sur **UNE SEULE LIGNE**
(ecriture compacte pour le poids) — pas sa nature. `Format Document` (Maj+Alt+F) et tout
devient clair : `"nm"` = nom, `"ks"."p"` = position, `"a":1` = animee, `"t"` = frame,
`"s"` = valeur, `"o"`/`"i"` = courbes (on y relit notre 0.23/0.32).
3 arguments a donner a un client inquiet : (1) format PUBLIC documente (Airbnb -> LottieFiles),
(2) personne ne le lit a la main — il s'ouvre dans Creator / After Effects, (3) **la preuve
est faite** : Creator l'a lu, joue et reexporte a l'identique. Un fichier non standard
n'aurait pas survecu a ce parcours.

## LES FORMATS DE SORTIE — verifie sur la machine

Creator propose Lottie/dotLottie/SVG anime/GIF/MP4/MOV. ⭐ **Constat commercial d'Aziz** :
ce sont des SORTIES DU MEME FICHIER, pas des travaux differents — le vendeur en liste 5
pour elargir sa clientele a cout marginal quasi nul. Lecon d'OFFRE, pas de technique.

| Format | Chez nous ? | Par quoi |
|---|---|---|
| Lottie `.json` | ✅ natif | notre chaine |
| MP4 | ✅ | `libx264` present |
| MOV transparent | ✅ | `prores_ks` + `qtrle` presents |
| GIF | ✅ | encodeur `gif` present |
| dotLottie | ⚠️ a ecrire (c'est un ZIP du json) | trivial |
| SVG anime | ⚠️ a ecrire | on a le SVG + le timing |
| WebP anime | ⛔ **NON** | `libwebp` ABSENT de ffmpeg |

⛔ Precision : le **GIF n'est pas « fige »** (il bouge) — ce qu'il perd c'est la palette
(256 couleurs) et le poids. Le vrai clivage est **vecteur vs pixel** : MP4/GIF/MOV sont du
pixel, donc plus editables ni redimensionnables.

---

# QUESTION D'AZIZ : les personnages Lottie, a notre portee ? (2026-08-28)

## Ce qu'est leur personnage : 13 PNG assembles, pas du vectoriel

Vectoriel = une RECETTE (« cercle rayon 40, vert »), redessinee a la demande -> agrandir
ne perd rien, recolorer = 1 valeur. Bitmap = une GRILLE DE PIXELS -> agrandir pixellise,
recolorer = refaire l'image. Leur « HELLO! » : 13 calques `ty=2` (PNG base64), animes en
**rotation + echelle** — c'est du **RIGGING** (on fait tourner des morceaux decoupes), pas
de la deformation de forme.

⛔⛔ **CORRECTION D'UNE AFFIRMATION TROP RAPIDE (la mienne)** : j'ai ecrit « bitmap-dans-Lottie
est un usage courant » en me basant sur **UN SEUL fichier**. C'est une ANECDOTE, pas une
mesure. ⭐ Ce qui reste vrai : la plupart des Lottie pro SONT vectoriels (c'est l'interet du
format) ; le bitmap est un raccourci quand l'illustration est trop complexe a vectoriser.
⭐ **CE QU'ON NE SAIT PAS** : la proportion reelle bitmap vs vectoriel sur les Lottie a
personnages. **Mesurable** (compter les `ty=2` vs `ty=4` sur un echantillon de Lottie
publics), pas mesure. Ne pas repondre a cette question de memoire.

## Le flux standard du metier

illustration (Illustrator/Figma) -> decoupee en calques (bras, tete, corps) -> **After
Effects : le RIGGING** (relier les membres, poser les pivots) -> plugin Bodymovin -> .json.
⭐ **Le travail n'est pas le dessin, c'est le rigging** — decider que l'avant-bras pivote au
coude, que la bulle arrive apres le geste. C'est un metier : l'animation de personnage.

## RECRAFT — verifie dans le MCP, pas de memoire

- `vectorize_image` : image -> SVG (ce qu'on a fait sur LoadUp)
- `generate_image` + `style: "vector_illustration"` : **genere DIRECTEMENT en vectoriel**
  (sous-styles `cartoon`, `kawaii`, `flat_2`, `roundish_flat`...)

⭐ Voie MEILLEURE que la leur : on peut generer un perso **vectoriel des le depart**, la ou
LottieFiles a decoupe des PNG. ⛔ MAIS Recraft sort un SVG **d'un seul tenant**, pas un
personnage decoupe en membres articules : il faudrait ensuite separer bras/tete/corps et
poser les pivots. **C'est exactement le rigging — et c'est la qu'est le metier.**

## VERDICT : faisable, DECONSEILLE comme offre, recommande en appoint

| Usage | Verdict |
|---|---|
| Perso-HEROS, gags, expressions | ⛔ **NON** — metier different, zero differenciation |
| Perso FIGURANT dans une scene explicative | ✅ OUI — `stick-figure-svg` / `personnage-vivant-svg` existent |
| Client fournit son perso, on l'anime | ✅ OUI — c'est LoadUp, en plus complexe |

⭐⭐ **RAISON DE FOND** : notre avantage est le **DETERMINISME** (une carte exacte, une donnee
juste, un geste reproductible). **Un personnage qui salue n'a AUCUNE verite a respecter** —
dix animateurs le font dix facons, toutes acceptables. On y perd ce qui nous distingue.
⭐ Coherent avec le tri deja fait par Aziz dans `FICHE-BRIEF-CLIENT` : « personnages articules
(rigging, poses, expressions) = ⛔ Nul, un metier different ». Decision prise sur des briefs
REELS, pas sur une intuition — cette analyse la confirme, elle ne la revise pas.

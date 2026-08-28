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

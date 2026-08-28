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

## ⛔⛔ ACTION 0 DE LA PROCHAINE SESSION — RECONCILIER CE WORKTREE

`feat/repro-ui` est a **124 commits de retard sur master** (Foster a ete fusionnee et fermee le
2026-08-28). Consequences MESUREES, pas supposees :
- **6 fiches amputees ici** et **2 absentes** (`FICHE-BRIEF-CLIENT` 13 Ko, `FICHE-MOCKUP-3D` 15 Ko).
  `FICHE-UI-PRODUIT` : 7765 o ici contre 13147 sur master (**-41 %**) — et c'est celle qui s'est
  injectee pendant la session. On a code avec une fiche amputee sans le voir.
- Le hook la rattrape desormais (regle "la plus RICHE gagne", commit 5796f8ef) mais **ne repare rien**.
- `check-links.py` et `check-fiches.py` produisent des FAUX POSITIFS depuis ce worktree
  (8 et 7 chemins "morts" qui existent tous sur master). ⛔ Ne jamais conclure a une absence
  depuis un worktree — verifier `git ls-tree master` d'abord.

⚠️ **Un rebase entrerait en CONFLIT** (verifie) : `fiche-inject.sh`, `src/Root.tsx` et tout
`lottie-ui/tools/` ont bouge des deux cotes. C'est un chantier a mener au calme, pas en fin de
session. Faire un `git diff master...HEAD` fichier par fichier avant de trancher.

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

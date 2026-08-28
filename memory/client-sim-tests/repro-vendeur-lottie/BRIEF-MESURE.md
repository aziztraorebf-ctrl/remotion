# REPRO VENDEUR LOTTIE — brief mesure

> Source : gig Fiverr "Create a lottie animation for your website or app" (Stanislav B, Level 2,
> Vetted Pro, 20 pieces au portfolio). Videos + captures de la page sur disque :
> `public/_client-sim/_references/vendeur-ui/` (v1-v6.mp4).

## LE MARCHE REEL — sa grille de prix (CAD)

| Palier | Prix | Contenu | Delai | Revisions |
|---|---|---|---|---|
| Simple | 35,85 | icone / bouton / ligne / chargement | 2 j | 2 |
| Advanced | 81,97 | logo / splash screen / UI simple | 2 j | 2 |
| Pro | 158,84 | UI d'app complexe / hero / personnage / illustration | 3 j | 3 |

Express 24 h : +43,72 (simple) / +102,00 (advanced).

⭐⭐ **Il ne facture PAS a la seconde.** Aucune mention de duree nulle part. Les paliers se
distinguent par des CASES A COCHER : include icon / logo / character / landing-hero / interactions.
Le client choisit selon CE QU'IL A, pas selon la duree voulue.

⭐ Il promet "Source files for easy future edits" = notre argument du determinisme, formule
dans les mots du client.

## LES 6 PIECES (toutes verticales 1080x2460)

| # | Contenu | Duree video | Avis client |
|---|---|---|---|
| v1 | borne de recharge + voiture qui se remplit de vert | 10,97 s | il y a 3 semaines |
| v2 | demo SaaS "LiveChatFlow", conversation qui se deroule | 40,31 s | — |
| v3 | logo Cravvy (epingle croquee) + texte cyclique | 10,92 s | il y a 2 mois |
| v4 | logo D20 qui se remplit de biere | 8,69 s | il y a 3 mois |
| v5 | promo app Yuno, telephones 3D + badge App Store | 15,49 s | il y a 3 mois (client RECURRENT) |
| v6 | carte Canada Ouest, provinces + marqueurs | 11,35 s | il y a 4 mois |

⚠️ **Piege ffprobe** : `format=duration` donne la duree du CONTENEUR (= audio), plus longue que
la video sur les 6 fichiers (v1 : 10,97 video vs 12,42 conteneur). Tout seek calcule dessus
echoue silencieusement. Methode fiable : compter les frames puis extraire par NUMERO
(`select=eq(n\,L)` + `-fps_mode passthrough`), jamais par timecode.

## ⭐ L'AVIS CLIENT LE PLUS INSTRUCTIF (v3, Cravvy)

> "We needed a **lottie file** for our website app splash screen. He was able to take a
> **.mp4 video file and turn that into our lottie file**. We needed the animation to fit
> specific requires (logo fades in/out so it can loop, 1 sec animation with full logo so it
> is complete on load, and fun loop...)"

Trois enseignements :
1. Le client demande un **Lottie**, pas une video.
2. Le vendeur **convertit un MP4** -> methode degradee (Lottie lourd, peu editable, souvent
   rasterise). Nous generons le Lottie **depuis le vectoriel** : structurellement meilleur.
3. Le client pose des contraintes de **determinisme** (boucle, logo complet au chargement,
   fondu entree/sortie) — exactement ce que le code gere nativement et qu'un MP4 converti gere mal.

## LE MOUVEMENT DE v3 — mesure image par image (reference a reproduire)

Mesure = proportion de pixels orange dans la bande de texte, 1 frame sur 4 sur 328 frames.

**Structure : 2 s de calme, puis 4 cycles de 2,13 s, puis 1 s de calme + fondu final.**

| Cycle | Debut orange | Plein orange | Retour noir |
|---|---|---|---|
| 1 | 2,26 s | 2,53 -> 3,46 s | 3,73 s |
| 2 | 4,13 s | 4,66 -> 5,46 s | 5,73 s |
| 3 | 6,26 s | 6,66 -> 7,46 s | 7,72 s |
| 4 | 8,39 s | 8,79 -> 9,59 s | 9,99 s |

Periode **2,13 s**, quatre fois. Montee ~0,30 s, maintien ~0,90 s, descente ~0,25 s.

⭐⭐ **CE N'EST PAS UN BALAYAGE GAUCHE->DROITE, NI UNE BASCULE GLOBALE.**
Profil par tiers horizontaux pendant la transition (frames 66-78) :
- f68 : 100 % au centre, 0 ailleurs
- f72 : 89 % centre, 10 % droite
- f74-76 : 19 % gauche / 66 % centre / 15 % droite, puis stable
=> **expansion DEPUIS LE CENTRE vers les bords.** La planche de 12 vignettes suggerait un
balayage mot par mot : FAUX. Sans cette mesure, j'aurais code le mauvais geste.

Le logo lui-meme est quasi STATIQUE (leger tour d'anneau + miettes au tout debut). Le seul
mouvement pendant 8 s des 10, c'est le texte.

## ⛔ CE QUE CE TEST DOIT REELLEMENT MESURER (recadrage d'Aziz, decisif)

Le vendeur **ne dessine pas le logo** : le client le lui envoie. Redessiner l'epingle Cravvy
testerait une etape qui n'existe pas dans le metier.

**La vraie difficulte = prendre un SVG QU'ON N'A PAS ECRIT** (structure d'un designer inconnu :
groupes, clipPath, transformations imbriquees, metadonnees Illustrator) et reussir a
l'animer puis le convertir en Lottie.

⚠️ Risque connu : `scripts/tools/svg2lottie.py` parse le SVG **en regex, sans parseur XML**.
Sur nos fichiers (propres, ecrits par nous) ca passe. Sur un SVG de production, c'est le
point de rupture attendu. Voir aussi la dette securite XXE deja documentee.

**Protocole retenu (decision Aziz)** : 2 SVG externes, un standard puis un retors, pour
trouver le point de rupture chiffre. Le geste de Cravvy sert de reference d'animation.

## ⛔ CE QU'ON NE MESURE PAS : LE TEMPS

Decision d'Aziz. Une session dure 8-14 h dont l'essentiel hors travail (mobile, sommeil) ;
le temps ecoule mesure le canal de communication, pas la production. Le starter demandait
"noter le temps reel" — **remplace** par 4 indicateurs :

1. **Nombre d'aller-retours** avant que ce soit juste
2. **Ce qui a coince** (geste manquant, brique absente, reglage inexistant)
3. **Ce qu'il a fallu contourner**, et a quel cout
4. **Depart de zero ou d'une brique existante ?** <- le plus revelateur : si tout part de
   zero a chaque fois, la stack n'est pas prete.

---

# RESULTAT DU TEST (2026-08-28) — 2 SVG externes passes dans la chaine

Outils : `src/projects/_client-sim/lottie-ui/tools/svg2lottie_scene.py`
⚠️ Le chemin `scripts/tools/svg2lottie.py` cite en memoire N'EXISTE PAS : le vrai atelier est
`src/projects/_client-sim/lottie-ui/tools/`.

⛔⛔ **CORRECTION (wrap 2026-08-28) — J'AI ECRIT ICI UNE AFFIRMATION FAUSSE.** J'avais conclu que
cet atelier n'etait "sur aucune branche mergee dans master" et invoque le feedback
[[registre-canonique-branche-rnd-jamais-mergee]]. **C'est FAUX** : `git ls-tree master` retourne
**19 fichiers**, master en a MEME PLUS que ce worktree (16). Le compte de "12 outils" etait faux aussi.
**Cause de l'erreur** : j'ai conclu depuis un worktree en retard de **109 commits sur master**,
sans verifier contre master. ⭐ Regle qui en sort : **ne JAMAIS conclure a une absence depuis un
worktree — verifier `git ls-tree master` d'abord.** Invoquer un feedback a tort l'affaiblit.

✅ **DETTE XXE SOLDEE, DES DEUX COTES** : `defusedxml` present et actif (3 occurrences dans
`svg2lottie_scene.py`, identique sur master et ici) + dans `svg2lottie.py`.
⛔ Cette dette fantome est ecrite dans **4 fichiers** (starter, lottie-claude-inventaire,
CLIENT-SIM-COMPOSANTS-INDEX, ici) : elle a ete DUPLIQUEE au lieu d'etre POINTEE. Source de
verite unique = `memory/tools/lottie-claude-inventaire.md` ; les autres doivent y renvoyer,
sinon elle ressuscite au prochain copier-coller.

## Les 2 fichiers de test (SVG qu'on n'a PAS ecrits)
- **A standard** : logo Inkscape, 23 Ko — 30 paths, 38 degrades, 1 clipPath, 2 filtres, 2 `<use>`
- **B retors** : armoiries Equateur, 194 Ko — 442 paths, 85 `<g>`, 44 `<use>`, profondeur 7, CSS en CDATA

## Resultats mesures

| | A (logo Inkscape) | B (armoiries) |
|---|---|---|
| Calques portes | 29 | **438** |
| Sommets | 293 | 7731 |
| Poids Lottie produit | 43 Ko | **1042 Ko** |
| Degrades APPROXIMES (aplatis) | **21** | 2 |
| Filtres REFUSES | **14** | 0 |
| `<use>` REFUSES | 2 | **44** |
| Calques nommes | **0** | 0 |
| Proprietes animees | **0** | 0 |
| Temps de conversion | <1 s | **0,13 s** |

## ⭐ CE QU'ON APPREND

1. **La complexite brute N'EST PAS le mur.** B (194 Ko, 442 paths, profondeur 7) passe MIEUX
   que A (23 Ko). 0,13 s. Ce qui casse, ce sont 3 FONCTIONNALITES precises, pas le volume.
2. **Les degrades sont le vrai probleme** : aplatis en couleur pleine (moyenne des arrets).
   Le logo perd son modele, visible immediatement par le client. Et ca vise le coeur du marche :
   les logos d'app modernes sont presque tous en degrade (Inkscape : 38).
   ⭐ Solution connue non branchee : le MCP LottieFiles Creator sait poser des degrades
   (`set_fill`, arrets avec opacite, coordonnees PIXEL). -> `memory/tools/lottie-creator-mcp.md`
3. **Les filtres (flou/ombre) sont une limite du FORMAT Lottie**, pas de notre outil.
   A remplacer par une astuce visuelle, jamais a l'identique.
4. **Le nommage des calques est a ZERO** = la clause contractuelle "source files for easy
   future edits" que le vendeur affiche. 438 calques `path-1..path-438` = non editable.
5. **Poids** : 1 Mo disqualifie pour un splash screen — l'usage meme du client Cravvy.

## ⛔ LE NOMMAGE : pourquoi `group_layers.py` ne suffit pas

L'outil existe et repond au bon constat (Aziz dans Creator, 25/08 : "ellipse-68 n'offre
aucune prise"). Mais il DECLARE sa limite : *"CE QUE CA NE FAIT PAS : deviner l'intention.
La carte est fournie par l'humain."*

Sur NOS scenes : OK, on sait ce qu'on a dessine (l'intention vit dans les variables React).
**Sur le logo d'un client : on ne sait pas quelle forme est l'anneau et laquelle est la goutte.**

⛔ **Et le fichier client ne donne AUCUN indice** (mesure faite) : les `id=` existent mais
valent `a`, `b`, `c`, `A`, `B`... — noms COMPRESSES par l'optimiseur d'export. Zero
`inkscape:label`. Un filtre naif les compte comme "parlants" : faux positif, verifier le
CONTENU des ids, pas leur simple presence.

Ce qu'on sait de chaque calque sans le voir : couleur, taille, position. Assez pour DEDUIRE
(les grandes formes grises = corps du logo, les 2x1 px blancs = reflets), pas pour NOMMER.
=> **C'est un probleme qui demande de VOIR l'image, pas de lire le fichier.**

## Question commerciale reglee au passage (pas un chantier)

Le client v3 a fourni un .mp4 ("**our** lottie file", "a .mp4 video file"). Convertir une
video en Lottie n'a que 2 voies : redessiner a la main (ce qu'il a tres probablement fait),
ou vectoriser automatiquement (formes tremblantes, fichier enorme, illivrable).
=> **Refuser la conversion automatique, TOUJOURS. Mais proposer le redessin** — c'est un
service legitime, plus cher, et c'est une force prouvee chez nous (Fable, Kimi vision->SVG).
Formule : "je ne peux pas convertir votre video, mais je peux recreer votre logo en vectoriel
propre et l'animer — fichier leger et modifiable, ce que la conversion ne donnera jamais".

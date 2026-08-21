# Reverse-engineering d'un style vidéo tiers → pipeline assets déterministe

> Prouvé 2026-07-17 sur le "style Vox papercraft" d'une vidéo Higgsfield (Zinho Automates).
> But : reproduire un rendu premium qu'on voit ailleurs, SANS l'outil tiers (Higgsfield ~200 crédits/vidéo,
> re-tirés à chaque essai), en HYBRIDE : images générées 1× (réutilisables) + overlays codés gratuits en Remotion.
> Doctrine sœur : [[MOTEURS-VISUELS-ET-SOCLE]] · gotcha réseau : `tools/gemini.md` (IPv6→curl IPv4).

## Le pipeline (5 étapes, reproductible)

1. **Extraire la portion pertinente** de la vidéo (yt-dlp `--force-ipv4` → `ffmpeg -ss X -to Y`). Un clip ciblé (~1-2 min) suffit, pas toute la vidéo.
2. **Envoyer la VIDÉO complète à Gemini 3.1 Pro** (Files API, upload REST **curl -4** — le SDK Python stalle en IPv6 sandbox). Gemini voit le MOUVEMENT (transitions, timing, pop) — supérieur aux frames figées. Script : `scripts/tools/gemini-vox-reverse-breakdown.py`.
3. **Breakdown JSON qui TRANCHE image-générée vs overlay-code** pour CHAQUE élément (voir gotchas prompt ci-dessous).
4. **Générer les assets "image"** via Gemini 3.1 Flash image + **frame réelle jointe en référence** (image-ref > texte).
5. **Coder les overlays + l'animation** en Remotion (texte, chart, flèches, pop/wiggle) = gratuit, déterministe, itérable à l'infini.

## Gotchas prompt breakdown (corrigés en V2, NON-NÉGOCIABLES la prochaine fois)

- ⛔ **PROMPT NEUTRE, zéro biais de forme.** V1 disait "reproduire en SVG" + exemple "SVG code" → Gemini a docilement classé un avion 3D texturé en "SVG plat". FAUX (Aziz l'a vu, pas moi). En V2, forcer Gemini à trancher la NATURE de chaque élément : `image_generee` (volume/matière/ombres/texture → IMPOSSIBLE en SVG plat) vs `overlay_code` (texte/chart/flèche/forme plate). Ne jamais mettre la conclusion technique dans la bouche du modèle avant qu'il analyse (= anti-pattern INTENTION→FORME→TEMPLATE dans le mauvais ordre).
- ⛔ **`maxOutputTokens` GÉNÉREUX** (≥12000). Un budget serré + JSON large (N éléments + timeline + palette) → Gemini RATIONNE les prompts de génération (une ligne générique au lieu d'un prompt exhaustif). Symptôme : prompts trop courts. Fix = plus de tokens.
- ✅ **Claude affine les prompts, pas 1 appel Gemini/asset.** Prouvé : le petit prompt Gemini de l'avion + enrichissement Claude (couleurs #hex, direction lumière "top-left", "match material/volume/lighting of reference") = résultat au niveau du tiers. Donc PAS besoin de N appels Gemini dédiés (1/asset = inutile) : Claude sert de "seconde barrière premium" qui complète le prompt. Économise ~6 appels.

## Verdict moteur image pour le style "papier 3D texturé / papercraft"

- **Gemini 3.1 Flash image = LE bon moteur.** Suit fidèlement le style papier 3D texturé, respecte "objet isolé", cohérence de matière entre assets. Testé sur avion ✅ + siège ✅.
- **Recraft = tire vers la pâte à modeler (clay), pas le papier.** Son style le plus proche (`digital_illustration/handmade_3d`) dérive vers claymation. Pas mauvais en soi — c'est son STYLE INTERNE qui colle moins bien que Gemini pour CE look. Recraft reste meilleur pour du **vrai vectoriel plat** (icônes/logos/SVG). Détail : `tools/recraft.md`.
- **Règle** : style à matière/relief (papercraft, photo, 3D) → **Gemini**. Style vectoriel plat pur → **Recraft**.

## Carte type d'un style "explainer Vox papercraft"

IMAGES à générer (Gemini, 1× réutilisable) : avion/objets papercraft, sièges, photos halftone d'archive, cartes 3D papercraft, silhouettes, fond papier journal.
CODE overlay (Remotion, gratuit) : chiffres/dates/labels (Impact bold sur bandeau déchiré), chart à barres (scaleY spring), flèches (SVG stroke-dashoffset), croix/formes plates, pop+wiggle stop-motion, drop-shadow papier.

## Boucle de RAFFINEMENT V2 (validée 2026-07-17) — notre rendu VS réf → Gemini → écarts

Une fois un 1er montage rendu (V1), la boucle qui converge vers le niveau du tiers :
1. Rendre notre plan (mp4 court).
2. **Envoyer LES DEUX vidéos à Gemini 3.1 Pro** (notre rendu = A, la réf tierce = B) → breakdown JSON des ÉCARTS actionnables. Script : `scripts/tools/gemini-compare-2videos.py` (upload REST curl -4, même pattern).
3. **CROISER 3 perspectives, ne jamais coder Gemini aveuglément** :
   - Gemini attrape de vrais écarts qu'on rate (échelle, police manuscrite vs serif…).
   - Gemini HALLUCINE aussi des éléments inexistants — prouvé : il a inventé "5 barres" (il y en a 4), "flèche noire" (c'est l'axe en L), "sommet jaune", "animation 3→6 sièges". Si on code ça, on ajoute du faux.
   - Aziz attrape ce que Gemini ET Claude ratent — prouvé : sens de l'avion (nez à gauche au lieu de droite), fond trop clair vs réf plus sombre/chaude. → sa relecture visuelle est un maillon du crible, pas optionnelle.
4. Claude produit la LISTE CORRIGÉE (vrais écarts, hallucinations retirées, ajouts d'Aziz) → code la V2 → re-render → re-boucle si besoin.

Écarts V1→V2 typiques sur ce style : agrandir l'objet (les objets sont souvent trop petits au 1er jet), miroiter si le sens diffère, assombrir le fond (multiply teinte chaude), grossir chart + labels, police manuscrite + scotch visible sur les étiquettes.

Détourage d'un asset généré (fond blanc → transparent pour le poser sur un autre) : flood-fill depuis les bords + érosion `MinFilter` de la frange + 2e passe qui retire les POCHES blanches enclavées (le flood ne les atteint pas). Sinon halo blanc résiduel visible.

## À RETRAVAILLER (prochaine session, PAS urgent — Aziz : motion graphics ≠ priorité)

Plan avion V2.1 quasi-parfait, restent 3 finitions (feedback Aziz 2026-07-17) :
- **Décaler l'avion vers la GAUCHE** jusqu'au bord de l'image (quitte à le couper à gauche) — il est trop collé à droite et touche le graphique. Dégager la concurrence avion/chart.
- **Frange blanche du détourage TOUJOURS présente** → LEÇON : ne PAS s'acharner en flood-fill code. La bonne méthode = **faire retirer le fond/la frange par GEMINI** (image-edit : "remove white background, clean transparent edges"). Plus propre que l'érosion PIL. À appliquer.
- Puis c'était "quasiment parfait" (mot d'Aziz).

**Reco DURÉE pour la suite** : tester le workflow sur des clips **15-30s**, PAS 5s. À 5s par test, c'est trop long/coûteux en itérations pour ce que ça rend ; le workflow devient vraiment intéressant sur une séquence plus longue (plusieurs plans enchaînés).

## PISTE FUTURE — style "whiteboard doodle" (Higgsfield) comme INSPIRATION pour scènes SVG narratives

Segment de référence extrait : **vidéo YouTube `LiQPU7_5v68` (Zinho Automates), 8:55→9:44** = style whiteboard animation Higgsfield. Fichiers : `public/_rnd/vox-repro/whiteboard_segment.mp4` + `whiteboard-bougies-ref.jpg` + `whiteboard-etageres-ref.jpg`.

Analyse (Aziz + Claude d'accord, 2026-07-17) : NE PAS copier ce style tel quel, mais **s'en inspirer pour ENRICHIR nos scènes SVG génératives narratives** (le registre trait noir + hachures rappelle GGW / nos scènes "par chemin" noir & blanc) :
- ✅ **Reproductible en SVG** (via GLM-5.2 / GPT-5.6 Sol) : décors au trait main + hachures d'ombre — bougies/lampes (frame 0:18), étagères de fioles/bocaux avec remplissage couleur crayonné (frame 0:32). Donnerait de la MATIÈRE à nos fonds SVG actuellement trop épurés.
- ❌ **PAS reproductible** : le personnage organique (scientifique, visage/proportions naturels, anim fluide) = génération IA. Nos persos restent schématiques (StickRig, perso d'encre) — ne pas viser l'organique.
Idée à recréer prochaine session (décor whiteboard SVG, pas le perso). Lien doctrines SVG : [[SVG-SCENES-GENERATIVES]] · [[PERSONNAGE-VIVANT-INDEX]].

### Clarification technique whiteboard : SVG-animé vs vidéo-générée (recherche web 2026-07-17)
3 familles distinctes, ne pas confondre :
- **Outils "main qui dessine" (Doodly, VideoScribe)** : base SVG/vectoriel, le logiciel anime le TRACÉ (stroke-dashoffset). MAIS les figures organiques complexes = assets PRÉ-DESSINÉS par des humains, importés — l'outil ne les CRÉE pas, il révèle un dessin existant.
- **Génération SVG native par IA** : un prompt → code SVG (paths) généré + animé. Outil packagé = **Thinking Line** (thinkingline.com : "1 prompt → vidéo whiteboard OU SVG éditable en <3min"). = MÊME philosophie que NOTRE pipeline (GLM-5.2/GPT-5.6 Sol → SVG → Remotion). Donc PAS besoin de cet outil : on refait pareil chez nous, gratuit + contrôlé. Décor au trait OK ; perso organique fluide = le point dur (beaucoup de courbes à interpoler).
- **Génération VIDÉO IA (Higgsfield, Animaker Whiteboard 3.0 fin-2025, BigMotion, Storyboard-AI github)** : génère des PIXELS entraînés au look whiteboard → c'est ÇA qui explique le perso organique fluide de la vidéo montrée (pas du SVG animé, de la vidéo hallucinée). Inimitable en SVG déterministe.
CONCLUSION : le whiteboard "outil" EST du SVG (Aziz avait raison) ; mais l'organique fluide de la réf Higgsfield est de la vidéo générée, pas du SVG. Pour nos scènes narratives → viser le DÉCOR whiteboard en SVG (notre pipeline = équivalent Thinking Line), pas le perso organique.
Inspiration à voir (sans Higgsfield) : chaînes RSA Animate, CGP Grey, Kurzgesagt, TED-Ed ; assets libres The Noun Project / unDraw / Open Doodles.

## Assets R&D produits (2026-07-17)
`public/_rnd/vox-repro/higgsfield-analysis/` : clip, transcript, breakdown-vox-v2.json, gen-avion-01.png (✅ niveau tiers), gen-seat-gemini.png (✅) vs gen-seat-recraft.webp (clay). Proto SVG plat abandonné (VoxPapercutAvion16x9.tsx — garde la valeur des overlays, PAS de l'avion).

## ⭐ MISE À JOUR 2026-08-03 (session refs TED-Ed/GEOlayers, Gazoduc) — simplicité RECONFIRMÉE + filtre feutre testé (statique seulement)

Nouvelle analyse de refs (TED-Ed "poverty", TED-Ed Mansa Musa, whiteboard/feutre) : **CONFIRME** la
conclusion whiteboard ci-dessus (§ 2026-07-17) par la preuve la plus forte possible — nos VRAIES
productions publiées (cacao, GGW) n'ont **jamais eu besoin** de personnages humains articulés
complexes pour porter le message ; elles passent par la métaphore graphique (arbre/racines/objets).
La simplicité n'est pas juste une contrainte technique acceptée, c'est ce qui MARCHE en pratique sur
nos propres livrables.

**Nouveau test technique — filtre SVG natif "feutre à main levée"** : `feTurbulence` +
`feDisplacementMap` en double-trace décalée (2 copies du même path, chacune légèrement déplacée par
le displacement map, superposées) reproduit avec succès le grain "tracé à main levée au feutre" sur
nos formes SVG existantes — **gratuit et natif**, aucun appel API. ⚠️ **Testé UNIQUEMENT sur image
fixe, jamais en mouvement** (frame figée) — le comportement en animation (le displacement doit-il
rester figé ou varier par frame comme le grain `feTurbulence` documenté dans `tools/remotion.md`
ligne 265 `seed={Math.floor(frame/4)}` ?) reste à vérifier avant tout usage en production. Piste
gardée en réserve, **pas retenue pour Gazoduc** (le globe D3 ne s'y prête pas — registre différent).

**Mains articulées (TED-Ed safran, main+mortier-pilon)** : testé, PAS viable en un jet — détail
technique complet (pourquoi, ce qui a été tenté) dans `PERSONNAGE-VIVANT-INDEX.md` § "Mains à
doigts individuels articulés".

---

## ⭐⭐⭐ EXTENSION 2026-08-20 — la couche générée peut être un CLIP ANIMÉ, pas seulement une image fixe

> Prouvé sur le reverse engineering de l'ouverture **Aikido** (réf. B2B, `public/_shared/refs/benchmark-fiverr/02-aikido/`).
> Ce que la doctrine ci-dessus établissait : **image générée 1× + overlay codé**. Ce qui est ajouté ici :
> la couche générée peut être une **VIDÉO** (MiniMax H3), et l'overlay Remotion se pose dessus.
> Contexte : voie **B2B** (piliers 2/3/4/5 → [[PILIERS-B2B]]), pas la chaîne YouTube.

### Le critère de tri, formulé par Aziz — **« est-ce que ça SE LIT ? »**

Le partage image/code de la doctrine mère (`image_generee` vs `overlay_code`) se durcit en une question
unique, qui tranche sans discussion :

| Nature | Moteur | Pourquoi |
|---|---|---|
| **Abstrait** — feuilles qui s'empilent, papiers qui volent, une pile qui monte, un corps qui souffle | **H3** | Aucun caractère à déchiffrer. La matière suffit, et elle est plus riche que ce qu'on coderait. |
| **Précis** — calendrier, chiffres, dates, labels, sous-titres, logo | **Remotion** | ⛔ **H3 ne sait pas écrire.** Son calendrier est sorti en charabia (« FLANE », chiffres décoratifs) sur 2 générations. Structurel, pas un défaut de prompt. |

⭐ **Si le spectateur doit déchiffrer un caractère, ça vient de chez nous.** C'est le seul critère à retenir.

### ⭐⭐ Le mécanisme qui rend la recombinaison possible : l'`EMPTY WALL LOCK`

On ne retire pas après coup ce que H3 a dessiné — **on lui demande de laisser la place vide**, et on
occupe cette zone en Remotion. Bloc validé (le mur est resté nu sur 9,4 s, le reste du clip inchangé) :

```
EMPTY WALL LOCK: the wall area in the upper right of the frame stays BARE and EMPTY for the entire
clip. Nothing is ever hung, mounted, pinned or drawn there - no calendar, no poster, no picture,
no clock, no board, no chart, no frame. It remains flat empty cream-coloured wall from the first
frame to the last.
```
+ dans STRICT NEGATIVE : `no calendar, no wall calendar, no poster, no picture frame, no clock, no wall chart, no notice board`
→ Généralisable : nommer la ZONE, énumérer tout ce qui pourrait s'y loger, et le répéter en négatifs courts.

### ⛔⛔ L'ERREUR À NE PAS REFAIRE — verrouiller le personnage au lieu de lui donner une intention

**Commise dans cette session, corrigée par Aziz.** Devant une référence où le personnage est figé, j'ai
écrit un `STILLNESS LOCK` pour l'immobiliser. Résultat : le clip **lâchait à 6,5 s** (bouche ouverte
parasite), il fallait le couper pour le sauver.
Prompt réécrit en donnant une **INTENTION** (« il est dépassé, il souffle, ses épaules retombent ») en
gardant le décor verrouillé : le clip **tient ses 9 s**, et le soupir obtenu (sourcils en accent
circonflexe, yeux qui se ferment, tête qui s'incline) est le meilleur moment du plan.

⭐ **Autoriser le mouvement a STABILISÉ le clip** — le modèle n'avait plus à arbitrer entre l'instruction
« ne bouge pas » et sa pente naturelle. Corollaire direct de la règle déjà écrite dans
[[FICHE-CLIP-GENERE]] : *« l'hypothèse par défaut est que mon previs est en cause, pas que le modèle ne
sait pas faire »* — appliquée ici au PROMPT.
⚠️ Ce mouvement est **gratuit et non codable** : animer une épaule qui s'affaisse en flat vector est hors
de portée du déterministe. On était en train de le jeter.

**Le `MOUTH LOCK` reste obligatoire** (H3 fait parler tout visage à l'écran), mais reformulé : dire **par
quoi** montrer le souffle plutôt qu'interdire tout mouvement —
`The sigh is shown by his SHOULDERS and CHEST and EYEBROWS, not by his mouth opening.`
Contrôle : `ffmpeg -af volumedetect` ; > ~-45 dB = il émet. ⚠️ Sur un clip qui SOUFFLE volontairement,
-34 dB peut être le souffle, pas de la parole — **juger sur l'image, pas sur le seul dB**.

### Ce que ça prouve pour l'offre B2B

Le plan combiné est **meilleur que la référence sur ce beat** : leur homme est figé, le nôtre soupire.
Et le geste vaut au-delà du test — poser une couche exacte (sous-titres, chiffre-clé, logo, cartouche)
sur un clip existant est un **service d'édition vidéo** en soi, applicable à un clip client.

### ⭐⭐ LES REGISTRES SONT TRANSPOSABLES À SEED CONSTANT (2026-08-20, 2e volet de la session)

**Même seed + prompt IDENTIQUE + image de référence dans un autre style → la MÊME animation.**
Corrélations du profil de mouvement : hand drawn **0,919** · storyboard **0,896** · gravure sépia
**0,910** (réf. « même animation » = 0,823). Le décor, les vêtements et la matière s'adaptent au
registre ; la chorégraphie ne bouge pas d'une seconde.
⚠️ Un poster vector très contrasté mesure **0,719 alors que l'animation EST la même** — la corrélation
pixel sur-pénalise les aplats francs. **Regarder avant de conclure sur le chiffre.**

**⛔ CE QUE ÇA NE DOIT PAS DEVENIR UN ARGUMENT DE VENTE** : « on change de style en cours de projet ».
Vrai techniquement, mais le vendre fabrique des révisions infinies. La capacité se dépense **une fois,
en avant-vente** — 2-3 registres × 1 scène animée 5-10 s, le client choisit, le choix ferme la
question. Doctrine complète : [[PILIERS-B2B]] § GABARIT DE CHOIX.

**⛔ Partir de NOS registres, jamais d'un style inventé au prompt** (erreur commise puis corrigée par
Aziz : mes 2 styles génériques étaient des approximations pâles à côté des vrais). Les 3 maison, leurs
prompts et le personnage féminin déjà disponible : [[FICHE-CLIP-GENERE]] § NOS 3 REGISTRES MAISON.

**⛔⛔ GOTCHA IMAGE** : nommer une zone réservée en CAPITALES dans un prompt Gemini (`BARE EMPTY WALL`)
la fait **peindre en toutes lettres sur le mur**. Décrire l'ÉTAT, jamais nommer la zone.

### Les livrables (R&D `out/_r-and-d/personnage-vector-plat/`, gitignoré — liens = seule trace)

📁 **INDEX COMPLET des rendus validés, prompts et seeds** : `out/_r-and-d/personnage-vector-plat/MANIFESTE.md`
(tous les liens Vercel Blob + ce que chaque fichier prouve + ce qu'il ne faut pas supprimer).

| Clip | Ce qu'il prouve | Lien |
|---|---|---|
| **PLAN-COMBINE** ⭐ | la recombinaison : clip H3 + calendrier Remotion net | [lien](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/PLAN-COMBINE-OHldLOOYSejeoczG4pixpBjGEWAZOj.mp4) |
| **TRIPTYQUE MARIAMA** ⭐ | nos 3 registres MAISON, même animation | [lien](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/TRIPTYQUE-MARIAMA-3-REGISTRES-MAISON-3eovRekeSoAxkabvUQx1Tw3vMLyGOv.mp4) |
| **TRIPTYQUE 3 STYLES** ⭐ | le seed traverse le style (0,919 / 0,896) | [lien](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/TRIPTYQUE-3-STYLES-MEME-ANIMATION-hxJalZp2tItcWUpDWzCYriddm0qlgo.mp4) |
| planche Mariama | 2 scènes × 3 registres maison | [lien](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/PLANCHE-MARIAMA-3-REGISTRES-MAISON-Gh4lnpnL0aKODJuQ8QQjIK9wmboibA.png) |
| **chemin-D** (source) | H3 avec `EMPTY WALL LOCK`, mur laissé vide | garder — matière du combiné |
| chemin-C | le soupir, mais calendrier H3 illisible | [lien](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chemin-C-h3-vivant-RgdSd1JsRnqPVnTUoJe5ozFSJx1r8B.mp4) |
| chemin-B (contre-ex.) | `STILLNESS LOCK` : lâche à 6,5 s | [comparatif B vs C](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/COMPARATIF-B-fige-vs-C-vivant-SsKgI9RQhn5o18QjYzbQoFN5wdotya.mp4) |
| chemin-A (contre-ex.) | tout en Remotion : texte net, mais matière sèche + 4 rendus de placement | [comparatif A vs B](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/COMPARATIF-A-vs-B-3s6Orhn5ziNF96xKMOMJWQdvurd48I.mp4) |

**Code** : `src/projects/_client-sim/vector-plat/OuvertureBureauMixte.tsx` (le combiné, compo
`OuvertureBureauMixte`) · `OuvertureBureauDeterministe.tsx` (le tout-Remotion, contre-exemple).
**Prompts + seeds archivés** à côté des clips (`clipB/C/D.prompt.txt`, `.meta.json`) — sans le seed,
aucune correction post-montage n'est possible.
Coût total du test : **0,034 $** (1 image Gemini Lite) + GPU Comfy gratuit.

### ⚠️ Tension à surveiller avec [[MOTEURS-VISUELS-ET-SOCLE]] (signalée, PAS tranchée)

Cette doctrine-là pose pour le registre **QUI** : « ⛔ Jamais un modèle, jamais Seedance », et qualifie
H3 de « coût réel + non déterministe ». Notre clip est un acteur humain produit par H3, **gratuit**
(Comfy Cloud), et il bat ce qu'on coderait.
**Pourquoi il n'y a pas contradiction** : l'interdit vise un acteur qui **JOUE** (son geste porte
l'argument — scribe, vendeuse) dans les vidéos **Souverain/YouTube**, où le socle stick-figure est
validé en production depuis le 2026-07-28. Notre homme **SUBIT** : il est le décor humain d'un problème,
dans un livrable **B2B**. ⛔ Ne PAS étendre ce résultat au registre QUI de la chaîne sans un test dédié.

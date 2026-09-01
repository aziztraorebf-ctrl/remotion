# Une frame isolée ne prouve jamais l'absence de gel — vérifier le MOUVEMENT

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo). Distinct de
> [[feedback_review-mp4-avant-presentation]] (celui-là couvre le layout/placement avant présentation ;
> celui-ci couvre la détection de gel/concat cassé et le jugement de mouvement sur une référence tierce).

Sur le mid-form Soudan (passe finale v4, 2026-07-22), j'ai presente une video a Aziz avec une image
COMPLETEMENT FIGEE pendant ~4 minutes (fin Acte 3 -> tout l'Acte 4, 2:55->7:00) alors que l'audio
continuait normalement. Aziz l'a detecte en regardant la video ; moi je l'avais "verifiee" avant en
extrayant des frames isolees a plusieurs timecodes dans cette zone — TOUTES paraissaient correctes
individuellement, parce que la scene affichee (fin Acte 3, Egypte/Turquie/Dubai) etait effectivement le
bon contenu au bon endroit. Le probleme n'etait pas le CONTENU de l'image, c'etait qu'elle ne CHANGEAIT
JAMAIS pendant 4 minutes.

**Cause racine technique** : `a3.mp4` etait lui-meme issu d'une concatenation interne (Section1+Insert).
Le concatener a nouveau avec les 5 autres actes via le concat DEMUXER ffmpeg (`-f concat -i list.txt
-c:v copy`, meme avec un premier passage en `-c:v libx264` qui semblait re-encoder) a produit des DTS
(decoding timestamps) non-monotones au niveau de la jonction — `ffmpeg` a averti "Non-monotonic DTS...
changing to X" silencieusement absorbe par mon script sans que je lise ce warning, et le fichier de sortie
avait un flux video qui s'arretait a une frame donnee (verifie : `ffprobe -show_entries stream=nb_frames`
donnait un nombre de frames video tres inferieur a `duration*fps`) alors que le flux audio, lui, continuait
normalement jusqu'a la fin (duree `format.duration` correcte, ce qui masquait le probleme si on ne
regardait QUE cette valeur globale).

## La regle qui aurait du m'arreter avant de presenter

1. **JAMAIS se fier a une frame isolee `-ss Xs -frames:v 1` pour verifier l'ABSENCE de gel.** Une frame
   seule ne prouve que "le contenu a cet instant est plausible", jamais "la video bouge". Il faut soit (a)
   extraire PLUSIEURS frames rapprochees (ex toutes les 2-5s sur TOUTE la duree, pas juste aux "points
   d'interet" que je pense verifier) et comparer par HASH (md5/sha) — des hashs identiques consecutifs =
   gel ; soit (b) generer un extrait video REEL joue en continu (`ffmpeg -ss X -t 10 -c copy extrait.mp4`)
   et le regarder/analyser frame par frame.
2. **Toujours verifier `ffprobe -show_entries stream=nb_frames` sur le flux VIDEO specifiquement** (pas
   juste `format=duration`) apres tout concat/remux — si `nb_frames / fps` << `format.duration`, le flux
   video s'est arrete avant l'audio. C'est LE signal objectif le plus rapide a verifier.
3. **Se mefier du concat DEMUXER (`-f concat -i list.txt`) des qu'une des sources est elle-meme le
   produit d'un concat/remux precedent.** Les timestamps peuvent deriver en cascade. Preferer le FILTRE
   `concat=n=N:v=1:a=1` (avec re-encodage complet, decode chaque frame reellement) pour tout assemblage
   final destine a etre presente — plus lent mais fiable. Reserver le concat demuxer aux etapes
   intermediaires qu'on re-verifie ensuite par le filtre.
4. **Lire les warnings ffmpeg, ne pas juste `tail -N` la sortie pour chercher "Error".** "Non-monotonic
   DTS" est un WARNING (pas une erreur), mais c'est le signal exact du bug ici — il etait present dans les
   logs et je l'ai vu tardivement seulement en le cherchant specifiquement.

## How to apply
Avant de presenter TOUT rendu qui a subi un concat/assemblage de plusieurs sources (pas seulement Soudan,
tout projet Remotion/War-Map/Souverain qui concatene des actes/beats separes) : (1) verifier
`nb_frames` video vs duree attendue, (2) extraire un echantillonnage dense (toutes les 2s sur toute la
duree) et hasher pour detecter toute sequence figee, (3) si le fichier est issu d'un concat-de-concat,
privilegier le filtre `concat=` plutot que le concat demuxer des le depart plutot que de decouvrir le bug
apres coup. Voir aussi [[feedback_presentation-render-plein-format]] (autre regle de verification avant
presentation) et `memory/episodes/soudan-midform/STATUS.md` § v4 pour le cas concret.


## ⭐ 2e FAMILLE DE « j'ai vérifié et c'était quand même cassé » — la structure (2026-07-25)

Vérifier la COUTURE d'un raccord ne vérifie PAS la scène qu'il raccorde. Vécu CFA : la jonction entre
deux beats avait été contrôlée image par image et jugée bonne — mais le câblage du raccord avait, à
l'intérieur de la scène suivante, fait s'animer simultanément deux éléments qui devaient se lire l'un
APRÈS l'autre, détruisant la démonstration. Rien ne le signalait à la jonction.

**Règle** : après tout changement de STRUCTURE (raccord, concat, refactor d'un composant partagé),
revérifier la **séquence narrative de chaque scène touchée**, pas seulement le point de couture. Le
piège est qu'on ne re-regarde pas une scène « à laquelle on n'a pas touché ».

Cas détaillé (ne pas dupliquer ici) : `memory/doctrines/SVG-SCENES-GENERATIVES.md` § PIÈGE VÉRIFIÉ.

## ⭐⭐ 3e FAMILLE — la zone jugée « à risque » n'est pas la seule à vérifier, et une frame qui « a l'air bien » ne prouve rien sans compter (2026-08-10)

Vécu deux fois dans la même session (tests vidéo MiniMax H3, scène multi-personnages) :

1. **Vérifier seulement la zone jugée à risque a priori rate un défaut ailleurs.** Un clip généré
   (407 crédits) a été jugé bon après avoir vérifié uniquement la zone d'un geste complexe en fin de
   clip (jugée la plus susceptible d'avoir un défaut) — ratant un écran noir complet avec sous-titres
   affichés à la place de la scène, sur les 7 premières secondes, jamais inspectées car jugées « sûres »
   a priori.
2. **Une frame qui « a l'air bien » isolément ne prouve pas qu'un élément n'a pas disparu — il faut
   compter.** Sur ce même type de scène (geste de deux personnages qui se serrent la main, un 3e en
   arrière-plan), chaque frame individuelle semblait correcte à l'inspection — le clip a été qualifié de
   succès. Le 3e personnage avait pourtant disparu progressivement au fil des frames ; seule une
   comparaison explicite du NOMBRE de personnages visibles d'une frame à l'autre l'a révélé.

**Règle** : sur toute review de clip généré (MiniMax H3, Kling, Seedance, tout modèle vidéo payant),
échantillonner des frames sur 100% de la durée à intervalles réguliers, jamais seulement la portion
jugée a priori la plus risquée — ce jugement a priori est lui-même la source de l'angle mort. Quand
plusieurs éléments/personnages sont en jeu dans une même zone, compter explicitement leur nombre frame
par frame et comparer ce compte d'une frame à l'autre, plutôt que juger chaque frame isolément comme
« elle a l'air bien ». Cas détaillé : `memory/tools/minimax.md` § TEST RÉEL 4/5.

---

## Corollaire — ne jamais SUPPOSER la durée d'un clip depuis un voisin du même dossier (2026-08-15)

Même famille de risque (timing vidéo non vérifié), mode d'échec différent : réutiliser la durée
mesurée d'un clip pour un AUTRE clip du même dossier / du même pipeline de génération. Deux exports
du même outil, même config, peuvent différer — constaté ici 5.875s vs 5.167s dans le même dossier
`insert-matiere/`. Une durée SURESTIMÉE dans un `<Loop>` fait geler l'image sur la dernière frame
(un clip H3 finit souvent en noir), **sans aucune erreur ni crash pour le signaler**.

**Règle** : chaque fichier vidéo qui entre dans un timing se mesure INDIVIDUELLEMENT
(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 <f>`) avant
d'écrire sa durée dans le code — jamais par analogie avec un fichier voisin, même quand tout laisse
penser qu'ils sont identiques. Et boucler SOUS la durée mesurée, jamais dessus.

## ⭐⭐ L'AUTRE FACE : ANALYSER LA VIDEO D'UN CONCURRENT (2026-08-26)

Tout ce qui precede concerne NOTRE rendu — detecter un gel. Le cas symetrique est aussi couteux :
**juger la vidéo d'un tiers pour en extraire la methode**.

Vecu sur « Foster With Confidence » (reference SaaS explainer, 1273 frames) : j'ai extrait **16 frames,
soit une toutes les 2,7 s**, et rendu un verdict complet — decoupage, briques, comparaison a notre stack.
Aziz, qui avait REGARDE la vidéo, a liste ce que j'avais rate :
- **12 transitoires sonores en 8 s** (mesure ensuite : chaque apparition a son SFX) — invisible sur des images
- des **micro-etats** : notifications qui arrivent une par une, texte qui s'assemble caractere par caractere
- une **ellipse temporelle DANS un zoom continu** (12:57 -> 9:38 sans coupe) — indetectable sans frames rapprochees
- l'objet **pose dans un decor** avec allumage en 0,30 s — le geste d'ouverture entier

⭐ **La densite se deduit de ce qu'on cherche, pas d'un quota** : pour juger un MONTAGE il faut la
detection de coupes (`select='gt(scene,0.3)'` ET un seuil bas a 0.12 pour les transitions douces), plus
un echantillonnage **sous la seconde** sur les zones actives. Une frame toutes les 2-3 s ne montre que
les plans, jamais les gestes.

⭐ **L'AUDIO EST UNE SOURCE, PAS UN DECOR** : le profil d'enveloppe (fenetres de 50 ms, pics = SFX) revele
le design sonore qu'aucune image ne donne. Faire ce releve AVANT de conclure sur un montage.

⛔ Le cout : un verdict entier a refaire, et surtout une comparaison a notre stack qui concluait
« 6 briques sur 8 a parite » alors que l'ecart reel etait ailleurs — dans la mise en scene et le son.

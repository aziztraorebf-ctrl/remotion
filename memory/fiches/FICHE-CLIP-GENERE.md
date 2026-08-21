# CLIP GÉNÉRÉ (MiniMax H3) — fiche de déclenchement (lire AVANT de lancer une génération)
> Portée : produire/animer un CLIP par génération (H3 via Comfy Cloud). ⛔ Ne couvre PAS la caméra
> **codée** (Remotion/D3/Mapbox) → `memory/fiches/FICHE-CAMERA.md`.
> ⚠️ Si ce que tu lis ne correspond PAS au réel sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Dernière vérification : 2026-08-20.

## ⛔⛔ AVANT DE DÉCLARER UNE LIMITE DU MODÈLE — vérifier que ce n'est pas MON previs

**Vécu 3× dans la session du 2026-08-19, corrigé 3× par Aziz.** J'ai écrit successivement « c'est un
montage d'images fixes », « l'orbite est impossible », « la plume disparaît » — les trois étaient faux.
À chaque fois la cause était **de mon côté** (frames trop espacées, previs troué, frames redimensionnées),
jamais une limite de H3.

**La règle** : quand un rendu échoue, l'hypothèse par défaut est **« mon previs / ma mesure est en
cause »**, pas « le modèle ne sait pas faire ». Une limite du modèle ne s'écrit en mémoire qu'après avoir
éliminé le previs — sinon on ferme une porte pour toutes les sessions futures.

**Preuves accumulées que le modèle suit fidèlement le previs, y compris ses défauts** :
| symptôme observé | vraie cause (dans le previs) |
|---|---|
| copie les blocs gris à l'écran | zones VIDES dans le previs (17-19 %) ou couleurs saturées |
| bras qui s'allonge, élastique | previs demandait un bras à **1,63× le buste** (anatomie ≤ 1,0×) |
| caméra traverse le mur | previs cylindrique : la caméra sortait du volume de la pièce |
| 2e mouvement absent | H3 suit la direction, pas le rythme → previs non contraignant sur le tempo |
| jambes qui morphent au lever | previs ne montre que le Δhauteur du corps, aucune étape de jambes |
→ **Le previs se débogue par la MESURE** (zones vides, ratios, amplitude), pas par des itérations de prompt.

## LES 3 RÈGLES QUI ONT COÛTÉ UN ESSAI CHACUNE
1. ⛔ **`input_overrides` n'est PAS fiable** sur `video_minimax_h3_r2v` → retombe silencieusement sur le
   clip de démo (super-héros). **Construire le graphe API à la main + `submit_workflow`.** Vérifier
   `"values.a": ["132",0]` sur le node 131 (et non `"a"`).
2. ⛔ **H3 génère de la parole non demandée** dès qu'un visage est à l'écran → la bouche s'anime.
   Retirer l'audio au montage NE corrige PAS l'image. Bloc `AUDIO: no speech...` + `MOUTH LOCK` obligatoires.
   Contrôle : `ffmpeg -i clip.mp4 -af volumedetect -f null /dev/null` → au-dessus de ~-45 dB, il parle.
3. ⛔ **Gros plan en style simplifié** (yeux en points) → le modèle rajoute de l'anatomie et casse la
   continuité. **Générer large, RECADRER le fichier** (crop PIL sur source 2K, nettteté vérifiée).

## SEED — la règle exacte
**seed + prompt IDENTIQUES + image modifiée → MÊME animation** (corrélation mesurée 0,823).
**Prompt changé → animation changée.** Le seed fige le chemin de débruitage, le prompt décrit le geste.
→ **Archiver `clipN.prompt.txt` + `clipN.meta.json` (seed) à côté de CHAQUE clip.** Sans ça, aucune
correction d'erreur post-montage n'est possible.

## ⭐⭐⭐ CAMÉRA SUR CLIP GÉNÉRÉ (MiniMax H3) — PILOTER PAR UN PREVIS, PAS PAR DU TEXTE

> Validé 2026-08-18. **Décrire un mouvement de caméra en mots ne marche pas** (tous nos clips H3
> antérieurs sont figés : écart 1re/dernière frame **0,68/255**). Il faut le **MONTRER** : une vidéo de
> référence en géométrie grossière, branchée sur `ref_videos`. C'est la méthode Animistry (previs
> Blender → Seedance), reproduite à coût nul sur notre GPU gratuit.

**AMPLITUDE** (écart 1re/dernière frame) : sans previs **0,68/255** (figé) → avec previs **38-48/255**.
Validés : push-in (large et serré), travelling latéral (vraie parallaxe), crane-up, orbite 180°.
⛔ **L'amplitude ne prouve PAS la réussite** — juger aussi le GRADIENT (tenue du style, voir § GRIS).
Historique des essais couleur et de leur décrochage : `memory/tools/minimax-h3-comfy-cloud.md`.


### RECETTE (2 gotchas bloquants, chacun a coûté un essai)
1. ⛔ `upload_file` **refuse les .mp4** → encoder le previs en **GIF animé**
   (`ffmpeg -i previs.mp4 -vf "fps=24,scale=W:H" previs.gif`), lu par `LoadImage` comme une séquence.
2. ⛔ `ref_videos.ref_video_0` attend un **IMAGE, pas un VIDEO** → brancher `LoadImage` DIRECTEMENT.
   Intercaler un `CreateVideo` = erreur 400 `return_type_mismatch`.
```python
g["140"] = {"class_type":"LoadImage","inputs":{"image":"<previs.gif uploadé>"}}
g["136"]["inputs"]["ref_videos.ref_video_0"] = ["140", 0]
```
Prompt : séparer les rôles — `<Picture 1>` = STYLE, `<Video 1>` = CAMERA BLUEPRINT uniquement, mapper
les blocs ("the blue block is the scribe..."), + `STYLE LOCK: the look comes ONLY from <Picture 1>`.
⭐ **Générateur (VERSIONNÉ)** : `scripts/tools/mkprevis.py --mode push|lateral|orbit|crane|dolly|lever|bras|combo --gif`
Défauts = les acquis mesurés (gris, 0 % de vide, clamp bras ≤1,0× buste). `--gif` sort directement le fichier
à uploader. ⛔ Les anciens `mkprevis1-6.py` sous `out/_r-and-d/` sont GITIGNORÉS et purgeables — ne pas s'y référer.
Le previs doit être LAID et faire la MÊME longueur que le clip (124 frames = 5,167 s).
Détail complet + liens des rendus : `memory/tools/minimax-h3-comfy-cloud.md` § PREVIS.

## ⭐⭐⭐⭐ PREVIS EN NIVEAUX DE GRIS — le fix du décrochage (validé 2026-08-19)

**Hypothèse d'Aziz, confirmée** : les couleurs saturées du previs (bleu, rouge) « appellent » la copie.
Un previs **100 % gris** (saturation mesurée 0,00) ne donne aucune couleur à imiter, seulement la
trajectoire. ⭐ **C'est LE réglage par défaut désormais.**

**Gradient minimum sur le clip** (illustration saine 11-14, aplat previs 3-4) :
| clip | min | verdict |
|---|---|---|
| orbite previs COULEUR troué | **3,42** | copie les blocs |
| orbite previs COULEUR plein | **3,68** | copie les blocs (décrochage déplacé) |
| **orbite previs GRIS** | **8,52** | ✅ tient — le modèle invente même du décor cohérent |
| **duo 10 s previs GRIS** | **11,39** | ✅ aucun décrochage sur 10 s |

→ Cumuler les 3 réglages : **gris** + **zéro zone vide** (décor cylindrique) + prompt qualifiant
`<Video 1>` de *« GREYSCALE CAMERA PATH DIAGRAM »* + négatif `no greyscale output, no monochrome`
(sinon risque que la sortie devienne grise elle aussi).

MOTION DIAGRAM ... read ONLY how the character's body moves »*, mapping explicite des blocs, +
`THE CAMERA DOES NOT MOVE AT ALL`. Générateur : `scripts/tools/mkprevis.py --mode lever|bras`.

⛔ **2 personnages en interaction : TESTÉ et ÉCHOUÉ** (couloir b5) → voir § LA LIGNE DE PARTAGE.

## ⭐⭐⭐⭐⭐ TEST FINAL — ACTION + CAMÉRA dans le MÊME clip 10 s (validé 2026-08-19)

**Le previs peut porter les DEUX à la fois.** Chorégraphie demandée : 0-3 s écrit (caméra fixe) ·
3-5 s pose la plume · 5-10 s se lève PENDANT un push-in.

**Mesuré** : bords 2,79 sur la phase fixe → 43,48 sur le push-in, gradient sain (11,8-13,1) sur 10 s.
⭐ Le bloc complet : geste + caméra + prompt, 10 s sans coupe, style tenu.

⚠️ **Nuance vs le duo 10 s précédent** : ici les 2 phases sont bien distinctes parce qu'elles sont de
NATURES différentes (caméra fixe → caméra mobile). Deux mouvements de caméra CONSÉCUTIFS (push puis
latéral) restent non acquis — H3 précipite tout dans le premier tiers.

✅ **Objet tenu en main puis posé** : previs qui le dessine à CHAQUE frame + état déclaré seconde par
seconde + négatif `no floating objects, no object sliding by itself, no teleporting pen`.
⛔ Un objet PETIT ne se juge pas sur frames redimensionnées → crop pleine résolution.

## ⭐⭐⭐ LE MORPHING DES JAMBES EST RÉSOLU — et il se MESURE (validé 2026-08-19, hook Gazoduc)

**Le fix** : décomposer le lever dans le previs en **3 temps explicites avec des BLOCS DE JAMBES
DISTINCTS** (cuisse + tibia séparés, deux appuis écartés latéralement) : genoux fléchis → la jambe
avant pousse et se tend → la jambe arrière suit. Exactement la même logique que la décomposition de
la caméra. ⛔ Ne PAS se contenter du Δhauteur du bloc-corps — c'était la cause du fondu sur le scribe.

**⭐ Comment JUGER un lever sans se fier à l'œil** — mesurer la variation de la ZONE DES JAMBES frame
par frame pendant le geste :
| courbe observée | verdict |
|---|---|
| montée progressive → **PIC net** (la poussée sur les appuis) → décrue | ✅ vrai lever |
| courbe **LISSE et continue**, sans pic | ⛔ morphing/fondu |
Mesuré sur le hook Gazoduc : montée 5,5→6,5 s, **pic à 6,7-6,9 s**, décrue jusqu'à 8,5 s. ✅

## ⭐⭐⭐⭐⭐ LE STYLE EST TRANSPOSABLE À SEED CONSTANT (validé 2026-08-20) — l'acquis n°1

**Même seed + prompt IDENTIQUE au caractère près + image de référence dans un AUTRE style
→ la MÊME animation, réhabillée.** Corrélations mesurées (profil de mouvement frame-à-frame) :
hand drawn **0,919** · storyboard crayon **0,896** · gravure sépia **0,910** (réf. fiche : 0,823).
⛔ Ne toucher QUE l'image. Une seule phrase de prompt changée et la garantie tombe.
⭐ Écrire le prompt SANS nommer le style (« Preserve this exact art style ») — un prompt qui dit
« flat vector » appliqué à une image au crayon se contredit lui-même.
⚠️ **Un poster vector à aplats très contrastés mesure 0,719 alors que l'animation EST la même** :
la corrélation pixel sur-pénalise les forts contrastes. **Toujours REGARDER avant de conclure sur le
chiffre** — ici la mesure seule aurait fait rejeter un clip bon.

**Ce que ça sert (doctrine commerciale, décision Aziz)** : ⛔ PAS « on peut changer de style en cours
de projet » — cette promesse fabrique des révisions infinies. La capacité se dépense **UNE fois, en
AVANT-VENTE** : 3 registres × une scène de 5-10 s → le client choisit, et le choix ferme la question.
Détail : [[PILIERS-B2B]] § GABARIT DE CHOIX.

## ⭐⭐⭐ DONNER UNE INTENTION, JAMAIS UN ORDRE D'IMMOBILITÉ (validé 2026-08-20)

`STILLNESS LOCK` (« il ne bouge pas ») → le clip **lâche à 6,5 s** sur 9 (bouche parasite), à couper.
Même seed, prompt réécrit en INTENTION (« il est dépassé, il souffle, ses épaules retombent »)
+ décor toujours verrouillé → **tient 9 s**, et le soupir obtenu (sourcils accent circonflexe, yeux
qui se ferment) est le meilleur moment du plan. **Autoriser le mouvement STABILISE le clip.**
⭐ Ce mouvement est gratuit et **non codable** (une épaule qui s'affaisse en flat vector est hors de
portée du déterministe) — le verrouiller, c'est jeter la valeur ajoutée du moteur.
Reformuler le MOUTH LOCK en disant PAR QUOI montrer le souffle :
`The sigh is shown by his SHOULDERS and CHEST and EYEBROWS, not by his mouth opening.`

## ⭐⭐⭐ RÉSERVER UNE ZONE POUR REMOTION — `EMPTY WALL LOCK` (validé 2026-08-20)

⛔ **H3 ne sait pas écrire** (calendrier sorti en « FLANE », chiffres décoratifs, 2 générations).
Règle de tri : **« est-ce que ça SE LIT ? »** → abstrait (matière, corps, objets qui s'empilent) = H3 ·
précis (texte, chiffres, dates, sous-titres, logo) = **Remotion par-dessus**.
On ne retire pas après coup — on demande à H3 de laisser la place :
```
EMPTY WALL LOCK: the wall area in the upper right stays BARE and EMPTY for the entire clip.
Nothing is ever hung, mounted, pinned or drawn there - no calendar, no poster, no picture,
no clock, no board, no chart, no frame.
```
+ négatifs courts : `no calendar, no poster, no picture frame, no clock, no wall chart`
⛔⛔ **GOTCHA IMAGE (Gemini)** : nommer la zone en CAPITALES (`BARE EMPTY WALL`) la fait **PEINDRE EN
TOUTES LETTRES sur le mur**. Décrire l'ÉTAT (« the upper right portion of the wall is smooth
undecorated earth ») + `no text of any kind anywhere` en négatif.

## 🎨 NOS 3 REGISTRES MAISON — prompts archivés, ⛔ ne pas réinventer un style générique

| Registre | Signature | Prompt source |
|---|---|---|
| **Sunjata** | contour brun épais (jamais noir), aplats mats, grain papier, palette ocre/sienne/terre | `out/_r-and-d/scribe-tombouctou/prompts/prompt-sonjata-plan1.txt` |
| **Gravure sépia** | encre + hachures croisées denses, lavis, papier vieilli | `memory/episodes/_rnd/canada-red-bay/tests-visuels/scene5-narrative-test/prompt-plan1.txt` |
| **Poster vector** | aplats francs, teal + orange brûlé + ocre, silhouettes graphiques, éditorial adulte | `out/_r-and-d/scribe-tombouctou/prompts/prompt-B-postervector.txt` |

Personnage féminin prêt (planche 6 vues, registre Sunjata) :
`memory/episodes/_rnd/canada-red-bay/tests-visuels/mariama-ba-charsheet-6vues-v1.png`
⭐ Les 3 tiennent l'animation ET supportent un décor moderne (Sunjata testé en open-space B2B).
⛔ Un style inventé au prompt est une approximation pâle : partir de ces fichiers.
Livrables + liens : [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] § EXTENSION 2026-08-20.

## ⚠️ `AUDIO: no speech` + `MOUTH LOCK` n'empêchent PAS la génération audio (2026-08-19)
Mesuré -31,0 dB malgré les deux blocs (seuil de la fiche : -45 dB). **MAIS la bouche ne s'animait pas**
(variation de la zone du visage 1,25 de moyenne, max 3,91) — donc le contrôle `volumedetect` seul
**sur-diagnostique** : un son généré n'implique pas une bouche animée.
→ Contrôler les DEUX : `volumedetect` pour le son, ET la variation de la zone du visage pour l'image.
C'est l'image qui est bloquante (l'audio est remplacé par la narration au montage).

## ⛔ Le graphe archivé `scribe-tombouctou/graphes/graph-previs.json` contient l'ESSAI RATÉ
Il a un node 141 `CreateVideo` branché sur `ref_videos` — c'est la version qui a produit l'erreur 400
`return_type_mismatch`, PAS celle qui marche. Le recopier tel quel refait l'erreur.
✅ **Graphe correct de référence : `out/_r-and-d/gazoduc-hook-ouvrier/graph-hook.json`** (LoadImage
branché directement sur `ref_videos.ref_video_0`, node 141 supprimé). Validé `dry_run` + généré.

## ⭐⭐⭐ LA LIGNE DE PARTAGE — le previs porte la CAMÉRA, le prompt porte les CORPS
**Un previs est un canal VISUEL : il transporte une APPARENCE en même temps qu'une trajectoire.**
- La **CAMÉRA** n'a pas de forme propre — rien à recopier, le previs est GRATUIT.
- Un **CORPS** a une forme. Dessiner un bloc pour dire « ce corps bouge ainsi » donne aussi au modèle
  une apparence de bloc, qu'il n'a **aucune raison de refuser**.
⛔ **Vécu (couloir b5)** : deux corps entiers dessinés au previs → H3 a sorti **deux rectangles gris à
tête rectangulaire, plein cadre à 4 s**. Ce n'est pas une limite du modèle, c'est mon previs.
→ Générateur **caméra pure** (aucun corps) : `scripts/tools/mkprevis-camera-seule.py --out X --gif`.
**Les 4 cas réels** : `mkprevis.py` (scribe) · `-chantier.py` (Adrar, extérieur nocturne) ·
`-couloir.py` (2 persos, l'échec) · `-camera-seule.py` (le fix).

**⭐ 2 corrections de previs à faire d'office sur un DÉCOR EXTÉRIEUR** (chacune aurait coûté un essai) :
1. **Un décor en bandes horizontales pures rend le push-in invisible autour du sujet** (mesuré 7,29 sur
   la bande médiane contre 45 sur le sol). → semer des volumes de TAILLES et PROFONDEURS différentes
   (jalons, tas, objets au sol) : 7,29 → 13,28.
2. **Sujet qui grandit + zoom = tête coupée**. Un personnage qui se redresse grandit DÉJÀ ; le zoom s'y
   ajoute. → dimensionner par le CALCUL (viser ~45 px de marge au-dessus du crâne à la frame finale),
   jamais à l'estime, et faire suivre le centre de visée.

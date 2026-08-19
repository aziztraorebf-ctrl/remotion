# CLIP GÉNÉRÉ (MiniMax H3) — fiche de déclenchement (lire AVANT de lancer une génération)
> Portée : produire/animer un CLIP par génération (H3 via Comfy Cloud). ⛔ Ne couvre PAS la caméra
> **codée** (Remotion/D3/Mapbox) → `memory/fiches/FICHE-CAMERA.md`.
> ⚠️ Si ce que tu lis ne correspond PAS au réel sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Dernière vérification : 2026-08-19.

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

**Prochain palier non testé** : 2 personnages en interaction (combat, échange d'objet) — cumule 2 sujets,
contact et dynamique rapide.

## ⭐⭐⭐⭐⭐ TEST FINAL — ACTION + CAMÉRA dans le MÊME clip 10 s (validé 2026-08-19)

**Le previs peut porter les DEUX à la fois.** Chorégraphie demandée : 0-3 s écrit (caméra fixe) ·
3-5 s pose la plume · 5-10 s se lève PENDANT un push-in.

**Mesure — la caméra a respecté le découpage temporel** :
| | valeur | attendu |
|---|---|---|
| bords 0-4,5 s | **2,79** | caméra fixe ✅ |
| bords 5-10 s | **43,48** | push-in franc ✅ |
| gradient (style) | 11,8 / 11,8 / 13,0 / 13,1 | sain sur 10 s ✅ |

⭐ **C'est le bloc complet** : geste + caméra + prompt, sur 10 s, sans coupe, style tenu. Le montage
redevient un choix narratif au lieu d'une contrainte technique.

⚠️ **Nuance vs le duo 10 s précédent** : ici les 2 phases sont bien distinctes parce qu'elles sont de
NATURES différentes (caméra fixe → caméra mobile). Deux mouvements de caméra CONSÉCUTIFS (push puis
latéral) restent non acquis — H3 précipite tout dans le premier tiers.

✅ **L'OBJET EST RÉGLÉ** (vérifié par Aziz au visionnage — ma lecture sur frames était FAUSSE, je
l'avais crue disparue) : la plume est posée sur la table, **elle y reste** pendant qu'il se lève et
jusqu'à la fin. Le combo qui marche : previs qui dessine l'objet à CHAQUE frame (dans la main puis sur
la table) + prompt qui déclare son état seconde par seconde + négatif `no floating objects, no object
sliding by itself, no teleporting pen, no duplicated pen, no disappearing pen`.
⛔ **Leçon de méthode** : un objet PETIT ne se juge pas sur des frames redimensionnées — le vérifier en
lecture réelle ou sur un crop pleine résolution avant de conclure à un défaut.

⚠️ **VRAI défaut restant — le MORPHING des jambes au lever** : assis en tailleur, jambes croisées, il
passe à la position debout par un **fondu/morphing des jambes** au lieu de les décroiser puis de pousser
sur ses appuis. Subtil mais visible, et c'est typiquement ce qui « crie l'IA ».
→ Cause probable : mon previs ne montre QUE le changement de hauteur du bloc-corps (assis → debout), il
ne décrit aucune étape intermédiaire de jambes.
→ Piste : décomposer le lever dans le previs en 3 temps explicites (décroiser → un genou au sol →
pousser/se redresser), avec des blocs de jambes distincts, comme on a décomposé la caméra.

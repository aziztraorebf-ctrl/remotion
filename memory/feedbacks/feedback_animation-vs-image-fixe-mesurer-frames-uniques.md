# Ne jamais conclure « images fixes » depuis des frames espacées — mesurer le taux de frames uniques

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

⛔ **Conclure « c'est un montage d'images fixes avec pan/zoom » depuis des frames espacees est un FAUX NEGATIF de mouvement.** Vecu 2026-08-18 (analyse chaine Animistry) : j'ai affirme a Aziz que la video etait un pipeline d'images fixes montees, sur la base de 22 frames espacees de ~20s. Aziz a corrige : « c'est une video animee du debut jusqu'a la fin ». Il avait raison.

**Why** : des frames espacees de 20s ne peuvent JAMAIS prouver l'absence de mouvement — elles prouvent seulement que le cadrage a change entre deux points eloignes. C'est le meme piege que [[frame-espacee-sous-estime-mouvement]], mais applique au JUGEMENT D'UNE REFERENCE EXTERNE au lieu de notre propre rendu. Le cout ici n'est pas cosmetique : j'ai bati tout un verdict strategique (« il n'utilise pas de generation video, c'est a ta portee ») sur une prémisse fausse, et la vraie lecon methodologique (la discipline de continuite sur ~200 raccords) est passee a cote.

**How to apply** — avant toute affirmation sur la nature animee/fixe d'une video de reference :
1. **Mesurer le taux de frames uniques** : `ffmpeg -i <f.mp4> -vf "mpdecimate=hi=64*12:lo=64*5:frac=0.33" -vsync 0 -f null - -stats`. Comparer le `frame=` final au `nb_frames` de `ffprobe`. Sur Animistry : **7779/14758 = 53% de frames distinctes = animation reelle**. Une image fixe avec pan lent tombe tres en dessous.
2. **Sonder une scene ciblee a 0.4s d'intervalle** (pas 20s) sur une action precise citee par Aziz. C'est ce qui a revele le geste (bras qui monte vers le visage) et la coupe franche gros-plan→plan-large invisibles autrement.
3. **Compter les coupes ≠ comprendre le rythme** : `select='gt(scene,0.15)'` donnait 219 coupes/492s (2,2s de moyenne), mais cette moyenne ECRASE la realite — elle melange vraies coupes de montage et micro-variations. Le regime reel etait des clips de 2-5s (= duree native de sortie des modeles video). Ne pas lire une moyenne comme une description du mecanisme.

⭐ **Corollaire technique decouvert au passage (montage de clips generes)** : couper au CHANGEMENT DE CADRAGE (gros plan → plan large) cache le raccord, parce que le spectateur ne peut pas comparer deux images d'echelles differentes. C'est le levier qui rend tenable une chaine de ~200 raccords generes — et qui aurait sauve notre test canada-red-bay, ou la rupture de continuite (corde intacte → corde coupee) etait visible justement parce qu'on restait sur le meme axe. Voir `memory/tools/minimax-h3-styles-tests.md` § corollaire INTER-plans.

---

⭐⭐ **MÊME PIÈGE, APPLIQUÉ À NOTRE PROPRE LIVRABLE (2026-08-26, chaîne SVG→Lottie).** Ci-dessus il s'agissait de juger une vidéo de RÉFÉRENCE ; ici c'est notre propre production, et le coût a été plus direct.

**Vécu** : toutes mes vérifications comparaient le Lottie converti à **une image fixe** (une frame extraite de la scène Remotion). Elles annonçaient « fidèle à 1,44 % ». Or « fidèle » ne voulait dire que **« fidèle à CETTE image-là »**. Aziz a signalé « la flamme n'est pas vivante » ; mesure dans sa zone sur 40 images : **original 97,9 pixels changent par image · notre Lottie 0,0**. Elle était TOTALEMENT figée, et aucun de mes 6 cas de rendu ne pouvait le voir.

**How to apply** — dès qu'un livrable est censé BOUGER :
1. **Mesurer le MOUVEMENT, pas la ressemblance d'une frame** : rendre N images consécutives et compter les pixels qui changent d'une image à l'autre, dans la zone concernée. Un `0,0` est un verdict, pas un détail.
2. **Comparer à la VIDÉO d'origine**, jamais à une image extraite d'elle. Si la source est un composant Remotion, `npx remotion render` la vidéo de référence AVANT de conclure quoi que ce soit sur la conversion.
3. Outil maison né de cet épisode : `src/projects/_client-sim/lottie-ui/tools/check_animation.py` (hash de frames + planche de contrôle : dit si ça bouge ET montre comment).

⛔ **Corollaire — 4 occurrences en 2 jours de la MÊME signature** : *fichier valide + rapport annonçant « porté » + RIEN à l'écran*. (a) contours mangés par l'ordre de peinture des groupes ; (b) ancre de calque à [0,0] = coin de l'écran, la forme se déployait depuis le bord ; (c) keyframes à t=100 sur un calque dont la plage ip/op s'arrêtait à 60 ; (d) type `gf` absent d'un tri qui ne connaissait que `fl`/`st`. **L'élément était CORRECT à chaque fois — c'est son AIGUILLAGE qui l'annulait.** Un rapport de conversion ne prouve donc jamais un rendu : il faut RENDRE et REGARDER.

# Ne pas INVENTER la forme/le sujet/le placement d'une scène — vérifier le livrable réel

**Fusion 2026-07-11 de 2 feedbacks** (même leçon réapprise à 9 jours d'écart — preuve qu'elle n'était pas
relue activement) : `feedback_ne-pas-inventer-forme-scene-verifier-livrable` (2026-06-23, Sénégal) +
`feedback_remapping-structure-ne-pas-inventer` (2026-07-01, Cacao→Chocolat).

**Cas 1 (Sénégal, 2026-06-23)** : en faisant le bilan « ce qui reste à produire », j'ai décrit la scène 2
comme « Norvège / **Émirats** / Botswana, **data-viz comparée** » — deux inventions. C'était en réalité
Norvège / **Congo-Brazzaville** / Botswana, en **scène CARTE Mapbox** (réf V1 = `Beat10.tsx`). J'avais
rempli le tableau de tête, sans ouvrir le script ni le render V1.

**Cas 2 (Cacao→Chocolat, 2026-06-28)** : en remappant le plan d'animation de SCRIPT-V2 (6 mouvements) vers
SCRIPT-V4 (5 beats, hook fusionné), j'ai produit 3 hallucinations dans le DA-brief ("Europe grise",
"montagnes derrière le drapeau suisse", suppression du double-screen CI/Ghana pourtant décidé fermement
en V2). Deux causes : (a) quand un bloc d'animation ne tombait pas pile sur un beat après le changement de
structure, j'ai bouché le trou par invention au lieu de marquer "PAS TRANCHÉ" ; (b) je ne me suis pas demandé
si les fichiers de notes (STATUS/AVIS/V2) étaient à jour.

**Cas 3 (Soudan Acte 6, 2026-07-20)** : Aziz demande de reprendre l'overlay data "parchemin avec
pictogrammes" de la War-Map AES. Je suis parti chercher dans le **Short AES 90s** (mauvais livrable) alors
qu'il parlait de la **vidéo LONGUE** (7-8 min) — Aziz a dû corriger. Même racine que cas 1-2 : agir sur un
acquis passé (quelle vidéo ? quel composant ?) sans d'abord IDENTIFIER le livrable exact. Corollaire ajouté :
quand plusieurs versions d'un même projet existent (court/long, v1/v2, Mapbox/globe), IDENTIFIER laquelle
AVANT d'aller chercher — demander à Aziz si ambigu, ne pas deviner. (2e cas connexe même session : cartouche
B5 mal placé car composant AES  PAS relu avant de le ré-adapter — sa règle R2/R4 "fond
solide centré" existait, j'ai improvisé un fond semi-transparent en bas. Lire la doctrine d'un composant
réutilisé AVANT de le ré-adapter.)

**Cas 4 — la PALETTE (CFA beats 5a/5b, 2026-07-24)** : Aziz me demande de conseiller la palette d'une
nouvelle scène. Je recommande un fond crème en justifiant par « continuité avec le registre parchemin/GGW
déjà validé sur cet épisode (beats 1-3) ». **Faux** : les beats 1-3 RÉELLEMENT RENDUS sont en bleu nuit
`#182746` — le parchemin appartenait au *prototype* de la scène d'entrée, refait depuis. J'avais lu le
registre dans les leçons du STATUS sans extraire une seule frame des renders. Aziz a senti la fausse note
(« n'est-ce pas un contraste trop drastique ? ») avant moi. La vérification (bande de frames beats 1→5b
côte à côte) a tranché en 5 min ET révélé un 2e problème invisible autrement : l'épisode enchaînait TROIS
registres de fond, pas deux. **Nouveau réflexe : avant tout conseil de PALETTE/registre pour une scène
neuve, monter la bande chromatique des beats déjà rendus (1 frame par beat, `hstack`).** Le contraste
d'ensemble ne se juge pas scène par scène, et jamais sur la foi d'une note.

**⭐⭐ Cas 5 — PARAPHRASER un storyboard qu'on a SOUS LES YEUX (Gazoduc 4B, 2026-08-15).** Variante plus
insidieuse que les cas 1-4 : je n'ai rien inventé faute de source — **la source était ouverte devant moi**.
J'ai lu le storyboard, écrit dans mon plan « le centre de gravité se déplace » et « l'Algérie vire au
rouge », puis codé un **mouvement de caméra** et un **changement de couleur**. J'avais gardé les MOTS et
perdu le DISPOSITIF : le panneau montrait en réalité un changement de STATUT du territoire (l'Algérie
passe en bloc bleu très clair = le fournisseur établi), et une route qui se vide. Aziz : « la partie 3 est
complètement différente de ce qu'on avait dit ». Il a fallu rouvrir le storyboard, recadrer les panneaux
et les LIRE en grand pour voir ce que j'avais raté.
**Le tell** : si ma note de plan tient en une phrase abstraite (« le centre se déplace », « ça s'affaiblit »)
au lieu de nommer un dispositif concret (« le territoire change de couleur pour devenir un bloc clair »,
« la route perd ses impulsions »), j'ai déjà paraphrasé. Une phrase de plan qui pourrait décrire trois
scènes différentes n'est pas un plan, c'est un résumé.
→ **Réflexe** : avant de coder d'après un storyboard, RECADRER le panneau concerné et le regarder en grand
(`PIL crop + resize`), puis écrire le dispositif en termes de ce qui CHANGE À L'ÉCRAN (quel élément, quelle
propriété, de quoi à quoi). Jamais coder d'après le souvenir d'une planche vue en petit.

**⭐ Cas 5bis — coder des ÉTATS quand la narration décrit des INTENTIONS (même session).** Corollaire du
cas 5, trouvé au rendu suivant. La voix disait « l'objectif est exactement INVERSE », « fournisseur de
l'EUROPE », « éviter d'être CONTOURNÉE ». J'ai codé trois états successifs (bleu → bleu clair → rouge).
Aziz : « je ne vois pas comment ça a rapport avec la narration ». Trois manques, tous du même type :
l'**Europe** (le client qu'on se dispute) n'était pas à l'écran, donc « fournisseur » ne voulait rien dire ;
**contourner** est un MOUVEMENT (passer à côté de) rendu par une couleur ; l'**opposition** n'existait nulle
part. → **Réflexe** : relire la phrase narrée et souligner ses NOMS (qui/quoi est en jeu — chacun doit être
À L'ÉCRAN) et ses VERBES (contourner, protéger, devenir — chacun doit être un GESTE, pas un état). Un état
constate ; seul un geste raconte.

**Why** : confabuler la forme/le sujet/le placement d'une scène = pire que dire « je ne sais pas », parce
que ça se grave dans une note d'assemblage/DA-brief et oriente faussement toute la session suivante. Cas
d'école de la règle « vérification avant affirmation » (CLAUDE.md, cas 4 : verdict/forme) appliquée à la
PLANIFICATION, pas seulement à l'exécution.

**How to apply** :
- Avant d'écrire la forme d'une scène (carte Mapbox vs Remotion vs data-viz), son sujet, ou le placement
  d'un bloc dans une note d'assemblage/roadmap/DA-brief : **VÉRIFIER le réel** = lire le texte exact dans
  le script/alignment audio + extraire 1 frame du render V1 correspondant (`ffmpeg -ss N -i beatX-FINAL.mp4
  -frames:v 1 f.jpg`) + lire l'en-tête du beat.
- Un changement de STRUCTURE de script (réorganisation des beats) ne change PAS l'intention visuelle — il
  déplace des blocs. Garder le plan visuel d'origine INTACT, le recaler sur le nouveau découpage.
- Si une décision de forme/placement a déjà été prise, la traiter comme un FAIT à retrouver, pas à
  redéduire. Si un bloc ne tombe pas pile après un remapping et que le placement n'est pas évident : écrire
  "PAS TRANCHÉ" + poser la question, jamais inventer.
- Avant de s'appuyer sur un fichier de notes pour AGIR : vérifier sa fraîcheur (date, version la plus
  récente) OU, si une autre instance a fait le travail, lui demander directement la source de vérité.
- Marquer explicitement dans la note ce qui est VÉRIFIÉ vs SUPPOSÉ. Ne jamais présenter une supposition
  comme un fait.

Lié à [[CONTINUITE-SCENE-INTENTION-DABORD]] (la forme se DÉDUIT de l'intention + se vérifie dans
l'existant, jamais ne s'invente) et à [[feedback_relire-lecon-avant-geste-similaire]] (cette fusion existe
précisément parce que la leçon du cas 1 n'a pas été relue avant le cas 2).

# ⛔⛔ Une animation sans RECIT est une demo vide — le storytelling avant la technique

> Enonce par Aziz le **2026-08-30**, en comparant notre `repro-onboarding` a l'original du studio.
> ⭐⭐⭐ Vaut pour TOUT ce qu'on produit : videos de chaine, pieces de portfolio, livrables client.

## Ce qu'Aziz a dit (reformule, sans le diluer)

> « Ce qui fait la force de l'original, c'est le storytelling. En moins de 5 secondes je comprends
> ce qu'ils essaient d'expliquer — sur la page 2 c'est clairement ecrit qu'il faut glisser la barre
> pour ajouter un contact. Creer l'animation est bon, on peut la peaufiner autant qu'on veut,
> rajouter les meilleures techniques. Mais si l'histoire n'est pas superieure des le depart, si on
> ne comprend pas tout de suite ou ca envoie, si ca n'envoie pas une valeur immediate — pour le
> business ou pour l'utilisateur — alors ca ne sert pas a grand-chose. »

## Le cas mesure

| | l'original | nous |
|---|---|---|
| textes vectorises | **40** (vraies phrases) | **0** |
| etapes numerotees | oui (1, 2) | non |
| comprehension en < 5 s | **oui** | **non** |
| qualite du dessin | comparable | comparable |

L'original ECRIT : « add friends » · « SYNC YOUR CONTACTS / to get better friend suggestions » ·
« turn on 'Contacts' » · « in settings, turn on 'Contacts' » · « then, re-open Sircles ».
Il dit QUOI faire, DANS QUEL ORDRE, et POURQUOI. Nous : des rectangles gris a la place des mots.

⭐ **Le design etait au niveau. C'est le RECIT qui manquait.** Une piece peut etre irreprochable
techniquement (ecart mesure a 2 %, cascades exactes, easings releves) et ne rien raconter.

## LA CAUSE RACINE — c'est mon brief qui a vide le recit

J'ai ecrit a l'agent dessinateur : « AUCUN `<text>` : tout texte est suggere par des rectangles
arrondis ». La contrainte visait un probleme TECHNIQUE (polices non embarquees, cf. l'ecart de
5,74 % mesure sur du texte natif) — mais je l'ai laissee **amputer le contenu**.

⛔⛔ **Et l'information contraire etait DEJA dans notre memoire** : `CORPUS-REFERENCE-UI.md` mesure
« **0 texte natif sur 848 calques, 66 textes VECTORISES** » et conclut que le vectorise est le
standard du metier — ce que notre chaine fait par defaut. Je disposais du fait, et j'ai quand meme
brieffe l'inverse. **Une mesure archivee qu'on n'applique pas ne vaut rien.**

## LA REGLE

1. ⭐⭐⭐ **Avant de dessiner ou d'animer quoi que ce soit, ecrire en UNE PHRASE ce que le
   spectateur doit avoir compris a la fin.** Si on ne sait pas l'ecrire, la piece n'est pas prete
   a etre produite — quel que soit son niveau d'animation.
2. **Le texte a l'ecran n'est pas de la decoration, c'est le porteur du recit.** Une interface de
   demo sans mots est un ecran de chargement.
3. ⛔ **« Pas de `<text>` » ≠ « pas de mots ».** Notre chaine VECTORISE le texte (c'est le standard
   mesure du metier). La contrainte technique porte sur la BALISE, jamais sur le CONTENU.
   Formuler desormais : « texte vectorise en paths, jamais de `<text>` natif ».
4. **Test des 5 secondes** : montrer la piece a quelqu'un qui ne sait rien du projet. S'il ne peut
   pas dire ce qu'elle raconte, le probleme n'est pas l'animation.
5. ⭐ **La valeur immediate d'abord** — pour le business ou pour l'utilisateur. Une animation qui
   n'envoie aucune valeur ne se rattrape pas par la technique.

## Lien avec le reste

- Prolonge `prouver-une-capacite-nest-pas-produire-un-livrable` : une capacite technique demontree
  n'est pas une piece qui parle.
- Prolonge `feedback_geste-sans-but-est-une-boucle-decorative` : le geste sans but au niveau du
  MOUVEMENT, cette fiche au niveau du RECIT ENTIER.
- La chaine `SUJET -> FORME -> script -> intention -> MOTEUR -> code`
  (`memory/doctrines/FORMES-NARRATIVES.md`) commence par le RECIT. Sur `repro-onboarding` je suis
  parti du MOTEUR (la mecanique de cascade) en sautant tout l'amont — l'erreur exacte que cette
  chaine existe pour empecher.

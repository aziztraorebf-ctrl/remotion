⭐⭐⭐ **Quand un modele generatif echoue a executer une consigne SPATIALE ou TEMPORELLE (mouvement de
camera, geste, trajectoire, choregraphie), le levier n'est PAS d'ecrire un meilleur prompt — c'est de
lui FOURNIR UN ARTEFACT VISUEL grossier qui montre la consigne.**

**Why** : une trajectoire est une information geometrique. La decrire en mots demande au modele de la
reconstruire ; la montrer la lui donne. Preuve mesuree 2026-08-19 (MiniMax H3) :
| consigne | decrite en mots | montree par un previs |
|---|---|---|
| mouvement de camera | **0,68/255** (fige — TOUS nos clips anterieurs) | **38-45/255** |
| geste « attraper un objet » | echec systematique, meme avec 5 etapes detaillees | reussi (centre 6,9-9,6 vs bords 0,6-1,1) |
Le previs coute ~60 lignes de Python (rectangles animes) et tourne sur GPU gratuit.

**How to apply** — 4 regles, toutes payees par un essai rate :
1. **APPAUVRIR l'artefact sur tout ce qu'il ne pilote PAS.** Un previs en couleurs saturees se fait
   COPIER (le modele dessine les blocs). En **niveaux de gris purs** : gradient min 3,4 → **8,52**.
   Meme logique pour un previs de geste : camera strictement fixe, sinon on ne sait plus ce qui pilote quoi.
2. **ZERO zone vide.** Un trou dans l'artefact (17-19 % de fond nu) = le modele n'a rien a quoi se
   raccrocher et retombe sur les blocs. Combler tout le cadre.
3. **Nommer le role de l'artefact dans le prompt** : `<Video 1> is a CAMERA PATH DIAGRAM, not an image
   to imitate` + mapper chaque bloc (« le bloc bleu est le personnage ») + `STYLE LOCK: the look comes
   ONLY from <Picture 1>`.
4. ⛔ **L'artefact pilote le QUOI, pas le QUAND.** Le modele suit la DIRECTION, pas le RYTHME : 75 % du
   mouvement precipite dans le premier quart alors que le previs demandait une progression lineaire.
   Ne pas compter sur le previs pour un tempo precis (non resolu au 2026-08-19).

⭐ **Corollaire de diagnostic** : le modele suit l'artefact FIDELEMENT, y compris ses defauts. Un bras
demande a 1,63× le buste ressort etire ; une camera qui traverse un mur dans le previs traverse le mur
au rendu. → **quand le rendu rate, suspecter l'artefact AVANT de conclure a une limite du modele**, et
le deboguer par la MESURE (zones vides, ratios anatomiques, amplitude) plutot que par des iterations de
prompt. Voir [[animation-vs-image-fixe-mesurer-frames-uniques]] et
[[petit-objet-ne-se-juge-pas-sur-frames-redimensionnees]] pour les 2 biais de mesure qui m'ont fait
conclure a tort 3× dans cette session.

**Portee** : valide sur MiniMax H3 (`ref_videos`), mais le principe vaut pour tout modele generatif ou
l'on constate 2+ echecs de la meme consigne spatiale. ⛔ Ne PAS confondre avec les regles Seedance 83/86
(« reference-to-video = echec ») : elles concernent SEEDANCE, qui ignorait les references — H3 les
exploite. Recette complete + gotchas : `memory/fiches/FICHE-CLIP-GENERE.md` (auto-injectee).

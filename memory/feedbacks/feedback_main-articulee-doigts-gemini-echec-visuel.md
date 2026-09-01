**Test** : demande a Gemini 3.1 Pro text-to-SVG de dessiner une main articulee (avant-bras -> poignet ->
paume -> 5 doigts en 2-3 phalanges chacun, hierarchie FK translate+rotate imbriquee) tenant un pilon dans
un mortier, en 3 poses (hover-open / grip / grind-press), meme convention de nommage entre les 3 poses.
Inspire par l'analyse d'un TED-Ed ("Red gold: The world's most expensive spice") ou une main tient une
coupe puis manipule un mortier-pilon en gros plan.

**Resultat structure : SUCCES**. Comme pour le corps (walk-a/walk-b, cf [[PERSONNAGE-VIVANT-INDEX]]
section "vrai test decisif"), Gemini produit spontanement un vrai rig FK imbrique meme a l'echelle de la
main : `index-distal` enfant de `index-middle` enfant de `index-proximal` enfant de `palm`, 18 joints
identiques dans les 3 poses, verifiable par grep XML. Confirme que le comportement "pense articulation"
de Gemini se generalise a un niveau de detail plus fin que le corps entier.

**Resultat visuel : ECHEC pour un usage production**. Pose 1 (hover-open, doigts ecartes/detendus, pas de
contact) est lisible et correcte. Poses 2 et 3 (grip et grind-press, doigts REPLIES en prise autour d'un
objet) sont visuellement confuses : chevauchement des phalanges, silhouette de la main qui ne se lit plus
comme "4 doigts + pouce autour d'un pilon" mais comme un amas de capsules. Nettement en dessous du niveau
du corps (StickRig) et tres en dessous de la reference TED-Ed qui a inspire le test.

**Pourquoi (hypothese, coherente avec le reste du fichier PERSONNAGE-VIVANT-INDEX)** : Gemini genere les
angles sans verification spatiale du resultat final. Un bras/jambe = 2-3 segments espaces, la collision est
rare. Une main en prise = ~15 segments courts dans un espace tres reduit qui DOIVENT s'imbriquer sans se
chevaucher visuellement = probleme geometrique de composition dense, pas juste un probleme d'articulation.
La contrainte "phalange = segment qui pivote proprement autour de son joint parent" (deja resolue) ne
suffit pas a garantir "les 5 doigts replies ne se croisent pas a l'oeil".

**Conclusion operationnelle** :
- Doigts individuellement articules en gros plan (prise fermee autour d'un objet) = PAS viable en 1 jet,
  meme chez Gemini (le seul modele qui reussit le rig FK du corps). Ne pas retenter tel quel sans changer
  d'approche (ex: multi-pass avec correction manuelle des collisions, ou plusieurs tentatives filtrees).
- En revanche, la vraie reference TED-Ed (verifiee par extraction de frames de la video source) montre une
  main-BLOC simple tenant un objet (pas de doigts individualises visibles a l'ecran) - le meme niveau de
  fidelite que notre `objectHandling.ts` actuel (main = point d'ancrage unique, objet colle dessus). Donc
  le vrai besoin de production est probablement DEJA couvert, pas besoin du rig a 15 phalanges.
- Piste de repli si un projet demande ce geste (mortier-pilon, verser, presser) : silhouette de main
  simplifiee a 2-3 formes (paume + doigts groupes en 1 masse, PAS 5 doigts separes) - meme logique que le
  TORSE-POLYGONE qui a remplace la ligne simple pour le corps. Pas encore teste.

Fichiers test (scratch session, non conserves dans le repo) : prompt + JSON brut + 3 SVG + 3 PNG rendus
dans le scratchpad de la session 2026-08-02 (a regenerer si repris, cf script `test-main-articulee.py`
temporaire).

Voir aussi [[PERSONNAGE-VIVANT-INDEX]] section "Segments VOLUMETRIQUES" et section "vrai test decisif" pour
le contexte du succes de Gemini sur le corps entier, qui a motive ce test a l'echelle de la main.

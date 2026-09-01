Session R&D stick figure (2026-07-26/27). Trois agents lances en parallele ont produit 3 planches du
meme personnage. **Aucun n'a importe de code commun : tous ont RECOPIE** les constantes du squelette.
Deux bugs distincts en sont sortis, meme cause racine.

## Symptome 1 — la derive silencieuse (copie au lieu d'import)
Aziz, en visionnant une planche tardive : « les personnages semblent **marcher plus lentement, moins
naturellement**. Le mouvement des bras n'est pas tout a fait ce qu'il faudrait, les genoux, les coudes...
ce n'est pas ce que nous avions fait auparavant. **Je trouve cela un peu etrange.** »
Verification : **zero import** entre les fichiers. Les constantes etaient bonnes (recopiees juste), mais
tout ce qui n'est pas une constante — balancement des bras, coordination, cadences — avait ete
**reecrit de memoire**. Une reconstitution, pas la brique validee.
⚠️ **Rien ne l'attrapait** : `tsc` passe, le rendu est joli, aucun test n'echoue. Seul l'oeil d'Aziz,
qui avait vu la version d'origine, a senti l'ecart.

## Symptome 2 — les conventions internes divergentes
Les 3 fichiers n'avaient pas la meme convention d'angle (l'un : 0 = bras qui pend · l'autre : 180 = bras
vers le haut). Copier une valeur d'angle d'un fichier a l'autre — geste banal quand on reutilise un
pattern deja valide — a place les mains **28px au-dessus de l'epaule** : deux « oreilles de lapin »
verticales. Pas une erreur de logique : un defaut de CONTRAT implicite non documente.

**Why** : la parallelisation d'agents optimise la vitesse de production et **degrade la coherence** —
c'est un arbitrage, pas un repas gratuit. Chaque agent optimise localement son fichier, personne ne
tient la coherence globale. Et le cout ne se paie pas a la livraison (tout marche) mais **plus tard**,
quand on veut reutiliser ou faire evoluer les briques.

**How to apply** :
1. **Extraire le socle AVANT de paralleliser**, pas apres. Un composant partage IMPORTE par tous les
   agents. Ici il a fallu l'extraire en fin de session, une fois la derive constatee.
2. Si on doit quand meme paralleliser sans socle (prototypage rapide, formes pas encore stabilisees) :
   **l'assumer explicitement comme une dette** et le dire a Aziz, plutot que de le decouvrir a l'oeil.
3. **Rendre les pieges impossibles plutot que documentes** : dans le socle extrait, la fonction de
   deplacement exige un parametre `scale` SANS valeur par defaut — le compilateur refuse qu'on l'oublie
   (bug vecu : personnage qui marche sur place parce que le scale du `<g>` n'etait pas reporte).
4. **Documenter la convention en tete de fichier**, en gros, avec l'avertissement que les fichiers
   freres peuvent differer. Verifier la convention AVANT tout copier-coller de valeur entre fichiers.
5. **Ne pas recabler retroactivement** ce qui est deja valide et archive : decision d'Aziz sur ce
   chantier — le risque de casser du valide pour un benefice invisible a l'ecran n'en vaut pas la peine.
   Le socle s'applique au NOUVEAU code.

Lie : [[autocritique-agent-signal-pas-verdict]] (l'autre facon dont un rapport d'agent induit en erreur) ·
[[rapport-agent-texte-pas-preuve-verifier-disque]] (la completude, pas la coherence).

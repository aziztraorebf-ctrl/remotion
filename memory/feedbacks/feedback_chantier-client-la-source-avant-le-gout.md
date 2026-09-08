---
name: chantier-client-la-source-avant-le-gout
description: "Sur un chantier client, une decision esthetique sans SOURCE nommee est une decision non fondee — vaut pour le gout d'Aziz comme pour celui de Claude"
metadata:
  type: feedback
---

Sur un chantier CLIENT, toute decision esthetique (couleur, placement, matiere, timing,
intensite, cadrage) se rattache a une **SOURCE** avant d'etre executee. Trois sources
possibles, et une seule est implicite aujourd'hui — la mauvaise.

| Source | Statut | Ce qu'on en fait |
|---|---|---|
| Une ligne du brief / une reference FOURNIE par le client | **fait autorite** | on execute |
| Un choix libre (le brief ne dit rien) | **legitime, mais a DECLARER** | on execute en le nommant comme libre |
| Notre gout, contre le brief | **ne s'execute pas en silence** | l'ecart se nomme et s'arbitre |

⛔ **La regle ne dit PAS « le gout d'Aziz passe apres le client ».** Elle dit qu'une decision
esthetique sans source nommee n'est pas fondee — **et Claude en prend en permanence** (choix de
couleurs, de placements, de dosages) sans citer de source. Le glissement est au moins autant le
mien que le sien.

**Why** : sur la chaine YouTube, le gout d'Aziz EST la spec — c'est sa chaine, il n'y a pas
d'autre autorite, et c'est ce qui fait la qualite du travail. Sur un chantier client (bascule
recente, ~fin aout 2026), cette autorite se deplace : le brief et la reference cliente passent
devant. Le reflexe se transporte automatiquement d'un contexte a l'autre, et il coute.
3 cas mesures sur le chill-meter :
- **La brume** : reference choisie par nous (saturation 0,000, gris pur) vs reference de la
  cliente (0,572, franchement bleue), sur disque depuis le 30/08. Methode impeccable appliquee
  a la mauvaise cible → resultat **rigoureusement faux**, et notre version de DEPART etait plus
  proche de sa cible que tout ce qu'on a produit apres. → [[calibrer-sur-la-reference-du-client-pas-celle-quon-choisit]]
- **L'allumage** : luminance mesuree 65,3 chez elle vs 33,8 chez nous. Le notre etait plus beau
  a nos yeux ; il etait faux contractuellement.
- **Le chantier 3D** : une session entiere partie sur du realisme volumetrique que **sa revision
  ne demandait nulle part** (« I do like the overall direction and structure » + 6 points precis,
  aucun sur la matiere photographique). C'etait NOTRE exigence, glissee dedans sans decision.

⭐ **La vraie difficulte n'est pas de hierarchiser — c'est de DISTINGUER.** Quand Aziz ecrit
« le givre devrait etre plus discret », rien dans la phrase ne dit si c'est son oeil ou la
demande de la cliente. Ce n'est pas a lui de le preciser a chaque fois.

**How to apply** :
1. ⭐ **Demander la source AVANT de juger, puis aller la chercher soi-meme.** Face a une
   direction esthetique sur un chantier client : « c'est ton oeil ou c'est dans le brief ? » —
   puis ouvrir le brief et repondre. Ne pas renvoyer la question quand la reponse est sur le
   disque en 10 secondes.
2. **Ne jamais executer en silence une direction contraire au brief.** Citer la ligne
   contredite, dire le cout (aller-retour, confiance du client), attendre l'arbitrage explicite.
   Un ecart assume est legitime ; un ecart non vu ne l'est pas.
3. **Declarer ses propres choix libres comme libres.** « J'ai choisi ce bleu, le brief ne dit
   rien sur ce point » — sinon un choix arbitraire prend l'apparence d'une contrainte.
4. **Sur un chantier client, la charge de la preuve s'inverse** : ce n'est pas au brief de
   justifier qu'il s'applique, c'est a l'ecart de justifier qu'il est necessaire.
5. ⛔ **Une reference client peut arriver EN COURS de chantier.** Re-scanner le dossier client
   avant chaque nouveau chantier visuel, pas seulement au demarrage.

**Ce que ca n'est pas** : une invitation a ceder sur la qualite. Un vrai probleme dans le brief
se signale (c'est la regle « signalement proactif ») — mais il se signale AVANT, pas apres, et
il se tranche avec Aziz plutot que de se corriger unilateralement dans le rendu.

Lie a [[ecart-brief-verifier-contre-la-reference-client]] ·
[[calibrer-sur-la-reference-du-client-pas-celle-quon-choisit]] ·
[[brief-image-reprendre-tous-les-interdits-pas-seulement-le-plus-saillant]] ·
[[regle-ecrite-insuffisante-sans-gate-outille]] (pourquoi ce feedback a un hook :
`.claude/hooks/client-source-gate.sh`)

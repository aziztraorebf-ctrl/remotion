Quand un commentaire de code **justifie explicitement** un choix qui viole une règle établie, c'est le
signe que le vrai problème a été contourné localement au lieu d'être traité à la racine. Le commentaire
est honnête et à jour — c'est la **justification elle-même** qui trahit le contournement.

Vécu 2026-08-14, Gazoduc Acte 3 Beat 3. Le comparateur « 13 Mds$ » était placé en coin haut-droit avec
ce commentaire :

> « Placé en HUD coin haut-droit (jamais centre-carte) : évite la collision écran avec les JetonEtat
> […] collision constatée au mini-render avec le cadran en position centrale. »

Le raisonnement se tient localement — mais il reproduit **exactement** le défaut interdit par les trois
breakdowns du projet (« Financement/banques = dispositif SUR la carte, jamais un widget coin d'écran »),
et au rendu le texte « vs 26 Mds$ AAGP » sortait carrément du cadre. La bonne réponse au problème de
collision n'était pas de fuir vers le bord, mais d'**assombrir la carte sous le bloc** — ce que le
storyboard prévoyait déjà.

**Why:** un contournement documenté a l'air d'une décision réfléchie, donc il survit aux relectures. Il
passe les revues précisément parce qu'il s'explique. C'est ce qui lui permet de traverser plusieurs
sessions et de refaire surface comme défaut au montage final.

**How to apply:**
- En lisant du code hérité, traiter tout commentaire de la forme « placé/déplacé/désactivé **pour
  éviter** X » comme un **TODO d'audit**, pas comme une explication close. Question à poser : quelle
  règle ce choix enfreint-il, et le problème X a-t-il une vraie solution ?
- Signe caractéristique : la justification est locale (« ça se chevauchait ») alors que la règle violée
  est globale (composition, safe zones, emplacement UI). Le local ne doit jamais l'emporter.
- En écrivant du code : si je m'apprête à commenter « pour éviter… », c'est le moment de vérifier la
  doctrine avant de committer le contournement.

Distinct de [[commentaire-code-perime-bat-doctrine]] (commentaire FAUX/obsolète qui ment sur l'état du
code) : ici le commentaire dit vrai, mais il documente une dette.

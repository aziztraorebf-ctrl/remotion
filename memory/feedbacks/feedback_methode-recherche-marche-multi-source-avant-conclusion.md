Pour toute exploration stratégique de marché (freelance, concurrence, pricing, positionnement), trois réflexes se sont révélés payants et méritent d'être répétés systématiquement :

1. **Croiser plusieurs plateformes/sources avant de conclure.** Une seule plateforme donne un signal faible — ComeUp seul (marché confidentiel, ~15-100k vendeurs non vérifiables, quasi zéro avis, moins de 20 offres motion design) aurait mené à une conclusion trompeuse ("ce créneau n'existe pas"). Croiser avec Malt (profils réels, TJM documenté 400-800€/j) et Upwork (structure de poste réelle, offres d'emploi concrètes) a révélé une image beaucoup plus juste et nuancée.

2. **Distinguer explicitement recherche ACADÉMIQUE de recherche MARCHÉ COMMERCIAL.** Les papiers HCI (CHI, IEEE VIS, laboratoires type iDVx Lab) sont utiles pour le vocabulaire et la technique (ex. taxonomie de mouvements de caméra cartographique), mais ne disent rien sur le business (pricing, demande solvable, canal de vente). Les deux nourrissent des décisions différentes — ne pas les mélanger dans une même conclusion sous peine de surestimer ou sous-estimer une opportunité.

3. **Vérifier les chiffres cités avant de les affirmer comme base de décision.** TJM, taux de charges sociales, commissions de plateforme, taille de marché — tous vérifiés via recherche web plutôt qu'estimés à l'instinct (ex. charges France 25,6% sur brut vs Québec ~11,9% CPP sur net, commission Fiverr 20% quel que soit le tier). Ce comportement est déjà exigé par CLAUDE.md racine (section Confiance), mais cette session confirme sa valeur concrète appliquée à des chiffres de marché, pas seulement à de la connaissance technique.

**Why:** Aziz a explicitement apprécié ce processus de vérification factuelle répétée plutôt que des affirmations à l'instinct — signal de confirmation, pas de correction. Le risque sans cette méthode : conclure trop vite sur la base d'un seul signal (ex. "ComeUp a peu d'offres donc ce marché n'existe pas nulle part"), ou mélanger un signal académique encourageant avec une réalité commerciale qui reste à prouver.

**How to apply:** Systématique pour toute future session d'exploration stratégique similaire (positionnement freelance, étude de concurrence, décision de pricing, ciblage persona/acheteur). Voir [[freelance-dataviz-fiverr-pro]] pour l'application concrète de cette méthode sur le créneau cartographie éditoriale (session 2026-07-31).

Session origine : 2026-07-31, exploration positionnement freelance du pipeline vidéo (aucune nouvelle production ce jour-là).

## Ajout 2026-08-13 — application au ciblage persona (gig Fiverr entrée de gamme)

Point ouvert depuis la création du brief gig ("qui achète concrètement ce type de vidéo" — cité comme
"l'étape la plus actionnable" dans `memory/freelance-linkedin/README.md`) tranché en une session via
le même protocole multi-source, avec 2 réflexes supplémentaires qui ont fait la différence :

4. **Hiérarchiser les segments trouvés par FORCE de preuve, pas par volume/plausibilité.** Classement :
   témoignage direct d'achat réel (post forum où l'acheteur confirme lui-même avoir payé et pourquoi) >
   signal de volume (beaucoup d'offres vendues à ce segment, sans confirmation de satisfaction/réachat) >
   déduction logique ("ce segment a probablement besoin de ça") > hypothèse non testée. Le segment le
   plus VISIBLE sur le marché (ici : PME marketing générique, concurrence dense) n'est pas forcément le
   mieux PROUVÉ — un signal plus rare (1 post Indie Hackers d'un solo founder confirmant un achat
   organique) peut être plus fiable qu'un volume d'offres.
5. **Chercher explicitement l'angle négatif** : poser aussi "pour quel usage n'y a-t-il AUCUNE preuve ?"
   plutôt que de lister uniquement ce qui confirme. Un segment plausible sans preuve (ex. crowdfunding/
   pitch investisseur, envisagé mais jamais confirmé par la recherche) doit rester marqué "hypothèse non
   confirmée" dans la conclusion, pas glissé dans la liste au même niveau que les segments prouvés.

Résultat : décision de resserrer le LANGAGE d'une page de vente vers le segment le mieux prouvé, SANS
fermer la porte aux autres segments identifiés avec un signal plus faible (une FAQ dédiée les couvre
sans diluer le message principal) — voir `memory/freelance-linkedin/BRIEF-GIG-ENTREE-DE-GAMME.md` §
"Ciblage acheteur" et `GIG-PAGE-VALIDEE.md` révision 2026-08-12 (2) pour l'application concrète.
Outil utilisé : `mcp__tavily__tavily_research` (passe large) puis `tavily_search`/`tavily_extract`
ciblés sur forums spécialisés (Reddit, Indie Hackers) pour le signal le plus fort — voir
`memory/tools/tavily.md`.


---

## ⭐⭐ UN CORPUS ACHETÉ SE LIT POUR SES GRILLES, JAMAIS POUR SES SEUILS (2026-08-24)

FacelessOS (corpus payant, 13 fichiers) : **~85 % inutilisable** pour nous (stock footage, niches
people/crime, hypothèses de production étrangères). Seul apport réel = **la grille des 5 formes de
courbe de rétention** — une taxonomie de lecture.

⛔ **Ses SEUILS chiffrés donnent le MAUVAIS diagnostic sur 2 de nos 3 cas mesurés.** Ils viennent de
blogs d'outils SEO, pas de sources primaires YouTube.

**Règle** : dans tout corpus/formation acheté, séparer explicitement
- **(a) les GRILLES DE LECTURE** — taxonomies, formes, questions à poser → **se transposent**
- **(b) les BENCHMARKS CHIFFRÉS** — calibrés sur un autre volume, une autre niche → **jamais**

**Test d'acceptation d'un chiffre externe** : « puis-je nommer la source primaire ET le corpus
mesuré ? » Si non → c'est un ordre de grandeur, pas un seuil de décision.

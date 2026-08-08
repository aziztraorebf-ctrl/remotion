---
name: verification-independante-trou-temporel-curseur-preuve
description: Preuve fraîche de la règle CLAUDE.md "vérifier CODE + VISUEL, un agent qui rapporte terminé n'a pas forcément tout couvert" — méthode concrète (échantillonnage anti-gel + lecture code) qui a trouvé un défaut non signalé par l'agent.
metadata:
  type: feedback
---

Ne duplique pas la règle mère (déjà écrite dans `CLAUDE.md` § "Vérifier CODE + VISUEL avant d'agir
sur un livrable" et § "Un agent qui rapporte « terminé » n'a pas forcément produit le fichier") —
ce fichier n'ajoute qu'un cas de preuve avec une méthode reproductible.

Cas concret (NorthShield P6, 2026-08-08) : après une refonte du storyboard par l'agent
remotion-composer (6 correctifs, rapport "terminé" détaillé), la vérification indépendante de
l'orchestrateur (pas de confiance au seul texte du rapport) a trouvé un défaut NON rapporté :
le `VirtualCursor` nouvellement intégré en P6 disparaissait pendant ~4s entre l'intro et la
confirmation finale (le dashboard restait figé sans mouvement visible sur cette fenêtre), parce
que `cursorVisible` n'était actif que dans 2 fenêtres temporelles disjointes au lieu d'une
présence continue. Voir aussi [[verifier-tous-usages-composant-partage-bug-duplique]] (autre
défaut trouvé la même session par la même méthode).

**Méthode qui a trouvé le défaut** : (1) échantillonnage anti-gel par hash de frames à intervalle
régulier sur le render complet (pas juste 2-3 frames choisies au hasard), (2) une fois une zone
suspecte repérée (2 frames identiques à quelques secondes d'écart), creuser le CODE pour comprendre
la cause exacte plutôt que de se contenter de "ça a l'air d'avoir bougé".

**How to apply** : sur tout render mixte vidéo+SVG/React avec des éléments interactifs
(curseur, animation conditionnelle), l'échantillonnage anti-gel seul (hash de frames) suffit à
détecter l'absence de mouvement — mais SEULE la lecture du code explique pourquoi, et permet de
juger si c'est un vrai bug ou un choix de timing acceptable.

Après 2+ tentatives de mise en scène rejetées sur un même chantier (signal que Claude seul tourne en
rond sur les mêmes idées), lancer 2 agents `creative-director` en parallèle avec :
- le MÊME brief exact (script complet + historique des tentatives rejetées + contraintes techniques
  dures)
- AUCUNE suggestion d'angle/direction de la part de l'orchestrateur
- chaque agent ignorant totalement la proposition de l'autre (pas de contexte partagé entre eux)

**Pourquoi** : validé explicitement par Aziz en session 2026-07-07 (Short War-Map Sahel, reprise après
4 rejets). Résultat concret : Agent A ("La Table des Trois Frontières" — carte-parchemin géographique
réelle, chaque fait a un lieu précis) et Agent B ("L'Acte qui s'écrit" — emblèmes fixes, réutilisation
maximale de composants déjà validés) ont produit 2 directions COMPLÉMENTAIRES et non-redondantes,
chacune résolvant un angle mort différent (l'une la lisibilité géographique, l'autre la réduction du
risque créatif). Aucun des deux n'a halluciné les contraintes du projet — les deux ont correctement
exploré le codebase existant avant de proposer, identifiant indépendamment les mêmes composants
réutilisables (LiptakoRevealSVG/ResourcesRevealSVG).

Aziz confirme avoir déjà testé cette méthode par le passé et la valide de nouveau — à refaire
systématiquement pour tout chantier créatif bloqué après plusieurs rejets, avant de retrancher sur une
seule direction imposée par l'orchestrateur seul.

**Comment appliquer** :
- Après 2+ rejets sur la même direction créative.
- Toujours AVANT tout code — les agents produisent des propositions (texte/storyboard), jamais
  directement du code de production.
- Toujours suivi d'un arbitrage explicite par Aziz (question de goût), pas par Claude seul.

Confirme et étend [[feedback_methode-storyboard-orchestration-guider]] (⭐⭐ DÉLÉGUER à agent frais) déjà
en mémoire — ce feedback documente spécifiquement la variante "2 agents en parallèle, zéro suggestion
d'angle" comme pattern à part entière, pas juste "déléguer à un agent" en général.

**2e confirmation (2026-07-15, Short Sénégal Pétrole & Gaz D3, Beat 2 "Paradoxe")** : chantier bloqué
après plusieurs rejets consécutifs sur la mise en scène d'un beat (icônes de gisements peu lisibles,
transition de couleur ratée, symbole de "mécanisme" jugé arbitraire). Les 2 agents ont convergé
INDÉPENDAMMENT sur 3 diagnostics/solutions sans se concerter : la cause d'un artefact visuel de
transition, un pattern de mise en page pour la lisibilité (icônes déportées + ligne de rappel vers une
étiquette), et une façon de représenter un pourcentage directement sur la géométrie plutôt que via un
widget séparé. Signal fort de fiabilité — une convergence non concertée sur un diagnostic technique vaut
plus qu'un seul agent qui propose une solution isolée. En prime, un des deux agents a vérifié le code et
découvert un asset déjà généré et validé mais jamais branché, permettant de remplacer un élément improvisé
par quelque chose de déjà approuvé — preuve que la lecture de code réelle (pas la supposition) par l'agent
indépendant peut débloquer une contrainte que l'orchestrateur avait manquée.

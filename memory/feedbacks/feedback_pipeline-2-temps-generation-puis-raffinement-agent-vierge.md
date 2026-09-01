Pour générer plusieurs éléments SVG (jetons, véhicules, icônes) à un niveau de qualité premium, ne pas
chercher le résultat final en un seul appel à un modèle unique, même en ré-itérant le prompt en boucle.

**Le pattern qui marche** : GLM-5.2 (ou tout modèle low-cost rapide) produit un premier jet — respecte déjà
bien les contraintes techniques dures (dimensions, palette, format JSON valide) mais reste géométriquement
simple. PUIS un agent Claude (Sonnet, contexte vierge, 1 agent par élément, lancés en parallèle) reprend ce
SVG brut et l'enrichit — sans repartir de zéro, en gardant les contraintes déjà respectées, en s'inspirant de
vraies références du type d'objet réel pour ajouter le détail structurel qui manque.

**Why** : confirmé 2026-07-05 (Soudan, inserts tactiques — bâtiments-cibles SVG). Aziz : "plutôt que de
re-prompter GLM en boucle" — proposé explicitement comme alternative à l'itération sur un seul modèle. Le
raffinement par agent frais a produit un gain net et objectivement visible (aéroport passant de "piste +
1 rectangle" à "piste + taxiway + bretelles + tarmac + avions en épi + terminal + tour de contrôle").

**Piège corollaire découvert dans la même session** : donner à l'agent de raffinement le SVG existant comme
"squelette à enrichir" peut le BRIDER involontairement — il reste ancré sur la géométrie de départ au lieu de
vraiment recomposer. Sur une forme à vocabulaire universel (aéroport = piste), ce n'est pas un problème. Sur
une forme complexe sans référence canonique (palais présidentiel, tour TV), ça produit un résultat encore
timide. Voir `[[feedback_artefact-llm-verifier-sous-contrainte-dynamique]]` (cas 2026-07-05) pour la suite :
sur ces formes complexes, même une consigne "décris l'architecture d'abord, librement" avant de coder ne
suffit pas toujours — un LLM texte-only qui compose en coordonnées sans jamais voir le rendu reste limité sur
le DOSAGE visuel. Le pipeline GLM→agent Sonnet reste valide pour les éléments à vocabulaire simple/universel ;
pour les formes complexes uniques, la session a fini par trancher pour Gemini image-gen + traitement
d'intégration plutôt que du SVG — voir `memory/tools/openrouter-svg.md` (repo workspace) pour le détail.

**How to apply** : face à un besoin de N éléments SVG similaires (jetons, icônes, pictogrammes), lancer un
premier jet en lot via un modèle low-cost (GLM-5.2 confirmé bon candidat), PUIS systématiquement dispatcher un
agent Sonnet par élément à raffiner en parallèle plutôt que de re-prompter le modèle low-cost en boucle sur le
même élément. Réserver ce pipeline aux éléments à vocabulaire géométrique reconnaissable ; pour un objet
complexe unique sans forme canonique, envisager directement une génération image (Gemini) + traitement
d'intégration plutôt que du SVG pur.

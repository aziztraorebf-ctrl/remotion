# Tests client-sim (SaaS et hors-Souverain) — INDEX

> Porte d'entrée dédiée aux tests "client simulé" — exercices de positionnement freelance visant
> des marchés HORS Souverain (SaaS, produits tech, autres verticales). Isolé volontairement de
> `MEMORY.md` (qui reste concentré sur le sujet principal : YouTube/Souverain) — ce dossier n'est
> PAS chargé automatiquement en début de session, seulement consulté quand on travaille
> explicitement sur un test client-sim. `MEMORY.md` ne garde qu'un pointeur d'une ligne vers ce
> fichier.
>
> Décision Aziz (2026-08-06) : garder cette distinction stricte pour ne pas diluer la mémoire
> principale avec des sujets secondaires, même bien référencés.

## Tests réalisés

- ⭐⭐⭐ **Flowdesk (SaaS fictif, centralisation de demandes internes) — CLOS 2026-08-06.**
  Conclusions stratégiques (pipeline SaaS V1 formalisé, Direction A/B, règle
  draw-on/mouvement/vie, structure CONCRET→ABSTRAIT→CONCRET) :
  [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md).
  Détail technique (code, bugs, timings, historique V1→V4) :
  [STATUS](../episodes/_client-sim/flowdesk/STATUS.md).
  Code : `src/projects/_client-sim/flowdesk/`.

## Test en préparation (PAS démarré)

- ⭐ **NorthShield / "Noteshield" (SaaS cybersécurité, scoring de risque de connexion) —
  BRIEF SAUVEGARDÉ 2026-08-06, à démarrer prochaine session.** Objectif : tester
  HUMAN + SYSTEM + PRODUCT (Flowdesk n'avait testé que HUMAN + SYSTEM) — chaîne situation
  humaine → mécanisme invisible rendu visible → preuve dans une VRAIE interface produit fictive
  → conséquence utilisateur. Domaine plus exigeant : représenter l'invisible/probabiliste sans
  les clichés du genre (garde-fou explicite : pas de hoodie, Matrix, cadenas géant, bouclier,
  pluie de 0/1). Brief client complet + méthode détaillée :
  [BRIEF-CLIENT](noteshield/BRIEF-CLIENT.md).

## Méthode standard pour tout nouveau test client-sim

Issue du débrief Flowdesk (voir [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md)
pour le détail complet), affinée pour NorthShield (voir [BRIEF-CLIENT](noteshield/BRIEF-CLIENT.md)) :

1. **Direction A (Human/Narrative) + Direction B (System/Conceptual)** en parallèle — PAS un
   choix binaire, PAS figé en "toujours personnage vs toujours abstrait" (A peut être un objet
   concret non-humain : colis, facture, transaction...). **Ne jamais dicter la métaphore aux
   modèles** — brief l'INTENTION (ex: "rendre visible le mécanisme de décision"), jamais la
   forme visuelle elle-même (ex: ne pas dire "checkpoint"/"constellation"/"balance").
2. **Grille par panneau (ajout NorthShield)** : pour chaque panneau, répondre à INFORMATION
   (qu'est-ce que ça doit faire comprendre ?) / REPRÉSENTATION (pourquoi ce choix plutôt qu'un
   autre ?) / MEDIUM (SVG/illustration/vidéo/UI/typo/autre ?) / SEMANTIC TEST (que comprend-on
   en 5s sans narration ?) — évite de refaire une direction faible comme Flowdesk 2B seule.
3. **Semantic Test** avant toute animation coûteuse : que comprend-on de chaque storyboard sans
   narration ?
4. **Mix & Match** scène par scène plutôt qu'un registre unique sur toute la durée.
5. Si l'abstraction (Direction B) est utilisée seule à un moment : s'assurer qu'elle est
   **ancrée par du concret avant/après** (structure CONCRET→ABSTRAIT→CONCRET) — l'abstraction
   non ancrée est le piège qui avait fait rejeter la 1ère passe Flowdesk (V1/V2).
6. Règle à 3 voies pour le comportement graphique : **Structure = draw-on** (stroke-dasharray) ·
   **Information = apparition/mouvement** · **Humain = vidéo/mouvement organique**.
7. **Chaîne à tester si le brief inclut un vrai produit (ajout NorthShield)** : HUMAN → SYSTEM
   (mécanisme invisible) → PRODUCT (preuve dans une vraie UI, même fictive) → conséquence
   utilisateur. Va au-delà de ce que Flowdesk a testé (HUMAN + SYSTEM seulement).
8. **Horizontal d'abord, vertical en tout dernier** (contrainte de séquencement globale, pas
   juste un test) : ne jamais mener 16:9 et 9:16 en parallèle — le recadrage vertical premium
   est une offre à tester APRÈS validation complète du 16:9, jamais avant/en même temps.
9. Pipeline complet formalisé dans [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md)
   § "Pipeline SaaS V1".

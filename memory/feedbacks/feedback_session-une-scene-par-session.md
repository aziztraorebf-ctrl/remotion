# Règles de session Atlas — Une scène par session

> Migré depuis auto-memory 2026-08-31 (validées 2026-05-05, épisode Hannibal désormais archivé).
> Méthode de travail réutilisable au-delà d'Atlas — gestion de charge cognitive de session.

## Règle

**Une session = un beat maximum.** Jamais mélanger production + audit + refactoring dans la même session.

### Les 4 règles de session Atlas (validées 2026-05-05)

**1. Une session = un beat**
Pas de "on finit le beat et on commence l'audit _shared/". Fermer proprement, committer, documenter, ouvrir une nouvelle session fraîche pour le suivant. Une session qui s'alourdit = contexte dégradé = plus d'erreurs.

**2. Catalogue de composants en premier, avant tout fichier de code**
Lire le catalogue (ex: `COMPOSANTS-INDEX.md`) AVANT d'ouvrir un `.tsx`. Si un helper existe déjà → l'importer. Ne jamais le réécrire. Ce réflexe seul économise 3-5 itérations par beat.

**3. Screenshot dès la première itération ratée**
Si v1 ne donne pas le bon résultat visuel, demander une capture d'écran annotée à Aziz avant v2. En mots = 4 itérations perdues (v1→v5 Beat 1 Hannibal). En capture = 1 itération.

**4. Mini-plan 5 lignes avant de coder (beats complexes)**
Pour un beat complexe (traversée, grille d'objets, etc.), 5 minutes avant de coder pour lister :
- Quels composants `_shared/` utiliser
- Quels assets générer
- Quel pattern caméra appliquer

Évite 30 minutes de correction après coup.

## Pourquoi cette session a été lourde (cas Hannibal Beat 1, 2026-05-05)

Beat 1 Hannibal = R&D pur sur 3 fronts simultanés :
1. Premier beat avec architecture 2 couches sur vrais POI géographiques bord canvas (10 itérations pour trouver le pattern, cf `memory/episodes/hannibal/BEAT-1-COMPLETE.md`)
2. Audit complet `_shared/` + extraction des helpers (travail de fond, pas de production)
3. Tout dans la même session → contexte surchargé

**C'est normal pour un premier beat qui établit le standard.** Les beats suivants sont plus rapides une fois le pattern documenté et extrait.

**Why:** Session Beat 1 Hannibal 2026-05-05 a duré trop longtemps à cause de 3 types de travail mélangés.
**How to apply:** Avant chaque session, définir exactement UN objectif. Si on finit tôt, committer et s'arrêter plutôt que d'enchaîner.

---

## Leçons supplémentaires — session Beat 2 Hannibal (2026-05-05)

**5. Appliquer les règles mémoire AVANT d'explorer**
Une règle (ex: "action-géo vs lieu-géo → traversée de fleuve = insert, pas carte SVG") était déjà documentée depuis Beat 1. Ne pas la relire en début de session a coûté 30-40 min d'exploration inutile. Réflexe obligatoire : lire l'index mémoire + fichiers feedback pertinents AVANT de proposer une approche.

**6. Couper une approche qui échoue plus tôt**
Deux tentatives d'une même approche (r2v Seedance sur sprites PixelLab) avant abandon. Le signal d'échec (sprites pas conçus pour animation Seedance) était visible dès le test 1. Règle : si le test 1 échoue sur un critère STRUCTUREL (pas juste un prompt mal rédigé), changer d'approche immédiatement.

**7. Intégration Remotion = plan avant code**
Avant de toucher un .tsx existant avec un clip vidéo : lister quels sprites doivent disparaître pendant la fenêtre vidéo, quels overlays UI restent visibles. 5 minutes de plan évite le bug doublon sprites/clip.

**8. Les agents tournent à vide sur fichiers périmés**
Un agent visual-producer a analysé une image V1 ratée au lieu de la V2. Toujours vérifier que l'agent travaille sur le bon fichier avant de lire son analyse.

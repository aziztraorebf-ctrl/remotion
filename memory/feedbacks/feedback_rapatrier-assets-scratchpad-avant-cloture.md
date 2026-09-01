# Rapatrier tout asset produit en scratchpad avant de clôturer une session

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Tout asset produit pendant une session dans le scratchpad (dossier temporaire, non versionné, purgé entre
sessions) doit être rapatrié vers un emplacement permanent du repo AVANT de considérer la session close —
pas seulement documenté en mémoire, réellement copié dans un dossier du projet.

**Why** : Aziz, 2026-07-05, en fin de session R&D Soudan (inserts tactiques) : demande explicite de
s'assurer que tout est "au bon endroit et bien référencé, comme ça la prochaine session n'a pas besoin de se
demander où aller chercher les véhicules ou les différents objets". Une session R&D longue avait généré de
nombreux SVG/JSON/images/scripts uniquement dans le scratchpad — sans ce rapatriement explicite, la session
suivante aurait dû soit régénérer les assets (coût, appels API refaits inutilement), soit fouiller des
artifacts/liens catbox pour retrouver le contenu exact.

**How to apply** : en fin de session (avant ou pendant `/wrap`/`/session-close`), pour toute session ayant
produit des assets réutilisables (SVG, images générées, scripts de traitement) :
1. Identifier les livrables réellement utiles à la suite (pas les itérations jetables/comparatifs de test).
2. Les copier vers un emplacement permanent cohérent avec les conventions du repo (`src/projects/_shared/svg-library/elements/<catégorie>/` pour du SVG, `public/_shared/sprites/<projet>/` pour des images, `scripts/tools/` pour des scripts réutilisables).
3. Mettre à jour le starter/STATUS du projet avec les CHEMINS EXACTS (pas des liens catbox/scratchpad) vers ces fichiers.
4. Vérifier que chaque chemin cité existe réellement (`ls` un par un) avant de clore — un chemin qui semble juste mais n'existe pas est pire qu'une absence de référence.

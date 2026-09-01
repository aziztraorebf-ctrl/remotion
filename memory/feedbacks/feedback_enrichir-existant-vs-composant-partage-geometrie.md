Avant de remplacer un élément déjà validé (carte, scène SVG, composant) par un composant partagé existant
ailleurs dans le projet, vérifier que ses coordonnées/géométrie de base COÏNCIDENT exactement avec ce qui
est remplacé — pas seulement que le résultat visuel semble « dans le même registre ». Si les coordonnées
diffèrent, ce n'est pas une réutilisation, c'est un import de système externe déguisé en raccourci.

**Why:** Sur l'Acte 4 Soudan (Beat 2, 2026-07-12), la mer d'une scène SVG déjà validée par Aziz (paths
inline, coordonnées Y=520+) a été remplacée par le composant partagé `OceanProfondeurVagues` (coordonnées
Y=720 en dur), dans le but de « vivifier l'océan » suite à un retour Kimi. Le remplacement semblait un
raccourci logique (réutiliser un composant déjà prouvé sur `CargoVoyage16x9_LibreInspire`) mais le
décalage géométrique de 200px a cassé le raccord visuel port/mer. Résultat : plusieurs rounds de
rafistolage par rectangles de raccord successifs, sans jamais retrouver la qualité déjà validée — Aziz a
lui-même diagnostiqué le problème depuis le rendu (« on dirait que le graphique du navire sert de base au
port »), et a demandé explicitement de revenir à la scène validée plutôt que de continuer à corriger.
Retour à la géométrie d'origine intacte + enrichissement IN PLACE (couches de vagues supplémentaires
ajoutées PAR-DESSUS, sans toucher la géométrie de base) a résolu le problème en un seul coup et retrouvé
immédiatement la qualité validée — plus rapide que la tentative de réutilisation qui avait pourtant
semblé plus économique au départ.

**How to apply:** Quand une amélioration est demandée sur un élément déjà validé (carte, océan, scène),
préférer par défaut : (1) garder la géométrie/les coordonnées existantes intactes, (2) ajouter les
couches/détails supplémentaires PAR-DESSUS en boucle explicite (offset modulo, pas une simple translation
de bloc statique), plutôt que d'importer un composant partagé qui semble couvrir le même besoin. Le seul
cas où réutiliser un composant partagé est légitime : quand on construit une scène NEUVE dès le départ (pas
un enrichissement d'un élément déjà validé) — voir [[chercher-outil-existant-avant-improviser]] pour ce
cas complémentaire (chercher l'existant AVANT d'écrire, pas pendant une correction sur un élément déjà
approuvé). Ces deux règles ne se contredisent pas : la première s'applique à la CRÉATION, celle-ci
s'applique à la CORRECTION d'un élément déjà validé.

Lien croisé : cas voisin mais distinct dans `key-learnings.md` (2026-07-04, composant Mapbox canonique) —
là il fallait chercher un pattern partagé existant AVANT d'écrire un composant ; ici il ne fallait PAS
l'importer parce que sa géométrie ne correspondait pas à un élément déjà validé.

# Leçons reconstruction Acte 1 War-Map Sahel (session 2026-06-07/08)

> Essais-erreurs qui ont mené à des résultats concluants. À RÉUTILISER pour Acte 2 + autres War-Map Long.
> Évite de refaire les mêmes détours.

## MÉTHODE QUI A MARCHÉ (à reproduire pour Acte 2)
1. **Lire les reviews diagnostiques EN ENTIER** avant de coder (pas juste la synthèse).
2. **Test 10s itératif** (A->B->B2->B3) pour valider UN socle de mécaniques AVANT de reconstruire tout.
   Chaque correction isolée et PROUVÉE par render, pas supposée. Composition de test dédiée + props off-par-défaut.
3. **Ordre de construction Gemini** : caméra seule -> data en cut -> easings -> chrome. Évite le moonwalk
   (jamais coder un élément mobile avant la caméra validée).
4. **DA-BRIEF-GATE sur une ZONE temporelle** (pas juste un acte) débloque une section qui "sonne vide".
   Inclure la NARRATION RÉELLE (forced-alignment) beat par beat dans le brief.
5. **Aziz challenge les verdicts modèles** → toujours vérifier (Gemini/Kimi = signal jamais juge).
   Ex : "jamais de translation jeton" était FAUX (réfuté par Aziz, les jetons réfugiés bougent et marchent).

## ERREURS À NE PAS REFAIRE
1. **VÉHICULES-SPRITES en format LONG 16:9 dézoomé = échelle absurde** (toujours trop petit ou trop gros).
   On a oscillé longtemps sans trouver le bon réglage car il n'existe PAS (problème structurel).
   → Format long = JETONS (abstraction circulaire lisible à toute échelle). Voir DECISION-jetons-vs-vehicules.md.
2. **Juger la netteté sur un render scale 0.4-0.5** → tout paraît flou, on doute du design À TORT.
   Aziz a cru les jetons "flous/moches" = c'était juste le scale. → Toujours full HD scale=1 pour juger la netteté.
3. **Bug igniteOp** : le paint de la couche fill utilisait la prop BRUTE (`sequentialIgnite`=null en acte1Final)
   au lieu de la valeur dérivée (`effSeqIgnite`) → allumage séquentiel cassé (tout allumé dès f0).
   → Quand on dérive des props (acte1Final -> eff*), vérifier que TOUS les usages (init ET render) utilisent eff*.
4. **Trou narratif** : entre le freeze (24s) et le 1er élément (40s), ~16s de carte vide = spectateur décroche.
   → Combler par "le temps qui passe" (graines pulsantes + dégradation État) AVANT que la voix nomme les acteurs.
5. **Muddy overlap** : 2 taches d'influence semi-transparentes qui se superposent = bouillie brune au centre.
   → Clipper chaque tache à sa moitié (clipPath au front) + ligne de front beige nette.
6. **UI parasite** : la barre événement bas ("2e coup au Mali") = confusante + raconte une autre histoire que
   la voix de l'Acte. → Virée en acte1Final. Garder seulement légende (haut-gauche) + date (haut-droite).
7. **Tampons centrés opaques géants** cachent la zone. **Tampons exilés dans un coin** = on les rate.
   → Tampons CENTRE-HAUT compacts + semi-transparents (le centre marche, c'est l'opacité/taille qui posait pb).

## PATTERNS CONCLUANTS RÉUTILISABLES (War-Map Long)
- **Allumage séquentiel** par pays (fusion Turf union par pays + igniteOp data-driven fill-opacity).
- **Fusion territoriale Turf** : dissout les micro-régions admin-1 en grandes masses par faction (anti-mosaïque).
- **Vignettage géo** : sépia sombre sur hors-AES via masque silhouette reprojetée = "contraste par le calme".
- **Jetons-combattants** : cercle parchemin + bordure faction + silhouette hachurée + respiration sin + onde spawn.
  Se déploient/avancent/reculent (mouvement = récit). Différenciés par PERSONNAGE (pas juste bordure).
- **Taches d'influence** : blobs SVG (organic/angular) qui grandissent avec les acteurs, clippées au front.
- **Graines** : points pulsants aux futures positions = "le temps qui passe / les groupes se développent".
- **CEDEAO fissure** : anneau stroke-dasharray dont les gaps s'allongent = lien qui se rompt (pas clignote).
- **Caméra** : drift continu + zoom tactique (push sur le foyer) + recentrages sur événements. JAMAIS statique 15s.

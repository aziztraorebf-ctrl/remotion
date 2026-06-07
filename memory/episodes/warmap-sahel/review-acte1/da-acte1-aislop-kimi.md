 === QUESTION 1 — AI-SLOP / MANQUE DE SAVOIR-FAIRE ===

**1. La palette "bureau de comptable" et l'absence totale de grading**
*   **Problème :** Ces bleus institutionnels mats, rouges brique éteints et jaunes moutarde criards sont des couleurs par défaut de bibliothèques GIS (type Mapbox "Light"). C'est une catastrophe chromatique : aucune cohérence émotionnelle, aucune atmosphère de conflit. Ça ressemble à une carte de découpage administratif pour un rapport municipal, pas à une war-map. Le contraste est faible, la saturation aléatoire.
*   **Piste :** Dans Remotion, appliquer un `filter: saturate(1.2) contrast(1.1)` global sur le canvas. Changer la palette : bleu nuit profond (`#0f172a`) pour les loyalistes, rouge sang oxydé (`#7f1d1d`) pour les jihadistes, or antique métallique (`#b45309`) pour le contesté. Ajouter une texture de grain de film (PNG en `mix-blend-mode: overlay` à 8% opacity) pour casser immédiatement le côté "vectoriel propre généré par IA".

**2. La typographie "système par défaut" et le halo de cantine scolaire**
*   **Problème :** Le mélange grotesque de serif (date en haut à droite) et sans-serif (légende) trahit un manque total de direction artistique. Le label "BAMAKO" utilise un halo blanc crasseux (`text-shadow` basique) qui saigne dans le bleu du territoire au lieu de flotter. La légende en haut à gauche est une boîte CSS sans marges, collée au bord comme un post-it mal découpé.
*   **Piste :** Une seule fonte condensée (Inter ou Roboto Condensed) pour toute la carte. La date : gros chiffres blancs avec un fond noir semi-transparent (`rgba(0,0,0,0.4)`) en `backdrop-filter: blur(4px)`, pas du texte nu. Supprimer la légende statique ; faire apparaître les icônes de couleur en bas en `position: absolute` avec fade-in contextuel, ou utiliser des pictogrammes sur la carte elle-même.

**3. Les sprites véhicules "clipart Windows XP" (Frame 4)**
*   **Problème :** Les icônes de véhicules ressemblent à des PNG téléchargés sur un site d'images libres de droits de 2008. Aucune ombre portée, aucune intégration à la perspective de la carte, échelle identique quelle que soit la latitude. Ils flottent au-dessus du terrain comme des pions de jeu de société cheap, sans poids, sans direction claire.
*   **Piste :** Remplacer par des SVG minimalistes en vue de dessus avec un `filter: drop-shadow(2px 4px 2px rgba(0,0,0,0.4))` dynamique. Pour le mouvement : utiliser `cubic-bezier(0.4, 0, 0.2, 1)` pour l'easing, et ajouter une trainée de poussière (ligne SVG derrière le véhicule avec `stroke-opacity` dégressif) pour ancrer le déplacement au sol.

**4. Le glow pulsant "sélection Photoshop" (Frame 1)**
*   **Problème :** Si le surlignage doré du Mali est juste un `box-shadow` ou un `filter: glow` animé en opacity, c'est insupportable. Ça fait "sélection Windows 95" ou "erreur de rendu 3D", pas mise en valeur pays. C'est le signe d'un procédé générique non maîtrisé.
*   **Piste :** Utiliser le contour du Mali comme un SVG path avec `stroke-dasharray` et `stroke-dashoffset` animé pour un effet de tracé (drawing effect). Ou plusieurs paths concentriques avec opacité décroissante (15%, 8%, 3%) pour simuler une aurée volumétrique, pas un glow digital cheap.

**5. La texture de fond "papier toilette"**
*   **Problème :** Le fond beige plat (`#f5f5dc`) sans topographie subtile, sans grain, sans variation de teinte entre désert et savane, est du template Mapbox non customisé. C'est visuellement mort. On dirait une carte générée par une IA qui n'a jamais vu un documentaire de guerre.
*   **Piste :** Overlay d'une texture papier vieilli (PNG en `mix-blend-mode: multiply` à 15% opacity). Ajouter un léger relief sur les frontières : `filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5))` sur les lignes de contour. Variation de teinte : zones désertiques légèrement rosées (`#e6d5c3`) vs zones sud plus vertes (`#d4d4aa`) même dans une palette désaturée.

---

=== QUESTION 2 — LISIBILITÉ / COMPREHENSION ===

**1. Le carton JNIM, mur d'opacité au centre (Frame 3)**
*   **Problème :** Le rectangle "JNIM / LIÉ À AL-QA
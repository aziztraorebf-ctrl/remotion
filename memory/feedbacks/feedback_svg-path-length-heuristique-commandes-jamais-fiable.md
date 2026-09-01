# SVG path length — jamais estimer par comptage de commandes

> Migré depuis auto-memory 2026-08-31 (créé 2026-07-30). Référencé en index dans `MEMORY.md` §
> D3/Mapbox ("⭐⭐ svg-path-length-heuristique-commandes-jamais-fiable") mais le détail complet
> n'existait nulle part côté repo. Complète `memory/tools/d3-geo-vector-pipeline.md` et
> `memory/tools/remotion-geo.md` qui utilisent `pathTotalLength`/`PATH_LEN` sans cette mise en garde.

Pour toute animation `strokeDashoffset` sur un path généré par d3-geo (ou tout path dont les coordonnées
varient selon la géo/projection), calculer la longueur RÉELLE en sommant la distance euclidienne cumulée
entre points consécutifs — jamais une heuristique du type "nombre de commandes M/L/C × constante".

**Why** : sur un beat Franc CFA, du code réutilisé d'un Short précédent calculait cette longueur avec
`(nombre de commandes) × 14`. Sur une nouvelle géo (Afrique seule, Natural Earth 110m, coordonnées plus
denses que la géo d'origine), cette heuristique sous-estimait la vraie longueur d'environ 2.5x. Le
`strokeDashoffset` retombait à 0 bien AVANT que le contour soit visuellement complet — les pays semblaient
"ne jamais finir de se dessiner" à l'écran, un symptôme qui a fait chercher du côté du timing/frame au lieu
du calcul lui-même. Une heuristique par comptage de commandes n'est valide QUE pour la géométrie sur laquelle
elle a été calibrée (densité de points, échelle de projection) — changer de dataset géo l'invalide
silencieusement, sans erreur.

**How to apply** : symptôme à reconnaître — "le contour ne finit jamais de se dessiner" = suspecter EN
PREMIER la mesure de longueur, pas le timing d'animation. Ne jamais copier une constante heuristique d'un
projet à l'autre même si le pattern semble identique — recalculer la vraie distance géométrique à chaque
nouvelle géo (ou utiliser `path.getTotalLength()` côté DOM si disponible dans le contexte de rendu).

## ⭐ Corollaire SYNC AUDIO-VISUEL (2026-07-29, CFA beat 3)

L'inverse du symptôme ci-dessus, et il touche le SON : quand la longueur déclarée **SURESTIME** la vraie
(ici `CURVE_LEN = 1500` pour des courbes de 1113-1255 px, mesurées par échantillonnage dense des cubiques de
Bézier), le `dashoffset` atteint 0 **AVANT** la fin de l'intervalle — le trait est visuellement complet **12
à 18 frames plus tôt**. Conséquence : un SFX qui doit sonner AU CONTACT (une courbe qui rejoint sa cible, un
trait qui touche un point) posé sur la fin de l'intervalle sonne **APRÈS** le contact.

→ Avant de placer un SFX synchronisé sur une animation de tracé : **(1)** comparer la longueur RÉELLE à
la constante utilisée, **(2)** confirmer À L'IMAGE en extrayant les frames autour du contact supposé
(vérifier une frame "encore à distance", une frame "touche", et deux frames après pour confirmer que le
tracé était déjà fini si identiques).

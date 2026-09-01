# Parchemin = HERO abstrait, PAS carte géographique zoomable (registre spatial)

**Constat prouvé par render (2026-06-20)** : on a poussé le parchemin d3-geo plat sur la scène "3 gisements" V2 (carte large + zoom narratif + DÉZOOM pour flux Europe/Asie + bascule navy). Render complet 54s (catbox bw72oj). **Aziz tranche : ça ne marche pas pour ce type de scène.**

## Pourquoi (l'analyse, à retenir)
Le parchemin quadrillé est un registre d'**AFFICHE / hero-objet**, pas de **carte géographique réelle**. Il excelle quand :
- UN seul sujet fixe (le Sénégal qui se dessine, se fissure, le 8M$ par-dessus — hook validé),
- la géométrie = support graphique d'un GESTE fort (fissure, bascule), pas une vraie lecture spatiale,
- on ne demande JAMAIS de lire distances/positions relatives réelles entre plusieurs lieux.

Dès qu'on zoome/dézoome sur une vraie géo multi-points, on entre dans le métier de la **cartographie animée** (RealLifeLore, GeoGlobetales, History Mapped Out) → il faut océan crédible, matière, reliefs, labels, projection qui respire. Le faire à la main en SVG plat = reconstruire Mapbox en moins bien. Le dézoom révèle des continents en **aplats beiges sans matière** → le cerveau lit "schéma faux", pas "carte". C'est LE mur senti sur l'état GTA.

**Cause racine = confusion de registre** (doctrine [[feedback_spatial-carte-abstrait-remotion]], "ne jamais forcer l'abstrait sur la carte") :
- HERO / objet-matière (parchemin, fissure, chiffre qui frappe) = registre ABSTRAIT, un foyer, un geste. ✅
- Carte géographique vivante (gisements offshore, flux export, frontière maritime) = registre SPATIAL → VRAIE carte.
La scène gisements est intrinsèquement SPATIALE. On a forcé l'abstrait dessus.

## Décision (tranchée Aziz 2026-06-20)
1. **Scènes SPATIALES → Mapbox frame-driven (archétype B)** : vraie carte avec matière (satellite stylisé / vectoriel premium GéoAfrique grisé), 1 Map continue, caméra frame-driven (jamais flyTo). On POSE dessus nos éléments de marque (marqueurs ocre, cartouches, flux, drapeaux `useClipFlags`). C'est le geste des vraies chaînes carto.
2. **Parchemin / hero data-viz** : gardé, mais **registre décidé SCÈNE PAR SCÈNE** (pas de règle rigide "réservé hero" — certaines scènes sont hybrides). Critère : la scène demande-t-elle de LIRE une vraie géo multi-points ? Oui → carte réelle. Non (un sujet + un geste) → parchemin OK.

## Valeur de la dépense
Le render V2 parchemin n'est PAS du gâchis : c'est le **test qui prouve la frontière** du pari "parchemin extensible" (tranché la session d'avant). On sait maintenant, preuve à l'appui, où passe la limite. L'archétype Mapbox B était déjà en réserve — on bascule dessus pour le spatial.

## Pour le code
- V1 et V2 parchemin de la scène gisements = CONSERVÉES (référence du constat), ne pas purger.
- Repartir des doctrines Mapbox : [[SOUVERAIN-VISUAL-PLAYBOOK]] + `mapbox-session.py` + `STORYBOARD-MAPBOX.md`. Pattern 1 Map continue type `SenegalActe2Continu`.
- ⚠️ Pitch 32-35° en vue pays/région (semi-3D signature, l'agent Mapbox l'avait oublié → carte morne) ; pitch réduit ~10-15 en vue large. À graver dans `templates/PROMPT-BREAKDOWN-CARTO-MAPBOX.txt`.

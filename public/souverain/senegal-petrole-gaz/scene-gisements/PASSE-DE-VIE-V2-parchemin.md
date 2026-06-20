# PASSE DE VIE — Scène gisements V2 parchemin (à appliquer au coding)

> Ma prise de main (Claude) sur le breakdown V2, confronté à NOTRE arsenal réel.
> Principe directeur : **VIVANT par le GESTE (caméra, transformation, couleur), ÉPURÉ par le NOMBRE d'objets** (leçon A5 : carte vivante ≠ carte chargée).
> Source : storyboard V2 `storyboard-A-parchemin` dynamique + breakdown `breakdown-V2-plat.json`.

## Décisions effet par effet (GARDE / DÉGRADE / ENRICHIT)

### Carte & cadrage
- ✅ **GARDE** : carte LARGE d3-geo (Afrique Ouest + Atlantique + Europe esquissée), pattern `ProtoCarto_ContinentDraw` (useTopology + geoMercator + countries-50m). Reprojection frame par frame pour le zoom/dézoom.
- ⛔ **ANTI-VIDE (correction Aziz)** : JAMAIS de carte blanche. Pays voisins teintés gris-parchemin (`#d6cdb4`), mer teintée (parchemin un cran plus froid), Sénégal en ocre `#e7bd78`. La carte est REMPLIE.
- ✅ **Drapeau plein** : à l'état 1-2, on peut teinter le Sénégal de son drapeau (vert/jaune/rouge translucide) OU rester ocre — trancher au render (essayer drapeau, garder si lisible). Anti-gris.

### Caméra (le cœur du dynamisme)
- ✅ **Zoom narratif** : large (état1) → plonge sur Sangomar (état2) → remonte GTA + DÉZOOME pour les flux (état3) → glisse + bascule navy (état4). Reprojection geoMercator interpolée (prouvé en début de session : zoom-out de projection).
- ✅ **Drift continu** entre les mouvements (le `<g>` dérive doucement) — jamais un plan figé, même en "pause".

### Marqueurs / matière
- ⚠️ **La goutte de pétrole "3D" du storyboard → DÉGRADE en 2D stylisé** : disque ambré `#e09a3c` + dégradé radial + petit reflet SVG blanc. PAS de rendu 3D. (Le storyboard évoque, on traduit.)
  - 🔶 OPTION PixelLab (à juger au coding, PAS imposé) : un petit sprite animé (derrick qui pompe sur Sangomar OU tanker qui glisse vers l'Europe) serait cohérent avec le parchemin et très vivant. MAIS = génération async + risque incohérence. **Décision : coder d'abord le 2D stylisé ; ajouter PixelLab SEULEMENT si la scène manque encore de vie après.** Ne pas bloquer dessus.
- ✅ Gaz GTA = anneaux concentriques teal `#2a9da0` (déjà prouvé scène V1, ça marche bien).
- ✅ Yakaar en-suspens = cercle pointillés gris `#a9a9a0` rotation dashOffset lente (prouvé V1).

### Flux d'export (la grosse correction Aziz)
- ⛔ **DÉZOOM OBLIGATOIRE au moment des flèches** : les flèches Europe/Asie partent de GTA et VONT jusqu'à des destinations VISIBLES sur la carte large (Europe au nord, Asie vers la droite). Endpoints = centroïdes TopoJSON réels (technique inédite du breakdown), PAS des flèches dans le vide hors-cadre. C'est LE fix du "opportunité manquée".

### Pop-ups / valeurs (correction Aziz "18% flottant")
- ⛔ **JAMAIS de valeur flottante déconnectée**. La jauge 18% (Petrosen) DOIT être reliée par un trait/leader au gisement Sangomar (modèle "SANGOMAR + trait" qui marchait déjà). Idem opérateurs. Soit leader, soit overlay solide bref (1-2s), jamais au milieu de l'écran sans lien.

### Couleur / bascule
- ✅ **GARDE** : bascule parchemin → navy à l'état Yakaar (prouvé hook 32s, `mix()` hex). C'est un événement visuel fort qui rythme la fin.
- ✅ Yeux animés/clignotants (l'agent V1 l'a réussi, fidèle storyboard) — garder.

## Rythme cible (règle ~5s)
État 1 (52-55s) : carte large + situ + 3 marqueurs. État 2 (55-68s) : zoom Sangomar + transformation pétrole + 18% relié. État 3 (68-90s) : remonte GTA + dézoom + flux Europe/Asie visibles. État 4 (90-104s) : bascule navy + Yakaar + yeux. → un mouvement/transformation tous les ~5s, zéro objet empilé en plus.

## Assets à générer (session coding)
- Drapeaux AU + UK : DÉJÀ FAITS en SVG (`flags/flag-au.svg`, `flag-uk.svg`). Réutiliser.
- (Optionnel, si passe PixelLab retenue) : 1 sprite derrick ou tanker — à décider au coding.

## Ce qui reste à coder (session séparée)
Partir de `breakdown-V2-plat.json` + ce document. Base technique = `ProtoCarto_ContinentDraw` (carte large reprojetable) + `ProtoEffect_Fracture` (mix couleurs, grain). Audio V3 startFrom 52s. Durée 1560f. Appliquer les décisions ci-dessus (anti-vide, dézoom flux, valeurs reliées, 2D stylisé pas 3D).

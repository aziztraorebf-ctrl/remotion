# DOCTRINE — Carte vs Overlay : quand sortir de la carte (War-Map)

> Gravé 2026-06-14 (Aziz, session Polish Chantier 3). Décision de MÉTHODE valable pour TOUTES les scènes
> War-Map, pas seulement la confédération. Corrige une erreur d'interprétation de WARMAP-GRAMMAIRE-CAUSALE.

## L'erreur qu'on faisait
On interprétait "tout sur la carte" (WARMAP-GRAMMAIRE-CAUSALE R1) trop DOGMATIQUEMENT → on FORÇAIT sur la
carte des choses qui n'y ont pas leur place naturelle (un accord institutionnel, une donnée pure, un concept
abstrait). Résultat : métaphores plaquées faibles (liens qui se tracent + mini-sceau noyé) au lieu d'un
récit clair. Sur un PETIT territoire (3 pays voisins), c'est encore pire : pas la place de faire quelque
chose de premium.

## La règle juste (Aziz 2026-06-14)
**La carte sert au CAUSAL et au SPATIAL. Tout ce qui se lit mieux HORS-SOL mérite un overlay solide ou un
plein écran, PUIS on revient sur la carte.**

| Va SUR la carte (causal/spatial) | Va en OVERLAY/PLEIN ÉCRAN (conceptuel) |
|---|---|
| jeton qui avance / prend une ville | un ACCORD institutionnel (confédération, traité) |
| territoire qui change de main (couleur) | une DONNÉE pure (chiffre, ratio, comparaison) |
| drapeaux/couleurs projetés dans polygone | un CONCEPT abstrait (le franc CFA, la dette) |
| déplacements, flux, exode, sillages | une métaphore qui n'a pas d'ancrage géographique |
| frontières qui se tracent, fronts | une liste, un classement, une chronologie dense |
| acteurs ancrés à de VRAIS lieux + liens géo (P1) | un schéma d'alliance entre entités non-localisées |

## Test à se poser AVANT de coder une scène
> "Ce que je veux montrer a-t-il un ANCRAGE GÉOGRAPHIQUE réel (un lieu, un mouvement, un territoire) ?"
> - OUI → sur la carte (grammaire causale).
> - NON (c'est un concept, un accord, une donnée) → overlay solide central OU plein écran, puis retour carte.

## ⭐ TEMPLATE PRINCIPAL — `WarMapDimmedOverlay` (validé Aziz 2026-06-14, à réutiliser largement)
Code : `src/projects/warmap/_shared/WarMapDimmedOverlay.tsx`. Aziz : "devrait devenir un de nos templates
principaux, marche très bien, réutilisable dans d'autres vidéos".

**Le pattern** : on NE quitte PAS la carte → on l'ASSOMBRIT (voile semi-transparent ~0.62) en gardant ses
contours/couleurs VISIBLES en arrière-plan, + halo radial doré (spotlight), + grain, puis on SUPERPOSE des
éléments (sceau, drapeaux, titre, data, schéma) PAR-DESSUS. Effet cinématographique : la carte reste le décor
vivant, l'élément superposé est la scène. Bien plus fort que le plein écran opaque (tue la carte) OU forcer le
concept sur la carte (illisible).
- `WarMapDimmedOverlay` = composant PUR (frame en prop) : voile + halo + grain + fade in/out + slot `children`.
- ⚠️ **Conflit z-order (leçon Chantier 3)** : si la carte a une couche de contours rendue PAR LE MOTEUR APRÈS
  l'overlay (ex. `countryBorderPaths` de SahelWarMapEngine), ces contours TRAVERSENT l'élément superposé.
  → percer un TROU (mask SVG) dans la couche contours du moteur, à l'emplacement écran de l'élément, MÊME
  fenêtre. Helper `dimmedOverlayHole()` donne {cx,cy,r}. NE PAS masquer TOUS les contours (tue la beauté) —
  seulement un disque local sous l'élément. Réf moteur : mask `confed-seal-hole` dans SahelWarMapEngine.
- Réf validée : confédération AES (Chantier 3 P4) — `out/episodes/warmap-sahel/p4-chantier3-confed-FINAL.mp4`
  (catbox xt8ztb). Drapeaux ml/bf/ne convergent → sceau SVG "Confédération AES / Septembre 2023".

## ⭐ TEMPLATE — `WarMapSplitScreen` (les DEUX en parallèle, validé Aziz 2026-06-15)
Code : `src/projects/warmap/_shared/WarMapSplitScreen.tsx` (promu des protos R&D P5/P6).
Évolution de la doctrine : au lieu de "OU la carte OU l'overlay", le split montre **les deux SIMULTANÉMENT** —
spatial à gauche (carte), conceptuel à droite (data), côte à côte. **Incarne une DIVERGENCE** (la frontière du
split EST la séparation des 2 mondes) au lieu de la décrire. Cas roi : opposition/comparaison/dépendance.
- 2 render-props (chacun son repère 0..w/0..h), orientation vertical/horizontal, `connector` qui traverse la
  séparation (ex. fil de parité CFA), ouverture animée.
- Réf validée : CFA P4 (`out/episodes/warmap-sahel/p4-cfa-FINAL.mp4`, catbox 5fxlvp). GAUCHE carte AES + pièce
  CFA pulsante. DROITE drapeau France SVG ondulant + équation "1 € = ~656 FCFA" PERSISTANTE → bascule vers le
  SENS en typewriter (souveraineté + jeunesse, charte analyste : documenter le ressenti sans le valider).
- Leçon data : afficher les chiffres ARRONDIS sans ambiguïté ("~656" pas "655,957" → lu "655 000"). Voir FACTS-CFA-2026.

## Garde-fous (ne pas tomber dans l'excès inverse)
1. **La carte reste le FIL CONDUCTEUR** et le lieu du causal — c'est notre différentiel (Bellona/Sahel
   Chronicles ne l'ont pas). On ne bascule PAS tout en plein écran (sinon on perd la carte vivante).
2. **L'overlay/plein écran est un OUTIL qu'on dégaine SANS HÉSITER** pour le conceptuel — on ne l'osait pas
   assez. Les chaînes de réf ne se gênent pas pour le plein écran ; nous avons EN PLUS l'option de ne pas
   toujours casser la carte (cartouche central solide = la carte reste visible autour).
3. **Toujours REVENIR sur la carte** après l'overlay (le fil narratif géographique reprend).
4. Outils dispo : `WarMapOverlayDynamic` mode `"card"` (cartouche opaque, carte visible autour) ou
   `"fullscreen"` (plein écran opaque, casse la carte). `"semitransp"` BANNI.

## Cas d'application immédiat (Chantier 3 confédération)
La confédération AES = acte INSTITUTIONNEL (3 pays signent), AUCUN ancrage spatial → ne PAS la forcer sur la
carte (liens+mini-sceau = raté). → **overlay/plein écran solide premium** : 3 drapeaux AES (ml/bf/ne) qui
convergent → sceau "Septembre 2023 · Confédération AES", fond opaque charte épisode. Puis retour carte (CFA,
dézoom, Chantier 4). La mécanique P1 (liens) n'est PAS ratée : elle est pour les acteurs ANCRÉS à de vrais
lieux (soutiens étrangers Russie→Mali, Émirats→X) — pas pour un accord entre 3 voisins.

Liens : [[WARMAP-GRAMMAIRE-CAUSALE]] · [[WARMAP-LONG-DOCTRINE]] · [[DECODE-maxbellona]] ·
[[PLAN-MATCH-POLISH-MECANIQUES]] · [[WARMAP-SVG-ANIME-3E-VOIE]]

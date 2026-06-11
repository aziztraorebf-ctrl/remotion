# Synthèse DA-BRIEF downstream Partie 2 — VÉRIFIÉE par Claude (signal, pas juge)

Brut : `/tmp/da-refs/da-warmap-p2-downstream-{gemini,kimi}.md`. 2 voix CONVERGENTES = signal fiable.
Cette fois le DA a trouvé de VRAIS bugs (vérifiés sur frames), pas des hallucinations. À corriger.

## 🔴 CORRECTIONS PRIORITAIRES (convergent G+K + vérifié)
1. **BUG : "NIAMEY" affiché 2×** — collision label basemap + mon point bascule. FIX : supprimer mon label NIAMEY.
2. **Frame A pas "propre" (PRIORITÉ ABSOLUE selon les 2)** — le rouge démarre trop tôt/gros → sabote la
   "sécurité apparente", désamorce le choc de Frame B. FIX : rouge quasi invisible à l'install (petits points/
   opacity ~0.1), EXPLOSE en surface seulement au beat 2.4 (échec). Le contraste A→B est tout le récit.
3. **Extinction illisible** (gris sur rouge + × noir, contraste nul). FIX : étoile → FANTÔME (contour gris clair,
   intérieur vide) + × en encre #2A1C0E avec HALO PARCHEMIN (paintOrder stroke, stroke #F5EFD6) pour percer le rouge.
   Remplacer l'étoile par la croix (ne pas superposer). Micro-délai du × après désaturation (beat visuel).
4. **Frame C surchargée** — labels bases MORTES (Gao/Ménaka) encore affichés + collision avec "40%". FIX :
   faire DISPARAÎTRE les labels des bases éteintes (l'histoire n'est plus là). Désencombrer le quadrant centre-sud.
5. **Surfaces rouges = cercles parfaits, intersections + sombres ("Venn"/heatmap)** — opacité additive.
   FIX : grouper TOUS les blobs rouges dans UN `<g opacity=X>` (opacité au groupe, pas par cercle) → surface
   UNIE homogène (territoire), pas empilement. Bords moins parfaits si possible (mais cercles flous OK au multiply).
6. **"40%"** : déjà halo parchemin, RENFORCER (encre + contour parchemin épais) + repositionner zone moins chargée.

## ✅ AMÉLIORATIONS SECONDAIRES (vraies, optionnelles)
- CEDEAO : l'anneau ressemble à une "cible". Le rendre plus fade (opacity ~0.3) = tension diffuse, pas cible.
  C'est un PONT vers P3, pas une info P2 → niveau de lecture le plus bas.
- Hiérarchie typo : capitales (Bamako/Ouaga/Niamey) plus fortes que bases militaires. (basemap gère déjà en partie.)
- Légende statique (CEDEAO pas dedans) : mineur, optionnel.

## ❌ À IGNORER (hors-scope / trop coûteux / hallucination)
- "Paths rouges depuis données ACLED réelles / épouser rivières-routes" : sur-ingénierie, hors budget. Les blobs
  organiques groupés suffisent à l'esthétique. (Kimi sur-demande.)
- "Graticule / échelle graphique / NATO APP-6A symbols" : pas notre identité (parchemin sobre, pas carte militaire technique).
- "Légende dynamique contextuelle" : nice-to-have, pas prioritaire. La légende basemap actuelle est cohérente.
- "morphing SVG paths / synchro voix" : c'est de l'animation (le rendu EST déjà animé, ils jugent des frames figées).

## ORDRE D'EXÉCUTION
1 (bug Niamey) → 2 (Frame A propre, PRIORITÉ) → 5 (rouge groupé uni) → 3 (extinction lisible) → 4 (labels morts) → 6 (40%).

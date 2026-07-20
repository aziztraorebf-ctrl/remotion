---
name: warmap-sahel-short-90s-storyboard-panel-driven
description: Storyboard 12 panels ecrit pour le Short AES 90s (V4 apres 4 rejets), direction "carte vivante d3-geo pure" deja tranchee par Aziz — voir aussi warmap-sahel-short-90s-reprise.md
metadata:
  type: project
---

Storyboard panel-par-panel complet ecrit dans `memory/episodes/warmap-sahel/STORYBOARD-AGENT-A.md`
(2026-07-07), en execution d'une direction visuelle DEJA TRANCHEE par Aziz (pas une proposition de concept
— contrairement au concept "parchemin qui s'ecrit" documente dans [[warmap-sahel-short-90s-reprise]] qui
etait une proposition Stage 1 anterieure).

**Why**: Aziz a rejete 4 mises en scene precedentes ; la 5e tentative fixe la direction en amont (carte
d3-geo pure, un seul cadre continu, drapeaux dans les polygones, geste Libye drapeau->gris->rouge, fracture
CEDEAO unique) et demande un storyboard frame-exact AVANT tout code, pour eviter une 5e iteration a l'aveugle.

**Decouvertes cles a ne pas re-decouvrir** :
- `SahelAttackArrow.tsx` est Mapbox-only (`map.project()`) — INCOMPATIBLE avec un pipeline d3-geo pur.
  Alternative retenue : points+halos pulsants (pattern `RESOURCE_POINTS` de `ProtoCarto_ContinentDraw.tsx`),
  pas de fleche geo.
- `libya-outline.geojson` existe DEJA dans `public/_shared/geo-data/sahel/` — pas besoin de le generer.
- `ly.png` (drapeau Libye) ABSENT de `public/_shared/flags/` — non bloquant pour ce storyboard (choix aplat
  couleur, pas image clippee, pour tous les pays sur la carte — justifie par la concavite des polygones
  Mali/Niger a cette echelle, l'image clippee reste reservee au triangle d'emblemes ou le support est un
  bouclier regulier, pas un polygone geo).
- `ProtoEffect_Fracture.tsx` clippe sur une DIAGONALE D'ECRAN fixe (pas le contour du pays) — ce qui rend sa
  generalisation a "tout le cadre" (carte+triangle+sceau) plus simple que prevu : il suffit d'englober plus
  de contenu dans les 2 `<g clipPath>` existants, pas de reconstruire la geometrie de fracture.
- `CtaCard.tsx` (a ne pas toucher) introduit une 2e rupture de registre (fond image video + navy) non prevue
  par la direction ("une seule rupture, au CEDEAO") — point remonte a Aziz, pas tranche seul.

**How to apply**: Avant de coder ce Short, lire le storyboard complet. 4 gestes identifies "a prototyper"
(pas encore prouves) : elargissement du cadre pour reveler la Libye SANS mouvement de camera artificiel
(bbox fixee des le depart, reveal par masque) ; fracture generalisee au bloc dense (risque d'empilement
SVG) ; transition kaki->drapeau sur emblemes deja en place (pas un pop, juste un changement de couleur) ;
positions des "bases militaires" du panel 2 (coords non donnees par le script, a definir ou garder
abstrait). Risque rythme identifie : panels 5-6 (24.5s-35.8s, ~11s) sont le segment le plus statique en
apparence — c'est le point le plus expose a un nouveau rejet "ca ne bouge pas assez".

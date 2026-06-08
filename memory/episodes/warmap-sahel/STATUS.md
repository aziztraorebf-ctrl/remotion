# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-08 (session reconstruction Acte 1 COMPLÈTE)
**Branche :** `feat/da-brief-gate-warmap-sahel`

---

## ⭐ ÉTAT : ACTE 1 RECONSTRUIT (à valider en full HD, puis Acte 2)

L'Acte 1 a été ENTIÈREMENT reconstruit cette session (parti d'une "bouillie illisible").
Composition : **`SahelActe1-Final`** (prop `acte1Final`), f0-2299 (77s), isolée des Actes 2-5.
Dernier render : `out/episodes/warmap-sahel/wip/acte1-FINAL-v3.mp4` (scale 0.5) + corrections après
(barre virée, taches au front) PAS encore re-rendues en complet.
Dernières frames full HD validées : `FULLHD-f1400.png` (netteté OK) + `FULLHD-f2167.png` (front).

### Ce qui est DANS l'Acte 1 (tout codé + validé en frames)
**Phase 1 (0-24s)** — allumage séquentiel Mali->Burkina->Niger (fusion Turf + vignette + ville pulse +
front draw beige) · CEDEAO anneau qui se ROMPT (fissure) · flèches Liptako draw-in + soudure or · FREEZE f572.
**Phase 2-3 (24-77s)** — nettoyage cognitif f726 (couleurs politiques 0.82->0.42) · GRAINES pulsantes
(comblent le trou 25-40s) · JETONS-COMBATTANTS (2 archétypes, voir ci-dessous) qui éclosent, se déploient
dispersés, avancent au front, reculent · TACHES D'INFLUENCE qui grandissent (clippées au front, plus de
muddy overlap) · friction f2167.

### PROCHAINE ACTION (session fraîche)
1. **Render Acte 1 COMPLET en FULL HD (scale=1)** : `./scripts/render-mapbox.sh SahelActe1-Final
   out/episodes/warmap-sahel/wip/acte1-FULLHD.mp4` (PAS de --scale → 1920x1080, ~30 min).
   Vérifier que tout fonctionne (jetons nets, taches au front, barre bas absente, graines, sync voix).
2. Si OK → l'Acte 1 devient la RÉFÉRENCE DE STYLE. Aligner Actes 2-5 dessus (passe ultérieure).
3. **Acte 2** : utiliser DA-BRIEF-GATE upstream (review du plan AVANT code) + downstream (review du rendu).

---

## ⚠️ AFFINAGES MINEURS OUVERTS (à juger sur le full HD, pas bloquants)
- Dispersion jetons JNIM : encore un peu groupés au centre (j1 lon -2.4 devrait ressortir plus à l'ouest).
- Chevauchement résiduel des taches : clippées au front mais vérifier qu'il ne reste pas de zone trouble.
- Onde de friction f2167 : codée mais peu visible sur frames statiques (juger en mouvement).

---

## ASSETS CLÉS (réutilisables)
- **Jetons-combattants** : `public/_shared/sprites/warmap/fighter-jnim.png` (chèche clair rural touareg) +
  `fighter-eigs.png` (cagoule sombre militaire Daesh). Style encre hachuré. Script : `scripts/warmap/gen-sahel-fighters.py`.
- **Véhicules** (ABANDONNÉS pour format long, gardés pour short) : `technical-jnim/eigs.png`.
- GeoJSON RÉEL admin-1 : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (32 régions) + `sahel-countries.geojson`.
- Audio : `public/_shared/audio/sahel-warmap/narration-v1.mp3` (439s) + alignment JSON.
- Moteur : `src/projects/warmap/engine/SahelWarMapEngine.tsx` (props test : `acte1Final`, `acte1CameraOnly`, etc.).

## TRIGGERS RÉELS Acte 1 (constante A1 dans le moteur)
Mali f150 · Burkina f231 · Niger f301 · CEDEAO f382 · Liptako f502 · FREEZE f572-632 · drift f726 ·
JNIM f1198 · EIGS f1749 · friction f2167 · fin f2299.

## REVIEWS PERSISTÉES (relire avant Acte 2)
- `review-acte1/` : diagnostic initial (palette=faux coupable, fragmentation=vrai pb).
- `review-zone2/SYNTHESE-ZONE2.md` + `da-zone2-*` : syndrome aquarium → taches/zoom/traînées.
- `review-zone2/da-jetons-*` + `DECISION-jetons-vs-vehicules.md` : virage jetons validé.

# Style Mapbox GéoAfrique — V5 validé par Aziz 2026-05-06 (remplace V1)

## Style V5 — STYLE PRINCIPAL (validé mobile 2026-05-06)

```ts
export const STYLE_GEO_AFRIQUE_V5 = {
  water: "#1a3a5c",      // Bleu-gris océan lisible
  land: "#4a4a4a",       // Gris clair territoire — lisible mobile/soleil
  border: "#c8c8c8",     // Frontières blanches comme Dark Grey natif
  highlight: "#FFD700",  // Or pur pour pays mis en avant
  space: "#0d1b2a",      // Fond espace bleu-gris foncé (pas noir pur)
};
```

- `filter: "brightness(1.3)"` sur le container Mapbox
- `fadeDuration: 300` pour adoucir le rechargement tuiles au zoom
- Masquer waterway + wetland layers (petits points bleus parasites)
- Étoiles scintillantes SVG pur (STARS + StarField) derrière la carte (z=0)
- `AbsoluteFill backgroundColor: s.space` (jamais `#000`)

Constante `STYLE_GEO_AFRIQUE_V5` + `StarField` exportées depuis (POC archivé)
`src/_archive/poc/poc-money-legends/MapboxOceanColor.tsx`. Composition de référence :
`MapboxGeoAfriqueV5` (300 frames, 1080×1920). Pipeline complet démontré : `MapboxTypeBVerticalV5`
(870 frames, narration + SFX + labels + karaoke).

## Style V1 — ARCHIVÉ, remplacé par V5
- Océan `#03224c` + Terre `#2a1e0e` — trop sombre mobile, lisibilité insuffisante en plein soleil.

**⚠️ Correction d'une doc périmée (2026-08-31)** : `tools/mapbox-effets-et-tests.md` § Style et
palette documente encore `STYLE_GEO_AFRIQUE` (V1, `#03224c`/`#2a1e0e`) comme "Style GéoAfrique
signature... Validé Or Africain v7" **sans mentionner que V5 l'a remplacé**. Vérifié 2026-08-31 :
le code de production actuel (`MapboxBase.tsx`, `FilRouge.tsx`, beats Sénégal V3, carousels hybrid)
utilise bien les couleurs V5 (`1a3a5c`), pas V1. La constante V1 reste utilisée nommément dans
plusieurs fichiers (nom `STYLE_GEO_AFRIQUE` conservé), mais avec les VALEURS V5 — le nom de variable
n'a pas suivi la mise à jour de palette. À vérifier au cas par cas si un fichier importe encore les
vraies valeurs V1.

**Why:** Aziz a testé V1→V5 sur téléphone en conditions réelles. V5 = seule version lisible à distance et en plein soleil.

**How to apply:** Utiliser `STYLE_GEO_AFRIQUE_V5` (ou la palette V5 par ses valeurs hex) pour TOUTES
les futures compositions Mapbox Type B. Ne jamais utiliser fond `#000` — toujours la couleur `space`.

## Notes production pour version finale
- SFX volume : x3-4 vs proof of concept (actuellement trop discret)
- Labels pays : ancrer sur coordonnées GPS via Mapbox `project()`, pas CSS absolu
- Sous-titres karaoke : forced alignment avec texte exact de la narration (pas approximation)

---
Migré depuis auto-memory (`feedback_mapbox-style-geo-afrique.md`) le 2026-08-31, contenu original enrichi
d'une note de vérification (le fichier repo existant `mapbox-effets-et-tests.md` était en retard sur V5).

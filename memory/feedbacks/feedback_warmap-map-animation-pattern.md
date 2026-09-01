# Pattern validé pour coder et tester des briques Map Animation war-map (flèches, expansion, flux)

## Règle : SahelAttackArrow = Mapbox, AtlasAttackArrow = d3-geo (ne pas confondre)

`AtlasAttackArrow` (Atlas) projette via d3-geo et rendu SVG intégré dans le transform caméra.
`SahelAttackArrow` (War-Map) projette via `map.project()` et rend un SVG AbsoluteFill par-dessus Mapbox.

**Why:** Les war-maps utilisent Mapbox (headless), pas d3-geo. La projection doit suivre `map.project()` à chaque frame via le useEffect update loop. Les deux coexistent dans le projet — ne pas croiser les imports.

**How to apply:** War-Map Long Format = `SahelAttackArrow`. Atlas = `AtlasAttackArrow`. Si un futur sujet war-map passe à d3-geo pur (décision ouverte), revisiter.

---

## Pattern validé : showcase isolé AVANT intégration moteur

Avant d'intégrer les nouvelles briques dans SahelWarMapEngine.tsx, créer une composition `MapAnimationShowcase` dédiée qui enchaîne les 3 animations en séquence (~40s). Render à @50%, vérifier visuellement, ajuster zoom/strokeWidth, puis intégrer.

**Why:** Zoom trop dézoomé (4.0) → flèches invisibles (quelques pixels). Un render de contrôle révèle le problème avant d'investir dans l'intégration complète. Coût = 1 render supplémentaire (~4min), économie = retravailler l'intégration à l'aveugle.

**How to apply:** Pour toute nouvelle brique war-map : 1) composer showcase 2) render @50% 3) vérifier frames clés 4) ajuster 5) re-render 6) intégrer moteur. Ne pas sauter l'étape showcase.

---

## Réglages opacité Map Animation (valeurs validées Sahel zoom 5.5)

- `SahelAttackArrow` strokeWidth showcase : 6 (capitales or), 7-8 (tenaille bleue)
- `SahelAttackArrow` strokeWidth moteur : 3-5 selon importance narrative
- `TerritorialExpansion` maxOpacity : 0.42-0.55 (au-delà = trop opaque sur parchemin)
- `RefugeeFlow` baseWidth showcase : 10 | moteur : 5-6
- Zoom Mapbox minimum pour voir les briques : 5.3-5.8 (zoom 4.x = trop loin)

---
Migré depuis auto-memory (`feedback_warmap-map-animation-pattern.md`) le 2026-08-31, contenu original inchangé.

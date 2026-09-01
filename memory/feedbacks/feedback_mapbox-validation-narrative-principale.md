# Mapbox = outil cartographique principal Souverain (validé 2026-05-26)

> Migré depuis auto-memory 2026-08-31. Décision fondatrice qui a établi Mapbox comme outil
> cartographique principal pour Souverain — complète `memory/tools/mapbox-mcp.md` (référence
> technique) avec le RATIONALE de la décision et l'inventaire des 23 techniques validées.
> ⚠️ Liens catbox (2026-05-09) probablement expirés — les techniques listées restent utiles comme
> checklist/inventaire, à re-tester si besoin de référence visuelle.

**Citation Aziz** : « Ce qu'on vient de prouver est que Mapbox n'a pas à rougir face aux cartes style image statique, cela fonctionne très bien selon moi, les mouvements des caméras sont beaucoup plus dynamiques, et surtout les styles tels que les whip pan et ensuite les changements de cartes sont vraiment beaux, tous ces styles là sont validés selon moi et doivent être sauvegardés. »

## Décision

Mapbox devient officiellement l'outil cartographique principal pour les productions Souverain, au-dessus des alternatives :
- ❌ Cartes statiques (PNG/SVG exportés)
- ❌ d3-geo seul (gardé pour Atlas pur, pas Souverain)
- ❌ AnyChart, Datawrapper, Flourish

**Pourquoi** :
- Mouvements caméra frame-driven beaucoup plus dynamiques qu'une image qui pan/zoom CSS
- Whip pan + style switch = transition cinéma justifiée narrativement
- Overlay canvas animés (gradient, fumée, Lottie premium) → effet After Effects sans After Effects
- Frame-perfect en headless = reproductible, déterministe

## Comment appliquer

Pour tout nouveau beat Souverain nécessitant une carte :
1. Choisir la technique de mouvement caméra dans l'inventaire ci-dessous
2. Si overlay de données / drapeau / chiffre → techniques overlay
3. Si effet atmosphérique (fumée pétrolière, vagues) → Lottie premium
4. Toujours Mercator (jamais globe) pour les beats Souverain standards
5. Pattern `1 seule Map continue` (cf `memory/doctrines/DOCTRINE-SOUVERAIN.md` § Mapbox frame-driven)

## Inventaire complet 23 techniques validées headless (2026-05-09)

**Caméra** : Drift Continu, Orbit+Dolly, Multi-Stop Whip Pan, Zoom+Freeze, Tilt+Pull Back, Counter-Rotation, Drift+Blur, Pull Back Planétaire, Zoom Sol 3D, Fade Style Switch, Whip Pan Style Switch, Zoom Out+Style+Zoom In.

**Overlay v1** : Fill-Pattern drapeau, Line Dasharray tracé, Fill-Extrusion 3D PIB, Markers Spring Pop DOM, Canvas animé updateImage.

**Overlay v2** : Gradient vague, Gradient radial pulsant, Multi-pays gradients distincts, Noise organique, Watermark SVG répété, Lottie off-screen.

Détails techniques complets : `memory/tools/mapbox-mcp.md` (sections "Caméra & projection" + "Techniques overlay" + "Lottie + fill-pattern") — vérifier si ces techniques y sont référencées avec le même niveau de détail avant de considérer ce fichier comme secondaire.

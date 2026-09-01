# Atlas — Couches RPG/HUD sans surcharge visuelle

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-04). Pattern applicable à tout épisode Atlas
> avec mécaniques RPG (bulles dialogue, jauges, war cry, object states).

Source : conseil créatif externe 2026-05-04, applicable Empire Ghana CTA et futurs Atlas.

## Règle 3 couches (hiérarchie obligatoire)

1. **Fond** — Carte d3-geo avec palette riche de l'épisode (Mande/méditerranéen/etc.) MAIS dans une plage tonale cohérente. Pas de gris triste — la carte reste belle. Mouvement faible.
2. **Action** — Sprites PixelLab avec couleurs **plus vives ou plus contrastées** que la carte. Un point chaud sur fond harmonisé.
3. **HUD** — Bulles + jauges. Semi-transparentes, ne rivalisent jamais avec couches 1 et 2.

**Clarification importante (Aziz 2026-05-04)** : la règle est une **hiérarchie de contraste relatif**, pas une désaturation absolue. Adapter palette par épisode = oui (anti-répétitif). Réinventer le système 3 couches = non.

**Why** : éviter le "bordel visuel" frôlé sur Beat 1 Empire Ghana (multi-sprites + cartouches + routes glow).
**How to apply** : avant d'ajouter un élément à un beat Atlas, identifier sa couche. Si on ajoute en couche 3 alors qu'il y a déjà 2+ éléments couche 2 actifs → trop chargé.

## Focus contextuel (jamais tout en même temps)

- Bulle de dialogue active → zoom léger Remotion sur sprite + blur léger reste carte
- Bulle disparaît → dézoom révèle mouvement carte
- Pattern : `interpolate(frame, [bubbleStart, bubbleStart+10], [1, 1.15])` + filter blur sur layer fond

## Patterns RPG actionnables Atlas

| Pattern | Outil | Use case Atlas |
|---------|-------|----------------|
| Bulle dialogue pixel | Remotion + police pixel (VCR OSD Mono / Inter pixelisé) | Citation historique courte (max 4-5 mots) |
| Jauges minimalistes | Icône sac or + chiffre `+500` qui monte | Apogée empire, tribute, expansion territoire |
| War cry zoom + son | PixelLab attack frame + zoom 1.0→1.4 + duck musique | Climax bataille |
| Object states (village→ville→ruines) | PixelLab `vary_object` ou variations manuelles | Évolution ville, déclin empire |
| Particules narratives (nuée pépites) | Remotion array de sprites micro animés bezier | Flux or transsaharien, migrations, dispersion |
| Son "blip" 8-bit avant bulle | ElevenLabs sound-generation court | Prévient l'œil du spectateur |

## Anti-patterns

- Bulle SUR le sprite → flèche pointant le sprite mais bulle au-dessus
- Bulle + jauge + label ville simultanés → choisir un seul HUD actif par moment
- HUD dans bottom 30% → conflit sous-titres karaoke (cartouches top half y<640)
- War cry sans duck musique → conflit voix ElevenLabs

## Sujets Atlas idéaux pour exploiter ces patterns

- Traversée avec péril (Alpes/rivière) : war cry + object states (ex: éléphants gel/mort) + particules débandade
- Voyage avec changement de contexte : un sprite qui change tenue par région (PixelLab variations)
- Combat tactique + jauge territoire
- Pèlerinage/caravane : particules + jauge richesse
- Évolution timelapse d'une ville : object states purs

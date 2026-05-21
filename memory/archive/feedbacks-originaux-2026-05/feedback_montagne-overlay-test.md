---
name: Test Technique 1 montagne overlay (validé Empire Ghana 2026-05-04)
description: Preuve de concept que PixelLab map_object montagne posé sur la carte fonctionne visuellement. Limites identifiées pour applications Atlas futures (Hannibal Alpes).
type: feedback
---

## Test réalisé

Beat 4 Empire Ghana 2026-05-04 fin session : ajout d'un asset montagne PixelLab (Atlas Mountains) sur la carte, position projetée d3-geo (311, 330), entre Sijilmassa et Taghaza.

Render test : `out/empire-ghana/beat4-test-mountains.mp4` (frames 60-180).

## Verdict

✅ **Marche techniquement** : PixelLab map_object + svgToCompWithCam + drop-shadow CSS = montagne qui suit la caméra correctement, fade in/out propre, palette cohérente.

❌ **Ne donne pas effet 3D wow** : c'est un dessin posé sur la carte, pas une vraie élévation. Le drop-shadow aide mais reste 2D évident.

❌ **Rectangle de fond visible** : PixelLab map_object n'a pas un vrai fond transparent ; on voit les bords de l'asset rectangulaire beige clair.

❌ **Scale délicat** : difficile de bien dimensionner sans paraître disproportionné par rapport aux territoires/POI.

## Quand utiliser cette technique

✅ **Bon usage** :
- Repère géographique passager (montagne entre 2 POI sur 4-5s)
- Indication symbolique d'obstacle (le guerrier descend "à travers les montagnes")
- Sujets où le relief est secondaire à l'histoire

❌ **Mauvais usage** :
- Sujets où le relief est central (Hannibal Alpes = climax narratif)
- Plans larges où les montagnes occupent >30% de l'écran
- Quand on veut un vrai effet "wow drone-shot"

## Recommandation Hannibal

Si on fait Hannibal v1, **NE PAS se contenter de Technique 1**. La traversée des Alpes est le climax visuel et un dessin posé ne suffira pas.

Options à explorer pour Hannibal :
1. **Asset PixelLab amélioré** : plusieurs montagnes superposées avec parallaxe (1-2 sessions de tests)
2. **Composition Remotion 3D** : `@remotion/three` + heightmap displacement (1 session R&D dédiée)
3. **Vidéo générative** : Seedance/Kling clip 5s drone-shot Alpes ($0.50-2/clip mais résultat photoréaliste)

L'option 3 (Seedance) est probablement le meilleur ratio qualité/effort pour Hannibal : l'Atlas reste 2D pour les beats narratifs, mais on insère 1 clip vidéo généré pendant 3-5s pour le climax Alpes. Pattern hybride déjà documenté dans `hybrid-seedance-remotion-strategy.md`.

## Asset réutilisable

`public/empire-ghana/assets/pixellab/alpes-test.png` (320×320 pixels art montagnes enneigées sépia) — peut servir de base pour Hannibal v1 si Technique 1 retenue.

## Conclusion

Test rapide (30 min total) qui a prévalidé un pattern et identifié ses limites. **Pattern à utiliser avec parcimonie pour ne pas casser le style 2D Atlas**.

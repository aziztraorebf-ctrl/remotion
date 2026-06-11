# Refonte PREMIUM War-Map — techniques + capacités (2026-06-11)

> Déclenché par retour Aziz : la P2 codée en SVG plat (cercles/étoiles/X) = MORT, plat, niveau 1, pédagogique.
> Gemini (analyse vidéo complète) CONFIRME : score 4/10, "exécution trop plate et statique, recadrage serré +
> textures organiques nécessaires". LEÇON : j'ai sauté la RÈGLE RECHERCHE TEMPLATES (scanner CATALOGUE-CARTE-VIVANTE
> AVANT de coder). On a 30+ composants premium qu'on n'utilisait pas.

## CE QU'ON A DÉJÀ (inventaire vérifié — ne pas re-chercher)
- **Lottie géo-ancré** : `src/projects/_shared/mapbox/LottieGeoAura.tsx` (frame-driven, off-screen, ancré
  map.project). Générateurs : `premiumLottieAssets.ts` (shockwaveDiscovery / networkFlow / orbitalDataCrown,
  param color RGB + fr). `public/_shared/lottie/smoke.json`. Render via render-mapbox.sh.
- **Sprites warmap** (marqueurs riches, pas SVG) : `public/_shared/sprites/warmap/` — base-france, base-africacorps,
  jeton-fama, jeton-csp, fighter-{jnim,eigs,france}, technical-{jnim,eigs}, refugie-*, fr-{epervier,licorne,sabre}.
  Intégration : map.addImage + symbol-image OU <img> position absolute calé map.project + drop-shadow.
- **Caméra premium** : `MapboxBase.tsx` (lerpCam, CAM_PRESETS, CAM_COUNTRY_APPROACH_DEFAULTS = zoom 4.7 pitch 32
  bearing 5, CAM_MULTI_PULLBACK = zoom 3.4 pitch 15). 16 mouvements doc dans `memory/tools/atlas-camera-movements.md`.
- **Composants carte vivante** (`CATALOGUE-CARTE-VIVANTE.md`, 30+) — pertinents refonte War-Map :
  - Zone qui vit : `PulsingRegionFill` (territoire respire opacity sin), `ContagionFlagSpread` (propagation vagues
    + flash), `DominoContagionFill` (couleur contamine de proche en proche), `SweepRevealTerritory` (faisceau révèle).
  - Front/conquête : pattern track-matte (2 couches + masque progressif), jamais setPaintProperty instantané.
  - Marqueurs profondeur : drop-shadow encre chaude `drop-shadow(0 4px 8px rgba(40,30,20,.35))`, spring Pop.
  - Flèches offensive : `<path>` stroke-dashoffset draw-on + pointe marker.
  - Data-viz ancrée : `GeoCountryPlaque` (pilule nom + stat + source), au lieu de texte "40%" brut.

## TECHNIQUES CHAÎNES PREMIUM (K&G / Johnny Harris / Vox) — recherche sourcée
Principe unificateur : RIEN n'apparaît instantanément, RIEN n'est immobile, TOUT se construit dans l'ordre de la
voix. Mouvement = intention narrative. Profondeur = matière + ombre + pitch. Caméra ne s'arrête jamais.

**Caméra** (tuer le cadrage mort/vide) :
1. Push-in synchronisé voix (drift continu + accent zoom sur mot-clé). JAMAIS constant.
2. Tracking transition "peak-on-cut" + motion blur (bascule cachée dans le mouvement).
3. Pull-back reveal (serré → large, ouvre puis répond à "où sommes-nous ?").
4. Pitch/fausse-3D croissante sur relief (1-4 pays) = profondeur vraie, anti-carte-morte.

**Animation éléments** (tuer marqueurs statiques) :
5. Front mouvant (path SVG dont le `d` est interpolé entre key-shapes / flubber morphing).
6. Conquête par track-matte (couche "conquis" sous masque animé qui s'agrandit = marée, pas scale de cercle).
7. Marqueur = jeton à ombre portée (sprite + élévation), pas cercle SVG niveau 1.
8. Flèches offensive stroke-dashoffset (vecteur = direction du récit).

**Textures/matière** (niveau 1 → premium) :
9. Carte texturée (hillshade/parchemin grain), jamais aplat uni.
10. Fond qui micro-bouge (grain animé faible amplitude) — l'immobilité totale = "vidéo en pause" = décrochage.
11. Stutter 12fps sur OVERLAYS (cachet hand-made/éditorial). Jamais sur la caméra Mapbox. À tester.

**Profondeur/révélation** :
12. Reveal track-matte (2e carte/motif révélée par balayage, pas cut).
13. Labels en reveal échelonné (clip-path paliers + texte décalé 3-5f).
14. Élévation par ombre portée (hiérarchie Z : carte=sol, narratif=objets posés). Ombre encre chaude, pas noire.

**Rythme** :
15. Séquentiel synchro syllabe (un événement à la fois, dans l'ordre de la voix) = le storytelling cartographique.

Sources : aescripts Johnny Harris maps, PremiumBeat Vox breakdowns, Sigma Editor, No Film School, lilys.ai history
animators, YouTube GEOlayers frontline tutorials. (Workflow EXACT K&G non public — front mouvant reconstruit des
tutos GEOlayers/AE qui reproduisent ce style.)

## PROTOTYPE EN COURS (décisions Aziz)
- Beat = 2.4 EXTINCTION d'une base FR encerclée (le moment le plus mort à refaire premium).
- Tester DEUX versions : à plat (pitch 0, comme P1) VS pitch 3D (~32). Comparer.
- Caméra SERRÉE qui suit l'action (jamais vue continentale/vide). Drift permanent.
- Base FR = sprite base-france + ombre (pas étoile SVG). Jihadisme = front mouvant + Lottie sur-mesure (pas cercle scale).
- Extinction riche (onde + effondrement du sprite), pas un × plat. "40%" → data-viz ou supprimé (voix suffit).
- Lottie SUR-MESURE à créer pour les moments clés (décision Aziz).

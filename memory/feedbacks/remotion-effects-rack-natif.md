---
name: remotion-effects-rack-natif
description: "Rack d'effets natifs Remotion (@remotion/effects, motion-blur, three) — ce qui est REELLEMENT dispo en 4.0.456 vs versions futures, et le piege Context7"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 71552ce2-7f66-4ce2-aba4-3464183da50a
---

Rack d'effets natifs Remotion = matiere premium sous-utilisee (decouvert 2026-06-17, chantier "cartographier le plafond AE" avec Aziz).

## Ce qui est REELLEMENT installe en 4.0.456 (verifie dans node_modules, PAS de memoire)

- `@remotion/effects@4.0.456` : SEULEMENT `blur` / `blurHorizontal` / `blurVertical`, `halftone`, `tint`, `wave`. (4 familles, pas 40.)
- `@remotion/motion-blur@4.0.456` : `CameraMotionBlur` (flou mouvement cinema) + `Trail` (trainee/echo fantome).
- `@remotion/light-leaks@4.0.456` : deja installe depuis le debut.
- `@remotion/three@4.0.456` : vraie 3D (Three.js + R3F headless), `@react-three/drei` 10.7.7 dispo. JAMAIS utilise dans le projet — territoire vierge.

## ⚠️ PIEGE Context7 (cause d'une sur-promesse en session)
La doc Context7 de `/remotion-dev/remotion` decrit une version PLUS RECENTE que 4.0.456 : elle liste glow, chromaticAberration, noiseDisplacement, lightLeak(), pixelDissolve, scanlines, starburst, shine... CES EFFETS N'EXISTENT PAS EN 4.0.456. Ils sont arrives apres (derniere version au 2026-06-17 = 4.0.479).
→ TOUJOURS verifier `node_modules/@remotion/effects/dist/index.d.ts` (exports reels) avant d'annoncer un effet dispo. Ne pas se fier a la doc Context7 pour la liste exacte d'une version donnee.

## Upgrade 4.0.456 → 4.0.479 = a faire en branche isolee
Debloquerait glow/chromaticAberration/noiseDisplacement/lightLeak etc. MAIS fait bouger TOUS les `@remotion/*` (bundler, cli, renderer, three...). Risque de regression sur les vidEos existantes (warmap, senegal, atlas). Tester sur renders existants AVANT merge. Ne pas faire a la legere.

## API (verifiee)
- `blur({radius})` → renvoie un tuple `[EffectDescriptor, EffectDescriptor]` (H+V).
- `wave({amplitude?, wavelength?, speed?, sliceWidth?, background?})` → EffectDescriptor.
- `halftone({...})`, `tint({...})` → EffectDescriptor.
- Les effets s'appliquent via la prop `effects={[...]}` sur `<CanvasImage>` / `<Video>` (necessite WebGL = `--gl=angle` deja en place pour Mapbox).
- `CameraMotionBlur` et `Trail` = composants wrapper (`<CameraMotionBlur shutterAngle samples>...</>`).

## Lecon strategique (le vrai sujet de la session avec Aziz)
La fatigue d'Aziz ("tout recommencer", "graphismes premium") ne vient PAS d'un stack faible. Elle vient de 2 choses :
1. On code a la main (SVG/CSS/canvas) des choses parfois livrees par la lib → effort gaspille.
2. On part des 71 templates au lieu d'une REFERENCE VISUELLE concrete → assemblage sans direction. Voir [[feedback_premium-d-abord-anti-paresse]].
Les templates = vocabulaire, pas scenario visuel. Le premium vient de la DIRECTION (timing/retenue/1 idee par plan), pas des briques.
Idee Aziz a rebrancher = "Remogen" : Gemini 3.1 Pro analyse une video/effet admire → decompose en primitives d'animation → verdict faisabilite Remotion + plan code. Pipeline deja prouve par morceaux (upload video Gemini fiable [[gemini-video-upload-fiable]] + breakdown JSON + traduction code).

## ⭐ VERDICT TESTE EN RENDER (2026-06-17) — demo sur le KineticMaskSlam d'Aziz
Demo : 3 variantes du KineticMaskSlam (baseline / rack 2D / 3D), renders full HD vertical, frames analysees.
Catbox : baseline nf8xv7 · fx-rack xqwxuy · three3d fgq270. Code : `src/projects/_shared/_demos/KineticMaskSlamFX.tsx` + `KineticSlam3D.tsx`.

CONCLUSIONS (prouvees, pas theoriques) :
1. **Le rack 2D natif n'est PAS une baguette premium.** Greffe Trail + CameraMotionBlur sur le mask-slam = MOINS bon que la baseline (bug d'echelle : CameraMotionBlur rasterise le voile a echelle reduite → bandes navy sur les bords ; Trail quasi invisible). LECON : Trail/CameraMotionBlur servent un element qui SE DEPLACE a l'ecran, PAS un element qui scale (mask-slam). Choisir l'effet selon la mecanique du hook, jamais empiler au hasard. → confirme [[feedback_premium-d-abord-anti-paresse]] : le premium = DIRECTION (timing/retenue/1 idee par plan), pas les filtres.
2. **@remotion/three (3D) = le vrai gisement neuf.** Demo 3D = "70%" glow sur dalle navy inclinee dans l'espace + lisere gold en perspective + lumiere directionnelle + camera orbitale frame-driven. Profondeur/lumiere que NI les 71 templates NI le 2D ne donnent. Aziz a choisi de CREUSER LA 3D (2026-06-17).
3. Gotcha 3D : drei `Text3D` exige une police typeface JSON (absente du projet) → telecharger un asset .typeface.json AVANT de faire du texte 3D extrude. Sinon geometrie pure (box/plane/extrude maison). ThreeCanvas pilote par useCurrentFrame = meme philo frame-driven que Mapbox jumpTo (Aziz sait deja raisonner comme ca). Render via render-mapbox.sh (--gl=angle) marche pour du Three pur aussi. Warning PCFSoftShadowMap = cosmetique.

## ⭐⭐ PIPELINE 3D MAISON VALIDE (2026-06-17) — Gemini image → fal.ai Trellis → @remotion/three
Idee Aziz (meilleure que les marketplaces) : generer NOS assets 3D dans NOTRE charte au lieu de fouiller des markets ou on ne trouve jamais l'exact besoin. TESTE DE BOUT EN BOUT, ca marche.
- Script : `scripts/tools/image-to-3d.py` (upload catbox → fal-ai/trellis ~$0.07 → telecharge .glb). `@fal-ai/client` deja installe, `FAL_KEY` dans .env.
- Image source : `scripts/tools/gemini-gen-image.py --prompt --output` (`IMAGE_MODEL`, defaut Lite). Prompt = objet STYLISE low-poly, charte navy #16213a/gold #c8a951, "single isolated object, pure transparent background, no text". Le stylise/low-poly REUSSIT la conversion 3D ; le photorealiste/organique ECHOUE (raison de l'echec passe d'Aziz).
- Charge .glb dans Remotion via GLTFLoader + delayRender (PAS useGLTF/Suspense qui peut geler le render headless). Normaliser : Box3 center + scale. Compo demo : `src/projects/_shared/_demos/Asset3DShowcase.tsx`.
- RESULTAT (catbox vm74pp) : JETON war-map (medaillon etoile) = EXCELLENT (forme plate/geometrique → conversion parfaite, relief reel). BARIL = forme OK mais materiau trop sombre (materiaux .glb Trellis peu reflechissants + eclairage scene trop faible → monter ambientLight/directionalLight ou remplacer le material). 
- assets generes : `public/_shared/assets-3d/token.glb` (1.6MB) + `barrel.glb` (1.4MB).

## CADRE D'USAGE 3D (tranche par Aziz 2026-06-17) — le 3D est un REHAUSSEUR, pas un remplacement
- ✅ BON : jetons 3D abstraits (war-map), icones/objets 3D sur carte (baril/piece/cube ressource flottant au-dessus d'un pays), geometrie simple, silhouette pays extrudee, "la touche en plus".
- ❌ MAUVAIS : cartes Mapbox complexes en 3D (bouillie illisible — instinct d'Aziz juste), backgrounds genratifs 3D (les modeles image→3D font des OBJETS isoles, pas des decors), formes organiques/realistes (echec conversion).
- Icones 3D sur Mapbox = couche ThreeCanvas transparente par-dessus la carte + projeter geo→ecran (comme les jetons/labels actuels). FAISABLE.
- Vehicules 3D realistes (char/camion) = NON par generation ; possible seulement via .glb modelises tout faits (Sketchfab Download API, OAuth requis) mais hors-charte/lourd.

## SOURCES ASSETS (recherche web 2026-06-17) — PAS de MCP mur, mais des API
- 3D .glb : Sketchfab Download API (1M+ modeles CC, OAuth requis, sort .glb/.gltf) · Poly Pizza (10k+ low-poly gratuits). 
- Lottie : LottieFiles (100k+ gratuit) · IconScout (982k, a une API). `@remotion/lottie` deja installe.
- ⛔ PIEGE : Envato/VideoHive = templates AFTER EFFECTS (.aep) INUTILISABLES en Remotion. Ne pas payer pour ca.
- ⛔ Pas de serveur MCP mur pour telecharger des assets 3D/Lottie (verifie). Un script API maison fait le job et nous appartient. Ne pas inventer un MCP qui n'existe pas.

## ⭐ TEST JETONS WAR-MAP PLAT vs 3D (2026-06-17) — VERDICT : le PLAT gagne, le 3D est de niche
Aziz a evoque Kings & Generals (jetons/bannieres avec visages + symboles + icones d'unite poses sur carte). Test : 3 jetons War-Map (charte parchemin/terre) genere par Gemini (visage chef sahelien turban+kalach / aigle heraldique faction / epees croisees unite) — TOUS EXCELLENTS en plat, dans la doctrine [[DECISION-jetons-vs-vehicules]] existante. Puis conversion 3D (visage+symbole) + comparatif. Catbox comparatif jqqt74.
CONCLUSIONS :
1. **K&G ne fait PAS de 3D pour ses jetons — c'est du 2D illustre pose sur carte 2D.** Le PLAT (Gemini) bat le 3D pour peupler une carte : lisible, plein de detail, coherent avec la carte 2D. Le 3D miniaturise sur carte perd son interet (le volume ne se voit qu'en gros plan) et risque de jurer (mix 2D/3D = "collage", crainte d'Aziz juste).
2. **Visages : Gemini en PLAT = magnifique. fal.ai en 3D = se deforme (zone organique).** → jeton-visage TOUJOURS plat. Symbole/icone geometrique = 3D possible mais inutile sur carte.
3. **3D = outil de NICHE : hook ISOLE plein ecran (1 objet/chiffre/pays qui tourne), PAS pour peupler une carte.** Pour la War-Map, le pipeline actuel d'Aziz (Gemini → jetons/objets plats) EST la bonne reponse. Confirme : "ce qu'on fait deja avec Gemini est tres puissant" (Aziz) = vrai.
4. ASSETS REUTILISABLES produits : `public/_shared/assets-3d/sources/jeton-{visage,symbole,icone}.png` (plats, charte War-Map, directement utilisables comme jetons) + leurs .glb (jeton-visage/symbole, moins utiles).

## ⛔ MA FAIBLESSE RECURRENTE A CORRIGER (gravee 2026-06-17) — 3D TROP SOMBRE
J'ai livre du 3D trop sombre 4 fois de suite (KineticSlam3D, Country3DRise f50, Asset3DShowcase baril, JetonCompare). Aziz l'a signale a chaque fois. CAUSE : je regle des lumieres "dramatiques/rasantes" qui mangent la matiere. REGLE : toute demo/scene 3D PART d'un eclairage LUMINEUX et lisible (ambientLight >= 1.0 + 2-3 directionalLight clairs), on assombrit APRES si besoin. L'inverse de ce que j'ai fait. Juger la lisibilite avant l'ambiance.

NEXT 3D (si Aziz y revient) : le 3D vaut le coup UNIQUEMENT pour un hook isole plein ecran. Raffiner Country3DRise (pays qui se leve) avec eclairage LUMINEUX d'abord. Sinon, le plat Gemini suffit et gagne pour 95% des usages carte.

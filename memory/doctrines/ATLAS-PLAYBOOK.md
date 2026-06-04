# ATLAS-PLAYBOOK — Doctrine visuelle (dérivée de Ghana + Mansa Moussa)

> Créé 2026-06-03. Miroir Atlas du `SOUVERAIN-VISUAL-PLAYBOOK`. À LIRE avant tout beat/scène Atlas.
> **DÉRIVÉ DE CE QUI MARCHE** : Empire du Ghana + Mansa Moussa V2, nos 2 meilleures Atlas pures.
> Sources : [[DECODE-empire-ghana]], [[DECODE-mansa-moussa]], [[feedback_atlas-retour-aux-sources-ghana-mansa]].
> Couche PixelLab (le morceau dur) = fichier dédié [[ATLAS-PIXELLAB-PLAYBOOK]]. Démarrage beat = [[ATLAS-BEAT-DEMARRAGE]].

Format Atlas : vertical, SVG `viewBox 0 0 720 1280` rendu en `1080×1920`, d3-geo précalculé (paths dans `<episode>-data.json`), JAMAIS Mapbox. Manipulation par `transform` SVG (caméra = transform, pas reprojection frame-driven).

---

## §1 — LES 7 PRINCIPES ATLAS (NON-NEGOTIABLE)

1. **La carte n'est JAMAIS statique** — drift Ken Burns permanent sur chaque scène :
   `driftX = sin(f*0.014)*10 ; driftY = cos(f*0.011)*7` (fréquences premières entre elles → organique non-répétitif). Parallaxe foreground (`*1.3`) sur les sprites/empire pour la profondeur.
2. **Tilt axonométrique (fausse 3D) croissant vers le climax** — `skewX = tiltDeg*0.15`, `scaleY = 1 - tiltDeg*0.008`, peak qui MONTE par scène (Mansa : 20°→20°→**28° climax**→24°), respiration permanente `+sin(localF*0.04)*2`. **S'annule au zoom** (`tiltDeg→8` quand on suit un sprite) pour garder les pixels lisibles.
3. **Tout calé sur forced-alignment** (Whisper/`timing.ts` + `findWord()`). AUCUN timing visuel hardcodé indépendamment de la voix. Frames absolues → relatives par beat. C'est le socle du rythme.
4. **Carte vivante, jamais un polygone plat** — empire = fill parchemin 0.18 + `pattern` de hachures (or/bordeaux 45°) + outline pointillé `"10 5"`, avec ÉTATS : glow pulsé (vivant), bascule gris cendre (effondrement, lerp RGB), inversion -45° or/vert (renaissance). La grisaille narrative (désaturer un continent sauf le protagoniste) est une métaphore visuelle pure.
5. **Overlays = TRIADE systématique** (ce qui les rend "parfaits") : (a) entrée `spring()` JAMAIS `interpolate` linéaire → tout a du poids ; (b) plaque `cream #F2E5C8` + outline `encre #3A2A18` → lisibilité garantie sur terracotta/bleu ; (c) timing sur timestamp de mot RÉEL. + micro-wobble papier permanent `rotate(sin(localF*0.08)*0.4°)`.
6. **Continuité d'état inter-beats** — AUCUN cut dur. `globalFadeIn [0,15]` / `globalFadeOut [T-12, T]` partout, et la caméra/zoom du beat N+1 REPREND la valeur finale du beat N. Sensation de "vol continu".
7. **Palette parchemin chaud** (PAS le bleu-nuit Souverain) : terre terracotta `#C97D5A`, océan `#3A5A7E`, or empire `#D4A574`, outline noir mat `#1A1A1A`, cream plaque `#F2E5C8`, encre `#3A2A18`. Typo : titres/chiffres **Cinzel** (Ghana) ou **Cormorant Garamond 700** (Mansa), narration/labels Cormorant italique, dates mono. Atmosphère : `AtlasSubtleStars 0.4` + vignette respirante + filtres papier SVG natifs (`feTurbulence` → cream/sépia, zéro asset).

**Règle de layout** : cartouches/titres TOUJOURS en haut (`y ≤ 320`). Le bas de l'écran est RÉSERVÉ aux sous-titres karaoké. Labels villes = MAJUSCULES sur plaque, jamais texte nu.

**R1 (anti-mou)** : jamais > 8s sans changement visuel. Combler les gaps narratifs longs par des cartouches micro-événement.

---

## §2 — LA GRAMMAIRE DE MOUVEMENT (le transform composé)

Forme canonique unique (identique Ghana/Mansa, dans un `<g>` qui enveloppe la carte) :
```
translate(360 + driftX - camOffX, 640 + driftY - camOffY)
scale(camScale, camScale * scaleY)        // scaleY = compression du tilt
skewX(skewX)                              // skewX = tiltDeg * 0.15  → fausse 3D
translate(-360, -640)                     // pivot au centre viewBox (ou un POI focal)
```

Recettes (toutes frame-driven) :

| Mouvement | Recette | Réf |
|---|---|---|
| **Drift Ken Burns** | `sin/cos(f*0.014/0.011)*10/7`, permanent | partout |
| **Tilt fausse 3D** | `skewX=tiltDeg*0.15 ; scaleY=1-tiltDeg*0.008` ; peak croissant ; `+sin(f*0.04)*2` | partout |
| **Camera SNAP (zoom sur beat)** | `spring({damping:80, stiffness:400})` (raide+amorti=net sans rebond), `camOff→(ville-centre)*0.65` | Mansa S2 |
| **Track sprite mobile** | `activeCamX = spriteX` pendant trajet, zoom `1→2→2→1` (in/hold/pull-back), tilt→8 | Mansa S3 |
| **Globe→carte seamless** | globe ortho zoome `1.96→11` pivotant sur un POI + crossfade globe/plate 10f. "Le globe DEVIENT la carte" | Ghana Beat1 |
| **Whip-zoom antithèse** (2 lieux distants) | zoom-out englobant (coords d3-geo hors canvas OK) + retour `p²` | Ghana Beat5 |
| **Bump impact** | `1 + 0.06*sin(bumpT*π)` (coup de poing) | Mansa S4 |
| **Camera shake** | `(random-0.5)*12*decay` sur 12f, injecté dans drift | Ghana Beat4 |
| **Dutch tilt** | `rotate(0→6→0°)` sur l'AbsoluteFill, mot fort | Ghana Beat4 |

---

## §3 — LES 2 SIGNATURES + ROUTAGE PAR BESOIN

> Ghana et Mansa Moussa sont COMPLÉMENTAIRES, pas interchangeables. Router selon le besoin narratif.

| Besoin narratif | Pattern | Source de référence |
|---|---|---|
| **Montrer un échange / une donnée chiffrée** (sel↔or, "20 000", "90 KG") | **Spotlight Insert** (dim carte 0→0.55 + boîte parchemin double-cadre + glow radial + chiffre Cinzel géant ou sprites confrontés `⇌`, double-trapèze opacité sync-mot) | GHANA `Beat1Setup.tsx:409-528` |
| **Incarner un acteur / un voyage / une migration** | **AtlasPixelChar + cortège** (sprite-acteur sur la carte, file indienne par offset de path, caméra qui track) | MANSA `AtlasV2S3Scene.tsx` → voir [[ATLAS-PIXELLAB-PLAYBOOK]] |
| **Nommer un lieu** | `AtlasLabel` (pill auto-width, spring scale-from-anchor) | MANSA `atlas-v2-components.tsx:200` |
| **Pointer un lieu (onde radar)** | `AtlasPulseMarker` (anneau `max(0,1-(t%1.5)/1.5)`, dot or + stroke encre) | MANSA `:267` |
| **Cartouche titre / chiffre-événement** | `AtlasCartouche` (spring damping14 + wobble + fadeOut, chaînage appearAt/disappearAt) | MANSA `:112` |
| **Légende pédagogique d'un territoire** | `AtlasEmpireLegend` (cartouche + échantillon du pointillé → lien légende↔polygone) | MANSA S1 `:251` ; GHANA empire hachuré |
| **Icône thématique (livre, mosquée)** | `IconCartouche` (PNG Gemini transparent dans plaque cream) | MANSA S2 `:37` |
| **Incruster une photo/illustration géolocalisée** | Médaillon clippé (`<image>` dans `<clipPath><circle>` + anneau or + halo) | MANSA S4 `:307` |
| **Intercaler de la dataviz hors-carte** | Insert duck-narration (audio en N segments + `offsetForNarrFrame` + WipeOverlay + triggers sur fins de phrase) | MANSA inserts Pie/Bar/Line |
| **Effondrement / mort d'un territoire** | Grisaille narrative (lerp RGB pays terracotta→gris, protagoniste reste or) | MANSA S4 `:171` ; GHANA effondrement |
| **Freeze sur une date/un chiffre-choc** | FreezeFrame plein écran (dim 0.85 + 280px weight 900, textShadow, spring overshoot) | GHANA `Beat4:948` |
| **ENRICHISSEMENT — flèche tactique / mouvement de troupe / encerclement** | `AtlasAttackArrow` / `AtlasEncirclement` (idée venue de mapanimation, codée par NOUS) | [[feedback_atlas-inspiration-externe-faisabilite]] |

**Place de mapanimation** : banque d'IDÉES qui ENRICHIT (les flèches en sont l'exemple validé), JAMAIS la fondation. La fondation, c'est Ghana + Mansa.

---

## §4 — RÈGLE ANTI-CLONAGE (NON-NEGOTIABLE)

Extraire les PRINCIPES et le VOCABULAIRE de mouvement, JAMAIS figer une mise en page exacte. Ghana et Mansa Moussa ne doivent pas devenir un moule qui produit des clones. Un nouveau beat RÉUTILISE la grammaire (caméra, overlays-triade, palette) et PIOCHE dans le catalogue de patterns selon le besoin — mais compose une scène neuve. Réutiliser un pattern validé est OK et souhaitable (c'est le langage visuel de la chaîne) ; le cloner pixel pour pixel ne l'est pas.

---

## §5 — CATALOGUE DE COMPOSANTS ATLAS

> Source de vérité code. Restaurés dans `src/projects/atlas/_reference/mansa-moussa-v2/` (Mansa) ou présents dans `src/_archive/episodes-livres/atlas/empire-ghana/` (Ghana). Composants partagés : `src/projects/atlas/_shared/`.

| Composant | Fichier | Rôle |
|---|---|---|
| `AtlasPixelChar` | `_reference/mansa-moussa-v2/scenes/AtlasPixelChar.tsx` | ★ Sprite PixelLab socle (voir [[ATLAS-PIXELLAB-PLAYBOOK]]) |
| `AtlasCartouche` | `_reference/.../atlas-v2-components.tsx:112` | Chiffre-choc encadré + wobble + fadeOut |
| `AtlasLabel` | `:200` | Pill ville auto-width spring-from-anchor |
| `AtlasPulseMarker` | `:267` | Point géo onde-radar |
| `AtlasEmpire` + `empireHatch` | `:406` + shared-defs | Polygone empire hachuré + outline pointillé |
| `AtlasCaravane` (chibi) | `:316` | Path or animé + chibi hopping |
| `getFlagFill` + `AtlasFlagDefs` | `atlas-v2-flags.tsx` | FlagFill (drapeau projeté en `<pattern>` dans polygone) |
| `AtlasMercator` / `AtlasGlobe` | `:454` / `:518` | Carte plate / globe ortho |
| `useSpringCamera` | `:636` | Hook drift + bump-on-arrival |
| `AtlasV2Subtitles` | `scenes/AtlasV2Subtitles.tsx` | Karaoke segment-aware (mappe frame→sec à travers inserts) |
| `AtlasSharedDefs` | `atlas-v2-shared-defs.tsx` | Filtres papier/glows/gradients SVG natifs |
| `WipeOverlay` | orchestrateur | Transition wipe carte↔insert |
| SpotlightInsert | GHANA `Beat1Setup.tsx:409` | ★ Encadré sel/or & chiffre-choc |
| `computeCameraState` + `svgToCompWithCam` | GHANA `Beat3/Beat4` | Caméra unique + reprojection sprites DOM sur carte SVG |
| Spritesheet clipPath animé | GHANA `Beat2:515` | 1 PNG horizontal → cycle clipPath+offset |
| `AtlasAttackArrow` / `AtlasEncirclement` | `_shared/AtlasAttackArrow.tsx` / `AtlasEncirclement.tsx` | Flèches tactiques (enrichissement mapanimation) |
| `geoUtils` (projections paramétrées) | `_shared/geoUtils.ts` | `makeLngLatToSvg`, `centeredProjection`, `bezierRoute`, helpers route |

**Composants Atlas existants additionnels** : voir `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` (à fusionner/croiser avec ce catalogue).

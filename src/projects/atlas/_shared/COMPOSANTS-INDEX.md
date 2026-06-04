# Index des composants Atlas — par cas d'usage

> Composants + blueprints + helpers Atlas, classés par INTENTION ("quand Aziz dit...").
> Utiliser cet index pour trouver le bon composant AVANT de chercher dans les fichiers ou d'en créer un.
> Source technique (props exactes, imports) : `ATLAS-COMPOSANTS.md`. Doctrine : `memory/doctrines/ATLAS-PLAYBOOK.md`.
> Carte maître : `ATLAS-INDEX-DES-INDEX.md`. Créé 2026-06-03 (miroir COMPOSANTS-INDEX Souverain).
> Imports : `_shared` = `src/projects/atlas/_shared/atlas-components.tsx` (sauf indication). `_bp` = `_blueprints/`. `_ref` = `_reference/mansa-moussa-v2/`.

---

## CARTE / PROJECTION — afficher la géographie

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasMercator` | _shared | "la carte de l'Afrique" — carte plate Mercator (paths JSON), props drift/scale/tilt/couleurs |
| `AtlasGlobe` | _shared | "le globe qui tourne" — globe orthographique bas-niveau (à mettre dans un SVG parent) |
| `geoUtils` (`makeLngLatToSvg`, `centeredProjection`, `PROJECTIONS`) | _shared/geoUtils.ts | "place ce lieu à ses vraies coordonnées" — projection WGS84→SVG. 5 régions prédéfinies (mali, mediterranee, cannae, europe, grece) |
| `positionAlongRoute` / `bearingAlongRoute` / `greatCircleRoute` / `bezierRoute` | _shared/geoUtils.ts | "un truc qui se déplace le long d'une route" — position/direction sur une route, arc géodésique, courbe lissée |

## CAMÉRA / MOUVEMENT — la carte bouge (jamais statique)

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `useSpringCamera` | _shared | "la caméra zoome/pan vers ce lieu" — hook spring multi-waypoints → {scale, driftX, driftY, tilt} |
| `svgToComp(x, y, cam)` | _shared | OBLIGATOIRE dès zoom >1.5x — ancrer un asset CSS/DOM sur la carte SVG zoomée (sinon désync) |
| `focusOffsetForPOI(x, zoom)` | _shared | "centre sur ce lieu près du bord" — évite la sortie de cadre au zoom |
| `CameraTrackEntity` | _bp/camera-track-entity | "1 perso marche, la caméra le suit" (source Ghana Beat3) |
| `OrbitalCity` | _bp/orbital-city | "on tourne autour de la ville" — rotation + drift autour d'un POI |
| `ZoomRevelation` | _bp/zoom-revelation | "on recule et on révèle" — pull-back 4x→1x + label disparaît |
| Mouvements caméra (catalogue) | `memory/tools/atlas-camera-movements.md` | "quel mouvement caméra pour X" — 16 mouvements code zéro-cost |

## SPRITES / PERSONNAGES — incarner un acteur (le différentiel Atlas)

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasPixelChar` ⭐ | _ref/scenes/AtlasPixelChar | "Mansa marche / l'armée avance" — sprite-acteur plein cadre, walk cycle 8fps, ancrage-pied. Doctrine : ATLAS-PIXELLAB-PLAYBOOK |
| `AtlasPixelStatic` | _ref/scenes/AtlasPixelChar | "le perso est planté là" — sprite statique (1 image + fade) |
| `AtlasCaravane` | _shared | "une petite caravane traverse" — CHIBI sur path Bézier + hop (vue large, perso petit) |
| `FormationMarch` | _bp/formation-march | "une armée / un cortège en formation" — N persos, leader + membres retardés (memberPosition) |
| `WaypointMarch` | _bp/waypoint-march | "voyage A→B→C→D multi-villes" — segments + rotation sprite par direction |
| `WalkToDestination` | _bp/walk-to-destination | "1 perso va de A à B" — marche + caméra suit + zoom |
| `Confrontation` | _bp/confrontation | "deux camps s'affrontent bord à bord" |
| `DualEntitySequential` | _bp/dual-entity-sequential | "l'un agit, puis l'autre" — 2 persos séquentiels, focus caméra change |
| `Alliance` | _bp/alliance | "deux forces convergent / s'allient" — convergence vers un point |
| Helpers sprite | _shared (`getSpriteAnimFrame`, `getSpriteClipPath`) | spritesheet horizontale (cycle via clipPath). Pour frames-PNG → AtlasPixelChar |

## OVERLAYS / ENCADRÉS — afficher un chiffre, un nom, une donnée

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasCartouche` | _shared | "le chiffre choc apparaît" — chiffre Cormorant + wobble spring, props value/label/source/triggerFrame |
| `AtlasLabel` | _shared | "nomme ce lieu" — pill auto-width, fade-in spring scale-from-anchor |
| `AtlasPulseMarker` | _shared | "pointe ce lieu sur la carte" — onde radar + dot or |
| **SpotlightInsert** ⭐ | GHANA `_archive/.../empire-ghana/scenes/Beat1Setup.tsx:409` | "montre l'échange sel↔or / le chiffre en gros" — dim carte + boîte parchemin glow + chiffre Cinzel ou sprites `⇌`. À EXTRAIRE en composant |
| `AtlasInsertPieChart` / `BarChart` / `LineChart` | _ref/scenes | "un camembert / des barres / une courbe" — dataviz hors-carte (inserts duck-narration) |
| `StatGauge` | _shared/StatGauge.tsx | "une jauge HUD qui descend" (armée 50k→26k) — RPG, hideRanges pendant moments dramatiques |
| `FocusBubble` | _shared/FocusBubble.tsx | "zoom dramatique flou sur le fond, perso net" — moments clés uniquement |

## TERRITOIRE / CARTE VIVANTE — un pays/empire qui vit

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasEmpire` | _shared | "l'empire s'étend / s'illumine" — overlay hachures/fill + animateIn |
| `EmpireExpansion` | _bp/empire-expansion | "l'empire grandit progressivement" — strokeDashoffset path + fill fade |
| `getFlagFill` / `AtlasFlagDefs` | _ref/atlas-v2-flags | "projette le drapeau dans le pays" — FlagFill (pattern drapeau dans polygone) |
| Grisaille narrative (pattern) | DECODE-mansa §E (lerp RGB) | "tout s'éteint sauf lui" — désaturer un continent, protagoniste reste or |

## HOOK / TRANSITION — ouvrir, enchaîner

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasGlobeHook` ⭐ | _shared | "le hook d'ouverture" — globe espace + étoiles + texte cascade 3 lignes (validé Ghana v8) |
| Globe→carte seamless (pattern) | GHANA Beat1Setup:126 | "le globe devient la carte" — pivot scale sur un POI + crossfade |
| `Flashback` | _bp/flashback | "retour en arrière" — sepia + skew + vignette |
| `AtlasSubtleStars` | _shared | fond étoilé déterministe (atmosphère) |
| `AtlasDefs` | _shared | `<defs>` SVG (gradients) — inclure 1× par composition |

## TACTIQUE / BATAILLE — mouvements de troupe

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `AtlasAttackArrow` | _shared/AtlasAttackArrow.tsx | "une flèche d'attaque se dessine" — arc géodésique + marching ants + tête mobile |
| `AtlasEncirclement` + `pincerArrows` | _shared/AtlasEncirclement.tsx | "l'encerclement / la tenaille" — N flèches coordonnées (Cannes) |
| `ShakeImpact` | _bp/shake-impact | "le choc / l'impact" — shake sin multifréquence + flash + decay |
| `DutchTiltCollapse` | _bp/dutch-tilt-collapse | "l'effondrement de l'empire" — dutch tilt + shake + bascule couleur |

## ÉPISODE-SPÉCIFIQUE (à généraliser si réutilisé)

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `MourningWarp` | `_archive/.../shaka-zulu/components/` | "ondes de deuil" — cercles concentriques + filtre SVG (Shaka S4 Nandi) |
| `CornesFrame` | `_archive/.../shaka-zulu/components/` | "formation en cornes de buffle" (Shaka) |
| `PaperGrain` | `_archive/.../shaka-zulu/components/` | texture parchemin overlay |
| `SourceCartouche` | `_archive/.../shaka-zulu/components/` | "la source historique" — citation source |

## PALETTE / CONSTANTES

| Export | Import | Contenu |
|---|---|---|
| `ATLAS_COLORS` | _shared | océan #3A5A7E, terre terracotta #C97D5A, empireGold #D4A574, cream #F5EBD8, textInk |
| `NATIONAL_COLORS` | _shared | couleurs drapeaux modernes (opt-in, désactivé pour empires historiques) |
| `ATLAS_SVG_W/H/CSS_SCALE/CX/CY` | _shared | 720, 1280, 1.5, 360, 640 |

---

## ⚠️ À EXTRAIRE de _archive vers _shared (backlog, valider imports avant)

- **SpotlightInsert** (GHANA Beat1Setup) — l'encadré sel/or, signature Ghana, pas encore en composant partagé.
- `AtlasPixelChar` — promouvoir de `_reference` vers `_shared` (utilisé en prod, composant socle).
- Shaka : `MourningWarp`, `CornesFrame`, `PaperGrain` si réutilisables cross-épisode.
- Inserts charts Mansa (`AtlasInsertPie/Bar/Line`).

> Procédure : grep-usage AVANT de déplacer (ne pas casser les scènes sources). Voir leçon anti-merge dans ATLAS-INDEX-DES-INDEX.

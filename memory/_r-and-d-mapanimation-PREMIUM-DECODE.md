# mapanimation.io — DÉCODAGE des 13 templates PREMIUM (Navigator ~69$/mois)

> 2026-06-03. Analysé chaque vidéo premium (j'ai accès aux .mp4 via leur API ; leurs PROMPTS premium = `null`, masqués — mais les vidéos suffisent à reconstituer la recette).
> Clips : `out/_r-and-d/mapanimation/clips/<id>_prem.mp4`. Contact sheets : `sheets/<id>_prem.jpg`.
> Objectif : SOURCE D'INSPIRATION N°2. Quand Aziz demande "un X plus premium", croiser notre Playbook AVEC ces recettes.

## ⚠️ LEÇON D'USAGE (post-test A5, 2026-06-03) — LIRE AVANT D'EXPLOITER CE FICHIER

Ce décode est une **source d'inspiration de COMPLÉMENTARITÉ (finition)**, PAS un mode d'emploi pour ajouter des éléments. Test A5 = on a empilé route+sprite+popups sur un beat déjà bon → illisible, rejeté par Aziz. Erreurs : éléments hors-voix (Mines/Chimie) + sprite trop petit (cargo) = bruit.
**Leur vraie force à capturer = SÉQUENTIEL maîtrisé (plan stable + 1 révélation au bon moment, jamais frénétique) + traitement COULEUR/FRONTIÈRES.** PAS "toujours un objet mobile". Notre principe prime : **mieux voir peu que voir énormément.** 3 garde-fous : suit la voix · lisible · séquentiel pas métronome. Détail : Playbook section 2bis.

## VERDICT GLOBAL

**Le "premium 69$/mois" ne cache AUCUNE techno secrète.** Ce sont des **assemblages de briques simples + un asset sprite PNG** (avion/tank/bateau vu de dessus). On a déjà 90% des briques. Le différenciateur = le sprite + la combinaison + le réglage caméra. **MAIS** (cf. leçon ci-dessus) on ne s'en sert qu'en complémentarité justifiée par la voix et lisible, jamais pour densifier.

**Projection : Mercator à plat, vue de dessus (PAS globe)** — sauf #194 (seul à utiliser `projection:'globe'`). Correction Aziz validée : les bombardiers = Mercator zoomé serré sur le pays.

## INGRÉDIENTS RÉCURRENTS (= leur "kit premium")

| Ingrédient premium | Notre équivalent | Statut |
|---|---|---|
| **Sprite véhicule PNG** (B-2, F-35, tank, drone, cargo) vu de dessus, mobile + rotation tangente | `GeoFlowConnection` (sprite mobile) — il suffit de remplacer la flèche par un PNG | ⚠️ à ajouter (PNG) |
| Fill pays intensité montante (rouge tactique) | `HeatGradientFill` / `PulsingRegionFill` | ✅ |
| Frontière néon qui se trace | `FiberOpticBorderDraw` | ✅ |
| Ripple/anneaux d'impact | `LottieGeoAura` (shockwave) | ✅ |
| Markers cibles + emoji (🔥💨) popés à un point geo | marqueurs Spring Pop + emoji/icône | ✅ (emoji = trivial) |
| **Balayage RADAR** (secteur conique cyan rotatif) | aucun | ⛔ petit GAP — `RadarSweep` overlay (secteur SVG rotatif + anneaux). Facile. |
| Image réelle clippée dans silhouette pays (photo Trump dans US) | `ImageProjectionFill` | ✅ |
| World→country zoom continu + labels provinces séquentiels | `camCountryApproach` (à étendre world→pays) | ✅ ~ |
| Globe sphérique 3D rotatif + fill + timeline dashed (#194 SEUL) | aucun | ⚠️ GAP #2 — `projection:'globe'`, POC headless requis |

## RÉGLAGE CAMÉRA (la vraie question d'Aziz)

Leur Mercator militaire : **zoom serré sur 1 pays** (le pays remplit ~60-70% du cadre, marge autour). Sprite traverse en diagonale. Drift caméra léger, parfois zoom out final. Zoom Mapbox estimé ~**z4.5-z6** selon taille pays (Iran z4.5, Liban z6.5, Pakistan/Inde z4). Fonds : satellite réel OU dark monochrome (eau quasi-noire). Pas de pitch (vue de dessus pure, à plat).
**Notre marge de progrès** : on garde NOTRE charte (navy #16213a, gold, voisins ivory, sources, plaques GeoCountryPlaque) au lieu de leur rouge/vert tactique + leur satellite brut. Plus premium éditorialement.

## LES 13 PREMIUM — recette par template

| # | Titre | Recette = nos briques | Sprite | Projection/zoom |
|---|---|---|---|---|
| 150 | B-2 Strike Iran | PulsingRegionFill + sprite + LottieGeoAura(impact) | B-2 PNG | Mercator dark, z~4.5 |
| 166 | Tank Pakistan→India | Satellite + sprite + fills + labels | tank PNG | Satellite, z~4 |
| 158 | Shahed drones Iran→KSA | fills(rouge/jaune) + RadarSweep + sprites multiples | drones PNG ×N | Mercator dark, z~4 |
| 169 | Hormuz cargo→US | sprites bateaux + ImageProjectionFill(Trump) + pull world | cargo PNG | carte claire→world |
| 164 | Israel-Lebanon F-35 | FiberOpticBorder + HeatGradientFill + sprites formation | F-35 PNG ×N | Mercator dark, z~6 |
| 159 | Shahed Israel | fills + RadarSweep + sprite | drone PNG | Mercator dark vertical |
| 174 | Iraq bomber flyover | FiberOpticBorder + fill + sprite + emoji 🔥💨 popés | bombardier PNG | Satellite dark, z~5 |
| 173 | F-35 Lebanon | FiberOpticBorder + HeatGradientFill + sprite | F-35 PNG | Mercator vert, z~6 |
| 172 | Lebanon airstrike | = 173 (variante) | F-35 PNG | Mercator dark, z~6 |
| 185 | War Room Moldova | titre HUD + RadarSweep + fills + sprite + flow lines dashed | avion PNG | Satellite, z~5.5 |
| 199 | Iran comet-trail | satellite + fill + pull-back world | — | Satellite→world |
| 179 | World→Iran zoom | world→country zoom + labels provinces séquentiels | — | Mercator world→z5 |
| 194 | **3D Globe health** | **projection:'globe' rotatif + fill choropleth + timeline dashed cyan** | — | **GLOBE** (seul) |

## CE QU'IL NOUS MANQUE VRAIMENT (priorisé)

1. **Sprites PNG vus de dessus** (avion/tank/bateau) — asset, pas techno. Brancher dans `GeoFlowConnection` (prop `spriteImage`).
2. **`RadarSweep`** — petit overlay : secteur conique rotatif + anneaux concentriques. ~80 lignes, headless-safe (SVG + rotation frame-driven). Apparait dans 3 premium.
3. **Globe `projection:'globe'`** (#194) — GAP #2, POC headless requis avant de coder.

## VISION : connecter les deux mondes (demande Aziz)

But = quand on code un beat Mapbox Souverain et qu'Aziz dit "fais-le plus premium", on a DEUX bases d'inspiration :
1. Notre `SOUVERAIN-VISUAL-PLAYBOOK.md` (drift continu, anti-gris, séquentiel synchro, bichromie, habillage narratif)
2. CE décodage (leurs recettes : sprite mobile, radar, fills tactiques, world→country, globe)

→ À faire (plus tard) : fusionner ces recettes dans le Playbook comme "patterns d'inspiration externe", pour que `mapbox-session.py` phase 0 SCAN les propose aussi. Aziz explorera couleurs/caméra de son côté et m'en parlera (canal humain = inspiration ciblée).

Liens : [[feedback_mapanimation-veille-et-geoflow]] · catalogue complet `_r-and-d-mapanimation-catalog.json` · analyse gratuits `_r-and-d-mapanimation-ANALYSE.md`.

# R&D — mapanimation.io : analyse technique + concurrentielle

> Date : 2026-06-03. Demande Aziz : analyser le site, comprendre la techno, juger si reproductible.
> Catalogue brut (89 templates + prompts) : `_r-and-d-mapanimation-catalog.json`
> Clips échantillons (27) + contact sheets : `out/_r-and-d/mapanimation/`

---

## 1. Ce que c'est (verdict techno — PROUVÉ)

**Un générateur AI text-to-map-video. Pas un nouvel outil magique — une couche AI + renderer serveur par-dessus exactement notre stack.**

| Question | Réponse prouvée | Preuve |
|---|---|---|
| GeoLayers / After Effects ? | NON. "No After Effects" = argument marketing répété 2×. | grep HTML landing |
| Moteur carto ? | Carte vivante côté navigateur dans l'éditeur (derrière login). Landing = 0 moteur (jQuery + JS maison). | sondage réseau Playwright : aucun mapbox-gl/maplibre/webgl chargé sur la home |
| Livraison ? | .mp4 pré-rendus signés CloudFront : `cdn.mapanimation.io/{user}/VideoOutput/{id}.mp4` | URLs réseau |
| Le "cerveau" ? | Endpoint public `GetLandingPageTemplates` expose le `userPrompt` COMPLET = storyboard scène-par-scène (Camera/Fill/Text/timing à la seconde). | API JSON |
| Reproductible chez nous ? | OUI, intégralement. On fait déjà tout. Eux ont industrialisé : LLM prompt→params + render serveur→mp4. | analyse 27 clips |

**Le détail qui compte** : leurs prompts templates sont structurés EXACTEMENT comme nos Production Briefs (`SOUVERAIN-VISUAL-PLAYBOOK.md`). Ex #263 : "Scene 1 Hook 0-4s : zoom out monde, push-in. Scene 2 : highlight UK rouge, counter $0→$4T 1.5s, glow…". Même grammaire.

---

## 2. Catalogue (89 templates)

- Ratios : 40× 16:9, 49× 9:16. Premium : 13/89.
- 6 sections : What's new, Geopolitics & Current Affairs, Multi-Country Sequences, Geography, History, Travel and Places.
- 30 fps partout. Durées 9-60s. Previews souvent downscalées (480-1080p).
- **Gros vendeurs (usedCounter) = militaire/géopolitique tactique** (frappes F-35, tanks, drones Shahed). Angle hors charte Souverain — explique leur trafic, pas pour nous.

---

## 3. Mapping leurs templates → nous (les 2 axes demandés)

### AXE A — Mouvements caméra
| Leur effet (clip) | Notre équivalent | Verdict |
|---|---|---|
| Zoom + pan doux entre pays (#263, #72) | getCam + camCountryApproach | ✅ ON L'A |
| Sequential highlights pendant léger pan (#91, #154) | SequentialFlagReveal + drift | ✅ ON L'A |
| **Globe 3D sphérique qui tourne → zoom pays (#197, #141)** | `camCountryApproach` fait l'approche, MAIS on ne part jamais du **globe sphérique rotatif** | ⚠️ **GAP CAMÉRA** — Mapbox `projection:'globe'` à valider headless |
| **Globe stylisé parchemin → zoom région (#264)** | style Parchemin Mande existe, pas sur globe sphérique | ⚠️ variante du gap globe, idéale sujets historiques africains |
| Pull-back vers le globe en fin (#134) | pull back planétaire (Or Africain) | ✅ ON L'A (Mercator). Sphère = gap. |

### AXE B — Templates overlay
| Leur effet (clip) | Notre équivalent | Verdict |
|---|---|---|
| Fill plein pays vif + label + counter (#263, #112) | MapboxFlagFill / IsolateZone + GeoCountryPlaque + CountUp | ✅ ON L'A |
| Frontières trait fin coloré (#146) | SequentialBorderPulse / FiberOpticBorderDraw | ✅ ON L'A |
| Ripple/pulse concentrique depuis point (#146, #251) | LottieGeoAura (shockwave) | ✅ ON L'A |
| Fill séquentiel pays d'accueil (#134 "refugees") | SequentialFlagReveal | ✅ ON L'A |
| **Path/route dashed qui se DESSINE ville→ville + city markers (#96 Silk Road dorée, #268 sépia, #256 vol)** | `GeoFlowConnection` (`src/projects/warmap/_shared/GeoFlowConnection.tsx`) | ✅ **COMBLÉ 2026-07-09** (Soudan Acte 3) — tracé courbé + marqueur mobile indépendant + transformation couleur en cours de route, testé isolé avant intégration |
| **Marqueur animé (avion/icône) le long du path + camera follow (#256)** | Marqueur : ✅ fait (`GeoFlowConnection`). Camera follow : ⛔ **toujours un gap**, jamais codé | ⛔ **Référence concrète trouvée** : `_incoming/silk road 1.mov` (dézoom qui s'ouvre, pas la bonne réf) vs `_incoming/silk road 2.mov` (⭐ VRAIE caméra suiveuse, zoom serré permanent sur le point courant, jamais de vue d'ensemble — c'est la cible). Faisabilité vérifiée : `camAt()` déjà générique, il suffit d'une fonction `cameraFollowsPath(waypoints, t, zoom)` qui recalcule la `CamKey` à partir de la position du marqueur au lieu d'une séquence figée. Détail complet + decision : `memory/projects/soudan-midform-ACTE3-BREAKDOWN.md` § Décision 1bis. **Priorité 1 pour la reprise Acte 3.**

---

## 4. Conclusion actionnable

**On est au niveau ou au-dessus sur 90% du catalogue.** Notre arsenal Mapbox (28 templates) couvre fills, frontières, ripples, séquentiel, plaques, counters, hooks.

**2 vrais gaps, par ordre de valeur :**

1. ⛔ **`GeoFlowConnection`** (overlay) — path/route dashed animé point-à-point + city markers pulsants + (option) marqueur mobile le long du tracé. C'est LEUR template le plus réutilisé (3 variantes : Silk Road, vol, route sépia) et NOTRE seul manque overlay réel. Déjà identifié backlog NEXT-ACTION. Headless-safe : SVG path `stroke-dasharray` animé + centroïdes via `map.project()` frame-driven, JAMAIS filter:blur CSS. **Priorité 1.**

2. ⚠️ **Globe sphérique rotatif → zoom** (caméra) — Mapbox `projection:'globe'`. **Usage RARE chez eux** : seulement #197, #141, #264, #194. La GRANDE MAJORITÉ (dont TOUS les militaires premium) est en **Mercator à plat vue de dessus, zoomé serré sur le pays** (correction Aziz 2026-06-03). Le globe reste à valider en render headless. Si OK → variante parchemin pour empires africains. **Priorité 2, après POC faisabilité.**

NOTE PREMIUM : décodage complet des 13 templates premium dans `_r-and-d-mapanimation-PREMIUM-DECODE.md` — verdict : aucune techno secrète, juste sprite PNG (avion/tank/bateau) + assemblage de nos briques. Gap mineur = `RadarSweep` (secteur conique rotatif).

**Ce qu'on NE copie PAS** : l'angle militaire tactique (hors charte), le fond "Google Maps" routier clair (#72) — notre navy/parchemin est plus premium.

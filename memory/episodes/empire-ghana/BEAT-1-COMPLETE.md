# BEAT 1 EMPIRE DU GHANA — COMPLET (v5 livré 2026-05-03)

> Récap de la session de production Beat 1 + leçons apprises pour Beats 2-5.
> Ce document remplace l'ancien `AUDIT-PHASE-PRE-BEAT1.md` (audit pre-implementation).

---

## Livrable final

| Item | Path | Statut |
|------|------|--------|
| Render final Beat 1 | `out/empire-ghana/beat1-v5.mp4` (11.1 MB, 15.5s) | ✅ validé Aziz |
| Code source | `src/projects/atlas/empire-ghana/scenes/Beat1Setup.tsx` | ✅ |
| Composition Remotion | `EmpireGhanaBeat1Setup` (1080×1920, 30fps, 465 frames) | ✅ |
| Données géo précises | `data/geo/empire-ghana-data.json` (regenerée avec OHM + POI Wikipedia) | ✅ |
| Polygone Wagadou | `data/geo/empire-ghana/wagadou_ohm.geojson` (OHM relation 2822617, 23 vertices) | ✅ |
| Assets PixelLab Beat 1 | `public/empire-ghana/assets/pixellab/{koumbi-saleh,sac-or,sac-sel,seal-wagadou,gold-ingot-stack}.png` | ✅ |

## Trajet Beat 1 v1 → v5 (4 itérations)

| Version | Statut | Cause iteration |
|---------|--------|-----------------|
| v1 | ❌ | Zoom raté (centre canvas pas Wagadou), bloc noir bas, scène statique 13s, cartouche WAGADOU illisible |
| v2 | ❌ | Lottie ring/lingot/timeline trop pauvres (trapèze géométrique = pas un lingot), pays voisins highlightés sans contexte, zoom toujours raté |
| v3 | ⚠️ partiel | Architecture forkée Mansa Moussa OK, identité Ghana OK, mais : crossfade au lieu de zoom espace, sceau "richesse" hors contexte narratif, cartouches en bas |
| v4 | ⚠️ partiel | Spotlight insert SEL ⇌ OR validé, sprite Koumbi Saleh validé, cartouches en haut, MAIS zoom encore centré sur centre canvas (pas Wagadou) |
| **v5** | **✅ validé** | Fix zoom : pivot scale autour de Koumbi Saleh projeté `(255, 586)` sur globe ortho. Le globe zoome vraiment vers Wagadou maintenant. |

## Découvertes techniques majeures (à réutiliser)

### 1. Pattern Spotlight Insert (3e mode visuel)
Voir `feedback_atlas-spotlight-insert-pattern.md`. Background dim sur la carte + cartouche centré stylisé avec assets PixelLab. Pattern signature.

### 2. PixelLab map_object > Lottie pour objets réels
Voir `feedback_pixellab-objects-vs-characters.md`. Validation Beat 1 v4 : sceau, sacs, ville Koumbi Saleh donnent rendu premium impossible avec Lottie.

### 3. Cartouches TOP HALF uniquement
Voir `feedback_atlas-cartouches-top-only.md`. Bottom écran réservé sous-titres karaoke TikTok.

### 4. Données géo OpenHistoricalMap
Source vectorielle libre (ODbL) pour Wagadou, 23 vertices vs octogone manuel 8 vertices. Source académique vérifiée Wikidata Q206789.
Recipe applicable à d'autres empires historiques : `https://www.openhistoricalmap.org/relation/<id>` → Overpass API → GeoJSON → projection d3-geo.

### 5. Zoom espace pivot sur POI (vrai zoom continu)
Au lieu de scale autour du centre canvas (pas de centrage sur cible), calculer la position projetée de la cible sur la projection orthographique et pivoter le scale autour de ces coords :

```tsx
// Coords Koumbi Saleh sur globe ortho a la rotation courante
const koumbiGlobeX = interpolate(localFrame, [0, ZOOM_END], [255, 286], {clamp});
const koumbiGlobeY = 586;

<g transform={`
  translate(${360 - koumbiGlobeX * scale} ${640 - koumbiGlobeY * scale})
  scale(${scale})
`}>
  <AtlasGlobe ... />
</g>
```

Pattern réutilisable pour tout zoom espace → POI précis.

## Identité visuelle Ghana validée

- **Palette** : `GHANA_PALETTE` (or `#D4A574`, or vif `#E8B878`, bordeaux `#4A0E0E`, parchemin `#E8DCC0`, sépia)
- **Cartouches** : parchemin + bordure or épaisse (3px) + bordure intérieure bordeaux fine (1px)
- **Hachures empire** : duo or/bordeaux à 45° (`wagadouHatch` pattern)
- **Outline empire** : noir mat pointillé `dasharray="10 5"`
- **Police titres** : Cinzel (au lieu Cormorant Mansa Moussa)
- **Background** : sépia Ghana (NOIR_PROFOND → SEPIA_FOND gradient)

## Ce qui reste à intégrer pour assemblage final film

1. **Sous-titres karaoke** : forker `AtlasV2Subtitles` de Mansa Moussa V2 → adapter palette Ghana (highlight color or)
2. **Connexion Beat 0 → Beat 1** : timing et transition à valider quand tous les Beats seront prêts
3. **Vignette globale** : déjà en place, peut être affinée

## Plan Beats 2-5

### Beat 2 — Densité (frames 676-1462, ~26s)
"À Taghaza, au nord, le sel était extrait par blocs de quatre-vingt-dix kilos..."

Patterns à appliquer :
- Sprite PixelLab Taghaza (mineurs) au mot "Taghaza"
- Spotlight insert "90 KG par bloc" (cartouche stylisé + bloc sel PixelLab)
- Sprite caravane chameau qui traverse Sahara
- Sprite mosquée banco au mot "une mosquée"
- Pulse markers sur 3 POI (Taghaza, Bambouk, Koumbi Saleh) à mots-pivots
- Pan caméra Taghaza → Bambouk → Koumbi Saleh (utiliser `useSpringCamera` Mansa Moussa)
- Timeline cartouches en haut (chiffres 90 kg, 20 000)

### Beat 3 — Climax silent barter (frames 1462-2152, ~23s)
"Sur les marchés du sud, les marchands déposaient leur sel..."

Pattern signature :
- Spotlight insert ÉTAPE PAR ÉTAPE du silent barter (4 étapes)
- Assets : sac sel PixelLab + sac or PixelLab + balance commerciale + figurines marchand/acheteur
- Equilibre balance au mot "presque au poids égal"
- Camera zoom serré sur marché (mercClose projection au lieu de mercSahel)

### Beat 4 — Effondrement (frames 2152-2788, ~21s)
"Les Almoravides ont tout brisé en 1076..."

- Sprite guerrier almoravide à dos chameau (déjà en queue génération)
- Désaturation progressive territoire Wagadou (pattern Mansa Moussa S4 grisaillement)
- Sprite ruines banco grises au moment "effondrement"
- Spotlight insert sceau Mali émergent (sceau Wagadou existant + halo bordeaux)

### Beat 5 — CTA (frames 2788-3145, ~12s)
"Cinq siècles de commerce mondial... Florence, Venise, mais jamais Wagadou."

- Spotlight insert pile pièces or (Florence/Venise parallèle)
- Cartouche final "WAGADOU" centré + sous-titre signature
- Connexion newsletter/abonnement (à définir)

## Estimation production Beats 2-5

Avec les patterns établis et les assets pré-générés :
- Beat 2 : 1.5-2h (le plus complexe, 4-5 spotlights)
- Beat 3 : 1.5h (silent barter chorégraphie)
- Beat 4 : 1.5h (transition palette + effondrement)
- Beat 5 : 1h (court, CTA simple)
- Assemblage final + sous-titres karaoke + render final : 1h

**Total estimé Empire Ghana complet : 6-8h** (réparti sur 2-3 sessions).

## Documents produits cette session

### Mémoire (4 nouveaux fichiers)
1. `memory/feedback_atlas-non-negotiable-rules.md` — 13 règles absolues Atlas (créé v3)
2. `memory/feedback_atlas-technique-vs-visuel.md` — séparation forker vs adapter (créé v3)
3. `memory/feedback_atlas-spotlight-insert-pattern.md` — pattern signature 3e mode (créé v4)
4. `memory/feedback_pixellab-objects-vs-characters.md` — recette gagnante (créé v4)
5. `memory/feedback_atlas-cartouches-top-only.md` — règle absolue position (créé v4)
6. `memory/episodes/empire-ghana/BEAT-1-COMPLETE.md` — ce document

### Assets PixelLab Beat 1 (5 sprites)
- `koumbi-saleh.png` (forteresse banco)
- `seal-wagadou.png` (médaillon ornements mande)
- `sac-or.png` (sac brun + nuggets)
- `sac-sel.png` (sac pâle + cristaux)
- `gold-ingot-stack.png` (lingots, garde réutilisation)

### Assets PixelLab Beats 2-5 (8 sprites en cours génération)
- Mosquée banco grande
- Caravane chameau
- Stand marché
- Balance commerciale
- Guerrier almoravide
- Ruines banco grises
- Pile pièces or dinars
- Bloc sel mineurs

### Pipeline data
- `scripts/atlas/precompute-empire-ghana.mjs` mis à jour pour utiliser OHM + POI exacts
- `data/geo/empire-ghana-data.json` regénéré (POI corrects, polygone OHM 23 vertices)
- `data/geo/empire-ghana/wagadou_ohm.geojson` (source raw)

## Cleanup effectué

- Supprimé fichiers v1/v2/v3 obsolètes (Beat1SetupA, Beat1SetupB, Beat1SetupWithOverlay, InsertRichesseFullscreen, 3 Lottie défunts)
- Renders v3/v4 supprimés, seul `beat1-v5.mp4` conservé
- Imports Root.tsx nettoyés (une seule composition `EmpireGhanaBeat1Setup`)
- Frames de debug `/tmp/beat1-frames/`, `/tmp/v4-frames/`, `/tmp/zoom-frames/` à nettoyer en fin session

## Crédits données

- **OpenHistoricalMap** (ODbL, attribution requise dans crédits vidéo) — relation 2822617 Wagadou
- **Wikipedia** — coordonnées Koumbi Saleh, Taghaza, Bambouk
- **Wikidata Q206789** — entité Empire du Ghana

---
name: flagfill-templates-decouverte-2026-06-02
description: Découverte 2026-06-02 — deux templates FlagFill puissants qui colorient la carte Mapbox. Règle numéro 1 pour des scènes cartographiques vivantes.
metadata:
  type: feedback
---

> ⚠️ MAJ 2026-06-25 : sur carte AVEC PITCH, useClipFlags/fill-pattern sont BANNIS (dérive au pitch, carrelage au dézoom) → utiliser `MapboxCountryFlagDecal` (source-image). Voir `CARTO-OVERLAYS-PRINCIPES.md`. Les méthodes ci-dessous restent valides UNIQUEMENT à pitch=0.

## Règle : La carte Mapbox DOIT être colorée dès le départ

La partie manquante de toutes nos scènes Mapbox jusqu'ici : on laissait les pays voisins gris/vides. Le remplissage de couleur (fill-pattern drapeau, fill-color couleur unie) est la règle N°1, pas une option.

**Why:** Session 2026-06-02 — après 18 versions de Beat 1, la découverte fondamentale est que notre carte Mapbox est faite pour être colorée. Dès qu'on projette les drapeaux dans les silhouettes, la carte passe de "grise et morte" à "vivante et narrative". C'est ce que font toutes les chaînes cartographiques premium (Jacque a dit, etc.) sans exception.

**How to apply:** Pour TOUTE nouvelle scène Mapbox, la première question est "quels pays colorie-t-on et comment ?" avant même de penser aux mouvements de caméra ou aux overlays texte.

---

## Template A — FlagFill Focus Un Pays

**Fichier FINAL :** `out/templates-souverain/FINAL-FlagFill-FocusUn-V.mp4`
**Catbox :** https://files.catbox.moe/2a9m6l.mp4

**Principe :** 1 pays principal avec son vrai drapeau projeté (fill-pattern canvas). Pays secondaires en couleur unie (fill-color). Reste de la carte gris neutre ivory 3%.

**Quand l'utiliser :** Beat où UN pays est le protagoniste unique. Le reste sert de contexte coloré sans voler le focus. Ex: Beat 0 Hook, Beat 3 Acteurs.

**Technique :**
- `drawMarocFlagCanvas(512)` — canvas pur, synchrone, dispo à f0
- `fill-pattern` Mapbox avec `pushCanvas(map, "flag-mar", canvas)`
- Pays secondaires : `fill-color` + couleur hex unie (rouge, bleu, etc.)
- `fill-opacity` animée via `safe()` dans engine frame

---

## Template B — FlagFill Multi-Pays (tous les drapeaux)

**Fichier FINAL :** `out/templates-souverain/FINAL-FlagFill-MultiPays-V.mp4`
**Catbox :** https://files.catbox.moe/n9jxx7.mp4

**Principe :** Chaque pays concerné reçoit son vrai drapeau projeté séquentiellement. Les drapeaux s'allument dans l'ordre narratif (synchronisé avec les arcs ou la voix).

**Quand l'utiliser :** Beat de connexion géopolitique multi-pays. Le réseau de relations est le sujet. Ex: Beat 1 Phosphate (Maroc→ESP/FRA/DEU), tout beat "flux commercial/diplomatique".

**Technique :**
- Drapeaux ESP/FRA/DEU : fichiers PNG locaux dans `public/_shared/flags/` (générés Python Pillow)
- Chargement via `staticFile()` — headless-safe, pas de fetch externe
- `loadFlagCanvas(filename, 256)` → `pushCanvas(map, "flag-xxx", canvas)`
- Apparition séquentielle : F_ESP → F_FRA → F_DEU espacés de 20f chacun
- Labels destination CSS React avec mini-drapeau `<img>` + nom pays

---

## Règles techniques (NON-NEGOTIABLE pour toute future scène)

1. **Drapeaux en local** — JAMAIS de fetch `flagcdn.com` en headless. Toujours `public/_shared/flags/` via `staticFile()`.
2. **Drapeau pays principal** — canvas pur `drawXxxFlagCanvas()` sans fetch, disponible à f0.
3. **Dots par-dessus les fills** — ajouter les `circle` layers EN DERNIER dans `style.load` pour qu'ils s'affichent par-dessus les `fill-pattern`.
4. **Dots CSS React** — pour les dots critiques (visibles sur fond de drapeau), utiliser `div` CSS positionné via `map.project()` au lieu de `circle` Mapbox (les circle Mapbox se cachent sous les fill-pattern).
5. **Taille fill-pattern** — 512px minimum pour éviter le tiling visible sur les grands pays.
6. **Couleurs narratives** — chaque couleur doit signifier quelque chose : Maroc = rouge drapeau, Europe marché = drapeau réel, reste = ivory 3% (neutre).

---

## SESSION FILL-PATTERN COMPLÈTE — 2026-06-03 (tout le backlog ci-dessous est CODÉ)

10 templates en 4 niveaux + 2 bibliothèques helper. Tous dans `src/projects/_shared/mapbox/`, compositions Root V+H, previews catbox dans CATALOGUE-CARTE-VIVANTE.

**Helpers fondation (réutilisés par tous) :**
- `flagCanvas.ts` ⭐⭐ — 45 drapeaux canvas pur, `pushFlagToMap(map, iso)`, `drawFlagCanvas(iso, size)`. Zéro fetch. Pays africains majeurs + CHN/USA/GBR/RUS/JPN/BRA/IND/SAU/ARE + UE.
- `resourceTextures.ts` ⭐ — 6 textures bichromie navy/gold (oil/gold/phosphate/agriculture/lithium/gas), `drawResourceTexture(type, size)`.

**N1 Fondations :** FlagFillStatic (1 drapeau + voisins couleurs), FlagFillSequence (drapeaux séquentiels synchro voix).
**N2 Textures :** ResourceTextureFill ⭐⭐ (le pays rempli de sa ressource), HeatGradientFill (choropleth qui chauffe avec la voix, 5 palettes).
**N3 Avancés :** WavingFlagFill (drapeau ondulant frame/frame), FlagDissolveTransition (crossfade drapeau A→B, AES), ImageProjectionFill (image bichromisée dans polygone — `bichromize()` luminance→navy/gold), PulsingRegionFill (territoire entier qui respire).
**N4 Combo :** ContagionFlagSpread (onde d'alliance : flash couleur → drapeau remplace).

**Technique clé ImageProjectionFill :** charge image → `bichromize()` (luminance ITU-R BT.709 → interp navy↔gold + contraste) → pushCanvas fill-pattern. Asset gen via `scripts/tools/gemini-gen-image.py` (text-to-image, modèle `gemini-3.1-flash-image-preview`). 1er asset : `public/_shared/refs/textures/khouribga-mine-satellite.png` (vue satellite mine phosphate). Preview : https://files.catbox.moe/7opcc9.mp4

**2 GOTCHAS HEADLESS résolus (valent pour TOUT fill-pattern/fill-color) :**
1. **Filtre ISO, jamais `name`** ⚠️ BUG QUI A TOUCHÉ 7 TEMPLATES — `["in",["get","iso_3166_1_alpha_3"],["literal",["MAR","ESH"]]]` matche, `["in",["get","name"],...]` NON fiable en headless (le pays principal restait GRIS/vide). Tous les templates utilisant `geoName` (FlagFillStatic, FlagFillSequence, ResourceTextureFill, HeatGradientFill, WavingFlagFill, FlagDissolveTransition, PulsingRegionFill) avaient le bug. CORRIGÉ 2026-06-03 : helper central `countryFilter(iso, boundaryIsos)` dans `flagCanvas.ts`, prop `boundaryIsos` partout (geoName conservé mais IGNORÉ). RÈGLE : pour tout fill country-boundaries-v1, TOUJOURS `countryFilter()`, jamais un filtre sur `name`. Détection : extraire frame + vérifier que le pays PRINCIPAL est rempli (pas juste les voisins).
2. **Image async = `delayRender`/`continueRender`** — précharger + bichromiser les images dans un useEffect AVANT l'init carte, stocker les canvas prêts dans une ref, push via l'engine frame (flag `pushedRef` pour push une seule fois). Sans delayRender, le 1er frame render avant le chargement → polygone vide. PAS de `crossOrigin="anonymous"` sur staticFile local (canvas tainted → getImageData throw).

**Pattern commun à tous :** carte Mapbox continue (drift bearing), `applyGeoAfriqueV5`, fond neutre ivory 4%, fill-pattern/fill-color via `safe()` setPaintProperty frame-driven, prop `children` pour overlays. geoName accepte tableau (Maroc+Sahara).

## Reste backlog (non codé)
- Transition fill-color → fill-pattern progressive dans le même beat (couvert partiellement par ContagionFlagSpread).
- Flux inter-pays (flèches animées) — séparé du fill-pattern.

Lié : [[sfx-sequence-et-drapeaux-reels]] (bugs SFX + drapeaux réels découverts même session) · [[pipeline-mapbox-maturite-autonomie]] (maturité pipeline, self-review scriptée) · [[philosophie-mapbox-puis-remotion]] (ordre de production Mapbox-first)

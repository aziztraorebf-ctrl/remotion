# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-07
**Session active :** Production moteur Sahel V2 + Hook Act 1

---

## État actuel

| Composant | Statut | Notes |
|-----------|--------|-------|
| Script V4-final | FINAL | `SCRIPT-V4-FINAL-2026-06-07.md` |
| Audio narration V1 | FINAL | `narration-v1.mp3` (439.37s, 7:19) |
| Forced alignment | FINAL | `narration-v1-alignment.json` (2099 mots, loss=0.2965) |
| Timing triggers | FINAL | `TIMING-V1-2026-06-07.md` (27 triggers) |
| sahel.warmap.json | FINAL | 15 jalons + 6 véhicules + 3 réfugiés + 2 overlays |
| SahelControlData.ts | FINAL | Import JSON via adapter canonique |
| SahelWarMapEngine.tsx | V2 OPÉRATIONNEL | Hook Act 1 codé script-first, villes progressives, caméra drift corrigée |
| Hook Acte 1 | V3 RENDU | catbox litter.catbox.moe/nl5u0g.mp4 (30s @50%) |
| GeoJSON admin-1 | APPROXIMATIF | Bbox 5-pts — formes réelles à générer |
| Sprites véhicules | PRÉSENTS | `tech-td-red.png` + `tank-td-blue.png` confirmés dans `public/_shared/sprites/warmap/` |
| Sprites réfugiés | PRÉSENT (générique) | `portrait-civil.png` existe — 3 visages Sahel distincts restent à générer Gemini |
| Doctrine script-first | AJOUTÉE | `WARMAP-LONG-DOCTRINE.md` section "RÈGLE ABSOLUE" + traçabilité `// SCRIPT:` obligatoire |

---

## Ce qui fonctionne (validé V2)

- Carte Sahel parchemin centrée Mali+Burkina+Niger
- Couleurs factions : bleu (état), rouge (JNIM), or (contesté)
- Légende 3 factions haut-gauche
- Date + label jalon haut-droite
- Labels villes **progressifs** (apparaissent au mot exact de la narration)
- Drift caméra **perceptible** (amplitude ×3 vs V1)
- Caméra **figée 2s** pendant "Comment est-ce possible ?" (f572→f632)
- **Hook Act 1 codé script-first** : 3 flashs pays blancs + anneau CEDEAO + vecteurs capitales → Liptako or + carton freeze
- HUD parchemin (même esthétique Sudan)
- Véhicules **taille ×2.5** (lisibles en 16:9)
- Véhicules **audio-triggered** (JNIM f1198, FAMa f7279, CSP f8683)
- Overlay AES née (f7014)
- CTA final (f13200)
- Composition enregistrée `SahelWarMap` dans Root.tsx

---

## Triggers hook Act 1 (depuis forced alignment)

| Frame | Mot | Événement codé |
|-------|-----|----------------|
| f150 | "expulsé" | Flash blanc radial Mali |
| f231 | "Rompu" | Flash blanc radial Burkina |
| f301 | "Quitté" | Flash blanc radial Niger |
| f382 | "continent." | Anneau CEDEAO clignote orange × 3 → s'éteint |
| f502 | "nouveau." | 3 vecteurs capitales → Liptako pulse or |
| f572 | "possible" | CARTE FIGÉE 2s + carton "Comment est-ce possible ?" |
| f726 | "répondre" | Drift reprend |

---

## Problèmes ouverts (à corriger avant render final)

1. **GeoJSON approximatif** : sahel-admin1.geojson = bbox rectangulaires. Générer le vrai GeoJSON Natural Earth/GADM admin-1 Mali+BF+Niger. Script : `python3 scripts/warmap/generate-sahel-admin1.py`

2. **Portraits réfugiés Sahel** : `portrait-civil.png` générique Sudan utilisé pour l'instant — 3 visages sahéliens distincts (homme/femme/enfant, traits ouest-africains) à générer Gemini pour la version finale.

3. **Map Animation non intégré** : flèches tactiques Act 3 (offensive Kidal) + expansion territoriale Act 2 + flux réfugiés Act 4 à coder en session parallèle (voir backlog ci-dessous).

4. **Overlay AES née** : apparaît frame ~7014 — à valider visuellement au bon timing sur rendu complet.

5. **Vecteurs hook** : SVG basique `map.project()` — à upgrader vers `AtlasAttackArrow` (flèches qui poussent progressivement plutôt qu'apparaître) en prochaine session.

---

## Backlog Map Animation — À coder en session parallèle (PROCHAINE SESSION)

Priorité par impact sur la vidéo Sahel :

| # | Template | Acte Sahel concerné | Brique à créer |
|---|---|---|---|
| 1 | **Territorial Expansion organique** | Act 2 — expansion rouge 2012→2022 | Zone colorée qui GRANDIT progressivement (pas instantanée) |
| 2 | **Refugee Flow en rubans** | Act 4 — 3M déplacés | Flux animé en ruban depuis Djibo/Ménaka/Tillabéri vers le sud |
| 3 | **Army Arrows parchemin** | Acts 1, 2, 3 | `AtlasAttackArrow` adapté Mapbox — flèches qui **poussent** progressivement |
| 4 | **River Flow animation** | Act 2 — contexte fleuve Niger | SVG path animé sur tracé géographique réel |

Ces 4 templates + la doctrine de session parallèle : `memory/_r-and-d-mapanimation-ANALYSE.md` + `memory/_r-and-d-mapanimation-PREMIUM-DECODE.md`.

---

## Fichiers clés

- **Moteur** : `src/projects/warmap/engine/SahelWarMapEngine.tsx`
- **Data** : `src/projects/warmap/data/sahel.warmap.json`
- **Control** : `src/projects/warmap/engine/SahelControlData.ts`
- **Audio** : `public/_shared/audio/sahel-warmap/narration-v1.mp3`
- **GeoJSON** : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (bbox approximatif)
- **Alignment** : `public/_shared/audio/sahel-warmap/narration-v1-alignment.json`
- **Doctrine** : `memory/doctrines/WARMAP-LONG-DOCTRINE.md` (règle script-first ajoutée)
- **Renders WIP** : `out/episodes/warmap-sahel/wip/`
  - `sahel_hook_v3.mp4` — Hook 30s @50% — catbox litter.catbox.moe/nl5u0g.mp4

---

## Prochaines actions (ordre priorité)

1. **Session parallèle Map Animation** : coder les 4 templates du backlog ci-dessus AVANT de s'attaquer au render final
2. **Intégrer Map Animation dans le moteur** : remplacer SVG bruts hook par `AtlasAttackArrow` Mapbox + ajouter expansion territoriale Act 2 + tenaille Kidal Act 3
3. **Générer vrai GeoJSON** admin-1 Sahel (Natural Earth / GADM)
4. **Générer portraits réfugiés** Gemini (3 visages Sahel distincts)
5. **Animatic complet** (439s) via render-on-vercel.py
6. **Validation Aziz** sur l'animatic complet

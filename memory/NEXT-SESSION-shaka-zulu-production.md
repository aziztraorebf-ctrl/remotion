# NEXT SESSION — Atlas Shaka Zulu : Production Phase 2

> Créé : 2026-05-02 | Mis à jour : 2026-05-02 fin session | Statut : PRÊT POUR PRODUCTION VISUELLE
> Ce brief est le starter de la prochaine session. Tout ce qui était bloquant est résolu.

---

## CE QUI EST DONE (ne pas refaire)

### Script
- **Script V5 VALIDÉ** par Aziz — 150s, format Atlas Hybride
- Fichier référence : `scripts/tools/generate-shaka-narration.py` (script inline)
- TTS scan : propre (no e/ee traps, no ont+voyelle, no digits)

### Audio
- **narration-v5.mp3 GÉNÉRÉE** : `public/audio/atlas-shaka-zulu/narration-v5.mp3`
- Durée : **150.32s** — validée Aziz (2min30, acceptable pour densité Atlas)
- Voix : Narratrice GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`), eleven_v3, max-style
- Fichiers obsolètes dans le même dossier : narration-v3.mp3 (135s, trop condensé), narration-v3.mp3 écrasé par erreur avec V4 (163s) → **utiliser narration-v5.mp3 uniquement**

### Assets PixelLab MCP (GÉNÉRÉS ET TÉLÉCHARGÉS)
- **Shaka Zulu** — character ID `e8c38444-1739-42a5-86ae-40fa0950e947`
  - Rotations : 4 directions (south/east/north/west)
  - Animations : walking (6 frames x4 dir) + fight-stance-idle-8-frames + breathing-idle
  - ZIP extrait : `public/atlas-shaka-zulu/assets/shaka-mcp/`
  - Structure : `rotations/` + `animations/walking-ba529e39/` + `animations/animating-a04dc52d/` (fight-stance)
- **Zulu Warrior** — character ID `33e221bd-5b9c-4e55-b729-cfeb534c1bd1`
  - Rotations : 4 directions
  - Animations : walking (6 frames x4 dir)
  - ZIP extrait : `public/atlas-shaka-zulu/assets/warrior-mcp/`
  - Structure : `rotations/` + `animations/walking-38346bae/`
- **NE PAS UTILISER** : assets SDK frame-par-frame dans `shaka-walk-east/` etc. (drift de style)

### Fact-check
- Rapport complet 131 sources : `research/multistep_fact_check_historique_shaka_zulu_pour_video_educative_1_tail_20260501_2208.md`
- Chiffres validés :
  - Tribu avant Shaka : **1 500 personnes** ✓
  - Guerriers apogée : **40 000-50 000** (on dit 50 000) ✓
  - Territoire : **~30 000 km²** ✓
  - Deuil Nandi : **4 000 Zulus** (pas 7 000 — mythe européen) + source JSA obligatoire à l'écran ✓
  - Cornes de buffle : dire "réinvente" pas "invente" ✓
  - Assassinat 22 sept 1828 : Dingane + Mhlangana ✓

---

## STRUCTURE VIDÉO VALIDÉE

| # | Segment | Durée ~| Visuel carte | Insert(s) |
|---|---------|--------|--------------|-----------|
| 0 | Hook | 5-6s | Non | Shaka plein écran (Seedance OU PixelLab — tester les deux) |
| 1 | Setup géo | 13-15s | Globe ortho → zoom KwaZulu-Natal | Insert "1 500" géant sur fond noir ~3s |
| 2 | Innovations militaires | 30-34s | Triple-screen (carte + guerrier + panel) | Insert iklwa + Insert bouclier + Insert cornes de buffle |
| 3 | Expansion | 18-20s | Territoire grandit + flèches Mfecane | Insert bar chart 1 500→50 000 + ligne "20% vs 5%" |
| 4 | Spirale Nandi | 28-30s | Palette bascule or → bordeaux | Insert "4 000" + source JSA sur écran sombre |
| 5 | CTA | 8-10s | Non | Cascade Napoléon / Alexandre / Shaka |

### Règle des inserts (DÉCISION AZIZ — 2026-05-02)
- Les inserts **accompagnent la narration** — ils ne la remplacent pas et n'ajoutent pas de durée
- Pendant un insert, la narration continue de jouer, la carte disparaît momentanément
- Les inserts sont des **pattern interrupts visuels** — chaque segment en a au moins un
- Chaque insert est une `<Sequence>` Remotion indépendante qui s'overlay sur la composition principale
- Durée typique par insert : 4-8s

### Inserts S2 — style à décider (tester les deux)
- **Option A** : objets PixelLab (pixel art) — iklwa, bouclier, formation cornes
- **Option B** : illustrations Gemini style parchemin militaire
- Aziz choisit après visionnage des deux versions

**Lignes de séparation triple-screen** : bordeaux (couleur Zulu) — validé Aziz
**Reveal triple-screen** : séquentiel (carte → panel BG à +0.3s → panel BD à +0.6s)
**Rythme** : 1 événement visuel minimum toutes les 1.5s (pattern Mansa Moussa)
**Éléments simultanés sur carte** : OK superposer fond + bordures + labels + markers + flèches — règle = un seul élément qui CHANGE à la fois

---

## PRIORITÉS SESSION SUIVANTE (dans l'ordre)

### Priorité 1 — Whisper alignment sur narration-v5.mp3
```bash
python3 scripts/whisper-align.py public/audio/atlas-shaka-zulu/narration-v5.mp3
```
Résultat → `narration-v5-alignment.json` → timestamps mot-par-mot → base timing.ts

### Priorité 2 — Plan technique complet (timing.ts + inserts)
Avant tout code : produire le storyboard technique avec timestamps précis par segment et par insert.
Base : alignment Whisper + structure 6 segments validée ci-dessus.

### Priorité 3 — Objets PixelLab (iklwa + bouclier) — Option A inserts S2
Via `create_map_object` MCP :
- Iklwa (lance courte Zulu) — vue side — 128-192px
- Bouclier cowhide Zulu — vue front — même taille
Coût : 2 crédits (on est à ~18/2000)

### Priorité 4 — Inserts S2 Gemini parchemin — Option B inserts S2
- Illustration iklwa style parchemin militaire
- Illustration bouclier style parchemin
- Schéma formation cornes de buffle top-down (centre or + flancs bordeaux + ennemis gris)

### Priorité 5 — Hook (tester en parallèle)
- **Option A** : Seedance Papercraft Zulu 5s (lire seedance-rules.md + définir palette Zulu avant)
- **Option B** : PixelLab Shaka plein écran avec breathing-idle animation

### Priorité 6 — Remotion composants
Dossier projet : `src/projects/shaka-zulu/` (créé, vide)
Composants à créer (réutiliser atlas-v2-components.tsx) :
- `AtlasShakaHook.tsx`
- `AtlasShakaS2TripleScreen.tsx` (composant signature, nouveau)
- `AtlasShakaS3Expansion.tsx` (flèches Mfecane bezier animées)
- `AtlasShakaS4Spirale.tsx` (bascule palette or → bordeaux)
- `AtlasShakaInsert.tsx` (composant réutilisable pour tous les inserts)
- `AtlasShakaFull.tsx`
Precompute : adapter `scripts-atlas/precompute-atlas-v2-data.mjs` pour KwaZulu-Natal

---

## DÉCISIONS EN ATTENTE (demander Aziz en début de session)

1. Hook final : Seedance ou PixelLab ? → tester les deux, Aziz choisit après visionnage
2. Inserts S2 : PixelLab pixel art ou Gemini parchemin ? → tester les deux, Aziz choisit
3. Formation cornes : incluse dans inserts S2 Option A (PixelLab) ou Option B (Gemini) — même décision
4. Musique : isicathamiya (chant a cappella Zulu) ou ingoma (percussions guerrières) ? → Minimax

---

## COORDONNÉES GÉOGRAPHIQUES (pour precompute)

```js
const COORDS = {
  kwazuluNatal:  { lon: 31.0,  lat: -28.5 },  // centre KwaZulu-Natal
  ulundi:        { lon: 31.4,  lat: -28.3 },  // capitale Zulu
  gqokliHill:   { lon: 30.7,  lat: -28.1 },  // bataille 1818
  durban:        { lon: 31.0,  lat: -29.9 },  // côte référence
  africaSud:     { lon: 25.0,  lat: -29.0 },  // vue large Afrique du Sud
  afriqueGlobe:  { lon: 20.0,  lat: -15.0 },  // globe ortho hook
}
```

---

## STARTER PROMPT SESSION SUIVANTE

Lire `memory/NEXT-SESSION-shaka-zulu-production.md` en début de session.

Statut : script V5 validé (150s), narration-v5.mp3 générée, assets PixelLab Shaka + Warrior dans `public/atlas-shaka-zulu/assets/`.

Structure vidéo : 6 segments, chaque segment a au moins un insert pattern-interrupt (décision Aziz 2026-05-02). Les inserts accompagnent la narration sans l'interrompre ni ajouter de durée.

Priorité 1 : Whisper alignment narration-v5.mp3 → timing.ts.
Priorité 2 : objets PixelLab iklwa + bouclier (Option A inserts S2) EN PARALLÈLE avec illustrations Gemini parchemin (Option B).
Priorité 3 : hook Seedance + hook PixelLab en parallèle.

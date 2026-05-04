# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-05-04 fin session — EMPIRE GHANA 95% COMPLET (3 fixes restants prochaine session)
> **EMPIRE DU GHANA = 95% COMPLET** — Render v2 validé Aziz : https://files.catbox.moe/lxzqvr.mp4 (105s, 19.1 MB). Branche `feat/atlas-empire-ghana`.
> **3 fixes restants** (~2-3h prochaine session) : (1) CTA 10s plein écran manquant, (2) écran noir 5-7s entre Hook et Beat 1, (3) vraies frontières Mali via OpenHistoricalMap.
> **SHAKA ZULU = PAUSE STRATEGIQUE** (mismatch format Atlas / contenu psycho-militaire). Branche `feat/atlas-shaka-zulu-vague1` preserve l'etat.
> **PIPELINE ATLAS = TRES MATURE** : d3-geo + Natural Earth + walk cycle PixelLab + custom animations PixelLab + map_objects + 7 SFX ElevenLabs + sous-titres karaoke Whisper.
> **3 SHORTS PRETS POSTIZ** : Mansa Moussa V2, Thiaroye V5, Sonjata V7 (dans `out/PRET-PUBLICATION/`).
> **EMPIRE GHANA = 4e Short** post-CTA.

---

## EMPIRE DU GHANA — Etat fin session 2026-05-03

### Tout ce qui est PRET pour production

| Phase | Livrable | Statut |
|-------|----------|--------|
| Script V3 LOCKED | `memory/episodes/empire-ghana/script-v3-locked.md` (~86.5s, ~190 mots, mention "d'esclaves" Beat 2) | ✅ |
| Audio narration | `public/audio/atlas-empire-ghana/narration-v1.mp3` (104.9s, ElevenLabs eleven_v3) | ✅ |
| Forced Alignment | `src/projects/atlas/empire-ghana/ghana-alignment.ts` (loss 0.094, excellent) | ✅ |
| Whisper word-level | `src/projects/atlas/empire-ghana/whisper-words.ts` (211 mots) | ✅ |
| timing.ts | `src/projects/atlas/empire-ghana/timing.ts` (6 segments calculés) | ✅ |
| Musique choisie | `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` (Toumani Diabate style) | ✅ |
| Carte d3-geo | `data/geo/empire-ghana-data.json` (Sahel + POI Taghaza/Bambouk/Koumbi Saleh) | ✅ |
| Marchands PixelLab | `public/empire-ghana/characters/sahelien/` + `berbere/` (3 anims × 4 dirs chacun) | ✅ |
| Palette officielle | `src/projects/atlas/empire-ghana/components/GhanaPalette.ts` (hybride ATLAS_COLORS + GHANA_PALETTE) | ✅ |
| Lottie balance | `src/projects/atlas/empire-ghana/tests/balance.json` | ✅ |
| Manifest visuel | `src/projects/atlas/empire-ghana/empire-ghana-manifest.json` (288 lignes) | ✅ |
| VAGUE 1 LOCKED | `memory/episodes/empire-ghana/VAGUE-1-LOCKED.md` (8 idées validées) | ✅ |
| DECISIONS LOCKED | `memory/episodes/empire-ghana/DECISIONS-LOCKED.md` (palette + musique + popup style) | ✅ |
| Jury Pass 1 + 2 | `memory/episodes/empire-ghana/jury-pass1/` + `jury-pass2/` (3 LLMs chacun) | ✅ |
| Proof-of-concept | `out/tests/silent-barter-v3-production.mp4` (vraie carte + sprites + Lottie + palette) | ✅ |
| Dashboard live | https://smooth-oyster-6zb2.here.now/ + claim URL dans `memory/episodes/empire-ghana/dashboard-url.md` | ✅ |
| Branche git | `feat/atlas-empire-ghana` (commit 273108e + pré-production) | ✅ |

### Coût total session

| Item | Coût |
|------|------|
| Jury Pass 1 + 2 (3 LLMs × 2) | $0.046 |
| ElevenLabs narration | ~$0.30 |
| Forced Alignment | ~$0.05 |
| Whisper | ~$0.02 |
| Minimax 3 musiques | ~$1.50 |
| PixelLab 26 jobs | $0 (forfait 2000/mois) |
| **TOTAL** | **~$2.00** |

### BEAT 0 HOOK — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat0Hook.tsx | ✅ validé Aziz v8 |
| AtlasGlobeHook dans _shared | ✅ composant réutilisable créé |
| Render final | `out/empire-ghana/beat0-v8.mp4` |
| Commit | bec3a4a |

### BEAT 1 SETUP — VALIDÉ (2026-05-03 session production v1→v5)

| Item | Statut |
|------|--------|
| Beat1Setup.tsx | ✅ validé Aziz v5 |
| Architecture | ✅ forkée Mansa Moussa V2 (SVG racine 720×1280, AtlasGlobe + AtlasMercator) |
| Données géo | ✅ OpenHistoricalMap relation 2822617 (23 vertices, ODbL) + POI Wikipedia exact |
| Identité visuelle | ✅ palette Ghana (parchemin/or/bordeaux), Cinzel, hachures duo or/bordeaux |
| Spotlight insert SEL ⇌ OR | ✅ 3e mode visuel signature inventé (background dim + assets PixelLab) |
| Sprite Koumbi Saleh sur carte | ✅ PixelLab map_object intégré |
| Cartouches en haut | ✅ règle TOP HALF respectée (bottom = sous-titres) |
| Zoom espace pivot Koumbi | ✅ vrai zoom continu vers Wagadou (pas centre canvas) |
| Render final | `out/empire-ghana/beat1-v6-final.mp4` (sprite Koumbi animé 4-frames + pulse + halo simultanés) |

### 5 Fichiers mémoire créés cette session
1. `feedback_atlas-non-negotiable-rules.md` — 13 règles absolues
2. `feedback_atlas-technique-vs-visuel.md` — séparation forker/adapter
3. `feedback_atlas-spotlight-insert-pattern.md` — pattern signature
4. `feedback_pixellab-objects-vs-characters.md` — recette gagnante
5. `feedback_atlas-cartouches-top-only.md` — règle position
+ `episodes/empire-ghana/BEAT-1-COMPLETE.md` (récap complet)

### 13 assets PixelLab catalogués (Beats 1-5)
- Beat 1 : `koumbi-saleh`, `seal-wagadou`, `sac-or`, `sac-sel`, `gold-ingot-stack`
- Beats 2-5 (pré-générés) : `mosquee-banco`, `caravane-chameau`, `stand-marche`, `balance-commerciale`, `guerrier-almoravide`, `ruines-banco`, `pieces-or-dinars`, `bloc-sel-mine`
- Tous dans `public/empire-ghana/assets/pixellab/`

---

### BEAT 2 DENSITY — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat2Density.tsx | ✅ validé Aziz v4 |
| Render final | `out/empire-ghana/beat2-v4.mp4` (21.7 MB, 786f) |
| 2 chameaux file indienne | ✅ walk cycle PixelLab SDK, spritesheet 4 frames |
| Mosquée supprimée | ✅ (sur-chargement carte) |
| Caravane au bon timing | ✅ mot "caravane" 44.02s → frame 1321 |

**Nouvelles règles apprises :**
- Max 3 sprites statiques simultanés sur carte (pas de 4e POI)
- File indienne = même trajectoire `getChameauPos()` + délai 50f sur le 2e — stagger temporel seul ne suffit pas
- SDK `animate_with_text` = fallback quand GIF PixelLab non téléchargeable via API (negative_description="" obligatoire, `.pil_image()` pas `.to_image()`)

### BEAT 3 SILENT BARTER — VALIDÉ (2026-05-03)

| Item | Statut |
|------|--------|
| Beat3Barter.tsx | ✅ validé Aziz v4 |
| Render final | `out/empire-ghana/beat3-v4.mp4` (22 MB, 690f) |
| Camera-track sprites CSS | ✅ helper `svgToCompWithCam` (projection coords SVG → composition selon caméra) |
| Zoom amplifié | walk 2.8x, crouch 3.2x (insert détail), dolly-out 2.4→1.0 |
| Marchands berbere + sahelien | ✅ walk south + crouch + walk north (pattern SilentBarterTestV3 porté) |
| Sacs au pied du sprite | ✅ drop points séparés du POI Koumbi |
| Balance PixelLab PNG | ✅ remplace Lottie SVG (plus visible) |
| Dolly-out final + empire pulse | ✅ OR_VIF fill direct + outline gold (3→11px) + routes glow néon |
| Cartouche "5 SIÈCLES" | ✅ apparaît pendant pull-back final |

### Prochaine scène = Beat 4 Effondrement (frames 2152→2788, ~21s)

**Brief prochaine session** : `memory/episodes/empire-ghana/NEXT-SESSION-beats-4-5.md` (starter prompt + pistes créatives + règles)

**Décision finale Beat 3** : pas d'insert plein écran. Le pattern marchands animés + camera-track + dolly-out raconte l'histoire complètement. Pattern réutilisable cross-épisodes.

### Skill atlas-video-preproduction activera automatiquement ce workflow

Au démarrage prochaine session, le skill `atlas-video-preproduction` charge SKILL.md + checklists pour cadrer la production. Voir `~/.claude/skills/atlas-video-preproduction/checklists/pre-flight-production.md`.

---

---

## DECISION SHAKA ZULU PAUSE (2026-05-03)

### Raisons
1. **Mismatch format/contenu** : Shaka raconte innovation militaire + psychologie + rituels = abstraction tactique + intériorité + culturel. Le format Atlas-carte est mal adapté pour ce type d'histoire (pas territoire/mouvement).
2. **Production en bagaille** : 9 scènes, dont 6 jamais visuellement validées avant audit 2026-05-03. Le concat audit révèle le manque de cohérence narrative.
3. **Pipeline Atlas pas encore mature** : on découvrait encore en route. Shaka aurait demandé 2-3 sessions ciblées de finition (6-12h) sans garantie de qualité.
4. **Format alternatif prouvé** : Sonjata Papercraft V7 (Seedance) = même profil narratif que Shaka. Si retour Shaka un jour, format naturel = Seedance Shorts, pas Atlas.
5. **Warm-up reseaux 3-4 jours** : opportunite de produire un Atlas qui *merite* la carte (Empire du Ghana) plutot que debugger Shaka.

### Ce qui est preserve (zero perte)
- **Composants reutilisables Atlas** : `_shared/` (AtlasMercator, AtlasGlobe, AtlasLabel, AtlasCaravane)
- **Composants Shaka specifiques** : Cornes/Iklwa/Bouclier inserts (reutilisables si Shaka revient)
- **Pipeline durci** : d3-geo + Natural Earth + walk cycle PixelLab + Lottie + LightLeaks
- **Audio narration-v5.mp3** : pret a reutiliser si reprise format Seedance
- **Script Shaka V5 LOCKED** : dans `memory/episodes/shaka-zulu/`
- **Forced alignment ElevenLabs** : `shaka-alignment.ts` + `timing.ts` pret
- **Audit visuel complet** : `out/shaka-audit/shaka-zulu-FULL-AUDIT.mp4` (2:26, ref pour reprise)
- **Branche git** : `feat/atlas-shaka-zulu-vague1` preserve tout

### Comment revenir sur Shaka
Si reprise un jour :
- **Option A** (recommandee) : convertir le script V5 LOCKED en Seedance Short style Sonjata Papercraft. Re-utiliser audio + alignment.
- **Option B** : reprendre Atlas après 2-3 episodes Atlas matures (Ghana, Hannibal, etc.). Avec un pipeline plus solide, Shaka pourrait marcher.

---

## NOUVEAUX OUTILS VALIDES SESSION 2026-05-03

### 1. `@remotion/lottie` via Claude (icones simples)
- Pattern require() obligatoire (pas fetch + delayRender)
- Format JSON canonique strict (validé via skill Wiggle)
- Capacites : couronne, lance, fleche-pulse, bouclier, croissant, etoile, cercles d'echo
- Limite : ~10 vertices bezier max, max 5 instances simultanees
- 3 JSON pret a reutiliser : `crown-pulse.json`, `iklwa.json`, `arrow-pulse.json`
- Refs memoire : `feedback_remotion-lottie-headless-broken.md` + `tools/lottie-claude-inventaire.md`

### 2. `@remotion/light-leaks` (atmosphere)
- Validé en mini-render (LightLeakTest)
- Usage : 8-10 frames bref, opacity cap 0.35, complement aux moments emotionnels
- Pas standalone

### Tests sources preserves
- `src/projects/atlas/shaka-zulu/tests/LottieTest.tsx`
- `src/projects/atlas/shaka-zulu/tests/LightLeakTest.tsx`
- 3 JSON Lottie : `crown-pulse.json`, `iklwa.json`, `arrow-pulse.json`
- Renders valides : `out/tests/lottie-3-icons.mp4`, `out/tests/light-leak-test-v2.mp4`, `out/tests/lottie-test-crown-v3.mp4`

---

## PROJETS PRETS POSTIZ (3 Shorts)

| Video | Statut | URL Vercel |
|-------|--------|------------|
| Sonjata Papercraft V7 | PRET | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/sonjata-papercraft/v7-final/sonjata-final-v7-compressed-M5mA0ElRb3n0LUdzf8gAMmWYuUeZte.mp4 |
| Thiaroye 1944 V5 | PRET | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-1944/renders/thiaroye-v5-FINAL-compressed-KzMQnwVZtYLExnaGnaOz8PdyFGFBmk.mp4 |
| Mansa Moussa Atlas V2 | PRET | render local valide 2026-05-01 |

Fichiers locaux : `out/PRET-PUBLICATION/`

**Etat reseau** : warm-up 3-4 jours en cours. Publication attendue post-warm-up.

---

## PROJET EN COURS — EMPIRE DU GHANA (Atlas)

### Pourquoi
Aziz a choisi (2026-05-03) parmi liste figures Atlas-natives :
- **Ghana** = Top 2 ranking. Avantage : peu connu = curiosite forte = potentiel viral
- Ecarte : Hannibal (trop connu, sature YouTube)
- Format Atlas natif : routes commerciales trans-sahariennes = territoire + mouvement

### Contraintes Aziz pour cet episode (et tous Atlas futurs)
**RYTHME RAPIDE OBLIGATOIRE** :
- Format viral YouTube/TikTok/Instagram
- Pas d'encyclopedie / cours d'histoire
- Mouvements de camera frequents
- Beaucoup de faits qui apparaissent
- Jamais statique
- Si on n'a pas quoi mettre sur la carte, c'est mauvais signe

### Etat actuel
- **Recherche/script** : a faire
- **Audio** : a generer apres script LOCKED
- **Visuels** : pipeline Atlas mature, prêt
- **Outils dispo** : d3-geo, AtlasMercator, walk cycle PixelLab, Lottie via Claude, LightLeaks, Gemini, ElevenLabs

### Prochaine action
1. Recherche brève Empire du Ghana (figures, dates, angles narratifs)
2. Proposition d'angle (rythmique, non-encyclopedique)
3. Si valide par Aziz : script V1 selon `memory/templates/script-atlas-v1.md`

---

## STRUCTURE WORKSPACE (post-cleanup 2026-05-03)

```
src/projects/
  atlas/
    _shared/          ← composants reutilisables Atlas
    mansa-moussa/     ← V2 PRET PUBLICATION
    shaka-zulu/       ← PAUSE (preserve, branche feat/atlas-shaka-zulu-vague1)
      tests/          ← LightLeakTest + LottieTest (réutilisables)
    _archive/         ← projets anciens
  geoafrique-shorts/
  ...

out/
  PRET-PUBLICATION/   ← 3 MP4 finals (Mansa Moussa, Thiaroye, Sonjata)
  shaka-audit/        ← shaka-zulu-FULL-AUDIT.mp4 (ref pause)
  tests/              ← lottie-3-icons, lottie-test-crown-v3, light-leak-test-v2
```

---

## PROJETS EN ATTENTE (rappel)

### THIAROYE V5
- STATUT : RENDU FINAL SUR VERCEL. Pret publication Postiz.

### SONJATA V7
- STATUT : RENDU FINAL VALIDE. Pret publication Postiz. Duration 166s.

### ABOU BAKARI II
- STATUT 2026-04-29 : TOUS CLIPS GENERES manuellement. Reste assemblage Remotion + render final.
- Dashboard : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-6LXCXjaaPNMOJyWMynqk8dc11JGfy5.html

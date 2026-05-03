# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-05-03 — DECISION STRATEGIQUE : Shaka Zulu en pause + pivot Empire du Ghana
> **SHAKA ZULU = PAUSE STRATEGIQUE** (mismatch format Atlas / contenu psycho-militaire). Branche `feat/atlas-shaka-zulu-vague1` preserve l'etat. Reprise possible en format Seedance Shorts plus tard.
> **NOUVEAU PROJET — EMPIRE DU GHANA** (Atlas) : a definir cette session.
> **PIPELINE ATLAS = MATURE** : d3-geo + Natural Earth + walk cycle PixelLab + Lottie via Claude (NEW) + LightLeaks (NEW) + Forced Alignment ElevenLabs.
> **3 SHORTS PRETS POSTIZ** : Mansa Moussa V2, Thiaroye V5, Sonjata V7 (dans `out/PRET-PUBLICATION/`).

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

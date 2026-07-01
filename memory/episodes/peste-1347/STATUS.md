# STATUS — Peste 1347 (Atlas pur)
> Mis à jour : 2026-07-01

---

## ⛔⛔ BUG GÉO CORRIGÉ (2026-07-01) — RE-RENDER + RÉASSEMBLAGE NÉCESSAIRE AVANT PUBLICATION

Audit géo complet (agent, 36 frames + ground-truth Remotion still) : le fix "territoires d'outre-mer rouges"
documenté comme fait sur Beat5/6 n'était PAS propagé à Beat1/2/3 — Açores, Maroc/Canaries, Réunion, Madagascar
rougissaient en pleine mer pendant la propagation de la peste. Cause : `AtlasMercator` n'a pas de clipPath et
peint aussi les sous-tracés d'outre-mer des pays (FRA/PRT/NLD/NOR) quand `highlightFills` contient leur ISO.
Beat2/3 avaient DÉJÀ une couche clippée correcte ajoutée EN PLUS de l'injection buggée (redondance qui laissait
le bug actif) ; Beat1 n'avait aucune protection.

**Fix appliqué (2026-07-01)** : retrait de l'injection ISO_EUROPE/ISO_PLAGUE dans `highlightFills` sur les 3
fichiers, le rouge passe désormais UNIQUEMENT par `<g clipPath="url(#europeClipBN)">` (rect x118 y236 w470 h328,
même pattern que Beat4/5/6). Vérifié par render ground-truth (`npx remotion still`) sur Beat1 f150, Beat2 lf434,
Beat3 lf36 + lf396 — plus aucune tache isolée en mer. Beat4/5/6 étaient déjà propres, non touchés.

**✅✅ RE-RENDER + RÉASSEMBLAGE + MIX CORRIGÉ, VALIDÉ AZIZ (2026-07-01)** :
1. Beat1Hook, Beat2Setup, Beat3Densite re-rendus (Beat4/5/6 repris inchangés, déjà propres).
2. Réassemblés : concat 6 beats + musique `music-c-desert.mp3` en 1 piste continue + sous-titres `PesteSubtitles`
   overlayés (ProRes alpha).
3. ⛔ Piège ProRes rencontré : render sans `--prores-profile=4444` explicite NE PRODUIT PAS de canal alpha
   (`pix_fmt=yuv444p10le` sans le "a") même avec `--pixel-format=yuva444p10le` demandé → overlay ffmpeg donnait un
   écran quasi-noir (bitrate final ~70kb/s, symptôme net). Fix : les 4 flags ensemble sont obligatoires
   (`--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`).
4. **v1 avait 2 défauts signalés par Aziz à l'écoute** (corrigés en v2, même session) :
   - Musique à volume 0.11 au lieu de 0.04 documenté dans `manifeste.md` (trop forte, perçue "différente").
   - Narration jouée en 6 segments séparés (1 `<Audio>` par beat, concaténés) → cuts nets à chaque frontière de
     beat. Fix : `narration-v1.mp3` rejoué EN CONTINU (1 seul flux) par-dessus la vidéo rendue silencieuse
     (`-an`), overlayée aux sous-titres. ⭐ LEÇON : pour un réassemblage post-fix, TOUJOURS rejouer la narration
     source en continu plutôt que concaténer l'audio déjà découpé par beat — même petit écart de durée entre
     "durée relative render" (Root.tsx) et "durée narration" (timing.ts) suffit à produire des cuts audibles.
5. **Voix jugée "monotone" par Aziz — PAS un défaut de ce travail** : `narration-v1.mp3` date du 2026-05-15
   (GéoAfrique `eleven_v3` direct). Le pipeline "voix vivante" (Océane V3 + tags + Speech-to-Speech,
   `PIPELINE-VOIX-VIVANTE-VALIDE.md`) n'a été validé que le 2026-06-10. → chantier séparé, voir ci-dessous.
6. Livrable final validé : `out/PRET-PUBLICATION/peste-1347-FINAL.mp4` (42 Mo, 103.4s). Catbox : hptvlc.
   **VALIDÉ AZIZ (2026-07-01)** — transitions fluides, musique bien dosée. Publication : à programmer (TryPost).

---

## 🆕 PROCHAINE SESSION — 2 chantiers actés par Aziz (2026-07-01)

1. **Régénération narration avec pipeline voix vivante** : reprendre le script de Peste 1347, appliquer
   `PIPELINE-VOIX-VIVANTE-VALIDE.md` (tags émotion V3 phrase par phrase → Océane V3 → Speech-to-Speech vers
   GéoAfrique). Implique : retagger le texte par émotion/beat, régénérer `narration-v1.mp3`, refaire le
   forced-alignment (nouveaux timestamps), probablement retoucher `timing.ts` et les frames-clés de chaque
   beat (POI, pivots) si les durées de mots changent. Gros chantier, pas un simple remplacement de fichier.
2. **Système multi-agent de proposition d'amélioration sur le rendu actuel (post-fix, voix incluse une fois
   régénérée)** : lancer plusieurs agents pour proposer des idées d'amélioration scène par scène, en tenant
   compte de TOUT ce qui a été appris/ajouté depuis la création initiale de l'épisode (2026-05 à 2026-06) —
   personnage-vivant-svg, patterns SVG GGW/cacao, pipeline storyboard→validation→breakdown, etc. Décider en
   session le type d'agents à lancer (proposition libre vs scoring vs comparaison) et le périmètre (les 6 beats
   ou cibler les plus faibles, ex. transitions cartographiques 1-4 vs SVG symbolique pour Beat5/climax évoqué
   dans la discussion du 2026-07-01 sur l'hybridation Atlas+SVG).

---

## ÉTAT — 6 BEATS TOUS FINAL ✅ (épisode complet, assemblage restant)

| Beat | Fichier | Render FINAL | Notes |
|------|---------|-------------|-------|
| Beat1 Hook | Beat1Hook.tsx | beat1-FINAL.mp4 ✅ | Validé |
| Beat2 Setup | Beat2Setup.tsx | beat2-FINAL.mp4 ✅ | Validé |
| Beat3 Densité | Beat3Densite.tsx | beat3-FINAL.mp4 ✅ | Validé |
| Beat4 Climax | Beat4Climax.tsx | beat4-FINAL.mp4 ✅ | Validé |
| **Beat5 Mali Vivant** | Beat5MaliVivant.tsx | **beat5-FINAL.mp4 ✅** | DÉBLOQUÉ 2026-06-08 (v17). catbox v16 voix : eh1qgr |
| **Beat6 Conclusion** | Beat6Conclusion.tsx | **beat6-FINAL.mp4 ✅** | FINALE créée 2026-06-08 (v5). catbox : l74whj |

**Assemblage final** : ✅ FAIT (2026-06-08 session 2). Livrable `out/PRET-PUBLICATION/peste-1347-FINAL.mp4`
(1min43s, musique continue). Litterbox : https://litter.catbox.moe/44ps3m.mp4 (72h).
**EN ATTENTE : validation Aziz pour publication.**

### Session assemblage 2026-06-08 (session 2) — corrections appliquées
- **3 bugs standalone corrigés** (voir key-learnings.md) : `localF = frame` (Beat1/2/3/4), `durationInFrames`
  = durée relative (Beat2=449, Beat3=509 dans Root.tsx), musique retirée des 6 beats → 1 piste continue au concat.
- **clipPath Europe** ajouté à Beat2/3/4 (outre-mer rouges, comme Beat5/6).
- **Améliorations validées Gemini downstream** (da-compare vs Mansa Moussa, 2 passes) :
  zoom caméra suit la caravane (Beat4 `camCaravaneIn/Out` zoom 2.5) · trace dorée élégante (remplace triangle) ·
  frontières Mali ocre `GOLD_BORDER #7a4e10` · bateau Beat5 88px + easing maritime · easing caravane Beat4 ·
  zoom continu début Beat5.
- Versions finales beats : beat1/2/3/6-v5 + beat4-v6 + beat5-v6 (dans wip/). Concat = `/tmp/peste-concat-v7.txt`.
- **Reste perfectible (avis Gemini, non bloquant)** : propagation peste = aplat rouge (vs tracé SVG organique),
  encarts texte (signature Atlas, désaccord goût), océan sans texture. À voir si Aziz veut une passe.

### Session sources + sous-titres 2026-06-08 (session 3)
- **3 sources affichées** (footer parchemin, style Beat4) : Beat3 = al-Maqrizi·Britannica (ajouté),
  Beat4 = Parasites & Vectors·JHU, Beat5 = Ibn Battuta Rihla·World History Enc. (existait déjà).
  La fact-sheet contenait déjà 8 sources solides — il fallait juste les AFFICHER, pas en chercher plus.
- **Sous-titres sobres analyste** : forced-alignment ElevenLabs (`scripts/generate-peste-alignment.py` →
  `public/atlas/peste-1347/audio/narration-v1-alignment.json`, 490 mots loss 0.29). SRT généré par
  `scripts/peste-make-srt.py` (51 cues, regroupement ponctuation+42char, table ré-accentuation car
  alignment dé-accentué). Composant `PesteSubtitles.tsx` (compo Root `PesteSubtitles`, lit `subtitles.ts`).
- **⚠️ ffmpeg local SANS libass** (`subtitles`/`ass` filters absents) → impossible de burn un SRT.
  Contournement : rendre la couche sous-titres en ProRes 4444 alpha (`--codec=prores --pixel-format=yuva444p10le
  --image-format=png --public-dir=/tmp/empty-public` pour éviter copie 1.3GB) puis overlay ffmpeg
  (`overlay=0:0:shortest=1`). Filtre `overlay` lui est dispo.
- Livrable final : `out/PRET-PUBLICATION/peste-1347-FINAL.mp4` + litterbox xl5tmz (72h).

---

## ⭐ PROCHAINE SESSION — PLAN AZIZ (2026-06-08, précis)

> Vérification beat-par-beat du CODE de toutes les scènes validées, AVANT l'assemblage final.

1. **Gros render de l'épisode complet** (les 6 beats) → l'envoyer à Gemini pour review
   UPSTREAM **et** DOWNSTREAM : qu'il propose des améliorations scène par scène, applicables
   au render final. (Utiliser da-brief / da-compare. Voir DA-BRIEF-GATE.)
2. **⚠️ LE PLUS IMPORTANT — AUDIT GÉOGRAPHIQUE de TOUTES les colorations Europe rouge** :
   - Le bug "territoires d'outre-mer rouges en pleine mer" (FRA→Guyane, NOR→Svalbard, NLD→Caraïbes,
     PRT→Açores) a été repéré + corrigé sur Beat5 + Beat6 (clipPath Europe `rect x118 y236 w470 h328`).
   - VÉRIFIER que ce bug N'EST PAS reproduit dans les AUTRES beats (1-2-3-4) qui colorient aussi
     l'Europe en rouge (propagation peste). Du DÉBUT à la FIN de l'épisode.
   - Vérifier aussi les FRONTIÈRES (les rares anomalies vues sur Beat6) sur toute la vidéo.
3. **Exactitude géographique générale** : tout est-il géographiquement correct (pays infectés,
   routes, positions) sur l'ensemble.
4. PUIS seulement : assemblage des 6 beats (ffmpeg concat, ordre Beat1→6) + continuité
   narration/musique + SFX transitions → `out/PRET-PUBLICATION/peste-1347-FINAL.mp4`.

**Démarrage** : lire ce STATUS + `memory/episodes/peste-1347/beat6-construction/` (plan upstream) +
`memory/key-learnings.md` (2 bugs 2026-06-08 : audio trimAfter + clip Europe territoires lointains).

---

## CE QUI A ÉTÉ FAIT 2026-06-08 (session marquante)

**Beat 5 débloqué via DA-BRIEF-GATE** (après ~15 tentatives à l'aveugle) :
- Méthode : da-compare (Gemini vidéo, Beat5 vs Mansa Moussa) + da-brief Kimi (frames) → diagnostic
  vérifié → plan reconstruction validé `--upstream` → construction par couches (render-tests).
- Vrai coupable = CHORÉGRAPHIE du mouvement (pas les assets). Corrections : caravane en serpentin
  sur path courbe (caravanePositions + jitter), track caméra continu serré (zoom 4.6/4.0),
  transition continue caravane→bateau, easing bezier, glow Mali réduit + frontières lisibles,
  rouge propagé depuis le port d'accostage, ombres au sol, ralenti, musique désert, zoom agressif.
- Diagnostics + plan sauvegardés : `memory/episodes/peste-1347/beat5-diagnostic/`.

**Beat 6 FINALE créé** ("Deux épidémies, deux destins. Un désert entre les deux. La géographie
n'est pas neutre.") — 1er beat conçu 100% en amont (plan validé Gemini+Kimi avant code) :
- Pull-back lent continu, antithèse, FAILLE Sahara (ligne ondulée ocre fine, pas un mur),
  phrase au centre en écriture-plume (stroke-dasharray serif), désaturation finale + battement.
- Plan upstream : `memory/episodes/peste-1347/beat6-construction/`.

**2 BUGS corrigés (durables, voir key-learnings.md)** :
- Audio `trimAfter` ABSOLU (pas relatif à startFrom) → voix était absente de v13/14/15 sans le voir.
- Territoires d'outre-mer rouges → clipPath Europe continentale.

---

## ASSETS / DONNÉES

- Caravane : porteur-mali (walk east/west/**north**), ane-caravane (**north** généré 2026-06-07),
  marchand-berbere, cheval-bat. north cheval = profil (rejeté). Sprites : `public/atlas/peste-1347/assets/characters/`.
- POI SVG : Niani (210,737), Tombouctou (250,696), Maghreb (235,556), Florence (354,463), Venise (362,446).
- Route or : `ROUTES_GEO.CARAVANE_OR` (geoUtils) = 5 waypoints courbes (Niani→Tombouctou→Taoudenni→Sahara nord→Maghreb).
- Audio : `narration-v1.mp3` (105s, beat5 startFrom 2323, beat6 startFrom 2975) + `music-c-desert.mp3`.
- clipPath Europe (anti territoires lointains) : `rect x118 y236 w470 h328`.

---

## TECHNIQUES VALIDÉES CETTE SESSION (réutilisables)

| Technique | Application |
|---|---|
| **caravanePositions(route, prog, count, spacingKm)** | file serpentin sur path courbe (pas grille rigide) |
| **Track caméra = driftX/Y dérivés pour centrer focus SVG** | suivre un sprite mobile, zoom serré |
| **Propagation couleur par distance à un point** | tache d'encre (peste) depuis le port |
| **clipPath continental** | éviter les territoires d'outre-mer colorés |
| **DA-BRIEF-GATE upstream** | valider un PLAN avant code (Beat6 = preuve) |
| **da-compare vs référence validée** | diagnostiquer pourquoi une scène ne décolle pas |

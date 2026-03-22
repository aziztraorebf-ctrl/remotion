# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-03-18 (Session Amanirenas Beat01 — pipeline dolly-in valide, assets v9 prets) | A LIRE EN DEBUT DE SESSION

---

## Exploration Style : Hannibal Vivid Flat 2D (2026-03-17, SESSION COMPLETE)

### Contexte — Pourquoi cette session
Session de R&D pure sur le pipeline "Cinematic Flat Illustration" — style vivid_shapes Recraft + Kling O3.
Objectif : valider si ce style peut produire des clips cohérents et cinématiques, et documenter les règles pour industrialiser.
Résultat : pipeline validé avec 2 clips masterpiece. 7 règles critiques découvertes et documentées.

### Ce qui a été produit (2026-03-17)
- **Clip 1 VALIDÉ** : `tmp/brainstorm/references/hannibal-o3-final-8s-VALIDATED.mp4` — Hannibal de face → tourne → de dos, armée apparaît, 8s
- **Clip 2 MASTERPIECE** : `tmp/brainstorm/references/hannibal-army-appear-MASTERPIECE.mp4` — Hannibal seul → armée apparaît de dos, 10s. Ombre animée, cape physique, marche naturelle. Défaut : soldats dérivent semi-réaliste en fin de clip (caméra qui avance vers leurs dos).
- **Frames REF produites** : `hannibal-solo-alpes-start.png`, `hannibal-army-reveal-D.png`, `hannibal-chain-frame-01-marching.png`
- **Scripts Gemini créés** : `gemini-edit-chain-frame.py`, `gemini-edit-army-reveal-v2.py`, `gemini-edit-army-reveal-variants.py`, `gemini-edit-hannibal-solo.py`

### Decision strategique en cours
- Style vivid_shapes flat 2D = candidat pour remplacer le semi-realiste comme style PRINCIPAL
- Semi-realiste conserve uniquement pour gros plans ultra-importants (revelation emotionnelle)
- Applicable a : Amanirenas, futurs projets historiques

### Assets Hannibal valides
- Style ID cold (mint) : `223aba34-6d9f-4d0a-a7a7-5b96ca9add8b`
- Style ID warm (gold) : `f5063f81-e1e8-4a2e-becc-0895841573a8`
- **Portrait REF CANONICAL** : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
  - Genere via : Recraft vivid_shapes -> Gemini 3.1 Flash edit chirurgical
  - Edits appliques : bande navy supprimee (mint uniforme), cape pourpre restauree, oeil droit = trait diagonal cicatrice
  - Script edit : `scripts/gemini-edit-hannibal-portrait.py`
- Start/end frames Alpes : `tmp/brainstorm/references/hannibal-recraft-vivid-startframe.png` + `endframe.png`
- Clips valides (round 1) : `tmp/brainstorm/references/hannibal-o3-flat-vivid-VALIDATED.mp4`

### Lecons cles pipeline vivid flat 2D (2026-03-17, mise a jour)
- **Start + end frame OBLIGATOIRE pour styles flat** : sans end frame Kling hallucine le personnage
- Visage vide (fond se confond) = force du design, pas defaut — personnage reconnaissable par cape+casque+elephant
- Oeil manquant : gerer par cadrage (plan large/de dos) — gros plans via Gemini edit si besoin
- Pipeline REF : Recraft (style) -> Gemini edit (corrections chirurgicales) -> PNG REF -> Kling (start+end)
- **Regle ecart start→end (CRITIQUE)** : start et end doivent etre dans le MEME espace visuel (meme angle, meme distance). Changer UN seul element entre les deux. Ecart trop grand = Kling improvise = silhouettes sombres generiques.
- **Frame chaining valide** : extraire derniere frame clip via ffmpeg -> Gemini edit -> start frame clip suivant. Continuity parfaite. Voir `key-learnings.md` § "Frame Chaining".
- **Gemini 3.1 Flash Image = outil de correction chirurgicale puissant** : retourner personnage face→dos, supprimer/ajouter elements, changer perspective. Toujours partir de la frame existante, pas generer from scratch.
- Clip valide 8s (face→dos reveal armee) : `tmp/brainstorm/references/hannibal-o3-final-8s-VALIDATED.mp4`
- Clip masterpiece (solo→armee apparait, marche de dos) : `tmp/brainstorm/references/hannibal-army-appear-MASTERPIECE.mp4`
- Voir details complets : `memory/video-generation-pipeline.md` § "Revelations techniques" + § "Regles start/end frame"

---

## Projet Prioritaire : GeoAfrique — Abou Bakari II Short

### Fichiers cles
- Code : `src/projects/geoafrique-shorts/AbouBakariShort.tsx`
- Timings : `src/projects/geoafrique-shorts/timing.ts` (INTOUCHABLE — derive Whisper V5)
- Audio principal : `public/audio/abou-bakari/abou-bakari-v5-full.mp3` (83.08s, mute a 80.60s)
- Audio CTA : `public/audio/abou-bakari/beat09-cta.mp3` (5.76s)
- Duree totale composition : 2666 frames = 88.87s (TOTAL_FRAMES_WITH_CTA)
- Voix : Narratrice `Y8XqpS6sj6cx5cCTLp8a` | stability: 0.32, similarity_boost: 0.75, style: 0.40, speed: 0.85

### Etat des beats — TOUS COMPLETES

| Beat | Clip/Approche | Statut |
|------|--------------|--------|
| Beat01 ocean | beat01-o3-pan-B-14s.mp4 | INTEGRE + VALIDE |
| Beat02 empire | beat02-o3-westlook-v1.mp4 | INTEGRE + VALIDE |
| Beat03 fleet | beat03-o3-fleet-v3.mp4 | INTEGRE + VALIDE |
| Beat04 name | beat04-kling-v2.mp4 | INTEGRE + VALIDE |
| Beat05 abdication | beat05-moussa-grandeur-v3.mp4 (P1) + beat05-plan2-caravan-v3.mp4 (P2) | INTEGRE + VALIDE |
| Beat06 obsession | beat06-obsession-v1.mp4 — Kling V3 Std locked, overlay "OUEST" | INTEGRE + VALIDE |
| Beat07 colomb | beat07-colomb-v1.mp4 — Kling V3 Std dolly in, palette froide | INTEGRE + VALIDE |
| Beat08 close | Split screen Beat06+Beat07, ligne or, dates 1311/1492, question | INTEGRE + VALIDE |
| Beat09 CTA | Remotion pur, audio beat09-cta.mp3 | INTEGRE + VALIDE |

### VALIDE cette session (2026-03-17) — Elements + Sequencing

**Technique elements prouvee :**
- Soldats drift blanc/gris = RESOLU avec `elements` parameter (Kling O3, cfg_scale 0.45)
- Clip reference : `tmp/brainstorm/hannibal-elements-v1.mp4` — 9.5/10 Kimi — APPROVED
- Script reference : `scripts/test-hannibal-elements-v1.py`

**Sequencing Remotion prouve :**
- 2 clips Kling enchainees dans Remotion via OffthreadVideo + Sequence = propre, aucun jumpcut massif
- Esthetique flat 2D tient comme style unifie entre clips (meme si soldats legrement differents entre v1 et v2)
- Conclusion : le style vivid_shapes est suffisamment fort pour coller des scenes ensemble
- Composition : `src/projects/style-tests/HannibalAlpesSequence.tsx` (542 frames, 9:16)
- Render final : `out/hannibal-alpes-sequence.mp4` (18.1s)
- Assets dans : `public/assets/hannibal-alpes/`

### Projet Amanirenas — Session 2026-03-18 (PIPELINE VALIDE — EN ATTENTE CREDITS)

**CONTEXTE — Pourquoi cette session**
8 versions Kling O3 generees pour le Beat01 d'Amanirenas. Objectif : valider la formule d'animation pour ce style flat 2D graphic navy/or. En partant de zero animation (v1-v3), on a progressivement identifie les vrais blocages (sol riviere, prompt trop "slow", endframe trop loin du startframe) et la formule gagnante : Dolly-In + sol sable uni + prompt Gemini Kling Director. La v8 est la meilleure iteration — les 7 premieres secondes sont excellentes.

**FORMULE VALIDEE (v8 "Desert Spear") :**
- Technique : Dolly-in optical (camera avance vers la reine)
- Prompt : Gemini Kling Director ecrit les prompts (pas Claude) — briefs narratifs en francais, Gemini traduit en Kling
- cfg_scale : 0.45 (v8) → tester 0.35 sur v9
- Sol sable uni OBLIGATOIRE : les bandes blanches = riviere pour Kling → pataugeage garanti
- Elements : 2 max (@Element1 portrait + @Element2 warrior)
- Guerriers : flanking formation, never crossing center (anti-collision)

**ASSETS V9 PRETS (en attente credits) :**
- Portrait REF : `tmp/brainstorm/references/amanirenas-portrait-REF-v3-oneeye.png`
  - Oeil droit = surface navy plate + X dore (pas de shape d'oeil anatomique)
  - ATTENTION : ne pas regenerer avec Gemini en prose — ca efface tout le visage. OK tel quel.
- Warrior REF : `tmp/brainstorm/references/amanirenas-warrior-REF-v2-silhouette.png`
  - Lignes musculaires reduites mais quelques contours dores restent — acceptable avec cfg 0.35
- Startframe : `tmp/brainstorm/references/amanirenas-startframe-v3-sol.png` (sol sable uni, zero bandes)
- Endframe : `tmp/brainstorm/references/amanirenas-endframe-v5-sol.png` (sol sable uni, boucliers terracotta)
- Script v9 : `scripts/test-amanirenas-kling.py` (contient le prompt Desert Spear, modifier cfg a 0.35)

**LECONS CRITIQUES APPRISES CETTE SESSION :**

1. **Sol riviere = cause racine de tous les morphings** : bandes blanches horizontales → Kling interprete comme eau → guerriers pataugent → deformation. Corriger le startframe ET l'endframe avant tout.
2. **Prompt "slow/steady/gently" = zero animation** : ces mots bridaient Kling. Le style flat 2D graphic VIT dans l'energie.
3. **"Explode from both sides" = collision garantie** dans 9:16 : les guerriers arrivent, se heurtent au centre, morphent. Solution : flanking formation + "never crossing center".
4. **Gemini Kling Director > Claude pour les prompts Kling** : Gemini connait les 38 angles de camera, les patterns stables, la physique de Kling. Workflow : brief narratif francais → Gemini → prompt optimise → Claude lance.
5. **JSON Nano Banana pour Gemini Image** : la bonne methode pour edits chirurgicaux. Mais Gemini Image regenere tout quand l'instruction est en prose. Nano Banana (JSON scene) = plus stable.
6. **Oeil avec shape anatomique = animable par Kling** : si la cicatrice ressemble a un oeil ferme, Kling l'ouvre au zoom. Solution : surface plate (zero courbe) + marque X seulement.
7. **cfg_scale 0.35 recommande pour v9** : 0.45 laisse Kling trop libre → style drift en fin de clip (pyramides jaunes). 0.35 = verrou style.

**ARCHIVE — historique des versions :**
- v1-v3 : zero animation, parallaxe — cause : prompt slow + startframe statique
- v4 "energy" : guerriers morphent en pyramide (collision "explode from both sides")
- v5 "multishot" : meilleure structure narrative mais meme collision, style drift fin
- v6 "orbit" : style drift sur guerriers (clones de la reine), sol riviere
- v7 "dolly v1" : sol riviere → pataugeage
- v8 "desert spear" : MEILLEURE VERSION — dolly propre, guerriers flanking, respiration reine, expression colere. Style drift frame 8-10 (pyramides changent couleur). Couper a 7s si besoin.

**Prochaine action : v9**
- Modifier `scripts/test-amanirenas-kling.py` : changer cfg_scale de 0.45 a 0.35
- Lancer quand credits disponibles
- Si style drift persiste en fin : reduire duree a 7s et utiliser endframe plus proche du startframe visuellement

### Prochaines actions — GeoAfrique Abou Bakari (en attente crédits)

1. **Musique** : generer dans Suno avec prompt ci-dessous, looper 30s x3 via ffmpeg
2. **Mix final** : voix 100% + musique -18dB, ffmpeg merge
3. **Render final** : `npx remotion render src/index.ts AbouBakariShort out/abou-bakari-final.mp4`


### Prompt Suno musique (3 variants prepares)

**Variant A (recommande) :**
```
[Instrumental] West African ambient, solo kora opening, slow mysterious atmosphere, builds gradually with djembe and dundun percussion, epic and grand at midpoint, slight tension and unresolved ending, cinematic documentary style, 85 bpm
```
**Variant B :**
```
[Instrumental] African ambient instrumental, tribal percussion djembe shekere, haunting kora melody, builds to epic orchestral swell, then fades to cold sparse ending, documentary soundtrack, emotional and contemplative, 80 bpm
```
**Variant C :**
```
[Instrumental] Minimalist African score, sparse kora plucks over deep bass drum, slow cinematic build, West African traditional instruments, emotional documentary underscore, unresolved suspended ending, 75 bpm
```

### Beat05 — Assets produits
- Plan 1 Moussa : `beat05-moussa-grandeur-v3.mp4` (10s V3 Pro, Dolly Out, robe statique)
- Plan 2 caravane : `beat05-plan2-caravan-v3.mp4` (10s O3 cfg 0.3, Dolly In)
- Source Moussa plan moyen : `characters/mansa-moussa-fullshot.png`
- Source caravane finale : `beat05-plan2-caravan-v3.png` (apres 2 retouches chirurgicales Gemini)

### Beat06 — Assets produits
- Source : `beat06-obsession-source-v2.png` (silhouette roi + double exposition vagues, retouche ocean bas-gauche)
- Clip : `beat06-obsession-v1.mp4` (5s V3 Std locked, vagues animees interieur silhouette)
- Overlay : mot "OUEST" fantome dans le ciel etoile (opacite 18%, fontSize 120)

### Beat07 — Assets produits
- Source v1 : `beat07-colomb-source-v1.png` (trop lumineux, rejete)
- Source v2 : `beat07-colomb-source-v2.png` (retouche etalonnage froid — ciel gris plombe)
- Clip : `beat07-colomb-v1.mp4` (5s V3 Std dolly in, palette froide preservee)
- Overlays : "181 ans plus tard" + "Christophe Colomb" + `le "decouvreur".` en bleu-gris

### Beat08 — Split screen technique
- Gauche : moitie DROITE du clip Beat06 (silhouette a droite dans le clip source)
- Droite : moitie GAUCHE du clip Beat07 (caravelle centree)
- Decoupage : `div` avec `width: HALF, overflow: hidden` + video `position: absolute`
- `clipPath: inset()` NE FONCTIONNE PAS avec OffthreadVideo dans Remotion — utiliser div

### Audio mute technique
- "Et toi ? Tu savais ca ?" commence a 81.08s (Whisper) mais debut reel ~80.60s
- Mute via `volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0])}` sur composant Audio
- MUTE_START = frame 2418 (80.60s * 30fps)

---

## Projet Parallele : Peste 1347

- HookMaster v2 : TERMINE et valide (score Kimi 9/10)
- Corps S1-S6 : A FAIRE (ordre : S6 -> S3 -> S4 -> S1 -> S5 -> S2)

---

## Technique elements — PROUVEE (2026-03-17)

**Defaut masterpiece corrige** : soldats semi-realistes -> soldats flat navy/violet stables jusqu'a la fin.
**Clip reference** : `tmp/brainstorm/hannibal-elements-v1.mp4` — 9.5/10 Kimi — APPROVED FOR PRODUCTION
**Script pret** : `scripts/test-hannibal-elements-v1.py`
**Assets canoniques** :
- Hannibal REF : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
- Soldat type REF (de dos) : `tmp/brainstorm/references/hannibal-soldier-type-REF.png`
- Script generation soldat : `scripts/generate-hannibal-soldier-ref.py`

**Element3 crop = main visible PROUVE (v3)** : crop serré main+poignée par Aziz -> main clairement visible des deux côtés. Tissu dans le crop -> couleurs transferees aux soldats (a eviter).
**Forme bouclier** : laisser Kling decider. Sujet clos.
**Division travail crop** : Aziz crop manuellement, Claude ne crop pas a l'aveugle.

## Prochains tests prioritaires

| Priorite | Test | Pourquoi | Parametres |
|----------|------|----------|------------|
| 1 | Amanirenas avec elements | Appliquer technique prouvee | elements: Amanirenas REF + guerriere type |
| 2 | Multi-shot prompting | 1 generation = 2 plans distincts | "Shot 1 / Shot 2" dans prompt Kling O3 |
| 3 | Seedance 1.0 Pro I2V | Comparer physique vs Kling sur meme source | Meme image source Recraft |

## Regles Critiques Transversales

- Audio startFrame INTOUCHABLE — derive de mesures ffprobe
- NO EMOJIS dans .ts/.tsx/.js/.json/.yaml
- V3 Pro cfg_scale 0.35-0.4 : portraits | O3 cfg_scale 0.3 : scenes epiques
- JAMAIS Kling V1.6 — endpoints valides : v3/pro, v3/standard, o3/standard
- OffthreadVideo : toujours muted, toujours dans Sequence from={BEATS.xxx.start}
- Split screen : div overflow:hidden (PAS clipPath inset)
- Gemini retouche chirurgicale : Part.from_bytes() + prompt ultra-specifique = edit precis sans toucher au reste

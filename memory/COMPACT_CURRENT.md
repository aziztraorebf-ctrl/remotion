# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-03-31 (Session massive Seedance 2.0 — 7 tests, 3 styles, 3 personnages, Seedance = outil principal GeoAfrique) | A LIRE EN DEBUT DE SESSION

---

## Projet Thiaroye 1944 — CLOS (validation pipeline uniquement, pas production)

### Contexte — Pourquoi ce projet maintenant
Test complet du pipeline batch Short YouTube : Gemini 3x3 storyboard → Kling image-to-video → ElevenLabs voix-off → Remotion assemblage. Sujet choisi : verdict historique du 27 mars 2026 (Cour de cassation condamne l'État français pour dissimulation des circonstances du massacre de Thiaroye 1944). Sujet d'actualité brûlante, narrativement fort, idéal pour valider toute la chaîne de production.

### Assets produits — TOUS VALIDES

**Storyboard :**
- `public/assets/library/geoafrique/thiaroye-1944/thiaroye-storyboard-grid-v2.jpg` — grille 3x3 Gemini sans texte/chiffres (v1 contenait des lignes et dates → rejetée)

**Frames extraites (9 crops 336x336) :**
- `frames/frame-01.jpg` à `frame-09.jpg` — crops automatiques via PIL
- `frames/frame-04-diverse.jpg` — version diversifiée via Gemini éditorial (visages distincts)

**Clips Kling — VALIDES (sauf F5 abandonnée) :**

| Clip | Modèle | Statut | Notes |
|------|--------|--------|-------|
| frame-01-final.mp4 | V3 Pro | VALIDE | Mains + cachet de cire. Crop à 1.5s pour supprimer bordures blanches initiales |
| frame-02.mp4 | V3 Std | VALIDE | Camp Thiaroye vide, palmiers, sable — excellent |
| frame-03.mp4 | O3 Std | VALIDE | Rangée tirailleurs, vent dans vêtements — acceptable |
| frame-04-v2.mp4 | O3 Std | VALIDE | Profils soldats diversifiés (Gemini edit → Kling) — excellent |
| frame-05.mp4 | O3 Std | ABANDONNEE | Visages identiques + pose bizarre. Remplacer par carte Remotion pur |
| frame-06.mp4 | O3 Std | VALIDE | Silhouettes + fumée + éclairs — un des meilleurs |
| frame-07.mp4 | V3 Pro | VALIDE | Mains vieillies sur table, lumière — excellent |
| frame-08.mp4 | V3 Std | VALIDE | Vétéran dos à l'océan, vagues — quasi parfait |
| frame-09.mp4 | V3 Pro | VALIDE | Portrait descendante, lumière dorée, sourire — excellent |

**Audio voix-off :**
- `thiaroye-voixoff-v6.mp3` — **VERSION FINALE** (110s)
- Voix : Narratrice GeoAfrique V3 `Y8XqpS6sj6cx5cCTLp8a`, stability 0.25, style 0.40, speed 0.88
- "Et toi tu savais ça ?" supprimé — passe directement de "ils ont libéré un continent qui les a oubliés" au CTA
- CTA final : "L'Afrique a une histoire qu'on t'a cachée — et une actualité qu'on te simplifie. Le lien en bio."

### Assemblage Remotion — TERMINE

**Composant :** `src/projects/geoafrique-shorts/ThiaroyeShort.tsx`
**Composition :** `ThiaroyeShort` — 1080x1920, 30fps, 3302 frames (110s)
**Render :** `out/thiaroye-short-full.mp4` (59 MB, 110s) — vu par Aziz

**Etat :** Le render est fonctionnel mais les timings clips/audio ne sont PAS cales finement. Les clips sont en slow-motion force (playbackRate 0.29-0.50) car generes en 5s pour des segments de 10-20s. Le but etait de valider le pipeline, pas de produire la version finale.

**Mapping actuel (approximatif, a recaler) :**
- S1 (0-12s) : F1-final @ 0.29x + "Dakar, 1944"
- S2 (12-24s) : F2 @ 0.42x
- S3 (24-36s) : F3 @ 0.42x
- S4 (36-46s) : F4-v2 @ 0.50x
- S5 (46-58s) : Carte SVG topojson (Afrique → Senegal → Dakar + compteur 400 000)
- S6 (58-70s) : F6 @ 0.42x + "82 ans de silence"
- S7 (70-82s) : F7 @ 0.42x + "27 mars 2026"
- S8 (82-96s) : F8 @ 0.36x
- S9 (96-110s) : F9 @ 0.35x + CTA "Le lien en bio"

### Test mouvement dynamique — TERMINE

**Constat :** Les prompts "atmospheric movement only" causent quasi-immobilite. Kling n'a PAS de parametre motion intensity — tout passe par le prompt.
**Test :** 2 clips dynamic-A et dynamic-B generes avec prompts d'action (V3 Pro, 10s) sur frame-04-diverse.jpg.
**Clips :** `clips/dynamic-A.mp4`, `clips/dynamic-B.mp4`
**Gallery review :** uploadee Vercel Blob pour comparaison. Verdict Aziz en attente.

### Industrialisation — SKILL v2 (sessions 29-30 mars 2026)

**Quoi :** Skill `batch-short-production` dans `.claude/skills/batch-short-production/`
**Pourquoi :** Le pipeline valide le 29 mars devait etre transforme en process repeatable. Decision : deux skills chainables (`youtube-scriptwriting` → `batch-short-production`).

**Evolution du skill en 5 commits cette session :**

| Commit | Changement | Raison |
|--------|-----------|--------|
| `c262383` | Skill initial — 8 phases, 6 scripts, 4 refs, 3 evals | Industrialisation pipeline Thiaroye |
| `0a825fb` | Kimi K2.5 script review + storyboard direction | Teste sur Thiaroye : $0.01 pour direction artistique complete |
| `22370d7` | Reordonne : Kimi review AVANT audio | Aziz : si Kimi change le script apres l'audio, on refait tout |
| `940d87f` | Script time-code fusionne (script + timing) pour Kimi | Kimi propose des multi-shots avec secondes precises par beat |
| `8d1c89c` | Frames individuelles + Kimi Pass 3 simplification | Grille 3x3 = crops foireux + images trop petites. Pass 3 = reduire complexite pour Gemini |

**Pipeline final (9 phases) :**
```
1. Kimi script review (iterer → script LOCKED)
2. Audio ElevenLabs
3. Timing ffprobe
4. Kimi storyboard direction (script time-code → multi-shots avec secondes)
   + Pass 3 simplification (max 3 persos, 1 focal, zero texte/gore, cartes vierges)
5. Storyboard Gemini (frames INDIVIDUELLES, pas de grille)
6. Clips I2V
7. Corrections
8. Assemblage Remotion
9. Review & delivery
```

**Decisions cles :**
- Agnostique generateur video (Kling, Seedance, ou futur)
- Palette non-fixe : seule constante = "2D vivid flat illustration"
- Musique = etape manuelle hors-skill
- Kimi en 3 passes ($0.02 total) : review script → direction storyboard time-codee → simplification pour Gemini
- Frames individuelles (1 appel Gemini par beat) au lieu de grille 3x3 (eliminates crop errors, undersized images)
- Fast cuts = Remotion montage de clips courts (2-3 clips I2V 5-6s par beat) plutot que multi-shot T2V Kling (perd le controle du style)
- Clips I2V toujours 5-6s. Beat 12s = 2 clips 6s enchaines avec cut sec. Pas de slow-motion force.
- Geo beats = Gemini carte vierge + Remotion annotations (fleches, marqueurs, compteurs). Zero credits I2V. 1-2 par Short pour contraste visuel.

**Tests effectues cette session (sur script Thiaroye) :**

| Test | Resultat | Lecon |
|------|----------|-------|
| Kimi Pass 1 (script review) | 6/10, 3 suggestions concretes avec avant/apres | Kimi est direct et pas complaisant — $0.004 |
| Kimi Pass 2 (storyboard sans timing) | Bon mais vague sur les durees | Les timecodes sont indispensables |
| Kimi Pass 2 (storyboard avec timing) | Multi-shots avec secondes par beat, excellent | Fusion script+timing = game changer |
| Kimi Pass 3 (simplification) | 9 frames toutes en complexite "Basse" | Elimine foules, gore, texte, surcharge |
| Gemini grille V3 (brief Kimi non simplifie) | Texte "OFFICIAL REJECTED", subdivisions, foules, gore | Brief cinematique trop complexe pour Gemini |
| Gemini grille V4 (brief Kimi simplifie) | Propre mais layout 2x5 au lieu de 3x3, crops foireux | La grille est le probleme, pas le brief |
| Kling V3 Pro sur frame croppee | Echec : image trop petite (250px) puis mauvais crop (2 images melangees → morphing) | Frames individuelles obligatoires |
### Prochaine action — TESTER FRAMES INDIVIDUELLES + CLIP KLING

**Quoi :** Tester le nouveau script `generate-storyboard.py` (frames individuelles) avec les descriptions simplifiees de Kimi Pass 3, puis generer 1-2 clips Kling a partir des frames individuelles.
**Pourquoi :** La grille 3x3 est abandonnee (crops foireux, images trop petites). Le script frames individuelles n'a PAS encore ete teste. Il faut valider que :
  1. Gemini genere des frames propres en resolution native (pas de crop)
  2. Les frames sont directement utilisables par Kling sans upscale
  3. La qualite visuelle est au moins aussi bonne que la grille V4
**Comment :**
  - `python generate-storyboard.py --kimi-brief /tmp/thiaroye-kimi-simplified.md --style "ochre, navy, gold" --output-dir /tmp/thiaroye-v5/`
  - Verifier resolution et qualite de chaque frame
  - Soumettre 2-3 frames a Kling V3 Pro/Std
  - Comparer avec les clips de la session du 29 mars
**Fichiers de test deja prets :**
  - Script : `/tmp/thiaroye-script.txt`
  - Timing : `/tmp/thiaroye-timing.json`
  - Brief Kimi simplifie : `/tmp/thiaroye-kimi-simplified.md`
  - ATTENTION : ces fichiers sont dans /tmp/ — les copier dans le projet si besoin de les conserver

### Lecons pipeline apprises cette session

| Leçon | Détail |
|-------|--------|
| Audio-first OBLIGATOIRE | On a fait les clips avant l'audio → durées non calées. Pipeline correct : Script → Audio → ffprobe → Storyboard Gemini (1 frame/beat avec durée cible) → Kling clips (duration = durée beat) → Assemblage Remotion |
| Format Long Short validé | 110s acceptable pour sujets historiques complexes. 60s strict = max 70-75 mots script avec cette voix |
| NO TEXT dans frames Gemini | Toujours régénérer si texte/chiffres visibles — Kling anime le texte et ça produit des artefacts |
| Diversification visages via Gemini | Gemini éditorial sur frame source AVANT Kling = solution au problème "clones" de la grille 3x3 |
| Gemini 3x3 → F5 abandonnée | La grille produit parfois des scènes redondantes ou ratées. Prévoir 1-2 remplacements Remotion pur dans le plan de montage |
| Voix lente = gravitas | La narratrice V3 à speed 0.88 donne un ton documentaire excellent mais allonge tout script de ~40% |
| Durée clips = durée beats | Kling supporte `duration: "10"`. Générer des clips de 10s pour beats de 12s (playbackRate 0.83x) au lieu de 5s ralentis à 0.42x |
| Prompts dynamiques, PAS "atmospheric" | "atmospheric movement only" = quasi-immobilité. Pour du mouvement : verbes d'action ("PRESSES", "MARCH", "RUSHES"), camera cues ("tracking shot", "dynamic"), mots-clés "energetic", "rapid". JAMAIS "subtle", "gentle" sauf volonté explicite de calme |
| Pas de paramètre motion intensity Kling | Le contrôle du mouvement dans Kling se fait UNIQUEMENT par le prompt. cfg_scale = adhérence au prompt, PAS intensité mouvement. Camera control API existe en v1.6 seulement, pas en v2+/v3 |

---

## Infrastructure : Vercel Blob Asset Gallery (2026-03-27, OPERATIONNEL)

### Contexte — Pourquoi cette infra
Aziz veut pouvoir diriger la production depuis Claude Code Mobile (telephone), sans etre devant son Mac. Le probleme : les assets generes (images, audio, clips) sont des fichiers locaux inaccessibles a distance. Solution : Vercel Blob comme "vitrine" publique — Claude uploade les assets, Aziz recoit un lien cliquable sur son telephone.

### Ce qui a ete mis en place
- **Projet Vercel** : `remotion-assets` (prj_rrLqyQtJVr3T4npZNH0o2U0JEcxq)
- **Blob store public** : `store_T6oLmi2NlOe9nhkg` — liens permanents, pas d'expiration
- **Base URL** : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/`
- **Script** : `scripts/upload-to-blob.py` — upload solo, gallery HTML mixte (images+audio+video), listing
- **Token** : `BLOB_READ_WRITE_TOKEN` dans `.env`
- **Valide sur mobile** : images PNG + audio MP3 + page gallery HTML — tout fonctionne sur iPhone Safari

### Comment utiliser
```bash
# Upload un fichier
python scripts/upload-to-blob.py fichier.png --folder images

# Gallery mixte (images + audio + video sur une page)
python scripts/upload-to-blob.py --gallery "Titre Review" img1.png img2.png audio.mp3 --folder review/date

# Lister les fichiers
python scripts/upload-to-blob.py --list
```

### Prochaine etape : Vercel Sandbox Renderer
Plan redige dans `docs/plans/2026-03-27-remotion-vercel-renderer.md`. Objectif : render des videos Remotion dans le cloud Vercel (pas en local). Projet separe `remotion-renderer` base sur le template officiel. **Execution en session parallele — en cours.**

### Decisions cette session

| Date | Decision | Pourquoi | Impact |
|------|----------|----------|--------|
| 2026-03-27 | Blob store public (pas prive) | Les URLs doivent etre accessibles sans token depuis un telephone | Store supprime et recree en mode public |
| 2026-03-27 | Script Python (pas MCP Vercel) pour uploads | Le MCP Vercel blob_put ne fonctionne pas (erreur 403 token) + base64 pas pratique pour gros fichiers | Script standalone plus fiable |
| 2026-03-27 | Gallery HTML uploadee sur le Blob store | Besoin de mixer images+audio+video dans un seul lien reviewable sur mobile | Page HTML statique = zero backend |
| 2026-03-27 | Projet renderer separe (Option A) | Notre projet Remotion est un Studio pur sans Next.js. Le template-vercel requiert Next.js. Dupliquer le code serait complexe. | Nouveau repo `remotion-renderer` |

---

## Seedance 2.0 — OUTIL PRINCIPAL GeoAfrique (2026-03-28 → 2026-03-31)

### Contexte — Pourquoi Seedance est devenu l'outil principal
Session du 30-31 mars 2026 : 7 tests systematiques sur 3 personnages (Abou Bakari, Amanirenas, Hannibal) dans 3 styles graphiques differents. Resultats : Seedance fait en 1 essai ce que Kling faisait en 8-40 essais. Coherence personnage resolue (0 morphing sur 7 tests). Multi-personnage valide. Decision Aziz : Seedance = outil principal. Kling garde uniquement pour 4K/API automatisation.
**Reference complete de tous les tests et regles** : `memory/seedance-reference.md`

### Etat actuel — Integration Remotion VALIDEE
- **Test 2 valide** : Abou Bakari trone royal, 15s, 720p. Visuel EXCELLENT (zero morphing, style Recraft maintenu, dolly parfait). Audio deforme (Seedance re-synthetise les mots).
- **Test 3 valide (2026-03-30)** : Format "SECONDS X TO Y" + COLOR GRADE. Abou Bakari proue navire, 10s, 720p, 24fps. Score 8.5/10.
  - Ref utilisee : character sheet 5 vues (@Image1)
  - Prompt ~150 mots : 4 segments temporels (wide → medium → close-up → reveal flotte) + COLOR GRADE palette noir/or/terracotta
  - Coherence personnage PARFAITE tout le long (kufi, robe, barbe, teint)
  - Instructions SECONDS suivies a la lettre (dolly in, rotation tete, close-up, pointage doigt)
  - Style 2D flat maintenu sans drift semi-realiste
  - Defaut mineur : bateaux flotte apparaissent un peu soudainement au lieu de graduellement (corriger avec "gradually" dans le prompt)
  - Video : `~/Downloads/abu bakari seedance test 1.mp4`
  - Frames extraites : `/tmp/seedance-test1-frames/frame-01.jpg` a `frame-20.jpg`
- **Test 4 valide (2026-03-30)** : Gestes + micro-expressions. Abou Bakari trone interieur palais, 10s, 720p, 24fps. Score **9.5/10**. MEILLEURE GENERATION TOUS OUTILS CONFONDUS.
  - Ref utilisee : character sheet 5 vues (@Image1)
  - Prompt ~150 mots : 4 segments (barbe contemplation → close-up determination → se lever geste autorite → profil rotation tete)
  - **Micro-animations d'acting VALIDEES** : grattage barbe naturel, clignement lent, plissement yeux, machoire serree, geste main paume ouverte, rotation tete vers profil
  - Physique vetements : robe tombe differemment assis vs debout, plis naturels
  - Decor palais genere SANS ref : trone sculpte, rideaux pourpres, bougies vacillantes, chandeliers or
  - COLOR GRADE chaud parfaitement respecte (ambre, or, ombres profondes)
  - Zero morphing, zero drift, zero artefact
  - Seul pinaillage : transition assis→debout un peu rapide (contrainte 10s)
  - Video : `~/Downloads/abu bakari seedance test 2.mp4`
  - Frames extraites : `/tmp/seedance-test2-frames/frame-01.jpg` a `frame-30.jpg`
- **Test 5 valide (2026-03-30)** : POV → 3e personne + flotte. Score **10/10**. MEILLEURE GENERATION ABSOLUE.
  - Ref utilisee : character sheet 5 vues (@Image1)
  - Prompt ~150 mots : 4 segments (POV mains sur rambarde → pull-back revele kufi/dos → wide flotte gradually → aerien money shot)
  - **Transition POV → 3e personne VALIDEE** : camera "decolle" du personnage en plan continu, zero cut. Kling incapable de faire ca.
  - **Flotte 30+ navires** : tous dans le meme style flat 2D, memes voiles/bois/proportions, sillages ecume individuels. Formation en V centree sur vaisseau amiral. Kling galerais pour 3-4 bateaux.
  - "Gradually" fonctionne : navires apparaissent progressivement (corrige le defaut du Test 1)
  - Pull-back aerien continu type grue sans coupure
  - Frame finale = money shot cinema (30+ navires, soleil couchant, formation fleche)
  - **Audio genere** = SFX (mains sur bois, vagues) + musique cinematique montante. Potentiel : garder SFX/musique Seedance + overlay voix ElevenLabs = gain etape production
  - COLOR GRADE noir/or/ambre parfaitement respecte
  - Video : `~/Downloads/abu bakari seedance test 3.mp4`
  - Frames extraites : `/tmp/seedance-test3-frames/frame-01.jpg` a `frame-30.jpg`
- **Workflow prouve** : Seedance video → ffmpeg strip audio (`-an -c:v copy`) → Remotion `<OffthreadVideo>` + `<Audio>` ElevenLabs V2
- **Composant** : `src/projects/geoafrique-shorts/SeedanceTest.tsx` — offset 9 frames (0.3s) pour synchro lip sync
- **Video silencieuse** : `public/assets/library/geoafrique/test seedance 2.0/abou bakari/abou-bakari-trone-seedance-v2-silent.mp4`

### Recherche — Patterns de prompts (4 exemples + 3 features + 1 video createur)
- **Reference complete** : `research/seedance-examples/REFERENCE.md` — prompts, analyses, adaptations pour nos projets
- **Video createur analysee** : "Seedance 2.0 Is DESTROYING Every AI Video Model" (chaine Ans, 28 mars 2026) — 7 scenes photoreal, prompts 150-250 mots
- **3 formats de prompts valides** (du plus simple au plus precis) :
  1. **Narratif lineaire** (~40 mots) : "Camera follows X... The shot cuts to..." — scenes simples
  2. **Storyboard numerote** (~75 mots) : "Shot 1: / Shot 2: / Shot 3:" — multi-shot controle
  3. **Timecodes seconde par seconde** (~200 mots) : "SECONDS 0 TO 4: ... SECONDS 4 TO 6: ..." — controle maximal, ideal pour scenes complexes avec changements de perspective
- **Plan-sequence** ("Single continuous take") = 1 ref max, zero ref decor
- **Orbite camera** = pattern puissant pour reveler un decor progressivement
- **POV → 3e personne** = transition de perspective dans un meme clip. Seedance gere sans coupure. Pattern narratif : immersion POV comme hook → recul plan large pour le contexte epique.
- **COLOR GRADE en fin de prompt** = section dediee pour ancrer la palette sans uploader de ref image supplementaire (reste a 80 credits text-to-video au lieu de 120). Exemple : "COLOR GRADE: deep black background, warm golden accents, terracotta earth tones, cream highlights."
- **Video-to-video** = uploader une video existante comme base + demander des ajouts. Pattern : "My video is the base video, keep it 100% same, here is what I want you to do: [description ajout]". Mode non teste par nous.
- **Seedance "narrativise" les details cinematiques** (CONFIRME 2026-03-31) : Seedance invente la mise en scene a partir d'une intention narrative minimale. Confirme sur test Amanirenas : prompt "war cry" → Seedance a ajoute un effet poster (image fantome geante de la reine dans le ciel) + genere SFX/cris de guerre + musique montante. Consequence : ne pas sur-decrire chaque plan. Prompts longs (timecodes) = controle precis. Prompts courts (narratif) = laisser Seedance diriger la cinematographie.
- **Audio genere par Seedance** = excellent pour musique/SFX, inutilisable pour narration (toujours remplacer)
- **Texte overlay** = imprevisible dans Seedance, toujours ajouter dans Remotion

### Decisions Seedance (2026-03-29 → 2026-03-31)

| Date | Decision | Pourquoi | Impact |
|------|----------|----------|--------|
| 2026-03-29 | Audio narration = toujours remplacer en post-prod | Seedance re-synthetise les mots uploades, les deforme | Strip audio + overlay ElevenLabs dans Remotion |
| 2026-03-29 | Texte overlay = Remotion uniquement | Placement/orthographe imprevisible dans Seedance | Pas de "text '...'" dans les prompts Seedance |
| 2026-03-29 | COLOR GRADE en fin de prompt | Evite d'uploader une ref image juste pour la palette (80 vs 120 credits) | Ajouter section COLOR GRADE aux prompts Seedance |
| 2026-03-31 | **Seedance = outil PRINCIPAL GeoAfrique** | 7 tests, 3 styles, 3 personnages — Seedance fait en 1 essai ce que Kling fait en 8-40 | Kling relegue a 4K/API uniquement |
| 2026-03-31 | Format SECONDS X TO Y = standard | Meilleur controle teste — instructions suivies a la lettre | Utiliser pour TOUS les clips narratifs |
| 2026-03-31 | SFX/musique Seedance = reutilisable | Audio genere (SFX, musique) excellent — seule narration a remplacer | Garder piste audio Seedance a -12dB + overlay ElevenLabs |
| 2026-03-31 | 1 ref max si personnages similaires | 2 refs navy+violet fusionnees sur Hannibal. Decrire soldats par texte | Ne pas uploader ref soldat si trop similaire au leader |
| 2026-03-31 | Seedance = ultra-litteral | "uphill" = pente 45deg, "forward" = horizontale | Specifier chaque axe/direction explicitement |
| 2026-03-31 | "gradually" = mot-cle anti-artefact | Evite apparition soudaine des elements (valide flotte Test 3 vs Test 1) | Toujours inclure dans segments reveal |
| 2026-03-31 | Multi-personnage VALIDE | 2 refs, 2 identites, zero fusion pendant 10s | Scenes dialogue/confrontation possibles |
| 2026-03-31 | Format 9:16 disponible | Confirme par Aziz dans Dreamina | Pret pour Shorts YouTube verticaux |

### Seedance — Tests supplementaires session 31 mars (TOTAL : 9 tests, 9 succes)

**Test Orbite 180 (Score 9.5/10)** : Abou Bakari trone, orbite clockwise face→profil→dos, 10s. Coherence parfaite multi-angle, reveal progressif decor (bougies→statues→torches→sunset). Defaut mineur : couleur robe change or→blanc. Video : `~/Downloads/orbit 180.mp4`

**Test Bataille (Score 10/10)** : Duel Abou Bakari vs Amanirenas dans hall egyptien, 10s. 2 personnages en COMBAT ACTIF sans fusion, charge + clash d'armes (lance croise sabre), close-ups alternants, eye patch maintenu en combat, expressions fierce. Meilleur test global. Video : `~/Downloads/bataille.mp4`

**Regle 14 ajoutee** : objets parent-enfant (sabre+fourreau) — Seedance ne comprend pas que degainer = fourreau vide. Ecrire "empty scabbard" ou ne pas mentionner le fourreau.

### Credits Dreamina — Situation
- 9 tests generes sessions 30-31 mars (epuises)
- Format 9:16 confirme disponible (non teste)

### Abou Bakari Short V2 — EN COURS (Seedance-native)

**Decision** : Refaire le Short avec Seedance au lieu de Kling. Script reecrit, audio genere, timings mesures.

**Script V2** : `scripts/abou-bakari-v2-script.md` — 9 beats, ton epique, dialogue Moussa, Mansa Moussa "400 milliards"
**Audio V2 FINAL** : `tmp/audio-abou-bakari-v2/abou-bakari-v2-full-final.mp3` (107.8s)
- Partie A (narration 0-50s) + Dialogue (51-58s) + Partie B v2 (59-108s, avec section Moussa)
- Narratrice V3 speed 0.92, accents corriges, "treize cent onze" en lettres
- Dialogue : Abou Bakari (`ICHuIqamER7XZMdm2HYC`, grave) + Moussa (`12mpLi4ieFNVlQlAIJ3m`, plus jeune)
- Note : les `[long pause]` entre beats ajoutent ~10-14s de silence. Option de regenerer avec `[pause]` uniquement pour resserrer. Non bloquant.

**Timings Whisper (audio final)** :

| Beat | Contenu | Debut | Fin | Duree | Source clip |
|------|---------|-------|-----|-------|-------------|
| 1 — Hook Geo | "En 1311... Sauf un homme." | 0s | 13s | 13s | REUTILISE Remotion V1 |
| 2 — Empire | "Abou Bakari deux... hante par l'horizon." | 14s | 28s | 14s | NOUVEAU Seedance 80cr |
| 3 — Expedition | "Il fait preparer... On ne passe pas." | 29s | 40s | 11s | NOUVEAU Seedance 80cr |
| 4 — Decision | "Il ne recule pas... son pouvoir." | 42s | 50s | 8s | REUTILISE Test 2 coupe |
| 5 — Dialogue | "L'empire est a toi... jamais alle." | 51s | 58s | 7s | NOUVEAU Seedance 120cr + dialogue |
| 5b — Moussa | "Son demi-frere... 400 milliards." | 59s | 70s | 11s | NOUVEAU Seedance ou Remotion |
| 6 — Depart | "Il monte lui-meme... jamais." | 71s | 83s | 12s | V2V Test 3 120cr |
| 7 — Colomb | "181 ans plus tard... Le decouvreur." | 84s | 96s | 12s | A definir 0-120cr |
| 8 — CTA | "Mais qui a traverse... en bio." | 97s | 108s | 11s | Remotion pur |

**Budget credits** : 400-520 credits Dreamina (3 clips reutilises, 4-5 nouveaux)

### Prochaines actions (en attente credits Dreamina)

1. **Abou Bakari Short V2** : generer les clips Seedance (beats 2, 3, 5, 5b, 6, 7), assembler Remotion
2. **Test format 9:16** : valider sur 1 beat avant de produire les autres
3. **Test video-to-video** : ajouter equipages au Test 3 (flotte)
4. **Skill batch-short-production** : adapter phases 5-7 pour Seedance

### Backlog tests Seedance (non bloquants)

| Priorite | Test | Objectif |
|----------|------|----------|
| 1 | Format 9:16 | Validation technique bloquante pour production Shorts |
| 2 | Plan-sequence 15s | Tester duree max |
| 3 | Video-to-video | Ajouter elements a un clip existant |
| 4 | Lip sync dialogue 15s | Narration longue avec lip sync natif |

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

### Prochaines actions — GeoAfrique (en attente crédits)

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
| 3 | Seedance 2.0 — Gestes + expressions | Tester micro-animations (mains, clignement, tete) + lip sync + camera | 3 imgs + 1 audio, prompt structure. Voir `memory/seedance-2.md` § Test 3 |
| 4 | Seedance 2.0 — Motion pure sans audio | Tester mouvement corporel sans lip sync | Video sans audio uploade, gestes + camera uniquement |

## Regles Critiques Transversales

- Audio startFrame INTOUCHABLE — derive de mesures ffprobe
- NO EMOJIS dans .ts/.tsx/.js/.json/.yaml
- V3 Pro cfg_scale 0.35-0.4 : portraits | O3 cfg_scale 0.3 : scenes epiques
- JAMAIS Kling V1.6 — endpoints valides : v3/pro, v3/standard, o3/standard
- OffthreadVideo : toujours muted, toujours dans Sequence from={BEATS.xxx.start}
- Split screen : div overflow:hidden (PAS clipPath inset)
- Gemini retouche chirurgicale : Part.from_bytes() + prompt ultra-specifique = edit precis sans toucher au reste

# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-04-22 | A LIRE EN DEBUT DE SESSION
> **SONJATA = READY TO PUBLISH** pending CTA (attente recharge ElevenLabs). Session 2026-04-22 : musique Toumani + hook ajoute + render valide par Aziz.

---

## SESSION 2026-04-22 — SONJATA SESSION 8 (musique + hook + VALIDATION)

### Accompli
1. **Bug Minimax RESOLU** : endpoint `fal-ai/minimax-music/v2.6` avec `{"prompt": str, "is_instrumental": true}`. Pas de `reference_audio_url`. Schema v2.6 via Context7. Sauve dans `memory/key-learnings.md` L4.
2. **Formule prompt Mande validee** (recuperee de `archive/checkpoint_2026-04-12.md`) : artiste nomme + 1-2 instruments + interdictions `no synthesizers, no electronic sounds` + origine precise `Mande from Mali`. Prompts generiques ("Epic West African orchestral cinematic") = echec electronique.
3. **3 variantes Minimax generees** ($0.30, 6min parallele) : A-griot-intime (Toumani), B-griot-royal (Sidiki), C-griot-guerrier (Neba Solo). Aziz choisit **A-Toumani** (157s, rythmes contemplatif + percussions).
4. **Integration musique** : `SonjataShortFull.tsx` avec `<Audio volume={musicVolume}>`, fade-in 2s + fade-out 2s, volume 0.15 (-16.5dB).
5. **Hook ajoute** (decision Aziz apres review critique) : 5s d'ouverture avec segment scene 4 (37s-42s, main + lutte, pas de lever) + narration teaser "Cet enfant ne peut pas se lever. Il fondera un empire africain." (E2-court-3, 63 chars, 4.32s). Option B : silence musique pendant hook, entree kora a scene 1.
6. **Render final** : 151s (5s hook + 146s scenes), 93MB brut / 41MB compresse CRF 28.
7. **VALIDATION AZIZ** : "c'est tres bon. Short = cas d'ecole qui a rode le pipeline. Publiable pending CTA."

### Feedbacks Aziz cles
- Coherence narration/image = force cachee du Short (rare dans le genre, avantage competitif)
- Sonjata est a la fois cas d'ecole ET premier Short legitime de "Heros Oublies"
- Micro-gap "se lever" coupe au cut hook->scene1 = accepte (pas de refaire)
- Scene 10A/10C fond sombre : "sur mobile ca ne se voit pas" (mon evaluation critique etait excessive)
- Scene 10B split video : "l'une des plus spectaculaires, signature a garder"

### Diagnostic critique du pipeline
**Rode a 60-70%**, pas 100%. Short #2 cout estime ~$20-30 et 4-5 sessions (pas 1 session comme un vrai pipeline industriel). Les gaps :
- `scripts/pipeline_gates.py` existe mais pas integre dans le flow
- PREGEN_CHECKLIST skippee sur les "prompts simples" (erreurs les plus couteuses viennent de la)
- Formule Minimax validee etait enterree dans `archive/` (j'ai failli la rater au debut de session — remontee en actif)

### Cout session
- 3 variantes Minimax : $0.30
- 1 narration hook ElevenLabs (63 chars) : ~0 (inclus plan)
- **Total session** : $0.30
- **Cout cumule projet** : ~$52.80

### Prochaine session (post-recharge ElevenLabs)
1. CTA narration (~103 credits) — "Abonne-toi pour decouvrir le prochain heros..."
2. Corriger Unicode `é` dans SonjataCTA.tsx
3. Integrer CTA comme scene 11 dans SonjataShortFull.tsx
4. Render final + publication

### Corrections mineures optionnelles post-publication
- Scene 5A Ken Burns -> clip Seedance V2 (~$1.80)
- Normalisation audio ffmpeg loudnorm
- Extension segment hook a 5.5s pour inclure la queue de "se lever"

---

## SESSION 2026-04-21 PM — SONJATA PAPERCRAFT SESSION 7 (scenes 8-10 + render)

### Accompli
1. **Scene 8** (Mansa + Charte, 18s) : 2 images Gemini + edition chirurgicale tablette inscriptions + 2 clips Seedance V2 9s. Orbite 90 camera = effet pseudo-3D confirme. Valide par Aziz ("parmi les meilleurs clips").
2. **Scene 9** (Citations Charte, 8s) : Remotion pur. Parchemin Gemini + calligraphie Cinzel Decorative + 3 symboles Gemini (arbre vie, bouclier, chaines brisees) avec fond transparent (PIL post-process) + SFX plume ElevenLabs. Valide par Aziz.
3. **Scene 10** (Close, 16s) : Timeline 1235 vs 1789 + split vertical video (scene 2 matrone | scene 8A Mansa, les 2 clips jouent en simultane) + signature "Heros Oublies" fade to black. Sunjata recentre dans le split droit. Valide par Aziz.
4. **CTA** : design code (Cinzel Decorative or, 3 lignes cascade, icones SVG cloche/coeur/enveloppe). Audio narration bloquee — credits ElevenLabs insuffisants (71/103). Bug Unicode dans subtexts (\u00E9 affiche en brut).
5. **Render complet** : `sonjata-short-full.mp4` (204MB, 146s, 1080x1920, 4380 frames). Uploade Vercel, visionne par Aziz.
6. **Musique Minimax** : 3 tentatives echouees (bug `reference_audio_url` API fal.ai). Pas de facturation. Reportee.

### Feedbacks Aziz
- Scene 8 inscriptions tablette : "ca fait beaucoup plus mieux qu'une tablette vide"
- Scene 8 clips : "parmi les meilleurs clips qu'on a genere" — orbite 90 + dot-eyes tenus + objets en main = pipeline rode
- Scene 5A Ken Burns : "fait cheap" — remplacer par clip anime
- Audio narration : non-uniforme entre scenes (keep-and-duck vs narration-only) — normaliser
- Musique de fond : "must-have" — les scenes sans SFX ont des trous sonores

### 6 lecons session
1. generate_audio + "No music" dans prompt = conflit (R-AUDIO-CONFLICT)
2. TOUJOURS deleguer Seedance au visual-producer (incident $10+ evite de justesse)
3. ElevenLabs V2 multilingual prononce les tags [pause] — utiliser `...`
4. Minimax Music fal.ai : `reference_audio_url` requis mais bugge avec string vide
5. Ken Burns sur image statique = percu "cheap" (sauf texte/parchemin)
6. Musique de fond = must-have pour un Short

### Cout session
- 2 images Gemini scene 8 (v1 + v2 + edit chirurgicale) : ~$0.40
- 2 clips Seedance V2 scene 8 : ~$5.44
- 1 image Gemini parchemin scene 9 : ~$0.08
- 3 symboles Gemini scene 9 : ~$0.24
- 1 SFX ElevenLabs plume : ~$0.10
- **Total session : ~$6.26**
- **Cout cumule projet : ~$52.50**

### Prochaine session — voir `brief-next-session-cta.md`
1. Scene 5A : clip anime Seedance V2 (~$1.80)
2. Musique de fond Minimax (consulter doc Context7 AVANT)
3. Normalisation audio (ffmpeg loudnorm)
4. CTA (recharger ElevenLabs + corriger Unicode)
5. Re-render complet

---

## SESSION 2026-04-21 — SONJATA PAPERCRAFT SESSION 6

### Accompli
1. **Scenes 5+6 assemblees** avec narration continue + audio :
   - Scene 5 (13s) : Ken Burns 5A + Seedance 5B, narration-only, cutoff apres "sol."
   - Scene 6 (17s) : 3 sous-clips, Seedance audio 30% sur 6B, fire SFX ElevenLabs 30% sur 6C
   - Compositions TSX : `SonjataScene5.tsx`, `SonjataScene6.tsx`

2. **ElevenLabs SFX API validee** :
   - Endpoint : `POST /v1/sound-generation`, model `eleven_text_to_sound_v2`
   - 3 variantes flammes generees, `fire-crackling-intense.mp3` choisie par Aziz pour 6C
   - 3 variantes tambours guerre generees, `war-drums-menacing.mp3` choisie pour 7A
   - Assets dans `public/assets/sonjata-papercraft/sfx/`

3. **Scene 7 COMPLETE** — Kirina combat (24s, 4 clips) :
   - 7A Soumaoro + armee (6s, V1 Pro, SFX drums 30%) — $1.80
   - 7B Ergot de coq (5s, V2, Seedance audio 30%) — $1.50
   - 7C Arc tir (7s, V2, Seedance audio 30%) — $2.10
   - 7D Soumaoro disparait (6s, V2, Seedance audio 30%) — $1.80
   - Composition TSX : `SonjataScene7.tsx`

4. **Images 7A + 7D regenerees** (corrections) :
   - 7A v3 : soldats Vikings → guerriers Mande XIII siecle + visage Soumaoro humanise
   - 7D v3 : Soumaoro mort au sol → se dissout dans la brume des montagnes

### Decouvertes majeures — V2 > V1 Pro pour paper-craft
- **V1 Pro degrade les dot-eyes** : sur scene 7B, les dot-eyes deviennent des yeux realistes (iris visible) apres 3s de camera rapprochee. Confirme sur extraction de frames.
- **V2 maintient les dot-eyes** : meme scene, meme prompt + clause "MAINTAIN dot-eyes", les yeux restent des points noirs sur TOUTES les frames.
- **Clause dot-eyes obligatoire** : "MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris" — a ajouter a TOUT prompt paper-craft.
- **V2 = endpoint par defaut pour paper-craft** desormais.

### Decouverte — i2v classique > start/end frame pour l'action
- Scene 7C v1 (start/end frame arc bande → relache) = quasi-statique, pas de tir visible
- Scene 7C v2 (i2v classique, une seule image) = tir dynamique, fleche qui part, corps qui recule
- **Regle** : start/end frame = transitions camera. Action dynamique = i2v classique + verbes explosifs.

### Lecons session
1. V2 maintient mieux le style paper-craft dot-eyes que V1 Pro
2. Clause dot-eyes explicite = necessaire dans chaque prompt paper-craft
3. i2v classique > start/end frame pour action dynamique (tir, combat)
4. Start/end frame = uniquement transitions de perspective camera
5. ElevenLabs SFX API = alternative viable quand pas d'audio Seedance
6. Vetements historiques = toujours specifier l'epoque et la culture (Vikings → Mande XIII siecle)
7. Soumaoro DISPARAIT (legende), ne meurt PAS au sol — correction historique
8. Seedance V2 peut animer une dissolution dans la brume (transition d'etat reussie)

### Cout session
- Gemini images : ~$0.18 (2 regens 7A + 7D)
- Seedance clips : ~$7.20 (7A $1.80 + 7B $1.50 + 7C $2.10 + 7D $1.80)
- ElevenLabs SFX : ~$0 (inclus dans le plan)
- **Total session : ~$7.38**
- **Cout cumule projet : ~$46.60**

### Prochaine session
1. Scenes 8-10 (Mansa + Charte + Close)
2. Assemblage final complet scenes 1-10

---

## SESSION 2026-04-20 SOIR — SONJATA PAPERCRAFT SESSION 5

### Accompli
1. **Gallery HTML review** : `sonjata-papercraft/scripts/generate-review-gallery.py` — mobile-friendly, upload Vercel Blob
2. **Checklist pre-generation** : `sonjata-papercraft/PREGEN_CHECKLIST.md` — 8 sections bloquantes
3. **10 images Gemini** generees pour scenes 5-6-7 (~$0.88)
4. **Scene 5A** : Ken Burns Remotion sur last-frame scene 4. Cout $0. Zoom 1.0→1.45 valide par Aziz.
5. **Scene 5B** : start/end frame side-view → top-down (baobab arrache). Transition camera spectaculaire. $2.28.
6. **Scene 6A** : exil sunset, 3 personnages marchent vers soleil couchant. Preferee d'Aziz. V1 Pro $0.74.
7. **Scene 6B** : guerrier Mema. V1 rejete (lance artefact + sabre traverse bras). Correction image (lances aux soldats) + prompt (sabre en main tout du long). V2 valide. $1.81.
8. **Scene 6C** : messager epuise + feu en arriere-plan. V1 Pro $0.89.
9. **Preview assemblage scenes 1-6** : 80s, uploade Vercel Blob (narration desynchronisee = preview seulement)

### Decouverte majeure : Seedance V1 Pro
- Endpoint `fal-ai/bytedance/seedance/v1/pro/image-to-video` = **2x moins cher** que V2
- Qualite excellente, mais **PAS d'audio genere**
- V2 (`bytedance/seedance-2.0/image-to-video`) = audio present, $0.3024/s
- Strategie : mixer V1 (contemplative) + V2 (action avec SFX)

### 9 nouvelles regles sauvegardees
- R-STARTEND-NOAUDIO : start/end frame = pas d'audio
- R-STARTEND-CAMERA : transitions camera ambitieuses = point fort
- R-STARTEND-CROWD : foule START/END doit matcher
- R-STARTEND-MORPH : morphing inevitable si pose + angle changent
- R-RIGID-REPAIR : Seedance "repare" les objets deformes
- R-OBJECT-HOLD : garder objets en main tout du long (jamais degainer/rengainer)
- R-OBJECT-VISIBLE : ne pas mentionner dans le prompt ce qui n'est pas dans l'image
- R-NARRATION-CUTOFF : fadeout narration si clip > duree narration
- R-KENBURNS : alternative $0 pour moments sans action

### Audio manquant (3 clips sans audio Seedance)
- Scene 5B, 6A, 6C : generes avec V1 Pro ou start/end frame
- A traiter prochaine session : SFX ElevenLabs ou narration-only

### Corrections scene 7 identifiees AVANT production
- 7A : soldats europeens → africains
- 7D : Soumaoro mort au sol → disparait/fuit (fidele a la legende)
- Coherence Soumaoro entre 7A et 7D

### Cout session
- Images Gemini : ~$0.88 (10 images + 1 regen + 1 edit chirurgicale)
- Seedance V1 Pro : ~$1.63 (scene 5A echec + 5B v1 echec + 6A + 6C)
- Seedance V2 : ~$3.93 (scene 5B start/end + 6B v2)
- Ken Burns Remotion : $0 (scene 5A)
- **Total session : ~$6.44**

### Prochaine session
1. Assembler scenes 5-6 individuellement avec audio (comme scenes 1-4)
2. Valider chaque assemblage (Vercel, review Aziz)
3. Regenerer images 7A + 7D
4. Produire clips scene 7 (4 clips combat Kirina)
5. Scenes 8-10 si temps

---

## SESSION 2026-04-20 — SONJATA PAPERCRAFT SESSION 4

---

## SESSION 2026-04-20 — SONJATA PAPERCRAFT SESSION 4

### Accompli
1. **3 character sheets canoniques** generes et valides :
   - Sunjata enfant (torse nu + pagne rouge) — scenes 1-5
   - Sunjata guerrier (tunique blanche + sash rouge + sabre) — scenes 6-7
   - Sunjata roi (boubou royal + bonnet mande + sceptre) — scenes 8-10
   - Fil conducteur visuel : le rouge a travers les 3 ages

2. **Scene 3** (forgeron + rassemblement, 12.82s) — FAIT
   - Test R-PC16 storyboard colore 6 panels : demi-succes (trim 1s, forgeron modifie par Seedance)
   - 4 iterations storyboard Gemini (v1 agent, v2 edit echoue, v3+v4 regen complete)
   - Clip final 14s avec narration keep-and-duck
   - Cout : ~$4.80

3. **Scene 4** (IL SE LEVE, 11.8s) — FAIT
   - Start/end frame + orbite 180 — excellent resultat
   - Barre retrecit ~30% (R-RIGID confirme) mais acceptable en mouvement
   - Clip final 12s avec narration keep-and-duck + audio Seedance
   - Cout : ~$3.76

4. **Menage memoire** :
   - 83 fichiers -> 26 actifs + 62 archives
   - 42 feedbacks -> 4 fichiers rules consolides
   - MEMORY.md : 170 -> 69 lignes

5. **Script forced alignment** : `verify-scene-boundaries.py`
   - 7 scenes corrigees dans le manifest (toutes les scenes 5-10 avaient des timestamps faux)
   - Source de verite : `scene-boundaries-verified.json`

6. **Templates prompts Seedance** : 5 templates dans `memory/templates/seedance-prompts.md`

### 8 lecons session
1. Charsheets AVANT production (evite incoherences vestimentaires)
2. Storyboard regen > edition chirurgicale (Gemini ne cible pas 1 panel)
3. Forced alignment = source de verite (pas le manifest)
4. Objets rigides retrecissent en start/end frame (exagerer END)
5. "eyes WIDEN" interdit en paper-craft (orbites blanches)
6. Orbite 180 masque partiellement les artefacts
7. Structure prompt Seedance : camera d'abord, sujet, contexte, style, anti-artefacts
8. Verifier forced alignment UNE FOIS pour tout le Short (script automatise)

### Cout session
- Images Gemini : ~$1.20 (3 charsheets + ~10 storyboards/images)
- Clips Seedance : ~$12.60 (Scene 3 $4.50 + Scene 4 $3.60 + tests precedents)
- **Total session : ~$13.80**
- **Cout cumule projet : ~$33.50 / budget $43-55**

### Prochaine session
1. **Creer gallery HTML** de review (images + prompts + variations par scene)
2. **Integrer checklist pre-generation** dans visual-producer
3. **Scenes 5-6-7** en batch :
   - Scene 5 : baobab arrache (12.08s, clip 13s) — risque R80 racines
   - Scene 6 : exil + guerrier + messager (16.79s, 3 clips) — transition enfant -> adulte
   - Scene 7 : Kirina combat (24.28s, 3-4 clips) — start/end frame + combat
4. Pre-generer images Gemini des 3 scenes, presenter en gallery pour validation AVANT Seedance

### Timestamps VERIFIES (toutes scenes)
| Scene | Start | End | Duree | Clip |
|---|---|---|---|---|
| 1 | 0.08 | 11.46 | 11.38s | 12s |
| 2 | 12.14 | 25.60 | 13.46s | 14s |
| 3 | 26.56 | 39.38 | 12.82s | 13s |
| 4 | 40.28 | 52.08 | 11.80s | 12s |
| 5 | 52.94 | 65.02 | 12.08s | 13s |
| 6 | 66.19 | 82.98 | 16.79s | 17s |
| 7 | 83.94 | 108.22 | 24.28s | 25s |
| 8 | 109.34 | 126.94 | 17.60s | 18s |
| 9 | 128.08 | 135.66 | 7.58s | 8s |
| 10 | 137.00 | 152.86 | 15.86s | 16s |

---

## SESSION 2026-04-19 SOIR — SONJATA PAPERCRAFT PRODUCTION

### Pipeline end-to-end VALIDE
```
Image Gemini ($0.04-0.08) -> Clip Seedance i2v ($3-4) -> Remotion assemblage (keep-and-duck + mute narration) -> Render 1080x1920 -> Upload Vercel -> Validation mobile Aziz
```

### Scene 1 — Prophetie + naissance (VALIDEE, $3.72)
- Image v2 (correction proportions sage-femme)
- Clip 12s quasi-parfait du premier coup
- Adherence au prompt excellente (devin, roi, pan camera)
- Note post-prod : dernieres frames zoom trop sur bebe — crop/freeze a decider

### Scene 2 — Humiliation Sassouma (VALIDEE, $8 dont $3.90 perdu)
- 4 iterations image (positions actives -> neutres -> vetements modernes -> villageois insuffisants)
- Dialogue lip-sync Seedance VALIDE (generate_audio: true)
- Mute narration via forced alignment (21.72-25.60s) — precision au centieme de seconde
- 2 clips generes par erreur (double agent) — clip A choisi
- Audio Seedance : lip-sync bon, "rampe" sonne "rame" (mineur, accepte)

### Manifest v2 — 10 scenes
| Scene | Duree | Etat | Cout |
|-------|-------|------|------|
| 1 | 12s | FAIT | $3.72 |
| 2 | 13s | FAIT | $8.00 |
| 3 | 15s | A FAIRE | ~$4.50 |
| 4 | 14s | A FAIRE (clip existant + genere) | ~$2.86 |
| 5 | 14s | A FAIRE | ~$4.36 |
| 6 | 17s | A FAIRE (3 clips) | ~$5.34 |
| 7 | 24s | A FAIRE (4 clips, combat) | ~$7.60 |
| 8 | 16s | A FAIRE | ~$4.96 |
| 9 | 11s | A FAIRE (Remotion pur) | $0 |
| 10 | 19s | A FAIRE (split-view Remotion) | ~$5.86 |

### 7 erreurs codifiees
1. Double generation Seedance → 1 agent/1 job max
2. Vetements = coherents avec l'EPOQUE (contextuel, pas universel)
3. R-PC1 positions neutres → checklist par personnage
4. Presenter image + prompt + cout en un bloc
5. Specifier nombre minimum figurants
6. Frontieres de MOTS exactes pour mute/unmute
7. Deplacements figurants OK mais prompt TRES litterale

### 2 nouvelles regles paper-craft (R-PC14, R-PC15)
- R-PC14 : continuite inter-scenes via derniere frame editee
- R-PC15 : deplacements figurants = encourages mais specifier identite+direction+destination

### Prochaine session
- Scene 3 : continuite scene 2 (derniere frame editee, Soundjata se redresse)
- 3 beats : rage (0-5s) → forgeron arrive (5-10s) → cercle forme (10-15s)
- Cout cumule : $11.72 / budget $43-55

---

## SESSION 2026-04-18 NUIT — TESTS PAPER-CRAFT AVANCES

### 4 tests Seedance realises (~$8 total)

| Test | Duree | Mode | Resultat | Cout |
|------|-------|------|----------|------|
| Thiaroye camp palette froide | 5s | i2v | SUCCES — style tenu, micro-details eau animes | $1.50 |
| Marketplace diversite (enrichi) | 5s | i2v | SUCCES — zero morphing malgre visages detailles | $1.50 |
| Combat choregraphie anime | 8s | ref-to-video | ECHEC — style drift + choregraphie ignoree (0/2 confirme) | $2.40 |
| Combat start/end frame dirigiste | 8s | i2v start+end | SUCCES — combat dynamique, style 100%, prompt suivi | $2.40 |

### Conclusions majeures

1. **Reference-to-video = mort pour paper-craft** (0/2). Ne plus tester. Alternative : start/end frame.
2. **Start/end frame + prompt dirigiste = workflow combat valide**. Parametre `end_image_url` fonctionne sur fal.ai. END frame doit etre derive du START via Gemini chirurgical pour coherence.
3. **Palette froide sans changer anatomie = fonctionne**. Thiaroye paper-craft confirme.
4. **Paper-craft enrichi (visages detailles) tient en Seedance** mais c'est un entre-deux avec BD flat.
5. **Adherence au prompt tres elevee** en image-to-video : chaque instruction individuelle suivie (cigarette, changement de poids, arme un fusil, enfant qui court). Aziz impressionne.
6. **Artefacts start/end frame** : elements graphiques dessines (trainee de mouvement, poussiere pre-dessinee) = objets permanents pour Seedance. Generer des frames PROPRES sans effets.

### 5 nouvelles regles paper-craft (R-PC6 a R-PC10)
- R-PC6 : START frame = sol propre, zero effets dessines
- R-PC7 : END frame = pose finale SANS trainee de mouvement
- R-PC8 : combat = start/end frame + prompt dirigiste (PAS ref-to-video)
- R-PC9 : paper-craft enrichi tient aussi (a confirmer sur 10s+)
- R-PC10 : palette froide fonctionne sans changer anatomie

### 3 nouvelles regles Seedance (83-85)
- R83 : reference-to-video = echec en paper-craft (0/2)
- R84 : `end_image_url` fonctionne sur fal.ai i2v
- R85 : combat paper-craft = start/end + SECONDS X TO Y

### Cout session soir
- Gemini images : ~$0.30 (diversite + Thiaroye + 3 combat frames)
- Seedance : ~$7.80 (4 clips)
- **Total : ~$8.10**

### Cout cumule session 2026-04-18 complete
- Matin : ~$14.50 (TTS + paper-craft initial)
- Soir : ~$8.10 (tests avances)
- Nuit : ~$6.50 (POV $1.50 + storyboard-to-video Scene 1 $4.50 + images Gemini ~$0.50)
- **Total journee : ~$29.10**

### Session 2026-04-18 NUIT TARDIVE — POV + Storyboard-to-video + Thiaroye manifest

**POV premiere personne** (archer paper-craft 5s) : demi-reussi. Viser+tirer = excellent. Suivi fleche = Seedance fait 180 au lieu de suivre. R-PC13 documentee.

**Storyboard-to-video Scene 1 Thiaroye** (15s) : ECHEC. Reference-to-video ignore le style paper-craft = confirme 0/3. Produit du low-poly/flat-3D. R-PC11 + R86 documentees. Alternative : decouper en 3 clips i2v 5s + Remotion (R-PC12).

**Thiaroye manifest cree** : `src/projects/geoafrique-shorts/manifests/thiaroye-manifest.json`. 7 scenes, 110s, paper-craft palette froide. Source de verite pour la production.

**2 nouvelles regles Aziz** (feedback_manifest-first.md) :
1. Manifest JSON = roadmap obligatoire AVANT production
2. Ordre chronologique strict (Scene 1 → 2 → 3, pas de saut)

**Decision Thiaroye paper-craft** : Aziz decide de pivoter Thiaroye vers paper-craft palette froide (les clips Kling existants sont abandonnes). Audio v6 (110s) + script V4 restent. Seuls les visuels changent.

**Prochaine session** : tester R-PC12 (3 clips i2v 5s pour Scene 1 Thiaroye) + continuer production chronologique.

---

## SESSION 2026-04-18 — EXPLORATION TTS + STYLE PAPER-CRAFT

### Gemini 3.1 Flash TTS — Teste et rejete
- 15 fichiers WAV generes ($0 free tier) : 3 voix brutes, 5 sculptees, 4 accents africains, 3 presets AI Studio
- Expressivite excellente (200+ audio tags, controle rythme parfait)
- **Bloquant** : pas de voice cloning, accents africains non convaincants via prompt seul
- ElevenLabs reste le choix. A revisiter quand cloning dispo.

### Style Paper-Craft Sepia — VALIDE (5/5 tests Seedance)
- Pipeline : GPT Image 1.5 (ou Gemini avec style-ref) → Seedance image-to-video + clause STRICT STYLE FIDELITY
- 5 tests reussis : village calme (5s), plage marche (5s), combat 10s, dialogue 7s, barre de fer mouvements camera (3x5s)
- **Image-to-video OBLIGATOIRE** (reference-to-video ignore le style = 0/1)
- **Orbite 180** = meilleur mouvement camera (9.5/10, effet pseudo-3D bonus)
- **Crane up** = echec (Seedance fait monter le personnage au lieu de la camera)
- **Barre qui se tord** = impossible (faiblesse F5 objets rigides, 0/3)
- Avantage anti-detection AI confirme par Aziz
- Gemini meilleur que GPT pour coherence de style (GPT drift a chaque edition)
- Variante "mature" testee = drift vers BD flat (le mot "mature" = plus de detail). Changer PALETTE pas ANATOMIE.

### 8 nouvelles regles Seedance (75-82)
- R75 : image-to-video >> reference-to-video pour fidelite style
- R76 : clause STRICT STYLE FIDELITY obligatoire
- R77 : crane up = Seedance confond camera et personnage
- R78 : orbite 180 = meilleur mouvement camera paper-craft
- R79 : dolly in = fonctionne proprement
- R80 : deformation objets rigides = impossible
- R81 : prompt doit decrire l'IMAGE pas le sujet (erreur attrapee par Aziz)
- R82 : identifier personnages par vetements+position, pas attributs vagues

### 5 regles paper-craft (R-PC1 a R-PC5)
- R-PC1 : image source = position NEUTRE (confirme R39)
- R-PC2 : personnage recurrent = intention CONSTANTE (Soundjata = toujours defiant)
- R-PC3 : larmes = NE PAS demander en paper-craft (grosses gouttes comiques)
- R-PC4 : audio Seedance dialogue = lip sync exploitable, prononciation a remplacer ElevenLabs
- R-PC5 : avantage anti-detection AI (style pre-AI, texture masque artefacts)

### Cout session
- Gemini TTS : $0 (free tier)
- GPT Image 1.5 : ~$2 (7 images)
- Gemini images : ~$0.50 (5 images)
- Seedance : ~$12 (8 clips : 1x ref-to-video echec + 7x image-to-video)
- **Total : ~$14.50**

### Prochaine session : corrections Soundjata (4 corrections restantes inchangees)

---

## SESSION 2026-04-17 — RESUME

### Accompli
- Inventaire complet des assets, confirmation Acte par Acte avec Aziz
- Manifest `soundjata-manifest.json` corrige (Acte II = pas d'emprunt Acte III, ages par acte)
- **Acte VIII Close** : split-vertical VIDEO (enfant rampant + guerrier a cheval), VALIDE par Aziz
- **Assemblage v1** complet 8 Actes (132.8s), uploade Vercel, visionne par Aziz
- **Systeme de gates** : 7 → 13 gates (prompt, canonical ref, duration, reverse bias, inputs enrichi [9 imgs/3 vid/3 aud/50MB], context, chain, fal balance, TTS scan, face diversity, ElevenLabs params, age continuity, style consistency)
- Seedance API branchee dans batch_runner.py + upload Vercel Blob auto
- Agents connectes aux gates (visual-producer + audio-director memoires mises a jour)
- SMS Textbelt configure et teste (133 SMS restants)
- Village de jour genere (`refs/acte2/village-daytime-plate.png`)
- Pipeline CANONICAL_REFS corrige (soundjata pointe vers combat-ref, plus ancien tmp/)

### Echecs + Lecons ($5.44 perdus)
1. **Acte II v1 ($2.74)** : storyboard genere FROM SCRATCH sans refs canoniques. Seedance a copie le style du storyboard au lieu des refs canon. → Gate 13 (style_consistency) ajoute
2. **Acte II v2 ($2.70)** : mauvaise ref age (soundjata-baby-ref.png = toddler 2-3 ans, mais Acte II = garcon 7-8 ans, meme age qu'Acte III). → Gate 12 (character_age_continuity) ajoute
3. Self-review agent a donne 9.5/10 aux deux clips → self-review ne compare pas au style existant

### Nouvelles regles
- **REVIEW-BEFORE-SPEND** : l'agent prepare tout + gallery Vercel, Claude examine, Aziz valide AVANT Seedance
- **Storyboard avec refs canoniques** : JAMAIS generer from scratch. Sidecar .refs.txt obligatoire.
- **Ages dans le manifest** : `character_ages_by_acte` ajoute. Gate 12 verifie la coherence.

### Prochaine session : voir `memory/brief-soundjata-corrections.md`
4 corrections : ducking variable ($0) → transition pre-Kirina ($0-3) → Acte II regen (~$5) → re-render assemblage

---

## SESSION 2026-04-16 NUIT — TROUS A/B/C COMBLES + INVENTAIRE REQUIS

### Trou A — COMBLE
- 2 images Gemini (start/end frame) generees par visual-producer
- Lecon : generer END d'abord, puis utiliser END comme ref pour START (coherence visage/vetement)
- Lecon : verifier clips adjacents pour continuite (villageoises oui/non)
- Clip Seedance 6s via Dreamina web (credits existants) : `provocation.mp4` -> `acte2-setup-humiliation.mp4` VALIDE
- Mode start/end frame + prompt directif (pas de storyboard — trop court pour 4 panels)
- "slowly" retire du prompt (invite au quasi-statique) — remplace par verbes actifs

### Trou B — IMAGE VALIDEE
- `trou-b-v2.png` : Soundjata enfant au sol, poings serres, matrone + Sogolon en arriere-plan
- Composition Ken Burns zoom-in creee (`SoundjataReaction` dans `SoundjataTransitions.tsx`)

### Trou C — IMAGE VALIDEE
- `trou-c-v1.png` : gros plan pieds plantes au sol + barre de fer tordue
- Composition Ken Burns zoom-out creee (`SoundjataNePlus` dans `SoundjataTransitions.tsx`)

### Assemblage Actes I-III — ECHEC
- Composition `SoundjataActesI_III.tsx` creee et rendue (47.72s)
- **PROBLEME** : mauvais clip utilise pour Acte I (ancienne version au lieu de la version avec Soumaoro oeil/silhouette validee par Aziz)
- **CAUSE** : clips eparpilles dans plusieurs dossiers, pas de source de verite unique
- **DECISION** : inventaire complet + manifest definitif en PROCHAINE SESSION

### Feedbacks Aziz (4 nouveaux)
1. Claude = orchestrateur, pas executant — deleguer aux agents
2. Corriger le risque AVANT de lancer l'API — pas de "fallback prevu"
3. Pas de "slow/slowly" dans les prompts Seedance
4. Verifier continuite visuelle avec clips adjacents avant generation

### Cout session
- Gemini : ~$0.48 (6 images)
- fal.ai : ~$3.00 (1 clip rejete — version Dreamina web retenue a la place)
- Dreamina web : $0 (credits existants)
- **Total : ~$3.48**

### Prochaine session
Voir `memory/brief-soundjata-next-session.md` — inventaire + manifest + reassemblage + Acte VIII.

---

## SESSION 2026-04-16 SOIR — ACTE IV CLIP 1 (exil + Mema + messagers) — VALIDE

### Lecon majeure session : prompt detaille shot-by-shot <4000 chars

**A/B test realise sur 3 tentatives ($12.69 total)** :
- v1 (API fal.ai, prompt minimaliste 1200 chars) = REJETE — style 3D-ish, double sabre, identity drift
- v2 (API fal.ai, prompt 1800 chars + clause fidelite) = REJETE — morphing cheval, couronne hallucinee, 3D-ish
- **v3 (Dreamina web, prompt detaille shot-by-shot 3656 chars) = VALIDE** — flat BD, identite respectee, zero artefact majeur

**Conclusion** : le prompt minimaliste (~200 mots) est INVALIDE pour scenes multi-contexte. Le prompt detaille (3500-4000 chars) avec verbes d'action forts + anti-artefacts explicites est OBLIGATOIRE. Limite 4000 chars = contrainte Dreamina web, recommandee aussi pour API fal.ai.

**Regle operationnelle validee** :
- Style : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors"
- Un paragraphe par shot : action + camera + eclairage + position
- Anti-artefacts : "no morphing, clean hard CUTS only, RIGID/NON-DEFORMING, ALREADY dismounted, NO crown/scepter"
- Storyboard = "COMPOSITION GUIDE ONLY. Do NOT copy sketch style."

### Clip Acte IV Clip 1 final
- **Fichier** : `clips-validated/acte4-clip1-exil-mema-messagers-v3-final.mp4` (6.1 MB, 720x1230, 15.32s)
- **Source** : Dreamina web (credits existants, pas API fal.ai)
- **Post-prod** : crop filigrane AI (50px haut) + freeze derniere frame 1.2s + keep-and-duck narration 100% / Dreamina 30%
- **Artefact mineur accepte** : 2 messagers debout tiennent des renes sans chevaux visibles (interpretatif, non bloquant)

### Storyboard v3 (direction Kimi DA)
- 4 panels : enfant exil → guerrier forge Mema → cavaliers galop lateral → OTS supplication
- Corrections iterees : age narratif enfant (pas adulte), profil lateral (pas frontal), over-the-shoulder
- Consultation Kimi K2.5 = precieuse pour angles camera et dynamisme

### Etat Soundjata Short apres cette session

| Acte | Contenu | Etat | Asset |
|------|---------|------|-------|
| I | Setup tyrannie + prophetie + handicap | ✅ Valide (storyboard 6 panels, Dreamina) | `acte1-setup-v1.mp4` |
| II | Humiliation (rampant + insulte) | ✅ | `acte2-insulte.mp4` + debut `acte3-iron-bar-v1.mp4` |
| III | Transformation (barre + baobab) | ✅ | `acte3-iron-bar-v1.mp4` (15s double role) |
| **IV** | **Exil et retour** | ✅ **VALIDE 2026-04-16** | **Clip 1 : `acte4-clip1-exil-mema-messagers-v3-final.mp4`** + Clip 2 : `acte4-clip2-lion-revient-v1.mp4` |
| V | Kirina (invul + impact + defaite) | ✅ | `actes/acte-v-final.mp4` |
| VI | Empire + Charte | ✅ Remotion pur | `SoundjataCharte.tsx` + `charte/` |
| VII | Legende vivante (griots) | ✅ | `out/acteVII-final/acte7-full-v1.mp4` + `SoundjataActeVII.tsx` |
| VIII | Close signature serie | ❌ A generer | Remotion pur + 2 images Gemini (~$0.20) |

**7/8 Actes COMPLETS.** Reste : Acte VIII (Remotion pur, pas de Seedance) + composition finale `SoundjataShort.tsx`.

### Memoires mises a jour cette session
- `visual-producer/MEMORY.md` : 6 nouvelles lecons (age narratif, frontal animaux, anatomie objet porte, prompt detaille <4000, self-review severe, "9 shots" bug)
- `feedback_storyboard-fidelity-seedance.md` : reecrit entierement avec preuve A/B test
- `feedback_self-review-severe.md` : nouveau fichier
- `seedance-storyboard-technique.md` : regle 14 reecrite (minimaliste invalide), regle 22 nuancee
- `MEMORY.md` index : 2 nouvelles entrees feedback

### Cout session
- 3 storyboards Gemini : $0.24
- Kimi consultation : ~$0.02
- Seedance API v1 : $4.23 (rejete)
- Seedance API v2 : $4.23 (rejete)
- Dreamina web v3 : credits existants ($0)
- **Total API** : ~$8.72
- **Total reel** : ~$4.49 (Dreamina credits gratuits)

---

## SESSION 2026-04-14 SOIR — PHASE 2 SOUNDJATA (Actes I + IV en parallele) — PARTIEL

### Test parallelisation Stage 3 + 4 VALIDE
- **Stage 3 Visual Plans** : 2 agents `visual-producer` en parallele (Acte I + Acte IV) — temps reel 2 min vs estimation sequentielle 5-6 min. Gain ~60%.
- **Stage 4 Refs Gemini** : 11 refs en parallele via 1 script asyncio — 78s vs estimation sequentielle 5-6 min. Gain ~75%.
- **Stage 4 Seedance** : 3 appels en parallele (Acte I 13s + Acte IV Clip 1 15s + Acte IV Clip 2 5s) — 2 reussis ($3.93 + $1.50), 1 echec silencieux (Acte IV Clip 1 bloque par solde fal.ai a sec).
- Conclusion : pipeline parallele technique fonctionne. Goulots restent humains (validation Aziz) et financiers (solde API a monitorer avant batch).

### Pain point critique decouvert : SOLDE FAL.AI
- Compte fal.ai s'est epuise au milieu du batch parallele Stage 4
- Symptome : echec 403 silencieux sur 1 des 3 appels Seedance — agent a remonte un message confus sans signaler le 403
- Diagnostic : compte avait juste assez pour 2 clips ($5.43) mais pas pour le 3e ($4.54)
- **Regle** : avant tout batch Seedance > 1 clip, verifier solde fal.ai (https://fal.ai/dashboard/billing) ET informer Aziz du cout total estime
- A faire en debut de prochaine session : recharger fal.ai (~$15-20 minimum)

### Erreur de pipeline detectee : Doc-First sur assets canoniques personnage
- visual-producer a genere `soundjata-adult-warrior-ref.png` from scratch alors que `soundjata-combat-ref.png` (Acte V canon : tresses + tunique blanche + sash rouge + sabre) existait deja
- Resultat : 2 personnages visuellement differents pour le meme Soundjata adulte (cheveux courts + barbe + boubou indigo + lance vs canon)
- Aziz a detecte le drift, regen complet 4 refs Acte IV en mode edition chirurgicale Gemini avec ref canon en input ($0.32)
- **Nouvelle regle dans visual-producer/MEMORY.md** : "Doc-First sur les assets canoniques personnage" — toute regen perso recurrent DOIT charger le ref canon en input Gemini

### 3 nouvelles regles Seedance storyboard (apres review Acte I v1 par Aziz)
- **Regle 17 nuancee** : densite plans selon type scene (action 9 / narratif multi-beats 6-7 / contemplatif mono-beat 9 / contemplatif slow 4-5). 9 panels en 13s = trop dense pour scene narrative a 3 sous-scenes.
- **Regle 18** : refs personnages NON transferables entre Actes sauf meme perso canon. Reutiliser griots Acte VII pour griots Acte I = repetition narrative detectable par spectateur.
- **Regle 19** : refs personnages secondaires DOIVENT expliciter periode historique + bannir elements modernes. Sinon Gemini glisse vers vetements modernes (cas: t-shirt synthetique sur fillette XIIIe siecle Acte I).

### Etat Soundjata Short apres cette session
- 5/8 Actes COMPLETS (II partiel, III, V, VI, VII)
- **Acte I v1 livre mais a REGEN v2** : 3 defauts identifies (griots reutilises, 9 panels trop dense, vetements enfants modernes). **Storyboard v2 6 panels deja regenere** ($0.08), pret pour relance Seedance prochaine session.
- **Acte IV Clip 2 (lion revient, 5s) livre et valide** par Claude principal review visuelle. Canon Soundjata respecte (tresses + tunique blanche + sash rouge + sabre + cheval noir + sunrise). En attente validation Aziz oreille.
- **Acte IV Clip 1 (15s exil/Mema/messagers) BLOQUE** : script + refs prets, attend recharge fal.ai.
- **Acte VIII** : a faire (Remotion pur split vertical signature serie, ~$0.20 + composition).
- **Composition finale** `SoundjataShort.tsx` : a faire apres Acte I v2 + Acte IV Clip 1 + Acte VIII.

### Cout cumule Phase 2 partielle : $6.71
- 11 refs Gemini initiales + 4 regens canon + 1 regen storyboard 6 panels = $1.28
- Acte I Seedance v1 = $3.93 (sera regen)
- Acte IV Clip 2 Seedance = $1.50

### Cout estime restant pour finir Soundjata : ~$8.70
- Acte IV Clip 1 (Seedance 15s) : $4.54
- Acte I v2 (Seedance 13s avec storyboard 6 panels) : $3.93
- Acte VIII (Remotion + 2 images Gemini) : $0.20

### Discussion strategique fin de session
- Aziz a partage son systeme d'amont (agent Dispatch quotidien pour news geopolitique africaine actif depuis ~3 semaines)
- Decision : la chaine News n'est PAS un nouveau projet, c'est une mise en production d'un systeme valide pret. Execution differee post-publication 3 Shorts. Voir `chaine-news-geopolitique.md`.
- Retroinspection Aziz lucide : tendance perfectionniste, plusieurs projets ouverts non finis, manque boucle feedback publication. S'engage a publier 3 Shorts (Soundjata, Abou Bakari, Thiaroye) AVANT exploration nouveaux outils. Voir `feedback_finish-before-explore.md`.
- Analyse video YouTube ($1000 court-metrage Seedance) : confirme que notre coût/Short ($4-5) est ~20× moins cher que la concurrence, validant notre pipeline.

---

## SESSION 2026-04-14 PM — SOUNDJATA ACTE VII (pipeline 5 agents premier test)

### Pipeline 5 agents VALIDE en production (one-shot APPROVE)
- Acte VII Soundjata (Legende Vivante griots, 13.2s) genere de bout en bout par les 5 agents refondus
- Temps total ~45 min, cout $4.21 (5 refs Gemini $0.40 + 2 regens $0.16 + clip Seedance $3.63 + Kimi K2.5 $0.02)
- Verdict quality-reviewer : **APPROVE** one-shot, aucune reserve, 2 points cosmetiques non-bloquants
- Workflow : Visual Plan → 5 refs Gemini (storyboard 9 panels 3x3 + 3 char refs + env plate) → Seedance storyboard-to-video 12s + loop muette 1.17s → keep-and-duck 30% Remotion → render 1080x1920 13.23s → upload Vercel Blob
- Render final : `out/acteVII-final/acte7-full-v1.mp4` (13.6 MB)

### Regle critique decouverte : Duree clip >= Duree narration
- Pain point : clip Seedance 12s demande, narration 13.22s = gap 1.17s force une loop muette en Remotion + 2 mini-renders avant d'arriver au bon LOOP_START (frame 315 au lieu de 240)
- Cause racine : visual-producer a applique palier Seedance par defaut sans cross-check narration
- Regle ajoutee dans `memory/pipeline.md` + memoires agents : cross-check bloquant `clip_s >= ceil(narration_s)` AVANT tout appel API. Arrondir a la seconde superieure (paliers Seedance 1s, max 15s). Si > 15s, splitter en 2 clips back-to-back.

### 7 regles ajoutees dans memoires (a conserver)
1. Duration match scene (pipeline.md + 2 memoires agents)
2. 9 panels 3x3 par defaut pour TOUT storyboard-to-video (seedance-storyboard-technique regle 17)
3. Limite Seedance 9 images (correction hallucination "4 max")
4. Gemini enfant drift en contexte transmission (gemini.md + visual-producer memoire)
5. Mumble Sims-style = atout pour lip-sync (seedance-storyboard-technique regle 15)
6. Distinction couleurs OTS (seedance-storyboard-technique regle 16)
7. 9 panels valide en contemplatif (seedance-storyboard-technique regle 17)

### Projection efficacite (Aziz + Claude alignes)
- Pipeline mature, industrialisable
- 2-3 scenes/session plausibles avec parallelisation (Visual Plans simultanes + batch Gemini + clips Seedance en parallele)
- Stage 6 quality-reviewer skippable sur Actes simples, reserve aux combats/transitions critiques
- 4 prochains Shorts (Lat Dior, Yaa Asantewaa, Hannibal, Nzinga) beneficieront du cout d'apprentissage paye sur Soundjata

---

## SESSION 2026-04-13/14 — STORYBOARD-TO-VIDEO + SOUNDJATA ACTE V

### Technique Storyboard-to-Video (@voxelplot) : VALIDEE
- Endpoint : `bytedance/seedance-2.0/reference-to-video` avec 4 images (storyboard N&B + 2 char refs + env plate)
- Avantage : 4-9 shots coherents en 1 seul clip < 15s, identite perso verrouillee entre shots
- Pour scenes narratives multi-plans d'action ou sequences preparation+impact
- **14 regles documentees** dans `memory/tools/seedance-storyboard-technique.md`
- **6 faiblesses identifiees** avec remedes (F1 transitions d'etat, F2 char refs fond neutre, F3 layout 5 panneaux instable, F4 Gemini Pro trop conservateur, F5 objets rigides s'etirent, F6 format 9:16 obligatoire)
- **Integre comme capacite principale** de l'agent `visual-producer`

### Soundjata Acte V (Kirina) : COMPLET (~$18 session)
- Segment A v2 : 12s, POV griot + ergot coq (9.5/10)
- Segment B v3 : 12s, POV tir + impact + terreur (8.5/10, defauts mineurs aura/decor acceptes)
- Composition `src/projects/geoafrique-shorts/SoundjataActeV.tsx` (22s, 1080x1920)
- Render final : `public/assets/library/geoafrique/heros-oublies/soundjata/actes/acte-v-final.mp4` (24.19s)
- Audio strategy : keep-and-duck (narration 100% + Seedance 30%) — validee et documentee

### Stategie keep-and-duck audio : VALIDEE
- Pour storyboard-to-video multi-shots avec `generate_audio: True`
- Ne pas stripper Seedance audio, mixer a 30% sous narration ElevenLabs
- Gain : 3-5h post-prod audio economisee par Short (SFX auto-synchronises)
- Voir `feedback_seedance-keep-and-duck.md`

### 5 problemes audio identifies (integres dans audio-director)
- P1 Narration coupee aux frontieres (Whisper approximations ±200-500ms) -> buffer
- P2 Debordement narration sur acte suivant -> clamp sur frontiere SCRIPT pas duree video
- P3 Seedance audio = voix/dialogues inventes possibles -> ecouter pure avant mixer
- P4 Keep-and-duck level par scene (30% default, adjust)
- P5 Drift timestamps Whisper vs ElevenLabs -> marge ±0.3s sur cuts

### Memory tools Gemini corrigee
- `gemini-3.1-flash-image-preview` = **edition chirurgicale** (avec source + prompt)
- `gemini-3-pro-image-preview` = generation pure sans source (trop conservateur en edit)
- Precedente inversion corrigee dans `memory/tools/gemini.md`

---

## SHORT SOUNDJATA — ETAT REEL 2026-04-14

4 actes sur 8 **COMPLETS**, 4 actes restants.

| Acte | Contenu | Duree | Etat | Asset |
|------|---------|-------|------|-------|
| I | Setup tyrannie + prophetie + handicap | 12.1s | A generer | — |
| **II** | **Humiliation (rampant + insulte)** | 16.1s | ✅ | iron-bar debut + `acte2-insulte.mp4` |
| **III** | **Transformation (barre + baobab)** | 19.3s | ✅ | `acte3-iron-bar-v1.mp4` (15s, couvre tout) |
| IV | Exil et retour | 16.4s | A generer | — |
| **V** | **Kirina (invul + impact + defaite)** | 24.2s | ✅ Valide 2026-04-13 | `actes/acte-v-final.mp4` |
| **VI** | **Empire + Charte** | 20.5s | ✅ Composition Remotion prete | `SoundjataCharte.tsx` + `charte/` |
| **VII** | **Legende vivante (griots)** | **13.2s** | ✅ **Termine 2026-04-14 APPROVE one-shot** | `out/acteVII-final/acte7-full-v1.mp4` + `SoundjataActeVII.tsx` |
| VIII | Close signature serie | 6.5s | A generer | Remotion + 2 images Gemini |

**Note cle** : `acte3-iron-bar-v1.mp4` (15s) joue un **double role** — debut couvre fin Acte II (rampant), milieu+fin couvre Acte III complet. Decouverte 2026-04-14.

**Restent** : 3 clips Seedance (I, IV, VII) + 2 images Gemini (VIII) + composition `SoundjataShort.tsx` assemblage.
**Budget estime pour finir** : ~$10 + 1 session bien organisee.

---

## STRUCTURE DOSSIER SOUNDJATA (normalisee 2026-04-14)

`public/assets/library/geoafrique/heros-oublies/soundjata/`
- `audio/` — narration-full + insult-dialogue
- `actes/` — renders Remotion finaux (acte-v-final.mp4 fait)
- `clips-validated/` — 4 clips Seedance retenus
- `clips-pending/` — 4 clips tests/alternatives/rejetes (historique)
- `refs/` — char sheets + env plates + storyboards valides + reference 9 panneaux
- `refs/archive/` — 5 storyboards rejetes (historique itérations)
- `charte/` — Acte VI assets (existant)
- `README.md` — documentation complete

Anciens dossiers eparpilles `/soundjata/combat-refs` et `/soundjata/combat-tests` contiennent des copies, a supprimer apres validation (voir README).

---

## PROCHAINE SESSION — TEST SYSTEME D'AGENTS

Aziz veut tester le pipeline d'agents (visual-producer, audio-director, etc.) sur un clip Seedance reel.

**Plan propose** :
- **Phase 1** : Test `visual-producer` sur Acte VII griots (simple, court, faible enjeu, scene contemplative differente du combat) — 45 min, ~$3-4
- **Phase 2 si OK** : Actes I + IV via agent — 1h30, ~$6-8
- **Phase 3** : Acte VIII Remotion + composition `SoundjataShort.tsx` assemblage final — 1-2h code

Agents deja prets a tester :
- `visual-producer` avec storyboard-to-video comme capacite principale integree
- 6 faiblesses + remedies documentees
- Regle 13 (9 panels pour action dense) + regle 14 (voxelplot minimal prompt ~200 mots) a valider sur le terrain

---

---

## CONTEXTE — Ce qui s'est passe ces 3 dernieres sessions

**Session 2026-04-07** : Tests de combat intensifs. Clip A Lat Dior Dekheule (9.5/10). Format 8 "Battle Ink" decouvert. 9 nouvelles regles Seedance (42-50). Workflow multi-ref Yaroflasher identifie.

**Session 2026-04-08** : Decision style principal : flat BD illustre. Vivid shapes = secondaire (thumbnails). 4 templates de prompts crees. Pipeline V2 Recraft+Gemini = semi-officiel pour usages statiques.

**Session 2026-04-09/10** : Session majeure de tests API Seedance 2.0. Objectif : automatiser la generation de clips via API au lieu de Dreamina web manuel. 7 tests realises sur 3 plateformes (Dreamina, fal.ai, Atlas Cloud). Conclusions :

1. **API Seedance 2.0 disponible sur fal.ai** — endpoint officiel, fonctionne, prouve par 3 generations reussies. Prix : $0.30/s (images), $0.18/s (video ref). Reference-to-video avec 3 images + prompt dialogue = meilleur resultat (8.5-9/10).

2. **Video Extend/Chaining** : biais "reverse" systematique sur objets tombes (baobab se releve 3/3 tests). First/Last frame = transitions visuelles, PAS storytelling. Chaining sequentiel fonctionne mieux avec prompt directif, mais les 0-3s initiales ont souvent des artefacts.

3. **Lip sync francais via API** : valide — "Je suis Soundjata! Fils de Sogolon!" parfaitement synchronise.

4. **Atlas Cloud** : teste, prix attractif ($0.10/s) mais l'API reference-to-video **ignore les images de reference** — genere du text-to-video deguise. Le playground Atlas ($0.216/s) fonctionne correctement mais prix = fal.ai. Pas d'avantage reel.

5. **Comparatif prix** : Volcengine officiel = $0.14/s (inaccessible, KYC chinois). fal.ai = $0.30/s (accessible, prouve). Dreamina web = ~$0.23/s (accessible, manuel). Atlas Cloud API = $0.10/s (refs ignorees, inutilisable pour nous).

6. **6 nouvelles regles Seedance** (58-63) documentees dans `memory/tools/seedance-rules.md`.

---

## DECISION STYLE PRINCIPAL (2026-04-08)

**Style principal GeoAfrique : Flat BD illustre semi-detaille**

Pourquoi : c'est le seul style qui combine (1) dynamisme suffisant pour Seedance, (2) esthetique unique non-generique, (3) adaptabilite tous formats (Shorts, long, news). Les styles ink-wash et vivid shapes sont des outils secondaires.

| Style | Role | Quand l'utiliser |
|---|---|---|
| **Flat BD illustre** (Gemini refs) | **PRINCIPAL** | Toutes les scenes narratives, combat, dialogue, voyage |
| **Ink-wash Battle** (Format 8) | Secondaire | Scenes de combat haute intensite specifiquement |
| **Vivid shapes** (Recraft) | Secondaire | Thumbnails, branding, illustrations statiques |

References du style principal : videos `Downloads/bataille.mp4` (Amanirenas vs Abou Bakari) et `Downloads/test keita.mp4` (Soundjata barre de fer).

---

## Serie "Heros Oublies" — 5 SCRIPTS PRETS

| # | Personnage | Script | Test Seedance | Audio |
|---|-----------|--------|---------------|-------|
| 1 | Nzinga (Angola) | Valide | Pas encore | En attente |
| 2 | Lat Dior (Senegal) | Valide | **Bataille 9.5/10** (ink-wash) + vivid 7.5/10 | En attente |
| 3 | Soundjata (Mali) | Valide | **9.5/10** (barre de fer) | En attente |
| 4 | Yaa Asantewaa (Ghana) | Valide | 8/10 (V2 best) | En attente |
| 5 | Hannibal (Carthage) | Valide | Pas encore | En attente |

**Blocker** : Credits ElevenLabs a recharger pour batch audio.

### Clips bataille Lat Dior (Dekheule) — UTILISABLES

| Clip | Score | Style | Statut |
|------|-------|-------|--------|
| Test 2 (POC) | 8/10 | Ink-wash | Archive — over the top |
| Test 3 (POC) | 8.5/10 | Ink-wash | Archive — meilleure vue aerienne |
| **Test 4 (Clip A PROD)** | **9.5/10** | Ink-wash | **UTILISABLE** — charge + combat + finale |
| Test 5 (Clip B PROD) | 8/10 | Ink-wash | Partiellement utilisable (shots 1-3 + 8-9) |
| Test vivid shapes | 7.5/10 | Vivid | Archive — trop statique |
| Test Pipeline V2 (Amanirenas) | 7/10 | Vivid | Archive — beau mais bobbleheads |

### Personnages historiquement corriges

Pourquoi : nos personnages avaient des vetements/accessoires modernes ou culturellement incorrects (couronne europeenne sur un roi wolof, couronne egyptienne sur une reine kushite). Recherche historique faite pour 3 personnages.

| Personnage | Correction | Refs generees |
|---|---|---|
| **Lat Dior** | Turban wolof (pas couronne), gris-gris, grand boubou brode 3 pieces, boucles d'oreilles tiedo | `tmp/yaroflasher-test/ref1-latdior-historical-sheet.png` |
| **Abou Bakari II** | Calotte royale malienne, boubou brode islamique volumineux, sceptre or | `tmp/historical-refs/abou-bakari-historical-sheet.png` |
| **Amanirenas** | Perruque kushite arrondie (pas couronne egyptienne), armure cuir, chale cramoisi, lance+bouclier | `tmp/historical-refs/amanirenas-historical-sheet.png` + `tmp/gemini-from-recraft/amanirenas-4views-gemini.png` |

---

## Regles Seedance — Total 69

Regles 1-41 : sessions precedentes (voir `memory/tools/seedance-rules.md`)
Regles 42-57 : sessions 2026-04-07/08
Regles 58-63 : session 2026-04-09 (API fal.ai, extend/chaining)
Regles 64-69 : session 2026-04-10 (tests production API, tagging, scenes calmes)

| Regle | Resume |
|-------|--------|
| 42 | Ethnicity/peau = specifier explicitement |
| 43 | Blessures = progression ou rien |
| 44 | Format hybride timecode+SHOT+VFX+SFX = valide combat |
| 45 | Ref plan large > close-up pour style ink-wash |
| 46 | Vue aerienne concentrique = signature batailles |
| 47 | Over the top = POC, pas production |
| 48 | "FALLS forward" + slow-mo = flottement aerien |
| 49 | Canons/objets lourds = arriere-plan seulement |
| 50 | Apres blessure mortelle = personnage SEUL |
| 51 | Vue aerienne leader = specifier position dans le V |
| 52 | Refs separees par element (methode Yaroflasher) |
| 53 | Collage close-up + full body / character sheet |
| 54 | "no words, no music" en fin de prompt |
| 55 | Limite prompt 1500 chars = Flashboard, probablement plus haute Dreamina |
| 56 | Duree generation = duree besoin, pas plus |
| 57 | Clip precedent comme ref video (Omni) |

---

## Pipeline principal (V1 — OFFICIEL)

```
1. Script valide Aziz
2. Audio ElevenLabs V3
3. ffprobe timings -> timing.ts
4b. Kimi DA brief
4c. Claude dynamisation (Format 3 SECONDS ou Format 8 pour combat)
4d. Gemini refs : character sheet + decor + secondaires (3-6 refs, methode Yaroflasher)
5. Seedance generation (Dreamina web, multi-ref) + "no words, no music"
6. Integration Remotion + mini-render
```

**Changement par rapport au pipeline precedent** : etape 4d passe de 1 ref (style anchor) a 3-6 refs (personnage + lieu + secondaires + armes + mood). Ajouter "no words, no music" en fin de prompt.

## Pipeline V2 "Recraft + Gemini" (SEMI-OFFICIEL)

Pour style vivid shapes uniquement (thumbnails, branding, illustrations statiques).

```
Recraft Style ID (1 fois) -> 1 image DNA visuel
Gemini + ref Recraft -> character sheets, decors, secondaires
```

Style IDs : Hannibal `22d1274f`, Amanirenas `d28c53cc`
Credits Recraft restants : 920

---

## Templates de prompts (NOUVEAU 2026-04-08)

Pourquoi : Claude oubliait les regles en milieu de session (diversite visages, ethnicity, etc.). Les templates integrent les regles critiques + techniques DA + checklist obligatoire dans un seul fichier par type de scene.

| Template | Fichier | Usage |
|---|---|---|
| Combat (Format 8) | `memory/templates/combat.md` | Batailles, charges, duels |
| Narratif (Format 3) | `memory/templates/narratif.md` | Discours, voyage, negociation |
| Montage (Format 7) | `memory/templates/montage.md` | Beat sync, sequences rapides |
| Exploration (Format 4) | `memory/templates/exploration.md` | Lieux, plan-sequence |

**Regle CLAUDE.md** : AVANT tout prompt Seedance/Gemini, LIRE le template -> UTILISER la structure -> COCHER la checklist -> PRESENTER. Zero exception.

---

## API Seedance 2.0 — Etat des lieux (2026-04-10)

### Providers testes

| Provider | Prix/s | Refs respectees | Automatisable | Verdict |
|----------|--------|----------------|---------------|---------|
| **fal.ai** | $0.30 | **OUI** | **OUI** | **Meilleur choix API** |
| Atlas Cloud API | $0.10 | NON (ignorees) | OUI | Inutilisable pour nous |
| Atlas Cloud playground | $0.216 | OUI | NON (manuel) | Meme prix que fal.ai |
| Dreamina web | ~$0.23 | OUI | NON (manuel) | Meilleur choix manuel |
| Volcengine officiel | $0.14 | OUI (presume) | OUI | Inaccessible (KYC chinois) |
| Replicate | $0.29 | Non teste | OUI | Alternative fal.ai |

### Cle API fal.ai : `FAL_KEY` dans `.env`
### Cle API Atlas Cloud : `apikey-926b207a14f44ded974d22e6398bb7e7` (dans dashboard atlascloud.ai, pas dans .env — ne pas utiliser l'API pour les refs, seulement le playground)

### Tests realises

| # | Mode | Plateforme | Cout | Score | Fichier |
|---|------|-----------|------|-------|---------|
| 1 | First/Last frame 15s | Dreamina | Credits | 3/10 | YouTube shorts |
| 2 | First/Last frame 10s | Dreamina | Credits | 5/10 | YouTube shorts |
| 3 | Reference-to-Video 10s (video ref) | fal.ai | ~$3.10 | 7.5/10 | Vercel Blob |
| 4 | **Multi-ref dialogue 10s (3 images)** | **fal.ai** | **~$3.02** | **8.5-9/10** | **Vercel Blob** |
| 5 | Text-to-video 5s | Atlas Cloud API | ~$0.50 | 4/10 | Vercel Blob |
| 6-7 | Multi-ref 10s (3 images) | Atlas Cloud API | ~$2.16 x2 | 5/10 | Downloads/ |
| 8 | **Multi-ref dialogue 10s (3 images)** | **Atlas Cloud playground** | **$2.16** | **8.5/10** | **Downloads/atlas test 3.mp4** |
| 9 | Chaining video ref (4s tail) | fal.ai | $0 (echec) | N/A | Content policy violation — video flag "real people" |
| 10 | **Multi-ref Lat Dior bataille (3 images)** | **fal.ai** | **~$3.02** | **8.5-9/10** | **Vercel Blob** |
| 11 | **Lip sync griot narration 10s** | **fal.ai** | **~$3.02** | **8.5/10** | **Vercel Blob** |
| 12 | Chaining image (last frame baobab) | fal.ai | ~$3.02 | 4/10 | Vercel Blob — Seedance rembobine au lieu de continuer |
| 13 | Chaining 2 refs (Gemini exil + styleref) | fal.ai | ~$3.02 | 5/10 | Vercel Blob — styleref animee en plein milieu |
| 14 | **1 ref Gemini seule (exil v2)** | **fal.ai** | **~$3.02** | **6/10** | **Vercel Blob — scene correcte mais statique** |

### Learnings tests 10-14 (10 avril soir)
- Multi-ref 3 images (character + decor + secondaires) via API = qualite comparable a Dreamina web
- Lip sync francais tient sur 10s de narration, mais Seedance re-synthetise l'audio (mot deforme). Workflow : strip audio + ElevenLabs overlay = parfait
- Foules : visages clones sans diversite explicite dans le prompt (regle 64)
- COLOR GRADE : changements de palette entre segments = transition abrupte (regle 65)
- Chaining via video ref bloque par filtre content policy fal.ai (regle 66)
- **1 ref Gemini par clip = la bonne approche pour l'API** (regle 67). Zero styleref separee.
- **Tagging d'images = ne fonctionne PAS**, ni via API ni sur Dreamina web (regle 69)
- **Scenes calmes = Seedance produit du quasi-statique** (regle 68). Action = bien, contemplation = faible.
- **Le biais reverse (regle 60) persiste** : tout objet au sol = Seedance le remet debout. Ne pas utiliser d'images avec objets tombes comme ref.

---

## Prochaines actions

**Quoi** : Produire le premier Short Heros Oublies complet (probablement Lat Dior ou Soundjata).
**Pourquoi** : On a les scripts, les tests visuels valides (9.5/10 bataille, 9.5/10 barre de fer), le style principal decide, et l'API Seedance 2.0 validee (fal.ai multi-ref + dialogue lip sync = 8.5-9/10).
**Comment** : Recharger credits ElevenLabs -> scan TTS -> generation audio -> Kimi DA -> Claude dynamisation -> Gemini refs multi-ref -> Seedance (fal.ai API ou Dreamina web) -> Remotion assemblage.
**Decision en attente** : fal.ai ($0.30/s, automatisable) vs Dreamina web (~$0.23/s, manuel). Pour un Short de 60s (6 clips x 10s) : fal.ai = ~$18, Dreamina = ~$14. La difference est ~$4 par Short.
**Chaining resolu** : pas de chaining inter-clips dans Seedance. Chaque clip = 1 ref Gemini independante. Assemblage dans Remotion. Le chaining par derniere frame ou video ref ne fonctionne pas (biais reverse + content policy + statique).

**Secondaire** : Regenerer les character sheets des 5 heros avec les corrections historiques dans le style flat BD illustre.

---

## Autres projets (status inchange)

**Abou Bakari** : Beats 01-09 completes. Reste musique Suno + render final.
**Thiaroye** : Clips 1-2 valides, clip 3 a refaire, clips 4-7 a ecrire.
**Peste 1347** : HookMaster v2 TERMINE. Corps S1-S6 a faire.

---

## Workspace

```
scripts/heros-oublies/     # 5 scripts serie + README
scripts/tools/             # 6 scripts Python reutilisables
tmp/lat-dior-battle/       # 4 refs Gemini ink-wash + 5 clips battle
tmp/yaroflasher-test/      # Refs character sheets historiques (Lat Dior)
tmp/historical-refs/       # Character sheets Abou Bakari + Amanirenas
tmp/gemini-from-recraft/   # Refs Pipeline V2
tmp/vivid-test-v2/         # Tests vivid shapes avec Style IDs
tmp/soundjata-frames/      # Frames extraites clip Soundjata (refs pour tests API)
out/                       # 2 renders finaux (abou-bakari, thiaroye)
public/assets/library/     # REFs canoniques + clips valides
memory/tools/              # Regles Seedance (63), Recraft, Gemini, ElevenLabs, Kling, Remotion
memory/templates/          # 4 templates prompts (combat, narratif, montage, exploration)
```

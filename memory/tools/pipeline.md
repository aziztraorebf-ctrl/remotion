# Pipeline Shorts GeoAfrique — Ordre INVIOLABLE
> ⚠️ **Daté 2026-05-02 — n'intègre PAS les workflows SVG/data-viz de juin 2026.**
> Pour data-viz : `memory/doctrines/WORKFLOW-DATAVIZ.md`. Pour SVG : `memory/doctrines/SVG-SCENES-GENERATIVES.md` et `SVG-MIDFORM-FORMAT.md`. Pour agents : `PRODUCTION-AGENTIQUE-REMOTION.md` / `PRODUCTION-AGENTIQUE-SVG.md`.
> Ne JAMAIS changer cet ordre. Zero clip avant timing.ts stable.
> Mise a jour : 2026-05-02

---

## UPLOAD MINI-RENDERS — Catbox.moe (Vercel hors service)

**Vercel Blob hors service depuis 2026-05 (indisponible).** Utiliser catbox.moe a la place.

```bash
curl -F 'reqtype=fileupload' -F 'fileToUpload=@out/chemin/fichier.mp4' 'https://catbox.moe/user/api.php'
# Retourne un lien public permanent type https://files.catbox.moe/HASH.mp4
# Aucun compte requis. Limite : 200 MB par fichier.
```

**Note** : 0x0.st desactive (spam bots IA, mai 2026). Ne plus utiliser.

---

## REGLE CRITIQUE (2026-04-14) — Duree clip >= Duree narration

**Contexte** : Soundjata Acte VII, gap 1.17s entre clip Seedance (12s) et narration (13.22s) a force une loop muette en Remotion + 1 mini-render rate. Entierement evitable au Visual Plan.

**Regle non-negociable pour tout Visual Plan** :

1. Avant de proposer `duration` Seedance : **mesurer la narration de l'Acte exactement** (`scene.end - scene.start` dans timing.ts, ou ffprobe)
2. **Arrondir a la seconde superieure** pour Seedance (paliers 1s, max 15s) :
   - Narration 13.22s → clip **14s**, PAS 12s
   - Narration 11.7s → clip 12s
3. Si narration > 15s : **splitter en 2 clips back-to-back**, JAMAIS combler par boucle muette
4. **Cross-check bloquant AVANT tout appel API** : `clip_seconds >= narration_seconds`. Sinon STOP et re-evaluer.

Section obligatoire dans tout Visual Plan :
```
Narration measured: X.XXs
Clip Seedance demande: Y.0s (Y >= ceil(X))
Cross-check: OK / NOT OK
```

Cout evite : 30+ min debug Remotion + mini-renders rates. Cout d'appliquer : +$0.30-0.60 (1-2s Seedance de plus).

---

---

## REGLE (2026-04-19) — Forced Alignment = outil standard post-ElevenLabs

**Contexte** : Sonjata Papercraft Scene 2 — dialogue Seedance (insulte Sassouma) necessite mute/unmute de la narration au centieme de seconde. Le forced alignment ElevenLabs donne les frontieres exactes de chaque MOT.

**Regle** : apres chaque generation ElevenLabs, lancer le forced alignment sur l'audio pour obtenir les timestamps mot-a-mot. Utiliser les frontieres de MOTS (pas de phrases) pour :
1. Mute/unmute narration quand un dialogue Seedance prend le relais
2. Synchro visuelle (caler un clip sur un mot precis)
3. Sous-titres karaoke mot-a-mot
4. Debug audio (localiser un mot mal prononce)

**Erreur a ne pas reproduire** : muter la narration sur la frontiere de PHRASE ("humiliait sa mere. Ton fils...") au lieu de la frontiere de MOT ("mere." finit a 20.82s, "Ton" commence a 21.72s). Le mute coupait "sa mere" en plein milieu.

---

## Ordre de production (NON-NEGOTIABLE)

```
0. CONCEPT ART — 1 image Gemini par beat majeur (NOUVEAU — 2026-05-03)
   - Avant l'audio, apres le script locked
   - 1 image 16:9 par beat : carte, ambiance, composition, cartouches vides
   - Modele : IMAGE_MODEL (Lite — un storyboard de validation n'est jamais publie ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur).
     ~0,034 $/image, ~5 images = ~0,17 $
   - But : valider la vision visuelle avec Aziz EN 5 MINUTES avant de coder quoi que ce soit
   - Template prompt : fond + territoire + sprites + cartouches vides + style Atlas
   - Validation Aziz OBLIGATOIRE avant de passer a l'etape 1
   Ref : /tmp/quebec-research/atlas-concept-*.png (exemple valide 2026-05-03)

1. Script definitif valide par Aziz
2. Generation audio ElevenLabs V3
3. Whisper -> mesure timings reels par segment
4. timing.ts stable et valide
4b. KIMI DA BRIEF — direction artistique (vision narrative, PAS prompts Seedance)
    Brief structure : contraintes generateur + nuance morale + frame chaining + script complet
    Output Kimi : arcs narratifs, objets-ponts, placement chromatique, ton par clip
    Max 3 iterations. Cout : ~$0.01-0.02/passe.
    Ref : exemple archivé (skill `batch-short-production` supprimé 2026-08-01, mort depuis mars — voir
    `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` pour le pipeline script actuel).
4b-bis. KIMI CONSULTATION STORYBOARD (OPTIONNEL mais recommande si bloque) :
    Quand le storyboard rate apres 2 iterations, envoyer a Kimi K2.5 :
    - Le storyboard actuel + les refs canons + le contexte narratif + les contraintes Seedance
    - Question : "Si TU etais le DA, quel storyboard proposerais-tu ?"
    - Kimi propose des angles camera et compositions que Claude ne pense pas toujours
    - Script : `scripts/tools/kimi-review-acte{N}-storyboard.py` (adaptable)
    - Cout : ~$0.02. Valide 2026-04-16 (Acte IV Clip 1, propositions galop lateral + OTS validees)
4c. CLAUDE DYNAMISATION — rewrite des prompts Seedance (NON-NEGOTIABLE)
    **SCRIPT** : `scripts/tools/dynamize-prompts.py kimi-brief.md [--model claude|gemini] [--clips 1,3]`
    Input : brief Kimi (vision narrative) + regles Seedance documentees
    Output : prompts Format 3 SECONDS prets pour Dreamina (fichier -dynamized.md)
    Regles obligatoires :
    - Format 3 SECONDS X TO Y (JAMAIS Scene 1 + Transition + Scene 2)
    - Verbes explosifs : SLAMS, SURGES, DROPS, SNAPS, SWEEPS (JAMAIS "stands", "holds", "slowly")
    - 3-4 mouvements camera VARIES par clip (aerial, snap zoom, dolly, sweep, pull back)
    - Micro-actions personnages dans CHAQUE segment (vent, poussiere, bras croises, tete qui tourne)
    - ZERO metaphore lumineuse ("beacon", "glow", "catches light" = halo magique)
    - Pas de changement d'echelle brutal (medium → close-up mains = morphing)
    - Anti-instructions obligatoires en en-tete
    NE JAMAIS donner les prompts Kimi directement a Seedance — ils sont contemplatifs, pas cinematiques.
4d. GEMINI REF STYLE — generer 1 image de reference par clip
    **SCRIPT** : `scripts/tools/generate-styleref.py [clip1 clip3]` (editer tableau CLIPS dans le script)
    Input : frame-03.jpg (style anchor) + description de la scene du clip
    Output : image 9:16 dans le style flat BD (tmp/styleref/clipN-styleref.png)
    Modele : IMAGE_MODEL (Lite — styleref = matiere pour Seedance, pas un livrable ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur)
    Pourquoi : sans ref image, Seedance default vers photoralisme meme avec "2D flat" dans le texte.
5. Generation clips Seedance (Dreamina web)
   - Uploader ref Gemini du clip comme image de reference
   - Coller prompt Claude (Format 3 SECONDS)
   - Duree : 15s
   - Frame chaining : `scripts/tools/extract-lastframe.sh clip_N.mp4` -> lastframe_clip_N.png
     (la ref Gemini sert pour le clip 1 ou si le style drift)
6. Integration Remotion + mini-render
```

Si le script change apres l'etape 1 -> recommencer depuis l'etape 2.
Si Kimi propose de restructurer les clips -> valider avec Aziz AVANT de regenerer.

### Pourquoi cette separation Kimi / Claude (decision 2026-04-05)

Teste sur Thiaroye clip 1-2 avec 5 generations :
- Prompts Kimi directs dans Seedance (tests 1-2) : 3-5/10. Statiques, orbite camera unique, photoralisme.
- Prompts Claude dynamises (tests 3-5) : 9-9.5/10. Dynamiques, multi-camera, style BD maintenu.

Kimi pense en termes de cinema contemplatif (plans-tableaux). Seedance brille avec l'action, les mouvements rapides, les emotions. Claude traduit la vision de Kimi en langage que Seedance comprend.

---

## Quel outil pour quel plan ?

| Plan | Outil | Format/Config |
|------|-------|---------------|
| Scene dynamique multi-actions | **Seedance + Format 3 SECONDS** | 80-120 cr, ref Gemini |
| **Sequence narrative multi-shots <15s (action + reaction, preparation + impact)** | **Seedance Storyboard-to-Video** | 4 refs : storyboard 5 panneaux N&B + 2 char refs + env plate. Voir `tools/seedance-storyboard-technique.md`. Valide 2026-04-13 Soundjata Acte V |
| Gros plan visage / emotion | Seedance (SECONDS, snap zoom) | 80-120 cr |
| Plan epique / armee / territoire | Recraft vivid_shapes -> Kling O3 | cfg 0.35 |
| Transition cinematique (dolly in) | Gemini start+end -> Kling O3 | cfg 0.4 |
| Carte / timeline / data | SVG Remotion spring() pur | -- |
| Flotte/foule massive | Seedance (SECONDS) | 80 cr |
| Dialogue lip sync | Seedance (Audio-Guided) | 80-120 cr |
| POV / transition perspective | Seedance (Storyboard-to-Video excelle aussi) | 80 cr |
| Multi-epoques meme personnage | Seedance Format 6 (slow-mo orbital) | 80-120 cr |
| Plan 4K / >15s | Kling | API fal.ai |

**Strategie hybride** : Seedance = action, close-ups, dialogues, POV, foules, narratif multi-shots <15s. Kling = plans larges 4K, start+end frame, API.

**Technique Storyboard-to-Video** (ajoute 2026-04-13) :
- Permet de produire 2-5 shots enchaines cohérents en un seul clip Seedance via storyboard Gemini
- Identite perso verrouillee entre shots, decors continus, transitions naturelles
- **Toujours** generer en `aspect_ratio` final (9:16 pour Shorts) — jamais 16:9 cropable
- **Char refs "context" > neutral-bg** : pour cette technique, generer les char refs avec fond de scene suggere (evite decor vide sur plans serres)
- **Transitions d'etat narratives** (aura qui meurt, perte de pouvoir) : renforcer la clause de transition dans le prompt (section VISUAL STATE TRANSITIONS), ne PAS s'en remettre au storyboard seul
- **Audio Seedance** : garder (`generate_audio: true`) et mixer a 30% sous narration (keep-and-duck), voir `feedback_seedance-keep-and-duck.md`

### Quel format Seedance pour quel usage ? (decision 2026-04-05)

| Usage | Format | Pourquoi |
|-------|--------|----------|
| **Scene d'action / dynamique** | **Format 3 SECONDS** | Multi-camera, verbes explosifs, controle temporel precis |
| Multi-epoques / transitions tenues | Format 6 (Scene + slow-mo) | La slow-mo orbital donne le temps de transformer vetements/decor |
| Exploration de lieu | Format 4 (plan-sequence) | Traversee fluide de 5-7 espaces en 15s |
| Poursuite / suivi | Format 5 (prose steadicam) | Controle continu de vitesse et direction |
| Scene simple / paysage | Format 1 (narratif) | Court, pas de surdecoupe |

**Format 3 = defaut pour GeoAfrique.** Format 6 uniquement pour transitions d'epoques/tenues.

---

## Musique & SFX (Phase 8 — VALIDE 2026-04-22)

**Minimax Music 2.6 via fal.ai** (`fal-ai/minimax-music/v2.6`) — validee sur Sonjata session 8.
- Payload : `{"prompt": str, "is_instrumental": True}` (voir `memory/tools/minimax.md`)
- Generer 2-3 pistes par Short, Aziz choisit (gallery Vercel pour review mobile)
- Volume musique : 0.15 dans Remotion (~-16.5dB, compatible regle -18dB)
- Fade-in 2s + fade-out 2s via `<Audio volume={frame => interpolate(...)}>`
- Option B validee : silence pendant hook, musique entre a scene 1 (contraste dramatique)
- Cout : $0.10/generation, ~$0.30 pour 3 variantes parallele
- SFX : ElevenLabs Sound Generation (`eleven_text_to_sound_v2`) pour effets courts <30s
- Certains sujets = PAS de musique (le silence est un choix de DA valide)

---

## Regles generales

- **NO TEXT dans frames source** : ZERO texte/chiffre dans toute image envoyee a Kling ou Seedance
- **Audio-first** : generer audio -> mesurer ffprobe -> coder
- **Mini-render apres chaque beat** : `npx remotion render --frames=START-END`
- **Contrat Visuel AVANT code** (toute scene >10s)
- **Seedance audio = TOUJOURS remplacer** : strip audio ffmpeg + overlay ElevenLabs dans Remotion

---

---

## Style Principal GeoAfrique (DECIDE 2026-04-08)

**Flat BD illustre semi-detaille** — le style des videos "bataille" (Amanirenas vs Abou Bakari) et "test keita" (Soundjata barre de fer).

Caracteristiques :
- Visages DETAILLES avec expressions (pas silhouettes)
- Peaux brunes visibles avec traits faciaux
- Decors RICHES (architecture, vegetation, sols textures)
- Contours nets style BD/comic
- Palette chaude africaine (ocre, or, bruns, bleus, cramoisi)
- Vetements textures avec motifs culturels
- Personnages secondaires COLORES et VARIES

Pourquoi : Seedance anime bien ce style (mouvement naturel, expressions, tissu, poussiere). Assez detaille pour etre dynamique, assez stylise pour ne pas etre generique. Adaptable Shorts + long + news quotidiennes.

Production : Gemini refs (character sheets + decors + secondaires) -> Seedance multi-ref (methode Yaroflasher).

**Vivid shapes** = style secondaire. Usage : thumbnails, illustrations statiques, identite visuelle, branding. Pas pour scenes animees (trop plat, Seedance n'extrapole pas).

---

## Pipeline V2 "Recraft + Gemini" (EN TEST — 2026-04-07)

Pipeline alternatif pour style vivid shapes. Pas encore officiel — a tester sur une scene complete.

```
1. Recraft Style ID (1 fois) -> 1-2 images DNA visuel (vivid_shapes + styleID)
2. Gemini + ref Recraft -> character sheet 4 vues (personnage principal historiquement correct)
3. Gemini + ref Recraft -> decor vide (lieu de la scene, sans personnages)
4. Gemini + ref Recraft -> personnages secondaires (avec diversite visages)
5. 3-5 refs -> Seedance (methode multi-ref Yaroflasher)
6. Prompt court (<1500 chars) + "no words, no music"
7. Generer 2-3 variantes, splice les meilleures
```

**Avantage** : Recraft = 1-2 credits pour le style. Gemini = quasi-gratuit pour toute la production.
**Style IDs** : Hannibal `22d1274f`, Amanirenas `d28c53cc`
**Prouve** : Gemini reproduit le style vivid shapes (character sheet + decor). Pas encore teste dans Seedance.

---

## API Seedance 2.0 fal.ai (NOUVEAU 2026-04-09)

### Endpoints disponibles

| Mode | Endpoint | Prix/s (720p) |
|------|----------|---------------|
| Text-to-Video | `bytedance/seedance-2.0/text-to-video` | $0.30 |
| Image-to-Video | `bytedance/seedance-2.0/image-to-video` | $0.30 |
| Image-to-Video Fast | `bytedance/seedance-2.0/fast/image-to-video` | $0.24 |
| **Reference-to-Video** | `bytedance/seedance-2.0/reference-to-video` | **$0.18** (avec video ref) |

- Image-to-Video supporte `end_image_url` (first/last frame)
- Reference-to-Video supporte 9 images + 3 videos + 3 audios
- **Limite** : duree combinee input video + output video <= 15s
- Audio genere inclus dans le prix (toggle `generate_audio`)
- Cle API : `FAL_KEY` dans `.env`

### Resultats tests (2026-04-09)

| Test | Mode | Resultat | Score |
|------|------|---------|-------|
| Dreamina first/last frame (15s) | Images | Arbre se releve, bizarre | 3/10 |
| Dreamina first/last frame (10s) | Images | Arbre se releve, fin OK | 5/10 |
| **API Reference-to-Video (10s)** | Video ref + prompt | **Arbre se releve 0-3s, reste bon** | **7.5/10** |

Learnings : le biais "reverse" sur objets tombes est un probleme du modele, pas du mode. Reference-to-Video avec prompt directif = meilleur mode pour le chaining. First/last frame = utile pour transitions visuelles, pas pour storytelling.

---

## Skill complet

(skill `batch-short-production` supprimé 2026-08-01 — mort depuis mars, jamais retouché depuis, son seul
test réel documenté comme "validation pipeline uniquement, pas production". Pipeline Shorts actuel :
`memory/tools/notebooklm-boucle-short.md` + `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md`.)

---

## Pattern Remotion-Pur (sans clips video)

> Valide 2026-04-13 sur Soundjata Acte VI (Charte du Manden, 20.5s).

**Quand utiliser :** acte narratif ou informatif (listes, chiffres, dates, documents, cartes) sans action physique de personnage. Look "document historique" ou "infographie premium" — pas de morphing, pas d'artefacts video.

### Pipeline 5 etapes

**1. Whisper API** — `scripts/tools/transcribe-openai.py` → JSON timestamps mot-a-mot. NE PAS utiliser Whisper local (10+ min sur Apple Silicon). API = 10s + ~$0.01 pour 2 min.

**2. timing.ts frame-precis** — Frontieres absolues par segment (pas `{start, duration}` cumulees — erreurs d'arrondi). Le `start` de la suivante = `end` de la precedente.

**3. Generation assets Gemini** — Checklist obligatoire dans chaque prompt :
- `"pure white background (#FFFFFF)"` (pour conversion PIL alpha transparente)
- `"No text, no letters, no numerals visible anywhere"`
- Style coherent serie (ex: "painted 2D illustration, graphic novel aesthetic, bold outlines")

**4. Retouche chirurgicale Gemini** — Si asset proche mais defaut : `"Take this image exactly as it is. Make ONE surgical change: [X]. DO NOT change anything else."` Ne PAS regenerer.

**5. Composition Remotion** — Structure : constantes → SUB_SCENES → composants → AbsoluteFill principal avec Audio + Sequences frame-precises.

### Anti-patterns

- Fond parchemin + carte geo dans le meme plan → deux langages visuels qui se concurrencent
- Carte d3-geo en overlay sur parchemin → bug viewport, frontieres debordent
- Timings relatifs (`{start, duration}`) → utiliser frontieres absolues

### Typographie reference (1080x1920)

| Element | Taille |
|---------|--------|
| Titre majuscule principal | 90-110px |
| Chiffre geant (stamp-in) | 280px |
| Sous-titre italique | 44-54px |
| Date / decoration | 40-44px |
| Label icone | 54-58px |
| Icone minimum | 260x260px |
| Medaillon minimum | 440x440px |

Police signature : Cormorant Garamond (serif calligraphique), fallback Palatino/Georgia.

# Session 2026-03-29 — Validation Pipeline Batch Short YouTube

> Ce fichier documente la session complete de validation du pipeline automatise
> Gemini storyboard → Kling I2V → ElevenLabs → Remotion.
> Objectif : servir de base pour creer un skill ou document de reference pour industrialiser la production.

---

## 1. Objectif de la session

Valider que la chaine complete de production d'un YouTube Short peut etre executee de maniere quasi-automatique par Claude Code, de l'ecriture du script au render final. Sujet choisi : Thiaroye 1944 (verdict historique du 27 mars 2026).

**Resultat : VALIDE avec reserves.** Le pipeline fonctionne bout-en-bout. Les reserves portent sur l'ordre des etapes (audio-first obligatoire) et le controle du mouvement (prompts trop statiques).

---

## 2. Pipeline execute (ordre chronologique reel — avec erreurs)

### Etape 1 : Storyboard Gemini 3x3 (AVANT l'audio — erreur)

**Script :** `/tmp/generate-thiaroye-storyboard.py`
**API :** Gemini 3.1-flash-image-preview (`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`)
**Methode :** `responseModalities: ["IMAGE", "TEXT"]` — 1 prompt = 1 image grille 3x3 (1024x1024) + 9 prompts video en texte

**Prompt structure :**
```
Role: expert storyboard artist for animated historical documentary
Subject: [description detaillee du sujet]
Style: sepia/gold/charcoal, 2D vivid flat illustration
Format: 3x3 grid, each cell = one scene for 9:16 vertical video

CRITICAL CONSTRAINT -- NO TEXT IN ANY FRAME (NON-NEGOTIABLE):
- ZERO text, numbers, dates, labels, stamps, titles visible
- All text elements will be inserted in post-production via Remotion
- [reimagination specifique pour chaque frame qui impliquerait du texte]

For each of the 9 frames:
[description narrative + indication camera + palette]

Additionally, output 9 video animation prompts (one per frame).
```

**Resultat :**
- V1 contenait du texte/dates → rejetee
- V2 generee avec contrainte NO TEXT renforcee → validee
- Extraction automatique des 9 frames via PIL crop (336x336 par cellule)

**Lecon :** Gemini genere du texte par defaut dans les images narratives. Il FAUT une section explicite "NO TEXT" avec reimagination de chaque frame potentiellement textuelle.

### Etape 2 : Generation clips Kling via fal.ai

**Script :** `scripts/generate-thiaroye-kling.py`
**API :** fal.ai (fal_client Python SDK)
**Endpoints utilises :**

| Modele | Endpoint fal.ai | Usage |
|--------|----------------|-------|
| V3 Pro | `fal-ai/kling-video/v3/pro/image-to-video` | Close-ups, textures, portraits (F1, F7, F9) |
| V3 Standard | `fal-ai/kling-video/v3/standard/image-to-video` | Plans larges atmospheriques (F2, F8) |
| O3 Standard | `fal-ai/kling-video/o3/standard/image-to-video` | Groupes, personnages multiples (F3, F4, F5, F6) |

**Parametres communs :**
```python
{
    "image_url": image_url,       # frame uploadee via fal_client.upload_file()
    "prompt": "...",              # description + camera + mouvement
    "negative_prompt": "text, writing, letters, numbers, dates, subtitles, captions, watermark, signature, title, label, stamp, typography, words, digits, calendar, timestamps, photorealistic, 3D render, CGI",
    "duration": "5",              # secondes (aussi "10" disponible)
    "aspect_ratio": "9:16",       # vertical Short
    "cfg_scale": 0.35-0.4         # adherence au prompt (0=libre, 1=strict)
}
```

**Workflow fal.ai :**
```python
# 1. Upload frame
url = fal_client.upload_file(str(frame_path))

# 2. Submit job (async)
handler = fal_client.submit(model_endpoint, arguments={...})
request_id = handler.request_id

# 3. Poll status
status = fal_client.status(model_endpoint, request_id, with_logs=False)
# type(status).__name__ in ("InQueue", "InProgress", "Completed", "Failed")

# 4. Get result when Completed
result = fal_client.result(model_endpoint, request_id)
video_url = result["video"]["url"]

# 5. Download
urllib.request.urlretrieve(video_url, output_path)
```

**Resultats :** 9/9 clips generes, 8/9 valides. F5 abandonnee (visages clones).

### Etape 3 : Corrections post-generation

**F1 — Cachet qui se leve :**
- Probleme : Kling a anime le cachet se levant (physiquement incorrect)
- Fix : regenere avec prompt "seal stays pressed, does NOT lift" + negative_prompt "seal lifting, wax separating"
- Puis crop ffmpeg `-ss 1.5` pour supprimer bordures blanches du crop grille
- Script : `/tmp/regen-frame01.py`

**F4 — Visages clones :**
- Probleme : grille Gemini 3x3 genere des visages identiques
- Fix : Gemini 3.1-flash-image-preview en mode editorial sur la frame
- Prompt : "Give each soldier a completely distinct face, different morphology, different age..."
- Puis renvoi a Kling de la frame diversifiee
- Script : `/tmp/gemini-diversify-f4.py` + `/tmp/regen-frame04-diverse.py`

**F5 — Abandonnee :**
- Remplacee par segment carte SVG Remotion pur (Senegal → Dakar → Camp Thiaroye + compteur 400 000)

### Etape 4 : Script voix-off (Cesar formula)

**Methode :** Aziz fournit un brief sujet + une analyse detaillee (extrait newsletter). Claude ecrit le script selon la formule Cesar Short comprimee (7 beats : immersion → rupture → chiffre → indignation → bascule → antithese → close).

**Nuance narrative cle :** "La France n'a pas ete condamnee pour le massacre. Elle a ete condamnee pour avoir cache les documents." — Cette distinction juridique est le coeur du script.

**Script final (extrait) :**
```
Dakar. Decembre 1944.
[pause]
La guerre est finie.
Ces hommes ont traverse l'EUROPE pour liberer la France.
[pause]
Et ils attendent leur solde.
...
La France n'a pas ete condamnee pour le massacre.
Elle a ete condamnee pour avoir [drawn out] cache les documents.
...
Ils ont libere un continent qui les a oublies.
[long pause]
L'Afrique a une histoire qu'on t'a cachee -- et une actualite qu'on te simplifie.
Le lien en bio.
```

### Etape 5 : Generation audio ElevenLabs

**Script :** `/tmp/generate-thiaroye-audio-v6.py`
**API :** ElevenLabs V3 (`https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}`)
**Voix :** Narratrice GeoAfrique V3 `Y8XqpS6sj6cx5cCTLp8a`

**Parametres optimaux pour documentaire :**
```python
{
    "text": script,
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.25,      # bas = plus expressif
        "similarity_boost": 0.75,
        "style": 0.40,          # engagement emotionnel
        "speed": 0.88           # lent = gravitas documentaire (+40% duree script)
    }
}
```

**Tags ElevenLabs V3 :**
- `[pause]` — pause courte (~0.5s)
- `[long pause]` — pause longue (~1.5s)
- `[drawn out]` — syllabe etiree (emphasis)
- MAJUSCULES — emphasis naturelle ("EUROPE", "MILLE")

**Iterations :**
- v1 a v5 : ajustements texte, expressivite, tentatives de cut ffmpeg
- v6 : version finale sans "Et toi tu savais ca ?" (regenere plutot que coupe — les cuts ffmpeg sub-seconde sont trop imprecis)

**Resultat :** 110s, 44100 Hz. Qualite validee par Aziz.

### Etape 6 : Assemblage Remotion

**Composant :** `src/projects/geoafrique-shorts/ThiaroyeShort.tsx`
**Composition :** 1080x1920, 30fps, 3302 frames (110s)

**Architecture :**
```tsx
<AbsoluteFill>
  <Audio src={staticFile(AUDIO_PATH)} />

  {/* 9 Sequences, une par segment narratif */}
  <Sequence from={0} durationInFrames={360}>
    <ClipSegment clipFile="frame-01-final.mp4" playbackRate={0.29} ... />
    <TextOverlay text="Dakar, 1944" />
  </Sequence>

  {/* ... segments 2-4 : clips Kling */}

  <Sequence from={1380} durationInFrames={360}>
    <MapSegment />  {/* SVG topojson + d3-geo, compteur anime */}
  </Sequence>

  {/* ... segments 6-9 : clips Kling */}

  <div style={vignetteStyle} />  {/* vignette cinematique globale */}
</AbsoluteFill>
```

**Pattern clip en slow-motion :**
```tsx
<OffthreadVideo
  src={staticFile(`${CLIPS_DIR}/${clipFile}`)}
  playbackRate={playbackRate}  // 0.29 a 0.50
  muted
  style={{ width: "100%", height: "100%", objectFit: "cover",
           transform: `scale(${scale})` }}  // slow zoom in/out
/>
```

**Carte SVG (segment F5) :** topojson `countries-50m.json` + d3-geo projection Mercator centree Afrique Ouest. Zoom anime vers Senegal, marqueur pulsant Dakar, compteur anime 0 → 400 000.

**Render complet :** `out/thiaroye-short-full.mp4` — 59 MB, 110s.

---

## 3. Test mouvement dynamique (fin de session)

**Constat :** Tous les clips originaux utilisaient "atmospheric movement only" dans les prompts → mouvement quasi-nul. Kling n'a PAS de parametre "motion intensity" — le mouvement se controle UNIQUEMENT par le prompt.

**Test A/B sur frame-04-diverse.jpg :**

| Version | Prompt keywords | Duree | Modele |
|---------|----------------|-------|--------|
| Original | "atmospheric movement only, slow blink, subtle" | 5s | O3 Std |
| Dynamic-A | "TURNS head sharply, CLENCH, wind WHIPS, dust SWIRLS, handheld camera" | 10s | V3 Pro |
| Dynamic-B | "PUSHES forward, BREATHE heavily, FLUTTERS aggressively, NOT slow NOT gentle" | 10s | V3 Pro |

**Script test :** `/tmp/kling-dynamic-test.py`
**Gallery comparaison :** uploadee sur Vercel Blob pour review mobile.

---

## 4. Pipeline optimal (corrige)

L'ordre correct pour la production future :

```
1. SCRIPT    — Cesar formula (youtube-scriptwriting skill)
             — Brief sujet + analyse → Claude ecrit

2. AUDIO     — ElevenLabs V3
             — Voix: Y8XqpS6sj6cx5cCTLp8a (Narratrice GeoAfrique V3)
             — Params: stability 0.25, style 0.40, speed 0.88

3. TIMING    — ffprobe → timestamps exacts par beat narratif
             — Determiner duree de chaque segment en secondes

4. STORYBOARD — Gemini 3.1-flash-image-preview grille 3x3
              — 1 frame par beat, NO TEXT obligatoire
              — Inclure duree cible dans le prompt video

5. CLIPS     — Kling via fal.ai (V3 Pro / V3 Std / O3 Std)
             — duration = duree du beat (5 ou 10s)
             — Prompts DYNAMIQUES (verbes action, camera cues)
             — cfg_scale 0.5 pour adherence au mouvement demande

6. CORRECTIONS — Gemini editorial si visages clones ou artefacts
               — Regeneration ciblée (pas tout refaire)

7. ASSEMBLAGE — Remotion (OffthreadVideo, playbackRate ~0.8-1.0)
              — Textes overlays en post-prod
              — Carte SVG si segment geographique
              — Vignette cinematique, slow zoom in/out

8. REVIEW    — Upload Vercel Blob pour review mobile
             — Aziz valide → musique Suno → render final
```

---

## 5. Erreurs commises et corrections

| Erreur | Impact | Correction |
|--------|--------|------------|
| Clips generes AVANT audio | Durees non calees, slow-motion force (0.29-0.50x) | Audio-first obligatoire |
| "Atmospheric movement only" dans tous les prompts | Clips quasi-statiques, pas cinematiques | Verbes d'action, camera cues, "NOT slow NOT gentle" |
| Clips tous en 5s | Segments narratifs de 10-20s → ralentissement excessif | Utiliser `duration: "10"` quand le beat > 7s |
| Tentative de cut ffmpeg sub-seconde | 5 tentatives echouees pour couper "Et toi tu savais ca?" | Regenerer l'audio sans la phrase = plus simple et fiable |
| Gemini model name incorrect | `gemini-2.0-flash-exp` → 404 | Utiliser `gemini-3.1-flash-image-preview` pour l'edition image |
| Texte/chiffres dans storyboard v1 | Kling anime le texte → artefacts | NO TEXT dans prompt Gemini + negative_prompt Kling |
| Grille 3x3 → visages clones sur F5 | Scene inutilisable | Prevoir 1-2 remplacements Remotion pur |
| argparse bug dans upload-to-blob.py | Premier fichier mange en mode --gallery | Corrige : un seul `files` nargs="*" au lieu de `file` + `files` |

---

## 6. APIs et endpoints utilises

| Service | Endpoint | Cle env | Usage |
|---------|----------|---------|-------|
| Gemini | `generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent` | `GEMINI_API_KEY` | Storyboard 3x3, edition faces |
| Kling V3 Pro | `fal-ai/kling-video/v3/pro/image-to-video` | `FAL_KEY` | Close-ups, portraits |
| Kling V3 Std | `fal-ai/kling-video/v3/standard/image-to-video` | `FAL_KEY` | Plans larges |
| Kling O3 Std | `fal-ai/kling-video/o3/standard/image-to-video` | `FAL_KEY` | Groupes |
| ElevenLabs V3 | `api.elevenlabs.io/v1/text-to-speech/{voice_id}` | `ELEVENLABS_API_KEY` | Voix-off |
| Vercel Blob | `blob.vercel-storage.com` | `BLOB_READ_WRITE_TOKEN` | Upload review mobile |

---

## 7. Fichiers produits (reference)

### Scripts (temporaires, a formaliser)
- `/tmp/generate-thiaroye-storyboard.py` — Gemini storyboard 3x3
- `scripts/generate-thiaroye-kling.py` — 9 clips Kling paralleles
- `/tmp/regen-frame01.py` — Regeneration F1
- `/tmp/gemini-diversify-f4.py` — Diversification visages Gemini
- `/tmp/regen-frame04-diverse.py` — Kling sur frame diversifiee
- `/tmp/generate-thiaroye-audio-v6.py` — Audio ElevenLabs final
- `/tmp/kling-dynamic-test.py` — Test mouvement dynamique

### Assets (permanents)
- `public/assets/library/geoafrique/thiaroye-1944/thiaroye-storyboard-grid-v2.jpg`
- `public/assets/library/geoafrique/thiaroye-1944/frames/frame-01.jpg` a `frame-09.jpg`
- `public/assets/library/geoafrique/thiaroye-1944/clips/frame-01-final.mp4` (et tous les clips)
- `public/assets/library/geoafrique/thiaroye-1944/clips/dynamic-A.mp4`, `dynamic-B.mp4`
- `public/assets/library/geoafrique/thiaroye-1944/thiaroye-voixoff-v6.mp3`

### Composant Remotion
- `src/projects/geoafrique-shorts/ThiaroyeShort.tsx`
- Composition : `ThiaroyeShort` (1080x1920, 30fps, 3302 frames)

### Render
- `out/thiaroye-short-full.mp4` (59 MB, 110s)

---

## 8. Ce qui manque pour industrialiser

1. **Script unifie** — Un seul script Python qui enchaine les 7 etapes (ou au minimum les etapes 4-5-6-7 apres validation audio par Aziz)
2. **Prompt templates** — Bibliotheque de prompts Kling par type de plan (close-up dynamique, plan large atmospherique, groupe en mouvement, portrait emotionnel)
3. **Timing automatique** — Parser la sortie ffprobe + Whisper pour decouper l'audio en beats automatiquement
4. **Quality gate** — Review automatique des clips generes (Kimi ou Claude vision) avant assemblage
5. **Musique** — Integration Suno pour la musique de fond (non fait cette session)
6. **Duration matching** — Algorithme pour choisir `duration: "5"` vs `"10"` en fonction de la duree du beat
7. **Retry logic** — Regeneration automatique des clips echoues ou sous-qualite

---

## 9. Verdict

Le pipeline est **fonctionnel et quasi-automatisable**. Une session de ~3h a produit un Short de 110s avec 8 clips Kling + 1 segment SVG + voix-off professionnelle + assemblage Remotion. Les interventions manuelles d'Aziz se limitent a :
- Validation du script
- Validation de l'audio
- Review des clips (accepter/rejeter/corriger)
- Feedback sur le render final

Tout le reste (generation storyboard, extraction frames, upload fal.ai, soumission jobs, polling, download, generation audio, assemblage Remotion, upload review) est automatise par Claude Code.

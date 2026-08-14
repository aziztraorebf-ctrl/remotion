# MiniMax Music + TTS + Voice Clone

> Fichier scindé depuis `minimax.md` le 2026-08-13. Sommaire général : `minimax.md`. Domaine complètement séparé de H3 (vidéo) — voir `minimax-h3-*.md` pour tout ce qui est image-to-video.
> Endpoint musique : `fal-ai/minimax-music/v2.6`. Endpoint TTS : `fal-ai/minimax/speech-2.8-hd`.

## Minimax TTS — speech-2.8-hd (validé 2026-05-24)

```python
import fal_client, os
os.environ['FAL_KEY'] = '...'

result = fal_client.subscribe(
    'fal-ai/minimax/speech-2.8-hd',
    arguments={
        'text': 'Votre texte ici',
        'voice_id': 'French_Calm_Woman',  # voix FR neutre validée
        'speed': 1.0,
        'emotion': 'neutral'
    },
    with_logs=True
)
# result['audio']['url'] → MP3 téléchargeable
```

**Voix FR disponibles** : `French_Calm_Woman` (neutre, posée)
**Durée** : ~35s pour un script de 26s lu (débit naturel légèrement plus lent qu'ElevenLabs)
**Gotcha** : ne pas mettre de tags `[solemn]` etc. — Minimax TTS ne les interprète pas comme ElevenLabs

## Minimax Voice Clone — fal-ai/minimax/voice-clone

```python
result = fal_client.subscribe(
    'fal-ai/minimax/voice-clone',
    arguments={
        'audio_url': 'https://files.catbox.moe/ienj91.mp3',  # sample 30s narratrice
        'text': SCRIPT,
        'speed': 1.0
    }
)
# result['custom_voice_id'] → réutilisable pour appels suivants
# result['audio']['url'] → MP3 final
```

**Voix GéoAfrique clonée** :
- Sample source : `https://files.catbox.moe/ienj91.mp3` (30s depuis narration-v1-clean.mp3, offset 5s)
- custom_voice_id : `Voicebbc56c501780172741` (généré 2026-05-24 — peut expirer, recloner si besoin)
- Résultat validé accroche Sénégal Beat0

---

## Endpoint et payload

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax-music/v2.6",
    arguments={
        "prompt": "Traditional Mande griot music from Mali, 13th century...",
        "is_instrumental": True,
    },
    with_logs=True,
)
```

**Parametres actifs** :
- `prompt` (string, 10-2000 chars) — description style/mood/genre
- `is_instrumental` (bool) — **TRUE pour musique de fond sans voix**
- `lyrics` (optionnel, 3500 chars max) — paroles avec tags `[Intro] [Verse] [Chorus]`
- `lyrics_optimizer` (optionnel, bool) — auto-generate paroles
- `audio_setting` (optionnel, objet) — format / bitrate

**Schema name** : `TextToMusic26Request`

---

## Gotchas critiques (validation 2026-04-22)

### 1. Bug historique `reference_audio_url`
L'endpoint `fal-ai/minimax-music` (sans version, ou v1.5) attend `reference_audio_url`. String vide = 422 au fetch. Jobs marques "COMPLETED" sans resultat telechargeable.
**Solution** : TOUJOURS utiliser `v2.6` explicite. Le champ `reference_audio_url` n'existe pas dans v2.6.

### 2. Conflit prompt "instrumental" + `is_instrumental`
NE PAS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` est deja passe. Cause validation 422 (observe 2026-04-22 sonjata).

### 3. `duration_seconds` ignore
Le modele genere la duree qu'il veut (typiquement 2-9 minutes). Pas de controle direct.
**Solution** : trim avec ffmpeg `-t N` apres generation, ou laisser Remotion tronquer via `<Sequence durationInFrames>`.

---

## FORMULE PROMPT VALIDEE (validee 2026-04-12 + reconfirmee 2026-04-22)

Les prompts generiques produisent une sortie ELECTRONIQUE non-africaine. Le modele empile des synthes par defaut. Appliquer SYSTEMATIQUEMENT :

1. **Artiste specifique nomme** — ex: "Style of Toumani Diabate" pour kora Mande
2. **1-2 instruments principaux** — PAS 5 instruments empiles
3. **Rythme precis** — "gentle 6/8 rhythm", BPM explicite
4. **Texture organique** — "warm, acoustic, organic"
5. **Interdictions directes** — "No synthesizers, no electronic sounds" **OBLIGATOIRE**
6. **Origine culturelle precise** — "Traditional Mande griot music from Mali", PAS "West African"

### Prompts valides — Sénégal Pétrole & Gaz (2026-05-22)

Ton : documentaire analytique moderne, souveraineté africaine, tension géopolitique. PAS Mande médiéval.

**A — Ambient Souverain** (Ballaké Sissoko, kora + basse ambient, 72 BPM, 321s générée)
```
Modern African documentary score. Sparse kora melody over slow, deep ambient bass.
Style of Ballake Sissoko. Slow 4/4 rhythm, 72 BPM.
Warm, minimal, dignified, introspective. Tension underneath.
No synthesizers, no electronic beats, no orchestral strings, no chorus.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`

**B — Kora + Percussions** (Toumani Diabate doc score, 68 BPM, 184s générée)
```
Contemporary African score blending traditional kora with slow deep percussion.
Style of Toumani Diabate meets a documentary film score.
Deep dundun bass rhythm at 68 BPM. Kora melody on top, meditative.
Sparse, serious, organic. No synthesizers, no hi-hats, no electronic elements.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3`

**C — Sabar Cinématique** (Youssou N'Dour film score, 75 BPM, 258s générée)
```
Slow cinematic Afrobeat documentary score from Senegal.
Sabar drum pattern at 75 BPM, acoustic bass, sparse guitar melody.
Style of Youssou N'Dour film score. Dignified, modern, grounded.
No synthesizers, no electronic elements, no vocals, no upbeat energy.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3`

Script dédié : `scripts/tools/minimax-senegal-music.py` — réutiliser comme template pour chaque nouvel épisode (changer `OUT_DIR` + `VARIANTS`).

---

### Prompts valides (Sonjata session 8, 2026-04-22)

**A — Griot intime (retenu)** — Toumani Diabate, solo kora + balafon
```
Traditional Mande griot music from Mali, 13th century empire era.
Solo kora with slow balafon accents. Style of Toumani Diabate.
Gentle 6/8 rhythm, acoustic, warm, organic, meditative.
No synthesizers, no electronic sounds, no drums except soft dundun.
```
Duree generee : 157s. Valide par Aziz : "rythmes contemplatif + percussions, mix parfait".

**B — Griot royal** — Sidiki Diabate, kora + djembe + dundun
```
Traditional Mande griot music from Mali. Solo kora with deep balafon
melody, joined by acoustic djembe and dundun drums in slow 6/8 rhythm.
Style of Sidiki Diabate. Building from contemplative to majestic.
Warm, acoustic, organic, royal. No synthesizers, no electronic sounds,
no orchestral strings.
```
Duree : 168s.

**C — Griot guerrier** — Neba Solo, djembe + dundun + balafon
```
Traditional Mande warrior music from Mali, 13th century. Acoustic
djembe and dundun drums in powerful 6/8 rhythm, joined by balafon
melody. Style of Neba Solo. Tense, earthy, tribal, triumphant.
No synthesizers, no electronic sounds, no modern instruments.
```
Duree : 520s (8:40) — imprevu, mais utile pour versions longues.

---

## ANTI-PATTERN (rejete, a ne PAS reproduire)

```
Epic West African orchestral, kora melody, djembe and dunun percussion,
balafon accents, majestic warm tones, building intensity from contemplative
to triumphant, cinematic, 95 BPM
```

**Pourquoi ca echoue** :
- "West African" trop generique (vs "Mande from Mali")
- 4+ instruments empiles (vs 1-2 nommes)
- Pas d'artiste de reference (Gemini improvise)
- Mots dangereux : "orchestral", "cinematic" poussent vers les synthes
- Pas d'interdiction "no synths"

Resultat observe 2026-04-22 : "accents electroniques tres pousses, pas africain ancien" (rejete par Aziz).

---

## Workflow production

### 3 variantes parallele (~$0.30, ~6min) — recette de reference
```bash
python3 scripts/tools/_archive/minimax-music-3variants.py
```
Genere A/B/C simultanees, telecharge, probe duree. (Script archive le 2026-06-19 :
recette one-shot par episode. Pour un nouvel episode, mieux vaut un `minimax-music.py`
parametrable plutot que dupliquer.) Upload en gallery Vercel :
```bash
python3 scripts/tools/upload-to-blob.py --gallery "Title" \
  sonjata-papercraft/audio/music/v2-A-*.mp3 ... \
  --folder sonjata-papercraft/music-review
```

### Temps d'attente typiques
- Submit : <1s
- Job complete : 2-4 minutes par job (Minimax est lent)
- Download : <5s
- Total 3 variantes parallele : ~6 minutes

---

## Cout et limites

- **$0.10 par generation** (estimation fal.ai)
- Max 1 appel a la fois recommande (pas de rate limit observe mais parallelisable)
- 3 variantes simultanees = $0.30, suffit pour comparaison A/B/C

---

## Mix audio (regle projet)

- **Volume musique** : 0.15 dans Remotion (= ~-16.5dB) — compatible regle "-18dB sous narration"
- **Fade-in** : 2s (60 frames @30fps)
- **Fade-out** : 2s avant fin composition
- Utiliser `<Audio volume={frame => ...}>` avec `interpolate` clamped

Voir src/projects/geoafrique-shorts/SonjataShortFull.tsx pour l'implementation reference.

### Mix ffmpeg POST-render (mid-form long, doc "sérieux") — 2026-07-21 (Soudan)
Quand la musique est mixée en ffmpeg SUR l'assemblage (pas via `<Audio>` Remotion), cas d'un mid-form long :
- **Niveau musique sous-narration** : cible **-12/-15 dB sous la voix** (docs "sérieux" Arte/BBC vont -18/-20).
  En volume ffmpeg linéaire ≈ **0.06-0.09** (choisi Soudan : 0.08 ; →0.06 si trop fort). Plus bas que le 0.15
  Remotion ci-dessus, cohérent (cas mix externe, voix reine).
- **Dompter les basses de la musique** : `bass=g=-7:f=200:w=0.6` — les graves masquent la voix davantage que les
  aigus, donc une kora/dundun riche en basse doit être atténuée dans le grave (garde la présence sans enterrer).
- **Boucle organique** (musique courte < vidéo) : crossfade triangulaire entre répétitions,
  `acrossfade=d=3:c1=tri:c2=tri` en chaîne (N copies), + fade-in 2s/out 3s. Zéro raccord audible.
- **amix** : `amix=inputs=N:duration=first:normalize=0` (normalize=0 sinon baisse tout). Vérifier `max_volume < 0 dB` après (pas de clipping).
- Scripts de référence : `scripts/tools/soudan-audio/` (minimax-music, sfx, mix).
- ⚠️ Prompt musique : les prompts "thriller/synth geopolitical" (ex. suggestion Gemini) produisent de l'électronique
  hors-charte Kora et Cartes → TOUJOURS revenir à la formule kora/percussion validée ci-dessus (rejet daté Soudan 2026-07-21).

---

## References

- Doc Context7 fal.ai : `/websites/fal_ai_models` query "minimax-music v2.6"
- Clip reference validation : `sonjata-papercraft/audio/music/v2-A-griot-intime.mp3`
- Integration Remotion : src/projects/geoafrique-shorts/SonjataShortFull.tsx
- Script 3 variantes (archive) : `scripts/tools/_archive/minimax-music-3variants.py`

---

# Minimax Speech 2.8 HD + Voice Clone — Guide TTS

> Validé 2026-05-19 (test session R&D sur voix GeoAfrique).
> Endpoints actifs : `fal-ai/minimax/voice-clone` + `fal-ai/minimax/speech-2.8-hd`
> **Verdict Aziz** : "Très bon, plus de punch que ElevenLabs sur certains passages. Ne remplace pas ElevenLabs, mais s'ajoute au stack."

## Quand utiliser Minimax TTS (vs ElevenLabs)

- **Comparaison A/B narration** : générer 1 version ElevenLabs + 2 versions Minimax (presets différents) pour le même script. Aziz choisit à l'oreille.
- **Narrations longues budget-sensible** : Minimax = $0.10 / 1000 chars vs ElevenLabs ~$0.30. Pour un script Atlas 8-15min (~10k chars), économie réelle.
- **Voix avec punch / énergie** : Aziz a noté que Minimax neutral/happy ont plus de "beats" qu'ElevenLabs équivalent.

## Workflow voice clone (one-shot)

```python
import fal_client

# 1. Upload privé (PAS catbox — narration interne projet)
audio_url = fal_client.upload_file("/path/to/sample-25s.mp3")

# 2. Clone
result = fal_client.subscribe(
    "fal-ai/minimax/voice-clone",
    arguments={
        "audio_url": audio_url,
        "noise_reduction": True,
        "need_volume_normalization": True,
        "model": "speech-02-hd",  # ← OK, le voice_id fonctionne aussi sur 2.8 HD
    },
)
custom_voice_id = result["custom_voice_id"]
```

**Specs sample source** :
- Durée : 20-30s suffit (≥10s requis). Trim ffmpeg depuis le milieu d'une narration propre.
- Mono 44.1kHz MP3 192kbps validé. WAV OK aussi.
- **Zéro musique, zéro SFX dans le sample** — voix seule.

**Coût** : $1.50 par clonage.

**Persistance** : voice_id expire après **7 jours sans usage TTS**. Pour pin : 1 appel TTS hebdo minimum, ou re-cloner.

## Workflow TTS (Speech 2.8 HD avec voix clonée)

```python
result = fal_client.subscribe(
    "fal-ai/minimax/speech-2.8-hd",
    arguments={
        "text": TEXT,
        "voice_setting": {
            "voice_id": custom_voice_id,
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0,
            "emotion": "neutral",  # voir presets validés ci-dessous
        },
        "audio_setting": {
            "sample_rate": 44100,   # INT, pas string
            "bitrate": 256000,      # INT, pas string
            "format": "mp3",
            "channel": 1,           # INT
        },
        "language_boost": "French",
        "output_format": "url",
    },
)
url = result["audio"]["url"]
```

**Coût** : $0.10 / 1000 chars (~$0.13 pour une narration 1m30, ~$1 pour 10min Atlas).

## Presets emotion validés (Aziz 2026-05-19)

7 valeurs enum : `neutral, happy, sad, angry, fearful, disgusted, surprised`.
**Aziz préfère** : `neutral` et `happy` (les deux ont le plus de naturel + punch sur narration GeoAfrique). Workflow projet : générer ces 2 + une version ElevenLabs pour A/B.

## Markers texte — GOTCHA CRITIQUE (validé 2026-05-19)

**Seuls 2 markers fonctionnent réellement** sur voix française :
- `<#0.X#>` (pauses en secondes) — ✅ marche parfaitement
- `(sighs)` — ✅ produit un soupir audible (sonne plus comme une respiration/arrêt qu'un vrai soupir, mais exploitable)

**Markers PARASITES (prononcés comme du texte, à ÉVITER)** :
- `(laughs)` → la voix dit "rire" littéralement
- `(clears throat)` → la voix dit les mots
- `(gasps)` → idem
- `(coughs)` `(sniffs)` `(groans)` `(yawns)` → probablement idem (non testés en FR)

**Hypothèse confirmée** : la voix s'**adapte automatiquement** à la sémantique du texte. Sur narration "soixante mille esclaves vêtus de soie persane", `neutral` ralentit et adoucit le ton sans qu'on demande. Sur la chute "ce sont les idées qui restent", il y a un poids naturel. **Donc règle production : texte propre + 2-3 pauses dramatiques bien placées, rien d'autre.**

## Pricing récap

| Action | Coût |
|---|---|
| Voice clone (one-shot, voice_id réutilisable 7j) | $1.50 |
| TTS (1000 chars) | $0.10 |
| Narration 1m30 (≈1200 chars) | ~$0.12 |
| Narration 10min Atlas (≈10k chars) | ~$1.00 |

## Limites vs ElevenLabs V3

- ❌ Pas de mix d'émotions inline (1 emotion par appel uniquement)
- ❌ Pas de markers contextuels riches (`[whispers]`, `[excited]`)
- ❌ Pour multi-émotions : générer en plusieurs appels et concat ffmpeg
- ✅ Auto-adaptation sémantique très bonne (compense partiellement le manque de markers)
- ✅ Pricing 3x moins cher
- ✅ Voice clone $1.50 one-shot vs ElevenLabs professional voice clone plus complexe

## Schema gotchas

- `audio_setting` : tous les nombres en **INT**, pas strings. `"32000"` → fail 422. `32000` → OK.
- `voice_setting.voice_id` accepte presets Minimax (`Wise_Woman` etc.) OU `custom_voice_id` retourné par voice-clone.
- `language_boost: "French"` — required pour qualité optimale FR (sinon prosodie EN par défaut).

## Sample R&D session (2026-05-19)

- Sample source : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3` trim 15-40s mono 44.1kHz
- Voice cloné : `Voiced5bd2f9e1779163839` (expire ~2026-05-26 sans usage)
- Renders test : `out/_r-and-d/minimax-voice-clone-test/`
  - `clean_neutral.mp3` (74s) — référence narration pure
  - `clean_happy.mp3` (78s) — alternative validée Aziz
  - `long_*` — avec markers parasites (mauvais exemple à ne pas reproduire)
- Coût total session test : **~$2.50** (clone + 12 TTS variantes)

## Workflow recommandé pour future production

1. **Re-cloner** la voix GeoAfrique au début de chaque épisode (sample fresh depuis dernière narration ElevenLabs validée) — $1.50
2. **Générer 3 versions du même script** : `ElevenLabs (référence)` + `Minimax neutral` + `Minimax happy`
3. **A/B aveugle** par Aziz, choix de la voix par épisode (pas forcément la même partout)
4. **Markers à utiliser** : seulement `<#0.X#>` pauses. Zéro `(...)` interjection.
5. **Pin voice_id** : appel TTS factice 1x/semaine si gap entre épisodes

---

## Pattern : musique 1 morceau → plusieurs durées vidéo (fenêtre + fade) — validé 2026-06-05

**Problème** : une vidéo évolue en durée (22s → 32s → 60s pendant l'itération). Il faut une musique qui colle à CHAQUE durée sans coupure brutale ni raccord audible.

**Solution validée (war-map Soudan)** : générer UN seul morceau, en garder le brut complet, puis découper une fenêtre par durée avec fondu de sortie. JAMAIS assembler plusieurs morceaux (raccords audibles) ni régénérer (ambiances différentes).

1. **Générer 1 fois** via Minimax v2.6 (`is_instrumental: true`). Le modèle sort 2-9 min (typique ~146s). **Garder le brut complet** (`music_raw.mp3`).
2. **Découper une fenêtre par durée** depuis le MÊME brut + fade out :
```bash
# 60s : prend les 60 premières secondes du morceau + fondu in 1.5s + fondu out 3s
ffmpeg -i music_raw.mp3 -t 60 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3,volume=0.9" -c:a libmp3lame -b:a 192k score-epic.mp3
```
3. Nommer par durée : `score.mp3` (22s) / `score-long.mp3` (32s) / `score-epic.mp3` (60s). Le code choisit selon le mode (ex. `epic ? "score-epic" : ...`).

**Pourquoi ça sonne parfait, jamais coupé** :
- Même morceau = même beat/tonalité/instrumentation du début à la fin, zéro transition à raccorder.
- Le brut (146s) >> la vidéo (60s) → on coupe en plein développement, jamais à un endroit "fini".
- Le `afade=out` (2-3s) masque la coupure : l'oreille perçoit une CONCLUSION, pas un arrêt net.

**Limite** : marche tant que la vidéo < durée du brut. Pour 3+ min : générer un morceau plus long OU vraie boucle (point de boucle calé sur le beat, pattern Remotion 2e `<Audio>` `startFrom` — voir feedback_audio-music-loop-startfrom-tardif).

---

## ⛔⛔ LA DURÉE GÉNÉRÉE N'EST PAS UN CRITÈRE DE SÉLECTION (correction Aziz, 2026-07-29)

> ⚠️ À lire AVANT de trier la banque de pistes existantes — et à ne pas confondre avec la « Limite »
> ci-dessus, qui parle de couper UN morceau, pas de CHOISIR parmi plusieurs.

Minimax génère des morceaux courts **faits pour boucler**. Ne jamais filtrer ni écarter une piste sur
sa durée brute : c'est un **attribut** (il dit combien de boucles il faudra), jamais une
disqualification.

**Erreur vécue** : un premier tri de la banque de 67 pistes filtrait sur `durée >= 249 s` et n'en
retenait que **12**. Correction d'Aziz : « la très grande majorité des musiques générées via Minimax
sont des musiques que l'on boucle en tant que telles, donc le fait que ce ne soient pas des musiques
qui vont au format long n'est pas discriminant. » → **58 pistes retenues** après correction. Leçon
plus large : ne pas transformer un attribut technique en critère éliminatoire.

**Le vrai critère pour une piste destinée à boucler** : l'écart de niveau **tête(3 s) ↔ queue(3 s)**.
< 2 dB = boucle quasi transparente · > 5 dB = `acrossfade` long obligatoire (une piste de l'épisode
CFA à 5.5 dB imposait un fondu de 4 s).

⭐ **AVANT TOUT NOUVEL APPEL Minimax : lire `public/_shared/audio/INDEX-MUSIQUES.md`** — 67 pistes
uniques déjà produites, toutes mesurées (durée · amplitude · bande 200 Hz–2 kHz de la voix · écart de
boucle). Générer sans l'avoir lu, c'est re-payer ce qu'on possède : 4 groupes de doublons binaires
exacts y ont été trouvés (24.8 Mo), dont 3 pistes stockées deux fois sous des noms différents.

### ⛔ Test final session — clip livré ne correspond PAS au prompt envoyé (2026-08-08, dernier appel session)

Objectif : corriger le défaut "triangle noir progressif" du test orbite v2 (cause diagnostiquée :
durée proche du plafond 15s + prompt ne couvrant explicitement que "8-10s (extend proportionally if
longer)", laissant les 5 dernières secondes sans instruction précise). Fix tenté : prompt v3 recalibré
strictement pour **10 secondes**, tranches explicites SECOND 0-1 à SECOND 9-10 couvrant 100% de la
durée sans aucune clause vague, + clause négative explicite anti-bandeau noir ("No black band, no dark
triangle, no vignette, no frame corner darkening... entire frame stays fully lit and clean from edge
to edge for all 10 seconds").

**Prérequis vérifiés avant l'appel (tous corrects)** :
- Image de référence `ref-t6-doteyes-fixed.png` **confirmée être un JPEG déguisé en `.png`** (gotcha
  anticipé, exactement comme documenté) — `PIL Image.open().format` = `JPEG`, résolution 768×1365 ≠
  résolution input original 720×1280. Reconvertie proprement : `ref-t6-doteyes-fixed-clean.png`, PNG
  RGB réel, 720×1280, LANCZOS resize. Vérifiée visuellement après reconversion : dot-eyes intacts,
  mains sur la barre bien visibles, aucune dégradation de style. **Root cause du gotcha reconfirmée
  : `fix-dot-eyes.py` (édition Gemini) sauvegarde parfois un JPEG ré-encodé sous extension `.png` —
  toujours vérifier `PIL.Image.format` avant réutilisation d'un fichier "corrigé" par ce script.**
- Upload Comfy Cloud réussi (`26478e6e...ec.png`).
- `estimate_credits` : 0 crédit (cohérent, open-weight).
- Overrides envoyés : `132.value=10`, `136.width/height=480/864`, `137.image` + `139.image` = la
  référence corrigée, `138.text` = prompt v3 complet. Warnings de soumission identiques aux runs
  précédents (`override_not_embedded` sur 136/138 — normal, déjà documenté comme sans impact réel).

**Résultat obtenu — ÉCHEC D'INFRASTRUCTURE, pas un échec de prompt** : `get_job_status` a rapporté
`succeeded/completed` sans aucune erreur. Le fichier vidéo livré (480×864, 10.125s, 243 frames @
24fps — mêmes caractéristiques techniques attendues) contient un **contenu totalement différent du
prompt envoyé** : un jeune garçon en super-héros (cape rouge, style comics/manhwa) sur un toit
d'immeuble urbain de nuit, avec du texte incrusté "GET READY TO MEET YOUR MAKER", suivi d'un robot/
mecha géant aux yeux et bouche lumineux rouges façon kaiju. **Zéro élément du prompt Sonjata présent**
— pas de village, pas de barre de fer, pas de style papercraft sépia/ocre, pas de dot-eyes, pas
d'orbite caméra autour d'un personnage agenouillé. Confirmé par extraction directe de frames à t=0
ET t=9.8s (pas seulement un artefact de planche-contact) — le contenu erroné couvre l'intégralité du
clip, pas une portion.

**Diagnostic** : ce n'est pas un problème de discipline de prompt (le prompt v3 était rigoureux, sur
le modèle validé plus tôt cette session) ni un problème de format de l'image de référence (corrigé et
vérifié avant l'appel). C'est une anomalie d'exécution côté Comfy Cloud — soit une collision de sortie
avec un job d'une autre session/un autre utilisateur, soit le node LoadImage/prompt text n'a pas
réellement reçu les valeurs override malgré le warning "ran on the executed graph" habituel (à
reconsidérer : peut-être que ce warning ne garantit PAS toujours une prise en compte réelle, contraire
à l'hypothèse jusqu'ici acceptée sur ce projet). **Aucune corrélation avec le contenu Sonjata que ce
soit — le clip livré ressemble à un template de démo/exemple générique du service ("GET READY TO MEET
YOUR MAKER" a l'air d'un texte de stock/placeholder), hypothèse à vérifier : output peut-être un
sample par défaut renvoyé en cas de défaillance silencieuse du pipeline, pas un vrai résultat H3 sur
nos inputs.**

**Décision** : clip NON livré à Aziz — non uploadé sur Vercel Blob (conforme à la règle "ne pas
uploader un clip cassé"). Aucun nouvel appel relancé (dernier appel autorisé de la session R&D).

**Coût** : bucket horaire 16h-17h UTC du 2026-08-08 = $0.548394. Cumul mensuel total après ce test :
$3.833690 (`get_usage_report`).

**À faire en prochaine session avant de retenter** :
1. Relancer EXACTEMENT ce même appel (même prompt v3, même image, mêmes overrides) pour voir si
   l'anomalie se reproduit — si oui, c'est structurel (mauvais mapping node/template) ; si non, c'était
   un glitch ponctuel d'infrastructure (cache/routing serveur).
2. Si ça se reproduit : vérifier via `get_template(video_minimax_h3_r2v, summary_only=true)` que les
   node IDs 132/136/137/138/139 utilisés depuis le début de session correspondent toujours à la bonne
   version du template (un template peut avoir été mis à jour côté Comfy Cloud entre le premier test
   du matin et ce dernier test du soir, changeant silencieusement le mapping des IDs).
3. Ne PAS reconsidérer la correction du bandeau noir (prompt v3, séquençage 0-10s serré) comme
   validée ou invalidée — ce test n'a rien testé côté contenu réel, à refaire proprement.

**Bilan complet de la session R&D MiniMax H3 (7 appels)** : voir sections précédentes de ce fichier
pour le détail complet. Résumé : (1) causalité geste→objet et (2) dot-eyes = techniques de prompt
validées et réutilisables (formule causale répétée 3x + double correction image+prompt). (3) Biais
modèle "résout vite puis fige" confirmé sur 2 types de mouvement différents (action perso ET caméra),
non résolu malgré tranches temporelles égales dans le prompt. (4) Défaut bandeau noir sur clip 15s
proche du plafond durée — hypothèse de cause posée mais NON validée (dernier test invalidé par
l'anomalie d'infrastructure ci-dessus, pas par le contenu). (5) Anomalie d'infrastructure inédite
découverte en toute fin de session — à surveiller/reproduire avant de faire confiance à un run H3
"succeeded" sans vérification frame-par-flow systématique du contenu réel, pas seulement du format
technique (résolution/durée/codec).

### ⭐⭐ Diagnostic forensique post-mortem (agent dédié, 2026-08-08, session suivante) — AUCUN nouvel appel payant

Investigation demandée par Aziz avant tout nouveau test : notre côté ou Comfy Cloud ? Reconstitution
complète sans relancer `run_template` (clip + prompt + ref encore en scratchpad, exploitables).

**Vérifications faites — tout disculpe notre pipeline** :
1. **Prompt v3** (`prompt-v3.txt`, relu intégralement) : rigoureux, structure seconde-par-seconde
   0→10s, clause causale barre/mains, clause dot-eyes stricte, clause anti-bandeau noir. Rien à voir
   avec un super-héros/robot. Pas un problème de discipline de prompt.
2. **Image de référence** (`ref-t6-doteyes-fixed-clean.png`, relue visuellement) : bien conforme —
   village africain, dot-eyes, garçon agenouillé tenant la barre, palette sépia/ocre. PNG réel
   720×1280 (le gotcha JPEG-déguisé avait déjà été corrigé et vérifié avant l'appel). L'upload n'est
   pas la source du problème.
3. **Overrides envoyés** (`132.value=10`, `136.width/height=480/864`, `137.image`+`139.image` = la
   même ref Sonjata, `138.text` = prompt v3) : **identiques en structure** aux appels précédents
   réussis de la même session (Flowdesk 15s, NoteShield, PecheurSurpeche16x9). Pas de champ manquant,
   pas de node oublié.
4. **Point central : le node 139 a bien été neutralisé/overridé** avec la même image que 137 (voir
   ligne "Overrides envoyés" ci-dessus) — **l'hypothèse "override 139 manqué → fuite de l'image démo
   mecha_dragon_lightning.png" est INFIRMÉE**. On avait bien couvert ce node précis, conformément à
   la règle déjà écrite plus haut dans ce fichier. Le contenu mecha/super-héros ressemble à du
   contenu par-défaut du template, mais sa présence dans un run où l'override a été soumis pointe vers
   un **échec du serveur à appliquer réellement l'override malgré le `succeeded` sans erreur** — pas
   vers un oubli côté `input_overrides`.
5. **Lacune de méthode identifiée** : le `prompt_id` retourné par ce `run_template` n'a été journalisé
   nulle part (ni scratchpad, ni `minimax.md`). Impossible de confirmer a posteriori via
   `get_job_status`/`get_queue` s'il y a eu mismatch d'ID ou collision avec un autre job — l'identifiant
   n'existe plus pour vérification. Aucune tentative de deviner/reconstituer un `prompt_id` pour
   interroger l'API a posteriori (aurait été spéculatif, hors mission diagnostic).

**Verdict** : cause la plus probable = **incident infrastructure Comfy Cloud** (collision de sortie
avec un autre job, ou non-application silencieuse des overrides serveur malgré statut `succeeded`
sans erreur). Chaque facteur normalement imputable à notre pipeline (prompt, ref, structure d'appel,
node 139) a été vérifié et disculpé. Pas une certitude à 100% (aurait fallu le `prompt_id` loggé +
`get_job_status` immédiat pour preuve définitive), mais aucun signal ne pointe vers notre `run_template`.

**Actions pour éviter la récidive** :
- **Toujours logger le `prompt_id`** retourné par `run_template` dans un fichier sidecar
  (`<clip>.job-id.txt`) au moment même de l'appel — absent cette fois, c'est ce qui bloque toute
  vérification a posteriori. Règle à appliquer dès le prochain appel H3.
- **Vérification frame-par-frame systématique avant tout upload/livraison** — déjà la pratique de
  fait (c'est elle qui a détecté cette anomalie), formalisée ici comme non-négociable : un `succeeded`
  serveur ne garantit PAS que le contenu correspond aux inputs.
- **Si récidive sur un prochain test** : comparer deux runs consécutifs strictement identiques
  (même prompt, même image, mêmes overrides) — reproductible = bug structurel de mapping ;
  non-reproductible = glitch ponctuel d'infra. Test à faire au prochain appel autorisé par Aziz,
  PAS relancé de façon autonome ici (mission = diagnostic seul).
- Si reproductible : signalement à Comfy Cloud avec `prompt_id` en preuve (nécessite le point de
  logging ci-dessus pour être actionnable la prochaine fois).

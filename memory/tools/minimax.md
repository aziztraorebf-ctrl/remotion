# Minimax Music 2.6 — Guide complet

> Mise a jour : 2026-04-22 (apres validation Sonjata Short)
> Endpoint actif : `fal-ai/minimax-music/v2.6`
> **Note** : consulter ce fichier AVANT tout appel Minimax

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

### Test rapide (1 variante, ~$0.10)
```bash
python3 scripts/tools/minimax-music-test.py
```
Mesure duree reelle + sauvegarde dans `sonjata-papercraft/audio/music/`.

### 3 variantes parallele (~$0.30, ~6min)
```bash
python3 scripts/tools/minimax-music-3variants.py
```
Genere A/B/C simultanees, telecharge, probe duree. Upload en gallery Vercel :
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

Voir `src/projects/geoafrique-shorts/SonjataShortFull.tsx` pour l'implementation reference.

---

## References

- Doc Context7 fal.ai : `/websites/fal_ai_models` query "minimax-music v2.6"
- Clip reference validation : `sonjata-papercraft/audio/music/v2-A-griot-intime.mp3`
- Integration Remotion : `src/projects/geoafrique-shorts/SonjataShortFull.tsx`
- Script test solo : `scripts/tools/minimax-music-test.py`
- Script 3 variantes : `scripts/tools/minimax-music-3variants.py`

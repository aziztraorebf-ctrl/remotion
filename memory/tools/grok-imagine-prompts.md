# Grok Imagine Video 1.5 — Reference Prompts & Tests
> Tous les prompts testes le 2026-07-04 (session R&D pecheur pirogue), avec scripts et resultats.
> Apres avoir ecrit un prompt, verifier contre `grok-imagine-rules.md`.
> Mise a jour : 2026-07-04

---

## Acces et parametres API

- **Endpoint generation** : `POST https://api.x.ai/v1/videos/generations`
- **Endpoint polling** : `GET https://api.x.ai/v1/videos/{request_id}`
- **Endpoint extension** : `POST https://api.x.ai/v1/videos/extensions` (marche PAS sur `-1.5`, voir R6)
- **Headers** : `Content-Type: application/json`, `Authorization: Bearer $XAI_API_KEY`
- **Body generation** :
  ```json
  {
    "model": "grok-imagine-video-1.5",
    "prompt": "...",
    "image": {"url": "data:image/png;base64,..."},
    "duration": 10,
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }
  ```
- **IMPORTANT** : le champ `image` est un OBJET `{"url": "..."}`, PAS une string directe. Erreur 422 sinon.
- **Duree** : 1-15s (defaut variable selon modele). Sweet spot teste : 6s (1 beat) a 10s (sequence complete).
- **Resolution** : 480p ou 720p (1080p mentionne dans certaines docs mais pas confirme accessible en pratique sur `-1.5`).
- **Reponse generation** : `{"request_id": "..."}`
- **Reponse polling (done)** : `{"status": "done", "video": {"url": "...", "duration": N}}`
- **Statuts possibles** : `pending`, `done`, `failed`, `expired`
- **Pricing reel confirme** : $0.08/s (480p), $0.14/s (720p) + $0.01 par image en input. Donc 10s/720p = $1.40, 6s/720p = $0.84.

### Script de reference (fonctionnel, `requests` pas de SDK)
Voir `scripts/tools/grok-imagine-pecheur-v3.py` dans le repo — soumission, polling, telechargement, sauvegarde metadata. Copier ce script comme base pour tout nouveau test.

**GOTCHA telechargement** : preferer `requests.get(url).content` a `urllib.request.urlretrieve()` — ce dernier a montre des hangs occasionnels dans notre environnement (cf `grok-imagine-rules.md` R8). En cas de blocage script Python persistant, basculer sur `curl` direct en Bash (toujours fonctionne).

---

## Prompt v1 — ECHEC (sequence complete, image source brute)

**Contexte** : image source = pecheur debout, tenant une pagaie/baton (PAS de filet visible), un seul panier vide a gauche.

```
Animate this exact illustration. STRICT STYLE FIDELITY: minimalist ink-line 2D flat illustration — thin black outlined stick-figure character, flat solid color fills, no shading beyond the existing sun halo, no added texture or detail, no photorealism, no 3D rendering. Do NOT drift toward anime or cartoon style.

The fisherman stands in his pirogue on calm water. He performs one full fishing sequence, narrated as continuous action: He WINDS UP his cast, torso leaning back, arm raised high with the folded net. He RELEASES the throw — the net WHIPS forward and fans open over the water. He HAULS the net back in with visible effort, torso straightening, net dragging against the pirogue's side. He TURNS in a three-quarter angle toward the inside of the boat — never facing the camera directly — a fish in hand, and LOWERS it into the wicker basket resting at the bottom of the pirogue. He STRAIGHTENS, gaze drifting toward the horizon. His expression DARKENS — brow lowers, mouth flattens — and he goes still.

Identity lock: dark brown skin, teal shirt, dark slate-grey pants, shaved head, calm profile face, same proportions throughout. Pirogue and flat ink ocean/sky stay consistent with the source image. The wicker basket stays in the same position at the bottom of the boat throughout.

Camera holds steady, gentle handheld sway only. No unnecessary rotations. Normal human body structure, no anatomical distortion.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue. No dust motes, no floating particles.
```

**Resultat** : $1.40, 10s, 720p. Filet apparait de nulle part (image source n'en montrait pas), panier duplique en fin de clip, morphing visage pendant la rotation.

---

## Prompt v2 — VALIDE (un seul beat isole, 6s)

**Contexte** : repart d'une frame extraite du v1 ou le poisson est deja en main (ATTENTION — cette frame etait deja affectee par la duplication du panier, cf R5. A eviter, repartir d'une image proprement generee).

```
Animate this exact illustration. STRICT STYLE FIDELITY: minimalist ink-line 2D flat illustration — thin black outlined stick-figure character, flat solid color fills, no shading beyond the existing sun halo, no added texture or detail, no photorealism, no 3D rendering. Do NOT drift toward anime or cartoon style.

The fisherman, already bent forward holding a fish in his hand, LOWERS the fish into the single wicker basket already resting at the bottom of the pirogue — the exact same basket visible in the source image. Do not add a second basket. Do not duplicate any object already present in the boat. There is only ever one crate on the left and one basket on the right, exactly as shown.

He STRAIGHTENS back up slowly and turns his gaze toward the horizon. His expression DARKENS — brow lowers, mouth flattens — and he goes still.

Sound: gentle water lapping against the wooden pirogue, a distant seabird call. Keep the audio continuous through the turn to help anchor the face during the movement.

Identity lock: dark brown skin, teal shirt, dark slate-grey pants, shaved head, calm profile face, same proportions throughout — face must not distort or morph during the turn. Pirogue and flat ink ocean/sky stay exactly consistent with the source image.

Camera holds completely steady, no rotation, no zoom, minimal handheld sway only. Normal human body structure, no anatomical distortion.

No text, no banners, no signs, no writing visible anywhere. No music, no dialogue, no dust motes, no floating particles, no extra characters, no extra objects.
```

**Resultat** : $0.84, 6s, 720p. Panier unique (pas de duplication), visage stable (pas de morphing). Point mineur : poisson pose sur le rebord plutot que clairement dans le panier.

---

## Prompt v3 — MEILLEUR RESULTAT GLOBAL (sequence complete, point de depart verrouille par Gemini)

**Prerequis** : generer d'abord une image d'etat intermediaire via Gemini i2i (voir section suivante) montrant le pecheur avec le filet DEJA plie en main, panier unique deja vide.

```
Animate this exact illustration. STRICT STYLE FIDELITY: minimalist ink-line 2D flat illustration — thin black outlined stick-figure character, flat solid color fills, no shading beyond the existing sun halo, no added texture or detail, no photorealism, no 3D rendering. Do NOT drift toward anime or cartoon style.

The fisherman, already holding the folded cast net in his hand exactly as shown, performs one full fishing sequence, narrated as continuous action: He WINDS UP his cast, torso leaning back, arm raised high with the folded net. He RELEASES the throw — the net WHIPS forward and fans open over the water. He HAULS the net back in with visible effort, torso straightening, net dragging against the pirogue's side. He TURNS in a three-quarter angle toward the inside of the boat — never facing the camera directly — a single fish now in hand (the net itself is set down out of frame, at the bottom of the boat, no longer visible), and LOWERS the fish into the single wicker basket resting at the bottom of the pirogue — the exact same basket visible in the source image. He STRAIGHTENS, gaze drifting toward the horizon. His expression DARKENS — brow lowers, mouth flattens — and he goes still.

STRICT ANTI-DUPLICATION: There is only ever ONE wicker basket in the boat, already empty at the start, exactly where shown in the source image. Do not add a second basket. Do not duplicate any object already present in the boat at any point in the sequence.

Sound: net whipping through the air, a water splash, wood creaking, distant gulls — continuous ambient audio throughout to help anchor facial identity during the turn.

Identity lock: dark brown skin, teal shirt, dark slate-grey pants, shaved head, calm profile face, same proportions throughout — face must not distort or morph during the turn. Pirogue and flat ink ocean/sky stay exactly consistent with the source image.

Camera holds steady throughout, gentle handheld sway only, minimal rotation speed during the turn to avoid identity drift. Normal human body structure, no anatomical distortion.

No text, no banners, no signs, no writing visible anywhere. No music, no dialogue, no dust motes, no floating particles, no extra characters, no extra objects.
```

**Resultat** : $1.40, 10s, 720p. Panier unique correct tout du long, visage stable, filet plus halluciné (deja en main des le depart), zoom camera progressif emergent (effet dramatique non demande mais bienvenu). Point restant : le geste exact de depose du poisson dans le panier n'etait pas net a la relecture des frames extraites (a verifier en lecture video complete).

---

## Prompts Gemini i2i pour generer les images-cles (workflow "etat verrouille")

### Etat A — filet deja plie en main, panier vide

```
Edit this exact illustration, keeping the EXACT same minimalist ink-line 2D flat illustration style, same color palette (teal shirt, dark slate-grey pants, dark brown skin, shaved head), same pirogue boat, same sun/sky/ocean background, same camera angle and character proportions and position.

ONLY CHANGE: replace whatever the fisherman is holding in his right hand with a traditional round CAST FISHING NET, already fully FOLDED and gathered, held ready at his side (not thrown, not spread open — just folded and held, ready to cast). Keep his stance and pose otherwise identical to the source.

Keep the single wicker basket/crate exactly as it appears in the source image — same position, same size, EMPTY (no fish inside). Do not add a second basket or any other object. Do not change the boat, the sun, the clouds, or the horizon line.
```

### Etat B — poisson deja en main, filet range (pour un test 2-clips independants — resultat mitige, cf R7)

```
Edit this exact illustration, keeping the EXACT same minimalist ink-line 2D flat illustration style, same color palette (teal shirt, dark slate-grey pants, dark brown skin, shaved head), same pirogue boat, same sun/sky/ocean background, same camera angle.

CHANGE: the fisherman has just hauled in his net and now holds a SINGLE FISH in his right hand, arm bent, fish held up near chest height. The cast net is no longer visible in his hands -- it has already been set down at the bottom of the boat, mostly hidden/out of clear view. His pose: standing upright, slightly bent forward at the torso, looking down toward the fish in his hand.

Keep the single wicker basket/crate exactly as it appears in the source image -- SAME position (to the left, near the front of the boat), same size, still EMPTY. Do not add a second basket. Do not move the basket. Do not change the boat, the sun, the clouds, or the horizon line.
```

**Note importante** : ce workflow 2-etats (A puis B) genere 2 clips independants juxtaposes — le resultat a montre un raccord visible (R7). Le prompt v3 (un seul clip de 10s partant de l'Etat A uniquement) donne un meilleur resultat global.

### Modele Gemini et methode

- Modele : `gemini-3.1-flash-image-preview` (le seul qui genere/edite des images, cf `memory/tools/gemini.md`)
- **Utiliser l'appel REST direct (`requests.post` vers `generativelanguage.googleapis.com`), PAS le SDK** — le SDK a hang plusieurs fois sur ces appels i2i (cf R8). Voir `memory/tools/gemini.md` pour le code exact.
- Repartir de l'image source ORIGINALE (pas d'une frame de clip video deja generee, qui pourrait deja contenir un artefact — cf R5).

---

## Tests realises (tableau recapitulatif)

| Test | Date | Cout | Duree | Resultat | Key Learning |
|------|------|------|-------|----------|---------------|
| v1 (sequence complete, image brute) | 2026-07-04 | $1.40 | 10s | Echec partiel | Filet halluginé, panier duplique, morphing visage (R1, R2) |
| v2 (1 beat isole, image intermediaire) | 2026-07-04 | $0.84 | 6s | Valide | Panier stable, visage stable — mais depart d'une frame deja "sale" (R5) |
| Extension ancien modele (clip1 seul) | 2026-07-04 | ~$0.35 | 5s | Partiel | Style degrade (moins fidele), mouvement correct |
| Extension ancien modele (extend) | 2026-07-04 | ~$0.42 (perdu, echec) | 6s | **ECHEC x2** | `internal_error` cote serveur, 2 tentatives identiques |
| v3 (sequence complete, Etat A Gemini) | 2026-07-04 | $1.40 | 10s | **Meilleur** | Point de depart verrouille = quasi tous les artefacts corriges |
| 2 clips independants juxtaposes (Etat A + Etat B) | 2026-07-04 | ~$1.68 | 12s (6+6) | Echec raccord | Saut de posture visible + panier re-derive entre les 2 clips (R7) |

**Cout cumule de la session R&D** : ~$5.69 (hors extension echouee non facturee a priori) pour arriver a la methode v3 reproductible.

---

## Backlog de tests (non faits, pistes identifiees)

| Priorite | Test | Objectif | Source |
|---|---|---|---|
| 1 | Multi-image storyboard app (`@image1`/`@image2`) | Verifier si le vrai storyboard multi-shot existe et resout R7 | Recherche Tavily, non confirme API |
| 2 | Extend from Frame dans l'app (pas API) | Verifier si plus fiable que les 2 echecs API constates | Recherche Tavily, guides communautaires |
| 3 | Timestamps `[00:00]`/`[00:04]` dans un prompt long | Alternative au decoupage en beats pour controler le timing sans multi-clips | Recherche Tavily, non teste |
| 4 | Cues "cut to"/"camera switch" dans un seul prompt | Simuler des coupes de plan sans multi-clips ni extension | Recherche Tavily, non teste |
| 5 | Duree max reelle testable (15s en un seul clip) | Voir si un clip plus long que 10s degrade la coherence | Non teste (on a teste 6s et 10s max) |

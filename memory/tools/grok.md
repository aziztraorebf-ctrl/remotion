# Grok (xAI) — capacités confirmées

> Créé 2026-08-07. Modèle texte déjà utilisé dans le projet pour jury créatif (voir
> `scripts/tools/jury-script-saas-llm.py`, `jury-script-creatif-llm.py` : `grok-4.20-reasoning`
> via `https://api.x.ai/v1/chat/completions`).

## ⭐⭐ Grok GÉNÈRE DES IMAGES — capacité qu'on ignorait, découverte 2026-08-17

> **On croyait que Grok ne dessinait pas** et il était donc exclu de tous nos storyboards. Faux :
> `GET https://api.x.ai/v1/models` liste **3 modèles image**, en plus des 2 vidéo déjà documentés
> dans `grok-imagine-rules.md` (qui ne couvrait QUE la vidéo — d'où la confusion).
> C'est Aziz qui a soulevé le doute ; la vérification a pris un appel.

### Les 3 modèles image (testés, les 3 répondent 200 avec une URL)

| Modèle | Prix (doc officielle xAI) | Verdict |
|---|---|---|
| `grok-imagine-image` | **0,02 $** / image | non testé en profondeur |
| `grok-imagine-image-2.0` | **0,04 $** / image | ⭐ **notre défaut** — recommandé par xAI, testé 4× |
| `grok-imagine-image-quality` | **0,05 $** / image | testé 1×, pas d'écart net vs 2.0 sur nos planches |

### Endpoint (≠ celui du texte)

```python
r = requests.post("https://api.x.ai/v1/images/generations",
    headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
    json={"model": "grok-imagine-image-2.0", "prompt": prompt, "n": 1}, timeout=200)
url = r.json()["data"][0]["url"]          # URL temporaire imgen.x.ai -> télécharger tout de suite
```
✅ **Le format se pilote** : `aspect_ratio` (`"16:9"`) + `resolution` (`"2k"`) fonctionnent — c'est ce
qu'utilise `storyboard-dual-gen.py` par défaut. Il n'y a pas de champ `image_size` ; SANS ces 2 champs,
il retombe sur du 1280×720.
⚠️ Le prompt est long (5-6 Ko) → **passer par Python**, pas par `curl -d` en shell : l'échappement
casse le JSON silencieusement (vécu le jour même).

### ⭐ Sur une PLANCHE DE STORYBOARD, il bat GPT-image (4 concepts comparés, 2026-08-17)

Même prompt, même style imposé. Grok gagne sur les 4, et surtout il **corrige des erreurs
factuelles** que GPT commettait :
- timecodes justes (« 1,2 s ») là où GPT écrivait « 1:02 » / « 16:08 » ;
- attribution des plaques de pays correcte, là où GPT posait ALGÉRIE sur le tracé marocain ;
- texte sans faute (GPT produisait « Lee routes croisées », « CONCEEPT », « Algeriaa »).
⚠️ Il n'est pas parfait : sur le concept « deux ponts » il a **effacé les fils de suspension** au
dernier panneau — or ces fils portaient tout le sens. Vérifier que le geste-clé survit à la
dernière case, c'est le contrôle à faire sur ses sorties.

✅ **FAIT le 2026-08-18** — intégré à `storyboard-dual-gen.py` (`gen_grok()`, actif par défaut via
`--models gemini,gpt,grok`). Coût dérisoire : 5 planches = ~0,20 $ (coût réel mesuré 0,047-0,053 $/image,
l'input est facturé en plus du prix affiché).

### ⭐⭐ ÉDITION MULTI-RÉFÉRENCES — `/v1/images/edits` (vérifié par appel réel 2026-08-18)

Les 3 modèles image déclarent **`input_modalities: ["text","image"]`** — ils acceptent donc des images
de référence, pas seulement du texte (la fiche l'ignorait).
```python
POST https://api.x.ai/v1/images/edits
{"model":"grok-imagine-image-2.0","prompt":"...",
 "images":[{"url":"data:image/png;base64,...","type":"image_url"}, ...]}
```
⛔ Champ **PLURIEL `images`** — le singulier `image` renvoie **422** sur une liste. **4 refs acceptées**
(la doc officielle en annonce 3). ⚠️ Downscaler les refs (1280 px) : un payload base64 de 1,6 Mo a fait
**timeout à 2 min**.
⛔⛔ **En mode `edits`, la référence ÉCRASE le style demandé** (un rendu crayon a été ignoré au profit
de l'image source). → Dire explicitement dans le prompt que la ref sert de **REGISTRE**, jamais de
modèle à copier — sinon le modèle recopie la scène au lieu d'en proposer une neuve.

## Grok vision — confirmé fonctionnel (2026-08-07)

`grok-4.20-reasoning` accepte une image en payload multimodal, **même format qu'OpenAI/GPT** :

```python
payload = {
    "model": "grok-4.20-reasoning",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
            ],
        }
    ],
}
r = requests.post(
    "https://api.x.ai/v1/chat/completions",
    headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
    json=payload, timeout=300,
)
```

Testé la première fois sur une planche contact (grille de frames début/milieu/fin par panneau,
composée en une seule image) dans le cadre d'un jury motion design à 4 modèles (NorthShield,
2026-08-07) — statut HTTP 200, réponse exploitée directement, verdict cohérent avec les 3 autres
modèles (Gemini, Kimi, GPT).

Jusqu'ici, aucun script dédié n'expose ce mode vision — l'appel a été fait ad hoc (script Python
inline). Si le besoin se répète (jury vidéo/motion à 4 modèles), envisager un script
`scripts/tools/grok-vision-breakdown.py` sur le modèle de
`scripts/tools/openrouter-vision-breakdown.py` (même contrat : `--model`, `--image`,
`--prompt-file`, `--output`).

## Pattern jury motion design vidéo (4 modèles, pas de script unique existant)

Pour juger une vidéo de motion design/animation (pas juste script/thumbnail — les jurys
existants `jury-*-llm.py` ne couvrent pas ce cas) :
- **Gemini 3.1 Pro + Kimi K2.5** : vidéo complète en natif via
  `scripts/tools/gemini-video-review-custom.py <video> <brief.txt> <out.md>` et
  `scripts/tools/kimi-video-compare.py --ref <video> --new <video> --question "<brief>"`
  (même vidéo aux 2 slots pour neutraliser le mode comparatif, cf `memory/tools/review-video-llm-scripts.md`).
- **GPT-5.5 + Grok** : pas de vidéo native fiable pour ces deux → composer une **planche
  contact** (grille N panneaux × 3 colonnes début/milieu/fin, avec labels) en une seule image
  PNG, envoyée via `openrouter-vision-breakdown.py` (GPT) et l'appel direct ci-dessus (Grok).
  Préciser explicitement dans le prompt que l'image est une planche contact et que le jugement
  de mouvement doit se faire par comparaison entre les 3 frames d'une même ligne.

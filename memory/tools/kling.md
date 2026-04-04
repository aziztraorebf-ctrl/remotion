# Kling — Regles de Production
> Tout ce qu'on sait sur Kling V3/O3. Endpoints, cfg_scale, methodes, frame chaining.
> Mise a jour : 2026-04-02

---

## Endpoints fal.ai (valides 2026-03-16)

| Endpoint | Usage | cfg_scale |
|----------|-------|-----------|
| `fal-ai/kling-video/v3/pro/image-to-video` | Portrait cinematique, visage principal | 0.4 |
| `fal-ai/kling-video/v3/standard/image-to-video` | Scene symbolique/locked, economique | 0.35 |
| `fal-ai/kling-video/o3/standard/image-to-video` | Scene epique, start+end frame | 0.35-0.4 |

- V1.5/V1.6 = DEFUNCT. Ne pas utiliser.
- V3 Std cfg 0.3 + "static locked shot" = vie microscopique sans morphing (ideal scenes symboliques)

---

## cfg_scale (adherence au prompt, PAS intensite mouvement)

| Valeur | Usage |
|--------|-------|
| 0.3 | Maximum stabilite, anti-morphing |
| 0.35 | Flat design vivid_shapes O3 |
| 0.4 | Portrait semi-realiste V3, dolly in O3 |
| 0.45 | Force fidelite aux frames (+ elements) |
| 0.5-0.6 | Cartes geo V2.1 (pas V3 — derive geographique) |

---

## 5 regles essentielles

1. **cfg_scale 0.3** = plus stable (moins de morphing)
2. **Plan moyen (sujet 50-55% cadre) OBLIGATOIRE** pour tout mouvement camera
3. **Morphing O3 sur flat 2D** : degrade apres ~6-8s — couper avec durationInFrames
4. **Duree = duree beat audio** : `duration: "5"` ou `"10"`. Clip 10s pour beat 12s = playbackRate 0.83x
5. **Mouvement = prompt engineering** : "PRESSES", "MARCH", "RUSHES". JAMAIS "atmospheric movement only"

---

## Images source

- **JAMAIS de texte** dans l'image source — anime/deforme a 5s+
- **Cadrage valider AVANT envoi** : element coupe dans source = coupe dans clip
- Supprimer TOUS les elements decoratifs de coin (medaillons, arabesques) -> artefacts

---

## Physique implicite

- Kling distingue elements "physiques" (anime selon physique) vs "decor fixe" (preserve statique)
- Zone neutre en haut (ciel, espace) = zone texte stable pour overlay Remotion
- Kling ajoute spontanement : ombres portees, reflets eau, criniere animee. Ne pas bloquer.
- Camera qui avance vers des dos = derive semi-realiste. Fix : cfg_scale 0.45

---

## Multi-shot prompt

Format structure dans le prompt standard (pas un parametre API) :
```
Shot 1 (0-6s): Visual: [description]. Camera: [mouvement].
Shot 2 (6-11s): Visual: [description]. Camera: [mouvement].
```

---

## Morphing et duree

- O3 sur flat 2D : stable 0-6s, morphing progressif apres
- Regenerer avec memes parametres + duree differente = ~95% deterministe

---

## Technique `elements` (references personnages)

```python
"elements": [
    {"frontal_image_url": url_perso_ref, "reference_image_urls": []},
    {"frontal_image_url": url_soldat_ref, "reference_image_urls": []},
]
```
- Verrouille : silhouette globale, ton couleur dominant, style graphique
- NE verrouille PAS : forme d'objets, couleur vetements si start frame dicte autre chose
- Crop de reference : contenir UNIQUEMENT l'info a transmettre. Couleur en peripherie = contamination
- cfg_scale 0.45 + elements = meilleur verrouillage que cfg_scale 0.35 seul

---

## Frame Chaining — Sequences Kling

### Principe
Extraire la derniere frame d'un clip valide -> retoucher via Gemini -> start frame du clip suivant.

### Workflow
```
Clip N valide
  -> ffmpeg -sseof -0.1 -i clip.mp4 -vframes 1 -update 1 frame.png
  -> Gemini edit chirurgical (posture, angle)
  -> Frame resultante = start frame clip N+1
  -> Gemini edit pour end frame clip N+1
  -> Lancer Kling O3 avec start + end frame
```

### Regle ecart start/end
- Garder start et end dans le MEME espace visuel (meme angle, meme distance camera)
- Changer UN seul element. Ecart trop grand -> Kling improvise -> artefacts
- End frame TOUJOURS genere depuis le start frame exact via Gemini

---

## Regles start/end frame

| Ecart start-end | Resultat Kling | Recommandation |
|-----------------|----------------|----------------|
| Meme cadrage, leger mouvement | Anime fidelement | Ideal |
| Meme cadrage, elements ajoutes | Anime avec quelques libertes | Acceptable |
| Cadrage different | Invente sa propre transition | A eviter |
| Composition completement differente | Improvise totalement | Interdit |

---

## Regles comportement Kling

- **Kling narrativise** : invente choregraphie, synchronisation armee — ne pas contrer
- **Kling normalise les traits** : oeil ferme -> ouvre, cicatrice -> attenue. Forcer via negative_prompt.
- **Kling anime fidelement la source** : defaut dans image = defaut dans clip. Valider source d'abord.
- **recraft vivid_shapes = direction narrative** : images sources semblent ordinaires. Juger le clip.
- **End frame = intention, pas prescription** : elements secondaires mieux inventes par Kling
- **Style flat = plus permissif** sur mouvements rapides de camera que semi-realiste
- **Kling IGNORE le style "2D flat"** : rendu toujours realiste/semi-realiste meme avec "2D vivid flat illustration style" dans le prompt
- **Kling NE GERE PAS les effets VFX conceptuels** : "everyone freezes like mannequins", "shockwave", "time stop" = ignores ou interpretes comme un simple flash lumineux. Pour ces effets -> Seedance uniquement. Test echoue 2026-04-04 (V3 Pro text-to-video, time-freeze Abou Bakari, $0.65).

---

## Orientation personnages pour animation

| Orientation | Mouvement Kling | Resultat |
|-------------|-----------------|---------|
| De face / de dos | Marche avant/arriere | Naturel |
| De profil (90) | Glissement lateral | Artificiel — eviter |
| 3/4 dos | Acceptable | Variable |

---

## Methodes de controle

| Situation | Methode |
|-----------|---------|
| Clip personnage plat | V3 standard, cfg 0.35 |
| Clip carte geo | V2.1 standard, cfg 0.6 |
| Transition cinematique | O3 start+end frame, cfg 0.4 |
| Portrait semi-realiste | V3 Pro, cfg 0.4 |

# Kling AI — Pipeline & Learnings
> Creé : 2026-03-10 | Mise à jour : 2026-03-13

---

## Architecture Kling (V3 vs O3)

### Video 3.0 (V3) — "Prompt-First"
- Génération pure text-to-video ou image-to-video
- Multi-shot natif via paramètre `multi_prompt` (jusqu'à 6 shots)
- Résolution : 1080p max
- Cas d'usage : animation scène unique, cartes, décors

### Video 3.0 Omni (O3) — "Reference-First"
- Extraction traits visuels ET vocaux depuis vidéo de référence
- Édition vidéo (swap background, remplacement objet)
- Résolution : 4K
- Subject consistency cross-shots (Element Binding)
- Cas d'usage : personnage récurrent, cohérence cross-shots

### O1 — "Keyframe-First"
- Interpolation entre start frame et end frame fixes
- Transition entre deux images clés définies

---

## REGLE CRITIQUE : Toujours utiliser V3, jamais V1.6 (2026-03-13)

fal.ai propose `fal-ai/kling-video/v1.6/standard/image-to-video` comme endpoint "par defaut" dans leur doc.
**Ne jamais l'utiliser.** C'est une version obsolete.
Toujours specifier explicitement `v3/standard` ou `v3/pro`.

---

## Endpoints fal.ai confirmés

| Endpoint | Type | Prix/s | Notes |
|----------|------|--------|-------|
| `fal-ai/kling-video/v3/standard/image-to-video` | i2v | $0.084 (no audio) / $0.126 (audio) | **DEFAUT — toujours utiliser** |
| `fal-ai/kling-video/v3/pro/image-to-video` | i2v | $0.112 / $0.168 | Pro quality |
| `fal-ai/kling-video/o3/standard/image-to-video` | i2v | ~$0.168 | 4K, reference |
| `fal-ai/kling-video/o3/standard/reference-to-video` | ref2v | confirme | Cross-shot consistency |
| `fal-ai/kling-video/o1/image-to-video` | i2v | $0.112/s | Start+end frame |
| `fal-ai/kling-video/lipsync/audio-to-video` | lipsync | $0.014/s input | Post-prod lipsync |
| `fal-ai/kling-video/ai-avatar/v2/standard` | avatar | $0.0562/s | Personnage qui parle |

---

## Paramètres clés (V3 image-to-video)

```typescript
{
  prompt: string,
  image_url: string,          // URL publique obligatoire
  duration: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15", // string, pas number
  aspect_ratio: "9:16" | "16:9" | "1:1",
  cfg_scale: number,          // 0.0-1.0, défaut 0.5
  negative_prompt: string,
  // Audio : omettre = pas d'audio (économique)
  // Avec audio : $0.126/s au lieu de $0.084/s
}
```

**Durée** : V3 et O3 acceptent TOUTES les valeurs entieres de 3 a 15s (pas seulement 5 et 10).
**V2.1 UNIQUEMENT** : limité a "5" ou "10" — pas d'autres valeurs.
**REGLE** : toujours generer le clip a la duree exacte du beat (Whisper) — jamais arrondir a 10s si le beat dure 13s.
Valide 2026-03-14 via documentation fal.ai officielle.

---

## Contrôle de caméra

```json
"advanced_camera_control": {
  "movement_type": "horizontal" | "vertical" | "pan" | "tilt" | "roll" | "zoom",
  "movement_value": <integer>
}
```

**Presets** : `down_back`, `forward_up`, `right_turn_forward`, `left_turn_forward`

Note : "dolly" n'est pas un paramètre nommé — décrire via le prompt ("dolly forward").

---

## Lipsync — 3 approches

1. **Lipsync natif V3** : inclure dialogue dans le prompt + `voice_ids`
2. **Lipsync post-prod** : `fal-ai/kling-video/lipsync/audio-to-video` — fournir vidéo + audio MP3
3. **AI Avatar** : image statique + audio → personnage qui parle

**Recommandation projet** : toujours séparer vidéo (Kling) et audio (ElevenLabs), assembler dans Remotion.

---

## Leçons du premier test (2026-03-10)

### Image testée
`tmp/storyboard-abou-bakari/01-ocean.png` — flat design, carte Afrique de l'Ouest, fond spatial noir, "1311" doré

### Résultats des 3 variantes

| Variante | Prompt | cfg_scale | Résultat |
|----------|--------|-----------|---------|
| A-orbital | Mouvement orbital lent, style flat préservé | 0.5 | **MEILLEUR** — descente verticale fluide, style intact, "1311" stable |
| B-zoom | Zoom vers l'Afrique, lumière dorée | 0.5 | **BON** — lumière Mali bonus narratif, mais zoom trop agressif (horizon disparaît) |
| C-parallax | Parallaxe, mouvement gauche-droite | 0.3 | **MAUVAIS** — morphing, hallucinations hors-cadre |

### Règles validées empiriquement

1. **Kling complète le hors-cadre** — il ne fait pas que bouger la caméra sur l'image existante, il infère et génère ce qui est hors-champ. Prouvé : la carte Afrique complète générée depuis une image partielle.
2. **La vraie règle n'est pas vertical/horizontal — c'est la cohérence contextuelle** : le mouvement réussit quand Kling peut inférer ce qui est hors-cadre depuis le contexte de l'image. Continent qui continue vers le bas = prévisible = bon résultat. Océan Atlantique + îles inventées = imprévisible = morphing.
3. **Kling comprend le sémantique** : il sait que c'est une vue satellite de l'Afrique, que le continent a une forme connue. Ce n'est pas du pixel-shifting, c'est de la compréhension de scène.
4. **cfg_scale 0.3 = trop libre pour les cartes géo** — morphing visible. Minimum recommandé pour cartes : 0.5. EXCEPTION : personnages flat design avec V3 = cfg 0.35 optimal (voir règle 9).
5. **Style flat design préservé** à 100% avec V3 standard (pas de "réalisation" involontaire)
6. **Texte dans l'image sur clip COURT (5s)** : stable et lisible. Sur clip LONG (10s+) : Kling intègre le texte dans le mouvement de caméra → déformation/animation indépendante des caractères. **RÈGLE : toujours supprimer le texte de l'image source. Remotion superpose.**
7. **Effets narratifs non demandés** : Kling peut ajouter de l'interprétation (lumière dorée sur le Mali dans B) — parfois beau, jamais contrôlé → pour contrôle total, superposer via Remotion
8. **Audio "no_audio" = mythe** : le paramètre price tier sans audio ($0.084/s) ne supprime PAS l'audio généré. Kling génère toujours un son ambiant. Sur 10s : silencieux les 5 premières secondes, ambiant spatial les 5 dernières. **Solution : `<Video muted>` dans Remotion ou strip audio via ffmpeg en post.**
9. **V3 cfg 0.35 = standard pour personnages flat design** (validé Beat02, 2026-03-13) — V2.1 traite l'image comme un fond à déplacer. V3 comprend qu'il y a un sujet vivant et anime : respiration, yeux mi-clos, vagues organiques. Fond noir préservé, silhouette stable.
10. **Kling enrichit les personnages même si l'image source est minimaliste** — il ajoute des yeux, affine les oreilles, crée des plis de tissu. Ne pas compter sur l'absence de détails dans l'image source pour contrôler Kling. Si on veut un trait absent dans le clip final, le mettre dans le negative_prompt.
11. **Image source avec features faciales = meilleure base pour V3 personnages** — puisque Kling les ajoute de toute façon, autant partir d'une image Gemini avec un visage soigné plutôt que de lutter contre ses ajouts.

### Prompt optimal pour cartes géographiques flat design
```
"[mouvement vertical lent], flat design style preserved, no realistic rendering,
keep the graphic illustration aesthetic"

negative_prompt: "photorealistic, 3D render, distorted map borders, warped text, realistic lighting"
cfg_scale: 0.5-0.6
```

**IMPORTANT** : ne jamais inclure "keep the text still" dans le prompt — ça ne fonctionne pas sur 10s+. Supprimer le texte de l'image source à la place.

---

## Architecture pipeline validée (2026-03-10)

```
Image propre SANS TEXTE (Recraft V4 / Gemini / Kling Image 3.0)
  → Upload fal.ai storage
  → Kling V3 standard i2v (mouvement vertical, 5-10s)
  → MP4 clip (avec audio ambiant Kling — ignoré)
  → Remotion :
      <Video muted src={klingClip} />   ← coupe l'audio Kling
      + texte/titres spring() par-dessus
      + audio ElevenLabs sync
      + transitions entre beats
  → Export MP4 final
```

**Règle images source pour Kling :**
- SANS texte, SANS chiffres, SANS annotations
- Images "propres" = visuels purs → texte ajouté 100% par Remotion
- Les storyboards Gemini (avec labels) = référence de style UNIQUEMENT, jamais envoyés à Kling

**Remotion reste indispensable pour :**
- `<Video muted>` pour couper audio Kling
- Superposition texte/titrages frame-precise avec spring()
- Sync audio ElevenLabs
- Transitions entre beats
- Éléments SVG data-driven (cercles, flèches, timelines) que Kling ne contrôle pas

## Règle : Quand utiliser O3 i2v vs V3 (validée Beat04 session 5)

| Cas | Outil | Pourquoi |
|-----|-------|---------|
| Transition entre 2 compositions (plan large → gros plan) | O3 `image-to-video` + `end_image_url` | Interpolation contrôlée entre start et end frame |
| Animer une image unique (carte, décor, personnage) | V3 `image-to-video` | Meilleur mouvement organique, respiration, enrichissement personnage |
| Cohérence cross-shots (même personnage, scènes différentes) | O3 `reference-to-video` | Mais mouvement quasi nul sur plat statique |

**Règle End Frame Gemini (non-négociable) :** toujours passer l'image source comme `Part.from_bytes()` dans l'appel Gemini pour garder cohérence faciale. Jamais de texte seul.

---

## Décision architecture beats (mise à jour 2026-03-13 session 6)

**Contexte** : audio V4 = 98.16s. Tous les clips existants = 5s. Chaque beat dure 13-17s → freeze sur dernière frame.
Tous les clips existants doivent être régénérés en `duration: "10"`.

| Beats | Outil | Modèle | cfg | Raison | Statut |
|-------|-------|--------|-----|--------|--------|
| 01 ocean | Kling i2v | V2.1 OU O3 start+end | 0.6 / 0.4 | Carte géo — deux options valides (voir note ci-dessous) | À RÉGÉNÉRER 10s |
| 02 roi profil | Kling i2v | V3 standard | 0.35 | Personnage flat design | À RÉGÉNÉRER 10s + nouvelle image Gemini |
| 04 roi trône | O3 image-to-video | O3 standard | 0.4 | Dolly in start+end frame — visuellement parfait mais clip 5s | À RÉGÉNÉRER 10s |
| 03, 05-08 | À définir | — | — | Storyboard natif 9:16 requis | À FAIRE |

### Note : V3 vs V2.1 vs O3 pour cartes géographiques (nuance critique — session 6)

Le rejet initial de V3 pour Beat01 était dû à cfg_scale 0.6 — trop créatif, pas au modèle lui-même.

- **V2.1 cfg 0.6** : option sûre pour cartes géo. Résultat connu (dolly in validé Beat01). Risque zéro.
- **V3 cfg 0.6** : INTERDIT sur cartes géo — dérive géographique (Afrique→Europe visible à frame 5, validé en prod).
- **V3 cfg 0.3-0.4** : non testé sur cartes géo. Potentiellement viable mais ne pas risquer sur production.
- **O3 start+end frame** : meilleure option quand on veut contrôler l'arrivée du zoom (ex: finir sur le Mali). Générer un end frame Gemini zoomé sur la zone cible → O3 interpole le dolly in. Technique validée Beat04 session 5.

---

## Kling V3 + style vectoriel flat (validé 2026-03-13)

- V3 standard (cfg 0.4) anime les assets vectoriels flat sans les deformer ni les rasteriser.
- Les formes restent nettes, les contours propres, la palette preservee.
- Mouvement genere : houle, voiles qui gonflent, reflets eau — naturel et credible.
- **Regle** : cfg_scale 0.3-0.4 pour flat design/vector. cfg_scale 0.5-0.6 = trop creatif, risque de deformation de style.

## Cadrage image source pour Kling (critique)

- Kling n'invente pas de contenu hors-champ. Il anime ce qui est dans l'image.
- Si un element est coupe dans l'image source → il sera coupe dans la video.
- **Validation obligatoire avant envoi a Kling** : ouvrir l'image source, verifier que chaque element narratif est entier dans le frame.
- Asset B3-fleet-portrait-v1 rejecte : bateau du premier plan coupe (voile sans coque visible). A regenerer avec cadrage complet.

## Resolution Kling V3

- V3 standard = **720x1280** (pas 1080x1920)
- V3 pro = 1080x1920
- Pour backdrop avec `objectFit: cover` en Remotion : 720x1280 suffisant, upscale invisible a 720p-equivalent.
- Pour plans principaux (visage, personnage central) : preferer V3 pro.

---

## CORRECTION CRITIQUE — Modeles O3 fal.ai (2026-03-13)

**Erreur precedente dans ce fichier : O1 et O3 mal documentes.**

Sur fal.ai, la realite est :

| Endpoint | Description reelle |
|----------|--------------------|
| `fal-ai/kling-video/o3/standard/image-to-video` | **Start frame + End frame** — anime la transition entre deux images cles |
| `fal-ai/kling-video/o3/standard/reference-to-video` | Coherence personnage cross-shots (element binding facial) |

**O1 n'existe pas comme endpoint distinct sur fal.ai** — c'est O3 `image-to-video` qui fait le start/end frame.

**Regle mise a jour** : pour controler debut ET fin d'un clip (ex: Dolly In du plan large vers gros plan) → utiliser **O3 `image-to-video`** avec `start_image_url` + `end_image_url`.

---

## Beat04 — Learnings session 2026-03-13

### Tentatives et resultats

| Version | Endpoint | cfg | Image source | Resultat |
|---------|----------|-----|--------------|---------|
| O3 ref-v1 | o3/reference-to-video | 0.35 | trone vide | Pop/morphing au debut (O3 compose le perso sur scene vide = INTERDIT) |
| O3 ref-v2 | o3/reference-to-video | 0.35 | roi assis v2 | Pas de pop. Mais STATIQUE — quasi aucun mouvement |
| V3 v1 | v3/standard/i2v | 0.35 | roi assis v2 | Mouvement present. Roi soupire / tete inclinee (emotion melancolique) |
| V3 v2 | v3/standard/i2v | 0.4 | roi assis v2 | Dolly In present. Particules dorees. Mouvement OK mais particules trop "Disney" |

### Regles apprises Beat04

12. **O3 reference-to-video = coherence cross-shots, PAS l'animation** — pour animer un personnage plat statique, V3 est superieur. O3 ref preservera l'identite mais livrera peu de mouvement.
13. **O3 image-to-video (start+end frame) = VALIDÉ Beat04 session 5** — start frame (roi plan large) + end frame Gemini multimodal (gros plan barbe cohérente) → O3 interpole un dolly in cinématique propre. Résultat : "quasiment parfait" (Aziz). Applicable aussi à Beat01 (Afrique plan large → zoom Mali).
14. **Prompt "breathing + head tilt" = soupir melancolique** — Kling interprete "tilt" comme decouragement sur un personnage immobile. Supprimer du prompt.
15. **Dolly In via prompt (V3)** = fonctionne. Deplacer le dynamisme vers la CAMERA plutot que le personnage pour eviter les emotions par defaut.
16. **cfg_scale 0.4 V3 flat design personnage** = bon compromis. 0.35 = trop sobre, 0.5+ = style drift.
17. **Particules dans spotlight** = trop visible a 0.4, effet "Disney". A reduire ou supprimer du prompt.
18. **Plan frontal symetrique = emotion melancolie par defaut Kling** — la symetrie evoque la reflexion/tristesse. Recommandation Gem : vue 3/4 ou contre-plongee. Mais attention : Beat02 est deja en 3/4 profil — risque de ressemblance. Le trone (absent de Beat02) est la cle de distinction.

### Prochaine tentative recommandee Beat04

Utiliser **O3 `image-to-video`** avec :
- `start_image_url` = `beat04-name-scene-v2.png` (roi plan large, trone entier)
- `end_image_url` = nouvelle image Gemini (gros plan roi, visage + haut du buste, expression autorite)
- Prompt : "Slow powerful Dolly In. King remains still, eyes blink once slowly with authority. Flat 2D style preserved."
- negative_prompt : "sad, melancholic, sighing, head tilt, particles, photorealistic"
- cfg_scale : 0.4

---

## LECON CRITIQUE — Regeneration Kling (validee 2026-03-14)

**Contexte** : Beat01 genere a 10s alors que le beat audio V5 dure 13.6s.

**Decouverte** : Regenerer un clip Kling O3 avec EXACTEMENT les memes parametres (meme start frame, meme end frame, meme prompt, meme cfg) mais une duree differente donne un resultat **quasiment identique visuellement**.

- Meme trajectoire de camera
- Meme style flat design preserve
- Meme ambiance chromatique
- Resultat valide par Aziz : "J'ai du mal a voir la difference avec l'ancien"

**Implication strategique** : Si un clip est bien mais trop court, **regenerer a la bonne duree** plutot que bricoler un SVG overlay. La technique O3 start+end frame est deterministe a ~95% — les parametres fixes produisent des resultats coherents.

**Script de reference** : `scripts/generate-beat01-14s.py` (pattern reutilisable)

**Cas ou la regeneration PEUT echouer** : si le mouvement original etait "chanceux" (improbable, non deterministe). Dans ce cas seulement, essayer un SVG overlay — mais tester la regeneration en PREMIER.

---

## TEST VALIDE — Amanirenas portrait V3 Pro (2026-03-15)

### Paramètres
- Modèle : `fal-ai/kling-video/v3/pro/image-to-video`
- Image source : `tmp/brainstorm/01-amanirenas-portrait.png` (Gemini 3.1 Flash, semi-réaliste)
- cfg_scale : 0.4
- Durée : 5s, aspect 9:16

### Résultat : EXCELLENT
- Dolly in progressif propre (plan large → gros plan visage)
- Style illustré 100% préservé — aucun glissement photoréaliste
- Clignement d'yeux naturel, mouvement de vêtements, sable/poussière animés
- Expression constante (autorité, pas mélancolie) — règle #18 respectée
- **Référence** : `tmp/brainstorm/references/amanirenas-v3pro-5s.mp4`

### Seul artefact
- Mèche de cheveux noirs visible côté gauche du headdress (frame 5) — Kling a interprété "wind moves a few strands of hair" littéralement malgré le headdress rigide
- **Correction** : ajouter `"no loose hair, hair fully covered by headdress"` dans negative_prompt

### Règle ajoutée (#19)
**V3 Pro = modèle de référence pour portraits semi-réalistes avec visage central.**
- V3 standard = 720p suffisant pour décors/cartes
- V3 Pro = obligatoire pour plan principal visage (1080x1920, détails faciaux préservés)

### DEFAUT CRITIQUE — Amanirenas V3 Pro (découvert post-session 2026-03-15)

**Problème :** Amanirenas était borgne (œil droit fermé/cicatrisé — fait historique). Kling V3 Pro a "corrigé" l'œil vers une expression neutre avec les DEUX yeux ouverts en fin de clip.
**Clip concerné :** `references/amanirenas-v3pro-5s.mp4` — **A NE PAS UTILISER EN PRODUCTION**
**Raison :** Effacer la cécité d'Amanirenas = erreur historique majeure + perte du trait distinctif du personnage.

**Règle #33 — Traits physiques historiques distinctifs = negative_prompt obligatoire**
Pour tout personnage avec un trait physique narratif (cicatrice, cécité, amputation, marque) :
- Le décrire explicitement dans le negative_prompt : `"open right eye, both eyes open, healed scar"`
- Le renforcer dans le positive prompt : `"right eye permanently closed, battle scar, one-eyed queen"`
- Tester sur un clip court AVANT de valider le clip de production
- Ne jamais supposer que Kling "respecte" l'image source sur les traits inhabituels — il les "normalise"

**Correction à faire pour Amanirenas portrait :**
- Régénérer avec negative_prompt : `"open right eye, both eyes open, healed eye, symmetrical face"`
- Positive prompt : `"right eye permanently closed by battle scar, powerful one-eyed queen, scarred face"`
- Même paramètres sinon : V3 Pro, cfg 0.4, 9:16

### DEFAUT ETENDU — Clips vivid_shapes Amanirenas aussi invalides (2026-03-15)

**Constat :** Les clips O3 vivid_shapes (V1 8.7/10, V2A PREFERRED) montrent également deux yeux ouverts avant que la reine se retourne.
**Cause racine : l'image source Recraft avait déjà deux yeux ouverts.** Ce n'est pas Kling — Kling anime fidèlement la source.

**Statut tous les clips Amanirenas actuels :**
- REFERENCE TECHNIQUE UNIQUEMENT — prouvent que le mouvement, l'orbit, l'army reveal sont possibles
- INVALIDES pour production finale — œil historique absent de toutes les sources

**Règle #34 — Le défaut vient toujours de l'image source**
Kling est fidèle à ce qu'il reçoit. Pipeline de validation obligatoire pour personnages historiques :
1. Générer l'image source (Gemini ou Recraft)
2. **Inspecter visuellement le trait distinctif AVANT d'envoyer à Kling**
3. Si absent ou incorrect → régénérer l'image source, pas le clip Kling
4. Ne jamais valider un clip Kling sans avoir d'abord validé l'image source

**Checklist Amanirenas — à valider sur CHAQUE image source avant Kling :**
- [ ] Oeil droit : fermé/cicatrisé (jamais les deux yeux ouverts)
- [ ] Peau noire nubienne profonde (pas éclaircie)
- [ ] Coiffe/couronne nubienne (pas égyptienne)

---

## TEST VALIDE — Hannibal Alps V3 Pro (2026-03-15)

### Paramètres
- Modèle : `fal-ai/kling-video/v3/pro/image-to-video`
- Image source : `tmp/brainstorm/04b-hannibal-alps-v2.png` (Gemini 3.1 Flash, semi-réaliste)
- cfg_scale : 0.45
- Durée : 5s, aspect 16:9

### Résultat : EXCELLENT
- Rotation de tête frame 1 (frontal) → frame 5 (profil 3/4 gauche vers horizon) — parfaite
- Cape violette claque naturellement dans le vent sur toute la durée
- Éléphant calme, vapeur de trompe frame 4, pas de charge
- Soldats restent silhouettes fixes en fond
- Style illustré 100% préservé
- Brouillard/neige dramatique au début qui s'éclaircit — effet atmosphérique bonus
- **Référence** : `tmp/brainstorm/references/hannibal-v3pro-5s.mp4`

### Notes V2 (si on produit ce sujet)
- Ajouter micro-mouvement soldats silhouettes (vivants mais discrets)
- Éléphant qui avance légèrement (pas charge — pas de pas)
- Bouche d'Hannibal légèrement animée pour justifier le souffle visible
- Negative prompt à ajouter : `"static mouth, frozen face"`

## TEST — Recraft vivid_shapes flat → Kling V3 Standard (2026-03-15)

### Paramètres
- Image source : Recraft V3 `vivid_shapes` → sips PNG 1365x1024
- Modèle : `fal-ai/kling-video/v3/standard/image-to-video`
- cfg_scale : 0.4, durée : 5s, 16:9
- **Pas de end frame** — génération libre

### Résultat : MITIGÉ mais instructif
- Style flat préservé en début de clip, morphing progressif vers plus de détails (éléphant, montagnes)
- Kling a inventé une narration autonome : Hannibal se retourne vers ses troupes — rotation 360° réussie
- Séparation des plans (personnage/éléphant/montagne) correcte grâce aux blocs contrastés vivid_shapes

### Leçons (#20, #21, #22)

**#20 — Kling interprète le flat design comme une esquisse à "finir" (remplissage sémantique)**
Formes plates simples → Kling ajoute progressivement textures, volumes, détails — morphing visible.
Confirmé par Gemini : il est entraîné sur des vidéos réelles, son réflexe = "compléter vers le réalisme".

**#21 — vivid_shapes = meilleur substyle Recraft pour Kling (plans séparés)**
Les blocs couleur très contrastés permettent à Kling de séparer les plans spatiaux (personnage / animal / décor).
C'est cette séparation qui a rendu la rotation 360° possible sans start/end frame.

**#22 — Pipeline correct pour flat design → Kling sans morphing**
- Utiliser **O3 start+end frame** (pas V3 libre) — contraindre le chemin visuel
- End frame = même style, même personnage, position finale souhaitée (ex: tête tournée)
- cfg_scale **0.35** (pas 0.4) — moins de liberté créative
- V3 **Pro** (pas standard) — meilleure résolution, moins de compression
- Bonus : ajouter un léger grain/texture à l'image source avant Kling pour signaler "le niveau de détail est déjà suffisant"

## TEST VALIDE — O3 start+end frame Recraft vivid_shapes flat design (2026-03-15)

### Contexte
- Start frame : `hannibal-recraft-v3-vivid.png` (Recraft V3 vivid_shapes, palette bronze/bleu)
- End frame : `hannibal-recraft-endframe-v1.png` (meme style_id custom, Hannibal de dos regardant l'armee, teinte verte)
- Modele : `fal-ai/kling-video/o3/standard/image-to-video`
- cfg_scale : 0.35, duree : 5s, 16:9
- **Reference** : `tmp/brainstorm/hannibal-o3-startend-5s.mp4`

### Scores Kimi (8.5/10 — APPROVE)

| Critere | Score | Notes |
|---------|-------|-------|
| Style flat preserve | 9/10 | Zero photoréalisme, cfg 0.35 efficace |
| Transition palette | 9/10 | Bronze/bleu → vert lu comme changement d'altitude/environnement |
| Morphing | 8.5/10 | Rotation propre, cape acceptable, soldats fluides |
| Camera orbit | 9/10 | Parallaxe correct, horizon stable |
| Composition | 9/10 | Hannibal a echelle constante, vallee emerge proprement |

### Lecons (#23, #24, #25)

**#23 — O3 start+end frame VALIDE pour flat design Recraft (pipeline definitif)**
Template : Recraft V3 vivid_shapes → style_id → end frame coherente → O3 cfg 0.35 5s
Zero morphing, style graphic 100% preserve. Generaliser a Abou Bakari II et autres sujets historiques flat.

**#24 — Dissonance palette start/end = reinterpretee narrativement par O3**
Start bronze/bleu + end vert → Kling interprete comme changement d'altitude/environnement, pas comme bug.
Le style_id Recraft ne garantit pas la coherence chromatique cross-frames (chaque frame est generee independamment).
Accepter la dissonance OU corriger en post (Remotion color grading).

**#25 — Style_id Recraft pour coherence cross-frames (valide)**
`mcp__recraft__create_style` depuis une image existante capture l'esthetique flat graphic.
Resultat : composition coherente, memes formes bold, meme style graphic.
Limite : ne garantit PAS la coherence de palette de couleurs exacte (verts vs bleus/bronze).
Usage optimal : coherence FORMELLE (shapes, style) sans exiger coherence CHROMATIQUE exacte.

---

## TEST VALIDE — Amanirenas O3 vivid_shapes 9:16 (2026-03-15)

### Parametres
- Start frame : `references/amanirenas-recraft-vivid-startframe.png` — reine de face, armee nubienne, pyramides, or/marine
- End frame : `references/amanirenas-recraft-vivid-endframe.png` — reine de dos, lance levee, armee des deux cotes (meme style_id)
- Modele : `fal-ai/kling-video/o3/standard/image-to-video`
- cfg_scale : 0.35, duree : 5s, 9:16
- Score Kimi : **8.7/10 — APPROVE** (superieur a Hannibal 8.5)
- **Reference VALIDEE par Aziz** : `references/amanirenas-o3-vivid-VALIDATED.mp4`

### Points forts
- Orbit 3D ~180 naturel et cinematique
- Army reveal en fin de clip = exceptionnel (multiplication echelle)
- Palette or/marine 100% preservee — zero derive chromatique (meilleur que Hannibal)
- Kling a invente un transfert de lance main gauche → droite pendant le 360 (resolution contrainte physique)
- Background pyramides statique = ancrage geographique stable, intentionnel

### Lecons (#26 a #29)

**#26 — O3 resout les contraintes physiques de maniere autonome**
Transfert d'objet d'une main a l'autre pendant un orbit 360 = Kling invente une solution narrative coherente.
Ce n'est pas du morphing — c'est de la narration physique. Ne pas contrer avec negative_prompt.

**#27 — Morphing fin de clip = end frame trop eloignee de l'etat intermediaire**
Soldats qui "remontent" vers le haut = end frame avec soldats plus haut que la position naturelle de mi-parcours.
Solution : end frame avec elements dans une position accessible depuis la trajectoire naturelle.
Eviter les sauts de position trop grands entre milieu de clip et end frame.

**#28 — 5s trop court pour orbit 360 + army reveal complet**
Le mouvement se precipite en fin de clip. Regle : orbit + reveal + pause finale = minimum 8s.
Toujours appliquer la duree exacte du beat audio — jamais limiter a 5s sur ce type de scene complexe.

**#29 — Background statique vivid_shapes = force narrative, pas bug**
Elements geographiques fixes (pyramides, montagnes) pendant le 360 = ancrage lisible et intentionnel.
Ne pas demander des animations de fond "bonus" dans le prompt — ca dilue la lisibilite geographique.

## LECON CRITIQUE — End Frame O3 : ne jamais forcer les elements narratifs (valide 2026-03-15)

**Contexte** : V2B testee avec end frame "corrigee" (soldats visibles uniquement en bas du cadre) sur 10s.
**Resultat** : V2B 6.2/10 — inferieur a V1 5s (8.7/10). V2A 8s = 7.2/10.

**Lecon #30 — L'armee, Kling l'invente de lui-meme. Ne pas la forcer dans l'end frame.**
Dans V1, l'army reveal en fin de clip etait GENERE par Kling spontanement, non dicte par l'end frame.
Forcer les soldats dans l'end frame = Kling tente de les amener de l'end frame vers le debut → mouvement contre-naturel.
Regle : end frame = sujet principal seul dans sa pose finale. Les elements secondaires (armee, foule, decor) = Kling les invente.

**Lecon #31 — Allonger la duree N'AMELIORE PAS le morphing O3 flat design.**
Hypothese testee : 8s vs 5s = moins de compression du mouvement → moins de morphing.
Realite : 8s expose le morphing sur plus de frames. Le morphing visible = trajectoire entre frames, pas la vitesse.
Pour reduire le morphing O3 : rapprocher l'end frame de l'etat intermediaire naturel (pas allonger la duree).

**Lecon #32 — "Moins est mieux" pour les end frames O3 vivid_shapes.**
End frame optimale = sujet + fond epure + pose finale nette.
INTERDIRE : soldats en bas du cadre, foule partielle, elements coupe.
AUTORISER : pose finale du personnage + fond minimal coherent avec le style.
Kling comple le reste autonomement — et le fait mieux qu'une end frame surchargee.

**Verdict final session V2** : V2A (8s) prefere par Aziz visuellement malgre score Kimi 7.2.
Raison : pyramides + nuages animes par Kling, 360 plus complet, mouvement naturel.
Kimi sous-evalue les benefices narratifs de la duree etendue.
Regle : faire confiance a l'oeil d'Aziz sur la duree — score Kimi = reference, pas verdict absolu.
Note : start frame surchargee (soldats en bas) = gache le depart. Prochaine version = reine seule.

---

## Prochains tests à faire

- [x] Beat04 O3 start+end frame — VALIDE. `beat04-o3-startend-v1.mp4` (5s, parfait visuellement)
- [x] Beat01 regenere a 14s — `beat01-o3-pan-B-14s.mp4` VALIDE. Quasiment identique au 10s.
- [x] Beat02 regenere 12s — `beat02-o3-westlook-v1.mp4` VALIDE. Dolly-in + tete vers l'ouest + profil gauche. INTEGRE.
- [x] Deux end frames testees Beat02 : westlook-v3 (profil gauche pur) vs westlook (portrait 3/4 frontal). V1 retenue.
- [ ] Beat03 : asset fleet 9:16 cadrage complet → Kling V3 cfg 0.4 ou SVG Remotion pur
- [ ] Beat04 régénérer 15s — même paramètres O3, `duration: "15"`
- [ ] Vérifier Motion Brush (static_mask_url) pour figer zones décoratives (Peste 1347)

## Lecon : End Frame — Decrire le resultat visuel, pas l'angle de rotation (valide 2026-03-14)

**Probleme** : Gemini ignore "turn head 45 degrees LEFT" et produit une vue quasi-frontale.
**Solution** : Decrire CE QUE LA CAMERA VOIT, pas le mouvement du sujet.

- INTERDIT : "turn his head 45 degrees to the left"
- CORRECT : "LEFT SIDE PROFILE view — like a coin or medal portrait where we see the face from the side"

Valide sur `beat02-endframe-westlook-v3.png` : profil gauche correct obtenu au 3e essai avec cette formulation.
Generaliser ce pattern pour toutes les end frames avec rotation de tete.

---

## TECHNIQUE O3 MULTI-SHOT — Image source unique, shots structures dans le prompt (valide Beat04 session 12, 2026-03-15)

### Principe

**O3 multi-shot n'est PAS un parametre API** — les shots se structurent en texte dans le champ `prompt` standard.
Format : "Shot 1 (0-6s): [description + camera]. Shot 2 (6-11s): [description + camera]. Shot 3 (11-15s): [description]."

### Quand utiliser

| Besoin | Technique |
|--------|-----------|
| Transition cinematique entre 2 images cles | O3 `image-to-video` avec `start_image_url` + `end_image_url` |
| Mouvement narratif complexe en 3 phases depuis 1 image | O3 `image-to-video` avec `image_url` + multi-shot textuel dans le prompt |
| Scene dynamique depuis image unique (flotte, plan large) | Multi-shot textuel dans prompt (cette session) |

### Regle critique — Image source "deja dans la scene"

L'image source DOIT representer l'etat initial du premier shot. Jamais de rive/plage/sol dans l'image si le premier shot est cense etre en mer. Kling extrapole : si l'image contient un indice de sol = il invente du sol dans les premiers frames.

- **CORRECT** : image deja en pleine mer, bateaux flottant, horizon oceanique
- **INTERDIT** : image avec rive/sable/sol meme en coin, meme marginal

### Regle critique — Posture des personnages

Chaque element mal positionne dans l'image source = Kling l'amplifie.
- Bras legerement ouverts dans l'image → Kling les eleve en "pose prophetique" bras en croix
- Rameurs qui regardent vers l'arriere → Kling cree des conflits de direction dans l'animation
- **Regle** : tous les personnages doivent etre dans la POSTURE FINALE attendue dans l'image source

### Regle cfg_scale pour O3 flat design

- `cfg_scale 0.4` = standard prouve sur O3 flat design
- cfg > 0.5 = risque de texture organique, "realisme" involontaire
- cfg < 0.35 = trop libre, hallucinations possibles

### Negative prompt anti-artefacts O3 personnages

```
"fast zoom, rapid camera movement, shaking camera,
raised arms, standing passengers, shore, beach, sand, land,
text, watermark, spotlight, light beam, bright colors,
morphing faces, distorted boats, white sails"
```

### Bonus cinematique — Reflet dans l'eau

Kling O3 ajoute spontanement des reflets de personnages dans l'eau quand la scene est nocturne + personnage debout + eau sombre. Ce n'est pas demande = bonus narratif gratuit. Ne pas mettre dans le negative_prompt.

### Script de reference

`scripts/generate-beat04-kling-v2.py` — pattern multi-shot O3 complet, reutilisable.

---

## Règles image source pour O3 scenes narratives (synthese 2026-03-15)

1. **Image "deja dans la scene"** : l'etat initial DOIT etre l'etat final voulu du shot 1. Pas de transition presente dans l'image source (ex: pas de rivage si la scene est censee etre en mer au debut).
2. **Bras du personnage le long du corps** : bras ouverts → Kling amplifie → bras leves. Toujours vérifier la posture.
3. **Tous les personnages faces dans la meme direction** : conflits de direction → animation incoherente.
4. **Pas de voiles SVG symboliques** : les petits triangles blancs Gemini "pirogues stylisees" → Kling ne comprend pas = morphing ou abandon. Utiliser des pirogues completes ou supprimer entierement.
5. **Validation image source avant Kling = obligatoire** : demander validation Aziz AVANT de lancer le job. Cela evite de brûler des credits sur une mauvaise image source.

# Key Learnings — Remotion / Video Production
> Format : fait + regle concrete. ~300 lignes. Details session-specifiques supprimes.

---

## Recraft — Personnages & Assets SVG

### Traits distinctifs (oeil ferme, cicatrice)
- `image_to_image` corrige les anomalies faciales (rouvre les yeux). Utiliser `generate_image` (sans image source) + Style ID + prompt renforce ("completely sealed shut", "non-negotiable facial feature").
- Generer 3 variantes (`numberOfImages: 3`) — au moins 1/3 respecte le trait.
- Preferer les traits graphiques simples (paupiere plate fermee) aux traits complexes (cicatrice detaillee) — Kling deforme moins les formes simples.

### SVG vers PNG (NON-NEGOTIABLE)
- Recraft MCP genere des SVG — Kling n'accepte PAS les SVG.
- Convertir via `rsvg-convert` : `/opt/homebrew/bin/rsvg-convert -w 1024 -h 1365 input.svg -o output.png`
- Tailles standard : portrait 1024x1365, paysage 1820x1024, carre 1024x1024.

### Pipeline Recraft pour personnages historiques
1. `create_style()` avec image reference → Style ID permanent
2. `generate_image()` + Style ID + prompt renforce → 3 variantes
3. Selectionner la variante correcte → convertir SVG→PNG
4. Plans larges → `image_to_image` depuis la reference. Plans portrait → `generate_image` + Style ID (jamais i2i).

### Recraft V4 SVG — Limites
- SVG monolithiques sans IDs semantiques (`path1`, `path2`). Impossible d'animer les elements independamment.
- **Utile pour** : assets autonomes (pirogue, icone), elements decoratifs statiques.
- **Inadapte pour** : scenes multi-elements animables. Alternative : D3/TopoJSON + paths SVG codes.

### Formats portrait
- `recraftv4_vector` / `recraftv4_pro_vector` : carre uniquement.
- `recraftv3_vector` : supporte `1024x1707` (~9:16). Seul modele vector utilisable en portrait.

### Vivid_shapes = outil de direction, pas de production finale
- Images Recraft vivid_shapes semblent ordinaires isolement. Kling les eleve en clips exceptionnels.
- L'image source est une intention — Kling cree la scene entre les deux frames.

---

## Gemini — Correction chirurgicale

### Principe
Ne pas regenerer depuis zero pour un defaut mineur. Gemini 3.1 Flash pour edit chirurgical precis.

### Capacites prouvees
- Supprimer bande parasite, restaurer couleur, ajouter trait facial, retourner personnage face→dos.
- Densifier armee, corriger zone noire, etalonnage couleur, ajout handlers.
- Edit pixel-perfect : `Part.from_bytes()` + "keep IDENTICAL except ONE change".

### Regles modele
- **Edition chirurgicale** : `gemini-3-pro-image-preview` OBLIGATOIRE (respecte la composition).
- **Flash** (`gemini-3.1-flash-image-preview`) : regenere tout — eviter pour corrections, OK pour generation.
- Config : `responseModalities: ["image", "text"]` — NE PAS mettre `responseMimeType`.
- Instruction efficace : decrire EXACTEMENT ce qu'on change + lister ce qu'il ne faut PAS toucher.

### Limites
- Pas de seed expose dans l'API publique, pas de style ID.
- L'image source elle-meme EST le seed — la conserver = pouvoir regenerer des variantes coherentes.
- Postures de personnages minuscules : resultat subtil. Accepter et laisser Kling animer via prompt.
- Excelle sur les changements de perspective (vue sol → vue aerienne).

---

## Methode Nano Banana — Modification chirurgicale d'asset

### Workflow (2 etapes)
1. **Extraction JSON** (`gemini-2.0-flash`, gratuit) : analyser image → JSON decrivant style, elements, atmosphere.
2. **Modification + Regeneration** (`gemini-3-pro-image-preview` OBLIGATOIRE) : modifier 1 champ JSON + renvoyer image originale + JSON modifie.

### Regles
- Passer l'image originale EN PLUS du JSON modifie — sans elle, la composition change.
- Modifier 1 seul champ a la fois — plus de changements = plus de derive.
- Usage : variantes d'assets existants (couleur, heure, eclairage) — PAS pour generer from scratch.

---

## Frame Chaining — Sequences Kling

### Principe
Ne pas regenerer les frames de transition. Extraire la derniere frame d'un clip valide → retoucher via Gemini → utiliser comme start frame du clip suivant.

### Workflow
```
Clip N valide
  → ffmpeg -sseof -0.1 -i clip.mp4 -vframes 1 -update 1 frame.png
  → Gemini edit chirurgical (posture, angle)
  → Frame resultante = start frame clip N+1
  → Gemini edit pour end frame clip N+1
  → Lancer Kling O3 avec start + end frame
```

### Regle ecart start→end
- Garder start et end dans le MEME espace visuel (meme angle, meme distance camera).
- Changer UN seul element. Si ecart trop grand → Kling improvise → artefacts.
- End frame TOUJOURS genere depuis le start frame exact via Gemini ("garder tout identique, ajouter seulement X").

---

## Kling — Regles de production

### Images source
- **JAMAIS de texte** dans l'image source — anime/deforme a 5s+.
- **cfg_scale** : 0.3 = stable (moins de morphing), 0.4 = plus creatif. C'est l'adherence au prompt, PAS l'intensite mouvement.
- **Plan moyen obligatoire** (sujet 50-55% du cadre) pour tout mouvement camera. Sujet a 90% = mouvement flottant.
- **Cadrage valider AVANT envoi** : element coupe dans l'image source = coupe dans le clip.
- Supprimer TOUS les elements decoratifs de coin (medaillons, arabesques) → Kling les anime → artefacts.

### Physique implicite
- Kling distingue elements "physiques" (anime selon physique de scene) vs "decor fixe" (preserve statique).
- Zone neutre en haut (ciel, espace) = zone texte stable gratuite pour overlay Remotion.
- Kling ajoute spontanement : ombres portees, reflets eau, criniere animee. Ne pas bloquer dans negative_prompt.
- Camera qui avance vers des dos = derive semi-realiste. Fix : cfg_scale 0.45 ou end frame plus schematique.

### Multi-shot prompt
Format structuré dans le prompt standard (pas un parametre API) :
```
Shot 1 (0-6s): Visual: [description]. Camera: [mouvement].
Shot 2 (6-11s): Visual: [description]. Camera: [mouvement].
```

### Morphing et duree
- O3 sur flat 2D : stable 0-6s, morphing progressif apres. Couper avec `durationInFrames` dans Remotion.
- Regenerer avec memes parametres + duree differente = ~95% deterministe (meme trajectoire camera).

### Technique `elements` (references personnages)
- Fournir images de reference via `elements: [{frontal_image_url, reference_image_urls}]`.
- Verrouille : silhouette globale, ton couleur dominant, style graphique, cohesion visuelle.
- NE verrouille PAS : forme d'objets (bouclier rond→carre), couleur vetements si start frame dicte autre chose, prise en main d'objets.
- Crop de reference : contenir UNIQUEMENT l'info a transmettre. Couleur en peripherie = contamination sur tout le clip.

### Endpoints fal.ai (valides 2026-03-16)
- `fal-ai/kling-video/v3/pro/image-to-video` — portraits cinematiques
- `fal-ai/kling-video/v3/standard/image-to-video` — scenes symboliques, economique
- `fal-ai/kling-video/o3/standard/image-to-video` — scenes epiques, start+end frame
- V3 Std cfg 0.3 + "static locked shot" = vie microscopique sans morphing (ideal scenes symboliques).
- V1.5/V1.6 = DEFUNCT.

---

## ElevenLabs TTS — Regles francais

### Prononciation
- **Participes passes en "e"** : ElevenLabs drop les accents finaux ("surpeuple" au lieu de "surpeuple"). Eviter tous les participes passes en "e" ou les reformuler.
- **Accents obligatoires** dans le script Python : "hante" sans accent → prononce "hant". Toujours ecrire e, e, e, o, a, u.
- **Chiffres** : ecrire en toutes lettres ("treize cent onze", pas "1311").
- **Liaisons** "ont + voyelle" → liaison bizarre. Remplacer par passe simple ("firent escale").
- **Noms de villes** avec "s" final : ecrire sans s ("A Londre,") pour eviter liaison forcee.
- **Majuscules INTERDITES** : artefacts garantis, voix qui grince. Emphase = ponctuation (tirets, points de suspension).

### Tags TTS (ElevenLabs V3 + Fish Audio S2)
| Tag | Verdict |
|-----|---------|
| `[pause]` / `[long pause]` | Fiable. `[long pause]` = ~1.5-2s. |
| `[sad]` | Fiable |
| `[whispering]` | Aleatoire (1/2). Tester et regenerer. |
| `[sighing]` | Neutre (respiration, pas vrai soupir) |
| `[panting]` / `[soft]` | Eviter / Ignore |
| `<break time="Xs" />` | NON SUPPORTE en V3. Utiliser `[pause]`. |
- Emotion contextuelle sans tag souvent meilleure que tags explicites.

---

## Remotion — Animation & Timing

### spring() vs interpolate()
- `spring()` = physique (rebond, inertie). Pour entrees, impacts, apparitions.
- `interpolate()` = lineaire/courbe. Pour progressions continues (opacite, position).
- Spring s'applique a l'animation interne, jamais au startFrame cale sur audio.

### Mouvement masse lourde
1. `interpolate` lineaire de f0 a ARRIVE_END (vitesse constante)
2. `spring({ damping: 14, stiffness: 35 })` decale de ARRIVE_END (freinage visible)
3. Combiner : `x = frame < ARRIVE_END ? linear : braking`

### Audio sequentiel
- `<Audio delay={n}>` N'EXISTE PAS. Pattern correct : `<Sequence from={n}><Audio startFrom={0} /></Sequence>`.
- Chaque piste audio sequentielle dans son propre `<Sequence>`.

### OffthreadVideo + Kling
- `<Video>` INTERDIT en headless render → frames noires. Toujours `<OffthreadVideo>`.
- DOIT etre dans `<Sequence from={beatStart}>` — sinon frame absolu depasse duree clip = freeze.
- Toujours `muted` — Kling genere toujours une piste audio parasite.

### beatFade + OffthreadVideo
- `beatFade` (opacity 0→1) + `OffthreadVideo` sur fond noir = double assombrissement = ecran noir ~20 frames.
- Fix : retirer opacity de l'AbsoluteFill. Le clip Kling demarre deja sur fond noir.

### Split screen
- `clipPath: inset()` ne fonctionne pas avec `OffthreadVideo`. Solution : `div overflow:hidden` + offset negatif sur la video.

### Audio volume partiel
```tsx
<Audio src={...} volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
```

### SVG inline JSX (Recraft)
- `<Img src="fichier.svg">` = statique. `<use href>` = CORS-bloque en headless.
- Solution : script Node.js pour convertir SVG en JSX inline. Extraire groupes, animer avec spring/sin.
- `backgroundColor` OBLIGATOIRE sur `AbsoluteFill` (fond blanc en headless Puppeteer sinon).
- `preserveAspectRatio="xMidYMid meet"` (jamais `none`).

### SVG viewBox 9:16
- Asset 16:9 dans canvas 9:16 perd ~80% du contenu. Generer les assets NATIVEMENT en 9:16.
- Texte overlay : SVG separe avec `viewBox="0 0 1080 1920"`, jamais dans le meme SVG que le backdrop.
- `<img>` SVG seul comme element principal = PowerPoint. Interdit.

### Pipeline SVG anime → Remotion
- Toute animation DOIT etre pilotee par `useCurrentFrame()`. CSS/SMIL ne s'executent pas en headless.
- < 10 elements : strip CSS + spring/interpolate (30-60 min).
- >= 10 elements : Anime.js hook (paused + seek).
- Lottie : `@remotion/lottie` UNIQUEMENT (pas `lottie-react`). Hack couleurs possible dans le JSON (`[r,g,b]` normalise 0-1).

---

## Geo Visual Effects — Techniques validees

> Reference implementee : `src/projects/style-tests/GeoAdvancedV2.tsx`

| Technique | Usage | Code cle |
|-----------|-------|----------|
| Hachures SVG (`<pattern>`) | Zone de menace, territoire dispute | `patternTransform={rotate(45 + frame*0.3)}` |
| Vignette (radialGradient) | Focalisation, tension, nuit | `vigOpacity = interpolate(frame, [50,150], [0, 0.75])` |
| Zoom CSS fluide | Changement region geo | `translate(target) scale(zoom) translate(-target)` + Easing.inOut |
| Draw-on bordure | Revelation frontiere, routes | `strokeDasharray={PATH_LEN} strokeDashoffset={PATH_LEN*(1-progress)}` |
| Pulse rings cascade | Epicentre, alerte, expansion | `(local - 160) % PERIOD` pour boucle infinie |
| Transition zoom-blur | Saut temporel, cut dramatique | 18 frames optimal, outScale 1→1.12 |

### Regles d'integration
- 1 effet dominant par scene max + eventuellement 1 effet subtil de texture.
- Zoom max sur image raster = 2x (au-dela = pixelisation visible).
- Anti-pattern : D3 re-projection par frame = 8-15ms JS bloquant → saccades.

---

## Images de Reference — Gestion

### Nommage
```
public/assets/geoafrique/characters/[personnage]-[description]-REF.png
```
- Image REF = JAMAIS supprimer. C'est l'equivalent fonctionnel du seed (Gemini n'a pas de seed API publique).
- Pour nouvelle scene : passer la REF comme `Part.from_bytes()` dans Gemini + decrire la nouvelle pose.

---

## Pipeline & Workflow

### Overlay texte
- Texte overlay justifie seulement si l'image est ambigue sans lui.
- Dates et identifications (ex: "1311", nom du personnage) = necessaires.
- Si le visuel raconte deja l'histoire = pas de texte.

### Transitions entre scenes
- Par defaut : coupes franches. Transitions stylisees uniquement apres validation explicite d'Aziz.

### Etalonnage couleur narratif
- Palette chaude (navy + or + etoiles) = humanite, spiritualite.
- Palette froide (gris-bleu + blanc terne) = froideur, mecanique.
- C'est une decision narrative, pas esthetique.

### Ordre narratif
- Suivre l'arc emotionnel du script, pas l'ordre de production des blocs.
- Verifier les repetitions narratives inter-scenes avant assemblage.

### Rabbit hole d'iteration
- Max 3 iterations sur un parametre visuel. Fixer et passer a autre chose.
- Toute nouvelle technique → tester dans sandbox (`EffectsLab.tsx`) avant production.

### Kimi review
- Contextualiser les changements v(n)→v(n+1) dans le brief. Sans diff, Kimi mentionne des problemes deja corriges.
- Score Kimi = reference technique, pas verdict absolu. L'oeil d'Aziz prime.
- Brief Kimi style flat : "Style is intentionally flat geometric — smooth shapes are a feature, not a bug."

### Processus NON-NEGOTIABLE
- Montrer clip Kling + mini-render a Aziz → attendre validation explicite → integrer. Ne jamais integrer avant validation.
- Valider coherence narrative du clip avec le script AVANT de generer. Le script prime toujours.

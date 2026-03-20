# Key Learnings — Remotion / SVG / Production

> Format : fait + raison + règle concrète. Pas de prose.

---

## Recraft — Personnages avec traits distinctifs (œil fermé, cicatrice, anomalie faciale)

### Problème
`image_to_image` avec une image source contenant un œil fermé/cicatrice → Recraft **rouvre systématiquement l'œil** peu importe le strength (testé jusqu'à 0.15) ou le prompt. Le modèle corrige ce qu'il perçoit comme une anomalie.

### Solution validée
Utiliser `generate_image` (sans image source) + Style ID + prompt renforcé avec termes explicites :
- "completely sealed shut", "no pupil visible, just a flat closed lid"
- "non-negotiable facial feature", "battle wound", "permanently closed"
- Générer 3 variantes (numberOfImages: 3) — au moins 1 sur 3 respecte le prompt facial

### Pipeline Recraft pour personnages historiques distinctifs
```
Étape 1 : create_style() avec image référence → Style ID permanent
Étape 2 : generate_image() + Style ID + prompt renforcé → 3 variantes
Étape 3 : Sélectionner la variante avec le trait distinctif respecté
Étape 4 : Convertir SVG → PNG via rsvg-convert (installé : /opt/homebrew/bin/rsvg-convert)
          Commande : rsvg-convert -w 1024 -h 1365 input.svg -o output.png
Étape 5 : Sauvegarder PNG comme référence maître (Kling n'accepte pas les SVG)
Étape 6 : Plans larges (armée, décors) → image_to_image depuis cette référence maître
          Plans portrait (visage) → generate_image + Style ID (jamais image_to_image)
```

### Règle SVG → PNG (NON-NEGOTIABLE)
- Recraft MCP génère des SVG — Kling (fal.ai) n'accepte PAS les SVG
- TOUJOURS convertir via rsvg-convert AVANT d'envoyer à Kling
- rsvg-convert est installé : /opt/homebrew/bin/rsvg-convert (librsvg 2.62.0)
- Tailles standard : portrait 1024x1365, paysage 1820x1024, carré 1024x1024

### Règle pour l'animation Kling
Préférer le trait distinctif **graphique simple** (cache, paupière plate fermée) au trait **complexe** (œil malade, cicatrice détaillée) — Kling déforme moins les formes simples.

### Cas testés
| Personnage | Trait | Méthode qui a fonctionné |
|------------|-------|--------------------------|
| Hannibal Barca | Œil gauche fermé (infection) | generate_image + Style ID `f5063f81-e1e8-4a2e-becc-0895841573a8` — image REF : `public/assets/hannibal test/hannibal-vivid-portrait-REF.svg` |
| Amanirenas | Œil (à tester) | Même pipeline — generate_image + Style ID |

---

## Gemini 3.1 Flash comme outil de correction chirurgicale (2026-03-17, VALIDE)

### Principe
Quand Recraft génère une image avec des défauts mineurs (mauvaise couleur, bande parasite, élément à corriger), **ne pas regenerer depuis zéro**. Utiliser Gemini 3.1 Flash pour un edit chirurgical précis.

### Ce que Gemini peut faire (prouvé en session)
- Supprimer une bande navy parasite → remplacer par mint uniforme avec neige
- Restaurer une couleur spécifique (cape navy → pourpre)
- Ajouter un trait facial (cicatrice diagonale sur œil fermé)
- **Retourner un personnage de face → de dos** en conservant décor, style, couleurs

### Pipeline
```
Recraft génère image avec défaut mineur
  -> Gemini 3.1 Flash edit chirurgical (script : scripts/gemini-edit-hannibal-portrait.py)
  -> PNG corrigé sauvegardé comme REF canonical
  -> Utiliser ce PNG comme source pour Kling ou Recraft image_to_image
```

### Règle modèle
- Endpoint : `gemini-3.1-flash-image-preview:generateContent`
- Config : `responseModalities: ["image", "text"]` — NE PAS mettre `responseMimeType`
- Input : image en base64 inline_data + instruction textuelle précise
- Instruction efficace : décrire EXACTEMENT ce qu'on veut changer + lister ce qu'il ne faut PAS toucher

### Leçon Kling confirmée (même session)
**Le start frame est roi** — Kling corrige spontanément les inconsistances du end frame (couleur cape navy → pourpre) en interpolant depuis le start frame. Le end frame guide la composition finale, pas les couleurs. Priorité : avoir un start frame parfait.

### Capacités Gemini edit prouvées sur styles flat vivid_shapes
| Edit demandé | Résultat | Notes |
|---|---|---|
| Supprimer bande navy → mint uniforme + neige | Parfait | Fidèle à la palette |
| Restaurer couleur cape (navy → pourpre) | Parfait | Hex accepté dans prompt |
| Ajouter cicatrice diagonale œil droit | Bien | Visible au zoom |
| Retourner personnage face → dos | Excellent | Décor 100% préservé |
| Densifier armée + ajouter détails (boucliers, lances, rangées) | Excellent | Style flat strictement respecté, effet de profondeur ajouté |

**Règle générale :** Gemini comprend "même style, plus de détail" — il peut enrichir une zone sans toucher au reste. Instruction clé : lister explicitement ce qu'il NE doit PAS changer.

### Technique "Frame Chaining" pour séquences Kling (2026-03-17, VALIDEE)

**Principe :** Ne pas regénérer les frames de transition depuis zéro. Extraire la dernière frame d'un clip validé, la retoucher via Gemini, et l'utiliser comme start frame du clip suivant.

```
Clip N validé
  -> ffmpeg: extraire dernière frame (ffmpeg -sseof -0.1 ... -update 1)
  -> Gemini: edit chirurgical unique (posture, angle, détail)
  -> Frame résultante = end frame clip N = start frame clip N+1
  -> Gemini: edit pour end frame clip N+1 (vue aérienne, zoom out, etc.)
  -> Lancer Kling O3 avec start + end frame
```

**Pourquoi c'est puissant :**
- Continuité visuelle parfaite entre clips — même source, zéro dérive de style
- Cohérence du personnage garantie sans régénération
- Chaque clip "raccorde" naturellement au suivant
- Kling ne peut pas dériver loin entre deux frames qu'il connaît

**Limites Gemini sur postures de personnages minuscules :**
- Gemini peut modifier la posture des jambes de soldats mais le résultat est subtil à distance
- Pour les modifications de posture fine : accepter le résultat Gemini et laisser Kling animer via prompt
- Gemini excelle sur les changements de perspective (vue sol → vue aérienne)

**Modèle :** `gemini-3.1-flash-image-preview`
**Extraction frame :** `ffmpeg -sseof -0.1 -i clip.mp4 -vframes 1 -update 1 frame.png`

**Règle critique — écart visuel start→end :**
- Garder start et end dans le MÊME espace visuel (même angle, même distance de caméra)
- Changer UN seul élément entre les deux frames (armée apparaît, personnage se retourne, etc.)
- Si l'écart est trop grand : Kling improvise → silhouettes sombres génériques, angle inattendu
- Test de validation : les deux frames côte à côte doivent ressembler à "avant/après" du même plan, pas à deux scènes différentes

**Gemini pour la frame "après" :**
- Demander un edit depuis le start frame exact — "garder tout identique, ajouter seulement X"
- NE PAS générer le end frame from scratch — trop de risque de divergence de cadrage

---

## Gestion des Images de Référence Personnages (règle permanente)

### Principe
Gemini image gen n'a pas de seed exposé ni de style ID dans l'API publique.
L'image générée elle-même EST le seed. La conserver = pouvoir régénérer des variantes cohérentes.

### Règle de nommage
```
public/assets/geoafrique/characters/
  [personnage]-[description]-REF.png     ← image de référence canonique (JAMAIS supprimer)
```

### Personnages GeoAfrique — références actuelles
| Fichier | Description | Utilisé dans |
|---------|-------------|-------------|
| `abou-bakari-roi-plan-large-REF.png` | Roi sur trône, plan large, fond noir | Beat04 start frame, base toutes futures scènes |
| `abou-bakari-roi-gros-plan-REF.png` | Gros plan visage + buste, même personnage | Beat04 end frame |

### Règle d'utilisation
Pour toute nouvelle scène avec Abou Bakari :
1. Passer `abou-bakari-roi-plan-large-REF.png` comme `Part.from_bytes()` dans Gemini
2. Décrire la nouvelle pose/cadrge dans le prompt texte
3. Sauvegarder le résultat dans `characters/` si approuvé comme nouvelle référence

### Ce qui N'existe pas (Gemini)
- Pas de seed exposé dans l'API publique
- Pas de style ID (contrairement à Stable Diffusion)
- Pas de Imagen 3 Subject Customization sans Vertex AI
→ Notre solution : l'image source comme ancre multimodale = équivalent fonctionnel du seed

---

## Pipeline O3 Start+End Frame — Dolly In Cinematique (2026-03-13)

### Problème résolu
Beat04 avait échoué 4 fois en session précédente :
- O3 reference-to-video = quasi statique sur personnage plat
- V3 standard = particules Disney, émotion mélancolique par défaut
- End frame généré sans référence = visage incohérent (pas de barbe)

### Solution validée : 3 techniques combinées

**Technique 1 — End frame Gemini multimodal**
Passer l'image source comme référence dans l'appel Gemini (pas seulement du texte).
```python
response = client.models.generate_content(
    model='models/gemini-3.1-flash-image-preview',
    contents=[
        types.Part.from_bytes(data=ref_bytes, mime_type='image/png'),  # image source
        types.Part.from_text(text=PROMPT),  # description gros plan
    ],
    ...
)
```
**Résultat :** même barbe, même kufi, même teinte de peau entre start et end frame.
**Règle :** Ne JAMAIS générer un end frame avec du texte seul. L'image de référence est obligatoire.

**Technique 2 — O3 image-to-video avec start+end frame**
Endpoint : `fal-ai/kling-video/o3/standard/image-to-video`
Paramètres clés :
```python
{
    "image_url": start_url,       # plan large (roi sur trone)
    "end_image_url": end_url,     # gros plan (visage + buste)
    "prompt": "Slow powerful Dolly In. King remains still, eyes blink once slowly...",
    "negative_prompt": "sad, melancholic, particles, head tilt, photorealistic",
    "duration": "5",
    "aspect_ratio": "9:16",
    "cfg_scale": 0.4,
}
```
**Résultat :** dolly in naturel plan large → gros plan, trône disparaît progressivement, clignement des yeux, zéro particules.
**Règle :** O3 i2v = meilleur pour transitions contrôlées entre deux compositions. V3 = meilleur pour animation d'une image unique.

**Technique 3 — Retirer beatFade sur AbsoluteFill avec clip Kling**
`beatFade` (opacity 0→1) + `OffthreadVideo` sur fond noir = double assombrissement = écran noir au début.
**Fix :** retirer `opacity: op` de l'`AbsoluteFill`. Le clip Kling démarre déjà sur fond noir — pas besoin de fade.
```tsx
// CORRECT — clip Kling demarre sur fond noir nativement
<AbsoluteFill style={{ backgroundColor: PAL.bg }}>
  <OffthreadVideo src={...} muted ... />
</AbsoluteFill>

// INTERDIT — ecran noir pendant ~20 frames
<AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: beatFade(localF, dur) }}>
```

### Fichiers de référence Beat04
- Start : `public/assets/geoafrique/beat04-name-scene-v2.png`
- End : `public/assets/geoafrique/beat04-endframe-v2.png`
- Clip retenu : `public/assets/geoafrique/beat04-o3-startend-v1.mp4`

---

## OffthreadVideo + Kling — Regles CRITIQUES (2026-03-13)

### Bug : clip Kling statique/figé dans le render final
**Symptôme :** clip Kling semble animé dans l'aperçu, mais apparaît statique (dernière frame figée) dans le render MP4.
**Root cause :** `<OffthreadVideo>` sans `<Sequence>` wrapper utilise le frame **absolu** de la composition pour calculer `currentTime`. Si le beat commence à frame 197, `currentTime = 197/30 = 6.57s` → dépasse la durée du clip (5s) → freeze sur dernière frame.
**Fix obligatoire :** envelopper chaque beat Kling dans `<Sequence from={BEATS.xxx.start}>`. Le frame local commence alors à 0 → `currentTime = 0s` → clip joué correctement.
```tsx
// CORRECT
<Sequence from={BEATS.empire.start}>
  <Beat02Empire />
</Sequence>

// INTERDIT — Beat02 commence frame 197, clip freeze immédiatement
<Beat02Empire />
```
**Règle :** Tout composant contenant un `<OffthreadVideo>` DOIT être dans une `<Sequence from={beatStart}>`.

### Bug : audio Kling parasite dans le render final
**Symptôme :** sons de respiration, vagues, ambiance dans le MP4 final alors qu'on veut seulement la voix-off.
**Root cause :** Kling génère toujours une piste audio dans ses clips (même sans le demander). `<OffthreadVideo>` sans `muted` encode cet audio dans le render.
**Fix :** toujours mettre `muted` sur `<OffthreadVideo>` pour les clips Kling.
```tsx
<OffthreadVideo src={...} startFrom={30} muted style={...} />
```

### Video vs OffthreadVideo
- `<Video>` : fonctionne uniquement en preview navigateur. En headless render = frames statiques/noires.
- `<OffthreadVideo>` : obligatoire pour tout render headless (`npx remotion render`). Décode frame par frame.
- **Règle absolue :** toujours `<OffthreadVideo>` pour les clips Kling. Jamais `<Video>`.

### Regeneration Kling a duree correcte (PROUVE 2026-03-14)

**Probleme** : clip O3 genere a 10s alors que le beat audio dure 13.6s.
**Solution** : regenerer avec EXACTEMENT les memes parametres (start frame, end frame, prompt, cfg_scale) en changeant uniquement `duration`.
**Resultat** : quasiment identique — meme trajectoire camera, meme style, validé Aziz "J'ai du mal a voir la difference".
**Regle** : toujours tenter la regeneration a la bonne duree AVANT de bricoler un SVG overlay ou un playbackRate.
**Determinisme** : ~95% — la technique O3 start+end est suffisamment deterministe pour que les parametres fixes reproduisent le meme mouvement.
**Script pattern** : `scripts/generate-beat01-14s.py`

---

## Methode Nano Banana — Modification chirurgicale d'asset (PROUVEE 2026-03-14)

### Probleme resolu
Modifier un detail d'une image generee (couleur, eclairage, objet) sans que le modele reinvente toute la composition.

### Workflow valide (2 etapes)

**Etape 1 — Extraction JSON** (modele `gemini-2.0-flash`, gratuit)
```python
prompt = """Analyse cette image et retourne UNIQUEMENT un JSON valide decrivant :
style, background, lighting, elements (name/color/position/size/details), atmosphere"""
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[types.Part.from_bytes(data=img_bytes, mime_type="image/png"), prompt]
)
scene_json = json.loads(response.text)
```

**Etape 2 — Modification + Regeneration** (modele `gemini-3-pro-image-preview` OBLIGATOIRE)
```python
# Modifier 1 champ dans le JSON
scene_json["elements"][0]["color"] = "#D4AF37"

# Renvoyer image originale + JSON modifie
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        types.Part.from_bytes(data=img_bytes, mime_type="image/png"),  # image originale
        f"Modifie UNIQUEMENT ce qui change dans ce JSON : {json.dumps(scene_json)}"
    ],
    config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])
)
```

### Regles critiques
- `gemini-3-pro-image-preview` OBLIGATOIRE pour l'etape 2 — le flash reinterprete tout
- Passer l'image originale EN PLUS du JSON modifie — sans elle, la composition change
- Modifier 1 seul champ a la fois — plus de changements = plus de derive
- Usage : variantes d'assets existants (couleur, heure, eclairage) — PAS pour generer from scratch

### Test prouve
`beat01-v5.png` (continent terracotta) → continent or `#D4AF37` — meme composition, meme style flat, meme Madagascar, meme arc de lumiere.

**Script :** `scripts/test-nano-banana-method.py` | **Output :** `tmp/nano-banana-test/`

---

## Animation & Timing

### spring() vs interpolate()
- `spring()` = physique (rebond, poids, inertie). Pour entrées de personnages, impacts, apparitions.
- `interpolate()` = linéaire/courbe. Pour progressions continues (opacité, position pendant scroll).
- **Règle** : spring s'applique à l'animation *interne* d'un élément, jamais à son `startFrame` calé sur l'audio.
- **Anti-pattern** : régler le spring 40 fois. Fixer des valeurs par défaut et passer à autre chose.

### Mouvement masse lourde : linéaire + spring freinage (HookBlocC v11)
- Spring seul dès le départ = accélération initiale bizarre ("galère qui surgit").
- Pattern correct pour objet lourd qui arrive puis s'arrête :
  1. `interpolate` linéaire de f0 à ARRIVE_END (vitesse constante, navigation)
  2. `spring({ damping: 14, stiffness: 35 })` décalé de ARRIVE_END (freinage visible, masse perçue)
  3. Combiner : `galereX = frame < ARRIVE_END ? linear : braking`
- Config spring freinage : `damping: 14, stiffness: 35` = objet lourd, amorti lent, visible à l'oeil.

### Timings audio = INTOUCHABLES
- Les `startFrame` dans TOKEN_ENTERS (BlocA) et SEG*_START (BlocB) sont dérivés de mesures ffprobe.
- Modifier ces valeurs = désynchronisation voix/visuel.
- **Règle** : les effets visuels (spring, grain, lottie) ne modifient JAMAIS un startFrame audio.

### Framer Motion — NE PAS UTILISER dans Remotion
- Framer Motion utilise `requestAnimationFrame` browser, pas `useCurrentFrame()`.
- Résultat : preview ≠ export MP4 (non-déterministe).
- **Règle** : tout ce que Framer Motion promet, `spring()` + `interpolate()` Remotion le fait correctement.
- Source erreur : recommandation Gemini sans connaissance des contraintes Remotion.

---

## Pipeline : SVG anime (CSS/SMIL) -> Remotion frame-accurate

> Recherche effectuee 2026-03-08. Probleme : Remotion rend frame-par-frame via Puppeteer headless — CSS animations et SMIL ne s'executent pas dans ce contexte.

### Regle fondamentale
Toute animation DOIT etre pilotee par `useCurrentFrame()`. Il n'existe pas de "passthrough" CSS -> Remotion. Chaque solution doit synchroniser sur le frame Remotion.

### Decision rapide par nombre d'elements

| Nb elements | Methode | Complexite |
|-------------|---------|------------|
| < 10 | Approche directe : strip CSS + spring/interpolate | 30-60 min |
| >= 10 avec timeline complexe | Anime.js hook (paused + seek) | 1h setup, reutilisable |
| Animation d'origine After Effects | Lottie JSON via Bodymovin | Necessite AE |

### SVG Recraft inline JSX — Pattern valide (2026-03-09)

**Probleme** : SVG Recraft (~25k tokens) ne peut pas etre anime via `<Img>` (statique) ni `<use href>` (CORS-bloque en Puppeteer). Ecrire le JSX a la main est bloquant (trop de volume).

**Solution valide** : Script Node.js pour convertir le SVG en JSX inline automatiquement.

```js
// 1. Lire le SVG avec fs.readFileSync
// 2. Extraire les groupes : [...svg.matchAll(/<g id="boat-(\d+)">([\s\S]*?)<\/g>/g)]
// 3. Nettoyer : supprimer transform="translate(0,0)", fermer les <path>
// 4. Envelopper chaque groupe dans <g opacity={...} transform={`translate(${tx},${ty})`}>
// 5. Ecrire le TSX final avec fs.writeFileSync
```

**Regles d'animation par groupe** :
- `opacity` : `spring({ frame: Math.max(0, frame - delay), fps, config: {damping:200}, from:0, to:1 })`
- `ty` (houle) : `Math.sin((frame / period) * Math.PI * 2 + phase) * amplitude` — period/amplitude/phase uniques par element
- `tx` (derive) : `interpolate(frame, [0, TOTAL], [0, MAX_DRIFT], {extrapolateRight: 'clamp'})`

**Anti-patterns a ne PAS reproduire** :
- `<Img src="fichier.svg">` → statique, aucune animation possible
- `<use href="...#boat-1">` → bloque en rendu headless Puppeteer (CORS/CSP)
- Ecrire le JSX inline a la main → bloquant si SVG > 5k tokens
- Utiliser CSS `transform:` au lieu de SVG `transform` attribute → non-deterministe dans headless
- `preserveAspectRatio="none"` avec paths diagonaux → les formes de fond ne couvrent plus le canvas
- Supprimer `backgroundColor` de `AbsoluteFill` → fond blanc dans headless Puppeteer

**Regles critiques pour SVG Recraft inline Remotion** :
1. `backgroundColor` OBLIGATOIRE sur `AbsoluteFill` (couleur dominante du SVG, ex: `#172E3D`)
2. `preserveAspectRatio="xMidYMid meet"` (jamais `none`) si le fond SVG doit couvrir le canvas
3. Extraire les paths avec `matchAll(/<path[^>]*><\/path>/g)` — Recraft genere `<path></path>` pas `<path />`
4. Element toujours visible (cote, titre) → le rendre EN DERNIER dans le SVG (z-order SVG = ordre DOM)
5. Verifier avec `npx remotion still --frame=0` + `--frame=150` AVANT d'annoncer que c'est bon

**Fichier de reference** : `src/projects/style-tests/RecraftFlotteTest.tsx` (24 bateaux, script de generation 2026-03-09)

### Option A — Approche directe (RECOMMANDEE — deja utilisee sur Peste 1347)
- Gemini genere SVG -> extraire shapes (paths, rects, circles) -> ignorer `<style>` et `<animate>`
- Re-implementer chaque animation en `spring()` / `interpolate()` Remotion
- Estimation de code :
  - Fade in/out : 3-5 lignes
  - Translation/scale : 5-10 lignes
  - Path draw-on (stroke-dashoffset) : 10-20 lignes
  - SVG typique Gemini (4-8 elements) : 50-150 lignes total
- Fiabilite 100%, zero dependance externe, zero cout

### Option B — Anime.js hook (pour animations complexes >= 10 elements)
- Pattern etabli dans l'ecosysteme Remotion (repo officiel `remotion-dev/anime-example`)
```ts
// Custom hook
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
useEffect(() => {
  const anim = animate(ref.current, { opacity: [0, 1] }, { duration: 1000, autoplay: false });
  anim.seek((frame / fps) * 1000);
}, [frame]);
```
- **Anime.js prefere a GSAP** : gratuit (MIT), API identique pour ce use case, pas de licence commerciale
- GSAP fonctionne aussi : `tl.seek(frame / fps)` mais licence payante en production commerciale

### Options a ecarter pour pipeline Gemini->Remotion
- **SVG->Lottie converters (LottieFiles, IconScout, etc.)** : traitent SVG STATIQUE uniquement. Ne lisent pas les `@keyframes` CSS. Probleme non resolu dans l'ecosysteme en 2026.
- **SVGator** : outil d'animation standalone (GUI). Ne "recoit" pas un SVG anime. Necessite de recreer l'animation manuellement. Utile si on part de zero ($16-24/mois).
- **@remotion/rive** : state machines cassees en headless rendering (GitHub issue #5147). Viable seulement pour animations lineaires simples, mais necessite recreation dans Rive Editor.
- **@remotion/lottie avec SVG Gemini** : fonctionne si on a un vrai Lottie JSON (After Effects + Bodymovin). Pas un chemin pour convertir les CSS animations de Gemini.

### Recraft V4 — INUTILISABLE pour backgrounds de scenes animees (2026-03-10)

> 8+ generations testees (MCP + API directe, V4 standard + Pro, avec/sans controls palette).

**Probleme fondamental** : Recraft genere des SVG monolithiques sans IDs semantiques sur les elements. Les `id` sont `path1`, `path2`, etc. — pas de labels narratifs (continent, ocean, vague). Impossible d'animer les elements independamment en Remotion.

**Quand Recraft V4 est utile** :
- Assets autonomes (pirogue, personnage, icone) = 1 element principal a animer
- Elements decoratifs statiques (fond texturé, motif, frontiere)

**Quand Recraft V4 est INADAPTE** :
- Scene ou plusieurs elements doivent etre animes independamment (continent + vagues + texte)
- Geometrie geographique precise (les cotes Recraft sont approximatives/stylisees)

**Alternative validee** :
- Continent africain → D3/TopoJSON (path unique, precision geographique, animable)
- Vagues ocean → paths SVG codes (sin() ou hooks useOceanSwell)
- Fond → `<rect>` #050208 sur `AbsoluteFill`

---

## Lottie dans Remotion

### Package correct
- **Utiliser** : `@remotion/lottie` (package officiel — synchronisé avec useCurrentFrame)
- **Ne PAS utiliser** : `lottie-react` (non-déterministe, même problème que Framer Motion)

### Où trouver des assets Lottie
- Site public : lottiefiles.com (gratuit, sans compte pour télécharger)
- Chercher : "line art", "outline", "sketch", "minimal" pour style compatible gravure
- Format : télécharger le `.json`, le placer dans `public/assets/lottie/`
- **Règle 30 min** : si après 30 min de recherche on n'a pas trouvé le bon style → coder l'effet en SVG pur (style garanti, 45 min).

### Quand utiliser Lottie vs SVG pur
- Lottie : effets diffus organiques (fumée, flammes, pluie, particules, insectes) — SI couleurs compatibles
- SVG pur : personnages, bâtiments, tout élément avec identité visuelle précise
- **Ne jamais utiliser Lottie** pour les personnages principaux (Thomas, Pierre, Renaud, etc.)
- **Lottie couleurs natives souvent incompatibles** : `smoke_postin.json` = gris très sombre (#333), style cartoon — INCOMPATIBLE avec enluminure/gravure parchemin. SVG pur gagne sur l'intégration palette.
- **Test visuel obligatoire** : avant d'adopter un Lottie, render côte-à-côte avec SVG pur. EffectsLab segment 7 = template de comparaison réutilisable.
- **Hack possible** : modifier les couleurs dans le JSON Lottie (format `[r, g, b]` normalisé 0-1) pour aligner avec la palette projet.

### Hack couleurs Lottie
- Le fichier `.json` Lottie contient les couleurs en format `[r, g, b]` normalisé (0-1).
- Claude peut chercher/remplacer les couleurs dans le JSON pour aligner avec la palette du projet.
- INK `#1A1008` = `[0.102, 0.063, 0.031]` en format Lottie normalisé.

---

## Grain & Texture SVG

### Préserver une couleur d'accent hors filtre gravure (HookBlocC v11)
- `feColorMatrix saturate 0` désature TOUT ce qui est dans le div filtré, y compris le vermillon.
- Pour qu'un élément (corps, sang, accent or) reste coloré en scène gravure :
  → Le placer dans un SVG séparé hors du `<div style={{filter: "url(#gravure)"}}>`.
  → Architecture : `div filtré` (background, galère, quai) + `svg absolu` (corps, accents).
- Résultat : fond en monochrome, accent vermillon reste rouge visible. Contraste fort = impact narratif.

### Coordonnées fixes vs attachées à un objet mobile
- Attacher des éléments à `transform={translate(galereX, y)}` les fait bouger AVEC la galère.
- Si les corps doivent rester sur le quai (position fixe), leurs coordonnées doivent être absolues.
- **Règle** : séparer "suit l'objet mobile" vs "position fixe dans la scène" dès la conception.

### Kimi review : toujours contextualiser les changements v(n)->v(n+1)
- Kimi évalue ce qu'elle voit dans la vidéo. Sans brief de diff, elle peut mentionner des problèmes de versions antérieures déjà corrigés.
- **Règle** : dans le prompt Kimi, toujours lister explicitement "changements depuis v(n-1)" pour que Kimi confirme si c'est résolu.

### Audio séquentiel dans Remotion — prop `delay` invalide
- `<Audio delay={n}>` n'est PAS un prop valide de Remotion. L'audio joue depuis f=0 simultanément.
- **Pattern correct** : `<Sequence from={n}><Audio startFrom={0} /></Sequence>`
- Symptôme du bug : voix doublées, "morphées", audio qui boucle de manière inattendue.
- **Règle** : toujours envelopper chaque piste audio séquentielle dans son propre `<Sequence from={startFrame}>`.

### Répétition narrative inter-scènes — vérifier avant de coder
- BlocA disait "Cette vidéo parle de ce qu'ils ont fait" — même message que BlocE "reframe".
- Résultat : le pivot de BlocE perdait tout son effet de surprise.
- **Règle** : avant d'assembler HookMaster, relire les transcriptions audio de toutes les scènes pour détecter les redondances. Utiliser Whisper tiny (rapide) pour confirmer le contenu exact.
- Fix : coupe ffmpeg ciblée sur la dernière phrase du fichier audio, sans regénérer.

### Prononciation TTS — liaisons consonantiques problématiques
- "ont accosté" prononcé "t'acosta" par ElevenLabs Chris (voix fr).
- Cause : liaison "ont + voyelle" difficile pour TTS français.
- **Règle** : éviter les formes "ont + verbe commençant par voyelle". Reformuler avec passé simple ("firent escale") ou imparfait.
- Vérification : Whisper small (pas tiny) pour valider la prononciation du nouveau fichier.

### Ordre narratif HookMaster — ancrer l'humain avant la menace
- Ordre correct : village/personnages → menace voyage → menace arrive → ampleur → reframe.
- Ordre incorrect (session précédente) : galères en premier → village après → résultat incohérent.
- **Règle** : l'ordre des scènes doit suivre l'arc émotionnel du script, pas l'ordre de production des blocs.

### Transitions entre scènes — sobriété YouTube documentaire
- InkWipe dans Series expose le fond transparent du canvas = bug visuel (damier).
- Plus fondamentalement : les transitions stylisées sont rares dans les bonnes vidéos YouTube éducatives (Johnny Harris, Kurzgesagt). La coupe franche est souvent meilleure.
- **Règle** : par défaut, coupes franches dans Series. Les transitions stylisées ne s'ajoutent qu'après validation explicite d'Aziz sur un prototype isolé dans effect-lab.

### feTurbulence — valeurs de référence
- Grain très subtil (parchemin normal) : `baseFrequency="0.65"` opacity `0.03`
- Grain moyen (tension narrative) : `baseFrequency="0.65"` opacity `0.06`
- Grain fort (bûchers, mort, miroir final) : `baseFrequency="0.65"` opacity `0.10`
- Animation du grain : `seed` qui change via `useCurrentFrame() % 60` → crépitement pellicule
- **Règle** : ne jamais dépasser opacity `0.12` (grain devient distraction)

### Intensité narrative du grain
- Début (village vivant, enluminure) : grain faible
- Progression (tension, maladie) : grain monte
- Miroir final : grain maximal
- Implémentation : `interpolate(frame, [0, totalFrames], [0.03, 0.10])` sur l'opacité overlay

---

## Effets SVG — Guide d'usage (validé EffectsLab)

### Catalogue des 10 effets testés (EffectsLab.tsx — sandbox de référence)

| Seg | Effet | Technique | Usage narratif | Complexité |
|-----|-------|-----------|----------------|------------|
| S1  | Baseline | interpolate() pur | Référence | Triviale |
| S2  | Grain + Fumée SVG | feTurbulence + cercles animés | Toute scène vivante | Faible |
| S3  | spring() entrées | spring() sur position | Apparition personnages | Faible |
| S4  | Dessin progressif | stroke-dasharray | Intro de scène, cartes, titres | Moyenne |
| S5  | Torche + vignette | radial gradient + Math.sin() | Scènes nocturnes, tension | Faible |
| S6  | Split-screen | clipPath + feColorMatrix | Comparaison avant/après (PARCIMONIE) | Moyenne |
| S7  | Lottie vs SVG | @remotion/lottie | Test only — SVG pur gagne | — |
| S8  | Marche Math.sin() | Math.sin() sur members | Personnages en déplacement | Moyenne |
| S9  | Carte propagation | stroke-dasharray + circles | Visualisation historique | Moyenne |
| S10 | Micro-expressions | ry→0 blink, pupil r, Math.sin mouth, feColorMatrix, flash | Choc, peur, contamination, mort | Moyenne |

### Règles d'intégration en production

**Torche/vignette (S5) — PRIORITAIRE**
- Effet le plus impactant narrativement (feedback Aziz : "le plus impressionnant")
- Intégrer dans : scènes nocturnes, mort, bûchers, miroir final
- Ne pas utiliser pour : séquences joyeuses (village vivant pré-peste)

**Dessin progressif (S4) — BON USAGE**
- Idéal pour : intro de scène (village qui se révèle), cartes, titres animés
- Éviter pour : personnages en mouvement continu (mieux avec spring)
- EffectsLab S9 = application directe sur carte de propagation

**Split-screen (S6) — PARCIMONIE OBLIGATOIRE**
- Maximum 1 utilisation dans toute la vidéo
- Durée max recommandée : 4-5 secondes (pas de narration simultanée)
- Cas d'usage valide : transition temporelle AVANT/PENDANT/APRÈS
- Jamais pour deux scènes avec beaucoup d'éléments chacune

**Animation marche (S8)**
- Math.sin() fonctionne sur stickmen ET sur personnages complexes
- Fréquence `frame * 0.08` = rythme adulte normal. Ralentir à `0.05` pour vieillard/malade.
- La canne suit le bras automatiquement via le même cycle

**Fumée SVG (S2 / ChimneySmoke)**
- Validé pour : cheminées village, galères (HookBlocB), bûchers
- `opacity 0.18` max par particule (au-delà = trop opaque sur parchemin)
- Code réutilisable : composant `ChimneySmoke` dans EffectsLab.tsx

**Carte propagation (S9)**
- Technique validée pour toute visualisation historique géo
- Caffa = point rouge (origine), villes = points noirs, Saint-Pierre = or
- Routes = stroke-dasharray + interpolate() sur longueur progressive
- Ondes = circles avec opacity qui décroît et r qui croit

**Micro-expressions (S10) — SCÈNES DE CHOC**
- `ThomasFace` composant avec 5 props indépendants : blinkProgress, fearLevel, mouthOpen, plagueSpots, flashOp
- Clignement : `ry` ellipse passe de 5 à 0 (frame 10-13) — naturel et non-perturbant
- Pupilles dilatées : r 3→5.5 avec fearLevel, décentrées vers le haut
- Bouche parlante : Math.sin oscillation sur `ry` de l'ellipse bouche (sync audio possible)
- Taches vermillon : 5 circles avec apparition staggerée via `t` offset — identique aux buboes historiques
- Flash freeze : rect blanc opacity `interpolate([268,272,280], [0,1,0])` — moment de choc
- Synchronisable audio : `mouthOpen = Math.sin(frame * 0.18)` → sync voix-off naturelle
- Usage : scènes de contamination, mort d'un personnage, révélation, choc émotionnel

### Règle générale : 1 effet dominant par scène
- Jamais superposer torche + grain fort + split-screen dans la même scène
- Chaque scène a UN effet principal + éventuellement 1 effet subtil de texture
- Exemple bon : vignette nocturne + fumée SVG légère (2 effets compatibles)
- Exemple mauvais : grain fort + torche + dessin progressif + split-screen

---

## Workflow & Risques connus

### Le Rabbit Hole d'itération visuelle
- Symptôme : régler une valeur (grain, spring, couleur) plus de 3 fois.
- Règle : max 3 itérations sur un paramètre visuel. Après = fixer et passer à autre chose.
- Valeurs "bonnes par défaut" > perfection impossible.

### Sandbox avant production
- Toute nouvelle technique (grain, spring, lottie) → tester dans `EffectsLab.tsx` isolé.
- Jamais tester directement sur HookBlocA ou HookBlocB.
- Valider visuellement dans Remotion Studio → PUIS intégrer dans scènes de production.

### Scope creep technique
- Symptôme : ajouter une technique non planifiée "pendant qu'on y est".
- Règle : finir la technique en cours, noter les autres dans ce fichier, ne pas bifurquer.

---

## ElevenLabs TTS — Problèmes de prononciation français (Chris)

### Participes passés en "é" — DROP SYSTÉMATIQUE
- ElevenLabs Chris drop les accents finaux sur les participes passés en "é" en fin de groupe nominal.
- "surpeuplés" → prononcé "surpeuples" (verbe présent), "serrés" → "serrent", "entassés" → "entasse".
- **Règle** : éviter TOUS les participes passés en "é" dans les scripts TTS. Remplacer par constructions sans accent final.
- **Pattern sûr** : "trop de monde, pas d'hygiène, pas d'air" → zéro participe passé, même sens.

### Liaisons consonantiques — TTS
- "ont + voyelle" → ElevenLabs produit une liaison bizarre ("t'accoste").
- **Règle** : remplacer par passé simple. "ont accosté" → "firent escale".

### Noms propres italiens/étrangers — accent anglophone
- "À Florence, Giovanni Boccaccio" peut faire ressortir un accent anglophone sur le "À".
- Défaut mineur, acceptable si le reste du segment sonne bien.
- Si problématique : ajouter une virgule après "À Florence," pour forcer une pause.

### Noms de villes avec "s" final — liaison forcée
- "À Londres, les..." → le "s" de Londres crée une liaison bizarre avec "les".
- **Fix** : écrire "A Londre," (sans s) — licence phonétique pour le TTS, sens clair.

---

## Style Silhouette Nocturne — Leçons apprises (2026-03-05)

### Fichiers de référence
- `src/projects/veilleur-ombre/scenes/NightPaletteFinalV2.tsx` — palette finale validée
- `src/projects/veilleur-ombre/scenes/SilhouetteShowcase.tsx` — 5 scènes showcase
- `src/projects/veilleur-ombre/scenes/VeilleurOmbre.tsx` — composition longue de référence

### Palette nocturne validée (mobile-first)
```
BG_TOP    = "#050208"  // zenith — noir pur absolu
BG_HORIZ  = "#080d1a"  // horizon — indigo imperceptible
SIL_COL   = "#0c1018"  // silhouettes — teinte bleue subtile vs fond
GROUND    = "#060810"  // sol — légèrement plus chaud
BRUME     = "#10182e"  // brume montante (opacity 0–40%)
WARM_EYE  = "#ff9933"  // yeux/accents chauds
COOL_STAR = "#c8d0e8"  // étoiles standard
```

### Les 3 couches de lisibilité mobile (fond noir pur conservé)
1. **Gradient atmosphérique** : `BG_TOP` → `BG_HORIZ` vertical — imperceptible à l'oeil, mais l'atmosphère existe
2. **Rim light lune** : contour de la silhouette, 20-22% opacity, filtre gaussien 2px — effet cinéma
3. **Brume au sol** : rectangle avec `linearGradient` opacity 0→40%, monte 240px au-dessus du sol

Règle : ces 3 couches ensemble. Aucune seule ne suffit. Cumulées elles donnent la lisibilité sans sacrifier le noir.

### SVG z-order pour animations de silhouette
- Corps rendu en premier, bras rendu EN DERNIER dans le `<g>` — sinon le bras disparait derrière le torse
- Rim light = `<g filter>` AVANT le corps rempli, jamais après
- Halos d'yeux = AVANT les cercles solides des yeux

### Étoiles efficaces
- Minimum 25 étoiles pour densité convaincante sur 1920×1080
- 3 tailles : grandes (r=3.5-4.2) avec micro-halo blur, moyennes (r=2.4-3.0), petites fond (r=1.6-2.2)
- Scintillement : `0.55 + 0.45 * Math.sin(frame * 0.055 + phase)` — fréquence lente, naturelle
- Accents couleur : ~15% bleues (`#aaccff`), ~15% dorées (`#ffe8aa`) — rompt l'uniformité
- Micro-halos seulement sur r >= 3.0 (filtre gaussien 6px, opacity 18%)

### Yeux-lanternes (point focal chaud sur fond sombre)
- Double couche : halo blur-14px à 28% opacity + cercle solide à 95% opacity
- Micro-reflet blanc (r=1.2, opacity 80%) au coin supérieur — donne de la vie
- Pulse lente : `0.75 + 0.25 * Math.sin(frame * 0.07)` — respiration, pas clignotement
- **Piège** : halo trop grand (r × 8+) sur fond sombre = fumée / flou agressif. Maximum r × 5.5.

### Erreur à éviter : noir pur uniforme
- Fond `#050208` plat + silhouette `#0a0610` = silhouette invisible à distance / petit écran / soleil
- **Jamais** utiliser fond plat pour les silhouettes. Toujours gradient + brume + rim.
- **Jamais** passer en bleu-nuit (`#0d1b2a`) — trop éclairci, perd le charme nocturne

### Format vertical mobile (Shorts/Reels)
- Un seul paramètre à changer : `width={1080} height={1920}` dans la Composition
- Le ciel occupe 60-70% de l'écran vertical → jamais l'éclaircir (avantage différenciant dans le feed)
- Les silhouettes au sol = 20-25% de l'écran → rim light + brume les rendent lisibles sur ce petit espace

---

---

## Geo Visual Effects — Techniques validées (2026-03-08)

> Toutes ces techniques sont implementees et rendues dans `src/projects/style-tests/GeoAdvancedV2.tsx`.
> Ce fichier est la reference implementee — copy-paste direct pour tout futur Short geo.

### Sandbox de reference
- **`GeoAdvancedV2.tsx`** : 5 sequences x 300 frames, 1080x1920, auto-documente (SeqHeader + EffectTag + SeqFooter)
- **`GeoAdvanced.tsx`** : version 16:9 precedente, patron TopoJSON + COORDS + PALETTE reutilisable

---

### Technique 1 — Hachures SVG (`<pattern>`)

**Principe** : remplir un pays avec un motif de lignes diagonales animees.

```tsx
<defs>
  <pattern id="hachures" patternUnits="userSpaceOnUse" width={10} height={10}
    patternTransform={`rotate(${45 + frame * 0.3})`}>
    <line x1="0" y1="0" x2="0" y2="10"
      stroke="#c0392b" strokeWidth={1.5} strokeOpacity={opacity} />
  </pattern>
</defs>
<path d={geoPath(feature)} fill="url(#hachures)" />
```

- **patternTransform rotate** : permet d'animer la rotation des hachures frame par frame
- **patternUnits="userSpaceOnUse"** : obligatoire (sinon pattern trop petit/grand selon la projection)
- **Usage narratif** : territoire disputed, zone de menace, embargo, mise en evidence critique

---

### Technique 2 — Vignette (radialGradient anime)

```tsx
<defs>
  <radialGradient id="vignette" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
    <stop offset="0%" stopColor="transparent" />
    <stop offset="100%" stopColor="black" stopOpacity={vigOpacity} />
  </radialGradient>
</defs>
<rect width={W} height={H} fill="url(#vignette)" />
```

- `vigOpacity = interpolate(frame, [50, 150], [0, 0.75], {extrapolateRight: 'clamp'})`
- **Usage narratif** : focalisation sur une zone, tension, nuit, isolement

---

### Technique 3 — Zoom CSS fluide (Solution de reference, GPU-native)

**Principe** : chemins calcules UNE FOIS au load. Zoom = transform SVG sur le groupe. Zero JS par frame.

```tsx
const ease = Easing.inOut(Easing.cubic);
const tRaw = (local - 20) / 80;       // progress 0->1 sur la phase de zoom
const t = ease(Math.max(0, Math.min(1, tRaw)));
const zoomScale = interpolate(t, [0, 1], [1, 2.8]);
const invScale = 1 / zoomScale;

const mapTransform = `
  translate(${targetX}, ${targetY})
  scale(${zoomScale})
  translate(${-targetX}, ${-targetY})
`;

// Labels DANS le groupe zoome, counter-compenses
<g transform={mapTransform}>
  {/* chemins geo */}
  <g transform={`translate(${ptPays[0]}, ${ptPays[1]}) scale(${invScale})`}>
    <text>NOM PAYS</text>  {/* taille fixe a l'ecran */}
  </g>
</g>
```

- **Formule d'ancrage zoom** : `translate(target) scale(zoom) translate(-target)` — centre le zoom sur le point geo cible
- **Easing.inOut(Easing.cubic)** : naturel, accele en debut, ralentit en fin. Pattern: `const t = ease(tRaw); const val = interpolate(t, [0,1], [start, end])`
- **Anti-pattern** : D3 re-projection par frame = 8-15ms JS bloquant → saccades a 30fps
- **Comparaison** : GeoAdvanced v1 (CSS transform) = fluide. GeoAdvancedV2 avant fix = saccade en Seq2/Seq5.

---

### Technique 4 — Draw-on bordure (strokeDashoffset)

```tsx
const PATH_LEN = 3200;  // approximation, ajuster par pays
const drawProgress = interpolate(local, [0, 120], [0, 1], {extrapolateRight: 'clamp'});
const dashOffset = PATH_LEN * (1 - drawProgress);

<path
  d={geoPath(countryFeature)}
  fill="none"
  stroke="#c0392b"
  strokeWidth={3}
  strokeDasharray={PATH_LEN}
  strokeDashoffset={dashOffset}
/>
```

- `PATH_LEN` = approximation (3000-5000 pour pays moyens, 1000-2000 pour petits pays)
- Pour la longueur exacte : `svgPathElement.getTotalLength()` — mais unavailable en Remotion (SSR). Approximer.
- **Usage narratif** : revelation de frontiere, trace de route, draw-on de carte

---

### Technique 5 — Pulse rings cascade (infinite loop)

```tsx
const RINGS = [
  { delay: 0,  color: "#c0392b", maxR: 60 },
  { delay: 25, color: "#e74c3c", maxR: 45 },
  { delay: 50, color: "#f39c12", maxR: 30 },
];
const PERIOD = 80;

{RINGS.map((ring, i) => {
  const loopFrame = (local - 160) % PERIOD;  // loop infini
  const ringLocal = (loopFrame - ring.delay + PERIOD) % PERIOD;
  const rProgress = ringLocal / PERIOD;
  const r = interpolate(rProgress, [0, 1], [5, ring.maxR]);
  const op = interpolate(rProgress, [0, 0.3, 1], [0.9, 0.6, 0]);
  return <circle key={i} cx={px} cy={py} r={r} fill="none"
    stroke={ring.color} strokeWidth={2} opacity={op} />;
})}
```

- **`% PERIOD`** = modulo pour boucle infinie sans incrementer un compteur
- **Stagger par delay** : chaque ring commence a `delay` frames d'ecart
- **Usage narratif** : epicentre seismique, point d'alerte, expansion virale, capitale en tension

---

### Technique 6 — Transition zoom-blur

```tsx
const SCENE_DUR = 100;
const TRANS = 18;

// Scene sortante
const outScale = interpolate(local, [SCENE_DUR - TRANS, SCENE_DUR], [1, 1.12], {extrapolateRight: 'clamp'});
const outBlur  = interpolate(local, [SCENE_DUR - TRANS, SCENE_DUR], [0, 8],    {extrapolateRight: 'clamp'});
const outOp    = interpolate(local, [SCENE_DUR - TRANS, SCENE_DUR], [1, 0],    {extrapolateRight: 'clamp'});

// Scene entrante
const inScale  = interpolate(local, [SCENE_DUR - TRANS, SCENE_DUR], [1.08, 1], {extrapolateLeft: 'clamp'});
const inOp     = interpolate(local, [SCENE_DUR - TRANS, SCENE_DUR], [0, 1],    {extrapolateLeft: 'clamp'});

<AbsoluteFill style={{ transform: `scale(${outScale})`, filter: `blur(${outBlur}px)`, opacity: outOp }}>
  <SceneA local={local} />
</AbsoluteFill>
<AbsoluteFill style={{ transform: `scale(${inScale})`, opacity: inOp }}>
  <SceneB local={local - (SCENE_DUR - TRANS)} />
</AbsoluteFill>
```

- **18 frames optimal** (0.6s a 30fps) — assez visible pour imprimer, pas assez long pour couper le rythme
- **outScale 1→1.12** : effet "zoom avant aspirant" sur la scene sortante
- **inScale 1.08→1** : scene entrante semble sortir de derriere la precedente
- **Usage** : changement de region geo, saut temporel, cut dramatique

---

### Pattern UI : sandbox auto-documente (SeqHeader + EffectTag + SeqFooter)

Composants crees dans GeoAdvancedV2 pour rendre le MP4 utilisable comme document de reference :

- **`SeqHeader`** : bande noire en haut (num sequence + titre + description technique)
- **`EffectTag`** : bulle d'annotation flottante avec ligne en pointilles vers le point d'interet — apparait au moment du declenchement de l'effet
- **`SeqFooter`** : barre grise en bas avec valeurs techniques en temps reel (zoomScale, dashOffset, opacity...)

Usage : copier ce pattern pour tout futur sandbox technique (effets audio, particules, physique, etc.)

---

### GeoGlobeTales — Analyse technique (reference)

- **Stack identifie** : Google Earth Studio (satellite video) + After Effects (overlays SVG/texte)
- **Le "3D"** n'est pas du rendu 3D. C'est de la vraie imagerie satellite GPU-rendue par Google. Non reproductible.
- **Ce qui est reproductible dans Remotion** : toutes les annotations, titres, overlay de pays, statistiques
- **Integration Earth Studio possible** : `<Video src={staticFile("earth.mp4")}>` sous `<AbsoluteFill>` SVG
- **Earth Studio** : outil web uniquement, zero API, zero CLI, zero MCP. Utilisation manuelle obligatoire.
- **Earth Engine** : outil different — analyse scientifique geospatiale (Python/JS API, donnees petabytes). Pas utile pour video.
- **Verdict** : Remotion peut egaler GeoGlobeTales sur les courts formats (< 60s) SAUF l'imagerie satellite. Sur les effets de donnees + narratif + style, Remotion surpasse.
- **Detail complet** : `research/references/geopolitics-shorts/ANALYSIS.md`

---

## Kling 3.0 Pipeline — Learnings (2026-03-11)

> Sources : Beat01 GeoAfrique (prouve en production) + analyse Bone Throne (Higgsfield) + tutoriel Mira AI (OpenArt)

### Regles absolues images source

- **JAMAIS de texte dans l'image source** : stable a 5s, anime/deforme a 10s+
- **Image propre sans texte** = generer via Gemini (texte ajoute par Remotion apres)
- **Vertical drift (Beat01)** : mouvement vers le haut = safe. Horizontal = risque de morphing si hors-champ.
- **cfg_scale 0.5-0.6** = preserve le style flat design sans derive cinematique
- **Audio genere par Kling** : toujours present, meme "sans audio" → obligatoire `<Video muted>` dans Remotion

### Structure motion prompt multi-shot (validee par Mira AI + confirme fal.ai doc)

**Disponible en Kling V3 standard sur fal.ai — pas besoin d'Omni.**
API : `multi_prompt: [{prompt, duration}]` + `shot_type: "customize"`. `end_image_url` aussi disponible.

Ne pas ecrire "animate this image". Structurer en shots :

```
Shot 1: (0:00-0:04) Visual: [description]. Camera: [mouvement camera]. SFX: [optionnel].
Shot 2: (0:04-0:08) Visual: [description]. Camera: [mouvement camera].
Shot 3: (0:08-0:12) Visual: [description]. Camera: [locked-off / slow push / etc.].
```

- Cette structure donne a Kling une direction cinematique claire
- Reduit les prises inutiles (moins de regenerations)
- Applicable pour tous les beats GeoAfrique

### Start/End Frame — technique narrative

- Donner une image de depart ET une image d'arrivee a Kling → anime la transition
- Utilisation : Beat07 (ocean vide → bateau visible), transitions temporelles
- Generer les 2 images dans Nano Banana / Gemini d'abord, PUIS passer dans Kling

### Hero Reference = source de verite visuelle

- Generer d'abord une image "propre" du visuel principal (fond neutre, eclairage plat)
- Utiliser cette image comme Omni Reference pour toutes les scenes suivantes
- Equivalent de nos storyboard panels `tmp/storyboard-abou-bakari/` — meme logique

### "Mining" — extraire les bonnes frames

- Un clip Kling imparfait peut avoir des frames excellentes
- Technique : pauser la video au bon moment → sauvegarder le frame → reutiliser comme start/end frame
- Ne pas tout rejeter si 80% du clip est bon

### Coherence personnage — Soul ID vs Omni Reference

- **Soul ID (Higgsfield)** : pour fiction narrative avec acteurs, 20-30 photos par personnage
- **Omni Reference (OpenArt/Nano Banana)** : pour animation stylisee, 1 image hero reference suffit
- **Notre cas GeoAfrique** : pas d'acteur → ni l'un ni l'autre. Coherence = style Gemini (palette, composition)

### Aggregateurs AI video (reference)

| Plateforme | Modeles disponibles | Differenciateur | Notre usage |
|------------|---------------------|-----------------|-------------|
| Higgsfield | Kling 3.0, Veo 3.1, Sora 2, Seedance 2.0, WAN | Soul ID coherence acteur | Non (pas d'acteur) |
| OpenArt    | Kling 3.0, Nano Banana, etc. | Tout-en-un DIY, credits | Non (fal.ai moins cher) |
| fal.ai     | Kling 3.0 direct | API directe, $0.84/clip | OUI — notre pipeline |

### Architecture Remotion = assembleur uniquement

- Remotion ne genere pas les clips video — il les assemble
- Pattern valide : `<Video muted src={staticFile("beat01-v5-kling.mp4")} />` + texte spring()
- Chaque beat = `<AbsoluteFill>` independante, visibilite controlee par opacity
- Audio ElevenLabs = unique source de timing (INTOUCHABLE)

---

## SVG viewBox + format portrait 9:16 — Regles definitives (2026-03-13)

### Probleme : asset 16:9 force en 9:16
- Un SVG ou PNG concu en 16:9 (2048x1152) mis dans un canvas 9:16 (1080x1920) perd ~80% de son contenu.
- `preserveAspectRatio="xMidYMid slice"` + `viewBox` croppe couvrent le canvas mais montrent une infime partie de l'asset.
- **Regle absolue : generer les assets NATIVEMENT en 9:16 depuis le debut. Ne jamais essayer de cropper un 16:9 en 9:16.**

### Texte overlay sur backdrop SVG — Regle des deux SVG
- Mettre le texte dans le meme SVG que le backdrop = les coordonnees du texte heritent du viewBox du backdrop.
- Si le backdrop a `viewBox="200 300 1600 900"`, un text `x={1024}` pointe au milieu du backdrop, pas de l'ecran.
- **Pattern obligatoire** : backdrop SVG avec son propre viewBox + second SVG overlay `viewBox="0 0 1080 1920"` pour le texte.
```tsx
// CORRECT
<svg viewBox="0 0 1229 2048" style={{...}}>  {/* backdrop */}
  <path ... />
</svg>
<svg viewBox="0 0 1080 1920" style={{position:'absolute', top:0, left:0}}>  {/* texte */}
  <text x={540} y={800} ...>2 000</text>
</svg>
```

### `<img>` SVG statique = PowerPoint
- `<img src="asset.svg">` dans Remotion = image fixe. Aucune animation possible.
- **Regle** : un `<img>` seul comme element principal d'une scene = PowerPoint. Interdit.
- Options valides : (1) inliner les paths SVG en JSX + spring/sin(), (2) convertir en PNG → Kling i2v → `<OffthreadVideo>`

### Recraft — formats portrait disponibles
- `recraftv4_vector` : carre 1024x1024 uniquement. Pas de portrait.
- `recraftv4_pro_vector` : carre uniquement. Pas de portrait.
- `recraftv3_vector` : supporte `1024x1707` (~9:16). **Seul modele vector utilisable en portrait.**
- Pour pipeline GeoAfrique portrait : `recraftv3_vector` + `size: "1024x1707"`.

### Kling V3 vs V1.6 — Ne jamais utiliser V1.6
- L'endpoint par defaut fal.ai (`kling-video/v1.6/standard`) est l'ancienne version.
- **Toujours utiliser** : `fal-ai/kling-video/v3/standard/image-to-video` ou `v3/pro/image-to-video`.
- V3 standard = 720x1280 (suffisant pour backdrop `objectFit: cover`).
- V3 standard anime tres bien le style vectoriel flat sans le deformer (cfg_scale 0.4 recommande).

### Cadrage asset source pour Kling i2v
- Kling anime fidelement l'image source, y compris les defauts de cadrage.
- Si un bateau est coupe dans l'image source → il sera coupe dans le clip Kling.
- **Regle** : valider le cadrage de l'image source AVANT d'envoyer a Kling. Verifier que chaque element narratif est complet dans le frame.

---

## Zone Texte Stable dans un clip Kling — Regle Image Source (2026-03-14)

### Decouverte (Beat01 B — horizon rasant)
Kling distingue les elements "physiques" (globe, continent, eau) des elements "decor fixe" (ciel etoile, fond spatial, zone vide).
- Elements physiques : Kling les anime selon la physique implicite de la scene (rotation globe, derive continent, ombre portee)
- Elements decor fixe : Kling les preserve statiques, meme sur 10 secondes

### Implication pratique
Si on veut une zone texte stable dans un clip Kling pour superposer du texte Remotion :
- **Concevoir l'image source avec une zone visuellement neutre en haut** (ciel, espace, fond sombre uni)
- Kling respectera cette zone naturellement — pas besoin de `static_mask_url`
- Remotion superpose le texte spring() dans cette zone → jamais de conflit visuel

### Quand appliquer
- Shorts avec sous-titres ou titres qui apparaissent progressivement
- Beats avec mot cle narratif important ("1311", "Abou Bakari II", chiffre choc)
- Tout beat ou le texte overlay doit rester lisible sur fond stable

### Quand ne pas forcer
- Beats purement visuels sans texte overlay
- Scenes ou le mouvement couvre intentionnellement tout le cadre

### Regle de design image source
**Pattern : fond neutre en haut (30-40% du cadre) + sujet animable en bas/centre.**
Ciel/espace = zone texte gratuite. Globe/continent/personnage = zone animee par Kling.

### Bonus : physique implicite O3
Clip C (globe incline) : Kling a anime l'ombre portee du globe en coherence avec la source lumineuse fixe (halo dore).
Zero instruction dans le prompt — Kling infere la physique depuis la scene.
Utile pour scenes avec eclairage directionnel (torche, soleil, horizon) : l'ombre suivra automatiquement le mouvement.

---

## Palette de référence projet (Peste 1347)

```
PARCHMENT   = "#F5E6C8"
PARCHMENT_D = "#E8D4A8"
INK         = "#1A1008"
INK_LIGHT   = "#6B5030"
GOLD        = "#C9A227"
GOLD_DARK   = "#8B6914"
SKY_BLUE    = "#2D3A8C"
VERMILLON   = "#C1392B"
SEA_BLUE    = "#1B4F8C"
```

---

## Workflow Optimum Shorts GeoAfrique — Pattern O3 Personnage (2026-03-14)

### Le pattern "directeur, pas technicien"

Valide sur Beat01 (geo) + Beat02 (personnage). La question n'est plus technique — elle est narrative :
1. **Quelle est la composition de depart ?** (image propre, fond uni, zero decoration)
2. **Quelle est la composition d'arrivee ?** (Gemini multimodal REF → end frame narratif)
3. **Quelle est l'intention narrative ?** (rapprochement, pivot, revelation, depart)

Kling O3 fait le reste : interpolation cinematique, micro-mouvements organiques, clignements, physique implicite.

### Regle image source O3 personnage
Supprimer TOUS les elements decoratifs de coin AVANT upload :
- Medaillons, cadres, arabesques = Kling les traite comme des elements "interessants" a animer → artefacts
- Fix : PIL `draw.rectangle([0, 0, corner, corner], fill=(0,0,0,255))` sur les 4 coins (120px) + bords (12px)
- Assets propres sauvegardes dans `characters/abou-bakari-roi-cropped.png`

### Pattern End Frame narratif (Gemini multimodal)
- Toujours passer l'image source croppee comme `Part.from_bytes()` dans Gemini
- Decrire EXACTEMENT le changement de composition (zoom, angle, expression)
- Specifier "NO borders, NO frames, NO decorative corner elements" en fin de prompt
- Modele actif : `models/gemini-3.1-flash-image-preview`

---

## TTS Audio Tags — Règles validées (ElevenLabs V3 + Fish Audio S2) — 2026-03-14

### Contexte
Tests comparatifs effectués sur les deux plateformes avec le script Abou Bakari II.
Conclusion : les deux partagent les mêmes forces et les mêmes limites. ElevenLabs V3 retenu pour Abou Bakari (voix custom prouvées).

### Règles tags — valables ElevenLabs ET Fish Audio

| Tag / Technique | Verdict | Note |
|----------------|---------|------|
| `[pause]` / `[long pause]` | Fiable | Fonctionne bien sur les deux |
| `[sad]` | Fiable | Ton melancolique bien rendu |
| `[whispering]` / `[whispers]` | Aleatoire | Fonctionne 1 fois sur 2 — tester et regenerer |
| `[sighing]` / `[sighs]` | Neutre | Produit une respiration, pas un vrai soupir expressif |
| `[panting]` | Eviter | Produit des artefacts sonores (bruit d'explosion) |
| `[soft]` en ouverture | Ignore | Pas pris en compte |
| Majuscules (`LUI-MEME`) | INTERDIT | Artefacts garantis, voix qui grince — sur les deux plateformes |
| Emotion contextuelle sans tag | Souvent meilleur | S2/V3 lisent le contexte — la phrase "terrifie" sonne bien sans tag |

### Règle d'emphase sans majuscules
Pour l'emphase : utiliser ponctuation (tirets, points de suspension, virgules) — pas les majuscules.
Le rythme textuel est plus fiable que la typographie pour guider l'intonation TTS.

### Décision architecturale
- **Abou Bakari II** : ElevenLabs V3 — voix custom prouvées, rester dessus
- **Fish Audio** : garder en option pour futurs projets (prix ~70% moins cher, bon si on part de zéro)
- **Consistency** : les deux plateformes ont la même inconsistance sur les tags expressifs (whispering aléatoire)

---

### Insight "camera qui orbite vs personnage qui bouge"
Beat02 : ce n'est pas le roi qui tourne la tete — c'est la camera qui orbite. Le roi reste immobile, souverain.
Narrativement plus fort : c'est le monde qui vient a lui, pas lui qui s'incline.
Kling O3 infere ce type de mouvement de camera naturellement quand start/end frames ont des compositions differentes.

---

## Session 11 — 2026-03-15 — Beat03 Fleet

### Overlay texte : quand s'en passer
La règle validée : le texte overlay sert quand l'image est ambiguë ou incomplète.
Quand l'image raconte déjà l'histoire (flotte → pirogue solitaire = arc narratif complet), pas de texte.
Beat01 "1311" et Beat02 "ABOU BAKARI II" : nécessaires (datation + identification).
Beat03 : une seule ligne "2 000 pirogues" qui disparaît suffit. Le reste, la voix-off le dit.

### Calibration Kimi — style flat
Kimi a pénalisé les vagues "trop lisses" sur Beat03. Notre style est intentionnellement géométrique.
Ajouter dans les briefs Kimi futurs : "Style is intentionally flat geometric — smooth shapes are a feature, not a bug."

### Pipeline Beat03 validé
- Start frame : God's Eye view flotte (Gemini 3.1 flash image preview, ref SVG B2-GROUPED)
- End frame : pirogue penchée 20°, vague géométrique UNIQUE, fond noir — simple = animable
- O3 cfg_scale 0.4, duration 13s
- Aziz : "morphing flotte→pirogue remarquable, voile bouge, bateau saute sur l'eau"

### Processus NON-NEGOTIABLE confirmé
Montrer clip Kling + mini-render à Aziz → attendre validation explicite → intégrer.
Ne jamais intégrer avant validation. Évite les itérations de correction coûteuses.

---

## Beat04 Refonte — Learnings session 12 (2026-03-15)

### Contexte
Le clip original montrait le roi sur son trône — narrativement incorrect (possession) alors que le script parle de renonciation/départ. Refonte totale.
**Règle** : valider la cohérence narrative d'un clip avec le script AVANT de générer. Le script prime toujours sur l'asset existant.

### Direction narrative corrigée
Abou Bakari comme capitaine debout à la proue, vue de dos, conduisant une flotte vers l'Atlantique nocturne.
Multi-shot O3 : flotte → dolly out → plan large océan étoilé.

### O3 multi-shot : principe de base

**Le multi-shot n'est PAS un paramètre API.** Les shots se structurent en texte dans le prompt standard.
Format : `"Shot 1 (0-6s): [description + camera]. Shot 2 (6-11s): [description]. Shot 3 (11-15s): [description]."`
Script de référence : `scripts/generate-beat04-kling-v2.py`

### Erreurs récurrentes image source → à éviter systématiquement

| Erreur | Cause | Fix |
|--------|-------|-----|
| Rive/terre visible dans le clip | Image source avec indice visuel de sol | Utiliser image "déjà en pleine mer", negative "shore, beach, sand, land" |
| Bras levés (pose prophète) | Bras légèrement ouverts dans source → Kling amplifie | "arms hanging naturally at sides" + negative "raised arms" |
| Rameurs face au roi | Gemini oriente les rameurs vers le personnage principal | "facing FORWARD (same direction as king, toward horizon)" |
| Voiles SVG triangulaires | Gemini génère des petits triangles symboliques → Kling hallucine | "dark wooden pirogues with rowers" + negative "white sail triangles" |
| Rayon de lumière théâtral | Gemini hallucine "éclairage dramatique" dans scènes nocturnes | Nano Banana pour supprimer, puis dans le negative_prompt |
| Double pirogue (coque dans coque) | Conflits de descripteurs dans le prompt | "ONE large wooden pirogue" — singulier et précis |

### Gemini modèle pour édition chirurgicale

- `gemini-3-pro-image-preview` OBLIGATOIRE pour édition chirurgicale (respecte la composition)
- `gemini-3.1-flash-image-preview` = régénère tout = à éviter pour corrections

### Bonus non demandé : reflet dans l'eau

Kling O3 ajoute spontanément des reflets de personnages dans l'eau (scène nocturne, personnage debout, eau sombre). Ne pas mettre dans le negative_prompt — c'est un bonus cinématique gratuit.

### Décision overlay texte

Aziz a décidé : pas de texte overlay sur Beat04 (le visuel parle de lui-même).
**Règle** : un overlay texte est justifié seulement si l'image est ambiguë sans lui.

---

## Session Brainstorming 2026-03-15 — Recraft vivid_shapes + Kling O3 + Cartes

> Details complets dans `memory/video-generation-pipeline.md`. Ici : learnings comportementaux uniquement.

### Score Kimi ≠ preference Aziz sur la duree

V2A Amanirenas (8s, score Kimi 7.2) prefere visuellement a V1 (5s, score Kimi 8.7) par Aziz.
8s = orbit plus complet + Kling anime les elements de fond naturellement (pyramides, nuages).
**Regle :** faire confiance a l'oeil d'Aziz sur la duree. Score Kimi = reference, pas verdict absolu.

### Zoom max sur image raster dans Remotion = 2x

Au-dela de 2x = pixelisation visible. Valide sur carte Gemini dans HannibalNarration.
Referer a `src/projects/style-tests/HannibalNarration.tsx` pour la technique narration symbolique.

### Recraft vivid_shapes = outil de direction narrative, pas de production finale

Les images Recraft vivid_shapes semblent ordinaires vues isolement. Kling les eleve en clips exceptionnels.
- Recraft vivid_shapes + O3 : l'image source est une **intention** — Kling cree la scene entre les deux
- Semi-realiste Gemini + V3 Pro : l'image source doit etre parfaite — Kling anime ce qui est la

---

## Session 2026-03-16 — Beat05 a Beat09 / Pipeline complet GeoAfrique

### Kling : plan moyen obligatoire pour tout mouvement camera

Personnage a 90% du cadre = crane up flottant, dolly in bon marche. Personnage a 50-55% = vrai mouvement cinematique.
**Regle :** generer un "plan moyen" (fullshot) via Gemini avant tout clip Kling avec mouvement camera.

### Kling V3 Standard locked = vie microscopique sans morphing

Pour scènes symboliques (silhouette, double exposition) : V3 Std cfg 0.3 + prompt "static locked shot".
Resultat : vagues intérieures animées, poussiere atmospherique, ligne d'horizon fixe. Stable 5s complet.
**Regle :** V3 Pro pour portraits cinématiques, V3 Std pour scènes symboliques statiques.

### Gemini retouche chirurgicale = edit pixel-perfect

`Part.from_bytes()` + instruction "keep IDENTICAL except ONE change" = edit ultra-précis.
Valide sur : correction zone noire (beat06), etalonnage couleur froid (beat07), ajout handlers caravane (beat05).
**Regle :** jamais regenerer from scratch si seul un element doit changer. Retouche chirurgicale d'abord.

### Etalonnage couleur narratif — palette froide vs chaude

Contraste delibere de temperature couleur = narration sans mots.
Beat06 (Abou Bakari) : navy + or + etoiles = chaleur, humanite, spiritualite.
Beat07 (Colomb) : gris-bleu + blanc terne + nuages plombes = froideur, mecanique, factuel.
**Regle :** palette froide/chaude est une decision narrative, pas esthetique.

### Split screen dans Remotion — div overflow:hidden (PAS clipPath)

`clipPath: inset()` ne fonctionne pas correctement avec `OffthreadVideo` dans Remotion.
Solution correcte :
```tsx
<div style={{ position: "absolute", top: 0, left: 0, width: HALF, height: H, overflow: "hidden" }}>
  <OffthreadVideo style={{ position: "absolute", top: 0, left: -HALF, width: W, height: H }} />
</div>
```
Pour afficher la moitie droite d'un clip : `left: -HALF` sur la video, conteneur `left: 0, width: HALF`.
**Regle :** split screen = div containers avec overflow:hidden, jamais clipPath SVG.

### Silhouette dans clip = verifier quelle moitie contient le sujet

Beat06 source : silhouette dans la moitie DROITE du cadre (roi a droite, vide a gauche).
Pour split screen gauche = afficher moitie droite du clip = `left: -HALF` sur la video.
**Anti-pattern :** supposer que "gauche du clip" = "sujet visible" sans regarder l'image source.

### Audio mute partiel dans Remotion = volume prop fonction

```tsx
<Audio
  src={staticFile("audio/main.mp3")}
  volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp"
  })}
/>
```
Whisper donne le timestamp mais le vrai debut audio peut etre ~0.5s avant le timestamp Whisper.
Ajuster MUTE_START empiriquement (-0.5s) si la premiere syllabe est encore entendue.

### Morphing Kling O3 sur design plat = degrade apres 6-8s

O3 sur images flat 2D : stable 0-6s, morphing progressif apres. cfg_scale 0.3 etend legerement la fenetre.
Solution : `durationInFrames` dans Remotion pour couper avant le morphing. Pas besoin de regenerer.

### Endpoints Kling via fal.ai (valides 2026-03-16)
- `fal-ai/kling-video/v3/pro/image-to-video` — portraits cinématiques
- `fal-ai/kling-video/v3/standard/image-to-video` — scènes symboliques, economique
- `fal-ai/kling-video/o3/standard/image-to-video` — scenes epiques, start+end frame
- `fal-ai/kling-video/v1-5/standard/image-to-video` — DEFUNCT (404)
- Authentification : `FAL_KEY` dans .env — PAS de cle Kling directe
**Validation :** pour recraft vivd- shapes juger le clip, pas les images sources. Valider la coherence de limage et les traits distinctifs historiques.

---

## Technique `elements` Kling — Regles apprises (2026-03-17, PROUVEE)

### Ce que c'est
Parametre `elements` dans les endpoints Kling V3/O3 : tu fournis des images de reference des personnages AVANT la generation. Kling les utilise pour verrouiller le style visuel tout au long du clip.

### Workflow valide
```python
"elements": [
    {"frontal_image_url": url_personnage_principal, "reference_image_urls": []},
    {"frontal_image_url": url_personnage_secondaire, "reference_image_urls": []},
]
# Dans le prompt : @Element1 marche en tete, @Element2 suit en formation
```

### Probleme resolu
Soldats secondaires qui derivent vers le semi-realiste (blanc/gris) en cours de clip.
Avec `elements` : soldats restent dark navy/violet de facon stable du debut a la fin. Confirme Kimi 9.5/10.

### Limites et comportements de Kling avec elements (IMPORTANT)

**1. Forme des objets (bouclier, armes) : Kling ignore la ref**
- Ref soldat : bouclier ROND, clairement visible, bras tenant la poignee
- Resultat Kling : bouclier CARRE (style default Kling pour soldats militaires)
- Cause : Kling a une "memoire" interne des objets militaires qui prime sur la ref
- Regle : ne pas compter sur `elements` pour imposer une forme d'objet precise (bouclier, casque, arme). Utiliser le prompt texte en renfort ("round shield", "circular shield") + negative_prompt ("square shield", "rectangular shield")

**2. Couleur tunique/vetements : start frame prime sur elements**
- Ref soldat : tunique violette sur corps sombre
- Resultat Kling : corps marine uniforme (couleur du start frame)
- Cause : Kling reconcilie elements + start frame et choisit la couleur dominante du start frame
- Consequence : acceptable visuellement (cohesion avec Hannibal), mais la tunique violette de la ref n'est pas transferee
- Regle : `elements` verrouille le STYLE global et la SILHOUETTE, pas les details de couleur des vetements si le start frame dicte autre chose

**3. Bras/main tenant un objet : simplifie dans l'animation**
- Ref soldat : bras gauche visible, main sur poignee du bouclier
- Resultat Kling : bouclier semble "flotter" (bras non visible dans animation)
- Cause : animation de marche de dos = les bras se balancent, la relation bras/bouclier est simplifiee
- Regle : ne pas attendre que Kling reproduise exactement la prise en main d'un objet dans une animation de marche

### Archetype trigger — Regle generale Kling (elements ou non)

Decrire la forme ou la nature specifique d'un objet dans le prompt (ex: "round circular shields", "curved sword", "rectangular banner") peut pousser Kling a re-imaginer TOUTE la composition ou le personnage portant cet objet — pas seulement l'objet lui-meme. Ce n'est pas un bug, c'est Kling qui recalcule l'archetype visuel global pour que tout soit coherent avec la nouvelle contrainte.
Ce comportement s'applique a n'importe quel personnage, element de decor, ou accessoire dans le clip — pas seulement aux soldats.
**Regle** : une fois qu'une generation est validee visuellement, NE PAS modifier le prompt pour corriger un detail d'objet. Si le detail est vraiment critique, le corriger via Gemini edit sur la frame source AVANT de lancer Kling — pas via le prompt Kling.

### Hannibal = double verrouillage (start frame + @Element1) = stable partout
Soldats secondaires = verrouillage unique (@Element2) = plus fragile, plus de variations entre generations.
Pour maximiser la stabilite d'un secondaire : lui donner aussi une presence dans le start frame.

### Crop pour Element de reference — Regle generale (pas seulement Element3)

Quand on utilise une image croppee comme element de reference Kling (frontal_image_url), tout ce qui est visible dans le crop — meme en peripherie, meme si c'est du fond — peut etre extrapole et transfere a tous les personnages ou elements animes dans le clip.
La couleur est particulierement contaminante : un tissu violet en bordure de crop = Kling peut habiller tous les personnages en violet.
**Regle generale :** le crop doit contenir UNIQUEMENT l'information que tu veux transmettre. Si autre chose est visible (couleur differente, texture, vetement), Kling risque de l'extrapolar sur l'ensemble du clip.
**Consequence pratique :** si le crop parfait est impossible a obtenir proprement, il vaut mieux ne pas utiliser cet element plutot que d'introduire une contamination visuelle non desiree.
**Division du travail :** Aziz fait les crops manuellement (vue directe sur l'image). Claude ne crop pas a l'aveugle avec des coordonnees.

### Forme du bouclier = laisser Kling décider (DECISION FINALE)
Se battre pour rond vs carré via prompt = gaspillage de crédits. Kling choisit une forme cohérente avec son archétype militaire flat 2D. Acceptable historiquement. Sujet clos.

### Ombres au sol = bonus Kling non demande, toujours present
Hannibal + soldats ont des ombres portees au sol synchronisees avec la marche.
Artefact positif constant entre toutes les generations. Ne pas le mentionner dans le prompt — Kling le fait naturellement.

### Bonus Kling non demandes recurrents (a ne pas bloquer dans le negative_prompt)
- Ombres portees au sol synchronisees avec la marche
- Criniere/panache anime sur le casque du general
- Epee ou arme dans la main du general (renforce l'autorite visuelle)
Ces ajouts sont positifs et coherents avec l'esthetique. Les laisser faire.

### Ce que elements verrouille efficacement
- Silhouette globale (forme du corps, proportions)
- Ton de couleur dominant (dark navy vs clair/blanc)
- Style graphique (flat vs semi-realiste)
- Cohesion visuelle entre personnage principal et soldats secondaires

### Assets canoniques pour Hannibal
- Hannibal REF : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
- Soldat type REF (de dos) : `tmp/brainstorm/references/hannibal-soldier-type-REF.png`
- Script generation soldat : `scripts/generate-hannibal-soldier-ref.py`
- Script Kling avec elements : `scripts/test-hannibal-elements-v1.py`
- Clip valide reference : `tmp/brainstorm/hannibal-elements-v1.mp4` (9.5/10 Kimi)

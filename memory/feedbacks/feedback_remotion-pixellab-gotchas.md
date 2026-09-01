# Remotion + PixelLab gotchas — bugs à éviter

> Migré depuis auto-memory 2026-08-31 (contenu original 2026-05-02, session Atlas Shaka Zulu).
> Bugs récurrents lors du codage de scènes Remotion utilisant des sprites PixelLab MCP, avec leurs fixes.

## Règle 1 : Vérifier le frame count des animations PixelLab AVANT de coder

**Bug** : Hook Atlas Shaka 2026-05-02. J'ai supposé `breathing-idle = 8 frames` (cohérent avec `fight-stance-idle-8-frames`). En réalité c'était 4 frames. Erreur "EncodingError: source image cannot be decoded" sur `frame_004.png`.

**Fix** : avant de coder un composant qui utilise un sprite PixelLab, faire `ls public/<asset>/animations/<animation-id>/<direction>/` pour compter les fichiers `frame_XXX.png`.

**How to apply** : si nom animation contient `8-frames` ou `6-frames` → fait. Sinon → `ls` obligatoire.

**Frame counts connus** :
- `walking-X` : 6 frames (walking-ba529e39, walking-38346bae confirmés)
- `breathing-idle` : **4 frames** (PAS 8)
- `fight-stance-idle-8-frames` : 8 frames (nom explicite)
- `running-6-frames` / `running-8-frames` : 6 ou 8 selon nom explicite

## Règle 2 : Sprites PixelLab — utiliser width/height fixes, PAS maxHeight/objectFit contain

**Bug** : Iklwa et bouclier Atlas Shaka 2026-05-02. Avec `maxHeight: 720, maxWidth: 900, objectFit: contain`, l'image apparaissait beaucoup plus petite que prévu (~600x600 au lieu de 720x900).

**Why** : `maxHeight + objectFit contain` respecte l'aspect ratio de l'image source. Si l'image source est carrée (1024x1024 Gemini) ou très petite (92x92 PixelLab), elle se contraint au plus petit côté.

**Fix** : utiliser `width: X, height: X` fixes (ex. `width: 900, height: 900`) — laisse le browser scaler. Combiner avec `objectFit: contain` si besoin de préserver aspect.

**How to apply** : pour tout `<Img>` avec sprite PixelLab ou image illustration, hardcoder width/height en pixels. Tester sur mini-render. Si trop gros/petit, ajuster les pixels (pas le maxWidth).

## Règle 3 : transformOrigin pour rotation — préférer "center center" sauf raison explicite

**Bug** : Iklwa Atlas Shaka 2026-05-02 — `transformOrigin: "center bottom"` faisait tourner l'iklwa autour du bas du conteneur, ce qui décalait visuellement l'image vers la gauche pendant la rotation.

**Why** : `center bottom` met le pivot au milieu en X mais en bas en Y. Quand on tourne l'objet, son centre visuel ne reste pas au centre de l'écran.

**Fix** : default `transformOrigin: "center center"` pour toute rotation Remotion. Utiliser `bottom` uniquement si on simule une chute d'arbre ou une frappe à partir du bas (rare).

## Règle 4 : Rotation continue 360° = bizarrerie sur objets asymétriques

**Bug** : Bouclier Atlas Shaka — j'avais codé `wristRotation: 0 → 360deg` pour simuler "tourner le poignet". Résultat : à 90deg/270deg le bouclier ovale vertical devient ovale horizontal, ce qui est anti-naturel et illisible.

**Fix** : pour des effets "rotation", utiliser des oscillations bornées via `Math.sin(frame * speed) * amplitude` (ex. -15° ↔ +15°). Garde l'objet reconnaissable.

**How to apply** :
```ts
// MAUVAIS :
const rotation = interpolate(frame, [0, 90], [0, 360]);
// BON :
const rotation = inActivePhase ? Math.sin((frame - start) * 0.15) * 15 : 0;
```

## Règle 5 : Composition Remotion avec composant typé → cast `as any` ou Zod schema

**Bug** : Atlas Shaka — TypeScript erreur `Type 'FC<MyProps>' is not assignable to type 'LooseComponentType<Record<string, unknown>>'` sur `<Composition component={MyComp} ... />`.

**Why** : Remotion exige les composants composition d'avoir des props compatibles avec `Record<string, unknown>`. Un composant `React.FC<{ durationFrames: number; ... }>` ne matche pas.

**Fix rapide** : caster `component={MyComp as any}` avec `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.

**Fix propre (futur)** : passer par Zod `defaultProps` schema (Remotion supporte Zod natif). Voir doc officielle.

## Règle 6 : Charger .env dans tout script Python

**Bug** : `generate-shaka-inserts-gemini.py` — `os.environ.get("GEMINI_API_KEY")` retournait None malgré la clé présente dans `.env`.

**Why** : Python n'auto-load pas `.env`. Il faut `python-dotenv` ou parser manuellement.

**Fix** : pattern à coller en haut de TOUS les scripts Python qui utilisent une clé API :
```python
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())
```

## Règle 7 : Kimi K2.5 Moonshot — `thinking: disabled` obligatoire pour avoir une réponse

**Bug** : Brief Kimi Atlas Shaka — premier appel avec `thinking: enabled` retournait une réponse VIDE (tokens consommés mais content vide).

**Why** : `thinking enabled` consomme la quota completion en raisonnement interne. Pas de tokens restants pour la réponse.

**Fix** : `payload["thinking"] = {"type": "disabled"}` toujours. Si on veut du raisonnement, augmenter `max_tokens` (mais teste d'abord disabled).

> Note (2026-08-31) : Kimi K2.5 est PÉRIMÉ côté doctrine projet (voir CLAUDE.md — seul Kimi K3 est autorisé). Ce gotcha `thinking: disabled` reste potentiellement pertinent pour K3, à re-vérifier avant usage (cf `memory/tools/kimi-k3-reasoning-borne.md`).

## Règle 8 : Moonshot peut être HTTP 429 overloaded — fallback OpenRouter ready

**Bug** : Atlas Shaka Kimi brief — Moonshot retournait `engine_overloaded_error` plusieurs fois consécutives.

**Fix** : tout script Kimi doit supporter `--backend openrouter` en fallback. Le modèle est le même, juste le proxy change.

## Règle 9 : PixelLab map_object download — toujours `curl --fail`

**Bug** : sans `--fail`, curl sauve les réponses d'erreur HTTP comme fichiers (ZIP corrompu, PNG vide).

**Fix** : `curl --fail -o file.png "https://..."` toujours. Vérifier `file size > 1KB` après download.

## Règle 10 : PixelLab jobs expirent après 8h

**Important** : map_objects et characters PixelLab MCP sont auto-supprimés 8h après création. Toujours :
1. Logger les `object_id` / `character_id` dans `out/<projet>-pixellab-jobs.json` avec timestamp
2. Télécharger les ZIP/PNG immédiatement après que le job est ready
3. Si on veut les retoucher plus tard → re-générer (ils ne reviendront pas)

## Règle 11 : Scanner les assets PixelLab existants AVANT toute nouvelle génération

**Bug** : 2026-05-02 Shaka Zulu Vague 2. Sur le point de lancer 5 générations PixelLab (caravane impi + Shaka idle) avant decouvrir que tous les sprites necessaires existaient deja depuis la session nuit autonome (Shaka rotations + walk + warcry + royal, Warrior zoulou rotations + walk + attack + warcry, Nandi rotations, iklwa + bouclier inserts).

**Fix** : avant toute generation PixelLab, scanner systematiquement :
- `public/<projet>/characters/<perso>/{rotations,animations}/`
- `public/<projet>/archive/<animation-name>/`
- `public/<projet>/assets/*.png`
- `public/<projet>/inserts/pixellab/*.png`
- `out/<projet>-pixellab-jobs.json` (log des jobs precedents)

**How to apply** : commande de scan pre-generation :
```bash
find public/<projet> -name "*.png" -path "*/characters/*" -o -path "*/archive/*" -o -path "*/inserts/pixellab/*" | sort
ls out/<projet>-pixellab-jobs.json 2>/dev/null && cat out/<projet>-pixellab-jobs.json
```

**Why** : economie de credits PixelLab + 5-25 min attente par session. PixelLab credits sont 2000/mois mais inutile de les bruler. Surtout : risque oublier les sprites deja genere et generer un duplicata avec parametres legerement differents (incoherence visuelle entre scenes).

## Règle 12 : Vérifier visuellement les "frames" PixelLab AVANT de les utiliser comme walk cycle

**Bug** : 2026-05-02 Shaka Zulu Vague 2. J'ai utilise les fichiers `archive/warrior-walk-east/frame_000.png` a `frame_005.png` en supposant que c'etait un walk cycle de 6 frames. Resultat dans la video : les personnages "palpitent" et changent de forme/posture/orientation a chaque frame.

**Cause** : ces dossiers `archive/<perso>-<animation>-east/frame_XXX.png` contiennent en realite **6 designs differents** d'un personnage (variations PixelLab MCP), pas une animation. Chaque frame est un perso distinct.

**Comment differencier walk cycle vrai vs variations** :
- Vrai walk cycle : meme silhouette, meme costume, meme orientation, juste les jambes/bras qui bougent. Continuite visuelle entre frame_000 et frame_005.
- Variations design : personnages totalement differents, postures variees, accessoires changent. Aucune continuite.

**Fix** : avant d'utiliser `frame_XXX.png` en boucle dans Remotion :
1. Lire 3 frames espacees (frame_000, frame_002, frame_005) avec le tool Read
2. Verifier visuellement que c'est le meme perso en mouvement
3. Si NON : utiliser UN seul frame statique representatif comme image fixe
4. Si OUI : appliquer la boucle `Math.floor((frame * sourceFps / targetFps) % nFrames)`

**Compensation animation** quand sprite statique : ajouter une oscillation verticale legere (`Math.sin(frame * 0.15) * 3px`) pour simuler la respiration. Donne du vivant sans necessiter un vrai walk cycle.

**Animations reelles disponibles dans PixelLab MCP** : characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png — celles-la sont de vrais walk cycles. A ne pas confondre avec archive/ qui peut contenir variations brutes.

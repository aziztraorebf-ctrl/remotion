# Motion Reference Transfer via Seedance 2.0

> Migré depuis auto-memory 2026-08-31 (contenu original 2026-04-13, premier test Soundjata vs Soumaoro).
> Complète `memory/tools/seedance-rules.md` (règle 83 : reference-to-video échoue en paper-craft) —
> ce fichier documente le endpoint reference-to-video et le levier de tempo pour du **transfert de
> chorégraphie** (pas de style), sur un style qui n'est PAS paper-craft (2D graphic novel).

## Principe

Utiliser `bytedance/seedance-2.0/reference-to-video` pour transferer la **choregraphie + mouvements de camera + rythme** d'une video de reference vers une scene avec NOS personnages. Seedance imite la dynamique sans copier les visuels (les refs images pilotent l'identite).

## Endpoint et schema (VALIDE 2026-04-13)

**Path** : `bytedance/seedance-2.0/reference-to-video` (sans prefixe `fal-ai/`)

**Parametres cles** :
- `prompt` (string, requis)
- `image_urls` (array) — jusqu'a 9 refs persos/style
- `video_urls` (array) — jusqu'a 3 refs video
- `audio_urls` (array) — jusqu'a 3 refs audio
- `duration` (string) — "auto" ou "4" a "15"
- `resolution` (string) — **"480p" ou "720p" UNIQUEMENT** (pas 1080p sur cet endpoint)
- `aspect_ratio` (string) — "auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"
- `generate_audio` (bool)

**Contraintes** :
- Videos refs : total cumule 2-15s, 50 MB max
- Images : JPEG/PNG/WebP, 30 MB chacune
- Audios : MP3/WAV, total 15s max

**Cout reel** : $0.3024/s en standard 720p, $0.2419/s en fast 720p.
Test 1 : 10s = $3.02 (pas $0.18/s comme ancienne regle erronee).

## Pipeline valide

```
1. Video de reference (choregraphie existante) — ex: combat anime 22s
2. Couper le meilleur segment 6-8s d'action pure (eviter stances statiques)
3. Generer 2 refs images Gemini (1 par personnage, full body, stance combat, fond neutre)
4. Prompt structure :
   - Style 2D + scene setup
   - @image1 / @image2 = identite physique
   - @video1 = "follow for camera movement, rhythmic timing, fight staging"
   - SECONDS 0-2, 2-4, 4-6, 6-8 avec verbes explosifs
   - COLOR GRADE + anti-instructions standard
5. Call fal.ai -> attendre ~4-5 min
```

## Ce qui marche exceptionnellement bien

- **Coherence personnages 100%** : meme avec 10s de generation, les 2 persos restent identiques aux refs Gemini
- **Transfert de rythme** : le pattern "stance → clash → close-ups → retour stance" du segment B est respecte
- **Cuts camera varies** : wide shot → close-up visage → medium clash → wide final = varie comme la ref
- **Dust/particules** : Seedance ajoute spontanement poussiere sous les pieds, traînees, effets magiques coherents
- **Style 2D graphic novel** : zero contamination photorealisme, outlines bold respectes
- **Magie confinee aux mains** : pas de propagation halo partout

## Leviers de controle decouverts (V1 vs V2, 2026-04-13)

### Tempo du combat = densite MAJUSCULES + descriptions d'effort physique
V1 (prompt ~2450 chars, peu de majuscules) a produit un combat MESURE, prudent, lisible.
V2 (prompt ~3218 chars, beaucoup de MAJUSCULES + "GRUNTING", "SHOUTING", "CHEST HEAVING", "teeth CLENCHED", "battle cries") a produit un combat **~2x plus rapide et intense**.

Meme seed different, meme ref video, memes images = tempo fondamentalement different.

**Regle pratique** : la vitesse d'un combat se dose via
- densite de verbes en MAJUSCULES (LUNGES, STRIKES, SNAPS, CRASHES...)
- descriptions physiques d'effort (grunting, shouting, snarling, heaving)
- nombre total d'actions dans chaque segment SECONDS

Pour un combat plus lent / contemplatif : enlever les MAJUSCULES, retirer les descriptions d'effort corporel, passer a des verbes plus neutres ("moves", "steps", "blocks").

### Tradeoff vitesse vs artefacts d'interpolation
Plus le combat est rapide, plus les artefacts Seedance apparaissent sur les armes et objets en mouvement (sabre qui "flicker" 1-2 frames, duplication brève). C'est le prix a payer pour un combat dense.

**Si le combat ralenti visuellement** : artefacts disparaissent mais intensité baisse.
**Si on densifie les actions** : intensité monte mais risque d'artefact interpolation sur les objets rapides.

A doser selon l'usage final :
- YouTube Shorts (spectateur passif, 24fps scroll) : artefacts mineurs invisibles → privilegier l'intensite
- Scene longue / cinema / gros ecran : ralentir pour eliminer les artefacts

## Gotchas decouverts (TEST 1)

### 1. Bug du sabre fantome (critique)
Si la video de reference montre 2 combattants armes et que notre prompt dit "seul l'un est arme", Seedance peut **materialiser une arme sur le personnage desarme** a un moment fort du combat (frame ~7.5s sur test 1).

**Cause** : conflit entre le motion de la ref (2 armes levees) et notre description (1 seul arme).

**Fix** : clause explicite anti-arme dans le prompt :
```
Soumaoro NEVER touches a weapon, NEVER holds a sabre, NEVER wields a blade.
His hands are ALWAYS empty except for the red magical glow.
He fights EXCLUSIVELY with sorcery. Only Soundjata has a weapon.
```

**Idealement** : choisir une ref video ou un combattant n'est PAS arme (arts martiaux pieds/poings vs armee) pour eliminer le conflit a la source.

### 2. Expressions faciales plates
Nos prompts "fierce, eyes locked" donnent des visages **stoiques/neutres** meme dans un combat intense. Seedance est litteral — si on ne demande pas d'emotion physique explicite, il donne du "pro" inexpressif.

**Fix** : ajouter systematiquement dans les prompts combat :
```
Both warriors show INTENSE physical effort: teeth CLENCHED, eyebrows FURROWED,
mouths SNARLING with battle cries, sweat on brows, veins visible in necks.
Facial muscles tense. Every frame shows combat strain — no neutral expressions.
```

### 3. Aura magique interpretee comme "gants rouges"
Soumaoro a des "gants rouges" dans le resultat — c'est en fait Seedance qui materialise l'aura rouge magique comme des gants permanents (plus stable visuellement qu'un halo qui apparait/disparait). Effet acceptable, meme plutot malin, mais a savoir.

## Recommandations multi-videos (PAS ENCORE TESTE)

Limite officielle : jusqu'a 3 videos refs, total cumule 15s.
Doc officielle **n'explique PAS comment Seedance fond plusieurs videos** — sources Vicsee et GlobalGPT recommandent explicitement de **commencer avec 1 seule video** avant d'experimenter multi-video.
Citation Vicsee : *"Complex choreography almost always produces incoherent motion."*

A tester seulement quand le workflow 1-video est maitrise.

## Fichiers de reference (session 2026-04-13, a re-verifier avant reuse)

- **Videos choregraphie source** : `public/assets/library/references/motion-choreography/`
  - `source-anime-fight-segment-B-4to12s-8s.mp4` — le segment utilise pour les tests, reutilisable
- **Script test V2 (avec corrections)** : `scripts/tools/test-seedance-choreography-v2.py`

## Applications futures

Cette technique est particulierement utile pour :
- **Combats chorégraphiés** (Heros Oublies : Soundjata vs Soumaoro, Yaa Asantewaa vs britanniques, Lat Dior charge de cavalerie, Hannibal bataille)
- **Scenes d'action qui echappent a Seedance en text-to-video** (scenes calmes statiques, scenes complexes ratees)
- **Mouvements de camera signatures** (aerial bataille, snap zoom, dolly in tracking)

Principe : si Seedance echoue en text-to-video pur sur une scene dynamique, chercher une video existante avec la dynamique voulue et l'utiliser comme motion reference.

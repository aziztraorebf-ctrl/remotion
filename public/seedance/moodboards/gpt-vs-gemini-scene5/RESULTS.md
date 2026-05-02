# A/B Test - Seedance 2.0 i2v vs Happy Horse 1.0 r2v

**Date** : 2026-05-01
**Scene** : Sonjata Scene 5 - baobab arrache (10s)
**Wallclock parallel** : 189s

## Parametres communs (controle scientifique)

- Resolution : **720p**
- Aspect ratio : **9:16**
- Duree : **10s**
- Storyboard input : `A-gemini-v2-FROM-SCRATCH.png` (papercraft 9-panel)
- Audio : DESACTIVE pour parite (Sonjata pipeline mixe audio dans Remotion)
- **MEME prompt** envoye aux deux endpoints
- **MEME storyboard** uploade comme reference visuelle

Image uploade : https://v3b.fal.media/files/b/0a987b33/A70X0uolCaxpnG8vROKnY_A-gemini-v2-FROM-SCRATCH.png

## Prompt envoye (identique aux deux modeles)

```
Reference image: 9-panel papercraft storyboard of a young African boy uprooting a baobab tree.

Use the storyboard ONLY as visual DNA - character appearance, papercraft sepia style, thick black outlines, warm earthy palette, village setting are ALL LOCKED from the reference.

Output: ONE continuous cinematic shot, no panel borders visible, no comic grid structure in output, single seamless animated sequence.

Action: a young African boy with dark chocolate brown skin, curly black hair, red sash at waist, bare-chested, walks toward a giant baobab tree, grips the trunk with both arms, pulls hard until the ground cracks and roots tear free, lifts the entire baobab above his head triumphantly, then walks carrying it over his shoulder toward his mother and lays it on the ground at her feet while the diverse village crowd watches in awe.

Style: papercraft cutout aesthetic, warm sepia palette, thick black outlines, chibi proportions, dot-eyes for background characters, Mande village with conical straw huts and clay-red ground, golden hour lighting. NO floating particles, NO dust motes, NO sparkles, NO text, NO banners, NO signs visible anywhere. Smooth continuous footage.
```

## V1 - Seedance 2.0 i2v

- **Endpoint** : `bytedance/seedance-2.0/image-to-video` (NO `fal-ai/` prefix)
- **Status** : OK techniquement
- **Generation** : 189s
- **Output** : `V1-seedance-720p-10s.mp4` (5.0 MB)
- **URL fal** : https://v3b.fal.media/files/b/0a987b45/OoCMb45X5Q5R22cj2dm4W_video.mp4
- **Cout estime** : ~$3.02 (a confirmer, fal a documente $0.30/s 720p ; $0.683/s 1080p observe sur memory)

### Self-review V1 (frames t0/t2/t4/t6/t8/t9.5)

| Critere | Verdict |
|---------|---------|
| Bordures de panels visibles | **ECHEC CRITIQUE** : t0s = la grille 9 panels EST l'image animee. Numeros "1"..."9" visibles, separateurs visibles. Le modele a anime le storyboard tel quel pendant ~0.5s avant de zoomer sur panel 1. |
| Style papercraft fidele | Partiel : style cartoon plus propre/lisse, **drift vers 2D anime generique**. Perte de la texture "cutout" papier (pas de bord blanc, pas de profondeur). |
| Action narrative complete | **ECHEC** : reste largement statique sur la pose de grip apres le zoom. Pas de progression pull -> tear -> lift -> carry -> lay. Symptome classique de la regle 68 Seedance ("near-static for calm scenes"). |
| Coherence personnage | OK : red sash, dark skin, cheveux boucles, chibi. |
| Particules parasites | OK : pas de dust motes. |

## V2 - Happy Horse 1.0 r2v

- **Endpoint** : `fal-ai/happy-horse/reference-to-video`
- **Status** : OK
- **Generation** : 185s
- **Output** : `V2-happy-horse-720p-10s.mp4` (7.1 MB)
- **URL fal** : https://v3b.fal.media/files/b/0a987b45/AF2ZlrwHiI8rE7iUGcojH_sdKMG5bW.mp4
- **Cout estime** : ~$1.40 (~$0.14/s 720p)

### Self-review V2 (frames t0/t2/t4/t6/t8/t9.5)

| Critere | Verdict |
|---------|---------|
| Bordures de panels visibles | **OK** : ZERO panel border, traite le storyboard comme visual DNA (pas comme frame literale). Plan continu cinema. |
| Style papercraft fidele | **EXCELLENT** : t2s+ montre des bords blancs cutout autour du personnage = vraie esthetique papercraft. Sepia warm conserve, contours noirs epais, chibi proportions. |
| Action narrative complete | **OK** : arc complet visible. t0=village wide, t2=approche+grip, t4=effort+sol craque (fissures larges), t6=lift, t8=carry vers groupe, t9.5=baobab couche au sol + boy + mere + foule applaudissant. |
| Coherence personnage | OK : red sash, dark skin, chibi. Mere apparait correctement a la fin (specifiee dans prompt). |
| Particules parasites | OK majoritairement : un peu de poussiere de sol fine a t9.5s mais c'est diegetique (post-impact baobab). |

## Verdict comparatif

**Happy Horse 1.0 gagne ce test de maniere decisive.**

| Critere | V1 Seedance 2.0 | V2 Happy Horse 1.0 |
|---------|-----------------|---------------------|
| Cout 10s 720p | ~$3.02 | ~$1.40 |
| Bordures panels visibles | ECHEC (grille pendant ~0.5s) | OK |
| Fidelite papercraft | Drift cartoon | Excellent (cutout edges) |
| Action narrative complete | Statique (rule 68) | Arc complet 10s |
| Vitesse | 189s | 185s |
| **Recommandation** | A eviter sur i2v storyboard | **Adopter pour i2v storyboard papercraft** |

### Pourquoi Seedance a echoue

Hypothese : Seedance 2.0 i2v traite l'image input comme **first frame literal a animer** (i2v classique). Pour un storyboard 9-panel, il anime donc la grille telle quelle, puis - pour eviter la rigidite - zoome sur un panel apres ~15 frames. Cette strategie est incompatible avec le pattern "Visual DNA + Timed Segments" suggere par la recherche recente.

A l'inverse, Happy Horse `reference-to-video` traite l'image comme **reference de style/identite** et genere une scene continue from scratch en s'inspirant de la grille (pas en l'animant). Behavior aligne avec ce qu'Aziz cherche pour Sonjata.

### Implications pipeline Sonjata / autres Shorts papercraft

1. **Si on veut animer un storyboard 9-panel** -> utiliser `fal-ai/happy-horse/reference-to-video` (pas Seedance i2v).
2. **Pour Seedance 2.0 i2v** -> envoyer une SEULE image cadree (pas une grille). Le modele est i2v classique, pas reference-to-video.
3. **Economie potentielle Sonjata 6 scenes** : ~$10 par episode si on switch i2v -> Happy Horse r2v sur les scenes basees sur storyboards.
4. **Audio** : Happy Horse genere aussi de l'audio natif si demande, mais on l'a desactive ici. Sur Sonjata, le pipeline audio est ElevenLabs+Minimax dans Remotion, donc pas de regression.

### Caveats avant adoption en production

- **Test scientifique unique** : 1 prompt, 1 scene. Refaire sur 2-3 scenes Sonjata (action + calme + foule) avant adoption systematique.
- **Frame chaining ?** : verifier si Happy Horse supporte start/end frames pour transitions inter-scenes (Seedance i2v supporte `end_image_url` per regle 84).
- **Identity drift** : sur des sequences plus longues ou multi-personnages, refs Seedance Omni reference-to-video (jusqu'a 9 images) peuvent etre superieures - tester `bytedance/seedance-2.0/reference-to-video` vs Happy Horse separement.
- **Comparaison "fair"** : Seedance i2v reçoit une grille comme premier frame = handicap. Le test "fair" serait Seedance reference-to-video vs Happy Horse reference-to-video. A faire en suivant.

## Notes pipeline / decouvertes techniques

1. **Slug Seedance 2.0** : `bytedance/seedance-2.0/image-to-video` (PAS `fal-ai/bytedance/seedance-2.0/...`). Le prefix `fal-ai/` retourne 404 a l'execution. La memoire projet etait incorrecte sur ce point ; **a corriger dans `memory/tools/seedance-rules.md` regle 58 et `memory/pipeline.md`**.
2. **Schema Seedance 2.0 i2v** :
   - `resolution` : `'480p'` | `'720p'` | `'1080p'`
   - `duration` : `'auto'` | `'4'`...`'15'` (string)
   - `aspect_ratio` : `'auto'` | `'21:9'` | `'16:9'` | `'4:3'` | `'1:1'` | `'3:4'` | `'9:16'`
3. **Schema Happy Horse 1.0 r2v** :
   - `resolution` : `'720p'` | `'1080p'`
   - `duration` : int 3..15
   - `aspect_ratio` : `'16:9'` | `'9:16'` | `'1:1'` | `'4:3'` | `'3:4'`
   - `image_urls` : array (1..9 refs)
4. **Cout total test** : ~$4.42 (sous le budget $5).

## Fichiers livres

- `V1-seedance-720p-10s.mp4` (5.0 MB)
- `V2-happy-horse-720p-10s.mp4` (7.1 MB)
- `frames/V1-t{0,2,4,6,8,9.5}s.jpg` + `frames/V2-t...jpg`
- `run_ab_test.py` (script reproductible)

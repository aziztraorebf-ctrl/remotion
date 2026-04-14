# Seedance 2.0 — Reference Complete Prompts & Techniques
> TOUT pour ecrire un prompt Seedance : formats, techniques camera, VFX, dialogue, pipeline Remotion.
> Apres avoir ecrit le prompt, verifier contre `seedance-rules.md` (checklist 25 regles).
> Mise a jour : 2026-04-02

---

## Acces et Contraintes

- **Plateforme** : Dreamina web uniquement (API suspendue overseas — copyright dispute mars 2026)
- **Credits** : achats de credits + credits gratuits journaliers
- **Resolution** : 720p (gratuit), 1080p (payant)
- **Duree max** : 15s par generation | **FPS** : 24fps | **Format** : H.264 MP4 + audio AAC stereo

| Mode | Credits |
|------|---------|
| Text-to-video (sans ref) | 80 |
| Text-to-video + 1 ref image | 80 |
| Text-to-video + 2+ ref images | 120 |
| Image-to-video | 120 |

---

# PARTIE 1 — FORMATS DE PROMPT

## Format 1 — Narratif lineaire (~40 mots)

```
Camera follows [sujet] [action 1]. The shot cuts to [angle] as [action 2].
[Action 3]. Sounds of [ambiance].
```
- Usage : scenes simples, un seul personnage, action lineaire. Controle camera faible.
- **Meilleur pour paysages/flottes** : SECONDS surdecoupe les scenes sans personnage.

---

## Format 2 — Storyboard numerote (~75 mots)

```
[duree] [genre]. Shot 1: [angle], [sujet] [action], [detail].
Shot 2: [close-up], then [angle] of [action], [effet].
Shot 3: [angle large], [climax], text '[message]' revealed.
```
- Usage : multi-shot structure, changements de lieu/angle. Controle camera moyen.

---

## Format 3 — Timecodes SECONDS X TO Y (~150-200 mots) — RECOMMANDE

```
@Image1 is the primary character identity. [style].

SECONDS 0 TO 3: [description plan 1, camera, action].
SECONDS 3 TO 6: [description plan 2, transition, detail].
SECONDS 6 TO 8: [description plan 3, climax].
SECONDS 8 TO 10: [description plan 4, resolution].

COLOR GRADE: [palette complete].
```
- Usage : controle maximal, scenes complexes, transitions de perspective. **RECOMMANDE pour GeoAfrique.**
- Notation alternative : `[0.0s-3.0s]` = equivalent de `SECONDS 0 TO 3`. Les 2 fonctionnent.
- Duree segments : 2-3s par segment pour 10s, 3-4s pour 15s. Ne pas surcharger.

---

## Format 4 — Plan-sequence impossible (~100-150 mots)

```
Continuous single take, camera tilting, rolling, spinning, flying through [lieu].
Starts [lieu A, action, details]. Camera [transition physique impossible]
into [lieu B, details]. Sweeps [mouvement] through [lieu C].
Camera [transition] into [lieu D, climax].
Transitions [mouvement final] into [lieu E, resolution].
No cuts, impossible camera moves, seamless transitions, energetic, dynamic, cinematic.
8K high definition, high quality footage.
```
- Usage : exploration d'un lieu complexe, transitions entre espaces, pas de personnage principal. **PAS de timecodes.**
- **SUPERIEUR a SECONDS pour plans-sequences sans personnage** — SECONDS surdecoupe le flux continu
- Compatible ultra-wide 21:9 + 60fps
- **Variante avec shots numerotes** : `Shot 01 (0:00-2:00):` — plus de controle sur le rythme + pauses narratives. "Fade to black" final fonctionne.
- Source : @ChangningL29508 — cruise ship, medieval tavern, amazon rainforest, night market. Tous parfaits.

### Vocabulaire de transition (mots-cles prouves)

| Mot | Transition |
|-----|-----------|
| "dives through" | Plongee a travers une surface |
| "sweeps out onto" | Emergence vers un espace ouvert |
| "bursting out of" | Sortie explosive (cascade, cheminee) |
| "passing through" | Traversee de surface solide (mur, sol en verre) |
| "gliding past" | Passage lateral fluide pres d'obstacles |
| "weaving through" | Slalom entre obstacles |

---

## Format 5 — Prose technique steadicam (~100 mots)

```
Rear chase steadicam [distance] behind [sujet] locked at [vitesse] through [lieu],
camera height [hauteur] matching exact pace zero vertical drift.
Subject banks hard left [angle] degrees around [obstacle], [description physique mouvement].
Immediate right bank [angle] degrees threading gap between [obstacles],
[details eclairage, motion blur]. [Enchainement virages avec angles precis].
Sustained maximum velocity throughout, every direction change environmentally motivated,
camera locked parallel never deviating from [position].
```
- Usage : poursuite/suivi d'un sujet en mouvement continu. PAS de timecodes, PAS de shots.
- Specifications numeriques (km/h, degres, metres) = Seedance interprete comme contraintes
- Source : @ChangningL29508 — cheetah chase (15s, ultra-wide 21:9, 60fps). Parfait.

---

## Format 6 — Scenes narratives avec transitions nommees (~300+ mots)

```
[Instructions globales : camera, style, contraintes, anti-instructions]

[Scene A] : [description action + decor + vetements]

[Transition A vers B] : [personnage fait une action aerienne/spin],
instantly in slow motion, the camera slowly circles around [personnage],
[vetements changent naturellement vers tenue B],
the scene gradually changes to [decor B],
the transition is natural and without abrupt changes.

[Scene B] : [description action + decor]

[Transition B vers C] : [meme pattern slow-mo orbital + changement]

[Scene C] : [description action + decor]

Sound effects: [description audio continue couvrant toutes les scenes]
```
- Usage : meme personnage dans plusieurs contextes/epoques/lieux avec transitions fluides
- **Cle** : slow-mo orbital = vehicule de transition. Le ralenti + orbite camera donne le temps a Seedance de transformer vetements + decor
- **Anti-instructions obligatoires** : "no unnecessary 360-degree turns", "without motion distortion", "without abrupt changes"
- Transformation d'objets possible : "skateboard smoothly transforms into ski"
- Source : @liyue_ai — 4 saisons en 15s, meme personnage, 4 tenues, transitions parfaites.

### Application historique
- Abou Bakari : palais (robe royale) -> slow-mo -> port (tenue marin) -> slow-mo -> mer (exploration)
- Peste 1347 : ville vivante (couleurs chaudes) -> slow-mo -> ville morte (grise, desaturee)

### Format 6 comme ARCHITECTURE de Short (decision 2026-04-04)

Le Format 6 peut remplacer l'approche "1 beat = 1 clip" par "1 clip = 2-3 beats avec transitions internes".

| Short 60s | Ancienne approche | Format 6 |
|-----------|-------------------|----------|
| Clips | ~6 x 10s | **4 x 15s** |
| Beats narratifs | 6 (1/clip) | **8-12** (2-3/clip) |
| Coutures | 5 a masquer | **0** — transitions internes |
| Credits | 480-720 | **320-480** |
| Assemblage Remotion | Complexe | Simplifie |

Chaque clip de 15s contient ses propres transitions cinematographiques (slow-mo orbital). Pas de post-prod pour les transitions.
Audio ElevenLabs + musique Suno restent en overlay Remotion par-dessus.

---

## Format 7 — Beat Sync / Montage rapide (~300+ mots) — VALIDE 2026-04-05

```
FORMAT: [duree]s / [BPM] BPM / [N] SHOTS / beat-synced routine
SUBJECT: [description personnage]
ENVIRONMENT: [lieux traverses]
MOOD: [arc emotionnel]
MUSIC: [genre musical]
LOGIC RULE: Keep logical consistency in wardrobe, props, locations, and action continuity across all shots.

SHOT 1: [type plan], [focale optionnelle] / [description action] / SFX: [sons].
SHOT 2: [type plan], [focale optionnelle] / [description action] / SFX: [sons].
...
SHOT N: [type plan], [focale optionnelle] / [description action] / SFX: [sons].

COLOR GRADE: [palette complete].
```
- Usage : montage rapide rythme, routine quotidienne, progression narrative en coupes rapides
- **Teste avec 10 shots en 15s** (~1.5s par shot) — coupes distinctes, rythme soutenu
- Types de plans : ECU, WS, MCU, MS, CU, Insert, Aerial, OTS, Bird's-eye
- SFX par shot = guide le rythme meme si audio est remplace
- Source : @aimikoda — 15 shots morning routine (viral)
- **ATTENTION** : ne PAS utiliser de ref image gros plan visage (filtre deepfake)

---

## Quel format choisir ?

| Situation | Format recommande |
|-----------|------------------|
| Scene simple, 1 personnage, paysage | Format 1 — Narratif |
| Multi-shot avec changements d'angle | Format 2 — Storyboard |
| Scene complexe avec personnages (GeoAfrique) | **Format 3 — SECONDS** |
| Exploration de lieu, transitions impossibles | Format 4 — Plan-sequence |
| Poursuite, suivi continu d'un sujet | Format 5 — Prose steadicam |
| Meme personnage, plusieurs epoques/lieux/tenues | **Format 6 — Scenes + transitions slow-mo** |
| **Montage rapide rythme / beat sync** | **Format 7 — SHOT numerote + BPM** |
| **Scene de bataille / combat intense** | **Format 8 — Timecode + Shot type + VFX + SFX** |
| Dialogue lip sync multi-personnages | Format 3 + Dialogue section A |
| Dialogue lip sync 1 personnage | Format 3 + Dialogue inline B |

---

## Format 8 — Battle Ink / Combat hybride (~400+ mots) — VALIDE 2026-04-07

```
@Image1 is the primary style and character reference. [style description]. [anti-instructions].

0-1.5s (Shot 1): [camera type] / [action description with explosive verbs].
VFX: [visual effects, ink splashes, dust, sparks]
SFX: [sound cues]

1.5-3s (Shot 2): [camera type] / [action].
VFX: [effects]
SFX: [sounds]
...

COLOR GRADE: [palette complete].
```
- Usage : scenes de bataille, combats multi-personnages, action intense
- **Teste avec 10 shots en 15s** (~1.5s/shot) — coupes nettes, rythme soutenu
- Les tags VFX et SFX sont separes du texte narratif = Seedance les traite comme instructions distinctes
- La ref image doit etre en plan LARGE (pas close-up) pour maintenir le style ink-wash et laisser liberte sur les angles
- Vue aerienne bird's-eye avec cercles concentriques = signature visuelle des batailles
- Pour production : retirer les elements surnaturels (sauts impossibles, shockwaves magiques). L'intensite vient de la VITESSE, pas des superpouvoirs.
- Source : prompt communaute "Fight scene" + adaptation Lat Dior Dekheule (2 tests, 8-8.5/10)

---

# PARTIE 2 — TECHNIQUES CAMERA

| Technique | Mot-cle prompt | Statut |
|-----------|---------------|--------|
| Dolly in | "Camera slowly dollies in" | Valide |
| Pull back reveal | "Camera pulls back, gradually showing" | Valide |
| Close-up | "Close-up on his face" | Valide |
| Orbite 180 | "Camera begins a slow orbit clockwise around" | Valide 9.5/10 |
| POV | "First-person POV from the king's eyes" | Valide |
| POV -> 3e personne | "POV slowly pulls backward and upward, revealing the back" | Valide (game changer) |
| Aerien | "Full wide aerial shot looking down" | Valide |
| Plan-sequence | "Continuous single take, no cuts, impossible camera moves, seamless transitions" | Valide — 6-7 lieux en 15s (@ChangningL29508) |
| Transition a travers surfaces | "passing through glass floor", "shoots up chimney", "dives into mouse hole" | Valide (@ChangningL29508) |
| 360 orbital slow-mo | "Dramatic 360-degree slow-motion orbital rotation, centering on face" | Valide (@aiehon_aya) |
| Crane bird's eye | "Rapid wide-angle crane shot ascending to a bird's eye view" | Valide (@aiehon_aya) |
| Drone racing low-angle | "Ultra-fast low-angle tracking shot, weaving rapidly between legs like a racing drone" | Valide (@aiehon_aya) |
| Snap zoom | "Camera SNAP ZOOMS into eyes" | Valide (@drjoetw) |
| Fisheye / ultra-wide | "ultra-wide lens distortion as character steps out" | Valide (@drjoetw) |
| Speed ramp | "Camera speed ramps up, then abruptly STOPS" | Valide (@drjoetw) |
| Whip pan morph | "whip pan morph into street scene" | Valide (@drjoetw) |
| Bullet-time | "Bullet-time begins. Camera rotates around frozen figures. Only X moves in real time" | Valide (@drjoetw) |
| Top-down spinning descent | "Top-down spinning camera slowly descends" | Valide (@drjoetw) |
| Slow-mo orbital transition | "instantly in slow motion, the camera slowly circles around" | Valide — vehicule transition saisons (@liyue_ai) |
| Tracking | "Camera follows" | A tester |
| Slow-motion | "cuts to a slow-motion overhead" | A tester |

---

# PARTIE 3 — TECHNIQUES VISUELLES NARRATIVES

| Technique | Mot-cle prompt | Statut |
|-----------|---------------|--------|
| Transition saison/epoque via slow-mo | Slow-mo orbital + "clothing naturally transitions to [new outfit], scene gradually changes to [new decor]" | Valide (@liyue_ai) |
| Transformation d'objet fluide | "skateboard smoothly transforms into ski" | Valide (@liyue_ai) |
| Coherence personnage multi-tenues | Meme personnage, description constante, tenues changent aux transitions | Valide — 4 tenues, zero morphing 15s (@liyue_ai) |
| Contraste chromatique (1 couleur vs monde gris) | 1 perso en couleur + "monochromatic faceless" foule | Valide (@aiehon_aya) |
| Propagation couleur (shockwave) | "shockwave of vibrant neon colors erupts from feet, overwriting the gray world" | Valide (@aiehon_aya) |
| Dissolution en data/or | "dissolve into golden data streams" | Valide (@aiehon_aya) |
| Afterimages / trails | "multiple afterimages of rapid kicks (leg trails slicing through space)" | Valide (@drjoetw) |
| Shockwave impact | "each kick lands -> shockwave ripple across torsos" | Valide (@drjoetw) |
| Debris flottants slow-mo | "Camera slowly pushes through floating debris (still partially in slow motion)" | Valide (@drjoetw) |
| Fade to black | "Fade to black" en fin de prompt | Valide (@ChangningL29508) |
| Timelapse foule + sujet net | Foule en motion blur/timelapse autour du personnage immobile et net au centre | A tester (@roco_kn_roco) |
| Time freeze (snap) | "raises hand, snaps fingers, shockwave, everyone freezes like mannequins" — sujet seul mobile dans monde fige | A tester (@roco_kn_roco) |
| Cadrages varies ("luxurious cuts") | Demander "various cinematic angles" ou multi-shots dans 1 clip — Seedance varie les plans automatiquement | A tester (@roco_kn_roco) |
| Fisheye urbain centre personnage | Ultra-wide/fisheye lens centree sur le personnage, foule en peripherie deformee | A tester (@roco_kn_roco) |

---

# PARTIE 4 — SECTIONS SPECIALES & DIALOGUE

## Sections speciales

- **COLOR GRADE** (fin de prompt) : ancre la palette sans ref image supplementaire (80 credits vs 120)
- **Style anchor** (debut) : `@Image1 is the primary character identity. 2D vivid flat illustration style.`
- **Instructions negatives** : "No text, no banners, no signs, no writing visible anywhere" | "gradually"
- **Audio cues** : "Sound: knock... knock...", "silence", "BOOM" — guident le tempo visuel meme si on strip l'audio
- **"Fade to black"** en fin de prompt = fonctionnel nativement

## Dialogue dans les prompts (VALIDE 2026-04-03)

Seedance genere voice-over + dialogues + SFX synchronises avec l'action. Lip sync natif.

### Format A — Section separee (multi-personnages, voice-over)

Sections `Audio:` + `Dialogue:` en fin de prompt. Source : @drjoetw.

```
Audio:
Epic cinematic music builds throughout [...]
Male cinematic voice-over (deep, calm):
"Line 1"
"Line 2"

Dialogue:
Character A (tone description): "Line"
Character B (tone description): "Line"
```

### Format B — Inline dans timecode (1 personnage, moment precis)

`Dialogue:` dans le segment temporel, lip sync exact au moment du timecode. Source : @aiehon_aya.

```
[3.0s-7.0s] Action: She looks into the lens. Her lips move clearly and sync with the dialogue.
Dialogue: "text here"
```

### Astuce lip sync
Ajouter "lips move clearly and sync with the dialogue" dans l'action du segment.

### Workflow d'integration ElevenLabs
```
1. Ecrire dialogues dans le prompt Seedance
2. Seedance genere la video avec lip sync natif
3. Strip audio Seedance (qualite mediocre)
4. Extraire timings de parole : ffmpeg silencedetect sur audio Seedance
5. Generer dialogues ElevenLabs
6. Caler pistes ElevenLabs sur timings extraits
7. Remotion : OffthreadVideo muted + Audio ElevenLabs calees
```

---

# PARTIE 5 — SEEDANCE VS KLING & PIPELINE

## Seedance vs Kling

| Situation | Seedance | Kling | Pourquoi |
|-----------|----------|-------|----------|
| Close-up expressions/gestes | **OUI** | Non | Seedance anime micro-expressions, Kling morphe |
| Transition POV -> 3e personne | **OUI** | Non | Kling ne gere pas les transitions de perspective |
| Flotte/foule massive (10+) | **OUI** | Non | Seedance 30+ coherents, Kling drift apres 3-4 |
| Style 2D flat >8s | **OUI** | Difficile | Kling drift semi-realiste apres 6-8s |
| Duel/combat 2 personnages | **OUI** (1 essai) | Semaines | Zero fusion mouvement rapide |
| Multi-personnage distinct | **OUI** (zero fusion 10s) | Non teste | 2 refs, 2 identites |
| COLOR GRADE dual (warm/cold) | **OUI** | Non | 2 temperatures dans le meme plan |
| Lip sync natif | **OUI** | Non | Sync levres au timing |
| VFX conceptuels (time freeze, shockwave) | **A TESTER** | **NON** | Kling ignore "freeze like mannequins", rend un simple flash. Teste 2026-04-04 V3 Pro = echec total. |
| Plan 4K / haute resolution | Non | **OUI** | Seedance max 720p gratuit |
| Start+End frame controle | Non | **OUI** (O3) | Transitions controlees |
| Duree >15s | Non | **OUI** | Seedance max 15s |
| API automatisable | Non | **OUI** (fal.ai) | Seedance = web uniquement |

**Strategie hybride** : Seedance = close-ups, dialogues, POV, foules, <15s. Kling = plans larges 4K, start+end frame, API.

## Pipeline Integration Remotion

### Workflow standard
```
1. Generer clip Seedance (Dreamina web)
2. Telecharger MP4
3. Strip audio : ffmpeg -i input.mp4 -an -c:v copy output-silent.mp4
4. Placer dans public/assets/library/geoafrique/[projet]/
5. Remotion : <OffthreadVideo src={clip} muted /> dans <Sequence from={BEATS.xxx.start}>
6. Audio narration : <Audio src={elevenlabsAudio} /> avec offset ~9 frames (0.3s)
7. Audio SFX Seedance (optionnel) : garder a -12dB sous la voix
```

### Workflow hybride SFX (valide Test 3)
```
1. Generer clip Seedance (avec audio SFX/musique)
2. Extraire audio : ffmpeg -i input.mp4 -vn -c:a copy seedance-audio.aac
3. Strip video : ffmpeg -i input.mp4 -an -c:v copy silent-video.mp4
4. Remotion : OffthreadVideo muted + Audio seedance volume={0.3} + Audio narration volume={1.0}
```

---

# PARTIE 6 — TESTS & BACKLOG

## Tests Valides (nos tests)

| Test | Date | Score | Key Learning |
|------|------|-------|-------------|
| Trone lip sync | 2026-03-28 | 8/10 | Audio uploade DEFORME. Strip audio + ElevenLabs overlay |
| SECONDS X TO Y + camera | 2026-03-30 | 8.5/10 | Format SECONDS valide. "gradually" corrige apparitions soudaines |
| Micro-expressions + gestes | 2026-03-30 | 9.5/10 | Grattage barbe, clignement. Zero defaut |
| POV -> 3e personne + flotte | 2026-03-30 | 10/10 | Transition POV continu, 30+ navires. Kling incapable |
| Amanirenas bataille | 2026-03-30 | 9/10 | Flat graphic maintenu, 30+ guerriers. 1 essai vs 8 Kling |
| Hannibal Alpes v1/v2 | 2026-03-30 | 7->8/10 | Ultra-litteral. 1 ref max si similaires |
| Rencontre 2 souverains | 2026-03-31 | 9.5/10 | 2 personnages distincts zero fusion 10s |
| Orbite 180 trone | 2026-03-31 | 9.5/10 | Orbite 180 continue, coherence multi-angle |
| Duel Abou Bakari vs Amanirenas | 2026-03-31 | 10/10 | Combat actif 2 persos, zero fusion. 1 essai |
| **Plan-sequence Tombouctou** | 2026-04-03 | **10/10** | Format 4, 80cr, zero ref. 7 lieux en 15s (marche->cave or->mosquee->minaret->aerien). Prompt suivi a la lettre. Style plus realiste que flat 2D. |
| **Dialogue Abou Bakari/Moussa** | 2026-04-03 | **10/10** | Regle 25 VALIDEE. Dialogue francais lip sync parfait, 2 persos distincts, mise en scene exacte (main epaule, close-ups alternes, depart vers lumiere). Zero ref, audio genere par Seedance. **Game changer.** |
| **Format 6 Abou Bakari 3 epoques** | 2026-04-04 | **9.5/10** | 3 scenes (palais/ocean/tempete), 3 tenues, 3 palettes, 1 perso coherent. 9:16 natif. Ref character sheet. COLOR GRADE progressif parfait. Seul defaut : morphing snap au lieu de rotation physique — specifier "slowly turns" dans les transitions. |
| **Extension video (V2V) flotte** | 2026-04-04 | **7.5/10** | Continuite stylistique parfaite, couture invisible. Tempete + eclairs comme demande. MAIS peu de mouvement (verbes trop doux), camera descend peu en 10s. Lecon : verbes dynamiques + 15s + 1 changement majeur par extension. |
| **Contraste chromatique Abou Bakari** | 2026-04-04 | **10/10** | 1 perso or au milieu de 50+ silhouettes grises. Zoom aerien->close-up->propagation couleur->marche Tombouctou. Storytelling emergent. 9:16 natif. **Hook parfait.** |
| **Thiaroye Clip 1 — Village->Recrutement->Bateau** | 2026-04-04 | **10/10** | Format 6 SANS ref image. 3 scenes, COLOR GRADE progressif (or->poussiere->gris), personnage coherent, officiers francais distincts, plan final navire spectaculaire. 9:16 natif, 80cr. **Valide le pipeline 4x15s pour Shorts.** |
| **Thiaroye Clip 1 V4 — Test 1 (sans ref)** | 2026-04-05 | **3/10** | Prompt Kimi V4 (Scene 1 + Transition + Scene 2). Style photoraliste malgre "2D flat" dans le texte. Personnages statiques, meme modele clone x3, camera orbite uniquement. **Lecon : "2D flat" en texte = ignore par Seedance. Ref image obligatoire pour ancrer le style.** |
| **Thiaroye Clip 1 V4 — Test 2 (avec ref Gemini)** | 2026-04-05 | **5/10** | Meme prompt Kimi + ref image generee Gemini. Style BD flat respecte cette fois. MAIS toujours statique, morphing a 7s (2 soldats disparaissent), camera orbite seul mouvement. **Lecon : le style est fixe par la ref, mais le prompt reste trop contemplatif — Format Scene+Transition = videos mortes.** |
| **Thiaroye Clip 1 — Test 3 (Format 3 SECONDS)** | 2026-04-05 | **8/10** | Reecrit en Format 3 SECONDS + verbes explosifs. Dynamisme excellent (marche, drop sac, sortie lettre, bras croises). MAIS morphing a 10s quand dolly in = lettre passe devant visage. **Lecon : pas de changement d'echelle brutal. Objet a hauteur poitrine + dolly in face = morphing garanti.** |
| **Thiaroye Clip 1 — Test 4 (fix camera)** | 2026-04-05 | **9/10** | Fix segments 8-15 : camera steady + pull back au lieu de dolly in. 0-12s quasi parfait. MAIS halo dore magique sur la lettre a 13-15s. **Lecon : en 2D flat, ZERO metaphore lumineuse ("beacon", "gold light", "catches light") — Seedance fait emettre de la lumiere. Utiliser "contrasts sharply", "the only white object".** |
| **Thiaroye Clip 2 — La Revendication (test 5)** | 2026-04-05 | **9.5/10** | Format 3 SECONDS + ref Gemini interieur baraquement. 2 actes en 15s (interieur jour → exterieur nuit). Slam table, papiers qui glissent, officier qui pointe, transition par fenetre barree, camp de nuit avec searchlights sur 3 tirailleurs encercles. Style BD flat maintenu interieur+exterieur. Zero morphing. Seedance genere voix officier spontanement (artefact sonore, strip de toute facon). **Valide : ref Gemini par scene + Format 3 + verbes explosifs = formule de production.** |
| **Thiaroye Clip 3 — Le Massacre (test 6)** | 2026-04-05 | **8.5/10** | Format 3 SECONDS + ref = derniere frame clip 2. Frame chaining parfait (continuite directe). Sweep sol 4-8s exceptionnel (shell casings, papiers, kepi, silhouettes fumee). Vue aerienne 8-12s a 2 artefacts : soldat qui tire vers un mur + 3 tirailleurs toujours debout malgre les tirs (dissonance). Finale aube vide avec drapeau francais + kepi = puissant. **Lecon : "no bodies shown" sans "collapse/disappear into smoke" = personnages invulnerables. Dire explicitement qu'ils tombent a genoux et disparaissent dans la fumee.** |

| **Beat Sync Abou Bakari — 10 shots (test 7)** | 2026-04-05 | **9.5/10** | Format SHOT numerote VALIDE. 10 shots distincts en 15s, coupes rythmees. Ultra-realiste sans ref image (80cr). Couronne→trone→carte→cour→port→pirogue→flotte→aerien. Coherence personnage sans ref. Texte parasite sur carte (artefact mineur). **Lecons : (1) Format SHOT 1/SHOT 2 = nouveau format valide. (2) Ref image gros plan visage = bloque par filtre "inappropriate content". (3) "@Image1 is the primary character identity" + visage = deepfake flag. (4) Ultra-realiste sans ref = qualite cinematique type Black Panther.** |
| **Soundjata — Barre de fer (test 8)** | 2026-04-06 | **9.5/10** | Format 3 SECONDS + ref Gemini style. Garcon rampe→agrippe barre→se leve (barre tordue)→arrache baobab→vue aerienne. Chaque segment du prompt suivi a la lettre. Coherence personnage + femmes maintenue 15s. Poussiere, mouvements camera varies (tracking, snap zoom, pull back, aerial sweep). Derniere frame (baobab au sol, cratere, poussiere concentrique) = spectaculaire. Seul defaut mineur : femmes choquees du debut a la fin (expressions figees). **Lecons : (1) Ref Gemini style = ancre le 2D flat parfaitement. (2) Verbes explosifs (SURGE, CRACK, CRASHES, DIG) = chaque action est physiquement credible. (3) Sweep aerien final = parfait pour scenes de puissance/impact. (4) Pour varier les expressions des secondaires, specifier l'emotion PAR segment (curiosite→surprise→choc) au lieu d'une emotion fixe.** |
| **Yaa Asantewaa — Discours (test 9)** | 2026-04-06 | **7/10** | Format 3 SECONDS + ref Gemini + lip sync dialogue. Contraste chromatique (or vs desature) bien respecte. Lip sync excellent, accent africain naturel. Animation details (doigts, boucles d'oreilles, vetements) remarquable. MAIS 4 problemes : (1) zoom avorte a 3s ("slight push in" = camera hesite), (2) personnage pointe vers la camera au lieu des chefs (regle 33), (3) chefs trop statiques/robotiques quand ils se levent, (4) propagation couleur artificielle type halo magique (regle 34). **Lecons : (1) "POINTS at [personnage]" = pointe vers la camera si personnage face camera — specifier direction physique. (2) "color bleeds outward" = VFX halo — changer de plan plutot que propager. (3) Personnages secondaires ont besoin de micro-actions individuelles. (4) "slight push in" = zoom avorte — soit steady soit full push in.** |

| **Yaa Asantewaa — Discours V2 (test 10)** | 2026-04-07 | **8/10** | Fix V2 avec 4 corrections. Ameliorations nettes : Yaa Asantewaa pointe gauche/droite (regle 33 fix OK), mouvements de tete, chefs plus reactifs (visage, grattage, regards). MAIS 3 problemes restants : (1) symboles Adinkra muraux "saignent" comme tattoos sur les dos des chefs (regle 38), (2) pop-in/teleportation a ~10s (transition entre segments = saut de position), (3) contraste chromatique de groupe inconsistant (certains colores, certains gris, vetements vs peau desynchro). **Lecons : (1) Contraste chromatique = 1 vs foule seulement, PAS de propagation de groupe (regle 37). (2) Motifs muraux proches des personnages = tattoos parasites (regle 38). (3) Transitions de position dans un meme plan = pop-in — garder le personnage au meme endroit ou couper.** |
| **Lat Dior Dekheule — Bataille test 2 (test 11)** | 2026-04-07 | **8/10** | Format 8 hybride (10 shots x 1.5s + VFX/SFX tags) + ref Gemini V4 (close-up clash). Style ink-wash anime. Arc complet : charge cheval -> combat sabre -> aerien 360 -> gros plan blessure -> course avec fils -> canon -> 3 silhouettes tombent. **Forces** : vue aerienne concentrique spectaculaire, kepis qui volent, scene des fils, finale 3 silhouettes iconique. **Problemes** : (1) soldats noirs au lieu de blancs (regle 42), (2) roi invulnerable malgre 20 fusils (regle 30/43), (3) saut sur canon = over the top, (4) blessure apparait/disparait, (5) style drift vers anime mid-video. **Lecons** : (R42) specifier ethnicity/peau explicitement, (R43) tracker les blessures dans chaque shot, (R44) format hybride timecode+VFX+SFX valide, (R47) retirer les superpouvoirs pour production. |
| **Lat Dior Dekheule — Bataille test 3 (test 12)** | 2026-04-07 | **8.5/10** | Meme Format 8 + ref Gemini V1 (plan large charge cavalerie). Style ink-wash PLUS CONSISTANT que test 11. **Forces** : charge cavalerie puissante, vue aerienne mandala de guerre (meilleure image toutes videos confondues), gros plan avec balle visible + rage sur le visage + trainee rouge, retour au clash ref = boucle visuelle. **Problemes** : (1) double sabre artefact (lignes de mouvement ref = interpretees comme 2e arme), (2) pas de fils, (3) finale revient au clash au lieu de la chute. **Lecons** : (R45) ref plan large > ref close-up pour coherence style, (R46) vue aerienne concentrique = signature batailles, expressions faciales possibles si demandees explicitement. **Meilleur des 2 tests pour le style.** |

| **Lat Dior Dekheule — Clip A Production (test 13)** | 2026-04-07 | **9.5/10** | Format 8 production (7 shots x 2-2.5s + VFX/SFX) + ref Gemini V1 plan large. Toutes les corrections des tests POC appliquees. **Forces** : (1) soldats francais blancs en uniformes bleus detailles avec bandoulieres X (R42 fix), (2) blessure epaule progresse et persiste shot apres shot (R43 fix), (3) zero over the top — intensite par la vitesse pas les superpouvoirs (R47 fix), (4) vue aerienne mandala toujours spectaculaire, (5) expressions faciales variees (rage->douleur->calme sombre), (6) sabre ensanglante = detail de continuite emergent, (7) finale iconique (debout seul, baobabs, ciel rouge, kepis au sol). **Seuls defauts** : micro-drift anime mid-video (Shots 7-8), cape dechiquetee "manga pointu" vs realiste, soldats au sol generiques. **Meilleur clip de combat produit a ce jour. Prouve que la DA + prompt = le produit.** |

| **Lat Dior Vivid Shapes — Style test (test 15)** | 2026-04-07 | **7.5/10** | Style Amanirenas (vivid_shapes) + Recraft Style ID `d28c53cc` + ref hybride (visage semi-detaille + armee silhouettes). Format 3 SECONDS. **Forces** : (1) le style vivid shapes s'anime parfaitement dans Seedance — formes plates bougent naturellement, zero morphing, (2) aureole doree = Seedance l'anime comme un soleil (bel effet emergent), (3) composition heros + armee silhouettes coherente en video, (4) personnage identifiable dans chaque shot (couronne or + cape indigo), (5) la charge dynamique fonctionne (lignes de vitesse, course). **Problemes** : (1) Seedance commence par le decor vide 2s avant de montrer le personnage (ref = paysage large), (2) scene finale inversee — cavaliers devant, roi derriere — "camera pulling up" depasse le roi (R51). **Lecon** : (R51) pour vue aerienne + leader, specifier "king LEADS at FRONT TIP of V-formation" et ne pas utiliser "pulling up". **Le style vivid_shapes Recraft est VALIDE pour Seedance.** |
| **Lat Dior Dekheule — Clip B Production (test 14)** | 2026-04-07 | **8/10** | Format 8 production (6 shots) + frame chaining depuis Clip A. **Forces** : (1) ouverture 3 hommes de dos courant vers une armee = narrativement parfait, (2) traces d'encre noire sous les pieds = detail emergent, (3) progression blessure epaule->poitrine respectee, (4) fin = la plus belle image du projet (face contre terre, cape linceul, couleur qui drain du rouge vers gris-papier, encre qui se dissout). **Problemes** : (1) "FALLS forward" + slow-mo = flottement aerien comique (R48), (2) canon mal oriente + interaction confuse (R49), (3) armee en arriere-plan inactive pendant que le roi meurt = dissonance (R50). **Verdict** : Shots 1-3 (ouverture) et 8-9 (fin) excellents, middle a retravailler. Combine avec Clip A = ~25s de bataille utilisables. |

## Learnings Yaroflasher Workflow (2026-04-07)

Source : "Seedance 2.0 Omni Complete Workflow | Total Control" — Yaroflasher, 12m25s
Video analysee : frames extraites + transcript complet dans `/tmp/seedance-workflow/`

**Pipeline Yaroflasher** :
1. Script -> identifier elements cles (personnage, lieu, secondaires, objets)
2. Generer CHAQUE element separement dans Nano Banana Pro (Gemini), 16:9, 2K
3. Personnage = collage close-up + full body sur 1 image
4. Uploader 3-5 refs dans Seedance (pas juste 1 style anchor)
5. Generer 2-3 variantes par scene
6. Splice les meilleurs moments dans DaVinci Resolve
7. Transitions : last frame clip A + first frame clip B, upscaler dans Gemini, utiliser comme refs transition
8. Fin de prompt : "no words, no music"

**Vs notre pipeline** :
- On utilise 1 ref (style anchor). Il en utilise 3-5 (element par element).
- On genere 1 take. Il en genere 2-3 et splice.
- On n'a pas de collage close-up + full body.
- Nos prompts depassent probablement 1500 chars (limite Dreamina).
- Son format prompt = SHOT sans timecodes ni VFX/SFX tags (plus court, plus de liberte creative).

**Techniques a tester** : refs separees par element (R52), collage character sheet (R53), "no music" (R54), verifier limite 1500 chars (R55).

## Backlog Tests

| Priorite | Test | Objectif |
|----------|------|----------|
| 1 | Plan-sequence continu 15s | Tester duree max avec "Single continuous take" |
| 2 | Props main L/R (regle 23) | Personnage tenant objet + action secondaire |
| 3 | Video-to-video : 2 refs | Uploader clip + 2 images ref pour transition |
| 4 | Video-to-video : extension duree | Seedance etend-il au-dela de la duree source ? |
| ~~5~~ | ~~Audio-Guided Dialogue (regle 25)~~ | **VALIDE 2026-04-03** — lip sync francais parfait, 2 persos, zero ref |
| 6 | Lip sync dialogue 15s | Narration longue avec lip sync natif |
| 7 | Seedance 2.0 Fast | Tester qualite/cout du modele Fast |
| 8 | Direction mouvement dans image source | Start frame composee pour guider le sens |
| 9 | Time freeze (timelapse + snap + monde fige) | Foule en motion blur -> snap -> monde fige, personnage marche seul. Source : @roco_kn_roco. 2 prompts : setup (timelapse+snap) + payoff (marche dans monde fige, "various cinematic angles"). Style anime. |
| 10 | "Luxurious cuts" / cadrages varies | Tester si "various cinematic angles" ou equivalent force Seedance a varier les plans dans 1 clip |

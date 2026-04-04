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

## Quel format choisir ?

| Situation | Format recommande |
|-----------|------------------|
| Scene simple, 1 personnage, paysage | Format 1 — Narratif |
| Multi-shot avec changements d'angle | Format 2 — Storyboard |
| Scene complexe avec personnages (GeoAfrique) | **Format 3 — SECONDS** |
| Exploration de lieu, transitions impossibles | Format 4 — Plan-sequence |
| Poursuite, suivi continu d'un sujet | Format 5 — Prose steadicam |
| Meme personnage, plusieurs epoques/lieux/tenues | **Format 6 — Scenes + transitions slow-mo** |
| Dialogue lip sync multi-personnages | Format 3 + Dialogue section A |
| Dialogue lip sync 1 personnage | Format 3 + Dialogue inline B |

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

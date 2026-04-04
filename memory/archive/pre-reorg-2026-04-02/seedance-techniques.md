# Seedance 2.0 — Techniques Camera & Visuelles
> Techniques validees par nos tests + communaute. Avec mots-cles de prompt exacts.
> Mise a jour : 2026-04-02

---

## Techniques Camera

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
| Tracking | "Camera follows" | A tester |
| Slow-motion | "cuts to a slow-motion overhead" | A tester |
| Slow-mo orbital transition | "instantly in slow motion, the camera slowly circles around" | **Valide** — vehicule de transition entre scenes/saisons (@liyue_ai) |

---

## Techniques Visuelles Narratives

| Technique | Mot-cle prompt | Statut |
|-----------|---------------|--------|
| Transition saison/epoque via slow-mo | Slow-mo orbital + "clothing naturally transitions to [new outfit], scene gradually changes to [new decor]" | **Valide** — 4 saisons en 15s, zero rupture (@liyue_ai) |
| Transformation d'objet fluide | "skateboard smoothly transforms into ski" | Valide — objet change de forme pendant le mouvement (@liyue_ai) |
| Coherence personnage multi-tenues | Meme personnage, description constante (cheveux, style), tenues changent aux transitions | Valide — 4 tenues, zero morphing sur 15s (@liyue_ai) |
| Contraste chromatique (1 couleur vs monde gris) | 1 perso en couleur + "monochromatic faceless" foule | Valide (@aiehon_aya) |
| Propagation couleur (shockwave) | "shockwave of vibrant neon colors erupts from feet, overwriting the gray world" | Valide (@aiehon_aya) |
| Dissolution en data/or | "dissolve into golden data streams" | Valide (@aiehon_aya) |
| Afterimages / trails | "multiple afterimages of rapid kicks (leg trails slicing through space)" | Valide (@drjoetw) |
| Shockwave impact | "each kick lands -> shockwave ripple across torsos" | Valide (@drjoetw) |
| Debris flottants slow-mo | "Camera slowly pushes through floating debris (still partially in slow motion)" | Valide (@drjoetw) |
| Fade to black | "Fade to black" en fin de prompt | Valide (@ChangningL29508) |

---

## Seedance vs Kling

| Situation | Seedance | Kling | Pourquoi |
|-----------|----------|-------|----------|
| Close-up expressions/gestes | **OUI** | Non | Seedance anime micro-expressions, Kling morphe |
| Transition POV -> 3e personne | **OUI** | Non | Kling ne gere pas les transitions de perspective |
| Flotte/foule massive (10+) | **OUI** | Non | Seedance 30+ coherents, Kling drift apres 3-4 |
| Style 2D flat >8s | **OUI** | Difficile | Kling drift semi-realiste apres 6-8s |
| Duel/combat 2 personnages | **OUI** (1 essai) | Semaines | Charge, clash, close-ups, zero fusion |
| Multi-personnage distinct | **OUI** (zero fusion 10s) | Non teste | 2 refs, 2 identites |
| COLOR GRADE dual (warm/cold) | **OUI** | Non | 2 temperatures dans le meme plan |
| Lip sync natif | **OUI** | Non | Sync levres au timing |
| Plan 4K / haute resolution | Non | **OUI** | Seedance max 720p gratuit |
| Start+End frame controle | Non | **OUI** (O3) | Transitions controlees |
| Duree >15s | Non | **OUI** | Seedance max 15s |
| API automatisable | Non | **OUI** (fal.ai) | Seedance = web uniquement |

**Strategie hybride** : Seedance = close-ups, dialogues, POV, foules, <15s. Kling = plans larges 4K, start+end frame, API. Toujours strip audio Seedance + overlay ElevenLabs.

---

## Pipeline Integration Remotion

### Workflow standard
```
1. Generer clip Seedance (Dreamina web, format SECONDS X TO Y)
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

## Tests Valides (nos tests)

| Test | Date | Score | Key Learning |
|------|------|-------|-------------|
| Trone lip sync (original) | 2026-03-28 | 8/10 | Audio uploade DEFORME par Seedance. Workflow : strip audio + ElevenLabs overlay |
| SECONDS X TO Y + camera | 2026-03-30 | 8.5/10 | Format SECONDS valide. "gradually" corrige apparitions soudaines |
| Micro-expressions + gestes | 2026-03-30 | 9.5/10 | Grattage barbe, clignement, physique vetements. Zero defaut |
| POV -> 3e personne + flotte | 2026-03-30 | 10/10 | Transition POV continu, 30+ navires. Kling incapable |
| Amanirenas bataille | 2026-03-30 | 9/10 | Flat graphic maintenu, eye patch stable, 30+ guerriers. 1 essai vs 8 Kling |
| Hannibal Alpes v1/v2 | 2026-03-30 | 7->8/10 | Ultra-litteral ("uphill"=45deg). 1 ref max si similaires |
| Rencontre 2 souverains | 2026-03-31 | 9.5/10 | 2 personnages distincts zero fusion 10s. COLOR GRADE dual |
| Orbite 180 trone | 2026-03-31 | 9.5/10 | Orbite 180 continue, coherence multi-angle |
| Duel Abou Bakari vs Amanirenas | 2026-03-31 | 10/10 | Combat actif 2 persos, zero fusion mouvement rapide. 1 essai |

---

## Backlog Tests

| Priorite | Test | Objectif |
|----------|------|----------|
| 1 | Plan-sequence continu 15s | Tester duree max avec "Single continuous take" |
| 2 | Props main L/R (regle 23) | Personnage tenant objet + action secondaire |
| 3 | Video-to-video : 2 refs | Uploader clip + 2 images ref pour transition |
| 4 | Video-to-video : extension duree | Seedance etend-il au-dela de la duree source ? |
| 5 | **Audio-Guided Dialogue (regle 25)** | Prompt dialogue -> lip sync natif. Test beat 05 Abou Bakari/Moussa |
| 6 | Lip sync dialogue 15s | Narration longue avec lip sync natif |
| 7 | Seedance 2.0 Fast | Tester qualite/cout du modele Fast |
| 8 | Direction mouvement dans image source | Start frame composee pour guider le sens |

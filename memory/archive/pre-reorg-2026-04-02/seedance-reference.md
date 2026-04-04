# Seedance 2.0 — Reference Complete
> Fichier unique de reference. Tout ce qu'on sait, tout ce qu'on a teste, tout ce qui marche.
> Mise a jour : 2026-04-01

---

## 1. Acces et Contraintes

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

## 2. Formats de Prompts (du moins au plus precis)

### Format 1 — Narratif lineaire (~40 mots)
```
Camera follows [sujet] [action 1]. The shot cuts to [angle] as [action 2].
[Action 3]. Sounds of [ambiance].
```
- Usage : scenes simples, un seul personnage, action lineaire. Controle camera faible.
- **Meilleur pour paysages/flottes** : SECONDS surdecoupe les scenes sans personnage.

### Format 2 — Storyboard numerote (~75 mots)
```
[duree] [genre]. Shot 1: [angle], [sujet] [action], [detail].
Shot 2: [close-up], then [angle] of [action], [effet].
Shot 3: [angle large], [climax], text '[message]' revealed.
```
- Usage : multi-shot structure, changements de lieu/angle. Controle camera moyen.

### Format 3 — Timecodes SECONDS X TO Y (~150-200 mots) — VALIDE, LE MEILLEUR
```
@Image1 is the primary character identity. [style].

SECONDS 0 TO 3: [description plan 1, camera, action].
SECONDS 3 TO 6: [description plan 2, transition, detail].
SECONDS 6 TO 8: [description plan 3, climax].
SECONDS 8 TO 10: [description plan 4, resolution].

COLOR GRADE: [palette complete].
```
- Usage : controle maximal, scenes complexes, transitions de perspective. **RECOMMANDE pour GeoAfrique.**

### Format 4 — Plan-sequence impossible (~100-150 mots) — VALIDE
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
- Transitions = descriptions physiques du mouvement camera ("dives through glass floor", "shoots up chimney", "passes through mouse hole")
- Source : @ChangningL29508 — cruise ship (7 lieux en 15s) + medieval tavern (6 lieux), amazon rainforest, night market (9 shots). Tous parfaits.
- **SUPERIEUR a SECONDS pour plans-sequences sans personnage** — SECONDS surdecoupe le flux continu
- Compatible ultra-wide 21:9 + 60fps
- **Variante avec shots numerotes** : `Shot 01 (0:00-2:00):` — plus de controle sur le rythme + permet des pauses narratives. Confirme sur night market (9 shots, "Fade to black" final fonctionne).
- **Vocabulaire de transition cle** : "dives through" (plongee), "sweeps out onto" (emergence), "bursting out of" (sortie explosive), "passing through" (traversee solide), "gliding past" (lateral), "weaving through" (slalom)
- **Audio cues dans le prompt** ("Gas flame WHOMP", "Coin clinks", "Silence") = guident le tempo visuel meme si on strip l'audio
- **"Fade to black"** en fin de prompt = fonctionnel nativement

### Format 5 — Prose technique steadicam (~100 mots) — VALIDE
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

### Sections speciales
- **COLOR GRADE** (fin de prompt) : ancre la palette sans ref image supplementaire (80 credits vs 120)
- **Style anchor** (debut) : `@Image1 is the primary character identity. 2D vivid flat illustration style.`
- **Instructions negatives** : "Single continuous take, no cuts" | "no text, no writing, no watermark" | "gradually"

---

## 3. Regles de Prompt (NON-NEGOTIABLE)

1. **Style obligatoire** : "2D vivid flat illustration style" en debut de prompt
2. **COLOR GRADE obligatoire** : section en fin de prompt pour ancrer la palette
3. **"gradually"** : utiliser dans tout segment reveal (flotte, armee, decor)
4. **"Single continuous take, no cuts"** : pour plan-sequence
5. **Anti-texte OBLIGATOIRE** : "No text, no banners, no signs, no writing visible anywhere" — Seedance invente des bannieres spontanement (ex: "WELCOME TO JANJANBURO")
6. **Audio narration = toujours remplacer** : Seedance re-synthetise les mots uploades
7. **Eye patch Amanirenas** : toujours mentionner "black eye patch over left eye"
8. **Ref images** : character sheet multi-vues = meilleure ref. 1 ref suffit pour plan-sequence/POV
9. **Duree segments** : 2-3s par segment pour 10s, 3-4s pour 15s. Ne pas surcharger
10. **Verbes d'action** : "PRESSES", "RISES", "STRIKES" — jamais "subtle", "gentle", "slow" sauf intention explicite
11. **Seedance = ultra-litteral** : "uphill" = pente 45deg, "raises sword" sans "lowers" = epee levee tout le clip
12. **1 ref RECOMMANDE si personnages similaires** : 2 refs trop proches = fusion. Decrire soldats par texte ("silhouettes WITHOUT cape"). Note : Seedance accepte jusqu'a 9 images par requete — notre limite a 1-2 est un choix pratique, pas technique.
13. **Differencier leader vs soldats** : "leader with [detail]" + "soldiers WITHOUT [detail]" — sinon clones
14. **Objets parent-enfant** : "degainer" ≠ "fourreau vide" pour Seedance. Ecrire "curved sword in hand, no scabbard visible"
15. **Refs SCENE = slideshow** : refs doivent ancrer l'IDENTITE (personnage, style), pas la COMPOSITION. 1 ref scene max
16. **1 ref + 1 ambiance par clip** : changement de lieu = splitter en clips separes
17. **Narratif > SECONDS pour paysages** : SECONDS surdecoupe les scenes sans personnage
18. **Verbes dynamiques dans TOUS les formats** : "slowly/gently" = animation au ralenti. Utiliser "crashes", "surges", "pushes"
19. **Lip sync = 3 pistes Audio Remotion** : Seedance re-synthetise → timings decales. Toujours pistes separees calees sur moments visuels (silencedetect)
20. **"Cut to" = mot censure** : remplacer par "Camera shifts to frame". Eviter "cut"
21. **Sensibilite contenu variable** : refus aleatoire — relancer tel quel avant de modifier
22. **Specifier chaque axe/direction** : "forward" = ambigu. Dire "down to his side", "toward the ground"
23. **Props main gauche/droite (A TESTER)** : pour tout personnage tenant un objet, ecrire "Right hand ALWAYS holds [objet], NEVER released, NEVER disappears. Left hand EXCLUSIVELY for [action]." Sans precision, Seedance fait disparaitre les props pendant les actions. Source : JSFILMZ tutorial.
24. **Direction du mouvement dans images source (A TESTER)** : designer la composition de l'image source pour indiquer le sens du mouvement (objet a gauche = mouvement gauche→droite). Source : Mira AI / Higgsfield workflow.
25. **Audio-Guided Dialogue (A TESTER)** : Seedance genere voice-over + dialogues + SFX synchronises avec l'action quand on ecrit les repliques dans le prompt. Lip sync natif. Workflow : dialogues dans prompt → Seedance lip sync → strip audio → extraire timings (silencedetect) → overlay ElevenLabs. 2 formats confirmes :
    - **Format A — Section separee** (multi-personnages, voice-over) : sections `Audio:` + `Dialogue:` en fin de prompt. Source : @drjoetw tweet 2038847799794819507.
      ```
      Audio:
      Male cinematic voice-over (deep, calm):
      "Line 1"
      Dialogue:
      Character A (tone): "Line"
      Character B (tone): "Line"
      ```
    - **Format B — Inline dans timecode** (1 personnage, moment precis) : `Dialogue:` dans le segment temporel, lip sync exact au moment du timecode. Source : @aiehon_aya tweet 2038841993229676692.
      ```
      [3.0s-7.0s] Action: She looks into the lens. Her lips move clearly and sync with the dialogue.
      Dialogue: "text here"
      ```
    - **Astuce lip sync** : ajouter "lips move clearly and sync with the dialogue" dans l'action du segment pour forcer le lip sync visible.
    - **Notation alternative** : `[0.0s-3.0s]` = equivalent de `SECONDS 0 TO 3`. Les 2 fonctionnent.

---

## 4. Techniques Camera Validees

| Technique | Mot-cle prompt | Resultat |
|-----------|---------------|----------|
| Dolly in | "Camera slowly dollies in" | Excellent |
| Pull back reveal | "Camera pulls back, gradually showing" | Excellent |
| Close-up | "Close-up on his face" | Excellent |
| Orbite 180 | "Camera begins a slow orbit clockwise around" | 9.5/10, fluide multi-angle |
| POV | "First-person POV from the king's eyes" | Parfait |
| POV -> 3e personne | "POV slowly pulls backward and upward, revealing the back" | Parfait, game changer |
| Aerien | "Full wide aerial shot looking down" | Excellent |
| Plan-sequence | "Continuous single take, no cuts, impossible camera moves, seamless transitions" | **CONFIRME** — 6-7 lieux en 15s, transitions physiquement impossibles (@ChangningL29508) |
| Transition a travers surfaces | "passing through a glass floor", "shoots up stone chimney", "dives into mouse hole" | Confirme — camera traverse murs, sols, cheminees (@ChangningL29508) |
| Tracking | "Camera follows" | A tester |
| Slow-motion | "cuts to a slow-motion overhead" | A tester |
| 360 orbital slow-mo | "Dramatic 360-degree slow-motion orbital rotation, centering on face" | Confirme (@aiehon_aya) |
| Crane bird's eye | "Rapid wide-angle crane shot ascending to a bird's eye view" | Confirme (@aiehon_aya) |
| Drone racing low-angle | "Ultra-fast low-angle tracking shot, weaving rapidly between legs like a racing drone" | Confirme (@aiehon_aya) |
| Snap zoom | "Camera SNAP ZOOMS into eyes" | Confirme — transition brutale vers close-up (@drjoetw) |
| Fisheye / ultra-wide | "ultra-wide lens distortion as character steps out" | Confirme — barrel distortion visible (@drjoetw) |
| Speed ramp | "Camera speed ramps up, then abruptly STOPS" | Confirme — acceleration puis freeze (@drjoetw) |
| Whip pan morph | "whip pan morph into street scene" | Confirme — transition lieu via camera rapide (@drjoetw) |
| Bullet-time | "Bullet-time begins. Camera rotates around frozen figures. Only X moves in real time" | Confirme — ralenti Matrix avec orbite (@drjoetw) |
| Top-down spinning descent | "Top-down spinning camera slowly descends" | Confirme (@drjoetw) |

### Techniques Visuelles Narratives

| Technique | Mot-cle prompt | Resultat |
|-----------|---------------|----------|
| Contraste chromatique (1 couleur vs monde gris) | 1 perso en couleur + "monochromatic faceless" foule | Confirme — style Schindler's List natif |
| Propagation couleur (shockwave) | "shockwave of vibrant neon colors erupts from feet, overwriting the gray world" | Confirme — propagation centrifuge parfaite |
| Dissolution en data/or | "dissolve into golden data streams" | Confirme — foule grise → flux dores |
| Afterimages / trails | "multiple afterimages of rapid kicks (leg trails slicing through space)" | Confirme — trainee de mouvement (@drjoetw) |
| Shockwave impact | "each kick lands → shockwave ripple across torsos" | Confirme (@drjoetw) |
| Debris flottants slow-mo | "Camera slowly pushes through floating debris (still partially in slow motion)" | Confirme (@drjoetw) |

### Regles de Dynamisme (extraites de @drjoetw)

1. **Verbes explosifs = animation rapide** : "BURSTS", "LAUNCHES", "SLICING", "SNAP" — densifier les verbes d'action pour les scenes rapides
2. **MAJUSCULES = intensite** : "SNAP ZOOMS", "BOOM", "EXTREME" — Seedance interprete comme pics d'energie
3. **Sound cues = rythme visuel** : "Sound: knock... knock...", "silence", "BOOM" — les indications sonores dans le prompt influencent le tempo de l'animation
4. **Descriptions d'impact** : "fabric compressing inward", "shockwave ripple" — descriptions physiques detaillees = effets VFX meilleurs

---

## 5. Seedance vs Kling

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

## 6. Pipeline Integration Remotion

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

## 7. Tests Valides

| Test | Date | Score | Key Learning | Video |
|------|------|-------|-------------|-------|
| Trone lip sync (original) | 2026-03-28 | 8/10 | Audio uploade DEFORME par Seedance. Workflow : strip audio + ElevenLabs overlay | `public/assets/library/geoafrique/test seedance 2.0/...trone...silent.mp4` |
| SECONDS X TO Y + camera | 2026-03-30 | 8.5/10 | Format SECONDS valide. "gradually" corrige apparitions soudaines | `~/Downloads/abu bakari seedance test 1.mp4` |
| Micro-expressions + gestes | 2026-03-30 | 9.5/10 | Grattage barbe, clignement, physique vetements assis/debout. Zero defaut | `~/Downloads/abu bakari seedance test 2.mp4` |
| POV -> 3e personne + flotte | 2026-03-30 | 10/10 | Transition POV continu, 30+ navires, SFX utilisable. Kling incapable | `~/Downloads/abu bakari seedance test 3.mp4` |
| Amanirenas bataille | 2026-03-30 | 9/10 | Flat graphic maintenu, eye patch stable, 30+ guerriers. 1 essai vs 8 Kling | `~/Downloads/Amanirenas — Scene de bataille.mp4` |
| Hannibal Alpes v1/v2 | 2026-03-30 | 7→8/10 | Ultra-litteral ("uphill"=45deg). 1 ref max si similaires. Specifier axes | `~/Downloads/hannibal.mp4` / `hannibal 2.mp4` |
| Rencontre 2 souverains | 2026-03-31 | 9.5/10 | 2 personnages distincts zero fusion 10s. Close-up alterne, COLOR GRADE dual | `~/Downloads/rencontre souverains .mp4` |
| Orbite 180 trone | 2026-03-31 | 9.5/10 | Orbite 180 continue, coherence multi-angle, reveal progressif decor | `~/Downloads/orbit 180.mp4` |
| Duel Abou Bakari vs Amanirenas | 2026-03-31 | 10/10 | Combat actif 2 persos, armes croisees, zero fusion mouvement rapide. 1 essai | `~/Downloads/bataille.mp4` |

---

## 8. Backlog Tests

| Priorite | Test | Objectif |
|----------|------|----------|
| 1 | Plan-sequence continu 15s | Tester duree max avec "Single continuous take" |
| 2 | Props main L/R (regle 23) | Personnage tenant objet + action secondaire — verifier persistance props |
| 3 | Video-to-video : 2 refs pour transition | Uploader clip + 2 images ref (debut/fin) pour scene avec transition |
| 4 | Video-to-video : extension duree | Seedance etend-il au-dela de la duree source ? |
| 5 | **Audio-Guided Dialogue (regle 25)** | Sections Audio: + Dialogue: dans prompt → lip sync natif + timing extractible. Tester sur beat 05 Abou Bakari/Moussa |
| 6 | Lip sync dialogue 15s | Narration longue avec lip sync natif |
| 7 | Seedance 2.0 Fast | Tester qualite/cout du modele Fast |
| 8 | Direction mouvement dans image source | Start frame composee pour guider le sens du mouvement |

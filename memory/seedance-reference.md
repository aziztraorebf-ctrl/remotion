# Seedance 2.0 — Reference Complete
> Fichier unique de reference. Tout ce qu'on sait, tout ce qu'on a teste, tout ce qui marche.
> Mise a jour : 2026-03-31

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
12. **1 ref max si personnages similaires** : 2 refs trop proches = fusion. Decrire soldats par texte ("silhouettes WITHOUT cape")
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
| Plan-sequence | "Single continuous take, no cuts" | A tester |
| Tracking | "Camera follows" | A tester |
| Slow-motion | "cuts to a slow-motion overhead" | A tester |

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
| 3 | Video-to-video | Uploader clip existant + demander modifications |
| 4 | Lip sync dialogue 15s | Narration longue avec lip sync natif |

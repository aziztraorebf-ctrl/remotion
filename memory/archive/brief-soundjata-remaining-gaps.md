# Brief session — Soundjata Short : 4 trous restants + Acte VIII

> Cree 2026-04-16 soir (fin de session Acte IV Clip 1 valide).
> A ouvrir en debut de prochaine session Soundjata. Contient tout pour finir le Short.

---

## Etat actuel : 7/8 Actes ont des clips, mais 4 trous dans la timeline

### Clips valides sur disque

| Fichier | Duree | Couvre (timing narration) |
|---|---|---|
| `acte1-setup-v1.mp4` | 13.07s | Acte I complet (0.00-12.12s) |
| `acte2-insulte.mp4` | 5.06s | Insulte seulement (21.22-28.78s) |
| `acte3-iron-bar-v1.mp4` | 15.07s | Rampement (12.64s) + barre de fer + debout + baobab arrache (46.08s) — DOUBLE ROLE couvre fin Acte II + quasi tout Acte III |
| `acte4-clip1-exil-mema-messagers-v3-final.mp4` | 15.32s | Exil + Mema + messagers (48.44-62.76s) + freeze |
| `acte4-clip2-lion-revient-v1.mp4` | 5.06s | Lion revient (63.32-64.88s) |
| `acte-v-final.mp4` (dans `actes/`) | 24.19s | Acte V complet (65.52-87.28s) — render Remotion |
| `soundjata-charte-v5-audio.mp4` (dans `out/`) | 20.63s | Acte VI complet (87.70-108.26s) — render Remotion |
| `acte7-full-v1.mp4` (dans `out/acteVII-final/`) | 13.29s | Acte VII complet (108.98-122.20s) — render Remotion |

### Les 4 trous dans la timeline

```
0s ──── Acte I OK ────12.12s
12.12s ── gap 0.52s silence ──12.64s
12.64s ── iron-bar frame 1 (rampement) ──15.68s
15.68s ── TROU A (5.14s) ──20.82s    <-- epouseRidiculise + humiliationMere
20.82s ── gap 0.40s ──21.22s
21.22s ── acte2-insulte.mp4 ──28.78s
28.78s ── TROU B (2.86s) ──31.64s    <-- "cette insulte va changer l'histoire"
31.64s ── gap 0.42s ──32.06s
32.06s ── iron-bar frames 3-15 ──46.08s (barre + baobab)
46.08s ── gap 0.34s ──46.42s
46.42s ── TROU C (1.30s) ──47.72s    <-- "il ne rampera plus jamais"
47.72s ── gap 0.72s ──48.44s
48.44s ──── Actes IV-VII OK ────122.20s
122.20s ── gap 0.50s ──122.70s
122.70s ── TROU D (6.40s) ──129.10s  <-- Acte VIII close
```

---

## Plan de production des 4 trous

### TROU A — epouseRidiculise + humiliationMere (15.76-20.82s, 5.06s)

**Narration** :
- "La premiere epouse de son pere le ridiculise." (15.76-18.20s, 2.44s)
- "Elle humilie sa mere devant tout le village." (18.66-20.82s, 2.16s)

**Contexte visuel** : la rivale (matrone en robe bleue a motifs, celle de `acte2-insulte.mp4`) se moque de Soundjata devant la cour, puis humilie Sogolon (turquoise) publiquement. C'est le SETUP de la scene d'insulte qui suit.

**Approche recommandee** : 2 options

**Option 1 — Remotion pur (recommande, $0.08)** :
- Generer 2 images Gemini : (a) matrone qui rit en montrant du doigt, villageoises en fond, (b) Sogolon humiliee tete baissee, matrone dominante
- Ken Burns / zoom lent sur chaque image, 2.5s par image
- Narration ElevenLabs en overlay
- Avantage : pas de risque Seedance, style controle, rapide

**Option 2 — Clip Seedance 6s ($1.80)** :
- Prompt detaille shot-by-shot (2 shots de 3s)
- Refs : matrone + Sogolon de `acte2-insulte.mp4` (extraire 2 frames comme refs canon)
- Risque : style drift vs les autres clips

### TROU B — reaction (28.78-31.64s, 2.86s)

**Narration** : "Cette insulte va changer l'histoire de l'Afrique de l'Ouest."

**Approche** : Remotion pur ($0.04)
- 1 image Gemini : gros plan visage Soundjata enfant, regard qui se leve, determination dans les yeux
- Ken Burns zoom-in lent sur les yeux (2.86s)
- Narration overlay
- C'est une phrase de TRANSITION — pas besoin de mouvement video

### TROU C — neRamperaPlus (46.42-47.72s, 1.30s)

**Narration** : "Il ne rampera plus jamais."

**Approche** : Remotion pur ($0.00)
- Freeze de la derniere frame de `acte3-iron-bar-v1.mp4` (Soundjata debout, barre tordue) OU
- Image Gemini close-up pieds de Soundjata plantes fermement dans le sol ($0.04)
- 1.30s = trop court pour Seedance (minimum 4s)
- Ken Burns zoom-out lent, ou simple hold avec leger push-in

### TROU D — Acte VIII close (122.70-129.10s, 6.40s)

**Narration** :
- "Un enfant qui rampait a quatre pattes a fonde un empire." (122.70-126.26s, 3.56s)
- "Et pourtant, l'histoire a presque oublie son nom." (126.56-129.10s, 2.54s)

**Approche** : Remotion pur split vertical signature serie ($0.20)
- Cote gauche : Soundjata enfant rampant (frame extraite de `acte3-iron-bar-v1.mp4` frame 1)
- Cote droit : Soundjata adulte guerrier (ref `soundjata-adult-warrior-ref.png`)
- Animation : split qui se revele avec spring(), texte "SOUNDJATA KEITA" apparait
- Fade to black sur la phrase finale
- 2 images Gemini pour le split : enfant close (deja disponible) + adulte close (deja disponible)
- C'est la signature visuelle de la serie "Heros Oublies"

---

## Budget total pour finir

| Trou | Approche | Cout |
|---|---|---|
| A (5.06s) | Remotion pur + 2 images Gemini | ~$0.08 |
| B (2.86s) | Remotion pur + 1 image Gemini | ~$0.04 |
| C (1.30s) | Remotion pur (freeze frame existant) | $0.00 |
| D (6.40s) | Remotion pur + 2 images Gemini (existantes) | ~$0.08 |
| **Total** | | **~$0.20** |

**Alternative si Seedance pour Trou A** : +$1.80, total ~$2.00

---

## Composition finale SoundjataShort.tsx

Apres les 4 trous combles, la composition Remotion assemblera :

```
<TransitionSeries>
  <Acte I>    acte1-setup-v1.mp4 (13.07s)
  <Acte II>   iron-bar frame 1 (rampement, ~3s)
              + TROU A Remotion (5.06s)
              + acte2-insulte.mp4 (5.06s, potentiellement avec insult-dialogue.mp3)
  <Acte III>  TROU B Remotion (2.86s)
              + acte3-iron-bar-v1.mp4 trimme (debut sans rampement, ~12s)
              + TROU C Remotion (1.30s)
  <Acte IV>   acte4-clip1-v3-final.mp4 (15.32s)
              + acte4-clip2-lion-revient-v1.mp4 (5.06s)
  <Acte V>    acte-v-final.mp4 (24.19s)
  <Acte VI>   SoundjataCharte composition (20.63s)
  <Acte VII>  SoundjataActeVII composition (13.29s)
  <Acte VIII> TROU D Remotion (6.40s)
</TransitionSeries>

Duree totale : ~129s
Narration : narration-full.mp3 en piste unique
```

**Decisions a prendre en session** :
1. Acte II insulte : utiliser la narration ElevenLabs OU le dialogue audio `insult-dialogue.mp3` (voix de matrone) ?
2. Iron-bar clip : trimmer le debut (rampement) pour l'utiliser en Acte II, ou le garder entier en Acte III et generer un clip rampement separe pour l'Acte II ?
3. Transitions entre Actes : fades courts ? hard cuts ? wipes ?

---

## Refs disponibles (aucune generation necessaire)

- Sogolon : frames de `acte2-insulte.mp4` (turquoise)
- Matrone : frames de `acte2-insulte.mp4` (bleu motifs)
- Soundjata enfant rampant : frame 1 de `acte3-iron-bar-v1.mp4`
- Soundjata enfant debout : frame 10 de `acte3-iron-bar-v1.mp4`
- Soundjata adulte guerrier : `soundjata-adult-warrior-ref.png`

---

## Regles a appliquer (lecons session 2026-04-16)

1. **Prompt detaille shot-by-shot <4000 chars** pour tout clip Seedance (si utilise)
2. **Style** : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors"
3. **Self-review severe** : comparer visage side-by-side avec ref canon, style vs clips valides
4. **Anti-artefacts** : no morphing, RIGID, ALREADY in position, NO crown/scepter
5. **Verbes d'action forts** pour dynamisme
6. **Limite 4000 chars** meme via API fal.ai

---

## Resume 1-phrase

4 trous (15.62s combines) restent dans la timeline Soundjata, tous resolvables en Remotion pur (~$0.20), pour une composition finale de ~129s. Le Short est a 90% termine.

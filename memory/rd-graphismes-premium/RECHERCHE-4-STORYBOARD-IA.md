# R&D Graphismes Premium — Recherche 4
## Sujet : Storyboard IA → motion graphics cohérents — GPT Image 2, Recraft, workflow image→code
## Date : 2026-05-20
## Méthode : last30days (Reddit + X + YouTube + TikTok + Polymarket) + WebSearch
## Script : 70 threads Reddit · 15 posts X · 9 vidéos YouTube · 13 vidéos TikTok · 20 pages Web

---

## 1. Le workflow dominant en 2026 — GPT Image 2.0 → Seedance 2.0

### Signal cross-platform (le plus fort de la recherche)
Même pipeline documenté indépendamment par 6+ créateurs différents :
- @benkaluza.lab (TikTok, 23 255 vues + 1 046 vues) — 2 posts dédiés avec tutoriels
- @aisavvy (TikTok, 31 854 vues, 1 238 likes) — workflow complet documenté
- @oderatech (TikTok, 16 130 vues, 1 036 likes)
- @EricoolWong (X, 2 posts) — prompt détaillé inclus
- @Studio_Tora_lab (X, 732 likes) — "exact prompt I used"
- @sastro_dev (TikTok, 2 posts)

### Pourquoi GPT Image 2.0 est parfait pour les storyboards

**Propriété fondamentale (per devtalk.com, nemovideo.com) :**
Une grille 3×3 ou 4×4 = 9-16 frames dans UNE SEULE image. GPT Image 2 maintient automatiquement la cohérence visuelle (même personnage, même style, même palette) sur tous les panels — parce que tout est dans le même canvas. Zéro ingénierie de cohérence nécessaire.

**Ce que ça donne pour nous :**
Une grille storyboard = notre beat entier visualisé en une image. On la donne à Gemini qui code en conséquence. Fidélité maximale, zéro drift.

### Le prompt storyboard de @benkaluza.lab (documenté verbatim)
```
Create a 4x4 storyboard grid (16 frames total) with thin black borders separating 
each frame. Add a bold sans-serif number (1–16) in the top-[corner] of each frame.
[Style direction] [Camera shots] [Character action] [Visual guidelines]
```

### Le prompt storyboard de @EricoolWong (documenté verbatim)
```
Storyboard for 16:9 grid, style direction, camera shots, character action, 
visual guidelines. Core Concept, Style, Cinematography, Action Flow, 
Character Reference Sheet.
```

### Le prompt cinématique de @FutureVibesAi (X)
```
Create a cinematic director-style PREVIS storyboard using only ultra-minimal 
gesture figures and abstract motion silhouettes. Avoid realistic anatomy. 
The central character w[ith motion path indicated].
```

---

## 2. Recraft — réponse définitive

### Ce que Recraft fait vraiment bien
- Génération vectorielle : icônes, logos, illustrations éditables
- **Brand style custom** : uploader des assets de référence → il apprend l'identité visuelle → génère du contenu cohérent dans ce style
- Thumbnails et key art cinématiques
- Intégration directe Kling/Sora/Veo dans le même canvas (image → animation)
- Texte dans les images : fiable pour posters, logos, social graphics

### Pourquoi Recraft n'apparaît pas dans les workflows motion graphics éditoriaux
**Absent de tous les threads storyboard/motion graphics de la recherche.**
Son créneau dominant = illustration vectorielle, brand kits, icônes.
@kadinventor (X) le liste dans le "2026 AI Design Toolkit" entre Firefly et Canva Magic — contexte design, pas vidéo.

### Usage pertinent pour nous
Recraft a un usage potentiel précis : générer des **icônes et assets vectoriels** pour nos overlays (badges, pictogrammes, flags stylisés). Pas pour les storyboards ni les backgrounds. Notre SVGGrain + Tailwind reste supérieur pour les backgrounds.

---

## 3. Le vrai workflow pour notre cas — adapté GéoAfrique

### Ce que @JJEnglert révèle complètement (X, 638 likes)
> "My entire video stack is now 3 tools: Claude Code + HyperFrames + Descript.
> The unlock is the brand style guide."

**Le brand style guide = notre Tailwind system navy/gold/ivory.** On l'a déjà. C'est lui qui assure la cohérence entre tous nos beats — exactement comme un style guide Midjourney --sref.

### Pipeline adapté GéoAfrique — notre version

```
1. GPT Image 2.0
   → Prompt : grille 4×4, style navy/gold/ivory, typo bold, fond texturé
   → Output : image storyboard 16 frames cohérents

2. Gemini 3.1-pro (i2i)
   → Input : image storyboard GPT Image 2.0
   → Breakdown JSON : zones %, classes Tailwind, timing segments
   → Output : manifest technique du beat

3. Claude Code + Remotion
   → Input : manifest JSON + storyboard image
   → Code : Beat*.tsx Tailwind, audio-ancré
   → Output : render MP4
```

Ce pipeline remplace notre workflow actuel "storyboard textuel → Gemini breakdown" par un storyboard **visuel** généré IA — fidélité nettement supérieure.

---

## 4. Higgsfield + Gemini — outil émergent à surveiller

### Signal X (3 posts indépendants, ~100 likes total)
- @ZephyraLeigh : "Higgsfield running on Gemini — quality jump huge, cinematic motion graphics that feel polished, frame-by-frame control"
- @Iancu_ai : "Typography as cinematography. Coherent text generation. Cinematic motion graphics."
- @shiri_shh (Recherche 2) : même signal

**Ce que Higgsfield fait :** génère des motion graphics cinématiques avec contrôle frame par frame + texte cohérent. Alternative à Seedance pour notre usage (pas de personnages pixel, mais des layouts éditoriaux animés).

**Pertinence pour nous :** potentiellement utile pour générer des séquences d'animation de backgrounds premium (fond texturé animé, transitions cinématiques) qu'on intègrerait dans Remotion.

---

## 5. ViMax — alternative gratuite aux 5 outils payants

### @KanikaBK (X, 847 likes, 118 RT) — signal fort
> "Stop paying $114 a month for five AI tools (Runway, ChatGPT Plus, Midjourney, HeyGen).
> FREE GitHub repo ViMax — writes the full script, designs the storyboard,
> generates consistent characters, syncs audio."

Repo GitHub open source qui combine storyboard + characters + audio sync. À explorer si on veut un pipeline 100% local/gratuit.

---

## 6. Signal Polymarket — contexte IA

**Anthropic à 97%** pour "meilleur modèle IA fin mai 2026" (Polymarket, $8.5M volume).
Claude est notre outil principal. On est sur le bon cheval pour encore longtemps.

---

## 7. Ce qu'on doit tester concrètement

### Test prioritaire : GPT Image 2.0 storyboard pour un beat Sénégal

Prompt à tester pour Beat1 Sénégal (acte révélation — BigStat $8M) :
```
Create a 3x3 storyboard grid (9 frames) for a documentary motion graphics beat.
Style: dark navy background (#0b1f35), gold accent (#d4a93c), ivory text (#f5f0e8).
Grain texture overlay on all panels. Bold sans-serif typography.
Frame 1: Wide Mapbox-style map of Senegal coastline, gold offshore markers
Frame 2: Close-up offshore platform label "SANGOMAR" with coordinates
Frame 3: Dark panel — large bold stat "$8M" in gold, ivory subtitle
Frame 4-6: Text fracture animation — stat splits, question appears
Frame 7-9: Sankey flow diagram — 3 blocs financial flows, minimal labels
Thin borders between frames, frame numbers top-left.
```

Ce prompt teste si GPT Image 2.0 peut générer un storyboard fidèle à notre charte navy/gold avant qu'on code.

---

## 8. Sources

| Source | Plateforme | Engagement | Signal |
|--------|-----------|------------|--------|
| @benkaluza.lab | TikTok | 23 255 vues + multi-posts | Pipeline GPT Image 2 → Seedance + prompt verbatim |
| @aisavvy | TikTok | 31 854 vues · 1 238 likes | Workflow storyboard complet |
| @oderatech | TikTok | 16 130 vues · 1 036 likes | Storyboard → vidéo step by step |
| @KanikaBK | X | 847 likes · 118 RT | ViMax open source — pipeline gratuit |
| @givros | X | 1 499 likes | GPT Image 2.0 → assets → Codex workflow |
| @JJEnglert | X | 638 likes | Brand style guide = le vrai unlock |
| @ZephyraLeigh | X | 39 likes | Higgsfield + Gemini = motion graphics cinématiques |
| nemovideo.com | Web | — | GPT Image 2 grille 3x3 — cohérence automatique |
| devtalk.com | Web | — | Pipeline GPT Image 2 + Seedance — expériences utilisateurs |
| toolsforhumans.ai | Web | — | Recraft review 2026 — brand style custom |
| blog.lon.tv | Web | — | Remotion validé presse grand public mai 2026 |
| Polymarket | — | $8.5M volume | Anthropic 97% meilleur modèle fin mai 2026 |

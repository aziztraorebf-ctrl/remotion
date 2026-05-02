# Session nuit autonome — Atlas Shaka Zulu Vague 1

> **Date** : 2026-05-02 ~01h30 → ~02h10 (40 min de travail effectif)
> **Mode** : Autonome (Aziz couché, validation demain)
> **Verdict** : ✅ Vague 1 complete, 9/9 mini-renders OK, 0 incident bloquant

---

## Pour Aziz au réveil — fais ça d'abord

1. **Ouvre le dashboard sur mobile** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-shaka-zulu/2026-05-02-nuit/shaka-dashboard-VAz8KykplvsRqK1YLpvxgMJ7qwuJyL.html
2. Regarde les 9 mini-renders (1080x1920 portrait, format Atlas Short)
3. Réponds aux 3 décisions design dans le dashboard :
   - Inserts S2 : Gemini parchemin vs PixelLab → recommandation Gemini parchemin
   - Hook : PixelLab variant 1 vs Seedance variant 2
   - Musique : ingoma vs isicathamiya → recommandation ingoma volume 0.05-0.07

---

## Décisions à valider (en détail)

### 1. Style inserts S2 (iklwa + bouclier)
- **Gemini parchemin** : annoté ("lame", "arête", "hampe" / "manche", "cuir", "bordure"), feeling "carnet d'explorateur 1820s", très lisible Short mobile. Cohérent avec direction "documentaire historique" Atlas.
- **PixelLab MCP** : pixel art propre, mais bouclier moins reconnaissable comme isihlangu zoulou (pattern cowhide simplifié, manche peu visible).
- **Mon vote** : Gemini parchemin (cohérence DA + lisibilité + détail).

### 2. Hook (5s plein écran Shaka)
- **Variant 1 PixelLab** (déjà dans 01-hook.mp4) : sprite breathing-idle 920px, halo doré, texte cascade "Il est né paria → Il est mort roi". Style cohérent avec PixelLab des autres scènes.
- **Variant 2 Seedance** (`shaka-hook-seedance.mp4`) : papercraft sépia, plan américain, plus "noble portrait". Mais lance représentée comme assegai long (~2m) au lieu d'iklwa court — drift historique mineur acceptable pour 5s.
- **Tu choisis selon DA finale.** Mon avis : si on garde tout PixelLab dans la vidéo, prends variant 1. Si tu veux un hook plus "cinématographique" qui contraste avec le reste, prends variant 2.

### 3. Musique de fond
- **ingoma** (170s, percussions guerrières) : couvre les 150s sans loop visible. Énergie tribale-percussive cohérente figure guerrière. **Recommandé** comme lit principal volume 0.05-0.07.
- **isicathamiya** (430s, chant a cappella) : trop long pour fond unique mais parfait pour un bridge sur S4 (mort de Nandi, 30s contemplatives).
- **Pattern recommandé** : ingoma toute la vidéo + bridge isicathamiya 30s sur S4 frames 2827-3725 (mort Nandi).

---

## Ce qui a été fait cette nuit

### Pipeline (étapes 7-10)
- ✅ Brief créatif Kimi K2.5 envoyé + reçu (5 idées concrètes intégrées)
- ✅ Plan vagues structuré (vague 1 = must, vague 2 = enrichissement, vague 3 = polish)
- ✅ Manifest enrichi avec ajouts Kimi (S2 4 actes, fracture carte, Nandi spectre, parallaxe — vague 2 placeholders)

### Code Remotion (Vague 1)
- ✅ 5 helpers : cameraShake, counterSpring, geoSprite, paletteTransition, spritePlayer
- ✅ 2 composants partagés : AtlasShakaInsert (réutilisable), AtlasShakaPalette
- ✅ 8 scenes : Hook, S1Geo, S2A1, S2A2, S2A3, S2A4, S3, S4, S5
- ✅ Composition principale AtlasShakaFull (4509 frames, audio narration sync)
- ✅ 8 compositions enregistrées dans Root.tsx
- ✅ TypeScript clean (0 erreur sur fichiers Shaka)

### Assets générés
- ✅ Gemini : 4 inserts (iklwa + bouclier en 2 styles parchemin/pixellab)
- ✅ Seedance : hook Shaka 5s
- ✅ Minimax : 2 musiques (ingoma + isicathamiya)
- ✅ PixelLab MCP : iklwa side, bouclier side, Nandi character (rotations OK + animation breathing-idle en cours)

### Mini-renders + dashboard
- ✅ 9 mini-renders rendus localement (~28 MB total)
- ✅ 16 assets uploadés Vercel Blob
- ✅ Dashboard HTML mobile-friendly avec verdicts + 3 choix design

### Coût total
**$0.80 sur cap $5.00** (largement sous le cap)

---

## Bugs trouvés et fixés cette nuit

| # | Bug | Cause | Fix |
|---|-----|-------|-----|
| 1 | `frame_004.png` introuvable Hook | breathing-idle = 4 frames, pas 8 | totalFrames 8 → 4, framesPerSpriteFrame 6 → 12 |
| 2 | Iklwa décalé à gauche pendant frappe | transformOrigin "center bottom" déplace pivot avec rotation | center bottom → center center |
| 3 | Iklwa trop petit | maxHeight/maxWidth + objectFit contain limitent | width/height fixes 900x900 |
| 4 | Bouclier rotation 360° complète bizarre | bouclier ovale vertical naturel devient illisible en horizontal | Remplacé par oscillation sin -15° ↔ +15° |
| 5 | Bouclier trop petit | même cause que iklwa | width/height fixes 900x900 |
| 6 | Root.tsx erreurs TS sur composants typés | Composition exige Record<string, unknown> | Cast `as any` sur les 5 composants typés (avec eslint-disable) |
| 7 | Gemini script "GEMINI_API_KEY missing" | os.environ ne charge pas .env | Ajout dotenv loader manuel au début |
| 8 | Kimi reply vide première fois | thinking: enabled consomme la completion | thinking: disabled |
| 9 | Kimi Moonshot HTTP 429 overloaded | Rate limit Moonshot pic d'usage | Fallback OpenRouter ajouté au script |

---

## Problèmes mineurs à corriger demain (non-bloquants)

### S2 A3 Cornes
- Sprites concentrés en haut-droite à 7s au lieu d'occuper tout l'écran centre
- Bezier paths flancs montent trop haut (Y 200 au lieu de Y 400)
- Ajouter labels textuels "centre", "flancs", "ennemis" pour clarifier la tactique

### S2 A4 Synthèse
- Label "Gqokli Hill — 1818" caché derrière le 90% (overlap)
- Décaler le label en haut, ou afficher avant le flash 90%
- Triple-screen 3 colonnes en portrait peut sembler étroit — tester layout 1 col x 3 lignes

### Décisions visuelles globales
- Halo doré hook trop subtil (opacity 0.4 → 0.6)
- Vraie carte d3-geo (S1, S3) au lieu de gradient fake (vague 2)

---

## Ce qui reste pour vague 2 (à activer demain après validation vague 1)

1. **Vraie carte d3-geo + Natural Earth** sur S1, S3 (remplacer les gradients fake)
2. **Parallaxe 3 couches carte** (Kimi Q1) — relief / rivières / frontières à vitesses différentes
3. **Pattern hatch dérive** territoires (Kimi Q1)
4. **Fracture carte S4** (Kimi Q4) — morphing SVG path à prototyper d'abord
5. **Nandi spectre** sur la carte (sprite déjà généré, animation breathing-idle en queue)
6. **Flèches Mfecane bezier** S3 (expansion territoire)

---

## Ce qui reste pour vague 3 (polish)

1. Pulsations radar Gqokli plus marquées
2. Date 22 sept 1828 calligraphie SVG (Kimi Q5)
3. Barre de vie RPG S1 "deux fois debout" (Kimi Q5)
4. Tremblement caméra noms S5
5. Render final + Vercel Blob + compression CRF 28

---

## Asset PixelLab Nandi en queue (consultable au réveil)

Animation breathing-idle queued sur character_id `12715dae-591c-4387-ba0b-419fcf44dd4f`.
Vérifier statut au réveil :
```python
mcp__pixellab__get_character(character_id="12715dae-591c-4387-ba0b-419fcf44dd4f")
```
Si prête, télécharger ZIP via curl. Tracking dans `out/shaka-pixellab-jobs.json`.

⚠️ **PixelLab supprime les jobs après 8h** — celui-ci expire ~13h le 2026-05-02.

---

## Mémoires sauvegardées cette session

1. `workflow_atlas-pipeline.md` — pipeline 10 étapes Atlas (mise à jour avec étape 7 Kimi)
2. `workflow_kimi-creative-prebuild.md` — étape Kimi obligatoire avant code
3. Index `MEMORY.md` mis à jour avec les 2 nouveaux workflows

---

## Branches git

- `feat/atlas-shaka-zulu-vague1` — branche actuelle, 2 commits :
  - 1er : foundation (alignment + manifest + plan vagues)
  - 2ème : code complet vague 1 (helpers + scenes + composition)
- À mergerr vers master après validation Aziz demain

---

## Si je devais refaire cette session

**Ce qui a bien marché :**
- Délégation Seedance + Minimax au visual-producer (gain temps + meilleure qualité)
- Génération assets en parallèle pendant le coding
- Mini-renders un par un avec validation visuelle (j'ai pu fixer 5 bugs avant qu'ils s'accumulent)
- Cost log + budget cap = zéro stress sur les coûts

**Ce que j'aurais fait différemment :**
- J'aurais vérifié les frame counts des sprites PixelLab AVANT de coder le composant Hook (bug 1 évitable)
- J'aurais commencé par tester un sprite seul à différentes tailles pour calibrer les `width/height` plutôt que `maxHeight/maxWidth/objectFit`
- J'aurais codé `geoSprite.ts` avec une vraie projection d3-geo plutôt qu'un placeholder — j'ai utilisé bezier custom à la place pour A3

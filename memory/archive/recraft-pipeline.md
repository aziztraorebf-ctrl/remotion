# Recraft V4 — Pipeline Reference
> Cree : 2026-03-09 | Source : transcripts audio analysés par agent

---

## Architecture Recraft V4

### Principe fondamental
- **Direct path generation** : SVG généré directement depuis le latent space — PAS de raster-to-vector tracing caché
- Le modèle output des coordonnées mathématiques (curves, anchor points, path data) directement
- Résultat : paths propres, layers organisés, color regions discrets, zero overlapping shapes cachés

### Capacités prompting
- Prompts jusqu'à **10 000 caractères** supportés
- Gère les coordonnées spatiales dans le texte ("en haut à gauche", coordonnées précises)
- **Typography first-class** : intégrée à la structure de la composition, pas stampée après
- Respecte l'ordre de layout hiérarchique défini dans le prompt

### Design Taste Engine
- Variable computationnelle (pas un filtre esthétique post-génération)
- Art-directed intent : color harmony, spatial composition, layout hierarchy, équilibre négatif
- Entraîné avec des designers professionnels → comprend les conventions de design
- Cohérence style dans un set d'icônes : stroke weights uniformes, accents couleur constants

### Exploration Mode
- **1 prompt → plusieurs directions esthétiques simultanément**
- Utile pour A/B tester des styles avant de committer un design system
- Shift du workflow : prompt engineering → évaluation stratégie visuelle

---

## Modèles disponibles (mis à jour 2026-03-15)

### Accès
- **MCP Recraft** : expose `recraftv3` et `recraftv2` UNIQUEMENT — V4 non disponible via MCP
- **API directe** (`https://external.api.recraft.ai/v1`) : V4 accessible, Bearer token requis

### Tableau complet

| Modèle | Accès | Usage |
|--------|-------|-------|
| `recraftv3` | MCP + API | Raster V3, supporte styles, negative_prompt, style_id |
| `recraftv3_vector` | MCP + API | SVG V3, supporte styles personnalisés |
| `recraftv4` | API directe seulement | Raster standard 1MP, "design taste" |
| `recraftv4_vector` | API directe seulement | SVG natif 1MP — **meilleur pour assets GeoAfrique** |
| `recraftv4_pro` | API directe seulement | Raster 4MP (2048x2048) |
| `recraftv4_pro_vector` | API directe seulement | SVG natif haute résolution |

### Limites V4 vs V3
V4 NE supporte PAS : `style_id`, `negative_prompt`, `artistic_level`, `no_text`, styles personnalisés.
Pour imposer une direction artistique précise → utiliser `recraftv3_vector` avec style_id.
V4 Vector ne supporte que `1024x1024` (pas de formats panoramiques 16:9).

### REGLE CRITIQUE — SVG Recraft non animable par elements (prouve empiriquement 2026-03-15)
- V3 MCP : 197 paths, 0 groupes, 0 IDs
- V4 API directe (`recraftv4_vector`) : 390 paths, 0 groupes, 4 IDs
- La doc Recraft promet "layers separes ciblables" — FAUX en pratique
- **Recraft SVG = image bloc uniquement** : zoom/pan/scale global dans Remotion
- Pour animer des elements independants (personnage, animal, decor) : construire le SVG manuellement en React dans Remotion — jamais compter sur la structure interne des SVG Recraft

### Pourquoi V4 Pro pour print
- 300 DPI commercial printing expose chaque flaw de path
- Pro génère des node structures plus propres → ne crashe pas les raster image processors d'imprimante

---

## SVG natif — specs

- Taille typique : **47 KB** (vs 5 MB+ raster équivalent)
- Infiniment scalable sans perte (favicon 16px → billboard)
- Immédiatement compatible : Figma, Illustrator, Sketch, Remotion
- Layers séparés et propres → **chaque layer ciblable individuellement pour animation**
- Autotraced SVG (ancienne méthode) → milliers de paths fragmentés → inutilisable pour animation

**CORRECTION EMPIRIQUE (2026-03-15) :** SVG Recraft V3 testé en prod = 197 paths, 0 groupes, 0 IDs.
La promesse "layers séparés ciblables" s'applique à V4 via API directe — pas confirmée sur V3 via MCP.
Avant d'animer un SVG Recraft par éléments, toujours vérifier : `grep -c "<g" fichier.svg`.
Si résultat = 0 → traiter comme image bloc (zoom/pan uniquement), pas animation par parties.

---

## Pipeline Recraft → Claude Code → Remotion

### MCP Bridge
```
prompt terminal → Claude Code → MCP bridge → Recraft API → SVG XML → MCP bridge → Claude → React component folder
```
- Zero drag & drop : Claude écrit le SVG directement dans le bon dossier
- Claude lit les hex codes du SVG → les mappe vers CSS variables / design tokens
- Governance : CLAUDE.md définit design system → Claude remplace hex hardcodés par variables projet

### Multi-agent orchestration (pattern documenté)
1. **PRD creator agent** : rédige requirements depuis le prompt
2. **Task executor front-end agent** : implémente React + intègre SVG
3. **Design verification agent** : audite code vs règles CLAUDE.md

### Animation SVG dans Remotion
- SVG V4 = layers propres → Claude isole éléments (logo mark, voile, hull, etc.)
- Spring physics : `mass`, `stiffness`, `damping` → `useCurrentFrame()` + `spring()`
- Pattern : isoler l'élément mobile → appliquer spring → background statique
- Agent Skills Remotion : Claude connaît `Composition`, `Sequence`, `AbsoluteFill`, `useVideoConfig()`

### QA Playwright (avancé)
- Claude Code + Playwright MCP → headless browser autonome
- Inspecte animations Remotion en real-time (DOM trees, Spring timing, visual misalignments)
- Loop autonome : détecte → corrige code → re-vérifie

---

## Assets GeoAfrique — Recraft vs SVG codé

### Recraft V4 Pro (recommandé)
- **Pirogue** : forme organique (coque courbée, voile textile) — voile + hull animables séparément
- **Mansa Musa** : silhouette + vêtements détaillés + posture
- **Décors de fond** : village, mosquée, caravane (compositions multi-layers)

### SVG codé manuellement (recommandé)
- **Vagues** : pattern cyclique mathématique → `sin()` + spring → plus de contrôle sur animation cyclique
- **Carte Afrique géo précise** : si coordonnées exactes requises (GeoJSON + D3 ou SVG inline)
- **UI elements simples** : flèches, tirets, lignes de route, icônes
- **Texte animé** : Remotion natif

---

## Setup (CONFIRME - 2026-03-09)

### Clé API
- Dans `.env` : `RECRAFT_API_KEY=...`
- Variable d'env MCP : `RECRAFT_API_TOKEN` (PAS RECRAFT_API_KEY — nom different)
- Dans CLAUDE.md projet : section "Cles API" mise a jour

### MCP Server (INSTALLE - ATTENTION LIMITATIONS)
- Package : `@recraft-ai/mcp-recraft-server` (v1.6.5)
- Type : stdio, command `npx -y @recraft-ai/mcp-recraft-server`
- Config `.mcp.json` : entree "recraft" ajoutee avec RECRAFT_API_TOKEN
- **LIMITATION CRITIQUE** : Ce MCP ne supporte PAS recraftv4_vector
- Models dispo via MCP : `recraftv3`, `recraftv2`, `recraft20b`, `flux1_1pro`, `imagen4`, `gpt_image_1_high`, etc.
- Pour recraftv4_vector : appel REST direct a l'API Recraft (pas via MCP)

### Outils MCP disponibles (9 outils)
- `generate_image` : generation depuis prompt texte (style, substyle, model, size, numberOfImages 1-6)
- `create_style` : creer un style custom depuis images de reference
- `vectorize_image` : vectoriser une image raster existante → SVG
- `image_to_image` : generation depuis image de reference + prompt
- `remove_background` : suppression fond
- `replace_background` : remplacement fond via prompt
- `crisp_upscale` : upscale rapide et economique
- `creative_upscale` : upscale avec details fins (lent, couteux)
- `get_user` : infos compte + credit balance

### Model IDs reels (VERIFIE sur code source GitHub officiel — 2026-03-10)

**VERDICT FINAL (source : recraft.ai/docs/api-reference/endpoints.md) :**

`recraftv4` EXISTE via l'API officielle. L'enum complet du parametre `model` :

| Identifiant API | Format | Formats portrait | Usage recommande |
|---|---|---|---|
| `recraftv4` | Raster | 1024x1024 seulement (VERIFIE 2026-03-13) | Non pour GeoAfrique |
| `recraftv4_vector` | **SVG natif** | **1024x1024 seulement** (VERIFIE 2026-03-13 — rejette tout autre format) | Carre uniquement |
| `recraftv4_pro` | Raster | 1024x1024 seulement (VERIFIE 2026-03-13) | Non pour GeoAfrique |
| `recraftv4_pro_vector` | **SVG natif** | **1024x1024 seulement** (VERIFIE 2026-03-13) | Carre uniquement |
| `recraftv3` | Raster | 1024x1707 supporte | — |
| `recraftv3_vector` | SVG natif | **1024x1707 supporte (VERIFIE 2026-03-13)** | **SEUL modele vector portrait** |
| `recraftv2` | Raster | Ancienne | — |
| `recraftv2_vector` | SVG natif | Ancienne | — |

**REGLE PORTRAIT 9:16 (validee 2026-03-13) :** Pour tout asset SVG en format vertical Short, utiliser `recraftv3_vector` + `size: "1024x1707"`. Recraftv4 ne supporte PAS les formats non-carre.

**`refm1`** = identifiant interne MCP uniquement, pas un identifiant API public. Ignorer.

**LIMITATION MCP installe** : ne supporte que `recraftv3` et `recraftv2`.
Pour `recraftv4_vector` : appel API directe obligatoire (curl ou script Python).

**IMPORTANT** : V4 ne supporte PAS les styles nommes ni les custom styles. Controle via prompt uniquement + parametre `controls`.

### Parametres generate_image (CONFIRMES + DOC 2026-03-10)
- `model` : `recraftv3` (seul modele Recraft SVG confirme via API)
- `style` : `vector_illustration` (SVG natif) | `digital_illustration` | `realistic_image`
- `substyle` pour recraftv3 + vector_illustration : bold_stroke, chemistry, colored_stencil, cutout, editorial, emotional_flat, engraving, line_art, linocut, naivector, roundish_flat, segmented_colors, sharp_contrast, thin, vivid_shapes
- `size` : 1024x1024 (defaut), 1024x1707 (9:16 Shorts vertical)
- `numberOfImages` : 1-6

### Parametre `controls` (NON expose par le MCP — API directe uniquement)
```json
{
  "background_color": {"rgb": [5, 2, 8]},
  "colors": [
    {"rgb": [165, 42, 42]},
    {"rgb": [212, 175, 55]},
    {"rgb": [245, 230, 200]}
  ],
  "artistic_level": 3,
  "no_text": true
}
```
- `background_color` : force la couleur de fond — CRITIQUE pour obtenir fond noir #050208
- `colors` : palette RGB preferee — guide le modele vers les bonnes couleurs
- `artistic_level` : 0-5, V3 uniquement (0=conservateur, 5=excentrique)
- `no_text` : supprime le texte auto-genere
- **Ces parametres ne sont PAS disponibles via le MCP installe — necessitent un appel API direct (curl ou script Python)**

### Custom Styles (via API directe)
- Endpoint : `POST /v1/styles` avec 1-5 images de reference + `style` base
- Retourne un `style_id` reutilisable sur toutes les generations
- Compatible V2 et V3 uniquement (pas V4)
- Usage : `style_id` dans le body de generation (exclusif avec `style`)

### Endpoints disponibles (API directe)
- `/v1/images/generations` : generation texte → image/SVG
- `/v1/images/imageToImage` : image → image modifiee (strength 0-1) — V3 only
- `/v1/images/vectorize` : raster → SVG (conversion sans prompt)
- `/v1/styles` : creation custom style depuis images de reference
- `/v1/users/me` : credits restants

---

## Pipeline Recraft vivid_shapes → Kling O3 (VALIDE 2026-03-15)

### Pipeline complet prouve en production

```
1. Generer start frame
   Recraft MCP : recraftv3, vector_illustration, substyle: vivid_shapes
   Size : 1365x1024 (16:9) ou 1024x1707 (9:16 Shorts)
   Output : SVG → sips convert → PNG

2. Creer style custom depuis start frame
   mcp__recraft__create_style(imageURIs=[start_frame.png], style="vector_illustration")
   → style_id (ex: 5c0fd8f3-9176-4caa-9b69-13ed47b00ca9)

3. Generer end frame avec style_id
   mcp__recraft__generate_image(prompt="[position finale]", styleID=style_id, size=meme_taille)
   → end frame coherent (memes formes bold, meme style graphic)
   Note : coherence FORMELLE garantie, coherence chromatique exacte NON garantie

4. Animer avec Kling O3 start+end
   Endpoint : fal-ai/kling-video/o3/standard/image-to-video
   Parametres : tail_image_url=end_frame, cfg_scale=0.35, duration="5" (ou plus)
   Resultat : orbite camera / transition cinematique sans morphing
```

### Assets de reference VALIDES

| Fichier | Description |
|---------|-------------|
| `tmp/brainstorm/references/hannibal-recraft-vivid-startframe.png` | Start frame Hannibal — Recraft V3 vivid_shapes, palette bronze/bleu |
| `tmp/brainstorm/references/hannibal-recraft-vivid-endframe.png` | End frame Hannibal — meme style_id, de dos, armee dans vallee |
| `tmp/brainstorm/references/hannibal-o3-flat-vivid-VALIDATED.mp4` | **VIDEO VALIDEE par Aziz** — orbite 360 Hannibal, 5s, 8.5/10 Kimi |

### Regles critiques

- `cfg_scale 0.35` = OBLIGATOIRE pour flat design. 0.4+ = risque remplissage semantique.
- Dissonance chromatique start/end = lue narrativement par O3 (ex: bronze → vert = changement d'altitude). Accepter ou corriger en post via Remotion.
- Orbite 360 possible UNIQUEMENT en flat design vivid_shapes. Semi-realiste = interdit.
- `vivid_shapes` = meilleur substyle Recraft pour Kling (blocs contrastes → separation des plans).

### Cas d'usage valide

- Scenes epiques avec armees, foules, etendues geographiques
- YouTube Shorts historiques avec liberte visuelle
- Plans larges sans besoin de detail facial
- NE PAS utiliser pour portraits, emotions, personnages reconnaissables → Gemini semi-realiste + V3 Pro

---

## Décision GeoAfrique (validée 2026-03-09)
- Option B choisie : tester Recraft sur pirogue (Beat03) d'abord
- Raison 1 : forme organique non-mathématique → 2-4h codée manuellement, résultat moins riche
- Raison 2 : layers natifs → voile + hull animables indépendamment dès la sortie du modèle

---

## Regle d'Or : Respecter l'Asset (validee 2026-03-09, 4 iterations perdues)

> Recraft cree une harmonie mathematique entre tous les elements d'un SVG (positions, proportions, calques). Briser cette harmonie = iterations perdues.

**NE JAMAIS faire :**
- Reordonner les calques SVG (pour "forcer" la visibilite d'un element)
- Changer `preserveAspectRatio` a `none` (deforme toute la geometrie)
- Supprimer `backgroundColor` de l'`AbsoluteFill` (fond blanc en headless)
- Tordre les paths pour changer la composition

**TOUJOURS faire :**
- Animer uniquement : `opacity`, `translate`, `rotate`, `scale`
- Si la composition ne convient pas → **regenerer avec un nouveau prompt Recraft**
- `preserveAspectRatio="xMidYMid meet"` + `backgroundColor` = regles techniques fixes

---

## Bibliotheque d'Animation (src/hooks/animation/index.ts)

> Asset-agnostique. Valides en production. A consulter avant de re-coder.

| Hook | Returns | Valide sur |
|------|---------|-----------|
| `useOceanSwell(i, frame)` | `ty: number` | RecraftFlotteTest (24 bateaux) |
| `useSpringEntrance(i, frame, fps, delay?)` | `opacity: number` | RecraftFlotteTest |
| `useDrift(i, frame, directionPx, totalFrames?, offset?)` | `tx: number` | RecraftFlotteTest |

**Principe bibliotheque :**
- Hook valide par Aziz → entre dans `index.ts`, jamais re-code dans les composants
- Composant valide par Aziz → entre dans `src/projects/[projet]/components/`
- Hooks = valeur long terme (universels). Composants = lies a un asset specifique.

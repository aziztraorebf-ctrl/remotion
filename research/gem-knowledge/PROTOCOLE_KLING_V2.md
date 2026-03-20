# PROTOCOLE_KLING — "Un Pixel d'Histoire"
> Version 3.0 — mise à jour production 2026-03-15 (O3 + vivid_shapes + règles traits distinctifs)
> Via fal.ai API — pas l'interface web Kling

---

## 1. Pipeline complet (non-négociable)

```
Image source propre (sans texte)        <- Gemini (raster) ou Recraft V4 (SVG assets)
  -> Validation visuelle de l'image     <- vérifier style, composition, absence de texte
  -> Kling i2v (mouvement caméra)       <- fal.ai, V2.1 standard par défaut
  -> Validation clip : ffmpeg -vf fps=1 <- extraire frames AVANT d'intégrer dans Remotion
  -> Remotion : <Video muted> + spring()<- texte, titres, overlays SVG
  -> ElevenLabs audio                   <- voix-off, timing dérivé Whisper
  -> Mini-render npx remotion render    <- BLOQUANT avant de passer au beat suivant
```

**Remotion = assembleur.** Kling = moteur de mouvement. ElevenLabs = source de timing.

---

## 2. Règles de génération d'image source

- **TOUJOURS sans texte** — le texte est ajouté par Remotion. Tout texte dans l'image
  source sera déformé/animé par Kling après 4-5s.

- **Hero Reference sur fond neutre** — générer d'abord l'image principale sur fond sombre
  uniforme (pas de dégradés complexes). C'est la "source de vérité visuelle" du beat.
  Utiliser cette image comme base pour tous les shots du même beat.

- **Décrire UNIQUEMENT ce qui est visible** — ne jamais mentionner des textures, reliefs
  ou détails absents de l'image. Kling les inventera et cassera le style.
  Erreur type : "golden topographical veins" sur une image flat design sans veines.

- **Gemini vs Recraft :**
  - Gemini (PNG/JPG) : cartes, fonds, scènes narratives avec géographie précise
  - Recraft V4 Vector (SVG) : assets animables dans Remotion (flotte, objets géométriques)
  - Recraft V4 : styles/substyles non supportés via API (nommage API != nommage site web)

---

## 3. Structure du prompt — Framework JSON

Kling 3.0 répond mieux à des blocs structurés qu'à des paragraphes libres.
Structure recommandée en 5 blocs :

```
Global_Style     : style artistique global + ancres anti-drift
Visual_Anchor    : description de l'image source (hero reference)
Camera_Physics   : mouvement de caméra précis
Sequence_Timing  : shots numérotés avec timing
Audio_Sync       : "No audio generation needed. Muted in Remotion."
```

**Format prompt texte pour fal.ai :**
```
Shot 1 (0s-5s): [action]. [mouvement caméra].
[ancres style]. [éléments fixes] remain static.
```

**Contrainte technique** : chaque shot = max 512 caractères.

**Multi-shot disponible sur V3 standard (fal.ai) :**
`multi_prompt: [{prompt, duration}]` + `shot_type: "customize"`.
`end_image_url` aussi disponible pour transitions start->end frame.

---

## 4. Choix du modèle Kling

| Modèle | Endpoint fal.ai | Usage | cfg_scale |
|--------|-----------------|-------|-----------|
| **V2.1 standard** | `fal-ai/kling-video/v2.1/standard/image-to-video` | Cartes géo flat design (dolly in) | 0.5-0.6 |
| **V3 standard** | `fal-ai/kling-video/v3/standard/image-to-video` | Personnages flat design, décors animables | **0.35** |
| **V3 pro** | `fal-ai/kling-video/v3/pro/image-to-video` | Portrait semi-réaliste (visage principal) | 0.4 |
| **O3 standard** | `fal-ai/kling-video/o3/standard/image-to-video` | Transition start+end frame (dolly in, orbit) | 0.35-0.4 |

**JAMAIS utiliser V1.6 — version obsolète.**

**Règles critiques validées en production :**

- **V2.1** : défaut pour cartes géo. V3 cfg >= 0.6 = dérive géographique catastrophique (Afrique → Europe à frame 5).
- **V3 cfg 0.35** : standard pour personnages flat design. V2.1 sur personnage = image entière glisse.
- **O3 start+end frame** : meilleur pour transitions contrôlées entre deux compositions. `tail_image_url` = end frame.
- **V3 Pro** : obligatoire pour portrait semi-réaliste (visage principal 1080x1920, détails préservés).
- **Durées** : portrait V3 = 5s suffisant. Orbit O3 = min 8s (5s trop court). Dolly in O3 = 10-15s.
- **V3 / cartes géo** : INTERDIT à cfg >= 0.6. Acceptable cfg 0.3-0.4 uniquement si V2.1 insatisfaisant.

---

## 5. Paramètres techniques fal.ai

| Paramètre | Valeur par défaut | Raison |
|-----------|-------------------|--------|
| Modèle | V2.1 (cartes) / V3 (personnages) / O3 (transitions) | Voir section 4 |
| cfg_scale | 0.35-0.6 selon modèle | Voir section 4 |
| Durée | Caler sur la durée réelle du beat audio | Ne jamais générer en 5s si beat = 13s |
| Aspect ratio | `9:16` | Format natif YouTube Shorts / TikTok |
| Texte dans image | INTERDIT | Sera animé/déformé par Kling après 4-5s |
| Audio Kling | Toujours généré même "sans audio" | → `<OffthreadVideo muted>` dans Remotion obligatoire |

**Règle durée (critique) :** toujours régénérer O3 à la durée exacte du beat. O3 est ~95% déterministe (même style, même trajectoire). Ne jamais utiliser SVG overlay ou playbackRate comme hack de durée.

---

## 6. Mouvements de caméra — compatibilité 9:16 flat design

### Distinction critique : Optical Zoom vs Dolly In

| Mouvement | Comportement Kling | Résultat flat design |
|-----------|-------------------|----------------------|
| **Optical Zoom** | Magnifie l'image, fond statique | Préserve le flat design |
| **Dolly In** | Se déplace dans l'espace 3D | Peut inventer le hors-champ |

Pour les cartes géo flat design : préférer le terme "optical zoom in" dans le prompt.
Toujours ajouter : "No morphing, no distortion."

### Compatibilité par type de mouvement en 9:16

| Mouvement | 9:16 flat design | Note |
|-----------|-----------------|------|
| Optical Zoom In | Recommandé | Fond statique, style préservé |
| Push In / Dolly In lent | Validé production | V2.1 cfg_scale 0.6 |
| Tilt Up/Down léger | Compatible | Effet cinématique doux |
| God's Eye View | Pour cartes/maps | Vue aérienne directement au-dessus |
| Pan léger (max 10-15%) | Risque faible | Si sujet centré |
| Arc Shot orbital | Risqué | Sujet sort du cadre en portrait |
| Truck Right/Left large | Incompatible 9:16 | Continent sort du cadre en 1-2s |
| Zoom Out rapide | Interdit | Kling invente le hors-champ |
| Handheld / Shaky | Interdit | Casse l'esthétique documentaire |

**Règle universelle :** ne jamais demander un mouvement qui révèle du hors-champ
sur une image source non-panoramique. Toujours ajouter : "No morphing, no distortion."

**Alternative Remotion pour effets non-réalisables dans Kling :**
Simuler un drift/pan via CSS transform sur `<Video>` dans Remotion.
Résultat contrôlé à 100%, zéro risque de distorsion.

---

## 7. Ancres anti-drift (à inclure systématiquement)

```
Flat graphic style preserved throughout.
No photorealistic rendering.
No morphing, no distortion.
[Éléments fixes] remain static.
Stars remain static.
Ocean stays [couleur exacte].
```

---

## 8. Notre projet — spécificités validées en production

**Pipeline Recraft vivid_shapes → O3 (VALIDÉ — sujets historiques flat design épique) :**
- Recraft MCP : `style: "vector_illustration"`, `substyle: "vivid_shapes"`, `size: "1024x1707"` (9:16)
- `mcp__recraft__create_style` depuis start frame → style_id pour end frame cohérent
- O3 : cfg_scale 0.35, duration min 8s (orbit complet), `tail_image_url` = end frame
- End frame = SUJET SEUL dans sa pose finale. Jamais l'armée/la foule — Kling les invente mieux.
- **Les images sources vivid_shapes semblent ordinaires isolément. Juger LE CLIP, pas les sources.**

**Pipeline Gemini → Kling O3 (transition dolly in cinématique) :**
- Start frame : Gemini + ref image `Part.from_bytes()` — plan large
- End frame : Gemini + même ref — gros plan / position finale
- O3 cfg_scale 0.4, duration 10-15s selon beat

**Pipeline Gemini → Kling V3 Pro (portrait semi-réaliste) :**
- Pour visages principaux uniquement (détails, émotion)
- V3 Pro = 1080x1920, détails préservés. Cfg_scale 0.4.

**Personnages flat design (V3 standard) :**
- Prompt : "Sub cinematic breathing motion. Maintain strict flat vector illustration style. NO 3D rendering."
- Kling enrichit les personnages même sans détails dans la source : il ajoute yeux, plis de tissu, respiration.
- Mettre dans negative_prompt ce qu'on ne veut PAS voir ajouté.

**Multi-shot O3 :** se structure en texte dans le prompt standard.
Format : `"Shot 1 (0-6s): [description + camera]. Shot 2 (6-11s): [description]."`
Ce n'est PAS un paramètre API séparé.

**Checklist personnage historique avec trait distinctif (avant envoi à Kling) :**
- [ ] Trait visible dans l'image source (oeil fermé, cicatrice, couleur peau particulière)
- [ ] `negative_prompt` : interdire la "correction" (`"open right eye, both eyes open"`)
- [ ] `positive_prompt` : renforcer le trait (`"right eye permanently closed by battle scar"`)
**Kling normalise les traits physiques inhabituels. Le forcer via négatif est OBLIGATOIRE.**

---

## 9. Limitations documentées

| Limitation | Seuil | Workaround |
|------------|-------|------------|
| Drift de forme géo V3 | cfg >= 0.6 | V2.1 par défaut OU V3 cfg 0.3-0.4 |
| Texte dans image source | Déformé après 4-5s | Générer sans texte, texte via Remotion |
| V2.1 sur personnage flat design | Image entière descend | Utiliser V3 cfg 0.35 |
| Traits physiques inhabituels | Kling "normalise" (oeil fermé → ouvre) | negative_prompt OBLIGATOIRE |
| Orbite 360 sur portrait semi-réaliste | Morphing visage garanti | Orbite OK sur vivid_shapes uniquement |
| Allonger durée O3 | N'améliore pas le morphing — l'expose sur plus de frames | Rapprocher end frame de l'état intermédiaire naturel |
| Image source avec éléments de coin (médaillons, arabesques) | Kling les anime → artefacts | PIL crop 120px sur les 4 coins avant upload |
| Kling normalise les traits | Ajoute les yeux même si "no facial features" | Mettre dans negative_prompt si non voulu |
| Kling narrativise | Invente chorégraphie, transfert d'objet, army — ne pas contrer | Laisser Kling inventer les éléments secondaires |
| Défaut dans image source | Répercuté dans le clip | Valider l'image source AVANT Kling |



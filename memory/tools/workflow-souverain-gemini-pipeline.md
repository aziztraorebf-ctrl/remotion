# Pipeline Souverain — Gemini 3.1-pro Vision Breakdown
> **MÉTHODE OFFICIELLE Souverain** validée Aziz.
> Validé : Niger Uranium Beats 2, 3, 7 + Zimbabwe Lithium Beat 2. Reproductible cross-projets.

---

## ⛔ CHECKLIST BLOQUANTE — À COMPLÉTER AVANT D'ÉCRIRE UNE SEULE LIGNE DE CODE

Répondre à chaque question. Si une réponse est NON → arrêter, corriger, puis coder.

```
[ ] 1. J'ai lu le breakdown JSON intégralement (pas skippé)
[ ] 2. Chaque asset "to_generate" → généré avec le prompt COPIÉ MOT POUR MOT du JSON
[ ] 3. Le fond de chaque asset est adapté au fond de destination :
       - Fond sombre (navy, noir) → générer sur fond NOIR + mixBlendMode: "screen"
       - Fond clair (crème, kraft) → générer sur fond CRÈME #d4c29d solide
[ ] 4. Aucun SVG custom ne remplace un PNG demandé dans le JSON
[ ] 5. Les frames audio sont calées sur les "audio_cue_word" du JSON (pas inventées)
[ ] 6. Les positions XY du JSON sont utilisées comme base (pas approximées librement)
```

**Interdictions absolues** :
- ❌ Réécrire le prompt d'un asset (copier mot pour mot ou ne pas générer)
- ❌ Dessiner en SVG ce que le JSON demande de générer en PNG
- ❌ Tenter alpha_composite PIL ou chroma key manuel pour la transparence
- ❌ Inventer des animations non présentes dans le JSON sans validation Aziz

---

## Principe

Au lieu d'interpréter un storyboard en code (perte de fidélité ~50%), on demande à **Gemini 3.1-pro** de découper son propre storyboard en recette technique JSON. Claude exécute ensuite la recette à la lettre.

**Fidélité atteinte : ~85-90%** vs ~40-50% avec interprétation directe.
**Le résultat codé peut dépasser visuellement le storyboard** (SVG vectoriel > PNG raster, mouvement permanent, étalement temporel).

---

## Pipeline en 4 étapes

### Étape 0 — Backgrounds de l'épisode (AVANT les beats)

Générer en batch **3-4 backgrounds atmosphériques** pour toute la production. Ne plus générer de fonds beat par beat.

Famille standard :
| Fichier | Ambiance | Usage |
|---------|---------|-------|
| `bg-navy-dots-spotlight.png` | Tech, data, corporate | Beats data-viz |
| `bg-kraft-aged.png` | Chaud, archive, dossier | Beats narratifs |
| `bg-sepia-texture.png` | Parcheminé, géo | Beats carte/géo |
| `bg-noir-cinematic.png` | Dramatique, tension | Beats climax |

Prompt type pour `bg-navy-dots-spotlight.png` :
```
Dark navy blue background #080d14 with a regular pattern of very small dots in slightly lighter navy.
A subtle warm spotlight / vignette emanates from the center-bottom third of the frame, creating depth.
Cinematic, premium, editorial. 1080x1920 portrait. No text, no icons, pure background.
```

## Deux modèles Gemini — rôles distincts et NON interchangeables

| Modèle | Capacité | Rôle dans le pipeline |
|--------|---------|----------------------|
| `gemini-3.1-flash-image-preview` | Génère des images | Étapes 1 et 3 (storyboard + assets) |
| `gemini-3.1-pro-preview` | Analyse des images, produit du texte/JSON | Étape 2 (breakdown technique) |

**3.1-pro-preview ne peut PAS générer d'images.**
**3.1-flash-image-preview ne peut PAS produire un JSON technique précis.**
Ce ne sont pas deux niveaux de qualité du même modèle — ce sont deux spécialités différentes.

### Étape 1 — Storyboard image (`gemini-3.1-flash-image-preview`)

> Après cette étape : lancer automatiquement l'étape 1.5 ci-dessous.

### Étape 1.5 — Amélioration storyboard (`gemini-3.1-pro-preview`) — SYSTÉMATIQUE

```bash
# Analyse seule (affiche les suggestions, pas de régénération)
python3 scripts/improve_storyboard.py <episode> <beat_id>

# Analyse + régénération du storyboard amélioré
python3 scripts/improve_storyboard.py <episode> <beat_id> --apply
```

**Pourquoi systématique :** Flash génère un bon storyboard mais optimise pour l'esthétique statique. Il ne pense pas à l'animation, à la profondeur atmosphérique, aux contraintes Remotion. 3.1-pro voit les deux — il enrichit avant le breakdown.

**Ce que fait le script :**
1. Lit le storyboard Flash existant
2. 3.1-pro analyse : ce qui est flat, ce qui manque, ce qui contredit nos contraintes
3. Suggère des améliorations concrètes (background PNG, éléments SVG, atmosphere)
4. Produit un prompt amélioré pour Flash
5. `--apply` : régénère le storyboard avec le prompt amélioré

**Validation Aziz requise** : regarder le storyboard amélioré et approuver avant de passer à l'Étape 2.

**Validé sur :** Zimbabwe Beat 4 (2026-05-13) — "PowerPoint slide → cinematic documentary frame"

Générer le visuel cible avec refs Or Africain en i2i. Sauver dans `assets/storyboard-v2/<beat-id>.png`.

**Prompt i2i** : inclure les 3 refs Or Africain + "Use reference as EXACT base style" + "NO TEXT, flat compositional graphics reproducible in Remotion".

### Étape 2 — Breakdown JSON (`gemini-3.1-pro-preview`)

Envoyer le storyboard PNG (généré à l'étape 1) en multimodal + prompt structuré.
**3.1-pro reçoit l'image de Flash et la décompose techniquement.** Il ne modifie pas l'image — il la lit et produit une recette.
Réponse JSON avec :
- `background_assets_to_generate` — copier les prompts mot pour mot
- `foreground_visual_elements` — positions XY absolues, hex codes, rotations, z-index
- `animation_timeline` — frames précis avec `audio_cue_word`
- `permanent_motion` — mouvement ambient continu (jamais null)
- `fidelity_warnings` — ce qui est dur + workarounds

**Modèle** : `gemini-3.1-pro-preview` OBLIGATOIRE (pas 2.5-flash)
**Coût** : ~$0.05/breakdown

Prompt complet dans `/tmp/beat3_breakdown_v2.py` (section PROMPT, copier et adapter).

**Règles du prompt à ne pas oublier** :
- ALL TEXT → `css_text / code_only`
- ALL shapes → `svg_shape / code_only`
- Coordonnées [0,0] = top-left, [1080,1920] = bottom-right

### Étape 3 — Génération assets (`gemini-3.1-flash-image-preview`)

Pour chaque entrée `background_assets_to_generate` du JSON :

1. **Copier le champ `prompt` INTÉGRALEMENT** — ne jamais réécrire
2. Choisir la couleur de fond selon destination :
   - Sur fond sombre → ajouter `PURE BLACK BACKGROUND #000000` au prompt
   - Sur fond clair → ajouter `UNIFORM solid CREAM #d4c29d background`
3. Vérifier `pixel(0,0)` : noir ≈ (0-5, 0-5, 0-5) ou crème ≈ (210-220, 185-200, 140-160)
4. En Remotion : `mixBlendMode: "screen"` pour fond noir, rien pour fond crème

### Étape 4 — Code custom (Claude principal)

**Ordre strict** :
1. Ouvrir le JSON breakdown
2. Créer le composant React avec les positions XY exactes du JSON
3. Pour chaque `asset_source: "to_generate"` → `<Img>` vers le PNG généré, jamais SVG custom
4. Pour chaque `asset_source: "code_only"` → SVG/CSS selon le `filename_or_content` du JSON
5. Timeline : `spring()` avec `frame: frame - frame_local_du_JSON`
6. `mixBlendMode: "screen"` sur les assets fond noir

**Springs Souverain** (journalistique, lent) :
```ts
spring({ frame: frame - cueFrame, fps, config: { damping: 90, stiffness: 60 } }) // standard
spring({ frame: frame - stampFrame, fps, config: { damping: 12, stiffness: 120 } }) // stamp impact
```

**Permanent motion obligatoire** (copier la description `permanent_motion` du JSON) :
```ts
const float = Math.sin(frame * 0.04) * 5; // exemple
const grainShift = Math.sin(frame * 0.025) * 3;
```

---

## Règles non-négociables

1. **Toujours envoyer le storyboard PNG** au 3.1-pro (pas juste du texte)
2. **Tous les textes** → `type: "css_text"` / code_only
3. **Toutes les formes simples** → `svg_shape` / code_only
4. **Fond transparent PNG → 2 solutions** (voir `feedback_gemini-assets-fond-transparent.md`)
5. **Pas de SFX nodes** sur fond musical — le pulse visuel suffit
6. **Tampon = info clé contextuelle** (date, lieu), pas un mot fonctionnel
7. **Max 5 secondes sans changement**, min 2 secondes entre changements majeurs
8. **Background lisible sur mobile** : fond minimum `#141c2e`, dots/patterns minimum 28% opacité. Jamais de fond quasi-noir (#080d14) — invisible en plein soleil.
9. **3 types de backgrounds valides uniquement** — dots CSS / kraft PNG / geometric SVG. Jamais de texture fumée/nuages/organique. Voir `feedback_souverain-backgrounds-valides.md`.
10. **Géographie = d3-geo obligatoire** — jamais SVG path approximatif de 3.1-pro. Voir `feedback_geo-zero-approximation.md`.

---

## Gestion des fonds transparents (Résumé)

| Contexte | Solution |
|---------|----------|
| Asset sur fond sombre (navy, noir) | Générer sur fond noir + `mixBlendMode: "screen"` |
| Asset sur fond clair (crème, kraft) | Générer sur fond crème `#d4c29d` solide |
| Ne jamais faire | PIL alpha_composite, chroma key manuel, CSS mask-image |

Détails : `memory/feedback_gemini-assets-fond-transparent.md`

---

## Quand utiliser ce pipeline

- ✅ Beats data-viz, diagrammes, documents, comparaisons
- ✅ Beats avec storyboard à signature visuelle forte
- ✅ Production Souverain où la fidélité visuelle prime
- ❌ Beats Mapbox WebGL — carte interactive, code custom direct
- ❌ Beats PixelLab / walk cycles — pipeline Atlas séparé

---

## Validations cross-projets

| Production | Beat | Résultat | Date |
|-----------|------|---------|------|
| Niger Uranium | Beat 3 (EntityDiagram) | Aziz : "quasiment copie conforme, meilleur que storyboard" | 2026-05-10 |
| Niger Uranium | Beat 2 (ComparisonTable) | Breakdown prêt, à coder | 2026-05-10 |
| Zimbabwe Lithium | Beat 2 (Tension ×15) | Aziz : "encore mieux que le storyboard" | 2026-05-13 |

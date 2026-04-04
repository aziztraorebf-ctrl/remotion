# Recraft — Assets SVG & Personnages
> Pipeline SVG, styles, limites, vivid_shapes.
> Mise a jour : 2026-04-02

---

## Modeles utiles

| Modele | Acces | Format | Usage |
|--------|-------|--------|-------|
| `recraftv3` via MCP | MCP | 1024x1024, 1024x1707 | Raster + styles |
| `recraftv3_vector` via MCP | MCP | 1024x1707 (9:16) | **Seul vecteur 9:16** |
| `recraftv4_vector` via API directe | API REST | 1024x1024 seulement | Carre uniquement |
| `recraftv4_pro_vector` | API REST | 4MP premium | SVG premium, carre |

---

## Traits distinctifs (oeil ferme, cicatrice)

- `image_to_image` corrige les anomalies faciales (rouvre les yeux). Utiliser `generate_image` + Style ID + prompt renforce
- Generer 3 variantes (`numberOfImages: 3`) — au moins 1/3 respecte le trait
- Preferer les traits graphiques simples aux traits complexes — Kling deforme moins les formes simples

---

## SVG vers PNG (NON-NEGOTIABLE)

- Recraft MCP genere des SVG — Kling n'accepte PAS les SVG
- Convertir via `rsvg-convert` : `/opt/homebrew/bin/rsvg-convert -w 1024 -h 1365 input.svg -o output.png`
- Tailles standard : portrait 1024x1365, paysage 1820x1024, carre 1024x1024

---

## Pipeline Recraft pour personnages historiques

1. `create_style()` avec image reference -> Style ID permanent
2. `generate_image()` + Style ID + prompt renforce -> 3 variantes
3. Selectionner la variante correcte -> convertir SVG/PNG
4. Plans larges -> `image_to_image` depuis la reference. Plans portrait -> `generate_image` + Style ID (jamais i2i)

---

## Recraft V4 SVG — Limites

- SVG monolithiques sans IDs semantiques (`path1`, `path2`). Impossible d'animer independamment.
- **Utile pour** : assets autonomes (pirogue, icone), elements decoratifs statiques
- **Inadapte pour** : scenes multi-elements animables

---

## Substyle vivid_shapes

- Meilleur substyle pour Kling : blocs tres contrastes = separation des plans = orbite possible
- Commande MCP : `style: "vector_illustration"`, `substyle: "vivid_shapes"`
- SVG sorti = image bloc (pas animable par elements) — zoom/pan global uniquement
- Images vivid_shapes semblent ordinaires isolement. Kling les eleve en clips exceptionnels.
- L'image source est une intention — Kling cree la scene entre les deux frames.

---

## Style custom (create_style)

- `mcp__recraft__create_style` depuis start frame -> `style_id`
- Garantit coherence FORMELLE (shapes, style) — PAS la coherence chromatique exacte

---

## Regle d'or SVG Recraft

Ne jamais reordonner les calques, changer preserveAspectRatio, supprimer backgroundColor.
Si la composition ne convient pas -> regenerer avec nouveau prompt, pas modifier le SVG.

---

## Pipeline Recraft vivid_shapes -> Kling O3 (VALIDE production)

```
1. Start frame : Recraft MCP recraftv3, vivid_shapes, 1024x1707
2. Style ID    : mcp__recraft__create_style depuis start frame
3. End frame   : Recraft avec meme style_id, position finale
4. Kling O3    : fal-ai/kling-video/o3/standard/image-to-video
                 tail_image_url=end_frame, cfg_scale=0.35, duration="8" min
```

**End frame = sujet seul + pose finale. Pas d'armee — Kling les invente mieux.**

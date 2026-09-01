# PixelLab vary_object — bug download HTTP 500 systématique (2026-05-04)

**Symptôme** : `vary_object` queue OK, `get_map_object` retourne « Map object ready! », mais `curl` sur l'URL download renvoie systématiquement **HTTP 500** (`Internal Server Error`).

**Confirmé sur 4 variations** Lab Hannibal Phase 2 (2026-05-04) :
- `a9b1aa95-b381-46d8-ae50-15886efa3727` (exhausted v1) → 500
- `afc0cd85-bc37-4f10-8901-fae270619b98` (dead v1) → 500
- `7d5269af-cb05-4911-bdf5-2207e773f01c` (exhausted v2) → 500
- `38cbe384-de0b-4920-b08a-d0208b28aa28` (dead v2) → 500

**Possible cause** : la chaîne de stockage Backblaze pour les variations n'est pas correctement configurée côté PixelLab. Les `create_map_object` directs marchent (cf. `ff504818-...` éléphant alive v3 téléchargé OK).

**Workaround validé** : pour générer plusieurs états d'un même asset, faire **N appels `create_map_object` indépendants** avec des descriptions complètes, plutôt qu'1 base + N `vary_object`. Coût marginal = identique (1 crédit/asset). Avantage = pas de dépendance à la chaîne vary qui foire.

**Pattern correct** :
```python
# Au lieu de :
base = create_map_object(description="war elephant walking")
exhausted = vary_object(base, "tired exhausted")  # download 500
dead = vary_object(base, "dead lying down")       # download 500

# Faire :
alive = create_map_object(description="war elephant walking, ivory tusks, red blanket, howdah")
exhausted = create_map_object(description="war elephant tired drooping head, ice on tusks, snow on back, red blanket, howdah")
dead = create_map_object(description="war elephant dead lying on side, eyes closed, red blanket, howdah, snow patches")
```

**Trade-off** : les états perdent en cohérence visuelle exacte (chaque map_object est généré indépendamment). Pour des transitions crossfade Remotion, c'est acceptable car la silhouette + couleurs dominantes restent dans la même famille (descriptions partagent les éléments clés).

**À retester** : si PixelLab corrige `vary_object` à l'avenir, ce workaround peut être retiré. Date constat : 2026-05-04.

Note distincte du gotcha `vary_object` documenté dans `episodes/hannibal/jury-brief-pass2.md` (« vary_object =
variations stylistiques, PAS animation fluide ») — ce fichier-ci documente un bug HTTP différent (download
500 systématique), pas une limite d'usage.

---
Migré depuis auto-memory (`feedback_pixellab-vary-object-download-bug.md`) le 2026-08-31, contenu original inchangé.

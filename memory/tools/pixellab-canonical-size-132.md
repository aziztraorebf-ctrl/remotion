# PixelLab : taille canonique Atlas = 132×132 (size: 96)

**Règle** : pour tout sprite Atlas (personnages humanoids, animaux quadrupèdes), passer **`size: 96`** dans `create_character` → canvas final ~132×132 cohérent avec sprites Empire Ghana validés.

**Why** : Empire Ghana entier (Sundiata, lancier, épéiste, sahelien, almoravide, berbere) a été produit en 132×132. Mélanger des tailles 92×92, 112×112, 124×124 sur un même épisode crée des incohérences d'échelle visuelle qu'on doit corriger en CSS plus tard. Mieux : standardiser à la génération.

**Calcul PixelLab** : `canvas ≈ size × 1.4` (40% padding pour animations).

| size param | canvas final | usage Atlas |
|-----------|--------------|-------------|
| 64 | ~92×92 | INTERDIT (incohérent) |
| 80 | ~112×112 | INTERDIT (incohérent) |
| **96** | **~132×132** | **CANONIQUE Atlas** |
| 128 | ~180×180 | Pour boss/figures héroïques uniquement |

**Constat 2026-05-04 Lab Hannibal** : 6 sprites générés à 4 tailles différentes (64, 80, taille pro auto). Aziz a fait remarquer l'incohérence. Empire Ghana était homogène 132×132 — c'est notre référence.

**How to apply** :

```python
mcp__pixellab__create_character(
    description="...",
    size=96,            # TOUJOURS 96 pour Atlas
    n_directions=8,
    body_type="humanoid",
    # ...
)
```

**Map_object** : pour les objets quadrupèdes (éléphant, chameau quand single direction OK), utiliser `width=160, height=120` ou `width=160, height=160` selon ratio asset. Cohérent avec Empire Ghana balance/sceau/koumbi.

**Validé** : standardisation à appliquer dès Hannibal v1 réel (et tout futur Atlas).

`tools/PIXELLAB-MASTER-INDEX.md` liste les sprites 132×132 déjà produits (table par projet) mais ne
documentait pas explicitement la règle `size: 96` ni le tableau de correspondance ci-dessus — ce
fichier comble ce trou.

---
Migré depuis auto-memory (`feedback_pixellab-canonical-size-132.md`) le 2026-08-31, contenu original inchangé.

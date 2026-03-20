# Assets Library — Réutilisables entre sessions

> Ce dossier contient les assets canoniques à réutiliser.
> Ne pas supprimer. Utiliser comme REF pour Gemini multimodal (Nano Banana, end frames, cohérence personnage).

## Structure

```
library/
  geoafrique/
    characters/
      abou-bakari/     ← portraits REF + end frames générés
    maps/              ← images de carte réutilisables
    backgrounds/       ← fonds, décors réutilisables
```

---

## GeoAfrique — Abou Bakari II

### characters/abou-bakari/

| Fichier | Usage | Notes |
|---------|-------|-------|
| `abou-bakari-roi-plan-large-REF.png` | **SEED PRINCIPAL** — passer comme `Part.from_bytes()` dans Gemini | Plan large, tenue complète, fond sombre |
| `abou-bakari-roi-gros-plan-REF.png` | REF gros plan, variante validée | Même cohérence faciale |
| `abou-bakari-roi-cropped.png` | Start frame O3 nettoyé | Coins noirs (120px) — artefacts éliminés |
| `abou-bakari-roi-endframe-v1.png` | End frame gros plan (Beat04) | Gemini multimodal REF, regard horizon |
| `abou-bakari-westlook-v3.png` | End frame profil gauche (Beat02) | Kufi, regard horizon lointain, narratif exploration |
| `abou-bakari-frontal-v1.png` | Portrait frontal v1 | Généré session 2026-03-13 |

### Règle d'utilisation

- Toujours passer `abou-bakari-roi-plan-large-REF.png` comme image de référence Gemini
- Pour Nano Banana : utiliser `abou-bakari-roi-plan-large-REF.png` comme source
- Ne jamais générer Abou Bakari from scratch sans REF — dérive garantie (barbe, proportions, kufi)

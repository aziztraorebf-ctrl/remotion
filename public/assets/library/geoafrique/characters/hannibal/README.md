# Hannibal Barca — Asset Library

## Seed officiel (SOURCE DE VERITE)

**`hannibal-portrait-ref-v2.png`**
- Portrait plein corps, de face, neige en arriere-plan
- Style flat geometric minimaliste — palette menthe + navy + violet
- C'est l'esthetique validee utilisee dans les tests Kling

## Assets canoniques

| Fichier | Role | Notes |
|---------|------|-------|
| `hannibal-portrait-ref-v2.png` | Seed portrait | Plein corps, armure navy, cape violette, fond menthe, neige |
| `hannibal-soldier-type-REF.png` | Type soldat carthaginois | De dos, navy + violet, bouclier ovale, montagnes blanches |
| `hannibal-endframe-FINAL.png` | End frame valide | Hannibal de dos (cape violette) face a son armee, format paysage |

## Identite visuelle

- **Palette** : 3 couleurs dominantes seulement
  - Menthe/vert emeraude (#3ecaaa environ) — fond et atmosphere
  - Navy/bleu tres fonce (#1a2040 environ) — silhouettes soldats
  - Violet/pourpre (#5b2d8e environ) — cape et elements distinctifs d'Hannibal
- **Neige** : points blancs sur fond menthe, sol blanc/creme
- **Montagnes** : formes geometriques blanches plates — Alpes stylisees
- **Style** : flat graphic, zero degrades, formes geometriques simples
- **Hannibal distingue des soldats** : cape violette visible meme de dos

## Contexte narratif

Scene des Alpes — traversee hivernale. Neige, montagnes blanches, froid ambiant.
Le vert menthe et les points blancs evoquent une atmosphere froide et epique.

## Gotchas critiques

- **Style tres different des images "vivid"** : les fichiers `hannibal-vivid-portrait-REF.png` et `hannibal-army-endframe-REF.png` dans `hannibal test/` sont d'une esthetique completement differente (ambre/rouge/or). Ne pas les utiliser.
- **Seed = v2, pas v1** : `hannibal-portrait-ref-v1.png` existe dans `tmp/brainstorm/` mais v2 est la version retenue.
- **Cape violette = marqueur identitaire** : si le violet disparait, Hannibal devient indiscernable des soldats.

## Prompts Kling recommandes

### Prompt de style (a inclure dans tous les prompts)
```
flat geometric illustration style, minimal 3-color palette,
mint green background with white snow dots, navy blue soldier silhouettes,
purple/violet cape, white geometric mountain shapes (Alps), no gradients
```

### Pour les scenes avec Hannibal distinct
```
[scene description], Hannibal in foreground with distinctive purple cape,
surrounded by navy blue army silhouettes with oval shields and spears,
mint green sky, white Alpine mountain silhouettes, snow atmosphere
```

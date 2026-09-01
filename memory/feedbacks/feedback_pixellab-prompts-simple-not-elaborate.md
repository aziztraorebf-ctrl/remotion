# PixelLab prompts simples > élaborés (anti-whitewash)

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-04). Complète `archive/episodes-livres/mansa-moussa/PIXELLAB-WALK-PIPELINE.md`
> (qui montre des exemples de prompts courts sans expliciter la règle) avec le principe général et
> la comparaison qui l'a établi.

**Règle** : pour les phénotypes ethniques, utiliser des descripteurs **courts et directifs**, pas des paragraphes ethnographiques.

**Why** : PixelLab AI se noie quand le prompt mélange ethnographie historique précise + couleurs vêtements + équipement + posture. Sur un personnage nord-africain, un prompt écrit "North African Phoenician descent, olive Mediterranean skin tone with bronze undertone, Phoenician facial features distinct from European appearance" → résultat : peau européenne pâle. Le template humanoid par défaut "gagne" sur les descripteurs trop longs.

**Comparaison validée 2026-05-04** :

| Personnage | Prompt qui a marché | Résultat |
|-----------|--------------------|----------|
| Mansa Moussa | `dark skin, pixel art, side view` | Roi noir foncé propre |
| Guerrier malien | `dark skin, adult male, holding long spear` | Noir, propre |
| Sahélien voilé | `dark skin` | Brun foncé propre |
| **Hannibal v1 standard** | Paragraphe phénotype élaboré "North African Phoenician..." | **Blanc européen ❌** |
| **Hannibal v2 standard** | Idem v1 + "NOT European" + "olive bronze" | **Encore blanc ❌** |
| **Hannibal v3 pro** | Paragraphe + Phoenician + brown eyes... | **Échec API génération ❌** |

## How to apply

1. **Phénotype** : 2-3 mots maximum (`dark skin`, `dark olive skin`, `pale skin`, `light brown skin`)
2. **Apparence physique** : 1 ligne max (`black curly hair, black beard`, `bald, white beard`)
3. **Équipement** : descriptions courtes par item (pas de mini-essais)
4. **Style** : toujours mentionner `pixel art` à la fin
5. **Vue** : `side view` ou `front view`, jamais "side profile from low angle with dramatic lighting"

**Pattern type** :
```
[Role + époque], [phénotype 2-3 mots], [apparence physique 1 ligne],
[équipement liste courte], pixel art, [view]
```

**Anti-pattern** :
- Paragraphes ethnographiques précis ("Mediterranean phenotype with bronze undertone, distinct from European...")
- Descripteurs exclusifs négatifs ("NOT European, NOT subsaharan") — ça embrouille l'AI au lieu de la guider
- Détails historiques narratifs dans le prompt ("from long campaign", "Phoenician facial features")

**Stratégie batch quand phénotype est sensible** :
Lancer 2-3 variations de prompt en parallèle (crédits gratuits dans le tier standard PixelLab), comparer visuellement, garder le meilleur. Coût marginal vs précision visuelle.

**Choix éditorial assumé** :
Pour les phénotypes ambigus historiquement (Méditerranée antique, Carthage, Égypte), prendre une **direction éditoriale claire** — par ex. cohérence avec sprites déjà validés du même univers. Pas de quête de réalisme ethnographique parfait via prompt.

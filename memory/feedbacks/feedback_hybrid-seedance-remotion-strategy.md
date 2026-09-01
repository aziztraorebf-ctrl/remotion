# Hybride Seedance + Remotion pour moments de bascule narrative

> Migré depuis auto-memory 2026-08-31 (diagnostic 2026-04-13, épisode Soundjata désormais publié/archivé).
> Complète `memory/tools/seedance-rules.md` avec un pattern d'ARCHITECTURE (découpe Seedance/Remotion
> pur par shot) plutôt qu'un gotcha de prompt.

> Diagnostic 2026-04-13 pendant Soundjata Acte V Segment B (impact + défaite Soumaoro)

## Observation

Seedance 2.0 performe de façon inégale selon le type de scène :

| Type de scène | Qualité Seedance | Exemples validés |
|---------------|------------------|------------------|
| **Contemplative / narrative** (préparation, révélation, montage calme) | 9-9.5/10 | Soundjata Acte V Segment A, Thiaroye clip 1 |
| **Action chorégraphiée pure** (combat, charge) | 8.5-9.5/10 | Motion transfer Soundjata vs Soumaoro V2 |
| **Changement d'état narratif** (perte de pouvoir, retournement émotionnel critique) | 6-7/10 | Soundjata Acte V Segment B v3 (aura qui meurt mal rendue) |

## Pourquoi Seedance galère sur les changements d'état

1. **Modèle littéral** : Seedance voit des objets et des mouvements, pas des concepts narratifs. "Ses pouvoirs disparaissent" = abstrait, pas animable directement.
2. **Pas de causalité inter-shot** : Seedance anime bien *une* action par shot, mais pas une *chaîne causale* (impact → aura qui meurt → terreur)
3. **Conflit refs / narration** : la char ref d'un personnage a une aura. Seedance tend à *préserver* l'aura même quand la narration demande qu'elle s'éteigne.

## Solution hybride

Pour les Acts avec un moment de bascule narrative crucial :

**Découper le Segment en 2 parties** :
- **Partie Seedance** : l'action physique préalable (tir, coup, charge) — Seedance excelle
- **Partie Remotion pur** : le changement d'état (aura qui s'estompe par opacity+hue, blessure qui apparait par mask, expression qui change via image Gemini + panning)

**Exemple concret Soundjata Acte V Segment B** :
- **B1 Seedance** (6s) : POV Soundjata tire + flèche en vol + IMPACT sur Soumaoro
- **B2 Remotion pur** (6s) : image Gemini Soumaoro blessé + Soumaoro silhouette qui s'éloigne dans la poussière + aura qui fade-out via `interpolate()` + wisps SVG animés

## Avantages de cette architecture

- **Contrôle frame-précis** des transitions d'état narratives critiques
- **Alignement parfait** sur la narration (ex: aura qui meurt pile sur "ses pouvoirs disparaissent")
- **Coût réduit** : Remotion pur = $0 (juste 1 image Gemini à $0.10 vs régen Seedance à $3.63)
- **Reproductible** pour tous les Shorts avec des moments de bascule narrative (retournements, défaites, révélations)

## Quand NE PAS utiliser cette hybride

- Scène d'action pure sans tournant narratif (ex: combat Motion Reference Transfer Kirina duel)
- Scène contemplative continue (ex: Segment A Soundjata)
- Scène de dialogue (Seedance gère le lip sync)

## Pattern Remotion à réutiliser

Pour faire un "moment de défaite" en Remotion pur :
- Image Gemini du perso dans sa pose finale/blessée
- Couche aura : SVG wisps + `interpolate(frame, [0, N], [1, 0])` sur opacity pour extinction
- Couche particules (poussière, embers) : SVG path + `evolvePath` ou simple interpolate
- Camera : léger pull-back `transform: scale()` + `translateY` pour effet "il s'éloigne"
- Overlay narration à volume normal + pas d'audio Seedance parasite

---
name: recherche-templates-obligatoire-avant-code
description: NON-NEGOTIABLE — Avant de coder tout beat/scène Mapbox ou Remotion, Claude DOIT chercher dans les catalogues de templates existants. Évite les itérations inutiles.
metadata:
  type: feedback
---

## Règle : RECHERCHE TEMPLATES AVANT TOUT CODE (NON-NEGOTIABLE)

Avant d'écrire UNE LIGNE de code pour un beat/scène, Claude DOIT faire une recherche systématique dans nos catalogues de templates et présenter ce qu'il a trouvé.

**Why:** Session 2026-06-02 — on a fait 18 itérations sur Beat 1 Phosphate. La solution (FlagFill = projeter les drapeaux dans les silhouettes) existait DÉJÀ dans nos templates (`MapboxFlagFill`, `SequentialFlagReveal`). C'est Aziz qui s'en est souvenu, pas Claude. Claude a la capacité de scanner les catalogues en une fraction de seconde — il ne le faisait pas systématiquement. Résultat : perte de temps massive + frustration Aziz.

**Le problème de fond :** Aziz ne peut pas mémoriser tous les templates (il y en a 70+ composants, 17 templates carte vivante, 40+ Gemini). Claude le peut. C'est précisément le travail de Claude de chercher AVANT, pas d'attendre qu'Aziz se souvienne.

## How to apply — Procédure obligatoire AVANT de coder un beat

1. **Identifier le besoin narratif** : "Ce beat doit montrer X" (ex: phosphate qui voyage Maroc→Europe)
2. **Scanner les catalogues pertinents** (lire les fichiers, pas deviner) :
   - Mapbox : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` (17 templates)
   - Composants : `src/projects/_shared/COMPOSANTS-INDEX.md` (71 composants par cas d'usage)
   - Point d'entrée maître : `src/projects/_shared/INDEX-DES-INDEX.md`
   - Gemini data-viz : `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+ templates)
3. **Présenter à Aziz** : "Pour ce beat, voici ce qu'on a déjà : [template A] fait X, [template B] fait Y. Je propose d'utiliser [choix] parce que [raison]. Alternative : [autre]."
4. **PUIS** coder en assemblant les templates trouvés, pas from scratch.

## Format de présentation (obligatoire)

```
Recherche templates pour [besoin] :
- [Template X] (catalogue Y) — fait [quoi] — pertinent car [raison]
- [Template Z] — fait [quoi] — alternative
Recommandation : [choix] car [raison narrative].
```

## Anti-pattern proscrit

❌ Coder directement un effet custom sans avoir vérifié qu'un template existe
❌ Attendre qu'Aziz se souvienne d'un template
❌ "Je vais créer une nouvelle solution" sans avoir scanné l'existant

## Templates FlagFill découverts (à ne plus jamais oublier)

- `MapboxFlagFill` — drapeau/image clippé dans silhouette pays + bichromie
- `SequentialFlagReveal` — pays s'allument avec drapeau en séquence
- `FiberOpticFlagInvade` — frontière laser puis drapeau envahit
- 2 templates FlagFill validés 2026-06-02 : voir `feedback_flagfill-templates-decouverte.md`

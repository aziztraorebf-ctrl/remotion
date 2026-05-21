# Kurzgesagt — Summary scouting (anti-modèle utile)

Vidéos analysées :
1. **Is The World Getting More Violent?** (reSfF60-2S4) — géopolitique data-driven
2. **How to Win an Interstellar War** (tybKnGZRwcU) — SF spéculative récente

Frames : 5/vidéo, 1/30s (V1) et 1/45s (V2). Ratio live/motion : **0% live / 100% motion vectoriel**.

## Verdict global : 🟡 anti-modèle, mais 2 leçons système-couleur reproductibles

Kurzgesagt n'est PAS notre style (illustration vectorielle propriétaire, mascotte, ton optimiste-explainer). MAIS leur architecture couleur/asset est un cas d'école pour comprendre comment maintenir une identité forte sur des sujets radicalement différents.

## Verdicts par axe

| Axe | Verdict | Raison |
|---|---|---|
| Palette | 🟢 | Système 3-niveaux exemplaire, transposable conceptuellement à Souverain |
| Assets | 🟢 (concept) / 🔴 (exécution) | Logique color-block réutilisable, illustrations elles-mêmes non-reproductibles |
| Caméra | 🟡 | Discipline "calme = autorité" alignée Souverain, mais peu de patterns spécifiques à voler |

## Leçons sur la cohérence d'identité (Kurzgesagt comme étude de cas, pas modèle direct)

### Leçon 1 — La palette signale la NATURE du sujet, pas seulement l'humeur
- Vidéo conflits réels (V1) : palette dominante violet + scènes contextuelles **désaturées** + accents pure-sat **réservés à la data**.
- Vidéo SF imaginaire (V2) : palette saturée partout, multi-hue libre.
- **Implication Souverain** : nos sujets sont réels et graves → discipline V1. Désaturer les scènes terrain (cartes, contextes), réserver la pure saturation (rouge sang, or, vert flag) aux **chiffres et marqueurs narratifs**. C'est ce qui donnerait à nos templates B/E (Carto Caspian, PolyMatter rouge) une cohérence croisée.

### Leçon 2 — La signature = 3 éléments fixes répétés cross-vidéos
Identifiés chez Kurzgesagt :
- **Background couleur signature** (violet `#1F1147` → `#2B0F4A`).
- **Pastille numéro chapitre** (cercle violet + chiffre blanc) — wayfinding récurrent.
- **Ribbon titre coloré** (orange `#D88A1E` chez V1) — pose le sujet.

**Implication Souverain** : nos templates A/B/C/D ont chacun leur identité, mais aucun élément persistant cross-templates ne signale "c'est Souverain". Proposer un **wayfinder unique** (ex: micro-pastille verte panafricaine + numéro acte en bas-droite, présente sur les 4 templates) pour éviter la fragmentation perçue.

### Leçon 3 — Asset = strates color-block pures, jamais dégradés
Tous leurs assets (personnage pilule, vaisseau, building) suivent la règle : **3-4 zones pures juxtaposées sans dégradé**, ombre soft optionnelle. C'est ce qui rend leur prod scalable et reconnaissable.
**Implication Souverain** : pour nos pictos Gemini i2i (drapeaux, ressources, leaders), formaliser une **règle de prompt "flat color-block 3-4 zones, no gradient, single soft drop-shadow"** — donnerait à nos icônes une famille visible, indépendamment du template hôte.

## Ce qu'on NE prend PAS
- Mascotte / personnage récurrent (incompatible ton Souverain).
- Optimisme post-générique (ton sérieux/critique chez nous).
- Assets vectoriels propriétaires (impossible à reproduire).
- Animation 24fps frame-by-frame (pipeline Remotion + i2i ≠ animation traditionnelle).

## Top 3 actions concrètes (pas backlog)
1. **Documenter règle "saturation = donnée, désaturation = contexte"** dans `memory/rules-souverain-editorial.md` — applicable immédiatement Niger/épisodes futurs.
2. **Tester wayfinder cross-templates** (pastille numéro acte) sur prochain épisode Souverain pour valider continuité perçue A→B→C→D.
3. **Formaliser prompt-template Gemini "3-4 strate color-block + soft shadow"** dans `memory/tools/gemini.md` — uniformiser la famille de pictos.

## Chemin
`memory/templates-research/scouting/par-chaine/kurzgesagt/_summary.md`

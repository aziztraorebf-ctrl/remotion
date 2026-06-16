# Zimbabwe Lithium — Dettes techniques découvertes (2026-05-13)

> Document de session. Si on reprend Zimbabwe, lire AVANT de toucher quoi que ce soit.
> Cette dette a été découverte en préparant Beat 3 et en croisant `timing.ts` avec l'alignment audio réel.

---

## Diagnostic — Pourquoi rien ne marchait vraiment

src/projects/souverain/zimbabwe-lithium/timing.ts a été généré à un moment où l'audio n'était pas finalisé (ou avec un script de découpe automatique mal calibré). Les **bornes BEATS** sont décalées par rapport à la narration audio réelle. Chaque beat a ensuite été codé isolément avec ses propres pivots audio (qui eux sont corrects parce qu'extraits a posteriori), donc visuellement chaque beat fonctionne **en isolation** — mais leur position dans la timeline globale est fausse.

**Résultat observé** : Beat 5 layout cassé, sensation que "ça ne tient pas" sans pouvoir mettre le doigt dessus.

---

## La vérité audio (alignment narration-zimbabwe-v1-alignment.json)

| Beat | Phrase d'ouverture | Fenêtre RÉELLE (frames @30fps) | Durée |
|---|---|---|---|
| 1 hook | "Un pays de seize millions..." | f2 → f269 | 8.9s |
| 2 tension | "Le Zimbabwe. L'un des quatre premiers producteurs..." | f270 → f1007 | 24.6s |
| 3 catalyseur | "Le gouvernement découvre..." | f1008 → f1633 | 20.8s |
| 4 transition | "Le Zimbabwe a gagné sa bataille industrielle. Mais à quel prix ?" | f1634 → f1796 | 5.4s |
| 5 démonstration | "Deux mois plus tard..." | f1797 → f2332 | 17.8s |
| 6 question | "Le Zimbabwe a forcé... Qui a vraiment gagné ?" | f2333 → f2582 | 8.3s |

## Ce que `timing.ts BEATS` dit actuellement (FAUX sauf hook)

| Beat | Actuel | Décalage |
|---|---|---|
| hook | f0 → f269 | ✅ OK |
| tension | f269 → f596 | ❌ Manque 411 frames (14s "minerai brut → batterie ×15") |
| catalyseur | f596 → f1007 | ❌ Couvre en fait la fin de Beat 2 narratif, pas le Beat 3 |
| transition | f1007 → f1164 | ❌ Démarre 627 frames trop tôt |
| demonstration | f1164 → f1633 | ❌ Couvre Beat 3 + Beat 4 narratifs, pas Beat 5 |
| question | f1633 → f2582 | ❌ Démarre 700 frames trop tôt (couvre Beat 4 + 5 + 6) |

## Ce qui est correct dans `timing.ts`

- `AUDIO_SEGMENTS` (mots-pivots `beat3Gouvernement`, `beat3Shanghai`, etc.) sont **corrects** — calés sur l'alignment réel
- `TOTAL_FRAMES = 2582` correspond à la durée audio réelle
- `FPS = 30` correct
- Constantes CTA correctes

---

## Plan de réparation (si on reprend)

### Étape 1 — Corriger `BEATS` dans timing.ts

```typescript
export const BEATS = {
  hook:          { startFrame: 0,    endFrame: 269,  startS: 0,     endS: 8.98  },
  tension:       { startFrame: 269,  endFrame: 1007, startS: 8.98,  endS: 33.58 },
  catalyseur:    { startFrame: 1007, endFrame: 1633, startS: 33.58, endS: 54.44 },
  transition:    { startFrame: 1633, endFrame: 1796, startS: 54.44, endS: 59.87 },
  demonstration: { startFrame: 1796, endFrame: 2332, startS: 59.87, endS: 77.73 },
  question:      { startFrame: 2332, endFrame: 2582, startS: 77.73, endS: 86.08 },
} as const;
```

Mettre aussi à jour les commentaires de phrase narrative au-dessus de chaque entrée.

### Étape 2 — Vérifier l'impact sur Beat1, Beat2, Beat4, Beat5, Beat6

| Fichier | Durée actuelle (faux) | Durée corrigée (vraie) | Action |
|---|---|---|---|
| Beat1Hook.tsx | 269f | 269f | Aucune — OK |
| Beat2Tension.tsx | 327f | **738f** | **Animer 411f supplémentaires** (la narration "minerai brut → ×15" doit être visualisée) |
| Beat3 | n'existe pas | **625f** | À coder from scratch sur storyboard v6 |
| Beat4Transition.tsx | 157f | 162f | ≈ identique, vérifier que F_MAP_DRAW/F_MAP_PULSE/F_QUESTION sont bien dans la fenêtre |
| Beat5Demonstration.tsx | 469f | 536f | **Animer 67f supplémentaires** ou tenir avec freeze final |
| Beat6Question.tsx | 949f | **250f** | **GROS RETRÉCISSEMENT** — toute animation au-delà de f250 sera tronquée. Soit le composant est court (probable, 74 lignes), soit il faut couper |

### Étape 3 — Vérifier visuellement chaque beat dans Remotion Studio

Après correction `timing.ts`, scroller le timeline complet. Chaque beat doit :
- Démarrer pile sur le premier mot de sa phrase d'ouverture
- Tenir sans écran statique pendant toute sa fenêtre
- Ne pas être tronqué par la sequence suivante

### Étape 4 — Coder Beat 3 (n'existe pas encore)

Storyboard validé : `assets/storyboard-v6/beat3-catalyseur.png`
Pattern carte : `applyCartoCaspian(map, CASPIAN_NOIR)` (composant partagé `_shared/mapbox/templates/CartoCaspian.tsx`)
Référence d'implémentation : Niger `Beat6Climax` (NigerUraniumShort.tsx ligne 1857+)

Approche A validée par Aziz :
- CartoCaspian NOIR vue mondiale
- Chine highlight rouge (#C62828) via Mapbox layer GeoJSON
- Zimbabwe highlight or via Mapbox layer GeoJSON
- Ligne pleine or Zimbabwe → océan Indien (SVG overlay)
- Point rouge pulsant à l'interruption (SVG overlay + permanent glow)
- Ligne pointillée → Chine (SVG overlay)
- "+10%" rouge centré (CSS text, scale-pop)
- Pill SHANGHAI · 24H (CSS, slide-from-left)

Pivots audio à utiliser (déjà corrects dans timing.ts) :
- `beat3Gouvernement` f1009 — apparition carte + Zimbabwe highlight
- `beat3MoinsTaxes` f1179 — pas utilisé dans storyboard v6 (skip)
- `beat3Interdit` f1242 — apparition point rouge + ligne dashed
- `beat3Shanghai` f1542 — apparition "+10%" + pill Shanghai

Beat 3 démarre maintenant à f1007 (corrigé) au lieu de f596. Les frames locales du composant doivent donc être calculées relativement à f1007.

### Étape 5 — Ne PAS suivre `assets/breakdown/beat3_breakdown.json`

Le JSON dit "Mapbox Mercator centré océan Indien". La décision lockée est `CartoCaspian NOIR`. Le storyboard v6 prime sur le breakdown JSON.

---

## Décision globale en attente

Trois options pour la suite Zimbabwe :

1. **Payer la dette en bloc** — corriger timing.ts + reviser Beat2/5/6 + coder Beat3 (estimation : 4-6h focus)
2. **Archiver** — Zimbabwe ne se publie pas, pas grave, on passe à un autre épisode
3. **Recommencer à partir de l'audio** — refaire timing.ts proprement avec un script `python` qui lit l'alignment + ajuster Beat2/5/6 pour utiliser les bonnes fenêtres

Ma recommandation si on reprend : **option 1**, mais en commençant par valider que Beat 1 reste OK (il l'est), puis Beat 2 (étendre l'animation), puis Beat 4 (vérifier), puis Beat 3 (coder), puis Beat 5 (étendre), puis Beat 6 (vérifier qu'il tient en 250f).

---

## Leçon pour les futurs projets Souverain

**Avant de coder le moindre beat d'un nouveau projet** :

1. Vérifier que `BEATS` dans `timing.ts` matche la narration réelle — script Python qui lit l'alignment et vérifie chaque borne
2. Locker `timing.ts` par signature/hash après validation
3. Avoir un **manifest visuel par beat** (qui anime quoi, à quel moment, sur quel mot) AVANT de coder
4. Sans manifest validé, ne pas coder

C'est exactement la philosophie que les agents doivent appliquer — et que toi-même devrais appliquer sur tes futurs projets pour éviter ce genre de drift silencieux.

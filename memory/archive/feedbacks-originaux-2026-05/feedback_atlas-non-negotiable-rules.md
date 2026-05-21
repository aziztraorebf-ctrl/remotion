---
name: "Atlas — règles non-négociables (anti-fiasco Shaka Zulu / Beat 1 Ghana)"
description: "13 règles absolues pour toute production format Atlas. Violation = STOP, retour planche à dessin. Issues directement de l'audit Beat 1 Ghana 2026-05-03."
type: feedback
---

# Atlas — Règles non-négociables (NON-NEGOTIABLE)

> Ces règles sont issues d'erreurs réelles : Shaka Zulu (pause stratégique forcée), Beat 1 Empire du Ghana v1/v2 (zoom raté, données géo approximées sans vérif, Lottie trop pauvre, scène statique 10s).
>
> **Toute violation = STOP. Demander à Aziz comment procéder. Jamais "passer outre".**

---

## RÈGLE 1 — Fork avant reconstruire (la plus importante)

**INTERDIT** d'écrire un nouveau composant/scène Atlas si un équivalent existe dans Mansa Moussa V2.

**Workflow obligatoire avant toute scène Atlas** :
1. Lire `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
2. Lire les composants `_shared/atlas-components.tsx`
3. Si un composant équivalent existe → l'utiliser tel quel ou le forker dans `_shared/`
4. Si nouveau besoin → l'ajouter dans `_shared/` avec doc, JAMAIS dans le dossier épisode

**Why** : Beat 1 Ghana v1+v2 ont reconstruit du transform SVG à la main alors que `AtlasMercator` avec `scale/driftX/centerOffsetX/Y/rotation` faisait exactement ce qu'il fallait. Résultat : zoom centré au mauvais endroit, double scaling, bloc noir.

**How to apply** : avant chaque scène, lister les composants Mansa Moussa pertinents. Si tentation de "juste écrire ce petit truc à la main", STOP.

---

## RÈGLE 2 — SVG racine unique 720×1280 avec preserveAspectRatio

**OBLIGATOIRE** : une scène Atlas = UN SEUL `<svg viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice">`. Toutes les couches sont des `<g>` à l'intérieur.

```tsx
<svg
  viewBox="0 0 720 1280"
  preserveAspectRatio="xMidYMid slice"
  style={{ width: "100%", height: "100%", display: "block" }}
>
  <AtlasDefs />
  {/* Toutes les couches en <g> */}
</svg>
```

**INTERDIT** :
- Multiples `<svg>` imbriqués
- Mélange d'unités (720×1280 + width/height de useVideoConfig)
- Wrappers HTML `<AbsoluteFill>` qui contiennent chacun leur SVG

**Why** : c'est le pattern Mansa Moussa V2 (validé). Ça évite tous les problèmes de double-scaling. Beat 1 v2 mélangeait 720×1280 et 1080×1920 → bug.

**How to apply** : si tu as 2 `<svg>` ou plus dans une scène, c'est un bug d'architecture.

---

## RÈGLE 3 — Caméra via props AtlasMercator UNIQUEMENT

**INTERDIT** d'écrire à la main le transform de la carte. Toujours passer par les props :

```tsx
<AtlasMercator
  countries={data}
  scale={camScale}
  driftX={driftX}
  driftY={driftY}
  centerOffsetX={camOffX}
  centerOffsetY={camOffY}
  rotation={rotationDeg}
/>
```

Pour zoomer sur un point précis :
```tsx
const targetX = poi.x;     // coord SVG (sur 720 width)
const targetY = poi.y;     // coord SVG (sur 1280 height)
const camOffX = (targetX - 360) * snapStrength;  // 0.65 marche bien
const camOffY = (targetY - 640) * snapStrength;
```

**Why** : la formule de transform est complexe et mauvaise quand écrite à la main. AtlasMercator a déjà l'ordre correct `translate→rotate→scale→translate-back`.

**How to apply** : si tu écris `<g transform="...">` autour d'AtlasMercator pour le repositionner, c'est faux.

---

## RÈGLE 4 — Vérification géographique systématique avant de coder

**INTERDIT** d'utiliser des données géo (POI lat/lon, polygone empire, routes) sans avoir VÉRIFIÉ :

- POI capitale → coordonnées Wikipedia exactes
- Polygone empire → croisé avec sources historiques (Wikipedia, Britannica, Euratlas)
- Routes commerciales → plausibilité historique vérifiée

**Workflow obligatoire** :
1. Avant d'utiliser n'importe quel champ de `data/geo/*-data.json`, lancer un agent général-purpose qui vérifie les coordonnées vs sources académiques
2. Documenter les écarts dans `memory/episodes/<projet>/AUDIT-GEO.md`
3. Si écart >50 km sur un POI critique → corriger AVANT de coder

**Why** : Empire Ghana avait Koumbi Saleh décalé de 60 km, Taghaza de 115 km, et un polygone Wagadou octogonal grossier qu'aucune source n'aurait validé. Si Aziz n'avait pas demandé, on aurait publié.

**How to apply** : la première todo de tout projet Atlas est "vérifier données géo". Pas la dernière.

---

## RÈGLE 5 — Lottie pour primitives géométriques UNIQUEMENT

**INTERDIT** d'utiliser Lottie pour représenter un objet réel (lingot, sceau, balance). Le rendu sera systématiquement décevant car limité aux primitives géométriques (~10 vertices max).

**Lottie OK** :
- Ring pulse (cercle qui s'étend)
- Halo, glow
- Compteur abstrait
- Pulse marker

**Lottie KO** :
- Lingot d'or (utiliser PixelLab)
- Sceau royal (PixelLab)
- Balance commerciale (PixelLab ou Gemini)
- Drapeau (SVG pattern dédié)
- Personnage (PixelLab)

**Why** : Beat 1 v2 avait un Lottie "lingot" qui ressemblait à un trapèze géométrique. Indéfendable.

**How to apply** : avant de générer un Lottie, te demander "ressemble-t-il à l'objet réel ou à une icône ?". Si réel → PixelLab.

---

## RÈGLE 6 — Sous-titres karaoke OBLIGATOIRES dans toute scène Atlas

Toute scène avec narration DOIT inclure le composant `<AtlasV2Subtitles />` (ou équivalent forké). Pas optionnel.

**Why** : Mansa Moussa V2 a des sous-titres karaoke en permanence. Beat 1 Ghana v1+v2 les ont oubliés. Ça change radicalement la perception (moins fade, plus pro, accessible).

**How to apply** : checklist pre-render = "sous-titres karaoke présents et synchronisés ? ✓"

---

## RÈGLE 7 — Inserts plein écran pour data viz, JAMAIS overlays carte

Quand on présente un chiffre choc, une comparaison, ou un objet symbolique → **bascule vers un insert plein écran** (fond noir étoilé + dataviz centré).

**INTERDIT** : poser un mini-objet à droite de la carte (le lingot Beat 1 v2). Ça paraît bricolé.

**Pattern Mansa Moussa V2** :
- Scène carte → wipe → insert plein écran 4-6s → wipe → retour scène carte
- Inserts dédiés : `AtlasV2InsertPieChart`, `AtlasV2InsertBarChart`, `AtlasV2InsertLineChart`

**How to apply** : si une donnée mérite d'être vue, elle mérite un insert plein écran. Sinon elle ne mérite pas d'être visualisée.

---

## RÈGLE 8 — Mouvement permanent (jamais de scène statique > 2s)

**INTERDIT** : scène carte avec aucun changement visuel pendant > 2 secondes.

Sources de mouvement obligatoires (au moins 2 simultanées) :
1. Drift Ken Burns continu (`sin/cos`) sur la caméra
2. Tilt respiratoire sur skewX
3. Pulse marker sur lieu clé
4. Apparition/disparition cartouches/labels au rythme de la narration
5. Pan caméra entre 2 points
6. Zoom continu (push-in lent)

**Beat 1 Ghana v1 violait ça** : 13 secondes de carte statique avec juste un highlight. Mortel.

**Why** : format viral = jamais ennuyeux. Un spectateur scroll si rien ne bouge.

**How to apply** : checklist pre-render = "y a-t-il un changement visuel significatif toutes les 2s ?". Sinon ajouter pulse, label, mouvement.

---

## RÈGLE 9 — Validation visuelle Claude AVANT Aziz

**INTERDIT** de présenter un render à Aziz sans l'avoir analysé soi-même via Read tool.

Avant de dire "voici le render" :
1. Read l'image/vidéo → identifier les défauts visibles
2. Si défaut détecté → corriger AVANT de présenter
3. Si défaut acceptable → le mentionner dans le message

**Why** : Beat 1 v2 avait un bloc noir évident en bas d'écran. Si Claude avait regardé, il l'aurait vu et corrigé avant.

**How to apply** : règle Read tool sur tout fichier image/vidéo généré, avant tout message.

---

## RÈGLE 10 — TECHNIQUE forker / VISUEL adapter

Séparation stricte (voir `feedback_atlas-technique-vs-visuel.md`) :

**TECHNIQUE (à forker tel quel de Mansa Moussa V2)** :
- Architecture SVG racine
- Composants `_shared/` (AtlasMercator, AtlasGlobe, AtlasCartouche, AtlasLabel, AtlasPulseMarker, AtlasCaravane, AtlasEmpire, AtlasDefs, useSpringCamera)
- Patterns timing (spring configs, interpolate ranges)
- Sous-titres karaoke (Subtitles)
- Inserts plein écran (structure)
- Caméra (Ken Burns, tilt respiratoire, snap spring)

**VISUEL (à adapter par épisode)** :
- Palette (GHANA_PALETTE pour Empire du Ghana, palette Shaka pour Shaka, etc.)
- Décoration cartouches (couleurs fond/bordure, mais structure rect+texte+sous-texte conservée)
- Hachures empire (couleurs adaptées au sujet)
- Typo accents
- Iconographie (PixelLab assets propres au sujet)
- Background couleur (peut s'éloigner du dégradé Mansa)

**Why** : éviter contenu répétitif sur les plateformes (chaque vidéo doit avoir une identité visuelle propre) tout en gardant la solidité technique.

---

## RÈGLE 11 — Render local validation après chaque modif majeure

Toute modification d'une scène = mini-render isolé immédiat. Pas accumulation de modifs sans test visuel.

**Why** : impossible de débugger un render qui mélange 4 modifs.

**How to apply** : après chaque modif significative, `npx remotion render <Composition> out/<projet>/<scene>-<n>.mp4 --concurrency=2` puis Read.

---

## RÈGLE 12 — Cleanup renders après validation

Dès qu'Aziz valide une version, supprimer toutes les versions de test. Une seule vérité dans `out/`.

(Voir `feedback_cleanup-renders-apres-validation.md`).

---

## RÈGLE 13 — Pas de "approximation discrète" sur le format Atlas

Le format Atlas porte l'autorité géographique. **AUCUNE approximation acceptable sans déclaration explicite à Aziz**.

**INTERDIT** :
- Dessiner un polygone empire à la main "ça ressemble"
- Inventer des coordonnées POI
- Tracer une route commerciale "qui semble plausible"
- Utiliser une date approximative sans source

**Si approximation inévitable** : 
1. Le déclarer à Aziz AVANT de coder
2. Documenter dans `AUDIT-GEO.md` du projet
3. Considérer un disclaimer scénique discret ("frontières approximatives, XIIe siècle")

**Why** : chaîne Atlas vise spectateurs avertis. Une approximation vue = perte de crédibilité immédiate.

---

## Checklist pre-coding scène Atlas (à exécuter à chaque scène)

```
[ ] J'ai lu ATLAS-COMPOSANTS.md
[ ] J'ai vérifié les coords POI et le polygone empire vs Wikipedia
[ ] J'ai listé les composants _shared à utiliser (pas de réécriture)
[ ] J'utilise un seul SVG racine 720×1280 preserveAspectRatio
[ ] Caméra via props AtlasMercator, jamais transform manuel
[ ] Sous-titres karaoke prévus
[ ] Au moins 2 sources de mouvement simultanées (pulse, drift, label, etc.)
[ ] Aucune scène statique > 2s
[ ] Pour data viz/objet symbolique : insert plein écran prévu (pas overlay)
[ ] Lingot/sceau/objet réel = PixelLab, pas Lottie
[ ] Plan de mini-render après chaque modif majeure
```

Si une case n'est pas cochée → ne pas coder, refléchir.
